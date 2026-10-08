import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Globe2,
  Users,
  CheckCircle,
  FileText,
  BadgeCheck,
  Briefcase,
  Compass,
  FilePlus,
  BookMarked,
  Award,
  GraduationCap,
  Scroll,
  Landmark,
  DollarSign,
  CreditCard,
  Sparkles,
  TrendingUp,
  Megaphone,
  Bell,
  Mail,
  BarChart3,
  PieChart,
  Settings,
  Database,
  Download,
  Send,
  Printer,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Search,
  Plus,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { AdminNavigationItem } from '../../../types/admin';
import {
  RegistrarExamPlagiarismReviewModal,
  ExamSimilarityAuditReport
} from '../RegistrarExamPlagiarismReviewModal';
import { generateExamSimilarityAudit } from '../../../services/examPlagiarismAuditService';

interface SecondaryAdminModulesProps {
  activeItem: AdminNavigationItem;
  onLogAudit: (action: string, record: string, details?: string) => void;
  fullDatabaseState: any;
}

export const SecondaryAdminModules: React.FC<SecondaryAdminModulesProps> = ({
  activeItem,
  onLogAudit,
  fullDatabaseState
}) => {
  const [notification, setNotification] = useState<string | null>(null);
  const [auditModalReport, setAuditModalReport] = useState<ExamSimilarityAuditReport | null>(null);

  // Live submissions with Plagiarism Audit scores for Registrar Review
  const [phdSubmissions, setPhdSubmissions] = useState([
    {
      id: 'sub-phd-01',
      candidateName: 'James Ninrew Dong',
      admissionNo: 'BIBU/2025/48710',
      cohort: 'Class 2024/2026',
      program: 'PhD in Public Policy and Administration in a Christian Environment',
      examTitle: 'Final Comprehensive Examination',
      submittedAt: 'Just now (Online BIBU-LMS)',
      totalWords: 5160,
      similarityScore: 6.8,
      aiProbability: 4.2,
      originalityScore: 93.2,
      integrityStatus: 'CLEARED' as const,
      reviewStatus: 'Pending Registrar Review',
      moderatedScore: null as number | null
    },
    {
      id: 'sub-dmin-02',
      candidateName: 'Rev. David K. Ndungu',
      admissionNo: 'BIBU/ADM/2024/0088',
      cohort: 'Class 2024/2025',
      program: 'Doctor of Ministry (D.Min.) in Pastoral Theology',
      examTitle: 'Doctoral Comprehensive Defense Exam',
      submittedAt: 'Yesterday 14:22 EST',
      totalWords: 4890,
      similarityScore: 7.9,
      aiProbability: 3.1,
      originalityScore: 92.1,
      integrityStatus: 'CLEARED' as const,
      reviewStatus: 'Cleared & Moderated',
      moderatedScore: 94
    },
    {
      id: 'sub-mabl-03',
      candidateName: 'Bishop Grace M. Mutua',
      admissionNo: 'BIBU/ADM/2024/0122',
      cohort: 'Class 2024/2025',
      program: 'Master of Arts in Biblical Leadership & Missions',
      examTitle: 'Trimester Capstone Examination',
      submittedAt: '2 days ago',
      totalWords: 3950,
      similarityScore: 5.7,
      aiProbability: 2.8,
      originalityScore: 94.3,
      integrityStatus: 'CLEARED' as const,
      reviewStatus: 'Cleared & Moderated',
      moderatedScore: 89
    }
  ]);

  const handleOpenPlagiarismAudit = (sub: typeof phdSubmissions[0]) => {
    // Check if candidate has saved audit in localStorage
    let report: ExamSimilarityAuditReport;
    try {
      const saved = localStorage.getItem('bibu_phd_exam_2025_48710_similarity_audit');
      if (saved && sub.admissionNo === 'BIBU/2025/48710') {
        report = JSON.parse(saved);
      } else {
        report = generateExamSimilarityAudit({}, sub.candidateName, sub.admissionNo, `BIBU-SUB-${sub.id}`);
      }
    } catch {
      report = generateExamSimilarityAudit({}, sub.candidateName, sub.admissionNo, `BIBU-SUB-${sub.id}`);
    }
    setAuditModalReport(report);
  };

  const handleSaveRegistrarAuditReview = (reviewData: {
    decision: 'APPROVED' | 'CONDITIONAL' | 'FLAGGED';
    totalScore: number;
    questionScores: { [qId: number]: number };
    registrarNotes: string;
  }) => {
    if (!auditModalReport) return;
    setPhdSubmissions(prev =>
      prev.map(item =>
        item.admissionNo === auditModalReport.admissionNo
          ? {
              ...item,
              reviewStatus:
                reviewData.decision === 'APPROVED'
                  ? `Approved & Moderated (${reviewData.totalScore}%)`
                  : reviewData.decision === 'CONDITIONAL'
                  ? 'Conditional Citation Clarification'
                  : 'Flagged for Senate Hearing',
              moderatedScore: reviewData.totalScore
            }
          : item
      )
    );
    notifyAction(
      `Registrar review recorded for ${auditModalReport.candidateName}. Score: ${reviewData.totalScore}% (${reviewData.decision})`,
      'Registrar Moderated Examination Script'
    );
    setAuditModalReport(null);
  };

  // Backup Trigger
  const handleFullBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullDatabaseState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `BIBU_FULL_BACKUP_SNAPSHOT_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    onLogAudit('Triggered Complete Database Backup Snapshot', 'Full Relational State JSON');
    setNotification('Institutional database snapshot generated and downloaded securely.');
    setTimeout(() => setNotification(null), 3500);
  };

  const notifyAction = (msg: string, auditAction: string) => {
    onLogAudit(auditAction, 'Admin Console Action');
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 12. EXAMINATIONS */}
      {activeItem === 'examinations' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-bold text-[#C5A059] uppercase">Trimester Assessments</span>
              <h2 className="text-xl font-display font-black text-[#002366]">Central Examination Timetables</h2>
            </div>
            <button
              onClick={() => notifyAction('Examination timetable published to student portal.', 'Published Exam Timetable')}
              className="px-4 py-2 rounded-xl bg-[#002366] text-[#C5A059] font-bold text-xs"
            >
              Publish Examination Timetable
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-xs space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold text-blue-900 block">Upcoming Trimester Final Examinations</span>
                <span className="text-blue-700">Scheduled for November 16 – November 28, 2026 across 98 global examination hubs.</span>
              </div>
              <span className="px-2 py-1 rounded bg-blue-600 text-white font-mono text-[10px] font-bold">Standard 3-Hour Format</span>
            </div>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl">
              <div className="p-3 flex justify-between">
                <span>THEO-401: Apologetics & Contemporary Christian Worldviews</span>
                <span className="font-mono text-slate-500">Nov 16, 2026 • 09:00 AM EST</span>
              </div>
              <div className="p-3 flex justify-between">
                <span>BIBL-302: Greek Exegesis of the Pauline Epistles</span>
                <span className="font-mono text-slate-500">Nov 18, 2026 • 09:00 AM EST</span>
              </div>
              <div className="p-3 flex justify-between">
                <span>LEAD-501: Organizational Leadership & Ministerial Integrity</span>
                <span className="font-mono text-slate-500">Nov 20, 2026 • 02:00 PM EST</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 13. EXAMINATION CENTERS (KENYA 47 COUNTIES + GLOBAL) */}
      {activeItem === 'exam-centers' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-bold text-[#C5A059] uppercase">Proctored Examination Network</span>
              <h2 className="text-xl font-display font-black text-[#002366]">Examination Centers & Kenya 47 Counties Hub</h2>
              <p className="text-xs text-slate-500">Supervised by National Representative Rt. Rev. Dr. Patrick M. Njuguna with 98 verified test centers.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-mono text-[#C5A059] font-bold">Kenya Region 01</span>
              <h4 className="font-bold text-[#002366] text-sm">Nairobi Central Center (Code: NBO-01)</h4>
              <p className="text-slate-500">Uhuru Highway Campus • 240 Candidate Capacity • Proctored by Rev. Peter Kamau</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-mono text-[#C5A059] font-bold">Kenya Region 02</span>
              <h4 className="font-bold text-[#002366] text-sm">Mombasa Coastal Center (Code: MSA-01)</h4>
              <p className="text-slate-500">Nyali Cathedral Annex • 120 Candidate Capacity • Proctored by Bishop Samuel M.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-mono text-[#C5A059] font-bold">Kenya Region 03</span>
              <h4 className="font-bold text-[#002366] text-sm">Kisumu Western Hub (Code: KSM-01)</h4>
              <p className="text-slate-500">Milimani Center • 150 Candidate Capacity • Proctored by Dr. Joshua Ochieng</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-mono text-[#C5A059] font-bold">Kenya Region 04</span>
              <h4 className="font-bold text-[#002366] text-sm">Nakuru Rift Valley Center (Code: NKR-01)</h4>
              <p className="text-slate-500">Biashara Hub • 180 Candidate Capacity • Proctored by Pastor Grace Wanjiku</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-mono text-[#C5A059] font-bold">Kenya Region 05</span>
              <h4 className="font-bold text-[#002366] text-sm">Eldoret North Rift Center (Code: ELD-01)</h4>
              <p className="text-slate-500">Highland Cathedral Hall • 110 Candidate Capacity • Proctored by Rev. Timothy Kipkorir</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-mono text-[#C5A059] font-bold">North America Region</span>
              <h4 className="font-bold text-[#002366] text-sm">Phoenix International Testing Hall (Code: PHX-01)</h4>
              <p className="text-slate-500">Main Campus, Phoenix AZ • 300 Candidate Capacity • Proctored by University Registrar</p>
            </div>
          </div>
        </div>
      )}

      {/* 14. EXAMINATION CANDIDATES & 15. RESULTS & REGISTRAR PLAGIARISM AUDIT DESK */}
      {(activeItem === 'exam-candidates' || activeItem === 'exam-results' || activeItem === 'examinations') && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#C5A059] uppercase">Registrar Academic Integrity Desk</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  AI & PLAGIARISM SHIELD ACTIVE
                </span>
              </div>
              <h2 className="text-xl font-display font-black text-[#002366]">
                Final & Doctoral Exam Submissions (Plagiarism Audits & Moderation)
              </h2>
              <p className="text-xs text-slate-500">
                Automated similarity detection scores generated prior to Academic Registrar manual review and degree conferral.
              </p>
            </div>
            <button
              onClick={() => notifyAction('Senate Examination Board has ratified official trimester grades.', 'Ratified Examination Grades')}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Ratify Results Moderation</span>
            </button>
          </div>

          {/* DOCTORAL SUBMISSIONS ROLL WITH AUTOMATED SIMILARITY SCORES */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#002366]" />
                <h3 className="text-sm font-bold font-display text-slate-900">
                  Doctoral & Final Comprehensive Examination Scripts Awaiting Registrar Review
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Turnitin / BIBU-LMS Engine v4.8
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {phdSubmissions.map((sub) => (
                <div key={sub.id} className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/80 p-3 rounded-xl transition-colors">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-[#002366]">
                        {sub.candidateName}
                      </span>
                      <span className="font-mono text-xs text-slate-500">
                        ({sub.admissionNo})
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold border border-blue-200">
                        {sub.cohort}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 font-medium">
                      {sub.program}
                    </div>

                    <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3 pt-1">
                      <span>Exam: <strong>{sub.examTitle}</strong></span>
                      <span>•</span>
                      <span>Words: <strong>{sub.totalWords.toLocaleString()}</strong></span>
                      <span>•</span>
                      <span className="text-slate-400">Submitted: {sub.submittedAt}</span>
                    </div>
                  </div>

                  {/* Similarity & Plagiarism Summary Badge */}
                  <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                    <div className="text-left sm:text-right space-y-0.5 bg-slate-50 lg:bg-transparent p-2.5 lg:p-0 rounded-xl border lg:border-none border-slate-200">
                      <div className="flex items-center lg:justify-end gap-1.5">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Similarity Index:</span>
                        <span className={`font-mono font-black text-sm px-2 py-0.5 rounded ${
                          sub.similarityScore < 10
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {sub.similarityScore}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        AI Prob: <strong className="text-purple-700">{sub.aiProbability}%</strong> • Originality: <strong className="text-blue-700">{sub.originalityScore}%</strong>
                      </div>
                      <div className="text-[10px] font-bold text-emerald-700">
                        ✓ {sub.integrityStatus}: Acceptable (&lt;15%)
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 flex flex-col sm:flex-row items-center gap-2">
                      <button
                        onClick={() => handleOpenPlagiarismAudit(sub)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001740] text-[#C5A059] font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                        <span>Audit Plagiarism & Review Script &rarr;</span>
                      </button>

                      {sub.moderatedScore && (
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                          Moderated: {sub.moderatedScore}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 16. TRANSCRIPTS & 17. CERTIFICATES */}
      {(activeItem === 'transcripts' || activeItem === 'certificates') && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-bold text-[#C5A059] uppercase">Registrar Conferral Desk</span>
              <h2 className="text-xl font-display font-black text-[#002366]">Official Academic Transcripts & Degrees</h2>
            </div>
            <button
              onClick={() => notifyAction('Digital university seal applied to academic records.', 'Applied Digital Seal')}
              className="px-4 py-2 rounded-xl bg-[#002366] text-[#C5A059] font-bold text-xs"
            >
              Apply Digital Registry Seal
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <h4 className="font-bold text-[#002366] flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
                <span>Conferred Degree Certificate Template</span>
              </h4>
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 text-center space-y-2 font-serif">
                <span className="text-[10px] uppercase font-mono font-bold text-[#C5A059]">Breakthrough International Bible University</span>
                <p className="text-sm font-bold text-[#002366]">BACHELOR OF THEOLOGY (B.TH.)</p>
                <p className="text-xs text-slate-600 italic">Conferred with all rights, privileges, and honors appertaining thereunto.</p>
                <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-amber-200">
                  Verification Hash: 8F2A-99B1-4C7E-2026
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <h4 className="font-bold text-[#002366] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Transcript Verification Protocol</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                All BIBU transcripts include security guilloche patterns, Chancellor watermark, cumulative GPA calculation, and QR code verification for third-party ecclesiastical validation.
              </p>
              <button
                onClick={() => notifyAction('Official transcript exported with digital signature.', 'Exported Transcript')}
                className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Download Sample Authenticated Transcript (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 18-22. RPL MANAGEMENT */}
      {(activeItem.startsWith('rpl-')) && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-bold text-[#C5A059] uppercase">Prior Learning Assessment</span>
              <h2 className="text-xl font-display font-black text-[#002366]">Recognition of Prior Learning (RPL) Management</h2>
              <p className="text-xs text-slate-500">Evaluating 10+ to 30+ years of ministerial tenure, apostolic church planting, and pastoral leadership.</p>
            </div>
            <button
              onClick={() => notifyAction('RPL credit portfolio accredited by Senate RPL Board.', 'Accredited RPL Portfolio')}
              className="px-4 py-2 rounded-xl bg-indigo-700 text-white font-bold text-xs"
            >
              Assess Portfolio Credits
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-xs space-y-3">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-950 font-medium">
              RPL Candidate: <strong>Bishop Samuel K. Omondi</strong> — 28 Years Pastoral Ministry • Recommended for Bachelor of Theology RPL Credit Conversion (90 Credits Granted).
            </div>
            <div className="divide-y divide-slate-100">
              <div className="py-2 flex justify-between">
                <span>Ministerial Portfolio Dossier & Ordination Papers</span>
                <span className="text-emerald-700 font-bold">VERIFIED (30 Credits)</span>
              </div>
              <div className="py-2 flex justify-between">
                <span>Church Planting & Evangelistic Mission Track Record</span>
                <span className="text-emerald-700 font-bold">VERIFIED (30 Credits)</span>
              </div>
              <div className="py-2 flex justify-between">
                <span>Biblical Exegesis Oral Defense & Capstone Essay</span>
                <span className="text-emerald-700 font-bold">VERIFIED (30 Credits)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 23-26. GRADUATION */}
      {(activeItem.startsWith('graduation-') || activeItem === 'alumni-management' || activeItem === 'graduates-list') && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-bold text-[#C5A059] uppercase">Annual Convocation</span>
              <h2 className="text-xl font-display font-black text-[#002366]">Graduation Ceremonies & Booklet Editor</h2>
            </div>
            <button
              onClick={() => notifyAction('Graduation ceremony booklet generated for convocation.', 'Generated Graduation Booklet')}
              className="px-4 py-2 rounded-xl bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Graduation Booklet</span>
            </button>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 text-xs space-y-3">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-bold">
              26th Annual International Convocation Ceremony • December 12, 2026
            </div>
            <p className="text-slate-600">
              Order of Procession: University Macebearer, Academic Faculty, Honored Guests, Academic Senate, Chancellor & President. 182 Approved Graduands across Certificate, Diploma, Bachelor’s, Master’s, and Doctoral programs.
            </p>
          </div>
        </div>
      )}

      {/* 27-30. FINANCE */}
      {(activeItem.startsWith('fees-') || activeItem === 'payments' || activeItem === 'scholarships' || activeItem === 'financial-reports') && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-bold text-[#C5A059] uppercase">Bursar & Treasury</span>
              <h2 className="text-xl font-display font-black text-[#002366]">Institutional Fees & Scholarships Management</h2>
            </div>
            <button
              onClick={() => notifyAction('Financial ledger reconciled with bursar accounts.', 'Reconciled Financial Ledger')}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs"
            >
              Reconcile Bursar Ledger
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold text-[10px] uppercase block">Total Trimester Collections</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">$482,500.00</div>
              <span className="text-[10px] text-slate-500">100% Audited</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold text-[10px] uppercase block">Outstanding Tuition Balances</span>
              <div className="text-2xl font-bold text-amber-700 mt-1">$38,200.00</div>
              <span className="text-[10px] text-slate-500">Payment plans active</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold text-[10px] uppercase block">Bursary & Scholarships Disbursed</span>
              <div className="text-2xl font-bold text-purple-700 mt-1">$94,000.00</div>
              <span className="text-[10px] text-slate-500">Subsidizing 64 rural pastors</span>
            </div>
          </div>
        </div>
      )}

      {/* 31-33. COMMUNICATION */}
      {(activeItem === 'announcements' || activeItem === 'notifications' || activeItem === 'email-sms') && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-bold text-[#C5A059] uppercase">University Broadcasting</span>
              <h2 className="text-xl font-display font-black text-[#002366]">Institutional Announcements & SMS Broadcast</h2>
            </div>
            <button
              onClick={() => notifyAction('Announcement broadcast dispatched to 3,820 active students.', 'Dispatched Broadcast')}
              className="px-4 py-2 rounded-xl bg-[#002366] text-[#C5A059] font-bold text-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast to All Students</span>
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-xs space-y-3">
            <span className="font-bold text-slate-700 block">Recent Broadcasts:</span>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center font-bold text-[#002366]">
                <span>Trimester 2 Final Examination Registration Deadline</span>
                <span className="text-[10px] font-mono text-slate-400">Sent to 3,820 students</span>
              </div>
              <p className="text-slate-600 mt-1">All candidates are reminded to register at their designated county exam center by Oct 31.</p>
            </div>
          </div>
        </div>
      )}

      {/* 34-39. REPORTS */}
      {(activeItem.startsWith('reports-')) && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-bold text-[#C5A059] uppercase">Institutional Analytics</span>
              <h2 className="text-xl font-display font-black text-[#002366]">Academic & Financial Executive Reports</h2>
            </div>
            <button
              onClick={() => notifyAction('Executive institutional report exported to CSV.', 'Exported Executive Report')}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Comprehensive Report</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-[#002366] block">Student Enrollment Breakdown by Faculty</span>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>School of Theology & Biblical Studies</span>
                  <span className="font-bold font-mono">1,820 Students (48%)</span>
                </div>
                <div className="flex justify-between">
                  <span>School of Christian Ministry & Leadership</span>
                  <span className="font-bold font-mono">1,240 Students (32%)</span>
                </div>
                <div className="flex justify-between">
                  <span>School of Missions & Cross-Cultural Evangelism</span>
                  <span className="font-bold font-mono">760 Students (20%)</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-[#002366] block">Geographic Distribution</span>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Kenya 47 Counties Centers</span>
                  <span className="font-bold font-mono">2,150 Students (56%)</span>
                </div>
                <div className="flex justify-between">
                  <span>East & Central Africa (Uganda, Tanzania, Rwanda)</span>
                  <span className="font-bold font-mono">920 Students (24%)</span>
                </div>
                <div className="flex justify-between">
                  <span>North America & International Online</span>
                  <span className="font-bold font-mono">750 Students (20%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 40. USERS */}
      {activeItem === 'system-users' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-bold text-[#C5A059] uppercase">Security Gateway</span>
              <h2 className="text-xl font-display font-black text-[#002366]">Authorized Administrative Personnel</h2>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-xs space-y-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-[#002366] block">Dr. Michael C. Sterling (chancellor@bibu-edu.org)</span>
                <span className="text-slate-500">Super Administrator • Phoenix International Headquarters</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Active</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-[#002366] block">Rev. Dr. Sarah M. Jenkins (registrar@bibu-edu.org)</span>
                <span className="text-slate-500">University Registrar • Academic Records & Degrees</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Active</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-[#002366] block">Rt. Rev. Dr. Patrick M. Njuguna (kenya.rep@bibu-edu.org)</span>
                <span className="text-slate-500">National Representative • Kenya 47 Counties Center</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* 43. SYSTEM SETTINGS */}
      {activeItem === 'system-settings' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-bold text-[#C5A059] uppercase">Global Configurations</span>
              <h2 className="text-xl font-display font-black text-[#002366]">University System Settings</h2>
            </div>
            <button
              onClick={() => notifyAction('University configurations saved.', 'Updated System Settings')}
              className="px-4 py-2 rounded-xl bg-[#002366] text-[#C5A059] font-bold text-xs"
            >
              Save Configuration
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-xs space-y-4 max-w-xl">
            <div>
              <label className="block font-bold text-slate-700 mb-1">University Official Domain</label>
              <input type="text" readOnly value="https://bibulms.onrender.com/" className="w-full p-2 rounded-lg border border-slate-300 font-mono bg-slate-50" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Academic Year</label>
              <input type="text" defaultValue="2026/2027 Academic Year" className="w-full p-2 rounded-lg border border-slate-300" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pass Mark Threshold (%)</label>
              <input type="number" defaultValue={60} className="w-full p-2 rounded-lg border border-slate-300" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded text-[#002366]" />
              <span className="text-slate-700">Enforce Failed Login Protection (60s Lockout after 5 attempts)</span>
            </div>
          </div>
        </div>
      )}

      {/* 44. BACKUP (SECTION 17) */}
      {activeItem === 'system-backup' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-bold text-[#C5A059] uppercase">Disaster Recovery & Data Integrity</span>
              <h2 className="text-xl font-display font-black text-[#002366]">Institutional Database Backup & Export</h2>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-xs space-y-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-900 text-sm block">Automated Daily Database Snapshots Active</span>
              <p className="text-emerald-800 leading-relaxed">
                All relational collections—Students SIS, Academic Schools, Faculties, Campuses, Examination Rolls, Honorary Nominations, Financial Records, and Audit Logs—are persisted.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleFullBackup}
                className="px-6 py-3 rounded-xl bg-[#002366] hover:bg-[#001845] text-[#C5A059] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all hover:scale-105"
              >
                <Database className="w-4 h-4" />
                <span>Export & Download Full Database Snapshot (.JSON)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTRAR EXAM PLAGIARISM AUDIT & SCRIPT REVIEW MODAL */}
      {auditModalReport && (
        <RegistrarExamPlagiarismReviewModal
          report={auditModalReport}
          onClose={() => setAuditModalReport(null)}
          onSaveReview={handleSaveRegistrarAuditReview}
        />
      )}
    </div>
  );
};
