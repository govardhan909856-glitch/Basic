import { useRef, MouseEvent } from 'react';
import { Monitor, Keyboard, FileSpreadsheet, FolderTree, Globe, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { CAPABILITIES } from '../data';
import { Capability } from '../types';

interface CapabilitiesSectionProps {
  onOpenProjectWithCategory?: (category: string) => void;
}

const ICONS = [Monitor, Keyboard, FileSpreadsheet, FolderTree, Globe, ShieldCheck];

export default function CapabilitiesSection({ onOpenProjectWithCategory }: CapabilitiesSectionProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Interactive spotlight following mouse within each card
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  };

  // Cyberpunk text scramble effect on hover
  const handleMouseEnter = (e: MouseEvent<HTMLHeadingElement>, originalText: string) => {
    const target = e.currentTarget;
    const chars = '!<>-_\\/[]{}—=+*^?#@$%';
    let iteration = 0;
    const timer = setInterval(() => {
      target.innerText = originalText
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      iteration += 0.8;
      if (iteration >= originalText.length) {
        clearInterval(timer);
        target.innerText = originalText;
      }
    }, 25);
  };

  return (
    <section id="capabilities" className="relative z-10 py-24 sm:py-32 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 text-xs font-semibold tracking-widest uppercase text-primary mb-3 font-mono">
            <span className="w-6 h-px bg-primary shadow-sm" />
            <span>Website Mission // Daily Life Computer Confidence</span>
          </div>
          <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
            Essential Computer Skills for Everyday Life
          </h2>
          <p className="text-muted-foreground max-w-3xl text-sm sm:text-base leading-relaxed">
            The core purpose of this platform is to provide beginner-friendly, real-world digital confidence. Rather than getting bogged down in abstract theory, these five core pillars focus on the practical computer tasks you encounter every single day—at college, in the office, and at home.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {CAPABILITIES.map((cap: Capability, index: number) => {
            const IconComponent = ICONS[index % ICONS.length];
            return (
              <div
                key={cap.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                className="group relative rounded-xl p-7 sm:p-9 bg-card/90 backdrop-blur-xl hover:bg-accent/40 border border-border hover:border-primary transition-all duration-300 floating-option interactive-option shadow-sm overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                {/* Radial Mouse Spotlight Overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                  style={{
                    background:
                      'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklch, var(--primary) 8%, transparent), transparent 60%)',
                  }}
                />

                <div>
                  {/* Top Bar: Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold tracking-widest text-primary/80">
                      {cap.number}
                    </span>
                    <div className="p-2.5 rounded-xl bg-background text-primary border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title with scramble effect */}
                  <h3
                    onMouseEnter={(e) => handleMouseEnter(e, cap.title)}
                    className="font-sans text-xl sm:text-2xl font-bold text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors duration-200 cursor-default"
                  >
                    {cap.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                    {cap.description}
                  </p>
                </div>

                {/* Tech Tags / Options */}
                <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {cap.tags.map((tag) => (
                      <span
                        key={tag}
                        className="interactive-option text-[11px] font-mono tracking-wider text-muted-foreground px-2.5 py-1 rounded-md bg-muted/60 backdrop-blur-md border border-border hover:border-primary hover:text-foreground transition-all cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
