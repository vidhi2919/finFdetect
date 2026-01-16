from collections import defaultdict
import numpy as np


def extract_features(account_id, graph, start_time, end_time):
    outgoing = []

    for _, v, data in graph.out_edges(account_id, data=True):
        if start_time <= data["timestamp"] <= end_time:
            outgoing.append(data)

    if not outgoing:
        return None

    amounts = [tx["amount"] for tx in outgoing]
    timestamps = sorted([tx["timestamp"] for tx in outgoing])

    inter_arrivals = [
        (timestamps[i+1] - timestamps[i]).total_seconds()
        for i in range(len(timestamps) - 1)
    ]

    recipients = set([tx for _, tx, _ in graph.out_edges(account_id)])

    return {
        "tx_count": len(amounts),
        "mean_amount": np.mean(amounts),
        "std_amount": np.std(amounts),
        "min_amount": min(amounts),
        "max_amount": max(amounts),
        "mean_interarrival": np.mean(inter_arrivals) if inter_arrivals else None,
        "recipient_set": recipients
    }
