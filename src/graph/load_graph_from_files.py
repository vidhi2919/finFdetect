import pandas as pd
import networkx as nx

def load_graph_from_files(nodes_path, edges_path, transfers_path):
    G = nx.DiGraph()

    nodes = pd.read_csv(nodes_path)
    for _, row in nodes.iterrows():
        G.add_node(row['account_id'], **row.to_dict())

    edges = pd.read_csv(edges_path)
    for _, row in edges.iterrows():
        G.add_edge(row['source'], row['target'], **row.to_dict())

    # Optional: attach transfers data if needed
    transfers = pd.read_csv(transfers_path)
    G.graph['transfers'] = transfers

    return G
