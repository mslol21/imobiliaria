"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  className,
  children,
  header,
  icon,
  title,
  description,
  badge,
}: {
  className?: string;
  children?: React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/40 hover:bg-zinc-900/80 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)]",
        className
      )}
    >
      {/* Background glow sutil no hover */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />

      {header && <div className="mb-4 overflow-hidden rounded-xl">{header}</div>}

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between gap-3">
          {icon && (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-700/60 bg-zinc-800/50 text-cyan-400 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:border-cyan-500/40 group-hover:bg-cyan-950/30">
              {icon}
            </div>
          )}
          {badge && (
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-cyan-300">
              {badge}
            </span>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-100 transition-colors group-hover:text-cyan-200">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            {description}
          </p>
        </div>

        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}
