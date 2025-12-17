import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const projects = [
  {
    title: "Langage-Sensei",
    description: "Sparring linguistique en ligne avec cartes d'expressions, parcours progressifs et micro-interactions.",
    image: "https://cdn.midjourney.com/bf612167-d186-46f9-8141-ad6e799fa243/0_1.png",
    link: "https://langage-sensei.netlify.app/",
    tag: "Product design",
    accent: "from-emerald-200/80 via-teal-50/85 to-amber-50/85",
    glow: "radial-gradient(circle at 18% 24%, rgba(52, 211, 153, 0.24), transparent 46%), radial-gradient(circle at 72% 70%, rgba(251, 191, 36, 0.22), transparent 52%)"
  },
  {
    title: "MoveSmart",
    description: "Assistant d'aménagement intelligent : calcul d'itinéraires, inventaire et suivi des étapes clés.",
    image: "https://cdn.midjourney.com/c5b6d334-83c3-4d27-ace8-00ca180a65ce/0_2.png",
    link: "https://movesmart.netlify.app/",
    tag: "Creative dev",
    accent: "from-indigo-200/80 via-sky-50/85 to-amber-50/80",
    glow: "radial-gradient(circle at 76% 16%, rgba(129, 140, 248, 0.26), transparent 48%), radial-gradient(circle at 22% 70%, rgba(56, 189, 248, 0.22), transparent 52%)"
  },
  {
    title: "Blog.V1",
    description: "Tableau de bord live pour suivre la performance produit : métriques clés, alertes et recommandations d'action.",
    image: "https://cdn.midjourney.com/a518c278-f137-4339-b5df-27c8643dbb49/0_0.jpeg",
    link: "https://blogv1qc.netlify.app/",
    tag: "Product ops",
    accent: "from-amber-200/80 via-orange-50/85 to-white/90",
    glow: "radial-gradient(circle at 55% 82%, rgba(251, 191, 36, 0.28), transparent 56%), radial-gradient(circle at 24% 32%, rgba(251, 146, 60, 0.22), transparent 52%)"
  }
];

function Work() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];

  const previousProjects = projects.slice(0, activeIndex);
  const nextProjects = projects.slice(activeIndex + 1);

  const goPrev = () => setActiveIndex((index) => (index - 1 + projects.length) % projects.length);
  const goNext = () => setActiveIndex((index) => (index + 1) % projects.length);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setActiveIndex((index) => (index - 1 + projects.length) % projects.length);
      }
      if (event.key === 'ArrowRight') {
        setActiveIndex((index) => (index + 1) % projects.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f8f3ea] via-[#f2e6d7] to-[#fdf8ef] text-[#0f0f0f] px-4 md:px-8 py-12 md:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.85),transparent_38%),radial-gradient(circle_at_82%_6%,rgba(253,230,205,0.45),transparent_46%),radial-gradient(circle_at_24%_80%,rgba(210,175,140,0.28),transparent_50%)]" />

      <header className="relative flex justify-end gap-8 text-sm font-semibold mb-10 md:mb-14">
        <a href="/" className="text-[#3a3a3a] hover:text-[#0f0f0f] transition-colors">Home</a>
        <a href="/work" className="text-[#0f0f0f] underline decoration-amber-500/60 decoration-2 underline-offset-8">Work</a>
        <a href="/#about" className="text-[#3a3a3a] hover:text-[#0f0f0f] transition-colors">About</a>
        <a href="/contact" className="text-[#3a3a3a] hover:text-[#0f0f0f] transition-colors">Contact</a>
      </header>

      <WaterCursor />

      <main className="relative max-w-6xl mx-auto space-y-10 md:space-y-14">
        <section className="relative isolate overflow-hidden rounded-[32px] border border-[#dccfb9] bg-white/90 shadow-[0_24px_70px_rgba(52,34,18,0.14)] px-4 py-8 md:px-10 md:py-12 reveal-up">
          <div className="relative z-10 grid md:grid-cols-[0.8fr_1.6fr_0.8fr] items-center gap-6 md:gap-10">
            <div className="hidden md:flex flex-col items-end gap-3 text-sm uppercase tracking-[0.24em] text-[#0f0f0f] pr-2 reveal-up delay-1">
              {previousProjects.map((project, idx) => (
                <button
                  key={project.title}
                  onClick={() => setActiveIndex(idx)}
                  className="transition-all duration-300 hover:text-[#0f0f0f] hover:translate-x-2"
                >
                  {project.title}
                </button>
              ))}
            </div>

            <div
              key={activeProject.title}
              className="group relative isolate rounded-[30px] overflow-hidden border border-[#e6d9c6] bg-white shadow-[0_18px_60px_rgba(52,34,18,0.14)] reveal-up delay-2 fade-in transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(52,34,18,0.16)]"
            >
              <div className="relative z-10 flex flex-col gap-6 md:gap-8 p-8 md:p-10 items-center text-center transition-colors duration-500">
                <div className="flex flex-col items-center gap-3">
                  <span className="rounded-full border border-[#d5c5ad] bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#0f0f0f]">
                    {activeProject.tag}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-black text-[#0a0a0a] leading-tight">
                    {activeProject.title}
                  </h1>
                  <p className="text-base md:text-lg text-[#1f1f1f] max-w-2xl leading-relaxed">
                    {activeProject.description}
                  </p>
                </div>

                <div className="relative w-full">
                  <div className="absolute inset-4 rounded-[26px] border border-[#e2d6c3]/80 shadow-[0_14px_40px_rgba(52,34,18,0.12)] pointer-events-none" />
                  <div className="relative overflow-hidden rounded-[24px] border border-[#f1e4d2]/70 bg-white shadow-[0_20px_60px_rgba(52,34,18,0.12)] transition duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-1 group-hover:shadow-[0_20px_60px_rgba(52,34,18,0.18)]">
                    <img
                      src={activeProject.image}
                      alt={activeProject.title}
                      className="relative w-full h-72 md:h-96 object-cover object-center transition duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
                      draggable={false}
                    />
                  </div>
                </div>

                <a
                  href={activeProject.link}
                  className="inline-flex items-center gap-3 text-sm font-semibold text-[#0f0f0f] uppercase tracking-[0.28em] transition-transform duration-300 hover:translate-y-[-2px]"
                >
                  Voir le projet
                  <ArrowRight className="h-5 w-5 text-[#0f0f0f]" />
                </a>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-start gap-3 text-sm uppercase tracking-[0.24em] text-[#0f0f0f] pl-2 reveal-up delay-1">
              {nextProjects.map((project, idx) => {
                const absoluteIndex = activeIndex + 1 + idx;
                return (
                  <button
                    key={project.title}
                    onClick={() => setActiveIndex(absoluteIndex)}
                    className="transition-all duration-300 hover:text-[#0f0f0f] hover:-translate-x-2"
                  >
                    {project.title}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="relative flex items-center justify-center gap-4 md:gap-6 text-sm font-semibold text-[#0f0f0f] reveal-up delay-2">
          <button
            onClick={goPrev}
            className="inline-flex items-center gap-2 rounded-full border border-[#d9cbb4] bg-white/85 px-4 py-2 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#0f0f0f]"
          >
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </button>
          <span className="text-xs uppercase tracking-[0.28em] text-[#2f2f2f]">
            0{activeIndex + 1} / 0{projects.length}
          </span>
          <button
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-full border border-[#d9cbb4] bg-white/85 px-4 py-2 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#0f0f0f]"
          >
            Suivant
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}

function WaterCursor() {
  const blobRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number>();

  useEffect(() => {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    const triggerRipple = () => {
      if (!rippleRef.current) return;
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
      triggerRipple();
    };

    const animate = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;

      if (blobRef.current) {
        blobRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (shimmerRef.current) {
        shimmerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handleMove);
    animate();

    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

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

export default Work;
