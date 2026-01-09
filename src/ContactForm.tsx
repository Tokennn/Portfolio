import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const formRef = useRef<HTMLFormElement>(null);
  const inputsRef = useRef<Array<HTMLDivElement | null>>([]);

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
            DM me for any questions or collaborations !!
            </p>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          ref={formRef}
          className="max-w-lg w-full bg-[#f8f3ea] border border-[#dccfb9] shadow-[0_18px_60px_rgba(52,34,18,0.16)] backdrop-blur-sm p-8 rounded-xl space-y-6"
        >
          <h2 className="text-3xl font-bold text-black text-center">Contacte-moi 📬</h2>

          <div ref={el => (inputsRef.current[0] = el)}>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full rounded-lg border border-[#dccfb9] bg-[#f8f3ea] text-[#0f0f0f] placeholder:text-[#8c8170]"
              aria-required="true"
            />
          </div>

          <div ref={el => (inputsRef.current[1] = el)}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full rounded-lg border border-[#dccfb9] bg-[#f8f3ea] text-[#0f0f0f] placeholder:text-[#8c8170]"
              aria-required="true"
            />
          </div>

          <div ref={el => (inputsRef.current[2] = el)}>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              required
              className="mt-1 p-2 w-full rounded-lg border border-[#dccfb9] bg-[#f8f3ea] text-[#0f0f0f] placeholder:text-[#8c8170]"
              aria-required="true"
            />
          </div>

          <div ref={el => (inputsRef.current[3] = el)}>
            <button
              type="submit"
              className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
            >
              Envoyer
            </button>
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
                {status === 'success' ? 'Message envoyé avec succès ✅' : 'Une erreur est survenue ❌'}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;
