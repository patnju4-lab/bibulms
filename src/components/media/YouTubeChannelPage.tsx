import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaHeader } from './MediaHeader';
import { VideoPlayerModal } from './VideoPlayerModal';
import { MediaVideo } from '../../types/media';
import {
  Youtube,
  ExternalLink,
  Users,
  Eye,
  Video,
  Play,
  CheckCircle2,
  Sparkles,
  Share2,
  ListVideo
} from 'lucide-react';

export const YouTubeChannelPage: React.FC = () => {
  const { youtubeSettings, mediaVideos, recordVideoView } = useApp();
  const [selectedVideo, setSelectedVideo] = useState<MediaVideo | null>(null);

  const playlists = [
    { name: 'Systematic Theology & Exegesis', count: '34 Videos', id: 'PL1' },
    { name: 'Global Convocations & Graduations', count: '18 Videos', id: 'PL2' },
    { name: 'Apostolic Leadership & Pastoral Ministry', count: '27 Videos', id: 'PL3' },
    { name: 'Prophetic Impartation & 24/7 Prayer', count: '45 Videos', id: 'PL4' }
  ];

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100">
      <MediaHeader
        activeSubsection="youtube-channel"
        title="BIBU OFFICIAL YOUTUBE BROADCAST CHANNEL"
        subtitle="Watch, Subscribe, and Share Global Theological Masterclasses & Live Transmissions"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Official Channel Banner Showcase */}
        <div className="bg-[#0B1530] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-20 h-20 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-xl shrink-0">
                <Youtube className="w-12 h-12 fill-current" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                    {youtubeSettings.channelTitle || 'Breakthrough International Bible University Official'}
                  </h2>
                  <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0" />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  @{youtubeSettings.customHandle || 'BIBU_Worldwide'} • {youtubeSettings.channelId}
                </p>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  {youtubeSettings.description || 'The official broadcast channel for Breakthrough International Bible University, equipping the global church with solid biblical doctrine, accredited theological training, and kingdom leadership.'}
                </p>
              </div>
            </div>

            {/* Subscribe Action */}
            <div className="flex items-center gap-3">
              <a
                href={`https://www.youtube.com/channel/${youtubeSettings.channelId}?sub_confirmation=1`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <Youtube className="w-4 h-4 fill-current" />
                <span>Subscribe to Channel</span>
              </a>

              <a
                href={`https://www.youtube.com/channel/${youtubeSettings.channelId}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
                title="Open in YouTube"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Official Channel Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-1">
              <Users className="w-5 h-5 text-[#C5A059] mx-auto" />
              <div className="text-lg font-black text-white font-mono">{youtubeSettings.subscribersCount.toLocaleString()}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Subscribers</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-1">
              <Eye className="w-5 h-5 text-rose-500 mx-auto" />
              <div className="text-lg font-black text-white font-mono">{youtubeSettings.totalViewsCount.toLocaleString()}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Lifetime Views</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-1">
              <Video className="w-5 h-5 text-blue-400 mx-auto" />
              <div className="text-lg font-black text-white font-mono">{youtubeSettings.totalVideosCount}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Uploaded Lectures</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-1">
              <ListVideo className="w-5 h-5 text-amber-400 mx-auto" />
              <div className="text-lg font-black text-white font-mono">12 Playlists</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Curated Series</div>
            </div>
          </div>
        </div>

        {/* Playlists Showcase */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <ListVideo className="w-5 h-5 text-[#C5A059]" />
              <span>Official University Playlists</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                className="p-4 bg-[#0B1530] rounded-xl border border-slate-800 hover:border-[#C5A059]/40 transition-colors space-y-2"
              >
                <div className="text-[10px] font-bold text-[#C5A059] uppercase">{pl.count}</div>
                <h4 className="text-sm font-bold text-white line-clamp-2">{pl.name}</h4>
                <a
                  href={`https://www.youtube.com/channel/${youtubeSettings.channelId}/playlists`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium pt-1"
                >
                  <span>Open Playlist</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Uploaded Video Feed Grid */}
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-[#C5A059]" />
              <span>Latest YouTube Uploads & Live Keynotes</span>
            </h3>
            <p className="text-xs text-slate-400">Direct responsive embeds synchronized with YouTube</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => {
                  setSelectedVideo(video);
                  recordVideoView(video.id);
                }}
                className="bg-[#0B1530] rounded-2xl border border-slate-800 hover:border-[#C5A059]/50 overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    {video.duration}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors line-clamp-2">
                    {video.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{video.description}</p>
                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span>{video.speakerName}</span>
                    <span>{video.viewsCount.toLocaleString()} views</span>
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
