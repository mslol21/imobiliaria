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
  { href: "/imoveis", label: "Imóveis" },
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
        "Olá! Gostaria de falar com um corretor sobre oportunidades imobiliárias."
      )}`
    : "/contato";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-cyan-100"
          : "bg-white/90 backdrop-blur-xs border-b border-zinc-200/80"
      )}
    >
      {/* Barra de Acento Colorida de Topo */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-600 via-teal-500 to-cyan-700" />

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Símbolo Imobiliário */}
        <Link
          href="/"
          className="group flex items-center gap-3 focus-visible:outline-none"
          aria-label="Página Inicial da Plataforma Imobiliária"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-700 to-teal-800 text-white shadow-md shadow-cyan-900/20 transition-all duration-200 group-hover:from-cyan-600 group-hover:to-teal-700 group-hover:scale-105">
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
          {settings.agency_name ? (
            <span className="font-sans text-lg font-bold tracking-tight text-zinc-900">
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
                  "relative rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-cyan-700 font-semibold"
                    : "text-zinc-700 hover:text-cyan-700 hover:bg-zinc-100"
                )}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute inset-x-3.5 -bottom-1 h-0.5 rounded-full bg-cyan-700"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Ações Desktop: Botão de destaque "Fale com um corretor" */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <Link
            href="/anunciar"
            className="rounded-lg px-3 py-2 text-xs font-semibold text-cyan-800 bg-cyan-50/80 hover:bg-cyan-100 border border-cyan-200/80 transition-colors"
          >
            Anunciar Imóvel
          </Link>

          <Button
            asChild
            variant="default"
            size="default"
            className="bg-gradient-to-r from-cyan-600 via-cyan-700 to-teal-700 hover:from-cyan-700 hover:to-teal-800 text-white font-semibold shadow-md shadow-cyan-900/15 border-0"
          >
            <a
              href={contactHref}
              target={cleanWhatsapp ? "_blank" : undefined}
              rel={cleanWhatsapp ? "noopener noreferrer" : undefined}
            >
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              <span>Fale com um corretor</span>
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
              <X className="h-6 w-6 text-zinc-800" />
            ) : (
              <Menu className="h-6 w-6 text-zinc-800" />
            )}
          </Button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="border-t border-zinc-200 bg-white px-4 pt-3 pb-6 shadow-xl lg:hidden"
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
                      ? "bg-cyan-50 text-cyan-800 font-semibold"
                      : "text-zinc-800 hover:bg-zinc-100"
                  )}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-cyan-700" />
                  )}
                </Link>
              );
            })}
            <Link
              href="/anunciar"
              className="flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-cyan-700 hover:bg-zinc-100"
            >
              <span>Quero anunciar meu imóvel</span>
              <ArrowUpRight className="h-4 w-4 text-cyan-700" />
            </Link>
          </nav>

          <div className="mt-5 flex flex-col gap-2.5 border-t border-zinc-200 pt-4">
            <Button asChild variant="default" size="lg" className="w-full">
              <a
                href={contactHref}
                target={cleanWhatsapp ? "_blank" : undefined}
                rel={cleanWhatsapp ? "noopener noreferrer" : undefined}
              >
                <PhoneCall className="h-4 w-4" />
                <span>Fale com um corretor</span>
              </a>
            </Button>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-1.5 py-2 text-xs text-zinc-500 hover:text-cyan-700"
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
