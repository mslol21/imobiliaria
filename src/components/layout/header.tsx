"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  PhoneCall,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, sanitizePhoneForWhatsApp } from "@/lib/utils";
import type { SiteSettings } from "@/types/domain";

interface HeaderProps {
  settings: SiteSettings;
}

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/comprar", label: "Comprar" },
  { href: "/alugar", label: "Alugar" },
  { href: "/sobre", label: "Sobre nós" },
  { href: "/contato", label: "Contato" },
];

export function Header({ settings }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const cleanWhatsapp = sanitizePhoneForWhatsApp(settings.whatsapp);
  const contactHref = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        "Olá! Gostaria de falar com um especialista sobre oportunidades imobiliárias."
      )}`
    : "/contato";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-b border-[#E5E5E5]"
          : "bg-white/90 backdrop-blur-sm border-b border-[#E5E5E5]/70"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Símbolo Imobiliário Minimalista (sem texto/sem nome inventado) */}
        <Link
          href="/"
          className="group flex items-center gap-3 focus-visible:outline-none"
          aria-label="Página Inicial da Plataforma Imobiliária"
        >
          {/* Ícone Arquitetônico Minimalista Geométrico */}
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#B5121B] text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <svg
              className="h-6 w-6 fill-none stroke-current stroke-[2.2]"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {/* Fachada arquitetônica minimalista contemporânea */}
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
            </svg>
          </div>
          {settings.agency_name ? (
            <span className="font-editorial text-xl font-bold tracking-tight text-[#242424]">
              {settings.agency_name}
            </span>
          ) : (
            <span className="sr-only">Início</span>
          )}
        </Link>

        {/* Navegação Desktop */}
        <nav
          className="hidden lg:flex lg:items-center lg:gap-1"
          aria-label="Navegação principal"
        >
          {NAV_LINKS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-[#B5121B] font-semibold"
                    : "text-[#242424]/80 hover:text-[#B5121B] hover:bg-[#B5121B]/5"
                )}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-[#B5121B]"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Ações Desktop: Botão destacado "Fale com um especialista" */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <Link
            href="/anunciar"
            className="text-xs font-semibold uppercase tracking-wider text-[#242424] hover:text-[#B5121B] transition-colors px-2 py-1"
          >
            Anunciar Imóvel
          </Link>

          <Button asChild variant="default" size="default">
            <a
              href={contactHref}
              target={cleanWhatsapp ? "_blank" : undefined}
              rel={cleanWhatsapp ? "noopener noreferrer" : undefined}
            >
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              <span>Fale com um especialista</span>
              {cleanWhatsapp && (
                <ArrowUpRight className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
              )}
            </a>
          </Button>
        </div>

        {/* Botão Menu Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-[#242424]" />
            ) : (
              <Menu className="h-6 w-6 text-[#242424]" />
            )}
          </Button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="border-t border-[#E5E5E5] bg-white px-4 pt-3 pb-6 shadow-xl lg:hidden"
        >
          <nav className="flex flex-col space-y-1" aria-label="Menu móvel">
            {NAV_LINKS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors",
                    isActive
                      ? "bg-red-50 text-[#B5121B] font-semibold"
                      : "text-[#242424] hover:bg-[#F5F5F5]"
                  )}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-[#B5121B]" />
                  )}
                </Link>
              );
            })}
            <Link
              href="/anunciar"
              className="flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-[#B5121B] hover:bg-[#F5F5F5]"
            >
              <span>Quero anunciar meu imóvel</span>
              <ArrowUpRight className="h-4 w-4 text-[#B5121B]" />
            </Link>
          </nav>

          <div className="mt-5 flex flex-col gap-2.5 border-t border-[#E5E5E5] pt-4">
            <Button asChild variant="default" size="lg" className="w-full">
              <a
                href={contactHref}
                target={cleanWhatsapp ? "_blank" : undefined}
                rel={cleanWhatsapp ? "noopener noreferrer" : undefined}
              >
                <PhoneCall className="h-4 w-4" />
                <span>Fale com um especialista</span>
              </a>
            </Button>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-1.5 py-2 text-xs text-[#737373] hover:text-[#B5121B]"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Painel Administrativo</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
