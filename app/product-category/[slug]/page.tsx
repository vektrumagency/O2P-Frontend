import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { fetchGraphQL } from '@/lib/graphql'
import { SiteNav } from '@/app/components/SiteNav'
import { Footer } from '@/app/components/Footer'
import { BackButton } from '@/app/components/BackButton'
import { SortSelect } from '@/app/components/SortSelect'
import { CategorySidebar } from '@/app/components/CategorySidebar'

const PRODUCTS_PER_PAGE = 24

const SORT_MAP: Record<string, { field: string; order: string }> = {
  'popularity': { field: 'POPULARITY', order: 'DESC' },
  'rating':     { field: 'RATING',     order: 'DESC' },
  'date-desc':  { field: 'DATE',       order: 'DESC' },
  'price-asc':  { field: 'PRICE',      order: 'ASC'  },
  'price-desc': { field: 'PRICE',      order: 'DESC' },
  'stock':      { field: 'MENU_ORDER', order: 'ASC'  },
}

const CATEGORY_QUERY = `
  query Category($id: ID!, $slug: String!, $field: ProductsOrderByEnum!, $order: OrderEnum!, $after: String) {
    productCategory(id: $id, idType: SLUG) {
      name
      count
      children(first: 50) {
        nodes { name slug count }
      }
      ancestors {
        nodes {
          name slug
          children(first: 50) {
            nodes { name slug count }
          }
        }
      }
    }
    allCategories: productCategories(first: 50, where: { hideEmpty: true, parent: 0 }) {
      nodes { name slug image { sourceUrl altText } }
    }
    products(first: ${PRODUCTS_PER_PAGE}, after: $after, where: { category: $slug, orderby: { field: $field, order: $order } }) {
      nodes {
        name slug
        image { sourceUrl altText }
        ... on SimpleProduct { price regularPrice onSale }
        ... on VariableProduct { price regularPrice onSale }
      }
    }
  }
`

type SidebarItem = { name: string; slug: string; count: number }
type NavCategory = { name: string; slug: string; image?: { sourceUrl: string; altText: string } }
type Product = {
  name: string; slug: string
  price?: string; regularPrice?: string; onSale?: boolean
  image?: { sourceUrl: string; altText: string }
}
type CategoryData = {
  productCategory: {
    name: string; count: number
    children: { nodes: SidebarItem[] }
    ancestors: { nodes: { name: string; slug: string; children: { nodes: SidebarItem[] } }[] }
  } | null
  allCategories: { nodes: NavCategory[] }
  products: { nodes: Product[] }
}

const NAV_EXCLUDE = ['Sem Categoria', 'Cores Lisas', 'Novidades', 'Produtos']

// Pagination helpers
function pageUrl(page: number, sort: string) {
  const p = new URLSearchParams()
  if (sort !== 'popularity') p.set('sort', sort)
  if (page > 1) p.set('page', String(page))
  const qs = p.toString()
  return qs ? `?${qs}` : '?'
}

function getPageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (current > 3) pages.push('…')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
}

function Pagination({ page, totalPages, sort }: { page: number; totalPages: number; sort: string }) {
  if (totalPages <= 1) return null
  const range = getPageRange(page, totalPages)
  const btnStyle = { fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.85rem', padding: '8px 16px', borderRadius: '999px', border: '1.5px solid rgba(0,0,0,0.12)' }

  return (
    <div className="mt-14 pt-8" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
      {/* Mobile: só anterior / página X de Y / seguinte */}
      <div className="flex items-center justify-between md:hidden gap-3">
        {page > 1 ? (
          <Link href={pageUrl(page - 1, sort)} style={btnStyle} className="hover:opacity-50 transition-opacity">← Anterior</Link>
        ) : (
          <span style={{ ...btnStyle, opacity: 0.2 }}>← Anterior</span>
        )}
        <span style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.82rem', opacity: 0.4 }}>
          {page} / {totalPages}
        </span>
        {page < totalPages ? (
          <Link href={pageUrl(page + 1, sort)} style={btnStyle} className="hover:opacity-50 transition-opacity">Seguinte →</Link>
        ) : (
          <span style={{ ...btnStyle, opacity: 0.2 }}>Seguinte →</span>
        )}
      </div>

      {/* Desktop: números de página */}
      <div className="hidden md:flex items-center justify-center gap-1">
        {page > 1 ? (
          <Link href={pageUrl(page - 1, sort)} style={btnStyle} className="hover:opacity-50 transition-opacity">←</Link>
        ) : (
          <span style={{ ...btnStyle, opacity: 0.2 }}>←</span>
        )}
        {range.map((r, i) =>
          r === '…' ? (
            <span key={`ellipsis-${i}`} style={{ padding: '8px 6px', opacity: 0.3, fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.85rem' }}>…</span>
          ) : (
            <Link key={r} href={pageUrl(r, sort)}
              style={{
                fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.85rem',
                padding: '8px 14px', borderRadius: '999px', minWidth: 38, textAlign: 'center',
                backgroundColor: r === page ? '#0a0a0a' : 'transparent',
                color: r === page ? '#fff' : 'inherit',
                border: r === page ? 'none' : '1.5px solid rgba(0,0,0,0.12)',
              }}
              className="hover:opacity-70 transition-opacity"
            >
              {r}
            </Link>
          )
        )}
        {page < totalPages ? (
          <Link href={pageUrl(page + 1, sort)} style={btnStyle} className="hover:opacity-50 transition-opacity">→</Link>
        ) : (
          <span style={{ ...btnStyle, opacity: 0.2 }}>→</span>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group flex flex-col">
      <div className="relative overflow-hidden mb-3" style={{ aspectRatio: '1/1', backgroundColor: '#f4f4f2', borderRadius: '16px' }}>
        {product.image && (
          <Image
            src={product.image.sourceUrl}
            alt={product.image.altText || product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {product.onSale && (
          <span className="absolute top-3 left-3"
            style={{ backgroundColor: '#FFE394', fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.7rem', padding: '3px 10px', borderRadius: '999px' }}>
            Sale
          </span>
        )}
      </div>
      <p className="line-clamp-2 mb-1" style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.3 }}>
        {product.name}
      </p>
      <div className="flex items-center gap-2 mt-auto pt-1 flex-wrap">
        {product.onSale && product.regularPrice && (
          <span style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.8rem', opacity: 0.35, textDecoration: 'line-through' }}
            dangerouslySetInnerHTML={{ __html: product.regularPrice }} />
        )}
        {product.price && (
          <span style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.9rem' }}
            dangerouslySetInnerHTML={{ __html: product.price }} />
        )}
      </div>
    </Link>
  )
}

type PageProps = { params: Promise<{ slug: string }>; searchParams: Promise<{ sort?: string; page?: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await fetchGraphQL<{ productCategory: { name: string; count: number } | null }>(
    `query Meta($id: ID!) { productCategory(id: $id, idType: SLUG) { name count } }`,
    { id: slug }
  ).catch(() => ({ productCategory: null }))
  const cat = data.productCategory
  if (!cat) return {}
  return {
    title: cat.name,
    description: `Explora ${cat.count ?? ''} produtos na categoria ${cat.name} na Order2Party.`.trim(),
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { sort = 'popularity', page: pageParam = '1' } = await searchParams
  const page = Math.max(1, parseInt(pageParam, 10))
  const { field, order } = SORT_MAP[sort] ?? SORT_MAP['popularity']

  const after = page > 1
    ? Buffer.from(`arrayconnection:${(page - 1) * PRODUCTS_PER_PAGE - 1}`).toString('base64')
    : undefined

  const data = await fetchGraphQL<CategoryData>(CATEGORY_QUERY, { id: slug, slug, field, order, after })

  if (!data.productCategory) notFound()

  const { productCategory, allCategories, products } = data
  const navCategories = allCategories.nodes.filter(c => !NAV_EXCLUDE.includes(c.name))

  // Sidebar: children of current, or siblings (parent's children) if this is a subcategory
  const sidebarItems: SidebarItem[] = productCategory.children.nodes.length > 0
    ? productCategory.children.nodes
    : productCategory.ancestors.nodes[0]?.children.nodes ?? []
  const sidebarParent = productCategory.children.nodes.length === 0 && productCategory.ancestors.nodes[0]
    ? { name: productCategory.ancestors.nodes[0].name, slug: productCategory.ancestors.nodes[0].slug }
    : null

  const totalPages = Math.ceil(productCategory.count / PRODUCTS_PER_PAGE)

  return (
    <>
      <SiteNav categories={navCategories} alwaysVisible />

      <main style={{ paddingTop: '80px', minHeight: '70vh' }}>
        <div style={{ width: '90vw', margin: '0 auto', paddingTop: '40px', paddingBottom: '80px' }}>
          <BackButton />

          <h1 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'clamp(28px, 7vw, 108px)', lineHeight: 1, marginBottom: '8px', wordBreak: 'break-word' }}>
            {productCategory.name}
          </h1>
          {productCategory.count > 0 && (
            <p className="mb-8" style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.85rem', opacity: 0.4 }}>
              {productCategory.count} produto{productCategory.count !== 1 ? 's' : ''}
            </p>
          )}

          <div className="flex gap-10 items-start">
            {/* Sidemenu — desktop */}
            {sidebarItems.length > 0 && (
              <aside className="hidden md:block flex-shrink-0" style={{ width: 190 }}>
                {sidebarParent && (
                  <Link href={`/product-category/${sidebarParent.slug}`}
                    className="flex items-center gap-1 mb-3 hover:opacity-60 transition-opacity"
                    style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.78rem', opacity: 0.45 }}>
                    ← {sidebarParent.name}
                  </Link>
                )}
                <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.35, marginBottom: '10px' }}>
                  {sidebarParent ? 'Subcategorias' : 'Categorias'}
                </p>
                <nav className="flex flex-col">
                  {sidebarItems.map(item => (
                    <Link
                      key={item.slug}
                      href={`/product-category/${item.slug}`}
                      className="hover:opacity-60 transition-opacity"
                      style={{
                        fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.88rem',
                        padding: '6px 0',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                        opacity: item.slug === slug ? 1 : undefined,
                        color: item.slug === slug ? '#0a0a0a' : undefined,
                      }}
                    >
                      {item.name}
                      {item.count > 0 && (
                        <span style={{ fontSize: '0.75rem', opacity: 0.35, marginLeft: 6 }}>({item.count})</span>
                      )}
                    </Link>
                  ))}
                </nav>
              </aside>
            )}

            {/* Grelha de produtos */}
            <div className="flex-1 min-w-0">
              {/* Mobile: categorias + ordenar empilhados */}
              <div className="flex flex-col gap-2 mb-6 md:flex-row md:justify-end md:items-center">
                <CategorySidebar
                  items={sidebarItems}
                  currentSlug={slug}
                  parentName={sidebarParent?.name}
                  parentSlug={sidebarParent?.slug}
                  label={sidebarParent ? 'Subcategorias' : 'Categorias'}
                />
                <Suspense>
                  <SortSelect current={sort} />
                </Suspense>
              </div>

              {products.nodes.length === 0 ? (
                <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, opacity: 0.4 }}>
                  Sem produtos nesta categoria.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                    {products.nodes.map(product => (
                      <ProductCard key={product.slug} product={product} />
                    ))}
                  </div>
                  <Pagination page={page} totalPages={totalPages} sort={sort} />
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
