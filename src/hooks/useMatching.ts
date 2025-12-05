import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useMatchCandidates() {
  return useAction(api.matching.matchCandidates);
}

export function useJobMatches(jobId: Id<"jobs"> | null | undefined) {
  // Pass undefined to skip the query when jobId is null/undefined
  return useQuery(
    api.matching.getJobMatches,
    jobId ? { jobId } : undefined
  );
}
