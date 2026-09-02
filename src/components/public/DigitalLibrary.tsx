import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Library,
  Search,
  BookOpen,
  Download,
  FileText,
  Headphones,
  Video,
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
  Sliders,
  Radio,
  Tv,
  MessageSquare
} from 'lucide-react';
import {
  LibraryResource,
  AcademicLevel,
  LibraryResourceType,
  LibraryCollectionCategory,
  UserMediaBookmark,
  UserMediaNote,
  UnifiedLearningProgress
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
import { BibAudioPlayerModal } from '../library/BibAudioPlayerModal';
import { BibVideoPlayerModal } from '../library/BibVideoPlayerModal';
import { ScriptureMultimediaModal } from '../library/ScriptureMultimediaModal';
import { MyLibraryHub } from '../library/MyLibraryHub';
import { FacultyMediaStudio } from '../library/FacultyMediaStudio';
import { MediaLibraryAnalytics } from '../library/MediaLibraryAnalytics';

type SearchField = 'all' | 'title' | 'author' | 'subject' | 'scripture' | 'keyword' | 'language' | 'format';
type SortOption = 'featured' | 'popular' | 'newest' | 'title_asc' | 'author_asc';
type ReadingStatusFilter = 'all' | 'reading' | 'completed' | 'not_started' | 'bookmarked';

export type MainNavFilter =
  | 'all'
  | 'ebooks'
  | 'audiobooks'
  | 'audiocourses'
  | 'videobooks'
  | 'videocourses'
  | 'treatises'
  | 'research'
  | 'commentaries'
  | 'languages'
  | 'history'
  | 'protocols'
  | 'journals'
  | 'faculty'
  | 'mylibrary'
  | 'facultystudio'
  | 'analytics'
  | 'assignments'
  | 'admin';

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
const BOOKMARKS_STORAGE_KEY = 'bibu_library_user_bookmarks';
const NOTES_STORAGE_KEY = 'bibu_library_user_notes';

export const DigitalLibrary: React.FC = () => {
  const { libraryResources, currentUser, addLibraryResource, updateLibraryResource, deleteLibraryResource } = useApp();

  // Combined master catalog
  const allResources = useMemo(() => {
    const map = new Map<string, LibraryResource>();
    COMPREHENSIVE_LIBRARY_RESOURCES.forEach((r) => map.set(r.id, r));
    if (libraryResources && libraryResources.length > 0) {
      libraryResources.forEach((r) => map.set(r.id, r));
    }
    return Array.from(map.values());
  }, [libraryResources]);

  // Reading / Learning progress state
  const [readingProgress, setReadingProgress] = useState<Record<string, any>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      'lib-res-media-001': {
        resourceId: 'lib-res-media-001',
        mediaFormat: 'video_course',
        progressPercent: 65,
        secondsWatched: 7605,
        totalVideoDuration: 11700,
        lastTimestamp: 1335,
        lastFormattedTimestamp: '22:15',
        lastSessionDate: 'Today, 10:30 AM',
        status: 'reading',
        isCompleted: false
      },
      'lib-res-media-002': {
        resourceId: 'lib-res-media-002',
        mediaFormat: 'audio_course',
        progressPercent: 42,
        secondsListened: 6804,
        lastFormattedTimestamp: '24:18',
        lastSessionDate: 'Yesterday, 4:15 PM',
        status: 'reading',
        isCompleted: false
      },
      'lib-res-001': {
        resourceId: 'lib-res-001',
        progressPercent: 78,
        currentPage: 182,
        totalPages: 280,
        lastReadDate: 'Today, 10:30 AM',
        status: 'reading',
        isBookmarked: true,
        notesCount: 5
      }
    };
  });

  // User multimedia bookmarks
  const [userBookmarks, setUserBookmarks] = useState<UserMediaBookmark[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'bm-1',
        resourceId: 'lib-res-media-001',
        resourceTitle: 'Mastering New Testament Exegesis & Pauline Greek Syntax',
        resourceType: 'Video Course',
        mediaFormat: 'video',
        timestampSeconds: 150,
        formattedTimestamp: '02:30',
        chapterOrLessonTitle: 'Lesson 1: What is Exegesis?',
        label: 'Crucial distinction of katakrima (Romans 8:1)',
        createdAt: 'Aug 28, 2026'
      },
      {
        id: 'bm-2',
        resourceId: 'lib-res-media-002',
        resourceTitle: 'Systematic Theology Audio Masterclass',
        resourceType: 'Audio Course',
        mediaFormat: 'audio',
        timestampSeconds: 90,
        formattedTimestamp: '01:30',
        chapterOrLessonTitle: 'Chapter 1: Epistemological Necessity',
        label: 'Propositional Revelation in Hebrews 1:1-2',
        createdAt: 'Aug 26, 2026'
      },
      {
        id: 'bm-3',
        resourceId: 'lib-res-003',
        resourceTitle: 'An Exegetical & Theological Commentary on Romans 1–8',
        resourceType: 'Exegetical Commentary',
        mediaFormat: 'ebook',
        pageNumber: 115,
        label: 'Hilasterion in Romans 3:25 - Propitiation Analysis',
        createdAt: 'Aug 24, 2026'
      }
    ];
  });

  // User multimedia timestamp notes
  const [userNotes, setUserNotes] = useState<UserMediaNote[]>(() => {
    try {
      const saved = localStorage.getItem(NOTES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'note-1',
        resourceId: 'lib-res-media-001',
        resourceTitle: 'Mastering New Testament Exegesis & Pauline Greek Syntax',
        mediaFormat: 'video',
        timestampSeconds: 85,
        formattedTimestamp: '01:25',
        chapterOrLessonTitle: 'Lesson 1: What is Exegesis?',
        noteContent: 'Exēgeomai (lead out) vs Eisēgeomai (read in). We stand under the authoritative Word of God.',
        createdAt: 'Today, 11:15 AM'
      },
      {
        id: 'note-2',
        resourceId: 'lib-res-media-002',
        resourceTitle: 'Systematic Theology Audio Masterclass',
        mediaFormat: 'audio',
        timestampSeconds: 120,
        formattedTimestamp: '02:00',
        chapterOrLessonTitle: 'Chapter 2: Theology Proper',
        noteContent: 'Nicene-Constantinopolitan definition: One ousia in three hypostaseis.',
        createdAt: 'Aug 27, 2026'
      }
    ];
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readingProgress));
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(userBookmarks));
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(userNotes));
    } catch {
      // ignore
    }
  }, [readingProgress, userBookmarks, userNotes]);

  // Main navigation tab
  const [activeMainNav, setActiveMainNav] = useState<MainNavFilter>('all');
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

  // Modals state
  const [activeReaderResource, setActiveReaderResource] = useState<LibraryResource | null>(null);
  const [activeAudioResource, setActiveAudioResource] = useState<LibraryResource | null>(null);
  const [activeVideoResource, setActiveVideoResource] = useState<LibraryResource | null>(null);
  const [isScriptureHubOpen, setIsScriptureHubOpen] = useState<boolean>(false);
  const [isWordStudyOpen, setIsWordStudyOpen] = useState(false);
  const [selectedStrongs, setSelectedStrongs] = useState<string | undefined>(undefined);
  const [isProtocolViewerOpen, setIsProtocolViewerOpen] = useState(false);
  const [selectedProtocolId, setSelectedProtocolId] = useState<string | undefined>(undefined);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);

  // Helper handlers
  const handleOpenResource = (
    resource: LibraryResource,
    preferredAction?: 'read' | 'audio' | 'video',
    timestampOrPage?: number
  ) => {
    if (preferredAction === 'video' || resource.format === 'Video Course' || resource.format === 'Video Book') {
      setActiveVideoResource(resource);
      setActiveAudioResource(null);
      setActiveReaderResource(null);
    } else if (preferredAction === 'audio' || resource.format === 'Audio Course' || resource.format === 'Audio Book' || resource.format === 'Audio Lecture') {
      setActiveAudioResource(resource);
      setActiveVideoResource(null);
      setActiveReaderResource(null);
    } else {
      setActiveReaderResource(resource);
      setActiveAudioResource(null);
      setActiveVideoResource(null);
    }
  };

  const handleAddNote = (note: Omit<UserMediaNote, 'id' | 'createdAt'>) => {
    const newNote: UserMediaNote = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: 'Just now'
    };
    setUserNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (noteId: string) => {
    setUserNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const handleToggleBookmark = (bm: Omit<UserMediaBookmark, 'id' | 'createdAt'>) => {
    setUserBookmarks((prev) => {
      const exists = prev.some((b) => b.resourceId === bm.resourceId && b.formattedTimestamp === bm.formattedTimestamp);
      if (exists) {
        return prev.filter((b) => !(b.resourceId === bm.resourceId && b.formattedTimestamp === bm.formattedTimestamp));
      }
      return [
        {
          ...bm,
          id: `bm-${Date.now()}`,
          createdAt: 'Just now'
        },
        ...prev
      ];
    });
  };

  const handleDeleteBookmark = (bmId: string) => {
    setUserBookmarks((prev) => prev.filter((b) => b.id !== bmId));
  };

  const handleSaveProgress = (progress: Partial<UnifiedLearningProgress>) => {
    if (!progress.resourceId) return;
    setReadingProgress((prev) => ({
      ...prev,
      [progress.resourceId!]: {
        ...(prev[progress.resourceId!] || {}),
        ...progress
      }
    }));
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

  // Filter and sort catalog based on main navigation & search
  const filteredResources = useMemo(() => {
    return allResources
      .filter((res) => {
        // Main Navigation Filter
        if (activeMainNav === 'ebooks') {
          if (res.format !== 'PDF' && res.format !== 'Book Excerpt' && res.resourceType !== 'E-Book / Monograph') return false;
        } else if (activeMainNav === 'audiobooks') {
          if (res.format !== 'Audio Book' && res.resourceType !== 'Audio Book') return false;
        } else if (activeMainNav === 'audiocourses') {
          if (res.format !== 'Audio Course' && res.resourceType !== 'Audio Course') return false;
        } else if (activeMainNav === 'videobooks') {
          if (res.format !== 'Video Book' && res.resourceType !== 'Video Book') return false;
        } else if (activeMainNav === 'videocourses') {
          if (res.format !== 'Video Course' && res.resourceType !== 'Video Course') return false;
        } else if (activeMainNav === 'treatises') {
          if (res.resourceType !== 'Systematic Treatise') return false;
        } else if (activeMainNav === 'research') {
          if (res.resourceType !== 'Theses & Dissertations' && res.resourceType !== 'Academic Journal Article' && res.category !== 'Research') return false;
        } else if (activeMainNav === 'commentaries') {
          if (res.resourceType !== 'Exegetical Commentary' && res.collectionCategory !== 'Exegetical Commentaries') return false;
        } else if (activeMainNav === 'languages') {
          if (res.category !== 'Biblical Languages' && res.collectionCategory !== 'Greek & Hebrew Research') return false;
        } else if (activeMainNav === 'history') {
          if (res.category !== 'Church History' && res.collectionCategory !== 'Religion & Church History') return false;
        } else if (activeMainNav === 'protocols') {
          if (res.category !== 'Pastoral Protocols' && res.collectionCategory !== 'Pastoral Protocols') return false;
        } else if (activeMainNav === 'journals') {
          if (res.resourceType !== 'Academic Journal Article') return false;
        } else if (activeMainNav === 'faculty') {
          if (res.resourceType !== 'Faculty Publication' && res.licenseClassification !== 'Faculty-created') return false;
        }

        // Secondary Collection Filter
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
        if (searchField === 'format') {
          return (res.format && res.format.toLowerCase().includes(q)) || (res.resourceType && res.resourceType.toLowerCase().includes(q));
        }

        // 'all' search
        const matchTitle = res.title.toLowerCase().includes(q);
        const matchAuthor = res.author.toLowerCase().includes(q);
        const matchDesc = res.description.toLowerCase().includes(q);
        const matchAbstract = res.abstract && res.abstract.toLowerCase().includes(q);
        const matchKeywords = res.keywords && res.keywords.some((k) => k.toLowerCase().includes(q));
        const matchScripture = res.scriptureReferences && res.scriptureReferences.some((s) => s.toLowerCase().includes(q));
        const matchCategory = res.category.toLowerCase().includes(q);
        const matchFormat = res.format && res.format.toLowerCase().includes(q);

        return matchTitle || matchAuthor || matchDesc || matchAbstract || matchKeywords || matchScripture || matchCategory || matchFormat;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        if (sortBy === 'newest') return b.year - a.year;
        if (sortBy === 'title_asc') return a.title.localeCompare(b.title);
        if (sortBy === 'author_asc') return a.author.localeCompare(b.author);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [
    allResources,
    activeMainNav,
    selectedCollection,
    selectedCategory,
    selectedAcademicLevel,
    selectedLanguage,
    selectedResourceType,
    searchQuery,
    searchField,
    sortBy
  ]);

  // Main Navigation Items List
  const navItems: { id: MainNavFilter; label: string; icon: any; count?: number }[] = [
    { id: 'all', label: 'All Resources', icon: Layers, count: allResources.length },
    { id: 'ebooks', label: 'E-Books', icon: BookOpen, count: allResources.filter((r) => r.format === 'PDF' || r.format === 'Book Excerpt' || r.resourceType === 'E-Book / Monograph').length },
    { id: 'audiobooks', label: 'Audio Books', icon: Headphones, count: allResources.filter((r) => r.format === 'Audio Book' || r.resourceType === 'Audio Book').length },
    { id: 'audiocourses', label: 'Audio Courses', icon: Radio, count: allResources.filter((r) => r.format === 'Audio Course' || r.resourceType === 'Audio Course').length },
    { id: 'videobooks', label: 'Video Books', icon: Tv, count: allResources.filter((r) => r.format === 'Video Book' || r.resourceType === 'Video Book').length },
    { id: 'videocourses', label: 'Video Courses', icon: Video, count: allResources.filter((r) => r.format === 'Video Course' || r.resourceType === 'Video Course').length },
    { id: 'commentaries', label: 'Exegetical Commentaries', icon: BookMarked },
    { id: 'treatises', label: 'Academic Treatises', icon: FileText },
    { id: 'research', label: 'Research Papers', icon: GraduationCap },
    { id: 'languages', label: 'Greek & Hebrew', icon: Languages },
    { id: 'history', label: 'Church History', icon: Clock },
    { id: 'protocols', label: 'Pastoral Protocols', icon: ShieldCheck },
    { id: 'faculty', label: 'Faculty Publications', icon: Award },
    { id: 'mylibrary', label: 'My Library Hub', icon: User, count: userBookmarks.length + userNotes.length }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      
      {/* 1. HERO & INSTITUTIONAL BRANDING HEADER */}
      <div className="bg-[#002366] text-white border-b-4 border-[#C5A059] relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10 space-y-6">
          
          {/* Top Tag & Identity */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#001438] text-[#C5A059] border border-[#C5A059]/40 font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <Library className="w-3.5 h-3.5" />
                <span>Phoenix, Arizona, USA</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-mono font-medium hidden sm:inline">
                Four Content Formats: E-Books • Audio • Video • Research
              </span>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsScriptureHubOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#001438] hover:bg-[#001A4D] text-[#C5A059] border border-[#C5A059]/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Scripture Media Explorer</span>
              </button>

              <button
                onClick={() => setIsWordStudyOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#001438] hover:bg-[#001A4D] text-[#C5A059] border border-[#C5A059]/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>Greek & Hebrew Lexicons</span>
              </button>

              <button
                onClick={() => setIsProtocolViewerOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#001438] hover:bg-[#001A4D] text-[#C5A059] border border-[#C5A059]/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pastoral SOPs</span>
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
              BIBU DIGITAL THEOLOGICAL LIBRARY & MEDIA CENTRE
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm sm:text-lg font-serif italic text-[#C5A059] tracking-wide font-bold">
                Read • Listen • Watch • Research • Learn
              </span>
              <span className="text-xs text-slate-300 hidden md:inline font-mono">
                | "Equipping God's People Through Biblical Scholarship, Technology and Ministry."
              </span>
            </div>
          </div>

          {/* 2. UNIVERSITY MULTIMEDIA NAVIGATION BAR */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-2 border-t border-white/15 scrollbar-thin">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeMainNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'languages') {
                      setIsWordStudyOpen(true);
                    } else if (item.id === 'protocols') {
                      setIsProtocolViewerOpen(true);
                    } else {
                      setActiveMainNav(item.id);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#C5A059] text-[#002366] shadow-md ring-2 ring-white/20'
                      : 'bg-[#001438] text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isSelected ? 'bg-[#002366] text-[#C5A059]' : 'bg-white/10 text-slate-300'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Faculty & Admin Specific Tabs */}
            {(currentUser.role === 'faculty' || currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
              <>
                <button
                  onClick={() => setActiveMainNav('facultystudio')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    activeMainNav === 'facultystudio'
                      ? 'bg-[#C5A059] text-[#002366] shadow-md'
                      : 'bg-purple-950/80 text-purple-200 border border-purple-600/40 hover:bg-purple-900'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Faculty Studio & Alerts</span>
                </button>

                <button
                  onClick={() => setActiveMainNav('analytics')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    activeMainNav === 'analytics'
                      ? 'bg-[#C5A059] text-[#002366] shadow-md'
                      : 'bg-emerald-950/80 text-emerald-200 border border-emerald-600/40 hover:bg-emerald-900'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Media Analytics</span>
                </button>

                <button
                  onClick={() => setActiveMainNav('assignments')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    activeMainNav === 'assignments'
                      ? 'bg-[#C5A059] text-[#002366] shadow-md'
                      : 'bg-[#001438] text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Course Syllabi</span>
                </button>
              </>
            )}

            {(currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
              <button
                onClick={() => setActiveMainNav('admin')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeMainNav === 'admin'
                    ? 'bg-[#C5A059] text-[#002366] shadow-md'
                    : 'bg-[#001438] text-slate-200 hover:bg-white/10'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Catalog Admin</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 3. MAIN WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* SUB-VIEW 1: MY LIBRARY HUB */}
        {activeMainNav === 'mylibrary' && (
          <MyLibraryHub
            resources={allResources}
            readingProgress={readingProgress}
            userBookmarks={userBookmarks}
            userNotes={userNotes}
            onOpenResource={handleOpenResource}
            onDeleteBookmark={handleDeleteBookmark}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {/* SUB-VIEW 2: FACULTY MEDIA STUDIO */}
        {activeMainNav === 'facultystudio' && (
          <FacultyMediaStudio
            resources={allResources}
            onAddResource={addLibraryResource}
          />
        )}

        {/* SUB-VIEW 3: MEDIA ANALYTICS */}
        {activeMainNav === 'analytics' && (
          <MediaLibraryAnalytics
            resources={allResources}
          />
        )}

        {/* SUB-VIEW 4: COURSE SYLLABI ASSIGNMENTS */}
        {activeMainNav === 'assignments' && (
          <FacultyAssignmentManager resources={allResources} />
        )}

        {/* SUB-VIEW 5: ADMIN CATALOG MANAGER */}
        {activeMainNav === 'admin' && (
          <AdminLibraryManager
            resources={allResources}
            onAddResource={addLibraryResource}
            onUpdateResource={updateLibraryResource}
            onDeleteResource={deleteLibraryResource}
          />
        )}

        {/* DEFAULT CATALOG & MULTIMEDIA VIEWS */}
        {activeMainNav !== 'mylibrary' &&
          activeMainNav !== 'facultystudio' &&
          activeMainNav !== 'analytics' &&
          activeMainNav !== 'assignments' &&
          activeMainNav !== 'admin' && (
            <>
              
              {/* LARGE MULTI-CRITERIA SEARCH BAR */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                
                <div className="flex flex-col md:flex-row items-stretch gap-2">
                  
                  {/* Search Scope */}
                  <div className="w-full md:w-56 shrink-0">
                    <select
                      value={searchField}
                      onChange={(e) => setSearchField(e.target.value as SearchField)}
                      className="w-full h-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    >
                      <option value="all">🔍 Search Everything</option>
                      <option value="title">📖 Search by Title</option>
                      <option value="author">✍️ Search by Author</option>
                      <option value="subject">🏛️ Search by Subject</option>
                      <option value="scripture">📜 Search Scripture (Romans 8)</option>
                      <option value="format">🎥 Search Format (Audio/Video/E-Book)</option>
                      <option value="keyword">🏷️ Search by Keyword</option>
                      <option value="language">🔤 Search by Language</option>
                    </select>
                  </div>

                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search 50,000+ E-Books, Audio, Video, Commentaries, Greek/Hebrew Lexicons, & Pastoral Protocols..."
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#002366] bg-slate-50/80 font-medium"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Sort Selector */}
                  <div className="w-full md:w-48 shrink-0">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="w-full h-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    >
                      <option value="featured">✨ Featured & Recommended</option>
                      <option value="popular">🔥 Most Viewed / Listened</option>
                      <option value="newest">📅 Recently Added</option>
                      <option value="title_asc">🔤 Title (A–Z)</option>
                      <option value="author_asc">👤 Author (A–Z)</option>
                    </select>
                  </div>

                  {/* Filter Toggle */}
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

                {/* ADVANCED FILTER DRAWER */}
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
                      <label className="font-bold text-slate-700 block mb-1">Resource Type / Format</label>
                      <select
                        value={selectedResourceType}
                        onChange={(e) => setSelectedResourceType(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="All">All Formats & Types</option>
                        <option value="Video Course">Video Course</option>
                        <option value="Audio Course">Audio Course</option>
                        <option value="Video Book">Video Book</option>
                        <option value="Audio Book">Audio Book</option>
                        <option value="Exegetical Commentary">Exegetical Commentary</option>
                        <option value="Systematic Treatise">Systematic Treatise</option>
                        <option value="Grammar & Syntax Manual">Grammar & Syntax Manual</option>
                        <option value="Pastoral Protocol">Pastoral Protocol</option>
                        <option value="Theses & Dissertations">Theses & Dissertations</option>
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
                        <option value="Greek">Koine Greek</option>
                        <option value="Hebrew">Biblical Hebrew</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Disciplinary Collection</label>
                      <select
                        value={selectedCollection}
                        onChange={(e) => setSelectedCollection(e.target.value as LibraryCollectionCategory)}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="All">All Disciplinary Collections</option>
                        <option value="Bible Studies">Bible Studies & Hermeneutics</option>
                        <option value="Exegetical Commentaries">Exegetical Commentaries</option>
                        <option value="Greek & Hebrew Research">Greek & Hebrew Languages</option>
                        <option value="Religion & Church History">Religion & Church History</option>
                        <option value="Pastoral Ministry">Pastoral Ministry</option>
                        <option value="Pastoral Protocols">Pastoral Protocols & SOPs</option>
                        <option value="Academic Research & Theses">Theses & Dissertations</option>
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

              {/* RESOURCE CARDS GRID */}
              <div className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-[#002366] capitalize">
                      {activeMainNav === 'all'
                        ? selectedCollection === 'All'
                          ? 'All Multimedia Resources'
                          : selectedCollection
                        : navItems.find((n) => n.id === activeMainNav)?.label || 'Resources'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Showing {filteredResources.length} peer-reviewed e-books, audio courses, video lectures, and commentaries
                    </p>
                  </div>

                  <div className="text-xs font-mono text-slate-400">
                    BIBU Repository v4.5
                  </div>
                </div>

                {filteredResources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredResources.map((resource) => {
                      const isAudio = resource.format === 'Audio Book' || resource.format === 'Audio Course' || resource.resourceType === 'Audio Book' || resource.resourceType === 'Audio Course';
                      const isVideo = resource.format === 'Video Book' || resource.format === 'Video Course' || resource.resourceType === 'Video Book' || resource.resourceType === 'Video Course';
                      const isCopied = copiedCitationId === resource.id;

                      return (
                        <div
                          key={resource.id}
                          className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group hover:border-[#002366]/40"
                        >
                          
                          {/* Card Content */}
                          <div className="p-5 space-y-3">
                            
                            {/* Format badge & Level */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className={`px-2.5 py-0.5 rounded-md font-mono font-bold text-[10px] flex items-center gap-1 ${
                                  isVideo
                                    ? 'bg-rose-100 text-rose-800'
                                    : isAudio
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'bg-[#002366] text-[#C5A059]'
                                }`}>
                                  {isVideo && <Video className="w-3 h-3" />}
                                  {isAudio && <Headphones className="w-3 h-3" />}
                                  {!isVideo && !isAudio && <BookOpen className="w-3 h-3" />}
                                  <span>{resource.format || resource.resourceType}</span>
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
                                onClick={() =>
                                  handleToggleBookmark({
                                    resourceId: resource.id,
                                    resourceTitle: resource.title,
                                    resourceType: resource.resourceType || 'E-Book',
                                    mediaFormat: isVideo ? 'video' : isAudio ? 'audio' : 'ebook',
                                    label: `Bookmark - ${resource.title}`
                                  })
                                }
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                                title="Add to Bookmarks"
                              >
                                <Bookmark className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Title & Author */}
                            <div>
                              <h4
                                onClick={() => handleOpenResource(resource, isVideo ? 'video' : isAudio ? 'audio' : 'read')}
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

                            {/* Description */}
                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              {resource.abstract || resource.description}
                            </p>

                            {/* Scripture References */}
                            {resource.scriptureReferences && resource.scriptureReferences.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 pt-1">
                                <span className="text-[10px] text-slate-400 font-mono">Passages:</span>
                                {resource.scriptureReferences.slice(0, 3).map((v) => (
                                  <button
                                    key={v}
                                    onClick={() => {
                                      setIsScriptureHubOpen(true);
                                    }}
                                    className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-mono font-medium hover:bg-amber-100 cursor-pointer"
                                  >
                                    📖 {v}
                                  </button>
                                ))}
                              </div>
                            )}

                          </div>

                          {/* Action Footer */}
                          <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
                            <div className="flex items-center gap-2">
                              
                              {/* Primary Action Button */}
                              {isVideo ? (
                                <button
                                  onClick={() => setActiveVideoResource(resource)}
                                  className="flex-1 py-2 px-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                                >
                                  <Video className="w-3.5 h-3.5" />
                                  <span>Watch Video Course</span>
                                </button>
                              ) : isAudio ? (
                                <button
                                  onClick={() => setActiveAudioResource(resource)}
                                  className="flex-1 py-2 px-3 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-[#C5A059] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                                >
                                  <Headphones className="w-3.5 h-3.5" />
                                  <span>Listen Audio Course</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => setActiveReaderResource(resource)}
                                  className="flex-1 py-2 px-3 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-[#C5A059] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                                >
                                  <BookOpen className="w-3.5 h-3.5" />
                                  <span>Read Online</span>
                                </button>
                              )}

                              {/* Citation Button */}
                              <button
                                onClick={(e) => handleCopyCitation(resource, e)}
                                className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                                title="Copy Academic Citation (APA)"
                              >
                                {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                              </button>
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
                      No Multimedia Works Found
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try searching with broader terms or reset your filters.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveMainNav('all');
                        setSelectedCollection('All');
                        setSelectedAcademicLevel('All');
                        setSelectedLanguage('All');
                        setSelectedResourceType('All');
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
        onBookmarkToggle={(id) =>
          handleToggleBookmark({
            resourceId: id,
            resourceTitle: activeReaderResource?.title || 'Monograph',
            resourceType: activeReaderResource?.resourceType || 'E-Book',
            mediaFormat: 'ebook',
            label: `Bookmarked Page`
          })
        }
        isBookmarked={activeReaderResource ? userBookmarks.some((b) => b.resourceId === activeReaderResource.id) : false}
      />

      {/* 2. Interactive HTML5 Audio Player Modal (Sync Audio + Text) */}
      {activeAudioResource && (
        <BibAudioPlayerModal
          resource={activeAudioResource}
          onClose={() => setActiveAudioResource(null)}
          onSaveProgress={handleSaveProgress}
          userNotes={userNotes}
          userBookmarks={userBookmarks}
          onAddNote={handleAddNote}
          onToggleBookmark={handleToggleBookmark}
          onSwitchToReading={() => {
            const cur = activeAudioResource;
            setActiveAudioResource(null);
            setActiveReaderResource(cur);
          }}
          onSwitchToVideo={() => {
            const cur = activeAudioResource;
            setActiveAudioResource(null);
            setActiveVideoResource(cur);
          }}
        />
      )}

      {/* 3. Interactive HTML5 Video Player Modal (Transcripts, Chapters, Quizzes) */}
      {activeVideoResource && (
        <BibVideoPlayerModal
          resource={activeVideoResource}
          onClose={() => setActiveVideoResource(null)}
          onSaveProgress={handleSaveProgress}
          userNotes={userNotes}
          userBookmarks={userBookmarks}
          onAddNote={handleAddNote}
          onToggleBookmark={handleToggleBookmark}
          onSwitchToAudio={() => {
            const cur = activeVideoResource;
            setActiveVideoResource(null);
            setActiveAudioResource(cur);
          }}
          onSwitchToReading={() => {
            const cur = activeVideoResource;
            setActiveVideoResource(null);
            setActiveReaderResource(cur);
          }}
        />
      )}

      {/* 4. Scripture-Linked Multimedia Hub Modal */}
      {isScriptureHubOpen && (
        <ScriptureMultimediaModal
          resources={allResources}
          onClose={() => setIsScriptureHubOpen(false)}
          onOpenResource={(res, type) => {
            setIsScriptureHubOpen(false);
            handleOpenResource(res, type);
          }}
          onOpenWordStudy={(strongs) => {
            setIsScriptureHubOpen(false);
            setSelectedStrongs(strongs);
            setIsWordStudyOpen(true);
          }}
        />
      )}

      {/* 5. Greek & Hebrew Biblical Word Study Lexicon */}
      <BiblicalWordStudyModal
        isOpen={isWordStudyOpen}
        onClose={() => setIsWordStudyOpen(false)}
        initialStrongs={selectedStrongs}
        onSelectPassage={handleOpenWordStudyForPassage}
      />

      {/* 6. Institutional Pastoral Protocols Viewer */}
      <PastoralProtocolViewer
        isOpen={isProtocolViewerOpen}
        onClose={() => setIsProtocolViewerOpen(false)}
        initialProtocolId={selectedProtocolId}
      />

      {/* 7. AI Theological Research Assistant */}
      <TheologicalAiAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
      />

    </div>
  );
};
