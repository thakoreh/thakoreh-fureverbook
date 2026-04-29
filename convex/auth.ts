import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const signup = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    dogName: v.optional(v.string()),
    dogBreed: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("Email already registered");
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      dogName: args.dogName,
      dogBreed: args.dogBreed,
      createdAt: Date.now(),
    });

    return { userId: userId.toString() };
  },
});

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    return { userId: user._id.toString(), name: user.name, email: user.email };
  },
});

export const updateProfile = mutation({
  args: {
    userId: v.string(),
    name: v.optional(v.string()),
    dogName: v.optional(v.string()),
    dogBreed: v.optional(v.string()),
    dogBirthday: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId as any, {
      ...(args.name && { name: args.name }),
      ...(args.dogName !== undefined && { dogName: args.dogName }),
      ...(args.dogBreed !== undefined && { dogBreed: args.dogBreed }),
      ...(args.dogBirthday !== undefined && { dogBirthday: args.dogBirthday }),
    });
  },
});

export const getCurrentUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId as any) as { _id: string; email: string; name: string; dogName?: string; dogBreed?: string } | null;
    if (!user) return null;
    return { _id: user._id, email: user.email, name: user.name, dogName: user.dogName, dogBreed: user.dogBreed };
  },
});
