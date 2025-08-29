'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react'
import { getVegetableImage } from '@/utils/imageUtils'

export default function CartDrawer() {
  const { state, closeCart, removeItem, updateQuantity, clearCart, getRemainingWeight, getCartLimit } = useCart()
  const { items, totalWeight, cartType, isOpen } = state
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const cartLimit = getCartLimit()
  const remainingWeight = getRemainingWeight()
  const isCartFull = totalWeight >= cartLimit
  
  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or negative
      removeItem(id)
    } else {
      // Try to update quantity
      const success = updateQuantity(id, newQuantity)
      if (!success) {
        // Show warning if weight limit would be exceeded
        alert('Cannot increase quantity - would exceed cart weight limit!')
      }
    }
  }
  
  const handleRemoveItem = (id: number) => {
    removeItem(id)
  }
  
  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart()
    }
  }

  const handleWhatsAppOrder = () => {
    if (!cartType || items.length === 0) return

    const cartTypeText = cartType === 'small' ? 'Small Cart (4.5kg)' : 'Family Cart (7kg)'
    const itemsList = items
      .map(item => `${item.vegetable.name} – ${item.weight} x${item.quantity} = ${(item.weightInKg * item.quantity).toFixed(2)}kg`)
      .join('\n')

    const message = `🛒 *ApnaCart Order*\n\n` +
      `*Cart Type:* ${cartTypeText}\n` +
      `*Total Weight:* ${totalWeight.toFixed(2)}kg\n` +
      `*Items Count:* ${itemCount}\n\n` +
      `*Selected Vegetables:*\n${itemsList}\n\n` +
      `*Order Summary:*\n` +
      `• Cart Type: ${cartTypeText}\n` +
      `• Total Weight: ${totalWeight.toFixed(2)}kg\n` +
      `• Items: ${items.length}\n` +
      `• Individual Items: ${itemCount}\n\n` +
      `Please confirm this order and provide delivery details.`

    const whatsappUrl = `https://wa.me/919100018181?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    // Close cart drawer after opening WhatsApp
    closeCart()
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Cart Type and Weight Info */}
            {cartType && (
              <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 border-b border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {cartType === 'small' ? 'Small Cart' : 'Family Cart'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {cartType === 'small' ? '4.5kg' : '7.0kg'} limit
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(totalWeight / cartLimit) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>{totalWeight.toFixed(2)}kg used</span>
                  <span>{remainingWeight}kg remaining</span>
                </div>
              </div>
            )}
            
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500">Add some vegetables to get started!</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      {/* Item Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.vegetable.imageUrl && item.vegetable.imageUrl.trim() !== '' 
                            ? item.vegetable.imageUrl 
                            : getVegetableImage(item.vegetable.name)}
                          alt={item.vegetable.name}
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
                      </div>
                      
                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.vegetable.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Weight: {item.weight}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(item.weightInKg * item.quantity).toFixed(2)}kg total
                        </p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
                          title="Decrease Quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <span className="w-8 text-center font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-full flex items-center justify-center transition-colors"
                          title="Increase Quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-gray-900">
                    Total Weight: {totalWeight.toFixed(2)}kg
                  </span>
                  <span className="text-sm text-gray-500">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </span>
                </div>
                
                {/* Weight Limit Warning */}
                {isCartFull && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4 p-3 bg-green-100 border border-green-200 rounded-lg"
                  >
                    <p className="text-sm text-green-800 font-medium">
                      🎉 Your cart is full! You can now place your order.
                    </p>
                  </motion.div>
                )}
                
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleClearCart}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={handleWhatsAppOrder}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Place Order via WhatsApp</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
