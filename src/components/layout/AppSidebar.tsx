import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Zap,
  Boxes,
  Network,
  Settings,
  LogOut,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Candidates", path: "/candidates" },
  { icon: Briefcase, label: "Jobs", path: "/jobs" },
  { icon: Zap, label: "Matching", path: "/matching" },
  { icon: Boxes, label: "Pods", path: "/pods" },
  { icon: Network, label: "Work Graph", path: "/work-graph" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-56 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <Terminal className="w-5 h-5 text-foreground" />
          <span className="text-sm font-semibold text-foreground tracking-tight">MeshOffice</span>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <NavLink
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-xs font-mono transition-all duration-150",
                  isActive
                    ? "bg-sidebar-accent text-foreground border-l-2 border-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground border-l-2 border-transparent"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto text-muted-foreground">_</span>
                )}
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="retro-card p-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 border border-border flex items-center justify-center">
              <span className="text-[10px] font-mono text-foreground">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-foreground truncate">john_doe</p>
              <p className="text-[10px] text-muted-foreground truncate">admin</p>
            </div>
            <button className="p-1.5 hover:bg-secondary transition-colors">
              <LogOut className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
