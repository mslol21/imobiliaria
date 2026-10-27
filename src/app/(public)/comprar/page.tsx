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
  title: "Imóveis à Venda | Comprar Casas, Apartamentos e Coberturas",
  description:
    "Explore nossa seleção de imóveis disponíveis para compra. Filtre por localização, faixa de preço, área útil, suítes e comodidades.",
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
      badgeLabel="Aquisição Imobiliária"
      title="Imóveis selecionados para comprar"
      subtitle="Encontre apartamentos, residências em condomínio, coberturas e imóveis comerciais com curadoria técnica e segurança jurídica."
      basePath="/comprar"
      lockedPurpose="venda"
      filters={filters}
      result={result}
      cities={locations.cities}
      neighborhoods={locations.neighborhoods}
    />
  );
}
