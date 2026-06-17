/** Configuração central do site — metadata, SEO e dados estruturados. */
export const siteConfig = {
  name: "Marcelo Luz Transportes",
  legalName: "Marcelo Luz Transportes",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://marceloluztransportes.com.br",
  locale: "pt_BR",
  language: "pt-BR",
  foundingYear: 2022,
  cnpj: "44.971.020/0001-85",
  phoneDisplay: "(82) 99949-0684",
  phoneE164: "+5582999490684",
  whatsappDigits: "5582999490684",
  email: "contato@marceloluztransportes.com.br",
  address: {
    locality: "Maceió",
    region: "AL",
    regionName: "Alagoas",
    country: "BR",
    countryName: "Brasil",
  },
  areaServed: [
    "Maceió",
    "Alagoas",
    "Nordeste",
    "Brasil",
  ],
  title:
    "Marcelo Luz Transportes | Mudanças de Maceió para todo o Nordeste",
  description:
    "Empresa de mudanças e transporte rodoviário em Maceió (AL). Atendemos pessoa física e jurídica com fretes intermunicipais e interestaduais no Nordeste e em todo o Brasil. Orçamento online e WhatsApp.",
  keywords: [
    "mudanças Maceió",
    "empresa de mudança Alagoas",
    "transporte Nordeste",
    "mudança interestadual",
    "frete mudança AL",
    "carreto Maceió",
    "mudança residencial Maceió",
    "mudança comercial Nordeste",
    "transporte de cargas Alagoas",
    "Marcelo Luz Transportes",
    "mudança para Recife",
    "mudança para Salvador",
    "frete intermunicipal",
  ],
  services: [
    "Mudanças residenciais",
    "Mudanças comerciais e corporativas",
    "Pequenos fretes e carretos",
    "Transporte de cargas e encomendas",
    "Serviços complementares",
  ],
  ogImageAlt: "Marcelo Luz Transportes — mudanças e fretes no Nordeste",
} as const;

export function absoluteUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function siteHostname(): string {
  return new URL(siteConfig.url).host;
}
