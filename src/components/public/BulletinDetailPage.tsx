import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Bulletin } from '../../types';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  ArrowLeft,
  Printer,
  Share2,
  Download,
  Calendar,
  Clock,
  Building,
  User,
  ShieldCheck,
  FileText,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Search,
  Tag,
  Mail,
  ExternalLink,
  MapPin,
  Sparkles,
  Copy,
  Check,
  Eye,
  Bookmark,
  Share
} from 'lucide-react';

export const BulletinDetailPage: React.FC = () => {
  const {
    bulletins,
    selectedBulletinId,
    setSelectedBulletinId,
    setCurrentView,
    universityInfo,
    recordBulletinView,
    recordBulletinDownload,
    verifyBulletinCode,
    bulletinCategories,
    currentUser,
    openAuthModal
  } = useApp();

  const printRef = useRef<HTMLDivElement>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<{ [key: number]: boolean }>({});
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [quickVerifyCode, setQuickVerifyCode] = useState('');
  const [quickVerifyResult, setQuickVerifyResult] = useState<Bulletin | null | 'not_found'>(null);

  // Get only published bulletins (or all if admin)
  const availableBulletins = bulletins.filter(
    (b) => b.status === 'Published' || currentUser.role === 'admin' || currentUser.role === 'registrar'
  );

  // Find currently selected bulletin or fallback to first available
  const currentBulletin = availableBulletins.find((b) => b.id === selectedBulletinId) || availableBulletins[0];

  // Record view on bulletin change
  useEffect(() => {
    if (currentBulletin) {
      recordBulletinView(currentBulletin.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentBulletin?.id]);

  if (!currentBulletin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-display text-[#002366]">No Bulletin Selected</h2>
        <p className="text-slate-600 max-w-md mx-auto">
          Please select an official university bulletin or directive from the University Bulletins Center.
        </p>
        <button
          onClick={() => setCurrentView('bulletins')}
          className="px-6 py-2.5 rounded-xl bg-[#002366] text-[#C5A059] font-bold text-sm shadow-md hover:bg-[#001A4D]"
        >
          &larr; Return to Bulletins Center
        </button>
      </div>
    );
  }

  // Calculate Previous & Next bulletins in sequential order
  const currentIndex = availableBulletins.findIndex((b) => b.id === currentBulletin.id);
  const prevBulletin = currentIndex > 0 ? availableBulletins[currentIndex - 1] : null;
  const nextBulletin = currentIndex < availableBulletins.length - 1 ? availableBulletins[currentIndex + 1] : null;

  // Related bulletins in same category
  const relatedBulletins = availableBulletins
    .filter((b) => b.id !== currentBulletin.id && b.category === currentBulletin.category)
    .slice(0, 4);

  const handleSelectBulletin = (id: string) => {
    setSelectedBulletinId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentBulletin.verificationCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${currentBulletin.bulletinNumber}: ${currentBulletin.title}`,
        text: currentBulletin.summary,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  const handleDownloadAttachment = (attName: string) => {
    recordBulletinDownload(currentBulletin.id);
    alert(`Downloading official certified document: "${attName}" from BIBU Academic Registry.`);
  };

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickVerifyCode.trim()) return;
    const match = verifyBulletinCode(quickVerifyCode.trim());
    if (match) {
      setQuickVerifyResult(match);
    } else {
      setQuickVerifyResult('not_found');
    }
  };

  const getPriorityBadgeClass = (priority: Bulletin['priority']) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-700 text-white border-rose-900 animate-pulse';
      case 'Urgent':
        return 'bg-amber-600 text-white border-amber-800';
      case 'Important':
        return 'bg-[#002366] text-[#C5A059] border-[#C5A059]';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  // Helper to format body content with markdown headings & paragraphs
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-3" />;
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-base font-bold text-[#002366] mt-5 mb-2 font-display">
            {trimmed.replace('### ', '')}
          </h4>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-lg sm:text-xl font-bold text-[#002366] mt-6 mb-3 pb-1 border-b border-slate-200 font-display">
            {trimmed.replace('## ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('# ')) {
        return (
          <h2 key={idx} className="text-xl sm:text-2xl font-black text-[#002366] mt-8 mb-4 font-display">
            {trimmed.replace('# ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <div key={idx} className="flex items-start gap-2.5 my-1.5 pl-2 text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-2 shrink-0" />
            <span className="leading-relaxed">{trimmed.substring(2)}</span>
          </div>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        const num = trimmed.match(/^\d+\./)?.[0] || '•';
        const text = trimmed.replace(/^\d+\.\s*/, '');
        return (
          <div key={idx} className="flex items-start gap-2.5 my-2 pl-2 text-slate-700">
            <span className="font-mono font-bold text-[#002366] shrink-0 text-xs bg-slate-100 px-1.5 py-0.5 rounded">{num}</span>
            <span className="leading-relaxed">{text}</span>
          </div>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-4 border-[#C5A059] bg-[#F8F9FB] pl-4 py-2 my-4 italic text-slate-800 text-sm font-serif">
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      }
      return (
        <p key={idx} className="text-slate-700 text-sm sm:text-base leading-relaxed my-2">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Control Bar & Breadcrumbs */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Breadcrumb Path */}
          <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500">
            <button
              onClick={() => setCurrentView('home')}
              className="hover:text-[#002366] transition-colors font-medium"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() => setCurrentView('bulletins')}
              className="hover:text-[#002366] transition-colors font-medium text-[#002366]"
            >
              University Bulletins
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
              {currentBulletin.category}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono font-bold text-[#002366] truncate max-w-[140px] sm:max-w-[200px]">
              {currentBulletin.bulletinNumber}
            </span>
          </div>

          {/* Quick Actions Toolbar */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => setCurrentView('bulletins')}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </button>

            <button
              onClick={handlePrint}
              title="Print Official Gazette Format"
              className="px-3 py-1.5 rounded-lg bg-[#002366] text-[#C5A059] hover:bg-[#001A4D] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Gazette</span>
            </button>

            <button
              onClick={handleShare}
              title="Share Announcement"
              className="px-3 py-1.5 rounded-lg bg-[#C5A059] text-[#002366] hover:bg-[#B38E46] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs transition-all"
            >
              {shareSuccess ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{shareSuccess ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Priority Urgent Banner (if Critical or Urgent) */}
        {(currentBulletin.priority === 'Critical' || currentBulletin.priority === 'Urgent') && (
          <div className="bg-rose-600 text-white rounded-2xl p-4 sm:p-5 shadow-md flex items-center justify-between gap-4 border-2 border-rose-800 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-rose-100">
                  Priority Institutional Alert: {currentBulletin.priority}
                </div>
                <div className="text-sm font-bold">
                  All enrolled students and active faculty are required to review this directive.
                </div>
              </div>
            </div>
            <div className="hidden sm:block text-xs font-mono bg-white/20 px-3 py-1.5 rounded-lg">
              {currentBulletin.bulletinNumber}
            </div>
          </div>
        )}

        {/* Main 2-Column Grid: Document Area & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Printable Document Body (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div
              ref={printRef}
              className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-6 sm:p-10 space-y-8 relative overflow-hidden"
            >
              
              {/* Institutional Crest & Official Document Header */}
              <div className="border-b-2 border-slate-900/80 pb-6 text-center space-y-3 relative">
                <div className="flex justify-center mb-1">
                  <UniversityLogo size="lg" withRing />
                </div>
                
                <div className="space-y-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-widest font-serif text-[#002366]">
                    {universityInfo.name || 'Breakthrough International Bible University'}
                  </h1>
                  <p className="text-xs sm:text-sm uppercase font-bold tracking-wider text-[#C5A059]">
                    Office of the Academic Registrar & University Senate • Phoenix, Arizona, USA
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono tracking-wide">
                    Official Institutional Gazette & University Bulletins Registry
                  </p>
                </div>

                {/* Decorative Seal / Header Divider */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <div className="h-0.5 w-16 bg-[#C5A059]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#002366] bg-[#F8F9FB] px-2.5 py-0.5 rounded border border-[#C5A059]/40">
                    Official Decree
                  </span>
                  <div className="h-0.5 w-16 bg-[#C5A059]" />
                </div>
              </div>

              {/* Document Metadata Table / Badges Bar */}
              <div className="bg-[#F8F9FB] rounded-xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Gazette No.</span>
                  <span className="font-mono font-bold text-[#002366]">{currentBulletin.bulletinNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Publication Date</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                    {currentBulletin.publishDate}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Issuing Authority</span>
                  <span className="font-bold text-slate-800 truncate block">{currentBulletin.department}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Audience</span>
                  <span className="font-bold text-slate-800">{currentBulletin.targetAudience}</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-[#002366] text-[#C5A059]">
                    {currentBulletin.category}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${getPriorityBadgeClass(currentBulletin.priority)}`}>
                    Priority: {currentBulletin.priority}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified Official Gazette
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black font-serif text-[#002366] leading-tight">
                  {currentBulletin.title}
                </h2>

                {currentBulletin.subtitle && (
                  <p className="text-sm sm:text-base font-bold text-slate-600">
                    {currentBulletin.subtitle}
                  </p>
                )}
              </div>

              {/* Featured Cover Banner (if any) */}
              {currentBulletin.featuredImage && (
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xs max-h-96">
                  <img
                    src={currentBulletin.featuredImage}
                    alt={currentBulletin.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Executive Summary Highlight Card */}
              {currentBulletin.summary && (
                <div className="bg-[#FFFDF5] border-l-4 border-[#C5A059] p-4 sm:p-5 rounded-r-xl space-y-1.5 shadow-2xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#92400E] block">
                    Executive Summary & Administrative Abstract
                  </span>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed italic">
                    "{currentBulletin.summary}"
                  </p>
                </div>
              )}

              {/* Formatted Gazette Content Body */}
              <div className="prose max-w-none text-slate-800 space-y-4 pt-2 border-t border-slate-100">
                {renderFormattedContent(currentBulletin.content)}
              </div>

              {/* Event Details Module (if event exists) */}
              {currentBulletin.eventDetails && (
                <div className="bg-gradient-to-br from-[#002366] to-[#001438] text-white rounded-xl p-5 sm:p-6 space-y-4 shadow-md border border-[#C5A059]/40">
                  <div className="flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Official University Event Schedule</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-white">Event Date</div>
                        <div className="text-slate-300">{currentBulletin.eventDetails.date}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-white">Time & Zone</div>
                        <div className="text-slate-300">{currentBulletin.eventDetails.time}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-white">Venue / Location</div>
                        <div className="text-slate-300">{currentBulletin.eventDetails.location}</div>
                        {currentBulletin.eventDetails.isOnline && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                            Global Online Live Stream Available
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <User className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-white">Organizer / Host</div>
                        <div className="text-slate-300">{currentBulletin.eventDetails.organizer}</div>
                        {currentBulletin.eventDetails.contactEmail && (
                          <div className="text-slate-400 text-[11px] mt-0.5">{currentBulletin.eventDetails.contactEmail}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {currentBulletin.eventDetails.registrationUrl && (
                    <div className="pt-2 border-t border-white/10 flex justify-end">
                      <a
                        href={currentBulletin.eventDetails.registrationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-lg bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
                      >
                        <span>RSVP / Register Attendance</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Key Academic Dates & Milestones */}
              {currentBulletin.importantDates && currentBulletin.importantDates.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#002366]">
                    <Clock className="w-4 h-4 text-[#C5A059]" />
                    <span>Important Calendar Milestones & Deadlines</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentBulletin.importantDates.map((d, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-slate-800">{d.label}</div>
                          {d.description && <div className="text-[11px] text-slate-500">{d.description}</div>}
                        </div>
                        <span className="font-mono text-xs font-bold text-[#002366] bg-white px-2 py-1 rounded border border-slate-200 shrink-0">
                          {d.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compliance & Action Items Checklist */}
              {currentBulletin.instructions && currentBulletin.instructions.length > 0 && (
                <div className="bg-[#F0F4FF] border border-[#002366]/20 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[#002366] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                      <span>Required Action Items & Directives</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {Object.values(completedSteps).filter(Boolean).length} of {currentBulletin.instructions.length} Completed
                    </span>
                  </div>

                  <div className="space-y-2">
                    {currentBulletin.instructions.map((inst, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleStep(idx)}
                        className={`p-3 rounded-lg border text-xs cursor-pointer flex items-start gap-3 transition-all ${
                          completedSteps[idx]
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 line-through opacity-80'
                            : 'bg-white border-slate-200 text-slate-800 hover:border-[#002366]'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                          completedSteps[idx] ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {completedSteps[idx] && <Check className="w-3 h-3" />}
                        </div>
                        <span className="leading-relaxed">{inst}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Official Downloadable Attachments */}
              {currentBulletin.attachments && currentBulletin.attachments.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#002366]">
                    <Paperclip className="w-4 h-4 text-[#C5A059]" />
                    <span>Official Gazette Circular Documents & Enclosures</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentBulletin.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 hover:border-[#002366] p-3 rounded-xl flex items-center justify-between gap-3 shadow-2xs group transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#002366]">
                              {att.title}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {att.type} • {att.size}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDownloadAttachment(att.title)}
                          className="p-2 rounded-lg bg-[#002366] text-[#C5A059] hover:bg-[#001438] text-xs font-bold shrink-0 transition-colors"
                          title="Download Circular PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Authorized Signatory & Official Decree Endorsement Block */}
              <div className="pt-8 border-t-2 border-slate-900/80 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Authorized Signature & Seal</div>
                  <div className="font-serif italic text-lg sm:text-xl text-[#002366] font-bold border-b border-slate-300 pb-1 inline-block">
                    {currentBulletin.authorizedSignatory?.name || 'Prof. Dr. Jonathan Vance, Th.D.'}
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    {currentBulletin.authorizedSignatory?.title || 'Academic Registrar & Secretary to the Senate'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Breakthrough International Bible University, Phoenix Campus
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-500">Digital Document Stamp</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="font-mono text-[10px] text-slate-700 bg-white p-2 rounded border border-slate-200 break-all">
                    {currentBulletin.verificationCode}
                  </div>
                  <div className="text-[9px] text-slate-400">
                    Cryptographically authenticated in BIBU Central Gazette Ledger.
                  </div>
                </div>
              </div>

              {/* Bottom Print / Share Banner */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentBulletin.viewsCount} Gazette Views</span>
                  <span>•</span>
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentBulletin.downloadsCount} Downloads</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-[#002366] font-bold hover:underline"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Code Copied!' : 'Copy Verification Code'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Sequential Gazette Navigation (Previous / Next) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevBulletin ? (
                <button
                  onClick={() => handleSelectBulletin(prevBulletin.id)}
                  className="bg-white rounded-xl p-4 border border-slate-200 hover:border-[#002366] text-left space-y-1 shadow-2xs hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400 group-hover:text-[#002366]">
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous Directive</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#002366] line-clamp-1">
                    {prevBulletin.bulletinNumber}: {prevBulletin.title}
                  </div>
                </button>
              ) : (
                <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200 text-xs text-slate-400 flex items-center justify-center">
                  Beginning of Gazette Register
                </div>
              )}

              {nextBulletin ? (
                <button
                  onClick={() => handleSelectBulletin(nextBulletin.id)}
                  className="bg-white rounded-xl p-4 border border-slate-200 hover:border-[#002366] text-right space-y-1 shadow-2xs hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold uppercase text-slate-400 group-hover:text-[#002366]">
                    <span>Next Directive</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#002366] line-clamp-1">
                    {nextBulletin.bulletinNumber}: {nextBulletin.title}
                  </div>
                </button>
              ) : (
                <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200 text-xs text-slate-400 flex items-center justify-center">
                  Latest Gazette Release
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Area (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Search Widget */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#002366] flex items-center gap-1.5">
                <Search className="w-4 h-4 text-[#C5A059]" />
                <span>Search University Bulletins</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter by keyword or number..."
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              {sidebarSearch.trim() && (
                <div className="max-h-48 overflow-y-auto space-y-1.5 pt-2 border-t border-slate-100">
                  {availableBulletins
                    .filter(
                      (b) =>
                        b.title.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
                        b.bulletinNumber.toLowerCase().includes(sidebarSearch.toLowerCase())
                    )
                    .map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          handleSelectBulletin(b.id);
                          setSidebarSearch('');
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-[#F0F4FF] text-xs space-y-0.5 transition-colors"
                      >
                        <div className="font-mono text-[10px] text-[#002366] font-bold">{b.bulletinNumber}</div>
                        <div className="font-medium text-slate-800 truncate">{b.title}</div>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Related Bulletins in this Category */}
            {relatedBulletins.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#002366] flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-[#C5A059]" />
                    <span>In this Category</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{currentBulletin.category}</span>
                </div>

                <div className="space-y-2">
                  {relatedBulletins.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => handleSelectBulletin(rel.id)}
                      className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-[#002366] hover:bg-[#F0F4FF] transition-all group space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>{rel.bulletinNumber}</span>
                        <span>{rel.publishDate}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#002366] line-clamp-2">
                        {rel.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Gazette Verification Box */}
            <div className="bg-gradient-to-br from-[#002366] to-[#001438] text-white rounded-2xl p-5 border-2 border-[#C5A059] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Gazette Record</span>
              </div>
              <p className="text-xs text-slate-300">
                Authenticate any printed or digital decree issued by Breakthrough International Bible University.
              </p>

              <form onSubmit={handleQuickVerify} className="space-y-2">
                <input
                  type="text"
                  placeholder="Code e.g. VRF-REG-98214-GAZ"
                  value={quickVerifyCode}
                  onChange={(e) => setQuickVerifyCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider shadow-sm transition-all"
                >
                  Verify Authenticity
                </button>
              </form>

              {quickVerifyResult && (
                <div className="mt-2 p-3 rounded-xl bg-white text-slate-800 text-xs animate-in fade-in">
                  {quickVerifyResult === 'not_found' ? (
                    <div className="text-rose-600 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Record not found in registry.</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
                      </div>
                      <div className="font-bold text-[#002366] line-clamp-1">{quickVerifyResult.title}</div>
                      <button
                        onClick={() => {
                          handleSelectBulletin(quickVerifyResult.id);
                          setQuickVerifyResult(null);
                          setQuickVerifyCode('');
                        }}
                        className="w-full mt-1 py-1 rounded bg-[#002366] text-[#C5A059] text-[11px] font-bold text-center"
                      >
                        Open Record
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Registrar Contact Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#002366] flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#C5A059]" />
                <span>Office of the Registrar</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                For inquiries regarding this bulletin, examination scheduling, or degree conferrals, contact the University Secretariat.
              </p>
              <div className="space-y-1.5 text-xs text-slate-700 pt-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>registrar@breakthroughbibleuniv.org</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Phoenix, Arizona • Academic Senate</span>
                </div>
              </div>
            </div>

            {/* University Bulletins Directory Hub Button */}
            <button
              onClick={() => setCurrentView('bulletins')}
              className="w-full p-4 rounded-2xl bg-[#001A4D] hover:bg-[#002366] text-white border border-[#C5A059]/40 flex items-center justify-between group transition-all"
            >
              <div className="text-left">
                <div className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">Full Gazette Index</div>
                <div className="text-sm font-bold text-white">All University Bulletins</div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
