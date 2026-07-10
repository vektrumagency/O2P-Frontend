import { SiteNav } from './SiteNav'
import { Footer } from './Footer'
import { BackButton } from './BackButton'

type Category = { name: string; slug: string; image?: { sourceUrl: string; altText: string } }

export function InfoPage({ categories, title, html }: { categories: Category[]; title: string; html: string }) {
  return (
    <>
      <SiteNav categories={categories} alwaysVisible />

      <main style={{ paddingTop: '114px', minHeight: '70vh' }}>
        <div style={{ width: '90vw', maxWidth: 760, margin: '0 auto', paddingTop: '40px', paddingBottom: '80px' }}>
          <BackButton />

          <h1 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'var(--text-3xl)', marginBottom: '32px', lineHeight: 1 }}>
            {title}
          </h1>

          <div className="info-prose" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </main>

      <Footer />
    </>
  )
}
