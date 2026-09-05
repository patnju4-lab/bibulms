import React, { useState } from 'react';
import {
  GraduationCandidate,
  DepartmentClearanceStatus,
  DepartmentClearanceRecord
} from '../../types/graduation';
import { useApp } from '../../context/AppContext';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Award,
  CreditCard,
  UserCheck,
  DollarSign,
  Building,
  GraduationCap,
  FileCheck2,
  Sparkles,
  BookOpen,
  Calendar,
  Share2
} from 'lucide-react';
import { AlumniDigitalCard } from './AlumniDigitalCard';

interface GraduationCandidateModalProps {
  candidate: GraduationCandidate;
  onClose: () => void;
  onUpdateCandidate: (updated: GraduationCandidate) => void;
}

export const GraduationCandidateModal: React.FC<GraduationCandidateModalProps> = ({
  candidate,
  onClose,
  onUpdateCandidate
}) => {
  const { currentUser, conferCandidateToGraduate, updateDepartmentClearance } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'clearance' | 'certificate'>('clearance');
  const [showAlumniCard, setShowAlumniCard] = useState(false);
  const [conferSuccess, setConferSuccess] = useState<string | null>(null);

  // Departments list for clearance
  const departments: { key: keyof GraduationCandidate['clearances']; label: string; icon: any }[] = [
    { key: 'academic', label: '1. Academic Department', icon: BookOpen },
    { key: 'examination', label: '2. Examination Department', icon: FileCheck2 },
    { key: 'finance', label: '3. Finance / Bursar Department', icon: DollarSign },
    { key: 'library', label: '4. Digital Theological Library', icon: Building },
    { key: 'studentAffairs', label: '5. Student Affairs & Conduct', icon: UserCheck },
    { key: 'registrar', label: '6. University Registrar Approval', icon: ShieldCheck },
    { key: 'graduationOffice', label: '7. Graduation Convocation Office', icon: GraduationCap }
  ];

  const handleClearanceChange = (
    deptKey: keyof GraduationCandidate['clearances'],
    newStatus: DepartmentClearanceStatus,
    notes?: string
  ) => {
    updateDepartmentClearance(candidate.id, deptKey, {
      status: newStatus,
      clearedBy: currentUser.name,
      clearedDate: new Date().toISOString().split('T')[0],
      notes: notes || `Updated to ${newStatus} by ${currentUser.name} (${currentUser.role})`
    });
  };

  const handleConferDegree = () => {
    const result = conferCandidateToGraduate(candidate.id);
    setConferSuccess(
      `Conferred! Converted to confirmed graduate, issued Certificate ${result.certificate.certificateNumber}, and registered to BIBU Global Alumni Database.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 my-8">
        {/* Modal Header */}
        <div className="bg-[#002366] text-white px-6 py-5 flex items-center justify-between border-b-4 border-[#C5A059]">
          <div className="flex items-center gap-3">
            <img
              src={candidate.profilePhoto}
              alt={candidate.fullName}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#C5A059] shadow-sm"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#C5A059] text-[10px] font-black uppercase tracking-wider">
                <GraduationCap className="w-3 h-3" />
                <span>Graduation Candidate Dossier</span>
              </div>
              <h2 className="text-lg font-bold font-display text-white">{candidate.fullName}</h2>
              <div className="text-xs text-slate-300 font-mono">
                Student ID: {candidate.studentId} • Admission: {candidate.admissionNumber}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Subtabs */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('clearance')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'clearance'
                ? 'border-[#002366] text-[#002366] bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Digital Clearance ({candidate.clearanceProgress}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'profile'
                ? 'border-[#002366] text-[#002366] bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-[#002366]" />
            <span>Graduate Profile & Ministry</span>
          </button>

          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'certificate'
                ? 'border-[#002366] text-[#002366] bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-[#C5A059]" />
            <span>Conferment & Certificate</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {conferSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{conferSuccess}</span>
            </div>
          )}

          {/* TAB 1: 7-DEPARTMENT DIGITAL CLEARANCE WORKFLOW */}
          {activeTab === 'clearance' && (
            <div className="space-y-6">
              {/* Clearance Summary Header */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-amber-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#002366]">
                    Graduation Eligibility Status
                  </div>
                  <div className="text-xl font-black font-display text-[#002366] flex items-center gap-2">
                    <span>{candidate.status}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#002366] text-[#C5A059] font-mono">
                      {candidate.clearanceProgress}% Complete
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Ceremony: <strong>{candidate.ceremonyNumber || '15th Congregation 2026'}</strong>
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="w-full sm:w-48 space-y-1 text-right">
                  <div className="text-[11px] font-bold text-slate-700">Clearance Velocity</div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden border border-slate-300">
                    <div
                      className={`h-full transition-all rounded-full ${
                        candidate.clearanceProgress === 100
                          ? 'bg-emerald-500'
                          : candidate.clearanceProgress > 50
                          ? 'bg-[#002366]'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${candidate.clearanceProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Graduation Fee Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Graduation & Gown Fee Status</div>
                    <div className="text-[11px] text-slate-500">
                      Standard fee: ${candidate.graduationFeeAmount} | Paid: ${candidate.graduationFeePaid}
                    </div>
                  </div>
                </div>

                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      candidate.graduationFeeStatus === 'Paid' || candidate.graduationFeeStatus === 'Waived'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {candidate.graduationFeeStatus}
                  </span>
                </div>
              </div>

              {/* 7 Departments Matrix */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Official 7-Department Institutional Clearance Matrix:
                </div>

                <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  {departments.map((dept) => {
                    const record = candidate.clearances[dept.key];
                    const Icon = dept.icon;

                    return (
                      <div key={dept.key} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-blue-50 text-[#002366] flex-shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{dept.label}</div>
                            {record.clearedBy && (
                              <div className="text-[10px] text-slate-500">
                                Cleared by: <strong>{record.clearedBy}</strong> on {record.clearedDate}
                              </div>
                            )}
                            {record.notes && (
                              <div className="text-[10px] text-slate-600 italic mt-0.5">"{record.notes}"</div>
                            )}
                          </div>
                        </div>

                        {/* Status Switcher */}
                        <div className="flex items-center gap-2 pl-11 sm:pl-0">
                          <select
                            value={record.status}
                            onChange={(e) =>
                              handleClearanceChange(dept.key, e.target.value as DepartmentClearanceStatus)
                            }
                            className={`text-xs font-bold rounded-lg px-3 py-1.5 border focus:outline-none focus:ring-1 focus:ring-[#002366] ${
                              record.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : record.status === 'Pending'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : record.status === 'Rejected'
                                ? 'bg-rose-50 text-rose-800 border-rose-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            <option value="Completed">✓ Completed</option>
                            <option value="Pending">⏳ Pending</option>
                            <option value="Not Required">⚪ Not Required</option>
                            <option value="Rejected">✕ Rejected</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GRADUATE PROFILE & MINISTRY DETAILS */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Academic Award & Degree</div>
                  <div className="text-sm font-bold text-[#002366]">{candidate.programName}</div>
                  <div className="text-xs text-slate-600">{candidate.schoolName}</div>
                  <div className="text-xs text-[#C5A059] font-semibold mt-1">
                    Specialization: {candidate.specialization || 'General Theological Studies'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Scholastic Standing</div>
                  <div className="text-sm font-bold text-slate-900">
                    Cumulative GPA: <span className="text-[#002366] font-mono">{candidate.finalGpa.toFixed(2)}</span> / 4.00
                  </div>
                  <div className="text-xs text-emerald-700 font-bold">
                    Class Standing: {candidate.academicHonors || 'Conferred with Honours'}
                  </div>
                  <div className="text-xs text-slate-500">Study Mode: {candidate.studyMode}</div>
                </div>
              </div>

              {/* Ministry & Bio */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-[#002366] uppercase tracking-wider">
                  Current Ministry & Leadership Calling:
                </div>
                <div className="text-xs text-slate-800 font-medium">
                  {candidate.currentMinistry || 'Serving in pastoral leadership and evangelism.'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-[#002366] uppercase tracking-wider">
                  Graduate Biography & Testimonial:
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{candidate.biography || 'A dedicated servant of God called to advance the Gospel of Jesus Christ.'}"
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-[#002366] uppercase tracking-wider">
                  Future Vision & Aspirations:
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {candidate.futureAspirations || 'Planting kingdom churches, discipling believers, and mentoring leaders.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: DEGREE CONFERMENT & CERTIFICATE */}
          {activeTab === 'certificate' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#001A4D] to-[#002366] text-white border-2 border-[#C5A059] space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059] text-[#002366] text-[10px] font-black uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Conferred Credential</span>
                  </div>
                  <span className="text-xs font-mono text-[#C5A059]">
                    Status: {candidate.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-widest text-slate-300">Degree Conferred</div>
                  <h3 className="text-xl font-bold font-display text-white">{candidate.programName}</h3>
                  <div className="text-xs text-[#C5A059] font-medium">{candidate.schoolName}</div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
                  <div>
                    <div className="text-slate-400 text-[10px]">Certificate No.</div>
                    <div className="font-mono font-bold text-[#C5A059]">
                      {candidate.certificateNumber || 'Pending Issuance'}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Transcript No.</div>
                    <div className="font-mono font-bold text-slate-200">
                      {candidate.transcriptNumber || 'BIBU-TR-2026'}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Booklet Roster</div>
                    <div className="font-mono font-bold text-slate-200">
                      #{candidate.bookletNumber || 'BK-001'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Confer, ID Card */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleConferDegree}
                  disabled={candidate.clearanceProgress < 100}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001A4D] disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>Confer Degree & Migrate to Alumni</span>
                </button>

                <button
                  onClick={() => setShowAlumniCard(true)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#002366] text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Award className="w-4 h-4 text-[#002366]" />
                  <span>View Digital Alumni Card</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Registered candidate in <strong>{candidate.ceremonyNumber || '15th Congregation'}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>

      {/* Alumni Digital Card Modal Popup */}
      {showAlumniCard && (
        <AlumniDigitalCard candidate={candidate} onClose={() => setShowAlumniCard(false)} />
      )}
    </div>
  );
};
