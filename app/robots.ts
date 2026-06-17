import type { MetadataRoute } from "next";
import { absoluteUrl, siteHostname } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteHostname(),
  };
}