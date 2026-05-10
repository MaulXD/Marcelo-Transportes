import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://marceloluztransportes.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Marcelo Luz Transportes | Mudanças de Maceió para todo o Nordeste",
    template: "%s | Marcelo Luz Transportes",
  },
  description:
    "Transporte rodoviário e mudanças para PF e PJ. Sede em Maceió (AL), atuação intermunicipal e interestadual desde 2022. Orçamento pelo site.",
  keywords: [
    "mudanças Maceió",
    "transporte Nordeste",
    "mudança interestadual",
    "Marcelo Luz Transportes",
    "frete mudança AL",
  ],
  authors: [{ name: "Marcelo Luz Transportes" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Marcelo Luz Transportes",
    title: "Marcelo Luz Transportes | Mudanças em todo o Nordeste",
    description:
      "Mudanças sem dor de cabeça no Nordeste e em todo o Brasil. WhatsApp oficial e formulário de orçamento.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Marcelo Luz Transportes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marcelo Luz Transportes",
    description:
      "Mudanças e transportes com segurança. Base em Maceió, Nordeste inteiro.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-[#c5d9ed] font-sans text-[#1a2b4b] antialiased transition-colors duration-500 selection:bg-[#94a3b8]/50 selection:text-[#0f172a] dark:bg-[#0f172a] dark:text-[#f8fafc] dark:selection:bg-sky-500/30 dark:selection:text-white`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
