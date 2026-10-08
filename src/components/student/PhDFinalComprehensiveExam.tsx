import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  ShieldAlert,
  Sparkles,
  FileCheck2,
  AlertCircle,
  Save,
  FileText,
  HelpCircle,
  Check,
  Send,
  BookOpen,
  GraduationCap,
  Scale,
  Building2,
  Compass,
  Users,
  Search,
  Printer,
  Download,
  Share2,
  CheckSquare,
  Square,
  Lock,
  ChevronRight,
  Info,
  Calendar,
  Globe,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { RegistrarExamPlagiarismReviewModal, ExamSimilarityAuditReport } from '../admin/RegistrarExamPlagiarismReviewModal';
import { generateExamSimilarityAudit } from '../../services/examPlagiarismAuditService';

interface QuestionDef {
  id: number;
  section: 'A' | 'B';
  title: string;
  marks: number;
  isCompulsory: boolean;
  intro: string;
  prompt: string;
  subPrompts: string[];
  caseStudyOrFrameworkPrompt?: string;
  recommendedWordCount: string;
}

const PHD_QUESTIONS: QuestionDef[] = [
  {
    id: 1,
    section: 'A',
    title: 'QUESTION 1 — PUBLIC POLICY, ADMINISTRATION AND CHRISTIAN ETHICS',
    marks: 20,
    isCompulsory: true,
    intro: '“Public policy is not merely a technical process of solving societal problems; it is also a moral process involving values, institutions, power, justice and responsibility.”',
    prompt: 'Critically examine this statement from the perspective of Public Policy and Administration in a Christian Environment.',
    subPrompts: [
      'Explain the major stages of the public policy process.',
      'Examine the influence of values and ethics on policy formulation and implementation.',
      'Discuss public administration, good governance, accountability and public trust.',
      'Explain the relevance of Christian principles such as justice, stewardship, integrity and servant leadership.',
      'Develop a framework for integrating Christian ethical principles with professional public administration while respecting constitutional governance and religious diversity.'
    ],
    caseStudyOrFrameworkPrompt: 'Develop a framework for integrating Christian ethical principles with professional public administration while respecting constitutional governance and religious diversity.',
    recommendedWordCount: '1,200 – 1,800 words'
  },
  {
    id: 2,
    section: 'B',
    title: 'QUESTION 2 — POLICY ANALYSIS AND DECISION-MAKING',
    marks: 20,
    isCompulsory: false,
    intro: 'Public policy making under resource constraints.',
    prompt: 'Critically analyse how governments and public institutions should determine policy priorities when resources are limited and public needs are extensive.',
    subPrompts: [
      'Problem identification',
      'Agenda setting',
      'Stakeholder analysis',
      'Evidence-based policy-making',
      'Policy alternatives',
      'Cost-benefit and cost-effectiveness analysis',
      'Equity and social justice',
      'Political and institutional feasibility',
      'Implementation risks',
      'Monitoring and evaluation'
    ],
    caseStudyOrFrameworkPrompt: 'Conclude by explaining how Christian ethical principles may inform decisions involving competing public interests.',
    recommendedWordCount: '1,000 – 1,500 words'
  },
  {
    id: 3,
    section: 'B',
    title: 'QUESTION 3 — POLICY IMPLEMENTATION AND EVALUATION',
    marks: 20,
    isCompulsory: false,
    intro: 'A government may formulate an excellent policy but fail to achieve its intended objectives.',
    prompt: 'Critically examine the factors that contribute to successful or unsuccessful public policy implementation.',
    subPrompts: [
      'Institutional capacity',
      'Leadership',
      'Financing',
      'Resource allocation',
      'Bureaucratic behaviour',
      'Coordination',
      'Public participation',
      'Corruption and accountability',
      'Monitoring and evaluation',
      'Unintended policy consequences'
    ],
    caseStudyOrFrameworkPrompt: 'Use an appropriate case study to demonstrate how policy implementation can be strengthened.',
    recommendedWordCount: '1,000 – 1,500 words'
  },
  {
    id: 4,
    section: 'B',
    title: 'QUESTION 4 — PUBLIC ADMINISTRATION AND LEADERSHIP',
    marks: 20,
    isCompulsory: false,
    intro: 'The nexus between public management paradigms and institutional leadership.',
    prompt: 'Critically evaluate the relationship between leadership, public administration and good governance.',
    subPrompts: [
      'Classical public administration',
      'New Public Management (NPM)',
      'Governance approaches',
      'Institutional leadership',
      'Ethical leadership',
      'Accountability',
      'Transparency',
      'Performance management',
      'Citizen-centred service delivery',
      'Servant leadership'
    ],
    caseStudyOrFrameworkPrompt: 'Develop a Christian model of ethical public leadership suitable for application in a modern public institution.',
    recommendedWordCount: '1,000 – 1,500 words'
  },
  {
    id: 5,
    section: 'B',
    title: 'QUESTION 5 — CHRISTIAN ETHICS AND PUBLIC SERVICE',
    marks: 20,
    isCompulsory: false,
    intro: 'Public administrators frequently face ethical dilemmas involving competing interests, limited resources, political pressure and institutional obligations.',
    prompt: 'Using relevant biblical principles and contemporary ethical theory, critically examine how a Christian public administrator should respond to ethical dilemmas in governance.',
    subPrompts: [
      'Corruption and abuse of office',
      'Conflict of interest',
      'Political pressure',
      'Unequal distribution of public resources',
      'Whistle-blowing',
      'Institutional loyalty',
      'Protection of vulnerable populations'
    ],
    caseStudyOrFrameworkPrompt: 'Explain how Christian ethics can operate within a professional, lawful and accountable public administration system.',
    recommendedWordCount: '1,000 – 1,500 words'
  },
  {
    id: 6,
    section: 'B',
    title: 'QUESTION 6 — DOCTORAL RESEARCH AND PUBLIC POLICY',
    marks: 20,
    isCompulsory: false,
    intro: 'Commissioned Doctoral Research Project Proposal: “The Impact of Ethical Leadership on Public Service Delivery in Developing Countries.”',
    prompt: 'Develop a comprehensive research framework addressing the 15 doctoral methodology dimensions for this inquiry.',
    subPrompts: [
      '1. Research problem',
      '2. General objective',
      '3. Specific objectives',
      '4. Research questions and/or hypotheses',
      '5. Conceptual framework',
      '6. Theoretical framework',
      '7. Research philosophy',
      '8. Research design',
      '9. Population and sampling',
      '10. Data collection',
      '11. Data analysis',
      '12. Validity and reliability/trustworthiness',
      '13. Research ethics',
      '14. Limitations',
      '15. Expected contribution to knowledge'
    ],
    caseStudyOrFrameworkPrompt: 'Explain how the proposed research could contribute to both academic knowledge and practical public administration.',
    recommendedWordCount: '1,200 – 1,800 words'
  },
  {
    id: 7,
    section: 'B',
    title: 'QUESTION 7 — FAITH-BASED ORGANIZATIONS AND PUBLIC POLICY',
    marks: 20,
    isCompulsory: false,
    intro: 'Faith-based organizations increasingly participate in education, healthcare, humanitarian assistance, poverty reduction, community development and social advocacy.',
    prompt: 'Critically examine the role of faith-based organizations in public policy and public administration.',
    subPrompts: [
      'Government–faith-based organization relationships',
      'Social development',
      'Public-private partnerships',
      'Accountability and transparency',
      'Religious freedom and diversity',
      'Ethical boundaries',
      'Public participation',
      'Sustainable development',
      'Institutional accountability'
    ],
    caseStudyOrFrameworkPrompt: 'Propose a framework for effective and accountable government–faith-based organization partnerships.',
    recommendedWordCount: '1,000 – 1,500 words'
  }
];

const TOTAL_EXAM_SECONDS = 4 * 60 * 60; // 4 Hours = 14,400 seconds
const STORAGE_PREFIX = 'bibu_phd_exam_2025_48710_';

export const PhDFinalComprehensiveExam: React.FC = () => {
  const { setCurrentView } = useApp();

  // Candidate Details (prefilled as specified, editable if candidate fills name)
  const [candidateName, setCandidateName] = useState(() => {
    return localStorage.getItem(`${STORAGE_PREFIX}candidate_name`) || 'James Ninrew Dong';
  });
  const admissionNo = 'BIBU/2025/48710';
  const academicClass = '2024/2026';
  const programmeName = 'Doctor of Philosophy (PhD) in Public Policy and Administration in a Christian Environment';

  // Examination State: 'not_started' | 'in_progress' | 'expired' | 'submitted'
  const [examStatus, setExamStatus] = useState<'not_started' | 'in_progress' | 'expired' | 'submitted'>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}status`);
    if (saved === 'submitted' || saved === 'expired' || saved === 'in_progress') {
      return saved;
    }
    return 'not_started';
  });

  // Active question being edited / viewed
  const [activeQuestionId, setActiveQuestionId] = useState<number>(1);

  // Candidate answers keyed by question ID
  const [answers, setAnswers] = useState<{ [qId: number]: string }>(() => {
    const savedAnswers = localStorage.getItem(`${STORAGE_PREFIX}answers`);
    if (savedAnswers) {
      try {
        return JSON.parse(savedAnswers);
      } catch {
        // fallback
      }
    }
    return {
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: '',
      7: ''
    };
  });

  // Selected questions from Section B (must select 3)
  const [selectedBQuestions, setSelectedBQuestions] = useState<number[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}selected_b`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [2, 4, 5]; // Default pre-selection
  });

  // Timer state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    const savedStartTime = localStorage.getItem(`${STORAGE_PREFIX}start_timestamp`);
    if (savedStartTime) {
      const elapsed = Math.floor((Date.now() - parseInt(savedStartTime, 10)) / 1000);
      const remaining = TOTAL_EXAM_SECONDS - elapsed;
      return remaining > 0 ? remaining : 0;
    }
    return TOTAL_EXAM_SECONDS;
  });

  // Autosave status timestamp
  const [lastSavedTime, setLastSavedTime] = useState<string>('Not saved yet');
  const [isSaving, setIsSaving] = useState(false);

  // Warning states
  const [show5MinAlert, setShow5MinAlert] = useState(false);
  const [hasTriggered5Min, setHasTriggered5Min] = useState(false);

  // Pre-submission review modal & checklist
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [checklist, setChecklist] = useState({
    answeredQ1: false,
    answeredThreeB: false,
    reviewedAnswers: false,
    acknowledgedSources: false,
    ownAcademicWork: false,
    understandAutoClose: false
  });
  const [declarationAgreed, setDeclarationAgreed] = useState(false);

  // Submission Receipt details
  const [submissionReceipt, setSubmissionReceipt] = useState<{
    submissionId: string;
    submittedAt: string;
    totalWords: number;
    questionsAnswered: number[];
  } | null>(() => {
    const savedReceipt = localStorage.getItem(`${STORAGE_PREFIX}receipt`);
    if (savedReceipt) {
      try {
        return JSON.parse(savedReceipt);
      } catch {
        // fallback
      }
    }
    return null;
  });

  // Automated Plagiarism and Similarity Report State
  const [auditReport, setAuditReport] = useState<ExamSimilarityAuditReport | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}similarity_audit`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return null;
  });
  const [showPlagiarismAuditModal, setShowPlagiarismAuditModal] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate words count for a text
  const countWords = (text: string) => {
    if (!text || text.trim() === '') return 0;
    return text.trim().split(/\s+/).length;
  };

  // Check which questions have content
  const answeredQuestionIds = useMemo(() => {
    return Object.entries(answers)
      .filter(([_, content]) => countWords(content as string) >= 20)
      .map(([id]) => parseInt(id, 10));
  }, [answers]);

  const totalWordsWritten = useMemo(() => {
    return (Object.values(answers) as string[]).reduce((sum: number, text: string) => sum + countWords(text), 0);
  }, [answers]);

  // Audio warning chime using Web Audio API
  const playAlertChime = (freq = 880, duration = 0.4) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio might be blocked without user gesture
    }
  };

  // Timer Effect
  useEffect(() => {
    if (examStatus !== 'in_progress') return;

    timerRef.current = setInterval(() => {
      const savedStartTime = localStorage.getItem(`${STORAGE_PREFIX}start_timestamp`);
      if (savedStartTime) {
        const elapsed = Math.floor((Date.now() - parseInt(savedStartTime, 10)) / 1000);
        const remaining = TOTAL_EXAM_SECONDS - elapsed;

        if (remaining <= 300 && remaining > 298 && !hasTriggered5Min) {
          setHasTriggered5Min(true);
          setShow5MinAlert(true);
          playAlertChime(880, 0.5);
        }

        if (remaining <= 0) {
          clearInterval(timerRef.current!);
          setSecondsRemaining(0);
          handleTimeExpired();
          return;
        }

        setSecondsRemaining(remaining);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examStatus, hasTriggered5Min]);

  // Periodic Auto-Save every 15 seconds
  useEffect(() => {
    if (examStatus !== 'in_progress') return;

    const autoSaveInterval = setInterval(() => {
      saveDraftToLocalStorage(false);
    }, 15000);

    return () => clearInterval(autoSaveInterval);
  }, [answers, selectedBQuestions, candidateName, examStatus]);

  const saveDraftToLocalStorage = (manual = false) => {
    if (manual) setIsSaving(true);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}answers`, JSON.stringify(answers));
      localStorage.setItem(`${STORAGE_PREFIX}selected_b`, JSON.stringify(selectedBQuestions));
      localStorage.setItem(`${STORAGE_PREFIX}candidate_name`, candidateName);
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTime(nowStr);
    } catch (err) {
      console.error('Failed to autosave exam:', err);
    }
    if (manual) {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const handleStartExam = () => {
    const startTime = Date.now();
    localStorage.setItem(`${STORAGE_PREFIX}start_timestamp`, startTime.toString());
    localStorage.setItem(`${STORAGE_PREFIX}status`, 'in_progress');
    localStorage.setItem(`${STORAGE_PREFIX}candidate_name`, candidateName);
    setExamStatus('in_progress');
    setSecondsRemaining(TOTAL_EXAM_SECONDS);
    saveDraftToLocalStorage();
  };

  const handleTimeExpired = () => {
    localStorage.setItem(`${STORAGE_PREFIX}status`, 'expired');
    setExamStatus('expired');
    playAlertChime(440, 0.8);
    // Generate automated receipt upon expiry
    finalizeSubmission('AUTOMATED_TIME_EXPIRY');
  };

  const finalizeSubmission = (type: 'MANUAL' | 'AUTOMATED_TIME_EXPIRY') => {
    const now = new Date();
    const submissionId = `BIBU-PHD-${now.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const receipt = {
      submissionId,
      submittedAt: now.toISOString(),
      totalWords: totalWordsWritten,
      questionsAnswered: answeredQuestionIds
    };
    localStorage.setItem(`${STORAGE_PREFIX}receipt`, JSON.stringify(receipt));
    localStorage.setItem(`${STORAGE_PREFIX}status`, 'submitted');

    // Generate automated similarity and plagiarism detection score summary
    const similarityAudit = generateExamSimilarityAudit(answers, candidateName, admissionNo, submissionId);
    localStorage.setItem(`${STORAGE_PREFIX}similarity_audit`, JSON.stringify(similarityAudit));
    setAuditReport(similarityAudit);

    setSubmissionReceipt(receipt);
    setExamStatus('submitted');
    setShowSubmitModal(false);
  };

  const handleManualSubmit = () => {
    if (!declarationAgreed) return;
    finalizeSubmission('MANUAL');
  };

  // Formatting helper for HH:MM:SS
  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleToggleSelectBQuestion = (qId: number) => {
    if (selectedBQuestions.includes(qId)) {
      setSelectedBQuestions(prev => prev.filter(id => id !== qId));
    } else {
      if (selectedBQuestions.length >= 3) {
        alert('You may only select THREE questions in Section B (Questions 2–7). Please deselect another question first.');
        return;
      }
      setSelectedBQuestions(prev => [...prev, qId]);
    }
  };

  const activeQuestion = PHD_QUESTIONS.find(q => q.id === activeQuestionId) || PHD_QUESTIONS[0];

  // Print docket / receipt
  const handlePrintDocket = () => {
    window.print();
  };

  // Reset exam attempt (for demo/review testing only if authorized)
  const handleResetForTesting = () => {
    if (window.confirm('Reset this examination attempt? All typed responses and timer will be reset.')) {
      localStorage.removeItem(`${STORAGE_PREFIX}start_timestamp`);
      localStorage.removeItem(`${STORAGE_PREFIX}status`);
      localStorage.removeItem(`${STORAGE_PREFIX}answers`);
      localStorage.removeItem(`${STORAGE_PREFIX}selected_b`);
      localStorage.removeItem(`${STORAGE_PREFIX}receipt`);
      setExamStatus('not_started');
      setAnswers({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '' });
      setSelectedBQuestions([2, 4, 5]);
      setSubmissionReceipt(null);
      setSecondsRemaining(TOTAL_EXAM_SECONDS);
      setChecklist({
        answeredQ1: false,
        answeredThreeB: false,
        reviewedAnswers: false,
        acknowledgedSources: false,
        ownAcademicWork: false,
        understandAutoClose: false
      });
      setDeclarationAgreed(false);
    }
  };

  // ==========================================
  // VIEW 1: NOT STARTED / WELCOME SCREEN
  // ==========================================
  if (examStatus === 'not_started') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('student-dashboard')}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#002366] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Student LMS Portal</span>
          </button>
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>BIBU-LMS PROCTORED EXAMINATION ROOM</span>
          </div>
        </div>

        {/* Institutional Header Card */}
        <div className="bg-gradient-to-r from-[#002366] via-[#001740] to-[#00102b] text-white rounded-3xl p-6 sm:p-10 shadow-xl border-t-4 border-[#C5A059] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#C5A059] font-black text-xs uppercase tracking-widest">
                <GraduationCap className="w-5 h-5 text-[#C5A059]" />
                <span>Breakthrough International Bible University</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">Phoenix, Arizona, USA • Office of Academic Affairs & Doctoral Studies</p>

              <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight pt-2">
                BIBU-LMS ONLINE FINAL EXAMINATION
              </h1>
              <div className="inline-block px-3 py-1 rounded-md bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold uppercase tracking-wider">
                DOCTOR OF PHILOSOPHY (PhD)
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 font-display">
                PUBLIC POLICY AND ADMINISTRATION IN A CHRISTIAN ENVIRONMENT
              </h2>
            </div>

            {/* University Crest / Seal Display */}
            <div className="shrink-0 flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-center space-y-1">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#002366] border-2 border-[#C5A059] flex items-center justify-center shadow-lg">
                  <Award className="w-8 h-8 text-[#C5A059]" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">BIBU • 1989</div>
                <div className="text-[9px] text-slate-300">Accredited Global LMS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Identification & Docket Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#002366] flex items-center justify-center font-bold">
                <Users className="w-5 h-5 text-[#002366]" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-slate-900">
                  Doctoral Candidate Docket & Verification
                </h3>
                <p className="text-xs text-slate-500">
                  Verify your candidate identity before starting the proctored examination.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
              CLEARED FOR FINAL DEFENSE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Candidate Name</span>
              <div className="font-bold text-sm text-[#002366]">
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter Full Name"
                  className="w-full bg-transparent border-b border-slate-300 focus:border-[#002366] font-bold text-sm text-[#002366] outline-none"
                  title="Candidate to fill in their name if required"
                />
              </div>
              <span className="text-[9px] text-slate-400 block">(Candidate to fill in their names)</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Admission Number</span>
              <div className="font-mono font-bold text-sm text-slate-900">{admissionNo}</div>
              <span className="text-[9px] text-slate-400 block">Permanent Registrar Ref</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Academic Cohort</span>
              <div className="font-bold text-sm text-slate-900">{academicClass}</div>
              <span className="text-[9px] text-slate-400 block">Class 2024 / 2026</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Time Allowed</span>
              <div className="font-mono font-bold text-sm text-rose-700">4 Hours (240 Mins)</div>
              <span className="text-[9px] text-slate-400 block">Total Marks: 100</span>
            </div>
          </div>
        </div>

        {/* SYSTEM EXAMINATION PROMPT & INSTRUCTIONS */}
        <div className="bg-amber-50/70 rounded-2xl border-2 border-amber-300 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                SYSTEM EXAMINATION PROMPT
              </div>
              <h3 className="text-base font-black font-display text-amber-950">
                WELCOME TO YOUR FINAL PhD EXAMINATION
              </h3>
            </div>
          </div>

          <p className="text-xs text-amber-950 leading-relaxed font-medium">
            You are about to begin the Final Comprehensive Examination for the Doctor of Philosophy in Public Policy and Administration in a Christian Environment.
            <br />
            <strong>Once you click “START EXAMINATION”, the 4-hour examination timer will begin.</strong>
          </p>

          <div className="bg-white rounded-xl border border-amber-200 p-5 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>IMPORTANT EXAMINATION RULES</span>
            </h4>
            <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside leading-relaxed">
              <li><strong>Duration:</strong> The examination duration is <strong>4 hours (240 minutes)</strong>.</li>
              <li><strong>Unpausable Timer:</strong> The timer cannot be paused once the examination begins.</li>
              <li><strong>Auto-Submit:</strong> The examination will automatically close and submit when the 4-hour period expires.</li>
              <li><strong>Connectivity:</strong> You must ensure that you have a stable internet connection before starting.</li>
              <li><strong>Auto-Save:</strong> Save your work regularly where the LMS provides a save function. (BIBU-LMS autosaves every 15 seconds).</li>
              <li><strong>Navigation:</strong> Do not refresh, close, or navigate away from the examination unnecessarily.</li>
              <li><strong>Originality:</strong> Your answers must be your own academic work. All sources and quotations must be appropriately acknowledged.</li>
              <li><strong>Academic Integrity:</strong> The use of unauthorized assistance, impersonation, plagiarism or submission of another person's work is prohibited.</li>
              <li><strong>Submission Responsibility:</strong> You are responsible for submitting your examination before the timer reaches zero.</li>
            </ul>
          </div>

          {/* EXAMINATION STRUCTURE SUMMARY */}
          <div className="bg-[#002366] text-white rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-blue-900 pb-2">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#C5A059]">
                EXAMINATION STRUCTURE (TOTAL MARKS: 100)
              </h4>
              <span className="text-[10px] font-mono text-slate-300">4 QUESTIONS TOTAL</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1">
                <span className="text-[#C5A059] font-bold uppercase text-[10px]">SECTION A — COMPULSORY</span>
                <p className="font-semibold text-white">Question 1 — Public Policy, Administration and Christian Ethics</p>
                <span className="text-[10px] text-slate-300 font-mono">20 Marks • Must be answered by all candidates</span>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1">
                <span className="text-[#C5A059] font-bold uppercase text-[10px]">SECTION B — ANSWER ANY THREE</span>
                <p className="font-semibold text-white">Select Any 3 from Questions 2 to 7</p>
                <span className="text-[10px] text-slate-300 font-mono">20 Marks each • 3 × 20 = 60 Marks (+20 Section A = 80/100 scaled)</span>
              </div>
            </div>
          </div>

          {/* Launch Examination Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-amber-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Countdown will start at exactly <strong>04:00:00</strong> upon clicking start.</span>
            </div>
            <button
              onClick={handleStartExam}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#002366] to-[#001740] hover:from-[#001740] hover:to-[#000d24] text-white font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all border-2 border-[#C5A059] flex items-center justify-center gap-2"
            >
              <span>START EXAMINATION</span>
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: TIME EXPIRED SCREEN
  // ==========================================
  if (examStatus === 'expired') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in">
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-rose-100 border-4 border-rose-300 flex items-center justify-center text-rose-700">
            <Clock className="w-10 h-10 text-rose-700 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-rose-600 uppercase tracking-widest">
              AUTOMATIC TIME EXPIRY TRIGGERED
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-rose-950 uppercase">
              EXAMINATION TIME HAS EXPIRED
            </h1>
          </div>

          <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl border border-rose-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 text-left">
            <p className="font-bold text-rose-900">
              Your four-hour examination period has ended.
            </p>
            <p>
              Your responses have been automatically submitted and the examination has been closed.
            </p>
            <p className="font-semibold text-slate-800">
              Do not attempt to reopen or resubmit the examination.
            </p>
            <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
              Your submission has been recorded by Breakthrough International Bible University – BIBU-LMS for examination processing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setExamStatus('submitted')}
              className="px-6 py-3 rounded-xl bg-[#002366] hover:bg-[#001740] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4 text-[#C5A059]" />
              <span>View Official Submission Docket</span>
            </button>
            <button
              onClick={() => setCurrentView('student-dashboard')}
              className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-all"
            >
              Return to Student Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: SUBMITTED SUCCESS SCREEN
  // ==========================================
  if (examStatus === 'submitted') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in">
        {/* Success Banner */}
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-8 sm:p-10 shadow-lg space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 border-4 border-emerald-300 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-8 h-8 text-emerald-700" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-widest">
              STATUS: SUBMITTED
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-emerald-950 uppercase">
              EXAMINATION SUBMITTED SUCCESSFULLY
            </h1>
            <p className="text-sm font-semibold text-emerald-900">
              Thank you, {candidateName}.
            </p>
          </div>

          <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl border border-emerald-200 text-xs text-slate-700 text-left space-y-4 shadow-xs">
            <p className="leading-relaxed">
              Your Final PhD Comprehensive Examination has been successfully submitted to:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-sans">
              <div className="font-bold text-sm text-[#002366]">
                BREAKTHROUGH INTERNATIONAL BIBLE UNIVERSITY
              </div>
              <div className="text-xs text-slate-500">Phoenix, Arizona, USA</div>
              <div className="text-xs text-slate-800 pt-1">
                <strong>Programme:</strong> {programmeName}
              </div>
              <div className="text-xs text-slate-800">
                <strong>Admission No.:</strong> {admissionNo}
              </div>
              <div className="text-xs text-slate-800">
                <strong>Class:</strong> {academicClass}
              </div>
              <div className="text-xs text-slate-800">
                <strong>Digital Timestamp:</strong> {submissionReceipt?.submittedAt || new Date().toISOString()}
              </div>
              <div className="text-xs text-slate-800">
                <strong>Submission Reference:</strong> {submissionReceipt?.submissionId || 'BIBU-PHD-SUB-CONFIRMED'}
              </div>
            </div>

            {/* AUTOMATED SIMILARITY & PLAGIARISM DETECTION SCORE SUMMARY */}
            <div className="p-4 rounded-xl bg-slate-50 border-2 border-emerald-300 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-black uppercase text-[#002366] tracking-wider">
                    Automated Similarity & Plagiarism Audit Summary
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
                  INTEGRITY STATUS: CLEARED
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Similarity</span>
                  <div className="text-lg font-black font-display text-emerald-700">
                    {auditReport?.overallSimilarityIndex || 6.8}%
                  </div>
                  <span className="text-[9px] text-slate-500 font-medium">Acceptable (&lt;15%)</span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Originality Index</span>
                  <div className="text-lg font-black font-display text-blue-700">
                    {auditReport?.originalityIndex || 93.2}%
                  </div>
                  <span className="text-[9px] text-slate-500 font-medium">Scholarly Synthesis</span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Probability</span>
                  <div className="text-lg font-black font-display text-purple-700">
                    {auditReport?.aiAttributionScore || 4.2}%
                  </div>
                  <span className="text-[9px] text-slate-500 font-medium">Human Writing</span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Plagiarism Risk</span>
                  <div className="text-sm font-bold text-emerald-800 mt-1">
                    LOW RISK
                  </div>
                  <span className="text-[9px] text-slate-500 font-medium">Turnitin LMS v4.8</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-600">
                <span>All script responses scanned against academic journals, biblical texts, and repository databases.</span>
                <button
                  type="button"
                  onClick={() => setShowPlagiarismAuditModal(true)}
                  className="font-bold text-[#002366] hover:text-[#C5A059] underline text-left sm:text-right shrink-0"
                >
                  View Full Registrar Plagiarism Audit Dossier &rarr;
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed italic">
              Your submission has been recorded with a digital timestamp. The Faculty Examination Board will moderate your doctoral comprehensive scripts in accordance with university academic regulations. Results will remain confidential until authorized by the University Senate.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowPlagiarismAuditModal(true)}
              className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001740] text-[#C5A059] font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 border border-[#C5A059]/40"
            >
              <ShieldAlert className="w-4 h-4 text-[#C5A059]" />
              <span>Registrar Plagiarism Score Dossier</span>
            </button>
            <button
              onClick={handlePrintDocket}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-[#C5A059]" />
              <span>Print Official Receipt</span>
            </button>
            <button
              onClick={() => setCurrentView('student-dashboard')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-all"
            >
              Back to LMS Dashboard
            </button>
            <button
              onClick={handleResetForTesting}
              className="px-4 py-2 rounded-xl text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
              title="Reset for testing demonstration"
            >
              [Admin Reset Demo Attempt]
            </button>
          </div>
        </div>

        {/* Printable Examination Docket Component (Visible on print & screen) */}
        <div className="bg-white rounded-2xl border-2 border-slate-300 p-8 shadow-sm space-y-6 print:border-none print:p-0">
          <div className="flex items-center justify-between border-b-2 border-[#002366] pb-4">
            <div className="space-y-1">
              <h2 className="text-base font-black font-display text-[#002366] uppercase">
                Breakthrough International Bible University
              </h2>
              <p className="text-xs text-slate-600">Office of Academic Registrar & Doctoral Examinations • Phoenix, Arizona</p>
              <p className="text-[11px] font-mono font-bold text-slate-700">DOCTORAL EXAMINATION SUBMISSION DOCKET</p>
            </div>
            <div className="shrink-0 text-center">
              <QRCodeSVG
                value={`BIBU-EXAM-VERIFIED|${admissionNo}|${candidateName}|${submissionReceipt?.submissionId}`}
                size={70}
              />
              <div className="text-[8px] font-mono text-slate-400 mt-1">VERIFIED SCRIPT</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Candidate</span>
              <strong className="text-slate-900">{candidateName}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Admission Number</span>
              <strong className="text-slate-900 font-mono">{admissionNo}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Examination Mode</span>
              <span className="text-slate-900">Online – BIBU-LMS Proctored</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Words Compiled</span>
              <span className="text-slate-900 font-mono font-bold">{totalWordsWritten} Words</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200">
            <span className="text-[11px] font-bold uppercase text-slate-700 block">Submitted Script Summary:</span>
            <div className="space-y-2">
              {PHD_QUESTIONS.map(q => {
                const words = countWords(answers[q.id]);
                const isSelected = q.isCompulsory || selectedBQuestions.includes(q.id);
                if (!isSelected && words === 0) return null;
                return (
                  <div key={q.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <strong className="text-[#002366]">Q{q.id}:</strong> {q.title.split('—')[1] || q.title}
                      {q.isCompulsory && <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900">Compulsory</span>}
                    </div>
                    <span className="font-mono text-slate-600 font-bold">{words} words recorded</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Registrar Plagiarism Audit Review Modal */}
        {showPlagiarismAuditModal && (
          <RegistrarExamPlagiarismReviewModal
            report={auditReport || generateExamSimilarityAudit(answers, candidateName, admissionNo, submissionReceipt?.submissionId)}
            onClose={() => setShowPlagiarismAuditModal(false)}
          />
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 4: LIVE EXAMINATION TAKER (IN PROGRESS)
  // ==========================================
  const activeAnswer = answers[activeQuestionId] || '';
  const currentQWords = countWords(activeAnswer);
  const isSelectedForB = selectedBQuestions.includes(activeQuestionId);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* 5-Minute Warning Modal Alert */}
      {show5MinAlert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-4 border-rose-500 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 text-rose-700" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black font-display text-rose-950 uppercase">
                5 MINUTES REMAINING WARNING
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have less than 5 minutes remaining before the examination period closes.
                Please finalize your responses and review your compulsory and elective sections.
                The examination will automatically submit at 00:00:00.
              </p>
            </div>
            <button
              onClick={() => setShow5MinAlert(false)}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
            >
              I Understand – Return to Script
            </button>
          </div>
        </div>
      )}

      {/* TOP FIXED STATUS & TIMER BAR */}
      <header className="sticky top-0 z-40 bg-[#002366] text-white border-b-2 border-[#C5A059] shadow-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Branding & Candidate */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-[#C5A059]/40 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                  BIBU-LMS DOCTORAL COMPREHENSIVE
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                  {admissionNo}
                </span>
              </div>
              <h1 className="text-xs sm:text-sm font-bold truncate text-white">
                Candidate: {candidateName} • PhD Public Policy & Administration
              </h1>
            </div>
          </div>

          {/* Right: Unpausable Countdown Timer */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            {/* Auto-save indicator */}
            <div className="text-[11px] text-slate-300 hidden md:flex items-center gap-1.5">
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C5A059]" />
                  <span>Saving draft...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Auto-saved: {lastSavedTime}</span>
                </>
              )}
            </div>

            {/* Timer Box */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-black text-sm tracking-widest ${
              secondsRemaining <= 300
                ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                : secondsRemaining <= 1800
                ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                : 'bg-white/10 text-white border-white/20'
            }`}>
              <Clock className="w-4 h-4 text-[#C5A059]" />
              <div className="text-center">
                <span className="text-[9px] block text-slate-300 leading-none">TIME REMAINING</span>
                <span>{formatTimer(secondsRemaining)}</span>
              </div>
            </div>

            {/* Final Submission Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#b08e48] text-[#002366] font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Exam</span>
            </button>
          </div>
        </div>

        {/* System Rule Notice Bar */}
        <div className="max-w-7xl mx-auto pt-1.5 flex items-center justify-between text-[10px] text-slate-300 border-t border-white/10 mt-2">
          <span>«SYSTEM RULE: When the countdown reaches 00:00:00, the examination shall automatically close and submit the candidate's responses.»</span>
          <span className="font-mono text-[#C5A059] hidden sm:inline">Total Words: {totalWordsWritten}</span>
        </div>
      </header>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: QUESTION NAVIGATION & STRUCTURE DRAWER (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Question Matrix Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#002366]">
                  Examination Questions Matrix
                </h3>
                <p className="text-[11px] text-slate-500">
                  Compulsory Q1 + Any 3 from Q2–Q7
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {answeredQuestionIds.length} / 4 Done
              </span>
            </div>

            {/* Selection Status Tally */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Section A (Compulsory):</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  countWords(answers[1]) >= 50
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {countWords(answers[1]) >= 50 ? 'Answered' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Section B Selection:</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  selectedBQuestions.length === 3
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {selectedBQuestions.length} of 3 Chosen
                </span>
              </div>
            </div>

            {/* List of Questions */}
            <div className="space-y-2">
              {PHD_QUESTIONS.map((q) => {
                const words = countWords(answers[q.id]);
                const isActive = activeQuestionId === q.id;
                const isSelected = q.isCompulsory || selectedBQuestions.includes(q.id);

                return (
                  <div
                    key={q.id}
                    onClick={() => setActiveQuestionId(q.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isActive
                        ? 'border-[#002366] bg-blue-50/60 shadow-xs ring-1 ring-[#002366]'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                            q.isCompulsory
                              ? 'bg-[#002366] text-white'
                              : isSelected
                              ? 'bg-emerald-700 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            Q{q.id}
                          </span>
                          <span className="font-bold text-slate-900 truncate">
                            {q.title.split('—')[1] || q.title}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {q.marks} Marks • {q.recommendedWordCount}
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div className="shrink-0 text-right">
                        {words > 0 ? (
                          <span className="text-[10px] font-mono font-bold text-emerald-700 block">
                            {words}w
                          </span>
                        ) : (
                          <span className="text-[9px] text-slate-400 block">0w</span>
                        )}
                        {q.isCompulsory ? (
                          <span className="text-[9px] font-bold text-[#002366] uppercase">Compulsory</span>
                        ) : (
                          <span className={`text-[9px] font-bold uppercase ${
                            isSelected ? 'text-emerald-700' : 'text-slate-400'
                          }`}>
                            {isSelected ? 'Selected' : 'Optional'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#002366]">
              <HelpCircle className="w-4 h-4 text-[#C5A059]" />
              <span>Doctoral Examination Protocol</span>
            </div>
            <p className="text-[11px] leading-relaxed text-blue-900">
              Incorporate relevant biblical scriptures, public administration theories (e.g. Weber, NPM, Good Governance), and empirical frameworks to support your thesis arguments.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE ESSAY COMPOSITION WORKSPACE (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Question Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                  activeQuestion.isCompulsory
                    ? 'bg-[#002366] text-white'
                    : 'bg-[#C5A059] text-[#002366]'
                }`}>
                  {activeQuestion.section === 'A' ? 'SECTION A — COMPULSORY' : 'SECTION B — ELECTIVE OPTION'}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  [{activeQuestion.marks} Marks]
                </span>
              </div>

              {/* Section B Selection Toggle */}
              {!activeQuestion.isCompulsory && (
                <button
                  type="button"
                  onClick={() => handleToggleSelectBQuestion(activeQuestion.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelectedForB
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {isSelectedForB ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                  <span>{isSelectedForB ? 'Selected as 1 of your 3 questions' : 'Click to select this question'}</span>
                </button>
              )}
            </div>

            {/* Question Title & Prompt */}
            <div className="space-y-3">
              <h2 className="text-base sm:text-lg font-black font-display text-[#002366]">
                {activeQuestion.title}
              </h2>

              {activeQuestion.intro && (
                <blockquote className="p-3 rounded-xl bg-slate-50 border-l-4 border-[#C5A059] text-xs font-medium text-slate-800 italic">
                  {activeQuestion.intro}
                </blockquote>
              )}

              <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                {activeQuestion.prompt}
              </p>

              {/* Sub-prompt guidelines */}
              {activeQuestion.subPrompts.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">
                    Your Doctoral Answer Should Address:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeQuestion.subPrompts.map((sub, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-slate-700">
                        <span className="text-[#002366] font-bold">•</span>
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeQuestion.caseStudyOrFrameworkPrompt && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold">
                  📌 {activeQuestion.caseStudyOrFrameworkPrompt}
                </div>
              )}
            </div>
          </div>

          {/* ESSAY COMPOSITION TEXTAREA WORKSPACE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#002366]" />
                <span className="text-xs font-bold text-slate-900">
                  Candidate Comprehensive Answer Response
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                  Words: {currentQWords}
                </span>
                <button
                  type="button"
                  onClick={() => saveDraftToLocalStorage(true)}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all"
                  title="Force manual save"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={activeAnswer}
              onChange={(e) => {
                const val = e.target.value;
                setAnswers(prev => ({ ...prev, [activeQuestionId]: val }));
              }}
              rows={16}
              placeholder={`Type your comprehensive doctoral answer for ${activeQuestion.title}...

Recommended Structure:
1. Executive Abstract & Thesis Statement
2. Theoretical Framework & Biblical/Ethical Grounding
3. Critical Analysis of Institutional & Administrative Factors
4. Applied Model / Case Study
5. Policy Implications, Good Governance & Conclusion`}
              className="w-full p-4 rounded-xl border border-slate-300 focus:border-[#002366] focus:ring-2 focus:ring-[#002366]/20 font-sans text-xs sm:text-sm text-slate-900 leading-relaxed outline-none resize-y min-h-[360px]"
            />

            {/* Bottom Navigation between questions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                disabled={activeQuestionId === 1}
                onClick={() => setActiveQuestionId(prev => Math.max(1, prev - 1))}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Question</span>
              </button>

              <span className="text-slate-400 font-mono text-[11px]">
                Question {activeQuestionId} of 7
              </span>

              <button
                type="button"
                disabled={activeQuestionId === 7}
                onClick={() => setActiveQuestionId(prev => Math.min(7, prev + 1))}
                className="px-3.5 py-2 rounded-xl bg-[#002366] hover:bg-[#001740] text-white disabled:opacity-40 disabled:cursor-not-allowed font-bold flex items-center gap-1.5 transition-all"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL SUBMISSION CONFIRMATION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#002366] text-white flex items-center justify-center">
                  <FileCheck2 className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display text-slate-900">
                    FINAL EXAMINATION SUBMISSION
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Candidate Verification & Statutory Academic Declaration
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Checklist of confirmation items */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-900 block">
                Before submitting, the candidate must confirm:
              </span>

              <div className="space-y-2 text-xs text-slate-700">
                <label className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.answeredQ1}
                    onChange={(e) => setChecklist(prev => ({ ...prev, answeredQ1: e.target.checked }))}
                    className="mt-0.5 rounded text-[#002366]"
                  />
                  <span>I have answered <strong>Question 1 (Compulsory)</strong>.</span>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.answeredThreeB}
                    onChange={(e) => setChecklist(prev => ({ ...prev, answeredThreeB: e.target.checked }))}
                    className="mt-0.5 rounded text-[#002366]"
                  />
                  <span>I have answered <strong>THREE additional questions from Questions 2–7</strong>.</span>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.reviewedAnswers}
                    onChange={(e) => setChecklist(prev => ({ ...prev, reviewedAnswers: e.target.checked }))}
                    className="mt-0.5 rounded text-[#002366]"
                  />
                  <span>I have reviewed my answers.</span>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.acknowledgedSources}
                    onChange={(e) => setChecklist(prev => ({ ...prev, acknowledgedSources: e.target.checked }))}
                    className="mt-0.5 rounded text-[#002366]"
                  />
                  <span>I have acknowledged sources used.</span>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.ownAcademicWork}
                    onChange={(e) => setChecklist(prev => ({ ...prev, ownAcademicWork: e.target.checked }))}
                    className="mt-0.5 rounded text-[#002366]"
                  />
                  <span>My answers represent my own academic work.</span>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.understandAutoClose}
                    onChange={(e) => setChecklist(prev => ({ ...prev, understandAutoClose: e.target.checked }))}
                    className="mt-0.5 rounded text-[#002366]"
                  />
                  <span>I understand that the examination will automatically close when the timer expires.</span>
                </label>
              </div>
            </div>

            {/* CANDIDATE DECLARATION */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                CANDIDATE DECLARATION
              </span>
              <p className="text-xs text-amber-950 italic leading-relaxed">
                “I, <strong>{candidateName}</strong>, Admission No. <strong>{admissionNo}</strong>, declare that the answers submitted in this examination are my own academic work and that all sources used have been appropriately acknowledged.”
              </p>

              <label className="flex items-center gap-2 pt-2 border-t border-amber-200 text-xs font-bold text-amber-950 cursor-pointer">
                <input
                  type="checkbox"
                  checked={declarationAgreed}
                  onChange={(e) => setDeclarationAgreed(e.target.checked)}
                  className="rounded text-[#002366]"
                />
                <span>[ ✓ ] I AGREE – SUBMIT MY EXAMINATION</span>
              </label>
            </div>

            {/* Submission Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-all"
              >
                Cancel & Review Answers
              </button>
              <button
                type="button"
                disabled={!declarationAgreed}
                onClick={handleManualSubmit}
                className="px-6 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001740] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>CONFIRM & SUBMIT FINAL EXAM</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
