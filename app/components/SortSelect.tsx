'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const OPTIONS = [
  { value: 'popularity',  label: 'Ordenar por popularidade' },
  { value: 'rating',      label: 'Ordenar por média de classificação' },
  { value: 'date-desc',   label: 'Ordenar por mais recentes' },
  { value: 'price-asc',   label: 'Ordenar por preço: menor para maior' },
  { value: 'price-desc',  label: 'Ordenar por preço: maior para menor' },
  { value: 'stock',       label: 'Ordenar por stock' },
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
    <div className="flex items-center gap-2">
      <span
        className="uppercase"
        style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em', opacity: 0.4 }}
      >
        Ordenar
      </span>
      <select
        value={current}
        onChange={e => handleChange(e.target.value)}
        style={{
          fontFamily: 'var(--font-fraktion-sans)',
          fontWeight: 700,
          fontSize: '0.85rem',
          border: '1.5px solid rgba(0,0,0,0.15)',
          borderRadius: '999px',
          padding: '5px 12px',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          appearance: 'none',
          paddingRight: '28px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230a0a0a' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
        }}
      >
        {OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
