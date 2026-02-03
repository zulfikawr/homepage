import { NextRequest, NextResponse } from 'next/server';

import { getDB } from '@/lib/cloudflare';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 },
      );
    }

    const db = getDB();

    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 },
      );
    }

    interface UserRow {
      id: string;
      email: string;
      password_hash: string;
      role: string;
    }

    const user = await db
      .prepare('SELECT * FROM users WHERE email = ?')
      .bind(email)
      .first<UserRow>();

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // For simplicity, we are doing a direct comparison.
    // In production, you'd use bcrypt/argon2.
    if (user.password_hash !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
