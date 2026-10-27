import { z } from "zod";

export const leadSourceSchema = z.enum([
  "formulario_imovel",
  "agendar_visita",
  "contato_geral",
  "anunciar_imovel",
  "whatsapp",
]);

export const leadStatusSchema = z.enum([
  "novo",
  "em_atendimento",
  "visita_agendada",
  "negociacao",
  "convertido",
  "encerrado",
]);

export const publicLeadSubmissionSchema = z.object({
  property_id: z.string().uuid().optional().nullable(),
  property_reference_code: z.string().trim().max(40).optional().nullable(),
  property_title: z.string().trim().max(180).optional().nullable(),
  name: z
    .string()
    .trim()
    .min(2, "Por favor, informe seu nome completo")
    .max(120, "Nome muito longo"),
  phone: z
    .string()
    .trim()
    .min(8, "Informe um telefone ou WhatsApp válido com DDD")
    .max(30, "Telefone inválido"),
  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(5, "Escreva uma breve mensagem (mínimo 5 caracteres)")
    .max(2000, "Mensagem muito longa"),
  source: leadSourceSchema.default("formulario_imovel"),
  consent_lgpd: z
    .boolean()
    .refine((val) => val === true, {
      message:
        "É necessário concordar com a Política de Privacidade para prosseguir.",
    }),
  // Campo honeypot antispam (deve permanecer vazio por usuários reais)
  website_honeypot: z.string().max(0).optional().default(""),
});

export type PublicLeadSubmissionValues = z.infer<
  typeof publicLeadSubmissionSchema
>;

export const adminLeadUpdateSchema = z.object({
  id: z.string().uuid(),
  status: leadStatusSchema,
  internal_notes: z.string().trim().max(4000).optional().nullable(),
});
