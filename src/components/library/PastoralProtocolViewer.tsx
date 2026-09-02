import React, { useState } from 'react';
import {
  ShieldCheck,
  BookOpen,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Download,
  Copy,
  Check,
  Search,
  ChevronRight,
  ExternalLink,
  Printer,
  Sparkles,
  Lock,
  HeartHandshake,
  Users,
  X
} from 'lucide-react';
import { PastoralProtocol } from '../../types';
import { INSTITUTIONAL_PASTORAL_PROTOCOLS } from '../../data/theologicalLibraryData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialProtocolId?: string;
}

export const PastoralProtocolViewer: React.FC<Props> = ({
  isOpen,
  onClose,
  initialProtocolId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProtocol, setSelectedProtocol] = useState<PastoralProtocol>(
    INSTITUTIONAL_PASTORAL_PROTOCOLS.find((p) => p.id === initialProtocolId) ||
      INSTITUTIONAL_PASTORAL_PROTOCOLS[0]
  );
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    'All',
    'Pastoral Care',
    'Sacraments & Ordinances',
    'Safeguarding & Protection',
    'Counseling & Mental Health'
  ];

  const filteredProtocols = INSTITUTIONAL_PASTORAL_PROTOCOLS.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.purpose.toLowerCase().includes(q) ||
      p.theologicalFoundation.toLowerCase().includes(q)
    );
  });

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl border-2 border-[#002366]/30 overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="bg-[#002366] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b-2 border-[#C5A059]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#001438] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] font-bold shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-[#001438] text-[#C5A059] border border-[#C5A059]/30">
                  Institutional Pastoral Repository
                </span>
                <span className="text-[10px] text-slate-300 font-mono hidden sm:inline">
                  Standards of Ministerial Practice & Governance
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-white tracking-tight mt-0.5">
                BIBU Official Pastoral Protocols & Standard Operating Procedures
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Protocol Viewer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Workspace Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Protocol Directory */}
          <div className="md:col-span-4 border-r border-slate-200 bg-slate-50 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-slate-200 space-y-2 bg-white">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pastoral protocols..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] bg-slate-50"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#002366] text-[#C5A059]'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Protocol List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredProtocols.map((protocol) => {
                const isSelected = selectedProtocol.id === protocol.id;
                return (
                  <div
                    key={protocol.id}
                    onClick={() => setSelectedProtocol(protocol)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-[#002366] text-white border-[#002366] shadow-sm'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-white/20 text-[#C5A059]' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {protocol.code}
                      </span>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        v{protocol.version}
                      </span>
                    </div>

                    <h4 className={`text-xs font-bold font-serif leading-snug line-clamp-2 ${
                      isSelected ? 'text-[#C5A059]' : 'text-[#002366]'
                    }`}>
                      {protocol.title}
                    </h4>

                    <p className={`text-[11px] line-clamp-1 mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {protocol.purpose}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="p-2.5 bg-slate-100 border-t border-slate-200 text-[11px] text-slate-500 text-center">
              Institutional Compliance Directive • Ref: ISO-ECC-2026
            </div>
          </div>

          {/* Right Column: Full Protocol Specification Sheet */}
          <div className="md:col-span-8 overflow-y-auto p-4 sm:p-6 space-y-6 bg-white print:p-0">
            
            {/* Protocol Header Banner */}
            <div className="border-b border-slate-200 pb-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#002366] text-[#C5A059] font-mono font-bold text-xs">
                    {selectedProtocol.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-xs">
                    {selectedProtocol.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold text-xs">
                    v{selectedProtocol.version} • Reviewed {selectedProtocol.lastReviewed}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrint}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold flex items-center gap-1"
                    title="Print protocol document"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Print</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-3 py-1.5 rounded-lg bg-[#002366] hover:bg-[#001438] text-[#C5A059] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    {downloadSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Downloaded PDF</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Manual</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#002366] leading-tight">
                {selectedProtocol.title}
              </h3>

              <div className="text-xs text-slate-500">
                Authoritative Issuing Body: <strong className="text-slate-800">{selectedProtocol.authoritativeBody}</strong> • Target: <span className="font-medium text-slate-700">{selectedProtocol.targetAudience}</span>
              </div>
            </div>

            {/* Purpose & Scope Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-[#002366] uppercase tracking-wider">
                  1. Purpose & Objectives
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedProtocol.purpose}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-[#002366] uppercase tracking-wider">
                  2. Operational Scope
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedProtocol.scope}
                </p>
              </div>
            </div>

            {/* Theological Foundation & Scripture */}
            <div className="p-4 bg-[#002366]/5 rounded-xl border border-[#002366]/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-[#002366] uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#C5A059]" />
                  <span>3. Biblical & Theological Foundation</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedProtocol.scripturePassages.map((verse) => (
                    <span key={verse} className="px-2 py-0.5 rounded bg-white font-mono text-[10px] font-bold text-[#002366] border border-[#002366]/20">
                      {verse}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic font-serif">
                "{selectedProtocol.theologicalFoundation}"
              </p>
            </div>

            {/* Key Definitions & Responsibilities */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#002366] uppercase tracking-wider">
                4. Key Institutional Definitions & Roles
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedProtocol.keyDefinitions.map((def, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                    <strong className="text-[#002366]">{def.term}:</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{def.definition}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Procedure */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#002366] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>5. Step-by-Step Ministerial Procedure</span>
              </div>

              <div className="space-y-3">
                {selectedProtocol.stepByStepProcedure.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-[#002366] transition-all space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold text-xs shrink-0">
                        {step.stepNumber}
                      </span>
                      <h5 className="font-bold text-xs text-[#002366] font-serif">
                        {step.title}
                      </h5>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed pl-8">
                      {step.description}
                    </p>

                    {step.criticalNotes && (
                      <div className="ml-8 mt-1 p-2 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800 flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600 mt-0.5" />
                        <span><strong>Critical Pastoral Boundary:</strong> {step.criticalNotes}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Safeguarding & Legal Mandatory Referral Notice */}
            <div className="p-4 bg-rose-50 rounded-xl border-2 border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-rose-900 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>6. Mandatory Legal & Safeguarding Referral Thresholds</span>
              </div>
              <ul className="space-y-1 text-xs text-rose-800 list-disc list-inside">
                {selectedProtocol.mandatoryReferralThresholds.map((thr, i) => (
                  <li key={i} className="font-medium leading-snug">{thr}</li>
                ))}
              </ul>
              <div className="text-[11px] text-rose-700 pt-1 border-t border-rose-200">
                <strong>Safeguarding Note:</strong> {selectedProtocol.safeguardingNotes}
              </div>
            </div>

            {/* Ethical Criteria & Documentation Requirements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-[#002366] uppercase text-[11px] tracking-wider">
                  7. Ethical Considerations
                </div>
                <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                  {selectedProtocol.ethicalConsiderations.map((eth, i) => (
                    <li key={i}>{eth}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-[#002366] uppercase text-[11px] tracking-wider">
                  8. Documentation Requirements
                </div>
                <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                  {selectedProtocol.documentationRequirements.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 text-[11px]">
            Breakthrough International Bible University • Office of the Provost & Pastoral Faculty
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#002366] text-[#C5A059] hover:bg-[#001438] font-bold transition-colors shadow-xs"
          >
            Close Protocol Manual
          </button>
        </div>

      </div>
    </div>
  );
};
