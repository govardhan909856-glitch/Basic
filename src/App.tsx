import { useState, useEffect, useRef, useCallback } from 'react';
import VoidCanvas from './components/VoidCanvas';
import CursorTrail from './components/CursorTrail';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import CapabilitiesSection from './components/CapabilitiesSection';
import WorkSection from './components/WorkSection';
import ProcessSection from './components/ProcessSection';
import MotivationSection from './components/MotivationSection';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';
import ScrollGenerativeController from './components/ScrollGenerativeController';
import { Project } from './types';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [activeFormationId, setActiveFormationId] = useState(0);
  const [manualFormationId, setManualFormationId] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(performance.now());

  // Track scroll progress and velocity smoothly
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      setScrollProgress(Math.max(0, Math.min(1, progress)));

      const now = performance.now();
      const dt = Math.max(1, now - lastScrollTime.current);
      const dy = scrollY - lastScrollY.current;
      const vel = (dy / dt) * 16.6; // normalized velocity
      setScrollVelocity(vel);

      lastScrollY.current = scrollY;
      lastScrollTime.current = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleActiveFormationChange = useCallback((id: number) => {
    setActiveFormationId(id);
  }, []);

  const scrollToWork = () => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#060606] text-[#f0f0f0] selection:bg-[#c8ff00] selection:text-black">
      {/* ── Background WebGL Three.js Particle System ── */}
      <VoidCanvas
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
        manualFormationId={manualFormationId}
        onActiveFormationChange={handleActiveFormationChange}
      />

      {/* ── Interactive Cursor Particle Follower Trail ── */}
      <CursorTrail />

      {/* ── Cinematic Grain Overlay ── */}
      <div className="grain-overlay" />

      {/* ── Scroll-Driven Generative Materialize Controller ── */}
      <ScrollGenerativeController />

      {/* ── Top Navigation ── */}
      <Navbar
        scrollProgress={scrollProgress}
        onOpenContact={scrollToContact}
      />

      {/* ── Main Flow ── */}
      <main className="relative z-10">
        <Hero
          onOpenContact={scrollToContact}
          onScrollToWork={scrollToWork}
        />

        <Manifesto />

        <CapabilitiesSection />

        <WorkSection onSelectProject={(p) => setSelectedProject(p)} />

        <ProcessSection />

        <MotivationSection />

        <CtaSection />
      </main>

      {/* ── Studio Footer ── */}
      <Footer />

      {/* ── Modals ── */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
