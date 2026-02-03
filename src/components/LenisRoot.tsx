import { useLenis } from "../hooks/useLenis";

function LenisRoot() {
  useLenis({
    lerp: 0.08,
    smoothWheel: true,
    smoothTouch: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.6
  });

  return null;
}

export default LenisRoot;
