import { PROCESS_STEPS } from '../data';
import { ProcessStep } from '../types';

export default function ProcessSection() {
  return (
    <section id="process" className="relative z-10 py-24 sm:py-32 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 text-xs font-semibold tracking-widest uppercase text-primary mb-3 font-mono">
            <span className="w-6 h-px bg-primary shadow-sm" />
            <span>Step-by-Step Path // Learn Computer Basics the Easy Way</span>
          </div>
          <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            4-Step Computer Basics Learning Path
          </h2>
        </div>

        {/* 4-Step Process Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {PROCESS_STEPS.map((step: ProcessStep) => (
            <div
              key={step.number}
              className="group relative p-6 sm:p-7 rounded-2xl bg-card/90 backdrop-blur-2xl border-l-2 border-l-primary/40 hover:border-l-primary border-y border-r border-border shadow-sm transition-all duration-300 hover:bg-accent/40 floating-option interactive-option cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Step Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-4xl sm:text-5xl font-extrabold text-primary/40 group-hover:text-primary transition-colors duration-300 tracking-tighter">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-primary px-2.5 py-1 rounded-full bg-muted border border-border">
                    {step.phase}
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light">
                  {step.description}
                </p>
              </div>

              {/* Status Indicator */}
              <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>PHASE {step.number}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors shadow-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
