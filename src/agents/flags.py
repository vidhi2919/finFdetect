def derive_flags(metrics):
    """
    Simple rule-based flags for generative reasoning.
    """
    flags = []
    if metrics["in_degree"] + metrics["out_degree"] > 30:
        flags.append("high_connectivity")
    if metrics["betweenness_centrality"] > 0.01:
        flags.append("high_intermediary_role")
    if abs(metrics["net_flow"]) < 10000:
        flags.append("pass_through_behavior")
    return flags
