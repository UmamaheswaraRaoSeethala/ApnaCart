'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import VegetableCard from '@/components/VegetableCard'
import CartSelection from '@/components/CartSelection'
import PWAInstaller from '@/components/PWAInstaller'
import CartIcon from '@/components/CartIcon'
import CartDrawer from '@/components/CartDrawer'
import Header from '@/components/Header'
import { Vegetable } from '@prisma/client'
import { CartProvider, useCart } from '@/contexts/CartContext'

function VegetablesSection() {
  const [vegetables, setVegetables] = useState<Vegetable[]>([])
  const { state } = useCart()
  const { cartType, totalWeight, items } = state
  
  // Fetch vegetables from API
  useEffect(() => {
    const fetchVegetables = async () => {
      try {
        const response = await fetch('/api/vegetables')
        if (response.ok) {
          const data = await response.json()
          setVegetables(data.vegetables)
        }
      } catch (error) {
        console.error('Error fetching vegetables:', error)
      }
    }

    fetchVegetables()
  }, [])

  if (!cartType) return null

  const cartLimit = cartType === 'small' ? 4.5 : 7.0
  const remainingWeight = cartLimit - totalWeight
  const canPlaceOrder = totalWeight >= cartLimit

  const generateWhatsAppMessage = () => {
    if (!cartType) return ''
    
    const cartTypeText = cartType === 'small' ? 'Small Cart (4.5kg)' : 'Family Cart (7kg)'
    const itemsList = items
      .map(item => `${item.vegetable.name} – ${item.weight} x${item.quantity}`)
      .join('\n')

    const message = `🍅 *ApnaCart Order*\n\n` +
      `*Cart Type:* ${cartTypeText}\n` +
      `*Selected Vegetables:*\n${itemsList}\n\n` +
      `*Total Weight:* ${totalWeight.toFixed(2)}kg\n\n` +
      `*Order Summary:*\n` +
      `• Cart Type: ${cartTypeText}\n` +
      `• Total Weight: ${totalWeight.toFixed(2)}kg\n` +
      `• Items: ${items.length}\n\n` +
      `Please confirm this order.`

    return message
  }

  const handleWhatsAppOrder = () => {
    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="mt-8">
      {/* Cart Type Display and Progress */}
      <div className="text-center mb-8">
        <div className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full shadow-lg mb-6">
          <span className="text-lg font-semibold">
            {cartType === 'small' ? 'Small Cart (4.5kg)' : 'Family Cart (7kg)'}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min((totalWeight / cartLimit) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium">
              {canPlaceOrder 
                ? 'You can now place your order' 
                : `Add ${remainingWeight.toFixed(2)}kg to place your order`
              }
            </span>
          </div>
        </div>
      </div>

      {/* Vegetables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4 mb-12 px-4 md:px-0">
        {vegetables.map((vegetable: Vegetable) => (
          <VegetableCard
            key={vegetable.id}
            vegetable={vegetable}
          />
        ))}
      </div>

      {/* Order Summary - Only show when items are added */}
      {items.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900">
              Order Summary
            </h3>
          </div>
          
          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <span className="text-lg font-semibold text-gray-800">{item.vegetable.name}</span>
                <div className="text-right">
                  <span className="text-lg font-semibold text-gray-700">{item.quantity}x {item.weight}</span>
                  <div className="text-sm text-gray-500">({(item.weightInKg * item.quantity).toFixed(2)}kg)</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-green-200 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-800">Total Weight: {totalWeight.toFixed(2)}kg</span>
              {!canPlaceOrder && (
                <span className="text-red-600 text-lg font-semibold bg-red-100 px-6 py-3 rounded-xl border border-red-200">
                  📝 Add {remainingWeight.toFixed(2)}kg to place your order
                </span>
              )}
            </div>
          </div>
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
  )
}

export default function HomePage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Header */}
        <Header />
        
        <div className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full"></div>
              <div className="absolute top-40 right-20 w-24 h-24 bg-green-300 rounded-full"></div>
              <div className="absolute bottom-40 left-20 w-20 h-20 bg-green-500 rounded-full"></div>
              <div className="absolute top-60 left-1/4 w-16 h-16 bg-green-200 rounded-full"></div>
              <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-green-300 rounded-full"></div>
              <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-green-400 rounded-full"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 via-white/70 to-green-100/40"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Main Title - Only show when no cart is selected */}
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Fresh Vegetables Delivered
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-6">
                  Select your cart type and start shopping
                </p>
              </div>

              {/* Cart Selection */}
              <CartSelection />
              
              {/* Vegetables Section */}
              <VegetablesSection />
            </div>
          </div>

          {/* Cart Icon - Fixed Position */}
          <CartIcon />
          
          {/* Cart Drawer */}
          <CartDrawer />
        </div>

        {/* PWA Installer */}
        <PWAInstaller />
      </div>
    </CartProvider>
  )
}