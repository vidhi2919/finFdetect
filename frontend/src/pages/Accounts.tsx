// import { useState } from "react";
// import { 
//   Users, 
//   Search, 
//   Filter, 
//   Download,
//   ArrowUpDown,
//   MoreHorizontal,
//   ArrowUpRight,
//   ArrowDownLeft,
//   Eye
// } from "lucide-react";
// import { RiskBadge } from "@/components/dashboard/RiskBadge";

// interface Account {
//   id: string;
//   riskScore: number;
//   riskLevel: "high" | "medium" | "low";
//   totalSent: number;
//   totalReceived: number;
//   transactionCount: number;
//   patterns: string[];
//   connections: number;
//   lastActivity: string;
//   status: "flagged" | "investigating" | "cleared" | "monitoring";
// }

// const mockAccounts: Account[] = [
//   {
//     id: "ACC-7821",
//     riskScore: 0.92,
//     riskLevel: "high",
//     totalSent: 245000,
//     totalReceived: 12500,
//     transactionCount: 47,
//     patterns: ["Smurfing", "Rapid Transfer"],
//     connections: 12,
//     lastActivity: "2 min ago",
//     status: "flagged",
//   },
//   {
//     id: "ACC-3456",
//     riskScore: 0.87,
//     riskLevel: "high",
//     totalSent: 189000,
//     totalReceived: 5200,
//     transactionCount: 38,
//     patterns: ["Layering"],
//     connections: 8,
//     lastActivity: "5 min ago",
//     status: "investigating",
//   },
//   {
//     id: "ACC-9012",
//     riskScore: 0.65,
//     riskLevel: "medium",
//     totalSent: 75000,
//     totalReceived: 68000,
//     transactionCount: 22,
//     patterns: ["Burst Activity"],
//     connections: 5,
//     lastActivity: "12 min ago",
//     status: "monitoring",
//   },
//   {
//     id: "ACC-5678",
//     riskScore: 0.58,
//     riskLevel: "medium",
//     totalSent: 52000,
//     totalReceived: 48000,
//     transactionCount: 18,
//     patterns: ["Correlation"],
//     connections: 6,
//     lastActivity: "28 min ago",
//     status: "monitoring",
//   },
//   {
//     id: "ACC-2345",
//     riskScore: 0.22,
//     riskLevel: "low",
//     totalSent: 15000,
//     totalReceived: 14500,
//     transactionCount: 8,
//     patterns: [],
//     connections: 3,
//     lastActivity: "1 hour ago",
//     status: "cleared",
//   },
//   {
//     id: "ACC-8901",
//     riskScore: 0.18,
//     riskLevel: "low",
//     totalSent: 8500,
//     totalReceived: 9200,
//     transactionCount: 5,
//     patterns: [],
//     connections: 2,
//     lastActivity: "2 hours ago",
//     status: "cleared",
//   },
// ];

// const statusColors = {
//   flagged: "bg-risk-high/10 text-risk-high border-risk-high/20",
//   investigating: "bg-risk-medium/10 text-risk-medium border-risk-medium/20",
//   monitoring: "bg-primary/10 text-primary border-primary/20",
//   cleared: "bg-success/10 text-success border-success/20",
// };

// export default function Accounts() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterRisk, setFilterRisk] = useState<string>("all");

//   const filteredAccounts = mockAccounts.filter(account => {
//     const matchesSearch = account.id.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesRisk = filterRisk === "all" || account.riskLevel === filterRisk;
//     return matchesSearch && matchesRisk;
//   });

//   return (
//     <div className="min-h-screen p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
//             <Users className="w-6 h-6 text-primary" />
//             Account Analysis
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Risk-ranked accounts with pattern detection results
//           </p>
//         </div>
//         <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
//           <Download className="w-4 h-4" />
//           Export Report
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//           <input
//             type="text"
//             placeholder="Search by account ID..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
//           />
//         </div>
        
//         <div className="flex items-center gap-2">
//           <Filter className="w-4 h-4 text-muted-foreground" />
//           <select
//             value={filterRisk}
//             onChange={(e) => setFilterRisk(e.target.value)}
//             className="px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
//           >
//             <option value="all">All Risk Levels</option>
//             <option value="high">High Risk</option>
//             <option value="medium">Medium Risk</option>
//             <option value="low">Low Risk</option>
//           </select>
//         </div>

//         <span className="text-sm text-muted-foreground">
//           {filteredAccounts.length} accounts
//         </span>
//       </div>

//       {/* Table */}
//       <div className="bg-card border border-border rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-border bg-muted/30">
//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   <button className="flex items-center gap-1 hover:text-foreground">
//                     Account ID
//                     <ArrowUpDown className="w-3 h-3" />
//                   </button>
//                 </th>
//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   <button className="flex items-center gap-1 hover:text-foreground">
//                     Risk Score
//                     <ArrowUpDown className="w-3 h-3" />
//                   </button>
//                 </th>
//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Money Flow
//                 </th>
//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Transactions
//                 </th>
//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Connections
//                 </th>
//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Patterns
//                 </th>
//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Last Activity
//                 </th>
//                 <th className="w-20"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredAccounts.map((account, index) => (
//                 <tr
//                   key={account.id}
//                   className="data-table-row border-b border-border last:border-0 fade-in"
//                   style={{ animationDelay: `${index * 50}ms` }}
//                 >
//                   <td className="px-4 py-4">
//                     <span className="font-mono text-sm font-medium text-foreground">
//                       {account.id}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4">
//                     <RiskBadge level={account.riskLevel} score={account.riskScore} size="sm" />
//                   </td>
//                   <td className="px-4 py-4">
//                     <span className={`px-2 py-1 text-xs font-medium rounded border capitalize ${statusColors[account.status]}`}>
//                       {account.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4">
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-1 text-xs">
//                         <ArrowUpRight className="w-3 h-3 text-risk-high" />
//                         <span className="font-mono text-foreground">
//                           ₹{account.totalSent.toLocaleString()}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-1 text-xs">
//                         <ArrowDownLeft className="w-3 h-3 text-success" />
//                         <span className="font-mono text-muted-foreground">
//                           ₹{account.totalReceived.toLocaleString()}
//                         </span>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-4">
//                     <span className="font-mono text-sm text-foreground">
//                       {account.transactionCount}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4">
//                     <span className="font-mono text-sm text-foreground">
//                       {account.connections}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4">
//                     <div className="flex flex-wrap gap-1">
//                       {account.patterns.length > 0 ? (
//                         account.patterns.map((pattern) => (
//                           <span
//                             key={pattern}
//                             className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded border border-primary/20"
//                           >
//                             {pattern}
//                           </span>
//                         ))
//                       ) : (
//                         <span className="text-xs text-muted-foreground">—</span>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-4 py-4">
//                     <span className="text-xs text-muted-foreground">
//                       {account.lastActivity}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4">
//                     <div className="flex items-center gap-1">
//                       <button className="p-1.5 rounded hover:bg-muted transition-colors">
//                         <Eye className="w-4 h-4 text-muted-foreground" />
//                       </button>
//                       <button className="p-1.5 rounded hover:bg-muted transition-colors">
//                         <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


/////////////////////////////////////////////////////////////////////////////



// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
//   Users,
//   Search,
//   Filter,
//   Download,
//   ArrowUpDown,
//   MoreHorizontal,
//   ArrowUpRight,
//   ArrowDownLeft,
//   Eye,
// } from "lucide-react";

// import { RiskBadge } from "@/components/dashboard/RiskBadge";
// import { apiGet } from "@/lib/api";

// /** ===== Types from backend =====
//  * Expecting something like:
//  * {
//  *   account_id: "ACC0065",
//  *   risk_score: 58.69,
//  *   risk_band: "MEDIUM",
//  *   patterns: ["Smurfing", "Layering"],
//  *   total_sent: 245000,
//  *   total_received: 12500,
//  *   transaction_count: 47,
//  *   connections: 12,
//  *   last_activity: "2026-01-17T01:20:00Z" | "2 min ago"
//  * }
//  */
// type RiskBand = "HIGH" | "MEDIUM" | "LOW";
// type RiskLevelUI = "high" | "medium" | "low";
// type StatusUI = "flagged" | "investigating" | "cleared" | "monitoring";

// interface AccountFromAPI {
//   account_id: string;
//   risk_score: number; // 0-100 (your engine)
//   risk_band: RiskBand;
//   patterns?: string[];
//   total_sent?: number;
//   total_received?: number;
//   transaction_count?: number;
//   connections?: number;
//   last_activity?: string; // optional
//   status?: StatusUI; // optional
// }

// function normalizeRows(payload: any): AccountFromAPI[] {
//   if (Array.isArray(payload)) return payload;
//   if (payload && typeof payload === "object") {
//     const maybe =
//       payload.items ??
//       payload.rows ??
//       payload.data ??
//       payload.accounts ??
//       payload.results;
//     if (Array.isArray(maybe)) return maybe;
//   }
//   return [];
// }

// function toRiskLevelUI(band: RiskBand): RiskLevelUI {
//   if (band === "HIGH") return "high";
//   if (band === "MEDIUM") return "medium";
//   return "low";
// }

// function defaultStatus(band: RiskBand): StatusUI {
//   if (band === "HIGH") return "flagged";
//   if (band === "MEDIUM") return "monitoring";
//   return "cleared";
// }

// /**
//  * Your RiskBadge currently expects score 0–1 (based on your mock usage).
//  * Backend gives 0–100. Convert:
//  */
// function score01(score100: number): number {
//   const x = Number(score100);
//   if (Number.isNaN(x)) return 0;
//   return Math.max(0, Math.min(1, x / 100));
// }

// const statusColors: Record<StatusUI, string> = {
//   flagged: "bg-risk-high/10 text-risk-high border-risk-high/20",
//   investigating: "bg-risk-medium/10 text-risk-medium border-risk-medium/20",
//   monitoring: "bg-primary/10 text-primary border-primary/20",
//   cleared: "bg-success/10 text-success border-success/20",
// };

// function formatLastActivity(value?: string): string {
//   if (!value) return "—";

//   // If backend already sends "2 min ago", just show it
//   if (value.includes("ago")) return value;

//   // Otherwise try ISO -> relative-ish fallback
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return value;

//   const diffMs = Date.now() - d.getTime();
//   const diffMin = Math.floor(diffMs / 60000);

//   if (diffMin < 1) return "Just now";
//   if (diffMin < 60) return `${diffMin} min ago`;
//   const diffHr = Math.floor(diffMin / 60);
//   if (diffHr < 24) return `${diffHr} hr ago`;
//   const diffDay = Math.floor(diffHr / 24);
//   return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
// }

// export default function Accounts() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterRisk, setFilterRisk] = useState<"all" | "high" | "medium" | "low">("all");

//   const [rows, setRows] = useState<AccountFromAPI[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

//   // optional sorting
//   const [sortKey, setSortKey] = useState<
//     "account" | "risk" | "sent" | "received" | "txns" | "connections"
//   >("risk");
//   const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

//   async function fetchAccounts() {
//     try {
//       setErr(null);

//       // Prefer server-side filtering if available (recommended for big data)
//       // const params = new URLSearchParams();
//       // params.set("limit", "500");
      
//       const params = new URLSearchParams();
//       params.set("top_n", "500");

//       // backend uses band=HIGH|MEDIUM|LOW
//       if (filterRisk !== "all") params.set("band", filterRisk.toUpperCase());

//       // include_patterns exists ✅
//       params.set("include_patterns", "true");

//       // NOTE: /cases does NOT support q=search yet.
//       // We'll do search client-side.


//       if (searchQuery.trim()) params.set("q", searchQuery.trim());

//       if (filterRisk !== "all") {
//         // backend expects HIGH/MEDIUM/LOW
//         params.set("risk_band", filterRisk.toUpperCase());
//       }

//       // Change to `/alerts` if your backend still uses that route
//       const raw = await apiGet<any>(`/cases?${params.toString()}`);
//       const data = normalizeRows(raw);

//       setRows(data);
//     } catch (e: any) {
//       setErr(e?.message ?? "Failed to fetch accounts");
//       setRows([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Debounce search/filter changes a bit (optional)
//   useEffect(() => {
//     const t = setTimeout(() => {
//       fetchAccounts();
//     }, 250);
//     return () => clearTimeout(t);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [searchQuery, filterRisk]);

//   // initial load
//   useEffect(() => {
//     fetchAccounts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const accountsUI = useMemo(() => {
//     // Server already filtered, but still safe to apply client fallback
//     let list = Array.isArray(rows) ? rows : [];

//     // client fallback filter (if server ignores params)
//     const q = searchQuery.trim().toLowerCase();
//     if (q) list = list.filter((a) => a.account_id?.toLowerCase().includes(q));

//     if (filterRisk !== "all") {
//       const band = filterRisk.toUpperCase();
//       list = list.filter((a) => a.risk_band === band);
//     }

//     // sorting
//     const mul = sortDir === "asc" ? 1 : -1;
//     const getNum = (x: any) => (typeof x === "number" ? x : Number(x ?? 0)) || 0;

//     list = [...list].sort((a, b) => {
//       switch (sortKey) {
//         case "account":
//           return mul * a.account_id.localeCompare(b.account_id);
//         case "risk":
//           return mul * (getNum(a.risk_score) - getNum(b.risk_score));
//         case "sent":
//           return mul * (getNum(a.total_sent) - getNum(b.total_sent));
//         case "received":
//           return mul * (getNum(a.total_received) - getNum(b.total_received));
//         case "txns":
//           return mul * (getNum(a.transaction_count) - getNum(b.transaction_count));
//         case "connections":
//           return mul * (getNum(a.connections) - getNum(b.connections));
//         default:
//           return 0;
//       }
//     });

//     return list;
//   }, [rows, searchQuery, filterRisk, sortKey, sortDir]);

//   function toggleSort(nextKey: typeof sortKey) {
//     if (sortKey === nextKey) {
//       setSortDir(sortDir === "asc" ? "desc" : "asc");
//     } else {
//       setSortKey(nextKey);
//       setSortDir("desc");
//     }
//   }

//   function exportJson() {
//     // Client-side export. Later you can wire to a backend export endpoint.
//     const blob = new Blob([JSON.stringify(accountsUI, null, 2)], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "accounts_export.json";
//     a.click();
//     URL.revokeObjectURL(url);
//   }

//   return (
//     <div className="min-h-screen p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
//             <Users className="w-6 h-6 text-primary" />
//             Account Analysis
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Risk-ranked accounts with pattern detection results
//           </p>
//           {err && <p className="text-sm mt-2 text-risk-high">API error: {err}</p>}
//         </div>

//         <button
//           onClick={exportJson}
//           className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
//         >
//           <Download className="w-4 h-4" />
//           Export Report
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//           <input
//             type="text"
//             placeholder="Search by account ID..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
//           />
//         </div>

//         <div className="flex items-center gap-2">
//           <Filter className="w-4 h-4 text-muted-foreground" />
//           <select
//             value={filterRisk}
//             onChange={(e) => setFilterRisk(e.target.value as any)}
//             className="px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
//           >
//             <option value="all">All Risk Levels</option>
//             <option value="high">High Risk</option>
//             <option value="medium">Medium Risk</option>
//             <option value="low">Low Risk</option>
//           </select>
//         </div>

//         <span className="text-sm text-muted-foreground">
//           {loading ? "Loading..." : `${accountsUI.length} accounts`}
//         </span>
//       </div>

//       {/* Table */}
//       <div className="bg-card border border-border rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-border bg-muted/30">
//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   <button
//                     onClick={() => toggleSort("account")}
//                     className="flex items-center gap-1 hover:text-foreground"
//                   >
//                     Account ID <ArrowUpDown className="w-3 h-3" />
//                   </button>
//                 </th>

//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   <button
//                     onClick={() => toggleSort("risk")}
//                     className="flex items-center gap-1 hover:text-foreground"
//                   >
//                     Risk Score <ArrowUpDown className="w-3 h-3" />
//                   </button>
//                 </th>

//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Status
//                 </th>

//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Money Flow
//                 </th>

//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   <button
//                     onClick={() => toggleSort("txns")}
//                     className="flex items-center gap-1 hover:text-foreground"
//                   >
//                     Transactions <ArrowUpDown className="w-3 h-3" />
//                   </button>
//                 </th>

//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   <button
//                     onClick={() => toggleSort("connections")}
//                     className="flex items-center gap-1 hover:text-foreground"
//                   >
//                     Connections <ArrowUpDown className="w-3 h-3" />
//                   </button>
//                 </th>

//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Patterns
//                 </th>

//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Last Activity
//                 </th>

//                 <th className="w-20"></th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={9} className="px-4 py-6 text-sm text-muted-foreground">
//                     Loading accounts from backend…
//                   </td>
//                 </tr>
//               ) : accountsUI.length === 0 ? (
//                 <tr>
//                   <td colSpan={9} className="px-4 py-6 text-sm text-muted-foreground">
//                     No accounts found.
//                   </td>
//                 </tr>
//               ) : (
//                 accountsUI.map((a, index) => {
//                   const riskLevel = toRiskLevelUI(a.risk_band);
//                   const status = a.status ?? defaultStatus(a.risk_band);
//                   const patterns = Array.isArray(a.patterns) ? a.patterns : [];

//                   return (
//                     <tr
//                       key={a.account_id}
//                       className="data-table-row border-b border-border last:border-0 fade-in"
//                       style={{ animationDelay: `${index * 50}ms` }}
//                     >
//                       <td className="px-4 py-4">
//                         <span className="font-mono text-sm font-medium text-foreground">
//                           {a.account_id}
//                         </span>
//                       </td>

//                       <td className="px-4 py-4">
//                         <RiskBadge level={riskLevel} score={score01(a.risk_score)} size="sm" />
//                       </td>

//                       <td className="px-4 py-4">
//                         <span
//                           className={`px-2 py-1 text-xs font-medium rounded border capitalize ${statusColors[status]}`}
//                         >
//                           {status}
//                         </span>
//                       </td>

//                       <td className="px-4 py-4">
//                         <div className="space-y-1">
//                           <div className="flex items-center gap-1 text-xs">
//                             <ArrowUpRight className="w-3 h-3 text-risk-high" />
//                             <span className="font-mono text-foreground">
//                               ₹{Number(a.total_sent ?? 0).toLocaleString()}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-1 text-xs">
//                             <ArrowDownLeft className="w-3 h-3 text-success" />
//                             <span className="font-mono text-muted-foreground">
//                               ₹{Number(a.total_received ?? 0).toLocaleString()}
//                             </span>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-4 py-4">
//                         <span className="font-mono text-sm text-foreground">
//                           {Number(a.transaction_count ?? 0)}
//                         </span>
//                       </td>

//                       <td className="px-4 py-4">
//                         <span className="font-mono text-sm text-foreground">
//                           {Number(a.connections ?? 0)}
//                         </span>
//                       </td>

//                       <td className="px-4 py-4">
//                         <div className="flex flex-wrap gap-1">
//                           {patterns.length > 0 ? (
//                             patterns.map((p) => (
//                               <span
//                                 key={p}
//                                 className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded border border-primary/20"
//                               >
//                                 {p}
//                               </span>
//                             ))
//                           ) : (
//                             <span className="text-xs text-muted-foreground">—</span>
//                           )}
//                         </div>
//                       </td>

//                       <td className="px-4 py-4">
//                         <span className="text-xs text-muted-foreground">
//                           {formatLastActivity(a.last_activity)}
//                         </span>
//                       </td>

//                       <td className="px-4 py-4">
//                         <div className="flex items-center gap-1">
//                           <button
//                             className="p-1.5 rounded hover:bg-muted transition-colors"
//                             title="View details"
//                             onClick={() => {
//                               // later: navigate to /accounts/:id or open side-panel
//                               console.log("View", a.account_id);
//                             }}
//                           >
//                             <Eye className="w-4 h-4 text-muted-foreground" />
//                           </button>
//                           <button
//                             className="p-1.5 rounded hover:bg-muted transition-colors"
//                             title="More"
//                             onClick={() => console.log("More", a.account_id)}
//                           >
//                             <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }




// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
//   Users,
//   Search,
//   Filter,
//   Download,
//   ArrowUpDown,
//   MoreHorizontal,
//   ArrowUpRight,
//   ArrowDownLeft,
//   Eye,
// } from "lucide-react";

// import { RiskBadge } from "@/components/dashboard/RiskBadge";
// import { apiGet } from "@/lib/api";

// type RiskBand = "HIGH" | "MEDIUM" | "LOW";
// type RiskLevelUI = "high" | "medium" | "low";
// type StatusUI = "flagged" | "investigating" | "cleared" | "monitoring";

// type CaseListItem = {
//   account_id: string;
//   risk_score: number; // 0-100
//   risk_band: RiskBand;
//   patterns?: string[];
// };

// type CaseListResponse = {
//   total: number;
//   returned: number;
//   items: CaseListItem[];
// };

// type CaseDetailResponse = {
//   report: {
//     account_id: string;
//     graph_evidence?: {
//       total_flow?: { sent?: number; received?: number };
//       in_degree?: number;
//       out_degree?: number;
//       transaction_count?: number;
//     };
//     // patterns_detected exists, but we don't strictly need it for moneyflow/connections
//   };
// };

// type AccountUI = {
//   id: string;
//   riskScore100: number;
//   riskLevel: RiskLevelUI;
//   riskBand: RiskBand;

//   totalSent: number | null;
//   totalReceived: number | null;
//   transactionCount: number | null; // not available currently
//   connections: number | null;

//   patterns: string[];
//   lastActivity: string | null;
//   status: StatusUI;
// };

// const statusColors: Record<StatusUI, string> = {
//   flagged: "bg-risk-high/10 text-risk-high border-risk-high/20",
//   investigating: "bg-risk-medium/10 text-risk-medium border-risk-medium/20",
//   monitoring: "bg-primary/10 text-primary border-primary/20",
//   cleared: "bg-success/10 text-success border-success/20",
// };

// function toRiskLevelUI(band: RiskBand): RiskLevelUI {
//   if (band === "HIGH") return "high";
//   if (band === "MEDIUM") return "medium";
//   return "low";
// }

// function defaultStatus(band: RiskBand): StatusUI {
//   if (band === "HIGH") return "flagged";
//   if (band === "MEDIUM") return "monitoring";
//   return "cleared";
// }

// // Your RiskBadge mock used 0-1, backend is 0-100
// function score01(score100: number): number {
//   const x = Number(score100);
//   if (Number.isNaN(x)) return 0;
//   return Math.max(0, Math.min(1, x / 100));
// }

// function normalizeList(payload: any): CaseListItem[] {
//   if (Array.isArray(payload)) return payload;
//   if (payload && typeof payload === "object") {
//     const maybe = payload.items ?? payload.rows ?? payload.data ?? payload.accounts ?? payload.results;
//     if (Array.isArray(maybe)) return maybe;
//   }
//   return [];
// }

// export default function Accounts() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterRisk, setFilterRisk] = useState<"all" | "high" | "medium" | "low">("all");

//   const [baseRows, setBaseRows] = useState<CaseListItem[]>([]);
//   const [detailsMap, setDetailsMap] = useState<Record<string, Partial<AccountUI>>>({});
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

//   // sorting
//   const [sortKey, setSortKey] = useState<"account" | "risk" | "txns" | "connections">("risk");
//   const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

//   function toggleSort(nextKey: typeof sortKey) {
//     if (sortKey === nextKey) {
//       setSortDir(sortDir === "asc" ? "desc" : "asc");
//     } else {
//       setSortKey(nextKey);
//       setSortDir("desc");
//     }
//   }

//   // 1) load list from /cases
//   async function fetchCasesList() {
//     try {
//       setErr(null);
//       setLoading(true);

//       const params = new URLSearchParams();
//       params.set("top_n", "500");
//       params.set("include_patterns", "true");
//       if (filterRisk !== "all") params.set("band", filterRisk.toUpperCase());

//       const raw = await apiGet<CaseListResponse | any>(`/cases?${params.toString()}`);
//       const items = normalizeList(raw);

//       setBaseRows(items);
//     } catch (e: any) {
//       setErr(e?.message ?? "Failed to fetch cases");
//       setBaseRows([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // 2) fetch details for visible accounts (moneyflow + connections)
//   async function fetchCaseDetail(accountId: string) {
//     try {
//       const d = await apiGet<CaseDetailResponse>(`/cases/${accountId}`);
//       const ge = d?.report?.graph_evidence;

//       const sent = Number(ge?.total_flow?.sent ?? NaN);
//       const received = Number(ge?.total_flow?.received ?? NaN);

//       const inDeg = Number(ge?.in_degree ?? NaN);
//       const outDeg = Number(ge?.out_degree ?? NaN);

//       setDetailsMap((prev) => ({
//         ...prev,
//         [accountId]: {
//           totalSent: Number.isFinite(sent) ? sent : 0,
//           totalReceived: Number.isFinite(received) ? received : 0,
//           connections: Number.isFinite(inDeg) && Number.isFinite(outDeg) ? inDeg + outDeg : null,
//           // transactionCount is not available in your current case report JSON
//           transactionCount:Number.isFinite(transanction_count) ?transaction_count : 0 ,
//         },
//       }));
//     } catch {
//       // keep silent; row will show —
//     }
//   }

//   // initial + when risk band filter changes
//   useEffect(() => {
//     fetchCasesList();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filterRisk]);

//   // client-side search + mapping to UI rows
//   const accountsUI: AccountUI[] = useMemo(() => {
//     const q = searchQuery.trim().toLowerCase();

//     let list = (baseRows ?? []).filter((r) => {
//       if (!q) return true;
//       return (r.account_id ?? "").toLowerCase().includes(q);
//     });

//     // sort
//     const mul = sortDir === "asc" ? 1 : -1;
//     const getNum = (x: any) => (typeof x === "number" ? x : Number(x ?? 0)) || 0;

//     list = [...list].sort((a, b) => {
//       if (sortKey === "account") return mul * (a.account_id ?? "").localeCompare(b.account_id ?? "");
//       if (sortKey === "risk") return mul * (getNum(a.risk_score) - getNum(b.risk_score));

//       const ad = detailsMap[a.account_id];
//       const bd = detailsMap[b.account_id];

//       if (sortKey === "connections") return mul * (getNum(ad?.connections) - getNum(bd?.connections));
//       if (sortKey === "txns") return mul * (getNum(ad?.transactionCount) - getNum(bd?.transactionCount));

//       return 0;
//     });

//     return list.map((r) => {
//       const band = r.risk_band;
//       const det = detailsMap[r.account_id];

//       return {
//         id: r.account_id,
//         riskScore100: Number(r.risk_score ?? 0),
//         riskBand: band,
//         riskLevel: toRiskLevelUI(band),

//         totalSent: det?.totalSent ?? null,
//         totalReceived: det?.totalReceived ?? null,
//         transactionCount: det?.transactionCount ?? null,
//         connections: det?.connections ?? null,

//         patterns: Array.isArray(r.patterns) ? r.patterns : [],
//         lastActivity: null,
//         status: defaultStatus(band),
//       };
//     });
//   }, [baseRows, searchQuery, sortKey, sortDir, detailsMap]);

//   // fetch details for top N rows in current view (lazy)
//   useEffect(() => {
//     const top = accountsUI.slice(0, 40); // keep it light; bump if you want
//     top.forEach((a) => {
//       if (!detailsMap[a.id]) fetchCaseDetail(a.id);
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [accountsUI]);

//   function exportJson() {
//     const blob = new Blob([JSON.stringify(accountsUI, null, 2)], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "accounts_export.json";
//     a.click();
//     URL.revokeObjectURL(url);
//   }

//   return (
//     <div className="min-h-screen p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
//             <Users className="w-6 h-6 text-primary" />
//             Account Analysis
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Risk-ranked accounts with pattern detection results
//           </p>
//           {err && <p className="text-sm mt-2 text-risk-high">API error: {err}</p>}
//         </div>
//         <button
//           onClick={exportJson}
//           className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
//         >
//           <Download className="w-4 h-4" />
//           Export Report
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//           <input
//             type="text"
//             placeholder="Search by account ID..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
//           />
//         </div>

//         <div className="flex items-center gap-2">
//           <Filter className="w-4 h-4 text-muted-foreground" />
//           <select
//             value={filterRisk}
//             onChange={(e) => setFilterRisk(e.target.value as any)}
//             className="px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
//           >
//             <option value="all">All Risk Levels</option>
//             <option value="high">High Risk</option>
//             <option value="medium">Medium Risk</option>
//             <option value="low">Low Risk</option>
//           </select>
//         </div>

//         <span className="text-sm text-muted-foreground">
//           {loading ? "Loading..." : `${accountsUI.length} accounts`}
//         </span>
//       </div>

//       {/* Table */}
//       <div className="bg-card border border-border rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-border bg-muted/30">
//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   <button onClick={() => toggleSort("account")} className="flex items-center gap-1 hover:text-foreground">
//                     Account ID <ArrowUpDown className="w-3 h-3" />
//                   </button>
//                 </th>

//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   <button onClick={() => toggleSort("risk")} className="flex items-center gap-1 hover:text-foreground">
//                     Risk Score <ArrowUpDown className="w-3 h-3" />
//                   </button>
//                 </th>

//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Status
//                 </th>

//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Money Flow
//                 </th>

//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   <button onClick={() => toggleSort("txns")} className="flex items-center gap-1 hover:text-foreground">
//                     Transactions <ArrowUpDown className="w-3 h-3" />
//                   </button>
//                 </th>

//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   <button onClick={() => toggleSort("connections")} className="flex items-center gap-1 hover:text-foreground">
//                     Connections <ArrowUpDown className="w-3 h-3" />
//                   </button>
//                 </th>

//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Patterns
//                 </th>

//                 <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                   Last Activity
//                 </th>

//                 <th className="w-20"></th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={9} className="px-4 py-6 text-sm text-muted-foreground">
//                     Loading accounts from backend…
//                   </td>
//                 </tr>
//               ) : accountsUI.length === 0 ? (
//                 <tr>
//                   <td colSpan={9} className="px-4 py-6 text-sm text-muted-foreground">
//                     No accounts found.
//                   </td>
//                 </tr>
//               ) : (
//                 accountsUI.map((a, index) => (
//                   <tr
//                     key={a.id}
//                     className="data-table-row border-b border-border last:border-0 fade-in"
//                     style={{ animationDelay: `${index * 40}ms` }}
//                   >
//                     <td className="px-4 py-4">
//                       <span className="font-mono text-sm font-medium text-foreground">{a.id}</span>
//                     </td>

//                     <td className="px-4 py-4">
//                       <RiskBadge level={a.riskLevel} score={score01(a.riskScore100)} size="sm" />
//                     </td>

//                     <td className="px-4 py-4">
//                       <span className={`px-2 py-1 text-xs font-medium rounded border capitalize ${statusColors[a.status]}`}>
//                         {a.status}
//                       </span>
//                     </td>

//                     <td className="px-4 py-4">
//                       <div className="space-y-1">
//                         <div className="flex items-center gap-1 text-xs">
//                           <ArrowUpRight className="w-3 h-3 text-risk-high" />
//                           <span className="font-mono text-foreground">
//                             ₹{Number(a.totalSent ?? 0).toLocaleString()}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-1 text-xs">
//                           <ArrowDownLeft className="w-3 h-3 text-success" />
//                           <span className="font-mono text-muted-foreground">
//                             ₹{Number(a.totalReceived ?? 0).toLocaleString()}
//                           </span>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-4 py-4">
//                       <span className="font-mono text-sm text-foreground">
//                         {a.transactionCount ?? "—"}
//                       </span>
//                     </td>

//                     <td className="px-4 py-4">
//                       <span className="font-mono text-sm text-foreground">
//                         {a.connections ?? "—"}
//                       </span>
//                     </td>

//                     <td className="px-4 py-4">
//                       <div className="flex flex-wrap gap-1">
//                         {a.patterns.length > 0 ? (
//                           a.patterns.map((p) => (
//                             <span
//                               key={p}
//                               className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded border border-primary/20"
//                             >
//                               {p}
//                             </span>
//                           ))
//                         ) : (
//                           <span className="text-xs text-muted-foreground">—</span>
//                         )}
//                       </div>
//                     </td>

//                     <td className="px-4 py-4">
//                       <span className="text-xs text-muted-foreground">{a.lastActivity ?? "—"}</span>
//                     </td>

//                     <td className="px-4 py-4">
//                       <div className="flex items-center gap-1">
//                         <button
//                           className="p-1.5 rounded hover:bg-muted transition-colors"
//                           onClick={() => console.log("View", a.id)}
//                           title="View details"
//                         >
//                           <Eye className="w-4 h-4 text-muted-foreground" />
//                         </button>
//                         <button
//                           className="p-1.5 rounded hover:bg-muted transition-colors"
//                           onClick={() => console.log("More", a.id)}
//                           title="More"
//                         >
//                           <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>

//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
} from "lucide-react";

import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { apiGet } from "@/lib/api";

type RiskBand = "HIGH" | "MEDIUM" | "LOW";
type RiskLevelUI = "high" | "medium" | "low";
type StatusUI = "flagged" | "investigating" | "cleared" | "monitoring";

type CaseListItem = {
  account_id: string;
  risk_score: number; // 0-100
  risk_band: RiskBand;
  patterns?: string[];
};

type CaseListResponse = {
  total: number;
  returned: number;
  items: CaseListItem[];
};

type CaseDetailResponse = {
  report: {
    account_id: string;
    last_activity?: string | null;
    last_activity_human?: string | null;
    graph_evidence?: {
      total_flow?: { sent?: number; received?: number };
      in_degree?: number;
      out_degree?: number;
      transaction_count?: number; // <-- available
      unique_counterparties?: number;
    };
    account_metrics?: {
      transaction_count?: number; // <-- fallback if you use it
    };
  };
};

type AccountUI = {
  id: string;
  riskScore100: number;
  riskLevel: RiskLevelUI;
  riskBand: RiskBand;

  totalSent: number | null;
  totalReceived: number | null;
  transactionCount: number | null;
  connections: number | null;

  patterns: string[];
  lastActivity: string | null;
  status: StatusUI;
};

const statusColors: Record<StatusUI, string> = {
  flagged: "bg-risk-high/10 text-risk-high border-risk-high/20",
  investigating: "bg-risk-medium/10 text-risk-medium border-risk-medium/20",
  monitoring: "bg-primary/10 text-primary border-primary/20",
  cleared: "bg-success/10 text-success border-success/20",
};

function toRiskLevelUI(band: RiskBand): RiskLevelUI {
  if (band === "HIGH") return "high";
  if (band === "MEDIUM") return "medium";
  return "low";
}

function defaultStatus(band: RiskBand): StatusUI {
  if (band === "HIGH") return "flagged";
  if (band === "MEDIUM") return "monitoring";
  return "cleared";
}

// Your RiskBadge mock used 0-1, backend is 0-100
function score01(score100: number): number {
  const x = Number(score100);
  if (Number.isNaN(x)) return 0;
  return Math.max(0, Math.min(1, x / 100));
}

function normalizeList(payload: any): CaseListItem[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const maybe = payload.items ?? payload.rows ?? payload.data ?? payload.accounts ?? payload.results;
    if (Array.isArray(maybe)) return maybe;
  }
  return [];
}

export default function Accounts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<"all" | "high" | "medium" | "low">("all");

  const [baseRows, setBaseRows] = useState<CaseListItem[]>([]);
  const [detailsMap, setDetailsMap] = useState<Record<string, Partial<AccountUI>>>({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // sorting
  const [sortKey, setSortKey] = useState<"account" | "risk" | "txns" | "connections">("risk");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function toggleSort(nextKey: typeof sortKey) {
    if (sortKey === nextKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(nextKey);
      setSortDir("desc");
    }
  }

  // 1) load list from /cases
  async function fetchCasesList() {
    try {
      setErr(null);
      setLoading(true);

      const params = new URLSearchParams();
      params.set("top_n", "500");
      params.set("include_patterns", "true");
      if (filterRisk !== "all") params.set("band", filterRisk.toUpperCase());

      const raw = await apiGet<CaseListResponse | any>(`/cases?${params.toString()}`);
      const items = normalizeList(raw);
      setBaseRows(items);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to fetch cases");
      setBaseRows([]);
    } finally {
      setLoading(false);
    }
  }

  // 2) fetch details for visible accounts (moneyflow + connections + txns)
  // async function fetchCaseDetail(accountId: string) {
  //   try {
  //     const d = await apiGet<CaseDetailResponse>(`/cases/${accountId}`);
  //     const ge = d?.report?.graph_evidence;

  //     const sent = Number(ge?.total_flow?.sent ?? NaN);
  //     const received = Number(ge?.total_flow?.received ?? NaN);

  //     const inDeg = Number(ge?.in_degree ?? NaN);
  //     const outDeg = Number(ge?.out_degree ?? NaN);

  //     // ✅ FIX: read transaction_count properly (fallback to account_metrics.transaction_count)
  //     const txCountRaw =
  //       d?.report?.graph_evidence?.transaction_count ??
  //       d?.report?.account_metrics?.transaction_count;

  //     const txCount = Number(txCountRaw ?? NaN);

  //     setDetailsMap((prev) => ({
  //       ...prev,
  //       [accountId]: {
  //         totalSent: Number.isFinite(sent) ? sent : 0,
  //         totalReceived: Number.isFinite(received) ? received : 0,
  //         // connections: Number.isFinite(inDeg) && Number.isFinite(outDeg) ? inDeg + outDeg : null,
  //         connections: Number.isFinite(uniqueConn)? uniqueConn: (Number.isFinite(inDeg) && Number.isFinite(outDeg) ? inDeg + outDeg : null),
  //         transactionCount: Number.isFinite(txCount) ? txCount : null,
  //       },
  //     }));
  //   } catch {
  //     // keep silent; row will show —
  //   }
  // }

  async function fetchCaseDetail(accountId: string) {
  try {
    const d = await apiGet<CaseDetailResponse>(`/cases/${accountId}`);
    const ge = d?.report?.graph_evidence;

    const sent = Number(ge?.total_flow?.sent ?? NaN);
    const received = Number(ge?.total_flow?.received ?? NaN);

    const inDeg = Number(ge?.in_degree ?? NaN);
    const outDeg = Number(ge?.out_degree ?? NaN);

    // ✅ transactions = edge count
    const txCount = Number(ge?.transaction_count ?? NaN);

    // ✅ connections = UNIQUE counterparties
    const uniqueConn = Number(ge?.unique_counterparties ?? NaN);
    const lastHuman = d?.report?.last_activity_human ?? null;
    const lastIso = d?.report?.last_activity ?? null;


    setDetailsMap((prev) => ({
      ...prev,
      [accountId]: {
        totalSent: Number.isFinite(sent) ? sent : null,
        totalReceived: Number.isFinite(received) ? received : null,

        transactionCount: Number.isFinite(txCount) ? txCount : null,
        lastActivity: lastHuman ?? lastIso, // show human if available

        // ✅ THIS is the key fix
        connections: Number.isFinite(uniqueConn)
          ? uniqueConn
          : Number.isFinite(inDeg) && Number.isFinite(outDeg)
          ? inDeg + outDeg
          : null,
      },
    }));
  } catch {
    // silent fail
  }
}


  // initial + when risk band filter changes
  useEffect(() => {
    fetchCasesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRisk]);

  // client-side search + mapping to UI rows
  const accountsUI: AccountUI[] = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let list = (baseRows ?? []).filter((r) => {
      if (!q) return true;
      return (r.account_id ?? "").toLowerCase().includes(q);
    });

    // sort
    const mul = sortDir === "asc" ? 1 : -1;
    const getNum = (x: any) => (typeof x === "number" ? x : Number(x ?? 0)) || 0;

    list = [...list].sort((a, b) => {
      if (sortKey === "account") return mul * (a.account_id ?? "").localeCompare(b.account_id ?? "");
      if (sortKey === "risk") return mul * (getNum(a.risk_score) - getNum(b.risk_score));

      const ad = detailsMap[a.account_id];
      const bd = detailsMap[b.account_id];

      if (sortKey === "connections") return mul * (getNum(ad?.connections) - getNum(bd?.connections));
      if (sortKey === "txns") return mul * (getNum(ad?.transactionCount) - getNum(bd?.transactionCount));

      return 0;
    });

    return list.map((r) => {
      const band = r.risk_band;
      const det = detailsMap[r.account_id];

      return {
        id: r.account_id,
        riskScore100: Number(r.risk_score ?? 0),
        riskBand: band,
        riskLevel: toRiskLevelUI(band),

        totalSent: det?.totalSent ?? null,
        totalReceived: det?.totalReceived ?? null,
        transactionCount: det?.transactionCount ?? null,
        connections: det?.connections ?? null,

        patterns: Array.isArray(r.patterns) ? r.patterns : [],
        lastActivity: det?.lastActivity ?? null,
        status: defaultStatus(band),
      };
    });
  }, [baseRows, searchQuery, sortKey, sortDir, detailsMap]);

  // fetch details for top N rows in current view (lazy)
  useEffect(() => {
    const top = accountsUI.slice(0, 40) // keep it light
    top.forEach((a) => {
      if (!detailsMap[a.id]) fetchCaseDetail(a.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountsUI]);

  function exportJson() {
    const blob = new Blob([JSON.stringify(accountsUI, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "accounts_export.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            Account Analysis
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Risk-ranked accounts with pattern detection results
          </p>
          {err && <p className="text-sm mt-2 text-risk-high">API error: {err}</p>}
        </div>
        <button
          onClick={exportJson}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by account ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value as any)}
            className="px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>

        <span className="text-sm text-muted-foreground">
          {loading ? "Loading..." : `${accountsUI.length} accounts`}
        </span>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button onClick={() => toggleSort("account")} className="flex items-center gap-1 hover:text-foreground">
                    Account ID <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>

                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button onClick={() => toggleSort("risk")} className="flex items-center gap-1 hover:text-foreground">
                    Risk Score <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>

                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>

                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Money Flow
                </th>

                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button onClick={() => toggleSort("txns")} className="flex items-center gap-1 hover:text-foreground">
                    Transactions <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>

                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button onClick={() => toggleSort("connections")} className="flex items-center gap-1 hover:text-foreground">
                    Connections <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>

                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Patterns
                </th>

                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Last Activity
                </th>

                <th className="w-20"></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-sm text-muted-foreground">
                    Loading accounts from backend…
                  </td>
                </tr>
              ) : accountsUI.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-sm text-muted-foreground">
                    No accounts found.
                  </td>
                </tr>
              ) : (
                accountsUI.map((a, index) => (
                  <tr
                    key={a.id}
                    className="data-table-row border-b border-border last:border-0 fade-in"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <td className="px-4 py-4">
                      <span className="font-mono text-sm font-medium text-foreground">{a.id}</span>
                    </td>

                    <td className="px-4 py-4">
                      <RiskBadge level={a.riskLevel} score={score01(a.riskScore100)} size="sm" />
                    </td>

                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded border capitalize ${statusColors[a.status]}`}>
                        {a.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs">
                          <ArrowUpRight className="w-3 h-3 text-risk-high" />
                          <span className="font-mono text-foreground">
                            ₹{Number(a.totalSent ?? 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <ArrowDownLeft className="w-3 h-3 text-success" />
                          <span className="font-mono text-muted-foreground">
                            ₹{Number(a.totalReceived ?? 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-sm text-foreground">
                        {a.transactionCount ?? "—"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-sm text-foreground">
                        {a.connections ?? "—"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {a.patterns.length > 0 ? (
                          a.patterns.map((p) => (
                            <span
                              key={p}
                              className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded border border-primary/20"
                            >
                              {p}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-xs text-muted-foreground">{a.lastActivity ?? "—"}</span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1.5 rounded hover:bg-muted transition-colors"
                          onClick={() => console.log("View", a.id)}
                          title="View details"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          className="p-1.5 rounded hover:bg-muted transition-colors"
                          onClick={() => console.log("More", a.id)}
                          title="More"
                        >
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
