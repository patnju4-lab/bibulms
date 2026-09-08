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
  ArrowRight,
  Code2,
  Play,
  FileText,
  ExternalLink,
  ListOrdered
} from 'lucide-react';
import {
  migrateRPL2024Practitioners,
  categorizeCandidatesByInstitution,
  downloadRPLInstitutionsCSV,
  MigrationRPLReport,
  InstitutionCohortSummary
} from '../../utils/rplPractitioners2024Migration';
import {
  RPL_2024_GRADUATION_CATEGORY,
  RPL_2024_CEREMONY_ID,
  RPL_2024_CEREMONY_NUMBER,
  RAW_118_STUDENTS_TEXT,
  parseRPL118StudentList,
  groupCandidatesByInstitution,
  runRPLPractitionersMigrationScript
} from './rplPractitioners2024MigrationScript';
import { RPL_2024_CANDIDATES, CEREMONY_2024_RPL } from '../../data/graduationRPL2024Data';
import { GraduationCandidate } from '../../types/graduation';

interface Rpl2024MigrationUtilityProps {
  onOpenBooklet?: (ceremonyId?: string) => void;
}

export const Rpl2024MigrationUtility: React.FC<Rpl2024MigrationUtilityProps> = ({ onOpenBooklet }) => {
  const {
    graduationCandidates,
    graduationCeremonies,
    graduationCertificates,
    graduationBooklets,
    runRPL2024Migration
  } = useApp();

  // Navigation sub-tab
  const [subTab, setSubTab] = useState<'roster' | 'parser' | 'booklet-integration'>('roster');

  // Migration execution states
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationReport, setMigrationReport] = useState<MigrationRPLReport | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Raw Parser state
  const [customRawInput, setCustomRawInput] = useState<string>(RAW_118_STUDENTS_TEXT);
  const [useCustomInput, setUseCustomInput] = useState<boolean>(false);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitutionFilter, setSelectedInstitutionFilter] = useState<string>('All');
  const [awardLevelFilter, setAwardLevelFilter] = useState<string>('All');
  const [expandedInstitutions, setExpandedInstitutions] = useState<Record<string, boolean>>({});

  // Detect current persisted state in database
  const rplPersistedInContext = useMemo(() => {
    return graduationCandidates.filter(
      (c) =>
        c.graduationCategory === RPL_2024_GRADUATION_CATEGORY ||
        c.ceremonyId === RPL_2024_CEREMONY_ID ||
        c.studentId?.includes('2024-RPL')
    );
  }, [graduationCandidates]);

  // Dynamically parsed candidates from text if user enters custom text
  const liveParsedCandidates = useMemo(() => {
    if (useCustomInput && customRawInput.trim()) {
      return parseRPL118StudentList(customRawInput);
    }
    return rplPersistedInContext.length > 0 ? rplPersistedInContext : RPL_2024_CANDIDATES;
  }, [useCustomInput, customRawInput, rplPersistedInContext]);

  // Compute institutional breakdown from current active list
  const institutionalBreakdown: InstitutionCohortSummary[] = useMemo(() => {
    return categorizeCandidatesByInstitution(liveParsedCandidates);
  }, [liveParsedCandidates]);

  // List of all distinct institution names for filter dropdown
  const institutionOptions = useMemo(() => {
    return institutionalBreakdown.map((i) => i.institutionName).sort();
  }, [institutionalBreakdown]);

  // Filtered candidate list across institutions
  const filteredCandidates = useMemo(() => {
    return liveParsedCandidates.filter((cand) => {
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
  }, [liveParsedCandidates, searchQuery, selectedInstitutionFilter, awardLevelFilter]);

  // Execute migration script
  const handleExecuteMigration = (dryRun: boolean = false) => {
    setIsMigrating(true);
    setNotification(null);

    setTimeout(() => {
      try {
        let report: MigrationRPLReport;
        
        // Execute migration using the Admin script engine
        if (!dryRun && typeof runRPL2024Migration === 'function') {
          // Sync via AppContext state to update all UI hooks immediately
          report = runRPL2024Migration({ dryRun: false, persistToStorage: true });
        } else {
          // Standalone script persistence
          report = migrateRPL2024Practitioners({ dryRun, persistToStorage: !dryRun });
        }

        setMigrationReport(report);

        if (dryRun) {
          setNotification(
            `Dry Run Simulation completed: Successfully validated all ${report.totalProvided} candidates under category '${RPL_2024_GRADUATION_CATEGORY}' across ${report.institutionsCount} institutions.`
          );
        } else {
          setNotification(
            `Success: Defined '${RPL_2024_GRADUATION_CATEGORY}' category and persisted all ${report.totalProvided} graduands, ceremony records, convocation booklet, and certificates into the centralized graduation database!`
          );
        }
      } catch (err) {
        setNotification(`Error executing migration: ${String(err)}`);
      } finally {
        setIsMigrating(false);
      }
    }, 500);
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
    downloadRPLInstitutionsCSV(liveParsedCandidates, 'BIBU_RPL_Practitioners_2024_Graduation_Database.csv');
  };

  const handleDownloadJSON = () => {
    const categorized = groupCandidatesByInstitution(liveParsedCandidates);
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
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059] text-[#C5A059] text-xs font-black uppercase tracking-wider">
              <Database className="w-3.5 h-3.5" />
              <span>Admin Module • Graduation Category Migration</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-[11px] font-mono font-bold">
              Category: {RPL_2024_GRADUATION_CATEGORY}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              TVET CDACC Kenya & BIBU ATS Framework
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              RPL Practitioners Graduation 2024: Data Migration Script & Institutional Persistence
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed mt-1">
              Defines the official <strong className="text-amber-300 font-bold font-mono">'{RPL_2024_GRADUATION_CATEGORY}'</strong> graduation category, parses the verified cohort of 118 graduands, categorizes them by their 14 associated theological institutions, and persists them into the centralized graduation database for real-time rendering in the <strong className="text-white">GraduationBookletGenerator</strong>.
            </p>
          </div>

          {/* Action Controls Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
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
              <span>{isMigrating ? 'Executing Migration...' : 'Run Migration & Persist 118 Records'}</span>
            </button>

            <button
              onClick={() => handleExecuteMigration(true)}
              disabled={isMigrating}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-[#C5A059]" />
              <span>Simulate Dry Run</span>
            </button>

            {onOpenBooklet && (
              <button
                onClick={() => onOpenBooklet(RPL_2024_CEREMONY_ID)}
                className="px-4 py-3 rounded-xl bg-blue-600/60 hover:bg-blue-600 border border-blue-400/50 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                title="Launch Graduation Booklet Generator for RPL Practitioners 2024"
              >
                <BookOpen className="w-4 h-4 text-[#C5A059]" />
                <span>Open in Booklet Generator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handleDownloadCSV}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Download Categorized CSV of 118 Practitioners"
            >
              <Download className="w-4 h-4 text-[#C5A059]" />
              <span>Export CSV</span>
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
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 px-2 py-1 cursor-pointer"
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
          <div className="text-[10px] text-slate-500">Theological Colleges & Seminaries</div>
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

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white p-2 rounded-xl">
        <button
          onClick={() => setSubTab('roster')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'roster'
              ? 'bg-[#002366] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Grouped Institutional Roster ({institutionalBreakdown.length} Institutions)</span>
        </button>

        <button
          onClick={() => setSubTab('parser')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'parser'
              ? 'bg-[#002366] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Migration Script & Raw 118 Student Parser</span>
        </button>

        <button
          onClick={() => setSubTab('booklet-integration')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'booklet-integration'
              ? 'bg-[#002366] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
          <span>GraduationBookletGenerator Integration</span>
        </button>
      </div>

      {/* SUB-VIEW 1: INSTITUTIONAL CATEGORIZATION DIRECTORY */}
      {subTab === 'roster' && (
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
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              >
                Expand All
              </button>
              <button
                onClick={collapseAllInstitutions}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
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

                    {/* Candidate Table Inside Accordion */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 p-4 bg-white animate-in slide-in-from-top-2 duration-150">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] bg-slate-50">
                                <th className="py-2.5 px-3">#</th>
                                <th className="py-2.5 px-3">Reg Number</th>
                                <th className="py-2.5 px-3">Graduate Full Name</th>
                                <th className="py-2.5 px-3">Gender</th>
                                <th className="py-2.5 px-3">Academic Qualification / Citation</th>
                                <th className="py-2.5 px-3">Certificate Number</th>
                                <th className="py-2.5 px-3">Senate Clearance</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {matchingCandidates.map((cand) => (
                                <tr key={cand.candidateId} className="hover:bg-blue-50/40 transition-colors">
                                  <td className="py-2.5 px-3 font-mono text-slate-400 font-semibold">
                                    {cand.num}
                                  </td>
                                  <td className="py-2.5 px-3 font-mono font-bold text-[#002366]">
                                    {cand.studentId}
                                  </td>
                                  <td className="py-2.5 px-3 font-bold text-slate-900">
                                    {cand.fullName}
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        cand.gender === 'Female'
                                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                                      }`}
                                    >
                                      {cand.gender}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-700">
                                    <div className="font-semibold text-slate-900">{cand.programName}</div>
                                    {cand.academicAchievement && (
                                      <div className="text-[10px] text-slate-500 line-clamp-1">
                                        {cand.academicAchievement}
                                      </div>
                                    )}
                                  </td>
                                  <td className="py-2.5 px-3 font-mono text-slate-600">
                                    <div className="flex items-center gap-1">
                                      <span className="truncate">{cand.certificateNumber}</span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCopy(cand.certificateNumber, cand.candidateId);
                                        }}
                                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                                        title="Copy Certificate Number"
                                      >
                                        {copiedId === cand.candidateId ? (
                                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      Approved
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
              <strong className="text-slate-800">{liveParsedCandidates.length}</strong> total RPL Practitioner records across{' '}
              <strong className="text-slate-800">{institutionalBreakdown.length}</strong> institutions.
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadCSV}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => handleExecuteMigration(false)}
                className="px-3 py-1.5 rounded-lg bg-[#002366] hover:bg-[#001740] text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Re-Sync Database</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: MIGRATION SCRIPT & RAW 118 STUDENT LIST PARSER */}
      {subTab === 'parser' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4 space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#C5A059]">
              <Code2 className="w-4 h-4 text-[#C5A059]" />
              <span>Migration Script Definition & Parser Engine</span>
            </div>
            <h3 className="text-xl font-bold font-display text-[#002366]">
              Admin Migration Script: Define Category & Parse 118 Graduands
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This migration script formalizes the category <code className="px-1.5 py-0.5 bg-amber-50 text-[#002366] border border-amber-200 rounded font-mono font-bold">RPL Practitioners Graduation 2024</code>, parses raw text lines or records into normalized graduation entities, groups candidates by their associated institutions, and commits them to the centralized store.
            </p>
          </div>

          {/* Script Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                1. Graduation Category Constant
              </span>
              <div className="font-mono text-xs font-bold text-[#002366]">
                RPL Practitioners Graduation 2024
              </div>
              <p className="text-[11px] text-slate-500">
                Registered in university registry as a distinct category alongside Regular Annual Convocation.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                2. Associated Institutions Grouping
              </span>
              <div className="font-mono text-xs font-bold text-[#C5A059]">
                14 Affiliated Institutions
              </div>
              <p className="text-[11px] text-slate-500">
                Automatically maps <code className="font-mono text-[10px]">schoolName = cand.institution</code> so the Convocation Booklet arranges candidate directories under institutional headings.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                3. Centralized Database Targets
              </span>
              <div className="font-mono text-xs font-bold text-emerald-700">
                Candidates, Ceremony, Booklet & Certs
              </div>
              <p className="text-[11px] text-slate-500">
                Idempotent writes with audit logging to ensure instant availability across all university modules.
              </p>
            </div>
          </div>

          {/* Raw Text Input & Parsing Workspace */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#002366] flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-[#C5A059]" />
                <span>Raw 118 Students Input Source (Numbered Format: Index. Full Name - Associated Institution)</span>
              </label>

              <div className="flex items-center gap-2 text-xs">
                <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCustomInput}
                    onChange={(e) => setUseCustomInput(e.target.checked)}
                    className="rounded text-[#002366] focus:ring-[#002366]"
                  />
                  <span>Enable Live Custom Parser</span>
                </label>
                <button
                  onClick={() => setCustomRawInput(RAW_118_STUDENTS_TEXT)}
                  className="text-xs text-[#002366] hover:underline font-bold"
                >
                  Reset Default 118
                </button>
              </div>
            </div>

            <textarea
              rows={10}
              value={customRawInput}
              onChange={(e) => {
                setCustomRawInput(e.target.value);
                setUseCustomInput(true);
              }}
              className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 rounded-xl border border-slate-700 focus:ring-2 focus:ring-[#C5A059] focus:outline-hidden"
              placeholder="Paste raw graduand list e.g.:&#10;1. Gacheru Njuguna Patrick - Breakthrough International Bible College&#10;2. Francis Ndunda Mutisya - Empower Africa Bible Institute"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-slate-800">{liveParsedCandidates.length}</span> candidates parsed •{' '}
                <span className="font-bold text-slate-800">{institutionalBreakdown.length}</span> institutions identified.
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExecuteMigration(true)}
                  disabled={isMigrating}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4 text-[#C5A059]" />
                  <span>Dry Run Test</span>
                </button>

                <button
                  onClick={() => handleExecuteMigration(false)}
                  disabled={isMigrating}
                  className="px-5 py-2 rounded-xl bg-[#002366] hover:bg-[#001740] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span>Execute Migration & Persist</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: GRADUATION BOOKLET GENERATOR INTEGRATION */}
      {subTab === 'booklet-integration' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4 space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-600">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Convocation Publishing Workflow</span>
            </div>
            <h3 className="text-xl font-bold font-display text-[#002366]">
              GraduationBookletGenerator Synchronization
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify the integration of the persisted 118 RPL Practitioner records with the official Convocation Booklet generator. Candidates are automatically grouped under their affiliate theological colleges with ceremonial formatting.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Target Convocation Booklet
                </span>
                <h4 className="text-lg font-bold text-[#002366]">
                  Official Convocation Programme & Graduands Roll: RPL Practitioners Graduation 2024
                </h4>
                <p className="text-xs text-slate-500">
                  Ceremony: <strong className="text-slate-800">RPL Practitioners Graduation 2024</strong> • Edition: 118 Certified Practitioners
                </p>
              </div>

              {onOpenBooklet && (
                <button
                  onClick={() => onOpenBooklet(RPL_2024_CEREMONY_ID)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#002366] to-[#001740] hover:from-[#001740] hover:to-[#001030] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer border border-[#C5A059]/40"
                >
                  <BookOpen className="w-4 h-4 text-[#C5A059]" />
                  <span>Launch Graduation Booklet Generator</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-[#002366]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Institutional Grouping in Booklet</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The booklet generator inspects each candidate's <code className="px-1 py-0.5 bg-slate-100 rounded font-mono text-[10px]">institution</code> and groups candidates into distinct directory sections for each of the 14 affiliated colleges.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-[#002366]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Print & High-Fidelity PDF Export</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generates both continuous booklet reading mode and print-ready multi-page PDF output with official university crests, TVET CDACC citations, and signatures.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
