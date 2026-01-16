import pandas as pd
from pathlib import Path

def load_graph_artifacts(graph_dir="graph_output"):
    graph_dir = Path(graph_dir)

    edges = pd.read_csv(graph_dir / "edges.csv", parse_dates=["timestamp"])
    nodes = pd.read_csv(graph_dir / "nodes.csv")
    transfers = pd.read_csv(graph_dir / "transfers.csv", parse_dates=["timestamp"])

    return {
        "edges": edges,
        "nodes": nodes,
        "transfers": transfers
    }
