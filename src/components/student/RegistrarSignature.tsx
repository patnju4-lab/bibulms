import React from 'react';
import { ShieldCheck, CheckCircle2, Lock, Clock, Calendar, FileCheck, Stamp } from 'lucide-react';

export interface RegistrarSignatureProps {
  status: string; // e.g. 'Verified' | 'Pending Verification' | 'Draft' | 'Official'
  timestamp?: string;
  registrarName?: string;
  registrarTitle?: string;
  institutionName?: string;
  verificationSerial?: string;
  securityHash?: string;
  customSignatureUrl?: string | null;
  className?: string;
  variant?: 'compact' | 'full' | 'inline';
}

/**
 * Visual 'Registrar Signature' component in TranscriptView.
 * Appears ONLY when transcript status is marked as 'Verified'.
 * Features a stylized digital signature image overlay and an associated timestamp.
 */
export const RegistrarSignature: React.FC<RegistrarSignatureProps> = ({
  status,
  timestamp = 'September 28, 2026, 08:53:10 UTC',
  registrarName = 'Rev. Dr. Sarah M. Jenkins, Th.D.',
  registrarTitle = 'University Registrar & Chief Academic Records Officer',
  institutionName = 'Breakthrough International Bible University',
  verificationSerial = 'TRN-BIBU-2026-SECURE',
  securityHash = '0x8f7c3a92b1e4d5f678901234abcdef567890',
  customSignatureUrl,
  className = '',
  variant = 'compact'
}) => {
  // STRICT REQUIREMENT: Appears ONLY when transcript status is marked as 'Verified'
  if (status !== 'Verified') {
    return null;
  }

  if (variant === 'inline') {
    return (
      <div className={`space-y-1.5 text-center sm:text-right ${className}`}>
        {/* Stylized Digital Signature Overlay Container */}
        <div className="relative h-14 sm:h-16 flex items-end justify-center sm:justify-end border-b-2 border-[#002366] pb-1.5 overflow-hidden group">
          {/* Subtle Security Guilloche Pattern Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center sm:justify-end pr-2">
            <svg width="180" height="50" viewBox="0 0 180 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 25 C 45 5, 90 45, 135 25 C 155 15, 170 35, 180 25" stroke="#C5A059" strokeWidth="1" strokeDasharray="3 2" />
              <path d="M0 20 C 45 40, 90 10, 135 30 C 155 40, 170 15, 180 25" stroke="#002366" strokeWidth="0.8" />
              <circle cx="140" cy="25" r="18" stroke="#C5A059" strokeWidth="0.8" strokeDasharray="2 2" />
            </svg>
          </div>

          {/* Golden Circular Seal Watermark Overlay behind signature */}
          <div className="absolute right-2 sm:right-4 top-0 opacity-20 pointer-events-none select-none">
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#C5A059] flex items-center justify-center transform rotate-12">
              <span className="text-[6.5px] font-mono font-bold text-[#002366] uppercase tracking-tighter text-center">
                SEALED<br />REGISTRAR
              </span>
            </div>
          </div>

          {/* Stylized Signature Image Overlay */}
          {customSignatureUrl ? (
            <img
              src={customSignatureUrl}
              alt="Registrar Digital Signature"
              className="max-h-12 max-w-[170px] object-contain relative z-10 filter drop-shadow-xs"
            />
          ) : (
            <div className="relative z-10 flex items-end">
              <svg
                className="max-h-12 w-44 sm:w-48 text-[#002366]"
                viewBox="0 0 220 55"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Stylized Registrar Digital Signature"
              >
                {/* Security Microprint Baseline */}
                <line x1="5" y1="48" x2="215" y2="48" stroke="#C5A059" strokeWidth="0.6" strokeDasharray="1 1" />
                
                {/* Stylized Signature Flourish Strokes */}
                <path
                  d="M 12 42 C 28 8, 38 2, 48 18 C 55 30, 62 44, 74 28 C 84 14, 96 6, 106 22 C 114 34, 124 28, 134 16 C 144 4, 152 20, 162 24 C 172 28, 180 14, 192 18 C 202 22, 212 36, 218 30"
                  stroke="#002366"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 32 30 C 60 36, 95 32, 140 28 C 170 25, 195 32, 212 36"
                  stroke="#C5A059"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <text
                  x="14"
                  y="46"
                  fill="#002366"
                  fontSize="14"
                  fontFamily="serif"
                  fontStyle="italic"
                  fontWeight="bold"
                >
                  Sarah M. Jenkins
                </text>
              </svg>
            </div>
          )}

          {/* Status Overlay Badge */}
          <div className="absolute left-0 bottom-0.5 flex items-center gap-1 text-[8px] font-mono text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>VERIFIED</span>
          </div>
        </div>

        {/* Signer Identity */}
        <div className="text-[10px] font-black uppercase text-slate-800 font-display">
          {registrarName}
        </div>
        <div className="text-[9px] text-slate-600 font-medium">
          {registrarTitle}
        </div>
        <div className="text-[8.5px] text-slate-500 font-mono">
          {institutionName} • Phoenix, AZ
        </div>

        {/* Associated Timestamp Display */}
        <div className="pt-1 flex items-center justify-center sm:justify-end gap-1.5 text-[8.5px] font-mono text-slate-500">
          <Clock className="w-3 h-3 text-emerald-700 shrink-0" />
          <span>e-Signed: <strong className="text-slate-800 font-semibold">{timestamp}</strong></span>
        </div>
      </div>
    );
  }

  // 'compact' or 'full' banner variant
  return (
    <div
      className={`relative p-4 sm:p-5 bg-gradient-to-r from-emerald-50/80 via-white to-blue-50/60 border-2 border-emerald-400 rounded-2xl shadow-xs print:border-solid print:border-slate-400 print:bg-white overflow-hidden transition-all animate-fade-in ${className}`}
    >
      {/* Background Watermark Stamp */}
      <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none select-none print:opacity-5">
        <div className="w-36 h-36 rounded-full border-4 border-[#002366] flex items-center justify-center transform -rotate-12">
          <Stamp className="w-20 h-20 text-[#002366]" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Left Side: Verification Status & Audit Details */}
        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-800 text-white rounded-md text-[10px] font-bold uppercase tracking-wider font-display shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Registrar Signature Verification</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Transcript Status: VERIFIED</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#002366]/10 text-[#002366] text-[9.5px] font-mono">
              <Lock className="w-3 h-3" />
              <span>PKI 4096-Bit Hash Secured</span>
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="text-xs font-black text-[#002366] font-display">
              Official University Registrar Digital Authentication
            </div>
            <p className="text-[10.5px] text-slate-600 leading-relaxed max-w-xl">
              This academic record has completed full institutional audit and was formally signed by the University Registrar. The digital signature overlay and associated cryptographic timestamp attest to the complete veracity of all grades, course credits, and degree conferrals.
            </p>
          </div>

          {/* Associated Timestamp and Metadata Details */}
          <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 text-[9.5px] font-mono text-slate-600">
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              <Clock className="w-3 h-3 text-emerald-700 shrink-0" />
              <span>
                Timestamp: <strong className="text-slate-900">{timestamp}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              <Calendar className="w-3 h-3 text-[#002366] shrink-0" />
              <span>
                Serial: <strong className="text-[#002366]">{verificationSerial}</strong>
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-slate-500">
              <span>Token:</span>
              <strong className="text-slate-700">{securityHash.slice(0, 16)}...</strong>
            </div>
          </div>
        </div>

        {/* Right Side: Stylized Digital Signature Image Overlay Box */}
        <div className="shrink-0 flex flex-col items-center justify-center w-full sm:w-auto">
          <div className="relative p-3 bg-white rounded-xl border-2 border-emerald-300 shadow-md flex flex-col items-center justify-center text-center min-w-[220px]">
            {/* Security Guilloche Overlay in Box Background */}
            <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden rounded-xl">
              <svg className="w-full h-full" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 40 C 50 10, 100 70, 150 40 C 175 25, 200 55, 200 40" stroke="#002366" strokeWidth="1" />
                <path d="M 0 35 C 50 65, 100 5, 150 35 C 175 50, 200 20, 200 35" stroke="#C5A059" strokeWidth="1" strokeDasharray="3 2" />
                <circle cx="160" cy="40" r="22" stroke="#C5A059" strokeWidth="1" strokeDasharray="2 3" />
              </svg>
            </div>

            {/* Stylized Digital Signature Graphic */}
            <div className="relative z-10 h-14 flex items-center justify-center w-full px-2">
              {customSignatureUrl ? (
                <img
                  src={customSignatureUrl}
                  alt="Registrar Digital Signature"
                  className="max-h-12 max-w-[180px] object-contain filter drop-shadow-xs"
                />
              ) : (
                <svg
                  className="max-h-12 w-48 text-[#002366]"
                  viewBox="0 0 220 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Registrar Signature Graphic Overlay"
                >
                  <path
                    d="M 10 38 C 25 10, 35 4, 45 20 C 52 32, 60 42, 70 30 C 80 18, 92 10, 102 24 C 110 35, 120 30, 130 18 C 140 6, 148 22, 158 26 C 168 30, 175 16, 185 22 C 195 28, 205 32, 215 28"
                    stroke="#002366"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 28 32 C 40 34, 75 32, 115 29 C 145 27, 180 30, 208 34"
                    stroke="#C5A059"
                    strokeWidth="1.2"
                    strokeDasharray="2 2"
                    strokeLinecap="round"
                  />
                  <text
                    x="12"
                    y="46"
                    fill="#002366"
                    fontSize="14"
                    fontFamily="serif"
                    fontStyle="italic"
                    fontWeight="bold"
                  >
                    Sarah M. Jenkins
                  </text>
                </svg>
              )}
            </div>

            {/* Signer Title */}
            <div className="relative z-10 border-t border-slate-200 pt-1.5 w-full mt-1">
              <div className="text-[10px] font-black uppercase text-slate-800 font-display">
                {registrarName}
              </div>
              <div className="text-[8.5px] text-slate-600 font-medium">
                {registrarTitle}
              </div>
            </div>

            {/* Micro-Verification Timestamp Overlay */}
            <div className="relative z-10 mt-1 flex items-center justify-between w-full px-1 text-[8px] font-mono text-slate-500 border-t border-dashed border-slate-200 pt-1">
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" />
                VERIFIED
              </span>
              <span>{timestamp.split(',')[0]}</span>
            </div>
          </div>

          <div className="text-[8px] font-mono text-slate-400 mt-1 text-center">
            [ REGISTRAR DIGITAL SIGNATURE OVERLAY ]
          </div>
        </div>
      </div>
    </div>
  );
};
