import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import { divIcon, type Map as LeafletMap } from "leaflet";
import portrait from "./iip.jpeg";
import avatarProcess from "./oo-removebg-preview.png";
import avatarTools from "./ii-removebg-preview.png";
import avatarOutside from "./pp-removebg-preview.png";
import logoCursor from "./assets/logos/cursor.png";
import logoHostinger from "./assets/logos/hostinger.png";
import logoGolang from "./assets/logos/golang.png";
import logoFirebase from "./assets/logos/firebase.png";
import logoSupabase from "./assets/logos/supabase.png";
import logoMysql from "./assets/logos/mysql.png";
import logoMariadb from "./assets/logos/mariadb.png";
import logoXamp from "./assets/logos/xamp.png";
import logoGit from "./assets/logos/git.png";
import logoDocker from "./assets/logos/dockeur.png";
import logoThreejs from "./assets/logos/threejs.png";
import logoWebgl from "./assets/logos/webgl.png";
import logoVue from "./assets/logos/vue.png";
import logoNuxt from "./assets/logos/nuxt.png";
import logoWordpress from "./assets/logos/wordpress.png";
import logoGmail from "./assets/logos/gmail.png";
import logoOutlook from "./assets/logos/outlook.png";
import logoNode from "./assets/logos/node.png";
import logoAirtable from "./assets/logos/airtable.png";
import logoPostman from "./assets/logos/postman.png";
import logoFramer from "./assets/logos/framer.png";
import logoGsap from "./assets/logos/gsap.png";
import logoLenis from "./assets/logos/lenis.png";
import logoFigma from "./assets/logos/figma.png";
import logoNotion from "./assets/logos/notion.png";
import logoNetlify from "./assets/logos/netlify.png";
import albumMiskine from "./assets/logos/Miskine.png";
import audioMiskine from "./song/Miskine.mp3";
// import WaterCursor from "./components/WaterCursor";
import LanguageToggle from "./components/LanguageToggle";
import { useLanguage } from "./context/LanguageContext";
import { useTextReveal } from "./hooks/useTextReveal";

const stackItems = ["React", "TypeScript", "GSAP", "Framer", "Tailwind", "UI / UX", "lenis"];
const lyonPosition: [number, number] = [45.749977593867, 4.8232436066254225];
const serpentText =
  "Figma • FlutterFlow • Always Data • Airtable • Postman • FireBase • SupaBase • Git • Wix • Wordpress • Bubble";
const islandBars = [
  { delay: "0ms", duration: "1.2s" },
  { delay: "140ms", duration: "0.95s" },
  { delay: "280ms", duration: "1.15s" },
  { delay: "420ms", duration: "1.05s" },
  { delay: "200ms", duration: "1.3s" }
];
const islandCoverSrc = albumMiskine;
const islandAudioSrc = audioMiskine;
const aboutCopy = {
  fr: {
    nav: {
      home: "Accueil",
      work: "Projets",
      about: "À propos",
      contact: "Contact"
    },
    badge: "À propos",
    title: "Développeur et VibeDev créatif indépendant",
    intro:
      "Développeur créatif basé en France, passionné par l'art numérique, le codage créatif et l'animation 3D. Toujours à la recherche d'opportunités intéressantes en freelance ou en équipe pour développer de belles expériences numériques.",
    schoolTitle: "Mon école :",
    schoolBody:
      "Actuellement en formation à Ynov Campus sur Lyon, je suis en 3ème année de Bachelor en développement où je me spécialise dans le développement web. Par la suite de cette formation, à la fin de mon Master, je voudrais plus me spécialiser dans le design web.",
    valuesTitle: "Valeurs",
    values: ["Esprit d'équipe", "Créativité", "Innovation", "Adaptabilité"],
    zoomOut: "Dézoomer la carte",
    zoomIn: "Zoomer la carte",
    mapTooltip: "je suis là !!",
    snapshotLabel: "Snapshot",
    locationLabel: "Localisation",
    locationValue: "Lyon, France",
    roleLabel: "Rôle",
    roleValue: "Dev créatif",
    techLabel: "Technologies",
    statusLabel: "Statut",
    statusValue: "Disponible",
    keywordsLabel: "Mots-clés",
    keywords: ["Design", "UI", "UX", "Ergonomie", "Simplicité"],
    processTitle: "Process'",
    processBody:
      "Je démarre par un brief clair, puis je propose une direction visuelle rapide. Ensuite, je développe en itérations courtes avec des points réguliers, avant tests, optimisation et mise en ligne.",
    toolsTitle: "Outils",
    outsideTitle: "En dehors du travail",
    outsideBody:
      "Passion pour le sport, le dessin, la photo/vidéo, la mode, la musique et pouvoir voyager ✈️",
    contributeTitle: "Ce que j'apporte",
    contributeItems: [
      "Développement Front End .",
      "Développement Back End .",
      "Optimisation de pages web ."
    ],
    contactTagline: "- Contactez-moi pour toute collaboration ou simplement dire bonjour 🫵 -",
    footerRights: "© 2025 Quentin Contreau. Tous droits réservés.",
    footerBuiltWith: "Créé avec",
    footerHostedOn: "Hébergé sur",
    toolsExpandLabel: "Afficher plus d'outils",
    toolsCollapseLabel: "Réduire la liste des outils"
  },
  en: {
    nav: {
      home: "Home",
      work: "Work",
      about: "About",
      contact: "Contact"
    },
    badge: "About",
    title: "Creative freelance developer & VibeDev",
    intro:
      "Creative developer based in France, passionate about digital art, creative coding, and 3D animation. Always looking for exciting freelance or team opportunities to build beautiful digital experiences.",
    schoolTitle: "My school:",
    schoolBody:
      "Currently studying at Ynov Campus in Lyon, I am in my 3rd year of a Bachelor in development with a focus on web development. After this program, at the end of my Master's degree, I want to specialize more in web design.",
    valuesTitle: "Values",
    values: ["Team spirit", "Creativity", "Innovation", "Adaptability"],
    zoomOut: "Zoom out map",
    zoomIn: "Zoom in map",
    mapTooltip: "I'm here!!",
    snapshotLabel: "Snapshot",
    locationLabel: "Location",
    locationValue: "Lyon, France",
    roleLabel: "Role",
    roleValue: "Creative dev",
    techLabel: "Technologies",
    statusLabel: "Status",
    statusValue: "Available",
    keywordsLabel: "Keywords",
    keywords: ["Design", "UI", "UX", "Ergonomics", "Simplicity"],
    processTitle: "Process",
    processBody:
      "I start with a clear brief, then propose a quick visual direction. Next, I build in short iterations with regular check-ins, followed by testing, optimization, and launch.",
    toolsTitle: "Tools",
    outsideTitle: "Outside work",
    outsideBody:
      "Passion for sports, drawing, photo/video, motorsports, fashion, music, and traveling.",
    contributeTitle: "What I bring",
    contributeItems: [
      "Front-end development.",
      "Back-end development.",
      "Web page optimization."
    ],
    contactTagline: "- Contact me for any collaboration or just to say hello -",
    footerRights: "© 2025 Quentin Contreau. All rights reserved.",
    footerBuiltWith: "Built with",
    footerHostedOn: "Hosted on",
    toolsExpandLabel: "Show more tools",
    toolsCollapseLabel: "Show fewer tools"
  }
};
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
  useTextReveal();

  const { language } = useLanguage();
  const copy = aboutCopy[language];
  const mapRef = useRef<LeafletMap | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isToolsExpanded, setIsToolsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barRefs = useRef<HTMLSpanElement[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafAudioRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReactive, setIsReactive] = useState(false);
  const autoPlayAttempted = useRef(false);

  const setupAudioContext = () => {
    if (typeof window === "undefined") return null;
    const audio = audioRef.current;
    if (!audio) return null;

    if (!audioContextRef.current) {
      const AudioContextImpl =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextImpl) return null;
      audioContextRef.current = new AudioContextImpl();
    }

    const audioContext = audioContextRef.current;
    if (!audioContext) return null;

    if (!sourceRef.current) {
      sourceRef.current = audioContext.createMediaElementSource(audio);
    }

    if (!analyserRef.current) {
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.75;
      analyserRef.current = analyser;
      sourceRef.current.connect(analyser);
      analyser.connect(audioContext.destination);
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    }

    setIsReactive(true);
    return audioContext;
  };

  const stopVisualization = () => {
    if (rafAudioRef.current) {
      cancelAnimationFrame(rafAudioRef.current);
      rafAudioRef.current = null;
    }
    barRefs.current.forEach((bar) => {
      if (!bar) return;
      bar.style.setProperty("--bar-scale", "0.35");
    });
  };

  const startVisualization = () => {
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    if (!analyser || !dataArray) return;

    const bars = barRefs.current;
    const totalBars = bars.length || islandBars.length;
    const step = Math.max(1, Math.floor(dataArray.length / totalBars));
    const minScale = 0.2;
    const maxScale = 1;

    const render = () => {
      analyser.getByteFrequencyData(dataArray);
      for (let i = 0; i < totalBars; i += 1) {
        const bar = bars[i];
        if (!bar) continue;
        let sum = 0;
        const start = i * step;
        const end = Math.min(start + step, dataArray.length);
        for (let j = start; j < end; j += 1) {
          sum += dataArray[j];
        }
        const avg = sum / Math.max(1, end - start);
        const normalized = avg / 255;
        const position = totalBars > 1 ? i / (totalBars - 1) : 0;
        const tilt = 0.8 + position * 1.1;
        const adjusted = Math.min(1, Math.pow(normalized, 0.6) * tilt);
        const scale = minScale + adjusted * (maxScale - minScale);
        bar.style.setProperty("--bar-scale", scale.toFixed(2));
      }
      rafAudioRef.current = requestAnimationFrame(render);
    };

    if (rafAudioRef.current) cancelAnimationFrame(rafAudioRef.current);
    render();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
      const context = setupAudioContext();
      if (context && context.state === "suspended") {
        context.resume().catch(() => undefined);
      }
      startVisualization();
    };
    const handlePause = () => {
      setIsPlaying(false);
      stopVisualization();
    };
    const handleEnded = () => {
      setIsPlaying(false);
      stopVisualization();
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      stopVisualization();
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => undefined);
      }
      audioContextRef.current = null;
      analyserRef.current = null;
      dataArrayRef.current = null;
      sourceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (autoPlayAttempted.current) return;
    autoPlayAttempted.current = true;
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch(() => {
      setIsPlaying(false);
    });
  }, []);

  const handleTogglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        const context = setupAudioContext();
        if (context && context.state === "suspended") {
          await context.resume();
        }
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }
    audio.pause();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f8f3ea] via-[#f2e6d7] to-[#fdf8ef] text-[#0f0f0f] px-4 md:px-8 pt-28 pb-12 md:py-16">
      <audio ref={audioRef} src={islandAudioSrc} preload="auto" playsInline />
      <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.85),transparent_38%),radial-gradient(circle_at_82%_6%,rgba(253,230,205,0.45),transparent_46%),radial-gradient(circle_at_24%_80%,rgba(210,175,140,0.28),transparent_50%)]" />
      <div className="fixed inset-x-0 top-0 z-50 flex flex-col gap-2 pt-[calc(env(safe-area-inset-top,0px)+8px)] sm:hidden">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleTogglePlayback}
            className="dynamic-island dynamic-island--large"
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
            aria-pressed={isPlaying}
            data-playing={isPlaying}
            data-reactive={isReactive}
          >
            <span
              className="dynamic-island-album"
              aria-hidden="true"
              style={{ backgroundImage: `url(${islandCoverSrc})` }}
            />
            <div className="dynamic-island-eq-wrap" aria-hidden="true">
              <div className="dynamic-island-eq">
                {islandBars.map((bar, index) => (
                  <span
                    key={`${bar.delay}-${index}`}
                    className="dynamic-island-bar"
                    ref={(el) => {
                      if (el) barRefs.current[index] = el;
                    }}
                    style={
                      {
                        "--bar-delay": bar.delay,
                        "--bar-duration": bar.duration,
                        "--bar-scale": "0.35"
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
            </div>
          </button>
        </div>
        <div className="flex justify-end pr-4">
          <LanguageToggle />
        </div>
      </div>

      <div className="fixed left-1/2 top-1 z-50 hidden -translate-x-1/2 sm:block md:top-4">
        <button
          type="button"
          onClick={handleTogglePlayback}
          className="dynamic-island dynamic-island--large"
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
          aria-pressed={isPlaying}
          data-playing={isPlaying}
          data-reactive={isReactive}
        >
          <span
            className="dynamic-island-album"
            aria-hidden="true"
            style={{ backgroundImage: `url(${islandCoverSrc})` }}
          />
          <div className="dynamic-island-eq-wrap" aria-hidden="true">
            <div className="dynamic-island-eq">
              {islandBars.map((bar, index) => (
                <span
                  key={`${bar.delay}-${index}`}
                  className="dynamic-island-bar"
                  ref={(el) => {
                    if (el) barRefs.current[index] = el;
                  }}
                  style={
                    {
                      "--bar-delay": bar.delay,
                      "--bar-duration": bar.duration,
                      "--bar-scale": "0.35"
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </div>
        </button>
      </div>
      <div className="fixed right-5 top-5 z-50 hidden sm:block md:right-8 md:top-8">
        <LanguageToggle />
      </div>

      <header className="relative max-w-6xl mx-auto flex flex-col items-center gap-4 mb-8 px-2 md:hidden">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/" className="nav-underline font-amazing text-[#3a3a3a] hover:text-[#0f0f0f]">
            {copy.nav.home}
          </Link>
          <Link to="/work" className="nav-underline font-amazing text-[#3a3a3a] hover:text-[#0f0f0f]">
            {copy.nav.work}
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/about" className="nav-underline font-amazing text-[#0f0f0f] hover:text-[#0f0f0f]">
            {copy.nav.about}
          </Link>
          <Link to="/contact" className="nav-underline font-amazing text-[#3a3a3a] hover:text-[#0f0f0f]">
            {copy.nav.contact}
          </Link>
        </div>
      </header>

      {/* <WaterCursor /> */}

      <main className="relative max-w-6xl mx-auto space-y-10 md:space-y-14">
        <div className="relative">
          <div className="pointer-events-auto hidden md:flex flex-col gap-10 text-[#0f0f0f] absolute left-[-80px] lg:left-[-90px] top-[42%] -translate-y-1/2 z-20">
            <Link to="/" className="nav-dot font-amazing" data-label={copy.nav.home} aria-label={copy.nav.home}>
              <span className="sr-only">{copy.nav.home}</span>
            </Link>
            <Link to="/work" className="nav-dot font-amazing" data-label={copy.nav.work} aria-label={copy.nav.work}>
              <span className="sr-only">{copy.nav.work}</span>
            </Link>
          </div>
          <div className="pointer-events-auto hidden md:flex flex-col gap-10 text-[#0f0f0f] absolute right-[-80px] lg:right-[-90px] top-[42%] -translate-y-1/2 z-20 text-right">
            <Link to="/contact" className="nav-dot font-amazing" data-label={copy.nav.contact} aria-label={copy.nav.contact}>
              <span className="sr-only">{copy.nav.contact}</span>
            </Link>
          </div>

          <section className="relative isolate overflow-hidden rounded-[32px] border border-[#dccfb9] bg-white/90 shadow-[0_24px_70px_rgba(52,34,18,0.14)] px-4 py-8 md:px-10 md:py-12 reveal-up">
            <div className="relative z-10 grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-7">
                <div className="flex flex-col gap-4">
                  <span className="w-fit rounded-full border border-[#d5c5ad] bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#0f0f0f]">
                  {copy.badge}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-black text-[#0a0a0a] leading-tight">
                    {copy.title}
                  </h1>
                </div>

                <div className="space-y-5 text-base md:text-lg text-[#1f1f1f] leading-relaxed max-w-2xl">
                  <p data-reveal="text">{copy.intro}</p>
                  <h2 className="text-4xl md:text-5xl font-black text-[#0a0a0a] leading-tight">
                    {copy.schoolTitle}
                  </h2>
                  <p data-reveal="text">{copy.schoolBody}</p>
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
                  <div className="rounded-[26px] border border-[#e6d9c6] bg-white/80 p-6 shadow-[0_14px_40px_rgba(52,34,18,0.10)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(52,34,18,0.16)]">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f0f0f] mb-3">
                      {copy.valuesTitle}
                    </h2>
                  <ul className="space-y-3 text-sm md:text-base text-[#3a3a3a] leading-relaxed">
                    {copy.values.map((value) => (
                      <li key={value}>• {value}</li>
                    ))}
                  </ul>
                  </div>
                  <div className="rounded-[26px] border border-[#e6d9c6] bg-white/80 p-4 shadow-[0_14px_40px_rgba(52,34,18,0.10)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(52,34,18,0.16)]">
                    <div className="mb-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => mapRef.current?.zoomOut()}
                        disabled={!isMapReady}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e6d9c6] bg-white text-[#6b6b6b] shadow-[0_6px_16px_rgba(52,34,18,0.12)] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={copy.zoomOut}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                          <rect x="5" y="11" width="14" height="2" rx="1" fill="currentColor" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => mapRef.current?.zoomIn()}
                        disabled={!isMapReady}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e6d9c6] bg-white text-[#6b6b6b] shadow-[0_6px_16px_rgba(52,34,18,0.12)] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={copy.zoomIn}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                          <rect x="5" y="11" width="14" height="2" rx="1" fill="currentColor" />
                          <rect x="11" y="5" width="2" height="14" rx="1" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                    <div className="relative h-[170px] overflow-hidden rounded-[20px] border border-[#e6d9c6] bg-white">
                      <MapContainer
                        center={lyonPosition}
                        zoom={15}
                        scrollWheelZoom={false}
                        zoomControl={false}
                        attributionControl={false}
                        ref={mapRef}
                        whenReady={() => setIsMapReady(true)}
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
                            {copy.mapTooltip}
                          </Tooltip>
                        </Marker>
                      </MapContainer>
                      <span className="pointer-events-none absolute left-3 bottom-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2f2f2f] shadow-[0_6px_16px_rgba(52,34,18,0.12)]">
                        {copy.locationValue}
                      </span>
                      <span className="pointer-events-none absolute right-3 bottom-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6b6b6b]">
                        © OpenStreetMap contributors © CARTO
                      </span>
                    </div>
                  </div>
                </div>  
              </div>

              <aside className="space-y-4">
                <div className="relative overflow-hidden rounded-[30px] border border-[#e6d9c6] bg-white p-7 shadow-[0_18px_60px_rgba(52,34,18,0.12)] reveal-up delay-1 transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(52,34,18,0.18)]">
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
                        <p className="text-xs uppercase tracking-[0.26em] text-[#6b6b6b]">{copy.snapshotLabel}</p>
                        <p className="text-lg font-black text-[#0a0a0a] leading-tight">Quentin / Contreau</p>
                      </div>
                    </div>

                    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                      <div>
                        <dt className="text-xs uppercase tracking-[0.26em] text-[#6b6b6b]">{copy.locationLabel}</dt>
                        <dd className="font-semibold text-[#0f0f0f] mt-1">{copy.locationValue}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-[0.26em] text-[#6b6b6b]">{copy.roleLabel}</dt>
                        <dd className="font-semibold text-[#0f0f0f] mt-1">{copy.roleValue}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-[0.26em] text-[#6b6b6b]">{copy.techLabel}</dt>
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
                        <dt className="text-xs uppercase tracking-[0.26em] text-[#6b6b6b]">{copy.statusLabel}</dt>
                        <dd className="mt-1 flex items-center gap-2 font-semibold text-[#0f0f0f]">
                          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2bbf6a]/50" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#2bbf6a] shadow-[0_0_0_4px_rgba(43,191,106,0.18)]" />
                          </span>
                          <span>{copy.statusValue}</span>
                        </dd>
                      </div>
                    </dl>

                    <div className="pt-2">
                      <p className="text-xs uppercase tracking-[0.26em] text-[#6b6b6b] mb-3">{copy.keywordsLabel}</p>
                      <div className="flex flex-wrap gap-2">
                        {copy.keywords.map((label) => (
                          <span
                            key={label}
                            className="rounded-full border border-[#d5c5ad] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0f0f0f] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(52,34,18,0.16)] hover:border-[#cdb99a]"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[30px] border border-[#e6d9c6] bg-white/80 p-7 shadow-[0_18px_60px_rgba(52,34,18,0.10)] reveal-up delay-2 transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(52,34,18,0.16)]">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f0f0f] mb-4">
                    {copy.contributeTitle}
                  </h2>
                  <ul className="space-y-3 text-sm md:text-base text-[#3a3a3a] leading-relaxed">
                    {copy.contributeItems.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
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

        <div className="-mt-6 -mb-2 flex justify-center">
          <div className="flex items-center gap-4 rounded-full border border-[#e6d9c6] bg-white/85 px-5 py-2 shadow-[0_10px_30px_rgba(52,34,18,0.12)]">
            <span className="hidden sm:inline-block h-px w-10 bg-[#e6d9c6]" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Tokennn"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_8px_18px_rgba(52,34,18,0.12)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:scale-105 hover:shadow-[0_12px_24px_rgba(52,34,18,0.16)]"
                aria-label="GitHub"
              >
                <svg className="h-5 w-5 text-[#111111]" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 .5C5.73.5.5 5.74.5 12.01c0 5.1 3.29 9.43 7.86 10.95.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.73-1.52-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.38 2.9-.39.98.01 1.98.13 2.9.39 2.2-1.5 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.2.67.8.56 4.57-1.52 7.85-5.85 7.85-10.95C23.5 5.74 18.27.5 12 .5z"
                  />
                </svg>
              </a>
              <a
                href="mailto:quentin@ynov.com"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_8px_18px_rgba(52,34,18,0.12)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:scale-105 hover:shadow-[0_12px_24px_rgba(52,34,18,0.16)]"
                aria-label="Gmail"
              >
                <img src={logoGmail} alt="Gmail" className="h-5 w-5 object-contain" loading="lazy" />
              </a>
              <a
                href="mailto:quentin@ynov.com"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_8px_18px_rgba(52,34,18,0.12)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:scale-105 hover:shadow-[0_12px_24px_rgba(52,34,18,0.16)]"
                aria-label="Outlook"
              >
                <img src={logoOutlook} alt="Outlook" className="h-5 w-5 object-contain" loading="lazy" />
              </a>
            </div>
            <span className="hidden sm:inline-block h-px w-10 bg-[#e6d9c6]" aria-hidden="true" />
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-3 reveal-up delay-1">
          <div className="self-start rounded-[28px] border border-[#dccfb9] bg-white/80 p-7 shadow-[0_18px_60px_rgba(52,34,18,0.10)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(52,34,18,0.16)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f0f0f]">
                {copy.processTitle}
              </h2>
              <button
                type="button"
                aria-label="Process avatar emoji"
                className="-mt-5 flex h-32 w-32 items-center justify-center bg-transparent transition-transform duration-500 ease-out hover:-translate-y-4 hover:scale-125 hover:rotate-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3a7bb3]"
              >
                <img
                  src={avatarOutside}
                  alt=""
                  className="h-32 w-32 object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.3)]"
                  draggable="false"
                />
              </button>
            </div>
            <p data-reveal="text" className="text-sm md:text-base text-[#3a3a3a] leading-relaxed">{copy.processBody}</p>
          </div>
          <div className="relative self-start rounded-[28px] border border-[#dccfb9] bg-white/80 p-7 shadow-[0_18px_60px_rgba(52,34,18,0.10)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(52,34,18,0.16)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f0f0f]">
                {copy.toolsTitle}
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
            <div
              id="tools-grid"
              className={`grid grid-cols-3 gap-3 overflow-hidden py-2 transition-all duration-700 ease-in-out ${isToolsExpanded ? "max-h-[880px] pb-8" : "max-h-[180px]"}`}
              style={{ willChange: "max-height" }}
            >
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoCursor}
                  alt="Cursor logo"
                  className="h-8 w-8 rounded-lg object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Cursor</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoHostinger}
                  alt="Hostinger logo"
                  className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Hostinger</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <svg
                  className="h-8 w-8 transition-transform duration-300 group-hover:scale-110"
                  viewBox="0 0 40 40"
                  aria-hidden="true"
                >
                  <circle cx="20" cy="20" r="3" fill="#61dafb" />
                  <ellipse cx="20" cy="20" rx="14" ry="5.5" fill="none" stroke="#61dafb" strokeWidth="2" />
                  <ellipse
                    cx="20"
                    cy="20"
                    rx="14"
                    ry="5.5"
                    fill="none"
                    stroke="#61dafb"
                    strokeWidth="2"
                    transform="rotate(60 20 20)"
                  />
                  <ellipse
                    cx="20"
                    cy="20"
                    rx="14"
                    ry="5.5"
                    fill="none"
                    stroke="#61dafb"
                    strokeWidth="2"
                    transform="rotate(120 20 20)"
                  />
                </svg>
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">React</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <svg
                  className="h-8 w-8 transition-transform duration-300 group-hover:scale-110"
                  viewBox="0 0 64 40"
                  aria-hidden="true"
                >
                  <path
                    d="M8 16c4-8 12-8 16 0s12 8 16 0 12-8 16 0"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 30c4-8 12-8 16 0s12 8 16 0 12-8 16 0"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                </svg>
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Tailwind</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <svg
                  className="h-8 w-8 transition-transform duration-300 group-hover:scale-110"
                  viewBox="0 0 40 40"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="36" height="36" rx="6" fill="#3178c6" />
                  <text
                    x="20"
                    y="25"
                    textAnchor="middle"
                    fontSize="16"
                    fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
                    fontWeight="700"
                    fill="#ffffff"
                  >
                    TS
                  </text>
                </svg>
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">TypeScript</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoFramer}
                  alt="Framer logo"
                  className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Framer</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoGsap}
                  alt="GSAP logo"
                  className="h-8 w-8 rounded-lg object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">GSAP</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoLenis}
                  alt="Lenis logo"
                  className="h-8 w-8 rounded-lg object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Lenis</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoFigma}
                  alt="Figma logo"
                  className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Figma</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoNotion}
                  alt="Notion logo"
                  className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Notion</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoGolang}
                  alt="Golang logo"
                  className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Golang</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoNode}
                  alt="Node.js logo"
                  className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Node</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoAirtable}
                  alt="Airtable logo"
                  className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Airtable</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoPostman}
                  alt="Postman logo"
                  className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Postman</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoFirebase}
                  alt="Firebase logo"
                  className="h-8 w-8 rounded-lg object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Firebase</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoSupabase}
                  alt="Supabase logo"
                  className="h-8 w-8 rounded-lg object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Supabase</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoMysql}
                  alt="MySQL logo"
                  className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">MySQL</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoMariadb}
                  alt="MariaDB logo"
                  className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">MariaDB</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoXamp}
                  alt="Xamp logo"
                  className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Xamp</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoGit}
                  alt="Git logo"
                  className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Git</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoDocker}
                  alt="Docker logo"
                  className="h-8 w-8 rounded-lg object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Docker</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoThreejs}
                  alt="Three.js logo"
                  className="h-8 w-8 rounded-lg object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Three.js</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoWebgl}
                  alt="WebGL logo"
                  className="h-8 w-8 rounded-2xl object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">WebGL</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoVue}
                  alt="Vue logo"
                  className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Vue</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoNuxt}
                  alt="Nuxt logo"
                  className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">Nuxt</span>
              </div>
              <div className="group flex flex-col items-center gap-2 rounded-2xl border border-[#e6d9c6] bg-white/90 px-2 py-3 text-center shadow-[0_10px_24px_rgba(52,34,18,0.08)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(52,34,18,0.14)]">
                <img
                  src={logoWordpress}
                  alt="WordPress logo"
                  className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  draggable="false"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#3a3a3a]">WordPress</span>
              </div>
            </div>
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={() => setIsToolsExpanded((prev) => !prev)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dccfb9] bg-white/90 text-[#0f0f0f] shadow-[0_8px_18px_rgba(52,34,18,0.12)] transition-transform duration-300 hover:-translate-y-0.5 hover:scale-105"
                aria-label={isToolsExpanded ? copy.toolsCollapseLabel : copy.toolsExpandLabel}
                aria-expanded={isToolsExpanded}
                aria-controls="tools-grid"
              >
                <svg
                  className={`h-4 w-4 transition-transform duration-300 ${isToolsExpanded ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M12 5v12m0 0l-5-5m5 5l5-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="self-start rounded-[28px] border border-[#dccfb9] bg-white/80 p-7 shadow-[0_18px_60px_rgba(52,34,18,0.10)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(52,34,18,0.16)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f0f0f]">
                {copy.outsideTitle}
              </h2>
              <button
                type="button"
                aria-label="Outside work avatar emoji"
                className="-mt-5 flex h-32 w-32 items-center justify-center bg-transparent transition-transform duration-500 ease-out hover:-translate-y-4 hover:scale-125 hover:rotate-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3ab37b]"
              >
                <img
                  src={avatarProcess}
                  alt=""
                  className="h-32 w-32 object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.3)]"
                  draggable="false"
                />
              </button>
            </div>
            <p data-reveal="text" className="text-sm md:text-base text-[#3a3a3a] leading-relaxed">{copy.outsideBody}</p>
          </div>
        </section>

        <div className="flex justify-center py-0">
          <p className="text-center text-[10px] md:text-xs font-amazing tracking-[0.14em] md:tracking-[0.12em] text-[#6b6b6b] leading-relaxed px-3 max-w-[320px] md:max-w-none md:whitespace-nowrap">
           {copy.contactTagline}
          </p>
        </div>

        <div className="mt-4 border-t border-[#e6d9c6] pt-4 text-[11px] md:text-xs text-[#6b6b6b]">
          <div className="flex flex-col items-center text-center gap-3 md:flex-row md:items-center md:justify-between md:text-left">
            <p className="font-sans tracking-[0.08em]">{copy.footerRights}</p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
              <span className="inline-flex items-center justify-center gap-2 font-sans tracking-[0.08em]">
                {copy.footerBuiltWith}
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
                <svg className="h-5 w-6" viewBox="0 0 54 33" aria-hidden="true">
                  <path
                    d="M27 0C19.8 0 15.3 3.6 13.5 10.8C15.3 7.2 18.9 5.4 24.3 5.4C31.5 5.4 36 9 37.8 16.2C36 12.6 32.4 10.8 27 10.8C19.8 10.8 15.3 7.2 13.5 0Z"
                    fill="#38bdf8"
                  />
                  <path
                    d="M27 16.2C19.8 16.2 15.3 19.8 13.5 27C15.3 23.4 18.9 21.6 24.3 21.6C31.5 21.6 36 25.2 37.8 32.4C36 28.8 32.4 27 27 27C19.8 27 15.3 23.4 13.5 16.2Z"
                    fill="#38bdf8"
                  />
                </svg>
              </span>
              <span className="hidden md:inline text-[#b7b0a3]">•</span>
              <span className="inline-flex items-center justify-center gap-2 font-sans tracking-[0.08em]">
                {copy.footerHostedOn}
                <img src={logoNetlify} alt="Netlify" className="h-5 w-5 rounded object-contain" loading="lazy" />
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default About;
