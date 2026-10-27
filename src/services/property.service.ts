import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv, isDevPreviewEnabled } from "@/lib/supabase/env";
import { DEV_PREVIEW_PROPERTIES } from "@/services/dev-preview-data";
import type {
  AdminDashboardMetrics,
  PaginatedResult,
  Property,
  PropertyFeature,
  PropertyFilters,
  PropertyImage,
} from "@/types/domain";

function normalizePropertyRow(row: Record<string, unknown>): Property {
  const rawImages = Array.isArray(row.property_images)
    ? (row.property_images as Record<string, unknown>[])
    : Array.isArray(row.images)
      ? (row.images as Record<string, unknown>[])
      : [];

  const images: PropertyImage[] = rawImages
    .map((img) => ({
      id: String(img.id ?? ""),
      property_id: String(img.property_id ?? row.id ?? ""),
      storage_path: img.storage_path ? String(img.storage_path) : null,
      url: String(img.url ?? ""),
      alt_text: String(img.alt_text ?? ""),
      is_cover: Boolean(img.is_cover),
      display_order: Number(img.display_order ?? 0),
      file_size: img.file_size !== null && img.file_size !== undefined ? Number(img.file_size) : null,
      mime_type: img.mime_type ? String(img.mime_type) : null,
      created_at: String(img.created_at ?? new Date().toISOString()),
    }))
    .sort((a, b) => {
      if (a.is_cover && !b.is_cover) return -1;
      if (!a.is_cover && b.is_cover) return 1;
      return a.display_order - b.display_order;
    });

  const rawFeatures = Array.isArray(row.property_features)
    ? (row.property_features as Record<string, unknown>[])
    : Array.isArray(row.features)
      ? (row.features as Record<string, unknown>[])
      : [];

  const features: PropertyFeature[] = rawFeatures.map((feat) => ({
    id: String(feat.id ?? ""),
    property_id: String(feat.property_id ?? row.id ?? ""),
    category: (feat.category as PropertyFeature["category"]) ?? "comodidade",
    label: String(feat.label ?? ""),
    icon_name: feat.icon_name ? String(feat.icon_name) : null,
  }));

  return {
    id: String(row.id),
    reference_code: String(row.reference_code ?? ""),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    property_type: (row.property_type as Property["property_type"]) ?? "apartamento",
    purpose: (row.purpose as Property["purpose"]) ?? "venda",
    description: String(row.description ?? ""),
    short_description: row.short_description ? String(row.short_description) : null,
    zip_code: row.zip_code ? String(row.zip_code) : null,
    state: String(row.state ?? "SP"),
    city: String(row.city ?? ""),
    neighborhood: String(row.neighborhood ?? ""),
    street: row.street ? String(row.street) : null,
    street_number: row.street_number ? String(row.street_number) : null,
    complement: row.complement ? String(row.complement) : null,
    latitude: row.latitude !== null && row.latitude !== undefined ? Number(row.latitude) : null,
    longitude: row.longitude !== null && row.longitude !== undefined ? Number(row.longitude) : null,
    hide_exact_address: row.hide_exact_address !== false,
    sale_price: row.sale_price !== null && row.sale_price !== undefined ? Number(row.sale_price) : null,
    rent_price: row.rent_price !== null && row.rent_price !== undefined ? Number(row.rent_price) : null,
    condo_fee: row.condo_fee !== null && row.condo_fee !== undefined ? Number(row.condo_fee) : null,
    iptu_price: row.iptu_price !== null && row.iptu_price !== undefined ? Number(row.iptu_price) : null,
    iptu_periodicity: (row.iptu_periodicity as Property["iptu_periodicity"]) ?? "mensal",
    other_fees: row.other_fees !== null && row.other_fees !== undefined ? Number(row.other_fees) : null,
    other_fees_description: row.other_fees_description ? String(row.other_fees_description) : null,
    usable_area: row.usable_area !== null && row.usable_area !== undefined ? Number(row.usable_area) : null,
    built_area: row.built_area !== null && row.built_area !== undefined ? Number(row.built_area) : null,
    total_area: row.total_area !== null && row.total_area !== undefined ? Number(row.total_area) : null,
    bedrooms: Number(row.bedrooms ?? 0),
    suites: Number(row.suites ?? 0),
    bathrooms: Number(row.bathrooms ?? 0),
    parking_spots: Number(row.parking_spots ?? 0),
    floor_number: row.floor_number !== null && row.floor_number !== undefined ? Number(row.floor_number) : null,
    is_furnished: Boolean(row.is_furnished),
    is_pet_friendly: Boolean(row.is_pet_friendly),
    is_high_end: Boolean(row.is_high_end),
    amenities: Array.isArray(row.amenities) ? (row.amenities as string[]) : [],
    highlights: Array.isArray(row.highlights) ? (row.highlights as string[]) : [],
    availability_status: (row.availability_status as Property["availability_status"]) ?? "disponivel",
    publication_status: (row.publication_status as Property["publication_status"]) ?? "rascunho",
    is_featured: Boolean(row.is_featured),
    views_count: Number(row.views_count ?? 0),
    meta_title: row.meta_title ? String(row.meta_title) : null,
    meta_description: row.meta_description ? String(row.meta_description) : null,
    images,
    features,
    deleted_at: row.deleted_at ? String(row.deleted_at) : null,
    created_by: row.created_by ? String(row.created_by) : null,
    created_at: String(row.created_at ?? new Date().toISOString()),
    updated_at: String(row.updated_at ?? new Date().toISOString()),
  };
}

function applyDevPreviewFilters(
  source: Property[],
  filters: PropertyFilters
): PaginatedResult<Property> {
  const page = Math.max(1, filters.pagina ?? 1);
  const pageSize = Math.max(1, Math.min(24, filters.porPagina ?? 9));

  const filtered = source.filter((item) => {
    if (item.publication_status !== "publicado" || item.deleted_at !== null) {
      return false;
    }

    if (filters.finalidade && filters.finalidade !== "todos") {
      if (
        filters.finalidade === "venda" &&
        item.purpose !== "venda" &&
        item.purpose !== "ambos"
      ) {
        return false;
      }
      if (
        filters.finalidade === "aluguel" &&
        item.purpose !== "aluguel" &&
        item.purpose !== "ambos"
      ) {
        return false;
      }
    }

    if (filters.tipo && filters.tipo !== "todos") {
      if (filters.tipo === "alto_padrao") {
        if (item.property_type !== "alto_padrao" && !item.is_high_end) {
          return false;
        }
      } else if (item.property_type !== filters.tipo) {
        return false;
      }
    }

    if (filters.cidade && filters.cidade.trim() !== "") {
      const needle = filters.cidade.trim().toLowerCase();
      if (!item.city.toLowerCase().includes(needle)) {
        return false;
      }
    }

    if (filters.bairro && filters.bairro.trim() !== "") {
      const needle = filters.bairro.trim().toLowerCase();
      if (!item.neighborhood.toLowerCase().includes(needle)) {
        return false;
      }
    }

    if (filters.busca && filters.busca.trim() !== "") {
      const q = filters.busca.trim().toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.neighborhood.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.reference_code.toLowerCase().includes(q);
      if (!match) return false;
    }

    const effectivePrice =
      filters.finalidade === "aluguel"
        ? (item.rent_price ?? item.sale_price ?? 0)
        : filters.finalidade === "venda"
          ? (item.sale_price ?? item.rent_price ?? 0)
          : (item.sale_price ?? item.rent_price ?? 0);

    if (filters.precoMin && filters.precoMin > 0 && effectivePrice < filters.precoMin) {
      return false;
    }
    if (filters.precoMax && filters.precoMax > 0 && effectivePrice > filters.precoMax) {
      return false;
    }

    const area = item.usable_area ?? item.total_area ?? 0;
    if (filters.areaMin && filters.areaMin > 0 && area < filters.areaMin) {
      return false;
    }
    if (filters.areaMax && filters.areaMax > 0 && area > filters.areaMax) {
      return false;
    }

    if (filters.dormitorios && filters.dormitorios > 0 && item.bedrooms < filters.dormitorios) {
      return false;
    }
    if (filters.suites && filters.suites > 0 && item.suites < filters.suites) {
      return false;
    }
    if (filters.banheiros && filters.banheiros > 0 && item.bathrooms < filters.banheiros) {
      return false;
    }
    if (filters.vagas && filters.vagas > 0 && item.parking_spots < filters.vagas) {
      return false;
    }

    if (filters.mobiliado && !item.is_furnished) {
      return false;
    }
    if (filters.aceitaAnimais && !item.is_pet_friendly) {
      return false;
    }
    if (filters.altoPadrao && !item.is_high_end && item.property_type !== "alto_padrao") {
      return false;
    }

    if (filters.comodidades && filters.comodidades.length > 0) {
      const lowerAmenities = item.amenities.map((a) => a.toLowerCase());
      const hasAll = filters.comodidades.every((req) =>
        lowerAmenities.some((a) => a.includes(req.toLowerCase()))
      );
      if (!hasAll) return false;
    }

    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const sortBy = filters.ordenar ?? "recentes";
    const priceA =
      filters.finalidade === "aluguel"
        ? (a.rent_price ?? a.sale_price ?? 0)
        : (a.sale_price ?? a.rent_price ?? 0);
    const priceB =
      filters.finalidade === "aluguel"
        ? (b.rent_price ?? b.sale_price ?? 0)
        : (b.sale_price ?? b.rent_price ?? 0);

    if (sortBy === "menor_preco") return priceA - priceB;
    if (sortBy === "maior_preco") return priceB - priceA;
    if (sortBy === "maior_area") {
      return (b.usable_area ?? 0) - (a.usable_area ?? 0);
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
    dataSource: "dev_preview",
  };
}

export async function getPublicProperties(
  filters: PropertyFilters = {}
): Promise<PaginatedResult<Property>> {
  const page = Math.max(1, filters.pagina ?? 1);
  const pageSize = Math.max(1, Math.min(24, filters.porPagina ?? 9));
  const env = getSupabasePublicEnv();

  if (!env.isConfigured) {
    if (isDevPreviewEnabled()) {
      return applyDevPreviewFilters(DEV_PREVIEW_PROPERTIES, filters);
    }
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
      dataSource: "empty_unconfigured",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
      dataSource: "empty_unconfigured",
    };
  }

  let query = supabase
    .from("properties")
    .select("*, property_images(*), property_features(*)", { count: "exact" })
    .eq("publication_status", "publicado")
    .in("availability_status", ["disponivel", "reservado"])
    .is("deleted_at", null);

  if (filters.finalidade === "venda") {
    query = query.in("purpose", ["venda", "ambos"]);
  } else if (filters.finalidade === "aluguel") {
    query = query.in("purpose", ["aluguel", "ambos"]);
  }

  if (filters.tipo && filters.tipo !== "todos") {
    if (filters.tipo === "alto_padrao") {
      query = query.or("property_type.eq.alto_padrao,is_high_end.eq.true");
    } else {
      query = query.eq("property_type", filters.tipo);
    }
  }

  if (filters.cidade && filters.cidade.trim() !== "") {
    query = query.ilike("city", `%${filters.cidade.trim()}%`);
  }

  if (filters.bairro && filters.bairro.trim() !== "") {
    query = query.ilike("neighborhood", `%${filters.bairro.trim()}%`);
  }

  if (filters.busca && filters.busca.trim() !== "") {
    const q = filters.busca.trim().replace(/[,%]/g, "");
    query = query.or(
      `title.ilike.%${q}%,neighborhood.ilike.%${q}%,city.ilike.%${q}%,reference_code.ilike.%${q}%`
    );
  }

  const priceColumn =
    filters.finalidade === "aluguel" ? "rent_price" : "sale_price";

  if (filters.precoMin && filters.precoMin > 0) {
    query = query.gte(priceColumn, filters.precoMin);
  }
  if (filters.precoMax && filters.precoMax > 0) {
    query = query.lte(priceColumn, filters.precoMax);
  }

  if (filters.areaMin && filters.areaMin > 0) {
    query = query.gte("usable_area", filters.areaMin);
  }
  if (filters.areaMax && filters.areaMax > 0) {
    query = query.lte("usable_area", filters.areaMax);
  }

  if (filters.dormitorios && filters.dormitorios > 0) {
    query = query.gte("bedrooms", filters.dormitorios);
  }
  if (filters.suites && filters.suites > 0) {
    query = query.gte("suites", filters.suites);
  }
  if (filters.banheiros && filters.banheiros > 0) {
    query = query.gte("bathrooms", filters.banheiros);
  }
  if (filters.vagas && filters.vagas > 0) {
    query = query.gte("parking_spots", filters.vagas);
  }

  if (filters.mobiliado) {
    query = query.eq("is_furnished", true);
  }
  if (filters.aceitaAnimais) {
    query = query.eq("is_pet_friendly", true);
  }
  if (filters.altoPadrao) {
    query = query.or("is_high_end.eq.true,property_type.eq.alto_padrao");
  }

  if (filters.comodidades && filters.comodidades.length > 0) {
    query = query.contains("amenities", filters.comodidades);
  }

  const sortBy = filters.ordenar ?? "recentes";
  if (sortBy === "menor_preco") {
    query = query.order(priceColumn, { ascending: true, nullsFirst: false });
  } else if (sortBy === "maior_preco") {
    query = query.order(priceColumn, { ascending: false, nullsFirst: false });
  } else if (sortBy === "maior_area") {
    query = query.order("usable_area", { ascending: false, nullsFirst: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count, error } = await query.range(from, to);

  if (error || !data) {
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
      dataSource: "supabase",
    };
  }

  const items = data.map((row) =>
    normalizePropertyRow(row as Record<string, unknown>)
  );
  const total = count ?? items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
    dataSource: "supabase",
  };
}

export async function getFeaturedProperties(limit = 6): Promise<{
  items: Property[];
  dataSource: "supabase" | "dev_preview" | "empty_unconfigured";
}> {
  const env = getSupabasePublicEnv();
  if (!env.isConfigured) {
    if (isDevPreviewEnabled()) {
      return {
        items: DEV_PREVIEW_PROPERTIES.filter(
          (p) => p.is_featured && p.publication_status === "publicado"
        ).slice(0, limit),
        dataSource: "dev_preview",
      };
    }
    return { items: [], dataSource: "empty_unconfigured" };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { items: [], dataSource: "empty_unconfigured" };
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(*), property_features(*)")
    .eq("publication_status", "publicado")
    .in("availability_status", ["disponivel", "reservado"])
    .eq("is_featured", true)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return { items: [], dataSource: "supabase" };
  }

  return {
    items: data.map((row) =>
      normalizePropertyRow(row as Record<string, unknown>)
    ),
    dataSource: "supabase",
  };
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const env = getSupabasePublicEnv();
  if (!env.isConfigured) {
    if (isDevPreviewEnabled()) {
      return (
        DEV_PREVIEW_PROPERTIES.find(
          (p) => p.slug === slug && p.publication_status === "publicado"
        ) ?? null
      );
    }
    return null;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(*), property_features(*)")
    .eq("slug", slug)
    .eq("publication_status", "publicado")
    .in("availability_status", ["disponivel", "reservado"])
    .is("deleted_at", null)
    .single();

  if (error || !data) return null;
  return normalizePropertyRow(data as Record<string, unknown>);
}

export async function getRelatedProperties(
  current: Property,
  limit = 3
): Promise<Property[]> {
  const env = getSupabasePublicEnv();
  if (!env.isConfigured) {
    if (!isDevPreviewEnabled()) return [];
    return DEV_PREVIEW_PROPERTIES.filter(
      (p) => p.id !== current.id && p.publication_status === "publicado"
    )
      .sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;
        if (a.purpose === current.purpose) scoreA += 3;
        if (b.purpose === current.purpose) scoreB += 3;
        if (a.city === current.city) scoreA += 2;
        if (b.city === current.city) scoreB += 2;
        if (a.property_type === current.property_type) scoreA += 2;
        if (b.property_type === current.property_type) scoreB += 2;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("properties")
    .select("*, property_images(*), property_features(*)")
    .eq("publication_status", "publicado")
    .in("availability_status", ["disponivel", "reservado"])
    .is("deleted_at", null)
    .neq("id", current.id)
    .eq("city", current.city)
    .limit(limit);

  if (!data || data.length === 0) {
    const { data: fallbackData } = await supabase
      .from("properties")
      .select("*, property_images(*), property_features(*)")
      .eq("publication_status", "publicado")
      .in("availability_status", ["disponivel", "reservado"])
      .is("deleted_at", null)
      .neq("id", current.id)
      .limit(limit);

    return (fallbackData ?? []).map((row) =>
      normalizePropertyRow(row as Record<string, unknown>)
    );
  }

  return data.map((row) =>
    normalizePropertyRow(row as Record<string, unknown>)
  );
}

export async function getDistinctLocations(): Promise<{
  cities: string[];
  neighborhoods: string[];
}> {
  const env = getSupabasePublicEnv();
  if (!env.isConfigured) {
    const cities = Array.from(
      new Set(DEV_PREVIEW_PROPERTIES.map((p) => p.city))
    ).sort();
    const neighborhoods = Array.from(
      new Set(DEV_PREVIEW_PROPERTIES.map((p) => p.neighborhood))
    ).sort();
    return { cities, neighborhoods };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { cities: [], neighborhoods: [] };

  const { data } = await supabase
    .from("properties")
    .select("city, neighborhood")
    .eq("publication_status", "publicado")
    .is("deleted_at", null);

  if (!data) return { cities: [], neighborhoods: [] };

  const cities = Array.from(
    new Set(data.map((d) => String(d.city)).filter(Boolean))
  ).sort();
  const neighborhoods = Array.from(
    new Set(data.map((d) => String(d.neighborhood)).filter(Boolean))
  ).sort();

  return { cities, neighborhoods };
}

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const emptyMetrics: AdminDashboardMetrics = {
    totalProperties: 0,
    publishedProperties: 0,
    draftProperties: 0,
    forSaleProperties: 0,
    forRentProperties: 0,
    soldProperties: 0,
    rentedProperties: 0,
    totalLeads: 0,
    newLeads: 0,
  };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return emptyMetrics;

  const [{ data: properties }, { data: leads }] = await Promise.all([
    supabase
      .from("properties")
      .select("publication_status, availability_status, purpose")
      .is("deleted_at", null),
    supabase.from("leads").select("status"),
  ]);

  const propsList = properties ?? [];
  const leadsList = leads ?? [];

  return {
    totalProperties: propsList.length,
    publishedProperties: propsList.filter(
      (p) => p.publication_status === "publicado"
    ).length,
    draftProperties: propsList.filter(
      (p) => p.publication_status === "rascunho"
    ).length,
    forSaleProperties: propsList.filter(
      (p) => p.purpose === "venda" || p.purpose === "ambos"
    ).length,
    forRentProperties: propsList.filter(
      (p) => p.purpose === "aluguel" || p.purpose === "ambos"
    ).length,
    soldProperties: propsList.filter(
      (p) => p.availability_status === "vendido"
    ).length,
    rentedProperties: propsList.filter(
      (p) => p.availability_status === "alugado"
    ).length,
    totalLeads: leadsList.length,
    newLeads: leadsList.filter((l) => l.status === "novo").length,
  };
}

export async function getAdminProperties(params?: {
  search?: string;
  publicationStatus?: string;
  availabilityStatus?: string;
}): Promise<Property[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  let query = supabase
    .from("properties")
    .select("*, property_images(*), property_features(*)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (
    params?.publicationStatus &&
    params.publicationStatus !== "todos"
  ) {
    query = query.eq("publication_status", params.publicationStatus);
  }

  if (
    params?.availabilityStatus &&
    params.availabilityStatus !== "todos"
  ) {
    query = query.eq("availability_status", params.availabilityStatus);
  }

  if (params?.search && params.search.trim() !== "") {
    const q = params.search.trim().replace(/[,%]/g, "");
    query = query.or(
      `title.ilike.%${q}%,reference_code.ilike.%${q}%,neighborhood.ilike.%${q}%,city.ilike.%${q}%`
    );
  }

  const { data } = await query;
  if (!data) return [];

  return data.map((row) =>
    normalizePropertyRow(row as Record<string, unknown>)
  );
}

export async function getAdminPropertyById(id: string): Promise<Property | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(*), property_features(*)")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error || !data) return null;
  return normalizePropertyRow(data as Record<string, unknown>);
}
