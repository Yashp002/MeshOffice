import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, DollarSign, X, Plus, Save, Building2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCreateJob } from "@/hooks/useJobs";

export default function JobIntake() {
  const { toast } = useToast();
  const createJob = useCreateJob();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    experienceLevel: "mid",
  });
  const [requirements, setRequirements] = useState<string[]>([]);
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = (list: string[], setList: (items: string[]) => void, item: string, setItem: (val: string) => void) => {
    if (item && !list.includes(item)) {
      setList([...list, item]);
      setItem("");
    }
  };

  const removeItem = (list: string[], setList: (items: string[]) => void, itemToRemove: string) => {
    setList(list.filter(item => item !== itemToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Title, Description).",
        variant: "destructive",
      });
      return;
    }

    if (requirements.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one required skill.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Combine description and responsibilities into a full description
      const fullDescription = formData.description + 
        (responsibilities.length > 0 
          ? "\n\nResponsibilities:\n" + responsibilities.map((r, i) => `${i + 1}. ${r}`).join("\n")
          : "");

      await createJob({
        title: formData.title,
        description: fullDescription,
        requiredSkills: requirements,
        experienceLevel: formData.experienceLevel,
        location: formData.location || "Remote",
      });

      toast({
        title: "Job Posted",
        description: `${formData.title} has been added to open positions.`,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        location: "",
        experienceLevel: "mid",
      });
      setRequirements([]);
      setResponsibilities([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to post job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-semibold text-foreground font-mono"
          >
            Job Intake
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs text-muted-foreground font-mono mt-1"
          >
            Create a new job posting
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <GlassCard
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              Job Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="title" className="text-xs">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="Senior Frontend Developer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-secondary border-border text-xs font-mono"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="location" className="text-xs">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Remote, New York, etc."
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-secondary border-border text-xs font-mono pl-7"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="experienceLevel" className="text-xs">Experience Level</Label>
                <select
                  id="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="w-full h-9 bg-secondary border border-border px-2 text-xs font-mono text-foreground focus:outline-none"
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <Label htmlFor="description" className="text-xs">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-secondary border-border text-xs font-mono min-h-[120px] resize-none mt-1"
                required
              />
            </div>
          </GlassCard>

          {/* Requirements (Skills) */}
          <GlassCard
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-sm font-semibold text-foreground mb-4">Required Skills *</h2>
            
            <div className="space-y-2 mb-3">
              {requirements.map((req, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 p-2 bg-secondary border border-border"
                >
                  <span className="w-5 h-5 border border-border text-[10px] flex items-center justify-center text-muted-foreground font-mono">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-xs text-foreground font-mono">{req}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(requirements, setRequirements, req)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="add_requirement..."
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem(requirements, setRequirements, newRequirement, setNewRequirement))}
                className="bg-secondary border-border text-xs font-mono"
              />
              <Button 
                type="button" 
                variant="outline"
                size="sm"
                onClick={() => addItem(requirements, setRequirements, newRequirement, setNewRequirement)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </GlassCard>

          {/* Responsibilities */}
          <GlassCard
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="text-sm font-semibold text-foreground mb-4">Responsibilities</h2>
            
            <div className="space-y-2 mb-3">
              {responsibilities.map((resp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 p-2 bg-secondary border border-border"
                >
                  <span className="w-5 h-5 border border-border text-[10px] flex items-center justify-center text-muted-foreground font-mono">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-xs text-foreground font-mono">{resp}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(responsibilities, setResponsibilities, resp)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="add_responsibility..."
                value={newResponsibility}
                onChange={(e) => setNewResponsibility(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem(responsibilities, setResponsibilities, newResponsibility, setNewResponsibility))}
                className="bg-secondary border-border text-xs font-mono"
              />
              <Button 
                type="button" 
                variant="outline"
                size="sm"
                onClick={() => addItem(responsibilities, setResponsibilities, newResponsibility, setNewResponsibility)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </GlassCard>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline">
              Save Draft
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-3 h-3 mr-2" />
              {isSubmitting ? "Posting..." : "Post Job"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
