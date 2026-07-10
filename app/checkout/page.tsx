import type { Metadata } from 'next'
import { fetchGraphQL } from '@/lib/graphql'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Finaliza a tua compra na Order2Party.',
  robots: { index: false },
}
import { SiteNav } from '@/app/components/SiteNav'
import { Footer } from '@/app/components/Footer'
import { BackButton } from '@/app/components/BackButton'
import { CheckoutContent } from './CheckoutContent'

type Category = { name: string; slug: string; image?: { sourceUrl: string; altText: string } }

const NAV_QUERY = `
  query NavCategories {
    productCategories(first: 50, where: { hideEmpty: true, parent: 0 }) {
      nodes { name slug image { sourceUrl altText } }
    }
  }
`

export default async function CheckoutPage() {
  const data = await fetchGraphQL<{ productCategories: { nodes: Category[] } }>(NAV_QUERY)
  const EXCLUDE = ['Sem Categoria', 'Cores Lisas', 'Novidades', 'Produtos']
  const categories = data.productCategories.nodes.filter(c => !EXCLUDE.includes(c.name))

  return (
    <>
      <SiteNav categories={categories} alwaysVisible />

      <main style={{ paddingTop: '114px', minHeight: '70vh' }}>
        <div style={{ width: '90vw', margin: '0 auto', paddingTop: '40px', paddingBottom: '80px' }}>
          <BackButton />

          <h1 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'var(--text-3xl)', marginBottom: '40px', lineHeight: 1 }}>
            Checkout
          </h1>

          <CheckoutContent />
        </div>
      </main>

      <Footer />
    </>
  )
}
