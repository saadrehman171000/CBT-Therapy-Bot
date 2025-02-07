from typing import Dict, List
import re
from textblob import TextBlob
import spacy

class TextAnalyzer:
    def __init__(self):
        self.nlp = spacy.load('en_core_web_sm')
        
    def analyze_cognitive_distortions(self, text: str) -> List[Dict]:
        """Identify potential cognitive distortions in text"""
        distortions = {
            'all_or_nothing': r'\b(always|never|everything|nothing)\b',
            'overgeneralization': r'\b(every\stime|everyone|nobody)\b',
            'catastrophizing': r'\b(terrible|awful|disaster|horrible)\b',
            'should_statements': r'\b(should|must|have\sto)\b'
        }
        
        found_distortions = []
        doc = self.nlp(text)
        
        for d_type, pattern in distortions.items():
            matches = re.finditer(pattern, text.lower())
            for match in matches:
                found_distortions.append({
                    'type': d_type,
                    'text': match.group(),
                    'position': match.span()
                })
                
        return found_distortions
    
    def extract_key_concerns(self, text: str) -> List[str]:
        """Extract main concerns/topics from text"""
        doc = self.nlp(text)
        return [chunk.text for chunk in doc.noun_chunks]
    
    def analyze_emotional_patterns(self, texts: List[str]) -> Dict:
        """Analyze emotional patterns over multiple messages"""
        emotions = []
        for text in texts:
            blob = TextBlob(text)
            emotions.append(blob.sentiment.polarity)
            
        return {
            'trend': 'improving' if sum(emotions) > 0 else 'declining',
            'volatility': sum(abs(x - sum(emotions)/len(emotions)) for x in emotions),
            'average_sentiment': sum(emotions)/len(emotions)
        } 