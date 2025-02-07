'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()

  const menuItems = [
    {
      title: 'Quick Actions',
      items: [
        { name: 'Start Chat', href: '/chat' },
        { name: 'New Exercise', href: '/exercises' },
        { name: 'View Progress', href: '/progress' },
      ],
    },
    {
      title: 'CBT Exercises',
      items: [
        { name: 'Thought Journal', href: '/exercises/journal' },
        { name: 'Mindfulness', href: '/exercises/mindfulness' },
        { name: 'Cognitive Restructuring', href: '/exercises/restructuring' },
      ],
    },
  ]

  return (
    <div className={`${isOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 hover:bg-gray-100 w-full text-left"
      >
        {isOpen ? '← Collapse' : '→'}
      </button>

      <div className="p-4">
        {isOpen && menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <ul>
              {section.items.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <Link
                    href={item.href}
                    className={`block px-4 py-2 rounded-md text-sm ${
                      pathname === item.href
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
} 