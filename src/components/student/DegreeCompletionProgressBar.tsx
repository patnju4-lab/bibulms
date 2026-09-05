import React, { useState } from 'react';
import { User } from '../../types';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Info
} from 'lucide-react';

interface DegreeCompletionProgressBarProps {
  currentUser: User;
  courseCredits: number;
  rplCredits: number;
  totalCreditsConferred: number;
  degreeRequiredCredits: number;
  degreeProgressPercent: number;
  totalCourses: number;
  cumulativeGpa: number;
}

export const DegreeCompletionProgressBar: React.FC<DegreeCompletionProgressBarProps> = ({
  currentUser,
  courseCredits,
  rplCredits,
  totalCreditsConferred,
  degreeRequiredCredits,
  degreeProgressPercent,
  totalCourses,
  cumulativeGpa
}) => {
  const [showTiersDetail, setShowTiersDetail] = useState<boolean>(false);
  const [activeSegmentHover, setActiveSegmentHover] = useState<string | null>(null);

  const remainingCredits = Math.max(0, degreeRequiredCredits - totalCreditsConferred);
  const courseworkPercent = Number(((courseCredits / degreeRequiredCredits) * 100).toFixed(1));
  const rplPercent = Number(((rplCredits / degreeRequiredCredits) * 100).toFixed(1));
  const remainingPercent = Number(((remainingCredits / degreeRequiredCredits) * 100).toFixed(1));

  // Determine collegiate standing tier based on credit ranges
  let academicTier = 'Freshman (Foundation)';
  let tierBadge = 'bg-blue-100 text-blue-900 border-blue-200';
  if (totalCreditsConferred >= 90) {
    academicTier = 'Senior (Degree Candidate)';
    tierBadge = 'bg-amber-100 text-amber-900 border-amber-300';
  } else if (totalCreditsConferred >= 60) {
    academicTier = 'Junior (Upper Division)';
    tierBadge = 'bg-emerald-100 text-emerald-900 border-emerald-300';
  } else if (totalCreditsConferred >= 30) {
    academicTier = 'Sophomore (Intermediate)';
    tierBadge = 'bg-indigo-100 text-indigo-900 border-indigo-200';
  }

  // Academic tiers benchmark configuration
  const tiers = [
    {
      tier: 'Year 1: Freshman',
      creditsRange: '0 - 30 Credits',
      target: 30,
      description: 'Foundational Biblical hermeneutics, theology surveys, and core study methods',
      status: totalCreditsConferred >= 30 ? 'completed' : 'in_progress',
      earned: Math.min(30, totalCreditsConferred)
    },
    {
      tier: 'Year 2: Sophomore',
      creditsRange: '31 - 60 Credits',
      target: 60,
      description: 'Systematic theology, church history, biblical languages, and ministry practice',
      status:
        totalCreditsConferred >= 60
          ? 'completed'
          : totalCreditsConferred > 30
          ? 'in_progress'
          : 'pending',
      earned: Math.max(0, Math.min(30, totalCreditsConferred - 30))
    },
    {
      tier: 'Year 3: Junior',
      creditsRange: '61 - 90 Credits',
      target: 90,
      description: 'Advanced theological apologetics, pastoral ethics, cross-cultural missions, and homiletics',
      status:
        totalCreditsConferred >= 90
          ? 'completed'
          : totalCreditsConferred > 60
          ? 'in_progress'
          : 'pending',
      earned: Math.max(0, Math.min(30, totalCreditsConferred - 60))
    },
    {
      tier: 'Year 4: Senior',
      creditsRange: '91 - 120 Credits',
      target: 120,
      description: 'Senior capstone thesis, comprehensive examination, and degree conferral',
      status:
        totalCreditsConferred >= 120
          ? 'completed'
          : totalCreditsConferred > 90
          ? 'in_progress'
          : 'pending',
      earned: Math.max(0, Math.min(30, totalCreditsConferred - 90))
    }
  ];

  return (
    <div
      id="degree-completion-progress-card"
      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6"
    >
      {/* 1. Header: Degree Program Title & Percentage KPI Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#002366] text-[#C5A059]">
              <Target className="w-4 h-4" />
            </span>
            <h3 className="text-base font-display font-black text-[#002366] tracking-tight">
              Degree Program Credit Hours Completion
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${tierBadge} hidden md:inline-flex items-center gap-1`}
            >
              <Sparkles className="w-3 h-3" />
              {academicTier}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {currentUser.programName || 'Bachelor of Theology (B.Th.)'} • Minimum Degree Requirement: {degreeRequiredCredits} Semester Credit Hours
          </p>
        </div>

        {/* Big Progress Counter Badge */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2 self-start sm:self-auto shadow-2xs">
          <div className="text-right">
            <div className="text-2xl font-black font-display text-[#002366] leading-none">
              {degreeProgressPercent}%
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Degree Completed
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-left">
            <div className="text-xs font-bold text-slate-800 font-mono">
              {totalCreditsConferred} / {degreeRequiredCredits}
            </div>
            <span className="text-[10px] font-medium text-emerald-700 font-bold">
              {remainingCredits} Cr to Graduate
            </span>
          </div>
        </div>
      </div>

      {/* 2. Visual Multi-Segment Stacked Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Program Progress Gauge</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 text-[11px]">
              {totalCreditsConferred} of {degreeRequiredCredits} Credits Conferred ({degreeProgressPercent}%)
            </span>
          </div>
          <div className="text-right font-mono font-bold text-xs text-[#002366]">
            {remainingCredits === 0 ? 'Requirements Met' : `${remainingCredits} Credits Remaining`}
          </div>
        </div>

        {/* The Multi-Segment Bar */}
        <div
          className="relative w-full h-5 sm:h-6 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 flex shadow-inner"
          title={`Coursework: ${courseCredits} Cr (${courseworkPercent}%) | RPL: ${rplCredits} Cr (${rplPercent}%) | Remaining: ${remainingCredits} Cr (${remainingPercent}%)`}
        >
          {/* Segment 1: Classroom Coursework (Institutional Navy) */}
          <div
            onMouseEnter={() => setActiveSegmentHover('coursework')}
            onMouseLeave={() => setActiveSegmentHover(null)}
            style={{ width: `${courseworkPercent}%` }}
            className="h-full bg-[#002366] rounded-l-full transition-all duration-700 relative group cursor-pointer flex items-center justify-center overflow-hidden"
          >
            {courseworkPercent >= 15 && (
              <span className="text-[10px] font-mono font-black text-white px-1 tracking-wider drop-shadow-xs select-none">
                Coursework {courseworkPercent}%
              </span>
            )}
          </div>

          {/* Segment 2: RPL / Certified Prior Learning (Institutional Gold) */}
          <div
            onMouseEnter={() => setActiveSegmentHover('rpl')}
            onMouseLeave={() => setActiveSegmentHover(null)}
            style={{ width: `${rplPercent}%` }}
            className="h-full bg-[#C5A059] transition-all duration-700 relative group cursor-pointer flex items-center justify-center overflow-hidden"
          >
            {rplPercent >= 12 && (
              <span className="text-[10px] font-mono font-black text-[#002366] px-1 tracking-wider drop-shadow-xs select-none">
                RPL {rplPercent}%
              </span>
            )}
          </div>

          {/* Segment 3: Remaining Credit Requirement (Subtle Striped / Slate) */}
          <div
            onMouseEnter={() => setActiveSegmentHover('remaining')}
            onMouseLeave={() => setActiveSegmentHover(null)}
            style={{ width: `${remainingPercent}%` }}
            className="h-full bg-slate-200/80 rounded-r-full transition-all duration-700 relative group cursor-pointer flex items-center justify-center overflow-hidden"
          >
            {remainingPercent >= 15 && (
              <span className="text-[10px] font-mono font-bold text-slate-600 px-1 tracking-wider select-none">
                Remaining {remainingPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Milestone Tick Markers (25%, 50%, 75%, 100%) */}
        <div className="relative w-full text-[10px] font-bold text-slate-400 select-none px-1 pt-0.5">
          <div className="flex justify-between items-center">
            <span className="flex flex-col items-start">
              <span className="w-0.5 h-1.5 bg-slate-300 mb-0.5" />
              <span>0 Cr (Start)</span>
            </span>
            <span className="flex flex-col items-center">
              <span className="w-0.5 h-1.5 bg-slate-300 mb-0.5" />
              <span>30 Cr (25%)</span>
            </span>
            <span className="flex flex-col items-center">
              <span className="w-0.5 h-1.5 bg-slate-300 mb-0.5" />
              <span>60 Cr (50%)</span>
            </span>
            <span className="flex flex-col items-center">
              <span className="w-0.5 h-1.5 bg-slate-300 mb-0.5" />
              <span>90 Cr (75%)</span>
            </span>
            <span className="flex flex-col items-end">
              <span className="w-0.5 h-1.5 bg-slate-300 mb-0.5" />
              <span className="text-[#002366] font-black">120 Cr (100% Degree)</span>
            </span>
          </div>

          {/* Current Pin Position Marker */}
          <div
            className="absolute -top-6 -translate-x-1/2 transition-all duration-700 hidden sm:flex flex-col items-center pointer-events-none"
            style={{ left: `${degreeProgressPercent}%` }}
          >
            <span className="bg-[#002366] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-xs">
              Current: {totalCreditsConferred} Cr ({degreeProgressPercent}%)
            </span>
            <span className="w-1.5 h-1.5 bg-[#002366] rotate-45 -mt-0.5" />
          </div>
        </div>

        {/* Legend / Hover Description Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div
              className={`flex items-center gap-1.5 transition-opacity ${
                activeSegmentHover && activeSegmentHover !== 'coursework' ? 'opacity-40' : 'opacity-100'
              }`}
            >
              <span className="w-3 h-3 rounded-xs bg-[#002366] inline-block shadow-2xs" />
              <span className="font-semibold text-slate-800">
                Biblical Coursework ({courseCredits} Cr • {courseworkPercent}%)
              </span>
            </div>

            <div
              className={`flex items-center gap-1.5 transition-opacity ${
                activeSegmentHover && activeSegmentHover !== 'rpl' ? 'opacity-40' : 'opacity-100'
              }`}
            >
              <span className="w-3 h-3 rounded-xs bg-[#C5A059] inline-block shadow-2xs" />
              <span className="font-semibold text-slate-800">
                Conferred RPL Credits ({rplCredits} Cr • {rplPercent}%)
              </span>
            </div>

            <div
              className={`flex items-center gap-1.5 transition-opacity ${
                activeSegmentHover && activeSegmentHover !== 'remaining' ? 'opacity-40' : 'opacity-100'
              }`}
            >
              <span className="w-3 h-3 rounded-xs bg-slate-200 border border-slate-300 inline-block" />
              <span className="font-semibold text-slate-600">
                Remaining to Graduate ({remainingCredits} Cr • {remainingPercent}%)
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowTiersDetail(!showTiersDetail)}
            className="text-xs font-bold text-[#002366] hover:text-[#C5A059] flex items-center gap-1 transition-colors"
          >
            <span>{showTiersDetail ? 'Hide Degree Tiers' : 'View Degree Milestones'}</span>
            {showTiersDetail ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* 3. Four Key Statistics Breakdown Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
        <div className="px-2 py-1.5 border-r border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Coursework Earned
          </span>
          <div className="text-base font-black font-display text-[#002366]">
            {courseCredits} Credits
            <span className="text-xs text-slate-500 font-normal ml-1">
              ({totalCourses} Courses)
            </span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            4.00/3.70 High Honors
          </div>
        </div>

        <div className="px-2 py-1.5 sm:border-r sm:border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Conferred RPL Units
          </span>
          <div className="text-base font-black font-display text-amber-700">
            {rplCredits} Credits
            <span className="text-xs text-slate-500 font-normal ml-1">Conferred</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            Prior Ministerial Service
          </div>
        </div>

        <div className="px-2 py-1.5 border-r border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Remaining to Graduate
          </span>
          <div className="text-base font-black font-display text-slate-800">
            {remainingCredits} Credits
            <span className="text-xs text-slate-500 font-normal ml-1">
              (~{Math.ceil(remainingCredits / 3)} Courses)
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            ~3 Academic Semesters
          </div>
        </div>

        <div className="px-2 py-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Graduation Trajectory
          </span>
          <div className="text-base font-black font-display text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>On Track</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            Target: Spring 2027
          </div>
        </div>
      </div>

      {/* 4. Expandable 4-Year Academic Tier Milestones Breakdown */}
      {showTiersDetail && (
        <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#002366] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#C5A059]" />
              <span>Undergraduate Degree Classification &amp; Year Standing</span>
            </h4>
            <span className="text-[11px] text-slate-400">
              Standard 120-Credit Bachelor Degree Track
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {tiers.map((item, idx) => {
              const isDone = item.status === 'completed';
              const isInProgress = item.status === 'in_progress';

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : isInProgress
                      ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-300/40 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900 font-display">
                      {item.tier}
                    </span>
                    {isDone ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Done
                      </span>
                    ) : isInProgress ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-500">
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] font-mono font-bold text-[#002366] mb-1">
                    {item.creditsRange}
                  </div>

                  {/* Micro progress bar for tier */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden my-1.5">
                    <div
                      className={`h-full rounded-full ${
                        isDone ? 'bg-emerald-600' : isInProgress ? 'bg-amber-500' : 'bg-slate-300'
                      }`}
                      style={{
                        width: isDone
                          ? '100%'
                          : isInProgress
                          ? `${Math.round((item.earned / 30) * 100)}%`
                          : '0%'
                      }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
