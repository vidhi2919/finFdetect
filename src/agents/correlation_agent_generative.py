import json
from src.agents.correlation_agent import CorrelationAgent
from src.prompts.load_prompt import load_prompt
from src.llm.claude_client import call_claude
import pandas as pd

class CorrelationGenerativeAgent:
    """
    Wraps the deterministic CorrelationAgent with a generative layer.
    Uses LLM (Claude) to explain correlated pairs in natural language.
    """

    def __init__(self, correlation_threshold=0.7):
        # Backend deterministic agent
        self.backend = CorrelationAgent(correlation_threshold=correlation_threshold)
        # Prompt template for Claude explanations
        self.prompt_template = load_prompt("correlation_case_prompt.txt")

    def explain_pairs(self, correlated_pairs, window_start=None, window_end=None):
        """
        Generates a natural-language summary for the correlated pairs.
        """
        if not correlated_pairs:
            return f"No significant correlations detected between accounts in the window {window_start} → {window_end}."

        explanation_lines = []
        for pair in correlated_pairs:
            line = (
                f"Accounts {pair['account_1']} and {pair['account_2']} have a correlation score of "
                f"{pair['correlation_score']}. "
                f"Recipient similarity: {pair['recipient_sim']}, "
                f"Amount similarity: {pair['amount_sim']}, "
                f"Temporal similarity: {pair['temporal_sim']}."
            )
            explanation_lines.append(line)

        window_str = f"{window_start} → {window_end}" if window_start and window_end else "current window"
        summary = f"In the time window {window_str}, the following account pairs show suspicious coordination:\n"
        summary += "\n".join(explanation_lines)
        summary += "\n\nPotential fraud type: Coordinated micro-transactions (smurfing/layering)."
        summary += "\nRecommendation: Review these accounts and transactions for AML compliance."

        return summary

    def compute_and_explain(self, subgraph=None, window_start=None, window_end=None):
        """
        Runs the deterministic correlation computation and returns a natural-language explanation.
        """
        if subgraph is not None:
            # Pass the subgraph directly
            correlated_pairs = self.backend.compute(subgraph, window_start, window_end)
        else:
            correlated_pairs = []

        explanation = self.explain_pairs(correlated_pairs, window_start, window_end)
        return explanation

    def explain_case(self, case_obj):
        """
        Optional: Use Claude to explain a case in natural language.
        """
        prompt = self.prompt_template.replace(
            "{{CASE_JSON}}",
            json.dumps(case_obj, indent=2)
        )
        return call_claude(prompt)
