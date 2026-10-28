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
  Briefcase
} from 'lucide-react';

export default function App() {
  // Mobile navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

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

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'education', 'experience', 'expertise', 'research', 'awards', 'contact'];
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const accordionItems = [
    {
      id: 0,
      index: '01.',
      title: 'VLSI & Embedded Systems',
      badge: 'Core Specialization',
      tags: ['Embedded System Design', 'Digital Logic Design', 'VLSI Tools & Techniques', 'FPGA Prototyping'],
      description:
        'Specialized laboratory coaching, HDL simulation, FPGA prototyping, and hardware-software co-design fundamentals. Directing students in micro-controller interfacing and silicon synthesis.'
    },
    {
      id: 1,
      index: '02.',
      title: 'Electronics Engineering',
      badge: 'Core Pedagogy',
      tags: ['Basic Electronics', 'Analog Electronics', 'EDC', 'Solid-State Devices'],
      description:
        'In-depth pedagogy of semiconductor characteristics, transistor biasing, operational amplifiers, and circuit design principles.'
    },
    {
      id: 2,
      index: '03.',
      title: 'Communication & Networks',
      badge: 'Advanced Systems',
      tags: ['Computer Networks', 'Telecomm Switching', 'Wireless Multimedia Sensor Networks (WMSN)'],
      description:
        'Architecting high throughput, QoS-centric MAC protocols for wireless communication and industrial sensor networks.'
    },
    {
      id: 3,
      index: '04.',
      title: 'Electromagnetics & Theory',
      badge: 'Foundation',
      tags: ['Electromagnetics', 'Wave Propagation', 'Transmission Lines'],
      description:
        'Rigorous mathematical grounding in Maxwell\'s equations, boundary conditions, and high-frequency electromagnetic radiation.'
    },
    {
      id: 4,
      index: '05.',
      title: 'Counselling & Mentoring',
      badge: 'Student Wellness',
      tags: ['Adolescent Psychology', 'DMIT Analysis', 'Academic Career Guidance'],
      description:
        'Holistic student wellness support leveraging professional certified diplomas to counsel and unlock young potential.'
    }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      // open mail client as a helpful fallback
      window.location.href = `mailto:pawarsmita1020@dypiu.ac.in?subject=${encodeURIComponent(
        `Inquiry from ${formState.name} - ${formState.category}`
      )}&body=${encodeURIComponent(
        `Name: ${formState.name}\nEmail: ${formState.email}\nCategory: ${formState.category}\n\nMessage:\n${formState.message}`
      )}`;
    }, 1200);
  };

  const handleCvRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setCvRequested(true);
    setTimeout(() => {
      window.location.href = `mailto:pawarsmita1020@dypiu.ac.in?subject=${encodeURIComponent(
        'Request for Academic CV - Mrs. Smita Pawar'
      )}&body=${encodeURIComponent(
        `Dear Mrs. Smita Pawar,\n\nI would like to request a detailed copy of your academic CV.\n\nMy email: ${cvEmail}`
      )}`;
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#111111] font-sans antialiased selection:bg-[#FFA81F] selection:text-[#111111] text-base leading-relaxed">
      {/* BEGIN: MainHeader Floating Navbar */}
      <header className="fixed top-3 sm:top-4 inset-x-0 z-50 px-3 sm:px-6 max-w-6xl mx-auto" data-purpose="floating-navbar">
        <nav className="bg-[#111111]/95 text-white rounded-full px-4 py-2.5 sm:px-7 sm:py-3.5 flex items-center justify-between shadow-2xl border border-white/10 backdrop-blur-xl">
          {/* Logo / Brand */}
          <a href="#hero" className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFA81F] flex-shrink-0 flex items-center justify-center font-heading font-black text-[#111111] text-xs sm:text-sm transition-transform group-hover:scale-105 shadow-md">
              SP
            </div>
            <div className="flex flex-col text-left truncate">
              <span className="font-heading text-sm sm:text-base font-bold tracking-tight text-white flex items-center whitespace-nowrap">
                Smita Pawar<span className="text-[#FFA81F]">.</span>
              </span>
              <span className="text-[10px] sm:text-[11px] text-white/60 tracking-wider uppercase font-bold truncate">
                Academician &amp; Researcher
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links (Large screens only) */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-semibold tracking-wide text-white/85">
            {[
              { label: 'Home', href: '#hero', id: 'hero' },
              { label: 'About', href: '#about', id: 'about' },
              { label: 'Education', href: '#education', id: 'education' },
              { label: 'Experience', href: '#experience', id: 'experience' },
              { label: 'Teaching', href: '#expertise', id: 'expertise' },
              { label: 'Research', href: '#research', id: 'research' },
              { label: 'Achievements', href: '#awards', id: 'awards' },
              { label: 'Contact', href: '#contact', id: 'contact' },
            ].map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`transition-colors whitespace-nowrap pb-0.5 ${
                    isActive
                      ? 'text-white font-bold border-b-2 border-[#FFA81F]'
                      : 'hover:text-[#FFA81F] text-white/80'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Desktop Header Actions (Large screens only) */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setPubsModalOpen(true)}
              aria-label="View Research Publications"
              title="View Research Portfolio"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-sm hover:bg-white/20 transition-colors"
            >
              <i className="fa-solid fa-star text-[#FFA81F] text-sm"></i>
            </button>

            <a
              href="#contact"
              className="bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] text-sm font-extrabold px-5 sm:px-6 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-lg active:scale-95 group whitespace-nowrap"
            >
              <span>Let's Talk</span>
              <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-0.5"></i>
            </a>
          </div>

          {/* Mobile Right Controls: 3-Bar Hamburger Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setPubsModalOpen(true)}
              aria-label="View Research"
              title="View Research"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#FFA81F] text-xs hover:bg-white/20 active:scale-95 transition-all"
            >
              <i className="fa-solid fa-star text-xs"></i>
            </button>

            {/* Prominent 3-Bar Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-1.5 bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full font-heading font-extrabold text-xs shadow-md active:scale-95 transition-all"
              aria-label="Open navigation menu"
            >
              {/* 3 bars */}
              <div className="flex flex-col gap-[3px] w-4 justify-center items-center">
                <span className="w-4 h-[2px] bg-[#111111] rounded-full"></span>
                <span className="w-4 h-[2px] bg-[#111111] rounded-full"></span>
                <span className="w-4 h-[2px] bg-[#111111] rounded-full"></span>
              </div>
              <span className="tracking-tight text-xs uppercase">Menu</span>
            </button>
          </div>
        </nav>
      </header>

      {/* BEGIN: Mobile Slide-Out Drawer Navigation */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[99] transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Slide Drawer Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#111111] text-white z-[100] shadow-2xl border-l border-white/10 flex flex-col justify-between transform transition-transform duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile Navigation Drawer"
      >
        {/* Top Header of Drawer */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFA81F] flex items-center justify-center font-heading font-black text-[#111111] text-sm shadow-md">
              SP
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white leading-tight">
                Smita Pawar<span className="text-[#FFA81F]">.</span>
              </h3>
              <p className="text-[11px] text-white/60 uppercase tracking-wider font-semibold">
                VLSI &amp; Embedded Systems
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors active:scale-95"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links in Drawer */}
        <div className="px-4 py-5 flex-1 overflow-y-auto space-y-1.5">
          <p className="text-[11px] uppercase tracking-widest text-[#FFA81F] font-bold px-3 mb-2">
            Navigation
          </p>
          {[
            { label: 'Home', href: '#hero', num: '01', icon: 'fa-house' },
            { label: 'About Smita', href: '#about', num: '02', icon: 'fa-user' },
            { label: 'Education & Degrees', href: '#education', num: '03', icon: 'fa-graduation-cap' },
            { label: '20+ Yrs Experience', href: '#experience', num: '04', icon: 'fa-briefcase' },
            { label: 'Teaching & Pedagogy', href: '#expertise', num: '05', icon: 'fa-chalkboard-user' },
            { label: 'Research & Patents', href: '#research', num: '06', icon: 'fa-microchip' },
            { label: 'Achievements & Awards', href: '#awards', num: '07', icon: 'fa-trophy' },
            { label: 'Get in Touch / Contact', href: '#contact', num: '08', icon: 'fa-envelope' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-white/10 active:bg-white/15 text-white/90 hover:text-[#FFA81F] transition-all group font-medium text-base"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-[#FFA81F]/20 group-hover:text-[#FFA81F] flex items-center justify-center text-xs text-white/60 transition-colors">
                  <i className={`fa-solid ${item.icon}`}></i>
                </span>
                <span>{item.label}</span>
              </div>
              <span className="text-xs font-mono text-white/40 group-hover:text-[#FFA81F] transition-colors">
                {item.num}
              </span>
            </a>
          ))}
        </div>

        {/* Drawer Bottom Actions */}
        <div className="p-5 border-t border-white/10 bg-white/[0.02] space-y-3">
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-heading font-extrabold py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all text-sm uppercase tracking-wide"
          >
            <span>Let's Talk</span>
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </a>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setPubsModalOpen(true);
            }}
            className="w-full bg-white/10 hover:bg-white/15 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs border border-white/10"
          >
            <i className="fa-solid fa-star text-[#FFA81F]"></i>
            <span>View Research Publications &amp; Patents</span>
          </button>

          <div className="pt-2 text-center text-[11px] text-white/50 leading-relaxed">
            <p>Assistant Professor, DYPIU Pune</p>
            <p className="text-white/70">pawarsmita1020@dypiu.ac.in</p>
          </div>
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
            <i className="fa-solid fa-award"></i>
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-[#111111] tracking-tight">
            Certified IUCEE-IIECP Trainer &amp; Best Faculty Awardee
          </span>
          <span className="w-2 h-2 rounded-full bg-[#FFA81F]"></span>
          <span className="text-xs sm:text-sm font-bold text-[#111111]/70">20+ Years Exp</span>
        </div>

        {/* Hero headline & title - Large, bold, commanding */}
        <div className="space-y-3 mb-6 max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-heading text-[#111111] tracking-tight leading-[1.08]">
            I'm <span className="text-[#FFA81F]">Smita Pawar</span>{' '}
            <span className="text-[#FFA81F] inline-block text-3xl sm:text-4xl md:text-5xl">✦</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#111111]/80 max-w-3xl mx-auto">
            Assistant Professor – VLSI &amp; Embedded Systems | DYPIU Pune, India
          </p>

          {/* Hero CTAs */}
          <div className="flex items-center justify-center gap-4 pt-3 w-full max-w-sm sm:max-w-md mx-auto">
            <a
              href="#research"
              className="flex-1 bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-black text-sm sm:text-base py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 shadow-xl transition-transform active:scale-95 whitespace-nowrap"
            >
              <span>My Research</span>
              <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs">
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </a>
            <a
              href="#contact"
              className="flex-1 bg-white hover:bg-gray-100 border-2 border-[#111111] text-[#111111] font-black text-sm sm:text-base py-3.5 px-6 rounded-full shadow-md text-center transition-transform active:scale-95 whitespace-nowrap"
            >
              Contact Me
            </a>
          </div>
        </div>

        {/* 3-Column Bento Grid Hero Layout - Large Featured "FEAD/FIT" Cards Framing the 3D Portrait */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-end justify-center mt-6 mb-0 relative">
          {/* Left Column (3 cols) - Featured Information Cards */}
          <div className="md:col-span-3 flex flex-col gap-4 text-left order-1 md:order-1 pb-4">
            {/* Follow Me On Card */}
            <div className="bg-white/95 backdrop-blur-md border border-[#111111]/15 p-5 sm:p-6 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <span className="text-xs sm:text-sm font-extrabold text-[#111111]/70 uppercase tracking-wider block mb-3">
                Follow Me On
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  className="w-10 h-10 rounded-full bg-[#111111] text-white text-sm flex items-center justify-center hover:bg-[#FFA81F] hover:text-[#111111] transition-colors shadow-sm"
                  href="mailto:pawarsmita1020@dypiu.ac.in"
                  title="Email Mrs. Smita Pawar"
                >
                  <i className="fa-solid fa-envelope"></i>
                </a>
                <a
                  className="w-10 h-10 rounded-full bg-[#111111] text-white text-sm flex items-center justify-center hover:bg-[#FFA81F] hover:text-[#111111] transition-colors shadow-sm"
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                >
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <button
                  onClick={() => setPubsModalOpen(true)}
                  className="w-10 h-10 rounded-full bg-[#111111] text-white text-sm flex items-center justify-center hover:bg-[#FFA81F] hover:text-[#111111] transition-colors shadow-sm"
                  title="Google Scholar &amp; Scopus"
                >
                  <i className="fa-solid fa-graduation-cap"></i>
                </button>
                <button
                  onClick={() => setPubsModalOpen(true)}
                  className="w-10 h-10 rounded-full bg-[#111111] text-white text-sm flex items-center justify-center hover:bg-[#FFA81F] hover:text-[#111111] transition-colors shadow-sm"
                  title="ResearchGate"
                >
                  <i className="fa-solid fa-book-bookmark"></i>
                </button>
              </div>
            </div>

            {/* 1000+ Mentored Students Card */}
            <div className="bg-white/95 backdrop-blur-md border border-[#111111]/15 p-5 sm:p-6 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-[#FFA81F]">
                <i className="fa-solid fa-star text-base"></i>
                <span className="text-[#111111] font-black text-xl sm:text-2xl">1000+</span>
                <span className="text-xs sm:text-sm text-[#111111]/80 font-bold">Mentored Students</span>
              </div>
              <p className="text-sm sm:text-base text-[#111111]/85 font-medium leading-snug">
                Trusted academic mentor for BE &amp; Tech Engineering students.
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFA81F] animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]/70">
                  19 Yrs DYPIU &amp; Pune Univ
                </span>
              </div>
            </div>

            {/* Domain Specialty Card */}
            <div className="bg-[#111111] text-white p-5 sm:p-6 rounded-3xl border border-white/15 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <span className="text-xs sm:text-sm font-extrabold text-[#FFA81F] uppercase tracking-wider block mb-1.5">
                Domain Specialty
              </span>
              <p className="text-sm sm:text-base font-bold leading-snug">
                VLSI Design &amp; Architecture, Wireless Multimedia Sensor Networks
              </p>
            </div>
          </div>

          {/* Center Column: 3D Cutout Portrait touching the black moving bar (6 cols) */}
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
                    <textPath href="#circlePathHero">20+ Years Exp • 20+ Years Exp •</textPath>
                  </text>
                </svg>
                <div className="absolute w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111111] text-[#FFA81F] flex items-center justify-center text-sm shadow-md font-bold">
                  ✦
                </div>
              </div>
            </div>

            {/* 3D Cutout Image - Desk touches the upper top edge of the moving black bar */}
            <div className="relative z-10 flex flex-col items-center justify-end w-full">
              <img
                alt="Mrs. Smita S. Pawar – Assistant Professor & Researcher"
                className="w-full max-w-[380px] sm:max-w-[460px] md:max-w-[520px] h-auto object-contain block -mb-[2px] transition-all duration-500 ease-out group-hover:scale-[1.03]"
                style={{
                  filter:
                    'drop-shadow(0 20px 30px rgba(17, 17, 17, 0.32)) drop-shadow(0 10px 20px rgba(255, 168, 31, 0.25))'
                }}
                src="/assets/smita_pawar_3d.png"
              />
            </div>
          </div>

          {/* Right Column (3 cols) - Featured Information Cards */}
          <div className="md:col-span-3 flex flex-col gap-4 text-left order-2 md:order-3 pb-4">
            {/* Quote Card */}
            <div className="bg-[#111111] text-white p-5 sm:p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left border border-white/15">
              <span className="text-[#FFA81F] text-3xl leading-none font-heading block mb-2">“</span>
              <p className="text-sm sm:text-base leading-relaxed font-medium text-white/95">
                Highly professional educator with 20 years passion for VLSI &amp; research excellence.
              </p>
              <span className="text-xs sm:text-sm text-[#FFA81F] font-bold block mt-3">— DYPIU Faculty</span>
            </div>

            {/* Research Focus tags Card */}
            <div className="bg-white/95 backdrop-blur-md border border-[#111111]/15 p-5 sm:p-6 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3">
              <span className="text-xs sm:text-sm font-extrabold text-[#111111]/70 uppercase tracking-wider">
                Research Focus
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs sm:text-sm font-bold bg-[#111111] text-white px-3 py-1 rounded-full">
                  #VLSI
                </span>
                <span className="text-xs sm:text-sm font-bold bg-[#FFA81F] text-[#111111] px-3 py-1 rounded-full">
                  #EmbeddedSystems
                </span>
                <span className="text-xs sm:text-sm font-bold bg-white border border-[#111111]/15 text-[#111111] px-3 py-1 rounded-full">
                  #WMSN
                </span>
                <span className="text-xs sm:text-sm font-bold bg-[#111111] text-white px-3 py-1 rounded-full">
                  #Patents
                </span>
                <span className="text-xs sm:text-sm font-bold bg-white border border-[#111111]/15 text-[#111111] px-3 py-1 rounded-full">
                  #Counselling
                </span>
              </div>
            </div>

            {/* Examination Head Card */}
            <div className="bg-[#FFA81F]/20 border border-[#FFA81F]/40 p-5 sm:p-6 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#111111]/80">
                  Examination Head
                </span>
                <span className="text-base sm:text-lg font-bold text-[#111111]">Chief Coordinator</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#FFA81F] flex items-center justify-center text-[#111111] text-sm font-bold shadow-sm">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: HeroSection */}

      {/* BEGIN: MarqueeTicker */}
      <div className="w-full bg-[#111111] text-white py-4 overflow-hidden border-y border-white/15 relative z-20" data-purpose="ticker-banner">
        <div className="animate-marquee whitespace-nowrap text-sm sm:text-base font-heading font-extrabold uppercase tracking-widest flex items-center">
          <span className="mx-4">VLSI Design</span> <span className="text-[#FFA81F]">✦</span>
          <span className="mx-4">Embedded Systems</span> <span className="text-[#FFA81F]">✦</span>
          <span className="mx-4">Wireless Sensor Networks</span> <span className="text-[#FFA81F]">✦</span>
          <span className="mx-4">20 Years Academics</span> <span className="text-[#FFA81F]">✦</span>
          <span className="mx-4">Research &amp; Patents</span> <span className="text-[#FFA81F]">✦</span>
          <span className="mx-4">Child &amp; Adolescent Mentoring</span> <span className="text-[#FFA81F]">✦</span>
          <span className="mx-4">Examination Head</span> <span className="text-[#FFA81F]">✦</span>

          {/* Duplicate loop */}
          <span className="mx-4">VLSI Design</span> <span className="text-[#FFA81F]">✦</span>
          <span className="mx-4">Embedded Systems</span> <span className="text-[#FFA81F]">✦</span>
          <span className="mx-4">Wireless Sensor Networks</span> <span className="text-[#FFA81F]">✦</span>
          <span className="mx-4">20 Years Academics</span> <span className="text-[#FFA81F]">✦</span>
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
                Pedagogy &amp; Curricular Mastery
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-[#111111] leading-tight">
              What I <span className="text-[#FFA81F]">Teach</span> &amp; Research ✦
            </h2>
            <p className="text-base sm:text-lg text-[#111111]/80 mt-3 font-medium max-w-3xl">
              Taught First Year, Second Year, and Final Year BE &amp; Tech degree courses in Computer Science and E&amp;TC Engineering across DYPIU and Savitribai Phule Pune University.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="bg-[#111111] hover:bg-black text-white text-sm font-bold px-6 py-3 rounded-full inline-flex items-center gap-2.5 shadow-md transition-colors whitespace-nowrap"
            >
              <span>Connect for Guest Lectures</span>
              <i className="fa-solid fa-arrow-right text-xs text-[#FFA81F]"></i>
            </a>
          </div>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4" id="accordionContainer">
          {accordionItems.map((item) => {
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
                  data-purpose="accordion-trigger"
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
                    <i className="fa-solid fa-arrow-up"></i>
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
                    alt="Mrs. Smita S. Pawar Academic Profile"
                    className="w-full h-full object-contain object-bottom filter contrast-[1.03]"
                    src="/assets/smita_pawar_3d.png"
                  />
                </div>
                <div className="absolute -bottom-4 left-6 bg-[#111111] text-white text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-full border border-white/20 shadow-md">
                  Assistant Professor
                </div>
                <div className="absolute -bottom-4 right-6 bg-white text-[#111111] text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-full border border-[#111111]/20 shadow-md">
                  PhD Scholar
                </div>
              </div>

              {/* Languages & Passions */}
              <div className="bg-white/5 p-5 sm:p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-extrabold text-[#FFA81F] uppercase tracking-wide">
                    Languages Spoken
                  </span>
                  <div className="flex gap-2">
                    <span className="text-xs sm:text-sm bg-[#111111] px-3.5 py-1.5 rounded-lg border border-white/20 font-bold">Marathi</span>
                    <span className="text-xs sm:text-sm bg-[#111111] px-3.5 py-1.5 rounded-lg border border-white/20 font-bold">Hindi</span>
                    <span className="text-xs sm:text-sm bg-[#111111] px-3.5 py-1.5 rounded-lg border border-white/20 font-bold">English</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-white/10 pt-3.5 gap-2">
                  <span className="text-xs sm:text-sm font-extrabold text-[#FFA81F] uppercase tracking-wide">
                    Passions &amp; Hobbies
                  </span>
                  <div className="flex gap-2">
                    <span className="text-xs sm:text-sm bg-[#111111] px-3 py-1.5 rounded-lg border border-white/20 font-semibold">🌿 Gardening</span>
                    <span className="text-xs sm:text-sm bg-[#111111] px-3 py-1.5 rounded-lg border border-white/20 font-semibold">📚 Reading</span>
                    <span className="text-xs sm:text-sm bg-[#111111] px-3 py-1.5 rounded-lg border border-white/20 font-semibold">🧠 Mentorship</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Detailed Bio + Stats Counter */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#FFA81F]"></div>
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white/70 ml-1">
                  Academic Profile
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white mb-5 leading-tight">
                Who is <span className="text-[#FFA81F]">Smita Pawar</span>? ✦
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-white/85 font-normal mb-4">
                I am an Assistant Professor with <strong className="text-white font-bold">20 years of rich total experience</strong> (19 years dedicated to engineering academics and 1 year in industrial precision engineering), specializing in Electronics &amp; Telecommunication, VLSI Design, and Embedded Architectures.
              </p>
              <p className="text-base sm:text-lg leading-relaxed text-white/85 font-normal mb-7">
                I am currently pursuing my PhD in Electrical &amp; Electronics Engineering at Sandip University, Nashik. Beyond the laboratory, I serve as the <strong className="text-[#FFA81F]">Chief Examination Coordinator</strong> at DYPIU and hold specialized Diplomas in <em>Child &amp; Adolescent Counselling</em> and <em>DMIT Multi-Intelligence</em>, enabling me to guide students both technically and psychologically.
              </p>

              {/* 4 Stat Counters - Large & Bold */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7" data-purpose="stat-counter-grid">
                <div className="bg-[#1A1A1A] border border-[#FFA81F]/40 rounded-3xl p-5 flex flex-col justify-center text-center hover:border-[#FFA81F] transition-colors shadow-lg">
                  <span className="font-heading text-4xl sm:text-5xl font-black text-[#FFA81F]">20+</span>
                  <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mt-1.5">Years Exp</span>
                  <span className="text-xs text-white/60">19 Acad | 1 Ind</span>
                </div>
                <div className="bg-[#1A1A1A] border border-[#FFA81F]/40 rounded-3xl p-5 flex flex-col justify-center text-center hover:border-[#FFA81F] transition-colors shadow-lg">
                  <span className="font-heading text-4xl sm:text-5xl font-black text-[#FFA81F]">06</span>
                  <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mt-1.5">Journals</span>
                  <span className="text-xs text-white/60">Scopus Indexed</span>
                </div>
                <div className="bg-[#1A1A1A] border border-[#FFA81F]/40 rounded-3xl p-5 flex flex-col justify-center text-center hover:border-[#FFA81F] transition-colors shadow-lg">
                  <span className="font-heading text-4xl sm:text-5xl font-black text-[#FFA81F]">02</span>
                  <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mt-1.5">Patents &amp; 1 ©</span>
                  <span className="text-xs text-white/60">Intellectual Property</span>
                </div>
                <div className="bg-[#1A1A1A] border border-[#FFA81F]/40 rounded-3xl p-5 flex flex-col justify-center text-center hover:border-[#FFA81F] transition-colors shadow-lg">
                  <span className="font-heading text-4xl sm:text-5xl font-black text-[#FFA81F]">25+</span>
                  <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mt-1.5">Conferences</span>
                  <span className="text-xs text-white/60">Workshops &amp; FDPs</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  onClick={() => setCvModalOpen(true)}
                  className="w-full sm:w-auto inline-flex bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-black text-sm sm:text-base py-4 px-9 rounded-full items-center justify-center gap-3.5 shadow-xl transition-transform active:scale-95"
                >
                  <span>Request Detailed Academic CV</span>
                  <div className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs">
                    <i className="fa-solid fa-download"></i>
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

        {/* 3 Main Higher Education Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PhD Card */}
          <div className="bg-white border-2 border-[#FFA81F] rounded-3xl p-7 shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider bg-[#FFA81F] text-[#111111] px-3.5 py-1.5 rounded-lg">
                  Pursuing
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#111111]/70">Sandip University</span>
              </div>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#111111] mb-2.5">
                PhD in Electrical &amp; Electronics Engineering
              </h3>
              <p className="text-sm sm:text-base text-[#111111]/75 leading-relaxed">
                Research focus: Advanced Wireless Sensor Network Protocols and Low-Power VLSI Architectures.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-[#111111]/15 flex items-center gap-2.5">
              <i className="fa-solid fa-graduation-cap text-[#FFA81F] text-base"></i>
              <span className="text-sm font-bold text-[#111111]/85">Sandip University, Nashik</span>
            </div>
          </div>

          {/* M.E. Card */}
          <div className="bg-white border border-[#111111]/15 rounded-3xl p-7 shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider bg-[#111111] text-white px-3.5 py-1.5 rounded-lg">
                  First Class • CGPA 7.45
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#111111]/70">Pune University</span>
              </div>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#111111] mb-1.5">
                M.E. (VLSI &amp; Embedded Systems)
              </h3>
              <p className="text-sm font-semibold text-[#111111]/80 mb-3.5">MAE, Alandi (D), Pune</p>
              <div className="text-sm bg-[#F5F1E8] p-4 rounded-2xl border border-[#111111]/10 text-[#111111]/85 font-medium">
                <strong className="text-[#111111] font-bold block mb-1">Dissertation:</strong>
                "A QoS based MAC Protocol for Wireless Multimedia Sensor Networks (WMSN)"
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-[#111111]/15 flex items-center gap-2.5">
              <i className="fa-solid fa-certificate text-[#FFA81F] text-base"></i>
              <span className="text-sm font-bold text-[#111111]/85">Savitribai Phule Pune University</span>
            </div>
          </div>

          {/* B.E. Card */}
          <div className="bg-white border border-[#111111]/15 rounded-3xl p-7 shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider bg-[#111111] text-white px-3.5 py-1.5 rounded-lg">
                  Higher Second Class • 59%
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#111111]/70">Pune University</span>
              </div>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#111111] mb-1.5">
                B.E. (Electronics &amp; Telecomm)
              </h3>
              <p className="text-sm font-semibold text-[#111111]/80 mb-3.5">
                Sinhagad College of Engineering, Pune
              </p>
              <div className="text-sm bg-[#F5F1E8] p-4 rounded-2xl border border-[#111111]/10 text-[#111111]/85 font-medium">
                <strong className="text-[#111111] font-bold block mb-1">BE Project:</strong>
                "Switch Mode Power Supply (SMPS) with Power Factor Corrector"
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-[#111111]/15 flex items-center gap-2.5">
              <i className="fa-solid fa-microchip text-[#FFA81F] text-base"></i>
              <span className="text-sm font-bold text-[#111111]/85">Sinhagad College of Engineering</span>
            </div>
          </div>
        </div>

        {/* HSC, SSC and Diplomas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-[#111111]/15 rounded-3xl p-5 shadow-sm">
              <span className="text-[11px] sm:text-xs font-black bg-[#111111] text-[#FFA81F] px-2.5 py-1 rounded-md uppercase">
                Distinction 78.5%
              </span>
              <h4 className="font-heading font-bold text-base sm:text-lg text-[#111111] mt-2.5">H.S.C. (Science)</h4>
              <p className="text-xs sm:text-sm text-[#111111]/70 mt-1">Abasaheb Garware College, Pune</p>
            </div>
            <div className="bg-white border border-[#111111]/15 rounded-3xl p-5 shadow-sm">
              <span className="text-[11px] sm:text-xs font-black bg-[#111111] text-[#FFA81F] px-2.5 py-1 rounded-md uppercase">
                Distinction 84.14%
              </span>
              <h4 className="font-heading font-bold text-base sm:text-lg text-[#111111] mt-2.5">S.S.C. Board</h4>
              <p className="text-xs sm:text-sm text-[#111111]/70 mt-1">Muktangan English School, Pune</p>
            </div>
          </div>

          <div className="bg-white border border-[#111111]/15 p-5 sm:p-6 rounded-3xl shadow-sm flex flex-col justify-between">
            <span className="text-xs sm:text-sm font-extrabold text-[#111111]/70 uppercase tracking-wide block mb-3">
              Specialized Diplomas &amp; Certifications
            </span>
            <div className="flex flex-col gap-2.5">
              <div className="bg-[#F5F1E8] px-4 py-2 rounded-xl flex items-center justify-between text-xs sm:text-sm">
                <span className="font-bold text-[#111111]">
                  <i className="fa-solid fa-certificate text-[#FFA81F] mr-2"></i>Diploma in Child &amp; Adolescent Counselling
                </span>
                <span className="text-[11px] bg-[#111111] text-white px-2.5 py-0.5 rounded font-extrabold">Grade A</span>
              </div>
              <div className="bg-[#F5F1E8] px-4 py-2 rounded-xl flex items-center justify-between text-xs sm:text-sm">
                <span className="font-bold text-[#111111]">
                  <i className="fa-solid fa-fingerprint text-[#FFA81F] mr-2"></i>Diploma in DMIT Multi-Intelligence
                </span>
                <span className="text-[11px] bg-[#111111] text-white px-2.5 py-0.5 rounded font-extrabold">Certified</span>
              </div>
              <div className="bg-[#F5F1E8] px-4 py-2 rounded-xl flex items-center justify-between text-xs sm:text-sm">
                <span className="font-bold text-[#111111]">
                  <i className="fa-solid fa-microchip text-[#FFA81F] mr-2"></i>Certificate in VLSI Design
                </span>
                <span className="text-[11px] bg-[#111111] text-white px-2.5 py-0.5 rounded font-extrabold">PIAT Pune</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: EducationSection */}

      {/* BEGIN: ExperienceTimelineSection */}
      <section
        className="bg-[#111111] text-white py-20 px-4 sm:px-6 border-t-4 border-[#FFA81F]"
        data-purpose="experience-timeline"
        id="experience"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-5 border-b border-white/15 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FFA81F]"></div>
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white/70 ml-1">
                  Career History
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white leading-tight">
                My <span className="text-[#FFA81F]">Experience</span> ✦
              </h2>
            </div>
            <div className="bg-[#FFA81F] text-[#111111] font-black text-sm sm:text-base py-3 px-6 rounded-2xl shadow-lg inline-block">
              Total 20 Years Experience (19 Academics + 1 Industry)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column: Academic Progression */}
            <div className="space-y-8 relative border-l-2 border-[#FFA81F]/40 ml-4 pl-7">
              <div className="relative">
                <div className="absolute -left-[37px] top-1.5 w-5 h-5 rounded-full bg-[#FFA81F] border-2 border-[#111111] shadow-md"></div>
                <span className="text-xs sm:text-sm font-black text-[#FFA81F] uppercase tracking-wider">
                  Sept 2022 – Present
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-white mt-1">Assistant Professor</h3>
                <p className="text-sm sm:text-base font-semibold text-white/85">
                  D Y Patil International University (DYPIU), Akurdi
                </p>
                <p className="text-sm sm:text-base text-white/70 mt-1.5 leading-relaxed">
                  Teaching core engineering, lab experimentation, and serving as the Chief Institutional Examination Coordinator.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[37px] top-1.5 w-5 h-5 rounded-full bg-white border-2 border-[#111111] shadow-md"></div>
                <span className="text-xs sm:text-sm font-bold text-white/60 uppercase tracking-wider">
                  June 2018 – Sept 2022
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-white mt-1">Assistant Professor</h3>
                <p className="text-sm sm:text-base font-semibold text-white/85">
                  Dr. D. Y. Patil Institute of Technology, Pimpri, Pune
                </p>
                <p className="text-sm sm:text-base text-white/70 mt-1.5 leading-relaxed">
                  Guided undergraduate final year project cohorts in VLSI design, wireless communications, and network security.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[37px] top-1.5 w-5 h-5 rounded-full bg-white border-2 border-[#111111] shadow-md"></div>
                <span className="text-xs sm:text-sm font-bold text-white/60 uppercase tracking-wider">
                  Jan 2012 – Mar 2018
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-white mt-1">Assistant Professor</h3>
                <p className="text-sm sm:text-base font-semibold text-white/85">
                  MIT Academy of Engineering (MITAOE), Alandi, Pune
                </p>
                <p className="text-sm sm:text-base text-white/70 mt-1.5 leading-relaxed">
                  Awarded Best Faculty Award for pedagogy excellence, continuous university results, and research mentoring.
                </p>
              </div>
            </div>

            {/* Right Column: College & Industry Foundations */}
            <div className="space-y-8 relative border-l-2 border-white/20 ml-4 pl-7">
              <div className="relative">
                <div className="absolute -left-[37px] top-1.5 w-5 h-5 rounded-full bg-white border-2 border-[#111111] shadow-md"></div>
                <span className="text-xs sm:text-sm font-bold text-white/60 uppercase tracking-wider">
                  June 2009 – Dec 2011
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-white mt-1">Assistant Professor</h3>
                <p className="text-sm sm:text-base font-semibold text-white/85">
                  Pratibha College of Commerce &amp; Computer Studies, Pune
                </p>
                <p className="text-sm sm:text-base text-white/70 mt-1.5 leading-relaxed">
                  Taught foundational electronics, computer organization principles, and digital circuits.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[37px] top-1.5 w-5 h-5 rounded-full bg-[#FFA81F] border-2 border-[#111111] shadow-md"></div>
                <span className="text-xs sm:text-sm font-black text-[#FFA81F] uppercase tracking-wider">
                  July 2001 – Oct 2002 • Industry
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-white mt-1">Quality Engineer</h3>
                <p className="text-sm sm:text-base font-semibold text-white/85">
                  ELPRO International Ltd., Chinchwad, Pune
                </p>
                <p className="text-sm sm:text-base text-white/70 mt-1.5 leading-relaxed">
                  Testing, precision quality control inspection, and industrial compliance for electronic components.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[37px] top-1.5 w-5 h-5 rounded-full bg-white border-2 border-[#111111] shadow-md"></div>
                <span className="text-xs sm:text-sm font-bold text-white/60 uppercase tracking-wider">
                  Jan 1999 – July 1999 • Industry
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-white mt-1">Electronics Trainee</h3>
                <p className="text-sm sm:text-base font-semibold text-white/85">
                  TELCO (Tata Motors Ltd.), Pune
                </p>
                <p className="text-sm sm:text-base text-white/70 mt-1.5 leading-relaxed">
                  Practical hands-on training in automotive electrical harnesses and component calibration.
                </p>
              </div>
            </div>
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
                Scholarly Impact
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-[#111111] leading-tight">
              Research &amp; <span className="text-[#FFA81F]">Publications</span> ✦
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#111111]/80 font-medium max-w-lg">
            Active research portfolio spanning wireless multimedia communications, VLSI circuits, and intellectual properties.
          </p>
        </div>

        {/* 4 Research Stat Blocks */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 mb-8">
          <div
            onClick={() => setPubsModalOpen(true)}
            className="cursor-pointer bg-white border border-[#111111]/15 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#FFA81F] transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFA81F]/20 text-[#FFA81F] flex items-center justify-center font-black text-xl sm:text-2xl font-heading shadow-inner">
                06
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#FFA81F] bg-[#FFA81F]/10 px-2.5 py-1 rounded-full">
                Scopus
              </span>
            </div>
            <div>
              <span className="text-base sm:text-xl font-bold font-heading text-[#111111] block leading-tight group-hover:text-[#FFA81F] transition-colors">
                Journals
              </span>
              <span className="text-xs sm:text-sm text-[#111111]/70 block mt-1 leading-snug">
                Peer-reviewed &amp; Scopus
              </span>
            </div>
          </div>

          <div
            onClick={() => setPubsModalOpen(true)}
            className="cursor-pointer bg-white border border-[#111111]/15 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#FFA81F] transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#111111] text-[#FFA81F] flex items-center justify-center font-black text-xl sm:text-2xl font-heading shadow-md">
                10
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#111111]/70 bg-[#111111]/5 px-2.5 py-1 rounded-full">
                Global
              </span>
            </div>
            <div>
              <span className="text-base sm:text-xl font-bold font-heading text-[#111111] block leading-tight group-hover:text-[#FFA81F] transition-colors">
                Conferences
              </span>
              <span className="text-xs sm:text-sm text-[#111111]/70 block mt-1 leading-snug">
                National &amp; Int'l
              </span>
            </div>
          </div>

          <div
            onClick={() => setPubsModalOpen(true)}
            className="cursor-pointer bg-white border border-[#111111]/15 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#FFA81F] transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFA81F] text-[#111111] flex items-center justify-center font-black text-xl sm:text-2xl font-heading shadow-md">
                02
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#FFA81F] bg-[#FFA81F]/10 px-2.5 py-1 rounded-full">
                IP India
              </span>
            </div>
            <div>
              <span className="text-base sm:text-xl font-bold font-heading text-[#111111] block leading-tight group-hover:text-[#FFA81F] transition-colors">
                Patents
              </span>
              <span className="text-xs sm:text-sm text-[#111111]/70 block mt-1 leading-snug">
                Published IP
              </span>
            </div>
          </div>

          <div
            onClick={() => setPubsModalOpen(true)}
            className="cursor-pointer bg-white border border-[#111111]/15 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#FFA81F] transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#111111] text-white flex items-center justify-center font-black text-xl sm:text-2xl font-heading shadow-md">
                01
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#111111]/70 bg-[#111111]/5 px-2.5 py-1 rounded-full">
                Govt Reg
              </span>
            </div>
            <div>
              <span className="text-base sm:text-xl font-bold font-heading text-[#111111] block leading-tight group-hover:text-[#FFA81F] transition-colors">
                Copyright
              </span>
              <span className="text-xs sm:text-sm text-[#111111]/70 block mt-1 leading-snug">
                Registered Work
              </span>
            </div>
          </div>
        </div>

        {/* Featured Dissertation Banner */}
        <div className="bg-[#111111] text-white p-7 sm:p-10 rounded-3xl border border-white/15 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm bg-[#FFA81F] text-[#111111] font-black px-4 py-1.5 rounded-full uppercase">
                Featured Master's Dissertation
              </span>
              <span className="text-xs sm:text-sm text-white/60 font-bold">WMSN Protocol Architecture</span>
            </div>
            <span className="text-xs sm:text-sm text-[#FFA81F] font-bold">IEEE / Scopus Focus</span>
          </div>
          <h3 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-white leading-snug">
            A Quality of Service (QoS) Based MAC Protocol for Wireless Multimedia Sensor Networks
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-white/80 mt-4 leading-relaxed max-w-5xl">
            Engineered priority queues and packet scheduling routines to preserve transmission latency standards for mission-critical video, sound, and sensor data packets in wireless network topologies. Evaluated latency reduction under dense simulated sensor deployment traffic.
          </p>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-sm sm:text-base text-white/85">
              <i className="fa-solid fa-microchip text-[#FFA81F]"></i>
              <span>Hardware-Software Co-design for Energy-Efficient Sensor Transceivers</span>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#111111]/15 p-6 rounded-3xl shadow-sm flex items-start gap-5 hover:shadow-xl transition-shadow">
            <div className="w-13 h-13 rounded-2xl bg-[#FFA81F]/20 text-[#FFA81F] flex-shrink-0 flex items-center justify-center text-xl mt-0.5">
              <i className="fa-solid fa-trophy"></i>
            </div>
            <div>
              <span className="text-xs font-black uppercase text-[#FFA81F] tracking-wider block mb-1.5">
                International Cert
              </span>
              <h4 className="font-heading font-bold text-base sm:text-lg text-[#111111]">IUCEE – IIECP Certified Trainer</h4>
              <p className="text-xs sm:text-sm text-[#111111]/75 mt-1.5 leading-relaxed">
                Recognized international educator credentials by the Indo-Universal Collaboration for Engineering Education.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#111111]/15 p-6 rounded-3xl shadow-sm flex items-start gap-5 hover:shadow-xl transition-shadow">
            <div className="w-13 h-13 rounded-2xl bg-[#FFA81F] text-[#111111] flex-shrink-0 flex items-center justify-center text-xl mt-0.5">
              <i className="fa-solid fa-medal"></i>
            </div>
            <div>
              <span className="text-xs font-black uppercase text-[#FFA81F] tracking-wider block mb-1.5">
                MITAOE Honor
              </span>
              <h4 className="font-heading font-bold text-base sm:text-lg text-[#111111]">Best Faculty Award</h4>
              <p className="text-xs sm:text-sm text-[#111111]/75 mt-1.5 leading-relaxed">
                Awarded at MIT Academy of Engineering (MITAOE), Alandi for teaching superiority and consistent pass rates.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#111111]/15 p-6 rounded-3xl shadow-sm flex items-start gap-5 hover:shadow-xl transition-shadow">
            <div className="w-13 h-13 rounded-2xl bg-[#111111] text-white flex-shrink-0 flex items-center justify-center text-xl mt-0.5">
              <i className="fa-solid fa-certificate text-[#FFA81F]"></i>
            </div>
            <div>
              <span className="text-xs font-black uppercase text-[#FFA81F] tracking-wider block mb-1.5">
                National Jury
              </span>
              <h4 className="font-heading font-bold text-base sm:text-lg text-[#111111]">Robocon Inspection Committee</h4>
              <p className="text-xs sm:text-sm text-[#111111]/75 mt-1.5 leading-relaxed">
                Official Letter of Appreciation for contributing as technical safety and audit judge at Robocon India.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* END: AwardsSection */}

      {/* BEGIN: AdministrativeLeadership Section */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto" data-purpose="administrative-roles">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FFA81F]"></div>
          <div className="w-3 h-3 rounded-full bg-[#111111]"></div>
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#111111]/70 ml-1">
            Institutional Leadership
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-[#111111] mb-8 leading-tight">
          Examination <span className="text-[#FFA81F]">Coordinator</span> ✦
        </h2>

        {/* Master Leadership Card */}
        <div className="bg-white border border-[#111111]/15 rounded-3xl p-7 sm:p-9 shadow-md mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-black uppercase bg-[#111111] text-white px-4 py-1.5 rounded-lg">
                Jan 2022 – Present
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#FFA81F]">DYPIU Core Administrative Cell</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#111111]/70">Central Campus Administration</span>
          </div>
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#111111]">Chief Institutional Examination Head</h3>
          <p className="text-sm sm:text-base md:text-lg text-[#111111]/80 mt-3 leading-relaxed max-w-5xl">
            Spearheading comprehensive university exam operations, statutory audit compliance, confidential manuscript management, rigorous evaluation cycles, and university convocation protocols across faculties.
          </p>
        </div>

        {/* 4 Pillars of Leadership */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          <div className="bg-white border border-[#111111]/15 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md hover:border-[#FFA81F] transition-all flex flex-col justify-between group">
            <div className="w-11 h-11 rounded-2xl bg-[#FFA81F]/20 flex items-center justify-center text-[#FFA81F] text-lg flex-shrink-0 mb-3 shadow-inner group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <span className="font-heading font-bold text-sm sm:text-base text-[#111111] block leading-tight">
                Paper Confidentiality
              </span>
              <span className="text-[11px] sm:text-xs text-[#111111]/65 font-medium block mt-1">
                Manuscript Security
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#111111]/15 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md hover:border-[#FFA81F] transition-all flex flex-col justify-between group">
            <div className="w-11 h-11 rounded-2xl bg-[#FFA81F]/20 flex items-center justify-center text-[#FFA81F] text-lg flex-shrink-0 mb-3 shadow-inner group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <div>
              <span className="font-heading font-bold text-sm sm:text-base text-[#111111] block leading-tight">
                Convocation Lead
              </span>
              <span className="text-[11px] sm:text-xs text-[#111111]/65 font-medium block mt-1">
                Degree Protocols
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#111111]/15 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md hover:border-[#FFA81F] transition-all flex flex-col justify-between group">
            <div className="w-11 h-11 rounded-2xl bg-[#FFA81F]/20 flex items-center justify-center text-[#FFA81F] text-lg flex-shrink-0 mb-3 shadow-inner group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-list-check"></i>
            </div>
            <div>
              <span className="font-heading font-bold text-sm sm:text-base text-[#111111] block leading-tight">
                Syllabus Audits
              </span>
              <span className="text-[11px] sm:text-xs text-[#111111]/65 font-medium block mt-1">
                Academic Compliance
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#111111]/15 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md hover:border-[#FFA81F] transition-all flex flex-col justify-between group">
            <div className="w-11 h-11 rounded-2xl bg-[#FFA81F]/20 flex items-center justify-center text-[#FFA81F] text-lg flex-shrink-0 mb-3 shadow-inner group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-users"></i>
            </div>
            <div>
              <span className="font-heading font-bold text-sm sm:text-base text-[#111111] block leading-tight">
                Student Grievances
              </span>
              <span className="text-[11px] sm:text-xs text-[#111111]/65 font-medium block mt-1">
                Support &amp; Welfare
              </span>
            </div>
          </div>
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
              <i className="fa-solid fa-envelope"></i>
              <span>Get In Touch</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-heading font-extrabold text-white">
              Let's <span className="text-[#FFA81F]">Connect</span> ✦
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/75 mt-3 max-w-2xl mx-auto">
              Open for academic collaboration, research mentorship, guest lectures, curriculum advisory, and student career guidance.
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
                  <a className="flex items-center gap-4 group" href="mailto:pawarsmita1020@dypiu.ac.in">
                    <div className="w-12 h-12 rounded-full bg-[#FFA81F] text-[#111111] flex items-center justify-center text-base font-bold group-hover:scale-105 transition-transform flex-shrink-0">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs text-white/60 uppercase block font-extrabold">Official Email Address</span>
                      <span className="text-sm sm:text-base font-semibold text-white group-hover:text-[#FFA81F] transition-colors truncate block">
                        pawarsmita1020@dypiu.ac.in
                      </span>
                    </div>
                  </a>

                  <a className="flex items-center gap-4 group" href="tel:+919764027444">
                    <div className="w-12 h-12 rounded-full bg-[#FFA81F] text-[#111111] flex items-center justify-center text-base font-bold group-hover:scale-105 transition-transform flex-shrink-0">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div>
                      <span className="text-xs text-white/60 uppercase block font-extrabold">Phone Contact</span>
                      <span className="text-sm sm:text-base font-semibold text-white group-hover:text-[#FFA81F] transition-colors">
                        +91 9764027444
                      </span>
                    </div>
                  </a>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FFA81F] text-[#111111] flex items-center justify-center text-base font-bold flex-shrink-0">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div>
                      <span className="text-xs text-white/60 uppercase block font-extrabold">Campus Location</span>
                      <span className="text-sm sm:text-base font-semibold text-white">
                        DYPIU Campus, Sector 29, Nigdi Pradhikaran, Akurdi, Pune, MH, India
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office hours */}
              <div className="bg-white/5 border border-white/15 rounded-3xl p-6 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-bold text-white">Office Hours for Students</span>
                  <span className="text-xs sm:text-sm text-white/70">Mon – Fri: 10:00 AM – 4:00 PM</span>
                </div>
                <span className="text-xs sm:text-sm bg-[#FFA81F]/20 text-[#FFA81F] font-bold px-4 py-1.5 rounded-full">
                  Cabin 304
                </span>
              </div>
            </div>

            {/* Right 7 Cols: Interactive Form */}
            <div className="lg:col-span-7">
              <form
                className="space-y-4 bg-white/5 p-7 sm:p-9 rounded-3xl border border-white/15 shadow-2xl"
                data-purpose="contact-form"
                onSubmit={handleFormSubmit}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm sm:text-base font-heading font-bold text-[#FFA81F] uppercase tracking-wider">
                    Send an Inquiry
                  </h4>
                  <span className="text-xs text-white/60">Direct delivery to Smita Pawar</span>
                </div>

                {formSubmitted ? (
                  <div className="bg-[#FFA81F]/20 border border-[#FFA81F] text-white p-7 rounded-2xl text-center space-y-3 animate-fade-in">
                    <div className="w-14 h-14 bg-[#FFA81F] text-[#111111] rounded-full mx-auto flex items-center justify-center text-2xl font-bold">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h5 className="font-heading font-bold text-lg text-white">Inquiry Initiated!</h5>
                    <p className="text-sm text-white/85 max-w-md mx-auto">
                      Thank you for reaching out to Mrs. Smita Pawar. Your email client is opening with pre-filled details.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormSubmitted(false)}
                      className="mt-3 text-sm text-[#FFA81F] font-bold underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs sm:text-sm text-white/80 block mb-1.5 font-semibold">Your Full Name</label>
                        <input
                          className="w-full bg-[#111111]/80 text-white placeholder-white/40 text-sm sm:text-base rounded-xl border border-white/20 px-4 py-3.5 focus:outline-none focus:border-[#FFA81F]"
                          placeholder="Dr. / Prof. / Student Name"
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          type="text"
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm text-white/80 block mb-1.5 font-semibold">Your Email Address</label>
                        <input
                          className="w-full bg-[#111111]/80 text-white placeholder-white/40 text-sm sm:text-base rounded-xl border border-white/20 px-4 py-3.5 focus:outline-none focus:border-[#FFA81F]"
                          placeholder="name@institution.edu"
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          type="email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm text-white/80 block mb-1.5 font-semibold">Purpose of Contact</label>
                      <select
                        value={formState.category}
                        onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                        className="w-full bg-[#111111]/80 text-white text-sm sm:text-base rounded-xl border border-white/20 px-4 py-3 focus:outline-none focus:border-[#FFA81F]"
                      >
                        <option value="Research Collaboration">Research Collaboration (VLSI / WMSN)</option>
                        <option value="Guest Lecture">Invited Guest Lecture / Workshop</option>
                        <option value="Student Mentorship">Student Mentorship &amp; DMIT Guidance</option>
                        <option value="Curriculum Advisory">Curriculum &amp; Examination Advisory</option>
                        <option value="General Inquiry">General Academic Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm text-white/80 block mb-1.5 font-semibold">Subject &amp; Message</label>
                      <textarea
                        className="w-full bg-[#111111]/80 text-white placeholder-white/40 text-sm sm:text-base rounded-xl border border-white/20 px-4 py-3.5 focus:outline-none focus:border-[#FFA81F]"
                        placeholder="Provide details regarding research collaboration, guest lecture, or student mentorship..."
                        required
                        rows={4}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      ></textarea>
                    </div>

                    <button
                      className="w-full bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-black text-base py-4 rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2.5 shadow-xl"
                      type="submit"
                    >
                      <span>Send Direct Message</span>
                      <i className="fa-solid fa-paper-plane text-sm"></i>
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>

          {/* Bottom Footer Bar */}
          <div className="border-t border-white/15 pt-8 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#FFA81F] text-[#111111] font-heading font-black text-sm flex items-center justify-center shadow-md">
                SP
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-wide block">Mrs. Smita S. Pawar</span>
                <span className="text-xs text-white/60">
                  Assistant Professor • VLSI &amp; Embedded Systems Specialist
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-sm text-white/80 font-bold">
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
            </div>

            <p className="text-xs sm:text-sm text-white/50">© 2026 Mrs. Smita S. Pawar. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* END: ContactFooterSection */}

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
                <p className="text-xs sm:text-sm text-white/70">Mrs. Smita S. Pawar – 20 Years Engineering Profile</p>
              </div>
            </div>

            {cvRequested ? (
              <div className="bg-white/10 p-6 rounded-2xl text-center space-y-2.5">
                <CheckCircle2 className="w-9 h-9 text-[#FFA81F] mx-auto" />
                <h4 className="font-bold text-base">Request Dispatched</h4>
                <p className="text-sm text-white/80">
                  Your mail client has been opened to send the CV request directly to pawarsmita1020@dypiu.ac.in.
                </p>
                <button
                  onClick={() => setCvModalOpen(false)}
                  className="mt-3 bg-[#FFA81F] text-[#111111] font-bold text-sm py-2.5 px-6 rounded-full"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleCvRequest} className="space-y-4">
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
                className="bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-bold text-sm py-3 px-7 rounded-full shadow-md"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
