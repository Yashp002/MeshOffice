import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        hover ? "retro-card-hover" : "retro-card",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
