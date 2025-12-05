import { useJobs } from "../hooks/useJobs";
import { useMatchCandidates } from "../hooks/useMatching";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

export function JobList({ onJobSelect }: { onJobSelect?: (jobId: Id<"jobs">) => void }) {
  const jobs = useJobs();
  const matchCandidates = useMatchCandidates();
  const [matchingJobId, setMatchingJobId] = useState<Id<"jobs"> | null>(null);

  const handleMatchCandidates = async (jobId: Id<"jobs">) => {
    setMatchingJobId(jobId);
    try {
      await matchCandidates({ jobId });
      toast.success("Candidates matched successfully!");
      onJobSelect?.(jobId);
    } catch (error) {
      toast.error("Failed to match candidates: " + (error as Error).message);
    } finally {
      setMatchingJobId(null);
    }
  };

  if (jobs === undefined) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No jobs posted yet. Create your first job posting!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <span className="text-sm text-gray-500 capitalize">{job.experienceLevel}</span>
          </div>
          
          <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {job.requiredSkills.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">📍 {job.location}</span>
            <button
              onClick={() => handleMatchCandidates(job._id)}
              disabled={matchingJobId === job._id}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {matchingJobId === job._id ? "Matching..." : "Find Candidates"}
            </button>
          </div>
          
          <div className="text-xs text-gray-400 mt-2">
            Created {new Date(job._creationTime).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
