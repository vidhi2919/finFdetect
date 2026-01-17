// import { useState } from "react";
// import { 
//   Network, 
//   ZoomIn, 
//   ZoomOut, 
//   Maximize, 
//   Filter,
//   Search,
//   Layers
// } from "lucide-react";
// import { TransactionGraph } from "@/components/dashboard/TransactionGraph";
// import { RiskBadge } from "@/components/dashboard/RiskBadge";

// export default function GraphView() {
//   const [selectedNode, setSelectedNode] = useState<string | null>("ACC-7821");

//   return (
//     <div className="min-h-screen p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
//             <Network className="w-6 h-6 text-primary" />
//             Transaction Graph Explorer
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Interactive visualization of money flow relationships
//           </p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
//         {/* Graph Area */}
//         <div className="xl:col-span-3 space-y-4">
//           {/* Controls */}
//           <div className="flex items-center justify-between bg-card border border-border rounded-lg p-3">
//             <div className="flex items-center gap-2">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <input
//                   type="text"
//                   placeholder="Search account..."
//                   className="pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
//                 />
//               </div>
//               <button className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg text-sm transition-colors">
//                 <Filter className="w-4 h-4" />
//                 Filters
//               </button>
//               <button className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg text-sm transition-colors">
//                 <Layers className="w-4 h-4" />
//                 Layers
//               </button>
//             </div>
//             <div className="flex items-center gap-2">
//               <button className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors">
//                 <ZoomIn className="w-4 h-4" />
//               </button>
//               <button className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors">
//                 <ZoomOut className="w-4 h-4" />
//               </button>
//               <button className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors">
//                 <Maximize className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           {/* Main Graph */}
//           <div className="graph-container h-[600px] relative">
//             <TransactionGraph />
//           </div>
//         </div>

//         {/* Details Panel */}
//         <div className="space-y-4">
//           {/* Selected Node Details */}
//           <div className="bg-card border border-border rounded-lg overflow-hidden">
//             <div className="px-4 py-3 border-b border-border">
//               <h3 className="text-sm font-semibold text-foreground">Node Details</h3>
//             </div>
            
//             {selectedNode ? (
//               <div className="p-4 space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span className="font-mono text-lg font-bold text-foreground">
//                     {selectedNode}
//                   </span>
//                   <RiskBadge level="high" score={0.92} size="sm" />
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">In-Degree</span>
//                     <span className="font-mono text-foreground">3</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Out-Degree</span>
//                     <span className="font-mono text-foreground">12</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Total Flow Out</span>
//                     <span className="font-mono text-primary">₹2,45,000</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Total Flow In</span>
//                     <span className="font-mono text-foreground">₹12,500</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Centrality Score</span>
//                     <span className="font-mono text-risk-high">0.87</span>
//                   </div>
//                 </div>

//                 <div className="pt-3 border-t border-border">
//                   <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">
//                     Detected Patterns
//                   </h4>
//                   <div className="flex flex-wrap gap-2">
//                     <span className="px-2 py-1 text-xs bg-risk-high/10 text-risk-high rounded border border-risk-high/20">
//                       Smurfing
//                     </span>
//                     <span className="px-2 py-1 text-xs bg-risk-medium/10 text-risk-medium rounded border border-risk-medium/20">
//                       Rapid Transfer
//                     </span>
//                   </div>
//                 </div>

//                 <button className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium rounded-lg transition-colors">
//                   View Full Profile
//                 </button>
//               </div>
//             ) : (
//               <div className="p-8 text-center">
//                 <Network className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
//                 <p className="text-sm text-muted-foreground">
//                   Select a node to view details
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Graph Statistics */}
//           <div className="bg-card border border-border rounded-lg p-4 space-y-3">
//             <h3 className="text-sm font-semibold text-foreground">Graph Statistics</h3>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Total Nodes</span>
//                 <span className="font-mono text-foreground">284</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Total Edges</span>
//                 <span className="font-mono text-foreground">1,247</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Connected Components</span>
//                 <span className="font-mono text-foreground">23</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Cycles Detected</span>
//                 <span className="font-mono text-risk-high">7</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




//////////////////////////////

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
//   Network,
//   ZoomIn,
//   ZoomOut,
//   Maximize,
//   Filter,
//   Search,
//   Layers,
// } from "lucide-react";
// import { TransactionGraph } from "@/components/dashboard/TransactionGraph";
// import { RiskBadge } from "@/components/dashboard/RiskBadge";
// import { apiGet } from "@/lib/api";

// type RiskLevelUI = "high" | "medium" | "low";

// type GraphSummary = {
//   total_nodes: number;
//   total_edges: number;
//   connected_components: number;
//   cycle_like_nodes: number;
// };

// type GraphNode = {
//   id: string;
//   in_degree?: number;
//   out_degree?: number;
//   total_flow_out?: number;
//   total_flow_in?: number;
//   centrality?: number;
// };

// type GraphEdge = {
//   source: string;
//   target: string;
//   amount?: number;
//   count?: number;
// };

// type SubgraphResponse = {
//   center: string;
//   hops: number;
//   returned_nodes: number;
//   returned_edges: number;
//   nodes: GraphNode[];
//   edges: GraphEdge[];
// };

// type NodeDetail = {
//   account_id: string;
//   in_degree: number;
//   out_degree: number;
//   total_flow_out: number;
//   total_flow_in: number;
//   centrality: number;
// };

// // --- Helpers ---
// function formatINR(x?: number | null) {
//   const n = Number(x ?? 0);
//   if (!Number.isFinite(n)) return "—";
//   return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
// }

// function riskFromCentrality(c?: number): RiskLevelUI {
//   const v = Number(c ?? 0);
//   if (v >= 0.08) return "high";
//   if (v >= 0.02) return "medium";
//   return "low";
// }

// export default function GraphView() {
//   const [query, setQuery] = useState<string>("ACC0065");
//   const [selectedNode, setSelectedNode] = useState<string | null>("ACC0065");

//   const [hops, setHops] = useState<number>(1);
//   const [minAmount, setMinAmount] = useState<number>(0);

//   const [summary, setSummary] = useState<GraphSummary | null>(null);
//   const [subgraph, setSubgraph] = useState<SubgraphResponse | null>(null);
//   const [nodeDetail, setNodeDetail] = useState<NodeDetail | null>(null);

//   const [loading, setLoading] = useState<boolean>(true);
//   const [err, setErr] = useState<string | null>(null);

//   // Load summary once
//   useEffect(() => {
//     (async () => {
//       try {
//         const s = await apiGet<GraphSummary>("/graph/summary");
//         setSummary(s);
//       } catch (e: any) {
//         // don't block UI
//         console.warn("graph summary failed", e?.message);
//       }
//     })();
//   }, []);

//   // Load subgraph whenever query/hops/minAmount changes
//   useEffect(() => {
//     (async () => {
//       try {
//         setErr(null);
//         setLoading(true);

//         const center = (query || "").trim();
//         if (!center) {
//           setSubgraph(null);
//           setLoading(false);
//           return;
//         }

//         const sg = await apiGet<SubgraphResponse>(
//           `/graph/subgraph?center=${encodeURIComponent(center)}&hops=${hops}&max_nodes=250&min_amount=${minAmount}`
//         );
//         setSubgraph(sg);

//         // auto-select center node
//         setSelectedNode(center);
//       } catch (e: any) {
//         setErr(e?.message ?? "Failed to load graph");
//         setSubgraph(null);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [query, hops, minAmount]);

//   // Load node details whenever selectedNode changes
//   useEffect(() => {
//     (async () => {
//       if (!selectedNode) {
//         setNodeDetail(null);
//         return;
//       }
//       try {
//         const d = await apiGet<NodeDetail>(`/graph/node/${encodeURIComponent(selectedNode)}`);
//         setNodeDetail(d);
//       } catch {
//         setNodeDetail(null);
//       }
//     })();
//   }, [selectedNode]);

//   const graphData = useMemo(() => {
//     // TransactionGraph usually needs { nodes, edges/links }
//     // We'll provide both keys for compatibility.
//     const nodes = (subgraph?.nodes ?? []).map((n) => ({ ...n, id: n.id }));
//     const edges = (subgraph?.edges ?? []).map((e) => ({ ...e }));
//     return { nodes, edges, links: edges };
//   }, [subgraph]);

//   const selectedRisk = useMemo(() => riskFromCentrality(nodeDetail?.centrality), [nodeDetail?.centrality]);

//   return (
//     <div className="min-h-screen p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
//             <Network className="w-6 h-6 text-primary" />
//             Transaction Graph Explorer
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Interactive visualization of money flow relationships (powered by /graph/*)
//           </p>
//           {err && <p className="text-sm text-risk-high mt-2">{err}</p>}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
//         {/* Graph Area */}
//         <div className="xl:col-span-3 space-y-4">
//           {/* Controls */}
//           <div className="flex items-center justify-between bg-card border border-border rounded-lg p-3">
//             <div className="flex items-center gap-2 flex-wrap">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <input
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   type="text"
//                   placeholder="Search account (e.g. ACC0065)..."
//                   className="pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
//                 />
//               </div>

//               <button
//                 className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg text-sm transition-colors"
//                 onClick={() => setHops((h) => (h >= 3 ? 1 : h + 1))}
//                 title="Increase hops (1 → 2 → 3 → 1)"
//               >
//                 <Filter className="w-4 h-4" />
//                 Hops: {hops}
//               </button>

//               <button
//                 className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg text-sm transition-colors"
//                 onClick={() => setMinAmount((m) => (m === 0 ? 10000 : 0))}
//                 title="Toggle min amount filter"
//               >
//                 <Layers className="w-4 h-4" />
//                 Min ₹: {minAmount === 0 ? "0" : minAmount.toLocaleString("en-IN")}
//               </button>
//             </div>

//             <div className="flex items-center gap-2">
//               {/* These buttons are UI-only unless your TransactionGraph exposes refs.
//                   Keep for now so design stays same. */}
//               <button className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors">
//                 <ZoomIn className="w-4 h-4" />
//               </button>
//               <button className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors">
//                 <ZoomOut className="w-4 h-4" />
//               </button>
//               <button className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors">
//                 <Maximize className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           {/* Main Graph */}
//           <div className="graph-container h-[600px] relative bg-card border border-border rounded-lg">
//             {loading ? (
//               <div className="p-4 text-sm text-muted-foreground">Loading subgraph…</div>
//             ) : (
//               <TransactionGraph
//                 data={graphData}
//                 // If your component supports callbacks, wire them:
//                 onNodeSelect={(id: string) => setSelectedNode(id)}
//                 selectedNodeId={selectedNode ?? undefined}
//               />
//             )}
//           </div>
//         </div>

//         {/* Details Panel */}
//         <div className="space-y-4">
//           {/* Selected Node Details */}
//           <div className="bg-card border border-border rounded-lg overflow-hidden">
//             <div className="px-4 py-3 border-b border-border">
//               <h3 className="text-sm font-semibold text-foreground">Node Details</h3>
//             </div>

//             {selectedNode ? (
//               <div className="p-4 space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span className="font-mono text-lg font-bold text-foreground">
//                     {selectedNode}
//                   </span>
//                   <RiskBadge level={selectedRisk} size="sm" />
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">In-Degree</span>
//                     <span className="font-mono text-foreground">{nodeDetail?.in_degree ?? "—"}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Out-Degree</span>
//                     <span className="font-mono text-foreground">{nodeDetail?.out_degree ?? "—"}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Total Flow Out</span>
//                     <span className="font-mono text-primary">{formatINR(nodeDetail?.total_flow_out)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Total Flow In</span>
//                     <span className="font-mono text-foreground">{formatINR(nodeDetail?.total_flow_in)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Centrality Score</span>
//                     <span className="font-mono text-risk-high">
//                       {nodeDetail?.centrality?.toFixed?.(4) ?? "—"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="pt-3 border-t border-border">
//                   <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">
//                     Detected Patterns
//                   </h4>
//                   {/* Optional: if you already have /patterns endpoint, you can fetch patterns for selectedNode.
//                       Keeping placeholder but NOT hardcoded duplicates. */}
//                   <div className="text-xs text-muted-foreground">
//                     View patterns in Cases/Reports page (or wire /patterns?account_id=...).
//                   </div>
//                 </div>

//                 <button
//                   className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium rounded-lg transition-colors"
//                   onClick={() => console.log("View Full Profile", selectedNode)}
//                 >
//                   View Full Profile
//                 </button>
//               </div>
//             ) : (
//               <div className="p-8 text-center">
//                 <Network className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
//                 <p className="text-sm text-muted-foreground">
//                   Select a node to view details
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Graph Statistics */}
//           <div className="bg-card border border-border rounded-lg p-4 space-y-3">
//             <h3 className="text-sm font-semibold text-foreground">Graph Statistics</h3>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Total Nodes</span>
//                 <span className="font-mono text-foreground">{summary?.total_nodes ?? "—"}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Total Edges</span>
//                 <span className="font-mono text-foreground">{summary?.total_edges ?? "—"}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Connected Components</span>
//                 <span className="font-mono text-foreground">{summary?.connected_components ?? "—"}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Cycle-like Nodes</span>
//                 <span className="font-mono text-risk-high">{summary?.cycle_like_nodes ?? "—"}</span>
//               </div>
//             </div>
//           </div>

//           {/* Subgraph quick stats */}
//           <div className="bg-card border border-border rounded-lg p-4 space-y-2 text-sm">
//             <h3 className="text-sm font-semibold text-foreground">Current View</h3>
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Center</span>
//               <span className="font-mono text-foreground">{subgraph?.center ?? "—"}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Returned Nodes</span>
//               <span className="font-mono text-foreground">{subgraph?.returned_nodes ?? "—"}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Returned Edges</span>
//               <span className="font-mono text-foreground">{subgraph?.returned_edges ?? "—"}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






// import { useEffect, useMemo, useState } from "react";
// import {
//   Network,
//   ZoomIn,
//   ZoomOut,
//   Maximize,
//   Filter,
//   Search,
//   Layers,
// } from "lucide-react";
// import { TransactionGraph } from "@/components/dashboard/TransactionGraph";
// import { RiskBadge } from "@/components/dashboard/RiskBadge";


// type RiskLevel = "high" | "medium" | "low";

// type GraphNode = {
//   id: string;
//   in_degree: number;
//   out_degree: number;
//   total_degree: number;
//   sent: number;
//   received: number;
//   centrality: number;
// };

// type GraphEdge = {
//   source: string;
//   target: string;
//   amount: number;
//   count: number;
// };

// type GraphStats = {
//   total_nodes: number;
//   total_edges: number;
//   top_centrality: GraphNode[];
// };

// type SubgraphResponse = {
//   center: string | null;
//   returned_nodes: number;
//   returned_edges: number;
//   nodes: GraphNode[];
//   edges: GraphEdge[];
// };

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// function riskFromScore(score0to1: number): RiskLevel {
//   if (score0to1 >= 0.7) return "high";
//   if (score0to1 >= 0.4) return "medium";
//   return "low";
// }

// export default function GraphView() {
//   // ⚠️ IMPORTANT: Your Neo4j accounts look like ACC0065 style (no dash)
//   const [query, setQuery] = useState<string>("ACC0065");
//   const [selectedNode, setSelectedNode] = useState<string | null>("ACC0065");

//   const [stats, setStats] = useState<GraphStats | null>(null);
//   const [subgraph, setSubgraph] = useState<SubgraphResponse | null>(null);
//   const [nodeDetails, setNodeDetails] = useState<GraphNode | null>(null);

//   const [loadingGraph, setLoadingGraph] = useState(false);
//   const [loadingNode, setLoadingNode] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Load graph stats once
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const r = await fetch(`${API_BASE}/graph/stats?top_k=10`);
//         if (!r.ok) throw new Error(await r.text());
//         const data = (await r.json()) as GraphStats;
//         if (alive) setStats(data);
//       } catch (e: any) {
//         if (alive) setError(e?.message || "Failed to load graph stats");
//       }
//     })();
//     return () => {
//       alive = false;
//     };
//   }, []);

//   // Load subgraph when selectedNode changes
//   useEffect(() => {
//     if (!selectedNode) return;

//     let alive = true;
//     setLoadingGraph(true);
//     setError(null);

//     (async () => {
//       try {
//         const r = await fetch(
//           `${API_BASE}/graph/subgraph?center=${encodeURIComponent(selectedNode)}&hops=1&max_edges=1500`
//         );
//         if (!r.ok) throw new Error(await r.text());
//         const data = (await r.json()) as SubgraphResponse;
//         if (alive) setSubgraph(data);
//       } catch (e: any) {
//         if (alive) setError(e?.message || "Failed to load graph");
//       } finally {
//         if (alive) setLoadingGraph(false);
//       }
//     })();

//     return () => {
//       alive = false;
//     };
//   }, [selectedNode]);

//   // Load node details when selectedNode changes
//   useEffect(() => {
//     if (!selectedNode) return;

//     let alive = true;
//     setLoadingNode(true);

//     (async () => {
//       try {
//         const r = await fetch(`${API_BASE}/graph/node/${encodeURIComponent(selectedNode)}`);
//         if (!r.ok) throw new Error(await r.text());
//         const data = (await r.json()) as GraphNode;
//         if (alive) setNodeDetails(data);
//       } catch (e: any) {
//         if (alive) setError(e?.message || "Failed to load node details");
//       } finally {
//         if (alive) setLoadingNode(false);
//       }
//     })();

//     return () => {
//       alive = false;
//     };
//   }, [selectedNode]);

//   // Build graph payload for whatever TransactionGraph expects
//   const graphData = useMemo(() => {
//     const nodes = (subgraph?.nodes ?? []).map((n) => ({
//       id: n.id,
//       ...n,
//       // convenience fields for some libs
//       label: n.id,
//       value: n.total_degree,
//     }));

//     const links = (subgraph?.edges ?? []).map((e) => ({
//       source: e.source,
//       target: e.target,
//       amount: e.amount,
//       count: e.count,
//       value: Math.max(1, Math.log10((e.amount || 1) + 1)), // visual weight helper
//     }));

//     return {
//       nodes,
//       links,
//       edges: links,
//     };
//   }, [subgraph]);

//   // derived risk for badge
//   const centralityScore = nodeDetails?.centrality ?? 0;
//   const nodeRisk = riskFromScore(centralityScore);

//   const onSearch = () => {
//     const trimmed = query.trim();
//     if (!trimmed) return;
//     setSelectedNode(trimmed);
//   };

//   return (
//     <div className="min-h-screen p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
//             <Network className="w-6 h-6 text-primary" />
//             Transaction Graph Explorer
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Interactive visualization of money flow relationships
//           </p>
//         </div>
//       </div>

//       {error && (
//         <div className="bg-card border border-risk-high/30 rounded-lg p-3 text-sm text-risk-high">
//           {error}
//         </div>
//       )}

//       <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
//         {/* Graph Area */}
//         <div className="xl:col-span-3 space-y-4">
//           {/* Controls */}
//           <div className="flex items-center justify-between bg-card border border-border rounded-lg p-3">
//             <div className="flex items-center gap-2">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <input
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") onSearch();
//                   }}
//                   type="text"
//                   placeholder="Search account..."
//                   className="pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
//                 />
//               </div>

//               <button
//                 onClick={onSearch}
//                 className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
//               >
//                 Go
//               </button>

//               <button className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg text-sm transition-colors">
//                 <Filter className="w-4 h-4" />
//                 Filters
//               </button>

//               <button className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg text-sm transition-colors">
//                 <Layers className="w-4 h-4" />
//                 Layers
//               </button>
//             </div>

//             <div className="flex items-center gap-2">
//               <button className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors">
//                 <ZoomIn className="w-4 h-4" />
//               </button>
//               <button className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors">
//                 <ZoomOut className="w-4 h-4" />
//               </button>
//               <button className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors">
//                 <Maximize className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           {/* Main Graph */}
//           <div className="graph-container h-[600px] relative bg-card border border-border rounded-lg overflow-hidden">
//             {loadingGraph ? (
//               <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
//                 Loading graph…
//               </div>
//             ) : (
//             //   <TransactionGraph
//             //   nodes={graphData.nodes}
//             //   edges={graphData.edges}
//             //   selectedNodeId={selectedNode ?? undefined}
//             //   onNodeSelect={(id) => setSelectedNode(id)}
//             // />
//             <TransactionGraph
//             data={graphData}
//             selectedNodeId={selectedNode ?? undefined}
//             onNodeSelect={(id) => setSelectedNode(id)}
//             maxNodes={120}
//             maxEdges={250}
//           />
//            )}
//           </div>
//         </div>

//         {/* Details Panel */}
//         <div className="space-y-4">
//           {/* Selected Node Details */}
//           <div className="bg-card border border-border rounded-lg overflow-hidden">
//             <div className="px-4 py-3 border-b border-border">
//               <h3 className="text-sm font-semibold text-foreground">Node Details</h3>
//             </div>

//             {selectedNode ? (
//               <div className="p-4 space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span className="font-mono text-lg font-bold text-foreground">
//                     {selectedNode}
//                   </span>
//                   <RiskBadge level={nodeRisk} score={centralityScore} size="sm" />
//                 </div>

//                 {loadingNode || !nodeDetails ? (
//                   <div className="text-sm text-muted-foreground">Loading node details…</div>
//                 ) : (
//                   <div className="space-y-3">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">In-Degree</span>
//                       <span className="font-mono text-foreground">{nodeDetails.in_degree}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Out-Degree</span>
//                       <span className="font-mono text-foreground">{nodeDetails.out_degree}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Total Flow Out</span>
//                       <span className="font-mono text-primary">
//                         ₹{Math.round(nodeDetails.sent).toLocaleString()}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Total Flow In</span>
//                       <span className="font-mono text-foreground">
//                         ₹{Math.round(nodeDetails.received).toLocaleString()}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Centrality Score</span>
//                       <span className="font-mono text-risk-high">
//                         {nodeDetails.centrality.toFixed(4)}
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 <button className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium rounded-lg transition-colors">
//                   View Full Profile
//                 </button>
//               </div>
//             ) : (
//               <div className="p-8 text-center">
//                 <Network className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
//                 <p className="text-sm text-muted-foreground">Select a node to view details</p>
//               </div>
//             )}
//           </div>

//           {/* Graph Statistics */}
//           <div className="bg-card border border-border rounded-lg p-4 space-y-3">
//             <h3 className="text-sm font-semibold text-foreground">Graph Statistics</h3>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Total Nodes</span>
//                 <span className="font-mono text-foreground">{stats?.total_nodes ?? "—"}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Total Edges</span>
//                 <span className="font-mono text-foreground">{stats?.total_edges ?? "—"}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Returned Nodes</span>
//                 <span className="font-mono text-foreground">{subgraph?.returned_nodes ?? "—"}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Returned Edges</span>
//                 <span className="font-mono text-foreground">{subgraph?.returned_edges ?? "—"}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





// import { useEffect, useMemo, useRef, useState } from "react";
// import {
//   Network,
//   ZoomIn,
//   ZoomOut,
//   Maximize,
//   Filter,
//   Search,
//   Layers,
// } from "lucide-react";
// import {
//   TransactionGraph,
//   type TransactionGraphHandle,
// } from "@/components/dashboard/TransactionGraph";
// import { RiskBadge } from "@/components/dashboard/RiskBadge";
// import { cn } from "@/lib/utils";

// type RiskLevel = "high" | "medium" | "low";

// type GraphNode = {
//   id: string;
//   in_degree: number;
//   out_degree: number;
//   total_degree: number;
//   sent: number;
//   received: number;
//   centrality: number;
// };

// type GraphEdge = {
//   source: string;
//   target: string;
//   amount: number;
//   count: number;
// };

// type GraphStats = {
//   total_nodes: number;
//   total_edges: number;
//   top_centrality: GraphNode[];
// };

// type SubgraphResponse = {
//   center: string | null;
//   returned_nodes: number;
//   returned_edges: number;
//   nodes: GraphNode[];
//   edges: GraphEdge[];
// };

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// function riskFromScore(score0to1: number): RiskLevel {
//   if (score0to1 >= 0.7) return "high";
//   if (score0to1 >= 0.4) return "medium";
//   return "low";
// }

// export default function GraphView() {
//   const graphRef = useRef<TransactionGraphHandle | null>(null);

//   // Search + selection
//   const [query, setQuery] = useState<string>("ACC0065");
//   const [selectedNode, setSelectedNode] = useState<string | null>("ACC0065");

//   // Toggle buttons (requested)
//   const [showAmounts, setShowAmounts] = useState(false);
//   const [focusMode, setFocusMode] = useState(true);

//   // Data
//   const [stats, setStats] = useState<GraphStats | null>(null);
//   const [subgraph, setSubgraph] = useState<SubgraphResponse | null>(null);
//   const [nodeDetails, setNodeDetails] = useState<GraphNode | null>(null);

//   // Loading/errors
//   const [loadingGraph, setLoadingGraph] = useState(false);
//   const [loadingNode, setLoadingNode] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Load graph stats once
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const r = await fetch(`${API_BASE}/graph/stats?top_k=10`);
//         if (!r.ok) throw new Error(await r.text());
//         const data = (await r.json()) as GraphStats;
//         if (alive) setStats(data);
//       } catch (e: any) {
//         if (alive) setError(e?.message || "Failed to load graph stats");
//       }
//     })();
//     return () => {
//       alive = false;
//     };
//   }, []);

//   // Load subgraph when selectedNode changes
//   useEffect(() => {
//     if (!selectedNode) return;

//     let alive = true;
//     setLoadingGraph(true);
//     setError(null);

//     (async () => {
//       try {
//         const r = await fetch(
//           `${API_BASE}/graph/subgraph?center=${encodeURIComponent(
//             selectedNode
//           )}&hops=1&max_edges=1500`
//         );
//         if (!r.ok) throw new Error(await r.text());
//         const data = (await r.json()) as SubgraphResponse;
//         if (alive) setSubgraph(data);
//       } catch (e: any) {
//         if (alive) setError(e?.message || "Failed to load graph");
//       } finally {
//         if (alive) setLoadingGraph(false);
//       }
//     })();

//     return () => {
//       alive = false;
//     };
//   }, [selectedNode]);

//   // Load node details when selectedNode changes
//   useEffect(() => {
//     if (!selectedNode) return;

//     let alive = true;
//     setLoadingNode(true);

//     (async () => {
//       try {
//         const r = await fetch(
//           `${API_BASE}/graph/node/${encodeURIComponent(selectedNode)}`
//         );
//         if (!r.ok) throw new Error(await r.text());
//         const data = (await r.json()) as GraphNode;
//         if (alive) setNodeDetails(data);
//       } catch (e: any) {
//         if (alive) setError(e?.message || "Failed to load node details");
//       } finally {
//         if (alive) setLoadingNode(false);
//       }
//     })();

//     return () => {
//       alive = false;
//     };
//   }, [selectedNode]);

//   // Build graph payload for TransactionGraph
//   const graphData = useMemo(() => {
//     const nodes = (subgraph?.nodes ?? []).map((n) => ({
//       id: n.id,
//       ...n,
//       label: n.id,
//       value: n.total_degree,
//     }));

//     const links = (subgraph?.edges ?? []).map((e) => ({
//       // TransactionGraph supports source/target OR from/to
//       source: e.source,
//       target: e.target,
//       amount: e.amount,
//       count: e.count,
//       value: Math.max(1, Math.log10((e.amount || 1) + 1)),
//     }));

//     return {
//       nodes,
//       links,
//       edges: links,
//     };
//   }, [subgraph]);

//   // Derived risk for badge
//   const centralityScore = nodeDetails?.centrality ?? 0;
//   const nodeRisk = riskFromScore(centralityScore);

//   const onSearch = () => {
//     const trimmed = query.trim();
//     if (!trimmed) return;
//     setSelectedNode(trimmed);
//   };

// const [centerSelected, setCenterSelected] = useState(true);
// const [amountMode, setAmountMode] = useState<"hover" | "focused" | "topk">("focused");


//   return (
//     <div className="min-h-screen p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
//             <Network className="w-6 h-6 text-primary" />
//             Transaction Graph Explorer
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Interactive visualization of money flow relationships
//           </p>
//         </div>
//       </div>

//       {error && (
//         <div className="bg-card border border-risk-high/30 rounded-lg p-3 text-sm text-risk-high">
//           {error}
//         </div>
//       )}

//       <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
//         {/* Graph Area */}
//         <div className="xl:col-span-3 space-y-4">
//           {/* Controls */}
//           <div className="flex items-center justify-between bg-card border border-border rounded-lg p-3">
//             <div className="flex items-center gap-2">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <input
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") onSearch();
//                   }}
//                   type="text"
//                   placeholder="Search account..."
//                   className="pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
//                 />
//               </div>

//               <button
//                 onClick={onSearch}
//                 className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
//               >
//                 Go
//               </button>

//               {/* ✅ Toggle 1: Amounts */}
//               <button
//                 onClick={() => setShowAmounts((s) => !s)}
//                 className={cn(
//                   "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
//                   showAmounts
//                     ? "bg-primary text-primary-foreground"
//                     : "bg-muted hover:bg-muted/80 text-muted-foreground"
//                 )}
//                 title="Toggle edge amount labels (focused edges)"
//               >
//                 ₹ Amounts
//               </button>

//               {/* ✅ Toggle 2: Focus mode */}
//               <button
//                 onClick={() => setFocusMode((s) => !s)}
//                 className={cn(
//                   "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
//                   focusMode
//                     ? "bg-primary text-primary-foreground"
//                     : "bg-muted hover:bg-muted/80 text-muted-foreground"
//                 )}
//                 title="Dim non-neighbor nodes/edges"
//               >
//                 Focus
//               </button>

//               <button className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg text-sm transition-colors">
//                 <Filter className="w-4 h-4" />
//                 Filters
//               </button>

//               <button className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg text-sm transition-colors">
//                 <Layers className="w-4 h-4" />
//                 Layers
//               </button>
//             </div>

//             {/* ✅ Zoom buttons now WORK */}
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => graphRef.current?.zoomIn()}
//                 className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors"
//                 title="Zoom in"
//               >
//                 <ZoomIn className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => graphRef.current?.zoomOut()}
//                 className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors"
//                 title="Zoom out"
//               >
//                 <ZoomOut className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => graphRef.current?.reset()}
//                 className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors"
//                 title="Reset zoom"
//               >
//                 <Maximize className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           {/* Main Graph */}
//           <div className="graph-container h-[600px] relative bg-card border border-border rounded-lg overflow-hidden">
//             {loadingGraph ? (
//               <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
//                 Loading graph…
//               </div>
//             ) : (
//               // <TransactionGraph
//               //   ref={graphRef}
//               //   data={graphData}
//               //   selectedNodeId={selectedNode ?? undefined}
//               //   onNodeSelect={(id) => setSelectedNode(id)}
//               //   maxNodes={120}
//               //   maxEdges={250}
//               //   showEdgeLabels={showAmounts}
//               //   focusMode={focusMode}
//               //   labelMode="focused"
//               // />
//                         <TransactionGraph
//             ref={graphRef}
//             data={graphData}
//             selectedNodeId={selectedNode ?? undefined}
//             onNodeSelect={(id) => setSelectedNode(id)}
//             maxNodes={120}
//             maxEdges={250}
//             showAmounts={showAmounts}
//             amountMode={amountMode}
//             focusMode={focusMode}
//             centerSelected={centerSelected}
//           />

//             )}
//           </div>
//         </div>

//         {/* Details Panel */}
//         <div className="space-y-4">
//           {/* Selected Node Details */}
//           <div className="bg-card border border-border rounded-lg overflow-hidden">
//             <div className="px-4 py-3 border-b border-border">
//               <h3 className="text-sm font-semibold text-foreground">
//                 Node Details
//               </h3>
//             </div>

//             {selectedNode ? (
//               <div className="p-4 space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span className="font-mono text-lg font-bold text-foreground">
//                     {selectedNode}
//                   </span>
//                   <RiskBadge level={nodeRisk} score={centralityScore} size="sm" />
//                 </div>

//                 {loadingNode || !nodeDetails ? (
//                   <div className="text-sm text-muted-foreground">
//                     Loading node details…
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">In-Degree</span>
//                       <span className="font-mono text-foreground">
//                         {nodeDetails.in_degree}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Out-Degree</span>
//                       <span className="font-mono text-foreground">
//                         {nodeDetails.out_degree}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Total Flow Out</span>
//                       <span className="font-mono text-primary">
//                         ₹{Math.round(nodeDetails.sent).toLocaleString()}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Total Flow In</span>
//                       <span className="font-mono text-foreground">
//                         ₹{Math.round(nodeDetails.received).toLocaleString()}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Centrality Score</span>
//                       <span className="font-mono text-risk-high">
//                         {nodeDetails.centrality.toFixed(4)}
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 <button className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium rounded-lg transition-colors">
//                   View Full Profile
//                 </button>
//               </div>
//             ) : (
//               <div className="p-8 text-center">
//                 <Network className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
//                 <p className="text-sm text-muted-foreground">
//                   Select a node to view details
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Graph Statistics */}
//           <div className="bg-card border border-border rounded-lg p-4 space-y-3">
//             <h3 className="text-sm font-semibold text-foreground">
//               Graph Statistics
//             </h3>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Total Nodes</span>
//                 <span className="font-mono text-foreground">
//                   {stats?.total_nodes ?? "—"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Total Edges</span>
//                 <span className="font-mono text-foreground">
//                   {stats?.total_edges ?? "—"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Returned Nodes</span>
//                 <span className="font-mono text-foreground">
//                   {subgraph?.returned_nodes ?? "—"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Returned Edges</span>
//                 <span className="font-mono text-foreground">
//                   {subgraph?.returned_edges ?? "—"}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useMemo, useRef, useState } from "react";
import {
  Network,
  ZoomIn,
  ZoomOut,
  Maximize,
  Filter,
  Search,
  Layers,
} from "lucide-react";
import {
  TransactionGraph,
  type TransactionGraphHandle,
} from "@/components/dashboard/TransactionGraph";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { cn } from "@/lib/utils";

type RiskLevel = "high" | "medium" | "low";

type GraphNode = {
  id: string;
  in_degree: number;
  out_degree: number;
  total_degree: number;
  sent: number;
  received: number;
  centrality: number;
};

type GraphEdge = {
  source: string;
  target: string;
  amount: number;
  count: number;
};

type GraphStats = {
  total_nodes: number;
  total_edges: number;
  top_centrality: GraphNode[];
};

type SubgraphResponse = {
  center: string | null;
  returned_nodes: number;
  returned_edges: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function riskFromScore(score0to1: number): RiskLevel {
  if (score0to1 >= 0.7) return "high";
  if (score0to1 >= 0.4) return "medium";
  return "low";
}

export default function GraphView() {
  const graphRef = useRef<TransactionGraphHandle | null>(null);

  // Search + selection
  const [query, setQuery] = useState<string>("ACC0065");
  const [selectedNode, setSelectedNode] = useState<string | null>("ACC0065");

  // Toggles
  const [showAmounts, setShowAmounts] = useState(false);
  const [focusMode, setFocusMode] = useState(true);
  const [centerSelected, setCenterSelected] = useState(true);

  // Amount label mode
  const [amountMode, setAmountMode] = useState<"hover" | "focused" | "topk">(
    "focused"
  );

  // Data
  const [stats, setStats] = useState<GraphStats | null>(null);
  const [subgraph, setSubgraph] = useState<SubgraphResponse | null>(null);
  const [nodeDetails, setNodeDetails] = useState<GraphNode | null>(null);

  // Loading/errors
  const [loadingGraph, setLoadingGraph] = useState(false);
  const [loadingNode, setLoadingNode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSelectedNode(trimmed);
  };

  // Load graph stats once
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/graph/stats?top_k=10`);
        if (!r.ok) throw new Error(await r.text());
        const data = (await r.json()) as GraphStats;
        if (alive) setStats(data);
      } catch (e: any) {
        if (alive) setError(e?.message || "Failed to load graph stats");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Load subgraph when selectedNode changes
  useEffect(() => {
    if (!selectedNode) return;

    let alive = true;
    setLoadingGraph(true);
    setError(null);

    (async () => {
      try {
        const r = await fetch(
          `${API_BASE}/graph/subgraph?center=${encodeURIComponent(
            selectedNode
          )}&hops=1&max_edges=1500`
        );
        if (!r.ok) throw new Error(await r.text());
        const data = (await r.json()) as SubgraphResponse;
        if (alive) setSubgraph(data);
      } catch (e: any) {
        if (alive) setError(e?.message || "Failed to load graph");
      } finally {
        if (alive) setLoadingGraph(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selectedNode]);

  // Load node details when selectedNode changes
  useEffect(() => {
    if (!selectedNode) return;

    let alive = true;
    setLoadingNode(true);

    (async () => {
      try {
        const r = await fetch(
          `${API_BASE}/graph/node/${encodeURIComponent(selectedNode)}`
        );
        if (!r.ok) throw new Error(await r.text());
        const data = (await r.json()) as GraphNode;
        if (alive) setNodeDetails(data);
      } catch (e: any) {
        if (alive) setError(e?.message || "Failed to load node details");
      } finally {
        if (alive) setLoadingNode(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selectedNode]);

  // Build graph payload for TransactionGraph
  const graphData = useMemo(() => {
    const nodes = (subgraph?.nodes ?? []).map((n) => ({
      id: n.id,
      ...n,
      label: n.id,
      value: n.total_degree,
    }));

    const edges = (subgraph?.edges ?? []).map((e) => ({
      source: e.source,
      target: e.target,
      amount: e.amount,
      count: e.count,
      value: Math.max(1, Math.log10((e.amount || 1) + 1)),
    }));

    return {
      nodes,
      edges,
      links: edges, // keep both just in case something else uses links
    };
  }, [subgraph]);

  // Derived risk for badge
  const centralityScore = nodeDetails?.centrality ?? 0;
  const nodeRisk = riskFromScore(centralityScore);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Network className="w-6 h-6 text-primary" />
            Transaction Graph Explorer
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Interactive visualization of money flow relationships
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-card border border-risk-high/30 rounded-lg p-3 text-sm text-risk-high">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Graph Area */}
        <div className="xl:col-span-3 space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between bg-card border border-border rounded-lg p-3">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSearch();
                  }}
                  type="text"
                  placeholder="Search account..."
                  className="pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <button
                onClick={onSearch}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Go
              </button>

              {/* ✅ Toggle 1: Amounts */}
              <button
                onClick={() => setShowAmounts((s) => !s)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm transition-colors",
                  showAmounts
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                )}
                title="Toggle amount labels"
              >
                ₹ Amounts
              </button>

              {/* ✅ Amount mode selector */}
              <select
                value={amountMode}
                onChange={(e) =>
                  setAmountMode(e.target.value as "hover" | "focused" | "topk")
                }
                disabled={!showAmounts}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm border border-border bg-muted text-foreground",
                  !showAmounts && "opacity-50 cursor-not-allowed"
                )}
                title="Amount label mode"
              >
                <option value="focused">Focused</option>
                <option value="hover">Hover</option>
                <option value="topk">TopK</option>
              </select>

              {/* ✅ Toggle 2: Focus mode */}
              <button
                onClick={() => setFocusMode((s) => !s)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm transition-colors",
                  focusMode
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                )}
                title="Dim non-neighbor nodes/edges"
              >
                Focus
              </button>

              {/* ✅ Toggle 3: Center */}
              <button
                onClick={() => setCenterSelected((s) => !s)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm transition-colors",
                  centerSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                )}
                title="Keep selected node in the center"
              >
                Center
              </button>

              <button className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg text-sm transition-colors">
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <button className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg text-sm transition-colors">
                <Layers className="w-4 h-4" />
                Layers
              </button>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => graphRef.current?.zoomIn()}
                className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => graphRef.current?.zoomOut()}
                className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => graphRef.current?.reset()}
                className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors"
                title="Reset zoom"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Graph */}
          <div className="graph-container h-[600px] relative bg-card border border-border rounded-lg overflow-hidden">
            {loadingGraph ? (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                Loading graph…
              </div>
            ) : (
              <TransactionGraph
                ref={graphRef}
                data={graphData}
                selectedNodeId={selectedNode ?? undefined}
                onNodeSelect={(id) => setSelectedNode(id)}
                maxNodes={120}
                maxEdges={250}
                showAmounts={showAmounts}
                amountMode={amountMode}
                focusMode={focusMode}
                centerSelected={centerSelected}
                topK={15}
              />
            )}
          </div>
        </div>

        {/* Details Panel */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">
                Node Details
              </h3>
            </div>

            {selectedNode ? (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-bold text-foreground">
                    {selectedNode}
                  </span>
                  <RiskBadge level={nodeRisk} score={centralityScore} size="sm" />
                </div>

                {loadingNode || !nodeDetails ? (
                  <div className="text-sm text-muted-foreground">
                    Loading node details…
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">In-Degree</span>
                      <span className="font-mono text-foreground">
                        {nodeDetails.in_degree}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Out-Degree</span>
                      <span className="font-mono text-foreground">
                        {nodeDetails.out_degree}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Flow Out</span>
                      <span className="font-mono text-primary">
                        ₹{Math.round(nodeDetails.sent).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Flow In</span>
                      <span className="font-mono text-foreground">
                        ₹{Math.round(nodeDetails.received).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Centrality Score</span>
                      <span className="font-mono text-risk-high">
                        {nodeDetails.centrality.toFixed(4)}
                      </span>
                    </div>
                  </div>
                )}

                <button className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium rounded-lg transition-colors">
                  View Full Profile
                </button>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Network className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Select a node to view details
                </p>
              </div>
            )}
          </div>

          {/* Graph Statistics */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Graph Statistics
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Nodes</span>
                <span className="font-mono text-foreground">
                  {stats?.total_nodes ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Edges</span>
                <span className="font-mono text-foreground">
                  {stats?.total_edges ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Returned Nodes</span>
                <span className="font-mono text-foreground">
                  {subgraph?.returned_nodes ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Returned Edges</span>
                <span className="font-mono text-foreground">
                  {subgraph?.returned_edges ?? "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
