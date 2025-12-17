import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import gsap from 'gsap';
import blurBackground from './blur.mp4';
import { Link } from 'react-router-dom';
// import { HeroScrollDemo } from './components/ui/demo';

function App() {
  const [entered, setEntered] = useState(false);
  const loadingRef = useRef(null);
  const [loadingPercent, setLoadingPercent] = useState(0);

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!entered) {
      gsap.to(loadingRef.current, {
        opacity: 0.2,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      
  
    
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 100,
        duration: 5,
        ease: "power1.inOut",
        onUpdate: () => {
          setLoadingPercent(Math.floor(obj.val));
        }
      });
    }
  }, [entered]);

  useEffect(() => {
    if (!entered && loadingRef.current) {
      gsap.to(loadingRef.current, {
        opacity: 0.2,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }
  }, [entered]);

useEffect(() => {
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    setScrollProgress(progress);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);

}, []);



  if (!entered) {
    const canEnter = loadingPercent >= 100;

    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.4)' }}
        >
          <source src={blurBackground} type="video/mp4" />
        </video>

        <div className="absolute top-6 left-8">
          <span className="text-xs font-medium text-white block hover:shadow-glow transition-all duration-300">
            Quentin
          </span>
          <span className="text-xs font-medium text-white block hover:shadow-glow transition-all duration-300">
            Ctr
          </span>
        </div>
        <button
          disabled={!canEnter}
          onClick={() => {
            if (!canEnter) return;
            gsap.to(".enter-button", {
              scale: 0.8,
              opacity: 0,
              duration: 1,
              ease: "power2.out",
              onComplete: () => {
                setEntered(true); 
                gsap.from(".main-content", {
                  opacity: 0,
                  y: 100,
                  duration: 1,
                  ease: "power2.out"
                });
              }
            });
          }}
          className={`enter-button group relative w-48 h-48 transition opacity-100 ${canEnter ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
        >
          <div className="absolute inset-0 border border-white/20 rounded-full transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 border border-white/20 rounded-full transition-transform duration-700 group-hover:scale-125" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/80 text-lg tracking-widest font-light transition-all duration-500 group-hover:text-white group-hover:scale-110">
              ENTER
            </span>
          </div>
        </button>
        <div className="absolute bottom-6 right-6 text-white/80 text-sm font-medium flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-white/60">Loading</span>
            <span className="text-sm">{loadingPercent}%</span>
          </div>
          <div className="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/80"
              style={{ width: `${loadingPercent}%`, transition: "width 0.3s ease-out" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-white">
      <BackgroundOrbs />
      {/* Contenu principal */}
      <div className="relative z-10">
        {/* Nav centrée minimaliste */}
        <nav id="home-nav" className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="nav-group flex items-center space-x-12 text-2xl font-black uppercase tracking-[0.28em] pointer-events-auto">
            <Link to="/work" className="nav-link text-white/90">Work</Link>
            <a href="#about" className="nav-link text-white/90">About</a>
            <Link to="/contact" className="nav-link text-white/90">Contact</Link>
          </div>
        </nav>

        {/* Scroll Progress Bar */}
        {/* <div className="fixed bottom-6 right-6 w-24 h-1 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div> */}

        {/* Hero Section */}
        {/* <section className="pt-32 pb-8 px-4">
          <HeroScrollDemo />
        </section> */}

        {/* <section id="work" className="py-8 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <a 
                href={project.link}
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-xl"
              >
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="flex items-center">
                    <ArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all" />
                  </p>  
                </div>
              </a>
            ))}
          </div>
        </section> */}

        {/* About Section */}
        {/* <section id="about" className="py-16 px-4">
          <div className="max-w-4xl ml-0 md:ml-12 bg-[#0a0a0a] text-white rounded-2xl p-8 shadow-2xl border border-white/5">
            <h2 className="text-4xl font-bold mb-8">About Me</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="text-lg font-bold mb-6">
                  Je suis un développeur créatif passionné par la création d'expériences numériques uniques et mémorables. 
                  Mon approche combine design innovant et développement technique pour donner vie à des projets ambitieux.
                </p>
                <p className="text-lg font-bold">
                  Avec une expertise en design et en développement web, je m'efforce de créer des solutions qui non seulement 
                  répondent aux besoins fonctionnels mais apportent aussi une réelle valeur ajoutée esthétique.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Expertise</h3>
                <ul className="space-y-2 font-bold">
                  <li>Web Design</li>
                  <li>Front-end Development</li>
                  <li>UI/UX Design</li>
                  <li>Creative Development</li>
                </ul>
              </div>
            </div>
          </div>
        </section> */}

        {/* Contact Section */}
        {/* <section id="contact" className="py-16 px-4">
          <div className="max-w-4xl ml-0 md:ml-12 bg-[#0a0a0a] text-white rounded-2xl p-8 shadow-2xl border border-white/5">
            <h2 className="text-4xl font-bold mb-8">Let's Work Together</h2>
            <div className="flex flex-col md:flex-row items-start space-y-8 md:space-y-0 md:space-x-12">
              <div className="flex-1">
                <p className="text-lg font-bold mb-8">
                  Intéressé par une collaboration ? N'hésitez pas à me contacter pour discuter de votre projet.
                </p>
                <div className="flex space-x-6">
                  <div className="flex flex-col items-center">
                    <a 
                      href="https://github.com/Tokennn" 
                      className="text-white hover:text-gray-200" 
                      title="Ca c'est mon GitHub yep !"
                    >
                      <Github size={24} />
                    </a>
                    <span className="text-sm text-white mt-1">GitHub</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <a 
                      href="https://www.linkedin.com/in/quentin-c-752996294/" 
                      className="text-white hover:text-gray-200" 
                      title="Go LinkedIn !"
                    >
                      <Linkedin size={24} />
                    </a>
                    <span className="text-sm text-white mt-1">LinkedIn</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <Link 
                      to="/contact" 
                      className="text-white hover:text-gray-200" 
                      title="Aller c'est partis pour le formulaire !"
                    >
                      <Mail size={24} />
                    </Link>
                    <span className="text-sm text-white mt-1">Email</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </div>
    </div>
  );
}

export default App;

function BackgroundOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      >
        <source src={blurBackground} type="video/mp4" />
      </video>
      <div className="absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.25),rgba(56,189,248,0))] blur-3xl animate-[orbFloat_18s_ease-in-out_infinite_alternate]" />
      <div className="absolute right-[-120px] top-1/4 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_70%_40%,rgba(168,85,247,0.4),rgba(88,28,135,0))] blur-[110px] animate-[orbDrift_22s_ease-in-out_infinite_alternate]" />
      <div className="absolute left-1/3 bottom-[-160px] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,115,29,0.35),rgba(255,115,29,0))] blur-[120px] opacity-80 animate-[orbFloat_26s_ease-in-out_infinite_alternate-reverse]" />
    </div>
  );
}
