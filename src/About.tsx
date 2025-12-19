import { Link } from "react-router-dom";
import WaterCursor from "./components/WaterCursor";

const stackItems = ["React", "TypeScript", "GSAP", "Framer", "Tailwind", "UI / UX"];

function About() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f8f3ea] via-[#f2e6d7] to-[#fdf8ef] text-[#0f0f0f] px-4 md:px-8 py-12 md:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.85),transparent_38%),radial-gradient(circle_at_82%_6%,rgba(253,230,205,0.45),transparent_46%),radial-gradient(circle_at_24%_80%,rgba(210,175,140,0.28),transparent_50%)]" />

      <header className="relative max-w-6xl mx-auto flex items-center justify-between mb-10 md:mb-14 px-1 md:px-2 md:hidden">
        <div className="flex items-center gap-6 md:gap-8">
          <Link to="/" className="nav-underline font-amazing text-[#3a3a3a] hover:text-[#0f0f0f]">
            Home
          </Link>
          <Link to="/work" className="nav-underline font-amazing text-[#3a3a3a] hover:text-[#0f0f0f]">
            Work
          </Link>
        </div>
        <div className="flex items-center gap-6 md:gap-8">
          <Link to="/about" className="nav-underline font-amazing text-[#0f0f0f] hover:text-[#0f0f0f]">
            About
          </Link>
          <Link to="/contact" className="nav-underline font-amazing text-[#3a3a3a] hover:text-[#0f0f0f]">
            Contact
          </Link>
        </div>
      </header>

      <WaterCursor />

      <main className="relative max-w-6xl mx-auto space-y-10 md:space-y-14">
        <div className="relative">
          <div className="pointer-events-auto hidden md:flex flex-col gap-10 text-[#0f0f0f] absolute left-[-80px] lg:left-[-90px] top-[42%] -translate-y-1/2 z-20">
            <Link to="/" className="nav-dot font-amazing" data-label="Home" aria-label="Home">
              <span className="sr-only">Home</span>
            </Link>
            <Link to="/work" className="nav-dot font-amazing" data-label="Work" aria-label="Work">
              <span className="sr-only">Work</span>
            </Link>
          </div>
          <div className="pointer-events-auto hidden md:flex flex-col gap-10 text-[#0f0f0f] absolute right-[-80px] lg:right-[-90px] top-[42%] -translate-y-1/2 z-20 text-right">
            <Link to="/contact" className="nav-dot font-amazing" data-label="Contact" aria-label="Contact">
              <span className="sr-only">Contact</span>
            </Link>
          </div>

          <section className="relative isolate overflow-hidden rounded-[32px] border border-[#dccfb9] bg-white/90 shadow-[0_24px_70px_rgba(52,34,18,0.14)] px-4 py-8 md:px-10 md:py-12 reveal-up">
            <div className="relative z-10 grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-7">
                <div className="flex flex-col gap-4">
                  <span className="w-fit rounded-full border border-[#d5c5ad] bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#0f0f0f]">
                    About
                  </span>
                  <h1 className="text-4xl md:text-5xl font-black text-[#0a0a0a] leading-tight">
                    Développeur créatif indépendant 
                  </h1>
                </div>

                <div className="space-y-5 text-base md:text-lg text-[#1f1f1f] leading-relaxed max-w-2xl">
                  <p>
                    
                    Développeur créatif basé en France, passionné par l'art numérique, le codage créatif et l'animation 3D.
                    Toujours à la recherche d'opportunités intéressantes en freelance ou en équipe pour développer de belles expériences numériques.
                  </p>
                  <h2 className="text-4xl md:text-5xl font-black text-[#0a0a0a] leading-tight">
                    Ecole dans laquelle j'apprends : 
                  </h2>
                  <p>
                    
                   Actuellement en formation à Ynov Campus sur Lyon, je suis en 3ème année de Bachelor en développement où je me suis spécialisé dans le développement web. 
                   Par la suite de cette formation, à la fin de mon Master, je voudrais vraiment me spécialiser dans le design web.
                  </p> 
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* <div className="rounded-[26px] border border-[#e6d9c6] bg-white/80 p-6 shadow-[0_14px_40px_rgba(52,34,18,0.10)]">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f0f0f] mb-3">
                      Focus
                    </h2>
                    <p className="text-sm md:text-base text-[#3a3a3a] leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
                    </p>
                  </div> */}
                  <div className="rounded-[26px] border border-[#e6d9c6] bg-white/80 p-6 shadow-[0_14px_40px_rgba(52,34,18,0.10)]">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f0f0f] mb-3">
                      Values
                    </h2>
                    <p className="text-sm md:text-base text-[#3a3a3a] leading-relaxed">
                      Esprit d'équipe - créativité - curiosité - innovation - adaptabilité.
                    </p>
                  </div>
                </div>  
              </div>

              <aside className="space-y-4">
                <div className="relative overflow-hidden rounded-[30px] border border-[#e6d9c6] bg-white p-7 shadow-[0_18px_60px_rgba(52,34,18,0.12)] reveal-up delay-1">
                  <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(253,230,205,0.6),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(210,175,140,0.26),transparent_55%)]" />
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl border border-[#e2d6c3] bg-white/70 shadow-[0_10px_26px_rgba(52,34,18,0.12)] grid place-items-center">
                        <span className="font-amazing text-lg tracking-[0.22em] text-[#0f0f0f]">  </span>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.26em] text-[#6b6b6b]">Snapshot</p>
                        <p className="text-lg font-black text-[#0a0a0a] leading-tight">Quentin / Contreau</p>
                      </div>
                    </div>

                    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                      <div>
                        <dt className="text-xs uppercase tracking-[0.26em] text-[#6b6b6b]">Localisation</dt>
                        <dd className="font-semibold text-[#0f0f0f] mt-1">Lyon France</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-[0.26em] text-[#6b6b6b]">Role</dt>
                        <dd className="font-semibold text-[#0f0f0f] mt-1">Dev créatif</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-[0.26em] text-[#6b6b6b]">Technologie</dt>
                        <dd className="mt-1">
                          <div className="stack-marquee border border-[#e2d6c3] bg-white/80 px-4 py-2 shadow-[0_8px_24px_rgba(52,34,18,0.10)]">
                            <div className="stack-marquee-track text-xs md:text-sm font-semibold uppercase tracking-[0.24em] text-[#0f0f0f]">
                              {[...stackItems, ...stackItems].map((label, idx) => (
                                <span key={`${label}-${idx}`} className="flex items-center gap-3">
                                  <span>{label}</span>
                                  <span className="h-1 w-1 rounded-full bg-[#0f0f0f]/30" />
                                </span>
                              ))}
                            </div>
                          </div>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-[0.26em] text-[#6b6b6b]">Status</dt>
                        <dd className="mt-1 flex items-center gap-2 font-semibold text-[#0f0f0f]">
                          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2bbf6a]/50" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#2bbf6a] shadow-[0_0_0_4px_rgba(43,191,106,0.18)]" />
                          </span>
                          <span>Available</span>
                        </dd>
                      </div>
                    </dl>

                    <div className="pt-2">
                      <p className="text-xs uppercase tracking-[0.26em] text-[#6b6b6b] mb-3">Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {["Lorem", "Ipsum", "Dolor", "Sit", "Amet"].map((label) => (
                          <span
                            key={label}
                            className="rounded-full border border-[#d5c5ad] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0f0f0f]"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[30px] border border-[#e6d9c6] bg-white/80 p-7 shadow-[0_18px_60px_rgba(52,34,18,0.10)] reveal-up delay-2">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f0f0f] mb-4">
                    Je ce que j'apporte
                  </h2>
                  <ul className="space-y-3 text-sm md:text-base text-[#3a3a3a] leading-relaxed">
                    <li>• Developpement Front End .</li>
                    <li>• Optimisation de pages web .</li>
                    <li>• Developpement Back End .</li>
                    <li>• Design UI / UX .</li>
                  </ul>
                </div>
              </aside>
            </div>
          </section>
        </div>

        <section className="grid gap-6 md:grid-cols-3 reveal-up delay-1">
          <div className="rounded-[28px] border border-[#dccfb9] bg-white/80 p-7 shadow-[0_18px_60px_rgba(52,34,18,0.10)]">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f0f0f] mb-3">
              Process
            </h2>
            <p className="text-sm md:text-base text-[#3a3a3a] leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </p>
          </div>
          <div className="rounded-[28px] border border-[#dccfb9] bg-white/80 p-7 shadow-[0_18px_60px_rgba(52,34,18,0.10)]">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f0f0f] mb-3">
              Tools
            </h2>
            <p className="text-sm md:text-base text-[#3a3a3a] leading-relaxed">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat.
            </p>
          </div>
          <div className="rounded-[28px] border border-[#dccfb9] bg-white/80 p-7 shadow-[0_18px_60px_rgba(52,34,18,0.10)]">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f0f0f] mb-3">
              Outside work
            </h2>
            <p className="text-sm md:text-base text-[#3a3a3a] leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
        </section>

        <div className="flex justify-center py-0">
          <p className="text-[10px] md:text-xs font-amazing tracking-[0.16em] text-[#6b6b6b]">
           - Contactez-moi pour toute collaboration ou simplement pour dire bonjour -
          </p>
        </div>
      </main>
    </div>
  );
}

export default About;
