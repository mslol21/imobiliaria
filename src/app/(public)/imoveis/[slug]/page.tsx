import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BedDouble,
  Bath,
  CarFront,
  Maximize2,
  MapPin,
  CheckCircle2,
  Sparkles,
  Building2,
  ShieldAlert,
  ChevronRight,
  Compass,
  PawPrint,
  Sofa,
  Layers,
} from "lucide-react";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { PropertyLeadCard } from "@/components/properties/property-lead-card";
import { PropertyCard } from "@/components/properties/property-card";
import { Badge } from "@/components/ui/badge";
import {
  getPropertyBySlug,
  getRelatedProperties,
} from "@/services/property.service";
import { getSiteSettings } from "@/services/settings.service";
import {
  AVAILABILITY_STATUS_LABELS,
  PROPERTY_PURPOSE_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/config/design-tokens";
import {
  formatArea,
  formatCurrencyBRL,
  getCoverImage,
} from "@/lib/utils";

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Imóvel não encontrado",
    };
  }

  const cover = getCoverImage(property);
  const title =
    property.meta_title ||
    `${property.title} — ${property.neighborhood}, ${property.city} (${property.reference_code})`;
  const description =
    property.meta_description ||
    property.short_description ||
    property.description.slice(0, 160);

  return {
    title,
    description,
    alternates: {
      canonical: `/imoveis/${property.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/imoveis/${property.slug}`,
      images: [
        {
          url: cover.url,
          width: 1200,
          height: 630,
          alt: cover.alt,
        },
      ],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const [relatedProperties, settings] = await Promise.all([
    getRelatedProperties(property, 3),
    getSiteSettings(),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const publicPropertyUrl = `${siteUrl}/imoveis/${property.slug}`;
  const cover = getCoverImage(property);

  const mapQuery = property.hide_exact_address
    ? `${property.neighborhood}, ${property.city} - ${property.state}, Brasil`
    : `${property.street || ""} ${property.street_number || ""}, ${property.neighborhood}, ${property.city} - ${property.state}, Brasil`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.short_description || property.description,
    url: publicPropertyUrl,
    image: property.images.map((i) => i.url).length
      ? property.images.map((i) => i.url)
      : [cover.url],
    identifier: property.reference_code,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city,
      addressRegion: property.state,
      addressCountry: "BR",
      ...(property.hide_exact_address
        ? {}
        : {
            streetAddress: `${property.street ?? ""} ${property.street_number ?? ""}`.trim(),
            postalCode: property.zip_code ?? undefined,
          }),
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: property.sale_price ?? property.rent_price ?? undefined,
      availability:
        property.availability_status === "disponivel"
          ? "https://schema.org/InStock"
          : "https://schema.org/LimitedAvailability",
    },
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb e Barra de Identificação */}
      <div className="border-b border-[#E5E5E5] bg-[#F5F5F5]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 text-xs text-[#737373] sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-cyan-700">
              Início
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              href={property.purpose === "aluguel" ? "/alugar" : "/comprar"}
              className="hover:text-cyan-700"
            >
              {property.purpose === "aluguel" ? "Alugar" : "Comprar"}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#242424] font-medium truncate max-w-[240px] sm:max-w-md">
              {property.title}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <span className="rounded-md bg-white px-2.5 py-1 font-semibold text-[#242424] border border-[#E5E5E5]">
              Código: {property.reference_code}
            </span>
            <Badge
              variant={
                property.availability_status === "disponivel"
                  ? "success"
                  : "warning"
              }
            >
              {AVAILABILITY_STATUS_LABELS[property.availability_status]}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Cabeçalho do Imóvel */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">
                {PROPERTY_PURPOSE_LABELS[property.purpose]}
              </Badge>
              <Badge variant="gray">
                {PROPERTY_TYPE_LABELS[property.property_type]}
              </Badge>
              {(property.is_high_end ||
                property.property_type === "alto_padrao") && (
                <Badge variant="outline" className="border-cyan-700/40 text-cyan-700">
                  <Sparkles className="h-3 w-3" />
                  <span>Alto Padrão</span>
                </Badge>
              )}
            </div>

            <h1 className="font-editorial text-3xl font-semibold leading-tight text-[#242424] sm:text-4xl lg:text-5xl">
              {property.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-sm text-[#737373]">
              <MapPin className="h-4 w-4 text-cyan-700" />
              <span>
                {property.hide_exact_address
                  ? `${property.neighborhood}, ${property.city} â€” ${property.state}`
                  : `${property.street || ""}, ${property.street_number || ""} â€” ${property.neighborhood}, ${property.city}/${property.state}`}
              </span>
            </div>
          </div>

          {/* Valores Comerciais */}
          <div className="lg:col-span-4 rounded-2xl border-2 border-cyan-700/60 bg-gradient-to-br from-cyan-950 via-slate-900 to-cyan-900 text-white p-6 shadow-xl">
            <div className="space-y-3">
              {property.sale_price && property.sale_price > 0 && (
                <div className="flex items-baseline justify-between border-b border-cyan-800/60 pb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    Valor de Venda
                  </span>
                  <span className="font-editorial text-2xl sm:text-3xl font-extrabold text-white">
                    {formatCurrencyBRL(property.sale_price)}
                  </span>
                </div>
              )}

              {property.rent_price && property.rent_price > 0 && (
                <div className="flex items-baseline justify-between border-b border-cyan-800/60 pb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                    Locação Mensal
                  </span>
                  <span className="font-editorial text-2xl sm:text-3xl font-extrabold text-white">
                    {formatCurrencyBRL(property.rent_price)}
                    <small className="ml-1 font-sans text-xs font-medium text-cyan-200">
                      /mês
                    </small>
                  </span>
                </div>
              )}

              <div className="pt-1 grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-cyan-300 font-semibold">
                    Condomínio
                  </span>
                  <strong className="font-bold text-white text-sm">
                    {property.condo_fee && property.condo_fee > 0
                      ? `${formatCurrencyBRL(property.condo_fee)}/mês`
                      : "Sob consulta / Isento"}
                  </strong>
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-cyan-300 font-semibold">
                    IPTU ({property.iptu_periodicity})
                  </span>
                  <strong className="font-bold text-white text-sm">
                    {property.iptu_periodicity === "isento"
                      ? "Isento"
                      : property.iptu_price && property.iptu_price > 0
                        ? formatCurrencyBRL(property.iptu_price)
                        : "Sob consulta"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layout: Conteúdo (Esquerda) + Conversão (Direita) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-10">
            {/* Galeria de Fotos */}
            <PropertyGallery
              images={property.images}
              propertyTitle={property.title}
            />

            {/* Ficha Técnica */}
            <section
              aria-label="Características principais do imóvel"
              className="rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 className="font-editorial text-2xl font-semibold text-[#242424] mb-6">
                Ficha Técnica da Propriedade
              </h2>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                <div className="rounded-xl bg-[#F5F5F5] p-4 border border-[#E5E5E5]">
                  <div className="flex items-center gap-2 text-[#242424]">
                    <Maximize2 className="h-4 w-4 text-cyan-700" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Área Ãštil
                    </span>
                  </div>
                  <p className="mt-1.5 text-lg font-bold text-[#242424]">
                    {formatArea(property.usable_area)}
                  </p>
                </div>

                <div className="rounded-xl bg-[#F5F5F5] p-4 border border-[#E5E5E5]">
                  <div className="flex items-center gap-2 text-[#242424]">
                    <Compass className="h-4 w-4 text-cyan-700" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Área Total
                    </span>
                  </div>
                  <p className="mt-1.5 text-lg font-bold text-[#242424]">
                    {formatArea(property.total_area ?? property.built_area)}
                  </p>
                </div>

                <div className="rounded-xl bg-[#F5F5F5] p-4 border border-[#E5E5E5]">
                  <div className="flex items-center gap-2 text-[#242424]">
                    <BedDouble className="h-4 w-4 text-cyan-700" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Dormitórios
                    </span>
                  </div>
                  <p className="mt-1.5 text-lg font-bold text-[#242424]">
                    {property.bedrooms}{" "}
                    <span className="text-xs font-normal text-[#737373]">
                      ({property.suites} suítes)
                    </span>
                  </p>
                </div>

                <div className="rounded-xl bg-[#F5F5F5] p-4 border border-[#E5E5E5]">
                  <div className="flex items-center gap-2 text-[#242424]">
                    <Bath className="h-4 w-4 text-cyan-700" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Banheiros
                    </span>
                  </div>
                  <p className="mt-1.5 text-lg font-bold text-[#242424]">
                    {property.bathrooms}
                  </p>
                </div>

                <div className="rounded-xl bg-[#F5F5F5] p-4 border border-[#E5E5E5]">
                  <div className="flex items-center gap-2 text-[#242424]">
                    <CarFront className="h-4 w-4 text-cyan-700" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Vagas
                    </span>
                  </div>
                  <p className="mt-1.5 text-lg font-bold text-[#242424]">
                    {property.parking_spots}
                  </p>
                </div>

                {property.floor_number !== null && (
                  <div className="rounded-xl bg-[#F5F5F5] p-4 border border-[#E5E5E5]">
                    <div className="flex items-center gap-2 text-[#242424]">
                      <Layers className="h-4 w-4 text-cyan-700" />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Andar
                      </span>
                    </div>
                    <p className="mt-1.5 text-lg font-bold text-[#242424]">
                      {property.floor_number}º andar
                    </p>
                  </div>
                )}

                <div className="rounded-xl bg-[#F5F5F5] p-4 border border-[#E5E5E5]">
                  <div className="flex items-center gap-2 text-[#242424]">
                    <Sofa className="h-4 w-4 text-cyan-700" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Mobiliado
                    </span>
                  </div>
                  <p className="mt-1.5 text-lg font-bold text-[#242424]">
                    {property.is_furnished ? "Sim" : "Não"}
                  </p>
                </div>

                <div className="rounded-xl bg-[#F5F5F5] p-4 border border-[#E5E5E5]">
                  <div className="flex items-center gap-2 text-[#242424]">
                    <PawPrint className="h-4 w-4 text-cyan-700" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Pet Friendly
                    </span>
                  </div>
                  <p className="mt-1.5 text-lg font-bold text-[#242424]">
                    {property.is_pet_friendly ? "Aceita pets" : "Consultar"}
                  </p>
                </div>
              </div>
            </section>

            {/* Descrição e Diferenciais */}
            <section
              aria-label="Descrição completa do imóvel"
              className="rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div>
                <h2 className="font-editorial text-2xl font-semibold text-[#242424]">
                  Sobre a Propriedade
                </h2>
                <div className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-[#242424]/90 whitespace-pre-line">
                  {property.description}
                </div>
              </div>

              {property.highlights.length > 0 && (
                <div className="border-t border-[#E5E5E5] pt-6">
                  <h3 className="font-editorial text-xl font-semibold text-[#242424] mb-4">
                    Diferenciais em Destaque
                  </h3>
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {property.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-2.5 rounded-xl bg-[#F5F5F5] p-3.5 text-sm text-[#242424]"
                      >
                        <Sparkles className="h-4 w-4 text-cyan-700 shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {property.amenities.length > 0 && (
                <div className="border-t border-[#E5E5E5] pt-6">
                  <h3 className="font-editorial text-xl font-semibold text-[#242424] mb-4">
                    Comodidades e Infraestrutura
                  </h3>
                  <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                    {property.amenities.map((amenity) => (
                      <li
                        key={amenity}
                        className="flex items-center gap-2 text-sm text-[#737373]"
                      >
                        <CheckCircle2 className="h-4 w-4 text-cyan-700 shrink-0" />
                        <span>{amenity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Localização e Privacidade */}
            <section
              aria-label="Localização do imóvel"
              className="rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-8 shadow-xs space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-editorial text-2xl font-semibold text-[#242424]">
                    Localização
                  </h2>
                  <p className="text-sm text-[#737373] mt-1">
                    {property.neighborhood} â€¢ {property.city}, {property.state}
                    {!property.hide_exact_address && property.street
                      ? ` â€” ${property.street}, ${property.street_number || "S/N"}`
                      : ""}
                  </p>
                </div>

                {property.hide_exact_address && (
                  <div className="inline-flex items-center gap-2 rounded-lg bg-[#F5F5F5] px-3 py-2 text-xs text-[#242424] border border-[#E5E5E5]">
                    <ShieldAlert className="h-4 w-4 text-cyan-700 shrink-0" />
                    <span>
                      Endereço exato sob consulta para preservar a privacidade
                    </span>
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#F5F5F5] h-80 w-full">
                <iframe
                  title={`Mapa de localização em ${property.neighborhood}, ${property.city}`}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    mapQuery
                  )}&output=embed`}
                  className="border-0 w-full h-full"
                />
              </div>
            </section>
          </div>

          {/* Coluna Lateral: Conversão e Atendimento */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <PropertyLeadCard
                property={property}
                agencyWhatsapp={settings.whatsapp}
                publicPropertyUrl={publicPropertyUrl}
              />

              <div className="rounded-2xl border border-[#E5E5E5] bg-[#242424] p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-700 text-white">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-lg font-semibold">
                      Assessoria Integral
                    </h3>
                    <p className="text-xs text-[#D4D4D4]">
                      {settings.agency_name || "Consultoria Especializada"}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[#D4D4D4]">
                  Todas as visitas são privativas e acompanhadas por um consultor experiente. Solicite plantas, certidões e condições comerciais completas.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Imóveis Semelhantes */}
        {relatedProperties.length > 0 && (
          <section
            aria-label="Imóveis semelhantes"
            className="mt-20 border-t border-[#E5E5E5] pt-16"
          >
            <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                  Recomendações
                </span>
                <h2 className="font-editorial mt-1 text-3xl font-semibold text-[#242424]">
                  Imóveis Semelhantes
                </h2>
              </div>
              <Link
                href={property.purpose === "aluguel" ? "/alugar" : "/comprar"}
                className="text-sm font-semibold text-cyan-700 hover:underline"
              >
                Ver mais opções â†’
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {relatedProperties.map((rel) => (
                <PropertyCard key={rel.id} property={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

