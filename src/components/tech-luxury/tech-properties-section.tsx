"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, SlidersHorizontal, ArrowUpDown, Filter, X } from "lucide-react";
import { TechPropertyCard } from "./tech-property-card";
import { TECH_LUXURY_PROPERTIES } from "@/data/tech-luxury-mock";
import type {
  TechProperty,
  TechPropertyFilters,
  TechPropertyType,
} from "@/types/tech-luxury";

const CATEGORY_TABS: { id: TechPropertyType | "todos"; label: string }[] = [
  { id: "todos", label: "Coleção Completa" },
  { id: "cobertura", label: "Coberturas" },
  { id: "mansao", label: "Mansões" },
  { id: "penthouse", label: "Penthouses" },
  { id: "casa_condominio", label: "Condomínios Fechados" },
  { id: "apartamento_design", label: "Apartamentos Design" },
  { id: "comercial_boutique", label: "Corporativos Boutique" },
];

interface TechPropertiesSectionProps {
  filters: TechPropertyFilters;
  onChangeFilters: (f: TechPropertyFilters) => void;
  onOpenScheduler: (p?: TechProperty) => void;
}

export function TechPropertiesSection({
  filters,
  onChangeFilters,
  onOpenScheduler,
}: TechPropertiesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    TechPropertyType | "todos"
  >(filters.tipo || "todos");

  const [sortBy, setSortBy] = useState<
    "recentes" | "menor_preco" | "maior_preco" | "maior_area"
  >(filters.ordenar || "recentes");

  const handleCategorySelect = (cat: TechPropertyType | "todos") => {
    setSelectedCategory(cat);
    onChangeFilters({ ...filters, tipo: cat });
  };

  const filteredProperties = useMemo(() => {
    return TECH_LUXURY_PROPERTIES.filter((p) => {
      // Finalidade
      if (
        filters.finalidade &&
        filters.finalidade !== "todos" &&
        p.purpose !== filters.finalidade &&
        p.purpose !== "ambos"
      ) {
        return false;
      }

      // Tipo / Categoria
      if (
        selectedCategory !== "todos" &&
        p.propertyType !== selectedCategory
      ) {
        return false;
      }

      // Bairro
      if (
        filters.bairro &&
        filters.bairro.trim() !== "" &&
        !p.neighborhood
          .toLowerCase()
          .includes(filters.bairro.toLowerCase().trim())
      ) {
        return false;
      }

      // Dormitórios
      if (filters.dormitorios && p.bedrooms < filters.dormitorios) {
        return false;
      }

      // Suítes
      if (filters.suites && p.suites < filters.suites) {
        return false;
      }

      // Vagas
      if (filters.vagas && p.parkingSpots < filters.vagas) {
        return false;
      }

      // Área min
      if (filters.areaMin && p.usableArea < filters.areaMin) {
        return false;
      }

      // Área max
      if (filters.areaMax && p.usableArea > filters.areaMax) {
        return false;
      }

      // Comodidades
      if (filters.piscina && !p.hasPool) return false;
      if (filters.vistaLivre && !p.hasView) return false;
      if (filters.automacao && !p.hasAutomation) return false;
      if (filters.mobiliado && !p.isFurnished) return false;
      if (filters.petFriendly && !p.isPetFriendly) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.purpose === "aluguel" ? a.rentPrice || 0 : a.salePrice || 0;
      const priceB = b.purpose === "aluguel" ? b.rentPrice || 0 : b.salePrice || 0;

      if (sortBy === "menor_preco") return priceA - priceB;
      if (sortBy === "maior_preco") return priceB - priceA;
      if (sortBy === "maior_area") return b.usableArea - a.usableArea;
      return b.viewsCount - a.viewsCount;
    });
  }, [filters, selectedCategory, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory("todos");
    onChangeFilters({});
  };

  return (
    <section id="imoveis" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header da Seção */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>PORTFÓLIO ULTRA-EXCLUSIVE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Propriedades Selecionadas
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl font-light">
            Residências icônicas com projetos arquitetônicos premiados e especificações técnicas de excelência.
          </p>
        </div>

        {/* Dropdown de Ordenação */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-300">
            <ArrowUpDown className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-zinc-500 hidden sm:inline">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="recentes" className="bg-zinc-900">
                Mais Relevantes
              </option>
              <option value="menor_preco" className="bg-zinc-900">
                Menor Valor
              </option>
              <option value="maior_preco" className="bg-zinc-900">
                Maior Valor
              </option>
              <option value="maior_area" className="bg-zinc-900">
                Maior Metragem
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Abas Rápidas de Categoria */}
      <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
        {CATEGORY_TABS.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.id)}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-medium border transition-all ${
                active
                  ? "border-cyan-500/60 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] font-semibold"
                  : "border-zinc-800/80 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Barra de Filtros Ativos e Contador */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span>Mostrando</span>
          <span className="font-mono font-bold text-white">
            {filteredProperties.length}
          </span>
          <span>de {TECH_LUXURY_PROPERTIES.length} imóveis exclusivos</span>
        </div>

        {(filters.bairro ||
          filters.dormitorios ||
          filters.piscina ||
          filters.areaMin ||
          selectedCategory !== "todos") && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300"
          >
            <X className="h-3.5 w-3.5" />
            <span>Limpar filtros aplicados</span>
          </button>
        )}
      </div>

      {/* Grid de Imóveis */}
      {filteredProperties.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProperties.map((prop) => (
            <TechPropertyCard
              key={prop.id}
              property={prop}
              onOpenScheduler={onOpenScheduler}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-500 mb-4">
            <Filter className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white">
            Nenhuma propriedade encontrada
          </h3>
          <p className="mt-2 text-sm text-zinc-400 max-w-md">
            Não encontramos imóveis que atendam a todos os critérios selecionados no momento. Tente relaxar os filtros ou fale com nosso concierge.
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="mt-6 rounded-xl bg-cyan-500/20 border border-cyan-500/40 px-5 py-2.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/30"
          >
            Redefinir Filtros
          </button>
        </div>
      )}
    </section>
  );
}
