import { useEffect } from 'react';

/**
 * ScrollGenerativeController:
 * Automatically watches all main sections and marked cards.
 * When scrolling down or up, elements dynamically synthesize into existence
 * with a futuristic scanline, de-blurring, and scale transition,
 * and dissolve when scrolled far away — creating a live "page generating on scroll" effect.
 */
export default function ScrollGenerativeController() {
  useEffect(() => {
    // Select all major sections and large interactive cards
    const elements = document.querySelectorAll<HTMLElement>(
      'main > section, .scroll-generative-node'
    );

    elements.forEach((el) => {
      // Ensure the base class is present
      if (!el.classList.contains('scroll-generative-node')) {
        el.classList.add('scroll-generative-node');
      }
    });

    // Special initial state for hero so the user sees it immediately
    const heroEl = document.querySelector<HTMLElement>('section#hero');
    if (heroEl) {
      heroEl.classList.add('is-generated');
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.08) {
            // Materialize / generate into clear view
            target.classList.add('is-generated');
          } else if (!entry.isIntersecting) {
            // Dissolve / dematerialize when scrolled away (except keep hero generated if at very top)
            if (target.id === 'hero' && window.scrollY < 120) {
              target.classList.add('is-generated');
            } else {
              target.classList.remove('is-generated');
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: [0.08, 0.25, 0.5, 0.8],
      }
    );

    elements.forEach((el) => observer.observe(el));

    // Handle fast window resizes or DOM mutations
    const handleRecheck = () => {
      const allEls = document.querySelectorAll<HTMLElement>('main > section, .scroll-generative-node');
      allEls.forEach((el) => {
        if (!el.classList.contains('scroll-generative-node')) {
          el.classList.add('scroll-generative-node');
          observer.observe(el);
        }
      });
    };

    window.addEventListener('resize', handleRecheck);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleRecheck);
    };
  }, []);

  return null;
}
