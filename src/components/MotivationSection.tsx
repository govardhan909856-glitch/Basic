import { Quote, Sparkles } from 'lucide-react';

interface TechQuote {
  quote: string;
  author: string;
  title: string;
  theme?: 'red' | 'default';
}

const MOTIVATIONAL_QUOTES: TechQuote[] = [
  {
    quote: "You won't pass unless you write.",
    author: "Dr. Pradeep Kumar",
    title: "Educator & Academic Mentor",
    theme: 'red',
  },
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
    <section id="motivation" className="relative z-10 py-20 px-5 sm:px-8 border-t border-border">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3 font-mono">
            <span className="w-6 h-px bg-primary" />
            <span>Tech Inspiration // Words of Wisdom</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Inspiration for Your Digital Journey
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Never stop learning</span>
            </div>
          </div>
        </div>

        {/* Motivational Quotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOTIVATIONAL_QUOTES.map((item, index) => {
            const isRed = item.theme === 'red';
            return (
              <div
                key={index}
                className={`group relative p-7 sm:p-8 rounded-2xl backdrop-blur-xl transition-all duration-300 floating-option interactive-option cursor-pointer flex flex-col justify-between ${
                  isRed
                    ? 'bg-gradient-to-b from-red-950/60 to-red-950/30 border border-red-500/40 hover:border-red-500/80 shadow-md ring-1 ring-red-500/20'
                    : 'bg-card hover:bg-muted/60 border border-border hover:border-primary/40 shadow-sm'
                }`}
              >
                {/* Top Quote Icon */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`inline-flex p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 ${
                        isRed
                          ? 'bg-red-950/70 border border-red-500/40 text-red-400 group-hover:bg-red-600 group-hover:text-white shadow-sm'
                          : 'bg-muted border border-border text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                      }`}
                    >
                      <Quote className="w-4 h-4" />
                    </div>

                    {isRed && (
                      <span className="text-[10px] font-mono tracking-wider uppercase text-amber-500 dark:text-amber-200 bg-amber-500/10 border border-amber-500/40 px-3 py-0.5 rounded-full font-bold shadow-sm">
                        Golden Rule
                      </span>
                    )}
                  </div>

                  {/* Quote Text */}
                  <blockquote
                    className={`text-sm sm:text-base leading-relaxed font-normal italic ${
                      isRed ? 'text-red-400 dark:text-red-200 font-medium' : 'text-foreground'
                    }`}
                  >
                    "{item.quote}"
                  </blockquote>
                </div>

                {/* Author's name written in small font right below each quote */}
                <div
                  className={`mt-6 pt-4 border-t ${
                    isRed ? 'border-red-500/20' : 'border-border'
                  }`}
                >
                  <p
                    className={`text-xs font-semibold tracking-wide font-mono ${
                      isRed ? 'text-red-500 dark:text-red-300' : 'text-foreground'
                    }`}
                  >
                    — {item.author}
                  </p>
                  <p
                    className={`text-[11px] mt-0.5 font-light ${
                      isRed ? 'text-red-400/80 dark:text-red-300/70' : 'text-muted-foreground'
                    }`}
                  >
                    {item.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
