"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Shield, ArrowRight, Check } from "lucide-react";

export function TechFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-zinc-800/80">
          {/* Coluna 1 & 2: Identidade & Newsletter VIP */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700/80 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 21h18" />
                    <path d="M5 21V7l8-4v18" />
                    <path d="M13 10l6 3v8" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-wider uppercase text-zinc-100">
                    PLATAFORMA PRIVATE
                  </span>
                  <span className="text-[10px] tracking-[0.25em] text-zinc-500 uppercase font-mono">
                    HIGH-END REAL ESTATE
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs text-zinc-400 max-w-sm leading-relaxed">
                Plataforma de alta precisão tecnológica para aquisição e locação de imóveis de luxo. Discrição institucional e curadoria técnica em cada metro quadrado.
              </p>
            </div>

            {/* Newsletter VIP */}
            <div className="mt-8">
              <span className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                Boletim Reservado de Lançamentos
              </span>
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder="Seu e-mail confidencial..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center rounded-xl bg-cyan-500 px-3.5 py-2 text-xs font-bold text-zinc-950 hover:bg-cyan-400 transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2 text-xs text-cyan-400">
                  <Check className="h-4 w-4" />
                  <span>Cadastrado com sucesso na lista seleta.</span>
                </div>
              )}
            </div>
          </div>

          {/* Coluna 3: Coleções */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 mb-4">
              Coleções Exclusivas
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <a href="#imoveis" className="hover:text-cyan-300 transition-colors">
                  Coberturas Triplex & Penthouses
                </a>
              </li>
              <li>
                <a href="#imoveis" className="hover:text-cyan-300 transition-colors">
                  Mansões em Condomínio Fechado
                </a>
              </li>
              <li>
                <a href="#imoveis" className="hover:text-cyan-300 transition-colors">
                  Casas Biofílicas Contemporâneas
                </a>
              </li>
              <li>
                <a href="#imoveis" className="hover:text-cyan-300 transition-colors">
                  Pisos Corporativos Faria Lima
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Regiões */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 mb-4">
              Polos Imobiliários
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <a href="#imoveis" className="hover:text-cyan-300 transition-colors">
                  Itaim Bibi & Faria Lima
                </a>
              </li>
              <li>
                <a href="#imoveis" className="hover:text-cyan-300 transition-colors">
                  Vila Nova Conceição & Ibirapuera
                </a>
              </li>
              <li>
                <a href="#imoveis" className="hover:text-cyan-300 transition-colors">
                  Jardim Paulista & Europa
                </a>
              </li>
              <li>
                <a href="#imoveis" className="hover:text-cyan-300 transition-colors">
                  Cidade Jardim & Morumbi
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 5: Compliance & Segurança */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 mb-4">
              Segurança & Sigilo
            </h4>
            <div className="space-y-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2 text-zinc-300">
                <Shield className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>Due Diligence Jurídica</span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-500">
                Auditoria de matrícula, certidões negativas e avaliação técnica antes de cada publicação de anúncio.
              </p>
              <div className="pt-2 text-[10px] font-mono text-zinc-500">
                CRECI J-XXXXX (Registro em Homologação)
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé Inferior */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} Plataforma Imobiliária Private. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacidade" className="hover:text-zinc-300 transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/sobre" className="hover:text-zinc-300 transition-colors">
              Governança
            </Link>
            <Link href="/contato" className="hover:text-zinc-300 transition-colors">
              Atendimento Concierge
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
