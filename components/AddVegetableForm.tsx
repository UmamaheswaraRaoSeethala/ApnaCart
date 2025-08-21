'use client'

import { useState } from 'react'

interface AddVegetableFormProps {
  onAdd: (name: string, weightUnit: string, imageUrl: string) => void
  isLoading: boolean
}

export default function AddVegetableForm({ onAdd, isLoading }: AddVegetableFormProps) {
  const [name, setName] = useState('')
  const [weightUnit, setWeightUnit] = useState('500g')
  const [imageUrl, setImageUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && weightUnit) {
      onAdd(name.trim(), weightUnit, imageUrl.trim())
      setName('')
      setImageUrl('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Vegetable</h3>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Vegetable Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="e.g., Tomato, Onion, Potato"
          required
        />
      </div>

      <div>
        <label htmlFor="weightUnit" className="block text-sm font-medium text-gray-700 mb-2">
          Weight Unit
        </label>
        <select
          id="weightUnit"
          value={weightUnit}
          onChange={(e) => setWeightUnit(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          required
        >
          <option value="250g">250g</option>
          <option value="500g">500g</option>
        </select>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
          Image URL (Optional)
        </label>
        <input
          type="url"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="https://example.com/image.jpg"
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave empty to use default vegetable emoji
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading || !name.trim()}
        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Adding...' : 'Add Vegetable'}
      </button>
    </form>
  )
}

