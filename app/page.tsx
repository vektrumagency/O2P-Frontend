import type { Metadata } from "next";
import Image from "next/image";
import { fetchGraphQL } from "@/lib/graphql";

export const metadata: Metadata = {
  title: "Order2Party — Artigos de Festa",
  description: "Tudo o que precisas para a festa perfeita. Balões, decorações, talheres e muito mais.",
  openGraph: {
    title: "Order2Party — Artigos de Festa",
    description: "Tudo o que precisas para a festa perfeita.",
    images: [{ url: "/hero.png", alt: "Order2Party" }],
  },
};
import { SiteNav } from "./components/SiteNav";
import { Manifesto } from "./components/Manifesto";
import { MarqueeProducts } from "./components/MarqueeProducts";
import { EventSection } from "./components/EventSection";
import { BannerCTA } from "./components/BannerCTA";
import { Footer } from "./components/Footer";

type Category = {
  name: string;
  slug: string;
  count: number;
  image?: { sourceUrl: string; altText: string };
};

type Product = {
  name: string;
  slug: string;
  price?: string;
  image?: { sourceUrl: string; altText: string };
};

const GET_HOMEPAGE_DATA = `
  query HomepageData {
    productCategories(first: 50, where: { hideEmpty: true, parent: 0 }) {
      nodes {
        name
        slug
        count
        image { sourceUrl altText }
      }
    }
    products(first: 8, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        name
        slug
        image { sourceUrl altText }
        ... on SimpleProduct { price }
        ... on VariableProduct { price }
      }
    }
  }
`;

type HomepageData = {
  productCategories: { nodes: Category[] };
  products: { nodes: Product[] };
};

function Hero() {
  return (
    <section className="relative overflow-hidden h-[70vh] md:h-screen" style={{ backgroundColor: '#ffffff' }}>
      {/* Título */}
      <h1
        className="absolute top-0 left-0 right-0 z-10 text-center whitespace-nowrap leading-none select-none"
        style={{
          fontFamily: 'var(--font-bricolage)',
          fontSize: 'clamp(60px, 17vw, 300px)',
          color: '#0a0a0a',
          paddingTop: 'clamp(16px, 4vw, 60px)',
        }}
      >
        order2party
      </h1>

      {/* Imagem */}
      <div className="absolute left-[5vw] right-[5vw] overflow-hidden hero-img top-[3vh] bottom-[3vh] md:top-[clamp(80px,14vw,220px)] md:bottom-0">
        <Image
          src="/hero.png"
          alt="Festa Order2Party"
          fill
          sizes="90vw"
          quality={95}
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}




function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-10"
      style={{
        fontFamily: 'var(--font-bricolage)',
        fontSize: 'clamp(28px, 4vw, 56px)',
        lineHeight: 1,
      }}
    >
      {children}
    </h2>
  )
}


export default async function Home() {
  const data = await fetchGraphQL<HomepageData>(GET_HOMEPAGE_DATA);
  const EXCLUDE = ['Sem Categoria', 'Cores Lisas', 'Novidades', 'Produtos']
  const categories = data.productCategories.nodes.filter(c => !EXCLUDE.includes(c.name));
  const products = data.products.nodes;

  return (
    <>
      <SiteNav categories={categories} />
      <main className="flex-1 pt-[94px]">
        <Hero />
        <Manifesto />
        <BannerCTA />

        <EventSection />

        <section id="produtos" className="py-16">
          <div style={{ width: '90vw', margin: '0 auto' }} className="mb-10">
            <SectionHeading>Novidades</SectionHeading>
          </div>
          <MarqueeProducts products={products} />
        </section>
      </main>
      <Footer />
    </>
  );
}
