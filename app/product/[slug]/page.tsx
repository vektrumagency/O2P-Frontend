import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchGraphQL } from '@/lib/graphql'
import { SiteNav } from '@/app/components/SiteNav'
import { Footer } from '@/app/components/Footer'
import { ProductView, type Product } from './ProductView'

type Category = { name: string; slug: string; image?: { sourceUrl: string; altText: string } }

const NAV_QUERY = `
  query NavCategories {
    productCategories(first: 50, where: { hideEmpty: true, parent: 0 }) {
      nodes { name slug image { sourceUrl altText } }
    }
  }
`

const PRODUCT_QUERY = `
  query GetProduct($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      databaseId
      name
      slug
      description
      shortDescription
      image { sourceUrl altText }
      galleryImages { nodes { sourceUrl altText } }
      productCategories { nodes { name slug } }
      related(first: 4) {
        nodes {
          name
          slug
          image { sourceUrl altText }
          ... on SimpleProduct { price }
          ... on VariableProduct { price }
        }
      }
      ... on SimpleProduct { price regularPrice onSale stockStatus }
      ... on VariableProduct {
        price
        regularPrice
        onSale
        stockStatus
        variations(first: 50) {
          nodes {
            databaseId
            price
            stockStatus
            attributes { nodes { name value } }
          }
        }
        attributes { nodes { name options variation } }
      }
    }
  }
`

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const data = await fetchGraphQL<{ product: { name: string; shortDescription: string; image?: { sourceUrl: string } } | null }>(
      PRODUCT_QUERY, { slug }
    )
    const p = data.product
    if (!p) return { title: 'Produto não encontrado' }
    const desc = p.shortDescription?.replace(/<[^>]*>/g, '').trim() || ''
    return {
      title: p.name,
      description: desc || undefined,
      openGraph: p.image ? { images: [{ url: p.image.sourceUrl }] } : undefined,
    }
  } catch {
    return { title: 'Produto' }
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params

  const [navData, productData] = await Promise.all([
    fetchGraphQL<{ productCategories: { nodes: Category[] } }>(NAV_QUERY),
    fetchGraphQL<{ product: Product | null }>(PRODUCT_QUERY, { slug }),
  ])

  if (!productData.product) notFound()

  const EXCLUDE = ['Sem Categoria', 'Cores Lisas', 'Novidades', 'Produtos']
  const categories = navData.productCategories.nodes.filter(c => !EXCLUDE.includes(c.name))

  return (
    <>
      <SiteNav categories={categories} alwaysVisible />
      <ProductView product={productData.product} />
      <Footer />
    </>
  )
}
