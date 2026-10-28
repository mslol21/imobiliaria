"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  SlidersHorizontal,
  RotateCcw,
  Search,
  X,
  Check,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  COMMON_AMENITIES,
  PROPERTY_TYPE_LABELS,
  SORT_OPTION_LABELS,
} from "@/config/design-tokens";
import { cn } from "@/lib/utils";
import type {
  PropertyFilters,
  PropertySortOption,
  PropertyType,
} from "@/types/domain";

interface PropertyFiltersBarProps {
  initialFilters: PropertyFilters;
  lockedPurpose?: "venda" | "aluguel";
  totalResults: number;
  cities: string[];
  neighborhoods: string[];
}

export function PropertyFiltersBar({
  initialFilters,
  lockedPurpose,
  totalResults,
  cities,
  neighborhoods,
}: PropertyFiltersBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showAdvancedDesktop, setShowAdvancedDesktop] = useState(false);

  const [finalidade, setFinalidade] = useState<string>(
    lockedPurpose ?? initialFilters.finalidade ?? "todos"
  );
  const [tipo, setTipo] = useState<string>(initialFilters.tipo ?? "todos");
  const [cidade, setCidade] = useState<string>(initialFilters.cidade ?? "");
  const [bairro, setBairro] = useState<string>(initialFilters.bairro ?? "");
  const [busca, setBusca] = useState<string>(initialFilters.busca ?? "");
  const [precoMin, setPrecoMin] = useState<string>(
    initialFilters.precoMin ? String(initialFilters.precoMin) : ""
  );
  const [precoMax, setPrecoMax] = useState<string>(
    initialFilters.precoMax ? String(initialFilters.precoMax) : ""
  );
  const [areaMin, setAreaMin] = useState<string>(
    initialFilters.areaMin ? String(initialFilters.areaMin) : ""
  );
  const [areaMax, setAreaMax] = useState<string>(
    initialFilters.areaMax ? String(initialFilters.areaMax) : ""
  );
  const [dormitorios, setDormitorios] = useState<number>(
    initialFilters.dormitorios ?? 0
  );
  const [suites, setSuites] = useState<number>(initialFilters.suites ?? 0);
  const [banheiros, setBanheiros] = useState<number>(
    initialFilters.banheiros ?? 0
  );
  const [vagas, setVagas] = useState<number>(initialFilters.vagas ?? 0);
  const [mobiliado, setMobiliado] = useState<boolean>(
    Boolean(initialFilters.mobiliado)
  );
  const [aceitaAnimais, setAceitaAnimais] = useState<boolean>(
    Boolean(initialFilters.aceitaAnimais)
  );
  const [altoPadrao, setAltoPadrao] = useState<boolean>(
    Boolean(initialFilters.altoPadrao)
  );
  const [comodidades, setComodidades] = useState<string[]>(
    initialFilters.comodidades ?? []
  );
  const [ordenar, setOrdenar] = useState<PropertySortOption>(
    initialFilters.ordenar ?? "recentes"
  );

  function toggleAmenity(amenity: string) {
    setComodidades((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  }

  function applyFilters(overrideSort?: PropertySortOption) {
    const params = new URLSearchParams();
    const activeSort = overrideSort ?? ordenar;

    if (!lockedPurpose && finalidade && finalidade !== "todos") {
      params.set("finalidade", finalidade);
    }
    if (tipo && tipo !== "todos") params.set("tipo", tipo);
    if (cidade.trim()) params.set("cidade", cidade.trim());
    if (bairro.trim()) params.set("bairro", bairro.trim());
    if (busca.trim()) params.set("busca", busca.trim());
    if (precoMin && Number(precoMin) > 0) params.set("precoMin", precoMin);
    if (precoMax && Number(precoMax) > 0) params.set("precoMax", precoMax);
    if (areaMin && Number(areaMin) > 0) params.set("areaMin", areaMin);
    if (areaMax && Number(areaMax) > 0) params.set("areaMax", areaMax);
    if (dormitorios > 0) params.set("dormitorios", String(dormitorios));
    if (suites > 0) params.set("suites", String(suites));
    if (banheiros > 0) params.set("banheiros", String(banheiros));
    if (vagas > 0) params.set("vagas", String(vagas));
    if (mobiliado) params.set("mobiliado", "true");
    if (aceitaAnimais) params.set("aceitaAnimais", "true");
    if (altoPadrao) params.set("altoPadrao", "true");
    if (comodidades.length > 0) {
      params.set("comodidades", comodidades.join(","));
    }
    if (activeSort && activeSort !== "recentes") {
      params.set("ordenar", activeSort);
    }

    setMobileDrawerOpen(false);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function clearAllFilters() {
    setFinalidade(lockedPurpose ?? "todos");
    setTipo("todos");
    setCidade("");
    setBairro("");
    setBusca("");
    setPrecoMin("");
    setPrecoMax("");
    setAreaMin("");
    setAreaMax("");
    setDormitorios(0);
    setSuites(0);
    setBanheiros(0);
    setVagas(0);
    setMobiliado(false);
    setAceitaAnimais(false);
    setAltoPadrao(false);
    setComodidades([]);
    setOrdenar("recentes");
    setMobileDrawerOpen(false);
    router.push(pathname);
  }

  const activeFilterCount = [
    !lockedPurpose && finalidade !== "todos",
    tipo !== "todos",
    Boolean(cidade.trim()),
    Boolean(bairro.trim()),
    Boolean(busca.trim()),
    Boolean(precoMin),
    Boolean(precoMax),
    Boolean(areaMin),
    Boolean(areaMax),
    dormitorios > 0,
    suites > 0,
    banheiros > 0,
    vagas > 0,
    mobiliado,
    aceitaAnimais,
    altoPadrao,
    comodidades.length > 0,
  ].filter(Boolean).length;

  const renderFilterFields = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {!lockedPurpose && (
          <div>
            <Label htmlFor="filter-purpose">Finalidade</Label>
            <select
              id="filter-purpose"
              value={finalidade}
              onChange={(e) => setFinalidade(e.target.value)}
              className="h-11 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm text-[#242424] focus:border-cyan-600 focus:outline-none"
            >
              <option value="todos">Venda e Locação</option>
              <option value="venda">Comprar</option>
              <option value="aluguel">Alugar</option>
            </select>
          </div>
        )}

        <div>
          <Label htmlFor="filter-type">Tipo de Imóvel</Label>
          <select
            id="filter-type"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="h-11 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm text-[#242424] focus:border-cyan-600 focus:outline-none"
          >
            <option value="todos">Todos os tipos</option>
            {(Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[]).map((key) => (
              <option key={key} value={key}>
                {PROPERTY_TYPE_LABELS[key]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="filter-city">Cidade</Label>
          <Input
            id="filter-city"
            list="filter-cities-list"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Ex: São Paulo"
          />
          <datalist id="filter-cities-list">
            {cities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div>
          <Label htmlFor="filter-neighborhood">Bairro</Label>
          <Input
            id="filter-neighborhood"
            list="filter-neighborhoods-list"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            placeholder="Ex: Jardim Paulista"
          />
          <datalist id="filter-neighborhoods-list">
            {neighborhoods.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
        </div>
      </div>

      {/* Faixas de Preço e Área */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="filter-price-min">Valor mínimo (R$)</Label>
          <Input
            id="filter-price-min"
            type="number"
            min={0}
            step={50000}
            value={precoMin}
            onChange={(e) => setPrecoMin(e.target.value)}
            placeholder="Ex: 500000"
          />
        </div>
        <div>
          <Label htmlFor="filter-price-max">Valor máximo (R$)</Label>
          <Input
            id="filter-price-max"
            type="number"
            min={0}
            step={50000}
            value={precoMax}
            onChange={(e) => setPrecoMax(e.target.value)}
            placeholder="Ex: 10000000"
          />
        </div>
        <div>
          <Label htmlFor="filter-area-min">Área mínima (m²)</Label>
          <Input
            id="filter-area-min"
            type="number"
            min={0}
            value={areaMin}
            onChange={(e) => setAreaMin(e.target.value)}
            placeholder="Ex: 80"
          />
        </div>
        <div>
          <Label htmlFor="filter-area-max">Área máxima (m²)</Label>
          <Input
            id="filter-area-max"
            type="number"
            min={0}
            value={areaMax}
            onChange={(e) => setAreaMax(e.target.value)}
            placeholder="Ex: 600"
          />
        </div>
      </div>

      {/* Dormitórios e Especificações */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Dormitórios (mín.)", val: dormitorios, setter: setDormitorios },
          { label: "Suítes (mín.)", val: suites, setter: setSuites },
          { label: "Banheiros (mín.)", val: banheiros, setter: setBanheiros },
          { label: "Vagas (mín.)", val: vagas, setter: setVagas },
        ].map((group) => (
          <div key={group.label}>
            <Label>{group.label}</Label>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => group.setter(num)}
                  className={cn(
                    "flex-1 h-10 rounded-lg border text-xs font-semibold transition-colors cursor-pointer",
                    group.val === num
                      ? "border-cyan-700 bg-cyan-700 text-white"
                      : "border-[#E5E5E5] bg-white text-[#242424] hover:border-cyan-600/40"
                  )}
                >
                  {num === 0 ? "Todos" : `${num}+`}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Características Extras */}
      <div className="flex flex-wrap gap-3 pt-1">
        {[
          {
            label: "Imóvel mobiliado",
            checked: mobiliado,
            toggle: () => setMobiliado((v) => !v),
          },
          {
            label: "Aceita animais",
            checked: aceitaAnimais,
            toggle: () => setAceitaAnimais((v) => !v),
          },
          {
            label: "Seleção Alto Padrão",
            checked: altoPadrao,
            toggle: () => setAltoPadrao((v) => !v),
          },
        ].map((toggleItem) => (
          <button
            key={toggleItem.label}
            type="button"
            onClick={toggleItem.toggle}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors cursor-pointer",
              toggleItem.checked
                ? "border-cyan-700 bg-cyan-700 text-white"
                : "border-[#E5E5E5] bg-[#F5F5F5] text-[#242424] hover:border-cyan-600/40"
            )}
          >
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full border",
                toggleItem.checked
                  ? "border-white bg-white text-cyan-700"
                  : "border-[#737373]/40"
              )}
            >
              {toggleItem.checked && <Check className="h-2.5 w-2.5" />}
            </span>
            <span>{toggleItem.label}</span>
          </button>
        ))}
      </div>

      {/* Comodidades */}
      <div>
        <Label>Comodidades</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {COMMON_AMENITIES.slice(0, 10).map((amenity) => {
            const active = comodidades.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs transition-colors cursor-pointer",
                  active
                    ? "border-cyan-700 bg-cyan-700 text-white font-medium"
                    : "border-[#E5E5E5] bg-white text-[#737373] hover:border-cyan-600/40 hover:text-[#242424]"
                )}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <section
      aria-label="Filtros e ordenação de imóveis"
      className="mb-8 rounded-2xl border border-cyan-100 bg-white p-4 sm:p-6 shadow-sm border-t-4 border-t-cyan-600"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden border-cyan-200 text-cyan-800 hover:bg-cyan-50"
          >
            <SlidersHorizontal className="h-4 w-4 text-cyan-700" />
            <span>Filtrar</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-cyan-700 px-2 py-0.5 text-[11px] text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowAdvancedDesktop((prev) => !prev)}
            className="hidden lg:inline-flex bg-cyan-50/80 hover:bg-cyan-100 text-cyan-800 border-cyan-200 font-semibold"
          >
            <SlidersHorizontal className="h-4 w-4 text-cyan-700" />
            <span>
              {showAdvancedDesktop ? "Ocultar filtros" : "Filtros avançados"}
            </span>
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-cyan-700 px-2 py-0.5 text-[11px] text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {activeFilterCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-zinc-500 hover:text-cyan-700 hover:bg-cyan-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Limpar filtros</span>
            </Button>
          )}

          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 border border-cyan-200/80 px-3 py-1 text-xs font-semibold text-cyan-800">
            <strong className="font-bold text-cyan-950">
              {totalResults}
            </strong>{" "}
            <span>{totalResults === 1 ? "imóvel encontrado" : "imóveis encontrados"}</span>
          </div>
        </div>

        {/* Ordenação */}
        <div className="flex items-center gap-2">
          <ArrowUpDown
            className="h-4 w-4 text-cyan-700 shrink-0"
            aria-hidden="true"
          />
          <label htmlFor="sort-select" className="text-xs font-medium text-[#737373]">
            Ordenar por:
          </label>
          <select
            id="sort-select"
            value={ordenar}
            onChange={(e) => {
              const nextSort = e.target.value as PropertySortOption;
              setOrdenar(nextSort);
              applyFilters(nextSort);
            }}
            className="h-10 rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] px-3 text-xs font-semibold text-[#242424] focus:border-cyan-600 focus:outline-none"
          >
            {(Object.keys(SORT_OPTION_LABELS) as PropertySortOption[]).map(
              (key) => (
                <option key={key} value={key}>
                  {SORT_OPTION_LABELS[key]}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Barra Rápida Desktop */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyFilters();
        }}
        className="hidden lg:block mt-5 border-t border-[#E5E5E5] pt-5"
      >
        {showAdvancedDesktop ? (
          <>
            {renderFilterFields()}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#E5E5E5] pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={clearAllFilters}
              >
                Limpar tudo
              </Button>
              <Button type="submit" variant="default">
                <Search className="h-4 w-4" />
                <span>Aplicar filtros</span>
              </Button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-12 gap-3 items-end">
            <div className="col-span-3">
              <Label htmlFor="quick-type">Tipo de Imóvel</Label>
              <select
                id="quick-type"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="h-11 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm text-[#242424] focus:border-cyan-600 focus:outline-none"
              >
                <option value="todos">Todos os tipos</option>
                {(Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[]).map(
                  (key) => (
                    <option key={key} value={key}>
                      {PROPERTY_TYPE_LABELS[key]}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="col-span-3">
              <Label htmlFor="quick-city">Cidade</Label>
              <Input
                id="quick-city"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex: São Paulo"
              />
            </div>
            <div className="col-span-3">
              <Label htmlFor="quick-neighborhood">Bairro</Label>
              <Input
                id="quick-neighborhood"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex: Jardim Paulista, Itaim..."
              />
            </div>
            <div className="col-span-3">
              <Button type="submit" className="w-full h-11">
                <Search className="h-4 w-4" />
                <span>Buscar</span>
              </Button>
            </div>
          </div>
        )}
      </form>

      {/* Drawer Mobile */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-xs lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filtros de busca"
        >
          <div className="mt-auto flex max-h-[90dvh] w-full flex-col rounded-t-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] px-5 py-4">
              <h2 className="font-editorial text-xl font-semibold text-[#242424]">
                Filtrar Imóveis
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Fechar filtros"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {renderFilterFields()}
            </div>

            <div className="flex items-center gap-3 border-t border-[#E5E5E5] bg-[#F5F5F5] p-4">
              <Button
                type="button"
                variant="outline"
                onClick={clearAllFilters}
                className="flex-1"
              >
                Limpar
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={() => applyFilters()}
                className="flex-2"
              >
                <Search className="h-4 w-4" />
                <span>Ver resultados</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

