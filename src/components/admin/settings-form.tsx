"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { saveSiteSettingsAction } from "@/actions/settings.actions";
import { cn } from "@/lib/utils";
import type { AgencyDifferential, SiteSettings } from "@/types/domain";

interface SettingsFormProps {
  initialSettings: SiteSettings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();
  const [agencyName, setAgencyName] = useState(initialSettings.agency_name);
  const [agencySlogan, setAgencySlogan] = useState(
    initialSettings.agency_slogan
  );
  const [creci, setCreci] = useState(initialSettings.creci);
  const [cnpj, setCnpj] = useState(initialSettings.cnpj);
  const [phone, setPhone] = useState(initialSettings.phone);
  const [whatsapp, setWhatsapp] = useState(initialSettings.whatsapp);
  const [email, setEmail] = useState(initialSettings.email);
  const [addressLine, setAddressLine] = useState(initialSettings.address_line);
  const [city, setCity] = useState(initialSettings.city);
  const [state, setState] = useState(initialSettings.state);
  const [zipCode, setZipCode] = useState(initialSettings.zip_code);
  const [businessHours, setBusinessHours] = useState(
    initialSettings.business_hours
  );
  const [aboutTitle, setAboutTitle] = useState(initialSettings.about_title);
  const [aboutHistory, setAboutHistory] = useState(
    initialSettings.about_history
  );
  const [aboutPositioning, setAboutPositioning] = useState(
    initialSettings.about_positioning
  );
  const [aboutConsulting, setAboutConsulting] = useState(
    initialSettings.about_consulting
  );
  const [differentials, setDifferentials] = useState<AgencyDifferential[]>(
    initialSettings.about_differentials
  );
  const [instagramUrl, setInstagramUrl] = useState(
    initialSettings.instagram_url
  );
  const [linkedinUrl, setLinkedinUrl] = useState(initialSettings.linkedin_url);
  const [youtubeUrl, setYoutubeUrl] = useState(initialSettings.youtube_url);
  const [facebookUrl, setFacebookUrl] = useState(initialSettings.facebook_url);

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function addDifferential() {
    setDifferentials((prev) => [
      ...prev,
      { title: "Novo Diferencial", description: "Descreva este diferencial..." },
    ]);
  }

  function updateDifferential(
    idx: number,
    field: keyof AgencyDifferential,
    val: string
  ) {
    setDifferentials((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  }

  function removeDifferential(idx: number) {
    setDifferentials((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const res = await saveSiteSettingsAction({
      agency_name: agencyName,
      agency_slogan: agencySlogan,
      creci,
      cnpj,
      phone,
      whatsapp,
      email,
      address_line: addressLine,
      city,
      state,
      zip_code: zipCode,
      business_hours: businessHours,
      about_title: aboutTitle,
      about_history: aboutHistory,
      about_positioning: aboutPositioning,
      about_differentials: differentials,
      about_consulting: aboutConsulting,
      instagram_url: instagramUrl,
      linkedin_url: linkedinUrl,
      youtube_url: youtubeUrl,
      facebook_url: facebookUrl,
    });

    setSaving(false);
    setFeedback({
      type: res.success ? "success" : "error",
      text: res.message,
    });
    if (res.success) {
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Dados Societários e Contato */}
      <section className="rounded-2xl border border-[#E2DBD0] bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <h2 className="font-editorial text-2xl font-semibold text-[#183B35] border-b border-[#E2DBD0] pb-3">
          1. Identidade, Dados Legais e Contato
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
          <div className="sm:col-span-6">
            <Label>Nome da Imobiliária *</Label>
            <Input
              required
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
            />
          </div>
          <div className="sm:col-span-3">
            <Label>CRECI Oficial</Label>
            <Input
              value={creci}
              onChange={(e) => setCreci(e.target.value)}
              placeholder="Ex: CRECI 00000-J"
            />
          </div>
          <div className="sm:col-span-3">
            <Label>CNPJ</Label>
            <Input
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0001-00"
            />
          </div>

          <div className="sm:col-span-12">
            <Label>Slogan / Posicionamento Curto</Label>
            <Input
              value={agencySlogan}
              onChange={(e) => setAgencySlogan(e.target.value)}
            />
          </div>

          <div className="sm:col-span-4">
            <Label>WhatsApp Oficial (com DDD)</Label>
            <Input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>
          <div className="sm:col-span-4">
            <Label>Telefone Fixo</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 3000-0000"
            />
          </div>
          <div className="sm:col-span-4">
            <Label>E-mail de Atendimento</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contato@sua-imobiliaria.com.br"
            />
          </div>

          <div className="sm:col-span-6">
            <Label>Endereço Comercial</Label>
            <Input
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              placeholder="Av. Brigadeiro Faria Lima, 0000 - Conj. 00"
            />
          </div>
          <div className="sm:col-span-3">
            <Label>Cidade</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="sm:col-span-1">
            <Label>UF</Label>
            <Input
              maxLength={2}
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>CEP</Label>
            <Input
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>

          <div className="sm:col-span-12">
            <Label>Horário de Atendimento</Label>
            <Input
              value={businessHours}
              onChange={(e) => setBusinessHours(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Conteúdo Institucional (Sobre Nós) */}
      <section className="rounded-2xl border border-[#E2DBD0] bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <h2 className="font-editorial text-2xl font-semibold text-[#183B35] border-b border-[#E2DBD0] pb-3">
          2. Informações Institucionais (Home & Sobre Nós)
        </h2>

        <div className="space-y-4">
          <div>
            <Label>Título Institucional</Label>
            <Input
              value={aboutTitle}
              onChange={(e) => setAboutTitle(e.target.value)}
            />
          </div>
          <div>
            <Label>História da Imobiliária</Label>
            <Textarea
              rows={4}
              value={aboutHistory}
              onChange={(e) => setAboutHistory(e.target.value)}
            />
          </div>
          <div>
            <Label>Posicionamento e Metodologia</Label>
            <Textarea
              rows={4}
              value={aboutPositioning}
              onChange={(e) => setAboutPositioning(e.target.value)}
            />
          </div>
          <div>
            <Label>Consultoria Imobiliária e Compromisso com Atendimento</Label>
            <Textarea
              rows={3}
              value={aboutConsulting}
              onChange={(e) => setAboutConsulting(e.target.value)}
            />
          </div>

          {/* Diferenciais */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <Label>Diferenciais Competitivos</Label>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addDifferential}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Adicionar Diferencial</span>
              </Button>
            </div>

            {differentials.map((diff, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 gap-3 rounded-xl border border-[#E2DBD0] bg-[#F5F1E9]/50 p-4 sm:grid-cols-12 items-start"
              >
                <div className="sm:col-span-4">
                  <Input
                    value={diff.title}
                    onChange={(e) =>
                      updateDifferential(idx, "title", e.target.value)
                    }
                    placeholder="Título do diferencial"
                  />
                </div>
                <div className="sm:col-span-7">
                  <Input
                    value={diff.description}
                    onChange={(e) =>
                      updateDifferential(idx, "description", e.target.value)
                    }
                    placeholder="Descrição do diferencial"
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDifferential(idx)}
                    className="text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Redes Sociais */}
      <section className="rounded-2xl border border-[#E2DBD0] bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <h2 className="font-editorial text-2xl font-semibold text-[#183B35] border-b border-[#E2DBD0] pb-3">
          3. Redes Sociais
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Instagram URL</Label>
            <Input
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <Label>LinkedIn URL</Label>
            <Input
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/company/..."
            />
          </div>
          <div>
            <Label>YouTube URL</Label>
            <Input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/@..."
            />
          </div>
          <div>
            <Label>Facebook URL</Label>
            <Input
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/..."
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

      <div className="flex justify-end">
        <Button type="submit" variant="default" size="lg" disabled={saving}>
          <Save className="h-4 w-4 text-[#B79A68]" />
          <span>{saving ? "Salvando..." : "Salvar Configurações"}</span>
        </Button>
      </div>
    </form>
  );
}
