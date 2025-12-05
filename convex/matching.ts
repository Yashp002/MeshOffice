import { v } from "convex/values";
import { action, query, mutation } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

export const matchCandidates = action({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args): Promise<any[]> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Fetch job and candidates
    const job = await ctx.runQuery(api.jobs.get, { id: args.jobId });
    if (!job) {
      throw new Error("Job not found");
    }

    const candidates: any[] = await ctx.runQuery(api.candidates.list);

    // Clear existing matches for this job
    const existingMatches: any[] = await ctx.runQuery(api.matching.getJobMatches, { jobId: args.jobId });
    for (const match of existingMatches) {
      await ctx.runMutation(api.matching.deleteMatch, { matchId: match._id });
    }

    const matches: any[] = [];

    for (const candidate of candidates) {
      try {
        const matchResult = await analyzeMatch(job, candidate);
        
        // Store the match
        const matchId: any = await ctx.runMutation(api.matching.createMatchRecord, {
          jobId: args.jobId,
          candidateId: candidate._id,
          score: matchResult.score,
          reasoning: matchResult.reasoning,
        });

        matches.push({
          _id: matchId,
          jobId: args.jobId,
          candidateId: candidate._id,
          candidate,
          score: matchResult.score,
          reasoning: matchResult.reasoning,
        });
      } catch (error) {
        console.error(`Error matching candidate ${candidate._id}:`, error);
        // Continue with other candidates
      }
    }

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    return matches;
  },
});

export const getJobMatches = query({
  args: { jobId: v.optional(v.id("jobs")) },
  handler: async (ctx, args) => {
    // Return empty array if no jobId is provided
    const jobId = args.jobId;
    if (!jobId) {
      return [];
    }

    const MINIMUM_MATCH_SCORE = 40; // Only show matches with 40% or higher score

    const matches = await ctx.db
      .query("matches")
      .withIndex("by_job_score", (q) => q.eq("jobId", jobId))
      .order("desc")
      .collect();

    const enrichedMatches = [];
    for (const match of matches) {
      // Filter out matches below minimum threshold
      if (match.score < MINIMUM_MATCH_SCORE) {
        continue;
      }

      const candidate = await ctx.db.get(match.candidateId);
      if (candidate) {
        enrichedMatches.push({
          ...match,
          candidate,
        });
      }
    }

    return enrichedMatches;
  },
});

export const createMatchRecord = mutation({
  args: {
    jobId: v.id("jobs"),
    candidateId: v.id("candidates"),
    score: v.number(),
    reasoning: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }
    return await ctx.db.insert("matches", args);
  },
});

export const deleteMatch = mutation({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }
    await ctx.db.delete(args.matchId);
  },
});

async function analyzeMatch(job: any, candidate: any): Promise<{ score: number; reasoning: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set");
  }

  const prompt = `
You are an expert recruiter analyzing job-candidate matches. Analyze the following job and candidate, then provide a match score (0-100) and detailed reasoning.

JOB:
Title: ${job.title}
Description: ${job.description}
Required Skills: ${job.requiredSkills.join(", ")}
Experience Level: ${job.experienceLevel}
Location: ${job.location}

CANDIDATE:
Name: ${candidate.name}
Skills: ${candidate.skills.join(", ")}
Experience Years: ${candidate.experienceYears}
Location: ${candidate.location}
Resume: ${candidate.resumeText}

Please respond with a JSON object containing:
- score: A number from 0-100 representing the match quality
- reasoning: A detailed explanation of the match analysis, including strengths, weaknesses, and key factors

Consider:
1. Skill alignment (technical and soft skills)
2. Experience level match
3. Location compatibility
4. Overall qualifications from resume
5. Growth potential

Response format:
{
  "score": 85,
  "reasoning": "Detailed analysis here..."
}
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error("No response from Gemini API");
    }

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from Gemini API");
    }

    const result = JSON.parse(jsonMatch[0]);
    
    // Validate the response
    if (typeof result.score !== 'number' || typeof result.reasoning !== 'string') {
      throw new Error("Invalid response format from Gemini API");
    }

    // Ensure score is within bounds
    result.score = Math.max(0, Math.min(100, Math.round(result.score)));

    return result;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback to simple matching algorithm
    return fallbackMatch(job, candidate);
  }
}

function fallbackMatch(job: any, candidate: any): { score: number; reasoning: string } {
  let score = 0;
  const reasons = [];

  // Skill matching (40% weight)
  const jobSkills = job.requiredSkills.map((s: string) => s.toLowerCase());
  const candidateSkills = candidate.skills.map((s: string) => s.toLowerCase());
  const matchingSkills = jobSkills.filter((skill: string) => 
    candidateSkills.some((cSkill: string) => cSkill.includes(skill) || skill.includes(cSkill))
  );
  const skillScore = (matchingSkills.length / jobSkills.length) * 40;
  score += skillScore;
  reasons.push(`Skill match: ${matchingSkills.length}/${jobSkills.length} skills matched (${Math.round(skillScore)} points)`);

  // Experience level matching (30% weight)
  const experienceMap: Record<string, number> = { entry: 0, mid: 3, senior: 7, executive: 12 };
  const requiredExp = experienceMap[job.experienceLevel] || 0;
  const expDiff = Math.abs(candidate.experienceYears - requiredExp);
  const expScore = Math.max(0, 30 - (expDiff * 3));
  score += expScore;
  reasons.push(`Experience match: ${candidate.experienceYears} years vs ${job.experienceLevel} level (${Math.round(expScore)} points)`);

  // Location matching (20% weight)
  const locationScore = job.location.toLowerCase() === candidate.location.toLowerCase() ? 20 : 10;
  score += locationScore;
  reasons.push(`Location match: ${locationScore === 20 ? 'Exact' : 'Different'} location (${locationScore} points)`);

  // Resume keyword matching (10% weight)
  const resumeWords = candidate.resumeText.toLowerCase().split(/\s+/);
  const jobWords = (job.title + ' ' + job.description).toLowerCase().split(/\s+/);
  const commonWords = jobWords.filter(word => word.length > 3 && resumeWords.includes(word));
  const resumeScore = Math.min(10, commonWords.length);
  score += resumeScore;
  reasons.push(`Resume relevance: ${commonWords.length} relevant keywords found (${resumeScore} points)`);

  return {
    score: Math.round(Math.max(0, Math.min(100, score))),
    reasoning: `Fallback analysis: ${reasons.join('. ')}`
  };
}
