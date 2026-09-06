import { Quote, Sparkles } from 'lucide-react';

interface TechQuote {
  quote: string;
  author: string;
  title: string;
}

const MOTIVATIONAL_QUOTES: TechQuote[] = [
  {
    quote: "Everybody in this country should learn how to use and understand a computer, because it teaches you how to think.",
    author: "Steve Jobs",
    title: "Co-founder, Apple Inc.",
  },
  {
    quote: "The computer was born to solve problems that did not exist before. Never hesitate to explore, click, and learn by doing.",
    author: "Bill Gates",
    title: "Co-founder, Microsoft",
  },
  {
    quote: "In computing, the only way to truly learn is by trying without fear. An expert was once a hesitant beginner.",
    author: "Grace Hopper",
    title: "Pioneer Computer Scientist & Naval Rear Admiral",
  },
  {
    quote: "Don't be afraid to take on things you have never done before. Growth and digital confidence come from continuous curiosity.",
    author: "Satya Nadella",
    title: "Chairman & CEO, Microsoft",
  },
  {
    quote: "Computers are magnificent tools for the realization of our ideas, but your curiosity is the true engine that brings them alive.",
    author: "Alan Kay",
    title: "Pioneer of Personal Computing & GUI",
  },
  {
    quote: "Digital confidence is not about knowing every single button—it's about knowing you have the ability to figure anything out.",
    author: "Reshma Saujani",
    title: "Founder, Girls Who Code",
  },
];

export default function MotivationSection() {
  return (
    <section id="motivation" className="relative z-10 py-20 px-5 sm:px-8 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#c8ff00] mb-3">
            <span className="w-6 h-px bg-[#c8ff00] shadow-[0_0_8px_#c8ff00]" />
            <span>Tech Inspiration // Words of Wisdom</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Inspiration for Your Digital Journey
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <Sparkles className="w-4 h-4 text-[#c8ff00]" />
              <span>Never stop learning</span>
            </div>
          </div>
        </div>

        {/* Motivational Quotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOTIVATIONAL_QUOTES.map((item, index) => (
            <div
              key={index}
              className="group relative p-7 sm:p-8 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-xl hover:bg-[#0f0f0f]/90 border border-white/[0.12] hover:border-[#c8ff00]/40 shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(200,255,0,0.12)] transition-all duration-300 floating-option interactive-option cursor-pointer flex flex-col justify-between"
            >
              {/* Top Quote Icon */}
              <div>
                <div className="mb-5 inline-flex p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-[#c8ff00]/30 text-[#c8ff00] group-hover:bg-[#c8ff00] group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(200,255,0,0.15)]">
                  <Quote className="w-4 h-4" />
                </div>

                {/* Quote Text */}
                <blockquote className="text-sm sm:text-base text-neutral-200 leading-relaxed font-normal italic">
                  "{item.quote}"
                </blockquote>
              </div>

              {/* Author's name written in small font right below each quote */}
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <p className="text-xs font-semibold text-white tracking-wide font-mono">
                  — {item.author}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5 font-light">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
