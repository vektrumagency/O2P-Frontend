import type { Metadata } from 'next'
import { fetchGraphQL } from '@/lib/graphql'
import { SiteNav } from '@/app/components/SiteNav'
import { Footer } from '@/app/components/Footer'
import { BackButton } from '@/app/components/BackButton'

type Category = { name: string; slug: string; image?: { sourceUrl: string; altText: string } }

const NAV_QUERY = `
  query NavCategories {
    productCategories(first: 50, where: { hideEmpty: true, parent: 0 }) {
      nodes { name slug image { sourceUrl altText } }
    }
  }
`

export const metadata: Metadata = {
  title: 'Sobre Nós',
  description: 'A Order2Party nasceu com a missão de facilitar todo o processo de organizar um evento, qualquer que seja a sua dimensão.',
}

const PARAGRAPHS = [
  'Nascemos em Junho de 2020, em plena pandemia e num contexto completamente adverso. Ainda assim decidimos avançar, sem medo e ainda com mais motivação, tudo por realmente acreditarmos no nosso projeto.',
  'Deixamos ao dispor dos nossos clientes tudo o que seja necessário para realizar desde um simples jantar de amigos até à festa dos seus sonhos.',
  'Assim podem encontrar na nossa loja todos os artigos necessários para a realização de uma festa ou evento, assim como uma série de serviços que certamente irão acrescentar valor ao mesmo. Aqui podem adquirir tudo de uma forma simples, rápida e numa só plataforma.',
  'Os nossos serviços são prestados pelos melhores profissionais disponíveis em cada área e a quem temos o orgulho de chamar parceiros. Sem cada um dos nossos parceiros o projeto ficaria sempre incompleto e por isso mesmo aproveitamos para lhes deixar um especial agradecimento.',
  'Aos nossos clientes pedimos apenas que desfrutem ao máximo das vossas festas, nós cuidamos do resto.',
]

export default async function SobreNosPage() {
  const navData = await fetchGraphQL<{ productCategories: { nodes: Category[] } }>(NAV_QUERY)
  const EXCLUDE = ['Sem Categoria', 'Cores Lisas', 'Novidades', 'Produtos']
  const categories = navData.productCategories.nodes.filter(c => !EXCLUDE.includes(c.name))

  return (
    <>
      <SiteNav categories={categories} alwaysVisible />

      <main style={{ paddingTop: '114px', minHeight: '70vh' }}>
        <div style={{ width: '90vw', maxWidth: 760, margin: '0 auto', paddingTop: '40px', paddingBottom: '80px' }}>
          <BackButton />

          <h1 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'var(--text-3xl)', marginBottom: '32px', lineHeight: 1 }}>
            Sobre Nós
          </h1>

          <p style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'clamp(1.3rem, 2.6vw, 1.9rem)', lineHeight: 1.3, marginBottom: '40px' }}>
            A <span style={{ color: '#0EA5A4' }}>Order2Party</span> nasceu com a missão de facilitar todo o processo de organizar um evento, qualquer que seja a sua dimensão.
          </p>

          <div className="info-prose">
            {PARAGRAPHS.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
