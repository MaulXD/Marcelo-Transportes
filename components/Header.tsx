"use client";



import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

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

  const [navOverflows, setNavOverflows] = useState(false);



  const shellRef = useRef<HTMLDivElement>(null);

  const logoRef = useRef<HTMLAnchorElement>(null);

  const ghostNavRef = useRef<HTMLDivElement>(null);

  const measureRightRef = useRef<HTMLDivElement>(null);



  const measureOverflow = useCallback(() => {

    const shell = shellRef.current;

    const logo = logoRef.current;

    const ghost = ghostNavRef.current;

    const right = measureRightRef.current;

    if (!shell || !logo || !ghost || !right) return;



    const slack =

      shell.clientWidth < 640 ? 36 : shell.clientWidth < 1024 ? 44 : 52;



    const needed =

      logo.offsetWidth +

      ghost.scrollWidth +

      right.offsetWidth +

      slack;



    setNavOverflows(needed > shell.clientWidth);

  }, []);



  useLayoutEffect(() => {

    measureOverflow();

    const shell = shellRef.current;

    if (!shell) return;

    const ro = new ResizeObserver(measureOverflow);

    ro.observe(shell);

    window.addEventListener("resize", measureOverflow);

    return () => {

      ro.disconnect();

      window.removeEventListener("resize", measureOverflow);

    };

  }, [measureOverflow]);



  useEffect(() => {

    if (!open) return;

    const prev = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {

      document.body.style.overflow = prev;

    };

  }, [open]);



  useEffect(() => {

    if (!open) return;

    const onKey = (e: KeyboardEvent) => {

      if (e.key === "Escape") setOpen(false);

    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);

  }, [open]);



  useEffect(() => {

    if (!navOverflows) setOpen(false);

  }, [navOverflows]);



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

    <>

      {/* Larguras invisíveis: mesmo texto/links que o layout desktop para medir overflow real */}

      <div

        ref={ghostNavRef}

        className="pointer-events-none fixed left-[-9999px] top-0 z-[-1] flex items-center gap-4 2xl:gap-6"

        aria-hidden

      >

        {NAV.map((item) => (

          <span key={item.id} className={`${navLinkBase} whitespace-nowrap`}>

            {item.label}

          </span>

        ))}

      </div>

      <div

        ref={measureRightRef}

        className="pointer-events-none fixed left-[-9999px] top-0 z-[-1] flex items-center gap-2"

        aria-hidden

      >

        <span className="inline-flex h-7 w-7 shrink-0 rounded-md border border-slate-200/80 bg-white/80 dark:border-amber-500/35 dark:bg-slate-900/60" />

        <span className="cta-solid inline-flex rounded-full px-4 py-2.5 text-sm whitespace-nowrap">

          Pedir orçamento

        </span>

      </div>



      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-400/30 bg-white/90 shadow-sm backdrop-blur-lg transition-colors duration-500 dark:border-white/10 dark:bg-[#0f172a]/95 dark:shadow-none">

        <div

          ref={shellRef}

          className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-4 sm:gap-4 sm:px-5 sm:py-5 md:gap-5 md:px-6"

        >

          <a

            ref={logoRef}

            href="#inicio"

            className="min-w-0 flex-shrink-0 transition-opacity hover:opacity-90"

            onClick={() => setOpen(false)}

          >

            <BrandLogo align="center" className="w-fit max-w-[min(100%,13rem)] sm:max-w-none" />

          </a>



          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3 md:gap-4 lg:gap-5">

            <nav

              className={`min-w-0 items-center gap-3 sm:gap-4 2xl:gap-6 ${

                navOverflows ? "hidden" : "flex"

              }`}

              aria-label="Seções principais"

            >

              {NAV.map((item) => (

                <a

                  key={item.id}

                  href={`#${item.id}`}

                  className={`${navLinkBase} whitespace-nowrap ${

                    active === item.id

                      ? "bg-[#1a2b4b]/10 text-[#1a2b4b] ring-1 ring-[#1a2b4b]/25 dark:bg-sky-500/15 dark:text-[#f8fafc] dark:ring-sky-400/35"

                      : "text-[#1a2b4b]/85 hover:text-[#1a2b4b] dark:text-[#f8fafc]/75 dark:hover:text-[#f8fafc]"

                  }`}

                >

                  {item.label}

                </a>

              ))}

            </nav>



            <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">

              <ThemeToggle />

              <a

                href="#orcamento"

                className={`cta-solid rounded-full px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm ${

                  navOverflows ? "hidden" : "inline-flex"

                }`}

              >

                Pedir orçamento

              </a>

              <button

                type="button"

                className={`inline-flex rounded-lg border border-slate-300/90 bg-white/90 p-2 text-[#1a2b4b] dark:border-white/15 dark:bg-white/10 dark:text-[#f8fafc] ${

                  navOverflows ? "inline-flex" : "hidden"

                }`}

                aria-expanded={open}

                aria-label={open ? "Fechar menu" : "Abrir menu"}

                onClick={() => setOpen((v) => !v)}

              >

                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}

              </button>

            </div>

          </div>

        </div>

      </header>



      {open && navOverflows ? (

        <>

          <button

            type="button"

            className="fixed inset-0 z-[45] bg-black/45 backdrop-blur-[2px]"

            aria-label="Fechar menu"

            onClick={() => setOpen(false)}

          />

          <aside

            className="fixed right-0 top-0 z-[60] flex h-[100dvh] w-[min(20rem,88vw)] flex-col border-l border-slate-200/90 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0f172a]"

            aria-modal="true"

            role="dialog"

            aria-labelledby="menu-lateral-titulo"

          >

            <div className="flex items-center justify-between gap-3 border-b border-slate-200/90 px-4 py-4 dark:border-white/10">

              <p

                id="menu-lateral-titulo"

                className="text-base font-semibold text-[#1a2b4b] dark:text-[#f8fafc]"

              >

                Menu

              </p>

              <button

                type="button"

                className="rounded-lg border border-slate-300/90 p-2 text-[#1a2b4b] dark:border-white/15 dark:text-[#f8fafc]"

                aria-label="Fechar menu"

                onClick={() => setOpen(false)}

              >

                <X className="h-5 w-5" />

              </button>

            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">

              {NAV.map((item) => (

                <a

                  key={item.id}

                  href={`#${item.id}`}

                  className={`rounded-xl px-3 py-3 text-sm font-medium ${

                    active === item.id

                      ? "bg-[#1a2b4b]/10 text-[#1a2b4b] dark:bg-sky-500/15 dark:text-white"

                      : "text-[#1a2b4b] dark:text-[#f8fafc]/90"

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

          </aside>

        </>

      ) : null}

    </>

  );

}


