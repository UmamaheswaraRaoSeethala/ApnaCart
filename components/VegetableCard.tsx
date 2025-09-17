'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Vegetable } from '@prisma/client'
import { getVegetableImage } from '@/utils/imageUtils'
import { useCart } from '@/contexts/CartContext'
import FlyingItem from './FlyingItem'
import WeightLimitWarning from './WeightLimitWarning'
import { formatWeight, formatTotalWeight, convertToGrams, gramsToKg } from '@/utils/weightUtils'
import { Plus, Minus } from 'lucide-react'

interface VegetableCardProps {
  vegetable: Vegetable
}

export default function VegetableCard({ vegetable }: VegetableCardProps) {
  const { addItem, canAddItem, getRemainingWeight, getCartLimit, state, updateQuantity, removeItem } = useCart()
  const [isFlying, setIsFlying] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  
  const { cartType, totalWeight, items } = state
  
  // Get the best available image for this vegetable
  const imageSrc = vegetable.imageUrl && vegetable.imageUrl.trim() !== '' 
    ? vegetable.imageUrl 
    : getVegetableImage(vegetable.name)
  
  // Get weight information
  const weight = vegetable.fixedWeight || vegetable.weightUnit || '500g'
  const weightInGrams = convertToGrams(weight)
  const weightInKg = gramsToKg(weightInGrams)
  
  // Check if item is in cart and get its quantity
  const cartItem = items.find(item => item.id === vegetable.id)
  const isInCart = !!cartItem
  const quantity = cartItem?.quantity || 0
  
  const handleAddToCart = () => {
    if (!cartType) {
      alert('Please select a cart type first!')
      return
    }
    
    if (canAddItem(weightInKg)) {
      // Start flying animation
      setIsFlying(true)
      
      // Add item to cart
      const success = addItem(vegetable, weight, weightInKg)
      
      if (success) {
        // Animation will complete and reset isFlying
      }
    } else {
      // Show weight limit warning
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 5000)
    }
  }
  
  const handleIncreaseQuantity = () => {
    if (cartItem) {
      const newQuantity = quantity + 1
      const success = updateQuantity(cartItem.id, newQuantity)
      if (!success) {
        setShowWarning(true)
        setTimeout(() => setShowWarning(false), 5000)
      }
    }
  }
  
  const handleDecreaseQuantity = () => {
    if (cartItem) {
      const newQuantity = quantity - 1
      if (newQuantity <= 0) {
        // Remove item from cart when quantity reaches 0
        removeItem(cartItem.id)
      } else {
        updateQuantity(cartItem.id, newQuantity)
      }
    }
  }
  
  const handleAnimationComplete = () => {
    setIsFlying(false)
  }
  
  return (
    <>
      <motion.div 
        className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-green-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Image Section - Show automatic or custom image */}
        <div className="relative">
          <img
            src={imageSrc}
            alt={vegetable.name}
            className="w-full h-24 sm:h-32 md:h-36 object-cover"
            onError={(e) => {
              // Hide broken image and show "No Image" placeholder
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-24 sm:h-32 md:h-36 bg-gray-100 flex items-center justify-center border-b border-gray-200">
                    <div class="text-center">
                      <div class="text-gray-400 text-xs sm:text-sm font-medium">No Image</div>
                    </div>
                  </div>
                `
              }
            }}
          />
          
          {/* Brand Badge */}
          <div className="absolute top-2 left-2">
            <div className="px-2 py-1 bg-green-500/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white shadow-lg border border-green-400">
              ApnaCart
            </div>
          </div>
          
          {/* Quantity Badge if in cart */}
          {isInCart && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
            >
              {quantity}
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          {/* Product Name */}
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-2 sm:mb-3 text-center">
            {vegetable.name}
          </h3>
          
          {/* Fixed Weight Display */}
          <div className="mb-2 sm:mb-3 text-center">
            <div className="inline-block px-2 sm:px-3 py-1 sm:py-2 bg-green-100 text-green-800 text-xs sm:text-sm font-medium rounded-lg border border-green-200">
              Weight: {weight}
            </div>
          </div>
          
          {/* Add Button - Only show when not in cart */}
          {!isInCart && (
            <div className="text-center">
              <motion.button
                onClick={handleAddToCart}
                className="w-full px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-green-400"
                title="Add to Cart"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!cartType}
              >
                {!cartType ? 'Select Cart First' : 'Add to Cart'}
              </motion.button>
            </div>
          )}
          
          {/* Quantity Controls - Show when in cart */}
          {isInCart && (
            <div className="text-center">
              {/* Quantity Controls */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <motion.button
                  onClick={handleDecreaseQuantity}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Decrease Quantity"
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                </motion.button>
                
                <div className="w-10 h-8 sm:w-12 sm:h-10 bg-white border-2 border-green-200 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-green-600 font-bold text-sm sm:text-lg">{quantity}</span>
                </div>
                
                <motion.button
                  onClick={handleIncreaseQuantity}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Increase Quantity"
                  disabled={!canAddItem(weightInKg)}
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </motion.button>
              </div>
              
              {/* In Cart Badge */}
              <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></span>
                In Cart
              </div>
              
              {/* Total Weight for this item */}
              <div className="mt-1 sm:mt-2 text-xs text-gray-600">
                Total: {formatWeight(weightInKg * quantity)}
              </div>
            </div>
          )}
          
          {/* Weight Limit Info */}
          {cartType && (
            <div className="mt-3 text-center">
              <div className="text-xs text-gray-500">
                <span className="font-medium">Cart:</span> {cartType === 'small' ? 'Small (4.5kg)' : 'Family (7kg)'}
              </div>
              <div className="text-xs text-gray-500">
                <span className="font-medium">Used:</span> {formatTotalWeight(totalWeight)}
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Flying Item Animation */}
      <FlyingItem
        vegetable={vegetable}
        weight={weight}
        isVisible={isFlying}
        onAnimationComplete={handleAnimationComplete}
      />
      
      {/* Weight Limit Warning */}
      <WeightLimitWarning
        isVisible={showWarning}
        onClose={() => setShowWarning(false)}
        remainingWeight={getRemainingWeight()}
        cartType={cartType || 'small'}
      />
    </>
  )
}
