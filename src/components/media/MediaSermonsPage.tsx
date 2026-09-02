import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaHeader } from './MediaHeader';
import { VideoPlayerModal } from './VideoPlayerModal';
import { MediaVideo } from '../../types/media';
import {
  BookOpen,
  Play,
  Download,
  Search,
  Filter,
  User,
  Calendar,
  Clock,
  Eye,
  Bookmark,
  Heart,
  Share2,
  GraduationCap
} from 'lucide-react';

export const MediaSermonsPage: React.FC = () => {
  const { mediaVideos, recordVideoView } = useApp();

  const [selectedVideo, setSelectedVideo] = useState<MediaVideo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('All');
  const [selectedSeries, setSelectedSeries] = useState('All');

  const sermonVideos = mediaVideos.filter(
    v => v.category === 'Sermons & Teachings' || v.category === 'Theology & Doctrine' || v.category === 'Biblical Studies' || v.category === 'Prophetic & Prayer'
  );

  const speakers = ['All', ...Array.from(new Set(sermonVideos.map(v => v.speakerName)))];
  const seriesList = ['All', 'Apostolic Impartation', 'Systematic Hermeneutics', 'Kingdom Leadership', 'Great Commission Missions', 'Covenant Theology'];

  const filtered = sermonVideos.filter(v => {
    const matchesSpeaker = selectedSpeaker === 'All' || v.speakerName === selectedSpeaker;
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.scriptureReference && v.scriptureReference.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSpeaker && matchesSearch;
  });

  const handleOpenVideo = (video: MediaVideo) => {
    setSelectedVideo(video);
    recordVideoView(video.id);
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100">
      <MediaHeader
        activeSubsection="media-sermons"
        title="THEOLOGICAL SERMONS & APOSTOLIC TEACHINGS"
        subtitle="Sound Biblical Exegesis • Systematic Doctrinal Lectures • Revival Ministry Impartation"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#0B1530] p-4 sm:p-6 rounded-2xl border border-slate-800">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sermons by topic, scripture passage (e.g. 2 Timothy), preacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Speaker:</span>
            <select
              value={selectedSpeaker}
              onChange={(e) => setSelectedSpeaker(e.target.value)}
              className="w-full bg-slate-900 text-white text-xs border border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C5A059]"
            >
              {speakers.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Series:</span>
            <select
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              className="w-full bg-slate-900 text-white text-xs border border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C5A059]"
            >
              {seriesList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Sermon Collection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((video) => (
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
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#C5A059] text-[#002366]">
                  {video.category}
                </span>
                <span className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-white">
                  {video.duration}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3
                    onClick={() => handleOpenVideo(video)}
                    className="text-base font-bold text-white hover:text-[#C5A059] cursor-pointer line-clamp-2 transition-colors"
                  >
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-[#C5A059] font-medium truncate">
                      <User className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{video.speakerName}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{video.viewsCount.toLocaleString()}</span>
                    </span>
                  </div>

                  {video.scriptureReference && (
                    <div className="p-2 bg-slate-900 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-1.5 border border-slate-800">
                      <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span className="truncate">Scripture: {video.scriptureReference}</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleOpenVideo(video)}
                    className="w-full py-2 bg-slate-800 hover:bg-[#C5A059] text-slate-200 hover:text-[#002366] text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Sermon & Notes</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
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
