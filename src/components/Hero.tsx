import { useRef, MouseEvent, RefObject } from 'react';
import { Sparkles } from 'lucide-react';
import ComputerKnowledgeSearch from './ComputerKnowledgeSearch';

interface HeroProps {
  onOpenContact: () => void;
  onScrollToWork?: () => void;
}

export default function Hero({ onOpenContact }: HeroProps) {
  const ghostBtnRef = useRef<HTMLButtonElement>(null);

  const handleMagneticMove = (e: MouseEvent<HTMLButtonElement>, ref: RefObject<HTMLButtonElement | null>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  };

  const handleMagneticLeave = (ref: RefObject<HTMLButtonElement | null>) => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0px, 0px)';
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 z-10 pt-20 pb-16 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Hero Title */}
        <h1
          id="heroTitle"
          className="font-display text-[clamp(2.75rem,10.5vw,9rem)] font-extrabold tracking-[0.03em] sm:tracking-[0.05em] leading-[0.98] text-neutral-100 select-none drop-shadow-[0_0_80px_rgba(200,255,0,0.2)] whitespace-nowrap flex items-center justify-center"
        >
          <span className="inline-flex items-center whitespace-nowrap">
            {['B', 'A', 'S', 'I', 'C', 'S'].map((char, index) => (
              <span
                key={index}
                className="inline-block transition-transform duration-300 hover:scale-105 hover:text-[#c8ff00] cursor-default"
                style={{
                  textShadow: '0 0 50px rgba(200, 255, 0, 0.18)',
                }}
              >
                {char}
              </span>
            ))}
            <span className="text-[#c8ff00] drop-shadow-[0_0_20px_#c8ff00] transition-transform duration-300 hover:scale-125 inline-block ml-0.5">
              .
            </span>
          </span>
        </h1>

        {/* Detailed Introductory Subtitle */}
        <p
          id="heroSub"
          className="mt-6 sm:mt-8 max-w-3xl text-sm sm:text-base md:text-lg font-normal text-neutral-300 leading-relaxed drop-shadow-[0_2px_16px_rgba(6,6,6,1)] px-4 sm:px-6"
        >
          This website is specially designed to help beginners master essential computer skills from scratch. Whether you are starting your college classes, preparing for future career opportunities and competitive exams, or just looking to build digital confidence, you are in the right place. We focus on practical, everyday knowledge that takes the fear out of technology. Start your learning journey today and transform from a hesitant user into a confident digital expert.
        </p>

        {/* ── Main Question Input Box (Direct & Clean) ── */}
        <div className="mt-8 sm:mt-10 w-full max-w-xl px-2 z-20">
          <ComputerKnowledgeSearch variant="hero" />
        </div>

        {/* Clean Spacious Visual Gap */}
        <div className="h-6 sm:h-8 w-full pointer-events-none" aria-hidden="true" />

        {/* Hero CTAs */}
        <div id="heroActions" className="mt-10 sm:mt-12 flex items-center justify-center gap-4 w-full sm:w-auto">
          {/* Direct Contact button */}
          <button
            ref={ghostBtnRef}
            id="heroBtnContact"
            onClick={onOpenContact}
            onMouseMove={(e) => handleMagneticMove(e, ghostBtnRef)}
            onMouseLeave={() => handleMagneticLeave(ghostBtnRef)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-display text-xs sm:text-sm font-semibold tracking-wide px-8 py-3.5 rounded-full text-neutral-200 bg-[#060606]/60 backdrop-blur-md border border-white/20 hover:border-[#c8ff00] hover:text-[#c8ff00] transition-all duration-300 hover:bg-[#060606]/80 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c8ff00]" />
            <span>Contact / संपर्क करें</span>
          </button>
        </div>

        {/* Subtle scroll cue */}
        <div className="mt-16 sm:mt-20 flex flex-col items-center gap-2 text-neutral-500 text-[10px] tracking-[0.25em] uppercase animate-bounce">
          <span>Scroll to explore</span>
          <span className="w-px h-6 bg-gradient-to-b from-[#c8ff00]/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
