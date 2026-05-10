"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

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
      className="relative scroll-mt-24 px-4 pb-14 pt-32 sm:px-6 sm:pb-20 sm:pt-36"
      {...sectionReveal}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-brand-navy/10 blur-3xl dark:bg-white/10" />
        <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-slate-400/15 blur-3xl dark:bg-[#0d1f35]/80" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/85 px-3 py-1 text-xs text-[#1a2b4b] backdrop-blur-md dark:border-white/15 dark:bg-white/10 dark:text-[#f8fafc]/90">
          <MapPin className="h-3.5 w-3.5 text-[#1a2b4b] dark:text-sky-400" aria-hidden />
          Maceió, AL · Intermunicipal e interestadual
        </div>

        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-[#1a2b4b] sm:text-5xl lg:text-6xl dark:text-[#f8fafc]">
          Mudanças sem dor de cabeça no Nordeste,{" "}
          <span className="text-[#1a2b4b]/88 dark:text-[#f8fafc]/88">
            do pedido ao destino
          </span>
          .
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#1a2b4b]/90 sm:text-xl dark:text-[#f8fafc]/85">
          Atendimento para{" "}
          <strong className="font-semibold text-[#1a2b4b] dark:text-[#f8fafc]">
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
            className="inline-flex items-center gap-2 rounded-full border border-slate-300/90 bg-white/85 px-6 py-3.5 text-base font-medium text-[#1a2b4b] backdrop-blur-md transition hover:border-sky-500/45 hover:text-[#1a2b4b] dark:border-white/20 dark:bg-white/10 dark:text-[#f8fafc] dark:hover:border-sky-400/50 dark:hover:text-[#f8fafc]"
          >
            Ver serviços
          </a>
        </div>
      </div>
    </motion.section>
  );
}
