import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Search, Filter, Mail, ExternalLink } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockCandidates, mockJobs } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function MatchingEngine() {
  const [selectedJob, setSelectedJob] = useState(mockJobs[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCandidates = mockCandidates
    .filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => b.matchScore - a.matchScore);

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
            <h2 className="text-sm font-semibold text-foreground mb-3">Select Job</h2>
            <div className="space-y-2">
              {mockJobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={cn(
                    "w-full p-3 border text-left transition-all duration-150",
                    selectedJob.id === job.id
                      ? "border-foreground/50 bg-secondary"
                      : "border-border hover:border-muted-foreground/30 bg-card"
                  )}
                >
                  <h3 className="text-xs font-semibold text-foreground font-mono">{job.title}</h3>
                  <p className="text-[10px] text-muted-foreground mt-1 font-mono">{job.department} / {job.location}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-[10px] font-mono border border-border">
                      {job.applicants} applicants
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-[10px] font-mono border",
                        job.status === "open" ? "border-success/30 text-success" : "border-warning/30 text-warning"
                      )}
                    >
                      {job.status}
                    </Badge>
                  </div>
                </button>
              ))}
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
              {filteredCandidates.map((candidate, index) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                  className="p-3 border border-border bg-secondary/30 hover:border-muted-foreground/30 transition-all duration-150"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {/* Rank */}
                      <div className={cn(
                        "w-8 h-8 border flex items-center justify-center text-xs font-mono",
                        index === 0 ? "border-foreground text-foreground" :
                        index === 1 ? "border-muted-foreground text-muted-foreground" :
                        index === 2 ? "border-muted text-muted-foreground" :
                        "border-border text-muted-foreground"
                      )}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      
                      {/* Info */}
                      <div>
                        <h3 className="text-xs font-semibold text-foreground font-mono">{candidate.name}</h3>
                        <p className="text-[10px] text-muted-foreground font-mono">{candidate.title}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {candidate.skills.slice(0, 4).map((skill) => (
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
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground font-mono">match:</span>
                        <div className={cn(
                          "text-lg font-semibold font-mono",
                          candidate.matchScore >= 90 ? "text-success" :
                          candidate.matchScore >= 80 ? "text-foreground" :
                          candidate.matchScore >= 70 ? "text-warning" :
                          "text-muted-foreground"
                        )}>
                          {candidate.matchScore}%
                        </div>
                      </div>
                      
                      {/* Score Bar */}
                      <div className="w-20 h-1 bg-border mt-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${candidate.matchScore}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                          className={cn(
                            "h-full",
                            candidate.matchScore >= 90 ? "bg-success" :
                            candidate.matchScore >= 80 ? "bg-foreground" :
                            candidate.matchScore >= 70 ? "bg-warning" :
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
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </AppLayout>
  );
}
