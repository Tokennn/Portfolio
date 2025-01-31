import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Github, Linkedin, Mail } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!entered) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
        <button
          onClick={() => setEntered(true)}
          className="group relative w-48 h-48"
        >
          <div className="absolute inset-0 border border-white/20 rounded-full transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 border border-white/20 rounded-full transition-transform duration-700 group-hover:scale-125" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/80 text-lg tracking-widest font-light transition-all duration-500 group-hover:text-white group-hover:scale-110">
              ENTER
            </span>
          </div>
        </button>
      </div>
    );
  }

  const projects = [
    {
      title: "Project One",
      description: "Design & Development",
      image: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&q=80&w=1000",
      link: "https://github.com/Tokennn/hangman-web"
    },
    {
      title: "Project Two",
      description: "UI/UX Design",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
      link: "https://github.com/Tokennn/Pokemon.WPF"
    },
    {
      title: "Project Three",
      description: "Web Development",
      image: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&q=80&w=1000",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-2xl font-bold">Quentin.C.</span>
            <div className="hidden md:flex space-x-8">
              <a href="#work" className="text-gray-800 hover:text-gray-600">Work</a>
              <a href="#about" className="text-gray-800 hover:text-gray-600">About</a>
              <a href="#contact" className="text-gray-800 hover:text-gray-600">Contact</a>
            </div>
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/90 backdrop-blur-sm pt-16">
          <div className="flex flex-col items-center space-y-8 pt-8">
            <a href="#work" className="text-2xl" onClick={() => setIsMenuOpen(false)}>Work</a>
            <a href="#about" className="text-2xl" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#contact" className="text-2xl" onClick={() => setIsMenuOpen(false)}>Contact</a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-8">Creative Developer & Designer</h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl">
            Crafting digital experiences that combine beautiful design with powerful functionality.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section id="work" className="py-16 px-4">
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
                  {project.description}
                  <ArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all" />
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">About Me</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-lg text-gray-600 mb-6">
                Je suis un développeur créatif passionné par la création d'expériences numériques uniques et mémorables. 
                Mon approche combine design innovant et développement technique pour donner vie à des projets ambitieux.
              </p>
              <p className="text-lg text-gray-600">
                Avec une expertise en design et en développement web, je m'efforce de créer des solutions qui non seulement 
                répondent aux besoins fonctionnels mais apportent aussi une réelle valeur ajoutée esthétique.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Expertise</h3>
              <ul className="space-y-2">
                <li>Web Design</li>
                <li>Front-end Development</li>
                <li>UI/UX Design</li>
                <li>Creative Development</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Let's Work Together</h2>
          <div className="flex flex-col md:flex-row items-start space-y-8 md:space-y-0 md:space-x-12">
            <div className="flex-1">
              <p className="text-lg text-gray-600 mb-8">
                Intéressé par une collaboration ? N'hésitez pas à me contacter pour discuter de votre projet.
              </p>
              <div className="flex space-x-6">
                <a href="https://github.com/Tokennn" className="text-gray-600 hover:text-gray-900">
                  <Github size={24} />
                </a>
                <a href="https://www.linkedin.com/in/quentin-c-752996294/" className="text-gray-600 hover:text-gray-900">
                  <Linkedin size={24} />
                </a>
                <a href="mailto:quentin.contreau@ynov.com" className="text-gray-600 hover:text-gray-900">
                  <Mail size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;