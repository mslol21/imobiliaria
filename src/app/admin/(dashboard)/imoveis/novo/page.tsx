import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PropertyForm } from "@/components/admin/property-form";

export default function NovoImovelAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/imoveis"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748b] hover:text-[#0e7490] mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar para listagem de imóveis</span>
        </Link>
        <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#0e7490]">
          Cadastrar Novo Imóvel
        </h1>
      </div>

      <PropertyForm />
    </div>
  );
}
