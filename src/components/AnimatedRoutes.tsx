import { type ReactNode, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import App from '../App';
import ContactForm from '../ContactForm';
import Work from '../Work';
import About from '../About';
import LenisRoot from './LenisRoot';

function PageShell({
  children,
  shouldReveal
}: {
  children: ReactNode;
  shouldReveal: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const revealEnabled = shouldReveal && !reduceMotion;

  return (
    <motion.div
      className="page-shell"
      data-reveal={revealEnabled ? 'on' : 'off'}
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 22
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.85,
          ease: [0.16, 1, 0.3, 1]
        }
      }}
      exit={
        reduceMotion
          ? { opacity: 1 }
          : {
              opacity: 0,
              y: -14,
              transition: {
                duration: 0.35,
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
  const visitedRoutes = useRef(new Set<string>());
  const isFirstVisit = !visitedRoutes.current.has(location.pathname);

  useEffect(() => {
    visitedRoutes.current.add(location.pathname);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <LenisRoot />
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageShell shouldReveal={isFirstVisit}>
              <App />
            </PageShell>
          }
        />
        <Route
          path="/contact"
          element={
            <PageShell shouldReveal={isFirstVisit}>
              <ContactForm />
            </PageShell>
          }
        />
        <Route
          path="/work"
          element={
            <PageShell shouldReveal={isFirstVisit}>
              <Work />
            </PageShell>
          }
        />
        <Route
          path="/about"
          element={
            <PageShell shouldReveal={isFirstVisit}>
              <About />
            </PageShell>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
