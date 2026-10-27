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
  title: "Imóveis para Alugar | Locação Residencial e Comercial",
  description:
    "Descubra imóveis selecionados para locação residencial e corporativa. Opções mobiliadas, coberturas, casas e conjuntos comerciais.",
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
      badgeLabel="Locação Selecionada"
      title="Descubra seu próximo imóvel para alugar"
      subtitle="Propriedades residenciais e corporativas prontas para ocupação imediata, com contratos estruturados e atendimento ágil."
      basePath="/alugar"
      lockedPurpose="aluguel"
      filters={filters}
      result={result}
      cities={locations.cities}
      neighborhoods={locations.neighborhoods}
    />
  );
}
