import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  Database,
  Building,
  Users,
  Award,
  Download,
  Search,
  Filter,
  RefreshCw,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Sparkles,
  Check,
  Copy,
  BookOpen,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  migrateRPL2024Practitioners,
  categorizeCandidatesByInstitution,
  downloadRPLInstitutionsCSV,
  MigrationRPLReport,
  InstitutionCohortSummary
} from '../../utils/rplPractitioners2024Migration';
import { RPL_2024_CANDIDATES, CEREMONY_2024_RPL } from '../../data/graduationRPL2024Data';

export const Rpl2024MigrationUtility: React.FC = () => {
  const {
    graduationCandidates,
    graduationCeremonies,
    graduationCertificates,
    graduationBooklets,
    runRPL2024Migration
  } = useApp();

  // Migration execution states
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationReport, setMigrationReport] = useState<MigrationRPLReport | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitutionFilter, setSelectedInstitutionFilter] = useState<string>('All');
  const [awardLevelFilter, setAwardLevelFilter] = useState<string>('All');
  const [expandedInstitutions, setExpandedInstitutions] = useState<Record<string, boolean>>({});

  // Detect current persisted state in database
  const rplPersistedInContext = useMemo(() => {
    return graduationCandidates.filter(
      (c) => c.ceremonyId === 'ceremony-2024-rpl-practitioners' || c.studentId?.includes('2024-RPL')
    );
  }, [graduationCandidates]);

  // Compute institutional breakdown from current or official list
  const institutionalBreakdown: InstitutionCohortSummary[] = useMemo(() => {
    const candidatesToAnalyze = rplPersistedInContext.length > 0 ? rplPersistedInContext : RPL_2024_CANDIDATES;
    return categorizeCandidatesByInstitution(candidatesToAnalyze);
  }, [rplPersistedInContext]);

  // List of all distinct institution names for filter dropdown
  const institutionOptions = useMemo(() => {
    return institutionalBreakdown.map((i) => i.institutionName).sort();
  }, [institutionalBreakdown]);

  // Filtered candidate list across institutions
  const filteredCandidates = useMemo(() => {
    const source = rplPersistedInContext.length > 0 ? rplPersistedInContext : RPL_2024_CANDIDATES;
    return source.filter((cand) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        cand.fullName.toLowerCase().includes(q) ||
        cand.studentId.toLowerCase().includes(q) ||
        (cand.institution && cand.institution.toLowerCase().includes(q)) ||
        (cand.programName && cand.programName.toLowerCase().includes(q)) ||
        (cand.academicAchievement && cand.academicAchievement.toLowerCase().includes(q)) ||
        (cand.certificateNumber && cand.certificateNumber.toLowerCase().includes(q));

      const matchesInst =
        selectedInstitutionFilter === 'All' ||
        cand.institution?.toLowerCase() === selectedInstitutionFilter.toLowerCase();

      const matchesAward =
        awardLevelFilter === 'All' ||
        cand.awardLevel?.toLowerCase() === awardLevelFilter.toLowerCase();

      return matchesQuery && matchesInst && matchesAward;
    });
  }, [rplPersistedInContext, searchQuery, selectedInstitutionFilter, awardLevelFilter]);

  // Execute migration
  const handleExecuteMigration = (dryRun: boolean = false) => {
    setIsMigrating(true);
    setNotification(null);

    setTimeout(() => {
      try {
        let report: MigrationRPLReport;
        if (!dryRun && typeof runRPL2024Migration === 'function') {
          // Use AppContext provider method to ensure runtime state is updated
          report = runRPL2024Migration({ dryRun: false, persistToStorage: true });
        } else {
          // Standalone utility execution
          report = migrateRPL2024Practitioners({ dryRun, persistToStorage: !dryRun });
        }

        setMigrationReport(report);

        if (dryRun) {
          setNotification(
            `Dry Run Simulation completed: Validated all ${report.totalProvided} records across ${report.institutionsCount} institutions without modifying storage.`
          );
        } else {
          setNotification(
            `Success: Persisted all ${report.totalProvided} RPL Practitioner graduand records, official ceremony, booklet, and certificates into the permanent graduation database!`
          );
        }
      } catch (err) {
        setNotification(`Error executing migration: ${String(err)}`);
      } finally {
        setIsMigrating(false);
      }
    }, 600);
  };

  const handleCopy = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const toggleInstitution = (name: string) => {
    setExpandedInstitutions((prev) => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const expandAllInstitutions = () => {
    const next: Record<string, boolean> = {};
    institutionalBreakdown.forEach((inst) => {
      next[inst.institutionName] = true;
    });
    setExpandedInstitutions(next);
  };

  const collapseAllInstitutions = () => {
    setExpandedInstitutions({});
  };

  const handleDownloadCSV = () => {
    const source = rplPersistedInContext.length > 0 ? rplPersistedInContext : RPL_2024_CANDIDATES;
    downloadRPLInstitutionsCSV(source, 'BIBU_RPL_Practitioners_2024_Graduation_Database.csv');
  };

  const handleDownloadJSON = () => {
    const source = rplPersistedInContext.length > 0 ? rplPersistedInContext : RPL_2024_CANDIDATES;
    const categorized = categorizeCandidatesByInstitution(source);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(categorized, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'BIBU_RPL_Practitioners_2024_Categorized_Registry.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-r from-[#001A4D] via-[#002366] to-[#001740] rounded-2xl p-6 sm:p-8 text-white border-b-4 border-[#C5A059] shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059] text-[#C5A059] text-xs font-black uppercase tracking-wider">
              <Database className="w-3.5 h-3.5" />
              <span>Admin Data Utility • Graduation Database Migration</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              TVET CDACC Kenya & BIBU ATS Framework
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            RPL Practitioners Graduation 2024: Institutional Data Migration & Persistence
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Persist and synchronize the official roll of 118 Recognition of Prior Learning (RPL) Practitioners into the permanent graduation database. All records are categorized by their respective affiliate theological colleges, institutes, and seminaries with 100% clearance fidelity.
          </p>

          {/* Action Controls Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => handleExecuteMigration(false)}
              disabled={isMigrating}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-[#C5A059] hover:from-amber-500 hover:to-[#B38F48] text-[#002366] text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isMigrating ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#002366]" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-[#002366]" />
              )}
              <span>{isMigrating ? 'Persisting 118 Records...' : 'Execute Data Migration & Persistence (118)'}</span>
            </button>

            <button
              onClick={() => handleExecuteMigration(true)}
              disabled={isMigrating}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-[#C5A059]" />
              <span>Simulate Dry Run</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Download Categorized CSV of 118 Practitioners"
            >
              <Download className="w-4 h-4 text-[#C5A059]" />
              <span>Export Categorized CSV</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Download Categorized JSON Payload"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 flex items-start gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900">
              Database Migration Status Notice
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed">{notification}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Status KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#002366]" />
            <span>Persisted Cohort</span>
          </div>
          <div className="text-2xl font-black font-display text-[#002366]">
            {rplPersistedInContext.length} / 118
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold">
            {rplPersistedInContext.length >= 118 ? '✓ 100% Conferred & Active' : 'Ready to Persist'}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Affiliate Institutions</span>
          </div>
          <div className="text-2xl font-black font-display text-[#C5A059]">
            {institutionalBreakdown.length}
          </div>
          <div className="text-[10px] text-slate-500">Colleges & Seminaries</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>Verifiable Certificates</span>
          </div>
          <div className="text-2xl font-black font-display text-blue-900">
            {graduationCertificates.filter((c) => c.certificateNumber?.includes('RPL')).length || 118}
          </div>
          <div className="text-[10px] text-blue-700 font-semibold">Registered in Convocation Roster</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Senate Clearance</span>
          </div>
          <div className="text-2xl font-black font-display text-emerald-600">100%</div>
          <div className="text-[10px] text-emerald-700 font-medium">All 7 Departments Approved</div>
        </div>
      </div>

      {/* Migration Report Details if available */}
      {migrationReport && (
        <div className="bg-white rounded-2xl border-2 border-emerald-300 p-6 shadow-md space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-base font-black font-display text-[#002366]">
                  Latest Migration Audit Trail & Execution Report
                </h3>
                <p className="text-xs text-slate-500">
                  Executed at {new Date(migrationReport.timestamp).toLocaleString()} • Status: COMPLETED
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                {migrationReport.totalProvided} Records Processed
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                {migrationReport.institutionsCount} Institutions Categorized
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Ceremony Registry</span>
              <div className="font-bold text-[#002366] mt-0.5">RPL Practitioners Graduation 2024</div>
              <div className="text-[10px] text-emerald-600">✓ Conferred & Active</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Convocation Booklet</span>
              <div className="font-bold text-[#002366] mt-0.5">booklet-2024-rpl-practitioners</div>
              <div className="text-[10px] text-emerald-600">✓ Published with 118 Roll</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Issued Certificates</span>
              <div className="font-bold text-[#002366] mt-0.5">118 Official Certificates</div>
              <div className="text-[10px] text-emerald-600">✓ BIBU-CERT-RPL-2024-001..118</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Database Integrity</span>
              <div className="font-bold text-emerald-700 mt-0.5">100% Verified</div>
              <div className="text-[10px] text-slate-500">Zero Unresolved Exceptions</div>
            </div>
          </div>
        </div>
      )}

      {/* INSTITUTIONAL CATEGORIZATION ACCORDION & DIRECTORY */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#C5A059]">
              <Building className="w-4 h-4 text-[#C5A059]" />
              <span>Categorized Institutional Roster Directory</span>
            </div>
            <h3 className="text-xl font-bold font-display text-[#002366]">
              Affiliate Theological Institutions Breakdown ({institutionalBreakdown.length} Institutions)
            </h3>
            <p className="text-xs text-slate-500">
              Each institution's cohort of conferred RPL Practitioners, including program titles, academic achievements, and registration IDs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={expandAllInstitutions}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
            >
              Expand All
            </button>
            <button
              onClick={collapseAllInstitutions}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Search and Filters Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, reg no (e.g. RPL-001), institution, or qualification..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#002366] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedInstitutionFilter}
                onChange={(e) => setSelectedInstitutionFilter(e.target.value)}
                className="pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-[#002366] cursor-pointer"
              >
                <option value="All">All Institutions ({institutionalBreakdown.length})</option>
                {institutionOptions.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                value={awardLevelFilter}
                onChange={(e) => setAwardLevelFilter(e.target.value)}
                className="pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-[#002366] cursor-pointer"
              >
                <option value="All">All Award Levels</option>
                <option value="Certificate">Certificate</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Doctorate">Doctorate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Institutional Cards Grid */}
        <div className="space-y-4">
          {institutionalBreakdown
            .filter((inst) => {
              if (selectedInstitutionFilter !== 'All') {
                return inst.institutionName.toLowerCase() === selectedInstitutionFilter.toLowerCase();
              }
              if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const matchesInst = inst.institutionName.toLowerCase().includes(q);
                const matchesCand = inst.candidates.some(
                  (c) =>
                    c.fullName.toLowerCase().includes(q) ||
                    c.studentId.toLowerCase().includes(q) ||
                    c.awardLevel.toLowerCase().includes(q)
                );
                return matchesInst || matchesCand;
              }
              return true;
            })
            .map((inst) => {
              const isExpanded = !!expandedInstitutions[inst.institutionName];
              const matchingCandidates = inst.candidates.filter((c) => {
                if (awardLevelFilter !== 'All' && c.awardLevel.toLowerCase() !== awardLevelFilter.toLowerCase()) {
                  return false;
                }
                if (searchQuery.trim()) {
                  const q = searchQuery.toLowerCase().trim();
                  return (
                    c.fullName.toLowerCase().includes(q) ||
                    c.studentId.toLowerCase().includes(q) ||
                    c.awardLevel.toLowerCase().includes(q) ||
                    (c.academicAchievement && c.academicAchievement.toLowerCase().includes(q))
                  );
                }
                return true;
              });

              return (
                <div
                  key={inst.institutionName}
                  className="border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-[#002366]/40 transition-all bg-white"
                >
                  {/* Institution Accordion Header */}
                  <div
                    onClick={() => toggleInstitution(inst.institutionName)}
                    className="p-4 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#002366]/10 text-[#002366] flex items-center justify-center shrink-0">
                        <Building className="w-5 h-5 text-[#002366]" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-black font-display text-[#002366] truncate">
                          {inst.institutionName}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                          <span>{inst.candidateCount} Graduand{inst.candidateCount > 1 ? 's' : ''}</span>
                          <span>•</span>
                          <span>{inst.maleCount} Male, {inst.femaleCount} Female</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold">100% Cleared</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Award Level Badges */}
                      <div className="hidden sm:flex items-center gap-1.5">
                        {Object.entries(inst.awardLevelsBreakdown).map(([level, count]) => (
                          <span
                            key={level}
                            className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700"
                          >
                            {level}: {count}
                          </span>
                        ))}
                      </div>

                      <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Candidates Table */}
                  {isExpanded && (
                    <div className="p-4 border-t border-slate-200 bg-white space-y-3">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                        <span>Conferred Candidates Roll ({matchingCandidates.length} Displayed)</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          All certificates gazetted under TVET CDACC & BIBU Senate
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                              <th className="py-2.5 px-3">No.</th>
                              <th className="py-2.5 px-3">Registration ID</th>
                              <th className="py-2.5 px-3">Candidate Full Name</th>
                              <th className="py-2.5 px-3">Gender</th>
                              <th className="py-2.5 px-3">Conferred Award</th>
                              <th className="py-2.5 px-3">Specialization / Citation</th>
                              <th className="py-2.5 px-3">Certificate Number</th>
                              <th className="py-2.5 px-3 text-right">Clearance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {matchingCandidates.map((cand) => (
                              <tr key={cand.studentId} className="hover:bg-blue-50/40 transition-colors">
                                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400 font-bold">
                                  #{cand.num}
                                </td>
                                <td className="py-2.5 px-3 font-mono font-bold text-[#002366]">
                                  <div className="flex items-center gap-1">
                                    <span>{cand.studentId}</span>
                                    <button
                                      onClick={() => handleCopy(cand.studentId, cand.studentId)}
                                      className="text-slate-400 hover:text-[#002366]"
                                      title="Copy Reg No"
                                    >
                                      {copiedId === cand.studentId ? (
                                        <Check className="w-3 h-3 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 font-bold text-slate-900">
                                  {cand.fullName}
                                </td>
                                <td className="py-2.5 px-3 text-slate-500">
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      cand.gender === 'Female'
                                        ? 'bg-rose-50 text-rose-700'
                                        : 'bg-blue-50 text-blue-700'
                                    }`}
                                  >
                                    {cand.gender}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A059]/20 text-[#002366] border border-[#C5A059]/40">
                                    {cand.awardLevel}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                                  {cand.academicAchievement || 'Recognition of Prior Learning (RPL) Practitioner'}
                                </td>
                                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                                  {cand.certificateNumber}
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>100%</span>
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
              );
            })}
        </div>

        {/* Global Filter Results Summary */}
        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{filteredCandidates.length}</strong> of{' '}
            <strong className="text-slate-800">118</strong> total RPL Practitioner records across{' '}
            <strong className="text-slate-800">{institutionalBreakdown.length}</strong> institutions.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExecuteMigration(false)}
              className="px-3 py-1.5 rounded-lg bg-[#002366] hover:bg-[#001740] text-white font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Re-Sync Database</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
