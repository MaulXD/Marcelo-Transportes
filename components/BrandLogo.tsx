type BrandLogoProps = {
  /** Alinhamento da pilha ícone + texto (header geralmente centralizado na coluna da logo). */
  align?: "center" | "start";
  className?: string;
};

/**
 * Logo oficial: ícone (PNG tema claro/escuro) + texto MARCELO LUZ TRANSPORTES empilhados.
 */
export function BrandLogo({
  align = "center",
  className = "",
}: BrandLogoProps) {
  const itemsAlign = align === "start" ? "items-start" : "items-center";
  const textAlign = align === "start" ? "text-left" : "text-center";

  const logoBox =
    "relative mb-0.5 h-14 w-[7.25rem] shrink-0 md:h-16 md:w-[8.25rem]";

  return (
    <div className={`flex flex-col ${itemsAlign} gap-0.5 ${className}`}>
      <div className={`relative ${logoBox}`}>
        <img
          src="/MT-LOGO-ESCURA.png"
          alt="Marcelo Luz Transportes"
          className="absolute inset-0 h-full w-full object-contain opacity-100 transition-opacity duration-500 dark:opacity-0"
          width={132}
          height={72}
        />
        <img
          src="/MT-LOGO-BRANCA.png"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-500 dark:opacity-100"
          width={132}
          height={72}
        />
      </div>
      <span
        className={`max-w-[16rem] text-[9px] font-extrabold uppercase leading-tight tracking-[0.14em] text-[#1a2b4b] transition-colors duration-500 dark:text-[#f8fafc] sm:text-[10px] md:text-[11px] ${textAlign}`}
      >
        MARCELO LUZ TRANSPORTES
      </span>
    </div>
  );
}
