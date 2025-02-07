'use client'

interface ResourceCardProps {
  resource: {
    id: string
    title: string
    type: string
    description: string
    category: string
    downloadUrl?: string
    viewUrl?: string
    icon: string
  }
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const handleAction = () => {
    if (resource.viewUrl) {
      // For videos and external articles
      window.open(resource.viewUrl, '_blank')
    } else if (resource.downloadUrl) {
      // For downloadable PDFs
      const link = document.createElement('a')
      link.href = resource.downloadUrl
      link.download = `${resource.title.toLowerCase().replace(/\s+/g, '-')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <span className="text-3xl">{resource.icon}</span>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
          <p className="text-gray-600 mb-4">{resource.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600 font-medium capitalize">
              {resource.type}
            </span>
            <button
              onClick={handleAction}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {resource.viewUrl ? 'View' : 'Download'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 