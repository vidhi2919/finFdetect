import itertools
import numpy as np

class CorrelationAgent:
    """
    Standalone Correlation Agent.
    Computes pairwise correlation between accounts in a subgraph.
    """

    def __init__(self, correlation_threshold=0.7):
        self.threshold = correlation_threshold

    # ------------------------------
    # Similarity Functions
    # ------------------------------
    def jaccard_similarity(self, set1, set2):
        if not set1 and not set2:
            return 0.0
        return len(set1 & set2) / len(set1 | set2)

    def amount_similarity(self, amounts1, amounts2):
        """Compute similarity based on statistics, handles empty lists"""
        def features(a):
            if len(a) == 0:
                return np.array([0.0, 0.0, 0.0, 0.0])
            return np.array([np.mean(a), np.std(a), np.min(a), np.max(a)])

        f1 = features(amounts1)
        f2 = features(amounts2)

        denom = (np.linalg.norm(f1) * np.linalg.norm(f2))
        if denom == 0:
            return 0.0
        return float(np.dot(f1, f2) / denom)

    def temporal_similarity(self, times1, times2):
        """Compute temporal similarity as Jaccard of timestamps"""
        set1 = set(times1)
        set2 = set(times2)
        if not set1 or not set2:
            return 0.0
        return len(set1 & set2) / len(set1 | set2)

    # ------------------------------
    # Main Compute Method
    # ------------------------------
    def compute(self, subgraph, window_start=None, window_end=None):
        """
        Receives: NetworkX subgraph
        Returns: list of correlated account pairs
        """
        # Extract features per node
        account_features = {}
        for node in subgraph.nodes():
            out_edges = subgraph.out_edges(node, data=True)
            recipients = set(v for _, v, _ in out_edges)
            amounts = [data["amount"] for _, _, data in out_edges]
            times = [data["timestamp"] for _, _, data in out_edges]
            account_features[node] = {
                "recipients": recipients,
                "amounts": amounts,
                "times": times
            }

        # Compute pairwise correlation
        results = []
        for acc1, acc2 in itertools.combinations(subgraph.nodes(), 2):
            f1 = account_features[acc1]
            f2 = account_features[acc2]

            r_sim = self.jaccard_similarity(f1["recipients"], f2["recipients"])
            a_sim = self.amount_similarity(f1["amounts"], f2["amounts"])
            t_sim = self.temporal_similarity(f1["times"], f2["times"])

            correlation_score = 0.4 * r_sim + 0.4 * a_sim + 0.2 * t_sim

            if correlation_score >= self.threshold:
                results.append({
                    "account_1": acc1,
                    "account_2": acc2,
                    "recipient_sim": round(r_sim, 3),
                    "amount_sim": round(a_sim, 3),
                    "temporal_sim": round(t_sim, 3),
                    "correlation_score": round(correlation_score, 3)
                })

        return results
