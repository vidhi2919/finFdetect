def validate_schema(transactions, metadata):
    txn_required = {
        "transaction_id", "account_id", "credit", "debit"
    }
    meta_required = {
        "transaction_id", "timestamp", "counterparty_account_id"
    }

    if not txn_required.issubset(transactions.columns):
        raise ValueError("transactions.csv schema mismatch")

    if not meta_required.issubset(metadata.columns):
        raise ValueError("metadata.csv schema mismatch")
