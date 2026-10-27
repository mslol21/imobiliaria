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
  title: "Portfólio Completo de Imóveis | Venda e Locação",
  description:
    "Consulte nosso acervo completo de imóveis residenciais, comerciais e de alto padrão para compra e locação.",
  alternates: {
    canonical: "/imoveis",
  },
};

export default async function ImoveisCatalogPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolvedParams = await searchParams;
  const filters = parsePropertyFiltersFromSearchParams(resolvedParams);

  const [result, locations] = await Promise.all([
    getPublicProperties(filters),
    getDistinctLocations(),
  ]);

  return (
    <PropertiesCatalogView
      badgeLabel="Portfólio Completo"
      title="Acervo de Propriedades"
      subtitle="Utilize os filtros combinados para explorar imóveis disponíveis para compra e locação nas melhores localizações."
      basePath="/imoveis"
      filters={filters}
      result={result}
      cities={locations.cities}
      neighborhoods={locations.neighborhoods}
    />
  );
}
