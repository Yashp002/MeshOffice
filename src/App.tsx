import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import CandidateIntake from "./pages/CandidateIntake";
import JobIntake from "./pages/JobIntake";
import MatchingEngine from "./pages/MatchingEngine";
import Pods from "./pages/Pods";
import WorkGraph from "./pages/WorkGraph";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Noise overlay for retro effect */}
      <div className="noise-overlay" />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/candidates" element={<CandidateIntake />} />
          <Route path="/jobs" element={<JobIntake />} />
          <Route path="/matching" element={<MatchingEngine />} />
          <Route path="/pods" element={<Pods />} />
          <Route path="/work-graph" element={<WorkGraph />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
