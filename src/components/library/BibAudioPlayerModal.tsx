import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Clock,
  Bookmark,
  BookmarkCheck,
  FileText,
  Download,
  ListMusic,
  Share2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Headphones,
  CheckCircle2,
  Sliders,
  X,
  MessageSquare,
  Search,
  Maximize2,
  Minimize2,
  Moon,
  Info,
  ShieldCheck
} from 'lucide-react';
import {
  LibraryResource,
  MediaChapter,
  AudioLesson,
  TranscriptItem,
  UserMediaBookmark,
  UserMediaNote,
  UnifiedLearningProgress
} from '../../types';

interface BibAudioPlayerModalProps {
  resource: LibraryResource;
  onClose: () => void;
  onSaveProgress?: (progress: Partial<UnifiedLearningProgress>) => void;
  initialChapterIndex?: number;
  initialTimestamp?: number;
  userNotes?: UserMediaNote[];
  userBookmarks?: UserMediaBookmark[];
  onAddNote?: (note: Omit<UserMediaNote, 'id' | 'createdAt'>) => void;
  onToggleBookmark?: (bookmark: Omit<UserMediaBookmark, 'id' | 'createdAt'>) => void;
}

export const BibAudioPlayerModal: React.FC<BibAudioPlayerModalProps> = ({
  resource,
  onClose,
  onSaveProgress,
  initialChapterIndex = 0,
  initialTimestamp = 0,
  userNotes = [],
  userBookmarks = [],
  onAddNote,
  onToggleBookmark
}) => {
  // Mode: standard audio player vs synchronized audio+text
  const [viewMode, setViewMode] = useState<'standard' | 'sync_text' | 'transcript'>('standard');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(initialTimestamp);
  const [duration, setDuration] = useState<number>(() => {
    if (resource.audioDurationSeconds) return resource.audioDurationSeconds;
    return 1845; // ~30 mins default
  });
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentChapterIdx, setCurrentChapterIdx] = useState<number>(initialChapterIndex);
  const [activeTab, setActiveTab] = useState<'chapters' | 'transcript' | 'notes' | 'sync'>('chapters');
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const [transcriptSearch, setTranscriptSearch] = useState<string>('');
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [noteSuccess, setNoteSuccess] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Audio synthesis & Timer ref
  const audioIntervalRef = useRef<number | null>(null);
  const sleepIntervalRef = useRef<number | null>(null);
  const syncContainerRef = useRef<HTMLDivElement | null>(null);

  // Chapters / Lessons fallback
  const chapters: MediaChapter[] = resource.audioChapters || [
    {
      id: 'ch-1',
      chapterNumber: 1,
      title: 'Chapter 1: The Epistemology of Divine Revelation',
      durationSeconds: 940,
      durationFormatted: '15:40',
      summary: 'Foundational doctrines on the nature of Scripture, divine inspiration, and historical horizon.',
      scriptureRefs: ['2 Timothy 3:16', '2 Peter 1:20-21']
    },
    {
      id: 'ch-2',
      chapterNumber: 2,
      title: 'Chapter 2: The Historical-Cultural Horizon of the Biblical Text',
      durationSeconds: 1120,
      durationFormatted: '18:40',
      summary: 'Understanding original covenant audience, ancient Near Eastern customs, and Greco-Roman ethos.',
      scriptureRefs: ['Nehemiah 8:8', 'Luke 24:27']
    },
    {
      id: 'ch-3',
      chapterNumber: 3,
      title: 'Chapter 3: Lexical Semantics & Word Study Fallacies',
      durationSeconds: 1280,
      durationFormatted: '21:20',
      summary: 'Avoiding root fallacies and illegitimate totality transfer in biblical exegesis.',
      scriptureRefs: ['Romans 8:1-4', 'John 1:1']
    },
    {
      id: 'ch-4',
      chapterNumber: 4,
      title: 'Chapter 4: Syntax and Discourse Analysis in Koine Greek',
      durationSeconds: 1450,
      durationFormatted: '24:10',
      summary: 'Structural analysis of Pauline epistles and clause relationships.',
      scriptureRefs: ['Ephesians 1:3-14', 'Colossians 1:15-20']
    }
  ];

  // Default transcript
  const transcripts: TranscriptItem[] = resource.transcript || [
    {
      id: 'tr-1',
      timestampSeconds: 0,
      formattedTimestamp: '00:00',
      speaker: 'Narrator (BIBU Faculty Audio Studio)',
      text: 'Welcome to the Breakthrough International Bible University Audio Library. We begin the official exposition.',
      paragraphId: 1
    },
    {
      id: 'tr-2',
      timestampSeconds: 18,
      formattedTimestamp: '00:18',
      speaker: 'Dr. Thomas E. Wright, Ph.D.',
      text: 'Section 1.1 — The Epistemology of Divine Revelation. Christian hermeneutics begins with the foundational confession that the Holy Scriptures are verbally inspired by God (theopneustos, 2 Tim 3:16).',
      scriptureRef: '2 Timothy 3:16',
      paragraphId: 1
    },
    {
      id: 'tr-3',
      timestampSeconds: 52,
      formattedTimestamp: '00:52',
      speaker: 'Dr. Thomas E. Wright, Ph.D.',
      text: 'Because God is truthful and eternal, His written Word communicates propositional, historical, and redemptive truth with absolute reliability and authority.',
      paragraphId: 2
    },
    {
      id: 'tr-4',
      timestampSeconds: 88,
      formattedTimestamp: '01:28',
      speaker: 'Dr. Thomas E. Wright, Ph.D.',
      text: 'Section 1.2 — The Exegetical Mandate. The interpreter’s solemn task is exegesis (exēgeomai—to draw out what the Spirit authored), never eisegesis (reading our contemporary biases into the holy text).',
      scriptureRef: '2 Peter 1:20-21',
      paragraphId: 2
    },
    {
      id: 'tr-5',
      timestampSeconds: 135,
      formattedTimestamp: '02:15',
      speaker: 'Dr. Thomas E. Wright, Ph.D.',
      text: 'A biblical text cannot mean what it never meant to the original author and original covenant community.',
      paragraphId: 3
    },
    {
      id: 'tr-6',
      timestampSeconds: 178,
      formattedTimestamp: '02:58',
      speaker: 'Dr. Thomas E. Wright, Ph.D.',
      text: 'Section 1.3 — The Analogy of Faith (Analogia Fidei). Because Scripture possesses one divine Author throughout 66 canonical books, it exhibits perfect systemic harmony.',
      paragraphId: 3
    }
  ];

  // Synchronized text paragraphs
  const syncParagraphs = resource.synchronizedParagraphs || [
    {
      id: 'sp-1',
      paragraphNumber: 1,
      heading: '1.1 The Nature of Sacred Scripture',
      audioStartSeconds: 0,
      audioEndSeconds: 50,
      text: 'Christian hermeneutics begins with the foundational confession that the Holy Scriptures of the Old and New Testaments are verbally inspired by God (theopneustos, 2 Tim. 3:16) and given through human authors who spoke from God as they were carried along by the Holy Spirit (2 Pet. 1:21). Because God is truthful, His written Word communicates propositional, historical, and redemptive truth with absolute reliability and authority.',
      scriptureRefs: ['2 Timothy 3:16', '2 Peter 1:21']
    },
    {
      id: 'sp-2',
      paragraphNumber: 2,
      heading: '1.2 The Exegetical Mandate & Authorial Intent',
      audioStartSeconds: 51,
      audioEndSeconds: 130,
      text: 'The interpreter\'s solemn task is exegesis (exēgeomai—to draw out what the Spirit authored), never eisegesis (reading our contemporary biases into the holy text). A text cannot mean what it never meant to the original author and original covenant community. Diligent grammatical inquiry, lexical study, and historical background analysis serve not to supplant the Spirit, but to humble our minds beneath the exact words given by divine inspiration.',
      scriptureRefs: ['Nehemiah 8:8']
    },
    {
      id: 'sp-3',
      paragraphNumber: 3,
      heading: '1.3 The Analogy of Faith (Analogia Fidei)',
      audioStartSeconds: 131,
      audioEndSeconds: 240,
      text: 'Because Scripture possesses one divine Author throughout 66 canonical books, it exhibits perfect systemic harmony. The clearer passages of Scripture must always illuminate and govern the interpretation of obscure or difficult passages. We interpret Scripture by Scripture.',
      scriptureRefs: ['Luke 24:27', 'Romans 12:6']
    },
    {
      id: 'sp-4',
      paragraphNumber: 4,
      heading: '1.4 Lexical Semantics & Syntactic Clarity',
      audioStartSeconds: 241,
      audioEndSeconds: 380,
      text: 'Words do not possess meaning in a vacuum; they acquire precise theological and propositional definition within their immediate syntactic sentence structure, paragraph context, and redemptive covenantal horizon. Exegetical integrity requires resisting the root fallacy.',
      scriptureRefs: ['2 Timothy 2:15']
    }
  ];

  const currentChapter = chapters[currentChapterIdx] || chapters[0];

  // Format time in mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    const s = Math.floor(secs);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const remainingS = s % 60;
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${remainingS < 10 ? '0' : ''}${remainingS}`;
    }
    return `${m < 10 ? '0' : ''}${m}:${remainingS < 10 ? '0' : ''}${remainingS}`;
  };

  // Playback timer simulation
  useEffect(() => {
    if (isPlaying) {
      audioIntervalRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1 * playbackSpeed;
          if (next >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return next;
        });
      }, 1000);
    } else {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    }
    return () => {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, duration]);

  // Sleep timer engine
  useEffect(() => {
    if (sleepTimerMinutes !== null && isPlaying) {
      setSleepTimerRemaining(sleepTimerMinutes * 60);
      sleepIntervalRef.current = window.setInterval(() => {
        setSleepTimerRemaining((prev) => {
          if (prev === null || prev <= 1) {
            setIsPlaying(false);
            setSleepTimerMinutes(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (sleepIntervalRef.current) {
        clearInterval(sleepIntervalRef.current);
      }
      setSleepTimerRemaining(null);
    }
    return () => {
      if (sleepIntervalRef.current) {
        clearInterval(sleepIntervalRef.current);
      }
    };
  }, [sleepTimerMinutes, isPlaying]);

  // Sync state back
  useEffect(() => {
    if (onSaveProgress) {
      const percentage = Math.min(100, Math.round((currentTime / (duration || 1)) * 100));
      onSaveProgress({
        resourceId: resource.id,
        mediaFormat: resource.format === 'Audio Course' ? 'audio_course' : 'audiobook',
        secondsListened: Math.floor(currentTime),
        totalAudioDuration: duration,
        currentChapterIndex: currentChapterIdx,
        currentChapterTitle: currentChapter.title,
        lastTimestamp: Math.floor(currentTime),
        lastFormattedTimestamp: formatTime(currentTime),
        percentageCompleted: percentage,
        isCompleted: percentage >= (resource.completionThresholdPercent || 90),
        lastSessionDate: 'Just now'
      });
    }
  }, [currentTime, currentChapterIdx]);

  // Jump to timestamp
  const seekTo = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(duration, seconds)));
  };

  const handleSkip = (deltaSeconds: number) => {
    setCurrentTime((prev) => Math.max(0, Math.min(duration, prev + deltaSeconds)));
  };

  const handleNextChapter = () => {
    if (currentChapterIdx < chapters.length - 1) {
      setCurrentChapterIdx((prev) => prev + 1);
      setCurrentTime(0);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIdx > 0) {
      setCurrentChapterIdx((prev) => prev - 1);
      setCurrentTime(0);
    }
  };

  const handleAddTimestampNote = () => {
    if (!newNoteText.trim()) return;
    if (onAddNote) {
      onAddNote({
        resourceId: resource.id,
        resourceTitle: resource.title,
        mediaFormat: 'audio',
        timestampSeconds: Math.floor(currentTime),
        formattedTimestamp: formatTime(currentTime),
        chapterOrLessonTitle: currentChapter.title,
        noteContent: newNoteText.trim()
      });
    }
    setNewNoteText('');
    setNoteSuccess(true);
    setTimeout(() => setNoteSuccess(false), 2500);
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (onToggleBookmark) {
      onToggleBookmark({
        resourceId: resource.id,
        resourceTitle: resource.title,
        resourceType: resource.resourceType || 'Audio Book',
        mediaFormat: 'audio',
        timestampSeconds: Math.floor(currentTime),
        formattedTimestamp: formatTime(currentTime),
        chapterOrLessonTitle: currentChapter.title,
        label: `Bookmark at ${formatTime(currentTime)} - ${currentChapter.title}`
      });
    }
  };

  const progressPercent = Math.min(100, Math.round((currentTime / (duration || 1)) * 100));

  // Current active paragraph in sync mode
  const activeParagraphIndex = syncParagraphs.findIndex(
    (p) => currentTime >= p.audioStartSeconds && currentTime <= p.audioEndSeconds
  );

  const filteredTranscripts = transcripts.filter(
    (t) =>
      t.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
      (t.speaker && t.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())) ||
      (t.scriptureRef && t.scriptureRef.toLowerCase().includes(transcriptSearch.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] text-white">
        
        {/* TOP BAR */}
        <div className="bg-[#001845] border-b border-[#C5A059]/30 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#C5A059] text-[#002366] flex items-center justify-center font-bold shrink-0 shadow-sm">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
                  {resource.format || 'BIBU Audio'}
                </span>
                <span className="text-xs text-slate-300 font-mono hidden sm:inline">
                  {resource.licenseClassification || 'BIBU Institutional License'}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate font-serif">
                {resource.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Synchronized Read & Listen Toggle */}
            <button
              onClick={() => setViewMode(viewMode === 'sync_text' ? 'standard' : 'sync_text')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'sync_text'
                  ? 'bg-[#C5A059] text-[#002366] shadow-sm'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
              title="Synchronized Audio & Text Reading"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Read & Listen Sync</span>
            </button>

            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                isBookmarked ? 'bg-[#C5A059] text-[#002366]' : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
              title="Bookmark Timestamp"
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN BODY */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0">
          
          {/* LEFT: AUDIO HERO & SYNCHRONIZED DISPLAY (7 COLS ON LARGE) */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/60 overflow-y-auto">
            
            {viewMode === 'sync_text' ? (
              /* SYNCHRONIZED AUDIO + TEXT DISPLAY */
              <div className="space-y-4" ref={syncContainerRef}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                      Synchronized Text Highlighting
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Paragraph {activeParagraphIndex >= 0 ? activeParagraphIndex + 1 : 1} of {syncParagraphs.length}
                  </span>
                </div>

                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
                  {syncParagraphs.map((para, idx) => {
                    const isActive = idx === activeParagraphIndex;
                    return (
                      <div
                        key={para.id}
                        onClick={() => seekTo(para.audioStartSeconds)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#002366]/60 border-[#C5A059] shadow-md ring-1 ring-[#C5A059]/40'
                            : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80'
                        }`}
                      >
                        {para.heading && (
                          <h4 className={`text-xs font-bold font-serif mb-1.5 ${isActive ? 'text-[#C5A059]' : 'text-slate-300'}`}>
                            {para.heading}
                          </h4>
                        )}
                        <p className={`text-xs sm:text-sm leading-relaxed ${isActive ? 'text-white font-medium' : 'text-slate-400'}`}>
                          {para.text}
                        </p>
                        {para.scriptureRefs && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {para.scriptureRefs.map((scrip) => (
                              <span
                                key={scrip}
                                className="px-2 py-0.5 rounded-full bg-slate-950/60 text-[#C5A059] text-[10px] font-mono border border-slate-700"
                              >
                                📖 {scrip}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* STANDARD AUDIO DISC & ALBUM ART */
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-gradient-to-br from-[#001845] to-[#000d26] border border-slate-800 shadow-lg">
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-[#002366] border-2 border-[#C5A059]/50 overflow-hidden shrink-0 shadow-xl flex flex-col justify-between p-3.5 text-center">
                    <div className="text-[10px] font-mono text-[#C5A059] uppercase tracking-widest">
                      BIBU Audio
                    </div>
                    <div className="my-auto">
                      <Headphones className="w-12 h-12 mx-auto text-[#C5A059] mb-1.5 opacity-90" />
                      <div className="text-[11px] font-serif font-bold text-white leading-tight line-clamp-2">
                        {resource.title}
                      </div>
                    </div>
                    <div className="text-[9px] text-slate-300 font-mono truncate">
                      {resource.author}
                    </div>
                  </div>

                  <div className="space-y-2.5 text-center sm:text-left flex-1 min-w-0">
                    <div className="text-xs font-mono text-[#C5A059] uppercase tracking-widest font-bold">
                      {currentChapter.title}
                    </div>
                    <h3 className="text-base sm:text-xl font-bold font-serif text-white line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Authored by <span className="text-slate-200 font-medium">{resource.author}</span>
                    </p>
                    {currentChapter.summary && (
                      <p className="text-xs text-slate-300 line-clamp-2 italic leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                        "{currentChapter.summary}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Scripture References Banner */}
                {resource.scriptureReferences && resource.scriptureReferences.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-[#C5A059] flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      Scripture Anchor:
                    </span>
                    {resource.scriptureReferences.map((ref) => (
                      <span
                        key={ref}
                        className="px-2 py-0.5 rounded-lg bg-[#002366] text-white text-xs font-mono font-medium border border-[#C5A059]/30"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* AUDIO CONTROLLER DECK */}
            <div className="mt-6 pt-4 border-t border-slate-800 space-y-4">
              
              {/* Progress Slider */}
              <div className="space-y-1.5">
                <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer group"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const ratio = (e.clientX - rect.left) / rect.width;
                    seekTo(ratio * duration);
                  }}
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#002366] via-[#C5A059] to-[#E2C37E] rounded-full transition-all duration-150 relative"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-[#C5A059] font-bold">{progressPercent}% Completed</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Central Audio Control Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                
                {/* Playback Speed selector */}
                <div className="flex items-center gap-1">
                  {[0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        playbackSpeed === spd
                          ? 'bg-[#C5A059] text-[#002366]'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                {/* Primary Transport Controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={handlePrevChapter}
                    disabled={currentChapterIdx === 0}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Previous Chapter"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleSkip(-10)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="10s Rewind"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 rounded-2xl bg-[#C5A059] hover:bg-[#b38f46] text-[#002366] flex items-center justify-center font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={() => handleSkip(10)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="10s Forward"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleNextChapter}
                    disabled={currentChapterIdx === chapters.length - 1}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Next Chapter"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Volume & Sleep Timer */}
                <div className="flex items-center gap-2">
                  {/* Sleep Timer dropdown */}
                  <div className="relative group">
                    <button
                      className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                        sleepTimerMinutes !== null
                          ? 'bg-[#C5A059] text-[#002366]'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                      title="Sleep Timer"
                    >
                      <Clock className="w-4 h-4" />
                      {sleepTimerRemaining !== null && (
                        <span className="text-[10px] font-mono">
                          {Math.ceil(sleepTimerRemaining / 60)}m
                        </span>
                      )}
                    </button>
                    <div className="absolute bottom-full right-0 mb-2 w-36 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-1.5 hidden group-hover:block z-30">
                      <div className="text-[10px] font-mono text-slate-400 px-2 py-1 uppercase">Sleep Timer</div>
                      {[15, 30, 45, 60].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => setSleepTimerMinutes(mins)}
                          className="w-full text-left px-2 py-1 rounded-lg text-xs hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          {mins} Minutes
                        </button>
                      ))}
                      {sleepTimerMinutes !== null && (
                        <button
                          onClick={() => setSleepTimerMinutes(null)}
                          className="w-full text-left px-2 py-1 rounded-lg text-xs text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          Turn Off
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1.5 rounded-xl">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(parseFloat(e.target.value));
                        if (isMuted) setIsMuted(false);
                      }}
                      className="w-16 h-1.5 accent-[#C5A059] bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT: TABS (CHAPTERS, TRANSCRIPTS, TIMESTAMP NOTES) (5 COLS ON LARGE) */}
          <div className="lg:col-span-5 p-4 sm:p-6 bg-slate-950/60 flex flex-col justify-between overflow-hidden">
            
            {/* Tab navigation */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 mb-4 shrink-0">
              <button
                onClick={() => setActiveTab('chapters')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'chapters'
                    ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ListMusic className="w-3.5 h-3.5" />
                <span>Chapters ({chapters.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('transcript')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'transcript'
                    ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Transcript</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'notes'
                    ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Notes ({userNotes.filter(n => n.resourceId === resource.id).length})</span>
              </button>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className="flex-1 overflow-y-auto pr-1 min-h-[220px]">
              
              {/* CHAPTERS TAB */}
              {activeTab === 'chapters' && (
                <div className="space-y-2">
                  {chapters.map((chap, idx) => {
                    const isSelected = idx === currentChapterIdx;
                    return (
                      <div
                        key={chap.id}
                        onClick={() => {
                          setCurrentChapterIdx(idx);
                          setCurrentTime(0);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#002366]/80 border-[#C5A059] text-white shadow-sm'
                            : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                              isSelected ? 'bg-[#C5A059] text-[#002366]' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {chap.chapterNumber}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold truncate">{chap.title}</h4>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {chap.durationFormatted || '20:00'}
                            </div>
                          </div>
                        </div>

                        {isSelected && isPlaying && (
                          <div className="flex items-center gap-1">
                            <span className="w-1 h-3 bg-[#C5A059] animate-bounce" />
                            <span className="w-1 h-4 bg-[#C5A059] animate-bounce delay-75" />
                            <span className="w-1 h-2 bg-[#C5A059] animate-bounce delay-150" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TRANSCRIPT TAB */}
              {activeTab === 'transcript' && (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search audio transcript..."
                      value={transcriptSearch}
                      onChange={(e) => setTranscriptSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
                    {filteredTranscripts.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => seekTo(t.timestampSeconds)}
                        className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 cursor-pointer transition-colors space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="px-2 py-0.5 rounded-md bg-[#002366] text-[#C5A059] font-mono font-bold">
                            {t.formattedTimestamp}
                          </span>
                          {t.speaker && <span className="text-slate-400 truncate max-w-[140px]">{t.speaker}</span>}
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">{t.text}</p>
                        {t.scriptureRef && (
                          <span className="inline-block text-[10px] text-[#C5A059] font-mono">
                            📖 {t.scriptureRef}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NOTES TAB */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  {/* Add note at timestamp */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#C5A059]">
                        Note at {formatTime(currentTime)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {currentChapter.title}
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Write academic or personal reflection..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
                    />
                    <div className="flex items-center justify-between">
                      {noteSuccess && (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Saved!
                        </span>
                      )}
                      <button
                        onClick={handleAddTimestampNote}
                        disabled={!newNoteText.trim()}
                        className="ml-auto px-3 py-1 rounded-lg bg-[#C5A059] hover:bg-[#b38f46] disabled:opacity-40 text-[#002366] font-bold text-xs transition-colors cursor-pointer"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>

                  {/* Previous Notes List */}
                  <div className="space-y-2">
                    {userNotes
                      .filter((n) => n.resourceId === resource.id)
                      .map((note) => (
                        <div
                          key={note.id}
                          className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span className="text-[#C5A059] font-bold">
                              ⏱️ {note.formattedTimestamp || '00:00'}
                            </span>
                            <span>{note.createdAt}</span>
                          </div>
                          <p className="text-xs text-slate-200">{note.noteContent}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            </div>

            {/* FOOTER & DOWNLOAD RIGHTS */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-[11px] truncate max-w-[200px]">
                  {resource.licenseClassification || 'BIBU Authorized Streaming'}
                </span>
              </div>

              {resource.downloadAllowed ? (
                <button
                  onClick={() => alert(`Downloading authorized audio lecture: ${resource.title}.mp3`)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/50 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download MP3</span>
                </button>
              ) : (
                <span className="text-[10px] font-mono text-slate-500">
                  Streaming Only (Licensed)
                </span>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
