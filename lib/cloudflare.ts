import { getCloudflareContext } from '@opennextjs/cloudflare';

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

/**
 * HTTP-based R2 Bucket implementation using Cloudflare API
 */
class HTTPR2Bucket implements Partial<R2Bucket> {
  constructor(
    private accountId: string,
    private bucketName: string,
    private apiToken: string,
  ) {}

  async put(
    key: string,
    value:
      | ReadableStream
      | ArrayBuffer
      | ArrayBufferView
      | string
      | null
      | Blob,
    options?: R2PutOptions,
  ): Promise<R2Object> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/r2/buckets/${this.bucketName}/objects/${key}`;

    let body: BodyInit;
    if (value instanceof ArrayBuffer) {
      body = value;
    } else if (ArrayBuffer.isView(value)) {
      body = value.buffer as ArrayBuffer;
    } else if (typeof value === 'string') {
      body = value;
    } else if (value instanceof Blob) {
      body = value;
    } else if (value instanceof ReadableStream) {
      const reader = value.getReader();
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        chunks.push(chunk);
      }
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }
      body = result.buffer;
    } else {
      body = '';
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiToken}`,
    };

    if (options?.httpMetadata && 'contentType' in options.httpMetadata) {
      headers['Content-Type'] = options.httpMetadata.contentType;
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`R2 HTTP API Error: ${response.statusText} - ${text}`);
    }

    return {
      key,
      version: Date.now().toString(),
      size: body instanceof ArrayBuffer ? body.byteLength : 0,
      etag: '',
      httpEtag: '',
      checksums: { toJSON: () => ({}) },
      uploaded: new Date(),
      httpMetadata: options?.httpMetadata || {},
      customMetadata: options?.customMetadata || {},
      storageClass: 'STANDARD',
      writeHttpMetadata: async () => {},
    } as R2Object;
  }

  async get(key: string): Promise<R2ObjectBody | null> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/r2/buckets/${this.bucketName}/objects/${key}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    });

    if (response.status === 404) return null;
    if (!response.ok)
      throw new Error(`R2 HTTP API Error: ${response.statusText}`);

    const arrayBuffer = await response.arrayBuffer();

    return {
      key,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array(arrayBuffer));
          controller.close();
        },
      }),
      arrayBuffer: async () => arrayBuffer,
      text: async () => new TextDecoder().decode(arrayBuffer),
      json: async () => JSON.parse(new TextDecoder().decode(arrayBuffer)),
      blob: async () => new Blob([arrayBuffer]),
    } as R2ObjectBody;
  }

  async head(key: string): Promise<R2Object | null> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/r2/buckets/${this.bucketName}/objects/${key}`;

    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    });

    if (response.status === 404) return null;
    if (!response.ok)
      throw new Error(`R2 HTTP API Error: ${response.statusText}`);

    return {
      key,
      size: parseInt(response.headers.get('content-length') || '0'),
    } as R2Object;
  }

  async delete(keys: string | string[]): Promise<void> {
    const keysArray = Array.isArray(keys) ? keys : [keys];

    for (const key of keysArray) {
      const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/r2/buckets/${this.bucketName}/objects/${key}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      });

      if (!response.ok && response.status !== 404) {
        throw new Error(`R2 HTTP API Error: ${response.statusText}`);
      }
    }
  }

  async list(): Promise<R2Objects> {
    throw new Error('R2 list not implemented in HTTP mode');
  }

  async createMultipartUpload(
    key: string,
    options?: R2MultipartOptions,
  ): Promise<R2MultipartUpload> {
    void key;
    void options;
    throw new Error('R2 multipart upload not implemented in HTTP mode');
  }

  resumeMultipartUpload(key: string, uploadId: string): R2MultipartUpload {
    void key;
    void uploadId;
    throw new Error('R2 multipart upload not implemented in HTTP mode');
  }
}

export function getDB(): D1Database {
  // In development, always use HTTP API to connect to remote D1
  if (process.env.NODE_ENV === 'development') {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
    const apiToken = process.env.CLOUDFLARE_D1_API_TOKEN;

    if (accountId && databaseId && apiToken) {
      return new HTTPD1Database(accountId, databaseId, apiToken);
    }
  }

  // In production, use the binding from the runtime
  let env;
  try {
    const context = getCloudflareContext();
    env = context.env as CloudflareEnv;
  } catch {
    // Not in Edge runtime or OpenNext context not initialized
  }

  if (env?.DB) return env.DB;

  // Final fallback to HTTP API
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
  // In development, always use HTTP API to connect to remote R2
  if (process.env.NODE_ENV === 'development') {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const bucketName = process.env.CLOUDFLARE_BUCKET_NAME || 'homepage';
    const apiToken =
      process.env.CLOUDFLARE_R2_API_TOKEN ||
      process.env.CLOUDFLARE_D1_API_TOKEN;

    if (accountId && bucketName && apiToken) {
      console.log('[Cloudflare] Using HTTP R2 bucket for remote access');
      return new HTTPR2Bucket(accountId, bucketName, apiToken) as R2Bucket;
    }
  }

  // In production, use the binding from the runtime
  let env;
  try {
    const context = getCloudflareContext();
    env = context.env as CloudflareEnv;
  } catch {
    // Not in Edge runtime or OpenNext context not initialized
  }

  if (env?.BUCKET) {
    console.log('[Cloudflare] Using R2 bucket binding');
    return env.BUCKET;
  }

  // Final fallback to HTTP API
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const bucketName = process.env.CLOUDFLARE_BUCKET_NAME || 'homepage';
  const apiToken =
    process.env.CLOUDFLARE_R2_API_TOKEN || process.env.CLOUDFLARE_D1_API_TOKEN;

  if (accountId && bucketName && apiToken) {
    return new HTTPR2Bucket(accountId, bucketName, apiToken) as R2Bucket;
  }

  console.warn(
    '[Cloudflare] R2 Bucket binding (BUCKET) and HTTP fallback env vars not found.',
  );
  return undefined as unknown as R2Bucket;
}
