import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Compass,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/services/settings.service";

export const metadata: Metadata = {
  title: "Sobre Nós | Consultoria e Atuação Imobiliária",
  description:
    "Conheça nossa metodologia, diferenciais e compromisso com excelência, discrição e segurança jurídica.",
};

export default async function SobrePage() {
  const settings = await getSiteSettings();

  return (
    <div className="bg-[#FFFFFF] pb-24">
      {/* Header Institucional */}
      <section className="bg-[#242424] py-20 text-white border-b border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Institucional</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-semibold max-w-4xl leading-tight">
            {settings.about_title}
          </h1>
          <p className="mt-5 max-w-2xl text-base sm:text-lg text-[#D4D4D4] leading-relaxed">
            {settings.agency_slogan}
          </p>
        </div>
      </section>

      {/* Trajetória e Posicionamento */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 rounded-3xl border border-[#E5E5E5] bg-white p-8 sm:p-12 shadow-xs space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Posicionamento & Metodologia
            </span>
            <h2 className="font-editorial text-3xl font-semibold text-[#242424]">
              História e Atuação Consultiva
            </h2>
            <p className="text-base leading-relaxed text-[#242424]/90 whitespace-pre-line">
              {settings.about_history}
            </p>
            <p className="text-base leading-relaxed text-[#737373] whitespace-pre-line">
              {settings.about_positioning}
            </p>

            {settings.creci && (
              <div className="inline-flex items-center gap-2 rounded-xl bg-[#F5F5F5] px-4 py-2.5 text-xs font-semibold text-[#242424] border border-[#E5E5E5]">
                <ShieldCheck className="h-4 w-4 text-cyan-700" />
                <span>Registro CRECI: {settings.creci}</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 rounded-3xl bg-[#242424] p-8 sm:p-12 text-white flex flex-col justify-between border border-cyan-700/40">
            <div className="space-y-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-700 text-white">
                <Compass className="h-6 w-6" />
              </div>
              <h2 className="font-editorial text-3xl font-semibold">
                Consultoria Imobiliária
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#D4D4D4]">
                {settings.about_consulting}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-3">
              <Button asChild variant="default">
                <Link href="/contato">
                  <span>Falar com especialista</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outlineLight">
                <Link href="/imoveis">Explorar catálogo</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Diferenciais */}
        <div className="mt-16">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Compromisso
            </span>
            <h2 className="font-editorial mt-1 text-3xl font-semibold text-[#242424]">
              Nossos Pilares
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {settings.about_differentials.map((item, idx) => (
              <div
                key={item.title || idx}
                className="rounded-2xl border border-[#E5E5E5] bg-[#F5F5F5] p-7 shadow-xs space-y-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-700 text-white">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="font-editorial text-2xl font-semibold text-[#242424]">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#737373]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

