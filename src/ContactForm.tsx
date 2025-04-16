import React, { useState, ChangeEvent, FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    emailjs.sendForm(
      'Portfolio',
      'template_8cpky3e',
      e.target as HTMLFormElement,
      'th-1Gp5GH8NBmDT5O'
    ).then(
      () => {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
      },
      () => {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <form onSubmit={handleSubmit} className="max-w-lg w-full bg-white p-8 rounded-xl shadow-lg space-y-6 z-10">
        <h2 className="text-3xl font-bold">Contacte-moi 📬</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
        >
          Envoyer
        </button>
      </form>

      {/* POPUP animé */}
      <AnimatePresence>
        {status !== 'idle' && (
          <>
            {/* Fond semi-transparent */}
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            {/* Boîte centrale */}
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