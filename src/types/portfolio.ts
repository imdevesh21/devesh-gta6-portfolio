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

export interface OperativeProfile {
  name: string;
  codename: string;
  title: string;
  avatarUrl?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeUpdatedAt?: string;
  wantedLevel: number;
  bounty: string;
  location: string;
  coordinates: string;
  contact: {
    phone: string;
    email: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  education: {
    institution: string;
    degree: string;
    period: string;
    cgpa: string;
  };
  summary: string;
  vitals: {
    healthLabel: string;
    healthVal: number;
    armorLabel: string;
    armorVal: number;
  };
  coursework: string[];
}

export interface RadioStation {
  id: string;
  name: string;
  frequency: string;
  tagline: string;
  genre: string;
  spotifyUri: string;
  accentColor: string;
  icon: string;
  description: string;
}

export interface PortfolioData {
  profile: OperativeProfile;
  skills: SkillWeapon[];
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  radioStations?: RadioStation[];
  customSpotifyUrl?: string;
}

export interface VisitorLog {
  id: string;
  timestamp: number;
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM
  time: string; // HH:MM:SS
  ip?: string;
  country: string;
  city: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  referrer: string;
  visitorId: string;
  isNew: boolean;
}

export interface AnalyticsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  monthVisits: number;
  todayVisits: number;
  dailyBreakdown: { [date: string]: number };
  monthlyBreakdown: { [month: string]: number };
  deviceBreakdown: { Desktop: number; Mobile: number; Tablet: number };
  countryBreakdown: { [country: string]: number };
  recentLogs: VisitorLog[];
}
