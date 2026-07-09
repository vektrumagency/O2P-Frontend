'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type CartItem = {
  id: number
  name: string
  slug: string
  price: string
  quantity: number
  image?: string
  key?: string
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

type WCCartItem = { id: number; key: string }
type WCCartResponse = { items?: WCCartItem[] }

async function syncAdd(id: number, quantity: number): Promise<string | null> {
  try {
    const res = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, quantity }),
    })
    if (!res.ok) return null
    const data: WCCartResponse = await res.json()
    return data.items?.find(i => i.id === id)?.key ?? null
  } catch {
    return null
  }
}

async function syncUpdate(key: string, quantity: number) {
  try {
    await fetch('/api/cart/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, quantity }),
    })
  } catch {}
}

async function syncRemove(key: string) {
  try {
    await fetch('/api/cart/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    })
  } catch {}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('o2p_cart')
      if (stored) setItems(JSON.parse(stored))
    } catch {}
  }, [])

  function patchKey(id: number, key: string | null) {
    if (!key) return
    setItems(prev => {
      const next = prev.map(i => i.id === id ? { ...i, key } : i)
      localStorage.setItem('o2p_cart', JSON.stringify(next))
      return next
    })
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
    syncAdd(item.id, qty).then(key => patchKey(item.id, key))
  }, [])

  const removeItem = useCallback((id: number) => {
    setItems(prev => {
      const target = prev.find(i => i.id === id)
      const next = prev.filter(i => i.id !== id)
      localStorage.setItem('o2p_cart', JSON.stringify(next))
      if (target?.key) syncRemove(target.key)
      return next
    })
  }, [])

  const updateQty = useCallback((id: number, qty: number) => {
    setItems(prev => {
      const target = prev.find(i => i.id === id)
      const next = qty <= 0
        ? prev.filter(i => i.id !== id)
        : prev.map(i => i.id === id ? { ...i, quantity: qty } : i)
      localStorage.setItem('o2p_cart', JSON.stringify(next))
      if (target?.key) {
        if (qty <= 0) syncRemove(target.key)
        else syncUpdate(target.key, qty)
      }
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
