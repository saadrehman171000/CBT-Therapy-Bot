from typing import Dict, List
import pandas as pd
from datetime import datetime, timedelta

class ProgressAnalytics:
    def __init__(self, progress_tracker):
        self.progress_tracker = progress_tracker

    def generate_mood_trends(self, days: int = 30) -> Dict:
        """Analyze mood trends over time"""
        mood_data = self.progress_tracker.mood_history
        if not mood_data:
            return {"error": "No mood data available"}

        df = pd.DataFrame(mood_data)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Calculate various metrics
        recent_moods = df.tail(days)
        
        return {
            'average_mood': recent_moods['score'].mean(),
            'mood_volatility': recent_moods['score'].std(),
            'trend': 'improving' if recent_moods['score'].diff().mean() > 0 else 'declining',
            'most_common_triggers': self._get_common_triggers(recent_moods),
            'daily_averages': self._calculate_daily_averages(recent_moods)
        }

    def exercise_effectiveness(self) -> Dict:
        """Analyze effectiveness of different CBT techniques"""
        sessions = self.progress_tracker.sessions
        if not sessions:
            return {"error": "No session data available"}

        techniques_impact = {}
        for session in sessions:
            for technique in session.get('techniques_used', []):
                if technique not in techniques_impact:
                    techniques_impact[technique] = {
                        'count': 0,
                        'mood_improvement': 0,
                        'user_rating': 0
                    }
                
                techniques_impact[technique]['count'] += 1
                mood_change = session.get('mood_end', 0) - session.get('mood_start', 0)
                techniques_impact[technique]['mood_improvement'] += mood_change

        # Calculate averages
        for technique in techniques_impact:
            count = techniques_impact[technique]['count']
            if count > 0:
                techniques_impact[technique]['average_improvement'] = (
                    techniques_impact[technique]['mood_improvement'] / count
                )

        return techniques_impact

    def _get_common_triggers(self, df: pd.DataFrame) -> List[str]:
        """Extract common mood triggers"""
        all_triggers = []
        for triggers in df['triggers']:
            if triggers:
                all_triggers.extend(triggers)
        
        if not all_triggers:
            return []

        trigger_counts = pd.Series(all_triggers).value_counts()
        return trigger_counts.head(5).index.tolist()

    def _calculate_daily_averages(self, df: pd.DataFrame) -> Dict:
        """Calculate daily mood averages"""
        daily_avg = df.groupby(df['timestamp'].dt.date)['score'].mean()
        return daily_avg.to_dict()

    def get_detailed_analysis(self) -> Dict:
        """Get comprehensive analysis of user progress"""
        return {
            'mood_trends': self.generate_mood_trends(),
            'exercise_impact': self.exercise_effectiveness(),
            'engagement_metrics': self._calculate_engagement(),
            'distortion_patterns': self._analyze_distortions(),
            'improvement_areas': self._identify_improvement_areas()
        }

    def _calculate_engagement(self) -> Dict:
        """Calculate user engagement metrics"""
        sessions = self.progress_tracker.sessions
        if not sessions:
            return {"error": "No session data"}
            
        total_duration = sum(s.get('duration', 0) for s in sessions)
        avg_duration = total_duration / len(sessions)
        
        return {
            'total_sessions': len(sessions),
            'average_duration': avg_duration,
            'completion_rate': self._calculate_completion_rate(),
            'regular_usage': self._check_regular_usage()
        }

    def _analyze_distortions(self) -> Dict:
        """Analyze patterns in cognitive distortions"""
        distortions = []
        for session in self.progress_tracker.sessions:
            if 'cognitive_distortions' in session:
                distortions.extend(session['cognitive_distortions'])
                
        if not distortions:
            return {"error": "No distortion data"}
            
        return {
            'most_common': pd.Series(distortions).value_counts().head(3).to_dict(),
            'total_identified': len(distortions),
            'improvement_trend': self._calculate_distortion_trend()
        }

    def _calculate_completion_rate(self) -> float:
        """Calculate completion rate of sessions"""
        sessions = self.progress_tracker.sessions
        if not sessions:
            return 0.0
            
        completed_sessions = [s for s in sessions if s.get('completed', False)]
        return len(completed_sessions) / len(sessions)

    def _check_regular_usage(self) -> bool:
        """Check if user is using the app regularly"""
        sessions = self.progress_tracker.sessions
        if not sessions:
            return False
            
        recent_sessions = [s for s in sessions if (datetime.now() - pd.to_datetime(s['timestamp'])).days < 7]
        return len(recent_sessions) > 0

    def _calculate_distortion_trend(self) -> str:
        """Calculate trend in cognitive distortion improvement"""
        distortions = []
        for session in self.progress_tracker.sessions:
            if 'cognitive_distortions' in session:
                distortions.extend(session['cognitive_distortions'])
                
        if not distortions:
            return "No data"
            
        df = pd.DataFrame({'distortion': distortions})
        df['improvement'] = df['distortion'].apply(lambda x: 1 if x == 'improved' else 0)
        df['trend'] = df['improvement'].diff().fillna(0)
        
        if df['trend'].mean() > 0:
            return "Improving"
        elif df['trend'].mean() < 0:
            return "Declining"
        else:
            return "Stable"

    def _identify_improvement_areas(self) -> Dict:
        """Identify areas for improvement based on user progress"""
        sessions = self.progress_tracker.sessions
        if not sessions:
            return {"error": "No session data"}
            
        improvement_areas = {}
        for session in sessions:
            for area in session.get('improvement_areas', []):
                if area not in improvement_areas:
                    improvement_areas[area] = {
                        'count': 0,
                        'improvement_rate': 0
                    }
                
                improvement_areas[area]['count'] += 1
                if session.get('improvement_rate', 0) > 0:
                    improvement_areas[area]['improvement_rate'] += session['improvement_rate']

        # Calculate averages
        for area in improvement_areas:
            count = improvement_areas[area]['count']
            if count > 0:
                improvement_areas[area]['average_improvement_rate'] = (
                    improvement_areas[area]['improvement_rate'] / count
                )

        return improvement_areas 