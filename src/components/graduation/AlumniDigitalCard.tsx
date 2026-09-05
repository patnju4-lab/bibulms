import React, { useRef } from 'react';
import { UniversityLogo } from '../common/UniversityLogo';
import { ShieldCheck, Award, QrCode, Download, Printer, CheckCircle2, GraduationCap, X } from 'lucide-react';
import { GraduationCandidate } from '../../types/graduation';
import { Alumni } from '../../types/alumni';

interface AlumniDigitalCardProps {
  candidate?: GraduationCandidate;
  alumni?: Alumni;
  onClose?: () => void;
}

export const AlumniDigitalCard: React.FC<AlumniDigitalCardProps> = ({ candidate, alumni, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const fullName = candidate?.fullName || alumni?.full_name || 'BIBU Conferred Graduate';
  const alumniId = candidate?.alumniId || alumni?.alumni_id || `BIBU-ALUM-${candidate?.graduationYear || 2026}-${candidate?.studentId?.split('-').pop() || '7492'}`;
  const degree = candidate?.programName || alumni?.program_name || 'Bachelor of Theology (B.Th)';
  const awardLevel = candidate?.awardLevel || alumni?.qualification_level || 'Bachelor';
  const gradYear = candidate?.graduationYear || alumni?.graduation_year || 2026;
  const photo = candidate?.profilePhoto || alumni?.profile_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300';
  const country = candidate?.country || alumni?.country || 'United States';
  const certificateNumber = candidate?.certificateNumber || alumni?.certificate_number || 'BIBU-CERT-2026-0842';
  const honors = candidate?.academicHonors || (alumni?.distinguished ? 'Distinguished Alumnus' : 'Graduate Member');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-[#002366] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#C5A059]">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#C5A059]" />
            <div>
              <h3 className="text-base font-bold font-display">Official Digital Alumni Credential Card</h3>
              <p className="text-[11px] text-slate-300">Permanent Membership of BIBU Global Alumni Association</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Card Canvas Container */}
        <div className="p-6 bg-slate-100 flex flex-col items-center justify-center space-y-6">
          {/* Card Physical Representation */}
          <div
            ref={cardRef}
            className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C5A059] bg-gradient-to-br from-[#001A4D] via-[#002366] to-[#001438] text-white p-5 relative select-none"
            style={{ minHeight: '230px' }}
          >
            {/* Hologram / Watermark Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Top Bar with Crest & University Title */}
            <div className="flex items-center justify-between border-b border-[#C5A059]/40 pb-3 relative z-10">
              <div className="flex items-center gap-2.5">
                <UniversityLogo size="sm" withRing className="border-[#C5A059]" />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] leading-tight">
                    Breakthrough International
                  </div>
                  <div className="text-[9px] font-bold text-slate-200 uppercase tracking-wider">
                    Bible University • Phoenix, AZ
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-[#C5A059] text-[#002366] shadow-xs">
                  ALUMNI CARD
                </span>
                <div className="text-[8px] text-slate-300 mt-0.5 font-mono">Class of {gradYear}</div>
              </div>
            </div>

            {/* Middle Section: Photo & Details */}
            <div className="flex items-center gap-4 py-4 relative z-10">
              {/* Graduate Photo with Gold Ring */}
              <div className="relative flex-shrink-0">
                <img
                  src={photo}
                  alt={fullName}
                  className="w-20 h-20 rounded-xl object-cover border-2 border-[#C5A059] shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border border-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              {/* Graduate Information */}
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-sm font-bold font-display text-white truncate">{fullName}</h4>
                <div className="text-[11px] text-[#C5A059] font-medium leading-tight line-clamp-2">
                  {degree}
                </div>
                <div className="text-[10px] text-slate-300 font-medium">
                  {honors}
                </div>
                <div className="text-[9px] text-slate-400">
                  {country} • {awardLevel}
                </div>
              </div>
            </div>

            {/* Bottom Bar: IDs & QR Code */}
            <div className="pt-3 border-t border-[#C5A059]/40 flex items-center justify-between text-[9px] relative z-10">
              <div className="space-y-0.5">
                <div className="text-slate-400 uppercase text-[8px] font-bold tracking-wider">Alumni ID</div>
                <div className="font-mono font-bold text-[#C5A059]">{alumniId}</div>
                <div className="text-slate-400 text-[8px]">Cert: {certificateNumber}</div>
              </div>

              <div className="flex items-center gap-2 bg-[#001230]/80 px-2 py-1 rounded-lg border border-[#C5A059]/30">
                <QrCode className="w-7 h-7 text-[#C5A059]" />
                <div className="text-[7px] text-slate-300 leading-tight uppercase font-mono">
                  <div>Scan to</div>
                  <div className="text-emerald-400 font-bold">Verify</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Authenticity Footnote */}
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Cryptographically registered in BIBU Registrar Global Database</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Valid for lifelong university library & global alumni privileges.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Card</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Save Digital ID</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
