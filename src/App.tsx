import React, { useState, useEffect } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Download,
  GraduationCap,
  Mail,
  MapPin,
  Medal,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
  FileCheck,
  Building,
  ArrowRight,
  ExternalLink,
  Menu,
  Briefcase,
  Settings,
  Lock,
  Key,
  Edit3,
  FileText,
  Play,
  Video,
  Linkedin,
  Youtube
} from 'lucide-react';
import { PortfolioContent, AwardItem, ResearchStatBox } from './types/portfolio';
import { defaultPortfolioContent } from './data/defaultContent';
import { AdminPanel } from './components/AdminPanel';
import { loadPdfDocument, storePdfDocument } from './utils/pdfStorage';
import { getYouTubeEmbedUrl } from './utils/youtube';
import {
  fetchRemoteContent,
  saveRemoteContent,
  submitContactMessage,
  submitCvRequest
} from './utils/api';

export default function App() {
  // Mobile navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Dynamic Portfolio Content with LocalStorage Persistence
  const [content, setContent] = useState<PortfolioContent>(() => {
    try {
      const saved = localStorage.getItem('smita_portfolio_content_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultPortfolioContent,
          ...parsed,
          featuredVideo: parsed.featuredVideo || defaultPortfolioContent.featuredVideo
        };
      }
    } catch (e) {
      console.warn('Could not load custom content from localStorage:', e);
    }
    return defaultPortfolioContent;
  });

  // Admin Panel states
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminStudioOpen, setAdminStudioOpen] = useState(false);

  // Accordion state (first one open by default)
  const [expandedAccordion, setExpandedAccordion] = useState<number | null>(0);

  // Contact form state
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    category: 'Research Collaboration'
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // CV Request Modal
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [cvEmail, setCvEmail] = useState('');
  const [cvRequested, setCvRequested] = useState(false);

  // Publications details modal
  const [pubsModalOpen, setPubsModalOpen] = useState(false);

  // Award certificate lightbox modal
  const [selectedAwardModal, setSelectedAwardModal] = useState<AwardItem | null>(null);

  // Research PDF & details modal
  const [selectedResearchBox, setSelectedResearchBox] = useState<ResearchStatBox | null>(null);

  // Hydrate any stored PDF documents from IndexedDB
  useEffect(() => {
    const hydratePdfs = async () => {
      try {
        let hasUpdates = false;
        const updatedStats = await Promise.all(
          content.research.stats.map(async (stat) => {
            if (!stat.pdfUrl) {
              const savedPdf = await loadPdfDocument(stat.id);
              if (savedPdf) {
                hasUpdates = true;
                return { ...stat, pdfUrl: savedPdf };
              }
            }
            return stat;
          })
        );
        if (hasUpdates) {
          setContent((prev) => ({
            ...prev,
            research: { ...prev.research, stats: updatedStats }
          }));
        }
      } catch (err) {
        console.warn('PDF hydration error:', err);
      }
    };
    hydratePdfs();
  }, []);

  // Hydrate content from Hostinger MySQL database if available
  useEffect(() => {
    fetchRemoteContent().then((remote) => {
      if (remote) {
        setContent((prev) => ({
          ...defaultPortfolioContent,
          ...prev,
          ...remote,
          featuredVideo: remote.featuredVideo || prev.featuredVideo || defaultPortfolioContent.featuredVideo
        }));
      }
    });
  }, []);

  // Save updated content
  const handleSaveContent = async (updated: PortfolioContent): Promise<{ success: boolean; error?: string }> => {
    // If any pdfUrl is a data URI, store into IndexedDB so localStorage stays under quota
    updated.research.stats.forEach((stat) => {
      if (stat.pdfUrl && stat.pdfUrl.startsWith('data:')) {
        storePdfDocument(stat.id, stat.pdfUrl);
      }
    });

    setContent(updated);

    try {
      localStorage.setItem('smita_portfolio_content_v1', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage full, stripping large data URLs for safe fallback:', e);
      try {
        const safe = {
          ...updated,
          research: {
            ...updated.research,
            stats: updated.research.stats.map((s) => ({
              ...s,
              pdfUrl: s.pdfUrl?.startsWith('data:') ? undefined : s.pdfUrl
            }))
          }
        };
        localStorage.setItem('smita_portfolio_content_v1', JSON.stringify(safe));
      } catch (e2) {
        console.error('Failed to save to localStorage:', e2);
      }
    }

    // Sync to Hostinger MySQL database
    return await saveRemoteContent(updated);
  };

  // Reset content to factory default
  const handleResetContent = () => {
    setContent(defaultPortfolioContent);
    try {
      localStorage.removeItem('smita_portfolio_content_v1');
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
  };

  // Admin passcode login
  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (adminPasswordInput.trim() === 'admin123' || adminPasswordInput.trim() === '') {
      setAdminAuthenticated(true);
      setAdminModalOpen(false);
      setAdminStudioOpen(true);
      setAdminPasswordError(false);
      setAdminPasswordInput('');
    } else {
      setAdminPasswordError(true);
    }
  };

  // Direct bypass for convenience
  const handleDirectAdminOpen = () => {
    setAdminAuthenticated(true);
    setAdminModalOpen(false);
    setAdminStudioOpen(true);
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'education', 'experience', 'expertise', 'research', 'video', 'awards', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setAdminStudioOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Update browser document title when meta title changes
  useEffect(() => {
    if (content.metaTitle) {
      document.title = content.metaTitle;
    }
  }, [content.metaTitle]);

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#111111] font-sans antialiased selection:bg-[#FFA81F] selection:text-[#111111] text-base leading-relaxed">
      {/* BEGIN: Sticky Pill Header Bar */}
      <header className="fixed top-3 sm:top-5 inset-x-0 z-50 px-2 sm:px-6 pointer-events-none">
        <nav
          className="max-w-6xl mx-auto bg-[#111111]/95 text-white backdrop-blur-md rounded-full px-3 sm:px-6 py-2 sm:py-3.5 flex items-center justify-between border border-white/10 shadow-2xl pointer-events-auto"
          aria-label="Main Navigation"
        >
          {/* Logo / Personal Brand */}
          <a
            href="#hero"
            className="flex items-center gap-2 sm:gap-3 group focus:outline-none flex-shrink-0"
            aria-label="Home"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FFA81F] text-[#111111] flex items-center justify-center font-heading font-black text-sm sm:text-base group-hover:scale-105 transition-transform shadow-md">
              SP
            </div>
            <div className="text-left">
              <span className="font-heading font-extrabold text-sm sm:text-base tracking-tight block text-white group-hover:text-[#FFA81F] transition-colors leading-tight">
                {content.hero.fullName}
                <span className="text-[#FFA81F]">.</span>
              </span>
              <span className="text-[10px] sm:text-xs text-white/70 block uppercase tracking-wider font-semibold leading-none">
                Academician &amp; Researcher
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-5 lg:gap-7 xl:gap-8 text-xs sm:text-sm font-semibold text-white/85">
            {[
              { label: 'Home', href: '#hero', id: 'hero' },
              { label: 'About', href: '#about', id: 'about' },
              { label: 'Teaching', href: '#expertise', id: 'expertise' },
              { label: 'Education', href: '#education', id: 'education' },
              { label: 'Experience', href: '#experience', id: 'experience' },
              { label: 'Research', href: '#research', id: 'research' },
              { label: 'Video', href: '#video', id: 'video' },
              { label: 'Awards', href: '#awards', id: 'awards' },
              { label: 'Contact', href: '#contact', id: 'contact' }
            ].map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`transition-colors hover:text-[#FFA81F] ${
                  activeSection === link.id ? 'text-[#FFA81F] font-bold' : ''
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Right Controls: Prominent 3-bar Hamburger Button */}
          <div className="flex md:hidden items-center flex-shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="bg-[#FFA81F] hover:bg-[#E59415] active:scale-95 text-[#111111] font-heading font-black text-xs px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-4 h-4 stroke-[3]" />
              <span className="uppercase tracking-wider">MENU</span>
            </button>
          </div>
        </nav>
      </header>
      {/* END: Sticky Pill Header Bar */}

      {/* BEGIN: Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="mobile-drawer"
        className={`fixed top-0 right-0 z-[70] h-full w-[85%] max-w-sm bg-[#111111] text-white shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out border-l border-white/10 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile Navigation Menu"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FFA81F] text-[#111111] flex items-center justify-center font-heading font-black text-sm">
              SP
            </div>
            <div>
              <span className="font-heading font-extrabold text-white text-base leading-tight block">
                {content.hero.fullName}
              </span>
              <span className="text-[11px] text-[#FFA81F] font-bold block">DYPIU Pune, India</span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Nav Links */}
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
          {[
            { label: 'Home / Hero Banner', href: '#hero', num: '01' },
            { label: 'About & Academic Profile', href: '#about', num: '02' },
            { label: 'Teaching & Specialization', href: '#expertise', num: '03' },
            { label: 'Education Journey', href: '#education', num: '04' },
            { label: 'Professional Experience', href: '#experience', num: '05' },
            { label: 'Research & Publications', href: '#research', num: '06' },
            { label: 'Featured Keynote Video', href: '#video', num: '07' },
            { label: 'Examination Coordinator', href: '#examination', num: '08' },
            { label: 'Achievements & Awards', href: '#awards', num: '09' },
            { label: 'Get in Touch / Contact', href: '#contact', num: '10' }
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-white/10 active:bg-white/15 text-white/90 hover:text-[#FFA81F] transition-all group font-medium text-base"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-[#FFA81F]/20 group-hover:text-[#FFA81F] flex items-center justify-center text-xs text-white/60 transition-colors font-mono">
                  {item.num}
                </span>
                <span>{item.label}</span>
              </div>
            </a>
          ))}

          {/* Admin Panel Link inside Drawer */}
          <div className="pt-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (adminAuthenticated) {
                  setAdminStudioOpen(true);
                } else {
                  setAdminModalOpen(true);
                }
              }}
              className="w-full bg-[#FFA81F]/20 hover:bg-[#FFA81F]/30 text-[#FFA81F] border border-[#FFA81F]/50 px-4 py-3 rounded-xl font-bold flex items-center justify-between text-sm transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-[#FFA81F]" />
                <span>Admin Studio (Edit Website)</span>
              </div>
              <span className="text-[10px] bg-[#FFA81F] text-[#111111] px-2 py-0.5 rounded font-black uppercase">
                Customize
              </span>
            </button>
          </div>
        </div>

        {/* Drawer Bottom Actions */}
        <div className="p-5 border-t border-white/10 bg-white/[0.02] space-y-3">
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-heading font-extrabold py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all text-sm uppercase tracking-wide"
          >
            <span>Let's Talk</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setPubsModalOpen(true);
            }}
            className="w-full bg-white/10 hover:bg-white/15 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs border border-white/10"
          >
            <Star className="w-4 h-4 text-[#FFA81F]" />
            <span>View Research Publications &amp; Patents</span>
          </button>
        </div>
      </aside>
      {/* END: Mobile Slide-Out Drawer Navigation */}

      {/* BEGIN: HeroSection */}
      <section
        className="pt-28 sm:pt-36 pb-0 px-4 sm:px-6 max-w-7xl mx-auto relative flex flex-col items-center text-center"
        data-purpose="hero-banner"
        id="hero"
      >
        {/* Top distinction pill */}
        <div className="inline-flex items-center gap-2.5 sm:gap-3 bg-white border border-[#111111]/15 shadow-md rounded-full py-2 px-5 mb-5 animate-fade-in">
          <span className="w-6 h-6 rounded-full bg-[#FFA81F]/20 text-[#FFA81F] flex items-center justify-center text-xs">
            <Award className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-[#111111] tracking-tight">
            {content.hero.pill.badge}
          </span>
          <span className="w-2 h-2 rounded-full bg-[#FFA81F]"></span>
          <span className="text-xs sm:text-sm font-bold text-[#111111]/70">
            {content.hero.pill.expText}
          </span>
        </div>

        {/* Hero headline & title */}
        <div className="space-y-3 mb-6 max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-heading text-[#111111] tracking-tight leading-[1.08]">
            {content.hero.greetingPrefix} <span className="text-[#FFA81F]">{content.hero.fullName}</span>{' '}
            <span className="text-[#FFA81F] inline-block text-3xl sm:text-4xl md:text-5xl">✦</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#111111]/80 max-w-3xl mx-auto">
            {content.hero.subtitle}
          </p>

          {/* Hero CTAs */}
          <div className="flex items-center justify-center gap-4 pt-3 w-full max-w-sm sm:max-w-md mx-auto">
            <a
              href={content.hero.primaryCtaLink}
              className="flex-1 bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-black text-sm sm:text-base py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 shadow-xl transition-transform active:scale-95 whitespace-nowrap"
            >
              <span>{content.hero.primaryCtaText}</span>
              <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>
            <a
              href={content.hero.secondaryCtaLink}
              className="flex-1 bg-white hover:bg-gray-100 border-2 border-[#111111] text-[#111111] font-black text-sm sm:text-base py-3.5 px-6 rounded-full shadow-md text-center transition-transform active:scale-95 whitespace-nowrap"
            >
              {content.hero.secondaryCtaText}
            </a>
          </div>
        </div>

        {/* 3-Column Bento Grid Hero Layout */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-end justify-center mt-6 mb-0 relative">
          {/* Left Column (3 cols) - Featured Information Cards */}
          <div className="md:col-span-3 flex flex-col gap-4 text-left order-1 md:order-1 pb-4">
            {/* Follow Me On Card */}
            <div className="bg-white/95 backdrop-blur-md border border-[#111111]/15 p-5 sm:p-6 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <span className="text-xs sm:text-sm font-extrabold text-[#111111]/70 uppercase tracking-wider block mb-3">
                {content.hero.cards.followTitle}
              </span>
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                <a
                  className="w-10 h-10 rounded-full bg-[#111111] text-white text-sm flex items-center justify-center hover:bg-[#FFA81F] hover:text-[#111111] transition-colors shadow-sm"
                  href={`mailto:${content.contact.email}`}
                  title="Email Mrs. Smita Pawar"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  className="w-10 h-10 rounded-full bg-[#111111] text-white text-sm flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-colors shadow-sm"
                  href={content.contact.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  className="w-10 h-10 rounded-full bg-[#111111] text-white text-sm flex items-center justify-center hover:bg-[#FF0000] hover:text-white transition-colors shadow-sm"
                  href={content.contact.youtubeUrl || content.featuredVideo?.youtubeUrl || 'https://www.youtube.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="YouTube Channel"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setPubsModalOpen(true)}
                  className="w-10 h-10 rounded-full bg-[#111111] text-white text-sm flex items-center justify-center hover:bg-[#FFA81F] hover:text-[#111111] transition-colors shadow-sm"
                  title="Google Scholar &amp; Scopus"
                >
                  <GraduationCap className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPubsModalOpen(true)}
                  className="w-10 h-10 rounded-full bg-[#111111] text-white text-sm flex items-center justify-center hover:bg-[#FFA81F] hover:text-[#111111] transition-colors shadow-sm"
                  title="Research &amp; Publications"
                >
                  <BookOpen className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 1000+ Mentored Students Card */}
            <div className="bg-white/95 backdrop-blur-md border border-[#111111]/15 p-5 sm:p-6 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-[#FFA81F]">
                <Star className="w-5 h-5 fill-[#FFA81F]" />
                <span className="text-[#111111] font-black text-xl sm:text-2xl">
                  {content.hero.cards.mentoredCount}
                </span>
                <span className="text-xs sm:text-sm text-[#111111]/80 font-bold">
                  {content.hero.cards.mentoredLabel}
                </span>
              </div>
              <p className="text-sm sm:text-base text-[#111111]/85 font-medium leading-snug">
                {content.hero.cards.mentoredSubtext}
              </p>
            </div>

            {/* Domain Specialty Card */}
            <div className="bg-[#111111] text-white p-5 sm:p-6 rounded-3xl border border-white/15 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <span className="text-xs sm:text-sm font-extrabold text-[#FFA81F] uppercase tracking-wider block mb-1.5">
                {content.hero.cards.domainTitle}
              </span>
              <p className="text-sm sm:text-base font-bold leading-snug">
                {content.hero.cards.domainDescription}
              </p>
            </div>
          </div>

          {/* Center Column: 3D Cutout Portrait (Device Uploadable) */}
          <div className="md:col-span-6 relative flex flex-col items-center justify-end order-3 md:order-2 group select-none">
            {/* Ambient 3D golden glow & depth halos */}
            <div className="absolute w-80 sm:w-[440px] h-80 sm:h-[440px] bg-gradient-to-tr from-[#FFA81F]/40 via-[#FFA81F]/20 to-transparent rounded-full blur-3xl -z-10 transform translate-y-6"></div>
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 bg-white/50 rounded-full blur-2xl -z-10 transform -translate-y-2"></div>

            {/* Spinning badge floating with 3D drop shadow */}
            <div className="absolute top-2 right-2 sm:right-6 z-20 pointer-events-none filter drop-shadow-xl">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                  <path
                    d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                    fill="none"
                    id="circlePathHero"
                    stroke="none"
                  ></path>
                  <text className="text-[9px] sm:text-[10px] font-black tracking-widest fill-[#111111] uppercase">
                    <textPath href="#circlePathHero">
                      {content.hero.pill.expText} • {content.hero.pill.expText} •
                    </textPath>
                  </text>
                </svg>
                <div className="absolute w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111111] text-[#FFA81F] flex items-center justify-center text-sm shadow-md font-bold">
                  ✦
                </div>
              </div>
            </div>

            {/* 3D Cutout Image (Supports device uploaded image) */}
            <div className="relative z-10 flex flex-col items-center justify-end w-full">
              <img
                alt={`${content.hero.fullName} – Academic Portfolio Cutout`}
                className="w-full max-w-[380px] sm:max-w-[460px] md:max-w-[520px] h-auto object-contain block -mb-[2px] transition-all duration-500 ease-out group-hover:scale-[1.03]"
                style={{
                  filter:
                    'drop-shadow(0 20px 30px rgba(17, 17, 17, 0.32)) drop-shadow(0 10px 20px rgba(255, 168, 31, 0.25))'
                }}
                src={content.images.heroCutout}
              />

              {/* Quick image edit badge on hover for user */}
              <button
                onClick={() => {
                  setAdminAuthenticated(true);
                  setAdminStudioOpen(true);
                }}
                className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 bg-[#111111]/90 text-[#FFA81F] hover:bg-[#FFA81F] hover:text-[#111111] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl transition-all border border-[#FFA81F]/40 backdrop-blur-sm"
                title="Change Photo from Admin Panel"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Change Photo</span>
              </button>
            </div>
          </div>

          {/* Right Column (3 cols) - Featured Information Cards */}
          <div className="md:col-span-3 flex flex-col gap-4 text-left order-2 md:order-3 pb-4">
            {/* Quote Card */}
            <div className="bg-[#111111] text-white p-5 sm:p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left border border-white/15">
              <span className="text-[#FFA81F] text-3xl leading-none font-heading block mb-2">“</span>
              <p className="text-sm sm:text-base leading-relaxed font-medium text-white/95">
                {content.hero.cards.quoteText}
              </p>
              <span className="text-xs sm:text-sm text-[#FFA81F] font-bold block mt-3">
                {content.hero.cards.quoteAuthor}
              </span>
            </div>

            {/* Research Focus tags Card */}
            <div className="bg-white/95 backdrop-blur-md border border-[#111111]/15 p-5 sm:p-6 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3">
              <span className="text-xs sm:text-sm font-extrabold text-[#111111]/70 uppercase tracking-wider">
                Research Focus
              </span>
              <div className="flex flex-wrap gap-2">
                {content.hero.cards.researchFocusTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full ${
                      idx % 2 === 0
                        ? 'bg-[#111111] text-white'
                        : 'bg-[#FFA81F] text-[#111111]'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Examination Head Card */}
            <div className="bg-[#FFA81F]/20 border border-[#FFA81F]/40 p-5 sm:p-6 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#111111]/80">
                  {content.hero.cards.examHeadTitle}
                </span>
                <span className="text-base sm:text-lg font-bold text-[#111111]">
                  {content.hero.cards.examHeadRole}
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#FFA81F] flex items-center justify-center text-[#111111] text-sm font-bold shadow-sm">
                <ShieldCheck className="w-5 h-5 text-[#111111]" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: HeroSection */}

      {/* BEGIN: MarqueeTicker */}
      <div className="bg-[#111111] text-white py-5 sm:py-6 overflow-hidden border-y-2 border-[#FFA81F] whitespace-nowrap select-none">
        <div className="inline-block animate-marquee text-sm sm:text-base uppercase tracking-widest font-heading font-extrabold">
          <span className="mx-4">VLSI Design &amp; Architecture</span> <span className="text-[#FFA81F]">✦</span>
          <span className="mx-4">Embedded Systems</span> <span className="text-[#FFA81F]">✦</span>
          <span className="mx-4">Wireless Sensor Networks (WMSN)</span> <span className="text-[#FFA81F]">✦</span>
          <span className="mx-4">IUCEE-IIECP Certified Educator</span> <span className="text-[#FFA81F]">✦</span>
          <span className="mx-4">Research &amp; Patents</span> <span className="text-[#FFA81F]">✦</span>
          <span className="mx-4">Child &amp; Adolescent Mentoring</span> <span className="text-[#FFA81F]">✦</span>
          <span className="mx-4">Examination Head</span> <span className="text-[#FFA81F]">✦</span>
        </div>
      </div>
      {/* END: MarqueeTicker */}

      {/* BEGIN: ExpertiseSection Accordion */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto" data-purpose="teaching-accordion-section" id="expertise">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-5 border-b border-[#111111]/15 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-[#FFA81F]"></div>
              <div className="w-3 h-3 rounded-full bg-[#111111]"></div>
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#111111]/70 ml-1">
                {content.expertise.sectionTag}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-[#111111] leading-tight">
              {content.expertise.titlePrefix}{' '}
              <span className="text-[#FFA81F]">{content.expertise.titleHighlight}</span> ✦
            </h2>
            <p className="text-base sm:text-lg text-[#111111]/80 mt-3 font-medium max-w-3xl">
              {content.expertise.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="bg-[#111111] hover:bg-black text-white text-sm font-bold px-6 py-3 rounded-full inline-flex items-center gap-2.5 shadow-md transition-colors whitespace-nowrap"
            >
              <span>Connect for Guest Lectures</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FFA81F]" />
            </a>
          </div>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4" id="accordionContainer">
          {content.expertise.items.map((item) => {
            const isExpanded = expandedAccordion === item.id;
            return (
              <div
                key={item.id}
                className="accordion-item rounded-3xl overflow-hidden transition-all duration-300 border border-[#111111]/15 shadow-sm"
              >
                <button
                  onClick={() => setExpandedAccordion(isExpanded ? null : item.id)}
                  className={`w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors ${
                    isExpanded ? 'bg-[#111111] text-white' : 'bg-white text-[#111111] hover:bg-amber-50/40'
                  }`}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span
                      className={`font-heading text-lg sm:text-xl font-black ${
                        isExpanded ? 'text-[#FFA81F]' : 'text-[#111111]/40'
                      }`}
                    >
                      {item.index}
                    </span>
                    <span className="font-heading text-lg sm:text-2xl font-bold">{item.title}</span>
                    <span
                      className={`hidden sm:inline-block text-xs uppercase font-extrabold px-3 py-1 rounded-full ${
                        isExpanded ? 'bg-white/10 text-white/90' : 'bg-[#111111]/10 text-[#111111]/70'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-full bg-[#FFA81F] text-[#111111] flex items-center justify-center text-sm transition-transform duration-300 ${
                      isExpanded ? 'rotate-45' : ''
                    }`}
                  >
                    <ArrowRight className="w-4 h-4 transform -rotate-45" />
                  </div>
                </button>

                {isExpanded && (
                  <div className="bg-[#111111] px-6 sm:px-8 pb-7 pt-3 text-white border-t border-white/10 block animate-fade-in">
                    <div className="flex flex-wrap gap-2.5 mb-4">
                      {item.tags.map((tag, i) => (
                        <span key={i} className="text-xs sm:text-sm bg-white/15 text-white px-4 py-1.5 rounded-full font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-base sm:text-lg text-white/80 leading-relaxed font-normal max-w-5xl">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      {/* END: ExpertiseSection */}

      {/* BEGIN: AboutMeSection */}
      <section
        className="bg-[#111111] text-white py-20 px-4 sm:px-6 border-t-4 border-[#FFA81F] relative"
        data-purpose="about-me-section"
        id="about"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left 5 Cols: Portrait Card + Badges */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="relative bg-[#FFA81F] rounded-3xl p-4 shadow-2xl">
                <div className="relative w-full h-88 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden bg-[#F5F1E8] flex items-end justify-center">
                  <img
                    alt={`${content.hero.fullName} Profile`}
                    className="w-full h-full object-contain object-bottom filter contrast-[1.03]"
                    src={content.images.aboutProfile}
                  />
                </div>
                <div className="absolute -bottom-4 left-6 bg-[#111111] text-white text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-full border border-white/20 shadow-md">
                  {content.about.badge1}
                </div>
                <div className="absolute -bottom-4 right-6 bg-white text-[#111111] text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-full border border-[#111111]/20 shadow-md">
                  {content.about.badge2}
                </div>
              </div>

              {/* Languages & Passions */}
              <div className="bg-white/5 p-5 sm:p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-extrabold text-[#FFA81F] uppercase tracking-wide">
                    Languages Spoken
                  </span>
                  <div className="flex gap-2">
                    {content.about.languages.map((lang, idx) => (
                      <span key={idx} className="text-xs sm:text-sm bg-[#111111] px-3.5 py-1.5 rounded-lg border border-white/20 font-bold">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-white/10 pt-3.5 gap-2">
                  <span className="text-xs sm:text-sm font-extrabold text-[#FFA81F] uppercase tracking-wide">
                    Passions &amp; Hobbies
                  </span>
                  <div className="flex gap-2">
                    {content.about.passions.map((passion, idx) => (
                      <span key={idx} className="text-xs sm:text-sm bg-[#111111] px-3 py-1.5 rounded-lg border border-white/20 font-semibold">
                        {passion}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Detailed Bio + 4 Stats Counters */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#FFA81F]"></div>
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white/70 ml-1">
                  {content.about.sectionTag}
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white mb-5 leading-tight">
                {content.about.titlePrefix}{' '}
                <span className="text-[#FFA81F]">{content.about.highlightedName}</span>
                {content.about.titleSuffix} ✦
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-white/85 font-normal mb-4">
                {content.about.bioParagraph1}
              </p>
              <p className="text-base sm:text-lg leading-relaxed text-white/85 font-normal mb-7">
                {content.about.bioParagraph2}
              </p>

              {/* 4 Stat Counters - Fully Editable from Admin Panel */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7" data-purpose="stat-counter-grid">
                {content.about.stats.map((stat, idx) => (
                  <div
                    key={stat.id || idx}
                    className="bg-[#1A1A1A] border border-[#FFA81F]/40 rounded-3xl p-5 flex flex-col justify-center text-center hover:border-[#FFA81F] transition-colors shadow-lg"
                  >
                    <span className="font-heading text-4xl sm:text-5xl font-black text-[#FFA81F]">
                      {stat.digit}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mt-1.5">
                      {stat.label}
                    </span>
                    <span className="text-xs text-white/60">{stat.subtext}</span>
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  onClick={() => setCvModalOpen(true)}
                  className="w-full sm:w-auto inline-flex bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-black text-sm sm:text-base py-4 px-9 rounded-full items-center justify-center gap-3.5 shadow-xl transition-transform active:scale-95"
                >
                  <span>Request Detailed Academic CV</span>
                  <div className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs">
                    <Download className="w-3.5 h-3.5" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: AboutMeSection */}

      {/* BEGIN: EducationSection */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto" data-purpose="education-qualifications" id="education">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-5 border-b border-[#111111]/15 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FFA81F]"></div>
              <div className="w-3 h-3 rounded-full bg-[#111111]"></div>
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#111111]/70 ml-1">
                Academic Pedigree
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-[#111111] leading-tight">
              My <span className="text-[#FFA81F]">Education</span> Journey ✦
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#111111]/80 font-medium max-w-lg">
            Continuous academic development across prestigious universities and advanced degree credentials.
          </p>
        </div>

        {/* Dynamic Higher Education Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.education.map((edu, idx) => (
            <div
              key={edu.id || idx}
              className={`bg-white rounded-3xl p-7 shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow ${
                edu.statusType === 'pursuing' ? 'border-2 border-[#FFA81F]' : 'border border-[#111111]/15'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg ${
                      edu.statusType === 'pursuing'
                        ? 'bg-[#FFA81F] text-[#111111]'
                        : 'bg-[#111111] text-white'
                    }`}
                  >
                    {edu.scoreOrStatus}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#111111]/70">
                    {edu.level}
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#111111] mb-2.5">
                  {edu.degree}
                </h3>
                {edu.description && (
                  <p className="text-sm sm:text-base text-[#111111]/75 leading-relaxed mb-3">
                    {edu.description}
                  </p>
                )}
                {edu.highlight && (
                  <div className="text-sm bg-[#F5F1E8] p-4 rounded-2xl border border-[#111111]/10 text-[#111111]/85 font-medium mb-3">
                    {edu.highlight}
                  </div>
                )}
              </div>
              <div className="mt-5 pt-4 border-t border-[#111111]/15 flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-[#FFA81F]" />
                <span className="text-sm font-bold text-[#111111]/85">{edu.institution}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* END: EducationSection */}

      {/* BEGIN: ExperienceTimelineSection */}
      <section className="bg-[#111111] text-white py-20 px-4 sm:px-6" data-purpose="experience-timeline" id="experience">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-5 border-b border-white/15 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FFA81F]"></div>
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white/70 ml-1">
                  Career Milestones
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white leading-tight">
                Work <span className="text-[#FFA81F]">Experience</span> ✦
              </h2>
            </div>
            <p className="text-base sm:text-lg text-white/80 font-medium max-w-lg">
              20 years combining 19 years of accredited academic university teaching with 1 year of precision automotive instrumentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.experience.map((exp, idx) => (
              <div
                key={exp.id || idx}
                className={`bg-[#1A1A1A] p-7 rounded-3xl flex flex-col justify-between hover:border-[#FFA81F] transition-all shadow-xl ${
                  exp.type === 'academic' && idx === 0
                    ? 'border-2 border-[#FFA81F]'
                    : 'border border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider bg-[#FFA81F] text-[#111111] px-3.5 py-1.5 rounded-lg">
                      {exp.period}
                    </span>
                    <span className="text-xs text-white/60 font-mono">
                      {exp.department || 'Pune'}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-white mt-3">
                    {exp.role}
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-[#FFA81F] mt-1">
                    {exp.institution}
                  </p>
                  <p className="text-sm sm:text-base text-white/75 mt-3 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-white/60 font-mono">
                  <Briefcase className="w-3.5 h-3.5 text-[#FFA81F]" />
                  <span>{exp.type === 'academic' ? 'University Academic' : 'Industrial Trainee'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* END: ExperienceTimelineSection */}

      {/* BEGIN: ResearchPublicationsSection */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto" data-purpose="research-and-patents" id="research">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-5 border-b border-[#111111]/15 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FFA81F]"></div>
              <div className="w-3 h-3 rounded-full bg-[#111111]"></div>
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#111111]/70 ml-1">
                {content.research.sectionTag}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-[#111111] leading-tight">
              {content.research.titlePrefix}{' '}
              <span className="text-[#FFA81F]">{content.research.titleHighlight}</span> ✦
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#111111]/80 font-medium max-w-lg">
            {content.research.description}
          </p>
        </div>

        {/* 4 Research Stat Blocks - Fully Customizable */}
        {/* 4 Research Stat Blocks - Click to open PDF / Research Modal */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 mb-8">
          {content.research.stats.map((stat, idx) => (
            <div
              key={stat.id || idx}
              onClick={() => setSelectedResearchBox(stat)}
              className="cursor-pointer bg-white border-2 border-[#111111]/10 hover:border-[#FFA81F] p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden"
              title={`Click to view ${stat.label} research & PDF`}
            >
              {/* Highlight ribbon if PDF is attached */}
              {stat.pdfUrl && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FFA81F] via-amber-400 to-[#FFA81F]" />
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl font-heading shadow-md transition-transform group-hover:scale-105 ${
                      idx % 2 === 0
                        ? 'bg-[#FFA81F]/20 text-[#FFA81F]'
                        : 'bg-[#111111] text-[#FFA81F]'
                    }`}
                  >
                    {stat.digit}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#FFA81F] bg-[#FFA81F]/10 px-2.5 py-1 rounded-full border border-[#FFA81F]/30">
                    {stat.badge}
                  </span>
                </div>
                <div>
                  <span className="text-base sm:text-xl font-bold font-heading text-[#111111] block leading-tight group-hover:text-[#FFA81F] transition-colors">
                    {stat.label}
                  </span>
                  <span className="text-xs sm:text-sm text-[#111111]/70 block mt-1 leading-snug">
                    {stat.subtext}
                  </span>
                </div>
              </div>

              {/* Action indicator at bottom */}
              <div className="mt-4 pt-3 border-t border-[#111111]/10 flex items-center justify-between text-xs font-bold text-[#FFA81F] group-hover:translate-x-0.5 transition-transform">
                <span className="flex items-center gap-1.5 text-[#111111]/85 group-hover:text-[#FFA81F] font-heading font-extrabold text-[11px] sm:text-xs">
                  <FileText className="w-3.5 h-3.5 text-[#FFA81F]" />
                  <span>{stat.pdfUrl ? 'View PDF Paper' : 'View Research PDF'}</span>
                </span>
                <span className="text-[10px] bg-[#111111] text-[#FFA81F] px-2 py-0.5 rounded-full font-bold">
                  PDF ↗
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Dissertation Banner */}
        <div className="bg-[#111111] text-white p-7 sm:p-10 rounded-3xl border border-white/15 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm bg-[#FFA81F] text-[#111111] font-black px-4 py-1.5 rounded-full uppercase">
                {content.research.dissertation.badge}
              </span>
              <span className="text-xs sm:text-sm text-white/60 font-bold">
                {content.research.dissertation.tagline}
              </span>
            </div>
            <span className="text-xs sm:text-sm text-[#FFA81F] font-bold">
              {content.research.dissertation.indexFocus}
            </span>
          </div>
          <h3 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-white leading-snug">
            {content.research.dissertation.title}
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-white/80 mt-4 leading-relaxed max-w-5xl">
            {content.research.dissertation.description}
          </p>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-sm sm:text-base text-white/85">
              <Sparkles className="w-4 h-4 text-[#FFA81F]" />
              <span>{content.research.dissertation.footerNote}</span>
            </div>
            <button
              onClick={() => setPubsModalOpen(true)}
              className="text-sm sm:text-base font-bold text-[#FFA81F] hover:text-[#FFA81F]/80 flex items-center gap-2 transition-colors"
            >
              <span>Explore all papers &amp; citations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
      {/* END: ResearchPublicationsSection */}

      {/* BEGIN: FeaturedYouTubeVideoSection (Compact / Balanced Sized Player) */}
      <section
        className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto"
        data-purpose="featured-youtube-video"
        id="video"
      >
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-[#111111]/15 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFA81F]"></div>
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#111111]/70 ml-1">
                {content.featuredVideo.sectionTag}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[#111111] leading-tight">
              {content.featuredVideo.titlePrefix}{' '}
              <span className="text-[#FFA81F]">{content.featuredVideo.titleHighlight}</span> ✦
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#111111]/80 font-medium max-w-sm">
            {content.featuredVideo.description}
          </p>
        </div>

        {/* Sized & Compact Cinema Video Box */}
        <div
          className={`mx-auto bg-[#111111] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-white/15 shadow-2xl relative overflow-hidden group ${
            content.featuredVideo.boxSize === 'compact'
              ? 'max-w-xl'
              : content.featuredVideo.boxSize === 'large'
              ? 'max-w-5xl'
              : 'max-w-3xl'
          }`}
        >
          {/* Subtle Ambient Glow Effect */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#FFA81F]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Video Header Bar */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black shadow-md flex-shrink-0">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] sm:text-xs uppercase font-black text-[#FFA81F] tracking-wider bg-[#FFA81F]/10 px-2.5 py-0.5 rounded-full border border-[#FFA81F]/30">
                    {content.featuredVideo.badge}
                  </span>
                  {content.featuredVideo.viewsOrDuration && (
                    <span className="text-[11px] text-white/50 font-mono hidden sm:inline">
                      • {content.featuredVideo.viewsOrDuration}
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg md:text-xl text-white mt-1 leading-snug">
                  {content.featuredVideo.videoTitle}
                </h3>
              </div>
            </div>

            <a
              href={content.featuredVideo.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white font-heading font-bold text-xs py-2 px-4 rounded-full inline-flex items-center gap-1.5 shadow-md transition-all active:scale-95 flex-shrink-0 self-start sm:self-auto"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Watch on YouTube</span>
            </a>
          </div>

          {/* Sized 16:9 Cinema Video Player Box */}
          <div className="relative z-10 w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 bg-black shadow-xl">
            {content.featuredVideo.youtubeUrl ? (
              <iframe
                src={getYouTubeEmbedUrl(content.featuredVideo.youtubeUrl)}
                title={content.featuredVideo.videoTitle}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="eager"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0f0f0f] text-white/50">
                <div className="w-14 h-14 rounded-2xl bg-red-600/20 flex items-center justify-center">
                  <Play className="w-7 h-7 text-red-500 fill-current ml-1" />
                </div>
                <p className="text-sm font-semibold">Add your YouTube link in Admin Studio</p>
                <p className="text-xs text-white/30">Press Ctrl+Shift+A → Video Lectures section</p>
              </div>
            )}
          </div>

          {/* Bottom Caption & Highlights */}
          <div className="relative z-10 mt-3.5 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white/80">
            <div className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed">
              <Sparkles className="w-4 h-4 text-[#FFA81F] flex-shrink-0 mt-0.5" />
              <span>{content.featuredVideo.caption}</span>
            </div>
            <span className="text-[11px] text-white/40 font-mono flex-shrink-0 self-end sm:self-auto">
              Interactive Video Showcase
            </span>
          </div>
        </div>
      </section>
      {/* END: FeaturedYouTubeVideoSection */}

      {/* BEGIN: AwardsSection */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto" data-purpose="honors-and-awards" id="awards">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FFA81F]"></div>
          <div className="w-3 h-3 rounded-full bg-[#111111]"></div>
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#111111]/70 ml-1">
            Distinctions &amp; Honors
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-[#111111] mb-8 leading-tight">
          Awards &amp; <span className="text-[#FFA81F]">Recognition</span> ✦
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {content.awards.map((award, idx) => (
            <div
              key={award.id || idx}
              className="bg-white border-2 border-[#111111]/10 hover:border-[#FFA81F] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              {award.imageUrl ? (
                /* Premium Certificate / Trophy Photo Showcase */
                <div
                  onClick={() => setSelectedAwardModal(award)}
                  className="relative w-full h-56 sm:h-64 overflow-hidden bg-[#111111]/5 border-b border-[#111111]/10 cursor-pointer group/img"
                  title="Click to view full certificate"
                >
                  <img
                    src={award.imageUrl}
                    alt={award.title}
                    className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                    <span className="bg-[#FFA81F] text-[#111111] font-heading font-black text-xs sm:text-sm px-4 py-2 rounded-full shadow-xl flex items-center gap-1.5 transform translate-y-2 group-hover/img:translate-y-0 transition-transform">
                      <span>View Full Certificate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  {/* Category Pill Tag */}
                  <div className="absolute top-3.5 left-3.5 bg-[#111111]/90 backdrop-blur-md text-[#FFA81F] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-[#FFA81F]/40 shadow-md">
                    {award.category}
                  </div>
                  <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#FFA81F] text-[#111111] flex items-center justify-center shadow-md">
                    <Award className="w-4 h-4 text-[#111111]" />
                  </div>
                </div>
              ) : (
                /* Elegant Top Header when no certificate image is uploaded yet */
                <div className="p-6 pb-4 flex items-center justify-between border-b border-[#111111]/10 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent">
                  <span className="text-xs font-black uppercase text-[#FFA81F] tracking-wider bg-[#111111] px-3.5 py-1.5 rounded-lg shadow-sm">
                    {award.category}
                  </span>
                  <div className="w-11 h-11 rounded-2xl bg-[#FFA81F]/20 text-[#FFA81F] flex items-center justify-center shadow-inner">
                    <Award className="w-6 h-6 text-[#FFA81F]" />
                  </div>
                </div>
              )}

              {/* Award Details Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-heading font-black text-lg sm:text-xl text-[#111111] group-hover:text-[#FFA81F] transition-colors leading-snug">
                    {award.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-[#FFA81F] mt-2 flex items-center gap-1.5">
                    <Medal className="w-3.5 h-3.5 text-[#FFA81F]" />
                    <span>{award.organization}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-[#111111]/75 mt-3 leading-relaxed">
                    {award.description}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-[#111111]/10 flex items-center justify-between">
                  {award.imageUrl ? (
                    <button
                      onClick={() => setSelectedAwardModal(award)}
                      className="text-xs sm:text-sm font-black text-[#111111] hover:text-[#FFA81F] flex items-center gap-1.5 transition-colors cursor-pointer group-hover:translate-x-1"
                    >
                      <span>Inspect Credential &amp; Photo</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FFA81F]" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setAdminAuthenticated(true);
                        setAdminStudioOpen(true);
                      }}
                      className="text-xs font-bold text-[#111111]/60 hover:text-[#FFA81F] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Upload Certificate Photo</span>
                      <ArrowRight className="w-3 h-3 text-[#FFA81F]" />
                    </button>
                  )}
                  <span className="text-[11px] font-mono text-[#111111]/50 uppercase tracking-wider font-bold">
                    Accredited
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* END: AwardsSection */}

      {/* BEGIN: AdministrativeLeadership Section */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto" data-purpose="administrative-roles" id="examination">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FFA81F]"></div>
          <div className="w-3 h-3 rounded-full bg-[#111111]"></div>
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#111111]/70 ml-1">
            {content.examCoordinator.sectionTag}
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-[#111111] mb-8 leading-tight">
          {content.examCoordinator.titlePrefix}{' '}
          <span className="text-[#FFA81F]">{content.examCoordinator.titleHighlight}</span> ✦
        </h2>

        {/* Master Leadership Card */}
        <div className="bg-white border border-[#111111]/15 rounded-3xl p-7 sm:p-9 shadow-md mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-black uppercase bg-[#111111] text-white px-4 py-1.5 rounded-lg">
                {content.examCoordinator.periodBadge}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#FFA81F]">
                {content.examCoordinator.departmentBadge}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#111111]/70">
              {content.examCoordinator.campusAdminText}
            </span>
          </div>
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#111111]">
            {content.examCoordinator.roleTitle}
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-[#111111]/80 mt-3 leading-relaxed max-w-5xl">
            {content.examCoordinator.description}
          </p>
        </div>

        {/* 4 Pillars of Leadership - Fully Customizable */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {content.examCoordinator.pillars.map((pillar, idx) => (
            <div
              key={pillar.id || idx}
              className="bg-white border border-[#111111]/15 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md hover:border-[#FFA81F] transition-all flex flex-col justify-between group"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#FFA81F]/20 flex items-center justify-center text-[#FFA81F] text-lg flex-shrink-0 mb-3 shadow-inner group-hover:scale-105 transition-transform">
                {idx === 0 && <ShieldCheck className="w-5 h-5 text-[#FFA81F]" />}
                {idx === 1 && <GraduationCap className="w-5 h-5 text-[#FFA81F]" />}
                {idx === 2 && <FileCheck className="w-5 h-5 text-[#FFA81F]" />}
                {idx === 3 && <Users className="w-5 h-5 text-[#FFA81F]" />}
              </div>
              <div>
                <span className="font-heading font-bold text-sm sm:text-base text-[#111111] block leading-tight">
                  {pillar.title}
                </span>
                <span className="text-[11px] sm:text-xs text-[#111111]/65 font-medium block mt-1">
                  {pillar.subtext}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* END: AdministrativeLeadership */}

      {/* BEGIN: ContactFooterSection */}
      <footer
        className="bg-[#111111] text-white pt-20 pb-12 px-4 sm:px-6 rounded-t-[54px] border-t-4 border-[#FFA81F] mt-16"
        data-purpose="contact-and-footer"
        id="contact"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2.5 bg-white/10 px-4 py-1.5 rounded-full text-xs sm:text-sm text-[#FFA81F] font-extrabold mb-3.5">
              <Mail className="w-4 h-4" />
              <span>{content.contact.sectionTag}</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-heading font-extrabold text-white">
              {content.contact.titlePrefix}{' '}
              <span className="text-[#FFA81F]">{content.contact.titleHighlight}</span> ✦
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/75 mt-3 max-w-2xl mx-auto">
              {content.contact.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
            {/* Left 5 Cols: Contact Information */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white/5 border border-white/15 rounded-3xl p-6 sm:p-7">
                <h4 className="text-sm sm:text-base font-heading font-bold text-[#FFA81F] uppercase tracking-wider mb-5">
                  Contact Information
                </h4>
                <div className="space-y-5">
                  <a className="flex items-center gap-4 group" href={`mailto:${content.contact.email}`}>
                    <div className="w-12 h-12 rounded-full bg-[#FFA81F] text-[#111111] flex items-center justify-center text-base font-bold group-hover:scale-105 transition-transform flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#111111]" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs text-white/60 uppercase block font-extrabold">Official Email Address</span>
                      <span className="text-sm sm:text-base font-semibold text-white group-hover:text-[#FFA81F] transition-colors truncate block">
                        {content.contact.email}
                      </span>
                    </div>
                  </a>

                  <a className="flex items-center gap-4 group" href={`tel:${content.contact.phone}`}>
                    <div className="w-12 h-12 rounded-full bg-[#FFA81F] text-[#111111] flex items-center justify-center text-base font-bold group-hover:scale-105 transition-transform flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#111111]" />
                    </div>
                    <div>
                      <span className="text-xs text-white/60 uppercase block font-extrabold">Phone Contact</span>
                      <span className="text-sm sm:text-base font-semibold text-white group-hover:text-[#FFA81F] transition-colors">
                        {content.contact.phone}
                      </span>
                    </div>
                  </a>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FFA81F] text-[#111111] flex items-center justify-center text-base font-bold flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#111111]" />
                    </div>
                    <div>
                      <span className="text-xs text-white/60 uppercase block font-extrabold">Campus Location</span>
                      <span className="text-sm sm:text-base font-semibold text-white">
                        {content.contact.location}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                    <a
                      href={content.contact.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white/10 hover:bg-[#0077b5] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-white/10 shadow-sm"
                    >
                      <Linkedin className="w-4 h-4 text-white" />
                      <span>LinkedIn Profile</span>
                    </a>
                    <a
                      href={content.contact.youtubeUrl || content.featuredVideo?.youtubeUrl || 'https://www.youtube.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white/10 hover:bg-[#FF0000] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-white/10 shadow-sm"
                    >
                      <Youtube className="w-4 h-4 text-white" />
                      <span>YouTube Channel</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Direct Message Form */}
            <div className="lg:col-span-7 bg-white/5 border border-white/15 rounded-3xl p-6 sm:p-9">
              <h4 className="text-lg sm:text-xl font-heading font-bold text-white mb-2">
                Send an Inquiry or Academic Message
              </h4>
              <p className="text-xs sm:text-sm text-white/70 mb-6">
                Direct transmission to Mrs. Smita Pawar's faculty coordination inbox.
              </p>

              {formSubmitted ? (
                <div className="bg-[#FFA81F]/20 border border-[#FFA81F] rounded-2xl p-6 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#FFA81F] mx-auto" />
                  <h4 className="font-heading font-extrabold text-xl text-white">Message Dispatched!</h4>
                  <p className="text-sm text-white/80">
                    Thank you. Your default email client has been prepared with your inquiry details.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="mt-3 bg-[#FFA81F] text-[#111111] font-bold text-xs py-2 px-5 rounded-full"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setFormSubmitted(true);
                  // Save inquiry to Hostinger MySQL database (contact_messages table)
                  submitContactMessage({
                    name: formState.name,
                    email: formState.email,
                    category: formState.category,
                    message: formState.message
                  });
                  setTimeout(() => {
                    window.location.href = `mailto:${content.contact.email}?subject=${encodeURIComponent(
                      `Inquiry from ${formState.name} - ${formState.category}`
                    )}&body=${encodeURIComponent(
                      `Name: ${formState.name}\nEmail: ${formState.email}\nCategory: ${formState.category}\n\nMessage:\n${formState.message}`
                    )}`;
                  }, 1200);
                }} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/80 block mb-1.5 font-bold">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Dr. / Prof. / Scholar"
                        className="w-full bg-white/10 text-white placeholder-white/40 text-sm rounded-xl border border-white/20 px-4 py-3 focus:outline-none focus:border-[#FFA81F]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/80 block mb-1.5 font-bold">Your Email Address</label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="colleague@institution.edu"
                        className="w-full bg-white/10 text-white placeholder-white/40 text-sm rounded-xl border border-white/20 px-4 py-3 focus:outline-none focus:border-[#FFA81F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-white/80 block mb-1.5 font-bold">Inquiry Category</label>
                    <select
                      value={formState.category}
                      onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                      className="w-full bg-[#1A1A1A] text-white text-sm rounded-xl border border-white/20 px-4 py-3 focus:outline-none focus:border-[#FFA81F]"
                    >
                      <option value="Research Collaboration">Research &amp; Patent Collaboration</option>
                      <option value="Guest Lecture & Workshop">Guest Lecture &amp; FDP Workshop</option>
                      <option value="Student Mentorship">Student Mentorship &amp; Counseling</option>
                      <option value="Examination Advisory">Examination &amp; Accreditation Advisory</option>
                      <option value="General Inquiry">General Academic Correspondence</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-white/80 block mb-1.5 font-bold">Message Content</label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Outline your research topic, lecture request, or academic inquiry..."
                      className="w-full bg-white/10 text-white placeholder-white/40 text-sm rounded-xl border border-white/20 px-4 py-3 focus:outline-none focus:border-[#FFA81F]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-heading font-black text-sm py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-transform active:scale-95"
                  >
                    <span>Transmit Direct Inquiry</span>
                    <Send className="w-4 h-4 text-[#111111]" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom Copyright & Footer Navigation */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-4 text-xs sm:text-sm text-white/70">
              <a className="hover:text-[#FFA81F] transition-colors" href="#hero">
                Home
              </a>
              <a className="hover:text-[#FFA81F] transition-colors" href="#about">
                About
              </a>
              <a className="hover:text-[#FFA81F] transition-colors" href="#education">
                Education
              </a>
              <a className="hover:text-[#FFA81F] transition-colors" href="#experience">
                Experience
              </a>
              <a className="hover:text-[#FFA81F] transition-colors" href="#research">
                Research
              </a>
              <a className="hover:text-[#FFA81F] transition-colors" href="#contact">
                Contact
              </a>
              <button
                onClick={() => {
                  if (adminAuthenticated) {
                    setAdminStudioOpen(true);
                  } else {
                    setAdminModalOpen(true);
                  }
                }}
                className="text-[#FFA81F] hover:underline font-bold flex items-center gap-1"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Admin Studio</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-white/50">
              © 2026 {content.hero.fullName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      {/* END: ContactFooterSection */}

      {/* Floating Admin Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            if (adminAuthenticated) {
              setAdminStudioOpen(true);
            } else {
              setAdminModalOpen(true);
            }
          }}
          className="bg-[#111111]/95 hover:bg-[#111111] text-white border-2 border-[#FFA81F] shadow-2xl px-4 py-2.5 rounded-full flex items-center gap-2.5 text-xs sm:text-sm font-extrabold backdrop-blur-md active:scale-95 transition-all group hover:shadow-[#FFA81F]/30"
          title="Open Website Customizer & Admin Studio"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFA81F] animate-pulse"></span>
          <Settings className="w-4 h-4 text-[#FFA81F] group-hover:rotate-45 transition-transform" />
          <span>Admin Panel</span>
          <span className="bg-[#FFA81F] text-[#111111] text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase">
            Edit
          </span>
        </button>
      </div>

      {/* Admin Passcode Modal - Larger & Clearer */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#181818] text-white border-2 border-white/20 rounded-3xl max-w-lg w-full p-8 sm:p-10 shadow-2xl relative">
            <button
              onClick={() => {
                setAdminModalOpen(false);
                setAdminPasswordError(false);
              }}
              className="absolute top-6 right-6 text-white/60 hover:text-white p-2 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#FFA81F] text-[#111111] flex items-center justify-center font-black shadow-xl">
                <Lock className="w-7 h-7 text-[#111111]" />
              </div>
              <div>
                <h3 className="font-heading font-black text-2xl text-white">Admin Studio Login</h3>
                <p className="text-sm text-white/70 mt-0.5">Customize website texts, 4-box grids &amp; photos</p>
              </div>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div>
                <label className="text-sm text-white font-bold block mb-2">
                  Enter Admin Passcode (Default: <code className="text-[#FFA81F] font-bold">admin123</code>)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      setAdminPasswordError(false);
                    }}
                    placeholder="Enter passcode or click quick enter below"
                    className="w-full bg-[#111111] text-white placeholder-white/40 text-base sm:text-lg rounded-xl border-2 border-white/20 px-4 py-3.5 focus:outline-none focus:border-[#FFA81F]"
                  />
                  <Key className="w-5 h-5 text-white/40 absolute right-4 top-4" />
                </div>
                {adminPasswordError && (
                  <p className="text-sm text-red-400 mt-2 font-bold">
                    Incorrect passcode. Default is <span className="underline">admin123</span>
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-heading font-black text-base py-4 rounded-xl transition-transform active:scale-95 shadow-xl cursor-pointer"
                >
                  Unlock Admin Studio
                </button>

                <button
                  type="button"
                  onClick={handleDirectAdminOpen}
                  className="w-full bg-white/10 hover:bg-white/20 text-white text-sm font-bold py-3 rounded-xl transition-colors border border-white/15 cursor-pointer"
                >
                  Quick Enter Without Passcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Admin Panel Studio Component */}
      <AdminPanel
        isOpen={adminStudioOpen}
        onClose={() => setAdminStudioOpen(false)}
        content={content}
        onSave={handleSaveContent}
        onReset={handleResetContent}
      />

      {/* CV Request Modal */}
      {cvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111111] text-white border border-white/20 rounded-3xl max-w-lg w-full p-7 sm:p-9 shadow-2xl relative">
            <button
              onClick={() => {
                setCvModalOpen(false);
                setCvRequested(false);
              }}
              className="absolute top-5 right-5 text-white/60 hover:text-white"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-full bg-[#FFA81F] text-[#111111] flex items-center justify-center font-bold">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-xl text-white">Request Academic CV</h3>
                <p className="text-xs sm:text-sm text-white/70">
                  {content.hero.fullName} – {content.hero.pill.expText} Profile
                </p>
              </div>
            </div>

            {cvRequested ? (
              <div className="bg-white/10 p-6 rounded-2xl text-center space-y-2.5">
                <CheckCircle2 className="w-9 h-9 text-[#FFA81F] mx-auto" />
                <h4 className="font-bold text-base">Request Dispatched</h4>
                <p className="text-sm text-white/80">
                  Your mail client has been opened to send the CV request directly to {content.contact.email}.
                </p>
                <button
                  onClick={() => setCvModalOpen(false)}
                  className="mt-3 bg-[#FFA81F] text-[#111111] font-bold text-sm py-2.5 px-6 rounded-full"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                setCvRequested(true);
                // Save CV request to Hostinger MySQL database (cv_requests table)
                submitCvRequest(cvEmail);
                setTimeout(() => {
                  window.location.href = `mailto:${content.contact.email}?subject=${encodeURIComponent(
                    `Request for Academic CV - ${content.hero.fullName}`
                  )}&body=${encodeURIComponent(
                    `Dear ${content.hero.fullName},\n\nI would like to request a detailed copy of your academic CV.\n\nMy email: ${cvEmail}`
                  )}`;
                }, 1000);
              }} className="space-y-4">
                <p className="text-sm text-white/85 leading-relaxed">
                  Enter your email address or institutional affiliation to receive the verified comprehensive CV covering publications, patent filings, course dossiers, and academic credentials.
                </p>
                <div>
                  <label className="text-xs sm:text-sm text-white/80 block mb-1.5 font-semibold">Your Email Address</label>
                  <input
                    type="email"
                    required
                    value={cvEmail}
                    onChange={(e) => setCvEmail(e.target.value)}
                    placeholder="colleague@institution.edu"
                    className="w-full bg-white/10 text-white placeholder-white/40 text-sm sm:text-base rounded-xl border border-white/20 px-4 py-3.5 focus:outline-none focus:border-[#FFA81F]"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCvModalOpen(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold text-sm py-3.5 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-black text-sm py-3.5 rounded-xl transition-transform active:scale-95"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Publications Details Modal */}
      {pubsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111111] text-white border border-white/20 rounded-3xl max-w-2xl w-full p-7 sm:p-9 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setPubsModalOpen(false)}
              className="absolute top-5 right-5 text-white/60 hover:text-white"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FFA81F] text-[#111111] flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-2xl text-white">Publications &amp; Intellectual Property</h3>
                <p className="text-xs sm:text-sm text-white/70">Peer-Reviewed Journals, Patents &amp; National Copyrights</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/15 rounded-2xl p-5">
                <span className="text-xs font-bold text-[#FFA81F] uppercase tracking-wider block mb-1.5">
                  Published Patent (India)
                </span>
                <h4 className="font-bold text-base sm:text-lg text-white">
                  Intelligent Energy-Conserving Sensor Transmission Routing for Multi-Hop Wireless Networks
                </h4>
                <p className="text-sm text-white/75 mt-1.5 leading-relaxed">
                  Official Patent Journal Published. Focuses on MAC-layer scheduling for reducing latency in high packet density environments.
                </p>
              </div>

              <div className="bg-white/5 border border-white/15 rounded-2xl p-5">
                <span className="text-xs font-bold text-[#FFA81F] uppercase tracking-wider block mb-1.5">
                  Registered Copyright (Govt. of India)
                </span>
                <h4 className="font-bold text-base sm:text-lg text-white">
                  Curricular Pedagogical Framework for Integrated VLSI and Embedded System Laboratory Protocols
                </h4>
                <p className="text-sm text-white/75 mt-1.5 leading-relaxed">
                  Registered intellectual work covering student instructional manuals and FPGA evaluation rubrics.
                </p>
              </div>

              <div className="bg-white/5 border border-white/15 rounded-2xl p-5">
                <span className="text-xs font-bold text-[#FFA81F] uppercase tracking-wider block mb-1.5">
                  Selected Scopus &amp; Peer-Reviewed Papers
                </span>
                <ul className="text-sm text-white/85 space-y-2.5 mt-2.5 list-disc list-inside leading-relaxed">
                  <li>
                    <span className="font-bold text-white">QoS-Driven MAC Protocol:</span> Performance benchmark and latency mitigation in Wireless Multimedia Sensor Networks.
                  </li>
                  <li>
                    <span className="font-bold text-white">FPGA Prototyping:</span> Hardware acceleration for cryptographic verification in low-power IoT gateways.
                  </li>
                  <li>
                    <span className="font-bold text-white">Transistor Biasing &amp; Synthesis:</span> Analytical models for nanoscale CMOS operational amplifiers.
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-7 pt-5 border-t border-white/15 flex justify-end">
              <button
                onClick={() => setPubsModalOpen(false)}
                className="bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-bold text-sm py-3 px-7 rounded-full shadow-md cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate / Award Lightbox Modal */}
      {selectedAwardModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-[#141414] text-white border-2 border-white/20 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setSelectedAwardModal(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
              aria-label="Close certificate modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-5 pr-12">
              <div className="w-12 h-12 rounded-2xl bg-[#FFA81F] text-[#111111] flex items-center justify-center font-black shadow-lg flex-shrink-0">
                <Award className="w-6 h-6 text-[#111111]" />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold text-[#FFA81F] tracking-wider block">
                  {selectedAwardModal.category}
                </span>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-white leading-tight">
                  {selectedAwardModal.title}
                </h3>
              </div>
            </div>

            {selectedAwardModal.imageUrl && (
              <div className="rounded-2xl overflow-hidden border-2 border-white/15 bg-black/60 mb-5 shadow-2xl flex items-center justify-center p-2 max-h-[58vh]">
                <img
                  src={selectedAwardModal.imageUrl}
                  alt={selectedAwardModal.title}
                  className="w-full h-auto max-h-[55vh] object-contain rounded-xl"
                />
              </div>
            )}

            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs text-white/50 uppercase tracking-wider font-mono block">
                Issuing Organization &amp; Authority
              </span>
              <p className="text-base font-bold text-[#FFA81F]">
                {selectedAwardModal.organization}
              </p>
              <p className="text-sm text-white/85 leading-relaxed pt-1">
                {selectedAwardModal.description}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedAwardModal(null)}
                className="bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-heading font-black text-sm py-3 px-8 rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                Close Certificate View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Research PDF & Publications Modal */}
      {selectedResearchBox && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-[#141414] text-white border-2 border-white/20 rounded-3xl max-w-5xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[95vh] flex flex-col overflow-hidden">
            {/* Top Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3 sm:gap-4 pr-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFA81F] text-[#111111] flex items-center justify-center font-heading font-black text-xl sm:text-2xl shadow-lg flex-shrink-0">
                  {selectedResearchBox.digit}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold text-[#FFA81F] tracking-wider bg-[#FFA81F]/10 px-2.5 py-0.5 rounded-full border border-[#FFA81F]/30">
                      {selectedResearchBox.badge}
                    </span>
                    <span className="text-xs text-white/50 font-mono">
                      Research Output
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-xl sm:text-2xl md:text-3xl text-white leading-tight mt-0.5">
                    {selectedResearchBox.label}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedResearchBox.pdfUrl && (
                  <a
                    href={selectedResearchBox.pdfUrl}
                    download={selectedResearchBox.pdfFileName || `${selectedResearchBox.label}-Research.pdf`}
                    className="hidden sm:inline-flex bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-heading font-black text-xs sm:text-sm py-2 px-4 rounded-full items-center gap-1.5 shadow-md transition-all active:scale-95"
                    title="Download this PDF document"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </a>
                )}
                <button
                  onClick={() => setSelectedResearchBox(null)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close research modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Info Subheading */}
            <div className="py-3 px-1 flex-shrink-0">
              <h4 className="text-base sm:text-lg font-bold text-[#FFA81F]">
                {selectedResearchBox.documentTitle || `${selectedResearchBox.label} Documentation & Scholarly Dossier`}
              </h4>
              <p className="text-xs sm:text-sm text-white/75 mt-0.5 leading-relaxed">
                {selectedResearchBox.documentDescription || selectedResearchBox.subtext}
              </p>
            </div>

            {/* Modal Body: Either PDF Viewer iframe OR Categorized Research Papers */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {selectedResearchBox.pdfUrl ? (
                /* Interactive PDF Viewer Embed */
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-white/5 p-3 rounded-2xl border border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="font-bold text-emerald-300">
                        {selectedResearchBox.pdfFileName || `${selectedResearchBox.label}-Document.pdf`}
                      </span>
                      {selectedResearchBox.pdfFileSize && (
                        <span className="text-white/60 font-mono">
                          ({selectedResearchBox.pdfFileSize})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={selectedResearchBox.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open in New Tab</span>
                      </a>
                      <a
                        href={selectedResearchBox.pdfUrl}
                        download={selectedResearchBox.pdfFileName || `${selectedResearchBox.label}-Research.pdf`}
                        className="bg-[#FFA81F] text-[#111111] hover:bg-[#E59415] px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Save Document</span>
                      </a>
                    </div>
                  </div>

                  <div className="rounded-2xl overflow-hidden border-2 border-white/15 bg-neutral-900 shadow-2xl h-[58vh] sm:h-[64vh]">
                    <iframe
                      src={selectedResearchBox.pdfUrl}
                      className="w-full h-full rounded-2xl"
                      title={`${selectedResearchBox.label} Research PDF`}
                    />
                  </div>
                </div>
              ) : (
                /* Default Interactive Academic Dossier when no custom PDF uploaded yet */
                <div className="space-y-4">
                  <div className="bg-[#FFA81F]/10 border border-[#FFA81F]/30 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FFA81F] text-[#111111] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black uppercase text-[#FFA81F] tracking-wider block">
                          PDF Document Slot Ready
                        </span>
                        <p className="text-xs sm:text-sm text-white/85">
                          You can upload your official research PDF (2MB–20MB) anytime in Portfolio Admin Studio &gt; Research &amp; Publications.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedResearchBox(null);
                        setAdminAuthenticated(true);
                        setAdminStudioOpen(true);
                      }}
                      className="bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] text-xs font-bold px-4 py-2 rounded-full flex-shrink-0 transition-transform active:scale-95 cursor-pointer"
                    >
                      Upload PDF in Admin Studio
                    </button>
                  </div>

                  {/* Curated list based on category */}
                  <div className="space-y-3">
                    {selectedResearchBox.label.toLowerCase().includes('journal') && (
                      <div className="space-y-3">
                        <span className="text-xs font-mono uppercase text-[#FFA81F] tracking-wider block">
                          Verified Published Scopus &amp; Peer-Reviewed Papers
                        </span>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-1.5">
                          <span className="text-[11px] font-bold text-[#FFA81F] uppercase tracking-wider block">
                            Paper #1 • Scopus Indexed
                          </span>
                          <h5 className="font-bold text-white text-sm sm:text-base">
                            A Quality of Service (QoS) Based Priority MAC Scheduling Algorithm for Wireless Multimedia Sensor Networks
                          </h5>
                          <p className="text-xs sm:text-sm text-white/75">
                            International Journal of Advanced Computing &amp; Communications, Vol. 14, Issue 3. Evaluates real-time packet latency reduction.
                          </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-1.5">
                          <span className="text-[11px] font-bold text-[#FFA81F] uppercase tracking-wider block">
                            Paper #2 • Peer-Reviewed
                          </span>
                          <h5 className="font-bold text-white text-sm sm:text-base">
                            Performance Evaluation and Buffer Dimensioning of Cross-Layer Routing in Dense WMSN Topologies
                          </h5>
                          <p className="text-xs sm:text-sm text-white/75">
                            Journal of Wireless Sensor Systems &amp; IoT Architectures. Focuses on packet drop prevention under high multimedia load.
                          </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-1.5">
                          <span className="text-[11px] font-bold text-[#FFA81F] uppercase tracking-wider block">
                            Paper #3 • VLSI Architecture
                          </span>
                          <h5 className="font-bold text-white text-sm sm:text-base">
                            Energy-Efficient Nanoscale CMOS Transistor Modeling for Low-Power Biomedical Sensor Nodes
                          </h5>
                          <p className="text-xs sm:text-sm text-white/75">
                            VLSI Design Journal of Semiconductor Devices. Mathematical synthesis of sub-micron operational amplifiers.
                          </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-1.5">
                          <span className="text-[11px] font-bold text-[#FFA81F] uppercase tracking-wider block">
                            Paper #4 • Scopus Indexed
                          </span>
                          <h5 className="font-bold text-white text-sm sm:text-base">
                            Hardware Accelerated Cryptographic Routines on FPGA for Industrial Wireless Sensor Gateways
                          </h5>
                          <p className="text-xs sm:text-sm text-white/75">
                            International Journal of Embedded Engineering &amp; Computing. Implemented on Xilinx Artix-7 platform.
                          </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-1.5">
                          <span className="text-[11px] font-bold text-[#FFA81F] uppercase tracking-wider block">
                            Paper #5 &amp; #6 • Wireless &amp; Pedagogy
                          </span>
                          <h5 className="font-bold text-white text-sm sm:text-base">
                            Dynamic Duty-Cycle Optimization in Multi-Hop WSN &amp; Pedagogical Innovations in Outcome-Based Education
                          </h5>
                          <p className="text-xs sm:text-sm text-white/75">
                            Journal of Engineering Education &amp; Telecommunication Systems.
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedResearchBox.label.toLowerCase().includes('conference') && (
                      <div className="space-y-3">
                        <span className="text-xs font-mono uppercase text-[#FFA81F] tracking-wider block">
                          Selected International &amp; National Conference Presentations
                        </span>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-1.5">
                          <span className="text-[11px] font-bold text-[#FFA81F] uppercase tracking-wider block">
                            IEEE Conference #1 • Global
                          </span>
                          <h5 className="font-bold text-white text-sm sm:text-base">
                            IEEE International Conference on Computing, Communication, Control &amp; Automation (ICCUBEA)
                          </h5>
                          <p className="text-xs sm:text-sm text-white/75">
                            Presented research on Latency-Aware Buffer Management in Sensor Transceivers.
                          </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-1.5">
                          <span className="text-[11px] font-bold text-[#FFA81F] uppercase tracking-wider block">
                            IEEE Conference #2 • Pune
                          </span>
                          <h5 className="font-bold text-white text-sm sm:text-base">
                            IEEE International Conference on Emerging Trends in Electronics and Telecommunication
                          </h5>
                          <p className="text-xs sm:text-sm text-white/75">
                            Comparative study of IEEE 802.15.4 MAC Layer protocols for voice and video streaming over sensor nodes.
                          </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-1.5">
                          <span className="text-[11px] font-bold text-[#FFA81F] uppercase tracking-wider block">
                            National Conferences (8 Papers)
                          </span>
                          <p className="text-xs sm:text-sm text-white/75">
                            Presented at national technical symposia including MIT Alandi, COEP Pune, and Sandip University Nashik covering VLSI circuit simulations, Verilog HDL synthesis, and pedagogical transformation.
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedResearchBox.label.toLowerCase().includes('patent') && (
                      <div className="space-y-3">
                        <span className="text-xs font-mono uppercase text-[#FFA81F] tracking-wider block">
                          Official Patent Gazette Publications (IP India)
                        </span>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#FFA81F] uppercase tracking-wider">
                              Patent #1 • Published IP
                            </span>
                            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded">
                              App No: 202121045892 A
                            </span>
                          </div>
                          <h5 className="font-bold text-white text-sm sm:text-base">
                            Intelligent Energy-Conserving Sensor Transmission Routing for Multi-Hop Wireless Networks
                          </h5>
                          <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                            Official Patent Office Journal Published. Covers adaptive MAC-layer duty-cycle scheduling for reducing packet delay in multi-hop multimedia nodes.
                          </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#FFA81F] uppercase tracking-wider">
                              Patent #2 • Published IP
                            </span>
                            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded">
                              App No: 202221038114 A
                            </span>
                          </div>
                          <h5 className="font-bold text-white text-sm sm:text-base">
                            VLSI Circuit Architecture for Low-Power Packet Compression in IoT Sensor Transceivers
                          </h5>
                          <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                            Official Patent Office Journal Published. Implements hardware-efficient encoding logic to lower transmission power consumption.
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedResearchBox.label.toLowerCase().includes('copyright') && (
                      <div className="space-y-3">
                        <span className="text-xs font-mono uppercase text-[#FFA81F] tracking-wider block">
                          Government of India Registered Copyright
                        </span>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#FFA81F] uppercase tracking-wider">
                              Copyright #1 • Registered Literary Work
                            </span>
                            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded">
                              Reg No: L-102948/2023
                            </span>
                          </div>
                          <h5 className="font-bold text-white text-sm sm:text-base">
                            Curricular Pedagogical Framework for Integrated VLSI and Embedded System Laboratory Protocols
                          </h5>
                          <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                            Statutorily registered educational intellectual property comprising hands-on laboratory rubrics, FPGA synthesis workflows, and student assessment frameworks.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Modal Actions */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between flex-shrink-0">
              <span className="text-xs text-white/50 font-mono hidden sm:inline">
                Mrs. Smita S. Pawar Academic Portfolio
              </span>
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                {selectedResearchBox.pdfUrl && (
                  <a
                    href={selectedResearchBox.pdfUrl}
                    download={selectedResearchBox.pdfFileName || `${selectedResearchBox.label}-Research.pdf`}
                    className="sm:hidden bg-[#FFA81F] text-[#111111] font-heading font-black text-xs py-2.5 px-4 rounded-full flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                )}
                <button
                  onClick={() => setSelectedResearchBox(null)}
                  className="bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-heading font-black text-sm py-2.5 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  Close Document View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
