import { useCandidates } from "../hooks/useCandidates";

export function CandidateList() {
  const candidates = useCandidates();

  if (candidates === undefined) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No candidates in the database yet. Add your first candidate!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {candidates.map((candidate) => (
        <div key={candidate._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
            <span className="text-sm text-gray-500">{candidate.experienceYears} years exp</span>
          </div>
          
          <p className="text-gray-600 mb-2">{candidate.email}</p>
          
          <p className="text-gray-600 mb-3 line-clamp-3">{candidate.resumeText}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {candidate.skills.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">📍 {candidate.location}</span>
            <div className="text-xs text-gray-400">
              Added {new Date(candidate._creationTime).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
