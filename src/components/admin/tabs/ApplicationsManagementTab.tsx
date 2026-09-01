import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileCheck2, CheckCircle2, XCircle, Clock, Search, Trash2, Award, User, Mail, MapPin } from 'lucide-react';
import { Application } from '../../../types';

export const ApplicationsManagementTab: React.FC = () => {
  const { applications, updateApplicationStatus, deleteApplication, updateApplicationRplCredits } = useApp();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [remarks, setRemarks] = useState('');
  const [rplCredits, setRplCredits] = useState<number>(30);
  const [filterType, setFilterType] = useState<'all' | 'Admissions' | 'RPL'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const handleDecision = (appId: string, status: Application['status']) => {
    updateApplicationStatus(appId, status, remarks);
    setNotification(`Application status changed to "${status}".`);
    if (selectedApp?.id === appId) {
      setSelectedApp((prev) => prev ? { ...prev, status, reviewNotes: remarks } : null);
    }
    setTimeout(() => setNotification(null), 3500);
  };

  const handleGrantCredits = (appId: string) => {
    updateApplicationRplCredits(appId, rplCredits);
    setNotification(`Granted ${rplCredits} RPL Credit Hours to applicant!`);
    if (selectedApp?.id === appId) {
      setSelectedApp((prev) => prev ? { ...prev, rplCreditsGranted: rplCredits } : null);
    }
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredApps = applications.filter((a) => {
    const matchesType = filterType === 'all' || a.type === filterType;
    const matchesSearch = a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.country.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#002366] flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#C5A059]" />
            <span>Admissions & RPL Applications Review ({applications.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review incoming student applications, assess ministerial portfolio for RPL credit grants, and approve enrollment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="all">All Application Types</option>
            <option value="Admissions">Degree Admissions</option>
            <option value="RPL">RPL Prior Learning</option>
          </select>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by applicant name, email, nation, or program..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white"
        />
      </div>

      {/* Split View: Application List & Dossier Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Incoming Applications:
          </div>

          {filteredApps.map((app) => {
            const isSelected = selectedApp?.id === app.id;
            return (
              <div
                key={app.id}
                onClick={() => {
                  setSelectedApp(app);
                  setRemarks(app.reviewNotes || '');
                  setRplCredits(app.rplCreditsGranted || 30);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#002366] text-white border-[#C5A059] shadow-md'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-[#002366]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    app.type === 'RPL' ? 'bg-[#C5A059] text-[#002366]' : 'bg-blue-100 text-blue-900'
                  }`}>
                    {app.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                    app.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                    'bg-amber-100 text-amber-900'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="font-bold text-xs mt-2">{app.fullName}</div>
                <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                  {app.programName}
                </div>
                <div className={`text-[10px] mt-2 flex items-center justify-between ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  <span>{app.country} • {app.phone}</span>
                  <span>{app.submittedDate}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dossier Inspector */}
        <div className="lg:col-span-7">
          {selectedApp ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#002366] text-xs font-bold uppercase">
                    {selectedApp.type} Application
                  </span>
                  <h3 className="text-lg font-bold text-[#002366] mt-1">{selectedApp.fullName}</h3>
                  <p className="text-xs text-slate-500">{selectedApp.programName}</p>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm(`Delete application for ${selectedApp.fullName}?`)) {
                      deleteApplication(selectedApp.id);
                      setSelectedApp(null);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Delete Application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Applicant Dossier Fields */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Email Address</div>
                  <div className="font-semibold text-slate-800">{selectedApp.email}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Location & Country</div>
                  <div className="font-semibold text-slate-800">{selectedApp.country}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Ministry Experience</div>
                  <div className="font-semibold text-slate-800">{selectedApp.ministryExperienceYears || 5} Years</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Previous Education</div>
                  <div className="font-semibold text-slate-800">{selectedApp.highestEducation || 'Diploma in Ministry'}</div>
                </div>

                <div className="col-span-2 p-3 bg-slate-50 rounded-lg space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Ministry Calling & Testimonial</div>
                  <div className="text-slate-700 leading-relaxed italic">
                    "{selectedApp.statementOfFaith || selectedApp.ministryBio || 'Called to equip the local body of Christ with sound biblical doctrine and pastoral leadership.'}"
                  </div>
                </div>
              </div>

              {/* RPL Credit Hours Section if RPL */}
              {selectedApp.type === 'RPL' && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                  <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Recognition of Prior Learning (RPL) Credit Assessment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={rplCredits}
                      onChange={(e) => setRplCredits(Number(e.target.value))}
                      className="w-28 px-3 py-1.5 text-xs rounded border border-amber-300 bg-white font-bold"
                    />
                    <button
                      onClick={() => handleGrantCredits(selectedApp.id)}
                      className="px-3 py-1.5 bg-amber-600 text-white rounded text-xs font-bold hover:bg-amber-700"
                    >
                      Grant & Save Credits
                    </button>
                    <span className="text-xs text-amber-800 font-medium">
                      Current Grant: {selectedApp.rplCreditsGranted || 0} Credits
                    </span>
                  </div>
                </div>
              )}

              {/* Decision Section */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Chancellor / Admissions Committee Notes:
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Official comments, conditions for acceptance, or transfer remarks..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleDecision(selectedApp.id, 'Approved')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Accept Student</span>
                  </button>

                  <button
                    onClick={() => handleDecision(selectedApp.id, 'Conditionally Accepted')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Conditional Acceptance</span>
                  </button>

                  <button
                    onClick={() => handleDecision(selectedApp.id, 'Rejected')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Decline Application</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
              <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-600">Select an application to inspect the candidate dossier</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
