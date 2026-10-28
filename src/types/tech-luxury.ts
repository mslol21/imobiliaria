export type PropertyPurpose = "venda" | "aluguel" | "ambos";

export type TechPropertyType =
  | "cobertura"
  | "mansao"
  | "casa_condominio"
  | "apartamento_design"
  | "penthouse"
  | "comercial_boutique";

export interface TechPropertyImage {
  id: string;
  url: string;
  alt: string;
  isCover?: boolean;
}

export interface Hotspot360 {
  id: string;
  name: string;
  label: string;
  imageUrl: string;
  description: string;
  features: string[];
}

export interface TechProperty {
  id: string;
  referenceCode: string;
  title: string;
  subtitle: string;
  slug: string;
  badge: "Lançamento" | "Exclusivo" | "Private Collection" | "Oportunidade Rara";
  propertyType: TechPropertyType;
  purpose: PropertyPurpose;
  salePrice?: number | null;
  rentPrice?: number | null;
  condoFee?: number | null;
  iptuPrice?: number | null;
  neighborhood: string;
  city: string;
  state: string;
  usableArea: number;
  totalArea: number;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parkingSpots: number;
  isFurnished: boolean;
  isPetFriendly: boolean;
  hasPool: boolean;
  hasView: boolean;
  hasAutomation: boolean;
  shortDescription: string;
  fullDescription: string;
  images: TechPropertyImage[];
  floorPlanUrl?: string;
  hotspots360?: Hotspot360[];
  amenities: string[];
  architect?: string;
  viewsCount: number;
}

export interface TechPropertyFilters {
  busca?: string;
  bairro?: string;
  finalidade?: PropertyPurpose | "todos";
  tipo?: TechPropertyType | "todos";
  precoMin?: number;
  precoMax?: number;
  dormitorios?: number;
  suites?: number;
  banheiros?: number;
  vagas?: number;
  areaMin?: number;
  areaMax?: number;
  mobiliado?: boolean;
  petFriendly?: boolean;
  piscina?: boolean;
  vistaLivre?: boolean;
  automacao?: boolean;
  ordenar?: "recentes" | "menor_preco" | "maior_preco" | "maior_area";
}

export interface ScheduleVisitPayload {
  propertyId: string;
  propertyTitle: string;
  date: string;
  timeSlot: "manha" | "tarde" | "noite";
  clientName: string;
  clientPhone: string;
  notes?: string;
}
