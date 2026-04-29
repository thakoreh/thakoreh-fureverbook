"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
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
        <div className="relative z-10 text-center max-w-md">
          <h2 className="font-heading text-4xl font-bold text-chocolate mb-6">Welcome back to your memories</h2>
          <p className="font-body text-chocolate/70 text-lg">Your dog&apos;s best moments are waiting for you.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <span className="text-2xl">🐾</span>
            <span className="font-heading text-2xl font-bold text-chocolate">Fureverbook</span>
          </Link>

          <h1 className="font-heading text-3xl font-bold text-chocolate mb-2">Welcome back</h1>
          <p className="font-body text-chocolate/60 mb-8">Sign in to continue your memory journal.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-warm">Email</label>
              <input type="email" required className="input-warm" placeholder="alex@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label-warm">Password</label>
              <input type="password" required className="input-warm" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            {error && <p className="text-red-500 text-sm font-body">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In 🐾"}
            </button>
          </form>

          <p className="text-center mt-6 font-body text-sm text-chocolate/60">
            Don&apos;t have an account? <Link href="/signup" className="text-coral font-semibold hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
