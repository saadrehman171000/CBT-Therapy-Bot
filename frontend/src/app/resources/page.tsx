'use client'

import { useState } from 'react'
import ResourceCard from '@/components/Resources/ResourceCard'
import ResourceFilter from '@/components/Resources/ResourceFilter'

const resources = [
  {
    id: 'cbt-basics',
    title: 'CBT Fundamentals',
    type: 'article',
    description: 'Learn the basics of Cognitive Behavioral Therapy and how it can help you.',
    category: 'educational',
    viewUrl: 'https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral',
    icon: '📄'
  },
  {
    id: 'meditation-guide',
    title: 'Guided Meditation',
    type: 'video',
    description: '10-minute guided meditation for anxiety relief.',
    category: 'tutorial',
    viewUrl: 'https://www.youtube.com/embed/O-6f5wQXSu8',
    icon: '🎥'
  },
  {
    id: 'stress-management',
    title: 'Stress Management Guide',
    type: 'article',
    description: 'Comprehensive guide to managing stress using CBT techniques.',
    category: 'educational',
    viewUrl: 'https://www.nimh.nih.gov/health/publications/so-stressed-out-fact-sheet',
    icon: '📚'
  },
  {
    id: 'breathing-exercise',
    title: 'Deep Breathing Tutorial',
    type: 'video',
    description: 'Learn proper deep breathing techniques for relaxation.',
    category: 'tutorial',
    viewUrl: 'https://www.youtube.com/embed/acUZdGd_3Dg',
    icon: '🫁'
  },
  {
    id: 'anxiety-tips',
    title: 'Managing Anxiety',
    type: 'article',
    description: 'Expert tips and strategies for managing anxiety in daily life.',
    category: 'educational',
    viewUrl: 'https://www.mind.org.uk/information-support/types-of-mental-health-problems/anxiety-and-panic-attacks/self-care/',
    icon: '🧠'
  },
  {
    id: 'mindfulness-basics',
    title: 'Mindfulness Practice',
    type: 'video',
    description: 'Introduction to mindfulness meditation techniques.',
    category: 'tutorial',
    viewUrl: 'https://www.youtube.com/embed/ZToicYcHIOU',
    icon: '🧘‍♂️'
  }
]

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resource Library</h1>
        <p className="text-blue-600">Explore CBT materials, worksheets, and tutorials</p>
      </div>

      <ResourceFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  )
} 