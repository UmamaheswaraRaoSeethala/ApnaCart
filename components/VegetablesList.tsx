'use client'

import { Vegetable } from '@prisma/client'
import { getVegetableImage, autoLinkVegetableImage } from '@/utils/imageUtils'

interface VegetablesListProps {
  vegetables: Vegetable[]
  onDelete: (id: number) => void
  onEdit: (vegetable: Vegetable) => void
}

export default function VegetablesList({ vegetables, onDelete, onEdit }: VegetablesListProps) {
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
        {vegetables.map((vegetable) => {
          const isAutoLinked = !vegetable.imageUrl || vegetable.imageUrl.includes('/images/')
          const imageSource = isAutoLinked ? 'Auto-linked' : 'Custom URL'
          
          return (
            <div
              key={vegetable.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-4">
                {/* Image - Use automatic matching with fallback to custom URL */}
                <div className="relative">
                  <img
                    src={vegetable.imageUrl && vegetable.imageUrl.trim() !== '' ? vegetable.imageUrl : getVegetableImage(vegetable.name)}
                    alt={vegetable.name}
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={(e) => {
                      // Replace with "No Image" placeholder if image fails to load
                      const target = e.target as HTMLImageElement
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                            <span class="text-xs text-gray-400 font-medium">No Image</span>
                          </div>
                        `
                      }
                    }}
                  />
                  {/* Image source indicator */}
                  <div className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                    isAutoLinked 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {isAutoLinked ? '🔄' : '🔗'}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">{vegetable.name}</h4>
                  <p className="text-sm text-gray-600">Weight: {vegetable.fixedWeight || vegetable.weightUnit}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isAutoLinked 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                      {imageSource}
                    </span>
                    <span className="text-xs text-gray-500">
                      {isAutoLinked 
                        ? `Auto-linked to: ${getVegetableImage(vegetable.name).split('/').pop()}`
                        : 'Custom image URL'
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(vegetable)}
                  className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => onDelete(vegetable.id)}
                  className="px-3 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

