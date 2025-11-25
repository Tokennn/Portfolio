import React from 'react';
import { ArrowRight } from 'lucide-react';

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

function Work() {
  return (
    <div className="min-h-screen bg-[#050507] text-white px-6 py-20">
      <header className="flex justify-end gap-8 text-sm font-semibold mb-16">
        <a href="/" className="text-white/80 hover:text-white">Home</a>
        <a href="/work" className="text-white">Work</a>
        <a href="/#about" className="text-white/80 hover:text-white">About</a>
        <a href="/contact" className="text-white/80 hover:text-white">Contact</a>
      </header>

      <main className="max-w-5xl mx-auto space-y-8">
        {projects.map((project) => (
          <a
            key={project.title}
            href={project.link}
            className="group relative isolate overflow-hidden rounded-[28px] border border-white/20 bg-white/8 shadow-[0_25px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-transform duration-500 hover:-translate-y-2"
          >
            <div className={`absolute inset-0 opacity-90 bg-gradient-to-br ${project.accent}`} />
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
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/15 shadow-2xl bg-white/5 flex items-center justify-center">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-80 md:h-96 object-cover object-center"
                  draggable={false}
                />
              </div>
            </div>
          </a>
        ))}
      </main>
    </div>
  );
}

export default Work;
