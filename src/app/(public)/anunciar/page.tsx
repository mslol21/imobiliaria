import type { Metadata } from "next";
import {
  Camera,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { PublicContactForm } from "@/components/forms/public-contact-form";

export const metadata: Metadata = {
  title: "Anunciar Meu Imóvel | Captação e Avaliação",
  description:
    "Comercialize seu imóvel com fotos profissionais, avaliação técnica fundamentada e qualificação rigorosa de interessados.",
};

export default function AnunciarImovelPage() {
  return (
    <div className="bg-[#FFFFFF] pb-24">
      <section className="bg-[#242424] py-18 text-white border-b border-[#B5121B]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#B5121B] mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Captação de Imóveis</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl font-semibold max-w-3xl">
            Seu imóvel merece a apresentação certa.
          </h1>
          <p className="mt-3 max-w-2xl text-base text-[#D4D4D4]">
            Conduzimos a venda ou locação do seu patrimônio com avaliação de mercado precisa, fotografia arquitetônica e segurança jurídica integral.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-5">
            {[
              {
                icon: Camera,
                title: "Apresentação Visual Premium",
                description:
                  "Fotografia de alta resolução que valoriza os detalhes arquitetônicos e atrai o público qualificado.",
              },
              {
                icon: TrendingUp,
                title: "Avaliação Técnica Precisa",
                description:
                  "Estudo comparativo de mercado baseado em negociações reais da sua região.",
              },
              {
                icon: ShieldCheck,
                title: "Sigilo e Privacidade",
                description:
                  "Possibilidade de ocultar o endereço exato do anúncio e acompanhamento rigoroso em todas as visitas.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#E5E5E5] bg-[#F5F5F5] p-6 shadow-xs flex items-start gap-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#B5121B] border border-[#E5E5E5]">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-editorial text-xl font-semibold text-[#242424]">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm text-[#737373] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-7 sm:p-10 shadow-sm">
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#242424] mb-2">
                Cadastrar meu imóvel para avaliação
              </h2>
              <p className="text-sm text-[#737373] mb-6">
                Informe as características do imóvel para que nosso consultor de captação entre em contato.
              </p>

              <PublicContactForm
                source="anunciar_imovel"
                propertyTypeContext={true}
                submitLabel="Quero anunciar meu imóvel"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
