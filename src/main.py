from ingestion.load_data import load_data
from ingestion.validate_schema import validate_schema
from preprocessing.build_transfers import build_transfers
from graph.build_graph import build_transaction_graph
from agents.transaction_analysis_agent import transaction_analysis_agent

def main():
    transactions, metadata = load_data()
    validate_schema(transactions, metadata)

    transfers = build_transfers(transactions, metadata)
    graph = build_transaction_graph(transfers)

    analysis = transaction_analysis_agent(graph)

    for account, metrics in list(analysis.items())[:5]:
        print(account, metrics)

if __name__ == "__main__":
    main()
