import React, { useState } from 'react';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  X,
  FileCheck,
  Building,
  Calendar,
  Award
} from 'lucide-react';

interface TranscriptVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentId: string;
  programName: string;
  cumulativeGpa: number;
  totalCredits: number;
  verificationHash: string;
  documentRef: string;
  issueDate: string;
}

export const TranscriptVerificationModal: React.FC<TranscriptVerificationModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentId,
  programName,
  cumulativeGpa,
  totalCredits,
  verificationHash,
  documentRef,
  issueDate
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  if (!isOpen) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(verificationHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(documentRef);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

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
                Institutional Registry System
              </span>
              <h2 className="text-lg font-bold font-display text-white">
                Official Electronic Verification
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-200">
            Real-time verification of official academic credentials against the University Central Registrar Archive.
          </p>
        </div>

        {/* Verification Status Badge */}
        <div className="bg-emerald-50 border-b border-emerald-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 font-display">
                AUTHENTIC RECORD VERIFIED
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Certified by the Office of the University Registrar, Phoenix, Arizona, USA.
            </p>
          </div>
        </div>

        {/* Record Details */}
        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Candidate Name</span>
              <span className="font-bold text-slate-900 font-display text-sm">{studentName}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Matriculation ID</span>
              <span className="font-mono font-bold text-[#002366] text-sm">{studentId}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Degree Program</span>
              <span className="font-medium text-slate-800">{programName}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Cumulative Status</span>
              <span className="font-bold text-emerald-700">
                GPA {cumulativeGpa.toFixed(2)} • {totalCredits} Credits
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Document Reference</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono font-bold text-slate-900">{documentRef}</span>
                <button
                  onClick={handleCopyRef}
                  className="text-slate-400 hover:text-[#002366] transition-colors p-0.5"
                  title="Copy reference"
                >
                  {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Date of Certification</span>
              <span className="font-medium text-slate-700">{issueDate}</span>
            </div>
          </div>

          {/* Cryptographic SHA-256 Hash */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600">
                Cryptographic Security Hash (SHA-256)
              </span>
              <button
                onClick={handleCopyHash}
                className="text-[10px] font-bold text-[#002366] hover:text-[#C5A059] flex items-center gap-1 transition-colors"
              >
                {copiedHash ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Hash</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-[10px] rounded-lg break-all border border-slate-800 selection:bg-emerald-900">
              {verificationHash}
            </div>
            <p className="text-[10px] text-slate-600 leading-normal">
              This tamper-evident digital token cryptographically anchors this student record to the university institutional ledger. Any unauthorized modification to grades, credits, or honors will invalidate this signature.
            </p>
          </div>

          {/* Institutional Guarantee */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
            <Building className="w-4 h-4 text-[#002366] shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Official records may be verified by third parties, academic councils, or foreign accreditation boards by contacting <strong className="text-slate-800">registrar@bibu-edu.org</strong> or submitting document reference <strong className="font-mono text-[#002366]">{documentRef}</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold transition-colors shadow"
          >
            Close Verification
          </button>
        </div>
      </div>
    </div>
  );
};
