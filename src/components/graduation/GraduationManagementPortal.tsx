import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  GraduationCeremony,
  GraduationCandidate,
  GraduationBooklet,
  AcademicAwardWinner,
  GraduationCertificateRecord,
  GraduationAuditLog,
  DepartmentClearanceStatus
} from '../../types/graduation';
import { Alumni } from '../../types/alumni';
import { GraduationBookletViewer } from './GraduationBookletViewer';
import { GraduationBookletGenerator } from './GraduationBookletGenerator';
import { GraduationCandidateModal } from './GraduationCandidateModal';
import { AlumniDigitalCard } from './AlumniDigitalCard';
import {
  GraduationCap,
  Calendar,
  Users,
  Award,
  BookOpen,
  FileCheck2,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Printer,
  Download,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  Sparkles,
  QrCode,
  DollarSign,
  UserCheck,
  Eye,
  FileSpreadsheet,
  Layers,
  History,
  Radio,
  Share2
} from 'lucide-react';

export const GraduationManagementPortal: React.FC = () => {
  const {
    currentUser,
    graduationCeremonies,
    addGraduationCeremony,
    updateGraduationCeremony,
    graduationCandidates,
    addGraduationCandidate,
    updateGraduationCandidate,
    deleteGraduationCandidate,
    updateDepartmentClearance,
    conferCandidateToGraduate,
    graduationBooklets,
    activeGraduationBooklet,
    generateGraduationBooklet,
    academicAwards,
    addAcademicAward,
    graduationCertificates,
    graduationAuditLogs,
    alumniList,
    schools,
    programs
  } = useApp();

  // Navigation Sub-tab
  const [activeTab, setActiveTab] = useState<
    'ceremonies' | 'candidates' | 'clearance' | 'booklet' | 'certificates' | 'awards' | 'alumni' | 'reports' | 'audit'
  >('candidates');

  // Candidate Filters & Search
  const [searchCandidate, setSearchCandidate] = useState('');
  const [selectedCeremonyFilter, setSelectedCeremonyFilter] = useState<string>('All');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('All');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');

  // Active Modals
  const [selectedCandidate, setSelectedCandidate] = useState<GraduationCandidate | null>(null);
  const [selectedAlumniCardTarget, setSelectedAlumniCardTarget] = useState<GraduationCandidate | null>(null);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [showAddCeremonyModal, setShowAddCeremonyModal] = useState(false);
  const [showAddAwardModal, setShowAddAwardModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Quick Notification
  const [notice, setNotice] = useState<string | null>(null);

  const displayNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4500);
  };

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    return graduationCandidates.filter((c) => {
      const matchSearch =
        searchCandidate === '' ||
        c.fullName.toLowerCase().includes(searchCandidate.toLowerCase()) ||
        c.studentId.toLowerCase().includes(searchCandidate.toLowerCase()) ||
        c.programName.toLowerCase().includes(searchCandidate.toLowerCase()) ||
        c.admissionNumber.toLowerCase().includes(searchCandidate.toLowerCase());

      const matchCeremony = selectedCeremonyFilter === 'All' || c.ceremonyId === selectedCeremonyFilter;
      const matchSchool = selectedSchoolFilter === 'All' || c.schoolName === selectedSchoolFilter;
      const matchLevel = selectedLevelFilter === 'All' || c.awardLevel === selectedLevelFilter;
      const matchStatus = selectedStatusFilter === 'All' || c.status === selectedStatusFilter;

      return matchSearch && matchCeremony && matchSchool && matchLevel && matchStatus;
    });
  }, [graduationCandidates, searchCandidate, selectedCeremonyFilter, selectedSchoolFilter, selectedLevelFilter, selectedStatusFilter]);

  // Statistics Summary
  const stats = useMemo(() => {
    const total = graduationCandidates.length;
    const cleared = graduationCandidates.filter((c) => c.clearanceProgress === 100).length;
    const pending = graduationCandidates.filter((c) => c.clearanceProgress < 100).length;
    const conferred = graduationCandidates.filter((c) => c.status === 'Conferred Graduate').length;
    const totalFeesCollected = graduationCandidates.reduce((acc, c) => acc + c.graduationFeePaid, 0);
    return { total, cleared, pending, conferred, totalFeesCollected };
  }, [graduationCandidates]);

  // Default active booklet
  const currentBooklet = graduationBooklets[0];
  const currentCeremony = graduationCeremonies.find((c) => c.id === currentBooklet?.ceremonyId) || graduationCeremonies[0];

  // Export Candidates to CSV
  const handleExportCSV = () => {
    const headers = [
      'Student ID',
      'Full Name',
      'Program',
      'School',
      'Award Level',
      'GPA',
      'Honors',
      'Ceremony',
      'Clearance Progress (%)',
      'Status',
      'Graduation Fee Status'
    ];

    const rows = filteredCandidates.map((c) => [
      `"${c.studentId}"`,
      `"${c.fullName}"`,
      `"${c.programName}"`,
      `"${c.schoolName}"`,
      `"${c.awardLevel}"`,
      c.finalGpa.toFixed(2),
      `"${c.academicHonors || ''}"`,
      `"${c.ceremonyNumber}"`,
      c.clearanceProgress,
      `"${c.status}"`,
      `"${c.graduationFeeStatus}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BIBU_Graduation_Candidates_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    displayNotice('Graduation candidate roster exported successfully as CSV.');
  };

  // Mass clearance action for selected department
  const handleMassClearance = (deptKey: keyof GraduationCandidate['clearances']) => {
    graduationCandidates.forEach((c) => {
      if (c.clearances[deptKey].status !== 'Completed') {
        updateDepartmentClearance(c.id, deptKey, {
          status: 'Completed',
          clearedBy: currentUser.name,
          clearedDate: new Date().toISOString().split('T')[0],
          notes: `Batch clearance applied by ${currentUser.name} (${currentUser.role})`
        });
      }
    });
    displayNotice(`Batch clearance completed for ${String(deptKey).toUpperCase()} department across all candidates.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner with University Royal Blue & Gold Aesthetic */}
      <div className="bg-gradient-to-r from-[#001A4D] via-[#002366] to-[#001438] rounded-2xl p-6 sm:p-8 text-white border-b-4 border-[#C5A059] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059] text-[#C5A059] text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Office of the University Registrar • Division of Academic Ceremonies</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
            Graduation, Alumni & Digital Booklet System
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Centralized convocation governance, 7-department digital clearance workflow, automated digital graduation booklet generator, degree conferral & global alumni network database.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <UniversityLogo size="lg" withRing className="border-[#C5A059] shadow-2xl hidden sm:block" />
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-emerald-700 hover:text-emerald-900">
            ✕
          </button>
        </div>
      )}

      {/* Executive KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#002366]" />
            <span>Total Candidates</span>
          </div>
          <div className="text-2xl font-black font-display text-[#002366]">{stats.total}</div>
          <div className="text-[10px] text-slate-400">Class of 2026 Graduands</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Cleared</span>
          </div>
          <div className="text-2xl font-black font-display text-emerald-600">{stats.cleared}</div>
          <div className="text-[10px] text-slate-400">Ready for conferment</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Clearance</span>
          </div>
          <div className="text-2xl font-black font-display text-amber-600">{stats.pending}</div>
          <div className="text-[10px] text-slate-400">In departmental review</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Conferred Degrees</span>
          </div>
          <div className="text-2xl font-black font-display text-[#002366]">{stats.conferred}</div>
          <div className="text-[10px] text-slate-400">Certificates issued</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-blue-700" />
            <span>Graduation Fees</span>
          </div>
          <div className="text-2xl font-black font-display text-slate-900">
            ${stats.totalFeesCollected.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">Bursar confirmed</div>
        </div>
      </div>

      {/* Navigation Sub-tabs Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs flex items-center flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('candidates')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'candidates'
              ? 'bg-[#002366] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-[#C5A059]" />
          <span>Graduates & Candidates ({graduationCandidates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ceremonies')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'ceremonies'
              ? 'bg-[#002366] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#C5A059]" />
          <span>Ceremonies ({graduationCeremonies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('clearance')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'clearance'
              ? 'bg-[#002366] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
          <span>7-Dept Clearance Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('booklet')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'booklet'
              ? 'bg-[#002366] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#C5A059]" />
          <span>Digital Graduation Booklet</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'certificates'
              ? 'bg-[#002366] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-[#C5A059]" />
          <span>Certificates Register ({graduationCertificates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('awards')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'awards'
              ? 'bg-[#002366] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4 text-[#C5A059]" />
          <span>Academic Awards ({academicAwards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alumni')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'alumni'
              ? 'bg-[#002366] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>Alumni Database ({alumniList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'bg-[#002366] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-[#C5A059]" />
          <span>Executive Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'bg-[#002366] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4 text-[#C5A059]" />
          <span>Audit Logs ({graduationAuditLogs.length})</span>
        </button>
      </div>

      {/* TAB CONTENT 1: GRADUATES & CANDIDATES TABLE */}
      {activeTab === 'candidates' && (
        <div className="space-y-4">
          {/* Action & Filter Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center flex-wrap gap-2 flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchCandidate}
                  onChange={(e) => setSearchCandidate(e.target.value)}
                  placeholder="Search student ID, candidate name, program..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#002366]"
                />
              </div>

              <select
                value={selectedCeremonyFilter}
                onChange={(e) => setSelectedCeremonyFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
              >
                <option value="All">All Ceremonies</option>
                {graduationCeremonies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.graduationNumber} ({c.graduationYear})
                  </option>
                ))}
              </select>

              <select
                value={selectedSchoolFilter}
                onChange={(e) => setSelectedSchoolFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
              >
                <option value="All">All Schools</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
              >
                <option value="All">All Statuses</option>
                <option value="Eligible Candidate">Eligible Candidate</option>
                <option value="Clearance Approved">Clearance Approved</option>
                <option value="Conferred Graduate">Conferred Graduate</option>
                <option value="Deferred">Deferred</option>
              </select>
            </div>

            {/* Action Buttons: Add, Import, Export */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setShowAddCandidateModal(true)}
                className="px-4 py-2 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Add Candidate</span>
              </button>
            </div>
          </div>

          {/* Candidates Roster Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-[#002366] uppercase tracking-wider">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Program & School</th>
                    <th className="py-3 px-4">GPA / Honors</th>
                    <th className="py-3 px-4">Clearance</th>
                    <th className="py-3 px-4">Fee Status</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        No graduating candidates found matching the query.
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((cand) => (
                      <tr key={cand.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={cand.profilePhoto}
                              alt={cand.fullName}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                            />
                            <div>
                              <div className="font-bold text-slate-900 hover:text-[#002366] cursor-pointer" onClick={() => setSelectedCandidate(cand)}>
                                {cand.fullName}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                #{cand.bookletNumber || 'BK-001'} • {cand.country}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-slate-700">
                          {cand.studentId}
                        </td>

                        <td className="py-3 px-4 max-w-[220px]">
                          <div className="font-semibold text-slate-900 truncate">{cand.programName}</div>
                          <div className="text-[10px] text-slate-500 truncate">{cand.schoolName}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-[#002366]">{cand.finalGpa.toFixed(2)}</div>
                          <div className="text-[10px] text-[#C5A059] font-semibold">{cand.academicHonors || 'Pass'}</div>
                        </td>

                        <td className="py-3 px-4 min-w-[130px]">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="font-bold">{cand.clearanceProgress}%</span>
                            <span className="text-slate-400">7 depts</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                cand.clearanceProgress === 100
                                  ? 'bg-emerald-500'
                                  : cand.clearanceProgress >= 50
                                  ? 'bg-[#002366]'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${cand.clearanceProgress}%` }}
                            />
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              cand.graduationFeeStatus === 'Paid' || cand.graduationFeeStatus === 'Waived'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {cand.graduationFeeStatus}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              cand.status === 'Conferred Graduate'
                                ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                : cand.status === 'Clearance Approved'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                : 'bg-amber-50 text-amber-900 border border-amber-200'
                            }`}
                          >
                            {cand.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedCandidate(cand)}
                              title="Open Candidate Dossier"
                              className="p-1.5 rounded-lg text-[#002366] hover:bg-blue-50 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setSelectedAlumniCardTarget(cand)}
                              title="Generate Official Alumni ID Card"
                              className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors"
                            >
                              <Award className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: CEREMONIES MANAGER */}
      {activeTab === 'ceremonies' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-display text-[#002366]">Graduation Ceremonies Registry</h3>
              <p className="text-xs text-slate-500">Plan and schedule university convocations and congregation proceedings</p>
            </div>
            <button
              onClick={() => setShowAddCeremonyModal(true)}
              className="px-4 py-2 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Create Graduation Ceremony</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {graduationCeremonies.map((ceremony) => {
              const candidateCount = graduationCandidates.filter((c) => c.ceremonyId === ceremony.id).length;

              return (
                <div
                  key={ceremony.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={ceremony.bannerImage}
                      alt={ceremony.graduationNumber}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          ceremony.status === 'Confirmed'
                            ? 'bg-emerald-500 text-white'
                            : ceremony.status === 'Registration Open'
                            ? 'bg-[#C5A059] text-[#002366]'
                            : 'bg-slate-700 text-white'
                        }`}
                      >
                        {ceremony.status}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="text-[10px] text-[#C5A059] font-mono uppercase font-bold">
                        Academic Year {ceremony.graduationYear}
                      </div>
                      <h4 className="text-xl font-bold font-display text-white">{ceremony.graduationNumber}</h4>
                      <div className="text-xs text-slate-200 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>{ceremony.venue}, {ceremony.city}, {ceremony.country}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Theme Card */}
                    <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
                      <div className="text-[10px] font-bold uppercase text-[#002366]">Convocation Theme</div>
                      <div className="font-semibold text-slate-800 italic mt-0.5">"{ceremony.theme}"</div>
                    </div>

                    {/* Key Dignitaries */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Chancellor</div>
                        <div className="font-semibold text-slate-800">{ceremony.chancellor}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Vice Chancellor</div>
                        <div className="font-semibold text-slate-800">{ceremony.viceChancellor}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Chief Guest</div>
                        <div className="font-semibold text-slate-800 line-clamp-1">{ceremony.chiefGuest}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Graduands Enrolled</div>
                        <div className="font-bold text-[#002366]">{candidateCount} candidates</div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{ceremony.graduationDate} • {ceremony.graduationTime}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCeremonyFilter(ceremony.id);
                          setActiveTab('candidates');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#002366] text-white font-bold text-[11px] hover:bg-[#001A4D] transition-colors"
                      >
                        Manage Candidates
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: 7-DEPARTMENT CLEARANCE ENGINE */}
      {activeTab === 'clearance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Multi-Department Clearance Workflow Engine</span>
              </div>
              <h3 className="text-xl font-bold font-display text-[#002366]">Institutional Clearance Matrix</h3>
              <p className="text-xs text-slate-500">
                Department heads review and electronically sign off on academic requirements, financial dues, library clearances, conduct, and registrar approval.
              </p>
            </div>

            {/* Batch Clearance Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={() => handleMassClearance('academic')}
                className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#002366] font-bold text-xs border border-blue-200 transition-colors"
              >
                + Mass Clear Academic
              </button>
              <button
                onClick={() => handleMassClearance('library')}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200 transition-colors"
              >
                + Mass Clear Library
              </button>
              <button
                onClick={() => handleMassClearance('studentAffairs')}
                className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 transition-colors"
              >
                + Mass Clear Conduct
              </button>
            </div>
          </div>

          {/* Department Breakdown Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Academic Dept', key: 'academic', desc: 'Curriculum & GPA check' },
              { title: 'Examinations', key: 'examination', desc: 'Grades & Transcript review' },
              { title: 'Finance / Bursar', key: 'finance', desc: 'Tuition & Graduation fees' },
              { title: 'Theological Library', key: 'library', desc: 'Books & Resource returns' },
              { title: 'Student Affairs', key: 'studentAffairs', desc: 'Conduct & Ministry standing' },
              { title: 'Registrar Approval', key: 'registrar', desc: 'Accreditation compliance' },
              { title: 'Graduation Office', key: 'graduationOffice', desc: 'Gown & Convocation seating' }
            ].map((dept) => {
              const countPending = graduationCandidates.filter(
                (c) => c.clearances[dept.key as keyof GraduationCandidate['clearances']].status === 'Pending'
              ).length;
              const countCompleted = graduationCandidates.filter(
                (c) => c.clearances[dept.key as keyof GraduationCandidate['clearances']].status === 'Completed'
              ).length;

              return (
                <div key={dept.key} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-display text-[#002366]">{dept.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#002366]">
                      {countCompleted}/{graduationCandidates.length}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">{dept.desc}</div>
                  
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{
                        width: `${graduationCandidates.length > 0 ? (countCompleted / graduationCandidates.length) * 100 : 0}%`
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1">
                    <span className="text-emerald-700 font-bold">{countCompleted} Approved</span>
                    <span className="text-amber-700 font-bold">{countPending} Pending</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: DIGITAL GRADUATION BOOKLET & PDF GENERATOR */}
      {activeTab === 'booklet' && (
        <div className="space-y-6">
          <GraduationBookletGenerator
            initialCeremonyId={selectedCeremonyFilter !== 'All' ? selectedCeremonyFilter : currentCeremony?.id}
          />
        </div>
      )}

      {/* TAB CONTENT 5: CERTIFICATES & VERIFICATION REGISTER */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-[#002366]">
                Conferred Credentials & Certificate Register
              </h3>
              <p className="text-xs text-slate-500">
                Official repository of degrees and diplomas issued under the authority of the Board of Regents
              </p>
            </div>

            <div className="text-xs font-mono text-[#002366] font-bold">
              {graduationCertificates.length} Records Registered
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-[#002366] uppercase tracking-wider">
                    <th className="py-3 px-4">Certificate No.</th>
                    <th className="py-3 px-4">Graduate Name</th>
                    <th className="py-3 px-4">Degree Conferred</th>
                    <th className="py-3 px-4">School</th>
                    <th className="py-3 px-4">Conferral Date</th>
                    <th className="py-3 px-4">Verification Code</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {graduationCertificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#002366]">
                        {cert.certificateNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {cert.studentName}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {cert.degreeTitle}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{cert.schoolName}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{cert.conferralDate}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-amber-700 bg-amber-50/50 px-2 rounded">
                        {cert.verificationCode}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {cert.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            const cand = graduationCandidates.find((c) => c.id === cert.candidateId);
                            if (cand) setSelectedAlumniCardTarget(cand);
                          }}
                          className="p-1 text-[#002366] hover:underline text-xs font-bold"
                        >
                          View Card
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: ACADEMIC AWARDS */}
      {activeTab === 'awards' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-display text-[#002366]">Academic Awards, Honours & Citations</h3>
              <p className="text-xs text-slate-500">Valedictorian, Salutatorian, Chancellor's Awards & Ministry Leadership Honours</p>
            </div>
            <button
              onClick={() => setShowAddAwardModal(true)}
              className="px-4 py-2 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Register Award Recipient</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {academicAwards.map((award) => (
              <div
                key={award.id}
                className="bg-white rounded-2xl border-2 border-[#C5A059]/40 p-6 shadow-xs space-y-4 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002366] text-[#C5A059] text-[10px] font-black uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5" />
                    <span>{award.awardCategory}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 font-bold">Class of 2026</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-bold font-display text-[#002366]">{award.awardTitle}</h4>
                  <div className="text-sm font-bold text-slate-900">{award.studentName}</div>
                  <div className="text-xs text-slate-500">
                    {award.programName} • {award.schoolName}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-slate-700 italic leading-relaxed">
                  "{award.citation}"
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                  <span>Presented by: <strong>{award.presentedBy}</strong></span>
                  {award.prizeDetails && (
                    <span className="font-bold text-[#C5A059]">{award.prizeDetails}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 7: ALUMNI DATABASE */}
      {activeTab === 'alumni' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-[#002366]">
                Global Alumni Association Registry (2017-2026)
              </h3>
              <p className="text-xs text-slate-500">
                Network of over 1,500 pastors, scholars, and Christian leaders across 50+ nations
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#002366] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
              {alumniList.length} Global Members
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {alumniList.slice(0, 9).map((alum) => (
              <div
                key={alum.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#C5A059] shadow-xs flex items-start gap-3.5 transition-all"
              >
                <img
                  src={alum.profile_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'}
                  alt={alum.full_name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-display text-[#002366] truncate">{alum.full_name}</h4>
                    <span className="text-[9px] font-mono text-slate-400">Class {alum.graduation_year}</span>
                  </div>

                  <div className="text-[11px] text-slate-700 font-medium truncate">{alum.program_name}</div>
                  <div className="text-[10px] text-slate-500">{alum.country} • {alum.chapter || 'Global'}</div>

                  <div className="pt-2 flex items-center justify-between text-[10px]">
                    <span className="font-mono text-[#C5A059] font-bold">{alum.alumni_id}</span>
                    <button
                      onClick={() => {
                        const cand = graduationCandidates.find((c) => c.studentId === alum.student_id);
                        if (cand) {
                          setSelectedAlumniCardTarget(cand);
                        } else {
                          displayNotice(`Alumni record verified: ${alum.full_name}`);
                        }
                      }}
                      className="text-[#002366] hover:underline font-bold"
                    >
                      View ID Card
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 8: EXECUTIVE REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xl font-bold font-display text-[#002366]">Graduation Executive Analytics & Audits</h3>
            <p className="text-xs text-slate-500">
              High-level summary of academic credential conferment across all colleges and schools
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">Conferment Rate</div>
                <div className="text-3xl font-black font-display text-emerald-600">
                  {graduationCandidates.length > 0
                    ? Math.round((stats.cleared / graduationCandidates.length) * 100)
                    : 0}
                  %
                </div>
                <div className="text-[11px] text-slate-500">Graduands fully cleared for ceremony</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">Nations Represented</div>
                <div className="text-3xl font-black font-display text-[#002366]">18 Countries</div>
                <div className="text-[11px] text-slate-500">USA, Kenya, Ghana, UK, Nigeria, etc.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">Honorary Citations</div>
                <div className="text-3xl font-black font-display text-[#C5A059]">{academicAwards.length} Citations</div>
                <div className="text-[11px] text-slate-500">Approved by Academic Senate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 9: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#002366] uppercase tracking-wider">
              Permanent Graduation Governance Audit Trail
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Immutable System Ledger</span>
          </div>

          <div className="divide-y divide-slate-200 text-xs">
            {graduationAuditLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition-colors">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900">{log.action}</div>
                  <div className="text-slate-600">{log.details}</div>
                  <div className="text-[10px] text-slate-400">
                    By: <strong>{log.performedBy}</strong> ({log.role})
                  </div>
                </div>

                <div className="text-right font-mono text-[10px] text-slate-400 flex-shrink-0">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Dossier & Clearance Modal */}
      {selectedCandidate && (
        <GraduationCandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onUpdateCandidate={(updated) => {
            updateGraduationCandidate(updated.id, updated);
            setSelectedCandidate(updated);
          }}
        />
      )}

      {/* Alumni Digital Card Modal */}
      {selectedAlumniCardTarget && (
        <AlumniDigitalCard
          candidate={selectedAlumniCardTarget}
          onClose={() => setSelectedAlumniCardTarget(null)}
        />
      )}
    </div>
  );
};
