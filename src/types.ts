export interface Project {
  id: string;
  name: string;
  category: string;
  image: string;
  tall?: boolean;
  year: string;
  client: string;
  summary: string;
  details: string;
  awards?: string[];
  metrics?: string;
  techStack: string[];
  iconName?: string;
}

export interface Capability {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  phase: string;
}

export interface MetricItem {
  value: number;
  suffix?: string;
  label: string;
  sublabel?: string;
}

export type FormationKey = 'sphere' | 'helix' | 'grid' | 'torus' | 'galaxy' | 'vortex';

export interface FormationInfo {
  id: number;
  key: FormationKey;
  name: string;
  description: string;
  colorHex: string;
}
