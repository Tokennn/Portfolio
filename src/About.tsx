import { Link } from "react-router-dom";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import { divIcon } from "leaflet";
import portrait from "./iip.jpeg";
import avatarProcess from "./oo-removebg-preview.png";
import avatarTools from "./ii-removebg-preview.png";
import avatarOutside from "./pp-removebg-preview.png";
import WaterCursor from "./components/WaterCursor";

const stackItems = ["React", "TypeScript", "GSAP", "Framer", "Tailwind", "UI / UX", "lenis"];
const lyonPosition: [number, number] = [45.749977593867, 4.8232436066254225];
const serpentText =
  "Figma • FlutterFlow • Always Data • Airtable • Postman • FireBase • SupaBase • Git • Wix • Wordpress • Bubble";
const mapMarker = divIcon({
  className: "map-marker",
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  html: `
    <span class="map-pulse">
      <span class="map-pulse-ring"></span>
      <span class="map-pulse-core"></span>
    </span>
  `,
});

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
                  A propos
                  </span>
                  <h1 className="text-4xl md:text-5xl font-black text-[#0a0a0a] leading-tight">
                    Développeur et VibeDev créatif indépendant 
                  </h1>
                </div>

                <div className="space-y-5 text-base md:text-lg text-[#1f1f1f] leading-relaxed max-w-2xl">
                  <p>
                    Développeur créatif basé en France, passionné par l'art numérique, le codage créatif et l'animation 3D.
                    Toujours à la recherche d'opportunités intéressantes en freelance ou en équipe pour développer de belles expériences numériques.
                  </p>
                  <h2 className="text-4xl md:text-5xl font-black text-[#0a0a0a] leading-tight">
                    Mon école : 
                  </h2>
                  <p>
                   Actuellement en formation à Ynov Campus sur Lyon, je suis en 3ème année de Bachelor en développement où je me spécialise dans le développement web. 
                   Par la suite de cette formation, à la fin de mon Master, je voudrais plus me spécialiser dans le design web.
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
                      Valeurs
                    </h2>
                  <ul className="space-y-3 text-sm md:text-base text-[#3a3a3a] leading-relaxed">
                    <li>• Esprit d'équipe .</li>
                    <li>• Créativité .</li>
                    <li>• Innovation .</li>
                    <li>• Adaptabilité .</li>
                  </ul>
                  </div>
                  <div className="rounded-[26px] border border-[#e6d9c6] bg-white/80 p-4 shadow-[0_14px_40px_rgba(52,34,18,0.10)]">
                    <div className="relative h-[170px] overflow-hidden rounded-[20px] border border-[#e6d9c6] bg-white">
                      <MapContainer
                        center={lyonPosition}
                        zoom={15}
                        scrollWheelZoom={false}
                        zoomControl={false}
                        attributionControl={false}
                        className="about-map h-full w-full"
                      >
                        <TileLayer
                          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                        />
                        <Marker position={lyonPosition} icon={mapMarker} interactive>
                          <Tooltip
                            direction="top"
                            offset={[0, -8]}
                            opacity={1}
                            className="map-tooltip"
                          >
                            je suis là !!
                          </Tooltip>
                        </Marker>
                      </MapContainer>
                      <span className="pointer-events-none absolute left-3 bottom-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2f2f2f] shadow-[0_6px_16px_rgba(52,34,18,0.12)]">
                        Lyon, France
                      </span>
                      <span className="pointer-events-none absolute right-3 bottom-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6b6b6b]">
                        © OpenStreetMap contributors © CARTO
                      </span>
                    </div>
                  </div>
                </div>  
              </div>

              <aside className="space-y-4">
                <div className="relative overflow-hidden rounded-[30px] border border-[#e6d9c6] bg-white p-7 shadow-[0_18px_60px_rgba(52,34,18,0.12)] reveal-up delay-1">
                  <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(253,230,205,0.6),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(210,175,140,0.26),transparent_55%)]" />
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 overflow-hidden rounded-2xl border border-[#e2d6c3] bg-white/70 shadow-[0_10px_26px_rgba(52,34,18,0.12)]">
                        <img
                          src={portrait}
                          alt="Quentin Contreau portrait"
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
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
                        <dt className="text-xs uppercase tracking-[0.26em] text-[#6b6b6b]">Technologies</dt>
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
                          <span>Disponible</span>
                        </dd>
                      </div>
                    </dl>

                    <div className="pt-2">
                      <p className="text-xs uppercase tracking-[0.26em] text-[#6b6b6b] mb-3">Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {["Design", "UI", "UX", "Ergonomie", "Simplicité"].map((label) => (
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
                    Ce que j'apporte
                  </h2>
                  <ul className="space-y-3 text-sm md:text-base text-[#3a3a3a] leading-relaxed">
                    <li>• Developpement Front End .</li>
                    <li>• Developpement Back End .</li>
                    <li>• Optimisation de pages web .</li>
                  </ul>
                </div>
              </aside>
            </div>

            <div className="pointer-events-none hidden md:block absolute left-[79%] top-[80%] -translate-x-1/2 -translate-y-1/2">
              <svg className="h-[150px] w-[360px] lg:w-[440px]" viewBox="0 0 600 140" aria-hidden="true">
                <defs>
                  <path
                    id="serpentPath"
                    d="M10 90 C 120 10, 220 150, 330 90 C 430 30, 520 130, 590 60"
                  />
                </defs>
                <path
                  d="M10 90 C 120 10, 220 150, 330 90 C 430 30, 520 130, 590 60"
                  className="serpent-path"
                />
                <text className="serpent-text">
                  <textPath href="#serpentPath" startOffset="0%">
                    {serpentText.repeat(4)}
                    <animate
                      attributeName="startOffset"
                      from="0%"
                      to="-100%"
                      dur="18s"
                      repeatCount="indefinite"
                    />
                  </textPath>
                </text>
              </svg>
            </div>
          </section>
        </div>

        <section className="grid gap-6 md:grid-cols-3 reveal-up delay-1">
          <div className="rounded-[28px] border border-[#dccfb9] bg-white/80 p-7 shadow-[0_18px_60px_rgba(52,34,18,0.10)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f0f0f]">
                Process
              </h2>
              <button
                type="button"
                aria-label="Process avatar emoji"
                className="-mt-5 flex h-32 w-32 items-center justify-center bg-transparent transition-transform duration-500 ease-out hover:-translate-y-4 hover:scale-125 hover:rotate-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3a7bb3]"
              >
                <img
                  src={avatarProcess}
                  alt=""
                  className="h-32 w-32 object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.3)]"
                  draggable="false"
                />
              </button>
            </div>
            <p className="text-sm md:text-base text-[#3a3a3a] leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </p>
          </div>
          <div className="rounded-[28px] border border-[#dccfb9] bg-white/80 p-7 shadow-[0_18px_60px_rgba(52,34,18,0.10)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f0f0f]">
                Tools
              </h2>
              <button
                type="button"
                aria-label="Tools avatar emoji"
                className="-mt-5 flex h-32 w-32 items-center justify-center bg-transparent transition-transform duration-500 ease-out hover:-translate-y-4 hover:scale-125 hover:-rotate-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b37b3a]"
              >
                <img
                  src={avatarTools}
                  alt=""
                  className="h-32 w-32 object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.3)]"
                  draggable="false"
                />
              </button>
            </div>
            <p className="text-sm md:text-base text-[#3a3a3a] leading-relaxed">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat.
            </p>
          </div>
          <div className="rounded-[28px] border border-[#dccfb9] bg-white/80 p-7 shadow-[0_18px_60px_rgba(52,34,18,0.10)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f0f0f]">
                Outside work
              </h2>
              <button
                type="button"
                aria-label="Outside work avatar emoji"
                className="-mt-5 flex h-32 w-32 items-center justify-center bg-transparent transition-transform duration-500 ease-out hover:-translate-y-4 hover:scale-125 hover:rotate-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3ab37b]"
              >
                <img
                  src={avatarOutside}
                  alt=""
                  className="h-32 w-32 object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.3)]"
                  draggable="false"
                />
              </button>
            </div>
            <p className="text-sm md:text-base text-[#3a3a3a] leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
        </section>

        <div className="flex justify-center py-0">
          <p className="text-[10px] md:text-xs font-amazing tracking-[0.16em] text-[#6b6b6b]">
           - Contactez-moi pour toute collaboration ou simplement dire bonjour -
          </p>
        </div>

        <div className="mt-4 border-t border-[#e6d9c6] pt-4 text-[11px] md:text-xs text-[#6b6b6b]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="font-amazing tracking-[0.08em]">© 2025 Quentin Contreau. Tous droits réservés.</p>
            <div className="flex flex-wrap items-center gap-3 md:gap-5">
              <span className="inline-flex items-center gap-2 font-amazing tracking-[0.08em]">
                Créé avec
                <svg className="h-5 w-5" viewBox="0 0 32 32" aria-hidden="true">
                  <circle cx="16" cy="16" r="2.4" fill="#61dafb" />
                  <ellipse cx="16" cy="16" rx="12" ry="5" fill="none" stroke="#61dafb" strokeWidth="2" />
                  <ellipse
                    cx="16"
                    cy="16"
                    rx="12"
                    ry="5"
                    fill="none"
                    stroke="#61dafb"
                    strokeWidth="2"
                    transform="rotate(60 16 16)"
                  />
                  <ellipse
                    cx="16"
                    cy="16"
                    rx="12"
                    ry="5"
                    fill="none"
                    stroke="#61dafb"
                    strokeWidth="2"
                    transform="rotate(120 16 16)"
                  />
                </svg>
              </span>
              <span className="hidden md:inline text-[#b7b0a3]">•</span>
              <span className="inline-flex items-center gap-2 font-amazing tracking-[0.08em]">
                Hébergé sur
                <svg className="h-5 w-5" viewBox="0 0 32 32" aria-hidden="true">
                  <path
                    d="M6 6h4l12 14V6h4v20h-4L10 12v14H6V6z"
                    fill="#00c7b7"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default About;
