import { useState } from "react";
import { useCreateCandidate } from "../hooks/useCandidates";
import { toast } from "sonner";

export function CandidateForm({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [skills, setSkills] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createCandidate = useCreateCandidate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !resumeText.trim() || !location.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const expYears = parseInt(experienceYears);
    if (isNaN(expYears) || expYears < 0) {
      toast.error("Please enter a valid number of experience years");
      return;
    }

    setIsSubmitting(true);
    try {
      await createCandidate({
        name: name.trim(),
        email: email.trim(),
        resumeText: resumeText.trim(),
        skills: skills.split(",").map(s => s.trim()).filter(Boolean),
        experienceYears: expYears,
        location: location.trim(),
      });

      // Reset form
      setName("");
      setEmail("");
      setResumeText("");
      setSkills("");
      setExperienceYears("");
      setLocation("");

      toast.success("Candidate added successfully!");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to add candidate: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., John Doe"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="john.doe@example.com"
          required
        />
      </div>

      <div>
        <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
          Resume/Bio *
        </label>
        <textarea
          id="resume"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste resume text or write a brief professional bio..."
          required
        />
      </div>

      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
          Skills
        </label>
        <input
          id="skills"
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., JavaScript, Python, Project Management (comma-separated)"
        />
      </div>

      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
          Years of Experience *
        </label>
        <input
          id="experience"
          type="number"
          min="0"
          max="50"
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 5"
          required
        />
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
          placeholder="e.g., New York, NY or Remote"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Adding..." : "Add Candidate"}
      </button>
    </form>
  );
}
