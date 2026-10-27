"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
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
  { label: "Até R$ 1.500.000", min: "", max: "1500000" },
  { label: "De R$ 1,5 mi a R$ 4 mi", min: "1500000", max: "4000000" },
  { label: "De R$ 4 mi a R$ 10 mi", min: "4000000", max: "10000000" },
  { label: "Acima de R$ 10.000.000", min: "10000000", max: "" },
];

const PRICE_RANGES_RENT = [
  { label: "Qualquer valor", min: "", max: "" },
  { label: "Até R$ 10.000 / mês", min: "", max: "10000" },
  { label: "De R$ 10 mil a R$ 25 mil", min: "10000", max: "25000" },
  { label: "De R$ 25 mil a R$ 50 mil", min: "25000", max: "50000" },
  { label: "Acima de R$ 50.000 / mês", min: "50000", max: "" },
];

export function HeroSearchBar({ cities, neighborhoods }: HeroSearchBarProps) {
  const router = useRouter();
  const [purpose, setPurpose] = useState<"venda" | "aluguel">("venda");
  const [propertyType, setPropertyType] = useState<string>("todos");
  const [city, setCity] = useState<string>("");
  const [neighborhood, setNeighborhood] = useState<string>("");
  const [priceRangeIndex, setPriceRangeIndex] = useState<number>(0);

  const activeRanges =
    purpose === "aluguel" ? PRICE_RANGES_RENT : PRICE_RANGES_SALE;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();

    if (propertyType && propertyType !== "todos") {
      params.set("tipo", propertyType);
    }
    if (city.trim()) {
      params.set("cidade", city.trim());
    }
    if (neighborhood.trim()) {
      params.set("bairro", neighborhood.trim());
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
    <div className="w-full max-w-5xl rounded-2xl bg-white p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-[#E5E5E5] text-left">
      {/* Alternância Comprar / Alugar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E5E5] pb-4">
        <div
          className="inline-flex rounded-xl bg-[#F5F5F5] p-1.5 border border-[#E5E5E5]"
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
              "rounded-lg px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
              purpose === "venda"
                ? "bg-[#B5121B] text-white shadow-sm"
                : "text-[#242424]/75 hover:text-[#B5121B]"
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
              "rounded-lg px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
              purpose === "aluguel"
                ? "bg-[#B5121B] text-white shadow-sm"
                : "text-[#242424]/75 hover:text-[#B5121B]"
            )}
          >
            Alugar
          </button>
        </div>

        <button
          type="button"
          onClick={() => router.push("/imoveis")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B5121B] hover:underline cursor-pointer"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Busca avançada com mais filtros</span>
        </button>
      </div>

      {/* Formulário de Busca */}
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-end"
      >
        {/* Tipo de Imóvel */}
        <div className="lg:col-span-3">
          <label
            htmlFor="hero-property-type"
            className="block text-[11px] font-semibold uppercase tracking-wider text-[#737373] mb-1.5"
          >
            Tipo de Imóvel
          </label>
          <select
            id="hero-property-type"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="h-11 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm text-[#242424] focus:border-[#B5121B] focus:outline-none"
          >
            <option value="todos">Todos os tipos</option>
            {(Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[]).map((key) => (
              <option key={key} value={key}>
                {PROPERTY_TYPE_LABELS[key]}
              </option>
            ))}
          </select>
        </div>

        {/* Cidade */}
        <div className="lg:col-span-2">
          <label
            htmlFor="hero-city"
            className="block text-[11px] font-semibold uppercase tracking-wider text-[#737373] mb-1.5"
          >
            Cidade
          </label>
          <input
            id="hero-city"
            type="text"
            list="hero-cities-datalist"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ex: São Paulo"
            className="h-11 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm text-[#242424] placeholder:text-[#737373]/60 focus:border-[#B5121B] focus:outline-none"
          />
          <datalist id="hero-cities-datalist">
            {cities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        {/* Bairro */}
        <div className="lg:col-span-3">
          <label
            htmlFor="hero-neighborhood"
            className="block text-[11px] font-semibold uppercase tracking-wider text-[#737373] mb-1.5"
          >
            Bairro ou Região
          </label>
          <input
            id="hero-neighborhood"
            type="text"
            list="hero-neighborhoods-datalist"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            placeholder="Ex: Jardim Paulista, Itaim..."
            className="h-11 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm text-[#242424] placeholder:text-[#737373]/60 focus:border-[#B5121B] focus:outline-none"
          />
          <datalist id="hero-neighborhoods-datalist">
            {neighborhoods.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
        </div>

        {/* Faixa de Preço */}
        <div className="lg:col-span-2">
          <label
            htmlFor="hero-price-range"
            className="block text-[11px] font-semibold uppercase tracking-wider text-[#737373] mb-1.5"
          >
            Preço
          </label>
          <select
            id="hero-price-range"
            value={priceRangeIndex}
            onChange={(e) => setPriceRangeIndex(Number(e.target.value))}
            className="h-11 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm text-[#242424] focus:border-[#B5121B] focus:outline-none"
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
          <Button type="submit" variant="default" className="h-11 w-full">
            <Search className="h-4 w-4" />
            <span>Buscar imóveis</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
