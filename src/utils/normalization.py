def min_max_normalize(values):
    min_v, max_v = min(values), max(values)
    if max_v == min_v:
        return [0] * len(values)
    return [(v - min_v) / (max_v - min_v) for v in values]
