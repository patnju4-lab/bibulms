import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import { ShieldCheck, Search, Award, CheckCircle2, XCircle, GraduationCap, Calendar, FileText, QrCode } from 'lucide-react';
import { Certificate } from '../../types';

export const CertificateVerification: React.FC = () => {
  const { verifyCertificateCode, certificates } = useApp();
  const [code, setCode] = useState('');
  const [result, setResult] = useState<Certificate | null>(null);
  const [searched, setSearched] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const cert = verifyCertificateCode(code);
    setResult(cert || null);
    setSearched(true);
  };

  const sampleCodes = ['BIBU-2024-BTH-8821', 'BIBU-2023-DMIN-3109', 'VRF-8821-BTH-AZ'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <UniversityLogo size="xl" withRing className="shadow-lg" />
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A059] uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
          <span>Office of the University Registrar</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#002366]">
          Official Credential & Certificate Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-normal">
          Verify the authenticity of degrees, diplomas, and academic certificates conferred by Breakthrough International Bible University, Phoenix, Arizona.
        </p>
      </div>

      {/* Verification Search Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <form onSubmit={handleVerify} className="space-y-4">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Enter Certificate Number or Verification Code:
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. BIBU-2024-BTH-8821 or VRF-8821-BTH-AZ"
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-lg border border-slate-300 font-mono uppercase focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow transition-all"
            >
              Verify Credential
            </button>
          </div>
        </form>

        {/* Quick Sample Code Pills */}
        <div className="pt-2 flex items-center flex-wrap gap-2 text-[11px] text-slate-500">
          <span>Try sample verification:</span>
          {sampleCodes.map((sc) => (
            <button
              key={sc}
              onClick={() => {
                setCode(sc);
                const cert = verifyCertificateCode(sc);
                setResult(cert || null);
                setSearched(true);
              }}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-amber-100 hover:text-amber-900 font-mono transition-colors"
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Display */}
      {searched && (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          {result ? (
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white rounded-2xl border-4 border-amber-400 p-8 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
              {/* Verified Status Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-500/30 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Authentic Credential Verified
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      Database Record: {result.certificateNumber}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
                    Security Code: {result.verificationCode}
                  </span>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="text-center space-y-4 py-4">
                <div className="flex justify-center mb-2">
                  <UniversityLogo size="xl" withRing className="shadow-xl" />
                </div>
                <div className="text-xs uppercase tracking-widest text-[#C5A059] font-display font-black">
                  Breakthrough International Bible University • Phoenix, Arizona, USA
                </div>
                <div className="text-xs text-slate-400">This officially certifies that</div>
                <div className="text-2xl sm:text-3xl font-black font-serif text-white tracking-wide">
                  {result.studentName}
                </div>
                <div className="text-xs text-slate-400">has fulfilled all requirements and is conferred the degree of</div>
                <div className="text-lg sm:text-xl font-bold font-serif text-amber-300">
                  {result.degreeTitle}
                </div>
                <div className="text-xs text-slate-300">
                  through the <strong>{result.schoolName}</strong>
                </div>
                {result.honors && (
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs font-serif text-amber-300">
                    Honors: {result.honors}
                  </div>
                )}
              </div>

              {/* Signatures & Conferral Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-amber-500/30 text-xs text-slate-300">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Date of Conferral</div>
                  <div className="font-semibold text-slate-200 mt-0.5">{result.conferralDate}</div>
                </div>

                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">University Chancellor</div>
                  <div className="font-semibold text-slate-200 mt-0.5">{result.chancellorName}</div>
                </div>

                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">University Registrar</div>
                  <div className="font-semibold text-slate-200 mt-0.5">{result.registrarName}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-red-200 p-8 text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Credential Not Found</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                No active or verified academic record was found for "{code}". Please verify that you entered the exact Certificate Number or Verification Code from the physical or digital document.
              </p>
              <div className="text-xs text-blue-900 font-semibold pt-2">
                For manual verification inquiries, contact: registrar@bibu-edu.org
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
