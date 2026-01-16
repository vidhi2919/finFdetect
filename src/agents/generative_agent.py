from config.claude_config import get_claude_client
from pathlib import Path
import json

PROMPT_PATH = Path(__file__).resolve().parents[1] / "prompts" / "fraud_reasoning.txt"

class ClaudeGenerativeAgent:
    def __init__(self):
        self.client = get_claude_client()
        self.system_prompt = PROMPT_PATH.read_text()

    def explain_account(self, account_profile: dict) -> str:
        """
        Sends account metrics and flags to Claude and returns the explanation.
        """

        user_text = (
            f"Account Profile:\n{json.dumps(account_profile, indent=2)}\n\n"
            "Generate an investigative explanation."
        )

        response = self.client.messages.create(
            model="claude-sonnet-4-5",          # Claude model
            system=self.system_prompt,          # ✅ pass system prompt here
            messages=[
                {"role": "user", "content": user_text}  # only user messages
            ],
            max_tokens=500,
            temperature=0.2
        )

        return response.content[0].text
