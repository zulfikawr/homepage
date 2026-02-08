import { D1Database } from '@cloudflare/workers-types';

import { getDB } from '@/lib/cloudflare';

export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public cause?: unknown,
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export function handleDatabaseError(error: unknown, operation: string): never {
  console.error(`Database ${operation} error:`, error);

  if (error instanceof DatabaseError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new DatabaseError(`Failed to ${operation}`, undefined, error);
  }

  throw new DatabaseError(`Failed to ${operation}`, undefined, error);
}

export function requireDatabase(): D1Database {
  const db = getDB();
  if (!db) {
    throw new DatabaseError('Database not available');
  }
  return db;
}

export async function executeQuery<T>(
  query: string,
  params: unknown[] = [],
): Promise<T[]> {
  try {
    const db = requireDatabase();
    const { results } = await db
      .prepare(query)
      .bind(...params)
      .all();
    return results as T[];
  } catch (error) {
    handleDatabaseError(error, 'execute query');
  }
}

export async function executeQueryFirst<T>(
  query: string,
  params: unknown[] = [],
): Promise<T | null> {
  try {
    const db = requireDatabase();
    const result = await db
      .prepare(query)
      .bind(...params)
      .first<T>();
    return result;
  } catch (error) {
    handleDatabaseError(error, 'execute query');
  }
}

export async function executeUpdate(
  query: string,
  params: unknown[] = [],
): Promise<void> {
  try {
    const db = requireDatabase();
    await db
      .prepare(query)
      .bind(...params)
      .run();
  } catch (error) {
    handleDatabaseError(error, 'execute update');
  }
}
