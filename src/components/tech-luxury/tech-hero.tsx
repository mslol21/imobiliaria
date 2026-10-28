"use client";

import React from "react";
import { Sparkles, ArrowDown, ShieldCheck, Zap } from "lucide-react";
import { Spotlight } from "@/components/magicui/spotlight";

export function TechHero({
  children,
}: {
  children?: React.ReactNode;
}) {
  const scrollToSearch = () => {
    const el = document.getElementById("search-anchor");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Aurora / Spotlight Effect */}
      <Spotlight fill="rgba(6, 182, 212, 0.22)" size={600} />

      {/* Grid Pattern sutil estilo Aceternity */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Pill Badge Tech-Luxury */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.4)] mb-8 transition-transform hover:scale-105">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4] animate-ping" />
          <span className="text-xs font-mono tracking-wider text-zinc-300 uppercase">
            PRIVATE COLLECTION 2026
          </span>
          <span className="text-zinc-600">|</span>
          <span className="flex items-center gap-1 text-xs font-medium text-cyan-400">
            <Sparkles className="h-3 w-3" />
            Curadoria Exclusiva
          </span>
        </div>

        {/* Título com Tipografia Tech-Luxury & Gradiente */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl">
          Arquitetura que transcende.
          <span className="block mt-2 bg-gradient-to-r from-cyan-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
            Experiências que definem legados.
          </span>
        </h1>

        {/* Subtítulo refinado */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-zinc-400 max-w-2xl leading-relaxed font-light">
          Acesso reservado aos imóveis mais prestigiados do país. Transações
          estruturadas com inteligência de dados, sigilo absoluto e curadoria de arte arquitetônica.
        </p>

        {/* Floating Search Bar inserida aqui */}
        <div id="search-anchor" className="w-full mt-10">
          {children}
        </div>

        {/* Micro-features de confiança */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>Due Diligence Jurídica 100% Verificada</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Resposta do Concierge em &lt; 15 min</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span>Visualização 360° em Alta Resolução</span>
          </div>
        </div>
      </div>

      {/* Seta indicativa discreta para scroll */}
      <button
        type="button"
        onClick={scrollToSearch}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-zinc-600 hover:text-cyan-400 transition-colors"
        aria-label="Rolar para os imóveis"
      >
        <span className="text-[10px] tracking-widest uppercase font-mono">EXPLORAR</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </button>
    </section>
  );
}
