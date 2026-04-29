import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.userId) return [];
    const memories = await ctx.db
      .query("memories")
      .withIndex("by_user", (q) => q.eq("userId", args.userId as any))
      .collect();

    return Promise.all(
      memories.map(async (m) => {
        const media = await ctx.db
          .query("media")
          .withIndex("by_memory", (q) => q.eq("memoryId", m._id))
          .collect();

        const mediaWithUrls = await Promise.all(
          media.map(async (item) => ({
            ...item,
            url: item.storageId
              ? await ctx.storage.getUrl(item.storageId)
              : null,
          }))
        );

        return {
          ...m,
          media: mediaWithUrls,
        };
      })
    );
  },
});

export const getById = query({
  args: { id: v.id("memories") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const memory = await ctx.db.get(args.id);
    if (!memory) return null;

    const media = await ctx.db
      .query("media")
      .withIndex("by_memory", (q) => q.eq("memoryId", memory._id))
      .collect();

    const mediaWithUrls = await Promise.all(
      media.map(async (item) => ({
        ...item,
        url: item.storageId ? await ctx.storage.getUrl(item.storageId) : null,
      }))
    );

    return { ...memory, media: mediaWithUrls };
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    memoryDate: v.optional(v.string()),
    mood: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const memoryId = await ctx.db.insert("memories", {
      userId: args.userId as any,
      title: args.title,
      description: args.description,
      memoryDate: args.memoryDate,
      mood: args.mood,
      location: args.location,
      isFeatured: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { memoryId: memoryId.toString() };
  },
});

export const addMedia = mutation({
  args: {
    userId: v.string(),
    memoryId: v.string(),
    type: v.union(v.literal("photo"), v.literal("video")),
    filename: v.string(),
    originalName: v.optional(v.string()),
    caption: v.optional(v.string()),
    takenAt: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const mediaId = await ctx.db.insert("media", {
      memoryId: args.memoryId as any,
      userId: args.userId as any,
      type: args.type,
      filename: args.filename,
      originalName: args.originalName,
      caption: args.caption,
      takenAt: args.takenAt,
      isAiVariant: false,
      createdAt: Date.now(),
      storageId: args.storageId,
    });

    return { mediaId: mediaId.toString() };
  },
});

export const getUploadUrl = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const remove = mutation({
  args: { userId: v.string(), id: v.string() },
  handler: async (ctx, args) => {
    const memory = await ctx.db.get(args.id as any) as { userId: string } | null;
    if (!memory) throw new Error("Memory not found");
    if (memory.userId !== args.userId) throw new Error("Not authorized");
    await ctx.db.delete(args.id as any);
  },
});
