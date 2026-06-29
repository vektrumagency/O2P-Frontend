import Link from 'next/link'
import Image from 'next/image'

const events = [
  {
    name: 'Aniversários',
    href: '/product-category/aniversario-por-idades',
    bg: '#FFB3C6',
    image: 'https://order2party.pt/wp-content/uploads/2023/09/SB14P-318-000-6-7-1.png',
  },
  {
    name: 'Baby Shower',
    href: '/product-category/baby-shower',
    bg: '#C9B8F5',
    image: 'https://order2party.pt/wp-content/uploads/2023/09/SB14P-318-000-6-32-1.png',
  },
  {
    name: 'Ano Novo',
    href: '/product-category/ano-novo',
    bg: '#FFE08A',
    image: 'https://order2party.pt/wp-content/uploads/2023/09/SB14P-318-000-6-31-1.png',
  },
  {
    name: 'Festas Temáticas',
    href: '/product-category/festas-tematicas',
    bg: '#B5EAD7',
    image: null,
  },
  {
    name: 'Carnaval',
    href: '/product-category/fatos-mascaras-e-aderecos',
    bg: '#FFCBA4',
    image: null,
  },
]

export function EventSection() {
  return (
    <section className="flex justify-center py-16">
      <div style={{ width: '90vw' }}>
        <h2
          className="mb-10"
          style={{
            fontFamily: 'var(--font-bricolage)',
            fontSize: 'clamp(28px, 4vw, 56px)',
            lineHeight: 1,
          }}
        >
          Por Ocasião
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {events.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="group relative flex flex-col rounded-2xl overflow-hidden transition-transform duration-500 hover:scale-[1.03]"
              style={{ aspectRatio: '3 / 4' }}
            >
              {/* Imagem de fundo */}
              {e.image ? (
                <Image
                  src={e.image}
                  alt={e.name}
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0" style={{ backgroundColor: e.bg }} />
              )}

              {/* Label colorida flutuante */}
              <div
                className="absolute z-10"
                style={{
                  bottom: '12px',
                  left: '12px',
                  right: '12px',
                  backgroundColor: e.bg,
                  borderRadius: '16px',
                  padding: 'clamp(12px, 1.5vw, 20px)',
                }}
              >
                <p
                  className="uppercase"
                  style={{
                    fontFamily: 'var(--font-fraktion-sans)',
                    fontWeight: 700,
                    fontSize: 'clamp(9px, 0.8vw, 12px)',
                    opacity: 0.6,
                    letterSpacing: '0.05em',
                  }}
                >
                  Ver coleção
                </p>
                <p
                  className="uppercase leading-tight mt-1"
                  style={{
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 700,
                    fontSize: 'clamp(13px, 1.3vw, 20px)',
                  }}
                >
                  {e.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
