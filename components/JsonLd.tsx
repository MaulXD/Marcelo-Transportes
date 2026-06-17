import { absoluteUrl, siteConfig } from "@/lib/site";

const galleryImages = [
  absoluteUrl("/galeria/foto1.webp"),
  absoluteUrl("/galeria/foto2.webp"),
  absoluteUrl("/galeria/foto3.webp"),
  absoluteUrl("/galeria/foto4.webp"),
  absoluteUrl("/galeria/foto5.webp"),
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MovingCompany",
      "@id": `${absoluteUrl("/")}#organization`,
      name: siteConfig.name,
      legalName: siteConfig.legalName,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/MT-LOGO-ESCURA.webp"),
      image: galleryImages,
      description: siteConfig.description,
      telephone: siteConfig.phoneE164,
      taxID: siteConfig.cnpj,
      foundingDate: String(siteConfig.foundingYear),
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.address.locality,
        addressRegion: siteConfig.address.region,
        addressCountry: siteConfig.address.country,
      },
      areaServed: siteConfig.areaServed.map((name) => ({
        "@type": "AdministrativeArea",
        name,
      })),
      knowsAbout: siteConfig.services,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: siteConfig.phoneE164,
        contactType: "customer service",
        areaServed: siteConfig.address.country,
        availableLanguage: ["Portuguese"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${absoluteUrl("/")}#website`,
      url: absoluteUrl("/"),
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      publisher: { "@id": `${absoluteUrl("/")}#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${absoluteUrl("/")}#webpage`,
      url: absoluteUrl("/"),
      name: siteConfig.title,
      description: siteConfig.description,
      isPartOf: { "@id": `${absoluteUrl("/")}#website` },
      about: { "@id": `${absoluteUrl("/")}#organization` },
      inLanguage: siteConfig.language,
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
