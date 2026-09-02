import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Library,
  Search,
  BookOpen,
  Download,
  FileText,
  Headphones,
  Sparkles,
  Filter,
  X,
  User,
  Tag,
  ArrowUpDown,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Bookmark,
  ChevronDown,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  Play,
  BookmarkCheck,
  BarChart3,
  Flame,
  ShieldCheck,
  Languages,
  BookMarked,
  Share2,
  Copy,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Layers,
  HelpCircle,
  FolderKanban,
  Sliders
} from 'lucide-react';
import {
  LibraryResource,
  AcademicLevel,
  LibraryResourceType,
  LibraryCollectionCategory
} from '../../types';
import {
  COMPREHENSIVE_LIBRARY_RESOURCES,
  INSTITUTIONAL_PASTORAL_PROTOCOLS,
  BIBLICAL_WORD_STUDIES
} from '../../data/theologicalLibraryData';
import { DigitalReaderModal } from '../library/DigitalReaderModal';
import { BiblicalWordStudyModal } from '../library/BiblicalWordStudyModal';
import { PastoralProtocolViewer } from '../library/PastoralProtocolViewer';
import { TheologicalAiAssistant } from '../library/TheologicalAiAssistant';
import { FacultyAssignmentManager } from '../library/FacultyAssignmentManager';
import { AdminLibraryManager } from '../library/AdminLibraryManager';

type SearchField = 'all' | 'title' | 'author' | 'subject' | 'scripture' | 'keyword' | 'language';
type SortOption = 'featured' | 'popular' | 'newest' | 'title_asc' | 'author_asc';
type ReadingStatusFilter = 'all' | 'reading' | 'completed' | 'not_started' | 'bookmarked';

export interface ResourceReadingProgress {
  resourceId: string;
  progressPercent: number;
  currentPage: number;
  totalPages: number;
  lastReadDate: string;
  status: 'not_started' | 'reading' | 'completed';
  isBookmarked: boolean;
  notesCount: number;
}

const STORAGE_KEY = 'bibu_library_reading_progress';

export const DigitalLibrary: React.FC = () => {
  const { libraryResources, currentUser, addLibraryResource, updateLibraryResource, deleteLibraryResource } = useApp();

  // Combined master catalog
  const allResources = useMemo(() => {
    const map = new Map<string, LibraryResource>();
    // Add built-in theological resources first
    COMPREHENSIVE_LIBRARY_RESOURCES.forEach((r) => map.set(r.id, r));
    // Overlay any resources from AppContext state
    if (libraryResources && libraryResources.length > 0) {
      libraryResources.forEach((r) => map.set(r.id, r));
    }
    return Array.from(map.values());
  }, [libraryResources]);

  // Reading progress state
  const [readingProgress, setReadingProgress] = useState<Record<string, ResourceReadingProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      'lib-res-001': {
        resourceId: 'lib-res-001',
        progressPercent: 65,
        currentPage: 182,
        totalPages: 280,
        lastReadDate: 'Today, 10:30 AM',
        status: 'reading',
        isBookmarked: true,
        notesCount: 5
      },
      'lib-res-003': {
        resourceId: 'lib-res-003',
        progressPercent: 40,
        currentPage: 198,
        totalPages: 495,
        lastReadDate: 'Yesterday',
        status: 'reading',
        isBookmarked: true,
        notesCount: 3
      },
      'lib-res-011': {
        resourceId: 'lib-res-011',
        progressPercent: 100,
        currentPage: 185,
        totalPages: 185,
        lastReadDate: 'Aug 24, 2026',
        status: 'completed',
        isBookmarked: true,
        notesCount: 8
      }
    };
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readingProgress));
    } catch {
      // ignore
    }
  }, [readingProgress]);

  // Main navigation & Tab view state
  const [activeMainTab, setActiveMainTab] = useState<'catalog' | 'assignments' | 'admin'>('catalog');
  const [selectedCollection, setSelectedCollection] = useState<LibraryCollectionCategory>('All');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState<SearchField>('all');
  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState<AcademicLevel>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedResourceType, setSelectedResourceType] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [readingFilter, setReadingFilter] = useState<ReadingStatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showReadingShelf, setShowReadingShelf] = useState(true);

  // Modals state
  const [activeReaderResource, setActiveReaderResource] = useState<LibraryResource | null>(null);
  const [isWordStudyOpen, setIsWordStudyOpen] = useState(false);
  const [selectedStrongs, setSelectedStrongs] = useState<string | undefined>(undefined);
  const [isProtocolViewerOpen, setIsProtocolViewerOpen] = useState(false);
  const [selectedProtocolId, setSelectedProtocolId] = useState<string | undefined>(undefined);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);

  // Helper to extract pages or default
  const extractTotalPages = (pagesOrDuration?: string): number => {
    if (!pagesOrDuration) return 100;
    const match = pagesOrDuration.match(/(\d+)\s*(pages|page|mins|min)/i);
    return match && match[1] ? parseInt(match[1], 10) : 100;
  };

  const getProgress = (resId: string, pagesOrDuration?: string): ResourceReadingProgress => {
    if (readingProgress[resId]) return readingProgress[resId];
    const total = extractTotalPages(pagesOrDuration);
    return {
      resourceId: resId,
      progressPercent: 0,
      currentPage: 0,
      totalPages: total,
      lastReadDate: 'Not started',
      status: 'not_started',
      isBookmarked: false,
      notesCount: 0
    };
  };

  const toggleBookmark = (resId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setReadingProgress((prev) => {
      const cur = prev[resId] || {
        resourceId: resId,
        progressPercent: 0,
        currentPage: 0,
        totalPages: 100,
        lastReadDate: 'Just now',
        status: 'not_started',
        isBookmarked: false,
        notesCount: 0
      };
      return {
        ...prev,
        [resId]: {
          ...cur,
          isBookmarked: !cur.isBookmarked
        }
      };
    });
  };

  const handleCopyCitation = (resource: LibraryResource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const citation = resource.citationApa || `${resource.author}. (${resource.year}). ${resource.title}. ${resource.publisher || 'BIBU Academic Press'}.`;
    navigator.clipboard.writeText(citation);
    setCopiedCitationId(resource.id);
    setTimeout(() => setCopiedCitationId(null), 2500);
  };

  const handleOpenWordStudyForPassage = (verse: string) => {
    setSearchQuery(verse);
    setSearchField('scripture');
    setIsWordStudyOpen(false);
  };

  // Filter and sort catalog
  const filteredResources = useMemo(() => {
    return allResources
      .filter((res) => {
        // Collection Filter
        if (selectedCollection !== 'All') {
          if (res.collectionCategory && res.collectionCategory !== selectedCollection) {
            return false;
          }
        }

        // Category Filter
        if (selectedCategory !== 'All' && res.category !== selectedCategory) {
          return false;
        }

        // Academic Level
        if (selectedAcademicLevel !== 'All' && res.academicLevel && res.academicLevel !== selectedAcademicLevel && res.academicLevel !== 'All') {
          return false;
        }

        // Language
        if (selectedLanguage !== 'All' && res.language && !res.language.toLowerCase().includes(selectedLanguage.toLowerCase())) {
          return false;
        }

        // Resource Type
        if (selectedResourceType !== 'All' && res.resourceType && res.resourceType !== selectedResourceType) {
          return false;
        }

        // Reading Status Filter
        const prog = getProgress(res.id, res.pagesOrDuration);
        if (readingFilter === 'reading' && prog.status !== 'reading') return false;
        if (readingFilter === 'completed' && prog.status !== 'completed') return false;
        if (readingFilter === 'not_started' && prog.status !== 'not_started') return false;
        if (readingFilter === 'bookmarked' && !prog.isBookmarked) return false;

        // Search Query
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();

        if (searchField === 'title') return res.title.toLowerCase().includes(q);
        if (searchField === 'author') return res.author.toLowerCase().includes(q);
        if (searchField === 'subject') return res.category.toLowerCase().includes(q) || (res.collectionCategory && res.collectionCategory.toLowerCase().includes(q));
        if (searchField === 'scripture') {
          return res.scriptureReferences && res.scriptureReferences.some((s) => s.toLowerCase().includes(q));
        }
        if (searchField === 'keyword') {
          return res.keywords && res.keywords.some((k) => k.toLowerCase().includes(q));
        }
        if (searchField === 'language') {
          return res.language && res.language.toLowerCase().includes(q);
        }

        // 'all' search
        const matchTitle = res.title.toLowerCase().includes(q);
        const matchAuthor = res.author.toLowerCase().includes(q);
        const matchDesc = res.description.toLowerCase().includes(q);
        const matchAbstract = res.abstract && res.abstract.toLowerCase().includes(q);
        const matchKeywords = res.keywords && res.keywords.some((k) => k.toLowerCase().includes(q));
        const matchScripture = res.scriptureReferences && res.scriptureReferences.some((s) => s.toLowerCase().includes(q));
        const matchCategory = res.category.toLowerCase().includes(q);

        return matchTitle || matchAuthor || matchDesc || matchAbstract || matchKeywords || matchScripture || matchCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        if (sortBy === 'newest') return b.year - a.year;
        if (sortBy === 'title_asc') return a.title.localeCompare(b.title);
        if (sortBy === 'author_asc') return a.author.localeCompare(b.author);
        // default featured
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [
    allResources,
    selectedCollection,
    selectedCategory,
    selectedAcademicLevel,
    selectedLanguage,
    selectedResourceType,
    readingFilter,
    searchQuery,
    searchField,
    sortBy,
    readingProgress
  ]);

  // Reading Shelf Items
  const continueReadingItems = useMemo(() => {
    return allResources
      .filter((res) => {
        const prog = getProgress(res.id, res.pagesOrDuration);
        return prog.status === 'reading' || prog.isBookmarked;
      })
      .slice(0, 4);
  }, [allResources, readingProgress]);

  // Reading Stats
  const readingStats = useMemo(() => {
    const list: ResourceReadingProgress[] = Object.values(readingProgress);
    const readingCount = list.filter((p) => p.status === 'reading').length;
    const completedCount = list.filter((p) => p.status === 'completed').length;
    const bookmarkedCount = list.filter((p) => p.isBookmarked).length;
    const totalPagesRead = list.reduce((acc, cur) => acc + (cur.currentPage || 0), 0);
    return {
      readingCount,
      completedCount,
      bookmarkedCount,
      totalPagesRead,
      hoursResearched: Math.round((totalPagesRead * 2.2) / 60)
    };
  }, [readingProgress]);

  const collections: { id: LibraryCollectionCategory; label: string; icon: string; count: number }[] = [
    { id: 'All', label: 'All Catalog Resources', icon: '📚', count: allResources.length },
    { id: 'Bible Studies', label: 'Bible Studies & Hermeneutics', icon: '📖', count: allResources.filter((r) => r.collectionCategory === 'Bible Studies' || r.category === 'Biblical Studies').length },
    { id: 'Exegetical Commentaries', label: 'Exegetical Commentaries', icon: '🏛️', count: allResources.filter((r) => r.collectionCategory === 'Exegetical Commentaries' || r.resourceType === 'Exegetical Commentary').length },
    { id: 'Greek & Hebrew Research', label: 'Greek & Hebrew Languages', icon: '🔤', count: allResources.filter((r) => r.collectionCategory === 'Greek & Hebrew Research' || r.category === 'Biblical Languages').length },
    { id: 'Religion & Church History', label: 'Religion & Church History', icon: '📜', count: allResources.filter((r) => r.collectionCategory === 'Religion & Church History' || r.category === 'Church History').length },
    { id: 'Pastoral Ministry', label: 'Pastoral Ministry Library', icon: '🕊️', count: allResources.filter((r) => r.collectionCategory === 'Pastoral Ministry' || r.category === 'Leadership' || r.category === 'Christian Counseling').length },
    { id: 'Pastoral Protocols', label: 'Pastoral Protocols & SOPs', icon: '🛡️', count: INSTITUTIONAL_PASTORAL_PROTOCOLS.length + allResources.filter((r) => r.category === 'Pastoral Protocols').length },
    { id: 'Academic Research & Theses', label: 'Theses & Dissertations', icon: '🎓', count: allResources.filter((r) => r.collectionCategory === 'Academic Research & Theses' || r.category === 'Research').length }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      
      {/* 1. HERO & INSTITUTIONAL BRANDING HEADER */}
      <div className="bg-[#002366] text-white border-b-4 border-[#C5A059] relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          
          {/* Top Tag & Identity */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#001438] text-[#C5A059] border border-[#C5A059]/40 font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <Library className="w-3.5 h-3.5" />
                <span>Phoenix, Arizona, USA</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-mono font-medium hidden sm:inline">
                Standard of Academic & Pastoral Excellence
              </span>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsWordStudyOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#001438] hover:bg-[#001A4D] text-[#C5A059] border border-[#C5A059]/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>Biblical Word Study (G/H)</span>
              </button>

              <button
                onClick={() => setIsProtocolViewerOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#001438] hover:bg-[#001A4D] text-[#C5A059] border border-[#C5A059]/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pastoral Protocols</span>
              </button>

              <button
                onClick={() => setIsAiAssistantOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#C5A059] hover:bg-[#B38F46] text-[#002366] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Theological AI Desk</span>
              </button>
            </div>
          </div>

          {/* Library Title & Motto */}
          <div className="space-y-2 max-w-4xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white">
              BIBU Digital Theological Library
            </h1>
            <p className="text-sm sm:text-lg font-serif italic text-[#C5A059] tracking-wide font-medium">
              "Research. Read. Learn. Minister."
            </p>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Breakthrough International Bible University’s premier academic repository featuring peer-reviewed treatises, Greek & Hebrew lexicons, exegetical commentaries, patristic texts, and institutional pastoral protocols.
            </p>
          </div>

          {/* Sub-Navigation Tabs: Catalog vs Faculty Assignments vs Admin */}
          <div className="flex items-center gap-2 mt-8 pt-4 border-t border-white/15 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveMainTab('catalog')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeMainTab === 'catalog'
                  ? 'bg-[#C5A059] text-[#002366] shadow-md'
                  : 'bg-[#001438] text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Research Catalog & Collections ({allResources.length})</span>
            </button>

            <button
              onClick={() => setActiveMainTab('assignments')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeMainTab === 'assignments'
                  ? 'bg-[#C5A059] text-[#002366] shadow-md'
                  : 'bg-[#001438] text-white hover:bg-white/10'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Course Syllabi & Faculty Assignments</span>
            </button>

            {(currentUser.role === 'admin' || currentUser.role === 'superadmin' || currentUser.role === 'faculty') && (
              <button
                onClick={() => setActiveMainTab('admin')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeMainTab === 'admin'
                    ? 'bg-[#C5A059] text-[#002366] shadow-md'
                    : 'bg-[#001438] text-white hover:bg-white/10'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Library Catalog Management</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 2. MAIN WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {activeMainTab === 'assignments' && (
          <FacultyAssignmentManager resources={allResources} />
        )}

        {activeMainTab === 'admin' && (
          <AdminLibraryManager
            resources={allResources}
            onAddResource={addLibraryResource}
            onUpdateResource={updateLibraryResource}
            onDeleteResource={deleteLibraryResource}
          />
        )}

        {activeMainTab === 'catalog' && (
          <>
            {/* STUDENT RESEARCH DESK & CONTINUED READING TRAY */}
            {showReadingShelf && continueReadingItems.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold font-serif text-[#002366] uppercase tracking-wider">
                        My Research Desk • Continue Reading
                      </h2>
                      <div className="text-xs text-slate-500">
                        {readingStats.readingCount} volumes in progress • {readingStats.completedCount} completed • {readingStats.hoursResearched} hours logged
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <button
                      onClick={() => setReadingFilter(readingFilter === 'reading' ? 'all' : 'reading')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                        readingFilter === 'reading'
                          ? 'bg-[#002366] text-[#C5A059]'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      In-Progress ({readingStats.readingCount})
                    </button>
                    <button
                      onClick={() => setReadingFilter(readingFilter === 'bookmarked' ? 'all' : 'bookmarked')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                        readingFilter === 'bookmarked'
                          ? 'bg-[#002366] text-[#C5A059]'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Bookmarked ({readingStats.bookmarkedCount})
                    </button>
                  </div>
                </div>

                {/* Continue Reading Horizontal Shelf */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {continueReadingItems.map((item) => {
                    const prog = getProgress(item.id, item.pagesOrDuration);
                    return (
                      <div
                        key={item.id}
                        onClick={() => setActiveReaderResource(item)}
                        className="p-4 rounded-xl border border-slate-200 hover:border-[#002366] hover:shadow-md transition-all cursor-pointer bg-slate-50/70 space-y-2.5 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-[#002366] border border-slate-200">
                              {item.category}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-[#002366]">
                              {prog.progressPercent}%
                            </span>
                          </div>

                          <h3 className="font-serif font-bold text-xs text-[#002366] line-clamp-2 leading-snug">
                            {item.title}
                          </h3>

                          <div className="text-[11px] text-slate-500 truncate">
                            By {item.author}
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-slate-200/70">
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#002366] h-full rounded-full transition-all"
                              style={{ width: `${prog.progressPercent}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span>p. {prog.currentPage} of {prog.totalPages}</span>
                            <span className="text-[#002366] font-bold">Resume</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* 3. SEARCH & COMPREHENSIVE FILTER SYSTEM */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
              
              {/* Global Search Input & Scope Selector */}
              <div className="flex flex-col md:flex-row items-stretch gap-2">
                
                {/* Search Field Scope Selector */}
                <div className="w-full md:w-56 shrink-0">
                  <select
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value as SearchField)}
                    className="w-full h-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                  >
                    <option value="all">🔍 Search Everywhere</option>
                    <option value="title">📖 Search by Title</option>
                    <option value="author">✍️ Search by Author</option>
                    <option value="subject">🏛️ Search by Subject</option>
                    <option value="scripture">📜 Search by Scripture Verse</option>
                    <option value="keyword">🏷️ Search by Keyword</option>
                    <option value="language">🔤 Search by Language</option>
                  </select>
                </div>

                {/* Search Text Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, author, scripture (Romans 8), Strong's (G26), keyword (exegesis, patristics)..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#002366] bg-slate-50/80"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort Order Selector */}
                <div className="w-full md:w-48 shrink-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full h-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                  >
                    <option value="featured">✨ Featured & Recommended</option>
                    <option value="popular">🔥 Most Read / Popular</option>
                    <option value="newest">📅 Recently Added</option>
                    <option value="title_asc">🔤 Title (A–Z)</option>
                    <option value="author_asc">👤 Author (A–Z)</option>
                  </select>
                </div>

                {/* Advanced Filter Toggle Button */}
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                    showAdvancedFilters
                      ? 'bg-[#002366] text-[#C5A059]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>

              </div>

              {/* Advanced Filter Dropdowns Panel */}
              {showAdvancedFilters && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs animate-in fade-in">
                  
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Academic Level</label>
                    <select
                      value={selectedAcademicLevel}
                      onChange={(e) => setSelectedAcademicLevel(e.target.value as AcademicLevel)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="All">All Academic Levels</option>
                      <option value="Certificate">Certificate Level</option>
                      <option value="Diploma">Diploma Level</option>
                      <option value="Bachelor">Bachelor Level</option>
                      <option value="Master">Master of Divinity / MA</option>
                      <option value="Doctorate">Doctorate / Ph.D. / D.Min.</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Resource Type</label>
                    <select
                      value={selectedResourceType}
                      onChange={(e) => setSelectedResourceType(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="All">All Resource Types</option>
                      <option value="Exegetical Commentary">Exegetical Commentary</option>
                      <option value="Systematic Treatise">Systematic Treatise</option>
                      <option value="Greek & Hebrew Lexicon">Greek & Hebrew Lexicon</option>
                      <option value="Grammar & Syntax Manual">Grammar & Syntax Manual</option>
                      <option value="Pastoral Protocol">Pastoral Protocol</option>
                      <option value="Academic Journal Article">Academic Journal Article</option>
                      <option value="Theses & Dissertations">Theses & Dissertations</option>
                      <option value="Historical Patristic Text">Historical Patristic Text</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Language</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="All">All Languages</option>
                      <option value="English">English</option>
                      <option value="Greek">Koine Greek (Ancient)</option>
                      <option value="Hebrew">Classical Biblical Hebrew</option>
                      <option value="Latin">Patristic Latin</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Reading Status</label>
                    <select
                      value={readingFilter}
                      onChange={(e) => setReadingFilter(e.target.value as ReadingStatusFilter)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="all">All Items</option>
                      <option value="reading">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="bookmarked">Bookmarked</option>
                      <option value="not_started">Not Started</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                    <span className="text-slate-500">
                      Showing {filteredResources.length} of {allResources.length} matching theological works
                    </span>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedAcademicLevel('All');
                        setSelectedLanguage('All');
                        setSelectedResourceType('All');
                        setSelectedCategory('All');
                        setReadingFilter('all');
                        setSelectedCollection('All');
                      }}
                      className="text-[#002366] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset All Filters</span>
                    </button>
                  </div>

                </div>
              )}

            </div>

            {/* 4. THE 7 THEOLOGICAL RESEARCH COLLECTIONS NAVIGATOR */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold font-serif text-[#002366] uppercase tracking-wider flex items-center gap-1.5">
                  <FolderKanban className="w-4 h-4 text-[#C5A059]" />
                  <span>Theological Research Collections</span>
                </h2>
                <span className="text-xs text-slate-500">Curated academic disciplines</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {collections.map((col) => {
                  const isSelected = selectedCollection === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => {
                        if (col.id === 'Pastoral Protocols') {
                          setIsProtocolViewerOpen(true);
                        } else if (col.id === 'Greek & Hebrew Research') {
                          setIsWordStudyOpen(true);
                        } else {
                          setSelectedCollection(col.id);
                        }
                      }}
                      className={`p-3 rounded-xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#002366] text-white border-[#002366] shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="text-xl mb-1.5">{col.icon}</div>
                      <div>
                        <div className={`text-xs font-bold leading-tight line-clamp-2 ${
                          isSelected ? 'text-[#C5A059]' : 'text-[#002366]'
                        }`}>
                          {col.label}
                        </div>
                        <div className={`text-[10px] font-mono mt-1 ${
                          isSelected ? 'text-slate-300' : 'text-slate-400'
                        }`}>
                          {col.count} items
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. MAIN RESEARCH RESOURCE CARDS GRID */}
            <div className="space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-serif text-[#002366]">
                    {selectedCollection === 'All' ? 'Complete Academic Catalog' : selectedCollection}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Showing {filteredResources.length} peer-reviewed monographs, treatises, and commentaries
                  </p>
                </div>

                <div className="text-xs font-mono text-slate-400">
                  Ref: BIBU-LIB-2026
                </div>
              </div>

              {filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredResources.map((resource) => {
                    const prog = getProgress(resource.id, resource.pagesOrDuration);
                    const isCopied = copiedCitationId === resource.id;

                    return (
                      <div
                        key={resource.id}
                        className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group hover:border-[#002366]/40"
                      >
                        
                        {/* Card Header & Badges */}
                        <div className="p-5 space-y-3">
                          
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="px-2.5 py-0.5 rounded-md bg-[#002366] text-[#C5A059] font-mono font-bold text-[10px]">
                                {resource.category}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-bold text-[10px]">
                                {resource.academicLevel || 'Master'}
                              </span>
                              {resource.peerReviewed && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-bold">
                                  Peer-Reviewed
                                </span>
                              )}
                            </div>

                            <button
                              onClick={(e) => toggleBookmark(resource.id, e)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                prog.isBookmarked
                                  ? 'bg-[#C5A059] text-[#002366]'
                                  : 'text-slate-400 hover:text-slate-700 bg-slate-100'
                              }`}
                              title={prog.isBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
                            >
                              <Bookmark className="w-3.5 h-3.5 fill-current" />
                            </button>
                          </div>

                          {/* Resource Title */}
                          <div>
                            <h4
                              onClick={() => setActiveReaderResource(resource)}
                              className="font-serif font-bold text-base text-[#002366] group-hover:text-[#C5A059] transition-colors leading-snug cursor-pointer line-clamp-2"
                            >
                              {resource.title}
                            </h4>
                            <div className="text-xs text-slate-600 mt-1">
                              By <strong className="text-slate-800">{resource.author}</strong>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {resource.publisher || 'BIBU Academic Press'} • {resource.year} • {resource.pagesOrDuration}
                            </div>
                          </div>

                          {/* Abstract / Description */}
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            {resource.abstract || resource.description}
                          </p>

                          {/* Scripture references tags if present */}
                          {resource.scriptureReferences && resource.scriptureReferences.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1 pt-1">
                              <span className="text-[10px] text-slate-400 font-mono">Passages:</span>
                              {resource.scriptureReferences.slice(0, 3).map((v) => (
                                <span
                                  key={v}
                                  className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-mono font-medium"
                                >
                                  {v}
                                </span>
                              ))}
                            </div>
                          )}

                        </div>

                        {/* Card Action Footer */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
                          
                          {/* Reading Progress Indicator if active */}
                          {prog.progressPercent > 0 && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                                <span>Reading Progress</span>
                                <span className="font-bold text-[#002366]">{prog.progressPercent}% (p. {prog.currentPage})</span>
                              </div>
                              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#002366] h-full rounded-full"
                                  style={{ width: `${prog.progressPercent}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setActiveReaderResource(resource)}
                              className="flex-1 py-2 px-3 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-[#C5A059] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>{prog.progressPercent > 0 ? 'Continue Reading' : 'Read Online'}</span>
                            </button>

                            <button
                              onClick={(e) => handleCopyCitation(resource, e)}
                              className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                              title="Copy Academic Citation (APA)"
                            >
                              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                            </button>

                            {resource.category === 'Biblical Languages' && (
                              <button
                                onClick={() => setIsWordStudyOpen(true)}
                                className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-[#002366] text-xs font-bold transition-colors cursor-pointer"
                                title="Open Greek/Hebrew Lexicon"
                              >
                                <Languages className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold font-serif text-[#002366]">
                    No Theological Works Found
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your search terms, changing the research scope, or clearing filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCollection('All');
                      setSelectedCategory('All');
                      setSelectedAcademicLevel('All');
                      setSelectedLanguage('All');
                      setSelectedResourceType('All');
                      setReadingFilter('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#002366] text-[#C5A059] font-bold text-xs cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

            </div>
          </>
        )}

      </div>

      {/* MODALS */}
      {/* 1. Full Digital Academic Reader */}
      <DigitalReaderModal
        resource={activeReaderResource}
        isOpen={!!activeReaderResource}
        onClose={() => setActiveReaderResource(null)}
        onBookmarkToggle={(id) => toggleBookmark(id)}
        isBookmarked={activeReaderResource ? getProgress(activeReaderResource.id).isBookmarked : false}
      />

      {/* 2. Greek & Hebrew Biblical Word Study Lexicon */}
      <BiblicalWordStudyModal
        isOpen={isWordStudyOpen}
        onClose={() => setIsWordStudyOpen(false)}
        initialStrongs={selectedStrongs}
        onSelectPassage={handleOpenWordStudyForPassage}
      />

      {/* 3. Institutional Pastoral Protocols Viewer */}
      <PastoralProtocolViewer
        isOpen={isProtocolViewerOpen}
        onClose={() => setIsProtocolViewerOpen(false)}
        initialProtocolId={selectedProtocolId}
      />

      {/* 4. AI Theological Research Assistant */}
      <TheologicalAiAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
      />

    </div>
  );
};
