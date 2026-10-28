import type {
  AvailabilityStatus,
  LeadSource,
  LeadStatus,
  PropertyPurpose,
  PropertySortOption,
  PropertyType,
  PublicationStatus,
} from "@/types/domain";

export const DESIGN_TOKENS = {
  colors: {
    cyanPrimary: "#0891b2",
    cyanDark: "#0e7490",
    cyanLight: "#06b6d4",
    cyanMuted: "rgba(8, 145, 178, 0.08)",
    white: "#FFFFFF",
    grayLight: "#F8FAFC",
    graySurface: "#F4F4F5",
    grayBorder: "#E5E5E5",
    grayMuted: "#71717A",
    charcoal: "#18181B",
  },
  fonts: {
    serif: "var(--font-serif), Georgia, serif",
    sans: "var(--font-sans), system-ui, -apple-system, sans-serif",
  },
} as const;

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartamento: "Apartamento",
  casa: "Casa",
  condominio: "Casa em Condomínio",
  cobertura: "Cobertura",
  terreno: "Terreno / Lote",
  comercial: "Imóvel Comercial",
  alto_padrao: "Residência Alto Padrão",
};

export const PROPERTY_PURPOSE_LABELS: Record<PropertyPurpose, string> = {
  venda: "Venda",
  aluguel: "Locação",
  ambos: "Venda e Locação",
};

export const AVAILABILITY_STATUS_LABELS: Record<AvailabilityStatus, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
  alugado: "Alugado",
  inativo: "Inativo",
};

export const PUBLICATION_STATUS_LABELS: Record<PublicationStatus, string> = {
  rascunho: "Rascunho",
  publicado: "Publicado",
  arquivado: "Arquivado",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  novo: "Novo",
  em_atendimento: "Em atendimento",
  visita_agendada: "Visita agendada",
  negociacao: "Em negociação",
  convertido: "Convertido",
  encerrado: "Encerrado",
};

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  formulario_imovel: "Interesse em Imóvel",
  agendar_visita: "Agendamento de Visita",
  contato_geral: "Contato Institucional",
  anunciar_imovel: "Captação de Imóvel (Proprietário)",
  whatsapp: "Clique no WhatsApp",
};

export const SORT_OPTION_LABELS: Record<PropertySortOption, string> = {
  recentes: "Mais recentes",
  menor_preco: "Menor valor",
  maior_preco: "Maior valor",
  maior_area: "Maior área útil",
};

export const COMMON_AMENITIES: readonly string[] = [
  "Piscina aquecida",
  "Varanda gourmet",
  "Elevador privativo",
  "Portaria blindada 24h",
  "Academia equipada",
  "Sauna seca e úmida",
  "Quadra de tênis / beach tennis",
  "Gerador de energia pleno",
  "Adega climatizada",
  "Automação residencial",
  "Ar-condicionado central / VRF",
  "Vista panorâmica permanente",
  "Depósito privativo",
  "Vaga com carregador para carro elétrico",
  "Jardim paisagístico",
  "Espaço wellness / spa",
] as const;

export const HOME_CATEGORIES = [
  {
    slug: "apartamentos",
    title: "Apartamentos",
    subtitle: "Apartamentos para morar ou investir na Zona Leste",
    href: "/imoveis?tipo=apartamento",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "casas",
    title: "Casas",
    subtitle: "Casas com espaço para diferentes perfis de família",
    href: "/imoveis?tipo=casa",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "condominios",
    title: "Condomínios",
    subtitle: "Casas e apartamentos em condomínios",
    href: "/imoveis?tipo=condominio",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "coberturas",
    title: "Coberturas",
    subtitle: "Coberturas com ambientes amplos",
    href: "/imoveis?tipo=cobertura",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "comerciais",
    title: "Imóveis Comerciais",
    subtitle: "Salões, lojas e espaços para o seu negócio",
    href: "/imoveis?tipo=comercial",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "alto-padrao",
    title: "Alto Padrão",
    subtitle: "Imóveis com acabamentos e características especiais",
    href: "/imoveis?altoPadrao=true",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80",
  },
] as const;
