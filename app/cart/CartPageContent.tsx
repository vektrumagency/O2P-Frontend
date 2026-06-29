'use client'

import Link from 'next/link'
import { useCart } from '@/app/context/CartContext'

export function CartPageContent() {
  const { items, removeItem, updateQty, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: '40vh', gap: '20px' }}>
        <p style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
          O teu carrinho está vazio.
        </p>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.9rem',
            backgroundColor: '#0a0a0a', color: '#FFE394',
            padding: '12px 28px', borderRadius: '999px',
            display: 'inline-block',
          }}
        >
          Continuar a comprar
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

      {/* Lista de produtos */}
      <div className="flex-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-5 items-center py-6"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
          >
            {/* Imagem */}
            <Link href={`/product/${item.slug}`}>
              <div style={{ width: 88, height: 88, borderRadius: 16, backgroundColor: '#f2f2f0', flexShrink: 0, overflow: 'hidden' }}>
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }}
                  />
                )}
              </div>
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <Link href={`/product/${item.slug}`} className="hover:opacity-60 transition-opacity">
                <p
                  className="line-clamp-2 mb-3"
                  style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.35 }}
                >
                  {item.name}
                </p>
              </Link>

              <div className="flex items-center gap-4 flex-wrap">
                {/* Quantidade */}
                <div className="flex items-center" style={{ border: '1.5px solid rgba(0,0,0,0.2)', borderRadius: '999px' }}>
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="hover:opacity-50 transition-opacity"
                    style={{ padding: '4px 12px', fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '1rem' }}
                  >
                    −
                  </button>
                  <span style={{ padding: '4px 4px', fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.9rem', minWidth: 24, textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="hover:opacity-50 transition-opacity"
                    style={{ padding: '4px 12px', fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '1rem' }}
                  >
                    +
                  </button>
                </div>

                {/* Preço unitário */}
                <span
                  style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.9rem', opacity: 0.5 }}
                  dangerouslySetInnerHTML={{ __html: item.price }}
                />
              </div>
            </div>

            {/* Preço total da linha + remover */}
            <div className="flex flex-col items-end gap-3 flex-shrink-0">
              <button
                onClick={() => removeItem(item.id)}
                className="hover:opacity-40 transition-opacity"
                style={{ opacity: 0.25 }}
                aria-label="Remover"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo */}
      <div className="lg:w-80 flex-shrink-0">
        <div
          style={{ backgroundColor: '#FFE394', borderRadius: 24, padding: '32px 28px', position: 'sticky', top: 100 }}
        >
          <h2 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '1.6rem', marginBottom: 24 }}>
            Resumo
          </h2>

          <div className="flex justify-between items-center mb-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: 16 }}>
            <span style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.9rem', opacity: 0.6 }}>
              Subtotal
            </span>
            <span style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '1rem' }}>
              {total}
            </span>
          </div>

          <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.78rem', opacity: 0.45, marginBottom: 20 }}>
            Portes de envio calculados no checkout.
          </p>

          <Link
            href="/checkout"
            className="block text-center"
            style={{
              backgroundColor: '#0a0a0a', color: '#FFE394',
              fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '1rem',
              padding: '14px 24px', borderRadius: '999px',
            }}
          >
            Finalizar Compra
          </Link>

          <Link
            href="/"
            className="block text-center mt-4 hover:opacity-50 transition-opacity"
            style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.85rem', opacity: 0.45 }}
          >
            Continuar a comprar
          </Link>
        </div>
      </div>

    </div>
  )
}
