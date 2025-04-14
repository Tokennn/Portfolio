import React, { useState, ChangeEvent, FormEvent } from 'react';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(form); 
    alert("Message envoyé !");
    setForm({ name: '', email: '', message: '' });
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
      </form>
    </div>
  );
};

export default ContactForm;