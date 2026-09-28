import React from 'react';
import { ShieldCheck, Award, CheckCircle2, Lock, Stamp } from 'lucide-react';

interface AcademicRegistrarStampProps {
  registrarName?: string;
  registrarTitle?: string;
  verificationCode?: string;
  issueDate?: string;
  institutionName?: string;
  securityHash?: string;
}

export const AcademicRegistrarStamp: React.FC<AcademicRegistrarStampProps> = ({
  registrarName = 'Rev. Dr. Sarah M. Jenkins, Th.D.',
  registrarTitle = 'University Registrar & Chief Academic Records Officer',
  verificationCode = 'BIBU-REG-VAL-2026-SECURE',
  issueDate = '2026-10-24',
  institutionName = 'Breakthrough International Bible University',
  securityHash = '0x8f7c3a92b1e4d5f678901234abcdef567890'
}) => {
  return (
    <div className="relative p-5 bg-gradient-to-br from-[#002366]/5 via-amber-500/5 to-[#002366]/10 border-2 border-dashed border-[#002366]/30 rounded-2xl shadow-xs print:border-solid print:border-slate-400 print:bg-white overflow-hidden">
      {/* Background watermark seal */}
      <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none select-none print:opacity-10">
        <div className="w-56 h-56 rounded-full border-8 border-[#002366] flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border-4 border-[#C5A059] flex items-center justify-center">
            <Award className="w-20 h-20 text-[#002366]" />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left side: Registrar details and cryptographic verification info */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#002366] text-[#C5A059] rounded-md text-[10px] font-bold uppercase tracking-wider font-display">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Academic Registrar Digital Signature & Seal</span>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-black text-[#002366] font-display">
              {registrarName}
            </div>
            <div className="text-xs text-slate-600 font-medium">
              {registrarTitle}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {institutionName} • Global Headquarters (Phoenix, AZ & Kenya Directorate)
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[10px] font-mono text-slate-600">
            <span className="bg-white/80 px-2 py-1 rounded border border-slate-200">
              Validation ID: <strong className="text-[#002366]">{verificationCode}</strong>
            </span>
            <span className="bg-white/80 px-2 py-1 rounded border border-slate-200">
              Conferral Date: <strong className="text-[#002366]">{issueDate}</strong>
            </span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Cryptographically Verified
            </span>
          </div>
        </div>

        {/* Right side: Stylized Embossed University Stamp / Seal Graphic */}
        <div className="shrink-0 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 rounded-full border-4 border-[#002366] bg-gradient-to-tr from-[#002366] to-[#003388] text-white flex flex-col items-center justify-center shadow-lg p-2 text-center print:bg-white print:text-[#002366] print:border-2">
            {/* Outer ring text simulation via CSS */}
            <div className="absolute inset-1 rounded-full border border-dashed border-[#C5A059] animate-spin-slow opacity-60"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center space-y-0.5">
              <div className="w-8 h-8 rounded-full bg-[#C5A059] text-[#002366] flex items-center justify-center shadow-xs">
                <Stamp className="w-4 h-4" />
              </div>
              <div className="text-[9px] font-bold uppercase tracking-tighter text-[#C5A059] font-display">
                OFFICIAL SEAL
              </div>
              <div className="text-[7.5px] font-mono tracking-widest text-white/90 print:text-slate-700">
                REGISTRAR
              </div>
              <div className="text-[6.5px] text-slate-200 font-mono print:text-slate-500">
                BIBU 2026
              </div>
            </div>
          </div>
          <div className="mt-1.5 text-[9px] font-mono text-slate-500 tracking-wider text-center">
            [ EMBOSSED SECURITY STAMP ]
          </div>
        </div>
      </div>
    </div>
  );
};
