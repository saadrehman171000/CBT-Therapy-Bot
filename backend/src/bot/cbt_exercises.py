from typing import Dict, List
from datetime import datetime

class CBTExercises:
    def __init__(self):
        self.thought_records = []
        self.mindfulness_sessions = []
        self.cognitive_restructuring_logs = []

    def add_thought_record(self, situation: str, thoughts: str, emotions: str, behaviors: str) -> Dict:
        """Record thoughts using CBT thought journal"""
        record = {
            'timestamp': datetime.now().isoformat(),
            'situation': situation,
            'thoughts': thoughts,
            'emotions': emotions,
            'behaviors': behaviors,
            'cognitive_distortions': [],
            'alternative_thoughts': ''
        }
        self.thought_records.append(record)
        return record

    def add_mindfulness_exercise(self, exercise_type: str, duration: int, notes: str) -> Dict:
        """Record mindfulness exercise session"""
        session = {
            'timestamp': datetime.now().isoformat(),
            'type': exercise_type,
            'duration': duration,
            'notes': notes,
            'mood_before': None,
            'mood_after': None
        }
        self.mindfulness_sessions.append(session)
        return session

    def cognitive_restructuring(self, 
        negative_thought: str,
        evidence_for: List[str],
        evidence_against: List[str],
        balanced_thought: str
    ) -> Dict:
        """Implement cognitive restructuring exercise"""
        restructuring = {
            'timestamp': datetime.now().isoformat(),
            'negative_thought': negative_thought,
            'evidence_for': evidence_for,
            'evidence_against': evidence_against,
            'balanced_thought': balanced_thought,
            'mood_impact': None
        }
        self.cognitive_restructuring_logs.append(restructuring)
        return restructuring

    def get_exercise_prompts(self, exercise_type: str) -> List[str]:
        """Get prompts for different CBT exercises"""
        prompts = {
            'journal': [
                "What situation triggered these thoughts?",
                "What went through your mind in that moment?",
                "How did you feel emotionally?",
                "How did you react or behave?"
            ],
            'mindfulness': [
                "Find a quiet place and sit comfortably.",
                "Focus on your breathing for the next few minutes.",
                "Notice any thoughts without judgment.",
                "How do you feel now compared to when you started?"
            ],
            'restructure': [
                "What's the negative thought you'd like to examine?",
                "What evidence supports this thought?",
                "What evidence doesn't support this thought?",
                "What's a more balanced way to think about this?"
            ],
            'relax': self.get_relaxation_steps(),
            'ground': self.get_grounding_exercise()
        }
        return prompts.get(exercise_type, [])

    def add_relaxation_exercise(self, technique: str, duration: int) -> Dict:
        """Add progressive relaxation exercise"""
        exercise = {
            'timestamp': datetime.now().isoformat(),
            'technique': technique,
            'duration': duration,
            'steps_completed': 0,
            'mood_impact': None
        }
        return exercise

    def get_relaxation_steps(self) -> List[str]:
        """Get progressive relaxation steps"""
        return [
            "Find a quiet, comfortable place to sit or lie down",
            "Close your eyes and take deep breaths",
            "Tense and relax each muscle group, starting from your toes",
            "Notice the difference between tension and relaxation",
            "Continue breathing deeply and maintain awareness"
        ]

    def get_grounding_exercise(self) -> List[str]:
        """Get 5-4-3-2-1 grounding exercise"""
        return [
            "Name 5 things you can see",
            "Name 4 things you can touch",
            "Name 3 things you can hear",
            "Name 2 things you can smell",
            "Name 1 thing you can taste"
        ] 