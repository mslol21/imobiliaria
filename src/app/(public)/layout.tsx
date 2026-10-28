import React from "react";
import { TechLuxuryProvider } from "@/context/tech-luxury-context";
import { TechHeader } from "@/components/tech-luxury/tech-header";
import { TechFooter } from "@/components/tech-luxury/tech-footer";
import {
  TechFloatingCTA,
  TechQuickScheduler,
} from "@/components/tech-luxury/tech-quick-scheduler";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TechLuxuryProvider>
      <div className="flex min-h-dvh flex-col bg-zinc-950 text-zinc-100 overflow-x-hidden selection:bg-cyan-500 selection:text-zinc-950">
        <TechHeader />
        <main className="flex-1">{children}</main>
        <TechFooter />
        <TechFloatingCTA />
        <TechQuickScheduler />
      </div>
    </TechLuxuryProvider>
  );
}
