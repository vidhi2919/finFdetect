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



