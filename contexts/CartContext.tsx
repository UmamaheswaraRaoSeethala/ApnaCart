'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Vegetable } from '@prisma/client'

export interface CartItem {
  id: number
  vegetable: Vegetable
  quantity: number
  weight: string
  weightInKg: number
}

interface CartState {
  items: CartItem[]
  totalWeight: number
  cartType: 'small' | 'family' | null
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { vegetable: Vegetable; weight: string; weightInKg: number } }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'SET_CART_TYPE'; payload: 'small' | 'family' | null }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'CLEAR_CART' }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { vegetable, weight, weightInKg } = action.payload
      const existingItem = state.items.find(item => item.id === vegetable.id)
      
      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = existingItem.quantity + 1
        const newTotalWeight = state.totalWeight - (existingItem.weightInKg * existingItem.quantity) + (weightInKg * newQuantity)
        
        // Check weight limit
        const cartLimit = state.cartType === 'small' ? 4.5 : 7.0
        if (newTotalWeight > cartLimit) {
          return state // Don't add if it exceeds limit
        }
        
        return {
          ...state,
          items: state.items.map(item =>
            item.id === vegetable.id
              ? { ...item, quantity: newQuantity }
              : item
          ),
          totalWeight: newTotalWeight
        }
      } else {
        // Add new item
        const newTotalWeight = state.totalWeight + weightInKg
        
        // Check weight limit
        const cartLimit = state.cartType === 'small' ? 4.5 : 7.0
        if (newTotalWeight > cartLimit) {
          return state // Don't add if it exceeds limit
        }
        
        return {
          ...state,
          items: [...state.items, {
            id: vegetable.id,
            vegetable,
            quantity: 1,
            weight,
            weightInKg
          }],
          totalWeight: newTotalWeight
        }
      }
    }
    
    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.id === action.payload)
      if (!itemToRemove) return state
      
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        totalWeight: state.totalWeight - (itemToRemove.weightInKg * itemToRemove.quantity)
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      if (!item) return state
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return {
          ...state,
          items: state.items.filter(item => item.id !== id),
          totalWeight: state.totalWeight - (item.weightInKg * item.quantity)
        }
      }
      
      const newTotalWeight = state.totalWeight - (item.weightInKg * item.quantity) + (item.weightInKg * quantity)
      
      // Check weight limit
      const cartLimit = state.cartType === 'small' ? 4.5 : 7.0
      if (newTotalWeight > cartLimit) {
        return state // Don't update if it exceeds limit
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        ),
        totalWeight: newTotalWeight
      }
    }
    
    case 'SET_CART_TYPE': {
      return {
        ...state,
        cartType: action.payload,
        items: [], // Clear cart when changing cart type
        totalWeight: 0
      }
    }
    
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    
    case 'CLEAR_CART':
      return { ...state, items: [], totalWeight: 0 }
    
    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  totalWeight: 0,
  cartType: null,
  isOpen: false
}

interface CartContextType {
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addItem: (vegetable: Vegetable, weight: string, weightInKg: number) => boolean
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => boolean
  setCartType: (type: 'small' | 'family' | null) => void
  openCart: () => void
  closeCart: () => void
  clearCart: () => void
  canAddItem: (weightInKg: number) => boolean
  wouldExceedLimit: (weightInKg: number) => boolean
  isCartAtLimit: () => boolean
  getRemainingWeight: () => string
  getCartLimit: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  
  const addItem = (vegetable: Vegetable, weight: string, weightInKg: number): boolean => {
    if (!state.cartType) return false
    
    const cartLimit = state.cartType === 'small' ? 4.5 : 7.0
    if (state.totalWeight + weightInKg > cartLimit) {
      return false
    }
    
    dispatch({ type: 'ADD_ITEM', payload: { vegetable, weight, weightInKg } })
    return true
  }
  
  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }
  
  const updateQuantity = (id: number, quantity: number): boolean => {
    const item = state.items.find(item => item.id === id)
    if (!item) return false
    
    const newTotalWeight = state.totalWeight - (item.weightInKg * item.quantity) + (item.weightInKg * quantity)
    const cartLimit = state.cartType === 'small' ? 4.5 : 7.0
    
    if (newTotalWeight > cartLimit) {
      return false
    }
    
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    return true
  }
  
  const setCartType = (type: 'small' | 'family' | null) => {
    dispatch({ type: 'SET_CART_TYPE', payload: type })
  }
  
  const openCart = () => {
    console.log('openCart called - current state:', { isOpen: state.isOpen, totalWeight: state.totalWeight, cartType: state.cartType })
    dispatch({ type: 'OPEN_CART' })
  }
  
  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }
  
  const canAddItem = (weightInKg: number): boolean => {
    if (!state.cartType) return false
    const cartLimit = state.cartType === 'small' ? 4.5 : 7.0
    return state.totalWeight + weightInKg <= cartLimit
  }
  
  const wouldExceedLimit = (weightInKg: number): boolean => {
    if (!state.cartType) return false
    const cartLimit = state.cartType === 'small' ? 4.5 : 7.0
    return state.totalWeight + weightInKg > cartLimit
  }
  
  const isCartAtLimit = (): boolean => {
    if (!state.cartType) return false
    const cartLimit = state.cartType === 'small' ? 4.5 : 7.0
    return state.totalWeight >= cartLimit
  }
  
  const getRemainingWeight = (): string => {
    if (!state.cartType) return '0.00'
    const cartLimit = state.cartType === 'small' ? 4.5 : 7.0
    const remaining = cartLimit - state.totalWeight
    return remaining.toFixed(2)
  }
  
  const getCartLimit = (): number => {
    if (!state.cartType) return 0
    return state.cartType === 'small' ? 4.5 : 7.0
  }
  
  const value: CartContextType = {
    state,
    dispatch,
    addItem,
    removeItem,
    updateQuantity,
    setCartType,
    openCart,
    closeCart,
    clearCart,
    canAddItem,
    wouldExceedLimit,
    isCartAtLimit,
    getRemainingWeight,
    getCartLimit
  }
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
