// import { AlertTriangle, AlertCircle, Info, ChevronRight, Clock } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface Alert {
//   id: string;
//   type: "critical" | "warning" | "info";
//   title: string;
//   description: string;
//   time: string;
//   accountId?: string;
//   pattern?: string;
// }

// const mockAlerts: Alert[] = [
//   {
//     id: "ALT-001",
//     type: "critical",
//     title: "Smurfing Pattern Detected",
//     description: "Account ACC-7821 split ₹2,45,000 into 47 sub-threshold transactions",
//     time: "2 min ago",
//     accountId: "ACC-7821",
//     pattern: "Smurfing",
//   },
//   {
//     id: "ALT-002",
//     type: "critical",
//     title: "Rapid Multi-hop Transfer",
//     description: "Funds traced through 5 accounts in under 10 minutes",
//     time: "8 min ago",
//     accountId: "ACC-3456",
//     pattern: "Layering",
//   },
//   {
//     id: "ALT-003",
//     type: "warning",
//     title: "Unusual Coordination Detected",
//     description: "4 accounts showing synchronized transaction behavior",
//     time: "15 min ago",
//     pattern: "Correlation",
//   },
//   {
//     id: "ALT-004",
//     type: "warning",
//     title: "Burst Activity Alert",
//     description: "Account ACC-9012 executed 12 transactions in 3 minutes",
//     time: "28 min ago",
//     accountId: "ACC-9012",
//     pattern: "Timeline",
//   },
//   {
//     id: "ALT-005",
//     type: "info",
//     title: "New High-Centrality Node",
//     description: "Account ACC-5678 now connected to 15+ counterparties",
//     time: "1 hour ago",
//     accountId: "ACC-5678",
//   },
// ];

// export function AlertsList() {
//   const getIcon = (type: string) => {
//     switch (type) {
//       case "critical":
//         return <AlertCircle className="w-4 h-4 text-risk-high" />;
//       case "warning":
//         return <AlertTriangle className="w-4 h-4 text-risk-medium" />;
//       default:
//         return <Info className="w-4 h-4 text-primary" />;
//     }
//   };

//   const getBorderColor = (type: string) => {
//     switch (type) {
//       case "critical":
//         return "border-l-risk-high";
//       case "warning":
//         return "border-l-risk-medium";
//       default:
//         return "border-l-primary";
//     }
//   };

//   return (
//     <div className="bg-card border border-border rounded-lg overflow-hidden">
//       <div className="px-4 py-3 border-b border-border flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <h3 className="text-sm font-semibold text-foreground">Active Alerts</h3>
//           <span className="px-2 py-0.5 text-xs font-medium bg-risk-high/20 text-risk-high rounded-full">
//             {mockAlerts.filter(a => a.type === "critical").length} Critical
//           </span>
//         </div>
//         <button className="text-xs text-primary hover:underline">View All</button>
//       </div>

//       <div className="divide-y divide-border max-h-96 overflow-y-auto">
//         {mockAlerts.map((alert, index) => (
//           <div
//             key={alert.id}
//             className={cn(
//               "px-4 py-3 border-l-2 hover:bg-muted/30 cursor-pointer transition-colors fade-in",
//               getBorderColor(alert.type)
//             )}
//             style={{ animationDelay: `${index * 50}ms` }}
//           >
//             <div className="flex items-start gap-3">
//               <div className="mt-0.5">{getIcon(alert.type)}</div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-1">
//                   <h4 className="text-sm font-medium text-foreground truncate">
//                     {alert.title}
//                   </h4>
//                   {alert.pattern && (
//                     <span className="px-1.5 py-0.5 text-xs bg-muted text-muted-foreground rounded">
//                       {alert.pattern}
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
//                   {alert.description}
//                 </p>
//                 <div className="flex items-center gap-3 text-xs text-muted-foreground">
//                   <span className="flex items-center gap-1">
//                     <Clock className="w-3 h-3" />
//                     {alert.time}
//                   </span>
//                   {alert.accountId && (
//                     <span className="font-mono text-primary">{alert.accountId}</span>
//                   )}
//                 </div>
//               </div>
//               <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import { AlertTriangle, AlertCircle, Info, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccountRow } from "./AccountsTable";

type Props = {
  alerts: AccountRow[]; // we'll reuse the same rows
  selectedAccountId?: string | null;
  onSelect: (accountId: string) => void;
};

export function AlertsList({ alerts, selectedAccountId, onSelect }: Props) {
  const getIcon = (type: "critical" | "warning" | "info") => {
    switch (type) {
      case "critical":
        return <AlertCircle className="w-4 h-4 text-risk-high" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-risk-medium" />;
      default:
        return <Info className="w-4 h-4 text-primary" />;
    }
  };

  const getBorderColor = (type: "critical" | "warning" | "info") => {
    switch (type) {
      case "critical":
        return "border-l-risk-high";
      case "warning":
        return "border-l-risk-medium";
      default:
        return "border-l-primary";
    }
  };

  const toType = (band: string): "critical" | "warning" | "info" => {
    if (band === "HIGH") return "critical";
    if (band === "MEDIUM") return "warning";
    return "info";
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Active Alerts</h3>
          <span className="px-2 py-0.5 text-xs font-medium bg-risk-high/20 text-risk-high rounded-full">
            {alerts.filter(a => a.risk_band === "HIGH").length} Critical
          </span>
        </div>
        <button className="text-xs text-primary hover:underline">View All</button>
      </div>

      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {alerts.slice(0, 30).map((a, index) => {
          const type = toType(a.risk_band);
          const isSelected = selectedAccountId === a.account_id;

          const title =
            a.patterns && a.patterns.length
              ? `${a.patterns[0]} detected`
              : `Risk score update`;

          const desc = `Account ${a.account_id} scored ${a.risk_score.toFixed(2)} (${a.risk_band})`;

          return (
            <div
              key={a.account_id}
              onClick={() => onSelect(a.account_id)}
              className={cn(
                "px-4 py-3 border-l-2 hover:bg-muted/30 cursor-pointer transition-colors fade-in",
                getBorderColor(type),
                isSelected && "bg-primary/5"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getIcon(type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {title}
                    </h4>
                    {a.patterns?.[0] && (
                      <span className="px-1.5 py-0.5 text-xs bg-muted text-muted-foreground rounded">
                        {a.patterns[0]}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                    {desc}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {a.last_activity ?? "just now"}
                    </span>
                    <span className="font-mono text-primary">{a.account_id}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

