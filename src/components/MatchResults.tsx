import { useJobMatches } from "../hooks/useMatching";
import { useJob } from "../hooks/useJobs";
import { Id } from "../../convex/_generated/dataModel";

interface MatchResultsProps {
  jobId: Id<"jobs">;
}

export function MatchResults({ jobId }: MatchResultsProps) {
  const job = useJob(jobId);
  const matches = useJobMatches(jobId);

  if (job === undefined || matches === undefined) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-8 text-red-500">
        Job not found.
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Fair Match";
    return "Poor Match";
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-blue-900 mb-2">
          Matching Results for: {job.title}
        </h2>
        <p className="text-blue-700">
          Found {matches.length} candidate{matches.length !== 1 ? 's' : ''} in the database
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No candidates found. Add some candidates to see matches!
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{match.candidate.name}</h3>
                  <p className="text-gray-600">{match.candidate.email}</p>
                  <p className="text-sm text-gray-500">
                    {match.candidate.experienceYears} years experience • {match.candidate.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(match.score)}`}>
                    {match.score}% Match
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getScoreLabel(match.score)}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {match.candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Resume Summary:</h4>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {match.candidate.resumeText}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Match Analysis:</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  {match.reasoning}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
