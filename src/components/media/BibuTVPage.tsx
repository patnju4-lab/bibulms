import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaHeader } from './MediaHeader';
import { VideoPlayerModal } from './VideoPlayerModal';
import { MediaVideo } from '../../types/media';
import {
  Tv,
  Play,
  Flame,
  Heart,
  Bookmark,
  Share2,
  Calendar,
  Clock,
  Eye,
  User,
  BookOpen,
  GraduationCap,
  Sparkles,
  Search,
  Filter,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Award
} from 'lucide-react';

export const BibuTVPage: React.FC = () => {
  const {
    mediaVideos,
    tvPrograms,
    mediaPresenters,
    activePlayingVideo,
    setActivePlayingVideo,
    recordVideoView,
    selectedMediaCategory,
    setSelectedMediaCategory,
    setCurrentView
  } = useApp();

  const [selectedVideoForModal, setSelectedVideoForModal] = useState<MediaVideo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('All');

  // Featured video is either marked featured or the first live/theological video
  const featuredVideo = mediaVideos.find(v => v.isFeatured) || mediaVideos[0];

  // Filtered videos
  const filteredVideos = mediaVideos.filter(v => {
    const matchesCategory = selectedMediaCategory === 'All' || v.category === selectedMediaCategory;
    const matchesSpeaker = selectedSpeaker === 'All' || v.speakerName === selectedSpeaker;
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.speakerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.tags && v.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSpeaker && matchesSearch;
  });

  const popularVideos = [...mediaVideos].sort((a, b) => b.viewsCount - a.viewsCount).slice(0, 4);
  const liveOrUpcoming = mediaVideos.filter(v => v.isLive);
  const speakers = ['All', ...Array.from(new Set(mediaVideos.map(v => v.speakerName)))];

  const handleOpenVideo = (video: MediaVideo) => {
    setSelectedVideoForModal(video);
    recordVideoView(video.id);
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100">
      {/* Header */}
      <MediaHeader
        activeSubsection="bibu-tv"
        title="BREAKTHROUGH INTERNATIONAL BIBLE UNIVERSITY TV"
        subtitle="Teaching • Theology • Ministry • Leadership • Kingdom Transformation"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Featured Video Showcase Section */}
        {featuredVideo && (
          <div className="bg-[#0B1530] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-600 text-white">
                  <Flame className="w-4 h-4" />
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-[#C5A059]">
                  Featured Broadcast & Theological Keynote
                </span>
              </div>
              <span className="text-xs text-slate-400">
                HD 1080p • Global Broadcast
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Responsive 16:9 Video Embed Player */}
              <div className="lg:col-span-8">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black border border-slate-700/80 group">
                  <iframe
                    src={`https://www.youtube.com/embed/${featuredVideo.youtubeVideoId}?rel=0&modestbranding=1`}
                    title={featuredVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Video Info Details */}
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#C5A059] text-[#002366]">
                    {featuredVideo.category}
                  </span>
                  {featuredVideo.isLive && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white animate-pulse">
                      LIVE ON AIR
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-display text-white leading-snug">
                  {featuredVideo.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                  {featuredVideo.description}
                </p>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Speaker:</span>
                    <span className="font-bold text-[#C5A059]">{featuredVideo.speakerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Scripture Ref:</span>
                    <span className="font-medium text-white">{featuredVideo.scriptureReference || '2 Timothy 2:15'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span className="font-mono text-slate-200">{featuredVideo.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Views:</span>
                    <span className="font-bold text-white">{featuredVideo.viewsCount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleOpenVideo(featuredVideo)}
                    className="flex-1 py-2.5 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Study Notes & Outline</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${featuredVideo.youtubeVideoId}`);
                      alert("Broadcast link copied to clipboard!");
                    }}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
                    title="Share Broadcast"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Broadcast Indicator Bar (if live shows exist) */}
        {liveOrUpcoming.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-rose-950/60 via-slate-900 to-rose-950/60 rounded-xl border border-rose-600/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-600"></span>
              </span>
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-rose-400">
                  Live Global Satellite & Web Broadcast
                </div>
                <div className="text-sm font-bold text-white">
                  {liveOrUpcoming[0].title} — Airing Now Worldwide
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('live-tv')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow transition-all hover:scale-105"
            >
              Enter Live Broadcast Studio &rarr;
            </button>
          </div>
        )}

        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0B1530] p-4 rounded-xl border border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search lectures by topic, scripture, title, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
              <Filter className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Speaker:</span>
            </div>
            <select
              value={selectedSpeaker}
              onChange={(e) => setSelectedSpeaker(e.target.value)}
              className="bg-slate-900 text-white text-xs border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-[#C5A059]"
            >
              {speakers.map((spk) => (
                <option key={spk} value={spk}>
                  {spk}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Video Grid Catalog */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                <Tv className="w-5 h-5 text-[#C5A059]" />
                <span>BIBU TV Video Library & Lecture Archives</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {filteredVideos.length} published broadcast recordings
              </p>
            </div>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="p-12 text-center bg-[#0B1530] rounded-2xl border border-slate-800">
              <Tv className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white">No broadcasts match your query</h4>
              <p className="text-xs text-slate-400 mt-1">
                Try selecting "All" categories or clearing your search keywords.
              </p>
              <button
                onClick={() => {
                  setSelectedMediaCategory('All');
                  setSelectedSpeaker('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-[#C5A059] text-[#002366] text-xs font-bold rounded-lg uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-[#0B1530] rounded-2xl border border-slate-800 hover:border-[#C5A059]/50 overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col group"
                >
                  {/* Thumbnail Container */}
                  <div
                    onClick={() => handleOpenVideo(video)}
                    className="relative aspect-video bg-black cursor-pointer overflow-hidden"
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                    {/* Play Badge Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <div className="w-12 h-12 rounded-full bg-[#C5A059] text-[#002366] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </div>
                    </div>

                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#002366]/90 text-[#C5A059] border border-[#C5A059]/40 backdrop-blur-sm">
                      {video.category}
                    </span>

                    <span className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-white backdrop-blur-sm">
                      {video.duration}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4
                        onClick={() => handleOpenVideo(video)}
                        className="text-sm font-bold text-white line-clamp-2 hover:text-[#C5A059] cursor-pointer transition-colors"
                      >
                        {video.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {video.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 text-[#C5A059] font-medium truncate max-w-[160px]">
                          <User className="w-3 h-3 shrink-0" />
                          <span className="truncate">{video.speakerName}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{video.viewsCount.toLocaleString()}</span>
                        </span>
                      </div>

                      {video.scriptureReference && (
                        <div className="text-[10px] text-slate-300 flex items-center gap-1 truncate bg-slate-900/80 px-2 py-1 rounded">
                          <BookOpen className="w-3 h-3 text-[#C5A059] shrink-0" />
                          <span className="truncate font-mono">{video.scriptureReference}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleOpenVideo(video)}
                          className="flex-1 py-1.5 bg-slate-800 hover:bg-[#C5A059] text-slate-200 hover:text-[#002366] text-xs font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Watch Lecture</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured TV Program Schedule Grid */}
        <div className="bg-[#0B1530] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#C5A059]" />
                <span>BIBU Television Weekly Broadcast Schedule</span>
              </h3>
              <p className="text-xs text-slate-400">Airing on satellite and web channels across worldwide timezones</p>
            </div>
            <button
              onClick={() => setCurrentView('media-programs')}
              className="text-xs text-[#C5A059] hover:underline font-bold"
            >
              View Full Guide &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tvPrograms.slice(0, 6).map((prog) => (
              <div key={prog.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#C5A059] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {prog.dayOfWeek} • {prog.airTime}
                  </span>
                  <span className="text-[10px] text-slate-400">{prog.durationMinutes} mins</span>
                </div>
                <h4 className="text-sm font-bold text-white">{prog.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{prog.description}</p>
                <div className="text-xs text-[#C5A059] font-medium pt-1 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>Host: {prog.hostName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Presenter Profiles Showcase */}
        <div className="bg-[#0B1530] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#C5A059]" />
              <span>Distinguished Faculty Lecturers & Broadcast Presenters</span>
            </h3>
            <p className="text-xs text-slate-400">Renowned theologians, chancellors, and apostles broadcasting global Kingdom revelation</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mediaPresenters.map((pres) => (
              <div key={pres.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-3 hover:border-[#C5A059]/40 transition-colors">
                <img
                  src={pres.avatarUrl}
                  alt={pres.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#C5A059]/60 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{pres.name}</h4>
                  <p className="text-[11px] text-[#C5A059] font-medium">{pres.title}</p>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{pres.bio}</p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{pres.totalBroadcasts} Broadcasts</span>
                  <span className="text-[#C5A059] font-bold">{pres.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {selectedVideoForModal && (
        <VideoPlayerModal
          video={selectedVideoForModal}
          onClose={() => setSelectedVideoForModal(null)}
        />
      )}
    </div>
  );
};
