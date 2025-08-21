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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🥬 Admin Dashboard – Manage Vegetables
          </h1>
          <p className="text-gray-600">
            Add, edit, and manage your vegetable inventory
          </p>
        </div>

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
  )
}

