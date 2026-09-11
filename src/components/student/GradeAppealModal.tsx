import React, { useState } from 'react';
import { AlertCircle, Send, CheckCircle2, FileText, X, MessageSquare, ShieldAlert, BookOpen } from 'lucide-react';
import { GradeRecord } from '../../types';

interface GradeAppealModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentId: string;
  grades: GradeRecord[];
  onLogActivity: (action: any, details: string) => void;
}

interface AppealSubmission {
  id: string;
  courseCode: string;
  courseTitle: string;
  currentGrade: string;
  reasonCategory: string;
  justification: string;
  status: 'Pending Faculty Review' | 'Under Academic Board Review' | 'Resolved';
  dateSubmitted: string;
}

export const GradeAppealModal: React.FC<GradeAppealModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentId,
  grades,
  onLogActivity
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState(grades[0]?.id || '');
  const [reasonCategory, setReasonCategory] = useState('Calculation Error');
  const [justification, setJustification] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [activeAppeals, setActiveAppeals] = useState<AppealSubmission[]>([
    {
      id: 'app-1',
      courseCode: 'BIB-301',
      courseTitle: 'Advanced Hermeneutics',
      currentGrade: 'B+',
      reasonCategory: 'Assignment Grading Discrepancy',
      justification: 'Final research paper rubric score appears to have omitted the bibliography and formatting bonus points.',
      status: 'Pending Faculty Review',
      dateSubmitted: 'Sept 8, 2026'
    }
  ]);

  if (!isOpen) return null;

  const handleSubmitAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    const course = grades.find(g => g.id === selectedCourseId);
    if (!course || !justification.trim()) return;

    const newAppeal: AppealSubmission = {
      id: `app-${Date.now()}`,
      courseCode: course.code,
      courseTitle: course.title,
      currentGrade: course.grade,
      reasonCategory,
      justification,
      status: 'Pending Faculty Review',
      dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setActiveAppeals([newAppeal, ...activeAppeals]);
    setSuccessMsg(`Formal grade appeal for ${course.code} submitted successfully to faculty and the Academic Standards Board.`);
    onLogActivity('Verified Document', `Submitted formal grade appeal for course ${course.code} (${reasonCategory}).`);

    setJustification('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#002366] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 text-[#C5A059]">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] block font-display">
                Academic Registrar Services
              </span>
              <h2 className="text-lg font-bold font-display text-white">
                Formal Grade Appeal & Review Portal
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            Submit a formal grade review request for completed coursework. Faculty instructors and the Academic Standards Board are automatically notified.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900 text-xs animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {/* New Appeal Form */}
          <form onSubmit={handleSubmitAppeal} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#002366]">
              <MessageSquare className="w-4 h-4 text-[#C5A059]" />
              <span>Initiate New Grade Review Request</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Select Course for Appeal *</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002366]"
                >
                  {grades.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.code} - {g.title} (Current: {g.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Reason Category *</label>
                <select
                  value={reasonCategory}
                  onChange={(e) => setReasonCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002366]"
                >
                  <option value="Calculation Error">Calculation or Summation Error</option>
                  <option value="Assignment Grading Discrepancy">Assignment Grading Discrepancy</option>
                  <option value="Missing Attendance/Participation Credit">Missing Attendance / Participation Credit</option>
                  <option value="Extenuating Circumstances">Extenuating Circumstances (Medical/Family)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Detailed Justification & Supporting Context *</label>
              <textarea
                required
                rows={3}
                placeholder="Provide specific details regarding the assignment, exam, or calculation in question..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#002366]"
              />
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 transition-all"
              >
                <Send className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Submit Formal Appeal</span>
              </button>
            </div>
          </form>

          {/* Active Appeals List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Submitted Grade Appeals ({activeAppeals.length})</span>
              <span className="text-[10px] text-slate-400 font-normal">Tracked in Academic Record</span>
            </div>

            <div className="space-y-2.5">
              {activeAppeals.map((appeal) => (
                <div key={appeal.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-mono text-[11px] font-bold border border-amber-200">
                        {appeal.courseCode}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{appeal.courseTitle}</h4>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-blue-50 text-[#002366] border border-blue-200">
                      {appeal.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-600">
                    <p><strong>Category:</strong> {appeal.reasonCategory} (Current Grade: <span className="font-bold text-slate-900">{appeal.currentGrade}</span>)</p>
                    <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700 italic">"{appeal.justification}"</p>
                  </div>

                  <div className="flex justify-between items-center pt-1 text-[10px] text-slate-400 font-mono">
                    <span>Submitted on: {appeal.dateSubmitted}</span>
                    <span>Student ID: {studentId}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Grade appeals are bound by university academic policy and must be submitted within 14 calendar days of final grade posting.</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Close Portal
          </button>
        </div>

      </div>
    </div>
  );
};
