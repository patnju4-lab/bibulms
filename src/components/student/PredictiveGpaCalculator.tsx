import React, { useState, useMemo } from 'react';
import {
  Calculator,
  TrendingUp,
  Award,
  Sparkles,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  BookmarkPlus,
  BookOpen,
  Info
} from 'lucide-react';
import { GradeRecord } from '../../types';

export interface ProjectedCourse {
  id: string;
  courseCode: string;
  courseTitle: string;
  creditHours: number;
  projectedGrade: string; // 'A', 'A-', 'B+', etc.
  gradePoint: number;
  term: string;
}

interface PredictiveGpaCalculatorProps {
  currentCumulativeGpa: number;
  currentAttemptedCredits: number;
  currentEarnedCredits: number;
  currentQualityPoints: number;
  studentGrades?: GradeRecord[];
  className?: string;
}

const GRADE_SCALE: { grade: string; points: number; label: string }[] = [
  { grade: 'A', points: 4.0, label: 'Excellent (4.0)' },
  { grade: 'A-', points: 3.7, label: 'Outstanding (3.7)' },
  { grade: 'B+', points: 3.3, label: 'Very Good (3.3)' },
  { grade: 'B', points: 3.0, label: 'Good (3.0)' },
  { grade: 'B-', points: 2.7, label: 'Above Average (2.7)' },
  { grade: 'C+', points: 2.3, label: 'Competent (2.3)' },
  { grade: 'C', points: 2.0, label: 'Average Passing (2.0)' },
  { grade: 'C-', points: 1.7, label: 'Marginal Pass (1.7)' },
  { grade: 'D+', points: 1.3, label: 'Below Average (1.3)' },
  { grade: 'D', points: 1.0, label: 'Minimum Pass (1.0)' },
  { grade: 'F', points: 0.0, label: 'Fail / No Credit (0.0)' }
];

const DEFAULT_IN_PROGRESS_COURSES: ProjectedCourse[] = [
  {
    id: 'proj-1',
    courseCode: 'BIB-450',
    courseTitle: 'Johannine Literature & Exegesis',
    creditHours: 3,
    projectedGrade: 'A',
    gradePoint: 4.0,
    term: 'Fall 2026'
  },
  {
    id: 'proj-2',
    courseCode: 'THE-410',
    courseTitle: 'Christian Ethics & Modern Bioethics',
    creditHours: 3,
    projectedGrade: 'A-',
    gradePoint: 3.7,
    term: 'Fall 2026'
  },
  {
    id: 'proj-3',
    courseCode: 'MIN-320',
    courseTitle: 'Cross-Cultural Pastoral Leadership',
    creditHours: 3,
    projectedGrade: 'B+',
    gradePoint: 3.3,
    term: 'Fall 2026'
  },
  {
    id: 'proj-4',
    courseCode: 'CAP-490',
    courseTitle: 'Senior Theological Capstone Thesis',
    creditHours: 3,
    projectedGrade: 'A',
    gradePoint: 4.0,
    term: 'Fall 2026'
  }
];

export const PredictiveGpaCalculator: React.FC<PredictiveGpaCalculatorProps> = ({
  currentCumulativeGpa,
  currentAttemptedCredits,
  currentEarnedCredits,
  currentQualityPoints,
  studentGrades = [],
  className = ''
}) => {
  const [courses, setCourses] = useState<ProjectedCourse[]>(DEFAULT_IN_PROGRESS_COURSES);
  const [targetGpaInput, setTargetGpaInput] = useState<string>('3.90');
  const [activeScenario, setActiveScenario] = useState<'custom' | 'optimistic' | 'conservative' | 'target'>('custom');
  const [savedScenarios, setSavedScenarios] = useState<
    { name: string; date: string; termGpa: number; cumGpa: number }[]
  >([]);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // New course form inputs
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCredits, setNewCredits] = useState<number>(3);
  const [newGrade, setNewGrade] = useState<string>('A');

  // Handle grade change for an in-progress course
  const handleGradeChange = (id: string, newLetter: string) => {
    const scale = GRADE_SCALE.find((g) => g.grade === newLetter);
    const points = scale ? scale.points : 4.0;
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, projectedGrade: newLetter, gradePoint: points } : c))
    );
    setActiveScenario('custom');
  };

  // Handle credit hours change
  const handleCreditsChange = (id: string, credits: number) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, creditHours: Math.max(1, credits) } : c))
    );
    setActiveScenario('custom');
  };

  // Remove a course
  const handleRemoveCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setActiveScenario('custom');
  };

  // Add course
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newTitle.trim()) return;

    const scale = GRADE_SCALE.find((g) => g.grade === newGrade);
    const points = scale ? scale.points : 4.0;

    const newCourse: ProjectedCourse = {
      id: `proj-${Date.now()}`,
      courseCode: newCode.trim().toUpperCase(),
      courseTitle: newTitle.trim(),
      creditHours: newCredits,
      projectedGrade: newGrade,
      gradePoint: points,
      term: 'Fall 2026'
    };

    setCourses((prev) => [...prev, newCourse]);
    setNewCode('');
    setNewTitle('');
    setNewCredits(3);
    setNewGrade('A');
    setActiveScenario('custom');
  };

  // Preset scenarios
  const applyPresetScenario = (scenario: 'optimistic' | 'conservative') => {
    setActiveScenario(scenario);
    if (scenario === 'optimistic') {
      setCourses((prev) =>
        prev.map((c) => ({
          ...c,
          projectedGrade: 'A',
          gradePoint: 4.0
        }))
      );
    } else if (scenario === 'conservative') {
      setCourses((prev) =>
        prev.map((c) => ({
          ...c,
          projectedGrade: 'B',
          gradePoint: 3.0
        }))
      );
    }
  };

  // Reset to initial
  const handleReset = () => {
    setCourses(DEFAULT_IN_PROGRESS_COURSES);
    setActiveScenario('custom');
  };

  // Semester Calculations
  const projectedSemesterCredits = useMemo(
    () => courses.reduce((sum, c) => sum + c.creditHours, 0),
    [courses]
  );

  const projectedSemesterQualityPoints = useMemo(
    () => courses.reduce((sum, c) => sum + c.creditHours * c.gradePoint, 0),
    [courses]
  );

  const projectedSemesterGpa = useMemo(() => {
    if (projectedSemesterCredits === 0) return 0;
    return projectedSemesterQualityPoints / projectedSemesterCredits;
  }, [projectedSemesterQualityPoints, projectedSemesterCredits]);

  // Cumulative Projection Calculations
  const projectedTotalCredits = currentAttemptedCredits + projectedSemesterCredits;
  const projectedTotalQualityPoints = currentQualityPoints + projectedSemesterQualityPoints;
  const projectedCumulativeGpa = useMemo(() => {
    if (projectedTotalCredits === 0) return currentCumulativeGpa;
    return projectedTotalQualityPoints / projectedTotalCredits;
  }, [projectedTotalQualityPoints, projectedTotalCredits, currentCumulativeGpa]);

  const gpaDelta = projectedCumulativeGpa - currentCumulativeGpa;

  // Target GPA calculation:
  // (currentQP + targetSemesterQP) / (currentCredits + projectedCredits) = targetGPA
  // targetSemesterQP = targetGPA * (currentCredits + projectedCredits) - currentQP
  // requiredSemesterGPA = targetSemesterQP / projectedCredits
  const targetGpaNum = parseFloat(targetGpaInput) || 3.9;
  const requiredSemesterGpaForTarget = useMemo(() => {
    if (projectedSemesterCredits === 0) return 0;
    const requiredTotalQP = targetGpaNum * (currentAttemptedCredits + projectedSemesterCredits);
    const requiredTermQP = requiredTotalQP - currentQualityPoints;
    return requiredTermQP / projectedSemesterCredits;
  }, [targetGpaNum, currentAttemptedCredits, projectedSemesterCredits, currentQualityPoints]);

  // Academic Latin Honors Projection
  const honorsProjection = useMemo(() => {
    if (projectedCumulativeGpa >= 3.9) {
      return { title: 'Summa Cum Laude', badge: 'bg-amber-100 text-amber-950 border-amber-300' };
    }
    if (projectedCumulativeGpa >= 3.75) {
      return { title: 'Magna Cum Laude', badge: 'bg-emerald-100 text-emerald-950 border-emerald-300' };
    }
    if (projectedCumulativeGpa >= 3.5) {
      return { title: 'Cum Laude', badge: 'bg-blue-100 text-blue-950 border-blue-300' };
    }
    return { title: 'Good Standing', badge: 'bg-slate-100 text-slate-850 border-slate-300' };
  }, [projectedCumulativeGpa]);

  // Save current scenario
  const handleSaveScenario = () => {
    const newSaved = {
      name: `Scenario ${savedScenarios.length + 1} (${courses.length} courses)`,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      termGpa: projectedSemesterGpa,
      cumGpa: projectedCumulativeGpa
    };
    setSavedScenarios((prev) => [newSaved, ...prev]);
    setSaveToast('Projection snapshot saved to scenario list.');
    setTimeout(() => setSaveToast(null), 3000);
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 no-print ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#002366] font-display">
            <Calculator className="w-4 h-4 text-[#C5A059]" />
            <span>Academic Performance Forecaster</span>
          </div>
          <h2 className="text-lg font-bold font-display text-slate-900 mt-1">
            Predictive GPA Calculator & In-Progress Course Simulator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test projected course grades for current semester courses to model estimated semester & cumulative GPA impact.
          </p>
        </div>

        {/* Action controls / presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => applyPresetScenario('optimistic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              activeScenario === 'optimistic'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All A's (4.0)
          </button>
          <button
            type="button"
            onClick={() => applyPresetScenario('conservative')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              activeScenario === 'conservative'
                ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Conservative (3.0)
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors title='Reset to default in-progress courses'"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards: Current vs Estimated Outcome */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Cumulative GPA */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Current Cumulative GPA
            </span>
            <Award className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-display text-slate-900">
              {currentCumulativeGpa.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({currentAttemptedCredits} Attempted CR)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Conferred official baseline
          </div>
        </div>

        {/* Projected Semester GPA */}
        <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#002366]">
              Projected Semester GPA
            </span>
            <TrendingUp className="w-4 h-4 text-[#002366]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-display text-[#002366]">
              {projectedSemesterGpa.toFixed(2)}
            </span>
            <span className="text-xs text-blue-700 font-mono">
              ({projectedSemesterCredits} CR Sim.)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-blue-700 font-medium">
            {projectedSemesterQualityPoints.toFixed(1)} Quality Points
          </div>
        </div>

        {/* New Estimated Cumulative GPA */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
              Estimated Final Cumulative
            </span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-display text-emerald-950">
              {projectedCumulativeGpa.toFixed(2)}
            </span>
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded font-mono ${
                gpaDelta >= 0
                  ? 'bg-emerald-200 text-emerald-900'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {gpaDelta >= 0 ? `+${gpaDelta.toFixed(2)}` : gpaDelta.toFixed(2)}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-800 font-medium">
            Total {projectedTotalCredits} Credits Conferred
          </div>
        </div>

        {/* Projected Latin Honors */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
              Honors Standing Forecast
            </span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-base font-bold font-display text-amber-950 block">
              {honorsProjection.title}
            </span>
            <span className="text-[11px] text-amber-800 mt-0.5 block">
              {projectedCumulativeGpa >= 3.5 ? 'Qualifies for Commencement Honors' : 'Standard Degree Clearance'}
            </span>
          </div>
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSaveScenario}
              className="text-[11px] font-bold text-[#002366] hover:text-[#C5A059] flex items-center gap-1 transition-colors"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Snapshot Scenario</span>
            </button>
          </div>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-medium text-emerald-900 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Course List & Interactive Grade Selectors */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <BookOpen className="w-4 h-4 text-[#002366]" />
            <span>Active In-Progress Semester Coursework ({courses.length} Courses)</span>
          </div>
          <span className="text-xs text-slate-500">
            Select projected grade for each course to recalculate immediately
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-600">
                <th className="py-2.5 px-3 font-bold">Course Code</th>
                <th className="py-2.5 px-3 font-bold">Course Title</th>
                <th className="py-2.5 px-3 font-bold text-center">Credit Hours</th>
                <th className="py-2.5 px-3 font-bold">Projected Grade</th>
                <th className="py-2.5 px-3 font-bold text-center">Grade Points</th>
                <th className="py-2.5 px-3 font-bold text-right">Quality Points</th>
                <th className="py-2.5 px-3 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((course) => {
                const qp = course.creditHours * course.gradePoint;
                return (
                  <tr key={course.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#002366]">
                      {course.courseCode}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {course.courseTitle}
                      <span className="text-[10px] text-slate-400 block font-normal">
                        {course.term} • In Progress
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <select
                        value={course.creditHours}
                        onChange={(e) => handleCreditsChange(course.id, parseInt(e.target.value))}
                        className="px-2 py-1 rounded border border-slate-200 text-xs bg-white text-slate-800 font-mono"
                      >
                        <option value={1}>1 CR</option>
                        <option value={2}>2 CR</option>
                        <option value={3}>3 CR</option>
                        <option value={4}>4 CR</option>
                        <option value={6}>6 CR</option>
                      </select>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={course.projectedGrade}
                        onChange={(e) => handleGradeChange(course.id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-bold focus:ring-1 focus:ring-[#002366] focus:border-[#002366]"
                      >
                        {GRADE_SCALE.map((scale) => (
                          <option key={scale.grade} value={scale.grade}>
                            {scale.grade} — {scale.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700">
                      {course.gradePoint.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {qp.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveCourse(course.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Remove course from projection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {courses.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400 text-xs italic">
                    No in-progress courses in projection. Add coursework below to model GPA.
                  </td>
                </tr>
              )}
            </tbody>
            {courses.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50 border-t border-slate-200 font-bold text-slate-900">
                  <td colSpan={2} className="py-2.5 px-3 text-right text-xs">
                    Projected Semester Totals:
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-xs text-[#002366]">
                    {projectedSemesterCredits} CR
                  </td>
                  <td className="py-2.5 px-3 text-xs text-slate-600">
                    Sem. GPA: <strong className="text-[#002366]">{projectedSemesterGpa.toFixed(2)}</strong>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-xs">
                    —
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-xs text-[#002366]">
                    {projectedSemesterQualityPoints.toFixed(1)} QP
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Add Custom In-Progress Course & Target Goal Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1">
        
        {/* Quick Add In-Progress Course */}
        <form onSubmit={handleAddCourse} className="lg:col-span-7 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#002366]">
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>Add Additional In-Progress Course to Projection</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                Course Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. GRE-202"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                Course Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Intermediate Biblical Greek"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                Credit Hours
              </label>
              <select
                value={newCredits}
                onChange={(e) => setNewCredits(parseInt(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-mono"
              >
                <option value={1}>1 Credit Hour</option>
                <option value={2}>2 Credit Hours</option>
                <option value={3}>3 Credit Hours</option>
                <option value={4}>4 Credit Hours</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                Projected Grade
              </label>
              <select
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-bold"
              >
                {GRADE_SCALE.map((scale) => (
                  <option key={scale.grade} value={scale.grade}>
                    {scale.grade} ({scale.points.toFixed(1)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-1.5 px-3 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Add to Model</span>
              </button>
            </div>
          </div>
        </form>

        {/* Reverse Target GPA Solver */}
        <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Target Cumulative GPA Benchmark Solver</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Calculates the minimum semester GPA you need across current credits to hit your goal.
            </p>

            <div className="mt-3 flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700 shrink-0">
                Desired Cumulative:
              </label>
              <input
                type="number"
                step="0.01"
                min="2.0"
                max="4.0"
                value={targetGpaInput}
                onChange={(e) => setTargetGpaInput(e.target.value)}
                className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold font-mono text-[#002366]"
              />
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Required Semester GPA:</span>
              <span
                className={`font-mono font-bold text-sm ${
                  requiredSemesterGpaForTarget > 4.0
                    ? 'text-rose-600'
                    : requiredSemesterGpaForTarget <= 0
                    ? 'text-emerald-600'
                    : 'text-[#002366]'
                }`}
              >
                {requiredSemesterGpaForTarget > 4.0
                  ? 'Exceeds 4.0 Max'
                  : requiredSemesterGpaForTarget <= 0
                  ? 'Goal Already Surpassed'
                  : requiredSemesterGpaForTarget.toFixed(2)}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {requiredSemesterGpaForTarget > 4.0
                ? 'Target mathematically unreachable with current course credit count.'
                : `Need an average of ${requiredSemesterGpaForTarget.toFixed(2)} across your ${projectedSemesterCredits} current credits.`}
            </div>
          </div>
        </div>

      </div>

      {/* Saved Scenarios Strip */}
      {savedScenarios.length > 0 && (
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="text-xs font-bold text-slate-700">
            Saved Scenario Snapshots ({savedScenarios.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {savedScenarios.map((sc, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center gap-2"
              >
                <span className="font-bold text-slate-800">{sc.name}</span>
                <span className="text-slate-400 font-mono text-[10px]">{sc.date}</span>
                <span className="text-[#002366] font-mono font-bold">
                  Sem: {sc.termGpa.toFixed(2)}
                </span>
                <span className="text-emerald-700 font-mono font-bold">
                  Cum: {sc.cumGpa.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
