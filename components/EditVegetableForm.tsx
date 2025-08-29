'use client'

import { useState, useEffect } from 'react'
import { Vegetable } from '@prisma/client'
import { getVegetableImage, autoLinkVegetableImage } from '@/utils/imageUtils'

interface EditVegetableFormProps {
  vegetable: Vegetable | null
  onSave: (id: number, name: string, fixedWeight: string, imageUrl: string) => void
  onCancel: () => void
  isLoading: boolean
}

export default function EditVegetableForm({ vegetable, onSave, onCancel, isLoading }: EditVegetableFormProps) {
  const [name, setName] = useState('')
  const [fixedWeight, setFixedWeight] = useState('500g')
  const [imageUrl, setImageUrl] = useState('')
  const [previewImage, setPreviewImage] = useState<string>('')
  const [autoLinkedImage, setAutoLinkedImage] = useState<string>('')

  useEffect(() => {
    if (vegetable) {
      setName(vegetable.name)
      setFixedWeight(vegetable.fixedWeight || vegetable.weightUnit || '500g')
      setImageUrl(vegetable.imageUrl || '')
      setPreviewImage(getVegetableImage(vegetable.name))
      setAutoLinkedImage(autoLinkVegetableImage(vegetable.name, vegetable.imageUrl || undefined))
    }
  }, [vegetable])

  // Update preview image and auto-linked image when name or imageUrl changes
  useEffect(() => {
    if (name.trim()) {
      const autoImage = autoLinkVegetableImage(name.trim(), imageUrl)
      const previewImage = getVegetableImage(name.trim())
      
      setAutoLinkedImage(autoImage)
      setPreviewImage(previewImage)
    } else {
      setAutoLinkedImage('')
      setPreviewImage('')
    }
  }, [name, imageUrl])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (vegetable && name.trim() && fixedWeight) {
      onSave(vegetable.id, name.trim(), fixedWeight, imageUrl.trim())
    }
  }

  if (!vegetable) {
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md border-2 border-blue-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Vegetable</h3>
      
      <div>
        <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
          Vegetable Name
        </label>
        <input
          type="text"
          id="edit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Tomato, Onion, Potato"
          required
        />
      </div>

      <div>
        <label htmlFor="edit-fixedWeight" className="block text-sm font-medium text-gray-700 mb-2">
          Fixed Weight
        </label>
        <select
          id="edit-fixedWeight"
          value={fixedWeight}
          onChange={(e) => setFixedWeight(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="250g">250g</option>
          <option value="500g">500g</option>
          <option value="1kg">1kg</option>
        </select>
      </div>

      {/* Automatic Image Linking Section */}
      {name.trim() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-3">🔄 Automatic Image Linking</h4>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-20 h-20 bg-white rounded-lg border border-blue-200 flex items-center justify-center overflow-hidden">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt={`Preview of ${name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span class="text-xs text-gray-400 font-medium">No Image</span>
                        </div>
                      `
                    }
                  }}
                />
              ) : (
                <span className="text-xs text-gray-400 font-medium">No Image</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-800">
                <strong>Will be automatically linked to:</strong>
              </p>
              <p className="text-xs text-blue-600 mt-1 font-mono bg-blue-100 px-2 py-1 rounded">
                {autoLinkedImage}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {imageUrl && imageUrl.trim() !== '' 
                  ? 'Custom URL will override automatic matching'
                  : 'System automatically finds matching images from your public/images folder'
                }
              </p>
            </div>
          </div>
          
          <div className="text-xs text-blue-700 bg-blue-100 px-3 py-2 rounded">
            💡 <strong>How it works:</strong> When you save changes, the system will automatically link the best available image. 
            If no exact match is found, it will use the default image.
          </div>
        </div>
      )}

      <div>
        <label htmlFor="edit-imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
          Custom Image URL (Optional)
        </label>
        <input
          type="url"
          id="edit-imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://example.com/custom-image.jpg"
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave empty to use automatic image matching. Custom URLs override automatic matching.
        </p>
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={isLoading || !name.trim()}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
