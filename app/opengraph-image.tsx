import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Marcelo Luz Transportes — Mudanças no Nordeste";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background:
            "linear-gradient(145deg, #0a1628 0%, #152B4D 42%, #0f172a 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #1e3a5f, #152B4D)",
              boxShadow: "0 0 36px rgba(21,43,77,0.55)",
            }}
          />
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#f1f5f9",
              letterSpacing: -0.5,
            }}
          >
            Marcelo Luz Transportes
          </span>
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#f8fafc",
            lineHeight: 1.1,
            maxWidth: 900,
            letterSpacing: -1,
          }}
        >
          Mudanças de Maceió para todo o Nordeste
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            color: "#94a3b8",
            maxWidth: 780,
            lineHeight: 1.35,
          }}
        >
          Frota própria · Segurança · Atendimento que resolve — CNPJ 44.971.020/0001-85
        </div>
        <div
          style={{
            marginTop: 48,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              padding: "14px 28px",
              borderRadius: 999,
              background: "rgba(21,43,77,0.35)",
              color: "#e2e8f0",
              fontSize: 22,
              fontWeight: 600,
              border: "1px solid rgba(148,163,184,0.35)",
            }}
          >
            Peça seu orçamento pelo site
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
