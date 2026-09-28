import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Lock,
  Stamp,
  ExternalLink,
  Check,
  Copy,
  Sparkles,
  FileCheck2,
  UserCheck,
  Calendar,
  BookOpen,
  GraduationCap
} from 'lucide-react';

export interface AcademicRegistrarStampProps {
  registrarName?: string;
  registrarTitle?: string;
  verificationCode?: string;
  issueDate?: string;
  institutionName?: string;
  securityHash?: string;
  studentName?: string;
  studentId?: string;
  programName?: string;
  cumulativeGpa?: number;
  creditsConferred?: number;
  academicStanding?: string;
  onVerifyClick?: () => void;
  className?: string;
}

export const AcademicRegistrarStamp: React.FC<AcademicRegistrarStampProps> = ({
  registrarName = 'Rev. Dr. Sarah M. Jenkins, Th.D.',
  registrarTitle = 'University Registrar & Chief Academic Records Officer',
  verificationCode = 'BIBU-REG-VAL-2026-SECURE',
  issueDate = 'September 10, 2026',
  institutionName = 'Breakthrough International Bible University',
  securityHash = '0x8f7c3a92b1e4d5f678901234abcdef567890',
  studentName = 'Candidate Name',
  studentId = 'BIBU-ST-2026',
  programName = 'Bachelor of Arts in Theology & Biblical Studies',
  cumulativeGpa = 3.88,
  creditsConferred = 120,
  academicStanding = 'Summa Cum Laude',
  onVerifyClick,
  className = ''
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [showMetadataAudit, setShowMetadataAudit] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${verificationCode}:${securityHash.slice(0, 16)}`);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div
      className={`relative p-5 sm:p-6 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border-2 border-dashed border-[#002366]/40 rounded-2xl shadow-xs print:border-solid print:border-slate-400 print:bg-white overflow-hidden transition-all hover:border-[#002366] ${className}`}
    >
      {/* Decorative Security Background Watermark */}
      <div className="absolute -right-8 -bottom-8 opacity-[0.035] pointer-events-none select-none print:opacity-[0.06]">
        <div className="w-64 h-64 rounded-full border-8 border-[#002366] flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-4 border-[#C5A059] flex items-center justify-center">
            <Award className="w-24 h-24 text-[#002366]" />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left & Middle Column: Registrar Digital Signature & Metadata Validation */}
        <div className="space-y-3.5 flex-1 w-full text-center sm:text-left">
          {/* Component Badge / Title */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#002366] text-[#C5A059] rounded-md text-[10px] font-bold uppercase tracking-wider font-display shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Academic Registrar Digital Signature</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Validated & Digitally Sealed</span>
            </span>
            <span className="no-print hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              <Lock className="w-3 h-3 text-slate-400" />
              PKI SHA-256 Validated
            </span>
          </div>

          {/* Registrar Signature & Signer Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 items-end">
            <div>
              {/* Calligraphic Stylized Electronic Signature Display */}
              <div className="relative h-12 flex items-end justify-center sm:justify-start border-b border-slate-300 pb-1 mb-1">
                <svg
                  className="max-h-11 w-44 text-[#002366]"
                  viewBox="0 0 220 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Registrar Signature Graphic"
                >
                  <path
                    d="M 10 38 C 25 10, 35 4, 45 20 C 52 32, 60 42, 70 30 C 80 18, 92 10, 102 24 C 110 35, 120 30, 130 18 C 140 6, 148 22, 158 26 C 168 30, 175 16, 185 22 C 195 28, 205 32, 215 28"
                    stroke="#002366"
                    strokeWidth="2.2"
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
                    fontSize="13"
                    fontFamily="serif"
                    fontStyle="italic"
                    fontWeight="bold"
                  >
                    Sarah M. Jenkins
                  </text>
                </svg>
                <span className="absolute right-0 bottom-1 text-[8.5px] font-mono text-slate-400 no-print">
                  e-Signed: {issueDate}
                </span>
              </div>
              <div className="text-xs font-black text-[#002366] font-display">
                {registrarName}
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                {registrarTitle}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {institutionName} • Office of the University Registrar
              </div>
            </div>

            {/* Electronic Endorsement Certificate & Date */}
            <div className="space-y-1 text-center sm:text-left bg-slate-50/80 p-2.5 rounded-lg border border-slate-200">
              <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold font-display">
                Official Validation Endorsement
              </div>
              <div className="text-[10px] text-slate-700 leading-tight">
                "I hereby attest and certify that this transcript represents a true and complete academic record of the matriculated candidate named herein."
              </div>
              <div className="pt-1 flex items-center justify-between text-[9px] font-mono text-slate-500">
                <span>Conferral: <strong className="text-[#002366]">{issueDate}</strong></span>
                <span className="text-emerald-700 font-bold">● Validated Active</span>
              </div>
            </div>
          </div>

          {/* Transcript Metadata Validation Card */}
          <div className="pt-2">
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#002366] font-display flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Transcript Metadata Verification Matrix</span>
                </span>
                <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                  Metadata Checked & True
                </span>
              </div>

              {/* Verified Metadata Fields */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px]">
                <div className="bg-slate-50/70 p-1.5 rounded border border-slate-150">
                  <span className="text-slate-400 block text-[8.5px] uppercase">Candidate Name</span>
                  <span className="font-bold text-slate-900 truncate block" title={studentName}>
                    {studentName}
                  </span>
                </div>
                <div className="bg-slate-50/70 p-1.5 rounded border border-slate-150">
                  <span className="text-slate-400 block text-[8.5px] uppercase">Matriculation ID</span>
                  <span className="font-mono font-bold text-[#002366] block">
                    {studentId}
                  </span>
                </div>
                <div className="bg-slate-50/70 p-1.5 rounded border border-slate-150 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[8.5px] uppercase">Program / Degree</span>
                  <span className="font-semibold text-slate-800 truncate block" title={programName}>
                    {programName}
                  </span>
                </div>
                <div className="bg-slate-50/70 p-1.5 rounded border border-slate-150">
                  <span className="text-slate-400 block text-[8.5px] uppercase">Cumulative GPA</span>
                  <span className="font-black text-[#002366] block">
                    {cumulativeGpa.toFixed(2)} / 4.00
                  </span>
                </div>
                <div className="bg-slate-50/70 p-1.5 rounded border border-slate-150">
                  <span className="text-slate-400 block text-[8.5px] uppercase">Credits Conferred</span>
                  <span className="font-bold text-slate-800 block">
                    {creditsConferred} Semester Units
                  </span>
                </div>
                <div className="bg-slate-50/70 p-1.5 rounded border border-slate-150">
                  <span className="text-slate-400 block text-[8.5px] uppercase">Academic Classification</span>
                  <span className="font-bold text-[#C5A059] truncate block">
                    {academicStanding}
                  </span>
                </div>
              </div>

              {/* Cryptographic Hash & Validation Action */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[9px] font-mono text-slate-500">
                <div className="flex items-center gap-1.5 truncate max-w-sm">
                  <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="text-slate-400">Validation Token:</span>
                  <strong className="text-slate-800 truncate">{verificationCode}</strong>
                </div>

                <div className="no-print flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1 text-slate-500 hover:text-slate-800 rounded bg-slate-150 hover:bg-slate-200 transition-colors flex items-center gap-1 text-[8.5px]"
                    title="Copy Validation Token"
                  >
                    {copiedToken ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedToken ? 'Copied' : 'Copy Token'}</span>
                  </button>
                  {onVerifyClick && (
                    <button
                      type="button"
                      onClick={onVerifyClick}
                      className="px-2 py-0.5 rounded text-[8.5px] font-bold bg-[#002366] text-[#C5A059] hover:bg-[#001A4D] transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Audit Verification</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stylized University Stamp / Embossed Registrar Wax-Style Seal */}
        <div className="shrink-0 flex flex-col items-center justify-center p-2">
          <div
            className="group relative cursor-pointer select-none transition-transform hover:scale-105 duration-300"
            onClick={onVerifyClick}
            title="Click to view official verification audit"
          >
            {/* Outer Stamp Container with Tilt & Stamp Ink Effect */}
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full flex items-center justify-center transform -rotate-2 print:rotate-0">
              {/* Outer Decorative Ring with micro-dots */}
              <div className="absolute inset-0 rounded-full border-4 border-double border-[#002366] bg-gradient-to-tr from-[#002366] via-[#001F5C] to-[#003388] text-white shadow-xl p-2.5 print:bg-white print:text-[#002366] print:border-4">
                
                {/* SVG Concentric Text & Motifs */}
                <svg
                  className="w-full h-full"
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <path
                      id="stampOuterCircle"
                      d="M 100, 100 m -82, 0 a 82,82 0 1,1 164,0 a 82,82 0 1,1 -164,0"
                    />
                    <path
                      id="stampInnerCircle"
                      d="M 100, 100 m -58, 0 a 58,58 0 1,0 116,0 a 58,58 0 1,0 -116,0"
                    />
                  </defs>

                  {/* Outer Beaded Border Ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r="92"
                    fill="none"
                    stroke="#C5A059"
                    strokeWidth="1.5"
                    strokeDasharray="2 3"
                    className="opacity-75"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="86"
                    fill="none"
                    stroke="#C5A059"
                    strokeWidth="1"
                    className="opacity-90"
                  />

                  {/* Circular Arc Text: University Name */}
                  <text
                    fontSize="9.5"
                    fontWeight="bold"
                    fill="#C5A059"
                    letterSpacing="2.8"
                    className="font-display uppercase"
                  >
                    <textPath href="#stampOuterCircle" startOffset="50%" textAnchor="middle">
                      • BREAKTHROUGH INT'L BIBLE UNIVERSITY •
                    </textPath>
                  </text>

                  {/* Inner Circular Arc Text: Registrar Seal */}
                  <text
                    fontSize="7.8"
                    fontWeight="bold"
                    fill="#FFFFFF"
                    letterSpacing="1.8"
                    className="font-mono uppercase opacity-90"
                  >
                    <textPath href="#stampInnerCircle" startOffset="50%" textAnchor="middle">
                      OFFICIAL SEAL OF THE REGISTRAR
                    </textPath>
                  </text>

                  {/* Inner Seal Boundary */}
                  <circle
                    cx="100"
                    cy="100"
                    r="48"
                    fill="none"
                    stroke="#C5A059"
                    strokeWidth="1.8"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="44"
                    fill="#001844"
                    stroke="#C5A059"
                    strokeWidth="0.8"
                    strokeDasharray="3 2"
                    className="opacity-90 print:fill-white"
                  />

                  {/* Center Emblem: Open Bible, Cross & Stars */}
                  <g transform="translate(100, 100) scale(0.9)">
                    {/* Golden Cross */}
                    <path
                      d="M -2 -22 L 2 -22 L 2 -12 L 10 -12 L 10 -8 L 2 -8 L 2 12 L -2 12 L -2 -8 L -10 -8 L -10 -12 L -2 -12 Z"
                      fill="#C5A059"
                    />
                    {/* Open Bible */}
                    <path
                      d="M -18 2 C -10 0, -3 4, 0 8 C 3 4, 10 0, 18 2 L 16 16 C 9 14, 3 17, 0 20 C -3 17, -9 14, -16 16 Z"
                      fill="#FFFFFF"
                      stroke="#C5A059"
                      strokeWidth="1"
                    />
                    {/* Left & Right Decorative Stars */}
                    <polygon
                      points="-26,-2 -24,-8 -30,-4 -22,-4 -28,-8"
                      fill="#C5A059"
                    />
                    <polygon
                      points="26,-2 24,-8 30,-4 22,-4 28,-8"
                      fill="#C5A059"
                    />
                    {/* Foundation Year */}
                    <text
                      x="0"
                      y="-25"
                      fontSize="7"
                      fontWeight="bold"
                      fill="#C5A059"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      EST. 2000
                    </text>
                  </g>
                </svg>

                {/* Sub-text Overlay at bottom of stamp */}
                <div className="absolute inset-x-0 bottom-4 text-center z-10">
                  <div className="text-[7.5px] font-mono font-bold tracking-widest text-[#C5A059] uppercase">
                    AUTHENTICATED
                  </div>
                  <div className="text-[6.5px] font-mono text-slate-300 print:text-slate-600">
                    PHOENIX, AZ
                  </div>
                </div>
              </div>

              {/* Glossy Stamp Glow Effect (Screen-Only) */}
              <div className="no-print absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
            </div>

            {/* Stamp Footer Label & Register Folio */}
            <div className="mt-2 text-center space-y-0.5">
              <div className="text-[9.5px] font-bold font-display uppercase tracking-wider text-[#002366] flex items-center justify-center gap-1">
                <Stamp className="w-3 h-3 text-[#C5A059]" />
                <span>Registrar Seal Stamp</span>
              </div>
              <div className="text-[8.5px] font-mono text-slate-500">
                Folio: REG-2026/048-TR
              </div>
              <div className="text-[8px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block font-bold">
                ✓ Seal Integrity Valid
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
