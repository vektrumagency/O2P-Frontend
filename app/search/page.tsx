import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchGraphQL } from '@/lib/graphql'
import { SiteNav } from '@/app/components/SiteNav'
import { Footer } from '@/app/components/Footer'
import { BackButton } from '@/app/components/BackButton'
import { SearchInput } from './SearchInput'

type Category = { name: string; slug: string; image?: { sourceUrl: string; altText: string } }
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

const SEARCH_QUERY = `
  query SearchProducts($search: String!) {
    products(first: 24, where: { search: $search, status: "publish" }) {
      nodes {
        name slug
        image { sourceUrl altText }
        ... on SimpleProduct { price regularPrice onSale }
        ... on VariableProduct { price regularPrice onSale }
      }
    }
  }
`

type PageProps = { searchParams: Promise<{ q?: string }> }

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q = '' } = await searchParams
  return q
    ? { title: `"${q}"`, description: `Resultados de pesquisa para "${q}" na Order2Party.` }
    : { title: 'Pesquisa', description: 'Pesquisa produtos na Order2Party.' }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = '' } = await searchParams

  const [navData, searchData] = await Promise.all([
    fetchGraphQL<{ productCategories: { nodes: Category[] } }>(NAV_QUERY),
    q.trim()
      ? fetchGraphQL<{ products: { nodes: Product[] } }>(SEARCH_QUERY, { search: q })
      : Promise.resolve(null),
  ])

  const EXCLUDE = ['Sem Categoria', 'Cores Lisas', 'Novidades', 'Produtos']
  const categories = navData.productCategories.nodes.filter(c => !EXCLUDE.includes(c.name))
  const results: Product[] = searchData?.products?.nodes ?? []

  return (
    <>
      <SiteNav categories={categories} alwaysVisible />

      <main style={{ paddingTop: '114px', minHeight: '70vh' }}>
        {/* Cabeçalho de pesquisa */}
        <section style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '32px' }}>
          <div style={{ width: '90vw', margin: '0 auto', paddingTop: '40px' }}>
            <BackButton />
            <SearchInput initialQ={q} />
          </div>
        </section>

        {/* Resultados */}
        <section>
          <div style={{ width: '90vw', margin: '0 auto', paddingTop: '40px', paddingBottom: '80px' }}>

            {!q && (
              <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '1rem', opacity: 0.35 }}>
                Começa a escrever para pesquisar produtos...
              </p>
            )}

            {q && results.length === 0 && (
              <div>
                <p style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>
                  Nenhum resultado para &ldquo;{q}&rdquo;
                </p>
                <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.9rem', opacity: 0.4 }}>
                  Tenta pesquisar por outro termo.
                </p>
              </div>
            )}

            {q && results.length > 0 && (
              <>
                <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.06em', opacity: 0.4, marginBottom: '32px', textTransform: 'uppercase' }}>
                  {results.length} resultado{results.length !== 1 ? 's' : ''} para &ldquo;{q}&rdquo;
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                  {results.map((product) => (
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

                      <p
                        className="line-clamp-2 mb-1"
                        style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.3 }}
                      >
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
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
