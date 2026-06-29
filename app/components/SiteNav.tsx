'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/app/context/CartContext'

type Category = { name: string; slug: string; image?: { sourceUrl: string; altText: string } }

const COLORS = ['#C8A84B','#C4A0A0','#4A8B8B','#C8A84B','#5A7A5A','#8B7355','#FFB3C6','#C9B8F5']
const VISIBLE = 5

export function SiteNav({ categories, alwaysVisible = false }: { categories: Category[]; alwaysVisible?: boolean }) {
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [page, setPage] = useState(0)
  const [fading, setFading] = useState(false)
  const { count: cartCount } = useCart()
  const ref = useRef<HTMLElement>(null)

  const totalPages = Math.ceil(categories.length / VISIBLE)
  const visible = categories.slice(page * VISIBLE, page * VISIBLE + VISIBLE)

  function goToPage(next: number) {
    setFading(true)
    setTimeout(() => { setPage(next); setFading(false) }, 180)
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function handleScroll() { setScrolled(window.scrollY > 10) }
    document.addEventListener('mousedown', handleClick)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handleClick)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const navVisible = alwaysVisible || scrolled
  const bg = open || mobileOpen ? '#FFE394' : '#ffffff'
  const border = navVisible && !open && !mobileOpen ? '2px solid #0a0a0a' : '2px solid transparent'

  const CartBadge = () => cartCount > 0 ? (
    <span style={{ backgroundColor: '#0a0a0a', color: '#5BB5C4', fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '11px', width: 20, height: 20, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
      {cartCount}
    </span>
  ) : null

  return (
    <>
      <header ref={ref} className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: bg, borderBottom: border, transition: 'border-color 0.2s, background-color 0.2s' }}>

        {/* ── Desktop ── */}
        <nav className="hidden md:flex justify-center items-center gap-10 py-5 relative">
          <Link href="/" className="absolute left-0 pl-[5vw] transition-all duration-300 select-none hover:opacity-70" style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'clamp(20px, 2vw, 32px)', opacity: navVisible ? 1 : 0, transform: navVisible ? 'translateY(0)' : 'translateY(-4px)', color: '#5BB5C4' }}>
            order2party
          </Link>

          <button onClick={() => setOpen(!open)} className="text-base uppercase tracking-widest flex items-center gap-1 hover:opacity-60 transition-opacity" style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700 }}>
            Categorias
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>

          <a href="#produtos" className="text-base uppercase tracking-widest hover:opacity-60 transition-opacity" style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700 }}>Novidades</a>

          <div className="absolute right-0 pr-[5vw] flex items-center gap-5 transition-all duration-300" style={{ opacity: navVisible ? 1 : 0, transform: navVisible ? 'translateY(0)' : 'translateY(-4px)', pointerEvents: navVisible ? 'auto' : 'none' }}>
            <button onClick={() => window.dispatchEvent(new Event('open-search'))} className="hover:opacity-60 transition-opacity" aria-label="Pesquisar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <button onClick={() => window.dispatchEvent(new Event('open-cart'))} className="text-base uppercase tracking-widest hover:opacity-60 transition-opacity flex items-center gap-2" style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700 }}>
              Carrinho <CartBadge />
            </button>
          </div>
        </nav>

        {/* Desktop dropdown */}
        <div className="hidden md:block absolute left-0 right-0 top-full z-50 transition-all duration-200" style={{ backgroundColor: '#FFE394', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}>
          <div className="flex items-center gap-3 px-6 py-4">
            <button onClick={() => goToPage(Math.max(0, page - 1))} disabled={page === 0} className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full" style={{ backgroundColor: '#5BB5C4', opacity: page === 0 ? 0 : 1, pointerEvents: page === 0 ? 'none' : 'auto' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="flex gap-3 flex-1" style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.18s ease' }}>
              {visible.map((cat, i) => (
                <a key={cat.slug} href={`/product-category/${cat.slug}`} className="flex flex-col flex-1 group" onClick={() => setOpen(false)}>
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1/1', backgroundColor: COLORS[(page * VISIBLE + i) % COLORS.length], borderRadius: '40px' }}>
                    {cat.image && <Image src={cat.image.sourceUrl} alt={cat.image.altText || cat.name} fill sizes="20vw" className="object-cover group-hover:scale-105 transition-transform duration-300"/>}
                  </div>
                  <span className="text-base text-center py-2 px-1" style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700 }}>{cat.name}</span>
                </a>
              ))}
            </div>
            <button onClick={() => goToPage(Math.min(totalPages - 1, page + 1))} disabled={page === totalPages - 1} className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full" style={{ backgroundColor: '#5BB5C4', opacity: page === totalPages - 1 ? 0 : 1, pointerEvents: page === totalPages - 1 ? 'none' : 'auto' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

        {/* ── Mobile bar ── */}
        <div className="flex md:hidden items-center justify-between px-5 py-4 overflow-hidden">
          <Link href="/" className="transition-all duration-300 select-none hover:opacity-70" style={{ fontFamily: 'var(--font-bricolage)', fontSize: '1.4rem', opacity: navVisible || mobileOpen ? 1 : 0, transform: navVisible || mobileOpen ? 'translateY(0)' : 'translateY(-4px)', color: '#5BB5C4' }}>
            order2party
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={() => window.dispatchEvent(new Event('open-cart'))} className="flex items-center gap-1.5" aria-label="Carrinho">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <CartBadge />
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen
                ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              }
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 overflow-y-auto" style={{ backgroundColor: '#FFE394', paddingTop: '64px' }}>
          <div className="px-5 pt-6 pb-10">
            <p className="uppercase mb-3" style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.12em', opacity: 0.45 }}>Categorias</p>
            {categories.map(cat => (
              <a key={cat.slug} href={`/product-category/${cat.slug}`} className="block py-3 hover:opacity-60 transition-opacity" style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '1.1rem', borderBottom: '1px solid rgba(0,0,0,0.08)' }} onClick={() => setMobileOpen(false)}>
                {cat.name}
              </a>
            ))}
            <a href="#produtos" className="block py-3 mt-2 hover:opacity-60 transition-opacity" style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '1.1rem', borderBottom: '1px solid rgba(0,0,0,0.08)' }} onClick={() => setMobileOpen(false)}>
              Novidades
            </a>
            <button onClick={() => { window.dispatchEvent(new Event('open-search')); setMobileOpen(false) }} className="flex items-center gap-3 py-3 w-full hover:opacity-60 transition-opacity" style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '1.1rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Pesquisar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
