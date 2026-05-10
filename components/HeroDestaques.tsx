"use client";

import { motion } from "framer-motion";
import { MapPin, SendHorizontal, ShieldCheck } from "lucide-react";

const DESTAQUES = [
  {
    icon: ShieldCheck,
    title: "Confiança e Registro",
    body: "Operação formalizada com CNPJ e foco total na segurança.",
  },
  {
    icon: MapPin,
    title: "Conexão Nordeste",
    body: "Líderes em fretes de Maceió para todo o Brasil.",
  },
  {
    icon: SendHorizontal,
    title: "Cotação Expressa",
    body: "Detalhes direto para nossa equipe via WhatsApp.",
  },
] as const;

export function HeroDestaques() {
  return (
    <section
      className="scroll-mt-20 px-4 pb-16 pt-4 sm:px-6 sm:pb-20"
      aria-labelledby="destaques-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2 id="destaques-heading" className="sr-only">
          Destaques
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {DESTAQUES.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-48px" }}
              transition={{
                duration: 0.45,
                delay: index * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="glass-panel flex gap-3 p-5"
            >
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-[#1a2b4b] dark:text-sky-400" aria-hidden />
              <div>
                <p className="font-semibold text-[#1a2b4b] dark:text-[#f8fafc]">
                  {item.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[#1a2b4b]/80 dark:text-[#f8fafc]/75">
                  {item.body}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
