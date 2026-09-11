import React, { useState } from 'react';
import { ArrowRightLeft, Sparkles, CheckCircle2, Plus, Trash2, FileCheck, Award, X, BookOpen, AlertCircle, Loader2 } from 'lucide-react';

interface TransferCourse {
  id: string;
  externalCourseCode: string;
  externalCourseTitle: string;
  credits: number;
  institution: string;
  grade: string;
  matchedEquivalentCode: string;
  matchedEquivalentTitle: string;
  matchConfidence: number;
  status: 'Suggested' | 'Submitted' | 'Approved' | 'Declined';
}

interface CreditTransferEvaluatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentId: string;
  onLogActivity: (action: any, details: string) => void;
}

export const CreditTransferEvaluatorModal: React.FC<CreditTransferEvaluatorModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentId,
  onLogActivity
}) => {
  const [priorCourses, setPriorCourses] = useState<TransferCourse[]>([
    {
      id: 'tc-1',
      externalCourseCode: 'THEO-501',
      externalCourseTitle: 'Introduction to Christian Dogmatics',
      credits: 3,
      institution: 'Trinity Theological Seminary',
      grade: 'A',
      matchedEquivalentCode: 'BIB-701',
      matchedEquivalentTitle: 'Advanced Systematic Theology I',
      matchConfidence: 96,
      status: 'Suggested'
    },
    {
      id: 'tc-2',
      externalCourseCode: 'BIB-202',
      externalCourseTitle: 'Old Testament Survey & History',
      credits: 3,
      institution: 'Moody Bible Institute',
      grade: 'A-',
      matchedEquivalentCode: 'BIB-703',
      matchedEquivalentTitle: 'Pentateuch & Historical Books Exegesis',
      matchConfidence: 91,
      status: 'Suggested'
    },
    {
      id: 'tc-3',
      externalCourseCode: 'MIN-301',
      externalCourseTitle: 'Principles of Christian Leadership',
      credits: 3,
      institution: 'Global Grace College',
      grade: 'B+',
      matchedEquivalentCode: 'MIN-703',
      matchedEquivalentTitle: 'Global Pastoral Leadership & Ethics',
      matchConfidence: 88,
      status: 'Suggested'
    }
  ]);

  // New course input state
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCredits, setNewCredits] = useState('3');
  const [newInstitution, setNewInstitution] = useState('');
  const [newGrade, setNewGrade] = useState('A');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleAddAndAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newTitle || !newInstitution) return;

    setIsAnalyzing(true);
    setSuccessMessage('');

    setTimeout(() => {
      // Simulate AI matching against BIBU curriculum
      const titleLower = newTitle.toLowerCase();
      let matchedCode = 'BIB-705';
      let matchedTitle = 'Hermeneutics & Biblical Exegesis';
      let confidence = 85;

      if (titleLower.includes('theology') || titleLower.includes('dogmatics') || titleLower.includes('doctrine')) {
        matchedCode = 'BIB-701';
        matchedTitle = 'Advanced Systematic Theology I';
        confidence = 94;
      } else if (titleLower.includes('pastor') || titleLower.includes('leader') || titleLower.includes('ministry')) {
        matchedCode = 'MIN-703';
        matchedTitle = 'Global Pastoral Leadership & Ethics';
        confidence = 92;
      } else if (titleLower.includes('testament') || titleLower.includes('bible') || titleLower.includes('scripture')) {
        matchedCode = 'BIB-703';
        matchedTitle = 'Pentateuch & Historical Books Exegesis';
        confidence = 89;
      }

      const newTransfer: TransferCourse = {
        id: `tc-${Date.now()}`,
        externalCourseCode: newCode.toUpperCase(),
        externalCourseTitle: newTitle,
        credits: parseInt(newCredits) || 3,
        institution: newInstitution,
        grade: newGrade,
        matchedEquivalentCode: matchedCode,
        matchedEquivalentTitle: matchedTitle,
        matchConfidence: confidence,
        status: 'Suggested'
      };

      setPriorCourses([newTransfer, ...priorCourses]);
      setIsAnalyzing(false);
      setNewCode('');
      setNewTitle('');
      setNewInstitution('');
      onLogActivity('Verified Document', `Evaluated prior learning course "${newTitle}" for credit exemption match.`);
    }, 1200);
  };

  const handleRemoveCourse = (id: string) => {
    setPriorCourses(priorCourses.filter(c => c.id !== id));
  };

  const handleSubmitAllForReview = () => {
    setPriorCourses(priorCourses.map(c => ({ ...c, status: 'Submitted' })));
    setSuccessMessage('Successfully submitted credit exemption request portfolio to the University Registrar!');
    onLogActivity('Verified Document', `Submitted transfer credit exemption portfolio (${priorCourses.length} courses) to Registrar.`);
  };

  const totalExemptionCredits = priorCourses
    .filter(c => c.status === 'Suggested' || c.status === 'Submitted' || c.status === 'Approved')
    .reduce((acc, c) => acc + c.credits, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
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
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] block font-display">
                Advanced Academic Evaluation
              </span>
              <h2 className="text-lg font-bold font-display text-white">
                Prior Learning & Credit Transfer Evaluator
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            Compare your prior theological coursework from external institutions against BIBU curriculum equivalents to calculate potential credit exemptions.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900 text-xs animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#002366]/10 text-[#002366] flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Evaluated Courses</span>
                <span className="text-lg font-bold text-slate-900 font-display">{priorCourses.length} Courses</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold border border-amber-200">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Potential Exemptions</span>
                <span className="text-lg font-bold text-amber-700 font-display">{totalExemptionCredits} Credits</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Match Accuracy</span>
                <span className="text-lg font-bold text-emerald-700 font-display">91.8% Avg</span>
              </div>
            </div>
          </div>

          {/* Add Prior Course Form */}
          <form onSubmit={handleAddAndAnalyze} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#002366]">
              <Plus className="w-4 h-4 text-[#C5A059]" />
              <span>Add External Course for Curriculum Equivalence Matching</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Course Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. THEO-601"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono uppercase bg-white focus:outline-none focus:ring-1 focus:ring-[#002366]"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-700">External Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Christology & Pneumatology"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#002366]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-700">Prior Institution Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gordon-Conwell Seminary"
                  value={newInstitution}
                  onChange={(e) => setNewInstitution(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#002366]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Credits</label>
                <select
                  value={newCredits}
                  onChange={(e) => setNewCredits(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#002366]"
                >
                  <option value="2">2 Credits</option>
                  <option value="3">3 Credits</option>
                  <option value="4">4 Credits</option>
                  <option value="6">6 Credits</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Grade Earned</label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#002366]"
                >
                  <option value="A">A (4.00)</option>
                  <option value="A-">A- (3.67)</option>
                  <option value="B+">B+ (3.33)</option>
                  <option value="B">B (3.00)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isAnalyzing}
                className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                    <span>Analyzing Curriculum Match...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <span>Evaluate Course Equivalency</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Evaluated Courses List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Prior Course Equivalency Matches ({priorCourses.length})</span>
              <span className="text-[10px] text-slate-400 font-normal">Compared against BIBU Degree Catalog</span>
            </div>

            <div className="space-y-3">
              {priorCourses.map((tc) => (
                <div key={tc.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[11px] font-bold">{tc.externalCourseCode}</span>
                        <h4 className="text-xs font-bold text-slate-900">{tc.externalCourseTitle}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Institution: <strong className="text-slate-700">{tc.institution}</strong> • Grade: <strong className="text-emerald-700">{tc.grade}</strong> ({tc.credits} Credits)
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                        tc.matchConfidence >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {tc.matchConfidence}% Curriculum Match
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCourse(tc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Matched Equivalent Section */}
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#002366] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        BIBU
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#002366] block">Suggested University Equivalent:</span>
                        <strong className="text-slate-900 font-display">{tc.matchedEquivalentCode} - {tc.matchedEquivalentTitle}</strong>
                      </div>
                    </div>

                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                      tc.status === 'Submitted' ? 'bg-amber-100 text-amber-800' :
                      tc.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      Status: {tc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit Action */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              Total suggested exemption value: <strong className="text-[#002366]">{totalExemptionCredits} Credits</strong>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSubmitAllForReview}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 transition-all"
              >
                <FileCheck className="w-4 h-4 text-emerald-200" />
                <span>Submit Exemption Portfolio to Registrar</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
