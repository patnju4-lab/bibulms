import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaHeader } from './MediaHeader';
import { TVProgram, RadioProgram } from '../../types/media';
import {
  Calendar,
  Tv,
  Radio,
  Clock,
  User,
  Search,
  Filter,
  Layers,
  Sparkles,
  ChevronRight,
  Play
} from 'lucide-react';

export const MediaProgramsPage: React.FC = () => {
  const { tvPrograms, radioPrograms, setCurrentView } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'tv' | 'radio'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState<string>('All');

  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const allCombinedPrograms = [
    ...tvPrograms.map(p => ({ ...p, medium: 'TV' as const })),
    ...radioPrograms.map(p => ({ ...p, medium: 'Radio' as const }))
  ];

  const filteredPrograms = allCombinedPrograms.filter(p => {
    const matchesMedium = activeTab === 'all' || p.medium.toLowerCase() === activeTab;
    const matchesDay = selectedDay === 'All' || p.dayOfWeek === selectedDay;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMedium && matchesDay && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100">
      <MediaHeader
        activeSubsection="media-programs"
        title="BIBU TV & RADIO PROGRAMMES DIRECTORY"
        subtitle="Complete Global Broadcast Guide • Theological Lecture Series & Weekly Ministry Shows"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Navigation & Filters Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0B1530] p-4 sm:p-6 rounded-2xl border border-slate-800">
          {/* Medium Tabs */}
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-[#C5A059] text-[#002366] shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All Shows ({allCombinedPrograms.length})
            </button>
            <button
              onClick={() => setActiveTab('tv')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'tv'
                  ? 'bg-[#C5A059] text-[#002366] shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>TV Shows ({tvPrograms.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('radio')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'radio'
                  ? 'bg-[#C5A059] text-[#002366] shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Radio Programs ({radioPrograms.length})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search programs by title, host, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Day Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Day:</span>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="bg-slate-900 text-white text-xs border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-[#C5A059]"
            >
              {days.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              className="bg-[#0B1530] rounded-2xl border border-slate-800 hover:border-[#C5A059]/50 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    prog.medium === 'TV'
                      ? 'bg-rose-900/50 text-rose-300 border border-rose-700/50'
                      : 'bg-amber-900/50 text-[#C5A059] border border-amber-700/50'
                  }`}>
                    {prog.medium === 'TV' ? '📺 TV Broadcast' : '📻 Radio Program'}
                  </span>
                  <span className="text-xs font-mono text-[#C5A059] font-bold bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                    <Clock className="w-3 h-3 inline-block mr-1" />
                    {prog.airTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-display">
                  {prog.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {prog.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-white font-medium">
                    <User className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{prog.hostName}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-300">
                    {prog.dayOfWeek}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (prog.medium === 'TV') {
                        setCurrentView('bibu-tv');
                      } else {
                        setCurrentView('bibu-radio');
                      }
                    }}
                    className="w-full py-2 bg-slate-800 hover:bg-[#C5A059] text-slate-200 hover:text-[#002366] text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch / Listen in Hub</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
