"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  deleteBannerAction,
  saveBannerAction,
  toggleBannerActiveAction,
} from "@/actions/settings.actions";
import type { Banner } from "@/types/domain";

interface BannersManagerProps {
  banners: Banner[];
}

export function BannersManager({ banners }: BannersManagerProps) {
  const router = useRouter();
  const [title, setTitle] = useState(
    "Seu próximo capítulo começa no lugar certo."
  );
  const [subtitle, setSubtitle] = useState(
    "Encontre imóveis selecionados para viver, investir e transformar seus planos em realidade."
  );
  const [imageUrl, setImageUrl] = useState("");
  const [ctaLabel, setCtaLabel] = useState("Explorar imóveis");
  const [ctaHref, setCtaHref] = useState("/imoveis");
  const [position, setPosition] = useState<Banner["position"]>("hero");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleCreateBanner(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const res = await saveBannerAction({
      title,
      subtitle,
      image_url: imageUrl,
      cta_label: ctaLabel,
      cta_href: ctaHref,
      position,
      display_order: banners.length,
      is_active: true,
    });

    setSaving(false);
    setFeedback({
      type: res.success ? "success" : "error",
      text: res.message,
    });
    if (res.success) {
      setImageUrl("");
      router.refresh();
    }
  }

  async function handleToggle(banner: Banner) {
    const res = await toggleBannerActiveAction(banner.id, !banner.is_active);
    setFeedback({
      type: res.success ? "success" : "error",
      text: res.message,
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    const res = await deleteBannerAction(id);
    setFeedback({
      type: res.success ? "success" : "error",
      text: res.message,
    });
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleCreateBanner}
        className="rounded-2xl border border-[#e2e8f0] bg-white p-6 sm:p-8 shadow-xs space-y-4"
      >
        <h2 className="font-editorial text-2xl font-semibold text-[#0e7490]">
          Adicionar Novo Banner / Destaque
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
          <div className="sm:col-span-6">
            <Label>Título Principal *</Label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="sm:col-span-3">
            <Label>Posição</Label>
            <select
              value={position}
              onChange={(e) =>
                setPosition(e.target.value as Banner["position"])
              }
              className="h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 text-sm"
            >
              <option value="hero">Hero Principal (Home)</option>
              <option value="home_destaque">Destaque Secundário</option>
              <option value="institucional">Institucional</option>
            </select>
          </div>
          <div className="sm:col-span-3">
            <Label>Link do Botão (CTA)</Label>
            <Input
              value={ctaHref}
              onChange={(e) => setCtaHref(e.target.value)}
              placeholder="/imoveis"
            />
          </div>

          <div className="sm:col-span-12">
            <Label>Subtítulo</Label>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          <div className="sm:col-span-9">
            <Label>URL da Fotografia de Alta Resolução *</Label>
            <Input
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
            />
          </div>
          <div className="sm:col-span-3 flex items-end">
            <Button
              type="submit"
              variant="default"
              disabled={saving}
              className="w-full h-11"
            >
              <Plus className="h-4 w-4 text-[#0891b2]" />
              <span>{saving ? "Salvando..." : "Salvar Banner"}</span>
            </Button>
          </div>
        </div>
      </form>

      {feedback && (
        <div
          className={`flex items-center gap-2 rounded-xl p-4 text-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-red-50 text-red-900 border border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-700" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Lista de Banners Cadastrados */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xs flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] w-full bg-[#0e7490]">
              <Image
                src={banner.image_url}
                alt={banner.title}
                fill
                sizes="500px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant={banner.is_active ? "success" : "muted"}>
                  {banner.is_active ? "Ativo" : "Inativo"}
                </Badge>
                <Badge variant="gold">{banner.position}</Badge>
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="font-editorial text-xl font-semibold">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="text-xs text-white/85 line-clamp-2 mt-0.5">
                    {banner.subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleToggle(banner)}
              >
                {banner.is_active ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>Desativar</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    <span>Ativar</span>
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(banner.id)}
                className="text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>Excluir</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
