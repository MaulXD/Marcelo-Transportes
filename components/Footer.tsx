import { MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const WHATSAPP_PHONE_DISPLAY = "(82) 99949-0684";
const WHATSAPP_HREF = "https://wa.me/5582999490684";
/** Discagem direta (DDI + número sem espaços). */
const TEL_HREF = "tel:+5582999490684";

const footerLinkClass =
  "text-[#1a2b4b]/85 transition-colors duration-300 hover:text-[#1a2b4b] dark:text-[#f8fafc]/85 dark:hover:text-[#f8fafc]";

const contactCardClass =
  "flex max-w-md min-h-[5.25rem] flex-col justify-center rounded-2xl border border-slate-200/90 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:shadow-lg dark:border-white/15 dark:bg-white/[0.07] dark:hover:border-sky-400/35 dark:hover:bg-sky-500/10";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contato"
      className="scroll-mt-24 border-t border-slate-400/40 bg-white px-4 py-16 dark:border-white/10 dark:bg-[#0f172a] sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <BrandLogo align="start" className="max-w-xs" />
            <p className="mt-6 text-sm text-[#1a2b4b]/75 dark:text-[#f8fafc]/75">
              CNPJ 44.971.020/0001-85
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#1a2b4b]/90 dark:text-[#f8fafc]/85">
              Sede em Maceió (AL). Atendimento intermunicipal e interestadual.
              Desde 2022. Peça orçamento pelo formulário ou pelo WhatsApp
              oficial.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#1a2b4b]/75 dark:text-[#f8fafc]/70">
              Contato
            </p>
            <div className="flex flex-col gap-4">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className={contactCardClass}
              >
                <div className="flex items-center gap-4">
                  <div className="shrink-0 text-[#25D366]">
                    <WhatsAppIcon className="h-8 w-8" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#1a2b4b] dark:text-[#f8fafc]">
                      WhatsApp
                    </p>
                    <p className="text-sm text-[#1a2b4b]/75 dark:text-[#f8fafc]/75">
                      {WHATSAPP_PHONE_DISPLAY}
                    </p>
                  </div>
                </div>
              </a>

              <a href={TEL_HREF} className={contactCardClass}>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a2b4b]/10 text-[#1a2b4b] dark:bg-sky-500/15 dark:text-sky-400">
                    <Phone className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#1a2b4b] dark:text-[#f8fafc]">
                      Telefone
                    </p>
                    <p className="text-sm text-[#1a2b4b]/75 dark:text-[#f8fafc]/75">
                      {WHATSAPP_PHONE_DISPLAY}
                    </p>
                  </div>
                </div>
              </a>
            </div>

            <div className="flex items-start gap-3 pt-2 text-[#1a2b4b]/90 transition-colors duration-300 dark:text-[#f8fafc]/85">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#1a2b4b] dark:text-sky-400" />
              <span>Maceió, Alagoas</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#1a2b4b]/75 dark:text-[#f8fafc]/70">
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

        <div className="mt-12 flex flex-col gap-2 border-t border-slate-200/90 pt-8 text-center text-xs text-[#1a2b4b]/65 transition-colors duration-300 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between sm:text-left dark:text-[#f8fafc]/50">
          <span>
            © {year} Marcelo Luz Transportes · CNPJ 44.971.020/0001-85. Todos os
            direitos reservados.
          </span>
          <span>Maceió · Nordeste e Brasil</span>
        </div>
      </div>
    </footer>
  );
}
