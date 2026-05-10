import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#1a2b4b",
        },
        design: {
          light: "#c5d9ed",
          dark: "#0f172a",
          ink: "#1a2b4b",
          snow: "#f8fafc",
          accent: "#38bdf8",
        },
      },
      keyframes: {
        "scroll-marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        /* Mantido para eventual uso; galeria usa rolagem JS + loop. */
        "scroll-marquee": "scroll-marquee 120s linear infinite",
      },
      boxShadow: {
        "brand-soft":
          "0 12px 40px rgba(21, 43, 77, 0.18), 0 0 1px rgba(21, 43, 77, 0.08)",
        "brand-soft-dark": "0 12px 40px rgba(0, 0, 0, 0.35)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
