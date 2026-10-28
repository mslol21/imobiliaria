"use client";

import React from "react";
import { useTechLuxury } from "@/context/tech-luxury-context";
import { TechHero } from "./tech-hero";
import { TechSearchBar } from "./tech-search-bar";
import { TechPropertiesSection } from "./tech-properties-section";
import { TechVirtualTourSection } from "./tech-virtual-tour-section";
import { TechBentoSection } from "./tech-bento-section";
import { TechStatsSection } from "./tech-stats-section";

export function TechLuxuryExperience() {
  const { filters, setFilters, openScheduler } = useTechLuxury();

  const handleSearchSubmit = () => {
    const el = document.getElementById("imoveis");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full bg-zinc-950 text-zinc-100 selection:bg-cyan-500 selection:text-zinc-950">
      {/* Hero Imersivo com Aurora Spotlight e Search Bar Integrada */}
      <TechHero>
        <TechSearchBar
          filters={filters}
          onChangeFilters={setFilters}
          onSearchSubmit={handleSearchSubmit}
        />
      </TechHero>

      {/* Grid de Imóveis Tech-Luxury com Spotlight Hover e Filtros Dinâmicos */}
      <TechPropertiesSection
        filters={filters}
        onChangeFilters={setFilters}
        onOpenScheduler={openScheduler}
      />

      {/* Visualizador Arquitetônico & Tour 360° Interativo com Tabs */}
      <TechVirtualTourSection onOpenScheduler={openScheduler} />

      {/* Bento Grid de Diferenciais e Automação IoT */}
      <TechBentoSection />

      {/* Estatísticas e Indicadores com Number Ticker Animado */}
      <TechStatsSection />
    </div>
  );
}
