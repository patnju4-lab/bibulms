import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck,
  QrCode,
  ExternalLink,
  Copy,
  Check,
  Lock,
  Maximize2,
  Sparkles,
  CheckCircle2,
  Smartphone
} from 'lucide-react';

export interface TranscriptQrCodeBadgeProps {
  documentRef: string;
  verificationHash: string;
  studentId: string;
  studentName: string;
  programName?: string;
  cumulativeGpa?: number;
  issueDate?: string;
  onOpenVerification?: () => void;
  onOpenQrModal?: () => void;
  className?: string;
}

export const TranscriptQrCodeBadge: React.FC<TranscriptQrCodeBadgeProps> = ({
  documentRef,
  verificationHash,
  studentId,
  studentName,
  programName = 'Theology & Biblical Studies',
  cumulativeGpa = 3.88,
  issueDate = 'September 10, 2026',
  onOpenVerification,
  onOpenQrModal,
  className = ''
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  // Secure certificate verification endpoint URL
  const verificationUrl = `https://bibu.university/verify/transcript?serial=${encodeURIComponent(
    documentRef
  )}&student=${encodeURIComponent(studentId)}&hash=${encodeURIComponent(
    verificationHash.substring(0, 16)
  )}&cert_auth=true`;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(verificationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDirectVerify = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenVerification) {
      onOpenVerification();
    } else {
      window.open(verificationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`relative p-4 sm:p-5 bg-gradient-to-r from-emerald-50/90 via-white to-blue-50/70 border-2 border-emerald-300 rounded-2xl shadow-xs print:border-solid print:border-slate-300 print:bg-white overflow-hidden transition-all hover:border-emerald-400 ${className}`}
    >
      {/* Background Decorative Shield Watermark */}
      <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none select-none print:hidden">
        <ShieldCheck className="w-40 h-40 text-emerald-800" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Left Section: Information & Direct Verification Endpoint Link */}
        <div className="flex-1 space-y-2.5 text-center md:text-left">
          {/* Header & Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-800 text-white rounded-md text-[10px] font-bold uppercase tracking-wider font-display shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Official Certificate Verification QR Endpoint</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Instant Authentication Active</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#002366]/10 text-[#002366] text-[10px] font-mono font-semibold">
              <Lock className="w-3 h-3" />
              <span>TLS / SHA-256 Encrypted</span>
            </span>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 font-display flex items-center justify-center md:justify-start gap-1.5">
              <span>Secure Digital Transcript & Certificate Authentication</span>
              <Smartphone className="w-3.5 h-3.5 text-emerald-700 hidden sm:inline" />
            </h4>
            <p className="text-[10.5px] text-slate-600 leading-relaxed max-w-2xl">
              Point any mobile smartphone camera or official verification terminal at this unique QR code to instantly authenticate this academic transcript against the immutable University Registrar Ledger. Confirms student identity, conferred degree, cumulative GPA, and registrar signature integrity.
            </p>
          </div>

          {/* Verification Endpoint URL Box */}
          <div className="p-2.5 bg-white/90 rounded-xl border border-emerald-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px]">
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-slate-500 uppercase text-[9px] shrink-0">
                Secure Endpoint:
              </span>
              <a
                href={verificationUrl}
                onClick={handleDirectVerify}
                className="font-mono text-emerald-800 hover:text-emerald-950 hover:underline truncate font-semibold flex items-center gap-1 cursor-pointer"
                title="Click to authenticate via secure verification endpoint"
              >
                <span className="truncate">{verificationUrl}</span>
                <ExternalLink className="w-3 h-3 shrink-0 text-emerald-600 no-print" />
              </a>
            </div>

            {/* Quick Action Buttons (Screen-Only) */}
            <div className="no-print flex items-center justify-center sm:justify-end gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-[9px] font-medium"
                title="Copy secure verification endpoint URL"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLink ? 'Copied' : 'Copy URL'}</span>
              </button>

              {onOpenVerification && (
                <button
                  type="button"
                  onClick={onOpenVerification}
                  className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white transition-colors flex items-center gap-1 text-[9px] font-bold shadow-2xs"
                  title="Run real-time authenticity validation check"
                >
                  <Sparkles className="w-3 h-3 text-[#C5A059]" />
                  <span>Verify Authenticity</span>
                </button>
              )}
            </div>
          </div>

          {/* Micro-Security Metadata Details */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-[9px] font-mono text-slate-500 pt-0.5">
            <span>
              Serial: <strong className="text-[#002366]">{documentRef}</strong>
            </span>
            <span>•</span>
            <span className="truncate max-w-xs">
              Token: <strong className="text-slate-700">{verificationHash.slice(0, 16)}...</strong>
            </span>
            <span>•</span>
            <span>Conferred Date: {issueDate}</span>
          </div>
        </div>

        {/* Right Section: Unique Scannable QR Code */}
        <div className="shrink-0 flex flex-col items-center justify-center">
          <div
            className="group relative p-2.5 bg-white rounded-xl border-2 border-emerald-200 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col items-center justify-center"
            onClick={onOpenQrModal || onOpenVerification}
            title="Click to enlarge QR code or run verification simulation"
          >
            {/* The Actual Scannable SVG QR Code */}
            <div className="relative">
              <QRCodeSVG
                value={verificationUrl}
                size={102}
                level="H"
                includeMargin={false}
                fgColor="#002366"
                imageSettings={{
                  src: "",
                  x: undefined,
                  y: undefined,
                  height: 18,
                  width: 18,
                  excavate: true
                }}
              />
              {/* Central Shield Icon in center of QR code */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-6 h-6 rounded-md bg-[#002366] text-[#C5A059] flex items-center justify-center shadow-xs border border-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Hover overlay on screen */}
            <div className="no-print absolute inset-0 bg-[#002366]/70 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex flex-col items-center justify-center text-white text-[9px] font-bold p-1 text-center">
              <Maximize2 className="w-4 h-4 mb-0.5 text-[#C5A059]" />
              <span>Enlarge / Verify</span>
            </div>

            {/* Micro Badge Under QR */}
            <div className="mt-1.5 text-center">
              <span className="inline-block text-[8px] font-mono font-bold tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                SCAN TO VERIFY
              </span>
            </div>
          </div>

          <div className="text-[8px] font-mono text-slate-400 mt-1 text-center">
            [ SECURE 2D MATRIX ]
          </div>
        </div>
      </div>
    </div>
  );
};
