import { useEffect, useRef, useState } from 'react';

function SquareCursor() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    return !coarsePointer;
  });
  const cursorRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const position = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
    const update = () => setEnabled(!coarsePointerQuery.matches);
    update();
    coarsePointerQuery.addEventListener('change', update);
    return () => coarsePointerQuery.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;
    document.body.classList.add('has-square-cursor');
    return () => document.body.classList.remove('has-square-cursor');
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    let isAnimating = false;
    let lastMove = performance.now();

    const animate = (now: number) => {
      const nextX = position.current.x + (target.current.x - position.current.x) * 0.2;
      const nextY = position.current.y + (target.current.y - position.current.y) * 0.2;
      position.current = { x: nextX, y: nextY };

      if (cursorRef.current) {
        cursorRef.current.style.setProperty('--cursor-x', `${nextX}px`);
        cursorRef.current.style.setProperty('--cursor-y', `${nextY}px`);
      }

      const isIdle = now - lastMove > 160;
      const isSettled =
        Math.abs(target.current.x - position.current.x) < 0.1 &&
        Math.abs(target.current.y - position.current.y) < 0.1;

      if (isIdle && isSettled) {
        isAnimating = false;
        raf.current = null;
        return;
      }

      raf.current = requestAnimationFrame(animate);
    };

    const handleMove = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
      lastMove = performance.now();
      if (!isAnimating) {
        isAnimating = true;
        raf.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    target.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    position.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    if (cursorRef.current) {
      cursorRef.current.style.setProperty('--cursor-x', `${position.current.x}px`);
      cursorRef.current.style.setProperty('--cursor-y', `${position.current.y}px`);
    }

    return () => {
      window.removeEventListener('pointermove', handleMove);
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [enabled]);

  if (!enabled) return null;

  return <div ref={cursorRef} className="square-cursor" aria-hidden="true" />;
}

export default SquareCursor;
