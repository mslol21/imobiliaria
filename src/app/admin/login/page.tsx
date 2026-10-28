"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  AlertCircle,
  ArrowLeft,
  Database,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAdminAction } from "@/actions/auth.actions";

function AdminLoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const redirectTo = searchParams.get("redirectTo") || "/admin";

  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const res = await signInAdminAction(email, password);
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.message);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="min-h-dvh bg-zinc-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar ao site público</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-700 text-white shadow-sm">
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
            <h1 className="text-2xl font-bold text-white">
              Painel Administrativo
            </h1>
            <p className="text-xs text-zinc-400">
              Acesso exclusivo para administradores
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl bg-white p-7 sm:p-9 shadow-2xl border border-zinc-200 space-y-6">
          {statusParam === "supabase_unconfigured" && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <Database className="h-4 w-4 text-amber-800 shrink-0" />
                <span>Configuração do Supabase Pendente</span>
              </div>
              <p className="leading-relaxed">
                Para autenticar administradores e gerenciar dados em produção:
              </p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Preencha <code>.env.local</code> com as chaves do Supabase.</li>
                <li>Execute a migration <code>supabase/migrations/0001_initial_schema.sql</code>.</li>
                <li>Crie o usuário em Authentication e vincule o perfil em <code>public.profiles</code>.</li>
              </ol>
            </div>
          )}

          {statusParam === "unauthorized" && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-900 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-700 shrink-0 mt-0.5" />
              <span>
                Usuário não possui perfil ativo de administrador em <code>public.profiles</code>.
              </span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="admin-email">E-mail corporativo</Label>
              <Input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@admin.com"
              />
            </div>

            <div>
              <Label htmlFor="admin-password">Senha de acesso</Label>
              <Input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-900">
                <AlertCircle className="h-4 w-4 text-red-700 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={loading}
              className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-semibold"
            >
              <Lock className="h-4 w-4" />
              <span>{loading ? "Autenticando..." : "Entrar no painel"}</span>
            </Button>
          </form>

          <div className="border-t border-zinc-100 pt-4 text-center">
            <span className="text-[11px] text-zinc-500 inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-700" />
              <span>Sessão protegida por criptografia e RLS</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-zinc-900 flex items-center justify-center text-white">
          <span>Carregando autenticação...</span>
        </div>
      }
    >
      <AdminLoginFormContent />
    </Suspense>
  );
}
