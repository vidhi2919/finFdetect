from pathlib import Path

PROMPT_DIR = Path(__file__).parent


def load_prompt(filename: str) -> str:
    """
    Loads a prompt template from the prompts directory.
    """
    prompt_path = PROMPT_DIR / filename

    if not prompt_path.exists():
        raise FileNotFoundError(f"Prompt file not found: {prompt_path}")

    return prompt_path.read_text(encoding="utf-8")
