"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dogName: "",
    dogBreed: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup({
        email: form.email,
        password: form.password,
        name: form.name,
        dogName: form.dogName || undefined,
        dogBreed: form.dogBreed || undefined,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-peach/40 via-pink/20 to-coral/10 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 left-10 text-chocolate/10 animate-float-slow">
          <svg className="w-20 h-20" viewBox="0 0 60 60" fill="currentColor">
            <circle cx="30" cy="30" r="6" /><circle cx="20" cy="20" r="4" /><circle cx="40" cy="20" r="4" />
            <circle cx="14" cy="30" r="3.5" /><circle cx="46" cy="30" r="3.5" /><circle cx="20" cy="40" r="4" /><circle cx="40" cy="40" r="4" />
          </svg>
        </div>
        <div className="absolute bottom-20 right-10 text-chocolate/10 animate-float">
          <svg className="w-24 h-12" viewBox="0 0 100 40" fill="currentColor">
            <ellipse cx="12" cy="12" rx="10" ry="10" /><ellipse cx="12" cy="28" rx="10" ry="10" />
            <ellipse cx="88" cy="12" rx="10" ry="10" /><ellipse cx="88" cy="28" rx="10" ry="10" />
            <rect x="10" y="14" width="80" height="12" rx="6" />
          </svg>
        </div>
        <div className="relative z-10 text-center max-w-md">
          <h2 className="font-heading text-4xl font-bold text-chocolate mb-6">Every tail wag deserves to be remembered</h2>
          <p className="font-body text-chocolate/70 text-lg">Create a beautiful memory book for your dog. Upload photos, make collages, and watch their story come alive.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <span className="text-2xl">🐾</span>
            <span className="font-heading text-2xl font-bold text-chocolate">Fureverbook</span>
          </Link>

          <h1 className="font-heading text-3xl font-bold text-chocolate mb-2">Create your journal</h1>
          <p className="font-body text-chocolate/60 mb-8">Start preserving your dog&apos;s memories today — it&apos;s free.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-warm">Your name</label>
              <input type="text" required className="input-warm" placeholder="Alex" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label-warm">Email</label>
              <input type="email" required className="input-warm" placeholder="alex@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label-warm">Password</label>
              <input type="password" required className="input-warm" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-warm">Dog&apos;s name</label>
                <input type="text" className="input-warm" placeholder="Charlie" value={form.dogName} onChange={(e) => setForm({ ...form, dogName: e.target.value })} />
              </div>
              <div>
                <label className="label-warm">Breed</label>
                <input type="text" className="input-warm" placeholder="Golden Retriever" value={form.dogBreed} onChange={(e) => setForm({ ...form, dogBreed: e.target.value })} />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm font-body">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? "Creating..." : "Create Free Journal 🐾"}
            </button>
          </form>

          <p className="text-center mt-6 font-body text-sm text-chocolate/60">
            Already have an account? <Link href="/login" className="text-coral font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
