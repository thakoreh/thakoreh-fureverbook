import { cookies } from 'next/headers';
import { getDb } from './db';
import { User } from './types';

const TOKEN_COOKIE = 'fureverbook_token';
const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: '/',
};

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
}

export function createToken(userId: string): string {
  const { nanoid } = require('nanoid');
  const token = nanoid(32);
  const db = getDb();
  db.prepare('INSERT INTO tokens (token, user_id, expires_at) VALUES (?, ?, datetime("now", "+30 days"))').run(token, userId);
  return token;
}

export function verifyToken(token: string): string | null {
  try {
    const db = getDb();
    const row = db.prepare('SELECT user_id FROM tokens WHERE token = ? AND expires_at > datetime("now")').get(token) as { user_id: string } | undefined;
    return row?.user_id ?? null;
  } catch {
    return null;
  }
}

export function deleteToken(token: string): void {
  const db = getDb();
  db.prepare('DELETE FROM tokens WHERE token = ?').run(token);
}

export function createTokensTable(): void {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS tokens (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    createTokensTable();
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE)?.value;
    if (!token) return null;

    const userId = verifyToken(token);
    if (!userId) return null;

    const db = getDb();
    const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(userId) as User | undefined;
    return user ?? null;
  } catch {
    return null;
  }
}

export function setTokenCookie(token: string): void {
  // This is handled in API routes via Response cookies
}

export function clearTokenCookie(): void {
  // This is handled in API routes
}

export { TOKEN_COOKIE, TOKEN_COOKIE_OPTIONS };
