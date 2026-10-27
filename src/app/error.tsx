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
    <div className="min-h-[60dvh] bg-[#F5F1E9] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full rounded-2xl border border-[#E2DBD0] bg-white p-8 text-center shadow-lg space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-700">
          <AlertCircle className="h-7 w-7" />
        </div>

        <div>
          <h2 className="font-editorial text-2xl font-semibold text-[#183B35]">
            Ocorreu uma instabilidade temporária
          </h2>
          <p className="mt-2 text-xs text-[#5C5B57]">
            Nossa equipe técnica já foi notificada. Você pode tentar recarregar a
            página.
          </p>
        </div>

        <Button type="button" variant="default" onClick={() => reset()} className="w-full">
          <RotateCcw className="h-4 w-4 text-[#B79A68]" />
          <span>Tentar novamente</span>
        </Button>
      </div>
    </div>
  );
}
