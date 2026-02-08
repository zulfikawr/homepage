import { NextRequest } from 'next/server';
import { ZodError, ZodSchema } from 'zod';

import { apiError } from './response';

export async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema<T>,
): Promise<{ data: T } | { error: ReturnType<typeof apiError> }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { data };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        error: apiError(
          'Validation failed',
          400,
          error.issues
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join(', '),
        ),
      };
    }
    return { error: apiError('Invalid request body', 400) };
  }
}

export async function validateSearchParams<T>(
  request: NextRequest,
  schema: ZodSchema<T>,
): Promise<{ data: T } | { error: ReturnType<typeof apiError> }> {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const data = schema.parse(params);
    return { data };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        error: apiError(
          'Validation failed',
          400,
          error.issues
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join(', '),
        ),
      };
    }
    return { error: apiError('Invalid query parameters', 400) };
  }
}
