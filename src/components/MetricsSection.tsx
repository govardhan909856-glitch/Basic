import { useEffect, useRef, useState } from 'react';
import { METRICS } from '../data';

export default function MetricsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<string[]>(METRICS.map((m) => (m.value % 1 !== 0 ? '0.0' : '0')));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const startTime = performance.now();
          const duration = 1800; // ms

          const tick = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / duration);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);

            setCounts(
              METRICS.map((item) => {
                const currentVal = item.value * eased;
                if (item.value % 1 !== 0) {
                  return currentVal.toFixed(1);
                }
                return Math.floor(currentVal).toLocaleString();
              })
            );

            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              setCounts(
                METRICS.map((item) =>
                  item.value % 1 !== 0 ? item.value.toFixed(1) : item.value.toLocaleString()
                )
              );
            }
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={sectionRef}
      id="metrics"
      className="relative z-10 py-20 sm:py-28 px-5 sm:px-8 border-y border-border bg-card/50 backdrop-blur-xl"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
          {METRICS.map((metric, index) => (
            <div
              key={metric.label}
              className="interactive-option flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300 group cursor-default shadow-sm"
            >
              <div className="flex items-baseline justify-center">
                <span className="font-sans text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary tracking-tight">
                  {counts[index]}
                </span>
                {metric.suffix && (
                  <span className="font-sans text-2xl sm:text-3xl font-bold text-primary ml-0.5">
                    {metric.suffix}
                  </span>
                )}
              </div>
              <span className="mt-2 text-xs sm:text-sm font-semibold tracking-wider text-foreground uppercase">
                {metric.label}
              </span>
              {metric.sublabel && (
                <span className="mt-1 text-[11px] text-muted-foreground font-mono hidden sm:block">
                  {metric.sublabel}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
