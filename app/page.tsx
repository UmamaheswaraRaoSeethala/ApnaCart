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
                <button 
                  onClick={() => router.push('/admin')}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Admin Panel
                </button>
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