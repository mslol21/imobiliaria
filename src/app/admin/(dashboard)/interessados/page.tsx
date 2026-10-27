import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeadsCrmManager } from "@/components/admin/leads-crm-manager";
import { getAdminLeads } from "@/services/lead.service";
import { LEAD_STATUS_LABELS } from "@/config/design-tokens";
import type { LeadStatus } from "@/types/domain";

export default async function AdminInteressadosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = (params.status as LeadStatus | "todos") ?? "todos";
  const leads = await getAdminLeads({
    status: statusFilter,
    search: params.q,
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B79A68]">
          CRM Imobiliário
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#183B35]">
          Gestão de Interessados e Solicitações
        </h1>
        <p className="text-sm text-[#5C5B57] mt-1">
          Acompanhe contatos recebidos, agendamentos de visitas e captações de
          imóveis.
        </p>
      </div>

      {/* Filtro por Status e Busca */}
      <form
        method="GET"
        action="/admin/interessados"
        className="grid grid-cols-1 gap-3 rounded-2xl border border-[#E2DBD0] bg-white p-4 sm:grid-cols-12"
      >
        <div className="sm:col-span-6">
          <Input
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Buscar por nome, telefone, e-mail ou código REF do imóvel..."
          />
        </div>
        <div className="sm:col-span-4">
          <select
            name="status"
            defaultValue={statusFilter}
            className="h-11 w-full rounded-lg border border-[#E2DBD0] bg-white px-3 text-sm"
          >
            <option value="todos">Todos os status de atendimento</option>
            {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map((key) => (
              <option key={key} value={key}>
                {LEAD_STATUS_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" variant="default" className="w-full h-11">
            <Search className="h-4 w-4 text-[#B79A68]" />
            <span>Filtrar</span>
          </Button>
        </div>
      </form>

      <LeadsCrmManager leads={leads} />
    </div>
  );
}
