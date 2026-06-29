'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/context/CartContext'

type Attribute = { name: string; value: string }
type Variation = {
  databaseId: number
  price: string
  stockStatus: string
  attributes: { nodes: Attribute[] }
}
type RelatedProduct = {
  name: string
  slug: string
  price?: string
  image?: { sourceUrl: string; altText: string }
}
type Product = {
  databaseId: number
  name: string
  description: string
  shortDescription: string
  price: string
  regularPrice: string
  onSale: boolean
  stockStatus: string
  image: { sourceUrl: string; altText: string } | null
  galleryImages: { nodes: { sourceUrl: string; altText: string }[] }
  productCategories: { nodes: { name: string; slug: string }[] }
  related?: { nodes: RelatedProduct[] }
  variations?: { nodes: Variation[] }
  attributes?: { nodes: { name: string; options: string[]; variation: boolean }[] }
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').trim()
}

export function ProductView({ product }: { product: Product }) {
  const router = useRouter()
  const { addItem } = useCart()
  const allImages = [
    ...(product.image ? [product.image] : []),
    ...product.galleryImages.nodes,
  ]

  const [closing, setClosing] = useState(false)
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)
  const [added, setAdded] = useState(false)

  function handleClose() {
    setClosing(true)
    setTimeout(() => router.back(), 380)
  }

  const variationAttrs = product.attributes?.nodes.filter(a => a.variation) ?? []

  function findVariation(): Variation | null {
    if (!product.variations) return null
    return product.variations.nodes.find(v =>
      v.attributes.nodes.every(a => selected[a.name] === a.value)
    ) ?? null
  }

  const activeVariation = findVariation()
  const displayPrice = activeVariation?.price ?? product.price
  const inStock = activeVariation
    ? activeVariation.stockStatus === 'IN_STOCK'
    : product.stockStatus === 'IN_STOCK'
  const canAddToCart = !variationAttrs.length || variationAttrs.every(a => selected[a.name])
  const category = product.productCategories?.nodes[0]

  const prev = useCallback(() => setImgIndex(i => (i - 1 + allImages.length) % allImages.length), [allImages.length])
  const next = useCallback(() => setImgIndex(i => (i + 1) % allImages.length), [allImages.length])

  useEffect(() => {
    if (allImages.length <= 1) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [allImages.length, prev, next])

  function addToCart() {
    const id = activeVariation?.databaseId ?? product.databaseId
    if (!id) return
    setAdding(true)
    addItem({
      id,
      name: product.name,
      slug: product.slug ?? '',
      price: displayPrice ?? product.price,
      image: product.image?.sourceUrl,
    }, qty)
    setAdded(true)
    setAdding(false)
    window.dispatchEvent(new Event('open-cart'))
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div
      className="fixed inset-0 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden"
      style={{ animation: closing ? 'product-bg-exit 0.38s ease forwards' : 'product-bg-enter 0.35s ease forwards' }}
    >
      {/* Painel esquerdo */}
      <div
        className="flex flex-col md:flex-shrink-0 overflow-y-auto"
        style={{
          width: 'min(100%, 44vw)',
          backgroundColor: '#FFE394',
          padding: 'clamp(32px, 4vw, 56px)',
          animation: closing
            ? 'product-card-exit 0.32s cubic-bezier(0.4, 0, 1, 1) forwards'
            : 'product-card-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both',
        }}
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-6 flex-wrap" style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.75rem' }}>
          <Link href="/" className="hover:opacity-60 transition-opacity" style={{ opacity: 0.45 }}>Início</Link>
          {category && (
            <>
              <span style={{ opacity: 0.25 }}>/</span>
              <Link href={`/product-category/${category.slug}`} className="hover:opacity-60 transition-opacity" style={{ opacity: 0.45 }}>
                {category.name}
              </Link>
            </>
          )}
          <span style={{ opacity: 0.25 }}>/</span>
          <span className="line-clamp-1" style={{ opacity: 0.7 }}>{product.name}</span>
        </nav>

        {/* Topo: categoria + nome + botão */}
        <div className="flex-1 flex flex-col justify-center">
          {category && (
            <p
              className="mb-4 uppercase"
              style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.5 }}
            >
              {category.name}
            </p>
          )}

          <h1
            style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'clamp(2.2rem, 4.5vw, 4rem)', lineHeight: 1.0, marginBottom: 'clamp(24px, 3vw, 40px)' }}
          >
            {product.name}
          </h1>

          {/* Variações */}
          {variationAttrs.map(attr => (
            <div key={attr.name} className="mb-5">
              <p className="mb-2 uppercase" style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.08em', opacity: 0.5 }}>
                {attr.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {attr.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSelected(s => ({ ...s, [attr.name]: opt }))}
                    style={{
                      fontFamily: 'var(--font-secondary)',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      padding: '5px 14px',
                      borderRadius: '999px',
                      border: '2px solid #0a0a0a',
                      backgroundColor: selected[attr.name] === opt ? '#0a0a0a' : 'transparent',
                      color: selected[attr.name] === opt ? '#FFE394' : '#0a0a0a',
                      transition: 'all 0.15s',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantidade + botão */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center flex-shrink-0"
              style={{ border: '2px solid #0a0a0a', borderRadius: '999px' }}
            >
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="hover:opacity-50 transition-opacity"
                style={{ padding: '9px 14px', fontFamily: 'var(--font-secondary)', fontWeight: 700 }}
              >
                −
              </button>
              <span style={{ padding: '9px 6px', fontFamily: 'var(--font-secondary)', fontWeight: 700, minWidth: 24, textAlign: 'center' }}>
                {qty}
              </span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="hover:opacity-50 transition-opacity"
                style={{ padding: '9px 14px', fontFamily: 'var(--font-secondary)', fontWeight: 700 }}
              >
                +
              </button>
            </div>

            <button
              onClick={addToCart}
              disabled={adding || !canAddToCart || !inStock}
              className="flex items-center gap-2 group"
              style={{
                fontFamily: 'var(--font-secondary)',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '11px 24px',
                borderRadius: '999px',
                border: '2px solid #0a0a0a',
                backgroundColor: 'transparent',
                color: '#0a0a0a',
                opacity: (!canAddToCart || !inStock) ? 0.35 : 1,
                cursor: (!canAddToCart || !inStock) ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s ease, color 0.2s ease',
              }}
              onMouseEnter={e => {
                if (canAddToCart && inStock) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0a0a0a'
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#FFE394'
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#0a0a0a'
              }}
            >
              {adding ? 'A adicionar...' : added ? 'Adicionado ✓' : !inStock ? 'Esgotado' : 'Adicionar ao carrinho →'}
            </button>
          </div>
        </div>

        {/* Linhas de detalhes */}
        <div style={{ marginTop: '32px' }}>
          {[
            {
              label: 'Preço',
              value: <span dangerouslySetInnerHTML={{ __html: displayPrice ?? '' }} />,
            },
            ...(product.onSale && product.regularPrice ? [{
              label: 'Preço original',
              value: <span style={{ textDecoration: 'line-through', opacity: 0.45 }} dangerouslySetInnerHTML={{ __html: product.regularPrice }} />,
            }] : []),
            ...(category ? [{ label: 'Categoria', value: category.name }] : []),
            ...(product.shortDescription ? [{
              label: 'Descrição',
              value: stripHtml(product.shortDescription),
            }] : []),
          ].map((row, i) => (
            <div
              key={i}
              className="flex gap-6 py-3"
              style={{ borderTop: '1px solid rgba(0,0,0,0.12)' }}
            >
              <p
                className="uppercase flex-shrink-0"
                style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', opacity: 0.45, width: '100px' }}
              >
                {row.label}
              </p>
              <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.5 }}>
                {row.value}
              </p>
            </div>
          ))}
        </div>

        {/* Produtos relacionados */}
        {(product.related?.nodes?.length ?? 0) > 0 && (
          <div style={{ marginTop: '32px', borderTop: '1px solid rgba(0,0,0,0.12)', paddingTop: '24px' }}>
            <p className="uppercase mb-4" style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', opacity: 0.45 }}>
              Relacionados
            </p>
            <div className="flex flex-col gap-3">
              {product.related!.nodes.slice(0, 4).map((p) => (
                <Link
                  key={p.slug}
                  href={`/product/${p.slug}`}
                  className="flex items-center gap-3 group hover:opacity-70 transition-opacity"
                >
                  <div style={{ width: 52, height: 52, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.06)', flexShrink: 0, overflow: 'hidden' }}>
                    {p.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image.sourceUrl}
                        alt={p.image.altText || p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="line-clamp-1" style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.3 }}>
                      {p.name}
                    </p>
                    {p.price && (
                      <span
                        style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.78rem', opacity: 0.6 }}
                        dangerouslySetInnerHTML={{ __html: p.price }}
                      />
                    )}
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.3 }}>
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Painel direito — galeria */}
      <div className="flex-1 flex flex-col" style={{ backgroundColor: '#f2f2f0', minHeight: '50vw' }}>
        {/* Imagem principal */}
        <div className="relative flex-1">
          {/* Botão fechar */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 flex items-center gap-2 hover:opacity-50 transition-opacity z-10"
            style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.85rem' }}
          >
            Fechar
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Seta esquerda */}
          {allImages.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center hover:opacity-50 transition-opacity"
              style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.8)' }}
              aria-label="Imagem anterior"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
          )}

          {/* Seta direita */}
          {allImages.length > 1 && (
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center hover:opacity-50 transition-opacity"
              style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.8)' }}
              aria-label="Próxima imagem"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          )}

          {allImages[imgIndex] && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ padding: '6%' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={imgIndex}
                src={allImages[imgIndex].sourceUrl}
                alt={allImages[imgIndex].altText || product.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  animation: 'product-bg-enter 0.2s ease',
                }}
              />
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2 p-4 overflow-x-auto" style={{ flexShrink: 0 }}>
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                style={{
                  width: 64, height: 64, flexShrink: 0,
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: i === imgIndex ? '2px solid #0a0a0a' : '2px solid transparent',
                  opacity: i === imgIndex ? 1 : 0.5,
                  transition: 'opacity 0.15s, border-color 0.15s',
                  backgroundColor: '#e8e8e6',
                  padding: 4,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.sourceUrl}
                  alt={img.altText || product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
