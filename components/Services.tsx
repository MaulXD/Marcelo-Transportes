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
import type { LucideIcon } from "lucide-react";

const ITEMS: {
  icon: LucideIcon;
  title: string;
  body: string;
  iconClass: string;
}[] = [
  {
    icon: Home,
    title: "Mudanças Residenciais",
    body: "Transporte seguro e entrega no novo endereço. Sem estresse, com toda a atenção que seus bens merecem.",
    iconClass: "text-amber-500",
  },
  {
    icon: Building2,
    title: "Mudanças Comerciais e Corporativas",
    body: "Planejamento logístico, mobiliário e equipamentos para sua empresa, reduzindo tempo parado na mudança.",
    iconClass: "text-blue-600",
  },
  {
    icon: Package,
    title: "Pequenos Fretes e Carretos",
    body: "Fretes rápidos para volumes menores, dia a dia ou urgências.",
    iconClass: "text-violet-600",
  },
  {
    icon: Boxes,
    title: "Transporte de Cargas e Encomendas",
    body: "Cargas gerais com foco em segurança e fluxo de entregas e recebimentos.",
    iconClass: "text-cyan-600",
  },
  {
    icon: Car,
    title: "Transporte de Veículos",
    body: "Opções seguras e confiáveis para transportar carros, motos ou frotas para qualquer lugar do Brasil.",
    iconClass: "text-orange-600",
  },
  {
    icon: ShieldPlus,
    title: "Serviços Complementares",
    body: "Guarda móveis, seguro de transporte e içamento. Experiência mais completa quando você precisar.",
    iconClass: "text-sky-600",
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
        <p className="text-sm font-semibold uppercase tracking-wider text-[#1a2b4b]/70 dark:text-[#f8fafc]/70">
          O que fazemos
        </p>
        <h2
          id="servicos-heading"
          className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-[#1a2b4b] dark:text-[#f8fafc] sm:text-4xl"
        >
          Soluções em transporte e mudanças
        </h2>
        <p className="mt-6 max-w-3xl leading-relaxed text-[#1a2b4b]/90 dark:text-[#f8fafc]/85">
          Vai mudar de endereço, precisa transportar equipamentos ou otimizar a
          logística da sua empresa? Encontre aqui as melhores soluções em
          transporte e mudanças para pessoa física e jurídica!
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item) => (
            <article
              key={item.title}
              className="glass-panel group relative overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-2 hover:border-sky-400/30 hover:shadow-brand-soft dark:hover:border-sky-400/25 dark:hover:shadow-brand-soft-dark"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-400/10 blur-2xl transition group-hover:bg-sky-400/15 dark:bg-white/5 dark:group-hover:bg-white/10" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-inner ring-1 ring-slate-200/80 dark:bg-[#1e293b] dark:ring-white/10">
                <item.icon
                  className={`h-6 w-6 ${item.iconClass}`}
                  aria-hidden
                />
              </div>
              <h3 className="relative mt-5 text-lg font-semibold text-[#1a2b4b] dark:text-[#f8fafc]">
                {item.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-[#1a2b4b]/80 dark:text-[#f8fafc]/80">
                {item.body}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-[#1a2b4b]/65 dark:text-[#f8fafc]/55">
          Não oferecemos montagem, desmontagem nem embalagem. Foco em transporte e fretes.
        </p>
      </div>
    </motion.section>
  );
}
