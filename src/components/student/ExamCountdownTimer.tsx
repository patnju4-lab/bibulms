import React from 'react';
import { Clock, AlertTriangle, Zap } from 'lucide-react';

interface ExamCountdownTimerProps {
  timeLeftSeconds: number;
  totalDurationSeconds: number;
  isCompleted?: boolean;
}

export const ExamCountdownTimer: React.FC<ExamCountdownTimerProps> = ({
  timeLeftSeconds,
  totalDurationSeconds,
  isCompleted = false
}) => {
  const isWarningState = timeLeftSeconds <= 300 && timeLeftSeconds > 60;
  const isCriticalState = timeLeftSeconds <= 60;

  const progressPercent = Math.max(0, Math.min(100, (timeLeftSeconds / totalDurationSeconds) * 100));

  const formatTimeDetailed = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border shadow-md transition-all space-y-3 ${
        isCriticalState && !isCompleted
          ? 'bg-gradient-to-r from-rose-950 via-rose-900 to-red-950 text-white border-rose-500 ring-2 ring-rose-500 animate-pulse'
          : isWarningState && !isCompleted
          ? 'bg-gradient-to-r from-amber-950 via-[#001f5c] to-[#001740] text-white border-amber-400 ring-1 ring-amber-400/50'
          : 'bg-gradient-to-r from-[#002366] via-[#001A4D] to-[#001233] text-white border-[#C5A059]/50'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left Status & Label */}
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isCriticalState ? 'bg-rose-600 text-white' : isWarningState ? 'bg-amber-500 text-slate-950' : 'bg-[#C5A059] text-[#002366]'
          }`}>
            <Clock className={`w-5 h-5 ${isCriticalState ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                Proctored Timer Tracking
              </span>
              {isWarningState && !isCompleted && (
                <span className="text-[9px] font-black uppercase px-2 py-0.2 rounded bg-amber-500 text-slate-950 flex items-center gap-1 animate-bounce">
                  <AlertTriangle className="w-3 h-3" />
                  <span>5-Min Warning</span>
                </span>
              )}
              {isCriticalState && !isCompleted && (
                <span className="text-[9px] font-black uppercase px-2 py-0.2 rounded bg-rose-600 text-white flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>Final Minute</span>
                </span>
              )}
            </div>
            <div className="text-xs text-slate-300">
              Automated countdown • Auto-submits at 00:00:00
            </div>
          </div>
        </div>

        {/* Big Digital Clock Display */}
        <div className="text-right">
          <div className="text-[10px] uppercase font-mono text-slate-400">Time Remaining</div>
          <div className={`text-2xl sm:text-3xl font-black font-mono tracking-wider ${
            isCriticalState
              ? 'text-white drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]'
              : isWarningState
              ? 'text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
              : 'text-[#C5A059]'
          }`}>
            {isCompleted ? '00:00' : formatTimeDetailed(timeLeftSeconds)}
          </div>
        </div>
      </div>

      {/* Visual Progress Bar Tracking */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
          <span>Elapsed vs Remaining</span>
          <span>{progressPercent.toFixed(1)}% time left</span>
        </div>
        <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCriticalState
                ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                : isWarningState
                ? 'bg-amber-400'
                : 'bg-gradient-to-r from-[#C5A059] to-amber-300'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
