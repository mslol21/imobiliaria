"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bed,
  Bath,
  Car,
  Ruler,
  MapPin,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Eye,
  Calendar,
} from "lucide-react";
import { CardSpotlight } from "@/components/magicui/card-spotlight";
import type { TechProperty } from "@/types/tech-luxury";
import { formatCurrencyBRL } from "@/lib/utils";

interface TechPropertyCardProps {
  property: TechProperty;
  onOpenScheduler?: (property: TechProperty) => void;
}

export function TechPropertyCard({
  property,
  onOpenScheduler,
}: TechPropertyCardProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHeartPulsing, setIsHeartPulsing] = useState(false);

  const images = property.images && property.images.length > 0
    ? property.images
    : [{ id: "fallback", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", alt: property.title }];

  const activeImg = images[activeImageIndex] ?? images[0] ?? {
    id: "fallback",
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    alt: property.title,
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    setIsHeartPulsing(true);
    setTimeout(() => setIsHeartPulsing(false), 500);
  };

  const priceFormatted =
    property.purpose === "aluguel"
      ? `${formatCurrencyBRL(property.rentPrice || 0)} / mês`
      : formatCurrencyBRL(property.salePrice || 0);

  return (
    <CardSpotlight
      radius={350}
      color="rgba(6, 182, 212, 0.14)"
      className="group flex flex-col h-full rounded-2xl border border-zinc-800/80 bg-zinc-950/70 shadow-lg hover:shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
    >
      {/* Container da Imagem com Carrossel de Fotos */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
        <Image
          src={activeImg.url}
          alt={activeImg.alt || property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradiente escuro para legibilidade superior */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-black/40 pointer-events-none" />

        {/* Badge de Status / Coleção */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-zinc-950/80 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-cyan-300 backdrop-blur-md shadow-md">
          <Sparkles className="h-3 w-3 text-cyan-400" />
          <span>{property.badge}</span>
        </div>

        {/* Botão de Favoritar com Animação de Pulso */}
        <button
          type="button"
          onClick={toggleFavorite}
          aria-label={isFavorited ? "Remover dos favoritos" : "Salvar nos favoritos"}
          className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 ${
            isFavorited
              ? "border-rose-500/60 bg-rose-950/80 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              : "border-zinc-700/80 bg-zinc-950/70 text-zinc-300 hover:text-white hover:border-zinc-500"
          } ${isHeartPulsing ? "scale-125" : "scale-100"}`}
        >
          <Heart
            className={`h-4 w-4 transition-transform ${
              isFavorited ? "fill-rose-500 text-rose-500" : ""
            }`}
          />
        </button>

        {/* Controles do Carrossel de Imagens */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/90"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Próxima foto"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/90"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Bullets Indicadores */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeImageIndex
                      ? "w-4 bg-cyan-400"
                      : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Código de Referência */}
        <div className="absolute bottom-3 right-3 text-[10px] font-mono tracking-widest text-zinc-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
          {property.referenceCode}
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="flex flex-col flex-1 p-5 justify-between">
        <div>
          {/* Localização & Arquiteto */}
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
            <span className="flex items-center gap-1 text-cyan-400 font-medium">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {property.neighborhood}, {property.city}
            </span>
            {property.architect && (
              <span className="text-[11px] font-mono text-zinc-500 truncate max-w-[130px]">
                {property.architect}
              </span>
            )}
          </div>

          {/* Título do Imóvel */}
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-zinc-100 line-clamp-1 group-hover:text-cyan-200 transition-colors">
            {property.title}
          </h3>

          {/* Subtítulo / Descrição Curta */}
          <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {property.shortDescription}
          </p>

          {/* Grid de Especificações com Ícones */}
          <div className="mt-4 grid grid-cols-4 gap-2 border-y border-zinc-800/80 py-3 text-center">
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-xs font-semibold text-zinc-200">
                <Ruler className="h-3.5 w-3.5 text-cyan-400" />
                {property.usableArea}
              </span>
              <span className="text-[10px] text-zinc-500">m² privativos</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-xs font-semibold text-zinc-200">
                <Bed className="h-3.5 w-3.5 text-cyan-400" />
                {property.bedrooms}
              </span>
              <span className="text-[10px] text-zinc-500">
                {property.suites > 0 ? `${property.suites} suítes` : "quartos"}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-xs font-semibold text-zinc-200">
                <Bath className="h-3.5 w-3.5 text-cyan-400" />
                {property.bathrooms}
              </span>
              <span className="text-[10px] text-zinc-500">banhos</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-xs font-semibold text-zinc-200">
                <Car className="h-3.5 w-3.5 text-cyan-400" />
                {property.parkingSpots}
              </span>
              <span className="text-[10px] text-zinc-500">vagas</span>
            </div>
          </div>
        </div>

        {/* Rodapé do Card: Preço e Botão de Ação */}
        <div className="mt-5 pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Valor de {property.purpose === "aluguel" ? "Locação" : "Investimento"}
            </span>
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">
              {priceFormatted}
            </span>
            {property.condoFee && (
              <span className="text-[10px] text-zinc-500">
                Cond: {formatCurrencyBRL(property.condoFee)}
              </span>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenScheduler?.(property)}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-3 text-xs font-medium text-cyan-200 transition-all hover:bg-cyan-500 hover:text-zinc-950 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Agendar</span>
            </button>

            <Link
              href={`#tour-virtual`}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-700"
              title="Visualizar Tour 360°"
            >
              <Eye className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </CardSpotlight>
  );
}
