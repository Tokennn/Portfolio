import { type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import App from '../App';
import ContactForm from '../ContactForm';
import Work from '../Work';
import About from '../About';

function PageShell({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="page-shell"
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 28,
              filter: 'blur(8px)'
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
          duration: 1.15,
          ease: [0.16, 1, 0.3, 1]
        }
      }}
      exit={
        reduceMotion
          ? { opacity: 1 }
          : {
              opacity: 0,
              y: -16,
              filter: 'blur(6px)',
              transition: {
                duration: 0.45,
                ease: [0.4, 0, 0.2, 1]
              }
            }
      }
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageShell>
              <App />
            </PageShell>
          }
        />
        <Route
          path="/contact"
          element={
            <PageShell>
              <ContactForm />
            </PageShell>
          }
        />
        <Route
          path="/work"
          element={
            <PageShell>
              <Work />
            </PageShell>
          }
        />
        <Route
          path="/about"
          element={
            <PageShell>
              <About />
            </PageShell>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
