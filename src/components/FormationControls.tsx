import { FORMATIONS } from '../data';
import { Eye, Layers, RotateCcw } from 'lucide-react';

interface FormationControlsProps {
  activeFormationId: number;
  manualFormationId: number | null;
  onSelectFormation: (id: number | null) => void;
}

export default function FormationControls({
  activeFormationId,
  manualFormationId,
  onSelectFormation,
}: FormationControlsProps) {
  const currentFormation = FORMATIONS.find((f) => f.id === activeFormationId) || FORMATIONS[0];
  const isAuto = manualFormationId === null;

  return (
    <aside
      aria-label="3D Particle Controls"
      className="fixed bottom-5 right-5 z-40 hidden sm:flex items-center gap-2 p-1.5 rounded-full bg-card/90 backdrop-blur-2xl border border-border shadow-lg"
    >
      {/* Current State Display */}
      <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-mono">
        <span
          className="w-2 h-2 rounded-full transition-colors duration-300"
          style={{ backgroundColor: currentFormation.colorHex, color: currentFormation.colorHex }}
        />
        <span className="text-muted-foreground">SHADER:</span>
        <span className="text-foreground font-bold tracking-wider uppercase">
          {currentFormation.name}
        </span>
      </div>

      {/* Mode / Preset Switchers */}
      <div className="flex items-center gap-1 border-l border-border pl-2 pr-1">
        {FORMATIONS.map((f) => (
          <button
            key={f.id}
            onClick={() => onSelectFormation(f.id)}
            title={`${f.name} Formation: ${f.description}`}
            className={`w-6 h-6 rounded-full text-[10px] font-mono flex items-center justify-center transition-all ${
              manualFormationId === f.id
                ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {f.id + 1}
          </button>
        ))}

        {/* Reset to Auto Scroll button */}
        <button
          onClick={() => onSelectFormation(null)}
          title="Sync particles with page scroll"
          className={`text-[10px] font-mono uppercase px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
            isAuto
              ? 'bg-muted text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span>Auto</span>
        </button>
      </div>
    </aside>
  );
}
