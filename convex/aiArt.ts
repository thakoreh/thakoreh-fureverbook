import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return [];

    const artworks = await ctx.db
      .query("aiArt")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return artworks;
  },
});

export const generate = mutation({
  args: {
    style: v.string(),
    imageUrl: v.optional(v.string()),
    prompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    const styles: Record<string, string> = {
      watercolor:
        "beautiful watercolor portrait of this dog, soft pastel colors, artistic, hand-painted look",
      pixar:
        "Pixar-style 3D animated character of this dog, big expressive eyes, charming, colorful background",
      fantasy:
        "majestic fantasy hero dog, wearing armor, epic fantasy art style, dramatic lighting",
      renaissance:
        "classical renaissance oil painting portrait of this dog, ornate frame, museum quality",
      comic:
        "comic book style illustration of this dog, bold lines, vibrant colors, action pose",
      beach:
        "this dog relaxing on a tropical beach, palm trees, sunset, vacation vibes",
      space: "this dog as a space explorer, wearing astronaut suit, floating in space, stars and galaxies",
      royal: "this dog wearing a royal crown and cape, regal pose, royal palace background",
    };

    const stylePrompt = styles[args.style] || args.prompt || "beautiful dog portrait";
    const promptText = args.imageUrl
      ? `${stylePrompt}, reference image: ${args.imageUrl}`
      : stylePrompt;

    const encodedPrompt = encodeURIComponent(promptText);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true`;

    const artworkId = await ctx.db.insert("aiArt", {
      userId: user._id,
      style: args.style,
      prompt: promptText,
      imageUrl,
      createdAt: Date.now(),
    });

    return { artworkId, imageUrl };
  },
});
