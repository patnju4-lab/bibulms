import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaHeader } from './MediaHeader';
import { VideoPlayerModal } from './VideoPlayerModal';
import { MediaVideo } from '../../types/media';
import {
  Archive,
  Search,
  Filter,
  Calendar,
  Play,
  Clock,
  Eye,
  User,
  BookOpen,
  Sparkles,
  Download
} from 'lucide-react';

export const MediaArchivesPage: React.FC = () => {
  const { mediaVideos, recordVideoView } = useApp();

  const [selectedVideo, setSelectedVideo] = useState<MediaVideo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const years = ['All', '2026', '2025', '2024', '2023', '2022', '2021', '2020'];
  const categories = [
    'All',
    'Theology & Doctrine',
    'Ministry & Leadership',
    'Sermons & Teachings',
    'Campus & Convocation',
    'Prophetic & Prayer'
  ];

  const filtered = mediaVideos.filter(v => {
    const pubYear = new Date(v.publishedDate).getFullYear().toString();
    const matchesYear = selectedYear === 'All' || pubYear === selectedYear;
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.speakerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesCategory && matchesSearch;
  });

  const handleOpenVideo = (video: MediaVideo) => {
    setSelectedVideo(video);
    recordVideoView(video.id);
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100">
      <MediaHeader
        activeSubsection="media-archives"
        title="BIBU GLOBAL BROADCAST ARCHIVES REPOSITORY"
        subtitle="Searchable Historical Archive • Comprehensive Convocations, Academic Lectures & Ministry Transmissions"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Search and Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#0B1530] p-4 sm:p-6 rounded-2xl border border-slate-800">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search historical archives by keyword, faculty name, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-xs text-slate-400">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-slate-900 text-white text-xs border border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C5A059]"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-xs text-slate-400">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900 text-white text-xs border border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C5A059]"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Displaying <strong>{filtered.length}</strong> archived digital broadcasts</span>
          <span className="text-[#C5A059] font-mono">Preserved in High Definition</span>
        </div>

        {/* Archives Table/List View */}
        <div className="bg-[#0B1530] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-300 uppercase tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Broadcast Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Speaker / Faculty</th>
                  <th className="py-3.5 px-4">Air Date</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Views</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-900/60 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-3">
                      <div className="w-12 aspect-video bg-black rounded overflow-hidden shrink-0">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="line-clamp-2">{item.title}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#C5A059] font-medium">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {item.speakerName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {item.publishedDate}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {item.duration}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-bold">
                      {item.viewsCount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenVideo(item)}
                        className="px-3 py-1.5 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase rounded-lg transition-all inline-flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Play</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
