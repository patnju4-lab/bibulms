import React, { useState } from 'react';
import {
  Award,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Download,
  FileText,
  User,
  Building,
  MapPin,
  Calendar,
  Eye,
  Plus,
  X,
  Send,
  Upload,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  Check,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Save,
  Info
} from 'lucide-react';
import { HonoraryApplication, HonoraryStatus } from '../../../types/admin';

interface HonoraryApplicationsManagerProps {
  applications: HonoraryApplication[];
  onUpdateStatus: (id: string, status: HonoraryStatus, comments?: string, certNo?: string) => void;
  onAddApplication: (app: HonoraryApplication) => void;
  onLogAudit: (action: string, record: string, details?: string) => void;
}

// Quick Comment Templates for Administrators
const QUICK_COMMENT_TEMPLATES = [
  'Senate verification passed: 25+ years exemplary pastoral leadership and church planting verified.',
  'Dossier under Academic Senate review. Awaiting additional ministerial letters of attestation.',
  'Approved by Academic Senate for Doctor of Divinity conferral at the upcoming International Convocation.',
  'Nomination declined: Minimum requirement of 15 years ordained pastoral service is not evidenced in submitted records.',
  'Nomination dossier verified. Candidate recommended for Doctor of Humane Letters (D.H.L. Honoris Causa).'
];

export const HonoraryApplicationsManager: React.FC<HonoraryApplicationsManagerProps> = ({
  applications,
  onUpdateStatus,
  onAddApplication,
  onLogAudit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | HonoraryStatus>('All');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(
    applications[0]?.id || null
  );
  const [reviewComments, setReviewComments] = useState(
    applications[0]?.reviewComments || ''
  );
  const [customCertNo, setCustomCertNo] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [printModalApp, setPrintModalApp] = useState<HonoraryApplication | null>(null);

  // Modal confirmation for critical decision transitions
  const [confirmModal, setConfirmModal] = useState<{
    targetStatus: HonoraryStatus;
    app: HonoraryApplication;
  } | null>(null);

  // New Nomination Modal State
  const [showNewNomination, setShowNewNomination] = useState(false);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newCountry, setNewCountry] = useState('United States');
  const [newDegree, setNewDegree] = useState('Doctor of Divinity (D.D., Honoris Causa)');
  const [newCategory, setNewCategory] = useState('Global Apostolic & Church Planting');
  const [newRationale, setNewRationale] = useState('');
  const [newTenure, setNewTenure] = useState(25);
  const [newCitations, setNewCitations] = useState('');

  // Selected Application Lookup
  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0] || null;

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.ministryOrganization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.honoraryDegree.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate status counts for filter badges
  const statusCounts = {
    All: applications.length,
    Submitted: applications.filter((a) => a.status === 'Submitted').length,
    'Under Review': applications.filter((a) => a.status === 'Under Review').length,
    Approved: applications.filter((a) => a.status === 'Approved').length,
    Rejected: applications.filter((a) => a.status === 'Rejected').length,
    Awarded: applications.filter((a) => a.status === 'Awarded').length
  };

  // Helper to sync comments when changing selected candidate
  const handleSelectApp = (app: HonoraryApplication) => {
    setSelectedAppId(app.id);
    setReviewComments(app.reviewComments || '');
    setCustomCertNo(app.awardCertificateNumber || `BIBU-HON-2026-${Date.now().toString().slice(-4)}`);
  };

  // Status Badge Component
  const renderStatusBadge = (status: HonoraryStatus, size: 'sm' | 'md' = 'sm') => {
    const sizeClasses = size === 'md' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]';

    switch (status) {
      case 'Submitted':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}
          >
            <Send className="w-3 h-3 text-blue-600 shrink-0" />
            <span>Submitted</span>
          </span>
        );
      case 'Under Review':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-300 ${sizeClasses}`}
          >
            <Clock className="w-3 h-3 text-amber-600 shrink-0 animate-spin-slow" />
            <span>Under Review</span>
          </span>
        );
      case 'Approved':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 ${sizeClasses}`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Approved</span>
          </span>
        );
      case 'Rejected':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-rose-50 text-rose-800 border border-rose-300 ${sizeClasses}`}
          >
            <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
            <span>Rejected</span>
          </span>
        );
      case 'Awarded':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-purple-50 text-purple-800 border border-purple-300 ${sizeClasses}`}
          >
            <Award className="w-3 h-3 text-purple-600 shrink-0" />
            <span>Conferred & Awarded</span>
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center rounded-full font-bold bg-slate-100 text-slate-700 ${sizeClasses}`}>
            {status}
          </span>
        );
    }
  };

  // Save comments only without status modification
  const handleSaveCommentsOnly = () => {
    if (!selectedApp) return;
    onUpdateStatus(selectedApp.id, selectedApp.status, reviewComments, selectedApp.awardCertificateNumber);
    onLogAudit(
      'Updated Administrator Review Notes',
      `${selectedApp.applicationNumber} (${selectedApp.candidateName})`,
      reviewComments || 'Notes updated'
    );
    setNotification({
      message: `Administrator review comments for ${selectedApp.candidateName} saved successfully.`,
      type: 'success'
    });
    setTimeout(() => setNotification(null), 3500);
  };

  // Perform status transition (with audit and notification)
  const executeStatusTransition = (status: HonoraryStatus, notes?: string, certNo?: string) => {
    if (!selectedApp) return;

    let finalCertNo: string | undefined = certNo;
    if ((status === 'Approved' || status === 'Awarded') && !finalCertNo) {
      finalCertNo = selectedApp.awardCertificateNumber || customCertNo || `BIBU-HON-2026-${Date.now().toString().slice(-4)}`;
    }

    const finalNotes = notes !== undefined ? notes : reviewComments;

    onUpdateStatus(selectedApp.id, status, finalNotes, finalCertNo);
    onLogAudit(
      `Honorary Status Changed to ${status}`,
      `${selectedApp.applicationNumber} (${selectedApp.candidateName})`,
      finalNotes ? `Notes: ${finalNotes}` : `Workflow moved to ${status}`
    );

    setNotification({
      message: `Nomination for ${selectedApp.candidateName} updated to "${status}".`,
      type: 'success'
    });
    setConfirmModal(null);
    setTimeout(() => setNotification(null), 3500);
  };

  // Quick Action from list row
  const handleQuickStatusChange = (app: HonoraryApplication, newStatus: HonoraryStatus) => {
    let certNo: string | undefined = undefined;
    if (newStatus === 'Approved' || newStatus === 'Awarded') {
      certNo = app.awardCertificateNumber || `BIBU-HON-2026-${Date.now().toString().slice(-4)}`;
    }

    onUpdateStatus(app.id, newStatus, app.reviewComments, certNo);
    onLogAudit(
      `Quick Status Update to ${newStatus}`,
      `${app.applicationNumber} (${app.candidateName})`,
      `Changed directly from list view`
    );

    setNotification({
      message: `Candidate ${app.candidateName} transitioned to "${newStatus}".`,
      type: 'info'
    });
    setTimeout(() => setNotification(null), 3000);
  };

  // Submission of New Candidate Nomination Dossier
  const handleCreateNomination = (e: React.FormEvent) => {
    e.preventDefault();
    const appNo = `BIBU-HON-2026-${(applications.length + 1).toString().padStart(3, '0')}`;
    const newApp: HonoraryApplication = {
      id: `hon-${Date.now()}`,
      applicationNumber: appNo,
      candidateName: newCandidateName,
      email: newEmail,
      phone: newPhone,
      currentTitle: newTitle,
      ministryOrganization: newOrg,
      country: newCountry,
      honoraryDegree: newDegree,
      nominationCategory: newCategory,
      rationale: newRationale,
      ministryTenureYears: Number(newTenure),
      achievements: [newRationale.slice(0, 90)],
      citations: newCitations || `In recognition of dedicated gospel ministry and distinguished ecclesiastical leadership.`,
      documents: [{ name: 'Candidate_Nomination_Dossier.pdf', type: 'PDF', size: '2.4 MB' }],
      status: 'Submitted',
      nominationDate: new Date().toISOString().slice(0, 10),
      reviewComments: 'Dossier received and indexed. Ready for Academic Senate review.'
    };

    onAddApplication(newApp);
    onLogAudit('Submitted New Honorary Nomination', `${appNo} (${newCandidateName})`);
    setNotification({
      message: `Nomination dossier for "${newCandidateName}" successfully registered with status "Submitted"!`,
      type: 'success'
    });
    setShowNewNomination(false);
    setSelectedAppId(newApp.id);
    setReviewComments(newApp.reviewComments || '');

    // Reset Form
    setNewCandidateName('');
    setNewEmail('');
    setNewPhone('');
    setNewTitle('');
    setNewOrg('');
    setNewRationale('');
    setNewCitations('');
    setTimeout(() => setNotification(null), 3500);
  };

  // Workflow Stages Visual Stepper Helper
  const getWorkflowStep = (status: HonoraryStatus) => {
    switch (status) {
      case 'Submitted':
        return 1;
      case 'Under Review':
        return 2;
      case 'Approved':
      case 'Rejected':
        return 3;
      case 'Awarded':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Academic Senate & Board of Regents Adjudication</span>
          </div>
          <h2 className="text-xl font-display font-black text-[#002366]">
            Honorary Applications & Approval Workflow
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Adjudicate honorary nominations with status tracking across Submitted, Under Review, Approved, and Rejected stages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewNomination(true)}
            className="px-3.5 py-2 rounded-xl bg-[#002366] hover:bg-[#001845] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>Nominate Candidate</span>
          </button>

          <button
            onClick={() => {
              const headers = ['Application Number', 'Candidate Name', 'Current Title', 'Organization', 'Country', 'Degree', 'Status', 'Cert Number', 'Comments'];
              const rows = filteredApps.map((a) => [
                a.applicationNumber,
                `"${a.candidateName}"`,
                `"${a.currentTitle}"`,
                `"${a.ministryOrganization}"`,
                a.country,
                `"${a.honoraryDegree}"`,
                a.status,
                `"${a.awardCertificateNumber || 'N/A'}"`,
                `"${(a.reviewComments || '').replace(/"/g, '""')}"`
              ]);
              const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
              const link = document.createElement('a');
              link.setAttribute('href', encodeURI(csvContent));
              link.setAttribute('download', `BIBU_Honorary_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              onLogAudit('Exported Honorary Applications CSV', `Count: ${filteredApps.length}`);
            }}
            className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
            title="Export to CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Real-time Notification Banner */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all shadow-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : notification.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-blue-50 border-blue-300 text-blue-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : notification.type === 'error' ? (
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Interactive Workflow Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setStatusFilter('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
            statusFilter === 'All'
              ? 'bg-[#002366] text-white border-[#002366] shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>All Dossiers</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilter === 'All' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {statusCounts.All}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('Submitted')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
            statusFilter === 'Submitted'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Submitted</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilter === 'Submitted' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'}`}>
            {statusCounts.Submitted}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('Under Review')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
            statusFilter === 'Under Review'
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
              : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Under Review</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilter === 'Under Review' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'}`}>
            {statusCounts['Under Review']}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('Approved')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
            statusFilter === 'Approved'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Approved</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilter === 'Approved' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'}`}>
            {statusCounts.Approved}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('Rejected')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
            statusFilter === 'Rejected'
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-white text-rose-800 border-rose-300 hover:bg-rose-50'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Rejected</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilter === 'Rejected' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-900'}`}>
            {statusCounts.Rejected}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('Awarded')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
            statusFilter === 'Awarded'
              ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
              : 'bg-white text-purple-800 border-purple-200 hover:bg-purple-50'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Awarded</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilter === 'Awarded' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-900'}`}>
            {statusCounts.Awarded}
          </span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate name, dossier #, degree, nation, or ministry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#C5A059]"
          />
        </div>
      </div>

      {/* Main Split Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dossiers List (Left 5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Nomination Dossiers ({filteredApps.length})</span>
            <span className="text-[11px] text-slate-500">Select candidate to adjudicate</span>
          </div>

          {filteredApps.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500 space-y-2">
              <Award className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-medium">No honorary applications match the selected status or query.</p>
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setSearchTerm('');
                }}
                className="text-[11px] text-[#002366] font-bold underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
              {filteredApps.map((app) => {
                const isSelected = selectedApp?.id === app.id;

                return (
                  <div
                    key={app.id}
                    onClick={() => handleSelectApp(app)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-amber-50/60 border-[#C5A059] shadow-sm ring-1 ring-[#C5A059]'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">
                            {app.applicationNumber}
                          </span>
                          <span className="text-[10px] text-slate-400">• {app.nominationDate}</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#002366] truncate mt-0.5">
                          {app.candidateName}
                        </h4>
                        <p className="text-[11px] text-slate-600 truncate">
                          {app.currentTitle} • {app.ministryOrganization}
                        </p>
                      </div>

                      <div className="shrink-0">{renderStatusBadge(app.status)}</div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-amber-900 truncate max-w-[210px]">
                        {app.honoraryDegree.split('(')[0]}
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{app.country}</span>
                      </span>
                    </div>

                    {/* Quick inline status switcher */}
                    <div className="mt-2 pt-2 border-t border-dashed border-slate-200 flex items-center justify-between text-[10px]" onClick={(e) => e.stopPropagation()}>
                      <span className="text-slate-400 font-mono">Quick Triage:</span>
                      <div className="flex items-center gap-1">
                        {app.status !== 'Under Review' && (
                          <button
                            onClick={() => handleQuickStatusChange(app, 'Under Review')}
                            className="px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold"
                            title="Quick transition to Under Review"
                          >
                            Review
                          </button>
                        )}
                        {app.status !== 'Approved' && (
                          <button
                            onClick={() => handleQuickStatusChange(app, 'Approved')}
                            className="px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold"
                            title="Quick transition to Approved"
                          >
                            Approve
                          </button>
                        )}
                        {app.status !== 'Rejected' && (
                          <button
                            onClick={() => handleQuickStatusChange(app, 'Rejected')}
                            className="px-1.5 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold"
                            title="Quick transition to Rejected"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detailed Dossier Inspector & Approval Workflow (Right 7 cols) */}
        <div className="lg:col-span-7">
          {selectedApp ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#C5A059] uppercase tracking-wider">
                      Candidate Dossier • {selectedApp.applicationNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      (Nominated {selectedApp.nominationDate})
                    </span>
                  </div>
                  <h3 className="text-xl font-display font-black text-[#002366] mt-0.5">
                    {selectedApp.candidateName}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {selectedApp.currentTitle} — {selectedApp.ministryOrganization}, {selectedApp.country}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setPrintModalApp(selectedApp)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print Citation</span>
                  </button>
                </div>
              </div>

              {/* INTERACTIVE WORKFLOW STEPPER PIPELINE */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    <span>Adjudication Lifecycle Pipeline</span>
                  </span>
                  <div>{renderStatusBadge(selectedApp.status, 'md')}</div>
                </div>

                {/* 4-Step Progress Track */}
                <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                  {/* Step 1: Submitted */}
                  <div
                    className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 ${
                      selectedApp.status === 'Submitted'
                        ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold ring-2 ring-blue-300'
                        : getWorkflowStep(selectedApp.status) > 1
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-white border">
                      {getWorkflowStep(selectedApp.status) > 1 ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        '1'
                      )}
                    </div>
                    <span className="text-[11px] font-medium leading-tight">Submitted</span>
                  </div>

                  {/* Step 2: Under Review */}
                  <div
                    className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 ${
                      selectedApp.status === 'Under Review'
                        ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold ring-2 ring-amber-300'
                        : getWorkflowStep(selectedApp.status) > 2
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-white border">
                      {getWorkflowStep(selectedApp.status) > 2 ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        '2'
                      )}
                    </div>
                    <span className="text-[11px] font-medium leading-tight">Under Review</span>
                  </div>

                  {/* Step 3: Decision (Approved or Rejected) */}
                  <div
                    className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 ${
                      selectedApp.status === 'Approved'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold ring-2 ring-emerald-300'
                        : selectedApp.status === 'Rejected'
                        ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold ring-2 ring-rose-300'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-white border">
                      {selectedApp.status === 'Approved' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : selectedApp.status === 'Rejected' ? (
                        <XCircle className="w-3 h-3 text-rose-600" />
                      ) : (
                        '3'
                      )}
                    </div>
                    <span className="text-[11px] font-medium leading-tight">
                      {selectedApp.status === 'Rejected' ? 'Rejected' : 'Approved'}
                    </span>
                  </div>

                  {/* Step 4: Convocation Awarded */}
                  <div
                    className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 ${
                      selectedApp.status === 'Awarded'
                        ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold ring-2 ring-purple-300'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-white border">
                      <Award className="w-3 h-3 text-purple-600" />
                    </div>
                    <span className="text-[11px] font-medium leading-tight">Conferred</span>
                  </div>
                </div>

                {/* Certificate Number Display */}
                {selectedApp.awardCertificateNumber && (
                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center justify-between text-xs">
                    <span className="text-emerald-800 font-medium">Official Award Certificate Issued:</span>
                    <span className="font-mono font-bold text-emerald-950 bg-white px-2 py-0.5 rounded border border-emerald-300">
                      {selectedApp.awardCertificateNumber}
                    </span>
                  </div>
                )}
              </div>

              {/* Nominated Degree & Pastoral Tenure Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Conferred Degree & Title:</span>
                  <span className="font-bold text-[#002366] text-sm block mt-0.5">
                    {selectedApp.honoraryDegree}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Category: {selectedApp.nominationCategory}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Tenure & Ministry Service:</span>
                  <span className="font-bold text-slate-800 text-sm block mt-0.5">
                    {selectedApp.ministryTenureYears} Years Pastoral Leadership
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Contact: {selectedApp.email} • {selectedApp.phone}
                  </span>
                </div>
              </div>

              {/* Pastoral Ministry Rationale */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Ministry Impact & Pastoral Rationale</span>
                </h4>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {selectedApp.rationale}
                </div>
              </div>

              {/* Official Academic Citation */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Proposed Convocation Academic Citation</span>
                </h4>
                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 text-xs text-amber-950 font-serif italic leading-relaxed">
                  "{selectedApp.citations}"
                </div>
              </div>

              {/* Supporting Dossier Documents */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Verified Supporting Documentation</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedApp.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs hover:border-slate-300"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-medium text-slate-800 truncate text-[11px]">{doc.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{doc.size}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ADMINISTRATOR COMMENT FIELD & COMMITTEE NOTES SECTION */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#002366]" />
                    <h4 className="text-xs font-bold text-[#002366] uppercase tracking-wider">
                      Administrator & Senate Committee Review Notes
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {reviewComments.length} / 1000 chars
                  </span>
                </div>

                <p className="text-[11px] text-slate-500">
                  Record official committee findings, commendations, or reasons for status modification. Comments are securely audited into the candidate's permanent record.
                </p>

                {/* Textarea for Administrator Comments */}
                <div className="relative">
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    placeholder="Enter official Senate committee deliberations, verified ecclesiastical tenure, or reason for decision..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C5A059] shadow-inner font-sans"
                  />
                </div>

                {/* Quick Comment Preset Templates */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                    Quick Preset Comments (Click to insert):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_COMMENT_TEMPLATES.map((tmpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setReviewComments(tmpl)}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 text-left transition-colors truncate max-w-xs"
                        title={tmpl}
                      >
                        {tmpl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action to Save Comments Only without status change */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSaveCommentsOnly}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5 text-slate-500" />
                    <span>Save Notes Only</span>
                  </button>
                </div>
              </div>

              {/* INTERACTIVE WORKFLOW APPROVAL ACTIONS */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#002366] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    <span>Execute Workflow Decision</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Current: <strong>{selectedApp.status}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Action 1: Move to Under Review */}
                  <button
                    onClick={() => {
                      if (selectedApp.status === 'Under Review') {
                        setNotification({ message: 'Nomination is already Under Review.', type: 'info' });
                        return;
                      }
                      executeStatusTransition('Under Review');
                    }}
                    disabled={selectedApp.status === 'Under Review'}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      selectedApp.status === 'Under Review'
                        ? 'bg-amber-50 border-amber-300 text-amber-900 opacity-60 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-xs hover:shadow-md'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Under Review</span>
                  </button>

                  {/* Action 2: Approve Nomination */}
                  <button
                    onClick={() => {
                      setConfirmModal({
                        targetStatus: 'Approved',
                        app: selectedApp
                      });
                    }}
                    disabled={selectedApp.status === 'Approved'}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      selectedApp.status === 'Approved'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 opacity-60 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-xs hover:shadow-md'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Nomination</span>
                  </button>

                  {/* Action 3: Reject Nomination */}
                  <button
                    onClick={() => {
                      setConfirmModal({
                        targetStatus: 'Rejected',
                        app: selectedApp
                      });
                    }}
                    disabled={selectedApp.status === 'Rejected'}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      selectedApp.status === 'Rejected'
                        ? 'bg-rose-50 border-rose-300 text-rose-900 opacity-60 cursor-not-allowed'
                        : 'bg-rose-600 hover:bg-rose-700 text-white border-rose-700 shadow-xs hover:shadow-md'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Nomination</span>
                  </button>

                  {/* Action 4: Mark as Conferred / Awarded */}
                  <button
                    onClick={() => {
                      executeStatusTransition('Awarded');
                    }}
                    disabled={selectedApp.status === 'Awarded'}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      selectedApp.status === 'Awarded'
                        ? 'bg-purple-50 border-purple-300 text-purple-900 opacity-60 cursor-not-allowed'
                        : 'bg-[#002366] hover:bg-[#001845] text-[#C5A059] border-[#C5A059] shadow-xs hover:shadow-md'
                    }`}
                  >
                    <Award className="w-4 h-4 text-[#C5A059]" />
                    <span>Confer (Awarded)</span>
                  </button>
                </div>

                {/* Reset to Submitted Option */}
                {selectedApp.status !== 'Submitted' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => executeStatusTransition('Submitted', 'Workflow reset to Submitted by administrator.')}
                      className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 hover:underline"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Re-open / Reset to Submitted</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <Award className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-[#002366]">No Candidate Selected</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select an honorary degree nomination dossier from the left list to review pastoral achievements, supporting attestations, and issue Senate approval.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Critical Transitions (Approve / Reject) */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {confirmModal.targetStatus === 'Approved' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600" />
                )}
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#002366]">
                  Confirm {confirmModal.targetStatus} Decision
                </h3>
              </div>
              <button
                onClick={() => setConfirmModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                You are about to change the adjudication status for{' '}
                <strong className="text-[#002366]">{confirmModal.app.candidateName}</strong> to{' '}
                <strong className={confirmModal.targetStatus === 'Approved' ? 'text-emerald-700' : 'text-rose-700'}>
                  {confirmModal.targetStatus}
                </strong>
                .
              </p>

              {confirmModal.targetStatus === 'Approved' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Conferral Certificate Number:
                  </label>
                  <input
                    type="text"
                    value={customCertNo || `BIBU-HON-2026-${Date.now().toString().slice(-4)}`}
                    onChange={(e) => setCustomCertNo(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono text-xs bg-slate-50"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Administrator Review Notes / Rationale:
                </label>
                <textarea
                  rows={3}
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder={
                    confirmModal.targetStatus === 'Approved'
                      ? 'Approved upon Academic Senate recommendation...'
                      : 'Please provide justification for rejection...'
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  executeStatusTransition(
                    confirmModal.targetStatus,
                    reviewComments,
                    confirmModal.targetStatus === 'Approved' ? customCertNo : undefined
                  )
                }
                className={`px-4 py-1.5 rounded-lg text-white font-bold text-xs shadow-xs ${
                  confirmModal.targetStatus === 'Approved'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {confirmModal.targetStatus}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Nomination Dossier Modal */}
      {showNewNomination && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#002366]">
                  Submit New Honorary Degree Nomination
                </h3>
              </div>
              <button
                onClick={() => setShowNewNomination(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNomination} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Candidate Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Archbishop Paul K. Ndungu"
                    value={newCandidateName}
                    onChange={(e) => setNewCandidateName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ecclesiastical Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Presiding Bishop & Senior Overseer"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="candidate@ministry.org"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telephone</label>
                  <input
                    type="text"
                    placeholder="+1 (602) 555-0100"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ministry Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Assemblies of Fellowship International"
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Degree Conferred</label>
                  <select
                    value={newDegree}
                    onChange={(e) => setNewDegree(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Doctor of Divinity (D.D., Honoris Causa)">Doctor of Divinity (D.D.)</option>
                    <option value="Doctor of Humane Letters (D.H.L., Honoris Causa)">Doctor of Humane Letters (D.H.L.)</option>
                    <option value="Doctor of Sacred Theology (S.T.D., Honoris Causa)">Doctor of Sacred Theology (S.T.D.)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Years in Pastoral Service</label>
                  <input
                    type="number"
                    min={10}
                    max={60}
                    value={newTenure}
                    onChange={(e) => setNewTenure(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ministry Rationale & Impact</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail ecclesiastical service, church planting record, humanitarian efforts, and pastoral impact..."
                  value={newRationale}
                  onChange={(e) => setNewRationale(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Proposed Academic Citation</label>
                <textarea
                  rows={2}
                  placeholder="In recognition of exemplary commitment to the Gospel of Jesus Christ..."
                  value={newCitations}
                  onChange={(e) => setNewCitations(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewNomination(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#002366] text-[#C5A059] font-bold uppercase tracking-wider"
                >
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Citation & Award Letter Modal */}
      {printModalApp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-4 border-[#C5A059] max-w-2xl w-full p-8 space-y-6 shadow-2xl relative text-center">
            <button
              onClick={() => setPrintModalApp(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 print:hidden"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-2 border-b-2 border-slate-200 pb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C5A059]">
                Breakthrough International Bible University • Phoenix, AZ
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#002366]">
                ACADEMIC SENATE & CHANCELLOR'S CITATION
              </h2>
              <p className="text-xs text-slate-500 font-serif italic">
                Office of the University Registrar • Conferral of Honorary Credential
              </p>
            </div>

            <div className="space-y-4 py-2 font-serif text-slate-800 text-sm leading-relaxed">
              <p>Be it known to all that the Academic Senate of Breakthrough International Bible University, upon the recommendation of the Board of Regents, does hereby confer upon:</p>

              <h3 className="text-2xl font-bold text-[#002366] font-display">
                {printModalApp.candidateName}
              </h3>

              <p className="text-xs text-slate-600 font-sans">
                {printModalApp.currentTitle} • {printModalApp.ministryOrganization}
              </p>

              <div className="py-2">
                <span className="text-xs text-slate-500 font-sans block uppercase tracking-wider font-bold">The Degree of:</span>
                <span className="text-xl font-bold text-amber-900 block font-serif mt-1">
                  {printModalApp.honoraryDegree}
                </span>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 italic text-xs text-slate-700">
                "{printModalApp.citations}"
              </div>

              <p className="text-xs text-slate-500 font-sans">
                Given under the Hand and Official Seal of the University at Phoenix, Arizona, United States of America.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 text-xs font-serif">
              <div>
                <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-900">
                  Dr. Michael C. Sterling, Th.D., D.Min.
                </div>
                <span className="text-[10px] text-slate-500 font-sans">President & Chancellor</span>
              </div>
              <div>
                <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-900">
                  Rev. Dr. Sarah M. Jenkins, Th.D.
                </div>
                <span className="text-[10px] text-slate-500 font-sans">University Registrar</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-[#002366] text-[#C5A059] font-bold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Citation</span>
              </button>
              <button
                onClick={() => setPrintModalApp(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
