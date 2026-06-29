'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

export function SearchInput({ initialQ }: { initialQ: string }) {
  const router = useRouter()
  const [value, setValue] = useState(initialQ)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
      <svg
        width="28" height="28" viewBox="0 0 24 24" fill="none"
        stroke="rgba(0,0,0,0.25)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Pesquisar produtos..."
        className="flex-1 bg-transparent outline-none"
        style={{
          fontFamily: 'var(--font-secondary)',
          fontWeight: 700,
          fontSize: 'clamp(1.4rem, 3vw, 2.4rem)',
          color: '#0a0a0a',
          caretColor: '#5BB5C4',
        }}
      />

      {value && (
        <button
          type="button"
          onClick={() => { setValue(''); inputRef.current?.focus() }}
          className="flex-shrink-0 hover:opacity-50 transition-opacity"
          aria-label="Limpar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </form>
  )
}
