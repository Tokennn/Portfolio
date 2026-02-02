import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function WaterCursor() {
  const blobRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const splashRef = useRef<HTMLDivElement>(null);
  const dropsRef = useRef<Array<HTMLDivElement | null>>([]);
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
          { transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(0.6)`, opacity: 0.35 },
          { transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(1.35)`, opacity: 0 },
        ],
        { duration: 1200, easing: "ease-out" }
      );
    };

    const triggerSplash = (sx: number, sy: number) => {
      if (splashRef.current) {
        splashRef.current.animate(
          [
            { transform: `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -50%) scale(0.25)`, opacity: 0.6 },
            { transform: `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -50%) scale(1.4)`, opacity: 0 },
          ],
          { duration: 520, easing: "cubic-bezier(.16,1,.3,1)" }
        );
      }

      const drops = dropsRef.current.filter(Boolean) as HTMLDivElement[];
      drops.forEach((drop, idx) => {
        const angle = (Math.PI * 2 * idx) / drops.length + Math.random() * 0.5;
        const distance = 40 + Math.random() * 35;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        drop.animate(
          [
            { transform: `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -50%) scale(0.6)`, opacity: 0.9 },
            { transform: `translate3d(${sx + dx}px, ${sy + dy}px, 0) translate(-50%, -50%) scale(0.1)`, opacity: 0 },
          ],
          { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" }
        );
      });
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
      const dx = tx - x;
      const dy = ty - y;
      const speed = Math.min(1, Math.hypot(dx, dy) / 45);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const stretch = 1 + speed * 0.2;
      const squash = 1 - speed * 0.12;
      const baseTransform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

      if (blobRef.current) {
        blobRef.current.style.transform = `${baseTransform} scale(${1 + speed * 0.1})`;
      }
      if (glassRef.current) {
        glassRef.current.style.transform = `${baseTransform} rotate(${angle}deg) scale(${stretch}, ${squash})`;
      }
      if (shimmerRef.current) {
        shimmerRef.current.style.transform = baseTransform;
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

    const handleDown = (event: PointerEvent) => {
      triggerSplash(event.clientX, event.clientY);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleDown, { passive: true });
    lastMoveTime = performance.now();
    isAnimating = true;
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }
    };
  }, [isEnabled]);

  if (!isEnabled || typeof document === "undefined") return null;

  const cursorLayer = (
    <div className="pointer-events-none fixed inset-0 z-20">
      <div
        ref={blobRef}
        className="absolute h-[240px] w-[240px] rounded-full blur-[90px] opacity-60 will-change-transform mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(circle at 30% 35%, rgba(143, 210, 255, 0.3), transparent 55%), radial-gradient(circle at 70% 70%, rgba(212, 238, 255, 0.4), transparent 60%)",
        }}
      />
      <div
        ref={glassRef}
        className="absolute h-[70px] w-[70px] will-change-transform"
      >
        <div
          className="absolute inset-0 rounded-full border border-white/40"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.9), rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.05) 65%)",
            boxShadow:
              "0 18px 36px rgba(52,34,18,0.18), inset 0 1px 2px rgba(255,255,255,0.75), inset 0 -10px 20px rgba(0,0,0,0.08)",
            backdropFilter: "blur(8px) saturate(1.2)",
            WebkitBackdropFilter: "blur(8px) saturate(1.2)",
          }}
        />
        <div className="absolute left-[18%] top-[18%] h-3 w-7 rotate-[-18deg] rounded-full bg-white/70 blur-[0.5px]" />
        <div className="absolute right-[22%] bottom-[22%] h-2 w-2 rounded-full bg-white/60 blur-[0.5px]" />
      </div>
      <div
        ref={shimmerRef}
        className="absolute h-[140px] w-[140px] rounded-full blur-[40px] opacity-45 will-change-transform mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.5), transparent 65%), radial-gradient(circle at 30% 30%, rgba(200, 229, 255, 0.35), transparent 70%)",
        }}
      />
      <div
        ref={rippleRef}
        className="absolute h-[180px] w-[180px] rounded-full border border-[#a8dbff]/50 opacity-0 mix-blend-soft-light"
      />
      <div
        ref={splashRef}
        className="absolute h-[120px] w-[120px] rounded-full border border-white/60 opacity-0 mix-blend-screen"
        style={{
          boxShadow: "0 12px 24px rgba(52,34,18,0.18), inset 0 0 10px rgba(255,255,255,0.6)",
        }}
      />
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={`drop-${idx}`}
          ref={(el) => {
            dropsRef.current[idx] = el;
          }}
          className="absolute h-3 w-3 rounded-full opacity-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.2) 60%, rgba(255,255,255,0))",
            boxShadow: "0 8px 14px rgba(52,34,18,0.16)",
          }}
        />
      ))}
    </div>
  );

  return createPortal(cursorLayer, document.body);
}

export default WaterCursor;
