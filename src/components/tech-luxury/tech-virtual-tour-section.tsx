"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Compass,
  Layers,
  MapPin,
  Camera,
  Maximize2,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { TECH_LUXURY_PROPERTIES } from "@/data/tech-luxury-mock";
import { BorderBeam } from "@/components/magicui/border-beam";

import type { Hotspot360 } from "@/types/tech-luxury";

type ViewMode = "360" | "fotos" | "planta" | "mapa";

const FALLBACK_HOTSPOT: Hotspot360 = {
  id: "default",
  name: "Rooftop Sky Lounge",
  label: "Pavimento Superior",
  imageUrl:
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=85",
  description: "Deck em madeira Cumaru, piscina em balanço e vista permanente para o Parque do Povo.",
  features: ["Borda infinita", "Fire pit automatizado", "Bar molhado", "Sauna envidraçada"],
};

export function TechVirtualTourSection({
  onOpenScheduler,
}: {
  onOpenScheduler?: () => void;
}) {
  const property = TECH_LUXURY_PROPERTIES[0]!; // Cobertura Triplex Lumina
  const [activeTab, setActiveTab] = useState<ViewMode>("360");
  const [activeHotspotIndex, setActiveHotspotIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hotspots = property.hotspots360 || [];
  const currentHotspot = hotspots[activeHotspotIndex] ?? hotspots[0] ?? FALLBACK_HOTSPOT;

  return (
    <section id="tour-virtual" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header da Seção */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3.5 py-1 text-xs font-mono text-cyan-300 mb-4">
          <Compass className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "12s" }} />
          <span>IMERSÃO VIRTUAL EM ALTA DEFINIÇÃO</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Visualizador Arquitetônico
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 font-light">
          Navegue pelas áreas sociais e privativas da Cobertura Triplex Lumina com
          perspectivas em 360°, plantas técnicas e mapa satélite do entorno nobre.
        </p>
      </div>

      {/* Container Principal do Visualizador */}
      <div
        className={`relative rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.9)] transition-all ${
          isFullscreen ? "fixed inset-4 z-50 rounded-2xl" : ""
        }`}
      >
        <BorderBeam size={180} duration={16} colorFrom="#06b6d4" colorTo="#3b82f6" />

        {/* Barra Superior de Controles e Abas */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-900/80 px-6 py-4 backdrop-blur-md">
          {/* Título do Imóvel Selecionado */}
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            <div>
              <span className="text-xs font-bold text-white tracking-wide">
                {property.title}
              </span>
              <span className="hidden sm:inline text-xs text-zinc-500 ml-2">
                — {property.neighborhood}, {property.city}
              </span>
            </div>
          </div>

          {/* Abas Interativas ("360°", "Fotos", "Planta", "Mapa") */}
          <div className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950/80 p-1">
            {[
              { id: "360", label: "Tour 360°", icon: Compass },
              { id: "fotos", label: "Fotos 4K", icon: Camera },
              { id: "planta", label: "Planta Humanizada", icon: Layers },
              { id: "mapa", label: "Localização", icon: MapPin },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as ViewMode)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? "bg-cyan-500 text-zinc-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Botão de Tela Cheia */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700"
            title={isFullscreen ? "Sair da tela cheia" : "Modo tela cheia"}
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Viewport Interativo Principal */}
        <div className="relative aspect-[16/9] min-h-[380px] sm:min-h-[500px] w-full overflow-hidden bg-zinc-900">
          {/* TAB 1: TOUR 360° INTERATIVO */}
          {activeTab === "360" && (
            <div className="relative h-full w-full">
              <Image
                src={currentHotspot.imageUrl}
                alt={currentHotspot.name}
                fill
                className="object-cover transition-opacity duration-700"
              />

              {/* Overlay ambiente escuro suave */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

              {/* Marcadores de Hotspots Interativos Flutuantes */}
              <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/80 text-zinc-950 shadow-[0_0_20px_#06b6d4] animate-pulse">
                  <Info className="h-4 w-4" />
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-xl border border-zinc-700 bg-zinc-950/90 p-2.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md pointer-events-none">
                  <span className="font-bold text-cyan-300 block">
                    {currentHotspot.features[0] || "Ponto de Destaque"}
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Clique nos ambientes abaixo para navegar.
                  </span>
                </div>
              </div>

              {/* Card Inferior Flutuante com Detalhes do Ambiente */}
              <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/85 p-5 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                    {currentHotspot.label}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    Vista Panorâmica Ativa
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {currentHotspot.name}
                </h3>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                  {currentHotspot.description}
                </p>

                {/* Tags de características */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {currentHotspot.features.map((feat, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-md bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300"
                    >
                      <CheckCircle2 className="h-2.5 w-2.5 text-cyan-400" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Seletor de Ambientes 360 na direita */}
              <div className="hidden sm:flex absolute top-6 right-6 flex-col gap-2 z-20">
                <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider bg-black/60 px-2 py-1 rounded">
                  Trocar Ambiente
                </span>
                {hotspots.map((hs, idx) => (
                  <button
                    key={hs.id}
                    type="button"
                    onClick={() => setActiveHotspotIndex(idx)}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2 text-xs font-medium backdrop-blur-md transition-all ${
                      idx === activeHotspotIndex
                        ? "border-cyan-500 bg-cyan-950/80 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    <span>{hs.name}</span>
                    <ChevronRight className="h-3 w-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: GALERIA DE FOTOS 4K */}
          {activeTab === "fotos" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 h-full gap-2 p-4 overflow-y-auto">
              {property.images.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 group"
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-2 left-2 right-2 text-[10px] text-white font-medium bg-black/70 px-2 py-1 rounded truncate">
                    {img.alt}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PLANTA HUMANIZADA */}
          {activeTab === "planta" && (
            <div className="relative h-full w-full flex items-center justify-center bg-zinc-950 p-6">
              <div className="relative w-full max-w-3xl aspect-[16/10] rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900">
                <Image
                  src={
                    property.floorPlanUrl ||
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
                  }
                  alt="Planta humanizada do pavimento"
                  fill
                  className="object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-cyan-950/20 mix-blend-overlay" />
                <div className="absolute bottom-4 left-4 rounded-xl border border-zinc-700 bg-zinc-950/90 p-3 text-xs text-zinc-200 backdrop-blur-md">
                  <span className="font-bold text-white block">
                    Layout Arquitetônico — 860 m²
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    5 Suítes com isolamento acústico • Living Integrado • Deck Spa
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LOCALIZAÇÃO & SATÉLITE */}
          {activeTab === "mapa" && (
            <div className="relative h-full w-full flex items-center justify-center bg-zinc-950 p-6">
              <div className="relative w-full h-full rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900">
                <iframe
                  title="Localização do Imóvel"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    property.neighborhood + ", " + property.city + " - SP, Brasil"
                  )}&output=embed`}
                />
                <div className="absolute top-4 left-4 rounded-xl border border-zinc-800 bg-zinc-950/90 px-4 py-2.5 text-xs backdrop-blur-md">
                  <span className="font-bold text-cyan-300 block">
                    Itaim Bibi — Região Nobre
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Próximo ao Parque do Povo e Polo Faria Lima
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do Visualizador com CTA de Agendamento */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800 bg-zinc-950 px-6 py-4">
          <div className="text-xs text-zinc-400">
            Deseja uma visita presencial guiada por especialista com sigilo garantido?
          </div>
          <button
            type="button"
            onClick={onOpenScheduler}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-zinc-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all hover:bg-cyan-400 active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Agendar Experiência Privativa</span>
          </button>
        </div>
      </div>
    </section>
  );
}
