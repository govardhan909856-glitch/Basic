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
          className="font-sans text-[clamp(2.75rem,10.5vw,8.5rem)] font-extrabold tracking-tight leading-[0.98] text-foreground select-none whitespace-nowrap flex items-center justify-center"
        >
          <span className="inline-flex items-center whitespace-nowrap">
            {['B', 'A', 'S', 'I', 'C', 'S'].map((char, index) => (
              <span
                key={index}
                className="inline-block transition-transform duration-300 hover:scale-105 hover:text-primary cursor-default"
              >
                {char}
              </span>
            ))}
            <span className="text-primary transition-transform duration-300 hover:scale-125 inline-block ml-0.5">
              .
            </span>
          </span>
        </h1>

        {/* Detailed Introductory Subtitle */}
        <p
          id="heroSub"
          className="mt-6 sm:mt-8 max-w-3xl text-sm sm:text-base md:text-lg font-normal text-muted-foreground leading-relaxed px-4 sm:px-6"
        >
          This website is specially designed to help beginners master essential computer skills from scratch. Whether you are starting your college classes, preparing for future career opportunities and competitive exams, or just looking to build digital confidence, you are in the right place. We focus on practical, everyday knowledge that takes the fear out of technology. Start your learning journey today and transform from a hesitant user into a confident digital expert.
        </p>

        {/* ── Main Question Input Box (Direct & Clean) ── */}
        <div className="mt-8 sm:mt-10 w-full max-w-2xl px-2 z-20">
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-sans text-xs sm:text-sm font-semibold tracking-wide px-8 py-3.5 rounded-full text-foreground bg-card/80 backdrop-blur-md border border-border hover:border-primary hover:text-primary transition-all duration-300 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Contact / संपर्क करें</span>
          </button>
        </div>

        {/* Subtle scroll cue */}
        <div className="mt-16 sm:mt-20 flex flex-col items-center gap-2 text-muted-foreground text-[10px] tracking-[0.25em] uppercase animate-bounce font-mono">
          <span>Scroll to explore</span>
          <span className="w-px h-6 bg-gradient-to-b from-primary/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
