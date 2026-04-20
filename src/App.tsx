import { useState, useEffect, useRef, useCallback, type PointerEvent as ReactPointerEvent } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import digitalGrowthExpertPhoto from './assets/digital-growth-expert.png';
import airPhoto from './assets/air.png';
import discoverPhoto from './assets/discover.png';
import notchbarPhoto from './assets/notchbar.png';
import Lanyard from './components/Lanyard';
// import { HeroScrollDemo } from './components/ui/demo';

type LenisController = {
  stop: () => void;
  start: () => void;
};

const getLenisController = (): LenisController | null => {
  if (typeof window === 'undefined') return null;
  return (window as Window & { __portfolioLenis?: LenisController }).__portfolioLenis ?? null;
};

function HomeBrandMark() {
  return (
    <div className="home-brand-mark fixed left-5 top-5 z-[60] text-left text-[#0f0f0f] sm:left-8 sm:top-7">
      <p className="home-brand-mark__line home-brand-mark__line--main">
        quentin
      </p>
      <p className="home-brand-mark__line home-brand-mark__line--sub">
        contreau
      </p>
    </div>
  );
}

function App() {
  const [entered, setEntered] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('introEntered') === 'true';
  });
  const [isTransitioningToMain, setIsTransitioningToMain] = useState(false);
  const [shouldPlayMainReveal, setShouldPlayMainReveal] = useState(false);
  const [isDiscoverExpanded, setIsDiscoverExpanded] = useState(false);
  const [isRightPhotoExpanded, setIsRightPhotoExpanded] = useState(false);
  const [isPlaneExploding, setIsPlaneExploding] = useState(false);
  const [planeExplosionPoint, setPlaneExplosionPoint] = useState({ x: 0, y: 0 });
  const [planeExplosionKey, setPlaneExplosionKey] = useState(0);
  const [isMainPlaneVisible, setIsMainPlaneVisible] = useState(false);
  const [isMainPlaneExploding, setIsMainPlaneExploding] = useState(false);
  const [mainPlaneExplosionPoint, setMainPlaneExplosionPoint] = useState({ x: 0, y: 0 });
  const [mainPlaneExplosionKey, setMainPlaneExplosionKey] = useState(0);
  const planeBurstPuffs = Array.from({ length: 24 });
  const introScreenRef = useRef<HTMLDivElement | null>(null);
  const enterButtonRef = useRef<HTMLButtonElement | null>(null);
  const mainContentRef = useRef<HTMLDivElement | null>(null);
  const navGroupRef = useRef<HTMLDivElement | null>(null);
  const introPlaneRef = useRef<HTMLDivElement | null>(null);
  const mainFlyPlaneRef = useRef<HTMLDivElement | null>(null);
  const hasPlayedMainPlaneRef = useRef(false);
  const introPlaneInnerRef = useRef<HTMLDivElement | null>(null);
  const mainFlyPlaneInnerRef = useRef<HTMLDivElement | null>(null);
  const introSpeedLinesRef = useRef<Array<HTMLSpanElement | null>>([]);
  const planeExplosionTimeoutRef = useRef<number | null>(null);
  const mainPlaneExplosionTimeoutRef = useRef<number | null>(null);
  const mediaVideoCardRef = useRef<HTMLDivElement | null>(null);
  const mediaRightCardRef = useRef<HTMLDivElement | null>(null);
  const mediaTopPhotoCardRef = useRef<HTMLDivElement | null>(null);
  const mediaLeftBottomCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (planeExplosionTimeoutRef.current !== null) {
        window.clearTimeout(planeExplosionTimeoutRef.current);
      }
      if (mainPlaneExplosionTimeoutRef.current !== null) {
        window.clearTimeout(mainPlaneExplosionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (entered) {
      sessionStorage.setItem('introEntered', 'true');
    }
  }, [entered]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const assetsToPreload = [
      { as: 'image', href: airPhoto, type: 'image/png' },
      { as: 'image', href: discoverPhoto, type: 'image/png' },
      { as: 'image', href: notchbarPhoto, type: 'image/png' },
      { as: 'image', href: digitalGrowthExpertPhoto, type: 'image/png' }
    ] as const;

    const createdLinks: HTMLLinkElement[] = [];
    assetsToPreload.forEach(({ as, href, type }) => {
      const existing = document.head.querySelector(`link[rel="preload"][href="${href}"]`);
      if (existing) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = as;
      link.href = href;
      link.type = type;
      document.head.appendChild(link);
      createdLinks.push(link);
    });

    return () => {
      createdLinks.forEach((link) => link.remove());
    };
  }, []);

  useEffect(() => {
    if (!entered || typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReducedMotion || coarsePointer) return;

    const cards = [mediaVideoCardRef.current, mediaTopPhotoCardRef.current].filter(
      (card): card is HTMLDivElement => Boolean(card)
    );
    if (!cards.length) return;

    const cleanup: Array<() => void> = [];

    cards.forEach((card) => {
      let rafId = 0;
      let isActive = false;
      let current = { x: 0.5, y: 0.5 };
      let target = { x: 0.5, y: 0.5 };

      const applyState = (xNorm: number, yNorm: number) => {
        const percentX = xNorm * 100;
        const percentY = yNorm * 100;
        const rotateX = (0.5 - yNorm) * 10;
        const rotateY = (xNorm - 0.5) * 12;

        card.style.setProperty('--pointer-x', `${percentX.toFixed(2)}%`);
        card.style.setProperty('--pointer-y', `${percentY.toFixed(2)}%`);
        card.style.setProperty('--tilt-rotate-x', `${rotateX.toFixed(2)}deg`);
        card.style.setProperty('--tilt-rotate-y', `${rotateY.toFixed(2)}deg`);
      };

      const startLoop = () => {
        if (rafId) return;
        const loop = () => {
          const smooth = 0.14;
          current.x += (target.x - current.x) * smooth;
          current.y += (target.y - current.y) * smooth;
          applyState(current.x, current.y);

          const settled = Math.hypot(target.x - current.x, target.y - current.y) < 0.0015;
          if (settled && !isActive) {
            card.classList.remove('is-active');
            rafId = 0;
            return;
          }
          rafId = window.requestAnimationFrame(loop);
        };
        rafId = window.requestAnimationFrame(loop);
      };

      const updateTargetFromPointer = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
        const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
        target = { x, y };
        startLoop();
      };

      applyState(0.5, 0.5);

      const handlePointerEnter = (event: PointerEvent) => {
        isActive = true;
        card.classList.add('is-active');
        updateTargetFromPointer(event);
      };

      const handlePointerMove = (event: PointerEvent) => {
        updateTargetFromPointer(event);
      };

      const handlePointerLeave = () => {
        isActive = false;
        target = { x: 0.5, y: 0.5 };
        startLoop();
      };

      card.addEventListener('pointerenter', handlePointerEnter);
      card.addEventListener('pointermove', handlePointerMove);
      card.addEventListener('pointerleave', handlePointerLeave);

      cleanup.push(() => {
        card.removeEventListener('pointerenter', handlePointerEnter);
        card.removeEventListener('pointermove', handlePointerMove);
        card.removeEventListener('pointerleave', handlePointerLeave);
        if (rafId) {
          window.cancelAnimationFrame(rafId);
        }
        card.classList.remove('is-active');
        card.style.removeProperty('--pointer-x');
        card.style.removeProperty('--pointer-y');
        card.style.removeProperty('--tilt-rotate-x');
        card.style.removeProperty('--tilt-rotate-y');
      });
    });

    return () => {
      cleanup.forEach((dispose) => dispose());
    };
  }, [entered]);

  const triggerPlaneExplosion = useCallback((event?: ReactPointerEvent<HTMLDivElement>) => {
    if (entered) return;
    const planeInner = introPlaneInnerRef.current;
    if (event) {
      setPlaneExplosionPoint({ x: event.clientX, y: event.clientY });
    } else if (planeInner) {
      const rect = planeInner.getBoundingClientRect();
      setPlaneExplosionPoint({
        x: rect.left + rect.width * 0.5,
        y: rect.top + rect.height * 0.5
      });
    }
    if (planeExplosionTimeoutRef.current !== null) {
      window.clearTimeout(planeExplosionTimeoutRef.current);
    }
    setPlaneExplosionKey((previous) => previous + 1);
    setIsPlaneExploding(true);
    planeExplosionTimeoutRef.current = window.setTimeout(() => {
      setIsPlaneExploding(false);
    }, 620);
  }, [entered]);

  const triggerMainPlaneExplosionAt = useCallback((x: number, y: number) => {
    if (mainPlaneExplosionTimeoutRef.current !== null) {
      window.clearTimeout(mainPlaneExplosionTimeoutRef.current);
    }
    setMainPlaneExplosionPoint({ x, y });
    setMainPlaneExplosionKey((previous) => previous + 1);
    setIsMainPlaneExploding(true);
    mainPlaneExplosionTimeoutRef.current = window.setTimeout(() => {
      setIsMainPlaneExploding(false);
    }, 620);
  }, []);

  useEffect(() => {
    if (entered || typeof window === 'undefined') return;

    const plane = introPlaneRef.current;
    const planeInner = introPlaneInnerRef.current;
    if (!plane || !planeInner) return;

    type Vec2 = { x: number; y: number };
    type BezierSegment = {
      kind: 'bezier';
      p0: Vec2;
      p1: Vec2;
      p2: Vec2;
      p3: Vec2;
      duration: number;
      elapsed: number;
    };
    type LoopSegment = {
      kind: 'loop';
      cx: number;
      cy: number;
      radius: number;
      direction: 1 | -1;
      turns: number;
      startAngle: number;
      duration: number;
      elapsed: number;
    };
    type FlightSegment = BezierSegment | LoopSegment;

    const vecLength = (v: Vec2) => Math.hypot(v.x, v.y);
    const normalize = (v: Vec2): Vec2 => {
      const len = vecLength(v) || 1;
      return { x: v.x / len, y: v.y / len };
    };
    const lerpVec = (a: Vec2, b: Vec2, t: number): Vec2 => ({
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t
    });
    const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
    const angleDelta = (next: number, prev: number) => {
      let delta = next - prev;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;
      return delta;
    };
    const bezierPoint = (t: number, p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2): Vec2 => {
      const inv = 1 - t;
      return {
        x: inv * inv * inv * p0.x + 3 * inv * inv * t * p1.x + 3 * inv * t * t * p2.x + t * t * t * p3.x,
        y: inv * inv * inv * p0.y + 3 * inv * inv * t * p1.y + 3 * inv * t * t * p2.y + t * t * t * p3.y
      };
    };
    const bezierTangent = (t: number, p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2): Vec2 => {
      const inv = 1 - t;
      return {
        x: 3 * inv * inv * (p1.x - p0.x) + 6 * inv * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x),
        y: 3 * inv * inv * (p1.y - p0.y) + 6 * inv * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y)
      };
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const padding = 56;
    const randomX = () => gsap.utils.random(padding, Math.max(padding, window.innerWidth - padding));
    const randomY = () => gsap.utils.random(padding, Math.max(padding, window.innerHeight - padding));
    const randomPoint = (): Vec2 => ({ x: randomX(), y: randomY() });

    gsap.set(plane, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth * 0.24,
      y: window.innerHeight * 0.32,
      rotation: -12
    });

    let isActive = true;
    let rafId = 0;
    let previousTime = performance.now();

    const setX = gsap.quickSetter(plane, 'x', 'px');
    const setY = gsap.quickSetter(plane, 'y', 'px');
    const setRotation = gsap.quickSetter(plane, 'rotation', 'deg');
    const setInnerRotation = gsap.quickSetter(planeInner, 'rotation', 'deg');

    const current: Vec2 = {
      x: Number(gsap.getProperty(plane, 'x')) || window.innerWidth * 0.24,
      y: Number(gsap.getProperty(plane, 'y')) || window.innerHeight * 0.32
    };
    let forward: Vec2 = normalize({ x: 1, y: 0.24 });
    let heading = Math.atan2(forward.y, forward.x);
    let previousHeading = heading;
    let rollDeg = 0;
    let segment: FlightSegment | null = null;
    let loopCooldownSec = gsap.utils.random(3.5, 5.8);
    const speedPxPerSecond = prefersReducedMotion ? 110 : 170;
    const noseAlignmentOffsetDeg = -5;
    const reversePlaneDirection = true;
    const reversePlaneRotationDeg = reversePlaneDirection ? 180 : 0;
    const speedLineTweens: gsap.core.Tween[] = [];

    const speedLines = introSpeedLinesRef.current.filter((el): el is HTMLSpanElement => Boolean(el));
    speedLines.forEach((line, index) => {
      const isLeft = line.dataset.side === 'left';
      const travel = isLeft ? -8 : 8;
      gsap.set(line, { opacity: 0.5, x: 0, scaleX: 1 });
      if (!prefersReducedMotion) {
        const tween = gsap.to(line, {
          x: travel,
          opacity: 0.15,
          scaleX: 0.62,
          duration: 0.28 + index * 0.035,
          ease: 'none',
          repeat: -1,
          yoyo: true,
          delay: index * 0.06
        });
        speedLineTweens.push(tween);
      }
    });

    const createBezierSegment = (start: Vec2, startDir: Vec2): BezierSegment => {
      let target = randomPoint();
      let tries = 0;
      while (tries < 8 && Math.hypot(target.x - start.x, target.y - start.y) < 140) {
        target = randomPoint();
        tries += 1;
      }

      const centerBias = normalize({
        x: window.innerWidth * 0.5 - target.x,
        y: window.innerHeight * 0.5 - target.y
      });
      const randomTurn = gsap.utils.random(-1.0, 1.0);
      const cosine = Math.cos(randomTurn);
      const sine = Math.sin(randomTurn);
      const rotatedStartDir = normalize({
        x: startDir.x * cosine - startDir.y * sine,
        y: startDir.x * sine + startDir.y * cosine
      });
      const targetDir = normalize(lerpVec(rotatedStartDir, centerBias, 0.34));

      const distance = Math.hypot(target.x - start.x, target.y - start.y);
      const handleA = Math.max(54, Math.min(220, distance * 0.42));
      const handleB = Math.max(48, Math.min(200, distance * 0.36));
      const p0 = { ...start };
      const p1 = { x: start.x + startDir.x * handleA, y: start.y + startDir.y * handleA };
      const p2 = { x: target.x - targetDir.x * handleB, y: target.y - targetDir.y * handleB };
      const p3 = { ...target };

      let length = 0;
      let prev = p0;
      const samples = 28;
      for (let i = 1; i <= samples; i += 1) {
        const t = i / samples;
        const pt = bezierPoint(t, p0, p1, p2, p3);
        length += Math.hypot(pt.x - prev.x, pt.y - prev.y);
        prev = pt;
      }

      return {
        kind: 'bezier',
        p0,
        p1,
        p2,
        p3,
        duration: Math.max(1.1, length / speedPxPerSecond),
        elapsed: 0
      };
    };

    const createLoopSegment = (start: Vec2, startDir: Vec2): LoopSegment | null => {
      const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
      const radius = gsap.utils.random(64, 120);
      const perpendicular = { x: -startDir.y * direction, y: startDir.x * direction };
      const center = {
        x: start.x + perpendicular.x * radius,
        y: start.y + perpendicular.y * radius
      };

      if (
        center.x < padding + radius ||
        center.x > window.innerWidth - padding - radius ||
        center.y < padding + radius ||
        center.y > window.innerHeight - padding - radius
      ) {
        return null;
      }

      const turns = gsap.utils.random(1.0, 1.35);
      const length = Math.PI * 2 * radius * turns;
      return {
        kind: 'loop',
        cx: center.x,
        cy: center.y,
        radius,
        direction,
        turns,
        startAngle: Math.atan2(start.y - center.y, start.x - center.x),
        duration: Math.max(1.4, length / speedPxPerSecond),
        elapsed: 0
      };
    };

    const spawnSegment = () => {
      const inSafeZone =
        Math.abs(current.x - window.innerWidth * 0.5) < window.innerWidth * 0.32 &&
        Math.abs(current.y - window.innerHeight * 0.5) < window.innerHeight * 0.32;

      if (!prefersReducedMotion && inSafeZone && loopCooldownSec <= 0 && Math.random() > 0.58) {
        const loop = createLoopSegment(current, forward);
        if (loop) {
          segment = loop;
          loopCooldownSec = gsap.utils.random(4.2, 7.1);
          return;
        }
      }

      segment = createBezierSegment(current, forward);
    };

    const animate = (now: number) => {
      if (!isActive) return;
      rafId = window.requestAnimationFrame(animate);
      const dt = Math.min(0.032, (now - previousTime) / 1000);
      previousTime = now;
      loopCooldownSec -= dt;

      if (!segment) spawnSegment();
      if (!segment) return;

      let targetPos: Vec2 = current;
      let targetTangent: Vec2 = forward;

      if (segment.kind === 'bezier') {
        segment.elapsed += dt;
        const t = Math.min(1, segment.elapsed / segment.duration);
        targetPos = bezierPoint(t, segment.p0, segment.p1, segment.p2, segment.p3);
        targetTangent = bezierTangent(t, segment.p0, segment.p1, segment.p2, segment.p3);
        if (t >= 1) segment = null;
      } else {
        segment.elapsed += dt;
        const t = Math.min(1, segment.elapsed / segment.duration);
        const angle = segment.startAngle + segment.direction * t * segment.turns * Math.PI * 2;
        targetPos = {
          x: segment.cx + Math.cos(angle) * segment.radius,
          y: segment.cy + Math.sin(angle) * segment.radius
        };
        targetTangent = {
          x: -Math.sin(angle) * segment.direction,
          y: Math.cos(angle) * segment.direction
        };
        if (t >= 1) segment = null;
      }

      const tangent = normalize(targetTangent);
      forward = normalize(lerpVec(forward, tangent, clamp01(dt * 7.2)));
      current.x = targetPos.x;
      current.y = targetPos.y;
      heading = Math.atan2(forward.y, forward.x);

      const delta = angleDelta(heading, previousHeading);
      previousHeading = heading;
      const targetRoll = Math.max(-16, Math.min(16, delta * 240));
      rollDeg += (targetRoll - rollDeg) * clamp01(dt * 8);

      setX(current.x);
      setY(current.y);
      const displayRotationDeg = (heading * 180) / Math.PI + noseAlignmentOffsetDeg + reversePlaneRotationDeg;
      setRotation(displayRotationDeg);
      setInnerRotation(0);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      isActive = false;
      window.cancelAnimationFrame(rafId);
      speedLineTweens.forEach((tween) => tween.kill());
      gsap.set(plane, {
        clearProps: 'x,y,xPercent,yPercent,rotation,transform'
      });
      gsap.set(planeInner, {
        clearProps: 'rotation,transform'
      });
    };
  }, [entered]);

  useEffect(() => {
    if (!entered || typeof window === 'undefined' || hasPlayedMainPlaneRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktopViewport = window.matchMedia('(min-width: 768px)').matches;
    if (prefersReducedMotion || !isDesktopViewport) return;

    let flightTimeline: gsap.core.Timeline | null = null;
    let rafId = 0;
    let isCancelled = false;

    const launchFlight = () => {
      if (isCancelled) return;

      const targetCard = mediaRightCardRef.current;
      if (!targetCard) {
        rafId = window.requestAnimationFrame(launchFlight);
        return;
      }

      const rect = targetCard.getBoundingClientRect();
      if (rect.width < 30 || rect.height < 30) {
        rafId = window.requestAnimationFrame(launchFlight);
        return;
      }

      hasPlayedMainPlaneRef.current = true;
      setIsMainPlaneVisible(true);
      setIsMainPlaneExploding(false);

      const startPoint = {
        x: window.innerWidth * 0.58,
        y: window.innerHeight * 0.93
      };
      const midPoint = {
        x: window.innerWidth * 0.72,
        y: window.innerHeight * 0.8
      };
      const latePoint = {
        x: window.innerWidth * 0.86,
        y: window.innerHeight * 0.68
      };
      const targetPoint = {
        x: rect.right - Math.min(28, rect.width * 0.2),
        y: rect.top + rect.height * 0.55
      };

      const runFlightWhenMounted = () => {
        if (isCancelled) return;
        const plane = mainFlyPlaneRef.current;
        const planeInner = mainFlyPlaneInnerRef.current;
        if (!plane || !planeInner) {
          rafId = window.requestAnimationFrame(runFlightWhenMounted);
          return;
        }

        gsap.set(plane, {
          xPercent: -50,
          yPercent: -50,
          x: startPoint.x,
          y: startPoint.y,
          rotation: -44,
          opacity: 1
        });
        gsap.set(planeInner, { rotation: 180 });

        const bezierPoint = (t: number) => {
          const inv = 1 - t;
          const x =
            inv * inv * inv * startPoint.x +
            3 * inv * inv * t * midPoint.x +
            3 * inv * t * t * latePoint.x +
            t * t * t * targetPoint.x;
          const y =
            inv * inv * inv * startPoint.y +
            3 * inv * inv * t * midPoint.y +
            3 * inv * t * t * latePoint.y +
            t * t * t * targetPoint.y;
          return { x, y };
        };

        const bezierTangent = (t: number) => {
          const inv = 1 - t;
          const x =
            3 * inv * inv * (midPoint.x - startPoint.x) +
            6 * inv * t * (latePoint.x - midPoint.x) +
            3 * t * t * (targetPoint.x - latePoint.x);
          const y =
            3 * inv * inv * (midPoint.y - startPoint.y) +
            6 * inv * t * (latePoint.y - midPoint.y) +
            3 * t * t * (targetPoint.y - latePoint.y);
          return { x, y };
        };

        const progress = { value: 0 };
        flightTimeline = gsap.timeline({
          onComplete: () => {
            setIsMainPlaneVisible(false);
          }
        });

        flightTimeline
          .to(progress, {
            value: 1,
            duration: 1.85,
            ease: 'none',
            onUpdate: () => {
              const point = bezierPoint(progress.value);
              const tangent = bezierTangent(progress.value);
              const angle = (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI;
              gsap.set(plane, {
                x: point.x,
                y: point.y,
                rotation: angle
              });
            }
          })
          .add(() => {
            triggerMainPlaneExplosionAt(targetPoint.x, targetPoint.y);
          })
          .to(plane, { opacity: 0, duration: 0.14, ease: 'none' }, '>-0.01');
      };

      rafId = window.requestAnimationFrame(runFlightWhenMounted);
    };

    rafId = window.requestAnimationFrame(launchFlight);

    return () => {
      isCancelled = true;
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      if (flightTimeline) {
        flightTimeline.kill();
      }
    };
  }, [entered, triggerMainPlaneExplosionAt]);

  const canEnter = true;

  const handleEnter = useCallback(() => {
    if (!canEnter || entered || isTransitioningToMain) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = getLenisController();

    if (prefersReducedMotion) {
      setEntered(true);
      return;
    }

    const introScreen = introScreenRef.current;
    if (!introScreen) {
      setEntered(true);
      return;
    }

    const enterButton = enterButtonRef.current;
    const introPlane = introPlaneRef.current;

    setIsTransitioningToMain(true);
    lenis?.stop();
    triggerPlaneExplosion();

    const timeline = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        setEntered(true);
        setShouldPlayMainReveal(true);
        setIsTransitioningToMain(false);
      }
    });

    if (enterButton) {
      timeline.to(
        enterButton,
        {
          scale: 0.9,
          opacity: 0,
          y: -26,
          duration: 0.38,
          ease: 'power2.out'
        },
        0
      );
    }

    if (introPlane) {
      timeline.to(
        introPlane,
        {
          opacity: 0.24,
          duration: 0.5,
          ease: 'power2.out'
        },
        0
      );
    }

    timeline.to(
      introScreen,
      {
        yPercent: -104,
        duration: 1.08,
        ease: 'power4.inOut'
      },
      0.08
    );
  }, [canEnter, entered, isTransitioningToMain, triggerPlaneExplosion]);

  const handleDiscoverCardClick = useCallback(() => {
    setIsDiscoverExpanded((previous) => !previous);
  }, []);

  const discoverPanelExpandedSize = 'clamp(250px, 20vw, 340px)';
  const discoverPanelCollapsedHeight = 'clamp(72px, 10vh, 116px)';

  useEffect(() => {
    if (!entered || !shouldPlayMainReveal || typeof window === 'undefined') return;

    const mainContent = mainContentRef.current;
    const navGroup = navGroupRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = getLenisController();

    if (!mainContent || !navGroup || prefersReducedMotion) {
      lenis?.start();
      setShouldPlayMainReveal(false);
      return;
    }

    const navLinks = navGroup.querySelectorAll('.nav-link');

    gsap.set(mainContent, { y: 110, opacity: 0 });
    gsap.set(navLinks, { y: 36, opacity: 0 });

    const timeline = gsap.timeline({
      onComplete: () => {
        lenis?.start();
        setShouldPlayMainReveal(false);
      }
    });

    timeline.to(mainContent, {
      y: 0,
      opacity: 1,
      duration: 0.95,
      ease: 'power4.out'
    });

    timeline.to(
      navLinks,
      {
        y: 0,
        opacity: 1,
        duration: 0.72,
        stagger: 0.09,
        ease: 'power3.out'
      },
      '-=0.5'
    );

    return () => {
      timeline.kill();
    };
  }, [entered, shouldPlayMainReveal]);

  if (!entered) {
    return (
      <div
        ref={introScreenRef}
        key="intro-screen"
        className={`fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#f8f3ea] via-[#f2e6d7] to-[#fdf8ef] text-[#0f0f0f] ${
          isTransitioningToMain ? 'pointer-events-none' : ''
        }`}
      >
        {!isTransitioningToMain && <HomeBrandMark />}
        {/* Spline Background (commented per request) */}
        {/*
        <spline-viewer
          url="https://prod.spline.design/phRSX0hJurf0mICV/scene.splinecode"
          className="absolute inset-0 h-full w-full pointer-events-none"
          style={{ filter: 'brightness(0.45)' }}
        />
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        */}
        <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.85),transparent_38%),radial-gradient(circle_at_82%_6%,rgba(253,230,205,0.45),transparent_46%),radial-gradient(circle_at_24%_80%,rgba(210,175,140,0.28),transparent_50%)]" />
        <div
          ref={introPlaneRef}
          onPointerDown={triggerPlaneExplosion}
          className="intro-plane absolute left-0 top-0 z-10 cursor-pointer touch-manipulation opacity-95"
          aria-label="Plane animation trigger"
        >
          <div
            ref={introPlaneInnerRef}
            className={`intro-plane__inner relative drop-shadow-[0_10px_18px_rgba(52,34,18,0.2)] ${
              isPlaneExploding ? 'plane-exploding' : ''
            }`}
          >
            <span
              ref={(el) => {
                introSpeedLinesRef.current[0] = el;
              }}
              data-side="left"
              className="absolute block h-[2px] w-[12px] rounded-full bg-[#4a4a50]"
              style={{ left: 34, top: 8 }}
              aria-hidden="true"
            />
            <span
              ref={(el) => {
                introSpeedLinesRef.current[1] = el;
              }}
              data-side="right"
              className="absolute block h-[2px] w-[12px] rounded-full bg-[#4a4a50]"
              style={{ left: 34, top: 32 }}
              aria-hidden="true"
            />
            <svg width="86" height="44" viewBox="0 0 86 44" aria-hidden="true">
              <path
                d="M3 24 C 14 19, 24 19, 35 24"
                fill="none"
                stroke="#8f8a80"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="3 5"
                opacity="0.8"
              />
              <path
                d="M10 24 L59 12 L45 21 L59 30 Z"
                fill="#fffdf7"
                stroke="#0f0f0f"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M17 24 L38 24 M27 20 L33 24 L27 28"
                fill="none"
                stroke="#0f0f0f"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="50" cy="21" r="1.4" fill="#0f0f0f" />
            </svg>
          </div>
        </div>
        <div
          key={planeExplosionKey}
          className={`plane-burst plane-burst--screen ${isPlaneExploding ? 'plane-burst--active' : ''}`}
          style={{ left: `${planeExplosionPoint.x}px`, top: `${planeExplosionPoint.y}px` }}
          aria-hidden="true"
        >
          <svg className="plane-burst__toon" viewBox="0 0 220 220" aria-hidden="true">
            <defs>
              <mask id="plane-burst-core-cutout">
                <rect x="0" y="0" width="220" height="220" fill="#fff" />
                <path
                  d="M109 93 C118 86,130 88,135 98 C144 99,149 107,146 116 C149 125,143 133,133 134 C127 140,117 141,111 136 C100 139,90 134,88 126 C79 124,74 114,79 106 C77 97,85 89,94 90 C99 84,106 85,109 93 Z"
                  fill="#000"
                />
              </mask>
            </defs>
            <path
              className="plane-burst__toon-star"
              d="M110 52 L121 84 L153 74 L136 99 L162 118 L129 122 L132 158 L111 132 L89 158 L92 122 L58 118 L84 99 L67 74 L99 84 Z"
            />
            <path
              className="plane-burst__toon-core"
              d="M109 68 C124 56,146 60,155 78 C173 79,184 95,177 112 C184 129,171 146,151 147 C139 162,117 167,104 154 C82 160,63 149,59 130 C40 126,31 107,39 90 C35 70,52 54,72 55 C83 42,100 43,109 68 Z"
              mask="url(#plane-burst-core-cutout)"
            />
            <path
              className="plane-burst__toon-core-detail"
              d="M109 93 C118 86,130 88,135 98 C144 99,149 107,146 116 C149 125,143 133,133 134 C127 140,117 141,111 136 C100 139,90 134,88 126 C79 124,74 114,79 106 C77 97,85 89,94 90 C99 84,106 85,109 93 Z"
            />
            <path className="plane-burst__toon-ray" d="M110 38 L110 24" />
            <path className="plane-burst__toon-ray" d="M143 46 L150 33" />
            <path className="plane-burst__toon-ray" d="M166 67 L179 60" />
            <path className="plane-burst__toon-ray" d="M174 100 L189 100" />
            <path className="plane-burst__toon-ray" d="M167 133 L180 140" />
            <path className="plane-burst__toon-ray" d="M143 155 L151 169" />
            <path className="plane-burst__toon-ray" d="M110 163 L110 178" />
            <path className="plane-burst__toon-ray" d="M77 155 L70 169" />
            <path className="plane-burst__toon-ray" d="M54 133 L41 140" />
            <path className="plane-burst__toon-ray" d="M46 100 L31 100" />
            <path className="plane-burst__toon-ray" d="M54 67 L41 60" />
            <path className="plane-burst__toon-ray" d="M77 46 L70 33" />
          </svg>
          <div className="plane-burst__puffs">
            {planeBurstPuffs.map((_, index) => (
              <span key={index} className="plane-burst__puff" />
            ))}
          </div>
        </div>

        {/* ENTER button (commented per request) */}
        {/*
        <button
          disabled={!canEnter}
          onClick={() => {
            if (!canEnter) return;
            gsap.to(".enter-button", {
              scale: 0.8,
              opacity: 0,
              duration: 1,
              ease: "power2.out",
              onComplete: () => {
                setEntered(true); 
                gsap.from(".main-content", {
                  opacity: 0,
                  y: 100,
                  duration: 1,
                  ease: "power2.out"
                });
              }
            });
          }}
          className={`enter-button group absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 transition opacity-100 ${canEnter ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
        >
          <div className="absolute inset-0 border border-white/20 rounded-full transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 border border-white/20 rounded-full transition-transform duration-700 group-hover:scale-125" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/80 text-lg tracking-widest font-light transition-all duration-500 group-hover:text-white group-hover:scale-110">
              ENTER
            </span>
          </div>
        </button>
        */}

        <button
          ref={enterButtonRef}
          disabled={!canEnter || isTransitioningToMain}
          onClick={handleEnter}
          className={`enter-word absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
            canEnter && !isTransitioningToMain ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-40'
          }`}
          aria-label="Enter site"
        >
          ENTRER
        </button>

        {/* Loading bar (commented per request) */}
        {/*
        <div className="absolute bottom-6 right-6 text-white/80 text-sm font-medium flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-white/60">Loading</span>
            <span className="text-sm">{loadingPercent}%</span>
          </div>
          <div className="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/80"
              style={{ width: `${loadingPercent}%`, transition: "width 0.3s ease-out" }}
            />
          </div>
        </div>
        */}
      </div>
    );
  }

  return (
    <div ref={mainContentRef} key="main-screen" className="main-content min-h-screen relative text-[#0f0f0f]">
      <BackgroundOrbs />
      {isMainPlaneVisible && (
        <div ref={mainFlyPlaneRef} className="intro-plane fixed left-0 top-0 z-[52] pointer-events-none opacity-95" aria-hidden="true">
          <div
            ref={mainFlyPlaneInnerRef}
            className={`intro-plane__inner relative drop-shadow-[0_10px_18px_rgba(52,34,18,0.2)] ${
              isMainPlaneExploding ? 'plane-exploding' : ''
            }`}
          >
            <span
              className="absolute block h-[2px] w-[12px] rounded-full bg-[#4a4a50]"
              style={{ left: 34, top: 8 }}
              aria-hidden="true"
            />
            <span
              className="absolute block h-[2px] w-[12px] rounded-full bg-[#4a4a50]"
              style={{ left: 34, top: 32 }}
              aria-hidden="true"
            />
            <svg width="86" height="44" viewBox="0 0 86 44" aria-hidden="true">
              <path
                d="M3 24 C 14 19, 24 19, 35 24"
                fill="none"
                stroke="#8f8a80"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="3 5"
                opacity="0.8"
              />
              <path
                d="M10 24 L59 12 L45 21 L59 30 Z"
                fill="#fffdf7"
                stroke="#0f0f0f"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M17 24 L38 24 M27 20 L33 24 L27 28"
                fill="none"
                stroke="#0f0f0f"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="50" cy="21" r="1.4" fill="#0f0f0f" />
            </svg>
          </div>
        </div>
      )}
      <div
        key={`main-plane-burst-${mainPlaneExplosionKey}`}
        className={`plane-burst plane-burst--screen fixed z-[53] ${isMainPlaneExploding ? 'plane-burst--active' : ''}`}
        style={{ left: `${mainPlaneExplosionPoint.x}px`, top: `${mainPlaneExplosionPoint.y}px` }}
        aria-hidden="true"
      >
        <svg className="plane-burst__toon" viewBox="0 0 220 220" aria-hidden="true">
          <defs>
            <mask id="main-plane-burst-core-cutout">
              <rect x="0" y="0" width="220" height="220" fill="#fff" />
              <path
                d="M109 93 C118 86,130 88,135 98 C144 99,149 107,146 116 C149 125,143 133,133 134 C127 140,117 141,111 136 C100 139,90 134,88 126 C79 124,74 114,79 106 C77 97,85 89,94 90 C99 84,106 85,109 93 Z"
                fill="#000"
              />
            </mask>
          </defs>
          <path
            className="plane-burst__toon-star"
            d="M110 52 L121 84 L153 74 L136 99 L162 118 L129 122 L132 158 L111 132 L89 158 L92 122 L58 118 L84 99 L67 74 L99 84 Z"
          />
          <path
            className="plane-burst__toon-core"
            d="M109 68 C124 56,146 60,155 78 C173 79,184 95,177 112 C184 129,171 146,151 147 C139 162,117 167,104 154 C82 160,63 149,59 130 C40 126,31 107,39 90 C35 70,52 54,72 55 C83 42,100 43,109 68 Z"
            mask="url(#main-plane-burst-core-cutout)"
          />
          <path
            className="plane-burst__toon-core-detail"
            d="M109 93 C118 86,130 88,135 98 C144 99,149 107,146 116 C149 125,143 133,133 134 C127 140,117 141,111 136 C100 139,90 134,88 126 C79 124,74 114,79 106 C77 97,85 89,94 90 C99 84,106 85,109 93 Z"
          />
          <path className="plane-burst__toon-ray" d="M110 38 L110 24" />
          <path className="plane-burst__toon-ray" d="M143 46 L150 33" />
          <path className="plane-burst__toon-ray" d="M166 67 L179 60" />
          <path className="plane-burst__toon-ray" d="M174 100 L189 100" />
          <path className="plane-burst__toon-ray" d="M167 133 L180 140" />
          <path className="plane-burst__toon-ray" d="M143 155 L151 169" />
          <path className="plane-burst__toon-ray" d="M110 163 L110 178" />
          <path className="plane-burst__toon-ray" d="M77 155 L70 169" />
          <path className="plane-burst__toon-ray" d="M54 133 L41 140" />
          <path className="plane-burst__toon-ray" d="M46 100 L31 100" />
          <path className="plane-burst__toon-ray" d="M54 67 L41 60" />
          <path className="plane-burst__toon-ray" d="M77 46 L70 33" />
        </svg>
        <div className="plane-burst__puffs">
          {planeBurstPuffs.map((_, index) => (
            <span key={index} className="plane-burst__puff" />
          ))}
        </div>
      </div>
      {/* Contenu principal */}
      <div className="relative z-10">
        <div className="pointer-events-none fixed left-4 top-8 z-30 hidden w-[66vw] max-w-[420px] sm:left-8 sm:top-12 sm:w-[44vw] md:block md:w-[36vw] lg:w-[30vw] xl:w-[26vw]">
          <div
            ref={mediaVideoCardRef}
            className="media-tilt-card pointer-events-auto touch-manipulation overflow-hidden border border-[#0f0f0f]/10 bg-transparent aspect-[3005/4250]"
          >
            <img
              src={digitalGrowthExpertPhoto}
              alt="Digital Growth Expert"
              className="relative h-full w-full object-contain object-center"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>
        <div
          className="pointer-events-none fixed bottom-0 left-[max(24rem,24vw)] z-30 hidden lg:block"
          style={{ width: discoverPanelExpandedSize }}
        >
          <div
            ref={mediaLeftBottomCardRef}
            onClick={handleDiscoverCardClick}
            className="pointer-events-auto relative w-full cursor-pointer touch-manipulation overflow-hidden border border-[#0f0f0f]/10 bg-transparent shadow-[0_10px_30px_rgba(15,15,15,0.08)] transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[height]"
            style={{
              height: isDiscoverExpanded ? discoverPanelExpandedSize : discoverPanelCollapsedHeight
            }}
            aria-label={isDiscoverExpanded ? 'Replier Discover' : 'Deplier Discover'}
          >
            <div
              className="absolute inset-x-0 bottom-0"
              style={{ height: discoverPanelExpandedSize }}
            >
              <img
                src={discoverPhoto}
                alt="Discover artwork"
                className="h-full w-full object-contain object-center"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
        <div className="pointer-events-none fixed top-1/2 z-30 hidden w-[72vw] max-w-[640px] -translate-y-[6%] sm:w-[64vw] md:right-0 md:block md:w-[44vw] lg:w-[36vw] xl:w-[32vw]">
          <div
            ref={mediaRightCardRef}
            onClick={() => setIsRightPhotoExpanded((previous) => !previous)}
            className="pointer-events-auto cursor-pointer touch-manipulation overflow-hidden border-0 bg-transparent aspect-[1969/1125] will-change-[clip-path] transition-[clip-path] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              clipPath: isRightPhotoExpanded ? 'inset(0 0 0 0)' : 'inset(0 0 0 calc(100% - 88px))'
            }}
            aria-label={isRightPhotoExpanded ? 'Replier la photo' : 'Deplier la photo'}
          >
            <img
              src={airPhoto}
              alt="Composition geometrique"
              className="h-full w-full object-contain object-center"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>
        <div className="pointer-events-none fixed left-[42%] top-[-6%] z-40 hidden h-[clamp(620px,95vh,1200px)] w-[clamp(420px,38vw,760px)] -translate-x-1/2 md:block lg:left-[41%] xl:left-[40%]">
          <div className="pointer-events-auto h-full w-full overflow-visible bg-transparent">
            <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} fov={18} />
          </div>
        </div>
        <div className="pointer-events-none fixed right-4 top-8 z-30 hidden w-[46vw] max-w-[760px] sm:right-8 sm:top-10 md:block md:w-[43vw] lg:w-[39vw] xl:w-[36vw]">
          <div
            ref={mediaTopPhotoCardRef}
            className="media-tilt-card pointer-events-auto overflow-hidden border border-[#0f0f0f]/10 bg-white/10 backdrop-blur-[1px] aspect-[1838/1050]"
          >
            <img
              src={notchbarPhoto}
              alt="Notchbar 2.0 artwork"
              className="h-full w-full object-cover object-center"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>
        <div className="relative z-20 mx-auto flex w-full max-w-[430px] flex-col gap-4 px-4 pt-5 md:hidden">
          <div className="overflow-hidden border border-[#0f0f0f]/10 bg-transparent shadow-[0_10px_30px_rgba(15,15,15,0.08)] aspect-[3005/4250]">
            <img
              src={digitalGrowthExpertPhoto}
              alt="Digital Growth Expert"
              className="h-full w-full object-contain object-center"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <div className="overflow-hidden border border-[#0f0f0f]/10 bg-white/10 shadow-[0_10px_30px_rgba(15,15,15,0.08)] aspect-[1838/1050]">
            <img
              src={notchbarPhoto}
              alt="Notchbar 2.0 artwork"
              className="h-full w-full object-cover object-center"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <div className="overflow-hidden border border-[#0f0f0f]/10 bg-transparent shadow-[0_10px_30px_rgba(15,15,15,0.08)] aspect-[1969/1125]">
            <img
              src={airPhoto}
              alt="Composition geometrique"
              className="h-full w-full object-contain object-center"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <div className="overflow-hidden border border-[#0f0f0f]/10 bg-transparent shadow-[0_10px_30px_rgba(15,15,15,0.08)] aspect-square">
            <img
              src={discoverPhoto}
              alt="Discover artwork"
              className="h-full w-full object-contain object-center"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>
        {/* Nav centrée minimaliste */}
        <nav id="home-nav" className="relative z-40 mt-6 flex items-center justify-center pointer-events-none px-6 pb-6 md:mt-0 md:pb-0 md:fixed md:inset-0">
          <div
            ref={navGroupRef}
            className="nav-group flex flex-col items-center text-center space-y-4 text-sm font-black uppercase tracking-[0.2em] pointer-events-auto md:flex-row md:space-y-0 md:space-x-10 md:text-lg md:tracking-[0.26em]"
          >
            <Link to="/work" className="nav-link nav-link-swap text-[#0f0f0f]/80">Work</Link>
            <Link to="/about" className="nav-link nav-link-swap text-[#0f0f0f]/80">About</Link>
            <Link to="/contact" className="nav-link nav-link-swap text-[#0f0f0f]/80">Contact</Link>
          </div>
        </nav>

        {/* Scroll Progress Bar */}
        {/* <div className="fixed bottom-6 right-6 w-24 h-1 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div> */}

        {/* Hero Section */}
        {/* <section className="pt-32 pb-8 px-4">
          <HeroScrollDemo />
        </section> */}

        {/* <section id="work" className="py-8 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <a 
                href={project.link}
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-xl"
              >
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="flex items-center">
                    <ArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all" />
                  </p>  
                </div>
              </a>
            ))}
          </div>
        </section> */}

        {/* About Section */}
        {/* <section id="about" className="py-16 px-4">
          <div className="max-w-4xl ml-0 md:ml-12 bg-[#0a0a0a] text-white rounded-2xl p-8 shadow-2xl border border-white/5">
            <h2 className="text-4xl font-bold mb-8">About Me</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="text-lg font-bold mb-6">
                  Je suis un développeur créatif passionné par la création d'expériences numériques uniques et mémorables. 
                  Mon approche combine design innovant et développement technique pour donner vie à des projets ambitieux.
                </p>
                <p className="text-lg font-bold">
                  Avec une expertise en design et en développement web, je m'efforce de créer des solutions qui non seulement 
                  répondent aux besoins fonctionnels mais apportent aussi une réelle valeur ajoutée esthétique.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Expertise</h3>
                <ul className="space-y-2 font-bold">
                  <li>Web Design</li>
                  <li>Front-end Development</li>
                  <li>UI/UX Design</li>
                  <li>Creative Development</li>
                </ul>
              </div>
            </div>
          </div>
        </section> */}

        {/* Contact Section */}
        {/* <section id="contact" className="py-16 px-4">
          <div className="max-w-4xl ml-0 md:ml-12 bg-[#0a0a0a] text-white rounded-2xl p-8 shadow-2xl border border-white/5">
            <h2 className="text-4xl font-bold mb-8">Let's Work Together</h2>
            <div className="flex flex-col md:flex-row items-start space-y-8 md:space-y-0 md:space-x-12">
              <div className="flex-1">
                <p className="text-lg font-bold mb-8">
                  Intéressé par une collaboration ? N'hésitez pas à me contacter pour discuter de votre projet.
                </p>
                <div className="flex space-x-6">
                  <div className="flex flex-col items-center">
                    <a 
                      href="https://github.com/Tokennn" 
                      className="text-white hover:text-gray-200" 
                      title="Ça c'est mon GitHub yep !"
                    >
                      <Github size={24} />
                    </a>
                    <span className="text-sm text-white mt-1">GitHub</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <a 
                      href="https://www.linkedin.com/in/quentin-c-752996294/" 
                      className="text-white hover:text-gray-200" 
                      title="Go LinkedIn !"
                    >
                      <Linkedin size={24} />
                    </a>
                    <span className="text-sm text-white mt-1">LinkedIn</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <Link 
                      to="/contact" 
                      className="text-white hover:text-gray-200" 
                      title="Aller c'est partis pour le formulaire !"
                    >
                      <Mail size={24} />
                    </Link>
                    <span className="text-sm text-white mt-1">Email</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </div>
    </div>
  );
}

export default App;

function BackgroundOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Spline Background (commented per request) */}
      {/*
      <spline-viewer
        url="https://prod.spline.design/phRSX0hJurf0mICV/scene.splinecode"
        className="absolute inset-0 h-full w-full"
        style={{ filter: 'brightness(0.45)' }}
      />
      <div className="absolute inset-0 bg-black/30" />
      */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8f3ea] via-[#f2e6d7] to-[#fdf8ef]" />
      <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.85),transparent_38%),radial-gradient(circle_at_82%_6%,rgba(253,230,205,0.45),transparent_46%),radial-gradient(circle_at_24%_80%,rgba(210,175,140,0.28),transparent_50%)]" />
    </div>
  );
}
