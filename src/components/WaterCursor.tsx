import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type WaterCursorProps = {
  size?: "sm" | "md";
};

const cursorSize = {
  md: 260,
  sm: 205
} as const;

function WaterCursor({ size = "md" }: WaterCursorProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const distortionRef = useRef<HTMLDivElement>(null);
  const edgeWarpRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia("(pointer: coarse)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setIsEnabled(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isEnabled || !hostRef.current) return;

    const host = hostRef.current;
    const pxSize = cursorSize[size];
    host.style.width = `${pxSize}px`;
    host.style.height = `${pxSize}px`;
    document.body.classList.add("has-water-cursor");

    let x = window.innerWidth * 0.5;
    let y = window.innerHeight * 0.5;
    let tx = x;
    let ty = y;
    let lastMoveTime = 0;

    const stopLoop = () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const frame = (now: number) => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;

      const dx = tx - x;
      const dy = ty - y;
      const speed = Math.min(1, Math.hypot(dx, dy) / 26);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      host.style.transform = `translate3d(${x - pxSize / 2}px, ${y - pxSize / 2}px, 0)`;
      host.style.opacity = `${0.9 + speed * 0.1}`;

      if (distortionRef.current) {
        distortionRef.current.style.opacity = `${0.72 + speed * 0.22}`;
        const blur = 6 + speed * 4.5;
        const saturate = 2.25 + speed * 0.7;
        const contrast = 1.46 + speed * 0.22;
        const brightness = 1.08 + speed * 0.06;
        const backdrop = `url(#liquid-glass-distortion) blur(${blur.toFixed(2)}px) saturate(${saturate.toFixed(2)}) contrast(${contrast.toFixed(2)}) brightness(${brightness.toFixed(2)})`;
        distortionRef.current.style.backdropFilter = backdrop;
        distortionRef.current.style.webkitBackdropFilter = backdrop;
      }

      if (edgeWarpRef.current) {
        edgeWarpRef.current.style.opacity = `${0.66 + speed * 0.26}`;
        const blur = 8 + speed * 6.5;
        const saturate = 2.5 + speed * 0.95;
        const contrast = 1.56 + speed * 0.28;
        const brightness = 1.1 + speed * 0.07;
        const backdrop = `url(#liquid-glass-distortion) blur(${blur.toFixed(2)}px) saturate(${saturate.toFixed(2)}) contrast(${contrast.toFixed(2)}) brightness(${brightness.toFixed(2)})`;
        edgeWarpRef.current.style.backdropFilter = backdrop;
        edgeWarpRef.current.style.webkitBackdropFilter = backdrop;
        edgeWarpRef.current.style.transform = `rotate(${angle + 16}deg) scale(${1 + speed * 0.09})`;
      }

      if (highlightRef.current) {
        highlightRef.current.style.opacity = `${0.7 + speed * 0.25}`;
        highlightRef.current.style.transform = `rotate(${angle + 22}deg) scale(${1 + speed * 0.08})`;
      }

      if (glowRef.current) {
        glowRef.current.style.opacity = `${0.25 + speed * 0.2}`;
      }

      const isIdle = now - lastMoveTime > 170;
      const isSettled = Math.abs(tx - x) < 0.08 && Math.abs(ty - y) < 0.08;
      if (isIdle && isSettled) {
        rafRef.current = null;
        return;
      }

      rafRef.current = window.requestAnimationFrame(frame);
    };

    const startLoop = () => {
      if (!rafRef.current) {
        rafRef.current = window.requestAnimationFrame(frame);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      lastMoveTime = performance.now();
      startLoop();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    lastMoveTime = performance.now();
    startLoop();

    return () => {
      stopLoop();
      window.removeEventListener("pointermove", onPointerMove);
      document.body.classList.remove("has-water-cursor");
    };
  }, [isEnabled, size]);

  if (!isEnabled) return null;

  return createPortal(
    <div
      ref={hostRef}
      className="pointer-events-none fixed left-0 top-0 z-[2147483647] will-change-transform"
      aria-hidden="true"
      style={{
        borderRadius: "54% 46% 57% 43% / 44% 56% 46% 54%",
        background: "rgba(255,255,255,0.03)",
        border: "1.5px solid rgba(255,255,255,0.92)",
        boxShadow:
          "inset 0 1px 8px rgba(255,255,255,0.46), inset 0 -10px 14px rgba(18,32,46,0.12), 0 4px 12px rgba(10,14,20,0.1)"
      }}
    >
      <div
        ref={distortionRef}
        className="absolute inset-0"
        style={{
          borderRadius: "54% 46% 57% 43% / 44% 56% 46% 54%",
          opacity: 0.72,
          background: "rgba(255,255,255,0.01)",
          backdropFilter: "url(#liquid-glass-distortion) blur(6px) saturate(2.25) contrast(1.46) brightness(1.08)",
          WebkitBackdropFilter: "url(#liquid-glass-distortion) blur(6px) saturate(2.25) contrast(1.46) brightness(1.08)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, transparent 56%, rgba(0,0,0,1) 72%, rgba(0,0,0,1) 93%, transparent 100%)",
          maskImage:
            "radial-gradient(circle at 50% 50%, transparent 56%, rgba(0,0,0,1) 72%, rgba(0,0,0,1) 93%, transparent 100%)"
        }}
      />
      <div
        ref={edgeWarpRef}
        className="absolute inset-[-2.8%] will-change-transform"
        style={{
          borderRadius: "54% 46% 57% 43% / 44% 56% 46% 54%",
          opacity: 0.66,
          background: "rgba(255,255,255,0.008)",
          backdropFilter: "url(#liquid-glass-distortion) blur(8px) saturate(2.5) contrast(1.56) brightness(1.1)",
          WebkitBackdropFilter: "url(#liquid-glass-distortion) blur(8px) saturate(2.5) contrast(1.56) brightness(1.1)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,1) 75%, rgba(0,0,0,1) 96%, transparent 100%)",
          maskImage:
            "radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,1) 75%, rgba(0,0,0,1) 96%, transparent 100%)"
        }}
      />
      <div
        ref={glowRef}
        className="absolute inset-[-12%]"
        style={{
          borderRadius: "54% 46% 57% 43% / 44% 56% 46% 54%",
          opacity: 0.25,
          background:
            "radial-gradient(circle at 50% 50%, rgba(123,206,255,0.3), rgba(196,228,255,0.1) 46%, rgba(255,255,255,0) 72%)",
          filter: "blur(9px)"
        }}
      />
      <div
        className="absolute inset-[4.5%]"
        style={{
          borderRadius: "54% 46% 57% 43% / 44% 56% 46% 54%",
          border: "1.1px solid rgba(255,255,255,0.88)",
          background: "transparent",
          backdropFilter: "blur(1.6px) saturate(1.2) contrast(1.06)",
          WebkitBackdropFilter: "blur(1.6px) saturate(1.2) contrast(1.06)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, transparent 54%, rgba(0,0,0,1) 70%, rgba(0,0,0,1) 92%, transparent 100%)",
          maskImage:
            "radial-gradient(circle at 50% 50%, transparent 54%, rgba(0,0,0,1) 70%, rgba(0,0,0,1) 92%, transparent 100%)",
          boxShadow: "inset 0 0 12px rgba(255,255,255,0.35)"
        }}
      />
      <div
        ref={highlightRef}
        className="absolute inset-[-2%] will-change-transform"
        style={{
          borderRadius: "54% 46% 57% 43% / 44% 56% 46% 54%",
          opacity: 0.7,
          mixBlendMode: "screen",
          background:
            "conic-gradient(from 112deg, rgba(60,206,255,0.34), rgba(255,171,113,0.28), rgba(154,122,255,0.24), rgba(60,206,255,0.34)), radial-gradient(circle at 24% 14%, rgba(255,255,255,0.9), rgba(255,255,255,0.08) 35%, rgba(255,255,255,0) 52%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, transparent 54%, rgba(0,0,0,1) 70%, rgba(0,0,0,1) 92%, transparent 100%)",
          maskImage:
            "radial-gradient(circle at 50% 50%, transparent 54%, rgba(0,0,0,1) 70%, rgba(0,0,0,1) 92%, transparent 100%)",
          filter: "blur(0.55px)"
        }}
      />
    </div>,
    document.body
  );
}

export default WaterCursor;
