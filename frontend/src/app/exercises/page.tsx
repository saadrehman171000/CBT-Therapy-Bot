'use client'

import { useState } from 'react'
import ExerciseCard from '@/components/Exercises/ExerciseCard'

const exercises = [
  {
    id: 'mindfulness',
    title: 'Mindfulness Meditation',
    description: 'A guided meditation exercise to help you stay present and reduce anxiety.',
    duration: '5 minutes',
    icon: '🧘‍♂️'
  },
  {
    id: 'breathing',
    title: 'Deep Breathing',
    description: 'Simple breathing exercises to help you relax and reduce stress.',
    duration: '3 minutes',
    icon: '🫁'
  },
  {
    id: 'gratitude',
    title: 'Gratitude Journal',
    description: "Write down things you're grateful for to improve mood and perspective.",
    duration: '5 minutes',
    icon: '📝'
  },
  {
    id: 'thought-record',
    title: 'Thought Record',
    description: 'Identify and challenge negative thought patterns.',
    duration: '10 minutes',
    icon: '🤔'
  }
]

export default function ExercisesPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CBT Exercises</h1>
        <p className="text-blue-600">Practice evidence-based techniques to improve your mental well-being</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  )
} 