import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import { divIcon, type Map as LeafletMap } from "leaflet";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import portrait from "./iip.jpeg";
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
import voyageCardImage from "./Voyage.png";
import musicCardImage from "./Musique.png";
import modeCardImage from "./Mode.png";
import LanguageToggle from "./components/LanguageToggle";
import WaterCursor from "./components/WaterCursor";
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
const outsideCardImages: Record<string, string> = {
  music: musicCardImage,
  travel: voyageCardImage,
  fashion: modeCardImage
};
const outsideImageOnlyTones = new Set(["music", "travel", "fashion"]);
const getOutsideCardImage = (tone: string) => outsideCardImages[tone] ?? null;
const isOutsideCardImageOnly = (tone: string) => outsideImageOnlyTones.has(tone);
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
    title: "Développeur créatif freelance & VibeDev",
    intro:
      "Développeur créatif basé en France, passionné par l'art numérique, le creative coding et l'animation 3D. Je recherche en continu des missions freelance ou en équipe pour concevoir des expériences digitales soignées.",
    schoolTitle: "Formation",
    schoolBody:
      "Actuellement en 3e année de Bachelor Développement à Ynov Campus Lyon, avec une spécialisation web. À terme, je souhaite renforcer mon expertise en design web pendant mon cycle Master.",
    valuesTitle: "Valeurs",
    values: ["Esprit d'équipe", "Créativité", "Innovation", "Adaptabilité"],
    zoomOut: "Dézoomer la carte",
    zoomIn: "Zoomer la carte",
    mapTooltip: "Je suis ici",
    snapshotLabel: "Profil",
    locationLabel: "Localisation",
    locationValue: "Lyon, France",
    roleLabel: "Rôle",
    roleValue: "Développeur créatif",
    techLabel: "Technologies",
    statusLabel: "Statut",
    statusValue: "Disponible",
    keywordsLabel: "Mots-clés",
    keywords: ["Design", "UI", "UX", "Ergonomie", "Simplicité"],
    processTitle: "Processus",
    processBody:
      "Je commence par un brief clair, puis je propose une direction visuelle rapide. Ensuite, je construis un MVP pour une première démonstration client. Après validation, je passe au développement complet, aux tests et aux optimisations avant mise en ligne.",
    toolsTitle: "Outils",
    outsideHeadingLines: ["En dehors", "du travail"],
    outsideTitle: "En dehors du travail",
    outsideBody:
      "Passionné par le sport, le dessin, la photo/vidéo, la mode, la musique et les voyages.",
    outsideItems: [
      { title: "Mode", text: "Silhouettes, matières.", tone: "fashion" },
      { title: "Musique", text: "Rythme, ambiance.", tone: "music" },
      { title: "Voyages", text: "Découvrir, apprendre.", tone: "travel" }
    ],
    contributeTitle: "Ce que j'apporte",
    contributeItems: [
      "Développement front-end.",
      "Développement back-end.",
      "Optimisation des performances web."
    ],
    contactTagline: "- Contactez-moi pour collaborer ou simplement échanger -",
    footerRights: "© 2025 Quentin Contreau. Tous droits réservés.",
    footerBuiltWith: "Créé avec",
    footerHostedOn: "Hébergé sur",
    toolsExpandLabel: "Afficher plus d'outils",
    toolsCollapseLabel: "Réduire la liste des outils",
    playAudioLabel: "Lancer l'audio",
    pauseAudioLabel: "Mettre l'audio en pause"
  },
  en: {
    nav: {
      home: "Home",
      work: "Work",
      about: "About",
      contact: "Contact"
    },
    badge: "About",
    title: "Freelance creative developer & VibeDev",
    intro:
      "Creative developer based in France, passionate about digital art, creative coding, and 3D animation. Always looking for exciting freelance or team opportunities to build beautiful digital experiences.",
    schoolTitle: "Education",
    schoolBody:
      "I am currently in my third year of a Bachelor's degree in Development at Ynov Campus Lyon, focused on web development. During my Master's cycle, I plan to deepen my specialization in web design.",
    valuesTitle: "Values",
    values: ["Team spirit", "Creativity", "Innovation", "Adaptability"],
    zoomOut: "Zoom out map",
    zoomIn: "Zoom in map",
    mapTooltip: "I'm here!!",
    snapshotLabel: "Snapshot",
    locationLabel: "Location",
    locationValue: "Lyon, France",
    roleLabel: "Role",
    roleValue: "Creative developer",
    techLabel: "Technologies",
    statusLabel: "Status",
    statusValue: "Available",
    keywordsLabel: "Keywords",
    keywords: ["Design", "UI", "UX", "Ergonomics", "Simplicity"],
    processTitle: "Process",
    processBody:
      "I start with a clear brief, then propose a quick visual direction. Next, I build an MVP for an initial client review. Once validated, I move to full development, testing, and optimization before launch.",
    toolsTitle: "Tools",
    outsideHeadingLines: ["Outside", "of work"],
    outsideTitle: "Outside of work",
    outsideBody:
      "Passionate about sports, drawing, photo/video, fashion, music, and travel.",
    outsideItems: [
      { title: "Fashion", text: "Silhouettes, materials.", tone: "fashion" },
      { title: "Music", text: "Rhythm, ambience.", tone: "music" },
      { title: "Travel", text: "Explore and learn.", tone: "travel" }
    ],
    contributeTitle: "What I bring",
    contributeItems: [
      "Front-end development.",
      "Back-end development.",
      "Web page optimization."
    ],
    contactTagline: "- Contact me for collaboration or just to say hi -",
    footerRights: "© 2025 Quentin Contreau. All rights reserved.",
    footerBuiltWith: "Built with",
    footerHostedOn: "Hosted on",
    toolsExpandLabel: "Show more tools",
    toolsCollapseLabel: "Show fewer tools",
    playAudioLabel: "Play audio",
    pauseAudioLabel: "Pause audio"
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
  const { language } = useLanguage();
  useTextReveal({ observeMutations: false, watch: language });

  const copy = aboutCopy[language];
  const outsideItems = copy.outsideItems ?? [];
  const outsideHeadingLines = copy.outsideHeadingLines;
  const outsideStackMinHeight = Math.max(500, outsideItems.length * 200);
  const mapRef = useRef<LeafletMap | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isToolsExpanded, setIsToolsExpanded] = useState(false);
  const [toolsGridExpandedHeight, setToolsGridExpandedHeight] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barRefs = useRef<{ mobile: HTMLSpanElement[]; desktop: HTMLSpanElement[] }>({
    mobile: [],
    desktop: []
  });
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafAudioRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReactive, setIsReactive] = useState(false);
  const [cursorEnabled, setCursorEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    return !coarsePointer;
  });
  const autoPlayAttempted = useRef(false);
  const outsideStackRef = useRef<HTMLDivElement | null>(null);
  const toolsGridRef = useRef<HTMLDivElement | null>(null);
  const toolsCardRef = useRef<HTMLDivElement | null>(null);
  const outsideCardRef = useRef<HTMLDivElement | null>(null);
  const outsideTitleRef = useRef<HTMLHeadingElement | null>(null);
  const outsideViewportRef = useRef<HTMLDivElement | null>(null);
  const outsideSectionRef = useRef<HTMLDivElement | null>(null);
  const [outsideCardHeight, setOutsideCardHeight] = useState<number | null>(null);
  const [outsideViewportHeight, setOutsideViewportHeight] = useState<number | null>(null);
  const [outsideStackHeight, setOutsideStackHeight] = useState<number | null>(null);
  const outsideScrollDistance = outsideViewportHeight
    ? Math.max(0, (outsideStackHeight ?? outsideStackMinHeight) - outsideViewportHeight)
    : outsideCardHeight
      ? Math.max(0, (outsideStackHeight ?? outsideStackMinHeight) - outsideCardHeight)
      : 0;
  const toolsGridCollapsedHeight = 180;
  const toolsGridTargetHeight = isToolsExpanded
    ? Math.max(toolsGridCollapsedHeight, toolsGridExpandedHeight)
    : toolsGridCollapsedHeight;
  const toolsGridStyle: CSSProperties = {
    maxHeight: toolsGridTargetHeight,
    paddingBottom: isToolsExpanded ? 32 : 0,
    willChange: "max-height,padding"
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateViewport = () => setIsDesktop(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const update = () => {
      setCursorEnabled(!coarsePointerQuery.matches);
    };
    update();
    coarsePointerQuery.addEventListener("change", update);
    return () => coarsePointerQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!cursorEnabled || typeof document === "undefined") return;
    document.body.classList.add("work-hide-cursor");
    return () => {
      document.body.classList.remove("work-hide-cursor");
    };
  }, [cursorEnabled]);

  useLayoutEffect(() => {
    const target = toolsCardRef.current;
    if (!target) return;

    const updateHeight = () => {
      const nextHeight = Math.round(target.getBoundingClientRect().height);
      setOutsideCardHeight((prev) => (prev === nextHeight ? prev : nextHeight));
    };

    updateHeight();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const grid = toolsGridRef.current;
    if (!grid) return;

    const updateHeight = () => {
      const nextHeight = Math.ceil(grid.scrollHeight);
      setToolsGridExpandedHeight((prev) => (prev === nextHeight ? prev : nextHeight));
    };

    updateHeight();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [language, isDesktop, isToolsExpanded]);

  useLayoutEffect(() => {
    const viewport = outsideViewportRef.current;
    if (!viewport) return;

    const updateHeight = () => {
      const nextHeight = Math.round(viewport.getBoundingClientRect().height);
      setOutsideViewportHeight((prev) => (prev === nextHeight ? prev : nextHeight));
    };

    updateHeight();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const stack = outsideStackRef.current;
    if (!stack) return;

    const updateHeight = () => {
      const nextHeight = Math.round(stack.scrollHeight);
      setOutsideStackHeight((prev) => (prev === nextHeight ? prev : nextHeight));
    };

    updateHeight();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(stack);
    return () => observer.disconnect();
  }, [language, isToolsExpanded]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!outsideCardHeight && !outsideViewportHeight && !outsideStackHeight) return;
    ScrollTrigger.refresh();
  }, [outsideCardHeight, outsideViewportHeight, outsideStackHeight]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!outsideCardHeight && !outsideViewportHeight) return;
    const outsideCard = outsideCardRef.current;
    const stack = outsideStackRef.current;
    const viewport = outsideViewportRef.current;
    const title = outsideTitleRef.current;
    const triggerTarget = outsideCard;
    if (!triggerTarget || !stack || !viewport) return;
    gsap.registerPlugin(ScrollTrigger);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lineTargets = title ? Array.from(title.querySelectorAll<HTMLElement>(".outside-stage-title-line")) : [];
    const titleTargets: HTMLElement[] = title ? (lineTargets.length ? lineTargets : [title]) : [];
    let hasPlayedTitleReveal = false;

    const baseScrollDistance = outsideScrollDistance;
    if (baseScrollDistance === 0) return;
    const introHoldDistance = isDesktop ? 220 : 140;
    const perCardHoldDistance = isDesktop ? 190 : 130;
    const cardsHoldDistance = outsideItems.length * perCardHoldDistance;
    const totalScrollDistance = baseScrollDistance + introHoldDistance + cardsHoldDistance;
    const introHoldRatio = introHoldDistance / totalScrollDistance;
    const endStateProgressThreshold = 0.985;
    const reverseRevealProgressThreshold = 0.9;
    const progressNormalizer = gsap.utils.clamp(0, 1);
    const getDelayedProgress = (progress: number) =>
      progressNormalizer((progress - introHoldRatio) / Math.max(0.0001, 1 - introHoldRatio));

    const ctx = gsap.context(() => {
      const pinStart = "center center";
      const stackStartY = -baseScrollDistance;
      const stackEndY = 0;
      const setTitleRevealState = (revealed: boolean, immediate = false) => {
        if (!titleTargets.length || prefersReducedMotion) return;
        gsap.killTweensOf(titleTargets);
        if (!revealed) {
          const hiddenState = {
            autoAlpha: 0,
            y: 18,
            filter: "blur(1.4px)",
            pointerEvents: "none" as const,
            transformOrigin: "50% 100%"
          };
          if (immediate) {
            gsap.set(titleTargets, hiddenState);
          } else {
            gsap.to(titleTargets, {
              ...hiddenState,
              duration: 0.42,
              ease: "power2.inOut",
              stagger: 0.04,
              overwrite: "auto"
            });
          }
          return;
        }
        gsap.to(titleTargets, {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          pointerEvents: "auto",
          duration: 0.78,
          ease: "power3.out",
          stagger: 0.06,
          overwrite: "auto",
          clearProps: "transform,opacity,visibility,filter,pointer-events"
        });
      };
      const playTitleReveal = () => {
        if (hasPlayedTitleReveal || prefersReducedMotion || !titleTargets.length) return;
        hasPlayedTitleReveal = true;
        setTitleRevealState(true);
      };

      const wrappers = gsap.utils.toArray<HTMLDivElement>(".outside-card-wrapper", stack);
      const cardEntries = wrappers
        .map((wrapper) => {
          const card = wrapper.querySelector<HTMLElement>(".outside-card");
          return card ? { wrapper, card } : null;
        })
        .filter((entry): entry is { wrapper: HTMLDivElement; card: HTMLElement } => entry !== null);
      const cards = cardEntries.map((entry) => entry.card);
      const clampDistance = gsap.utils.clamp(-1.35, 1.35);
      const enableCardDepth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const setViewportSpill = (enabled: boolean) => {
        viewport.classList.toggle("outside-stack-viewport--spill", enabled);
      };
      let isStageChromeHidden = false;
      const setStageChromeHidden = (hidden: boolean) => {
        if (isStageChromeHidden === hidden) return;
        isStageChromeHidden = hidden;
        triggerTarget.classList.toggle("outside-stage--chrome-hidden", hidden);
      };
      let viewportHeight = 0;
      let viewportCenter = 0;
      let influenceRange = 0;
      let cardCenters: number[] = [];

      const measureDepthTargets = () => {
        viewportHeight = viewport.getBoundingClientRect().height;
        viewportCenter = viewportHeight * 0.5;
        influenceRange = Math.max(140, viewportHeight * 0.7);
        cardCenters = cardEntries.map(({ wrapper }) => wrapper.offsetTop + wrapper.offsetHeight * 0.5);
      };

      const updateCardDepth = (progress: number) => {
        if (!viewportHeight || !cardEntries.length) return false;
        const translateY = stackStartY + (stackEndY - stackStartY) * progress;
        const clampProgress = gsap.utils.clamp(0, 1);
        const smoothStep = (value: number) => value * value * (3 - 2 * value);
        const revealStep = cardEntries.length > 0 ? 0.2 : 0;
        const revealWindow = 0.28;
        const endExitStart = 0.78;
        const endExitWindow = 0.22;
        const pageCenterX = window.innerWidth * 0.5;
        const pageCenterY = window.innerHeight * 0.5;
        let shouldHideChrome = false;

        cardEntries.forEach(({ wrapper, card }, index) => {
          const cardCenter = cardCenters[index] + translateY;
          const normalizedDistance = clampDistance((cardCenter - viewportCenter) / influenceRange);
          const prominence = 1 - Math.min(1, Math.abs(normalizedDistance));
          const isMediaCard = card.classList.contains("outside-card--media");
          const depthWeight = isMediaCard ? 30 : 12;
          const focusScale = isMediaCard ? 0.92 + prominence * 0.52 : 0.88 + prominence * 0.16;
          const focusOpacity = isMediaCard ? 0.44 + prominence * 0.56 : 0.36 + prominence * 0.64;
          const liftY = isMediaCard ? normalizedDistance * 10 : normalizedDistance * 32;
          const direction = index % 2 === 0 ? -1 : 1;
          const mediaDirection = 1;
          const shadowStrength = isMediaCard ? 0.2 + prominence * 0.28 : 0.1 + prominence * 0.18;
          const focusFilter = isMediaCard
            ? `saturate(${0.9 + prominence * 0.25}) contrast(${0.92 + prominence * 0.18})`
            : `saturate(${0.95 + prominence * 0.12})`;
          const revealIndex = cardEntries.length - 1 - index;
          const revealStart = revealStep * revealIndex;
          const revealProgress = clampProgress((progress - revealStart) / revealWindow);
          const revealEase = smoothStep(revealProgress);
          const revealOffset = isMediaCard ? (1 - revealProgress) * 68 : 0;
          const revealScale = isMediaCard ? 0.84 + revealEase * 0.16 : 1;
          const revealOpacity = isMediaCard ? revealEase : 1;
          const breakoutTrigger = clampProgress((prominence - 0.42) / 0.58);
          const breakoutEase = isMediaCard && isDesktop ? breakoutTrigger * breakoutTrigger : 0;
          const breakoutScale = isMediaCard ? 1 + breakoutEase * 0.66 : 1;
          const breakoutShadowBoost = breakoutEase * 0.22;
          const endExitDelay = revealIndex * 0.04;
          const endExitProgress = clampProgress((progress - (endExitStart + endExitDelay)) / endExitWindow);
          const endExitEase = smoothStep(endExitProgress);
          const exitScale = 1 - endExitEase * (isMediaCard ? 0.16 : 0.08);
          const exitOpacity = 1 - endExitEase * (isMediaCard ? 0.58 : 0.32);
          const exitOffsetY = endExitEase * (isMediaCard ? 52 : 24);
          const exitRotationFactor = 1 - endExitEase * 0.4;
          const exitBlur = isMediaCard ? endExitEase * 1.3 : endExitEase * 0.7;
          let breakoutX = 0;
          let breakoutY = 0;

          if (breakoutEase > 0) {
            const rect = card.getBoundingClientRect();
            const currentCenterX = rect.left + rect.width * 0.5;
            const currentCenterY = rect.top + rect.height * 0.5;
            breakoutX = (pageCenterX - currentCenterX) * breakoutEase;
            breakoutY = (pageCenterY - currentCenterY) * breakoutEase;
          }

          if (isMediaCard && (revealProgress > 0.4 || breakoutEase > 0.035) && endExitProgress < 0.86) {
            shouldHideChrome = true;
          }

          gsap.set(wrapper, {
            zIndex:
              cardEntries.length -
              index +
              Math.round(prominence * depthWeight) +
              Math.round(breakoutEase * 450) -
              Math.round(endExitEase * 140)
          });
          gsap.set(card, {
            x: breakoutX,
            y: liftY + revealOffset + breakoutY + exitOffsetY,
            scale: focusScale * revealScale * breakoutScale * exitScale,
            rotateX: (isMediaCard ? -normalizedDistance * 2.4 : -normalizedDistance * 8) * exitRotationFactor,
            rotateY: isMediaCard
              ? mediaDirection * (1 - prominence) * (1.6 - breakoutEase * 1.1) * exitRotationFactor
              : direction * (1 - prominence) * 9 * exitRotationFactor,
            rotateZ: isMediaCard
              ? mediaDirection * normalizedDistance * (0.45 - breakoutEase * 0.25) * exitRotationFactor
              : direction * normalizedDistance * 2.6 * exitRotationFactor,
            opacity: focusOpacity * revealOpacity * exitOpacity,
            filter: `${focusFilter} blur(${exitBlur.toFixed(2)}px)`,
            boxShadow: `0 22px 56px rgba(52, 34, 18, ${(
              (shadowStrength + breakoutShadowBoost) *
              (1 - endExitEase * 0.45)
            ).toFixed(3)})`
          });
        });

        return shouldHideChrome;
      };

      gsap.set(stack, { y: stackStartY });
      gsap.set(wrappers, { zIndex: 1 });
      if (!prefersReducedMotion && titleTargets.length) {
        setTitleRevealState(false, true);
      }
      if (cards.length) {
        cards.forEach((card) => {
          const isMediaCard = card.classList.contains("outside-card--media");
          gsap.set(card, {
            transformOrigin: isMediaCard ? "50% 50%" : "50% 100%",
            backfaceVisibility: "hidden"
          });
        });
      }
      if (enableCardDepth) {
        measureDepthTargets();
        setStageChromeHidden(false);
        updateCardDepth(0);
      } else if (cards.length) {
        gsap.set(cards, { clearProps: "transform,opacity" });
      }

      if (isDesktop) {
        ScrollTrigger.create({
          trigger: triggerTarget,
          start: pinStart,
          end: () => `+=${totalScrollDistance}`,
          pin: true,
          pinSpacing: true,
          pinType: "transform",
          anticipatePin: 1,
          invalidateOnRefresh: true,
          id: "outside-row-pin"
        });
      }

      const stackDriver = { progress: 0 };
      const updateStageByProgress = (rawProgress: number, isActive: boolean) => {
        const normalizedRawProgress = progressNormalizer(rawProgress);
        const delayedProgress = getDelayedProgress(normalizedRawProgress);
        const translateY = stackStartY + (stackEndY - stackStartY) * delayedProgress;
        const isComplete = normalizedRawProgress >= endStateProgressThreshold;
        const shouldSpill = isActive && normalizedRawProgress < reverseRevealProgressThreshold;
        gsap.set(stack, { y: translateY });
        setViewportSpill(shouldSpill);
        if (enableCardDepth) {
          const hideChrome = updateCardDepth(delayedProgress);
          const keepChromeHiddenNearEnd = isActive && normalizedRawProgress >= reverseRevealProgressThreshold;
          setStageChromeHidden(isComplete || keepChromeHiddenNearEnd || (isActive && hideChrome));
        } else {
          setStageChromeHidden(isComplete || (isActive && delayedProgress > 0.32));
        }
      };

      const stackTween = gsap.to(stackDriver, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: triggerTarget,
          start: isDesktop ? pinStart : "top center",
          end: () => `+=${totalScrollDistance}`,
          scrub: true,
          invalidateOnRefresh: true,
          onEnter: () => {
            playTitleReveal();
          },
          onLeave: () => {
            setViewportSpill(false);
            setStageChromeHidden(true);
          },
          onLeaveBack: () => {
            setViewportSpill(false);
            setStageChromeHidden(false);
            hasPlayedTitleReveal = false;
            setTitleRevealState(false);
          },
          onToggle: (self) => {
            if (!self.isActive) {
              setStageChromeHidden(self.progress >= endStateProgressThreshold);
            }
          },
          onUpdate: (self) => {
            updateStageByProgress(self.progress, self.isActive);
          },
          onRefresh: (self) => {
            if (enableCardDepth) measureDepthTargets();
            updateStageByProgress(self.progress, self.isActive);
          },
          id: isDesktop ? "outside-stack-scroll" : "outside-stack-scroll-mobile"
        }
      });

      updateStageByProgress(stackTween.scrollTrigger?.progress ?? 0, stackTween.scrollTrigger?.isActive ?? false);
    }, triggerTarget);

    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 0);
    return () => {
      window.clearTimeout(refreshId);
      viewport.classList.remove("outside-stack-viewport--spill");
      triggerTarget.classList.remove("outside-stage--chrome-hidden");
      if (titleTargets.length) {
        gsap.killTweensOf(titleTargets);
        gsap.set(titleTargets, { clearProps: "transform,opacity,visibility,filter" });
      }
      ctx.revert();
    };
  }, [
    isDesktop,
    outsideCardHeight,
    outsideScrollDistance,
    outsideStackHeight,
    outsideViewportHeight,
    language,
    outsideStackMinHeight,
    outsideItems.length
  ]);

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
    const { mobile, desktop } = barRefs.current;
    [mobile, desktop].forEach((group) => {
      group.forEach((bar) => {
        if (!bar) return;
        bar.style.setProperty("--bar-scale", "0.35");
      });
    });
  };

  const startVisualization = () => {
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    if (!analyser || !dataArray) return;

    const { mobile, desktop } = barRefs.current;
    const totalBars = islandBars.length;
    const step = Math.max(1, Math.floor(dataArray.length / totalBars));
    const minScale = 0.2;
    const maxScale = 1;

    const render = () => {
      analyser.getByteFrequencyData(dataArray);
      for (let i = 0; i < totalBars; i += 1) {
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
        const scaleValue = scale.toFixed(2);
        const mobileBar = mobile[i];
        if (mobileBar) mobileBar.style.setProperty("--bar-scale", scaleValue);
        const desktopBar = desktop[i];
        if (desktopBar) desktopBar.style.setProperty("--bar-scale", scaleValue);
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = outsideStackRef.current;
    if (!container) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set(container, { willChange: "transform" });
    }, container);

    return () => ctx.revert();
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
    <div
      className="about-liquid-scope font-boxing relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f8f3ea] via-[#f2e6d7] to-[#fdf8ef] text-[#0f0f0f] px-4 md:px-8 pt-28 pb-12 md:py-16"
      data-work-fluid-scope="true"
      lang={language === "fr" ? "fr" : "en"}
    >
      {cursorEnabled && <WaterCursor size="md" interactionMode="text-only" />}
      <audio ref={audioRef} src={islandAudioSrc} preload="auto" playsInline />
      <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.85),transparent_38%),radial-gradient(circle_at_82%_6%,rgba(253,230,205,0.45),transparent_46%),radial-gradient(circle_at_24%_80%,rgba(210,175,140,0.28),transparent_50%)]" />
      <div className="fixed inset-x-0 top-0 z-50 flex flex-col gap-2 pt-[calc(env(safe-area-inset-top,0px)+8px)] sm:hidden">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleTogglePlayback}
            className="dynamic-island dynamic-island--large"
            aria-label={isPlaying ? copy.pauseAudioLabel : copy.playAudioLabel}
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
                      if (el) barRefs.current.mobile[index] = el;
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
          aria-label={isPlaying ? copy.pauseAudioLabel : copy.playAudioLabel}
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
                    if (el) barRefs.current.desktop[index] = el;
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

      <header className="relative z-20 max-w-6xl mx-auto mt-2 mb-10 md:mt-4 md:mb-14">
        <nav className="work-menu-glass mx-auto w-full max-w-[760px] px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <Link to="/" className="work-menu-link work-refractable">{copy.nav.home}</Link>
            <Link to="/work" className="work-menu-link work-refractable">{copy.nav.work}</Link>
            <Link to="/about" className="work-menu-link is-active work-refractable">{copy.nav.about}</Link>
            <Link to="/contact" className="work-menu-link work-refractable">{copy.nav.contact}</Link>
          </div>
        </nav>
      </header>

      <main className="relative max-w-6xl mx-auto space-y-10 md:space-y-14">
        <div className="relative">
          <section className="relative isolate overflow-hidden rounded-[32px] border border-[#dccfb9] bg-white/90 shadow-[0_24px_70px_rgba(52,34,18,0.14)] px-4 py-8 md:px-10 md:py-12 reveal-up">
            <div className="relative z-10 grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-7">
                <div className="flex flex-col gap-4">
                  <span className="work-refractable w-fit rounded-full border border-[#d5c5ad] bg-white/90 px-4 py-2 text-xs font-amazing font-semibold uppercase tracking-[0.3em] text-[#0f0f0f]">
                  {copy.badge}
                  </span>
                  <h1 className="work-refractable font-amazing text-4xl md:text-5xl font-black text-[#0a0a0a] leading-tight">
                    {copy.title}
                  </h1>
                </div>

                <div className="space-y-5 text-base md:text-lg text-[#1f1f1f] leading-relaxed max-w-2xl">
                  <p data-reveal="text" className="work-refractable font-amazing">{copy.intro}</p>
                  <h2 className="work-refractable font-amazing text-4xl md:text-5xl font-black text-[#0a0a0a] leading-tight">
                    {copy.schoolTitle}
                  </h2>
                  <p data-reveal="text" className="work-refractable font-amazing">{copy.schoolBody}</p>
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
                  <div className="liquid-glass-edge rounded-[26px] border border-[#e6d9c6] bg-white/80 p-6 shadow-[0_14px_40px_rgba(52,34,18,0.10)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(52,34,18,0.16)]">
                    <h2 className="work-refractable text-sm font-amazing font-semibold uppercase tracking-[0.24em] text-[#0f0f0f] mb-3">
                      {copy.valuesTitle}
                    </h2>
                  <ul className="space-y-3 text-sm md:text-base font-amazing text-[#3a3a3a] leading-relaxed">
                    {copy.values.map((value) => (
                      <li key={value} className="work-refractable">• {value}</li>
                    ))}
                  </ul>
                  </div>
                  <div className="liquid-glass-edge rounded-[26px] border border-[#e6d9c6] bg-white/80 p-4 shadow-[0_14px_40px_rgba(52,34,18,0.10)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(52,34,18,0.16)]">
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
                      <span className="work-refractable pointer-events-none absolute left-3 bottom-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2f2f2f] shadow-[0_6px_16px_rgba(52,34,18,0.12)]">
                        {copy.locationValue}
                      </span>
                      <span className="work-refractable pointer-events-none absolute right-3 bottom-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6b6b6b]">
                        © OpenStreetMap contributors © CARTO
                      </span>
                    </div>
                  </div>
                </div>  
              </div>

              <aside className="space-y-4">
                <div className="liquid-glass-edge relative overflow-hidden rounded-[30px] border border-[#e6d9c6] bg-white p-7 shadow-[0_18px_60px_rgba(52,34,18,0.12)] reveal-up delay-1 transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(52,34,18,0.18)]">
                  <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(253,230,205,0.6),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(210,175,140,0.26),transparent_55%)]" />
                  <div className="relative z-10 space-y-6 font-amazing">
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
                        <p className="work-refractable text-xs font-semibold uppercase tracking-[0.26em] text-[#6b6b6b]">{copy.snapshotLabel}</p>
                        <p className="work-refractable text-lg font-black text-[#0a0a0a] leading-tight">Quentin / Contreau</p>
                      </div>
                    </div>

                    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                      <div>
                        <dt className="work-refractable text-xs uppercase tracking-[0.26em] text-[#6b6b6b]">{copy.locationLabel}</dt>
                        <dd className="work-refractable font-semibold text-[#0f0f0f] mt-1">{copy.locationValue}</dd>
                      </div>
                      <div>
                        <dt className="work-refractable text-xs uppercase tracking-[0.26em] text-[#6b6b6b]">{copy.roleLabel}</dt>
                        <dd className="work-refractable font-semibold text-[#0f0f0f] mt-1">{copy.roleValue}</dd>
                      </div>
                      <div>
                        <dt className="work-refractable text-xs uppercase tracking-[0.26em] text-[#6b6b6b]">{copy.techLabel}</dt>
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
                        <dt className="work-refractable text-xs uppercase tracking-[0.26em] text-[#6b6b6b]">{copy.statusLabel}</dt>
                        <dd className="mt-1 flex items-center gap-2 font-semibold text-[#0f0f0f]">
                          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2bbf6a]/50" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#2bbf6a] shadow-[0_0_0_4px_rgba(43,191,106,0.18)]" />
                          </span>
                          <span className="work-refractable">{copy.statusValue}</span>
                        </dd>
                      </div>
                    </dl>

                    <div className="pt-2">
                      <p className="work-refractable text-xs uppercase tracking-[0.26em] text-[#6b6b6b] mb-3">{copy.keywordsLabel}</p>
                      <div className="flex flex-wrap gap-2">
                        {copy.keywords.map((label) => (
                          <span key={label} className="keyword-liquid-chip" aria-label={label}>
                            <span className="keyword-liquid-chip__text work-refractable">{label}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="liquid-glass-edge rounded-[30px] border border-[#e6d9c6] bg-white/80 p-7 shadow-[0_18px_60px_rgba(52,34,18,0.10)] reveal-up delay-2 transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(52,34,18,0.16)]">
                  <h2 className="work-refractable text-sm font-amazing font-semibold uppercase tracking-[0.24em] text-[#0f0f0f] mb-4">
                    {copy.contributeTitle}
                  </h2>
                  <ul className="space-y-3 text-sm md:text-base font-amazing text-[#3a3a3a] leading-relaxed">
                    {copy.contributeItems.map((item) => (
                      <li key={item} className="work-refractable">• {item}</li>
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
                href="https://www.linkedin.com/in/quentin-c-752996294/"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_8px_18px_rgba(52,34,18,0.12)] transition-transform transition-shadow duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:scale-105 hover:shadow-[0_12px_24px_rgba(52,34,18,0.16)]"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5 text-[#0A66C2]" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.66H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0z"
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

        <section
          ref={outsideSectionRef}
          className="outside-section mt-14 md:mt-20 mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-4 md:gap-5"
          style={!isDesktop && outsideScrollDistance ? { paddingBottom: outsideScrollDistance } : undefined}
        >
          <div className="relative w-full overflow-visible self-start rounded-[28px] border border-[#dccfb9] bg-white/80 p-6 md:p-7">
            <div className="mb-3">
              <h2 className="about-panel-title work-refractable">
                {copy.processTitle}
              </h2>
            </div>
            <p data-reveal="text" className="work-refractable font-amazing text-sm md:text-base text-[#3a3a3a] leading-relaxed text-justify">{copy.processBody}</p>
          </div>
          <div
            ref={toolsCardRef}
            className="w-full relative overflow-visible self-start rounded-[28px] border border-[#dccfb9] bg-white/80 p-6 md:p-7"
          >
            <div className="mb-3">
              <h2 className="about-panel-title work-refractable">
                {copy.toolsTitle}
              </h2>
            </div>
            <div
              id="tools-grid"
              ref={toolsGridRef}
              data-expanded={isToolsExpanded ? "true" : "false"}
              className="tools-grid grid grid-cols-3 gap-3 overflow-hidden py-2"
              style={toolsGridStyle}
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
          <div
            className="outside-card-sticky outside-stage relative w-full self-start overflow-visible flex flex-col"
            ref={outsideCardRef}
            style={outsideCardHeight ? { height: outsideCardHeight } : undefined}
          >
            <div className="outside-stage-heading">
              <h2 ref={outsideTitleRef} className="outside-stage-title" aria-label={copy.outsideTitle}>
                {outsideHeadingLines.map((line, index) => (
                  <span key={`${line}-${index}`} className="outside-stage-title-line work-refractable">
                    {line}
                  </span>
                ))}
              </h2>
            </div>
            <div className="flex-1 min-h-0 outside-stack-viewport" ref={outsideViewportRef}>
              <div
                ref={outsideStackRef}
                className="outside-stack"
                style={{ minHeight: outsideStackMinHeight }}
              >
                {outsideItems.map((item, index) => (
                  <div key={`${item.title}-${index}`} className="outside-card-wrapper">
                    {(() => {
                      const imageSrc = getOutsideCardImage(item.tone);
                      const isImageOnly = isOutsideCardImageOnly(item.tone);
                      return (
                        <div
                          className={`outside-card${isImageOnly ? " outside-card--media" : ""}`}
                          data-tone={item.tone}
                          style={
                            !isImageOnly && imageSrc
                              ? {
                                  backgroundImage: `url(${imageSrc})`
                                }
                              : undefined
                          }
                        >
                          {isImageOnly && imageSrc ? (
                            <>
                              <img
                                src={imageSrc}
                                alt={item.title}
                                className="outside-card-media-image"
                                loading="eager"
                                draggable="false"
                              />
                            </>
                          ) : (
                        <>
                          <span className="outside-card-label work-refractable">{item.title}</span>
                          <p className="outside-card-text work-refractable">{item.text}</p>
                        </>
                      )}
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-center py-0">
          <p className="work-refractable text-center text-[10px] md:text-xs font-amazing tracking-[0.14em] md:tracking-[0.12em] text-[#6b6b6b] leading-relaxed px-3 max-w-[320px] md:max-w-none md:whitespace-nowrap">
           {copy.contactTagline}
          </p>
        </div>

        <div className="mt-4 border-t border-[#e6d9c6] pt-4 text-[11px] md:text-xs text-[#6b6b6b]">
          <div className="flex flex-col items-center text-center gap-3 md:flex-row md:items-center md:justify-between md:text-left">
            <p className="work-refractable font-amazing tracking-[0.08em]">{copy.footerRights}</p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
              <span className="inline-flex items-center justify-center gap-2 font-amazing tracking-[0.08em]">
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
              <span className="inline-flex items-center justify-center gap-2 font-boxing tracking-[0.08em]">
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
