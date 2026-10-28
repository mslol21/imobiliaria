"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitPublicLeadAction } from "@/actions/lead.actions";
import { cn } from "@/lib/utils";
import type { LeadSource } from "@/types/domain";

interface PublicContactFormProps {
  source: LeadSource;
  defaultMessage?: string;
  submitLabel?: string;
  propertyTypeContext?: boolean;
}

export function PublicContactForm({
  source,
  defaultMessage = "",
  submitLabel = "Enviar mensagem",
  propertyTypeContext = false,
}: PublicContactFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [ownerPropertySummary, setOwnerPropertySummary] = useState("");
  const [message, setMessage] = useState(defaultMessage);
  const [consentLgpd, setConsentLgpd] = useState(true);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const composedMessage =
      propertyTypeContext && ownerPropertySummary.trim()
        ? `[Dados do Imóvel do Proprietário: ${ownerPropertySummary.trim()}]\n\n${message}`
        : message;

    const result = await submitPublicLeadAction({
      property_id: null,
      property_reference_code: propertyTypeContext ? "CAPTACAO" : null,
      property_title: propertyTypeContext
        ? ownerPropertySummary.trim() || "Captação de Imóvel de Proprietário"
        : "Atendimento Institucional",
      name,
      phone,
      email,
      message: composedMessage,
      source,
      consent_lgpd: consentLgpd,
      website_honeypot: honeypot,
    });

    setSubmitting(false);
    if (result.success) {
      setFeedback({ type: "success", text: result.message });
      setName("");
      setPhone("");
      setEmail("");
      setOwnerPropertySummary("");
      setMessage("");
    } else {
      setFeedback({ type: "error", text: result.message });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact_honeypot">Não preencha</label>
        <input
          id="contact_honeypot"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="contact-name">Nome completo *</Label>
        <Input
          id="contact-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Como podemos chamá-lo(a)?"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-phone">Telefone / WhatsApp *</Label>
          <Input
            id="contact-phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>
        <div>
          <Label htmlFor="contact-email">E-mail</Label>
          <Input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
        </div>
      </div>

      {propertyTypeContext && (
        <div>
          <Label htmlFor="owner-property-summary">
            Bairro, Cidade e Tipo do Imóvel *
          </Label>
          <Input
            id="owner-property-summary"
            required
            value={ownerPropertySummary}
            onChange={(e) => setOwnerPropertySummary(e.target.value)}
            placeholder="Ex: Apartamento 320m² no Jardim Paulista - Venda"
          />
        </div>
      )}

      <div>
        <Label htmlFor="contact-message">Mensagem e detalhes *</Label>
        <Textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            propertyTypeContext
              ? "Conte-nos brevemente as características do imóvel, área, vagas, valor pretendido e melhor horário para contato."
              : "Descreva como podemos auxiliar em sua jornada imobiliária..."
          }
        />
      </div>

      <label className="flex items-start gap-2.5 text-xs text-zinc-600 cursor-pointer">
        <input
          type="checkbox"
          checked={consentLgpd}
          onChange={(e) => setConsentLgpd(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-cyan-700 focus:ring-cyan-600"
        />
        <span>
          Autorizo o contato da imobiliária para atendimento à minha solicitação,
          em conformidade com a{" "}
          <Link
            href="/privacidade"
            className="underline font-medium text-cyan-800 hover:text-cyan-900"
          >
            Política de Privacidade e LGPD
          </Link>
          .
        </span>
      </label>

      {feedback && (
        <div
          className={cn(
            "flex items-start gap-2.5 rounded-xl p-4 text-xs leading-relaxed",
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
        className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-semibold"
      >
        <Send className="h-4 w-4" />
        <span>{submitting ? "Enviando..." : submitLabel}</span>
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
        <ShieldCheck className="h-3.5 w-3.5 text-cyan-700" />
        <span>Atendimento sigiloso e protegido contra spam.</span>
      </div>
    </form>
  );
}
