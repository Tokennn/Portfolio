import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";

type WaterCursorProps = {
  size?: "sm" | "md";
  disabledOnWork?: boolean;
  interactionMode?: "full" | "text-only";
};

type CharMotionState = {
  influence: number;
  shiftX: number;
  shiftY: number;
  scale: number;
  rotate: number;
  chroma: number;
};

type BlockLensState = {
  influence: number;
};

const cursorSize = {
  md: 132,
  sm: 116
} as const;

const FLUID_OPTICS = {
  chromaticAberration: 0.05,
  ior: 1.15,
  thickness: 2,
  anisotropy: 0.01
} as const;

function WaterCursor({ size = "md", disabledOnWork = false, interactionMode = "full" }: WaterCursorProps) {
  const location = useLocation();
  const hostRef = useRef<HTMLDivElement>(null);
  const distortionRef = useRef<HTMLDivElement>(null);
  const edgeWarpRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const differenceRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const refractedElementsRef = useRef<HTMLElement[]>([]);
  const refractedBlockElementsRef = useRef<HTMLElement[]>([]);
  const refractedCharMapRef = useRef<Map<HTMLElement, HTMLSpanElement[]>>(new Map());
  const isEnabled = true;
  const isWorkRoute = location.pathname === "/work" || location.pathname.startsWith("/work/");
  const shouldRender = isEnabled && !(disabledOnWork && isWorkRoute);

  useEffect(() => {
    if (!shouldRender || !hostRef.current) return;

    const host = hostRef.current;
    const pxSize = cursorSize[size];
    const iorGain = (FLUID_OPTICS.ior - 1) * 10;
    const thicknessGain = FLUID_OPTICS.thickness * 0.5;
    const chromaGain = FLUID_OPTICS.chromaticAberration * 20;
    const anisotropyGain = 1 + FLUID_OPTICS.anisotropy * 12;
    host.style.width = `${pxSize}px`;
    host.style.height = `${pxSize}px`;
    document.body.classList.add("has-water-cursor");

    let x = window.innerWidth * 0.5;
    let y = window.innerHeight * 0.5;
    let tx = x;
    let ty = y;
    let lastMoveTime = 0;
    let lastFrameTs = performance.now();
    const charMotionMap = new WeakMap<HTMLSpanElement, CharMotionState>();
    const blockLensStateMap = new WeakMap<HTMLElement, BlockLensState>();
    const blockOverlayMap = new WeakMap<HTMLElement, HTMLDivElement>();
    const blockPositionRestoreMap = new WeakMap<HTMLElement, string>();

    const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
    const smoothstep = (edge0: number, edge1: number, value: number) => {
      const t = clamp01((value - edge0) / (edge1 - edge0));
      return t * t * (3 - 2 * t);
    };

    const clearBlockOverlays = () => {
      for (const block of refractedBlockElementsRef.current) {
        const overlay = blockOverlayMap.get(block);
        if (overlay?.isConnected) {
          overlay.remove();
        }

        if (blockPositionRestoreMap.has(block)) {
          block.style.position = blockPositionRestoreMap.get(block) ?? "";
        }
      }
      refractedBlockElementsRef.current = [];
    };

    const clearRefractedElements = () => {
      for (const [element, chars] of refractedCharMapRef.current.entries()) {
        chars.forEach((char) => {
          char.style.transform = "";
          char.style.filter = "";
          char.style.textShadow = "";
        });

        const originalText = element.dataset.refractableOriginalText;
        if (originalText != null) {
          element.textContent = originalText;
          delete element.dataset.refractableOriginalText;
          delete element.dataset.refractablePrepared;
        }
      }
      refractedCharMapRef.current.clear();
      clearBlockOverlays();
    };

    const prepareRefractedElement = (element: HTMLElement) => {
      if (element.dataset.refractablePrepared === "true") return;
      const originalText = element.textContent ?? "";
      element.dataset.refractableOriginalText = originalText;
      element.dataset.refractablePrepared = "true";

      const fragment = document.createDocumentFragment();
      const chars: HTMLSpanElement[] = [];

      for (const character of originalText) {
        const span = document.createElement("span");
        span.className = "work-refractable-char";
        span.textContent = character === " " ? "\u00A0" : character;
        if (character === " ") {
          span.style.width = "0.32em";
        }
        fragment.appendChild(span);
        chars.push(span);
      }

      element.textContent = "";
      element.appendChild(fragment);
      refractedCharMapRef.current.set(element, chars);
    };

    const ensureBlockOverlay = (element: HTMLElement) => {
      const existing = blockOverlayMap.get(element);
      if (existing?.isConnected) return existing;

      if (window.getComputedStyle(element).position === "static") {
        blockPositionRestoreMap.set(element, element.style.position);
        element.style.position = "relative";
      }

      const overlay = document.createElement("div");
      overlay.dataset.waterCursorBlockLens = "true";
      overlay.style.position = "absolute";
      overlay.style.inset = "0";
      overlay.style.pointerEvents = "none";
      overlay.style.borderRadius = "inherit";
      overlay.style.display = "none";
      overlay.style.opacity = "0";
      overlay.style.willChange =
        "opacity, backdrop-filter, -webkit-backdrop-filter, mask-image, -webkit-mask-image, box-shadow, background";
      overlay.style.zIndex = "2147483000";
      element.appendChild(overlay);
      blockOverlayMap.set(element, overlay);
      return overlay;
    };

    const isVisualBlockCandidate = (element: HTMLElement) => {
      if (element.classList.contains("work-refractable")) return false;
      if (element.classList.contains("work-refractable-char")) return false;
      if (element.dataset.refractablePrepared === "true") return false;
      if (element.dataset.waterCursorBlockLens === "true") return false;
      if (element.closest("[data-water-cursor-overlay='true']")) return false;

      const tag = element.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return false;

      const rect = element.getBoundingClientRect();
      if (rect.width < 12 || rect.height < 8) return false;
      if (rect.bottom < 0 || rect.right < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight) return false;
      if (rect.width > window.innerWidth * 0.98 && rect.height > window.innerHeight * 0.9) return false;

      const style = window.getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) <= 0.01) return false;
      if (style.display === "inline") return false;
      if (style.pointerEvents === "none" && tag !== "IMG" && tag !== "VIDEO") return false;

      if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SVG" || tag === "A" || tag === "BUTTON") {
        return true;
      }

      if (tag === "H1" || tag === "H2" || tag === "H3" || tag === "H4" || tag === "P" || tag === "LI") return false;

      const hasVisualStyle =
        style.backgroundImage !== "none" ||
        style.backgroundColor !== "rgba(0, 0, 0, 0)" ||
        Number.parseFloat(style.borderTopWidth) > 0 ||
        Number.parseFloat(style.borderRightWidth) > 0 ||
        Number.parseFloat(style.borderBottomWidth) > 0 ||
        Number.parseFloat(style.borderLeftWidth) > 0 ||
        style.boxShadow !== "none";

      if (hasVisualStyle) return true;

      const hasRenderableChildren = Array.from(element.children).some((child) => {
        if (!(child instanceof HTMLElement)) return false;
        const childRect = child.getBoundingClientRect();
        return childRect.width > 12 && childRect.height > 8;
      });

      return !hasRenderableChildren && (tag === "SECTION" || tag === "ARTICLE" || tag === "DIV");
    };

    const collectRefractedElements = () => {
      const scopeRoot =
        document.querySelector<HTMLElement>("[data-work-fluid-scope='true']") ??
        document.querySelector<HTMLElement>("main") ??
        document.body;
      const textElements = Array.from(scopeRoot.querySelectorAll<HTMLElement>(".work-refractable"));
      textElements.forEach(prepareRefractedElement);
      refractedElementsRef.current = textElements;

      if (interactionMode === "text-only") {
        clearBlockOverlays();
        return;
      }

      const allCandidates = Array.from(scopeRoot.querySelectorAll<HTMLElement>("*")).filter(isVisualBlockCandidate);
      const mediaTags = new Set(["IMG", "VIDEO", "CANVAS", "SVG"]);
      const mediaCandidates = allCandidates.filter((node) => mediaTags.has(node.tagName));
      const containerCandidates = allCandidates.filter((node) => !mediaTags.has(node.tagName));

      const dedupedContainers: HTMLElement[] = [];
      for (const candidate of containerCandidates) {
        const hasAncestorCandidate = dedupedContainers.some((existing) => existing.contains(candidate));
        if (hasAncestorCandidate) continue;
        dedupedContainers.push(candidate);
      }

      const merged = [...dedupedContainers, ...mediaCandidates];
      const blockElements = merged
        .sort((a, b) => {
          const ar = a.getBoundingClientRect();
          const br = b.getBoundingClientRect();
          return br.width * br.height - ar.width * ar.height;
        })
        .slice(0, 32);
      const nextBlockSet = new Set(blockElements);
      for (const previousBlock of refractedBlockElementsRef.current) {
        if (nextBlockSet.has(previousBlock)) continue;
        const overlay = blockOverlayMap.get(previousBlock);
        if (overlay?.isConnected) {
          overlay.remove();
        }
        if (blockPositionRestoreMap.has(previousBlock)) {
          previousBlock.style.position = blockPositionRestoreMap.get(previousBlock) ?? "";
        }
      }
      blockElements.forEach(ensureBlockOverlay);
      refractedBlockElementsRef.current = blockElements;
    };

    collectRefractedElements();
    let collectScheduled = false;
    const scheduleCollect = () => {
      if (collectScheduled) return;
      collectScheduled = true;
      window.requestAnimationFrame(() => {
        collectScheduled = false;
        collectRefractedElements();
      });
    };
    const mutationObserver = new MutationObserver(scheduleCollect);
    const observeRoot =
      document.querySelector<HTMLElement>("[data-work-fluid-scope='true']") ??
      document.querySelector<HTMLElement>("main") ??
      document.body;
    mutationObserver.observe(observeRoot, { childList: true, subtree: true });

    const stopLoop = () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const frame = (now: number) => {
      const deltaMs = Math.max(8, Math.min(34, now - lastFrameTs));
      lastFrameTs = now;
      const deltaSec = deltaMs / 1000;
      const followAlpha = 1 - Math.exp(-deltaSec * 13.2);

      x += (tx - x) * followAlpha;
      y += (ty - y) * followAlpha;

      const dx = tx - x;
      const dy = ty - y;
      const speed = Math.min(1, Math.hypot(dx, dy) / 26);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const fluidBlend = 1 - Math.exp(-deltaSec * 8.2);

      host.style.transform = `translate3d(${x - pxSize / 2}px, ${y - pxSize / 2}px, 0)`;
      host.style.opacity = `${0.9 + speed * 0.1}`;

      if (distortionRef.current) {
        distortionRef.current.style.opacity = `${0.12 + speed * 0.08}`;
        const blur = (2.4 + speed * 1.8 * thicknessGain) * anisotropyGain;
        const saturate = 1.42 + chromaGain * 0.22 + speed * 0.58;
        const contrast = 1.2 + iorGain * 0.08 + speed * 0.14;
        const brightness = 1.01 + speed * 0.045;
        const backdrop = `blur(${blur.toFixed(2)}px) saturate(${saturate.toFixed(2)}) contrast(${contrast.toFixed(2)}) brightness(${brightness.toFixed(2)})`;
        distortionRef.current.style.backdropFilter = backdrop;
        distortionRef.current.style.webkitBackdropFilter = backdrop;
      }

      if (edgeWarpRef.current) {
        edgeWarpRef.current.style.opacity = `${0.24 + speed * 0.12}`;
        const blur = (5.8 + speed * 3.6 * thicknessGain) * anisotropyGain;
        const saturate = 2.1 + chromaGain * 0.34 + speed * 0.72;
        const contrast = 1.34 + iorGain * 0.14 + speed * 0.22;
        const brightness = 1.04 + speed * 0.075;
        const backdrop = `blur(${blur.toFixed(2)}px) saturate(${saturate.toFixed(2)}) contrast(${contrast.toFixed(2)}) brightness(${brightness.toFixed(2)})`;
        edgeWarpRef.current.style.backdropFilter = backdrop;
        edgeWarpRef.current.style.webkitBackdropFilter = backdrop;
        edgeWarpRef.current.style.transform = `rotate(${angle + 16}deg) scale(${1 + speed * 0.09})`;
      }

      if (lensRef.current) {
        lensRef.current.style.opacity = `${0.08 + speed * 0.05}`;
        const blur = (3.6 + speed * 2.1 * thicknessGain) * anisotropyGain;
        const saturate = 2.26 + chromaGain * 0.46 + speed * 0.66;
        const contrast = 1.3 + iorGain * 0.16 + speed * 0.2;
        const brightness = 1.03 + speed * 0.055;
        const backdrop = `blur(${blur.toFixed(2)}px) saturate(${saturate.toFixed(2)}) contrast(${contrast.toFixed(2)}) brightness(${brightness.toFixed(2)})`;
        lensRef.current.style.backdropFilter = backdrop;
        lensRef.current.style.webkitBackdropFilter = backdrop;
        lensRef.current.style.transform = `scale(${0.98 + speed * 0.06})`;
      }

      if (highlightRef.current) {
        highlightRef.current.style.opacity = `${0.08 + speed * 0.08}`;
        highlightRef.current.style.transform = `rotate(${angle + 22}deg) scale(${1 + speed * 0.08})`;
      }

      if (glowRef.current) {
        glowRef.current.style.opacity = `${0.02 + speed * 0.03}`;
      }

      if (differenceRef.current) {
        differenceRef.current.style.opacity = `${0.005 + speed * 0.015}`;
        differenceRef.current.style.transform = `rotate(${angle * 0.35}deg) scale(${1 + speed * 0.1})`;
      }

      const lensRadius = pxSize * 0.52;
      const ringBandPx = Math.max(2.4, lensRadius * 0.052);
      const contactSlackPx = Math.max(0.35, lensRadius * 0.004);
      const contactFalloffPx = Math.max(4.2, lensRadius * 0.065);
      const elements = refractedElementsRef.current;
      const blockElements = refractedBlockElementsRef.current;

      for (const element of elements) {
        const chars = refractedCharMapRef.current.get(element);
        if (!chars?.length) continue;

        for (const char of chars) {
          const rect = char.getBoundingClientRect();
          const centerX = rect.left + rect.width * 0.5;
          const centerY = rect.top + rect.height * 0.5;
          const dxCenter = centerX - x;
          const dyCenter = centerY - y;
          const centerDistance = Math.hypot(dxCenter, dyCenter);

          const nearestX = Math.min(Math.max(x, rect.left), rect.right);
          const nearestY = Math.min(Math.max(y, rect.top), rect.bottom);
          const outsideDistance = Math.hypot(x - nearestX, y - nearestY);
          const isInsideRect = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

          let distanceToRectBoundary = outsideDistance;
          if (isInsideRect) {
            const toLeft = x - rect.left;
            const toRight = rect.right - x;
            const toTop = y - rect.top;
            const toBottom = rect.bottom - y;
            distanceToRectBoundary = Math.min(toLeft, toRight, toTop, toBottom);
          }

          const penetration = lensRadius - distanceToRectBoundary;
          const contactBand = ringBandPx + contactSlackPx;
          const ringDelta = Math.abs(distanceToRectBoundary - lensRadius);
          const edgeWeight = Math.exp(-Math.pow(ringDelta, 2) / (2 * Math.pow(contactBand, 2)));
          const penetrationWeight = penetration <= 0 ? 0 : smoothstep(0, contactFalloffPx, penetration);
          const influence = edgeWeight * penetrationWeight;

          let motion = charMotionMap.get(char);
          if (!motion) {
            motion = { influence: 0, shiftX: 0, shiftY: 0, scale: 1, rotate: 0, chroma: 0 };
            charMotionMap.set(char, motion);
          }

          if (influence < 0.02 && motion.influence < 0.02) {
            char.style.transform = "";
            char.style.filter = "";
            char.style.textShadow = "";
            motion.influence = 0;
            motion.shiftX = 0;
            motion.shiftY = 0;
            motion.scale = 1;
            motion.rotate = 0;
            motion.chroma = 0;
            continue;
          }

          const towardCenterX = x - centerX;
          const towardCenterY = y - centerY;
          const towardCenterLength = Math.hypot(towardCenterX, towardCenterY);
          const directionX =
            towardCenterLength > 0 ? towardCenterX / towardCenterLength : centerDistance > 0 ? -dxCenter / centerDistance : 0;
          const directionY =
            towardCenterLength > 0 ? towardCenterY / towardCenterLength : centerDistance > 0 ? -dyCenter / centerDistance : 0;
          const targetShiftMagnitude = Math.pow(influence, 0.95) * 12.5;
          const targetShiftX = directionX * targetShiftMagnitude;
          const targetShiftY = directionY * (targetShiftMagnitude * 0.7);
          const targetScale = 1 + influence * 0.14;
          const targetRotate = directionX * influence * 7;
          const targetChromaShift = influence * (1.1 + chromaGain * 2.8);

          motion.influence += (influence - motion.influence) * fluidBlend;
          motion.shiftX += (targetShiftX - motion.shiftX) * fluidBlend;
          motion.shiftY += (targetShiftY - motion.shiftY) * fluidBlend;
          motion.scale += (targetScale - motion.scale) * fluidBlend;
          motion.rotate += (targetRotate - motion.rotate) * fluidBlend;
          motion.chroma += (targetChromaShift - motion.chroma) * fluidBlend;

          const activeInfluence = motion.influence;
          if (activeInfluence < 0.01) {
            char.style.transform = "";
            char.style.filter = "";
            char.style.textShadow = "";
            continue;
          }

          char.style.transform = `translate3d(${motion.shiftX.toFixed(2)}px, ${motion.shiftY.toFixed(2)}px, 0) scale(${motion.scale.toFixed(3)}) rotate(${motion.rotate.toFixed(2)}deg)`;
          char.style.filter = `contrast(${(1 + activeInfluence * 1.15).toFixed(3)}) saturate(${(1 + activeInfluence * 1.2).toFixed(3)}) brightness(${(1 + activeInfluence * 0.1).toFixed(3)})`;
          char.style.textShadow = `${(motion.shiftX * 0.12 + motion.chroma).toFixed(2)}px ${(motion.shiftY * 0.12).toFixed(2)}px ${(0.2 + activeInfluence * 0.7).toFixed(2)}px rgba(93,198,255,0.58), ${(motion.shiftX * 0.12 - motion.chroma).toFixed(2)}px ${(motion.shiftY * 0.12).toFixed(2)}px ${(0.2 + activeInfluence * 0.7).toFixed(2)}px rgba(255,145,101,0.48), ${(motion.shiftX * 0.24).toFixed(2)}px ${(motion.shiftY * 0.24).toFixed(2)}px ${Math.max(0.18, activeInfluence * 0.95).toFixed(2)}px rgba(255,255,255,0.26)`;
        }
      }

      const blockBlend = 1 - Math.exp(-deltaSec * 7.4);
      const nearMargin = lensRadius + contactFalloffPx + ringBandPx + contactSlackPx + 26;
      for (const block of blockElements) {
        const overlay = blockOverlayMap.get(block);
        if (!overlay?.isConnected) continue;

        const rect = block.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) continue;

        let state = blockLensStateMap.get(block);
        if (!state) {
          state = { influence: 0 };
          blockLensStateMap.set(block, state);
        }

        const isFarAway =
          x < rect.left - nearMargin ||
          x > rect.right + nearMargin ||
          y < rect.top - nearMargin ||
          y > rect.bottom + nearMargin;
        if (isFarAway) {
          state.influence += (0 - state.influence) * blockBlend;
          overlay.style.opacity = "0";
          overlay.style.display = "none";
          continue;
        }
        overlay.style.display = "block";

        const nearestX = Math.min(Math.max(x, rect.left), rect.right);
        const nearestY = Math.min(Math.max(y, rect.top), rect.bottom);
        const outsideDistance = Math.hypot(x - nearestX, y - nearestY);
        const isInsideRect = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

        let distanceToRectBoundary = outsideDistance;
        if (isInsideRect) {
          const toLeft = x - rect.left;
          const toRight = rect.right - x;
          const toTop = y - rect.top;
          const toBottom = rect.bottom - y;
          distanceToRectBoundary = Math.min(toLeft, toRight, toTop, toBottom);
        }

        const penetration = lensRadius - distanceToRectBoundary;
        const contactBand = ringBandPx + contactSlackPx;
        const ringDelta = Math.abs(distanceToRectBoundary - lensRadius);
        const edgeWeight = Math.exp(-Math.pow(ringDelta, 2) / (2 * Math.pow(contactBand, 2)));
        const penetrationWeight = penetration <= 0 ? 0 : smoothstep(0, contactFalloffPx, penetration);
        const influence = edgeWeight * penetrationWeight;

        state.influence += (influence - state.influence) * blockBlend;
        const active = state.influence;
        if (active < 0.01) {
          overlay.style.opacity = "0";
          overlay.style.display = "none";
          continue;
        }

        const localX = x - rect.left;
        const localY = y - rect.top;
        const blur = (1.6 + active * 4.8 * thicknessGain).toFixed(2);
        const saturate = (1.14 + active * (0.82 + chromaGain * 0.22)).toFixed(3);
        const contrast = (1.06 + active * (0.24 + iorGain * 0.08)).toFixed(3);
        const brightness = (1 + active * 0.05).toFixed(3);
        const maskRadius = lensRadius * 1.02;
        const alpha = (0.04 + active * 0.7).toFixed(3);
        const ringAlpha = (0.16 + active * 0.28).toFixed(3);
        const caAlpha = (active * 0.16).toFixed(3);
        const whiteCoreAlpha = (0.03 + active * 0.08).toFixed(3);

        overlay.style.opacity = alpha;
        overlay.style.backdropFilter = `blur(${blur}px) saturate(${saturate}) contrast(${contrast}) brightness(${brightness})`;
        overlay.style.webkitBackdropFilter = overlay.style.backdropFilter;
        overlay.style.maskImage = `radial-gradient(circle ${maskRadius.toFixed(2)}px at ${localX.toFixed(2)}px ${localY.toFixed(2)}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 72%, rgba(0,0,0,0.42) 86%, rgba(0,0,0,0) 100%)`;
        overlay.style.webkitMaskImage = overlay.style.maskImage;
        overlay.style.background = `radial-gradient(circle ${(maskRadius * 0.9).toFixed(2)}px at ${localX.toFixed(2)}px ${localY.toFixed(2)}px, rgba(255,255,255,${whiteCoreAlpha}) 0%, rgba(255,255,255,0.01) 62%, rgba(255,255,255,0) 100%), conic-gradient(from ${(angle + 90).toFixed(2)}deg at ${localX.toFixed(2)}px ${localY.toFixed(2)}px, rgba(95,198,255,${caAlpha}), rgba(255,168,116,${(active * 0.12).toFixed(3)}), rgba(170,146,255,${(active * 0.1).toFixed(3)}), rgba(95,198,255,${caAlpha}))`;
        overlay.style.boxShadow = `inset 0 0 0 1px rgba(255,255,255,${ringAlpha}), 0 0 ${(8 + active * 14).toFixed(2)}px rgba(132,206,255,${(0.04 + active * 0.12).toFixed(3)})`;
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
      mutationObserver.disconnect();
      clearRefractedElements();
      document.body.classList.remove("has-water-cursor");
    };
  }, [interactionMode, shouldRender, size]);

  if (!shouldRender) return null;

  return createPortal(
    <div
      ref={hostRef}
      className="pointer-events-none fixed left-0 top-0 z-[2147483647] will-change-transform"
      aria-hidden="true"
      data-water-cursor-overlay="true"
      style={{
        borderRadius: "50%",
        background: "transparent",
        border: "none",
        boxShadow: "0 2px 7px rgba(10,14,20,0.05)"
      }}
    >
      <div
        ref={distortionRef}
        className="absolute inset-0"
        style={{
          borderRadius: "50%",
          opacity: 0.16,
          background: "transparent",
          backdropFilter: "blur(2.2px) saturate(1.35) contrast(1.14) brightness(1.01)",
          WebkitBackdropFilter: "blur(2.2px) saturate(1.35) contrast(1.14) brightness(1.01)"
        }}
      />
      <div
        ref={edgeWarpRef}
        className="absolute inset-[-2.8%] will-change-transform"
        style={{
          borderRadius: "50%",
          opacity: 0.34,
          background: "transparent",
          backdropFilter: "blur(5.5px) saturate(2.25) contrast(1.45) brightness(1.04)",
          WebkitBackdropFilter: "blur(5.5px) saturate(2.25) contrast(1.45) brightness(1.04)",
          boxShadow: "0 0 12px rgba(148, 214, 255, 0.18)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,1) 74%, rgba(0,0,0,1) 88%, transparent 100%)",
          maskImage:
            "radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,1) 74%, rgba(0,0,0,1) 88%, transparent 100%)"
        }}
      />
      <div
        ref={lensRef}
        className="absolute inset-[9%] will-change-transform"
        style={{
          borderRadius: "50%",
          opacity: 0.12,
          background: "transparent",
          backdropFilter: "blur(3.5px) saturate(2.3) contrast(1.32) brightness(1.02)",
          WebkitBackdropFilter: "blur(3.5px) saturate(2.3) contrast(1.32) brightness(1.02)"
        }}
      />
      <div
        ref={glowRef}
        className="absolute inset-[-12%]"
        style={{
          borderRadius: "50%",
          opacity: 0.02,
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2), rgba(255,255,255,0.04) 46%, rgba(255,255,255,0) 72%)",
          filter: "blur(5px)"
        }}
      />
      <div
        ref={highlightRef}
        className="absolute inset-[-2%] will-change-transform"
        style={{
          borderRadius: "50%",
          opacity: 0.1,
          mixBlendMode: "screen",
          background:
            "radial-gradient(circle at 24% 14%, rgba(255,255,255,0.66), rgba(255,255,255,0.04) 35%, rgba(255,255,255,0) 52%)",
          filter: "blur(0.5px)"
        }}
      />
      <div
        ref={differenceRef}
        className="absolute inset-[11%] will-change-transform"
        style={{
          borderRadius: "50%",
          opacity: 0.004,
          mixBlendMode: "normal",
          background:
            "radial-gradient(circle at 45% 40%, rgba(255,255,255,0.5), rgba(255,255,255,0.16) 48%, rgba(255,255,255,0.08) 70%, rgba(255,255,255,0) 100%)",
          filter: "blur(0.45px)"
        }}
      />
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: "14px",
          height: "14px",
          transform: "translate(-50%, -50%)",
          opacity: 0.58
        }}
      >
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "14px",
            height: "1px",
            transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.72)",
            boxShadow: "0 0 4px rgba(0,0,0,0.18)"
          }}
        />
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "1px",
            height: "14px",
            transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.72)",
            boxShadow: "0 0 4px rgba(0,0,0,0.18)"
          }}
        />
      </div>
    </div>,
    document.body
  );
}

export default WaterCursor;
