import { useState } from "react";
import { useCreateJob } from "../hooks/useJobs";
import { toast } from "sonner";

export function JobForm({ onSuccess }: { onSuccess?: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createJob = useCreateJob();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createJob({
        title: title.trim(),
        description: description.trim(),
        requiredSkills: requiredSkills.split(",").map(s => s.trim()).filter(Boolean),
        experienceLevel,
        location: location.trim(),
      });

      // Reset form
      setTitle("");
      setDescription("");
      setRequiredSkills("");
      setExperienceLevel("mid");
      setLocation("");

      toast.success("Job created successfully!");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create job: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Job Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Senior Software Engineer"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Job Description *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the role, responsibilities, and requirements..."
          required
        />
      </div>

      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
          Required Skills
        </label>
        <input
          id="skills"
          type="text"
          value={requiredSkills}
          onChange={(e) => setRequiredSkills(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., React, TypeScript, Node.js (comma-separated)"
        />
      </div>

      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
          Experience Level *
        </label>
        <select
          id="experience"
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="entry">Entry Level (0-2 years)</option>
          <option value="mid">Mid Level (3-6 years)</option>
          <option value="senior">Senior Level (7-11 years)</option>
          <option value="executive">Executive Level (12+ years)</option>
        </select>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location *
        </label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., San Francisco, CA or Remote"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Creating..." : "Create Job"}
      </button>
    </form>
  );
}
