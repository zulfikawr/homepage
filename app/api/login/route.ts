import { NextRequest } from 'next/server';
import { z } from 'zod';

import {
  apiError,
  apiSuccess,
  handleApiError,
  validateRequest,
} from '@/lib/api';
import { getDB } from '@/lib/cloudflare';
import { verifyPassword } from '@/utilities/password';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  role: string;
}

export async function POST(request: NextRequest) {
  try {
    const validation = await validateRequest(request, loginSchema);
    if ('error' in validation) return validation.error;

    const { email, password } = validation.data;

    const db = getDB();
    if (!db) return apiError('Database not available', 500);

    const user = await db
      .prepare('SELECT * FROM users WHERE email = ?')
      .bind(email)
      .first<UserRow>();

    if (!user) return apiError('Invalid credentials', 401);

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) return apiError('Invalid credentials', 401);

    return apiSuccess({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
