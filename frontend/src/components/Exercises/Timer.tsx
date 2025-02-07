'use client'

import { useState, useEffect } from 'react'

interface TimerProps {
  duration: number // in minutes
  onComplete: () => void
}

export default function Timer({ duration, onComplete }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning || timeLeft === 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, timeLeft, onComplete])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  return (
    <div className="text-center">
      <div className="text-5xl font-mono font-bold text-gray-900 mb-6">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <button
        onClick={toggleTimer}
        className={`px-8 py-3 rounded-lg font-medium transition-all ${
          isRunning
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-green-500 hover:bg-green-600 text-white'
        } shadow-sm hover:shadow-md active:transform active:scale-95`}
      >
        {isRunning ? 'Pause' : 'Start'}
      </button>
      {!isRunning && timeLeft < duration * 60 && timeLeft > 0 && (
        <p className="mt-4 text-gray-600">Timer paused. Click Start to continue.</p>
      )}
      {timeLeft === 0 && (
        <p className="mt-4 text-green-600 font-medium">Time's up! Great job!</p>
      )}
    </div>
  )
} 