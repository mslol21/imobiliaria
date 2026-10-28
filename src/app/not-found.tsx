import React from "react";
import Link from "next/link";
import { Building2, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70dvh] bg-zinc-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-cyan-400 shadow-md">
          <Building2 className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
            Página Não Encontrada • Erro 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
            Propriedade ou Página Inexistente
          </h1>
          <p className="text-sm text-zinc-600 leading-relaxed">
            O endereço informado pode ter sido alterado, o anúncio despublicado
            ou o imóvel já comercializado.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild variant="default">
            <Link href="/">
              <Home className="h-4 w-4" />
              <span>Ir para a Página Inicial</span>
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/imoveis">
              <ArrowLeft className="h-4 w-4" />
              <span>Ver Portfólio de Imóveis</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
