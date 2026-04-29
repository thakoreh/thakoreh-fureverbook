import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    dogName: v.optional(v.string()),
    dogBreed: v.optional(v.string()),
    dogBirthday: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  memories: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    memoryDate: v.optional(v.string()),
    mood: v.optional(v.string()),
    location: v.optional(v.string()),
    isFeatured: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "createdAt"]),

  media: defineTable({
    memoryId: v.id("memories"),
    userId: v.id("users"),
    type: v.union(v.literal("photo"), v.literal("video")),
    filename: v.string(),
    originalName: v.optional(v.string()),
    caption: v.optional(v.string()),
    takenAt: v.optional(v.string()),
    isAiVariant: v.boolean(),
    aiStyle: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    createdAt: v.number(),
  })
    .index("by_memory", ["memoryId"])
    .index("by_user", ["userId"]),

  aiArt: defineTable({
    userId: v.id("users"),
    mediaId: v.optional(v.id("media")),
    style: v.string(),
    prompt: v.optional(v.string()),
    imageUrl: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
