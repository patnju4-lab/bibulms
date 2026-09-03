import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Clock,
  Eye,
  BookOpen,
  Landmark,
  Languages,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  FileText,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Tv,
  Film,
  Download,
  Share2,
  List,
  Target,
  Lightbulb,
  HeartHandshake,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import {
  HERMENEUTICS_STORYBOARD_SCENES,
  HERMENEUTICS_METHOD_STEPS,
  PHILIPPIANS_CONTEXT_PASSAGE,
  StoryboardScene
} from '../../data/storyboardData';

interface HermeneuticsStoryboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSceneIndex?: number;
}

export const HermeneuticsStoryboardModal: React.FC<HermeneuticsStoryboardModalProps> = ({
  isOpen,
  onClose,
  initialSceneIndex = 0
}) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(initialSceneIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'table' | 'method_flowchart' | 'philippians_study' | 'production_specs'>('visualizer');
  const [copiedNarration, setCopiedNarration] = useState<boolean>(false);
  const [copiedAllScript, setCopiedAllScript] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [selectedMethodStep, setSelectedMethodStep] = useState<number>(1);

  const activeScene: StoryboardScene = HERMENEUTICS_STORYBOARD_SCENES[currentSceneIdx] || HERMENEUTICS_STORYBOARD_SCENES[0];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync initial scene index
  useEffect(() => {
    if (isOpen) {
      setCurrentSceneIdx(initialSceneIndex);
      setCurrentTimeSec(HERMENEUTICS_STORYBOARD_SCENES[initialSceneIndex]?.startSeconds || 0);
    }
  }, [isOpen, initialSceneIndex]);

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleStopAudio();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Playback timer simulation
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTimeSec((prev) => {
          const next = prev + 1;
          if (next >= 600) {
            setIsPlaying(false);
            return 600;
          }
          // Check if we passed into the next scene
          const currentScene = HERMENEUTICS_STORYBOARD_SCENES[currentSceneIdx];
          if (currentScene && next >= currentScene.endSeconds && currentSceneIdx < HERMENEUTICS_STORYBOARD_SCENES.length - 1) {
            setCurrentSceneIdx(currentSceneIdx + 1);
          }
          return next;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, currentSceneIdx]);

  // Handle TTS Narration
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeScene.wordForWordNarration.replace(/"/g, ''));
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleStopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleSelectScene = (index: number) => {
    handleStopAudio();
    setCurrentSceneIdx(index);
    setCurrentTimeSec(HERMENEUTICS_STORYBOARD_SCENES[index].startSeconds);
  };

  const handleNextScene = () => {
    if (currentSceneIdx < HERMENEUTICS_STORYBOARD_SCENES.length - 1) {
      handleSelectScene(currentSceneIdx + 1);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIdx > 0) {
      handleSelectScene(currentSceneIdx - 1);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyNarration = async () => {
    try {
      await navigator.clipboard.writeText(activeScene.wordForWordNarration);
      setCopiedNarration(true);
      setTimeout(() => setCopiedNarration(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyAllScript = async () => {
    try {
      const fullScript = HERMENEUTICS_STORYBOARD_SCENES.map(
        (s) => `[SCENE ${s.sceneNumber} (${s.timeRange}): ${s.title.toUpperCase()}]\nVISUALS: ${s.visuals}\nNARRATION: ${s.wordForWordNarration}\nON-SCREEN: ${s.onScreenText.join(' | ')}\n`
      ).join('\n---\n\n');
      await navigator.clipboard.writeText(fullScript);
      setCopiedAllScript(true);
      setTimeout(() => setCopiedAllScript(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="hermeneutics-storyboard-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
    >
      <div
        id="hermeneutics-storyboard-dialog"
        className="bg-[#080E21] text-slate-100 rounded-3xl w-full max-w-7xl h-[94vh] overflow-hidden shadow-2xl border border-slate-700/80 flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* ========================================================= */}
        {/* MODAL HEADER                                              */}
        {/* ========================================================= */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#001744] via-[#002366] to-[#0A132C] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#997734] text-[#002366] font-black flex items-center justify-center shadow-lg">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#C5A059] text-[#002366] text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wide">
                  BIBU TV PRODUCTION
                </span>
                <span className="text-xs text-slate-400 font-mono">10-Minute Master Lecture</span>
                <span className="bg-emerald-950 border border-emerald-700/60 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                  Word-for-Word Storyboard
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display tracking-tight">
                Foundations of Biblical Hermeneutics: The Historical-Grammatical Method
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyAllScript}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
              title="Copy the entire 10-minute word-for-word lecture narration and storyboard notes"
            >
              {copiedAllScript ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">All Script Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Copy Full Script</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                handleStopAudio();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SUB-NAVIGATION TABS                                       */}
        {/* ========================================================= */}
        <div className="px-5 py-2.5 bg-[#050A18] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('visualizer')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'visualizer'
                  ? 'bg-[#C5A059] text-[#002366] shadow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Studio Player & Visualizer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'table'
                  ? 'bg-[#C5A059] text-[#002366] shadow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Scene-by-Scene Table</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('method_flowchart')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'method_flowchart'
                  ? 'bg-[#C5A059] text-[#002366] shadow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>7-Step Method Flowchart</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('philippians_study')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'philippians_study'
                  ? 'bg-[#C5A059] text-[#002366] shadow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Philippians 4:13 Case Study</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('production_specs')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'production_specs'
                  ? 'bg-[#C5A059] text-[#002366] shadow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Production Direction & Thumbnail</span>
            </button>
          </div>

          <div className="flex items-center gap-3 font-mono text-slate-400">
            <span className="text-[11px] hidden sm:inline">Timeline:</span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[#C5A059] font-bold text-xs">
              {formatSeconds(currentTimeSec)} / 10:00
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MODAL MAIN CONTENT AREA                                   */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'visualizer' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT / CENTER: Interactive Studio Screen Simulator */}
              <div className="lg:col-span-8 space-y-4">
                {/* 16:9 Screen Box */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-700 shadow-2xl flex flex-col justify-between p-4 sm:p-6 group">
                  {/* Studio Background simulation based on active scene */}
                  <div className="absolute inset-0 z-0">
                    {activeScene.diagramType === 'opening' && (
                      <div className="w-full h-full bg-gradient-to-br from-[#001744] via-[#05112E] to-black flex items-center justify-center p-8">
                        <div className="text-center space-y-4 max-w-xl animate-in fade-in duration-500">
                          <div className="w-20 h-20 mx-auto rounded-2xl bg-[#C5A059]/20 border-2 border-[#C5A059] flex items-center justify-center shadow-2xl">
                            <span className="font-serif text-3xl font-black text-[#C5A059]">BIBU</span>
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-black font-display text-white tracking-wide">
                            BREAKTHROUGH INTERNATIONAL BIBLE UNIVERSITY
                          </h3>
                          <div className="h-0.5 w-24 bg-[#C5A059] mx-auto" />
                          <p className="text-sm font-serif text-[#C5A059] uppercase tracking-widest">
                            BIBU TV Theological Masterclass
                          </p>
                        </div>
                      </div>
                    )}

                    {activeScene.diagramType === 'definition' && (
                      <div className="w-full h-full bg-gradient-to-br from-[#0A1633] to-[#040816] p-6 sm:p-8 flex flex-col justify-center">
                        <div className="max-w-xl space-y-4">
                          <span className="px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 text-[#C5A059] text-xs font-bold uppercase tracking-wider">
                            Theological Definition
                          </span>
                          <h3 className="text-2xl sm:text-4xl font-black text-white font-serif tracking-tight">
                            Hermeneutics <span className="text-slate-400 font-sans text-base font-normal">/ ἑρμηνεύω</span>
                          </h3>
                          <p className="text-sm sm:text-base text-slate-300 italic border-l-4 border-[#C5A059] pl-3">
                            "The science and art of biblical interpretation."
                          </p>
                          <div className="grid grid-cols-3 gap-3 pt-3">
                            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-center">
                              <span className="block text-[10px] font-mono text-[#C5A059] font-bold">STAGE 1</span>
                              <span className="font-bold text-white text-xs sm:text-sm">Observation</span>
                              <span className="block text-[10px] text-slate-400 mt-0.5">What does it say?</span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-center">
                              <span className="block text-[10px] font-mono text-[#C5A059] font-bold">STAGE 2</span>
                              <span className="font-bold text-white text-xs sm:text-sm">Interpretation</span>
                              <span className="block text-[10px] text-slate-400 mt-0.5">What does it mean?</span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-center">
                              <span className="block text-[10px] font-mono text-[#C5A059] font-bold">STAGE 3</span>
                              <span className="font-bold text-white text-xs sm:text-sm">Application</span>
                              <span className="block text-[10px] text-slate-400 mt-0.5">What does it mean for us?</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeScene.diagramType === 'why_matters' && (
                      <div className="w-full h-full bg-[#070D1E] grid grid-cols-2 divide-x divide-slate-800">
                        {/* Ancient World */}
                        <div className="p-5 flex flex-col justify-center space-y-3 bg-gradient-to-r from-amber-950/20 to-transparent">
                          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                            Ancient Biblical Context (Then)
                          </span>
                          <h4 className="text-base sm:text-lg font-bold text-white">Original Historical Setting</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Hebrew & Greek manuscripts, 1st-century Roman empire, cultural customs, original recipients.
                          </p>
                          <div className="p-2.5 rounded-lg bg-amber-900/20 border border-amber-700/40 text-[11px] text-amber-200">
                            Author's intended meaning to primary hearers
                          </div>
                        </div>

                        {/* Modern Believer */}
                        <div className="p-5 flex flex-col justify-center space-y-3 bg-gradient-to-l from-blue-950/20 to-transparent">
                          <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                            Contemporary Believer (Now)
                          </span>
                          <h4 className="text-base sm:text-lg font-bold text-white">21st-Century Reader</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Requires exegesis to avoid modern bias, proof-texting, and eisegesis.
                          </p>
                          <div className="p-2.5 rounded-lg bg-blue-900/20 border border-blue-700/40 text-[11px] text-blue-200 font-serif italic">
                            "Rightly dividing the Word of Truth" — 2 Timothy 2:15
                          </div>
                        </div>
                      </div>
                    )}

                    {activeScene.diagramType === 'historical' && (
                      <div className="w-full h-full bg-gradient-to-br from-[#121B35] to-[#050B1B] p-6 flex flex-col justify-center">
                        <div className="space-y-3 max-w-lg">
                          <span className="text-[10px] font-mono text-[#C5A059] font-bold uppercase tracking-widest">
                            HISTORICAL CONTEXT CHECKLIST
                          </span>
                          <h3 className="text-xl sm:text-2xl font-bold text-white">
                            The 6 Crucial Questions: Who? When? Where? Why?
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                              <span className="font-bold text-[#C5A059]">1. Author:</span> Who penned it?
                            </div>
                            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                              <span className="font-bold text-[#C5A059]">2. Audience:</span> Who received it?
                            </div>
                            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                              <span className="font-bold text-[#C5A059]">3. Date:</span> When was it composed?
                            </div>
                            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                              <span className="font-bold text-[#C5A059]">4. Place:</span> Geography & location
                            </div>
                            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                              <span className="font-bold text-[#C5A059]">5. Political:</span> Rulers & laws
                            </div>
                            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                              <span className="font-bold text-[#C5A059]">6. Culture:</span> Social customs
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeScene.diagramType === 'grammatical' && (
                      <div className="w-full h-full bg-gradient-to-br from-[#0B1530] to-black p-6 flex flex-col justify-center">
                        <div className="max-w-xl space-y-3">
                          <span className="text-[10px] font-mono text-[#C5A059] font-bold uppercase tracking-wider">
                            GRAMMATICAL & LITERARY CONTEXT
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="font-serif text-3xl sm:text-4xl text-[#C5A059] font-bold">λόγος</span>
                            <div className="text-xs text-slate-300">
                              <span className="font-bold text-white">Vocabulary • Syntax • Genre</span>
                              <p className="text-slate-400">Greek, Hebrew, Aramaic linguistic structures</p>
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs space-y-1.5 font-mono text-amber-200">
                            <p>• Words: Lexical meaning in original testament</p>
                            <p>• Grammar: Verb tenses (Aorist, Perfect), case, voice</p>
                            <p>• Literary Genre: Epistle, Historical Narrative, Wisdom, Poetry</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeScene.diagramType === 'flowchart' && (
                      <div className="w-full h-full bg-gradient-to-br from-[#071129] to-[#02050E] p-4 sm:p-6 flex flex-col justify-center">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-[#C5A059] font-bold uppercase tracking-wider">
                              THE 7-STEP EXEGESIS METHOD
                            </span>
                            <span className="text-[10px] text-slate-400">Step-by-Step Pathway</span>
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                            {HERMENEUTICS_METHOD_STEPS.map((s) => (
                              <div
                                key={s.stepNumber}
                                className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 flex flex-col items-center justify-between min-h-[90px]"
                              >
                                <span className="w-5 h-5 rounded-full bg-[#C5A059] text-[#002366] font-black text-[9px] flex items-center justify-center">
                                  {s.stepNumber}
                                </span>
                                <span className="font-bold text-white text-[9px] leading-tight mt-1">
                                  {s.subtitle}
                                </span>
                                <span className="text-[8px] text-slate-400 line-clamp-2 mt-0.5">
                                  {s.prompt}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeScene.diagramType === 'philippians' && (
                      <div className="w-full h-full bg-gradient-to-br from-[#091535] to-[#040817] p-4 sm:p-6 flex flex-col justify-center">
                        <div className="space-y-2.5 max-w-2xl">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                              CASE STUDY: PHILIPPIANS 4:13 IN CONTEXT
                            </span>
                            <span className="text-[10px] text-slate-400">Written from Roman Prison (62 A.D.)</span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs space-y-1">
                            <div className="text-slate-400 text-[11px]">
                              <span className="font-bold text-slate-300">Phil 4:11-12:</span> "...I have learned to be content whatever the circumstances. I know what it is to be in need, and I know what it is to have plenty..."
                            </div>
                            <div className="p-2 rounded-lg bg-[#C5A059]/20 border border-[#C5A059] text-white font-bold text-sm">
                              Phil 4:13: "I can do all things through Christ who strengthens me."
                            </div>
                          </div>

                          {/* 5-stage chain */}
                          <div className="flex items-center justify-between text-[9px] font-mono text-slate-300 bg-black/40 p-2 rounded-lg border border-slate-800">
                            <span className="text-[#C5A059] font-bold">VERSE</span>
                            <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                            <span>IMMEDIATE CONTEXT</span>
                            <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                            <span>HISTORICAL CONTEXT</span>
                            <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                            <span>ORIGINAL MEANING</span>
                            <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                            <span className="text-emerald-400 font-bold">APPLICATION</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeScene.diagramType === 'errors' && (
                      <div className="w-full h-full bg-gradient-to-br from-rose-950/40 via-[#0B1530] to-black p-6 flex flex-col justify-center">
                        <div className="max-w-xl space-y-3">
                          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs font-mono uppercase tracking-wider">
                            <AlertTriangle className="w-4 h-4" />
                            <span>COMMON INTERPRETIVE ERRORS (AVOID!)</span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-white">
                            Contextual Misinterpretation Traps
                          </h3>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/50 text-slate-200">
                              <span className="font-bold text-rose-400 block">1. Verse Isolation</span>
                              Plucking single verses like bumper stickers.
                            </div>
                            <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/50 text-slate-200">
                              <span className="font-bold text-rose-400 block">2. Modern Assumptions</span>
                              Imposing 21st-century thoughts onto ancient texts.
                            </div>
                            <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/50 text-slate-200">
                              <span className="font-bold text-rose-400 block">3. Ignoring Background</span>
                              Disregarding author, audience, and era.
                            </div>
                            <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/50 text-slate-200">
                              <span className="font-bold text-rose-400 block">4. Misapplication</span>
                              Jumping to "what it means to me" before meaning.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeScene.diagramType === 'closing' && (
                      <div className="w-full h-full bg-gradient-to-br from-[#001744] via-[#002366] to-black p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in">
                        <div className="w-16 h-16 rounded-2xl bg-[#C5A059] text-[#002366] flex items-center justify-center shadow-xl border-2 border-white">
                          <span className="font-serif text-2xl font-black">BIBU</span>
                        </div>
                        <div className="space-y-1">
                          <h2 className="text-lg sm:text-2xl font-black font-display text-white tracking-wide">
                            BREAKTHROUGH INTERNATIONAL BIBLE UNIVERSITY
                          </h2>
                          <div className="text-xs sm:text-sm font-bold text-[#C5A059] uppercase tracking-widest">
                            BIBU TV • Equipping God's People for Effective Kingdom Ministry
                          </div>
                        </div>
                        <div className="h-0.5 w-32 bg-[#C5A059]/60" />
                        <div className="text-xs text-slate-300 font-serif">
                          <span className="font-bold text-white">Foundations of Biblical Hermeneutics</span>
                          <span className="block text-slate-400">Lesson 1: The Historical-Grammatical Method</span>
                        </div>
                        <p className="text-[11px] font-mono text-[#C5A059]">
                          Study Faithfully • Interpret Carefully • Apply Wisely
                        </p>
                      </div>
                    )}
                  </div>

                  {/* OVERLAY: Top Status HUD */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                        SCENE {activeScene.sceneNumber} OF 9
                      </span>
                      <span className="bg-black/70 backdrop-blur-sm text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
                        {activeScene.timeRange}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-[#002366]/80 text-[#C5A059] text-[9px] font-bold px-2 py-0.5 rounded border border-[#C5A059]/40 backdrop-blur-sm">
                        Lecturer Visibility: ~{activeScene.lecturerVisibilityPercent}%
                      </span>
                    </div>
                  </div>

                  {/* OVERLAY: Lower-Third Identification Bar as specified */}
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-3 bg-[#001744]/90 backdrop-blur-md border-l-4 border-[#C5A059] px-4 py-2 rounded-r-xl shadow-2xl border border-slate-700/50">
                      <div className="w-7 h-7 rounded-lg bg-[#C5A059] text-[#002366] font-black text-xs flex items-center justify-center shrink-0">
                        TV
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-[#C5A059] uppercase tracking-wider">
                          BIBU THEOLOGY LECTURE
                        </div>
                        <div className="text-xs font-bold text-white font-serif tracking-tight">
                          Foundations of Biblical Hermeneutics
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Playback & Scrubber Controls */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  {/* Scrubber bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono text-[#C5A059] font-bold">{formatSeconds(currentTimeSec)}</span>
                      <span className="text-slate-300 font-bold">{activeScene.title}</span>
                      <span className="font-mono">10:00</span>
                    </div>
                    <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
                      <div
                        className="h-full bg-gradient-to-r from-[#002366] via-[#C5A059] to-amber-300 transition-all duration-300 rounded-full"
                        style={{ width: `${(currentTimeSec / 600) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Button bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrevScene}
                        disabled={currentSceneIdx === 0}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition-colors"
                        title="Previous Scene"
                      >
                        <SkipBack className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#b59048] text-[#002366] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-4 h-4 fill-current" />
                            <span>Pause Storyboard</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            <span>Play Storyboard</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleNextScene}
                        disabled={currentSceneIdx === HERMENEUTICS_STORYBOARD_SCENES.length - 1}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition-colors"
                        title="Next Scene"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsPlaying(false);
                          handleSelectScene(0);
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Reset to Scene 1"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* TTS Narration Voice Preview */}
                      <button
                        type="button"
                        onClick={handleToggleSpeech}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                          isSpeaking
                            ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        }`}
                        title="Listen to the lecturer's word-for-word narration"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Stop Narration Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>Speak Narration (Audio)</span>
                          </>
                        )}
                      </button>

                      {/* Speed selector */}
                      <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-xs font-mono">
                        {[1, 1.5, 2].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setPlaybackSpeed(s)}
                            className={`px-2 py-1 rounded font-bold transition-colors ${
                              playbackSpeed === s ? 'bg-[#C5A059] text-[#002366]' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Word-for-Word Narration Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#07112A] to-slate-900 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#C5A059]" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Word-for-Word Narration Script (Scene {activeScene.sceneNumber})
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyNarration}
                      className="text-xs text-[#C5A059] hover:underline font-bold flex items-center gap-1"
                    >
                      {copiedNarration ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Narration</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans italic bg-black/40 p-3.5 rounded-xl border border-slate-800/80">
                    {activeScene.wordForWordNarration}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-mono">Key Terms:</span>
                    {activeScene.theologicalTerms.map((term, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-medium text-[#C5A059] border border-slate-700"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR: Scene Selector & On-Screen Notes */}
              <div className="lg:col-span-4 space-y-4">
                {/* Visuals & On-Screen Text Info Box */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#C5A059]" />
                    <span>Scene Visuals & Directives</span>
                  </h4>

                  <div className="text-xs text-slate-300 space-y-2">
                    <div>
                      <span className="font-bold text-slate-400 block text-[11px]">Camera & Set:</span>
                      <p className="leading-snug text-slate-200">{activeScene.visuals}</p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-400 block text-[11px]">On-Screen Text Graphics:</span>
                      <ul className="space-y-1 pt-1 font-mono text-[11px] text-amber-200 bg-black/40 p-2.5 rounded-lg border border-slate-800">
                        {activeScene.onScreenText.map((t, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#C5A059] font-bold">•</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {activeScene.notes && (
                      <div className="p-2 rounded-lg bg-[#001744]/60 border border-[#002366] text-[11px] text-slate-300">
                        <span className="font-bold text-[#C5A059] block">Director's Note:</span>
                        {activeScene.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* 9-Scene Quick Navigation List */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      All 9 Scenes (10:00 Total)
                    </h4>
                    <span className="text-[10px] text-[#C5A059] font-bold">Select to scrub</span>
                  </div>

                  <div className="space-y-1.5 max-h-[340px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pr-1">
                    {HERMENEUTICS_STORYBOARD_SCENES.map((scene, idx) => {
                      const isCurrent = idx === currentSceneIdx;
                      return (
                        <button
                          key={scene.id}
                          type="button"
                          onClick={() => handleSelectScene(idx)}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 text-xs ${
                            isCurrent
                              ? 'bg-[#002366] border-[#C5A059] text-white shadow-md'
                              : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`w-5 h-5 rounded-md font-mono text-[10px] font-black flex items-center justify-center shrink-0 ${
                                isCurrent ? 'bg-[#C5A059] text-[#002366]' : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {scene.sceneNumber}
                            </span>
                            <div className="min-w-0">
                              <span className="font-bold block truncate text-slate-200">{scene.title}</span>
                              <span className="text-[10px] font-mono text-slate-500">{scene.timeRange}</span>
                            </div>
                          </div>

                          {isCurrent && (
                            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: FULL SCENE-BY-SCENE STORYBOARD TABLE               */}
          {/* ========================================================= */}
          {activeTab === 'table' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Complete 10-Minute Storyboard Table & Word-for-Word Narration
                  </h3>
                  <p className="text-xs text-slate-400">
                    Formatted strictly according to the BIBU TV production standards and official lecture outline
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAllScript}
                  className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#b59048] text-[#002366] font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedAllScript ? 'Copied Full Table Script!' : 'Copy Script for Teleprompter'}</span>
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#001744] to-[#002366] text-white uppercase font-mono text-[11px] border-b border-slate-700">
                        <th className="py-3 px-3.5 font-bold w-24">Time</th>
                        <th className="py-3 px-3.5 font-bold w-48">Scene & Visuals</th>
                        <th className="py-3 px-4 font-bold min-w-[320px]">Narration (Word-for-Word)</th>
                        <th className="py-3 px-4 font-bold w-72">On-Screen Text / Notes</th>
                        <th className="py-3 px-2 text-center w-16">Play</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-950/60 font-sans">
                      {HERMENEUTICS_STORYBOARD_SCENES.map((scene, idx) => {
                        const isCurrent = idx === currentSceneIdx;
                        return (
                          <tr
                            key={scene.id}
                            className={`hover:bg-slate-900/80 transition-colors ${
                              isCurrent ? 'bg-[#002366]/30' : ''
                            }`}
                          >
                            <td className="py-3.5 px-3.5 font-mono font-bold text-[#C5A059] align-top whitespace-nowrap">
                              {scene.timeRange}
                              <span className="block text-[10px] text-slate-500 font-sans font-normal mt-0.5">
                                Scene {scene.sceneNumber}
                              </span>
                            </td>

                            <td className="py-3.5 px-3.5 align-top space-y-1">
                              <span className="font-bold text-white block">{scene.title}</span>
                              <p className="text-[11px] text-slate-300 leading-snug">{scene.visuals}</p>
                              <span className="inline-block text-[9px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded mt-1">
                                Vis: ~{scene.lecturerVisibilityPercent}%
                              </span>
                            </td>

                            <td className="py-3.5 px-4 align-top text-slate-200 leading-relaxed italic bg-black/20">
                              {scene.wordForWordNarration}
                            </td>

                            <td className="py-3.5 px-4 align-top space-y-1.5">
                              <div className="font-mono text-[11px] text-amber-200 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                                {scene.onScreenText.map((txt, tIdx) => (
                                  <div key={tIdx} className="leading-tight">
                                    • {txt}
                                  </div>
                                ))}
                              </div>
                              {scene.notes && (
                                <p className="text-[10px] text-slate-400 italic">
                                  {scene.notes}
                                </p>
                              )}
                            </td>

                            <td className="py-3.5 px-2 text-center align-top">
                              <button
                                type="button"
                                onClick={() => {
                                  handleSelectScene(idx);
                                  setActiveTab('visualizer');
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#C5A059] hover:text-[#002366] text-slate-300 transition-colors"
                                title={`Jump to Scene ${scene.sceneNumber}`}
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: 7-STEP METHOD FLOWCHART (INTERACTIVE)             */}
          {/* ========================================================= */}
          {activeTab === 'method_flowchart' && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 text-[#C5A059] text-xs font-bold uppercase tracking-wider">
                  Official Exegetical Methodology
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  The Historical-Grammatical Method Process
                </h3>
                <p className="text-xs text-slate-400">
                  Click on each step below to inspect the exegetical questions, foundational rules, and biblical applications.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* The Step-by-Step Flowchart list */}
                <div className="lg:col-span-6 space-y-3">
                  {HERMENEUTICS_METHOD_STEPS.map((step) => {
                    const isSelected = selectedMethodStep === step.stepNumber;
                    return (
                      <div
                        key={step.stepNumber}
                        onClick={() => setSelectedMethodStep(step.stepNumber)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-[#002366] border-[#C5A059] shadow-xl scale-[1.02]'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-lg text-white"
                            style={{ backgroundColor: step.color }}
                          >
                            {step.stepNumber}
                          </div>
                          <div>
                            <div className="text-[10px] font-mono text-[#C5A059] uppercase font-bold tracking-wider">
                              {step.subtitle}
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                              {step.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                              {step.prompt}
                            </p>
                          </div>
                        </div>

                        <ChevronRight
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            isSelected ? 'text-[#C5A059] translate-x-1' : 'text-slate-600'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Selected Step Deep Dive Inspector */}
                <div className="lg:col-span-6">
                  {(() => {
                    const step = HERMENEUTICS_METHOD_STEPS.find((s) => s.stepNumber === selectedMethodStep) || HERMENEUTICS_METHOD_STEPS[0];
                    return (
                      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0B1530] via-slate-900 to-[#04091A] border border-slate-700 shadow-2xl space-y-5 sticky top-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="px-2.5 py-1 rounded-md text-white font-mono font-bold text-xs shadow"
                              style={{ backgroundColor: step.color }}
                            >
                              STEP {step.stepNumber} OF 7
                            </span>
                            <span className="text-xs text-slate-400 font-mono">{step.subtitle}</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/30">
                            BIBU Standard
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold font-display text-white">
                            {step.title}
                          </h3>
                          <p className="text-sm text-[#C5A059] font-medium mt-1">
                            Primary Exegetical Objective: {step.prompt}
                          </p>
                          <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                            {step.description}
                          </p>
                        </div>

                        <div className="space-y-2.5">
                          <span className="text-xs font-bold text-white font-mono uppercase tracking-wider block">
                            Core Exegetical Questions:
                          </span>
                          <div className="space-y-2">
                            {step.keyQuestions.map((q, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5"
                              >
                                <span className="w-5 h-5 rounded-full bg-[#002366] text-[#C5A059] font-bold text-[10px] flex items-center justify-center shrink-0 border border-[#C5A059]/30">
                                  {idx + 1}
                                </span>
                                <span>{q}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#001744]/70 border border-[#002366] text-xs text-slate-300 flex items-center justify-between">
                          <span className="text-[11px] text-slate-300">
                            See this in action during Lecture Scene 6 (5:00–6:30)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              handleSelectScene(5);
                              setActiveTab('visualizer');
                            }}
                            className="px-3 py-1 bg-[#C5A059] text-[#002366] font-bold text-[11px] rounded-lg hover:bg-[#b38e46] transition-colors"
                          >
                            Jump to Scene 6
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: PHILIPPIANS 4:13 CASE STUDY                        */}
          {/* ========================================================= */}
          {activeTab === 'philippians_study' && (
            <div className="space-y-6">
              <div className="max-w-3xl space-y-2">
                <span className="px-3 py-1 rounded-full bg-blue-950 border border-blue-700/60 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  Featured Case Study (Scene 7: 6:30–8:30)
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  Philippians 4:13 in Context — Not a Slogan, But Contentment in Christ
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The production instructions strictly mandate showing the surrounding literary context (verses 10 to 14) rather than presenting verse 13 in isolation.
                </p>
              </div>

              {/* Surrounding Scripture Display */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-xs font-bold text-white font-mono">
                      {PHILIPPIANS_CONTEXT_PASSAGE.reference}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Historical Setting: {PHILIPPIANS_CONTEXT_PASSAGE.historicalContext}
                  </span>
                </div>

                <div className="space-y-2 font-serif text-sm sm:text-base leading-relaxed">
                  {PHILIPPIANS_CONTEXT_PASSAGE.verses.map((v) => (
                    <div
                      key={v.num}
                      className={`p-3 rounded-xl transition-all flex items-start gap-3 ${
                        v.isHighlight
                          ? 'bg-[#C5A059]/20 border-2 border-[#C5A059] text-white shadow-lg'
                          : 'text-slate-300 hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-md bg-slate-800 text-[#C5A059] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {v.num}
                      </span>
                      <div className="flex-1">
                        <p>{v.text}</p>
                        {v.label && (
                          <span className="inline-block mt-1 text-[10px] font-sans font-bold bg-[#C5A059] text-[#002366] px-2 py-0.5 rounded">
                            {v.label} (Contextually Governed by Verses 11 & 12)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5-Stage Diagram Chain as mandated */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#001744] to-[#0A132C] border border-slate-700 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>Mandated Contextual Diagram: 5-Stage Chain</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {PHILIPPIANS_CONTEXT_PASSAGE.fiveStageFlow.map((stage, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex flex-col justify-between space-y-2 relative shadow"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#C5A059] font-black uppercase tracking-wider block">
                          STAGE {i + 1}
                        </span>
                        <h5 className="font-bold text-white text-xs font-sans">
                          {stage.stage}
                        </h5>
                        <span className="inline-block text-[10px] font-mono text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded">
                          {stage.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug pt-1 border-t border-slate-800">
                        {stage.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: PRODUCTION SPECS, THUMBNAIL & CLOSING SLATE        */}
          {/* ========================================================= */}
          {activeTab === 'production_specs' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Production Direction & Lower-Third Guidelines */}
                <div className="lg:col-span-6 space-y-5">
                  <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                    <h3 className="text-base font-bold text-white font-display">
                      Production Direction Guidelines
                    </h3>
                    <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                        <span className="font-bold text-[#C5A059] block">1. Theological Aesthetic</span>
                        <p>Use a professional theological lecture aesthetic throughout. Academic wood shelving, warm lighting, open leather Bible.</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                        <span className="font-bold text-[#C5A059] block">2. Lecturer Visibility Ratio</span>
                        <p>Keep the lecturer visible on camera for approximately 50–60% of the video. Use supporting split-screens, maps, and flowcharts during complex points.</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                        <span className="font-bold text-[#C5A059] block">3. Subtle Transitions & Typography</span>
                        <p>Display key theological terms in large, legible typography with clean transitions between sections.</p>
                      </div>
                    </div>
                  </div>

                  {/* Lower-Third Specification */}
                  <div className="p-5 rounded-3xl bg-[#001744] border border-[#C5A059]/40 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Lower-Third Identification Graphic
                    </h4>
                    <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#C5A059] text-[#002366] font-black text-sm flex items-center justify-center">
                        BIBU
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#C5A059] uppercase tracking-wider font-display">
                          BIBU THEOLOGY LECTURE
                        </div>
                        <div className="text-sm font-bold text-white font-serif italic">
                          Foundations of Biblical Hermeneutics
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Official Colors & Style */}
                  <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Colors & Style Archetype
                    </h4>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-3 rounded-xl bg-[#002366] text-white font-bold border border-slate-700">
                        Royal Blue
                        <span className="block text-[10px] font-mono font-normal mt-0.5">#002366</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#C5A059] text-[#002366] font-bold border border-slate-700">
                        Gold
                        <span className="block text-[10px] font-mono font-normal mt-0.5">#C5A059</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white text-slate-900 font-bold border border-slate-300">
                        White
                        <span className="block text-[10px] font-mono font-normal mt-0.5">#FFFFFF</span>
                      </div>
                      <div className="p-3 rounded-xl bg-red-600 text-white font-bold border border-red-500">
                        Red Accent
                        <span className="block text-[10px] font-mono font-normal mt-0.5">#DC2626</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 font-serif italic text-center pt-1">
                      Bold • Clear • Professional • Theological
                    </p>
                  </div>
                </div>

                {/* Right: Closing Screen & Thumbnail Card as shown in infographic */}
                <div className="lg:col-span-6 space-y-5">
                  {/* Closing Slate Card */}
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-[#001744] via-[#002366] to-[#080E21] border-2 border-[#C5A059] space-y-3 shadow-2xl text-center">
                    <span className="px-3 py-1 rounded-full bg-[#C5A059] text-[#002366] text-[10px] font-black uppercase tracking-wider">
                      Official Broadcast Closing Screen
                    </span>

                    <div className="pt-2 space-y-2">
                      <div className="w-16 h-16 rounded-2xl bg-[#C5A059] text-[#002366] font-black text-2xl flex items-center justify-center mx-auto shadow-xl">
                        BIBU
                      </div>
                      <h3 className="text-lg sm:text-xl font-black font-display text-white tracking-wide">
                        BREAKTHROUGH INTERNATIONAL BIBLE UNIVERSITY
                      </h3>
                      <div className="text-xs font-black text-[#C5A059] uppercase tracking-widest">
                        BIBU TV
                      </div>
                      <p className="text-xs text-slate-300 font-serif italic">
                        "Equipping God's People for Effective Kingdom Ministry"
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-700/80 text-xs space-y-1">
                      <div className="font-bold text-white text-sm">
                        Foundations of Biblical Hermeneutics
                      </div>
                      <div className="text-[#C5A059] font-mono">
                        Lesson 1: The Historical-Grammatical Method
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Design Box */}
                  <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                      <Film className="w-4 h-4 text-[#C5A059]" />
                      <span>BIBU TV Thumbnail Design Specs</span>
                    </h4>

                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-r from-black via-[#001744] to-[#0A1633] p-4 border border-[#C5A059]/40 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="bg-[#002366] text-[#C5A059] text-[9px] font-bold px-2 py-0.5 rounded border border-[#C5A059]/40">
                          BIBU TV FEATURED TEACHING
                        </span>
                        <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                          BIBU TV
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[10px] font-mono text-[#C5A059] font-bold">
                          FOUNDATIONS OF
                        </div>
                        <div className="text-xl sm:text-2xl font-black font-display text-white tracking-tight leading-none text-[#C5A059]">
                          BIBLICAL HERMENEUTICS
                        </div>
                        <div className="text-xs font-bold text-white uppercase tracking-wide">
                          THE HISTORICAL-GRAMMATICAL METHOD
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono pt-2 border-t border-slate-800">
                        <span>10-MIN MASTER LECTURE</span>
                        <span className="text-[#C5A059]">logos / λόγος</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>High-contrast title for visibility</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Lecturer image for connection</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Scripture & ancient scroll visuals</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>BIBU branding & Royal Blue palette</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* MODAL FOOTER                                              */}
        {/* ========================================================= */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-bold text-slate-300">Breakthrough International Bible University</span>
            <span>•</span>
            <span className="text-[#C5A059]">BIBU TV Production Studio</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                handleStopAudio();
                onClose();
              }}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl font-bold transition-colors"
            >
              Close Storyboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
