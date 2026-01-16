def validate_graph(graph):
    """
    Performs strict integrity checks on the transaction graph.
    Raises ValueError on any violation.
    """

    for u, v, data in graph.edges(data=True):

        # 1. No self-loops
        if u == v:
            raise ValueError(f"Self-loop detected on account {u}")

        # 2. Amount must be positive
        if data.get("amount", 0) <= 0:
            raise ValueError(
                f"Non-positive amount on edge {u} -> {v}"
            )

        # 3. Timestamp must exist
        if "timestamp" not in data or data["timestamp"] is None:
            raise ValueError(
                f"Missing timestamp on edge {u} -> {v}"
            )

    # 4. Graph must not be empty
    if graph.number_of_nodes() == 0:
        raise ValueError("Graph has no nodes")

    if graph.number_of_edges() == 0:
        raise ValueError("Graph has no edges")

    return True
