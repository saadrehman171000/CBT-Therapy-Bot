'use client'

interface ExerciseProgressProps {
  currentStep: number
  totalSteps: number
  exerciseType: string
}

export default function ExerciseProgress({ 
  currentStep, 
  totalSteps, 
  exerciseType 
}: ExerciseProgressProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-500 capitalize">
          {exerciseType}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
} 