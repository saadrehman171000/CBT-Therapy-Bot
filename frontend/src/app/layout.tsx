import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CBT Bot',
  description: 'Your AI companion for mental well-being',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <nav className="bg-white border-b border-gray-100">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">👤</span>
                <span className="font-semibold text-xl text-gray-900">CBT Bot</span>
              </Link>
              
              <div className="flex items-center gap-6">
                <Link 
                  href="/chat" 
                  className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
                >
                  <span>💬</span>
                  Chat
                </Link>
                <Link 
                  href="/exercises" 
                  className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
                >
                  <span>🎯</span>
                  Exercises
                </Link>
                <Link 
                  href="/progress" 
                  className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
                >
                  <span>📈</span>
                  Progress
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-100 py-6">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <p>© 2024 CBT Therapy Bot. All rights reserved.</p>
              <div className="flex gap-6">
                <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-blue-600">Terms of Service</Link>
                <Link href="/help" className="hover:text-blue-600">Help & Support</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}