import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { getSiteSettings } from "@/services/settings.service";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-dvh flex-col bg-white text-zinc-900 selection:bg-cyan-100 selection:text-cyan-950">
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <FloatingWhatsApp
        whatsapp={settings.whatsapp}
        agencyName={settings.agency_name}
      />
    </div>
  );
}
