import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaHeader } from './MediaHeader';
import {
  Mic,
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Phone,
  MessageCircle,
  Globe2,
  Headphones,
  Signal,
  Clock,
  Sparkles,
  Calendar,
  User,
  Heart,
  Share2
} from 'lucide-react';

export const LiveRadioPage: React.FC = () => {
  const {
    isRadioPlaying,
    toggleRadioPlay,
    radioVolume,
    setRadioVolume,
    isRadioMuted,
    setIsRadioMuted,
    radioSettings,
    radioPrograms,
    mediaPresenters
  } = useApp();

  const [listenerCount, setListenerCount] = useState(1480);
  const activePresenter = mediaPresenters.find(p => p.role.includes('Host') || p.role.includes('Director')) || mediaPresenters[0];

  const activeListeningCountries = [
    { country: 'Kenya', listeners: 520, flag: '🇰🇪' },
    { country: 'United States', listeners: 340, flag: '🇺🇸' },
    { country: 'Nigeria', listeners: 180, flag: '🇳🇬' },
    { country: 'United Kingdom', listeners: 140, flag: '🇬🇧' },
    { country: 'Uganda', listeners: 110, flag: '🇺🇬' },
    { country: 'South Africa', listeners: 95, flag: '🇿🇦' },
    { country: 'Ghana', listeners: 65, flag: '🇬🇭' },
    { country: 'Canada', listeners: 30, flag: '🇨🇦' },
  ];

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100">
      <MediaHeader
        activeSubsection="live-radio"
        title="BIBU LIVE RADIO STUDIO • 24/7 ON-AIR MASTER CONSOLE"
        subtitle="Broadcasting the Sound of Revival, Gospel Worship, Systematic Theology & 24-Hour Kingdom Prayer"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Main Master Radio Studio Deck */}
        <div className="bg-gradient-to-br from-[#0B1530] via-[#0A1A4A] to-[#070D1E] rounded-3xl border border-[#C5A059]/40 p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="relative">
                <div className={`w-20 h-20 rounded-2xl bg-[#001438] border-2 border-[#C5A059] flex items-center justify-center text-[#C5A059] shadow-xl ${
                  isRadioPlaying ? 'ring-4 ring-[#C5A059]/40' : ''
                }`}>
                  <Mic className="w-10 h-10" />
                </div>
                {isRadioPlaying && (
                  <span className="absolute -top-2 -right-2 bg-rose-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-full animate-pulse shadow">
                    ON AIR
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-[#C5A059] text-[#002366] text-[10px] font-black uppercase rounded">
                    MASTER STUDIO FEED
                  </span>
                  <span className="text-xs text-[#C5A059] font-mono">
                    Mount: {radioSettings.streamMountPoint || '/live-stream'}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
                  {radioSettings.stationName || 'BIBU Radio Worldwide'}
                </h2>
                <p className="text-xs text-slate-300">
                  {radioSettings.tagline || 'Spreading the Gospel of the Kingdom to Every Corner of the Earth'}
                </p>
              </div>
            </div>

            {/* Listener count badge */}
            <div className="flex items-center gap-4 bg-slate-900/90 px-4 py-3 rounded-2xl border border-slate-700 shadow-inner">
              <Headphones className="w-6 h-6 text-[#C5A059] animate-bounce" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Live Audience</div>
                <div className="text-lg font-black text-white font-mono">{listenerCount.toLocaleString()} Listening</div>
              </div>
            </div>
          </div>

          {/* Master Equalizer & Playback Control Strip */}
          <div className="bg-slate-950/80 rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl">
            {/* Visual Equalizer Spectrum */}
            <div className="flex items-end justify-between h-24 sm:h-32 px-4 gap-1.5 bg-black/50 rounded-xl border border-slate-800/80 p-3 overflow-hidden">
              {Array.from({ length: 32 }).map((_, i) => {
                const heightPercent = isRadioPlaying
                  ? Math.floor(Math.sin(i + Date.now() / 300) * 40 + 50 + (i % 5) * 6)
                  : 8;
                return (
                  <div
                    key={i}
                    style={{ height: `${Math.min(95, Math.max(8, heightPercent))}%` }}
                    className={`w-full rounded-t transition-all duration-150 ${
                      i % 4 === 0
                        ? 'bg-[#C5A059]'
                        : i % 2 === 0
                        ? 'bg-amber-400'
                        : 'bg-blue-500'
                    }`}
                  />
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleRadioPlay}
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-95 ${
                    isRadioPlaying
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-black ring-4 ring-amber-400/30'
                      : 'bg-[#C5A059] text-[#002366] hover:bg-[#B38E46] font-black ring-4 ring-[#C5A059]/30'
                  }`}
                >
                  {isRadioPlaying ? (
                    <Pause className="w-10 h-10 fill-current" />
                  ) : (
                    <Play className="w-10 h-10 fill-current translate-x-1" />
                  )}
                </button>

                <div>
                  <div className="text-xs uppercase font-black tracking-widest text-[#C5A059]">
                    {isRadioPlaying ? 'NOW PLAYING STREAM' : 'READY TO PLAY'}
                  </div>
                  <div className="text-lg font-bold text-white">
                    {isRadioPlaying ? 'BIBU Global Radio Transmission' : 'Press Play to Begin Live Stream'}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Stream: {radioSettings.streamUrl}
                  </div>
                </div>
              </div>

              {/* Volume Master */}
              <div className="flex items-center gap-3 bg-slate-900 px-4 py-3 rounded-xl border border-slate-700">
                <button
                  onClick={() => setIsRadioMuted(!isRadioMuted)}
                  className="text-slate-300 hover:text-white"
                >
                  {isRadioMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-[#C5A059]" />}
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
                  className="w-32 h-2 accent-[#C5A059] bg-white/20 rounded cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-slate-300 w-8">
                  {isRadioMuted ? '0%' : `${radioVolume}%`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Presenter Profile & Listener Global Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Presenter On Air */}
          {activePresenter && (
            <div className="lg:col-span-5 bg-[#0B1530] rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                  CURRENT ON-AIR HOST & THEOLOGIAN
                </span>
                <h3 className="text-lg font-bold font-display text-white mt-1">
                  Studio Presenter Profile
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={activePresenter.avatarUrl}
                  alt={activePresenter.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[#C5A059]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-base font-bold text-white">{activePresenter.name}</h4>
                  <p className="text-xs text-[#C5A059] font-medium">{activePresenter.title}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{activePresenter.role}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
                {activePresenter.bio}
              </p>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <span>Specialization:</span>
                <span className="font-bold text-[#C5A059]">{activePresenter.specialization}</span>
              </div>
            </div>
          )}

          {/* Worldwide Live Listener Demographics */}
          <div className="lg:col-span-7 bg-[#0B1530] rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                  GLOBAL SATELLITE & IP AUDIENCE
                </span>
                <h3 className="text-lg font-bold font-display text-white mt-1 flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-[#C5A059]" />
                  <span>Real-Time International Listeners by Country</span>
                </h3>
              </div>
              <span className="text-xs text-slate-400">120+ Countries</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeListeningCountries.map((c) => (
                <div
                  key={c.country}
                  className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c.flag}</span>
                    <span className="text-xs font-bold text-white">{c.country}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#C5A059]">
                    {c.listeners} Active
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Call or WhatsApp Studio Live: <strong>{radioSettings.whatsappHotline}</strong></span>
              </div>
              <span className="text-[10px] text-slate-400">Toll-Free Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
