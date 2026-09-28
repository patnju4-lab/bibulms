import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  GraduationCap,
  Award,
  FileText,
  Printer,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Building,
  Download,
  Sliders,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  UserCheck,
  Hash,
  QrCode,
  RotateCcw,
  BadgePercent,
  CheckCircle,
  Mail,
  History,
  Clock,
  Lock,
  ArrowRightLeft,
  MessageSquare,
  Calculator,
  StickyNote
} from 'lucide-react';
import {
  exportTranscriptToPdf,
  TranscriptPdfProgress
} from '../../utils/academicTranscriptPdfExport';
import { TranscriptGeneratorModal } from './TranscriptGeneratorModal';
import { TranscriptVerificationModal } from './TranscriptVerificationModal';
import { EmailTranscriptModal } from './EmailTranscriptModal';
import { SecureShareModal } from './SecureShareModal';
import { TranscriptQrModal } from './TranscriptQrModal';
import { CreditTransferEvaluatorModal } from './CreditTransferEvaluatorModal';
import { GradeAppealModal } from './GradeAppealModal';
import { CreditProgressRadialChart } from './CreditProgressRadialChart';
import { PredictiveGpaCalculator } from './PredictiveGpaCalculator';
import { TranscriptRadialSummaryChart } from './TranscriptRadialSummaryChart';
import {
  PersonalCourseNotesModal,
  StudentCourseNote
} from './PersonalCourseNotesModal';
import { AcademicRegistrarStamp } from './AcademicRegistrarStamp';
import { TranscriptQrCodeBadge } from './TranscriptQrCodeBadge';
import { RegistrarSignature } from './RegistrarSignature';
import { CreditHoursDistributionChart } from './CreditHoursDistributionChart';
import { AcademicPerformanceOverview } from './AcademicPerformanceOverview';
import {
  AcademicHistoryLog,
  AcademicHistoryLogEntry,
  AcademicStatusChangeType
} from './AcademicHistoryLog';
import { GradeRecord } from '../../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  AreaChart
} from 'recharts';

export const TranscriptView: React.FC = () => {
  const { currentUser, setCurrentView, grades } = useApp();

  // Print & PDF ref
  const transcriptDocumentRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSecureShareOpen, setIsSecureShareOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isCreditEvaluatorOpen, setIsCreditEvaluatorOpen] = useState(false);
  const [isGradeAppealOpen, setIsGradeAppealOpen] = useState(false);
  const [showGpaPredictor, setShowGpaPredictor] = useState(true);
  const [exportProgress, setExportProgress] = useState<TranscriptPdfProgress | null>(null);
  const [copiedRefToast, setCopiedRefToast] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv'>('pdf');

  // Personal Course Notes State & LocalStorage Persistence
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedCourseForNote, setSelectedCourseForNote] = useState<{
    code: string;
    title: string;
    semester: string;
    grade?: string;
    credits?: number;
    instructor?: string;
  } | null>(null);

  const [courseNotes, setCourseNotes] = useState<Record<string, StudentCourseNote>>(() => {
    try {
      const saved = localStorage.getItem(`bibu_transcript_notes_${currentUser.id || 'default'}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    // Baseline sample notes for demonstration
    return {
      'BIB-101': {
        courseCode: 'BIB-101',
        courseTitle: 'Old Testament Survey: Law & Historical Books',
        semester: 'Fall 2024',
        noteText: 'Special focus on the Abrahamic Covenant (Genesis 12 & 15). Essential typology references for future Messianic theology lectures.',
        category: 'Exegesis',
        updatedAt: 'Sep 2, 2024, 10:15 AM'
      },
      'THE-201': {
        courseCode: 'THE-201',
        courseTitle: 'Systematic Theology I: Theology Proper, Christology & Pneumatology',
        semester: 'Spring 2025',
        noteText: 'Review Dr. Angelos notes regarding the Council of Nicaea (325 AD) vs Arianism. Key readings: Athanasius "On the Incarnation".',
        category: 'Textbooks & Resources',
        updatedAt: 'Feb 14, 2025, 03:40 PM'
      }
    };
  });

  const handleSaveCourseNote = (note: StudentCourseNote) => {
    setCourseNotes((prev) => {
      const updated = { ...prev, [note.courseCode]: note };
      try {
        localStorage.setItem(`bibu_transcript_notes_${currentUser.id || 'default'}`, JSON.stringify(updated));
      } catch {
        // storage quota fallback
      }
      return updated;
    });
  };

  const handleDeleteCourseNote = (courseCode: string) => {
    setCourseNotes((prev) => {
      const updated = { ...prev };
      delete updated[courseCode];
      try {
        localStorage.setItem(`bibu_transcript_notes_${currentUser.id || 'default'}`, JSON.stringify(updated));
      } catch {
        // fallback
      }
      return updated;
    });
  };

  const openCourseNoteEditor = (course: {
    code: string;
    title: string;
    semester: string;
    grade?: string;
    credits?: number;
    instructor?: string;
  }) => {
    setSelectedCourseForNote(course);
    setIsNotesModalOpen(true);
  };

  // Configuration options for official transcript compilation
  const [showOptionsPanel, setShowOptionsPanel] = useState(false);
  const [sortChronological, setSortChronological] = useState(true); // true = Fall 2024 -> Spring 2026
  const [includeWatermark, setIncludeWatermark] = useState(true);
  const [includeSignatures, setIncludeSignatures] = useState(true);
  const [includeGradingScale, setIncludeGradingScale] = useState(true);
  const [includeSecurityHash, setIncludeSecurityHash] = useState(true);
  const [includeInstructors, setIncludeInstructors] = useState(true);
  const [includeRadialChart, setIncludeRadialChart] = useState(true);
  const [includeCreditDistributionChart, setIncludeCreditDistributionChart] = useState(true);
  const [showPrivateNotesOnScreen, setShowPrivateNotesOnScreen] = useState(true);
  const [transcriptPurpose, setTranscriptPurpose] = useState<string>('Official Registrar Copy');
  const [issueDate, setIssueDate] = useState<string>('September 10, 2026');

  // Official Transcript Status & Associated Verification Timestamp
  // Note: The visual 'Registrar Signature' component appears ONLY when transcriptStatus === 'Verified'
  const [transcriptStatus, setTranscriptStatus] = useState<'Verified' | 'Pending Verification' | 'Draft' | 'Official'>('Verified');
  const [verificationTimestamp, setVerificationTimestamp] = useState<string>('September 28, 2026, 08:53:10 UTC');

  const handleMarkAsVerified = () => {
    const nowStamp = new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
    setTranscriptStatus('Verified');
    setVerificationTimestamp(nowStamp);
    logActivity('Verified Document', `Transcript status marked as 'Verified' with Registrar Digital Signature stamped at ${nowStamp}.`);
  };

  interface TranscriptActivityLogItem {
    id: string;
    timestamp: string;
    action: 'Generated PDF' | 'Downloaded CSV' | 'Emailed Transcript' | 'Verified Document' | 'Printed Report';
    ipAddress: string;
    status: 'Success' | 'Verified' | 'Dispatched';
    details: string;
  }

  // Academic History Log - Chronological list of major status changes for the transcript
  const [academicHistoryLogs, setAcademicHistoryLogs] = useState<AcademicHistoryLogEntry[]>([
    {
      id: 'ahl-5',
      timestamp: 'Today, 08:35 AM',
      statusChange: 'PDF Downloaded',
      category: 'Export',
      actor: 'Student Portal (Self-Service)',
      ipAddress: '192.168.1.45 (Phoenix, AZ)',
      documentRef: 'BIBU-TRN-2026-048',
      details: 'Official Registrar Copy compiled with high-resolution seal, QR verification matrix, and cryptographic hash.',
      isLatest: true
    },
    {
      id: 'ahl-4',
      timestamp: 'Yesterday, 04:12 PM',
      statusChange: 'Verified',
      category: 'Authentication',
      actor: 'Rev. Dr. Sarah M. Jenkins, Th.D. (Registrar)',
      ipAddress: '172.56.21.90 (Central Registry)',
      documentRef: 'BIBU-TRN-2026-048',
      details: 'Transcript authenticity validated against central registrar ledger. Cryptographic hash check passed successfully.'
    },
    {
      id: 'ahl-3',
      timestamp: 'September 10, 2026, 10:15 AM',
      statusChange: 'Transcript Stamped',
      category: 'Authentication',
      actor: 'Office of the Academic Registrar',
      ipAddress: '10.0.4.12 (Internal Server)',
      documentRef: 'BIBU-TRN-2026-048',
      details: 'Official university seal stamped with registrar wax motif and unique 2D verification QR code activated.'
    },
    {
      id: 'ahl-2',
      timestamp: 'May 20, 2025, 02:30 PM',
      statusChange: 'Grades Moderated',
      category: 'Senate Review',
      actor: 'University Academic Senate (Prof. Dr. Patrick Njuguna)',
      ipAddress: 'Senate Executive Office',
      documentRef: 'BIBU-TRN-2026-048',
      details: 'Faculty Examination Board completed bi-annual course moderation; confirmed 3.88 Cumulative GPA.'
    },
    {
      id: 'ahl-1',
      timestamp: 'August 15, 2024, 09:00 AM',
      statusChange: 'Record Created',
      category: 'Milestone',
      actor: 'Office of Admissions & Records',
      ipAddress: 'Student Information System (SIS)',
      documentRef: 'BIBU-TRN-2026-048',
      details: 'Candidate matriculation record initiated and academic ledger established for Bachelor of Arts in Theology.'
    }
  ]);

  const [activityLogs, setActivityLogs] = useState<TranscriptActivityLogItem[]>([
    {
      id: 'log-1',
      timestamp: 'Today, 08:35 AM',
      action: 'Generated PDF',
      ipAddress: '192.168.1.45 (Phoenix, AZ)',
      status: 'Success',
      details: 'Official Registrar Copy compiled with cryptographic verification hash.'
    },
    {
      id: 'log-2',
      timestamp: 'Yesterday, 04:12 PM',
      action: 'Verified Document',
      ipAddress: '172.56.21.90 (External Board)',
      status: 'Verified',
      details: 'Cryptographic hash check passed successfully against university ledger.'
    },
    {
      id: 'log-3',
      timestamp: 'May 14, 2026, 11:20 AM',
      action: 'Emailed Transcript',
      ipAddress: '192.168.1.45 (Phoenix, AZ)',
      status: 'Dispatched',
      details: 'Dispatched official transcript securely via SendGrid to admissions@seminary.edu.'
    }
  ]);

  const logActivity = (action: TranscriptActivityLogItem['action'], details: string) => {
    const newLog: TranscriptActivityLogItem = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      action,
      ipAddress: '192.168.1.45 (Current Session)',
      status: action === 'Emailed Transcript' ? 'Dispatched' : action === 'Verified Document' ? 'Verified' : 'Success',
      details
    };
    setActivityLogs(prev => [newLog, ...prev]);

    // Map to major status change in Academic History Log
    let statusChange: AcademicStatusChangeType = 'Record Created';
    let category: AcademicHistoryLogEntry['category'] = 'Milestone';

    if (action === 'Generated PDF' || action === 'Printed Report') {
      statusChange = 'PDF Downloaded';
      category = 'Export';
    } else if (action === 'Verified Document') {
      statusChange = 'Verified';
      category = 'Authentication';
    } else if (action === 'Emailed Transcript') {
      statusChange = 'Emailed';
      category = 'Export';
    } else if (action === 'Downloaded CSV') {
      statusChange = 'PDF Downloaded';
      category = 'Export';
    }

    const newHistoryEntry: AcademicHistoryLogEntry = {
      id: `ahl-${Date.now()}`,
      timestamp: 'Just now',
      statusChange,
      category,
      actor: action === 'Verified Document' ? 'Rev. Dr. Sarah M. Jenkins, Th.D. (Registrar)' : 'Student Portal (Current Session)',
      ipAddress: '192.168.1.45 (Current Session)',
      documentRef,
      details,
      isLatest: true
    };
    setAcademicHistoryLogs(prev => [newHistoryEntry, ...prev.map(p => ({ ...p, isLatest: false }))]);
  };

  // Digital Signatures State
  const [chancellorSigUrl, setChancellorSigUrl] = useState<string | null>(null);
  const [deanSigUrl, setDeanSigUrl] = useState<string | null>(null);
  const [registrarSigUrl, setRegistrarSigUrl] = useState<string | null>(null);

  const handleSigUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setter(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter student grades from context or fallback to comprehensive default course records
  const studentGrades = useMemo(() => {
    const raw = grades.filter((g) => g.studentId === currentUser.id);
    if (raw.length > 0) return raw;

    // Fallback baseline for students without recorded grades in mock data
    const baselineRecords: GradeRecord[] = [
      {
        id: 'fallback-1',
        studentId: currentUser.id,
        courseId: 'crs-herm-301',
        courseCode: 'BIB-301',
        courseTitle: 'Biblical Hermeneutics & Exegetical Method',
        creditHours: 3,
        semester: 'Fall 2024',
        year: 2024,
        assignmentScore: 94,
        quizScore: 92,
        examScore: 95,
        totalScore: 94,
        letterGrade: 'A',
        gradePoint: 4.0,
        instructorName: 'Dr. Thomas E. Wright, Ph.D.',
        schoolName: 'School of Biblical Studies',
        status: 'Completed',
        qualityPoints: 12.0
      },
      {
        id: 'fallback-2',
        studentId: currentUser.id,
        courseId: 'crs-theo-201',
        courseCode: 'THE-201',
        courseTitle: 'Systematic Theology I: Doctrine of God & Revelation',
        creditHours: 3,
        semester: 'Fall 2024',
        year: 2024,
        assignmentScore: 96,
        quizScore: 94,
        examScore: 97,
        totalScore: 96,
        letterGrade: 'A',
        gradePoint: 4.0,
        instructorName: 'Dr. Jonathan Vance, Th.D.',
        schoolName: 'School of Theology & Apologetics',
        status: 'Completed',
        qualityPoints: 12.0
      },
      {
        id: 'fallback-3',
        studentId: currentUser.id,
        courseId: 'crs-past-401',
        courseCode: 'PAS-401',
        courseTitle: 'Pastoral Ministry & Expository Preaching',
        creditHours: 3,
        semester: 'Spring 2025',
        year: 2025,
        assignmentScore: 90,
        quizScore: 89,
        examScore: 92,
        totalScore: 91,
        letterGrade: 'A-',
        gradePoint: 3.7,
        instructorName: 'Rev. Dr. Robert Lindqvist, D.Min.',
        schoolName: 'School of Pastoral Studies',
        status: 'Completed',
        qualityPoints: 11.1
      },
      {
        id: 'fallback-4',
        studentId: currentUser.id,
        courseId: 'crs-gre-101',
        courseCode: 'GRE-101',
        courseTitle: 'Biblical Greek I: Grammar & Morphology',
        creditHours: 3,
        semester: 'Spring 2025',
        year: 2025,
        assignmentScore: 95,
        quizScore: 93,
        examScore: 96,
        totalScore: 95,
        letterGrade: 'A',
        gradePoint: 4.0,
        instructorName: 'Prof. Demetrios Angelos, Ph.D.',
        schoolName: 'School of Biblical Studies',
        status: 'Completed',
        qualityPoints: 12.0
      }
    ];
    return baselineRecords;
  }, [grades, currentUser.id]);

  // Chronological order helper
  const allKnownSemestersChronological = ['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026'];

  // Dynamically compile courses grouped by semester
  const compiledSemesters = useMemo(() => {
    // Collect distinct terms
    const termsInGrades: string[] = Array.from(new Set(studentGrades.map((g) => g.semester)));
    
    // Sort terms chronologically or reverse
    const sortedTerms = [...termsInGrades].sort((a: string, b: string) => {
      const idxA = allKnownSemestersChronological.indexOf(a);
      const idxB = allKnownSemestersChronological.indexOf(b);
      if (idxA !== -1 && idxB !== -1) {
        return sortChronological ? idxA - idxB : idxB - idxA;
      }
      return sortChronological ? a.localeCompare(b) : b.localeCompare(a);
    });

    let cumulativeRunningCredits = 0;
    let cumulativeRunningQualityPoints = 0;

    return sortedTerms.map((term) => {
      const termCourses = studentGrades.filter((g) => g.semester === term);
      const termCreditsAttempted = termCourses.reduce((sum, c) => sum + c.creditHours, 0);
      const termCreditsEarned = termCourses
        .filter((c) => c.letterGrade !== 'F')
        .reduce((sum, c) => sum + c.creditHours, 0);
      const termQualityPoints = termCourses.reduce((sum, c) => sum + c.creditHours * c.gradePoint, 0);
      const termGpa = termCreditsAttempted > 0 ? termQualityPoints / termCreditsAttempted : 0;

      cumulativeRunningCredits += termCreditsAttempted;
      cumulativeRunningQualityPoints += termQualityPoints;
      const runningCumulativeGpa =
        cumulativeRunningCredits > 0 ? cumulativeRunningQualityPoints / cumulativeRunningCredits : 0;

      return {
        term,
        termCreditsAttempted,
        termCreditsEarned,
        termQualityPoints,
        termGpa,
        runningCredits: cumulativeRunningCredits,
        runningGpa: runningCumulativeGpa,
        courses: termCourses.map((c) => ({
          code: c.courseCode,
          title: c.courseTitle,
          credits: c.creditHours,
          grade: c.letterGrade,
          gradePoint: c.gradePoint,
          qualityPoints: c.creditHours * c.gradePoint,
          instructor: c.instructorName || 'Department Faculty',
          school: c.schoolName || 'School of Theology'
        }))
      };
    });
  }, [studentGrades, sortChronological]);

  // Overall Cumulative Compilation
  const totalAttemptedCredits = useMemo(
    () => studentGrades.reduce((acc, g) => acc + g.creditHours, 0),
    [studentGrades]
  );
  const totalEarnedCredits = useMemo(
    () =>
      studentGrades
        .filter((g) => g.letterGrade !== 'F')
        .reduce((acc, g) => acc + g.creditHours, 0),
    [studentGrades]
  );
  const totalQualityPoints = useMemo(
    () => studentGrades.reduce((acc, g) => acc + g.creditHours * g.gradePoint, 0),
    [studentGrades]
  );
  const compiledGpa = useMemo(() => {
    if (totalAttemptedCredits > 0) {
      return totalQualityPoints / totalAttemptedCredits;
    }
    return currentUser.gpa || 3.84;
  }, [totalAttemptedCredits, totalQualityPoints, currentUser.gpa]);

  // Conferred credits based on student profile or courses
  const totalCreditsConferred = currentUser.creditsEarned || totalEarnedCredits;
  const totalDegreeCreditsRequired = currentUser.totalRequiredCredits || 120;
  const degreeProgressPercent = Math.min(100, Math.round((totalCreditsConferred / totalDegreeCreditsRequired) * 100));

  // Academic Standing & Latin Honors Classification
  const academicStandingInfo = useMemo(() => {
    if (compiledGpa >= 3.9) {
      return {
        standing: 'Good Standing — Dean’s Highest Commendation',
        latinHonors: 'Summa Cum Laude (Highest Honors)',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
      };
    }
    if (compiledGpa >= 3.75) {
      return {
        standing: 'Good Standing — Dean’s Honor Roll',
        latinHonors: 'Magna Cum Laude (High Honors)',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
      };
    }
    if (compiledGpa >= 3.5) {
      return {
        standing: 'Good Standing — Academic Honors Roll',
        latinHonors: 'Cum Laude (Honors)',
        badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
      };
    }
    if (compiledGpa >= 2.0) {
      return {
        standing: 'Good Academic Standing',
        latinHonors: 'Satisfactory Progress',
        badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
      };
    }
    return {
      standing: 'Academic Probation / Review',
      latinHonors: 'Under Review',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300'
    };
  }, [compiledGpa]);

  // Deterministic Official Verification Reference & SHA-256 Hash
  const documentRef = useMemo(() => {
    const cleanId = (currentUser.studentId || 'BIBU-ST-7492').replace(/[^a-zA-Z0-9]/g, '');
    return `TRN-BIBU-2026-${cleanId.slice(-4)}`;
  }, [currentUser.studentId]);

  const verificationHash = useMemo(() => {
    // Generate deterministic 64-character hex hash representation
    const base = `${currentUser.id}_${currentUser.studentId}_${compiledGpa.toFixed(2)}_${totalCreditsConferred}_2026`;
    let hash = 0x811c9dc5;
    for (let i = 0; i < base.length; i++) {
      hash ^= base.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
    const hex1 = ('00000000' + (hash >>> 0).toString(16)).slice(-8);
    const hex2 = ('00000000' + ((hash ^ 0xabcdef12) >>> 0).toString(16)).slice(-8);
    const hex3 = ('00000000' + ((hash ^ 0x3456789a) >>> 0).toString(16)).slice(-8);
    const hex4 = ('00000000' + ((hash ^ 0x98765432) >>> 0).toString(16)).slice(-8);
    return `sha256:e7a9b31d${hex1}${hex2}${hex3}${hex4}f92c4a88`;
  }, [currentUser.id, currentUser.studentId, compiledGpa, totalCreditsConferred]);

  const pdfFilename = useMemo(() => {
    const studentNameSafe = (currentUser.name || 'Student').replace(/\s+/g, '_');
    const studentIdSafe = (currentUser.studentId || 'ID').replace(/[^a-zA-Z0-9_-]/g, '');
    return `BIBU_Official_Academic_Transcript_${studentNameSafe}_${studentIdSafe}.pdf`;
  }, [currentUser.name, currentUser.studentId]);

  // Handle PDF Generation
  const handleGeneratePdf = async () => {
    if (!transcriptDocumentRef.current) return;
    setIsGeneratorOpen(true);
    logActivity('Generated PDF', `Compiled official academic transcript PDF (${pdfFilename}).`);

    try {
      await exportTranscriptToPdf(transcriptDocumentRef.current, {
        filename: pdfFilename,
        scale: 2,
        onProgress: (prog) => {
          setExportProgress(prog);
        }
      });
    } catch (err) {
      console.error('Transcript PDF export failed:', err);
    }
  };

  const handleExportCsv = () => {
    const headers = ['Student ID', 'Student Name', 'Semester', 'Course Code', 'Course Title', 'Credits', 'Letter Grade', 'Grade Point', 'Quality Points', 'Instructor'];
    const rows = studentGrades.map((g) => [
      currentUser.studentId,
      `"${currentUser.name}"`,
      `"${g.semester}"`,
      `"${g.courseCode}"`,
      `"${g.courseTitle}"`,
      g.creditHours,
      g.letterGrade,
      g.gradePoint,
      g.qualityPoints ?? (g.creditHours * g.gradePoint),
      `"${g.instructorName || 'Department Faculty'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BIBU_Academic_Transcript_${currentUser.studentId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logActivity('Downloaded CSV', `Downloaded academic course records CSV export.`);
  };

  const handleExport = () => {
    if (exportFormat === 'csv') {
      handleExportCsv();
    } else {
      handleGeneratePdf();
    }
  };

  const handlePrint = () => {
    logActivity('Printed Report', `Sent transcript layout to local printer.`);
    window.print();
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(documentRef);
    setCopiedRefToast(true);
    setTimeout(() => setCopiedRefToast(false), 2500);
  };

  // Split compiled semesters for multi-page official registrar balance
  const page1Semesters = compiledSemesters.slice(0, 2);
  const page2Semesters = compiledSemesters.slice(2);

  // Reusable official transcript footer with cumulative summary, grading regulations, signatures,
  // Academic Registrar Digital Signature & Stylized Stamp (validating metadata), Unique Verification QR Code, and security hash
  const renderOfficialTranscriptFooter = () => (
    <div className="space-y-6 pt-2">
      {/* Official Academic Cumulative Summary Box */}
      <div className="relative z-10 p-5 bg-[#002366] text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#002366] shadow-sm">
        <div className="space-y-1.5">
          <div className="text-xs uppercase tracking-wider text-[#C5A059] font-black font-display flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#C5A059]" />
            <span>Cumulative Academic Standing & Record</span>
          </div>
          <div className="text-xs text-slate-200">
            Total Credits Attempted: <strong className="text-white">{totalAttemptedCredits}</strong> •
            Credits Earned / Conferred: <strong className="text-white">{totalCreditsConferred}</strong> •
            Quality Points: <strong className="text-white">{totalQualityPoints.toFixed(1)}</strong>
          </div>
          <div className="text-[11px] text-[#C5A059] font-bold">
            Academic Classification: {academicStandingInfo.latinHonors}
          </div>
        </div>

        <div className="text-center sm:text-right bg-white/10 sm:bg-transparent px-4 py-2 sm:p-0 rounded-lg sm:rounded-none w-full sm:w-auto">
          <div className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">
            Cumulative Grade Point Average
          </div>
          <div className="text-3xl sm:text-4xl font-black font-display text-[#C5A059]">
            {compiledGpa.toFixed(2)}{' '}
            <span className="text-xs text-slate-300 font-normal">/ 4.00</span>
          </div>
        </div>
      </div>

      {/* Program Degree Progress Radial Bar Summary Chart (Printed in Official PDF) */}
      {includeRadialChart && (
        <div className="relative z-10">
          <TranscriptRadialSummaryChart
            totalCreditsEarned={totalCreditsConferred}
            totalCreditsRequired={totalDegreeCreditsRequired}
            studentGrades={studentGrades}
            programName={currentUser.programName || 'Degree Program'}
          />
        </div>
      )}

      {/* Structured Credit Hours Distribution Chart (Completed Modules, Electives, and Thesis Credits) */}
      {includeCreditDistributionChart && (
        <div className="relative z-10">
          <CreditHoursDistributionChart
            studentGrades={studentGrades}
            totalCreditsEarned={totalCreditsConferred}
            totalCreditsRequired={totalDegreeCreditsRequired}
            programName={currentUser.programName || 'Bachelor of Arts in Theology & Biblical Studies'}
          />
        </div>
      )}

      {/* Official Registrar Grading Scale & Policy Legend */}
      {includeGradingScale && (
        <div className="relative z-10 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-2 text-[10px] leading-relaxed">
          <div className="font-bold uppercase tracking-wider text-[#002366] font-display text-[11px] flex items-center justify-between">
            <span>Registrar Grading System & Academic Regulations</span>
            <span className="text-slate-400 font-mono text-[9px]">REG-STD-2026</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 font-mono text-[10px] bg-white p-2 rounded border border-slate-200 text-center">
            <div><strong className="text-[#002366]">A:</strong> 4.00 (95-100%)</div>
            <div><strong className="text-[#002366]">A-:</strong> 3.70 (90-94%)</div>
            <div><strong className="text-[#002366]">B+:</strong> 3.30 (85-89%)</div>
            <div><strong className="text-[#002366]">B:</strong> 3.00 (80-84%)</div>
            <div><strong className="text-[#002366]">B-:</strong> 2.70 (77-79%)</div>
            <div><strong className="text-[#002366]">C+:</strong> 2.30 (74-76%)</div>
            <div><strong className="text-[#002366]">C:</strong> 2.00 (70-73%)</div>
            <div><strong className="text-[#002366]">F:</strong> 0.00 (Fail)</div>
          </div>

          <p className="text-slate-500 text-[10px]">
            <strong>Credit Hour Standard:</strong> One semester credit corresponds to 15 hours of classroom or online faculty-directed theological instruction and 30 hours of guided research.
            <strong> Honors Thresholds:</strong> Summa Cum Laude (3.90–4.00), Magna Cum Laude (3.75–3.89), Cum Laude (3.50–3.74). Good Academic Standing requires a minimum GPA of 2.00.
          </p>
        </div>
      )}

      {/* Official Registrar Seal, Endorsements & Three Security Signatures */}
      {includeSignatures && (
        <div className="relative z-10 pt-4 border-t-2 border-[#002366] grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-xs">
          {/* Chancellor Signature */}
          <div className="space-y-1 text-center sm:text-left">
            <div className="h-10 flex items-end justify-center sm:justify-start border-b border-slate-300 pb-1">
              {chancellorSigUrl ? (
                <img src={chancellorSigUrl} alt="Chancellor Signature" className="max-h-9 max-w-[130px] object-contain" />
              ) : (
                <span className="font-display italic text-sm text-[#002366] font-bold">
                  Michael C. Sterling
                </span>
              )}
            </div>
            <div className="text-[9px] font-bold uppercase text-slate-700">
              Dr. Michael C. Sterling, Th.D.
            </div>
            <div className="text-[9px] text-slate-500">
              Chancellor & President • Issued from Phoenix USA
            </div>
          </div>

          {/* Vice Chancellor Signature */}
          <div className="space-y-1 text-center">
            <div className="h-10 flex items-end justify-center border-b border-slate-300 pb-1">
              {deanSigUrl ? (
                <img src={deanSigUrl} alt="Vice Chancellor Signature" className="max-h-9 max-w-[130px] object-contain" />
              ) : (
                <span className="font-display italic text-sm text-[#002366] font-bold">
                  Patrick Njuguna
                </span>
              )}
            </div>
            <div className="text-[9px] font-bold uppercase text-slate-700">
              Prof. Dr. Patrick Njuguna, Ph.D.
            </div>
            <div className="text-[9px] text-slate-500">
              Vice Chancellor & Senate Chair
            </div>
          </div>

          {/* Registrar Signature - Appears verified with stylized overlay and timestamp when status === 'Verified' */}
          {transcriptStatus === 'Verified' ? (
            <RegistrarSignature
              variant="inline"
              status={transcriptStatus}
              timestamp={verificationTimestamp}
              registrarName="Rev. Dr. Sarah M. Jenkins, Th.D."
              registrarTitle="University Registrar & Chief Academic Records Officer"
              verificationSerial={documentRef}
              securityHash={verificationHash}
              customSignatureUrl={registrarSigUrl}
            />
          ) : (
            <div className="space-y-1 text-center sm:text-right">
              <div className="h-14 sm:h-16 flex items-end justify-center sm:justify-end border-b-2 border-dashed border-amber-300 pb-1.5">
                <span className="text-[9.5px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block font-semibold">
                  [ Signature Pending — Status: {transcriptStatus} ]
                </span>
              </div>
              <div className="text-[10px] font-black uppercase text-slate-500 font-display">
                Rev. Dr. Sarah M. Jenkins, Th.D.
              </div>
              <div className="text-[9px] text-slate-400 font-medium">
                University Registrar (Unsigned)
              </div>
              <button
                type="button"
                onClick={handleMarkAsVerified}
                className="no-print text-[8.5px] text-emerald-700 font-mono hover:underline cursor-pointer font-bold inline-block"
              >
                Mark as Verified & Apply Signature
              </button>
            </div>
          )}
        </div>
      )}

      {/* Visual 'Registrar Signature' Component - Appears ONLY when transcript status is marked as 'Verified' */}
      <RegistrarSignature
        variant="compact"
        status={transcriptStatus}
        timestamp={verificationTimestamp}
        registrarName="Rev. Dr. Sarah M. Jenkins, Th.D."
        registrarTitle="University Registrar & Chief Academic Records Officer"
        institutionName="Breakthrough International Bible University"
        verificationSerial={documentRef}
        securityHash={verificationHash}
        customSignatureUrl={registrarSigUrl}
      />

      {/* Academic Registrar Digital Signature & Stylized Stamp Component validating metadata */}
      <div className="relative z-10">
        <AcademicRegistrarStamp
          registrarName="Rev. Dr. Sarah M. Jenkins, Th.D."
          registrarTitle="University Registrar & Chief Academic Records Officer"
          verificationCode={documentRef}
          securityHash={verificationHash}
          issueDate={issueDate || currentUser.graduationDate || 'September 10, 2026'}
          studentName={currentUser.name}
          studentId={currentUser.studentId}
          programName={currentUser.programName || 'Degree Program'}
          cumulativeGpa={compiledGpa}
          creditsConferred={totalCreditsConferred}
          academicStanding={academicStandingInfo.latinHonors}
          onVerifyClick={() => setIsVerificationOpen(true)}
        />
      </div>

      {/* Unique QR Code Linking to Secure Certificate Verification Endpoint */}
      <div className="relative z-10">
        <TranscriptQrCodeBadge
          documentRef={documentRef}
          verificationHash={verificationHash}
          studentId={currentUser.studentId}
          studentName={currentUser.name}
          programName={currentUser.programName || 'Degree Program'}
          cumulativeGpa={compiledGpa}
          issueDate={issueDate || currentUser.graduationDate || 'September 10, 2026'}
          onOpenVerification={() => setIsVerificationOpen(true)}
          onOpenQrModal={() => setIsQrModalOpen(true)}
        />
      </div>

      {/* Cryptographic Verification Footer */}
      {includeSecurityHash && (
        <div className="relative z-10 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate max-w-md">Digital Record Verification Hash: <strong className="text-slate-700">{verificationHash}</strong></span>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span>Document Serial: <strong className="text-[#002366]">{documentRef}</strong></span>
            <span>•</span>
            <span>Online Verification: bibu.university/verify</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Top Action & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print pb-2 border-b border-slate-200">
        <button
          onClick={() => setCurrentView('student-dashboard')}
          className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-[#002366] flex items-center gap-2 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Student Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowOptionsPanel(!showOptionsPanel)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all border ${
              showOptionsPanel
                ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Transcript Options</span>
          </button>

          <button
            onClick={() => setIsVerificationOpen(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 flex items-center gap-2 transition-all shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verify Document</span>
          </button>

          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 flex items-center gap-2 transition-all shadow-xs"
          >
            <Mail className="w-3.5 h-3.5 text-[#002366]" />
            <span>Email Transcript</span>
          </button>

          <button
            onClick={() => setIsSecureShareOpen(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 flex items-center gap-2 transition-all shadow-xs"
          >
            <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Secure Share</span>
          </button>

          <button
            onClick={() => setIsQrModalOpen(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 flex items-center gap-2 transition-all shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-700" />
            <span>QR Authenticator</span>
          </button>

          <button
            onClick={() => setIsCreditEvaluatorOpen(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 flex items-center gap-2 transition-all shadow-xs"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Credit Evaluator</span>
          </button>

          <button
            onClick={() => setIsGradeAppealOpen(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 flex items-center gap-2 transition-all shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
            <span>Grade Appeal</span>
          </button>

          <button
            onClick={() => setShowPrivateNotesOnScreen(!showPrivateNotesOnScreen)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-xs border ${
              showPrivateNotesOnScreen
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
            title="Toggle visibility of private course notes on transcript screen"
          >
            <StickyNote className="w-3.5 h-3.5 text-amber-600" />
            <span>
              Private Notes ({Object.keys(courseNotes).length})
            </span>
          </button>

          <button
            onClick={() => setShowGpaPredictor(!showGpaPredictor)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-xs border ${
              showGpaPredictor
                ? 'bg-blue-50 text-[#002366] border-blue-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Predictive GPA</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 flex items-center gap-2 transition-all shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#002366]" />
            <span>Print Layout</span>
          </button>

          <button
            onClick={() => {
              logActivity('Printed Report', `Triggered print dialog for official PDF transcript download.`);
              window.print();
            }}
            className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 transition-all active:scale-95"
            title="Triggers browser print dialog optimized with @media print styles for saving as official PDF"
          >
            <Printer className="w-4 h-4 text-[#C5A059]" />
            <span>Download Official Transcript (PDF)</span>
          </button>

          <div className="flex items-center gap-2">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'pdf' | 'csv')}
              aria-label="Export Format"
              className="py-2 px-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 shadow-xs focus:outline-none focus:ring-1 focus:ring-[#002366]"
            >
              <option value="pdf">Format: PDF Document</option>
              <option value="csv">Format: CSV Spreadsheet</option>
            </select>

            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-[#C5A059]" />
              <span>{exportFormat === 'csv' ? 'Download CSV' : 'Generate Official PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Copy Toast */}
      {copiedRefToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-slide-up">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Document Reference <strong className="font-mono text-[#C5A059]">{documentRef}</strong> copied to clipboard!</span>
        </div>
      )}

      {/* Interactive Options Drawer / Configuration Panel */}
      {showOptionsPanel && (
        <div className="no-print bg-slate-50 rounded-xl border border-slate-300 p-5 space-y-4 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#002366] font-display">
              <Sliders className="w-4 h-4 text-[#C5A059]" />
              <span>Registrar Transcript Customization & Report Formatting</span>
            </div>
            <span className="text-[11px] text-slate-500">
              Settings automatically apply to rendered PDF and print reports
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Transcript Status (Controls Registrar Signature Component) */}
            <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 block">Transcript Status</label>
                <span
                  className={`text-[8.5px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    transcriptStatus === 'Verified'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {transcriptStatus}
                </span>
              </div>
              <select
                value={transcriptStatus}
                onChange={(e) => {
                  const val = e.target.value as 'Verified' | 'Pending Verification' | 'Draft' | 'Official';
                  setTranscriptStatus(val);
                  if (val === 'Verified') {
                    const now = new Date().toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      timeZoneName: 'short'
                    });
                    setVerificationTimestamp(now);
                    logActivity('Verified Document', `Status set to 'Verified' with Registrar Digital Signature applied.`);
                  }
                }}
                className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002366]"
              >
                <option value="Verified">Verified (Registrar Signature Active)</option>
                <option value="Pending Verification">Pending Verification (Unsigned)</option>
                <option value="Draft">Draft (Unofficial Student Copy)</option>
                <option value="Official">Official (Standard Archival)</option>
              </select>
              <p className="text-[9px] text-slate-500 italic leading-snug">
                * Registrar Signature & stylized overlay appear only when status is 'Verified'.
              </p>
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
              <label className="font-bold text-slate-700 block">Course History Sorting</label>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setSortChronological(true)}
                  className={`flex-1 py-1.5 px-2 rounded text-[11px] font-bold text-center border transition-all ${
                    sortChronological
                      ? 'bg-[#002366] text-white border-[#002366]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Oldest First
                </button>
                <button
                  onClick={() => setSortChronological(false)}
                  className={`flex-1 py-1.5 px-2 rounded text-[11px] font-bold text-center border transition-all ${
                    !sortChronological
                      ? 'bg-[#002366] text-white border-[#002366]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Newest First
                </button>
              </div>
            </div>

            {/* Purpose */}
            <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
              <label className="font-bold text-slate-700 block">Transcript Purpose</label>
              <select
                value={transcriptPurpose}
                onChange={(e) => setTranscriptPurpose(e.target.value)}
                className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002366]"
              >
                <option value="Official Registrar Copy">Official Registrar Copy</option>
                <option value="Graduate School Admissions">Graduate School Admissions</option>
                <option value="Licensure & Ordination Board">Licensure & Ordination Board</option>
                <option value="Official Employment Verification">Employment Verification</option>
                <option value="Unofficial Student Copy">Unofficial Student Copy</option>
              </select>
            </div>

            {/* Date */}
            <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
              <label className="font-bold text-slate-700 block">Certification Issue Date</label>
              <input
                type="text"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002366]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={includeGradingScale}
                onChange={(e) => setIncludeGradingScale(e.target.checked)}
                className="rounded text-[#002366] focus:ring-[#002366]"
              />
              <span>Include Grading Scale & Academic Regulations Legend</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={includeSecurityHash}
                onChange={(e) => setIncludeSecurityHash(e.target.checked)}
                className="rounded text-[#002366] focus:ring-[#002366]"
              />
              <span>Include Cryptographic Hash & QR Verification</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={includeInstructors}
                onChange={(e) => setIncludeInstructors(e.target.checked)}
                className="rounded text-[#002366] focus:ring-[#002366]"
              />
              <span>Display Instructor Names</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={includeRadialChart}
                onChange={(e) => setIncludeRadialChart(e.target.checked)}
                className="rounded text-[#002366] focus:ring-[#002366]"
              />
              <span>Include Radial Progress Summary Chart in Official PDF</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={includeCreditDistributionChart}
                onChange={(e) => setIncludeCreditDistributionChart(e.target.checked)}
                className="rounded text-[#002366] focus:ring-[#002366]"
              />
              <span>Include Credit Hours Distribution Chart (Modules, Electives & Thesis)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={showPrivateNotesOnScreen}
                onChange={(e) => setShowPrivateNotesOnScreen(e.target.checked)}
                className="rounded text-[#002366] focus:ring-[#002366]"
              />
              <span>Show Personal Course Notes on Screen View</span>
            </label>
          </div>

          {/* Dynamic Signatures Upload Section */}
          <div className="pt-3 border-t border-slate-200">
            <span className="font-bold text-slate-700 block mb-2 text-xs">
              Upload Signatory Digital Signatures (Chancellor, Vice Chancellor, Registrar)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded border border-slate-200 flex items-center justify-between gap-2">
                <span className="font-semibold truncate">Chancellor Sig</span>
                <label className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer text-[11px] font-bold">
                  {chancellorSigUrl ? 'Change' : 'Upload'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSigUpload(e, setChancellorSigUrl)} />
                </label>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200 flex items-center justify-between gap-2">
                <span className="font-semibold truncate">Vice Chancellor Sig</span>
                <label className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer text-[11px] font-bold">
                  {deanSigUrl ? 'Change' : 'Upload'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSigUpload(e, setDeanSigUrl)} />
                </label>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200 flex items-center justify-between gap-2">
                <span className="font-semibold truncate">Registrar Sig</span>
                <label className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer text-[11px] font-bold">
                  {registrarSigUrl ? 'Change' : 'Upload'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSigUpload(e, setRegistrarSigUrl)} />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Academic Highlights Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        {/* Cumulative GPA Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#002366]/10 text-[#002366] flex items-center justify-center shrink-0 border border-[#002366]/20">
            <Award className="w-6 h-6 text-[#C5A059]" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Cumulative GPA
            </div>
            <div className="text-2xl font-black font-display text-[#002366]">
              {compiledGpa.toFixed(2)}{' '}
              <span className="text-xs text-slate-400 font-normal">/ 4.00</span>
            </div>
            <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
              {academicStandingInfo.latinHonors}
            </div>
          </div>
        </div>

        {/* Credits Earned Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Credits Conferred
            </div>
            <div className="text-2xl font-black font-display text-slate-900">
              {totalCreditsConferred}{' '}
              <span className="text-xs text-slate-400 font-normal">/ {totalDegreeCreditsRequired}</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
              {degreeProgressPercent}% Degree Requirements Met
            </div>
          </div>
        </div>

        {/* Quality Points Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
            <BadgePercent className="w-6 h-6 text-[#C5A059]" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Total Quality Points
            </div>
            <div className="text-2xl font-black font-display text-slate-900">
              {totalQualityPoints.toFixed(1)}
            </div>
            <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
              {studentGrades.length} Course Records Compiled
            </div>
          </div>
        </div>

        {/* Document Control Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
            <ShieldCheck className="w-6 h-6 text-blue-700" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Official Document Ref
            </div>
            <div className="text-sm font-mono font-bold text-slate-900 truncate">
              {documentRef}
            </div>
            <button
              onClick={handleCopyRef}
              className="text-[11px] font-bold text-[#002366] hover:text-[#C5A059] flex items-center gap-1 mt-0.5"
            >
              <Copy className="w-3 h-3" />
              <span>Copy Registry Ref</span>
            </button>
          </div>
        </div>
      </div>

      {/* Degree Program Credits Radial Bar Progress & Deficit Audit */}
      <CreditProgressRadialChart
        totalCreditsEarned={totalCreditsConferred}
        totalCreditsRequired={totalDegreeCreditsRequired}
        programName={currentUser.programName || 'Bachelor of Theology (B.Th.) in Pastoral Ministry'}
        studentGrades={studentGrades}
        onOpenCreditEvaluator={() => setIsCreditEvaluatorOpen(true)}
      />

      {/* On-Screen Structured Credit Hours Distribution Breakdown (Completed Modules, Electives & Thesis) */}
      <div className="no-print">
        <CreditHoursDistributionChart
          studentGrades={studentGrades}
          totalCreditsEarned={totalCreditsConferred}
          totalCreditsRequired={totalDegreeCreditsRequired}
          programName={currentUser.programName || 'Bachelor of Arts in Theology & Biblical Studies'}
          variant="dashboard"
        />
      </div>

      {/* Predictive GPA Calculator & Semester Performance Forecaster */}
      {showGpaPredictor && (
        <PredictiveGpaCalculator
          currentCumulativeGpa={compiledGpa}
          currentAttemptedCredits={totalAttemptedCredits}
          currentEarnedCredits={totalEarnedCredits}
          currentQualityPoints={totalQualityPoints}
          studentGrades={studentGrades}
        />
      )}

      {/* Academic Performance Overview Section - Recharts Visualization of Grade Trends & Cumulative GPA Progression */}
      <div className="no-print">
        <AcademicPerformanceOverview
          compiledSemesters={compiledSemesters}
          cumulativeGpa={compiledGpa}
          totalAttemptedCredits={totalAttemptedCredits}
          totalEarnedCredits={totalCreditsConferred}
          studentGrades={studentGrades}
        />
      </div>

      {/* Document Action Banner & Print Optimization Notice */}
      <div className="no-print bg-gradient-to-r from-[#002366] to-[#001740] rounded-xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-[#002366]">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
            <FileText className="w-6 h-6 text-[#C5A059]" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex flex-wrap items-center gap-2">
              <span>Official Academic Transcript Document</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  transcriptStatus === 'Verified'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                ● Status: {transcriptStatus}
              </span>
              {transcriptStatus !== 'Verified' && (
                <button
                  type="button"
                  onClick={handleMarkAsVerified}
                  className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-0.5 rounded-md shadow transition-all flex items-center gap-1 cursor-pointer"
                  title="Mark status as Verified to activate the Registrar Digital Signature"
                >
                  <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
                  <span>Mark as Verified (Apply Registrar Signature)</span>
                </button>
              )}
              <span className="text-[10px] bg-[#C5A059]/20 text-[#C5A059] font-bold px-2 py-0.5 rounded-full border border-[#C5A059]/30">
                A4 Vector Print Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Certified document with university seal, Senate signatures, and ledger hash. Select &quot;Save as PDF&quot; in the print dialog.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            logActivity('Generated PDF', 'Triggered browser print dialog for Official Transcript PDF download (Save as PDF).');
            window.print();
          }}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#C5A059] hover:bg-[#b08d47] active:scale-95 text-[#002366] font-bold text-xs rounded-lg shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 font-sans"
          title="Download Official Transcript as PDF using browser print dialog (Save as PDF)"
        >
          <Download className="w-4 h-4 text-[#002366]" />
          <span>Download Official Transcript (PDF)</span>
        </button>
      </div>

      {/* 
        OFFICIAL ACADEMIC TRANSCRIPT DOCUMENT CONTAINER
        Marked with ref={transcriptDocumentRef} for high-DPI HTML2Canvas PDF generation.
        Structured with .transcript-page elements for clean, multi-page vector A4 output without text cutting!
      */}
      <div ref={transcriptDocumentRef} className="space-y-8 print:space-y-0">
        {/* =========================================================================
            PAGE 1: Official Header, Biographical Info, and Initial Semesters
            ========================================================================= */}
        <div
          className="transcript-page page-break relative bg-white rounded-2xl border-4 border-double border-slate-300 p-6 sm:p-10 shadow-lg space-y-6 text-slate-900 font-sans print:border-none print:shadow-none print:p-0 print:rounded-none overflow-hidden"
          style={{ minHeight: '1050px' }}
        >
          {/* Subtle Diagonal Official Security Watermark */}
          {includeWatermark && (
            <div
              className="absolute inset-0 pointer-events-none flex items-center justify-center select-none overflow-hidden z-0 opacity-[0.035]"
              aria-hidden="true"
            >
              <div className="transform -rotate-35 text-center font-black text-slate-900 tracking-widest leading-loose text-3xl sm:text-4xl uppercase whitespace-nowrap">
                OFFICIAL ACADEMIC RECORD • BREAKTHROUGH INTERNATIONAL BIBLE UNIVERSITY • OFFICE OF THE REGISTRAR • VOID IF ALTERED • OFFICIAL ACADEMIC TRANSCRIPT
              </div>
            </div>
          )}

          {/* Running Document Micro-Header */}
          <div className="relative z-10 flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2">
            <span>Official Academic Record • Document Serial: {documentRef}</span>
            <span>Security Classification: {transcriptPurpose.toUpperCase()}</span>
            <span>Page 1 of {page2Semesters.length > 0 ? '2' : '1'}</span>
          </div>

          {/* Institutional Crest & Formal Header */}
          <div className="relative z-10 text-center space-y-2.5 border-b-2 border-[#002366] pb-5">
            <div className="flex justify-center mb-1">
              <UniversityLogo size="xl" withRing className="shadow-md" />
            </div>
            <div className="text-[11px] font-black uppercase tracking-widest text-[#C5A059] font-display">
              Office of the University Registrar • Official Academic Transcript
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-display text-[#002366] tracking-tight">
              BREAKTHROUGH INTERNATIONAL BIBLE UNIVERSITY
            </h1>
            <p className="text-[11px] text-slate-600 font-serif italic max-w-2xl mx-auto leading-relaxed">
              Phoenix, Arizona, United States of America • Accredited Theological Higher Education Institution
              <br />
              <span className="text-[10px] font-sans text-slate-500 not-italic">
                Global Campuses & Regional Examination Centers across 47 Counties in Kenya, Africa, Europe & the Americas
              </span>
            </p>
          </div>

          {/* Official Document Control Strip */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-2.5 bg-[#002366]/5 rounded-lg border border-[#002366]/20 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#002366] uppercase text-[10px] tracking-wider">
                Document Classification:
              </span>
              <span className="font-bold text-slate-900">{transcriptPurpose}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-600">
              <span>Date of Issue: <strong className="text-slate-900">{issueDate}</strong></span>
              <span>Registry Status: <strong className={transcriptStatus === 'Verified' ? 'text-emerald-700' : 'text-amber-700'}>{transcriptStatus.toUpperCase()}</strong></span>
            </div>
          </div>

          {/* Student Biographical & Degree Profile Grid */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3.5 p-4 bg-[#F8F9FB] rounded-xl border border-slate-200 text-xs">
            <div>
              <div className="text-[9px] uppercase font-bold text-slate-500">Student Full Name</div>
              <div className="font-bold text-slate-900 mt-0.5 font-display text-sm truncate">
                {currentUser.name}
              </div>
            </div>

            <div>
              <div className="text-[9px] uppercase font-bold text-slate-500">Matriculation ID Number</div>
              <div className="font-mono font-bold text-[#002366] mt-0.5 text-sm">
                {currentUser.studentId}
              </div>
            </div>

            <div>
              <div className="text-[9px] uppercase font-bold text-slate-500">Program of Study</div>
              <div className="font-semibold text-slate-900 mt-0.5 text-xs truncate">
                {currentUser.programName}
              </div>
            </div>

            <div>
              <div className="text-[9px] uppercase font-bold text-slate-500">Academic Standing</div>
              <div className="font-bold text-emerald-700 mt-0.5 text-xs">
                {academicStandingInfo.standing}
              </div>
            </div>

            <div>
              <div className="text-[9px] uppercase font-bold text-slate-500">School / Faculty</div>
              <div className="font-medium text-slate-800 mt-0.5 text-xs truncate">
                School of Theology & Apologetics
              </div>
            </div>

            <div>
              <div className="text-[9px] uppercase font-bold text-slate-500">Admission Cohort</div>
              <div className="font-medium text-slate-800 mt-0.5 text-xs">
                {currentUser.admissionYear || 2024} Academic Year
              </div>
            </div>

            <div>
              <div className="text-[9px] uppercase font-bold text-slate-500">Credits Completed</div>
              <div className="font-bold text-[#002366] mt-0.5 text-xs">
                {totalCreditsConferred} Conferred Credits
              </div>
            </div>

            <div>
              <div className="text-[9px] uppercase font-bold text-slate-500">Cumulative GPA to Date</div>
              <div className="font-bold text-[#C5A059] mt-0.5 text-xs">
                {compiledGpa.toFixed(2)} / 4.00 Scale
              </div>
            </div>
          </div>

          {/* Academic Course History - Part 1 (First 2 Semesters) */}
          <div className="relative z-10 space-y-5">
            <div className="flex items-center justify-between border-b-2 border-slate-300 pb-1.5">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#002366] font-display flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#C5A059]" />
                <span>Official Course History & Grade Roll</span>
              </h2>
              <span className="text-[10px] text-slate-500 font-semibold">
                Chronological Record • Standard 4.00 Grade Point Scale
              </span>
            </div>

            {page1Semesters.map((sem, idx) => (
              <div key={idx} className="space-y-1.5 border border-slate-200 rounded-lg overflow-hidden">
                {/* Term Subheader */}
                <div className="flex items-center justify-between px-3 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-[#002366] font-display">
                  <span className="uppercase tracking-wider font-black">
                    Academic Term: {sem.term}
                  </span>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="text-slate-600">Credits: <strong className="text-slate-900">{sem.termCreditsAttempted}</strong></span>
                    <span className="text-slate-600">Quality Points: <strong className="text-slate-900">{sem.termQualityPoints.toFixed(1)}</strong></span>
                    <span className="text-[#002366] font-black">Term GPA: {sem.termGpa.toFixed(2)}</span>
                  </div>
                </div>

                {/* Course Table */}
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white text-slate-600 font-bold uppercase tracking-wider text-[9px] border-b border-slate-200">
                      <th className="py-2 px-3 w-24">Course Code</th>
                      <th className="py-2 px-3">Course Title</th>
                      {includeInstructors && (
                        <th className="py-2 px-3 hidden sm:table-cell text-slate-500">Instructor</th>
                      )}
                      <th className="py-2 px-3 text-center w-16">Credits</th>
                      <th className="py-2 px-3 text-center w-16">Grade</th>
                      <th className="py-2 px-3 text-center w-20">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {sem.courses.map((c, cIdx) => {
                      const note = courseNotes[c.code];
                      return (
                        <React.Fragment key={cIdx}>
                          <tr className="hover:bg-slate-50/80 transition-colors group">
                            <td className="py-2 px-3 font-mono font-bold text-slate-800 text-[11px] align-top">
                              <div className="flex items-center gap-1.5">
                                <span>{c.code}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    openCourseNoteEditor({
                                      code: c.code,
                                      title: c.title,
                                      semester: sem.term,
                                      grade: c.grade,
                                      credits: c.credits,
                                      instructor: c.instructor
                                    })
                                  }
                                  title={note ? 'View or edit private note' : 'Add private personal note'}
                                  className={`no-print p-1 rounded transition-colors ${
                                    note
                                      ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                                      : 'text-slate-300 opacity-0 group-hover:opacity-100 hover:text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  <StickyNote className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                            <td className="py-2 px-3 font-medium text-slate-900 text-xs align-top">
                              <div>{c.title}</div>
                              {/* Personal Note Callout (Screen-Only; excluded from official printed/downloaded transcript) */}
                              {note && showPrivateNotesOnScreen && (
                                <div
                                  onClick={() =>
                                    openCourseNoteEditor({
                                      code: c.code,
                                      title: c.title,
                                      semester: sem.term,
                                      grade: c.grade,
                                      credits: c.credits,
                                      instructor: c.instructor
                                    })
                                  }
                                  className="no-print mt-1.5 p-2 bg-amber-50/70 border border-amber-200/80 rounded-lg text-[10.5px] text-slate-800 cursor-pointer hover:bg-amber-100/70 transition-colors shadow-2xs"
                                >
                                  <div className="flex items-center justify-between text-[9px] text-amber-800 font-bold mb-0.5">
                                    <span className="flex items-center gap-1">
                                      <Lock className="w-2.5 h-2.5" />
                                      Private Note ({note.category || 'General'})
                                    </span>
                                    <span className="text-[8.5px] font-normal text-amber-700">
                                      {note.updatedAt}
                                    </span>
                                  </div>
                                  <p className="line-clamp-2 italic text-slate-700 font-serif leading-snug">
                                    "{note.noteText}"
                                  </p>
                                </div>
                              )}
                            </td>
                            {includeInstructors && (
                              <td className="py-2 px-3 text-slate-500 text-[11px] hidden sm:table-cell align-top">
                                {c.instructor}
                              </td>
                            )}
                            <td className="py-2 px-3 text-center text-xs text-slate-700 align-top">
                              {c.credits}
                            </td>
                            <td className="py-2 px-3 text-center font-bold text-[#002366] text-xs align-top">
                              {c.grade}
                            </td>
                            <td className="py-2 px-3 text-center font-mono font-semibold text-slate-900 text-xs align-top">
                              {c.qualityPoints.toFixed(1)}
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* Render official transcript footer (Summary, Signatures, Registrar Stamp & QR Code) on Page 1 if no Page 2 */}
          {page2Semesters.length === 0 && renderOfficialTranscriptFooter()}

          {/* Page 1 Bottom Archival Note */}
          <div className="relative z-10 pt-4 border-t border-slate-200 flex items-center justify-between text-[9px] font-mono text-slate-400">
            <span>
              {page2Semesters.length > 0
                ? 'OFFICE OF THE REGISTRAR • PHOENIX, AZ • OFFICIAL TRANSCRIPT CONTINUED ON PAGE 2 (PAGE 1 OF 2)'
                : 'OFFICE OF THE REGISTRAR • PHOENIX, AZ • OFFICIAL COMPLETE ACADEMIC TRANSCRIPT (PAGE 1 OF 1)'}
            </span>
            <span>VERIFY AT BIBU.UNIVERSITY/VERIFY • REF: {documentRef}</span>
          </div>
        </div>

        {/* =========================================================================
            PAGE 2: Subsequent Semesters, Cumulative Summary, Regulations & Signatures
            ========================================================================= */}
        {page2Semesters.length > 0 && (
          <div
            className="transcript-page page-break relative bg-white rounded-2xl border-4 border-double border-slate-300 p-6 sm:p-10 shadow-lg space-y-6 text-slate-900 font-sans print:border-none print:shadow-none print:p-0 print:rounded-none overflow-hidden"
            style={{ minHeight: '1050px' }}
          >
            {/* Subtle Diagonal Official Security Watermark */}
            {includeWatermark && (
              <div
                className="absolute inset-0 pointer-events-none flex items-center justify-center select-none overflow-hidden z-0 opacity-[0.035]"
                aria-hidden="true"
              >
                <div className="transform -rotate-35 text-center font-black text-slate-900 tracking-widest leading-loose text-3xl sm:text-4xl uppercase whitespace-nowrap">
                  OFFICIAL ACADEMIC RECORD • BREAKTHROUGH INTERNATIONAL BIBLE UNIVERSITY • OFFICE OF THE REGISTRAR • VOID IF ALTERED • OFFICIAL ACADEMIC TRANSCRIPT
                </div>
              </div>
            )}

            {/* Running Document Micro-Header */}
            <div className="relative z-10 flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2">
              <span>Official Academic Record • Document Serial: {documentRef}</span>
              <span>Candidate: {currentUser.name} ({currentUser.studentId})</span>
              <span>Page 2 of 2</span>
            </div>

            {/* Page 2 Formal Title Banner */}
            <div className="relative z-10 flex items-center justify-between border-b border-[#002366] pb-2">
              <div className="text-xs font-black uppercase tracking-wider text-[#002366] font-display">
                Academic Course History (Continued) • Upper Division & Senior Cohort
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                Official Transcript Continuation Sheet
              </span>
            </div>

            {/* Academic Course History - Part 2 (Semesters 3 & 4) */}
            <div className="relative z-10 space-y-5">
              {page2Semesters.map((sem, idx) => (
                <div key={idx} className="space-y-1.5 border border-slate-200 rounded-lg overflow-hidden">
                  {/* Term Subheader */}
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-[#002366] font-display">
                    <span className="uppercase tracking-wider font-black">
                      Academic Term: {sem.term}
                    </span>
                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="text-slate-600">Credits: <strong className="text-slate-900">{sem.termCreditsAttempted}</strong></span>
                      <span className="text-slate-600">Quality Points: <strong className="text-slate-900">{sem.termQualityPoints.toFixed(1)}</strong></span>
                      <span className="text-[#002366] font-black">Term GPA: {sem.termGpa.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Course Table */}
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white text-slate-600 font-bold uppercase tracking-wider text-[9px] border-b border-slate-200">
                        <th className="py-2 px-3 w-24">Course Code</th>
                        <th className="py-2 px-3">Course Title</th>
                        {includeInstructors && (
                          <th className="py-2 px-3 hidden sm:table-cell text-slate-500">Instructor</th>
                        )}
                        <th className="py-2 px-3 text-center w-16">Credits</th>
                        <th className="py-2 px-3 text-center w-16">Grade</th>
                        <th className="py-2 px-3 text-center w-20">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {sem.courses.map((c, cIdx) => {
                        const note = courseNotes[c.code];
                        return (
                          <React.Fragment key={cIdx}>
                            <tr className="hover:bg-slate-50/80 transition-colors group">
                              <td className="py-2 px-3 font-mono font-bold text-slate-800 text-[11px] align-top">
                                <div className="flex items-center gap-1.5">
                                  <span>{c.code}</span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openCourseNoteEditor({
                                        code: c.code,
                                        title: c.title,
                                        semester: sem.term,
                                        grade: c.grade,
                                        credits: c.credits,
                                        instructor: c.instructor
                                      })
                                    }
                                    title={note ? 'View or edit private note' : 'Add private personal note'}
                                    className={`no-print p-1 rounded transition-colors ${
                                      note
                                        ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                                        : 'text-slate-300 opacity-0 group-hover:opacity-100 hover:text-slate-700 hover:bg-slate-100'
                                    }`}
                                  >
                                    <StickyNote className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                              <td className="py-2 px-3 font-medium text-slate-900 text-xs align-top">
                                <div>{c.title}</div>
                                {/* Personal Note Callout (Screen-Only; excluded from official printed/downloaded transcript) */}
                                {note && showPrivateNotesOnScreen && (
                                  <div
                                    onClick={() =>
                                      openCourseNoteEditor({
                                        code: c.code,
                                        title: c.title,
                                        semester: sem.term,
                                        grade: c.grade,
                                        credits: c.credits,
                                        instructor: c.instructor
                                      })
                                    }
                                    className="no-print mt-1.5 p-2 bg-amber-50/70 border border-amber-200/80 rounded-lg text-[10.5px] text-slate-800 cursor-pointer hover:bg-amber-100/70 transition-colors shadow-2xs"
                                  >
                                    <div className="flex items-center justify-between text-[9px] text-amber-800 font-bold mb-0.5">
                                      <span className="flex items-center gap-1">
                                        <Lock className="w-2.5 h-2.5" />
                                        Private Note ({note.category || 'General'})
                                      </span>
                                      <span className="text-[8.5px] font-normal text-amber-700">
                                        {note.updatedAt}
                                      </span>
                                    </div>
                                    <p className="line-clamp-2 italic text-slate-700 font-serif leading-snug">
                                      "{note.noteText}"
                                    </p>
                                  </div>
                                )}
                              </td>
                              {includeInstructors && (
                                <td className="py-2 px-3 text-slate-500 text-[11px] hidden sm:table-cell align-top">
                                  {c.instructor}
                                </td>
                              )}
                              <td className="py-2 px-3 text-center text-xs text-slate-700 align-top">
                                {c.credits}
                              </td>
                              <td className="py-2 px-3 text-center font-bold text-[#002366] text-xs align-top">
                                {c.grade}
                              </td>
                              <td className="py-2 px-3 text-center font-mono font-semibold text-slate-900 text-xs align-top">
                                {c.qualityPoints.toFixed(1)}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {/* Reusable Official Closing: Cumulative Summary, Regulations, Signatures, Registrar Stamp & QR Code */}
            {renderOfficialTranscriptFooter()}

            {/* Page 2 Bottom Archival Note */}
            <div className="relative z-10 pt-4 border-t border-slate-200 flex items-center justify-between text-[9px] font-mono text-slate-400">
              <span>OFFICE OF THE REGISTRAR • PHOENIX, AZ • OFFICIAL COMPLETE ACADEMIC TRANSCRIPT (PAGE 2 OF 2)</span>
              <span>VERIFY AT BIBU.UNIVERSITY/VERIFY • REF: {documentRef}</span>
            </div>
          </div>
        )}
      </div>

      {/* Academic History Log Section: Chronological list of major status changes */}
      <div className="mt-6">
        <AcademicHistoryLog
          logs={academicHistoryLogs}
          currentStatus={transcriptStatus}
          documentRef={documentRef}
          studentName={currentUser.name}
          studentId={currentUser.studentId}
        />
      </div>

      {/* Automated PDF Compilation & Progress Modal */}
      <TranscriptGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        progress={exportProgress}
        onDownloadAgain={handleGeneratePdf}
        onPrint={handlePrint}
        studentName={currentUser.name}
        studentId={currentUser.studentId}
        programName={currentUser.programName}
        cumulativeGpa={compiledGpa}
        totalCredits={totalCreditsConferred}
        filename={pdfFilename}
      />

      {/* Official Registry Electronic Verification Modal */}
      <TranscriptVerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        studentName={currentUser.name}
        studentId={currentUser.studentId}
        programName={currentUser.programName}
        cumulativeGpa={compiledGpa}
        totalCredits={totalCreditsConferred}
        verificationHash={verificationHash}
        documentRef={documentRef}
        issueDate={issueDate}
      />

      {/* Email Official Transcript Modal */}
      <EmailTranscriptModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        studentName={currentUser.name}
        studentEmail={currentUser.email || 'student@bibu.university'}
        studentId={currentUser.studentId}
        programName={currentUser.programName}
        cumulativeGpa={compiledGpa}
        documentRef={documentRef}
      />

      {/* Secure Share Link Modal */}
      <SecureShareModal
        isOpen={isSecureShareOpen}
        onClose={() => setIsSecureShareOpen(false)}
        studentName={currentUser.name}
        studentId={currentUser.studentId}
        programName={currentUser.programName}
        cumulativeGpa={compiledGpa}
        onLogActivity={logActivity}
      />

      {/* Transcript QR Code Authenticator Modal */}
      <TranscriptQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        studentName={currentUser.name}
        studentId={currentUser.studentId}
        documentRef={documentRef}
        verificationHash={verificationHash}
        onLogActivity={logActivity}
      />

      {/* Credit Transfer Evaluator Modal */}
      <CreditTransferEvaluatorModal
        isOpen={isCreditEvaluatorOpen}
        onClose={() => setIsCreditEvaluatorOpen(false)}
        studentName={currentUser.name}
        studentId={currentUser.studentId}
        onLogActivity={logActivity}
      />

      {/* Grade Appeal Modal */}
      <GradeAppealModal
        isOpen={isGradeAppealOpen}
        onClose={() => setIsGradeAppealOpen(false)}
        studentName={currentUser.name}
        studentId={currentUser.studentId}
        grades={grades}
        onLogActivity={logActivity}
      />

      {/* Student Personal Course Notes Modal */}
      <PersonalCourseNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => {
          setIsNotesModalOpen(false);
          setSelectedCourseForNote(null);
        }}
        course={selectedCourseForNote}
        existingNote={selectedCourseForNote ? courseNotes[selectedCourseForNote.code] : null}
        onSaveNote={handleSaveCourseNote}
        onDeleteNote={handleDeleteCourseNote}
      />
    </div>
  );
};

