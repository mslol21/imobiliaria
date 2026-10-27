import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Property } from "@/types/domain";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const brlDetailedFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrencyBRL(
  value: number | null | undefined,
  options?: { showCents?: boolean; fallback?: string }
): string {
  if (value === null || value === undefined || Number.isNaN(value) || value <= 0) {
    return options?.fallback ?? "Sob consulta";
  }
  return options?.showCents
    ? brlDetailedFormatter.format(value)
    : brlFormatter.format(value);
}

export function formatArea(area: number | null | undefined): string {
  if (area === null || area === undefined || Number.isNaN(area) || area <= 0) {
    return "—";
  }
  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(area)} m²`;
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function getPrimaryPriceLabel(
  property: Pick<Property, "purpose" | "sale_price" | "rent_price">,
  preferredPurpose?: "venda" | "aluguel"
): { label: string; value: string; suffix?: string } {
  const showRent =
    preferredPurpose === "aluguel" ||
    (property.purpose === "aluguel" && preferredPurpose !== "venda");

  if (showRent && property.rent_price && property.rent_price > 0) {
    return {
      label: "Locação",
      value: formatCurrencyBRL(property.rent_price),
      suffix: "/mês",
    };
  }

  if (property.sale_price && property.sale_price > 0) {
    return {
      label: "Valor de venda",
      value: formatCurrencyBRL(property.sale_price),
    };
  }

  if (property.rent_price && property.rent_price > 0) {
    return {
      label: "Locação",
      value: formatCurrencyBRL(property.rent_price),
      suffix: "/mês",
    };
  }

  return {
    label: property.purpose === "aluguel" ? "Locação" : "Valor",
    value: "Sob consulta",
  };
}

export function getCoverImage(property: Pick<Property, "images" | "title">): {
  url: string;
  alt: string;
} {
  const sorted = [...(property.images ?? [])].sort((a, b) => {
    if (a.is_cover && !b.is_cover) return -1;
    if (!a.is_cover && b.is_cover) return 1;
    return a.display_order - b.display_order;
  });

  const first = sorted[0];
  if (first && first.url) {
    return {
      url: first.url,
      alt: first.alt_text || property.title,
    };
  }

  return {
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    alt: property.title,
  };
}

export function sanitizePhoneForWhatsApp(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("55") && digits.length >= 12) {
    return digits;
  }
  return `55${digits}`;
}

export function buildPropertyWhatsAppUrl(params: {
  whatsappPhone: string;
  propertyTitle: string;
  referenceCode: string;
  propertyUrl: string;
  customIntent?: string;
}): string {
  const cleanPhone = sanitizePhoneForWhatsApp(params.whatsappPhone);
  const intro =
    params.customIntent ||
    `Olá! Tenho interesse no imóvel ${params.referenceCode} (${params.propertyTitle}) e gostaria de receber mais informações.`;
  const fullText = `${intro}\n\nLink do imóvel: ${params.propertyUrl}`;
  const encoded = encodeURIComponent(fullText);

  if (!cleanPhone) {
    return `https://api.whatsapp.com/send?text=${encoded}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
