import { useState } from 'react';
import { Sparkles, Filter } from 'lucide-react';
import { PROJECTS } from '../data';
import { Project } from '../types';
import { CoverflowCarousel, CoverflowSlide } from '@/components/ui/coverflow-carousel';

interface WorkSectionProps {
  onSelectProject: (project: Project) => void;
}

export default function WorkSection({ onSelectProject }: WorkSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const categories = [
    'All',
    'MS Office',
    'Web Development',
    'Design & Graphics',
    'AI & Smart Tools',
  ];

  const filteredProjects = activeCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

  // Map skill projects to CoverflowSlides
  const coverflowSlides: CoverflowSlide[] = filteredProjects.map((project) => ({
    id: project.id,
    src: project.image,
    alt: project.name,
    title: project.name,
    subtitle: project.category,
    iconName: project.iconName,
    meta: [
      { label: 'Module', value: project.year },
      { label: 'Skill Track', value: project.client },
      { label: 'Key Highlight', value: project.metrics?.split(',')[0] || 'Practical Learning' },
    ],
    onClick: () => onSelectProject(project),
  }));

  return (
    <section id="work" className="relative z-10 py-24 sm:py-32 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#c8ff00] mb-3">
              <span className="w-6 h-px bg-[#c8ff00] shadow-[0_0_8px_#c8ff00]" />
              <span>Practical Modules // 90% Everyday Computer Skills</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              Practical Learning Modules
            </h2>
          </div>
        </div>

        {/* Filter Pills / Options */}
        <div className="flex items-center flex-wrap gap-2 mb-8">
          <span className="text-xs text-neutral-400 font-mono flex items-center gap-1.5 mr-1.5 px-3 py-1.5 rounded-full bg-[#0a0a0a]/70 backdrop-blur-md border border-white/10">
            <Filter className="w-3.5 h-3.5 text-[#c8ff00]" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setActiveSlideIndex(0);
              }}
              className={`interactive-option text-xs font-medium px-4 py-1.5 rounded-full cursor-pointer backdrop-blur-xl ${
                activeCategory === cat
                  ? 'bg-[#c8ff00] text-black shadow-[0_0_20px_rgba(200,255,0,0.35)] font-semibold border border-[#c8ff00]'
                  : 'bg-[#0a0a0a]/80 hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/[0.12] hover:border-[#c8ff00]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3D COVERFLOW CAROUSEL */}
        <div className="relative rounded-3xl bg-black/60 border border-white/[0.12] p-4 sm:p-8 backdrop-blur-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="absolute top-4 left-6 flex items-center gap-2 text-[11px] font-mono text-[#c8ff00]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE 3D PERSPECTIVE // DRAG OR CLICK CARDS</span>
          </div>

          <div className="pt-6">
            <CoverflowCarousel
              slides={coverflowSlides}
              showNavigation={true}
              showPagination={true}
              showCaption={true}
              cardWidth="clamp(200px, 26vw, 320px)"
              gap={0.06}
              rotate={42}
              depth={0.65}
              perspective={2.8}
              onCardClick={(index) => {
                const proj = filteredProjects[index % filteredProjects.length];
                if (proj) onSelectProject(proj);
              }}
              onActiveIndexChange={(index) => setActiveSlideIndex(index)}
            />
          </div>
        </div>

        {/* Interaction Hint Footer */}
        <div className="mt-8 text-center text-xs text-neutral-500 font-mono flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c8ff00] animate-pulse" />
          <span>Click any card to open complete step-by-step practical guide and shortcuts.</span>
        </div>
      </div>
    </section>
  );
}

