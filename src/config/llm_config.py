import os
import google.generativeai as genai

def init_gemini_client():
    """
    Initializes the Gemini API client.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set.")
    
    genai.configure(api_key=api_key)
    return genai
