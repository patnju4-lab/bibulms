import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileQuestion, Plus, Edit2, Trash2, CheckCircle2, X, Clock, Award, HelpCircle, ShieldCheck, ShieldAlert, BookOpen } from 'lucide-react';
import { Exam, ExamQuestion } from '../../../types';
import {
  RegistrarExamPlagiarismReviewModal,
  ExamSimilarityAuditReport
} from '../RegistrarExamPlagiarismReviewModal';
import { generateExamSimilarityAudit } from '../../../services/examPlagiarismAuditService';

export const ExamsManagementTab: React.FC = () => {
  const { exams, courses, addExam, updateExam, deleteExam, addExamQuestion, deleteExamQuestion } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'questions' | 'submissions'>('questions');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [isCreatingExam, setIsCreatingExam] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [auditModalReport, setAuditModalReport] = useState<ExamSimilarityAuditReport | null>(null);

  // Submissions with similarity & plagiarism scores
  const [candidateSubmissions, setCandidateSubmissions] = useState([
    {
      id: 'sub-phd-01',
      candidateName: 'James Ninrew Dong',
      admissionNo: 'BIBU/2025/48710',
      cohort: 'Class 2024/2026',
      program: 'PhD in Public Policy and Administration in a Christian Environment',
      examTitle: 'Final Comprehensive Examination',
      submittedAt: 'Just now (Online BIBU-LMS)',
      totalWords: 5160,
      similarityScore: 6.8,
      aiProbability: 4.2,
      originalityScore: 93.2,
      integrityStatus: 'CLEARED' as const,
      reviewStatus: 'Pending Registrar Review',
      moderatedScore: null as number | null
    },
    {
      id: 'sub-dmin-02',
      candidateName: 'Rev. David K. Ndungu',
      admissionNo: 'BIBU/ADM/2024/0088',
      cohort: 'Class 2024/2025',
      program: 'Doctor of Ministry (D.Min.) in Pastoral Theology',
      examTitle: 'Doctoral Comprehensive Defense Exam',
      submittedAt: 'Yesterday 14:22 EST',
      totalWords: 4890,
      similarityScore: 7.9,
      aiProbability: 3.1,
      originalityScore: 92.1,
      integrityStatus: 'CLEARED' as const,
      reviewStatus: 'Cleared & Moderated (94%)',
      moderatedScore: 94
    },
    {
      id: 'sub-mabl-03',
      candidateName: 'Bishop Grace M. Mutua',
      admissionNo: 'BIBU/ADM/2024/0122',
      cohort: 'Class 2024/2025',
      program: 'Master of Arts in Biblical Leadership & Missions',
      examTitle: 'Trimester Capstone Examination',
      submittedAt: '2 days ago',
      totalWords: 3950,
      similarityScore: 5.7,
      aiProbability: 2.8,
      originalityScore: 94.3,
      integrityStatus: 'CLEARED' as const,
      reviewStatus: 'Cleared & Moderated (89%)',
      moderatedScore: 89
    }
  ]);

  const handleOpenPlagiarismAudit = (sub: typeof candidateSubmissions[0]) => {
    let report: ExamSimilarityAuditReport;
    try {
      const saved = localStorage.getItem('bibu_phd_exam_2025_48710_similarity_audit');
      if (saved && sub.admissionNo === 'BIBU/2025/48710') {
        report = JSON.parse(saved);
      } else {
        report = generateExamSimilarityAudit({}, sub.candidateName, sub.admissionNo, `BIBU-SUB-${sub.id}`);
      }
    } catch {
      report = generateExamSimilarityAudit({}, sub.candidateName, sub.admissionNo, `BIBU-SUB-${sub.id}`);
    }
    setAuditModalReport(report);
  };

  const handleSaveRegistrarAuditReview = (reviewData: {
    decision: 'APPROVED' | 'CONDITIONAL' | 'FLAGGED';
    totalScore: number;
    questionScores: { [qId: number]: number };
    registrarNotes: string;
  }) => {
    if (!auditModalReport) return;
    setCandidateSubmissions(prev =>
      prev.map(item =>
        item.admissionNo === auditModalReport.admissionNo
          ? {
              ...item,
              reviewStatus:
                reviewData.decision === 'APPROVED'
                  ? `Approved & Moderated (${reviewData.totalScore}%)`
                  : reviewData.decision === 'CONDITIONAL'
                  ? 'Conditional Citation Clarification'
                  : 'Flagged for Senate Hearing',
              moderatedScore: reviewData.totalScore
            }
          : item
      )
    );
    setNotification(`Registrar audit decision recorded for ${auditModalReport.candidateName} (${reviewData.totalScore}%)`);
    setTimeout(() => setNotification(null), 3500);
    setAuditModalReport(null);
  };

  // Exam Form
  const [courseCode, setCourseCode] = useState(courses[0]?.code || 'THEO-101');
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [passingPercentage, setPassingPercentage] = useState(75);
  const [instructions, setInstructions] = useState('Read each theological question carefully. Answer according to sound biblical hermeneutics.');

  // Question Form
  const [questionText, setQuestionText] = useState('');
  const [qType, setQType] = useState<'multiple-choice' | 'true-false' | 'essay'>('multiple-choice');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('0');
  const [explanation, setExplanation] = useState('');

  const startCreateExam = () => {
    setEditingExam(null);
    setCourseCode(courses[0]?.code || 'THEO-101');
    setTitle('');
    setDurationMinutes(60);
    setPassingPercentage(75);
    setInstructions('Read each theological question carefully. Choose the most doctrinally accurate answer.');
    setIsCreatingExam(true);
  };

  const startEditExam = (exam: Exam) => {
    setIsCreatingExam(false);
    setEditingExam(exam);
    setCourseCode(exam.courseCode);
    setTitle(exam.title);
    setDurationMinutes(exam.durationMinutes);
    setPassingPercentage(exam.passingPercentage);
    setInstructions(exam.instructions);
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingExam) {
      addExam({
        courseCode,
        title,
        durationMinutes,
        passingPercentage,
        instructions,
        questions: []
      });
      setNotification(`Examination "${title}" created successfully!`);
      setIsCreatingExam(false);
    } else if (editingExam) {
      updateExam(editingExam.id, {
        courseCode,
        title,
        durationMinutes,
        passingPercentage,
        instructions
      });
      setNotification(`Exam "${title}" updated!`);
      setEditingExam(null);
    }
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam) return;

    let options: string[] = [];
    let correct: any = 0;

    if (qType === 'multiple-choice') {
      options = [optA, optB, optC, optD].filter(Boolean);
      correct = Number(correctAnswer);
    } else if (qType === 'true-false') {
      options = ['True', 'False'];
      correct = correctAnswer === '0' ? 0 : 1;
    } else {
      options = [];
      correct = 'Rubric based assessment';
    }

    addExamQuestion(selectedExam.id, {
      question: questionText,
      type: qType,
      options,
      correctAnswer: correct,
      explanation
    });

    setNotification('Question added to exam question bank!');
    setQuestionText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setExplanation('');
    setIsAddingQuestion(false);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#002366] flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-[#C5A059]" />
            <span>Examinations & Registrar Academic Integrity Desk</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure proctored mid-terms, final exams, question banks, and audit doctoral plagiarism & similarity detection scores before conferral.
          </p>
        </div>

        {activeSubTab === 'questions' && (
          <button
            onClick={startCreateExam}
            className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider border-2 border-[#C5A059] shadow flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>Create Examination</span>
          </button>
        )}
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('questions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'questions'
              ? 'bg-[#002366] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileQuestion className="w-4 h-4 text-[#C5A059]" />
          <span>Examinations & Question Bank ({exams.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'submissions'
              ? 'bg-[#002366] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span>Doctoral Submissions & Plagiarism Audits ({candidateSubmissions.length})</span>
          <span className="text-[10px] font-mono font-bold bg-[#C5A059] text-[#002366] px-1.5 py-0.2 rounded-full">
            1 Pending
          </span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* DOCTORAL SUBMISSIONS & PLAGIARISM AUDIT TAB */}
      {activeSubTab === 'submissions' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold font-display text-slate-900">
                  Doctoral & Final Comprehensive Examination Scripts (Registrar Moderation Roll)
                </h3>
                <p className="text-xs text-slate-500">
                  Automated similarity detection scores generated prior to Academic Registrar manual review and degree conferral.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                Turnitin / BIBU-LMS v4.8 Active
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {candidateSubmissions.map((sub) => (
                <div key={sub.id} className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50 p-3 rounded-xl transition-colors">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-[#002366]">
                        {sub.candidateName}
                      </span>
                      <span className="font-mono text-xs text-slate-500">
                        ({sub.admissionNo})
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold border border-blue-200">
                        {sub.cohort}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 font-medium">
                      {sub.program}
                    </div>

                    <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3 pt-1">
                      <span>Exam: <strong>{sub.examTitle}</strong></span>
                      <span>•</span>
                      <span>Words: <strong>{sub.totalWords.toLocaleString()}</strong></span>
                      <span>•</span>
                      <span className="text-slate-400">Submitted: {sub.submittedAt}</span>
                    </div>
                  </div>

                  {/* Similarity & Plagiarism Summary Badge */}
                  <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                    <div className="text-left sm:text-right space-y-0.5 bg-slate-50 lg:bg-transparent p-2.5 lg:p-0 rounded-xl border lg:border-none border-slate-200">
                      <div className="flex items-center lg:justify-end gap-1.5">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Similarity Index:</span>
                        <span className={`font-mono font-black text-sm px-2 py-0.5 rounded ${
                          sub.similarityScore < 10
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {sub.similarityScore}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        AI Prob: <strong className="text-purple-700">{sub.aiProbability}%</strong> • Originality: <strong className="text-blue-700">{sub.originalityScore}%</strong>
                      </div>
                      <div className="text-[10px] font-bold text-emerald-700">
                        ✓ {sub.integrityStatus}: Acceptable (&lt;15%)
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 flex flex-col sm:flex-row items-center gap-2">
                      <button
                        onClick={() => handleOpenPlagiarismAudit(sub)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001740] text-[#C5A059] font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                        <span>Audit Plagiarism & Review Script &rarr;</span>
                      </button>

                      {sub.moderatedScore && (
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                          Moderated: {sub.moderatedScore}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QUESTION BANK TAB (Default) */}
      {activeSubTab === 'questions' && (
        <div className="space-y-6">

      {/* Create / Edit Exam Form */}
      {(isCreatingExam || editingExam) && (
        <div className="bg-white rounded-xl border-2 border-[#002366] p-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-[#002366] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C5A059]" />
              <span>{isCreatingExam ? 'Create New Proctored Exam' : `Edit Exam: ${editingExam?.title}`}</span>
            </h3>
            <button
              onClick={() => { setIsCreatingExam(false); setEditingExam(null); }}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveExam} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Exam Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Systematic Theology I Final Examination"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Code</label>
                <select
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.code}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  required
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Passing Score (%)</label>
                <input
                  type="number"
                  required
                  value={passingPercentage}
                  onChange={(e) => setPassingPercentage(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Exam Instructions for Students</label>
                <textarea
                  rows={2}
                  required
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setIsCreatingExam(false); setEditingExam(null); }}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#002366] text-white text-xs font-bold uppercase tracking-wider border border-[#C5A059]"
              >
                {isCreatingExam ? 'Create Exam' : 'Save Exam Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Exams Grid & Question Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Exam to View & Edit Questions:
          </div>
          {exams.map((exam) => {
            const isSelected = selectedExam?.id === exam.id;
            return (
              <div
                key={exam.id}
                onClick={() => setSelectedExam(exam)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#002366] text-white border-[#C5A059] shadow-md'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-[#002366]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${isSelected ? 'bg-[#C5A059] text-[#002366]' : 'bg-slate-100 text-slate-700'}`}>
                    {exam.courseCode}
                  </span>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => startEditExam(exam)}
                      className={`p-1 rounded ${isSelected ? 'text-slate-200 hover:text-white' : 'text-slate-400 hover:text-[#002366]'}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete exam "${exam.title}"?`)) {
                          deleteExam(exam.id);
                          if (selectedExam?.id === exam.id) setSelectedExam(null);
                        }
                      }}
                      className={`p-1 rounded ${isSelected ? 'text-rose-300 hover:text-rose-100' : 'text-slate-400 hover:text-rose-600'}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="font-bold text-xs mt-2">{exam.title}</div>
                <div className={`text-[11px] mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {exam.durationMinutes} mins • {exam.passingPercentage}% Pass Mark
                </div>
                <div className={`text-[10px] mt-2 font-bold ${isSelected ? 'text-[#C5A059]' : 'text-slate-400'}`}>
                  {exam.questions?.length || 0} Questions in Bank
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Exam Questions */}
        <div className="lg:col-span-7">
          {selectedExam ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="inline-block px-2 py-0.5 rounded bg-[#002366]/10 text-[#002366] text-xs font-mono font-bold">
                    {selectedExam.courseCode}
                  </div>
                  <h3 className="text-base font-bold text-[#002366] mt-1">{selectedExam.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedExam.questions?.length || 0} Questions</p>
                </div>

                <button
                  onClick={() => setIsAddingQuestion(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#002366] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Add Question</span>
                </button>
              </div>

              {/* Add Question Form */}
              {isAddingQuestion && (
                <form onSubmit={handleAddQuestion} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="text-xs font-bold text-[#002366]">New Examination Question:</div>
                  <textarea
                    rows={2}
                    required
                    placeholder="Question prompt or biblical scenario..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Question Type</label>
                      <select
                        value={qType}
                        onChange={(e) => setQType(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                      >
                        <option value="multiple-choice">Multiple Choice (4 options)</option>
                        <option value="true-false">True / False</option>
                        <option value="essay">Theological Essay</option>
                      </select>
                    </div>

                    {qType === 'multiple-choice' && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">Correct Option</label>
                        <select
                          value={correctAnswer}
                          onChange={(e) => setCorrectAnswer(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                        >
                          <option value="0">Option A</option>
                          <option value="1">Option B</option>
                          <option value="2">Option C</option>
                          <option value="3">Option D</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {qType === 'multiple-choice' && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Option A"
                        value={optA}
                        onChange={(e) => setOptA(e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Option B"
                        value={optB}
                        onChange={(e) => setOptB(e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Option C"
                        value={optC}
                        onChange={(e) => setOptC(e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Option D"
                        value={optD}
                        onChange={(e) => setOptD(e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                      />
                    </div>
                  )}

                  <textarea
                    rows={2}
                    placeholder="Theological explanation / scripture justification for correct answer..."
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingQuestion(false)}
                      className="px-3 py-1 text-xs text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-[#002366] text-white rounded text-xs font-bold"
                    >
                      Save Question
                    </button>
                  </div>
                </form>
              )}

              {/* Questions list */}
              <div className="space-y-3">
                {selectedExam.questions?.map((q, idx) => (
                  <div key={q.id} className="p-3.5 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="font-bold text-xs text-slate-800">
                        {idx + 1}. {q.question}
                      </div>
                      <button
                        onClick={() => deleteExamQuestion(selectedExam.id, q.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {q.options.map((opt, i) => (
                          <div
                            key={i}
                            className={`p-1.5 rounded text-[11px] ${
                              q.correctAnswer === i
                                ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                                : 'bg-slate-50 text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + i)}. {opt} {q.correctAnswer === i && '✓ (Correct)'}
                          </div>
                        ))}
                      </div>
                    )}

                    {q.explanation && (
                      <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded">
                        <span className="font-bold text-slate-700">Exegesis: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
              <FileQuestion className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-600">Select an exam on the left to edit questions</div>
            </div>
          )}
        </div>
      </div>
        </div>
      )}

      {/* REGISTRAR EXAM PLAGIARISM AUDIT & SCRIPT REVIEW MODAL */}
      {auditModalReport && (
        <RegistrarExamPlagiarismReviewModal
          report={auditModalReport}
          onClose={() => setAuditModalReport(null)}
          onSaveReview={handleSaveRegistrarAuditReview}
        />
      )}
    </div>
  );
};
