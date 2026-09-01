import React, { useRef } from 'react';
import { Bulletin } from '../../types';
import { useApp } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  X,
  Printer,
  Download,
  Share2,
  Calendar,
  Clock,
  Building,
  User,
  ShieldCheck,
  FileText,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

interface BulletinDetailModalProps {
  bulletin: Bulletin | null;
  onClose: () => void;
  onSelectCategory?: (category: string) => void;
}

export const BulletinDetailModal: React.FC<BulletinDetailModalProps> = ({
  bulletin,
  onClose,
  onSelectCategory
}) => {
  const { universityInfo, recordBulletinDownload, setCurrentView, setSelectedBulletinId } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  if (!bulletin) return null;

  const handleOpenFullPage = () => {
    setSelectedBulletinId(bulletin.id);
    setCurrentView('bulletin-detail');
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadAttachment = (attName: string) => {
    recordBulletinDownload(bulletin.id);
    // Trigger simulated download notification
    alert(`Downloading official document: "${attName}" from BIBU Academic Registry.`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: bulletin.title,
        text: bulletin.summary,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/#bulletin-${bulletin.bulletinNumber}`);
      alert('Official Bulletin link copied to clipboard!');
    }
  };

  const getPriorityBadge = (priority: Bulletin['priority']) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-700 text-white animate-pulse border-rose-900';
      case 'Urgent':
        return 'bg-amber-600 text-white border-amber-800';
      case 'Important':
        return 'bg-[#002366] text-[#C5A059] border-[#C5A059]';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-[#C5A059] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Control Bar (Non-print) */}
        <div className="bg-[#002366] text-white px-4 sm:px-6 py-3 flex items-center justify-between gap-3 border-b border-[#C5A059]/40 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C5A059]">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span className="font-bold">{bulletin.bulletinNumber}</span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-300 font-sans text-[11px]">Official University Gazette</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenFullPage}
              title="Open in Full Page Mode"
              className="p-1.5 sm:px-3 sm:py-1 rounded bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Full Page View</span>
            </button>

            <button
              onClick={handlePrint}
              title="Print Official Gazette"
              className="p-1.5 sm:px-3 sm:py-1 rounded bg-[#001A4D] hover:bg-[#001438] text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleShare}
              title="Share Announcement"
              className="p-1.5 sm:px-3 sm:py-1 rounded bg-[#001A4D] hover:bg-[#001438] text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-600 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Body */}
        <div ref={printRef} className="overflow-y-auto p-6 sm:p-10 space-y-8 bg-white text-slate-900 selection:bg-[#C5A059] selection:text-[#002366]">
          
          {/* Institutional Crest & Official Document Header */}
          <div className="border-b-2 border-slate-900/80 pb-6 text-center space-y-3 relative">
            <div className="flex justify-center mb-1">
              <UniversityLogo size="lg" withRing />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-widest font-serif text-[#002366]">
                {universityInfo.name || 'Breakthrough International Bible University'}
              </h1>
              <p className="text-xs uppercase font-bold tracking-wider text-[#C5A059]">
                Office of the Academic Registrar & University Senate • Phoenix, Arizona, USA
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Official Institutional Gazette & University Bulletins Registry
              </p>
            </div>

            {/* Official Metadata Pill Bar */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-200 mt-4 bg-slate-50 p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Bulletin No:</span>
                <span className="font-mono font-black text-[#002366] bg-white px-2 py-0.5 rounded border border-slate-200">
                  {bulletin.bulletinNumber}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Verification Code:</span>
                <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {bulletin.verificationCode}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Date:</span>
                <span className="font-bold text-slate-800">
                  {bulletin.publishDate}
                </span>
              </div>
            </div>
          </div>

          {/* Bulletin Title, Subtitle, & Badges */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(bulletin.category);
                    onClose();
                  }
                }}
                className="cursor-pointer text-xs font-black uppercase tracking-wider px-3 py-1 rounded bg-[#002366] text-[#C5A059] hover:bg-[#001438] transition-colors"
              >
                {bulletin.category}
              </span>

              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${getPriorityBadge(bulletin.priority)}`}>
                {bulletin.priority} Priority
              </span>

              <span className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Audience: <strong className="text-slate-900">{bulletin.targetAudience}</strong>
              </span>

              <span className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Dept: <strong className="text-slate-900">{bulletin.department}</strong>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#002366] leading-tight">
              {bulletin.title}
            </h2>

            {bulletin.subtitle && (
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed italic">
                {bulletin.subtitle}
              </p>
            )}

            {/* Featured Image if present */}
            {bulletin.featuredImage && (
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xs max-h-80">
                <img
                  src={bulletin.featuredImage}
                  alt={bulletin.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Executive Summary Box */}
            {bulletin.summary && (
              <div className="bg-[#002366]/5 border-l-4 border-[#C5A059] p-4 sm:p-5 rounded-r-xl">
                <div className="text-[11px] uppercase font-black tracking-widest text-[#002366] mb-1">
                  Executive Summary / Notice Overview
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {bulletin.summary}
                </p>
              </div>
            )}
          </div>

          {/* Main Structured Rich Content */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4 text-slate-800 font-sans">
            {bulletin.content.split('\n\n').map((block, idx) => {
              const trimmed = block.trim();
              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-base sm:text-lg font-bold font-display text-[#002366] pt-2 border-b border-slate-200 pb-1">
                    {trimmed.replace('### ', '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('#### ')) {
                return (
                  <h4 key={idx} className="text-sm sm:text-base font-bold font-display text-[#002366] pt-1">
                    {trimmed.replace('#### ', '')}
                  </h4>
                );
              }
              if (trimmed.startsWith('* ')) {
                const listItems = trimmed.split('\n').map(l => l.replace('* ', ''));
                return (
                  <ul key={idx} className="list-disc list-inside space-y-1.5 pl-2 text-slate-700">
                    {listItems.map((item, itemIdx) => (
                      <li key={itemIdx} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
              );
            })}
          </div>

          {/* Important Dates Box */}
          {bulletin.importantDates && bulletin.importantDates.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-[#002366] font-bold text-sm font-display">
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <span>Important Dates & Academic Deadlines</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bulletin.importantDates.map((item, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-2xs">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{item.label}</div>
                    <div className="text-xs font-black text-[#002366] mt-0.5">{item.date}</div>
                    {item.description && <div className="text-[10px] text-slate-600 mt-0.5">{item.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step-by-Step Instructions */}
          {bulletin.instructions && bulletin.instructions.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-[#002366] font-bold text-sm font-display">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Mandatory Action Steps & Compliance Protocols</span>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 pl-1">
                {bulletin.instructions.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="font-semibold text-slate-900">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Associated Event Details if Event Bulletin */}
          {bulletin.eventDetails && (
            <div className="bg-[#002366] text-white rounded-xl p-6 border-2 border-[#C5A059] space-y-4">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#C5A059]">Official University Event</span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded bg-[#001438] text-white font-bold border border-white/20">
                  {bulletin.eventDetails.isOnline ? '🌐 Hybrid / Online Streaming' : '🏛️ Physical Gathering'}
                </span>
              </div>

              <h4 className="text-lg font-bold font-display text-white">{bulletin.eventDetails.title}</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-200">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Event Date & Time</span>
                    <strong>{bulletin.eventDetails.date}</strong> • {bulletin.eventDetails.time}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Location & Venue</span>
                    <strong>{bulletin.eventDetails.location}</strong>
                  </div>
                </div>

                {bulletin.eventDetails.contactEmail && (
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Inquiries & RSVP</span>
                      <span>{bulletin.eventDetails.contactEmail}</span>
                    </div>
                  </div>
                )}

                {bulletin.eventDetails.contactPhone && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Telephone</span>
                      <span>{bulletin.eventDetails.contactPhone}</span>
                    </div>
                  </div>
                )}
              </div>

              {bulletin.eventDetails.registrationUrl && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      setCurrentView(bulletin.eventDetails!.registrationUrl as any);
                    }}
                    className="px-5 py-2 rounded-lg bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black uppercase tracking-wider text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Register for Event in Portal</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Official Attachments & Download Section */}
          {bulletin.attachments && bulletin.attachments.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-black uppercase tracking-widest text-[#002366] flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-[#C5A059]" />
                <span>Official PDF Attachments & Supplementary Documents ({bulletin.attachments.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bulletin.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200 hover:border-[#002366] p-3.5 rounded-xl flex items-center justify-between gap-3 transition-colors shadow-2xs group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
                        PDF
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate group-hover:text-[#002366]">
                          {att.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {att.type} • {att.size}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadAttachment(att.name)}
                      className="px-3 py-1.5 rounded-lg bg-[#002366] group-hover:bg-[#C5A059] text-white group-hover:text-[#002366] text-xs font-bold shrink-0 transition-colors flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official University Signatory & Stamp Box */}
          <div className="border-t-2 border-slate-900 pt-6 mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                  Issuing Authority & Inquiries:
                </div>
                <div>{bulletin.contactInfo?.department || bulletin.department}</div>
                <div>Breakthrough International Bible University</div>
                <div>Email: <a href={`mailto:${bulletin.contactInfo?.email || 'registrar@bibu-edu.org'}`} className="text-[#002366] font-bold underline">{bulletin.contactInfo?.email || 'registrar@bibu-edu.org'}</a></div>
                {bulletin.contactInfo?.phone && <div>Tel: {bulletin.contactInfo.phone}</div>}
              </div>

              {/* Seal & Authorized Signature */}
              <div className="text-right space-y-1 sm:border-l sm:border-slate-200 sm:pl-6">
                <div className="inline-block border-2 border-emerald-800/60 rounded-xl px-4 py-2 bg-emerald-50/50 mb-2 text-center">
                  <div className="text-[9px] uppercase tracking-widest font-bold text-emerald-900">Official Institutional Gazette</div>
                  <div className="text-xs font-black text-emerald-900 font-mono">SEAL OF AUTHENTICITY</div>
                  <div className="text-[9px] text-emerald-800 font-mono">SECURE • VERIFIED • REGISTRAR</div>
                </div>

                <div className="font-serif italic text-base text-[#002366] font-bold">
                  {bulletin.authorizedSignatory?.signatureText || bulletin.authorizedSignatory?.name || 'Rev. Dr. Sarah M. Jenkins, Th.D.'}
                </div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {bulletin.authorizedSignatory?.name || 'Rev. Dr. Sarah M. Jenkins, Th.D.'}
                </div>
                <div className="text-[11px] text-[#C5A059] font-semibold uppercase">
                  {bulletin.authorizedSignatory?.title || 'University Academic Registrar'}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 font-mono">
            Gazette ID: {bulletin.id} • Views: {bulletin.viewsCount} • Downloads: {bulletin.downloadsCount}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-[#002366] text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Bulletin</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#002366] hover:bg-[#001438] text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Close Gazette
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
