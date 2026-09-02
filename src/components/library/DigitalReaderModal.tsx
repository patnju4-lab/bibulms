import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Highlighter,
  MessageSquare,
  Copy,
  Check,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Coffee,
  CheckCircle2,
  List,
  Sparkles,
  FileText,
  Clock,
  Printer
} from 'lucide-react';
import { LibraryResource, StudentLibraryAnnotation } from '../../types';

interface Props {
  resource: LibraryResource | null;
  isOpen: boolean;
  onClose: () => void;
  onBookmarkToggle?: (resourceId: string) => void;
  isBookmarked?: boolean;
}

export const DigitalReaderModal: React.FC<Props> = ({
  resource,
  isOpen,
  onClose,
  onBookmarkToggle,
  isBookmarked = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [fontSize, setFontSize] = useState<'text-sm' | 'text-base' | 'text-lg' | 'text-xl'>('text-base');
  const [readingTheme, setReadingTheme] = useState<'day' | 'sepia' | 'night'>('day');
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [selectedCitationFormat, setSelectedCitationFormat] = useState<'APA' | 'MLA' | 'Chicago' | 'Harvard'>('APA');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [readingSeconds, setReadingSeconds] = useState(0);

  // Annotations state
  const [annotations, setAnnotations] = useState<StudentLibraryAnnotation[]>([]);
  const [activeHighlightColor, setActiveHighlightColor] = useState<'yellow' | 'green' | 'blue' | 'purple' | 'amber'>('yellow');
  const [newNoteText, setNewNoteText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState('');

  const totalPages = resource?.tableOfContents ? resource.tableOfContents.length * 15 : 45;

  // Load reading progress and annotations from localStorage
  useEffect(() => {
    if (resource && isOpen) {
      const storedProgressKey = `bibu_reading_${resource.id}`;
      const savedPage = localStorage.getItem(storedProgressKey);
      if (savedPage) {
        setCurrentPage(parseInt(savedPage, 10));
      } else {
        setCurrentPage(1);
      }

      const storedCompletedKey = `bibu_completed_${resource.id}`;
      setIsCompleted(localStorage.getItem(storedCompletedKey) === 'true');

      const storedAnnotations = localStorage.getItem(`bibu_annot_${resource.id}`);
      if (storedAnnotations) {
        try {
          setAnnotations(JSON.parse(storedAnnotations));
        } catch {
          setAnnotations([]);
        }
      }

      // Reading session timer
      const timer = setInterval(() => {
        setReadingSeconds((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resource, isOpen]);

  // Save progress on change
  useEffect(() => {
    if (resource && isOpen) {
      localStorage.setItem(`bibu_reading_${resource.id}`, currentPage.toString());
      
      // Update global reading progress dictionary
      try {
        const raw = localStorage.getItem('bibu_library_reading_progress') || '{}';
        const progressMap = JSON.parse(raw);
        progressMap[resource.id] = {
          page: currentPage,
          totalPages: totalPages,
          percentage: Math.min(100, Math.round((currentPage / totalPages) * 100)),
          lastReadDate: new Date().toISOString().split('T')[0]
        };
        localStorage.setItem('bibu_library_reading_progress', JSON.stringify(progressMap));
      } catch (err) {
        console.error(err);
      }
    }
  }, [currentPage, resource, isOpen, totalPages]);

  if (!isOpen || !resource) return null;

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleToggleCompleted = () => {
    const nextVal = !isCompleted;
    setIsCompleted(nextVal);
    localStorage.setItem(`bibu_completed_${resource.id}`, nextVal ? 'true' : 'false');
  };

  const handleCopyCitation = () => {
    let citation = resource.citationApa || '';
    if (selectedCitationFormat === 'MLA') citation = resource.citationMla || citation;
    if (selectedCitationFormat === 'Chicago') citation = resource.citationChicago || citation;
    if (selectedCitationFormat === 'Harvard') citation = resource.citationHarvard || citation;

    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  const handleAddAnnotation = () => {
    if (!newNoteText.trim() && !selectedQuote.trim()) return;

    const newAnnot: StudentLibraryAnnotation = {
      id: `annot-${Date.now()}`,
      resourceId: resource.id,
      studentId: 'std-current',
      pageNumber: currentPage,
      selectedText: selectedQuote || 'Exegesis Note',
      noteText: newNoteText,
      color: activeHighlightColor,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [newAnnot, ...annotations];
    setAnnotations(updated);
    localStorage.setItem(`bibu_annot_${resource.id}`, JSON.stringify(updated));
    setNewNoteText('');
    setSelectedQuote('');
    setShowNoteInput(false);
  };

  const handleDeleteAnnotation = (id: string) => {
    const updated = annotations.filter((a) => a.id !== id);
    setAnnotations(updated);
    localStorage.setItem(`bibu_annot_${resource.id}`, JSON.stringify(updated));
  };

  // Theme styling definitions
  const themeClasses = {
    day: 'bg-white text-slate-900',
    sepia: 'bg-[#FBF0D9] text-[#433422]',
    night: 'bg-[#0F172A] text-slate-200'
  };

  const currentCitation =
    selectedCitationFormat === 'MLA'
      ? resource.citationMla || resource.citationApa
      : selectedCitationFormat === 'Chicago'
      ? resource.citationChicago || resource.citationApa
      : selectedCitationFormat === 'Harvard'
      ? resource.citationHarvard || resource.citationApa
      : resource.citationApa || `${resource.author}. (${resource.year}). ${resource.title}. BIBU Academic Press.`;

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-1 sm:p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-6xl w-full h-[95vh] flex flex-col shadow-2xl border-2 border-[#002366]/40 overflow-hidden">
        
        {/* Top Digital Reader Navigation Bar */}
        <div className="bg-[#002366] text-white p-3 sm:p-4 flex items-center justify-between shrink-0 border-b-2 border-[#C5A059]">
          
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsTocOpen(!isTocOpen)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isTocOpen ? 'bg-[#C5A059] text-[#002366]' : 'bg-[#001438] text-white hover:bg-white/10'
              }`}
              title="Toggle Table of Contents"
            >
              <List className="w-4 h-4" />
              <span className="hidden md:inline">Contents</span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#001438] text-[#C5A059] border border-[#C5A059]/30 uppercase tracking-wider">
                  {resource.category}
                </span>
                <span className="text-[10px] text-slate-300 font-mono hidden sm:inline">
                  {resource.resourceType || 'Scholarly Treatise'}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold font-serif text-white truncate max-w-md sm:max-w-xl">
                {resource.title}
              </h3>
            </div>
          </div>

          {/* Reader Controls */}
          <div className="flex items-center gap-2">
            {/* Reading Timer */}
            <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#001438] text-[11px] font-mono text-[#C5A059] border border-[#C5A059]/20">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(readingSeconds)}</span>
            </div>

            {/* Reading Theme Modes */}
            <div className="flex items-center bg-[#001438] rounded-xl p-0.5 border border-white/10">
              <button
                onClick={() => setReadingTheme('day')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  readingTheme === 'day' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
                title="Day Mode (Light)"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReadingTheme('sepia')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  readingTheme === 'sepia' ? 'bg-[#FBF0D9] text-[#433422]' : 'text-slate-400 hover:text-white'
                }`}
                title="Sepia Mode (Warm)"
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReadingTheme('night')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  readingTheme === 'night' ? 'bg-[#0F172A] text-[#C5A059]' : 'text-slate-400 hover:text-white'
                }`}
                title="Night Mode (Dark)"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Font Size Adjuster */}
            <div className="hidden sm:flex items-center bg-[#001438] rounded-xl p-0.5 border border-white/10">
              <button
                onClick={() => setFontSize('text-sm')}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                  fontSize === 'text-sm' ? 'bg-[#002366] text-[#C5A059]' : 'text-slate-300'
                }`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('text-base')}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
                  fontSize === 'text-base' ? 'bg-[#002366] text-[#C5A059]' : 'text-slate-300'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('text-lg')}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
                  fontSize === 'text-lg' ? 'bg-[#002366] text-[#C5A059]' : 'text-slate-300'
                }`}
              >
                A+
              </button>
            </div>

            {/* Bookmark */}
            {onBookmarkToggle && (
              <button
                onClick={() => onBookmarkToggle(resource.id)}
                className={`p-2 rounded-xl transition-colors ${
                  isBookmarked
                    ? 'bg-[#C5A059] text-[#002366]'
                    : 'bg-[#001438] text-slate-300 hover:text-white'
                }`}
                title={isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Reader Workspace */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Collapsible Table of Contents Drawer */}
          {isTocOpen && (
            <div className="w-72 bg-slate-900 text-slate-200 border-r border-slate-700 flex flex-col shrink-0 animate-in slide-in-from-left duration-200">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold font-serif text-[#C5A059] uppercase tracking-wider">
                  Table of Contents
                </span>
                <button
                  onClick={() => setIsTocOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
                {resource.tableOfContents && resource.tableOfContents.length > 0 ? (
                  resource.tableOfContents.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentPage(item.page);
                        setIsTocOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-center justify-between ${
                        currentPage >= item.page &&
                        (idx === resource.tableOfContents!.length - 1 ||
                          currentPage < resource.tableOfContents![idx + 1].page)
                          ? 'bg-[#002366] text-[#C5A059] font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate pr-2">{item.title}</span>
                      <span className="font-mono text-[10px] text-slate-400 shrink-0">p. {item.page}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-400 text-xs">
                    Continuous Scholarly Text Edition
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400">
                Peer Reviewed • Ref: {resource.isbnOrDoi || 'BIBU-ACAD-2026'}
              </div>
            </div>
          )}

          {/* Main Document Reading Canvas */}
          <div className={`flex-1 overflow-y-auto p-4 sm:p-10 ${themeClasses[readingTheme]} flex justify-center`}>
            
            <div className="max-w-3xl w-full space-y-6">
              
              {/* Document Title Header Sheet */}
              <div className="border-b border-current/20 pb-4 space-y-2">
                <div className="flex items-center justify-between text-xs opacity-75">
                  <span>BIBU DIGITAL THEOLOGICAL REPOSITORY</span>
                  <span>{resource.academicLevel || 'Graduate'} Level</span>
                </div>

                <h1 className="text-xl sm:text-3xl font-serif font-black tracking-tight leading-snug">
                  {resource.title}
                </h1>

                <div className="text-xs sm:text-sm font-medium opacity-90 flex flex-wrap gap-x-4 gap-y-1">
                  <span>Author: <strong>{resource.author}</strong></span>
                  {resource.publisher && <span>Publisher: <strong>{resource.publisher}</strong></span>}
                  <span>Year: <strong>{resource.year}</strong></span>
                </div>
              </div>

              {/* Scholarly Abstract Box */}
              {resource.abstract && (
                <div className="p-4 rounded-xl border border-current/20 bg-current/5 space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider opacity-80">Abstract & Thesis Statement</div>
                  <p className="text-xs sm:text-sm italic leading-relaxed font-serif">
                    "{resource.abstract}"
                  </p>
                </div>
              )}

              {/* Main Reading Text Display */}
              <div className={`${fontSize} font-serif leading-relaxed space-y-4 whitespace-pre-line text-justify`}>
                {resource.fullTextContent ? (
                  resource.fullTextContent
                ) : (
                  <>
                    <p>
                      <strong>CHAPTER OVERVIEW & EXEGETICAL PREMISES</strong>
                    </p>
                    <p>
                      The discipline of Christian theology and pastoral ministry rests upon the verbal, plenary inspiration of the canonical Scriptures. As we approach this treatise, the primary hermeneutical rule remains: <em>Scripture interprets Scripture</em> (analogia Scripturae).
                    </p>
                    <p>
                      In examining the historical, grammatical, and theological facets of this subject, the minister must resist modern reductionism. The biblical text presents God’s sovereign redemptive plan culminating in the Person and finished substitutionary atonement of Jesus Christ.
                    </p>
                    <p>
                      {resource.description}
                    </p>
                    <p>
                      Throughout this section, students and ministers are urged to cross-examine original Greek and Hebrew lexical semantics, historical patristic formulations, and contemporary pastoral applications to ensure fidelity to the Word of God.
                    </p>
                  </>
                )}
              </div>

              {/* Annotations & Student Study Margin Notes */}
              <div className="pt-6 border-t border-current/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>My Margin Notes & Highlights ({annotations.length})</span>
                  </div>

                  <button
                    onClick={() => setShowNoteInput(!showNoteInput)}
                    className="px-3 py-1 rounded-lg bg-[#002366] text-[#C5A059] text-xs font-bold hover:bg-[#001438] transition-colors"
                  >
                    {showNoteInput ? 'Cancel' : '+ Add Study Note'}
                  </button>
                </div>

                {showNoteInput && (
                  <div className="p-4 rounded-xl bg-current/5 border border-current/20 space-y-2.5 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">Highlight Color:</span>
                      {(['yellow', 'green', 'blue', 'purple', 'amber'] as const).map((col) => (
                        <button
                          key={col}
                          onClick={() => setActiveHighlightColor(col)}
                          className={`w-5 h-5 rounded-full border-2 transition-transform ${
                            col === 'yellow' ? 'bg-yellow-300' :
                            col === 'green' ? 'bg-emerald-400' :
                            col === 'blue' ? 'bg-sky-400' :
                            col === 'purple' ? 'bg-purple-400' : 'bg-amber-400'
                          } ${activeHighlightColor === col ? 'scale-125 border-slate-900' : 'border-transparent'}`}
                        />
                      ))}
                    </div>

                    <input
                      type="text"
                      value={selectedQuote}
                      onChange={(e) => setSelectedQuote(e.target.value)}
                      placeholder="Selected phrase or Scripture verse reference..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none"
                    />

                    <textarea
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Write your exegetical reflection, question, or sermon thought..."
                      rows={2}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none"
                    />

                    <div className="flex justify-end">
                      <button
                        onClick={handleAddAnnotation}
                        className="px-4 py-1.5 rounded-lg bg-[#002366] text-[#C5A059] text-xs font-bold hover:bg-[#001438]"
                      >
                        Save Note (Page {currentPage})
                      </button>
                    </div>
                  </div>
                )}

                {annotations.length > 0 && (
                  <div className="space-y-2">
                    {annotations.map((annot) => (
                      <div
                        key={annot.id}
                        className="p-3 rounded-lg border border-current/20 bg-current/5 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold font-mono text-[10px] opacity-75">
                            Page {annot.pageNumber} • {annot.createdAt}
                          </span>
                          <button
                            onClick={() => handleDeleteAnnotation(annot.id)}
                            className="text-rose-500 hover:text-rose-700 text-[10px]"
                          >
                            Delete
                          </button>
                        </div>
                        {annot.selectedText && (
                          <div className="italic opacity-90 border-l-2 border-[#C5A059] pl-2 font-serif">
                            "{annot.selectedText}"
                          </div>
                        )}
                        <p className="font-sans font-medium">{annot.noteText}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Instant Scholarly Citation Box */}
              <div className="pt-6 border-t border-current/20 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#C5A059]" />
                    <span>Academic Citation Generator</span>
                  </div>

                  <div className="flex items-center gap-1 bg-current/10 p-0.5 rounded-lg text-xs font-bold">
                    {(['APA', 'MLA', 'Chicago', 'Harvard'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setSelectedCitationFormat(fmt)}
                        className={`px-2 py-1 rounded-md transition-colors ${
                          selectedCitationFormat === fmt
                            ? 'bg-[#002366] text-[#C5A059]'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-current/20 bg-current/5 flex items-center justify-between gap-3 text-xs">
                  <p className="font-mono text-[11px] leading-relaxed select-all truncate">
                    {currentCitation}
                  </p>
                  <button
                    onClick={handleCopyCitation}
                    className="px-3 py-1.5 rounded-lg bg-[#002366] text-[#C5A059] font-bold shrink-0 flex items-center gap-1 text-xs hover:bg-[#001438] transition-colors"
                  >
                    {copiedCitation ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Citation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Pagination & Progress Bar */}
        <div className="p-3 sm:p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 disabled:opacity-40 hover:bg-slate-50 flex items-center gap-1 font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <span className="font-mono font-bold text-slate-700 text-xs px-2">
              Page {currentPage} of {totalPages} ({Math.round((currentPage / totalPages) * 100)}%)
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 disabled:opacity-40 hover:bg-slate-50 flex items-center gap-1 font-bold"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleCompleted}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
                isCompleted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Completed Reading' : 'Mark as Read'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#002366] text-[#C5A059] font-bold hover:bg-[#001438] transition-colors"
            >
              Exit Reader
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
