'use client'

interface Exercise {
  type: string;
  completedAt: string;
  steps: number;
}

interface ExerciseListProps {
  exercises: Exercise[];
}

export default function ExerciseList({ exercises }: ExerciseListProps) {
  if (!exercises || exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <span className="text-4xl mb-4">🎯</span>
        <p className="text-gray-600 mb-2">No exercises completed yet</p>
        <p className="text-sm text-blue-600">Complete an exercise to see your progress!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {exercises.map((exercise, index) => (
        <div 
          key={index} 
          className="bg-gradient-to-r from-blue-50 to-white rounded-lg p-4 border border-blue-100 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900 capitalize flex items-center">
                <span className="mr-2">
                  {exercise.type === 'mindfulness' ? '🧘‍♂️' :
                   exercise.type === 'breathing' ? '🫁' :
                   exercise.type === 'gratitude' ? '📝' : '🤔'}
                </span>
                {exercise.type}
              </h3>
              <p className="text-blue-600 text-sm mt-1">
                {new Date(exercise.completedAt).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {exercise.steps} steps
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 