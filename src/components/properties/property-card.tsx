import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BedDouble,
  Bath,
  CarFront,
  Maximize2,
  MapPin,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
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

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B5121B] hover:shadow-[0_16px_36px_rgba(181,18,27,0.08)]">
      {/* Fotografia Principal */}
      <Link
        href={`/imoveis/${property.slug}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-[#F5F5F5] block"
        aria-label={`Ver detalhes de ${property.title}`}
      >
        <Image
          src={cover.url}
          alt={cover.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
          aria-hidden="true"
        />

        {/* Badges Superiores */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="default" className="shadow-sm">
              {PROPERTY_PURPOSE_LABELS[property.purpose]}
            </Badge>
            {(property.is_high_end || property.property_type === "alto_padrao") && (
              <Badge variant="outline" className="shadow-sm border-white/80 bg-white/95 text-[#B5121B]">
                <Sparkles className="h-3 w-3" />
                <span>Alto Padrão</span>
              </Badge>
            )}
          </div>
          <span className="rounded-md bg-black/65 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-white backdrop-blur-sm">
            {property.reference_code}
          </span>
        </div>

        {/* Tipo + Valor sobreposto */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between gap-2 text-white">
          <div>
            <span className="block text-[11px] font-medium uppercase tracking-widest text-[#E5E5E5]">
              {PROPERTY_TYPE_LABELS[property.property_type]}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-editorial text-2xl font-bold tracking-tight text-white">
                {priceInfo.value}
              </span>
              {priceInfo.suffix && (
                <span className="text-xs text-[#E5E5E5]">
                  {priceInfo.suffix}
                </span>
              )}
            </div>
          </div>
          {property.availability_status === "reservado" && (
            <Badge variant="warning">Reservado</Badge>
          )}
        </div>
      </Link>

      {/* Conteúdo do Card */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div className="space-y-2.5">
          {/* Localização */}
          <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#737373]">
            <span className="inline-flex items-center gap-1.5 truncate">
              <MapPin className="h-3.5 w-3.5 text-[#B5121B] shrink-0" />
              <span className="truncate">
                {property.neighborhood}, {property.city} — {property.state}
              </span>
            </span>
            {property.is_dev_preview && (
              <span
                title="Imóvel demonstrativo"
                className="shrink-0 rounded bg-red-50 border border-red-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[#B5121B]"
              >
                Demonstração
              </span>
            )}
          </div>

          {/* Título */}
          <h3 className="font-editorial text-xl font-semibold leading-snug text-[#242424] group-hover:text-[#B5121B] transition-colors line-clamp-2">
            <Link href={`/imoveis/${property.slug}`}>{property.title}</Link>
          </h3>

          {/* Condomínio ou resumo */}
          {property.condo_fee && property.condo_fee > 0 ? (
            <p className="text-xs text-[#737373]">
              Condomínio: {formatCurrencyBRL(property.condo_fee)}/mês
            </p>
          ) : (
            <p className="text-xs text-[#737373] line-clamp-1">
              {property.short_description || "Visitas com agendamento prévio"}
            </p>
          )}
        </div>

        {/* Especificações Físicas */}
        <div className="mt-5 grid grid-cols-4 gap-2 border-y border-[#E5E5E5] py-3.5 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-xs font-semibold text-[#242424]">
              <Maximize2 className="h-3.5 w-3.5 text-[#B5121B]" />
              <span>{formatArea(property.usable_area ?? property.total_area)}</span>
            </div>
            <span className="text-[10px] text-[#737373]">Área útil</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-xs font-semibold text-[#242424]">
              <BedDouble className="h-3.5 w-3.5 text-[#B5121B]" />
              <span>{property.bedrooms}</span>
            </div>
            <span className="text-[10px] text-[#737373]">
              {property.suites > 0 ? `${property.suites} suítes` : "Dorms"}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-xs font-semibold text-[#242424]">
              <Bath className="h-3.5 w-3.5 text-[#B5121B]" />
              <span>{property.bathrooms}</span>
            </div>
            <span className="text-[10px] text-[#737373]">Banh.</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-xs font-semibold text-[#242424]">
              <CarFront className="h-3.5 w-3.5 text-[#B5121B]" />
              <span>{property.parking_spots}</span>
            </div>
            <span className="text-[10px] text-[#737373]">Vagas</span>
          </div>
        </div>

        {/* Ação */}
        <div className="mt-4">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="w-full justify-between group-hover:bg-[#B5121B] group-hover:text-white group-hover:border-[#B5121B]"
          >
            <Link href={`/imoveis/${property.slug}`}>
              <span>Visualizar imóvel</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
