import type { Metadata } from "next";
import { Ranchers, DM_Sans, Nunito } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { CartSidebar } from "./components/CartSidebar";
import { SearchOverlay } from "./components/SearchOverlay";
import { CartProvider } from "./context/CartContext";

const bricolage = Ranchers({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const nunito = Nunito({
  variable: "--font-nav",
  subsets: ["latin"],
  weight: ["800", "900"],
});

const axelGrotesk = localFont({
  src: "../public/fonts/BNAxelGrotesk-Bold.otf",
  variable: "--font-secondary",
  weight: "700",
});

const fraktionSans = localFont({
  src: "../public/fonts/PPFraktionSans-Bold.otf",
  variable: "--font-fraktion-sans",
  weight: "700",
});

export const metadata: Metadata = {
  title: {
    template: "%s — Order2Party",
    default: "Order2Party — Artigos de Festa",
  },
  description: "Tudo o que precisas para a festa perfeita. Balões, decorações, talheres e muito mais.",
  metadataBase: new URL("https://order2party.pt"),
  openGraph: {
    siteName: "Order2Party",
    locale: "pt_PT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt" className={`${bricolage.variable} ${dmSans.variable} ${nunito.variable} ${axelGrotesk.variable} ${fraktionSans.variable}`}>
      <body className="min-h-screen flex flex-col antialiased" style={{ fontFamily: "var(--font-dm-sans)" }}>
        <CartProvider>
          {children}
          <CartSidebar />
        </CartProvider>
        <SearchOverlay />
      </body>
    </html>
  );
}
