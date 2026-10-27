import React from "react";
import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPropertyTable } from "@/components/admin/admin-property-table";
import { getAdminProperties } from "@/services/property.service";

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    pub?: string;
    avail?: string;
  }>;
}) {
  const params = await searchParams;
  const properties = await getAdminProperties({
    search: params.q,
    publicationStatus: params.pub,
    availabilityStatus: params.avail,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B79A68]">
            Catálogo Imobiliário
          </span>
          <h1 className="font-editorial text-3xl font-semibold text-[#183B35]">
            Gestão de Imóveis
          </h1>
        </div>

        <Button asChild variant="default">
          <Link href="/admin/imoveis/novo">
            <PlusCircle className="h-4 w-4 text-[#B79A68]" />
            <span>Novo Imóvel</span>
          </Link>
        </Button>
      </div>

      {/* Filtros Administrativos */}
      <form
        method="GET"
        action="/admin/imoveis"
        className="grid grid-cols-1 gap-3 rounded-2xl border border-[#E2DBD0] bg-white p-4 sm:grid-cols-12"
      >
        <div className="sm:col-span-5">
          <Input
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Buscar por código REF, título, bairro ou cidade..."
          />
        </div>
        <div className="sm:col-span-3">
          <select
            name="pub"
            defaultValue={params.pub ?? "todos"}
            className="h-11 w-full rounded-lg border border-[#E2DBD0] bg-white px-3 text-sm"
          >
            <option value="todos">Todas as publicações</option>
            <option value="publicado">Publicados</option>
            <option value="rascunho">Rascunhos</option>
            <option value="arquivado">Arquivados</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <select
            name="avail"
            defaultValue={params.avail ?? "todos"}
            className="h-11 w-full rounded-lg border border-[#E2DBD0] bg-white px-3 text-sm"
          >
            <option value="todos">Disponibilidade</option>
            <option value="disponivel">Disponível</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
            <option value="alugado">Alugado</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" variant="default" className="w-full h-11">
            <Search className="h-4 w-4 text-[#B79A68]" />
            <span>Filtrar</span>
          </Button>
        </div>
      </form>

      <AdminPropertyTable properties={properties} />
    </div>
  );
}
