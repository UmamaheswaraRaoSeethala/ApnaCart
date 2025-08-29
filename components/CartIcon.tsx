'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'
import { ShoppingCart } from 'lucide-react'

export default function CartIcon() {
  const { state, openCart } = useCart()
  const { items, totalWeight, cartType } = state
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const isCartFull = cartType && totalWeight >= (cartType === 'small' ? 4.5 : 7.0)
  
  return (
    <motion.button
      onClick={openCart}
      className="fixed top-24 md:top-28 right-6 z-50 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-2xl hover:shadow-3xl flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 hover:scale-110"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title="View Cart"
    >
      <ShoppingCart className="w-6 h-6" />
      
      {/* Item Count Badge */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
              isCartFull 
                ? 'bg-green-500 text-white' 
                : 'bg-orange-500 text-white'
            }`}
          >
            {itemCount}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Weight Indicator */}
      {cartType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 text-xs font-medium px-2 py-1 rounded-md shadow-lg border border-gray-200 whitespace-nowrap"
        >
          {totalWeight.toFixed(2)}kg / {cartType === 'small' ? '4.5' : '7.0'}kg
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
