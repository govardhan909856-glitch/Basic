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
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#0c0c0c]/95 backdrop-blur-2xl border border-white/[0.18] rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] my-8 cursor-default max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/80 backdrop-blur-xl hover:bg-[#c8ff00] text-white hover:text-black transition-colors border border-white/20 shadow-lg cursor-pointer"
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/40 to-transparent" />

            {/* Banner Meta */}
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">
              <span className="text-xs font-mono tracking-widest text-[#c8ff00] uppercase font-semibold px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-xl border border-[#c8ff00]/40 inline-block mb-2 shadow-md">
                {project.category}
              </span>
              <div className="flex items-center gap-3">
                {project.iconName && ICONS[project.iconName] && (() => {
                  const Icon = ICONS[project.iconName];
                  return (
                    <span className="p-2 rounded-xl bg-[#c8ff00] text-black shadow-lg">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </span>
                  );
                })()}
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {project.name}
                </h2>
              </div>
            </div>
          </div>

          {/* Project Body */}
          <div className="p-5 sm:p-8 space-y-6">
            {/* Metadata Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/[0.12] text-xs font-mono shadow-md">
              <div>
                <span className="text-neutral-400 block mb-1 flex items-center gap-1">
                  <Laptop className="w-3.5 h-3.5 text-[#c8ff00]" /> FOCUS AREA
                </span>
                <span className="text-white font-medium">{project.client}</span>
              </div>
              <div>
                <span className="text-neutral-400 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#c8ff00]" /> MODULE
                </span>
                <span className="text-white font-medium">{project.year}</span>
              </div>
              <div className="col-span-2">
                <span className="text-neutral-400 block mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c8ff00]" /> PRACTICAL BENEFIT
                </span>
                <span className="text-[#c8ff00] font-medium">{project.metrics || 'Everyday computer mastery'}</span>
              </div>
            </div>

            {/* Practical Guide & Details */}
            <div>
              <h4 className="text-xs font-mono tracking-widest uppercase text-neutral-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#c8ff00]" />
                <span>प्रैक्टिकल गाइड और उपयोग विधि / Practical Guide</span>
              </h4>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light whitespace-pre-line">
                {project.details}
              </p>
            </div>

            {/* Essential Shortcuts / Key Points */}
            {project.awards && project.awards.length > 0 && (
              <div>
                <h4 className="text-xs font-mono tracking-widest uppercase text-neutral-400 mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c8ff00]" />
                  <span>जरूरी शॉर्टकट और मुख्य बातें / Key Shortcuts</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.awards.map((shortcut) => (
                    <span
                      key={shortcut}
                      className="text-xs font-medium text-[#c8ff00] bg-black/60 backdrop-blur-md border border-[#c8ff00]/30 px-3 py-1.5 rounded-xl font-mono shadow-sm"
                    >
                      {shortcut}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Core Skills & Tools */}
            <div>
              <h4 className="text-xs font-mono tracking-widest uppercase text-neutral-400 mb-2.5 flex items-center gap-1.5">
                <span>उपयोगी टूल्स और टॉपिक्स / Covered Topics</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono text-neutral-200 bg-black/60 backdrop-blur-md border border-white/[0.15] px-3 py-1.5 rounded-xl shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-4">
              <span className="text-xs font-mono text-neutral-500">
                BASICS // 90% PRACTICAL &bull; 10% HARDWARE INTRO
              </span>
              <button
                type="button"
                onClick={() => setMarkedLearned(true)}
                className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full bg-[#c8ff00] text-black hover:bg-[#d5ff33] transition-colors cursor-pointer"
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
