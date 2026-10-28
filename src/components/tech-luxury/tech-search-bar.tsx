"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  MapPin,
  Home,
  DollarSign,
  Bed,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  X,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";
import { TechAdvancedFiltersModal } from "./tech-advanced-filters-modal";
import type {
  TechPropertyFilters,
  PropertyPurpose,
  TechPropertyType,
} from "@/types/tech-luxury";

const NEIGHBORHOOD_SUGGESTIONS = [
  "Itaim Bibi",
  "Cidade Jardim",
  "Vila Nova Conceição",
  "Pinheiros",
  "Morumbi",
  "Jardim Paulista",
  "Higienópolis",
  "Faria Lima",
];

const PROPERTY_TYPES: { value: TechPropertyType | "todos"; label: string }[] = [
  { value: "todos", label: "Todos os Tipos" },
  { value: "cobertura", label: "Cobertura Triplex / Duplex" },
  { value: "mansao", label: "Mansão Contemporânea" },
  { value: "penthouse", label: "Penthouse Exclusiva" },
  { value: "casa_condominio", label: "Casa em Condomínio" },
  { value: "apartamento_design", label: "Apartamento Design" },
  { value: "comercial_boutique", label: "Comercial Boutique" },
];

interface TechSearchBarProps {
  filters: TechPropertyFilters;
  onChangeFilters: (filters: TechPropertyFilters) => void;
  onSearchSubmit: () => void;
}

export function TechSearchBar({
  filters,
  onChangeFilters,
  onSearchSubmit,
}: TechSearchBarProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [bairroInput, setBairroInput] = useState(filters.bairro || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = NEIGHBORHOOD_SUGGESTIONS.filter((n) =>
    n.toLowerCase().includes(bairroInput.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePurposeChange = (purpose: PropertyPurpose | "todos") => {
    onChangeFilters({ ...filters, finalidade: purpose });
  };

  const handleTypeChange = (type: TechPropertyType | "todos") => {
    onChangeFilters({ ...filters, tipo: type });
  };

  const handleBedroomsChange = (beds: number | undefined) => {
    onChangeFilters({ ...filters, dormitorios: beds });
  };

  const handleSelectBairro = (b: string) => {
    setBairroInput(b);
    onChangeFilters({ ...filters, bairro: b });
    setShowSuggestions(false);
  };

  const activeAdvancedCount = [
    filters.areaMin,
    filters.areaMax,
    filters.suites,
    filters.vagas,
    filters.piscina,
    filters.vistaLivre,
    filters.automacao,
    filters.mobiliado,
    filters.petFriendly,
  ].filter(Boolean).length;

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Container Principal com Glassmorphism Dark Tech */}
      <div className="relative rounded-3xl border border-zinc-800/90 bg-zinc-950/80 p-3 sm:p-4 backdrop-blur-2xl shadow-[0_15px_50px_rgba(0,0,0,0.7)] transition-all duration-300 hover:border-zinc-700/80">
        <BorderBeam size={120} duration={14} colorFrom="#06b6d4" colorTo="#14b8a6" />

        {/* Linha Superior: Abas de Finalidade (Comprar / Alugar / Todos) */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/60 px-2">
          <div className="flex items-center gap-1.5 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
            {(
              [
                { id: "venda", label: "Comprar" },
                { id: "aluguel", label: "Alugar" },
                { id: "todos", label: "Todos" },
              ] as const
            ).map((tab) => {
              const active = (filters.finalidade || "todos") === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handlePurposeChange(tab.id)}
                  className={`relative px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    active
                      ? "bg-cyan-500 text-zinc-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Botão de Filtros Avançados */}
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Filtros Avançados</span>
            {activeAdvancedCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-zinc-950">
                {activeAdvancedCount}
              </span>
            )}
          </button>
        </div>

        {/* Linha Inferior: Campos de Busca Integrados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Campo 1: Localização com Dropdown Preditivo */}
          <div ref={dropdownRef} className="relative">
            <div className="flex items-center gap-2.5 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 px-3.5 py-2.5 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/30">
              <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  Localização / Bairro
                </span>
                <input
                  type="text"
                  placeholder="Ex: Itaim Bibi, Cidade Jardim..."
                  value={bairroInput}
                  onChange={(e) => {
                    setBairroInput(e.target.value);
                    onChangeFilters({ ...filters, bairro: e.target.value });
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-transparent text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none"
                />
              </div>
              {bairroInput && (
                <button
                  type="button"
                  onClick={() => {
                    setBairroInput("");
                    onChangeFilters({ ...filters, bairro: undefined });
                  }}
                  className="text-zinc-500 hover:text-zinc-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown de Sugestões */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-30 mt-2 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-xl">
                <div className="px-2 py-1 text-[10px] font-mono text-zinc-500 uppercase">
                  Bairros Nobres Sugeridos
                </div>
                {filteredSuggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSelectBairro(item)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-300 hover:bg-cyan-500/10 hover:text-cyan-300 text-left transition-colors"
                  >
                    <MapPin className="h-3 w-3 text-cyan-500" />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Campo 2: Tipo de Imóvel */}
          <div className="flex items-center gap-2.5 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 px-3.5 py-2.5 focus-within:border-cyan-500/60">
            <Home className="h-4 w-4 text-cyan-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                Tipologia
              </span>
              <select
                value={filters.tipo || "todos"}
                onChange={(e) =>
                  handleTypeChange(e.target.value as TechPropertyType | "todos")
                }
                className="w-full bg-transparent text-xs sm:text-sm text-zinc-100 focus:outline-none cursor-pointer"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value} className="bg-zinc-900 text-zinc-200">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Campo 3: Quartos */}
          <div className="flex items-center gap-2.5 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 px-3.5 py-2.5 focus-within:border-cyan-500/60">
            <Bed className="h-4 w-4 text-cyan-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                Dormitórios
              </span>
              <select
                value={filters.dormitorios || 0}
                onChange={(e) =>
                  handleBedroomsChange(
                    e.target.value === "0" ? undefined : Number(e.target.value)
                  )
                }
                className="w-full bg-transparent text-xs sm:text-sm text-zinc-100 focus:outline-none cursor-pointer"
              >
                <option value={0} className="bg-zinc-900 text-zinc-200">
                  Indiferente
                </option>
                <option value={3} className="bg-zinc-900 text-zinc-200">
                  3+ Quartos
                </option>
                <option value={4} className="bg-zinc-900 text-zinc-200">
                  4+ Quartos
                </option>
                <option value={5} className="bg-zinc-900 text-zinc-200">
                  5+ Quartos
                </option>
                <option value={6} className="bg-zinc-900 text-zinc-200">
                  6+ Quartos
                </option>
              </select>
            </div>
          </div>

          {/* Botão de Ação: Buscar Imóveis */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={onSearchSubmit}
              className="group relative flex w-full h-full min-h-[50px] items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 bg-[length:200%_auto] px-5 py-3 text-xs sm:text-sm font-bold text-zinc-950 shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all duration-300 hover:bg-[position:right_center] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] active:scale-[0.98]"
            >
              <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Explorar Imóveis</span>
              <Sparkles className="h-3.5 w-3.5 opacity-80" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Filtros Avançados */}
      <TechAdvancedFiltersModal
        isOpen={isAdvancedOpen}
        onClose={() => setIsAdvancedOpen(false)}
        filters={filters}
        onApplyFilters={(updated) => {
          onChangeFilters(updated);
          onSearchSubmit();
        }}
      />
    </div>
  );
}
