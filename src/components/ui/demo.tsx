"use client";
import React, { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

export function HeroScrollDemo() {
  const noteCardImage =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'><rect width='800' height='1000' fill='%23212121'/><rect x='170' y='180' width='460' height='640' fill='%23f3eedf' stroke='none' rx='4'/><text x='210' y='240' font-family='\"Courier New\", monospace' font-size='26' fill='%23212121'>ROEVI0W</text><text x='210' y='280' font-family='\"Courier New\", monospace' font-size='24' fill='%23212121'>Pr0Jc7re</text><text x='210' y='320' font-family='\"Courier New\", monospace' font-size='24' fill='%23212121'>Diotck.</text><text x='210' y='360' font-family='\"Courier New\", monospace' font-size='24' fill='%23212121'>A1. /ytttiosjt,</text><text x='210' y='400' font-family='\"Courier New\", monospace' font-size='24' fill='%23212121'>Rigjlot</text><text x='210' y='440' font-family='\"Courier New\", monospace' font-size='24' fill='%23212121'>Peonor, Mamy iovo</text><text x='210' y='480' font-family='\"Courier New\", monospace' font-size='24' fill='%23212121'>BLIRIS: Pix 1gtb</text><text x='210' y='520' font-family='\"Courier New\", monospace' font-size='24' fill='%23212121'>AB. Noy. Crause.</text><text x='210' y='560' font-family='\"Courier New\", monospace' font-size='24' fill='%23212121'>AG Nc. Tractg%aecke,</text></svg>";
  const projects = [
    {
      title: "Langage-Sensei",
      description: "Sparring linguistique en ligne avec cartes d'expressions, parcours progressifs et micro-interactions.",
      image: "https://cdn.midjourney.com/bf612167-d186-46f9-8141-ad6e799fa243/0_1.png",
      link: "https://langage-sensei.netlify.app/",
      tag: "Product design",
      accent: "from-emerald-300/70 via-cyan-500/60 to-slate-900/70",
      glow: "radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.35), transparent 45%)"
    },
    {
      title: "MoveSmart",
      description: "Assistant d'aménagement intelligent : calcul d'itinéraires, inventaire et suivi des étapes clés.",
      image: "https://cdn.midjourney.com/c5b6d334-83c3-4d27-ace8-00ca180a65ce/0_2.png",
      link: "https://movesmart.netlify.app/",
      tag: "Creative dev",
      accent: "from-violet-300/70 via-indigo-500/60 to-slate-900/70",
      glow: "radial-gradient(circle at 80% 10%, rgba(129, 140, 248, 0.35), transparent 45%)"
    },
    {
      title: "Blog.V1",
      description: "Tableau de bord live pour suivre la performance produit : métriques clés, alertes et recommandations d'action.",
      image: "https://cdn.midjourney.com/a518c278-f137-4339-b5df-27c8643dbb49/0_0.jpeg",
      link: "https://blogv1qc.netlify.app/",
      tag: "Product ops",
      accent: "from-amber-200/80 via-orange-300/60 to-white/70",
      glow: "radial-gradient(circle at 55% 85%, rgba(251, 191, 36, 0.35), transparent 60%)"
    }
  ];

  return (
    <div className="relative flex flex-col overflow-hidden px-4 pb-32 pt-20 md:pt-40">
      <CursorBlur />
      <div className="max-w-6xl mx-auto w-full space-y-12">
        <div className="relative z-10">
          <h1 className="text-4xl font-semibold text-black dark:text-white mb-4">
            Découvrez mes
          </h1>
          <p className="text-4xl md:text-[5rem] font-bold leading-none text-black dark:text-white">
            Projets
          </p>
        </div>

        <div className="relative z-10 space-y-8">
          {projects.map((project, index) => (
            <a
              href={project.link}
              key={index}
              className="group block w-full relative isolate overflow-hidden rounded-[28px] border border-white/20 bg-white/8 shadow-[0_25px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-transform duration-500 hover:-translate-y-2"
            >
              <div
                className={`absolute inset-0 opacity-90 bg-gradient-to-br ${project.accent}`}
              />
              <div
                className="absolute inset-0 opacity-60 blur-[90px]"
                style={{ background: project.glow }}
              />
              <div className="relative z-10 flex flex-col gap-4 p-8">
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-white/70">
                  <span className="rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold">
                    {project.tag}
                  </span>
                  <ArrowRight className="h-5 w-5 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100 group-hover:text-white text-white/50" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-semibold text-white drop-shadow-sm">
                    {project.title}
                  </h3>
                  <p className="text-base leading-relaxed text-white/80">
                    {project.description}
                  </p>
                </div>
                <div className="mt-6 overflow-hidden rounded-2xl border border-white/15 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] bg-white/5 flex items-center justify-center">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-80 md:h-96 object-cover object-center"
                    draggable={false}
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen">
                <div className="absolute -left-10 top-12 h-32 w-32 rounded-full bg-white/30 blur-3xl" />
                <div className="absolute -right-16 bottom-12 h-32 w-32 rounded-full bg-white/20 blur-[90px]" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
} 

function CursorBlur() {
  const blobRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let trailX = x;
    let trailY = y;
    let raf: number;

    const handleMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const animate = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      trailX += (tx - trailX) * 0.08;
      trailY += (ty - trailY) * 0.08;

      if (blobRef.current) {
        blobRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handleMove);
    animate();

    return () => {
      window.removeEventListener("pointermove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-20">
      <div
        ref={trailRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 h-[240px] w-[240px] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(147, 197, 253, 0.3), transparent 60%), radial-gradient(circle at 70% 70%, rgba(167, 139, 250, 0.35), transparent 65%)",
        }}
      />
      <div
        ref={blobRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 h-[160px] w-[160px] rounded-full blur-[60px]"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.45), transparent 55%), radial-gradient(circle at 60% 60%, rgba(16, 185, 129, 0.35), transparent 60%)",
        }}
      />
    </div>
  );
} 
