"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";

const PHOTOS = [
  {
    src: "/galeria/foto1.webp",
    alt: "Equipe Marcelo Luz Transportes realizando mudança em Maceió",
  },
  {
    src: "/galeria/foto2.webp",
    alt: "Caminhão de mudanças da Marcelo Luz Transportes no Nordeste",
  },
  {
    src: "/galeria/foto3.webp",
    alt: "Transporte de móveis e cargas com segurança em Alagoas",
  },
  {
    src: "/galeria/foto4.webp",
    alt: "Frota de transporte para fretes intermunicipais e interestaduais",
  },
  {
    src: "/galeria/foto5.webp",
    alt: "Serviço de mudança residencial e comercial Marcelo Luz Transportes",
  },
] as const;

/** Loop duplicado para rolagem contínua sem salto visual. */
const LOOP = [...PHOTOS, ...PHOTOS];

export function Gallery() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const pointerStartXRef = useRef(0);
  const scrollStartLeftRef = useRef(0);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [scrollerReady, setScrollerReady] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const setScrollerRef = useCallback((node: HTMLDivElement | null) => {
    scrollerRef.current = node;
    setScrollerReady(!!node);
  }, []);

  const pauseAuto = useCallback((ms: number) => {
    setPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setPaused(false);
      pauseTimerRef.current = null;
    }, ms);
  }, []);

  const startDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const el = scrollerRef.current;
      if (!el) return;

      pauseAuto(10000);
      setDragActive(true);
      isDraggingRef.current = true;
      pointerStartXRef.current = event.clientX;
      scrollStartLeftRef.current = el.scrollLeft;
      el.setPointerCapture(event.pointerId);
    },
    [pauseAuto]
  );

  const moveDrag = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const el = scrollerRef.current;
    if (!el) return;

    const delta = event.clientX - pointerStartXRef.current;
    el.scrollLeft = scrollStartLeftRef.current - delta;
  }, []);

  const endDrag = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const el = scrollerRef.current;
    if (el) {
      el.releasePointerCapture(event.pointerId);
    }

    isDraggingRef.current = false;
    setDragActive(false);
  }, []);

  const cancelDrag = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setDragActive(false);
  }, []);

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  const getStep = useCallback(() => {
    const root = scrollerRef.current;
    const slide = root?.querySelector<HTMLElement>("[data-slide]");
    if (!slide) return 296;
    const gap =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 640px)").matches
        ? 16
        : 12;
    return slide.offsetWidth + gap;
  }, []);

  const scrollByDir = useCallback(
    (dir: -1 | 1) => {
      const el = scrollerRef.current;
      if (!el) return;
      const step = getStep();
      pauseAuto(8000);
      el.scrollBy({ left: dir * step, behavior: "smooth" });
    },
    [getStep, pauseAuto]
  );

  /** Rolagem automática + loop; depende de scrollerReady porque o ref só existe após o mount. */
  useEffect(() => {
    if (!scrollerReady || reduceMotion || paused) return;
    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;
    const speed = 0.38;

    const tick = () => {
      const current = scrollerRef.current;
      if (!current) return;
      current.scrollLeft += speed;
      const half = current.scrollWidth / 2;
      if (half > 10 && current.scrollLeft >= half - 2) {
        current.scrollLeft -= half;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollerReady, reduceMotion, paused]);

  return (
    <motion.section
      id="galeria"
      initial={{ opacity: 0, y: 24, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-24 w-full py-10 sm:py-14"
      aria-labelledby="galeria-heading"
    >
      <h2 id="galeria-heading" className="sr-only">
        Galeria
      </h2>

      <div className="relative mx-auto max-w-[100vw] px-2 sm:px-3 md:px-4">
        <button
          type="button"
          onClick={() => scrollByDir(-1)}
          className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300/80 bg-white/95 text-[#1a2b4b] shadow-md backdrop-blur-sm transition hover:bg-white dark:border-white/15 dark:bg-[#0f172a]/95 dark:text-[#f8fafc] md:h-11 md:w-11"
          aria-label="Imagem anterior"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </button>
        <button
          type="button"
          onClick={() => scrollByDir(1)}
          className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300/80 bg-white/95 text-[#1a2b4b] shadow-md backdrop-blur-sm transition hover:bg-white dark:border-white/15 dark:bg-[#0f172a]/95 dark:text-[#f8fafc] md:h-11 md:w-11"
          aria-label="Próxima imagem"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </button>

        <div
          ref={setScrollerRef}
          className={`-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-9 pb-2 pt-1 sm:gap-4 sm:px-10 md:px-11 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${dragActive ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ touchAction: "pan-x" }}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={cancelDrag}
          onMouseEnter={() => {
            if (pauseTimerRef.current) {
              clearTimeout(pauseTimerRef.current);
              pauseTimerRef.current = null;
            }
            setPaused(true);
          }}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => pauseAuto(10000)}
          onWheel={() => pauseAuto(6000)}
        >
          {LOOP.map((photo, i) => (
            <div
              key={`${photo.src}-${i}`}
              data-slide
              className="relative aspect-square w-[min(72vw,260px)] shrink-0 snap-center overflow-hidden rounded-xl border border-white/15 shadow-lg sm:w-72 md:w-80"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 72vw, 320px"
                className="object-cover transition-transform duration-500 hover:scale-105"
                draggable={false}
                priority={i < 2}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
