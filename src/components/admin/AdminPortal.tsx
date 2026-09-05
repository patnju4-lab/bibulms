import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Award,
  BookOpen,
  DollarSign,
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Sparkles,
  Plus,
  Send,
  Printer,
  Building,
  Sliders,
  Globe,
  Settings,
  Edit,
  Save,
  Bell,
  BarChart3,
  UserCheck
} from 'lucide-react';
import { Application, Certificate } from '../../types';
import { UsersAndPortalsTab } from './tabs/UsersAndPortalsTab';
import { BulletinsManagementTab } from './tabs/BulletinsManagementTab';
import { AlumniStatistics } from './AlumniStatistics';
import { AlumniAdminManager } from './AlumniAdminManager';
import { RplAdminManager } from './RplAdminManager';
import { GlobalExamCentresPortal } from '../examCentres/GlobalExamCentresPortal';
import { TVRadioManagement } from './TVRadioManagement';
import { TVAdminPortal } from './TVAdminPortal';
import { GraduationManagementPortal } from '../graduation/GraduationManagementPortal';
import { Tv } from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    currentUser,
    applications,
    updateApplicationStatus,
    certificates,
    issueCertificate,
    schools,
    programs,
    invoices,
    bulletins,
    universityInfo,
    updateUniversityInfo,
    alumniList,
    examinationCentres,
    kenyaCounties,
    mediaVideos,
    graduationCandidates
  } = useApp();

  const [activeTab, setActiveTab] = useState<'graduation' | 'exam-centres' | 'tv-radio' | 'alumni-stats' | 'alumni-records' | 'rpl-manager' | 'users-portals' | 'bulletins' | 'admissions' | 'certificates' | 'academics' | 'financials' | 'cms'>('graduation');

  // CMS Form State
  const [cmsInfo, setCmsInfo] = useState({ ...universityInfo });
  const [cmsSaved, setCmsSaved] = useState(false);

  const handleSaveCms = (e: React.FormEvent) => {
    e.preventDefault();
    updateUniversityInfo(cmsInfo);
    setCmsSaved(true);
    setTimeout(() => setCmsSaved(false), 3500);
  };

  // Certificate Issuance Form State
  const [certForm, setCertForm] = useState({
    studentName: 'Pastor David Emmanuel',
    studentId: 'BIBU-2024-ST-7492',
    degreeTitle: 'Bachelor of Theology (B.Th)',
    schoolName: 'School of Biblical & Theological Studies',
    honors: 'Summa Cum Laude',
    chancellorName: universityInfo.chancellor,
    registrarName: universityInfo.registrar
  });
  const [issuedNotification, setIssuedNotification] = useState<string>('');

  const handleIssueCert = (e: React.FormEvent) => {
    e.preventDefault();
    const newCert = issueCertificate(certForm);
    setIssuedNotification(`Official Certificate ${newCert.certificateNumber} generated & registered to Registrar database!`);
  };

  const pendingApps = applications.filter((a) => a.status === 'Submitted' || a.status === 'Under Review');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Executive Command Header */}
      <div className="bg-[#002366] text-white rounded-xl p-6 sm:p-8 border border-[#002366] shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <UniversityLogo size="lg" withRing className="shadow-lg" />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#C5A059]/20 text-[#C5A059] text-xs font-black uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Office of the Chancellor & University Registrar</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Institutional Governance & Administration
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Breakthrough International Bible University • Phoenix, Arizona Headquarters
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-300">Current Administrator</div>
            <div className="text-sm font-bold font-display text-[#C5A059]">{currentUser.name}</div>
            <div className="text-[11px] text-slate-300 font-mono">Role: {currentUser.role}</div>
          </div>
        </div>

        {/* Top Executive KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#001A4D]">
          <div className="p-3.5 bg-[#001A4D] border border-[#002366]/40 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-slate-300">Total Enrolled Students</div>
            <div className="text-2xl font-black text-white font-display mt-0.5">1,248</div>
            <div className="text-[10px] text-emerald-400">Across 64 Nations</div>
          </div>

          <div className="p-3.5 bg-[#001A4D] border border-[#002366]/40 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-slate-300">Active Applications</div>
            <div className="text-2xl font-black text-[#C5A059] font-display mt-0.5">{applications.length}</div>
            <div className="text-[10px] text-[#C5A059]">{pendingApps.length} Awaiting Decision</div>
          </div>

          <div className="p-3.5 bg-[#001A4D] border border-[#002366]/40 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-slate-300">Verified Credentials</div>
            <div className="text-2xl font-black text-white font-display mt-0.5">{certificates.length + 3420}</div>
            <div className="text-[10px] text-emerald-400">In Global Registry</div>
          </div>

          <div className="p-3.5 bg-[#001A4D] border border-[#002366]/40 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-slate-300">Bursar Collections</div>
            <div className="text-2xl font-black text-emerald-400 font-display mt-0.5">$2.48M</div>
            <div className="text-[10px] text-slate-300">Fiscal Year 2026</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('graduation')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'graduation'
              ? 'border-[#002366] text-[#002366] bg-amber-50/70 font-black'
              : 'border-transparent text-[#002366] hover:text-[#001A4D] bg-amber-50/30'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-[#C5A059]" />
          <span>🎓 Graduation & Convocation Portal ({graduationCandidates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('exam-centres')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'exam-centres'
              ? 'border-[#002366] text-[#002366] bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4 text-[#C5A059]" />
          <span>Global Exam Centres & 47 Counties ({examinationCentres.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tv-radio')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'tv-radio'
              ? 'border-[#002366] text-[#002366] bg-amber-50/60 font-black'
              : 'border-transparent text-[#002366] hover:text-[#001A4D] bg-amber-50/30'
          }`}
        >
          <Tv className="w-4 h-4 text-[#C5A059]" />
          <span>📺 TV & Radio CMS ({mediaVideos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rpl-manager')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'rpl-manager'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-[#C5A059]" />
          <span>RPL Credit Assessment</span>
        </button>

        <button
          onClick={() => setActiveTab('alumni-stats')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'alumni-stats'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#C5A059]" />
          <span>Alumni Analytics & Statistics</span>
        </button>

        <button
          onClick={() => setActiveTab('alumni-records')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'alumni-records'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4 text-[#002366]" />
          <span>Alumni Registry Management ({alumniList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bulletins')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'bulletins'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4 text-[#C5A059]" />
          <span>University Bulletins ({bulletins.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users-portals')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'users-portals'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Users & Portal RBAC</span>
        </button>

        <button
          onClick={() => setActiveTab('admissions')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'admissions'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Admissions Decisions ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'certificates'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Degree Conferral & Certificates ({certificates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('academics')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'academics'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Schools & Degree Catalog</span>
        </button>

        <button
          onClick={() => setActiveTab('financials')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'financials'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Bursar Financials</span>
        </button>

        <button
          onClick={() => setActiveTab('cms')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'cms'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Live Site CMS</span>
        </button>
      </div>

      {/* TAB: Graduation Management & Digital Convocation Portal */}
      {activeTab === 'graduation' && <GraduationManagementPortal />}

      {/* TAB: Global Exam Centres & 47 Counties System */}
      {activeTab === 'exam-centres' && <GlobalExamCentresPortal />}

      {/* TAB: TV & Radio Media Management */}
      {activeTab === 'tv-radio' && <TVAdminPortal />}

      {/* TAB: RPL Manager */}
      {activeTab === 'rpl-manager' && <RplAdminManager />}

      {/* TAB: Alumni Statistics & Analytics */}
      {activeTab === 'alumni-stats' && <AlumniStatistics />}

      {/* TAB: Alumni Registry Management */}
      {activeTab === 'alumni-records' && <AlumniAdminManager />}

      {/* TAB: University Bulletins & Announcements CMS */}
      {activeTab === 'bulletins' && <BulletinsManagementTab />}

      {/* TAB: Users & Portal RBAC */}
      {activeTab === 'users-portals' && <UsersAndPortalsTab />}

      {/* TAB 1: Admissions Management */}
      {activeTab === 'admissions' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold font-display text-[#002366]">
                Online Admissions Registry & Verification
              </h2>
              <p className="text-xs text-slate-500">
                Review candidate applications, ministerial references, and approve matriculation status.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F9FB] text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-3 px-4">Application #</th>
                  <th className="py-3 px-4">Applicant Name</th>
                  <th className="py-3 px-4">Desired Program</th>
                  <th className="py-3 px-4">Country & Ministry</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admissions Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-[#F8F9FB]">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{app.applicationNumber}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 font-display">
                      <div>{app.fullName}</div>
                      <div className="text-[11px] font-normal text-slate-500 font-sans">{app.email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{app.desiredProgramName}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{app.country}</div>
                      <div className="text-[11px] text-[#C5A059] font-bold">{app.currentMinistryRole} ({app.ministryExperienceYears} yrs)</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                        app.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-900'
                          : app.status === 'Under Review'
                          ? 'bg-[#C5A059]/20 text-[#002366]'
                          : 'bg-[#002366]/10 text-[#002366]'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {app.status !== 'Accepted' && (
                        <button
                          onClick={() => updateApplicationStatus(app.id, 'Accepted')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold uppercase tracking-wider text-[11px]"
                        >
                          Approve Admission
                        </button>
                      )}
                      {app.status === 'Submitted' && (
                        <button
                          onClick={() => updateApplicationStatus(app.id, 'Under Review')}
                          className="px-3 py-1.5 rounded-lg bg-[#002366] text-white font-bold uppercase tracking-wider text-[11px]"
                        >
                          Mark Under Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Degree Conferral & Certificate Issuance */}
      {activeTab === 'certificates' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Issue Form */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold font-display text-[#002366] border-b border-slate-100 pb-2">
              Confer Degree & Issue Credential
            </h3>

            {issuedNotification && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold">
                ✓ {issuedNotification}
              </div>
            )}

            <form onSubmit={handleIssueCert} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Graduate Full Name</label>
                <input
                  type="text"
                  required
                  value={certForm.studentName}
                  onChange={(e) => setCertForm({ ...certForm, studentName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Degree Title</label>
                <input
                  type="text"
                  required
                  value={certForm.degreeTitle}
                  onChange={(e) => setCertForm({ ...certForm, degreeTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Academic Faculty / School</label>
                <select
                  value={certForm.schoolName}
                  onChange={(e) => setCertForm({ ...certForm, schoolName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Honors Distinction</label>
                <select
                  value={certForm.honors}
                  onChange={(e) => setCertForm({ ...certForm, honors: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Summa Cum Laude">Summa Cum Laude (Highest Honors)</option>
                  <option value="Magna Cum Laude">Magna Cum Laude (High Honors)</option>
                  <option value="Cum Laude">Cum Laude (With Honors)</option>
                  <option value="Distinction">With Academic Distinction</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black uppercase tracking-wider text-xs shadow-xs"
              >
                Confer Official Degree Certificate →
              </button>
            </form>
          </div>

          {/* Registered Certificates List */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold font-display text-[#002366] border-b border-slate-100 pb-2">
              Official University Credential Registry ({certificates.length})
            </h3>

            <div className="space-y-3">
              {certificates.map((cert) => (
                <div key={cert.id} className="p-4 rounded-xl border border-slate-200 bg-[#F8F9FB] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#002366] font-display text-sm">{cert.studentName}</span>
                    <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase text-[10px]">
                      Verified
                    </span>
                  </div>
                  <div className="text-slate-800">
                    <strong>Degree:</strong> {cert.degreeTitle} • <span className="text-[#C5A059] font-black">{cert.honors}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200">
                    <span>Cert #: <strong>{cert.certificateNumber}</strong></span>
                    <span>Verification: <strong>{cert.verificationCode}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Schools & Degree Catalog */}
      {activeTab === 'academics' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold font-display text-[#002366]">
              The 9 Constituent Academic Schools & Programs
            </h2>
            <span className="text-xs font-semibold text-slate-500">{programs.length} Active Degree Programs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {schools.map((sch) => (
              <div key={sch.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#002366] font-mono">{sch.code}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{sch.departments.length} Departments</span>
                </div>
                <h4 className="font-bold font-display text-[#002366]">{sch.name}</h4>
                <div className="text-[11px] text-slate-500">Dean: {sch.deanName}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Bursar Financials */}
      {activeTab === 'financials' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold font-display text-[#002366]">University Bursar Transactions & Invoices</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F9FB] text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F8F9FB]">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 font-display">{inv.studentName}</td>
                    <td className="py-2.5 px-3 text-slate-700">{inv.description}</td>
                    <td className="py-2.5 px-3 font-bold text-[#002366] font-mono">${inv.amountUSD}.00 USD</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-900' : 'bg-[#C5A059]/20 text-[#002366]'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Live Site CMS Editor */}
      {activeTab === 'cms' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold font-display text-[#002366] flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#C5A059]" />
                <span>Full Site CMS — Institutional Information & Settings</span>
              </h2>
              <p className="text-xs text-slate-500">
                Super Administrators can modify university names, motto, contact addresses, phone numbers, leadership, and institutional statistics across the entire live platform.
              </p>
            </div>

            {cmsSaved && (
              <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>University CMS settings updated live!</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSaveCms} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">University Official Name</label>
                <input
                  type="text"
                  value={cmsInfo.name}
                  onChange={e => setCmsInfo({ ...cmsInfo, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Official Latin / English Motto</label>
                <input
                  type="text"
                  value={cmsInfo.motto}
                  onChange={e => setCmsInfo({ ...cmsInfo, motto: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Chancellor & President</label>
                <input
                  type="text"
                  value={cmsInfo.chancellor}
                  onChange={e => setCmsInfo({ ...cmsInfo, chancellor: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">University Registrar</label>
                <input
                  type="text"
                  value={cmsInfo.registrar}
                  onChange={e => setCmsInfo({ ...cmsInfo, registrar: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Primary Headquarters Address</label>
                <input
                  type="text"
                  value={cmsInfo.headquarters}
                  onChange={e => setCmsInfo({ ...cmsInfo, headquarters: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Official Contact Email</label>
                <input
                  type="email"
                  value={cmsInfo.email}
                  onChange={e => setCmsInfo({ ...cmsInfo, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Official Phone Number</label>
                <input
                  type="tel"
                  value={cmsInfo.phone}
                  onChange={e => setCmsInfo({ ...cmsInfo, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Accreditation Authority</label>
                <input
                  type="text"
                  value={cmsInfo.accreditationBody}
                  onChange={e => setCmsInfo({ ...cmsInfo, accreditationBody: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#002366]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Accreditation & State Recognition Statement</label>
              <textarea
                rows={3}
                value={cmsInfo.accreditationStatement}
                onChange={e => setCmsInfo({ ...cmsInfo, accreditationStatement: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#002366]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-[#C5A059]" />
                <span>Save Live CMS Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
