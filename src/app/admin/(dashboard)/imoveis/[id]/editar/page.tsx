import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PropertyForm } from "@/components/admin/property-form";
import { getAdminPropertyById } from "@/services/property.service";

export default async function EditarImovelAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getAdminPropertyById(id);

  if (!property) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/imoveis"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5C5B57] hover:text-[#183B35] mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar para listagem de imóveis</span>
        </Link>
        <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#183B35]">
          Editar Imóvel — {property.reference_code}
        </h1>
        <p className="text-sm text-[#5C5B57] mt-1">{property.title}</p>
      </div>

      <PropertyForm initialProperty={property} />
    </div>
  );
}
