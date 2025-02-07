'use client'

import ChatWindow from '@/components/Chat/ChatWindow'

export default function ChatPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat with CBT Therapist</h1>
        <p className="text-blue-600">Your AI companion for mental well-being</p>
      </div>
      <ChatWindow />
    </div>
  )
} 