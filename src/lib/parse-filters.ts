import type {
  PropertyFilters,
  PropertySortOption,
  PropertyType,
} from "@/types/domain";

export type RawSearchParams = Record<string, string | string[] | undefined>;

function getSingleParam(val: string | string[] | undefined): string | undefined {
  if (Array.isArray(val)) return val[0];
  return val;
}

export function parsePropertyFiltersFromSearchParams(
  searchParams: RawSearchParams,
  forcedPurpose?: "venda" | "aluguel"
): PropertyFilters {
  const finalidadeRaw = getSingleParam(searchParams.finalidade);
  const tipoRaw = getSingleParam(searchParams.tipo);
  const cidade = getSingleParam(searchParams.cidade);
  const bairro = getSingleParam(searchParams.bairro);
  const busca = getSingleParam(searchParams.busca);
  const precoMinRaw = getSingleParam(searchParams.precoMin);
  const precoMaxRaw = getSingleParam(searchParams.precoMax);
  const areaMinRaw = getSingleParam(searchParams.areaMin);
  const areaMaxRaw = getSingleParam(searchParams.areaMax);
  const dormitoriosRaw = getSingleParam(searchParams.dormitorios);
  const suitesRaw = getSingleParam(searchParams.suites);
  const banheirosRaw = getSingleParam(searchParams.banheiros);
  const vagasRaw = getSingleParam(searchParams.vagas);
  const mobiliadoRaw = getSingleParam(searchParams.mobiliado);
  const aceitaAnimaisRaw = getSingleParam(searchParams.aceitaAnimais);
  const altoPadraoRaw = getSingleParam(searchParams.altoPadrao);
  const comodidadesRaw = getSingleParam(searchParams.comodidades);
  const ordenarRaw = getSingleParam(searchParams.ordenar);
  const paginaRaw = getSingleParam(searchParams.pagina);

  const validTypes: PropertyType[] = [
    "apartamento",
    "casa",
    "condominio",
    "cobertura",
    "terreno",
    "comercial",
    "alto_padrao",
  ];

  const validSorts: PropertySortOption[] = [
    "recentes",
    "menor_preco",
    "maior_preco",
    "maior_area",
  ];

  return {
    finalidade:
      forcedPurpose ??
      (finalidadeRaw === "venda" || finalidadeRaw === "aluguel"
        ? finalidadeRaw
        : "todos"),
    tipo:
      tipoRaw && validTypes.includes(tipoRaw as PropertyType)
        ? (tipoRaw as PropertyType)
        : "todos",
    cidade: cidade?.trim() || undefined,
    bairro: bairro?.trim() || undefined,
    busca: busca?.trim() || undefined,
    precoMin: precoMinRaw ? Number(precoMinRaw) || undefined : undefined,
    precoMax: precoMaxRaw ? Number(precoMaxRaw) || undefined : undefined,
    areaMin: areaMinRaw ? Number(areaMinRaw) || undefined : undefined,
    areaMax: areaMaxRaw ? Number(areaMaxRaw) || undefined : undefined,
    dormitorios: dormitoriosRaw ? Number(dormitoriosRaw) || undefined : undefined,
    suites: suitesRaw ? Number(suitesRaw) || undefined : undefined,
    banheiros: banheirosRaw ? Number(banheirosRaw) || undefined : undefined,
    vagas: vagasRaw ? Number(vagasRaw) || undefined : undefined,
    mobiliado: mobiliadoRaw === "true",
    aceitaAnimais: aceitaAnimaisRaw === "true",
    altoPadrao: altoPadraoRaw === "true",
    comodidades: comodidadesRaw
      ? comodidadesRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    ordenar:
      ordenarRaw && validSorts.includes(ordenarRaw as PropertySortOption)
        ? (ordenarRaw as PropertySortOption)
        : "recentes",
    pagina: paginaRaw ? Math.max(1, Number(paginaRaw) || 1) : 1,
    porPagina: 9,
  };
}
