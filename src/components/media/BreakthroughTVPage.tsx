import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import { VideoPlayerModal } from './VideoPlayerModal';
import { RelatedSermonsPlaylist } from './RelatedSermonsPlaylist';
import { MediaVideo } from '../../types/media';
import {
  Tv,
  Youtube,
  ExternalLink,
  Play,
  Flame,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Eye,
  Radio,
  Share2,
  Bell,
  Sparkles,
  BookOpen,
  GraduationCap,
  Award,
  Video,
  Shield,
  Layers,
  ChevronRight,
  Filter,
  Check,
  ListVideo,
  LayoutGrid,
  List
} from 'lucide-react';

export const BreakthroughTVPage: React.FC = () => {
  const {
    youtubeSettings,
    mediaVideos,
    tvPrograms,
    setCurrentView,
    recordVideoView
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVideoModal, setSelectedVideoModal] = useState<MediaVideo | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [playlistViewMode, setPlaylistViewMode] = useState<'sidebar' | 'grid'>('sidebar');
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(true);

  // Official categories defined by BIBU
  const programCategories = [
    'All',
    'Live Broadcasts',
    'Sermons',
    'Bible Teaching',
    'Conferences',
    'Graduation',
    'Interviews',
    'Ministry Training',
    'BIBU Chapel Services',
    'Theology Classes',
    'Christian Leadership',
    'University News',
    'Special Events'
  ];

  const channelUrl = youtubeSettings.channelUrl || 'https://www.youtube.com/@Bibuniversity';
  const channelHandle = youtubeSettings.customHandle || '@Bibuniversity';

  // Find featured video from settings or default to dMxf_k7q1M4 or first published featured video
  const featuredVideo: MediaVideo = useMemo(() => {
    if (youtubeSettings.featuredVideoId) {
      const match = mediaVideos.find(v => v.youtubeVideoId === youtubeSettings.featuredVideoId);
      if (match) return match;
    }
    const dMxf = mediaVideos.find(v => v.youtubeVideoId === 'dMxf_k7q1M4');
    if (dMxf) return dMxf;
    return mediaVideos.find(v => v.featured || v.isFeatured) || mediaVideos[0];
  }, [youtubeSettings.featuredVideoId, mediaVideos]);

  // Active playing video on top theater player
  const [activeTheaterVideo, setActiveTheaterVideo] = useState<MediaVideo>(featuredVideo);

  // Sync activeTheaterVideo if featuredVideo changes and current is default
  useEffect(() => {
    if (featuredVideo) {
      setActiveTheaterVideo(featuredVideo);
    }
  }, [featuredVideo]);

  // Filtered video gallery
  const filteredVideos = useMemo(() => {
    return mediaVideos.filter((video) => {
      const matchesSearch =
        !searchQuery ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (video.presenter && video.presenter.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (video.speakerName && video.speakerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (video.tags && video.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory =
        selectedCategory === 'All' ||
        video.category === selectedCategory ||
        (selectedCategory === 'Live Broadcasts' && (video.category === 'Live Broadcasts' || video.isLive)) ||
        (selectedCategory === 'Sermons' && (video.category === 'Sermons' || video.category === 'Sermons & Bible Teaching' || video.category === 'Sermons & Teachings')) ||
        (selectedCategory === 'Bible Teaching' && (video.category === 'Bible Teaching' || video.category === 'Sermons & Bible Teaching' || video.category === 'Bible Studies' || video.category === 'Biblical Studies')) ||
        (selectedCategory === 'Conferences' && (video.category === 'Conferences' || video.category === 'Special Events')) ||
        (selectedCategory === 'Graduation' && (video.category === 'Graduation' || video.category === 'Graduation Ceremonies' || video.category === 'Campus & Convocation')) ||
        (selectedCategory === 'Interviews' && video.category === 'Interviews') ||
        (selectedCategory === 'Ministry Training' && (video.category === 'Ministry Training' || video.category === 'Christian Ministry' || video.category === 'Ministry & Leadership')) ||
        (selectedCategory === 'Theology Classes' && (video.category === 'Theology' || video.category === 'Theology & Doctrine' || video.category === 'Academic Lectures')) ||
        (selectedCategory === 'Christian Leadership' && (video.category === 'Leadership' || video.category === 'Ministry & Leadership')) ||
        (selectedCategory === 'University News' && (video.category === 'News' || video.category === 'University News' || video.category === 'News & Announcements')) ||
        (selectedCategory === 'BIBU Chapel Services' && (video.category === 'Worship' || video.category === 'Prayer' || video.category === 'Prophetic & Prayer' || video.category === 'BIBU Chapel Services'));

      return matchesSearch && matchesCategory;
    });
  }, [mediaVideos, searchQuery, selectedCategory]);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSelectVideo = (video: MediaVideo) => {
    setActiveTheaterVideo(video);
    recordVideoView(video.id);
    const playerElement = document.getElementById('featured-theater-player');
    if (playerElement) {
      playerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenModal = (video: MediaVideo, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedVideoModal(video);
    recordVideoView(video.id);
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 selection:bg-[#C5A059] selection:text-[#002366]">
      {/* 0. TV Announcement Bar if configured */}
      {youtubeSettings.tvAnnouncement && (
        <div id="breakthrough-tv-announcement" className="bg-[#002366] border-b border-[#C5A059]/40 text-slate-100 py-2.5 px-4 text-xs shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="bg-[#C5A059] text-[#002366] text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Notice</span>
              </span>
              <span className="text-slate-200 font-medium text-xs">
                {youtubeSettings.tvAnnouncement}
              </span>
            </div>
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C5A059] hover:text-white text-[11px] font-bold uppercase tracking-wider underline shrink-0 flex items-center gap-1"
            >
              <span>{channelHandle}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* 1. Official Header & Brand Showcase */}
      <header className="relative bg-gradient-to-b from-[#001744] via-[#070D1E] to-[#070D1E] border-b border-slate-800/80 pt-10 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Metadata & Navigation Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
            <div className="flex items-center gap-3">
              <UniversityLogo size="md" withRing className="shadow-lg" />
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Breakthrough International Bible University
                </div>
                <div className="text-[11px] text-[#C5A059] font-medium">
                  Official Global Media & Television Network
                </div>
              </div>
            </div>

            {/* Quick Navigation / Related Media shortcuts */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <button
                onClick={() => {
                  setCurrentView('bibu-radio');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Radio className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>BIBU Radio 24/7</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView('media-center');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Media Hub</span>
              </button>
              <a
                href="#live-stream-section"
                className="px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800/60 hover:bg-rose-900/60 text-rose-300 flex items-center gap-1.5 transition-colors"
              >
                <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>Live Studio</span>
              </a>
            </div>
          </div>

          {/* Breakthrough TV Hero Display */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-600/20 border border-rose-500/40 text-rose-400 text-xs font-black uppercase tracking-widest">
                <Tv className="w-4 h-4 text-rose-500" />
                <span>BIBU TV • Official Television Network</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              </div>

              {/* Title & Subtitle as strictly mandated */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white tracking-tight leading-tight">
                BIBU TV
                <span className="block text-xl sm:text-2xl lg:text-3xl text-[#C5A059] font-serif font-normal mt-1">
                  Breakthrough International Bible University
                </span>
              </h1>

              <div className="text-sm sm:text-base font-display font-semibold text-[#C5A059] tracking-wide flex items-center gap-2 flex-wrap">
                <span>Faith</span>
                <span className="text-slate-500">•</span>
                <span>Education</span>
                <span className="text-slate-500">•</span>
                <span>Leadership</span>
                <span className="text-slate-500">•</span>
                <span>Transformation</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Watch sermons, teachings, ministry programs, conferences, interviews and other Christian educational content from Breakthrough International Bible University.
              </p>

              {/* Channel badge */}
              <div className="flex items-center gap-3 pt-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-xs text-slate-200">
                  <div className="w-5 h-5 rounded bg-rose-600 flex items-center justify-center text-white">
                    <Youtube className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="font-bold text-white font-mono">{channelHandle}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
                </div>
                <span className="text-xs text-slate-400">
                  {youtubeSettings.subscribersCount?.toLocaleString() || '24,500'}+ Subscribers • {youtubeSettings.totalVideosCount || '148'} Master Lectures
                </span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              {/* MANDATED BUTTON 1: WATCH BREAKTHROUGH TV ON YOUTUBE */}
              <a
                id="watch-breakthrough-tv-youtube-btn"
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2.5 group"
              >
                <Youtube className="w-5 h-5 fill-current group-hover:rotate-12 transition-transform" />
                <span>WATCH BREAKTHROUGH TV ON YOUTUBE</span>
                <ExternalLink className="w-3.5 h-3.5 text-rose-200" />
              </a>

              {/* MANDATED BUTTON 2: SUBSCRIBE TO BIBU ON YOUTUBE */}
              <a
                id="subscribe-bibu-youtube-btn"
                href={`${channelUrl}?sub_confirmation=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2.5"
              >
                <Bell className="w-4 h-4 text-[#002366]" />
                <span>SUBSCRIBE TO BIBU ON YOUTUBE</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* ========================================================= */}
        {/* SECTION 1: LIVE / FEATURED VIDEO (PROMINENT AT TOP)       */}
        {/* ========================================================= */}
        {(() => {
          const startSec = activeTheaterVideo.startTimeSeconds ?? (activeTheaterVideo.youtubeVideoId === 'dMxf_k7q1M4' ? 1642 : undefined);
          const theaterStartParam = startSec ? `&start=${startSec}` : '';
          const directYoutubeUrl = activeTheaterVideo.youtubeUrl || (startSec
            ? `https://www.youtube.com/watch?v=${activeTheaterVideo.youtubeVideoId}&t=${startSec}s`
            : `https://www.youtube.com/watch?v=${activeTheaterVideo.youtubeVideoId}`);

          return (
            <section id="featured-theater-player" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                  <h2 className="text-lg sm:text-xl font-display font-bold text-white flex items-center gap-2">
                    <span>Featured Broadcast</span>
                    <span className="text-xs font-normal text-slate-400 font-sans hidden sm:inline">| BIBU TV Official Broadcast</span>
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Playlist View Switcher: Sidebar vs Grid */}
                  <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 shadow-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setIsPlaylistVisible(true);
                        setPlaylistViewMode('sidebar');
                      }}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        isPlaylistVisible && playlistViewMode === 'sidebar'
                          ? 'bg-[#C5A059] text-[#002366] shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Show Related Sermons Playlist as a Sidebar"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Playlist Sidebar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsPlaylistVisible(true);
                        setPlaylistViewMode('grid');
                      }}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        isPlaylistVisible && playlistViewMode === 'grid'
                          ? 'bg-[#C5A059] text-[#002366] shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Show Related Sermons Playlist as an Expanded Grid"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Playlist Grid</span>
                    </button>
                  </div>

                  <button
                    onClick={handleShare}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                    title="Share video link"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#C5A059]" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                  </button>
                  <a
                    href={directYoutubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                    <span className="hidden sm:inline">Open on YouTube</span>
                  </a>
                </div>
              </div>

              {/* Main Theater Layout: Sidebar or Grid for Related Sermons Playlist */}
              {isPlaylistVisible && playlistViewMode === 'sidebar' ? (
                /* ================= SIDEBAR MODE ================= */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left (8 cols): Cinematic 16:9 Responsive YouTube Player */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="bg-[#0B1530] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                      <div className="relative w-full aspect-video bg-black">
                        <iframe
                          id="breakthrough-tv-featured-iframe"
                          src={`https://www.youtube.com/embed/${activeTheaterVideo.youtubeVideoId}?rel=0&modestbranding=1${theaterStartParam}`}
                          title={activeTheaterVideo.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>

                      {/* Video Meta Info Footer */}
                      <div className="p-6 sm:p-7 space-y-5 bg-gradient-to-t from-[#091124] to-[#0B1530]">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="bg-[#C5A059] text-[#002366] text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
                                {activeTheaterVideo.category}
                              </span>
                              {startSec && (
                                <span className="bg-amber-500/20 text-[#C5A059] border border-[#C5A059]/40 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Starts at {Math.floor(startSec / 60)}:{(startSec % 60).toString().padStart(2, '0')}</span>
                                </span>
                              )}
                              {activeTheaterVideo.isLive && (
                                <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded animate-pulse">
                                  LIVE BROADCAST
                                </span>
                              )}
                              {activeTheaterVideo.associatedCourseCode && (
                                <span className="bg-slate-800 text-slate-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-700">
                                  {activeTheaterVideo.associatedCourseCode}
                                </span>
                              )}
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                              {activeTheaterVideo.title}
                            </h3>

                            {activeTheaterVideo.subtitle && (
                              <p className="text-xs sm:text-sm text-[#C5A059] font-medium">
                                {activeTheaterVideo.subtitle}
                              </p>
                            )}
                          </div>

                          {/* Speaker & Stats */}
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 shrink-0 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                            <div className="flex items-center gap-2 text-slate-200">
                              <div className="w-8 h-8 rounded-full bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold text-xs border border-[#C5A059]/40 overflow-hidden shrink-0">
                                {activeTheaterVideo.presenterPhoto ? (
                                  <img src={activeTheaterVideo.presenterPhoto} alt={activeTheaterVideo.presenter || ''} className="w-full h-full object-cover" />
                                ) : (
                                  <User className="w-4 h-4" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-white text-xs">{activeTheaterVideo.presenter || activeTheaterVideo.speakerName || 'BIBU Faculty'}</div>
                                <div className="text-[10px] text-slate-400">{activeTheaterVideo.presenterTitle || activeTheaterVideo.speakerTitle || 'Theological Lecturer'}</div>
                              </div>
                            </div>

                            <div className="border-l border-slate-800 pl-4 space-y-1">
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                                <span>{activeTheaterVideo.duration}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <Eye className="w-3.5 h-3.5 text-blue-400" />
                                <span>{activeTheaterVideo.viewsCount.toLocaleString()} views</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {activeTheaterVideo.description}
                        </p>

                        {/* Bible References if available */}
                        {activeTheaterVideo.bibleReferences && activeTheaterVideo.bibleReferences.length > 0 && (
                          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                            <span className="text-[#C5A059] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Scripture References:</span>
                            </span>
                            {activeTheaterVideo.bibleReferences.map((ref, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700/60">
                                {ref}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Button: Watch on YouTube below video */}
                        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <a
                              id="watch-on-youtube-featured-btn"
                              href={directYoutubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2.5 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all hover:scale-105 group"
                            >
                              <Youtube className="w-5 h-5 fill-current group-hover:rotate-12 transition-transform" />
                              <span>Watch on YouTube</span>
                              <ExternalLink className="w-3.5 h-3.5 text-rose-200" />
                            </a>

                            {startSec && (
                              <span className="text-xs text-slate-400 hidden md:inline">
                                Starts playback at <strong>{Math.floor(startSec / 60)}:{(startSec % 60).toString().padStart(2, '0')}</strong> ({startSec}s)
                              </span>
                            )}
                          </div>

                          <a
                            href={`${channelUrl}?sub_confirmation=1`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all"
                          >
                            <Bell className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>Subscribe to {channelHandle}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right (4 cols): Playlist of Other Related Sermon Videos Sidebar */}
                  <div className="lg:col-span-4 lg:sticky lg:top-6">
                    <RelatedSermonsPlaylist
                      activeVideoId={activeTheaterVideo.youtubeVideoId || activeTheaterVideo.id}
                      onSelectVideo={handleSelectVideo}
                      viewMode="sidebar"
                      onToggleViewMode={(mode) => setPlaylistViewMode(mode)}
                    />
                  </div>
                </div>
              ) : (
                /* ================= GRID MODE ================= */
                <div className="space-y-6">
                  {/* Full Width Cinematic 16:9 Responsive YouTube Player */}
                  <div className="bg-[#0B1530] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="relative w-full aspect-video bg-black">
                      <iframe
                        id="breakthrough-tv-featured-iframe"
                        src={`https://www.youtube.com/embed/${activeTheaterVideo.youtubeVideoId}?rel=0&modestbranding=1${theaterStartParam}`}
                        title={activeTheaterVideo.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>

                    {/* Video Meta Info Footer */}
                    <div className="p-6 sm:p-8 space-y-5 bg-gradient-to-t from-[#091124] to-[#0B1530]">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-[#C5A059] text-[#002366] text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
                              {activeTheaterVideo.category}
                            </span>
                            {startSec && (
                              <span className="bg-amber-500/20 text-[#C5A059] border border-[#C5A059]/40 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Starts at {Math.floor(startSec / 60)}:{(startSec % 60).toString().padStart(2, '0')}</span>
                              </span>
                            )}
                            {activeTheaterVideo.isLive && (
                              <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded animate-pulse">
                                LIVE BROADCAST
                              </span>
                            )}
                            {activeTheaterVideo.associatedCourseCode && (
                              <span className="bg-slate-800 text-slate-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-700">
                                {activeTheaterVideo.associatedCourseCode}
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                            {activeTheaterVideo.title}
                          </h3>

                          {activeTheaterVideo.subtitle && (
                            <p className="text-xs sm:text-sm text-[#C5A059] font-medium">
                              {activeTheaterVideo.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Speaker & Stats */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 shrink-0 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                          <div className="flex items-center gap-2 text-slate-200">
                            <div className="w-8 h-8 rounded-full bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold text-xs border border-[#C5A059]/40 overflow-hidden shrink-0">
                              {activeTheaterVideo.presenterPhoto ? (
                                <img src={activeTheaterVideo.presenterPhoto} alt={activeTheaterVideo.presenter || ''} className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white text-xs">{activeTheaterVideo.presenter || activeTheaterVideo.speakerName || 'BIBU Faculty'}</div>
                              <div className="text-[10px] text-slate-400">{activeTheaterVideo.presenterTitle || activeTheaterVideo.speakerTitle || 'Theological Lecturer'}</div>
                            </div>
                          </div>

                          <div className="border-l border-slate-800 pl-4 space-y-1">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                              <span>{activeTheaterVideo.duration}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Eye className="w-3.5 h-3.5 text-blue-400" />
                              <span>{activeTheaterVideo.viewsCount.toLocaleString()} views</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {activeTheaterVideo.description}
                      </p>

                      {/* Bible References if available */}
                      {activeTheaterVideo.bibleReferences && activeTheaterVideo.bibleReferences.length > 0 && (
                        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                          <span className="text-[#C5A059] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Scripture References:</span>
                          </span>
                          {activeTheaterVideo.bibleReferences.map((ref, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700/60">
                              {ref}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Button: Watch on YouTube below video */}
                      <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <a
                            id="watch-on-youtube-featured-btn"
                            href={directYoutubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all hover:scale-105 group"
                          >
                            <Youtube className="w-5 h-5 fill-current group-hover:rotate-12 transition-transform" />
                            <span>Watch on YouTube</span>
                            <ExternalLink className="w-3.5 h-3.5 text-rose-200" />
                          </a>

                          {startSec && (
                            <span className="text-xs text-slate-400 hidden md:inline">
                              Starts playback at <strong>{Math.floor(startSec / 60)}:{(startSec % 60).toString().padStart(2, '0')}</strong> ({startSec}s)
                            </span>
                          )}
                        </div>

                        <a
                          href={`${channelUrl}?sub_confirmation=1`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all"
                        >
                          <Bell className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Subscribe to {channelHandle}</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Grid View of Related Sermons Playlist */}
                  <RelatedSermonsPlaylist
                    activeVideoId={activeTheaterVideo.youtubeVideoId || activeTheaterVideo.id}
                    onSelectVideo={handleSelectVideo}
                    viewMode="grid"
                    onToggleViewMode={(mode) => setPlaylistViewMode(mode)}
                  />
                </div>
              )}
            </section>
          );
        })()}

        {/* ========================================================= */}
        {/* SECTION 4: YOUTUBE LIVE (WITH ACTIVE OR OFFLINE STATE)     */}
        {/* ========================================================= */}
        <section id="live-stream-section" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg sm:text-xl font-display font-bold text-white">
                BIBU YouTube Live Broadcast
              </h2>
            </div>
            {youtubeSettings.isLiveBroadcasting && (
              <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs uppercase tracking-wider animate-pulse flex items-center gap-1.5 shadow-lg shadow-rose-950">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>ON AIR NOW</span>
              </span>
            )}
          </div>

          {youtubeSettings.isLiveBroadcasting ? (
            /* ACTIVE LIVE STREAM STATE */
            <div className="bg-[#0B1530] rounded-2xl border-2 border-rose-600/50 p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider">
                      LIVE TRANSMISSION
                    </span>
                    <span className="text-xs text-rose-400 font-bold flex items-center gap-1 font-mono">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{youtubeSettings.liveViewersCount || 642} watching worldwide</span>
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    {youtubeSettings.liveProgramTitle || 'BIBU Global Academic Convocation & Chapel Service'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Speaker / Host: <strong className="text-[#C5A059]">{youtubeSettings.livePresenter || 'Dr. Michael C. Sterling, Th.D.'}</strong>
                  </p>
                </div>

                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all hover:scale-105 flex items-center gap-2 self-start sm:self-auto"
                >
                  <Youtube className="w-4 h-4 fill-current" />
                  <span>Join Live Chat on YouTube</span>
                </a>
              </div>

              {/* Responsive Live Embed */}
              <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-inner border border-slate-800">
                <iframe
                  id="breakthrough-tv-live-iframe"
                  src={`https://www.youtube.com/embed/${youtubeSettings.liveStreamVideoId || 'jfKfPfyJRdk'}?autoplay=1&rel=0`}
                  title="BIBU YouTube Live Stream"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {youtubeSettings.liveProgramDescription || 'Broadcasting live worldwide from the Phoenix, Arizona Main Academic Auditorium and Chapel. Hosted by Chancellor Dr. Michael C. Sterling and Dean Dr. Thomas E. Wright.'}
              </p>
            </div>
          ) : (
            /* MANDATED OFFLINE STATE:
               "BREAKTHROUGH TV — No Live Broadcast Currently"
               with a button to visit the YouTube channel */
            <div id="breakthrough-tv-offline-state" className="bg-[#0B1530] rounded-2xl border border-slate-800 p-8 sm:p-12 text-center space-y-5 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-slate-500 border border-slate-800 flex items-center justify-center mx-auto shadow-inner">
                <Tv className="w-8 h-8 text-slate-500" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  BREAKTHROUGH TV — No Live Broadcast Currently
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  The official BIBU livestream is currently off-air. You can watch archived lectures, full chapel services, and keynote convocations on our official YouTube channel.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Youtube className="w-4 h-4 fill-current" />
                  <span>WATCH BREAKTHROUGH TV ON YOUTUBE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => {
                    setCurrentView('media-programs');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#C5A059]" />
                  <span>View TV Broadcast Schedule</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ========================================================= */}
        {/* SECTION 5: PROGRAMS (ALL 11 OFFICIAL MANDATED CATEGORIES) */}
        {/* ========================================================= */}
        <section id="programs-categories-section" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#C5A059]" />
                <span>Breakthrough TV Programs</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Explore official broadcasting programs organized across 11 key theological and ministerial categories
              </p>
            </div>
            <span className="text-xs font-mono text-[#C5A059] font-bold">11 Core Categories</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              {
                title: 'BIBU Chapel Services',
                desc: 'Weekly university fellowship, praise, worship, and spiritual empowerment from the campus pulpit.',
                icon: ChurchIcon,
                count: '32 Lectures'
              },
              {
                title: 'Sermons & Bible Teaching',
                desc: 'In-depth, verse-by-verse expository preaching and sound doctrinal messages by faculty elders.',
                icon: BookOpen,
                count: '48 Sermons'
              },
              {
                title: 'Theology Classes',
                desc: 'Accredited university masterclasses: Systematic Theology, Greek & Hebrew syntax, and Hermeneutics.',
                icon: GraduationCap,
                count: '64 Classes'
              },
              {
                title: 'Christian Leadership',
                desc: 'Executive ministry governance, ethics, and kingdom organizational administration.',
                icon: Shield,
                count: '28 Series'
              },
              {
                title: 'Ministry Training',
                desc: 'Practical skills: Pastoral care protocols, hospital chaplaincy, church planting, and evangelism.',
                icon: Award,
                count: '36 Workshops'
              },
              {
                title: 'Graduation Ceremonies',
                desc: 'Official commencements, degree conferrals, and honorary doctoral investitures across 50 nations.',
                icon: GraduationCap,
                count: '16 Ceremonies'
              },
              {
                title: 'Conferences',
                desc: 'Global theological symposiums, missions forums, and pastoral roundtables.',
                icon: UsersIcon,
                count: '22 Summits'
              },
              {
                title: 'Interviews',
                desc: 'In-depth discussions with university leaders, visiting international scholars, and bishops.',
                icon: MicIcon,
                count: '19 Interviews'
              },
              {
                title: 'Testimonies',
                desc: 'Inspiring alumni stories of church planting, missionary breakthroughs, and community impact.',
                icon: Sparkles,
                count: '25 Stories'
              },
              {
                title: 'University News',
                desc: 'Academic advisories, 47 County examination centre announcements, and RPL updates.',
                icon: NewspaperIcon,
                count: '14 Bulletins'
              },
              {
                title: 'Special Events',
                desc: 'Global days of prayer, campus dedications, international webinars, and ministry summits.',
                icon: Flame,
                count: '12 Events'
              }
            ].map((prog, idx) => {
              const isSelected = selectedCategory === prog.title;
              const IconComp = prog.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedCategory(prog.title);
                    const galleryElem = document.getElementById('video-gallery-section');
                    if (galleryElem) {
                      galleryElem.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#002366] border-[#C5A059] shadow-lg shadow-[#002366]/40'
                      : 'bg-[#0B1530] border-slate-800 hover:border-[#C5A059]/50 hover:bg-[#0E1A3D]'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#C5A059] text-[#002366]'
                          : 'bg-slate-900 text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-[#002366]'
                      }`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {prog.count}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors">
                      {prog.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {prog.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#C5A059]">
                    <span>Browse Category</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: RESPONSIVE VIDEO GALLERY (DESKTOP/TABLET/MOBILE)*/}
        {/* ========================================================= */}
        <section id="video-gallery-section" className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-rose-500" />
                <span>BIBU Video Gallery</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Official YouTube uploads from @Bibuniversity • Responsive on Desktop, Tablet, and Mobile
              </p>
            </div>

            {/* Search Input Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lectures, pastors, topics..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
            {programCategories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    active
                      ? 'bg-[#C5A059] text-[#002366] shadow-md scale-105'
                      : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Video Grid: 1 col (mobile), 2 cols (tablet), 3-4 cols (desktop) */}
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video) => {
                const isCurrentTheater = activeTheaterVideo.id === video.id;
                return (
                  <div
                    key={video.id}
                    onClick={() => handleSelectVideo(video)}
                    className={`bg-[#0B1530] rounded-2xl border overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between ${
                      isCurrentTheater
                        ? 'border-[#C5A059] ring-2 ring-[#C5A059]/40'
                        : 'border-slate-800 hover:border-[#C5A059]/50'
                    }`}
                  >
                    {/* Thumbnail with overlay & badge */}
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img
                        src={video.thumbnail || video.thumbnailUrl || `https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=600`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current translate-x-0.5" />
                        </div>
                      </div>

                      {/* Duration */}
                      <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                        {video.duration}
                      </span>

                      {/* Category Tag */}
                      <span className="absolute top-2 left-2 bg-[#002366]/90 text-[#C5A059] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-[#C5A059]/30">
                        {video.category}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors line-clamp-2 leading-snug">
                          {video.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {video.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-300 truncate max-w-[150px]">
                            {video.presenter || video.speakerName || 'BIBU Faculty'}
                          </span>
                          <span className="font-mono">{video.viewsCount.toLocaleString()} views</span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] pt-1">
                          <button
                            onClick={(e) => handleOpenModal(video, e)}
                            className="text-[#C5A059] hover:underline font-bold flex items-center gap-1"
                          >
                            <span>Open Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                          <span className="text-slate-500">
                            {new Date(video.publishedAt || video.publishedDate || '2026-08-01').toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-[#0B1530] rounded-2xl border border-slate-800 space-y-3">
              <Search className="w-8 h-8 text-slate-500 mx-auto" />
              <div className="text-base font-bold text-white">No broadcast lectures match your filter</div>
              <p className="text-xs text-slate-400">Try adjusting your search terms or select "All" categories.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 bg-[#C5A059] text-[#002366] text-xs font-bold uppercase rounded-lg shadow"
              >
                Reset Filter
              </button>
            </div>
          )}
        </section>

        {/* ========================================================= */}
        {/* SECTION 6: SUBSCRIBE CALLOUT (CLEAR MANDATED SECTION)      */}
        {/* ========================================================= */}
        <section className="relative bg-gradient-to-r from-[#001744] via-[#002366] to-[#0A2E73] rounded-3xl p-8 sm:p-12 border-2 border-[#C5A059] shadow-2xl text-white overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold uppercase tracking-widest">
              <Youtube className="w-4 h-4 fill-current text-rose-500" />
              <span>Official YouTube Ministry</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-display font-black text-white leading-tight">
              SUBSCRIBE TO BIBU ON YOUTUBE
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
              Stay connected with daily morning chapel prayers, accredited diploma and degree lecture drops, live commencement ceremonies, and kingdom leadership masterclasses broadcast straight from @Bibuniversity.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                id="subscribe-callout-btn"
                href={`${channelUrl}?sub_confirmation=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all hover:scale-105 flex items-center gap-2.5"
              >
                <Youtube className="w-5 h-5 fill-current" />
                <span>SUBSCRIBE TO BIBU ON YOUTUBE</span>
              </a>

              <a
                id="visit-channel-callout-btn"
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition-all flex items-center gap-2"
              >
                <span>WATCH BREAKTHROUGH TV ON YOUTUBE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Video Player Modal when user clicks "Open Details" */}
      {selectedVideoModal && (
        <VideoPlayerModal
          video={selectedVideoModal}
          onClose={() => setSelectedVideoModal(null)}
        />
      )}
    </div>
  );
};

// Sub-icon components for custom categories
function ChurchIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Sparkles {...(props as any)} />;
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return <GraduationCap {...(props as any)} />;
}

function MicIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Radio {...(props as any)} />;
}

function NewspaperIcon(props: React.SVGProps<SVGSVGElement>) {
  return <BookOpen {...(props as any)} />;
}
