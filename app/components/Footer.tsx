import Link from 'next/link'

export function Footer() {
  return (
    <footer className="footer-animated mt-16">
      <div className="flex justify-center py-12">
        <div style={{ width: '90vw' }} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
          <div>
            <p className="mb-5" style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'var(--text-xl)', lineHeight: 1 }}>
              Contacto
            </p>
            {[
              { label: 'Telefone: 933 544 261 (rede móvel digital)', href: 'tel:933544261' },
              { label: 'geral@order2party.pt', href: 'mailto:geral@order2party.pt' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                className="block mb-2 hover:opacity-60 transition-opacity"
                style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: 'var(--text-base)' }}
              >
                {link.label}
              </a>
            ))}
            <p className="mt-2" style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: 'var(--text-base)', opacity: 0.6 }}>
              Rua Prof. Manuel Cavaleiro Ferreira 4C
            </p>
            <p style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: 'var(--text-base)', opacity: 0.6 }}>
              Apenas Loja Online
            </p>
          </div>
          <div>
            <p className="mb-5" style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'var(--text-xl)', lineHeight: 1 }}>
              Links Úteis
            </p>
            {[
              { label: 'Política de Privacidade', href: '/politica-de-privacidade' },
              { label: 'Termos e Condições', href: '/termos-e-condicoes' },
              { label: 'Política de Reembolso', href: '/politica-reembolso' },
              { label: 'Entrega de Encomendas', href: '/politica-entregas' },
              { label: 'Perguntas Frequentes', href: '/faqs' },
              { label: 'Contacte-nos', href: '/contactos' },
              { label: 'Livro de Reclamações Online', href: '/contactos/livro-de-reclamacoes-online' },
              { label: 'Resolução de Conflitos', href: '/resolucao-de-conflitos' },
            ].map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="block mb-2 hover:opacity-60 transition-opacity"
                style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: 'var(--text-base)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <p className="mb-5" style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'var(--text-xl)', lineHeight: 1 }}>
              Informações
            </p>
            <Link
              href="/sobre-nos"
              className="block mb-2 hover:opacity-60 transition-opacity"
              style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: 'var(--text-base)' }}
            >
              Sobre Nós
            </Link>
            {[
              { label: 'Facebook', href: 'https://facebook.com' },
              { label: 'Instagram', href: 'https://instagram.com' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                className="block mb-2 hover:opacity-60 transition-opacity"
                style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: 'var(--text-base)' }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div>
            <p className="mb-5" style={{ fontFamily: 'var(--font-bricolage)', fontSize: 'var(--text-xl)', lineHeight: 1 }}>
              Pagamento
            </p>
            {['MB WAY', 'Multibanco', 'Visa', 'Mastercard', 'PayPal'].map(method => (
              <span
                key={method}
                className="block mb-2"
                style={{ fontFamily: 'var(--font-fraktion-sans)', fontWeight: 700, fontSize: 'var(--text-base)' }}
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden w-full flex justify-center">
        <h2
          className="leading-none select-none whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-bricolage)',
            fontSize: '18.5vw',
            color: '#0a0a0a',
            letterSpacing: '0.01em',
          }}
        >
          order2party
        </h2>
      </div>

      <div className="flex justify-center py-5">
        <div style={{ width: '90vw' }}>
          <p style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: 'var(--text-xs)' }}>
            © {new Date().getFullYear()} Order2Party
          </p>
        </div>
      </div>
    </footer>
  )
}
