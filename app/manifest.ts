import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "ML Transportes",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#c5d9ed",
    theme_color: "#1a2b4b",
    lang: siteConfig.language,
    icons: [
      {
        src: "/MT-LOGO-ESCURA.webp",
        sizes: "any",
        type: "image/webp",
      },
    ],
  };
}
