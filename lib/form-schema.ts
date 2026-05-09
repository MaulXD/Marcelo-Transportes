import { z } from "zod";
import { andarDoApartamento } from "@/lib/apartamento";
import { formatCepDisplay, onlyDigits } from "@/lib/masks";

export const accessEnum = z.enum(["casa", "ap_escada", "ap_elevador"]);
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
  numeroOrigem: z.string().min(1, "Informe o número"),
  complementoOrigem: z.string().optional(),
  acessoOrigem: accessSelectionSchema,
  numeroApartamentoOrigem: z.string().optional(),
  elevadorServicoOrigem: z.boolean(),
  cepDestino: cepField,
  logradouroDestino: z.string().min(2, "Informe o logradouro"),
  bairroDestino: z.string().min(2, "Informe o bairro"),
  cidadeDestino: z.string().min(2, "Informe a cidade"),
  ufDestino: z.string().max(2),
  numeroDestino: z.string().min(1, "Informe o número"),
  complementoDestino: z.string().optional(),
  acessoDestino: accessSelectionSchema,
  numeroApartamentoDestino: z.string().optional(),
  elevadorServicoDestino: z.boolean(),
};

export const step1Schema = z.object(addressSide).superRefine((data, ctx) => {
  if (data.acessoOrigem === "") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Selecione como é o acesso na origem",
      path: ["acessoOrigem"],
    });
  }
  if (data.acessoDestino === "") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Selecione como é o acesso no destino",
      path: ["acessoDestino"],
    });
  }
  if (data.acessoOrigem !== "" && data.acessoOrigem !== "casa") {
    const apt = data.numeroApartamentoOrigem?.trim() ?? "";
    if (!apt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o número do apartamento",
        path: ["numeroApartamentoOrigem"],
      });
    }
  }
  if (data.acessoDestino !== "" && data.acessoDestino !== "casa") {
    const apt = data.numeroApartamentoDestino?.trim() ?? "";
    if (!apt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o número do apartamento",
        path: ["numeroApartamentoDestino"],
      });
    }
  }
});

export const step2Schema = z.object({
  tamanhoMudanca: tamanhoEnum,
});

export const formSchema = z
  .object({
    ...addressSide,
    tamanhoMudanca: tamanhoEnum,
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
        message: "Selecione como é o acesso na origem",
        path: ["acessoOrigem"],
      });
    }
    if (data.acessoDestino === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione como é o acesso no destino",
        path: ["acessoDestino"],
      });
    }
    if (data.acessoOrigem !== "" && data.acessoOrigem !== "casa") {
      const apt = data.numeroApartamentoOrigem?.trim() ?? "";
      if (!apt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe o número do apartamento",
          path: ["numeroApartamentoOrigem"],
        });
      }
    }
    if (data.acessoDestino !== "" && data.acessoDestino !== "casa") {
      const apt = data.numeroApartamentoDestino?.trim() ?? "";
      if (!apt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe o número do apartamento",
          path: ["numeroApartamentoDestino"],
        });
      }
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
    case "ap_escada":
      return "Apartamento com escada";
    case "ap_elevador":
      return "Apartamento com elevador";
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
  return `${logradouro.trim()}, ${numero.trim()}${comp ? `, ${comp}` : ""} — ${bairro.trim()}, ${tail}. CEP ${formatCepDisplay(cep)}`;
}

export function formatAcessoDetalhado(
  access: AccessType,
  numeroApartamento: string,
  elevadorServico: boolean
): string {
  if (access === "casa") return accessLabelForMessage(access);
  const andar = andarDoApartamento(numeroApartamento);
  const base = `${accessLabelForMessage(access)} (${andar}`;
  if (access === "ap_escada") return `${base})`;
  return `${base} — Elevador de serviço: ${elevadorServico ? "Sim" : "Não"})`;
}

export function tamanhoHuman(value: TamanhoMudanca): string {
  switch (value) {
    case "pequena":
      return "pequena (móveis soltos)";
    case "residencia_completa":
      return "residência completa";
    case "escritorio":
      return "escritório/empresa";
    default:
      return value;
  }
}

export function buildWhatsAppMessage(values: QuoteFormValues): string {
  const nomeOuEmpresa =
    values.tipoCliente === "pf"
      ? values.nomeCompleto!.trim()
      : values.nomeEmpresa!.trim();

  const origemEnd = formatEnderecoCompleto(
    values.logradouroOrigem,
    values.numeroOrigem,
    values.complementoOrigem,
    values.bairroOrigem,
    values.cidadeOrigem,
    values.ufOrigem ?? "",
    values.cepOrigem
  );
  const destinoEnd = formatEnderecoCompleto(
    values.logradouroDestino,
    values.numeroDestino,
    values.complementoDestino,
    values.bairroDestino,
    values.cidadeDestino,
    values.ufDestino ?? "",
    values.cepDestino
  );

  const origemAcesso = formatAcessoDetalhado(
    values.acessoOrigem as AccessType,
    values.numeroApartamentoOrigem ?? "",
    values.elevadorServicoOrigem
  );
  const destinoAcesso = formatAcessoDetalhado(
    values.acessoDestino as AccessType,
    values.numeroApartamentoDestino ?? "",
    values.elevadorServicoDestino
  );

  return `Olá! Meu nome é ${nomeOuEmpresa}. Preciso de uma mudança ${tamanhoHuman(values.tamanhoMudanca)} para o dia ${values.dataMudanca}.

📍 ORIGEM: ${origemEnd} — Acesso: ${origemAcesso}.
📍 DESTINO: ${destinoEnd} — Acesso: ${destinoAcesso}.

Pode me passar um orçamento?`;
}
