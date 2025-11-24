"use client";
import React from "react";
import { ContainerScroll } from "./container-scroll-animation";
import { ArrowRight } from "lucide-react";

export function HeroScrollDemo() {
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
    }
  ];

  return (
    <div className="flex flex-col overflow-hidden pb-[300px] pt-[800px]">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white mb-32">
              Découvrez mes <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Projets
              </span>
            </h1>
          </>
        }
      >
        <div className="relative h-full w-full">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-white/0 to-black/40" />
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-gradient-to-b from-white/50 to-transparent blur-3xl" />
          <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-2">
            {projects.map((project, index) => (
              <a
                href={project.link}
                key={index}
                className="group relative isolate overflow-hidden rounded-[28px] border border-white/15 bg-white/5 shadow-[0_25px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-transform duration-500 hover:-translate-y-2"
              >
                <div
                  className={`absolute inset-0 opacity-90 bg-gradient-to-br ${project.accent}`}
                />
                <div
                  className="absolute inset-0 opacity-60 blur-[90px]"
                  style={{ background: project.glow }}
                />
                <div className="relative z-10 flex h-full flex-col gap-4 p-8">
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
                  <div className="mt-auto overflow-hidden rounded-2xl border border-white/15 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-56 w-full object-cover"
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
      </ContainerScroll>
    </div>
  );
} 
