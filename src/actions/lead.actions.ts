"use server";

import { createHash } from "crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  adminLeadUpdateSchema,
  publicLeadSubmissionSchema,
  type PublicLeadSubmissionValues,
} from "@/schemas/lead.schema";
import {
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
} from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { getAuthenticatedAdmin } from "@/lib/supabase/admin-guard";
import type { LeadStatus } from "@/types/domain";

// Rate-limiter em memória por hash de IP (5 envios a cada 10 minutos)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ipHash: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ipHash);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ipHash, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  entry.count += 1;
  return true;
}

export interface LeadActionResult {
  success: boolean;
  message: string;
  persistedInDatabase: boolean;
}

export async function submitPublicLeadAction(
  rawInput: PublicLeadSubmissionValues
): Promise<LeadActionResult> {
  const parsed = publicLeadSubmissionSchema.safeParse(rawInput);

  if (!parsed.success) {
    const firstError =
      parsed.error.issues[0]?.message ??
      "Verifique os campos informados e tente novamente.";
    return {
      success: false,
      message: firstError,
      persistedInDatabase: false,
    };
  }

  const data = parsed.data;

  // Verificação silenciosa de Honeypot contra bots
  if (data.website_honeypot && data.website_honeypot.trim().length > 0) {
    return {
      success: true,
      message: "Solicitação recebida com sucesso.",
      persistedInDatabase: false,
    };
  }

  const headerStore = await headers();
  const rawIp =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "anonymous";
  const ipHash = createHash("sha256")
    .update(`${rawIp}-imobiliaria-salt`)
    .digest("hex")
    .slice(0, 24);

  if (!checkRateLimit(ipHash)) {
    return {
      success: false,
      message:
        "Muitas solicitações enviadas recentemente. Por favor, aguarde alguns minutos ou fale conosco pelo WhatsApp.",
      persistedInDatabase: false,
    };
  }

  const env = getSupabasePublicEnv();
  if (!env.isConfigured) {
    return {
      success: true,
      message:
        "Solicitação validada! (Ambiente de desenvolvimento sem Supabase configurado em .env.local — conecte o banco para persistir leads no CRM).",
      persistedInDatabase: false,
    };
  }

  const serviceClient = createSupabaseServiceRoleClient();
  const anonClient = await createSupabaseServerClient();
  const dbClient = serviceClient ?? anonClient;

  if (!dbClient) {
    return {
      success: false,
      message: "Serviço de banco de dados indisponível no momento.",
      persistedInDatabase: false,
    };
  }

  const { error } = await dbClient.from("leads").insert({
    property_id: data.property_id || null,
    property_reference_code: data.property_reference_code || null,
    property_title: data.property_title || null,
    name: data.name,
    phone: data.phone,
    email: data.email || null,
    message: data.message,
    source: data.source,
    status: "novo",
    consent_lgpd: true,
    ip_hash: ipHash,
  });

  if (error) {
    return {
      success: false,
      message:
        "Não foi possível registrar sua solicitação no momento. Por favor, tente novamente ou utilize o atendimento via WhatsApp.",
      persistedInDatabase: false,
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/interessados");

  return {
    success: true,
    message:
      "Recebemos sua solicitação com sucesso! Um consultor especialista entrará em contato em breve.",
    persistedInDatabase: true,
  };
}

export async function updateAdminLeadStatusAction(input: {
  id: string;
  status: LeadStatus;
  internal_notes?: string | null;
}): Promise<{ success: boolean; message: string }> {
  const { admin } = await getAuthenticatedAdmin();
  if (!admin) {
    return {
      success: false,
      message: "Acesso negado. Faça login como administrador autorizado.",
    };
  }

  const parsed = adminLeadUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      success: false,
      message: "Cliente Supabase não configurado.",
    };
  }

  const { error } = await supabase
    .from("leads")
    .update({
      status: parsed.data.status,
      internal_notes: parsed.data.internal_notes ?? null,
    })
    .eq("id", parsed.data.id);

  if (error) {
    return {
      success: false,
      message: `Erro ao atualizar atendimento: ${error.message}`,
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/interessados");

  return {
    success: true,
    message: "Status e observações do atendimento atualizados com sucesso.",
  };
}
