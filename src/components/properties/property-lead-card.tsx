"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  MessageCircle,
  Send,
  Share2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitPublicLeadAction } from "@/actions/lead.actions";
import { buildPropertyWhatsAppUrl, cn } from "@/lib/utils";
import type { Property } from "@/types/domain";

interface PropertyLeadCardProps {
  property: Property;
  agencyWhatsapp: string;
  publicPropertyUrl: string;
}

export function PropertyLeadCard({
  property,
  agencyWhatsapp,
  publicPropertyUrl,
}: PropertyLeadCardProps) {
  const [intentTab, setIntentTab] = useState<
    "formulario_imovel" | "agendar_visita"
  >("formulario_imovel");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    `OlÃ¡! Tenho interesse no imÃ³vel ${property.reference_code} (${property.title}) e gostaria de receber mais informaÃ§Ãµes.`
  );
  const [consentLgpd, setConsentLgpd] = useState(true);
  const [honeypot, setHoneypot] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  function switchIntent(nextIntent: "formulario_imovel" | "agendar_visita") {
    setIntentTab(nextIntent);
    if (nextIntent === "agendar_visita") {
      setMessage(
        `OlÃ¡! Gostaria de agendar uma visita ao imÃ³vel ${property.reference_code} (${property.title}).`
      );
    } else {
      setMessage(
        `OlÃ¡! Tenho interesse no imÃ³vel ${property.reference_code} (${property.title}) e gostaria de receber mais informaÃ§Ãµes.`
      );
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const res = await submitPublicLeadAction({
      property_id: property.is_dev_preview ? null : property.id,
      property_reference_code: property.reference_code,
      property_title: property.title,
      name,
      phone,
      email,
      message,
      source: intentTab,
      consent_lgpd: consentLgpd,
      website_honeypot: honeypot,
    });

    setSubmitting(false);
    if (res.success) {
      setFeedback({ type: "success", text: res.message });
      setName("");
      setPhone("");
      setEmail("");
    } else {
      setFeedback({ type: "error", text: res.message });
    }
  }

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `${property.title} (${property.reference_code})`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    }
  }

  const whatsappUrl = buildPropertyWhatsAppUrl({
    whatsappPhone: agencyWhatsapp,
    propertyTitle: property.title,
    referenceCode: property.reference_code,
    propertyUrl: publicPropertyUrl,
  });

  return (
    <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-sm">
      {/* CabeÃ§alho */}
      <div className="mb-5 flex items-center justify-between border-b border-[#E5E5E5] pb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-cyan-700">
            Atendimento
          </span>
          <h3 className="font-editorial text-2xl font-semibold text-[#242424]">
            Interesse no ImÃ³vel
          </h3>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleShare}
          aria-label="Compartilhar este imÃ³vel"
        >
          <Share2 className="h-3.5 w-3.5 text-[#242424]" />
          <span>{copiedShare ? "Copiado!" : "Compartilhar"}</span>
        </Button>
      </div>

      {/* Abas: Tenho Interesse / Agendar Visita */}
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-[#F5F5F5] p-1 border border-[#E5E5E5]">
        <button
          type="button"
          onClick={() => switchIntent("formulario_imovel")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition-all cursor-pointer",
            intentTab === "formulario_imovel"
              ? "bg-cyan-700 text-white shadow-xs"
              : "text-[#242424]/75 hover:text-cyan-700"
          )}
        >
          <Send className="h-3.5 w-3.5" />
          <span>Tenho interesse</span>
        </button>

        <button
          type="button"
          onClick={() => switchIntent("agendar_visita")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition-all cursor-pointer",
            intentTab === "agendar_visita"
              ? "bg-cyan-700 text-white shadow-xs"
              : "text-[#242424]/75 hover:text-cyan-700"
          )}
        >
          <CalendarCheck className="h-3.5 w-3.5" />
          <span>Agendar visita</span>
        </button>
      </div>

      {/* BotÃ£o de WhatsApp */}
      <div className="mb-6">
        <Button
          asChild
          variant="default"
          size="lg"
          className="w-full justify-center"
        >
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-5 w-5" />
            <span>Falar no WhatsApp ({property.reference_code})</span>
          </a>
        </Button>
      </div>

      {/* FormulÃ¡rio */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website_honeypot">Deixe em branco</label>
          <input
            id="website_honeypot"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="lead-name">Seu nome *</Label>
          <Input
            id="lead-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome completo"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="lead-phone">Telefone / WhatsApp *</Label>
            <Input
              id="lead-phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>
          <div>
            <Label htmlFor="lead-email">E-mail (opcional)</Label>
            <Input
              id="lead-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="lead-message">Mensagem *</Label>
          <Textarea
            id="lead-message"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Consentimento LGPD */}
        <label className="flex items-start gap-2.5 text-xs text-[#737373] cursor-pointer">
          <input
            type="checkbox"
            checked={consentLgpd}
            onChange={(e) => setConsentLgpd(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#E5E5E5] text-cyan-700 focus:ring-cyan-600"
          />
          <span>
            Concordo com o tratamento dos dados exclusivamente para retorno
            comercial sobre este imÃ³vel, conforme a{" "}
            <Link
              href="/privacidade"
              className="underline font-medium text-cyan-700"
            >
              PolÃ­tica de Privacidade (LGPD)
            </Link>
            .
          </span>
        </label>

        {feedback && (
          <div
            className={cn(
              "flex items-start gap-2.5 rounded-xl p-3.5 text-xs leading-relaxed",
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                : "bg-red-50 text-red-900 border border-red-200"
            )}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-700 shrink-0 mt-0.5" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={submitting}
          className="w-full"
        >
          <Send className="h-4 w-4" />
          <span>
            {submitting
              ? "Enviando..."
              : intentTab === "agendar_visita"
                ? "Solicitar Agendamento de Visita"
                : "Enviar SolicitaÃ§Ã£o de Atendimento"}
          </span>
        </Button>

        <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-[#737373]">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-700" />
          <span>Atendimento sigiloso e protegido pela LGPD.</span>
        </div>
      </form>
    </div>
  );
}

