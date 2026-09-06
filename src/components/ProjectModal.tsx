import { useState, useEffect } from 'react';
import { X, CheckCircle2, Calendar, BookOpen, Sparkles, Check, Laptop, FileText, Table, Presentation, Code2, Palette } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Table,
  Presentation,
  Code2,
  Palette,
  Sparkles,
  Laptop,
};

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [markedLearned, setMarkedLearned] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setMarkedLearned(false);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-card border border-border rounded-3xl overflow-hidden shadow-2xl my-8 cursor-default max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-background/80 backdrop-blur-xl hover:bg-primary text-foreground hover:text-primary-foreground transition-colors border border-border shadow-md cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1">
          {/* Project Hero Banner */}
          <div className="relative h-56 sm:h-72 w-full overflow-hidden">
            <img
              src={project.image}
              alt={project.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

            {/* Banner Meta */}
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">
              <span className="text-xs font-mono tracking-widest text-primary uppercase font-semibold px-3 py-1.5 rounded-xl bg-card/90 backdrop-blur-xl border border-border inline-block mb-2 shadow-sm">
                {project.category}
              </span>
              <div className="flex items-center gap-3">
                {project.iconName && ICONS[project.iconName] && (() => {
                  const Icon = ICONS[project.iconName];
                  return (
                    <span className="p-2 rounded-xl bg-primary text-primary-foreground shadow-sm">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </span>
                  );
                })()}
                <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {project.name}
                </h2>
              </div>
            </div>
          </div>

          {/* Project Body */}
          <div className="p-5 sm:p-8 space-y-6">
            {/* Metadata Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-muted/40 backdrop-blur-xl border border-border text-xs font-mono shadow-sm">
              <div>
                <span className="text-muted-foreground block mb-1 flex items-center gap-1">
                  <Laptop className="w-3.5 h-3.5 text-primary" /> FOCUS AREA
                </span>
                <span className="text-foreground font-medium">{project.client}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> MODULE
                </span>
                <span className="text-foreground font-medium">{project.year}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground block mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> PRACTICAL BENEFIT
                </span>
                <span className="text-primary font-medium">{project.metrics || 'Everyday computer mastery'}</span>
              </div>
            </div>

            {/* Practical Guide & Details */}
            <div>
              <h4 className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>प्रैक्टिकल गाइड और उपयोग विधि / Practical Guide</span>
              </h4>
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-light whitespace-pre-line">
                {project.details}
              </p>
            </div>

            {/* Essential Shortcuts / Key Points */}
            {project.awards && project.awards.length > 0 && (
              <div>
                <h4 className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>जरूरी शॉर्टकट और मुख्य बातें / Key Shortcuts</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.awards.map((shortcut) => (
                    <span
                      key={shortcut}
                      className="text-xs font-medium text-primary bg-muted/70 backdrop-blur-md border border-border px-3 py-1.5 rounded-xl font-mono shadow-sm"
                    >
                      {shortcut}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Core Skills & Tools */}
            <div>
              <h4 className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2.5 flex items-center gap-1.5">
                <span>उपयोगी टूल्स और टॉपिक्स / Covered Topics</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono text-foreground bg-muted/60 backdrop-blur-md border border-border px-3 py-1.5 rounded-xl shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
              <span className="text-xs font-mono text-muted-foreground">
                BASICS // 90% PRACTICAL &bull; 10% HARDWARE INTRO
              </span>
              <button
                type="button"
                onClick={() => setMarkedLearned(true)}
                className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer shadow-sm"
              >
                {markedLearned ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>सीख लिया / Completed!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>समझ आया / Mark as Understood</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
