import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Link } from 'react-router-dom';
import LanguageToggle from './components/LanguageToggle';
import { useLanguage } from './context/LanguageContext';

const workCopy = {
  fr: {
    projects: [
      {
        title: "Langage-Sensei",
        description:
          "Parcours progressifs et micro-interactions.",
        image: "https://cdn.midjourney.com/bf612167-d186-46f9-8141-ad6e799fa243/0_1.png",
        link: "https://langage-sensei.netlify.app/",
        tag: "Product design",
        accent: "from-emerald-200/80 via-teal-50/85 to-amber-50/85",
        glow: "radial-gradient(circle at 18% 24%, rgba(52, 211, 153, 0.24), transparent 46%), radial-gradient(circle at 72% 70%, rgba(251, 191, 36, 0.22), transparent 52%)"
      },
      {
        title: "MoveSmart",
        description:
          "Calcul d'itinéraires, inventaire et suivi des étapes clés.",
        image: "https://cdn.midjourney.com/c5b6d334-83c3-4d27-ace8-00ca180a65ce/0_2.png",
        link: "https://movesmart.netlify.app/",
        tag: "Creative dev",
        accent: "from-indigo-200/80 via-sky-50/85 to-amber-50/80",
        glow: "radial-gradient(circle at 76% 16%, rgba(129, 140, 248, 0.26), transparent 48%), radial-gradient(circle at 22% 70%, rgba(56, 189, 248, 0.22), transparent 52%)"
      },
      {
        title: "Blog.V1",
        description:
          "Suivi Personnel",
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
          "Progressive pathways and micro-interactions.",
        image: "https://cdn.midjourney.com/bf612167-d186-46f9-8141-ad6e799fa243/0_1.png",
        link: "https://langage-sensei.netlify.app/",
        tag: "Product design",
        accent: "from-emerald-200/80 via-teal-50/85 to-amber-50/85",
        glow: "radial-gradient(circle at 18% 24%, rgba(52, 211, 153, 0.24), transparent 46%), radial-gradient(circle at 72% 70%, rgba(251, 191, 36, 0.22), transparent 52%)"
      },
      {
        title: "MoveSmart",
        description:
          "Route calculation, inventory and tracking of key stages.",
        image: "https://cdn.midjourney.com/c5b6d334-83c3-4d27-ace8-00ca180a65ce/0_2.png",
        link: "https://movesmart.netlify.app/",
        tag: "Creative dev",
        accent: "from-indigo-200/80 via-sky-50/85 to-amber-50/80",
        glow: "radial-gradient(circle at 76% 16%, rgba(129, 140, 248, 0.26), transparent 48%), radial-gradient(circle at 22% 70%, rgba(56, 189, 248, 0.22), transparent 52%)"
      },
      {
        title: "Blog.V1",
        description:
          "Personal Monitoring",
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
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorEnabled, setCursorEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    return !(reduceMotion || coarsePointer);
  });
  const didMountRef = useRef(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRaf = useRef<number | null>(null);
  const cursorHideTimeout = useRef<number | null>(null);
  const cursorTarget = useRef({ x: 0, y: 0 });
  const cursorPosition = useRef({ x: 0, y: 0 });
  const swipeStartRef = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const swipeActiveRef = useRef(false);
  const swipeConsumedRef = useRef(false);
  const { language } = useLanguage();
  const projects = workCopy[language].projects;
  const activeProject = projects[activeIndex];
  const cursorLabel = language === 'fr' ? 'Voir le projet' : 'View project';

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
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
    const update = () => {
      setCursorEnabled(!(reduceMotionQuery.matches || coarsePointerQuery.matches));
    };

    update();
    reduceMotionQuery.addEventListener('change', update);
    coarsePointerQuery.addEventListener('change', update);

    return () => {
      reduceMotionQuery.removeEventListener('change', update);
      coarsePointerQuery.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (cursorRaf.current) {
        cancelAnimationFrame(cursorRaf.current);
        cursorRaf.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (cursorEnabled) return;
    setCursorVisible(false);
    if (cursorRaf.current) {
      cancelAnimationFrame(cursorRaf.current);
      cursorRaf.current = null;
    }
  }, [cursorEnabled]);

  useEffect(() => {
    return () => {
      if (cursorHideTimeout.current) {
        window.clearTimeout(cursorHideTimeout.current);
        cursorHideTimeout.current = null;
      }
      if (typeof document !== 'undefined') {
        document.body.classList.remove('work-hide-cursor');
      }
    };
  }, []);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    setIsSwitching(true);
    const timer = window.setTimeout(() => setIsSwitching(false), 450);
    return () => window.clearTimeout(timer);
  }, [activeIndex]);

  const animateCursor = useCallback(() => {
    const target = cursorTarget.current;
    const position = cursorPosition.current;
    const nextX = position.x + (target.x - position.x) * 0.14;
    const nextY = position.y + (target.y - position.y) * 0.14;
    cursorPosition.current = { x: nextX, y: nextY };

    if (cursorRef.current) {
      cursorRef.current.style.setProperty('--cursor-x', `${nextX}px`);
      cursorRef.current.style.setProperty('--cursor-y', `${nextY}px`);
    }

    cursorRaf.current = requestAnimationFrame(animateCursor);
  }, []);

  const handleCursorEnter = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (!cursorEnabled) return;
    if (cursorHideTimeout.current) {
      window.clearTimeout(cursorHideTimeout.current);
      cursorHideTimeout.current = null;
    }
    if (typeof document !== 'undefined') {
      document.body.classList.add('work-hide-cursor');
    }
    const { clientX, clientY } = event;
    cursorTarget.current = { x: clientX, y: clientY };
    cursorPosition.current = { x: clientX, y: clientY };
    if (cursorRef.current) {
      cursorRef.current.style.setProperty('--cursor-x', `${clientX}px`);
      cursorRef.current.style.setProperty('--cursor-y', `${clientY}px`);
    }
    setCursorVisible(true);
    if (!cursorRaf.current) {
      cursorRaf.current = requestAnimationFrame(animateCursor);
    }
  };

  const handleCursorMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (!cursorEnabled) return;
    cursorTarget.current = { x: event.clientX, y: event.clientY };
  };

  const handleCursorLeave = () => {
    if (!cursorEnabled) return;
    setCursorVisible(false);
    if (typeof document !== 'undefined') {
      cursorHideTimeout.current = window.setTimeout(() => {
        document.body.classList.remove('work-hide-cursor');
        cursorHideTimeout.current = null;
      }, 320);
    }
    if (cursorRaf.current) {
      cancelAnimationFrame(cursorRaf.current);
      cursorRaf.current = null;
    }
  };

  const handleSwipePointerDown = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== 'touch') return;
    swipeConsumedRef.current = false;
    swipeActiveRef.current = false;
    swipeStartRef.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleSwipePointerMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== 'touch') return;
    const start = swipeStartRef.current;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (!swipeActiveRef.current) {
      if (absX > 12 && absX > absY * 1.2) {
        swipeActiveRef.current = true;
        swipeConsumedRef.current = true;
      } else if (absY > 12) {
        swipeStartRef.current = null;
      }
    }
  };

  const handleSwipePointerUp = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== 'touch') return;
    const start = swipeStartRef.current;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX > 48 && absX > absY * 1.2) {
      if (dx < 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    swipeStartRef.current = null;
    swipeActiveRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleSwipePointerCancel = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== 'touch') return;
    swipeStartRef.current = null;
    swipeActiveRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleProjectClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!swipeConsumedRef.current) return;
    swipeConsumedRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f8f3ea] via-[#f2e6d7] to-[#fdf8ef] text-[#0f0f0f] px-4 md:px-8 py-12 md:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.85),transparent_38%),radial-gradient(circle_at_82%_6%,rgba(253,230,205,0.45),transparent_46%),radial-gradient(circle_at_24%_80%,rgba(210,175,140,0.28),transparent_50%)]" />
      <div className="fixed right-5 top-5 z-50 md:right-8 md:top-8">
        <LanguageToggle />
      </div>

      {cursorEnabled && (
        <div
          ref={cursorRef}
          className={`project-cursor ${cursorVisible ? 'is-active' : ''}`}
          aria-hidden="true"
        >
          <div className="project-cursor__bubble">
            <span>{cursorLabel}</span>
          </div>
        </div>
      )}

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
                className="group project-swipe-area relative isolate rounded-[30px] overflow-hidden border border-[#e6d9c6] bg-white shadow-[0_18px_60px_rgba(52,34,18,0.14)] reveal-up delay-2 fade-in transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(52,34,18,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9cbb4]"
                onPointerDown={handleSwipePointerDown}
                onPointerMove={handleSwipePointerMove}
                onPointerUp={handleSwipePointerUp}
                onPointerCancel={handleSwipePointerCancel}
                onClick={handleProjectClick}
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
                    <div
                      onPointerEnter={handleCursorEnter}
                      onPointerMove={handleCursorMove}
                      onPointerLeave={handleCursorLeave}
                      className={`relative overflow-hidden rounded-[24px] border border-[#f1e4d2]/70 bg-white shadow-[0_20px_60px_rgba(52,34,18,0.12)] transition duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-1 group-hover:shadow-[0_20px_60px_rgba(52,34,18,0.18)] ${cursorEnabled ? 'project-cursor-target' : 'cursor-pointer'}`}
                    >
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
