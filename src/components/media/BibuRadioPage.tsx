import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaHeader } from './MediaHeader';
import { RadioProgram } from '../../types/media';
import {
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Mic,
  Calendar,
  Clock,
  User,
  Heart,
  Send,
  Sparkles,
  Music,
  Share2,
  CheckCircle2,
  Headphones,
  Signal,
  Flame,
  MessageSquare
} from 'lucide-react';

export const BibuRadioPage: React.FC = () => {
  const {
    radioPrograms,
    radioSettings,
    mediaPresenters,
    isRadioPlaying,
    toggleRadioPlay,
    radioVolume,
    setRadioVolume,
    isRadioMuted,
    setIsRadioMuted,
    setCurrentView
  } = useApp();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [selectedDay, setSelectedDay] = useState<string>(daysOfWeek.includes(todayDay) ? todayDay : 'Monday');
  const [audioBitrate, setAudioBitrate] = useState<'64kbps' | '128kbps' | '320kbps'>('128kbps');

  // Prayer Request / Shoutout Form State
  const [senderName, setSenderName] = useState('');
  const [senderLocation, setSenderLocation] = useState('');
  const [prayerRequestText, setPrayerRequestText] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Filter programs for selected day
  const dailyPrograms = radioPrograms.filter(p => p.dayOfWeek === selectedDay);
  const currentShow = dailyPrograms[0] || radioPrograms[0];

  const handlePrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !prayerRequestText) return;

    setSubmissionSuccess(true);
    setSenderName('');
    setSenderLocation('');
    setPrayerRequestText('');

    setTimeout(() => {
      setSubmissionSuccess(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100">
      <MediaHeader
        activeSubsection="bibu-radio"
        title="BIBU RADIO WORLDWIDE • 24/7 BROADCAST"
        subtitle="Spreading the Gospel, Theological Wisdom, Gospel Worship & Kingdom Prayer to the Nations"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Live Radio Studio Player Console */}
        <div className="bg-gradient-to-br from-[#0B1530] via-[#0D1C44] to-[#0B1530] rounded-3xl border border-[#C5A059]/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Station Vinyl / Equalizer Graphic */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
              <div className="relative group">
                <div className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-[#00102E] via-[#002366] to-[#0A3A82] border-4 border-[#C5A059] flex items-center justify-center shadow-2xl ${
                  isRadioPlaying ? 'animate-[spin_12s_linear_infinite]' : ''
                }`}>
                  <div className="w-20 h-20 rounded-full bg-[#00102E] border-2 border-[#C5A059]/60 flex items-center justify-center text-[#C5A059]">
                    <Radio className="w-8 h-8" />
                  </div>
                </div>

                {isRadioPlaying && (
                  <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                    <span className="bg-rose-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-lg animate-pulse tracking-widest">
                      ON AIR NOW
                    </span>
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#C5A059]">
                  {radioSettings.frequency || 'INTERNET STREAM • GLOBAL'}
                </span>
                <h3 className="text-lg font-bold font-display text-white mt-0.5">
                  {radioSettings.stationName || 'BIBU Radio Worldwide'}
                </h3>
              </div>
            </div>

            {/* Right: Master Broadcast Console Controls */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500/20 text-[#C5A059] border border-[#C5A059]/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      24/7 Digital Audio Stream
                    </span>
                    <span className="text-xs text-slate-400">
                      Format: MP3 / AAC Plus
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
                    {currentShow ? currentShow.title : 'Live Theological Transmission'}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#C5A059] font-semibold mt-0.5 flex items-center gap-1.5">
                    <Mic className="w-4 h-4" />
                    <span>Host / Presenter: {currentShow ? currentShow.hostName : 'BIBU Broadcast Team'}</span>
                  </p>
                </div>

                {/* Bitrate Selector */}
                <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700 text-xs">
                  {(['64kbps', '128kbps', '320kbps'] as const).map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setAudioBitrate(rate)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                        audioBitrate === rate
                          ? 'bg-[#C5A059] text-[#002366] shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {rate}
                    </button>
                  ))}
                </div>
              </div>

              {/* Player Control Strip */}
              <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-inner">
                <div className="flex items-center gap-4">
                  {/* Master Play Button */}
                  <button
                    onClick={toggleRadioPlay}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all active:scale-95 ${
                      isRadioPlaying
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/30 font-black hover:bg-amber-400'
                        : 'bg-[#C5A059] text-[#002366] ring-4 ring-[#C5A059]/30 font-black hover:bg-[#B38E46]'
                    }`}
                  >
                    {isRadioPlaying ? (
                      <Pause className="w-8 h-8 fill-current" />
                    ) : (
                      <Play className="w-8 h-8 fill-current translate-x-0.5" />
                    )}
                  </button>

                  <div>
                    <div className="text-xs uppercase font-black tracking-widest text-[#C5A059]">
                      {isRadioPlaying ? 'Streaming Live' : 'Stream Ready'}
                    </div>
                    <div className="text-sm font-bold text-white">
                      {isRadioPlaying ? 'Live Audio Connected' : 'Click to Listen Live'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Server: {radioSettings.streamUrl}
                    </div>
                  </div>
                </div>

                {/* Volume & Equalizer */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                  <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setIsRadioMuted(!isRadioMuted)}
                      className="text-slate-300 hover:text-white"
                      title={isRadioMuted ? 'Unmute' : 'Mute'}
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
                      className="w-28 h-2 accent-[#C5A059] bg-white/20 rounded cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-300 w-8">
                      {isRadioMuted ? '0%' : `${radioVolume}%`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Meta */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Signal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Bitrate: {audioBitrate} • Lossless Audio Buffer</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Headphones className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Active Listeners Worldwide: 1,420+</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Radio Schedule Browser */}
        <div className="bg-[#0B1530] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#C5A059]" />
                <span>24/7 Weekly Radio Broadcast Schedule</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Browse our comprehensive programming schedule across all 7 days
              </p>
            </div>

            {/* Days Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedDay === day
                      ? 'bg-[#C5A059] text-[#002366] shadow font-black'
                      : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Schedule List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyPrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 hover:border-[#C5A059]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-[#C5A059] bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-mono">
                    <Clock className="w-3 h-3 inline-block mr-1" />
                    {prog.airTime}
                  </span>
                  <span className="text-[11px] text-slate-400">{prog.durationMinutes} min</span>
                </div>

                <h4 className="text-base font-bold text-white">{prog.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{prog.description}</p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1 text-[#C5A059] font-medium">
                    <User className="w-3.5 h-3.5" />
                    <span>{prog.hostName}</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {prog.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Live Prayer Request & Studio Shoutout Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-[#0B1530] rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <span className="p-2 rounded-xl bg-amber-500/10 text-[#C5A059] border border-amber-500/20">
                <MessageSquare className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  Send Live Prayer Request or Studio Shoutout
                </h3>
                <p className="text-xs text-slate-400">
                  Transmitted directly to our on-air radio pastors and intercessory prayer team
                </p>
              </div>
            </div>

            {submissionSuccess ? (
              <div className="p-6 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Prayer Request Received!</h4>
                <p className="text-xs text-slate-300">
                  Our on-air ministry team is lifting your petition in Jesus' name during our live intercession hour.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePrayerSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Your Full Name: *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Pastor David Mwangi"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Country / City:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Nairobi, Kenya or Phoenix, AZ"
                      value={senderLocation}
                      onChange={(e) => setSenderLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Prayer Request or Shoutout Message: *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your prayer point, ministry testimony, or greetings to our global listeners..."
                    value={prayerRequestText}
                    onChange={(e) => setPrayerRequestText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit to On-Air Studio</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Studio Direct Contact & Broadcast Information */}
          <div className="lg:col-span-6 bg-[#0B1530] rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold font-display text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#C5A059]" />
                <span>On-Air Studio & Worldwide Listeners Hotline</span>
              </h3>

              <div className="space-y-4 pt-4 text-xs text-slate-300">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#C5A059]">Studio WhatsApp / Call-in Line</div>
                  <div className="text-base font-bold text-white font-mono">{radioSettings.whatsappHotline || '+1 (602) 555-BIBU'}</div>
                  <div className="text-[11px] text-slate-400">Direct line to the on-air DJ & live pastoral counselors</div>
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#C5A059]">Digital Audio Stream Links (For Media Players)</div>
                  <div className="text-xs font-mono text-slate-300 truncate bg-slate-950 p-2 rounded-lg border border-slate-800">
                    {radioSettings.streamUrl}
                  </div>
                  <div className="text-[10px] text-slate-400">Compatible with VLC, iTunes, TuneIn Radio, Winamp, Android & iOS</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Stream Latency: &lt; 2.5s</span>
              <button
                onClick={() => setCurrentView('live-radio')}
                className="text-[#C5A059] font-bold hover:underline"
              >
                Launch Studio Console &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
