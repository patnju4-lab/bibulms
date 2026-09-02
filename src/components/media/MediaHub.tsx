import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaHeader } from './MediaHeader';
import { VideoPlayerModal } from './VideoPlayerModal';
import { MediaVideo } from '../../types/media';
import {
  Tv,
  Radio,
  Video,
  Mic,
  Calendar,
  BookOpen,
  Newspaper,
  Headphones,
  Archive,
  Youtube,
  Play,
  Flame,
  Sparkles,
  ChevronRight,
  Eye,
  Clock,
  User,
  ExternalLink,
  Award,
  Globe2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const MediaHub: React.FC = () => {
  const {
    mediaVideos,
    mediaChannels,
    tvPrograms,
    radioPrograms,
    mediaPresenters,
    youtubeSettings,
    radioSettings,
    setCurrentView,
    recordVideoView,
    toggleRadioPlay,
    isRadioPlaying
  } = useApp();

  const [selectedVideo, setSelectedVideo] = useState<MediaVideo | null>(null);

  const featuredVideo = mediaVideos.find(v => v.isFeatured) || mediaVideos[0];
  const liveVideo = mediaVideos.find(v => v.isLive) || mediaVideos[0];
  const latestVideos = mediaVideos.slice(0, 6);

  const quickJumpSections = [
    {
      id: 'bibu-tv' as const,
      title: 'BIBU Television',
      desc: 'Watch high-definition theological lectures, keynote broadcasts & campus events.',
      icon: Tv,
      color: 'from-blue-900 to-indigo-950',
      badge: 'HD Video'
    },
    {
      id: 'bibu-radio' as const,
      title: 'BIBU Radio Worldwide',
      desc: '24/7 continuous digital broadcast with gospel music, sermons & prayer.',
      icon: Radio,
      color: 'from-amber-900 to-slate-900',
      badge: '24/7 Live'
    },
    {
      id: 'live-tv' as const,
      title: 'Live TV Broadcast',
      desc: 'Join the live international convocation transmission room with live chat.',
      icon: Flame,
      color: 'from-rose-900 to-slate-950',
      badge: 'LIVE ON AIR'
    },
    {
      id: 'live-radio' as const,
      title: 'Live Radio Studio',
      desc: 'Experience our master audio studio deck, on-air presenter profile & hotlines.',
      icon: Mic,
      color: 'from-emerald-950 to-slate-900',
      badge: 'Master Console'
    },
    {
      id: 'media-programs' as const,
      title: 'Program Directory',
      desc: 'Full weekly television & radio program schedule for all 7 days.',
      icon: Calendar,
      color: 'from-slate-900 to-slate-950',
      badge: 'Schedule'
    },
    {
      id: 'media-sermons' as const,
      title: 'Theological Sermons',
      desc: 'Deep expository teachings organized by series, scripture & school.',
      icon: BookOpen,
      color: 'from-slate-900 to-slate-950',
      badge: 'Study Notes'
    },
    {
      id: 'media-podcasts' as const,
      title: 'Podcasts & Masterclasses',
      desc: 'On-demand leadership audio, discussions, and pastoral wisdom.',
      icon: Headphones,
      color: 'from-slate-900 to-slate-950',
      badge: 'Audio Series'
    },
    {
      id: 'youtube-channel' as const,
      title: 'Official YouTube Channel',
      desc: 'Subscribe to our channel, view curated playlists and video archives.',
      icon: Youtube,
      color: 'from-rose-950 to-slate-900',
      badge: 'Official YT'
    }
  ];

  const handleOpenVideo = (video: MediaVideo) => {
    setSelectedVideo(video);
    recordVideoView(video.id);
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100">
      {/* Top Header */}
      <MediaHeader
        activeSubsection="media-center"
        title="BIBU TV & RADIO MEDIA CENTER"
        subtitle="Breakthrough International Bible University • Global Digital Broadcasting Network"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* Dual Hero: Live TV Stream + Live Radio Quick Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: TV Featured Keynote Frame */}
          <div className="lg:col-span-8 bg-[#0B1530] rounded-3xl border border-slate-800 p-6 shadow-2xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-widest text-[#C5A059]">
                  Featured Broadcast Feed
                </span>
              </div>
              <button
                onClick={() => setCurrentView('bibu-tv')}
                className="text-xs text-[#C5A059] hover:underline font-bold flex items-center gap-1"
              >
                <span>Full TV Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Responsive 16:9 Embed */}
            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80">
              <iframe
                src={`https://www.youtube.com/embed/${featuredVideo.youtubeVideoId}?rel=0&modestbranding=1`}
                title={featuredVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#C5A059] text-[#002366]">
                  {featuredVideo.category}
                </span>
                <span className="text-xs text-slate-400">
                  {featuredVideo.duration} • {featuredVideo.speakerName}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                {featuredVideo.title}
              </h2>
              <p className="text-xs text-slate-300 line-clamp-2">
                {featuredVideo.description}
              </p>
            </div>
          </div>

          {/* Right: Live Radio Broadcast Card */}
          <div className="lg:col-span-4 bg-gradient-to-b from-[#0D1C44] via-[#0B1530] to-[#070D1E] rounded-3xl border border-[#C5A059]/40 p-6 shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-xs font-black uppercase tracking-widest text-white">
                    Live Radio Transmission
                  </span>
                </div>
                <span className="bg-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse">
                  ON AIR
                </span>
              </div>

              <div className="text-center py-4 space-y-3">
                <div className="w-28 h-28 mx-auto rounded-full bg-[#001438] border-2 border-[#C5A059] flex items-center justify-center text-[#C5A059] shadow-xl">
                  <Mic className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    {radioSettings.stationName || 'BIBU Radio Worldwide'}
                  </h3>
                  <p className="text-xs text-[#C5A059] mt-0.5 font-medium">
                    {radioSettings.streamMountPoint || '24/7 Digital Master Feed'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {radioSettings.tagline}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Current Airing Show</div>
                <div className="text-xs font-bold text-white">
                  {radioPrograms[0]?.title || 'Voice of Breakthrough International'}
                </div>
                <div className="text-[10px] text-[#C5A059]">Host: {radioPrograms[0]?.hostName || 'Apostolic Team'}</div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={toggleRadioPlay}
                className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2 ${
                  isRadioPlaying
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-white/30'
                    : 'bg-[#C5A059] hover:bg-[#B38E46] text-[#002366]'
                }`}
              >
                {isRadioPlaying ? (
                  <>
                    <span>Pause Live Radio Broadcast</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Listen Live to BIBU Radio</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setCurrentView('bibu-radio')}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all text-center"
              >
                View 24/7 Radio Schedule &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Quick Jump 8 Subsections Bento Grid */}
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
              <span>Explore All Media Network Services</span>
            </h3>
            <p className="text-xs text-slate-400">Access video classrooms, radio stations, podcast masterclasses and channel archives</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickJumpSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.id}
                  onClick={() => setCurrentView(sec.id)}
                  className="bg-[#0B1530] hover:bg-[#0E1B3E] rounded-2xl border border-slate-800 hover:border-[#C5A059]/60 p-5 cursor-pointer shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-[#002366] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase text-[#C5A059] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {sec.badge}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-[#C5A059] transition-colors">
                      {sec.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {sec.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-[#C5A059]">
                    <span>Enter Section</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Latest Video Lectures Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-[#C5A059]" />
                <span>Latest Video Broadcasts & Theological Lectures</span>
              </h3>
              <p className="text-xs text-slate-400">Streamed from Breakthrough International Bible University</p>
            </div>
            <button
              onClick={() => setCurrentView('bibu-tv')}
              className="text-xs text-[#C5A059] hover:underline font-bold"
            >
              View All Video Library &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestVideos.map((video) => (
              <div
                key={video.id}
                className="bg-[#0B1530] rounded-2xl border border-slate-800 hover:border-[#C5A059]/50 overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col group"
              >
                <div
                  onClick={() => handleOpenVideo(video)}
                  className="relative aspect-video bg-black cursor-pointer overflow-hidden"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#C5A059] text-[#002366] flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#002366]/90 text-[#C5A059] border border-[#C5A059]/40 backdrop-blur-sm">
                    {video.category}
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    {video.duration}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4
                      onClick={() => handleOpenVideo(video)}
                      className="text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors cursor-pointer line-clamp-2"
                    >
                      {video.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {video.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="text-[#C5A059] font-medium truncate max-w-[160px]">
                        {video.speakerName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{video.viewsCount.toLocaleString()}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenVideo(video)}
                      className="w-full py-1.5 bg-slate-800 hover:bg-[#C5A059] text-slate-200 hover:text-[#002366] text-xs font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch & Study</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};
