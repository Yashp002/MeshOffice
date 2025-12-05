import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useCandidates() {
  return useQuery(api.candidates.list);
}

export function useCandidate(id: Id<"candidates">) {
  return useQuery(api.candidates.get, { id });
}

export function useCreateCandidate() {
  return useMutation(api.candidates.create);
}

export function useUpdateCandidate() {
  return useMutation(api.candidates.update);
}

export function useDeleteCandidate() {
  return useMutation(api.candidates.remove);
}
