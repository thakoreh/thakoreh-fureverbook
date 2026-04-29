import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { getDb } from '../../../../lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const db = getDb();
    const dog = db.prepare('SELECT id, name, breed, birthday, photo_url FROM dogs WHERE user_id = ?').get(user.id) as any;
    const memoryCount = db.prepare('SELECT COUNT(*) as count FROM memories WHERE user_id = ?').get(user.id) as any;

    return NextResponse.json({ 
      user, 
      dog: dog || null,
      memoryCount: memoryCount?.count || 0
    });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
