def correlation_score(sim):
    return (
        0.4 * sim["recipient"]
        + 0.35 * sim["amount"]
        + 0.25 * sim["temporal"]
    )
