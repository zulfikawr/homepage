import { apiError } from './response';

export function handleApiError(error: unknown): ReturnType<typeof apiError> {
  console.error('API Error:', error);

  if (error instanceof Error) {
    return apiError(error.message, 500);
  }

  return apiError('Internal server error', 500);
}
