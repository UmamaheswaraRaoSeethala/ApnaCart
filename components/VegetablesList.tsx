'use client'

import { Vegetable } from '@prisma/client'

interface VegetablesListProps {
  vegetables: Vegetable[]
  onDelete: (id: number) => void
}

export default function VegetablesList({ vegetables, onDelete }: VegetablesListProps) {
  if (vegetables.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🥬</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No vegetables yet</h3>
        <p className="text-gray-500">Add your first vegetable to get started!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Vegetables</h3>
      <div className="space-y-4">
        {vegetables.map((vegetable) => (
          <div
            key={vegetable.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center space-x-4">
              {/* Image or Emoji */}
              <div className="relative">
                {vegetable.imageUrl ? (
                  <>
                    <img
                      src={vegetable.imageUrl}
                      alt={vegetable.name}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        // Fallback to emoji if image fails to load
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-300 rounded-lg flex items-center justify-center text-2xl hidden">
                      🥬
                    </div>
                  </>
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-300 rounded-lg flex items-center justify-center text-2xl">
                    🥬
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">{vegetable.name}</h4>
                <p className="text-sm text-gray-600">Weight: {vegetable.weightUnit}</p>
              </div>
            </div>
            
            <button
              onClick={() => onDelete(vegetable.id)}
              className="px-3 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
            >
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

