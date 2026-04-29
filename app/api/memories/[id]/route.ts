import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { getDb } from '../../../../lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const db = getDb();

    const memory = db.prepare('SELECT * FROM memories WHERE id = ? AND user_id = ?').get(id, user.id) as any;
    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    const media = db.prepare('SELECT * FROM media WHERE memory_id = ?').all(id);

    return NextResponse.json({ ...memory, media });
  } catch (error) {
    console.error('Get memory error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const db = getDb();

    const memory = db.prepare('SELECT id FROM memories WHERE id = ? AND user_id = ?').get(id, user.id);
    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    db.prepare('DELETE FROM media WHERE memory_id = ?').run(id);
    db.prepare('DELETE FROM memories WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete memory error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
