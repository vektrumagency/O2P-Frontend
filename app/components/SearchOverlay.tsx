'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type Product = {
  name: string
  slug: string
  price?: string
  image?: { sourceUrl: string; altText: string }
}

export function SearchOverlay() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleOpen = () => setOpen(true)
    window.addEventListener('open-search', handleOpen)
    return () => window.removeEventListener('open-search', handleOpen)
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
      setResults([])
    }
  }, [open])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  function handleGoToSearch() {
    if (!query.trim()) return
    handleClose()
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      if (res.ok) setResults(await res.json())
    } catch {}
    finally { setLoading(false) }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val), 320)
  }

  function handleClose() {
    setClosing(true)
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 250)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        backgroundColor: '#5BB5C4',
        animation: closing ? 'search-exit 0.25s ease-in forwards' : 'search-enter 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      {/* Header com input */}
      <div className="flex justify-center flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <div
          className="flex items-center gap-5"
          style={{ width: '90vw', padding: '24px 0' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            ref={inputRef}
            value={query}
            onChange={handleChange}
            onKeyDown={e => e.key === 'Enter' && handleGoToSearch()}
            placeholder="Pesquisar produtos..."
            className="flex-1 bg-transparent outline-none"
            style={{
              fontFamily: 'var(--font-secondary)',
              fontWeight: 700,
              fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
              color: '#0a0a0a',
              caretColor: '#0a0a0a',
            }}
          />

          <button
            onClick={handleClose}
            className="flex-shrink-0 hover:opacity-50 transition-opacity"
            style={{ color: 'rgba(0,0,0,0.5)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="flex-1 overflow-y-auto flex justify-center">
        <div style={{ width: '90vw', paddingTop: '40px', paddingBottom: '40px' }}>

          {!query && (
            <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.95rem', color: 'rgba(0,0,0,0.4)' }}>
              Começa a escrever para pesquisar...
            </p>
          )}

          {loading && (
            <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.95rem', color: 'rgba(0,0,0,0.4)' }}>
              A pesquisar...
            </p>
          )}

          {!loading && query && results.length === 0 && (
            <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.95rem', color: 'rgba(0,0,0,0.4)' }}>
              Nenhum resultado para &ldquo;{query}&rdquo;
            </p>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {results.map((p, i) => (
                  <a
                    key={i}
                    href={`/product/${p.slug}`}
                    onClick={handleClose}
                    className="group flex flex-col"
                  >
                    <div
                      className="relative overflow-hidden mb-3"
                      style={{
                        aspectRatio: '1 / 1',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {p.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image.sourceUrl}
                          alt={p.image.altText || p.name}
                          style={{
                            width: '100%', height: '100%',
                            objectFit: 'contain',
                            padding: '12px',
                            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                          }}
                          className="group-hover:scale-105"
                        />
                      )}
                    </div>
                    <p
                      className="line-clamp-2 mb-1"
                      style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.9rem', color: '#0a0a0a', lineHeight: 1.3 }}
                    >
                      {p.name}
                    </p>
                    {p.price && (
                      <p style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.85rem', color: '#0a0a0a' }}
                        dangerouslySetInnerHTML={{ __html: p.price }}
                      />
                    )}
                  </a>
                ))}
              </div>

              <button
                onClick={handleGoToSearch}
                className="flex items-center gap-2 mt-10 hover:opacity-60 transition-opacity"
                style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.9rem', color: '#0a0a0a' }}
              >
                Ver todos os resultados para &ldquo;{query}&rdquo;
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
