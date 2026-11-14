import fs from 'node:fs';
import path from 'node:path';

type Sqlite = typeof import('node:sqlite');
type SqliteDatabase = InstanceType<Sqlite['DatabaseSync']>;
type SqliteStatement = ReturnType<SqliteDatabase['prepare']>;
type SqlValue = string | number | bigint | null | Uint8Array;

const DEFAULT_DB_PATH = path.join(
  process.cwd(),
  'local',
  'data',
  'homepage.db',
);

let sqlite: Sqlite | null = null;
let localDb: LocalD1Database | null = null;

function getSqlite(): Sqlite {
  if (!sqlite) {
    // process.getBuiltinModule avoids a static `node:sqlite` import so the
    // Cloudflare/OpenNext bundle never tries to resolve it.
    const mod = process.getBuiltinModule('node:sqlite');
    if (!mod) {
      throw new Error(
        'node:sqlite is not available. Use Node.js 22.5+ or Bun 1.2+.',
      );
    }
    sqlite = mod;
  }
  return sqlite;
}

export function isLocalDataMode(): boolean {
  // Never use the local SQLite/filesystem stores in a deployed build, even if
  // DATA_MODE=local leaked into the production environment.
  if (process.env.NODE_ENV === 'production') return false;
  if (process.env.DATA_MODE) return process.env.DATA_MODE === 'local';
  return process.env.NODE_ENV === 'development';
}

export function getLocalDatabasePath(): string {
  const configured = process.env.LOCAL_DB_PATH;
  return configured
    ? path.resolve(/* turbopackIgnore: true */ process.cwd(), configured)
    : DEFAULT_DB_PATH;
}

function toSqlValue(value: unknown): SqlValue {
  if (value === undefined || value === null) return null;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'bigint'
  ) {
    return value;
  }
  throw new Error(`Unsupported SQLite bind value: ${typeof value}`);
}

function plainRow<T>(row: Record<string, unknown>): T {
  // node:sqlite returns null-prototype objects; D1/RSC expect plain objects.
  return { ...row } as T;
}

export class LocalD1Database implements D1Database {
  constructor(
    private readonly filePath: string,
    private readonly database: SqliteDatabase,
  ) {}

  prepare(query: string): D1PreparedStatement {
    return new LocalD1PreparedStatement(
      this.database,
      query,
      [],
    ) as unknown as D1PreparedStatement;
  }

  async batch<T = unknown>(
    statements: D1PreparedStatement[],
  ): Promise<D1Result<T>[]> {
    return statements.map((statement) =>
      (statement as unknown as LocalD1PreparedStatement).executeAll<T>(),
    );
  }

  async exec(query: string): Promise<D1ExecResult> {
    const startedAt = Date.now();
    this.database.exec(query);
    const changes = (
      this.database.prepare('SELECT changes() AS changes').get() as
        { changes: number } | undefined
    )?.changes;
    return {
      count: Number(changes ?? 0),
      duration: Date.now() - startedAt,
    };
  }

  async dump(): Promise<ArrayBuffer> {
    const bytes = fs.readFileSync(this.filePath);
    return bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer;
  }

  withSession(constraintOrBookmark?: string): D1DatabaseSession {
    return new LocalD1Session(this, constraintOrBookmark);
  }
}

class LocalD1Session implements D1DatabaseSession {
  constructor(
    private readonly database: LocalD1Database,
    private readonly bookmark?: string,
  ) {}

  prepare(query: string): D1PreparedStatement {
    return this.database.prepare(query);
  }

  batch<T = unknown>(
    statements: D1PreparedStatement[],
  ): Promise<D1Result<T>[]> {
    return this.database.batch<T>(statements);
  }

  exec(query: string): Promise<D1ExecResult> {
    return this.database.exec(query);
  }

  getBookmark(): string | undefined {
    return this.bookmark;
  }
}

class LocalD1PreparedStatement {
  constructor(
    private readonly database: SqliteDatabase,
    private readonly query: string,
    private readonly values: unknown[],
  ) {}

  bind(...values: unknown[]): D1PreparedStatement {
    return new LocalD1PreparedStatement(this.database, this.query, [
      ...this.values,
      ...values,
    ]) as unknown as D1PreparedStatement;
  }

  async first<T = unknown>(column?: string): Promise<T | null> {
    const row = this.statement().get(...this.values.map(toSqlValue)) as
      Record<string, unknown> | undefined;

    if (!row) return null;
    if (column) return (row[column] as T) ?? null;
    return plainRow<T>(row);
  }

  async run(): Promise<D1Response> {
    const startedAt = Date.now();
    const result = this.statement().run(...this.values.map(toSqlValue));
    const changes = Number(result.changes);
    return {
      success: true,
      meta: this.meta(
        changes,
        Number(result.lastInsertRowid),
        Date.now() - startedAt,
      ),
    };
  }

  async all<T = unknown>(): Promise<D1Result<T>> {
    return this.executeAll<T>();
  }

  async raw<T = unknown>(): Promise<T[]> {
    const { results } = this.executeAll();
    return results.map(
      (row) => Object.values(row as Record<string, unknown>) as T,
    );
  }

  executeAll<T = unknown>(): D1Result<T> {
    const startedAt = Date.now();
    const rows = this.statement().all(...this.values.map(toSqlValue)) as Record<
      string,
      unknown
    >[];
    const result = this.database
      .prepare('SELECT changes() AS changes, last_insert_rowid() AS lastId')
      .get() as { changes: number; lastId: number } | undefined;
    const changes = Number(result?.changes ?? 0);
    return {
      success: true,
      results: rows.map((row) => plainRow<T>(row)),
      meta: this.meta(
        changes,
        Number(result?.lastId ?? 0),
        Date.now() - startedAt,
      ),
    };
  }

  private statement(): SqliteStatement {
    return this.database.prepare(this.query);
  }

  private meta(
    changes: number,
    lastRowId: number,
    duration: number,
  ): D1Meta & Record<string, unknown> {
    return {
      duration,
      rows_read: 0,
      rows_written: changes,
      last_row_id: lastRowId,
      changed_db: changes > 0,
      size_after: 0,
      changes,
    } as D1Meta & Record<string, unknown>;
  }
}

export function getLocalDB(): D1Database {
  if (localDb) return localDb;

  const filePath = getLocalDatabasePath();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const exists = fs.existsSync(filePath) && fs.statSync(filePath).size > 0;

  const { DatabaseSync } = getSqlite();
  const database = new DatabaseSync(filePath);
  database.exec('PRAGMA journal_mode = WAL;');
  database.exec('PRAGMA foreign_keys = ON;');

  if (!exists) {
    console.warn(
      `[Local D1] Database file not found at ${filePath}. Run the export first.`,
    );
  } else {
    console.log(`[Local D1] Using SQLite database at ${filePath}`);
  }

  localDb = new LocalD1Database(filePath, database);
  return localDb;
}
