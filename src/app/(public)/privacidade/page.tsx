import type { Metadata } from "next";
import { getSiteSettings } from "@/services/settings.service";

export const metadata: Metadata = {
  title: "PolÃ­tica de Privacidade e ProteÃ§Ã£o de Dados (LGPD)",
  description:
    "Saiba como coletamos e protegemos seus dados em conformidade com a Lei Geral de ProteÃ§Ã£o de Dados.",
};

export default async function PrivacidadePage() {
  const settings = await getSiteSettings();

  return (
    <div className="bg-[#FFFFFF] py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#E5E5E5] bg-white p-8 sm:p-12 shadow-xs space-y-6 text-sm sm:text-base leading-relaxed text-[#242424]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
              Conformidade Legal â€¢ LGPD
            </span>
            <h1 className="font-editorial mt-1 text-3xl sm:text-4xl font-semibold text-[#242424]">
              PolÃ­tica de Privacidade e ProteÃ§Ã£o de Dados
            </h1>
            <p className="mt-2 text-xs text-[#737373]">
              Ãšltima atualizaÃ§Ã£o: {settings.privacy_policy_updated_at}
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="font-editorial text-2xl font-semibold text-[#242424]">
              1. Finalidade do Tratamento de Dados
            </h2>
            <p className="text-[#737373]">
              Os dados coletados em nossos formulÃ¡rios (nome, telefone, e-mail e mensagem) destinam-se exclusivamente a viabilizar o atendimento consultivo e comercial solicitado pelo usuÃ¡rio para esclarecimento de dÃºvidas, agendamento de visitas ou avaliaÃ§Ã£o de imÃ³veis.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-editorial text-2xl font-semibold text-[#242424]">
              2. Confidencialidade e SeguranÃ§a
            </h2>
            <p className="text-[#737373]">
              Todas as informaÃ§Ãµes recebidas sÃ£o confidenciais e armazenadas de forma segura com polÃ­ticas de controle de acesso (Row Level Security), acessÃ­veis unicamente por consultores e administradores autorizados.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-editorial text-2xl font-semibold text-[#242424]">
              3. Direitos do Titular
            </h2>
            <p className="text-[#737373]">
              Nos termos da Lei Geral de ProteÃ§Ã£o de Dados (Lei nÂº 13.709/2018), o titular pode requerer a qualquer momento a confirmaÃ§Ã£o de tratamento, retificaÃ§Ã£o ou exclusÃ£o de seus dados mediante contato pelos canais oficiais informados no site.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

