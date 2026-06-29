'use client'

import Link from 'next/link'
import { useState } from 'react'
// Cart sync via WC Store API requires CORS headers on WordPress.
import { useCart } from '@/app/context/CartContext'

const WC_BASE = 'https://order2party.pt'

export function CheckoutContent() {
  const { items, total } = useCart()
  const [loading, setLoading] = useState(false)

  function handleCheckout() {
    if (items.length === 0) return
    setLoading(true)
    window.location.href = `${WC_BASE}/checkout`
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: '40vh', gap: 20 }}>
        <p style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}>
          O teu carrinho está vazio.
        </p>
        <Link href="/" style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.9rem', backgroundColor: '#0a0a0a', color: '#FFE394', padding: '12px 28px', borderRadius: '999px' }}>
          Continuar a comprar
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

      {/* Resumo do pedido */}
      <div className="flex-1">
        <h2 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', marginBottom: 24, lineHeight: 1 }}>
          Resumo do pedido
        </h2>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-4 py-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              {item.image && (
                <div style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: '#f2f2f0', flexShrink: 0, overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="line-clamp-2" style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.3 }}>
                  {item.name}
                </p>
                <p style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.8rem', opacity: 0.45, marginTop: 4 }}>
                  Qtd: {item.quantity}
                </p>
              </div>
              <span
                style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}
                dangerouslySetInnerHTML={{ __html: item.price }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Painel lateral */}
      <div className="lg:w-80 flex-shrink-0">
        <div style={{ backgroundColor: '#FFE394', borderRadius: 24, padding: '32px 28px', position: 'sticky', top: 100 }}>
          <h2 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '1.5rem', marginBottom: 24 }}>
            Total
          </h2>

          <div className="flex justify-between items-center mb-2">
            <span style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.88rem', opacity: 0.6 }}>Subtotal</span>
            <span style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '1rem' }}>{total}</span>
          </div>

          <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.75rem', opacity: 0.4, marginTop: 8, marginBottom: 24 }}>
            Portes calculados no passo seguinte.
          </p>

          <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.75rem', opacity: 0.4, marginBottom: 16 }}>
            Serás redirecionado para order2party.pt para concluir o pagamento.
          </p>

          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              backgroundColor: '#0a0a0a', color: '#FFE394',
              fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '1rem',
              padding: '14px 24px', borderRadius: '999px',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              border: 'none',
            }}
          >
            {loading ? 'A preparar...' : 'Proceder para pagamento →'}
          </button>

          <Link
            href="/cart"
            className="block text-center mt-4 hover:opacity-50 transition-opacity"
            style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.85rem', opacity: 0.4 }}
          >
            ← Editar carrinho
          </Link>
        </div>
      </div>

    </div>
  )
}
