import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get or create a user from Clerk identity
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Look up user by Clerk subject (identity.subject) stored in email field
    // We use the Clerk user ID as the lookup key
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();

    if (!user) return null;

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      dogName: user.dogName,
      dogBreed: user.dogBreed,
    };
  },
});

// Ensure a user exists in our DB when they sign up via Clerk
export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const email = identity.email ?? "";
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) return existing._id;

    // Create user from Clerk data
    const userId = await ctx.db.insert("users", {
      email,
      name: (identity.fullName ?? identity.givenName ?? "Dog Parent") as string,
      passwordHash: "", // No longer needed — Clerk handles auth
      dogName: "",
      dogBreed: "",
      createdAt: Date.now(),
    });

    return userId;
  },
});
