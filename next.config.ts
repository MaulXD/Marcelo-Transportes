import type { NextConfig } from "next";

/** Seções do site (âncoras #id). Redireciona URLs que o Google pode inventar a partir do menu. */
const SECTIONS = [
  "sobre",
  "servicos",
  "galeria",
  "orcamento",
  "contato",
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Google às vezes cria /início a partir do rótulo "Início" no menu
      { source: "/início", destination: "/", permanent: true },
      { source: "/in%C3%ADcio", destination: "/", permanent: true },
      { source: "/inicio", destination: "/", permanent: true },
      { source: "/Inicio", destination: "/", permanent: true },
      ...SECTIONS.map((section) => ({
        source: `/${section}`,
        destination: `/#${section}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
