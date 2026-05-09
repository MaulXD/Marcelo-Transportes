/** Regra do briefing: ≤99 → Térreo; senão centena = andar (104 → 1º andar). */
export function andarDoApartamento(numeroApartamento: string): string {
  const digits = numeroApartamento.replace(/\D/g, "");
  if (!digits) return "";
  const n = parseInt(digits, 10);
  if (Number.isNaN(n)) return "";
  if (n <= 99) return "Térreo";
  const floor = Math.floor(n / 100);
  return `${floor}º andar`;
}
