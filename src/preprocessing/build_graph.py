import pandas as pd
import networkx as nx

def build_transaction_graph(transactions_csv: str, metadata_csv: str) -> nx.DiGraph:
    """
    Build a directed transaction graph from CSV files.
    Nodes: account_id
    Edges: sender -> receiver with attributes: amount, transaction_count
    """
    G = nx.DiGraph()

    # Load CSVs
    transactions = pd.read_csv(transactions_csv)
    metadata = pd.read_csv(metadata_csv)

    # Merge transactions with metadata to find counterparty
    df = pd.merge(
        transactions,
        metadata[['transaction_id', 'counterparty_account_id']],
        on='transaction_id',
        how='left'
    )

    # Each transaction is represented by sender -> receiver
    for _, row in df.iterrows():
        if row['debit'] > 0:  # sender
            sender = row['account_id']
            receiver = row['counterparty_account_id']
            amount = row['debit']

            if G.has_edge(sender, receiver):
                G[sender][receiver]['total_amount'] += amount
                G[sender][receiver]['transaction_count'] += 1
            else:
                G.add_edge(
                    sender,
                    receiver,
                    total_amount=amount,
                    transaction_count=1
                )

    return G
