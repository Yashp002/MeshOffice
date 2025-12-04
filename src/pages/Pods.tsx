import { useState } from "react";
import { motion } from "framer-motion";
import { Boxes, Plus, Calendar, CheckCircle2, Users } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockPods, mockTasks } from "@/data/mockData";
import { cn } from "@/lib/utils";

const taskColumns = [
  { id: "todo", label: "TODO", color: "text-muted-foreground" },
  { id: "in-progress", label: "IN_PROGRESS", color: "text-foreground" },
  { id: "done", label: "DONE", color: "text-success" },
];

export default function Pods() {
  const [selectedPod, setSelectedPod] = useState(mockPods[0]);

  const podTasks = mockTasks.filter(t => t.pod === selectedPod.name);

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
              <Boxes className="w-5 h-5 text-muted-foreground" />
              Pods
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xs text-muted-foreground font-mono mt-1"
            >
              AI-optimized team configurations
            </motion.p>
          </div>
          <Button>
            <Plus className="w-3 h-3 mr-2" />
            Create Pod
          </Button>
        </div>

        {/* Pod Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockPods.map((pod, index) => (
            <motion.div
              key={pod.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <button
                onClick={() => setSelectedPod(pod)}
                className={cn(
                  "w-full text-left p-4 border transition-all duration-150",
                  selectedPod.id === pod.id
                    ? "retro-card border-foreground/50"
                    : "retro-card-hover"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-semibold text-foreground font-mono">{pod.name}</h3>
                    <p className="text-[10px] text-muted-foreground font-mono">{pod.project}</p>
                  </div>
                  <Badge
                    className={cn(
                      "text-[9px] font-mono uppercase border",
                      pod.status === "active" ? "border-success/30 text-success bg-transparent" :
                      pod.status === "completed" ? "border-foreground/30 text-foreground bg-transparent" :
                      "border-border text-muted-foreground bg-transparent"
                    )}
                  >
                    {pod.status}
                  </Badge>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-muted-foreground font-mono">progress</span>
                    <span className="text-foreground font-mono">
                      {Math.round((pod.completedTasks / pod.tasks) * 100)}%
                    </span>
                  </div>
                  <div className="h-1 bg-border">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(pod.completedTasks / pod.tasks) * 100}%` }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                      className="h-full bg-foreground"
                    />
                  </div>
                </div>

                {/* Members */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1">
                    {pod.members.slice(0, 3).map((member, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 border border-border bg-card flex items-center justify-center"
                        title={member.name}
                      >
                        <span className="text-[8px] font-mono text-foreground">{member.avatar}</span>
                      </div>
                    ))}
                    {pod.members.length > 3 && (
                      <div className="w-6 h-6 border border-border bg-secondary flex items-center justify-center">
                        <span className="text-[8px] font-mono text-muted-foreground">+{pod.members.length - 3}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                    <Calendar className="w-3 h-3" />
                    {new Date(pod.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Task Board */}
        <GlassCard
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground font-mono">{selectedPod.name}</h2>
              <p className="text-[10px] text-muted-foreground font-mono">{selectedPod.project}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                <Users className="w-3 h-3" />
                {selectedPod.members.length}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                <CheckCircle2 className="w-3 h-3" />
                {selectedPod.completedTasks}/{selectedPod.tasks}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {taskColumns.map((column) => {
              const columnTasks = podTasks.filter(t => t.status === column.id);
              return (
                <div key={column.id} className="space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn("text-xs font-mono", column.color)}>{column.label}</span>
                    <Badge variant="secondary" className="text-[9px] font-mono border border-border">
                      {columnTasks.length}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 min-h-[150px]">
                    {columnTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="p-3 border border-border bg-secondary/30 hover:border-muted-foreground/30 transition-all duration-150 cursor-pointer"
                      >
                        <h4 className="text-xs text-foreground font-mono">{task.title}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-5 h-5 border border-border flex items-center justify-center">
                            <span className="text-[8px] font-mono text-muted-foreground">
                              {task.assignee.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono">{task.assignee}</span>
                        </div>
                      </motion.div>
                    ))}
                    
                    {columnTasks.length === 0 && (
                      <div className="h-24 border border-dashed border-border flex items-center justify-center">
                        <span className="text-[10px] text-muted-foreground font-mono">empty</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
