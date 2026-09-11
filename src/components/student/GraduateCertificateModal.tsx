import React, { useState, useRef } from 'react';
import { UniversityLogo } from '../common/UniversityLogo';
import { GraduationCandidate } from '../../types/graduation';
import { Award, Printer, Download, ShieldCheck, X, CheckCircle2, Edit3, Upload, Image as ImageIcon } from 'lucide-react';

interface GraduateCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: GraduationCandidate;
}

export const GraduateCertificateModal: React.FC<GraduateCertificateModalProps> = ({
  isOpen,
  onClose,
  candidate
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  // Signatory State & Custom Digital Signature Uploads
  const [isEditingSigs, setIsEditingSigs] = useState(false);
  const [chancellorName, setChancellorName] = useState('Dr. Michael C. Sterling, Th.D.');
  const [chancellorTitle, setChancellorTitle] = useState('Chancellor & President');
  const [chancellorSigImg, setChancellorSigImg] = useState<string | null>(null);

  const [deanName, setDeanName] = useState('Prof. Dr. Patrick Njuguna, Ph.D.');
  const [deanTitle, setDeanTitle] = useState('Vice Chancellor');
  const [deanSigImg, setDeanSigImg] = useState<string | null>(null);

  const [registrarName, setRegistrarName] = useState('Rev. Dr. Sarah M. Jenkins, Th.D.');
  const [registrarTitle, setRegistrarTitle] = useState('University Registrar');
  const [registrarSigImg, setRegistrarSigImg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setter(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col my-auto">
        {/* Top Control Bar */}
        <div className="bg-[#002366] text-white px-6 py-4 flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-3">
            <UniversityLogo size="sm" withRing />
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] block font-display">
                Breakthrough International Bible University
              </span>
              <h2 className="text-base font-bold font-display text-white">
                Official Degree & Diploma Certificate Generator
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingSigs(!isEditingSigs)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                isEditingSigs
                  ? 'bg-[#C5A059] text-[#002366] border-[#C5A059]'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingSigs ? 'Hide Signature Panel' : 'Manage Signatures'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/20"
            >
              <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#b08b46] text-[#002366] text-xs font-black flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#002366]" />
              <span>PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-2"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Digital Signatures Management Panel (Collapsible) */}
        {isEditingSigs && (
          <div className="no-print bg-slate-50 border-b border-slate-200 p-4 space-y-4 text-xs animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-black uppercase tracking-wider text-[#002366] font-display">
                Dynamic Digital Signatures & Signatories Configuration
              </span>
              <span className="text-[10px] text-slate-500">
                Upload scanned signature images or stylus renders for authenticity verification.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Chancellor Signature Config */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">1. Chancellor & President</div>
                <input
                  type="text"
                  value={chancellorName}
                  onChange={(e) => setChancellorName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  placeholder="Full Name & Credentials"
                />
                <div className="flex items-center gap-2">
                  <label className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer text-center flex items-center justify-center gap-1.5 transition-colors border border-slate-300">
                    <Upload className="w-3.5 h-3.5 text-[#002366]" />
                    <span>Upload Sig Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setChancellorSigImg)}
                    />
                  </label>
                  {chancellorSigImg && (
                    <button
                      onClick={() => setChancellorSigImg(null)}
                      className="px-2 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 text-[10px]"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Vice Chancellor Signature Config */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">2. Vice Chancellor</div>
                <input
                  type="text"
                  value={deanName}
                  onChange={(e) => setDeanName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  placeholder="Full Name & Credentials"
                />
                <div className="flex items-center gap-2">
                  <label className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer text-center flex items-center justify-center gap-1.5 transition-colors border border-slate-300">
                    <Upload className="w-3.5 h-3.5 text-[#002366]" />
                    <span>Upload Sig Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setDeanSigImg)}
                    />
                  </label>
                  {deanSigImg && (
                    <button
                      onClick={() => setDeanSigImg(null)}
                      className="px-2 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 text-[10px]"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Registrar Signature Config */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">3. University Registrar</div>
                <input
                  type="text"
                  value={registrarName}
                  onChange={(e) => setRegistrarName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  placeholder="Full Name & Credentials"
                />
                <div className="flex items-center gap-2">
                  <label className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer text-center flex items-center justify-center gap-1.5 transition-colors border border-slate-300">
                    <Upload className="w-3.5 h-3.5 text-[#002366]" />
                    <span>Upload Sig Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setRegistrarSigImg)}
                    />
                  </label>
                  {registrarSigImg && (
                    <button
                      onClick={() => setRegistrarSigImg(null)}
                      className="px-2 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 text-[10px]"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Certificate View Area */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-100 flex-1 flex items-center justify-center">
          {/* Printable Certificate Canvas */}
          <div
            ref={certificateRef}
            className="w-full max-w-3xl aspect-[1.414/1] bg-amber-50/40 rounded-xl border-[12px] border-double border-[#002366] p-8 sm:p-12 shadow-xl relative flex flex-col justify-between text-slate-900 font-serif overflow-hidden print:shadow-none print:border-[16px] print:m-0"
            style={{ minHeight: '620px' }}
          >
            {/* Watermark Crest */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <UniversityLogo size="xl" />
            </div>

            {/* Certificate Header */}
            <div className="text-center space-y-3 relative z-10">
              <div className="flex justify-center mb-1">
                <UniversityLogo size="lg" withRing />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059] font-sans">
                  Chartered & Accredited Institution
                </div>
                <h1 className="text-xl sm:text-3xl font-black tracking-wide text-[#002366] font-display uppercase mt-1">
                  Breakthrough International Bible University
                </h1>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-600 tracking-wider mt-1 uppercase font-sans">
                  Issued from Phoenix USA
                </div>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-3 my-auto relative z-10 py-4">
              <div className="text-xs sm:text-sm italic text-slate-600 font-sans">
                The Board of Regents and Academic Senate upon recommendation of the Faculty hereby confer upon
              </div>

              <div className="text-2xl sm:text-4xl font-black text-[#002366] font-display tracking-wide border-b-2 border-[#C5A059]/40 pb-2 max-w-xl mx-auto">
                {candidate.fullName}
              </div>

              <div className="text-xs sm:text-sm text-slate-700 font-sans max-w-lg mx-auto pt-1">
                the degree of
              </div>

              <div className="text-lg sm:text-2xl font-bold text-[#C5A059] font-display uppercase tracking-wider">
                {candidate.programName}
              </div>

              {candidate.academicHonors && (
                <div className="text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-widest font-sans pt-1">
                  With {candidate.academicHonors}
                </div>
              )}

              <div className="text-[11px] sm:text-xs text-slate-600 font-sans max-w-lg mx-auto leading-relaxed pt-2">
                with all the rights, honors, privileges, and responsibilities appertaining thereunto. Given under our hands and the seal of the University at Phoenix, Arizona, USA.
              </div>
            </div>

            {/* Three Formal Signatures & Date */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-300/60 relative z-10 text-center font-sans">
              {/* Chancellor Sig */}
              <div className="space-y-1">
                <div className="h-10 flex items-end justify-center">
                  {chancellorSigImg ? (
                    <img src={chancellorSigImg} alt="Chancellor Signature" className="max-h-10 max-w-[120px] object-contain" />
                  ) : (
                    <span className="font-serif italic text-base sm:text-lg font-bold text-[#002366] tracking-wide">
                      Michael C. Sterling
                    </span>
                  )}
                </div>
                <div className="w-24 sm:w-32 mx-auto border-b border-slate-400" />
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  {chancellorName}
                </div>
                <div className="text-[8px] sm:text-[9px] text-slate-500">
                  {chancellorTitle}
                </div>
              </div>

              {/* Dean / Vice Chancellor Sig */}
              <div className="space-y-1">
                <div className="h-10 flex items-end justify-center">
                  {deanSigImg ? (
                    <img src={deanSigImg} alt="Vice Chancellor Signature" className="max-h-10 max-w-[120px] object-contain" />
                  ) : (
                    <span className="font-serif italic text-base sm:text-lg font-bold text-[#002366] tracking-wide">
                      Patrick Njuguna
                    </span>
                  )}
                </div>
                <div className="w-24 sm:w-32 mx-auto border-b border-slate-400" />
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  {deanName}
                </div>
                <div className="text-[8px] sm:text-[9px] text-slate-500">
                  {deanTitle}
                </div>
              </div>

              {/* Registrar Sig */}
              <div className="space-y-1">
                <div className="h-10 flex items-end justify-center">
                  {registrarSigImg ? (
                    <img src={registrarSigImg} alt="Registrar Signature" className="max-h-10 max-w-[120px] object-contain" />
                  ) : (
                    <span className="font-serif italic text-base sm:text-lg font-bold text-[#002366] tracking-wide">
                      Sarah M. Jenkins
                    </span>
                  )}
                </div>
                <div className="w-24 sm:w-32 mx-auto border-b border-slate-400" />
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  {registrarName}
                </div>
                <div className="text-[8px] sm:text-[9px] text-slate-500">
                  {registrarTitle}
                </div>
              </div>
            </div>

            {/* Footer Registry ID & Seal */}
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-500 pt-3 border-t border-slate-200 font-mono relative z-10">
              <div>Ref ID: BIBU-CERT-{candidate.studentId}-{new Date().getFullYear()}</div>
              <div className="flex items-center gap-1 text-[#002366] font-bold font-sans">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Phoenix Registrar Authenticated</span>
              </div>
              <div>Date: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
