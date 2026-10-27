"use server";

import { revalidatePath } from "next/cache";
import {
  bannerFormSchema,
  siteSettingsSchema,
  type BannerFormValues,
  type SiteSettingsFormValues,
} from "@/schemas/settings.schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/supabase/admin-guard";

export async function saveSiteSettingsAction(
  rawValues: SiteSettingsFormValues
): Promise<{ success: boolean; message: string }> {
  const { admin } = await getAuthenticatedAdmin();
  if (!admin) {
    return { success: false, message: "Acesso restrito a administradores." };
  }

  const parsed = siteSettingsSchema.safeParse(rawValues);
  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]?.message ??
        "Verifique os campos de configuração institucional.",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { success: false, message: "Supabase não configurado." };
  }

  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  const payload = {
    ...parsed.data,
    email: parsed.data.email || null,
    instagram_url: parsed.data.instagram_url || null,
    linkedin_url: parsed.data.linkedin_url || null,
    youtube_url: parsed.data.youtube_url || null,
    facebook_url: parsed.data.facebook_url || null,
  };

  if (existing?.id) {
    const { error } = await supabase
      .from("site_settings")
      .update(payload)
      .eq("id", existing.id);

    if (error) {
      return {
        success: false,
        message: `Erro ao salvar configurações: ${error.message}`,
      };
    }
  } else {
    const { error } = await supabase.from("site_settings").insert(payload);
    if (error) {
      return {
        success: false,
        message: `Erro ao criar configurações: ${error.message}`,
      };
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/sobre");
  revalidatePath("/contato");
  revalidatePath("/admin/configuracoes");

  return {
    success: true,
    message: "Configurações institucionais e de contato atualizadas com sucesso!",
  };
}

export async function saveBannerAction(
  rawValues: BannerFormValues
): Promise<{ success: boolean; message: string }> {
  const { admin } = await getAuthenticatedAdmin();
  if (!admin) {
    return { success: false, message: "Acesso restrito a administradores." };
  }

  const parsed = bannerFormSchema.safeParse(rawValues);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados do banner inválidos.",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { success: false, message: "Supabase não configurado." };
  }

  const { id, ...payload } = parsed.data;

  if (id) {
    const { error } = await supabase
      .from("banners")
      .update(payload)
      .eq("id", id);
    if (error) {
      return {
        success: false,
        message: `Erro ao atualizar banner: ${error.message}`,
      };
    }
  } else {
    const { error } = await supabase.from("banners").insert(payload);
    if (error) {
      return {
        success: false,
        message: `Erro ao criar banner: ${error.message}`,
      };
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/banners");

  return {
    success: true,
    message: id ? "Banner atualizado com sucesso!" : "Banner adicionado com sucesso!",
  };
}

export async function toggleBannerActiveAction(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; message: string }> {
  const { admin } = await getAuthenticatedAdmin();
  if (!admin) {
    return { success: false, message: "Não autorizado." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { success: false, message: "Supabase não configurado." };
  }

  const { error } = await supabase
    .from("banners")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: `Erro ao alterar status do banner: ${error.message}`,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/banners");
  return {
    success: true,
    message: isActive ? "Banner ativado." : "Banner desativado.",
  };
}

export async function deleteBannerAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  const { admin } = await getAuthenticatedAdmin();
  if (!admin) {
    return { success: false, message: "Não autorizado." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { success: false, message: "Supabase não configurado." };
  }

  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) {
    return {
      success: false,
      message: `Erro ao excluir banner: ${error.message}`,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/banners");
  return {
    success: true,
    message: "Banner excluído com sucesso.",
  };
}
