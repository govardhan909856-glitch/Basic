import { useState, useEffect } from 'react';
import { ArrowRight, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  scrollProgress: number;
  onOpenContact: () => void;
  onOpenSearch?: () => void;
}

export default function Navbar({ scrollProgress, onOpenContact, onOpenSearch }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearch?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  const navLinks = [
    { label: 'Overview', href: '#hero' },
    { label: 'Pillars', href: '#capabilities' },
    { label: 'Practical Modules', href: '#work' },
    { label: 'Learning Path', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ── Scroll Progress Line ────────────────── */}
      <div
        id="scrollProgress"
        className="fixed top-0 left-0 z-[999] h-[2px] bg-[#c8ff00] shadow-[0_0_12px_#c8ff00] transition-transform duration-75 ease-out origin-left pointer-events-none"
        style={{
          width: '100%',
          transform: `scaleX(${Math.max(0, Math.min(1, scrollProgress))})`,
        }}
      />

      {/* ── Navigation Bar ──────────────────────── */}
      <header
        id="nav"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 py-4 px-5 md:px-10 flex items-center justify-between ${
          isScrolled
            ? 'bg-[#060606]/85 backdrop-blur-2xl border-b border-white/[0.1] shadow-[0_4px_30px_rgba(0,0,0,0.7)] py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        {/* Logo & Floating Creator Pill */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            id="navLogo"
            className="font-display font-extrabold text-xl tracking-[0.16em] text-neutral-100 whitespace-nowrap inline-flex items-center group"
          >
            <span>BASICS</span>
            <span className="text-[#c8ff00] drop-shadow-[0_0_8px_#c8ff00] transition-transform duration-300 group-hover:scale-125 inline-block">
              .
            </span>
          </a>

          {/* Floating Creator Badge */}
          <div className="hidden sm:inline-flex floating-creator-name px-3 py-1 rounded-full bg-black/60 border border-[#c8ff00]/40 shadow-[0_0_15px_rgba(200,255,0,0.2)] backdrop-blur-md items-center gap-2 text-[11px] font-mono text-neutral-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-ping" />
            <span>By <strong className="text-[#c8ff00] font-semibold">Govardhan Yadav</strong></span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav id="navLinks" className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="text-xs tracking-[0.08em] uppercase text-neutral-400 hover:text-white transition-colors duration-200 relative py-1 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#c8ff00] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Desktop CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            id="navCta"
            onClick={onOpenContact}
            className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#c8ff00] border border-[#c8ff00]/40 hover:border-[#c8ff00] bg-black/60 backdrop-blur-md hover:bg-[#c8ff00]/20 px-4 py-2 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(200,255,0,0.3)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Contact & Help</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          {/* Mobile menu hamburger toggle */}
          <button
            id="navToggle"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-neutral-200 hover:text-[#c8ff00] transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* ── Mobile Fullscreen Menu ─────────────── */}
      {mobileMenuOpen && (
        <div
          id="mobileMenu"
          className="fixed inset-0 z-40 bg-[#060606]/95 backdrop-blur-2xl flex flex-col justify-center items-center gap-8 md:hidden animate-in fade-in duration-300 px-6 text-center"
        >
          <div className="flex items-center gap-2 mb-4 text-[#c8ff00] text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Learn Computer Basics the Easy Way</span>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="font-display text-2xl font-bold text-neutral-100 hover:text-[#c8ff00] transition-colors tracking-wide"
            >
              {link.label}
            </a>
          ))}

          <div className="flex flex-col gap-3 mt-4 w-full max-w-xs">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="flex items-center justify-center gap-2 font-display text-sm font-semibold tracking-wider text-black bg-[#c8ff00] px-8 py-3 rounded-full shadow-[0_0_25px_rgba(200,255,0,0.3)] hover:scale-105 transition-transform"
            >
              <span>Contact & Help</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
