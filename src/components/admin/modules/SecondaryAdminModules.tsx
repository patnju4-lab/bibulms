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
  Plus
} from 'lucide-react';
import { AdminNavigationItem } from '../../../types/admin';

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

      {/* 14. EXAMINATION CANDIDATES & 15. RESULTS */}
      {(activeItem === 'exam-candidates' || activeItem === 'exam-results') && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <span className="text-xs font-mono font-bold text-[#C5A059] uppercase">Examination Operations</span>
              <h2 className="text-xl font-display font-black text-[#002366]">Candidates Roll & Results Moderation</h2>
            </div>
            <button
              onClick={() => notifyAction('Senate Examination Board has ratified official trimester grades.', 'Ratified Examination Grades')}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs"
            >
              Ratify Results Moderation
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-xs">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-bold mb-3">
              ● All candidate grades verified by External Examiner and Dean of Academic Affairs.
            </div>
            <div className="divide-y divide-slate-100">
              <div className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="font-bold text-[#002366] block">Rev. David K. Ndungu (Adm: BIBU/ADM/2024/0088)</span>
                  <span className="text-slate-500">Doctor of Ministry (D.Min.) • Advanced Pastoral Theology</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 font-bold font-mono text-sm block">Grade: A (94%)</span>
                  <span className="text-[10px] text-slate-400">PASSED WITH DISTINCTION</span>
                </div>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="font-bold text-[#002366] block">Bishop Grace M. Mutua (Adm: BIBU/ADM/2024/0122)</span>
                  <span className="text-slate-500">Master of Arts in Biblical Leadership • Cross-Cultural Missions</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 font-bold font-mono text-sm block">Grade: A- (89%)</span>
                  <span className="text-[10px] text-slate-400">PASSED</span>
                </div>
              </div>
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
    </div>
  );
};
