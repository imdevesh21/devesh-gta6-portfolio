export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  status: 'IN PROGRESS' | 'ACCOMPLISHED' | 'TRAINING COMPLETED';
  missionTitle: string;
  briefing: string;
  achievements: string[];
  keyMetric: string;
  techStack: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  codename: string;
  type: string;
  bounty: string;
  description: string;
  impactHighlight: string;
  details: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface SkillWeapon {
  id: string;
  name: string;
  weaponClass: string;
  icon: string;
  category: 'frontend' | 'backend' | 'languages' | 'cloud' | 'ai' | 'algorithmic';
  description: string;
  fireRate: number; // Render / Execution speed
  damage: number; // Architectural impact
  accuracy: number; // Reliability / Type safety
  battleground: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  status: string;
  icon: string;
  description: string;
  badgeUrl?: string;
}
