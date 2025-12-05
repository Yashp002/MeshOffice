import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useJobs() {
  return useQuery(api.jobs.list);
}

export function useJob(id: Id<"jobs">) {
  return useQuery(api.jobs.get, { id });
}

export function useCreateJob() {
  return useMutation(api.jobs.create);
}

export function useUpdateJob() {
  return useMutation(api.jobs.update);
}

export function useDeleteJob() {
  return useMutation(api.jobs.remove);
}
