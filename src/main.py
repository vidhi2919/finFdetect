from preprocessing.build_graph import build_transaction_graph
from agents.transaction_analysis_agent import transaction_analysis_agent
from agents.generative_agent import ClaudeGenerativeAgent
from agents.flags import derive_flags

def main():
    # Build graph
    graph = build_transaction_graph("data/transactions.csv", "data/metadata.csv")

    # Compute structural metrics
    account_metrics = transaction_analysis_agent(graph)

    # Initialize Claude generative agent
    gen_agent = ClaudeGenerativeAgent()

    # Explain for sample accounts
    for account_id, metrics in list(account_metrics.items())[:5]:  # first 5
        profile = {
            "account_id": account_id,
            "metrics": metrics,
            "flags": derive_flags(metrics)
        }

        explanation = gen_agent.explain_account(profile)
        print(f"\n--- Explanation for {account_id} ---\n{explanation}")

if __name__ == "__main__":
    main()
