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
    redPrimary: "#B5121B",
    redDark: "#8F0D15",
    redLight: "#D9222C",
    redMuted: "rgba(181, 18, 27, 0.08)",
    white: "#FFFFFF",
    grayLight: "#F5F5F5",
    grayBorder: "#E5E5E5",
    grayMuted: "#737373",
    charcoal: "#242424",
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
    subtitle: "Plantas inteligentes, terraços amplos e vistas privilegiadas",
    href: "/imoveis?tipo=apartamento",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "casas",
    title: "Casas",
    subtitle: "Arquitetura autoral, jardins privativos e conforto absoluto",
    href: "/imoveis?tipo=casa",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "condominios",
    title: "Condomínios",
    subtitle: "Segurança 24h, lazer completo e integração com a natureza",
    href: "/imoveis?tipo=condominio",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "coberturas",
    title: "Coberturas",
    subtitle: "Penthouses exclusivas com terraços abertos e vista panorâmica",
    href: "/imoveis?tipo=cobertura",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "comerciais",
    title: "Imóveis Comerciais",
    subtitle: "Lajes corporativas, conjuntos executivos e pontos estratégicos",
    href: "/imoveis?tipo=comercial",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "alto-padrao",
    title: "Alto Padrão",
    subtitle: "Propriedades raras com assinatura arquitetônica e acabamento nobre",
    href: "/imoveis?altoPadrao=true",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80",
  },
] as const;
