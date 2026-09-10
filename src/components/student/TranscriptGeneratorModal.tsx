import React from 'react';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  X,
  Loader2
} from 'lucide-react';
import { TranscriptPdfProgress } from '../../utils/academicTranscriptPdfExport';

interface TranscriptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: TranscriptPdfProgress | null;
  onDownloadAgain: () => void;
  onPrint: () => void;
  studentName: string;
  studentId: string;
  programName: string;
  cumulativeGpa: number;
  totalCredits: number;
  filename: string;
}

export const TranscriptGeneratorModal: React.FC<TranscriptGeneratorModalProps> = ({
  isOpen,
  onClose,
  progress,
  onDownloadAgain,
  onPrint,
  studentName,
  studentId,
  programName,
  cumulativeGpa,
  totalCredits,
  filename
}) => {
  if (!isOpen) return null;

  const isCompleted = progress?.stage === 'completed';
  const isError = progress?.stage === 'error';
  const isRunning = !isCompleted && !isError;
  const percent = progress?.percent || 0;

  const steps = [
    { label: 'Compiling student course roll & credit hours', threshold: 25 },
    { label: 'Calculating term quality points & cumulative GPA', threshold: 50 },
    { label: 'Applying registrar security seal & verification token', threshold: 75 },
    { label: 'Rendering high-resolution vector PDF layout', threshold: 90 },
    { label: 'Compiling & initiating official document download', threshold: 100 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#002366] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <UniversityLogo size="sm" withRing />
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] block font-display">
                Office of the University Registrar
              </span>
              <h2 className="text-lg font-bold font-display text-white">
                Official Academic Transcript Generator
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            Automated compilation of student course records, grade points, and academic standing into an accredited registrar PDF report.
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {/* Student Dossier Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-600 block">Student Name</span>
              <span className="font-bold text-slate-900 truncate block font-display">{studentName}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-600 block">Student ID</span>
              <span className="font-mono font-bold text-[#002366] block">{studentId}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-600 block">Degree Program</span>
              <span className="font-medium text-slate-800 truncate block">{programName}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-600 block">Academic Standing</span>
              <span className="font-bold text-emerald-700 block">
                GPA {cumulativeGpa.toFixed(2)} • {totalCredits} Credits
              </span>
            </div>
          </div>

          {/* Progress Bar & Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                {isRunning && <Loader2 className="w-4 h-4 text-[#002366] animate-spin" />}
                {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {isError && <AlertCircle className="w-4 h-4 text-rose-600" />}
                <span>
                  {progress?.statusText || 'Compiling official academic records...'}
                </span>
              </span>
              <span className="font-mono font-bold text-[#002366]">{percent}%</span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isCompleted
                    ? 'bg-emerald-600'
                    : isError
                    ? 'bg-rose-500'
                    : 'bg-gradient-to-r from-[#002366] via-[#1a4499] to-[#C5A059]'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Detailed Verification Checklist */}
          <div className="border border-slate-100 rounded-xl p-3 bg-white space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
              Registrar Compilation Checklist
            </span>
            <div className="space-y-1.5">
              {steps.map((step, idx) => {
                const stepDone = percent >= step.threshold || isCompleted;
                const isCurrent = percent < step.threshold && (idx === 0 || percent >= steps[idx - 1].threshold);

                return (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    {stepDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-[#002366] border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span
                      className={`text-xs ${
                        stepDone
                          ? 'text-slate-800 font-medium'
                          : isCurrent
                          ? 'text-[#002366] font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error notice if failed */}
          {isError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Compilation Interrupted</span>
              </div>
              <p className="text-[11px] text-rose-600">
                {progress?.errorMessage || 'An error occurred during PDF rendering. You can still use the browser print feature.'}
              </p>
            </div>
          )}

          {/* Success notice */}
          {isCompleted && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-900">
                  Official Transcript Compiled Successfully!
                </span>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Your certified academic transcript has been formatted and saved to your device as <span className="font-mono font-semibold">{filename}</span>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between gap-3">
          <button
            onClick={onPrint}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Transcript</span>
          </button>

          <div className="flex items-center gap-2">
            {isCompleted ? (
              <>
                <button
                  onClick={onDownloadAgain}
                  className="px-4 py-2 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold flex items-center gap-2 shadow transition-colors"
                >
                  <Download className="w-4 h-4 text-[#C5A059]" />
                  <span>Download Again</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
                >
                  Done
                </button>
              </>
            ) : isError ? (
              <button
                onClick={onDownloadAgain}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 transition-colors"
              >
                Retry Generation
              </button>
            ) : (
              <button
                disabled
                className="px-5 py-2 rounded-lg bg-slate-300 text-slate-500 text-xs font-bold flex items-center gap-2 cursor-not-allowed"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
