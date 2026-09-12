import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Tooltip,
  Legend
} from 'recharts';
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRightLeft,
  Layers,
  Compass,
  TrendingUp,
  Info,
  ChevronRight
} from 'lucide-react';
import { GradeRecord } from '../../types';

interface CreditCategorySummary {
  id: string;
  name: string;
  code: string;
  required: number;
  earned: number;
  missing: number;
  progressPercent: number;
  color: string;
  status: 'Complete' | 'On Track' | 'Attention Needed';
  courses: string[];
}

interface CreditProgressRadialChartProps {
  totalCreditsEarned: number;
  totalCreditsRequired: number;
  programName: string;
  studentGrades: GradeRecord[];
  onOpenCreditEvaluator?: () => void;
  className?: string;
}

export const CreditProgressRadialChart: React.FC<CreditProgressRadialChartProps> = ({
  totalCreditsEarned,
  totalCreditsRequired,
  programName,
  studentGrades,
  onOpenCreditEvaluator,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'overall'>('categories');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Missing credits calculation
  const missingTotalCredits = Math.max(0, totalCreditsRequired - totalCreditsEarned);
  const overallPercent = Math.min(100, Math.round((totalCreditsEarned / totalCreditsRequired) * 100));

  // Determine collegiate standing tier
  const academicStandingTier = useMemo(() => {
    if (totalCreditsEarned >= 90) return { title: 'Senior Standing', desc: 'Graduation & Capstone Phase', badgeColor: 'bg-amber-100 text-amber-900 border-amber-300' };
    if (totalCreditsEarned >= 60) return { title: 'Junior Standing', desc: 'Upper-Division Theological Core', badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    if (totalCreditsEarned >= 30) return { title: 'Sophomore Standing', desc: 'Intermediate Biblical Studies', badgeColor: 'bg-blue-100 text-blue-900 border-blue-300' };
    return { title: 'Freshman Standing', desc: 'Foundational Curriculum', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' };
  }, [totalCreditsEarned]);

  // Compute breakdown by academic categories
  const categories: CreditCategorySummary[] = useMemo(() => {
    // Standard 120 credit degree breakdown for theological bachelor's program
    // We analyze course codes from studentGrades
    const bibCourses = studentGrades.filter(g => /^(BIB|HER|GRE|HEB|OT|NT)/i.test(g.courseCode));
    const theoCourses = studentGrades.filter(g => /^(THE|APO|DOC|CHR)/i.test(g.courseCode));
    const ministryCourses = studentGrades.filter(g => /^(PAS|MIN|LEA|MIS|EVG|ETH)/i.test(g.courseCode));
    const genEdCourses = studentGrades.filter(g => /^(GEN|HIS|ENG|PHI|COM|HUM)/i.test(g.courseCode));
    const otherCourses = studentGrades.filter(g => 
      !bibCourses.includes(g) && 
      !theoCourses.includes(g) && 
      !ministryCourses.includes(g) && 
      !genEdCourses.includes(g)
    );

    const bibEarned = bibCourses.reduce((sum, c) => sum + (c.letterGrade !== 'F' ? c.creditHours : 0), 0);
    const theoEarned = theoCourses.reduce((sum, c) => sum + (c.letterGrade !== 'F' ? c.creditHours : 0), 0);
    const minEarned = ministryCourses.reduce((sum, c) => sum + (c.letterGrade !== 'F' ? c.creditHours : 0), 0);
    const genEarned = genEdCourses.reduce((sum, c) => sum + (c.letterGrade !== 'F' ? c.creditHours : 0), 0);
    const otherEarned = otherCourses.reduce((sum, c) => sum + (c.letterGrade !== 'F' ? c.creditHours : 0), 0);

    // If student has a baseline of transferred/conferred credits that exceed recorded course list
    const recordedTotal = bibEarned + theoEarned + minEarned + genEarned + otherEarned;
    const extraEarned = Math.max(0, totalCreditsEarned - recordedTotal);

    // Distribution requirements (summing up to totalCreditsRequired, e.g. 120)
    const factor = totalCreditsRequired / 120;
    const catDefs = [
      {
        id: 'biblical',
        name: 'Biblical Literature & Exegesis',
        code: 'BIB',
        required: Math.round(36 * factor),
        earned: bibEarned + Math.round(extraEarned * 0.35),
        color: '#002366', // Deep University Navy
        courses: bibCourses.map(c => `${c.courseCode}: ${c.courseTitle}`)
      },
      {
        id: 'theology',
        name: 'Systematic Theology & Apologetics',
        code: 'THE',
        required: Math.round(30 * factor),
        earned: theoEarned + Math.round(extraEarned * 0.25),
        color: '#C5A059', // Academic Gold
        courses: theoCourses.map(c => `${c.courseCode}: ${c.courseTitle}`)
      },
      {
        id: 'pastoral',
        name: 'Pastoral Ministry & Global Leadership',
        code: 'MIN',
        required: Math.round(24 * factor),
        earned: minEarned + Math.round(extraEarned * 0.20),
        color: '#059669', // Emerald Green
        courses: ministryCourses.map(c => `${c.courseCode}: ${c.courseTitle}`)
      },
      {
        id: 'gened',
        name: 'General Education & Humanities',
        code: 'GEN',
        required: Math.round(18 * factor),
        earned: genEarned + Math.round(extraEarned * 0.10),
        color: '#2563EB', // Royal Blue
        courses: genEdCourses.map(c => `${c.courseCode}: ${c.courseTitle}`)
      },
      {
        id: 'practicum',
        name: 'Field Ministry Practicum & Capstone',
        code: 'PRA',
        required: Math.round(12 * factor),
        earned: otherEarned + Math.round(extraEarned * 0.10),
        color: '#7C3AED', // Regal Violet
        courses: otherCourses.map(c => `${c.courseCode}: ${c.courseTitle}`)
      }
    ];

    return catDefs.map(cat => {
      // Clamp earned so it doesn't exceed requirement for deficit calculation
      const effectiveEarned = Math.min(cat.earned, cat.required);
      const missing = Math.max(0, cat.required - cat.earned);
      const pct = Math.min(100, Math.round((cat.earned / cat.required) * 100));
      let status: 'Complete' | 'On Track' | 'Attention Needed' = 'On Track';
      if (pct >= 100) status = 'Complete';
      else if (pct < 50) status = 'Attention Needed';

      return {
        ...cat,
        missing,
        progressPercent: pct,
        status
      };
    });
  }, [studentGrades, totalCreditsEarned, totalCreditsRequired]);

  // Data for Category Radial Bar Chart
  // In Recharts RadialBarChart, inner-to-outer order is the array order
  const categoryRadialData = useMemo(() => {
    return categories.map(cat => ({
      name: cat.name,
      code: cat.code,
      value: cat.earned,
      required: cat.required,
      missing: cat.missing,
      percent: cat.progressPercent,
      fill: cat.color
    }));
  }, [categories]);

  // Data for Overall Degree Gauge Radial Bar Chart
  const overallRadialData = useMemo(() => {
    return [
      {
        name: 'Total Required Benchmark',
        value: totalCreditsRequired,
        fill: '#E2E8F0', // subtle slate track
        label: 'Degree Target'
      },
      {
        name: 'Credits Conferred & Earned',
        value: totalCreditsEarned,
        fill: '#002366', // University Navy
        label: 'Credits Earned'
      },
      {
        name: 'Remaining Credit Deficit',
        value: missingTotalCredits,
        fill: '#C5A059', // Academic Gold
        label: 'Credits Missing'
      }
    ];
  }, [totalCreditsRequired, totalCreditsEarned, missingTotalCredits]);

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 no-print ${className}`}>
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#002366] font-display">
            <Compass className="w-4 h-4 text-[#C5A059]" />
            <span>Curriculum Degree Audit & Radial Progress</span>
          </div>
          <h2 className="text-lg font-bold font-display text-slate-900 mt-1">
            Credits Earned vs. Program Graduation Requirements
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {programName} • Target: <strong className="text-slate-800">{totalCreditsRequired} Total Credits</strong>
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'categories'
                ? 'bg-white text-[#002366] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Curriculum Rings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('overall')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'overall'
                ? 'bg-white text-[#002366] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overall Pace Gauge
          </button>
        </div>
      </div>

      {/* Main Visual Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left / Center: Recharts Radial Bar Chart Container */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[300px]">
          
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'categories' ? (
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="100%"
                  barSize={12}
                  data={categoryRadialData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, Math.max(...categories.map(c => c.required))]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background={{ fill: '#F1F5F9' }}
                    dataKey="value"
                    cornerRadius={6}
                    label={false}
                    onMouseEnter={(data: any) => setHoveredCategory(data.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 space-y-1 z-50">
                            <div className="font-bold text-[#C5A059] border-b border-slate-700 pb-1">
                              {d.name}
                            </div>
                            <div className="flex justify-between gap-4 pt-0.5">
                              <span className="text-slate-300">Credits Earned:</span>
                              <strong className="font-mono text-emerald-400">{d.value} / {d.required} CR</strong>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-300">Degree Requirement:</span>
                              <span className="font-mono">{d.percent}% Completed</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-300">Missing Credits:</span>
                              <strong className={`font-mono ${d.missing > 0 ? 'text-amber-400 font-bold' : 'text-emerald-300'}`}>
                                {d.missing > 0 ? `${d.missing} CR Deficit` : 'Requirement Satisfied'}
                              </strong>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadialBarChart>
              ) : (
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="35%"
                  outerRadius="95%"
                  barSize={18}
                  data={overallRadialData}
                  startAngle={180}
                  endAngle={0}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, totalCreditsRequired]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background={{ fill: '#F8FAFC' }}
                    dataKey="value"
                    cornerRadius={8}
                    label={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 space-y-1">
                            <div className="font-bold text-[#C5A059]">{d.name}</div>
                            <div className="text-emerald-400 font-mono text-sm">{d.value} Credits</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadialBarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Central Radial Readout Overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
            <div className="text-2xl font-black font-display text-[#002366] leading-none">
              {overallPercent}%
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Fulfilled
            </div>
          </div>

          <div className="text-center pt-2">
            <span className="text-xs font-semibold text-slate-700">
              <strong className="text-[#002366]">{totalCreditsEarned} Credits Earned</strong> of{' '}
              <strong className="text-slate-900">{totalCreditsRequired} Required</strong>
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">
              Interactive radial tracks visual scale
            </span>
          </div>

        </div>

        {/* Right: Category Breakdown & Missing Credits Audit */}
        <div className="lg:col-span-6 space-y-3.5">
          
          {/* Standing & Quick Metric Bar */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#002366]/10 text-[#002366] flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4 text-[#C5A059]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                  Collegiate Standing
                </span>
                <span className="text-xs font-bold text-slate-900 font-display">
                  {academicStandingTier.title}
                </span>
              </div>
            </div>

            <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold border ${academicStandingTier.badgeColor}`}>
              {academicStandingTier.desc}
            </span>
          </div>

          {/* Category Progress Bars with Deficit Badges */}
          <div className="space-y-2.5">
            {categories.map((cat) => {
              const isHovered = hoveredCategory === cat.name;
              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => setHoveredCategory(cat.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`p-3 rounded-xl border transition-all cursor-default ${
                    isHovered
                      ? 'bg-blue-50/70 border-[#002366]/40 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-bold text-slate-800 truncate max-w-[220px]">
                        {cat.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-slate-600 text-[11px]">
                        <strong className="text-slate-900">{cat.earned}</strong> / {cat.required} CR
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          cat.missing === 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {cat.missing === 0 ? 'Complete' : `-${cat.missing} CR`}
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${cat.progressPercent}%`,
                        backgroundColor: cat.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Missing Credits Summary & Action Callout */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950 block">
                  {missingTotalCredits > 0
                    ? `${missingTotalCredits} Credits Remaining for Graduation Clearance`
                    : 'All Degree Credit Benchmarks Met!'}
                </span>
                <span className="text-[11px] text-amber-800">
                  {missingTotalCredits > 0
                    ? 'Review prior theological transcripts or experiential learning for potential exemptions.'
                    : 'Ready for faculty review and graduation commencement registration.'}
                </span>
              </div>
            </div>

            {onOpenCreditEvaluator && missingTotalCredits > 0 && (
              <button
                type="button"
                onClick={onOpenCreditEvaluator}
                className="px-3 py-1.5 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white text-[11px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1.5 shrink-0 transition-all"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Evaluate Credits</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
