import { useState } from 'react';
import { 
  Sparkles, 
  Filter, 
  Layers, 
  LayoutGrid, 
  ArrowUpRight, 
  Zap, 
  Cpu, 
  Keyboard, 
  Code2, 
  Table, 
  FileText, 
  Presentation, 
  Palette,
  Eye
} from 'lucide-react';
import { PROJECTS } from '../data';
import { Project } from '../types';
import { CoverflowCarousel, CoverflowSlide } from './ui/coverflow-carousel';

interface WorkSectionProps {
  onSelectProject: (project: Project) => void;
}

const MODULE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu,
  Keyboard,
  Code2,
  Table,
  FileText,
  Presentation,
  Palette,
  Sparkles,
};

export default function WorkSection({ onSelectProject }: WorkSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'coverflow' | 'grid'>('coverflow');

  const categories = [
    'All',
    'Hardware & Architecture',
    'Computer Basics',
    'Web Development',
    'MS Office',
    'AI & Smart Tools',
    'Design & Graphics',
  ];

  const filteredProjects = activeCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

  // Map skill projects to CoverflowSlides
  const coverflowSlides: CoverflowSlide[] = filteredProjects.map((project) => ({
    id: project.id,
    src: project.image,
    gifUrl: project.image,
    neonColor: project.neonColor,
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
    <section id="work" className="relative z-10 py-20 sm:py-28 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 text-xs font-semibold tracking-widest uppercase text-primary mb-3 font-mono">
              <span className="w-6 h-px bg-primary shadow-sm" />
              <span>Interactive Tech Modules // 100% Practical Mastery</span>
            </div>
            <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              Practical Learning Modules
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl font-sans">
              Interactive hands-on guides for computer hardware data flow, speed typing, software coding, and modern productivity tools.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-card/80 backdrop-blur-xl border border-border self-start md:self-auto shadow-sm">
            <button
              onClick={() => setViewMode('coverflow')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                viewMode === 'coverflow'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title="3D Coverflow Deck View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3D Deck</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title="Interactive Matrix Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tech Grid</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center flex-wrap gap-2 mb-8">
          <span className="text-xs text-muted-foreground font-mono flex items-center gap-1.5 mr-1 px-3 py-1.5 rounded-full bg-card/70 backdrop-blur-md border border-border">
            <Filter className="w-3.5 h-3.5 text-primary" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setActiveSlideIndex(0);
              }}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-full cursor-pointer backdrop-blur-xl transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground font-semibold border border-primary shadow-sm'
                  : 'bg-card/80 hover:bg-accent text-muted-foreground hover:text-foreground border border-border hover:border-primary/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* VIEW 1: 3D COVERFLOW PERSPECTIVE */}
        {viewMode === 'coverflow' ? (
          <div className="relative rounded-3xl bg-card/80 border border-border/80 p-4 sm:p-8 backdrop-blur-2xl overflow-hidden shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2 border-b border-border/50">
              <div className="flex items-center gap-2 text-[11px] font-mono text-primary">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>INTERACTIVE 3D PERSPECTIVE // DRAG OR CLICK CARDS TO ZOOM</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>60 FPS LOOPING PREVIEW ACTIVE</span>
              </div>
            </div>

            <div className="pt-4">
              <CoverflowCarousel
                slides={coverflowSlides}
                showNavigation={true}
                showPagination={true}
                showCaption={true}
                cardWidth="clamp(220px, 28vw, 340px)"
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
        ) : (
          /* VIEW 2: INTERACTIVE TECH MATRIX GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const IconComp = project.iconName && MODULE_ICONS[project.iconName] 
                ? MODULE_ICONS[project.iconName] 
                : Sparkles;

              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className="group relative rounded-3xl bg-card/90 backdrop-blur-2xl border border-border/80 overflow-hidden cursor-pointer flex flex-col transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/80 hover:shadow-[0_0_35px_rgba(56,189,248,0.35)] dark:hover:shadow-[0_0_40px_rgba(56,189,248,0.5)] active:scale-[0.99]"
                >
                  {/* Top Preview Media with High-Res Image & Smooth Animations */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-black/90">
                    <img
                      src={project.image}
                      alt={project.name}
                      loading="lazy"
                      className="w-full h-full object-cover smooth-image-hover transition-transform duration-700 ease-out group-hover:scale-108"
                    />

                    {/* Smooth Interactive Shine Sweep Effect */}
                    <div className="smooth-shine-effect z-10" />

                    {/* Dark Vignette & Cyber Scanline */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/25 to-black/30 transition-opacity duration-300 group-hover:opacity-65" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity" />

                    {/* Smooth HD Preview Status Indicator */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-primary font-medium shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="tracking-wider uppercase">HD PREVIEW</span>
                    </div>

                    {/* Category & Icon Badge */}
                    <div className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-black/75 backdrop-blur-xl border border-white/15 text-primary group-hover:text-cyan-400 group-hover:border-cyan-400/60 transition-colors shadow-lg">
                      <IconComp className="w-4 h-4" />
                    </div>

                    {/* Track Pill */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-semibold px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/15">
                        {project.year}
                      </span>
                    </div>

                    {/* Subtle Neon Line */}
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Card Content Details */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                          {project.category}
                        </span>
                        <span className="text-xs font-mono text-primary font-medium">
                          {project.client}
                        </span>
                      </div>

                      <h3 className="font-sans text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">
                        {project.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4 font-sans">
                        {project.summary}
                      </p>
                    </div>

                    {/* Key Highlights / Stack Tags */}
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/60"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-muted/40 text-muted-foreground/80">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Interactive Button */}
                      <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                        <span className="flex items-center gap-1.5 font-mono">
                          <Eye className="w-3.5 h-3.5 text-primary" />
                          <span>View Full Guide</span>
                        </span>
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:translate-x-0.5">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Interaction Hint Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground font-mono flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Hover or tap any module card to preview live looping telemetry and open the interactive step-by-step practical guide.</span>
        </div>
      </div>
    </section>
  );
}

