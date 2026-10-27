import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export function createSupabaseBrowserClient() {
  const env = getSupabasePublicEnv();
  if (!env.isConfigured) {
    return null;
  }
  return createBrowserClient(env.url, env.anonKey);
}
