// import { 
//   FileText, 
//   Download, 
//   Calendar,
//   Filter,
//   Eye,
//   Share,
//   Clock
// } from "lucide-react";
// import { RiskBadge } from "@/components/dashboard/RiskBadge";

// interface Report {
//   id: string;
//   title: string;
//   type: "investigation" | "summary" | "str" | "audit";
//   status: "draft" | "pending" | "submitted" | "approved";
//   createdAt: string;
//   updatedAt: string;
//   accounts: string[];
//   riskLevel: "high" | "medium" | "low";
//   assignee: string;
// }

// const mockReports: Report[] = [
//   {
//     id: "RPT-001",
//     title: "Smurfing Investigation - ACC-7821",
//     type: "investigation",
//     status: "pending",
//     createdAt: "2024-01-15",
//     updatedAt: "2 hours ago",
//     accounts: ["ACC-7821", "ACC-3456", "ACC-9012"],
//     riskLevel: "high",
//     assignee: "Analyst 1",
//   },
//   {
//     id: "RPT-002",
//     title: "STR Filing - Multiple Accounts",
//     type: "str",
//     status: "draft",
//     createdAt: "2024-01-14",
//     updatedAt: "5 hours ago",
//     accounts: ["ACC-7821"],
//     riskLevel: "high",
//     assignee: "Compliance Officer",
//   },
//   {
//     id: "RPT-003",
//     title: "Weekly Summary - Week 2",
//     type: "summary",
//     status: "approved",
//     createdAt: "2024-01-13",
//     updatedAt: "1 day ago",
//     accounts: [],
//     riskLevel: "medium",
//     assignee: "System",
//   },
//   {
//     id: "RPT-004",
//     title: "Layering Pattern Analysis",
//     type: "investigation",
//     status: "submitted",
//     createdAt: "2024-01-12",
//     updatedAt: "2 days ago",
//     accounts: ["ACC-3456", "ACC-5678"],
//     riskLevel: "medium",
//     assignee: "Analyst 2",
//   },
// ];

// const typeLabels = {
//   investigation: { label: "Investigation", color: "bg-primary/10 text-primary" },
//   summary: { label: "Summary", color: "bg-muted text-muted-foreground" },
//   str: { label: "STR", color: "bg-risk-high/10 text-risk-high" },
//   audit: { label: "Audit", color: "bg-risk-medium/10 text-risk-medium" },
// };

// const statusLabels = {
//   draft: { label: "Draft", color: "bg-muted text-muted-foreground border-border" },
//   pending: { label: "Pending Review", color: "bg-risk-medium/10 text-risk-medium border-risk-medium/20" },
//   submitted: { label: "Submitted", color: "bg-primary/10 text-primary border-primary/20" },
//   approved: { label: "Approved", color: "bg-success/10 text-success border-success/20" },
// };

// export default function Reports() {
//   return (
//     <div className="min-h-screen p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
//             <FileText className="w-6 h-6 text-primary" />
//             Investigation Reports
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Case documentation and regulatory filings
//           </p>
//         </div>
//         <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
//           <FileText className="w-4 h-4" />
//           New Report
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
//         <div className="flex items-center gap-2">
//           <Filter className="w-4 h-4 text-muted-foreground" />
//           <select className="px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none">
//             <option>All Types</option>
//             <option>Investigation</option>
//             <option>STR</option>
//             <option>Summary</option>
//           </select>
//         </div>
//         <div className="flex items-center gap-2">
//           <Calendar className="w-4 h-4 text-muted-foreground" />
//           <select className="px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none">
//             <option>Last 7 days</option>
//             <option>Last 30 days</option>
//             <option>Last 90 days</option>
//           </select>
//         </div>
//         <span className="ml-auto text-sm text-muted-foreground">
//           {mockReports.length} reports
//         </span>
//       </div>

//       {/* Reports Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         {mockReports.map((report, index) => (
//           <div
//             key={report.id}
//             className="bg-card border border-border rounded-lg p-5 hover:border-primary/30 transition-colors cursor-pointer fade-in"
//             style={{ animationDelay: `${index * 50}ms` }}
//           >
//             <div className="flex items-start justify-between mb-3">
//               <div className="flex items-center gap-2">
//                 <span className="font-mono text-xs text-muted-foreground">{report.id}</span>
//                 <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeLabels[report.type].color}`}>
//                   {typeLabels[report.type].label}
//                 </span>
//               </div>
//               <RiskBadge level={report.riskLevel} size="sm" />
//             </div>

//             <h3 className="text-base font-medium text-foreground mb-2">
//               {report.title}
//             </h3>

//             <div className="flex flex-wrap gap-2 mb-4">
//               {report.accounts.map(acc => (
//                 <span key={acc} className="font-mono text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded">
//                   {acc}
//                 </span>
//               ))}
//               {report.accounts.length === 0 && (
//                 <span className="text-xs text-muted-foreground">All accounts</span>
//               )}
//             </div>

//             <div className="flex items-center justify-between pt-3 border-t border-border">
//               <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                 <span className={`px-2 py-0.5 font-medium rounded border ${statusLabels[report.status].color}`}>
//                   {statusLabels[report.status].label}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <Clock className="w-3 h-3" />
//                   {report.updatedAt}
//                 </span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
//                   <Eye className="w-4 h-4 text-muted-foreground" />
//                 </button>
//                 <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
//                   <Download className="w-4 h-4 text-muted-foreground" />
//                 </button>
//                 <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
//                   <Share className="w-4 h-4 text-muted-foreground" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }






////////////////////////////////////////////////////////////////////////////////////

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
//   FileText,
//   Download,
//   Calendar,
//   Filter,
//   Eye,
//   Share,
//   Clock,
// } from "lucide-react";
// import { RiskBadge } from "@/components/dashboard/RiskBadge";
// import { apiGet } from "@/lib/api";

// type RiskBand = "HIGH" | "MEDIUM" | "LOW";
// type RiskLevelUI = "high" | "medium" | "low";

// type CaseListItem = {
//   account_id: string;
//   risk_score: number;
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
//     risk?: { final_score?: number; band?: RiskBand };
//     patterns_detected?: any[];
//     graph_evidence?: {
//       last_activity?: string; // optional if you add it
//     };
//     account_metrics?: {
//       last_activity?: string; // optional if you add it
//     };
//   };
// };

// type ReportType = "investigation" | "summary" | "str" | "audit";
// type ReportStatus = "draft" | "pending" | "submitted" | "approved";

// interface ReportUI {
//   id: string;
//   title: string;
//   type: ReportType;
//   status: ReportStatus;
//   createdAt: string;   // ISO or YYYY-MM-DD
//   updatedAt: string;   // relative-ish string for UI
//   accounts: string[];
//   riskLevel: RiskLevelUI;
//   assignee: string;
// }

// const typeLabels: Record<ReportType, { label: string; color: string }> = {
//   investigation: { label: "Investigation", color: "bg-primary/10 text-primary" },
//   summary: { label: "Summary", color: "bg-muted text-muted-foreground" },
//   str: { label: "STR", color: "bg-risk-high/10 text-risk-high" },
//   audit: { label: "Audit", color: "bg-risk-medium/10 text-risk-medium" },
// };

// const statusLabels: Record<ReportStatus, { label: string; color: string }> = {
//   draft: { label: "Draft", color: "bg-muted text-muted-foreground border-border" },
//   pending: { label: "Pending Review", color: "bg-risk-medium/10 text-risk-medium border-risk-medium/20" },
//   submitted: { label: "Submitted", color: "bg-primary/10 text-primary border-primary/20" },
//   approved: { label: "Approved", color: "bg-success/10 text-success border-success/20" },
// };

// function toRiskLevelUI(band: RiskBand): RiskLevelUI {
//   if (band === "HIGH") return "high";
//   if (band === "MEDIUM") return "medium";
//   return "low";
// }

// function defaultStatusFromBand(band: RiskBand): ReportStatus {
//   // tweak however you want
//   if (band === "HIGH") return "pending";
//   if (band === "MEDIUM") return "submitted";
//   return "approved";
// }

// function normalizeList(payload: any): CaseListItem[] {
//   if (Array.isArray(payload)) return payload;
//   if (payload && typeof payload === "object") {
//     const maybe =
//       payload.items ?? payload.rows ?? payload.data ?? payload.accounts ?? payload.results;
//     if (Array.isArray(maybe)) return maybe;
//   }
//   return [];
// }

// function formatRelative(value?: string): string {
//   if (!value) return "—";
//   if (value.includes("ago")) return value;

//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return value;

//   const diffMs = Date.now() - d.getTime();
//   const diffMin = Math.floor(diffMs / 60000);
//   if (diffMin < 1) return "Just now";
//   if (diffMin < 60) return `${diffMin} min ago`;
//   const diffHr = Math.floor(diffMin / 60);
//   if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
//   const diffDay = Math.floor(diffHr / 24);
//   return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
// }

// function buildTitle(acc: string, patterns?: string[]) {
//   const p = patterns?.[0];
//   if (p) return `${p} Investigation - ${acc}`;
//   return `Investigation Report - ${acc}`;
// }

// export default function Reports() {
//   const [filterType, setFilterType] = useState<"all" | "investigation" | "str" | "summary">("all");
//   const [filterRange, setFilterRange] = useState<"7" | "30" | "90">("7");

//   const [cases, setCases] = useState<CaseListItem[]>([]);
//   const [details, setDetails] = useState<Record<string, { updatedAt?: string }>>({});
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

//   async function fetchCases() {
//     try {
//       setErr(null);
//       setLoading(true);

//       const params = new URLSearchParams();
//       params.set("top_n", "200");
//       params.set("include_patterns", "true");

//       // We don’t have report types in backend, so filters are mostly UI-only.
//       const raw = await apiGet<CaseListResponse | any>(`/cases?${params.toString()}`);
//       const items = normalizeList(raw);

//       setCases(items);
//     } catch (e: any) {
//       setErr(e?.message ?? "Failed to fetch reports");
//       setCases([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function fetchCaseDetail(accountId: string) {
//     try {
//       const d = await apiGet<CaseDetailResponse>(`/cases/${accountId}`);
//       const last =
//         d?.report?.account_metrics?.last_activity ??
//         d?.report?.graph_evidence?.last_activity;

//       setDetails((prev) => ({
//         ...prev,
//         [accountId]: { updatedAt: formatRelative(last) },
//       }));
//     } catch {
//       // ignore
//     }
//   }

//   useEffect(() => {
//     fetchCases();
//   }, []);

//   // build UI reports
//   const reportsUI: ReportUI[] = useMemo(() => {
//     // NOTE: filterRange is UI-only until backend provides created_at/updated_at.
//     // You can later use actual timestamps to filter by last N days.

//     const base: ReportUI[] = (cases ?? []).map((c, idx) => {
//       const band = c.risk_band;
//       return {
//         id: `RPT-${String(idx + 1).padStart(3, "0")}`,
//         title: buildTitle(c.account_id, c.patterns),
//         type: "investigation",
//         status: defaultStatusFromBand(band),
//         createdAt: new Date().toISOString().slice(0, 10), // fallback until backend gives created time
//         updatedAt: details[c.account_id]?.updatedAt ?? "—",
//         accounts: [c.account_id],
//         riskLevel: toRiskLevelUI(band),
//         assignee: band === "HIGH" ? "Analyst 1" : band === "MEDIUM" ? "Analyst 2" : "System",
//       };
//     });

//     // Type filter (UI-only right now)
//     if (filterType === "all") return base;
//     return base.filter((r) => r.type === filterType);
//   }, [cases, details, filterType, filterRange]);

//   // Lazy-load details for first N items shown
//   useEffect(() => {
//     const top = reportsUI.slice(0, 40);
//     top.forEach((r) => {
//       const acc = r.accounts[0];
//       if (acc && !details[acc]) fetchCaseDetail(acc);
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [reportsUI]);

//   return (
//     <div className="min-h-screen p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
//             <FileText className="w-6 h-6 text-primary" />
//             Investigation Reports
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Case documentation and regulatory filings
//           </p>
//           {err && <p className="text-sm mt-2 text-risk-high">API error: {err}</p>}
//         </div>
//         <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
//           <FileText className="w-4 h-4" />
//           New Report
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
//         <div className="flex items-center gap-2">
//           <Filter className="w-4 h-4 text-muted-foreground" />
//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value as any)}
//             className="px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none"
//           >
//             <option value="all">All Types</option>
//             <option value="investigation">Investigation</option>
//             <option value="str">STR</option>
//             <option value="summary">Summary</option>
//           </select>
//         </div>

//         <div className="flex items-center gap-2">
//           <Calendar className="w-4 h-4 text-muted-foreground" />
//           <select
//             value={filterRange}
//             onChange={(e) => setFilterRange(e.target.value as any)}
//             className="px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none"
//           >
//             <option value="7">Last 7 days</option>
//             <option value="30">Last 30 days</option>
//             <option value="90">Last 90 days</option>
//           </select>
//         </div>

//         <span className="ml-auto text-sm text-muted-foreground">
//           {loading ? "Loading…" : `${reportsUI.length} reports`}
//         </span>
//       </div>

//       {/* Reports Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         {loading ? (
//           <div className="bg-card border border-border rounded-lg p-5 text-sm text-muted-foreground">
//             Loading reports from backend…
//           </div>
//         ) : reportsUI.length === 0 ? (
//           <div className="bg-card border border-border rounded-lg p-5 text-sm text-muted-foreground">
//             No reports found.
//           </div>
//         ) : (
//           reportsUI.map((report, index) => (
//             <div
//               key={report.id}
//               className="bg-card border border-border rounded-lg p-5 hover:border-primary/30 transition-colors cursor-pointer fade-in"
//               style={{ animationDelay: `${index * 50}ms` }}
//             >
//               <div className="flex items-start justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <span className="font-mono text-xs text-muted-foreground">{report.id}</span>
//                   <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeLabels[report.type].color}`}>
//                     {typeLabels[report.type].label}
//                   </span>
//                 </div>
//                 <RiskBadge level={report.riskLevel} size="sm" />
//               </div>

//               <h3 className="text-base font-medium text-foreground mb-2">
//                 {report.title}
//               </h3>

//               <div className="flex flex-wrap gap-2 mb-4">
//                 {report.accounts.map((acc) => (
//                   <span key={acc} className="font-mono text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded">
//                     {acc}
//                   </span>
//                 ))}
//                 {report.accounts.length === 0 && (
//                   <span className="text-xs text-muted-foreground">All accounts</span>
//                 )}
//               </div>

//               <div className="flex items-center justify-between pt-3 border-t border-border">
//                 <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                   <span className={`px-2 py-0.5 font-medium rounded border ${statusLabels[report.status].color}`}>
//                     {statusLabels[report.status].label}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <Clock className="w-3 h-3" />
//                     {report.updatedAt}
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-1">
//                   <button
//                     className="p-1.5 hover:bg-muted rounded-lg transition-colors"
//                     title="View"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       console.log("View report for", report.accounts[0]);
//                     }}
//                   >
//                     <Eye className="w-4 h-4 text-muted-foreground" />
//                   </button>

//                   <button
//                     className="p-1.5 hover:bg-muted rounded-lg transition-colors"
//                     title="Download"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       // Later: call backend endpoint to download PDF/JSON.
//                       console.log("Download", report.id);
//                     }}
//                   >
//                     <Download className="w-4 h-4 text-muted-foreground" />
//                   </button>

//                   <button
//                     className="p-1.5 hover:bg-muted rounded-lg transition-colors"
//                     title="Share"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       console.log("Share", report.id);
//                     }}
//                   >
//                     <Share className="w-4 h-4 text-muted-foreground" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

////////////////////////////////////////////////////////////////////////


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
//   FileText,
//   Download,
//   Calendar,
//   Filter,
//   Eye,
//   Share,
//   Clock,
// } from "lucide-react";
// import { RiskBadge } from "@/components/dashboard/RiskBadge";
// import { apiGet } from "@/lib/api";

// type RiskBand = "HIGH" | "MEDIUM" | "LOW";
// type RiskLevelUI = "high" | "medium" | "low";

// type ReportType = "investigation" | "summary" | "str" | "audit";
// type ReportStatus = "draft" | "pending" | "submitted" | "approved";

// // -------- backend shapes --------
// type CaseListItem = {
//   account_id: string;
//   risk_score: number; // 0-100
//   risk_band: RiskBand;
//   patterns?: string[];
// };

// type CasesListResponse = {
//   total: number;
//   returned: number;
//   items: CaseListItem[];
// };

// // rag endpoint returns: { total, returned, items: [...] }
// type RagItem = {
//   account_id?: string;
//   // everything else is flexible, so keep it permissive
//   [k: string]: any;
// };

// type RagResponse = {
//   total: number;
//   returned: number;
//   items: RagItem[];
// };

// type CaseDetailResponse = {
//   report: {
//     account_id: string;
//     graph_evidence?: {
//       last_activity?: string;
//     };
//     account_metrics?: {
//       last_activity?: string;
//     };
//   };
// };

// // -------- UI shape --------
// interface ReportUI {
//   id: string;
//   title: string;
//   type: ReportType;
//   status: ReportStatus;
//   createdAt: string; // ISO (or date string)
//   updatedAt: string; // relative-ish string
//   accounts: string[];
//   riskLevel: RiskLevelUI;
//   assignee: string;
//   // optional payload for actions
//   source?: {
//     accountId?: string;
//     rag?: RagItem;
//   };
// }

// const typeLabels: Record<ReportType, { label: string; color: string }> = {
//   investigation: { label: "Investigation", color: "bg-primary/10 text-primary" },
//   summary: { label: "Summary", color: "bg-muted text-muted-foreground" },
//   str: { label: "STR", color: "bg-risk-high/10 text-risk-high" },
//   audit: { label: "Audit", color: "bg-risk-medium/10 text-risk-medium" },
// };

// const statusLabels: Record<ReportStatus, { label: string; color: string }> = {
//   draft: { label: "Draft", color: "bg-muted text-muted-foreground border-border" },
//   pending: { label: "Pending Review", color: "bg-risk-medium/10 text-risk-medium border-risk-medium/20" },
//   submitted: { label: "Submitted", color: "bg-primary/10 text-primary border-primary/20" },
//   approved: { label: "Approved", color: "bg-success/10 text-success border-success/20" },
// };

// function toRiskLevelUI(band: RiskBand): RiskLevelUI {
//   if (band === "HIGH") return "high";
//   if (band === "MEDIUM") return "medium";
//   return "low";
// }

// function formatRelativeTime(value?: string): string {
//   if (!value) return "—";
//   if (value.includes("ago")) return value;

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

// function normalizeItems(payload: any): any[] {
//   if (Array.isArray(payload)) return payload;
//   if (payload && typeof payload === "object") {
//     const maybe = payload.items ?? payload.rows ?? payload.data ?? payload.results;
//     if (Array.isArray(maybe)) return maybe;
//   }
//   return [];
// }

// // try to extract account_id from rag item even if nested
// function getRagAccountId(r: RagItem): string | null {
//   if (typeof r?.account_id === "string") return r.account_id;
//   if (typeof r?.accountId === "string") return r.accountId;
//   if (typeof r?.report?.account_id === "string") return r.report.account_id;
//   return null;
// }

// export default function Reports() {
//   const [filterType, setFilterType] = useState<"all" | "investigation" | "str" | "summary" | "audit">("all");
//   const [filterRange, setFilterRange] = useState<"7" | "30" | "90">("7");

//   const [cases, setCases] = useState<CaseListItem[]>([]);
//   const [ragItems, setRagItems] = useState<RagItem[]>([]);
//   const [lastActivityMap, setLastActivityMap] = useState<Record<string, string>>({});

//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

//   // Load /cases and /rag
//   async function loadData() {
//     try {
//       setErr(null);
//       setLoading(true);

//       const [casesRes, ragRes] = await Promise.all([
//         apiGet<CasesListResponse | any>(`/cases?top_n=100&include_patterns=true`),
//         apiGet<RagResponse | any>(`/rag?top_n=200`),
//       ]);

//       const caseItems = normalizeItems(casesRes) as CaseListItem[];
//       const rag = normalizeItems(ragRes) as RagItem[];

//       setCases(caseItems);
//       setRagItems(rag);
//     } catch (e: any) {
//       setErr(e?.message ?? "Failed to load reports data");
//       setCases([]);
//       setRagItems([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadData();
//   }, []);

//   // Lazy fetch last_activity for accounts we show (optional)
//   async function fetchLastActivity(accountId: string) {
//     try {
//       const d = await apiGet<CaseDetailResponse>(`/cases/${accountId}`);
//       const last =
//         d?.report?.graph_evidence?.last_activity ??
//         d?.report?.account_metrics?.last_activity;

//       if (last) {
//         setLastActivityMap((prev) => ({ ...prev, [accountId]: last }));
//       }
//     } catch {
//       // ignore
//     }
//   }

//   // Build reports list
//   const reports: ReportUI[] = useMemo(() => {
//     // 1) Investigations from cases (top risk)
//     const investigationReports: ReportUI[] = (cases ?? []).slice(0, 30).map((c, idx) => {
//       const rid = `RPT-${String(idx + 1).padStart(3, "0")}`;
//       const createdAt = new Date().toISOString().slice(0, 10);

//       const patterns = Array.isArray(c.patterns) ? c.patterns : [];
//       const topPattern = patterns[0];

//       return {
//         id: rid,
//         title: topPattern
//           ? `${topPattern} Investigation - ${c.account_id}`
//           : `Investigation - ${c.account_id}`,
//         type: "investigation",
//         status: c.risk_band === "HIGH" ? "pending" : "draft",
//         createdAt,
//         updatedAt: formatRelativeTime(lastActivityMap[c.account_id]),
//         accounts: [c.account_id],
//         riskLevel: toRiskLevelUI(c.risk_band),
//         assignee: c.risk_band === "HIGH" ? "Analyst 1" : "Analyst 2",
//         source: { accountId: c.account_id },
//       };
//     });

//     // 2) STR/Audit from rag items
//     // One report per account_id that has rag output
//     const ragByAcc = new Map<string, RagItem[]>();
//     for (const r of ragItems ?? []) {
//       const acc = getRagAccountId(r);
//       if (!acc) continue;
//       const prev = ragByAcc.get(acc) ?? [];
//       prev.push(r);
//       ragByAcc.set(acc, prev);
//     }

//     const ragReports: ReportUI[] = Array.from(ragByAcc.entries()).slice(0, 40).map(([acc, items], idx) => {
//       const rid = `RAG-${String(idx + 1).padStart(3, "0")}`;

//       // simple heuristic: if text mentions "STR" or "suspicious", treat as STR else Audit
//       const blob = JSON.stringify(items).toLowerCase();
//       const isStr = blob.includes("str") || blob.includes("suspicious transaction") || blob.includes("suspicious");

//       return {
//         id: rid,
//         title: isStr ? `STR Draft - ${acc}` : `Compliance Audit Notes - ${acc}`,
//         type: isStr ? "str" : "audit",
//         status: "draft",
//         createdAt: new Date().toISOString().slice(0, 10),
//         updatedAt: formatRelativeTime(lastActivityMap[acc]),
//         accounts: [acc],
//         riskLevel: "high", // conservative for compliance docs; you can tighten via /cases lookup if you want
//         assignee: "Compliance Officer",
//         source: { accountId: acc, rag: items[0] },
//       };
//     });

//     // 3) Optional: add one global summary report
//     const summary: ReportUI = {
//       id: "SUM-001",
//       title: "System Summary - Recent Activity",
//       type: "summary",
//       status: "approved",
//       createdAt: new Date().toISOString().slice(0, 10),
//       updatedAt: "—",
//       accounts: [],
//       riskLevel: "medium",
//       assignee: "System",
//     };

//     return [summary, ...investigationReports, ...ragReports];
//   }, [cases, ragItems, lastActivityMap]);

//   // Apply filters
//   const filteredReports = useMemo(() => {
//     let list = reports;

//     if (filterType !== "all") {
//       list = list.filter((r) => r.type === filterType);
//     }

//     // date-range filter (based on createdAt)
//     const days = Number(filterRange);
//     const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

//     list = list.filter((r) => {
//       const d = new Date(r.createdAt);
//       if (Number.isNaN(d.getTime())) return true;
//       return d.getTime() >= cutoff;
//     });

//     return list;
//   }, [reports, filterType, filterRange]);

//   // Lazy-load lastActivity for accounts visible in the grid
//   useEffect(() => {
//     const visibleAccounts = new Set<string>();
//     filteredReports.forEach((r) => r.accounts.forEach((a) => visibleAccounts.add(a)));

//     Array.from(visibleAccounts)
//       .slice(0, 25)
//       .forEach((acc) => {
//         if (!acc) return;
//         if (!lastActivityMap[acc]) fetchLastActivity(acc);
//       });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filteredReports]);

//   function onView(report: ReportUI) {
//     // later: route to /cases/:id or open a modal
//     console.log("View report", report);
//   }

//   function onDownload(report: ReportUI) {
//     // quick export JSON (client-side)
//     const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${report.id}.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//   }

//   return (
//     <div className="min-h-screen p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
//             <FileText className="w-6 h-6 text-primary" />
//             Investigation Reports
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Case documentation and regulatory filings
//           </p>
//           {err && <p className="text-sm mt-2 text-risk-high">API error: {err}</p>}
//         </div>
//         <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
//           <FileText className="w-4 h-4" />
//           New Report
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
//         <div className="flex items-center gap-2">
//           <Filter className="w-4 h-4 text-muted-foreground" />
//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value as any)}
//             className="px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none"
//           >
//             <option value="all">All Types</option>
//             <option value="investigation">Investigation</option>
//             <option value="str">STR</option>
//             <option value="summary">Summary</option>
//             <option value="audit">Audit</option>
//           </select>
//         </div>

//         <div className="flex items-center gap-2">
//           <Calendar className="w-4 h-4 text-muted-foreground" />
//           <select
//             value={filterRange}
//             onChange={(e) => setFilterRange(e.target.value as any)}
//             className="px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none"
//           >
//             <option value="7">Last 7 days</option>
//             <option value="30">Last 30 days</option>
//             <option value="90">Last 90 days</option>
//           </select>
//         </div>

//         <span className="ml-auto text-sm text-muted-foreground">
//           {loading ? "Loading…" : `${filteredReports.length} reports`}
//         </span>
//       </div>

//       {/* Reports Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         {loading ? (
//           <div className="bg-card border border-border rounded-lg p-5 text-sm text-muted-foreground">
//             Loading reports from backend…
//           </div>
//         ) : filteredReports.length === 0 ? (
//           <div className="bg-card border border-border rounded-lg p-5 text-sm text-muted-foreground">
//             No reports found.
//           </div>
//         ) : (
//           filteredReports.map((report, index) => (
//             <div
//               key={report.id}
//               className="bg-card border border-border rounded-lg p-5 hover:border-primary/30 transition-colors cursor-pointer fade-in"
//               style={{ animationDelay: `${index * 50}ms` }}
//               onClick={() => onView(report)}
//             >
//               <div className="flex items-start justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <span className="font-mono text-xs text-muted-foreground">{report.id}</span>
//                   <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeLabels[report.type].color}`}>
//                     {typeLabels[report.type].label}
//                   </span>
//                 </div>
//                 <RiskBadge level={report.riskLevel} size="sm" />
//               </div>

//               <h3 className="text-base font-medium text-foreground mb-2">
//                 {report.title}
//               </h3>

//               <div className="flex flex-wrap gap-2 mb-4">
//                 {report.accounts.map((acc) => (
//                   <span key={acc} className="font-mono text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded">
//                     {acc}
//                   </span>
//                 ))}
//                 {report.accounts.length === 0 && (
//                   <span className="text-xs text-muted-foreground">All accounts</span>
//                 )}
//               </div>

//               <div className="flex items-center justify-between pt-3 border-t border-border">
//                 <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                   <span className={`px-2 py-0.5 font-medium rounded border ${statusLabels[report.status].color}`}>
//                     {statusLabels[report.status].label}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <Clock className="w-3 h-3" />
//                     {report.updatedAt}
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
//                   <button
//                     className="p-1.5 hover:bg-muted rounded-lg transition-colors"
//                     onClick={() => onView(report)}
//                     title="View"
//                   >
//                     <Eye className="w-4 h-4 text-muted-foreground" />
//                   </button>
//                   <button
//                     className="p-1.5 hover:bg-muted rounded-lg transition-colors"
//                     onClick={() => onDownload(report)}
//                     title="Download"
//                   >
//                     <Download className="w-4 h-4 text-muted-foreground" />
//                   </button>
//                   <button
//                     className="p-1.5 hover:bg-muted rounded-lg transition-colors"
//                     onClick={() => console.log("Share", report.id)}
//                     title="Share"
//                   >
//                     <Share className="w-4 h-4 text-muted-foreground" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }




////////////////////////////////////////////////////////////////////////



// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
//   FileText,
//   Download,
//   Calendar,
//   Filter,
//   Eye,
//   Share,
//   Clock,
//   AlertTriangle,
// } from "lucide-react";
// import { RiskBadge } from "@/components/dashboard/RiskBadge";
// import { apiGet } from "@/lib/api";

// /** ---------- Types (match your backend /rag output) ---------- */
// type RiskBand = "HIGH" | "MEDIUM" | "LOW";
// type RiskLevelUI = "high" | "medium" | "low";

// type RagItem = {
//   account_id?: string;
//   risk?: {
//     account_id?: string;
//     risk_score?: number;
//     risk_band?: RiskBand;
//     components?: Record<string, number>;
//   };
//   retrieval?: Array<{
//     score?: number;
//     text?: string;
//     source?: string;
//     metadata?: {
//       source_path?: string;
//       category?: string;
//       doc_id?: string;
//     };
//   }>;
//   report?: string; // big narrative + checklist
// };

// type RagResponse = {
//   total: number;
//   returned: number;
//   items: RagItem[];
// };

// /** ---------- Reports UI model ---------- */
// type ReportType = "investigation" | "summary" | "str" | "audit";
// type ReportStatus = "draft" | "pending" | "submitted" | "approved";

// type ReportUI = {
//   id: string;
//   title: string;
//   type: ReportType;
//   status: ReportStatus;
//   createdAt: string; // YYYY-MM-DD
//   updatedAt: string; // relative-ish string
//   accounts: string[];
//   riskLevel: RiskLevelUI;
//   assignee: string;

//   // keep source for view/export (optional)
//   source?: {
//     accountId?: string;
//     rag?: RagItem;
//   };
// };

// /** ---------- UI labels ---------- */
// const typeLabels: Record<ReportType, { label: string; color: string }> = {
//   investigation: { label: "Investigation", color: "bg-primary/10 text-primary" },
//   summary: { label: "Summary", color: "bg-muted text-muted-foreground" },
//   str: { label: "STR", color: "bg-risk-high/10 text-risk-high" },
//   audit: { label: "Audit", color: "bg-risk-medium/10 text-risk-medium" },
// };

// const statusLabels: Record<ReportStatus, { label: string; color: string }> = {
//   draft: { label: "Draft", color: "bg-muted text-muted-foreground border-border" },
//   pending: { label: "Pending Review", color: "bg-risk-medium/10 text-risk-medium border-risk-medium/20" },
//   submitted: { label: "Submitted", color: "bg-primary/10 text-primary border-primary/20" },
//   approved: { label: "Approved", color: "bg-success/10 text-success border-success/20" },
// };

// /** ---------- Helpers ---------- */
// function toRiskLevelUI(band?: RiskBand): RiskLevelUI {
//   if (band === "HIGH") return "high";
//   if (band === "MEDIUM") return "medium";
//   return "low";
// }

// function hasFIUEscalation(text: string): boolean {
//   const t = (text || "").toLowerCase();
//   return t.includes("financial intelligence unit") || t.includes("fiu");
// }

// function formatRelativeTimeFromISO(iso?: string | null): string {
//   if (!iso) return "—";
//   const d = new Date(iso);
//   if (Number.isNaN(d.getTime())) return "—";

//   const diffMs = Date.now() - d.getTime();
//   const diffMin = Math.floor(diffMs / 60000);

//   if (diffMin < 1) return "Just now";
//   if (diffMin < 60) return `${diffMin} min ago`;

//   const diffHr = Math.floor(diffMin / 60);
//   if (diffHr < 24) return `${diffHr} hr ago`;

//   const diffDay = Math.floor(diffHr / 24);
//   return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
// }

// /**
//  * Optional: pull "last_activity" from case report to show updatedAt.
//  * We keep it SAFE: if the field isn't present, we show "—".
//  */
// type CaseDetailResponse = {
//   report?: {
//     account_id?: string;
//     account_metrics?: { last_activity?: string };
//     last_activity?: string;
//     timeline_evidence?: { last_activity?: string };
//   };
// };

// async function fetchLastActivity(accountId: string): Promise<string | null> {
//   try {
//     const d = await apiGet<CaseDetailResponse>(`/cases/${accountId}`);
//     const iso =
//       d?.report?.account_metrics?.last_activity ??
//       d?.report?.last_activity ??
//       d?.report?.timeline_evidence?.last_activity ??
//       null;
//     return iso;
//   } catch {
//     return null;
//   }
// }

// /** ---------- Component ---------- */
// export default function Reports() {
//   const [filterType, setFilterType] = useState<"all" | ReportType>("all");
//   const [filterWindow, setFilterWindow] = useState<"7" | "30" | "90">("30");
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

//   const [ragItems, setRagItems] = useState<RagItem[]>([]);
//   const [lastActivityMap, setLastActivityMap] = useState<Record<string, string | null>>({});

//   // 1) Load RAG outputs
//   useEffect(() => {
//     (async () => {
//       try {
//         setErr(null);
//         setLoading(true);

//         // You can pass ?top_n=... if you want
//         const raw = await apiGet<RagResponse | any>(`/rag?top_n=500`);
//         const items: RagItem[] = Array.isArray(raw?.items) ? raw.items : Array.isArray(raw) ? raw : [];
//         setRagItems(items);
//       } catch (e: any) {
//         setErr(e?.message ?? "Failed to load /rag");
//         setRagItems([]);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // 2) Fetch last activity for accounts that appear in rag
//   useEffect(() => {
//     const accounts = Array.from(
//       new Set((ragItems ?? []).map((x) => x.account_id).filter(Boolean) as string[])
//     );

//     // avoid refetching
//     const toFetch = accounts.filter((acc) => !(acc in lastActivityMap));

//     if (toFetch.length === 0) return;

//     // limit concurrency a bit (simple)
//     (async () => {
//       const next: Record<string, string | null> = {};
//       for (const acc of toFetch.slice(0, 50)) {
//         next[acc] = await fetchLastActivity(acc);
//       }
//       setLastActivityMap((prev) => ({ ...prev, ...next }));
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [ragItems]);

//   // 3) Build Reports list from rag items (Investigation + STR draft if FIU escalation)
//   const reports: ReportUI[] = useMemo(() => {
//     const out: ReportUI[] = [];
//     const today = new Date().toISOString().slice(0, 10);

//     for (const item of ragItems ?? []) {
//       const acc = item?.account_id;
//       if (!acc) continue;

//       const reportText = item?.report ?? "";
//       const band = item?.risk?.risk_band ?? "MEDIUM";
//       const updatedAt = formatRelativeTimeFromISO(lastActivityMap[acc]);

//       // Investigation report (always)
//       out.push({
//         id: `RPT-INV-${acc}`,
//         title: `Investigation Report – ${acc}`,
//         type: "investigation",
//         status: "pending",
//         createdAt: today,
//         updatedAt,
//         accounts: [acc],
//         riskLevel: toRiskLevelUI(band),
//         assignee: "Analyst 1",
//         source: { accountId: acc, rag: item },
//       });

//       // STR draft if FIU escalation exists
//       if (hasFIUEscalation(reportText)) {
//         out.push({
//           id: `RPT-STR-${acc}`,
//           title: `STR Draft – ${acc}`,
//           type: "str",
//           status: "draft",
//           createdAt: today,
//           updatedAt,
//           accounts: [acc],
//           riskLevel: "high",
//           assignee: "Compliance Officer",
//           source: { accountId: acc, rag: item },
//         });
//       }
//     }

//     // Sort: STR first, then higher risk, then most recent-ish (we only have relative text)
//     const riskRank: Record<RiskLevelUI, number> = { high: 3, medium: 2, low: 1 };
//     const typeRank: Record<ReportType, number> = { str: 4, investigation: 3, audit: 2, summary: 1 };

//     return out.sort((a, b) => {
//       const t = (typeRank[b.type] ?? 0) - (typeRank[a.type] ?? 0);
//       if (t !== 0) return t;
//       const r = (riskRank[b.riskLevel] ?? 0) - (riskRank[a.riskLevel] ?? 0);
//       if (r !== 0) return r;
//       return a.id.localeCompare(b.id);
//     });
//   }, [ragItems, lastActivityMap]);

//   // 4) Filter by type + time window (simple window filter by createdAt = today; your real filter can evolve)
//   const filtered = useMemo(() => {
//     let list = reports;

//     if (filterType !== "all") {
//       list = list.filter((r) => r.type === filterType);
//     }

//     // Window filter: since createdAt currently "today", this is mostly placeholder.
//     // Keep it here so UI is wired; once you store true createdAt, it will work automatically.
//     const days = Number(filterWindow);
//     const now = new Date();
//     const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

//     list = list.filter((r) => {
//       const d = new Date(r.createdAt);
//       if (Number.isNaN(d.getTime())) return true;
//       return d >= cutoff;
//     });

//     return list;
//   }, [reports, filterType, filterWindow]);

//   function handleView(r: ReportUI) {
//     // You can route to a details page:
//     // router.push(`/reports/${r.id}`)
//     // For now, log the source payload.
//     console.log("VIEW REPORT", r.id, r.source);
//   }

//   function handleDownload(r: ReportUI) {
//     // Simple JSON download for now (deterministic + useful)
//     const payload = r.source?.rag ?? r;
//     const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${r.id}.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//   }

//   function handleShare(r: ReportUI) {
//     // placeholder
//     navigator.clipboard?.writeText(r.id).catch(() => {});
//   }

//   return (
//     <div className="min-h-screen p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
//             <FileText className="w-6 h-6 text-primary" />
//             Investigation Reports
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Case documentation and regulatory filings (powered by /rag)
//           </p>
//           {err && (
//             <p className="text-sm mt-2 text-risk-high flex items-center gap-2">
//               <AlertTriangle className="w-4 h-4" /> API error: {err}
//             </p>
//           )}
//         </div>

//         <button
//           className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
//           onClick={() => console.log("New Report")}
//         >
//           <FileText className="w-4 h-4" />
//           New Report
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
//         <div className="flex items-center gap-2">
//           <Filter className="w-4 h-4 text-muted-foreground" />
//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value as any)}
//             className="px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none"
//           >
//             <option value="all">All Types</option>
//             <option value="investigation">Investigation</option>
//             <option value="str">STR</option>
//             <option value="summary">Summary</option>
//             <option value="audit">Audit</option>
//           </select>
//         </div>

//         <div className="flex items-center gap-2">
//           <Calendar className="w-4 h-4 text-muted-foreground" />
//           <select
//             value={filterWindow}
//             onChange={(e) => setFilterWindow(e.target.value as any)}
//             className="px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none"
//           >
//             <option value="7">Last 7 days</option>
//             <option value="30">Last 30 days</option>
//             <option value="90">Last 90 days</option>
//           </select>
//         </div>

//         <span className="ml-auto text-sm text-muted-foreground">
//           {loading ? "Loading..." : `${filtered.length} reports`}
//         </span>
//       </div>

//       {/* Reports Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         {loading ? (
//           <div className="bg-card border border-border rounded-lg p-5 text-sm text-muted-foreground">
//             Loading reports from backend…
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="bg-card border border-border rounded-lg p-5 text-sm text-muted-foreground">
//             No reports found.
//           </div>
//         ) : (
//           filtered.map((report, index) => (
//             <div
//               key={report.id}
//               className="bg-card border border-border rounded-lg p-5 hover:border-primary/30 transition-colors cursor-pointer fade-in"
//               style={{ animationDelay: `${index * 50}ms` }}
//               onClick={() => handleView(report)}
//             >
//               <div className="flex items-start justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <span className="font-mono text-xs text-muted-foreground">{report.id}</span>
//                   <span
//                     className={`px-2 py-0.5 text-xs font-medium rounded ${typeLabels[report.type].color}`}
//                   >
//                     {typeLabels[report.type].label}
//                   </span>
//                 </div>
//                 <RiskBadge level={report.riskLevel} size="sm" />
//               </div>

//               <h3 className="text-base font-medium text-foreground mb-2">{report.title}</h3>

//               <div className="flex flex-wrap gap-2 mb-4">
//                 {report.accounts.map((acc) => (
//                   <span
//                     key={acc}
//                     className="font-mono text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded"
//                   >
//                     {acc}
//                   </span>
//                 ))}
//                 {report.accounts.length === 0 && (
//                   <span className="text-xs text-muted-foreground">All accounts</span>
//                 )}
//               </div>

//               <div className="flex items-center justify-between pt-3 border-t border-border">
//                 <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                   <span
//                     className={`px-2 py-0.5 font-medium rounded border ${statusLabels[report.status].color}`}
//                   >
//                     {statusLabels[report.status].label}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <Clock className="w-3 h-3" />
//                     {report.updatedAt}
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-1">
//                   <button
//                     className="p-1.5 hover:bg-muted rounded-lg transition-colors"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleView(report);
//                     }}
//                     title="View"
//                   >
//                     <Eye className="w-4 h-4 text-muted-foreground" />
//                   </button>

//                   <button
//                     className="p-1.5 hover:bg-muted rounded-lg transition-colors"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDownload(report);
//                     }}
//                     title="Download JSON"
//                   >
//                     <Download className="w-4 h-4 text-muted-foreground" />
//                   </button>

//                   <button
//                     className="p-1.5 hover:bg-muted rounded-lg transition-colors"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleShare(report);
//                     }}
//                     title="Share"
//                   >
//                     <Share className="w-4 h-4 text-muted-foreground" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

///////////////////////////////////////////////////////

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Eye,
  Share,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { apiGet } from "@/lib/api";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const API_BASE =
  typeof window !== "undefined"
    ? (window as any).__API_BASE__ ?? "http://localhost:8000"
    : "http://localhost:8000";


type RiskBand = "HIGH" | "MEDIUM" | "LOW";
type RiskLevelUI = "high" | "medium" | "low";

type RagItem = {
  account_id?: string;
  risk?: { risk_band?: RiskBand };
  report?: string;
};

type RagResponse = { items: RagItem[] };

type ReportUI = {
  id: string;
  title: string;
  accounts: string[];
  riskLevel: RiskLevelUI;
};

function toRiskLevelUI(b?: RiskBand): RiskLevelUI {
  if (b === "HIGH") return "high";
  if (b === "MEDIUM") return "medium";
  return "low";
}

export default function Reports() {
  const [items, setItems] = useState<RagItem[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    apiGet<RagResponse>("/rag")
      .then((r) => setItems(r.items))
      .catch(() => setErr("Failed to load reports"));
  }, []);

  const reports: ReportUI[] = useMemo(
    () =>
      items
        .filter((i) => i.account_id)
        .map((i) => ({
          id: `RPT-${i.account_id}`,
          title: `Investigation Report – ${i.account_id}`,
          accounts: [i.account_id!],
          riskLevel: toRiskLevelUI(i.risk?.risk_band),
        })),
    [items]
  );

  function openPdf(acc: string) {
    window.open(`${API_BASE}/reports/${acc}/pdf`, "_blank");
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <FileText className="w-6 h-6 text-primary" />
        Investigation Reports
      </h1>

      {err && (
        <p className="text-risk-high flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> {err}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {reports.map((r) => (
          <div
            key={r.id}
            className="bg-card border rounded-lg p-5 cursor-pointer hover:border-primary"
            onClick={() => openPdf(r.accounts[0])}
          >
            <div className="flex justify-between mb-2">
              <span className="font-mono text-xs">{r.id}</span>
              <RiskBadge level={r.riskLevel} size="sm" />
            </div>

            <h3 className="font-medium mb-3">{r.title}</h3>

            <div className="flex justify-end gap-2">
              <button onClick={(e) => { e.stopPropagation(); openPdf(r.accounts[0]); }}>
                <Eye className="w-4 h-4" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); openPdf(r.accounts[0]); }}>
                <Download className="w-4 h-4" />
              </button>
              <button onClick={(e) => e.stopPropagation()}>
                <Share className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
