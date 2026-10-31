import React, { useState, useRef } from 'react';
import {
  PortfolioContent,
  StatBox,
  ResearchStatBox,
  ExamPillarBox,
  EducationItem,
  ExperienceItem,
  AwardItem
} from '../types/portfolio';
import { storePdfDocument, deletePdfDocument } from '../utils/pdfStorage';
import {
  X,
  Save,
  RotateCcw,
  Upload,
  Download,
  Image as ImageIcon,
  Sparkles,
  Award,
  BookOpen,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Eye,
  Plus,
  Trash2,
  ExternalLink,
  Layers,
  FileText,
  Maximize2,
  Minimize2,
  Video,
  Play
} from 'lucide-react';
import { getYouTubeEmbedUrl } from '../utils/youtube';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  content: PortfolioContent;
  onSave: (updated: PortfolioContent) => Promise<{ success: boolean; error?: string }> | void;
  onReset: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  content,
  onSave,
  onReset
}) => {
  const [data, setData] = useState<PortfolioContent>(() => ({
    ...content,
    featuredVideo: content.featuredVideo || {
      sectionTag: 'Keynote & Video Lectures',
      titlePrefix: 'Featured Video',
      titleHighlight: 'Presentation',
      description:
        'Keynote presentation on outcome-based engineering education, VLSI design pedagogy, and wireless multimedia networks.',
      youtubeUrl: 'https://www.youtube.com/watch?v=k7i2X4fB5jM',
      videoTitle: 'IUCEE Pedagogy & Advanced VLSI Circuit Systems Masterclass',
      badge: 'Featured Keynote Talk',
      caption:
        'Recorded academic session highlighting priority MAC scheduling algorithms, student mentoring pedagogies, and VLSI circuit prototyping.',
      viewsOrDuration: 'Academic Keynote Session'
    }
  }));
  const [activeTab, setActiveTab] = useState<
    'hero' | 'images' | 'about' | 'research' | 'video' | 'exam' | 'education' | 'experience' | 'awards' | 'contact' | 'backup'
  >('hero');
  const [saveToast, setSaveToast] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    saving: boolean;
    success?: boolean;
    message?: string;
  }>({ saving: false });
  const [uploadError, setUploadError] = useState<string | null>(null);

  // File upload input references
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process device image files (supports 2MB to 20MB PNG, JPG, JPEG, WEBP)
  const processImageFile = (
    file: File,
    onSuccess: (dataUrl: string) => void,
    maxDim: number = 1800
  ) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File size is larger than 25MB. Please upload an image under 20MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const rawDataUrl = loadEvent.target?.result as string;
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          const format = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const compressed = canvas.toDataURL(format, 0.92);
          onSuccess(compressed);
        } else {
          onSuccess(rawDataUrl);
        }
        setUploadError(null);
        showSaveSuccess();
      };
      img.onerror = () => {
        onSuccess(rawDataUrl);
        setUploadError(null);
        showSaveSuccess();
      };
      img.src = rawDataUrl;
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file from device. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Process device PDF files (supports 2MB to 20MB PDFs)
  const processPdfFile = (
    file: File,
    boxId: string,
    boxIdx: number
  ) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Please select a valid PDF file (.pdf).');
      return;
    }

    if (file.size > 3.5 * 1024 * 1024) {
      setUploadError(`File is ${fileSizeFormatted}. Direct database upload supports PDFs up to 3.5MB. For larger documents, please paste a Google Drive public link in the box below!`);
      return;
    }

    const fileSizeFormatted =
      file.size >= 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = async (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      try {
        await storePdfDocument(boxId, dataUrl);
      } catch (err) {
        console.warn('Could not store PDF in IndexedDB:', err);
      }

      const newStats = [...data.research.stats];
      newStats[boxIdx] = {
        ...newStats[boxIdx],
        pdfUrl: dataUrl,
        pdfFileName: file.name,
        pdfFileSize: fileSizeFormatted
      };

      setData((prev) => ({
        ...prev,
        research: {
          ...prev.research,
          stats: newStats
        }
      }));
      setUploadError(null);
      showSaveSuccess();
    };
    reader.onerror = () => {
      setUploadError('Failed to read PDF file from device. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Handle direct device file upload for Hero / About
  const handleDeviceImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'heroCutout' | 'aboutProfile'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processImageFile(file, (dataUrl) => {
      setData((prev) => ({
        ...prev,
        images: {
          ...prev.images,
          [field]: dataUrl
        }
      }));
    });
  };

  // Handle direct device file upload for individual Award Certificates (2MB - 20MB)
  const handleAwardImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    awardIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processImageFile(file, (dataUrl) => {
      const updated = [...data.awards];
      updated[awardIndex] = {
        ...updated[awardIndex],
        imageUrl: dataUrl
      };
      setData((prev) => ({
        ...prev,
        awards: updated
      }));
    });
  };

  const showSaveSuccess = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2800);
  };

  const handleApplySave = async () => {
    setSaveStatus({ saving: true, message: 'Syncing to Hostinger MySQL Database...' });
    try {
      const res = await onSave(data);
      if (res && res.success) {
        setSaveStatus({
          saving: false,
          success: true,
          message: 'Saved & Published to Hostinger MySQL Database successfully!'
        });
      } else if (res && res.error) {
        setSaveStatus({
          saving: false,
          success: false,
          message: res.error
        });
      } else {
        setSaveStatus({
          saving: false,
          success: true,
          message: 'Website updated and published!'
        });
      }
    } catch (err: any) {
      setSaveStatus({
        saving: false,
        success: false,
        message: err.message || 'Save failed'
      });
    }
    setTimeout(() => {
      setSaveStatus({ saving: false });
    }, 4500);
  };

  // Export content to a JSON file for backup
  const handleExportBackup = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smita-pawar-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import content from a backup JSON file
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.hero && parsed.about && parsed.research) {
          setData(parsed);
          onSave(parsed);
          showSaveSuccess();
        } else {
          alert('Invalid portfolio backup file. Required sections are missing.');
        }
      } catch (err) {
        alert('Could not parse JSON file. Please ensure it is a valid backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    /* Full-screen, edge-to-edge, spacious Admin Studio */
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-[#111111] text-white flex flex-col overflow-hidden animate-fade-in font-sans">
      {/* Top Header Bar - Large & Commanding */}
      <header className="px-6 sm:px-8 py-5 border-b border-white/15 bg-[#171717] flex flex-wrap items-center justify-between gap-4 flex-shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFA81F] text-[#111111] flex items-center justify-center font-black text-2xl shadow-xl flex-shrink-0">
            <Sparkles className="w-7 h-7 text-[#111111]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading font-black text-xl sm:text-2xl md:text-3xl text-white tracking-tight">
                Portfolio Admin Studio
              </h1>
              <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-[#FFA81F]/20 text-[#FFA81F] border border-[#FFA81F]/40 shadow-sm">
                FULL CUSTOMIZER
              </span>
            </div>
            <p className="text-sm sm:text-base text-white/70 font-medium mt-0.5">
              Edit all website titles, headlines, 4-box cards, and upload device photos with live updates
            </p>
          </div>
        </div>

        {/* Top Action Buttons - Large, High Contrast */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleApplySave}
            className="bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-heading font-black text-sm sm:text-base px-6 py-3 rounded-2xl flex items-center gap-2.5 shadow-xl hover:shadow-[#FFA81F]/20 active:scale-95 transition-all cursor-pointer"
            title="Save all changes to website"
          >
            <Save className="w-5 h-5 text-[#111111]" />
            <span>Save &amp; Publish Website</span>
          </button>

          <button
            onClick={() => {
              onSave(data);
              onClose();
            }}
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base px-5 py-3 rounded-2xl flex items-center gap-2 border border-white/15 transition-all cursor-pointer"
            title="Preview live site"
          >
            <Eye className="w-5 h-5 text-[#FFA81F]" />
            <span className="hidden sm:inline">Preview Live Website</span>
          </button>

          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
            title="Close Admin Studio"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Floating Save Notification Toast */}
      {saveStatus.saving && (
        <div className="fixed top-24 right-8 z-[110] bg-[#FFA81F] text-[#111111] px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-base font-bold animate-pulse border border-white/20">
          <Sparkles className="w-6 h-6 animate-spin" />
          <span>Syncing to Hostinger MySQL Database...</span>
        </div>
      )}
      {!saveStatus.saving && saveStatus.message && (
        <div className={`fixed top-24 right-8 z-[110] ${saveStatus.success ? 'bg-[#22C55E]' : 'bg-[#EF4444]'} text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-base font-bold animate-bounce border border-white/20 max-w-md`}>
          {saveStatus.success ? <CheckCircle className="w-6 h-6 flex-shrink-0" /> : <AlertCircle className="w-6 h-6 flex-shrink-0" />}
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* Main Studio Body: Large Sidebar on left, Expanded Content Area on right */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar - Wide, Large Labels & Icons */}
        <nav className="w-full md:w-80 lg:w-88 bg-[#161616] border-b md:border-b-0 md:border-r border-white/15 p-3 sm:p-5 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-2 flex-shrink-0">
          <div className="hidden md:block pb-2 mb-2 border-b border-white/10 px-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-white/50">
              Navigation &amp; Sections
            </span>
          </div>

          {[
            { id: 'hero', label: 'Hero & Headlines', icon: Sparkles, desc: 'Title, name, badges, CTA' },
            { id: 'images', label: 'Images & Photos', icon: ImageIcon, badge: 'Upload', desc: 'Hero cutout & profile' },
            { id: 'about', label: 'About & 4 Stat Boxes', icon: GraduationCap, desc: 'Bio & 4 metric counters' },
            { id: 'research', label: 'Research (4 Boxes & PDF)', icon: BookOpen, desc: 'Journals, Patents, Copyright, PDF' },
            { id: 'video', label: 'YouTube Video Player', icon: Video, badge: 'Video', desc: 'Big size featured lecture & URL' },
            { id: 'exam', label: 'Exam Head (4 Pillars)', icon: ShieldCheck, desc: 'Confidentiality, Convocation' },
            { id: 'education', label: 'Education Journey', icon: Layers, desc: 'PhD, M.E., B.E., Degrees' },
            { id: 'experience', label: 'Work Experience', icon: Briefcase, desc: 'DYPIU, MITAOE, TELCO' },
            { id: 'awards', label: 'Awards & Honors', icon: Award, desc: 'IUCEE, Best Faculty, Jury' },
            { id: 'contact', label: 'Contact Info & Links', icon: Phone, desc: 'Email, phone, campus' },
            { id: 'backup', label: 'Data & Backup', icon: Download, desc: 'Export / import JSON' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl text-left transition-all ${
                  isActive
                    ? 'bg-[#FFA81F] text-[#111111] shadow-xl font-black'
                    : 'text-white/80 hover:text-white hover:bg-white/5 font-bold'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-[#111111] text-[#FFA81F]' : 'bg-white/10 text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-base sm:text-lg block leading-tight">{tab.label}</span>
                    <span
                      className={`text-xs block mt-0.5 ${
                        isActive ? 'text-[#111111]/80 font-bold' : 'text-white/50'
                      }`}
                    >
                      {tab.desc}
                    </span>
                  </div>
                </div>

                {tab.badge && (
                  <span
                    className={`text-[10px] uppercase px-2 py-1 rounded-md font-black tracking-wider ${
                      isActive ? 'bg-[#111111] text-[#FFA81F]' : 'bg-[#FFA81F] text-[#111111]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="hidden md:block mt-auto pt-6 border-t border-white/10">
            <button
              onClick={() => {
                if (confirm('Reset all website texts, boxes, and photos back to factory defaults?')) {
                  onReset();
                  onClose();
                }
              }}
              className="w-full text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 py-3 px-4 rounded-xl flex items-center gap-2.5 transition-colors border border-red-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Factory Defaults</span>
            </button>
          </div>
        </nav>

        {/* Content Area - Expansive, Big Readable Inputs and Grids */}
        <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto bg-[#131313] space-y-8">
          {/* TAB 1: HERO & HEADLINES */}
          {activeTab === 'hero' && (
            <div className="space-y-8 max-w-5xl">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#FFA81F]">
                  Hero Section &amp; Main Headlines
                </h2>
                <p className="text-sm sm:text-base text-white/70 mt-1">
                  Control the hero greeting, full name, academic titles, distinction pill, and call-to-action buttons.
                </p>
              </div>

              {/* Distinction Pill */}
              <div className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border border-white/15 space-y-5 shadow-lg">
                <span className="text-sm font-black text-[#FFA81F] uppercase tracking-wider block">
                  Top Distinction Pill
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-bold text-white block mb-2">
                      Badge Recognition Text
                    </label>
                    <input
                      type="text"
                      value={data.hero.pill.badge}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: {
                            ...data.hero,
                            pill: { ...data.hero.pill, badge: e.target.value }
                          }
                        })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base sm:text-lg text-white font-medium focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white block mb-2">
                      Experience Summary Text
                    </label>
                    <input
                      type="text"
                      value={data.hero.pill.expText}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: {
                            ...data.hero,
                            pill: { ...data.hero.pill, expText: e.target.value }
                          }
                        })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base sm:text-lg text-[#FFA81F] font-bold focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Main Headline & Subtitle */}
              <div className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 shadow-lg">
                <span className="text-sm font-black text-[#FFA81F] uppercase tracking-wider block">
                  Main Hero Title &amp; Subtitle
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="text-sm font-bold text-white block mb-2">
                      Greeting Prefix (e.g. "I'm")
                    </label>
                    <input
                      type="text"
                      value={data.hero.greetingPrefix}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: { ...data.hero, greetingPrefix: e.target.value }
                        })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base sm:text-lg text-white font-medium focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-bold text-white block mb-2">
                      Full Name (Highlighted in Golden Amber)
                    </label>
                    <input
                      type="text"
                      value={data.hero.fullName}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: { ...data.hero, fullName: e.target.value }
                        })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base sm:text-lg text-[#FFA81F] font-black focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-white block mb-2">
                    Sub-headline / Academic Role &amp; Institution
                  </label>
                  <textarea
                    rows={2}
                    value={data.hero.subtitle}
                    onChange={(e) =>
                      setData({
                        ...data,
                        hero: { ...data.hero, subtitle: e.target.value }
                      })
                    }
                    className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base sm:text-lg text-white font-medium focus:border-[#FFA81F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Call-to-Action Buttons */}
              <div className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border border-white/15 space-y-5 shadow-lg">
                <span className="text-sm font-black text-[#FFA81F] uppercase tracking-wider block">
                  Action Buttons
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-bold text-white block mb-2">
                      Primary Button Label
                    </label>
                    <input
                      type="text"
                      value={data.hero.primaryCtaText}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: { ...data.hero, primaryCtaText: e.target.value }
                        })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base sm:text-lg text-white font-bold focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white block mb-2">
                      Secondary Button Label
                    </label>
                    <input
                      type="text"
                      value={data.hero.secondaryCtaText}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: { ...data.hero, secondaryCtaText: e.target.value }
                        })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base sm:text-lg text-white font-bold focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Side Bento Cards */}
              <div className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 shadow-lg">
                <span className="text-sm font-black text-[#FFA81F] uppercase tracking-wider block">
                  Hero Featured Side Bento Cards
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-bold text-white block mb-2">
                      Mentored Student Number (e.g. 1000+)
                    </label>
                    <input
                      type="text"
                      value={data.hero.cards.mentoredCount}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: {
                            ...data.hero,
                            cards: { ...data.hero.cards, mentoredCount: e.target.value }
                          }
                        })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-xl font-black text-[#FFA81F] focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white block mb-2">
                      Mentored Label
                    </label>
                    <input
                      type="text"
                      value={data.hero.cards.mentoredLabel}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: {
                            ...data.hero,
                            cards: { ...data.hero.cards, mentoredLabel: e.target.value }
                          }
                        })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base sm:text-lg text-white font-medium focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-white block mb-2">
                    Mentored Subtext / Description
                  </label>
                  <input
                    type="text"
                    value={data.hero.cards.mentoredSubtext}
                    onChange={(e) =>
                      setData({
                        ...data,
                        hero: {
                          ...data.hero,
                          cards: { ...data.hero.cards, mentoredSubtext: e.target.value }
                        }
                      })
                    }
                    className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base text-white focus:border-[#FFA81F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-white block mb-2">
                    Domain Specialty Description
                  </label>
                  <input
                    type="text"
                    value={data.hero.cards.domainDescription}
                    onChange={(e) =>
                      setData({
                        ...data,
                        hero: {
                          ...data.hero,
                          cards: { ...data.hero.cards, domainDescription: e.target.value }
                        }
                      })
                    }
                    className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base sm:text-lg text-white focus:border-[#FFA81F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-white block mb-2">
                    Faculty Quote Card
                  </label>
                  <textarea
                    rows={2}
                    value={data.hero.cards.quoteText}
                    onChange={(e) =>
                      setData({
                        ...data,
                        hero: {
                          ...data.hero,
                          cards: { ...data.hero.cards, quoteText: e.target.value }
                        }
                      })
                    }
                    className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base sm:text-lg text-white focus:border-[#FFA81F] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IMAGES & PHOTOS (DEVICE UPLOAD) */}
          {activeTab === 'images' && (
            <div className="space-y-8 max-w-5xl">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#FFA81F]">
                  Upload Images &amp; Change Website Photos
                </h2>
                <p className="text-sm sm:text-base text-white/70 mt-1">
                  Upload new images directly from your phone gallery or computer files. The photos are processed and updated live on the website.
                </p>
              </div>

              {uploadError && (
                <div className="bg-red-500/20 border-2 border-red-500 text-red-200 px-6 py-4 rounded-2xl flex items-center gap-4 text-base font-bold">
                  <AlertCircle className="w-6 h-6 flex-shrink-0 text-red-400" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Hero 3D Cutout Upload - Big & Prominent */}
              <div className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                      1. Main Hero Centerpiece Portrait Cutout
                    </h3>
                    <p className="text-sm text-white/70 mt-1">
                      The focal cutout photograph in the middle of Mrs. Smita Pawar's hero section.
                    </p>
                  </div>
                  <span className="text-xs bg-[#FFA81F]/20 text-[#FFA81F] px-3.5 py-1.5 rounded-full font-black border border-[#FFA81F]/40">
                    Supports PNG Cutouts &amp; Photos
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Large Live Preview Thumbnail */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-[#111111] border-2 border-white/15">
                    <div className="relative w-full max-w-[280px] h-72 sm:h-80 bg-[#F5F1E8] rounded-2xl overflow-hidden flex items-end justify-center shadow-inner">
                      <img
                        src={data.images.heroCutout}
                        alt="Hero Cutout Preview"
                        className="w-full h-full object-contain object-bottom drop-shadow-md"
                      />
                    </div>
                    <span className="text-xs sm:text-sm text-white/60 font-bold mt-3">
                      Current Live Photo Preview
                    </span>
                  </div>

                  {/* Big Upload Action Area */}
                  <div className="lg:col-span-7 space-y-5">
                    <input
                      type="file"
                      ref={heroImageInputRef}
                      accept="image/*"
                      onChange={(e) => handleDeviceImageUpload(e, 'heroCutout')}
                      className="hidden"
                    />

                    <div
                      onClick={() => heroImageInputRef.current?.click()}
                      className="border-3 border-dashed border-white/25 hover:border-[#FFA81F] rounded-3xl p-8 sm:p-10 text-center bg-white/[0.02] hover:bg-white/[0.06] transition-all cursor-pointer group"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-[#FFA81F]/20 text-[#FFA81F] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8" />
                      </div>
                      <h4 className="font-heading font-black text-lg sm:text-xl text-white">
                        Click Here to Choose Photo from Device
                      </h4>
                      <p className="text-sm text-white/60 mt-1.5 max-w-sm mx-auto">
                        Select any image from your smartphone gallery, downloads, or computer desktop
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() => heroImageInputRef.current?.click()}
                        className="bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-heading font-black text-sm sm:text-base px-6 py-3.5 rounded-2xl flex items-center gap-2.5 transition-all shadow-xl active:scale-95 cursor-pointer"
                      >
                        <Upload className="w-5 h-5 text-[#111111]" />
                        <span>Upload from Device</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setData({
                            ...data,
                            images: {
                              ...data.images,
                              heroCutout: '/assets/smita_pawar_3d.png'
                            }
                          });
                          showSaveSuccess();
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base px-5 py-3.5 rounded-2xl transition-all border border-white/15 cursor-pointer"
                      >
                        Reset to Original Cutout
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Profile Photo Upload */}
              <div className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                      2. About Section Academic Profile Photo
                    </h3>
                    <p className="text-sm text-white/70 mt-1">
                      The portrait card displayed inside the "Who is Smita Pawar?" academic biography section.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Large Live Preview Thumbnail */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-[#111111] border-2 border-white/15">
                    <div className="relative w-full max-w-[280px] h-72 sm:h-80 bg-[#FFA81F] rounded-2xl p-2.5 overflow-hidden flex items-end justify-center shadow-inner">
                      <div className="w-full h-full bg-[#F5F1E8] rounded-xl overflow-hidden flex items-end justify-center">
                        <img
                          src={data.images.aboutProfile}
                          alt="About Profile Preview"
                          className="w-full h-full object-contain object-bottom drop-shadow-md"
                        />
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-white/60 font-bold mt-3">
                      Current Profile Photo Preview
                    </span>
                  </div>

                  {/* Big Upload Action Area */}
                  <div className="lg:col-span-7 space-y-5">
                    <input
                      type="file"
                      ref={aboutImageInputRef}
                      accept="image/*"
                      onChange={(e) => handleDeviceImageUpload(e, 'aboutProfile')}
                      className="hidden"
                    />

                    <div
                      onClick={() => aboutImageInputRef.current?.click()}
                      className="border-3 border-dashed border-white/25 hover:border-[#FFA81F] rounded-3xl p-8 sm:p-10 text-center bg-white/[0.02] hover:bg-white/[0.06] transition-all cursor-pointer group"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-[#FFA81F]/20 text-[#FFA81F] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8" />
                      </div>
                      <h4 className="font-heading font-black text-lg sm:text-xl text-white">
                        Click Here to Choose Profile Photo from Device
                      </h4>
                      <p className="text-sm text-white/60 mt-1.5 max-w-sm mx-auto">
                        Upload professional headshot or campus photo from your device
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() => aboutImageInputRef.current?.click()}
                        className="bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-heading font-black text-sm sm:text-base px-6 py-3.5 rounded-2xl flex items-center gap-2.5 transition-all shadow-xl active:scale-95 cursor-pointer"
                      >
                        <Upload className="w-5 h-5 text-[#111111]" />
                        <span>Upload from Device</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setData({
                            ...data,
                            images: {
                              ...data.images,
                              aboutProfile: '/assets/smita_pawar_3d.png'
                            }
                          });
                          showSaveSuccess();
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base px-5 py-3.5 rounded-2xl transition-all border border-white/15 cursor-pointer"
                      >
                        Reset to Original Photo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT ME & 4 STAT COUNTERS */}
          {activeTab === 'about' && (
            <div className="space-y-8 max-w-5xl">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#FFA81F]">
                  About Me &amp; The 4 Stat Counter Boxes
                </h2>
                <p className="text-sm sm:text-base text-white/70 mt-1">
                  Full control over the 4 metric boxes (20+ Years, 06 Journals, 02 Patents, 25+ Conferences) and biographical texts.
                </p>
              </div>

              {/* The 4 Stat Boxes Editor - Big, Spacious, Large Numbers */}
              <div className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border-2 border-[#FFA81F]/40 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                      The 4 Stat Counter Boxes
                    </h3>
                    <p className="text-sm text-white/70 mt-1">
                      Prominent metric boxes displayed prominently in the About section
                    </p>
                  </div>
                  <span className="text-xs bg-[#FFA81F] text-[#111111] px-4 py-1.5 rounded-full font-black uppercase shadow-md">
                    4 BOXES
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.about.stats.map((stat, idx) => (
                    <div
                      key={stat.id || idx}
                      className="bg-[#141414] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-white/15 space-y-4 hover:border-[#FFA81F] transition-colors shadow-lg"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-sm font-black text-[#FFA81F] uppercase tracking-wider">
                          Stat Box #{idx + 1}
                        </span>
                        <span className="text-xs font-mono text-white/40">About Section</span>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs sm:text-sm font-bold text-white block mb-1.5">
                            Number / Digit
                          </label>
                          <input
                            type="text"
                            value={stat.digit}
                            onChange={(e) => {
                              const newStats = [...data.about.stats];
                              newStats[idx].digit = e.target.value;
                              setData({ ...data, about: { ...data.about, stats: newStats } });
                            }}
                            className="w-full bg-[#1C1C1C] border-2 border-white/20 rounded-xl px-3.5 py-3 text-2xl font-heading font-black text-[#FFA81F] text-center focus:border-[#FFA81F] focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs sm:text-sm font-bold text-white block mb-1.5">
                            Box Title / Label
                          </label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...data.about.stats];
                              newStats[idx].label = e.target.value;
                              setData({ ...data, about: { ...data.about, stats: newStats } });
                            }}
                            className="w-full bg-[#1C1C1C] border-2 border-white/20 rounded-xl px-4 py-3 text-base sm:text-lg font-bold text-white focus:border-[#FFA81F] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-bold text-white block mb-1.5">
                          Subtext / Description
                        </label>
                        <input
                          type="text"
                          value={stat.subtext}
                          onChange={(e) => {
                            const newStats = [...data.about.stats];
                            newStats[idx].subtext = e.target.value;
                            setData({ ...data, about: { ...data.about, stats: newStats } });
                          }}
                          className="w-full bg-[#1C1C1C] border-2 border-white/20 rounded-xl px-4 py-3 text-sm sm:text-base text-white/90 focus:border-[#FFA81F] focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio Paragraphs */}
              <div className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 shadow-lg">
                <span className="text-sm font-black text-[#FFA81F] uppercase tracking-wider block">
                  Bio Paragraphs
                </span>
                <div>
                  <label className="text-sm font-bold text-white block mb-2">
                    Paragraph 1 (Experience, Background &amp; Engineering Pedagogy)
                  </label>
                  <textarea
                    rows={4}
                    value={data.about.bioParagraph1}
                    onChange={(e) =>
                      setData({
                        ...data,
                        about: { ...data.about, bioParagraph1: e.target.value }
                      })
                    }
                    className="w-full bg-[#111111] border-2 border-white/20 rounded-xl p-4 text-base sm:text-lg text-white font-medium leading-relaxed focus:border-[#FFA81F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-white block mb-2">
                    Paragraph 2 (PhD Credentials, Examination Leadership &amp; Student Mentorship)
                  </label>
                  <textarea
                    rows={4}
                    value={data.about.bioParagraph2}
                    onChange={(e) =>
                      setData({
                        ...data,
                        about: { ...data.about, bioParagraph2: e.target.value }
                      })
                    }
                    className="w-full bg-[#111111] border-2 border-white/20 rounded-xl p-4 text-base sm:text-lg text-white font-medium leading-relaxed focus:border-[#FFA81F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Badges */}
              <div className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border border-white/15 space-y-5 shadow-lg">
                <span className="text-sm font-black text-[#FFA81F] uppercase tracking-wider block">
                  Profile Badges
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-bold text-white block mb-2">Left Badge</label>
                    <input
                      type="text"
                      value={data.about.badge1}
                      onChange={(e) =>
                        setData({ ...data, about: { ...data.about, badge1: e.target.value } })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3 text-base text-white focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white block mb-2">Right Badge</label>
                    <input
                      type="text"
                      value={data.about.badge2}
                      onChange={(e) =>
                        setData({ ...data, about: { ...data.about, badge2: e.target.value } })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3 text-base text-white focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RESEARCH & PUBLICATIONS (4 BOXES & DISSERTATION) */}
          {activeTab === 'research' && (
            <div className="space-y-8 max-w-5xl">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#FFA81F]">
                  Research &amp; Publications (4 Boxes Grid)
                </h2>
                <p className="text-sm sm:text-base text-white/70 mt-1">
                  Edit the 4 research output boxes (Journals, Conferences, Patents, Copyright) and the Master's Dissertation feature.
                </p>
              </div>

              {/* The 4 Research Stat Blocks - Large, Prominent, Clear Numbers */}
              <div className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border-2 border-[#FFA81F]/40 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                      The 4 Research Stat Blocks
                    </h3>
                    <p className="text-sm text-white/70 mt-1">
                      Digits, titles, subtexts, and badges for each of the 4 scholarly output boxes
                    </p>
                  </div>
                  <span className="text-xs bg-[#FFA81F] text-[#111111] px-4 py-1.5 rounded-full font-black uppercase shadow-md">
                    4 BOXES
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.research.stats.map((box, idx) => (
                    <div
                      key={box.id || idx}
                      className="bg-[#141414] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-white/15 space-y-4 hover:border-[#FFA81F] transition-colors shadow-lg"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-sm font-black text-[#FFA81F] uppercase tracking-wider">
                          Research Box #{idx + 1}
                        </span>
                        <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/90 font-mono font-bold">
                          {box.badge}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs sm:text-sm font-bold text-white block mb-1.5">
                            Digit / Count
                          </label>
                          <input
                            type="text"
                            value={box.digit}
                            onChange={(e) => {
                              const newStats = [...data.research.stats];
                              newStats[idx].digit = e.target.value;
                              setData({ ...data, research: { ...data.research, stats: newStats } });
                            }}
                            className="w-full bg-[#1C1C1C] border-2 border-white/20 rounded-xl px-3.5 py-3 text-2xl font-heading font-black text-[#FFA81F] text-center focus:border-[#FFA81F] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-bold text-white block mb-1.5">
                            Category Title
                          </label>
                          <input
                            type="text"
                            value={box.label}
                            onChange={(e) => {
                              const newStats = [...data.research.stats];
                              newStats[idx].label = e.target.value;
                              setData({ ...data, research: { ...data.research, stats: newStats } });
                            }}
                            className="w-full bg-[#1C1C1C] border-2 border-white/20 rounded-xl px-4 py-3 text-base sm:text-lg font-bold text-white focus:border-[#FFA81F] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-bold text-white block mb-1.5">
                            Badge
                          </label>
                          <input
                            type="text"
                            value={box.badge}
                            onChange={(e) => {
                              const newStats = [...data.research.stats];
                              newStats[idx].badge = e.target.value;
                              setData({ ...data, research: { ...data.research, stats: newStats } });
                            }}
                            className="w-full bg-[#1C1C1C] border-2 border-white/20 rounded-xl px-3 py-3 text-sm text-center text-white focus:border-[#FFA81F] focus:outline-none font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-bold text-white block mb-1.5">
                          Subtext / Publication Details
                        </label>
                        <input
                          type="text"
                          value={box.subtext}
                          onChange={(e) => {
                            const newStats = [...data.research.stats];
                            newStats[idx].subtext = e.target.value;
                            setData({ ...data, research: { ...data.research, stats: newStats } });
                          }}
                          className="w-full bg-[#1C1C1C] border-2 border-white/20 rounded-xl px-4 py-3 text-sm sm:text-base text-white/90 focus:border-[#FFA81F] focus:outline-none"
                        />
                      </div>

                      {/* Document Modal Title & Description */}
                      <div className="pt-2 border-t border-white/10 space-y-3">
                        <div>
                          <label className="text-xs sm:text-sm font-bold text-white block mb-1">
                            Document Modal Title
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Scopus Indexed Journal Papers Dossier"
                            value={box.documentTitle || ''}
                            onChange={(e) => {
                              const newStats = [...data.research.stats];
                              newStats[idx].documentTitle = e.target.value;
                              setData({ ...data, research: { ...data.research, stats: newStats } });
                            }}
                            className="w-full bg-[#1C1C1C] border-2 border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#FFA81F] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-bold text-white block mb-1">
                            Document Summary / Modal Overview
                          </label>
                          <input
                            type="text"
                            placeholder="Brief description of research documents / papers"
                            value={box.documentDescription || ''}
                            onChange={(e) => {
                              const newStats = [...data.research.stats];
                              newStats[idx].documentDescription = e.target.value;
                              setData({ ...data, research: { ...data.research, stats: newStats } });
                            }}
                            className="w-full bg-[#1C1C1C] border-2 border-white/20 rounded-xl px-4 py-2.5 text-sm text-white/90 focus:border-[#FFA81F] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* PDF Upload Section for this Research Box (2MB–20MB) */}
                      <div className="pt-3 border-t border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#FFA81F] uppercase tracking-wider flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            Research PDF Document
                          </span>
                          <span className="text-[10px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded">
                            2MB – 20MB (.pdf)
                          </span>
                        </div>

                        {box.pdfUrl ? (
                          <div className="bg-[#1C1C1C] p-3.5 rounded-xl border border-emerald-500/40 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
                                <span className="text-xs font-bold text-emerald-300 truncate">
                                  {box.pdfFileName || `${box.label}-Document.pdf`}
                                </span>
                                {box.pdfFileSize && (
                                  <span className="text-[10px] text-white/60 font-mono">
                                    ({box.pdfFileSize})
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={async () => {
                                  await deletePdfDocument(box.id);
                                  const newStats = [...data.research.stats];
                                  newStats[idx] = {
                                    ...newStats[idx],
                                    pdfUrl: undefined,
                                    pdfFileName: undefined,
                                    pdfFileSize: undefined
                                  };
                                  setData({ ...data, research: { ...data.research, stats: newStats } });
                                  showSaveSuccess();
                                }}
                                className="text-rose-400 hover:text-rose-300 text-xs font-bold px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                                title="Remove PDF document"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Remove</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              <a
                                href={box.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-[#FFA81F] hover:underline flex items-center gap-1 bg-[#FFA81F]/10 px-3 py-1.5 rounded-lg border border-[#FFA81F]/30"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Preview Attached PDF</span>
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="application/pdf,.pdf"
                              id={`research-pdf-input-${box.id}`}
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  processPdfFile(file, box.id, idx);
                                  e.target.value = '';
                                }
                              }}
                            />
                            <label
                              htmlFor={`research-pdf-input-${box.id}`}
                              className="w-full bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-heading font-black text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                            >
                              <Upload className="w-4 h-4 text-[#111111]" />
                              <span>Upload {box.label} PDF from Device</span>
                            </label>

                            {/* Optional direct URL input */}
                            <div className="pt-1">
                              <input
                                type="url"
                                placeholder="Or enter direct PDF URL (e.g. Google Drive/hosted PDF)"
                                value={box.pdfUrl || ''}
                                onChange={(e) => {
                                  const newStats = [...data.research.stats];
                                  newStats[idx].pdfUrl = e.target.value || undefined;
                                  newStats[idx].pdfFileName = e.target.value ? `${box.label}-Web-Document.pdf` : undefined;
                                  setData({ ...data, research: { ...data.research, stats: newStats } });
                                }}
                                className="w-full bg-[#1C1C1C] border border-white/15 rounded-xl px-3 py-2 text-xs text-white/80 focus:border-[#FFA81F] focus:outline-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Master's Dissertation Feature */}
              <div className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 shadow-lg">
                <span className="text-sm font-black text-[#FFA81F] uppercase tracking-wider block">
                  Featured Master's Dissertation Banner
                </span>
                <div>
                  <label className="text-sm font-bold text-white block mb-2">
                    Dissertation Title
                  </label>
                  <input
                    type="text"
                    value={data.research.dissertation.title}
                    onChange={(e) =>
                      setData({
                        ...data,
                        research: {
                          ...data.research,
                          dissertation: {
                            ...data.research.dissertation,
                            title: e.target.value
                          }
                        }
                      })
                    }
                    className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base sm:text-lg text-white font-bold focus:border-[#FFA81F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-white block mb-2">
                    Abstract &amp; Research Contribution
                  </label>
                  <textarea
                    rows={4}
                    value={data.research.dissertation.description}
                    onChange={(e) =>
                      setData({
                        ...data,
                        research: {
                          ...data.research,
                          dissertation: {
                            ...data.research.dissertation,
                            description: e.target.value
                          }
                        }
                      })
                    }
                    className="w-full bg-[#111111] border-2 border-white/20 rounded-xl p-4 text-base sm:text-lg text-white font-medium leading-relaxed focus:border-[#FFA81F] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: FEATURED YOUTUBE VIDEO SECTION */}
          {activeTab === 'video' && (
            <div className="space-y-8 max-w-5xl">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#FFA81F]">
                  Featured YouTube Video Player
                </h2>
                <p className="text-sm sm:text-base text-white/70 mt-1">
                  Upload or paste a YouTube video link to showcase an interactive video player positioned directly below Research &amp; Publications.
                </p>
              </div>

              {/* YouTube Link Configuration Card */}
              <div className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border-2 border-[#FFA81F]/40 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-black">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-xl text-white">
                        YouTube Link &amp; Cinema Player
                      </h3>
                      <p className="text-xs sm:text-sm text-white/60">
                        Paste any YouTube video link (watch URL, youtu.be, shorts, or embed code)
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-red-600/90 text-white font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                    SINGLE FEATURED VIDEO
                  </span>
                </div>

                {/* URL Input */}
                <div>
                  <label className="text-sm font-bold text-white block mb-2">
                    YouTube Video URL or Share Link
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="url"
                      placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      value={data.featuredVideo.youtubeUrl}
                      onChange={(e) =>
                        setData({
                          ...data,
                          featuredVideo: {
                            ...data.featuredVideo,
                            youtubeUrl: e.target.value
                          }
                        })
                      }
                      className="flex-1 bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base sm:text-lg text-white font-medium focus:border-[#FFA81F] focus:outline-none"
                    />
                    <a
                      href={data.featuredVideo.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-5 py-3.5 rounded-xl border border-white/15 flex items-center justify-center gap-2 transition-colors flex-shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Test on YouTube</span>
                    </a>
                  </div>
                  <span className="text-xs text-white/50 block mt-2">
                    Tip: You can paste links like <code className="text-[#FFA81F]">https://www.youtube.com/watch?v=...</code>, <code className="text-[#FFA81F]">https://youtu.be/...</code>, or mobile shorts. It will automatically convert to a responsive embed player.
                  </span>
                </div>

                {/* Box Sizing Selector for Website Display */}
                <div className="bg-[#141414] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-bold text-white block">
                        Video Box Size on Website
                      </label>
                      <p className="text-xs text-white/60">
                        Adjust how large or compact the video container appears on the portfolio page
                      </p>
                    </div>
                    <span className="text-xs bg-[#FFA81F]/20 text-[#FFA81F] px-2.5 py-1 rounded-full font-bold">
                      {(data.featuredVideo.boxSize || 'medium').toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setData({
                          ...data,
                          featuredVideo: { ...data.featuredVideo, boxSize: 'compact' }
                        });
                        showSaveSuccess();
                      }}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        data.featuredVideo.boxSize === 'compact'
                          ? 'border-[#FFA81F] bg-[#FFA81F]/15 text-white'
                          : 'border-white/15 bg-[#1C1C1C] text-white/70 hover:border-white/30'
                      }`}
                    >
                      <div className="text-xs font-black text-[#FFA81F]">Small / Compact</div>
                      <div className="text-[11px] text-white/60 mt-0.5">Narrower width (~576px)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setData({
                          ...data,
                          featuredVideo: { ...data.featuredVideo, boxSize: 'medium' }
                        });
                        showSaveSuccess();
                      }}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        (data.featuredVideo.boxSize === 'medium' || !data.featuredVideo.boxSize)
                          ? 'border-[#FFA81F] bg-[#FFA81F]/15 text-white'
                          : 'border-white/15 bg-[#1C1C1C] text-white/70 hover:border-white/30'
                      }`}
                    >
                      <div className="text-xs font-black text-[#FFA81F]">Balanced (Default)</div>
                      <div className="text-[11px] text-white/60 mt-0.5">Medium width (~768px)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setData({
                          ...data,
                          featuredVideo: { ...data.featuredVideo, boxSize: 'large' }
                        });
                        showSaveSuccess();
                      }}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        data.featuredVideo.boxSize === 'large'
                          ? 'border-[#FFA81F] bg-[#FFA81F]/15 text-white'
                          : 'border-white/15 bg-[#1C1C1C] text-white/70 hover:border-white/30'
                      }`}
                    >
                      <div className="text-xs font-black text-[#FFA81F]">Large / Wide</div>
                      <div className="text-[11px] text-white/60 mt-0.5">Wide cinema (~1024px)</div>
                    </button>
                  </div>
                </div>

                {/* Live Preview Inside Admin Studio */}
                <div className="pt-2">
                  <label className="text-xs font-bold text-white/80 uppercase tracking-wider block mb-2">
                    Live Video Player Preview (16:9 Aspect Ratio)
                  </label>
                  <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white/20 bg-black shadow-xl">
                    <iframe
                      src={getYouTubeEmbedUrl(data.featuredVideo.youtubeUrl)}
                      title={data.featuredVideo.videoTitle || 'YouTube Preview'}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>

                {/* Quick Presets for User */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
                  <span className="text-xs text-white/60 font-bold">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setData({
                        ...data,
                        featuredVideo: {
                          ...data.featuredVideo,
                          youtubeUrl: 'https://www.youtube.com/watch?v=k7i2X4fB5jM',
                          videoTitle: 'IUCEE Pedagogy & Advanced VLSI Circuit Systems Masterclass',
                          badge: 'Featured Keynote Talk'
                        }
                      });
                      showSaveSuccess();
                    }}
                    className="text-xs bg-white/10 hover:bg-white/20 text-[#FFA81F] font-bold px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
                  >
                    Load Educational Keynote Video
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setData({
                        ...data,
                        featuredVideo: {
                          ...data.featuredVideo,
                          youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
                        }
                      });
                      showSaveSuccess();
                    }}
                    className="text-xs bg-white/5 hover:bg-white/10 text-white/70 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Reset Video Link
                  </button>
                </div>
              </div>

              {/* Video Title, Badge, and Caption Customization */}
              <div className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 shadow-lg">
                <span className="text-sm font-black text-[#FFA81F] uppercase tracking-wider block">
                  Video Titles &amp; Information Overlay
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-bold text-white block mb-2">
                      Video Title / Keynote Topic
                    </label>
                    <input
                      type="text"
                      value={data.featuredVideo.videoTitle}
                      onChange={(e) =>
                        setData({
                          ...data,
                          featuredVideo: {
                            ...data.featuredVideo,
                            videoTitle: e.target.value
                          }
                        })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base sm:text-lg text-white font-bold focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white block mb-2">
                      Top Badge Text
                    </label>
                    <input
                      type="text"
                      value={data.featuredVideo.badge}
                      onChange={(e) =>
                        setData({
                          ...data,
                          featuredVideo: {
                            ...data.featuredVideo,
                            badge: e.target.value
                          }
                        })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base sm:text-lg text-[#FFA81F] font-bold focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-white block mb-2">
                    Video Caption &amp; Detailed Academic Description
                  </label>
                  <textarea
                    rows={3}
                    value={data.featuredVideo.caption}
                    onChange={(e) =>
                      setData({
                        ...data,
                        featuredVideo: {
                          ...data.featuredVideo,
                          caption: e.target.value
                        }
                      })
                    }
                    className="w-full bg-[#111111] border-2 border-white/20 rounded-xl p-4 text-base text-white font-medium leading-relaxed focus:border-[#FFA81F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Section Header Controls */}
              <div className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 shadow-lg">
                <span className="text-sm font-black text-[#FFA81F] uppercase tracking-wider block">
                  Section Headings &amp; Intro
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="text-sm font-bold text-white block mb-2">
                      Category Tag (Small Pill)
                    </label>
                    <input
                      type="text"
                      value={data.featuredVideo.sectionTag}
                      onChange={(e) =>
                        setData({
                          ...data,
                          featuredVideo: {
                            ...data.featuredVideo,
                            sectionTag: e.target.value
                          }
                        })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3 text-base text-white focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white block mb-2">
                      Title Prefix
                    </label>
                    <input
                      type="text"
                      value={data.featuredVideo.titlePrefix}
                      onChange={(e) =>
                        setData({
                          ...data,
                          featuredVideo: {
                            ...data.featuredVideo,
                            titlePrefix: e.target.value
                          }
                        })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3 text-base text-white focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white block mb-2">
                      Highlighted Title (Amber)
                    </label>
                    <input
                      type="text"
                      value={data.featuredVideo.titleHighlight}
                      onChange={(e) =>
                        setData({
                          ...data,
                          featuredVideo: {
                            ...data.featuredVideo,
                            titleHighlight: e.target.value
                          }
                        })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3 text-base text-[#FFA81F] font-bold focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-white block mb-2">
                    Section Description
                  </label>
                  <textarea
                    rows={2}
                    value={data.featuredVideo.description}
                    onChange={(e) =>
                      setData({
                        ...data,
                        featuredVideo: {
                          ...data.featuredVideo,
                          description: e.target.value
                        }
                      })
                    }
                    className="w-full bg-[#111111] border-2 border-white/20 rounded-xl p-4 text-base text-white font-medium leading-relaxed focus:border-[#FFA81F] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EXAMINATION COORDINATOR (4 PILLARS) */}
          {activeTab === 'exam' && (
            <div className="space-y-8 max-w-5xl">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#FFA81F]">
                  Examination Coordinator &amp; 4 Leadership Pillars
                </h2>
                <p className="text-sm sm:text-base text-white/70 mt-1">
                  Customize the institutional examination role and the 4 governance cards (Paper Confidentiality, Convocation Lead, Syllabus Audits, Student Grievances).
                </p>
              </div>

              {/* The 4 Leadership Pillars - Big, Clear, High-Contrast */}
              <div className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border-2 border-[#FFA81F]/40 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                      The 4 Governance Pillar Boxes
                    </h3>
                    <p className="text-sm text-white/70 mt-1">
                      Institutional responsibilities shown in the Examination Coordinator section
                    </p>
                  </div>
                  <span className="text-xs bg-[#FFA81F] text-[#111111] px-4 py-1.5 rounded-full font-black uppercase shadow-md">
                    4 BOXES
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.examCoordinator.pillars.map((pillar, idx) => (
                    <div
                      key={pillar.id || idx}
                      className="bg-[#141414] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-white/15 space-y-4 hover:border-[#FFA81F] transition-colors shadow-lg"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-sm font-black text-[#FFA81F] uppercase tracking-wider">
                          Pillar #{idx + 1}
                        </span>
                        <span className="text-xs font-mono text-white/40">Leadership Box</span>
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-bold text-white block mb-1.5">
                          Pillar Title
                        </label>
                        <input
                          type="text"
                          value={pillar.title}
                          onChange={(e) => {
                            const newPillars = [...data.examCoordinator.pillars];
                            newPillars[idx].title = e.target.value;
                            setData({
                              ...data,
                              examCoordinator: {
                                ...data.examCoordinator,
                                pillars: newPillars
                              }
                            });
                          }}
                          className="w-full bg-[#1C1C1C] border-2 border-white/20 rounded-xl px-4 py-3 text-base sm:text-lg font-bold text-white focus:border-[#FFA81F] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-bold text-white block mb-1.5">
                          Subtext / Focus Area
                        </label>
                        <input
                          type="text"
                          value={pillar.subtext}
                          onChange={(e) => {
                            const newPillars = [...data.examCoordinator.pillars];
                            newPillars[idx].subtext = e.target.value;
                            setData({
                              ...data,
                              examCoordinator: {
                                ...data.examCoordinator,
                                pillars: newPillars
                              }
                            });
                          }}
                          className="w-full bg-[#1C1C1C] border-2 border-white/20 rounded-xl px-4 py-3 text-sm sm:text-base text-white/90 focus:border-[#FFA81F] focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role Title & Administrative Details */}
              <div className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 shadow-lg">
                <span className="text-sm font-black text-[#FFA81F] uppercase tracking-wider block">
                  Institutional Leadership Role Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-bold text-white block mb-2">Role Title</label>
                    <input
                      type="text"
                      value={data.examCoordinator.roleTitle}
                      onChange={(e) =>
                        setData({
                          ...data,
                          examCoordinator: {
                            ...data.examCoordinator,
                            roleTitle: e.target.value
                          }
                        })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3 text-base sm:text-lg text-white font-bold focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white block mb-2">Tenure Period Badge</label>
                    <input
                      type="text"
                      value={data.examCoordinator.periodBadge}
                      onChange={(e) =>
                        setData({
                          ...data,
                          examCoordinator: {
                            ...data.examCoordinator,
                            periodBadge: e.target.value
                          }
                        })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3 text-base sm:text-lg text-white font-bold focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-white block mb-2">Administrative Overview</label>
                  <textarea
                    rows={4}
                    value={data.examCoordinator.description}
                    onChange={(e) =>
                      setData({
                        ...data,
                        examCoordinator: {
                          ...data.examCoordinator,
                          description: e.target.value
                        }
                      })
                    }
                    className="w-full bg-[#111111] border-2 border-white/20 rounded-xl p-4 text-base sm:text-lg text-white font-medium leading-relaxed focus:border-[#FFA81F] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: EDUCATION JOURNEY */}
          {activeTab === 'education' && (
            <div className="space-y-8 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#FFA81F]">
                    Education Journey &amp; Degrees
                  </h2>
                  <p className="text-sm sm:text-base text-white/70 mt-1">
                    Manage academic degrees, institutions, scores, and research projects.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newEdu: EducationItem = {
                      id: `edu-${Date.now()}`,
                      level: 'Higher Qualification',
                      degree: 'Degree / Certification Title',
                      institution: 'University / Institute Name',
                      scoreOrStatus: 'First Class / Grade',
                      statusType: 'completed',
                      description: 'Specialization coursework and honors.'
                    };
                    setData({ ...data, education: [newEdu, ...data.education] });
                  }}
                  className="bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-heading font-black text-sm px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer flex-shrink-0"
                >
                  <Plus className="w-5 h-5 text-[#111111]" />
                  <span>Add New Degree</span>
                </button>
              </div>

              <div className="space-y-6">
                {data.education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border border-white/15 space-y-4 relative group shadow-lg"
                  >
                    <button
                      onClick={() => {
                        const updated = data.education.filter((_, i) => i !== idx);
                        setData({ ...data, education: updated });
                      }}
                      className="absolute top-6 right-6 text-white/40 hover:text-red-400 p-2 rounded-xl transition-colors cursor-pointer"
                      title="Delete Degree"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pr-10">
                      <div>
                        <label className="text-sm font-bold text-white block mb-2">Degree Title</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[idx].degree = e.target.value;
                            setData({ ...data, education: updated });
                          }}
                          className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3 text-base sm:text-lg text-white font-bold focus:border-[#FFA81F] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-white block mb-2">University / Institute</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[idx].institution = e.target.value;
                            setData({ ...data, education: updated });
                          }}
                          className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3 text-base sm:text-lg text-white focus:border-[#FFA81F] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-bold text-white block mb-2">Grade / Status</label>
                        <input
                          type="text"
                          value={edu.scoreOrStatus}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[idx].scoreOrStatus = e.target.value;
                            setData({ ...data, education: updated });
                          }}
                          className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3 text-base text-[#FFA81F] font-bold focus:border-[#FFA81F] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-white block mb-2">Highlight / Dissertation</label>
                        <input
                          type="text"
                          value={edu.highlight || ''}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[idx].highlight = e.target.value;
                            setData({ ...data, education: updated });
                          }}
                          className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3 text-base text-white focus:border-[#FFA81F] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: WORK EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-8 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#FFA81F]">
                    Work Experience Timeline
                  </h2>
                  <p className="text-sm sm:text-base text-white/70 mt-1">
                    Manage 20 years of academic appointments, university leadership, and engineering training.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newExp: ExperienceItem = {
                      id: `exp-${Date.now()}`,
                      period: '2024 – Present',
                      role: 'Academic Role / Title',
                      institution: 'University / Institute Name',
                      department: 'Pune',
                      description: 'Key academic and research contributions.',
                      type: 'academic'
                    };
                    setData({ ...data, experience: [newExp, ...data.experience] });
                  }}
                  className="bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-heading font-black text-sm px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer flex-shrink-0"
                >
                  <Plus className="w-5 h-5 text-[#111111]" />
                  <span>Add New Position</span>
                </button>
              </div>

              <div className="space-y-6">
                {data.experience.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border border-white/15 space-y-4 relative group shadow-lg"
                  >
                    <button
                      onClick={() => {
                        const updated = data.experience.filter((_, i) => i !== idx);
                        setData({ ...data, experience: updated });
                      }}
                      className="absolute top-6 right-6 text-white/40 hover:text-red-400 p-2 rounded-xl transition-colors cursor-pointer"
                      title="Delete Experience"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pr-10">
                      <div>
                        <label className="text-sm font-bold text-white block mb-2">Tenure Period</label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => {
                            const updated = [...data.experience];
                            updated[idx].period = e.target.value;
                            setData({ ...data, experience: updated });
                          }}
                          className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3 text-base text-[#FFA81F] font-bold focus:border-[#FFA81F] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm font-bold text-white block mb-2">Designation / Role Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...data.experience];
                            updated[idx].role = e.target.value;
                            setData({ ...data, experience: updated });
                          }}
                          className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3 text-base sm:text-lg text-white font-bold focus:border-[#FFA81F] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-white block mb-2">Institution / Organization</label>
                      <input
                        type="text"
                        value={exp.institution}
                        onChange={(e) => {
                          const updated = [...data.experience];
                          updated[idx].institution = e.target.value;
                          setData({ ...data, experience: updated });
                        }}
                        className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3 text-base text-white focus:border-[#FFA81F] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-white block mb-2">Work Overview &amp; Responsibilities</label>
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...data.experience];
                          updated[idx].description = e.target.value;
                          setData({ ...data, experience: updated });
                        }}
                        className="w-full bg-[#111111] border-2 border-white/20 rounded-xl p-4 text-base text-white leading-relaxed focus:border-[#FFA81F] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: AWARDS & HONORS */}
          {activeTab === 'awards' && (
            <div className="space-y-8 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#FFA81F]">
                    Awards, Honors &amp; Recognition
                  </h2>
                  <p className="text-sm sm:text-base text-white/70 mt-1">
                    Manage pedagogical honors, IUCEE credentials, and jury recognitions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newAward: AwardItem = {
                      id: `award-${Date.now()}`,
                      category: 'Academic Distinction',
                      title: 'Award / Honor Title',
                      organization: 'Issuing Body',
                      description: 'Award description and recognition scope.',
                      icon: 'fa-trophy'
                    };
                    setData({ ...data, awards: [newAward, ...data.awards] });
                  }}
                  className="bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-heading font-black text-sm px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer flex-shrink-0"
                >
                  <Plus className="w-5 h-5 text-[#111111]" />
                  <span>Add New Award</span>
                </button>
              </div>

              <div className="space-y-6">
                {data.awards.map((award, idx) => (
                  <div
                    key={award.id || idx}
                    className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border border-white/15 space-y-4 relative group shadow-lg"
                  >
                    <button
                      onClick={() => {
                        const updated = data.awards.filter((_, i) => i !== idx);
                        setData({ ...data, awards: updated });
                      }}
                      className="absolute top-6 right-6 text-white/40 hover:text-red-400 p-2 rounded-xl transition-colors cursor-pointer"
                      title="Delete Award"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pr-10">
                      <div>
                        <label className="text-sm font-bold text-white block mb-2">Award Title</label>
                        <input
                          type="text"
                          value={award.title}
                          onChange={(e) => {
                            const updated = [...data.awards];
                            updated[idx].title = e.target.value;
                            setData({ ...data, awards: updated });
                          }}
                          className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3 text-base sm:text-lg text-white font-bold focus:border-[#FFA81F] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-white block mb-2">Category Badge</label>
                        <input
                          type="text"
                          value={award.category}
                          onChange={(e) => {
                            const updated = [...data.awards];
                            updated[idx].category = e.target.value;
                            setData({ ...data, awards: updated });
                          }}
                          className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3 text-base text-[#FFA81F] font-bold focus:border-[#FFA81F] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-white block mb-2">Issuing Body / Organization</label>
                      <input
                        type="text"
                        value={award.organization}
                        onChange={(e) => {
                          const updated = [...data.awards];
                          updated[idx].organization = e.target.value;
                          setData({ ...data, awards: updated });
                        }}
                        className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3 text-base text-white focus:border-[#FFA81F] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-white block mb-2">Citation Description</label>
                      <textarea
                        rows={2}
                        value={award.description}
                        onChange={(e) => {
                          const updated = [...data.awards];
                          updated[idx].description = e.target.value;
                          setData({ ...data, awards: updated });
                        }}
                        className="w-full bg-[#111111] border-2 border-white/20 rounded-xl p-4 text-base text-white focus:border-[#FFA81F] focus:outline-none"
                      />
                    </div>

                    {/* Certificate / Trophy Image Upload Section (Supports 2MB to 20MB in PNG, JPG) */}
                    <div className="pt-3 border-t border-white/10 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-sm font-black text-[#FFA81F] uppercase tracking-wider flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-[#FFA81F]" />
                          <span>Certificate / Trophy Photo (Supports 2MB – 20MB PNG / JPG)</span>
                        </span>
                        <span className="text-xs text-white/50">
                          Displays in full premium certificate showcase
                        </span>
                      </div>

                      {/* Hidden File Input for this specific award */}
                      <input
                        type="file"
                        id={`award-file-input-${idx}`}
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={(e) => handleAwardImageUpload(e, idx)}
                        className="hidden"
                      />

                      {award.imageUrl ? (
                        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-[#111111] border-2 border-[#FFA81F]/40 shadow-inner">
                          {/* Live Thumbnail */}
                          <div className="relative w-48 h-32 rounded-xl overflow-hidden bg-[#1A1A1A] border border-white/20 flex items-center justify-center flex-shrink-0 shadow-md">
                            <img
                              src={award.imageUrl}
                              alt={award.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-[#FFA81F] text-[#111111] p-1 rounded-md shadow">
                              <CheckCircle className="w-3.5 h-3.5" />
                            </div>
                          </div>

                          <div className="flex-1 space-y-2 text-center sm:text-left">
                            <h4 className="text-sm font-bold text-white">
                              Certificate Photo Attached
                            </h4>
                            <p className="text-xs text-white/60">
                              This certificate is now visible in the website's Awards &amp; Recognition showcase with zoom view.
                            </p>
                            <div className="flex flex-wrap items-center gap-3 pt-1 justify-center sm:justify-start">
                              <label
                                htmlFor={`award-file-input-${idx}`}
                                className="bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-bold text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                              >
                                <Upload className="w-3.5 h-3.5 text-[#111111]" />
                                <span>Change Photo</span>
                              </label>

                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...data.awards];
                                  updated[idx] = { ...updated[idx], imageUrl: undefined };
                                  setData({ ...data, awards: updated });
                                  showSaveSuccess();
                                }}
                                className="bg-red-500/15 hover:bg-red-500/25 text-red-300 font-bold text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 cursor-pointer border border-red-500/30 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove Photo</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            const inputEl = document.getElementById(`award-file-input-${idx}`) as HTMLInputElement;
                            inputEl?.click();
                          }}
                          className="border-2 border-dashed border-white/25 hover:border-[#FFA81F] rounded-2xl p-5 text-center bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer group"
                        >
                          <Upload className="w-6 h-6 text-[#FFA81F] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                          <p className="font-bold text-sm text-white">
                            Click to Upload Certificate Photo from Device
                          </p>
                          <p className="text-xs text-white/50 mt-0.5">
                            Supports PNG, JPG, JPEG from 2MB to 20MB (Smart high-resolution compression enabled)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: CONTACT & LINKS */}
          {activeTab === 'contact' && (
            <div className="space-y-8 max-w-5xl">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#FFA81F]">
                  Contact Information &amp; Official Links
                </h2>
                <p className="text-sm sm:text-base text-white/70 mt-1">
                  Update Mrs. Smita Pawar's official communication channels.
                </p>
              </div>

              <div className="bg-[#1C1C1C] p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 shadow-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-white block mb-2">Official University Email</label>
                    <input
                      type="email"
                      value={data.contact.email}
                      onChange={(e) =>
                        setData({
                          ...data,
                          contact: { ...data.contact, email: e.target.value }
                        })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base sm:text-lg text-white font-medium focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white block mb-2">Phone Number</label>
                    <input
                      type="text"
                      value={data.contact.phone}
                      onChange={(e) =>
                        setData({
                          ...data,
                          contact: { ...data.contact, phone: e.target.value }
                        })
                      }
                      className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base sm:text-lg text-white font-medium focus:border-[#FFA81F] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-white block mb-2">Campus Location Address</label>
                  <input
                    type="text"
                    value={data.contact.location}
                    onChange={(e) =>
                      setData({
                        ...data,
                        contact: { ...data.contact, location: e.target.value }
                      })
                    }
                    className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base sm:text-lg text-white font-medium focus:border-[#FFA81F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-white block mb-2">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={data.contact.linkedinUrl}
                    onChange={(e) =>
                      setData({
                        ...data,
                        contact: { ...data.contact, linkedinUrl: e.target.value }
                      })
                    }
                    className="w-full bg-[#111111] border-2 border-white/20 rounded-xl px-4 py-3.5 text-base text-white focus:border-[#FFA81F] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: DATA & BACKUP */}
          {activeTab === 'backup' && (
            <div className="space-y-8 max-w-5xl">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#FFA81F]">
                  Data Backup &amp; Portability
                </h2>
                <p className="text-sm sm:text-base text-white/70 mt-1">
                  Export all your customized texts, 4-box grids, and uploaded photos into a single backup file or restore anytime.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="bg-[#1C1C1C] p-8 rounded-3xl border border-white/15 space-y-5 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-[#FFA81F]/20 text-[#FFA81F] flex items-center justify-center mb-4">
                      <Download className="w-8 h-8" />
                    </div>
                    <h3 className="font-heading font-black text-xl text-white">
                      Export Full Portfolio Backup
                    </h3>
                    <p className="text-sm text-white/70 mt-2 leading-relaxed">
                      Download all current customized texts, stats, boxes, and uploaded photos as a `.json` backup file.
                    </p>
                  </div>

                  <button
                    onClick={handleExportBackup}
                    className="w-full bg-[#FFA81F] hover:bg-[#E59415] text-[#111111] font-heading font-black text-base py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all cursor-pointer"
                  >
                    <Download className="w-5 h-5 text-[#111111]" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-[#1C1C1C] p-8 rounded-3xl border border-white/15 space-y-5 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8" />
                    </div>
                    <h3 className="font-heading font-black text-xl text-white">
                      Restore from JSON Backup
                    </h3>
                    <p className="text-sm text-white/70 mt-2 leading-relaxed">
                      Load a previously downloaded backup file to instantly apply all your custom texts and photos.
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={importFileRef}
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />

                  <button
                    onClick={() => importFileRef.current?.click()}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-heading font-black text-base py-4 px-6 rounded-2xl flex items-center justify-center gap-3 border border-white/20 transition-all cursor-pointer"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload &amp; Restore Backup</span>
                  </button>
                </div>
              </div>

              {/* Reset to Factory Defaults */}
              <div className="bg-red-500/10 border-2 border-red-500/30 p-6 sm:p-8 rounded-3xl space-y-4">
                <div className="flex items-center gap-4">
                  <AlertCircle className="w-7 h-7 text-red-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-heading font-black text-lg text-red-200">
                      Reset Portfolio to Original Factory State
                    </h3>
                    <p className="text-sm text-red-300/80 mt-0.5">
                      This will remove all custom edits and restore the original verified academic portfolio content and photos.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to revert all text, boxes, and uploaded photos to factory defaults?')) {
                      onReset();
                      onClose();
                    }
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-heading font-black text-sm px-6 py-3.5 rounded-2xl transition-all cursor-pointer"
                >
                  Reset Everything to Default
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer Status Bar */}
      <footer className="px-6 sm:px-8 py-3.5 border-t border-white/15 bg-[#171717] flex flex-wrap items-center justify-between text-sm text-white/60 gap-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#22C55E] animate-pulse"></span>
          <span className="font-bold text-white/90">Persistent Storage Active</span>
          <span className="hidden sm:inline text-white/40">• Changes save across refreshes and devices</span>
        </div>
        <div className="flex items-center gap-5">
          <button
            onClick={handleApplySave}
            className="text-[#FFA81F] font-black hover:underline cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save &amp; Publish Website</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
