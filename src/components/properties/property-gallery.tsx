"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PropertyImage } from "@/types/domain";

interface PropertyGalleryProps {
  images: PropertyImage[];
  propertyTitle: string;
}

export function PropertyGallery({
  images,
  propertyTitle,
}: PropertyGalleryProps) {
  const galleryList: PropertyImage[] =
    images.length > 0
      ? images
      : [
          {
            id: "fallback-cover",
            property_id: "",
            storage_path: null,
            url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
            alt_text: propertyTitle,
            is_cover: true,
            display_order: 0,
            file_size: null,
            mime_type: "image/jpeg",
            created_at: "",
          },
        ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const total = galleryList.length;
  const activeImage = galleryList[activeIndex] ?? galleryList[0]!;

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, goPrev, goNext]);

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0]?.clientX ?? null);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX;
    const delta = touchStartX - endX;
    if (Math.abs(delta) > 45) {
      if (delta > 0) goNext();
      else goPrev();
    }
    setTouchStartX(null);
  }

  return (
    <div className="space-y-3">
      {/* Fotografia Principal Ampla */}
      <div
        className="group relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#F5F5F5] border border-[#E5E5E5]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={activeImage.url}
          alt={activeImage.alt_text || propertyTitle}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="object-cover transition-all duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15 pointer-events-none" />

        {/* Contador e Botão Lightbox */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <Camera className="h-3.5 w-3.5 text-cyan-700" />
            <span>
              {activeIndex + 1} / {total}
            </span>
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setLightboxOpen(true)}
            className="bg-white/95 text-[#242424] hover:bg-white shadow-md border-0"
          >
            <Expand className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tela cheia</span>
          </Button>
        </div>

        {/* Controles Laterais */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Fotografia anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#242424] shadow-md transition-transform hover:scale-105 hover:text-cyan-700 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Próxima fotografia"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#242424] shadow-md transition-transform hover:scale-105 hover:text-cyan-700 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Legenda */}
        {activeImage.alt_text && (
          <div className="absolute bottom-3 left-4 right-4">
            <p className="inline-block rounded-md bg-black/60 px-3 py-1 text-xs text-white/95 backdrop-blur-xs">
              {activeImage.alt_text}
            </p>
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {total > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {galleryList.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Selecionar fotografia ${idx + 1}`}
              className={cn(
                "relative h-20 w-28 sm:h-24 sm:w-36 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer",
                idx === activeIndex
                  ? "border-cyan-700 ring-2 ring-cyan-600/30 opacity-100"
                  : "border-transparent opacity-65 hover:opacity-100"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt_text || `${propertyTitle} - Foto ${idx + 1}`}
                fill
                sizes="144px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal em Tela Cheia */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria em tela cheia: ${propertyTitle}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-center justify-between px-4 py-4 sm:px-8 text-white">
            <div className="text-sm font-medium">
              <span className="text-cyan-700 font-semibold">
                {activeIndex + 1} / {total}
              </span>{" "}
              â€” {activeImage.alt_text || propertyTitle}
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Fechar galeria em tela cheia"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center px-4 sm:px-16">
            <div className="relative h-[72dvh] w-full max-w-6xl">
              <Image
                src={activeImage.url}
                alt={activeImage.alt_text || propertyTitle}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Anterior"
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 cursor-pointer"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Próxima"
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 cursor-pointer"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Miniaturas no Lightbox */}
          <div className="flex justify-center gap-2 overflow-x-auto px-4 py-4">
            {galleryList.map((img, idx) => (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer",
                  idx === activeIndex
                    ? "border-cyan-700 opacity-100"
                    : "border-transparent opacity-50 hover:opacity-80"
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt_text || propertyTitle}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

