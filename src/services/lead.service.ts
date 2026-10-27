import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Lead, LeadStatus } from "@/types/domain";

export async function getAdminLeads(params?: {
  status?: LeadStatus | "todos";
  search?: string;
}): Promise<Lead[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (params?.status && params.status !== "todos") {
    query = query.eq("status", params.status);
  }

  if (params?.search && params.search.trim() !== "") {
    const q = params.search.trim().replace(/[,%]/g, "");
    query = query.or(
      `name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%,property_reference_code.ilike.%${q}%,property_title.ilike.%${q}%`
    );
  }

  const { data } = await query;
  if (!data) return [];

  return data.map((row) => ({
    id: String(row.id),
    property_id: row.property_id ? String(row.property_id) : null,
    property_reference_code: row.property_reference_code
      ? String(row.property_reference_code)
      : null,
    property_title: row.property_title ? String(row.property_title) : null,
    name: String(row.name ?? ""),
    phone: String(row.phone ?? ""),
    email: row.email ? String(row.email) : null,
    message: String(row.message ?? ""),
    source: (row.source as Lead["source"]) ?? "formulario_imovel",
    status: (row.status as Lead["status"]) ?? "novo",
    internal_notes: row.internal_notes ? String(row.internal_notes) : null,
    consent_lgpd: Boolean(row.consent_lgpd),
    ip_hash: row.ip_hash ? String(row.ip_hash) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  }));
}
