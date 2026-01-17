// import { useState } from "react";
// import { 
//   AlertTriangle,
//   AlertCircle,
//   Info,
//   CheckCircle,
//   Filter,
//   Clock,
//   ChevronRight,
//   User,
//   Network,
//   FileText
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface Alert {
//   id: string;
//   type: "critical" | "warning" | "info";
//   title: string;
//   description: string;
//   time: string;
//   accountId?: string;
//   pattern?: string;
//   status: "new" | "reviewing" | "resolved" | "dismissed";
//   assignee?: string;
// }

// const mockAlerts: Alert[] = [
//   {
//     id: "ALT-001",
//     type: "critical",
//     title: "Smurfing Pattern Detected",
//     description: "Account ACC-7821 split ₹2,45,000 into 47 sub-threshold transactions within 15 minutes. Each transaction was structured below ₹5,000 to evade reporting.",
//     time: "2 min ago",
//     accountId: "ACC-7821",
//     pattern: "Smurfing",
//     status: "new",
//   },
//   {
//     id: "ALT-002",
//     type: "critical",
//     title: "Rapid Multi-hop Transfer",
//     description: "Funds traced through 5 accounts in under 10 minutes. Classic layering technique detected with decreasing amounts at each hop.",
//     time: "8 min ago",
//     accountId: "ACC-3456",
//     pattern: "Layering",
//     status: "reviewing",
//     assignee: "Analyst 1",
//   },
//   {
//     id: "ALT-003",
//     type: "warning",
//     title: "Unusual Coordination Detected",
//     description: "4 accounts showing synchronized transaction behavior with similar amounts and timing patterns suggesting coordinated activity.",
//     time: "15 min ago",
//     pattern: "Correlation",
//     status: "reviewing",
//     assignee: "Analyst 2",
//   },
//   {
//     id: "ALT-004",
//     type: "warning",
//     title: "Burst Activity Alert",
//     description: "Account ACC-9012 executed 12 transactions in 3 minutes, significantly above normal transaction velocity.",
//     time: "28 min ago",
//     accountId: "ACC-9012",
//     pattern: "Timeline",
//     status: "new",
//   },
//   {
//     id: "ALT-005",
//     type: "info",
//     title: "New High-Centrality Node",
//     description: "Account ACC-5678 now connected to 15+ counterparties. Graph centrality score increased by 45% in last 24 hours.",
//     time: "1 hour ago",
//     accountId: "ACC-5678",
//     status: "resolved",
//   },
//   {
//     id: "ALT-006",
//     type: "critical",
//     title: "Cyclic Transfer Pattern",
//     description: "Detected money cycling back to origin account through 4 intermediaries. Total cycle amount: ₹1,50,000.",
//     time: "2 hours ago",
//     pattern: "Cycle",
//     status: "resolved",
//     assignee: "Analyst 1",
//   },
// ];

// const typeConfig = {
//   critical: {
//     icon: AlertCircle,
//     color: "text-risk-high",
//     bg: "bg-risk-high/10",
//     border: "border-l-risk-high",
//   },
//   warning: {
//     icon: AlertTriangle,
//     color: "text-risk-medium",
//     bg: "bg-risk-medium/10",
//     border: "border-l-risk-medium",
//   },
//   info: {
//     icon: Info,
//     color: "text-primary",
//     bg: "bg-primary/10",
//     border: "border-l-primary",
//   },
// };

// const statusConfig = {
//   new: { label: "New", color: "bg-risk-high/10 text-risk-high border-risk-high/20" },
//   reviewing: { label: "Reviewing", color: "bg-risk-medium/10 text-risk-medium border-risk-medium/20" },
//   resolved: { label: "Resolved", color: "bg-success/10 text-success border-success/20" },
//   dismissed: { label: "Dismissed", color: "bg-muted text-muted-foreground border-border" },
// };

// export default function Alerts() {
//   const [filterType, setFilterType] = useState<string>("all");
//   const [filterStatus, setFilterStatus] = useState<string>("all");

//   const filteredAlerts = mockAlerts.filter(alert => {
//     const matchesType = filterType === "all" || alert.type === filterType;
//     const matchesStatus = filterStatus === "all" || alert.status === filterStatus;
//     return matchesType && matchesStatus;
//   });

//   const stats = {
//     critical: mockAlerts.filter(a => a.type === "critical" && a.status !== "resolved").length,
//     warning: mockAlerts.filter(a => a.type === "warning" && a.status !== "resolved").length,
//     new: mockAlerts.filter(a => a.status === "new").length,
//   };

//   return (
//     <div className="min-h-screen p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
//             <AlertTriangle className="w-6 h-6 text-primary" />
//             Alert Management
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Prioritized fraud alerts requiring investigation
//           </p>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-card border border-border rounded-lg p-4 border-l-4 border-l-risk-high">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium text-muted-foreground uppercase">Critical Alerts</p>
//               <p className="text-2xl font-bold text-risk-high font-mono">{stats.critical}</p>
//             </div>
//             <div className="p-2 bg-risk-high/10 rounded-lg">
//               <AlertCircle className="w-5 h-5 text-risk-high" />
//             </div>
//           </div>
//         </div>
//         <div className="bg-card border border-border rounded-lg p-4 border-l-4 border-l-risk-medium">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium text-muted-foreground uppercase">Warnings</p>
//               <p className="text-2xl font-bold text-risk-medium font-mono">{stats.warning}</p>
//             </div>
//             <div className="p-2 bg-risk-medium/10 rounded-lg">
//               <AlertTriangle className="w-5 h-5 text-risk-medium" />
//             </div>
//           </div>
//         </div>
//         <div className="bg-card border border-border rounded-lg p-4 border-l-4 border-l-primary">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium text-muted-foreground uppercase">New Alerts</p>
//               <p className="text-2xl font-bold text-primary font-mono">{stats.new}</p>
//             </div>
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <Clock className="w-5 h-5 text-primary" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
//         <Filter className="w-4 h-4 text-muted-foreground" />
//         <select
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value)}
//           className="px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
//         >
//           <option value="all">All Types</option>
//           <option value="critical">Critical</option>
//           <option value="warning">Warning</option>
//           <option value="info">Info</option>
//         </select>
//         <select
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
//         >
//           <option value="all">All Status</option>
//           <option value="new">New</option>
//           <option value="reviewing">Reviewing</option>
//           <option value="resolved">Resolved</option>
//         </select>
//         <span className="ml-auto text-sm text-muted-foreground">
//           {filteredAlerts.length} alerts
//         </span>
//       </div>

//       {/* Alerts List */}
//       <div className="space-y-3">
//         {filteredAlerts.map((alert, index) => {
//           const config = typeConfig[alert.type];
//           const statusConf = statusConfig[alert.status];
//           const Icon = config.icon;

//           return (
//             <div
//               key={alert.id}
//               className={cn(
//                 "bg-card border border-border rounded-lg p-4 border-l-4 cursor-pointer hover:bg-muted/30 transition-colors fade-in",
//                 config.border
//               )}
//               style={{ animationDelay: `${index * 50}ms` }}
//             >
//               <div className="flex items-start gap-4">
//                 <div className={cn("p-2 rounded-lg", config.bg)}>
//                   <Icon className={cn("w-5 h-5", config.color)} />
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-3 mb-2">
//                     <span className="font-mono text-xs text-muted-foreground">{alert.id}</span>
//                     <span className={cn("px-2 py-0.5 text-xs font-medium rounded border", statusConf.color)}>
//                       {statusConf.label}
//                     </span>
//                     {alert.pattern && (
//                       <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded">
//                         {alert.pattern}
//                       </span>
//                     )}
//                   </div>

//                   <h3 className="text-base font-medium text-foreground mb-1">
//                     {alert.title}
//                   </h3>
//                   <p className="text-sm text-muted-foreground mb-3">
//                     {alert.description}
//                   </p>

//                   <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                     <span className="flex items-center gap-1">
//                       <Clock className="w-3 h-3" />
//                       {alert.time}
//                     </span>
//                     {alert.accountId && (
//                       <span className="flex items-center gap-1">
//                         <User className="w-3 h-3" />
//                         <span className="font-mono text-primary">{alert.accountId}</span>
//                       </span>
//                     )}
//                     {alert.assignee && (
//                       <span className="flex items-center gap-1">
//                         <User className="w-3 h-3" />
//                         {alert.assignee}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <button className="p-2 hover:bg-muted rounded-lg transition-colors">
//                     <Network className="w-4 h-4 text-muted-foreground" />
//                   </button>
//                   <button className="p-2 hover:bg-muted rounded-lg transition-colors">
//                     <FileText className="w-4 h-4 text-muted-foreground" />
//                   </button>
//                   <ChevronRight className="w-5 h-5 text-muted-foreground" />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Filter,
  Clock,
  ChevronRight,
  User,
  Network,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiGet } from "@/lib/api";

type RiskBand = "HIGH" | "MEDIUM" | "LOW";

type AlertType = "critical" | "warning" | "info";
type AlertStatus = "new" | "reviewing" | "resolved" | "dismissed";

type BackendAlertRow = {
  account_id: string;
  risk_score: number;
  risk_band: RiskBand;
  patterns: string[];
};

type BackendAlertsResponse = {
  total: number;
  returned: number;
  items: BackendAlertRow[];
};

interface AlertUI {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  time: string; // currently derived as "—"
  accountId?: string;
  pattern?: string;
  status: AlertStatus;
  assignee?: string;
}

const typeConfig: Record<AlertType, any> = {
  critical: {
    icon: AlertCircle,
    color: "text-risk-high",
    bg: "bg-risk-high/10",
    border: "border-l-risk-high",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-risk-medium",
    bg: "bg-risk-medium/10",
    border: "border-l-risk-medium",
  },
  info: {
    icon: Info,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-l-primary",
  },
};

const statusConfig: Record<
  AlertStatus,
  { label: string; color: string }
> = {
  new: { label: "New", color: "bg-risk-high/10 text-risk-high border-risk-high/20" },
  reviewing: { label: "Reviewing", color: "bg-risk-medium/10 text-risk-medium border-risk-medium/20" },
  resolved: { label: "Resolved", color: "bg-success/10 text-success border-success/20" },
  dismissed: { label: "Dismissed", color: "bg-muted text-muted-foreground border-border" },
};

function alertTypeFromBand(band: RiskBand): AlertType {
  if (band === "HIGH") return "critical";
  if (band === "MEDIUM") return "warning";
  return "info";
}

/**
 * Simple description generator from patterns/risk
 * (since backend doesn't provide a narrative here)
 */
function buildTitleDescription(row: BackendAlertRow): { title: string; description: string; pattern?: string } {
  const topPattern = (row.patterns?.[0] ?? "").toString();
  const score = Number(row.risk_score ?? 0);

  if (topPattern) {
    return {
      title: `${topPattern.toUpperCase()} Pattern Detected`,
      description: `Account ${row.account_id} flagged due to "${topPattern}" signals. Risk score: ${score.toFixed(2)} (${row.risk_band}).`,
      pattern: topPattern,
    };
  }

  return {
    title: `Risk Alert: ${row.risk_band}`,
    description: `Account ${row.account_id} flagged with risk score ${score.toFixed(2)} (${row.risk_band}).`,
  };
}

export default function Alerts() {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [rows, setRows] = useState<BackendAlertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function fetchAlerts() {
    try {
      setErr(null);
      setLoading(true);

      // You can pass band filter to backend if you want:
      // /alerts?top_n=200&band=HIGH
      const params = new URLSearchParams();
      params.set("top_n", "200");

      const payload = await apiGet<BackendAlertsResponse>(`/alerts?${params.toString()}`);
      const items = Array.isArray(payload?.items) ? payload.items : [];

      setRows(items);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to fetch alerts");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Convert backend alert rows into UI alerts (still stateless / derived)
  const alertsUI: AlertUI[] = useMemo(() => {
    return (rows ?? []).map((r, idx) => {
      const type = alertTypeFromBand(r.risk_band);
      const { title, description, pattern } = buildTitleDescription(r);

      // status: you can later store real status in DB; for now:
      const status: AlertStatus = "new";

      return {
        id: `ALT-${String(idx + 1).padStart(3, "0")}`,
        type,
        title,
        description,
        time: "—", // later: use last_activity when you expose it in /alerts
        accountId: r.account_id,
        pattern,
        status,
      };
    });
  }, [rows]);

  // Apply filters (client-side)
  const filteredAlerts = useMemo(() => {
    return alertsUI.filter((alert) => {
      const matchesType = filterType === "all" || alert.type === filterType;
      const matchesStatus = filterStatus === "all" || alert.status === filterStatus;
      return matchesType && matchesStatus;
    });
  }, [alertsUI, filterType, filterStatus]);

  // Stats for header cards
  const stats = useMemo(() => {
    return {
      critical: alertsUI.filter((a) => a.type === "critical" && a.status !== "resolved").length,
      warning: alertsUI.filter((a) => a.type === "warning" && a.status !== "resolved").length,
      new: alertsUI.filter((a) => a.status === "new").length,
    };
  }, [alertsUI]);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-primary" />
            Alert Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Prioritized fraud alerts requiring investigation
          </p>
          {err && <p className="text-sm mt-2 text-risk-high">API error: {err}</p>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 border-l-4 border-l-risk-high">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Critical Alerts</p>
              <p className="text-2xl font-bold text-risk-high font-mono">
                {loading ? "…" : stats.critical}
              </p>
            </div>
            <div className="p-2 bg-risk-high/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-risk-high" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 border-l-4 border-l-risk-medium">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Warnings</p>
              <p className="text-2xl font-bold text-risk-medium font-mono">
                {loading ? "…" : stats.warning}
              </p>
            </div>
            <div className="p-2 bg-risk-medium/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-risk-medium" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">New Alerts</p>
              <p className="text-2xl font-bold text-primary font-mono">
                {loading ? "…" : stats.new}
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
        <Filter className="w-4 h-4 text-muted-foreground" />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Types</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="reviewing">Reviewing</option>
          <option value="resolved">Resolved</option>
        </select>

        <span className="ml-auto text-sm text-muted-foreground">
          {loading ? "Loading…" : `${filteredAlerts.length} alerts`}
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-card border border-border rounded-lg p-4 text-sm text-muted-foreground">
            Loading alerts from backend…
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-4 text-sm text-muted-foreground">
            No alerts found.
          </div>
        ) : (
          filteredAlerts.map((alert, index) => {
            const config = typeConfig[alert.type];
            const statusConf = statusConfig[alert.status];
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={cn(
                  "bg-card border border-border rounded-lg p-4 border-l-4 cursor-pointer hover:bg-muted/30 transition-colors fade-in",
                  config.border
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("p-2 rounded-lg", config.bg)}>
                    <Icon className={cn("w-5 h-5", config.color)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs text-muted-foreground">{alert.id}</span>
                      <span className={cn("px-2 py-0.5 text-xs font-medium rounded border", statusConf.color)}>
                        {statusConf.label}
                      </span>
                      {alert.pattern && (
                        <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded">
                          {alert.pattern}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-medium text-foreground mb-1">{alert.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.time}
                      </span>

                      {alert.accountId && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="font-mono text-primary">{alert.accountId}</span>
                        </span>
                      )}

                      {alert.assignee && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {alert.assignee}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Open graph">
                      <Network className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Open case file">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
