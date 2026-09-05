import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { GradeRecord, SemesterSummary } from '../../types';
import { GpaProgressChart } from './GpaProgressChart';
import { GradeDistributionPieChart } from './GradeDistributionPieChart';
import { DegreeCompletionProgressBar } from './DegreeCompletionProgressBar';
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Download,
  Filter,
  Printer,
  Search,
  SlidersHorizontal,
  FileText,
  Star,
  Sparkles,
  TrendingUp,
  Info,
  ChevronDown,
  ChevronUp,
  Building,
  UserCheck,
  HelpCircle,
  X,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

interface AcademicHistorySectionProps {
  onOpenTranscript?: () => void;
}

export const AcademicHistorySection: React.FC<AcademicHistorySectionProps> = ({ onOpenTranscript }) => {
  const { currentUser, grades, setCurrentView } = useApp();

  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grouped' | 'table'>('grouped');
  const [analyticsView, setAnalyticsView] = useState<'both' | 'gpa' | 'distribution'>('both');
  const [showGradeScaleModal, setShowGradeScaleModal] = useState<boolean>(false);
  const [expandedSemester, setExpandedSemester] = useState<{ [key: string]: boolean }>({
    'Spring 2026': true,
    'Fall 2025': true,
    'Spring 2025': true,
    'Fall 2024': true
  });

  // Filter student grades
  const studentGrades = useMemo(() => {
    return grades.filter((g) => g.studentId === currentUser.id);
  }, [grades, currentUser.id]);

  // Distinct semesters list in descending order
  const semesterTerms = useMemo(() => {
    const terms: string[] = Array.from(new Set(studentGrades.map((g) => g.semester)));
    // Sort logically: Spring 2026 -> Fall 2025 -> Spring 2025 -> Fall 2024
    const order = ['Spring 2026', 'Fall 2025', 'Spring 2025', 'Fall 2024'];
    return terms.sort((a: string, b: string) => {
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return b.localeCompare(a);
    });
  }, [studentGrades]);

  // Calculate Cumulative Metrics
  const cumulativeMetrics = useMemo(() => {
    const totalCourses = studentGrades.length;
    const courseCredits = studentGrades.reduce((sum, g) => sum + g.creditHours, 0);
    const totalQualityPoints = studentGrades.reduce((sum, g) => sum + (g.creditHours * g.gradePoint), 0);
    const calculatedGpa = courseCredits > 0 ? totalQualityPoints / courseCredits : (currentUser.gpa || 3.84);
    
    // RPL Conferred credits (30 credits)
    const rplCredits = 30;
    const totalCreditsConferred = currentUser.creditsEarned || (courseCredits + rplCredits);
    const degreeRequiredCredits = currentUser.totalRequiredCredits || 120;
    const degreeProgressPercent = Math.min(100, Math.round((totalCreditsConferred / degreeRequiredCredits) * 100));

    // A grades count
    const aGradesCount = studentGrades.filter((g) => g.letterGrade === 'A' || g.letterGrade === 'A-').length;

    return {
      totalCourses,
      courseCredits,
      rplCredits,
      totalCreditsConferred,
      degreeRequiredCredits,
      degreeProgressPercent,
      totalQualityPoints,
      cumulativeGpa: calculatedGpa,
      aGradesCount
    };
  }, [studentGrades, currentUser]);

  // Semester Summaries map
  const semesterSummaries = useMemo<SemesterSummary[]>(() => {
    return semesterTerms.map((term) => {
      const termCourses = studentGrades.filter((g) => g.semester === term);
      const creditsAttempted = termCourses.reduce((sum, c) => sum + c.creditHours, 0);
      const creditsEarned = termCourses.filter((c) => c.letterGrade !== 'F').reduce((sum, c) => sum + c.creditHours, 0);
      const totalQualityPoints = termCourses.reduce((sum, c) => sum + (c.creditHours * c.gradePoint), 0);
      const termGpa = creditsAttempted > 0 ? totalQualityPoints / creditsAttempted : 0;
      
      let academicStanding = "Good Standing";
      if (termGpa >= 3.9) {
        academicStanding = "President's Scholar List";
      } else if (termGpa >= 3.75) {
        academicStanding = "Dean's Honor List";
      }

      const year = termCourses[0]?.year || parseInt(term.split(' ')[1], 10) || 2026;

      return {
        term,
        year,
        courses: termCourses,
        creditsAttempted,
        creditsEarned,
        totalQualityPoints,
        termGpa,
        academicStanding
      };
    });
  }, [semesterTerms, studentGrades]);

  // Filtered courses based on search and filters
  const filteredCourses = useMemo(() => {
    return studentGrades.filter((course) => {
      // Semester filter
      if (selectedSemester !== 'all' && course.semester !== selectedSemester) {
        return false;
      }

      // Grade filter
      if (selectedGradeFilter !== 'all') {
        if (selectedGradeFilter === 'A' && course.letterGrade !== 'A' && course.letterGrade !== 'A-') {
          return false;
        }
        if (selectedGradeFilter === 'B' && course.letterGrade !== 'B+' && course.letterGrade !== 'B' && course.letterGrade !== 'B-') {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesCode = course.courseCode.toLowerCase().includes(q);
        const matchesTitle = course.courseTitle.toLowerCase().includes(q);
        const matchesInstructor = course.instructorName?.toLowerCase().includes(q);
        const matchesSchool = course.schoolName?.toLowerCase().includes(q);
        if (!matchesCode && !matchesTitle && !matchesInstructor && !matchesSchool) {
          return false;
        }
      }

      return true;
    });
  }, [studentGrades, selectedSemester, selectedGradeFilter, searchQuery]);

  // Toggle semester expand
  const toggleSemester = (term: string) => {
    setExpandedSemester((prev) => ({
      ...prev,
      [term]: !prev[term]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const getGradeBadgeClass = (letter: string) => {
    switch (letter) {
      case 'A':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-black';
      case 'A-':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold';
      case 'B+':
        return 'bg-blue-100 text-blue-800 border-blue-300 font-bold';
      case 'B':
      case 'B-':
        return 'bg-blue-50 text-blue-700 border-blue-200 font-medium';
      case 'C+':
      case 'C':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-medium';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div id="student-academic-history-section" className="space-y-6">
      {/* 1. Header & Quick Actions Banner */}
      <div className="bg-gradient-to-r from-[#001744] via-[#002366] to-[#0A3078] rounded-2xl text-white p-6 sm:p-8 shadow-md border-b-4 border-[#C5A059] relative overflow-hidden">
        {/* Background decorative watermark */}
        <div className="absolute right-0 top-0 bottom-0 opacity-5 pointer-events-none flex items-center pr-8">
          <GraduationCap className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Office of the University Registrar • Academic Records</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              Academic Course History & Grade Performance
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              Official semester record of completed undergraduate coursework, letter grades, quality points, and certified Recognition of Prior Learning (RPL) credit transfers for <strong>{currentUser.name}</strong> ({currentUser.programName || 'Bachelor of Theology (B.Th)'}).
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 no-print">
            <button
              id="academic-history-print-btn"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 hover:border-[#C5A059]"
              title="Print Unofficial Academic Record"
            >
              <Printer className="w-4 h-4 text-[#C5A059]" />
              <span>Print Record</span>
            </button>

            <button
              id="academic-history-view-transcript-btn"
              onClick={onOpenTranscript || (() => setCurrentView('transcript'))}
              className="px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2 hover:scale-102"
              title="View Official Registrar Transcript"
            >
              <FileText className="w-4 h-4 text-[#002366]" />
              <span>Official Transcript</span>
            </button>

            <button
              id="academic-history-grading-scale-btn"
              onClick={() => setShowGradeScaleModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#001A4D] hover:bg-[#001233] text-slate-200 border border-white/20 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
              title="View University Grading Scale Rubric"
            >
              <Info className="w-4 h-4 text-[#C5A059]" />
              <span>Grade Scale</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Degree Program Credit Hours Completion Progress Bar Feature */}
      <DegreeCompletionProgressBar
        currentUser={currentUser}
        courseCredits={cumulativeMetrics.courseCredits}
        rplCredits={cumulativeMetrics.rplCredits}
        totalCreditsConferred={cumulativeMetrics.totalCreditsConferred}
        degreeRequiredCredits={cumulativeMetrics.degreeRequiredCredits}
        degreeProgressPercent={cumulativeMetrics.degreeProgressPercent}
        totalCourses={cumulativeMetrics.totalCourses}
        cumulativeGpa={cumulativeMetrics.cumulativeGpa}
      />

      {/* 3. Cumulative Academic Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cumulative GPA Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cumulative GPA</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
              Dean's Honor List
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-display text-[#002366]">
              {cumulativeMetrics.cumulativeGpa.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 font-bold">/ 4.00 Scale</span>
          </div>
          <div className="text-xs text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Quality Points:</span>
            <strong className="text-slate-800 font-mono">{cumulativeMetrics.totalQualityPoints.toFixed(1)} Pts</strong>
          </div>
        </div>

        {/* Total Credits Conferred Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Credits Earned</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800">
              {cumulativeMetrics.degreeProgressPercent}% Complete
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-display text-[#002366]">
              {cumulativeMetrics.totalCreditsConferred}
            </span>
            <span className="text-xs text-slate-500 font-bold">/ {cumulativeMetrics.degreeRequiredCredits} Req.</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#002366] h-full rounded-full transition-all duration-500"
              style={{ width: `${cumulativeMetrics.degreeProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Coursework & RPL Breakdown Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Course Units</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#002366] text-white">
              {cumulativeMetrics.totalCourses} Courses
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-xs flex items-center justify-between">
              <span className="text-slate-600">Classroom Coursework:</span>
              <strong className="text-[#002366] font-mono font-bold">{cumulativeMetrics.courseCredits} Credits</strong>
            </div>
            <div className="text-xs flex items-center justify-between">
              <span className="text-slate-600">Conferred RPL Credits:</span>
              <strong className="text-emerald-700 font-mono font-bold">{cumulativeMetrics.rplCredits} Credits</strong>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Completion Rate:</span>
            <span className="font-bold text-emerald-600">100% Passed</span>
          </div>
        </div>

        {/* Academic Standing & Honors Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Degree Distinction</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
              Summa Cum Laude Track
            </span>
          </div>
          <div>
            <div className="text-sm font-bold text-[#002366] font-display">
              President's & Dean's Honor Roll
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Consistent GPA &gt; 3.80 across 4 active semesters
            </div>
          </div>
          <div className="text-xs text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Grade A / A- Ratio:</span>
            <strong className="text-emerald-700 font-mono font-bold">
              {cumulativeMetrics.aGradesCount} / {cumulativeMetrics.totalCourses} (94%)
            </strong>
          </div>
        </div>
      </div>

      {/* Dynamic Academic Visual Analytics Suite (Recharts) */}
      <div className="space-y-4">
        {/* Visual Analytics Mode Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#002366] text-[#C5A059]">
              <BarChart3 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-display font-black text-[#002366] leading-tight">
                Academic Performance Visual Analytics
              </h3>
              <p className="text-xs text-slate-500">
                Visualizing semester-by-semester GPA trends and career-long letter grade distribution.
              </p>
            </div>
          </div>

          <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200 shrink-0">
            <button
              id="analytics-view-both-btn"
              onClick={() => setAnalyticsView('both')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                analyticsView === 'both'
                  ? 'bg-[#002366] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Side-by-Side
            </button>
            <button
              id="analytics-view-gpa-btn"
              onClick={() => setAnalyticsView('gpa')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                analyticsView === 'gpa'
                  ? 'bg-[#002366] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              GPA Progress (Bar)
            </button>
            <button
              id="analytics-view-pie-btn"
              onClick={() => setAnalyticsView('distribution')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                analyticsView === 'distribution'
                  ? 'bg-[#002366] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Grade Distribution (Pie)
            </button>
          </div>
        </div>

        {/* View Mode: Side-by-Side (7 cols Bar, 5 cols Pie on large screens) */}
        {analyticsView === 'both' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <GpaProgressChart
                studentGrades={studentGrades}
                currentCumulativeGpa={cumulativeMetrics.cumulativeGpa}
              />
            </div>
            <div className="lg:col-span-5">
              <GradeDistributionPieChart
                studentGrades={studentGrades}
                onSelectGradeFilter={(letter) => setSelectedGradeFilter(letter)}
              />
            </div>
          </div>
        )}

        {/* View Mode: Full-width GPA Progress Bar Chart */}
        {analyticsView === 'gpa' && (
          <GpaProgressChart
            studentGrades={studentGrades}
            currentCumulativeGpa={cumulativeMetrics.cumulativeGpa}
          />
        )}

        {/* View Mode: Full-width Letter Grade Distribution Pie Chart */}
        {analyticsView === 'distribution' && (
          <GradeDistributionPieChart
            studentGrades={studentGrades}
            onSelectGradeFilter={(letter) => setSelectedGradeFilter(letter)}
          />
        )}
      </div>

      {/* 3. Search & Filter Controls Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="academic-history-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course title, code (e.g., THE-201, GRE-101), instructor..."
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#002366] focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle & Clear Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200">
              <button
                id="academic-history-view-grouped-btn"
                onClick={() => setViewMode('grouped')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  viewMode === 'grouped'
                    ? 'bg-[#002366] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Grouped by Semester
              </button>
              <button
                id="academic-history-view-table-btn"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#002366] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Unified Table
              </button>
            </div>

            {(searchQuery || selectedSemester !== 'all' || selectedGradeFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSemester('all');
                  setSelectedGradeFilter('all');
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 underline flex items-center gap-1"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Filters Row: Semesters & Grades */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Term:
          </span>

          <button
            onClick={() => setSelectedSemester('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedSemester === 'all'
                ? 'bg-[#002366] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Semesters ({studentGrades.length})
          </button>

          {semesterTerms.map((term) => (
            <button
              key={term}
              onClick={() => setSelectedSemester(term)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedSemester === term
                  ? 'bg-[#002366] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {term}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-200 mx-2 hidden sm:block" />

          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
            Grade:
          </span>

          <button
            onClick={() => setSelectedGradeFilter('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium ${
              selectedGradeFilter === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Grades
          </button>
          <button
            onClick={() => setSelectedGradeFilter('A')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium ${
              selectedGradeFilter === 'A'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            A / A- Only
          </button>
          <button
            onClick={() => setSelectedGradeFilter('B')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium ${
              selectedGradeFilter === 'B'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            B+ Only
          </button>
        </div>
      </div>

      {/* 4. Main Course Presentation */}
      {viewMode === 'grouped' ? (
        /* SEMESTER-BY-SEMESTER GROUPED VIEW */
        <div className="space-y-6">
          {semesterSummaries
            .filter((sem) => selectedSemester === 'all' || sem.term === selectedSemester)
            .map((sem) => {
              const coursesInSemester = sem.courses.filter((c) => {
                if (selectedGradeFilter === 'A' && c.letterGrade !== 'A' && c.letterGrade !== 'A-') return false;
                if (selectedGradeFilter === 'B' && c.letterGrade !== 'B+' && c.letterGrade !== 'B' && c.letterGrade !== 'B-') return false;
                if (searchQuery.trim()) {
                  const q = searchQuery.toLowerCase();
                  return (
                    c.courseCode.toLowerCase().includes(q) ||
                    c.courseTitle.toLowerCase().includes(q) ||
                    c.instructorName?.toLowerCase().includes(q)
                  );
                }
                return true;
              });

              if (coursesInSemester.length === 0 && searchQuery) {
                return null;
              }

              const isExpanded = expandedSemester[sem.term] !== false;

              return (
                <div
                  key={sem.term}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
                >
                  {/* Semester Header Card with Summary Metrics */}
                  <div
                    onClick={() => toggleSemester(sem.term)}
                    className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-slate-50 to-amber-50/40 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-100/70 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#002366] text-white flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-[#C5A059]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold font-display text-[#002366]">
                            {sem.term} Semester
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {sem.academicStanding}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Academic Year {sem.year} • Undergraduate Biblical & Theological Studies
                        </p>
                      </div>
                    </div>

                    {/* Semester Summary Strip */}
                    <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Term Credits</div>
                        <div className="text-xs font-bold text-slate-800 font-mono">
                          {sem.creditsEarned} Earned <span className="text-slate-400">({sem.creditsAttempted} Att.)</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Quality Points</div>
                        <div className="text-xs font-bold text-slate-800 font-mono">
                          {sem.totalQualityPoints.toFixed(1)} Pts
                        </div>
                      </div>

                      <div className="text-right bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Term GPA</div>
                        <div className="text-base font-black font-display text-[#002366]">
                          {sem.termGpa.toFixed(2)}
                        </div>
                      </div>

                      <div className="text-slate-400 hover:text-slate-600 pl-2">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Course Table for this Semester */}
                  {isExpanded && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#F8F9FB] text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                            <th className="py-3 px-4">Course Code</th>
                            <th className="py-3 px-4">Course Title & Department</th>
                            <th className="py-3 px-3 text-center">Credit Hours</th>
                            <th className="py-3 px-3 text-center">Assignments</th>
                            <th className="py-3 px-3 text-center">Quizzes</th>
                            <th className="py-3 px-3 text-center">Final Exam</th>
                            <th className="py-3 px-3 text-center">Total Score</th>
                            <th className="py-3 px-3 text-center">Grade</th>
                            <th className="py-3 px-3 text-center">Grade Point</th>
                            <th className="py-3 px-3 text-center">Quality Pts</th>
                            <th className="py-3 px-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {coursesInSemester.map((course) => {
                            const qualityPoints = (course.creditHours * course.gradePoint).toFixed(1);
                            return (
                              <tr key={course.id} className="hover:bg-slate-50/80 transition-colors">
                                {/* Course Code */}
                                <td className="py-3.5 px-4 font-mono font-bold text-[#002366] whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                                    {course.courseCode}
                                  </span>
                                </td>

                                {/* Course Title & Instructor */}
                                <td className="py-3.5 px-4">
                                  <div className="font-bold text-slate-900 leading-snug">
                                    {course.courseTitle}
                                  </div>
                                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                                    {course.instructorName && (
                                      <span>Instructor: <strong>{course.instructorName}</strong></span>
                                    )}
                                    {course.schoolName && (
                                      <span className="text-slate-400">• {course.schoolName}</span>
                                    )}
                                  </div>
                                </td>

                                {/* Credit Hours */}
                                <td className="py-3.5 px-3 text-center font-bold text-slate-800">
                                  {course.creditHours}.0
                                </td>

                                {/* Assignment Score */}
                                <td className="py-3.5 px-3 text-center font-mono text-slate-700">
                                  {course.assignmentScore}%
                                </td>

                                {/* Quiz Score */}
                                <td className="py-3.5 px-3 text-center font-mono text-slate-700">
                                  {course.quizScore}%
                                </td>

                                {/* Exam Score */}
                                <td className="py-3.5 px-3 text-center font-mono text-slate-700">
                                  {course.examScore}%
                                </td>

                                {/* Total Score */}
                                <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-900">
                                  <span className="px-1.5 py-0.5 rounded bg-slate-100">
                                    {course.totalScore}%
                                  </span>
                                </td>

                                {/* Letter Grade */}
                                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs border ${getGradeBadgeClass(course.letterGrade)}`}>
                                    {course.letterGrade}
                                  </span>
                                </td>

                                {/* Grade Point */}
                                <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-800">
                                  {course.gradePoint.toFixed(2)}
                                </td>

                                {/* Quality Points */}
                                <td className="py-3.5 px-3 text-center font-mono font-bold text-[#002366]">
                                  {qualityPoints}
                                </td>

                                {/* Status */}
                                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    Completed
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      ) : (
        /* UNIFIED ALL COURSES TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#002366] text-white font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Course Title & Department</th>
                  <th className="py-3.5 px-3 text-center">Semester</th>
                  <th className="py-3.5 px-3 text-center">Credits</th>
                  <th className="py-3.5 px-3 text-center">Assessments</th>
                  <th className="py-3.5 px-3 text-center">Total</th>
                  <th className="py-3.5 px-3 text-center">Grade</th>
                  <th className="py-3.5 px-3 text-center">Grade Point</th>
                  <th className="py-3.5 px-3 text-center">Quality Pts</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((course) => {
                  const qualityPoints = (course.creditHours * course.gradePoint).toFixed(1);
                  return (
                    <tr key={course.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#002366] whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                          {course.courseCode}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 leading-snug">
                          {course.courseTitle}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {course.instructorName} • {course.schoolName}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center font-bold text-slate-700 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px]">
                          {course.semester}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center font-bold text-slate-800">
                        {course.creditHours}.0
                      </td>

                      <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        Asg: {course.assignmentScore}% • Qz: {course.quizScore}% • Exm: {course.examScore}%
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                        {course.totalScore}%
                      </td>

                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs border ${getGradeBadgeClass(course.letterGrade)}`}>
                          {course.letterGrade}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                        {course.gradePoint.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-bold text-[#002366]">
                        {qualityPoints}
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Completed
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Prior Learning (RPL) Conferred Advanced Standing Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#C5A059] flex items-center justify-center border border-[#C5A059]/30">
              <Award className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display text-[#002366]">
                  Conferred Recognition of Prior Learning (RPL) Credits
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Certified Conferred
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Accredited Prior Learning Portfolio Assessment • Office of the Registrar & Academic Council Evaluation
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6">
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Conferred Credits</div>
            <div className="text-xl font-black font-display text-[#002366]">
              30.0 Credit Hours
            </div>
            <div className="text-[10px] text-slate-500">Grade Designation: Pass / Credit (CR)</div>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The BIBU Academic Council and Office of the Registrar have evaluated and ratified <strong>30 academic credits</strong> based on 10+ years of active Senior Pastoral Leadership, Church Planting initiatives, and Biblical Counseling practice. These credits satisfy lower-division practical theology requirements toward the 120-credit Bachelor of Theology (B.Th) degree.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">Pastoral Ministry Field Practice</div>
              <div className="text-[11px] text-slate-500">Code: RPL-PAS-200</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
              6.0 Credits
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">Homiletics & Expository Preaching</div>
              <div className="text-[11px] text-slate-500">Code: RPL-HOM-201</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
              6.0 Credits
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">Biblical Counseling in Ministry</div>
              <div className="text-[11px] text-slate-500">Code: RPL-COU-202</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
              6.0 Credits
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">Christian Leadership & Governance</div>
              <div className="text-[11px] text-slate-500">Code: RPL-LED-203</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
              6.0 Credits
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">Cross-Cultural Evangelism & Missions</div>
              <div className="text-[11px] text-slate-500">Code: RPL-MIS-204</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
              6.0 Credits
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#002366]">Official Verification Code</div>
              <div className="text-[11px] text-slate-500 font-mono">BIBU-RPL-2024-DEV881</div>
            </div>
            <UserCheck className="w-5 h-5 text-[#C5A059]" />
          </div>
        </div>
      </div>

      {/* 6. University Registrar Accreditation Statement */}
      <div className="bg-[#002366] rounded-2xl text-white p-6 shadow-md border-t-2 border-[#C5A059] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 max-w-2xl">
          <div className="text-xs uppercase tracking-wider font-bold text-[#C5A059] font-display flex items-center gap-2">
            <Building className="w-4 h-4" />
            <span>Institutional Registrar Certification</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            All course grades and credits displayed in this Academic History have been ratified and permanently entered into the University Student Information System. Official transcripts bearing the raised university seal can be requested or printed at any time via the Registrar Portal.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenTranscript || (() => setCurrentView('transcript'))}
            className="px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Official Registrar Transcript</span>
          </button>
        </div>
      </div>

      {/* Grade Scale Modal */}
      {showGradeScaleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#002366] text-[#C5A059]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display text-[#002366]">
                    Official University Grading Rubric
                  </h3>
                  <p className="text-xs text-slate-500">Breakthrough International Bible University (BIBU)</p>
                </div>
              </div>
              <button
                onClick={() => setShowGradeScaleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-3">Percentage</th>
                    <th className="py-2.5 px-3 text-center">Grade Point</th>
                    <th className="py-2.5 px-3">Academic Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 px-3 font-bold text-emerald-700">A</td>
                    <td className="py-2 px-3 font-mono">93% – 100%</td>
                    <td className="py-2 px-3 text-center font-bold font-mono text-[#002366]">4.00</td>
                    <td className="py-2 px-3 text-slate-700">Superior / Highest Honors</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-emerald-600">A-</td>
                    <td className="py-2 px-3 font-mono">90% – 92%</td>
                    <td className="py-2 px-3 text-center font-bold font-mono text-[#002366]">3.70</td>
                    <td className="py-2 px-3 text-slate-700">Excellent Achievement</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-blue-700">B+</td>
                    <td className="py-2 px-3 font-mono">87% – 89%</td>
                    <td className="py-2 px-3 text-center font-bold font-mono text-[#002366]">3.30</td>
                    <td className="py-2 px-3 text-slate-700">Very Good / Commendable</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-blue-600">B</td>
                    <td className="py-2 px-3 font-mono">83% – 86%</td>
                    <td className="py-2 px-3 text-center font-bold font-mono text-[#002366]">3.00</td>
                    <td className="py-2 px-3 text-slate-700">Good / Above Average</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-blue-500">B-</td>
                    <td className="py-2 px-3 font-mono">80% – 82%</td>
                    <td className="py-2 px-3 text-center font-bold font-mono text-[#002366]">2.70</td>
                    <td className="py-2 px-3 text-slate-700">Satisfactory Performance</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-amber-700">C+</td>
                    <td className="py-2 px-3 font-mono">77% – 79%</td>
                    <td className="py-2 px-3 text-center font-bold font-mono text-[#002366]">2.30</td>
                    <td className="py-2 px-3 text-slate-700">Average Competence</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-amber-600">C</td>
                    <td className="py-2 px-3 font-mono">70% – 76%</td>
                    <td className="py-2 px-3 text-center font-bold font-mono text-[#002366]">2.00</td>
                    <td className="py-2 px-3 text-slate-700">Passing Grade</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-rose-700">F</td>
                    <td className="py-2 px-3 font-mono">&lt; 60%</td>
                    <td className="py-2 px-3 text-center font-bold font-mono text-rose-700">0.00</td>
                    <td className="py-2 px-3 text-rose-700">Failing (No Credit)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-700">CR</td>
                    <td className="py-2 px-3 font-mono">—</td>
                    <td className="py-2 px-3 text-center font-bold font-mono text-slate-600">—</td>
                    <td className="py-2 px-3 text-slate-700">Credit Conferred (RPL / Transfer)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
              <strong>Graduation Honors Requirements:</strong><br />
              • Summa Cum Laude: Cumulative GPA 3.90 – 4.00<br />
              • Magna Cum Laude: Cumulative GPA 3.75 – 3.89<br />
              • Cum Laude: Cumulative GPA 3.50 – 3.74
            </div>

            <button
              onClick={() => setShowGradeScaleModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Close Rubric
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
