import { Network, Search, Users, Clock, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentStatus {
  id: string;
  name: string;
  description: string;
  status: "active" | "processing" | "idle";
  lastRun: string;
  score?: number;
  icon: React.ElementType;
}

const agents: AgentStatus[] = [
  {
    id: "transaction",
    name: "Transaction Analysis",
    description: "Flow structure & centrality metrics",
    status: "active",
    lastRun: "Just now",
    score: 0.85,
    icon: Network,
  },
  {
    id: "pattern",
    name: "Pattern Detection",
    description: "Smurfing, layering, cycle detection",
    status: "processing",
    lastRun: "Processing...",
    score: 0.92,
    icon: Search,
  },
  {
    id: "correlation",
    name: "Correlation Agent",
    description: "Behavioral similarity analysis",
    status: "active",
    lastRun: "2 min ago",
    score: 0.67,
    icon: Users,
  },
  {
    id: "timeline",
    name: "Timeline Reconstruction",
    description: "Temporal coordination detection",
    status: "active",
    lastRun: "1 min ago",
    score: 0.78,
    icon: Clock,
  },
];

export function AgentStatusPanel() {
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="flex items-center gap-1 text-success text-xs">
            <CheckCircle className="w-3 h-3" />
            Active
          </span>
        );
      case "processing":
        return (
          <span className="flex items-center gap-1 text-primary text-xs">
            <Loader2 className="w-3 h-3 animate-spin" />
            Processing
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-muted-foreground text-xs">
            <span className="w-2 h-2 rounded-full bg-muted-foreground" />
            Idle
          </span>
        );
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Agent Status</h3>
        <span className="text-xs text-muted-foreground">4 Agents Running</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
        {agents.map((agent, index) => (
          <div
            key={agent.id}
            className="bg-card p-4 fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  agent.status === "processing"
                    ? "bg-primary/10"
                    : "bg-muted"
                )}
              >
                <agent.icon
                  className={cn(
                    "w-5 h-5",
                    agent.status === "processing"
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {agent.name}
                  </h4>
                  {getStatusIndicator(agent.status)}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {agent.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {agent.lastRun}
                  </span>
                  {agent.score !== undefined && (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${agent.score * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-primary">
                        {(agent.score * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
