import { useState, useEffect } from 'react';
import { ArrowRight, Menu, X, Sparkles, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  scrollProgress: number;
  onOpenContact: () => void;
  onOpenSearch?: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export default function Navbar({
  scrollProgress,
  onOpenContact,
  onOpenSearch,
  isDark = true,
  onToggleTheme,
}: NavbarProps) {
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
        className="fixed top-0 left-0 z-[999] h-[2px] bg-primary shadow-sm transition-transform duration-75 ease-out origin-left pointer-events-none"
        style={{
          width: '100%',
          transform: `scaleX(${Math.max(0, Math.min(1, scrollProgress))})`,
        }}
      />

      {/* ── Navigation Bar ──────────────────────── */}
      <header
        id="nav"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-5 md:px-10 flex items-center justify-between ${
          isScrolled
            ? 'bg-background/85 backdrop-blur-xl border-b border-border shadow-sm py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            id="navLogo"
            className="font-sans font-extrabold text-xl tracking-wider text-foreground whitespace-nowrap inline-flex items-center group"
          >
            <span>BASICS</span>
            <span className="text-primary transition-transform duration-300 group-hover:scale-125 inline-block">
              .
            </span>
          </a>
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
              className="text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors duration-200 relative py-1 group font-mono"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Desktop CTA, Theme Switcher & Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Light / Dark Mode Switcher */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              id="themeToggleBtn"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-full border border-border bg-card/80 hover:bg-accent text-foreground transition-all duration-200 cursor-pointer shadow-sm hover:scale-105"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          <button
            id="navCta"
            onClick={onOpenContact}
            className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-primary-foreground bg-primary hover:opacity-90 px-4 py-2 rounded-full transition-all duration-300 shadow-sm cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Contact & Help</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          {/* Mobile menu hamburger toggle */}
          <button
            id="navToggle"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full bg-card border border-border text-foreground hover:text-primary transition-colors focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ── Mobile Fullscreen Menu ─────────────── */}
      {mobileMenuOpen && (
        <div
          id="mobileMenu"
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl flex flex-col justify-center items-center gap-7 md:hidden animate-in fade-in duration-300 px-6 text-center"
        >
          <div className="flex items-center gap-2 mb-2 text-muted-foreground text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-4 h-4 text-primary" />
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
              className="font-sans text-2xl font-bold text-foreground hover:text-primary transition-colors tracking-wide"
            >
              {link.label}
            </a>
          ))}

          <div className="flex flex-col items-center gap-3 mt-4 w-full max-w-xs">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="w-full flex items-center justify-center gap-2 text-xs font-mono py-2.5 rounded-full border border-border bg-card text-foreground"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full flex items-center justify-center gap-2 font-sans text-sm font-semibold tracking-wider text-primary-foreground bg-primary px-8 py-3 rounded-full shadow-sm hover:scale-105 transition-transform cursor-pointer"
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
