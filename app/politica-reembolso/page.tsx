import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchGraphQL } from '@/lib/graphql'
import { fetchWPPage } from '@/lib/wpPage'
import { InfoPage } from '@/app/components/InfoPage'

type Category = { name: string; slug: string; image?: { sourceUrl: string; altText: string } }

const NAV_QUERY = `
  query NavCategories {
    productCategories(first: 50, where: { hideEmpty: true, parent: 0 }) {
      nodes { name slug image { sourceUrl altText } }
    }
  }
`

export const metadata: Metadata = {
  title: 'Política de Reembolso',
  description: 'Política de reembolso e devoluções da Order2Party.',
}

export default async function PoliticaReembolsoPage() {
  const [navData, page] = await Promise.all([
    fetchGraphQL<{ productCategories: { nodes: Category[] } }>(NAV_QUERY),
    fetchWPPage('politica-reembolso'),
  ])

  if (!page) notFound()

  const EXCLUDE = ['Sem Categoria', 'Cores Lisas', 'Novidades', 'Produtos']
  const categories = navData.productCategories.nodes.filter(c => !EXCLUDE.includes(c.name))

  return <InfoPage categories={categories} title={page.title} html={page.content} />
}
