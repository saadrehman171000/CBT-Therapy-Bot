import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 px-4 bg-[#f8fafc]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="text-gray-800">Your Personal CBT</span>
                <div className="text-[#2563eb]">Therapy Assistant</div>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed my-6">
                Experience professional-grade cognitive behavioral therapy techniques through our AI-powered chatbot. Available 24/7 to help you manage stress, anxiety, and improve your mental well-being.
              </p>
              <div className="flex gap-4">
                <Link 
                  href="/chat"
                  className="px-6 py-3 bg-[#2563eb] text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Chatting
                </Link>
                <Link
                  href="/exercises"
                  className="px-6 py-3 border-2 border-[#2563eb] text-[#2563eb] font-medium rounded-lg hover:bg-blue-50 transition-colors"
                >
                  View Exercises
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/hero-image.jpeg"
                alt="Therapy illustration"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How We Can Help You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-8 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#2563eb] py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of users who have improved their mental well-being with our CBT therapy bot.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-[#2563eb] font-medium hover:bg-opacity-95 transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: (
      <svg className="w-6 h-6 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    title: '24/7 Chat Support',
    description: 'Access therapeutic support anytime, anywhere. Our AI is always here to listen and help.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: 'CBT Exercises',
    description: 'Practice evidence-based CBT techniques through guided exercises and activities.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Progress Tracking',
    description: 'Monitor your improvement over time with detailed progress analytics and mood tracking.',
  },
]