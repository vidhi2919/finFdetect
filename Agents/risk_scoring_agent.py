# # agents/risk_scoring_agent.py

# from typing import Dict
# from transaction_analysis import load_transfers_from_neo4j
# from pattern_detection import PatternDetectionAgent
# from correlation_agent import CorrelationAgent
# from Timeline_Reconstruction_agent import TimelineAgent


# class RiskScoringAgent:
#     """
#     STEP 2: Deterministic Risk Scoring & Prioritization

#     Inputs:
#     - Flow/Centrality Agent
#     - Pattern Detection Agent
#     - Correlation Agent
#     - Timeline Agent

#     Output:
#     - Final Risk Score (0–1)
#     - Priority Label
#     """

#     def __init__(self, graph):
#         self.graph = graph

#         self.weights = {
#             "flow": 0.30,
#             "pattern": 0.30,
#             "correlation": 0.20,
#             "timeline": 0.20
#         }

#     # --------------------------------------------------
#     # MAIN ENTRY
#     # --------------------------------------------------

#     def run(self):
#         flow_scores = self._get_flow_scores()
#         pattern_scores = self._get_pattern_scores()
#         correlation_scores = self._get_correlation_scores()
#         timeline_scores = self._get_timeline_scores()

#         final_risk = self._fuse_scores(
#             flow_scores,
#             pattern_scores,
#             correlation_scores,
#             timeline_scores
#         )

#         priority = self._assign_priority(final_risk)

#         return {
#             "final_risk": final_risk,
#             "priority": priority
#         }

#     # --------------------------------------------------
#     # AGENT INPUT PREPARATION
#     # --------------------------------------------------

#     @staticmethod
#     def normalize(value, min_val, max_val):
#         if max_val == min_val:
#             return 0.0
#         return max(0.0, min(1.0, (value - min_val) / (max_val - min_val)))


#     @staticmethod
#     def normalize_dict(d: dict):
#         if not d:
#             return {}

#         min_val = min(d.values())
#         max_val = max(d.values())

#         # call the static normalize via the class to avoid name resolution issues
#         return {k: RiskScoringAgent.normalize(v, min_val, max_val) for k, v in d.items()}

#     def _get_flow_scores(self) -> Dict[str, float]:
#         agent = TransactionAnalysisAgent(self.graph)
#         results = agent.compute_metrics()

#         raw_scores = {
#             acc: data["centrality_score"]
#             for acc, data in results.items()
#         }

#         return self.normalize_dict(raw_scores)

#     def _get_pattern_scores(self) -> Dict[str, float]:
#         agent = PatternDetectionAgent(self.graph)
#         detections = agent.detect_all_patterns()

#         pattern_scores = {}
#         for d in detections:
#             acc = d.account_id
#             pattern_scores[acc] = max(
#                 pattern_scores.get(acc, 0),
#                 d.severity
#             )

#         return self.normalize_dict(pattern_scores)

#     def _get_correlation_scores(self) -> Dict[str, float]:
#         agent = CorrelationAgent(self.graph)
#         results = agent.run()

#         raw_scores = {
#             acc: metrics["correlation_strength"]
#             for acc, metrics in results.items()
#         }

#         return self.normalize_dict(raw_scores)

#     def _get_timeline_scores(self) -> Dict[str, float]:
#         agent = TimelineAgent(self.graph)
#         results = agent.analyze()

#         raw_scores = {
#             acc: metrics["coordination_score"]
#             for acc, metrics in results.items()
#         }

#         return self.normalize_dict(raw_scores)

#     # --------------------------------------------------
#     # SCORE FUSION
#     # --------------------------------------------------

#     def _fuse_scores(self, flow, pattern, correlation, timeline):
#         accounts = set(flow) | set(pattern) | set(correlation) | set(timeline)
#         final_scores = {}

#         for acc in accounts:
#             final_scores[acc] = round(
#                 self.weights["flow"] * flow.get(acc, 0)
#                 + self.weights["pattern"] * pattern.get(acc, 0)
#                 + self.weights["correlation"] * correlation.get(acc, 0)
#                 + self.weights["timeline"] * timeline.get(acc, 0),
#                 3
#             )

#         return final_scores

#     # --------------------------------------------------
#     # PRIORITIZATION
#     # --------------------------------------------------

#     @staticmethod
#     def _assign_priority(final_scores: Dict[str, float]):
#         priority = {}

#         for acc, score in final_scores.items():
#             if score >= 0.7:
#                 priority[acc] = "HIGH"
#             elif score >= 0.4:
#                 priority[acc] = "MEDIUM"
#             else:
#                 priority[acc] = "LOW"

#         return priority



import json
from typing import Dict, List
from pathlib import Path

OUTPUT_DIR = Path("outputs")

# =========================
# CONFIG (V1)
# =========================

WEIGHTS = {
    "flow": 0.30,
    "pattern": 0.30,
    "correlation": 0.20,
    "timeline": 0.20
}

RISK_BANDS = {
    "HIGH": 70,
    "MEDIUM": 40
}


# =========================
# UTILS
# =========================

def load_json(filename: str):
    path = OUTPUT_DIR / filename
    if not path.exists():
        raise FileNotFoundError(f"Missing required file: {path}")
    with open(path) as f:
        return json.load(f)


def normalize(value, max_value):
    if max_value == 0:
        return 0.0
    return min(value / max_value, 1.0)


# =========================
# LOAD AGENT OUTPUTS
# =========================

def load_agent_outputs():
    return {
        "correlation": load_json("correlation_agent.json"),
        "patterns": load_json("pattern_detections.json"),
        "pattern_summary": load_json("pattern_detection_summary.json"),
        "timeline": load_json("timeline_reconstruction.json"),
        "transaction": load_json("transaction_analysis.json")
    }


# =========================
# SCORE COMPUTATION
# =========================

def compute_flow_score(account_id: str, tx_data: Dict) -> float:
    flow = tx_data["total_flow"].get(account_id, {"sent": 0, "received": 0})
    centrality = tx_data["centrality"].get(account_id, 0)

    total_flow = flow["sent"] + flow["received"]

    # Heuristic caps (V1)
    flow_score = normalize(total_flow, 1_000_000)
    centrality_score = normalize(centrality, 0.05)

    return round(0.6 * flow_score + 0.4 * centrality_score, 3)


def compute_pattern_score(account_id: str, patterns: List[Dict]) -> float:
    scores = [
        p["severity"]
        for p in patterns
        if p["account_id"] == account_id
    ]
    if not scores:
        return 0.0
    return round(min(sum(scores) / len(scores), 1.0), 3)


def compute_correlation_score(account_id: str, corr: Dict) -> float:
    sent = corr["total_sent"].get(account_id, 0)
    received = corr["total_received"].get(account_id, 0)
    centrality = corr["centrality"].get(account_id, 0)

    flow_score = normalize(sent + received, 1_000_000)
    centrality_score = normalize(centrality, 0.05)

    return round(0.5 * flow_score + 0.5 * centrality_score, 3)


def compute_timeline_score(account_id: str, timeline: Dict) -> float:
    score = timeline["coordination_score"]
    return normalize(score, 20)


# =========================
# MAIN RISK ENGINE
# =========================

def compute_risk_scores():
    data = load_agent_outputs()

    # Collect all accounts seen anywhere
    accounts = set()

    accounts |= set(data["transaction"]["centrality"].keys())
    accounts |= set(data["correlation"]["centrality"].keys())
    accounts |= {p["account_id"] for p in data["patterns"]}

    results = []

    for acc in accounts:
        flow_score = compute_flow_score(acc, data["transaction"])
        pattern_score = compute_pattern_score(acc, data["patterns"])
        correlation_score = compute_correlation_score(acc, data["correlation"])
        timeline_score = compute_timeline_score(acc, data["timeline"])

        final_score = 100 * (
            WEIGHTS["flow"] * flow_score +
            WEIGHTS["pattern"] * pattern_score +
            WEIGHTS["correlation"] * correlation_score +
            WEIGHTS["timeline"] * timeline_score
        )

        final_score = round(final_score, 2)

        if final_score >= RISK_BANDS["HIGH"]:
            band = "HIGH"
        elif final_score >= RISK_BANDS["MEDIUM"]:
            band = "MEDIUM"
        else:
            band = "LOW"

        results.append({
            "account_id": acc,
            "risk_score": final_score,
            "risk_band": band,
            "components": {
                "flow": flow_score,
                "pattern": pattern_score,
                "correlation": correlation_score,
                "timeline": timeline_score
            }
        })

    results.sort(key=lambda x: x["risk_score"], reverse=True)
    return results


# =========================
# RUNNER
# =========================

if __name__ == "__main__":
    print("⚠️ Risk Scoring Engine (Deterministic V1)")
    print("=" * 60)

    scores = compute_risk_scores()

    with open("outputs/final_risk_scores.json", "w") as f:
        json.dump(scores, f, indent=2)

    print(f"✓ Scored {len(scores)} accounts")
    print("💾 Saved → outputs/final_risk_scores.json")

    print("\n🔴 Top 10 High-Risk Accounts:")
    for r in scores[:10]:
        print(f"{r['account_id']} → {r['risk_score']} ({r['risk_band']})")
