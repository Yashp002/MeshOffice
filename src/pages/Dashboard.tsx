import { motion } from "framer-motion";
import { 
  FileText, 
  CheckCircle2, 
  Boxes, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Users,
  Briefcase,
  Zap
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui/StatCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { useJobs } from "@/hooks/useJobs";
import { useCandidates } from "@/hooks/useCandidates";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const jobs = useJobs();
  const candidates = useCandidates();
  
  const jobsCount = jobs?.length || 0;
  const candidatesCount = candidates?.length || 0;
  // Estimate matches - in a real app, you'd have a query for total match count
  const totalMatches = 0; // This would come from a summary query in a real implementation
  
  // Calculate recent activity (items created in last 7 days)
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentJobs = jobs?.filter(job => job._creationTime > sevenDaysAgo).length || 0;
  const recentCandidates = candidates?.filter(c => c._creationTime > sevenDaysAgo).length || 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-semibold text-foreground font-mono"
            >
              Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xs text-muted-foreground font-mono mt-1"
            >
              System overview and metrics
            </motion.p>
          </div>
          <Button variant="outline">
            <FileText className="w-3 h-3 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Jobs" 
            value={jobsCount.toString()} 
            change={recentJobs > 0 ? `+${recentJobs} this week` : "No new jobs"} 
            changeType={recentJobs > 0 ? "positive" : "neutral"}
            icon={Briefcase}
            delay={0.1}
          />
          <StatCard 
            title="Total Candidates" 
            value={candidatesCount.toString()} 
            change={recentCandidates > 0 ? `+${recentCandidates} this week` : "No new candidates"} 
            changeType={recentCandidates > 0 ? "positive" : "neutral"}
            icon={Users}
            delay={0.15}
          />
          <StatCard 
            title="System Status" 
            value={jobsCount > 0 && candidatesCount > 0 ? "Ready" : "Setup"} 
            change={jobsCount > 0 && candidatesCount > 0 ? "Ready to match" : "Add data first"} 
            changeType={jobsCount > 0 && candidatesCount > 0 ? "positive" : "neutral"}
            icon={Zap}
            delay={0.2}
          />
          <StatCard 
            title="Match Potential" 
            value={jobsCount > 0 && candidatesCount > 0 
              ? `${jobsCount * candidatesCount}` 
              : "0"} 
            change="Possible matches" 
            changeType="neutral"
            icon={CheckCircle2}
            delay={0.25}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* AI Insights */}
          <GlassCard 
            className="lg:col-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">AI Insights</h2>
              </div>
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {jobsCount === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 border border-warning/30 bg-warning/5"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-semibold text-foreground">No Jobs Yet</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Create your first job posting to start matching candidates.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              {candidatesCount === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 border border-warning/30 bg-warning/5"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-semibold text-foreground">No Candidates Yet</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add candidates to enable AI-powered matching.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              {jobsCount > 0 && candidatesCount > 0 && totalMatches === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 border border-border bg-secondary/30"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-semibold text-foreground">Ready to Match</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Go to the Matching Engine to generate candidate matches for your jobs.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              {jobsCount > 0 && candidatesCount > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 border border-border bg-secondary/30"
                >
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-semibold text-foreground">Ready to Match</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        You have {jobsCount} job{jobsCount !== 1 ? 's' : ''} and {candidatesCount} candidate{candidatesCount !== 1 ? 's' : ''}. Start matching in the Matching Engine.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button 
                variant="glass" 
                className="w-full justify-start text-xs"
                onClick={() => window.location.href = '/candidates'}
              >
                <Users className="w-3 h-3 mr-2" />
                Add New Candidate
              </Button>
              <Button 
                variant="glass" 
                className="w-full justify-start text-xs"
                onClick={() => window.location.href = '/jobs'}
              >
                <Briefcase className="w-3 h-3 mr-2" />
                Create New Job
              </Button>
              <Button 
                variant="glass" 
                className="w-full justify-start text-xs"
                onClick={() => window.location.href = '/matching'}
              >
                <Zap className="w-3 h-3 mr-2" />
                Run Matching
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Recent Activity */}
        <GlassCard
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            {jobs && jobs.slice(0, 5).map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-3 border border-border bg-secondary/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3 h-3 text-muted-foreground" />
                      <h3 className="text-xs font-semibold text-foreground font-mono">{job.title}</h3>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono mt-1">
                      {job.location} • {job.experienceLevel}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.requiredSkills.slice(0, 3).map((skill: string) => (
                        <span
                          key={skill}
                          className="text-[9px] font-mono border border-border px-1.5 py-0.5 text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills.length > 3 && (
                        <span className="text-[9px] font-mono text-muted-foreground">
                          +{job.requiredSkills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {new Date(job._creationTime).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
            {(!jobs || jobs.length === 0) && (
              <div className="text-xs text-muted-foreground font-mono p-4 text-center">
                No recent activity
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
