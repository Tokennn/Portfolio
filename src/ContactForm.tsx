import React, { useState, ChangeEvent, FormEvent } from 'react';
import emailjs from '@emailjs/browser';

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
        console.log('Message envoyé !');
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      },
      () => {
        console.error('Erreur lors de l\'envoi');
        setStatus('error');
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="max-w-lg w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
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
        {status === 'success' && <p className="text-green-600">Message envoyé avec succès ✅</p>}
        {status === 'error' && <p className="text-red-600">Une erreur est survenue ❌</p>}
      </form>
    </div>
  );
};

export default ContactForm;