import { ReactNode } from "react";
import { motion } from "framer-motion";
import { AppSidebar } from "./AppSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background bg-mesh-gradient">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
