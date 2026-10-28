import type { Metadata } from "next";
import { PropertiesCatalogView } from "@/components/properties/properties-catalog-view";
import {
  getDistinctLocations,
  getPublicProperties,
} from "@/services/property.service";
import {
  parsePropertyFiltersFromSearchParams,
  type RawSearchParams,
} from "@/lib/parse-filters";

export const metadata: Metadata = {
  title: "Imóveis à Venda em Guaianases e Zona Leste de São Paulo",
  description:
    "Pesquise casas e apartamentos à venda em Guaianases e na Zona Leste de São Paulo. Filtre por bairro, preço e características.",
  alternates: {
    canonical: "/comprar",
  },
};

export default async function ComprarPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolvedParams = await searchParams;
  const filters = parsePropertyFiltersFromSearchParams(resolvedParams, "venda");

  const [result, locations] = await Promise.all([
    getPublicProperties(filters),
    getDistinctLocations(),
  ]);

  return (
    <PropertiesCatalogView
      badgeLabel="Venda de imóveis"
      title="Casas e apartamentos para comprar na Zona Leste"
      subtitle="Encontre opções em Guaianases e bairros próximos. Use os filtros para escolher localização, preço e tipo de imóvel."
      basePath="/comprar"
      lockedPurpose="venda"
      filters={filters}
      result={result}
      cities={locations.cities}
      neighborhoods={locations.neighborhoods}
    />
  );
}
