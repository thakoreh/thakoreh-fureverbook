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
    console.log("signup called with email:", args.email);
    // Check for existing email (scan all users - acceptable for small user counts)
    const allUsers = await ctx.db.query("users").collect();
    console.log("Total users:", allUsers.length);
    const existing = allUsers.find((u) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const email = (u as any).email;
      return email === args.email;
    });
    if (existing) throw new Error("Email already registered");

    const userId = await ctx.db.insert("users", {
      email: args.email,
      passwordHash: args.password, // TODO: hash in production!
      name: args.name,
      dogName: args.dogName ?? "",
      dogBreed: args.dogBreed ?? "",
      createdAt: Date.now(),
    });
    console.log("signup: userId created:", userId.toString());
    return { userId: userId.toString() };
  },
});

export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const allUsers = await ctx.db.query("users").collect();
    const user = allUsers.find((u) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const email = (u as any).email;
      const passwordHash = (u as any).passwordHash;
      return email === args.email && passwordHash === args.password;
    });
    if (!user) throw new Error("Invalid email or password");
    return { userId: (user as any)._id };
  },
});

export const getCurrentUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    if (!args.userId || args.userId.length < 21) return null;
    // Use filter-based lookup instead of db.get to avoid Id type issues
    const allUsers = await ctx.db.query("users").collect();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = allUsers.find((u) => String((u as any)._id) === String(args.userId));
    if (!user) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const u = user as any;
    if (u.email === undefined) return null;
    return { _id: u._id, email: u.email, name: u.name ?? "", dogName: u.dogName, dogBreed: u.dogBreed };
  },
});
