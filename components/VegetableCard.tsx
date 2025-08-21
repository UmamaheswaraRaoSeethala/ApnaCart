'use client'

import { Vegetable } from '@prisma/client'

interface VegetableCardProps {
  vegetable: Vegetable
  selectedWeight: string
  onWeightChange: (weight: string) => void
  onAddToCart: () => void
  onRemoveFromCart: () => void
  onIncreaseQuantity: () => void
  onDecreaseQuantity: () => void
  isInCart: boolean
  quantity?: number
}

export default function VegetableCard({ 
  vegetable, 
  selectedWeight,
  onWeightChange,
  onAddToCart,
  onRemoveFromCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  isInCart,
  quantity = 1
}: VegetableCardProps) {
  const weightOptions = ['250g', '500g', '1kg']

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-green-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      {/* Image Placeholder */}
      <div className="relative">
        {vegetable.imageUrl ? (
          <>
            <img
              src={vegetable.imageUrl}
              alt={vegetable.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                // Fallback to emoji if image fails to load
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.nextElementSibling?.classList.remove('hidden')
              }}
            />
            <div className="absolute inset-0 w-full h-48 bg-gradient-to-br from-green-100 via-green-200 to-green-300 flex items-center justify-center hidden">
              <div className="text-center">
                <div className="text-6xl mb-3 transition-transform duration-300 hover:scale-110">🥬</div>
                <div className="text-base text-green-800 font-semibold px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-green-200 shadow-sm">
                  {vegetable.name}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-green-100 via-green-200 to-green-300 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-3 transition-transform duration-300 hover:scale-110">🥬</div>
              <div className="text-base text-green-800 font-semibold px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-green-200 shadow-sm">
                {vegetable.name}
              </div>
            </div>
          </div>
        )}
        
        {/* Brand Badge */}
        <div className="absolute top-4 left-4">
          <div className="px-3 py-1 bg-green-500/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white shadow-lg border border-green-400">
            ApnaCart
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Product Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
          {vegetable.name}
        </h3>
        
        {/* Weight Selection Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
            Select Weight:
          </label>
          <select
            value={selectedWeight}
            onChange={(e) => onWeightChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-green-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-green-300"
          >
            {weightOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        
        {/* Add Button - Only show when not in cart */}
        {!isInCart && (
          <div className="text-center">
            <button
              onClick={onAddToCart}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-green-400"
              title="Add to Cart"
            >
              ➕ Add to Cart
            </button>
          </div>
        )}
        
        {/* Quantity Controls - Show when in cart */}
        {isInCart && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              {/* Bookmark Button */}
              <button className="w-8 h-8 bg-white border-2 border-green-200 rounded-lg flex items-center justify-center hover:bg-green-50 hover:border-green-400 transition-all duration-200 shadow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
              
              {/* Quantity Controls */}
              <div className="flex items-center bg-gradient-to-r from-green-500 to-green-600 rounded-xl overflow-hidden shadow-lg border border-green-400">
                <button
                  onClick={onDecreaseQuantity}
                  className="w-8 h-8 bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center justify-center font-bold text-sm"
                >
                  -
                </button>
                <div className="w-10 h-8 bg-white flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">{quantity}</span>
                </div>
                <button
                  onClick={onIncreaseQuantity}
                  className="w-8 h-8 bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center justify-center font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Remove Button */}
            <button
              onClick={onRemoveFromCart}
              className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              🗑️ Remove
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
