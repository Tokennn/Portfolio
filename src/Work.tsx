import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import WaterCursor from './components/WaterCursor';
import LanguageToggle from './components/LanguageToggle';
import { useLanguage } from './context/LanguageContext';

const workCopy = {
  fr: {
    projects: [
      {
        title: "Langage-Sensei",
        description:
          "Sparring linguistique en ligne avec cartes d'expressions, parcours progressifs et micro-interactions.",
        image: "https://cdn.midjourney.com/bf612167-d186-46f9-8141-ad6e799fa243/0_1.png",
        link: "https://langage-sensei.netlify.app/",
        tag: "Product design",
        accent: "from-emerald-200/80 via-teal-50/85 to-amber-50/85",
        glow: "radial-gradient(circle at 18% 24%, rgba(52, 211, 153, 0.24), transparent 46%), radial-gradient(circle at 72% 70%, rgba(251, 191, 36, 0.22), transparent 52%)"
      },
      {
        title: "MoveSmart",
        description:
          "Assistant d'aménagement intelligent : calcul d'itinéraires, inventaire et suivi des étapes clés.",
        image: "https://cdn.midjourney.com/c5b6d334-83c3-4d27-ace8-00ca180a65ce/0_2.png",
        link: "https://movesmart.netlify.app/",
        tag: "Creative dev",
        accent: "from-indigo-200/80 via-sky-50/85 to-amber-50/80",
        glow: "radial-gradient(circle at 76% 16%, rgba(129, 140, 248, 0.26), transparent 48%), radial-gradient(circle at 22% 70%, rgba(56, 189, 248, 0.22), transparent 52%)"
      },
      {
        title: "Blog.V1",
        description:
          "Tableau de bord live pour suivre la performance produit : métriques clés, alertes et recommandations d'action.",
        image: "https://cdn.midjourney.com/a518c278-f137-4339-b5df-27c8643dbb49/0_0.jpeg",
        link: "https://blogv1qc.netlify.app/",
        tag: "Product ops",
        accent: "from-amber-200/80 via-orange-50/85 to-white/90",
        glow: "radial-gradient(circle at 55% 82%, rgba(251, 191, 36, 0.28), transparent 56%), radial-gradient(circle at 24% 32%, rgba(251, 146, 60, 0.22), transparent 52%)"
      }
    ]
  },
  en: {
    projects: [
      {
        title: "Langage-Sensei",
        description:
          "Online language sparring with expression cards, progressive paths, and micro-interactions.",
        image: "https://cdn.midjourney.com/bf612167-d186-46f9-8141-ad6e799fa243/0_1.png",
        link: "https://langage-sensei.netlify.app/",
        tag: "Product design",
        accent: "from-emerald-200/80 via-teal-50/85 to-amber-50/85",
        glow: "radial-gradient(circle at 18% 24%, rgba(52, 211, 153, 0.24), transparent 46%), radial-gradient(circle at 72% 70%, rgba(251, 191, 36, 0.22), transparent 52%)"
      },
      {
        title: "MoveSmart",
        description:
          "Smart moving assistant: route planning, inventory, and key-step tracking.",
        image: "https://cdn.midjourney.com/c5b6d334-83c3-4d27-ace8-00ca180a65ce/0_2.png",
        link: "https://movesmart.netlify.app/",
        tag: "Creative dev",
        accent: "from-indigo-200/80 via-sky-50/85 to-amber-50/80",
        glow: "radial-gradient(circle at 76% 16%, rgba(129, 140, 248, 0.26), transparent 48%), radial-gradient(circle at 22% 70%, rgba(56, 189, 248, 0.22), transparent 52%)"
      },
      {
        title: "Blog.V1",
        description:
          "Live dashboard to track product performance: key metrics, alerts, and action recommendations.",
        image: "https://cdn.midjourney.com/a518c278-f137-4339-b5df-27c8643dbb49/0_0.jpeg",
        link: "https://blogv1qc.netlify.app/",
        tag: "Product ops",
        accent: "from-amber-200/80 via-orange-50/85 to-white/90",
        glow: "radial-gradient(circle at 55% 82%, rgba(251, 191, 36, 0.28), transparent 56%), radial-gradient(circle at 24% 32%, rgba(251, 146, 60, 0.22), transparent 52%)"
      }
    ]
  }
};

function Work() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSwitching, setIsSwitching] = useState(false);
  const didMountRef = useRef(false);
  const { language } = useLanguage();
  const projects = workCopy[language].projects;
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

  useEffect(() => {
    projects.forEach((project) => {
      const preload = new Image();
      preload.src = project.image;
    });
  }, [projects]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    setIsSwitching(true);
    const timer = window.setTimeout(() => setIsSwitching(false), 450);
    return () => window.clearTimeout(timer);
  }, [activeIndex]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f8f3ea] via-[#f2e6d7] to-[#fdf8ef] text-[#0f0f0f] px-4 md:px-8 py-12 md:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.85),transparent_38%),radial-gradient(circle_at_82%_6%,rgba(253,230,205,0.45),transparent_46%),radial-gradient(circle_at_24%_80%,rgba(210,175,140,0.28),transparent_50%)]" />
      <div className="fixed right-5 top-5 z-50 md:right-8 md:top-8">
        <LanguageToggle />
      </div>

      <header className="relative max-w-6xl mx-auto flex items-center justify-between mb-10 md:mb-14 px-1 md:px-2 md:hidden">
        <div className="flex items-center gap-6 md:gap-8">
          <Link to="/" className="nav-underline font-amazing text-[#3a3a3a] hover:text-[#0f0f0f]">Home</Link>
          <Link to="/work" className="nav-underline font-amazing text-[#0f0f0f] hover:text-[#0f0f0f]">Work</Link>
        </div>
        <div className="flex items-center gap-6 md:gap-8">
          <Link to="/about" className="nav-underline font-amazing text-[#3a3a3a] hover:text-[#0f0f0f]">About</Link>
          <Link to="/contact" className="nav-underline font-amazing text-[#3a3a3a] hover:text-[#0f0f0f]">Contact</Link>
        </div>
      </header>

      <WaterCursor />

      <main className="relative max-w-6xl mx-auto space-y-10 md:space-y-14">
        <div className="relative">
          <div className="pointer-events-auto hidden md:flex flex-col gap-10 text-[#0f0f0f] absolute left-[-80px] lg:left-[-90px] top-[42%] -translate-y-1/2 z-20">
            <Link to="/" className="nav-dot font-amazing" data-label="Home" aria-label="Home">
              <span className="sr-only">Home</span>
            </Link>
            {/* <a href="/work" className="nav-dot font-amazing" data-label="Work" aria-label="Work">
              <span className="sr-only">Work</span>
            </a> */}
          </div>
          <div className="pointer-events-auto hidden md:flex flex-col gap-10 text-[#0f0f0f] absolute right-[-80px] lg:right-[-90px] top-[42%] -translate-y-1/2 z-20 text-right">
            <Link to="/about" className="nav-dot font-amazing" data-label="About" aria-label="About">
              <span className="sr-only">About</span>
            </Link>
            <Link to="/contact" className="nav-dot font-amazing" data-label="Contact" aria-label="Contact">
              <span className="sr-only">Contact</span>
            </Link>
          </div>

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

              <a
                href={activeProject.link}
                target="_blank"
                rel="noreferrer"
                className="group relative isolate rounded-[30px] overflow-hidden border border-[#e6d9c6] bg-white shadow-[0_18px_60px_rgba(52,34,18,0.14)] reveal-up delay-2 fade-in transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(52,34,18,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9cbb4]"
              >
                <div
                  className={`relative z-10 flex flex-col gap-6 md:gap-8 p-8 md:p-10 items-center text-center transition-colors duration-500 ${
                    isSwitching ? 'project-swap' : ''
                  }`}
                >
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

                  {/* <div className="inline-flex items-center gap-3 text-sm font-semibold text-[#0f0f0f] uppercase tracking-[0.28em] transition-transform duration-300 group-hover:translate-y-[-2px]">
                    Voir le projet
                    <ArrowRight className="h-5 w-5 text-[#0f0f0f]" />
                  </div> */}
                </div>
              </a>

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
        </div>

        <div className="flex justify-center py-0">
          <p className="text-[10px] md:text-xs font-amazing tracking-[0.16em] text-[#6b6b6b]">
            Next project soon
          </p>
        </div>
      </main>
    </div>
  );
}

export default Work;
