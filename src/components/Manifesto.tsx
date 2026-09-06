import { useEffect, useRef, useState } from 'react';

const MANIFESTO_WORDS = [
  "Computers", "should", "not", "feel", "intimidating", "—",
  "they", "are", "creative", "tools", "made", "for", "everyone.",
  "From", "opening", "your", "first", "file", "to", "mastering",
  "lightning-fast", "keyboard", "shortcuts,", "creating", "clean",
  "documents", "in", "MS", "Office,", "and", "staying", "secure",
  "online.", "True", "digital", "confidence", "begins", "with",
  "the", "basics.", "Every", "click", "counts."
];

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const [illuminatedFraction, setIlluminatedFraction] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start illuminating when top is at 75% of viewport, finish when bottom is at 30%
      const start = windowHeight * 0.75;
      const end = windowHeight * 0.25;
      const progress = (start - rect.top) / (start - end + rect.height * 0.5);
      const clamped = Math.max(0, Math.min(1, progress));
      setIlluminatedFraction(clamped);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const illuminatedCount = Math.floor(illuminatedFraction * MANIFESTO_WORDS.length);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative min-h-screen flex items-center justify-center py-24 sm:py-32 px-5 sm:px-8 z-10"
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Section eyebrow */}
        <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#c8ff00] mb-8">
          <span className="w-6 h-px bg-[#c8ff00] shadow-[0_0_8px_#c8ff00]" />
          <span>Basics Ethos // Learn Computer Basics the Easy Way</span>
        </div>

        {/* Cinematic Manifesto Text */}
        <p
          id="manifestoText"
          className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-medium leading-[1.38] tracking-tight select-none"
        >
          {MANIFESTO_WORDS.map((word, index) => {
            const isIlluminated = index <= illuminatedCount;
            const isCurrent = index === illuminatedCount;
            const isEmphasized = ['everyone.', 'shortcuts,', 'Office,', 'secure', 'basics.', 'counts.'].includes(word);

            return (
              <span
                key={index}
                className={`inline-block mr-2 sm:mr-3.5 mb-2 transition-all duration-300 ${
                  isIlluminated
                    ? isEmphasized
                      ? 'text-[#c8ff00] drop-shadow-[0_0_20px_rgba(200,255,0,0.35)] font-semibold'
                      : 'text-neutral-100'
                    : 'text-neutral-600/40'
                } ${isCurrent ? 'scale-105' : 'scale-100'} hover:text-[#c8ff00] hover:scale-110 cursor-default`}
              >
                {word}
              </span>
            );
          })}
        </p>

        {/* Studio signature details */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-6 text-xs text-neutral-500 font-mono">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#c8ff00] animate-ping" />
            <span>BASICS LEARNING // 90% PRACTICAL &bull; 10% HARDWARE INTRO</span>
          </div>
          <div className="tracking-widest uppercase">
            <span>WINDOWS 11 &bull; SHORTCUTS &bull; MS OFFICE &bull; CYBER SAFETY</span>
          </div>
        </div>
      </div>
    </section>
  );
}
