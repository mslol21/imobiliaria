export interface SupabasePublicEnv {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export function getSupabasePublicEnv(): SupabasePublicEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

  const isPlaceholder =
    !url ||
    !anonKey ||
    url.includes("seu-projeto.supabase.co") ||
    anonKey.includes("sua-chave-anon");

  return {
    url,
    anonKey,
    isConfigured: !isPlaceholder && url.startsWith("http"),
  };
}

export function isDevPreviewEnabled(): boolean {
  const flag = process.env.NEXT_PUBLIC_ENABLE_DEV_PREVIEW_DATA;
  if (flag === "false" || flag === "0") {
    return false;
  }
  return process.env.NODE_ENV !== "production" || flag === "true";
}
