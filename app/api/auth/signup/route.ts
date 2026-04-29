import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { hashPassword, createToken, createTokensTable, TOKEN_COOKIE, TOKEN_COOKIE_OPTIONS } from '../../../../lib/auth';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const db = getDb();
    createTokensTable();

    // Check if email exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const userId = nanoid();
    const dogId = nanoid();
    const passwordHash = await hashPassword(password);

    db.prepare('INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)').run(userId, email, passwordHash, name);
    
    // Create default dog profile
    db.prepare('INSERT INTO dogs (id, user_id, name) VALUES (?, ?, ?)').run(dogId, userId, 'My Dog');

    const token = createToken(userId);

    const response = NextResponse.json({ 
      user: { id: userId, email, name },
      dogId
    });

    response.cookies.set(TOKEN_COOKIE, token, TOKEN_COOKIE_OPTIONS);
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
