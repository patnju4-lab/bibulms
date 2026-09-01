import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, Clock, FileText, Search, UserCheck, ShieldCheck, AlertCircle, DollarSign, BookOpen, Printer, ArrowUpRight, Check, X } from 'lucide-react';
import { RPLApplicationRecord, RPLCompetencyItem, RPLStatus, RPLAssessmentMethod } from '../../types/rpl';

export const RplAdminManager: React.FC = () => {
  const { rplRecords, rplProgramRules, assessRPLCompetency, scheduleRPLInterview, finalizeRPLAssessment, syncRPLToTranscript } = useApp();

  const [selectedAppId, setSelectedAppId] = useState<string>(rplRecords[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'rules' | 'verification' | 'analytics'>('applications');

  // Assessment Modal / Drawer state
  const [assessmentNotes, setAssessmentNotes] = useState('');
  const [selectedMethods, setSelectedMethods] = useState<RPLAssessmentMethod[]>(['Portfolio assessment', 'Structured interview']);
  const [syncMessage, setSyncMessage] = useState<{ id: string; msg: string } | null>(null);

  const selectedRecord = rplRecords.find(r => r.id === selectedAppId) || rplRecords[0];

  const filteredRecords = rplRecords.filter(r => {
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchesSearch = r.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.desiredProgramName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSync = (rplId: string) => {
    const res = syncRPLToTranscript(rplId);
    setSyncMessage({ id: rplId, msg: res.message });
    setTimeout(() => setSyncMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#C5A059] uppercase tracking-wider">
            <Award className="w-4 h-4 text-[#C5A059]" />
            <span>Institutional Recognition of Prior Learning (RPL)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[#002366] mt-1">
            Academic Credit for Ministry Experience — Assessor Portal
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Evaluate ministerial portfolios, verify evidence, conduct competency mapping, and confer academic credits under BIBU policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('applications')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'applications' ? 'bg-[#002366] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Applications ({rplRecords.length})
          </button>
          <button
            onClick={() => setActiveSubTab('rules')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'rules' ? 'bg-[#002366] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Program Credit Rules
          </button>
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'analytics' ? 'bg-[#002366] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Analytics & Reports
          </button>
        </div>
      </div>

      {activeSubTab === 'applications' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Applications List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search applicant name, number, program..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['All', 'Submitted', 'Under Assessment', 'Credit Approved', 'Credit Partially Approved', 'Appeal'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold whitespace-nowrap transition-all ${filterStatus === st ? 'bg-[#C5A059] text-[#002366]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
              {filteredRecords.map((rec) => {
                const isSelected = rec.id === selectedRecord?.id;
                return (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedAppId(rec.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${isSelected ? 'border-[#002366] bg-[#002366]/5 shadow-sm ring-1 ring-[#002366]' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#002366]">{rec.applicationNumber}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        rec.status.includes('Approved') ? 'bg-emerald-100 text-emerald-800' :
                        rec.status.includes('Assessment') ? 'bg-amber-100 text-amber-800' :
                        rec.status === 'Appeal' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {rec.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-display font-bold text-[#002366]">{rec.applicantName}</h4>
                      <p className="text-xs text-slate-500">{rec.currentRole} • {rec.churchAffiliation}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600">
                      <span>Program: <strong className="text-slate-900">{rec.desiredProgramName}</strong></span>
                      <span className="font-bold text-[#C5A059]">{rec.approvedCredits} / {rec.requestedCredits} Credits</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Assessor Workspace */}
          <div className="lg:col-span-7 space-y-6">
            {selectedRecord ? (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
                {/* Top Dossier Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase">
                      <span>Verification Code: <strong className="font-mono text-[#002366]">{selectedRecord.verificationCode}</strong></span>
                      <span>•</span>
                      <span>Submitted: {selectedRecord.submissionDate}</span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-[#002366] mt-0.5">
                      {selectedRecord.applicantName}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {selectedRecord.currentRole} at {selectedRecord.churchAffiliation} ({selectedRecord.country}) • {selectedRecord.yearsInMinistry} Years Experience
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSync(selectedRecord.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sync Credits to Transcript</span>
                    </button>
                  </div>
                </div>

                {syncMessage && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in">
                    {syncMessage.msg}
                  </div>
                )}

                {/* Ministry Experience Positions */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-[#002366] uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#C5A059]" />
                    <span>Ministry History & Leadership Scope</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedRecord.ministryPositions.map((pos) => (
                      <div key={pos.id} className="p-3.5 rounded-lg bg-[#F8F9FB] border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <strong className="text-[#002366]">{pos.positionTitle} — {pos.organization}</strong>
                          <span className="text-slate-500">{pos.startDate} to {pos.endDate}</span>
                        </div>
                        <p className="text-xs text-slate-600"><strong>Responsibilities:</strong> {pos.responsibilities}</p>
                        <p className="text-xs text-slate-500"><strong>Scope / People Served:</strong> {pos.peopleServed} | {pos.leadershipScope}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competency Assessment Matrix */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-[#002366] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    <span>Competency & Learning Outcome Assessment Matrix</span>
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#002366] text-white">
                          <th className="p-2.5 font-bold">Course / Learning Outcome</th>
                          <th className="p-2.5 font-bold">Self-Rating</th>
                          <th className="p-2.5 font-bold">Assessor Decision</th>
                          <th className="p-2.5 font-bold">Credits</th>
                          <th className="p-2.5 font-bold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {selectedRecord.competencies.map((comp) => (
                          <tr key={comp.id} className="hover:bg-slate-50">
                            <td className="p-2.5">
                              <div className="font-bold text-[#002366]">{comp.courseCode}: {comp.courseTitle}</div>
                              <div className="text-[11px] text-slate-500">{comp.learningOutcome}</div>
                              {comp.applicantNarrative && (
                                <div className="text-[10px] text-slate-600 italic mt-0.5">"{comp.applicantNarrative}"</div>
                              )}
                            </td>
                            <td className="p-2.5 font-semibold text-slate-700">
                              Level {comp.selfRating}/5
                            </td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                comp.assessorDecision === 'Credit Awarded' ? 'bg-emerald-100 text-emerald-800' :
                                comp.assessorDecision === 'Partial Credit' ? 'bg-blue-100 text-blue-800' :
                                comp.assessorDecision === 'Challenge Assessment Required' ? 'bg-purple-100 text-purple-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {comp.assessorDecision}
                              </span>
                            </td>
                            <td className="p-2.5 font-bold text-[#C5A059]">
                              {comp.awardedCredits || 0} / {comp.creditValue} Cr
                            </td>
                            <td className="p-2.5 text-right space-x-1">
                              <button
                                onClick={() => assessRPLCompetency(selectedRecord.id, comp.id, 'Credit Awarded', comp.creditValue, 'Verified by Faculty Assessor')}
                                className="px-2 py-1 rounded bg-emerald-700 text-white font-bold text-[10px]"
                                title="Award Full Credit"
                              >
                                Award
                              </button>
                              <button
                                onClick={() => assessRPLCompetency(selectedRecord.id, comp.id, 'Challenge Assessment Required', 0, 'Mandatory Challenge Exam Required')}
                                className="px-2 py-1 rounded bg-amber-600 text-white font-bold text-[10px]"
                                title="Require Challenge Exam"
                              >
                                Challenge
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Evidence Portfolio Items */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-[#002366] uppercase tracking-wider">
                    Submitted Evidence Items ({selectedRecord.evidenceList.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedRecord.evidenceList.map((ev) => (
                      <div key={ev.id} className="p-3 rounded-lg bg-white border border-slate-200 space-y-1 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#002366]">{ev.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">{ev.classification}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{ev.description}</p>
                        <div className="text-[10px] text-slate-400 font-mono">File: {ev.fileName || 'Verified Document'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Finalize Assessment Actions */}
                <div className="p-4 rounded-xl bg-[#F8F9FB] border border-slate-200 space-y-3">
                  <h4 className="text-xs font-black text-[#002366] uppercase tracking-wider">
                    Finalize Assessor Recommendation & Status
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => finalizeRPLAssessment(selectedRecord.id, 'Credit Approved', selectedRecord.competencies.reduce((s, c) => s + (c.awardedCredits || 0), 3), 'Approved by Academic Senate and Assessor Review.', ['Portfolio assessment', 'Structured interview'])}
                      className="w-full py-2.5 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider shadow"
                    >
                      Approve All Evaluated Credits
                    </button>
                    <button
                      onClick={() => finalizeRPLAssessment(selectedRecord.id, 'Credit Not Approved', 0, 'Insufficient theological documentation provided for credit exemption.', ['Portfolio assessment'])}
                      className="w-full py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider shadow"
                    >
                      Reject Portfolio
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 bg-white rounded-xl border border-slate-200 text-center text-slate-500">
                Select an RPL application from the list to begin assessor evaluation.
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'rules' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-display font-bold text-[#002366]">Program Credit Rules & RPL Limits</h3>
              <p className="text-xs text-slate-600">Configure maximum RPL percentages, residency requirements, and fees per academic program.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rplProgramRules.map((rule) => (
              <div key={rule.programId} className="p-5 rounded-xl border border-slate-200 bg-[#F8F9FB] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-display font-bold text-[#002366]">{rule.programName}</h4>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-[#C5A059]/20 text-[#002366] uppercase">{rule.academicLevel}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <div>Total Credits: <strong className="text-slate-900">{rule.totalProgramCredits}</strong></div>
                  <div>Max RPL Limit: <strong className="text-emerald-700">{rule.maxRPLCredits} Cr ({rule.maxRPLPercentage}%)</strong></div>
                  <div>Residency Required: <strong className="text-slate-900">{rule.residencyCreditsRequired} Cr</strong></div>
                  <div>Assessment Fee: <strong className="text-[#C5A059]">${rule.perCreditAssessmentFeeUSD}/Cr</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'analytics' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <h3 className="text-lg font-display font-bold text-[#002366]">RPL Institutional Analytics & Reports</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#002366] text-white space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-300">Total Portfolios Processed</div>
              <div className="text-3xl font-black font-display text-[#C5A059]">{rplRecords.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-800 text-white space-y-1">
              <div className="text-[10px] uppercase font-bold text-emerald-200">Total Academic Credits Conferred</div>
              <div className="text-3xl font-black font-display text-white">
                {rplRecords.reduce((s, r) => s + r.approvedCredits, 0)} Cr
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-300">Average Assessment Turnaround</div>
              <div className="text-3xl font-black font-display text-[#C5A059]">6.4 Days</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
