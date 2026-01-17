# import json
# from pathlib import Path
# from collections import defaultdict
# from pathlib import Path
# import networkx as nx
# import matplotlib.pyplot as plt


# OUTPUT_DIR = Path("outputs")
# from Agents.pattern_detection import PatternDetectionAgent

# transfers = PatternDetectionAgent.load_transfers_from_neo4j()
# G = PatternDetectionAgent.build_graph_from_neo4j_transfers(transfers)


# # ---- helpers ----
# def load_json(path: Path):
#     return json.loads(path.read_text())

# def save_json(path: Path, obj):
#     path.parent.mkdir(parents=True, exist_ok=True)
#     path.write_text(json.dumps(obj, indent=2))

# def risk_band(score_0_100: float):
#     if score_0_100 >= 70:
#         return "HIGH"
#     if score_0_100 >= 40:
#         return "MEDIUM"
#     return "LOW"


# # ✅ Neo4j graph evidence (interactive visual in Neo4j Browser/Bloom)
# # def build_neo4j_graph_evidence(account_id: str, hops: int = 2, min_total_amount: float | None = None):
# #     """
# #     Returns a Cypher query that renders a subgraph around the account.
# #     Investigators paste this into Neo4j Browser/Bloom to see the graph.
# #     """
# #     amt_filter = ""
# #     if min_total_amount is not None:
# #         # Works if relationship has total_amount; if not, remove this filter.
# #         amt_filter = f" WHERE ALL(rel IN r WHERE coalesce(rel.total_amount, rel.avg_amount, 0) >= {min_total_amount})"

# #     cypher = f"""
# #     MATCH p=(a:Account {{account_id: '{account_id}'}})-[r:TRANSFER*1..{hops}]-(b:Account)
# #     {amt_filter}
# #     RETURN p
# #     """.strip()

# #     return {
# #         "graph_source": "neo4j",
# #         "center_account": account_id,
# #         "hop_depth": hops,
# #         "cypher_query": cypher
# #     }

# # ---- main builder ----
# def build_case_reports(top_n: int = 50):
#     # Required inputs (adjust filenames to your actual ones)
#     risk = load_json(OUTPUT_DIR / "final_risk_scores.json")          # {account_id: {...}} OR list
#     patterns = load_json(OUTPUT_DIR / "pattern_detections_langgraph.json")  # list of detections
#     timeline = load_json(OUTPUT_DIR / "timeline_reconstruction.json") if (OUTPUT_DIR / "timeline_reconstruction.json").exists() else None
#     corr = load_json(OUTPUT_DIR / "correlation.json") if (OUTPUT_DIR / "correlation.json").exists() else None
#     txn = load_json(OUTPUT_DIR / "transaction_analysis.json") if (OUTPUT_DIR / "transaction_analysis.json").exists() else None
#     rag_reports = load_json(OUTPUT_DIR / "rag_reports.json")         # list

#     # ---- normalize risk shape ----
#     # Support both dict and list formats.
#     # Expected best format:
#     # risk = [{"account_id": "...", "final_score": 58.6, "components": {...}}, ...]
#     # if isinstance(risk, dict) and "risk_score" in risk:
#     #     risk_rows = risk["risk_score"]
#     # elif isinstance(risk, list):
#     #     risk_rows = risk
#     # elif isinstance(risk, dict):
#     #     # maybe {acc: {final:..}}
#     #     risk_rows = []
#     #     for acc, data in risk.items():
#     #         if isinstance(data, dict):
#     #             risk_rows.append({"account_id": acc, **data})
#     #         else:
#     #             risk_rows.append({"account_id": acc, "final_score": data})
#     # else:
#     #     raise ValueError("Unknown final_risk_scores.json format")
#     # ---- normalize risk shape ----
# # final_risk_scores.json is a LIST of dicts (correct format)
#     if isinstance(risk, list):
#         risk_rows = risk
#     else:
#         raise ValueError("final_risk_scores.json must be a list of risk objects")


#     # ---- index patterns by account ----
#     patterns_by_acc = defaultdict(list)
#     for d in patterns:
#         acc = d.get("account_id") or d.get("detection", {}).get("account_id")
#         if acc:
#             patterns_by_acc[acc].append(d)

#     # ---- index RAG by account ----
#     rag_by_acc = defaultdict(list)
#     for r in rag_reports:
#         acc = r.get("account_id")
#         if acc:
#             rag_by_acc[acc].append(r)

#     # ---- graph evidence from txn + corr (if present) ----
#     # txn: {"centrality": {...}, "total_flow": {...}}
#     centrality = (txn or {}).get("centrality", {})
#     total_flow = (txn or {}).get("total_flow", {})

#     # corr optional: could contain in_degree/out_degree totals etc.
#     in_deg = (txn or {}).get("in_degree", {})
#     out_deg = (txn or {}).get("out_degree", {})

#     # ---- timeline evidence (global for MVP) ----
#     # If your timeline is global, we attach summary once.
#     timeline_summary = None
#     if isinstance(timeline, dict):
#         timeline_summary = {
#             "bursts_detected": len(timeline.get("bursts", [])),
#             "chains_detected": len(timeline.get("chains", [])),
#             "coordination_score": timeline.get("coordination_score"),
#             "reasoning": timeline.get("reasoning", "")
#         }

#     # ---- sort by risk ----
#     risk_rows_sorted = sorted(
#         risk_rows,
#         key=lambda x: x.get("risk_score", x.get("final_risk", 0)),
#         reverse=True
#     )[:top_n]

#     case_reports = []
#     for row in risk_rows_sorted:
#         acc = row["account_id"]
#         final_score = row.get("risk_score", row.get("final_risk", 0))
#         band = row.get("risk_band") or risk_band(final_score)

#         comp = row.get("components", row.get("component_scores", {}))

#         # ✅ Neo4j graph visual evidence payload (interactive)
#         # hops=2 is a good default for investigation without exploding the graph.
#         # neo4j_graph_evidence = build_neo4j_graph_evidence(
#         #     account_id=acc,
#         #     hops=2,
#         #     # Optional: set a filter threshold to reduce clutter if needed:
#         #     # min_total_amount=10000
#         #     min_total_amount=None
#         # )

#         viz_path = save_account_subgraph_png(G, acc, hops=1)
#         report = {
#             "account_id": acc,
#             "risk": {
#                 "final_score": final_score,
#                 "band": band,
#                 "component_scores": comp
#             },
#             "patterns_detected": patterns_by_acc.get(acc, []),
#             "graph_evidence": {
#                 "centrality": centrality.get(acc, 0.0),
#                 "total_flow": total_flow.get(acc, {}),
#                 "in_degree": in_deg.get(acc),
#                 "out_degree": out_deg.get(acc),
#                 "graph_visual_path": viz_path
#             },
#             "timeline_evidence": timeline_summary,
#             "legal_mapping": rag_by_acc.get(acc, []),
#             "next_actions": [
#                 "Verify beneficiary identities (KYC) for top counterparties",
#                 "Check whether amounts are repeatedly near thresholds (structuring)",
#                 "Request statement history for 30–90 days to confirm persistence",
#                 "Look for rapid hop chains indicating layering",
#                 "Escalate to human investigator if repeated multi-recipient transfers exist"
#             ]
#         }

#         case_reports.append(report)

#     save_json(OUTPUT_DIR / "final_case_reports.json", case_reports)
#     print(f"✅ Saved {len(case_reports)} case reports → outputs/final_case_reports.json")


# def save_account_subgraph_png(G: nx.DiGraph, account_id: str, out_dir="outputs/graph_viz", hops=1):
#     out_dir = Path(out_dir)
#     out_dir.mkdir(parents=True, exist_ok=True)

#     # collect nodes within K hops (in + out)
#     nodes = {account_id}
#     frontier = {account_id}

#     for _ in range(hops):
#         nxt = set()
#         for n in frontier:
#             nxt.update([v for _, v in G.out_edges(n)])
#             nxt.update([u for u, _ in G.in_edges(n)])
#         nxt -= nodes
#         nodes |= nxt
#         frontier = nxt

#     SG = G.subgraph(nodes).copy()

#     if SG.number_of_nodes() <= 1:
#         return None

#     plt.figure(figsize=(10, 7))
#     pos = nx.spring_layout(SG, seed=42)

#     nx.draw_networkx_nodes(SG, pos, node_size=900)
#     nx.draw_networkx_edges(SG, pos, arrows=True, arrowstyle="-|>", arrowsize=15)
#     nx.draw_networkx_labels(SG, pos, font_size=8)

#     # edge labels (amount/count if present)
#     edge_labels = {}
#     for u, v, data in SG.edges(data=True):
#         amt = data.get("total_amount") or data.get("amount")
#         cnt = data.get("count") or data.get("transaction_count")
#         if amt is not None and cnt is not None:
#             edge_labels[(u, v)] = f"{amt:.0f} ({cnt})"
#         elif amt is not None:
#             edge_labels[(u, v)] = f"{amt:.0f}"

#     if edge_labels:
#         nx.draw_networkx_edge_labels(SG, pos, edge_labels=edge_labels, font_size=7)

#     path = out_dir / f"{account_id}.png"
#     plt.title(f"Transaction Subgraph: {account_id} (hops={hops})")
#     plt.axis("off")
#     plt.tight_layout()
#     plt.savefig(path, dpi=200)
#     plt.close()
#     return str(path)


# if __name__ == "__main__":
#     build_case_reports(top_n=50)



######################################################


# final_report_builder.py

# import json
# from pathlib import Path
# from collections import defaultdict
# from typing import Any, Dict, List, Optional
# import networkx as nx
# import matplotlib.pyplot as plt

# from Agents.pattern_detection import PatternDetectionAgent

# OUTPUT_DIR = Path("outputs")


# # -----------------------------
# # JSON helpers
# # -----------------------------
# def load_json(path: Path):
#     return json.loads(path.read_text())

# def save_json(path: Path, obj):
#     path.parent.mkdir(parents=True, exist_ok=True)
#     path.write_text(json.dumps(obj, indent=2))

# def risk_band(score_0_100: float):
#     if score_0_100 >= 70:
#         return "HIGH"
#     if score_0_100 >= 40:
#         return "MEDIUM"
#     return "LOW"


# # -----------------------------
# # Transfer parsing (robust)
# # -----------------------------
# def _get_sender(tx: Dict[str, Any]) -> Optional[str]:
#     return (
#         tx.get("from")
#         or tx.get("src")
#         or tx.get("sender")
#         or tx.get("source")
#         or tx.get("from_account")
#         or tx.get("fromAccount")
#     )

# def _get_receiver(tx: Dict[str, Any]) -> Optional[str]:
#     return (
#         tx.get("to")
#         or tx.get("dst")
#         or tx.get("receiver")
#         or tx.get("target")
#         or tx.get("to_account")
#         or tx.get("toAccount")
#     )

# def _get_amount(tx: Dict[str, Any]) -> float:
#     amt = tx.get("amount", tx.get("total_amount", tx.get("value", 0)))
#     try:
#         return float(amt)
#     except Exception:
#         return 0.0

# def _get_timestamp(tx: Dict[str, Any]) -> Optional[str]:
#     # Keep as string; frontend can display or convert
#     return (
#         tx.get("timestamp")
#         or tx.get("time")
#         or tx.get("created_at")
#         or tx.get("datetime")
#         or tx.get("date")
#     )


# # -----------------------------
# # Compute per-account stats from transfers + graph
# # -----------------------------
# def build_account_stats(transfers: List[Dict[str, Any]], G: nx.DiGraph) -> Dict[str, Dict[str, Any]]:
#     """
#     Builds:
#       - transaction_count (in+out)
#       - total_sent
#       - total_received
#       - connections (unique neighbors)
#       - last_activity (latest timestamp string if present)
#       - in_degree/out_degree (graph degrees)
#     """
#     stats = defaultdict(lambda: {
#         "transaction_count": 0,
#         "total_sent": 0.0,
#         "total_received": 0.0,
#         "last_activity": None,
#         "connections": 0,
#         "in_degree": 0,
#         "out_degree": 0,
#     })

#     # From transfers
#     for tx in transfers:
#         s = _get_sender(tx)
#         r = _get_receiver(tx)
#         amt = _get_amount(tx)
#         ts = _get_timestamp(tx)

#         if s:
#             stats[s]["transaction_count"] += 1
#             stats[s]["total_sent"] += amt
#             # Keep max timestamp as "last_activity" if possible
#             if ts:
#                 cur = stats[s]["last_activity"]
#                 if (cur is None) or (str(ts) > str(cur)):
#                     stats[s]["last_activity"] = str(ts)

#         if r:
#             stats[r]["transaction_count"] += 1
#             stats[r]["total_received"] += amt
#             if ts:
#                 cur = stats[r]["last_activity"]
#                 if (cur is None) or (str(ts) > str(cur)):
#                     stats[r]["last_activity"] = str(ts)

#     # From graph
#     for n in G.nodes():
#         # degrees
#         try:
#             stats[n]["in_degree"] = int(G.in_degree(n))
#             stats[n]["out_degree"] = int(G.out_degree(n))
#         except Exception:
#             stats[n]["in_degree"] = 0
#             stats[n]["out_degree"] = 0

#         # unique neighbors (predecessors + successors)
#         try:
#             neigh = set(G.predecessors(n)) | set(G.successors(n))
#             stats[n]["connections"] = len(neigh)
#         except Exception:
#             stats[n]["connections"] = 0

#     return stats


# # -----------------------------
# # Graph PNG save
# # -----------------------------
# def save_account_subgraph_png(G: nx.DiGraph, account_id: str, out_dir="outputs/graph_viz", hops=1):
#     out_dir = Path(out_dir)
#     out_dir.mkdir(parents=True, exist_ok=True)

#     if account_id not in G:
#         return None

#     # collect nodes within K hops (in + out)
#     nodes = {account_id}
#     frontier = {account_id}

#     for _ in range(hops):
#         nxt = set()
#         for n in frontier:
#             nxt.update([v for _, v in G.out_edges(n)])
#             nxt.update([u for u, _ in G.in_edges(n)])
#         nxt -= nodes
#         nodes |= nxt
#         frontier = nxt

#     SG = G.subgraph(nodes).copy()

#     if SG.number_of_nodes() <= 1:
#         return None

#     plt.figure(figsize=(10, 7))
#     pos = nx.spring_layout(SG, seed=42)

#     nx.draw_networkx_nodes(SG, pos, node_size=900)
#     nx.draw_networkx_edges(SG, pos, arrows=True, arrowstyle="-|>", arrowsize=15)
#     nx.draw_networkx_labels(SG, pos, font_size=8)

#     # edge labels (amount/count if present)
#     edge_labels = {}
#     for u, v, data in SG.edges(data=True):
#         amt = data.get("total_amount") or data.get("amount")
#         cnt = data.get("count") or data.get("transaction_count")
#         if amt is not None and cnt is not None:
#             try:
#                 edge_labels[(u, v)] = f"{float(amt):.0f} ({int(cnt)})"
#             except Exception:
#                 edge_labels[(u, v)] = f"{amt} ({cnt})"
#         elif amt is not None:
#             try:
#                 edge_labels[(u, v)] = f"{float(amt):.0f}"
#             except Exception:
#                 edge_labels[(u, v)] = f"{amt}"

#     if edge_labels:
#         nx.draw_networkx_edge_labels(SG, pos, edge_labels=edge_labels, font_size=7)

#     path = out_dir / f"{account_id}.png"
#     plt.title(f"Transaction Subgraph: {account_id} (hops={hops})")
#     plt.axis("off")
#     plt.tight_layout()
#     plt.savefig(path, dpi=200)
#     plt.close()
#     return str(path)

# def account_counters(G: nx.DiGraph, acc: str):
#     in_neighbors = set(u for u, _ in G.in_edges(acc))
#     out_neighbors = set(v for _, v in G.out_edges(acc))
#     unique_counterparties = len(in_neighbors | out_neighbors)

#     tx_count = int(G.in_degree(acc) + G.out_degree(acc))  # edge count

#     return {
#         "transaction_count": tx_count,
#         "unique_in_counterparties": len(in_neighbors),
#         "unique_out_counterparties": len(out_neighbors),
#         "unique_counterparties": unique_counterparties,
#     }

# # -----------------------------
# # Main builder
# # -----------------------------
# def build_case_reports(top_n: int = 50):
#     # Load Neo4j transfers + graph
#     transfers = PatternDetectionAgent.load_transfers_from_neo4j()
#     G = PatternDetectionAgent.build_graph_from_neo4j_transfers(transfers)

#     # Build per-account metrics (THIS FIXES tx_count)
#     acc_stats = build_account_stats(transfers, G)

#     # Required inputs
#     risk = load_json(OUTPUT_DIR / "final_risk_scores.json")  # must be list
#     patterns = load_json(OUTPUT_DIR / "pattern_detections_langgraph.json")  # list
#     timeline = load_json(OUTPUT_DIR / "timeline_reconstruction.json") if (OUTPUT_DIR / "timeline_reconstruction.json").exists() else None
#     corr = load_json(OUTPUT_DIR / "correlation.json") if (OUTPUT_DIR / "correlation.json").exists() else None
#     txn = load_json(OUTPUT_DIR / "transaction_analysis.json") if (OUTPUT_DIR / "transaction_analysis.json").exists() else None
#     rag_reports = load_json(OUTPUT_DIR / "rag_reports.json") if (OUTPUT_DIR / "rag_reports.json").exists() else []

#     # ---- normalize risk shape ----
#     if isinstance(risk, list):
#         risk_rows = risk
#     else:
#         raise ValueError("final_risk_scores.json must be a list of risk objects")

#     # ---- index patterns by account ----
#     patterns_by_acc = defaultdict(list)
#     for d in patterns:
#         acc = d.get("account_id") or d.get("detection", {}).get("account_id")
#         if acc:
#             patterns_by_acc[acc].append(d)

#     # ---- index RAG by account ----
#     rag_by_acc = defaultdict(list)
#     for r in rag_reports:
#         acc = r.get("account_id")
#         if acc:
#             rag_by_acc[acc].append(r)

#     # ---- graph evidence from txn ----
#     centrality = (txn or {}).get("centrality", {})
#     total_flow = (txn or {}).get("total_flow", {})
#     in_deg = (txn or {}).get("in_degree", {})
#     out_deg = (txn or {}).get("out_degree", {})

#     # ---- timeline evidence (global for MVP) ----
#     timeline_summary = None
#     if isinstance(timeline, dict):
#         timeline_summary = {
#             "bursts_detected": len(timeline.get("bursts", [])),
#             "chains_detected": len(timeline.get("chains", [])),
#             "coordination_score": timeline.get("coordination_score"),
#             "reasoning": timeline.get("reasoning", "")
#         }

#     # ---- sort by risk ----
#     risk_rows_sorted = sorted(
#         risk_rows,
#         key=lambda x: x.get("risk_score", x.get("final_risk", 0)),
#         reverse=True
#     )[:top_n]

#     case_reports = []
#     for row in risk_rows_sorted:
#         acc = row["account_id"]
#         final_score = float(row.get("risk_score", row.get("final_risk", 0)) or 0.0)
#         band = row.get("risk_band") or risk_band(final_score)
#         comp = row.get("components", row.get("component_scores", {}))

#         # ---- per-account computed metrics ----
#         s = acc_stats.get(acc, {})
#         tx_count = int(s.get("transaction_count", 0))
#         total_sent_acc = float(s.get("total_sent", 0.0))
#         total_received_acc = float(s.get("total_received", 0.0))
#         connections = int(s.get("connections", 0))
#         last_activity = s.get("last_activity")

#         # ---- optional graph PNG ----
#         viz_path = save_account_subgraph_png(G, acc, hops=1)

#         # If transaction_analysis.json already has totals, prefer those (but fall back to computed)
#         tf = total_flow.get(acc, {})
#         sent_pref = tf.get("sent", total_sent_acc) if isinstance(tf, dict) else total_sent_acc
#         recv_pref = tf.get("received", total_received_acc) if isinstance(tf, dict) else total_received_acc

#         cnt = account_counters(G, acc)

#         report = {
#             "account_id": acc,

#             # ✅ add account metrics explicitly for frontend table fields
#             "account_metrics": {
#                 "transaction_count": tx_count,
#                 "connections": connections,
#                 "total_sent": sent_pref,
#                 "total_received": recv_pref,
#                 "last_activity": last_activity,
#             },

#             "risk": {
#                 "final_score": final_score,
#                 "band": band,
#                 "component_scores": comp
#             },
#             "patterns_detected": patterns_by_acc.get(acc, []),

#             "graph_evidence": {
#                 "centrality": centrality.get(acc, 0.0),
#                 "total_flow": {
#                     "sent": sent_pref,
#                     "received": recv_pref
#                 },
#                 "in_degree": in_deg.get(acc, s.get("in_degree")),
#                 "out_degree": out_deg.get(acc, s.get("out_degree")),
#                 "connections": connections,
#                 # "transaction_count": tx_count,
#                 "transaction_count": cnt["transaction_count"],

#                 # ✅ NEW (what you should use for "Connections" in UI)
#                 "unique_counterparties": cnt["unique_counterparties"],
#                 "unique_in_counterparties": cnt["unique_in_counterparties"],
#                 "unique_out_counterparties": cnt["unique_out_counterparties"],

#                 "graph_visual_path": viz_path
#             },

#             "timeline_evidence": timeline_summary,
#             "legal_mapping": rag_by_acc.get(acc, []),
#             "next_actions": [
#                 "Verify beneficiary identities (KYC) for top counterparties",
#                 "Check whether amounts are repeatedly near thresholds (structuring)",
#                 "Request statement history for 30–90 days to confirm persistence",
#                 "Look for rapid hop chains indicating layering",
#                 "Escalate to human investigator if repeated multi-recipient transfers exist"
#             ]
#         }

#         case_reports.append(report)

#     save_json(OUTPUT_DIR / "final_case_reports.json", case_reports)
#     print(f"✅ Saved {len(case_reports)} case reports → outputs/final_case_reports.json")


# if __name__ == "__main__":
#     build_case_reports(top_n=50)




#######################last try##############################

import json
from pathlib import Path
from collections import defaultdict
import networkx as nx
import matplotlib.pyplot as plt
from datetime import datetime, timezone


from Agents.pattern_detection import PatternDetectionAgent

OUTPUT_DIR = Path("outputs")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

transfers = PatternDetectionAgent.load_transfers_from_neo4j()
G = PatternDetectionAgent.build_graph_from_neo4j_transfers(transfers)


# -----------------------------
# Helpers
# -----------------------------
def load_json(path: Path):
    return json.loads(path.read_text())

def save_json(path: Path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, indent=2))

def risk_band(score_0_100: float):
    if score_0_100 >= 70:
        return "HIGH"
    if score_0_100 >= 40:
        return "MEDIUM"
    return "LOW"

def _get_src_dst_amount(t: dict):
    """
    Make this robust to different transfer dict shapes.
    Adjust keys if your Neo4j loader uses different names.
    """
    src = (
        t.get("from_account")
        or t.get("source")
        or t.get("src")
        or t.get("sender")
        or t.get("from")
    )
    dst = (
        t.get("to_account")
        or t.get("target")
        or t.get("dst")
        or t.get("receiver")
        or t.get("to")
    )
    amt = t.get("amount") or t.get("total_amount") or t.get("value") or 0
    try:
        amt = float(amt)
    except Exception:
        amt = 0.0
    return src, dst, amt

def _parse_dt(v):
    if v is None:
        return None
    # already a datetime
    if isinstance(v, datetime):
        return v if v.tzinfo else v.replace(tzinfo=timezone.utc)

    # numeric epoch
    if isinstance(v, (int, float)):
        try:
            # detect ms vs s
            if v > 10_000_000_000:  # ms
                return datetime.fromtimestamp(v / 1000.0, tz=timezone.utc)
            return datetime.fromtimestamp(v, tz=timezone.utc)
        except Exception:
            return None

    # string
    if isinstance(v, str):
        s = v.strip()
        if not s:
            return None

        # handle trailing Z
        if s.endswith("Z"):
            s = s[:-1] + "+00:00"

        # try ISO
        try:
            dt = datetime.fromisoformat(s)
            return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
        except Exception:
            pass

        # try common formats (optional)
        fmts = [
            "%Y-%m-%d %H:%M:%S",
            "%Y-%m-%d %H:%M:%S.%f",
        ]
        for f in fmts:
            try:
                return datetime.strptime(s, f).replace(tzinfo=timezone.utc)
            except Exception:
                continue

    return None


def _get_transfer_dt(t: dict):
    # try several keys your loader might use
    for k in ["timestamp", "ts", "time", "created_at", "datetime", "date"]:
        if k in t:
            dt = _parse_dt(t.get(k))
            if dt:
                return dt
    return None


def compute_last_activity(transfers_list):
    last_by_acc = {}
    for t in transfers_list:
        if not isinstance(t, dict):
            continue
        src, dst, _ = _get_src_dst_amount(t)
        dt = _get_transfer_dt(t)
        if not src or not dst or not dt:
            continue

        if (src not in last_by_acc) or (dt > last_by_acc[src]):
            last_by_acc[src] = dt
        if (dst not in last_by_acc) or (dt > last_by_acc[dst]):
            last_by_acc[dst] = dt

    # store ISO
    return {acc: dt.astimezone(timezone.utc).isoformat() for acc, dt in last_by_acc.items()}


def humanize_since(iso_str: str):
    dt = _parse_dt(iso_str)
    if not dt:
        return None
    now = datetime.now(timezone.utc)
    sec = max(0, int((now - dt).total_seconds()))

    if sec < 60:
        return f"{sec}s ago"
    mins = sec // 60
    if mins < 60:
        return f"{mins} min ago"
    hrs = mins // 60
    if hrs < 24:
        return f"{hrs} hour ago" if hrs == 1 else f"{hrs} hours ago"
    days = hrs // 24
    return f"{days} day ago" if days == 1 else f"{days} days ago"


def compute_account_tx_metrics(transfers_list):
    """
    Returns:
      tx_count_by_acc: total number of transfers touching the account (in+out)
      unique_counterparties_by_acc: number of unique other accounts interacted with
    """
    tx_count_by_acc = defaultdict(int)
    counterparties = defaultdict(set)

    for t in transfers_list:
        if not isinstance(t, dict):
            continue
        src, dst, _amt = _get_src_dst_amount(t)
        if not src or not dst:
            continue

        # transaction count
        tx_count_by_acc[src] += 1
        tx_count_by_acc[dst] += 1

        # unique counterparties
        counterparties[src].add(dst)
        counterparties[dst].add(src)

    unique_counterparties_by_acc = {acc: len(neigh) for acc, neigh in counterparties.items()}
    return tx_count_by_acc, unique_counterparties_by_acc


def save_account_subgraph_png(G: nx.DiGraph, account_id: str, out_dir="outputs/graph_viz", hops=1):
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    # collect nodes within K hops (in + out)
    nodes = {account_id}
    frontier = {account_id}

    for _ in range(hops):
        nxt = set()
        for n in frontier:
            if n not in G:
                continue
            nxt.update([v for _, v in G.out_edges(n)])
            nxt.update([u for u, _ in G.in_edges(n)])
        nxt -= nodes
        nodes |= nxt
        frontier = nxt

    SG = G.subgraph(nodes).copy()

    if SG.number_of_nodes() <= 1:
        return None

    plt.figure(figsize=(10, 7))
    pos = nx.spring_layout(SG, seed=42)

    nx.draw_networkx_nodes(SG, pos, node_size=900)
    nx.draw_networkx_edges(SG, pos, arrows=True, arrowstyle="-|>", arrowsize=15)
    nx.draw_networkx_labels(SG, pos, font_size=8)

    edge_labels = {}
    for u, v, data in SG.edges(data=True):
        amt = data.get("total_amount") or data.get("amount")
        cnt = data.get("count") or data.get("transaction_count")
        if amt is not None and cnt is not None:
            try:
                edge_labels[(u, v)] = f"{float(amt):.0f} ({int(cnt)})"
            except Exception:
                edge_labels[(u, v)] = f"{amt} ({cnt})"
        elif amt is not None:
            try:
                edge_labels[(u, v)] = f"{float(amt):.0f}"
            except Exception:
                edge_labels[(u, v)] = f"{amt}"

    if edge_labels:
        nx.draw_networkx_edge_labels(SG, pos, edge_labels=edge_labels, font_size=7)

    path = out_dir / f"{account_id}.png"
    plt.title(f"Transaction Subgraph: {account_id} (hops={hops})")
    plt.axis("off")
    plt.tight_layout()
    plt.savefig(path, dpi=200)
    plt.close()
    return str(path)


# -----------------------------
# Main builder
# -----------------------------
def build_case_reports(top_n: int = 50):
    risk = load_json(OUTPUT_DIR / "final_risk_scores.json")
    patterns = load_json(OUTPUT_DIR / "pattern_detections_langgraph.json")
    timeline = load_json(OUTPUT_DIR / "timeline_reconstruction.json") if (OUTPUT_DIR / "timeline_reconstruction.json").exists() else None
    txn = load_json(OUTPUT_DIR / "transaction_analysis.json") if (OUTPUT_DIR / "transaction_analysis.json").exists() else None
    rag_reports = load_json(OUTPUT_DIR / "rag_reports.json") if (OUTPUT_DIR / "rag_reports.json").exists() else []

    # ✅ risk is LIST format
    if not isinstance(risk, list):
        raise ValueError("final_risk_scores.json must be a list of risk objects")
    risk_rows = risk

    # index patterns by account
    patterns_by_acc = defaultdict(list)
    for d in patterns:
        acc = d.get("account_id") or d.get("detection", {}).get("account_id")
        if acc:
            patterns_by_acc[acc].append(d)

    # index RAG by account
    rag_by_acc = defaultdict(list)
    for r in rag_reports:
        acc = r.get("account_id")
        if acc:
            rag_by_acc[acc].append(r)

    # graph evidence from txn_analysis.json (optional)
    centrality = (txn or {}).get("centrality", {})
    total_flow = (txn or {}).get("total_flow", {})
    in_deg = (txn or {}).get("in_degree", {})
    out_deg = (txn or {}).get("out_degree", {})

    # ✅ NEW: compute tx_count + unique counterparties from raw transfers
    tx_count_by_acc, unique_counterparties_by_acc = compute_account_tx_metrics(transfers)

    # timeline summary
    timeline_summary = None
    if isinstance(timeline, dict):
        timeline_summary = {
            "bursts_detected": len(timeline.get("bursts", [])),
            "chains_detected": len(timeline.get("chains", [])),
            "coordination_score": timeline.get("coordination_score"),
            "reasoning": timeline.get("reasoning", ""),
        }

    # sort by risk
    risk_rows_sorted = sorted(
        risk_rows,
        key=lambda x: x.get("risk_score", x.get("final_risk", x.get("final_score", 0))),
        reverse=True
    )[:top_n]

    last_activity_by_acc = compute_last_activity(transfers)


    case_reports = []
    for row in risk_rows_sorted:
        acc = row["account_id"]
        final_score = row.get("risk_score", row.get("final_risk", row.get("final_score", 0)))
        try:
            final_score = float(final_score)
        except Exception:
            final_score = 0.0

        band = row.get("risk_band") or risk_band(final_score)
        comp = row.get("components", row.get("component_scores", {}))

        viz_path = save_account_subgraph_png(G, acc, hops=1)

        report = {
            "account_id": acc,
            "last_activity": last_activity_by_acc.get(acc),
            "last_activity_human": humanize_since(last_activity_by_acc.get(acc)) if last_activity_by_acc.get(acc) else None,

            "risk": {
                "final_score": final_score,
                "band": band,
                "component_scores": comp
            },
            "patterns_detected": patterns_by_acc.get(acc, []),
            "graph_evidence": {
                "centrality": centrality.get(acc, 0.0),
                "total_flow": total_flow.get(acc, {}),
                "in_degree": in_deg.get(acc),
                "out_degree": out_deg.get(acc),

                # ✅ IMPORTANT: these two fix your UI
                "transaction_count": int(tx_count_by_acc.get(acc, 0)),
                "unique_counterparties": int(unique_counterparties_by_acc.get(acc, 0)),

                "graph_visual_path": viz_path
            },
            "timeline_evidence": timeline_summary,
            "legal_mapping": rag_by_acc.get(acc, []),
            "next_actions": [
                "Verify beneficiary identities (KYC) for top counterparties",
                "Check whether amounts are repeatedly near thresholds (structuring)",
                "Request statement history for 30–90 days to confirm persistence",
                "Look for rapid hop chains indicating layering",
                "Escalate to human investigator if repeated multi-recipient transfers exist"
            ]
        }

        case_reports.append(report)

    save_json(OUTPUT_DIR / "final_case_reports.json", case_reports)
    print(f"✅ Saved {len(case_reports)} case reports → outputs/final_case_reports.json")


if __name__ == "__main__":
    build_case_reports(top_n=50)
