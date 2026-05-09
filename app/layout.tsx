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
      "Marcelo Luz Transportes | Mudan?as de Macei? para todo o Nordeste",
    template: "%s | Marcelo Luz Transportes",
  },
  description:
    "Transporte rodovi?rio e mudan?as para PF e PJ. Sede em Macei? (AL), atua??o intermunicipal e interestadual desde 2022. Or?amento pelo site.",
  keywords: [
    "mudan?as Macei?",
    "transporte Nordeste",
    "mudan?a interestadual",
    "Marcelo Luz Transportes",
    "frete mudan?a AL",
  ],
  authors: [{ name: "Marcelo Luz Transportes" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Marcelo Luz Transportes",
    title: "Marcelo Luz Transportes | Mudan?as em todo o Nordeste",
    description:
      "Mudan?as sem dor de cabe?a no Nordeste e em todo o Brasil. WhatsApp oficial e formul?rio de or?amento.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Marcelo Luz Transportes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marcelo Luz Transportes",
    description:
      "Mudan?as e transportes com seguran?a. Base em Macei?, Nordeste inteiro.",
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
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-slate-50 font-sans text-[#152B4D] antialiased transition-colors duration-500 selection:bg-slate-300 selection:text-[#152B4D] dark:bg-[#152B4D] dark:text-white dark:selection:bg-white/20 dark:selection:text-white`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
