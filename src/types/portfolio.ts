export interface HeroPill {
  badge: string;
  expText: string;
}

export interface HeroCardContent {
  followTitle: string;
  mentoredCount: string;
  mentoredLabel: string;
  mentoredSubtext: string;
  domainTitle: string;
  domainDescription: string;
  quoteText: string;
  quoteAuthor: string;
  researchFocusTags: string[];
  examHeadTitle: string;
  examHeadRole: string;
}

export interface HeroConfig {
  pill: HeroPill;
  greetingPrefix: string;
  fullName: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  cards: HeroCardContent;
}

export interface StatBox {
  id: string;
  digit: string;
  label: string;
  subtext: string;
}

export interface AboutConfig {
  sectionTag: string;
  titlePrefix: string;
  highlightedName: string;
  titleSuffix: string;
  bioParagraph1: string;
  bioParagraph2: string;
  badge1: string;
  badge2: string;
  languages: string[];
  passions: string[];
  stats: StatBox[]; // The 4 About Stat counters
}

export interface ResearchStatBox {
  id: string;
  digit: string;
  label: string;
  subtext: string;
  badge: string;
  pdfUrl?: string; // Data URL, blob URL, or external link to uploaded PDF
  pdfFileName?: string; // Name of uploaded PDF file
  pdfFileSize?: string; // Formatted size string e.g. "3.2 MB"
  documentTitle?: string; // Title shown in modal header
  documentDescription?: string; // Brief description or summary in modal
}

export interface DissertationConfig {
  badge: string;
  tagline: string;
  indexFocus: string;
  title: string;
  description: string;
  footerNote: string;
}

export interface ResearchConfig {
  sectionTag: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  stats: ResearchStatBox[]; // The 4 Research boxes
  dissertation: DissertationConfig;
}

export interface ExamPillarBox {
  id: string;
  title: string;
  subtext: string;
  icon: string; // FontAwesome or Lucide icon class
}

export interface ExamCoordinatorConfig {
  sectionTag: string;
  titlePrefix: string;
  titleHighlight: string;
  periodBadge: string;
  departmentBadge: string;
  campusAdminText: string;
  roleTitle: string;
  description: string;
  pillars: ExamPillarBox[]; // The 4 Leadership boxes
}

export interface ExpertiseItem {
  id: number;
  index: string;
  title: string;
  badge: string;
  tags: string[];
  description: string;
}

export interface ExpertiseConfig {
  sectionTag: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  items: ExpertiseItem[];
}

export interface EducationItem {
  id: string;
  level: string;
  degree: string;
  institution: string;
  scoreOrStatus: string;
  statusType: 'pursuing' | 'completed';
  highlight?: string;
  description?: string;
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  institution: string;
  department?: string;
  description: string;
  type: 'academic' | 'industry';
}

export interface AwardItem {
  id: string;
  category: string;
  title: string;
  organization: string;
  description: string;
  icon?: string;
  imageUrl?: string; // Certificate / Trophy photo uploaded from device (base64 or URL)
  issuedDate?: string;
}

export interface ContactInfo {
  sectionTag: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  consultationFeeText?: string;
  workingHoursText?: string;
}

export interface PortfolioImages {
  heroCutout: string;      // Hero 3D cutout image (supports base64 data URL from device upload)
  aboutProfile: string;    // About section photo
  navLogoIcon?: string;    // Custom logo icon/avatar
}

export interface FeaturedVideoConfig {
  sectionTag: string;          // e.g. "Keynote & Video Lectures"
  titlePrefix: string;         // e.g. "Featured"
  titleHighlight: string;      // e.g. "Lecture & Keynote"
  description: string;         // e.g. "Watch keynote talks, pedagogical sessions, and VLSI engineering workshops."
  youtubeUrl: string;          // e.g. "https://www.youtube.com/watch?v=..."
  videoTitle: string;          // e.g. "IUCEE Engineering Pedagogy & VLSI Design Insights"
  badge: string;               // e.g. "Official Keynote Presentation"
  caption: string;             // e.g. "Recorded presentation detailing QoS-based MAC protocols & laboratory learning innovations."
  viewsOrDuration?: string;    // e.g. "Full Length Keynote Session"
}

export interface PortfolioContent {
  metaTitle: string;
  hero: HeroConfig;
  images: PortfolioImages;
  about: AboutConfig;
  expertise: ExpertiseConfig;
  research: ResearchConfig;
  featuredVideo: FeaturedVideoConfig; // Big size YouTube section directly below Research
  examCoordinator: ExamCoordinatorConfig;
  education: EducationItem[];
  experience: ExperienceItem[];
  awards: AwardItem[];
  contact: ContactInfo;
}
