// Content model for the professional landing page.
// Based on design.md (Data Models), adapted only where the approved source
// (content/profile-source.md) needs it. Every language file (es.ts, a future
// en.ts) must satisfy ContentStructure so the UI can stay language-agnostic.

export interface NavigationItem {
  label: string
  targetId: string // HTML id of the target section
}

export interface HeroContent {
  name: string
  title: string
  tagline: string
  cta: {
    primary: string
    primaryAction: string // scroll target (#id) or URL
    secondary?: string
    secondaryAction?: string
  }
}

export interface ArchitectureApproach {
  title: string
  steps: string[] // ordered steps of the approach
  statement: string
}

export interface AboutContent {
  heading: string
  paragraphs: string[]
  approach?: ArchitectureApproach
}

export interface ExpertiseArea {
  title: string
  description: string
}

// Shared by experience and education entries.
export interface Period {
  start: string // e.g. "Mayo 2026" or "2011"
  end: string | null // null = current position
}

export interface ExperienceEntry {
  company: string
  role: string
  location?: string
  period: Period
  summary?: string
  achievements: string[] // responsibilities / achievements (Requirement 4.3)
}

// 'portfolio': architecture case study (not a production client implementation).
// 'professional': anonymized case from professional work.
export type ProjectType = 'portfolio' | 'professional'

export interface Project {
  name: string
  type: ProjectType
  typeLabel: string // display label for the project type
  description: string // problem addressed
  focus: string[] // technologies, patterns and methods (Requirement 5.2)
  demonstrates?: string
  note?: string // publication note shown with the project
  url?: string // public repository or project URL, when it exists
}

export interface Certification {
  name: string
  issuer?: string // omitted when the source does not state it
  issueDate?: string
  expirationDate?: string
  verificationUrl?: string
}

// Courses, diplomas and certification preparation (not certifications).
export interface ProfessionalDevelopmentEntry {
  name: string
  provider?: string
  detail?: string // e.g. duration
  period?: string
  status?: string // display text, e.g. "En curso", "Programado"
}

export interface Education {
  degree: string
  institution: string
  period: Period
}

export interface Service {
  name: string
  description: string
}

export interface ContactInfo {
  email: string
  phone: string // display format; approved for publication
  linkedin: string // full URL
  github: string // full URL
  location: string
  reach: string
}

export interface ContentStructure {
  navigation: NavigationItem[]
  hero: HeroContent
  about: AboutContent
  expertise: ExpertiseArea[]
  experience: ExperienceEntry[]
  projects: Project[]
  certifications: Certification[]
  professionalDevelopment: ProfessionalDevelopmentEntry[]
  technicalFoundation: string[]
  education: Education[]
  services: Service[]
  contact: ContactInfo
}
