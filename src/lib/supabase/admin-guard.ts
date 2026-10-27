import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "editor";
}

export async function getAuthenticatedAdmin(): Promise<{
  admin: AuthenticatedAdmin | null;
  supabaseConfigured: boolean;
  reason?: "unconfigured" | "unauthenticated" | "unauthorized_profile";
}> {
  const env = getSupabasePublicEnv();
  if (!env.isConfigured) {
    return {
      admin: null,
      supabaseConfigured: false,
      reason: "unconfigured",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      admin: null,
      supabaseConfigured: false,
      reason: "unconfigured",
    };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      admin: null,
      supabaseConfigured: true,
      reason: "unauthenticated",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_active || !["admin", "editor"].includes(profile.role)) {
    return {
      admin: null,
      supabaseConfigured: true,
      reason: "unauthorized_profile",
    };
  }

  return {
    admin: {
      id: profile.id,
      email: profile.email || user.email || "",
      fullName: profile.full_name || "Administrador",
      role: profile.role as "admin" | "editor",
    },
    supabaseConfigured: true,
  };
}

export async function requireAuthenticatedAdmin(): Promise<AuthenticatedAdmin> {
  const result = await getAuthenticatedAdmin();

  if (!result.supabaseConfigured) {
    redirect("/admin/login?status=supabase_unconfigured");
  }

  if (!result.admin) {
    redirect(
      result.reason === "unauthorized_profile"
        ? "/admin/login?status=unauthorized"
        : "/admin/login"
    );
  }

  return result.admin;
}
