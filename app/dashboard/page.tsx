"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const MOOD_EMOJIS: Record<string, string> = {
  happy: "🐾", playful: "🎾", sleepy: "💤", adventurous: "🌲",
  cozy: "🏠", celebratory: "🎉", relaxed: "☀️", zoomies: "⚡",
  curious: "🔍", loving: "❤️",
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const memories = useQuery(api.memories.list);
  const deleteMemory = useMutation(api.memories.remove);
  const [filter, setFilter] = useState<"all" | "mood" | "featured">("all");
  const [moodFilter, setMoodFilter] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce-gentle">🐾</div>
          <p className="font-heading text-xl text-chocolate">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  const handleDelete = async (id: any) => {
    if (!confirm("Delete this memory?")) return;
    await deleteMemory({ id });
  };

  const filtered = (memories || []).filter((m: any) => {
    if (filter === "featured") return m.isFeatured;
    if (filter === "mood" && moodFilter) return m.mood === moodFilter;
    return true;
  });

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white shadow-warm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="font-heading text-xl font-bold text-chocolate">Fureverbook</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/ai-gallery" className="btn-ghost text-sm flex items-center gap-1">🎨 AI Studio</Link>
            <Link href="/collage" className="btn-ghost text-sm flex items-center gap-1">🖼️ Collage</Link>
            <Link href="/memories/new" className="btn-primary text-sm py-2 px-4">+ New Memory</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-chocolate mb-2">
            Your memories 🐾
          </h1>
          <p className="font-body text-chocolate/60">
            Every moment with your best friend, all in one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button onClick={() => setFilter("all")} className={`tag text-sm ${filter === "all" ? "bg-coral/20 text-coral" : "bg-peach/30 text-chocolate/70"}`}>All</button>
          <button onClick={() => setFilter("featured")} className={`tag text-sm ${filter === "featured" ? "bg-golden/30 text-brownDark" : "bg-peach/30 text-chocolate/70"}`}>⭐ Featured</button>
          <button onClick={() => setFilter("mood")} className={`tag text-sm ${filter === "mood" ? "bg-sage/30 text-green-800" : "bg-peach/30 text-chocolate/70"}`}>😊 By mood</button>
          {filter === "mood" && (
            <select className="input-warm py-1 px-3 text-sm max-w-[160px]" value={moodFilter} onChange={(e) => setMoodFilter(e.target.value)}>
              <option value="">All moods</option>
              {Object.entries(MOOD_EMOJIS).map(([k, v]) => (
                <option key={k} value={k}>{v} {k}</option>
              ))}
            </select>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🐾</div>
            <h2 className="font-heading text-2xl text-chocolate mb-2">No memories yet</h2>
            <p className="font-body text-chocolate/60 mb-6">Start capturing your dog&apos;s best moments.</p>
            <Link href="/memories/new" className="btn-primary">Create your first memory</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((memory: any) => (
              <div key={memory._id} className="card-warm overflow-hidden group">
                {memory.media?.length > 0 && (
                  <div className="relative h-48 overflow-hidden">
                    {memory.media[0]?.url ? (
                      <img src={memory.media[0].url} alt={memory.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-peach/30 flex items-center justify-center text-4xl">📸</div>
                    )}
                    {memory.isFeatured && <div className="absolute top-3 right-3 bg-golden text-brownDark text-xs font-bold px-2 py-1 rounded-full">⭐ Featured</div>}
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-heading text-lg font-semibold text-chocolate">{memory.title}</h3>
                    {memory.mood && <span className="text-lg">{MOOD_EMOJIS[memory.mood] || "🐾"}</span>}
                  </div>
                  {memory.description && <p className="font-body text-sm text-chocolate/60 mb-3 line-clamp-2">{memory.description}</p>}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-chocolate/40 font-body">{memory.media?.length || 0} photo{(memory.media?.length || 0) !== 1 ? "s" : ""}</span>
                    <button onClick={() => handleDelete(memory._id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
