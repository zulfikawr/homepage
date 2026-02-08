import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function apiSuccess<T>(data: T, status = 200): NextResponse {
  if (status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  return NextResponse.json(
    {
      success: true,
      data,
    } as ApiResponse<T>,
    { status },
  );
}

export function apiError(
  error: string,
  status = 500,
  message?: string,
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
      message,
    } as ApiResponse,
    { status },
  );
}
