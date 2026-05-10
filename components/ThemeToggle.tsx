"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <span
        className="inline-flex h-7 w-7 shrink-0 rounded-md border border-slate-200/80 bg-white/60 dark:border-amber-500/35 dark:bg-slate-900/60"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-200/80 bg-white/80 text-[#1a2b4b] shadow-sm backdrop-blur-sm transition hover:bg-white dark:border-amber-500/40 dark:bg-slate-900/85 dark:text-amber-300 dark:shadow-[0_0_0_1px_rgba(251,191,36,0.15)] dark:hover:border-amber-400/55 dark:hover:bg-slate-800/90"
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {isDark ? (
        <Sun className="h-3.5 w-3.5 text-amber-400" aria-hidden strokeWidth={2.25} />
      ) : (
        <Moon className="h-3.5 w-3.5 text-[#1a2b4b]" aria-hidden />
      )}
    </button>
  );
}
