import { z } from "zod";

export const agencyDifferentialSchema = z.object({
  title: z.string().trim().min(2, "Título obrigatório").max(100),
  description: z.string().trim().min(5, "Descrição obrigatória").max(400),
});

export const siteSettingsSchema = z.object({
  agency_name: z.string().trim().min(2, "Nome da imobiliária obrigatório").max(120),
  agency_slogan: z.string().trim().max(240).optional().default(""),
  creci: z.string().trim().max(60).optional().default(""),
  cnpj: z.string().trim().max(30).optional().default(""),
  phone: z.string().trim().max(40).optional().default(""),
  whatsapp: z.string().trim().max(40).optional().default(""),
  email: z.string().trim().email("E-mail inválido").optional().or(z.literal("")),
  address_line: z.string().trim().max(240).optional().default(""),
  city: z.string().trim().max(100).optional().default(""),
  state: z.string().trim().max(2).optional().default("SP"),
  zip_code: z.string().trim().max(20).optional().default(""),
  business_hours: z.string().trim().max(180).optional().default(""),
  about_title: z.string().trim().max(180).optional().default(""),
  about_history: z.string().trim().max(4000).optional().default(""),
  about_positioning: z.string().trim().max(4000).optional().default(""),
  about_differentials: z.array(agencyDifferentialSchema).default([]),
  about_consulting: z.string().trim().max(2000).optional().default(""),
  instagram_url: z.string().trim().url("URL inválida").optional().or(z.literal("")),
  linkedin_url: z.string().trim().url("URL inválida").optional().or(z.literal("")),
  youtube_url: z.string().trim().url("URL inválida").optional().or(z.literal("")),
  facebook_url: z.string().trim().url("URL inválida").optional().or(z.literal("")),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

export const bannerFormSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(3, "Título obrigatório").max(140),
  subtitle: z.string().trim().max(280).optional().nullable(),
  image_url: z.string().trim().url("Informe uma URL válida ou envie uma imagem"),
  storage_path: z.string().optional().nullable(),
  cta_label: z.string().trim().max(60).optional().nullable(),
  cta_href: z.string().trim().max(200).optional().nullable(),
  position: z.enum(["hero", "home_destaque", "institucional"]).default("hero"),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export type BannerFormValues = z.infer<typeof bannerFormSchema>;
