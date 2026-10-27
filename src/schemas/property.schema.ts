import { z } from "zod";

export const propertyTypeSchema = z.enum([
  "apartamento",
  "casa",
  "condominio",
  "cobertura",
  "terreno",
  "comercial",
  "alto_padrao",
]);

export const propertyPurposeSchema = z.enum(["venda", "aluguel", "ambos"]);

export const iptuPeriodicitySchema = z.enum(["mensal", "anual", "isento"]);

export const availabilityStatusSchema = z.enum([
  "disponivel",
  "reservado",
  "vendido",
  "alugado",
  "inativo",
]);

export const publicationStatusSchema = z.enum([
  "rascunho",
  "publicado",
  "arquivado",
]);

export const propertyImageInputSchema = z.object({
  id: z.string().optional(),
  storage_path: z.string().nullable().optional(),
  url: z.string().url("URL da imagem inválida"),
  alt_text: z.string().max(180).default(""),
  is_cover: z.boolean().default(false),
  display_order: z.number().int().min(0).default(0),
  file_size: z.number().int().nullable().optional(),
  mime_type: z.string().nullable().optional(),
});

export const propertyFormSchema = z
  .object({
    reference_code: z
      .string()
      .trim()
      .min(2, "Informe o código de referência (ex: REF-1025)")
      .max(40, "Código muito longo"),
    title: z
      .string()
      .trim()
      .min(5, "O título deve ter pelo menos 5 caracteres")
      .max(160, "O título deve ter no máximo 160 caracteres"),
    slug: z
      .string()
      .trim()
      .min(3, "Slug obrigatório")
      .max(180)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "O slug deve conter apenas letras minúsculas, números e hifens"
      ),
    property_type: propertyTypeSchema,
    purpose: propertyPurposeSchema,
    description: z
      .string()
      .trim()
      .min(20, "A descrição completa deve ter pelo menos 20 caracteres")
      .max(8000),
    short_description: z.string().trim().max(320).optional().nullable(),

    // Localização
    zip_code: z.string().trim().max(15).optional().nullable(),
    state: z.string().trim().min(2, "UF obrigatória").max(2),
    city: z.string().trim().min(2, "Cidade obrigatória").max(100),
    neighborhood: z.string().trim().min(2, "Bairro obrigatório").max(100),
    street: z.string().trim().max(160).optional().nullable(),
    street_number: z.string().trim().max(30).optional().nullable(),
    complement: z.string().trim().max(80).optional().nullable(),
    latitude: z.number().min(-90).max(90).optional().nullable(),
    longitude: z.number().min(-180).max(180).optional().nullable(),
    hide_exact_address: z.boolean().default(true),

    // Valores
    sale_price: z.number().nonnegative().optional().nullable(),
    rent_price: z.number().nonnegative().optional().nullable(),
    condo_fee: z.number().nonnegative().optional().nullable(),
    iptu_price: z.number().nonnegative().optional().nullable(),
    iptu_periodicity: iptuPeriodicitySchema.default("mensal"),
    other_fees: z.number().nonnegative().optional().nullable(),
    other_fees_description: z.string().trim().max(180).optional().nullable(),

    // Características
    usable_area: z.number().nonnegative().optional().nullable(),
    built_area: z.number().nonnegative().optional().nullable(),
    total_area: z.number().nonnegative().optional().nullable(),
    bedrooms: z.number().int().min(0).max(50).default(0),
    suites: z.number().int().min(0).max(50).default(0),
    bathrooms: z.number().int().min(0).max(50).default(0),
    parking_spots: z.number().int().min(0).max(100).default(0),
    floor_number: z.number().int().min(0).max(150).optional().nullable(),
    is_furnished: z.boolean().default(false),
    is_pet_friendly: z.boolean().default(false),
    is_high_end: z.boolean().default(false),
    amenities: z.array(z.string().trim().min(1)).default([]),
    highlights: z.array(z.string().trim().min(1)).default([]),

    // Controle
    availability_status: availabilityStatusSchema.default("disponivel"),
    publication_status: publicationStatusSchema.default("rascunho"),
    is_featured: z.boolean().default(false),

    // SEO
    meta_title: z.string().trim().max(120).optional().nullable(),
    meta_description: z.string().trim().max(260).optional().nullable(),

    // Imagens associadas
    images: z.array(propertyImageInputSchema).default([]),
  })
  .superRefine((data, ctx) => {
    if (
      (data.purpose === "venda" || data.purpose === "ambos") &&
      (!data.sale_price || data.sale_price <= 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sale_price"],
        message: "Informe o valor de venda para imóveis destinados à venda",
      });
    }
    if (
      (data.purpose === "aluguel" || data.purpose === "ambos") &&
      (!data.rent_price || data.rent_price <= 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rent_price"],
        message: "Informe o valor de aluguel mensal para imóveis de locação",
      });
    }
  });

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
