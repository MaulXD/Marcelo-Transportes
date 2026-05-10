"use client";

import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import {
  WHATSAPP_FAB_PRESET_MESSAGE,
  WHATSAPP_PRIMARY_DIGITS,
} from "@/lib/whatsapp";

export function WhatsAppFAB() {
  const href = `https://wa.me/${WHATSAPP_PRIMARY_DIGITS}?text=${encodeURIComponent(WHATSAPP_FAB_PRESET_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md ring-1 ring-black/10 transition-transform duration-300 hover:scale-105 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 md:bottom-7 md:right-7 md:h-14 md:w-14"
      aria-label="Abrir WhatsApp para cotação"
    >
      <WhatsAppIcon className="h-7 w-7 md:h-8 md:w-8" />
    </a>
  );
}
