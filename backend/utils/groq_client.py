import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv(dotenv_path=".env")

# Get the API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable is not set")

# Initialize the Groq client
client = Groq(api_key=GROQ_API_KEY)

# Centralize model configuration
GROQ_MODEL_CONFIG = {
    "model": "llama-3.3-70b-versatile",
    "temperature": 0.3,
    "max_tokens": 2000,
    "top_p": 0.9,
}

def get_groq_client() -> Groq:
    """Returns the initialized Groq client."""
    return client

def get_model_config() -> dict:
    """Returns the centralized Groq model configuration."""
    return GROQ_MODEL_CONFIG
