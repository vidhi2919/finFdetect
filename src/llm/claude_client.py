import os

try:
    import anthropic
except ImportError:
    anthropic = None


def call_claude(prompt: str, model: str = "claude-3-sonnet-20240229") -> str:
    """
    Calls Claude to generate an explanation for a fraud case.

    If Claude / API key is unavailable, returns a safe fallback explanation.
    """

    api_key = os.getenv("ANTHROPIC_API_KEY")

    # Fallback mode (important for offline runs, judges, CI)
    if anthropic is None or not api_key:
        return (
            "LLM explanation unavailable.\n\n"
            "This case shows correlated transaction behavior across multiple accounts "
            "within a short time window. The pattern is consistent with coordinated "
            "micro-transactions and warrants further manual investigation."
        )

    client = anthropic.Anthropic(api_key=api_key)

    response = client.messages.create(
        model=model,
        max_tokens=400,
        temperature=0.2,  # LOW temperature for analytical consistency
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.content[0].text
