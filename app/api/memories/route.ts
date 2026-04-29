import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth';
import { getDb } from '../../../lib/db';
import { nanoid } from 'nanoid';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = parseInt(searchParams.get('offset') || '0');

    const memories = db.prepare(`
      SELECT id, user_id, dog_id, title, caption, mood, date, created_at 
      FROM memories 
      WHERE user_id = ? 
      ORDER BY date DESC, created_at DESC 
      LIMIT ? OFFSET ?
    `).all(user.id) as any[];

    // Get media for each memory
    const memoriesWithMedia = memories.map(memory => {
      const media = db.prepare(`
        SELECT id, file_url, file_type FROM media WHERE memory_id = ?
      `).all(memory.id) as any[];
      return { ...memory, media };
    });

    const total = db.prepare('SELECT COUNT(*) as count FROM memories WHERE user_id = ?').get(user.id) as any;

    return NextResponse.json({ 
      memories: memoriesWithMedia, 
      total: total.count,
      hasMore: offset + memories.length < total.count
    });
  } catch (error) {
    console.error('Get memories error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, caption, mood, date, mediaUrls } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title required' }, { status: 400 });
    }

    const db = getDb();
    const dog = db.prepare('SELECT id FROM dogs WHERE user_id = ?').get(user.id) as any;
    if (!dog) {
      return NextResponse.json({ error: 'Dog profile not found' }, { status: 400 });
    }

    const memoryId = nanoid();
    db.prepare(`
      INSERT INTO memories (id, user_id, dog_id, title, caption, mood, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(memoryId, user.id, dog.id, title, caption || '', mood || 'playful', date || new Date().toISOString().split('T')[0]);

    // Insert media
    if (mediaUrls && Array.isArray(mediaUrls) && mediaUrls.length > 0) {
      const insertMedia = db.prepare('INSERT INTO media (id, memory_id, file_url, file_type) VALUES (?, ?, ?, ?)');
      for (const url of mediaUrls) {
        const ext = url.split('.').pop()?.toLowerCase() || '';
        const fileType = ['mp4', 'mov', 'avi', 'webm'].includes(ext) ? 'video' : 'photo';
        insertMedia.run(nanoid(), memoryId, url, fileType);
      }
    }

    const memory = db.prepare('SELECT * FROM memories WHERE id = ?').get(memoryId);
    const media = db.prepare('SELECT * FROM media WHERE memory_id = ?').all(memoryId);

    return NextResponse.json({ ...(memory as Record<string,unknown>), media }, { status: 201 });
  } catch (error) {
    console.error('Create memory error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
