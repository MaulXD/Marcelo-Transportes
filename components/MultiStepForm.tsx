"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Building2, Calendar, User } from "lucide-react";
import { useState } from "react";
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
      complementoDestino: "",
      acessoDestino: "",
      numeroApartamentoDestino: "",
      elevadorServicoDestino: false,
      tamanhoMudanca: "pequena",
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

  const onValid = (values: QuoteFormValues) => {
    const phone = (
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5582988696838"
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
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-brand-navy/90 dark:text-white/75">
          Orçamento sem complicação
        </p>
        <h2
          id="orcamento-heading"
          className="mt-2 text-center text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl dark:text-white"
        >
          Monte seu pedido em três passos
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-700 dark:text-white/85">
          Preencha os dados abaixo para receber um orçamento rápido e preciso
          diretamente no seu WhatsApp.
        </p>

        <div className="mt-10 glass-panel p-6 sm:p-8">
          <div className="mb-8 flex justify-center gap-2 sm:gap-4">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2 sm:gap-4">
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                      i === step
                        ? "bg-brand-navy text-white shadow-brand-soft dark:shadow-brand-soft-dark"
                        : i < step
                          ? "bg-brand-navy/15 text-brand-navy ring-1 ring-brand-navy/30 dark:bg-brand-navy/25 dark:text-slate-100 dark:ring-brand-navy/45"
                          : "bg-slate-100 text-slate-500 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-500 dark:ring-white/10"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="hidden text-xs text-slate-500 sm:block dark:text-white/55">
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 ? (
                  <div
                    className={`hidden h-px w-10 sm:block ${i < step ? "bg-brand-navy/35 dark:bg-brand-navy/50" : "bg-slate-200 dark:bg-white/10"}`}
                  />
                ) : null}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onValid)}>
            <AnimatePresence mode="wait">
              {step === 0 ? (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
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
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-slate-600 dark:text-white/75">
                    Escolha o porte da mudança.
                  </p>
                  <Controller
                    name="tamanhoMudanca"
                    control={control}
                    render={({ field }) => (
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
                              title: "Escritório / empresa",
                              desc: "Mobiliário corporativo e operações B2B.",
                            },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => field.onChange(opt.value)}
                            className={`rounded-2xl border p-4 text-left transition ${
                              field.value === opt.value
                                ? "border-brand-navy/45 bg-brand-navy/[0.06] shadow-brand-soft ring-2 ring-brand-navy/25 dark:bg-brand-navy/15 dark:shadow-brand-soft-dark dark:ring-brand-navy/45"
                                : "border-slate-200/90 bg-white/60 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
                            }`}
                          >
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {opt.title}
                            </p>
                            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-500">
                              {opt.desc}
                            </p>
                          </button>
                        ))}
                      </div>
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
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <Controller
                    name="tipoCliente"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Tipo de cliente
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => field.onChange("pf")}
                            className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${
                              field.value === "pf"
                                ? "border-brand-navy/45 bg-brand-navy/10 text-brand-navy ring-1 ring-brand-navy/25 dark:bg-brand-navy/25 dark:text-slate-50 dark:ring-brand-navy/45"
                                : "border-slate-200/90 bg-white/60 text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400"
                            }`}
                          >
                            <User className="h-4 w-4" />
                            Pessoa física
                          </button>
                          <button
                            type="button"
                            onClick={() => field.onChange("pj")}
                            className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${
                              field.value === "pj"
                                ? "border-slate-600/45 bg-slate-600/10 text-slate-900 ring-1 ring-slate-600/25 dark:border-slate-400/40 dark:bg-slate-500/15 dark:text-slate-100 dark:ring-slate-400/35"
                                : "border-slate-200/90 bg-white/60 text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400"
                            }`}
                          >
                            <Building2 className="h-4 w-4" />
                            Pessoa jurídica
                          </button>
                        </div>
                      </div>
                    )}
                  />

                  {tipo === "pf" ? (
                    <div>
                      <label className="mb-2 block text-base font-bold text-slate-900 md:text-lg dark:text-white">
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
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="mb-2 block text-base font-bold text-slate-900 md:text-lg dark:text-white">
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
                      </div>
                      <div>
                        <label className="mb-2 block text-base font-bold text-slate-900 md:text-lg dark:text-white">
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
                      </div>
                    </>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-base font-bold text-slate-900 md:text-lg dark:text-white">
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
                    </div>
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-base font-bold text-slate-900 md:text-lg dark:text-white">
                        <Calendar className="h-4 w-4 shrink-0 text-brand-navy dark:text-[#8A94A6]" />
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
                    </div>
                  </div>

                  <p className="rounded-xl border border-slate-200/90 bg-white/50 p-3 text-xs leading-relaxed text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/75">
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
  const isAp = access === "ap_escada" || access === "ap_elevador";
  const isElev = access === "ap_elevador";
  const aptoWatch = watch(keys.apto);
  const andarPrev =
    isAp && aptoWatch?.trim() ? andarDoApartamento(aptoWatch) : "";

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
      ? "Como é o acesso na Origem? (Casa, Ap escada, Ap elevador)"
      : "Como é o acesso no Destino? (Casa, Ap escada, Ap elevador)";

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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45 }}
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
                <label className="mb-2 block text-base font-bold text-slate-900 md:text-lg dark:text-white">
                  Número
                </label>
                <input className="input-ring mt-1 w-full" {...register(keys.numero)} />
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
              <div>
                <label className="mb-2 block text-base font-bold text-slate-900 md:text-lg dark:text-white">
                  Número do apartamento
                </label>
                <input className="input-ring mt-1 w-full" {...register(keys.apto)} />
                {andarPrev ? (
                  <p className="mt-1 text-xs text-slate-600 dark:text-white/65">
                    Andar estimado: <strong>{andarPrev}</strong>
                  </p>
                ) : null}
                {fieldErr(keys.apto) ? (
                  <p className="mt-1 text-sm text-red-600 dark:text-orange-400">
                    {fieldErr(keys.apto)}
                  </p>
                ) : null}
              </div>
            ) : null}

            {isElev ? (
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
    { value: "ap_escada", label: "Apartamento com escada" },
    { value: "ap_elevador", label: "Apartamento com elevador" },
  ] as const;

  return (
    <div className="mt-2 flex flex-wrap gap-3">
      {opts.map((o) => (
        <label
          key={o.value}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200/90 bg-white/70 px-3 py-2 text-base font-bold text-slate-900 has-[:checked]:border-brand-navy/45 has-[:checked]:bg-brand-navy/10 has-[:checked]:text-brand-navy md:text-lg dark:border-white/15 dark:bg-white/10 dark:text-white dark:has-[:checked]:border-white/35 dark:has-[:checked]:bg-white/15 dark:has-[:checked]:text-white"
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
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-navy focus:ring-brand-navy dark:border-white/25 dark:bg-slate-900 dark:text-brand-navy"
            />
            <span className="leading-snug">Possui elevador de serviço?</span>
          </label>
        )}
      />
    </div>
  );
}
