interface ResourceFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function ResourceFilter({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange
}: ResourceFilterProps) {
  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'educational', label: 'Educational' },
    { id: 'worksheet', label: 'Worksheets' },
    { id: 'tutorial', label: 'Tutorials' }
  ]

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
      
      <input
        type="text"
        placeholder="Search resources..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
} 