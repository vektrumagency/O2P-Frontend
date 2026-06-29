'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type CartItem = {
  id: number
  name: string
  slug: string
  price: string
  quantity: number
  image?: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, qty: number) => void
  removeItem: (id: number) => void
  updateQty: (id: number, qty: number) => void
  count: number
  total: string
}

const CartContext = createContext<CartContextType | null>(null)

function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^0-9,.]/g, '').replace(',', '.')) || 0
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('o2p_cart')
      if (stored) setItems(JSON.parse(stored))
    } catch {}
  }, [])

  function persist(next: CartItem[]) {
    setItems(next)
    localStorage.setItem('o2p_cart', JSON.stringify(next))
  }

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, qty: number) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      const next = existing
        ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i)
        : [...prev, { ...item, quantity: qty }]
      localStorage.setItem('o2p_cart', JSON.stringify(next))
      return next
    })
  }, [])

  const removeItem = useCallback((id: number) => {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id)
      localStorage.setItem('o2p_cart', JSON.stringify(next))
      return next
    })
  }, [])

  const updateQty = useCallback((id: number, qty: number) => {
    setItems(prev => {
      const next = qty <= 0
        ? prev.filter(i => i.id !== id)
        : prev.map(i => i.id === id ? { ...i, quantity: qty } : i)
      localStorage.setItem('o2p_cart', JSON.stringify(next))
      return next
    })
  }, [])

  const count = items.reduce((s, i) => s + i.quantity, 0)

  const total = items
    .reduce((s, i) => s + parsePrice(i.price) * i.quantity, 0)
    .toFixed(2)
    .replace('.', ',') + '€'

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, count, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
