import { useEffect } from "react";
import gsap from "gsap";

interface UseTextRevealOptions {
  selector?: string;
  y?: number;
  duration?: number;
  stagger?: number;
  rootMargin?: string;
  threshold?: number;
  outDuration?: number;
}

export function useTextReveal({
  selector = "[data-reveal='text']",
  y = 26,
  duration = 0.7,
  stagger = 0.03,
  rootMargin = "0px 0px -28% 0px",
  threshold = 0.1,
  outDuration = 0.35
}: UseTextRevealOptions = {}) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!elements.length) return;

    const splitText = (el: HTMLElement) => {
      const hasWords = el.querySelector(".reveal-word");
      if (el.dataset.revealProcessed === "true" && hasWords) return;
      const text = el.textContent?.trim();
      if (!text) return;
      const isOnload =
        el.dataset.revealOnload === "true" ||
        el.dataset.revealOnload === "1" ||
        el.dataset.revealImmediate === "true" ||
        el.dataset.revealImmediate === "1";
      el.dataset.revealProcessed = "true";
      el.setAttribute("aria-label", text);
      el.setAttribute("role", "text");
      el.textContent = "";

      const words = text.split(/\s+/);
      words.forEach((word, index) => {
        const span = document.createElement("span");
        span.className = "reveal-word";
        span.setAttribute("aria-hidden", "true");
        span.textContent = word;
        el.appendChild(span);
        if (index < words.length - 1) {
          el.appendChild(document.createTextNode(" "));
        }
      });

      const wordEls = el.querySelectorAll<HTMLElement>(".reveal-word");
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (isOnload && inView) {
        gsap.set(wordEls, { y: 0, opacity: 1 });
        el.dataset.revealState = "visible";
        requestAnimationFrame(() => {
          gsap.from(wordEls, {
            y,
            opacity: 0,
            duration,
            ease: "power3.out",
            stagger
          });
        });
      } else {
        gsap.set(wordEls, { y, opacity: 0 });
        el.dataset.revealState = "hidden";
      }

    };

    elements.forEach(splitText);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const words = el.querySelectorAll<HTMLElement>(".reveal-word");
          if (!words.length) {
            observer.unobserve(el);
            return;
          }

          gsap.killTweensOf(words);

          if (entry.isIntersecting) {
            if (el.dataset.revealState !== "visible") {
              el.dataset.revealState = "visible";
              gsap.fromTo(
                words,
                { y, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration,
                  ease: "power3.out",
                  stagger
                }
              );
            }
            return;
          }

          if (el.dataset.revealState !== "hidden") {
            el.dataset.revealState = "hidden";
            gsap.to(words, {
              y,
              opacity: 0,
              duration: outDuration,
              ease: "power2.in",
              stagger: 0.01
            });
          }
        });
      },
      { rootMargin, threshold }
    );

    elements.forEach((el) => observer.observe(el));

    let mutationRaf: number | null = null;
    const mutationObserver = new MutationObserver(() => {
      if (mutationRaf !== null) return;
      mutationRaf = requestAnimationFrame(() => {
        mutationRaf = null;
        const updated = Array.from(document.querySelectorAll<HTMLElement>(selector));
        updated.forEach((el) => {
          splitText(el);
          observer.observe(el);
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      if (mutationRaf !== null) {
        cancelAnimationFrame(mutationRaf);
      }
    };
  }, [selector, y, duration, stagger, rootMargin, threshold, outDuration]);
}

export default useTextReveal;
