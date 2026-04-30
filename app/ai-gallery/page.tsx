"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const STYLES = [
  { id: "watercolor", label: "Watercolor", emoji: "🎨", desc: "Soft dreamy painting" },
  { id: "pixar", label: "Pixar Style", emoji: "✨", desc: "Cute 3D animated" },
  { id: "fantasy", label: "Fantasy Hero", emoji: "⚔️", desc: "Majestic warrior" },
  { id: "renaissance", label: "Renaissance", emoji: "🖼️", desc: "Classical oil painting" },
  { id: "comic", label: "Comic Book", emoji: "💥", desc: "Bold action style" },
  { id: "beach", label: "Beach Day", emoji: "🏖️", desc: "Tropical vacation" },
  { id: "space", label: "Space Explorer", emoji: "🚀", desc: "Cosmic adventure" },
  { id: "royal", label: "Royal Highness", emoji: "👑", desc: "Majestic crown & cape" },
];

export default function AIGalleryPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const artworks = useQuery(api.aiArt.list);
  const generate = useMutation(api.aiArt.generate);
  const [selectedStyle, setSelectedStyle] = useState("pixar");
  const [generating, setGenerating] = useState(false);
  const [latestArt, setLatestArt] = useState<{ imageUrl: string; style: string } | null>(null);

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

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await generate({ style: selectedStyle });
      setLatestArt({ imageUrl: result.imageUrl, style: selectedStyle });
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white shadow-warm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="font-heading text-xl font-bold text-chocolate">
              Fureverbook
            </span>
          </Link>
          <Link href="/dashboard" className="btn-ghost text-sm">
            ← Back to memories
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-chocolate mb-2">
            🎨 AI Art Studio
          </h1>
          <p className="font-body text-chocolate/60">
            Transform your dog photos into magical art — in any style imaginable.
          </p>
        </div>

        {/* Style selector */}
        <div className="bg-white rounded-3xl shadow-warm p-6 mb-8">
          <h2 className="font-heading text-lg font-semibold text-chocolate mb-4">
            Choose a style
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStyle(s.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  selectedStyle === s.id
                    ? "border-coral bg-coral/5"
                    : "border-peach/50 bg-cream/50 hover:border-peach"
                }`}
              >
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="font-heading text-sm font-semibold text-chocolate">
                  {s.label}
                </div>
                <div className="text-xs text-chocolate/50 mt-0.5">{s.desc}</div>
              </button>
            ))}
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary w-full disabled:opacity-50"
          >
            {generating ? "✨ Creating magic..." : `✨ Generate ${STYLES.find((s) => s.id === selectedStyle)?.label} art`}
          </button>
        </div>

        {/* Latest result */}
        {latestArt && (
          <div className="bg-white rounded-3xl shadow-warm p-6 mb-8">
            <h3 className="font-heading text-lg font-semibold text-chocolate mb-4">
              Your new artwork
            </h3>
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={latestArt.imageUrl}
                alt="AI generated artwork"
                className="w-full max-h-96 object-contain bg-peach/20 rounded-2xl"
              />
            </div>
          </div>
        )}

        {/* Gallery */}
        {artworks && artworks.length > 0 && (
          <div>
            <h2 className="font-heading text-xl font-semibold text-chocolate mb-4">
              Your gallery ({artworks.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {artworks.map((art: any) => (
                <div key={art._id} className="card overflow-hidden">
                  <img
                    src={art.imageUrl}
                    alt={art.style}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-3 text-center">
                    <span className="tag-coral text-xs">
                      {STYLES.find((s) => s.id === art.style)?.emoji}{" "}
                      {STYLES.find((s) => s.id === art.style)?.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
