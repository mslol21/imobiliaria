"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { sanitizePhoneForWhatsApp } from "@/lib/utils";

interface FloatingWhatsAppProps {
  whatsapp: string;
  agencyName: string;
}

export function FloatingWhatsApp({
  whatsapp,
  agencyName,
}: FloatingWhatsAppProps) {
  const cleanPhone = sanitizePhoneForWhatsApp(whatsapp);
  const message = encodeURIComponent(
    agencyName
      ? `Olá! Vim pelo site da ${agencyName} e gostaria de falar com um especialista.`
      : "Olá! Gostaria de falar com um especialista sobre oportunidades imobiliárias."
  );

  if (!cleanPhone) {
    return (
      <Link
        href="/contato"
        aria-label="Fale com um especialista"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#B5121B] px-4 py-3 text-xs font-semibold text-white shadow-xl transition-transform duration-200 hover:scale-105 hover:bg-[#8F0D15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B5121B]"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        <span className="hidden sm:inline">Fale com um especialista</span>
      </Link>
    );
  }

  return (
    <a
      href={`https://wa.me/${cleanPhone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar pelo WhatsApp com um especialista"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#B5121B] px-4 py-3 text-xs font-semibold text-white shadow-xl transition-transform duration-200 hover:scale-105 hover:bg-[#8F0D15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B5121B]"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">Fale com um especialista</span>
    </a>
  );
}
