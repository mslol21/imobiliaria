import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import {
  DEFAULT_HERO_BANNER,
  DEFAULT_SITE_SETTINGS,
} from "@/services/dev-preview-data";
import type { AgencyDifferential, Banner, SiteSettings } from "@/types/domain";

export async function getSiteSettings(): Promise<SiteSettings> {
  const env = getSupabasePublicEnv();
  if (!env.isConfigured) {
    return DEFAULT_SITE_SETTINGS;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return DEFAULT_SITE_SETTINGS;
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return DEFAULT_SITE_SETTINGS;
  }

  const rawDiffs = Array.isArray(data.about_differentials)
    ? (data.about_differentials as AgencyDifferential[])
    : DEFAULT_SITE_SETTINGS.about_differentials;

  return {
    id: String(data.id),
    agency_name: String(data.agency_name || DEFAULT_SITE_SETTINGS.agency_name),
    agency_slogan: String(
      data.agency_slogan || DEFAULT_SITE_SETTINGS.agency_slogan
    ),
    creci: String(data.creci ?? ""),
    cnpj: String(data.cnpj ?? ""),
    phone: String(data.phone ?? ""),
    whatsapp: String(data.whatsapp ?? ""),
    email: String(data.email ?? ""),
    address_line: String(data.address_line ?? ""),
    city: String(data.city ?? "São Paulo"),
    state: String(data.state ?? "SP"),
    zip_code: String(data.zip_code ?? ""),
    business_hours: String(
      data.business_hours || DEFAULT_SITE_SETTINGS.business_hours
    ),
    about_title: String(data.about_title || DEFAULT_SITE_SETTINGS.about_title),
    about_history: String(
      data.about_history || DEFAULT_SITE_SETTINGS.about_history
    ),
    about_positioning: String(
      data.about_positioning || DEFAULT_SITE_SETTINGS.about_positioning
    ),
    about_differentials:
      rawDiffs.length > 0 ? rawDiffs : DEFAULT_SITE_SETTINGS.about_differentials,
    about_consulting: String(
      data.about_consulting || DEFAULT_SITE_SETTINGS.about_consulting
    ),
    instagram_url: String(data.instagram_url ?? ""),
    linkedin_url: String(data.linkedin_url ?? ""),
    youtube_url: String(data.youtube_url ?? ""),
    facebook_url: String(data.facebook_url ?? ""),
    privacy_policy_updated_at: String(
      data.privacy_policy_updated_at ?? DEFAULT_SITE_SETTINGS.privacy_policy_updated_at
    ),
    updated_at: String(data.updated_at ?? new Date().toISOString()),
    is_configured: true,
  };
}

export async function getActiveBanners(
  position?: Banner["position"]
): Promise<Banner[]> {
  const env = getSupabasePublicEnv();
  if (!env.isConfigured) {
    return [DEFAULT_HERO_BANNER];
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return [DEFAULT_HERO_BANNER];

  let query = supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (position) {
    query = query.eq("position", position);
  }

  const { data, error } = await query;
  if (error || !data || data.length === 0) {
    return [DEFAULT_HERO_BANNER];
  }

  return data.map((row) => ({
    id: String(row.id),
    title: String(row.title),
    subtitle: row.subtitle ? String(row.subtitle) : null,
    image_url: String(row.image_url),
    storage_path: row.storage_path ? String(row.storage_path) : null,
    cta_label: row.cta_label ? String(row.cta_label) : null,
    cta_href: row.cta_href ? String(row.cta_href) : null,
    position: (row.position as Banner["position"]) ?? "hero",
    display_order: Number(row.display_order ?? 0),
    is_active: Boolean(row.is_active),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  }));
}

export async function getAllAdminBanners(): Promise<Banner[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("banners")
    .select("*")
    .order("display_order", { ascending: true });

  if (!data) return [];

  return data.map((row) => ({
    id: String(row.id),
    title: String(row.title),
    subtitle: row.subtitle ? String(row.subtitle) : null,
    image_url: String(row.image_url),
    storage_path: row.storage_path ? String(row.storage_path) : null,
    cta_label: row.cta_label ? String(row.cta_label) : null,
    cta_href: row.cta_href ? String(row.cta_href) : null,
    position: (row.position as Banner["position"]) ?? "hero",
    display_order: Number(row.display_order ?? 0),
    is_active: Boolean(row.is_active),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  }));
}
