export function BannerCTA() {
  return (
    <section
      className="flex items-center justify-center gap-0 overflow-hidden"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div
        className="flex items-center justify-center gap-8 py-8 w-full"
        style={{ width: '90vw' }}
      >
        <p
          className="uppercase text-center"
          style={{
            fontFamily: 'var(--font-secondary)',
            fontWeight: 700,
            fontSize: 'clamp(16px, 2vw, 32px)',
            color: '#0a0a0a',
            lineHeight: 1,
          }}
        >
          Portes Grátis acima de 39,99€
        </p>

        <span
          style={{
            display: 'block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#FFE394',
            flexShrink: 0,
          }}
        />

        <p
          className="uppercase text-center"
          style={{
            fontFamily: 'var(--font-secondary)',
            fontWeight: 700,
            fontSize: 'clamp(16px, 2vw, 32px)',
            color: '#0a0a0a',
            lineHeight: 1,
          }}
        >
          Entregas em 24h até às 15h
        </p>
      </div>
    </section>
  )
}
