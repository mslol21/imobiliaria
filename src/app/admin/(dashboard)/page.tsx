import React from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  FileEdit,
  Tag,
  KeyRound,
  Award,
  Users,
  BellRing,
  PlusCircle,
  Settings,
  Image as ImageIcon,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getAdminDashboardMetrics,
  getAdminProperties,
} from "@/services/property.service";
import {
  AVAILABILITY_STATUS_LABELS,
  PROPERTY_PURPOSE_LABELS,
  PUBLICATION_STATUS_LABELS,
} from "@/config/design-tokens";
import { formatCurrencyBRL } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [metrics, recentProperties] = await Promise.all([
    getAdminDashboardMetrics(),
    getAdminProperties(),
  ]);

  const recentSlice = recentProperties.slice(0, 6);

  const metricCards = [
    {
      label: "Total de ImÃ³veis",
      value: metrics.totalProperties,
      icon: Building2,
      tone: "bg-cyan-700 text-white",
    },
    {
      label: "ImÃ³veis Publicados",
      value: metrics.publishedProperties,
      icon: CheckCircle2,
      tone: "bg-white text-[#242424]",
    },
    {
      label: "Em Rascunho",
      value: metrics.draftProperties,
      icon: FileEdit,
      tone: "bg-white text-[#242424]",
    },
    {
      label: "ImÃ³veis para Venda",
      value: metrics.forSaleProperties,
      icon: Tag,
      tone: "bg-white text-[#242424]",
    },
    {
      label: "ImÃ³veis para Aluguel",
      value: metrics.forRentProperties,
      icon: KeyRound,
      tone: "bg-white text-[#242424]",
    },
    {
      label: "ImÃ³veis Vendidos",
      value: metrics.soldProperties,
      icon: Award,
      tone: "bg-white text-[#242424]",
    },
    {
      label: "ImÃ³veis Alugados",
      value: metrics.rentedProperties,
      icon: Award,
      tone: "bg-white text-[#242424]",
    },
    {
      label: "Interessados Cadastrados",
      value: metrics.totalLeads,
      icon: Users,
      tone: "bg-white text-[#242424]",
    },
    {
      label: "Novos Contatos",
      value: metrics.newLeads,
      icon: BellRing,
      tone: "bg-[#242424] text-white",
    },
  ];

  return (
    <div className="space-y-8">
      {/* CabeÃ§alho */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
            VisÃ£o Geral
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#242424]">
            Dashboard Comercial
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button asChild variant="default">
            <Link href="/admin/imoveis/novo">
              <PlusCircle className="h-4 w-4" />
              <span>Cadastrar ImÃ³vel</span>
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/admin/interessados">
              <Users className="h-4 w-4" />
              <span>Ver Interessados</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Grid com os 9 Indicadores ObrigatÃ³rios */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className={`flex items-center justify-between rounded-2xl border border-[#E5E5E5] p-5 shadow-xs ${card.tone}`}
          >
            <div>
              <span className="text-xs font-medium opacity-80 block">
                {card.label}
              </span>
              <span className="font-editorial text-3xl font-bold mt-1 block">
                {card.value}
              </span>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/10">
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Atalhos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/imoveis/novo"
          className="group flex items-center justify-between rounded-2xl border border-[#E5E5E5] bg-white p-5 hover:border-cyan-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <PlusCircle className="h-5 w-5 text-cyan-700" />
            <div>
              <strong className="block text-sm font-semibold text-[#242424]">
                Novo ImÃ³vel
              </strong>
              <span className="text-xs text-[#737373]">
                Cadastrar venda ou locaÃ§Ã£o
              </span>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-[#737373] group-hover:text-cyan-700" />
        </Link>

        <Link
          href="/admin/banners"
          className="group flex items-center justify-between rounded-2xl border border-[#E5E5E5] bg-white p-5 hover:border-cyan-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ImageIcon className="h-5 w-5 text-cyan-700" />
            <div>
              <strong className="block text-sm font-semibold text-[#242424]">
                Banners & Hero
              </strong>
              <span className="text-xs text-[#737373]">
                Personalizar destaques da Home
              </span>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-[#737373] group-hover:text-cyan-700" />
        </Link>

        <Link
          href="/admin/configuracoes"
          className="group flex items-center justify-between rounded-2xl border border-[#E5E5E5] bg-white p-5 hover:border-cyan-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-cyan-700" />
            <div>
              <strong className="block text-sm font-semibold text-[#242424]">
                ConfiguraÃ§Ãµes da ImobiliÃ¡ria
              </strong>
              <span className="text-xs text-[#737373]">
                Nome, logo, CRECI e WhatsApp
              </span>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-[#737373] group-hover:text-cyan-700" />
        </Link>
      </div>

      {/* Tabela de ImÃ³veis Recentes */}
      <div className="rounded-2xl border border-[#E5E5E5] bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] px-6 py-4">
          <h2 className="font-editorial text-xl font-semibold text-[#242424]">
            ImÃ³veis Recentes
          </h2>
          <Link
            href="/admin/imoveis"
            className="text-xs font-semibold text-cyan-700 hover:underline"
          >
            Gerenciar todos â†’
          </Link>
        </div>

        {recentSlice.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#737373]">
            Nenhum imÃ³vel cadastrado no banco. Clique em{" "}
            <Link
              href="/admin/imoveis/novo"
              className="font-semibold text-cyan-700 underline"
            >
              Cadastrar ImÃ³vel
            </Link>{" "}
            para adicionar o primeiro registro.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5F5F5] text-xs uppercase tracking-wider text-[#737373]">
                <tr>
                  <th className="px-6 py-3.5">CÃ³digo / TÃ­tulo</th>
                  <th className="px-6 py-3.5">Finalidade</th>
                  <th className="px-6 py-3.5">LocalizaÃ§Ã£o</th>
                  <th className="px-6 py-3.5">Valor</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">AÃ§Ã£o</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {recentSlice.map((prop) => (
                  <tr key={prop.id} className="hover:bg-[#F5F5F5]/60">
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-cyan-700 block">
                        {prop.reference_code}
                      </span>
                      <span className="font-medium text-[#242424] line-clamp-1">
                        {prop.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="gray">
                        {PROPERTY_PURPOSE_LABELS[prop.purpose]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#737373]">
                      {prop.neighborhood}, {prop.city}
                    </td>
                    <td className="px-6 py-4 font-semibold text-cyan-700">
                      {formatCurrencyBRL(prop.sale_price ?? prop.rent_price)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge
                          variant={
                            prop.publication_status === "publicado"
                              ? "success"
                              : "muted"
                          }
                        >
                          {PUBLICATION_STATUS_LABELS[prop.publication_status]}
                        </Badge>
                        <Badge variant="outline">
                          {AVAILABILITY_STATUS_LABELS[prop.availability_status]}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/imoveis/${prop.id}/editar`}
                        className="text-xs font-semibold text-cyan-700 hover:underline"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

