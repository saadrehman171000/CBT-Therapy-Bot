import google.generativeai as genai
from typing import Dict, Any
from ..nlp.sentiment import SentimentAnalyzer
from ..nlp.text_processor import TextProcessor
from ..utils.config import Config
from ..nlp.text_analyzer import TextAnalyzer
from ..tracking.progress_tracker import ProgressTracker
from ..tracking.analytics import ProgressAnalytics
from ..feedback.survey import UserFeedback
from ..bot.cbt_exercises import CBTExercises
import json
import os
from datetime import datetime
from dotenv import load_dotenv
from textblob import TextBlob

class CBTChatbot:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # Configure Google API with existing Gemini key
        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
        
        self.conversation_history = []
        self.model = genai.GenerativeModel('gemini-pro')
        self.progress_tracker = ProgressTracker()
        
        # Load existing session if available
        try:
            if os.path.exists('chat_sessions.json'):
                with open('chat_sessions.json', 'r') as f:
                    self.conversation_history = json.load(f)
                print(f"Loaded {len(self.conversation_history)} previous messages")
        except Exception as e:
            print(f"Error loading session: {e}")
            self.conversation_history = []

    async def process_message(self, user_input: str) -> Dict[str, Any]:
        try:
            # Process the message and get sentiment
            sentiment_data = self.analyze_sentiment(user_input)
            
            # Check if this is the first message
            is_first_message = len(self.conversation_history) == 0
            
            # Get conversation theme
            conversation_theme = self._get_conversation_theme()
            
            # Prepare conversation context
            context = f"""You are a CBT therapist having a focused conversation. 
            Your goal is to understand and help with the user's current situation.

            Previous messages: {self._get_recent_messages(3)}
            
            User's current state:
            - Emotion: {sentiment_data['primary_emotion']}
            - Intensity: {sentiment_data['emotion_intensity']}/10
            - Mood: {sentiment_data['identified_mood']}
            - Current theme: {conversation_theme}
            
            Response Guidelines:
            1. NO greetings (hi/hello) except for the very first message
            2. ONE short response (1-2 sentences) addressing the current topic
            3. ONE specific follow-up question
            4. NO repetition of previous suggestions
            5. NO changing topics unless user initiates
            
            Conversation state: {"Starting conversation" if is_first_message else "Ongoing conversation"}
            User's message: {user_input}
            
            Respond with one brief statement and one question:"""
            
            # Generate response using Gemini
            response = self.model.generate_content(context)
            bot_response = response.text
            
            # Update conversation history
            self.conversation_history.append({
                "user_input": user_input,
                "bot_response": bot_response,
                "sentiment": sentiment_data,
                "timestamp": datetime.now().isoformat()
            })

            # Track progress
            self.progress_tracker.add_chat_session({
                "primary_emotion": sentiment_data["primary_emotion"],
                "emotion_intensity": sentiment_data["emotion_intensity"],
                "identified_mood": sentiment_data["identified_mood"]
            })

            return {
                "response": bot_response,
                "sentiment": sentiment_data,
                "conversation_id": len(self.conversation_history)
            }
            
        except Exception as e:
            print(f"Error in process_message: {str(e)}")
            return {
                "response": "I'm having trouble connecting to the service. Please try again in a moment.",
                "sentiment": {
                    "primary_emotion": "neutral",
                    "emotion_intensity": 5,
                    "identified_mood": "neutral"
                },
                "conversation_id": len(self.conversation_history)
            }

    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment of text using TextBlob and custom rules"""
        try:
            blob = TextBlob(text)
            
            # Map polarity to emotion and intensity
            polarity = blob.sentiment.polarity
            subjectivity = blob.sentiment.subjectivity
            
            if polarity > 0.5:
                primary_emotion = "happy"
                mood = "positive"
            elif polarity > 0.2:
                primary_emotion = "hopeful"
                mood = "positive"
            elif polarity < -0.5:
                primary_emotion = "sad"
                mood = "negative"
            elif polarity < -0.2:
                primary_emotion = "concerned"
                mood = "negative"
            else:
                primary_emotion = "neutral"
                mood = "neutral"
            
            # Calculate intensity on a more balanced 1-10 scale
            base_intensity = abs(polarity) * 10  # Convert -1 to 1 range to 0-10
            
            # Adjust intensity based on subjectivity and content
            if len(text.split()) <= 3:  # Short responses
                intensity = min(5, base_intensity)  # Cap at 5 for very short responses
            else:
                # Blend base intensity with subjectivity
                intensity = (base_intensity * 0.7 + (subjectivity * 10) * 0.3)
            
            # Round to nearest integer and ensure within 1-10 range
            intensity = max(1, min(10, round(intensity)))
            
            return {
                "primary_emotion": primary_emotion,
                "emotion_intensity": intensity,
                "identified_mood": mood
            }
            
        except Exception as e:
            print(f"Error in sentiment analysis: {e}")
            return {
                "primary_emotion": "neutral",
                "emotion_intensity": 5,
                "identified_mood": "neutral"
            }

    async def save_session(self):
        try:
            with open('chat_sessions.json', 'w') as f:
                json.dump(self.conversation_history, f, indent=2)
        except Exception as e:
            print(f"Error saving session: {e}")

    def _get_help_message(self) -> Dict:
        """Get help message with available commands"""
        help_text = """
Available commands:
/exercise - Start a CBT exercise
  - /exercise journal
  - /exercise mindfulness
  - /exercise restructure
  - /exercise relax
  - /exercise ground
/survey - Take feedback survey
/stats - View your progress
/help - Show this help message

Type any message to chat normally.
"""
        return {
            "response": help_text,
            "sentiment": self.sentiment_analyzer._get_default_sentiment()
        }

    def _is_in_activity(self) -> bool:
        """Check if user is in an exercise or survey"""
        return hasattr(self, 'current_survey') or self.current_exercise is not None

    async def _handle_exercise_command(self, command: str) -> Dict:
        """Handle CBT exercise commands"""
        parts = command.split()
        if len(parts) < 2:
            return {
                "response": "Available exercises:\n- /exercise journal\n- /exercise mindfulness\n- /exercise restructure\n- /exercise relax\n- /exercise ground",
                "sentiment": self.sentiment_analyzer._get_default_sentiment()
            }
            
        exercise_type = parts[1]
        
        # Handle exercise steps if already in an exercise
        if self.current_exercise and self.current_exercise['type'] == exercise_type:
            return await self._handle_exercise_step(parts[2] if len(parts) > 2 else None)
            
        # Start new exercise
        prompts = self.cbt_exercises.get_exercise_prompts(exercise_type)
        if not prompts:
            return {
                "response": "Exercise type not found. Available types: journal, mindfulness, restructure, relax, ground",
                "sentiment": self.sentiment_analyzer._get_default_sentiment()
            }
            
        self.current_exercise = {
            'type': exercise_type,
            'step': 0,
            'data': {},
            'prompts': prompts
        }
        
        return {
            "response": f"Let's start the {exercise_type} exercise.\n{prompts[0]}",
            "sentiment": self.sentiment_analyzer._get_default_sentiment()
        }

    async def _handle_exercise_step(self, user_response: str = None) -> Dict:
        """Handle steps within an exercise"""
        if not self.current_exercise:
            return {
                "response": "No active exercise. Use /exercise to start one.",
                "sentiment": self.sentiment_analyzer._get_default_sentiment()
            }
            
        exercise = self.current_exercise
        prompts = exercise['prompts']
        
        # Handle cancellation
        if user_response and user_response.lower() in ['cancel', 'stop', 'quit']:
            self.current_exercise = None
            return {
                "response": "Exercise cancelled. How can I help you?",
                "sentiment": self.sentiment_analyzer._get_default_sentiment()
            }
        
        # Process previous response if provided
        if user_response:
            # Analyze sentiment of response
            sentiment = await self.sentiment_analyzer.analyze(user_response)
            exercise['data'][f"step_{exercise['step']}_sentiment"] = sentiment
            exercise['data'][f"step_{exercise['step']}"] = user_response
            
            # Track progress for this step
            self.progress_tracker.track_mood({
                'score': sentiment['sentiment_score'],
                'triggers': self.text_analyzer.extract_key_concerns(user_response),
                'exercise_step': exercise['step'],
                'exercise_type': exercise['type']
            })
            
        # Move to next step
        if user_response or exercise['step'] == 0:
            exercise['step'] += 1
        
        # Check if exercise is complete
        if exercise['step'] >= len(prompts):
            result = await self._complete_exercise(exercise)
            self.current_exercise = None
            return result
            
        # Return next prompt with validation
        return {
            "response": prompts[exercise['step']],
            "sentiment": self.sentiment_analyzer._get_default_sentiment()
        }

    def _show_analytics(self) -> Dict:
        """Show user progress analytics"""
        mood_trends = self.analytics.generate_mood_trends()
        effectiveness = self.analytics.exercise_effectiveness()
        
        response = "Here's your progress summary:\n"
        response += f"Mood trend: {mood_trends.get('trend', 'Not enough data')}\n"
        response += f"Most effective techniques: {', '.join(effectiveness.keys())}\n"
        
        return {
            "response": response,
            "sentiment": self.sentiment_analyzer._get_default_sentiment()
        }

    def _start_survey(self) -> Dict:
        """Start feedback survey"""
        self.current_survey = {
            'step': 0,
            'responses': {}
        }
        
        first_question = list(self.feedback.survey_questions.keys())[0]
        question_data = self.feedback.survey_questions[first_question]
        
        response = "Please help us improve by taking a short survey.\n"
        response += f"{question_data['question']}\n"
        response += "Options: " + ", ".join(question_data['options'])
        
        return {
            "response": response,
            "sentiment": self.sentiment_analyzer._get_default_sentiment(),
            "survey_started": True
        }

    def _handle_survey_response(self, response: str) -> Dict:
        """Handle survey responses"""
        if not hasattr(self, 'current_survey'):
            return self._get_error_response()
            
        # Handle cancellation
        if response.lower() in ['cancel', 'stop', 'quit']:
            delattr(self, 'current_survey')
            return {
                "response": "Survey cancelled. How can I help you?",
                "sentiment": self.sentiment_analyzer._get_default_sentiment()
            }
            
        # Get current question
        questions = list(self.feedback.survey_questions.keys())
        current_q = questions[self.current_survey['step']]
        question_data = self.feedback.survey_questions[current_q]
        
        # Case-insensitive option matching
        valid_options = question_data['options']
        response_match = next(
            (opt for opt in valid_options if opt.lower() == response.lower()),
            None
        )
        
        # Validate response
        if not response_match:
            return {
                "response": f"Please select one of the available options:\n{', '.join(valid_options)}",
                "sentiment": self.sentiment_analyzer._get_default_sentiment()
            }
        
        # Save valid response (using the correct case)
        self.current_survey['responses'][current_q] = response_match
        self.current_survey['step'] += 1
        
        # Check if survey is complete
        if self.current_survey['step'] >= len(questions):
            return self._complete_survey()
            
        # Get next question
        next_q = questions[self.current_survey['step']]
        question_data = self.feedback.survey_questions[next_q]
        
        return {
            "response": f"{question_data['question']}\nOptions: {', '.join(question_data['options'])}",
            "sentiment": self.sentiment_analyzer._get_default_sentiment()
        }

    def _get_error_response(self) -> Dict:
        """Generate error response"""
        return {
            "response": "I'm having trouble processing that. Could you try rephrasing?",
            "sentiment": self.sentiment_analyzer._get_default_sentiment(),
            "conversation_id": len(self.conversation_history)
        }

    def _handle_command_during_activity(self, command: str) -> Dict:
        """Handle commands during active exercise or survey"""
        if command.lower() in ['cancel', 'stop', 'quit']:
            if hasattr(self, 'current_survey'):
                delattr(self, 'current_survey')
            self.current_exercise = None
            return {
                "response": "Activity cancelled. How can I help you?",
                "sentiment": self.sentiment_analyzer._get_default_sentiment()
            }
        
        return {
            "response": "You're currently in an activity. Type 'cancel' to stop it, or continue with the current activity.",
            "sentiment": self.sentiment_analyzer._get_default_sentiment()
        }

    async def _complete_exercise(self, exercise: Dict) -> Dict:
        """Process and save completed exercise data"""
        try:
            if exercise['type'] == 'journal':
                self.cbt_exercises.add_thought_record(
                    situation=exercise['data'].get('step_1', ''),
                    thoughts=exercise['data'].get('step_2', ''),
                    emotions=exercise['data'].get('step_3', ''),
                    behaviors=exercise['data'].get('step_4', '')
                )
            elif exercise['type'] == 'mindfulness':
                self.cbt_exercises.add_mindfulness_exercise(
                    exercise_type='basic',
                    duration=5,  # Default duration
                    notes=str(exercise['data'])
                )
            elif exercise['type'] == 'restructure':
                self.cbt_exercises.cognitive_restructuring(
                    negative_thought=exercise['data'].get('step_1', ''),
                    evidence_for=[exercise['data'].get('step_2', '')],
                    evidence_against=[exercise['data'].get('step_3', '')],
                    balanced_thought=exercise['data'].get('step_4', '')
                )
            
            # Track progress
            self.progress_tracker.add_session({
                'type': exercise['type'],
                'completed': True,
                'duration': 5,  # Default duration
                'data': exercise['data']
            })
            
            return {
                "response": "Exercise complete! Great job working through that. How are you feeling now?",
                "sentiment": self.sentiment_analyzer._get_default_sentiment()
            }
            
        except Exception as e:
            print(f"Error completing exercise: {e}")
            return self._get_error_response()

    def _complete_survey(self) -> Dict:
        """Complete and save survey responses"""
        try:
            # Save survey
            self.feedback.post_session_survey(self.current_survey['responses'])
            
            # Track completion
            self.progress_tracker.add_session({
                'type': 'survey',
                'completed': True,
                'responses': self.current_survey['responses']
            })
            
            # Clean up
            delattr(self, 'current_survey')
            
            return {
                "response": "Thank you for completing the survey! Your feedback helps us improve.",
                "sentiment": self.sentiment_analyzer._get_default_sentiment()
            }
            
        except Exception as e:
            print(f"Error completing survey: {e}")
            return self._get_error_response()

    def _get_recent_messages(self, count: int = 3) -> str:
        """Get recent message history for context"""
        recent = self.conversation_history[-count:] if len(self.conversation_history) > 0 else []
        if not recent:
            return "No previous messages"
            
        messages = []
        for msg in recent:
            messages.append(f"User: {msg['user_input']}")
            messages.append(f"Therapist: {msg['bot_response']}")
        
        return "\n".join(messages)

    def _get_conversation_theme(self) -> str:
        """Extract the main theme of the current conversation"""
        if len(self.conversation_history) == 0:
            return "Initial greeting"
            
        # Get last 3 messages
        recent_messages = self.conversation_history[-3:]
        
        # Extract keywords from recent messages
        keywords = []
        for msg in recent_messages:
            user_input = msg['user_input'].lower()
            if 'play' in user_input:
                keywords.append('activities')
            if any(word in user_input for word in ['sad', 'happy', 'angry', 'feel']):
                keywords.append('emotions')
            if any(word in user_input for word in ['think', 'thought', 'mind']):
                keywords.append('thoughts')
                
        # Determine main theme
        if 'emotions' in keywords:
            return "Discussing emotions and feelings"
        elif 'activities' in keywords:
            return "Discussing activities and interests"
        elif 'thoughts' in keywords:
            return "Exploring thoughts and perspectives"
        else:
            return "General conversation" 