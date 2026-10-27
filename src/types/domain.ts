export type PropertyType =
  | "apartamento"
  | "casa"
  | "condominio"
  | "cobertura"
  | "terreno"
  | "comercial"
  | "alto_padrao";

export type PropertyPurpose = "venda" | "aluguel" | "ambos";

export type IptuPeriodicity = "mensal" | "anual" | "isento";

export type AvailabilityStatus =
  | "disponivel"
  | "reservado"
  | "vendido"
  | "alugado"
  | "inativo";

export type PublicationStatus = "rascunho" | "publicado" | "arquivado";

export type FeatureCategory =
  | "comodidade"
  | "diferencial"
  | "seguranca"
  | "lazer";

export type LeadSource =
  | "formulario_imovel"
  | "agendar_visita"
  | "contato_geral"
  | "anunciar_imovel"
  | "whatsapp";

export type LeadStatus =
  | "novo"
  | "em_atendimento"
  | "visita_agendada"
  | "negociacao"
  | "convertido"
  | "encerrado";

export type BannerPosition = "hero" | "home_destaque" | "institucional";

export type PropertySortOption =
  | "recentes"
  | "menor_preco"
  | "maior_preco"
  | "maior_area";

export interface PropertyImage {
  id: string;
  property_id: string;
  storage_path: string | null;
  url: string;
  alt_text: string;
  is_cover: boolean;
  display_order: number;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

export interface PropertyFeature {
  id: string;
  property_id: string;
  category: FeatureCategory;
  label: string;
  icon_name: string | null;
  created_at?: string;
}

export interface Property {
  id: string;
  reference_code: string;
  title: string;
  slug: string;
  property_type: PropertyType;
  purpose: PropertyPurpose;
  description: string;
  short_description: string | null;

  // Localização
  zip_code: string | null;
  state: string;
  city: string;
  neighborhood: string;
  street: string | null;
  street_number: string | null;
  complement: string | null;
  latitude: number | null;
  longitude: number | null;
  hide_exact_address: boolean;

  // Valores
  sale_price: number | null;
  rent_price: number | null;
  condo_fee: number | null;
  iptu_price: number | null;
  iptu_periodicity: IptuPeriodicity;
  other_fees: number | null;
  other_fees_description: string | null;

  // Características
  usable_area: number | null;
  built_area: number | null;
  total_area: number | null;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parking_spots: number;
  floor_number: number | null;
  is_furnished: boolean;
  is_pet_friendly: boolean;
  is_high_end: boolean;
  amenities: string[];
  highlights: string[];

  // Controle
  availability_status: AvailabilityStatus;
  publication_status: PublicationStatus;
  is_featured: boolean;
  views_count: number;

  // SEO
  meta_title: string | null;
  meta_description: string | null;

  // Relacionamentos carregados
  images: PropertyImage[];
  features: PropertyFeature[];

  // Metadados de origem (ex.: quando em modo dev preview sem Supabase conectado)
  is_dev_preview?: boolean;

  deleted_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyFilters {
  finalidade?: "venda" | "aluguel" | "todos";
  tipo?: PropertyType | "todos";
  cidade?: string;
  bairro?: string;
  precoMin?: number;
  precoMax?: number;
  areaMin?: number;
  areaMax?: number;
  dormitorios?: number;
  suites?: number;
  banheiros?: number;
  vagas?: number;
  mobiliado?: boolean;
  aceitaAnimais?: boolean;
  altoPadrao?: boolean;
  comodidades?: string[];
  busca?: string;
  ordenar?: PropertySortOption;
  pagina?: number;
  porPagina?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  dataSource: "supabase" | "dev_preview" | "empty_unconfigured";
}

export interface Lead {
  id: string;
  property_id: string | null;
  property_reference_code: string | null;
  property_title: string | null;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  source: LeadSource;
  status: LeadStatus;
  internal_notes: string | null;
  consent_lgpd: boolean;
  ip_hash: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgencyDifferential {
  title: string;
  description: string;
}

export interface SiteSettings {
  id: string;
  agency_name: string;
  agency_slogan: string;
  creci: string;
  cnpj: string;
  phone: string;
  whatsapp: string;
  email: string;
  address_line: string;
  city: string;
  state: string;
  zip_code: string;
  business_hours: string;
  about_title: string;
  about_history: string;
  about_positioning: string;
  about_differentials: AgencyDifferential[];
  about_consulting: string;
  instagram_url: string;
  linkedin_url: string;
  youtube_url: string;
  facebook_url: string;
  privacy_policy_updated_at: string;
  updated_at: string;
  is_configured: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  storage_path: string | null;
  cta_label: string | null;
  cta_href: string | null;
  position: BannerPosition;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminDashboardMetrics {
  totalProperties: number;
  publishedProperties: number;
  draftProperties: number;
  forSaleProperties: number;
  forRentProperties: number;
  soldProperties: number;
  rentedProperties: number;
  totalLeads: number;
  newLeads: number;
}
