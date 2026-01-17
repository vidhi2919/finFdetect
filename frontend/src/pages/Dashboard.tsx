// // import { 
// //   Activity, 
// //   AlertTriangle, 
// //   Users, 
// //   TrendingUp,
// //   Network,
// //   Clock
// // } from "lucide-react";
// // import { MetricCard } from "@/components/dashboard/MetricCard";
// // import { TransactionGraph } from "@/components/dashboard/TransactionGraph";
// // import { AccountsTable } from "@/components/dashboard/AccountsTable";
// // import { AlertsList } from "@/components/dashboard/AlertsList";
// // import { TimelinePanel } from "@/components/dashboard/TimelinePanel";
// // import { ExplainabilityPanel } from "@/components/dashboard/ExplainabilityPanel";
// // import { AgentStatusPanel } from "@/components/dashboard/AgentStatusPanel";

// // export default function Dashboard() {
// //   return (
// //     <div className="min-h-screen p-6 space-y-6">
// //       {/* Header */}
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h1 className="text-2xl font-bold text-foreground">
// //             Fraud Investigation Dashboard
// //           </h1>
// //           <p className="text-sm text-muted-foreground mt-1">
// //             Real-time micro-transaction analysis and pattern detection
// //           </p>
// //         </div>
// //         <div className="flex items-center gap-3">
// //           <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg">
// //             <span className="relative flex h-2 w-2">
// //               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
// //               <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
// //             </span>
// //             <span className="text-xs text-muted-foreground">Live Monitoring</span>
// //           </div>
// //           <div className="px-3 py-1.5 bg-card border border-border rounded-lg">
// //             <span className="text-xs font-mono text-muted-foreground">
// //               Last sync: <span className="text-foreground">12s ago</span>
// //             </span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Metrics Row */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// //         <MetricCard
// //           title="Total Transactions"
// //           value="10,247"
// //           subtitle="Today"
// //           icon={<Activity className="w-5 h-5 text-primary" />}
// //           trend="up"
// //           trendValue="+12.5%"
// //         />
// //         <MetricCard
// //           title="High Risk Accounts"
// //           value="23"
// //           subtitle="Requires investigation"
// //           icon={<AlertTriangle className="w-5 h-5 text-risk-high" />}
// //           variant="risk-high"
// //           trend="up"
// //           trendValue="+3"
// //         />
// //         <MetricCard
// //           title="Active Patterns"
// //           value="7"
// //           subtitle="Smurfing, Layering, Cycles"
// //           icon={<Network className="w-5 h-5 text-risk-medium" />}
// //           variant="risk-medium"
// //         />
// //         <MetricCard
// //           title="Graph Nodes"
// //           value="284"
// //           subtitle="Accounts in network"
// //           icon={<Users className="w-5 h-5 text-muted-foreground" />}
// //           trend="neutral"
// //           trendValue="+8"
// //         />
// //       </div>

// //       {/* Main Content Grid */}
// //       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
// //         {/* Left Column - Graph and Table */}
// //         <div className="xl:col-span-2 space-y-6">
// //           {/* Transaction Graph */}
// //           <div className="space-y-3">
// //             <div className="flex items-center justify-between">
// //               <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
// //                 <Network className="w-5 h-5 text-primary" />
// //                 Transaction Graph
// //               </h2>
// //               <div className="flex items-center gap-2">
// //                 <button className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors">
// //                   Zoom to Fit
// //                 </button>
// //                 <button className="px-3 py-1.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors">
// //                   Expand View
// //                 </button>
// //               </div>
// //             </div>
// //             <TransactionGraph />
// //           </div>

// //           {/* Accounts Table */}
// //           <AccountsTable />

// //           {/* Agent Status */}
// //           <AgentStatusPanel />
// //         </div>

// //         {/* Right Column - Alerts and Timeline */}
// //         <div className="space-y-6">
// //           <AlertsList />
// //           <TimelinePanel />
// //           <ExplainabilityPanel />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
//   Activity,
//   AlertTriangle,
//   Users,
//   Network,
// } from "lucide-react";

// import { MetricCard } from "@/components/dashboard/MetricCard";
// import { TransactionGraph } from "@/components/dashboard/TransactionGraph";
// import { AccountsTable, type AccountRow } from "@/components/dashboard/AccountsTable";
// import { AlertsList } from "@/components/dashboard/AlertsList";
// import { TimelinePanel } from "@/components/dashboard/TimelinePanel";
// import { ExplainabilityPanel } from "@/components/dashboard/ExplainabilityPanel";
// import { AgentStatusPanel } from "@/components/dashboard/AgentStatusPanel";
// import { apiGet } from "@/lib/api";

// type AlertsResponse = AccountRow[];

// /**
//  * FastAPI endpoints expected:
//  *   GET /alerts?limit=200  -> AccountRow[]
//  */
// export default function Dashboard() {
//   const [rows, setRows] = useState<AccountRow[]>([]);
//   const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
//   const [lastSync, setLastSync] = useState<Date | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

//   async function fetchAlerts() {
//     try {
//       setErr(null);
//       const data = await apiGet<AlertsResponse>(`/alerts?limit=200`);
//       setRows(data);

//       // default selection: first row if none selected
//       if (!selectedAccountId && data.length > 0) {
//         setSelectedAccountId(data[0].account_id);
//       }
//       setLastSync(new Date());
//     } catch (e: any) {
//       setErr(e?.message ?? "Failed to fetch alerts");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchAlerts();

//     // OPTIONAL: poll every 15s for "Live Monitoring"
//     const id = setInterval(fetchAlerts, 15000);
//     return () => clearInterval(id);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const metrics = useMemo(() => {
//     const high = rows.filter(r => r.risk_band === "HIGH").length;
//     const totalNodes = rows.length;

//     // You can replace this later with a real backend /metrics endpoint.
//     return {
//       totalTxns: "—",
//       highRisk: high.toString(),
//       activePatterns: new Set(rows.flatMap(r => r.patterns ?? [])).size.toString(),
//       graphNodes: totalNodes.toString(),
//     };
//   }, [rows]);

//   return (
//     <div className="min-h-screen p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground">
//             Fraud Investigation Dashboard
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Real-time micro-transaction analysis and pattern detection
//           </p>
//           {err && (
//             <p className="text-sm mt-2 text-risk-high">
//               API error: {err}
//             </p>
//           )}
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg">
//             <span className="relative flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
//             </span>
//             <span className="text-xs text-muted-foreground">Live Monitoring</span>
//           </div>

//           <div className="px-3 py-1.5 bg-card border border-border rounded-lg">
//             <span className="text-xs font-mono text-muted-foreground">
//               Last sync:{" "}
//               <span className="text-foreground">
//                 {lastSync ? lastSync.toLocaleTimeString() : "—"}
//               </span>
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Metrics Row */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <MetricCard
//           title="Total Transactions"
//           value={metrics.totalTxns}
//           subtitle="(hook to /metrics later)"
//           icon={<Activity className="w-5 h-5 text-primary" />}
//           trend="neutral"
//           trendValue="—"
//         />
//         <MetricCard
//           title="High Risk Accounts"
//           value={metrics.highRisk}
//           subtitle="Requires investigation"
//           icon={<AlertTriangle className="w-5 h-5 text-risk-high" />}
//           variant="risk-high"
//           trend="neutral"
//           trendValue="—"
//         />
//         <MetricCard
//           title="Active Patterns"
//           value={metrics.activePatterns}
//           subtitle="Across accounts"
//           icon={<Network className="w-5 h-5 text-risk-medium" />}
//           variant="risk-medium"
//         />
//         <MetricCard
//           title="Graph Nodes"
//           value={metrics.graphNodes}
//           subtitle="Accounts in network"
//           icon={<Users className="w-5 h-5 text-muted-foreground" />}
//           trend="neutral"
//           trendValue="—"
//         />
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         {/* Left Column */}
//         <div className="xl:col-span-2 space-y-6">
//           {/* Transaction Graph */}
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <Network className="w-5 h-5 text-primary" />
//                 Transaction Graph
//               </h2>
//               <div className="flex items-center gap-2">
//                 <button className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors">
//                   Zoom to Fit
//                 </button>
//                 <button className="px-3 py-1.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors">
//                   Expand View
//                 </button>
//               </div>
//             </div>

//             {/* We'll wire this to selectedAccountId in Step 2 */}
//             <TransactionGraph />
//           </div>

//           {/* Accounts Table */}
//           {loading ? (
//             <div className="bg-card border border-border rounded-lg p-4 text-sm text-muted-foreground">
//               Loading accounts…
//             </div>
//           ) : (
//             <AccountsTable
//               accounts={rows}
//               selectedAccountId={selectedAccountId}
//               onSelect={setSelectedAccountId}
//             />
//           )}

//           <AgentStatusPanel />
//         </div>

//         {/* Right Column */}
//         <div className="space-y-6">
//           <AlertsList
//             alerts={rows}
//             selectedAccountId={selectedAccountId}
//             onSelect={setSelectedAccountId}
//           />

//           {/* Step 2 will make these account-aware */}
//           <TimelinePanel />
//           <ExplainabilityPanel />
//         </div>
//       </div>
//     </div>
//   );
// }





// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Activity, AlertTriangle, Users, Network } from "lucide-react";

// import { MetricCard } from "@/components/dashboard/MetricCard";
// import { TransactionGraph } from "@/components/dashboard/TransactionGraph";
// import { AccountsTable, type AccountRow } from "@/components/dashboard/AccountsTable";
// import { AlertsList } from "@/components/dashboard/AlertsList";
// import { TimelinePanel } from "@/components/dashboard/TimelinePanel";
// import { ExplainabilityPanel } from "@/components/dashboard/ExplainabilityPanel";
// import { AgentStatusPanel } from "@/components/dashboard/AgentStatusPanel";
// import { apiGet } from "@/lib/api";

// /**
//  * Expected backend:
//  *   GET /alerts?limit=200 -> AccountRow[]  (ideal)
//  *
//  * But we defensively support these too:
//  *   { items: AccountRow[] }
//  *   { rows: AccountRow[] }
//  *   { data: AccountRow[] }
//  */

// function normalizeRows(payload: any): AccountRow[] {
//   if (Array.isArray(payload)) return payload;

//   if (payload && typeof payload === "object") {
//     const maybe =
//       payload.items ??
//       payload.rows ??
//       payload.data ??
//       payload.alerts ??
//       payload.results;

//     if (Array.isArray(maybe)) return maybe;
//   }

//   return [];
// }

// export default function Dashboard() {
//   const [rows, setRows] = useState<AccountRow[]>([]);
//   const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
//   const [lastSync, setLastSync] = useState<Date | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

//   async function fetchAlerts() {
//     try {
//       setErr(null);

//       // IMPORTANT: apiGet might return ANY json shape depending on backend.
//       const raw = await apiGet<any>(`/alerts?limit=200`);
//       const data = normalizeRows(raw);

//       setRows(data);

//       // default selection: first row if none selected or selection missing
//       if (!selectedAccountId && data.length > 0) {
//         setSelectedAccountId(data[0]?.account_id ?? null);
//       } else if (selectedAccountId && data.length > 0) {
//         const stillExists = data.some((r) => r.account_id === selectedAccountId);
//         if (!stillExists) setSelectedAccountId(data[0]?.account_id ?? null);
//       }

//       setLastSync(new Date());
//     } catch (e: any) {
//       setErr(e?.message ?? "Failed to fetch alerts");
//       setRows([]); // keep UI stable
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchAlerts();

//     // OPTIONAL: poll every 15s for "Live Monitoring"
//     const id = setInterval(fetchAlerts, 15000);
//     return () => clearInterval(id);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const metrics = useMemo(() => {
//     const safeRows = Array.isArray(rows) ? rows : [];

//     const high = safeRows.filter((r) => r.risk_band === "HIGH").length;
//     const totalNodes = safeRows.length;

//     const activePatternsCount = new Set(
//       safeRows.flatMap((r: any) => (Array.isArray(r.patterns) ? r.patterns : []))
//     ).size;

//     return {
//       totalTxns: "—", // later from backend /metrics
//       highRisk: high.toString(),
//       activePatterns: activePatternsCount.toString(),
//       graphNodes: totalNodes.toString(),
//     };
//   }, [rows]);

//   return (
//     <div className="min-h-screen p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground">
//             Fraud Investigation Dashboard
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Real-time micro-transaction analysis and pattern detection
//           </p>

//           {err && (
//             <p className="text-sm mt-2 text-risk-high">
//               API error: {err}
//             </p>
//           )}
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg">
//             <span className="relative flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
//             </span>
//             <span className="text-xs text-muted-foreground">Live Monitoring</span>
//           </div>

//           <div className="px-3 py-1.5 bg-card border border-border rounded-lg">
//             <span className="text-xs font-mono text-muted-foreground">
//               Last sync:{" "}
//               <span className="text-foreground">
//                 {lastSync ? lastSync.toLocaleTimeString() : "—"}
//               </span>
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Metrics Row */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <MetricCard
//           title="Total Transactions"
//           value={metrics.totalTxns}
//           subtitle="(hook to /metrics later)"
//           icon={<Activity className="w-5 h-5 text-primary" />}
//           trend="neutral"
//           trendValue="—"
//         />
//         <MetricCard
//           title="High Risk Accounts"
//           value={metrics.highRisk}
//           subtitle="Requires investigation"
//           icon={<AlertTriangle className="w-5 h-5 text-risk-high" />}
//           variant="risk-high"
//           trend="neutral"
//           trendValue="—"
//         />
//         <MetricCard
//           title="Active Patterns"
//           value={metrics.activePatterns}
//           subtitle="Across accounts"
//           icon={<Network className="w-5 h-5 text-risk-medium" />}
//           variant="risk-medium"
//         />
//         <MetricCard
//           title="Graph Nodes"
//           value={metrics.graphNodes}
//           subtitle="Accounts in network"
//           icon={<Users className="w-5 h-5 text-muted-foreground" />}
//           trend="neutral"
//           trendValue="—"
//         />
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         {/* Left Column */}
//         <div className="xl:col-span-2 space-y-6">
//           {/* Transaction Graph */}
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <Network className="w-5 h-5 text-primary" />
//                 Transaction Graph
//               </h2>
//               <div className="flex items-center gap-2">
//                 <button className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors">
//                   Zoom to Fit
//                 </button>
//                 <button className="px-3 py-1.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors">
//                   Expand View
//                 </button>
//               </div>
//             </div>

//             {/* Later: pass selectedAccountId to graph */}
//             <TransactionGraph />
//           </div>

//           {/* Accounts Table */}
//           {loading ? (
//             <div className="bg-card border border-border rounded-lg p-4 text-sm text-muted-foreground">
//               Loading accounts…
//             </div>
//           ) : (
//             <AccountsTable
//               accounts={Array.isArray(rows) ? rows : []}
//               selectedAccountId={selectedAccountId}
//               onSelect={setSelectedAccountId}
//             />
//           )}

//           <AgentStatusPanel />
//         </div>

//         {/* Right Column */}
//         <div className="space-y-6">
//           <AlertsList
//             alerts={Array.isArray(rows) ? rows : []}
//             selectedAccountId={selectedAccountId}
//             onSelect={setSelectedAccountId}
//           />

//           <TimelinePanel />
//           <ExplainabilityPanel />
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, Users, Network } from "lucide-react";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { TransactionGraph } from "@/components/dashboard/TransactionGraph";
import {
  AccountsTable,
  type AccountRow,
} from "@/components/dashboard/AccountsTable";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { TimelinePanel } from "@/components/dashboard/TimelinePanel";
import { ExplainabilityPanel } from "@/components/dashboard/ExplainabilityPanel";
import { AgentStatusPanel } from "@/components/dashboard/AgentStatusPanel";
import { apiGet } from "@/lib/api";

// ----------------------------
// Types (match your FastAPI)
// ----------------------------
type GraphStats = {
  total_nodes: number;
  total_edges: number;
  top_centrality?: any[];
};

type SubgraphNode = { id: string; [k: string]: any };
type SubgraphEdge = { source: string; target: string; amount?: number; count?: number; [k: string]: any };

type SubgraphResponse = {
  center: string | null;
  returned_nodes: number;
  returned_edges: number;
  nodes: SubgraphNode[];
  edges: SubgraphEdge[];
};

// ----------------------------
// Helpers: normalize API shapes
// ----------------------------
function normalizeRows(payload: any): AccountRow[] {
  if (Array.isArray(payload)) return payload;

  if (payload && typeof payload === "object") {
    const maybe =
      payload.items ??
      payload.rows ??
      payload.data ??
      payload.alerts ??
      payload.results;

    if (Array.isArray(maybe)) return maybe;
  }

  return [];
}

export default function Dashboard() {
  // Alerts/accounts
  const [rows, setRows] = useState<AccountRow[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  // Graph
  const [graphStats, setGraphStats] = useState<GraphStats | null>(null);
  const [subgraph, setSubgraph] = useState<SubgraphResponse | null>(null);

  // UI state
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [loadingGraph, setLoadingGraph] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // ----------------------------
  // 1) Fetch alerts + stats
  // ----------------------------
  async function fetchBase() {
    try {
      setErr(null);

      const [alertsRaw, statsRaw] = await Promise.all([
        apiGet<any>(`/alerts?limit=200`),
        apiGet<GraphStats>(`/graph/stats?top_k=10`),
      ]);

      const alerts = normalizeRows(alertsRaw);
      setRows(alerts);
      setGraphStats(statsRaw);

      // choose a default selection
      if (!selectedAccountId && alerts.length > 0) {
        setSelectedAccountId(alerts[0]?.account_id ?? null);
      } else if (selectedAccountId && alerts.length > 0) {
        const stillExists = alerts.some((r) => r.account_id === selectedAccountId);
        if (!stillExists) setSelectedAccountId(alerts[0]?.account_id ?? null);
      }

      setLastSync(new Date());
    } catch (e: any) {
      setErr(e?.message ?? "Failed to fetch dashboard data");
      setRows([]);
      setGraphStats(null);
    } finally {
      setLoadingAlerts(false);
    }
  }

  useEffect(() => {
    fetchBase();

    // OPTIONAL: poll for “Live Monitoring”
    const id = setInterval(fetchBase, 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------
  // 2) Fetch subgraph for selected account (for Dashboard graph)
  // ----------------------------
  useEffect(() => {
    if (!selectedAccountId) return;

    let alive = true;
    setLoadingGraph(true);

    (async () => {
      try {
        const data = await apiGet<SubgraphResponse>(
          `/graph/subgraph?center=${encodeURIComponent(selectedAccountId)}&hops=1&max_edges=250`
        );
        if (alive) setSubgraph(data);
      } catch (e: any) {
        if (alive) {
          setSubgraph(null);
          setErr(e?.message ?? "Failed to load dashboard graph");
        }
      } finally {
        if (alive) setLoadingGraph(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selectedAccountId]);

  // ----------------------------
  // Metrics
  // ----------------------------
  const metrics = useMemo(() => {
    const safeRows = Array.isArray(rows) ? rows : [];

    const high = safeRows.filter((r) => r.risk_band === "HIGH").length;
    const activePatternsCount = new Set(
      safeRows.flatMap((r: any) => (Array.isArray(r.patterns) ? r.patterns : []))
    ).size;

    // ✅ Total transactions = total edges from graph stats
    const totalTxns =
      typeof graphStats?.total_edges === "number"
        ? graphStats.total_edges.toLocaleString()
        : "—";

    // show graph nodes (either stats total_nodes or fallback to rows length)
    const graphNodes =
      typeof graphStats?.total_nodes === "number"
        ? graphStats.total_nodes.toLocaleString()
        : safeRows.length.toLocaleString();

    return {
      totalTxns,
      highRisk: high.toString(),
      activePatterns: activePatternsCount.toString(),
      graphNodes,
    };
  }, [rows, graphStats]);

  // ----------------------------
  // Build graphData for TransactionGraph
  // ----------------------------
  const graphData = useMemo(() => {
    const nodes = (subgraph?.nodes ?? []).map((n) => ({
      id: n.id,
      ...n,
      label: n.id,
    }));

    // TransactionGraph supports source/target OR from/to.
    const edges = (subgraph?.edges ?? []).map((e) => ({
      source: e.source,
      target: e.target,
      amount: e.amount ?? 0,
      count: e.count ?? 1,
    }));

    return { nodes, edges, links: edges };
  }, [subgraph]);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Fraud Investigation Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time micro-transaction analysis and pattern detection
          </p>

          {err && <p className="text-sm mt-2 text-risk-high">API error: {err}</p>}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-xs text-muted-foreground">Live Monitoring</span>
          </div>

          <div className="px-3 py-1.5 bg-card border border-border rounded-lg">
            <span className="text-xs font-mono text-muted-foreground">
              Last sync:{" "}
              <span className="text-foreground">
                {lastSync ? lastSync.toLocaleTimeString() : "—"}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Transactions"
          value={metrics.totalTxns}
          subtitle="Total edges in graph"
          icon={<Activity className="w-5 h-5 text-primary" />}
          trend="neutral"
          trendValue="—"
        />
        <MetricCard
          title="High Risk Accounts"
          value={metrics.highRisk}
          subtitle="Requires investigation"
          icon={<AlertTriangle className="w-5 h-5 text-risk-high" />}
          variant="risk-high"
          trend="neutral"
          trendValue="—"
        />
        <MetricCard
          title="Active Patterns"
          value={metrics.activePatterns}
          subtitle="Across accounts"
          icon={<Network className="w-5 h-5 text-risk-medium" />}
          variant="risk-medium"
        />
        <MetricCard
          title="Graph Nodes"
          value={metrics.graphNodes}
          subtitle="Accounts in network"
          icon={<Users className="w-5 h-5 text-muted-foreground" />}
          trend="neutral"
          trendValue="—"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Transaction Graph */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Network className="w-5 h-5 text-primary" />
                Transaction Graph
              </h2>

              <div className="text-xs text-muted-foreground">
                Center:{" "}
                <span className="font-mono text-foreground">
                  {selectedAccountId ?? "—"}
                </span>{" "}
                • Nodes:{" "}
                <span className="text-foreground">
                  {subgraph?.returned_nodes ?? "—"}
                </span>{" "}
                • Edges:{" "}
                <span className="text-foreground">
                  {subgraph?.returned_edges ?? "—"}
                </span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden p-3">
              {loadingGraph ? (
                <div className="h-96 flex items-center justify-center text-sm text-muted-foreground">
                  Loading graph…
                </div>
              ) : (
                // <TransactionGraph
                //   data={graphData}
                //   selectedNodeId={selectedAccountId ?? undefined}
                //   onNodeSelect={(id) => setSelectedAccountId(id)}
                //   maxNodes={120}
                //   maxEdges={250}
                //   // keep it clean on dashboard
                //   showEdgeLabels={false}
                //   focusMode={true}
                //   labelMode="focused"
                //   className="h-96"
                // />
                <TransactionGraph
                data={graphData}
                selectedNodeId={selectedAccountId ?? undefined}
                onNodeSelect={(id) => setSelectedAccountId(id)}
                maxNodes={120}
                maxEdges={250}

                /* ✅ correct props */
                showAmounts={false}
                amountMode="focused"
                focusMode={true}
                centerSelected={true}

                className="h-96"
              />
              )}
            </div>
          </div>

          {/* Accounts Table */}
          {loadingAlerts ? (
            <div className="bg-card border border-border rounded-lg p-4 text-sm text-muted-foreground">
              Loading accounts…
            </div>
          ) : (
            <AccountsTable
              accounts={Array.isArray(rows) ? rows : []}
              selectedAccountId={selectedAccountId}
              onSelect={setSelectedAccountId}
            />
          )}

          <AgentStatusPanel />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AlertsList
            alerts={Array.isArray(rows) ? rows : []}
            selectedAccountId={selectedAccountId}
            onSelect={setSelectedAccountId}
          />

          {/* Later: make these selected-account aware */}
          <TimelinePanel />
          <ExplainabilityPanel />
        </div>
      </div>
    </div>
  );
}
