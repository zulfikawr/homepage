import { getOptionalRequestContext } from '@cloudflare/next-on-pages';

interface D1HttpMeta {
  [key: string]: unknown;
  duration: number;
  rows_read: number;
  rows_written: number;
  last_row_id: number;
  changed_db: boolean;
  size_after: number;
  changes: number;
}

interface D1HttpResult {
  results: Record<string, unknown>[];
  meta: D1HttpMeta;
}

interface D1HttpError {
  message: string;
  code?: number;
}

interface D1HttpResultGroup {
  results: Record<string, unknown>[];
  meta: D1HttpMeta;
}

interface D1HttpResponse {
  success: boolean;
  result: D1HttpResultGroup[];
  errors?: D1HttpError[];
  messages?: string[];
}

/**
 * A type-safe D1 shim that uses the Cloudflare HTTP API.
 */
class HTTPD1Database implements D1Database {
  constructor(
    private accountId: string,
    private databaseId: string,
    private apiToken: string,
  ) {}

  prepare(query: string): D1PreparedStatement {
    return this.createPreparedStatement(query, []);
  }

  private createPreparedStatement(
    query: string,
    args: unknown[],
  ): D1PreparedStatement {
    return {
      bind: (...values: unknown[]): D1PreparedStatement => {
        return this.createPreparedStatement(query, [...args, ...values]);
      },
      first: async <T = unknown>(column?: string): Promise<T | null> => {
        const { results } = await this.execute(query, args);
        const row = results[0] as Record<string, unknown> | undefined;
        if (!row) return null;
        return (column ? (row[column] as T) : (row as T)) || null;
      },
      run: async (): Promise<D1Response> => {
        const result = await this.execute(query, args);
        return {
          success: true,
          meta: result.meta,
        };
      },
      all: async <T = unknown>(): Promise<D1Result<T>> => {
        const result = await this.execute(query, args);
        return {
          success: true,
          results: result.results as T[],
          meta: result.meta,
        };
      },
      raw: async <T = unknown>(): Promise<T[]> => {
        const { results } = await this.execute(query, args);
        return results.map((row) => Object.values(row as object) as T);
      },
    } as D1PreparedStatement;
  }

  async dump(): Promise<ArrayBuffer> {
    throw new Error('Dump not supported over HTTP');
  }

  async batch<T = unknown>(): Promise<D1Result<T>[]> {
    throw new Error('Batch not supported over HTTP yet');
  }

  async exec(query: string): Promise<D1ExecResult> {
    const result = await this.execute(query, []);
    return {
      count: result.meta.rows_written,
      duration: result.meta.duration,
    };
  }

  withSession(constraintOrBookmark?: string): D1DatabaseSession {
    return new HTTPD1DatabaseSession(
      this.accountId,
      this.databaseId,
      this.apiToken,
      constraintOrBookmark,
    );
  }

  private async execute(sql: string, params: unknown[]): Promise<D1HttpResult> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    });

    const data = (await response.json()) as D1HttpResponse;

    if (!response.ok || !data.success) {
      const errorMsg = data.errors?.[0]?.message || response.statusText;
      throw new Error(`D1 HTTP API Error: ${errorMsg}`);
    }
    return data.result[0];
  }
}

/**
 * Minimal implementation of D1DatabaseSession for the shim.
 */
class HTTPD1DatabaseSession
  extends HTTPD1Database
  implements D1DatabaseSession
{
  constructor(
    accountId: string,
    databaseId: string,
    apiToken: string,
    private bookmark?: string,
  ) {
    super(accountId, databaseId, apiToken);
  }

  getBookmark(): string | undefined {
    return this.bookmark;
  }
}

export function getDB(): D1Database {
  let context;
  try {
    context = getOptionalRequestContext();
  } catch {
    // Not in Edge runtime, ignore and use fallback
  }
  const env = context?.env as CloudflareEnv | undefined;

  if (env?.DB) return env.DB;

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_D1_API_TOKEN;

  if (accountId && databaseId && apiToken) {
    return new HTTPD1Database(accountId, databaseId, apiToken);
  }

  console.warn(
    '[Cloudflare] D1 Database binding (DB) and HTTP fallback env vars not found.',
  );
  return undefined as unknown as D1Database;
}

export function getBucket(): R2Bucket {
  let context;
  try {
    context = getOptionalRequestContext();
  } catch {
    // Not in Edge runtime, ignore
  }
  const env =
    (context?.env as CloudflareEnv | undefined) ||
    (process.env as unknown as CloudflareEnv);

  if (env?.BUCKET) return env.BUCKET;

  return undefined as unknown as R2Bucket;
}
