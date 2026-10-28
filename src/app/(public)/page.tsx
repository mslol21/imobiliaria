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
  title: "Casas e Apartamentos em Guaianases e Zona Leste | Comprar e Alugar",
  description:
    "Veja casas, apartamentos e imóveis comerciais em Guaianases e na Zona Leste de São Paulo. Encontre opções para comprar ou alugar.",
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
      <section className="relative min-h-[520px] lg:min-h-[580px] flex items-center justify-center overflow-hidden bg-slate-950">
        <Image
          src={heroImage}
          alt="Fachada residencial moderna e elegante"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Overlay com tonalidade azul-petróleo e meia-noite */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/30"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-md mb-3">
            <Building2 className="h-3.5 w-3.5 text-cyan-300" />
            <span>Imóveis em Guaianases e Zona Leste</span>
          </span>

          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
            Seu novo imóvel pode estar aqui na Zona Leste.
          </h1>

          <p className="mt-3.5 max-w-2xl text-base leading-relaxed text-zinc-200 sm:text-lg">
            Explore casas, apartamentos e imóveis comerciais em Guaianases e bairros próximos. Pesquise, compare e entre em contato.
          </p>

          {/* Mecanismo de Pesquisa Integrado */}
          <div className="mt-7 w-full flex justify-center">
            <HeroSearchBar
              cities={locations.cities}
              neighborhoods={locations.neighborhoods}
            />
          </div>

          {/* Indicadores de Confiança com Pílulas Coloridas */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1.5 border border-white/20 shadow-xs">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              <span>Busca prática por bairro</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1.5 border border-white/20 shadow-xs">
              <Compass className="h-4 w-4 text-teal-300" />
              <span>Opções de compra e aluguel</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1.5 border border-white/20 shadow-xs">
              <KeyRound className="h-4 w-4 text-amber-300" />
              <span>Contato direto para visitas</span>
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
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
              <Building2 className="h-3.5 w-3.5 text-cyan-700" />
              <span>Seleção Especial</span>
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Imóveis em destaque na região
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-zinc-600">
              Explore imóveis disponíveis e encontre opções para morar ou investir.
            </p>
          </div>
          <Button
            asChild
            variant="default"
            size="sm"
            className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold shadow-sm"
          >
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
          <div className="mt-8 rounded-2xl border border-cyan-100 bg-cyan-50/40 p-10 text-center">
            <Building2 className="mx-auto h-8 w-8 text-cyan-600 mb-2" />
            <p className="text-sm text-zinc-600">
              Nenhum imóvel em destaque no momento.
            </p>
          </div>
        )}
      </section>

      {/* =================================================================== */}
      {/* 4. IMÓVEIS PARA COMPRAR                                             */}
      {/* =================================================================== */}
      <section className="bg-zinc-50 py-16 border-y border-cyan-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-700 text-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow-xs">
                Venda
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
                Imóveis para Comprar
              </h2>
              <p className="mt-1.5 max-w-xl text-sm text-zinc-600">
                Explore oportunidades de compra em Guaianases e em outros bairros da zona leste.
              </p>
            </div>
            <Button
              asChild
              variant="default"
              size="sm"
              className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold shadow-xs"
            >
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
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 text-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow-xs">
                Locação
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
                Imóveis para Alugar
              </h2>
              <p className="mt-1.5 max-w-xl text-sm text-zinc-600">
                Veja imóveis para alugar em Guaianases e nos bairros próximos.
              </p>
            </div>
            <Button
              asChild
              variant="default"
              size="sm"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-xs"
            >
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
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. CATEGORIAS DE IMÓVEIS                                            */}
      {/* =================================================================== */}
      <section className="bg-zinc-900 text-white py-20 relative overflow-hidden border-y border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
              Tipologias
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Categorias de Imóveis
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Explore por tipo de imóvel e encontre a configuração mais adequada para o seu dia a dia.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={category.href}
                className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-2xl border border-cyan-900/50 bg-slate-900 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-cyan-900/20"
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent"
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {category.title}
                    </h3>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-xs transition-colors group-hover:bg-cyan-700 group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-200 line-clamp-1">
                    {category.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 7. SOBRE A IMOBILIÁRIA (4 DIFERENCIAIS COLORIDOS)                   */}
      {/* =================================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            Sobre Nós
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
            {settings.about_title || "Consultoria Imobiliária com Segurança e Clareza"}
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Informações claras e contato acessível para ajudar você a encontrar o imóvel que procura na região.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Compass,
              title: "Atendimento personalizado",
              desc: "Encontre opções adequadas às suas necessidades de localização, espaço e orçamento.",
              cardBg: "bg-white border-cyan-200/80 hover:border-cyan-400 hover:shadow-cyan-900/10",
              iconBg: "bg-cyan-700 text-white shadow-sm shadow-cyan-600/30",
              titleColor: "text-cyan-950",
            },
            {
              icon: ShieldCheck,
              title: "Segurança Jurídica",
              desc: "Informações claras para você avaliar cada oportunidade com tranquilidade.",
              cardBg: "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-zinc-900/5",
              iconBg: "bg-cyan-700 text-white shadow-sm shadow-emerald-600/30",
              titleColor: "text-zinc-900",
            },
            {
              icon: KeyRound,
              title: "Atendimento Consultivo",
              desc: "Acompanhamento dedicado e personalizado para entender suas reais prioridades e necessidades.",
              cardBg: "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-zinc-900/5",
              iconBg: "bg-cyan-700 text-white shadow-sm shadow-indigo-600/30",
              titleColor: "text-zinc-900",
            },
            {
              icon: Clock,
              title: "Agilidade e Resposta",
              desc: "Entre em contato para esclarecer dúvidas e combinar uma visita.",
              cardBg: "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-zinc-900/5",
              iconBg: "bg-cyan-700 text-white shadow-sm shadow-amber-600/30",
              titleColor: "text-zinc-900",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`rounded-2xl border p-6 shadow-xs hover:-translate-y-1 transition-all duration-300 ${item.cardBg}`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${item.iconBg}`}>
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className={`text-lg font-bold ${item.titleColor}`}>
                {item.title}
              </h3>
              <p className="mt-2 text-xs text-zinc-600 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 8. CHAMADA PARA ANUNCIAR UM IMÓVEL (OCEANO PROFUNDO & DESTAQUE)     */}
      {/* =================================================================== */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-900 text-white p-8 sm:p-14 shadow-2xl border border-zinc-700">
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
                Proprietários
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Tem um imóvel em Guaianases ou na Zona Leste?
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-slate-200">
                Entre em contato para saber como apresentar seu imóvel a pessoas que procuram comprar ou alugar na região.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                asChild
                variant="default"
                size="lg"
                className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold shadow-lg shadow-cyan-900/30 border-0"
              >
                <Link href="/anunciar">
                  <span>Anunciar meu imóvel</span>
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              {cleanWhatsapp && (
                <Button
                  asChild
                  variant="default"
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-950/30 border-0"
                >
                  <a
                    href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                      "Olá! Sou proprietário e gostaria de conversar com um corretor sobre anunciar meu imóvel."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Falar no WhatsApp</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 9. CONTATO COM CANAIS COLORIDOS                                     */}
      {/* =================================================================== */}
      <section className="bg-zinc-50 py-16 border-t border-cyan-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
                Atendimento
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 leading-tight">
                Fale com um corretor
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Tire dúvidas sobre documentação, agendamento de visitas ou propostas comerciais. Preencha o formulário e entraremos em contato rapidamente.
              </p>

              <div className="pt-4 space-y-3.5 text-sm text-zinc-800">
                {settings.phone && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-800 border border-cyan-200/80 shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{settings.phone}</span>
                  </div>
                )}
                {settings.whatsapp && cleanWhatsapp && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200/80 shrink-0">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <a
                      href={`https://wa.me/${cleanWhatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-emerald-900 hover:text-emerald-700 hover:underline transition-colors"
                    >
                      WhatsApp: {settings.whatsapp}
                    </a>
                  </div>
                )}
                {settings.email && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-800 border border-indigo-200/80 shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{settings.email}</span>
                  </div>
                )}
                {settings.address_line && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 border border-amber-200/80 shrink-0 mt-0.5">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="font-medium">
                      {settings.address_line}
                      {settings.city ? ` — ${settings.city}/${settings.state}` : ""}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 space-y-2 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Atendimento confidencial e em conformidade com a LGPD</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-600 shrink-0" />
                  <span>Opções selecionadas de acordo com o seu perfil</span>
                </div>
              </div>
            </div>

            {/* Formulário Funcional */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-cyan-100 bg-white p-6 sm:p-8 shadow-xl shadow-cyan-900/5">
                <PublicContactForm source="contato_geral" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}