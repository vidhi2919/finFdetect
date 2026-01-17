// import { useState } from "react";
// import { 
//   Clock, 
//   ArrowRight, 
//   Filter, 
//   Play,
//   Pause,
//   SkipBack,
//   SkipForward,
//   AlertCircle,
//   Activity
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface TimelineEvent {
//   id: string;
//   time: string;
//   timestamp: number;
//   type: "transaction" | "pattern" | "alert" | "system";
//   from?: string;
//   to?: string;
//   amount?: number;
//   description: string;
//   risk: "high" | "medium" | "low" | "none";
// }

// const mockTimeline: TimelineEvent[] = [
//   { id: "E001", time: "14:30:00", timestamp: 1, type: "system", description: "Monitoring window started", risk: "none" },
//   { id: "E002", time: "14:31:45", timestamp: 2, type: "transaction", from: "ACC-7821", to: "ACC-3456", amount: 4999, description: "Transfer below threshold", risk: "medium" },
//   { id: "E003", time: "14:31:48", timestamp: 3, type: "transaction", from: "ACC-7821", to: "ACC-9012", amount: 4850, description: "Rapid follow-up transfer", risk: "high" },
//   { id: "E004", time: "14:31:52", timestamp: 4, type: "transaction", from: "ACC-7821", to: "ACC-5678", amount: 4750, description: "Third transfer in sequence", risk: "high" },
//   { id: "E005", time: "14:32:00", timestamp: 5, type: "pattern", description: "Smurfing pattern triggered - 3 sub-threshold transactions in 15 seconds", risk: "high" },
//   { id: "E006", time: "14:32:15", timestamp: 6, type: "transaction", from: "ACC-7821", to: "ACC-2345", amount: 4900, description: "Continued splitting", risk: "high" },
//   { id: "E007", time: "14:33:00", timestamp: 7, type: "transaction", from: "ACC-3456", to: "ACC-8901", amount: 3200, description: "Second-hop transfer detected", risk: "medium" },
//   { id: "E008", time: "14:33:30", timestamp: 8, type: "pattern", description: "Layering behavior detected - funds moving through second hop", risk: "medium" },
//   { id: "E009", time: "14:34:00", timestamp: 9, type: "transaction", from: "ACC-9012", to: "ACC-1234", amount: 4000, description: "Parallel second-hop", risk: "medium" },
//   { id: "E010", time: "14:35:00", timestamp: 10, type: "alert", description: "Investigation case AUTO-CREATED for ACC-7821 - High confidence fraud", risk: "high" },
// ];

// export default function Timeline() {
//   const [playing, setPlaying] = useState(false);
//   const [currentEvent, setCurrentEvent] = useState(0);
//   const [filterRisk, setFilterRisk] = useState<string>("all");

//   const filteredEvents = mockTimeline.filter(event => 
//     filterRisk === "all" || event.risk === filterRisk
//   );

//   const getRiskColor = (risk: string) => {
//     switch (risk) {
//       case "high": return "border-risk-high bg-risk-high/10";
//       case "medium": return "border-risk-medium bg-risk-medium/10";
//       case "low": return "border-risk-low bg-risk-low/10";
//       default: return "border-border bg-muted/30";
//     }
//   };

//   const getEventIcon = (type: string) => {
//     switch (type) {
//       case "transaction": return ArrowRight;
//       case "pattern": return Activity;
//       case "alert": return AlertCircle;
//       default: return Clock;
//     }
//   };

//   return (
//     <div className="min-h-screen p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
//             <Clock className="w-6 h-6 text-primary" />
//             Timeline Reconstruction
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Temporal analysis of transaction sequences and pattern emergence
//           </p>
//         </div>
//       </div>

//       {/* Playback Controls */}
//       <div className="bg-card border border-border rounded-lg p-4">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <button className="p-2 hover:bg-muted rounded-lg transition-colors">
//               <SkipBack className="w-4 h-4 text-muted-foreground" />
//             </button>
//             <button 
//               onClick={() => setPlaying(!playing)}
//               className="p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
//             >
//               {playing ? (
//                 <Pause className="w-5 h-5 text-primary" />
//               ) : (
//                 <Play className="w-5 h-5 text-primary" />
//               )}
//             </button>
//             <button className="p-2 hover:bg-muted rounded-lg transition-colors">
//               <SkipForward className="w-4 h-4 text-muted-foreground" />
//             </button>
//           </div>

//           <div className="flex items-center gap-4">
//             <span className="font-mono text-sm text-foreground">
//               14:30:00 - 14:35:00
//             </span>
//             <div className="flex items-center gap-2">
//               <Filter className="w-4 h-4 text-muted-foreground" />
//               <select
//                 value={filterRisk}
//                 onChange={(e) => setFilterRisk(e.target.value)}
//                 className="px-3 py-1.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none"
//               >
//                 <option value="all">All Events</option>
//                 <option value="high">High Risk</option>
//                 <option value="medium">Medium Risk</option>
//                 <option value="low">Low Risk</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Timeline Progress */}
//         <div className="relative h-2 bg-muted rounded-full overflow-hidden">
//           <div 
//             className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all"
//             style={{ width: `${(currentEvent / mockTimeline.length) * 100}%` }}
//           />
//           <div className="absolute top-0 h-full flex w-full">
//             {mockTimeline.map((event, i) => (
//               <div
//                 key={event.id}
//                 className={cn(
//                   "h-full flex-1 border-r border-background cursor-pointer hover:bg-primary/20",
//                   event.risk === "high" && "bg-risk-high/30",
//                   event.risk === "medium" && "bg-risk-medium/30",
//                   i <= currentEvent && "bg-primary/30"
//                 )}
//                 onClick={() => setCurrentEvent(i)}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main Timeline */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         <div className="xl:col-span-2">
//           <div className="bg-card border border-border rounded-lg overflow-hidden">
//             <div className="px-4 py-3 border-b border-border flex items-center justify-between">
//               <h3 className="text-sm font-semibold text-foreground">Event Sequence</h3>
//               <span className="text-xs text-muted-foreground font-mono">
//                 {filteredEvents.length} events
//               </span>
//             </div>

//             <div className="relative p-4">
//               <div className="absolute left-8 top-4 bottom-4 w-px bg-border" />

//               <div className="space-y-4">
//                 {filteredEvents.map((event, index) => {
//                   const Icon = getEventIcon(event.type);
                  
//                   return (
//                     <div
//                       key={event.id}
//                       className={cn(
//                         "relative pl-12 fade-in",
//                         index <= currentEvent ? "opacity-100" : "opacity-40"
//                       )}
//                       style={{ animationDelay: `${index * 50}ms` }}
//                     >
//                       <div
//                         className={cn(
//                           "absolute left-5 top-3 w-6 h-6 rounded-full flex items-center justify-center -translate-x-1/2 border-2",
//                           getRiskColor(event.risk)
//                         )}
//                       >
//                         <Icon className={cn(
//                           "w-3 h-3",
//                           event.risk === "high" ? "text-risk-high" :
//                           event.risk === "medium" ? "text-risk-medium" :
//                           event.risk === "low" ? "text-risk-low" : "text-muted-foreground"
//                         )} />
//                       </div>

//                       <div className={cn(
//                         "rounded-lg p-4 border transition-colors",
//                         index === currentEvent ? "bg-primary/5 border-primary/30" : "bg-muted/30 border-border"
//                       )}>
//                         <div className="flex items-center gap-3 mb-2">
//                           <span className="font-mono text-xs text-primary font-medium">{event.time}</span>
//                           <span className={cn(
//                             "px-2 py-0.5 text-xs rounded capitalize",
//                             event.type === "transaction" ? "bg-primary/10 text-primary" :
//                             event.type === "pattern" ? "bg-risk-medium/10 text-risk-medium" :
//                             event.type === "alert" ? "bg-risk-high/10 text-risk-high" :
//                             "bg-muted text-muted-foreground"
//                           )}>
//                             {event.type}
//                           </span>
//                         </div>

//                         {event.type === "transaction" && event.from && event.to && (
//                           <div className="flex items-center gap-3 mb-2">
//                             <span className="font-mono text-sm text-foreground">{event.from}</span>
//                             <ArrowRight className="w-4 h-4 text-muted-foreground" />
//                             <span className="font-mono text-sm text-foreground">{event.to}</span>
//                             <span className="font-mono text-sm text-primary font-medium ml-auto">
//                               ₹{event.amount?.toLocaleString()}
//                             </span>
//                           </div>
//                         )}

//                         <p className="text-sm text-muted-foreground">{event.description}</p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Analysis Panel */}
//         <div className="space-y-4">
//           <div className="bg-card border border-border rounded-lg p-4">
//             <h3 className="text-sm font-semibold text-foreground mb-4">Temporal Analysis</h3>
//             <div className="space-y-3">
//               <div className="flex justify-between text-sm">
//                 <span className="text-muted-foreground">Time Window</span>
//                 <span className="font-mono text-foreground">5 min</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-muted-foreground">Total Transactions</span>
//                 <span className="font-mono text-foreground">7</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-muted-foreground">Peak Velocity</span>
//                 <span className="font-mono text-risk-high">3 txn/15s</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-muted-foreground">Patterns Triggered</span>
//                 <span className="font-mono text-risk-medium">2</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-muted-foreground">Coordination Score</span>
//                 <span className="font-mono text-risk-high">0.89</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-card border border-border rounded-lg p-4">
//             <h3 className="text-sm font-semibold text-foreground mb-4">Burst Detection</h3>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">14:31:45 - 14:31:52</span>
//                 <span className="px-2 py-0.5 text-xs bg-risk-high/10 text-risk-high rounded">
//                   3 txns
//                 </span>
//               </div>
//               <div className="h-2 bg-muted rounded-full overflow-hidden">
//                 <div className="h-full w-3/4 bg-risk-high rounded-full" />
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 Burst detected: 3 transactions in 7 seconds from single source account
//               </p>
//             </div>
//           </div>

//           <div className="terminal-panel p-3">
//             <p className="terminal-accent text-xs mb-2">// Timeline Agent Output</p>
//             <p className="text-xs text-muted-foreground leading-relaxed">
//               Detected rapid-fire transaction sequence suggesting automated or pre-planned fund distribution. 
//               Inter-transaction delays (3-4 seconds) consistent with scripted execution.
//               High coordination score indicates deliberate structuring.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  ArrowRight,
  Filter,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  AlertCircle,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiGet } from "@/lib/api";

type Risk = "high" | "medium" | "low" | "none";
type EventType = "transaction" | "pattern" | "alert" | "system";

type TimelineEvent = {
  id: string;
  time: string;
  timestamp: number;
  type: EventType;
  from_acc?: string | null;
  to_acc?: string | null;
  amount?: number | null;
  description: string;
  risk: Risk;
};

type TimelineResponse = {
  window_start?: string | null;
  window_end?: string | null;
  total_events: number;
  coordination_score?: number | null;
  reasoning?: string | null;
  events: TimelineEvent[];
};

export default function Timeline() {
  const [playing, setPlaying] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(0);
  const [filterRisk, setFilterRisk] = useState<"all" | Risk>("all");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [data, setData] = useState<TimelineResponse | null>(null);

  // fetch timeline
  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        setLoading(true);

        // later you can do /timeline?account_id=ACC0065
        const res = await apiGet<TimelineResponse>(`/timeline`);
        setData(res);
        setCurrentEvent(0);
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load timeline");
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const events = useMemo(() => data?.events ?? [], [data]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => filterRisk === "all" || event.risk === filterRisk);
  }, [events, filterRisk]);

  // playback
  useEffect(() => {
    if (!playing) return;
    if (filteredEvents.length === 0) return;

    const t = setInterval(() => {
      setCurrentEvent((prev) => {
        const next = prev + 1;
        if (next >= filteredEvents.length) return prev; // stop at end
        return next;
      });
    }, 900);

    return () => clearInterval(t);
  }, [playing, filteredEvents.length]);

  function getRiskColor(risk: Risk) {
    switch (risk) {
      case "high":
        return "border-risk-high bg-risk-high/10";
      case "medium":
        return "border-risk-medium bg-risk-medium/10";
      case "low":
        return "border-risk-low bg-risk-low/10";
      default:
        return "border-border bg-muted/30";
    }
  }

  function getEventIcon(type: EventType) {
    switch (type) {
      case "transaction":
        return ArrowRight;
      case "pattern":
        return Activity;
      case "alert":
        return AlertCircle;
      default:
        return Clock;
    }
  }

  const windowText = useMemo(() => {
    const a = data?.window_start ? String(data.window_start) : "";
    const b = data?.window_end ? String(data.window_end) : "";
    if (!a && !b) return "—";
    // show only HH:MM:SS if iso
    const fmt = (iso: string) => (iso.includes("T") ? iso.split("T")[1].split(".")[0] : iso);
    return `${fmt(a)} - ${fmt(b)}`;
  }, [data]);

  const totalTxns = useMemo(
    () => filteredEvents.filter((e) => e.type === "transaction").length,
    [filteredEvents]
  );
  const totalPatterns = useMemo(
    () => filteredEvents.filter((e) => e.type === "pattern").length,
    [filteredEvents]
  );

  const progressPct = filteredEvents.length
    ? Math.min(100, (currentEvent / filteredEvents.length) * 100)
    : 0;

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary" />
            Timeline Reconstruction
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Temporal analysis of transaction sequences and pattern emergence
          </p>
          {err && (
            <p className="text-sm mt-2 text-risk-high flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> API error: {err}
            </p>
          )}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setCurrentEvent((x) => Math.max(0, x - 1))}
              disabled={filteredEvents.length === 0}
            >
              <SkipBack className="w-4 h-4 text-muted-foreground" />
            </button>

            <button
              onClick={() => setPlaying(!playing)}
              className="p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
              disabled={filteredEvents.length === 0}
              title={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <Pause className="w-5 h-5 text-primary" />
              ) : (
                <Play className="w-5 h-5 text-primary" />
              )}
            </button>

            <button
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() =>
                setCurrentEvent((x) =>
                  Math.min(filteredEvents.length - 1, x + 1)
                )
              }
              disabled={filteredEvents.length === 0}
            >
              <SkipForward className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-sm text-foreground">{windowText}</span>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filterRisk}
                onChange={(e) => {
                  setFilterRisk(e.target.value as any);
                  setCurrentEvent(0);
                  setPlaying(false);
                }}
                className="px-3 py-1.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none"
              >
                <option value="all">All Events</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
                <option value="none">System</option>
              </select>
            </div>
          </div>
        </div>

        {/* Timeline Progress */}
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
          <div className="absolute top-0 h-full flex w-full">
            {(filteredEvents.length ? filteredEvents : []).map((event, i) => (
              <div
                key={event.id}
                className={cn(
                  "h-full flex-1 border-r border-background cursor-pointer hover:bg-primary/20",
                  event.risk === "high" && "bg-risk-high/30",
                  event.risk === "medium" && "bg-risk-medium/30",
                  event.risk === "low" && "bg-risk-low/30",
                  i <= currentEvent && "bg-primary/30"
                )}
                onClick={() => setCurrentEvent(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Event Sequence</h3>
              <span className="text-xs text-muted-foreground font-mono">
                {loading ? "Loading..." : `${filteredEvents.length} events`}
              </span>
            </div>

            <div className="relative p-4">
              <div className="absolute left-8 top-4 bottom-4 w-px bg-border" />

              {loading ? (
                <div className="text-sm text-muted-foreground p-4">
                  Loading timeline from backend…
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-sm text-muted-foreground p-4">
                  No events found (try a different filter or run the timeline agent).
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((event, index) => {
                    const Icon = getEventIcon(event.type);

                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "relative pl-12 fade-in",
                          index <= currentEvent ? "opacity-100" : "opacity-40"
                        )}
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <div
                          className={cn(
                            "absolute left-5 top-3 w-6 h-6 rounded-full flex items-center justify-center -translate-x-1/2 border-2",
                            getRiskColor(event.risk)
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-3 h-3",
                              event.risk === "high"
                                ? "text-risk-high"
                                : event.risk === "medium"
                                ? "text-risk-medium"
                                : event.risk === "low"
                                ? "text-risk-low"
                                : "text-muted-foreground"
                            )}
                          />
                        </div>

                        <div
                          className={cn(
                            "rounded-lg p-4 border transition-colors",
                            index === currentEvent
                              ? "bg-primary/5 border-primary/30"
                              : "bg-muted/30 border-border"
                          )}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-xs text-primary font-medium">
                              {event.time}
                            </span>
                            <span
                              className={cn(
                                "px-2 py-0.5 text-xs rounded capitalize",
                                event.type === "transaction"
                                  ? "bg-primary/10 text-primary"
                                  : event.type === "pattern"
                                  ? "bg-risk-medium/10 text-risk-medium"
                                  : event.type === "alert"
                                  ? "bg-risk-high/10 text-risk-high"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {event.type}
                            </span>
                          </div>

                          {event.type === "transaction" &&
                            event.from_acc &&
                            event.to_acc && (
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-mono text-sm text-foreground">
                                  {event.from_acc}
                                </span>
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                <span className="font-mono text-sm text-foreground">
                                  {event.to_acc}
                                </span>

                                <span className="font-mono text-sm text-primary font-medium ml-auto">
                                  ₹{Number(event.amount ?? 0).toLocaleString()}
                                </span>
                              </div>
                            )}

                          <p className="text-sm text-muted-foreground">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analysis Panel */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Temporal Analysis
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time Window</span>
                <span className="font-mono text-foreground">{windowText}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Transactions</span>
                <span className="font-mono text-foreground">{totalTxns}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Patterns Triggered</span>
                <span className="font-mono text-foreground">{totalPatterns}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Coordination Score</span>
                <span className="font-mono text-foreground">
                  {data?.coordination_score ?? "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="terminal-panel p-3">
            <p className="terminal-accent text-xs mb-2">// Timeline Agent Output</p>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {data?.reasoning
                ? data.reasoning
                : "No reasoning found. (If you removed LLM reasoning in agent, this is expected.)"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
