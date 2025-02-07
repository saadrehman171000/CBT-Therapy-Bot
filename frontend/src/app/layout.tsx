import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Layout/Navbar'

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
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)] pt-16">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-100 py-6">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <p>© 2024 CBT Therapy Bot. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="/privacy" className="hover:text-blue-600">Privacy Policy</a>
                <a href="/terms" className="hover:text-blue-600">Terms of Service</a>
                <a href="/help" className="hover:text-blue-600">Help & Support</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}