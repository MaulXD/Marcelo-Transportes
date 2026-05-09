"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV = [
  { id: "inicio", label: "Início" },
  { id: "sobre", label: "Sobre" },
  { id: "servicos", label: "Serviços" },
  { id: "galeria", label: "Galeria" },
  { id: "orcamento", label: "Orçamento" },
  { id: "contato", label: "Contato" },
] as const;

const navLinkBase =
  "rounded-full px-3 py-2 text-sm font-medium transition-colors";

export function Header() {
  const [active, setActive] = useState<string>("inicio");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = NAV.map((n) =>
      document.getElementById(n.id)
    ).filter(Boolean) as HTMLElement[];

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.2, 0.45, 0.65] }
    );

    sections.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-lg transition-colors duration-500 dark:border-white/10 dark:bg-[#152B4D]/95 dark:shadow-none">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-5 sm:px-6">
        <a
          href="#inicio"
          className="shrink-0 transition-opacity hover:opacity-90"
          onClick={() => setOpen(false)}
        >
          <BrandLogo align="center" className="w-fit" />
        </a>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          <nav className="hidden md:flex md:items-center md:gap-8">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`${navLinkBase} ${
                  active === item.id
                    ? "bg-brand-navy/10 text-[#152B4D] ring-1 ring-brand-navy/25 dark:bg-white/15 dark:text-white dark:ring-white/25"
                    : "text-[#152B4D]/80 hover:text-[#152B4D] dark:text-white/75 dark:hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <a
              href="#orcamento"
              className="cta-solid hidden rounded-full px-4 py-2.5 text-sm md:inline-flex"
            >
              Pedir orçamento
            </a>
            <button
              type="button"
              className="inline-flex rounded-lg border border-slate-200/90 bg-white/90 p-2 text-[#152B4D] md:hidden dark:border-white/15 dark:bg-white/10 dark:text-white"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="border-t border-slate-200/90 bg-white px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#152B4D] md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium ${
                  active === item.id
                    ? "bg-brand-navy/10 text-[#152B4D] dark:bg-white/15 dark:text-white"
                    : "text-[#152B4D] dark:text-white/85"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#orcamento"
              className="cta-solid mt-2 rounded-xl py-3 text-center text-sm"
              onClick={() => setOpen(false)}
            >
              Pedir orçamento
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
