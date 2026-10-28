"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROPERTY_TYPE_LABELS } from "@/config/design-tokens";
import { cn } from "@/lib/utils";
import type { PropertyType } from "@/types/domain";

interface HeroSearchBarProps {
  cities: string[];
  neighborhoods: string[];
}

const PRICE_RANGES_SALE = [
  { label: "Qualquer valor", min: "", max: "" },
  { label: "Até R$ 250 mil", min: "", max: "250000" },
  { label: "R$ 250 mil a R$ 500 mil", min: "250000", max: "500000" },
  { label: "R$ 500 mil a R$ 800 mil", min: "500000", max: "800000" },
  { label: "Acima de R$ 800 mil", min: "800000", max: "" },
];

const PRICE_RANGES_RENT = [
  { label: "Qualquer valor", min: "", max: "" },
  { label: "Até R$ 1.500 / mês", min: "", max: "1500" },
  { label: "R$ 1.500 a R$ 2.500", min: "1500", max: "2500" },
  { label: "R$ 2.500 a R$ 4.000", min: "2500", max: "4000" },
  { label: "Acima de R$ 4.000 / mês", min: "4000", max: "" },
];

export function HeroSearchBar({ cities, neighborhoods }: HeroSearchBarProps) {
  const router = useRouter();
  const [purpose, setPurpose] = useState<"venda" | "aluguel">("venda");
  const [propertyType, setPropertyType] = useState<string>("todos");
  const [locationQuery, setLocationQuery] = useState<string>("");
  const [priceRangeIndex, setPriceRangeIndex] = useState<number>(0);

  const activeRanges =
    purpose === "aluguel" ? PRICE_RANGES_RENT : PRICE_RANGES_SALE;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();

    if (propertyType && propertyType !== "todos") {
      params.set("tipo", propertyType);
    }

    if (locationQuery.trim()) {
      // Se coincidir exatamente com uma cidade da lista, envia como cidade, senão como busca geral/bairro
      const trimmed = locationQuery.trim();
      const matchedCity = cities.find(
        (c) => c.toLowerCase() === trimmed.toLowerCase()
      );
      if (matchedCity) {
        params.set("cidade", matchedCity);
      } else {
        params.set("busca", trimmed);
      }
    }

    const selectedPrice = activeRanges[priceRangeIndex];
    if (selectedPrice?.min) {
      params.set("precoMin", selectedPrice.min);
    }
    if (selectedPrice?.max) {
      params.set("precoMax", selectedPrice.max);
    }

    const targetPath = purpose === "aluguel" ? "/alugar" : "/comprar";
    const queryString = params.toString();
    router.push(queryString ? `${targetPath}?${queryString}` : targetPath);
  }

  return (
    <div className="w-full max-w-5xl rounded-2xl bg-white p-4 sm:p-6 shadow-[0_20px_50px_rgba(8,145,178,0.12)] border border-cyan-100 border-t-4 border-t-cyan-600 text-left">
      {/* Alternância Comprar / Alugar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3.5">
        <div
          className="inline-flex rounded-xl bg-zinc-100/80 p-1 border border-zinc-200/80"
          role="tablist"
          aria-label="Finalidade do imóvel"
        >
          <button
            type="button"
            role="tab"
            aria-selected={purpose === "venda"}
            onClick={() => {
              setPurpose("venda");
              setPriceRangeIndex(0);
            }}
            className={cn(
              "rounded-lg px-5 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
              purpose === "venda"
                ? "bg-cyan-700 text-white shadow-sm"
                : "text-zinc-600 hover:text-cyan-700 hover:bg-white/80"
            )}
          >
            Comprar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={purpose === "aluguel"}
            onClick={() => {
              setPurpose("aluguel");
              setPriceRangeIndex(0);
            }}
            className={cn(
              "rounded-lg px-5 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
              purpose === "aluguel"
                ? "bg-cyan-700 text-white shadow-sm"
                : "text-zinc-600 hover:text-teal-700 hover:bg-white/80"
            )}
          >
            Alugar
          </button>
        </div>

        <button
          type="button"
          onClick={() => router.push("/imoveis")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-700 hover:text-cyan-800 hover:underline cursor-pointer"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filtros avançados</span>
        </button>
      </div>

      {/* Formulário de Busca */}
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-12 lg:items-end"
      >
        {/* Tipo de Imóvel */}
        <div className="lg:col-span-3">
          <label
            htmlFor="hero-property-type"
            className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1"
          >
            Tipo de Imóvel
          </label>
          <select
            id="hero-property-type"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="h-11 w-full rounded-lg border border-zinc-200 bg-zinc-50/60 px-3 text-sm text-zinc-900 focus:border-cyan-600 focus:bg-white focus:outline-none transition-colors"
          >
            <option value="todos">Todos os tipos</option>
            {(Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[]).map((key) => (
              <option key={key} value={key}>
                {PROPERTY_TYPE_LABELS[key]}
              </option>
            ))}
          </select>
        </div>

        {/* Cidade ou Bairro */}
        <div className="lg:col-span-4">
          <label
            htmlFor="hero-location"
            className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1"
          >
            Cidade ou Bairro
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
            <input
              id="hero-location"
              type="text"
              list="hero-locations-datalist"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Ex.: Guaianases, Lajeado, Itaquera..."
              className="h-11 w-full rounded-lg border border-zinc-200 bg-zinc-50/60 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-cyan-600 focus:bg-white focus:outline-none transition-colors"
            />
          </div>
          <datalist id="hero-locations-datalist">
            {cities.map((c) => (
              <option key={`city-${c}`} value={c} />
            ))}
            {neighborhoods.map((n) => (
              <option key={`neigh-${n}`} value={n} />
            ))}
          </datalist>
        </div>

        {/* Faixa de Preço */}
        <div className="lg:col-span-3">
          <label
            htmlFor="hero-price-range"
            className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1"
          >
            Faixa de Preço
          </label>
          <select
            id="hero-price-range"
            value={priceRangeIndex}
            onChange={(e) => setPriceRangeIndex(Number(e.target.value))}
            className="h-11 w-full rounded-lg border border-zinc-200 bg-zinc-50/60 px-3 text-sm text-zinc-900 focus:border-cyan-600 focus:bg-white focus:outline-none transition-colors"
          >
            {activeRanges.map((range, idx) => (
              <option key={range.label} value={idx}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Botão Buscar Imóveis */}
        <div className="sm:col-span-2 lg:col-span-2">
          <Button
            type="submit"
            variant="default"
            className="h-11 w-full justify-center bg-cyan-700 hover:bg-cyan-800 text-white font-semibold shadow-md shadow-cyan-900/20 border-0"
          >
            <Search className="h-4 w-4" />
            <span>Buscar imóveis</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
