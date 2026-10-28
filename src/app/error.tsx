"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro na aplicação:", error);
  }, [error]);

  return (
    <div className="min-h-[60dvh] bg-zinc-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-md space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-700 border border-red-200">
          <AlertCircle className="h-7 w-7" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-zinc-900">
            Ocorreu uma instabilidade temporária
          </h2>
          <p className="mt-2 text-xs text-zinc-600">
            Nossa equipe técnica já foi notificada. Você pode tentar recarregar a página.
          </p>
        </div>

        <Button type="button" variant="default" onClick={() => reset()} className="w-full">
          <RotateCcw className="h-4 w-4" />
          <span>Tentar novamente</span>
        </Button>
      </div>
    </div>
  );
}
