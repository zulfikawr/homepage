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

/**
 * FormData can contain both an existing string value and a newly selected File
 * under the same key. Always prefer the File so uploads replace old values.
 */
export function getFormFile(data: FormData, key: string): File | null {
  if (typeof File === 'undefined') return null;
  return (
    data
      .getAll(key)
      .find(
        (value): value is File => value instanceof File && value.size > 0,
      ) ?? null
  );
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
