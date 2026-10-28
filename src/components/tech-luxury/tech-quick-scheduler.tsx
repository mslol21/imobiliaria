"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Calendar,
  Clock,
  Sparkles,
  X,
  CheckCircle2,
  Phone,
  MessageCircle,
  Building,
  User,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import type { TechProperty } from "@/types/tech-luxury";
import { TECH_LUXURY_PROPERTIES } from "@/data/tech-luxury-mock";

import { useTechLuxury } from "@/context/tech-luxury-context";

interface TechQuickSchedulerProps {
  isOpen?: boolean;
  onClose?: () => void;
  selectedProperty?: TechProperty | null;
}

export function TechQuickScheduler(props: TechQuickSchedulerProps = {}) {
  let context: ReturnType<typeof useTechLuxury> | null = null;
  try {
    context = useTechLuxury();
  } catch {
    context = null;
  }

  const isOpen = props.isOpen !== undefined ? props.isOpen : (context?.isSchedulerOpen ?? false);
  const onClose = props.onClose || (() => context?.closeScheduler());
  const activeSelected = props.selectedProperty !== undefined ? props.selectedProperty : (context?.selectedProperty ?? null);

  const defaultProp = TECH_LUXURY_PROPERTIES[0]!;

  const [step, setStep] = useState<1 | 2>(1);
  const [propertyId, setPropertyId] = useState(
    activeSelected?.id || defaultProp.id
  );
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState<"manha" | "tarde" | "noite">("tarde");
  const [format, setFormat] = useState<"presencial" | "virtual">("presencial");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const activeProperty =
    TECH_LUXURY_PROPERTIES.find((p) => p.id === propertyId) ||
    activeSelected ||
    defaultProp;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      alert("Por favor selecione a data desejada para a visita.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Por favor preencha seu nome e WhatsApp.");
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setStep(1);
    onClose();
  };

  const whatsappMessage = encodeURIComponent(
    `Olá, gostaria de confirmar o agendamento de visita VIP para o imóvel: ${activeProperty.title} (${activeProperty.referenceCode}) no dia ${date} período da ${timeSlot}. Meu nome é ${name}.`
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleReset()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 text-zinc-100 shadow-[0_25px_70px_rgba(0,0,0,0.9)] focus:outline-none max-h-[92vh] overflow-y-auto">
          {/* Header do Agendador */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <Dialog.Title className="text-base sm:text-lg font-bold text-white">
                  Agendar Visita Exclusiva
                </Dialog.Title>
                <Dialog.Description className="text-xs text-zinc-400">
                  {step === 1 ? "Etapa 1 de 2: Preferências de Agenda" : "Etapa 2 de 2: Seus Dados de Contato"}
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {!submitted ? (
            <div className="mt-6">
              {/* ETAPA 1: SELEÇÃO DE DATA E HORÁRIO */}
              {step === 1 && (
                <form onSubmit={handleNext} className="space-y-5">
                  {/* Imóvel em foco */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Propriedade Selecionada
                    </label>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Building className="h-4 w-4 text-cyan-400 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-white truncate block">
                            {activeProperty.title}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {activeProperty.neighborhood} • REF: {activeProperty.referenceCode}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Formato da Experiência */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                      Modalidade da Experiência
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormat("presencial")}
                        className={`rounded-xl p-3 text-xs font-medium border text-left transition-all ${
                          format === "presencial"
                            ? "bg-cyan-950/50 border-cyan-500 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <span className="font-bold block text-white">
                          Visita Presencial VIP
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          Acompanhada por especialista sênior
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormat("virtual")}
                        className={`rounded-xl p-3 text-xs font-medium border text-left transition-all ${
                          format === "virtual"
                            ? "bg-cyan-950/50 border-cyan-500 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <span className="font-bold block text-white">
                          Tour Virtual Guiado 4K
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          Videochamada privada com o arquiteto
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Data da Visita */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Data Preferencial
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  {/* Período do Dia */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                      Melhor Período
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "manha", label: "Manhã", time: "09h - 12h" },
                        { id: "tarde", label: "Tarde", time: "14h - 18h" },
                        { id: "noite", label: "Sunset / Noite", time: "18h - 20h" },
                      ].map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setTimeSlot(slot.id as any)}
                          className={`rounded-xl p-2.5 text-xs text-center border transition-all ${
                            timeSlot === slot.id
                              ? "bg-cyan-500 text-zinc-950 font-bold border-cyan-400"
                              : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                          }`}
                        >
                          <span className="block">{slot.label}</span>
                          <span className="text-[10px] opacity-75">{slot.time}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Botão Avançar */}
                  <div className="pt-4 border-t border-zinc-800 flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 px-6 py-2.5 text-xs font-bold text-zinc-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:brightness-110 active:scale-95"
                    >
                      <span>Avançar para Seus Dados</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* ETAPA 2: DADOS PESSOAIS E CONFIRMAÇÃO */}
              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Resumo da Agenda */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-xs text-zinc-300">
                    <span className="font-semibold text-cyan-400 block mb-0.5">
                      Resumo da Solicitação:
                    </span>
                    <span>
                      {format === "presencial" ? "Visita Presencial" : "Tour Virtual"} no dia {date} ({timeSlot}) — {activeProperty.title}
                    </span>
                  </div>

                  {/* Nome Completo */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Seu Nome Completo *
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 focus-within:border-cyan-500">
                      <User className="h-4 w-4 text-cyan-400" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Dra. Mariana Vasconcellos"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      WhatsApp com DDD *
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 focus-within:border-cyan-500">
                      <Phone className="h-4 w-4 text-cyan-400" />
                      <input
                        type="tel"
                        required
                        placeholder="(11) 99999-8888"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Observações Opcionais */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Preferências Especiais (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Gostaria de verificar a vista do pôr do sol ou vaga para veículo elétrico..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  {/* Botões Voltar / Confirmar */}
                  <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Voltar</span>
                    </button>

                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 px-6 py-2.5 text-xs font-bold text-zinc-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:brightness-110 active:scale-95"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Confirmar Agendamento</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* TELA DE SUCESSO E ABERTURA DIRETA DE WHATSAPP */
            <div className="mt-6 flex flex-col items-center text-center py-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 mb-4 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Solicitação Recebida com Sucesso!
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-sm">
                Nosso Concierge Sênior entrará em contato em menos de 15 minutos para formalizar o acesso privativo e a segurança de credenciais.
              </p>

              {/* Ação Imediata via WhatsApp */}
              <a
                href={`https://wa.me/5511999998888?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-xs font-bold text-zinc-950 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-400 active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Iniciar Conversa Imediata no WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleReset}
                className="mt-4 text-xs text-zinc-500 hover:text-zinc-300"
              >
                Fechar esta janela
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

{/* BOTÃO FLUTUANTE QUICK CTA (FIXO NO CANTO INFERIOR) */}
export function TechFloatingCTA({
  onOpenScheduler,
}: {
  onOpenScheduler?: () => void;
} = {}) {
  let context: ReturnType<typeof useTechLuxury> | null = null;
  try {
    context = useTechLuxury();
  } catch {
    context = null;
  }

  const trigger = onOpenScheduler || (() => context?.openScheduler());

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
      <button
        type="button"
        onClick={trigger}
        className="group relative flex items-center gap-2.5 rounded-full border border-cyan-500/50 bg-zinc-950/90 py-3 px-5 text-xs font-bold text-white backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] transition-all duration-300 hover:scale-105 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] active:scale-95"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
        </span>
        <Sparkles className="h-4 w-4 text-cyan-400 transition-transform group-hover:rotate-12" />
        <span className="tracking-wide">Agendar Visita VIP</span>
      </button>
    </div>
  );
}
