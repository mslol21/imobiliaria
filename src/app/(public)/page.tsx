import React from "react";
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
  Sparkles,
  Info,
  Clock,
  PhoneCall,
  Award,
} from "lucide-react";
import { HeroSearchBar } from "@/components/properties/hero-search-bar";
import { PropertyCard } from "@/components/properties/property-card";
import { PublicContactForm } from "@/components/forms/public-contact-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const heroTitle =
    heroBanner?.title || "Encontre o imóvel ideal para o seu próximo capítulo.";
  const heroSubtitle =
    heroBanner?.subtitle ||
    "Explore oportunidades de compra e locação com praticidade, segurança e atendimento especializado.";
  const heroImage =
    heroBanner?.image_url ||
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85";

  const cleanWhatsapp = sanitizePhoneForWhatsApp(settings.whatsapp);

  return (
    <div className="bg-[#FFFFFF]">
      {/* =================================================================== */}
      {/* 1. HERO COM BUSCA                                                   */}
      {/* =================================================================== */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-[#242424]">
        <Image
          src={heroImage}
          alt="Imóvel moderno de alto padrão"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Overlay suave para legibilidade e elegância */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/85"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
          <Badge
            variant="default"
            className="mb-5 px-4 py-1.5 text-xs uppercase tracking-[0.18em] bg-[#B5121B] text-white"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Consultoria Imobiliária Especializada</span>
          </Badge>

          <h1 className="font-editorial max-w-4xl text-4xl font-semibold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {heroTitle}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#F5F5F5] sm:text-lg">
            {heroSubtitle}
          </p>

          {/* Mecanismo de Pesquisa Integrado */}
          <div className="mt-10 w-full flex justify-center">
            <HeroSearchBar
              cities={locations.cities}
              neighborhoods={locations.neighborhoods}
            />
          </div>

          {/* Indicadores de Confiança */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#E5E5E5]">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#B5121B]" />
              <span>Assessoria Jurídica Rigorosa</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#B5121B]" />
              <span>Portfólio Selecionado e Verificado</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-[#B5121B]" />
              <span>Visitas Privativas com Especialista</span>
            </span>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. IMÓVEIS EM DESTAQUE                                              */}
      {/* =================================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B5121B]">
              Seleção Especial
            </span>
            <h2 className="font-editorial mt-2 text-3xl font-semibold tracking-tight text-[#242424] sm:text-4xl">
              Imóveis em Destaque
            </h2>
            <p className="mt-2 max-w-xl text-sm sm:text-base text-[#737373]">
              Propriedades selecionadas por sua arquitetura marcante, localização
              consolidada e elevado padrão construtivo.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/imoveis">
              <span>Ver catálogo completo</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {featuredResult.dataSource === "dev_preview" && (
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50/60 px-4 py-3 text-xs text-[#242424]">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-[#B5121B] shrink-0" />
              <span>
                <strong>Demonstração Comercial:</strong> Exibindo acervo demonstrativo preparado para personalização. Os dados reais da imobiliária poderão ser alimentados pelo painel administrativo.
              </span>
            </div>
            <Link
              href="/admin"
              className="font-semibold text-[#B5121B] underline shrink-0"
            >
              Acessar painel administrativo →
            </Link>
          </div>
        )}

        {featuredResult.items.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {featuredResult.items.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-[#E5E5E5] bg-[#F5F5F5] p-12 text-center">
            <Building2 className="mx-auto h-10 w-10 text-[#B5121B] mb-3" />
            <p className="text-sm text-[#737373]">
              Nenhum imóvel em destaque no momento.
            </p>
          </div>
        )}
      </section>

      {/* =================================================================== */}
      {/* 3. IMÓVEIS PARA COMPRAR                                             */}
      {/* =================================================================== */}
      <section className="bg-[#F5F5F5] py-20 border-y border-[#E5E5E5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B5121B]">
                Aquisição Patrimonial
              </span>
              <h2 className="font-editorial mt-2 text-3xl font-semibold tracking-tight text-[#242424] sm:text-4xl">
                Imóveis para Comprar
              </h2>
              <p className="mt-2 max-w-xl text-sm sm:text-base text-[#737373]">
                Residências, coberturas e apartamentos prontos para viver ou investir com valorização sólida.
              </p>
            </div>
            <Button asChild variant="default">
              <Link href="/comprar">
                <span>Ver todos para comprar</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
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
      {/* 4. IMÓVEIS PARA ALUGAR                                              */}
      {/* =================================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B5121B]">
              Locação Residencial & Corporativa
            </span>
            <h2 className="font-editorial mt-2 text-3xl font-semibold tracking-tight text-[#242424] sm:text-4xl">
              Imóveis para Alugar
            </h2>
            <p className="mt-2 max-w-xl text-sm sm:text-base text-[#737373]">
              Opções mobiliadas, coberturas e conjuntos corporativos prontos para ocupação imediata com agilidade contratual.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/alugar">
              <span>Ver todos para alugar</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
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
      {/* 5. EXPLORE POR TIPO DE IMÓVEL                                       */}
      {/* =================================================================== */}
      <section className="bg-[#F5F5F5] py-20 border-y border-[#E5E5E5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B5121B]">
              Tipologias
            </span>
            <h2 className="font-editorial mt-2 text-3xl font-semibold tracking-tight text-[#242424] sm:text-4xl">
              Explore por Tipo de Imóvel
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#737373]">
              Filtre diretamente pelo formato que melhor atende às necessidades da sua família ou empresa.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={category.href}
                className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-2xl border border-[#E5E5E5] bg-[#242424] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B5121B] hover:shadow-xl"
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="font-editorial text-2xl font-semibold text-white">
                      {category.title}
                    </h3>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors group-hover:bg-[#B5121B] group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#E5E5E5]">
                    {category.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. DIFERENCIAIS DO ATENDIMENTO                                      */}
      {/* =================================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B5121B]">
            Excelência Operacional
          </span>
          <h2 className="font-editorial mt-2 text-3xl font-semibold tracking-tight text-[#242424] sm:text-4xl">
            Diferenciais do Atendimento
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#737373]">
            Uma abordagem consultiva focada em segurança, transparência e otimização do seu tempo.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Compass,
              title: "Curadoria Técnica",
              desc: "Avaliação prévia minuciosa de cada propriedade quanto a estado construtivo, insolação e planta.",
            },
            {
              icon: ShieldCheck,
              title: "Segurança Jurídica",
              desc: "Auditoria documental completa (due diligence) em todas as operações de compra e locação.",
            },
            {
              icon: Award,
              title: "Sigilo & Discrição",
              desc: "Opção de ocultar o endereço público do imóvel e visitas com identificação prévia.",
            },
            {
              icon: Clock,
              title: "Agilidade de Resposta",
              desc: "Consultores especializados com retorno rápido via WhatsApp ou telefone oficial.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#E5E5E5] bg-white p-7 shadow-xs hover:border-[#B5121B] transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#B5121B] mb-5">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-editorial text-xl font-semibold text-[#242424]">
                {item.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#737373] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 7. CHAMADA PARA PROPRIETÁRIOS ANUNCIAREM                            */}
      {/* =================================================================== */}
      <section className="bg-[#242424] text-white py-20 border-t border-[#E5E5E5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#242424] to-[#1A1A1A] border border-white/10 p-8 sm:p-14 shadow-2xl">
            <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl space-y-3">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B5121B]">
                  Captação de Imóveis
                </span>
                <h2 className="font-editorial text-3xl sm:text-5xl font-semibold leading-tight text-white">
                  Seu imóvel merece a apresentação certa.
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-[#D4D4D4]">
                  Comercialize ou alugue sua propriedade com produção fotográfica de qualidade, avaliação de mercado fundamentada e direcionamento a clientes qualificados.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button asChild variant="default" size="lg">
                  <Link href="/anunciar">
                    <span>Quero anunciar meu imóvel</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
                {cleanWhatsapp && (
                  <Button asChild variant="outlineLight" size="lg">
                    <a
                      href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                        "Olá! Sou proprietário e gostaria de avaliar/anunciar meu imóvel."
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
        </div>
      </section>

      {/* =================================================================== */}
      {/* 8. FORMULÁRIO DE CONTATO DIRETO NA HOME                             */}
      {/* =================================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B5121B]">
              Atendimento Dedicado
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#242424] leading-tight">
              Fale com um especialista imobiliário
            </h2>
            <p className="text-sm sm:text-base text-[#737373] leading-relaxed">
              Dúvidas sobre documentação, agendamento de visitas ou propostas comerciais? Preencha o formulário e receba nosso contato direto.
            </p>

            <div className="pt-4 space-y-3 text-xs sm:text-sm text-[#242424]">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#B5121B] shrink-0" />
                <span>Atendimento confidencial e em conformidade com a LGPD</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#B5121B] shrink-0" />
                <span>Opções selecionadas de acordo com seu perfil de busca</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#B5121B] shrink-0" />
                <span>Visitas privativas com horário flexível</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-7 sm:p-9 shadow-sm">
              <PublicContactForm
                source="contato_geral"
                submitLabel="Enviar mensagem para o especialista"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER INSTITUCIONAL É RENDERIZADO VIA LAYOUT GLOBAL */}
    </div>
  );
}
