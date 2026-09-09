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
  FileCheck,
  Send,
  Upload,
  AlertCircle
} from 'lucide-react';
import { HonoraryApplication, HonoraryStatus } from '../../../types/admin';

interface HonoraryApplicationsManagerProps {
  applications: HonoraryApplication[];
  onUpdateStatus: (id: string, status: HonoraryStatus, comments?: string, certNo?: string) => void;
  onAddApplication: (app: HonoraryApplication) => void;
  onLogAudit: (action: string, record: string, details?: string) => void;
}

export const HonoraryApplicationsManager: React.FC<HonoraryApplicationsManagerProps> = ({
  applications,
  onUpdateStatus,
  onAddApplication,
  onLogAudit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | HonoraryStatus>('All');
  const [selectedApp, setSelectedApp] = useState<HonoraryApplication | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewComments, setReviewComments] = useState('');
  const [printModalApp, setPrintModalApp] = useState<HonoraryApplication | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

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

  const handleDecision = (status: HonoraryStatus) => {
    if (!selectedApp) return;

    let certNo: string | undefined = undefined;
    if (status === 'Approved' || status === 'Awarded') {
      certNo = `BIBU-HON-${Date.now().toString().slice(-4)}`;
    }

    onUpdateStatus(selectedApp.id, status, reviewComments, certNo);
    onLogAudit(
      `Updated Honorary Nomination Status to ${status}`,
      `${selectedApp.applicationNumber} (${selectedApp.candidateName})`,
      reviewComments || `Status set to ${status}`
    );

    setNotification(`Nomination for ${selectedApp.candidateName} updated to "${status}".`);
    setSelectedApp(prev => prev ? { ...prev, status, reviewComments, awardCertificateNumber: certNo } : null);
    setIsReviewing(false);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleExportCSV = () => {
    const headers = ['Application Number', 'Candidate Name', 'Current Title', 'Organization', 'Country', 'Degree', 'Status', 'Nomination Date'];
    const rows = filteredApps.map(a => [
      a.applicationNumber,
      `"${a.candidateName}"`,
      `"${a.currentTitle}"`,
      `"${a.ministryOrganization}"`,
      a.country,
      `"${a.honoraryDegree}"`,
      a.status,
      a.nominationDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BIBU_Honorary_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onLogAudit('Exported Honorary Applications CSV', `Count: ${filteredApps.length}`);
  };

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
      achievements: [newRationale.slice(0, 80)],
      citations: newCitations || `In recognition of dedicated gospel ministry and distinguished leadership.`,
      documents: [{ name: 'Candidate_Nomination_Dossier.pdf', type: 'PDF', size: '2.4 MB' }],
      status: 'Submitted',
      nominationDate: new Date().toISOString().slice(0, 10)
    };

    onAddApplication(newApp);
    onLogAudit('Submitted New Honorary Nomination', `${appNo} (${newCandidateName})`);
    setNotification(`Nomination dossier for "${newCandidateName}" successfully registered!`);
    setShowNewNomination(false);
    // Reset form
    setNewCandidateName('');
    setNewEmail('');
    setNewPhone('');
    setNewTitle('');
    setNewOrg('');
    setNewRationale('');
    setNewCitations('');
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Senate Adjudication & Honorary Doctorates Control</span>
          </div>
          <h2 className="text-xl font-display font-black text-[#002366]">
            Honorary Applications & Awards Adjudication
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Adjudicate nominations for Doctor of Divinity (D.D.), Doctor of Humane Letters (D.H.L.), and Doctor of Sacred Theology (S.T.D.).
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
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
            title="Export to CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate name, dossier #, degree, nation, or ministry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700 w-full sm:w-auto"
          >
            <option value="All">All Statuses ({applications.length})</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Awarded">Awarded</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Content: Split Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dossiers List (Left) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Nomination Dossiers ({filteredApps.length})</span>
            <span className="text-[11px] text-slate-500">Select to inspect</span>
          </div>

          {filteredApps.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              No honorary applications match the selected criteria.
            </div>
          ) : (
            filteredApps.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              const statusColors: Record<HonoraryStatus, string> = {
                Submitted: 'bg-blue-100 text-blue-800 border-blue-200',
                'Under Review': 'bg-amber-100 text-amber-800 border-amber-200',
                Approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                Awarded: 'bg-purple-100 text-purple-800 border-purple-200',
                Rejected: 'bg-rose-100 text-rose-800 border-rose-200'
              };

              return (
                <div
                  key={app.id}
                  onClick={() => {
                    setSelectedApp(app);
                    setIsReviewing(false);
                    setReviewComments(app.reviewComments || '');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-amber-50/50 border-[#C5A059] shadow-sm ring-1 ring-[#C5A059]'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {app.applicationNumber} • {app.nominationDate}
                      </span>
                      <h4 className="text-xs font-bold text-[#002366] truncate mt-0.5">
                        {app.candidateName}
                      </h4>
                      <p className="text-[11px] text-slate-600 truncate">
                        {app.currentTitle}
                      </p>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-amber-800 truncate max-w-[200px]">
                      {app.honoraryDegree.split('(')[0]}
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{app.country}</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detailed Dossier Inspector (Right) */}
        <div className="lg:col-span-7">
          {selectedApp ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#C5A059] uppercase tracking-wider block">
                    Candidate Dossier • {selectedApp.applicationNumber}
                  </span>
                  <h3 className="text-lg font-display font-black text-[#002366]">
                    {selectedApp.candidateName}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {selectedApp.currentTitle} — {selectedApp.ministryOrganization}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPrintModalApp(selectedApp)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print Citation Letter</span>
                  </button>
                </div>
              </div>

              {/* Status and Proposed Degree Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Nominated Degree:</span>
                  <span className="font-bold text-[#002366] text-sm block mt-0.5">
                    {selectedApp.honoraryDegree}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Category: {selectedApp.nominationCategory}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Adjudication Status:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-xs uppercase px-2.5 py-0.5 rounded-full bg-[#002366] text-white">
                      {selectedApp.status}
                    </span>
                    {selectedApp.awardCertificateNumber && (
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Cert: {selectedApp.awardCertificateNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Ministry Tenure & Rationale */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Ministry Tenure & Rationale ({selectedApp.ministryTenureYears} Years in Service)</span>
                </h4>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {selectedApp.rationale}
                </div>
              </div>

              {/* Official Academic Citation */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Proposed Convocation Academic Citation</span>
                </h4>
                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 text-xs text-amber-950 font-serif italic leading-relaxed">
                  "{selectedApp.citations}"
                </div>
              </div>

              {/* Supporting Evidence Documents */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Verified Supporting Documentation</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedApp.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs"
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

              {/* Adjudication Decision Controls */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-[#002366] uppercase tracking-wider">
                  Senate Adjudication Action:
                </h4>

                <div className="space-y-2">
                  <label className="block text-[11px] text-slate-500 font-medium">
                    Senate Committee Review Notes & Comments:
                  </label>
                  <textarea
                    rows={2}
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    placeholder="Enter review findings, committee commendations, or reasons for status change..."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#C5A059]"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleDecision('Approved')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Nomination</span>
                  </button>

                  <button
                    onClick={() => handleDecision('Awarded')}
                    className="px-3.5 py-2 rounded-xl bg-[#002366] hover:bg-[#001845] text-[#C5A059] font-bold text-xs flex items-center gap-1.5 border border-[#C5A059] transition-colors shadow-xs"
                  >
                    <Award className="w-4 h-4 text-[#C5A059]" />
                    <span>Mark as Awarded (Convocation)</span>
                  </button>

                  <button
                    onClick={() => handleDecision('Under Review')}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Mark Under Review</span>
                  </button>

                  <button
                    onClick={() => handleDecision('Rejected')}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Nomination</span>
                  </button>
                </div>
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
