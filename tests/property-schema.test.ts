import { describe, it, expect } from "vitest";
import { propertyFormSchema } from "@/schemas/property.schema";

describe("schemas/property.schema - Validação de Cadastro de Imóveis", () => {
  const validBase = {
    reference_code: "REF-5000",
    title: "Apartamento Contemporâneo no Itaim Bibi",
    slug: "apartamento-contemporaneo-itaim-bibi",
    property_type: "apartamento" as const,
    purpose: "venda" as const,
    description:
      "Apartamento impecável com 250 m² úteis, 3 suítes plenas, varanda gourmet integrada e acabamentos de altíssimo padrão em rua arborizada.",
    state: "SP",
    city: "São Paulo",
    neighborhood: "Itaim Bibi",
    sale_price: 4500000,
    bedrooms: 3,
    suites: 3,
    bathrooms: 4,
    parking_spots: 3,
    availability_status: "disponivel" as const,
    publication_status: "publicado" as const,
    is_featured: true,
    amenities: ["Varanda gourmet", "Piscina aquecida"],
    highlights: ["Face norte com vista definitiva"],
    images: [],
  };

  it("deve validar imóvel com dados corretos", () => {
    const result = propertyFormSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it("deve rejeitar imóvel para venda sem sale_price", () => {
    const invalid = { ...validBase, sale_price: null };
    const result = propertyFormSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("sale_price"))).toBe(
        true
      );
    }
  });

  it("deve rejeitar imóvel para aluguel sem rent_price", () => {
    const invalid = {
      ...validBase,
      purpose: "aluguel" as const,
      sale_price: null,
      rent_price: null,
    };
    const result = propertyFormSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("rent_price"))).toBe(
        true
      );
    }
  });

  it("deve rejeitar slug com caracteres inválidos", () => {
    const invalid = { ...validBase, slug: "Slug Com Espaço & Acento!" };
    const result = propertyFormSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("slug"))).toBe(true);
    }
  });
});
