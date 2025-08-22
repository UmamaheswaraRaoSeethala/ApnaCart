'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import VegetableCard from '@/components/VegetableCard'
import CartSelection from '@/components/CartSelection'
import PWAInstaller from '@/components/PWAInstaller'
import { Vegetable } from '@prisma/client'

export default function HomePage() {
  const [vegetables, setVegetables] = useState<Vegetable[]>([])
  const [selectedCart, setSelectedCart] = useState<'small' | 'family' | null>(null)
  const [selectedWeights, setSelectedWeights] = useState<Record<number, string>>({})
  const [cartItems, setCartItems] = useState<Record<number, { weight: string; weightInKg: number; quantity: number }>>({})
  const [totalWeight, setTotalWeight] = useState(0)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  const router = useRouter()

  const cartLimits = {
    small: 4.5, // kg
    family: 7.0  // kg
  }

  // Helper function to calculate remaining weight precisely
  const getRemainingWeight = (cartType: 'small' | 'family', currentWeight: number): string => {
    const cartLimitGrams = cartType === 'small' ? 4500 : 7000 // Convert kg to grams
    const currentWeightGrams = Math.round(currentWeight * 1000) // Convert kg to grams, round to avoid floating point issues
    const remainingGrams = cartLimitGrams - currentWeightGrams
    const remainingKg = remainingGrams / 1000
    return remainingKg.toFixed(2)
  }

  // Helper function to format weight consistently
  const formatWeight = (weightInKg: number): string => {
    return weightInKg.toFixed(2)
  }

  // Default weight for all vegetables (500g)
  const defaultWeight = '500g'
  const defaultWeightInKg = 0.5

  // Fetch vegetables from API
  useEffect(() => {
    const fetchVegetables = async () => {
      try {
        const response = await fetch('/api/vegetables')
        if (response.ok) {
          const data = await response.json()
          setVegetables(data.vegetables)
          
          // Initialize default weights (500g) for all vegetables
          const defaultWeights: Record<number, string> = {}
          data.vegetables.forEach((veg: Vegetable) => {
            defaultWeights[veg.id] = defaultWeight
          })
          setSelectedWeights(defaultWeights)
        }
      } catch (error) {
        console.error('Error fetching vegetables:', error)
      }
    }

    fetchVegetables()
  }, [])

  // Show floating button when items are added to cart
  useEffect(() => {
    setShowFloatingButton(Object.keys(cartItems).length > 0)
  }, [cartItems])

  // Calculate total weight whenever cart items change
  useEffect(() => {
    let total = 0
    for (const vegId in cartItems) {
      total += cartItems[vegId].weightInKg * cartItems[vegId].quantity
    }
    setTotalWeight(total)
  }, [cartItems])

  // Note: Removed scroll prevention logic to avoid any scroll-related side effects

  const getWeightInKg = (weight: string) => {
    if (weight === '1kg') return 1
    const grams = parseInt(weight.replace('g', ''))
    return grams / 1000
  }

  const handleWeightChange = (vegetableId: number, weight: string) => {
    setSelectedWeights(prev => ({
      ...prev,
      [vegetableId]: weight
    }))
  }

  const handleAddToCart = (vegetableId: number) => {
    if (!selectedCart) return

    const selectedWeight = selectedWeights[vegetableId] || defaultWeight
    const weightInKg = getWeightInKg(selectedWeight)
    
    // Check if adding this item would exceed cart limit
    const newTotalWeight = totalWeight + weightInKg
    const cartLimit = cartLimits[selectedCart]
    
    if (newTotalWeight > cartLimit) {
      alert(`You have reached the maximum weight limit for this cart (${cartLimit}kg). Cannot add more vegetables.`)
      return
    }
    
    // Add to cart
    setCartItems(prev => ({
      ...prev,
      [vegetableId]: {
        weight: selectedWeight,
        weightInKg: weightInKg,
        quantity: 1
      }
    }))
  }

  const handleRemoveFromCart = (vegetableId: number) => {
    setCartItems(prev => {
      const newItems = { ...prev }
      delete newItems[vegetableId]
      return newItems
    })
  }

  const handleIncreaseQuantity = (vegetableId: number) => {
    if (!selectedCart) return

    const currentItem = cartItems[vegetableId]
    if (!currentItem) return

    const newQuantity = currentItem.quantity + 1
    const newTotalWeight = totalWeight + currentItem.weightInKg
    const cartLimit = cartLimits[selectedCart]
    
    if (newTotalWeight > cartLimit) {
      alert(`You have reached the maximum weight limit for this cart (${cartLimit}kg). Cannot add more vegetables.`)
      return
    }
    
    setCartItems(prev => ({
      ...prev,
      [vegetableId]: {
        ...prev[vegetableId],
        quantity: newQuantity
      }
    }))
  }

  const handleDecreaseQuantity = (vegetableId: number) => {
    const currentItem = cartItems[vegetableId]
    if (!currentItem) return

    if (currentItem.quantity <= 1) {
      // Remove item if quantity would be 0
      handleRemoveFromCart(vegetableId)
    } else {
      setCartItems(prev => ({
        ...prev,
        [vegetableId]: {
          ...prev[vegetableId],
          quantity: prev[vegetableId].quantity - 1
        }
      }))
    }
  }

  const handleCartSelection = (cartType: 'small' | 'family') => {
    setSelectedCart(cartType)
    // Reset cart when changing cart type
    setCartItems({})
    // Note: Removed auto-scroll behavior - vegetables will appear in place
  }

  const canPlaceOrder = selectedCart && totalWeight >= cartLimits[selectedCart]

  const generateWhatsAppMessage = () => {
    if (!selectedCart) return ''

    const cartType = selectedCart === 'small' ? 'Small Cart (4.5kg)' : 'Family Cart (7kg)'
    const items = Object.entries(cartItems)
      .map(([vegId, item]) => {
        const vegetable = vegetables.find(v => v.id === parseInt(vegId))
        if (vegetable) {
          return `${vegetable.name} – ${item.weight}`
        }
        return ''
      })
      .filter(Boolean)
      .join('\n')

    const message = `🍅 *ApnaCart Order*\n\n` +
      `*Cart Type:* ${cartType}\n` +
      `*Selected Vegetables:*\n${items}\n\n` +
      `*Total Weight:* ${totalWeight.toFixed(2)}kg\n\n` +
      `*Order Summary:*\n` +
      `• Cart Type: ${cartType}\n` +
      `• Total Weight: ${totalWeight.toFixed(2)}kg\n` +
      `• Vegetables: ${Object.keys(cartItems).length} types\n\n` +
      `Please confirm this order.`

    return encodeURIComponent(message)
  }

  const handleWhatsAppOrder = () => {
    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const scrollToOrderSummary = () => {
    // Scroll to order summary when floating cart button is clicked
    const orderSummary = document.getElementById('order-summary')
    if (orderSummary) {
      orderSummary.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative">
      {/* Fresh Vegetable Background */}
      <div className="absolute inset-0">
        {/* Simple Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-green-300 rounded-full"></div>
          <div className="absolute bottom-40 left-20 w-20 h-20 bg-green-500 rounded-full"></div>
          <div className="absolute top-60 left-1/4 w-16 h-16 bg-green-200 rounded-full"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-green-300 rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-green-400 rounded-full"></div>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-white/50 to-green-100/30"></div>
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-green-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  ApnaCart
                </div>
              </div>
              <nav className="flex space-x-6">
                {/* Instagram Icon */}
                <a 
                  href="https://www.instagram.com/apnacart9?igsh=b3lyYjh2cmY0ZGg3&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  title="Follow us on Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                
                {/* WhatsApp Icon */}
                <a 
                  href="https://wa.me/919100018181?text=Hi! I'm interested in your fresh vegetables from ApnaCart" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  title="Contact us on WhatsApp"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight px-4">
                Fresh Vegetables,{' '}
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Smart Shopping
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Choose your basket size, add your favorite vegetables by weight, and place your weekly order. 
                Simple, fresh, and convenient.
              </p>
            </div>
          </div>

          {/* Cart Selection */}
          <CartSelection 
            selectedCart={selectedCart}
            onCartSelect={handleCartSelection}
          />

          {/* Vegetables Display */}
          {selectedCart && (
            <div className="mt-8" style={{ 
              scrollMargin: '0px', 
              scrollSnapAlign: 'none',
              contain: 'layout style'
            }}>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Fresh Vegetables Available
                </h2>
                <div className="inline-flex items-center space-x-6 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100">
                  <span className="text-base font-semibold text-gray-700">
                    <span className="text-green-600">{Object.keys(cartItems).length}</span> Items
                  </span>
                  <div className="w-px h-6 bg-green-200"></div>
                  <span className="text-base font-semibold text-gray-700">
                    <span className="text-blue-600">{formatWeight(totalWeight)}kg</span> / <span className="text-green-600">{cartLimits[selectedCart]}kg</span>
                  </span>
                </div>
              </div>

              {/* Weight Progress Bar */}
              <div className="mb-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-semibold text-gray-700">
                      Current Weight: <span className="text-blue-600">{formatWeight(totalWeight)}kg</span>
                    </span>
                    <span className="text-lg font-semibold text-gray-700">
                      Required: <span className="text-green-600">{cartLimits[selectedCart]}kg</span>
                    </span>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                      <div 
                        className={`h-4 rounded-full transition-all duration-500 ease-out shadow-lg ${
                          totalWeight >= cartLimits[selectedCart] 
                            ? 'bg-gradient-to-r from-green-500 to-green-600' 
                            : 'bg-gradient-to-r from-blue-500 to-blue-600'
                        }`}
                        style={{ 
                          width: `${Math.min((totalWeight / cartLimits[selectedCart]) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-6">
                    <span className={`text-base px-6 py-3 rounded-full font-medium shadow-lg ${
                      totalWeight >= cartLimits[selectedCart] 
                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200' 
                        : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200'
                    }`}>
                      {totalWeight >= cartLimits[selectedCart] 
                        ? 'You can now place your order' 
                        : `Add ${getRemainingWeight(selectedCart, totalWeight)}kg to place your order`
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Vegetables Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 mb-12 px-4 md:px-0">
                {vegetables.map((vegetable: Vegetable, index: number) => (
                  <VegetableCard
                    key={vegetable.id}
                    vegetable={vegetable}
                    selectedWeight={selectedWeights[vegetable.id] || defaultWeight}
                    onWeightChange={(weight) => handleWeightChange(vegetable.id, weight)}
                    onAddToCart={() => handleAddToCart(vegetable.id)}
                    onRemoveFromCart={() => handleRemoveFromCart(vegetable.id)}
                    onIncreaseQuantity={() => handleIncreaseQuantity(vegetable.id)}
                    onDecreaseQuantity={() => handleDecreaseQuantity(vegetable.id)}
                    isInCart={!!cartItems[vegetable.id]}
                    quantity={cartItems[vegetable.id]?.quantity || 1}
                  />
                ))}
              </div>

              {/* Order Summary - Only show when items are added */}
              {Object.keys(cartItems).length > 0 && (
                <div 
                  id="order-summary"
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100 mb-8"
                >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900">
                    Order Summary
                  </h3>
                  {Object.keys(cartItems).length > 0 && (
                    <button
                      onClick={() => setCartItems({})}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Clear Cart
                    </button>
                  )}
                </div>
                
                {Object.keys(cartItems).length === 0 ? (
                  <div className="text-center py-12">
                    <h4 className="text-2xl font-semibold text-gray-700 mb-3">Your cart is empty</h4>
                    <p className="text-lg text-gray-500">Select weights and add vegetables to your cart</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-8">
                      {Object.entries(cartItems).map(([vegId, item]) => {
                        const vegetable = vegetables.find(v => v.id === parseInt(vegId))
                        if (!vegetable) return null
                        return (
                          <div key={vegId} className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                            <span className="text-lg font-semibold text-gray-800">{vegetable.name}</span>
                            <div className="text-right">
                              <span className="text-lg font-semibold text-gray-700">{item.quantity}x {item.weight}</span>
                              <div className="text-sm text-gray-500">({formatWeight(item.weightInKg * item.quantity)}kg)</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="border-t border-green-200 pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-gray-800">Total Weight: {formatWeight(totalWeight)}kg</span>
                        {!canPlaceOrder && (
                          <span className="text-red-600 text-lg font-semibold bg-red-100 px-6 py-3 rounded-xl border border-red-200">
                            📝 Add {getRemainingWeight(selectedCart, totalWeight)}kg to place your order
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              )}

              {/* Confirm Order Button */}
              {canPlaceOrder && (
                <div className="text-center">
                  <button
                    onClick={handleWhatsAppOrder}
                    className="px-12 py-6 bg-gradient-to-r from-green-500 to-green-600 text-white text-2xl font-bold rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                  >
                    Confirm Order via WhatsApp
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Floating WhatsApp Order Button - Middle of Page */}
        {Object.keys(cartItems).length > 0 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <button
              onClick={handleWhatsAppOrder}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-bold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border border-green-400"
            >
              {totalWeight >= cartLimits[selectedCart!] 
                ? `Place Order with ${selectedCart === 'small' ? 'Small' : 'Family'} Cart`
                : `Add ${getRemainingWeight(selectedCart!, totalWeight)}kg to place your order`
              }
            </button>
          </div>
        )}

        {/* Floating Cart Button */}
        {showFloatingButton && (
          <button
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-2xl hover:shadow-3xl flex items-center justify-center text-sm font-bold focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 hover:scale-110"
            onClick={scrollToOrderSummary}
            title="View Cart"
          >
            Cart
          </button>
        )}

        {/* PWA Installer */}
        <PWAInstaller />
      </div>
    </div>
  )
}