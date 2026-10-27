"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Star,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Plus,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export interface ManagedPropertyImage {
  id?: string;
  storage_path?: string | null;
  url: string;
  alt_text: string;
  is_cover: boolean;
  display_order: number;
  file_size?: number | null;
  mime_type?: string | null;
}

interface PropertyImageUploaderProps {
  images: ManagedPropertyImage[];
  onChange: (next: ManagedPropertyImage[]) => void;
  propertyReferenceCode: string;
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

async function compressImageIfNeeded(file: File): Promise<File> {
  if (file.size <= 1400 * 1024 || file.type === "image/avif") {
    return file;
  }

  return new Promise((resolve) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDim = 2000;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const compressed = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, ".webp"),
            { type: "image/webp" }
          );
          resolve(compressed);
        },
        "image/webp",
        0.86
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export function PropertyImageUploader({
  images,
  onChange,
  propertyReferenceCode,
}: PropertyImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [externalUrl, setExternalUrl] = useState("");
  const [externalAlt, setExternalAlt] = useState("");

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setErrorMessage(null);
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setErrorMessage(
        "Supabase Storage não configurado. Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para enviar arquivos."
      );
      return;
    }

    setUploading(true);
    const uploadedItems: ManagedPropertyImage[] = [];

    for (const rawFile of files) {
      if (!ALLOWED_MIME_TYPES.includes(rawFile.type)) {
        setErrorMessage(
          `Arquivo "${rawFile.name}" rejeitado: formato não permitido. Utilize JPG, PNG, WEBP ou AVIF.`
        );
        continue;
      }

      if (rawFile.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage(
          `Arquivo "${rawFile.name}" excede o limite máximo de 10 MB.`
        );
        continue;
      }

      const processedFile = await compressImageIfNeeded(rawFile);
      const safeRef = (propertyReferenceCode || "imovel")
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "-");
      const ext = processedFile.name.split(".").pop() || "webp";
      const filePath = `${safeRef}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(filePath, processedFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: processedFile.type,
        });

      if (uploadError) {
        setErrorMessage(
          `Erro ao enviar "${rawFile.name}": ${uploadError.message}`
        );
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from("property-images")
        .getPublicUrl(filePath);

      uploadedItems.push({
        storage_path: filePath,
        url: publicUrlData.publicUrl,
        alt_text: rawFile.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        is_cover: images.length === 0 && uploadedItems.length === 0,
        display_order: images.length + uploadedItems.length,
        file_size: processedFile.size,
        mime_type: processedFile.type,
      });
    }

    if (uploadedItems.length > 0) {
      const merged = [...images, ...uploadedItems].map((item, idx) => ({
        ...item,
        display_order: idx,
      }));
      onChange(merged);
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleAddExternalUrl() {
    if (!externalUrl.trim()) return;
    try {
      new URL(externalUrl.trim());
    } catch {
      setErrorMessage("Informe uma URL de imagem válida iniciando com https://");
      return;
    }

    const nextItem: ManagedPropertyImage = {
      storage_path: null,
      url: externalUrl.trim(),
      alt_text: externalAlt.trim(),
      is_cover: images.length === 0,
      display_order: images.length,
      file_size: null,
      mime_type: "image/jpeg",
    };

    onChange([...images, nextItem]);
    setExternalUrl("");
    setExternalAlt("");
    setErrorMessage(null);
  }

  function handleSetCover(targetIndex: number) {
    const next = images.map((img, idx) => ({
      ...img,
      is_cover: idx === targetIndex,
    }));
    onChange(next);
  }

  function handleMove(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const copy = [...images];
    const temp = copy[index]!;
    copy[index] = copy[target]!;
    copy[target] = temp;
    onChange(
      copy.map((item, idx) => ({
        ...item,
        display_order: idx,
      }))
    );
  }

  function handleRemove(index: number) {
    const filtered = images.filter((_, idx) => idx !== index);
    const hasCover = filtered.some((img) => img.is_cover);
    const normalized = filtered.map((img, idx) => ({
      ...img,
      is_cover: hasCover ? img.is_cover : idx === 0,
      display_order: idx,
    }));
    onChange(normalized);
  }

  function handleAltChange(index: number, alt: string) {
    const next = images.map((img, idx) =>
      idx === index ? { ...img, alt_text: alt } : img
    );
    onChange(next);
  }

  return (
    <div className="space-y-5">
      {/* Zona de Upload Direto */}
      <div className="rounded-2xl border-2 border-dashed border-[#183B35]/30 bg-[#F5F1E9]/60 p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFileSelect}
          className="hidden"
          id="property-images-file-input"
        />
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#183B35] text-[#B79A68]">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Upload className="h-6 w-6" />
          )}
        </div>
        <h4 className="font-editorial text-xl font-semibold text-[#183B35]">
          Enviar fotografias do computador ou celular
        </h4>
        <p className="mt-1 text-xs text-[#5C5B57]">
          Suporta upload múltiplo (JPG, PNG, WEBP, AVIF • até 10 MB por foto)
          com compressão inteligente e armazenamento no Supabase Storage.
        </p>
        <div className="mt-4">
          <Button
            type="button"
            variant="default"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 text-[#B79A68]" />
            <span>
              {uploading ? "Enviando fotografias..." : "Selecionar arquivos"}
            </span>
          </Button>
        </div>
      </div>

      {/* Adição complementar por URL */}
      <div className="rounded-xl border border-[#E2DBD0] bg-white p-4">
        <Label htmlFor="ext-img-url">
          Ou adicionar fotografia por URL externa (opcional)
        </Label>
        <div className="mt-1.5 grid grid-cols-1 gap-2.5 sm:grid-cols-12">
          <div className="sm:col-span-6">
            <Input
              id="ext-img-url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
          <div className="sm:col-span-4">
            <Input
              value={externalAlt}
              onChange={(e) => setExternalAlt(e.target.value)}
              placeholder="Texto alternativo (alt SEO)"
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddExternalUrl}
              className="w-full h-11"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar</span>
            </Button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-900">
          <AlertCircle className="h-4 w-4 text-red-700 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Galeria Gerenciável: Capa, Ordem, Alt Text e Exclusão */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, idx) => (
            <div
              key={`${img.url}-${idx}`}
              className={cn(
                "flex flex-col overflow-hidden rounded-xl border bg-white shadow-xs",
                img.is_cover
                  ? "border-[#183B35] ring-2 ring-[#B79A68]"
                  : "border-[#E2DBD0]"
              )}
            >
              <div className="relative aspect-[16/10] w-full bg-[#183B35]/10">
                <Image
                  src={img.url}
                  alt={img.alt_text || `Foto ${idx + 1}`}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="rounded bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white">
                    #{idx + 1}
                  </span>
                  {img.is_cover && (
                    <span className="inline-flex items-center gap-1 rounded bg-[#B79A68] px-2 py-0.5 text-[11px] font-bold text-[#183B35]">
                      <Star className="h-3 w-3 fill-current" />
                      Capa Principal
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#5C5B57] mb-1">
                    Texto Alternativo (SEO / Acessibilidade)
                  </label>
                  <Input
                    value={img.alt_text}
                    onChange={(e) => handleAltChange(idx, e.target.value)}
                    placeholder="Ex: Living integrado ao terraço"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-[#E2DBD0]">
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, -1)}
                      title="Mover para trás"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMove(idx, 1)}
                      title="Mover para frente"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-1">
                    {!img.is_cover && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSetCover(idx)}
                      >
                        <Star className="h-3 w-3 text-[#B79A68]" />
                        <span>Definir capa</span>
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(idx)}
                      className="text-red-700 hover:bg-red-50"
                      title="Remover fotografia"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
