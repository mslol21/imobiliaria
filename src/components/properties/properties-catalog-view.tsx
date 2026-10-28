import React from "react";
import Link from "next/link";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
} from "lucide-react";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyFiltersBar } from "@/components/properties/property-filters-bar";
import { Button } from "@/components/ui/button";
import type {
  PaginatedResult,
  Property,
  PropertyFilters,
} from "@/types/domain";

interface PropertiesCatalogViewProps {
  badgeLabel: string;
  title: string;
  subtitle: string;
  basePath: "/imoveis" | "/comprar" | "/alugar";
  lockedPurpose?: "venda" | "aluguel";
  filters: PropertyFilters;
  result: PaginatedResult<Property>;
  cities: string[];
  neighborhoods: string[];
}

function buildPageHref(
  basePath: string,
  filters: PropertyFilters,
  targetPage: number,
  lockedPurpose?: "venda" | "aluguel"
): string {
  const params = new URLSearchParams();

  if (!lockedPurpose && filters.finalidade && filters.finalidade !== "todos") {
    params.set("finalidade", filters.finalidade);
  }
  if (filters.tipo && filters.tipo !== "todos") {
    params.set("tipo", filters.tipo);
  }
  if (filters.cidade) params.set("cidade", filters.cidade);
  if (filters.bairro) params.set("bairro", filters.bairro);
  if (filters.busca) params.set("busca", filters.busca);
  if (filters.precoMin) params.set("precoMin", String(filters.precoMin));
  if (filters.precoMax) params.set("precoMax", String(filters.precoMax));
  if (filters.areaMin) params.set("areaMin", String(filters.areaMin));
  if (filters.areaMax) params.set("areaMax", String(filters.areaMax));
  if (filters.dormitorios)
    params.set("dormitorios", String(filters.dormitorios));
  if (filters.suites) params.set("suites", String(filters.suites));
  if (filters.banheiros) params.set("banheiros", String(filters.banheiros));
  if (filters.vagas) params.set("vagas", String(filters.vagas));
  if (filters.mobiliado) params.set("mobiliado", "true");
  if (filters.aceitaAnimais) params.set("aceitaAnimais", "true");
  if (filters.altoPadrao) params.set("altoPadrao", "true");
  if (filters.comodidades && filters.comodidades.length > 0) {
    params.set("comodidades", filters.comodidades.join(","));
  }
  if (filters.ordenar && filters.ordenar !== "recentes") {
    params.set("ordenar", filters.ordenar);
  }
  if (targetPage > 1) {
    params.set("pagina", String(targetPage));
  }

  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function PropertiesCatalogView({
  badgeLabel,
  title,
  subtitle,
  basePath,
  lockedPurpose,
  filters,
  result,
  cities,
  neighborhoods,
}: PropertiesCatalogViewProps) {
  return (
    <div className="min-h-screen bg-white pb-24 text-zinc-900">
      {/* Banner de Cabeçalho */}
      <div className="bg-zinc-900 text-white py-12 sm:py-16 border-b border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{badgeLabel}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-3xl">
            {title}
          </h1>
          <p className="mt-2.5 text-base sm:text-lg text-zinc-300 max-w-2xl">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Aviso de Modo Demonstração */}
        {result.dataSource === "dev_preview" && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-cyan-200 bg-cyan-50/70 px-4 py-3 text-xs text-zinc-800">
            <div className="flex items-center gap-2.5">
              <Info className="h-4 w-4 text-cyan-700 shrink-0" />
              <span>
                <strong>Demonstração Comercial:</strong> Exibindo acervo demonstrativo. O banco de dados e as informações reais poderão ser administrados pelo painel exclusivo.
              </span>
            </div>
            <Link
              href="/admin"
              className="font-semibold text-cyan-800 underline shrink-0 hover:text-cyan-950"
            >
              Configurar painel →
            </Link>
          </div>
        )}

        {/* Barra de Filtros */}
        <PropertyFiltersBar
          initialFilters={filters}
          lockedPurpose={lockedPurpose}
          totalResults={result.total}
          cities={cities}
          neighborhoods={neighborhoods}
        />

        {/* Grid de Resultados ou Estado Vazio */}
        {result.items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {result.items.map((property, idx) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  preferredPurpose={lockedPurpose}
                  priority={idx < 3}
                />
              ))}
            </div>

            {/* Paginação */}
            {result.totalPages > 1 && (
              <nav
                className="mt-14 flex items-center justify-center gap-2"
                aria-label="Paginação de imóveis"
              >
                {result.page > 1 ? (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={buildPageHref(
                        basePath,
                        filters,
                        result.page - 1,
                        lockedPurpose
                      )}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Anterior</span>
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                    <span>Anterior</span>
                  </Button>
                )}

                <div className="flex items-center gap-1.5 px-2">
                  {Array.from(
                    { length: result.totalPages },
                    (_, i) => i + 1
                  ).map((pageNum) => (
                    <Link
                      key={pageNum}
                      href={buildPageHref(
                        basePath,
                        filters,
                        pageNum,
                        lockedPurpose
                      )}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                        pageNum === result.page
                          ? "bg-cyan-700 text-white"
                          : "bg-white text-zinc-800 border border-zinc-200 hover:border-cyan-700 hover:text-cyan-700"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  ))}
                </div>

                {result.page < result.totalPages ? (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={buildPageHref(
                        basePath,
                        filters,
                        result.page + 1,
                        lockedPurpose
                      )}
                    >
                      <span>Próxima</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    <span>Próxima</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </nav>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-12 text-center">
            <Building2 className="mx-auto mb-3 h-10 w-10 text-cyan-700" />
            <h2 className="text-xl font-bold text-zinc-900">
              Nenhum imóvel corresponde aos filtros selecionados
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-zinc-600">
              Amplie a faixa de preços ou limpe os filtros para visualizar outras oportunidades.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="outline">
                <Link href={basePath}>Limpar filtros</Link>
              </Button>
              <Button asChild variant="default">
                <Link href="/contato">Fale com um corretor</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
