'use client'

import { useState } from 'react'

type FAQItem = { q: string; a: string }
type FAQGroup = { category: string; items: FAQItem[] }

function Question({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between gap-4 w-full text-left hover:opacity-70 transition-opacity"
        style={{ padding: '18px 4px', fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.95rem' }}
      >
        {item.q}
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <p style={{ paddingBottom: '18px', paddingRight: '28px', fontFamily: 'var(--font-fraktion-sans)', fontSize: '0.88rem', lineHeight: 1.6, opacity: 0.65 }}>
          {item.a}
        </p>
      )}
    </div>
  )
}

export function FAQAccordion({ groups }: { groups: FAQGroup[] }) {
  return (
    <div className="flex flex-col gap-10">
      {groups.map(group => (
        <div key={group.category}>
          <h2 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '1.4rem', marginBottom: '8px' }}>
            {group.category}
          </h2>
          <div>
            {group.items.map(item => <Question key={item.q} item={item} />)}
          </div>
        </div>
      ))}
    </div>
  )
}
