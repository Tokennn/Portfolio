import React, { useState, ChangeEvent, FormEvent, useEffect, useRef, useMemo } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import LanguageToggle from './components/LanguageToggle';
import WaterCursor from './components/WaterCursor';
import { useLanguage } from './context/LanguageContext';
import logoCursor from './assets/logos/cursor.png';
import logoHostinger from './assets/logos/hostinger.png';
import logoGolang from './assets/logos/golang.png';
import logoFirebase from './assets/logos/firebase.png';
import logoSupabase from './assets/logos/supabase.png';
import logoMysql from './assets/logos/mysql.png';
import logoMariadb from './assets/logos/mariadb.png';
import logoXamp from './assets/logos/xamp.png';
import logoGit from './assets/logos/git.png';
import logoDocker from './assets/logos/dockeur.png';
import logoThreejs from './assets/logos/threejs.png';
import logoWebgl from './assets/logos/webgl.png';
import logoVue from './assets/logos/vue.png';
import logoNuxt from './assets/logos/nuxt.png';
import logoWordpress from './assets/logos/wordpress.png';
import logoNode from './assets/logos/node.png';
import logoAirtable from './assets/logos/airtable.png';
import logoFramer from './assets/logos/framer.png';
import logoGsap from './assets/logos/gsap.png';
import logoFigma from './assets/logos/figma.png';
import logoNotion from './assets/logos/notion.png';
import logoLenis from './assets/logos/lenis.png';
import logoNetlify from './assets/logos/netlify.png';

const contactCopy = {
  fr: {
    title: "Contactez-moi 📬",
    nameLabel: "Nom",
    emailLabel: "Email",
    messageLabel: "Message",
    sendLabel: "Envoyer",
    successMessage: "Message envoyé avec succès ✅",
    errorMessage: "Une erreur est survenue ❌",
    bubble: "Écrivez-moi pour toute question ou collaboration !!"
  },
  en: {
    title: "Contact me 📬",
    nameLabel: "Name",
    emailLabel: "Email",
    messageLabel: "Message",
    sendLabel: "Send",
    successMessage: "Message sent successfully ✅",
    errorMessage: "Something went wrong ❌",
    bubble: "DM me for any questions or collaborations !!"
  }
};

const toolIcons = [
  { src: logoCursor, alt: "Cursor" },
  { src: logoHostinger, alt: "Hostinger" },
  { src: logoGolang, alt: "Golang" },
  { src: logoFirebase, alt: "Firebase" },
  { src: logoSupabase, alt: "Supabase" },
  { src: logoMysql, alt: "MySQL" },
  { src: logoMariadb, alt: "MariaDB" },
  { src: logoXamp, alt: "Xamp" },
  { src: logoGit, alt: "Git" },
  { src: logoDocker, alt: "Docker" },
  { src: logoThreejs, alt: "Three.js" },
  { src: logoWebgl, alt: "WebGL" },
  { src: logoVue, alt: "Vue" },
  { src: logoNuxt, alt: "Nuxt" },
  { src: logoWordpress, alt: "WordPress" },
  { src: logoNode, alt: "Node.js" },
  { src: logoAirtable, alt: "Airtable" },
  { src: logoFramer, alt: "Framer" },
  { src: logoGsap, alt: "GSAP" },
  { src: logoFigma, alt: "Figma" },
  { src: logoNotion, alt: "Notion" },
  { src: logoLenis, alt: "Lenis" },
  { src: logoNetlify, alt: "Netlify" },
];

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { language } = useLanguage();
  const copy = contactCopy[language];

  const formRef = useRef<HTMLFormElement>(null);
  const inputsRef = useRef<Array<HTMLDivElement | null>>([]);
  const floatingTools = useMemo(
    () =>
      toolIcons.map((tool) => {
        const driftX = (Math.random() * 360 - 180).toFixed(0);
        const driftY = (Math.random() * 320 - 160).toFixed(0);
        const size = (Math.random() * 36 + 44).toFixed(0);

        return {
          ...tool,
          driftX,
          driftY,
          size,
          top: (Math.random() * 110 - 5).toFixed(2),
          left: (Math.random() * 110 - 5).toFixed(2),
          opacity: (Math.random() * 0.25 + 0.12).toFixed(2),
          floatDuration: (Math.random() * 16 + 18).toFixed(1),
          spinDuration: (Math.random() * 10 + 8).toFixed(1),
          floatDelay: (-Math.random() * 12).toFixed(1),
          spinDelay: (-Math.random() * 8).toFixed(1),
          floatDirection: Math.random() > 0.5 ? 'alternate' : 'alternate-reverse',
          spinDirection: Math.random() > 0.5 ? 'normal' : 'reverse',
        };
      }),
    []
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out'
      });

      gsap.from(inputsRef.current, {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        delay: 0.3,
        ease: 'power2.out'
      });
    });

    return () => ctx.revert();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    emailjs.sendForm(
      'service_5kj1l8m',
      'template_8cpky3e',
      e.target as HTMLFormElement,
      'th-1Gp5GH8NBmDT5O'
    ).then(
      () => {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });;
        setTimeout(() => setStatus('idle'), 3000);
      },
      () => {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f8f3ea] via-[#f2e6d7] to-[#fdf8ef] text-[#0f0f0f] px-4 md:px-8 py-12 md:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.85),transparent_38%),radial-gradient(circle_at_82%_6%,rgba(253,230,205,0.45),transparent_46%),radial-gradient(circle_at_24%_80%,rgba(210,175,140,0.28),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {floatingTools.map((tool, index) => {
          const floatStyle = {
            top: `${tool.top}%`,
            left: `${tool.left}%`,
            width: `${tool.size}px`,
            height: `${tool.size}px`,
            opacity: tool.opacity,
            animationDuration: `${tool.floatDuration}s`,
            animationDelay: `${tool.floatDelay}s`,
            animationDirection: tool.floatDirection,
            ['--drift-x' as never]: `${tool.driftX}px`,
            ['--drift-y' as never]: `${tool.driftY}px`,
          } as React.CSSProperties;

          const spinStyle = {
            animationDuration: `${tool.spinDuration}s`,
            animationDelay: `${tool.spinDelay}s`,
            animationDirection: tool.spinDirection,
          } as React.CSSProperties;

          const roundedAlt = tool.alt.toLowerCase();
          const isExtraRounded =
            roundedAlt === 'vue' ||
            roundedAlt === 'golang' ||
            roundedAlt === 'mysql' ||
            roundedAlt === 'mariadb' ||
            roundedAlt === 'webgl';

          return (
            <div key={`${tool.alt}-${index}`} className="contact-tool" style={floatStyle}>
              <img
                src={tool.src}
                alt=""
                className={`contact-tool-spin ${isExtraRounded ? 'rounded-2xl' : 'rounded-lg'} object-contain`}
                style={spinStyle}
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <filter
          id="liquid-glass-distortion"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01"
            numOctaves="2"
            seed="2"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="10s"
              values="0.008;0.014;0.008"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <WaterCursor />
      <div className="absolute right-5 top-5 z-30 md:right-8 md:top-8">
        <LanguageToggle />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-[70vh] space-y-6">
        {/* Lottie en dehors du formulaire */}
        <div className="relative mb-2 flex flex-col items-center gap-3">
          <div className="relative flex items-center justify-center">
            <a
              href="/"
              rel="noopener noreferrer"
            >
              <dotlottie-player
                src="https://lottie.host/4a30085a-3cbc-4adf-a818-ff35868f7d53/gvgUELm6hu.lottie"
                background="transparent"
                speed="1"
                style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                loop
                autoplay
              ></dotlottie-player>
            </a>
            <p className="absolute -top-3 -right-5 max-w-[160px] text-[8px] md:text-[8px] text-[#2f2f2f] leading-snug inline-block bg-white/70 border border-[#dccfb9] px-2 py-1 rounded-full shadow-[0_8px_24px_rgba(52,34,18,0.12)] backdrop-blur-sm text-center">
            {copy.bubble}
            </p>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          ref={formRef}
          className="max-w-lg w-full liquid-glass-card rounded-2xl"
        >
          <span className="liquid-glass-layer" aria-hidden="true" />
          <div className="liquid-glass-content space-y-6 p-8">
            <h2 className="text-3xl font-bold text-black text-center">{copy.title}</h2>

            <div ref={el => (inputsRef.current[0] = el)}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">{copy.nameLabel}</label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full rounded-lg border border-white/60 bg-white/35 backdrop-blur-sm text-[#0f0f0f] placeholder:text-[#7f7566] shadow-[0_8px_20px_rgba(52,34,18,0.12)] focus:outline-none focus:ring-2 focus:ring-white/70"
                aria-required="true"
              />
            </div>

            <div ref={el => (inputsRef.current[1] = el)}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">{copy.emailLabel}</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full rounded-lg border border-white/60 bg-white/35 backdrop-blur-sm text-[#0f0f0f] placeholder:text-[#7f7566] shadow-[0_8px_20px_rgba(52,34,18,0.12)] focus:outline-none focus:ring-2 focus:ring-white/70"
                aria-required="true"
              />
            </div>

            <div ref={el => (inputsRef.current[2] = el)}>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">{copy.messageLabel}</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                required
                className="mt-1 p-2 w-full rounded-lg border border-white/60 bg-white/35 backdrop-blur-sm text-[#0f0f0f] placeholder:text-[#7f7566] shadow-[0_8px_20px_rgba(52,34,18,0.12)] focus:outline-none focus:ring-2 focus:ring-white/70"
                aria-required="true"
              />
            </div>

            <div ref={el => (inputsRef.current[3] = el)}>
              <button
                type="submit"
                className="liquid-glass-button text-[#0f0f0f] py-2 px-4 rounded-lg font-semibold tracking-[0.12em] uppercase text-xs"
              >
                {copy.sendLabel}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* POPUP animé */}
      <AnimatePresence>
        {status !== 'idle' && (
          <>
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="absolute top-1/2 left-1/2 z-30 bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm text-center"
              initial={{ scale: 0.5, opacity: 0, y: '-50%', x: '-50%' }}
              animate={{ scale: 1, opacity: 1, y: '-50%', x: '-50%' }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <p className={`text-lg font-semibold ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {status === 'success' ? copy.successMessage : copy.errorMessage}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;
