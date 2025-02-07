'use client'

import { useState } from 'react'

export const exerciseSteps = {
  mindfulness: [
    {
      title: "Find a Quiet Space",
      instruction: "Find a comfortable place to sit or lie down where you won't be disturbed.",
      duration: 30,
      action: "Next"
    },
    {
      title: "Focus on Breathing",
      instruction: "Close your eyes and take deep, slow breaths. Notice the sensation of breathing.",
      duration: 120,
      action: "Continue"
    },
    {
      title: "Body Awareness",
      instruction: "Scan your body from head to toe, noticing any tension or discomfort.",
      duration: 180,
      action: "Continue"
    },
    {
      title: "Reflection",
      instruction: "How do you feel now compared to when you started?",
      input: true,
      action: "Complete"
    }
  ],
  journal: [
    // ... similar structure for journal exercise
  ],
  // ... other exercise types
}

export function useExercise(type: string) {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [isComplete, setIsComplete] = useState(false)

  const steps = exerciseSteps[type as keyof typeof exerciseSteps] || []
  const totalSteps = steps.length

  const handleNext = (response?: string) => {
    if (response) {
      setResponses(prev => ({ ...prev, [currentStep]: response }))
    }

    if (currentStep === totalSteps - 1) {
      setIsComplete(true)
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  return {
    currentStep,
    totalSteps,
    currentStepData: steps[currentStep],
    responses,
    isComplete,
    handleNext
  }
} 