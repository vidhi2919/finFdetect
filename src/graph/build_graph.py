import networkx as nx

def build_transaction_graph(transfers):
    G = nx.DiGraph()

    for t in transfers:
        s, r = t["sender"], t["receiver"]

        if G.has_edge(s, r):
            G[s][r]["total_amount"] += t["amount"]
            G[s][r]["transaction_count"] += 1
            G[s][r]["transactions"].append(t)
        else:
            G.add_edge(
                s, r,
                total_amount=t["amount"],
                transaction_count=1,
                transactions=[t]
            )

    return G
