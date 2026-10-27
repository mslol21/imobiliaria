import React from "react";
import Link from "next/link";
import { Building2, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70dvh] bg-[#F5F1E9] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#183B35] text-[#B79A68] shadow-lg">
          <Building2 className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B79A68]">
            Página Não Encontrada • Erro 404
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#183B35]">
            Propriedade ou Página Inexistente
          </h1>
          <p className="text-sm text-[#5C5B57] leading-relaxed">
            O endereço informado pode ter sido alterado, o anúncio despublicado
            ou o imóvel já comercializado.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild variant="default">
            <Link href="/">
              <Home className="h-4 w-4 text-[#B79A68]" />
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
