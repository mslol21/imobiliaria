import type { Metadata } from "next";
import {
  Camera,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { PublicContactForm } from "@/components/forms/public-contact-form";

export const metadata: Metadata = {
  title: "Anunciar Meu ImÃ³vel | CaptaÃ§Ã£o e AvaliaÃ§Ã£o",
  description:
    "Comercialize seu imÃ³vel com fotos profissionais, avaliaÃ§Ã£o tÃ©cnica fundamentada e qualificaÃ§Ã£o rigorosa de interessados.",
};

export default function AnunciarImovelPage() {
  return (
    <div className="bg-[#FFFFFF] pb-24">
      <section className="bg-[#242424] py-18 text-white border-b border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>CaptaÃ§Ã£o de ImÃ³veis</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl font-semibold max-w-3xl">
            Seu imÃ³vel merece a apresentaÃ§Ã£o certa.
          </h1>
          <p className="mt-3 max-w-2xl text-base text-[#D4D4D4]">
            Conduzimos a venda ou locaÃ§Ã£o do seu patrimÃ´nio com avaliaÃ§Ã£o de mercado precisa, fotografia arquitetÃ´nica e seguranÃ§a jurÃ­dica integral.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-5">
            {[
              {
                icon: Camera,
                title: "ApresentaÃ§Ã£o Visual Premium",
                description:
                  "Fotografia de alta resoluÃ§Ã£o que valoriza os detalhes arquitetÃ´nicos e atrai o pÃºblico qualificado.",
              },
              {
                icon: TrendingUp,
                title: "AvaliaÃ§Ã£o TÃ©cnica Precisa",
                description:
                  "Estudo comparativo de mercado baseado em negociaÃ§Ãµes reais da sua regiÃ£o.",
              },
              {
                icon: ShieldCheck,
                title: "Sigilo e Privacidade",
                description:
                  "Possibilidade de ocultar o endereÃ§o exato do anÃºncio e acompanhamento rigoroso em todas as visitas.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#E5E5E5] bg-[#F5F5F5] p-6 shadow-xs flex items-start gap-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-700 border border-[#E5E5E5]">
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
                Cadastrar meu imÃ³vel para avaliaÃ§Ã£o
              </h2>
              <p className="text-sm text-[#737373] mb-6">
                Informe as caracterÃ­sticas do imÃ³vel para que nosso consultor de captaÃ§Ã£o entre em contato.
              </p>

              <PublicContactForm
                source="anunciar_imovel"
                propertyTypeContext={true}
                submitLabel="Quero anunciar meu imÃ³vel"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

