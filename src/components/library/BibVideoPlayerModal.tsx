import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  BookOpen,
  Headphones,
  Video,
  FileText,
  Clock,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  X,
  Search,
  MessageSquare,
  Award,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  Download,
  List,
  Sliders
} from 'lucide-react';
import {
  LibraryResource,
  VideoLesson,
  VideoCourseModule,
  TranscriptItem,
  UserMediaBookmark,
  UserMediaNote,
  UnifiedLearningProgress
} from '../../types';

interface BibVideoPlayerModalProps {
  resource: LibraryResource;
  onClose: () => void;
  onSaveProgress?: (progress: Partial<UnifiedLearningProgress>) => void;
  initialLessonId?: string;
  initialTimestamp?: number;
  userNotes?: UserMediaNote[];
  userBookmarks?: UserMediaBookmark[];
  onAddNote?: (note: Omit<UserMediaNote, 'id' | 'createdAt'>) => void;
  onToggleBookmark?: (bookmark: Omit<UserMediaBookmark, 'id' | 'createdAt'>) => void;
  onSwitchToAudio?: () => void;
  onSwitchToReading?: () => void;
}

export const BibVideoPlayerModal: React.FC<BibVideoPlayerModalProps> = ({
  resource,
  onClose,
  onSaveProgress,
  initialLessonId,
  initialTimestamp = 0,
  userNotes = [],
  userBookmarks = [],
  onAddNote,
  onToggleBookmark,
  onSwitchToAudio,
  onSwitchToReading
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(initialTimestamp);
  const [duration, setDuration] = useState<number>(() => {
    if (resource.videoDurationSeconds) return resource.videoDurationSeconds;
    return 1960; // ~32 minutes default
  });
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [quality, setQuality] = useState<'1080p' | '720p' | '480p' | 'Auto'>('1080p');
  const [activeTab, setActiveTab] = useState<'transcript' | 'modules' | 'notes' | 'materials'>('transcript');
  const [transcriptSearch, setTranscriptSearch] = useState<string>('');
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [noteSuccess, setNoteSuccess] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [completionThreshold, setCompletionThreshold] = useState<number>(() => resource.completionThresholdPercent || 90);
  const [activeLessonIdx, setActiveLessonIdx] = useState<number>(0);

  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Video Modules & Lessons Fallback
  const modules: VideoCourseModule[] = resource.videoModules || [
    {
      id: 'mod-1',
      moduleNumber: 1,
      title: 'Module 1: Foundations of Exegetical Methodology',
      description: 'Historical grammatical frameworks, original language syntax, and hermeneutic principles.',
      lessons: [
        {
          id: 'v-les-101',
          lessonNumber: 1,
          title: 'Lesson 1: What is Exegesis? (Exēgeomai vs Eisēgeomai)',
          duration: '22:15',
          durationSeconds: 1335,
          videoUrl: 'https://cdn.bibu.edu/media/video/exegesis_101.mp4',
          description: 'Distinguishing divine authorial intent from modern reader subjectivism.',
          requiredReading: 'Hermeneutics Manual, Chapter 1 (pp. 1–35)',
          quizQuestionsCount: 10,
          assignmentTitle: 'Exegetical Analysis of 2 Timothy 2:15',
          transcript: [
            {
              id: 'vt-1',
              timestampSeconds: 0,
              formattedTimestamp: '00:00',
              speaker: 'Dr. Thomas E. Wright, Ph.D.',
              text: 'Welcome to the Breakthrough International Bible University Masterclass on Biblical Exegesis.'
            },
            {
              id: 'vt-2',
              timestampSeconds: 24,
              formattedTimestamp: '00:24',
              speaker: 'Dr. Thomas E. Wright, Ph.D.',
              text: 'Today we address the definitive distinction between Exegesis (drawing out the meaning the Holy Spirit breathed into the text) versus Eisegesis (reading our personal cultural assumptions into Scripture).',
              scriptureRef: '2 Timothy 2:15'
            },
            {
              id: 'vt-3',
              timestampSeconds: 85,
              formattedTimestamp: '01:25',
              speaker: 'Dr. Thomas E. Wright, Ph.D.',
              text: 'In Koine Greek, the verb exēgeomai denotes to lead out, narrate, or unfold. We stand under the authority of the Word, not above it.'
            },
            {
              id: 'vt-4',
              timestampSeconds: 150,
              formattedTimestamp: '02:30',
              speaker: 'Dr. Thomas E. Wright, Ph.D.',
              text: 'Look at Paul’s instruction in Romans 8:1: Ouden ara nyn katakrima tois en Christō Iēsou. Every particle and verbal case carries immense theological weight.',
              scriptureRef: 'Romans 8:1'
            },
            {
              id: 'vt-5',
              timestampSeconds: 230,
              formattedTimestamp: '03:50',
              speaker: 'Dr. Thomas E. Wright, Ph.D.',
              text: 'Notice that katakrima is not simply punishment, but the penal sentence of divine condemnation. In Christ, the entire judicial decree has been executed and nullified.'
            }
          ]
        },
        {
          id: 'v-les-102',
          lessonNumber: 2,
          title: 'Lesson 2: Historical & Cultural Contextual Framing',
          duration: '28:40',
          durationSeconds: 1720,
          videoUrl: 'https://cdn.bibu.edu/media/video/exegesis_102.mp4',
          description: 'Examining ancient Near Eastern covenant patterns and First Century Greco-Roman rhetorical devices.',
          requiredReading: 'Romans Commentary by Dr. Lindqvist (pp. 420–460)',
          transcript: [
            {
              id: 'vt-6',
              timestampSeconds: 0,
              formattedTimestamp: '00:00',
              speaker: 'Dr. Thomas E. Wright, Ph.D.',
              text: 'Lesson 2 explores the historical-cultural horizon of the New Testament epistolary literature.'
            },
            {
              id: 'vt-7',
              timestampSeconds: 45,
              formattedTimestamp: '00:45',
              speaker: 'Dr. Thomas E. Wright, Ph.D.',
              text: 'When Paul wrote to the church in Rome around AD 57 from Corinth, he addressed both Jewish Christians and Gentile believers regarding the universal gospel.'
            }
          ]
        }
      ]
    },
    {
      id: 'mod-2',
      moduleNumber: 2,
      title: 'Module 2: Greek Discourse & Syntactic Analysis',
      description: 'Clause structures, participial nuances, and logical connectives.',
      lessons: [
        {
          id: 'v-les-201',
          lessonNumber: 3,
          title: 'Lesson 3: The Greek Clause Structure of Romans 8:1–17',
          duration: '34:10',
          durationSeconds: 2050,
          videoUrl: 'https://cdn.bibu.edu/media/video/exegesis_201.mp4',
          description: 'In-depth syntactical diagram of the law of the Spirit of life in Christ Jesus.',
          transcript: [
            {
              id: 'vt-8',
              timestampSeconds: 0,
              formattedTimestamp: '00:00',
              speaker: 'Dr. Thomas E. Wright, Ph.D.',
              text: 'In this advanced lecture, we diagram the Greek syntax of Romans 8:1 through 17.'
            }
          ]
        }
      ]
    }
  ];

  // Flattened lessons list
  const allLessons: VideoLesson[] = modules.flatMap((m) => m.lessons);
  const currentLesson = allLessons[activeLessonIdx] || allLessons[0];

  const transcripts: TranscriptItem[] = currentLesson.transcript || resource.transcript || [
    {
      id: 'vt-gen-1',
      timestampSeconds: 0,
      formattedTimestamp: '00:00',
      speaker: 'Lecturer',
      text: 'Welcome to this BIBU Video Lecture session.'
    }
  ];

  const formatTime = (secs: number) => {
    const s = Math.floor(secs);
    const m = Math.floor(s / 60);
    const remainingS = s % 60;
    return `${m < 10 ? '0' : ''}${m}:${remainingS < 10 ? '0' : ''}${remainingS}`;
  };

  // Video timer simulation
  useEffect(() => {
    if (isPlaying) {
      timerIntervalRef.current = window.setInterval(() => {
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
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, duration]);

  // Sync progress
  useEffect(() => {
    if (onSaveProgress) {
      const percentage = Math.min(100, Math.round((currentTime / (duration || 1)) * 100));
      const isCompleted = percentage >= completionThreshold;
      onSaveProgress({
        resourceId: resource.id,
        mediaFormat: resource.format === 'Video Course' ? 'video_course' : 'videobook',
        secondsWatched: Math.floor(currentTime),
        totalVideoDuration: duration,
        currentLessonId: currentLesson.id,
        currentLessonTitle: currentLesson.title,
        lastTimestamp: Math.floor(currentTime),
        lastFormattedTimestamp: formatTime(currentTime),
        percentageCompleted: percentage,
        isCompleted,
        lastSessionDate: 'Just now'
      });
    }
  }, [currentTime, currentLesson.id, completionThreshold]);

  const seekTo = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(duration, seconds)));
  };

  const handleSkip = (deltaSeconds: number) => {
    setCurrentTime((prev) => Math.max(0, Math.min(duration, prev + deltaSeconds)));
  };

  const handleNextLesson = () => {
    if (activeLessonIdx < allLessons.length - 1) {
      setActiveLessonIdx((prev) => prev + 1);
      setCurrentTime(0);
      setDuration(allLessons[activeLessonIdx + 1]?.durationSeconds || 1800);
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIdx > 0) {
      setActiveLessonIdx((prev) => prev - 1);
      setCurrentTime(0);
      setDuration(allLessons[activeLessonIdx - 1]?.durationSeconds || 1800);
    }
  };

  const handleAddTimestampNote = () => {
    if (!newNoteText.trim()) return;
    if (onAddNote) {
      onAddNote({
        resourceId: resource.id,
        resourceTitle: resource.title,
        mediaFormat: 'video',
        timestampSeconds: Math.floor(currentTime),
        formattedTimestamp: formatTime(currentTime),
        lessonId: currentLesson.id,
        chapterOrLessonTitle: currentLesson.title,
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
        resourceType: resource.resourceType || 'Video Course',
        mediaFormat: 'video',
        timestampSeconds: Math.floor(currentTime),
        formattedTimestamp: formatTime(currentTime),
        chapterOrLessonTitle: currentLesson.title,
        label: `Video Bookmark at ${formatTime(currentTime)} - ${currentLesson.title}`
      });
    }
  };

  const progressPercent = Math.min(100, Math.round((currentTime / (duration || 1)) * 100));
  const isThresholdMet = progressPercent >= completionThreshold;

  const filteredTranscripts = transcripts.filter(
    (t) =>
      t.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
      (t.speaker && t.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())) ||
      (t.scriptureRef && t.scriptureRef.toLowerCase().includes(transcriptSearch.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        ref={videoContainerRef}
        className={`w-full max-w-6xl bg-slate-950 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
          isFullscreen ? 'fixed inset-0 rounded-none max-w-none z-[9999]' : 'max-h-[96vh]'
        } text-white`}
      >
        
        {/* HEADER BAR */}
        <div className="bg-[#001845] border-b border-[#C5A059]/30 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#C5A059] text-[#002366] flex items-center justify-center font-bold shrink-0">
              <Video className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
                  {resource.format || 'BIBU Video'}
                </span>
                <span className="text-xs text-slate-300 font-mono hidden sm:inline">
                  Threshold: {completionThreshold}% required for academic credit
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate font-serif">
                {currentLesson.title}
              </h2>
            </div>
          </div>

          {/* Mode switch: WATCH | READ | LISTEN */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button className="px-2.5 py-1 rounded-lg bg-[#002366] text-[#C5A059] font-bold flex items-center gap-1 shadow-xs cursor-default">
                <Video className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WATCH</span>
              </button>

              {onSwitchToReading && (
                <button
                  onClick={onSwitchToReading}
                  className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Switch to Read Mode"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">READ</span>
                </button>
              )}

              {onSwitchToAudio && (
                <button
                  onClick={onSwitchToAudio}
                  className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Switch to Audio Mode"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">LISTEN</span>
                </button>
              )}
            </div>

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

        {/* MAIN BODY: SPLIT VIEW (VIDEO PLAYER + INTERACTIVE SIDE PANEL) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0">
          
          {/* LEFT: HTML5 VIDEO PLAYER CANVAS (7 COLS ON LARGE) */}
          <div className="lg:col-span-7 bg-black flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
            
            {/* VIDEO CANVAS / SCREEN */}
            <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden group">
              
              {/* Simulated Video Slide & Lecture Graphics */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#001438] via-[#000a1f] to-black flex flex-col justify-between p-6">
                
                {/* Top Badge on screen */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#002366]/80 text-[#C5A059] text-[10px] font-mono font-bold border border-[#C5A059]/40 backdrop-blur-xs">
                      BIBU Video Lecture
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono">
                      {resource.academicLevel || 'Master of Theology'}
                    </span>
                  </div>
                  
                  {isThresholdMet && (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Academic Credit Completed ({progressPercent}%)
                    </span>
                  )}
                </div>

                {/* Central Visual Presentation */}
                <div className="text-center max-w-xl mx-auto space-y-3 my-auto">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] text-xs font-mono font-bold uppercase tracking-widest border border-[#C5A059]/30">
                    {currentLesson.title}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-white leading-snug drop-shadow-md">
                    {resource.title}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto line-clamp-2">
                    {currentLesson.description}
                  </p>

                  {/* Active Captions Overlay */}
                  {showCaptions && (
                    <div className="mt-4 px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md text-slate-100 text-xs sm:text-sm font-medium border border-slate-700/80 shadow-lg max-w-lg mx-auto transition-all">
                      "Because God is truthful, His written Word communicates propositional, historical, and redemptive truth with absolute authority."
                    </div>
                  )}
                </div>

                {/* Bottom Watermark */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Instructor: {resource.author}</span>
                  <span>Breakthrough International Bible University • Phoenix, AZ</span>
                </div>

              </div>

              {/* Central Play/Pause button on hover */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`absolute w-16 h-16 rounded-full bg-[#C5A059]/90 hover:bg-[#C5A059] text-[#002366] flex items-center justify-center font-bold shadow-2xl transition-all cursor-pointer ${
                  isPlaying ? 'opacity-0 group-hover:opacity-90' : 'opacity-100 scale-105'
                }`}
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
              </button>

            </div>

            {/* VIDEO PLAYER CONTROLS DECK */}
            <div className="bg-slate-900 p-3 sm:p-4 space-y-3">
              
              {/* Scrub Bar with Threshold Indicator */}
              <div className="space-y-1">
                <div
                  className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer group"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const ratio = (e.clientX - rect.left) / rect.width;
                    seekTo(ratio * duration);
                  }}
                >
                  {/* 90% Threshold marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 z-10"
                    style={{ left: `${completionThreshold}%` }}
                    title={`Completion Threshold (${completionThreshold}%)`}
                  />

                  {/* Filled progress */}
                  <div
                    className="h-full bg-gradient-to-r from-[#002366] via-[#C5A059] to-[#E2C37E] rounded-full transition-all duration-150 relative"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{formatTime(currentTime)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#C5A059] font-bold">{progressPercent}% watched</span>
                    <span className="text-slate-500">•</span>
                    <span className={isThresholdMet ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      {isThresholdMet ? 'Completed ✓' : `Requires ${completionThreshold}%`}
                    </span>
                  </div>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                
                {/* Left controls: Prev / 10s Rewind / Play / 10s Forward / Next */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={handlePrevLesson}
                    disabled={activeLessonIdx === 0}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Previous Lesson"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleSkip(-10)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    title="10s Rewind"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-3 py-1.5 rounded-xl bg-[#C5A059] hover:bg-[#b38f46] text-[#002366] font-bold text-xs flex items-center gap-1.5 transition-transform cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    onClick={() => handleSkip(10)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    title="10s Forward"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleNextLesson}
                    disabled={activeLessonIdx === allLessons.length - 1}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Next Lesson"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Middle controls: Speed & Captions */}
                <div className="flex items-center gap-1.5">
                  {/* Speed */}
                  <div className="flex items-center bg-slate-800 rounded-lg p-0.5">
                    {[0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                          playbackSpeed === spd ? 'bg-[#C5A059] text-[#002366]' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>

                  {/* Captions Toggle */}
                  <button
                    onClick={() => setShowCaptions(!showCaptions)}
                    className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                      showCaptions ? 'bg-[#C5A059] text-[#002366]' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title="Closed Captions (CC)"
                  >
                    CC
                  </button>

                  {/* Quality selector */}
                  <div className="relative group">
                    <button className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono font-bold hover:text-white">
                      {quality}
                    </button>
                    <div className="absolute bottom-full right-0 mb-1 w-24 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-1 hidden group-hover:block z-30">
                      {(['1080p', '720p', '480p', 'Auto'] as const).map((q) => (
                        <button
                          key={q}
                          onClick={() => setQuality(q)}
                          className="w-full text-left px-2 py-0.5 rounded text-xs hover:bg-slate-700"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right controls: Volume & Fullscreen */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
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
                      className="w-14 h-1 accent-[#C5A059] bg-slate-700 rounded cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Full Screen"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT: INTERACTIVE SIDE PANEL (TRANSCRIPT, MODULES, NOTES, STUDY MATERIALS) (5 COLS) */}
          <div className="lg:col-span-5 p-4 sm:p-5 bg-slate-900/90 flex flex-col justify-between overflow-hidden">
            
            {/* TAB SELECTOR */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-4 shrink-0">
              <button
                onClick={() => setActiveTab('transcript')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'transcript' ? 'bg-[#002366] text-[#C5A059]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Transcript</span>
              </button>

              <button
                onClick={() => setActiveTab('modules')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'modules' ? 'bg-[#002366] text-[#C5A059]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Modules ({allLessons.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'notes' ? 'bg-[#002366] text-[#C5A059]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Notes ({userNotes.filter((n) => n.resourceId === resource.id).length})</span>
              </button>

              <button
                onClick={() => setActiveTab('materials')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'materials' ? 'bg-[#002366] text-[#C5A059]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Study Guide</span>
              </button>
            </div>

            {/* TAB CONTENT AREA */}
            <div className="flex-1 overflow-y-auto pr-1 min-h-[220px]">
              
              {/* 1. TRANSCRIPT (CLICKABLE TIMESTAMPS JUMP TO VIDEO SECOND) */}
              {activeTab === 'transcript' && (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search lecture transcript..."
                      value={transcriptSearch}
                      onChange={(e) => setTranscriptSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="space-y-2.5 max-h-[320px] overflow-y-auto">
                    {filteredTranscripts.map((t) => {
                      const isCurrent = currentTime >= t.timestampSeconds && currentTime < t.timestampSeconds + 20;
                      return (
                        <div
                          key={t.id}
                          onClick={() => seekTo(t.timestampSeconds)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                            isCurrent
                              ? 'bg-[#002366]/70 border-[#C5A059] shadow-md ring-1 ring-[#C5A059]/30'
                              : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-950 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="px-2 py-0.5 rounded bg-[#002366] text-[#C5A059] font-mono font-bold">
                              {t.formattedTimestamp}
                            </span>
                            {t.speaker && <span className="text-slate-400 font-medium">{t.speaker}</span>}
                          </div>
                          <p className={`text-xs leading-relaxed ${isCurrent ? 'text-white font-medium' : 'text-slate-300'}`}>
                            {t.text}
                          </p>
                          {t.scriptureRef && (
                            <div className="text-[10px] text-[#C5A059] font-mono font-medium">
                              📖 Scripture Ref: {t.scriptureRef}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. MODULES & LESSONS (COURSE STRUCTURE) */}
              {activeTab === 'modules' && (
                <div className="space-y-4">
                  {modules.map((mod) => (
                    <div key={mod.id} className="space-y-2">
                      <div className="px-2 py-1 rounded bg-[#001845] border border-[#C5A059]/30 text-xs font-bold font-serif text-[#C5A059]">
                        {mod.title}
                      </div>
                      <div className="space-y-1.5 pl-1">
                        {mod.lessons.map((les) => {
                          const isCurrent = les.id === currentLesson.id;
                          return (
                            <div
                              key={les.id}
                              onClick={() => {
                                const idx = allLessons.findIndex((l) => l.id === les.id);
                                if (idx >= 0) {
                                  setActiveLessonIdx(idx);
                                  setCurrentTime(0);
                                  setDuration(les.durationSeconds || 1800);
                                }
                              }}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                isCurrent
                                  ? 'bg-[#002366] border-[#C5A059] text-white shadow-sm'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-[11px] shrink-0 ${
                                    isCurrent ? 'bg-[#C5A059] text-[#002366]' : 'bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  {les.lessonNumber}
                                </div>
                                <div className="min-w-0">
                                  <h5 className="text-xs font-bold truncate">{les.title}</h5>
                                  <span className="text-[10px] text-slate-400 font-mono">{les.duration}</span>
                                </div>
                              </div>
                              {isCurrent && isPlaying && (
                                <span className="text-[10px] font-mono text-[#C5A059] uppercase font-bold animate-pulse">
                                  Playing
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. NOTES AT TIMESTAMP */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#C5A059]">
                        Note at {formatTime(currentTime)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
                        {currentLesson.title}
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Save personal reflection or exegetical observation..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
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

                  {/* Notes List */}
                  <div className="space-y-2">
                    {userNotes
                      .filter((n) => n.resourceId === resource.id)
                      .map((note) => (
                        <div key={note.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span className="text-[#C5A059] font-bold">⏱️ {note.formattedTimestamp || '00:00'}</span>
                            <span>{note.createdAt}</span>
                          </div>
                          <p className="text-xs text-slate-200">{note.noteContent}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* 4. STUDY MATERIALS & ASSIGNMENTS */}
              {activeTab === 'materials' && (
                <div className="space-y-3 text-xs">
                  {currentLesson.requiredReading && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="font-bold text-[#C5A059] flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        Required Reading for this Lesson
                      </div>
                      <p className="text-slate-300">{currentLesson.requiredReading}</p>
                    </div>
                  )}

                  {currentLesson.quizQuestionsCount && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Comprehension Quiz ({currentLesson.quizQuestionsCount} Questions)
                      </div>
                      <p className="text-slate-300">
                        Complete after reaching {completionThreshold}% lecture completion.
                      </p>
                    </div>
                  )}

                  {currentLesson.assignmentTitle && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="font-bold text-[#C5A059] flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        Faculty Assessment
                      </div>
                      <p className="text-slate-300">{currentLesson.assignmentTitle}</p>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* FOOTER & RIGHTS */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-[11px] truncate max-w-[200px]">
                  {resource.licenseClassification || 'BIBU Licensed Academic Media'}
                </span>
              </div>

              {resource.downloadAllowed ? (
                <button
                  onClick={() => alert(`Downloading lecture video: ${currentLesson.title}.mp4`)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/50 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download MP4</span>
                </button>
              ) : (
                <span className="text-[10px] font-mono text-slate-500">
                  Protected Streaming Only
                </span>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
