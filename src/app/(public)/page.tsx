import React from "react";
import type { Metadata } from "next";
import { TechLuxuryExperience } from "@/components/tech-luxury/tech-luxury-experience";

export const metadata: Metadata = {
  title: "Plataforma Private | High-End Real Estate & Tech-Luxury",
  description:
    "Curadoria de imóveis de alto padrão e luxo arquitetônico. Coberturas, mansões e penthouses com tour virtual 360°, inteligência de dados e atendimento concierge VIP.",
  openGraph: {
    title: "Plataforma Private | High-End Real Estate & Tech-Luxury",
    description:
      "Curadoria de imóveis de alto padrão e luxo arquitetônico com tour 360° e tecnologia predial de ponta.",
    type: "website",
  },
};

export default function HomePage() {
  return <TechLuxuryExperience />;
}
