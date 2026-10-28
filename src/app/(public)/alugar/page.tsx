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
  title: "Imóveis para Alugar em Guaianases e Zona Leste",
  description:
    "Encontre imóveis para alugar em Guaianases e na Zona Leste de São Paulo. Pesquise por bairro, tipo e faixa de aluguel.",
  alternates: {
    canonical: "/alugar",
  },
};

export default async function AlugarPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolvedParams = await searchParams;
  const filters = parsePropertyFiltersFromSearchParams(
    resolvedParams,
    "aluguel"
  );

  const [result, locations] = await Promise.all([
    getPublicProperties(filters),
    getDistinctLocations(),
  ]);

  return (
    <PropertiesCatalogView
      badgeLabel="Imóveis para alugar"
      title="Encontre seu aluguel na Zona Leste"
      subtitle="Pesquise casas, apartamentos e imóveis comerciais em Guaianases e nos bairros próximos."
      basePath="/alugar"
      lockedPurpose="aluguel"
      filters={filters}
      result={result}
      cities={locations.cities}
      neighborhoods={locations.neighborhoods}
    />
  );
}
