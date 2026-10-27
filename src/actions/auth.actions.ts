"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export async function signInAdminAction(
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  const env = getSupabasePublicEnv();
  if (!env.isConfigured) {
    return {
      success: false,
      message:
        "O Supabase ainda não foi configurado em .env.local. Consulte as instruções abaixo para conectar seu banco e autenticar.",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      success: false,
      message: "Cliente de autenticação indisponível.",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.user) {
    return {
      success: false,
      message: "Credenciais inválidas ou usuário não encontrado.",
    };
  }

  // Verifica se o usuário possui perfil ativo na tabela profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || !profile.is_active || !["admin", "editor"].includes(profile.role)) {
    await supabase.auth.signOut();
    return {
      success: false,
      message:
        "Conta autenticada, porém sem permissão administrativa ativa na tabela public.profiles.",
    };
  }

  return {
    success: true,
    message: "Autenticação realizada com sucesso.",
  };
}

export async function signOutAdminAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
