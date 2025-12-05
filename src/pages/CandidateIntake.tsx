import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Mail, Briefcase, FileText, X, Plus, Save } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCreateCandidate } from "@/hooks/useCandidates";

const suggestedSkills = [
  "React", "TypeScript", "Node.js", "Python", "AWS", "Docker", 
  "Kubernetes", "PostgreSQL", "MongoDB", "GraphQL", "REST API", "Git"
];

export default function CandidateIntake() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const createCandidate = useCreateCandidate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    experience: "",
    resume: "",
    location: "",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.resume) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Email, Resume).",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createCandidate({
        name: formData.name,
        email: formData.email,
        resumeText: formData.resume,
        skills: skills,
        experienceYears: parseInt(formData.experience) || 0,
        location: formData.location || "Not specified",
      });

      toast({
        title: "Candidate Added",
        description: `${formData.name} has been added to the system.`,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        title: "",
        experience: "",
        resume: "",
        location: "",
      });
      setSkills([]);
      
      // Optionally navigate to candidates list
      // navigate("/candidates");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add candidate. Please try again.",
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
            Candidate Intake
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs text-muted-foreground font-mono mt-1"
          >
            Add a new candidate to the system
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
              <User className="w-4 h-4 text-muted-foreground" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs">Full Name</Label>
                <Input
                  id="name"
                  placeholder="john_doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-secondary border-border text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-secondary border-border text-xs font-mono pl-7"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="title" className="text-xs">Current Title</Label>
                <div className="relative">
                  <Briefcase className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input
                    id="title"
                    placeholder="senior_developer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-secondary border-border text-xs font-mono pl-7"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="experience" className="text-xs">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  placeholder="5"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="bg-secondary border-border text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="location" className="text-xs">Location</Label>
                <Input
                  id="location"
                  placeholder="Remote, New York, etc."
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-secondary border-border text-xs font-mono"
                />
              </div>
            </div>
          </GlassCard>

          {/* Skills */}
          <GlassCard
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-sm font-semibold text-foreground mb-4">Skills</h2>
            
            {/* Selected Skills */}
            <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
              {skills.map((skill) => (
                <motion.div
                  key={skill}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="text-xs font-mono border border-border px-2 py-0.5"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </Badge>
                </motion.div>
              ))}
              {skills.length === 0 && (
                <span className="text-muted-foreground text-xs font-mono">No skills added</span>
              )}
            </div>

            {/* Add Skill Input */}
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="add_skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill(newSkill))}
                className="bg-secondary border-border text-xs font-mono"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => addSkill(newSkill)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {/* Suggested Skills */}
            <div>
              <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Suggested:</p>
              <div className="flex flex-wrap gap-1">
                {suggestedSkills
                  .filter(skill => !skills.includes(skill))
                  .slice(0, 8)
                  .map((skill) => (
                    <Button
                      key={skill}
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addSkill(skill)}
                      className="text-[10px] text-muted-foreground hover:text-foreground h-6 px-2"
                    >
                      + {skill}
                    </Button>
                  ))}
              </div>
            </div>
          </GlassCard>

          {/* Resume */}
          <GlassCard
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Resume / Summary
            </h2>
            <Textarea
              placeholder="Paste candidate resume or summary..."
              value={formData.resume}
              onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
              className="bg-secondary border-border text-xs font-mono min-h-[150px] resize-none"
            />
            <p className="text-[10px] text-muted-foreground mt-2 font-mono">
              Used for AI-powered matching and analysis
            </p>
          </GlassCard>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-3 h-3 mr-2" />
              {isSubmitting ? "Saving..." : "Save Candidate"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
