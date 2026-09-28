import React, { useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  GraduationCap,
  Award,
  CheckCircle2,
  PieChart as PieIcon,
  BarChart3,
  FileCheck2,
  Layers,
  Check
} from 'lucide-react';
import { GradeRecord } from '../../types';

export interface CreditHoursDistributionChartProps {
  studentGrades?: GradeRecord[];
  totalCreditsEarned?: number;
  totalCreditsRequired?: number;
  programName?: string;
  thesisTitle?: string;
  className?: string;
  variant?: 'document' | 'dashboard';
}

export interface CreditSegment {
  id: 'modules' | 'electives' | 'thesis';
  name: string;
  shortName: string;
  category: string;
  earned: number;
  required: number;
  percent: number;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  exemplarCourses: string[];
  statusText: string;
}

export const CreditHoursDistributionChart: React.FC<CreditHoursDistributionChartProps> = ({
  studentGrades = [],
  totalCreditsEarned = 120,
  totalCreditsRequired = 120,
  programName = 'Bachelor of Arts in Theology & Biblical Studies',
  thesisTitle = 'Exegesis of Covenantal Typology and Soteriological Fulfillment in the Pauline Epistles',
  className = '',
  variant = 'document'
}) => {
  // Compute categorized distribution
  const { segments, totalEarned, totalRequired, overallCompletion } = useMemo(() => {
    // Required targets proportional to totalCreditsRequired
    // Standard Collegiate Model:
    // Core Modules: ~60% of curriculum
    // Electives & Concentrations: ~30% of curriculum
    // Thesis / Capstone / Research: ~10% of curriculum
    const req = totalCreditsRequired || 120;
    const coreReq = Math.round(req * 0.60);
    const electReq = Math.round(req * 0.30);
    const thesisReq = req - coreReq - electReq; // e.g. 12 credits for 120, or 6 for 60

    // Analyze courses in studentGrades
    const coreCourses = studentGrades.filter(g =>
      /^(BIB|THE|DOC|APO|SYS|PAS|MIN|HOM|HER)/i.test(g.courseCode)
    );
    const electiveCourses = studentGrades.filter(g =>
      /^(ELE|GEN|GRE|HEB|COU|MIS|ETH|PHI|ENG|HIS)/i.test(g.courseCode)
    );
    const thesisCourses = studentGrades.filter(g =>
      /^(RES|CAP|THS|SEM|PRM)/i.test(g.courseCode) || /thesis|capstone|dissertation|research/i.test(g.courseTitle)
    );

    const sumCredits = (list: GradeRecord[]) =>
      list.reduce((acc, c) => acc + (c.letterGrade !== 'F' ? (c.creditHours || 3) : 0), 0);

    const recordedCore = sumCredits(coreCourses);
    const recordedElective = sumCredits(electiveCourses);
    const recordedThesis = sumCredits(thesisCourses);

    // If totalCreditsEarned exceeds sum of recorded mock grades (e.g. 120 credits conferred vs 12 courses),
    // proportionally allocate conferred credits to match degree conferral standard
    let earnedCore: number;
    let earnedElect: number;
    let earnedThesis: number;

    if (totalCreditsEarned >= req) {
      earnedCore = coreReq;
      earnedElect = electReq;
      earnedThesis = thesisReq;
    } else {
      const recordedSum = recordedCore + recordedElective + recordedThesis;
      if (recordedSum > 0) {
        const ratio = totalCreditsEarned / recordedSum;
        earnedCore = Math.min(coreReq, Math.round(recordedCore * ratio));
        earnedElect = Math.min(electReq, Math.round(recordedElective * ratio));
        earnedThesis = Math.min(thesisReq, Math.max(0, totalCreditsEarned - earnedCore - earnedElect));
      } else {
        earnedCore = Math.min(coreReq, Math.round(totalCreditsEarned * 0.6));
        earnedElect = Math.min(electReq, Math.round(totalCreditsEarned * 0.3));
        earnedThesis = Math.max(0, totalCreditsEarned - earnedCore - earnedElect);
      }
    }

    const segList: CreditSegment[] = [
      {
        id: 'modules',
        name: 'Completed Core Modules',
        shortName: 'Core Modules',
        category: 'Foundational & Systematic Curriculum',
        earned: earnedCore,
        required: coreReq,
        percent: Math.min(100, Math.round((earnedCore / coreReq) * 100)),
        color: '#002366', // Deep University Navy
        bgColor: 'bg-[#002366]/5',
        borderColor: 'border-[#002366]/30',
        textColor: 'text-[#002366]',
        icon: BookOpen,
        description: 'Required core theological, biblical survey, exegesis, hermeneutics, and pastoral leadership courses.',
        exemplarCourses: [
          'BIB-101: Old Testament Survey',
          'BIB-102: New Testament Survey',
          'THE-201: Systematic Theology I',
          'BIB-301: Biblical Hermeneutics',
          'PAS-401: Pastoral Ministry & Homiletics'
        ],
        statusText: earnedCore >= coreReq ? '100% Curricular Requirements Completed' : `${earnedCore} of ${coreReq} CR Completed`
      },
      {
        id: 'electives',
        name: 'Electives & Concentrations',
        shortName: 'Electives',
        category: 'Concentrations & Interdisciplinary Tracks',
        earned: earnedElect,
        required: electReq,
        percent: Math.min(100, Math.round((earnedElect / electReq) * 100)),
        color: '#C5A059', // Metallic Academic Gold
        bgColor: 'bg-amber-500/5',
        borderColor: 'border-amber-400/40',
        textColor: 'text-amber-800',
        icon: Sparkles,
        description: 'Specialized departmental electives, original biblical languages (Greek & Hebrew), Christian counseling, and global missions.',
        exemplarCourses: [
          'GRE-101: Biblical Greek Grammar I',
          'GRE-102: Greek Exegesis II',
          'COU-302: Christian Counseling Psychology',
          'MIS-201: Cross-Cultural Missions & Apologetics'
        ],
        statusText: earnedElect >= electReq ? '100% Concentration Track Completed' : `${earnedElect} of ${electReq} CR Completed`
      },
      {
        id: 'thesis',
        name: 'Thesis & Capstone Project',
        shortName: 'Thesis / Capstone',
        category: 'Graduation Research & Senior Dissertation',
        earned: earnedThesis,
        required: thesisReq,
        percent: Math.min(100, Math.round((earnedThesis / thesisReq) * 100)),
        color: '#059669', // Emerald Green
        bgColor: 'bg-emerald-500/5',
        borderColor: 'border-emerald-400/40',
        textColor: 'text-emerald-800',
        icon: GraduationCap,
        description: 'Peer-reviewed senior research dissertation, faculty defense, and capstone ministerial integration paper.',
        exemplarCourses: [
          'RES-490: Theological Research Methodology',
          'THS-499: Senior Exegetical Thesis & Defense',
          'PRM-495: Field Ministry Practicum Portfolio'
        ],
        statusText: earnedThesis >= thesisReq ? 'Defended & Approved (Grade: A • 4.00)' : `${earnedThesis} of ${thesisReq} CR Defended`
      }
    ];

    const currentTotal = earnedCore + earnedElect + earnedThesis;
    const overallPct = Math.min(100, Math.round((currentTotal / req) * 100));

    return {
      segments: segList,
      totalEarned: currentTotal,
      totalRequired: req,
      overallCompletion: overallPct
    };
  }, [studentGrades, totalCreditsEarned, totalCreditsRequired]);

  // Donut Arc Trigonometry Calculations for Vector Rendering
  const donutData = useMemo(() => {
    const total = segments.reduce((sum, s) => sum + s.earned, 0) || 1;
    let accumulatedAngle = -90; // Start at 12 o'clock

    return segments.map((seg) => {
      const share = seg.earned / total;
      const angleSweep = share * 360;
      const startAngle = accumulatedAngle;
      const endAngle = accumulatedAngle + angleSweep;
      accumulatedAngle = endAngle;

      return {
        ...seg,
        share,
        startAngle,
        endAngle
      };
    });
  }, [segments]);

  // SVG Helper: Describe circle arc
  const describeArc = (
    cx: number,
    cy: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) => {
    const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
      return {
        x: centerX + r * Math.cos(angleInRadians),
        y: centerY + r * Math.sin(angleInRadians)
      };
    };

    // If arc is full circle (or 360 deg)
    const sweep = endAngle - startAngle;
    if (sweep >= 359.99) {
      return `M ${cx - radius} ${cy} A ${radius} ${radius} 0 1 0 ${cx + radius} ${cy} A ${radius} ${radius} 0 1 0 ${cx - radius} ${cy}`;
    }

    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = sweep <= 180 ? '0' : '1';

    return [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');
  };

  const donutSize = 130;
  const center = donutSize / 2;
  const radius = 48;
  const strokeWidth = 14;

  return (
    <div
      className={`relative p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs print:border-slate-300 print:shadow-none print:p-4 print:rounded-xl overflow-hidden ${className}`}
    >
      {/* Background Decorative Crest Watermark */}
      <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none select-none print:hidden">
        <PieIcon className="w-48 h-48 text-[#002366]" />
      </div>

      <div className="relative z-10 space-y-5">
        {/* Header Block with Title, Subtitle, and Summary Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#002366] text-[#C5A059] flex items-center justify-center shrink-0 shadow-2xs">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black font-display text-[#002366] tracking-tight uppercase">
                Credit Hours Distribution
              </h3>
              <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                CURRICULAR AUDIT
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Comprehensive academic breakdown across <strong>Completed Modules</strong>, <strong>Electives</strong>, and <strong>Thesis Credits</strong> for degree conferral.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[9px] uppercase font-bold text-slate-400">Total Conferred</div>
              <div className="text-base font-black font-display text-[#002366]">
                {totalEarned}{' '}
                <span className="text-[10px] text-slate-500 font-normal">/ {totalRequired} CR</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center text-emerald-800 text-xs font-black font-mono shadow-2xs">
              {overallCompletion}%
            </div>
          </div>
        </div>

        {/* Visual Section: Multi-Segment Stacked Composite Distribution Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-600">
            <span className="font-bold uppercase tracking-wider text-slate-700">Curricular Share Proportions</span>
            <span>Total: 100% of Conferred Academic Credits</span>
          </div>

          {/* Stacked Progress Bar */}
          <div className="h-5 w-full bg-slate-100 rounded-lg overflow-hidden flex shadow-inner border border-slate-200">
            {segments.map((seg) => {
              const segShare = (seg.earned / (totalEarned || 1)) * 100;
              return (
                <div
                  key={seg.id}
                  style={{
                    width: `${segShare}%`,
                    backgroundColor: seg.color
                  }}
                  className="h-full relative group transition-all duration-500 flex items-center justify-center text-white text-[9px] font-bold font-mono overflow-hidden"
                  title={`${seg.name}: ${seg.earned} CR (${Math.round(segShare)}%)`}
                >
                  {segShare >= 14 && (
                    <span className="truncate px-1.5 drop-shadow-xs">
                      {seg.shortName} • {seg.earned} CR
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Color Legend under bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] pt-0.5">
            {segments.map((seg) => {
              const segShare = Math.round((seg.earned / (totalEarned || 1)) * 100);
              return (
                <div key={seg.id} className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="font-semibold text-slate-900">{seg.shortName}:</span>
                  <span className="font-mono text-slate-600">{seg.earned} CR ({segShare}%)</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two-Column Structured Presentation: Donut Visualization & 3 Breakdown Pillar Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center pt-1">
          {/* Left Column: Pure SVG Vector Donut Visualization */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-50/70 rounded-xl border border-slate-200">
            <div className="relative w-[130px] h-[130px] flex items-center justify-center">
              <svg width={donutSize} height={donutSize} className="transform -rotate-90">
                {/* Background Ring Track */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth={strokeWidth}
                />

                {/* Segment Arcs */}
                {donutData.map((d) => {
                  const pathString = describeArc(center, center, radius, d.startAngle, d.endAngle);
                  return (
                    <path
                      key={d.id}
                      d={pathString}
                      fill="none"
                      stroke={d.color}
                      strokeWidth={strokeWidth}
                      strokeLinecap="butt"
                      className="transition-all duration-300"
                    />
                  );
                })}
              </svg>

              {/* Center Donut Readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[8.5px] uppercase font-bold text-slate-400 tracking-wider">
                  Total Conferred
                </span>
                <span className="text-xl font-black font-display text-[#002366] leading-none">
                  {totalEarned}
                </span>
                <span className="text-[8px] font-mono text-slate-500 font-semibold mt-0.5">
                  CREDITS
                </span>
              </div>
            </div>

            <div className="mt-2 text-center">
              <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>100% Curricular Satisfied</span>
              </span>
            </div>
          </div>

          {/* Right Column: Three Structured Pillar Cards (Completed Modules, Electives, Thesis) */}
          <div className="lg:col-span-8 space-y-2.5">
            {segments.map((seg) => {
              const Icon = seg.icon;
              return (
                <div
                  key={seg.id}
                  className={`p-3 rounded-xl border ${seg.borderColor} ${seg.bgColor} transition-all hover:shadow-xs`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs text-white"
                        style={{ backgroundColor: seg.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 font-display">
                            {seg.name}
                          </h4>
                          <span
                            className="text-[8.5px] font-mono px-1.5 py-0.2 rounded font-bold uppercase"
                            style={{
                              backgroundColor: `${seg.color}15`,
                              color: seg.color
                            }}
                          >
                            {Math.round((seg.earned / (totalEarned || 1)) * 100)}% Share
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {seg.category}
                        </div>
                      </div>
                    </div>

                    {/* Credit Metric Badge */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-200 pt-1 sm:pt-0">
                      <div className="text-xs font-black font-display text-slate-900">
                        {seg.earned} <span className="text-[10px] font-normal text-slate-500">/ {seg.required} CR</span>
                      </div>
                      <span className="text-[8.5px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" />
                        <span>{seg.percent}% Complete</span>
                      </span>
                    </div>
                  </div>

                  {/* Contextual Detail & Course Exemplar */}
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[9.5px]">
                    <div className="text-slate-600 line-clamp-1">
                      {seg.id === 'thesis' ? (
                        <span>
                          <strong>Topic:</strong> <em className="text-slate-800">"{thesisTitle}"</em>
                        </span>
                      ) : (
                        <span>
                          <strong>Sample Modules:</strong> {seg.exemplarCourses.slice(0, 3).join(' • ')}
                        </span>
                      )}
                    </div>
                    <span className="text-[8.5px] font-mono font-semibold text-slate-500 shrink-0">
                      {seg.statusText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Verification Footer Micro-Note */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] font-mono text-slate-400">
          <span>CURRICULAR AUDIT REF: REG-CAD-2026-DISTRIB • ACCREDITED HIGHER EDUCATION STANDARD</span>
          <span className="text-emerald-700 font-semibold">ALL DEGREE CONFERRAL MODULE REQUIREMENTS SATISFIED</span>
        </div>
      </div>
    </div>
  );
};
