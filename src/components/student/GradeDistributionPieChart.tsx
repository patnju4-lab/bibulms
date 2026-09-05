import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { GradeRecord } from '../../types';
import {
  Award,
  PieChart as PieChartIcon,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Star,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

interface GradeDistributionPieChartProps {
  studentGrades: GradeRecord[];
  compact?: boolean;
  onSelectGradeFilter?: (gradeLetter: string) => void;
}

interface GradeSlice {
  name: string;
  letter: string;
  count: number;
  percentage: number;
  credits: number;
  qualityPoints: number;
  color: string;
  description: string;
  courses: string[];
}

// Sophisticated institutional color palette matching Biblical University brand
const GRADE_FAMILY_COLORS: Record<string, { color: string; description: string }> = {
  A: { color: '#002366', description: 'Superior / Excellent (3.70 - 4.00 GP)' },
  B: { color: '#2563EB', description: 'Very Good / Commendable (3.00 - 3.30 GP)' },
  C: { color: '#D97706', description: 'Satisfactory / Competent (2.00 - 2.70 GP)' },
  D: { color: '#EA580C', description: 'Minimal Passing (1.00 - 1.70 GP)' },
  F: { color: '#DC2626', description: 'Failing / No Credit (0.00 GP)' }
};

const EXACT_GRADE_COLORS: Record<string, { color: string; description: string }> = {
  'A+': { color: '#C5A059', description: 'Highest Distinction (4.00 GP)' },
  'A': { color: '#002366', description: 'Superior Scholarship (4.00 GP)' },
  'A-': { color: '#1E3A8A', description: 'Excellent Scholarship (3.70 GP)' },
  'B+': { color: '#2563EB', description: 'Very Good Honors (3.30 GP)' },
  'B': { color: '#3B82F6', description: 'Good Standard (3.00 GP)' },
  'B-': { color: '#60A5FA', description: 'Competent Above Average (2.70 GP)' },
  'C+': { color: '#D97706', description: 'Adequate Performance (2.30 GP)' },
  'C': { color: '#F59E0B', description: 'Average Passing (2.00 GP)' },
  'C-': { color: '#FBBF24', description: 'Minimal Passing (1.70 GP)' },
  'D': { color: '#EA580C', description: 'Deficient Passing (1.00 GP)' },
  'F': { color: '#DC2626', description: 'Failing / Non-Completion (0.00 GP)' }
};

export const GradeDistributionPieChart: React.FC<GradeDistributionPieChartProps> = ({
  studentGrades,
  compact = false,
  onSelectGradeFilter
}) => {
  const [viewType, setViewType] = useState<'family' | 'exact'>('family');
  const [chartShape, setChartShape] = useState<'donut' | 'solid'>('donut');
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Compute Grade Slices
  const { slices, totalCourses, totalCredits, dominantGrade, honorsRatio } = useMemo(() => {
    if (!studentGrades || studentGrades.length === 0) {
      return {
        slices: [],
        totalCourses: 0,
        totalCredits: 0,
        dominantGrade: null,
        honorsRatio: 0
      };
    }

    const total = studentGrades.length;
    const creditsSum = studentGrades.reduce((sum, g) => sum + g.creditHours, 0);

    if (viewType === 'family') {
      // Group by broad letter family: A (A, A-, A+), B (B+, B, B-), C (C+, C, C-), D, F
      const familyGroups: Record<string, GradeRecord[]> = {
        A: [],
        B: [],
        C: [],
        D: [],
        F: []
      };

      studentGrades.forEach((g) => {
        const firstChar = (g.letterGrade || 'F').charAt(0).toUpperCase();
        if (familyGroups[firstChar]) {
          familyGroups[firstChar].push(g);
        } else {
          familyGroups['F'].push(g);
        }
      });

      const list: GradeSlice[] = Object.entries(familyGroups)
        .filter(([_, courses]) => courses.length > 0)
        .map(([letter, courses]) => {
          const count = courses.length;
          const percentage = Number(((count / total) * 100).toFixed(1));
          const credits = courses.reduce((sum, c) => sum + c.creditHours, 0);
          const qualityPoints = courses.reduce((sum, c) => sum + c.creditHours * c.gradePoint, 0);
          const config = GRADE_FAMILY_COLORS[letter] || {
            color: '#64748B',
            description: 'Academic Record'
          };

          return {
            name: `Grade ${letter} (${letter}+ / ${letter} / ${letter}-)`,
            letter,
            count,
            percentage,
            credits,
            qualityPoints,
            color: config.color,
            description: config.description,
            courses: courses.map((c) => `${c.courseCode}: ${c.courseTitle}`)
          };
        })
        .sort((a, b) => {
          const order = ['A', 'B', 'C', 'D', 'F'];
          return order.indexOf(a.letter) - order.indexOf(b.letter);
        });

      // Dominant grade
      const sortedByCount = [...list].sort((a, b) => b.count - a.count);
      const dom = sortedByCount[0] || null;

      // Honors ratio (A and B grades)
      const honorsCount = list
        .filter((s) => s.letter === 'A' || s.letter === 'B')
        .reduce((sum, s) => sum + s.count, 0);
      const hRatio = Number(((honorsCount / total) * 100).toFixed(1));

      return {
        slices: list,
        totalCourses: total,
        totalCredits: creditsSum,
        dominantGrade: dom,
        honorsRatio: hRatio
      };
    } else {
      // Exact letter grades: A, A-, B+, B, etc.
      const exactGroups: Record<string, GradeRecord[]> = {};

      studentGrades.forEach((g) => {
        const grade = g.letterGrade.trim().toUpperCase();
        if (!exactGroups[grade]) {
          exactGroups[grade] = [];
        }
        exactGroups[grade].push(g);
      });

      const exactOrder = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];

      const list: GradeSlice[] = Object.entries(exactGroups)
        .map(([grade, courses]) => {
          const count = courses.length;
          const percentage = Number(((count / total) * 100).toFixed(1));
          const credits = courses.reduce((sum, c) => sum + c.creditHours, 0);
          const qualityPoints = courses.reduce((sum, c) => sum + c.creditHours * c.gradePoint, 0);
          const config = EXACT_GRADE_COLORS[grade] || {
            color: '#002366',
            description: 'Completed Grade'
          };

          return {
            name: `Grade ${grade}`,
            letter: grade,
            count,
            percentage,
            credits,
            qualityPoints,
            color: config.color,
            description: config.description,
            courses: courses.map((c) => `${c.courseCode}: ${c.courseTitle}`)
          };
        })
        .sort((a, b) => {
          const idxA = exactOrder.indexOf(a.letter);
          const idxB = exactOrder.indexOf(b.letter);
          return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
        });

      const sortedByCount = [...list].sort((a, b) => b.count - a.count);
      const dom = sortedByCount[0] || null;

      const aGradesCount = list
        .filter((s) => s.letter.startsWith('A'))
        .reduce((sum, s) => sum + s.count, 0);
      const hRatio = Number(((aGradesCount / total) * 100).toFixed(1));

      return {
        slices: list,
        totalCourses: total,
        totalCredits: creditsSum,
        dominantGrade: dom,
        honorsRatio: hRatio
      };
    }
  }, [studentGrades, viewType]);

  if (!studentGrades || studentGrades.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-500">
        <p className="text-xs">No academic grade records found to calculate letter grade distribution.</p>
      </div>
    );
  }

  // Custom Pie Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: GradeSlice = payload[0]?.payload;
      if (!data) return null;

      return (
        <div className="bg-[#001744] text-white p-4 rounded-xl shadow-2xl border-2 border-[#C5A059] max-w-xs text-xs space-y-2 z-50">
          <div className="flex items-center justify-between border-b border-white/20 pb-2">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: data.color }}
              />
              <span className="font-display font-black text-sm text-[#C5A059]">
                {data.name}
              </span>
            </div>
            <span className="font-mono font-bold text-xs bg-white/10 px-2 py-0.5 rounded text-white">
              {data.percentage}%
            </span>
          </div>

          <div className="space-y-1 text-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Courses:</span>
              <span className="font-bold text-white">{data.count} Courses</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Credits:</span>
              <span className="font-bold text-white">{data.credits} Semester Credits</span>
            </div>
            <div className="text-[11px] text-slate-300 pt-1 border-t border-white/10 italic">
              {data.description}
            </div>
          </div>

          {data.courses && data.courses.length > 0 && (
            <div className="pt-2 border-t border-white/10 text-[10px] space-y-1">
              <span className="text-slate-400 font-semibold block uppercase tracking-wider">
                Sample Courses in this Grade:
              </span>
              <div className="max-h-20 overflow-y-auto space-y-0.5 text-slate-300">
                {data.courses.slice(0, 3).map((c, i) => (
                  <div key={i} className="truncate">• {c}</div>
                ))}
                {data.courses.length > 3 && (
                  <div className="text-slate-400 italic">
                    +{data.courses.length - 3} more course(s)
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Compact layout (for StudentDashboard right column widget)
  if (compact) {
    return (
      <div id="student-compact-grade-distribution-card" className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5">
            <PieChartIcon className="w-4 h-4 text-[#C5A059]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#002366]">
              Career Grade Distribution
            </h4>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#002366]/10 text-[#002366]">
            {totalCourses} Courses
          </span>
        </div>

        {/* Mini Pie Chart with Center Stats */}
        <div className="relative w-full h-44 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={66}
                paddingAngle={3}
                dataKey="count"
                nameKey="letter"
                animationDuration={800}
              >
                {slices.map((entry, index) => (
                  <Cell
                    key={`compact-cell-${index}`}
                    fill={entry.color}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Donut KPI Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-black font-display text-[#002366] leading-none">
              {dominantGrade ? `${dominantGrade.percentage}%` : '100%'}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
              {dominantGrade ? `Grade ${dominantGrade.letter}` : 'Distinction'}
            </span>
          </div>
        </div>

        {/* Compact Legend Chips */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {slices.map((slice) => (
            <div
              key={slice.letter}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="font-bold text-slate-800 text-[11px] truncate">
                  Grade {slice.letter}
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold text-slate-600 shrink-0">
                {slice.count} ({slice.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full Rich Academic Performance Layout (for AcademicHistorySection / Full Analytics)
  return (
    <div
      id="student-grade-distribution-pie-card"
      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5"
    >
      {/* 1. Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#002366] text-[#C5A059]">
              <PieChartIcon className="w-4 h-4" />
            </div>
            <h3 className="text-base font-display font-black text-[#002366] tracking-tight">
              Academic Career Grade Distribution • Letter Grades
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Comprehensive breakdown of letter grades across all {totalCourses} completed Biblical &amp; Theological courses ({totalCredits} Total Credits).
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Grouping Mode */}
          <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              id="grade-pie-mode-family-btn"
              onClick={() => setViewType('family')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewType === 'family'
                  ? 'bg-[#002366] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Group into standard letter families (A, B, C, D, F)"
            >
              Grade Families (A, B, C)
            </button>
            <button
              id="grade-pie-mode-exact-btn"
              onClick={() => setViewType('exact')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewType === 'exact'
                  ? 'bg-[#002366] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Show exact earned letter grades (A, A-, B+, B...)"
            >
              Exact Grades (A, A-, B+)
            </button>
          </div>

          {/* Donut vs Solid Pie Shape */}
          <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              id="grade-pie-shape-donut-btn"
              onClick={() => setChartShape('donut')}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                chartShape === 'donut'
                  ? 'bg-white text-[#002366] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Donut
            </button>
            <button
              id="grade-pie-shape-solid-btn"
              onClick={() => setChartShape('solid')}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                chartShape === 'solid'
                  ? 'bg-white text-[#002366] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pie
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Academic Standing Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200/80">
        <div className="px-3 py-1.5 border-r border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Dominant Letter Grade
          </span>
          <div className="text-base font-black font-display text-[#002366] flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full inline-block shrink-0"
              style={{ backgroundColor: dominantGrade?.color || '#002366' }}
            />
            <span>Grade {dominantGrade?.letter || 'A'}</span>
            <span className="text-xs text-slate-500 font-normal">
              ({dominantGrade?.percentage}%)
            </span>
          </div>
        </div>

        <div className="px-3 py-1.5 sm:border-r sm:border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Dean’s &amp; Honors Ratio
          </span>
          <div className="text-base font-black font-display text-emerald-700 flex items-center gap-1">
            <Star className="w-4 h-4 fill-emerald-600 text-emerald-600 shrink-0" />
            <span>{honorsRatio}%</span>
            <span className="text-xs text-slate-500 font-normal">
              ({viewType === 'family' ? 'A/B Grades' : 'A-Range'})
            </span>
          </div>
        </div>

        <div className="px-3 py-1.5 border-r border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Coursework Graded
          </span>
          <div className="text-base font-black font-display text-slate-800">
            {totalCourses} Courses
            <span className="text-xs text-slate-400 font-normal ml-1">
              ({totalCredits} Cr)
            </span>
          </div>
        </div>

        <div className="px-3 py-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Grade Quality Distribution
          </span>
          <div className="text-base font-black font-display text-[#C5A059] flex items-center gap-1">
            <Award className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>Dean’s Honors</span>
          </div>
        </div>
      </div>

      {/* 3. Main Chart & Slices Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Recharts Dynamic Pie Chart */}
        <div className="lg:col-span-6 relative w-full h-72 flex items-center justify-center select-none">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                cx="50%"
                cy="50%"
                innerRadius={chartShape === 'donut' ? 70 : 0}
                outerRadius={95}
                paddingAngle={chartShape === 'donut' ? 3 : 1}
                dataKey="count"
                nameKey="letter"
                animationDuration={900}
                onMouseEnter={(_, index) => setHoveredSlice(slices[index]?.letter || null)}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                {slices.map((entry, index) => {
                  const isHovered = hoveredSlice === entry.letter;
                  return (
                    <Cell
                      key={`pie-cell-${index}`}
                      fill={entry.color}
                      stroke={isHovered ? '#C5A059' : '#FFFFFF'}
                      strokeWidth={isHovered ? 3 : 1.5}
                      style={{
                        outline: 'none',
                        cursor: onSelectGradeFilter ? 'pointer' : 'default',
                        filter: isHovered ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' : 'none'
                      }}
                      onClick={() => onSelectGradeFilter && onSelectGradeFilter(entry.letter)}
                    />
                  );
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Donut KPI Callout */}
          {chartShape === 'donut' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black font-display text-[#002366]">
                {dominantGrade ? `${dominantGrade.percentage}%` : '100%'}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {dominantGrade ? `Grade ${dominantGrade.letter}` : 'Distinction'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {dominantGrade ? `${dominantGrade.count} of ${totalCourses} Courses` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Grade Category Ledger */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider px-1">
            <span>Letter Grade Category</span>
            <span>Course Distribution</span>
          </div>

          <div className="space-y-2">
            {slices.map((slice) => {
              const isHovered = hoveredSlice === slice.letter;
              return (
                <div
                  key={slice.letter}
                  onMouseEnter={() => setHoveredSlice(slice.letter)}
                  onMouseLeave={() => setHoveredSlice(null)}
                  onClick={() => onSelectGradeFilter && onSelectGradeFilter(slice.letter)}
                  className={`p-3 rounded-xl border transition-all ${
                    isHovered
                      ? 'bg-slate-50 border-[#C5A059] shadow-xs translate-x-1'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  } ${onSelectGradeFilter ? 'cursor-pointer' : ''}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: slice.color }}
                      />
                      <span className="font-bold text-slate-900 text-xs">
                        {slice.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-slate-800">
                        {slice.count} {slice.count === 1 ? 'course' : 'courses'}
                      </span>
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                        {slice.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Visual percentage bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${slice.percentage}%`,
                        backgroundColor: slice.color
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5">
                    <span>{slice.description}</span>
                    <span className="font-mono font-medium text-slate-600">
                      {slice.credits} Credit Hours
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Chart Footer / Office of Registrar Footnote */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            Computed across the student's complete institutional transcript at Breakthrough International Bible University.
          </span>
        </div>
        <div className="text-[11px] text-slate-400 font-medium">
          Grading Scale: 4.00 Grade Point System • Office of Academic Records
        </div>
      </div>
    </div>
  );
};
