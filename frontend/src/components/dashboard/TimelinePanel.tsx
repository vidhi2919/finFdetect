import { Clock, ArrowRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  time: string;
  type: "transaction" | "pattern" | "alert";
  from?: string;
  to?: string;
  amount?: number;
  description: string;
  risk: "high" | "medium" | "low";
}

const mockTimeline: TimelineEvent[] = [
  {
    id: "T001",
    time: "14:32:15",
    type: "transaction",
    from: "ACC-7821",
    to: "ACC-3456",
    amount: 4999,
    description: "Transfer below threshold",
    risk: "high",
  },
  {
    id: "T002",
    time: "14:32:18",
    type: "transaction",
    from: "ACC-7821",
    to: "ACC-9012",
    amount: 4850,
    description: "Rapid follow-up transfer",
    risk: "high",
  },
  {
    id: "T003",
    time: "14:32:22",
    type: "pattern",
    description: "Smurfing pattern triggered (3 sub-threshold txns in 10s)",
    risk: "high",
  },
  {
    id: "T004",
    time: "14:33:45",
    type: "transaction",
    from: "ACC-3456",
    to: "ACC-5678",
    amount: 3200,
    description: "Second-hop layering detected",
    risk: "medium",
  },
  {
    id: "T005",
    time: "14:35:02",
    type: "alert",
    description: "Investigation case AUTO-CREATED for ACC-7821",
    risk: "high",
  },
];

export function TimelinePanel() {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-risk-high bg-risk-high";
      case "medium": return "text-risk-medium bg-risk-medium";
      default: return "text-risk-low bg-risk-low";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "transaction":
        return <ArrowRight className="w-3 h-3" />;
      case "pattern":
        return <Circle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Live Timeline</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
          <span className="text-xs text-muted-foreground">Real-time</span>
        </div>
      </div>

      <div className="relative p-4 max-h-80 overflow-y-auto">
        <div className="absolute left-7 top-4 bottom-4 w-px bg-border" />

        <div className="space-y-4">
          {mockTimeline.map((event, index) => (
            <div
              key={event.id}
              className="relative pl-8 fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={cn(
                  "absolute left-5 top-1.5 w-4 h-4 rounded-full flex items-center justify-center -translate-x-1/2",
                  getRiskColor(event.risk).replace("text-", "bg-").split(" ")[0] + "/20",
                  "border-2",
                  event.risk === "high"
                    ? "border-risk-high"
                    : event.risk === "medium"
                    ? "border-risk-medium"
                    : "border-risk-low"
                )}
              >
                <div className={cn("w-1.5 h-1.5 rounded-full", getRiskColor(event.risk).split(" ")[1])} />
              </div>

              <div className="bg-muted/30 rounded-lg p-3 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-primary">{event.time}</span>
                  <span
                    className={cn(
                      "px-1.5 py-0.5 text-xs rounded font-medium capitalize",
                      event.type === "transaction"
                        ? "bg-primary/10 text-primary"
                        : event.type === "pattern"
                        ? "bg-risk-medium/10 text-risk-medium"
                        : "bg-risk-high/10 text-risk-high"
                    )}
                  >
                    {event.type}
                  </span>
                </div>

                {event.type === "transaction" && event.from && event.to && (
                  <div className="flex items-center gap-2 mb-1 text-sm">
                    <span className="font-mono text-foreground">{event.from}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <span className="font-mono text-foreground">{event.to}</span>
                    <span className="font-mono text-primary font-medium ml-auto">
                      ₹{event.amount?.toLocaleString()}
                    </span>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
