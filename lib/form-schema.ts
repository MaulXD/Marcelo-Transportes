import { z } from "zod";
import { andarDoApartamento } from "@/lib/apartamento";
import { formatCepDisplay, onlyDigits } from "@/lib/masks";

export const accessEnum = z.enum(["casa", "ap"]);
export type AccessType = z.infer<typeof accessEnum>;
/** Estado inicial do formulário antes da escolha do usuário (progressive disclosure). */
export type AccessSelection = "" | AccessType;

export const accessSelectionSchema = z.union([
  z.literal(""),
  accessEnum,
]);

export const tamanhoEnum = z.enum([
  "pequena",
  "residencia_completa",
  "escritorio",
]);
export type TamanhoMudanca = z.infer<typeof tamanhoEnum>;

const cepField = z
  .string()
  .min(1, "Informe o CEP")
  .refine((s) => onlyDigits(s).length === 8, "CEP deve ter 8 dígitos");

const addressSide = {
  cepOrigem: cepField,
  logradouroOrigem: z.string().min(2, "Informe o logradouro"),
  bairroOrigem: z.string().min(2, "Informe o bairro"),
  cidadeOrigem: z.string().min(2, "Informe a cidade"),
  ufOrigem: z.string().max(2),
  numeroOrigem: z.string(),
  numeroOrigemSemNumero: z.boolean(),
  complementoOrigem: z.string().optional(),
  acessoOrigem: accessSelectionSchema,
  elevadorServicoOrigem: z.boolean(),
  cepDestino: cepField,
  logradouroDestino: z.string().min(2, "Informe o logradouro"),
  bairroDestino: z.string().min(2, "Informe o bairro"),
  cidadeDestino: z.string().min(2, "Informe a cidade"),
  ufDestino: z.string().max(2),
  numeroDestino: z.string(),
  numeroDestinoSemNumero: z.boolean(),
  complementoDestino: z.string().optional(),
  acessoDestino: accessSelectionSchema,
  elevadorServicoDestino: z.boolean(),
};

export const step1Schema = z.object(addressSide).superRefine((data, ctx) => {
  if (data.acessoOrigem === "") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Selecione o tipo de acesso na origem",
      path: ["acessoOrigem"],
    });
  }
  if (data.acessoDestino === "") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Selecione o tipo de acesso no destino",
      path: ["acessoDestino"],
    });
  }
  if (!data.numeroOrigemSemNumero && data.numeroOrigem.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Informe o número",
      path: ["numeroOrigem"],
    });
  }
  if (!data.numeroDestinoSemNumero && data.numeroDestino.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Informe o número",
      path: ["numeroDestino"],
    });
  }
});

export const step2Schema = z.object({
  tamanhoMudanca: tamanhoEnum,
  observacao: z.string().optional(),
});

export const formSchema = z
  .object({
    ...addressSide,
    tamanhoMudanca: tamanhoEnum,
    observacao: z.string().optional(),
    tipoCliente: z.enum(["pf", "pj"]),
    nomeCompleto: z.string().optional(),
    nomeEmpresa: z.string().optional(),
    cnpj: z.string().optional(),
    whatsapp: z
      .string()
      .refine((s) => onlyDigits(s).length >= 10, "Informe um WhatsApp válido"),
    dataMudanca: z.string().min(1, "Escolha a data da mudança"),
  })
  .superRefine((data, ctx) => {
    if (data.acessoOrigem === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione o tipo de acesso na origem",
        path: ["acessoOrigem"],
      });
    }
    if (data.acessoDestino === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione o tipo de acesso no destino",
        path: ["acessoDestino"],
      });
    }
    if (!data.numeroOrigemSemNumero && data.numeroOrigem.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o número",
        path: ["numeroOrigem"],
      });
    }
    if (!data.numeroDestinoSemNumero && data.numeroDestino.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o número",
        path: ["numeroDestino"],
      });
    }
    if (data.tipoCliente === "pf") {
      if (!data.nomeCompleto?.trim() || data.nomeCompleto.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe seu nome completo",
          path: ["nomeCompleto"],
        });
      }
    }
    if (data.tipoCliente === "pj") {
      if (!data.nomeEmpresa?.trim() || data.nomeEmpresa.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe o nome da empresa",
          path: ["nomeEmpresa"],
        });
      }
      const digits = onlyDigits(data.cnpj ?? "");
      if (digits.length !== 14) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CNPJ inválido",
          path: ["cnpj"],
        });
      }
    }
  });

export type QuoteFormValues = z.infer<typeof formSchema>;

export function accessLabelForMessage(access: AccessType): string {
  switch (access) {
    case "casa":
      return "Casa";
    case "ap":
      return "Apartamento";
    default:
      return access;
  }
}

export function formatEnderecoCompleto(
  logradouro: string,
  numero: string,
  complemento: string | undefined,
  bairro: string,
  cidade: string,
  uf: string,
  cep: string
): string {
  const comp = complemento?.trim();
  const ufTxt = uf?.trim();
  const tail = ufTxt ? `${cidade}/${ufTxt}` : cidade;
  return `${logradouro.trim()}, ${numero.trim()}${comp ? `, ${comp}` : ""}. ${bairro.trim()}, ${tail}. CEP ${formatCepDisplay(cep)}`;
}

export function formatAcessoDetalhado(
  access: AccessType,
  elevadorServico: boolean
): string {
  if (access === "casa") return accessLabelForMessage(access);
  const elevEmoji = elevadorServico ? "✅" : "❌";
  return `${accessLabelForMessage(access)} (Elevador: ${elevEmoji})`;
}

export function tamanhoHuman(value: TamanhoMudanca): string {
  switch (value) {
    case "pequena":
      return "pequena, móveis soltos";
    case "residencia_completa":
      return "residência completa";
    case "escritorio":
      return "escritório ou empresa";
    default:
      return value;
  }
}

function emojiImovel(access: AccessType): string {
  return access === "casa" ? "🏠" : "🏢";
}

export function buildWhatsAppMessage(values: QuoteFormValues): string {
  const nomeOuEmpresa =
    values.tipoCliente === "pf"
      ? values.nomeCompleto!.trim()
      : values.nomeEmpresa!.trim();

  const oA = values.acessoOrigem as AccessType;
  const dA = values.acessoDestino as AccessType;

  const origemNumero = values.numeroOrigemSemNumero ? "S/N" : values.numeroOrigem;
  const destinoNumero = values.numeroDestinoSemNumero ? "S/N" : values.numeroDestino;

  const origemEnd = formatEnderecoCompleto(
    values.logradouroOrigem,
    origemNumero,
    values.complementoOrigem,
    values.bairroOrigem,
    values.cidadeOrigem,
    values.ufOrigem ?? "",
    values.cepOrigem
  );
  const destinoEnd = formatEnderecoCompleto(
    values.logradouroDestino,
    destinoNumero,
    values.complementoDestino,
    values.bairroDestino,
    values.cidadeDestino,
    values.ufDestino ?? "",
    values.cepDestino
  );

  const observacao = values.observacao?.trim();

  const origemAcesso = formatAcessoDetalhado(
    oA,
    values.elevadorServicoOrigem
  );
  const destinoAcesso = formatAcessoDetalhado(
    dA,
    values.elevadorServicoDestino
  );

  const pjExtra =
    values.tipoCliente === "pj" && values.cnpj?.trim()
      ? `*CNPJ:* ${values.cnpj.trim()}\n`
      : "";

  return `Olá!

*Orçamento Marcelo Luz Transportes*

*Nome / empresa:* ${nomeOuEmpresa}
*Tipo de cliente:* ${values.tipoCliente === "pf" ? "Pessoa física" : "Pessoa jurídica"}
${pjExtra}*Porte da mudança:* ${tamanhoHuman(values.tamanhoMudanca)}
*Data da mudança:* ${values.dataMudanca}
*Meu WhatsApp:* ${values.whatsapp.trim()}

*Origem*
${emojiImovel(oA)} ${origemAcesso}
*Endereço:* ${origemEnd}

*Destino*
${emojiImovel(dA)} ${destinoAcesso}
*Endereço:* ${destinoEnd}
${observacao ? `\n*Observações:* ${observacao}` : ""}

Gostaria de receber um orçamento. Obrigado!`;
}
