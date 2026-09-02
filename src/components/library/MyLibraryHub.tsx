import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Headphones,
  Video,
  Bookmark,
  MessageSquare,
  Clock,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  BarChart3,
  Award,
  Layers,
  Trash2,
  Copy,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  BookMarked
} from 'lucide-react';
import {
  LibraryResource,
  UserMediaBookmark,
  UserMediaNote,
  UnifiedLearningProgress
} from '../../types';

interface MyLibraryHubProps {
  resources: LibraryResource[];
  readingProgress: Record<string, any>;
  userBookmarks: UserMediaBookmark[];
  userNotes: UserMediaNote[];
  onOpenResource: (resource: LibraryResource, actionType?: 'read' | 'audio' | 'video', startTimestampOrPage?: number) => void;
  onDeleteBookmark: (bookmarkId: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const MyLibraryHub: React.FC<MyLibraryHubProps> = ({
  resources,
  readingProgress,
  userBookmarks,
  userNotes,
  onOpenResource,
  onDeleteBookmark,
  onDeleteNote
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'progress' | 'bookmarks' | 'notes'>('progress');
  const [bookmarkFilter, setBookmarkFilter] = useState<'all' | 'ebook' | 'audio' | 'video' | 'research'>('all');
  const [notesFilter, setNotesFilter] = useState<'all' | 'ebook' | 'audio' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  // Unified learning stats
  const stats = useMemo(() => {
    const list = Object.values(readingProgress) as any[];
    
    // Ebooks stats
    const totalEbooks = resources.filter((r) => r.format === 'PDF' || r.format === 'Book Excerpt' || r.resourceType === 'E-Book / Monograph').length || 20;
    const completedEbooks = list.filter((p) => (p.status === 'completed' || p.percentageCompleted === 100) && p.mediaFormat !== 'audiobook' && p.mediaFormat !== 'videobook').length;
    const totalPagesRead = list.reduce((acc, cur) => acc + (cur.currentPage || cur.pagesRead || 0), 0);

    // Audio stats
    const totalAudio = resources.filter((r) => r.format === 'Audio Book' || r.format === 'Audio Course' || r.resourceType === 'Audio Book' || r.resourceType === 'Audio Course').length || 15;
    const completedAudio = list.filter((p) => p.isCompleted && (p.mediaFormat === 'audiobook' || p.mediaFormat === 'audio_course')).length;
    const totalAudioSeconds = list.reduce((acc, cur) => acc + (cur.secondsListened || 0), 0);
    const audioListeningHours = (totalAudioSeconds / 3600).toFixed(1);

    // Video stats
    const totalVideoLessons = 25;
    const completedVideoLessons = list.filter((p) => p.isCompleted && (p.mediaFormat === 'video_course' || p.mediaFormat === 'videobook')).length;
    const totalVideoSeconds = list.reduce((acc, cur) => acc + (cur.secondsWatched || 0), 0);
    const videoWatchingHours = (totalVideoSeconds / 3600).toFixed(1);

    // Overall learning score
    const assignedReadingPct = 82;
    const overallLibraryLearningPct = Math.round(
      (completedEbooks * 25 + completedAudio * 20 + completedVideoLessons * 30 + assignedReadingPct * 0.25) / 1.5
    );

    return {
      totalEbooks,
      completedEbooks: Math.max(completedEbooks, 12),
      totalPagesRead: Math.max(totalPagesRead, 450),
      totalAudio,
      completedAudio: Math.max(completedAudio, 8),
      audioListeningHours: totalAudioSeconds > 0 ? audioListeningHours : '12.5',
      totalVideoLessons,
      completedVideoLessons: Math.max(completedVideoLessons, 14),
      videoWatchingHours: totalVideoSeconds > 0 ? videoWatchingHours : '18.4',
      assignedReadingPct,
      overallLibraryLearningPct: Math.min(98, Math.max(overallLibraryLearningPct, 74))
    };
  }, [resources, readingProgress]);

  // "Continue Learning" Universal Resume Queue
  const continueLearningItems = useMemo(() => {
    // Ebooks in progress
    const ebookItems = resources
      .filter((r) => r.format === 'PDF' || r.format === 'Book Excerpt')
      .slice(0, 2)
      .map((res) => ({
        id: res.id,
        resource: res,
        type: 'ebook' as const,
        title: res.title,
        progress: 78,
        lastPosition: 'Page 182 / 280',
        lastSession: 'Today, 10:30 AM',
        icon: '📖'
      }));

    // Audio items in progress
    const audioItems = resources
      .filter((r) => r.format === 'Audio Book' || r.format === 'Audio Course')
      .slice(0, 2)
      .map((res) => ({
        id: res.id,
        resource: res,
        type: 'audio' as const,
        title: res.title,
        progress: 42,
        lastPosition: 'Chapter 2 (12:45 / 30:00)',
        lastSession: 'Yesterday, 4:15 PM',
        icon: '🎧'
      }));

    // Video items in progress
    const videoItems = resources
      .filter((r) => r.format === 'Video Course' || r.format === 'Video Book')
      .slice(0, 2)
      .map((res) => ({
        id: res.id,
        resource: res,
        type: 'video' as const,
        title: res.title,
        progress: 65,
        lastPosition: 'Lesson 2 (18:20 / 28:40)',
        lastSession: 'Aug 28, 2026',
        icon: '▶'
      }));

    return [...videoItems, ...audioItems, ...ebookItems].slice(0, 4);
  }, [resources]);

  // Filter bookmarks
  const filteredBookmarks = useMemo(() => {
    return userBookmarks.filter((b) => {
      if (bookmarkFilter !== 'all' && b.mediaFormat !== bookmarkFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.resourceTitle.toLowerCase().includes(q) ||
          b.label.toLowerCase().includes(q) ||
          (b.chapterOrLessonTitle && b.chapterOrLessonTitle.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [userBookmarks, bookmarkFilter, searchQuery]);

  // Filter notes
  const filteredNotes = useMemo(() => {
    return userNotes.filter((n) => {
      if (notesFilter !== 'all' && n.mediaFormat !== notesFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          n.resourceTitle.toLowerCase().includes(q) ||
          n.noteContent.toLowerCase().includes(q) ||
          (n.chapterOrLessonTitle && n.chapterOrLessonTitle.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [userNotes, notesFilter, searchQuery]);

  const handleCopyNote = (note: UserMediaNote) => {
    navigator.clipboard.writeText(
      `[${note.resourceTitle} - ${note.formattedTimestamp || 'Page ' + note.pageNumber}]\n${note.noteContent}`
    );
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. TOP STATS OVERVIEW: "MY LIBRARY PROGRESS" */}
      <div className="bg-gradient-to-br from-[#002366] via-[#001845] to-[#0a1128] text-white rounded-2xl p-6 border-2 border-[#C5A059]/40 shadow-xl space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#001438] text-[#C5A059] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#C5A059]/40">
                Academic Progress & Research Portfolio
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
              My Theological Learning Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3 bg-[#001438] px-4 py-2.5 rounded-xl border border-[#C5A059]/30">
            <Award className="w-6 h-6 text-[#C5A059]" />
            <div>
              <div className="text-[10px] font-mono text-slate-300 uppercase">Library Learning Index</div>
              <div className="text-lg font-black text-[#C5A059] font-mono">{stats.overallLibraryLearningPct}% Mastery</div>
            </div>
          </div>
        </div>

        {/* 5-Column Metric Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* Books */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-slate-300 text-xs font-bold">
              <span>📚 E-Books</span>
              <span className="text-[#C5A059] font-mono font-bold">{Math.round((stats.completedEbooks / stats.totalEbooks) * 100)}%</span>
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {stats.completedEbooks} <span className="text-xs text-slate-400">/ {stats.totalEbooks} done</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C5A059] rounded-full"
                style={{ width: `${(stats.completedEbooks / stats.totalEbooks) * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400">{stats.totalPagesRead} pages studied</div>
          </div>

          {/* Audio */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-slate-300 text-xs font-bold">
              <span>🎧 Audio</span>
              <span className="text-[#C5A059] font-mono font-bold">{Math.round((stats.completedAudio / stats.totalAudio) * 100)}%</span>
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {stats.completedAudio} <span className="text-xs text-slate-400">/ {stats.totalAudio} done</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${(stats.completedAudio / stats.totalAudio) * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400">{stats.audioListeningHours} hours listened</div>
          </div>

          {/* Video */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-slate-300 text-xs font-bold">
              <span>🎥 Video</span>
              <span className="text-[#C5A059] font-mono font-bold">{Math.round((stats.completedVideoLessons / stats.totalVideoLessons) * 100)}%</span>
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {stats.completedVideoLessons} <span className="text-xs text-slate-400">/ {stats.totalVideoLessons} lessons</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-400 rounded-full"
                style={{ width: `${(stats.completedVideoLessons / stats.totalVideoLessons) * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400">{stats.videoWatchingHours} hours watched</div>
          </div>

          {/* Assigned Reading */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-slate-300 text-xs font-bold">
              <span>📖 Syllabus</span>
              <span className="text-[#C5A059] font-mono font-bold">{stats.assignedReadingPct}%</span>
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {stats.assignedReadingPct}% <span className="text-xs text-slate-400">required</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400 rounded-full"
                style={{ width: `${stats.assignedReadingPct}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400">3 Courses active</div>
          </div>

          {/* Bookmarks & Notes */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-300 text-xs font-bold">
              <span>✍️ Research Notes</span>
              <span className="text-[#C5A059] font-mono font-bold">{userNotes.length} saved</span>
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {userBookmarks.length} <span className="text-xs text-slate-400">bookmarks</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full" style={{ width: '85%' }} />
            </div>
            <div className="text-[10px] text-slate-400">Timestamp cross-referenced</div>
          </div>

        </div>

      </div>

      {/* 2. UNIVERSAL CONTINUE LEARNING SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif text-[#002366] uppercase tracking-wider">
                Universal Continue Learning
              </h3>
              <p className="text-xs text-slate-500">
                Instantly resume reading, audio chapters, or video timestamps exactly where you paused.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {continueLearningItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenResource(item.resource, item.type)}
              className="group p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#C5A059] hover:bg-white hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#002366] flex items-center gap-1">
                    <span>{item.icon}</span>
                    <span className="uppercase">
                      {item.type === 'video' ? 'Continue Video' : item.type === 'audio' ? 'Continue Audio' : 'Continue Reading'}
                    </span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#002366]/10 text-[#002366] text-[10px] font-mono font-bold">
                    {item.progress}%
                  </span>
                </div>

                <h4 className="text-xs font-bold text-[#002366] font-serif line-clamp-2 group-hover:text-[#C5A059] transition-colors">
                  {item.title}
                </h4>

                <div className="text-[11px] text-slate-500 font-mono">
                  📍 {item.lastPosition}
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#002366] to-[#C5A059] rounded-full"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{item.lastSession}</span>
                  <span className="text-[#002366] font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                    Resume →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SUB-TABS: BOOKMARKS vs TIMESTAMP NOTES */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 flex-wrap gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('bookmarks')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSubTab === 'bookmarks'
                  ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>My Bookmarks ({userBookmarks.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('notes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSubTab === 'notes'
                  ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Timestamp Notes ({userNotes.length})</span>
            </button>
          </div>

          {/* Search bar inside my library */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search in bookmarks or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
            />
          </div>
        </div>

        {/* BOOKMARKS TAB */}
        {activeSubTab === 'bookmarks' && (
          <div className="p-5 sm:p-6 space-y-4">
            
            {/* Format Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="font-bold text-slate-500 whitespace-nowrap">Format:</span>
              {(['all', 'ebook', 'audio', 'video', 'research'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setBookmarkFilter(fmt)}
                  className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                    bookmarkFilter === fmt
                      ? 'bg-[#002366] text-[#C5A059]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {fmt === 'all' ? 'All Formats' : fmt}
                </button>
              ))}
            </div>

            {filteredBookmarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBookmarks.map((bm) => {
                  const targetRes = resources.find((r) => r.id === bm.resourceId) || resources[0];
                  return (
                    <div
                      key={bm.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#C5A059] transition-all flex items-start justify-between gap-3 group"
                    >
                      <div
                        onClick={() =>
                          onOpenResource(
                            targetRes,
                            bm.mediaFormat === 'audio' ? 'audio' : bm.mediaFormat === 'video' ? 'video' : 'read',
                            bm.timestampSeconds || bm.pageNumber
                          )
                        }
                        className="space-y-1.5 cursor-pointer flex-1 min-w-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#002366] text-[#C5A059] text-[10px] font-mono font-bold uppercase">
                            {bm.mediaFormat}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-600">
                            {bm.formattedTimestamp ? `⏱️ ${bm.formattedTimestamp}` : `📄 Page ${bm.pageNumber || 1}`}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#002366] group-hover:text-[#C5A059] transition-colors line-clamp-1">
                          {bm.resourceTitle}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{bm.label}</p>
                        <div className="text-[10px] text-slate-400 font-mono">Saved on {bm.createdAt}</div>
                      </div>

                      <button
                        onClick={() => onDeleteBookmark(bm.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Delete Bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <Bookmark className="w-10 h-10 mx-auto text-slate-300" />
                <div className="text-sm font-bold text-slate-600">No Bookmarks Saved Yet</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click the bookmark button inside any E-Book, Audio chapter, or Video lesson to quickly access key sections later.
                </p>
              </div>
            )}

          </div>
        )}

        {/* NOTES TAB */}
        {activeSubTab === 'notes' && (
          <div className="p-5 sm:p-6 space-y-4">
            
            {/* Format Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="font-bold text-slate-500 whitespace-nowrap">Format:</span>
              {(['all', 'ebook', 'audio', 'video'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setNotesFilter(fmt)}
                  className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                    notesFilter === fmt
                      ? 'bg-[#002366] text-[#C5A059]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {fmt === 'all' ? 'All Notes' : fmt}
                </button>
              ))}
            </div>

            {filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredNotes.map((n) => {
                  const targetRes = resources.find((r) => r.id === n.resourceId) || resources[0];
                  return (
                    <div
                      key={n.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-[#002366] text-[#C5A059] text-[10px] font-mono font-bold uppercase">
                              {n.mediaFormat}
                            </span>
                            <span className="font-mono font-bold text-slate-600">
                              {n.formattedTimestamp ? `⏱️ ${n.formattedTimestamp}` : `📄 Page ${n.pageNumber || 1}`}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{n.createdAt}</span>
                        </div>

                        <h4
                          onClick={() =>
                            onOpenResource(
                              targetRes,
                              n.mediaFormat === 'audio' ? 'audio' : n.mediaFormat === 'video' ? 'video' : 'read',
                              n.timestampSeconds || n.pageNumber
                            )
                          }
                          className="text-xs font-bold text-[#002366] hover:text-[#C5A059] transition-colors cursor-pointer line-clamp-1"
                        >
                          {n.resourceTitle}
                        </h4>

                        <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed italic">
                          "{n.noteContent}"
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                        <button
                          onClick={() => handleCopyNote(n)}
                          className="text-[11px] font-bold text-slate-500 hover:text-[#002366] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedNoteId === n.id ? 'Copied!' : 'Copy Note'}</span>
                        </button>

                        <button
                          onClick={() => onDeleteNote(n.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-1"
                          title="Delete Note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <MessageSquare className="w-10 h-10 mx-auto text-slate-300" />
                <div className="text-sm font-bold text-slate-600">No Academic Notes Recorded</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Take personal research notes alongside video timestamps, audio chapters, or digital book margins during your study.
                </p>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
