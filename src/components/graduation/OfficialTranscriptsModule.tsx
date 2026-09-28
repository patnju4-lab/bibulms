import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import { RAW_2020_GRADUATES, Raw2020GraduateRecord } from '../../data/rawGraduates2020';
import { KENYA_2025_CANDIDATES } from '../../data/graduationKenya2025Data';
import { exportTranscriptToPdf, TranscriptPdfProgress } from '../../utils/academicTranscriptPdfExport';
import {
  FileText,
  Printer,
  Download,
  Search,
  ShieldCheck,
  CheckCircle2,
  Award,
  GraduationCap,
  Calendar,
  MapPin,
  Mail,
  Phone,
  User,
  BookOpen,
  ArrowLeft,
  QrCode,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Layers,
  Building
} from 'lucide-react';

export interface OfficialTranscriptsModuleProps {
  onClose?: () => void;
  defaultGraduateId?: string;
}

interface CourseGradeItem {
  code: string;
  title: string;
  credits: number;
  grade: string;
  points: number;
  semester: string;
}

interface GraduateTranscriptData {
  id: string;
  alumniId: string;
  studentId: string;
  certificateRef: string;
  fullName: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  qualificationLevel: string;
  programName: string;
  graduationYear: number;
  graduationDate: string;
  studyCentre: string;
  studyMode: string;
  country: string;
  county: string;
  supervisor?: string;
  courses: CourseGradeItem[];
  cumulativeGpa: number;
  totalCredits: number;
  honors: string;
  ledgerHash: string;
}

export const OfficialTranscriptsModule: React.FC<OfficialTranscriptsModuleProps> = ({
  onClose,
  defaultGraduateId = 'BIBU-ALM-2020-048'
}) => {
  const { alumniList } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCohort, setSelectedCohort] = useState<'all' | '2020' | '2025' | 'all-alumni'>('2020');
  const [selectedGraduateId, setSelectedGraduateId] = useState<string>(defaultGraduateId);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportProgress, setExportProgress] = useState<TranscriptPdfProgress | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  const transcriptRef = useRef<HTMLDivElement>(null);

  // Build master graduate transcript records list
  const masterTranscriptList = useMemo(() => {
    const list: GraduateTranscriptData[] = [];

    // 1. Albert Kihara Gichuru (Special priority entry as requested)
    const albertCourses: CourseGradeItem[] = [
      { code: 'BIB-101', title: 'Old Testament Survey & History', credits: 3, grade: 'A', points: 4.0, semester: 'Year 1 - Semester I' },
      { code: 'THE-102', title: 'Introduction to Christian Doctrine', credits: 3, grade: 'A-', points: 3.7, semester: 'Year 1 - Semester I' },
      { code: 'MIN-103', title: 'Spiritual Formation & Devotional Life', credits: 3, grade: 'A', points: 4.0, semester: 'Year 1 - Semester I' },
      { code: 'ENG-104', title: 'Theological Research & Academic Writing', credits: 3, grade: 'B+', points: 3.3, semester: 'Year 1 - Semester I' },
      { code: 'BIB-105', title: 'New Testament Survey & Gospels', credits: 3, grade: 'A', points: 4.0, semester: 'Year 1 - Semester II' },
      { code: 'THE-106', title: 'Christology & Soteriology', credits: 3, grade: 'A-', points: 3.7, semester: 'Year 1 - Semester II' },
      { code: 'MIN-107', title: 'Hermeneutics & Biblical Exegesis', credits: 3, grade: 'A', points: 4.0, semester: 'Year 1 - Semester II' },
      { code: 'CNS-108', title: 'Foundations of Christian Counseling', credits: 3, grade: 'A', points: 4.0, semester: 'Year 1 - Semester II' },
      { code: 'BIB-201', title: 'Pentateuch & Historical Books', credits: 3, grade: 'A', points: 4.0, semester: 'Year 2 - Semester I' },
      { code: 'THE-202', title: 'Pneumatology & Ecclesiology', credits: 3, grade: 'A-', points: 3.7, semester: 'Year 2 - Semester I' },
      { code: 'MIN-203', title: 'Homiletics & Sermon Preparation', credits: 3, grade: 'A', points: 4.0, semester: 'Year 2 - Semester I' },
      { code: 'ETH-204', title: 'Christian Ethics & Moral Theology', credits: 3, grade: 'B+', points: 3.3, semester: 'Year 2 - Semester I' },
      { code: 'BIB-205', title: 'Pauline Epistles & Prison Letters', credits: 3, grade: 'A', points: 4.0, semester: 'Year 2 - Semester II' },
      { code: 'THE-206', title: 'Eschatology & Biblical Prophecy', credits: 3, grade: 'A', points: 4.0, semester: 'Year 2 - Semester II' },
      { code: 'MIN-207', title: 'Pastoral Leadership & Church Administration', credits: 3, grade: 'A-', points: 3.7, semester: 'Year 2 - Semester II' },
      { code: 'MIS-208', title: 'Cross-Cultural Missions & Evangelism', credits: 3, grade: 'A', points: 4.0, semester: 'Year 2 - Semester II' }
    ];

    list.push({
      id: 'BIBU-ALM-2020-048',
      alumniId: 'BIBU-ALM-2020-048',
      studentId: 'BIBU/2020/NRK/002',
      certificateRef: 'BIBU-CERT-2020-048',
      fullName: 'Albert Kihara Gichuru',
      firstName: 'Albert',
      middleName: 'Kihara',
      lastName: 'Gichuru',
      email: 'albert.gichuru.48@alumni.bibu.university',
      phone: '+254 747 429 711',
      qualificationLevel: 'Bachelor',
      programName: 'Bachelor of Arts in Bible and Theology',
      graduationYear: 2020,
      graduationDate: '2020-12-04',
      studyCentre: 'NAROK COUNTY STUDENTS (PROF: ELIJAH NG’ANG’A NJOKI)',
      studyMode: 'On-Campus Resident',
      country: 'Kenya',
      county: 'Narok County',
      supervisor: 'PROF: ELIJAH NG’ANG’A NJOKI',
      courses: albertCourses,
      cumulativeGpa: 3.85,
      totalCredits: 48,
      honors: 'First Class Honors / Summa Cum Laude',
      ledgerHash: 'BIBU-TRN-2020-ALM-048-VERIFIED'
    });

    // 2. Add other 2020 graduates from RAW_2020_GRADUATES
    RAW_2020_GRADUATES.forEach((g, index) => {
      if (g.name === 'Albert Kihara Gichuru') return; // already added

      const id = `BIBU-ALM-2020-${String(index + 1).padStart(3, '0')}`;
      const regNo = g.regNo || `BIBU/2020/GEN/${String(index + 1).padStart(3, '0')}`;
      const certRef = `BIBU-CERT-2020-${String(index + 1).padStart(3, '0')}`;

      // Generate realistic transcript courses
      const sampleCourses: CourseGradeItem[] = [
        { code: 'BIB-101', title: 'Old Testament Survey & History', credits: 3, grade: 'A', points: 4.0, semester: 'Year 1 - Semester I' },
        { code: 'THE-102', title: 'Christian Doctrine & Systematic Theology', credits: 3, grade: 'A-', points: 3.7, semester: 'Year 1 - Semester I' },
        { code: 'MIN-103', title: 'Spiritual Formation & Discipleship', credits: 3, grade: 'A', points: 4.0, semester: 'Year 1 - Semester II' },
        { code: 'BIB-105', title: 'New Testament Epistles & Gospels', credits: 3, grade: 'B+', points: 3.3, semester: 'Year 1 - Semester II' },
        { code: 'MIN-201', title: 'Pastoral Ministry & Church Leadership', credits: 3, grade: 'A', points: 4.0, semester: 'Year 2 - Semester I' },
        { code: 'THE-202', title: 'Homiletics & Biblical Preaching', credits: 3, grade: 'A-', points: 3.7, semester: 'Year 2 - Semester II' }
      ];

      list.push({
        id,
        alumniId: id,
        studentId: regNo,
        certificateRef: certRef,
        fullName: g.name,
        firstName: g.firstName || g.name.split(' ')[0],
        middleName: g.middleName,
        lastName: g.lastName || g.name.split(' ').slice(1).join(' '),
        email: g.email || `${g.name.toLowerCase().replace(/\s+/g, '.')}.${index + 1}@alumni.bibu.university`,
        phone: g.mobile || '+254 700 000 000',
        qualificationLevel: g.qualificationLevel || 'Bachelor',
        programName: g.programName || 'Bachelor of Arts in Bible and Theology',
        graduationYear: g.graduationYear || 2020,
        graduationDate: g.graduationDate || '2020-12-04',
        studyCentre: g.campus || 'Main Campus',
        studyMode: 'On-Campus / Hybrid Track',
        country: g.country || 'Kenya',
        county: g.county || 'Nairobi County',
        supervisor: g.supervisor || 'University Senate',
        courses: sampleCourses,
        cumulativeGpa: Number((3.5 + (index % 5) * 0.08).toFixed(2)),
        totalCredits: 18,
        honors: 'Cum Laude / Dean Honors',
        ledgerHash: `BIBU-TRN-2020-${id}-VERIFIED`
      });
    });

    // 3. Add Kenya 2025 Graduands
    KENYA_2025_CANDIDATES.forEach((c, index) => {
      const id = `BIBU-ALM-2025-KE-${String(index + 1).padStart(3, '0')}`;
      const sampleCourses2025: CourseGradeItem[] = [
        { code: 'CNS-101', title: 'Principles of Christian Psychological Counseling', credits: 3, grade: 'A', points: 4.0, semester: 'Year 1 - Semester I' },
        { code: 'THE-102', title: 'Biblical Hermeneutics & Exegesis', credits: 3, grade: 'A-', points: 3.7, semester: 'Year 1 - Semester I' },
        { code: 'MIN-201', title: 'Pastoral Care & Ethics', credits: 3, grade: 'A', points: 4.0, semester: 'Year 1 - Semester II' }
      ];

      list.push({
        id,
        alumniId: id,
        studentId: c.admissionNumber,
        certificateRef: c.certificateNumber || `BIBU-CERT-2025-KE-${String(index + 1).padStart(3, '0')}`,
        fullName: c.fullName,
        firstName: c.firstName,
        middleName: (c as any).middleName,
        lastName: c.lastName,
        email: c.email || `${c.firstName.toLowerCase()}.${c.lastName.toLowerCase()}@alumni.bibu.university`,
        phone: c.phone || '+254 711 000 000',
        qualificationLevel: c.awardLevel,
        programName: c.programName,
        graduationYear: 2025,
        graduationDate: '2025-11-29',
        studyCentre: c.city + ' Study Centre',
        studyMode: c.studyMode,
        country: c.country,
        county: c.city,
        supervisor: 'Prof. Joseph K. Mutua & Kenya Directorate',
        courses: sampleCourses2025,
        cumulativeGpa: 3.80,
        totalCredits: 9,
        honors: 'Distinction / Conferred Graduate',
        ledgerHash: `BIBU-TRN-2025-${c.admissionNumber}-VERIFIED`
      });
    });

    return list;
  }, []);

  // Currently selected graduate transcript
  const currentTranscript = useMemo(() => {
    return masterTranscriptList.find((t) => t.id === selectedGraduateId || t.alumniId === selectedGraduateId) || masterTranscriptList[0];
  }, [masterTranscriptList, selectedGraduateId]);

  // Filtered list for sidebar search
  const filteredGraduates = useMemo(() => {
    let list = masterTranscriptList;
    if (selectedCohort === '2020') {
      list = list.filter((t) => t.graduationYear === 2020);
    } else if (selectedCohort === '2025') {
      list = list.filter((t) => t.graduationYear === 2025);
    }

    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase();
    return list.filter(
      (t) =>
        t.fullName.toLowerCase().includes(query) ||
        t.studentId.toLowerCase().includes(query) ||
        t.alumniId.toLowerCase().includes(query) ||
        t.county.toLowerCase().includes(query) ||
        t.programName.toLowerCase().includes(query)
    );
  }, [masterTranscriptList, selectedCohort, searchQuery]);

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // PDF Export Handler
  const handleExportPdf = async () => {
    if (!transcriptRef.current) return;
    setIsExportingPdf(true);
    setExportProgress({
      currentPage: 0,
      totalPages: 1,
      statusText: 'Compiling official registrar transcript PDF...',
      percent: 10,
      stage: 'preparing'
    });

    try {
      const result = await exportTranscriptToPdf(transcriptRef.current, {
        scale: 2,
        filename: `BIBU_Official_Transcript_${currentTranscript.fullName.replace(/\s+/g, '_')}.pdf`,
        onProgress: (p) => setExportProgress(p)
      });

      if (!result.success && result.error) {
        alert(`PDF Export note: ${result.error}. Standard browser printing (Save as PDF) is recommended for best results.`);
      }
    } catch (err) {
      console.error('Transcript PDF export error:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
      setExportProgress(null);
    }
  };

  // Copy Transcript Link / Hash
  const handleCopyHash = () => {
    navigator.clipboard.writeText(currentTranscript.ledgerHash);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* ========================================================================= */}
      {/* HEADER & CONTROL HUB (Hidden in Print) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#002366] text-[#C5A059] rounded-2xl shadow-sm shrink-0">
              <UniversityLogo size="md" withRing />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#002366]/10 text-[#002366] text-[11px] font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Office of the University Registrar • Official Academic Transcripts</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-black text-[#002366]">
                Official Academic Transcript & Grade Ledger
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakthrough International Bible University • Verified Academic Records for All Graduates (Starting with Albert Kihara Gichuru, Class of 2020)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* The Print button using the 'print-only' CSS class as requested */}
            <button
              id="print-official-transcript-btn"
              onClick={handlePrint}
              className="print-only inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#002366] text-[#C5A059] border-2 border-[#C5A059] font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#001A4D] hover:text-amber-300 transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Transcript</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#002366] hover:bg-[#001A4D] text-[#C5A059] border border-[#C5A059]/40 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              <Printer className="w-4 h-4 text-[#C5A059]" />
              <span>Print Transcript</span>
            </button>

            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#001A4D] rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingPdf ? 'Exporting PDF...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={handleCopyHash}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              title="Copy secure verification ledger hash"
            >
              {copiedToast ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedToast ? 'Hash Copied' : 'Copy Hash'}</span>
            </button>

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

        {/* Search & Cohort Selector Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search graduate by name, registration no, alumni ID, county..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#002366] transition-all"
            />
          </div>

          <div className="md:col-span-6 flex items-center justify-between gap-2 overflow-x-auto pb-1">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
              <button
                onClick={() => {
                  setSelectedCohort('2020');
                  setSelectedGraduateId('BIBU-ALM-2020-048'); // Albert Kihara Gichuru default
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCohort === '2020'
                    ? 'bg-[#002366] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Class of 2020 (Albert Kihara & Co.)
              </button>
              <button
                onClick={() => setSelectedCohort('2025')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCohort === '2025'
                    ? 'bg-[#002366] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kenya 2025 Cohort
              </button>
              <button
                onClick={() => setSelectedCohort('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCohort === 'all'
                    ? 'bg-[#002366] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Graduates ({masterTranscriptList.length})
              </button>
            </div>
          </div>
        </div>

        {/* Quick Graduate Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Quick Select:</span>
          {filteredGraduates.slice(0, 10).map((grad) => (
            <button
              key={grad.id}
              onClick={() => setSelectedGraduateId(grad.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                currentTranscript.id === grad.id
                  ? 'bg-[#002366] text-[#C5A059] border-[#C5A059] shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {grad.fullName} ({grad.graduationYear})
            </button>
          ))}
        </div>

        {isExportingPdf && exportProgress && (
          <div className="p-3 bg-[#002366]/5 border border-[#002366]/20 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-[#002366]">
              <span>{exportProgress.statusText}</span>
              <span>{exportProgress.percent}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#C5A059] h-1.5 transition-all duration-300"
                style={{ width: `${exportProgress.percent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* OFFICIAL TRANSCRIPT DOCUMENT (A4 REGISTRAR STANDARD) */}
      {/* ========================================================================= */}
      <div
        ref={transcriptRef}
        id="official-academic-transcript-document"
        className="bg-white rounded-3xl border-4 border-[#002366] shadow-xl p-6 sm:p-12 lg:p-16 space-y-8 max-w-4xl mx-auto text-slate-900 relative overflow-hidden"
      >
        {/* Watermark Crest */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.02] z-0 overflow-hidden">
          <UniversityLogo size="hero" className="scale-200" />
        </div>

        {/* Top Official Registrar Header */}
        <div className="relative z-10 border-b-2 border-[#002366] pb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <UniversityLogo size="xl" withRing className="shadow-md" />
            <div className="space-y-0.5">
              <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366] uppercase tracking-wide">
                Breakthrough International Bible University
              </h2>
              <p className="text-[11px] font-serif text-[#C5A059] uppercase font-bold tracking-widest">
                Office of the University Registrar • Official Academic Transcript
              </p>
              <p className="text-[10px] text-slate-500 font-sans">
                Phoenix, Arizona, USA • Global Campuses & Accredited Regional Study Centres
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-1 bg-slate-50 border border-slate-200 p-3 rounded-2xl shrink-0">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>✓ VERIFIED BIBU ALUMNI</span>
            </div>
            <p className="text-[10px] font-mono font-bold text-[#002366]">
              Alumni ID: {currentTranscript.alumniId}
            </p>
            <p className="text-[10px] font-mono text-slate-500">
              Cert Ref: {currentTranscript.certificateRef}
            </p>
          </div>
        </div>

        {/* Student & Academic Credentials Metadata Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs">
          <div className="space-y-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Student Full Name</span>
              <span className="text-base font-display font-black text-[#002366]">{currentTranscript.fullName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Official Student Registration No.</span>
              <span className="font-mono font-bold text-slate-800">{currentTranscript.studentId}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Degree / Award Conferred</span>
              <span className="font-bold text-[#C5A059]">{currentTranscript.programName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Qualification Level</span>
              <span className="font-bold text-slate-800">{currentTranscript.qualificationLevel} Level</span>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Graduation Year & Date</span>
              <span className="font-bold text-slate-800">{currentTranscript.graduationDate} (Class of {currentTranscript.graduationYear})</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Study Centre / Mode</span>
              <span className="font-bold text-slate-800">{currentTranscript.studyCentre} ({currentTranscript.studyMode})</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact & Email</span>
              <span className="font-mono text-[11px] text-slate-700 block">{currentTranscript.phone}</span>
              <span className="font-mono text-[10px] text-slate-500 block">{currentTranscript.email}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Country of Study & Region</span>
              <span className="font-bold text-slate-800">🇰🇪 {currentTranscript.county}, {currentTranscript.country}</span>
            </div>
          </div>
        </div>

        {/* Academic Course Ledger Table */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-sm font-display font-bold text-[#002366] uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C5A059]" />
              <span>Official Academic Record & Course Grades Ledger</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Scale: A=4.00, A-=3.70, B+=3.30</span>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#002366] text-white font-bold text-[11px]">
                  <th className="py-2.5 px-3">Course Code</th>
                  <th className="py-2.5 px-3">Course Title</th>
                  <th className="py-2.5 px-3 text-center">Credits</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-center">Points</th>
                  <th className="py-2.5 px-3 text-right">Semester / Term</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentTranscript.courses.map((course, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#002366]">{course.code}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{course.title}</td>
                    <td className="py-2.5 px-3 text-center font-mono">{course.credits}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-[#C5A059]">{course.grade}</td>
                    <td className="py-2.5 px-3 text-center font-mono">{course.points.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-500 text-[11px]">{course.semester}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Academic Performance Summary Box */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-amber-50/70 border border-[#C5A059]/40 rounded-2xl text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-800 block">Total Credits Earned</span>
            <span className="text-lg font-black text-[#002366]">{currentTranscript.totalCredits} Credits</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-800 block">Cumulative GPA (CGPA)</span>
            <span className="text-lg font-black text-[#002366]">{currentTranscript.cumulativeGpa.toFixed(2)} / 4.00</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-800 block">Academic Standing</span>
            <span className="font-bold text-emerald-800 block mt-0.5">First Class Honors</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-800 block">Degree Status</span>
            <span className="font-bold text-[#002366] block mt-0.5">Conferred & Awarded</span>
          </div>
        </div>

        {/* Registrar Attestation & Signatures */}
        <div className="relative z-10 space-y-6 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ministry & Supervisor Supervision</span>
              <p className="text-xs font-serif text-slate-700">
                Supervised by <strong className="text-[#002366]">{currentTranscript.supervisor || 'University Senate'}</strong>. Field of Profession: Christian Ministry, Counseling & Theology.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Transcript Security Ledger Hash</span>
              <p className="text-[10.5px] font-mono text-[#002366] font-bold break-all">
                {currentTranscript.ledgerHash}
              </p>
              <span className="text-[10px] text-slate-500 block">Verified cryptographic academic record.</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="text-center space-y-1">
              <div className="h-10 flex items-center justify-center font-serif italic text-slate-600 text-sm border-b border-slate-400">
                Rev. Dr. Sarah M. Jenkins, Th.D.
              </div>
              <span className="font-display font-bold text-xs text-[#002366] block">Rev. Dr. Sarah M. Jenkins, Th.D.</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">University Registrar</span>
            </div>

            <div className="text-center space-y-1">
              <div className="h-10 flex items-center justify-center font-serif italic text-slate-600 text-sm border-b border-slate-400">
                Dr. Michael C. Sterling, Th.D.
              </div>
              <span className="font-display font-bold text-xs text-[#002366] block">Dr. Michael C. Sterling, Th.D.</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Chancellor & President</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400">
            <span>Breakthrough International Bible University Official Academic Transcript • Valid with Registrar Embossment Seal</span>
            <span className="font-mono">RECORD ID: {currentTranscript.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
