"use server";

import { revalidatePath } from "next/cache";
import {
  propertyFormSchema,
  type PropertyFormValues,
} from "@/schemas/property.schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/supabase/admin-guard";
import { slugify } from "@/lib/utils";
import type { AvailabilityStatus, PublicationStatus } from "@/types/domain";

function revalidatePropertyRoutes(slug?: string) {
  revalidatePath("/");
  revalidatePath("/comprar");
  revalidatePath("/alugar");
  revalidatePath("/imoveis");
  if (slug) {
    revalidatePath(`/imoveis/${slug}`);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/imoveis");
}

export async function savePropertyAction(
  propertyId: string | null,
  rawValues: PropertyFormValues
): Promise<{ success: boolean; message: string; id?: string; slug?: string }> {
  const { admin } = await getAuthenticatedAdmin();
  if (!admin) {
    return {
      success: false,
      message: "Sessão expirada ou sem permissão administrativa.",
    };
  }

  const parsed = propertyFormSchema.safeParse(rawValues);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      message: firstIssue
        ? `${firstIssue.path.join(".")}: ${firstIssue.message}`
        : "Dados inválidos no formulário do imóvel.",
    };
  }

  const data = parsed.data;
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      success: false,
      message: "Supabase não está configurado no servidor.",
    };
  }

  const payload = {
    reference_code: data.reference_code,
    title: data.title,
    slug: slugify(data.slug || data.title),
    property_type: data.property_type,
    purpose: data.purpose,
    description: data.description,
    short_description: data.short_description || null,
    zip_code: data.zip_code || null,
    state: data.state.toUpperCase(),
    city: data.city,
    neighborhood: data.neighborhood,
    street: data.street || null,
    street_number: data.street_number || null,
    complement: data.complement || null,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    hide_exact_address: data.hide_exact_address,
    sale_price: data.sale_price ?? null,
    rent_price: data.rent_price ?? null,
    condo_fee: data.condo_fee ?? null,
    iptu_price: data.iptu_price ?? null,
    iptu_periodicity: data.iptu_periodicity,
    other_fees: data.other_fees ?? null,
    other_fees_description: data.other_fees_description || null,
    usable_area: data.usable_area ?? null,
    built_area: data.built_area ?? null,
    total_area: data.total_area ?? null,
    bedrooms: data.bedrooms,
    suites: data.suites,
    bathrooms: data.bathrooms,
    parking_spots: data.parking_spots,
    floor_number: data.floor_number ?? null,
    is_furnished: data.is_furnished,
    is_pet_friendly: data.is_pet_friendly,
    is_high_end: data.is_high_end || data.property_type === "alto_padrao",
    amenities: data.amenities,
    highlights: data.highlights,
    availability_status: data.availability_status,
    publication_status: data.publication_status,
    is_featured: data.is_featured,
    meta_title: data.meta_title || null,
    meta_description: data.meta_description || null,
  };

  let targetPropertyId: string;

  if (propertyId) {
    targetPropertyId = propertyId;
    const { error: updateErr } = await supabase
      .from("properties")
      .update(payload)
      .eq("id", targetPropertyId);

    if (updateErr) {
      return {
        success: false,
        message: `Erro ao atualizar imóvel: ${updateErr.message}`,
      };
    }
  } else {
    const { data: inserted, error: insertErr } = await supabase
      .from("properties")
      .insert({
        ...payload,
        created_by: admin.id,
      })
      .select("id")
      .single();

    if (insertErr || !inserted) {
      return {
        success: false,
        message: `Erro ao cadastrar imóvel: ${insertErr?.message ?? "Falha desconhecida"}`,
      };
    }
    targetPropertyId = String(inserted.id);
  }

  // Sincronização de imagens evitando arquivos órfãos no Supabase Storage
  const { data: existingImages } = await supabase
    .from("property_images")
    .select("id, storage_path")
    .eq("property_id", targetPropertyId);

  const incomingStoragePaths = new Set(
    data.images
      .map((img) => img.storage_path)
      .filter((p): p is string => Boolean(p))
  );

  const removedStoragePaths = (existingImages ?? [])
    .map((img) => img.storage_path as string | null)
    .filter(
      (path): path is string =>
        typeof path === "string" && !incomingStoragePaths.has(path)
    );

  if (removedStoragePaths.length > 0) {
    await supabase.storage.from("property-images").remove(removedStoragePaths);
  }

  await supabase
    .from("property_images")
    .delete()
    .eq("property_id", targetPropertyId);

  if (data.images.length > 0) {
    const hasExplicitCover = data.images.some((img) => img.is_cover);
    const imagesToInsert = data.images.map((img, idx) => ({
      property_id: targetPropertyId,
      storage_path: img.storage_path || null,
      url: img.url,
      alt_text: img.alt_text || data.title,
      is_cover: hasExplicitCover ? img.is_cover : idx === 0,
      display_order: idx,
      file_size: img.file_size ?? null,
      mime_type: img.mime_type ?? null,
    }));

    await supabase.from("property_images").insert(imagesToInsert);
  }

  revalidatePropertyRoutes(payload.slug);

  return {
    success: true,
    message: propertyId
      ? "Imóvel atualizado com sucesso!"
      : "Imóvel cadastrado com sucesso!",
    id: targetPropertyId,
    slug: payload.slug,
  };
}

export async function duplicatePropertyAction(
  propertyId: string
): Promise<{ success: boolean; message: string; newId?: string }> {
  const { admin } = await getAuthenticatedAdmin();
  if (!admin) {
    return { success: false, message: "Não autorizado." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { success: false, message: "Supabase não configurado." };
  }

  const { data: original, error } = await supabase
    .from("properties")
    .select("*, property_images(*)")
    .eq("id", propertyId)
    .single();

  if (error || !original) {
    return { success: false, message: "Imóvel original não encontrado." };
  }

  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const newReference = `${original.reference_code}-${randomSuffix}`;
  const newSlug = `${original.slug}-copia-${randomSuffix}`;

  const {
    id: _unusedId,
    property_images: originalImages,
    created_at: _unusedCreated,
    updated_at: _unusedUpdated,
    views_count: _unusedViews,
    ...rest
  } = original as Record<string, unknown>;

  const { data: created, error: createError } = await supabase
    .from("properties")
    .insert({
      ...rest,
      reference_code: newReference,
      title: `${String(original.title)} (Cópia)`,
      slug: newSlug,
      publication_status: "rascunho",
      is_featured: false,
      views_count: 0,
      created_by: admin.id,
    })
    .select("id")
    .single();

  if (createError || !created) {
    return {
      success: false,
      message: `Erro ao duplicar imóvel: ${createError?.message ?? ""}`,
    };
  }

  if (Array.isArray(originalImages) && originalImages.length > 0) {
    const copiedImages = originalImages.map(
      (img: Record<string, unknown>, index: number) => ({
        property_id: created.id,
        storage_path: null, // Não copia o path físico para evitar que exclusão na cópia apague o arquivo original
        url: String(img.url),
        alt_text: String(img.alt_text ?? ""),
        is_cover: Boolean(img.is_cover),
        display_order: Number(img.display_order ?? index),
      })
    );
    await supabase.from("property_images").insert(copiedImages);
  }

  revalidatePropertyRoutes();
  return {
    success: true,
    message: `Imóvel duplicado como rascunho (${newReference}).`,
    newId: String(created.id),
  };
}

export async function updatePropertyStatusAction(
  propertyId: string,
  patch: {
    publication_status?: PublicationStatus;
    availability_status?: AvailabilityStatus;
    is_featured?: boolean;
  }
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
    .from("properties")
    .update(patch)
    .eq("id", propertyId);

  if (error) {
    return {
      success: false,
      message: `Erro ao alterar status: ${error.message}`,
    };
  }

  revalidatePropertyRoutes();
  return {
    success: true,
    message: "Status do imóvel atualizado com sucesso.",
  };
}

export async function deletePropertyAction(
  propertyId: string
): Promise<{ success: boolean; message: string }> {
  const { admin } = await getAuthenticatedAdmin();
  if (!admin) {
    return { success: false, message: "Não autorizado." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { success: false, message: "Supabase não configurado." };
  }

  // Remove arquivos físicos do bucket antes da exclusão
  const { data: images } = await supabase
    .from("property_images")
    .select("storage_path")
    .eq("property_id", propertyId);

  const paths = (images ?? [])
    .map((img) => img.storage_path as string | null)
    .filter((p): p is string => Boolean(p));

  if (paths.length > 0) {
    await supabase.storage.from("property-images").remove(paths);
  }

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", propertyId);

  if (error) {
    return {
      success: false,
      message: `Erro ao excluir imóvel: ${error.message}`,
    };
  }

  revalidatePropertyRoutes();
  return {
    success: true,
    message: "Imóvel e imagens associadas excluídos permanentemente.",
  };
}
