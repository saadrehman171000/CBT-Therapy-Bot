from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    MODEL_NAME = "gemini-pro"
    MAX_TOKENS = 300
    TEMPERATURE = 0.7 