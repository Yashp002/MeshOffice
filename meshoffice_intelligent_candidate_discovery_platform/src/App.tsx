import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import { JobForm } from "./components/JobForm";
import { CandidateForm } from "./components/CandidateForm";
import { JobList } from "./components/JobList";
import { CandidateList } from "./components/CandidateList";
import { MatchResults } from "./components/MatchResults";
import { Id } from "../convex/_generated/dataModel";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-blue-600">MeshOffice ICDP</h2>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>
      <main className="flex-1 p-8">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [activeTab, setActiveTab] = useState<"jobs" | "candidates" | "matches">("jobs");
  const [selectedJobId, setSelectedJobId] = useState<Id<"jobs"> | null>(null);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Intelligent Candidate Discovery Platform
        </h1>
        <Authenticated>
          <p className="text-xl text-gray-600">
            Welcome back, {loggedInUser?.email ?? "friend"}!
          </p>
        </Authenticated>
        <Unauthenticated>
          <p className="text-xl text-gray-600">Sign in to get started</p>
        </Unauthenticated>
      </div>

      <Unauthenticated>
        <div className="max-w-md mx-auto">
          <SignInForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="space-y-8">
          {/* Navigation Tabs */}
          <div className="flex justify-center">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("jobs")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "jobs"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Jobs
              </button>
              <button
                onClick={() => setActiveTab("candidates")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "candidates"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Candidates
              </button>
              <button
                onClick={() => setActiveTab("matches")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "matches"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Match Results
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "jobs" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Create Job Posting</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <JobForm onSuccess={() => {}} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Job Postings</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <JobList 
                    onJobSelect={(jobId) => {
                      setSelectedJobId(jobId);
                      setActiveTab("matches");
                    }} 
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "candidates" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Add Candidate</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <CandidateForm onSuccess={() => {}} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Candidate Database</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <CandidateList />
                </div>
              </div>
            </div>
          )}

          {activeTab === "matches" && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Candidate Matches</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {selectedJobId ? (
                  <MatchResults jobId={selectedJobId} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Select a job from the Jobs tab and click "Find Candidates" to see matches here.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Authenticated>
    </div>
  );
}
