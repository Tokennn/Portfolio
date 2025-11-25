import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import ContactForm from './ContactForm';
import Work from './Work';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/work" element={<Work />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
