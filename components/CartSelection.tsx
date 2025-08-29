'use client'

import { motion } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'

export default function CartSelection() {
  const { state, setCartType } = useCart()
  const { cartType } = state
  
  const handleCartSelect = (type: 'small' | 'family') => {
    setCartType(type)
  }
  
  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Cart Size
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the basket size that fits your family's needs, then add your favorite vegetables.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto px-4 md:px-0">
        {/* Small Cart */}
        <motion.div 
          className={`relative p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
            cartType === 'small'
              ? 'border-green-500 bg-green-50 shadow-xl scale-105'
              : 'border-green-200 bg-white/80 backdrop-blur-sm hover:border-green-400 shadow-lg hover:shadow-xl hover:scale-105'
          }`}
          onClick={() => handleCartSelect('small')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-400 rounded-full translate-y-12 -translate-x-12"></div>
          </div>

          <div className="relative text-center">
            <div className="text-6xl mb-6 transition-transform duration-300 hover:scale-110">
              🥬
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Small Cart
            </h3>
            <div className="text-3xl font-bold text-green-600 mb-3">
              ₹349
            </div>
            <p className="text-gray-600 text-base mb-4">
              Perfect for small families or weekly shopping
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-800 font-medium border border-green-200">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Up to 4.5 kg vegetables
            </div>
            
            {/* Selection Indicator */}
            {cartType === 'small' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white"
              >
                ✓
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Family Cart */}
        <motion.div 
          className={`relative p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
            cartType === 'family'
              ? 'border-green-500 bg-green-50 shadow-xl scale-105'
              : 'border-green-200 bg-white/80 backdrop-blur-sm hover:border-green-400 shadow-lg hover:shadow-xl hover:scale-105'
          }`}
          onClick={() => handleCartSelect('family')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-400 rounded-full translate-y-12 -translate-x-12"></div>
          </div>
          
          <div className="relative text-center">
            <div className="text-6xl mb-6 transition-transform duration-300 hover:scale-110">
              🥕
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Family Cart
            </h3>
            <div className="text-3xl font-bold text-green-600 mb-3">
              ₹559
            </div>
            <p className="text-gray-600 text-base mb-4">
              Ideal for larger families or extended shopping
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-800 font-medium border border-green-200">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Up to 7 kg vegetables
            </div>
            
            {/* Selection Indicator */}
            {cartType === 'family' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white"
              >
                ✓
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Cart Selection Feedback */}
      {cartType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-100 rounded-full border border-green-200">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-green-800 font-medium">
              {cartType === 'small' ? 'Small Cart' : 'Family Cart'} selected! 
              You can now add vegetables up to {cartType === 'small' ? '4.5kg' : '7kg'}.
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}