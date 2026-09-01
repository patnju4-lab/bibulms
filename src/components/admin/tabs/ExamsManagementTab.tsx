import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileQuestion, Plus, Edit2, Trash2, CheckCircle2, X, Clock, Award, HelpCircle } from 'lucide-react';
import { Exam, ExamQuestion } from '../../../types';

export const ExamsManagementTab: React.FC = () => {
  const { exams, courses, addExam, updateExam, deleteExam, addExamQuestion, deleteExamQuestion } = useApp();
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [isCreatingExam, setIsCreatingExam] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

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
            <span>Examinations & Question Bank ({exams.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure proctored mid-terms, final exams, question banks, passing thresholds, and doctrinal explanations.
          </p>
        </div>

        <button
          onClick={startCreateExam}
          className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider border-2 border-[#C5A059] shadow flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>Create Examination</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

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
  );
};
