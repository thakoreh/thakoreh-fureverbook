'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Dog {
  id: string;
  name: string;
  breed: string;
  birthday: string;
  photo_url: string | null;
}

interface Memory {
  id: string;
  title: string;
  caption: string;
  mood: string;
  date: string;
  created_at: string;
  media: { id: string; file_url: string; file_type: string }[];
}

interface Props {
  user: User;
  dog: Dog | null;
  memoryCount: number;
}

function getMoodClass(mood: string) {
  switch (mood) {
    case 'playful': return 'mood-playful';
    case 'sleepy': return 'mood-sleepy';
    case 'adventurous': return 'mood-adventurous';
    case 'cuddly': return 'mood-cuddly';
    default: return 'mood-playful';
  }
}

function getMoodLabel(mood: string) {
  switch (mood) {
    case 'playful': return '🎾 Playful';
    case 'sleepy': return '😴 Sleepy';
    case 'adventurous': return '🌲 Adventurous';
    case 'cuddly': return '🤗 Cuddly';
    default: return mood;
  }
}

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function DashboardClient({ user, dog, memoryCount }: Props) {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const fetchMemories = useCallback(async (reset = false) => {
    try {
      const currentOffset = reset ? 0 : offset;
      const res = await fetch(`/api/memories?limit=12&offset=${currentOffset}`);
      const data = await res.json();
      if (reset) {
        setMemories(data.memories || []);
      } else {
        setMemories(prev => [...prev, ...(data.memories || [])]);
      }
      setHasMore(data.hasMore);
      setOffset(currentOffset + 12);
    } catch (error) {
      console.error('Failed to fetch memories:', error);
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    fetchMemories(true);
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-card sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="font-heading text-xl font-bold text-chocolate">Fureverbook</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/memories/new" className="btn-primary text-sm flex items-center gap-2">
              <span>+</span> New Memory
            </Link>
            <button onClick={handleLogout} className="text-warm-gray hover:text-chocolate transition-colors text-sm">
              Sign Out
            </button>
            <div className="w-10 h-10 rounded-full bg-peach/50 flex items-center justify-center text-chocolate font-semibold overflow-hidden">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Dog profile card */}
        <div className="bg-white rounded-2xl shadow-card p-8 mb-10">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-peach to-pink flex items-center justify-center text-4xl overflow-hidden">
              {dog?.photo_url ? (
                <img src={dog.photo_url} alt={dog.name} className="w-full h-full object-cover" />
              ) : (
                '🐕'
              )}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="font-heading text-2xl font-bold text-chocolate">
                {dog?.name || 'My Dog'}'s Memory Journal
              </h1>
              <p className="text-warm-gray mt-1">
                {memoryCount} {memoryCount === 1 ? 'memory' : 'memories'} collected
              </p>
              {dog?.breed && <p className="text-warm-gray text-sm">{dog.breed}</p>}
            </div>
            <div className="flex gap-3">
              <Link href="/ai-gallery" className="btn-secondary text-sm">
                🎨 AI Art
              </Link>
              <Link href="/collage" className="btn-secondary text-sm">
                🖼️ Collages
              </Link>
            </div>
          </div>
        </div>

        {/* Timeline section */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl font-bold text-chocolate">Memory Timeline</h2>
        </div>

        {/* Empty state */}
        {!loading && memories.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="font-heading text-2xl font-bold text-chocolate mb-3">
              No memories yet!
            </h3>
            <p className="text-warm-gray mb-8 max-w-md mx-auto">
              Start capturing moments with your best friend. Every tail wag, every cozy nap, every adventure — deserves to be remembered.
            </p>
            <Link href="/memories/new" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
              Create Your First Memory 📸
            </Link>
          </div>
        )}

        {/* Memory grid */}
        {memories.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory, i) => (
              <div
                key={memory.id}
                className="bg-white rounded-2xl shadow-card overflow-hidden card-hover"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Photo grid */}
                <div className="grid grid-cols-2 gap-1 p-1" style={{ minHeight: '180px' }}>
                  {memory.media.slice(0, 4).map((item, idx) => (
                    <div 
                      key={item.id} 
                      className={`overflow-hidden rounded-xl relative ${
                        memory.media.length === 1 ? 'col-span-2 row-span-2' :
                        memory.media.length === 2 ? '' :
                        memory.media.length === 3 && idx === 0 ? 'col-span-2' : ''
                      }`}
                    >
                      <img 
                        src={item.file_url} 
                        alt="" 
                        className="w-full h-full object-cover"
                        style={{ minHeight: memory.media.length === 1 ? '180px' : '85px' }}
                      />
                      {memory.media.length > 4 && idx === 3 && (
                        <div className="absolute inset-0 bg-chocolate/50 flex items-center justify-center text-white font-heading text-xl">
                          +{memory.media.length - 4}
                        </div>
                      )}
                    </div>
                  ))}
                  {memory.media.length === 0 && (
                    <div className="col-span-2 flex items-center justify-center bg-peach/20 rounded-xl" style={{ minHeight: '180px' }}>
                      <span className="text-4xl">📝</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-heading font-semibold text-chocolate text-lg mb-1 truncate">
                    {memory.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-handwritten text-warm-gray text-sm">
                      {formatDate(memory.date)}
                    </span>
                    {memory.mood && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getMoodClass(memory.mood)}`}>
                        {getMoodLabel(memory.mood)}
                      </span>
                    )}
                  </div>
                  {memory.caption && (
                    <p className="text-warm-gray text-sm line-clamp-2">{memory.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="text-center mt-10">
            <button
              onClick={() => fetchMemories()}
              className="btn-secondary"
            >
              Load More Memories
            </button>
          </div>
        )}

        {loading && memories.length === 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
                <div className="bg-peach/20" style={{ height: '180px' }} />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-peach/20 rounded w-3/4" />
                  <div className="h-4 bg-peach/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
