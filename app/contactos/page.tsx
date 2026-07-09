import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchGraphQL } from '@/lib/graphql'
import { SiteNav } from '@/app/components/SiteNav'
import { Footer } from '@/app/components/Footer'
import { BackButton } from '@/app/components/BackButton'
import { ContactForm } from '@/app/components/ContactForm'

type Category = { name: string; slug: string; image?: { sourceUrl: string; altText: string } }

const NAV_QUERY = `
  query NavCategories {
    productCategories(first: 50, where: { hideEmpty: true, parent: 0 }) {
      nodes { name slug image { sourceUrl altText } }
    }
  }
`

export const metadata: Metadata = {
  title: 'Contactos',
  description: 'Fala connosco — telefone, e-mail ou formulário de contacto da Order2Party.',
}

export default async function ContactosPage() {
  const navData = await fetchGraphQL<{ productCategories: { nodes: Category[] } }>(NAV_QUERY)
  const EXCLUDE = ['Sem Categoria', 'Cores Lisas', 'Novidades', 'Produtos']
  const categories = navData.productCategories.nodes.filter(c => !EXCLUDE.includes(c.name))

  return (
    <>
      <SiteNav categories={categories} alwaysVisible />

      <main style={{ paddingTop: '114px', minHeight: '70vh' }}>
        <div style={{ width: '90vw', margin: '0 auto', paddingTop: '40px', paddingBottom: '80px' }}>
          <BackButton />

          <h1 style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginBottom: '40px', lineHeight: 1 }}>
            Contactos
          </h1>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            <div className="flex-1" style={{ maxWidth: 480 }}>
              <h2 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '1.3rem', marginBottom: 20 }}>
                Envie-nos uma mensagem
              </h2>
              <ContactForm />
            </div>

            <div className="lg:w-72 flex-shrink-0">
              <div style={{ backgroundColor: '#FFE394', borderRadius: 24, padding: '32px 28px' }}>
                <h2 style={{ fontFamily: 'var(--font-bricolage)', fontSize: '1.3rem', marginBottom: 20 }}>
                  Fale connosco
                </h2>

                <a href="tel:933544261" className="block mb-4 hover:opacity-60 transition-opacity">
                  <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: 2 }}>Telefone</p>
                  <p style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '1rem' }}>933 544 261</p>
                  <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontSize: '0.72rem', opacity: 0.5 }}>Custo de chamada para rede móvel nacional</p>
                </a>

                <a href="mailto:geral@order2party.pt" className="block mb-4 hover:opacity-60 transition-opacity">
                  <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: 2 }}>E-mail</p>
                  <p style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '1rem' }}>geral@order2party.pt</p>
                </a>

                <div className="mb-2">
                  <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.5, marginBottom: 2 }}>Morada</p>
                  <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.9rem' }}>Rua Prof. Manuel Cavaleiro Ferreira 4C</p>
                  <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontSize: '0.8rem', opacity: 0.6 }}>Apenas loja online</p>
                </div>
              </div>

              <Link
                href="/contactos/livro-de-reclamacoes-online"
                className="block mt-4 hover:opacity-60 transition-opacity"
                style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: '0.85rem', opacity: 0.5, textDecoration: 'underline' }}
              >
                Livro de Reclamações Online
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
