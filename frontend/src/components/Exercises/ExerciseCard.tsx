'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Exercise {
  id: string
  title: string
  description: string
  duration: string
  icon: string
}

interface ExerciseCardProps {
  exercise: Exercise
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  const router = useRouter()

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <span className="text-3xl">{exercise.icon}</span>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{exercise.title}</h3>
          <p className="text-gray-600 mb-4">{exercise.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600 font-medium">
              Duration: {exercise.duration}
            </span>
            <button
              onClick={() => router.push(`/exercises/${exercise.id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start Exercise
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}