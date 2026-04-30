"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
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
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-white shadow-none border-0",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
