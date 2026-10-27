import type { Metadata } from "next";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { PublicContactForm } from "@/components/forms/public-contact-form";
import { getSiteSettings } from "@/services/settings.service";
import { sanitizePhoneForWhatsApp } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contato & Atendimento | Fale com um Especialista",
  description:
    "Entre em contato com nossa equipe de consultoria para agendar visitas, avaliar seu imóvel ou receber opções personalizadas.",
};

export default async function ContatoPage() {
  const settings = await getSiteSettings();
  const cleanWhatsapp = sanitizePhoneForWhatsApp(settings.whatsapp);

  return (
    <div className="bg-[#FFFFFF] pb-24">
      <section className="bg-[#242424] py-16 text-white border-b border-[#B5121B]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#B5121B] mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Atendimento Especializado</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl font-semibold">
            Fale Conosco
          </h1>
          <p className="mt-3 max-w-2xl text-base text-[#D4D4D4]">
            Estamos prontos para atender você com discrição, agilidade e conhecimento aprofundado do mercado.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Informações de Contato */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-[#E5E5E5] bg-[#F5F5F5] p-7 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#B5121B]">
                  Canais de Atendimento
                </span>
                <h2 className="font-editorial mt-1 text-2xl font-semibold text-[#242424]">
                  Informações de Contato
                </h2>
              </div>

              <ul className="space-y-4 text-sm text-[#242424]">
                <li className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#B5121B] border border-[#E5E5E5]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="block font-semibold text-[#242424]">
                      Localização
                    </strong>
                    <span className="text-[#737373]">
                      {settings.address_line
                        ? `${settings.address_line} — ${settings.city}/${settings.state}`
                        : `${settings.city}/${settings.state} • Atendimento presencial com agendamento`}
                    </span>
                  </div>
                </li>

                {settings.phone && (
                  <li className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#B5121B] border border-[#E5E5E5]">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <strong className="block font-semibold text-[#242424]">
                        Telefone
                      </strong>
                      <a
                        href={`tel:${settings.phone.replace(/\D/g, "")}`}
                        className="text-[#737373] hover:text-[#B5121B]"
                      >
                        {settings.phone}
                      </a>
                    </div>
                  </li>
                )}

                {settings.whatsapp && cleanWhatsapp && (
                  <li className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#B5121B] border border-[#E5E5E5]">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <strong className="block font-semibold text-[#242424]">
                        WhatsApp
                      </strong>
                      <a
                        href={`https://wa.me/${cleanWhatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#B5121B] hover:underline"
                      >
                        {settings.whatsapp}
                      </a>
                    </div>
                  </li>
                )}

                {settings.email && (
                  <li className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#B5121B] border border-[#E5E5E5]">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <strong className="block font-semibold text-[#242424]">
                        E-mail
                      </strong>
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-[#737373] hover:text-[#B5121B]"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </li>
                )}

                <li className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#B5121B] border border-[#E5E5E5]">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="block font-semibold text-[#242424]">
                      Horário de Atendimento
                    </strong>
                    <span className="text-[#737373]">
                      {settings.business_hours}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Formulário */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-7 sm:p-10 shadow-sm">
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#242424] mb-2">
                Envie sua mensagem
              </h2>
              <p className="text-sm text-[#737373] mb-6">
                Preencha os campos abaixo e nosso consultor retornará rapidamente.
              </p>

              <PublicContactForm
                source="contato_geral"
                submitLabel="Solicitar Atendimento"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
