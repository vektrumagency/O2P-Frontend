'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCart } from '@/app/context/CartContext'

export function CartSidebar() {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const { items, removeItem, updateQty, count, total } = useCart()

  useEffect(() => {
    const handleOpen = () => setOpen(true)
    window.addEventListener('open-cart', handleOpen)
    return () => window.removeEventListener('open-cart', handleOpen)
  }, [])

  function handleClose() {
    setClosing(true)
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 350)
  }

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{
          backgroundColor: 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(3px)',
          animation: closing ? 'fade-out 0.35s ease forwards' : 'fade-in 0.3s ease forwards',
        }}
        onClick={handleClose}
      />

      <div
        className="cart-shape fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: 'min(500px, 100vw)',
          backgroundColor: '#FFE394',
          animation: closing
            ? 'cart-exit 0.35s cubic-bezier(0.4, 0, 1, 1) forwards'
            : 'cart-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="cart-pad-h flex items-center justify-between flex-shrink-0"
          style={{ paddingTop: '64px', paddingBottom: '20px' }}
        >
          <h2 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'var(--text-2xl)', lineHeight: 1 }}>
            Carrinho {count > 0 && <span style={{ fontSize: 'var(--text-lg)', opacity: 0.45 }}>({count})</span>}
          </h2>
          <button onClick={handleClose} className="hover:opacity-50 transition-opacity" aria-label="Fechar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="cart-pad-items flex-1 overflow-y-auto">
          {items.length === 0 && (
            <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, opacity: 0.45, fontSize: 'var(--text-md)' }}>
              O teu carrinho está vazio.
            </p>
          )}

          {items.map((item) => (
            <div key={item.id} className="flex gap-4 items-center mb-6">
              {item.image && (
                <div style={{ width: 72, height: 72, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.55)', flexShrink: 0, overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} style={{ width: 72, height: 72, objectFit: 'contain' }} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="line-clamp-2" style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: 'var(--text-base)', lineHeight: 1.3 }}>
                  {item.name}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center" style={{ border: '1.5px solid rgba(0,0,0,0.25)', borderRadius: '999px' }}>
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="hover:opacity-50 transition-opacity" style={{ padding: '2px 10px', fontFamily: 'var(--font-secondary)', fontWeight: 700 }}>−</button>
                    <span style={{ padding: '2px 4px', fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: 'var(--text-sm)', minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="hover:opacity-50 transition-opacity" style={{ padding: '2px 10px', fontFamily: 'var(--font-secondary)', fontWeight: 700 }}>+</button>
                  </div>
                  <span style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: 'var(--text-sm)', opacity: 0.6 }} dangerouslySetInnerHTML={{ __html: item.price }} />
                  <button onClick={() => removeItem(item.id)} className="hover:opacity-50 transition-opacity ml-auto" style={{ opacity: 0.35 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-pad-footer flex-shrink-0" style={{ paddingTop: '20px', paddingBottom: '64px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <div className="flex justify-between items-center mb-5">
              <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: 'var(--text-md)' }}>Total</p>
              <p style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: 'var(--text-lg)' }}>{total}</p>
            </div>
            <Link
              href="/checkout"
              onClick={handleClose}
              className="block text-center"
              style={{ backgroundColor: '#0a0a0a', color: '#FFE394', fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: 'var(--text-md)', padding: '14px 24px', borderRadius: '999px' }}
            >
              Finalizar Compra
            </Link>
            <Link
              href="/cart"
              onClick={handleClose}
              className="block text-center mt-3 hover:opacity-50 transition-opacity"
              style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: 'var(--text-sm)', opacity: 0.45 }}
            >
              Ver carrinho completo
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
