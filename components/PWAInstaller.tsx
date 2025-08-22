'use client'

import { useState, useEffect } from 'react'

// Extend Navigator interface for iOS-specific properties
declare global {
  interface Navigator {
    standalone?: boolean
  }
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if running as standalone PWA
    if (typeof window !== 'undefined') {
      setIsStandalone(
        (navigator as any).standalone || 
        window.matchMedia('(display-mode: standalone)').matches
      )
      
      // Check if iOS device
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      setIsIOS(iOS)
    }

    // Listen for beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      console.log('PWA was installed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  // Don't show anything if already installed or if iOS (they use different method)
  if (isStandalone || !showInstallPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-green-200 p-4 max-w-sm mx-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">📱</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">
              Install ApnaCart
            </h3>
            <p className="text-xs text-gray-600">
              {isIOS 
                ? 'Tap Share → Add to Home Screen'
                : 'Install as app for better experience'
              }
            </p>
          </div>
          {!isIOS && (
            <button
              onClick={handleInstallClick}
              className="flex-shrink-0 px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
            >
              Install
            </button>
          )}
        </div>
        
        {isIOS && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span>1. Tap the Share button</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span>2. Scroll down and tap "Add to Home Screen"</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span>3. Tap "Add" to install</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
