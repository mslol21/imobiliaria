"use client";

import React, { createContext, useContext, useState } from "react";
import type { TechProperty, TechPropertyFilters } from "@/types/tech-luxury";
import { TECH_LUXURY_PROPERTIES } from "@/data/tech-luxury-mock";

interface TechLuxuryContextType {
  filters: TechPropertyFilters;
  setFilters: React.Dispatch<React.SetStateAction<TechPropertyFilters>>;
  isSchedulerOpen: boolean;
  selectedProperty: TechProperty | null;
  openScheduler: (property?: TechProperty | null) => void;
  closeScheduler: () => void;
}

const TechLuxuryContext = createContext<TechLuxuryContextType | null>(null);

export function TechLuxuryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [filters, setFilters] = useState<TechPropertyFilters>({
    finalidade: "todos",
    tipo: "todos",
  });
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<TechProperty | null>(
    TECH_LUXURY_PROPERTIES[0] ?? null
  );

  const openScheduler = (property?: TechProperty | null) => {
    if (property) {
      setSelectedProperty(property);
    }
    setIsSchedulerOpen(true);
  };

  const closeScheduler = () => {
    setIsSchedulerOpen(false);
  };

  return (
    <TechLuxuryContext.Provider
      value={{
        filters,
        setFilters,
        isSchedulerOpen,
        selectedProperty,
        openScheduler,
        closeScheduler,
      }}
    >
      {children}
    </TechLuxuryContext.Provider>
  );
}

export function useTechLuxury() {
  const ctx = useContext(TechLuxuryContext);
  if (!ctx) {
    throw new Error("useTechLuxury must be used within a TechLuxuryProvider");
  }
  return ctx;
}
