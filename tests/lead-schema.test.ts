import { describe, it, expect } from "vitest";
import { publicLeadSubmissionSchema } from "@/schemas/lead.schema";

describe("schemas/lead.schema - Validação de Leads e Antispam", () => {
  const validLead = {
    name: "Dr. Roberto Albuquerque",
    phone: "(11) 98765-4321",
    email: "roberto@exemplo.com.br",
    message: "Gostaria de agendar uma visita privativa neste sábado.",
    source: "formulario_imovel" as const,
    consent_lgpd: true as const,
    website_honeypot: "",
  };

  it("deve aprovar lead com consentimento LGPD e campos válidos", () => {
    const result = publicLeadSubmissionSchema.safeParse(validLead);
    expect(result.success).toBe(true);
  });

  it("deve rejeitar submissão quando usuário não aceita LGPD", () => {
    const withoutConsent = { ...validLead, consent_lgpd: false };
    const result = publicLeadSubmissionSchema.safeParse(withoutConsent);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path.includes("consent_lgpd"))
      ).toBe(true);
    }
  });

  it("deve rejeitar submissão quando o honeypot for preenchido (bot)", () => {
    const botSubmission = {
      ...validLead,
      website_honeypot: "http://bot-spam.com",
    };
    const result = publicLeadSubmissionSchema.safeParse(botSubmission);
    expect(result.success).toBe(false);
  });

  it("deve rejeitar telefones muito curtos", () => {
    const shortPhone = { ...validLead, phone: "123" };
    const result = publicLeadSubmissionSchema.safeParse(shortPhone);
    expect(result.success).toBe(false);
  });
});
