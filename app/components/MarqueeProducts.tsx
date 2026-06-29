'use client'

import { useState } from 'react'

type Product = {
  name: string
  slug: string
  price?: string
  image?: { sourceUrl: string; altText: string }
}

function ProductItem({ p }: { p: Product }) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={`/product/${p.slug}`}
      className="flex-shrink-0 flex flex-col items-center"
      style={{ width: '200px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative" style={{ width: '200px', height: '200px' }}>
        {p.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image.sourceUrl}
            alt={p.image.altText || p.name}
            width={200}
            height={200}
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'contain',
              transform: hovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        )}
        {p.price && (
          <span
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              transform: 'translate(40%, -40%)',
              backgroundColor: '#FFE394',
              fontFamily: 'var(--font-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              width: '56px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              lineHeight: 1.2,
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
            dangerouslySetInnerHTML={{ __html: p.price }}
          />
        )}
      </div>
      <p
        className="text-lg text-center mt-3 line-clamp-2"
        style={{
          fontFamily: 'var(--font-fraktion-sans)',
          fontWeight: 700,
        }}
      >
        {p.name}
      </p>
    </a>
  )
}

export function MarqueeProducts({ products }: { products: Product[] }) {
  const doubled = [...products, ...products]

  return (
    <div style={{ overflow: 'hidden', paddingTop: '32px' }}>
      <div
        className="marquee-track flex"
        style={{
          animation: 'marquee 90s linear infinite',
          width: 'max-content',
          gap: '96px',
        }}
      >
        {doubled.map((p, i) => (
          <ProductItem key={i} p={p} />
        ))}
      </div>
    </div>
  )
}
