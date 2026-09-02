import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  X,
  Sparkles,
  ExternalLink,
  Mic,
  Music,
  Share2
} from 'lucide-react';

export const PersistentRadioPlayer: React.FC = () => {
  const {
    isRadioPlaying,
    toggleRadioPlay,
    radioVolume,
    setRadioVolume,
    isRadioMuted,
    setIsRadioMuted,
    radioSettings,
    radioPrograms,
    setCurrentView
  } = useApp();

  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  // Find currently active radio program if any, or default to current broadcast
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const currentProgram = radioPrograms.find(p => p.dayOfWeek === today) || radioPrograms[0];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#001844] text-white border-t-2 border-[#C5A059] shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Station branding & animated equalizer */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr from-[#002366] to-[#0A3A82] border border-[#C5A059]/50 flex items-center justify-center shrink-0 ${isRadioPlaying ? 'ring-2 ring-[#C5A059]/60' : ''}`}>
              <Radio className="w-5 h-5 text-[#C5A059]" />
            </div>
            {isRadioPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white truncate font-display">
                {radioSettings.stationName || 'BIBU Radio Worldwide'}
              </span>
              <span className="bg-rose-600 text-white text-[9px] font-black uppercase px-1.5 py-0.2 rounded tracking-wider">
                {isRadioPlaying ? 'LIVE STREAM' : '24/7 ONLINE'}
              </span>
            </div>
            <div className="text-[11px] text-[#C5A059] truncate font-medium">
              Now Airing: {currentProgram ? `${currentProgram.title} (${currentProgram.hostName})` : radioSettings.tagline}
            </div>
          </div>
        </div>

        {/* Center: Audio playback controls & animated visualizer */}
        <div className="flex items-center gap-4">
          {/* Animated audio visualizer bars when playing */}
          {isRadioPlaying && (
            <div className="hidden sm:flex items-end gap-1 h-5 px-2">
              <span className="w-1 bg-[#C5A059] rounded-full animate-[bounce_0.8s_infinite]"></span>
              <span className="w-1 bg-[#C5A059] rounded-full animate-[bounce_1.2s_infinite]"></span>
              <span className="w-1 bg-[#C5A059] rounded-full animate-[bounce_0.6s_infinite]"></span>
              <span className="w-1 bg-[#C5A059] rounded-full animate-[bounce_1s_infinite]"></span>
              <span className="w-1 bg-[#C5A059] rounded-full animate-[bounce_0.7s_infinite]"></span>
            </div>
          )}

          {/* Main Play / Pause Button */}
          <button
            onClick={toggleRadioPlay}
            className={`p-2.5 rounded-full shadow-lg transition-transform active:scale-95 ${
              isRadioPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold ring-2 ring-white/20'
                : 'bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-bold'
            }`}
            title={isRadioPlaying ? 'Pause Broadcast' : 'Play Live Broadcast'}
          >
            {isRadioPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Volume Slider & Mute Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setIsRadioMuted(!isRadioMuted)}
              className="text-slate-300 hover:text-white p-1"
              title={isRadioMuted ? 'Unmute' : 'Mute'}
            >
              {isRadioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
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
              className="w-20 h-1.5 accent-[#C5A059] bg-white/20 rounded cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 font-mono w-7">
              {isRadioMuted ? '0%' : `${radioVolume}%`}
            </span>
          </div>
        </div>

        {/* Right: Quick shortcuts and full studio button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('live-radio')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-colors"
          >
            <Mic className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Radio Studio</span>
          </button>

          <button
            onClick={() => setCurrentView('bibu-radio')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] rounded-lg text-xs font-black uppercase tracking-wider transition-all"
          >
            <span>Schedule</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded"
            title="Close mini player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
