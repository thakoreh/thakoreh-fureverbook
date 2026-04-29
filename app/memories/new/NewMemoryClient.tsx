'use client';

import { useState, useCallback, DragEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MOODS = [
  { id: 'playful', label: '🎾 Playful', className: 'mood-playful' },
  { id: 'sleepy', label: '😴 Sleepy', className: 'mood-sleepy' },
  { id: 'adventurous', label: '🌲 Adventurous', className: 'mood-adventurous' },
  { id: 'cuddly', label: '🤗 Cuddly', className: 'mood-cuddly' },
];

export default function NewMemoryClient() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [mood, setMood] = useState('playful');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter(
      f => f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    addFiles(dropped);
  }, []);

  const handleFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter(
        f => f.type.startsWith('image/') || f.type.startsWith('video/')
      );
      addFiles(selected);
    }
  }, []);

  function addFiles(newFiles: File[]) {
    setFiles(prev => [...prev, ...newFiles]);
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }

  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please add a title for this memory');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      let mediaUrls: string[] = [];

      if (files.length > 0) {
        setUploading(true);
        const uploadForm = new FormData();
        files.forEach(f => uploadForm.append('files', f));
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadForm,
        });
        
        if (!uploadRes.ok) throw new Error('Upload failed');
        const uploadData = await uploadRes.json();
        mediaUrls = uploadData.urls;
        setUploading(false);
      }

      const memoryRes = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, caption, mood, date, mediaUrls }),
      });

      if (!memoryRes.ok) throw new Error('Failed to create memory');

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-card">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-warm-gray hover:text-chocolate transition-colors">
            <span>←</span>
            <span className="font-semibold">Back to Journal</span>
          </Link>
          <span className="font-heading font-bold text-chocolate">New Memory</span>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-chocolate mb-2">
            Create a Memory 💫
          </h1>
          <p className="text-warm-gray">
            Capture a moment with your best friend. Every memory matters.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-chocolate mb-2">
              Memory Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Beach day at Half Moon Bay!"
              required
              className="w-full px-5 py-3 bg-white border-2 border-peach/50 rounded-2xl text-chocolate placeholder-warm-gray/50 transition-warm"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-chocolate mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-5 py-3 bg-white border-2 border-peach/50 rounded-2xl text-chocolate transition-warm"
            />
          </div>

          {/* Mood */}
          <div>
            <label className="block text-sm font-semibold text-chocolate mb-3">
              How was your pup feeling?
            </label>
            <div className="flex flex-wrap gap-3">
              {MOODS.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    mood === m.id 
                      ? `${m.className} ring-2 ring-chocolate ring-offset-2` 
                      : 'bg-white text-warm-gray border-2 border-peach/30 hover:border-peach'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-semibold text-chocolate mb-2">
              Story / Caption
            </label>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Tell the story behind this moment... What made it special?"
              rows={4}
              className="w-full px-5 py-3 bg-white border-2 border-peach/50 rounded-2xl text-chocolate placeholder-warm-gray/50 transition-warm resize-none"
            />
          </div>

          {/* Upload zone */}
          <div>
            <label className="block text-sm font-semibold text-chocolate mb-3">
              Photos & Videos
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`upload-zone rounded-2xl p-8 text-center cursor-pointer ${
                dragOver ? 'drag-over' : ''
              }`}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="text-4xl mb-3">📸</div>
              <p className="font-semibold text-chocolate mb-1">
                {dragOver ? 'Drop to add!' : 'Drag photos here or click to browse'}
              </p>
              <p className="text-sm text-warm-gray">
                Multiple files welcome • Photos and videos
              </p>
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {previews.map((preview, i) => (
                  <div key={i} className="relative group">
                    <img 
                      src={preview} 
                      alt="" 
                      className="w-full aspect-square object-cover rounded-xl" 
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-coral text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    {files[i]?.type.startsWith('video/') && (
                      <div className="absolute inset-0 flex items-center justify-center bg-chocolate/30 rounded-xl">
                        <span className="text-white text-xl">▶</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-coral/10 border border-coral/30 rounded-xl px-4 py-3 text-sm text-coral">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full btn-primary py-4 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : submitting ? 'Saving Memory...' : 'Save Memory 🐾'}
          </button>
        </form>
      </main>
    </div>
  );
}
