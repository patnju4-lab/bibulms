import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaVideo } from '../../types/media';
import {
  X,
  Play,
  Heart,
  Bookmark,
  Share2,
  Download,
  Eye,
  Calendar,
  Clock,
  User,
  BookOpen,
  FileText,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

interface VideoPlayerModalProps {
  video: MediaVideo | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const {
    currentUser,
    toggleStudentBookmarkVideo,
    toggleStudentFavoriteVideo,
    studentMediaProgress,
    mediaVideos,
    setActivePlayingVideo,
    setCurrentView,
    recordVideoView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'transcript' | 'related'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!video) return null;

  const userProgress = currentUser
    ? studentMediaProgress.find(p => p.studentId === currentUser.id && p.videoId === video.id)
    : undefined;

  const isBookmarked = userProgress?.isBookmarked || false;
  const isFavorite = userProgress?.isFavorite || false;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const relatedVideos = mediaVideos
    .filter(v => v.id !== video.id && (v.category === video.category || v.speakerName === video.speakerName))
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-[#0B132B] text-slate-100 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl border border-slate-700/80 flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-4 py-3 bg-[#070D1E] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#C5A059] text-[#002366] text-[10px] font-black uppercase px-2 py-0.5 rounded">
              {video.category}
            </span>
            {video.isLive && (
              <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded animate-pulse">
                LIVE BROADCAST
              </span>
            )}
            <span className="text-xs text-slate-300 font-medium hidden sm:inline">
              Breakthrough International Bible University TV
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Frame Container (Responsive 16:9 Embed) */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {(() => {
            const startParam = video.startTimeSeconds
              ? `&start=${video.startTimeSeconds}`
              : video.youtubeVideoId === 'dMxf_k7q1M4'
              ? '&start=1642'
              : '';
            return (
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeVideoId}?autoplay=1&rel=0&modestbranding=1${startParam}`}
                title={video.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            );
          })()}
        </div>

        {/* Body Content with Tabs */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Title and Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                {video.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
                <span className="flex items-center gap-1 text-[#C5A059] font-semibold">
                  <User className="w-3.5 h-3.5" />
                  <span>{video.speakerName} {video.speakerTitle && `(${video.speakerTitle})`}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(video.publishedDate).toLocaleDateString()}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{video.duration}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{video.viewsCount.toLocaleString()} views</span>
                </span>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => toggleStudentFavoriteVideo(video.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isFavorite
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? 'Liked' : 'Like'}</span>
              </button>

              <button
                onClick={() => toggleStudentBookmarkVideo(video.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isBookmarked
                    ? 'bg-[#C5A059] text-[#002366]'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'Saved to Study' : 'Save for Study'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>

              <a
                href={
                  video.youtubeUrl ||
                  (video.startTimeSeconds || video.youtubeVideoId === 'dMxf_k7q1M4'
                    ? `https://www.youtube.com/watch?v=${video.youtubeVideoId}&t=${video.startTimeSeconds || 1642}s`
                    : `https://www.youtube.com/watch?v=${video.youtubeVideoId}`)
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-md"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Watch on YouTube</span>
              </a>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 px-3 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#C5A059] text-[#C5A059]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Lecture Overview
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-2 px-3 border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-[#C5A059] text-[#C5A059]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Study Notes & Outline
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`pb-2 px-3 border-b-2 transition-colors ${
                activeTab === 'transcript'
                  ? 'border-[#C5A059] text-[#C5A059]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Theological Summary
            </button>
            <button
              onClick={() => setActiveTab('related')}
              className={`pb-2 px-3 border-b-2 transition-colors ${
                activeTab === 'related'
                  ? 'border-[#C5A059] text-[#C5A059]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Related Lectures ({relatedVideos.length})
            </button>
          </div>

          {/* Tab Panes */}
          {activeTab === 'overview' && (
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>{video.description}</p>

              {video.scriptureReference && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">Scripture Focus</div>
                    <div className="text-white font-medium">{video.scriptureReference}</div>
                  </div>
                </div>
              )}

              {video.tags && video.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-2">
                  <span className="text-xs text-slate-400">Topics:</span>
                  {video.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[11px] bg-slate-800 text-slate-300 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {video.relatedCourseId && (
                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-5 h-5 text-[#C5A059]" />
                    <div>
                      <div className="text-xs text-slate-400">Accredited Course Connection</div>
                      <div className="text-sm font-bold text-white">Course Reference: {video.relatedCourseId}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      setCurrentView('classroom');
                    }}
                    className="px-3 py-1.5 bg-[#C5A059] text-[#002366] text-xs font-bold rounded-lg hover:bg-[#B38E46] transition-colors"
                  >
                    Open Classroom
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3 text-sm text-slate-300">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#C5A059]" />
                    <span>Official Lecture Notes & Exegesis Outline</span>
                  </span>
                  <button
                    onClick={() => alert("Downloading PDF Study Guide for: " + video.title)}
                    className="flex items-center gap-1 text-xs text-[#C5A059] hover:underline font-bold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF Notes</span>
                  </button>
                </div>
                <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-2 text-slate-300">
                  <p><strong>1. Introduction & Context:</strong> Historical setting and contextual background of the passage.</p>
                  <p><strong>2. Core Theological Proposition:</strong> Developing sound hermeneutical understanding and pastoral application.</p>
                  <p><strong>3. Practical Ministry Execution:</strong> Translating foundational biblical truth into transformative leadership within the local church and global mission field.</p>
                  <p><strong>4. Study Question for Reflection:</strong> How does this principle redefine our approach to contemporary global discipleship?</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transcript' && (
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-white mb-2">Theological & Academic Summary:</div>
              <p>
                This broadcast by {video.speakerName} provides a foundational examination of {video.category}.
                Through rigorous scriptural exposition and historical biblical cross-referencing, learners are equipped
                to rightly divide the word of truth (2 Timothy 2:15).
              </p>
              <p>
                Key biblical tenets covered include covenantal integrity, apostolic succession of sound doctrine,
                servant leadership paradigms, and the global mandate of the Great Commission (Matthew 28:19-20).
              </p>
            </div>
          )}

          {activeTab === 'related' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedVideos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setActivePlayingVideo(item);
                    recordVideoView(item.id);
                  }}
                  className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 cursor-pointer flex gap-3 transition-colors group"
                >
                  <div className="relative w-28 aspect-video bg-black rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded">
                      {item.duration}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white line-clamp-2 group-hover:text-[#C5A059] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 truncate">{item.speakerName}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">{item.viewsCount.toLocaleString()} views</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
