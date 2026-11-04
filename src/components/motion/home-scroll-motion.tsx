"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/** Animation orchestrator for the public homepage only. No effects in admin. */
export function HomeScrollMotion() {
  const lenisRef = useRef<Lenis | null>(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    if (reduced) return;

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    lenisRef.current = lenis;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.fromTo("[data-motion-hero-title]", { yPercent: 105, opacity: 0 }, {
        yPercent: 0, opacity: 1, duration: 1.15, ease: "power3.out", stagger: 0.14,
        clearProps: "transform,opacity",
      });
      gsap.fromTo("[data-motion-hero-subtitle]", { y: 28, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, delay: 0.45, ease: "power3.out", clearProps: "transform,opacity",
      });
      gsap.to("[data-motion-hero-image]", {
        yPercent: 15, ease: "none", scrollTrigger: {
          trigger: "[data-motion-hero]", start: "top top", end: "bottom top", scrub: 1,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-motion-reveal]").forEach((el) => {
        gsap.fromTo(el, { y: 42, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.85, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          clearProps: "transform,opacity",
        });
      });

      const about = document.querySelector<HTMLElement>("[data-motion-about-text]");
      if (about) {
        const text = about.textContent || "";
        const words = text.trim().split(/\s+/);
        about.replaceChildren(...words.flatMap((word, i) => {
          const span = document.createElement("span");
          span.textContent = word;
          span.className = "motion-word";
          return i === words.length - 1 ? [span] : [span, document.createTextNode(" ")];
        }));
        gsap.fromTo(about.querySelectorAll(".motion-word"), { opacity: 0.28 }, {
          opacity: 1, stagger: 0.08, ease: "none",
          scrollTrigger: { trigger: about, start: "top 82%", end: "bottom 48%", scrub: 1 },
        });
      }

      const track = document.querySelector<HTMLElement>("[data-motion-horizontal-track]");
      const section = document.querySelector<HTMLElement>("[data-motion-horizontal]");
      if (track && section && !small) {
        const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);
        if (distance() > 0) gsap.to(track, {
          x: () => -distance(), ease: "none",
          scrollTrigger: {
            trigger: section, start: "top top", end: () => "+=" + distance(),
            pin: true, scrub: 1, invalidateOnRefresh: true,
          },
        });
      }

      const zoom = document.querySelector<HTMLElement>("[data-motion-zoom-image]");
      if (zoom) gsap.fromTo(zoom,
        { scale: 1.18, clipPath: "inset(8% 8% 8% 8% round 20px)" },
        { scale: 1, clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none",
          scrollTrigger: { trigger: zoom, start: "top 90%", end: "center center", scrub: 1 },
        });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const images = Array.from(document.querySelectorAll<HTMLImageElement>("main img"));
    images.forEach((img) => {
      if (!img.complete) img.addEventListener("load", refresh, { once: true });
    });
    refresh();

    return () => {
      ctx.revert();
      window.removeEventListener("load", refresh);
      images.forEach((img) => img.removeEventListener("load", refresh));
      gsap.ticker.remove(tick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.refresh();
    };
  }, []);
  return null;
}
