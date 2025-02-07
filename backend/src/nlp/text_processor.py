import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

class TextProcessor:
    def __init__(self):
        nltk.download('punkt')
        nltk.download('stopwords')
        self.stop_words = set(stopwords.words('english'))
        self.inappropriate_patterns = [
            r'\b(fuck|shit|damn|bitch|sex|porn|nsfw)\b',
            r'\b(naughty|horny|sexy)\b'
        ]

    def preprocess(self, text: str) -> str:
        """Basic text preprocessing with content filtering"""
        # Check for inappropriate content
        if self._contains_inappropriate_content(text):
            return "I want to discuss something inappropriate"
            
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters
        text = re.sub(r'[^\w\s]', '', text)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        return text

    def _contains_inappropriate_content(self, text: str) -> bool:
        """Check if text contains inappropriate content"""
        text = text.lower()
        for pattern in self.inappropriate_patterns:
            if re.search(pattern, text):
                return True
        return False

    def extract_keywords(self, text: str) -> list:
        """Extract important keywords from text"""
        tokens = word_tokenize(text)
        keywords = [word for word in tokens if word.lower() not in self.stop_words]
        return keywords 