"use client";

import { motion } from "framer-motion";

const sectionReveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 },
} as const;

export function About() {
  return (
    <motion.section
      id="sobre"
      className="scroll-mt-24 px-4 py-20 sm:px-6"
      aria-labelledby="sobre-heading"
      {...sectionReveal}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-[#f8fafc]/70">
              Quem somos
            </p>
            <h2
              id="sobre-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-[#1a2b4b] dark:text-[#f8fafc] sm:text-4xl"
            >
              Marcelo Luz Transportes
            </h2>
            <p className="mt-6 leading-relaxed text-slate-700 dark:text-[#f8fafc]/85">
              A Marcelo Transportes é uma empresa dedicada a oferecer soluções de
              transporte rodoviário eficientes e seguras. Fundada em 2022, nossa
              trajetória é marcada pelo compromisso em conectar cidades e
              estados, com um foco especial em transportes intermunicipais e
              interestaduais. Com sede em Maceió, Alagoas, a Marcelo Transportes
              se destaca pela sua atuação robusta na região, realizando entregas
              e mudanças com agilidade e confiabilidade. Compreendemos a
              importância de cada carga e de cada mudança, e é por isso que
              investimos em uma logística otimizada para garantir que seus bens
              cheguem ao destino com total integridade e dentro do prazo.
            </p>
            <p className="mt-4 text-sm text-slate-600 dark:text-[#f8fafc]/65">
              CNPJ{" "}
              <span className="font-medium text-[#1a2b4b] dark:text-[#f8fafc]">
                44.971.020/0001-85
              </span>
              {" · "}
              Desde 2022
            </p>
          </div>

          <aside className="glass-panel p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-[#1a2b4b] dark:text-[#f8fafc]">
              Nosso Objetivo
            </h3>
            <p className="mt-4 leading-relaxed text-slate-700 dark:text-[#f8fafc]/85">
              Ser a parceira ideal para suas necessidades de transporte,
              oferecendo um serviço que combine excelência, segurança e
              pontualidade. Buscamos expandir nossa atuação, solidificando nossa
              presença como referência em transporte de cargas e mudanças em
              nível intermunicipal e interestadual. Queremos construir
              relacionamentos duradouros baseados na confiança e na qualidade dos
              nossos serviços.
            </p>
          </aside>
        </div>
      </div>
    </motion.section>
  );
}
