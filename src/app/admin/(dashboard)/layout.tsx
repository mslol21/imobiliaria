import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Home,
  PlusCircle,
  Users,
  Settings,
  Image as ImageIcon,
  ExternalLink,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { requireAuthenticatedAdmin } from "@/lib/supabase/admin-guard";
import { signOutAdminAction } from "@/actions/auth.actions";

const ADMIN_NAV = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/imoveis",
    label: "Imóveis",
    icon: Home,
  },
  {
    href: "/admin/imoveis/novo",
    label: "Novo Imóvel",
    icon: PlusCircle,
  },
  {
    href: "/admin/interessados",
    label: "Interessados (CRM)",
    icon: Users,
  },
  {
    href: "/admin/banners",
    label: "Banners & Hero",
    icon: ImageIcon,
  },
  {
    href: "/admin/configuracoes",
    label: "Configurações",
    icon: Settings,
  },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAuthenticatedAdmin();

  return (
    <div className="min-h-dvh bg-[#F5F5F5] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 lg:shrink-0 bg-[#242424] text-white flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/30">
        <div>
          <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#B5121B] text-white shadow-sm">
                <svg
                  className="h-5 w-5 fill-none stroke-current stroke-[2.2]"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
                </svg>
              </div>
              <div>
                <span className="font-editorial text-lg font-semibold block leading-none">
                  Gestão Imobiliária
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#B5121B] font-semibold">
                  Painel Privado
                </span>
              </div>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="lg:hidden inline-flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1.5 text-xs text-white"
            >
              <span>Ver site</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <nav
            aria-label="Menu administrativo"
            className="flex lg:flex-col gap-1 overflow-x-auto p-3 lg:p-4"
          >
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#D4D4D4] hover:bg-white/10 hover:text-white transition-colors"
              >
                <item.icon className="h-4 w-4 text-[#B5121B] shrink-0" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="hidden lg:block p-4 border-t border-white/10 space-y-3">
          <div className="rounded-xl bg-white/5 p-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[#B5121B]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="truncate">{admin.fullName}</span>
            </div>
            <p className="text-[11px] text-[#A3A3A3] truncate mt-0.5">
              {admin.email}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-[#D4D4D4] hover:bg-white/10 hover:text-white"
            >
              <span>Visualizar site público</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <form action={signOutAdminAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-300 hover:bg-red-950/40 hover:text-red-200 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Encerrar sessão</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
