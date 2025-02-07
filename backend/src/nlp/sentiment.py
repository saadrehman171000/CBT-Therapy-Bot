import google.generativeai as genai
from typing import Dict
from src.utils.config import Config
import json
import re

class SentimentAnalyzer:
    def __init__(self):
        genai.configure(api_key=Config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(Config.MODEL_NAME)

    async def analyze(self, text: str) -> Dict:
        """Analyze sentiment of text using Gemini"""
        try:
            prompt = f"""Analyze the emotional content of this text: "{text}"
            Consider the context and nuance of the message.
            Respond with ONLY this exact JSON format (no markdown, no backticks):
            {{
                "sentiment_score": (number between -1 and 1),
                "primary_emotion": (choose the most accurate: happy, sad, angry, anxious, neutral, confused, hopeful, concerned),
                "emotion_intensity": (number between 1 and 10, based on language intensity),
                "identified_mood": (choose the most accurate: positive, negative, neutral, questioning, concerned, determined, uncertain)
            }}"""

            response = self.model.generate_content(prompt)
            
            # Clean and parse response
            try:
                cleaned_response = response.text.strip()
                # Remove any markdown formatting
                cleaned_response = re.sub(r'```.*?\n|```', '', cleaned_response, flags=re.DOTALL)
                sentiment_data = json.loads(cleaned_response)
                
                # Validate and provide defaults if needed
                return {
                    "sentiment_score": float(sentiment_data.get("sentiment_score", 0)),
                    "primary_emotion": str(sentiment_data.get("primary_emotion", "neutral")),
                    "emotion_intensity": int(sentiment_data.get("emotion_intensity", 5)),
                    "identified_mood": str(sentiment_data.get("identified_mood", "neutral"))
                }
            except (json.JSONDecodeError, ValueError, AttributeError) as e:
                print(f"Error parsing response: {str(e)}")
                print(f"Raw response: {response.text}")
                return self._get_default_sentiment()
                
        except Exception as e:
            print(f"Error in sentiment analysis: {str(e)}")
            return self._get_default_sentiment()

    def _get_default_sentiment(self) -> Dict:
        """Return default sentiment values"""
        return {
            "sentiment_score": 0,
            "primary_emotion": "neutral",
            "emotion_intensity": 5,
            "identified_mood": "neutral"
        } 