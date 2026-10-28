"use client";

import React from "react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Sparkles, Building2, TrendingUp, CheckCircle, Clock } from "lucide-react";

export function TechStatsSection() {
  return (
    <section id="metricas" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Container com Glassmorphism Dark Tech */}
      <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-zinc-950 p-8 sm:p-12 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Glow de fundo */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800/80">
          {/* Métrica 1: Imóveis Curados */}
          <div className="flex flex-col items-center text-center px-4 pt-6 lg:pt-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center">
              <NumberTicker value={1200} prefix="+" className="text-white" />
            </div>
            <span className="mt-1 text-xs font-mono uppercase tracking-wider text-cyan-400">
              Imóveis Selecionados
            </span>
            <p className="mt-1 text-[11px] text-zinc-400">
              Apenas 2% das propriedades avaliadas são aceitas na curadoria.
            </p>
          </div>

          {/* Métrica 2: Volume Negociado */}
          <div className="flex flex-col items-center text-center px-4 pt-6 lg:pt-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center">
              <span>R$&nbsp;</span>
              <NumberTicker value={2.4} decimals={1} suffix="B+" className="text-white" />
            </div>
            <span className="mt-1 text-xs font-mono uppercase tracking-wider text-amber-400">
              Volume Transacionado
            </span>
            <p className="mt-1 text-[11px] text-zinc-400">
              Transações estruturadas com sigilo patrimonial e liquidez.
            </p>
          </div>

          {/* Métrica 3: Satisfação dos Clientes */}
          <div className="flex flex-col items-center text-center px-4 pt-6 lg:pt-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center">
              <NumberTicker value={98.7} decimals={1} suffix="%" className="text-white" />
            </div>
            <span className="mt-1 text-xs font-mono uppercase tracking-wider text-emerald-400">
              Índice de Retenção & NPS
            </span>
            <p className="mt-1 text-[11px] text-zinc-400">
              Avaliação de compradores e proprietários de alto patrimônio.
            </p>
          </div>

          {/* Métrica 4: Tempo de Resposta Concierge */}
          <div className="flex flex-col items-center text-center px-4 pt-6 lg:pt-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-3 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Clock className="h-5 w-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center">
              <NumberTicker value={15} suffix=" min" className="text-white" />
            </div>
            <span className="mt-1 text-xs font-mono uppercase tracking-wider text-blue-400">
              Atendimento Dedicado
            </span>
            <p className="mt-1 text-[11px] text-zinc-400">
              Disponibilidade 24/7 com especialistas seniores de plantão.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
