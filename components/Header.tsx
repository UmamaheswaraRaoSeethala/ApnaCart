'use client'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Instagram, MessageCircle, ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatTotalWeight } from '@/utils/weightUtils'

export default function Header() {
  const router = useRouter()
  const { state, openCart } = useCart()
  const { items, totalWeight, cartType } = state
  
  const itemCount = items.reduce((total: number, item: any) => total + item.quantity, 0)
  const isCartFull = cartType && totalWeight >= (cartType === 'small' ? 4.5 : 7.0)

  const handleLogoClick = () => {
    router.push('/')
  }

  const handleInstagramClick = () => {
    // Open Instagram profile in new tab
    window.open('https://www.instagram.com/apnacart9/', '_blank')
  }

  const handleWhatsAppClick = () => {
    // Open WhatsApp chat in new tab
    window.open('https://wa.me/919100018181', '_blank')
  }

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-green-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Left Side - Text Only */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={handleLogoClick}
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-green-300 rounded-lg p-2 transition-all duration-200"
            >
              <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                ApnaCart
              </span>
            </button>
          </motion.div>

          {/* Navigation Items - Right Side */}
          <nav className="flex items-center space-x-4 md:space-x-6">
            {/* Instagram Button */}
            <motion.button
              onClick={handleInstagramClick}
              className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Follow us on Instagram @apnacart9"
            >
              <Instagram className="w-5 h-5" />
            </motion.button>

            {/* WhatsApp Button */}
            <motion.button
              onClick={handleWhatsAppClick}
              className="p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Chat on WhatsApp +91 9100018181"
            >
              <MessageCircle className="w-5 h-5" />
            </motion.button>

            {/* Cart Button */}
            <div className="relative">
              <motion.button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Cart button clicked - itemCount:', itemCount, 'isCartFull:', isCartFull, 'totalWeight:', totalWeight)
                  
                  // Force cart to open regardless of state
                  try {
                    openCart()
                    console.log('openCart() called successfully')
                  } catch (error) {
                    console.error('Error opening cart:', error)
                  }
                }}
                className={`p-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 ${
                  itemCount > 0 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700' 
                    : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={itemCount > 0 ? `View Cart (${itemCount} items) - Always accessible` : "View Cart (Empty) - Always accessible"}
                type="button"
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.button>
              
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
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
