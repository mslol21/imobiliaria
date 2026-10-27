import type { Metadata } from "next";
import { getSiteSettings } from "@/services/settings.service";

export const metadata: Metadata = {
  title: "Política de Privacidade e Proteção de Dados (LGPD)",
  description:
    "Saiba como coletamos e protegemos seus dados em conformidade com a Lei Geral de Proteção de Dados.",
};

export default async function PrivacidadePage() {
  const settings = await getSiteSettings();

  return (
    <div className="bg-[#FFFFFF] py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#E5E5E5] bg-white p-8 sm:p-12 shadow-xs space-y-6 text-sm sm:text-base leading-relaxed text-[#242424]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B5121B]">
              Conformidade Legal • LGPD
            </span>
            <h1 className="font-editorial mt-1 text-3xl sm:text-4xl font-semibold text-[#242424]">
              Política de Privacidade e Proteção de Dados
            </h1>
            <p className="mt-2 text-xs text-[#737373]">
              Última atualização: {settings.privacy_policy_updated_at}
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="font-editorial text-2xl font-semibold text-[#242424]">
              1. Finalidade do Tratamento de Dados
            </h2>
            <p className="text-[#737373]">
              Os dados coletados em nossos formulários (nome, telefone, e-mail e mensagem) destinam-se exclusivamente a viabilizar o atendimento consultivo e comercial solicitado pelo usuário para esclarecimento de dúvidas, agendamento de visitas ou avaliação de imóveis.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-editorial text-2xl font-semibold text-[#242424]">
              2. Confidencialidade e Segurança
            </h2>
            <p className="text-[#737373]">
              Todas as informações recebidas são confidenciais e armazenadas de forma segura com políticas de controle de acesso (Row Level Security), acessíveis unicamente por consultores e administradores autorizados.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-editorial text-2xl font-semibold text-[#242424]">
              3. Direitos do Titular
            </h2>
            <p className="text-[#737373]">
              Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), o titular pode requerer a qualquer momento a confirmação de tratamento, retificação ou exclusão de seus dados mediante contato pelos canais oficiais informados no site.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
