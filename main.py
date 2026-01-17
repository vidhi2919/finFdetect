# # main.py
# """
# FastAPI backend for Fraud Investigator MVP
# ==========================================

# Adds:
# - /timeline endpoint (UI-ready timeline events)
# - /timeline/raw endpoint (raw timeline_reconstruction.json)

# Reads artifacts from ./outputs.
# """

# from __future__ import annotations

# import json
# import os
# from pathlib import Path
# from typing import Any, Dict, List, Optional, Tuple

# from fastapi import FastAPI, HTTPException, Query
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse, JSONResponse
# from pydantic import BaseModel


# # -----------------------------
# # Config
# # -----------------------------
# OUTPUT_DIR = Path(os.getenv("OUTPUT_DIR", "outputs"))
# DEFAULT_TOP_N = int(os.getenv("DEFAULT_TOP_N", "50"))

# FILES = {
#     "case_reports": OUTPUT_DIR / "final_case_reports.json",
#     "risk_scores": OUTPUT_DIR / "final_risk_scores.json",
#     "patterns": OUTPUT_DIR / "pattern_detections_langgraph.json",
#     "timeline": OUTPUT_DIR / "timeline_reconstruction.json",
#     "correlation": OUTPUT_DIR / "correlation.json",
#     "txn_analysis": OUTPUT_DIR / "transaction_analysis.json",
#     "rag_reports": OUTPUT_DIR / "rag_reports.json",
# }

# GRAPH_VIZ_DIR = OUTPUT_DIR / "graph_viz"


# # -----------------------------
# # App
# # -----------------------------
# app = FastAPI(
#     title="Fraud Investigator API (MVP)",
#     version="1.0.0",
#     description="Deterministic fraud analytics backend: alerts, case reports, graphs, RAG, timeline.",
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=False,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # -----------------------------
# # Models (minimal, flexible)
# # -----------------------------
# class HealthResponse(BaseModel):
#     status: str
#     outputs_dir: str
#     available_artifacts: Dict[str, bool]


# class AlertRow(BaseModel):
#     account_id: str
#     risk_score: float
#     risk_band: str
#     patterns: List[str]


# class AlertsResponse(BaseModel):
#     total: int
#     returned: int
#     items: List[AlertRow]


# class CaseReportResponse(BaseModel):
#     report: Dict[str, Any]


# class PatternsResponse(BaseModel):
#     total: int
#     returned: int
#     items: List[Dict[str, Any]]


# class RagResponse(BaseModel):
#     total: int
#     returned: int
#     items: List[Dict[str, Any]]


# # Timeline response models (UI friendly)
# class TimelineEvent(BaseModel):
#     id: str
#     time: str
#     timestamp: float
#     type: str  # "transaction" | "pattern" | "alert" | "system"
#     from_acc: Optional[str] = None
#     to_acc: Optional[str] = None
#     amount: Optional[float] = None
#     description: str
#     risk: str  # "high" | "medium" | "low" | "none"


# class TimelineResponse(BaseModel):
#     window_start: Optional[str]
#     window_end: Optional[str]
#     total_events: int
#     coordination_score: Optional[float]
#     reasoning: Optional[str]
#     events: List[TimelineEvent]


# # -----------------------------
# # Helpers
# # -----------------------------
# def _read_json(path: Path) -> Any:
#     if not path.exists():
#         raise FileNotFoundError(str(path))
#     return json.loads(path.read_text())


# def _safe_read_json(path: Path) -> Optional[Any]:
#     try:
#         return _read_json(path)
#     except FileNotFoundError:
#         return None


# def _risk_band(score_0_100: float) -> str:
#     if score_0_100 >= 70:
#         return "HIGH"
#     if score_0_100 >= 40:
#         return "MEDIUM"
#     return "LOW"


# def _normalize_risk_scores(risk_obj: Any) -> List[Dict[str, Any]]:
#     if risk_obj is None:
#         return []

#     if isinstance(risk_obj, list):
#         rows = risk_obj
#     elif isinstance(risk_obj, dict) and "risk_score" in risk_obj and isinstance(risk_obj["risk_score"], list):
#         rows = risk_obj["risk_score"]
#     elif isinstance(risk_obj, dict):
#         rows = []
#         for acc, data in risk_obj.items():
#             if isinstance(data, dict):
#                 rows.append({"account_id": acc, **data})
#             else:
#                 rows.append({"account_id": acc, "risk_score": float(data)})
#     else:
#         return []

#     norm = []
#     for r in rows:
#         acc = r.get("account_id")
#         if not acc:
#             continue
#         score = r.get("risk_score", r.get("final_risk", r.get("final_score", 0.0)))
#         try:
#             score_f = float(score)
#         except Exception:
#             score_f = 0.0
#         band = r.get("risk_band") or _risk_band(score_f)
#         norm.append({**r, "account_id": acc, "risk_score": score_f, "risk_band": band})
#     return norm


# def _load_case_reports() -> List[Dict[str, Any]]:
#     data = _read_json(FILES["case_reports"])
#     if not isinstance(data, list):
#         raise ValueError("final_case_reports.json must be a list")
#     return data


# def _find_case_report(reports: List[Dict[str, Any]], account_id: str) -> Optional[Dict[str, Any]]:
#     for r in reports:
#         if r.get("account_id") == account_id:
#             return r
#     return None


# def _extract_patterns_from_report(report: Dict[str, Any]) -> List[str]:
#     pats = []
#     for p in report.get("patterns_detected", []) or []:
#         if not isinstance(p, dict):
#             continue
#         pats.append(p.get("pattern_type") or p.get("pattern") or "")
#     return sorted([x for x in set(pats) if x])


# # -----------------------------
# # Timeline helpers (NEW)
# # -----------------------------
# def _parse_iso_to_sortable(ts: Any) -> Tuple[float, str]:
#     """
#     Returns (epoch-like sortable float, iso_string)
#     Handles:
#       - datetime string like "2024-01-01T10:20:30"
#       - already serialized
#     """
#     if ts is None:
#         return (0.0, "")
#     s = str(ts)
#     # crude but works for sorting if iso: YYYY-MM-DDTHH:MM:SS...
#     # We'll use lexicographic fallback if parsing fails.
#     # (Avoids bringing dateutil dependency.)
#     try:
#         # If format "YYYY-MM-DDTHH:MM:SS"
#         import datetime as _dt
#         dt = _dt.datetime.fromisoformat(s.replace("Z", ""))
#         return (dt.timestamp(), dt.isoformat())
#     except Exception:
#         # fallback: string sort
#         return (0.0, s)


# def _fmt_time_hhmmss(ts: Any) -> str:
#     _, iso = _parse_iso_to_sortable(ts)
#     if not iso:
#         return "—"
#     # iso like "2024-01-01T10:20:30"
#     if "T" in iso:
#         t = iso.split("T", 1)[1]
#         return t.split(".", 1)[0]  # drop ms
#     return iso


# def _transfer_key(t: Dict[str, Any]) -> str:
#     # used to dedupe transfers that appear in both burst + chain lists
#     return f"{t.get('sender')}|{t.get('receiver')}|{t.get('amount')}|{t.get('timestamp')}"


# def _account_in_transfer(acc: str, t: Dict[str, Any]) -> bool:
#     return t.get("sender") == acc or t.get("receiver") == acc


# def _account_in_group(acc: str, group: List[Dict[str, Any]]) -> bool:
#     return any(_account_in_transfer(acc, x) for x in group)


# def _build_timeline_events(
#     timeline_obj: Dict[str, Any],
#     account_id: Optional[str] = None,
# ) -> TimelineResponse:
#     bursts: List[List[Dict[str, Any]]] = timeline_obj.get("bursts", []) or []
#     chains: List[List[Dict[str, Any]]] = timeline_obj.get("chains", []) or []
#     score = timeline_obj.get("coordination_score")
#     reasoning = timeline_obj.get("reasoning") or timeline_obj.get("llm_reasoning") or ""

#     # Filter groups if account_id specified
#     if account_id:
#         bursts = [b for b in bursts if isinstance(b, list) and _account_in_group(account_id, b)]
#         chains = [c for c in chains if isinstance(c, list) and _account_in_group(account_id, c)]

#     # Collect transfers (dedup) from bursts + chains
#     all_transfers: List[Dict[str, Any]] = []
#     seen = set()

#     for group in bursts + chains:
#         if not isinstance(group, list):
#             continue
#         for t in group:
#             if not isinstance(t, dict):
#                 continue
#             if account_id and not _account_in_transfer(account_id, t):
#                 continue
#             k = _transfer_key(t)
#             if k in seen:
#                 continue
#             seen.add(k)
#             all_transfers.append(t)

#     # Sort by timestamp
#     all_transfers_sorted = sorted(all_transfers, key=lambda x: _parse_iso_to_sortable(x.get("timestamp"))[0])

#     # Determine window start/end
#     window_start = all_transfers_sorted[0].get("timestamp") if all_transfers_sorted else None
#     window_end = all_transfers_sorted[-1].get("timestamp") if all_transfers_sorted else None

#     events: List[TimelineEvent] = []

#     # System start/end markers
#     if window_start:
#         events.append(
#             TimelineEvent(
#                 id="SYS-START",
#                 time=_fmt_time_hhmmss(window_start),
#                 timestamp=_parse_iso_to_sortable(window_start)[0],
#                 type="system",
#                 description="Monitoring window started",
#                 risk="none",
#             )
#         )

#     # Transaction events
#     for i, t in enumerate(all_transfers_sorted, start=1):
#         ts = t.get("timestamp")
#         amount = t.get("amount")
#         sender = t.get("sender")
#         receiver = t.get("receiver")

#         # risk heuristic: if this transfer participates in a burst => high, chain => medium
#         risk = "low"
#         in_burst = any(isinstance(b, list) and any(_transfer_key(x) == _transfer_key(t) for x in b) for b in bursts)
#         in_chain = any(isinstance(c, list) and any(_transfer_key(x) == _transfer_key(t) for x in c) for c in chains)

#         if in_burst:
#             risk = "high"
#         elif in_chain:
#             risk = "medium"

#         desc = "Transfer observed"
#         if in_burst:
#             desc = "Burst activity transfer (rapid cluster)"
#         elif in_chain:
#             desc = "Rapid hop transfer (possible layering)"

#         events.append(
#             TimelineEvent(
#                 id=f"TXN-{i:04d}",
#                 time=_fmt_time_hhmmss(ts),
#                 timestamp=_parse_iso_to_sortable(ts)[0],
#                 type="transaction",
#                 from_acc=sender,
#                 to_acc=receiver,
#                 amount=float(amount) if amount is not None else None,
#                 description=desc,
#                 risk=risk,
#             )
#         )

#     # Pattern events (bursts)
#     for j, b in enumerate(bursts, start=1):
#         if not b:
#             continue
#         b_sorted = sorted(b, key=lambda x: _parse_iso_to_sortable(x.get("timestamp"))[0])
#         start_ts = b_sorted[0].get("timestamp")
#         end_ts = b_sorted[-1].get("timestamp")
#         n = len(b_sorted)
#         # try to pick a main source (most common sender)
#         senders = [x.get("sender") for x in b_sorted if x.get("sender")]
#         main = max(set(senders), key=senders.count) if senders else None

#         events.append(
#             TimelineEvent(
#                 id=f"PAT-BURST-{j:03d}",
#                 time=_fmt_time_hhmmss(end_ts or start_ts),
#                 timestamp=_parse_iso_to_sortable(end_ts or start_ts)[0],
#                 type="pattern",
#                 description=f"Burst detected: {n} transactions in a short window"
#                             + (f" (likely source: {main})" if main else ""),
#                 risk="high" if n >= 3 else "medium",
#             )
#         )

#     # Pattern events (chains)
#     for k, c in enumerate(chains, start=1):
#         if not c:
#             continue
#         c_sorted = sorted(c, key=lambda x: _parse_iso_to_sortable(x.get("timestamp"))[0])
#         start_ts = c_sorted[0].get("timestamp")
#         end_ts = c_sorted[-1].get("timestamp")
#         n = len(c_sorted)

#         events.append(
#             TimelineEvent(
#                 id=f"PAT-CHAIN-{k:03d}",
#                 time=_fmt_time_hhmmss(end_ts or start_ts),
#                 timestamp=_parse_iso_to_sortable(end_ts or start_ts)[0],
#                 type="pattern",
#                 description=f"Rapid chain detected: {n} hop(s) within hop window (possible layering)",
#                 risk="medium",
#             )
#         )

#     # If coordination score is high, add a "case created" alert event
#     try:
#         score_val = float(score) if score is not None else None
#     except Exception:
#         score_val = None

#     if score_val is not None:
#         if score_val >= 10:
#             events.append(
#                 TimelineEvent(
#                     id="ALERT-CASE",
#                     time=_fmt_time_hhmmss(window_end or window_start),
#                     timestamp=_parse_iso_to_sortable(window_end or window_start)[0],
#                     type="alert",
#                     description="Investigation recommended: high coordination score detected",
#                     risk="high",
#                 )
#             )
#         elif score_val >= 4:
#             events.append(
#                 TimelineEvent(
#                     id="ALERT-MONITOR",
#                     time=_fmt_time_hhmmss(window_end or window_start),
#                     timestamp=_parse_iso_to_sortable(window_end or window_start)[0],
#                     type="alert",
#                     description="Monitoring recommended: moderate coordination score detected",
#                     risk="medium",
#                 )
#             )

#     if window_end:
#         events.append(
#             TimelineEvent(
#                 id="SYS-END",
#                 time=_fmt_time_hhmmss(window_end),
#                 timestamp=_parse_iso_to_sortable(window_end)[0],
#                 type="system",
#                 description="Monitoring window ended",
#                 risk="none",
#             )
#         )

#     # Final sort
#     events_sorted = sorted(events, key=lambda e: e.timestamp)

#     return TimelineResponse(
#         window_start=str(window_start) if window_start else None,
#         window_end=str(window_end) if window_end else None,
#         total_events=len(events_sorted),
#         coordination_score=score_val,
#         reasoning=reasoning,
#         events=events_sorted,
#     )


# # -----------------------------
# # Core endpoints (existing)
# # -----------------------------
# @app.get("/health", response_model=HealthResponse)
# def health():
#     return {
#         "status": "ok",
#         "outputs_dir": str(OUTPUT_DIR),
#         "available_artifacts": {k: v.exists() for k, v in FILES.items()},
#     }


# @app.get("/alerts", response_model=AlertsResponse)
# def get_alerts(
#     top_n: int = Query(DEFAULT_TOP_N, ge=1, le=1000),
#     band: Optional[str] = Query(None, description="Filter by risk band: HIGH | MEDIUM | LOW"),
# ):
#     reports = _safe_read_json(FILES["case_reports"])
#     if isinstance(reports, list) and reports:
#         rows: List[AlertRow] = []
#         for r in reports:
#             risk = r.get("risk", {}) or {}
#             score = float(risk.get("final_score", 0.0))
#             rb = risk.get("band") or _risk_band(score)
#             if band and rb != band:
#                 continue
#             rows.append(
#                 AlertRow(
#                     account_id=r.get("account_id", ""),
#                     risk_score=score,
#                     risk_band=rb,
#                     patterns=_extract_patterns_from_report(r),
#                 )
#             )
#         rows = sorted(rows, key=lambda x: x.risk_score, reverse=True)[:top_n]
#         return {"total": len(rows), "returned": len(rows), "items": rows}

#     risk_obj = _safe_read_json(FILES["risk_scores"])
#     risk_rows = _normalize_risk_scores(risk_obj)
#     if band:
#         risk_rows = [r for r in risk_rows if (r.get("risk_band") == band)]
#     risk_rows = sorted(risk_rows, key=lambda r: r.get("risk_score", 0.0), reverse=True)[:top_n]

#     items = [
#         AlertRow(
#             account_id=r["account_id"],
#             risk_score=float(r.get("risk_score", 0.0)),
#             risk_band=r.get("risk_band") or _risk_band(float(r.get("risk_score", 0.0))),
#             patterns=[],
#         )
#         for r in risk_rows
#     ]
#     return {"total": len(items), "returned": len(items), "items": items}


# @app.get("/cases/{account_id}", response_model=CaseReportResponse)
# def get_case_report(account_id: str):
#     try:
#         reports = _load_case_reports()
#     except FileNotFoundError:
#         raise HTTPException(status_code=404, detail="final_case_reports.json not found in outputs/")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to load case reports: {e}")

#     report = _find_case_report(reports, account_id)
#     if not report:
#         raise HTTPException(status_code=404, detail=f"No case report found for {account_id}")

#     return {"report": report}


# @app.get("/cases/{account_id}/graph-image")
# def get_case_graph_image(account_id: str):
#     img = GRAPH_VIZ_DIR / f"{account_id}.png"
#     if not img.exists():
#         raise HTTPException(status_code=404, detail=f"Graph image not found: {img}")
#     return FileResponse(str(img), media_type="image/png", filename=img.name)


# @app.get("/patterns", response_model=PatternsResponse)
# def list_patterns(
#     account_id: Optional[str] = Query(None),
#     top_n: int = Query(200, ge=1, le=5000),
# ):
#     data = _safe_read_json(FILES["patterns"])
#     if data is None:
#         raise HTTPException(status_code=404, detail="pattern_detections_langgraph.json not found")

#     if not isinstance(data, list):
#         raise HTTPException(status_code=500, detail="patterns file must be a list")

#     items = data
#     if account_id:
#         items = [d for d in items if (d.get("account_id") == account_id) or (d.get("detection", {}).get("account_id") == account_id)]

#     return {"total": len(items), "returned": min(len(items), top_n), "items": items[:top_n]}


# @app.get("/rag", response_model=RagResponse)
# def list_rag_reports(
#     account_id: Optional[str] = Query(None),
#     top_n: int = Query(200, ge=1, le=5000),
# ):
#     data = _safe_read_json(FILES["rag_reports"])
#     if data is None:
#         raise HTTPException(status_code=404, detail="rag_reports.json not found")

#     if not isinstance(data, list):
#         raise HTTPException(status_code=500, detail="rag_reports.json must be a list")

#     items = data
#     if account_id:
#         items = [r for r in items if r.get("account_id") == account_id]

#     return {"total": len(items), "returned": min(len(items), top_n), "items": items[:top_n]}


# @app.get("/artifacts")
# def list_artifacts():
#     out = {}
#     for name, path in FILES.items():
#         out[name] = {
#             "path": str(path),
#             "exists": path.exists(),
#             "bytes": path.stat().st_size if path.exists() else None,
#         }

#     out["graph_viz_dir"] = {
#         "path": str(GRAPH_VIZ_DIR),
#         "exists": GRAPH_VIZ_DIR.exists(),
#         "png_count": len(list(GRAPH_VIZ_DIR.glob("*.png"))) if GRAPH_VIZ_DIR.exists() else 0,
#     }
#     return JSONResponse(out)


# @app.get("/cases", response_model=AlertsResponse)
# def list_cases_ranked(
#     top_n: int = Query(DEFAULT_TOP_N, ge=1, le=1000),
#     band: Optional[str] = Query(None),
#     include_patterns: bool = Query(True),
# ):
#     reports = _safe_read_json(FILES["case_reports"])
#     if not isinstance(reports, list) or not reports:
#         raise HTTPException(status_code=404, detail="final_case_reports.json not found or empty")

#     items: List[AlertRow] = []
#     for r in reports:
#         risk = r.get("risk", {}) or {}
#         score = float(risk.get("final_score", 0.0))
#         rb = risk.get("band") or _risk_band(score)
#         if band and rb != band:
#             continue
#         items.append(
#             AlertRow(
#                 account_id=r.get("account_id", ""),
#                 risk_score=score,
#                 risk_band=rb,
#                 patterns=_extract_patterns_from_report(r) if include_patterns else [],
#             )
#         )

#     items = sorted(items, key=lambda x: x.risk_score, reverse=True)[:top_n]
#     return {"total": len(items), "returned": len(items), "items": items}


# # -----------------------------
# # Timeline endpoints (NEW)
# # -----------------------------
# @app.get("/timeline/raw")
# def timeline_raw():
#     data = _safe_read_json(FILES["timeline"])
#     if data is None:
#         raise HTTPException(status_code=404, detail="timeline_reconstruction.json not found")
#     return JSONResponse(data)


# @app.get("/timeline", response_model=TimelineResponse)
# def timeline(
#     account_id: Optional[str] = Query(None, description="Filter timeline to a specific account"),
# ):
#     data = _safe_read_json(FILES["timeline"])
#     if data is None:
#         raise HTTPException(status_code=404, detail="timeline_reconstruction.json not found (run Timeline_reconstruction_agent.py)")

#     if not isinstance(data, dict):
#         raise HTTPException(status_code=500, detail="timeline_reconstruction.json must be a dict")

#     return _build_timeline_events(data, account_id=account_id)

# main.py
"""
FastAPI backend for Fraud Investigator MVP
==========================================

Adds:
- /timeline endpoint (UI-ready timeline events)
- /timeline/raw endpoint (raw timeline_reconstruction.json)

Reads artifacts from ./outputs.
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from datetime import datetime
from io import BytesIO
from fastapi.responses import StreamingResponse

# PDF
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    Image as RLImage, PageBreak
)

from datetime import datetime
from io import BytesIO
from fastapi.responses import StreamingResponse

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch

# -----------------------------
# Config
# -----------------------------
OUTPUT_DIR = Path(os.getenv("OUTPUT_DIR", "outputs"))
DEFAULT_TOP_N = int(os.getenv("DEFAULT_TOP_N", "50"))

FILES = {
    "case_reports": OUTPUT_DIR / "final_case_reports.json",
    "risk_scores": OUTPUT_DIR / "final_risk_scores.json",
    "patterns": OUTPUT_DIR / "pattern_detections_langgraph.json",
    "timeline": OUTPUT_DIR / "timeline_reconstruction.json",
    "correlation": OUTPUT_DIR / "correlation.json",
    "txn_analysis": OUTPUT_DIR / "transaction_analysis.json",
    "rag_reports": OUTPUT_DIR / "rag_reports.json",
}

GRAPH_VIZ_DIR = OUTPUT_DIR / "graph_viz"


# -----------------------------
# App
# -----------------------------
app = FastAPI(
    title="Fraud Investigator API (MVP)",
    version="1.0.0",
    description="Deterministic fraud analytics backend: alerts, case reports, graphs, RAG, timeline.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Models (minimal, flexible)
# -----------------------------
class HealthResponse(BaseModel):
    status: str
    outputs_dir: str
    available_artifacts: Dict[str, bool]


class AlertRow(BaseModel):
    account_id: str
    risk_score: float
    risk_band: str
    patterns: List[str]


class AlertsResponse(BaseModel):
    total: int
    returned: int
    items: List[AlertRow]


class CaseReportResponse(BaseModel):
    report: Dict[str, Any]


class PatternsResponse(BaseModel):
    total: int
    returned: int
    items: List[Dict[str, Any]]


class RagResponse(BaseModel):
    total: int
    returned: int
    items: List[Dict[str, Any]]


# Timeline response models (UI friendly)
class TimelineEvent(BaseModel):
    id: str
    time: str
    timestamp: float
    type: str  # "transaction" | "pattern" | "alert" | "system"
    from_acc: Optional[str] = None
    to_acc: Optional[str] = None
    amount: Optional[float] = None
    description: str
    risk: str  # "high" | "medium" | "low" | "none"


class TimelineResponse(BaseModel):
    window_start: Optional[str]
    window_end: Optional[str]
    total_events: int
    coordination_score: Optional[float]
    reasoning: Optional[str]
    events: List[TimelineEvent]

class GraphEdge(BaseModel):
    source: str
    target: str
    amount: float
    count: int


class GraphNode(BaseModel):
    id: str
    in_degree: int = 0
    out_degree: int = 0
    total_degree: int = 0
    sent: float = 0.0
    received: float = 0.0
    centrality: float = 0.0


class GraphSubgraphResponse(BaseModel):
    center: Optional[str]
    returned_nodes: int
    returned_edges: int
    nodes: List[GraphNode]
    edges: List[GraphEdge]


class GraphStatsResponse(BaseModel):
    total_nodes: int
    total_edges: int
    top_centrality: List[GraphNode]


# -----------------------------
# Helpers
# -----------------------------
def _read_json(path: Path) -> Any:
    if not path.exists():
        raise FileNotFoundError(str(path))
    return json.loads(path.read_text())


def _safe_read_json(path: Path) -> Optional[Any]:
    try:
        return _read_json(path)
    except FileNotFoundError:
        return None


def _risk_band(score_0_100: float) -> str:
    if score_0_100 >= 70:
        return "HIGH"
    if score_0_100 >= 40:
        return "MEDIUM"
    return "LOW"


def _normalize_risk_scores(risk_obj: Any) -> List[Dict[str, Any]]:
    if risk_obj is None:
        return []

    if isinstance(risk_obj, list):
        rows = risk_obj
    elif isinstance(risk_obj, dict) and "risk_score" in risk_obj and isinstance(risk_obj["risk_score"], list):
        rows = risk_obj["risk_score"]
    elif isinstance(risk_obj, dict):
        rows = []
        for acc, data in risk_obj.items():
            if isinstance(data, dict):
                rows.append({"account_id": acc, **data})
            else:
                rows.append({"account_id": acc, "risk_score": float(data)})
    else:
        return []

    norm = []
    for r in rows:
        acc = r.get("account_id")
        if not acc:
            continue
        score = r.get("risk_score", r.get("final_risk", r.get("final_score", 0.0)))
        try:
            score_f = float(score)
        except Exception:
            score_f = 0.0
        band = r.get("risk_band") or _risk_band(score_f)
        norm.append({**r, "account_id": acc, "risk_score": score_f, "risk_band": band})
    return norm


def _load_case_reports() -> List[Dict[str, Any]]:
    data = _read_json(FILES["case_reports"])
    if not isinstance(data, list):
        raise ValueError("final_case_reports.json must be a list")
    return data


def _find_case_report(reports: List[Dict[str, Any]], account_id: str) -> Optional[Dict[str, Any]]:
    for r in reports:
        if r.get("account_id") == account_id:
            return r
    return None


def _extract_patterns_from_report(report: Dict[str, Any]) -> List[str]:
    pats = []
    for p in report.get("patterns_detected", []) or []:
        if not isinstance(p, dict):
            continue
        pats.append(p.get("pattern_type") or p.get("pattern") or "")
    return sorted([x for x in set(pats) if x])

def _load_rag_item_by_account(account_id: str) -> Optional[Dict[str, Any]]:
    data = _safe_read_json(FILES["rag_reports"])
    if not isinstance(data, list):
        return None
    for item in data:
        if item.get("account_id") == account_id:
            return item
    return None

def _load_txn_analysis() -> Dict[str, Any]:
    data = _safe_read_json(FILES["txn_analysis"])
    if data is None:
        raise HTTPException(status_code=404, detail="transaction_analysis.json not found (run transaction_analysis.py)")
    if not isinstance(data, dict):
        raise HTTPException(status_code=500, detail="transaction_analysis.json must be a dict")
    return data


def _build_node_obj(acc: str, ta: Dict[str, Any]) -> GraphNode:
    in_deg = int((ta.get("in_degree") or {}).get(acc, 0))
    out_deg = int((ta.get("out_degree") or {}).get(acc, 0))
    total_deg = int((ta.get("total_degree") or {}).get(acc, in_deg + out_deg))

    tf = (ta.get("total_flow") or {}).get(acc, {}) or {}
    sent = float(tf.get("sent", 0.0) or 0.0)
    received = float(tf.get("received", 0.0) or 0.0)

    centrality = float((ta.get("centrality") or {}).get(acc, 0.0) or 0.0)

    return GraphNode(
        id=acc,
        in_degree=in_deg,
        out_degree=out_deg,
        total_degree=total_deg,
        sent=sent,
        received=received,
        centrality=centrality,
    )


def _edges_list(ta: Dict[str, Any]) -> List[Dict[str, Any]]:
    edges = ta.get("edges") or []
    if not isinstance(edges, list):
        return []
    out = []
    for e in edges:
        if not isinstance(e, dict):
            continue
        s = e.get("source")
        t = e.get("target")
        if not s or not t:
            continue
        out.append({
            "source": str(s),
            "target": str(t),
            "amount": float(e.get("amount", 0.0) or 0.0),
            "count": int(e.get("count", 1) or 1),
        })
    return out

# -----------------------------
# Timeline helpers (NEW)
# -----------------------------
def _parse_iso_to_sortable(ts: Any) -> Tuple[float, str]:
    """
    Returns (epoch-like sortable float, iso_string)
    Handles:
      - datetime string like "2024-01-01T10:20:30"
      - already serialized
    """
    if ts is None:
        return (0.0, "")
    s = str(ts)
    # crude but works for sorting if iso: YYYY-MM-DDTHH:MM:SS...
    # We'll use lexicographic fallback if parsing fails.
    # (Avoids bringing dateutil dependency.)
    try:
        # If format "YYYY-MM-DDTHH:MM:SS"
        import datetime as _dt
        dt = _dt.datetime.fromisoformat(s.replace("Z", ""))
        return (dt.timestamp(), dt.isoformat())
    except Exception:
        # fallback: string sort
        return (0.0, s)


def _fmt_time_hhmmss(ts: Any) -> str:
    _, iso = _parse_iso_to_sortable(ts)
    if not iso:
        return "—"
    # iso like "2024-01-01T10:20:30"
    if "T" in iso:
        t = iso.split("T", 1)[1]
        return t.split(".", 1)[0]  # drop ms
    return iso


def _transfer_key(t: Dict[str, Any]) -> str:
    # used to dedupe transfers that appear in both burst + chain lists
    return f"{t.get('sender')}|{t.get('receiver')}|{t.get('amount')}|{t.get('timestamp')}"


def _account_in_transfer(acc: str, t: Dict[str, Any]) -> bool:
    return t.get("sender") == acc or t.get("receiver") == acc


def _account_in_group(acc: str, group: List[Dict[str, Any]]) -> bool:
    return any(_account_in_transfer(acc, x) for x in group)


def _build_timeline_events(
    timeline_obj: Dict[str, Any],
    account_id: Optional[str] = None,
) -> TimelineResponse:
    bursts: List[List[Dict[str, Any]]] = timeline_obj.get("bursts", []) or []
    chains: List[List[Dict[str, Any]]] = timeline_obj.get("chains", []) or []
    score = timeline_obj.get("coordination_score")
    reasoning = timeline_obj.get("reasoning") or timeline_obj.get("llm_reasoning") or ""

    # Filter groups if account_id specified
    if account_id:
        bursts = [b for b in bursts if isinstance(b, list) and _account_in_group(account_id, b)]
        chains = [c for c in chains if isinstance(c, list) and _account_in_group(account_id, c)]

    # Collect transfers (dedup) from bursts + chains
    all_transfers: List[Dict[str, Any]] = []
    seen = set()

    for group in bursts + chains:
        if not isinstance(group, list):
            continue
        for t in group:
            if not isinstance(t, dict):
                continue
            if account_id and not _account_in_transfer(account_id, t):
                continue
            k = _transfer_key(t)
            if k in seen:
                continue
            seen.add(k)
            all_transfers.append(t)

    # Sort by timestamp
    all_transfers_sorted = sorted(all_transfers, key=lambda x: _parse_iso_to_sortable(x.get("timestamp"))[0])

    # Determine window start/end
    window_start = all_transfers_sorted[0].get("timestamp") if all_transfers_sorted else None
    window_end = all_transfers_sorted[-1].get("timestamp") if all_transfers_sorted else None

    events: List[TimelineEvent] = []

    # System start/end markers
    if window_start:
        events.append(
            TimelineEvent(
                id="SYS-START",
                time=_fmt_time_hhmmss(window_start),
                timestamp=_parse_iso_to_sortable(window_start)[0],
                type="system",
                description="Monitoring window started",
                risk="none",
            )
        )

    # Transaction events
    for i, t in enumerate(all_transfers_sorted, start=1):
        ts = t.get("timestamp")
        amount = t.get("amount")
        sender = t.get("sender")
        receiver = t.get("receiver")

        # risk heuristic: if this transfer participates in a burst => high, chain => medium
        risk = "low"
        in_burst = any(isinstance(b, list) and any(_transfer_key(x) == _transfer_key(t) for x in b) for b in bursts)
        in_chain = any(isinstance(c, list) and any(_transfer_key(x) == _transfer_key(t) for x in c) for c in chains)

        if in_burst:
            risk = "high"
        elif in_chain:
            risk = "medium"

        desc = "Transfer observed"
        if in_burst:
            desc = "Burst activity transfer (rapid cluster)"
        elif in_chain:
            desc = "Rapid hop transfer (possible layering)"

        events.append(
            TimelineEvent(
                id=f"TXN-{i:04d}",
                time=_fmt_time_hhmmss(ts),
                timestamp=_parse_iso_to_sortable(ts)[0],
                type="transaction",
                from_acc=sender,
                to_acc=receiver,
                amount=float(amount) if amount is not None else None,
                description=desc,
                risk=risk,
            )
        )

    # Pattern events (bursts)
    for j, b in enumerate(bursts, start=1):
        if not b:
            continue
        b_sorted = sorted(b, key=lambda x: _parse_iso_to_sortable(x.get("timestamp"))[0])
        start_ts = b_sorted[0].get("timestamp")
        end_ts = b_sorted[-1].get("timestamp")
        n = len(b_sorted)
        # try to pick a main source (most common sender)
        senders = [x.get("sender") for x in b_sorted if x.get("sender")]
        main = max(set(senders), key=senders.count) if senders else None

        events.append(
            TimelineEvent(
                id=f"PAT-BURST-{j:03d}",
                time=_fmt_time_hhmmss(end_ts or start_ts),
                timestamp=_parse_iso_to_sortable(end_ts or start_ts)[0],
                type="pattern",
                description=f"Burst detected: {n} transactions in a short window"
                            + (f" (likely source: {main})" if main else ""),
                risk="high" if n >= 3 else "medium",
            )
        )

    # Pattern events (chains)
    for k, c in enumerate(chains, start=1):
        if not c:
            continue
        c_sorted = sorted(c, key=lambda x: _parse_iso_to_sortable(x.get("timestamp"))[0])
        start_ts = c_sorted[0].get("timestamp")
        end_ts = c_sorted[-1].get("timestamp")
        n = len(c_sorted)

        events.append(
            TimelineEvent(
                id=f"PAT-CHAIN-{k:03d}",
                time=_fmt_time_hhmmss(end_ts or start_ts),
                timestamp=_parse_iso_to_sortable(end_ts or start_ts)[0],
                type="pattern",
                description=f"Rapid chain detected: {n} hop(s) within hop window (possible layering)",
                risk="medium",
            )
        )

    # If coordination score is high, add a "case created" alert event
    try:
        score_val = float(score) if score is not None else None
    except Exception:
        score_val = None

    if score_val is not None:
        if score_val >= 10:
            events.append(
                TimelineEvent(
                    id="ALERT-CASE",
                    time=_fmt_time_hhmmss(window_end or window_start),
                    timestamp=_parse_iso_to_sortable(window_end or window_start)[0],
                    type="alert",
                    description="Investigation recommended: high coordination score detected",
                    risk="high",
                )
            )
        elif score_val >= 4:
            events.append(
                TimelineEvent(
                    id="ALERT-MONITOR",
                    time=_fmt_time_hhmmss(window_end or window_start),
                    timestamp=_parse_iso_to_sortable(window_end or window_start)[0],
                    type="alert",
                    description="Monitoring recommended: moderate coordination score detected",
                    risk="medium",
                )
            )

    if window_end:
        events.append(
            TimelineEvent(
                id="SYS-END",
                time=_fmt_time_hhmmss(window_end),
                timestamp=_parse_iso_to_sortable(window_end)[0],
                type="system",
                description="Monitoring window ended",
                risk="none",
            )
        )

    # Final sort
    events_sorted = sorted(events, key=lambda e: e.timestamp)

    return TimelineResponse(
        window_start=str(window_start) if window_start else None,
        window_end=str(window_end) if window_end else None,
        total_events=len(events_sorted),
        coordination_score=score_val,
        reasoning=reasoning,
        events=events_sorted,
    )

def _unique_pattern_names_from_case_report(case_report: Dict[str, Any]) -> List[str]:
    """
    Returns UNIQUE pattern names from case_report["patterns_detected"]
    Handles both:
      - {"pattern_type": "..."}
      - {"pattern": "..."}
      - nested detection dicts
    """
    raw = case_report.get("patterns_detected") or []
    names: List[str] = []

    for p in raw:
        if not isinstance(p, dict):
            continue

        # common fields
        name = p.get("pattern_type") or p.get("pattern")

        # sometimes pattern is nested
        if not name and isinstance(p.get("detection"), dict):
            det = p["detection"]
            name = det.get("pattern_type") or det.get("pattern")

        if isinstance(name, str) and name.strip():
            names.append(name.strip())

    # unique + stable order
    seen = set()
    out = []
    for n in names:
        key = n.lower()
        if key not in seen:
            seen.add(key)
            out.append(n)
    return out
# -----------------------------
# Core endpoints (existing)
# -----------------------------
@app.get("/health", response_model=HealthResponse)
def health():
    return {
        "status": "ok",
        "outputs_dir": str(OUTPUT_DIR),
        "available_artifacts": {k: v.exists() for k, v in FILES.items()},
    }


@app.get("/alerts", response_model=AlertsResponse)
def get_alerts(
    top_n: int = Query(DEFAULT_TOP_N, ge=1, le=1000),
    band: Optional[str] = Query(None, description="Filter by risk band: HIGH | MEDIUM | LOW"),
):
    reports = _safe_read_json(FILES["case_reports"])
    if isinstance(reports, list) and reports:
        rows: List[AlertRow] = []
        for r in reports:
            risk = r.get("risk", {}) or {}
            score = float(risk.get("final_score", 0.0))
            rb = risk.get("band") or _risk_band(score)
            if band and rb != band:
                continue
            rows.append(
                AlertRow(
                    account_id=r.get("account_id", ""),
                    risk_score=score,
                    risk_band=rb,
                    patterns=_extract_patterns_from_report(r),
                )
            )
        rows = sorted(rows, key=lambda x: x.risk_score, reverse=True)[:top_n]
        return {"total": len(rows), "returned": len(rows), "items": rows}

    risk_obj = _safe_read_json(FILES["risk_scores"])
    risk_rows = _normalize_risk_scores(risk_obj)
    if band:
        risk_rows = [r for r in risk_rows if (r.get("risk_band") == band)]
    risk_rows = sorted(risk_rows, key=lambda r: r.get("risk_score", 0.0), reverse=True)[:top_n]

    items = [
        AlertRow(
            account_id=r["account_id"],
            risk_score=float(r.get("risk_score", 0.0)),
            risk_band=r.get("risk_band") or _risk_band(float(r.get("risk_score", 0.0))),
            patterns=[],
        )
        for r in risk_rows
    ]
    return {"total": len(items), "returned": len(items), "items": items}


@app.get("/cases/{account_id}", response_model=CaseReportResponse)
def get_case_report(account_id: str):
    try:
        reports = _load_case_reports()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="final_case_reports.json not found in outputs/")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load case reports: {e}")

    report = _find_case_report(reports, account_id)
    if not report:
        raise HTTPException(status_code=404, detail=f"No case report found for {account_id}")

    return {"report": report}


@app.get("/cases/{account_id}/graph-image")
def get_case_graph_image(account_id: str):
    img = GRAPH_VIZ_DIR / f"{account_id}.png"
    if not img.exists():
        raise HTTPException(status_code=404, detail=f"Graph image not found: {img}")
    return FileResponse(str(img), media_type="image/png", filename=img.name)


@app.get("/patterns", response_model=PatternsResponse)
def list_patterns(
    account_id: Optional[str] = Query(None),
    top_n: int = Query(200, ge=1, le=5000),
):
    data = _safe_read_json(FILES["patterns"])
    if data is None:
        raise HTTPException(status_code=404, detail="pattern_detections_langgraph.json not found")

    if not isinstance(data, list):
        raise HTTPException(status_code=500, detail="patterns file must be a list")

    items = data
    if account_id:
        items = [d for d in items if (d.get("account_id") == account_id) or (d.get("detection", {}).get("account_id") == account_id)]

    return {"total": len(items), "returned": min(len(items), top_n), "items": items[:top_n]}


@app.get("/rag", response_model=RagResponse)
def list_rag_reports(
    account_id: Optional[str] = Query(None),
    top_n: int = Query(200, ge=1, le=5000),
):
    data = _safe_read_json(FILES["rag_reports"])
    if data is None:
        raise HTTPException(status_code=404, detail="rag_reports.json not found")

    if not isinstance(data, list):
        raise HTTPException(status_code=500, detail="rag_reports.json must be a list")

    items = data
    if account_id:
        items = [r for r in items if r.get("account_id") == account_id]

    return {"total": len(items), "returned": min(len(items), top_n), "items": items[:top_n]}


@app.get("/artifacts")
def list_artifacts():
    out = {}
    for name, path in FILES.items():
        out[name] = {
            "path": str(path),
            "exists": path.exists(),
            "bytes": path.stat().st_size if path.exists() else None,
        }

    out["graph_viz_dir"] = {
        "path": str(GRAPH_VIZ_DIR),
        "exists": GRAPH_VIZ_DIR.exists(),
        "png_count": len(list(GRAPH_VIZ_DIR.glob("*.png"))) if GRAPH_VIZ_DIR.exists() else 0,
    }
    return JSONResponse(out)


@app.get("/cases", response_model=AlertsResponse)
def list_cases_ranked(
    top_n: int = Query(DEFAULT_TOP_N, ge=1, le=1000),
    band: Optional[str] = Query(None),
    include_patterns: bool = Query(True),
):
    reports = _safe_read_json(FILES["case_reports"])
    if not isinstance(reports, list) or not reports:
        raise HTTPException(status_code=404, detail="final_case_reports.json not found or empty")

    items: List[AlertRow] = []
    for r in reports:
        risk = r.get("risk", {}) or {}
        score = float(risk.get("final_score", 0.0))
        rb = risk.get("band") or _risk_band(score)
        if band and rb != band:
            continue
        items.append(
            AlertRow(
                account_id=r.get("account_id", ""),
                risk_score=score,
                risk_band=rb,
                patterns=_extract_patterns_from_report(r) if include_patterns else [],
            )
        )

    items = sorted(items, key=lambda x: x.risk_score, reverse=True)[:top_n]
    return {"total": len(items), "returned": len(items), "items": items}


# -----------------------------
# Timeline endpoints (NEW)
# -----------------------------
@app.get("/timeline/raw")
def timeline_raw():
    data = _safe_read_json(FILES["timeline"])
    if data is None:
        raise HTTPException(status_code=404, detail="timeline_reconstruction.json not found")
    return JSONResponse(data)


@app.get("/timeline", response_model=TimelineResponse)
def timeline(
    account_id: Optional[str] = Query(None, description="Filter timeline to a specific account"),
):
    data = _safe_read_json(FILES["timeline"])
    if data is None:
        raise HTTPException(status_code=404, detail="timeline_reconstruction.json not found (run Timeline_reconstruction_agent.py)")

    if not isinstance(data, dict):
        raise HTTPException(status_code=500, detail="timeline_reconstruction.json must be a dict")

    return _build_timeline_events(data, account_id=account_id)


@app.get("/reports/{account_id}/pdf")
def get_report_pdf(account_id: str):
    """
    Generates a pretty PDF report using:
    - final_case_reports.json (metrics + graph image + patterns)
    - rag_reports.json (detailed narrative under item["report"])
    """
    # 1) Load case report
    try:
        reports = _load_case_reports()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="final_case_reports.json not found")
    case = _find_case_report(reports, account_id)
    if not case:
        raise HTTPException(status_code=404, detail=f"No case report found for {account_id}")

    # 2) Load RAG report (optional but preferred)
    rag_item = _load_rag_item_by_account(account_id)
    rag_text = (rag_item or {}).get("report") or "No RAG narrative available for this account."
    retrieval = (rag_item or {}).get("retrieval") or []

    # 3) Unique patterns
    unique_patterns = _unique_pattern_names_from_case_report(case)

    # 4) Build PDF
    buf = BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36,
        title=f"Investigation Report - {account_id}",
    )

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="H1", parent=styles["Heading1"], fontSize=16, spaceAfter=10))
    styles.add(ParagraphStyle(name="H2", parent=styles["Heading2"], fontSize=12, spaceAfter=8))
    styles.add(ParagraphStyle(name="Body", parent=styles["BodyText"], fontSize=10, leading=14))
    styles.add(ParagraphStyle(name="MonoSmall", parent=styles["BodyText"], fontSize=9, leading=12, fontName="Courier"))

    story = []

    # Header
    story.append(Paragraph(f"Fraud Investigation Report: <b>{account_id}</b>", styles["H1"]))
    story.append(Paragraph(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}", styles["Body"]))
    story.append(Spacer(1, 12))

    # Risk summary table
    risk = case.get("risk", {}) or {}
    risk_score = risk.get("final_score", "—")
    risk_band = risk.get("band", "—")

    ge = case.get("graph_evidence", {}) or {}
    total_flow = ge.get("total_flow", {}) or {}
    sent = total_flow.get("sent", "—")
    received = total_flow.get("received", "—")
    in_deg = ge.get("in_degree", "—")
    out_deg = ge.get("out_degree", "—")
    tx_count = ge.get("transaction_count", "—")
    uniq_cp = ge.get("unique_counterparties", "—")

    table_data = [
        ["Risk Score", str(risk_score), "Risk Band", str(risk_band)],
        ["Total Sent", str(sent), "Total Received", str(received)],
        ["In Degree", str(in_deg), "Out Degree", str(out_deg)],
        ["Transaction Count", str(tx_count), "Unique Counterparties", str(uniq_cp)],
    ]

    t = Table(table_data, colWidths=[1.4 * inch, 2.0 * inch, 1.6 * inch, 2.0 * inch])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.whitesmoke),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.lightgrey),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, colors.HexColor("#FAFAFA")]),
            ]
        )
    )
    story.append(Paragraph("Risk & Transaction Summary", styles["H2"]))
    story.append(t)
    story.append(Spacer(1, 12))

    # Unique patterns
    story.append(Paragraph("Detected Patterns (Unique)", styles["H2"]))
    if unique_patterns:
        story.append(Paragraph(", ".join(unique_patterns), styles["Body"]))
    else:
        story.append(Paragraph("No patterns detected.", styles["Body"]))
    story.append(Spacer(1, 12))

    # Graph image if present
    img_path = (case.get("graph_evidence", {}) or {}).get("graph_visual_path")
    if img_path and Path(img_path).exists():
        story.append(Paragraph("Graph Evidence", styles["H2"]))
        story.append(Image(img_path, width=6.5 * inch, height=4.0 * inch))
        story.append(Spacer(1, 12))

    # ✅ RAG detailed narrative (this is your main request)
    story.append(Paragraph("Detailed Investigation Narrative (RAG)", styles["H2"]))
    for para in rag_text.split("\n"):
        para = para.strip()
        if not para:
            story.append(Spacer(1, 6))
            continue
        story.append(Paragraph(para.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"), styles["Body"]))
    story.append(Spacer(1, 12))

    # Sources / retrieval evidence (top N)
    story.append(Paragraph("Supporting Sources (Top Retrieval)", styles["H2"]))
    if retrieval:
        for i, r in enumerate(retrieval[:6], start=1):
            score = r.get("score")
            meta = r.get("metadata", {}) or {}
            src = meta.get("source_path") or r.get("source") or "unknown"
            excerpt = (r.get("text") or "").strip()

            story.append(Paragraph(f"<b>[{i}]</b> score={score} — {src}", styles["MonoSmall"]))
            if excerpt:
                story.append(Paragraph(excerpt[:600].replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"), styles["Body"]))
            story.append(Spacer(1, 8))
    else:
        story.append(Paragraph("No retrieval sources available.", styles["Body"]))

    doc.build(story)
    buf.seek(0)

    return StreamingResponse(
        buf,
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="report_{account_id}.pdf"'},
    )

@app.get("/graph/stats", response_model=GraphStatsResponse)
def graph_stats(top_k: int = Query(10, ge=1, le=50)):
    ta = _load_txn_analysis()

    # total_nodes from degree map (most reliable)
    nodes_set = set((ta.get("total_degree") or {}).keys())
    total_nodes = len(nodes_set)

    edges = _edges_list(ta)
    total_edges = len(edges)

    # top centrality
    cent = ta.get("centrality") or {}
    if not isinstance(cent, dict):
        cent = {}
    top = sorted(cent.items(), key=lambda x: float(x[1] or 0.0), reverse=True)[:top_k]
    top_nodes = [_build_node_obj(acc, ta) for acc, _ in top]

    return {
        "total_nodes": total_nodes,
        "total_edges": total_edges,
        "top_centrality": top_nodes,
    }


@app.get("/graph/node/{account_id}", response_model=GraphNode)
def graph_node(account_id: str):
    ta = _load_txn_analysis()
    return _build_node_obj(account_id, ta)


@app.get("/graph/subgraph", response_model=GraphSubgraphResponse)
def graph_subgraph(
    center: Optional[str] = Query(None, description="Center node account id"),
    hops: int = Query(1, ge=1, le=3),
    max_edges: int = Query(1200, ge=50, le=10000),
):
    ta = _load_txn_analysis()
    edges = _edges_list(ta)

    if not edges:
        return {"center": center, "returned_nodes": 0, "returned_edges": 0, "nodes": [], "edges": []}

    # If no center: return global trimmed graph
    if not center:
        # top edges by amount
        edges_sorted = sorted(edges, key=lambda e: e["amount"], reverse=True)[:max_edges]
        nodes = set()
        for e in edges_sorted:
            nodes.add(e["source"])
            nodes.add(e["target"])
        node_objs = [_build_node_obj(n, ta) for n in nodes]
        return {
            "center": None,
            "returned_nodes": len(node_objs),
            "returned_edges": len(edges_sorted),
            "nodes": node_objs,
            "edges": [GraphEdge(**e) for e in edges_sorted],
        }

    # Build adjacency for BFS
    out_adj: Dict[str, List[str]] = {}
    in_adj: Dict[str, List[str]] = {}
    for e in edges:
        out_adj.setdefault(e["source"], []).append(e["target"])
        in_adj.setdefault(e["target"], []).append(e["source"])

    # BFS hops over undirected neighborhood (in+out)
    visited = set([center])
    frontier = set([center])
    for _ in range(hops):
        nxt = set()
        for n in frontier:
            for m in out_adj.get(n, []):
                if m not in visited:
                    nxt.add(m)
            for m in in_adj.get(n, []):
                if m not in visited:
                    nxt.add(m)
        visited |= nxt
        frontier = nxt
        if not frontier:
            break

    # collect edges within visited set
    sub_edges = [e for e in edges if e["source"] in visited and e["target"] in visited]
    # trim
    sub_edges = sorted(sub_edges, key=lambda e: e["amount"], reverse=True)[:max_edges]

    node_objs = [_build_node_obj(n, ta) for n in visited]
    return {
        "center": center,
        "returned_nodes": len(node_objs),
        "returned_edges": len(sub_edges),
        "nodes": node_objs,
        "edges": [GraphEdge(**e) for e in sub_edges],
    }
