import { useEffect, useRef, useState } from "react";

function WaterCursor() {
  const blobRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number>();
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    return !(reduceMotion || coarsePointer);
  });

  useEffect(() => {
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const update = () => {
      setIsEnabled(!(reduceMotionQuery.matches || coarsePointerQuery.matches));
    };

    update();
    reduceMotionQuery.addEventListener("change", update);
    coarsePointerQuery.addEventListener("change", update);

    return () => {
      reduceMotionQuery.removeEventListener("change", update);
      coarsePointerQuery.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let isAnimating = false;
    let lastMoveTime = 0;
    let lastRippleTime = 0;

    const triggerRipple = () => {
      if (!rippleRef.current) return;
      const now = performance.now();
      if (now - lastRippleTime < 140) return;
      lastRippleTime = now;
      rippleRef.current.animate(
        [
          { transform: `translate3d(${x}px, ${y}px, 0) scale(0.6)`, opacity: 0.35 },
          { transform: `translate3d(${x}px, ${y}px, 0) scale(1.35)`, opacity: 0 },
        ],
        { duration: 1200, easing: "ease-out" }
      );
    };

    const handleMove = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      lastMoveTime = performance.now();
      triggerRipple();
      if (!isAnimating) {
        isAnimating = true;
        raf.current = requestAnimationFrame(animate);
      }
    };

    const animate = (now: number) => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;

      if (blobRef.current) {
        blobRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (shimmerRef.current) {
        shimmerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      const isIdle = now - lastMoveTime > 160;
      const isSettled = Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1;

      if (isIdle && isSettled) {
        isAnimating = false;
        raf.current = undefined;
        return;
      }

      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    lastMoveTime = performance.now();
    isAnimating = true;
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-20 mix-blend-soft-light">
      <div
        ref={blobRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 h-[260px] w-[260px] rounded-full blur-[90px] opacity-70 will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 30% 35%, rgba(143, 210, 255, 0.3), transparent 55%), radial-gradient(circle at 70% 70%, rgba(212, 238, 255, 0.4), transparent 60%)",
        }}
      />
      <div
        ref={shimmerRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 h-[120px] w-[120px] rounded-full blur-[36px] opacity-60 will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.65), transparent 65%), radial-gradient(circle at 30% 30%, rgba(200, 229, 255, 0.45), transparent 70%)",
        }}
      />
      <div
        ref={rippleRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 h-[180px] w-[180px] rounded-full border border-[#a8dbff]/50 opacity-0"
      />
    </div>
  );
}

export default WaterCursor;
