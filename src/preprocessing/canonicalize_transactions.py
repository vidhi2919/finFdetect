import pandas as pd


def load_and_validate(transactions_path, metadata_path):
    tx = pd.read_csv(transactions_path)
    meta = pd.read_csv(metadata_path)

    REQUIRED_TX = {
        "transaction_id", "account_id",
        "credit", "debit", "date", "time"
    }

    REQUIRED_META = {
        "transaction_id", "timestamp", "counterparty_account_id"
    }

    if not REQUIRED_TX.issubset(tx.columns):
        raise ValueError("transactions.csv missing required columns")

    if not REQUIRED_META.issubset(meta.columns):
        raise ValueError("metadata.csv missing required columns")

    return tx, meta


def canonicalize_transactions(tx, meta):
    # Validate exactly two rows per transaction
    counts = tx.groupby("transaction_id").size()
    if not (counts == 2).all():
        raise ValueError("Each transaction_id must have exactly two rows")

    debits = tx[tx["debit"] > 0].copy()
    credits = tx[tx["credit"] > 0].copy()

    merged = debits.merge(
        credits,
        on="transaction_id",
        suffixes=("_sender", "_receiver")
    )

    meta["timestamp"] = pd.to_datetime(meta["timestamp"])

    canonical = pd.DataFrame({
        "transaction_id": merged["transaction_id"],
        "sender_account_id": merged["account_id_sender"],
        "receiver_account_id": merged["account_id_receiver"],
        "amount": merged["debit_sender"],
    })

    canonical = canonical.merge(
        meta[["transaction_id", "timestamp"]],
        on="transaction_id",
        how="left"
    )

    if canonical["timestamp"].isnull().any():
        raise ValueError("Missing timestamp in metadata")

    canonical = canonical.sort_values("timestamp")

    return canonical
