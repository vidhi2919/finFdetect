import pandas as pd
import networkx as nx
from datetime import datetime
from src.graph.time_windowing import generate_time_windows, extract_subgraph_by_time
from src.agents.correlation_agent_generative import CorrelationGenerativeAgent


def load_graph_from_csv(nodes_path, edges_path):
    """
    Loads nodes and edges CSVs from graph_output and returns a NetworkX DiGraph.
    Assumes edges CSV has 'sender', 'receiver', 'amount', 'timestamp' columns.
    """
    nodes_df = pd.read_csv(nodes_path)
    edges_df = pd.read_csv(edges_path)

    G = nx.DiGraph()

    # Add nodes
    for idx, row in nodes_df.iterrows():
        G.add_node(row['account_id'], **row.to_dict())

    # Add edges
    for idx, row in edges_df.iterrows():
        # Parse timestamp if string
        ts = row['timestamp']
        if isinstance(ts, str):
            ts = pd.to_datetime(ts)

        G.add_edge(row['sender'], row['receiver'],
                   amount=row.get('amount', 0),
                   timestamp=ts,
                   transaction_id=row.get('transaction_id', None))

    return G


def main():
    print("=== Load Graph Artifacts ===")
    graph = load_graph_from_csv(
        nodes_path="graph_output/nodes.csv",
        edges_path="graph_output/edges.csv"
    )
    print(f"Graph loaded: {graph.number_of_nodes()} nodes, {graph.number_of_edges()} edges.")

    # Determine global start/end for windows
    all_timestamps = [data["timestamp"] for _, _, data in graph.edges(data=True)]
    start_time = min(all_timestamps)
    end_time = max(all_timestamps)

    print("=== Generate Sliding Time Windows ===")
    windows = generate_time_windows(
        start_time=start_time,
        end_time=end_time,
        window_size_minutes=30,
        slide_minutes=5
    )
    print(f"Generated {len(windows)} time windows.")
    print("Sample windows (first 3):")
    for w_start, w_end in windows[:3]:
        print(f"  {w_start} → {w_end}")

    print("=== Run Generative Correlation Agent ===")
    agent = CorrelationGenerativeAgent(correlation_threshold=0.7)

    # Limit to first 3 windows for testing
    for i, (w_start, w_end) in enumerate(windows[:3], start=1):
        subgraph = extract_subgraph_by_time(graph, w_start, w_end)
        explanation = agent.compute_and_explain(
            subgraph=subgraph,
            window_start=w_start,
            window_end=w_end
        )

        print(f"\n--- Window {i} Explanation ---\n")
        print(explanation)

    print("\n=== CORRELATION AGENT PIPELINE COMPLETE ===")


if __name__ == "__main__":
    main()
