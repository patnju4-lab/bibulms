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
  Edit3,
  BookmarkCheck,
  BarChart3,
  Flame
} from 'lucide-react';
import { LibraryResource } from '../../types';

type SearchField = 'all' | 'title' | 'subject' | 'author';
type SortOption = 'featured' | 'progress_desc' | 'newest' | 'title_asc' | 'author_asc';
type ReadingStatusFilter = 'all' | 'reading' | 'completed' | 'not_started' | 'bookmarked';

export interface ResourceReadingProgress {
  resourceId: string;
  progressPercent: number; // 0 to 100
  currentPage: number;
  totalPages: number;
  lastReadDate: string;
  status: 'not_started' | 'reading' | 'completed';
  isBookmarked: boolean;
  notesCount: number;
}

// Initial realistic reading data for enrolled students
const DEFAULT_READING_PROGRESS: Record<string, ResourceReadingProgress> = {
  'lib-1': {
    resourceId: 'lib-1',
    progressPercent: 72,
    currentPage: 162,
    totalPages: 225,
    lastReadDate: 'Today, 10:15 AM',
    status: 'reading',
    isBookmarked: true,
    notesCount: 4
  },
  'lib-2': {
    resourceId: 'lib-2',
    progressPercent: 45,
    currentPage: 140,
    totalPages: 310,
    lastReadDate: 'Yesterday',
    status: 'reading',
    isBookmarked: true,
    notesCount: 7
  },
  'lib-3': {
    resourceId: 'lib-3',
    progressPercent: 100,
    currentPage: 412,
    totalPages: 412,
    lastReadDate: 'Aug 20, 2026',
    status: 'completed',
    isBookmarked: false,
    notesCount: 12
  },
  'lib-4': {
    resourceId: 'lib-4',
    progressPercent: 28,
    currentPage: 78,
    totalPages: 280,
    lastReadDate: '3 days ago',
    status: 'reading',
    isBookmarked: false,
    notesCount: 2
  },
  'lib-7': {
    resourceId: 'lib-7',
    progressPercent: 85,
    currentPage: 264,
    totalPages: 310,
    lastReadDate: 'Aug 22, 2026',
    status: 'reading',
    isBookmarked: true,
    notesCount: 5
  },
  'lib-10': {
    resourceId: 'lib-10',
    progressPercent: 15,
    currentPage: 54,
    totalPages: 360,
    lastReadDate: 'Aug 24, 2026',
    status: 'reading',
    isBookmarked: false,
    notesCount: 1
  }
};

const STORAGE_KEY = 'bibu_library_reading_progress';

// Helper to parse page count from resource
const extractTotalPages = (pagesOrDuration: string): number => {
  const match = pagesOrDuration.match(/(\d+)\s*(pages|page|mins|min)/i);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return 100;
};

export const DigitalLibrary: React.FC = () => {
  const { libraryResources, currentUser } = useApp();

  // Load / initialize reading progress state from localStorage
  const [readingProgress, setReadingProgress] = useState<Record<string, ResourceReadingProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_READING_PROGRESS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_READING_PROGRESS;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readingProgress));
    } catch {
      // ignore
    }
  }, [readingProgress]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState<SearchField>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [readingFilter, setReadingFilter] = useState<ReadingStatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showReadingShelf, setShowReadingShelf] = useState(true);

  // Active Reader Modal & Inline Progress Editing
  const [selectedResource, setSelectedResource] = useState<LibraryResource | null>(null);
  const [editingProgressId, setEditingProgressId] = useState<string | null>(null);
  const [tempPageInput, setTempPageInput] = useState<number>(0);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Helper to retrieve progress for a given resource
  const getProgress = (resId: string, pagesOrDuration: string): ResourceReadingProgress => {
    if (readingProgress[resId]) {
      return readingProgress[resId];
    }
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

  // Update reading progress handler
  const updateResourceProgress = (
    resId: string,
    updates: Partial<ResourceReadingProgress>,
    pagesOrDuration?: string
  ) => {
    setReadingProgress((prev) => {
      const current = prev[resId] || {
        resourceId: resId,
        progressPercent: 0,
        currentPage: 0,
        totalPages: pagesOrDuration ? extractTotalPages(pagesOrDuration) : 100,
        lastReadDate: 'Just now',
        status: 'not_started',
        isBookmarked: false,
        notesCount: 0
      };

      const newCurrentPage = updates.currentPage !== undefined ? updates.currentPage : current.currentPage;
      const newTotalPages = updates.totalPages !== undefined ? updates.totalPages : current.totalPages;
      
      let newPercent = updates.progressPercent !== undefined
        ? updates.progressPercent
        : Math.min(100, Math.max(0, Math.round((newCurrentPage / (newTotalPages || 1)) * 100)));

      if (updates.status === 'completed') {
        newPercent = 100;
      }

      let newStatus: 'not_started' | 'reading' | 'completed' = current.status;
      if (updates.status) {
        newStatus = updates.status;
      } else if (newPercent >= 100) {
        newStatus = 'completed';
      } else if (newPercent > 0) {
        newStatus = 'reading';
      } else {
        newStatus = 'not_started';
      }

      const updatedItem: ResourceReadingProgress = {
        ...current,
        ...updates,
        currentPage: newPercent === 100 ? newTotalPages : newCurrentPage,
        totalPages: newTotalPages,
        progressPercent: newPercent,
        status: newStatus,
        lastReadDate: updates.lastReadDate || 'Just now'
      };

      return {
        ...prev,
        [resId]: updatedItem
      };
    });
  };

  // Toggle bookmark
  const toggleBookmark = (resId: string, pagesOrDuration: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const current = getProgress(resId, pagesOrDuration);
    updateResourceProgress(resId, { isBookmarked: !current.isBookmarked }, pagesOrDuration);
  };

  // Mark resource as reading (start reading)
  const handleStartReading = (res: LibraryResource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const total = extractTotalPages(res.pagesOrDuration);
    const initialPage = Math.max(1, Math.round(total * 0.05)); // 5% start
    updateResourceProgress(res.id, {
      currentPage: initialPage,
      totalPages: total,
      progressPercent: Math.round((initialPage / total) * 100),
      status: 'reading',
      lastReadDate: 'Just now'
    }, res.pagesOrDuration);
  };

  // Mark resource as 100% completed
  const handleMarkAsComplete = (resId: string, pagesOrDuration: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const total = extractTotalPages(pagesOrDuration);
    updateResourceProgress(resId, {
      currentPage: total,
      totalPages: total,
      progressPercent: 100,
      status: 'completed',
      lastReadDate: 'Just completed'
    }, pagesOrDuration);
  };

  // Extract unique subjects / categories with resource counts
  const categoryCounts = useMemo(() => {
    const counts: { [cat: string]: number } = { All: libraryResources.length };
    libraryResources.forEach((res) => {
      counts[res.category] = (counts[res.category] || 0) + 1;
    });
    return counts;
  }, [libraryResources]);

  const categories = useMemo(() => {
    const set = new Set(libraryResources.map((r) => r.category));
    return ['All', ...Array.from(set)];
  }, [libraryResources]);

  // Extract unique authors
  const authorsList = useMemo(() => {
    const authorSet = new Set(libraryResources.map((r) => r.author));
    return ['All', ...Array.from(authorSet).sort()];
  }, [libraryResources]);

  // Extract unique formats
  const formatsList = useMemo(() => {
    const fmtSet = new Set(libraryResources.map((r) => r.format));
    return ['All', ...Array.from(fmtSet)];
  }, [libraryResources]);

  // Overall student reading statistics
  const readingStats = useMemo(() => {
    let readingCount = 0;
    let completedCount = 0;
    let bookmarkedCount = 0;
    let totalProgressSum = 0;

    libraryResources.forEach((res) => {
      const prog = readingProgress[res.id];
      if (prog) {
        if (prog.status === 'reading') readingCount++;
        if (prog.status === 'completed') completedCount++;
        if (prog.isBookmarked) bookmarkedCount++;
        totalProgressSum += prog.progressPercent;
      }
    });

    const activeReadings = libraryResources
      .filter((res) => readingProgress[res.id]?.status === 'reading')
      .slice(0, 3);

    return {
      readingCount,
      completedCount,
      bookmarkedCount,
      avgProgress: readingCount > 0 ? Math.round(totalProgressSum / (readingCount + completedCount)) : 0,
      activeReadings
    };
  }, [libraryResources, readingProgress]);

  // Core Search & Filtering Engine
  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return libraryResources
      .filter((res) => {
        // 1. Reading Status Filter
        const prog = getProgress(res.id, res.pagesOrDuration);
        if (readingFilter === 'reading' && prog.status !== 'reading') return false;
        if (readingFilter === 'completed' && prog.status !== 'completed') return false;
        if (readingFilter === 'not_started' && prog.status !== 'not_started') return false;
        if (readingFilter === 'bookmarked' && !prog.isBookmarked) return false;

        // 2. Subject / Category Filter
        if (selectedCategory !== 'All' && res.category !== selectedCategory) {
          return false;
        }

        // 3. Author Filter
        if (selectedAuthor !== 'All' && res.author !== selectedAuthor) {
          return false;
        }

        // 4. Format Filter
        if (selectedFormat !== 'All' && res.format !== selectedFormat) {
          return false;
        }

        // 5. Text Search with Field Discrimination (Title, Subject, Author, or All)
        if (!query) return true;

        if (searchField === 'title') {
          return res.title.toLowerCase().includes(query);
        } else if (searchField === 'author') {
          return res.author.toLowerCase().includes(query);
        } else if (searchField === 'subject') {
          return (
            res.category.toLowerCase().includes(query) ||
            res.description.toLowerCase().includes(query)
          );
        } else {
          return (
            res.title.toLowerCase().includes(query) ||
            res.author.toLowerCase().includes(query) ||
            res.category.toLowerCase().includes(query) ||
            res.description.toLowerCase().includes(query)
          );
        }
      })
      .sort((a, b) => {
        const progA = getProgress(a.id, a.pagesOrDuration);
        const progB = getProgress(b.id, b.pagesOrDuration);

        if (sortBy === 'progress_desc') {
          return progB.progressPercent - progA.progressPercent;
        } else if (sortBy === 'newest') {
          return b.year - a.year;
        } else if (sortBy === 'title_asc') {
          return a.title.localeCompare(b.title);
        } else if (sortBy === 'author_asc') {
          return a.author.localeCompare(b.author);
        } else {
          // 'featured' / popular + reading priority
          if (progA.status === 'reading' && progB.status !== 'reading') return -1;
          if (progA.status !== 'reading' && progB.status === 'reading') return 1;
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return b.year - a.year;
        }
      });
  }, [
    libraryResources,
    searchQuery,
    searchField,
    selectedCategory,
    selectedAuthor,
    selectedFormat,
    readingFilter,
    sortBy,
    readingProgress
  ]);

  // Reset all search criteria
  const handleResetFilters = () => {
    setSearchQuery('');
    setSearchField('all');
    setSelectedCategory('All');
    setSelectedAuthor('All');
    setSelectedFormat('All');
    setReadingFilter('all');
    setSortBy('featured');
  };

  const handleQuickTagClick = (tagQuery: string, field: SearchField = 'all') => {
    setSearchQuery(tagQuery);
    setSearchField(field);
  };

  const handleDownload = (res: LibraryResource) => {
    setDownloadSuccess(res.id);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // Helper to highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.trim().toLowerCase() ? (
            <mark key={i} className="bg-amber-200 text-slate-900 px-0.5 rounded font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    searchField !== 'all' ||
    selectedCategory !== 'All' ||
    selectedAuthor !== 'All' ||
    selectedFormat !== 'All' ||
    readingFilter !== 'all' ||
    sortBy !== 'featured';

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Institutional Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002366]/5 border border-[#002366]/10 text-xs font-bold text-[#002366] uppercase tracking-wider">
            <Library className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Theological Research & Academic Repository</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-[#002366] tracking-tight">
            BIBU Digital Theological Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Curated academic treatises, exegetical commentaries, Greek & Hebrew lexicons, and pastoral protocols with real-time student reading progress tracking.
          </p>
        </div>

        {/* Student Reading Dashboard Tray */}
        <div className="bg-white rounded-2xl border-2 border-[#002366]/15 shadow-sm p-4 sm:p-6 overflow-hidden relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold shadow-xs">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold font-serif text-[#002366]">
                    Student Study & Reading Progress
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-600" />
                    Active Scholar
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Track completed chapters, exegetical research papers, and bookmark resources for seminar preparation.
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-1 sm:pb-0">
              <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-center min-w-[90px]">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Reading</div>
                <div className="text-base sm:text-lg font-black text-[#002366]">{readingStats.readingCount}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-center min-w-[90px]">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Completed</div>
                <div className="text-base sm:text-lg font-black text-emerald-600">{readingStats.completedCount}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-center min-w-[90px]">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Saved</div>
                <div className="text-base sm:text-lg font-black text-[#C5A059]">{readingStats.bookmarkedCount}</div>
              </div>
            </div>
          </div>

          {/* Quick Active Readings Shelf */}
          {readingStats.activeReadings.length > 0 && showReadingShelf && (
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-[#002366]">
                  <TrendingUp className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Resume Current Reading ({readingStats.activeReadings.length})</span>
                </span>
                <button
                  onClick={() => setReadingFilter('reading')}
                  className="text-[#C5A059] hover:text-[#002366] transition-colors"
                >
                  View all in progress &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {readingStats.activeReadings.map((res) => {
                  const prog = getProgress(res.id, res.pagesOrDuration);
                  return (
                    <div
                      key={res.id}
                      onClick={() => setSelectedResource(res)}
                      className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-[#002366]/40 p-3 rounded-xl cursor-pointer transition-all flex flex-col justify-between gap-2 group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                          <span className="font-bold text-[#002366]">{res.category}</span>
                          <span>{prog.progressPercent}%</span>
                        </div>
                        <div className="font-bold text-xs text-[#002366] line-clamp-1 group-hover:text-[#C5A059] transition-colors font-serif">
                          {res.title}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {res.author}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#002366] to-[#C5A059] h-full rounded-full transition-all duration-300"
                            style={{ width: `${prog.progressPercent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-mono">
                            {res.format === 'Audio Lecture'
                              ? `${Math.round((prog.currentPage / prog.totalPages) * parseInt(res.pagesOrDuration))} / ${res.pagesOrDuration}`
                              : `p. ${prog.currentPage} / ${prog.totalPages}`}
                          </span>
                          <span className="text-[#002366] font-bold flex items-center gap-0.5">
                            <Play className="w-2.5 h-2.5 fill-current" />
                            Resume
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Unified Search & Multi-Filter Control Hub */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-4 sm:p-6 space-y-5">
          
          {/* Main Search Bar with Field Scope Selector */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            
            {/* Search Field Scope Selector */}
            <div className="relative shrink-0">
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value as SearchField)}
                className="w-full sm:w-auto appearance-none bg-[#F8F9FB] border border-slate-300 hover:border-[#002366] text-[#002366] text-xs font-bold py-3 pl-3.5 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002366] cursor-pointer"
                title="Search Filter Target"
              >
                <option value="all">Search: All Fields</option>
                <option value="title">Search by Title</option>
                <option value="subject">Search by Subject / Topic</option>
                <option value="author">Search by Author</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Input Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchField === 'title'
                    ? 'Search by title (e.g., Grammatical-Historical Exegesis, Systematic Dogmatics)...'
                    : searchField === 'author'
                    ? 'Search by author (e.g., Dr. Jonathan Vance, Dr. Thomas Wright, Dr. Boateng)...'
                    : searchField === 'subject'
                    ? 'Search by subject or theological topic (e.g., Hermeneutics, Christology, Missions)...'
                    : 'Search across titles, subjects, authors, and keywords...'
                }
                className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] text-slate-800 placeholder-slate-400 bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 absolute right-3 top-1/2 -translate-y-1/2"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Advanced Filters Toggle Button */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-4 py-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                showAdvancedFilters || selectedAuthor !== 'All' || selectedFormat !== 'All'
                  ? 'bg-[#002366] text-[#C5A059] border-[#002366]'
                  : 'bg-[#F8F9FB] border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Advanced Filters</span>
              {(selectedAuthor !== 'All' || selectedFormat !== 'All') && (
                <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
              )}
            </button>
          </div>

          {/* Reading Status Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap pr-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Reading Status:</span>
            </span>
            {[
              { id: 'all' as ReadingStatusFilter, label: 'All Catalog', count: libraryResources.length },
              { id: 'reading' as ReadingStatusFilter, label: 'Currently Reading', count: readingStats.readingCount },
              { id: 'completed' as ReadingStatusFilter, label: 'Completed', count: readingStats.completedCount },
              { id: 'bookmarked' as ReadingStatusFilter, label: 'Bookmarked', count: readingStats.bookmarkedCount },
              { id: 'not_started' as ReadingStatusFilter, label: 'Not Started', count: libraryResources.length - readingStats.readingCount - readingStats.completedCount }
            ].map((tab) => {
              const isSelected = readingFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setReadingFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-white/20 text-[#C5A059]' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Subject / Category Pills Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Filter by Academic Subject</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Showing {filteredResources.length} of {libraryResources.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
              {categories.map((cat) => {
                const count = categoryCounts[cat] || 0;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-white/20 text-[#C5A059]' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expandable Advanced Filters (Author, Format, Sort) */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 animate-in fade-in">
              
              {/* Author Specific Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Filter by Author:</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedAuthor}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    className="w-full appearance-none bg-[#F8F9FB] border border-slate-300 text-slate-800 text-xs py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002366]"
                  >
                    <option value="All">All Authors ({authorsList.length - 1})</option>
                    {authorsList
                      .filter((a) => a !== 'All')
                      .map((author) => (
                        <option key={author} value={author}>
                          {author}
                        </option>
                      ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Format Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Format:</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-full appearance-none bg-[#F8F9FB] border border-slate-300 text-slate-800 text-xs py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002366]"
                  >
                    <option value="All">All Formats</option>
                    {formatsList
                      .filter((f) => f !== 'All')
                      .map((fmt) => (
                        <option key={fmt} value={fmt}>
                          {fmt}
                        </option>
                      ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Sort Results By:</span>
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full appearance-none bg-[#F8F9FB] border border-slate-300 text-slate-800 text-xs py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002366]"
                  >
                    <option value="featured">Featured & Reading Priority</option>
                    <option value="progress_desc">Reading Progress (Highest First)</option>
                    <option value="newest">Publication Year (Newest First)</option>
                    <option value="title_asc">Title (A to Z)</option>
                    <option value="author_asc">Author (A to Z)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

            </div>
          )}

          {/* Active Search & Filter Tags Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            
            {/* Suggested Searches & Quick Tags */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                <span>Popular Searches:</span>
              </span>
              {[
                { label: 'Exegesis', field: 'title' as SearchField },
                { label: 'Dr. Jonathan Vance', field: 'author' as SearchField },
                { label: 'Systematic Dogmatics', field: 'title' as SearchField },
                { label: 'Missions', field: 'subject' as SearchField },
                { label: 'Hebrew Syntax', field: 'title' as SearchField },
                { label: 'Pastoral Care', field: 'subject' as SearchField }
              ].map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleQuickTagClick(chip.label, chip.field)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-[#002366] hover:text-[#C5A059] text-slate-600 text-[11px] font-medium transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Clear All Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}

          </div>

        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div>
            Showing <span className="font-bold text-[#002366]">{filteredResources.length}</span> theological resources
            {searchQuery && (
              <span> matching <strong className="text-slate-800 font-mono">"{searchQuery}"</strong> ({searchField})</span>
            )}
            {readingFilter !== 'all' && <span> • Filter: <strong className="capitalize">{readingFilter.replace('_', ' ')}</strong></span>}
            {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
            {selectedAuthor !== 'All' && <span> by <strong>{selectedAuthor}</strong></span>}
          </div>

          <div className="text-[11px] text-slate-400">
            Click any resource card to inspect text or adjust study progress
          </div>
        </div>

        {/* Library Resources Grid with Real Progress Tracking */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => {
              const progress = getProgress(res.id, res.pagesOrDuration);
              const isReading = progress.status === 'reading';
              const isCompleted = progress.status === 'completed';

              return (
                <div
                  key={res.id}
                  onClick={() => setSelectedResource(res)}
                  className={`bg-white rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between cursor-pointer group relative overflow-hidden shadow-2xs hover:shadow-lg ${
                    isCompleted
                      ? 'border-emerald-300 hover:border-emerald-500'
                      : isReading
                      ? 'border-[#002366]/40 hover:border-[#002366]'
                      : 'border-slate-200 hover:border-[#002366]'
                  }`}
                >
                  {/* Subtle top indicator bar */}
                  <div
                    className={`h-1.5 w-full ${
                      isCompleted
                        ? 'bg-emerald-500'
                        : isReading
                        ? 'bg-gradient-to-r from-[#002366] via-[#C5A059] to-[#002366]'
                        : 'bg-transparent'
                    }`}
                  />

                  <div className="p-5 sm:p-6 space-y-4">
                    
                    {/* Top Metadata & Bookmark Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#002366] text-[#C5A059]">
                          {res.category}
                        </span>

                        {isCompleted && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            Completed
                          </span>
                        )}

                        {isReading && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#002366] flex items-center gap-1 border border-[#002366]/20">
                            <Clock className="w-2.5 h-2.5 text-[#C5A059]" />
                            Reading
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {res.isPopular && !isCompleted && !isReading && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                            Featured
                          </span>
                        )}

                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => toggleBookmark(res.id, res.pagesOrDuration, e)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            progress.isBookmarked
                              ? 'text-[#C5A059] bg-amber-50 hover:bg-amber-100'
                              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                          }`}
                          title={progress.isBookmarked ? 'Bookmarked in study list' : 'Bookmark resource'}
                        >
                          <Bookmark className={`w-4 h-4 ${progress.isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold font-serif text-[#002366] group-hover:text-[#001A4D] leading-snug">
                      {highlightMatch(res.title, searchQuery)}
                    </h3>

                    {/* Author */}
                    <div className="text-xs text-[#C5A059] font-bold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>By {highlightMatch(res.author, searchQuery)}</span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {highlightMatch(res.description, searchQuery)}
                    </p>

                    {/* Format & Publication Metadata */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        {res.format === 'Audio Lecture' ? (
                          <Headphones className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-[#002366]" />
                        )}
                        <span>{res.format}</span>
                      </span>
                      <span>•</span>
                      <span className="font-mono">{res.pagesOrDuration}</span>
                      <span>•</span>
                      <span className="font-mono">{res.year}</span>
                    </div>

                    {/* ================= STUDENT PROGRESS TRACKING BAR ================= */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2 mt-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-600' : 'text-[#C5A059]'}`} />
                          <span className="font-bold text-slate-700 text-[11px]">
                            {isCompleted ? 'Finished Treatise' : isReading ? 'Study Progress' : 'Not Started'}
                          </span>
                        </div>

                        <span className="font-mono font-bold text-xs text-[#002366]">
                          {progress.progressPercent}%
                        </span>
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden relative">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isCompleted
                              ? 'bg-emerald-500'
                              : progress.progressPercent > 50
                              ? 'bg-gradient-to-r from-[#002366] via-blue-700 to-[#C5A059]'
                              : progress.progressPercent > 0
                              ? 'bg-[#002366]'
                              : 'bg-transparent'
                          }`}
                          style={{ width: `${progress.progressPercent}%` }}
                        />
                      </div>

                      {/* Progress Subtext & Quick Action Controls */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                        <span className="font-mono">
                          {res.format === 'Audio Lecture'
                            ? `${Math.round((progress.progressPercent / 100) * parseInt(res.pagesOrDuration))} of ${res.pagesOrDuration}`
                            : `Page ${progress.currentPage} of ${progress.totalPages}`}
                        </span>

                        <div className="flex items-center gap-1">
                          {isCompleted ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateResourceProgress(res.id, { progressPercent: 0, currentPage: 0, status: 'not_started' }, res.pagesOrDuration);
                              }}
                              className="text-slate-400 hover:text-slate-600 text-[10px] underline"
                            >
                              Reset
                            </button>
                          ) : isReading ? (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const jump = Math.min(progress.totalPages, progress.currentPage + 20);
                                  updateResourceProgress(res.id, { currentPage: jump }, res.pagesOrDuration);
                                }}
                                className="px-1.5 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[10px] transition-colors"
                                title="Add 20 pages read"
                              >
                                +20p
                              </button>
                              <button
                                onClick={(e) => handleMarkAsComplete(res.id, res.pagesOrDuration, e)}
                                className="px-1.5 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[10px] transition-colors"
                                title="Mark as finished"
                              >
                                ✓ Finish
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={(e) => handleStartReading(res, e)}
                              className="px-2 py-0.5 rounded bg-[#002366] text-[#C5A059] hover:bg-[#001438] font-bold text-[10px] flex items-center gap-1 shadow-2xs transition-colors"
                            >
                              <Play className="w-2.5 h-2.5 fill-current" />
                              <span>Start Reading</span>
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="px-5 sm:px-6 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400 text-[11px]">
                      {progress.lastReadDate !== 'Not started' ? `Last active: ${progress.lastReadDate}` : 'Academic Repository'}
                    </span>
                    <span className="text-[#002366] group-hover:text-[#C5A059] flex items-center gap-1 transition-colors">
                      <span>{isReading ? 'Resume Study' : 'Open Reader'}</span>
                      <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#002366]/5 text-[#002366] flex items-center justify-center mx-auto">
              <Search className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-serif text-[#002366]">No Resources Found</h3>
              <p className="text-xs text-slate-500">
                No theological texts or lectures matched your search query{' '}
                <strong className="text-slate-800 font-mono">"{searchQuery}"</strong> in field{' '}
                <strong className="text-slate-800">"{searchField}"</strong>.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-[#002366] text-[#C5A059] text-xs font-bold shadow-sm hover:bg-[#001A4D] transition-colors"
              >
                Reset All Filters & View Full Catalog
              </button>
            </div>
          </div>
        )}

        {/* ================= READER & DOCUMENT DETAIL MODAL WITH INTERACTIVE PROGRESS ================= */}
        {selectedResource && (() => {
          const resProgress = getProgress(selectedResource.id, selectedResource.pagesOrDuration);
          return (
            <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
              <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto border-2 border-[#002366]/20">
                
                {/* Modal Top Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#002366] text-[#C5A059]">
                        {selectedResource.category}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {selectedResource.format}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {selectedResource.year}
                      </span>
                      {resProgress.status === 'completed' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Read Completed
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#002366] mt-1 leading-snug">
                      {selectedResource.title}
                    </h3>

                    <div className="text-xs text-[#C5A059] font-bold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Author: {selectedResource.author}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedResource(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="Close reader"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Control Center in Modal */}
                <div className="p-4 bg-gradient-to-br from-[#002366]/5 via-white to-slate-50 rounded-xl border-2 border-[#002366]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#C5A059]" />
                      <span className="font-bold text-xs text-[#002366] uppercase tracking-wider">
                        My Student Reading Tracker
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookmark(selectedResource.id, selectedResource.pagesOrDuration)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          resProgress.isBookmarked
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${resProgress.isBookmarked ? 'fill-current text-[#C5A059]' : ''}`} />
                        <span>{resProgress.isBookmarked ? 'Saved in Study List' : 'Bookmark'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar & Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Progress Status: <strong className="text-[#002366]">{resProgress.progressPercent}%</strong></span>
                      <span className="text-slate-500 font-mono">
                        {resProgress.currentPage} / {resProgress.totalPages} {selectedResource.format === 'Audio Lecture' ? 'minutes' : 'pages'}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max={resProgress.totalPages}
                      value={resProgress.currentPage}
                      onChange={(e) => {
                        const page = parseInt(e.target.value, 10);
                        updateResourceProgress(selectedResource.id, {
                          currentPage: page,
                          lastReadDate: 'Just updated'
                        }, selectedResource.pagesOrDuration);
                      }}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#002366]"
                    />

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>0% Not Started</span>
                      <span>50% Mid-Point</span>
                      <span>100% Completed</span>
                    </div>
                  </div>

                  {/* Quick Increment Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          const prev = Math.max(0, resProgress.currentPage - 25);
                          updateResourceProgress(selectedResource.id, { currentPage: prev }, selectedResource.pagesOrDuration);
                        }}
                        className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 text-[11px] font-bold hover:bg-slate-50"
                      >
                        -25p
                      </button>
                      <button
                        onClick={() => {
                          const next = Math.min(resProgress.totalPages, resProgress.currentPage + 25);
                          updateResourceProgress(selectedResource.id, { currentPage: next }, selectedResource.pagesOrDuration);
                        }}
                        className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 text-[11px] font-bold hover:bg-slate-50"
                      >
                        +25p
                      </button>
                      <button
                        onClick={() => {
                          const half = Math.round(resProgress.totalPages / 2);
                          updateResourceProgress(selectedResource.id, { currentPage: half }, selectedResource.pagesOrDuration);
                        }}
                        className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 text-[11px] font-bold hover:bg-slate-50"
                      >
                        50%
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {resProgress.progressPercent < 100 ? (
                        <button
                          onClick={() => handleMarkAsComplete(selectedResource.id, selectedResource.pagesOrDuration)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark as 100% Read</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => updateResourceProgress(selectedResource.id, { progressPercent: 0, currentPage: 0, status: 'not_started' }, selectedResource.pagesOrDuration)}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold"
                        >
                          Reset Progress
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Content Sections */}
                <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                  
                  {/* Abstract Card */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="font-bold text-[#002366] uppercase text-[10px] tracking-wider">
                      Executive Theological Abstract
                    </div>
                    <p className="text-slate-800 leading-relaxed">{selectedResource.description}</p>
                    <p className="text-slate-500 text-[11px]">
                      This treatise is archived in the Breakthrough International Bible University Digital Repository for enrolled students, faculty, and accredited research fellows.
                    </p>
                  </div>

                  {/* Exegetical Excerpt */}
                  <div className="p-4 bg-[#F0F4FF] rounded-xl border border-[#002366]/20 space-y-2">
                    <div className="font-bold text-[#002366] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#C5A059]" />
                      <span>Sample Exegetical Excerpt & Theological Citation</span>
                    </div>
                    <p className="italic text-slate-700 leading-relaxed font-serif">
                      "The faithful interpreter must ever maintain that divine revelation does not operate contrary to genuine grammatical structure. The inspiration of the Holy Spirit illuminated the human instruments to author texts containing definitive propositional truth..."
                    </p>
                  </div>

                  {/* Quick Discovery Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-[11px] font-bold text-slate-400">Filter library by:</span>
                    <button
                      onClick={() => {
                        setSelectedAuthor(selectedResource.author);
                        setSelectedResource(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#002366] hover:text-[#C5A059] text-[11px] font-bold text-slate-700 transition-colors"
                    >
                      More works by {selectedResource.author}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategory(selectedResource.category);
                        setSelectedResource(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#002366] hover:text-[#C5A059] text-[11px] font-bold text-slate-700 transition-colors"
                    >
                      All in {selectedResource.category}
                    </button>
                  </div>

                </div>

                {/* Modal Footer Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs font-mono text-slate-500">
                    {selectedResource.pagesOrDuration} • Certified Academic Repository PDF
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedResource(null)}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                    >
                      Close
                    </button>

                    <button
                      onClick={() => handleDownload(selectedResource)}
                      className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-[#C5A059] text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors"
                    >
                      {downloadSuccess === selectedResource.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Downloaded!</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Resource</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
};
