import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fetchGraphQL } from '@/lib/graphql'
import { SiteNav } from '@/app/components/SiteNav'
import { Footer } from '@/app/components/Footer'
import { BackButton } from '@/app/components/BackButton'

type NavCategory = { name: string; slug: string; image?: { sourceUrl: string; altText: string } }
type SubCategory = { name: string; slug: string; image?: { sourceUrl: string; altText: string } }
type Product = {
  name: string
  slug: string
  price?: string
  regularPrice?: string
  onSale?: boolean
  image?: { sourceUrl: string; altText: string }
}

const NAV_QUERY = `
  query NavCategories {
    productCategories(first: 50, where: { hideEmpty: true, parent: 0 }) {
      nodes { name slug image { sourceUrl altText } }
    }
  }
`

const CATEGORY_QUERY = `
  query GetCategory($slug: ID!, $category: String!, $first: Int!, $after: String) {
    productCategory(id: $slug, idType: SLUG) {
      name
      description
      children(first: 20) {
        nodes { name slug image { sourceUrl altText } }
      }
    }
    products(first: $first, after: $after, where: { category: $category, status: "publish" }) {
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
      nodes {
        name slug
        image { sourceUrl altText }
        ... on SimpleProduct { price regularPrice onSale }
        ... on VariableProduct { price regularPrice onSale }
      }
    }
  }
`

const PER_PAGE = 24

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ after?: string; before?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const data = await fetchGraphQL<{ productCategory: { name: string; description?: string } | null }>(
      CATEGORY_QUERY, { slug, category: slug, first: 1, after: null }
    )
    const cat = data.productCategory
    if (!cat) return { title: 'Categoria' }
    return {
      title: cat.name,
      description: cat.description?.replace(/<[^>]*>/g, '').trim() || `Artigos de ${cat.name} na Order2Party.`,
    }
  } catch {
    return { title: 'Categoria' }
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { after } = await searchParams

  const [navData, catData] = await Promise.all([
    fetchGraphQL<{ productCategories: { nodes: NavCategory[] } }>(NAV_QUERY),
    fetchGraphQL<{
      productCategory: {
        name: string
        description?: string
        children: { nodes: SubCategory[] }
      } | null
      products: {
        pageInfo: { hasNextPage: boolean; endCursor: string; hasPreviousPage: boolean; startCursor: string }
        nodes: Product[]
      }
    }>(CATEGORY_QUERY, { slug, category: slug, first: PER_PAGE, after: after ?? null }),
  ])

  if (!catData.productCategory) notFound()

  const EXCLUDE = ['Sem Categoria', 'Cores Lisas', 'Novidades', 'Produtos']
  const categories = navData.productCategories.nodes.filter(c => !EXCLUDE.includes(c.name))
  const products = catData.products.nodes
  const pageInfo = catData.products.pageInfo
  const catName = catData.productCategory.name
  const subCategories = catData.productCategory.children.nodes

  return (
    <>
      <SiteNav categories={categories} alwaysVisible />

      <main style={{ paddingTop: '80px', minHeight: '70vh' }}>
        <div style={{ width: '90vw', margin: '0 auto', paddingTop: '40px', paddingBottom: '80px' }}>
          <BackButton />

          <h1 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: '40px', lineHeight: 1 }}>
            {catName}
          </h1>

          {/* Mobile: subcategorias em pills acima dos produtos */}
          {subCategories.length > 0 && (
            <div className="md:hidden flex flex-wrap gap-2 mb-8">
              {subCategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/product-category/${sub.slug}`}
                  style={{ backgroundColor: '#f2f2f0', borderRadius: '999px', padding: '6px 14px', fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.8rem' }}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop: sidemenu + grelha lado a lado */}
          <div className="flex gap-12 items-start">

            {/* Sidemenu — visível apenas em desktop */}
            {subCategories.length > 0 && (
              <aside className="hidden md:block flex-shrink-0" style={{ width: 180 }}>
                <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '12px' }}>
                  Subcategorias
                </p>
                <nav className="flex flex-col gap-1">
                  {subCategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/product-category/${sub.slug}`}
                      className="flex items-center gap-2 hover:opacity-60 transition-opacity"
                      style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.88rem', padding: '5px 0' }}
                    >
                      {sub.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={sub.image.sourceUrl} alt={sub.name} style={{ width: 26, height: 26, objectFit: 'contain', borderRadius: 6, backgroundColor: '#f2f2f0', flexShrink: 0 }} />
                      )}
                      {sub.name}
                    </Link>
                  ))}
                </nav>
              </aside>
            )}

            {/* Grelha de produtos */}
            <div className="flex-1 min-w-0">
              {products.length === 0 ? (
                <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, opacity: 0.4 }}>
                  Sem produtos nesta categoria.
                </p>
              ) : (
                <>
                  <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.06em', opacity: 0.4, marginBottom: '32px', textTransform: 'uppercase' }}>
                    {products.length} produto{products.length !== 1 ? 's' : ''}
                  </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                {products.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/product/${product.slug}`}
                    className="group flex flex-col"
                  >
                    <div
                      className="relative overflow-hidden mb-3"
                      style={{ aspectRatio: '1 / 1', borderRadius: '20px', backgroundColor: '#f2f2f0' }}
                    >
                      {product.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image.sourceUrl}
                          alt={product.image.altText || product.name}
                          style={{
                            width: '100%', height: '100%',
                            objectFit: 'contain',
                            padding: '12px',
                            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                          }}
                          className="group-hover:scale-105"
                        />
                      )}
                      {product.onSale && (
                        <span
                          className="absolute top-3 left-3"
                          style={{ backgroundColor: '#FFE394', fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.7rem', padding: '3px 10px', borderRadius: '999px' }}
                        >
                          Sale
                        </span>
                      )}
                    </div>

                    <p className="line-clamp-2 mb-1" style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.3 }}>
                      {product.name}
                    </p>

                    <div className="flex items-center gap-2 mt-auto pt-1">
                      {product.onSale && product.regularPrice && (
                        <span
                          style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.8rem', opacity: 0.35, textDecoration: 'line-through' }}
                          dangerouslySetInnerHTML={{ __html: product.regularPrice }}
                        />
                      )}
                      {product.price && (
                        <span
                          style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.9rem' }}
                          dangerouslySetInnerHTML={{ __html: product.price }}
                        />
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Paginação */}
              {(pageInfo.hasNextPage || after) && (
                <div className="flex justify-center items-center gap-4 mt-16">
                  {after && (
                    <Link
                      href={`/product-category/${slug}`}
                      style={{
                        fontFamily: 'var(--font-secondary)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        padding: '12px 28px',
                        borderRadius: '999px',
                        border: '1.5px solid rgba(0,0,0,0.15)',
                      }}
                      className="hover:opacity-60 transition-opacity"
                    >
                      ← Anterior
                    </Link>
                  )}
                  {pageInfo.hasNextPage && (
                    <Link
                      href={`/product-category/${slug}?after=${encodeURIComponent(pageInfo.endCursor)}`}
                      style={{
                        fontFamily: 'var(--font-secondary)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        padding: '12px 28px',
                        borderRadius: '999px',
                        backgroundColor: '#0a0a0a',
                        color: '#fff',
                      }}
                      className="hover:opacity-70 transition-opacity"
                    >
                      Seguinte →
                    </Link>
                  )}
                </div>
              )}
                </>
              )}
            </div>
            {/* fim sidemenu + grelha */}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
