import { useEffect, useRef } from "react";
import Lenis from "lenis";

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
  const rafRef = useRef<number>();

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

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
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
