'use client'

interface Exercise {
  type: string;
  completedAt: string;
  responses?: Record<string, string>;
}

interface ExerciseHistoryProps {
  exercises: Exercise[];
}

export default function ExerciseHistory({ exercises }: ExerciseHistoryProps) {
  if (!exercises || exercises.length === 0) {
    return (
      <div className="text-gray-500">
        No exercises completed yet
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise, index) => (
        <div key={index} className="border-b pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-800 capitalize">
                {exercise.type} Exercise
              </h4>
              <p className="text-sm text-gray-500">
                {new Date(exercise.completedAt).toLocaleDateString()}
              </p>
            </div>
            <span className="text-green-500 text-sm">Completed</span>
          </div>
        </div>
      ))}
    </div>
  )
} 