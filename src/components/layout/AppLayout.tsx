import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Authenticated, Unauthenticated } from "convex/react";
import { AppSidebar } from "./AppSidebar";
import { SignInForm } from "@/SignInForm";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Authenticated>
        <div className="flex min-h-screen w-full bg-background">
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
      </Authenticated>
      <Unauthenticated>
        <div className="flex min-h-screen w-full bg-background items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-md p-8"
          >
            <div className="mb-6 text-center">
              <h1 className="text-lg font-semibold text-foreground font-mono mb-2">
                MeshOffice
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Sign in to continue
              </p>
            </div>
            <div className="retro-card p-6">
              <SignInForm />
            </div>
          </motion.div>
        </div>
      </Unauthenticated>
    </>
  );
}
