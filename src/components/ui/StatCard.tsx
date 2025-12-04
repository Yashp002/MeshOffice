import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  delay?: number;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="retro-card-hover"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold text-foreground font-mono">{value}</p>
          {change && (
            <p
              className={cn(
                "text-xs font-mono",
                changeType === "positive" && "text-success",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className="p-2 border border-border">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </motion.div>
  );
}
