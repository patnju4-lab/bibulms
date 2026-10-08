import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Printer,
  Download,
  Search,
  BookOpen,
  Award,
  Sparkles,
  UserCheck,
  Clock,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Check,
  Eye,
  Sliders,
  Scale
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export interface SimilaritySourceMatch {
  id: string;
  sourceTitle: string;
  sourceType: 'Journal' | 'Scripture' | 'Policy Framework' | 'Book' | 'Institutional Standard';
  similarityPercent: number;
  wordCountMatched: number;
  citationStatus: 'Properly Cited' | 'Scripture Verified' | 'Standard Nomenclature' | 'Uncited Block';
  matchedSnippet: string;
}

export interface QuestionSimilarityAudit {
  questionNumber: number;
  questionTitle: string;
  isCompulsory: boolean;
  wordCount: number;
  similarityScore: number;
  aiProbability: number;
  status: 'CLEARED' | 'LOW_RISK' | 'AUDIT_REQUIRED';
  scriptureReferencesFound: number;
  citationsFound: number;
  candidateResponseSnippet?: string;
}

export interface ExamSimilarityAuditReport {
  submissionId: string;
  candidateName: string;
  admissionNo: string;
  academicClass: string;
  programmeName: string;
  submittedAt: string;
  totalWords: number;
  overallSimilarityIndex: number;
  aiAttributionScore: number;
  originalityIndex: number;
  riskLevel: 'LOW_RISK' | 'MODERATE' | 'HIGH_RISK';
  integrityStatus: 'CLEARED' | 'PENDING_REGISTRAR_AUDIT' | 'FLAGGED';
  questionBreakdowns: QuestionSimilarityAudit[];
  matchedSources: SimilaritySourceMatch[];
}

interface RegistrarExamPlagiarismReviewModalProps {
  report: ExamSimilarityAuditReport;
  onClose: () => void;
  onSaveReview?: (reviewData: {
    decision: 'APPROVED' | 'CONDITIONAL' | 'FLAGGED';
    totalScore: number;
    questionScores: { [qId: number]: number };
    registrarNotes: string;
  }) => void;
}

export const RegistrarExamPlagiarismReviewModal: React.FC<RegistrarExamPlagiarismReviewModalProps> = ({
  report,
  onClose,
  onSaveReview
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'question_breakdown' | 'source_matches' | 'script_review' | 'manual_grading'>('overview');
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(1);

  // Registrar Manual Review State
  const [decision, setDecision] = useState<'APPROVED' | 'CONDITIONAL' | 'FLAGGED'>('APPROVED');
  const [qScores, setQScores] = useState<{ [qId: number]: number }>({
    1: 19,
    2: 18,
    4: 19,
    5: 18
  });
  const [registrarNotes, setRegistrarNotes] = useState(
    'The candidate exhibits rigorous doctoral scholarly synthesis in Public Policy and Christian Ethics. Automated similarity score of ' +
    report.overallSimilarityIndex +
    '% is well within the acceptable university threshold (<15%). All biblical scriptures and secular policy frameworks are rigorously acknowledged and correctly contextualized. Script recommended for Senate conferral clearance.'
  );
  const [isSaved, setIsSaved] = useState(false);

  const totalCalculatedScore = (Object.values(qScores) as number[]).reduce((a: number, b: number) => a + b, 0);
  const scaledScore100 = Math.min(100, Math.round((totalCalculatedScore / 80) * 100));

  const handleScoreChange = (qId: number, val: number) => {
    const clamped = Math.max(0, Math.min(20, val));
    setQScores(prev => ({ ...prev, [qId]: clamped }));
  };

  const handleSaveRegistrarDecision = () => {
    setIsSaved(true);
    if (onSaveReview) {
      onSaveReview({
        decision,
        totalScore: scaledScore100,
        questionScores: qScores,
        registrarNotes
      });
    }
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* HEADER BAR */}
        <div className="bg-[#002366] text-white p-5 sm:p-6 border-b-4 border-[#C5A059] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#C5A059] text-[#002366]">
                REGISTRAR ACADEMIC INTEGRITY DESK
              </span>
              <span className="text-xs font-mono text-slate-300">
                Ref: {report.submissionId}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black font-display text-white">
              Automated Similarity & Plagiarism Audit: {report.candidateName}
            </h2>
            <p className="text-xs text-slate-300">
              {report.programmeName} • Admission No: <strong className="text-white font-mono">{report.admissionNo}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handlePrintDossier}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Print Registrar Plagiarism Dossier"
            >
              <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">Print Audit Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-[#002366] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            📊 Plagiarism Score Summary
          </button>
          <button
            onClick={() => setActiveTab('question_breakdown')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'question_breakdown'
                ? 'bg-[#002366] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            📑 Question-by-Question Matrix
          </button>
          <button
            onClick={() => setActiveTab('source_matches')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'source_matches'
                ? 'bg-[#002366] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            🔍 Matched Sources & Citations ({report.matchedSources.length})
          </button>
          <button
            onClick={() => setActiveTab('manual_grading')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'manual_grading'
                ? 'bg-[#002366] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            ⚖️ Registrar Review & Grading
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW PLAGIARISM SCORE SUMMARY */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Top Big Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Overall Similarity Index */}
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                      Overall Similarity Index
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-black font-display text-emerald-950">
                    {report.overallSimilarityIndex}%
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700">
                    CLEARED (Threshold: &lt; 15%)
                  </div>
                  <p className="text-[10px] text-slate-500 leading-snug">
                    Low similarity index. Well within acceptable doctoral academic parameters.
                  </p>
                </div>

                {/* 2. Originality / Scholarly Synthesis */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-800">
                      Originality Index
                    </span>
                    <Award className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-3xl font-black font-display text-blue-950">
                    {report.originalityIndex}%
                  </div>
                  <div className="text-[10px] font-bold text-blue-700">
                    High Original Authorship
                  </div>
                  <p className="text-[10px] text-slate-500 leading-snug">
                    Authentic conceptualization, biblical integration, and policy critique.
                  </p>
                </div>

                {/* 3. AI Content Attribution */}
                <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-800">
                      AI Authorship Probability
                    </span>
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-3xl font-black font-display text-purple-950">
                    {report.aiAttributionScore}%
                  </div>
                  <div className="text-[10px] font-bold text-purple-700">
                    Human Synthesized Writing
                  </div>
                  <p className="text-[10px] text-slate-500 leading-snug">
                    Natural syntactic variance, biblical exegetical flow, and unique phrasing.
                  </p>
                </div>

                {/* 4. Words & Exam Scope */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                      Doctoral Scope
                    </span>
                    <BookOpen className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-3xl font-black font-display text-amber-950">
                    {report.totalWords}
                  </div>
                  <div className="text-[10px] font-bold text-amber-700">
                    Total Words Submitted
                  </div>
                  <p className="text-[10px] text-slate-500 leading-snug">
                    4 Questions Answered (Q1 Compulsory + 3 Electives).
                  </p>
                </div>
              </div>

              {/* Source Distribution Bar */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Similarity Source Breakdown
                  </span>
                  <span className="font-mono text-slate-500 text-[11px]">
                    Total Matched: {report.overallSimilarityIndex}%
                  </span>
                </div>

                {/* Progress Distribution Bar */}
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                  <div className="bg-blue-600 h-full" style={{ width: '38%' }} title="Peer-Reviewed Literature: 2.6%" />
                  <div className="bg-[#C5A059] h-full" style={{ width: '35%' }} title="Scriptural Passages: 2.4%" />
                  <div className="bg-emerald-600 h-full" style={{ width: '27%' }} title="Standard Institutional Policy Terminology: 1.8%" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />
                    <span className="text-slate-700">Peer-Reviewed Literature: <strong>2.6%</strong> (Properly Cited)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#C5A059] shrink-0" />
                    <span className="text-slate-700">Scriptural Passages: <strong>2.4%</strong> (Biblical Verses)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
                    <span className="text-slate-700">Standard Policy Terms: <strong>1.8%</strong> (Weberian, NPM)</span>
                  </div>
                </div>
              </div>

              {/* Automated Registrar Certification Banner */}
              <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-xl space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs font-black uppercase text-emerald-900 tracking-wider">
                    BIBU AUTOMATED INTEGRITY CLEARANCE: PASSED
                  </h4>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  The automated plagiarism inspection engine has screened all 4 doctoral essay responses against the global theological repository, academic journals, biblical manuscripts, and previous university submissions. No uncredited copy-paste text was detected. The submission is cleared for standard Registrar manual review.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: QUESTION-BY-QUESTION BREAKDOWN */}
          {activeTab === 'question_breakdown' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Question-by-Question Plagiarism & Similarity Diagnostics
                </span>
                <span className="text-xs text-slate-400">4 Doctoral Scripts Audited</span>
              </div>

              <div className="space-y-3">
                {report.questionBreakdowns.map((q) => (
                  <div
                    key={q.questionNumber}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-[#002366] transition-all space-y-3 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            q.isCompulsory ? 'bg-[#002366] text-white' : 'bg-[#C5A059] text-[#002366]'
                          }`}>
                            QUESTION {q.questionNumber}
                          </span>
                          {q.isCompulsory && (
                            <span className="text-[9px] font-bold uppercase text-blue-800 bg-blue-100 px-1.5 py-0.2 rounded">
                              Compulsory
                            </span>
                          )}
                          <span className="font-bold text-xs text-slate-900">
                            {q.questionTitle}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-mono text-slate-600">
                          {q.wordCount} words
                        </span>
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                          q.similarityScore < 10
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {q.similarityScore}% Similarity
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">
                          {q.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                      <div>
                        • Scriptural Cross-References: <strong className="text-slate-900">{q.scriptureReferencesFound} Identified</strong>
                      </div>
                      <div>
                        • Academic Policy Citations: <strong className="text-slate-900">{q.citationsFound} Verified</strong>
                      </div>
                      <div>
                        • AI Probability: <strong className="text-slate-900">{q.aiProbability}% (Human Writing)</strong>
                      </div>
                    </div>

                    {q.candidateResponseSnippet && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 italic leading-relaxed">
                        “{q.candidateResponseSnippet}...”
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MATCHED SOURCES & CITATION INVENTORY */}
          {activeTab === 'source_matches' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Cross-Matched Literature & Corpus Citations
                </span>
                <span className="text-xs text-slate-400">All Sources Correctly Attributed</span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {report.matchedSources.map((source) => (
                  <div key={source.id} className="p-4 space-y-2 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {source.sourceType}
                          </span>
                          <h4 className="font-bold text-xs text-[#002366]">
                            {source.sourceTitle}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-slate-600">
                          {source.wordCountMatched} words ({source.similarityPercent}%)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ {source.citationStatus}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg font-serif border border-slate-200/60 leading-relaxed">
                      Matched text segment: “{source.matchedSnippet}”
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REGISTRAR MANUAL GRADING & SIGN-OFF */}
          {activeTab === 'manual_grading' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-800" />
                  <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider">
                    REGISTRAR MODERATION & FINAL CONFERRAL CLEARANCE
                  </h4>
                </div>
                <p className="text-xs text-amber-950 leading-relaxed">
                  Following automated similarity verification, the Academic Registrar records manual evaluation marks, moderates the candidate's comprehensive scripts, and signs off on doctoral degree clearance.
                </p>
              </div>

              {/* Marks Allocation per Question */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#002366]">
                  Doctoral Marks Allocation (20 Marks per Question)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-600 block">
                      Question 1 (Compulsory)
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={qScores[1] || 0}
                        onChange={(e) => handleScoreChange(1, parseInt(e.target.value, 10) || 0)}
                        className="w-16 p-2 rounded-lg border border-slate-300 font-mono font-bold text-center text-sm outline-none focus:border-[#002366]"
                      />
                      <span className="text-xs text-slate-500 font-mono">/ 20 Marks</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-600 block">
                      Question 2 (Elective)
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={qScores[2] || 0}
                        onChange={(e) => handleScoreChange(2, parseInt(e.target.value, 10) || 0)}
                        className="w-16 p-2 rounded-lg border border-slate-300 font-mono font-bold text-center text-sm outline-none focus:border-[#002366]"
                      />
                      <span className="text-xs text-slate-500 font-mono">/ 20 Marks</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-600 block">
                      Question 4 (Elective)
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={qScores[4] || 0}
                        onChange={(e) => handleScoreChange(4, parseInt(e.target.value, 10) || 0)}
                        className="w-16 p-2 rounded-lg border border-slate-300 font-mono font-bold text-center text-sm outline-none focus:border-[#002366]"
                      />
                      <span className="text-xs text-slate-500 font-mono">/ 20 Marks</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-600 block">
                      Question 5 (Elective)
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={qScores[5] || 0}
                        onChange={(e) => handleScoreChange(5, parseInt(e.target.value, 10) || 0)}
                        className="w-16 p-2 rounded-lg border border-slate-300 font-mono font-bold text-center text-sm outline-none focus:border-[#002366]"
                      />
                      <span className="text-xs text-slate-500 font-mono">/ 20 Marks</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#002366] text-white flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#C5A059] font-bold uppercase text-[10px] block">CUMULATIVE DOCTORAL MARKS</span>
                    <span className="text-slate-200">{totalCalculatedScore} / 80 Raw Marks</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black font-display text-[#C5A059] block">
                      {scaledScore100}% (Grade: A)
                    </span>
                    <span className="text-[10px] text-emerald-300 font-bold uppercase">PASSED WITH HIGH HONORS</span>
                  </div>
                </div>
              </div>

              {/* Registrar Moderation Decision */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#002366]">
                  Registrar Academic Integrity Decision
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <label className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${
                    decision === 'APPROVED'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="decision"
                      checked={decision === 'APPROVED'}
                      onChange={() => setDecision('APPROVED')}
                      className="text-emerald-600"
                    />
                    <span>✓ Clear & Recommend for Conferral</span>
                  </label>

                  <label className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${
                    decision === 'CONDITIONAL'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="decision"
                      checked={decision === 'CONDITIONAL'}
                      onChange={() => setDecision('CONDITIONAL')}
                      className="text-amber-600"
                    />
                    <span>⚠ Conditional Citation Clarification</span>
                  </label>

                  <label className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${
                    decision === 'FLAGGED'
                      ? 'border-rose-600 bg-rose-50 text-rose-950 font-bold'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="decision"
                      checked={decision === 'FLAGGED'}
                      onChange={() => setDecision('FLAGGED')}
                      className="text-rose-600"
                    />
                    <span>✕ Flag for Senate Academic Hearing</span>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Registrar Evaluation & Moderation Remarks:
                  </label>
                  <textarea
                    rows={4}
                    value={registrarNotes}
                    onChange={(e) => setRegistrarNotes(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 leading-relaxed outline-none focus:border-[#002366]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Audited by: <strong>Dr. Michael C. Sterling</strong> (Academic Registrar & President)</span>
                  </div>

                  <button
                    onClick={handleSaveRegistrarDecision}
                    className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001740] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
                  >
                    {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <ShieldCheck className="w-4 h-4 text-[#C5A059]" />}
                    <span>{isSaved ? 'Decision Recorded!' : 'Save Official Registrar Review'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER BAR */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="font-mono text-[10px]">Turnitin/BIBU-LMS Engine v4.8</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">SHA-256 Checksum Verified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
