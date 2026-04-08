import { useEffect, useState } from "react";
import { useLenis } from "../hooks/useLenis";

function LenisRoot() {
  const [isCoarsePointer, setIsCoarsePointer] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: coarse)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const update = () => setIsCoarsePointer(coarseQuery.matches);
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
    enabled: true,
    lerp: isCoarsePointer ? 0.1 : 0.08,
    smoothWheel: true,
    smoothTouch: true,
    wheelMultiplier: isCoarsePointer ? 0.8 : 0.9,
    touchMultiplier: isCoarsePointer ? 1.25 : 1.6
  });

  return null;
}

export default LenisRoot;
