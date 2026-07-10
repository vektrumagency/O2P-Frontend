'use client'

import { useState } from 'react'
import Link from 'next/link'

type SidebarItem = { name: string; slug: string; count: number }

interface Props {
  items: SidebarItem[]
  currentSlug: string
  parentName?: string
  parentSlug?: string
  label: string
}

export function CategorySidebar({ items, currentSlug, parentName, parentSlug, label }: Props) {
  const [open, setOpen] = useState(false)

  if (items.length === 0) return null

  return (
    <>
      {/* Botão trigger — mobile only */}
      <button
        className="md:hidden flex items-center justify-center gap-2 w-full"
        onClick={() => setOpen(true)}
        style={{
          fontFamily: 'var(--font-secondary)',
          fontWeight: 700,
          fontSize: 'var(--text-sm)',
          padding: '10px 18px',
          borderRadius: '999px',
          border: '1.5px solid rgba(0,0,0,0.15)',
          backgroundColor: 'transparent',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="9" y2="18" />
        </svg>
        {label}
      </button>

      {/* Overlay + Drawer — só no DOM quando aberto */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(3px)' }}
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed top-0 left-0 h-full z-50 flex flex-col"
            style={{
              width: 'min(300px, 85vw)',
              backgroundColor: '#fff',
              overflowY: 'auto',
              paddingTop: '64px',
              paddingBottom: '40px',
              paddingLeft: '28px',
              paddingRight: '28px',
              animation: 'category-drawer-enter 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <p style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'var(--text-xl)', lineHeight: 1 }}>
                {label}
              </p>
              <button onClick={() => setOpen(false)} className="hover:opacity-50 transition-opacity" aria-label="Fechar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {parentName && parentSlug && (
              <Link
                href={`/product-category/${parentSlug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-1 mb-4 hover:opacity-60 transition-opacity"
                style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: 'var(--text-sm)', opacity: 0.45 }}
              >
                ← {parentName}
              </Link>
            )}

            <nav className="flex flex-col">
              {items.map(item => (
                <Link
                  key={item.slug}
                  href={`/product-category/${item.slug}`}
                  onClick={() => setOpen(false)}
                  style={{
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 700,
                    fontSize: 'var(--text-md)',
                    padding: '12px 0',
                    borderBottom: '1px solid rgba(0,0,0,0.07)',
                    color: item.slug === currentSlug ? '#0a0a0a' : undefined,
                    opacity: item.slug === currentSlug ? 1 : undefined,
                  }}
                  className="hover:opacity-60 transition-opacity"
                >
                  {item.name}
                  {item.count > 0 && (
                    <span style={{ fontSize: 'var(--text-xs)', opacity: 0.35, marginLeft: 6 }}>({item.count})</span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  )
}
