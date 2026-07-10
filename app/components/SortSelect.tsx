'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const OPTIONS = [
  { value: 'popularity',  label: 'Popularidade' },
  { value: 'rating',      label: 'Classificação' },
  { value: 'date-desc',   label: 'Mais recentes' },
  { value: 'price-asc',   label: 'Preço: ↑' },
  { value: 'price-desc',  label: 'Preço: ↓' },
  { value: 'stock',       label: 'Stock' },
]

export function SortSelect({ current }: { current: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center w-full md:w-auto">
      <select
        className="w-full md:w-auto"
        value={current}
        onChange={e => handleChange(e.target.value)}
        style={{
          fontFamily: 'var(--font-fraktion-sans)',
          fontWeight: 700,
          fontSize: 'var(--text-sm)',
          border: '1.5px solid rgba(0,0,0,0.15)',
          borderRadius: '999px',
          padding: '10px 36px 10px 14px',
          backgroundColor: 'transparent',
          maxWidth: '100%',
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230a0a0a' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
      >
        {OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
