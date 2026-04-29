import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '../../../../lib/db';
import { createTokensTable, TOKEN_COOKIE } from '../../../../lib/auth';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE)?.value;

    if (token) {
      const db = getDb();
      createTokensTable();
      db.prepare('DELETE FROM tokens WHERE token = ?').run(token);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete(TOKEN_COOKIE);
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
