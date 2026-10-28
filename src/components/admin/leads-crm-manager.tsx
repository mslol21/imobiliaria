"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  Phone,
  Mail,
  Save,
  Building2,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateAdminLeadStatusAction } from "@/actions/lead.actions";
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
} from "@/config/design-tokens";
import { sanitizePhoneForWhatsApp } from "@/lib/utils";
import type { Lead, LeadStatus } from "@/types/domain";

interface LeadsCrmManagerProps {
  leads: Lead[];
}

export function LeadsCrmManager({ leads }: LeadsCrmManagerProps) {
  const router = useRouter();
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, LeadStatus>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSaveLead(lead: Lead) {
    setSavingId(lead.id);
    const nextStatus = statusMap[lead.id] ?? lead.status;
    const nextNotes =
      notesMap[lead.id] !== undefined
        ? notesMap[lead.id]
        : (lead.internal_notes ?? "");

    const res = await updateAdminLeadStatusAction({
      id: lead.id,
      status: nextStatus,
      internal_notes: nextNotes,
    });

    setFeedback(res.message);
    setSavingId(null);
    setEditingLeadId(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {feedback && (
        <div className="rounded-xl border border-[#0e7490]/20 bg-white px-4 py-3 text-xs font-medium text-[#0e7490] flex items-center justify-between">
          <span>{feedback}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-[#64748b] cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-12 text-center text-sm text-[#64748b]">
          Nenhuma solicitação de atendimento encontrada para o filtro selecionado.
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => {
            const currentStatus = statusMap[lead.id] ?? lead.status;
            const currentNotes =
              notesMap[lead.id] !== undefined
                ? notesMap[lead.id]
                : (lead.internal_notes ?? "");
            const cleanPhone = sanitizePhoneForWhatsApp(lead.phone);
            const isExpanded = editingLeadId === lead.id;

            const whatsappGreet = encodeURIComponent(
              `Olá, ${lead.name}! Recebemos sua solicitação${
                lead.property_reference_code
                  ? ` sobre o imóvel ${lead.property_reference_code}`
                  : ""
              } e estamos à disposição para atendê-lo(a).`
            );

            return (
              <div
                key={lead.id}
                className="rounded-2xl border border-[#e2e8f0] bg-white p-5 sm:p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-editorial text-xl font-semibold text-[#0e7490]">
                        {lead.name}
                      </h3>
                      <Badge
                        variant={
                          lead.status === "novo"
                            ? "gold"
                            : lead.status === "convertido"
                              ? "success"
                              : "sand"
                        }
                      >
                        {LEAD_STATUS_LABELS[lead.status]}
                      </Badge>
                      <Badge variant="outline">
                        {LEAD_SOURCE_LABELS[lead.source]}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748b]">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-[#0891b2]" />
                        {lead.phone}
                      </span>
                      {lead.email && (
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-[#0891b2]" />
                          {lead.email}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-[#0891b2]" />
                        {new Date(lead.created_at).toLocaleString("pt-BR")}
                      </span>
                    </div>

                    {(lead.property_reference_code || lead.property_title) && (
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#f8fafc] px-3 py-1.5 text-xs font-medium text-[#0e7490] mt-1">
                        <Building2 className="h-3.5 w-3.5 text-[#0891b2]" />
                        <span>
                          Imóvel:{" "}
                          <strong>
                            {lead.property_reference_code
                              ? `${lead.property_reference_code} — `
                              : ""}
                            {lead.property_title || "Consulta geral"}
                          </strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Ações Rápidas */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {cleanPhone && (
                      <Button asChild variant="default" size="sm">
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${whatsappGreet}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>Iniciar WhatsApp</span>
                        </a>
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        setEditingLeadId(isExpanded ? null : lead.id)
                      }
                    >
                      {isExpanded
                        ? "Fechar edição"
                        : "Atualizar status / Notas"}
                    </Button>
                  </div>
                </div>

                {/* Mensagem enviada pelo visitante */}
                <div className="rounded-xl bg-[#f8fafc]/60 p-4 text-xs sm:text-sm text-[#242424] whitespace-pre-line border border-[#e2e8f0]/80">
                  {lead.message}
                </div>

                {lead.internal_notes && !isExpanded && (
                  <div className="text-xs text-[#64748b] bg-amber-50/70 border border-amber-200/80 rounded-lg px-3.5 py-2">
                    <strong className="text-[#0e7490]">
                      Observações internas:
                    </strong>{" "}
                    {lead.internal_notes}
                  </div>
                )}

                {/* Painel Expansível de Atualização CRM */}
                {isExpanded && (
                  <div className="border-t border-[#e2e8f0] pt-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                      <div className="sm:col-span-4">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#242424] mb-1">
                          Status do Atendimento
                        </label>
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            setStatusMap((prev) => ({
                              ...prev,
                              [lead.id]: e.target.value as LeadStatus,
                            }))
                          }
                          className="h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 text-sm"
                        >
                          {(
                            Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]
                          ).map((st) => (
                            <option key={st} value={st}>
                              {LEAD_STATUS_LABELS[st]}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-8">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#242424] mb-1">
                          Observações Internas do Consultor
                        </label>
                        <Textarea
                          rows={3}
                          value={currentNotes}
                          onChange={(e) =>
                            setNotesMap((prev) => ({
                              ...prev,
                              [lead.id]: e.target.value,
                            }))
                          }
                          placeholder="Registre histórico de contato, preferências do cliente, feedback de visita..."
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        disabled={savingId === lead.id}
                        onClick={() => handleSaveLead(lead)}
                      >
                        <Save className="h-3.5 w-3.5 text-[#0891b2]" />
                        <span>
                          {savingId === lead.id
                            ? "Salvando..."
                            : "Salvar atendimento"}
                        </span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
