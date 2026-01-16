from itertools import combinations
from .feature_extractor import extract_features
from .similarity import jaccard, cosine
from .scorer import correlation_score
import numpy as np


def run_correlation(graph, start_time, end_time):
    features = {}

    for node in graph.nodes():
        f = extract_features(node, graph, start_time, end_time)
        if f:
            features[node] = f

    correlations = []

    for a, b in combinations(features.keys(), 2):
        fa, fb = features[a], features[b]

        amount_sim = cosine(
            np.array([
                fa["mean_amount"], fa["std_amount"],
                fa["min_amount"], fa["max_amount"]
            ]),
            np.array([
                fb["mean_amount"], fb["std_amount"],
                fb["min_amount"], fb["max_amount"]
            ])
        )

        recipient_sim = jaccard(
            fa["recipient_set"], fb["recipient_set"]
        )

        temporal_sim = 1.0 if abs(
            (fa["mean_interarrival"] or 0) -
            (fb["mean_interarrival"] or 0)
        ) < 60 else 0.0

        score = correlation_score({
            "amount": amount_sim,
            "recipient": recipient_sim,
            "temporal": temporal_sim
        })

        if score >= 0.7:
            correlations.append((a, b, score))

    return correlations
