'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

interface WeightLimitWarningProps {
  isVisible: boolean
  onClose: () => void
  remainingWeight: string
  cartType: 'small' | 'family'
}

export default function WeightLimitWarning({ 
  isVisible, 
  onClose, 
  remainingWeight, 
  cartType 
}: WeightLimitWarningProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
        >
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  Cart Weight Limit Reached
                </h3>
                <p className="text-sm text-red-700 mb-2">
                  You've reached the maximum weight limit for your {cartType === 'small' ? 'Small Cart (4.5kg)' : 'Family Cart (7kg)'}.
                </p>
                <p className="text-sm text-red-600">
                  Remove some items or edit quantities to add more vegetables.
                </p>
              </div>
              
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1 text-red-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-red-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-red-600 mt-1">
                <span>0kg remaining</span>
                <span>{cartType === 'small' ? '4.5kg' : '7kg'} limit</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
