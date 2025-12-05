import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  jobs: defineTable({
    title: v.string(),
    description: v.string(),
    requiredSkills: v.array(v.string()),
    experienceLevel: v.string(), // "entry", "mid", "senior", "executive"
    location: v.string(),
    createdBy: v.id("users"),
  }).index("by_created_by", ["createdBy"]),

  candidates: defineTable({
    name: v.string(),
    email: v.string(),
    resumeText: v.string(),
    skills: v.array(v.string()),
    experienceYears: v.number(),
    location: v.string(),
  }).index("by_email", ["email"]),

  matches: defineTable({
    jobId: v.id("jobs"),
    candidateId: v.id("candidates"),
    score: v.number(), // 0-100
    reasoning: v.string(),
  }).index("by_job", ["jobId"])
    .index("by_candidate", ["candidateId"])
    .index("by_job_score", ["jobId", "score"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
