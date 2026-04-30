'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

const LAYOUTS = [
  { 
    id: 'grid', 
    label: 'Grid', 
    emoji: '⊞',
    description: 'Classic 2×2 photo grid',
    template: [
      { col: 0, row: 0, colSpan: 1, rowSpan: 1 },
      { col: 1, row: 0, colSpan: 1, rowSpan: 1 },
      { col: 0, row: 1, colSpan: 1, rowSpan: 1 },
      { col: 1, row: 1, colSpan: 1, rowSpan: 1 },
    ]
  },
  { 
    id: 'featured', 
    label: 'Featured', 
    emoji: '⭐',
    description: 'One hero photo with small ones',
    template: [
      { col: 0, row: 0, colSpan: 2, rowSpan: 2 },
      { col: 2, row: 0, colSpan: 1, rowSpan: 1 },
      { col: 2, row: 1, colSpan: 1, rowSpan: 1 },
      { col: 0, row: 2, colSpan: 3, rowSpan: 1 },
    ]
  },
  { 
    id: 'scattered', 
    label: 'Scattered', 
    emoji: '✨',
    description: 'Random playful arrangement',
    template: [
      { col: 0, row: 0, colSpan: 1, rowSpan: 1 },
      { col: 1, row: 0, colSpan: 1, rowSpan: 2 },
      { col: 2, row: 1, colSpan: 1, rowSpan: 1 },
      { col: 0, row: 1, colSpan: 1, rowSpan: 1 },
    ]
  },
];

// Demo photos
const DEMO_PHOTOS = [
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
  'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&q=80',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80',
  'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400&q=80',
  'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=400&q=80',
];

export default function CollagePage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [layout, setLayout] = useState('grid');
  const [caption, setCaption] = useState('');

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      window.location.href = "/login";
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-5xl animate-bounce-gentle">🐾</div>
      </div>
    );
  }

  function togglePhoto(url: string) {
    setSelectedPhotos(prev => 
      prev.includes(url) 
        ? prev.filter(p => p !== url)
        : prev.length < 6 ? [...prev, url] : prev
    );
  }

  const currentLayout = LAYOUTS.find(l => l.id === layout)!;

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white shadow-card">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-warm-gray hover:text-chocolate transition-colors">
            <span>←</span>
            <span className="font-semibold">Back</span>
          </Link>
          <span className="font-heading font-bold text-chocolate">Collage Studio</span>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl font-bold text-chocolate mb-3">
            Create Beautiful Collages 🖼️
          </h1>
          <p className="text-warm-gray">
            Select photos and a layout. Download your creation!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left - Photo selection */}
          <div>
            <h2 className="font-heading text-lg font-semibold text-chocolate mb-4">
              1. Choose Photos (2-6)
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {DEMO_PHOTOS.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => togglePhoto(photo)}
                  className={`relative rounded-2xl overflow-hidden aspect-square transition-all ${
                    selectedPhotos.includes(photo)
                      ? 'ring-4 ring-coral scale-95'
                      : 'hover:scale-98 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  {selectedPhotos.includes(photo) && (
                    <div className="absolute inset-0 bg-coral/30 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Layout selection */}
            <h2 className="font-heading text-lg font-semibold text-chocolate mb-4 mt-8">
              2. Pick a Layout
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {LAYOUTS.map(l => (
                <button
                  key={l.id}
                  onClick={() => setLayout(l.id)}
                  className={`p-4 rounded-2xl text-center transition-all ${
                    layout === l.id
                      ? 'bg-coral text-white'
                      : 'bg-white hover:bg-peach/20'
                  }`}
                >
                  <span className="text-2xl mb-1 block">{l.emoji}</span>
                  <p className={`font-semibold text-sm ${layout === l.id ? 'text-white' : 'text-chocolate'}`}>
                    {l.label}
                  </p>
                </button>
              ))}
            </div>

            {/* Caption */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-chocolate mb-2">
                Caption (optional)
              </label>
              <input
                type="text"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Add a caption to your collage..."
                className="w-full px-4 py-3 bg-white border-2 border-peach/50 rounded-2xl text-chocolate placeholder-warm-gray/50 transition-warm"
              />
            </div>
          </div>

          {/* Right - Preview */}
          <div>
            <h2 className="font-heading text-lg font-semibold text-chocolate mb-4">
              3. Preview & Download
            </h2>
            <div className="bg-white rounded-2xl shadow-warm-lg p-4">
              {selectedPhotos.length >= 2 ? (
                <div 
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gridTemplateRows: 'repeat(3, 1fr)',
                  }}
                >
                  {currentLayout.template.slice(0, selectedPhotos.length).map((cell, i) => (
                    <div
                      key={i}
                      style={{
                        gridColumn: `${cell.col + 1} / span ${cell.colSpan}`,
                        gridRow: `${cell.row + 1} / span ${cell.rowSpan}`,
                      }}
                      className="overflow-hidden rounded-xl"
                    >
                      <img 
                        src={selectedPhotos[i]} 
                        alt="" 
                        className="w-full h-full object-cover"
                        style={{ minHeight: cell.rowSpan === 2 ? '200px' : '100px' }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center text-warm-gray py-20">
                  <div className="text-center">
                    <span className="text-5xl block mb-4">🖼️</span>
                    <p>Select at least 2 photos to preview</p>
                  </div>
                </div>
              )}
              {caption && (
                <p className="text-center mt-4 font-handwritten text-xl text-chocolate">
                  {caption}
                </p>
              )}
            </div>

            {selectedPhotos.length >= 2 && (
              <p className="text-center mt-4 text-sm text-warm-gray">
                Tip: Right-click the collage above and "Save Image As..." to download
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
