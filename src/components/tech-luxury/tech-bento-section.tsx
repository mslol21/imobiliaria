"use client";

import React from "react";
import {
  ShieldCheck,
  Cpu,
  Sparkles,
  Plane,
  Leaf,
  Wifi,
  Lock,
  Compass,
} from "lucide-react";
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";

export function TechBentoSection() {
  return (
    <section id="diferenciais" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header da Seção */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3.5 py-1 text-xs font-mono text-cyan-300 mb-4">
          <Cpu className="h-3.5 w-3.5 text-cyan-400" />
          <span>TECNOLOGIA & LIFESTYLE PRIVATIVO</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Diferenciais de Alta Engenharia
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 font-light">
          Propriedades selecionadas segundo rigorosos critérios de segurança
          cibernética, automação predial integrada e arquitetura bioclimática.
        </p>
      </div>

      {/* Bento Grid */}
      <BentoGrid>
        {/* Card 1: Automação Residencial Total (Ocupa 2 colunas no desktop) */}
        <BentoCard
          className="md:col-span-2"
          icon={<Cpu className="h-6 w-6" />}
          badge="IoT & Automação Inteligente"
          title="Infraestrutura Residencial 100% Conectada"
          description="Sistemas de climatização VRF, iluminação biodinâmica de acordo com o ciclo circadiano, sonorização por zonas e persianas motorizadas com controle unificado por voz ou smartphone."
        >
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
              <span className="text-[11px] font-mono text-cyan-400 block">
                Iluminação DALI
              </span>
              <span className="text-xs text-zinc-400">
                Cenas pré-programadas
              </span>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
              <span className="text-[11px] font-mono text-cyan-400 block">
                Climatização Daikin
              </span>
              <span className="text-xs text-zinc-400">
                Sensores térmicos IA
              </span>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-mono text-cyan-400 block">
                Rede Wi-Fi 7 Mesh
              </span>
              <span className="text-xs text-zinc-400">
                100% de cobertura
              </span>
            </div>
          </div>
        </BentoCard>

        {/* Card 2: Segurança & Biometria */}
        <BentoCard
          icon={<ShieldCheck className="h-6 w-6" />}
          badge="Segurança Máxima"
          title="Guarita Blindada & Biometria Facial"
          description="Controle de acesso por biometria e reconhecimento facial em elevadores sociais e eclusas de segurança com monitoramento 24h."
        />

        {/* Card 3: Mobilidade VIP & Heliponto */}
        <BentoCard
          icon={<Plane className="h-6 w-6" />}
          badge="Acessibilidade Aérea"
          title="Heliponto Homologado & Supercar Garage"
          description="Acesso direto ao heliponto com sala VIP climatizada e vagas preparadas para supercarros com estações de recarga rápida de 22kW."
        />

        {/* Card 4: Sustentabilidade & Eficiência (Ocupa 2 colunas no desktop) */}
        <BentoCard
          className="md:col-span-2"
          icon={<Leaf className="h-6 w-6" />}
          badge="Certificação LEED Gold / Platinum"
          title="Arquitetura Sustentável & Eficiência A+"
          description="Captação e filtragem de água pluvial para irrigação automática, vidros duplos com tratamento low-e para isolamento térmico e acústico, e geração fotovoltaica com bateria reserva."
        >
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "Vidros Low-E Acústicos",
              "Energia Solar Dedicada",
              "Reuso de Águas Cinzas",
              "Telhado Verde Termoacústico",
            ].map((tag, i) => (
              <span
                key={i}
                className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 px-2.5 py-1 text-xs text-emerald-300"
              >
                ✓ {tag}
              </span>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>
    </section>
  );
}
