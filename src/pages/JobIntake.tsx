import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, DollarSign, X, Plus, Save, Building2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function JobIntake() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    salaryMin: "",
    salaryMax: "",
  });
  const [requirements, setRequirements] = useState<string[]>([]);
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");

  const addItem = (list: string[], setList: (items: string[]) => void, item: string, setItem: (val: string) => void) => {
    if (item && !list.includes(item)) {
      setList([...list, item]);
      setItem("");
    }
  };

  const removeItem = (list: string[], setList: (items: string[]) => void, itemToRemove: string) => {
    setList(list.filter(item => item !== itemToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting job:", { ...formData, requirements, responsibilities });
    toast({
      title: "Job Posted",
      description: `${formData.title} has been added to open positions.`,
    });
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
              <div className="space-y-1">
                <Label htmlFor="title" className="text-xs">Job Title</Label>
                <Input
                  id="title"
                  placeholder="senior_frontend_dev"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-secondary border-border text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="department" className="text-xs">Department</Label>
                <div className="relative">
                  <Building2 className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input
                    id="department"
                    placeholder="engineering"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="bg-secondary border-border text-xs font-mono pl-7"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="location" className="text-xs">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="remote"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-secondary border-border text-xs font-mono pl-7"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="type" className="text-xs">Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full h-9 bg-secondary border border-border px-2 text-xs font-mono text-foreground focus:outline-none"
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Freelance</option>
                </select>
              </div>
            </div>

            {/* Salary Range */}
            <div className="mt-4">
              <Label className="text-xs">Salary Range</Label>
              <div className="flex items-center gap-3 mt-1">
                <div className="relative flex-1">
                  <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input
                    placeholder="120000"
                    value={formData.salaryMin}
                    onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                    className="bg-secondary border-border text-xs font-mono pl-7"
                  />
                </div>
                <span className="text-xs text-muted-foreground">to</span>
                <div className="relative flex-1">
                  <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input
                    placeholder="160000"
                    value={formData.salaryMax}
                    onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                    className="bg-secondary border-border text-xs font-mono pl-7"
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Requirements */}
          <GlassCard
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-sm font-semibold text-foreground mb-4">Requirements</h2>
            
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
            <Button type="submit">
              <Save className="w-3 h-3 mr-2" />
              Post Job
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
