from typing import Dict, List, Any
import json
from datetime import datetime
import os

class ProgressTracker:
    def __init__(self):
        # Get the directory where the script is located
        current_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.data_file = os.path.join(current_dir, "progress_data.json")
        self.load_data()

    def load_data(self):
        try:
            if os.path.exists(self.data_file):
                with open(self.data_file, 'r') as f:
                    self.data = json.load(f)
            else:
                self.data = {
                    "moodData": [],
                    "exercises": [],
                    "stats": {
                        "totalSessions": 0,
                        "exercisesCompleted": 0,
                        "currentStreak": 0
                    }
                }
                self.save_data()
        except Exception as e:
            print(f"Error loading progress data: {e}")
            self.data = {
                "moodData": [],
                "exercises": [],
                "stats": {
                    "totalSessions": 0,
                    "exercisesCompleted": 0,
                    "currentStreak": 0
                }
            }

    def save_data(self):
        try:
            os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
            with open(self.data_file, 'w') as f:
                json.dump(self.data, f, indent=2)
        except Exception as e:
            print(f"Error saving progress data: {e}")

    def add_exercise(self, exercise_data: Dict[str, Any]):
        try:
            # Add the exercise to the list
            self.data["exercises"].append({
                "type": exercise_data["type"],
                "completedAt": exercise_data["completedAt"],
                "steps": exercise_data["steps"]
            })
            
            # Update stats
            self.data["stats"]["exercisesCompleted"] += 1
            
            # Calculate streak
            today = datetime.now().date()
            if self.data["exercises"]:
                last_exercise = datetime.fromisoformat(self.data["exercises"][-1]["completedAt"]).date()
                if (today - last_exercise).days <= 1:  # Same day or consecutive days
                    self.data["stats"]["currentStreak"] += 1
                else:
                    self.data["stats"]["currentStreak"] = 1
            else:
                self.data["stats"]["currentStreak"] = 1
            
            self.save_data()
            print(f"Exercise saved successfully: {exercise_data}")
        except Exception as e:
            print(f"Error adding exercise: {e}")

    def add_chat_session(self, sentiment_data: Dict[str, Any]):
        self.data["stats"]["totalSessions"] += 1
        self.data["moodData"].append({
            "date": datetime.now().strftime("%Y-%m-%d"),
            "mood": sentiment_data["emotion_intensity"],
            "emotion": sentiment_data["primary_emotion"]
        })
        self.save_data()

    def get_progress(self) -> Dict[str, Any]:
        return self.data 