export type Track = 'backend' | 'ai';
export type Focus = 'all' | Track;
export type GroupTrack = Track | 'both';

export interface Resume {
  label: string;
  href: string;
  track: Track | 'both';
}

export interface Profile {
  name: string;
  /** Per-view role line. */
  headline: Record<Focus, string>;
  /** Phrases cycled by the hero typewriter. */
  taglines: Record<Focus, string[]>;
  /** Supports **bold** and the {{years}} placeholder. */
  summary: Record<Focus, string>;
  company: string;
  location: string;
  email: string;
  altEmail: string;
  phone: string;
  altPhone: string;
  /** Data URL or site-relative path; empty shows initials. */
  photo: string;
  openToWork: boolean;
  links: {
    linkedin: string;
    github: string;
    leetcode: string;
    hackerrank: string;
  };
  resumes: Resume[];
}

export interface Stat {
  /** May use the {{years}} placeholder. */
  value: string;
  label: string;
  track: GroupTrack;
}

export interface SkillGroup {
  id: string;
  title: string;
  track: GroupTrack;
  skills: string[];
}

/** Text may use **double asterisks** for emphasis. */
export interface Bullet {
  text: string;
  tracks: Track[];
}

export interface WorkBlock {
  name: string;
  bullets: Bullet[];
}

export interface Experience {
  company: string;
  role: string;
  location: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM or "Present" */
  end: string;
  blocks: WorkBlock[];
}

export interface Metric {
  value: string;
  label: string;
}

export interface Project {
  name: string;
  kind: string;
  subtitle: string;
  description: string;
  /** Featured projects span the full grid width with a two-column layout. */
  featured?: boolean;
  metrics: Metric[];
  tech: string[];
  bullets: Bullet[];
  link: string;
}

export interface Certification {
  name: string;
  issuer: string;
  link: string;
}

export interface Education {
  degree: string;
  school: string;
  score: string;
  start: string;
  end: string;
}

export interface Portfolio {
  profile: Profile;
  stats: Stat[];
  skills: SkillGroup[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  achievements: string[];
  education: Education[];
}
