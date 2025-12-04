import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Users, Key, CreditCard, Eye, EyeOff, Copy, Trash2, Plus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const mockTeamMembers = [
  { id: "1", name: "John Doe", email: "john@meshoffice.com", role: "Admin", avatar: "JD" },
  { id: "2", name: "Sarah Chen", email: "sarah@meshoffice.com", role: "Manager", avatar: "SC" },
  { id: "3", name: "Marcus Johnson", email: "marcus@meshoffice.com", role: "Member", avatar: "MJ" },
];

const mockApiKeys = [
  { id: "1", name: "Production API", key: "mo_prod_**********************abcd", created: "2024-01-15", lastUsed: "2024-01-20" },
  { id: "2", name: "Development API", key: "mo_dev_**********************efgh", created: "2024-01-10", lastUsed: "2024-01-19" },
];

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"team" | "api" | "billing">("team");
  const [showKey, setShowKey] = useState<string | null>(null);

  const tabs = [
    { id: "team", label: "Team", icon: Users },
    { id: "api", label: "API Keys", icon: Key },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-semibold text-foreground font-mono flex items-center gap-2"
          >
            <SettingsIcon className="w-5 h-5 text-muted-foreground" />
            Settings
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs text-muted-foreground font-mono mt-1"
          >
            Manage team, API keys, and billing
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border pb-3">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              size="sm"
              className="text-xs"
            >
              <tab.icon className="w-3 h-3 mr-1" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Team Tab */}
        {activeTab === "team" && (
          <GlassCard
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Team Members</h2>
              <Button size="sm">
                <Plus className="w-3 h-3 mr-1" />
                Invite
              </Button>
            </div>

            <div className="space-y-2">
              {mockTeamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex items-center justify-between p-3 border border-border bg-secondary/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 border border-border flex items-center justify-center">
                      <span className="text-[10px] font-mono text-foreground">{member.avatar}</span>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-foreground">{member.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        "text-[9px] font-mono uppercase border bg-transparent",
                        member.role === "Admin" ? "border-foreground/50 text-foreground" :
                        member.role === "Manager" ? "border-muted-foreground/50 text-muted-foreground" :
                        "border-border text-muted-foreground"
                      )}
                    >
                      {member.role}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* API Keys Tab */}
        {activeTab === "api" && (
          <GlassCard
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">API Keys</h2>
              <Button size="sm">
                <Plus className="w-3 h-3 mr-1" />
                Generate
              </Button>
            </div>

            <div className="space-y-3">
              {mockApiKeys.map((apiKey, index) => (
                <motion.div
                  key={apiKey.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="p-3 border border-border bg-secondary/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-mono text-foreground">{apiKey.name}</p>
                      <p className="text-[9px] text-muted-foreground font-mono">
                        created: {apiKey.created} / last_used: {apiKey.lastUsed}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                    >
                      {showKey === apiKey.id ? (
                        <EyeOff className="w-3 h-3 text-muted-foreground" />
                      ) : (
                        <Eye className="w-3 h-3 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-2 py-1.5 bg-background border border-border text-[10px] font-mono text-muted-foreground">
                      {showKey === apiKey.id ? apiKey.key.replace("**********************", "1234567890123456789012") : apiKey.key}
                    </code>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(apiKey.key)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <div className="space-y-4">
            <GlassCard
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-sm font-semibold text-foreground mb-4">Current Plan</h2>
              <div className="flex items-center justify-between p-4 border border-foreground/30 bg-secondary/30">
                <div>
                  <p className="text-lg font-semibold text-foreground font-mono">PRO_PLAN</p>
                  <p className="text-xs text-muted-foreground font-mono">$99/month / billed_monthly</p>
                </div>
                <Button variant="outline">Upgrade</Button>
              </div>
            </GlassCard>

            <GlassCard
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-sm font-semibold text-foreground mb-4">Usage This Month</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border border-border bg-secondary/30">
                  <p className="text-[10px] text-muted-foreground font-mono uppercase">api_calls</p>
                  <p className="text-lg font-semibold text-foreground font-mono mt-1">24,521</p>
                  <p className="text-[9px] text-muted-foreground font-mono">of 50,000</p>
                  <div className="h-1 bg-border mt-2">
                    <div className="h-full w-[49%] bg-foreground" />
                  </div>
                </div>
                <div className="p-3 border border-border bg-secondary/30">
                  <p className="text-[10px] text-muted-foreground font-mono uppercase">active_users</p>
                  <p className="text-lg font-semibold text-foreground font-mono mt-1">12</p>
                  <p className="text-[9px] text-muted-foreground font-mono">of 25</p>
                  <div className="h-1 bg-border mt-2">
                    <div className="h-full w-[48%] bg-foreground" />
                  </div>
                </div>
                <div className="p-3 border border-border bg-secondary/30">
                  <p className="text-[10px] text-muted-foreground font-mono uppercase">storage</p>
                  <p className="text-lg font-semibold text-foreground font-mono mt-1">8.2 GB</p>
                  <p className="text-[9px] text-muted-foreground font-mono">of 50 GB</p>
                  <div className="h-1 bg-border mt-2">
                    <div className="h-full w-[16%] bg-success" />
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="text-sm font-semibold text-foreground mb-4">Payment Method</h2>
              <div className="flex items-center justify-between p-3 border border-border bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 border border-border text-[10px] font-mono text-foreground">
                    VISA
                  </div>
                  <div>
                    <p className="text-xs font-mono text-foreground">**** **** **** 4242</p>
                    <p className="text-[10px] text-muted-foreground font-mono">expires: 12/25</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
