"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, SlidersHorizontal, Check, RotateCcw } from "lucide-react";
import type { TechPropertyFilters } from "@/types/tech-luxury";

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TechPropertyFilters;
  onApplyFilters: (updated: TechPropertyFilters) => void;
}

export function TechAdvancedFiltersModal({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
}: AdvancedFiltersModalProps) {
  const [local, setLocal] = useState<TechPropertyFilters>(filters);

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  const handleApply = () => {
    onApplyFilters(local);
    onClose();
  };

  const handleReset = () => {
    const cleared: TechPropertyFilters = {
      busca: local.busca,
      bairro: local.bairro,
      finalidade: local.finalidade,
      tipo: local.tipo,
      ordenar: local.ordenar,
    };
    setLocal(cleared);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 text-zinc-100 shadow-[0_20px_60px_rgba(0,0,0,0.8)] focus:outline-none max-h-[90vh] overflow-y-auto">
          {/* Header do Modal */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-bold tracking-tight text-white">
                  Filtros Avançados
                </Dialog.Title>
                <Dialog.Description className="text-xs text-zinc-400">
                  Refine sua busca com parâmetros arquitetônicos precisos
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Conteúdo dos Filtros */}
          <div className="mt-6 space-y-6">
            {/* Metragem Área Útil */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Área Útil Privativa (m²)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-zinc-500">Mínimo</span>
                  <input
                    type="number"
                    placeholder="Ex: 200"
                    value={local.areaMin || ""}
                    onChange={(e) =>
                      setLocal({
                        ...local,
                        areaMin: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500">Máximo</span>
                  <input
                    type="number"
                    placeholder="Ex: 1500"
                    value={local.areaMax || ""}
                    onChange={(e) =>
                      setLocal({
                        ...local,
                        areaMax: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Suítes & Vagas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Suítes Mínimas
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() =>
                        setLocal({
                          ...local,
                          suites: local.suites === n ? undefined : n,
                        })
                      }
                      className={`flex-1 rounded-xl py-2 text-xs font-medium border transition-colors ${
                        local.suites === n
                          ? "bg-cyan-500 text-zinc-950 border-cyan-400 font-bold"
                          : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                      }`}
                    >
                      {n}+
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Vagas de Garagem
                </label>
                <div className="flex gap-2">
                  {[2, 4, 6, 8, 10].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() =>
                        setLocal({
                          ...local,
                          vagas: local.vagas === n ? undefined : n,
                        })
                      }
                      className={`flex-1 rounded-xl py-2 text-xs font-medium border transition-colors ${
                        local.vagas === n
                          ? "bg-cyan-500 text-zinc-950 border-cyan-400 font-bold"
                          : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                      }`}
                    >
                      {n}+
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Atributos Arquitetônicos & Comodidades */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                Características Arquitetônicas & Comodidades
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { key: "piscina", label: "Piscina Privativa" },
                  { key: "vistaLivre", label: "Vista Panorâmica" },
                  { key: "automacao", label: "Automação IoT" },
                  { key: "mobiliado", label: "Mobiliado / Decorado" },
                  { key: "petFriendly", label: "Pet-Friendly" },
                ].map((item) => {
                  const active = Boolean(local[item.key as keyof TechPropertyFilters]);
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        setLocal({
                          ...local,
                          [item.key]: !active,
                        })
                      }
                      className={`flex items-center justify-between rounded-xl p-3 text-xs font-medium border transition-all ${
                        active
                          ? "bg-cyan-950/40 border-cyan-500/60 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                          : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                      }`}
                    >
                      <span>{item.label}</span>
                      {active && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer do Modal com Ações */}
          <div className="mt-8 flex items-center justify-between border-t border-zinc-800/80 pt-5">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Limpar Filtros</span>
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 px-6 py-2.5 text-xs font-bold text-zinc-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:brightness-110 active:scale-95"
            >
              Aplicar Critérios
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
