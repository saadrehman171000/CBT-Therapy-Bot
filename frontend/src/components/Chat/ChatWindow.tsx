'use client'

import { useState, useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { chatbotAPI } from '@/lib/api/chatbot'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  sentiment?: {
    primary_emotion: string
    emotion_intensity: number
    identified_mood: string
  }
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const lastMessageRef = useRef<number>(messages.length)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end"
    })
  }

  useEffect(() => {
    // Only scroll if new messages were added
    if (messages.length > lastMessageRef.current) {
      scrollToBottom()
      lastMessageRef.current = messages.length
    }
  }, [messages])

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    // Add user message
    const userMessage: Message = {
      id: messages.length,
      text,
      sender: 'user'
    }
    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    try {
      const response = await chatbotAPI.sendMessage(text)

      // Add bot response
      const botMessage: Message = {
        id: messages.length + 1,
        text: response.response,
        sender: 'bot',
        sentiment: response.sentiment
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      // Add error message
      const errorMessage: Message = {
        id: messages.length + 1,
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        sender: 'bot'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] bg-gradient-to-b from-blue-50/50 to-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <span className="text-4xl mb-4">👋</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to CBT Bot</h3>
            <p className="text-gray-600 max-w-md">
              I'm here to help you with your mental well-being using CBT techniques. 
              Feel free to share how you're feeling or what's on your mind.
            </p>
          </div>
        )}
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {loading && (
            <div className="flex items-center text-gray-500 space-x-2">
              <div className="animate-bounce">•</div>
              <div className="animate-bounce delay-100">•</div>
              <div className="animate-bounce delay-200">•</div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} className="h-1" />
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  )
} 