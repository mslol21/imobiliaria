"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, PhoneCall, ChevronRight } from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";
import { useTechLuxury } from "@/context/tech-luxury-context";

export function TechHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openScheduler } = useTechLuxury();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Minimalista Tech-Luxury */}
          <Link
            href="/"
            className="group flex items-center gap-3 select-none outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700/80 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-500/60 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              >
                <path d="M3 21h18" />
                <path d="M5 21V7l8-4v18" />
                <path d="M13 10l6 3v8" />
                <path d="M9 10h.01" />
                <path d="M9 14h.01" />
                <path d="M9 18h.01" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wider uppercase text-zinc-100 flex items-center gap-1.5">
                PLATAFORMA
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </span>
              <span className="text-[10px] tracking-[0.25em] text-zinc-400 uppercase font-mono">
                PRIVATE REAL ESTATE
              </span>
            </div>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-zinc-800/80 bg-zinc-900/60 p-1.5 backdrop-blur-md">
            <Link
              href="/"
              className="px-3.5 py-1.5 text-xs font-medium tracking-wide text-zinc-300 rounded-full transition-colors hover:text-white hover:bg-zinc-800/80"
            >
              Início
            </Link>
            <Link
              href="/comprar"
              className="px-3.5 py-1.5 text-xs font-medium tracking-wide text-zinc-300 rounded-full transition-colors hover:text-white hover:bg-zinc-800/80"
            >
              Comprar
            </Link>
            <Link
              href="/alugar"
              className="px-3.5 py-1.5 text-xs font-medium tracking-wide text-zinc-300 rounded-full transition-colors hover:text-white hover:bg-zinc-800/80"
            >
              Alugar
            </Link>
            <a
              href="/#tour-virtual"
              className="px-3.5 py-1.5 text-xs font-medium tracking-wide text-zinc-300 rounded-full transition-colors hover:text-white hover:bg-zinc-800/80"
            >
              Tour 360°
            </a>
            <a
              href="/#diferenciais"
              className="px-3.5 py-1.5 text-xs font-medium tracking-wide text-zinc-300 rounded-full transition-colors hover:text-white hover:bg-zinc-800/80"
            >
              Diferenciais
            </a>
            <a
              href="/#metricas"
              className="px-3.5 py-1.5 text-xs font-medium tracking-wide text-zinc-300 rounded-full transition-colors hover:text-white hover:bg-zinc-800/80"
            >
              Indicadores
            </a>
          </nav>

          {/* CTA com Efeito Shimmer e Border Beam */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => openScheduler()}
              className="relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-zinc-900/90 to-cyan-950/40 px-5 py-2.5 text-xs font-medium text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 hover:scale-[1.02] hover:border-cyan-400 hover:text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.35)] active:scale-[0.98]"
            >
              <BorderBeam size={80} duration={8} colorFrom="#06b6d4" colorTo="#22d3ee" />
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Agendar Concierge</span>
            </button>
          </div>

          {/* Botão Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white"
              aria-label="Alternar menu de navegação"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950/95 px-4 pt-4 pb-6 backdrop-blur-2xl">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              <span>Início</span>
              <ChevronRight className="h-4 w-4 text-zinc-500" />
            </Link>
            <Link
              href="/comprar"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              <span>Comprar Imóveis</span>
              <ChevronRight className="h-4 w-4 text-zinc-500" />
            </Link>
            <Link
              href="/alugar"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              <span>Alugar Imóveis</span>
              <ChevronRight className="h-4 w-4 text-zinc-500" />
            </Link>
            <a
              href="/#tour-virtual"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              <span>Tour Virtual Interativo</span>
              <ChevronRight className="h-4 w-4 text-zinc-500" />
            </a>
            <a
              href="/#diferenciais"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              <span>Diferenciais Tecnológicos</span>
              <ChevronRight className="h-4 w-4 text-zinc-500" />
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openScheduler();
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 py-3 text-sm font-semibold text-cyan-200"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Falar com Concierge VIP</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
