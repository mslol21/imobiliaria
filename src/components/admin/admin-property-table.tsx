"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Copy,
  Edit3,
  ExternalLink,
  Trash2,
  Eye,
  EyeOff,
  Archive,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  deletePropertyAction,
  duplicatePropertyAction,
  updatePropertyStatusAction,
} from "@/actions/property.actions";
import {
  AVAILABILITY_STATUS_LABELS,
  PROPERTY_PURPOSE_LABELS,
  PROPERTY_TYPE_LABELS,
  PUBLICATION_STATUS_LABELS,
} from "@/config/design-tokens";
import { formatCurrencyBRL } from "@/lib/utils";
import type { Property } from "@/types/domain";

interface AdminPropertyTableProps {
  properties: Property[];
}

export function AdminPropertyTable({ properties }: AdminPropertyTableProps) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleTogglePublish(prop: Property) {
    setBusyId(prop.id);
    const nextStatus =
      prop.publication_status === "publicado" ? "rascunho" : "publicado";
    const res = await updatePropertyStatusAction(prop.id, {
      publication_status: nextStatus,
    });
    setFeedback(res.message);
    setBusyId(null);
    router.refresh();
  }

  async function handleArchive(prop: Property) {
    setBusyId(prop.id);
    const res = await updatePropertyStatusAction(prop.id, {
      publication_status: "arquivado",
      is_featured: false,
    });
    setFeedback(res.message);
    setBusyId(null);
    router.refresh();
  }

  async function handleToggleFeatured(prop: Property) {
    setBusyId(prop.id);
    const res = await updatePropertyStatusAction(prop.id, {
      is_featured: !prop.is_featured,
    });
    setFeedback(res.message);
    setBusyId(null);
    router.refresh();
  }

  async function handleDuplicate(prop: Property) {
    setBusyId(prop.id);
    const res = await duplicatePropertyAction(prop.id);
    setFeedback(res.message);
    setBusyId(null);
    router.refresh();
  }

  async function handleDeleteConfirmed(id: string) {
    setBusyId(id);
    const res = await deletePropertyAction(id);
    setFeedback(res.message);
    setConfirmDeleteId(null);
    setBusyId(null);
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
            className="text-[#64748b] hover:text-[#242424] cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-xs overflow-hidden">
        {properties.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm text-[#64748b]">
              Nenhum imóvel encontrado para os critérios selecionados.
            </p>
            <Button asChild variant="default" size="sm">
              <Link href="/admin/imoveis/novo">Cadastrar novo imóvel</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f8fafc] text-xs uppercase tracking-wider text-[#64748b]">
                <tr>
                  <th className="px-5 py-3.5">Imóvel</th>
                  <th className="px-5 py-3.5">Tipo / Finalidade</th>
                  <th className="px-5 py-3.5">Valores</th>
                  <th className="px-5 py-3.5">Publicação / Status</th>
                  <th className="px-5 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {properties.map((prop) => {
                  const isBusy = busyId === prop.id;
                  return (
                    <tr key={prop.id} className="hover:bg-[#f8fafc]/35">
                      <td className="px-5 py-4 max-w-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#0e7490]">
                            {prop.reference_code}
                          </span>
                          {prop.is_featured && (
                            <span className="inline-flex items-center gap-1 rounded bg-[#0891b2]/25 px-1.5 py-0.5 text-[10px] font-semibold text-[#0e7490]">
                              <Star className="h-2.5 w-2.5 fill-current" />
                              Destaque
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-[#242424] line-clamp-1 mt-0.5">
                          {prop.title}
                        </p>
                        <p className="text-xs text-[#64748b]">
                          {prop.neighborhood}, {prop.city}/{prop.state}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-xs">
                        <span className="font-medium text-[#242424] block">
                          {PROPERTY_TYPE_LABELS[prop.property_type]}
                        </span>
                        <span className="text-[#64748b]">
                          {PROPERTY_PURPOSE_LABELS[prop.purpose]}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs">
                        {prop.sale_price && (
                          <div className="font-semibold text-[#0e7490]">
                            Venda: {formatCurrencyBRL(prop.sale_price)}
                          </div>
                        )}
                        {prop.rent_price && (
                          <div className="font-semibold text-[#0e7490]">
                            Aluguel: {formatCurrencyBRL(prop.rent_price)}/mês
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          <Badge
                            variant={
                              prop.publication_status === "publicado"
                                ? "success"
                                : prop.publication_status === "arquivado"
                                  ? "warning"
                                  : "muted"
                            }
                          >
                            {PUBLICATION_STATUS_LABELS[prop.publication_status]}
                          </Badge>
                          <Badge variant="outline">
                            {
                              AVAILABILITY_STATUS_LABELS[
                                prop.availability_status
                              ]
                            }
                          </Badge>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right">
                        {confirmDeleteId === prop.id ? (
                          <div className="inline-flex items-center gap-2 bg-red-50 p-1.5 rounded-lg border border-red-200">
                            <span className="text-xs text-red-900 font-medium px-1">
                              Confirmar exclusão?
                            </span>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              disabled={isBusy}
                              onClick={() => handleDeleteConfirmed(prop.id)}
                            >
                              Sim, excluir
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <div className="inline-flex flex-wrap items-center justify-end gap-1">
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              title="Visualizar página pública"
                            >
                              <Link
                                href={`/imoveis/${prop.slug}`}
                                target="_blank"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={isBusy}
                              onClick={() => handleToggleFeatured(prop)}
                              title={
                                prop.is_featured
                                  ? "Remover destaque da Home"
                                  : "Destacar na Home"
                              }
                            >
                              <Star
                                className={`h-3.5 w-3.5 ${
                                  prop.is_featured
                                    ? "fill-[#0891b2] text-[#0891b2]"
                                    : "text-[#64748b]"
                                }`}
                              />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={isBusy}
                              onClick={() => handleTogglePublish(prop)}
                              title={
                                prop.publication_status === "publicado"
                                  ? "Despublicar (voltar para rascunho)"
                                  : "Publicar imóvel"
                              }
                            >
                              {prop.publication_status === "publicado" ? (
                                <EyeOff className="h-3.5 w-3.5 text-amber-700" />
                              ) : (
                                <Eye className="h-3.5 w-3.5 text-emerald-700" />
                              )}
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={isBusy}
                              onClick={() => handleDuplicate(prop)}
                              title="Duplicar imóvel"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={isBusy}
                              onClick={() => handleArchive(prop)}
                              title="Arquivar imóvel"
                            >
                              <Archive className="h-3.5 w-3.5" />
                            </Button>

                            <Button
                              asChild
                              variant="secondary"
                              size="sm"
                              title="Editar imóvel"
                            >
                              <Link href={`/admin/imoveis/${prop.id}/editar`}>
                                <Edit3 className="h-3.5 w-3.5" />
                                <span>Editar</span>
                              </Link>
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={isBusy}
                              onClick={() => setConfirmDeleteId(prop.id)}
                              className="text-red-700 hover:bg-red-50 hover:text-red-800"
                              title="Excluir imóvel"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
