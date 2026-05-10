"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Building2, Calendar, User } from "lucide-react";
import { useRef, useState } from "react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormGetValues,
  type UseFormRegister,
  type UseFormSetError,
  type UseFormSetValue,
  type UseFormWatch,
  useForm,
} from "react-hook-form";
import type { ZodError } from "zod";
import {
  buildWhatsAppMessage,
  formSchema,
  step1Schema,
  step2Schema,
  type QuoteFormValues,
} from "@/lib/form-schema";
import { WHATSAPP_PRIMARY_DIGITS } from "@/lib/whatsapp";
import { maskCep, maskCnpj, maskWhatsappBr, onlyDigits } from "@/lib/masks";
import { consultarCep } from "@/lib/viacep";
import { andarDoApartamento } from "@/lib/apartamento";

const STEPS = ["Logística", "Carga", "Seus dados"];

const KEYS_ORIGEM = {
  cep: "cepOrigem",
  logradouro: "logradouroOrigem",
  bairro: "bairroOrigem",
  cidade: "cidadeOrigem",
  uf: "ufOrigem",
  numero: "numeroOrigem",
  semNumero: "numeroOrigemSemNumero",
  complemento: "complementoOrigem",
  acesso: "acessoOrigem",
  apto: "numeroApartamentoOrigem",
  elevador: "elevadorServicoOrigem",
} as const satisfies Record<string, keyof QuoteFormValues>;

const KEYS_DESTINO = {
  cep: "cepDestino",
  logradouro: "logradouroDestino",
  bairro: "bairroDestino",
  cidade: "cidadeDestino",
  uf: "ufDestino",
  numero: "numeroDestino",
  semNumero: "numeroDestinoSemNumero",
  complemento: "complementoDestino",
  acesso: "acessoDestino",
  apto: "numeroApartamentoDestino",
  elevador: "elevadorServicoDestino",
} as const satisfies Record<string, keyof QuoteFormValues>;

function applyZodIssues(
  zodError: ZodError,
  setError: UseFormSetError<QuoteFormValues>
) {
  for (const issue of zodError.issues) {
    const key = issue.path[0];
    if (typeof key === "string") {
      setError(key as keyof QuoteFormValues & string, {
        type: "manual",
        message: issue.message,
      });
    }
  }
}

export function MultiStepForm() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cepOrigem: "",
      logradouroOrigem: "",
      bairroOrigem: "",
      cidadeOrigem: "",
      ufOrigem: "",
      numeroOrigem: "",
      numeroOrigemSemNumero: false,
      complementoOrigem: "",
      acessoOrigem: "",
      numeroApartamentoOrigem: "",
      elevadorServicoOrigem: false,
      cepDestino: "",
      logradouroDestino: "",
      bairroDestino: "",
      cidadeDestino: "",
      ufDestino: "",
      numeroDestino: "",
      numeroDestinoSemNumero: false,
      complementoDestino: "",
      acessoDestino: "",
      numeroApartamentoDestino: "",
      elevadorServicoDestino: false,
      tamanhoMudanca: "pequena",
      observacao: "",
      tipoCliente: "pf",
      nomeCompleto: "",
      nomeEmpresa: "",
      cnpj: "",
      whatsapp: "",
      dataMudanca: "",
    },
    mode: "onTouched",
  });

  const [step, setStep] = useState(0);
  const [cepBusyOrigem, setCepBusyOrigem] = useState(false);
  const [cepBusyDestino, setCepBusyDestino] = useState(false);

  const tipo = watch("tipoCliente");

  function goNext() {
    const values = getValues();
    if (step === 0) {
      const parsed = step1Schema.safeParse(values);
      if (!parsed.success) {
        applyZodIssues(parsed.error, setError);
        return;
      }
      clearErrors();
      setStep(1);
      return;
    }
    if (step === 1) {
      const parsed = step2Schema.safeParse(values);
      if (!parsed.success) {
        applyZodIssues(parsed.error, setError);
        return;
      }
      clearErrors();
      setStep(2);
    }
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  function getStepForError(key: string) {
    if (/^(cep|logradouro|bairro|cidade|uf|numero|complemento|acesso|numeroApartamento|elevadorServico)/.test(key)) {
      return 0;
    }
    if (key === "tamanhoMudanca") {
      return 1;
    }
    return 2;
  }

  function handleInvalid(invalidErrors: FieldErrors<QuoteFormValues>) {
    const keys = Object.keys(invalidErrors);
    if (keys.length === 0) return;
    setStep(getStepForError(keys[0]));
  }

  const onValid = (values: QuoteFormValues) => {
    const phone = (
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? WHATSAPP_PRIMARY_DIGITS
    ).replace(/\D/g, "");
    if (phone.length < 10) {
      alert(
        "Não foi possível abrir o WhatsApp neste momento. Use os números da seção Contato ou tente novamente mais tarde."
      );
      return;
    }

    const text = buildWhatsAppMessage(values);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="orcamento"
      className="scroll-mt-24 px-4 py-20 sm:px-6"
      aria-labelledby="orcamento-heading"
    >
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-[#1a2b4b]/90 dark:text-[#f8fafc]/75">
          Orçamento sem complicação
        </p>
        <h2
          id="orcamento-heading"
          className="mt-2 text-center text-3xl font-bold tracking-tight text-[#1a2b4b] sm:text-4xl dark:text-[#f8fafc]"
        >
          Monte seu pedido em três passos
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-[#1a2b4b]/90 dark:text-[#f8fafc]/85">
          Preencha os dados abaixo para receber um orçamento rápido e preciso
          diretamente no seu WhatsApp.
        </p>

        <div className="mt-10 glass-panel p-6 sm:p-8">
          <div className="mb-8 flex justify-center gap-2 sm:gap-4">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  aria-current={i === step ? "step" : undefined}
                  className="flex flex-col items-center gap-1 text-left focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                      i === step
                        ? "bg-[#1a2b4b] text-white shadow-brand-soft dark:bg-sky-500 dark:text-[#0f172a] dark:shadow-brand-soft-dark"
                        : i < step
                          ? "bg-[#1a2b4b]/15 text-[#1a2b4b] ring-1 ring-[#1a2b4b]/30 dark:bg-sky-500/20 dark:text-[#f8fafc] dark:ring-sky-400/45"
                          : "bg-slate-100 text-slate-500 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-400 dark:ring-white/10"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="hidden text-xs text-slate-500 sm:block dark:text-white/55">
                    {label}
                  </span>
                </button>
                {i < STEPS.length - 1 ? (
                  <div
                    className={`hidden h-px w-10 sm:block ${i < step ? "bg-[#1a2b4b]/35 dark:bg-sky-400/45" : "bg-slate-200 dark:bg-white/10"}`}
                  />
                ) : null}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onValid, handleInvalid)}>
            <AnimatePresence mode="wait">
              {step === 0 ? (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 28, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -24, scale: 0.96 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-10"
                >
                  <AddressBlock
                    title="Origem"
                    keys={KEYS_ORIGEM}
                    register={register}
                    control={control}
                    watch={watch}
                    getValues={getValues}
                    setValue={setValue}
                    errors={errors}
                    cepBusy={cepBusyOrigem}
                    setCepBusy={setCepBusyOrigem}
                  />
                  <AddressBlock
                    title="Destino"
                    keys={KEYS_DESTINO}
                    register={register}
                    control={control}
                    watch={watch}
                    getValues={getValues}
                    setValue={setValue}
                    errors={errors}
                    cepBusy={cepBusyDestino}
                    setCepBusy={setCepBusyDestino}
                  />
                </motion.div>
              ) : null}

              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 28, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -24, scale: 0.96 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  <p className="text-sm text-[#1a2b4b]/85 dark:text-[#f8fafc]/75">
                    Escolha o porte da mudança.
                  </p>
                  <Controller
                    name="tamanhoMudanca"
                    control={control}
                    render={({ field }) => (
                      <>
                        <div className="grid gap-4 sm:grid-cols-3">
                        {(
                          [
                            {
                              value: "pequena" as const,
                              title: "Pequena",
                              desc: "Móveis soltos e volumes menores.",
                            },
                            {
                              value: "residencia_completa" as const,
                              title: "Residência completa",
                              desc: "Mudança de casa ou apto completo.",
                            },
                            {
                              value: "escritorio" as const,
                              title: "Escritório ou empresa",
                              desc: "Mobiliário corporativo e operações B2B.",
                            },
                          ] as const
                        ).map((opt) => (
                          <motion.button
                            key={opt.value}
                            type="button"
                            onClick={() => field.onChange(opt.value)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 22 }}
                            className={`rounded-2xl border p-4 text-left transition ${
                              field.value === opt.value
                                ? "border-[#1a2b4b]/45 bg-[#1a2b4b]/[0.06] shadow-brand-soft ring-2 ring-[#1a2b4b]/25 dark:border-sky-400/40 dark:bg-sky-500/10 dark:shadow-brand-soft-dark dark:ring-sky-400/35"
                                : "border-slate-200/90 bg-white/60 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.05] dark:hover:border-white/25"
                            }`}
                          >
                            <p className="font-semibold text-[#1a2b4b] dark:text-[#f8fafc]">
                              {opt.title}
                            </p>
                            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-[#f8fafc]/55">
                              {opt.desc}
                            </p>
                          </motion.button>
                        ))}
                      </div>
                      <div>
                        <label className="mb-2 block text-base font-bold text-[#1a2b4b] md:text-lg dark:text-[#f8fafc]">
                          Observação (opcional)
                        </label>
                        <textarea
                          className="input-ring mt-1 w-full min-h-[120px] resize-none"
                          {...register("observacao")}
                        />
                      </div>
                    </>
                  )}
                  />
                  {errors.tamanhoMudanca ? (
                    <p className="text-sm text-red-600 dark:text-orange-400">
                      {errors.tamanhoMudanca.message}
                    </p>
                  ) : null}
                </motion.div>
              ) : null}

              {step === 2 ? (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 28, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -24, scale: 0.96 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6"
                >
                  <Controller
                    name="tipoCliente"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <p className="text-sm font-medium text-[#1a2b4b] dark:text-[#f8fafc]/85">
                          Tipo de cliente
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <motion.button
                            type="button"
                            onClick={() => field.onChange("pf")}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 22 }}
                            className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${
                              field.value === "pf"
                                ? "border-[#1a2b4b]/45 bg-[#1a2b4b]/10 text-[#1a2b4b] ring-1 ring-[#1a2b4b]/25 dark:border-sky-400/45 dark:bg-sky-500/15 dark:text-[#f8fafc] dark:ring-sky-400/35"
                                : "border-slate-200/90 bg-white/60 text-slate-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-[#f8fafc]/55"
                            }`}
                          >
                            <User className="h-4 w-4" />
                            Pessoa física
                          </motion.button>
                          <motion.button
                            type="button"
                            onClick={() => field.onChange("pj")}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 22 }}
                            className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${
                              field.value === "pj"
                                ? "border-[#1a2b4b]/45 bg-[#1a2b4b]/12 text-[#1a2b4b] ring-1 ring-[#1a2b4b]/25 dark:border-sky-400/45 dark:bg-sky-500/12 dark:text-[#f8fafc] dark:ring-sky-400/35"
                                : "border-slate-200/90 bg-white/60 text-slate-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-[#f8fafc]/55"
                            }`}
                          >
                            <Building2 className="h-4 w-4" />
                            Pessoa jurídica
                          </motion.button>
                        </div>
                      </div>
                    )}
                  />

                  {tipo === "pf" ? (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 380, damping: 26 }}
                    >
                      <label className="mb-2 block text-base font-bold text-[#1a2b4b] md:text-lg dark:text-[#f8fafc]">
                        Nome completo
                      </label>
                      <input
                        className="input-ring mt-1 w-full"
                        {...register("nomeCompleto")}
                      />
                      {errors.nomeCompleto ? (
                        <p className="mt-1 text-sm text-red-600 dark:text-orange-400">
                          {errors.nomeCompleto.message}
                        </p>
                      ) : null}
                    </motion.div>
                  ) : (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 380, damping: 26 }}
                      >
                        <label className="mb-2 block text-base font-bold text-[#1a2b4b] md:text-lg dark:text-[#f8fafc]">
                          Nome da empresa
                        </label>
                        <input
                          className="input-ring mt-1 w-full"
                          {...register("nomeEmpresa")}
                        />
                        {errors.nomeEmpresa ? (
                          <p className="mt-1 text-sm text-red-600 dark:text-orange-400">
                            {errors.nomeEmpresa.message}
                          </p>
                        ) : null}
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 380, damping: 26 }}
                      >
                        <label className="mb-2 block text-base font-bold text-[#1a2b4b] md:text-lg dark:text-[#f8fafc]">
                          CNPJ
                        </label>
                        <Controller
                          name="cnpj"
                          control={control}
                          render={({ field }) => (
                            <input
                              className="input-ring mt-1 w-full"
                              placeholder="00.000.000/0001-00"
                              inputMode="numeric"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(maskCnpj(e.target.value))
                              }
                              onBlur={field.onBlur}
                            />
                          )}
                        />
                        {errors.cnpj ? (
                          <p className="mt-1 text-sm text-red-600 dark:text-orange-400">
                            {errors.cnpj.message}
                          </p>
                        ) : null}
                      </motion.div>
                    </>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 380, damping: 26 }}
                    >
                      <label className="mb-2 block text-base font-bold text-[#1a2b4b] md:text-lg dark:text-[#f8fafc]">
                        WhatsApp
                      </label>
                      <Controller
                        name="whatsapp"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="tel"
                            className="input-ring mt-1 w-full"
                            placeholder="(82) 99999-9999"
                            inputMode="numeric"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(maskWhatsappBr(e.target.value))
                            }
                            onBlur={field.onBlur}
                          />
                        )}
                      />
                      {errors.whatsapp ? (
                        <p className="mt-1 text-sm text-red-600 dark:text-orange-400">
                          {errors.whatsapp.message}
                        </p>
                      ) : null}
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 380, damping: 26 }}
                    >
                      <label className="mb-2 flex items-center gap-2 text-base font-bold text-[#1a2b4b] md:text-lg dark:text-[#f8fafc]">
                        <Calendar className="h-4 w-4 shrink-0 text-[#1a2b4b] dark:text-sky-400" />
                        Data da mudança
                      </label>
                      <input
                        type="date"
                        className="input-ring mt-1 w-full"
                        {...register("dataMudanca")}
                      />
                      {errors.dataMudanca ? (
                        <p className="mt-1 text-sm text-red-600 dark:text-orange-400">
                          {errors.dataMudanca.message}
                        </p>
                      ) : null}
                    </motion.div>
                  </div>

                  <p className="rounded-xl border border-slate-200/90 bg-white/50 p-3 text-xs leading-relaxed text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-[#f8fafc]/75">
                    Ao enviar, você será direcionado ao WhatsApp com um resumo do
                    seu pedido para finalizar com nossa equipe.
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/90 pt-6 dark:border-white/10">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:text-slate-300 dark:hover:border-white/25 dark:hover:text-slate-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>

              {step < 2 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="cta-solid inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm"
                >
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="cta-solid inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm"
                >
                  Abrir WhatsApp
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function AddressBlock({
  title,
  keys,
  register,
  control,
  watch,
  getValues,
  setValue,
  errors,
  cepBusy,
  setCepBusy,
}: {
  title: string;
  keys: typeof KEYS_ORIGEM | typeof KEYS_DESTINO;
  register: UseFormRegister<QuoteFormValues>;
  control: Control<QuoteFormValues>;
  watch: UseFormWatch<QuoteFormValues>;
  getValues: UseFormGetValues<QuoteFormValues>;
  setValue: UseFormSetValue<QuoteFormValues>;
  errors: FieldErrors<QuoteFormValues>;
  cepBusy: boolean;
  setCepBusy: (v: boolean) => void;
}) {
  const access = watch(keys.acesso);
  const accessChosen = access !== "";
  const isAp = access === "ap";
  const noNumber = watch(keys.semNumero);

  async function handleCepFilled() {
    const raw = getValues(keys.cep);
    const d = onlyDigits(raw);
    if (d.length !== 8) return;
    setCepBusy(true);
    const data = await consultarCep(d);
    setCepBusy(false);
    if (!data) return;
    setValue(keys.logradouro, data.logradouro ?? "", {
      shouldValidate: true,
    });
    setValue(keys.bairro, data.bairro ?? "", { shouldValidate: true });
    setValue(keys.cidade, data.localidade ?? "", { shouldValidate: true });
    setValue(keys.uf, (data.uf ?? "").slice(0, 2), { shouldValidate: true });
  }

  function fieldErr<K extends keyof QuoteFormValues>(k: K) {
    const e = errors[k];
    return e?.message ? String(e.message) : undefined;
  }

  const accessQuestion =
    title === "Origem"
      ? "Tipo de acesso na Origem"
      : "Tipo de acesso no Destino";

  return (
    <fieldset className="space-y-4 border-t border-slate-200/80 pt-8 first:border-t-0 first:pt-0 dark:border-white/15">
      <legend className="text-sm font-semibold text-slate-900 dark:text-white">
        {title}
      </legend>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {accessQuestion}
        </p>
        <AccessRadios name={keys.acesso} register={register} />
        {fieldErr(keys.acesso) ? (
          <p className="text-sm text-red-600 dark:text-orange-400">
            {fieldErr(keys.acesso)}
          </p>
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        {accessChosen ? (
          <motion.div
            key={`address-reveal-${keys.acesso}`}
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="mb-2 block text-base font-bold text-slate-900 md:text-lg dark:text-white">
                  CEP
                </label>
                <Controller
                  name={keys.cep}
                  control={control}
                  render={({ field }) => (
                    <input
                      className="input-ring mt-1 w-full"
                      placeholder="00000-000"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      disabled={cepBusy}
                      value={field.value}
                      onChange={(e) => field.onChange(maskCep(e.target.value))}
                      onBlur={() => {
                        field.onBlur();
                        void handleCepFilled();
                      }}
                    />
                  )}
                />
                {cepBusy ? (
                  <p className="mt-1 text-xs text-slate-600 dark:text-white/65">
                    Buscando endereço pelo CEP…
                  </p>
                ) : null}
                {fieldErr(keys.cep) ? (
                  <p className="mt-1 text-sm text-red-600 dark:text-orange-400">
                    {fieldErr(keys.cep)}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-base font-bold text-slate-900 md:text-lg dark:text-white">
                  Rua / logradouro
                </label>
                <input
                  className="input-ring mt-1 w-full"
                  {...register(keys.logradouro)}
                />
                {fieldErr(keys.logradouro) ? (
                  <p className="mt-1 text-sm text-red-600 dark:text-orange-400">
                    {fieldErr(keys.logradouro)}
                  </p>
                ) : null}
              </div>
              <div>
                <label className="mb-2 block text-base font-bold text-slate-900 md:text-lg dark:text-white">
                  Bairro
                </label>
                <input className="input-ring mt-1 w-full" {...register(keys.bairro)} />
                {fieldErr(keys.bairro) ? (
                  <p className="mt-1 text-sm text-red-600 dark:text-orange-400">
                    {fieldErr(keys.bairro)}
                  </p>
                ) : null}
              </div>
              <div>
                <label className="mb-2 block text-base font-bold text-slate-900 md:text-lg dark:text-white">
                  Cidade
                </label>
                <input className="input-ring mt-1 w-full" {...register(keys.cidade)} />
                {fieldErr(keys.cidade) ? (
                  <p className="mt-1 text-sm text-red-600 dark:text-orange-400">
                    {fieldErr(keys.cidade)}
                  </p>
                ) : null}
              </div>
              <div>
                <label className="mb-2 block text-base font-bold text-slate-900 md:text-lg dark:text-white">
                  UF
                </label>
                <input
                  className="input-ring mt-1 w-full uppercase"
                  maxLength={2}
                  {...register(keys.uf)}
                />
                {fieldErr(keys.uf) ? (
                  <p className="mt-1 text-sm text-red-600 dark:text-orange-400">
                    {fieldErr(keys.uf)}
                  </p>
                ) : null}
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label className="text-base font-bold text-slate-900 md:text-lg dark:text-white">
                    Número
                  </label>
                  <Controller
                    name={keys.semNumero}
                    control={control}
                    render={({ field }) => (
                      <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-[#1a2b4b] focus:ring-sky-400/40 dark:border-white/25 dark:bg-[#1e293b] dark:text-sky-400"
                        />
                        Sem número
                      </label>
                    )}
                  />
                </div>
                <input
                  className={`input-ring mt-1 w-full ${noNumber ? "cursor-not-allowed bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" : ""}`}
                  disabled={noNumber}
                  {...register(keys.numero)}
                />
                {fieldErr(keys.numero) ? (
                  <p className="mt-1 text-sm text-red-600 dark:text-orange-400">
                    {fieldErr(keys.numero)}
                  </p>
                ) : null}
              </div>
              <div>
                <label className="mb-2 block text-base font-bold text-slate-900 md:text-lg dark:text-white">
                  Complemento{" "}
                  <span className="normal-case opacity-70">(opcional)</span>
                </label>
                <input
                  className="input-ring mt-1 w-full"
                  {...register(keys.complemento)}
                />
              </div>
            </div>

            {isAp ? (
              <ElevadorServico control={control} name={keys.elevador} />
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </fieldset>
  );
}

function AccessRadios({
  name,
  register,
}: {
  name: "acessoOrigem" | "acessoDestino";
  register: UseFormRegister<QuoteFormValues>;
}) {
  const opts = [
    { value: "casa", label: "Casa" },
    { value: "ap", label: "Apartamento" },
  ] as const;

  return (
    <div className="mt-2 flex flex-wrap gap-3">
      {opts.map((o) => (
        <label
          key={o.value}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200/90 bg-white/70 px-3 py-2 text-base font-bold text-slate-900 has-[:checked]:border-[#1a2b4b]/45 has-[:checked]:bg-[#1a2b4b]/10 has-[:checked]:text-[#1a2b4b] md:text-lg dark:border-white/15 dark:bg-white/10 dark:text-[#f8fafc] dark:has-[:checked]:border-sky-400/45 dark:has-[:checked]:bg-sky-500/15 dark:has-[:checked]:text-[#f8fafc]"
        >
          <input
            type="radio"
            value={o.value}
            className="sr-only"
            {...register(name)}
          />
          {o.label}
        </label>
      ))}
    </div>
  );
}

function ElevadorServico({
  control,
  name,
}: {
  control: Control<QuoteFormValues>;
  name: "elevadorServicoOrigem" | "elevadorServicoDestino";
}) {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <label className="flex cursor-pointer items-start gap-3 text-base font-bold text-slate-900 md:text-lg dark:text-white">
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-[#1a2b4b] focus:ring-sky-400/40 dark:border-white/25 dark:bg-[#1e293b] dark:text-sky-400"
            />
            <span className="leading-snug">Possui elevador de serviço?</span>
          </label>
        )}
      />
    </div>
  );
}
