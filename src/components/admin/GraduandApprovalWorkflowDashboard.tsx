import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCandidate, DepartmentClearanceRecord } from '../../types/graduation';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  BookOpen,
  Filter,
  Download,
  RotateCcw,
  Search,
  ChevronRight,
  UserCheck,
  AlertCircle,
  FileCheck2,
  Layers,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Building,
  Check,
  X,
  XCircle,
  FileText,
  SlidersHorizontal
} from 'lucide-react';

export type GraduandWorkflowStage = 'Pending' | 'Verified' | 'Cleared' | 'Booklet-Ready';

export interface StageConfig {
  stage: GraduandWorkflowStage;
  label: string;
  stepNumber: number;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  accentColor: string;
  description: string;
}

export const STAGE_CONFIGS: Record<GraduandWorkflowStage, StageConfig> = {
  Pending: {
    stage: 'Pending',
    label: 'Pending Review',
    stepNumber: 1,
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    borderColor: 'border-amber-300',
    accentColor: '#D97706',
    description: 'Awaiting department clearances, fee reconciliation, or document verification.'
  },
  Verified: {
    stage: 'Verified',
    label: 'Academic Verified',
    stepNumber: 2,
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-900',
    borderColor: 'border-blue-300',
    accentColor: '#2563EB',
    description: 'Academic standing, GPA, and admission credentials audited and verified.'
  },
  Cleared: {
    stage: 'Cleared',
    label: 'Senate & Dept Cleared',
    stepNumber: 3,
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900',
    borderColor: 'border-emerald-300',
    accentColor: '#059669',
    description: '100% sign-off completed across all 7 departments. Awaiting booklet inclusion.'
  },
  'Booklet-Ready': {
    stage: 'Booklet-Ready',
    label: 'Booklet-Ready & Publication Flagged',
    stepNumber: 4,
    badgeBg: 'bg-[#002366]/15',
    badgeText: 'text-[#002366]',
    borderColor: 'border-[#002366]/40',
    accentColor: '#002366',
    description: 'Fully cleared and approved for official publication in the Convocation Booklet.'
  }
};

export function determineCandidateStage(cand: GraduationCandidate): GraduandWorkflowStage {
  const isFullyCleared = cand.clearanceProgress === 100 ||
    cand.status === 'Clearance Approved' ||
    cand.status === 'Confirmed Graduate' ||
    cand.status === 'Conferred Graduate' ||
    cand.status === 'Approved';

  if (cand.includedInBooklet && isFullyCleared) {
    return 'Booklet-Ready';
  }

  if (isFullyCleared) {
    return 'Cleared';
  }

  const isVerified = (cand.clearanceProgress >= 50 || cand.status === 'Eligible' || cand.status === 'Eligible Candidate') &&
    cand.graduationFeeStatus !== 'Pending';

  if (isVerified) {
    return 'Verified';
  }

  return 'Pending';
}

export const GraduandApprovalWorkflowDashboard: React.FC = () => {
  const {
    graduationCandidates,
    graduationCeremonies,
    currentUser,
    bulkUpdateGraduationCandidates,
    updateGraduationCandidate,
    toggleCandidateBookletFlag,
    updateDepartmentClearance
  } = useApp();

  // Filters State
  const [selectedStage, setSelectedStage] = useState<'all' | GraduandWorkflowStage>('all');
  const [selectedCeremony, setSelectedCeremony] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedAwardLevel, setSelectedAwardLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Bulk Selection State
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // Department Clearance Modal State
  const [inspectingCandidate, setInspectingCandidate] = useState<GraduationCandidate | null>(null);

  // Map each candidate to their current computed stage
  const candidatesWithStage = useMemo(() => {
    return graduationCandidates.map((c) => ({
      candidate: c,
      stage: determineCandidateStage(c)
    }));
  }, [graduationCandidates]);

  // High-Level Funnel Counts
  const funnelMetrics = useMemo(() => {
    const counts = {
      Pending: 0,
      Verified: 0,
      Cleared: 0,
      'Booklet-Ready': 0,
      total: graduationCandidates.length
    };

    candidatesWithStage.forEach(({ stage }) => {
      counts[stage] += 1;
    });

    return counts;
  }, [candidatesWithStage, graduationCandidates.length]);

  // Department Clearance Aggregates (Academic, Examination, Finance, Library, Student Affairs, Registrar, Graduation Office)
  const departmentComplianceData = useMemo(() => {
    const depts: Array<{
      key: keyof GraduationCandidate['clearances'];
      label: string;
      cleared: number;
      pending: number;
    }> = [
      { key: 'academic', label: 'Academic Affairs', cleared: 0, pending: 0 },
      { key: 'examination', label: 'Examinations Board', cleared: 0, pending: 0 },
      { key: 'finance', label: 'Finance & Accounts', cleared: 0, pending: 0 },
      { key: 'library', label: 'University Library', cleared: 0, pending: 0 },
      { key: 'studentAffairs', label: 'Student Affairs', cleared: 0, pending: 0 },
      { key: 'registrar', label: 'University Registrar', cleared: 0, pending: 0 },
      { key: 'graduationOffice', label: 'Graduation Office', cleared: 0, pending: 0 }
    ];

    graduationCandidates.forEach((c) => {
      depts.forEach((d) => {
        const record = c.clearances?.[d.key];
        if (record && (record.status === 'Completed' || record.status === 'Not Required')) {
          d.cleared += 1;
        } else {
          d.pending += 1;
        }
      });
    });

    return depts.map((d) => ({
      department: d.label,
      Cleared: d.cleared,
      Pending: d.pending,
      complianceRate: graduationCandidates.length
        ? Math.round((d.cleared / graduationCandidates.length) * 100)
        : 0
    }));
  }, [graduationCandidates]);

  // Filtered Candidate List
  const filteredList = useMemo(() => {
    return candidatesWithStage.filter(({ candidate, stage }) => {
      if (selectedStage !== 'all' && stage !== selectedStage) {
        return false;
      }
      if (selectedCeremony !== 'all' && candidate.ceremonyId !== selectedCeremony) {
        return false;
      }
      if (selectedRegion !== 'all') {
        const isMatch =
          candidate.country?.toLowerCase().includes(selectedRegion.toLowerCase()) ||
          candidate.campus?.toLowerCase().includes(selectedRegion.toLowerCase());
        if (!isMatch) return false;
      }
      if (selectedAwardLevel !== 'all' && candidate.awardLevel !== selectedAwardLevel) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = candidate.fullName?.toLowerCase().includes(q);
        const matchAdm = candidate.admissionNumber?.toLowerCase().includes(q);
        const matchProg = candidate.programName?.toLowerCase().includes(q);
        const matchId = candidate.studentId?.toLowerCase().includes(q);
        if (!matchName && !matchAdm && !matchProg && !matchId) {
          return false;
        }
      }
      return true;
    });
  }, [candidatesWithStage, selectedStage, selectedCeremony, selectedRegion, selectedAwardLevel, searchQuery]);

  // Multi-select helpers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCandidateIds(filteredList.map((item) => item.candidate.id));
    } else {
      setSelectedCandidateIds([]);
    }
  };

  const handleToggleSelectCandidate = (id: string) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Action: Advance to Booklet-Ready
  const handleBulkFlagBookletReady = () => {
    if (selectedCandidateIds.length === 0) return;

    bulkUpdateGraduationCandidates(selectedCandidateIds, {
      includedInBooklet: true,
      clearanceProgress: 100,
      status: 'Confirmed Graduate',
      bookletFlaggedAt: new Date().toISOString(),
      bookletFlaggedBy: currentUser.name
    });

    setFeedbackMessage({
      type: 'success',
      text: `Successfully promoted ${selectedCandidateIds.length} candidate(s) to 'Booklet-Ready' and approved for publication.`
    });
    setSelectedCandidateIds([]);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Bulk Action: Clear All Departments
  const handleBulkClearDepartments = () => {
    if (selectedCandidateIds.length === 0) return;

    const completedRecord: DepartmentClearanceRecord = {
      status: 'Completed',
      clearedBy: currentUser.name,
      clearedDate: new Date().toISOString()
    };

    bulkUpdateGraduationCandidates(selectedCandidateIds, {
      clearanceProgress: 100,
      status: 'Clearance Approved',
      graduationFeeStatus: 'Paid',
      clearances: {
        academic: completedRecord,
        examination: completedRecord,
        finance: completedRecord,
        library: completedRecord,
        studentAffairs: completedRecord,
        registrar: completedRecord,
        graduationOffice: completedRecord
      }
    });

    setFeedbackMessage({
      type: 'success',
      text: `100% Departmental Clearance recorded for ${selectedCandidateIds.length} candidate(s).`
    });
    setSelectedCandidateIds([]);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Bulk Action: Remove from Booklet
  const handleBulkExcludeFromBooklet = () => {
    if (selectedCandidateIds.length === 0) return;

    bulkUpdateGraduationCandidates(selectedCandidateIds, {
      includedInBooklet: false
    });

    setFeedbackMessage({
      type: 'info',
      text: `Excluded ${selectedCandidateIds.length} candidate(s) from the upcoming Booklet publication.`
    });
    setSelectedCandidateIds([]);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Fast-track individual candidate
  const handleFastTrackToBooklet = (cand: GraduationCandidate) => {
    const completedRecord: DepartmentClearanceRecord = {
      status: 'Completed',
      clearedBy: currentUser.name,
      clearedDate: new Date().toISOString()
    };

    updateGraduationCandidate(cand.id, {
      clearanceProgress: 100,
      status: 'Confirmed Graduate',
      includedInBooklet: true,
      graduationFeeStatus: 'Paid',
      bookletFlaggedAt: new Date().toISOString(),
      bookletFlaggedBy: currentUser.name,
      clearances: {
        academic: completedRecord,
        examination: completedRecord,
        finance: completedRecord,
        library: completedRecord,
        studentAffairs: completedRecord,
        registrar: completedRecord,
        graduationOffice: completedRecord
      }
    });

    setFeedbackMessage({
      type: 'success',
      text: `${cand.fullName} has been fully cleared and flagged as Booklet-Ready.`
    });
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // CSV Audit Export
  const handleExportApprovalAuditCSV = () => {
    const headers = [
      'Student ID',
      'Admission No',
      'Full Name',
      'Award Level',
      'Program Name',
      'Country',
      'Current Stage',
      'Clearance Progress %',
      'Fee Status',
      'Booklet Ready',
      'Academic Cleared',
      'Exam Cleared',
      'Finance Cleared',
      'Library Cleared',
      'Registrar Cleared'
    ];

    const rows = filteredList.map(({ candidate: c, stage }) => [
      `"${c.studentId}"`,
      `"${c.admissionNumber}"`,
      `"${c.fullName}"`,
      `"${c.awardLevel}"`,
      `"${c.programName}"`,
      `"${c.country}"`,
      `"${stage}"`,
      c.clearanceProgress,
      `"${c.graduationFeeStatus}"`,
      c.includedInBooklet ? 'YES' : 'NO',
      c.clearances?.academic?.status || 'Pending',
      c.clearances?.examination?.status || 'Pending',
      c.clearances?.finance?.status || 'Pending',
      c.clearances?.library?.status || 'Pending',
      c.clearances?.registrar?.status || 'Pending'
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BIBU_Graduand_Approval_Workflow_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle single department status inside inspector modal
  const handleToggleDepartmentInInspector = (deptKey: keyof GraduationCandidate['clearances']) => {
    if (!inspectingCandidate) return;
    const currentStatus = inspectingCandidate.clearances?.[deptKey]?.status;
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';

    updateDepartmentClearance(inspectingCandidate.id, deptKey, {
      status: nextStatus,
      clearedBy: nextStatus === 'Completed' ? currentUser.name : undefined,
      clearedDate: nextStatus === 'Completed' ? new Date().toISOString() : undefined
    });

    // Update local modal state
    setInspectingCandidate((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        clearances: {
          ...prev.clearances,
          [deptKey]: {
            ...prev.clearances?.[deptKey],
            status: nextStatus,
            clearedBy: nextStatus === 'Completed' ? currentUser.name : undefined,
            clearedDate: nextStatus === 'Completed' ? new Date().toISOString() : undefined
          }
        }
      };
    });
  };

  // Funnel Chart Data for Recharts
  const funnelChartData = useMemo(() => {
    return [
      { name: '1. Pending', count: funnelMetrics.Pending, fill: '#D97706' },
      { name: '2. Verified', count: funnelMetrics.Verified, fill: '#2563EB' },
      { name: '3. Cleared', count: funnelMetrics.Cleared, fill: '#059669' },
      { name: '4. Booklet-Ready', count: funnelMetrics['Booklet-Ready'], fill: '#002366' }
    ];
  }, [funnelMetrics]);

  return (
    <div id="graduand-approval-workflow-dashboard-root" className="space-y-6">
      {/* Toast Feedback Banner */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-xs animate-in fade-in duration-200 ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-blue-50 text-blue-900 border-blue-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-[#002366]/10 text-[#002366] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Academic Governance & Convocation Pipeline</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-[#002366] tracking-tight">
              Graduand Approval & Booklet-Ready Workflow Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              Track candidate progression across institutional clearance gates—from submission audit and departmental sign-offs to Senate approval and final publication in the Convocation Booklet.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="export-approval-audit-csv-btn"
              onClick={handleExportApprovalAuditCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer border border-slate-300 shadow-xs"
            >
              <Download className="w-4 h-4 text-[#002366]" />
              <span>Export Audit CSV</span>
            </button>
            <button
              onClick={() => {
                setSelectedStage('all');
                setSelectedCeremony('all');
                setSelectedRegion('all');
                setSelectedAwardLevel('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#002366] text-xs font-bold transition-colors cursor-pointer border border-amber-200"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 4-STAGE INTERACTIVE WORKFLOW PIPELINE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
          {(Object.keys(STAGE_CONFIGS) as GraduandWorkflowStage[]).map((stageKey) => {
            const config = STAGE_CONFIGS[stageKey];
            const count = funnelMetrics[stageKey];
            const percent = funnelMetrics.total ? Math.round((count / funnelMetrics.total) * 100) : 0;
            const isSelected = selectedStage === stageKey;

            return (
              <button
                key={stageKey}
                onClick={() => setSelectedStage(isSelected ? 'all' : stageKey)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? `${config.badgeBg} border-2 ${config.borderColor} ring-2 ring-[#002366]/20 shadow-sm`
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-xs font-black text-slate-700 shadow-2xs border border-slate-200">
                    {config.stepNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${config.badgeBg} ${config.badgeText}`}
                  >
                    {percent}% of Roll
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-700">{config.label}</div>
                <div className="text-2xl font-black font-display text-[#002366] mt-0.5">
                  {count.toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                  {config.description}
                </p>

                {/* Micro Progress Indicator */}
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: config.accentColor
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PIPELINE VISUALIZATION & DEPARTMENT COMPLIANCE (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Workflow Funnel Progression (Recharts) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#002366]" />
              <h3 className="text-xs font-bold text-[#002366] uppercase tracking-wider">
                Stage Transition Funnel
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {funnelMetrics['Booklet-Ready']} of {funnelMetrics.total} Ready (
              {funnelMetrics.total
                ? Math.round((funnelMetrics['Booklet-Ready'] / funnelMetrics.total) * 100)
                : 0}
              %)
            </span>
          </div>

          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelChartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11, fontWeight: 'bold' }} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} Candidates`, 'Volume']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {funnelChartData.map((entry, idx) => (
                    <Cell key={`funnel-cell-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
            <span>
              💡 <strong>Convocation Gate:</strong> Only candidates in <strong>Stage 4 (Booklet-Ready)</strong> are injected into booklet print runs.
            </span>
          </div>
        </div>

        {/* Right: Department Clearance Compliance Rates */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#002366]" />
              <h3 className="text-xs font-bold text-[#002366] uppercase tracking-wider">
                Department Clearance Audit Rates
              </h3>
            </div>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              7 Clearances Required
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {departmentComplianceData.map((dept) => (
              <div key={dept.department} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{dept.department}</span>
                  <div className="space-y-0.5 text-right">
                    <span className="font-mono font-bold text-[#002366]">
                      {dept.Cleared} / {graduationCandidates.length}
                    </span>{' '}
                    <span className="text-[11px] text-slate-500">({dept.complianceRate}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${dept.complianceRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILTER & BATCH ACTION CONTROLS */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label htmlFor="filter-workflow-stage" className="block text-[11px] font-bold text-slate-600 mb-1">
              Workflow Stage
            </label>
            <select
              id="filter-workflow-stage"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value as any)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#002366]"
            >
              <option value="all">All Stages ({funnelMetrics.total})</option>
              <option value="Pending">1. Pending Review ({funnelMetrics.Pending})</option>
              <option value="Verified">2. Academic Verified ({funnelMetrics.Verified})</option>
              <option value="Cleared">3. Senate & Dept Cleared ({funnelMetrics.Cleared})</option>
              <option value="Booklet-Ready">4. Booklet-Ready ({funnelMetrics['Booklet-Ready']})</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-workflow-ceremony" className="block text-[11px] font-bold text-slate-600 mb-1">
              Ceremony
            </label>
            <select
              id="filter-workflow-ceremony"
              value={selectedCeremony}
              onChange={(e) => setSelectedCeremony(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#002366]"
            >
              <option value="all">All Ceremonies</option>
              {graduationCeremonies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.graduationNumber} ({c.academicYear})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-workflow-region" className="block text-[11px] font-bold text-slate-600 mb-1">
              Region / Campus
            </label>
            <select
              id="filter-workflow-region"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#002366]"
            >
              <option value="all">All Regions & Campuses</option>
              <option value="Kenya">Kenya (Study Centres)</option>
              <option value="Uganda">Uganda (Kampala Campus)</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-workflow-award" className="block text-[11px] font-bold text-slate-600 mb-1">
              Award Level
            </label>
            <select
              id="filter-workflow-award"
              value={selectedAwardLevel}
              onChange={(e) => setSelectedAwardLevel(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#002366]"
            >
              <option value="all">All Award Levels</option>
              <option value="Doctorate">Doctorate (Ph.D.)</option>
              <option value="Master">Master Degrees</option>
              <option value="Bachelor">Bachelor Degrees</option>
              <option value="Diploma">Diplomas</option>
              <option value="Certificate">Certificates</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-workflow-search" className="block text-[11px] font-bold text-slate-600 mb-1">
              Search Name / Reg No
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                id="filter-workflow-search"
                type="text"
                placeholder="Search candidate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-2.5 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#002366]"
              />
            </div>
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#002366]">
              {selectedCandidateIds.length} candidate(s) selected
            </span>
            {selectedCandidateIds.length > 0 && (
              <button
                onClick={() => setSelectedCandidateIds([])}
                className="text-xs text-slate-500 hover:text-slate-700 underline cursor-pointer"
              >
                Clear Selection
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkFlagBookletReady}
              disabled={selectedCandidateIds.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#002366] text-white text-xs font-bold hover:bg-[#001A4D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Promote to Booklet-Ready</span>
            </button>

            <button
              onClick={handleBulkClearDepartments}
              disabled={selectedCandidateIds.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bulk 100% Department Clear</span>
            </button>

            <button
              onClick={handleBulkExcludeFromBooklet}
              disabled={selectedCandidateIds.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Exclude from Booklet</span>
            </button>
          </div>
        </div>
      </div>

      {/* CANDIDATE WORKFLOW TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#002366]" />
            <h4 className="text-xs font-bold text-[#002366] uppercase tracking-wider">
              Graduand Candidate Approval Roster ({filteredList.length} matching)
            </h4>
          </div>
          <span className="text-xs text-slate-500">
            Stage Filter: <strong className="text-[#002366]">{selectedStage.toUpperCase()}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      filteredList.length > 0 &&
                      selectedCandidateIds.length === filteredList.length
                    }
                    className="rounded border-slate-300 text-[#002366] focus:ring-[#002366] cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-3">Candidate & Student ID</th>
                <th className="py-2.5 px-3">Program & Award</th>
                <th className="py-2.5 px-3 text-center">Region</th>
                <th className="py-2.5 px-3 text-center">Clearance Status</th>
                <th className="py-2.5 px-3 text-center">Workflow Stage</th>
                <th className="py-2.5 px-3 text-center">Booklet Flag</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    No graduand candidates match the selected workflow filters.
                  </td>
                </tr>
              ) : (
                filteredList.map(({ candidate: c, stage }) => {
                  const isSelected = selectedCandidateIds.includes(c.id);
                  const config = STAGE_CONFIGS[stage];

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isSelected ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectCandidate(c.id)}
                          className="rounded border-slate-300 text-[#002366] focus:ring-[#002366] cursor-pointer"
                        />
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-[#002366]">{c.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          ID: {c.studentId} • Adm: {c.admissionNumber}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-slate-800 font-semibold truncate max-w-xs" title={c.programName}>
                          {c.programName}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {c.awardLevel} • {c.schoolName}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.country === 'Uganda'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {c.country || 'Kenya'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-xs text-slate-800">
                            {c.clearanceProgress}%
                          </span>
                          <div className="w-16 bg-slate-200 rounded-full h-1 mt-0.5 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full"
                              style={{ width: `${c.clearanceProgress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${config.badgeBg} ${config.badgeText} border ${config.borderColor}`}
                        >
                          {config.label}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => toggleCandidateBookletFlag(c.id)}
                          title={
                            c.includedInBooklet
                              ? 'Included in Booklet. Click to exclude.'
                              : 'Excluded from Booklet. Click to include.'
                          }
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                            c.includedInBooklet
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {c.includedInBooklet ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Ready</span>
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3 text-slate-400" />
                              <span>Excluded</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Fast track button */}
                          {stage !== 'Booklet-Ready' && (
                            <button
                              onClick={() => handleFastTrackToBooklet(c)}
                              title="Fast-track clearances and flag for booklet"
                              className="p-1 rounded hover:bg-amber-100 text-[#002366] transition-colors cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                            </button>
                          )}

                          {/* Inspect Department Clearances */}
                          <button
                            onClick={() => setInspectingCandidate(c)}
                            title="Inspect & Edit Department Clearances"
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold border border-slate-200 transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DEPARTMENT CLEARANCES MODAL / DRAWER */}
      {inspectingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#002366]">
                  <Building className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Institutional Clearance Audit</span>
                </div>
                <h3 className="text-xl font-bold font-display text-[#002366] mt-0.5">
                  {inspectingCandidate.fullName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Admission: {inspectingCandidate.admissionNumber} • Student ID: {inspectingCandidate.studentId}
                </p>
              </div>
              <button
                onClick={() => setInspectingCandidate(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Summary Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Award Level</div>
                <div className="font-bold text-[#002366] mt-0.5">{inspectingCandidate.awardLevel}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Total Clearance</div>
                <div className="font-bold text-emerald-700 mt-0.5">{inspectingCandidate.clearanceProgress}%</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Fee Status</div>
                <div className="font-bold text-slate-800 mt-0.5">{inspectingCandidate.graduationFeeStatus}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Booklet Roll</div>
                <div className="font-bold text-[#002366] mt-0.5">
                  {inspectingCandidate.includedInBooklet ? 'Included' : 'Excluded'}
                </div>
              </div>
            </div>

            {/* Department Checklist */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Departmental Sign-Offs (Click badge to toggle)
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {[
                  { key: 'academic', label: 'Academic Affairs' },
                  { key: 'examination', label: 'Examinations Board' },
                  { key: 'finance', label: 'Finance & Accounts' },
                  { key: 'library', label: 'University Library' },
                  { key: 'studentAffairs', label: 'Student Affairs' },
                  { key: 'registrar', label: 'University Registrar' },
                  { key: 'graduationOffice', label: 'Graduation Office' }
                ].map(({ key, label }) => {
                  const record = inspectingCandidate.clearances?.[key as keyof GraduationCandidate['clearances']];
                  const isCompleted = record?.status === 'Completed' || record?.status === 'Not Required';

                  return (
                    <div key={key} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-slate-800">{label}</div>
                        <div className="text-[10px] text-slate-500">
                          {isCompleted
                            ? `Cleared by ${record?.clearedBy || 'System Registrar'}`
                            : 'Pending audit submission'}
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleDepartmentInInspector(key as any)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                        }`}
                      >
                        {isCompleted ? '✓ Completed' : 'Pending'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  toggleCandidateBookletFlag(inspectingCandidate.id);
                  setInspectingCandidate((prev) =>
                    prev ? { ...prev, includedInBooklet: !prev.includedInBooklet } : null
                  );
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                  inspectingCandidate.includedInBooklet
                    ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                    : 'bg-[#002366] text-white border-transparent hover:bg-[#001A4D]'
                }`}
              >
                {inspectingCandidate.includedInBooklet
                  ? 'Exclude from Booklet'
                  : 'Include in Booklet'}
              </button>

              <button
                onClick={() => setInspectingCandidate(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
