'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'
import { ShoppingCart } from 'lucide-react'
import { formatTotalWeight } from '@/utils/weightUtils'

export default function FloatingCartButton() {
  const { state, openCart } = useCart()
  const { items, totalWeight, cartType } = state
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const isCartFull = cartType && totalWeight >= (cartType === 'small' ? 4.5 : 7.0)
  
  // Only show the button when there are items in the cart
  if (itemCount === 0) return null
  
  const handleCartClick = () => {
    console.log('Floating cart button clicked - itemCount:', itemCount, 'totalWeight:', totalWeight)
    
    // Try multiple methods to ensure cart opens
    try {
      openCart()
      
      // Fallback using global control
      setTimeout(() => {
        if ((window as any).globalCartDrawerControl) {
          console.log('Using global control fallback from floating button')
          ;(window as any).globalCartDrawerControl.open()
        }
      }, 100)
    } catch (error) {
      console.error('Error opening cart from floating button:', error)
    }
  }
  
  return (
    <motion.button
      onClick={handleCartClick}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-2xl hover:shadow-3xl flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={`View Cart (${itemCount} items)`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      <ShoppingCart className="w-6 h-6" />
      
      {/* Item Count Badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
          isCartFull 
            ? 'bg-green-500 text-white' 
            : 'bg-orange-500 text-white'
        }`}
      >
        {itemCount}
      </motion.div>
      
      {/* Weight Indicator */}
      {cartType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 text-xs font-medium px-2 py-1 rounded-md shadow-lg border border-gray-200 whitespace-nowrap"
        >
          {formatTotalWeight(totalWeight)} / {cartType === 'small' ? '4.5kg' : '7kg'}
        </motion.div>
      )}
      
      {/* Pulse Animation when cart is full */}
      {isCartFull && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-green-400"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.button>
  )
}
