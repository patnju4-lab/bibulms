import React, { useState, useEffect, useRef } from 'react';
import { RPL_SLIDE_DECK, RPLSlide } from '../../data/rplSlideDeckData';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Grid,
  Play,
  Pause,
  Printer,
  FileText,
  Award,
  CheckCircle2,
  Cross,
  BookOpen,
  Calendar,
  Users,
  Shield,
  FileCheck,
  Building,
  Heart,
  Briefcase,
  Compass,
  GraduationCap,
  PenTool,
  Search,
  Globe,
  Video,
  Share2,
  HelpCircle,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  Check
} from 'lucide-react';

interface RplSlideDeckProps {
  initialSlide?: number;
  onClose?: () => void;
}

export const RplSlideDeck: React.FC<RplSlideDeckProps> = ({ initialSlide = 1, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(initialSlide - 1);
  const [viewMode, setViewMode] = useState<'slide' | 'grid'>('slide');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'standards' | 'documentation' | 'competencies'>('all');

  const containerRef = useRef<HTMLDivElement>(null);
  const totalSlides = RPL_SLIDE_DECK.length;
  const currentSlide = RPL_SLIDE_DECK[currentSlideIndex] || RPL_SLIDE_DECK[0];

  // Auto-play slideshow effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'slide') return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => (prev + 1 < totalSlides ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalSlides - 1));
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, totalSlides, isFullscreen]);

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1 < totalSlides ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalSlides - 1));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Render specific slide content based on slide number
  const renderSlideBody = (slide: RPLSlide, isThumbnail: boolean = false) => {
    switch (slide.slideNumber) {
      // 1. Title Slide
      case 1:
        return (
          <div className="h-full flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden bg-gradient-to-br from-[#001744] via-[#002366] to-[#0A3078] text-white">
            {/* Background geometric accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top row: Crest & Institution branding */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#997328] p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-[#001744] rounded-[10px] flex items-center justify-center text-[#C5A059]">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-display font-black tracking-wider text-white">BIBU</div>
                  <div className="text-[10px] sm:text-xs text-slate-300 font-bold uppercase tracking-widest">
                    Breakthrough International Bible University
                  </div>
                  <div className="text-[9px] text-[#C5A059] font-medium tracking-wide">Phoenix, Arizona, USA</div>
                </div>
              </div>

              <div className="hidden sm:inline-flex px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-bold uppercase tracking-wider">
                Official Academic Slide Deck • 15 Slides
              </div>
            </div>

            {/* Main Center Content */}
            <div className="my-auto py-6 text-center space-y-4 relative z-10 max-w-3xl mx-auto">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059] text-[#C5A059] text-xs sm:text-sm font-black uppercase tracking-widest">
                RECOGNITION OF PRIOR LEARNING (RPL)
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight leading-tight">
                RPL Counselling Session &amp; Evidence Collection
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto" />
              <p className="text-base sm:text-xl font-display text-[#C5A059] font-bold tracking-wide">
                CHRISTIAN MINISTRY / THEOLOGY PROGRAMMES
              </p>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                Standardized academic diagnostic, evidentiary scoping, and competency verification methodology for ministers, pastors, and church leaders.
              </p>
            </div>

            {/* Bottom Footer Ribbon */}
            <div className="border-t border-white/10 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 relative z-10">
              <span className="font-semibold text-slate-300 italic">
                Equipping Ministers. Transforming Lives. Impacting Nations.
              </span>
              <span className="font-mono text-[10px] text-[#C5A059]">Office of the University Registrar &amp; Academic Senate</span>
            </div>
          </div>
        );

      // 2. Purpose of RPL Counselling
      case 2:
        return (
          <div className="h-full flex flex-col justify-between p-6 sm:p-10 bg-white text-slate-900">
            {/* Header */}
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366] tracking-tight">
                PURPOSE OF RPL COUNSELLING
              </h2>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Diagnostic &amp; Scoping Stage</span>
            </div>

            {/* Content: Left Points + Right Graphic Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto items-center py-4">
              <div className="md:col-span-7 space-y-3.5">
                {[
                  { text: 'Identify existing knowledge, skills and experience', icon: Search },
                  { text: "Establish the candidate's RPL objectives", icon: Compass },
                  { text: 'Identify available evidence', icon: FileCheck },
                  { text: 'Identify evidence gaps', icon: Layers },
                  { text: 'Plan the assessment process', icon: Calendar }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs hover:bg-amber-50/40 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-[#002366] text-[#C5A059] flex items-center justify-center shrink-0 font-bold text-xs">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="md:col-span-5 bg-gradient-to-br from-[#001744] to-[#0A3078] text-white rounded-2xl p-6 shadow-md border-t-4 border-[#C5A059] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Academic Guidance Axiom</span>
                  </div>
                  <h4 className="text-base font-bold font-display text-white">Foundational Orientation</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Counselling provides a collaborative roadmap. It ensures ministerial candidates don't waste time assembling irrelevant materials while illuminating critical evidence already in their possession.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-xs italic text-slate-200 border-l-4 border-l-[#C5A059]">
                  "By wisdom a house is built, and through understanding it is established; through knowledge its rooms are filled with rare and beautiful treasures."
                  <div className="text-[10px] font-bold text-[#C5A059] mt-1 text-right">— Proverbs 24:3–4</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-500 flex justify-between">
              <span>BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.</span>
              <span className="font-bold text-[#002366]">Slide 2 / 15</span>
            </div>
          </div>
        );

      // 3. What Counts as RPL Evidence?
      case 3:
        return (
          <div className="h-full flex flex-col justify-between p-6 sm:p-10 bg-white text-slate-900">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366] tracking-tight">
                  WHAT COUNTS AS RPL EVIDENCE?
                </h2>
                <div className="text-xs text-slate-500 font-medium">The 5 Gold Standards of Academic Credential Evaluation (A.R.S.C.V.)</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#002366] text-[#C5A059] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
            </div>

            {/* 5 Evidence Standards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 my-auto py-4">
              {[
                { name: 'AUTHENTIC', desc: 'Genuine and created by the candidate or reliable source', tag: 'Direct Source', color: 'border-emerald-300 bg-emerald-50/50 text-emerald-900' },
                { name: 'RELEVANT', desc: 'Directly related to the unit or competency', tag: 'Curriculum Fit', color: 'border-blue-300 bg-blue-50/50 text-blue-900' },
                { name: 'SUFFICIENT', desc: 'Enough to demonstrate competence', tag: 'Full Depth', color: 'border-amber-300 bg-amber-50/50 text-amber-900' },
                { name: 'CURRENT', desc: 'Up to date and within a reasonable timeframe', tag: 'Contemporary', color: 'border-purple-300 bg-purple-50/50 text-purple-900' },
                { name: 'VERIFIABLE', desc: 'Can be checked and confirmed by an independent person', tag: 'Audit Trail', color: 'border-[#C5A059] bg-amber-50/70 text-[#002366]' }
              ].map((std, idx) => (
                <div key={idx} className={`p-4 rounded-xl border-2 flex flex-col justify-between space-y-3 ${std.color} shadow-xs`}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-full bg-[#002366] text-white text-xs font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200">
                        {std.tag}
                      </span>
                    </div>
                    <h3 className="text-sm font-black font-display tracking-tight text-[#002366] mb-1.5">{std.name}</h3>
                    <p className="text-xs leading-relaxed text-slate-700">{std.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/50 text-[10px] font-bold text-[#002366] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mandatory Rule</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-500 flex justify-between">
              <span>BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.</span>
              <span className="font-bold text-[#002366]">Slide 3 / 15</span>
            </div>
          </div>
        );

      // 4. Candidate RPL Counselling Form
      case 4:
        return (
          <div className="h-full flex flex-col justify-between p-6 sm:p-10 bg-white text-slate-900">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366] tracking-tight">
                  CANDIDATE RPL COUNSELLING FORM
                </h2>
                <div className="text-xs text-slate-500 font-medium">Standard Intake Document for Diagnostic Scoping &amp; Action Planning</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#002366] text-[#C5A059] text-[10px] font-bold uppercase tracking-wider">
                Form: BIBU-RPL-01
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto py-4 items-center">
              <div className="md:col-span-7 space-y-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Essential Form Sections:</div>
                {[
                  { title: 'Candidate Details', desc: 'Full legal name, contact numbers, email, church address, ministerial credentials.', icon: Users },
                  { title: 'Programme / Unit Being Assessed', desc: 'Target qualification (e.g. B.Th, M.Div, Dip.Th) and specific curricular modules.', icon: GraduationCap },
                  { title: 'Ministry Experience Summary', desc: 'Chronological track record, congregational size, ordinations, and executive duties.', icon: Briefcase },
                  { title: "Candidate's RPL Objectives", desc: 'Target credit hours requested, anticipated graduation roadmap, and fast-track goals.', icon: Compass },
                  { title: 'Previous Learning & Training', desc: 'Prior certificates, seminary workshops, denominational institutes, or Bible colleges.', icon: BookOpen }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#002366] text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-600 leading-tight mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Realistic Form Preview */}
              <div className="md:col-span-5 bg-amber-50/40 rounded-2xl border-2 border-dashed border-[#C5A059] p-5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <span className="font-bold text-[#002366] font-display">OFFICIAL INTAKE LOG</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">ACTIVE</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-700">
                  <div><strong>Candidate:</strong> Rev. Dr. John Doe</div>
                  <div><strong>Target:</strong> Bachelor of Theology (B.Th)</div>
                  <div><strong>Ministry:</strong> 14 Years Senior Pastor</div>
                  <div><strong>Target Credits:</strong> 24–36 Credit Hours</div>
                  <div><strong>Prior Bible School:</strong> Cert. in Biblical Studies (2014)</div>
                </div>
                <div className="border-t border-amber-200 pt-2 text-[10px] text-slate-500 italic">
                  Signed &amp; stamped by Candidate &amp; Assigned Academic RPL Counsellor
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-500 flex justify-between">
              <span>BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.</span>
              <span className="font-bold text-[#002366]">Slide 4 / 15</span>
            </div>
          </div>
        );

      // 5. Ministry Experience Evidence
      case 5:
        return (
          <div className="h-full flex flex-col justify-between p-6 sm:p-10 bg-white text-slate-900">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366] tracking-tight">
                  MINISTRY EXPERIENCE EVIDENCE
                </h2>
                <div className="text-xs text-slate-500 font-medium">Ecclesiastical Appointments, Ordinations &amp; Service Duration</div>
              </div>
              <span className="w-9 h-9 rounded-xl bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold text-sm">
                05
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto py-4 items-center">
              <div className="md:col-span-7 space-y-3">
                {[
                  { text: 'Church appointment / ordination letters', detail: 'Formal documentation verifying licensing, elder appointment, or pastoral consecration.', icon: Award },
                  { text: 'Employment or ministry service letters', detail: 'Signed letters from presiding overseers, presbyters, or denominational headquarters.', icon: FileText },
                  { text: 'Leadership appointment letters', detail: 'Departmental headship, trustee board appointments, regional oversight mandates.', icon: Users },
                  { text: 'Church membership / service records', detail: 'Historical congregational rosters, ministry reports, official anniversary brochures.', icon: Calendar },
                  { text: 'Evidence of years of ministry experience', detail: 'Longitudinal verification establishing sustained, active ministerial continuity over time.', icon: CheckCircle2 }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#002366] transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-[#002366] text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.text}</h4>
                      <p className="text-[11px] text-slate-600 leading-tight mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Visual Pillar: Golden Cross & Credential Seal */}
              <div className="md:col-span-5 bg-gradient-to-b from-[#001A4D] to-[#002366] text-white rounded-2xl p-6 shadow-md border-t-4 border-[#C5A059] text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#C5A059]/20 border border-[#C5A059] mx-auto flex items-center justify-center text-[#C5A059]">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold font-display text-white">Institutional Authenticity</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Letters of ordination and appointment must be verifiable on official letterhead, stamped, and signed by church overseers or board executives.
                </p>
                <div className="px-3 py-1.5 rounded-lg bg-white/10 text-[11px] font-mono text-[#C5A059]">
                  Mapped: PAS-200 / LED-201
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-500 flex justify-between">
              <span>BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.</span>
              <span className="font-bold text-[#002366]">Slide 5 / 15</span>
            </div>
          </div>
        );

      // 6. Sermon & Teaching Evidence
      case 6:
        return (
          <div className="h-full flex flex-col justify-between p-6 sm:p-10 bg-white text-slate-900">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366] tracking-tight">
                  SERMON &amp; TEACHING EVIDENCE
                </h2>
                <div className="text-xs text-slate-500 font-medium">Demonstrating Biblical Hermeneutics, Exegesis &amp; Homiletics</div>
              </div>
              <span className="w-9 h-9 rounded-xl bg-[#002366] text-[#C5A059] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto py-4 items-center">
              <div className="md:col-span-7 space-y-3">
                {[
                  { text: 'Sermon outlines', detail: 'Written homiletical manuscripts, structured points, Greek/Hebrew exegetical insights.' },
                  { text: 'Bible study notes', detail: 'Mid-week curriculum notes, discipleship guides, adult Bible class lesson plans.' },
                  { text: 'Teaching materials', detail: 'PowerPoint presentations, student handouts, doctrinal study series workbooks.' },
                  { text: 'Recorded sermons or teaching sessions', detail: 'Audio MP3 recordings, YouTube video links, sermon podcast episodes.' },
                  { text: 'Church programmes showing preaching assignments', detail: 'Dated weekly bulletins, conference flyers listing the candidate as speaker.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-[#002366] text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      0{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.text}</h4>
                      <p className="text-[11px] text-slate-600 leading-tight mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="md:col-span-5 bg-[#002366] text-white rounded-2xl p-6 border-b-4 border-[#C5A059] space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">Academic Units Satisfied</div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white/10 flex items-center justify-between">
                    <span>BIB-301: Biblical Hermeneutics</span>
                    <strong className="text-[#C5A059]">3 Credits</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/10 flex items-center justify-between">
                    <span>PAS-202: Expository Homiletics</span>
                    <strong className="text-[#C5A059]">3 Credits</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/10 flex items-center justify-between">
                    <span>THE-201: Doctrinal Teaching</span>
                    <strong className="text-[#C5A059]">3 Credits</strong>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 italic pt-1">
                  Evidence must demonstrate sound theological methodology and ability to communicate scriptural truth effectively.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-500 flex justify-between">
              <span>BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.</span>
              <span className="font-bold text-[#002366]">Slide 6 / 15</span>
            </div>
          </div>
        );

      // 7. Pastoral Care Evidence
      case 7:
        return (
          <div className="h-full flex flex-col justify-between p-6 sm:p-10 bg-white text-slate-900">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366] tracking-tight">
                  PASTORAL CARE EVIDENCE
                </h2>
                <div className="text-xs text-slate-500 font-medium">Shepherding, Pastoral Counseling, Chaplaincy &amp; Crisis Support</div>
              </div>
              <span className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto py-4 items-center">
              <div className="md:col-span-7 space-y-3">
                {[
                  { text: 'Pastoral visitation records', detail: 'Home visits, hospital chaplaincy logs, shut-in member support records.' },
                  { text: 'Counselling session records', detail: 'Anonymized case files for pre-marital counseling, spiritual direction, crisis mediation.' },
                  { text: 'Bereavement / ministry support records', detail: 'Funeral service orders, grief care tracking, family comfort ministries.' },
                  { text: 'Hospital or home visitation evidence', detail: 'Official hospital chaplain badges, visitor sign-in receipts, family acknowledgments.' },
                  { text: 'Referral records, where applicable', detail: 'Ethical cross-referral logs to medical, legal, or licensed mental health professionals.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-[#002366] text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.text}</h4>
                      <p className="text-[11px] text-slate-600 leading-tight mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Confidentiality & Ethics Box */}
              <div className="md:col-span-5 bg-rose-50/70 rounded-2xl border-2 border-rose-200 p-6 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                  <Shield className="w-4 h-4" />
                  <span>Mandatory Ethical Protocol</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 font-display">Client Privacy &amp; Data Redaction</h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  All submitted counseling and visitation logs <strong>must have all identifying names, addresses, and private particulars completely redacted</strong> in accordance with ministerial confidentiality protocols.
                </p>
                <div className="text-[10px] text-slate-500 border-t border-rose-200 pt-2">
                  Demonstrates compliance with Christian Ethics (ETH-301) and Pastoral Counselling (COU-202).
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-500 flex justify-between">
              <span>BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.</span>
              <span className="font-bold text-[#002366]">Slide 7 / 15</span>
            </div>
          </div>
        );

      // 8. Leadership & Administration Evidence
      case 8:
        return (
          <div className="h-full flex flex-col justify-between p-6 sm:p-10 bg-white text-slate-900">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366] tracking-tight">
                  LEADERSHIP &amp; ADMINISTRATION EVIDENCE
                </h2>
                <div className="text-xs text-slate-500 font-medium">Governance, Stewardship, Constitutional Order &amp; Strategy</div>
              </div>
              <span className="w-9 h-9 rounded-xl bg-[#002366] text-[#C5A059] flex items-center justify-center">
                <Building className="w-5 h-5" />
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto py-4">
              {[
                { title: 'Church Committee Minutes', desc: 'Board of trustees, deacons council, elder council minutes signed by secretary.', icon: FileText },
                { title: 'Leadership Reports', desc: 'Annual general meeting reports, departmental reviews, quarterly state-of-the-church audits.', icon: Briefcase },
                { title: 'Church Development Plans', desc: 'Strategic 5-year visions, church expansion blueprints, discipleship masterplans.', icon: Compass },
                { title: 'Meeting Agendas & Minutes', desc: 'Staff meetings, ministry retreat agendas, congregational business meetings.', icon: Calendar },
                { title: 'Financial / Administrative Oversight', desc: 'Budget approval documents, stewardship guidelines, financial policy manuals.', icon: Shield },
                { title: 'Project Management Evidence', desc: 'Church building campaigns, major convention coordination, fundraising initiatives.', icon: CheckCircle2 }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 hover:bg-slate-100/70 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#002366] text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-tight mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-500 flex justify-between">
              <span>BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.</span>
              <span className="font-bold text-[#002366]">Slide 8 / 15</span>
            </div>
          </div>
        );

      // 9. Evangelism, Mission & Community Service
      case 9:
        return (
          <div className="h-full flex flex-col justify-between p-6 sm:p-10 bg-white text-slate-900">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366] tracking-tight">
                  EVANGELISM, MISSION &amp; COMMUNITY SERVICE
                </h2>
                <div className="text-xs text-slate-500 font-medium">Great Commission Outreaches, Church Planting &amp; Societal Benevolence</div>
              </div>
              <span className="w-9 h-9 rounded-xl bg-[#002366] text-[#C5A059] flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 my-auto py-4">
              {[
                { title: 'Evangelism Reports', desc: 'Crusade records, open-air preaching, door-to-door evangelism tally and impact numbers.', icon: Globe },
                { title: 'Mission Trip Records', desc: 'Cross-cultural mission itineraries, regional expeditions, rural missionary assignments.', icon: Compass },
                { title: 'Outreach Programmes', desc: 'Food banks, prison ministry chaplaincy, street soup kitchens, youth sports camps.', icon: Heart },
                { title: 'Church Planting Evidence', desc: 'Daughter church charters, pioneer branch registries, inaugural attendance records.', icon: Building },
                { title: 'Community Service Activities', desc: 'Disaster relief, civic clean-up partnerships, youth tutoring and mentorship clinics.', icon: Users },
                { title: 'Photographs & Videos', desc: 'Time-stamped photographic albums, baptismal services, video clips of missions in action.', icon: Video }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[#002366]">
                      <item.icon className="w-4 h-4 text-[#C5A059]" />
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">{item.desc}</p>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded self-start font-bold">
                    Primary Artifact
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-500 flex justify-between">
              <span>BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.</span>
              <span className="font-bold text-[#002366]">Slide 9 / 15</span>
            </div>
          </div>
        );

      // 10. Training & Professional Development
      case 10:
        return (
          <div className="h-full flex flex-col justify-between p-6 sm:p-10 bg-white text-slate-900">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366] tracking-tight">
                  TRAINING &amp; PROFESSIONAL DEVELOPMENT
                </h2>
                <div className="text-xs text-slate-500 font-medium">Formal, Non-Formal &amp; Continuing Theological Education (CPD)</div>
              </div>
              <span className="w-9 h-9 rounded-xl bg-[#002366] text-[#C5A059] flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto py-4 items-center">
              <div className="md:col-span-7 space-y-3">
                {[
                  { title: 'Certificates of Completion', desc: 'Short-course certificates from accredited or unaccredited Bible colleges and institutes.' },
                  { title: 'Specialized Short Courses', desc: 'Intensives in biblical counseling, conflict resolution, worship leadership, Greek/Hebrew basics.' },
                  { title: 'Workshops & Seminars Attended', desc: 'Ministerial enrichment conferences, church growth summits, leadership retreats.' },
                  { title: 'Bible School / Theological Records', desc: 'Official or unofficial transcripts, course syllabi, diploma completion records.' },
                  { title: 'Continuing Professional Development (CPD)', desc: 'Ongoing ministerial licensure renewal credentials, professional chaplaincy CEUs.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#002366] text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Articulation Card */}
              <div className="md:col-span-5 bg-gradient-to-br from-[#002366] to-[#001744] text-white rounded-2xl p-6 shadow-md border-t-4 border-[#C5A059] space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#C5A059]">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold font-display text-white">Academic Articulation Mapping</h3>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Non-degree certifications can be cross-evaluated against standard BIBU course syllabi, granting direct modular exemptions when curriculum parity is proven.
                </p>
                <div className="p-2.5 rounded-lg bg-white/10 text-[10px] font-mono text-[#C5A059]">
                  Subject to Academic Senate evaluation
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-500 flex justify-between">
              <span>BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.</span>
              <span className="font-bold text-[#002366]">Slide 10 / 15</span>
            </div>
          </div>
        );

      // 11. Candidate Reflective Evidence
      case 11:
        return (
          <div className="h-full flex flex-col justify-between p-6 sm:p-10 bg-white text-slate-900">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366] tracking-tight">
                  CANDIDATE REFLECTIVE EVIDENCE
                </h2>
                <div className="text-xs text-slate-500 font-medium">Critical Theological Self-Evaluation &amp; Experiential Synthesis</div>
              </div>
              <span className="w-9 h-9 rounded-xl bg-[#002366] text-[#C5A059] flex items-center justify-center">
                <PenTool className="w-5 h-5" />
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto py-4 items-center">
              <div className="md:col-span-7 space-y-3">
                {[
                  { title: 'Written Reflection on Ministry Experience', desc: 'Narrative account synthesizing spiritual calling, theological growth, and ministerial milestones.' },
                  { title: 'Description of Major Ministry Responsibilities', desc: 'Comprehensive self-audit of preaching, stewardship, governance, and spiritual shepherding.' },
                  { title: 'Challenges Encountered & Solutions Applied', desc: 'How church disputes, theological controversies, or ethical hurdles were navigated scripturally.' },
                  { title: 'Examples Demonstrating Problem-Solving & Leadership', desc: 'Case studies of church revitalization, building projects, or community reconciliation.' },
                  { title: 'Lessons Learned from Ministry Practice', desc: 'Self-awareness, emotional maturity, humility, and ongoing spiritual formation insights.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#002366] text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
                      <PenTool className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reflection Requirements */}
              <div className="md:col-span-5 bg-amber-50/60 rounded-2xl border-2 border-[#C5A059] p-6 space-y-3">
                <div className="text-xs font-bold text-[#002366] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>The Reflection Benchmark</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 font-display">Converting Experience into Academic Wisdom</h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  "Experience alone is not learning. It is reflection on experience that produces genuine academic and theological competency."
                </p>
                <div className="text-[11px] text-slate-600 font-mono pt-2 border-t border-amber-200">
                  Length: 2,000 – 3,000 words<br />
                  Rubric: Evaluated for theological depth &amp; personal integrity.
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-500 flex justify-between">
              <span>BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.</span>
              <span className="font-bold text-[#002366]">Slide 11 / 15</span>
            </div>
          </div>
        );

      // 12. Counsellor / Assessor Interview Notes
      case 12:
        return (
          <div className="h-full flex flex-col justify-between p-6 sm:p-10 bg-white text-slate-900">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366] tracking-tight">
                  COUNSELLOR / ASSESSOR INTERVIEW NOTES
                </h2>
                <div className="text-xs text-slate-500 font-medium">Oral Examination, Authenticity Cross-Check &amp; Gap Identification</div>
              </div>
              <span className="w-9 h-9 rounded-xl bg-[#002366] text-[#C5A059] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto py-4 items-center">
              <div className="md:col-span-7 space-y-3">
                {[
                  { title: 'Questions Asked', desc: 'Targeted oral questions probing biblical interpretation, ethics, pastoral counseling, and leadership decisions.', icon: HelpCircle },
                  { title: "Candidate's Responses", desc: 'Spoken theological arguments, demonstration of doctrinal clarity, and personal ministerial demeanor.', icon: BookOpen },
                  { title: 'Competencies Demonstrated', desc: 'Documented verification that candidate meets specific collegiate course learning outcomes.', icon: CheckCircle2 },
                  { title: 'Assessor Observations', desc: 'Independent notes on ministerial poise, humility, communication clarity, and pastoral temperament.', icon: Users },
                  { title: 'Further Evidence Required', desc: 'Identified gaps where the candidate must furnish supplemental documents or complete bridge coursework.', icon: Info }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#002366] text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Assessor Rubric Box */}
              <div className="md:col-span-5 bg-gradient-to-br from-[#001A4D] to-[#002366] text-white rounded-2xl p-6 shadow-md border-t-4 border-[#C5A059] space-y-3">
                <div className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">Assessor Dual Role</div>
                <h4 className="text-base font-bold font-display text-white">Guide &amp; Gatekeeper</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  During counselling, the assessor is an advisor helping plan evidence. During assessment, the assessor acts as an impartial academic gatekeeper maintaining university standards.
                </p>
                <div className="p-3 rounded-xl bg-white/10 text-[11px] text-slate-200 italic border-l-2 border-[#C5A059]">
                  "Interview notes become part of the permanent student academic record."
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-500 flex justify-between">
              <span>BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.</span>
              <span className="font-bold text-[#002366]">Slide 12 / 15</span>
            </div>
          </div>
        );

      // 13. Third-Party & Digital Verification
      case 13:
        return (
          <div className="h-full flex flex-col justify-between p-6 sm:p-10 bg-white text-slate-900">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366] tracking-tight">
                  THIRD-PARTY &amp; DIGITAL VERIFICATION
                </h2>
                <div className="text-xs text-slate-500 font-medium">Independent Corroboration &amp; Contemporary Digital Footprint</div>
              </div>
              <span className="w-9 h-9 rounded-xl bg-[#002366] text-[#C5A059] flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto py-4">
              {/* Column 1: Third-Party Verification */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#002366] text-[#C5A059] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold font-display text-[#002366] uppercase tracking-wider">
                    Third-Party Verification
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {[
                    { title: 'Referee Statements', desc: 'Formal confidential references from senior ministers, bishops, or elders.' },
                    { title: 'Pastor / Supervisor Confirmation', desc: 'Direct written validation of role, character, and hours served.' },
                    { title: 'Church Leader Verification', desc: 'Attestation by church governing council, deacons, or executive trustees.' },
                    { title: 'Employer / Organisation Confirmation', desc: 'NGO, chaplaincy, Christian school, or denominational headquarters.' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
                      <strong className="text-slate-900 block">{item.title}</strong>
                      <span className="text-slate-600 text-[11px] leading-tight">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Digital Evidence */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#002366] text-[#C5A059] flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold font-display text-[#002366] uppercase tracking-wider">
                    Digital Evidence
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {[
                    { title: 'Ministry Website & Social Media', desc: 'Verified church website, official Facebook page, ministry bios.' },
                    { title: 'Online Sermons', desc: 'Livestreams, Vimeo recordings, sermon archives, podcasts.' },
                    { title: 'YouTube Teaching Links', desc: 'Public or unlisted links to sermon delivery, conferences, ordination ceremonies.' },
                    { title: 'Digital Ministry Reports & Records', desc: 'PDF newsletters, digital bulletins, electronic attendance & giving audits.' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
                      <strong className="text-slate-900 block">{item.title}</strong>
                      <span className="text-slate-600 text-[11px] leading-tight">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-500 flex justify-between">
              <span>BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.</span>
              <span className="font-bold text-[#002366]">Slide 13 / 15</span>
            </div>
          </div>
        );

      // 14. Evidence of Competence
      case 14:
        return (
          <div className="h-full flex flex-col justify-between p-6 sm:p-10 bg-white text-slate-900">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366] tracking-tight">
                  EVIDENCE OF COMPETENCE
                </h2>
                <div className="text-xs text-slate-500 font-medium">8 Core Competency Domains in Ministerial Leadership</div>
              </div>
              <span className="w-9 h-9 rounded-xl bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold text-xs">
                8 Domains
              </span>
            </div>

            {/* 8 Competency Badges in 2 rows */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-auto py-4">
              {[
                { name: 'KNOWLEDGE', desc: 'Biblical literacy, systematic doctrine, church history', icon: BookOpen },
                { name: 'PRACTICAL SKILLS', desc: 'Homiletics, liturgy, prayer ministry, sacraments', icon: Award },
                { name: 'COMMUNICATION', desc: 'Public preaching, pastoral empathy, teaching clarity', icon: Users },
                { name: 'LEADERSHIP', desc: 'Vision casting, delegation, board management', icon: Compass },
                { name: 'ETHICAL CONDUCT', desc: 'Ministerial integrity, stewardship, confidentiality', icon: Shield },
                { name: 'PASTORAL COMPETENCE', desc: 'Grief care, crisis support, spiritual counseling', icon: Heart },
                { name: 'PROBLEM-SOLVING', desc: 'Conflict mediation, strategic adaptation, crisis relief', icon: Sparkles },
                { name: 'COMMUNITY ENGAGEMENT', desc: 'Evangelistic presence, civic partnership, benevolence', icon: Globe }
              ].map((comp, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2 flex flex-col items-center justify-center shadow-2xs hover:border-[#002366] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#002366] text-[#C5A059] flex items-center justify-center">
                    <comp.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black font-display text-[#002366]">{comp.name}</div>
                    <div className="text-[10px] text-slate-600 leading-tight mt-0.5">{comp.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scripture Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#001744] via-[#002366] to-[#0A3078] text-white text-center text-xs space-y-1 shadow-xs border-t-2 border-[#C5A059]">
              <div className="italic text-slate-200 max-w-2xl mx-auto">
                "And whatever you do, in word or deed, do everything in the name of the Lord Jesus, giving thanks to God the Father through him."
              </div>
              <div className="text-[10px] font-bold text-[#C5A059] font-mono uppercase tracking-wider">
                — Colossians 3:17
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-500 flex justify-between">
              <span>BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.</span>
              <span className="font-bold text-[#002366]">Slide 14 / 15</span>
            </div>
          </div>
        );

      // 15. RPL Evidence Register & Key Principle
      case 15:
        return (
          <div className="h-full flex flex-col justify-between p-6 sm:p-10 bg-white text-slate-900">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366] tracking-tight">
                  RPL EVIDENCE REGISTER &amp; KEY PRINCIPLE
                </h2>
                <div className="text-xs text-slate-500 font-medium">Standard Master Audit Table &amp; Foundational Axiom</div>
              </div>
              <span className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                Final
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-auto py-2 items-center">
              {/* Evidence Register Table (10 Rows) */}
              <div className="lg:col-span-8 overflow-x-auto">
                <table className="w-full text-left text-[11px] border-collapse bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <thead>
                    <tr className="bg-[#002366] text-white font-bold text-[10px] uppercase tracking-wider">
                      <th className="py-1.5 px-2 text-center">No.</th>
                      <th className="py-1.5 px-2">Evidence Item</th>
                      <th className="py-1.5 px-2">Source</th>
                      <th className="py-1.5 px-2 text-center">Verified?</th>
                      <th className="py-1.5 px-2">Relevant Unit / Competency</th>
                      <th className="py-1.5 px-2">Action Required</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { no: 1, item: 'Ministry appointment letter', source: 'Church', verified: 'Yes / No', unit: 'Ministry Leadership', action: 'Submit original letterhead' },
                      { no: 2, item: 'Sermon outlines', source: 'Candidate', verified: 'Yes / No', unit: 'Biblical Teaching', action: 'Submit 5 sample manuscripts' },
                      { no: 3, item: 'Pastoral visitation records', source: 'Church', verified: 'Yes / No', unit: 'Pastoral Care', action: 'Redacted logs submission' },
                      { no: 4, item: 'Counselling records', source: 'Candidate / Church', verified: 'Yes / No', unit: 'Christian Counselling', action: 'Anonymized case summary' },
                      { no: 5, item: 'Church committee minutes', source: 'Church', verified: 'Yes / No', unit: 'Church Administration', action: 'Secretary minutes excerpt' },
                      { no: 6, item: 'Training certificates', source: 'Training Institution', verified: 'Yes / No', unit: 'Relevant Units', action: 'Certified copies' },
                      { no: 7, item: 'Mission / outreach reports', source: 'Church', verified: 'Yes / No', unit: 'Evangelism', action: 'Impact metrics & photos' },
                      { no: 8, item: 'Referee statement', source: 'Supervisor', verified: 'Yes / No', unit: 'Relevant Competency', action: 'Confidential letter' },
                      { no: 9, item: 'Recorded sermon / video', source: 'Digital Source', verified: 'Yes / No', unit: 'Preaching / Teaching', action: 'Live URL link' },
                      { no: 10, item: 'Candidate reflection', source: 'Candidate', verified: 'Yes / No', unit: 'Multiple Competencies', action: '2,500-word essay' }
                    ].map((row) => (
                      <tr key={row.no} className="hover:bg-slate-50">
                        <td className="py-1 px-2 text-center font-bold text-slate-700 font-mono">{row.no}</td>
                        <td className="py-1 px-2 font-medium text-slate-900">{row.item}</td>
                        <td className="py-1 px-2 text-slate-600">{row.source}</td>
                        <td className="py-1 px-2 text-center text-[10px] font-mono text-emerald-700 font-bold">{row.verified}</td>
                        <td className="py-1 px-2 text-slate-800 font-semibold">{row.unit}</td>
                        <td className="py-1 px-2 text-slate-500 italic text-[10px]">{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Gold Callout: KEY PRINCIPLE */}
              <div className="lg:col-span-4 bg-gradient-to-b from-amber-50 to-amber-100/80 rounded-2xl border-2 border-[#C5A059] p-5 space-y-3 shadow-md">
                <div className="inline-block px-3 py-1 rounded-full bg-[#002366] text-[#C5A059] text-[10px] font-black uppercase tracking-widest">
                  KEY PRINCIPLE
                </div>
                <h4 className="text-sm font-bold text-[#002366] font-display">Scoping vs. Proving Competence</h4>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  "Counselling is the stage where the assessor helps determine what evidence already exists, what is missing, and which evidence can be used to support the RPL assessment."
                </p>
                <div className="p-3 rounded-xl bg-white border border-[#C5A059]/40 text-xs font-black text-rose-800 shadow-2xs">
                  ⚠️ The counselling session itself does NOT automatically prove competence.
                </div>
                <div className="text-[10px] text-slate-600 leading-snug">
                  Full evaluation occurs through rigorous assessment by the BIBU Academic Council.
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-500 flex justify-between">
              <span>BIBU – Equipping Ministers. Transforming Lives. Impacting Nations.</span>
              <span className="font-bold text-[#002366]">Slide 15 / 15</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      id="rpl-slide-deck-container"
      className={`space-y-6 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto flex flex-col justify-between'
          : 'bg-slate-100/80 rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-sm'
      }`}
    >
      {/* 1. Control Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-display text-[#002366]">
                RPL Proposed Slide Deck
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#C5A059]/20 text-[#002366] border border-[#C5A059]">
                15 Official Slides
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Counselling Session &amp; Evidence Collection Framework for Christian Ministry &amp; Theology
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* View mode toggle */}
          <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              id="slide-view-mode-btn"
              onClick={() => setViewMode('slide')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'slide'
                  ? 'bg-[#002366] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Slide Mode</span>
            </button>
            <button
              id="grid-view-mode-btn"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-[#002366] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>All 15 Poster Grid</span>
            </button>
          </div>

          {/* Slide Mode Specific Controls */}
          {viewMode === 'slide' && (
            <>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isPlaying
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                title={isPlaying ? 'Pause Autoplay' : 'Autoplay Slides (5s intervals)'}
              >
                {isPlaying ? <Pause className="w-4 h-4 text-amber-700" /> : <Play className="w-4 h-4" />}
                <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Autoplay'}</span>
              </button>

              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`p-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  showNotes
                    ? 'bg-blue-100 border-blue-300 text-blue-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                title="Toggle Assessor & Guidance Notes"
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">Assessor Notes</span>
              </button>
            </>
          )}

          <button
            onClick={handlePrint}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5"
            title="Print Presentation Slides"
          >
            <Printer className="w-4 h-4 text-[#002366]" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Presentation'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Main Viewport */}
      {viewMode === 'slide' ? (
        /* SINGLE SLIDE PRESENTATION VIEW */
        <div className="space-y-4">
          {/* The Slide Frame (16:9 Aspect Ratio with drop shadow and gold top border) */}
          <div className="relative w-full aspect-[16/9] min-h-[480px] sm:min-h-[520px] rounded-2xl overflow-hidden border-2 border-slate-300 shadow-xl bg-white flex flex-col">
            {/* Number Pill at Top-Left */}
            <div className="absolute top-4 left-4 z-20">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#997328] text-[#001744] font-black text-sm flex items-center justify-center shadow-lg border border-white/40">
                {currentSlide.slideNumber}
              </div>
            </div>

            {/* Slide Body */}
            <div className="flex-1 w-full h-full overflow-hidden">
              {renderSlideBody(currentSlide)}
            </div>
          </div>

          {/* Slide Navigation Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-2">
              <button
                id="prev-slide-btn"
                onClick={handlePrev}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-[#002366] hover:text-white text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Slide</span>
              </button>

              <button
                id="next-slide-btn"
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Next Slide</span>
                <ChevronRight className="w-4 h-4 text-[#C5A059]" />
              </button>
            </div>

            {/* Slide Counter & Jump Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">
                Slide <strong className="text-[#002366] font-mono text-sm">{currentSlideIndex + 1}</strong> of{' '}
                <span className="font-mono">{totalSlides}</span>:
              </span>
              <select
                id="slide-jump-select"
                value={currentSlideIndex}
                onChange={(e) => setCurrentSlideIndex(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#002366]"
              >
                {RPL_SLIDE_DECK.map((s, idx) => (
                  <option key={s.id} value={idx}>
                    {s.slideNumber}. {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-[11px] text-slate-400 hidden md:block">
              Use <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border text-slate-700 font-mono">←</kbd> and{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border text-slate-700 font-mono">→</kbd> keys to navigate
            </div>
          </div>

          {/* Assessor Guidance Notes (Collapsible) */}
          {showNotes && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-[#002366]">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Assessor &amp; Guidance Notes for Slide {currentSlide.slideNumber}:</span>
              </div>
              <p className="leading-relaxed text-blue-950 font-medium">
                {currentSlide.notes || 'No supplementary guidance notes registered for this slide.'}
              </p>
            </div>
          )}

          {/* Slide Scrubber / Thumbnail Strip */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2 no-print">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Slide Strip Navigator (Click to Jump)
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {RPL_SLIDE_DECK.map((slide, idx) => {
                const isActive = idx === currentSlideIndex;
                return (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`shrink-0 w-28 text-left rounded-xl p-2 border-2 transition-all ${
                      isActive
                        ? 'border-[#002366] bg-amber-50/50 shadow-xs scale-105'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-black mb-1">
                      <span className={`px-1.5 py-0.5 rounded ${isActive ? 'bg-[#002366] text-[#C5A059]' : 'bg-slate-200 text-slate-700'}`}>
                        {slide.slideNumber}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-800 line-clamp-1">
                      {slide.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* 15-SLIDE POSTER GRID VIEW (Matching Reference Poster) */
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              Displaying all <strong>15 RPL Counselling &amp; Evidence Collection Slides</strong> simultaneously. Click any slide to open full presentation mode.
            </div>
            <div className="text-xs font-bold text-[#002366]">
              3 Columns • 5 Rows Presentation Format
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RPL_SLIDE_DECK.map((slide, idx) => (
              <div
                key={slide.id}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  setViewMode('slide');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="group relative bg-white rounded-2xl border-2 border-slate-200 hover:border-[#002366] shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between aspect-[16/10]"
              >
                {/* Number Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="w-8 h-8 rounded-lg bg-[#002366] text-[#C5A059] font-black text-xs flex items-center justify-center shadow-md border border-[#C5A059]/40 group-hover:bg-[#C5A059] group-hover:text-[#002366] transition-colors">
                    {slide.slideNumber}
                  </span>
                </div>

                {/* Click to expand overlay on hover */}
                <div className="absolute inset-0 bg-[#002366]/0 group-hover:bg-[#002366]/5 transition-colors pointer-events-none" />

                {/* Body scaled */}
                <div className="w-full h-full scale-[0.98] origin-top flex flex-col justify-between">
                  {renderSlideBody(slide, true)}
                </div>

                <div className="p-2 bg-slate-50 border-t border-slate-200 text-center text-[10px] font-bold text-slate-500 group-hover:text-[#002366] group-hover:bg-amber-50 transition-colors">
                  Click to Expand Slide {slide.slideNumber}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. University Accreditation Footer */}
      <div className="bg-[#002366] rounded-2xl text-white p-6 shadow-md border-t-2 border-[#C5A059] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wider font-bold text-[#C5A059] font-display flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            <span>Academic Council &amp; Senate Regulation</span>
          </div>
          <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
            This slide deck serves as the official pedagogical guideline for all candidate intake sessions across all BIBU affiliated campuses, national exam centres, and online portals.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print Slide Handouts</span>
        </button>
      </div>
    </div>
  );
};
