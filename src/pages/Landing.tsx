import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Load Unicorn Studio script
    if (!window.UnicornStudio) {
      window.UnicornStudio = {};
    }
    const script = document.createElement("script");
    script.src = "https://framer.com/m/UnicornStudioEmbed-wWy9.js";
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* Unicorn Studio Embed */}
      <div
        data-us-project="lyf96vdzlIYZpW5phtyR"
        className="absolute inset-0 w-full h-full"
        style={{ width: "100vw", height: "100vh" }}
      />

      {/* Floating Enter Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={() => navigate("/dashboard")}
        className="fixed bottom-8 right-8 z-50 px-6 py-3 bg-card/80 backdrop-blur-sm border border-border text-foreground font-mono text-sm tracking-wide hover:bg-card hover:border-primary/50 transition-all duration-300 flex items-center gap-2 group"
      >
        <span>Enter Website</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
}

// Extend window type for UnicornStudio
declare global {
  interface Window {
    UnicornStudio: Record<string, unknown>;
  }
}
