"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, SendHorizontal, ShieldCheck } from "lucide-react";

const sectionReveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 },
} as const;

export function Hero() {
  return (
    <motion.section
      id="inicio"
      className="relative scroll-mt-24 px-4 pb-20 pt-32 sm:px-6 sm:pb-28 sm:pt-36"
      {...sectionReveal}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-brand-navy/10 blur-3xl dark:bg-white/10" />
        <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-slate-400/15 blur-3xl dark:bg-[#0d1f35]/80" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/80 px-3 py-1 text-xs text-[#152B4D] backdrop-blur-md dark:border-white/15 dark:bg-white/10 dark:text-white/90">
          <MapPin className="h-3.5 w-3.5 text-brand-navy dark:text-[#8A94A6]" aria-hidden />
          Maceió, AL · Intermunicipal e interestadual
        </div>

        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-[#152B4D] sm:text-5xl lg:text-6xl dark:text-white">
          Mudanças sem dor de cabeça no Nordeste —{" "}
          <span className="text-slate-800 dark:text-white/85">
            do pedido ao destino
          </span>
          .
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-700 sm:text-xl dark:text-white/85">
          Atendimento para{" "}
          <strong className="font-semibold text-[#152B4D] dark:text-white">
            pessoa física e jurídica
          </strong>
          . Planeje seu frete com transparência e fale com a equipe pelo
          WhatsApp após o formulário.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#orcamento"
            className="cta-solid inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base"
          >
            Solicitar orçamento
            <ArrowRight className="h-5 w-5" aria-hidden />
          </a>
          <a
            href="#servicos"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/80 px-6 py-3.5 text-base font-medium text-[#152B4D] backdrop-blur-md transition hover:border-brand-navy/35 hover:text-brand-navy dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-[#8A94A6] dark:hover:text-white"
          >
            Ver serviços
          </a>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              t: "Corporativo e seguro",
              d: "Identidade visual alinhada à operação formal — CNPJ em dia.",
            },
            {
              icon: MapPin,
              t: "Rotas regionais",
              d: "Fortes em trechos intermunicipais e interestaduais.",
            },
            {
              icon: SendHorizontal,
              t: "Fluxo direto",
              d: "Formulário inteligente → mensagem pronta no WhatsApp.",
            },
          ].map((item) => (
            <div key={item.t} className="glass-panel flex gap-3 p-4">
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-navy dark:text-[#8A94A6]" />
              <div>
                <p className="font-semibold text-[#152B4D] dark:text-white">
                  {item.t}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-white/75">
                  {item.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
