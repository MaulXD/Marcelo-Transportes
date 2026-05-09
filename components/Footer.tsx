import { MapPin } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const WHATSAPP_LINKS = [
  { label: "(82) 98869-6838", href: "https://wa.me/5582988696838" },
  { label: "(82) 99949-0684", href: "https://wa.me/5582999490684" },
] as const;

const footerLinkClass =
  "text-slate-700 transition-colors duration-300 hover:text-[#152B4D]/80 dark:text-white/85 dark:hover:text-white";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contato"
      className="scroll-mt-24 border-t border-slate-200/90 bg-white px-4 py-16 dark:border-white/10 dark:bg-[#152B4D] sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <BrandLogo align="start" className="max-w-xs" />
            <p className="mt-6 text-sm text-slate-600 dark:text-white/75">
              CNPJ 44.971.020/0001-85
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-white/85">
              Sede em Maceió (AL). Atendimento intermunicipal e interestadual.
              Desde 2022 — peça orçamento pelo formulário ou pelos WhatsApps
              oficiais.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-white/70">
              WhatsApp
            </p>
            <ul className="flex flex-col gap-3">
              {WHATSAPP_LINKS.map((w) => (
                <li key={w.href}>
                  <a
                    href={w.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[48px] items-center gap-3 rounded-xl border border-slate-200/90 bg-white/90 p-3 text-base font-semibold shadow-sm backdrop-blur-md transition-colors duration-300 hover:border-slate-300/90 hover:bg-slate-50/90 dark:border-white/15 dark:bg-white/10 dark:hover:border-white/25 dark:hover:bg-white/[0.14]"
                  >
                    <span className="shrink-0 text-[#25D366]">
                      <WhatsAppIcon className="h-7 w-7" />
                    </span>
                    <span className="text-[#152B4D] transition-colors duration-300 group-hover:text-[#152B4D]/80 dark:text-white dark:group-hover:text-white">
                      {w.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-start gap-3 pt-2 text-slate-700 transition-colors duration-300 dark:text-white/85">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#152B4D]/90 transition-colors duration-300 dark:text-white/80" />
              <span>Maceió, Alagoas</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-white/70">
              Links rápidos
            </p>
            <nav className="mt-4 flex flex-col gap-2 text-sm">
              <a href="#inicio" className={footerLinkClass}>
                Início
              </a>
              <a href="#sobre" className={footerLinkClass}>
                Sobre
              </a>
              <a href="#servicos" className={footerLinkClass}>
                Serviços
              </a>
              <a href="#galeria" className={footerLinkClass}>
                Galeria
              </a>
              <a href="#orcamento" className={footerLinkClass}>
                Orçamento
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-slate-200/90 pt-8 text-center text-xs text-slate-600 transition-colors duration-300 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between sm:text-left dark:text-white/55">
          <span>
            © {year} Marcelo Luz Transportes · CNPJ 44.971.020/0001-85 — Todos os
            direitos reservados.
          </span>
          <span>Maceió · Nordeste e Brasil</span>
        </div>
      </div>
    </footer>
  );
}
