'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Timer from '@/components/Exercises/Timer'
import { chatbotAPI } from '@/lib/api/chatbot'

const exerciseSteps = {
  mindfulness: [
    'Find a comfortable position and close your eyes',
    'Focus on your breath',
    'Notice any thoughts without judgment',
    'Return focus to your breath when distracted',
    'Slowly open your eyes when ready'
  ],
  breathing: [
    'Sit comfortably with your back straight',
    'Breathe in slowly through your nose',
    'Hold your breath for 4 seconds',
    'Exhale slowly through your mouth',
    'Repeat the cycle'
  ],
  gratitude: [
    "Think of something you're grateful for",
    'Write it down and describe why',
    'Reflect on how it makes you feel',
    'Consider expressing gratitude directly',
    "Review what you've written"
  ],
  'thought-record': [
    'Identify the situation',
    'Note your automatic thoughts',
    'Identify emotions and their intensity',
    'Find evidence for and against the thought',
    'Create a balanced perspective'
  ]
}

export default function ExercisePage() {
  const params = useParams()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const exerciseType = params.type as string
  const steps = exerciseSteps[exerciseType as keyof typeof exerciseSteps]

  if (!steps) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Exercise not found</h1>
        <p className="text-gray-600 mb-6">Sorry, this exercise type doesn't exist.</p>
        <button
          onClick={() => router.push('/exercises')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Exercises
        </button>
      </div>
    )
  }

  const handleComplete = async () => {
    try {
      await chatbotAPI.saveExercise(exerciseType, {
        completedAt: new Date().toISOString(),
        steps: currentStep + 1
      })
      setIsComplete(true)
    } catch (error) {
      console.error('Error saving exercise:', error)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">{exerciseType} Exercise</h1>
        <p className="text-blue-600">Follow the steps and take your time</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <Timer duration={5} onComplete={handleComplete} />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Step {currentStep + 1} of {steps.length}</h2>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <p className="text-gray-800 text-lg mb-8">{steps[currentStep]}</p>
        
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (currentStep === steps.length - 1) {
                handleComplete()
              } else {
                setCurrentStep(currentStep + 1)
              }
            }}
            className="px-6 py-2 rounded-lg font-medium transition-colors
              bg-blue-600 text-white hover:bg-blue-700"
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>

      {isComplete && (
        <div className="mt-6 bg-green-50 rounded-xl p-6 text-center border border-green-100">
          <span className="text-4xl mb-4 block">🎉</span>
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Exercise Complete!
          </h3>
          <p className="text-green-700 mb-4">Great job completing this exercise.</p>
          <button
            onClick={() => router.push('/exercises')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Exercises
          </button>
        </div>
      )}
    </div>
  )
} 