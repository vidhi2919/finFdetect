from datetime import timedelta

def generate_time_windows(start_time, end_time, window_size_minutes, slide_minutes):
    """
    Generates sliding time windows between start_time and end_time.
    Returns a list of tuples: (window_start, window_end)
    """
    window_size = timedelta(minutes=window_size_minutes)
    slide = timedelta(minutes=slide_minutes)

    windows = []
    current = start_time

    while current + window_size <= end_time:
        windows.append((current, current + window_size))
        current += slide

    return windows


def extract_subgraph_by_time(graph, start_time, end_time):
    """
    Returns a subgraph containing only edges whose timestamp
    falls within [start_time, end_time].
    Nodes connected by those edges are included.
    """
    # Collect edges within the time window
    edges_in_window = [
        (u, v, data)
        for u, v, data in graph.edges(data=True)
        if start_time <= data["timestamp"] <= end_time
    ]

    # Create subgraph
    subgraph = graph.__class__()  # preserves DiGraph type

    for u, v, data in edges_in_window:
        subgraph.add_node(u)
        subgraph.add_node(v)
        subgraph.add_edge(u, v, **data)

    return subgraph
