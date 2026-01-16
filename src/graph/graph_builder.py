# import networkx as nx
# import pandas as pd


# def build_transaction_graph(canonical_df):
#     G = nx.DiGraph()

#     for _, row in canonical_df.iterrows():
#         sender = row["sender_account_id"]
#         receiver = row["receiver_account_id"]

#         G.add_node(sender)
#         G.add_node(receiver)

#         G.add_edge(
#             sender,
#             receiver,
#             transaction_id=row["transaction_id"],
#             amount=row["amount"],
#             timestamp=row["timestamp"]
#         )

#     return G


# def export_graph(G, output_dir):
#     nodes = [{"account_id": n} for n in G.nodes()]
#     edges = []

#     for u, v, data in G.edges(data=True):
#         edges.append({
#             "sender": u,
#             "receiver": v,
#             "transaction_id": data["transaction_id"],
#             "amount": data["amount"],
#             "timestamp": data["timestamp"]
#         })

#     nodes_df = pd.DataFrame(nodes)
#     edges_df = pd.DataFrame(edges)

#     nodes_df.to_csv(f"{output_dir}/nodes.csv", index=False)
#     edges_df.to_csv(f"{output_dir}/edges.csv", index=False)
#     edges_df.to_csv(f"{output_dir}/transfers.csv", index=False)
