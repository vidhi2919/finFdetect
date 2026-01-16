from collections import defaultdict
import numpy as np


class CorrelationCaseAggregator:
    """
    Aggregates window-level correlation signals into
    case-level evidence and account-level scores.
    """

    def __init__(self):
        self.cases = defaultdict(list)

    def add_window_results(self, window_start, window_end, pairwise_results):
        """
        pairwise_results: list of dicts from CorrelationAgent
        """
        for r in pairwise_results:
            a, b = sorted([r["account_a"], r["account_b"]])
            case_id = f"{a}_{b}"

            self.cases[case_id].append({
                "accounts": (a, b),
                "window_start": window_start,
                "window_end": window_end,
                "score": r["score"],
                "recipient_similarity": r["recipient_similarity"],
                "amount_similarity": r["amount_similarity"],
                "temporal_similarity": r["temporal_similarity"]
            })

    def build_cases(self):
        """
        Returns aggregated case-level objects
        """
        aggregated_cases = []

        for case_id, entries in self.cases.items():
            scores = [e["score"] for e in entries]

            aggregated_cases.append({
                "case_id": case_id,
                "accounts": list(entries[0]["accounts"]),
                "first_seen": min(e["window_start"] for e in entries),
                "last_seen": max(e["window_end"] for e in entries),
                "windows_detected": len(entries),
                "avg_score": float(np.mean(scores)),
                "max_score": float(np.max(scores)),
                "components": {
                    "recipient_similarity": float(np.mean([e["recipient_similarity"] for e in entries])),
                    "amount_similarity": float(np.mean([e["amount_similarity"] for e in entries])),
                    "temporal_similarity": float(np.mean([e["temporal_similarity"] for e in entries]))
                }
            })

        return aggregated_cases

    def build_account_scores(self, aggregated_cases):
        """
        Produces account-level correlation scores
        """
        account_scores = defaultdict(float)

        for case in aggregated_cases:
            weight = case["avg_score"] * case["windows_detected"]
            for acc in case["accounts"]:
                account_scores[acc] += weight

        return dict(account_scores)
