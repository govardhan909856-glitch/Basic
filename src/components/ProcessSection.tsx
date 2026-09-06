import { PROCESS_STEPS } from '../data';
import { ProcessStep } from '../types';

export default function ProcessSection() {
  return (
    <section id="process" className="relative z-10 py-24 sm:py-32 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#c8ff00] mb-3">
            <span className="w-6 h-px bg-[#c8ff00] shadow-[0_0_8px_#c8ff00]" />
            <span>Step-by-Step Path // Learn Computer Basics the Easy Way</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
            4-Step Computer Basics Learning Path
          </h2>
        </div>

        {/* 4-Step Process Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {PROCESS_STEPS.map((step: ProcessStep) => (
            <div
              key={step.number}
              className="group relative p-6 sm:p-7 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-2xl border-l-2 border-l-[#c8ff00]/40 hover:border-l-[#c8ff00] border-y border-r border-white/[0.12] hover:border-white/[0.2] shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(200,255,0,0.12)] transition-all duration-300 hover:bg-[#0f0f0f]/90 floating-option interactive-option cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Step Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#c8ff00]/30 group-hover:text-[#c8ff00] transition-colors duration-300 tracking-tighter">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#c8ff00] px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                    {step.phase}
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-[#c8ff00] transition-colors">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
                  {step.description}
                </p>
              </div>

              {/* Status Indicator */}
              <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>PHASE {step.number}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#c8ff00] transition-colors shadow-[0_0_8px_#c8ff00]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
