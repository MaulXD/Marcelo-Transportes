import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECTIONS = ["sobre", "servicos", "galeria", "orcamento", "contato"] as const;

/** Remove acentos e normaliza para comparar paths (início → inicio). */
function normalizeSegment(pathname: string): string {
  const segment = decodeURIComponent(pathname).replace(/^\/+|\/+$/g, "");
  return segment
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

export function middleware(request: NextRequest) {
  const segment = normalizeSegment(request.nextUrl.pathname);
  if (!segment) return NextResponse.next();

  const url = request.nextUrl.clone();

  if (segment === "inicio") {
    url.pathname = "/";
    url.hash = "";
    return NextResponse.redirect(url, 308);
  }

  if ((SECTIONS as readonly string[]).includes(segment)) {
    url.pathname = "/";
    url.hash = segment;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/inicio",
    "/início",
    "/sobre",
    "/servicos",
    "/galeria",
    "/orcamento",
    "/contato",
  ],
};
