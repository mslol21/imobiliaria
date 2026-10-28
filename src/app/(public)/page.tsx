import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Compass,
  KeyRound,
  ShieldCheck,
  Clock,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { HeroSearchBar } from "@/components/properties/hero-search-bar";
import { PropertyCard } from "@/components/properties/property-card";
import { PublicContactForm } from "@/components/forms/public-contact-form";
import { Button } from "@/components/ui/button";
import { HOME_CATEGORIES } from "@/config/design-tokens";
import {
  getDistinctLocations,
  getFeaturedProperties,
  getPublicProperties,
} from "@/services/property.service";
import {
  getActiveBanners,
  getSiteSettings,
} from "@/services/settings.service";
import { sanitizePhoneForWhatsApp } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Encontre o Imóvel Ideal | Comprar e Alugar",
  description:
    "Explore imóveis para comprar ou alugar e encontre o espaço perfeito para viver seus próximos momentos com segurança e atendimento de corretores especializados.",
};

export default async function HomePage() {
  const [
    featuredResult,
    saleResult,
    rentResult,
    locations,
    settings,
    heroBanners,
  ] = await Promise.all([
    getFeaturedProperties(6),
    getPublicProperties({ finalidade: "venda", porPagina: 3 }),
    getPublicProperties({ finalidade: "aluguel", porPagina: 3 }),
    getDistinctLocations(),
    getSiteSettings(),
    getActiveBanners("hero"),
  ]);

  const heroBanner = heroBanners[0];
  const heroImage =
    heroBanner?.image_url ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85";

  const cleanWhatsapp = sanitizePhoneForWhatsApp(settings.whatsapp);

  return (
    <div className="bg-white text-zinc-900">
      {/* =================================================================== */}
      {/* 2. HERO COM FOTOGRAFIA IMOBILIÁRIA E PESQUISA                       */}
      {/* =================================================================== */}
      <section className="relative min-h-[500px] lg:min-h-[560px] flex items-center justify-center overflow-hidden bg-zinc-900">
        <Image
          src={heroImage}
          alt="Fachada residencial moderna e elegante"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Overlay equilibrado para nitidez e contraste comercial */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
            Encontre o imóvel ideal para você.
          </h1>

          <p className="mt-3.5 max-w-2xl text-base leading-relaxed text-zinc-200 sm:text-lg">
            Explore imóveis para comprar ou alugar e encontre o espaço perfeito para viver seus próximos momentos.
          </p>

          {/* Mecanismo de Pesquisa Integrado e Imediato */}
          <div className="mt-7 w-full flex justify-center">
            <HeroSearchBar
              cities={locations.cities}
              neighborhoods={locations.neighborhoods}
            />
          </div>

          {/* Indicadores de Confiança Discretos */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-200">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <span>Assessoria jurídica completa</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <Compass className="h-4 w-4 text-cyan-400" />
              <span>Imóveis verificados e selecionados</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-cyan-400" />
              <span>Atendimento com corretores credenciados</span>
            </span>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. IMÓVEIS EM DESTAQUE                                              */}
      {/* =================================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
              Seleção Especial
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Imóveis em Destaque
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-zinc-600">
              Propriedades selecionadas por sua arquitetura marcante, localização privilegiada e alto padrão construtivo.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/imoveis">
              <span>Ver catálogo completo</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        {featuredResult.items.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredResult.items.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-10 text-center">
            <Building2 className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
            <p className="text-sm text-zinc-600">
              Nenhum imóvel em destaque no momento.
            </p>
          </div>
        )}
      </section>

      {/* =================================================================== */}
      {/* 4. IMÓVEIS PARA COMPRAR                                             */}
      {/* =================================================================== */}
      <section className="bg-zinc-50 py-16 border-y border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
                Venda
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                Imóveis para Comprar
              </h2>
              <p className="mt-1.5 max-w-xl text-sm text-zinc-600">
                Residências, coberturas e apartamentos prontos para morar ou investir com solidez.
              </p>
            </div>
            <Button asChild variant="default" size="sm">
              <Link href="/comprar">
                <span>Ver todos para comprar</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {saleResult.items.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                preferredPurpose="venda"
              />
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. IMÓVEIS PARA ALUGAR                                              */}
      {/* =================================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
              Locação
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Imóveis para Alugar
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-zinc-600">
              Opções mobiliadas, coberturas e conjuntos comerciais prontos para ocupação com agilidade.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/alugar">
              <span>Ver todos para alugar</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rentResult.items.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              preferredPurpose="aluguel"
            />
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. CATEGORIAS DE IMÓVEIS                                            */}
      {/* =================================================================== */}
      <section className="bg-zinc-50 py-16 border-y border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
              Tipologias
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Categorias de Imóveis
            </h2>
            <p className="mt-1.5 text-sm text-zinc-600">
              Explore por tipo de imóvel e encontre a configuração mais adequada para o seu dia a dia.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={category.href}
                className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-xl border border-zinc-200 bg-zinc-900 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-md"
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent"
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">
                      {category.title}
                    </h3>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-xs transition-colors group-hover:bg-cyan-700 group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-200 line-clamp-1">
                    {category.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 7. SOBRE A IMOBILIÁRIA                                              */}
      {/* =================================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
            Sobre Nós
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            {settings.about_title || "Consultoria Imobiliária com Segurança e Clareza"}
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Uma abordagem dedicada a orientar cada etapa da negociação com transparência, agilidade e rigor documental.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Compass,
              title: "Curadoria Especializada",
              desc: "Avaliação técnica criteriosa de cada propriedade quanto a estado construtivo, insolação e planta.",
            },
            {
              icon: ShieldCheck,
              title: "Segurança Jurídica",
              desc: "Auditoria documental completa e suporte contratual em todas as etapas de compra e locação.",
            },
            {
              icon: KeyRound,
              title: "Atendimento Consultivo",
              desc: "Acompanhamento dedicado e personalizado para entender suas reais prioridades e necessidades.",
            },
            {
              icon: Clock,
              title: "Agilidade e Resposta",
              desc: "Retorno ágil aos seus contatos e agendamento de visitas no momento mais conveniente para você.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs hover:border-zinc-300 transition-colors"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 mb-4">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900">
                {item.title}
              </h3>
              <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 8. CHAMADA PARA ANUNCIAR UM IMÓVEL                                  */}
      {/* =================================================================== */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-zinc-900 text-white p-8 sm:p-12 shadow-sm border border-zinc-800">
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Proprietários
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Quer vender ou alugar o seu imóvel?
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
                Anuncie conosco e tenha seu imóvel promovido com fotografia profissional, avaliação de mercado fundamentada e direcionamento a compradores e inquilinos qualificados.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button asChild variant="default" size="lg">
                <Link href="/anunciar">
                  <span>Anunciar meu imóvel</span>
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              {cleanWhatsapp && (
                <Button asChild variant="outlineLight" size="lg">
                  <a
                    href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                      "Olá! Sou proprietário e gostaria de conversar com um corretor sobre anunciar meu imóvel."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Falar no WhatsApp</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 9. CONTATO                                                          */}
      {/* =================================================================== */}
      <section className="bg-zinc-50 py-16 border-t border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
                Atendimento
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight">
                Fale com um corretor
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Tire dúvidas sobre documentação, agendamento de visitas ou propostas comerciais. Preencha o formulário e entraremos em contato rapidamente.
              </p>

              <div className="pt-4 space-y-3.5 text-sm text-zinc-700">
                {settings.phone && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-zinc-200 text-cyan-700 shrink-0">
                      <Phone className="h-4 w-4" />
                    </div>
                    <span>{settings.phone}</span>
                  </div>
                )}
                {settings.whatsapp && cleanWhatsapp && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-zinc-200 text-cyan-700 shrink-0">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <a
                      href={`https://wa.me/${cleanWhatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cyan-700 transition-colors"
                    >
                      WhatsApp: {settings.whatsapp}
                    </a>
                  </div>
                )}
                {settings.email && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-zinc-200 text-cyan-700 shrink-0">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span>{settings.email}</span>
                  </div>
                )}
                {settings.address_line && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-zinc-200 text-cyan-700 shrink-0 mt-0.5">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span>
                      {settings.address_line}
                      {settings.city ? ` — ${settings.city}/${settings.state}` : ""}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 space-y-2 text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-700 shrink-0" />
                  <span>Atendimento confidencial e em conformidade com a LGPD</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-700 shrink-0" />
                  <span>Opções selecionadas de acordo com o seu perfil</span>
                </div>
              </div>
            </div>

            {/* Formulário Funcional */}
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs">
                <PublicContactForm source="contato_geral" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
