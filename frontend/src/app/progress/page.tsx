'use client'

import { useEffect, useState } from 'react'
import ProgressChart from '@/components/Progress/ProgressChart'
import ExerciseList from '@/components/Progress/ExerciseList'
import { chatbotAPI } from '@/lib/api/chatbot'

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await chatbotAPI.getProgress()
        setProgressData(data)
      } catch (error) {
        console.error('Error fetching progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
        <p className="text-blue-600">Track your therapeutic journey and achievements</p>
      </div>
      
      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm p-6 border border-blue-100">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-blue-600 text-2xl">📊</span>
            <h3 className="text-lg font-semibold text-gray-900">Total Sessions</h3>
          </div>
          <p className="text-4xl font-bold text-blue-600">{progressData?.stats?.totalSessions || 0}</p>
          <p className="text-sm text-blue-600 mt-1">Therapy sessions completed</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm p-6 border border-blue-100">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-blue-600 text-2xl">🎯</span>
            <h3 className="text-lg font-semibold text-gray-900">Exercises Done</h3>
          </div>
          <p className="text-4xl font-bold text-blue-600">{progressData?.stats?.exercisesCompleted || 0}</p>
          <p className="text-sm text-blue-600 mt-1">CBT exercises completed</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm p-6 border border-blue-100">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-blue-600 text-2xl">🔥</span>
            <h3 className="text-lg font-semibold text-gray-900">Current Streak</h3>
          </div>
          <p className="text-4xl font-bold text-blue-600">{progressData?.stats?.currentStreak || 0}</p>
          <p className="text-sm text-blue-600 mt-1">Days in a row</p>
        </div>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">📈</span>
            Mood Tracking
          </h2>
          <ProgressChart data={progressData?.moodData || []} />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">✅</span>
            Exercise History
          </h2>
          <ExerciseList exercises={progressData?.exercises || []} />
        </div>
      </div>
    </div>
  )
} 