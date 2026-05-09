"use client";

import { motion } from "framer-motion";
import {
  Boxes,
  Building2,
  Car,
  Home,
  Package,
  ShieldPlus,
} from "lucide-react";

const ITEMS = [
  {
    icon: Home,
    title: "Mudanças Residenciais",
    body: "Transporte seguro e entrega no novo endereço. Sem estresse, com toda a atenção que seus bens merecem.",
  },
  {
    icon: Building2,
    title: "Mudanças Comerciais e Corporativas",
    body: "Planejamento logístico, mobiliário e equipamentos para sua empresa, reduzindo tempo parado na mudança.",
  },
  {
    icon: Package,
    title: "Pequenos Fretes e Carretos",
    body: "Fretes rápidos para volumes menores — dia a dia ou urgências.",
  },
  {
    icon: Boxes,
    title: "Transporte de Cargas e Encomendas",
    body: "Cargas gerais com foco em segurança e fluxo de entregas e recebimentos.",
  },
  {
    icon: Car,
    title: "Transporte de Veículos",
    body: "Opções seguras e confiáveis para transportar carros, motos ou frotas para qualquer lugar do Brasil.",
  },
  {
    icon: ShieldPlus,
    title: "Serviços Complementares",
    body: "Guarda-móveis, seguro de transporte e içamento — experiência mais completa quando você precisar.",
  },
];

const sectionReveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 },
} as const;

export function Services() {
  return (
    <motion.section
      id="servicos"
      className="scroll-mt-24 px-4 py-20 sm:px-6"
      aria-labelledby="servicos-heading"
      {...sectionReveal}
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-white/70">
          O que fazemos
        </p>
        <h2
          id="servicos-heading"
          className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-[#152B4D] dark:text-white sm:text-4xl"
        >
          Soluções em transporte e mudanças
        </h2>
        <p className="mt-6 max-w-3xl leading-relaxed text-slate-700 dark:text-white/85">
          Vai mudar de endereço, precisa transportar equipamentos ou otimizar a
          logística da sua empresa? Encontre aqui as melhores soluções em
          transporte e mudanças para pessoa física e jurídica!
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item) => (
            <article
              key={item.title}
              className="glass-panel group relative overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-2 hover:border-brand-navy/25 hover:shadow-brand-soft dark:hover:border-white/25 dark:hover:shadow-brand-soft-dark"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-navy/[0.06] blur-2xl transition group-hover:bg-brand-navy/10 dark:bg-white/5 dark:group-hover:bg-white/10" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy/10 ring-1 ring-brand-navy/20 dark:bg-white/10 dark:ring-white/20">
                <item.icon
                  className="h-5 w-5 text-brand-navy dark:text-[#8A94A6]"
                  aria-hidden
                />
              </div>
              <h3 className="relative mt-5 text-lg font-semibold text-[#152B4D] dark:text-white">
                {item.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-slate-600 dark:text-white/80">
                {item.body}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-slate-600 dark:text-white/60">
          Não oferecemos montagem, desmontagem nem embalagem — foco em transporte e fretes.
        </p>
      </div>
    </motion.section>
  );
}
