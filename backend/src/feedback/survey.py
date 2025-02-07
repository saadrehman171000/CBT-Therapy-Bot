from typing import Dict, List
import json
from datetime import datetime

class UserFeedback:
    def __init__(self):
        self.survey_responses = []
        self.survey_questions = {
            'experience_rating': {
                'question': 'How would you rate your overall experience with the chatbot today?',
                'options': ['Very Poor', 'Poor', 'Neutral', 'Good', 'Very Good']
            },
            'helpfulness': {
                'question': 'Did the chatbot help you with the mental health issue you were addressing?',
                'options': ['Yes, it helped a lot', 'Yes, it helped somewhat', 'No, it did not help', 'Not useful at all']
            },
            'understanding': {
                'question': 'How easy was it to understand and follow the chatbot\'s responses?',
                'options': ['Very difficult', 'Somewhat difficult', 'Neutral', 'Easy', 'Very easy']
            },
            'emotion_accuracy': {
                'question': 'Did you feel that the chatbot understood your emotions or mood?',
                'options': ['Very accurate', 'Somewhat accurate', 'Not accurate', 'Not sure']
            },
            'future_use': {
                'question': 'How likely are you to use this chatbot again in the future?',
                'options': ['Very unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very likely']
            }
        }

    def post_session_survey(self, user_responses: Dict) -> Dict:
        """Record post-session survey responses"""
        survey_record = {
            'timestamp': datetime.now().isoformat(),
            'responses': user_responses,
            'session_id': len(self.survey_responses) + 1
        }
        self.survey_responses.append(survey_record)
        return survey_record

    def analyze_feedback(self) -> Dict:
        """Analyze survey responses"""
        if not self.survey_responses:
            return {"error": "No survey responses available"}

        analysis = {
            'total_responses': len(self.survey_responses),
            'average_ratings': {},
            'satisfaction_rate': 0,
            'understanding_rate': 0,
            'improvement_suggestions': []
        }

        # Calculate averages for each question
        for response in self.survey_responses:
            for key, value in response['responses'].items():
                if key not in analysis['average_ratings']:
                    analysis['average_ratings'][key] = []
                analysis['average_ratings'][key].append(value)

        # Convert to percentages
        for key in analysis['average_ratings']:
            values = analysis['average_ratings'][key]
            if key == 'experience_rating':
                positive_responses = sum(1 for v in values if v in ['Good', 'Very Good'])
                analysis['satisfaction_rate'] = (positive_responses / len(values)) * 100

        return analysis

    def save_feedback(self, filename: str = 'feedback_data.json'):
        """Save feedback data to file"""
        data = {
            'survey_responses': self.survey_responses,
            'last_updated': datetime.now().isoformat()
        }
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)

    def load_feedback(self, filename: str = 'feedback_data.json'):
        """Load feedback data from file"""
        try:
            with open(filename, 'r') as f:
                data = json.load(f)
                self.survey_responses = data.get('survey_responses', [])
        except FileNotFoundError:
            print(f"No feedback data file found at {filename}") 