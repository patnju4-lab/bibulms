import React, { useState, useEffect, useMemo } from 'react';
import { MediaVideo } from '../../types/media';
import defaultPlaylistJson from '../../data/relatedSermonsPlaylist.json';
import {
  Play,
  ListVideo,
  LayoutGrid,
  List,
  Volume2,
  Clock,
  User,
  BookOpen,
  Search,
  RefreshCw,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Database,
  CheckCircle2
} from 'lucide-react';

export interface RelatedSermonsPlaylistData {
  playlistId: string;
  playlistTitle: string;
  playlistSubtitle: string;
  category: string;
  curator: string;
  totalVideos: number;
  updatedAt: string;
  channelHandle: string;
  videos: Array<{
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    youtubeVideoId: string;
    youtubeUrl?: string;
    startTimeSeconds?: number;
    category: string;
    thumbnail?: string;
    presenter?: string;
    presenterTitle?: string;
    presenterPhoto?: string;
    duration: string;
    durationSeconds?: number;
    publishedDate?: string;
    viewsCount: number;
    likesCount?: number;
    scriptureReference?: string;
    bibleReferences?: string[];
    tags: string[];
  }>;
}

interface RelatedSermonsPlaylistProps {
  activeVideoId: string;
  onSelectVideo: (video: MediaVideo) => void;
  viewMode?: 'sidebar' | 'grid';
  onToggleViewMode?: (mode: 'sidebar' | 'grid') => void;
  className?: string;
}

export const RelatedSermonsPlaylist: React.FC<RelatedSermonsPlaylistProps> = ({
  activeVideoId,
  onSelectVideo,
  viewMode = 'sidebar',
  onToggleViewMode,
  className = ''
}) => {
  const [playlist, setPlaylist] = useState<RelatedSermonsPlaylistData>(
    defaultPlaylistJson as unknown as RelatedSermonsPlaylistData
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dataSource, setDataSource] = useState<'fetch' | 'bundled'>('bundled');
  const [lastFetchedAt, setLastFetchedAt] = useState<string>('Just now');

  // Fetch playlist from mocked JSON data structure
  const fetchPlaylistFromMockJson = async () => {
    setIsLoading(true);
    try {
      // Primary attempt: fetch from the public JSON endpoint
      const response = await fetch('/data/relatedSermonsPlaylist.json');
      if (response.ok) {
        const data: RelatedSermonsPlaylistData = await response.json();
        setPlaylist(data);
        setDataSource('fetch');
        setLastFetchedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        return;
      }
    } catch (error) {
      console.warn('HTTP fetch failed, utilizing bundled mock JSON structure:', error);
    }
    // Fallback: bundled mock JSON data structure
    setPlaylist(defaultPlaylistJson as unknown as RelatedSermonsPlaylistData);
    setDataSource('bundled');
    setLastFetchedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPlaylistFromMockJson();
  }, []);

  // Filtered playlist based on search query
  const filteredVideos = useMemo(() => {
    if (!playlist?.videos) return [];
    if (!searchQuery.trim()) return playlist.videos;
    const query = searchQuery.toLowerCase();
    return playlist.videos.filter(
      (video) =>
        video.title.toLowerCase().includes(query) ||
        (video.presenter && video.presenter.toLowerCase().includes(query)) ||
        (video.scriptureReference && video.scriptureReference.toLowerCase().includes(query)) ||
        (video.category && video.category.toLowerCase().includes(query)) ||
        (video.tags && video.tags.some((tag) => tag.toLowerCase().includes(query)))
    );
  }, [playlist, searchQuery]);

  const handleItemClick = (video: RelatedSermonsPlaylistData['videos'][0]) => {
    const mediaVideo: MediaVideo = {
      id: video.id,
      title: video.title,
      subtitle: video.subtitle,
      description: video.description,
      youtubeVideoId: video.youtubeVideoId,
      youtubeUrl: video.youtubeUrl || `https://www.youtube.com/watch?v=${video.youtubeVideoId}${video.startTimeSeconds ? `&t=${video.startTimeSeconds}s` : ''}`,
      startTimeSeconds: video.startTimeSeconds,
      category: video.category,
      thumbnail: video.thumbnail,
      presenter: video.presenter,
      presenterTitle: video.presenterTitle,
      presenterPhoto: video.presenterPhoto,
      speakerName: video.presenter,
      speakerTitle: video.presenterTitle,
      duration: video.duration,
      durationSeconds: video.durationSeconds,
      publishedDate: video.publishedDate,
      viewsCount: video.viewsCount,
      likesCount: video.likesCount,
      bibleReferences: video.bibleReferences,
      scriptureReference: video.scriptureReference,
      tags: video.tags,
      featured: true
    };
    onSelectVideo(mediaVideo);
  };

  return (
    <div
      id="related-sermons-playlist-container"
      className={`bg-[#0B1530] rounded-2xl border border-slate-800 flex flex-col shadow-2xl overflow-hidden ${className}`}
    >
      {/* 1. Header Bar with Metadata, Title, and Mode Switch */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-gradient-to-r from-[#001744] via-[#0B1530] to-[#091124] space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-500 border border-rose-500/40 flex items-center justify-center shrink-0 shadow-inner">
              <ListVideo className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold font-display text-white">
                  Related Sermons Playlist
                </h3>
                <span className="bg-[#002366] text-[#C5A059] text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#C5A059]/30">
                  {playlist.videos.length} videos
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans truncate max-w-xs">
                {playlist.playlistSubtitle || 'Breakthrough International Bible University'}
              </p>
            </div>
          </div>

          {/* Controls: View Mode & Refresh */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onToggleViewMode && (
              <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-700">
                <button
                  type="button"
                  onClick={() => onToggleViewMode('sidebar')}
                  title="Sidebar List View"
                  className={`p-1.5 rounded-md text-xs font-bold transition-colors ${
                    viewMode === 'sidebar'
                      ? 'bg-[#C5A059] text-[#002366] shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onToggleViewMode('grid')}
                  title="Expanded Grid View"
                  className={`p-1.5 rounded-md text-xs font-bold transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-[#C5A059] text-[#002366] shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={fetchPlaylistFromMockJson}
              disabled={isLoading}
              title="Refresh playlist data from JSON structure"
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#C5A059] ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Status indicator showing JSON source and last update */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5 font-mono">
            <Database className="w-3 h-3 text-[#C5A059]" />
            <span>
              Source: <strong className="text-slate-200">mock JSON data structure</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>{dataSource === 'fetch' ? 'Fetched via HTTP' : 'Loaded JSON'}</span>
            </span>
          </div>

          <span className="font-mono text-slate-500">Updated: {lastFetchedAt}</span>
        </div>

        {/* 2. Search & Filter Bar */}
        <div className="relative pt-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sermons, pastors, scriptures..."
            className="w-full pl-9 pr-7 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. Content Body: Sidebar List View OR Grid View */}
      {viewMode === 'sidebar' ? (
        /* ================= SIDEBAR LIST VIEW ================= */
        <div
          id="related-sermons-sidebar-list"
          className="p-3 space-y-2.5 overflow-y-auto max-h-[580px] lg:max-h-[640px] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
        >
          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-3">
              <RefreshCw className="w-6 h-6 text-[#C5A059] animate-spin mx-auto" />
              <p>Fetching related sermon videos from JSON structure...</p>
            </div>
          ) : filteredVideos.length > 0 ? (
            filteredVideos.map((video, idx) => {
              const isCurrentlyPlaying =
                activeVideoId === video.id || activeVideoId === video.youtubeVideoId;

              return (
                <div
                  key={video.id}
                  onClick={() => handleItemClick(video)}
                  className={`group relative flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isCurrentlyPlaying
                      ? 'bg-[#002366]/80 border-[#C5A059] ring-1 ring-[#C5A059]/40 shadow-lg'
                      : 'bg-slate-900/50 hover:bg-slate-800/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Numerical index */}
                  <div className="text-[11px] font-mono font-bold text-slate-500 w-4 pt-1 text-center shrink-0">
                    {idx + 1}
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-lg overflow-hidden bg-black shrink-0 border border-slate-800">
                    <img
                      src={video.thumbnail || `https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=300`}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    {/* Overlay play button */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                      isCurrentlyPlaying ? 'bg-black/50 opacity-100' : 'bg-black/40 opacity-0 group-hover:opacity-100'
                    }`}>
                      {isCurrentlyPlaying ? (
                        <Volume2 className="w-5 h-5 text-[#C5A059] animate-pulse" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow">
                          <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                        </div>
                      )}
                    </div>

                    {/* Duration badge */}
                    <span className="absolute bottom-1 right-1 bg-black/85 text-[9px] font-mono text-white px-1.5 py-0.5 rounded font-bold">
                      {video.duration}
                    </span>
                  </div>

                  {/* Sermon Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5">
                      {isCurrentlyPlaying ? (
                        <span className="bg-[#C5A059] text-[#002366] text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded flex items-center gap-1 animate-pulse">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Now Playing</span>
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-300 text-[9px] font-medium px-1.5 py-0.2 rounded truncate max-w-[120px]">
                          {video.category}
                        </span>
                      )}

                      {video.startTimeSeconds && (
                        <span className="text-[9px] font-mono text-amber-400">
                          @ {Math.floor(video.startTimeSeconds / 60)}:{(video.startTimeSeconds % 60).toString().padStart(2, '0')}
                        </span>
                      )}
                    </div>

                    <h4 className={`text-xs font-bold line-clamp-2 leading-snug group-hover:text-[#C5A059] transition-colors ${
                      isCurrentlyPlaying ? 'text-[#C5A059]' : 'text-white'
                    }`}>
                      {video.title}
                    </h4>

                    {video.presenter && (
                      <p className="text-[10px] text-slate-300 flex items-center gap-1 truncate">
                        <User className="w-3 h-3 text-[#C5A059] shrink-0" />
                        <span className="truncate">{video.presenter}</span>
                      </p>
                    )}

                    {video.scriptureReference && (
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 font-mono truncate">
                        <BookOpen className="w-3 h-3 text-blue-400 shrink-0" />
                        <span className="truncate">{video.scriptureReference}</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-400 space-y-2">
              <Search className="w-6 h-6 text-slate-600 mx-auto" />
              <p>No related sermons match "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#C5A059] hover:underline font-bold text-[11px]"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ================= GRID VIEW ================= */
        <div
          id="related-sermons-grid-view"
          className="p-4 sm:p-5 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-800"
        >
          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-3">
              <RefreshCw className="w-6 h-6 text-[#C5A059] animate-spin mx-auto" />
              <p>Fetching related sermons from JSON structure...</p>
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {filteredVideos.map((video, idx) => {
                const isCurrentlyPlaying =
                  activeVideoId === video.id || activeVideoId === video.youtubeVideoId;

                return (
                  <div
                    key={video.id}
                    onClick={() => handleItemClick(video)}
                    className={`bg-slate-900/70 rounded-xl border overflow-hidden shadow transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5 ${
                      isCurrentlyPlaying
                        ? 'border-[#C5A059] ring-2 ring-[#C5A059]/40 bg-[#002366]/40'
                        : 'border-slate-800 hover:border-[#C5A059]/60'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img
                        src={video.thumbnail || `https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=400`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 fill-current translate-x-0.5" />
                        </div>
                      </div>

                      <span className="absolute bottom-1.5 right-1.5 bg-black/85 text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">
                        {video.duration}
                      </span>

                      {isCurrentlyPlaying && (
                        <span className="absolute top-1.5 left-1.5 bg-[#C5A059] text-[#002366] text-[9px] font-black uppercase px-2 py-0.5 rounded shadow animate-pulse">
                          Now Playing
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="bg-slate-800 px-1.5 py-0.5 rounded font-mono text-slate-300">
                            #{idx + 1}
                          </span>
                          <span className="truncate max-w-[120px] text-amber-400/90 font-bold">
                            {video.category}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors line-clamp-2 leading-snug">
                          {video.title}
                        </h4>

                        {video.presenter && (
                          <p className="text-[11px] text-slate-300 flex items-center gap-1">
                            <User className="w-3 h-3 text-[#C5A059] shrink-0" />
                            <span className="truncate">{video.presenter}</span>
                          </p>
                        )}

                        {video.scriptureReference && (
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                            <BookOpen className="w-3 h-3 text-blue-400 shrink-0" />
                            <span className="truncate">{video.scriptureReference}</span>
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{video.viewsCount.toLocaleString()} views</span>
                        <span className="text-[#C5A059] font-bold group-hover:underline flex items-center gap-0.5">
                          <span>Play</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No related sermons match "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#C5A059] hover:underline font-bold text-xs"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. Footer with quick channel deep-link */}
      <div className="p-3 bg-slate-950/70 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Curated from <strong>{playlist.channelHandle}</strong></span>
        </div>

        <a
          href={`https://www.youtube.com/${playlist.channelHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#C5A059] hover:text-white font-bold flex items-center gap-1 transition-colors"
        >
          <span>View Full Channel</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
