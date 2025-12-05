import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("candidates").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("candidates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    resumeText: v.string(),
    skills: v.array(v.string()),
    experienceYears: v.number(),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Check if candidate with this email already exists
    const existingCandidate = await ctx.db
      .query("candidates")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingCandidate) {
      throw new Error("Candidate with this email already exists");
    }

    return await ctx.db.insert("candidates", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("candidates"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    resumeText: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    experienceYears: v.optional(v.number()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const { id, ...updates } = args;
    const candidate = await ctx.db.get(id);
    
    if (!candidate) {
      throw new Error("Candidate not found");
    }

    // If updating email, check for duplicates
    if (updates.email && updates.email !== candidate.email) {
      const existingCandidate = await ctx.db
        .query("candidates")
        .withIndex("by_email", (q) => q.eq("email", updates.email!))
        .unique();

      if (existingCandidate) {
        throw new Error("Candidate with this email already exists");
      }
    }

    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(id, filteredUpdates);
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("candidates") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const candidate = await ctx.db.get(args.id);
    
    if (!candidate) {
      throw new Error("Candidate not found");
    }

    await ctx.db.delete(args.id);
  },
});
