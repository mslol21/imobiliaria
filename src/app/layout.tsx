import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/services/settings.service";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const brandName = settings.agency_name || "Imóveis na Zona Leste";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${brandName} | Casas e Apartamentos em Guaianases e Zona Leste`,
      template: `%s | ${brandName}`,
    },
    description: settings.agency_slogan,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: brandName,
      title: `${brandName} | Imóveis para Comprar ou Alugar em Guaianases`,
      description: settings.agency_slogan,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${manrope.variable}`}
    >
      <body className="antialiased selection:bg-cyan-100 selection:text-cyan-950 bg-white text-zinc-900">
        {children}
      </body>
    </html>
  );
}
