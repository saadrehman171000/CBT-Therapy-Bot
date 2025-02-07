'use client'

interface MessageProps {
  message: {
    text: string
    sender: 'user' | 'bot'
    sentiment?: {
      primary_emotion: string
      emotion_intensity: number
      identified_mood: string
    }
  }
}

export default function ChatMessage({ message }: MessageProps) {
  const isBot = message.sender === 'bot'

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] ${isBot ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isBot
              ? 'bg-white border border-gray-100 text-gray-800'
              : 'bg-blue-600 text-white'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
        {isBot && message.sentiment && (
          <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
            <span>Emotion: {message.sentiment.primary_emotion}</span>
            <span>•</span>
            <span>Intensity: {message.sentiment.emotion_intensity}/10</span>
            <span>•</span>
            <span>Mood: {message.sentiment.identified_mood}</span>
          </div>
        )}
      </div>
    </div>
  )
} 