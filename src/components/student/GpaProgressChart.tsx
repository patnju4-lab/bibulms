import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
  LabelList
} from 'recharts';
import { GradeRecord } from '../../types';
import {
  TrendingUp,
  TrendingDown,
  Award,
  Star,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

interface GpaProgressChartProps {
  studentGrades: GradeRecord[];
  currentCumulativeGpa?: number;
}

interface SemesterDataPoint {
  semester: string;
  shortTerm: string;
  year: number;
  termCredits: number;
  termQualityPoints: number;
  termGpa: number;
  cumulativeCredits: number;
  cumulativeQualityPoints: number;
  cumulativeGpa: number;
  standing: string;
  standingColor: string;
  delta: number;
  courseCount: number;
}

export const GpaProgressChart: React.FC<GpaProgressChartProps> = ({
  studentGrades,
  currentCumulativeGpa
}) => {
  const [chartMode, setChartMode] = useState<'cumulative' | 'comparison'>('cumulative');
  const [scaleMode, setScaleMode] = useState<'focused' | 'full'>('focused');
  const [hoveredSemester, setHoveredSemester] = useState<string | null>(null);

  // Compute chronologically sorted semester progress
  const chartData = useMemo<SemesterDataPoint[]>(() => {
    if (!studentGrades || studentGrades.length === 0) return [];

    // Distinct semesters
    const uniqueTerms: string[] = Array.from(new Set(studentGrades.map((g) => g.semester)));

    // Parse helper for chronological sorting (oldest semester first)
    const getTermScore = (termStr: string): number => {
      const parts = termStr.trim().split(' ');
      const season = parts[0]?.toLowerCase() || '';
      const year = parseInt(parts[1] || '2025', 10);

      let seasonOrder = 2; // default
      if (season.includes('spring')) seasonOrder = 1;
      else if (season.includes('summer')) seasonOrder = 2;
      else if (season.includes('fall') || season.includes('autumn')) seasonOrder = 3;
      else if (season.includes('winter')) seasonOrder = 0;

      return year * 10 + seasonOrder;
    };

    // Sort chronologically ascending (earliest to latest)
    const chronologicalTerms = [...uniqueTerms].sort((a, b) => getTermScore(a) - getTermScore(b));

    let runningCredits = 0;
    let runningQualityPoints = 0;
    let prevCumulativeGpa = 0;

    const data: SemesterDataPoint[] = chronologicalTerms.map((term, index) => {
      const termCourses = studentGrades.filter((g) => g.semester === term);
      const termCredits = termCourses.reduce((sum, c) => sum + c.creditHours, 0);
      const termQualityPoints = termCourses.reduce(
        (sum, c) => sum + c.creditHours * c.gradePoint,
        0
      );
      const termGpa = termCredits > 0 ? termQualityPoints / termCredits : 0;

      runningCredits += termCredits;
      runningQualityPoints += termQualityPoints;
      const cumulativeGpa =
        runningCredits > 0 ? runningQualityPoints / runningCredits : termGpa;

      const delta = index === 0 ? 0 : cumulativeGpa - prevCumulativeGpa;
      prevCumulativeGpa = cumulativeGpa;

      let standing = 'Good Standing';
      let standingColor = '#002366';
      if (cumulativeGpa >= 3.9) {
        standing = "President's Scholar List";
        standingColor = '#C5A059';
      } else if (cumulativeGpa >= 3.75) {
        standing = "Dean's Honor List";
        standingColor = '#059669';
      } else if (cumulativeGpa >= 3.5) {
        standing = 'Honors Standing';
        standingColor = '#2563EB';
      }

      // Format short term label: "Fall 2024" -> "FA '24"
      const termParts = term.split(' ');
      const seasonPrefix = termParts[0]?.slice(0, 2).toUpperCase() || '';
      const yearShort = termParts[1]?.slice(-2) || '';
      const shortTerm = `${seasonPrefix} '${yearShort}`;

      const year = termCourses[0]?.year || parseInt(termParts[1] || '2025', 10);

      return {
        semester: term,
        shortTerm,
        year,
        termCredits,
        termQualityPoints,
        termGpa: Number(termGpa.toFixed(2)),
        cumulativeCredits: runningCredits,
        cumulativeQualityPoints: runningQualityPoints,
        cumulativeGpa: Number(cumulativeGpa.toFixed(2)),
        standing,
        standingColor,
        delta: Number(delta.toFixed(2)),
        courseCount: termCourses.length
      };
    });

    return data;
  }, [studentGrades]);

  // Key KPI metrics
  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return {
        initialGpa: 0,
        latestGpa: currentCumulativeGpa || 0,
        gpaGain: 0,
        highestTermGpa: 0,
        honorsCount: 0,
        totalTerms: 0
      };
    }

    const initialGpa = chartData[0]?.cumulativeGpa || 0;
    const latestGpa = chartData[chartData.length - 1]?.cumulativeGpa || currentCumulativeGpa || 0;
    const gpaGain = latestGpa - initialGpa;
    const highestTermGpa = Math.max(...chartData.map((d) => d.termGpa));
    const honorsCount = chartData.filter((d) => d.cumulativeGpa >= 3.75).length;

    return {
      initialGpa,
      latestGpa,
      gpaGain: Number(gpaGain.toFixed(2)),
      highestTermGpa: Number(highestTermGpa.toFixed(2)),
      honorsCount,
      totalTerms: chartData.length
    };
  }, [chartData, currentCumulativeGpa]);

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-500">
        <p className="text-xs">No semester grade data available to plot GPA progress.</p>
      </div>
    );
  }

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint: SemesterDataPoint = payload[0]?.payload;
      if (!dataPoint) return null;

      return (
        <div className="bg-[#001744] text-white p-4 rounded-xl shadow-2xl border-2 border-[#C5A059] max-w-xs text-xs space-y-2.5 z-50">
          <div className="flex items-center justify-between border-b border-white/20 pb-2">
            <div className="font-display font-black text-sm text-[#C5A059]">
              {dataPoint.semester}
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-slate-200 border border-white/20">
              {dataPoint.courseCount} Courses
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Cumulative GPA:</span>
              <span className="font-mono font-black text-base text-white">
                {dataPoint.cumulativeGpa.toFixed(2)}
                <span className="text-slate-400 text-[10px] font-normal"> / 4.00</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Semester Term GPA:</span>
              <span className="font-mono font-bold text-amber-300">
                {dataPoint.termGpa.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10">
              <span className="text-slate-400">Total Credits to Term:</span>
              <span className="font-mono text-slate-200">
                {dataPoint.cumulativeCredits} Credits
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Semester Progress Shift:</span>
              <span
                className={`font-mono font-bold flex items-center gap-0.5 ${
                  dataPoint.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {dataPoint.delta > 0 ? `+${dataPoint.delta.toFixed(2)}` : dataPoint.delta.toFixed(2)}
                {dataPoint.delta >= 0 ? (
                  <TrendingUp className="w-3 h-3 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 inline" />
                )}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/20 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">
              Honor Standing:
            </span>
            <span className="text-[10px] font-black uppercase text-[#C5A059]">
              {dataPoint.standing}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const yDomain: [number, number] = scaleMode === 'focused' ? [3.0, 4.0] : [0.0, 4.0];

  return (
    <div
      id="student-gpa-progress-chart-card"
      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5"
    >
      {/* 1. Header with Title, Controls, and Legend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#002366] text-[#C5A059]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-display font-black text-[#002366] tracking-tight">
              Academic Performance Trend • Cumulative GPA Progress
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Multi-semester GPA trajectory across {stats.totalTerms} completed academic terms at Breakthrough International Bible University.
          </p>
        </div>

        {/* Interactive Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Mode: Cumulative vs Dual Comparison */}
          <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              id="gpa-chart-mode-cumulative-btn"
              onClick={() => setChartMode('cumulative')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                chartMode === 'cumulative'
                  ? 'bg-[#002366] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cumulative GPA
            </button>
            <button
              id="gpa-chart-mode-comparison-btn"
              onClick={() => setChartMode('comparison')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                chartMode === 'comparison'
                  ? 'bg-[#002366] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cumulative vs Term
            </button>
          </div>

          {/* Scale Mode: Focused (3.0-4.0) vs Full (0.0-4.0) */}
          <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              id="gpa-chart-scale-focused-btn"
              onClick={() => setScaleMode('focused')}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                scaleMode === 'focused'
                  ? 'bg-white text-[#002366] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Zoom to 3.00 - 4.00 range for high-contrast visibility"
            >
              Zoom (3.0–4.0)
            </button>
            <button
              id="gpa-chart-scale-full-btn"
              onClick={() => setScaleMode('full')}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                scaleMode === 'full'
                  ? 'bg-white text-[#002366] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Full 0.00 - 4.00 standard scale"
            >
              Standard (0–4.0)
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Performance Indicators Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200/80">
        <div className="px-3 py-1.5 border-r border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Starting GPA
          </span>
          <div className="text-base font-black font-display text-slate-800">
            {stats.initialGpa.toFixed(2)}
            <span className="text-xs text-slate-400 font-normal ml-1">({chartData[0]?.shortTerm})</span>
          </div>
        </div>

        <div className="px-3 py-1.5 sm:border-r sm:border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Current Cumulative
          </span>
          <div className="text-base font-black font-display text-[#002366]">
            {stats.latestGpa.toFixed(2)}
            <span className="text-xs text-slate-400 font-normal ml-1">/ 4.00</span>
          </div>
        </div>

        <div className="px-3 py-1.5 border-r border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Overall Trajectory
          </span>
          <div
            className={`text-base font-black font-display flex items-center gap-1 ${
              stats.gpaGain >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {stats.gpaGain >= 0 ? `+${stats.gpaGain.toFixed(2)}` : stats.gpaGain.toFixed(2)}
            <span className="text-xs font-bold">
              {stats.gpaGain >= 0 ? '↗ Gain' : '↘ Shift'}
            </span>
          </div>
        </div>

        <div className="px-3 py-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Honor Standing Ratio
          </span>
          <div className="text-base font-black font-display text-amber-700 flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>
              {stats.honorsCount} / {stats.totalTerms}
            </span>
            <span className="text-xs text-slate-500 font-normal">Terms</span>
          </div>
        </div>
      </div>

      {/* 3. Recharts Dynamic Bar Chart */}
      <div className="w-full h-72 sm:h-80 select-none pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 24, right: 20, left: -10, bottom: 20 }}
            barGap={8}
            onMouseMove={(state: any) => {
              if (state && state.activeLabel) {
                setHoveredSemester(state.activeLabel);
              }
            }}
            onMouseLeave={() => setHoveredSemester(null)}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />

            <XAxis
              dataKey="semester"
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              tick={({ x, y, payload }) => {
                const isHovered = hoveredSemester === payload.value;
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={14}
                      textAnchor="middle"
                      fill={isHovered ? '#002366' : '#64748B'}
                      fontSize={11}
                      fontWeight={isHovered ? 800 : 600}
                    >
                      {payload.value}
                    </text>
                  </g>
                );
              }}
            />

            <YAxis
              domain={yDomain}
              ticks={
                scaleMode === 'focused'
                  ? [3.0, 3.25, 3.5, 3.75, 3.9, 4.0]
                  : [0.0, 1.0, 2.0, 3.0, 3.5, 4.0]
              }
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
              tickFormatter={(val: number) => val.toFixed(2)}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9', opacity: 0.6 }} />

            {/* Benchmark Reference Lines */}
            <ReferenceLine
              y={3.75}
              stroke="#C5A059"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: "Dean's Honor Benchmark (3.75)",
                position: 'insideTopRight',
                fill: '#926D1E',
                fontSize: 10,
                fontWeight: 700
              }}
            />
            <ReferenceLine
              y={3.9}
              stroke="#059669"
              strokeDasharray="2 2"
              strokeWidth={1.5}
              label={{
                value: 'President’s Scholar (3.90)',
                position: 'insideTopLeft',
                fill: '#047857',
                fontSize: 10,
                fontWeight: 700
              }}
            />

            {/* Mode 1: Cumulative GPA Bars with highlighted latest term */}
            {chartMode === 'cumulative' ? (
              <Bar
                dataKey="cumulativeGpa"
                name="Cumulative GPA"
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
                animationDuration={900}
              >
                {chartData.map((entry, index) => {
                  const isLatest = index === chartData.length - 1;
                  // Custom bar fill: Deep institutional navy, highlighted gold for latest term
                  const fill = isLatest ? '#002366' : '#1E3A8A';
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={fill}
                      stroke={isLatest ? '#C5A059' : '#002366'}
                      strokeWidth={isLatest ? 2 : 1}
                    />
                  );
                })}
                <LabelList
                  dataKey="cumulativeGpa"
                  position="top"
                  formatter={(val: number) => val.toFixed(2)}
                  fill="#002366"
                  fontSize={11}
                  fontWeight={800}
                  offset={6}
                />
              </Bar>
            ) : (
              /* Mode 2: Cumulative GPA and Term GPA side-by-side */
              <>
                <Bar
                  dataKey="cumulativeGpa"
                  name="Cumulative GPA"
                  fill="#002366"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={38}
                  animationDuration={800}
                >
                  <LabelList
                    dataKey="cumulativeGpa"
                    position="top"
                    formatter={(val: number) => val.toFixed(2)}
                    fill="#002366"
                    fontSize={10}
                    fontWeight={700}
                    offset={4}
                  />
                </Bar>
                <Bar
                  dataKey="termGpa"
                  name="Semester Term GPA"
                  fill="#C5A059"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={38}
                  animationDuration={1000}
                >
                  <LabelList
                    dataKey="termGpa"
                    position="top"
                    formatter={(val: number) => val.toFixed(2)}
                    fill="#926D1E"
                    fontSize={10}
                    fontWeight={700}
                    offset={4}
                  />
                </Bar>
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 4. Chart Footer / Explanatory Legend & University Benchmarks */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#002366] inline-block border border-[#C5A059]" />
            <span className="font-semibold text-slate-700">Cumulative GPA (Weighted)</span>
          </div>

          {chartMode === 'comparison' && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#C5A059] inline-block" />
              <span className="font-semibold text-slate-700">Semester Term GPA</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b-2 border-dashed border-[#C5A059] inline-block" />
            <span>Dean's List Target (3.75)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b-2 border-dotted border-emerald-600 inline-block" />
            <span>President’s Scholar (3.90)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-medium">
          Source: Official Office of the Registrar Course Grade Database
        </div>
      </div>
    </div>
  );
};
