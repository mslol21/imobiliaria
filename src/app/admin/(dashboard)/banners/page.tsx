import React from "react";
import { BannersManager } from "@/components/admin/banners-manager";
import { getAllAdminBanners } from "@/services/settings.service";

export default async function AdminBannersPage() {
  const banners = await getAllAdminBanners();

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#0891b2]">
          Identidade Visual da Home
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#0e7490]">
          Gestão de Banners e Destaques
        </h1>
        <p className="text-sm text-[#64748b] mt-1">
          Configure a imagem arquitetônica, título e chamada principal do Hero da
          página inicial.
        </p>
      </div>

      <BannersManager banners={banners} />
    </div>
  );
}
