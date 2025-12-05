import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Search, Filter, Mail, ExternalLink, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useJobs } from "@/hooks/useJobs";
import { useMatchCandidates, useJobMatches } from "@/hooks/useMatching";
import { Id } from "../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

export default function MatchingEngine() {
  const { toast } = useToast();
  const jobs = useJobs();
  const matchCandidates = useMatchCandidates();
  const [selectedJobId, setSelectedJobId] = useState<Id<"jobs"> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  
  // Get matches for selected job (only query when jobId is selected)
  const matches = useJobMatches(selectedJobId);
  
  // Set first job as selected when jobs load
  useEffect(() => {
    if (jobs && jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0]._id);
    }
  }, [jobs, selectedJobId]);

  const selectedJob = jobs?.find(j => j._id === selectedJobId);
  
  const filteredMatches = (matches || [])
    .filter(match => {
      if (!searchQuery) return true;
      const candidate = match.candidate;
      const query = searchQuery.toLowerCase();
      return candidate.name.toLowerCase().includes(query) ||
             candidate.skills.some((s: string) => s.toLowerCase().includes(query));
    });

  const handleMatch = async () => {
    if (!selectedJobId) {
      toast({
        title: "No Job Selected",
        description: "Please select a job first.",
        variant: "destructive",
      });
      return;
    }

    setIsMatching(true);
    try {
      await matchCandidates({ jobId: selectedJobId });
      toast({
        title: "Matching Complete",
        description: "Candidates have been matched successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Matching Failed",
        description: error.message || "Failed to match candidates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-semibold text-foreground font-mono flex items-center gap-2"
            >
              <Zap className="w-5 h-5 text-muted-foreground" />
              Matching Engine
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xs text-muted-foreground font-mono mt-1"
            >
              AI-powered semantic matching
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Job Selection */}
          <GlassCard
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Select Job</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMatch}
                disabled={!selectedJobId || isMatching}
                className="text-xs"
              >
                {isMatching ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Matching...
                  </>
                ) : (
                  <>
                    <Zap className="w-3 h-3 mr-1" />
                    Match
                  </>
                )}
              </Button>
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin">
              {jobs === undefined ? (
                <div className="text-xs text-muted-foreground font-mono p-3 text-center">Loading jobs...</div>
              ) : jobs.length === 0 ? (
                <div className="text-xs text-muted-foreground font-mono p-3 text-center">No jobs found. Create a job first.</div>
              ) : (
                jobs.map((job) => (
                  <button
                    key={job._id}
                    onClick={() => setSelectedJobId(job._id)}
                    className={cn(
                      "w-full p-3 border text-left transition-all duration-150",
                      selectedJobId === job._id
                        ? "border-foreground/50 bg-secondary"
                        : "border-border hover:border-muted-foreground/30 bg-card"
                    )}
                  >
                    <h3 className="text-xs font-semibold text-foreground font-mono">{job.title}</h3>
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono">{job.location} / {job.experienceLevel}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.requiredSkills.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="text-[9px] font-mono border border-border">
                          {skill}
                        </Badge>
                      ))}
                      {job.requiredSkills.length > 3 && (
                        <Badge variant="secondary" className="text-[9px] font-mono border border-border">
                          +{job.requiredSkills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </GlassCard>

          {/* Matched Candidates */}
          <GlassCard
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Ranked Candidates</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input
                    placeholder="search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-secondary border-border text-xs font-mono pl-7 w-48"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-3 h-3 mr-1" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {!selectedJobId ? (
                <div className="text-xs text-muted-foreground font-mono p-8 text-center">
                  Select a job to view matches
                </div>
              ) : matches === undefined ? (
                <div className="text-xs text-muted-foreground font-mono p-8 text-center">
                  <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                  Loading matches...
                </div>
              ) : filteredMatches.length === 0 ? (
                <div className="text-xs text-muted-foreground font-mono p-8 text-center">
                  {searchQuery ? "No matches found for your search" : "No matches yet. Click 'Match' to generate matches."}
                </div>
              ) : (
                filteredMatches.map((match, index) => {
                  const candidate = match.candidate;
                  const score = match.score;
                  
                  return (
                    <motion.div
                      key={match._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 + index * 0.05 }}
                      className="p-3 border border-border bg-secondary/30 hover:border-muted-foreground/30 transition-all duration-150"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          {/* Rank */}
                          <div className={cn(
                            "w-8 h-8 border flex items-center justify-center text-xs font-mono shrink-0",
                            index === 0 ? "border-foreground text-foreground" :
                            index === 1 ? "border-muted-foreground text-muted-foreground" :
                            index === 2 ? "border-muted text-muted-foreground" :
                            "border-border text-muted-foreground"
                          )}>
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs font-semibold text-foreground font-mono">{candidate.name}</h3>
                            <p className="text-[10px] text-muted-foreground font-mono">{candidate.email} • {candidate.experienceYears} years exp • {candidate.location}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {candidate.skills.slice(0, 4).map((skill: string) => (
                                <Badge 
                                  key={skill} 
                                  variant="secondary"
                                  className="text-[9px] font-mono border border-border px-1.5 py-0"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {candidate.skills.length > 4 && (
                                <Badge variant="secondary" className="text-[9px] font-mono border border-border px-1.5 py-0">
                                  +{candidate.skills.length - 4}
                                </Badge>
                              )}
                            </div>
                            {match.reasoning && (
                              <p className="text-[10px] text-muted-foreground font-mono mt-2 line-clamp-2">
                                {match.reasoning}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Match Score */}
                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">match:</span>
                            <div className={cn(
                              "text-lg font-semibold font-mono",
                              score >= 90 ? "text-success" :
                              score >= 80 ? "text-foreground" :
                              score >= 70 ? "text-warning" :
                              "text-muted-foreground"
                            )}>
                              {Math.round(score)}%
                            </div>
                          </div>
                          
                          {/* Score Bar */}
                          <div className="w-20 h-1 bg-border mt-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${score}%` }}
                              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                              className={cn(
                                "h-full",
                                score >= 90 ? "bg-success" :
                                score >= 80 ? "bg-foreground" :
                                score >= 70 ? "bg-warning" :
                                "bg-muted-foreground"
                              )}
                            />
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 mt-2">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Mail className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </AppLayout>
  );
}
