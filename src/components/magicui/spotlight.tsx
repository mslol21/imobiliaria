"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  fill?: string;
  size?: number;
}

export function Spotlight({
  className,
  fill = "rgba(6, 182, 212, 0.18)",
  size = 500,
  ...props
}: SpotlightProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!divRef.current) return;
      const rect = divRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    const current = divRef.current;
    if (current) {
      current.addEventListener("mousemove", handleMouseMove);
      current.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (current) {
        current.removeEventListener("mousemove", handleMouseMove);
        current.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={divRef}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      {...props}
    >
      {/* Luz ambiente estática para atmosfera permanente (Aurora) */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-40 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(6, 182, 212, 0.3) 0%, rgba(20, 184, 166, 0.15) 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-20 right-10 w-[500px] h-[400px] rounded-full blur-[100px] pointer-events-none opacity-20 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(234, 179, 8, 0.25) 0%, transparent 70%)",
        }}
      />

      {/* Spotlight dinâmico que rastreia o cursor suavemente */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, ${fill}, transparent 80%)`,
        }}
      />
    </div>
  );
}
