import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  X,
  Headphones,
  Video,
  FileText,
  Sparkles,
  Languages,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { LibraryResource } from '../../types';

interface ScriptureMultimediaModalProps {
  resources: LibraryResource[];
  onClose: () => void;
  onOpenResource: (resource: LibraryResource, actionType?: 'read' | 'audio' | 'video') => void;
  onOpenWordStudy: (strongs: string) => void;
}

const POPULAR_PASSAGES = [
  'Romans 8',
  'Genesis 1',
  'Isaiah 53',
  'John 1',
  'Ephesians 1',
  '2 Timothy 2',
  'Hebrews 8',
  'Psalm 23',
  'Matthew 28',
  'Exodus 12'
];

export const ScriptureMultimediaModal: React.FC<ScriptureMultimediaModalProps> = ({
  resources,
  onClose,
  onOpenResource,
  onOpenWordStudy
}) => {
  const [selectedPassage, setSelectedPassage] = useState<string>('Romans 8');
  const [customSearch, setCustomSearch] = useState<string>('');

  const activeQuery = customSearch.trim() || selectedPassage;

  // Filter and group resources by theological discipline & media format
  const groupedResults = useMemo(() => {
    const q = activeQuery.toLowerCase();

    const matchesQuery = (r: LibraryResource) => {
      const scriptureMatch = r.scriptureReferences && r.scriptureReferences.some((s) => s.toLowerCase().includes(q));
      const titleMatch = r.title.toLowerCase().includes(q);
      const descMatch = r.description.toLowerCase().includes(q);
      const keywordsMatch = r.keywords && r.keywords.some((k) => k.toLowerCase().includes(q));
      return scriptureMatch || titleMatch || descMatch || keywordsMatch;
    };

    const matching = resources.filter(matchesQuery);

    return {
      commentaries: matching.filter((r) => r.resourceType === 'Exegetical Commentary' || r.collectionCategory === 'Exegetical Commentaries'),
      audioStudies: matching.filter((r) => r.format === 'Audio Book' || r.format === 'Audio Course' || r.format === 'Audio Lecture' || r.resourceType === 'Audio Lecture' || r.resourceType === 'Audio Book' || r.resourceType === 'Audio Course'),
      videoLectures: matching.filter((r) => r.format === 'Video Book' || r.format === 'Video Course' || r.format === 'Video Lecture' || r.resourceType === 'Video Seminar' || r.resourceType === 'Video Book' || r.resourceType === 'Video Course'),
      researchPapers: matching.filter((r) => r.resourceType === 'Academic Journal Article' || r.resourceType === 'Theses & Dissertations' || r.resourceType === 'Research Paper' || r.category === 'Research'),
      systematicTheology: matching.filter((r) => r.resourceType === 'Systematic Treatise' || r.category === 'Theology'),
      pastoralApplications: matching.filter((r) => r.collectionCategory === 'Pastoral Ministry' || r.collectionCategory === 'Pastoral Protocols' || r.category === 'Leadership' || r.category === 'Christian Counseling'),
      totalCount: matching.length
    };
  }, [resources, activeQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        
        {/* TOP HEADER */}
        <div className="bg-[#002366] text-white p-5 sm:p-6 border-b-4 border-[#C5A059] flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#001438] text-[#C5A059] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#C5A059]/40">
                Scripture-Linked Multimedia Hub
              </span>
              <span className="text-xs text-slate-300 hidden sm:inline">
                Cross-Format Theological Synthesis
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif">
              Canonical & Media Explorer
            </h2>
            <p className="text-xs text-slate-200 max-w-2xl">
              Discover verse-by-verse commentaries, audio lectures, video masterclasses, Greek & Hebrew lexicons, and systematic treatises linked directly to any biblical passage.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SEARCH & QUICK PASSAGE PILLS */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search any book or chapter (e.g. Romans 8, Isaiah 53, Genesis 1, John 1)..."
              value={customSearch}
              onChange={(e) => setCustomSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent font-medium"
            />
            {customSearch && (
              <button
                onClick={() => setCustomSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Passage Selection Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
              Suggested Passages:
            </span>
            {POPULAR_PASSAGES.map((passage) => (
              <button
                key={passage}
                onClick={() => {
                  setSelectedPassage(passage);
                  setCustomSearch('');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
                  activeQuery.toLowerCase() === passage.toLowerCase()
                    ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                📖 {passage}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS ORGANIZED BY MULTIMEDIA & THEOLOGICAL CATEGORIES */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-serif text-[#002366] uppercase tracking-wide">
                Results for "{activeQuery}"
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-mono font-bold">
                {groupedResults.totalCount} linked resources
              </span>
            </div>
            
            {activeQuery.toLowerCase().includes('romans') && (
              <button
                onClick={() => onOpenWordStudy('G26')}
                className="px-2.5 py-1 rounded-lg bg-[#002366] text-[#C5A059] text-xs font-bold flex items-center gap-1 hover:bg-[#001845] transition-colors cursor-pointer"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>Explore Greek Root: G26 Agapē</span>
              </button>
            )}
          </div>

          {/* GRID OF DISCIPLINARY MEDIA CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* 1. 📖 COMMENTARIES */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-xs text-[#002366] uppercase tracking-wider pb-2 border-b border-slate-200">
                  <span className="text-base">📖</span>
                  <span>Verse-by-Verse Commentaries ({groupedResults.commentaries.length})</span>
                </div>
                <div className="mt-3 space-y-2">
                  {groupedResults.commentaries.length > 0 ? (
                    groupedResults.commentaries.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onOpenResource(item, 'read')}
                        className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-[#C5A059] hover:shadow-xs transition-all cursor-pointer space-y-1"
                      >
                        <h4 className="text-xs font-bold text-[#002366] line-clamp-1">{item.title}</h4>
                        <div className="text-[10px] text-slate-500">{item.author}</div>
                        <span className="text-[10px] text-amber-700 font-mono font-bold">Read Commentary →</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic py-3 text-center">
                      No standalone commentaries indexed for this specific query.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. 🎧 AUDIO STUDIES */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-xs text-[#002366] uppercase tracking-wider pb-2 border-b border-slate-200">
                  <span className="text-base">🎧</span>
                  <span>Audio Lectures & Courses ({groupedResults.audioStudies.length})</span>
                </div>
                <div className="mt-3 space-y-2">
                  {groupedResults.audioStudies.length > 0 ? (
                    groupedResults.audioStudies.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onOpenResource(item, 'audio')}
                        className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-[#C5A059] hover:shadow-xs transition-all cursor-pointer space-y-1"
                      >
                        <h4 className="text-xs font-bold text-[#002366] line-clamp-1">{item.title}</h4>
                        <div className="text-[10px] text-slate-500">{item.pagesOrDuration} • {item.author}</div>
                        <span className="text-[10px] text-[#002366] font-mono font-bold flex items-center gap-1">
                          <Headphones className="w-3 h-3 text-[#C5A059]" /> Listen Audio →
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic py-3 text-center">
                      Audio study sessions are being recorded by faculty.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. 🎥 VIDEO LECTURES */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-xs text-[#002366] uppercase tracking-wider pb-2 border-b border-slate-200">
                  <span className="text-base">🎥</span>
                  <span>Video Lectures & Masterclasses ({groupedResults.videoLectures.length})</span>
                </div>
                <div className="mt-3 space-y-2">
                  {groupedResults.videoLectures.length > 0 ? (
                    groupedResults.videoLectures.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onOpenResource(item, 'video')}
                        className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-[#C5A059] hover:shadow-xs transition-all cursor-pointer space-y-1"
                      >
                        <h4 className="text-xs font-bold text-[#002366] line-clamp-1">{item.title}</h4>
                        <div className="text-[10px] text-slate-500">{item.pagesOrDuration} • {item.author}</div>
                        <span className="text-[10px] text-rose-700 font-mono font-bold flex items-center gap-1">
                          <Video className="w-3 h-3 text-rose-600" /> Watch Video Lecture →
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic py-3 text-center">
                      No video lectures specifically tagged for this chapter.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4. 📄 RESEARCH PAPERS */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-xs text-[#002366] uppercase tracking-wider pb-2 border-b border-slate-200">
                  <span className="text-base">📄</span>
                  <span>Academic Research Papers ({groupedResults.researchPapers.length})</span>
                </div>
                <div className="mt-3 space-y-2">
                  {groupedResults.researchPapers.length > 0 ? (
                    groupedResults.researchPapers.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onOpenResource(item, 'read')}
                        className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-[#C5A059] hover:shadow-xs transition-all cursor-pointer space-y-1"
                      >
                        <h4 className="text-xs font-bold text-[#002366] line-clamp-1">{item.title}</h4>
                        <div className="text-[10px] text-slate-500">{item.author}</div>
                        <span className="text-[10px] text-slate-600 font-mono font-bold">View Academic Paper →</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic py-3 text-center">
                      Peer-reviewed articles available in the main catalog.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 5. 📚 SYSTEMATIC THEOLOGY */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-xs text-[#002366] uppercase tracking-wider pb-2 border-b border-slate-200">
                  <span className="text-base">📚</span>
                  <span>Systematic Theology Treatises ({groupedResults.systematicTheology.length})</span>
                </div>
                <div className="mt-3 space-y-2">
                  {groupedResults.systematicTheology.length > 0 ? (
                    groupedResults.systematicTheology.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onOpenResource(item, 'read')}
                        className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-[#C5A059] hover:shadow-xs transition-all cursor-pointer space-y-1"
                      >
                        <h4 className="text-xs font-bold text-[#002366] line-clamp-1">{item.title}</h4>
                        <div className="text-[10px] text-slate-500">{item.author}</div>
                        <span className="text-[10px] text-blue-700 font-mono font-bold">Open Dogmatic Treatise →</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic py-3 text-center">
                      Search Systematic Theology in the catalog tab.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 6. 🕊️ PASTORAL APPLICATIONS */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-xs text-[#002366] uppercase tracking-wider pb-2 border-b border-slate-200">
                  <span className="text-base">🕊️</span>
                  <span>Pastoral Protocols & Homiletics ({groupedResults.pastoralApplications.length})</span>
                </div>
                <div className="mt-3 space-y-2">
                  {groupedResults.pastoralApplications.length > 0 ? (
                    groupedResults.pastoralApplications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onOpenResource(item, 'read')}
                        className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-[#C5A059] hover:shadow-xs transition-all cursor-pointer space-y-1"
                      >
                        <h4 className="text-xs font-bold text-[#002366] line-clamp-1">{item.title}</h4>
                        <div className="text-[10px] text-slate-500">{item.author}</div>
                        <span className="text-[10px] text-emerald-700 font-mono font-bold">Open Ministry Guide →</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic py-3 text-center">
                      Pastoral Protocols available in the dedicated SOP viewer.
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>BIBU Scripture Cross-Indexing Engine • Powered by Canonical Taxonomy</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#002366] text-white font-bold hover:bg-[#001845] transition-colors cursor-pointer"
          >
            Close Explorer
          </button>
        </div>

      </div>
    </div>
  );
};
