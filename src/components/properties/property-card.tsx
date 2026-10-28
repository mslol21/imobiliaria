import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BedDouble,
  Bath,
  CarFront,
  Maximize2,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  cn,
  formatArea,
  formatCurrencyBRL,
  getCoverImage,
  getPrimaryPriceLabel,
} from "@/lib/utils";
import {
  PROPERTY_PURPOSE_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/config/design-tokens";
import type { Property } from "@/types/domain";

interface PropertyCardProps {
  property: Property;
  preferredPurpose?: "venda" | "aluguel";
  priority?: boolean;
}

export function PropertyCard({
  property,
  preferredPurpose,
  priority = false,
}: PropertyCardProps) {
  const cover = getCoverImage(property);
  const priceInfo = getPrimaryPriceLabel(property, preferredPurpose);

  const purposeBadgeClass =
    property.purpose === "aluguel"
      ? "bg-zinc-700 text-white"
      : property.purpose === "ambos"
        ? "bg-zinc-800 text-white"
        : "bg-cyan-700 text-white";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-xs transition-all duration-300 hover:border-zinc-300 hover:shadow-md">
      {/* Fotografia Principal */}
      <Link
        href={`/imoveis/${property.slug}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 block"
        aria-label={`Ver imóvel: ${property.title}`}
      >
        <Image
          src={cover.url}
          alt={cover.alt || property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
          aria-hidden="true"
        />

        {/* Badges Superiores */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-semibold shadow-sm",
                purposeBadgeClass
              )}
            >
              {PROPERTY_PURPOSE_LABELS[property.purpose]}
            </span>
            {(property.is_high_end || property.property_type === "alto_padrao") && (
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                <Sparkles className="h-3 w-3 text-white" />
                <span>Alto Padrão</span>
              </span>
            )}
          </div>
          <span className="rounded-md bg-black/65 px-2 py-0.5 text-[11px] font-semibold tracking-wider text-white backdrop-blur-xs">
            {property.reference_code}
          </span>
        </div>

        {property.availability_status === "reservado" && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="warning">Reservado</Badge>
          </div>
        )}
      </Link>

      {/* Conteúdo do Card */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-2.5">
          {/* Tipo e Localização */}
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-md bg-cyan-50/90 border border-cyan-200/80 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-cyan-800">
              {PROPERTY_TYPE_LABELS[property.property_type]}
            </span>
            <div className="inline-flex items-center gap-1 text-xs text-zinc-600 truncate max-w-[60%]">
              <MapPin className="h-3.5 w-3.5 text-cyan-700 shrink-0" />
              <span className="truncate">
                {property.neighborhood}, {property.city}
              </span>
            </div>
          </div>

          {/* Preço em Destaque */}
          <div className="pt-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-cyan-950 group-hover:text-cyan-700 transition-colors">
                {priceInfo.value}
              </span>
              {priceInfo.suffix && (
                <span className="text-xs font-semibold text-cyan-700">
                  {priceInfo.suffix}
                </span>
              )}
            </div>
            {property.condo_fee && property.condo_fee > 0 ? (
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Condomínio: {formatCurrencyBRL(property.condo_fee)}/mês
              </p>
            ) : null}
          </div>

          {/* Título do Imóvel */}
          <h3 className="text-base font-semibold leading-snug text-zinc-900 group-hover:text-cyan-700 transition-colors line-clamp-1">
            <Link href={`/imoveis/${property.slug}`}>{property.title}</Link>
          </h3>
        </div>

        {/* Especificações Físicas: Área, Dorms, Banheiros, Vagas */}
        <div className="mt-4 grid grid-cols-4 gap-2 rounded-xl bg-slate-50/80 border border-zinc-100 py-2.5 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-xs font-bold text-zinc-800">
              <Maximize2 className="h-3.5 w-3.5 text-cyan-700" />
              <span>{formatArea(property.usable_area ?? property.total_area)}</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-medium">Área</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-xs font-bold text-zinc-800">
              <BedDouble className="h-3.5 w-3.5 text-cyan-700" />
              <span>{property.bedrooms}</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-medium">
              {property.suites > 0 ? `${property.suites} suítes` : "Dorms"}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-xs font-bold text-zinc-800">
              <Bath className="h-3.5 w-3.5 text-cyan-700" />
              <span>{property.bathrooms}</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-medium">Banh.</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-xs font-bold text-zinc-800">
              <CarFront className="h-3.5 w-3.5 text-cyan-700" />
              <span>{property.parking_spots}</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-medium">Vagas</span>
          </div>
        </div>

        {/* Botão Ver Imóvel */}
        <div className="mt-4">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="w-full justify-center bg-cyan-50/70 text-cyan-800 border border-cyan-200/90 hover:bg-cyan-700 hover:text-white hover:border-transparent transition-all duration-200 font-semibold shadow-xs"
          >
            <Link href={`/imoveis/${property.slug}`}>
              <span>Ver detalhes</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
