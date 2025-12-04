import { motion } from "framer-motion";
import { 
  FileText, 
  CheckCircle2, 
  Boxes, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui/StatCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { mockAIInsights, mockSpendData, mockTasks, mockPods } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const activeTasks = mockTasks.filter(t => t.status === "in-progress").length;
  const activePods = mockPods.filter(p => p.status === "active").length;
  const totalSpend = mockSpendData.reduce((acc, d) => acc + d.spend, 0);

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
            title="Open Requests" 
            value="24" 
            change="+3 this week" 
            changeType="neutral"
            icon={FileText}
            delay={0.1}
          />
          <StatCard 
            title="Active Tasks" 
            value={activeTasks} 
            change="2 due today" 
            changeType="neutral"
            icon={CheckCircle2}
            delay={0.15}
          />
          <StatCard 
            title="Active Pods" 
            value={activePods} 
            change="1 new this month" 
            changeType="positive"
            icon={Boxes}
            delay={0.2}
          />
          <StatCard 
            title="Monthly Spend" 
            value={`$${(totalSpend / 1000).toFixed(1)}k`} 
            change="-8% vs last month" 
            changeType="positive"
            icon={DollarSign}
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
              {mockAIInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={cn(
                    "p-3 border transition-all duration-150 hover:border-muted-foreground/30",
                    insight.priority === "high" 
                      ? "border-destructive/30 bg-destructive/5" 
                      : insight.priority === "medium"
                      ? "border-warning/30 bg-warning/5"
                      : "border-border bg-secondary/30"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {insight.priority === "high" ? (
                      <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    ) : insight.priority === "medium" ? (
                      <TrendingUp className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    ) : (
                      <Lightbulb className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h3 className="text-xs font-semibold text-foreground">{insight.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
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
              <Button variant="glass" className="w-full justify-start text-xs">
                <FileText className="w-3 h-3 mr-2" />
                Add New Candidate
              </Button>
              <Button variant="glass" className="w-full justify-start text-xs">
                <Boxes className="w-3 h-3 mr-2" />
                Create New Pod
              </Button>
              <Button variant="glass" className="w-full justify-start text-xs">
                <CheckCircle2 className="w-3 h-3 mr-2" />
                Review Pending Tasks
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Spend Chart */}
        <GlassCard
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Monthly Spend</h2>
            <select className="bg-secondary border border-border px-2 py-1 text-xs text-foreground focus:outline-none">
              <option>Last 6 months</option>
              <option>Last year</option>
              <option>All time</option>
            </select>
          </div>
          <div className="h-48 flex items-end gap-3">
            {mockSpendData.map((data, index) => (
              <motion.div
                key={data.month}
                initial={{ height: 0 }}
                animate={{ height: `${(data.spend / 18000) * 100}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div className="w-full relative">
                  <div 
                    className="w-full bg-foreground/20 hover:bg-foreground/30 transition-colors"
                    style={{ height: `${(data.spend / 18000) * 160}px` }}
                  />
                  <div 
                    className="absolute bottom-0 w-full border-t border-dashed border-muted-foreground/30"
                    style={{ top: `${160 - (data.budget / 18000) * 160}px` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">{data.month}</span>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-foreground/20" />
              <span className="text-[10px] text-muted-foreground">Actual Spend</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0 border-t border-dashed border-muted-foreground/50" />
              <span className="text-[10px] text-muted-foreground">Budget</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
