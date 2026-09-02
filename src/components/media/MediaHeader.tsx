import React, { useState } from 'react';
import { useApp, CurrentView } from '../../context/AppContext';
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
  Volume2,
  VolumeX,
  Play,
  Pause,
  Search,
  Flame,
  Radio as RadioIcon,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { MediaCategory } from '../../types/media';

interface MediaHeaderProps {
  activeSubsection: CurrentView;
  title?: string;
  subtitle?: string;
}

export const MediaHeader: React.FC<MediaHeaderProps> = ({
  activeSubsection,
  title = "BIBU TV & RADIO MEDIA CENTER",
  subtitle = "Breakthrough International Bible University • Global Broadcast Network"
}) => {
  const {
    setCurrentView,
    isRadioPlaying,
    toggleRadioPlay,
    radioVolume,
    setRadioVolume,
    isRadioMuted,
    setIsRadioMuted,
    radioSettings,
    selectedMediaCategory,
    setSelectedMediaCategory
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const navItems: { id: CurrentView; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'media-center', label: 'Media Hub', icon: Tv },
    { id: 'bibu-tv', label: 'BIBU TV', icon: Video, badge: 'HD' },
    { id: 'bibu-radio', label: 'BIBU Radio', icon: Radio, badge: '24/7' },
    { id: 'live-tv', label: 'Live TV', icon: Flame, badge: 'LIVE' },
    { id: 'live-radio', label: 'Live Radio', icon: Mic, badge: 'ON AIR' },
    { id: 'media-programs', label: 'Programs', icon: Calendar },
    { id: 'media-sermons', label: 'Sermons & Teachings', icon: BookOpen },
    { id: 'media-news', label: 'News & Updates', icon: Newspaper },
    { id: 'media-podcasts', label: 'Podcasts', icon: Headphones },
    { id: 'media-archives', label: 'Archived Programs', icon: Archive },
    { id: 'youtube-channel', label: 'YouTube Channel', icon: Youtube, badge: 'Official' },
  ];

  const categories: (MediaCategory | 'All')[] = [
    'All',
    'Theology & Doctrine',
    'Ministry & Leadership',
    'Sermons & Teachings',
    'Biblical Studies',
    'Prophetic & Prayer',
    'Global Missions',
    'Campus & Convocation',
    'Youth & Family',
    'Documentaries',
    'Academic Lectures'
  ];

  return (
    <div className="bg-[#001844] text-white border-b-2 border-[#C5A059] shadow-lg">
      {/* Top Banner with Live Status & Quick Player Bar */}
      <div className="bg-[#00102E] px-4 py-2 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          {/* Live Indicators */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-rose-600/90 text-white font-black px-2.5 py-0.5 rounded-full text-[10px] tracking-widest uppercase animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
              <span>TV STREAM ONLINE</span>
            </div>
            
            <div className="flex items-center gap-2 bg-amber-500/20 text-[#C5A059] border border-[#C5A059]/40 font-bold px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase">
              <RadioIcon className="w-3 h-3 text-[#C5A059]" />
              <span>BIBU RADIO 24/7 BROADCAST</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-slate-300 text-[11px]">
              <span className="text-slate-400">Current Radio Air:</span>
              <span className="text-white font-bold">{radioSettings.stationName || 'BIBU Voice of Breakthrough'}</span>
            </div>
          </div>

          {/* Quick Radio Audio Player Widget in Header */}
          <div className="flex items-center gap-3 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
            <button
              onClick={toggleRadioPlay}
              className={`p-1.5 rounded-full text-white transition-transform active:scale-95 ${
                isRadioPlaying ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-[#C5A059] hover:bg-[#B38E46]'
              }`}
              title={isRadioPlaying ? 'Pause Live Radio' : 'Listen Live to BIBU Radio'}
            >
              {isRadioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-wider text-[#C5A059] leading-tight">
                {isRadioPlaying ? 'Playing Live' : 'Live Radio'}
              </span>
              <span className="text-[11px] font-semibold text-slate-200 truncate max-w-[140px] sm:max-w-[180px]">
                {radioSettings.streamMountPoint || 'Stream 128kbps AAC'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
              <button
                onClick={() => setIsRadioMuted(!isRadioMuted)}
                className="text-slate-300 hover:text-white p-1"
                title={isRadioMuted ? 'Unmute' : 'Mute'}
              >
                {isRadioMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isRadioMuted ? 0 : radioVolume}
                onChange={(e) => {
                  setRadioVolume(Number(e.target.value));
                  if (isRadioMuted) setIsRadioMuted(false);
                }}
                className="w-14 h-1 accent-[#C5A059] bg-white/20 rounded cursor-pointer"
                title={`Volume: ${radioVolume}%`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Media Brand & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#C5A059] text-[#002366] text-[10px] font-black uppercase tracking-widest rounded">
                BROADCAST NETWORK
              </span>
              <span className="text-xs text-[#C5A059] font-medium tracking-wide">
                Phoenix, Arizona • Worldwide Reach
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-white mt-1">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-2xl">
              {subtitle}
            </p>
          </div>

          {/* Direct Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setCurrentView('live-tv')}
              className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:scale-105"
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>Watch Live TV</span>
            </button>
            <button
              onClick={() => setCurrentView('live-radio')}
              className="inline-flex items-center gap-1.5 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:scale-105"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Listen Live Radio</span>
            </button>
          </div>
        </div>

        {/* 10 Subsections Navigation Bar */}
        <div className="mt-5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/20">
          <div className="flex items-center gap-1.5 min-w-max border-b border-white/10 pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSubsection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#C5A059] text-[#002366] shadow-sm font-black'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#002366]' : 'text-[#C5A059]'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-black tracking-tight ${
                        isActive
                          ? 'bg-[#002366] text-[#C5A059]'
                          : item.badge === 'LIVE' || item.badge === 'ON AIR'
                          ? 'bg-rose-600 text-white'
                          : 'bg-white/10 text-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pr-1 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C5A059]" /> Filter Topic:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedMediaCategory(cat)}
              className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-colors font-medium ${
                selectedMediaCategory === cat
                  ? 'bg-white text-[#002366] font-bold shadow-sm'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
