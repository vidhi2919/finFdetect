import networkx as nx

def transaction_analysis_agent(G):
    results = {}

    betweenness = nx.betweenness_centrality(
        G,
        weight="total_amount",
        normalized=True
    )

    for node in G.nodes():
        in_edges = G.in_edges(node, data=True)
        out_edges = G.out_edges(node, data=True)

        total_received = sum(e[2]["total_amount"] for e in in_edges)
        total_sent = sum(e[2]["total_amount"] for e in out_edges)

        in_txns = sum(e[2]["transaction_count"] for e in in_edges)
        out_txns = sum(e[2]["transaction_count"] for e in out_edges)

        results[node] = {
            "in_degree": G.in_degree(node),
            "out_degree": G.out_degree(node),
            "total_received": total_received,
            "total_sent": total_sent,
            "net_flow": total_received - total_sent,
            "avg_txn_amount_in": total_received / in_txns if in_txns else 0,
            "avg_txn_amount_out": total_sent / out_txns if out_txns else 0,
            "betweenness_centrality": betweenness.get(node, 0)
        }

    return results
