import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Network, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { mockWorkGraphNodes, mockWorkGraphEdges } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusColors = {
  completed: { bg: "bg-success", text: "text-success" },
  "in-progress": { bg: "bg-foreground", text: "text-foreground" },
  pending: { bg: "bg-muted-foreground", text: "text-muted-foreground" },
};

export default function WorkGraph() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleReset = () => setZoom(1);

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
              <Network className="w-5 h-5 text-muted-foreground" />
              Work Graph
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xs text-muted-foreground font-mono mt-1"
            >
              Task dependencies and flow visualization
            </motion.p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={handleZoomOut} className="h-8 w-8">
              <ZoomOut className="w-3 h-3" />
            </Button>
            <span className="text-xs text-muted-foreground w-12 text-center font-mono">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="outline" size="icon" onClick={handleZoomIn} className="h-8 w-8">
              <ZoomIn className="w-3 h-3" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleReset} className="h-8 w-8">
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Graph Canvas */}
        <GlassCard
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="overflow-hidden"
        >
          <div 
            ref={canvasRef}
            className="relative h-[400px] overflow-auto scrollbar-thin"
            style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
          >
            {/* SVG for edges */}
            <svg className="absolute inset-0 w-[800px] h-[400px] pointer-events-none">
              {mockWorkGraphEdges.map((edge, index) => {
                const fromNode = mockWorkGraphNodes.find(n => n.id === edge.from);
                const toNode = mockWorkGraphNodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                
                return (
                  <motion.line
                    key={`${edge.from}-${edge.to}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                    x1={fromNode.x + 60}
                    y1={fromNode.y + 15}
                    x2={toNode.x}
                    y2={toNode.y + 15}
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {mockWorkGraphNodes.map((node, index) => {
              const status = statusColors[node.status as keyof typeof statusColors];
              const isSelected = selectedNode === node.id;
              
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className={cn(
                    "absolute cursor-pointer transition-all duration-150",
                    isSelected && "z-10"
                  )}
                  style={{ left: node.x, top: node.y }}
                  onClick={() => setSelectedNode(isSelected ? null : node.id)}
                >
                  <div
                    className={cn(
                      "px-3 py-1.5 border transition-all duration-150",
                      node.type === "milestone" 
                        ? "border-foreground/50 bg-secondary" 
                        : "border-border bg-card",
                      isSelected && "border-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5", status.bg)} />
                      <span className={cn(
                        "text-[10px] font-mono",
                        node.type === "milestone" ? "text-foreground font-semibold" : "text-foreground"
                      )}>
                        {node.label}
                      </span>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-1.5 pt-1.5 border-t border-border"
                      >
                        <p className="text-[9px] text-muted-foreground font-mono">
                          status: <span className={status.text}>{node.status}</span>
                        </p>
                        <p className="text-[9px] text-muted-foreground mt-0.5 font-mono">
                          type: {node.type}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6">
          {Object.entries(statusColors).map(([status, colors]) => (
            <div key={status} className="flex items-center gap-2">
              <div className={cn("w-2 h-2", colors.bg)} />
              <span className="text-[10px] text-muted-foreground font-mono">{status.replace("-", "_")}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 border border-foreground/50" />
            <span className="text-[10px] text-muted-foreground font-mono">milestone</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
