import React from "react";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/services/settings.service";

export default async function AdminConfiguracoesPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#0891b2]">
          Parâmetros Globais
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#0e7490]">
          Configurações Institucionais e de Contato
        </h1>
        <p className="text-sm text-[#64748b] mt-1">
          Atualize os dados oficiais exibidos no cabeçalho, rodapé, página Sobre
          Nós e botões de atendimento via WhatsApp.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
