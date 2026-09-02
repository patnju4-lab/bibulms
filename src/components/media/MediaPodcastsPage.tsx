import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaHeader } from './MediaHeader';
import {
  Headphones,
  Play,
  Pause,
  Download,
  Share2,
  Clock,
  User,
  Calendar,
  Search,
  Sparkles,
  Volume2,
  CheckCircle2
} from 'lucide-react';

interface PodcastEpisode {
  id: string;
  title: string;
  series: string;
  host: string;
  duration: string;
  publishedDate: string;
  description: string;
  audioUrl: string;
  episodeNumber: number;
}

export const MediaPodcastsPage: React.FC = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const podcasts: PodcastEpisode[] = [
    {
      id: 'pod-1',
      title: 'Apostolic Hermeneutics: Rightly Dividing Prophecy in Modern Times',
      series: 'Kingdom Leadership Podcast',
      host: 'Prof. Joseph Kariuki',
      duration: '42:15',
      publishedDate: '2026-08-28',
      description: 'An in-depth exploration of grammatical-historical hermeneutics and how pastoral leaders interpret covenant promises today.',
      audioUrl: 'https://stream.zeno.fm/biburadio',
      episodeNumber: 48
    },
    {
      id: 'pod-2',
      title: 'The Great Commission in the 21st Century: Urban Missions & Church Planting',
      series: 'Global Missions Dialogue',
      host: 'Apostle Dr. Emmanuel Njuguna',
      duration: '38:50',
      publishedDate: '2026-08-20',
      description: 'Strategic analysis of planting self-sustaining apostolic centres across East Africa and international diaspora communities.',
      audioUrl: 'https://stream.zeno.fm/biburadio',
      episodeNumber: 47
    },
    {
      id: 'pod-3',
      title: 'Systematic Theology: Pneumatology and Holy Spirit Manifestations',
      series: 'Theological Deep Dives',
      host: 'Dr. Rebecca Otieno',
      duration: '45:10',
      publishedDate: '2026-08-14',
      description: 'Academic and experiential study of the Holy Spirit throughout biblical history and contemporary revival movements.',
      audioUrl: 'https://stream.zeno.fm/biburadio',
      episodeNumber: 46
    },
    {
      id: 'pod-4',
      title: 'Integrity in Ministry Finance & Institutional Governance',
      series: 'Kingdom Leadership Podcast',
      host: 'Bishop Daniel Wanyama',
      duration: '35:20',
      publishedDate: '2026-08-05',
      description: 'Practical ethics and financial stewardship standards for pastors, bishops, and church administrators.',
      audioUrl: 'https://stream.zeno.fm/biburadio',
      episodeNumber: 45
    }
  ];

  const filtered = podcasts.filter(
    p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100">
      <MediaHeader
        activeSubsection="media-podcasts"
        title="BIBU THEOLOGICAL & LEADERSHIP PODCASTS"
        subtitle="On-Demand Masterclass Audio • Practical Pastoral Strategy • Systematic Biblical Discussions"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0B1530] p-4 sm:p-6 rounded-2xl border border-slate-800">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search podcast episodes by topic, host, series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A059]"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filtered.length} Episodes Available
          </span>
        </div>

        {/* Podcast Episodes List */}
        <div className="space-y-4">
          {filtered.map((ep) => {
            const isCurrentPlaying = playingId === ep.id;
            return (
              <div
                key={ep.id}
                className="bg-[#0B1530] rounded-2xl border border-slate-800 hover:border-[#C5A059]/40 p-6 shadow-xl transition-all duration-200 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => setPlayingId(isCurrentPlaying ? null : ep.id)}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform active:scale-95 ${
                        isCurrentPlaying
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-[#C5A059] text-[#002366] hover:bg-[#B38E46]'
                      }`}
                    >
                      {isCurrentPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-800 text-[#C5A059]">
                          Ep. #{ep.episodeNumber} • {ep.series}
                        </span>
                        <span className="text-xs text-slate-400">
                          {ep.duration}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white font-display">
                        {ep.title}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Host: {ep.host}</span>
                        <span>•</span>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{ep.publishedDate}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => alert(`Downloading MP3 audio for: ${ep.title}`)}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
                      title="Download Audio MP3"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Podcast link copied!");
                      }}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
                      title="Share Episode"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pl-0 sm:pl-18">
                  {ep.description}
                </p>

                {isCurrentPlaying && (
                  <div className="p-4 bg-slate-900 rounded-xl border border-amber-500/30 flex items-center justify-between gap-4 animate-in fade-in">
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-5 h-5 text-[#C5A059] animate-pulse" />
                      <div className="text-xs font-bold text-white">
                        Playing Episode #{ep.episodeNumber} on BIBU Audio Stream
                      </div>
                    </div>
                    <span className="text-[10px] text-[#C5A059] font-mono">128 kbps High Fidelity</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
