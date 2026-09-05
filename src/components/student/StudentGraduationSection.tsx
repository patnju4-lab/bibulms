import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  DollarSign,
  UserCheck,
  FileCheck2,
  BookOpen,
  Calendar,
  MapPin,
  Sparkles,
  Printer,
  ExternalLink,
  Info
} from 'lucide-react';
import { AlumniDigitalCard } from '../graduation/AlumniDigitalCard';

export const StudentGraduationSection: React.FC = () => {
  const { currentUser, graduationCandidates, graduationCeremonies, graduationBooklets } = useApp();
  const [showAlumniCard, setShowAlumniCard] = useState(false);

  // Match current logged in user with their candidate record
  const studentCandidate = useMemo(() => {
    return (
      graduationCandidates.find((c) => c.studentId === currentUser.id) ||
      graduationCandidates[0] // fallback to first mock candidate for demonstration
    );
  }, [graduationCandidates, currentUser.id]);

  const assignedCeremony = useMemo(() => {
    if (!studentCandidate) return graduationCeremonies[0];
    return (
      graduationCeremonies.find((c) => c.id === studentCandidate.ceremonyId) || graduationCeremonies[0]
    );
  }, [graduationCeremonies, studentCandidate]);

  if (!studentCandidate) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
        <GraduationCap className="w-12 h-12 mx-auto text-slate-300" />
        <h3 className="text-base font-bold text-slate-800">Graduation Application Pending</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          You are currently in your active degree program. When you reach final semester degree completion (120+ credit hours), your dossier will be submitted to the Academic Senate for graduation clearance.
        </p>
      </div>
    );
  }

  const clearanceItems = [
    { label: 'Academic Department', record: studentCandidate.clearances.academic, icon: BookOpen },
    { label: 'Examination Department', record: studentCandidate.clearances.examination, icon: FileCheck2 },
    { label: 'Finance / Bursar', record: studentCandidate.clearances.finance, icon: DollarSign },
    { label: 'Theological Library', record: studentCandidate.clearances.library, icon: Building },
    { label: 'Student Affairs', record: studentCandidate.clearances.studentAffairs, icon: UserCheck },
    { label: 'University Registrar', record: studentCandidate.clearances.registrar, icon: ShieldCheck },
    { label: 'Graduation Office', record: studentCandidate.clearances.graduationOffice, icon: GraduationCap }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#001A4D] via-[#002366] to-[#001438] rounded-2xl p-6 sm:p-8 text-white border-b-4 border-[#C5A059] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059] text-[#C5A059] text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Graduation Clearance & Conferred Degree Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Convocation Candidacy Dossier
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Candidate: <strong>{studentCandidate.fullName}</strong> • Degree:{' '}
            <strong>{studentCandidate.programName}</strong>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10">
          <button
            onClick={() => setShowAlumniCard(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#002366] text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Award className="w-4 h-4 text-[#002366]" />
            <span>View Digital Alumni Card</span>
          </button>
        </div>
      </div>

      {/* Grid of Ceremony Details & Clearance Velocity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ceremony Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#C5A059]">Assigned Ceremony</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#002366]">
              {assignedCeremony?.status || 'Confirmed'}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold font-display text-[#002366]">
              {assignedCeremony?.graduationNumber || '15th Annual Congregation'}
            </h3>
            <div className="text-xs text-slate-500 mt-1 italic">"{assignedCeremony?.theme}"</div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#002366]" />
              <span>{assignedCeremony?.graduationDate} • {assignedCeremony?.graduationTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#002366]" />
              <span>{assignedCeremony?.venue}, {assignedCeremony?.city}</span>
            </div>
          </div>
        </div>

        {/* Clearance Progress Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#002366]">
              Clearance Velocity
            </span>
            <span className="text-xs font-mono font-bold text-[#002366]">
              {studentCandidate.clearanceProgress}% Complete
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-black font-display text-[#002366]">
              {studentCandidate.status}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${studentCandidate.clearanceProgress}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500">
              Approved by Academic Senate and Bursar.
            </div>
          </div>
        </div>

        {/* Fee & Booklet Roster Entry */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#C5A059]">
            Official Booklet Listing
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="font-bold text-slate-900">{studentCandidate.fullName}</div>
            <div className="text-[11px] text-slate-600">{studentCandidate.programName}</div>
            <div className="text-[10px] text-[#C5A059] font-semibold">{studentCandidate.academicHonors}</div>
            <div className="text-[9px] font-mono text-slate-400 mt-1">
              Booklet Roster Entry: #{studentCandidate.bookletNumber || 'BK-001'}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Graduation Fee:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              ${studentCandidate.graduationFeePaid} (Paid)
            </span>
          </div>
        </div>
      </div>

      {/* 7-Department Clearance Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-[#002366]">
              Official 7-Department Institutional Clearance Checklist
            </h3>
            <p className="text-xs text-slate-500">
              All 7 university divisions must electronically certify your academic, financial, and disciplinary standing
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
            Senate Approved
          </span>
        </div>

        <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden text-xs">
          {clearanceItems.map((item, idx) => {
            const Icon = item.icon;
            const isCompleted = item.record.status === 'Completed';

            return (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{item.label}</div>
                    {item.record.clearedBy && (
                      <div className="text-[10px] text-slate-500">
                        Signed off by: <strong>{item.record.clearedBy}</strong> on {item.record.clearedDate}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.record.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alumni ID Card Modal */}
      {showAlumniCard && (
        <AlumniDigitalCard candidate={studentCandidate} onClose={() => setShowAlumniCard(false)} />
      )}
    </div>
  );
};
