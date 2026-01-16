import os
from anthropic import Anthropic

def get_claude_client():
    """
    Initialize the Claude API client using ANTHROPIC_API_KEY.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY environment variable not set.")
    return Anthropic(api_key=api_key)
