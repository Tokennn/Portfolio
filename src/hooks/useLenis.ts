import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface UseLenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  lerp?: number;
  smoothWheel?: boolean;
  smoothTouch?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  infinite?: boolean;
}

export function useLenis(options: UseLenisOptions = {}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: options.duration ?? 1.2,
      easing: options.easing ?? ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
      lerp: options.lerp ?? 0.08,
      smoothWheel: options.smoothWheel ?? true,
      smoothTouch: options.smoothTouch ?? false,
      wheelMultiplier: options.wheelMultiplier ?? 1,
      touchMultiplier: options.touchMultiplier ?? 2,
      infinite: options.infinite ?? false
    });

    lenisRef.current = lenis;

    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();

      return () => {
        gsap.ticker.remove(tick);
        lenis.off("scroll", ScrollTrigger.update);
        lenis.destroy();
        lenisRef.current = null;
      };
    }

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [
    options.duration,
    options.easing,
    options.lerp,
    options.smoothWheel,
    options.smoothTouch,
    options.wheelMultiplier,
    options.touchMultiplier,
    options.infinite
  ]);

  return lenisRef;
}

export default useLenis;
