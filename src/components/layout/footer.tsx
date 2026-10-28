import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  Clock,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
} from "lucide-react";
import { sanitizePhoneForWhatsApp } from "@/lib/utils";
import type { SiteSettings } from "@/types/domain";

interface FooterProps {
  settings: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const cleanWhatsapp = sanitizePhoneForWhatsApp(settings.whatsapp);

  return (
    <footer className="bg-slate-950 text-slate-300 border-t-4 border-cyan-700 relative">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Coluna 1: Símbolo e Descrição */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-700 to-teal-800 text-white shadow-md shadow-cyan-950/40">
                <svg
                  className="h-6 w-6 fill-none stroke-current stroke-[2.2]"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"
                  />
                </svg>
              </div>
              <div>
                <span className="font-sans text-xl font-bold tracking-tight text-white block leading-none">
                  {settings.agency_name || "Consultoria Imobiliária"}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-cyan-400 font-semibold mt-1 block">
                  Imóveis Selecionados
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              {settings.agency_slogan ||
                "Explore oportunidades para comprar ou alugar com segurança, transparência e atendimento especializado."}
            </p>

            {/* CRECI */}
            <div className="pt-2">
              {settings.creci ? (
                <div className="inline-flex items-center gap-2 rounded-lg border border-cyan-900/50 bg-cyan-950/40 px-3 py-1.5 text-xs text-cyan-200">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  <span>Registro Profissional: {settings.creci}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-lg border border-cyan-900/40 bg-cyan-950/30 px-3 py-1.5 text-xs text-cyan-300">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  <span>Informações cadastrais personalizáveis no painel</span>
                </div>
              )}
            </div>

            {/* Redes Sociais */}
            {(settings.instagram_url ||
              settings.linkedin_url ||
              settings.youtube_url ||
              settings.facebook_url) && (
              <div className="flex items-center gap-3 pt-2">
                {settings.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {settings.linkedin_url && (
                  <a
                    href={settings.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {settings.youtube_url && (
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                  >
                    <Youtube className="h-4 w-4" />
                  </a>
                )}
                {settings.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-sans">
              Navegação
            </h3>
            <ul className="space-y-2.5 text-sm text-zinc-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/comprar" className="hover:text-white transition-colors">
                  Comprar
                </Link>
              </li>
              <li>
                <Link href="/alugar" className="hover:text-white transition-colors">
                  Alugar
                </Link>
              </li>
              <li>
                <Link href="/imoveis" className="hover:text-white transition-colors">
                  Imóveis
                </Link>
              </li>
              <li>
                <Link href="/anunciar" className="hover:text-white transition-colors">
                  Anunciar Imóvel
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-white transition-colors">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Categorias */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-sans">
              Categorias
            </h3>
            <ul className="space-y-2.5 text-sm text-zinc-300">
              <li>
                <Link
                  href="/imoveis?tipo=apartamento"
                  className="hover:text-white transition-colors"
                >
                  Apartamentos
                </Link>
              </li>
              <li>
                <Link
                  href="/imoveis?tipo=casa"
                  className="hover:text-white transition-colors"
                >
                  Casas
                </Link>
              </li>
              <li>
                <Link
                  href="/imoveis?tipo=condominio"
                  className="hover:text-white transition-colors"
                >
                  Casas em Condomínio
                </Link>
              </li>
              <li>
                <Link
                  href="/imoveis?tipo=cobertura"
                  className="hover:text-white transition-colors"
                >
                  Coberturas
                </Link>
              </li>
              <li>
                <Link
                  href="/imoveis?tipo=comercial"
                  className="hover:text-white transition-colors"
                >
                  Imóveis Comerciais
                </Link>
              </li>
              <li>
                <Link
                  href="/imoveis?altoPadrao=true"
                  className="hover:text-white transition-colors"
                >
                  Alto Padrão
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Atendimento */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-sans">
              Atendimento & Contato
            </h3>

            <ul className="space-y-3 text-sm text-zinc-300">
              {settings.address_line ? (
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-cyan-400 shrink-0 mt-1" />
                  <span>
                    {settings.address_line}
                    {settings.city ? ` — ${settings.city}/${settings.state}` : ""}
                    {settings.zip_code ? ` • CEP ${settings.zip_code}` : ""}
                  </span>
                </li>
              ) : (
                <li className="flex items-start gap-3 text-zinc-400">
                  <MapPin className="h-4 w-4 text-cyan-400 shrink-0 mt-1" />
                  <span>
                    {settings.city}/{settings.state} • Atendimento presencial com agendamento
                  </span>
                </li>
              )}

              {settings.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-cyan-400 shrink-0" />
                  <a
                    href={`tel:${settings.phone.replace(/\D/g, "")}`}
                    className="hover:text-white transition-colors"
                  >
                    {settings.phone}
                  </a>
                </li>
              )}

              {settings.whatsapp && cleanWhatsapp && (
                <li className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-cyan-400 shrink-0" />
                  <a
                    href={`https://wa.me/${cleanWhatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp: {settings.whatsapp}
                  </a>
                </li>
              )}

              {settings.email && (
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-cyan-400 shrink-0" />
                  <a
                    href={`mailto:${settings.email}`}
                    className="hover:text-white transition-colors"
                  >
                    {settings.email}
                  </a>
                </li>
              )}

              {settings.business_hours && (
                <li className="flex items-start gap-3 text-xs text-zinc-400 pt-1">
                  <Clock className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{settings.business_hours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Linha Inferior */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 text-xs text-zinc-400 sm:flex-row">
          <p>
            © {currentYear} {settings.agency_name || "Plataforma Imobiliária"}. Todos os direitos reservados.
            {settings.cnpj ? ` • CNPJ: ${settings.cnpj}` : ""}
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/privacidade"
              className="hover:text-white transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link href="/contato" className="hover:text-white transition-colors">
              Fale Conosco
            </Link>
            <Link href="/admin" className="hover:text-white transition-colors">
              Área Administrativa
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
