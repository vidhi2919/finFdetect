def build_transfers(transactions, metadata):
    debits = transactions[transactions["debit"] > 0]
    credits = transactions[transactions["credit"] > 0]

    paired = debits.merge(
        credits,
        on="transaction_id",
        suffixes=("_sender", "_receiver")
    )

    paired = paired.merge(
        metadata[["transaction_id", "timestamp"]],
        on="transaction_id",
        how="left"
    )

    if paired["timestamp"].isnull().any():
        raise ValueError("Missing timestamps detected")

    transfers = []

    for _, row in paired.iterrows():
        amount_sent = row["debit_sender"]
        amount_received = row["credit_receiver"]

        if amount_sent != amount_received:
            continue  # reject inconsistent transfer

        transfers.append({
            "transaction_id": row["transaction_id"],
            "sender": row["account_id_sender"],
            "receiver": row["account_id_receiver"],
            "amount": amount_sent,
            "timestamp": row["timestamp"]
        })

    return transfers
