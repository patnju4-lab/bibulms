import React, { useState, useMemo, useRef } from 'react';
import {
  GraduationCeremony,
  GraduationCandidate,
  GraduationBooklet,
  AcademicAwardWinner
} from '../../types/graduation';
import {
  CEREMONY_2025_KENYA,
  KENYA_2025_CANDIDATES,
  KENYA_2025_BOOKLET,
  RAW_KENYA_2025_STUDENTS,
  RawKenyaGradStudent
} from '../../data/graduationKenya2025Data';
import { UniversityLogo } from '../common/UniversityLogo';
import { exportBookletToPdf, PdfExportProgress } from '../../utils/graduationBookletPdfExport';
import {
  Printer,
  Download,
  Search,
  CheckCircle2,
  Award,
  BookOpen,
  GraduationCap,
  Calendar,
  MapPin,
  FileText,
  Clock,
  ShieldCheck,
  ChevronRight,
  Filter,
  ArrowLeft,
  Share2,
  Copy,
  ExternalLink,
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';

export interface GraduationExportModuleProps {
  candidates?: GraduationCandidate[];
  rawStudents?: RawKenyaGradStudent[];
  ceremony?: GraduationCeremony;
  booklet?: GraduationBooklet;
  onClose?: () => void;
  className?: string;
  defaultFilter?: 'all' | 'dip-theology' | 'dip-counseling' | 'cert-theology' | 'cert-counseling' | 'makueni';
}

export const GraduationExportModule: React.FC<GraduationExportModuleProps> = ({
  candidates = KENYA_2025_CANDIDATES,
  rawStudents = RAW_KENYA_2025_STUDENTS,
  ceremony = CEREMONY_2025_KENYA,
  booklet = KENYA_2025_BOOKLET,
  onClose,
  className = '',
  defaultFilter = 'all'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgramFilter, setSelectedProgramFilter] = useState<string>(defaultFilter);
  const [viewMode, setViewMode] = useState<'booklet' | 'gazette' | 'programme'>('booklet');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportProgress, setExportProgress] = useState<PdfExportProgress | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const printContainerRef = useRef<HTMLDivElement>(null);

  // Helper to get candidate program name safely
  const getCandidateProgram = (c: GraduationCandidate): string => {
    return c.programName || (c as unknown as { program?: string }).program || '';
  };

  // Helper to check if candidate is part of the Makueni cohort
  const isMakueniCandidate = (c: GraduationCandidate): boolean => {
    const raw = c as unknown as { notes?: string; isMakueniChapter?: boolean };
    const city = (c.city || '').toLowerCase();
    const campus = (c.campus || '').toLowerCase();
    const notes = (raw.notes || '').toLowerCase();
    return city.includes('makueni') || campus.includes('makueni') || notes.includes('makueni') || raw.isMakueniChapter === true;
  };

  // Group Candidates by Qualification
  const groupedCandidates = useMemo(() => {
    const dipTheology = candidates.filter((c) => {
      const prog = getCandidateProgram(c).toLowerCase();
      return prog.includes('diploma') && (prog.includes('theological') || prog.includes('theology'));
    });
    const dipCounseling = candidates.filter((c) => {
      const prog = getCandidateProgram(c).toLowerCase();
      return prog.includes('diploma') && prog.includes('counseling');
    });
    const certTheology = candidates.filter((c) => {
      const prog = getCandidateProgram(c).toLowerCase();
      return prog.includes('certificate') && (prog.includes('theological') || prog.includes('theology'));
    });
    const certCounseling = candidates.filter((c) => {
      const prog = getCandidateProgram(c).toLowerCase();
      return prog.includes('certificate') && prog.includes('counseling');
    });
    const makueniCohort = candidates.filter((c) => isMakueniCandidate(c));

    return {
      all: candidates,
      dipTheology,
      dipCounseling,
      certTheology,
      certCounseling,
      makueniCohort
    };
  }, [candidates]);

  // Filtered List based on search and program filter
  const filteredCandidates = useMemo(() => {
    let list = candidates;

    if (selectedProgramFilter === 'dip-theology') {
      list = groupedCandidates.dipTheology;
    } else if (selectedProgramFilter === 'dip-counseling') {
      list = groupedCandidates.dipCounseling;
    } else if (selectedProgramFilter === 'cert-theology') {
      list = groupedCandidates.certTheology;
    } else if (selectedProgramFilter === 'cert-counseling') {
      list = groupedCandidates.certCounseling;
    } else if (selectedProgramFilter === 'makueni') {
      list = groupedCandidates.makueniCohort;
    }

    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase();
    return list.filter(
      (c) =>
        c.fullName.toLowerCase().includes(query) ||
        c.studentId.toLowerCase().includes(query) ||
        c.admissionNumber.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query) ||
        (c.certificateNumber && c.certificateNumber.toLowerCase().includes(query))
    );
  }, [candidates, groupedCandidates, selectedProgramFilter, searchQuery]);

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // PDF Export Handler
  const handleExportPdf = async () => {
    if (!printContainerRef.current) return;
    setIsExportingPdf(true);
    setExportProgress({
      currentPage: 0,
      totalPages: 8,
      pageTitle: 'Initializing PDF export...',
      percent: 5,
      stage: 'preparing'
    });

    try {
      const result = await exportBookletToPdf(printContainerRef.current, {
        scale: 2,
        filename: 'BIBU_Kenya_2025_Graduation_Ceremony_Booklet.pdf',
        onProgress: (p) => setExportProgress(p)
      });

      if (!result.success && result.error) {
        alert(`PDF Export note: ${result.error}. Standard browser printing (Save as PDF) is recommended for best results.`);
      }
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Generating PDF via browser printing dialog. Click OK to open.');
      window.print();
    } finally {
      setIsExportingPdf(false);
      setExportProgress(null);
    }
  };

  // Copy Graduand Roster to Clipboard
  const handleCopyRoster = () => {
    const header = "BIBU Kenya 2025 Graduation Convocation - Graduands Roll\n\n";
    const body = filteredCandidates
      .map(
        (c, i) =>
          `${i + 1}. ${c.fullName} | ${getCandidateProgram(c)} | Reg: ${c.admissionNumber} | Cert: ${c.certificateNumber || 'N/A'} | Region: ${c.city}`
      )
      .join('\n');

    navigator.clipboard.writeText(header + body);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ========================================================================= */}
      {/* CONTROL & EXPORT HUB (Hidden in Print) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6 no-print">
        {/* Header Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#002366] text-[#C5A059] rounded-2xl shadow-sm shrink-0">
              <UniversityLogo size="md" withRing />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#002366]/10 text-[#002366] text-[11px] font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>BIBU Academic Gazette & Ceremony Export Module</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-black text-[#002366]">
                Kenya Students Class of 2025 Convocation Booklet
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakthrough International Bible University • Official 2025 Senate Register & Printable Ceremony Gazette
              </p>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* The Print button explicitly using the 'print-only' CSS class as requested */}
            <button
              id="print-ceremony-booklet-btn"
              onClick={handlePrint}
              className="print-only inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#002366] text-[#C5A059] border-2 border-[#C5A059] font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#001A4D] hover:text-amber-300 transition-all shadow-sm cursor-pointer"
              title="Print Official Ceremony Booklet (A4 Standard)"
            >
              <Printer className="w-4 h-4" />
              <span>Print Ceremony Booklet</span>
            </button>

            {/* Main Interactive Screen Print Button */}
            <button
              id="btn-print-screen"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#002366] hover:bg-[#001A4D] text-[#C5A059] border border-[#C5A059]/40 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Printer className="w-4 h-4 text-[#C5A059]" />
              <span>Print Booklet (A4)</span>
            </button>

            {/* PDF Export Button */}
            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#001A4D] rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingPdf ? 'Generating PDF...' : 'Export PDF'}</span>
            </button>

            {/* Copy Roster */}
            <button
              onClick={handleCopyRoster}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              title="Copy formatted text roster of graduands"
            >
              {copySuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copySuccess ? 'Copied' : 'Copy Roll'}</span>
            </button>

            {/* Close if in modal/drawer */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
                title="Close"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Graduands</span>
            <span className="text-xl font-black text-[#002366]">{candidates.length}</span>
            <span className="text-[10px] text-slate-500 block">Kenya Cohort</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Diplomas Conferred</span>
            <span className="text-xl font-black text-[#002366]">
              {groupedCandidates.dipTheology.length + groupedCandidates.dipCounseling.length}
            </span>
            <span className="text-[10px] text-slate-500 block">55 Theology, 5 Psych</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Certificates Conferred</span>
            <span className="text-xl font-black text-[#002366]">
              {groupedCandidates.certTheology.length + groupedCandidates.certCounseling.length}
            </span>
            <span className="text-[10px] text-slate-500 block">15 Theology, 2 Psych</span>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-amber-700 block">Makueni Chapter</span>
            <span className="text-xl font-black text-amber-900">{groupedCandidates.makueniCohort.length}</span>
            <span className="text-[10px] text-amber-700 block">Regional Cohort</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Convocation Date</span>
            <span className="text-xs font-black text-[#002366] block mt-1">29 Nov 2025</span>
            <span className="text-[10px] text-slate-500 block">Nairobi Pavilion</span>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Senate Status</span>
            <span className="text-xs font-black text-emerald-900 block mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Conferred</span>
            </span>
            <span className="text-[10px] text-emerald-700 block">100% Certified</span>
          </div>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-slate-100">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shrink-0">
            <button
              onClick={() => setViewMode('booklet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'booklet'
                  ? 'bg-white text-[#002366] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Full Ceremony Booklet</span>
            </button>
            <button
              onClick={() => setViewMode('gazette')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'gazette'
                  ? 'bg-white text-[#002366] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Official Gazette Roll</span>
            </button>
            <button
              onClick={() => setViewMode('programme')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'programme'
                  ? 'bg-white text-[#002366] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Order of Liturgy</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 77 Kenya graduands by name, admission #, town..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#002366] focus:ring-1 focus:ring-[#002366] transition-all"
            />
          </div>
        </div>

        {/* Qualification Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => setSelectedProgramFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedProgramFilter === 'all'
                ? 'bg-[#002366] text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Candidates ({candidates.length})
          </button>
          <button
            onClick={() => setSelectedProgramFilter('dip-theology')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedProgramFilter === 'dip-theology'
                ? 'bg-[#002366] text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Diploma in Theological Studies ({groupedCandidates.dipTheology.length})
          </button>
          <button
            onClick={() => setSelectedProgramFilter('dip-counseling')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedProgramFilter === 'dip-counseling'
                ? 'bg-[#002366] text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Diploma in Counseling Psychology ({groupedCandidates.dipCounseling.length})
          </button>
          <button
            onClick={() => setSelectedProgramFilter('cert-theology')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedProgramFilter === 'cert-theology'
                ? 'bg-[#002366] text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Certificate in Theological Studies ({groupedCandidates.certTheology.length})
          </button>
          <button
            onClick={() => setSelectedProgramFilter('cert-counseling')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedProgramFilter === 'cert-counseling'
                ? 'bg-[#002366] text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Certificate in Counseling Psychology ({groupedCandidates.certCounseling.length})
          </button>
          <button
            onClick={() => setSelectedProgramFilter('makueni')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedProgramFilter === 'makueni'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Makueni County Cohort ({groupedCandidates.makueniCohort.length})
          </button>
        </div>

        {/* Progress bar when PDF is exporting */}
        {isExportingPdf && exportProgress && (
          <div className="p-4 bg-[#002366]/5 border border-[#002366]/20 rounded-2xl space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-[#002366]">
              <span>{exportProgress.pageTitle}</span>
              <span>{exportProgress.percent}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#C5A059] h-2 transition-all duration-300"
                style={{ width: `${exportProgress.percent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PRINTABLE CEREMONY BOOKLET LAYOUT (A4 PROPORTIONS WITH BIBU BRANDING) */}
      {/* ========================================================================= */}
      <div
        ref={printContainerRef}
        id="bibu-ceremony-booklet-print-document"
        className="bg-white rounded-3xl border border-slate-300 shadow-md p-6 sm:p-10 lg:p-14 space-y-12 max-w-5xl mx-auto text-slate-900 relative"
      >
        {/* Subtle Watermark for screen & print */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.025] z-0 overflow-hidden">
          <UniversityLogo size="hero" className="scale-150" />
        </div>

        {/* ===================================================================== */}
        {/* PAGE 1: FORMAL CONVOCATION COVER (ACADEMIC FRONTISPIECE) */}
        {/* ===================================================================== */}
        <div className="page-break relative z-10 border-4 border-double border-[#C5A059] p-8 sm:p-12 rounded-3xl bg-radial from-amber-50/20 via-white to-white text-center space-y-8 min-h-[900px] flex flex-col justify-between">
          {/* Top Ornamental Header */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <UniversityLogo size="xl" withRing className="shadow-lg ring-4 ring-[#C5A059]/30" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-display font-black tracking-wider text-[#002366] uppercase">
                Breakthrough International Bible University
              </h2>
              <p className="text-xs font-serif tracking-widest text-[#C5A059] uppercase font-bold">
                Veritas • Gratia • Ministerium
              </p>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                Incorporated & Chartered Theological Seminary • Office of the Registrar & Academic Council
              </p>
            </div>
          </div>

          {/* Majestic Divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-px bg-[#C5A059]" />
            <span className="text-[#C5A059] text-sm">✦</span>
            <div className="w-16 h-px bg-[#C5A059]" />
          </div>

          {/* Central Title Block */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#002366] text-[#C5A059] text-xs font-bold uppercase tracking-widest">
              Official Convocation Ceremony Gazette
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-black text-[#001A4D] leading-tight">
              COMMEMORATIVE GRADUATION BOOKLET
            </h1>

            <p className="text-base font-serif font-bold text-[#C5A059] tracking-wide">
              Kenya Regional Students Conferred Class of 2025
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans px-4">
              Celebrating the conferment of Diplomas and Certificates in Counseling Psychology and Theological Studies across Nairobi, Makueni, Nakuru, Central, Eastern, Coastal, and Western Kenya Fellowship Centres.
            </p>
          </div>

          {/* Scripture Theme Box */}
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-amber-50/80 border border-[#C5A059]/40 text-center space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#002366]">Convocation Scripture Theme</span>
            <p className="text-xs font-serif italic text-slate-800">
              "{ceremony.theme}"
            </p>
          </div>

          {/* Ceremony Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs">
            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Date & Time</span>
              <span className="font-bold text-[#002366]">Saturday, 29th November 2025</span>
              <span className="text-[11px] text-slate-500 block">10:00 AM East Africa Time</span>
            </div>

            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ceremony Venue</span>
              <span className="font-bold text-[#002366]">BIBU Kenya Convocation Pavilion</span>
              <span className="text-[11px] text-slate-500 block">Nairobi & Regional Chapters</span>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Conferring Authority</span>
              <span className="font-bold text-[#002366]">University Chancellor & Senate</span>
              <span className="text-[11px] text-slate-500 block">77 Certified Graduands</span>
            </div>
          </div>

          {/* Bottom Academic Signet */}
          <div className="pt-2 text-[10px] tracking-wider text-slate-400 uppercase">
            Official University Publication • Vol. KE-2025-CONV • Accredited & Verified Academic Register
          </div>
        </div>

        {/* ===================================================================== */}
        {/* PAGE 2: OFFICERS OF THE UNIVERSITY & LITURGICAL PROCEEDINGS */}
        {/* ===================================================================== */}
        {(viewMode === 'booklet' || viewMode === 'programme') && (
          <div className="page-break space-y-8 pt-4">
            <div className="border-b-2 border-[#002366] pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Section I</span>
                <h3 className="text-xl font-display font-black text-[#002366]">
                  Officers of the University & Order of Proceedings
                </h3>
              </div>
              <UniversityLogo size="sm" />
            </div>

            {/* University Officers Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block">Chancellor</span>
                <span className="font-display font-bold text-xs text-[#002366] block">Dr. Michael C. Sterling</span>
                <span className="text-[11px] text-slate-500">Th.D., D.Min. (Presiding Officer)</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block">Vice Chancellor</span>
                <span className="font-display font-bold text-xs text-[#002366] block">Prof. Dr. Patrick Njuguna</span>
                <span className="text-[11px] text-slate-500">Ph.D., Th.D. (Chief Executive Officer)</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block">University Registrar</span>
                <span className="font-display font-bold text-xs text-[#002366] block">Rev. Dr. Sarah M. Jenkins</span>
                <span className="text-[11px] text-slate-500">Th.D. (Keeper of Senate Rolls)</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block">Kenya Directorate</span>
                <span className="font-display font-bold text-xs text-[#002366] block">Prof. Joseph K. Mutua</span>
                <span className="text-[11px] text-slate-500">Ph.D. & Kenya Regional Board</span>
              </div>
            </div>

            {/* Liturgy & Proceedings */}
            <div className="space-y-4">
              <h4 className="text-sm font-display font-bold text-[#002366] uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A059]" />
                <span>Solemn Order of Liturgy & Academic Proceedings</span>
              </h4>

              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
                {ceremony.programmeSchedule.map((item) => (
                  <div key={item.id} className="p-3.5 sm:p-4 flex items-start sm:items-center justify-between gap-4 hover:bg-slate-50">
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#002366]/10 text-[#002366] font-bold flex items-center justify-center text-xs shrink-0">
                        {item.order}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 block sm:inline mr-2">{item.activity}</span>
                        <span className="text-slate-500 text-[11px]">({item.facilitator})</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#002366] text-xs shrink-0 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Liturgical Invocations */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-[#C5A059]/30 text-xs space-y-2">
              <span className="font-bold text-[#002366] uppercase tracking-wider block">Solemn Convocation Invocation</span>
              <p className="italic text-slate-700 font-serif leading-relaxed">
                "For this reason, since the day we heard about you, we have not stopped praying for you. We continually ask God to fill you with the knowledge of His will through all the wisdom and understanding that the Spirit gives, so that you may live a life worthy of the Lord and please Him in every way: bearing fruit in every good work, growing in the knowledge of God."
              </p>
              <span className="text-[11px] font-bold text-[#C5A059] block">— Colossians 1:9-10</span>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PAGE 3: CHANCELLOR & VICE CHANCELLOR CONVOCATION MESSAGES */}
        {/* ===================================================================== */}
        {viewMode === 'booklet' && (
          <div className="page-break space-y-8 pt-4">
            <div className="border-b-2 border-[#002366] pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Section II</span>
                <h3 className="text-xl font-display font-black text-[#002366]">
                  Executive Convocation Addresses & Senate Proclamation
                </h3>
              </div>
              <UniversityLogo size="sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Chancellor Charge */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="border-b border-slate-200 pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">Convocation Charge</span>
                    <h4 className="font-display font-bold text-sm text-[#002366]">
                      Chancellor Dr. Michael C. Sterling, Th.D., D.Min.
                    </h4>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-serif">
                    "To our beloved graduating students across Kenya: You have completed rigorous academic study in Theological Studies and Counseling Psychology. Today, Breakthrough International Bible University formally commissions you to take sound doctrine, pastoral empathy, and transformational leadership into every county, municipality, and marketplace."
                  </p>
                  <p className="text-slate-700 leading-relaxed font-serif">
                    "Let your diplomas and certificates be not merely ornaments of parchment, but instruments of righteousness and reconciliation in Christ Jesus."
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-display font-bold text-xs text-[#002366] block">Dr. Michael C. Sterling</span>
                    <span className="text-[10px] text-slate-500">Chancellor, University Senate</span>
                  </div>
                  <div className="font-serif italic text-slate-400 text-xs border-b border-slate-400 px-3 pb-0.5">
                    M. C. Sterling, Th.D.
                  </div>
                </div>
              </div>

              {/* Vice Chancellor Address */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="border-b border-slate-200 pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">Vice Chancellor Address</span>
                    <h4 className="font-display font-bold text-sm text-[#002366]">
                      Prof. Dr. Patrick Njuguna, Ph.D., Th.D.
                    </h4>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-serif">
                    "Today we celebrate 77 consecrated men and women who have demonstrated academic diligence and pastoral integrity. We particularly commend our Makueni County regional cohort and our clinical counseling graduands whose service will bring holistic healing to communities."
                  </p>
                  <p className="text-slate-700 leading-relaxed font-serif">
                    "As you step forward today, the entire global faculty of BIBU stands with you. Go forth as ambassadors of kingdom scholarship and servant leadership."
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-display font-bold text-xs text-[#002366] block">Prof. Dr. Patrick Njuguna</span>
                    <span className="text-[10px] text-slate-500">Vice Chancellor & Chief Executive</span>
                  </div>
                  <div className="font-serif italic text-slate-400 text-xs border-b border-slate-400 px-3 pb-0.5">
                    Prof. P. Njuguna, Ph.D.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PAGE 4 & ONWARD: THE OFFICIAL GRADUANDS ROLL (77 CANDIDATES) */}
        {/* ===================================================================== */}
        <div className="space-y-10 pt-4">
          <div className="border-b-2 border-[#002366] pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Section III</span>
              <h3 className="text-xl font-display font-black text-[#002366]">
                Conferred Graduands Roll & Official Gazette Register
              </h3>
              <p className="text-xs text-slate-500">
                Candidates presented by the Deans of Faculties and admitted to their respective Diplomas & Certificates by the Chancellor.
              </p>
            </div>
            <span className="text-xs font-bold text-[#002366] bg-slate-100 px-3 py-1.5 rounded-xl">
              Showing {filteredCandidates.length} of {candidates.length} Graduands
            </span>
          </div>

          {/* =================================================================== */}
          {/* FACULTY 1: CHRISTIAN COUNSELING & PSYCHOLOGY */}
          {/* =================================================================== */}
          {(selectedProgramFilter === 'all' ||
            selectedProgramFilter === 'dip-counseling' ||
            selectedProgramFilter === 'cert-counseling') && (
            <div className="space-y-6 avoid-break">
              <div className="bg-[#002366] text-white p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Faculty of Care & Healing</span>
                  <h4 className="text-base font-display font-bold">
                    Faculty of Christian Counseling & Psychology
                  </h4>
                </div>
                <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-lg text-amber-200">
                  {groupedCandidates.dipCounseling.length + groupedCandidates.certCounseling.length} Graduands
                </span>
              </div>

              {/* 1. Diploma in Counseling Psychology (5 Candidates) */}
              {(selectedProgramFilter === 'all' || selectedProgramFilter === 'dip-counseling') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h5 className="font-display font-bold text-sm text-[#002366] flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                      <span>Diploma in Counseling Psychology (5 Candidates)</span>
                    </h5>
                    <span className="text-[11px] font-mono text-slate-500">Code: DCP-2025</span>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                          <th className="py-2.5 px-3 w-12 text-center">S/No.</th>
                          <th className="py-2.5 px-3">Candidate Full Name</th>
                          <th className="py-2.5 px-3">Student / Admission ID</th>
                          <th className="py-2.5 px-3">Certificate Number</th>
                          <th className="py-2.5 px-3">County / Region</th>
                          <th className="py-2.5 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {groupedCandidates.dipCounseling.map((student, idx) => (
                          <tr key={student.id} className="hover:bg-slate-50/80">
                            <td className="py-2 px-3 text-center font-mono font-bold text-slate-500">{idx + 1}</td>
                            <td className="py-2 px-3 font-bold text-[#002366] font-display">{student.fullName}</td>
                            <td className="py-2 px-3 font-mono text-slate-600 text-[11px]">{student.admissionNumber}</td>
                            <td className="py-2 px-3 font-mono text-[#C5A059] text-[11px] font-medium">{student.certificateNumber}</td>
                            <td className="py-2 px-3 text-slate-600">{student.city}</td>
                            <td className="py-2 px-3 text-right">
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10.5px]">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Conferred</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 2. Certificate in Counseling Psychology (2 Candidates) */}
              {(selectedProgramFilter === 'all' || selectedProgramFilter === 'cert-counseling') && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h5 className="font-display font-bold text-sm text-[#002366] flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                      <span>Certificate in Counseling Psychology (2 Candidates)</span>
                    </h5>
                    <span className="text-[11px] font-mono text-slate-500">Code: CCP-2025</span>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                          <th className="py-2.5 px-3 w-12 text-center">S/No.</th>
                          <th className="py-2.5 px-3">Candidate Full Name</th>
                          <th className="py-2.5 px-3">Student / Admission ID</th>
                          <th className="py-2.5 px-3">Certificate Number</th>
                          <th className="py-2.5 px-3">County / Region</th>
                          <th className="py-2.5 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {groupedCandidates.certCounseling.map((student, idx) => (
                          <tr key={student.id} className="hover:bg-slate-50/80">
                            <td className="py-2 px-3 text-center font-mono font-bold text-slate-500">{idx + 1}</td>
                            <td className="py-2 px-3 font-bold text-[#002366] font-display">{student.fullName}</td>
                            <td className="py-2 px-3 font-mono text-slate-600 text-[11px]">{student.admissionNumber}</td>
                            <td className="py-2 px-3 font-mono text-[#C5A059] text-[11px] font-medium">{student.certificateNumber}</td>
                            <td className="py-2 px-3 text-slate-600">{student.city}</td>
                            <td className="py-2 px-3 text-right">
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10.5px]">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Conferred</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* FACULTY 2: THEOLOGICAL STUDIES & BIBLICAL LEADERSHIP */}
          {/* =================================================================== */}
          {(selectedProgramFilter === 'all' ||
            selectedProgramFilter === 'dip-theology' ||
            selectedProgramFilter === 'cert-theology' ||
            selectedProgramFilter === 'makueni') && (
            <div className="space-y-6 pt-4">
              <div className="bg-[#002366] text-white p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Faculty of Divinity</span>
                  <h4 className="text-base font-display font-bold">
                    Faculty of Theological Studies & Biblical Leadership
                  </h4>
                </div>
                <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-lg text-amber-200">
                  {groupedCandidates.dipTheology.length + groupedCandidates.certTheology.length} Graduands
                </span>
              </div>

              {/* 1. Diploma in Theological Studies (55 Candidates) */}
              {(selectedProgramFilter === 'all' || selectedProgramFilter === 'dip-theology') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h5 className="font-display font-bold text-sm text-[#002366] flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                      <span>Diploma in Theological Studies (55 Candidates)</span>
                    </h5>
                    <span className="text-[11px] font-mono text-slate-500">Code: DTS-2025 • Senate Register</span>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                          <th className="py-2.5 px-3 w-12 text-center">S/No.</th>
                          <th className="py-2.5 px-3">Candidate Full Name</th>
                          <th className="py-2.5 px-3">Admission Number</th>
                          <th className="py-2.5 px-3">Certificate Number</th>
                          <th className="py-2.5 px-3">County / Town</th>
                          <th className="py-2.5 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {groupedCandidates.dipTheology.map((student, idx) => (
                          <tr key={student.id} className="hover:bg-slate-50/80">
                            <td className="py-2 px-3 text-center font-mono font-bold text-slate-500">{idx + 1}</td>
                            <td className="py-2 px-3 font-bold text-[#002366] font-display">{student.fullName}</td>
                            <td className="py-2 px-3 font-mono text-slate-600 text-[11px]">{student.admissionNumber}</td>
                            <td className="py-2 px-3 font-mono text-[#C5A059] text-[11px] font-medium">{student.certificateNumber}</td>
                            <td className="py-2 px-3 text-slate-600">{student.city}</td>
                            <td className="py-2 px-3 text-right">
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10.5px]">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Conferred</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 2. Certificate in Theological Studies (15 Candidates total, with Makueni Chapter highlighted) */}
              {(selectedProgramFilter === 'all' ||
                selectedProgramFilter === 'cert-theology' ||
                selectedProgramFilter === 'makueni') && (
                <div className="space-y-4 pt-4 page-break">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h5 className="font-display font-bold text-sm text-[#002366] flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                      <span>Certificate in Theological Studies (15 Candidates)</span>
                    </h5>
                    <span className="text-[11px] font-mono text-slate-500">Code: CTS-2025 • Regional Roll</span>
                  </div>

                  {/* General Kenya Certificate Students (11 Students) */}
                  {selectedProgramFilter !== 'makueni' && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        General Regional Cohort (11 Candidates)
                      </span>
                      <div className="border border-slate-200 rounded-2xl overflow-hidden">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                              <th className="py-2 px-3 w-12 text-center">S/No.</th>
                              <th className="py-2 px-3">Candidate Full Name</th>
                              <th className="py-2 px-3">Admission Number</th>
                              <th className="py-2 px-3">Certificate Number</th>
                              <th className="py-2 px-3">County / Town</th>
                              <th className="py-2 px-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {groupedCandidates.certTheology
                              .filter((c) => !c.city.toLowerCase().includes('makueni'))
                              .map((student, idx) => (
                                <tr key={student.id} className="hover:bg-slate-50/80">
                                  <td className="py-2 px-3 text-center font-mono font-bold text-slate-500">{idx + 1}</td>
                                  <td className="py-2 px-3 font-bold text-[#002366] font-display">{student.fullName}</td>
                                  <td className="py-2 px-3 font-mono text-slate-600 text-[11px]">{student.admissionNumber}</td>
                                  <td className="py-2 px-3 font-mono text-[#C5A059] text-[11px] font-medium">{student.certificateNumber}</td>
                                  <td className="py-2 px-3 text-slate-600">{student.city}</td>
                                  <td className="py-2 px-3 text-right">
                                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10.5px]">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>Conferred</span>
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Makueni County Regional Chapter Special Cohort (4 Students) */}
                  <div className="space-y-2 pt-2">
                    <div className="p-3 bg-amber-500/10 border border-amber-300 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-700" />
                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                          Special Regional Honor Roll: Makueni County Study Centre Cohort (4 Candidates)
                        </span>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                        Chapter Induction
                      </span>
                    </div>

                    <div className="border-2 border-amber-300/80 rounded-2xl overflow-hidden bg-amber-50/20">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-amber-100/60 text-amber-950 font-bold border-b border-amber-200 text-[11px]">
                            <th className="py-2.5 px-3 w-12 text-center">S/No.</th>
                            <th className="py-2.5 px-3">Candidate Full Name</th>
                            <th className="py-2.5 px-3">Admission Number</th>
                            <th className="py-2.5 px-3">Certificate Number</th>
                            <th className="py-2.5 px-3">County / Centre</th>
                            <th className="py-2.5 px-3 text-right">Conferment</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-100">
                          {groupedCandidates.makueniCohort.map((student, idx) => (
                            <tr key={student.id} className="hover:bg-amber-100/40">
                              <td className="py-2 px-3 text-center font-mono font-bold text-amber-900">{idx + 1}</td>
                              <td className="py-2 px-3 font-bold text-[#002366] font-display flex items-center gap-1.5">
                                <span>{student.fullName}</span>
                                <span className="text-[10px] text-amber-700 font-sans font-bold">★ Makueni</span>
                              </td>
                              <td className="py-2 px-3 font-mono text-slate-700 text-[11px]">{student.admissionNumber}</td>
                              <td className="py-2 px-3 font-mono text-[#C5A059] text-[11px] font-bold">{student.certificateNumber}</td>
                              <td className="py-2 px-3 text-amber-900 font-medium">{student.city}</td>
                              <td className="py-2 px-3 text-right">
                                <span className="inline-flex items-center gap-1 text-emerald-800 font-bold text-[10.5px]">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Conferred</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* FINAL SECTION: ALUMNI PLEDGE, SENATE ATTESTATION & OFFICIAL SIGN-OFF */}
        {/* ===================================================================== */}
        <div className="page-break space-y-8 pt-8 border-t-2 border-slate-200 avoid-break">
          {/* Alumni Induction Pledge */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] block">
              Alumni Association Induction
            </span>
            <h4 className="text-sm font-display font-bold text-[#002366]">
              The Breakthrough International Bible University Alumni Pledge
            </h4>
            <p className="text-xs font-serif italic text-slate-700 leading-relaxed">
              "I solemnly pledge to honor Christ in all my endeavors, to preserve the doctrinal fidelity and moral reputation of Breakthrough International Bible University, and to dedicate my gifts, knowledge, and calling to the advancement of God’s Kingdom, societal transformation, and ministerial compassion across Kenya and the nations of the world."
            </p>
          </div>

          {/* Academic Senate Attestation & Three Signatures */}
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
                Senate Attestation & Certification
              </span>
              <h4 className="text-sm font-display font-bold text-[#002366]">
                Confirmed & Sealed by the Authority of the University Senate
              </h4>
              <p className="text-[11px] text-slate-500">
                Given under the Common Seal of Breakthrough International Bible University on the 29th day of November in the year of our Lord 2025.
              </p>
            </div>

            {/* Signature Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {/* Chancellor Signature */}
              <div className="text-center space-y-2 p-4 border border-slate-200 rounded-2xl bg-white">
                <div className="h-10 flex items-center justify-center font-serif italic text-slate-600 text-sm border-b border-slate-300">
                  Dr. Michael C. Sterling
                </div>
                <div>
                  <span className="font-display font-bold text-xs text-[#002366] block">Dr. Michael C. Sterling</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Chancellor</span>
                </div>
              </div>

              {/* Vice Chancellor Signature */}
              <div className="text-center space-y-2 p-4 border border-slate-200 rounded-2xl bg-white">
                <div className="h-10 flex items-center justify-center font-serif italic text-slate-600 text-sm border-b border-slate-300">
                  Prof. Dr. Patrick Njuguna
                </div>
                <div>
                  <span className="font-display font-bold text-xs text-[#002366] block">Prof. Dr. Patrick Njuguna</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Vice Chancellor</span>
                </div>
              </div>

              {/* Registrar Signature */}
              <div className="text-center space-y-2 p-4 border border-slate-200 rounded-2xl bg-white">
                <div className="h-10 flex items-center justify-center font-serif italic text-slate-600 text-sm border-b border-slate-300">
                  Rev. Dr. Sarah M. Jenkins
                </div>
                <div>
                  <span className="font-display font-bold text-xs text-[#002366] block">Rev. Dr. Sarah M. Jenkins</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">University Registrar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification & Security Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10.5px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>Official Verification Portal: <strong className="text-[#002366]">verify.bibu-edu.org</strong></span>
            </div>
            <div className="font-mono text-[10px] text-slate-400">
              LEDGER-HASH: BIBU-KENYA-2025-CONV-77-VERIFIED
            </div>
            <div>
              © 2025 Breakthrough International Bible University • All Rights Reserved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
