"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/** Scoped, reversible scroll reveals. Use only in client components. */
export function useGsapReveal<T extends HTMLElement>(ref: RefObject<T | null>, selector = "[data-reveal]") {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(selector, root).forEach((el) => {
        gsap.fromTo(el, { y: 36, opacity: 0 }, {
          y: 0, opacity: 1, ease: "power3.out", duration: 0.85,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          clearProps: "transform,opacity",
        });
      });
    }, root);
    return () => ctx.revert();
  }, [ref, selector]);
}
