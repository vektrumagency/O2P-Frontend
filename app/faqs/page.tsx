import type { Metadata } from 'next'
import { fetchGraphQL } from '@/lib/graphql'
import { SiteNav } from '@/app/components/SiteNav'
import { Footer } from '@/app/components/Footer'
import { BackButton } from '@/app/components/BackButton'
import { FAQAccordion } from '@/app/components/FAQAccordion'

type Category = { name: string; slug: string; image?: { sourceUrl: string; altText: string } }

const NAV_QUERY = `
  query NavCategories {
    productCategories(first: 50, where: { hideEmpty: true, parent: 0 }) {
      nodes { name slug image { sourceUrl altText } }
    }
  }
`

export const metadata: Metadata = {
  title: 'Perguntas Frequentes',
  description: 'Perguntas frequentes sobre encomendas, entregas e devoluções na Order2Party.',
}

const FAQ_GROUPS = [
  {
    category: 'Entregas e Devoluções',
    items: [
      {
        q: 'Qual o prazo de envio e de entrega da minha encomenda?',
        a: 'Se a encomenda for submetida e paga até às 15h00, o envio será feito no próprio dia, e entregue no dia seguinte útil, ou num máximo de 2 dias úteis.',
      },
      {
        q: 'Qual o valor dos portes de envio?',
        a: 'O valor dos portes de envio é de 3,99€ para encomendas com valor inferior a 39,99€. Se a encomenda for superior a este valor os portes são gratuitos.',
      },
      {
        q: 'Posso levantar a minha encomenda?',
        a: 'As encomendas não podem ser levantadas. Trabalhamos apenas com envios por transportador.',
      },
      {
        q: 'Posso devolver uma encomenda?',
        a: 'O cliente pode devolver ou trocar uma encomenda. A devolução terá que ser feita até 14 dias após a entrega, e os artigos deverão estar em perfeitas condições, e devidamente acondicionados. Os custos de transporte da devolução são da responsabilidade do cliente. Em caso do artigo estar defeituoso pedimos que entre em contacto diretamente connosco, por e-mail (geral@order2party.pt), ou para o 933 544 261.',
      },
    ],
  },
  {
    category: 'Produto',
    items: [
      {
        q: 'Como consigo saber se um artigo está ou não disponível?',
        a: 'Os artigos têm a disponibilidade de stock real nos detalhes do artigo.',
      },
    ],
  },
]

export default async function FAQsPage() {
  const navData = await fetchGraphQL<{ productCategories: { nodes: Category[] } }>(NAV_QUERY)
  const EXCLUDE = ['Sem Categoria', 'Cores Lisas', 'Novidades', 'Produtos']
  const categories = navData.productCategories.nodes.filter(c => !EXCLUDE.includes(c.name))

  return (
    <>
      <SiteNav categories={categories} alwaysVisible />

      <main style={{ paddingTop: '114px', minHeight: '70vh' }}>
        <div style={{ width: '90vw', maxWidth: 760, margin: '0 auto', paddingTop: '40px', paddingBottom: '80px' }}>
          <BackButton />

          <h1 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'var(--text-3xl)', marginBottom: '40px', lineHeight: 1 }}>
            Perguntas Frequentes
          </h1>

          <FAQAccordion groups={FAQ_GROUPS} />
        </div>
      </main>

      <Footer />
    </>
  )
}
