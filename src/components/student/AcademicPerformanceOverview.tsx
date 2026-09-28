import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Award,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Layers,
  ArrowUpRight,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell
} from 'recharts';
import { GradeRecord } from '../../types';

export interface SemesterData {
  term: string;
  termCreditsAttempted: number;
  termCreditsEarned: number;
  termQualityPoints: number;
  termGpa: number;
  runningCredits: number;
  runningGpa: number;
  courses: {
    code: string;
    title: string;
    credits: number;
    grade?: string;
    gradePoint?: number;
    qualityPoints?: number;
    instructor?: string;
    school?: string;
  }[];
}

export interface AcademicPerformanceOverviewProps {
  compiledSemesters: SemesterData[];
  cumulativeGpa: number;
  totalAttemptedCredits: number;
  totalEarnedCredits: number;
  studentGrades?: GradeRecord[];
  className?: string;
}

export const AcademicPerformanceOverview: React.FC<AcademicPerformanceOverviewProps> = ({
  compiledSemesters = [],
  cumulativeGpa = 3.88,
  totalAttemptedCredits = 120,
  totalEarnedCredits = 120,
  studentGrades = [],
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'gpaProgression' | 'gradeTrends' | 'creditVelocity'>('gpaProgression');

  // Enrich semester data with numerical grade averages and letter distributions across student tenure
  const tenureChartData = useMemo(() => {
    return compiledSemesters.map((sem, idx) => {
      // Find matching grades from studentGrades for score averages
      const matchingGrades = studentGrades.filter(g => g.semester === sem.term);
      const totalScoreSum = matchingGrades.reduce((sum, g) => sum + (g.totalScore || 92), 0);
      const avgNumericalScore = matchingGrades.length > 0
        ? Math.round(totalScoreSum / matchingGrades.length)
        : Math.round(80 + (sem.termGpa / 4.0) * 20);

      // Letter grade breakdown
      const letterCounts: Record<string, number> = {};
      sem.courses.forEach(c => {
        const letter = c.grade || 'A';
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
      });

      const isDeansList = sem.termGpa >= 3.75;
      const isHonors = sem.termGpa >= 3.50 && sem.termGpa < 3.75;

      return {
        ...sem,
        termShort: sem.term.replace('Fall ', 'FA').replace('Spring ', 'SP').replace('Summer ', 'SU'),
        termIndex: idx + 1,
        avgNumericalScore,
        letterCounts,
        isDeansList,
        isHonors,
        runningGpaFormatted: parseFloat(sem.runningGpa.toFixed(2)),
        termGpaFormatted: parseFloat(sem.termGpa.toFixed(2))
      };
    });
  }, [compiledSemesters, studentGrades]);

  // Tenure performance statistics
  const startingGpa = tenureChartData[0]?.runningGpa || cumulativeGpa;
  const highestTermGpa = Math.max(...tenureChartData.map(d => d.termGpa), cumulativeGpa);
  const lowestTermGpa = Math.min(...tenureChartData.map(d => d.termGpa), cumulativeGpa);
  const gpaDelta = cumulativeGpa - startingGpa;
  const deansListCount = tenureChartData.filter(d => d.isDeansList).length;

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6 ${className}`}
    >
      {/* Header with Title and Mode Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#002366] text-[#C5A059] flex items-center justify-center shrink-0 shadow-2xs">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-black font-display text-[#002366] tracking-tight uppercase">
              Academic Performance Overview
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              TENURE ANALYTICS
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-snug">
            Visual progression of semester grade trends, numerical score averages, and cumulative GPA progression over the student's entire tenure.
          </p>
        </div>

        {/* View Mode Switching Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200 text-xs shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('gpaProgression')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'gpaProgression'
                ? 'bg-white text-[#002366] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Cumulative GPA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gradeTrends')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'gradeTrends'
                ? 'bg-white text-[#002366] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#002366]" />
            <span>Grade Trends</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('creditVelocity')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'creditVelocity'
                ? 'bg-white text-[#002366] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>Credit Velocity</span>
          </button>
        </div>
      </div>

      {/* Tenure Performance Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-[10px] uppercase font-bold text-slate-500">Starting vs Cumulative GPA</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm font-semibold text-slate-500 line-through">
              {startingGpa.toFixed(2)}
            </span>
            <span className="text-base font-black font-display text-[#002366]">
              {cumulativeGpa.toFixed(2)}
            </span>
            <span className={`text-[10px] font-mono font-bold flex items-center ${gpaDelta >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
              <ArrowUpRight className="w-3 h-3" />
              {gpaDelta >= 0 ? `+${gpaDelta.toFixed(2)}` : gpaDelta.toFixed(2)}
            </span>
          </div>
          <div className="text-[9.5px] text-slate-500 mt-0.5">
            Initial term to degree conferral
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-[10px] uppercase font-bold text-slate-500">Peak Semester Record</div>
          <div className="text-base font-black font-display text-emerald-700 mt-1">
            {highestTermGpa.toFixed(2)} <span className="text-[10px] text-slate-500 font-normal">/ 4.00 Max</span>
          </div>
          <div className="text-[9.5px] text-emerald-800 font-semibold mt-0.5 flex items-center gap-1">
            <Award className="w-3 h-3 text-[#C5A059]" />
            <span>Dean's Commendation</span>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-[10px] uppercase font-bold text-slate-500">Tenure Terms Evaluated</div>
          <div className="text-base font-black font-display text-slate-900 mt-1">
            {tenureChartData.length} Semesters
          </div>
          <div className="text-[9.5px] text-slate-500 mt-0.5">
            {deansListCount} terms on Dean's Honor Roll
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-[10px] uppercase font-bold text-slate-500">Academic Standing</div>
          <div className="text-sm font-black font-display text-emerald-800 mt-1 truncate">
            {cumulativeGpa >= 3.9 ? 'Summa Cum Laude' : cumulativeGpa >= 3.75 ? 'Magna Cum Laude' : 'Cum Laude'}
          </div>
          <div className="text-[9.5px] text-emerald-700 font-mono font-semibold mt-0.5">
            Good Standing (Eligible for Honors)
          </div>
        </div>
      </div>

      {/* Chart Visualization Container */}
      <div className="h-80 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'gpaProgression' ? (
            /* TAB 1: Area + Line Chart visualizing Cumulative GPA Progression & Term GPA */
            <AreaChart
              data={tenureChartData}
              margin={{ top: 15, right: 30, left: -20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="tenureGpaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#002366" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#002366" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="term"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
              />
              <YAxis
                domain={[2.5, 4.0]}
                ticks={[2.5, 3.0, 3.5, 3.75, 4.0]}
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tickFormatter={(v) => v.toFixed(2)}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as typeof tenureChartData[0];
                    return (
                      <div className="bg-slate-900 text-white text-xs p-3.5 rounded-xl shadow-xl border border-slate-700 space-y-2 min-w-[200px]">
                        <div className="font-bold text-[#C5A059] border-b border-slate-700 pb-1 flex items-center justify-between">
                          <span>{label}</span>
                          <span className="text-[10px] font-mono text-slate-400">Term {data.termIndex}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-300">Cumulative GPA:</span>
                            <strong className="font-mono text-emerald-400 font-bold">{data.runningGpa.toFixed(2)}</strong>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-300">Term GPA:</span>
                            <strong className="font-mono text-blue-300 font-bold">{data.termGpa.toFixed(2)}</strong>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-300">Term Credits:</span>
                            <span className="font-mono">{data.termCreditsAttempted} CR</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-300">Quality Points:</span>
                            <span className="font-mono">{data.termQualityPoints.toFixed(1)}</span>
                          </div>
                        </div>
                        {data.isDeansList && (
                          <div className="pt-1 border-t border-slate-800 text-[10px] text-amber-300 font-bold flex items-center gap-1">
                            <Award className="w-3 h-3 text-[#C5A059]" />
                            <span>Dean's List Commendation</span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine
                y={3.75}
                stroke="#059669"
                strokeDasharray="4 4"
                label={{ value: "Dean's List (3.75)", fill: '#059669', fontSize: 10, position: 'top' }}
              />
              <ReferenceLine
                y={3.5}
                stroke="#2563EB"
                strokeDasharray="4 4"
                label={{ value: 'Honors (3.50)', fill: '#2563EB', fontSize: 10, position: 'insideBottomRight' }}
              />
              <Area
                type="monotone"
                dataKey="runningGpaFormatted"
                name="Cumulative GPA"
                stroke="#002366"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#tenureGpaGradient)"
              />
              <Line
                type="monotone"
                dataKey="termGpaFormatted"
                name="Term GPA"
                stroke="#C5A059"
                strokeWidth={2.5}
                dot={{ r: 4.5, fill: '#C5A059', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          ) : activeTab === 'gradeTrends' ? (
            /* TAB 2: Composed Chart visualizing Semester Score Averages & Term GPA */
            <ComposedChart
              data={tenureChartData}
              margin={{ top: 15, right: 30, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="term"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
              />
              <YAxis
                yAxisId="score"
                domain={[70, 100]}
                ticks={[70, 80, 90, 100]}
                stroke="#002366"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                yAxisId="gpa"
                orientation="right"
                domain={[2.5, 4.0]}
                ticks={[2.5, 3.0, 3.5, 4.0]}
                stroke="#C5A059"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tickFormatter={(v) => v.toFixed(2)}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as typeof tenureChartData[0];
                    return (
                      <div className="bg-slate-900 text-white text-xs p-3.5 rounded-xl shadow-xl border border-slate-700 space-y-2 min-w-[200px]">
                        <div className="font-bold text-[#C5A059] border-b border-slate-700 pb-1">
                          {label} • Grade Breakdown
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-300">Average Course Score:</span>
                            <strong className="font-mono text-emerald-400 font-bold">{data.avgNumericalScore}%</strong>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-300">Term GPA:</span>
                            <strong className="font-mono text-amber-300 font-bold">{data.termGpa.toFixed(2)}</strong>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-300">Enrolled Courses:</span>
                            <span className="font-mono">{data.courses.length} Modules</span>
                          </div>
                        </div>
                        <div className="pt-1.5 border-t border-slate-800 text-[10px]">
                          <span className="text-slate-400 block mb-1">Grade Distribution:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(data.letterCounts).map(([letter, count]) => (
                              <span key={letter} className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-200">
                                {count}× {letter}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
              <Bar
                yAxisId="score"
                dataKey="avgNumericalScore"
                name="Average Course Score (%)"
                fill="#002366"
                radius={[6, 6, 0, 0]}
                barSize={32}
              >
                {tenureChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isDeansList ? '#002366' : '#1e3a8a'}
                  />
                ))}
              </Bar>
              <Line
                yAxisId="gpa"
                type="monotone"
                dataKey="termGpaFormatted"
                name="Term GPA"
                stroke="#C5A059"
                strokeWidth={3}
                dot={{ r: 5, fill: '#C5A059', stroke: '#fff', strokeWidth: 2 }}
              />
            </ComposedChart>
          ) : (
            /* TAB 3: Composed Chart visualizing Semester Credits & Cumulative Credits */
            <ComposedChart
              data={tenureChartData}
              margin={{ top: 15, right: 30, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="term"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
              />
              <YAxis
                yAxisId="credits"
                stroke="#002366"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tickFormatter={(v) => `${v} CR`}
              />
              <YAxis
                yAxisId="running"
                orientation="right"
                stroke="#059669"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tickFormatter={(v) => `${v} CR`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as typeof tenureChartData[0];
                    return (
                      <div className="bg-slate-900 text-white text-xs p-3.5 rounded-xl shadow-xl border border-slate-700 space-y-1.5 min-w-[200px]">
                        <div className="font-bold text-[#C5A059] border-b border-slate-700 pb-1">
                          {label} • Credit Velocity
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-300">Semester Credits:</span>
                          <strong className="font-mono text-blue-300">{data.termCreditsAttempted} CR</strong>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-300">Cumulative Earned:</span>
                          <strong className="font-mono text-emerald-400">{data.runningCredits} CR</strong>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-300">Term Quality Points:</span>
                          <span className="font-mono">{data.termQualityPoints.toFixed(1)}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
              <Bar
                yAxisId="credits"
                dataKey="termCreditsAttempted"
                name="Semester Credits"
                fill="#C5A059"
                radius={[6, 6, 0, 0]}
                barSize={28}
              />
              <Line
                yAxisId="running"
                type="monotone"
                dataKey="runningCredits"
                name="Cumulative Earned Credits"
                stroke="#059669"
                strokeWidth={3}
                dot={{ r: 5, fill: '#059669', stroke: '#fff', strokeWidth: 2 }}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Semester Performance Scorecards: Tenure Breakdown */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
          <span>Semester-by-Semester Performance Ledger</span>
          <span className="text-slate-400 font-mono text-[10px]">ALL TERMS RECORDED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tenureChartData.map((termItem) => (
            <div
              key={termItem.term}
              className={`p-3 rounded-xl border transition-all ${
                termItem.isDeansList
                  ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 font-display">
                  {termItem.term}
                </span>
                {termItem.isDeansList && (
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                    Dean's List
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200/60 text-xs">
                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Term GPA</div>
                  <div className="font-bold font-mono text-slate-800">
                    {termItem.termGpa.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Running GPA</div>
                  <div className="font-bold font-mono text-[#002366]">
                    {termItem.runningGpa.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{termItem.termCreditsEarned} Credits Earned</span>
                <span className="font-semibold text-slate-700">{termItem.avgNumericalScore}% Avg</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
