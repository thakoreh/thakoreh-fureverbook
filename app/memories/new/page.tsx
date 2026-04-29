"use client";

import { useState, useRef, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const MOODS = [
  { id: "happy", label: "Happy", emoji: "🐾" }, { id: "playful", label: "Playful", emoji: "🎾" },
  { id: "sleepy", label: "Sleepy", emoji: "💤" }, { id: "adventurous", label: "Adventurous", emoji: "🌲" },
  { id: "cozy", label: "Cozy", emoji: "🏠" }, { id: "celebratory", label: "Celebrating", emoji: "🎉" },
  { id: "relaxed", label: "Relaxed", emoji: "☀️" }, { id: "zoomies", label: "Zoomies!", emoji: "⚡" },
  { id: "curious", label: "Curious", emoji: "🔍" }, { id: "loving", label: "Loving", emoji: "❤️" },
];

export default function NewMemoryPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const createMemory = useMutation(api.memories.create);
  const addMedia = useMutation(api.memories.addMedia);
  const getUploadUrl = useMutation(api.memories.getUploadUrl);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [memoryDate, setMemoryDate] = useState("");
  const [mood, setMood] = useState("");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-5xl animate-bounce-gentle">🐾</div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/thakoreh-fureverbook/login";
    return null;
  }

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
    setPreviews((prev) => [...prev, ...selected.map((f) => URL.createObjectURL(f))]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const result = await createMemory({
        userId: user._id as any,
        title: title.trim(),
        description: description.trim() || undefined,
        memoryDate: memoryDate || undefined,
        mood: mood || undefined,
        location: location.trim() || undefined,
      });

      for (const file of files) {
        const uploadUrl = await getUploadUrl({ userId: user._id as any });
        const res = await fetch(uploadUrl, { method: "POST", body: file });
        const { storageId } = await res.json();
        await addMedia({
          userId: user._id as any,
          memoryId: result.memoryId as any,
          type: file.type.startsWith("video") ? "video" : "photo",
          filename: file.name,
          originalName: file.name,
          storageId,
        });
      }

      router.push("/thakoreh-fureverbook/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save memory");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white shadow-warm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/thakoreh-fureverbook/dashboard" className="text-chocolate/60 hover:text-chocolate">← Back</Link>
          <h1 className="font-heading text-xl font-bold text-chocolate">New Memory</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="label-warm">Memory title *</label>
            <input type="text" required className="input-warm text-lg" placeholder="Best day at the park!" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="label-warm">Photos</label>
            <div className="border-2 border-dashed border-peach rounded-2xl p-8 text-center bg-white/50">
              <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFiles} />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-secondary">📸 Choose photos</button>
              <p className="text-sm text-chocolate/50 mt-2">PNG, JPG, GIF up to 10MB each</p>
            </div>
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-peach/30">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="label-warm">Description</label>
            <textarea className="input-warm resize-none" rows={3} placeholder="What made this moment special?" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <label className="label-warm">Mood</label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button key={m.id} type="button" onClick={() => setMood(mood === m.id ? "" : m.id)}
                  className={`tag cursor-pointer transition-all ${mood === m.id ? "bg-coral/20 text-coral ring-2 ring-coral" : "bg-peach/30 text-chocolate/70 hover:bg-peach/50"}`}>
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-warm">Date</label>
              <input type="date" className="input-warm" value={memoryDate} onChange={(e) => setMemoryDate(e.target.value)} />
            </div>
            <div>
              <label className="label-warm">Location</label>
              <input type="text" className="input-warm" placeholder="Sunset Beach Park" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-body">{error}</p>}

          <button type="submit" disabled={submitting || !title.trim()} className="btn-primary w-full disabled:opacity-50">
            {submitting ? "Saving..." : "Save Memory 🐾"}
          </button>
        </form>
      </main>
    </div>
  );
}
