import { useState, useEffect } from 'react';
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
import { Project } from './types';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('basics-theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return false; // Default: White (Light mode)
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('basics-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('basics-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWork = () => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans transition-colors duration-300">
      {/* ── Subtle Ambient Backdrop ── */}
      <div className="grain-overlay" />

      {/* ── Top Navigation ── */}
      <Navbar
        onOpenContact={scrollToContact}
        isDark={isDark}
        onToggleTheme={toggleTheme}
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
