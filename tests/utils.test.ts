import { describe, it, expect } from "vitest";
import {
  formatArea,
  formatCurrencyBRL,
  slugify,
  sanitizePhoneForWhatsApp,
  buildPropertyWhatsAppUrl,
} from "@/lib/utils";

describe("lib/utils - Formatadores e Utilitários Imobiliários", () => {
  it("deve formatar valores monetários em BRL corretamente", () => {
    expect(formatCurrencyBRL(1250000)).toContain("1.250.000");
    expect(formatCurrencyBRL(null)).toBe("Sob consulta");
    expect(formatCurrencyBRL(0)).toBe("Sob consulta");
    expect(formatCurrencyBRL(3500.5, { showCents: true })).toContain("3.500,50");
  });

  it("deve formatar área em m²", () => {
    expect(formatArea(412)).toBe("412 m²");
    expect(formatArea(null)).toBe("—");
    expect(formatArea(0)).toBe("—");
  });

  it("deve converter títulos em slugs sem acentos ou caracteres especiais", () => {
    expect(slugify("Apartamento 3 Suítes & Terraço Gourmet")).toBe(
      "apartamento-3-suites-terraco-gourmet"
    );
    expect(slugify("Casa em Condomínio — Fazenda Boa Vista (SP)")).toBe(
      "casa-em-condominio-fazenda-boa-vista-sp"
    );
  });

  it("deve sanitizar números para o formato do WhatsApp com DDI 55", () => {
    expect(sanitizePhoneForWhatsApp("(11) 98888-7777")).toBe("5511988887777");
    expect(sanitizePhoneForWhatsApp("+55 11 98888-7777")).toBe("5511988887777");
    expect(sanitizePhoneForWhatsApp("")).toBe("");
  });

  it("deve gerar link de WhatsApp com código de referência e URL do imóvel", () => {
    const url = buildPropertyWhatsAppUrl({
      whatsappPhone: "(11) 99999-9999",
      propertyTitle: "Penthouse Duplex",
      referenceCode: "REF-1025",
      propertyUrl: "https://imobiliaria.com.br/imoveis/penthouse-duplex",
    });

    expect(url).toContain("wa.me/5511999999999");
    expect(url).toContain("REF-1025");
    expect(url).toContain("penthouse-duplex");
  });
});
