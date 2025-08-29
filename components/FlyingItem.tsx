'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getVegetableImage } from '@/utils/imageUtils'
import { Vegetable } from '@prisma/client'

interface FlyingItemProps {
  vegetable: Vegetable
  weight: string
  isVisible: boolean
  onAnimationComplete: () => void
}

export default function FlyingItem({ vegetable, weight, isVisible, onAnimationComplete }: FlyingItemProps) {
  const [imageSrc, setImageSrc] = useState<string>('')
  
  useEffect(() => {
    if (isVisible) {
      setImageSrc(vegetable.imageUrl && vegetable.imageUrl.trim() !== '' 
        ? vegetable.imageUrl 
        : getVegetableImage(vegetable.name))
    }
  }, [isVisible, vegetable])
  
  if (!isVisible) return null
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{
            position: 'fixed',
            zIndex: 1000,
            scale: 1,
            opacity: 1
          }}
          animate={{
            x: [0, 300], // Fly to the right (cart icon position)
            y: [0, -100], // Fly upward
            scale: [1, 0.3], // Shrink as it flies
            opacity: [1, 0.8, 0]
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut"
          }}
          onAnimationComplete={onAnimationComplete}
          className="fixed z-50 pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Flying Vegetable Card */}
          <div className="w-20 h-20 bg-white rounded-lg shadow-lg border border-green-200 overflow-hidden">
            <img
              src={imageSrc}
              alt={vegetable.name}
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
          
          {/* Weight Badge */}
          <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            {weight}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
