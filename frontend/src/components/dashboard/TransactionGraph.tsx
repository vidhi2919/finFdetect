// import { useEffect, useRef } from "react";
// import { cn } from "@/lib/utils";

// interface Node {
//   id: string;
//   x: number;
//   y: number;
//   risk: "high" | "medium" | "low";
//   label: string;
// }

// interface Edge {
//   from: string;
//   to: string;
//   amount: number;
// }

// const mockNodes: Node[] = [
//   { id: "A001", x: 150, y: 100, risk: "high", label: "A001" },
//   { id: "A002", x: 350, y: 80, risk: "medium", label: "A002" },
//   { id: "A003", x: 300, y: 200, risk: "low", label: "A003" },
//   { id: "A004", x: 100, y: 250, risk: "high", label: "A004" },
//   { id: "A005", x: 450, y: 180, risk: "medium", label: "A005" },
//   { id: "A006", x: 200, y: 320, risk: "low", label: "A006" },
//   { id: "A007", x: 400, y: 300, risk: "high", label: "A007" },
//   { id: "A008", x: 500, y: 100, risk: "low", label: "A008" },
// ];

// const mockEdges: Edge[] = [
//   { from: "A001", to: "A002", amount: 4999 },
//   { from: "A001", to: "A003", amount: 4850 },
//   { from: "A001", to: "A004", amount: 4750 },
//   { from: "A002", to: "A005", amount: 3200 },
//   { from: "A003", to: "A006", amount: 2100 },
//   { from: "A004", to: "A007", amount: 4500 },
//   { from: "A005", to: "A008", amount: 2800 },
//   { from: "A007", to: "A001", amount: 1500 },
// ];

// export function TransactionGraph() {
//   const getNodeColor = (risk: string) => {
//     switch (risk) {
//       case "high": return "hsl(0, 75%, 55%)";
//       case "medium": return "hsl(38, 92%, 50%)";
//       case "low": return "hsl(145, 65%, 42%)";
//       default: return "hsl(175, 70%, 45%)";
//     }
//   };

//   const getNodeById = (id: string) => mockNodes.find(n => n.id === id);

//   return (
//     <div className="graph-container h-96 relative">
//       <div className="absolute top-4 left-4 z-10 flex items-center gap-4 text-xs">
//         <div className="flex items-center gap-2">
//           <span className="w-3 h-3 rounded-full bg-risk-high" />
//           <span className="text-muted-foreground">High Risk</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="w-3 h-3 rounded-full bg-risk-medium" />
//           <span className="text-muted-foreground">Medium</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="w-3 h-3 rounded-full bg-risk-low" />
//           <span className="text-muted-foreground">Low</span>
//         </div>
//       </div>

//       <svg className="w-full h-full">
//         <defs>
//           <marker
//             id="arrowhead"
//             markerWidth="10"
//             markerHeight="7"
//             refX="9"
//             refY="3.5"
//             orient="auto"
//           >
//             <polygon
//               points="0 0, 10 3.5, 0 7"
//               fill="hsl(220, 15%, 35%)"
//             />
//           </marker>
//           <filter id="glow">
//             <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
//             <feMerge>
//               <feMergeNode in="coloredBlur"/>
//               <feMergeNode in="SourceGraphic"/>
//             </feMerge>
//           </filter>
//         </defs>

//         {/* Edges */}
//         {mockEdges.map((edge, index) => {
//           const fromNode = getNodeById(edge.from);
//           const toNode = getNodeById(edge.to);
//           if (!fromNode || !toNode) return null;

//           return (
//             <g key={index}>
//               <line
//                 x1={fromNode.x}
//                 y1={fromNode.y}
//                 x2={toNode.x}
//                 y2={toNode.y}
//                 stroke="hsl(220, 15%, 25%)"
//                 strokeWidth="2"
//                 markerEnd="url(#arrowhead)"
//                 strokeDasharray="4"
//                 className="animate-flow"
//               />
//               <text
//                 x={(fromNode.x + toNode.x) / 2}
//                 y={(fromNode.y + toNode.y) / 2 - 8}
//                 fill="hsl(215, 15%, 55%)"
//                 fontSize="10"
//                 textAnchor="middle"
//                 className="font-mono"
//               >
//                 ₹{edge.amount.toLocaleString()}
//               </text>
//             </g>
//           );
//         })}

//         {/* Nodes */}
//         {mockNodes.map((node) => (
//           <g key={node.id} className="cursor-pointer">
//             <circle
//               cx={node.x}
//               cy={node.y}
//               r="24"
//               fill="hsl(220, 18%, 10%)"
//               stroke={getNodeColor(node.risk)}
//               strokeWidth="2"
//               filter="url(#glow)"
//             />
//             <circle
//               cx={node.x}
//               cy={node.y}
//               r="20"
//               fill={getNodeColor(node.risk)}
//               opacity="0.15"
//             />
//             <text
//               x={node.x}
//               y={node.y + 4}
//               fill="hsl(210, 20%, 95%)"
//               fontSize="10"
//               textAnchor="middle"
//               className="font-mono font-medium"
//             >
//               {node.label}
//             </text>
//           </g>
//         ))}
//       </svg>

//       <div className="scan-line" />
//     </div>
//   );
// }


// import { cn } from "@/lib/utils";

// type RiskLevel = "high" | "medium" | "low";

// export interface GraphNode {
//   id: string;
//   x?: number;
//   y?: number;
//   risk?: RiskLevel;
//   label?: string;
// }

// export interface GraphEdge {
//   source?: string;
//   target?: string;
//   from?: string;
//   to?: string;
//   amount: number;
//   count?: number;
// }

// type Props = {
//   nodes: GraphNode[];
//   edges: GraphEdge[];
//   selectedNodeId?: string;
//   onNodeSelect?: (id: string) => void;
// };

// export function TransactionGraph({
//   nodes,
//   edges,
//   selectedNodeId,
//   onNodeSelect,
// }: Props) {
//   const getNodeColor = (risk: string) => {
//     switch (risk) {
//       case "high":
//         return "hsl(0, 75%, 55%)";
//       case "medium":
//         return "hsl(38, 92%, 50%)";
//       case "low":
//         return "hsl(145, 65%, 42%)";
//       default:
//         return "hsl(175, 70%, 45%)";
//     }
//   };

//   // --- simple layout if x/y not provided ---
//   // place nodes in a circle
//   const laidOutNodes = (() => {
//     const w = 700;
//     const h = 500;
//     const cx = w / 2;
//     const cy = h / 2;
//     const r = Math.min(w, h) / 2 - 80;

//     return nodes.map((n, i) => {
//       const angle = (2 * Math.PI * i) / Math.max(1, nodes.length);
//       return {
//         ...n,
//         label: n.label ?? n.id,
//         risk: n.risk ?? "low",
//         x: n.x ?? cx + r * Math.cos(angle),
//         y: n.y ?? cy + r * Math.sin(angle),
//       };
//     });
//   })();

//   const nodeById = new Map(laidOutNodes.map((n) => [n.id, n]));

//   const normEdges = edges.map((e) => ({
//     from: e.from ?? e.source ?? "",
//     to: e.to ?? e.target ?? "",
//     amount: e.amount,
//     count: e.count ?? 1,
//   }));

//   return (
//     <div className="graph-container h-96 relative">
//       {/* Legend */}
//       <div className="absolute top-4 left-4 z-10 flex items-center gap-4 text-xs">
//         <div className="flex items-center gap-2">
//           <span className="w-3 h-3 rounded-full bg-risk-high" />
//           <span className="text-muted-foreground">High Risk</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="w-3 h-3 rounded-full bg-risk-medium" />
//           <span className="text-muted-foreground">Medium</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="w-3 h-3 rounded-full bg-risk-low" />
//           <span className="text-muted-foreground">Low</span>
//         </div>
//       </div>

//       <svg className="w-full h-full" viewBox="0 0 700 500">
//         <defs>
//           <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
//             <polygon points="0 0, 10 3.5, 0 7" fill="hsl(220, 15%, 35%)" />
//           </marker>
//           <filter id="glow">
//             <feGaussianBlur stdDeviation="3" result="coloredBlur" />
//             <feMerge>
//               <feMergeNode in="coloredBlur" />
//               <feMergeNode in="SourceGraphic" />
//             </feMerge>
//           </filter>
//         </defs>

//         {/* Edges */}
//         {normEdges.map((edge, index) => {
//           const fromNode = nodeById.get(edge.from);
//           const toNode = nodeById.get(edge.to);
//           if (!fromNode || !toNode) return null;

//           return (
//             <g key={index}>
//               <line
//                 x1={fromNode.x}
//                 y1={fromNode.y}
//                 x2={toNode.x}
//                 y2={toNode.y}
//                 stroke="hsl(220, 15%, 25%)"
//                 strokeWidth="2"
//                 markerEnd="url(#arrowhead)"
//                 strokeDasharray="4"
//                 className="animate-flow"
//               />
//               <text
//                 x={(fromNode.x! + toNode.x!) / 2}
//                 y={(fromNode.y! + toNode.y!) / 2 - 8}
//                 fill="hsl(215, 15%, 55%)"
//                 fontSize="10"
//                 textAnchor="middle"
//                 className="font-mono"
//               >
//                 ₹{Math.round(edge.amount).toLocaleString()}
//               </text>
//             </g>
//           );
//         })}

//         {/* Nodes */}
//         {laidOutNodes.map((node) => {
//           const isSelected = selectedNodeId && node.id === selectedNodeId;

//           return (
//             <g
//               key={node.id}
//               className="cursor-pointer"
//               onClick={() => onNodeSelect?.(node.id)}
//             >
//               <circle
//                 cx={node.x}
//                 cy={node.y}
//                 r="24"
//                 fill="hsl(220, 18%, 10%)"
//                 stroke={getNodeColor(node.risk!)}
//                 strokeWidth={isSelected ? "3" : "2"}
//                 filter="url(#glow)"
//               />
//               <circle cx={node.x} cy={node.y} r="20" fill={getNodeColor(node.risk!)} opacity="0.15" />
//               <text
//                 x={node.x}
//                 y={node.y! + 4}
//                 fill="hsl(210, 20%, 95%)"
//                 fontSize="10"
//                 textAnchor="middle"
//                 className="font-mono font-medium"
//               >
//                 {node.label}
//               </text>
//             </g>
//           );
//         })}
//       </svg>

//       <div className="scan-line" />
//     </div>
//   );
// }






// import React, { useMemo } from "react";
// import { cn } from "@/lib/utils";

// type Risk = "high" | "medium" | "low";

// export type GraphNode = {
//   id: string;
//   label?: string;
//   risk?: Risk;
//   x?: number;
//   y?: number;
//   // allow extra fields from backend
//   [key: string]: any;
// };

// export type GraphEdge = {
//   from?: string;   // old format
//   to?: string;     // old format
//   source?: string; // new format
//   target?: string; // new format
//   amount?: number;
//   count?: number;
//   // allow extra fields
//   [key: string]: any;
// };

// type Props = {
//   // any of these may come in
//   data?: { nodes?: GraphNode[]; links?: GraphEdge[]; edges?: GraphEdge[] };
//   nodes?: GraphNode[];
//   links?: GraphEdge[];
//   edges?: GraphEdge[];

//   selectedNodeId?: string;
//   onNodeSelect?: (id: string) => void;

//   className?: string;

//   // optional: limit clutter
//   maxNodes?: number;
//   maxEdges?: number;
// };

// export function TransactionGraph({
//   data,
//   nodes: nodesProp,
//   links: linksProp,
//   edges: edgesProp,
//   selectedNodeId,
//   onNodeSelect,
//   className,
//   maxNodes = 200,
//   maxEdges = 600,
// }: Props) {
//   // ✅ make sure we NEVER map over undefined
//   const nodesRaw = nodesProp ?? data?.nodes ?? [];
//   const edgesRaw = linksProp ?? edgesProp ?? data?.links ?? data?.edges ?? [];

//   // ---- Small readability control: cap edges/nodes to reduce mess
//   const { nodes, edges } = useMemo(() => {
//     const safeNodes = Array.isArray(nodesRaw) ? nodesRaw : [];
//     const safeEdges = Array.isArray(edgesRaw) ? edgesRaw : [];

//     // keep only edges that reference existing nodes (after trimming)
//     const trimmedNodes = safeNodes.slice(0, maxNodes);
//     const nodeSet = new Set(trimmedNodes.map((n) => n.id));

//     const normalizedEdges = safeEdges
//       .map((e) => ({
//         from: e.from ?? e.source,
//         to: e.to ?? e.target,
//         amount: Number(e.amount ?? 0),
//         count: Number(e.count ?? 1),
//       }))
//       .filter((e) => e.from && e.to);

//     const trimmedEdges = normalizedEdges
//       .filter((e) => nodeSet.has(e.from!) && nodeSet.has(e.to!))
//       .slice(0, maxEdges);

//     return { nodes: trimmedNodes, edges: trimmedEdges };
//   }, [nodesRaw, edgesRaw, maxNodes, maxEdges]);

//   const getNodeColor = (risk?: string) => {
//     switch (risk) {
//       case "high":
//         return "hsl(0, 75%, 55%)";
//       case "medium":
//         return "hsl(38, 92%, 50%)";
//       case "low":
//         return "hsl(145, 65%, 42%)";
//       default:
//         return "hsl(175, 70%, 45%)";
//     }
//   };

//   // NOTE:
//   // Your older graph used fixed x/y mock positions.
//   // For backend-driven graphs, you need a layout algorithm.
//   // For now, we’ll place nodes in a circle (readable + deterministic).
//   const positionedNodes = useMemo(() => {
//     const W = 900;
//     const H = 520;
//     const cx = W / 2;
//     const cy = H / 2;
//     const r = Math.min(cx, cy) - 60;

//     const n = Math.max(1, nodes.length);
//     return nodes.map((node, i) => {
//       const angle = (2 * Math.PI * i) / n;
//       return {
//         ...node,
//         x: node.x ?? cx + r * Math.cos(angle),
//         y: node.y ?? cy + r * Math.sin(angle),
//         label: node.label ?? node.id,
//         risk: node.risk ?? "low",
//       };
//     });
//   }, [nodes]);

//   const getNodeById = (id: string) =>
//     positionedNodes.find((n) => n.id === id);

//   return (
//     <div className={cn("graph-container h-96 relative", className)}>
//       <div className="absolute top-4 left-4 z-10 flex items-center gap-4 text-xs">
//         <div className="flex items-center gap-2">
//           <span className="w-3 h-3 rounded-full bg-risk-high" />
//           <span className="text-muted-foreground">High</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="w-3 h-3 rounded-full bg-risk-medium" />
//           <span className="text-muted-foreground">Medium</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="w-3 h-3 rounded-full bg-risk-low" />
//           <span className="text-muted-foreground">Low</span>
//         </div>
//       </div>

//       {/* Empty state (prevents black screen + helps debug) */}
//       {positionedNodes.length === 0 ? (
//         <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
//           No graph data yet (nodes=0). Check /graph/subgraph response.
//         </div>
//       ) : (
//         <svg className="w-full h-full" viewBox="0 0 900 520">
//           <defs>
//             <marker
//               id="arrowhead"
//               markerWidth="10"
//               markerHeight="7"
//               refX="9"
//               refY="3.5"
//               orient="auto"
//             >
//               <polygon points="0 0, 10 3.5, 0 7" fill="hsl(220, 15%, 35%)" />
//             </marker>
//           </defs>

//           {/* Edges */}
//           {edges.map((edge, index) => {
//             const fromNode = getNodeById(edge.from!);
//             const toNode = getNodeById(edge.to!);
//             if (!fromNode || !toNode) return null;

//             return (
//               <g key={index}>
//                 <line
//                   x1={fromNode.x}
//                   y1={fromNode.y}
//                   x2={toNode.x}
//                   y2={toNode.y}
//                   stroke="hsl(220, 15%, 25%)"
//                   strokeWidth="1.5"
//                   markerEnd="url(#arrowhead)"
//                   opacity={0.6}
//                 />
//               </g>
//             );
//           })}

//           {/* Nodes */}
//           {positionedNodes.map((node) => {
//             const selected = selectedNodeId && node.id === selectedNodeId;

//             return (
//               <g
//                 key={node.id}
//                 className="cursor-pointer"
//                 onClick={() => onNodeSelect?.(node.id)}
//               >
//                 <circle
//                   cx={node.x}
//                   cy={node.y}
//                   r={selected ? 26 : 22}
//                   fill="hsl(220, 18%, 10%)"
//                   stroke={getNodeColor(node.risk)}
//                   strokeWidth={selected ? 3 : 2}
//                 />
//                 <text
//                   x={node.x}
//                   y={node.y + 4}
//                   fill="hsl(210, 20%, 95%)"
//                   fontSize="10"
//                   textAnchor="middle"
//                   className="font-mono font-medium"
//                 >
//                   {node.label}
//                 </text>
//               </g>
//             );
//           })}
//         </svg>
//       )}

//       <div className="scan-line" />
//     </div>
//   );
// }




///////////////FFFFFF//////////////////////////////////////////////

// import React, { useMemo } from "react";
// import { cn } from "@/lib/utils";

// type Risk = "high" | "medium" | "low";

// export type GraphNode = {
//   id: string;
//   label?: string;
//   risk?: Risk;
//   x?: number;
//   y?: number;
//   // allow extra fields from backend
//   [key: string]: any;
// };

// export type GraphEdge = {
//   from?: string; // old format
//   to?: string; // old format
//   source?: string; // new format
//   target?: string; // new format
//   amount?: number;
//   count?: number;
//   // allow extra fields
//   [key: string]: any;
// };

// type Props = {
//   // any of these may come in
//   data?: { nodes?: GraphNode[]; links?: GraphEdge[]; edges?: GraphEdge[] };
//   nodes?: GraphNode[];
//   links?: GraphEdge[];
//   edges?: GraphEdge[];

//   selectedNodeId?: string;
//   onNodeSelect?: (id: string) => void;

//   className?: string;

//   // optional: limit clutter
//   maxNodes?: number;
//   maxEdges?: number;

//   // readability toggles
//   showEdgeLabels?: boolean;
//   labelMode?: "focused" | "all" | "none"; // focused = selected + neighbors only
// };

// function clamp(n: number, lo: number, hi: number) {
//   return Math.max(lo, Math.min(hi, n));
// }

// function safeNum(x: any, fallback = 0) {
//   const v = Number(x);
//   return Number.isFinite(v) ? v : fallback;
// }

// export function TransactionGraph({
//   data,
//   nodes: nodesProp,
//   links: linksProp,
//   edges: edgesProp,
//   selectedNodeId,
//   onNodeSelect,
//   className,
//   maxNodes = 200,
//   maxEdges = 120,
//   showEdgeLabels = false,
//   labelMode = "focused",
// }: Props) {
//   // ✅ NEVER map over undefined
//   const nodesRaw = nodesProp ?? data?.nodes ?? [];
//   const edgesRaw = linksProp ?? edgesProp ?? data?.links ?? data?.edges ?? [];

//   // ---- Normalize + trim
//   const { nodes, edges } = useMemo(() => {
//     const safeNodes = Array.isArray(nodesRaw) ? nodesRaw : [];
//     const safeEdges = Array.isArray(edgesRaw) ? edgesRaw : [];

//     // Trim nodes first
//     const trimmedNodes = safeNodes.slice(0, maxNodes);
//     const nodeSet = new Set(trimmedNodes.map((n) => n.id));

//     const normalizedEdges = safeEdges
//       .map((e) => ({
//         from: (e.from ?? e.source) as string | undefined,
//         to: (e.to ?? e.target) as string | undefined,
//         amount: safeNum(e.amount, 0),
//         count: safeNum(e.count, 1),
//       }))
//       .filter((e) => !!e.from && !!e.to);

//     // keep only edges inside trimmed nodes, sort by amount desc, cap
//     const trimmedEdges = normalizedEdges
//       .filter((e) => nodeSet.has(e.from!) && nodeSet.has(e.to!))
//       .sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0))
//       .slice(0, maxEdges);

//     return { nodes: trimmedNodes, edges: trimmedEdges };
//   }, [nodesRaw, edgesRaw, maxNodes, maxEdges]);

//   const getNodeColor = (risk?: string) => {
//     switch (risk) {
//       case "high":
//         return "hsl(0, 75%, 55%)";
//       case "medium":
//         return "hsl(38, 92%, 50%)";
//       case "low":
//         return "hsl(145, 65%, 42%)";
//       default:
//         return "hsl(175, 70%, 45%)";
//     }
//   };

//   // Build neighbor set for readability (selected + its neighbors)
//   const neighborSet = useMemo(() => {
//     const s = new Set<string>();
//     if (!selectedNodeId) return s;

//     edges.forEach((e) => {
//       if (e.from === selectedNodeId && e.to) s.add(e.to);
//       if (e.to === selectedNodeId && e.from) s.add(e.from);
//     });

//     return s;
//   }, [edges, selectedNodeId]);

//   // Layout: ego-layout when selectedNodeId exists (center + neighbors ring)
//   const positionedNodes = useMemo(() => {
//     const W = 900;
//     const H = 520;
//     const cx = W / 2;
//     const cy = H / 2;

//     const base = nodes.map((n) => ({
//       ...n,
//       label: n.label ?? n.id,
//       risk: (n.risk ?? "low") as Risk,
//     }));

//     // no selection -> circle layout
//     if (!selectedNodeId || base.length === 0) {
//       const r = Math.min(cx, cy) - 70;
//       const n = Math.max(1, base.length);
//       return base.map((node, i) => {
//         const a = (2 * Math.PI * i) / n;
//         return {
//           ...node,
//           x: node.x ?? cx + r * Math.cos(a),
//           y: node.y ?? cy + r * Math.sin(a),
//         };
//       });
//     }

//     const center = base.find((n) => n.id === selectedNodeId);
//     if (center) {
//       center.x = cx;
//       center.y = cy;
//     }

//     const ring = base.filter((n) => n.id !== selectedNodeId && neighborSet.has(n.id));
//     const rest = base.filter((n) => n.id !== selectedNodeId && !neighborSet.has(n.id));

//     const r1 = 180;
//     ring.forEach((n, i) => {
//       const a = (2 * Math.PI * i) / Math.max(1, ring.length);
//       n.x = cx + r1 * Math.cos(a);
//       n.y = cy + r1 * Math.sin(a);
//     });

//     const r2 = 290;
//     rest.forEach((n, i) => {
//       const a = (2 * Math.PI * i) / Math.max(1, rest.length);
//       n.x = cx + r2 * Math.cos(a);
//       n.y = cy + r2 * Math.sin(a);
//     });

//     return base;
//   }, [nodes, selectedNodeId, neighborSet]);

//   const getNodeById = (id: string) => positionedNodes.find((n) => n.id === id);

//   const viewBoxW = 900;
//   const viewBoxH = 520;

//   // Node radius: slightly responsive to degree if available
//   const nodeRadius = (n: GraphNode, selected: boolean) => {
//     const deg = safeNum(n.total_degree ?? n.degree ?? n.value ?? 0, 0);
//     const base = clamp(18 + Math.log10(deg + 1) * 4, 18, 30);
//     return selected ? base + 4 : base;
//   };

//   const shouldShowLabel = (nodeId: string) => {
//     if (labelMode === "none") return false;
//     if (labelMode === "all") return true;
//     // focused:
//     if (!selectedNodeId) return true;
//     return nodeId === selectedNodeId || neighborSet.has(nodeId);
//   };

//   return (
//     <div className={cn("graph-container h-96 relative", className)}>
//       {/* Legend */}
//       <div className="absolute top-4 left-4 z-10 flex items-center gap-4 text-xs">
//         <div className="flex items-center gap-2">
//           <span className="w-3 h-3 rounded-full bg-risk-high" />
//           <span className="text-muted-foreground">High</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="w-3 h-3 rounded-full bg-risk-medium" />
//           <span className="text-muted-foreground">Medium</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="w-3 h-3 rounded-full bg-risk-low" />
//           <span className="text-muted-foreground">Low</span>
//         </div>
//       </div>

//       {/* Empty state (prevents black screen + helps debug) */}
//       {positionedNodes.length === 0 ? (
//         <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
//           No graph data (nodes=0). Check /graph/subgraph response and GraphView props.
//         </div>
//       ) : (
//         <svg className="w-full h-full" viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}>
//           <defs>
//             <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
//               <polygon points="0 0, 10 3.5, 0 7" fill="hsl(220, 15%, 35%)" />
//             </marker>
//           </defs>

//           {/* Edges */}
//           {edges.map((edge, index) => {
//             const fromNode = edge.from ? getNodeById(edge.from) : undefined;
//             const toNode = edge.to ? getNodeById(edge.to) : undefined;
//             if (!fromNode || !toNode) return null;

//             const focused =
//               !!selectedNodeId && (edge.from === selectedNodeId || edge.to === selectedNodeId);

//             const opacity = focused ? 0.9 : selectedNodeId ? 0.12 : 0.55;
//             const strokeW = focused ? 2.4 : 1.1;

//             // label position
//             const mx = (fromNode.x! + toNode.x!) / 2;
//             const my = (fromNode.y! + toNode.y!) / 2;

//             return (
//               <g key={index}>
//                 <line
//                   x1={fromNode.x}
//                   y1={fromNode.y}
//                   x2={toNode.x}
//                   y2={toNode.y}
//                   stroke="hsl(220, 15%, 25%)"
//                   strokeWidth={strokeW}
//                   markerEnd="url(#arrowhead)"
//                   opacity={opacity}
//                 />
//                 {showEdgeLabels && focused && (
//                   <text
//                     x={mx}
//                     y={my - 6}
//                     fill="hsl(215, 15%, 70%)"
//                     fontSize="10"
//                     textAnchor="middle"
//                     className="font-mono"
//                   >
//                     ₹{Math.round(edge.amount ?? 0).toLocaleString()}
//                   </text>
//                 )}
//               </g>
//             );
//           })}

//           {/* Nodes */}
//           {positionedNodes.map((node) => {
//             const selected = !!selectedNodeId && node.id === selectedNodeId;
//             const neighbor = !!selectedNodeId && neighborSet.has(node.id);
//             const dim = !!selectedNodeId && !selected && !neighbor;

//             const r = nodeRadius(node, selected);
//             const stroke = getNodeColor(node.risk);
//             const fillCore = "hsl(220, 18%, 10%)";

//             return (
//               <g
//                 key={node.id}
//                 className="cursor-pointer"
//                 onClick={() => onNodeSelect?.(node.id)}
//                 opacity={dim ? 0.35 : 1}
//               >
//                 <circle
//                   cx={node.x}
//                   cy={node.y}
//                   r={r}
//                   fill={fillCore}
//                   stroke={stroke}
//                   strokeWidth={selected ? 3 : 2}
//                 />
//                 <circle
//                   cx={node.x}
//                   cy={node.y}
//                   r={Math.max(0, r - 4)}
//                   fill={stroke}
//                   opacity={0.12}
//                 />

//                 {shouldShowLabel(node.id) && (
//                   <text
//                     x={node.x}
//                     y={node.y + 4}
//                     fill="hsl(210, 20%, 95%)"
//                     fontSize={selected ? 11 : 10}
//                     textAnchor="middle"
//                     className="font-mono font-medium"
//                   >
//                     {node.label}
//                   </text>
//                 )}
//               </g>
//             );
//           })}
//         </svg>
//       )}

//       <div className="scan-line" />
//     </div>
//   );
// }



// import React, {
//   forwardRef,
//   useImperativeHandle,
//   useMemo,
//   useState,
// } from "react";
// import { cn } from "@/lib/utils";

// type Risk = "high" | "medium" | "low";

// export type GraphNode = {
//   id: string;
//   label?: string;
//   risk?: Risk;
//   x?: number;
//   y?: number;
//   [key: string]: any;
// };

// export type GraphEdge = {
//   from?: string;
//   to?: string;
//   source?: string;
//   target?: string;
//   amount?: number;
//   count?: number;
//   [key: string]: any;
// };

// export type TransactionGraphHandle = {
//   zoomIn: () => void;
//   zoomOut: () => void;
//   reset: () => void;
// };

// type Props = {
//   data?: { nodes?: GraphNode[]; links?: GraphEdge[]; edges?: GraphEdge[] };
//   nodes?: GraphNode[];
//   links?: GraphEdge[];
//   edges?: GraphEdge[];

//   selectedNodeId?: string;
//   onNodeSelect?: (id: string) => void;

//   className?: string;

//   maxNodes?: number;
//   maxEdges?: number;

//   // ✅ toggles passed from GraphView
//   showEdgeLabels?: boolean;   // show ₹amount labels (focused edges only)
//   focusMode?: boolean;        // dim non-neighbors
//   labelMode?: "focused" | "all" | "none";
// };

// function clamp(n: number, lo: number, hi: number) {
//   return Math.max(lo, Math.min(hi, n));
// }

// function safeNum(x: any, fallback = 0) {
//   const v = Number(x);
//   return Number.isFinite(v) ? v : fallback;
// }

// export const TransactionGraph = forwardRef<TransactionGraphHandle, Props>(
//   function TransactionGraph(
//     {
//       data,
//       nodes: nodesProp,
//       links: linksProp,
//       edges: edgesProp,
//       selectedNodeId,
//       onNodeSelect,
//       className,
//       maxNodes = 200,
//       maxEdges = 140,
//       showEdgeLabels = false,
//       focusMode = true,
//       labelMode = "focused",
//     },
//     ref
//   ) {
//     // ---------- Zoom state ----------
//     const [scale, setScale] = useState(1);
//     const [tx, setTx] = useState(0);
//     const [ty, setTy] = useState(0);

//     const zoomIn = () => setScale((s) => clamp(s * 1.15, 0.4, 5));
//     const zoomOut = () => setScale((s) => clamp(s / 1.15, 0.4, 5));
//     const reset = () => {
//       setScale(1);
//       setTx(0);
//       setTy(0);
//     };

//     useImperativeHandle(ref, () => ({ zoomIn, zoomOut, reset }), []);

//     // ---------- Data safety ----------
//     const nodesRaw = nodesProp ?? data?.nodes ?? [];
//     const edgesRaw = linksProp ?? edgesProp ?? data?.links ?? data?.edges ?? [];

//     const { nodes, edges } = useMemo(() => {
//       const safeNodes = Array.isArray(nodesRaw) ? nodesRaw : [];
//       const safeEdges = Array.isArray(edgesRaw) ? edgesRaw : [];

//       const trimmedNodes = safeNodes.slice(0, maxNodes);
//       const nodeSet = new Set(trimmedNodes.map((n) => n.id));

//       const normalizedEdges = safeEdges
//         .map((e) => ({
//           from: (e.from ?? e.source) as string | undefined,
//           to: (e.to ?? e.target) as string | undefined,
//           amount: safeNum(e.amount, 0),
//           count: safeNum(e.count, 1),
//         }))
//         .filter((e) => !!e.from && !!e.to);

//       const trimmedEdges = normalizedEdges
//         .filter((e) => nodeSet.has(e.from!) && nodeSet.has(e.to!))
//         .sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0))
//         .slice(0, maxEdges);

//       return { nodes: trimmedNodes, edges: trimmedEdges };
//     }, [nodesRaw, edgesRaw, maxNodes, maxEdges]);

//     // ---------- Helpers ----------
//     const getNodeColor = (risk?: string) => {
//       switch (risk) {
//         case "high":
//           return "hsl(0, 75%, 55%)";
//         case "medium":
//           return "hsl(38, 92%, 50%)";
//         case "low":
//           return "hsl(145, 65%, 42%)";
//         default:
//           return "hsl(175, 70%, 45%)";
//       }
//     };

//     const neighborSet = useMemo(() => {
//       const s = new Set<string>();
//       if (!selectedNodeId) return s;
//       edges.forEach((e) => {
//         if (e.from === selectedNodeId && e.to) s.add(e.to);
//         if (e.to === selectedNodeId && e.from) s.add(e.from);
//       });
//       return s;
//     }, [edges, selectedNodeId]);

//     const positionedNodes = useMemo(() => {
//       const W = 900;
//       const H = 520;
//       const cx = W / 2;
//       const cy = H / 2;

//       const base = nodes.map((n) => ({
//         ...n,
//         label: n.label ?? n.id,
//         risk: (n.risk ?? "low") as Risk,
//       }));

//       if (!selectedNodeId || base.length === 0) {
//         const r = Math.min(cx, cy) - 70;
//         const n = Math.max(1, base.length);
//         return base.map((node, i) => {
//           const a = (2 * Math.PI * i) / n;
//           return {
//             ...node,
//             x: node.x ?? cx + r * Math.cos(a),
//             y: node.y ?? cy + r * Math.sin(a),
//           };
//         });
//       }

//       const center = base.find((n) => n.id === selectedNodeId);
//       if (center) {
//         center.x = cx;
//         center.y = cy;
//       }

//       const ring = base.filter((n) => n.id !== selectedNodeId && neighborSet.has(n.id));
//       const rest = base.filter((n) => n.id !== selectedNodeId && !neighborSet.has(n.id));

//       const r1 = 180;
//       ring.forEach((n, i) => {
//         const a = (2 * Math.PI * i) / Math.max(1, ring.length);
//         n.x = cx + r1 * Math.cos(a);
//         n.y = cy + r1 * Math.sin(a);
//       });

//       const r2 = 290;
//       rest.forEach((n, i) => {
//         const a = (2 * Math.PI * i) / Math.max(1, rest.length);
//         n.x = cx + r2 * Math.cos(a);
//         n.y = cy + r2 * Math.sin(a);
//       });

//       return base;
//     }, [nodes, selectedNodeId, neighborSet]);

//     const getNodeById = (id: string) => positionedNodes.find((n) => n.id === id);

//     const shouldShowLabel = (nodeId: string) => {
//       if (labelMode === "none") return false;
//       if (labelMode === "all") return true;
//       if (!selectedNodeId) return true;
//       return nodeId === selectedNodeId || neighborSet.has(nodeId);
//     };

//     const nodeRadius = (n: GraphNode, selected: boolean) => {
//       const deg = safeNum(n.total_degree ?? n.degree ?? n.value ?? 0, 0);
//       const base = clamp(18 + Math.log10(deg + 1) * 4, 18, 30);
//       return selected ? base + 4 : base;
//     };

//     // ---------- Render ----------
//     return (
//       <div className={cn("graph-container h-96 relative", className)}>
//         {positionedNodes.length === 0 ? (
//           <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
//             No graph data (nodes=0). Check /graph/subgraph response and props.
//           </div>
//         ) : (
//           <svg
//             className="w-full h-full"
//             viewBox="0 0 900 520"
//             onWheel={(e) => {
//               // optional: wheel zoom
//               e.preventDefault();
//               const delta = e.deltaY;
//               if (delta > 0) setScale((s) => clamp(s / 1.1, 0.4, 5));
//               else setScale((s) => clamp(s * 1.1, 0.4, 5));
//             }}
//           >
//             <defs>
//               <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
//                 <polygon points="0 0, 10 3.5, 0 7" fill="hsl(220, 15%, 35%)" />
//               </marker>
//             </defs>

//             {/* ✅ all zoom happens here */}
//             <g transform={`translate(${tx} ${ty}) scale(${scale})`}>
//               {/* Edges */}
//               {edges.map((edge, index) => {
//                 const fromNode = edge.from ? getNodeById(edge.from) : undefined;
//                 const toNode = edge.to ? getNodeById(edge.to) : undefined;
//                 if (!fromNode || !toNode) return null;

//                 const focused =
//                   !!selectedNodeId && (edge.from === selectedNodeId || edge.to === selectedNodeId);

//                 const opacity = focusMode
//                   ? focused
//                     ? 0.9
//                     : selectedNodeId
//                     ? 0.12
//                     : 0.55
//                   : 0.55;

//                 const strokeW = focused ? 2.4 : 1.1;

//                 const mx = (fromNode.x! + toNode.x!) / 2;
//                 const my = (fromNode.y! + toNode.y!) / 2;

//                 return (
//                   <g key={index}>
//                     <line
//                       x1={fromNode.x}
//                       y1={fromNode.y}
//                       x2={toNode.x}
//                       y2={toNode.y}
//                       stroke="hsl(220, 15%, 25%)"
//                       strokeWidth={strokeW}
//                       markerEnd="url(#arrowhead)"
//                       opacity={opacity}
//                     />
//                     {showEdgeLabels && focused && (
//                       <text
//                         x={mx}
//                         y={my - 6}
//                         fill="hsl(215, 15%, 70%)"
//                         fontSize="10"
//                         textAnchor="middle"
//                         className="font-mono"
//                       >
//                         ₹{Math.round(edge.amount ?? 0).toLocaleString()}
//                       </text>
//                     )}
//                   </g>
//                 );
//               })}

//               {/* Nodes */}
//               {positionedNodes.map((node) => {
//                 const selected = !!selectedNodeId && node.id === selectedNodeId;
//                 const neighbor = !!selectedNodeId && neighborSet.has(node.id);
//                 const dim = focusMode && !!selectedNodeId && !selected && !neighbor;

//                 const r = nodeRadius(node, selected);
//                 const stroke = getNodeColor(node.risk);

//                 return (
//                   <g
//                     key={node.id}
//                     className="cursor-pointer"
//                     onClick={() => onNodeSelect?.(node.id)}
//                     opacity={dim ? 0.35 : 1}
//                   >
//                     <circle
//                       cx={node.x}
//                       cy={node.y}
//                       r={r}
//                       fill="hsl(220, 18%, 10%)"
//                       stroke={stroke}
//                       strokeWidth={selected ? 3 : 2}
//                     />
//                     <circle cx={node.x} cy={node.y} r={Math.max(0, r - 4)} fill={stroke} opacity={0.12} />

//                     {shouldShowLabel(node.id) && (
//                       <text
//                         x={node.x}
//                         y={node.y + 4}
//                         fill="hsl(210, 20%, 95%)"
//                         fontSize={selected ? 11 : 10}
//                         textAnchor="middle"
//                         className="font-mono font-medium"
//                       >
//                         {node.label}
//                       </text>
//                     )}
//                   </g>
//                 );
//               })}
//             </g>
//           </svg>
//         )}

//         <div className="scan-line" />
//       </div>
//     );
//   }
// );




///////////////////2 toggles///////////////////////


// import React, {
//   forwardRef,
//   useImperativeHandle,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { cn } from "@/lib/utils";

// type Risk = "high" | "medium" | "low";

// export type GraphNode = {
//   id: string;
//   label?: string;
//   risk?: Risk;
//   x?: number;
//   y?: number;
//   [key: string]: any;
// };

// export type GraphEdge = {
//   from?: string;
//   to?: string;
//   source?: string;
//   target?: string;
//   amount?: number;
//   count?: number;
//   [key: string]: any;
// };

// export type TransactionGraphHandle = {
//   zoomIn: () => void;
//   zoomOut: () => void;
//   reset: () => void;
// };

// type Props = {
//   data?: { nodes?: GraphNode[]; links?: GraphEdge[]; edges?: GraphEdge[] };
//   nodes?: GraphNode[];
//   links?: GraphEdge[];
//   edges?: GraphEdge[];

//   selectedNodeId?: string;
//   onNodeSelect?: (id: string) => void;

//   className?: string;

//   maxNodes?: number;
//   maxEdges?: number;

//   // ✅ new
//   showEdgeLabels?: boolean;
//   focusMode?: boolean;

//   // "all" | "focused" | "none"
//   labelMode?: "all" | "focused" | "none";
// };

// export const TransactionGraph = forwardRef<TransactionGraphHandle, Props>(
//   function TransactionGraph(
//     {
//       data,
//       nodes: nodesProp,
//       links: linksProp,
//       edges: edgesProp,
//       selectedNodeId,
//       onNodeSelect,
//       className,
//       maxNodes = 200,
//       maxEdges = 600,
//       showEdgeLabels = false,
//       focusMode = true,
//       labelMode = "focused",
//     },
//     ref
//   ) {
//     // ✅ NEVER map undefined
//     const nodesRaw = nodesProp ?? data?.nodes ?? [];
//     const edgesRaw = linksProp ?? edgesProp ?? data?.links ?? data?.edges ?? [];

//     // zoom/pan state (simple, no library)
//     const [scale, setScale] = useState(1);
//     const [tx, setTx] = useState(0);
//     const [ty, setTy] = useState(0);

//     useImperativeHandle(ref, () => ({
//       zoomIn: () => setScale((s) => Math.min(3, +(s + 0.15).toFixed(2))),
//       zoomOut: () => setScale((s) => Math.max(0.4, +(s - 0.15).toFixed(2))),
//       reset: () => {
//         setScale(1);
//         setTx(0);
//         setTy(0);
//       },
//     }));

//     const { nodes, edges } = useMemo(() => {
//       const safeNodes = Array.isArray(nodesRaw) ? nodesRaw : [];
//       const safeEdges = Array.isArray(edgesRaw) ? edgesRaw : [];

//       const trimmedNodes = safeNodes.slice(0, maxNodes);
//       const nodeSet = new Set(trimmedNodes.map((n) => n.id));

//       const normalizedEdges = safeEdges
//         .map((e) => ({
//           from: e.from ?? e.source,
//           to: e.to ?? e.target,
//           amount: Number(e.amount ?? 0),
//           count: Number(e.count ?? 1),
//         }))
//         .filter((e) => e.from && e.to);

//       const trimmedEdges = normalizedEdges
//         .filter((e) => nodeSet.has(e.from!) && nodeSet.has(e.to!))
//         .slice(0, maxEdges);

//       return { nodes: trimmedNodes, edges: trimmedEdges };
//     }, [nodesRaw, edgesRaw, maxNodes, maxEdges]);

//     const getNodeColor = (risk?: string) => {
//       switch (risk) {
//         case "high":
//           return "hsl(0, 75%, 55%)";
//         case "medium":
//           return "hsl(38, 92%, 50%)";
//         case "low":
//           return "hsl(145, 65%, 42%)";
//         default:
//           return "hsl(175, 70%, 45%)";
//       }
//     };

//     // circle layout (deterministic + readable)
//     const positionedNodes = useMemo(() => {
//       const W = 900;
//       const H = 520;
//       const cx = W / 2;
//       const cy = H / 2;
//       const r = Math.min(cx, cy) - 70;

//       const n = Math.max(1, nodes.length);
//       return nodes.map((node, i) => {
//         const angle = (2 * Math.PI * i) / n;
//         return {
//           ...node,
//           x: node.x ?? cx + r * Math.cos(angle),
//           y: node.y ?? cy + r * Math.sin(angle),
//           label: node.label ?? node.id,
//           risk: node.risk ?? "low",
//         };
//       });
//     }, [nodes]);

//     const nodeById = useMemo(() => {
//       const m = new Map<string, any>();
//       for (const n of positionedNodes) m.set(n.id, n);
//       return m;
//     }, [positionedNodes]);

//     const neighborSet = useMemo(() => {
//       if (!selectedNodeId) return new Set<string>();
//       const s = new Set<string>([selectedNodeId]);

//       for (const e of edges) {
//         const a = e.from!;
//         const b = e.to!;
//         if (a === selectedNodeId) s.add(b);
//         if (b === selectedNodeId) s.add(a);
//       }
//       return s;
//     }, [edges, selectedNodeId]);

//     const shouldDimNode = (id: string) => {
//       if (!focusMode || !selectedNodeId) return false;
//       return !neighborSet.has(id);
//     };

//     const shouldDimEdge = (from: string, to: string) => {
//       if (!focusMode || !selectedNodeId) return false;
//       // keep only edges connected to neighborhood
//       return !(neighborSet.has(from) && neighborSet.has(to));
//     };

//     const showLabelForEdge = (from: string, to: string) => {
//       if (!showEdgeLabels) return false;
//       if (labelMode === "none") return false;
//       if (labelMode === "all") return true;

//       // focused: only show near selected node
//       if (!selectedNodeId) return false;
//       return from === selectedNodeId || to === selectedNodeId;
//     };

//     // empty state
//     if (positionedNodes.length === 0) {
//       return (
//         <div className={cn("graph-container h-96 relative", className)}>
//           <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
//             No graph data (nodes=0). Check /graph/subgraph response and GraphView props.
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className={cn("graph-container h-96 relative", className)}>
//         <svg className="w-full h-full" viewBox="0 0 900 520">
//           <defs>
//             <marker
//               id="arrowhead"
//               markerWidth="10"
//               markerHeight="7"
//               refX="9"
//               refY="3.5"
//               orient="auto"
//             >
//               <polygon points="0 0, 10 3.5, 0 7" fill="hsl(220, 15%, 35%)" />
//             </marker>
//           </defs>

//           <g transform={`translate(${tx},${ty}) scale(${scale})`}>
//             {/* Edges */}
//             {edges.map((edge, index) => {
//               const from = edge.from!;
//               const to = edge.to!;
//               const fromNode = nodeById.get(from);
//               const toNode = nodeById.get(to);
//               if (!fromNode || !toNode) return null;

//               const dim = shouldDimEdge(from, to);
//               const opacity = dim ? 0.10 : 0.65;

//               return (
//                 <g key={index}>
//                   <line
//                     x1={fromNode.x}
//                     y1={fromNode.y}
//                     x2={toNode.x}
//                     y2={toNode.y}
//                     stroke="hsl(220, 15%, 25%)"
//                     strokeWidth={dim ? 1 : 1.8}
//                     markerEnd="url(#arrowhead)"
//                     opacity={opacity}
//                   />

//                   {showLabelForEdge(from, to) && (
//                     <text
//                       x={(fromNode.x + toNode.x) / 2}
//                       y={(fromNode.y + toNode.y) / 2 - 8}
//                       fill="hsl(215, 15%, 70%)"
//                       fontSize="10"
//                       textAnchor="middle"
//                       className="font-mono"
//                       opacity={dim ? 0 : 0.95}
//                     >
//                       ₹{Math.round(edge.amount ?? 0).toLocaleString()}
//                     </text>
//                   )}
//                 </g>
//               );
//             })}

//             {/* Nodes */}
//             {positionedNodes.map((node) => {
//               const selected = selectedNodeId && node.id === selectedNodeId;
//               const dim = shouldDimNode(node.id);
//               const opacity = dim ? 0.25 : 1;

//               return (
//                 <g
//                   key={node.id}
//                   className="cursor-pointer"
//                   opacity={opacity}
//                   onClick={() => onNodeSelect?.(node.id)}
//                 >
//                   <circle
//                     cx={node.x}
//                     cy={node.y}
//                     r={selected ? 26 : 22}
//                     fill="hsl(220, 18%, 10%)"
//                     stroke={getNodeColor(node.risk)}
//                     strokeWidth={selected ? 3 : 2}
//                   />
//                   <text
//                     x={node.x}
//                     y={node.y + 4}
//                     fill="hsl(210, 20%, 95%)"
//                     fontSize="10"
//                     textAnchor="middle"
//                     className="font-mono font-medium"
//                   >
//                     {node.label}
//                   </text>
//                 </g>
//               );
//             })}
//           </g>
//         </svg>

//         <div className="scan-line" />
//       </div>
//     );
//   }
// );




// import React, {
//   forwardRef,
//   useImperativeHandle,
//   useMemo,
//   useState,
// } from "react";
// import { cn } from "@/lib/utils";

// type Risk = "high" | "medium" | "low";

// export type GraphNode = {
//   id: string;
//   label?: string;
//   risk?: Risk;
//   x?: number;
//   y?: number;
//   [key: string]: any;
// };

// export type GraphEdge = {
//   from?: string;   // old format
//   to?: string;     // old format
//   source?: string; // new format
//   target?: string; // new format
//   amount?: number;
//   count?: number;
//   [key: string]: any;
// };

// export type TransactionGraphHandle = {
//   zoomIn: () => void;
//   zoomOut: () => void;
//   reset: () => void;
// };

// type Props = {
//   data?: { nodes?: GraphNode[]; links?: GraphEdge[]; edges?: GraphEdge[] };
//   nodes?: GraphNode[];
//   links?: GraphEdge[];
//   edges?: GraphEdge[];

//   selectedNodeId?: string;
//   onNodeSelect?: (id: string) => void;

//   className?: string;
//   maxNodes?: number;
//   maxEdges?: number;

//   // UI controls from GraphView
//   focusMode?: boolean;
//   centerSelected?: boolean;

//   showAmounts?: boolean;
//   amountMode?: "hover" | "focused" | "topk";
//   topK?: number;
// };

// function getNodeColor(risk?: string) {
//   switch (risk) {
//     case "high":
//       return "hsl(0, 75%, 55%)";
//     case "medium":
//       return "hsl(38, 92%, 50%)";
//     case "low":
//       return "hsl(145, 65%, 42%)";
//     default:
//       return "hsl(175, 70%, 45%)";
//   }
// }

// // centered layout: selected in center, neighbors on inner ring, rest on outer ring
// function layoutCentered(
//   nodes: GraphNode[],
//   edges: { from: string; to: string }[],
//   centerId: string,
//   W = 900,
//   H = 520
// ) {
//   const cx = W / 2;
//   const cy = H / 2;

//   const adj = new Map<string, Set<string>>();
//   for (const n of nodes) adj.set(n.id, new Set());
//   for (const e of edges) {
//     adj.get(e.from)?.add(e.to);
//     adj.get(e.to)?.add(e.from);
//   }

//   const neighbors = Array.from(adj.get(centerId) ?? []);
//   const pos = new Map<string, { x: number; y: number }>();
//   pos.set(centerId, { x: cx, y: cy });

//   const r1 = 175;
//   neighbors.forEach((id, i) => {
//     const angle = (2 * Math.PI * i) / Math.max(1, neighbors.length);
//     pos.set(id, { x: cx + r1 * Math.cos(angle), y: cy + r1 * Math.sin(angle) });
//   });

//   const rest = nodes.map(n => n.id).filter(id => !pos.has(id));
//   const r2 = 270;
//   rest.forEach((id, i) => {
//     const angle = (2 * Math.PI * i) / Math.max(1, rest.length);
//     pos.set(id, { x: cx + r2 * Math.cos(angle), y: cy + r2 * Math.sin(angle) });
//   });

//   return nodes.map(n => ({
//     ...n,
//     x: n.x ?? pos.get(n.id)?.x,
//     y: n.y ?? pos.get(n.id)?.y,
//   }));
// }

// export const TransactionGraph = forwardRef<TransactionGraphHandle, Props>(
//   function TransactionGraph(
//     {
//       data,
//       nodes: nodesProp,
//       links: linksProp,
//       edges: edgesProp,
//       selectedNodeId,
//       onNodeSelect,
//       className,
//       maxNodes = 200,
//       maxEdges = 600,
//       focusMode = true,
//       centerSelected = false,
//       showAmounts = false,
//       amountMode = "hover",
//       topK = 15,
//     },
//     ref
//   ) {
//     // ✅ never undefined
//     const nodesRaw = nodesProp ?? data?.nodes ?? [];
//     const edgesRaw = linksProp ?? edgesProp ?? data?.links ?? data?.edges ?? [];

//     // zoom/pan
//     const [scale, setScale] = useState(1);
//     const [tx, setTx] = useState(0);
//     const [ty, setTy] = useState(0);

//     // hovered edge for amountMode="hover"
//     const [hoverEdgeKey, setHoverEdgeKey] = useState<string | null>(null);

//     useImperativeHandle(ref, () => ({
//       zoomIn: () => setScale((s) => Math.min(3, +(s + 0.15).toFixed(2))),
//       zoomOut: () => setScale((s) => Math.max(0.4, +(s - 0.15).toFixed(2))),
//       reset: () => {
//         setScale(1);
//         setTx(0);
//         setTy(0);
//       },
//     }));

//     const { nodes, edges } = useMemo(() => {
//       const safeNodes = Array.isArray(nodesRaw) ? nodesRaw : [];
//       const safeEdges = Array.isArray(edgesRaw) ? edgesRaw : [];

//       const trimmedNodes = safeNodes.slice(0, maxNodes);
//       const nodeSet = new Set(trimmedNodes.map((n) => n.id));

//       const normalizedEdges = safeEdges
//         .map((e) => ({
//           from: String(e.from ?? e.source ?? ""),
//           to: String(e.to ?? e.target ?? ""),
//           amount: Number(e.amount ?? 0),
//           count: Number(e.count ?? 1),
//         }))
//         .filter((e) => e.from && e.to);

//       const trimmedEdges = normalizedEdges
//         .filter((e) => nodeSet.has(e.from) && nodeSet.has(e.to))
//         .slice(0, maxEdges);

//       return { nodes: trimmedNodes, edges: trimmedEdges };
//     }, [nodesRaw, edgesRaw, maxNodes, maxEdges]);

//     // empty state
//     if (!nodes.length) {
//       return (
//         <div className={cn("graph-container h-96 relative", className)}>
//           <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
//             No graph data (nodes=0). Check /graph/subgraph response and GraphView props.
//           </div>
//         </div>
//       );
//     }

//     // base circle layout (deterministic)
//     const basePositionedNodes = useMemo(() => {
//       const W = 900;
//       const H = 520;
//       const cx = W / 2;
//       const cy = H / 2;
//       const r = Math.min(cx, cy) - 70;

//       const n = Math.max(1, nodes.length);
//       return nodes.map((node, i) => {
//         const angle = (2 * Math.PI * i) / n;
//         return {
//           ...node,
//           x: node.x ?? cx + r * Math.cos(angle),
//           y: node.y ?? cy + r * Math.sin(angle),
//           label: node.label ?? node.id,
//           risk: node.risk ?? "low",
//         };
//       });
//     }, [nodes]);

//     // apply centered layout if enabled
//     const positionedNodes = useMemo(() => {
//       if (centerSelected && selectedNodeId) {
//         const centered = layoutCentered(
//           basePositionedNodes,
//           edges.map((e) => ({ from: e.from, to: e.to })),
//           selectedNodeId
//         );
//         return centered.map(n => ({
//           ...n,
//           label: n.label ?? n.id,
//           risk: n.risk ?? "low",
//         }));
//       }
//       return basePositionedNodes;
//     }, [basePositionedNodes, edges, centerSelected, selectedNodeId]);

//     const nodeById = useMemo(() => {
//       const m = new Map<string, any>();
//       for (const n of positionedNodes) m.set(n.id, n);
//       return m;
//     }, [positionedNodes]);

//     // neighbors for focus mode
//     const neighborSet = useMemo(() => {
//       if (!selectedNodeId) return new Set<string>();
//       const s = new Set<string>([selectedNodeId]);
//       for (const e of edges) {
//         if (e.from === selectedNodeId) s.add(e.to);
//         if (e.to === selectedNodeId) s.add(e.from);
//       }
//       return s;
//     }, [edges, selectedNodeId]);

//     const shouldDimNode = (id: string) => {
//       if (!focusMode || !selectedNodeId) return false;
//       return !neighborSet.has(id);
//     };

//     const shouldDimEdge = (from: string, to: string) => {
//       if (!focusMode || !selectedNodeId) return false;
//       return !(neighborSet.has(from) && neighborSet.has(to));
//     };

//     // choose edges for amount labels
//     const topKEdgeSet = useMemo(() => {
//       if (!showAmounts || amountMode !== "topk") return new Set<string>();
//       const sorted = [...edges].sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0)).slice(0, topK);
//       return new Set(sorted.map(e => `${e.from}-->${e.to}`));
//     }, [edges, showAmounts, amountMode, topK]);

//     const shouldShowAmountLabel = (from: string, to: string) => {
//       if (!showAmounts) return false;
//       if (amountMode === "focused") {
//         if (!selectedNodeId) return false;
//         return from === selectedNodeId || to === selectedNodeId;
//       }
//       if (amountMode === "topk") {
//         return topKEdgeSet.has(`${from}-->${to}`);
//       }
//       // hover
//       return hoverEdgeKey === `${from}-->${to}`;
//     };

//     return (
//       <div className={cn("graph-container h-96 relative", className)}>
//         <svg className="w-full h-full" viewBox="0 0 900 520">
//           <defs>
//             <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
//               <polygon points="0 0, 10 3.5, 0 7" fill="hsl(220, 15%, 35%)" />
//             </marker>
//           </defs>

//           <g transform={`translate(${tx},${ty}) scale(${scale})`}>
//             {/* Edges */}
//             {edges.map((edge, index) => {
//               const from = edge.from;
//               const to = edge.to;
//               const fromNode = nodeById.get(from);
//               const toNode = nodeById.get(to);
//               if (!fromNode || !toNode) return null;

//               const dim = shouldDimEdge(from, to);
//               const opacity = dim ? 0.10 : 0.65;

//               const mx = (fromNode.x + toNode.x) / 2;
//               const my = (fromNode.y + toNode.y) / 2;

//               const showLabel = shouldShowAmountLabel(from, to);

//               return (
//                 <g key={index}>
//                   <line
//                     x1={fromNode.x}
//                     y1={fromNode.y}
//                     x2={toNode.x}
//                     y2={toNode.y}
//                     stroke="hsl(220, 15%, 25%)"
//                     strokeWidth={dim ? 1 : 1.8}
//                     markerEnd="url(#arrowhead)"
//                     opacity={opacity}
//                     onMouseEnter={() => setHoverEdgeKey(`${from}-->${to}`)}
//                     onMouseLeave={() => setHoverEdgeKey(null)}
//                   />

//                   {showLabel && !dim && (
//                     <g pointerEvents="none">
//                       <rect
//                         x={mx - 34}
//                         y={my - 22}
//                         width={68}
//                         height={16}
//                         rx={4}
//                         fill="rgba(0,0,0,0.65)"
//                       />
//                       <text
//                         x={mx}
//                         y={my - 10}
//                         fill="white"
//                         fontSize="10"
//                         textAnchor="middle"
//                         className="font-mono"
//                       >
//                         ₹{Math.round(edge.amount ?? 0).toLocaleString()}
//                       </text>
//                     </g>
//                   )}
//                 </g>
//               );
//             })}

//             {/* Nodes */}
//             {positionedNodes.map((node) => {
//               const selected = selectedNodeId && node.id === selectedNodeId;
//               const dim = shouldDimNode(node.id);
//               const opacity = dim ? 0.25 : 1;

//               return (
//                 <g
//                   key={node.id}
//                   className="cursor-pointer"
//                   opacity={opacity}
//                   onClick={() => onNodeSelect?.(node.id)}
//                 >
//                   <circle
//                     cx={node.x}
//                     cy={node.y}
//                     r={selected ? 26 : 22}
//                     fill="hsl(220, 18%, 10%)"
//                     stroke={getNodeColor(node.risk)}
//                     strokeWidth={selected ? 3 : 2}
//                   />
//                   <text
//                     x={node.x}
//                     y={node.y + 4}
//                     fill="hsl(210, 20%, 95%)"
//                     fontSize="10"
//                     textAnchor="middle"
//                     className="font-mono font-medium"
//                   >
//                     {node.label ?? node.id}
//                   </text>
//                 </g>
//               );
//             })}
//           </g>
//         </svg>

//         <div className="scan-line" />
//       </div>
//     );
//   }
// );


import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type Risk = "high" | "medium" | "low";

export type GraphNode = {
  id: string;
  label?: string;
  risk?: Risk;
  x?: number;
  y?: number;
  [key: string]: any;
};

export type GraphEdge = {
  from?: string;
  to?: string;
  source?: string;
  target?: string;
  amount?: number;
  count?: number;
  [key: string]: any;
};

export type TransactionGraphHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
};

type AmountMode = "hover" | "focused" | "topk";

type Props = {
  data?: { nodes?: GraphNode[]; links?: GraphEdge[]; edges?: GraphEdge[] };
  nodes?: GraphNode[];
  links?: GraphEdge[];
  edges?: GraphEdge[];

  selectedNodeId?: string;
  onNodeSelect?: (id: string) => void;

  className?: string;

  maxNodes?: number;
  maxEdges?: number;

  // ✅ new controls
  showAmounts?: boolean;
  amountMode?: AmountMode;
  focusMode?: boolean;
  centerSelected?: boolean;
  topK?: number;
};

export const TransactionGraph = forwardRef<TransactionGraphHandle, Props>(
  function TransactionGraph(
    {
      data,
      nodes: nodesProp,
      links: linksProp,
      edges: edgesProp,
      selectedNodeId,
      onNodeSelect,
      className,
      maxNodes = 200,
      maxEdges = 600,
      showAmounts = false,
      amountMode = "hover",
      focusMode = true,
      centerSelected = true,
      topK = 12,
    },
    ref
  ) {
    // ✅ NEVER map undefined
    const nodesRaw = nodesProp ?? data?.nodes ?? [];
    const edgesRaw = linksProp ?? edgesProp ?? data?.links ?? data?.edges ?? [];

    // zoom state
    const [scale, setScale] = useState(1);
    const [tx, setTx] = useState(0);
    const [ty, setTy] = useState(0);

    // hover tooltip state
    const [hoverEdge, setHoverEdge] = useState<{
      x: number;
      y: number;
      text: string;
    } | null>(null);

    useImperativeHandle(ref, () => ({
      zoomIn: () => setScale((s) => Math.min(3, +(s + 0.15).toFixed(2))),
      zoomOut: () => setScale((s) => Math.max(0.4, +(s - 0.15).toFixed(2))),
      reset: () => {
        setScale(1);
        setTx(0);
        setTy(0);
      },
    }));

    const { nodes, edges } = useMemo(() => {
      const safeNodes = Array.isArray(nodesRaw) ? nodesRaw : [];
      const safeEdges = Array.isArray(edgesRaw) ? edgesRaw : [];

      const trimmedNodes = safeNodes.slice(0, maxNodes);
      const nodeSet = new Set(trimmedNodes.map((n) => n.id));

      const normalizedEdges = safeEdges
        .map((e) => ({
          from: e.from ?? e.source,
          to: e.to ?? e.target,
          amount: Number(e.amount ?? 0),
          count: Number(e.count ?? 1),
        }))
        .filter((e) => e.from && e.to);

      const trimmedEdges = normalizedEdges
        .filter((e) => nodeSet.has(e.from!) && nodeSet.has(e.to!))
        .slice(0, maxEdges);

      return { nodes: trimmedNodes, edges: trimmedEdges };
    }, [nodesRaw, edgesRaw, maxNodes, maxEdges]);

    const getNodeColor = (risk?: string) => {
      switch (risk) {
        case "high":
          return "hsl(0, 75%, 55%)";
        case "medium":
          return "hsl(38, 92%, 50%)";
        case "low":
          return "hsl(145, 65%, 42%)";
        default:
          return "hsl(175, 70%, 45%)";
      }
    };

    // Build neighbor set
    const neighborSet = useMemo(() => {
      if (!selectedNodeId) return new Set<string>();
      const s = new Set<string>([selectedNodeId]);
      for (const e of edges) {
        if (e.from === selectedNodeId) s.add(e.to!);
        if (e.to === selectedNodeId) s.add(e.from!);
      }
      return s;
    }, [edges, selectedNodeId]);

    // ✅ LAYOUT:
    // - If centerSelected: selected at center, neighbors around ring, others outer ring
    // - Else: simple ring layout
    const positionedNodes = useMemo(() => {
      const W = 900;
      const H = 520;
      const cx = W / 2;
      const cy = H / 2;

      const nodeMap = new Map<string, any>();

      // fallback ring layout
      const ringLayout = (arr: GraphNode[], radius: number, startAngle = 0) => {
        const n = Math.max(1, arr.length);
        return arr.map((node, i) => {
          const angle = startAngle + (2 * Math.PI * i) / n;
          return {
            ...node,
            x: node.x ?? cx + radius * Math.cos(angle),
            y: node.y ?? cy + radius * Math.sin(angle),
            label: node.label ?? node.id,
            risk: node.risk ?? "low",
          };
        });
      };

      // if no center mode or no selected node => normal ring
      if (!centerSelected || !selectedNodeId) {
        const all = ringLayout(nodes, Math.min(cx, cy) - 70);
        for (const n of all) nodeMap.set(n.id, n);
        return { list: all, map: nodeMap };
      }

      // center mode
      const selected = nodes.find((n) => n.id === selectedNodeId);
      const neighbors = nodes.filter(
        (n) => n.id !== selectedNodeId && neighborSet.has(n.id)
      );
      const others = nodes.filter(
        (n) => n.id !== selectedNodeId && !neighborSet.has(n.id)
      );

      const placed: any[] = [];

      if (selected) {
        const centerNode = {
          ...selected,
          x: cx,
          y: cy,
          label: selected.label ?? selected.id,
          risk: selected.risk ?? "low",
        };
        placed.push(centerNode);
        nodeMap.set(centerNode.id, centerNode);
      }

      const innerRing = ringLayout(neighbors, 170, -Math.PI / 2);
      for (const n of innerRing) {
        placed.push(n);
        nodeMap.set(n.id, n);
      }

      const outerRing = ringLayout(others, 250, -Math.PI / 2);
      for (const n of outerRing) {
        placed.push(n);
        nodeMap.set(n.id, n);
      }

      return { list: placed, map: nodeMap };
    }, [nodes, selectedNodeId, centerSelected, neighborSet]);

    const nodeById = positionedNodes.map;

    const shouldDimNode = (id: string) => {
      if (!focusMode || !selectedNodeId) return false;
      return !neighborSet.has(id);
    };

    const shouldDimEdge = (from: string, to: string) => {
      if (!focusMode || !selectedNodeId) return false;
      return !(neighborSet.has(from) && neighborSet.has(to));
    };

    // Decide which edges should have labels (non-hover modes)
    const labeledEdgeSet = useMemo(() => {
      const s = new Set<number>();
      if (!showAmounts) return s;

      if (amountMode === "focused") {
        edges.forEach((e, idx) => {
          if (!selectedNodeId) return;
          if (e.from === selectedNodeId || e.to === selectedNodeId) s.add(idx);
        });
        return s;
      }

      if (amountMode === "topk") {
        const ranked = edges
          .map((e, idx) => ({ idx, amt: e.amount ?? 0 }))
          .sort((a, b) => b.amt - a.amt)
          .slice(0, topK);
        ranked.forEach((r) => s.add(r.idx));
        return s;
      }

      // hover mode => no fixed labels
      return s;
    }, [showAmounts, amountMode, edges, selectedNodeId, topK]);

    // empty state
    if (positionedNodes.list.length === 0) {
      return (
        <div className={cn("graph-container h-96 relative", className)}>
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            No graph data (nodes=0). Check /graph/subgraph response and GraphView props.
          </div>
        </div>
      );
    }

    return (
      <div className={cn("graph-container h-96 relative", className)}>
        {/* Tooltip for hover amounts */}
        {hoverEdge && (
          <div
            className="absolute z-20 px-2 py-1 rounded bg-black/70 text-white text-xs font-mono pointer-events-none"
            style={{
              left: hoverEdge.x + 12,
              top: hoverEdge.y + 12,
            }}
          >
            {hoverEdge.text}
          </div>
        )}

        <svg className="w-full h-full" viewBox="0 0 900 520">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="hsl(220, 15%, 35%)" />
            </marker>
          </defs>

          <g transform={`translate(${tx},${ty}) scale(${scale})`}>
            {/* Edges */}
            {edges.map((edge, index) => {
              const from = edge.from!;
              const to = edge.to!;
              const fromNode = nodeById.get(from);
              const toNode = nodeById.get(to);
              if (!fromNode || !toNode) return null;

              const dim = shouldDimEdge(from, to);
              const opacity = dim ? 0.10 : 0.65;

              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2;

              const labelText = `₹${Math.round(edge.amount ?? 0).toLocaleString()}`;

              return (
                <g key={index}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="hsl(220, 15%, 25%)"
                    strokeWidth={dim ? 1 : 1.8}
                    markerEnd="url(#arrowhead)"
                    opacity={opacity}
                    onMouseMove={(evt) => {
                      if (!showAmounts) return;
                      if (amountMode !== "hover") return;

                      // tooltip follows cursor (screen coords)
                      const rect = (evt.currentTarget.ownerSVGElement as any)
                        ?.getBoundingClientRect?.();
                      if (!rect) return;

                      setHoverEdge({
                        x: evt.clientX - rect.left,
                        y: evt.clientY - rect.top,
                        text: labelText,
                      });
                    }}
                    onMouseLeave={() => {
                      if (amountMode === "hover") setHoverEdge(null);
                    }}
                  />

                  {/* Fixed labels for focused/topk only */}
                  {showAmounts &&
                    amountMode !== "hover" &&
                    labeledEdgeSet.has(index) &&
                    !dim && (
                      <g opacity={0.95}>
                        <rect
                          x={midX - 24}
                          y={midY - 14}
                          width={48}
                          height={18}
                          rx={4}
                          fill="rgba(0,0,0,0.55)"
                        />
                        <text
                          x={midX}
                          y={midY}
                          fill="white"
                          fontSize="10"
                          textAnchor="middle"
                          className="font-mono"
                          dominantBaseline="middle"
                        >
                          {labelText}
                        </text>
                      </g>
                    )}
                </g>
              );
            })}

            {/* Nodes */}
            {positionedNodes.list.map((node: any) => {
              const selected = selectedNodeId && node.id === selectedNodeId;
              const dim = shouldDimNode(node.id);
              const opacity = dim ? 0.25 : 1;

              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  opacity={opacity}
                  onClick={() => onNodeSelect?.(node.id)}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={selected ? 28 : 22}
                    fill="hsl(220, 18%, 10%)"
                    stroke={getNodeColor(node.risk)}
                    strokeWidth={selected ? 3 : 2}
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    fill="hsl(210, 20%, 95%)"
                    fontSize="10"
                    textAnchor="middle"
                    className="font-mono font-medium"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        <div className="scan-line" />
      </div>
    );
  }
);
