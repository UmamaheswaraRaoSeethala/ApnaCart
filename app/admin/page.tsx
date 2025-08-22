'use client'

import { useState, useEffect } from 'react'
import AddVegetableForm from '@/components/AddVegetableForm'
import VegetablesList from '@/components/VegetablesList'
import { Vegetable } from '@prisma/client'

export default function AdminPage() {
  const [vegetables, setVegetables] = useState<Vegetable[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch vegetables on component mount
  useEffect(() => {
    fetchVegetables()
  }, [])

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

  const handleAddVegetable = async (name: string, weightUnit: string, imageUrl: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/vegetables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, weightUnit, imageUrl }),
      })

      if (response.ok) {
        await fetchVegetables() // Refresh the list
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to add vegetable')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteVegetable = async (id: number) => {
    if (!confirm('Are you sure you want to delete this vegetable?')) return

    try {
      const response = await fetch(`/api/vegetables/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchVegetables() // Refresh the list
      } else {
        alert('Failed to delete vegetable')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative py-8">
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
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 via-white/70 to-green-100/40"></div>
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your vegetables inventory
            </p>
          </div>

          {/* Vegetables Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AddVegetableForm 
              onAdd={handleAddVegetable}
              isLoading={isLoading}
            />
            
            <VegetablesList 
              vegetables={vegetables}
              onDelete={handleDeleteVegetable}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

