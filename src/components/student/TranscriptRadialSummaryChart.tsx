import React, { useMemo } from 'react';
import { GradeRecord } from '../../types';

interface TranscriptRadialSummaryChartProps {
  totalCreditsEarned: number;
  totalCreditsRequired: number;
  studentGrades: GradeRecord[];
  programName: string;
}

interface CategoryArc {
  name: string;
  code: string;
  earned: number;
  required: number;
  color: string;
  percent: number;
}

/**
 * High-fidelity, self-contained SVG Radial Progress Visualization for the Official Transcript PDF.
 * Uses pure SVG arc trigonometry and vectors to ensure crisp, 100% reliable rendering in html2canvas and jsPDF.
 */
export const TranscriptRadialSummaryChart: React.FC<TranscriptRadialSummaryChartProps> = ({
  totalCreditsEarned,
  totalCreditsRequired,
  studentGrades,
  programName
}) => {
  const missingCredits = Math.max(0, totalCreditsRequired - totalCreditsEarned);
  const overallPercent = Math.min(100, Math.round((totalCreditsEarned / totalCreditsRequired) * 100));

  const categories: CategoryArc[] = useMemo(() => {
    const bibCourses = studentGrades.filter(g => /^(BIB|HER|GRE|HEB|OT|NT)/i.test(g.courseCode));
    const theCourses = studentGrades.filter(g => /^(THE|DOC|APO|SYS)/i.test(g.courseCode));
    const pasCourses = studentGrades.filter(g => /^(PAS|MIN|LEA|HOM|COU|MIS)/i.test(g.courseCode));
    const genCourses = studentGrades.filter(g =>
      !/^(BIB|HER|GRE|HEB|OT|NT|THE|DOC|APO|SYS|PAS|MIN|LEA|HOM|COU|MIS)/i.test(g.courseCode)
    );

    const sumCredits = (list: GradeRecord[]) => list.reduce((acc, c) => acc + (c.creditHours || 3), 0);

    const bibEarned = sumCredits(bibCourses);
    const theEarned = sumCredits(theCourses);
    const pasEarned = sumCredits(pasCourses);
    const genEarned = sumCredits(genCourses);

    return [
      {
        name: 'Biblical Literature & Languages',
        code: 'BIB',
        earned: bibEarned,
        required: 36,
        color: '#002366', // Deep University Navy
        percent: Math.min(100, Math.round((bibEarned / 36) * 100))
      },
      {
        name: 'Systematic & Historical Theology',
        code: 'THE',
        earned: theEarned,
        required: 30,
        color: '#C5A059', // Academic Gold
        percent: Math.min(100, Math.round((theEarned / 30) * 100))
      },
      {
        name: 'Pastoral Ministry & Leadership',
        code: 'PAS',
        earned: pasEarned,
        required: 24,
        color: '#059669', // Emerald Green
        percent: Math.min(100, Math.round((pasEarned / 24) * 100))
      },
      {
        name: 'General Theological Electives',
        code: 'GEN',
        earned: genEarned,
        required: 30,
        color: '#6366F1', // Indigo Slate
        percent: Math.min(100, Math.round((genEarned / 30) * 100))
      }
    ];
  }, [studentGrades]);

  // SVG Dimension Constants
  const size = 150;
  const center = size / 2;
  const strokeWidth = 9;
  const gap = 3.5;

  // Function to describe an SVG arc path
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

    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');
  };

  return (
    <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-800">
      {/* Micro-Header for Transcript PDF */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#C5A059]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#002366] font-display">
            Official Degree Curriculum Radial Audit
          </span>
        </div>
        <span className="text-[9px] font-mono text-slate-500 font-semibold">
          Progress: {totalCreditsEarned} / {totalCreditsRequired} Total Credits ({overallPercent}%)
        </span>
      </div>

      <div className="grid grid-cols-12 gap-3 items-center">
        {/* Left: Pure Vector Radial Chart Ring Stack */}
        <div className="col-span-4 flex flex-col items-center justify-center">
          <div className="relative w-[140px] h-[140px] flex items-center justify-center">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90"
              style={{ overflow: 'visible' }}
            >
              {categories.map((cat, idx) => {
                const radius = 64 - idx * (strokeWidth + gap);
                const sweepAngle = Math.max(2, (cat.percent / 100) * 359.9);

                return (
                  <g key={cat.code}>
                    {/* Background track circle */}
                    <circle
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="none"
                      stroke="#F1F5F9"
                      strokeWidth={strokeWidth}
                    />
                    {/* Progress arc */}
                    <path
                      d={describeArc(center, center, radius, 0, sweepAngle)}
                      fill="none"
                      stroke={cat.color}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Centered Typography Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[15px] font-black font-display text-[#002366] leading-none">
                {overallPercent}%
              </span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">
                Conferred
              </span>
            </div>
          </div>
        </div>

        {/* Right: Four Academic Curriculum Rings Breakdown */}
        <div className="col-span-8 space-y-1.5 pl-1">
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {categories.map((cat) => {
              const isSatisfied = cat.earned >= cat.required;
              return (
                <div
                  key={cat.code}
                  className="bg-slate-50/80 p-2 rounded-lg border border-slate-100 space-y-1"
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-bold text-slate-800 text-[9px] truncate">
                        {cat.name}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[9px] text-[#002366]">
                      {cat.percent}%
                    </span>
                  </div>

                  {/* Progress Bar Line */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${cat.percent}%`,
                        backgroundColor: cat.color
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[8.5px] text-slate-500">
                    <span>
                      Earned: <strong className="text-slate-800 font-mono">{cat.earned}</strong> / {cat.required} CR
                    </span>
                    <span className={isSatisfied ? 'text-emerald-700 font-bold' : 'text-amber-700 font-semibold'}>
                      {isSatisfied ? 'Complete' : `-${cat.required - cat.earned} CR`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-100">
            <span>
              Target Requirement: <strong className="text-slate-700">{totalCreditsRequired} Total Credits</strong>
            </span>
            <span>
              Remaining Balance: <strong className="text-[#C5A059] font-mono">{missingCredits} Credits to Graduate</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
