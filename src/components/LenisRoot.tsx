import { useEffect, useState } from "react";
import { useLenis } from "../hooks/useLenis";

function LenisRoot() {
  const [lenisEnabled, setLenisEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia("(pointer: coarse)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const update = () => setLenisEnabled(!coarseQuery.matches);
    update();
    if (coarseQuery.addEventListener) {
      coarseQuery.addEventListener("change", update);
    } else {
      coarseQuery.addListener(update);
    }
    return () => {
      if (coarseQuery.removeEventListener) {
        coarseQuery.removeEventListener("change", update);
      } else {
        coarseQuery.removeListener(update);
      }
    };
  }, []);

  useLenis({
    enabled: lenisEnabled,
    lerp: 0.08,
    smoothWheel: true,
    smoothTouch: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.6
  });

  return null;
}

export default LenisRoot;
