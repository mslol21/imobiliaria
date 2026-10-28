"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  PropertyImageUploader,
  type ManagedPropertyImage,
} from "@/components/admin/property-image-uploader";
import {
  propertyFormSchema,
  type PropertyFormValues,
} from "@/schemas/property.schema";
import { savePropertyAction } from "@/actions/property.actions";
import {
  AVAILABILITY_STATUS_LABELS,
  COMMON_AMENITIES,
  PROPERTY_PURPOSE_LABELS,
  PROPERTY_TYPE_LABELS,
  PUBLICATION_STATUS_LABELS,
} from "@/config/design-tokens";
import { cn, slugify } from "@/lib/utils";
import type {
  AvailabilityStatus,
  Property,
  PropertyPurpose,
  PropertyType,
  PublicationStatus,
} from "@/types/domain";

interface PropertyFormProps {
  initialProperty?: Property | null;
}

export function PropertyForm({ initialProperty }: PropertyFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [newHighlightInput, setNewHighlightInput] = useState("");
  const [customAmenityInput, setCustomAmenityInput] = useState("");

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema) as any,
    defaultValues: {
      reference_code:
        initialProperty?.reference_code ??
        `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      title: initialProperty?.title ?? "",
      slug: initialProperty?.slug ?? "",
      property_type: initialProperty?.property_type ?? "apartamento",
      purpose: initialProperty?.purpose ?? "venda",
      description: initialProperty?.description ?? "",
      short_description: initialProperty?.short_description ?? "",
      zip_code: initialProperty?.zip_code ?? "",
      state: initialProperty?.state ?? "SP",
      city: initialProperty?.city ?? "São Paulo",
      neighborhood: initialProperty?.neighborhood ?? "",
      street: initialProperty?.street ?? "",
      street_number: initialProperty?.street_number ?? "",
      complement: initialProperty?.complement ?? "",
      latitude: initialProperty?.latitude ?? null,
      longitude: initialProperty?.longitude ?? null,
      hide_exact_address: initialProperty?.hide_exact_address ?? true,
      sale_price: initialProperty?.sale_price ?? null,
      rent_price: initialProperty?.rent_price ?? null,
      condo_fee: initialProperty?.condo_fee ?? null,
      iptu_price: initialProperty?.iptu_price ?? null,
      iptu_periodicity: initialProperty?.iptu_periodicity ?? "mensal",
      other_fees: initialProperty?.other_fees ?? null,
      other_fees_description: initialProperty?.other_fees_description ?? "",
      usable_area: initialProperty?.usable_area ?? null,
      built_area: initialProperty?.built_area ?? null,
      total_area: initialProperty?.total_area ?? null,
      bedrooms: initialProperty?.bedrooms ?? 3,
      suites: initialProperty?.suites ?? 2,
      bathrooms: initialProperty?.bathrooms ?? 3,
      parking_spots: initialProperty?.parking_spots ?? 2,
      floor_number: initialProperty?.floor_number ?? null,
      is_furnished: initialProperty?.is_furnished ?? false,
      is_pet_friendly: initialProperty?.is_pet_friendly ?? true,
      is_high_end: initialProperty?.is_high_end ?? false,
      amenities: initialProperty?.amenities ?? [],
      highlights: initialProperty?.highlights ?? [],
      availability_status: initialProperty?.availability_status ?? "disponivel",
      publication_status: initialProperty?.publication_status ?? "publicado",
      is_featured: initialProperty?.is_featured ?? false,
      meta_title: initialProperty?.meta_title ?? "",
      meta_description: initialProperty?.meta_description ?? "",
      images:
        initialProperty?.images.map((img, idx) => ({
          id: img.id,
          storage_path: img.storage_path,
          url: img.url,
          alt_text: img.alt_text,
          is_cover: img.is_cover,
          display_order: idx,
          file_size: img.file_size,
          mime_type: img.mime_type,
        })) ?? [],
    },
  });

  const watchedAmenities = form.watch("amenities") ?? [];
  const watchedHighlights = form.watch("highlights") ?? [];
  const watchedImages = (form.watch("images") ?? []) as ManagedPropertyImage[];
  const watchedRefCode = form.watch("reference_code");

  function handleAutoSlug() {
    const currentTitle = form.getValues("title");
    const currentNeighborhood = form.getValues("neighborhood");
    const currentRef = form.getValues("reference_code");
    if (!currentTitle) return;
    const generated = slugify(
      `${currentTitle} ${currentNeighborhood || ""} ${currentRef || ""}`
    );
    form.setValue("slug", generated, { shouldValidate: true });
  }

  function toggleAmenity(amenity: string) {
    const current = form.getValues("amenities") ?? [];
    if (current.includes(amenity)) {
      form.setValue(
        "amenities",
        current.filter((a) => a !== amenity)
      );
    } else {
      form.setValue("amenities", [...current, amenity]);
    }
  }

  function addCustomAmenity() {
    const trimmed = customAmenityInput.trim();
    if (!trimmed) return;
    const current = form.getValues("amenities") ?? [];
    if (!current.includes(trimmed)) {
      form.setValue("amenities", [...current, trimmed]);
    }
    setCustomAmenityInput("");
  }

  function addHighlight() {
    const trimmed = newHighlightInput.trim();
    if (!trimmed) return;
    const current = form.getValues("highlights") ?? [];
    if (!current.includes(trimmed)) {
      form.setValue("highlights", [...current, trimmed]);
    }
    setNewHighlightInput("");
  }

  function removeHighlight(item: string) {
    const current = form.getValues("highlights") ?? [];
    form.setValue(
      "highlights",
      current.filter((h) => h !== item)
    );
  }

  async function onSubmit(values: PropertyFormValues) {
    setSubmitting(true);
    setFeedback(null);

    const res = await savePropertyAction(initialProperty?.id ?? null, values);
    setSubmitting(false);

    if (!res.success) {
      setFeedback({ type: "error", text: res.message });
      return;
    }

    setFeedback({ type: "success", text: res.message });
    router.push("/admin/imoveis");
    router.refresh();
  }

  const parseNumberField = (val: string): number | null => {
    if (!val || val.trim() === "") return null;
    const num = Number(val);
    return Number.isNaN(num) ? null : num;
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* 1. IDENTIFICAÇÃO */}
      <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <h2 className="font-editorial text-2xl font-semibold text-[#0e7490] border-b border-[#e2e8f0] pb-3">
          1. Identificação do Imóvel
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
          <div className="sm:col-span-3">
            <Label htmlFor="prop-ref">Código de Referência *</Label>
            <Input
              id="prop-ref"
              {...form.register("reference_code")}
              placeholder="REF-1025"
            />
            {form.formState.errors.reference_code && (
              <p className="mt-1 text-xs text-red-700">
                {form.formState.errors.reference_code.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-9">
            <Label htmlFor="prop-title">Título do Anúncio *</Label>
            <Input
              id="prop-title"
              {...form.register("title")}
              onBlur={() => {
                if (!form.getValues("slug")) handleAutoSlug();
              }}
              placeholder="Ex: Apartamento 4 Suítes com Vista Permanente no Jardim Paulista"
            />
            {form.formState.errors.title && (
              <p className="mt-1 text-xs text-red-700">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="prop-slug">Slug da URL amigável *</Label>
              <button
                type="button"
                onClick={handleAutoSlug}
                className="text-[11px] font-semibold text-[#0e7490] underline cursor-pointer"
              >
                Gerar automaticamente
              </button>
            </div>
            <Input
              id="prop-slug"
              {...form.register("slug")}
              placeholder="apartamento-4-suites-jardim-paulista"
            />
            {form.formState.errors.slug && (
              <p className="mt-1 text-xs text-red-700">
                {form.formState.errors.slug.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-3">
            <Label htmlFor="prop-type">Tipo de Imóvel *</Label>
            <select
              id="prop-type"
              {...form.register("property_type")}
              className="h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 text-sm"
            >
              {(Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[]).map(
                (k) => (
                  <option key={k} value={k}>
                    {PROPERTY_TYPE_LABELS[k]}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="sm:col-span-3">
            <Label htmlFor="prop-purpose">Finalidade *</Label>
            <select
              id="prop-purpose"
              {...form.register("purpose")}
              className="h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 text-sm"
            >
              {(Object.keys(PROPERTY_PURPOSE_LABELS) as PropertyPurpose[]).map(
                (k) => (
                  <option key={k} value={k}>
                    {PROPERTY_PURPOSE_LABELS[k]}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="sm:col-span-12">
            <Label htmlFor="prop-short">Resumo Curto (Cards e Subtítulo)</Label>
            <Input
              id="prop-short"
              {...form.register("short_description")}
              placeholder="Resumo em 1 linha destacando os principais atributos"
            />
          </div>

          <div className="sm:col-span-12">
            <Label htmlFor="prop-desc">Descrição Completa *</Label>
            <Textarea
              id="prop-desc"
              rows={6}
              {...form.register("description")}
              placeholder="Descreva em detalhes a arquitetura, distribuição da planta, acabamentos, insolação e localização..."
            />
            {form.formState.errors.description && (
              <p className="mt-1 text-xs text-red-700">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. LOCALIZAÇÃO */}
      <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <h2 className="font-editorial text-2xl font-semibold text-[#0e7490] border-b border-[#e2e8f0] pb-3">
          2. Localização & Privacidade
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
          <div className="sm:col-span-3">
            <Label htmlFor="prop-zip">CEP</Label>
            <Input
              id="prop-zip"
              {...form.register("zip_code")}
              placeholder="01420-000"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="prop-state">UF *</Label>
            <Input
              id="prop-state"
              maxLength={2}
              {...form.register("state")}
              placeholder="SP"
            />
          </div>
          <div className="sm:col-span-3">
            <Label htmlFor="prop-city">Cidade *</Label>
            <Input
              id="prop-city"
              {...form.register("city")}
              placeholder="São Paulo"
            />
          </div>
          <div className="sm:col-span-4">
            <Label htmlFor="prop-neighborhood">Bairro *</Label>
            <Input
              id="prop-neighborhood"
              {...form.register("neighborhood")}
              placeholder="Jardim Paulista"
            />
          </div>

          <div className="sm:col-span-6">
            <Label htmlFor="prop-street">Rua / Logradouro</Label>
            <Input
              id="prop-street"
              {...form.register("street")}
              placeholder="Alameda Campinas"
            />
          </div>
          <div className="sm:col-span-3">
            <Label htmlFor="prop-number">Número</Label>
            <Input
              id="prop-number"
              {...form.register("street_number")}
              placeholder="1200"
            />
          </div>
          <div className="sm:col-span-3">
            <Label htmlFor="prop-complement">Complemento</Label>
            <Input
              id="prop-complement"
              {...form.register("complement")}
              placeholder="18º Andar"
            />
          </div>

          <div className="sm:col-span-12 pt-2">
            <label className="inline-flex items-center gap-3 rounded-xl bg-[#f8fafc] p-4 border border-[#e2e8f0] cursor-pointer">
              <input
                type="checkbox"
                {...form.register("hide_exact_address")}
                className="h-4 w-4 rounded border-[#e2e8f0] text-[#0e7490]"
              />
              <span className="text-xs sm:text-sm font-medium text-[#242424]">
                <strong>Ocultar endereço completo no site público</strong>{" "}
                (exibe apenas Bairro, Cidade e Estado para preservar a
                privacidade do proprietário)
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* 3. VALORES COMERCIAIS */}
      <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <h2 className="font-editorial text-2xl font-semibold text-[#0e7490] border-b border-[#e2e8f0] pb-3">
          3. Valores e Encargos (R$)
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="prop-sale">Preço de Venda (R$)</Label>
            <Input
              id="prop-sale"
              type="number"
              step="0.01"
              defaultValue={initialProperty?.sale_price ?? ""}
              onChange={(e) =>
                form.setValue("sale_price", parseNumberField(e.target.value), {
                  shouldValidate: true,
                })
              }
              placeholder="Ex: 11800000"
            />
            {form.formState.errors.sale_price && (
              <p className="mt-1 text-xs text-red-700">
                {form.formState.errors.sale_price.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="prop-rent">Aluguel Mensal (R$)</Label>
            <Input
              id="prop-rent"
              type="number"
              step="0.01"
              defaultValue={initialProperty?.rent_price ?? ""}
              onChange={(e) =>
                form.setValue("rent_price", parseNumberField(e.target.value), {
                  shouldValidate: true,
                })
              }
              placeholder="Ex: 45000"
            />
            {form.formState.errors.rent_price && (
              <p className="mt-1 text-xs text-red-700">
                {form.formState.errors.rent_price.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="prop-condo">Condomínio Mensal (R$)</Label>
            <Input
              id="prop-condo"
              type="number"
              step="0.01"
              defaultValue={initialProperty?.condo_fee ?? ""}
              onChange={(e) =>
                form.setValue("condo_fee", parseNumberField(e.target.value))
              }
              placeholder="Ex: 5200"
            />
          </div>

          <div>
            <Label htmlFor="prop-iptu">Valor do IPTU (R$)</Label>
            <div className="flex gap-2">
              <Input
                id="prop-iptu"
                type="number"
                step="0.01"
                defaultValue={initialProperty?.iptu_price ?? ""}
                onChange={(e) =>
                  form.setValue("iptu_price", parseNumberField(e.target.value))
                }
                placeholder="Ex: 1850"
              />
              <select
                {...form.register("iptu_periodicity")}
                className="h-11 rounded-lg border border-[#e2e8f0] bg-white px-2.5 text-xs"
              >
                <option value="mensal">Mensal</option>
                <option value="anual">Anual</option>
                <option value="isento">Isento</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CARACTERÍSTICAS E COMODIDADES */}
      <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="font-editorial text-2xl font-semibold text-[#0e7490] border-b border-[#e2e8f0] pb-3">
          4. Características Físicas e Comodidades
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          <div className="col-span-2">
            <Label>Área Útil (m²)</Label>
            <Input
              type="number"
              defaultValue={initialProperty?.usable_area ?? ""}
              onChange={(e) =>
                form.setValue("usable_area", parseNumberField(e.target.value))
              }
              placeholder="412"
            />
          </div>
          <div className="col-span-2">
            <Label>Área Construída (m²)</Label>
            <Input
              type="number"
              defaultValue={initialProperty?.built_area ?? ""}
              onChange={(e) =>
                form.setValue("built_area", parseNumberField(e.target.value))
              }
              placeholder="412"
            />
          </div>
          <div className="col-span-2">
            <Label>Área Total (m²)</Label>
            <Input
              type="number"
              defaultValue={initialProperty?.total_area ?? ""}
              onChange={(e) =>
                form.setValue("total_area", parseNumberField(e.target.value))
              }
              placeholder="590"
            />
          </div>
          <div className="col-span-2">
            <Label>Andar (opcional)</Label>
            <Input
              type="number"
              defaultValue={initialProperty?.floor_number ?? ""}
              onChange={(e) =>
                form.setValue("floor_number", parseNumberField(e.target.value))
              }
              placeholder="18"
            />
          </div>

          <div className="col-span-2">
            <Label>Dormitórios</Label>
            <Input
              type="number"
              min={0}
              {...form.register("bedrooms", { valueAsNumber: true })}
            />
          </div>
          <div className="col-span-2">
            <Label>Suítes</Label>
            <Input
              type="number"
              min={0}
              {...form.register("suites", { valueAsNumber: true })}
            />
          </div>
          <div className="col-span-2">
            <Label>Banheiros</Label>
            <Input
              type="number"
              min={0}
              {...form.register("bathrooms", { valueAsNumber: true })}
            />
          </div>
          <div className="col-span-2">
            <Label>Vagas de Garagem</Label>
            <Input
              type="number"
              min={0}
              {...form.register("parking_spots", { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* Flags booleanas */}
        <div className="flex flex-wrap gap-6 pt-2">
          <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              {...form.register("is_furnished")}
              className="h-4 w-4 rounded border-[#e2e8f0] text-[#0e7490]"
            />
            <span>Imóvel Mobiliado</span>
          </label>
          <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              {...form.register("is_pet_friendly")}
              className="h-4 w-4 rounded border-[#e2e8f0] text-[#0e7490]"
            />
            <span>Aceita Animais (Pet Friendly)</span>
          </label>
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-[#0e7490] cursor-pointer">
            <input
              type="checkbox"
              {...form.register("is_high_end")}
              className="h-4 w-4 rounded border-[#e2e8f0] text-[#0e7490]"
            />
            <Sparkles className="h-4 w-4 text-[#0891b2]" />
            <span>Selo Seleção Alto Padrão</span>
          </label>
        </div>

        {/* Comodidades */}
        <div>
          <Label>Comodidades do Imóvel e Condomínio</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {COMMON_AMENITIES.map((amenity) => {
              const checked = watchedAmenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs transition-colors cursor-pointer",
                    checked
                      ? "border-[#0e7490] bg-[#0e7490] text-white font-medium"
                      : "border-[#e2e8f0] bg-[#f8fafc]/50 text-[#242424]"
                  )}
                >
                  {amenity}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex gap-2 max-w-md">
            <Input
              value={customAmenityInput}
              onChange={(e) => setCustomAmenityInput(e.target.value)}
              placeholder="Adicionar outra comodidade..."
              className="h-9 text-xs"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addCustomAmenity}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Incluir</span>
            </Button>
          </div>
        </div>

        {/* Diferenciais em destaque */}
        <div>
          <Label>Diferenciais Exclusivos (Frases de impacto)</Label>
          <div className="mt-2 flex gap-2 max-w-xl">
            <Input
              value={newHighlightInput}
              onChange={(e) => setNewHighlightInput(e.target.value)}
              placeholder="Ex: Um por andar com hall privativo e vista definitiva"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={addHighlight}
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar</span>
            </Button>
          </div>
          {watchedHighlights.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {watchedHighlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between rounded-lg bg-[#f8fafc] px-3.5 py-2 text-xs text-[#242424]"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeHighlight(item)}
                    className="text-red-700 hover:text-red-900 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 5. GESTÃO DE FOTOGRAFIAS (SUPABASE STORAGE) */}
      <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <h2 className="font-editorial text-2xl font-semibold text-[#0e7490] border-b border-[#e2e8f0] pb-3">
          5. Galeria de Fotografias
        </h2>

        <PropertyImageUploader
          images={watchedImages}
          propertyReferenceCode={watchedRefCode}
          onChange={(nextImages) =>
            form.setValue("images", nextImages, { shouldDirty: true })
          }
        />
      </section>

      {/* 6. CONTROLE E SEO */}
      <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <h2 className="font-editorial text-2xl font-semibold text-[#0e7490] border-b border-[#e2e8f0] pb-3">
          6. Controle Comercial & SEO
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label>Status de Publicação</Label>
            <select
              {...form.register("publication_status")}
              className="h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 text-sm"
            >
              {(
                Object.keys(PUBLICATION_STATUS_LABELS) as PublicationStatus[]
              ).map((k) => (
                <option key={k} value={k}>
                  {PUBLICATION_STATUS_LABELS[k]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Status de Disponibilidade</Label>
            <select
              {...form.register("availability_status")}
              className="h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 text-sm"
            >
              {(
                Object.keys(AVAILABILITY_STATUS_LABELS) as AvailabilityStatus[]
              ).map((k) => (
                <option key={k} value={k}>
                  {AVAILABILITY_STATUS_LABELS[k]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex h-11 w-full items-center gap-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-4 text-sm font-semibold text-[#0e7490] cursor-pointer">
              <input
                type="checkbox"
                {...form.register("is_featured")}
                className="h-4 w-4 rounded border-[#e2e8f0] text-[#0e7490]"
              />
              <span>Exibir na Home (Imóvel em Destaque)</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
          <div>
            <Label>Meta Title (SEO)</Label>
            <Input
              {...form.register("meta_title")}
              placeholder="Título otimizado para mecanismos de busca (opcional)"
            />
          </div>
          <div>
            <Label>Meta Description (SEO)</Label>
            <Input
              {...form.register("meta_description")}
              placeholder="Descrição resumida para compartilhamento e Google (opcional)"
            />
          </div>
        </div>
      </section>

      {feedback && (
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-xl p-4 text-sm",
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-red-50 text-red-900 border border-red-200"
          )}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-700 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/imoveis")}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="default" size="lg" disabled={submitting}>
          <Save className="h-4 w-4 text-[#0891b2]" />
          <span>
            {submitting
              ? "Salvando imóvel..."
              : initialProperty
                ? "Salvar Alterações"
                : "Cadastrar Imóvel"}
          </span>
        </Button>
      </div>
    </form>
  );
}
