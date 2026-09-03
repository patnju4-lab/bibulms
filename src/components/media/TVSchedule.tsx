import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TVProgram, MediaCategory, MediaVideo } from '../../types/media';
import {
  Tv,
  Calendar,
  Clock,
  User,
  Search,
  Filter,
  Flame,
  Play,
  Share2,
  Bell,
  BellRing,
  CheckCircle2,
  Globe2,
  ChevronRight,
  Info,
  BookOpen,
  Download,
  Printer,
  Sparkles,
  ExternalLink,
  Layers,
  Radio,
  BookmarkCheck
} from 'lucide-react';

interface TVScheduleProps {
  onSelectVideo?: (video: MediaVideo) => void;
  onOpenLive?: () => void;
}

const DAYS_OF_WEEK = [
  'All',
  'My Reminders',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
  'Daily'
] as const;

export const TVSchedule: React.FC<TVScheduleProps> = ({ onSelectVideo, onOpenLive }) => {
  const { tvPrograms, mediaVideos, setCurrentView, currentUser } = useApp();

  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProgram, setSelectedProgram] = useState<TVProgram | null>(null);
  const [timeZone, setTimeZone] = useState<'EAT' | 'EST' | 'UTC' | 'CAT'>('EAT');
  const [reminderSuccess, setReminderSuccess] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'timeline'>('cards');
  const [tenMinAlertModal, setTenMinAlertModal] = useState<TVProgram | null>(null);

  // Persistent reminders stored in localStorage
  const [remindedIds, setRemindedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bibu_tv_reminders');
      return saved ? JSON.parse(saved) : ['tv-prog-1', 'tv-prog-3']; // Default sample reminders
    } catch {
      return ['tv-prog-1', 'tv-prog-3'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bibu_tv_reminders', JSON.stringify(remindedIds));
    } catch {}
  }, [remindedIds]);

  // Time zone conversions (Base is EAT = UTC+3)
  const formatTimeWithZone = (timeStr?: string, zone: 'EAT' | 'EST' | 'UTC' | 'CAT' = 'EAT') => {
    if (!timeStr) return 'TBA';
    if (zone === 'EAT') return `${timeStr} EAT (Nairobi/UTC+3)`;
    if (zone === 'EST') return `${timeStr} (-7 hrs EST/New York)`;
    if (zone === 'UTC') return `${timeStr} (-3 hrs UTC/London)`;
    if (zone === 'CAT') return `${timeStr} (-1 hr CAT/Harare)`;
    return `${timeStr} ${zone}`;
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    tvPrograms.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return ['All', ...Array.from(cats)];
  }, [tvPrograms]);

  const filteredPrograms = useMemo(() => {
    return tvPrograms.filter(prog => {
      // My Reminders filter
      if (selectedDay === 'My Reminders') {
        if (!remindedIds.includes(prog.id)) return false;
      } else if (selectedDay !== 'All') {
        if (selectedDay === 'Daily') {
          if (prog.dayOfWeek !== 'Daily' && prog.broadcastFrequency !== 'Daily') return false;
        } else {
          const matchDay = prog.dayOfWeek?.toLowerCase() === selectedDay.toLowerCase() ||
                           prog.dayOfWeek === 'Daily' ||
                           prog.schedule?.toLowerCase().includes(selectedDay.toLowerCase());
          if (!matchDay) return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All' && prog.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = prog.title.toLowerCase().includes(q);
        const matchSub = prog.subtitle?.toLowerCase().includes(q) || false;
        const matchDesc = prog.description.toLowerCase().includes(q);
        const matchHost = (prog.hostName || prog.presenter || '').toLowerCase().includes(q);
        const matchAudience = prog.targetAudience?.toLowerCase().includes(q) || false;
        if (!matchTitle && !matchSub && !matchDesc && !matchHost && !matchAudience) {
          return false;
        }
      }

      return true;
    });
  }, [tvPrograms, selectedDay, selectedCategory, searchQuery, remindedIds]);

  const liveProgram = tvPrograms.find(p => p.isLiveNow) || tvPrograms[0];

  const handleToggleReminder = (program: TVProgram) => {
    const isReminded = remindedIds.includes(program.id);
    let updated: string[];
    if (isReminded) {
      updated = remindedIds.filter(id => id !== program.id);
      setReminderSuccess(`Reminder cancelled for "${program.title}".`);
    } else {
      updated = [...remindedIds, program.id];
      setReminderSuccess(`🔔 Success! You are subscribed to "${program.title}". You will receive an on-screen alert 10 minutes before airtime (${program.startTime || 'Scheduled Time'}).`);
      // Simulate 10-min alert popup after 1.5 seconds for demo/testing
      setTimeout(() => {
        setTenMinAlertModal(program);
      }, 1500);
    }
    setRemindedIds(updated);
    setTimeout(() => setReminderSuccess(null), 5000);
  };

  const handleTestTenMinAlert = (program: TVProgram) => {
    setTenMinAlertModal(program);
  };

  const handleExportSchedule = () => {
    const header = 'Day,Start Time,End Time,Program Title,Presenter,Category,Target Audience,Reminded\n';
    const rows = tvPrograms.map(p =>
      `"${p.dayOfWeek || 'Weekly'}","${p.startTime || ''}","${p.endTime || ''}","${p.title.replace(/"/g, '""')}","${(p.hostName || p.presenter || '').replace(/"/g, '""')}","${p.category || ''}","${(p.targetAudience || '').replace(/"/g, '""')}","${remindedIds.includes(p.id) ? 'Yes' : 'No'}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BIBU_TV_Broadcast_Schedule_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintSchedule = () => {
    window.print();
  };

  return (
    <div className="space-y-8 text-slate-100">
      {/* 10-Minute Broadcast Warning Alert Modal / Banner */}
      {tenMinAlertModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-gradient-to-br from-[#0B1530] via-[#12234D] to-[#0A1A3A] rounded-3xl max-w-lg w-full border-2 border-amber-500/80 p-6 shadow-2xl space-y-5 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-6 -translate-y-6 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto animate-bounce">
              <BellRing className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-[#002366] text-xs font-black uppercase tracking-widest shadow-md">
                10-MINUTE BROADCAST ALERT ⏰
              </span>
              <h3 className="text-xl font-bold font-display text-white">
                {tenMinAlertModal.title}
              </h3>
              <p className="text-xs text-[#C5A059] font-bold">
                Starting at {tenMinAlertModal.startTime || 'Scheduled Slot'} ({tenMinAlertModal.dayOfWeek || 'Today'})
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your subscribed program is going live in 10 minutes. Prepare your study materials, Bible, and notes for the live academic lecture and Q&A session!
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center gap-3 text-left">
              <img
                src={tenMinAlertModal.presenterPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                alt="Presenter"
                className="w-12 h-12 rounded-full object-cover border border-[#C5A059]"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{tenMinAlertModal.hostName || tenMinAlertModal.presenter}</div>
                <div className="text-[10px] text-slate-400 truncate">{tenMinAlertModal.presenterTitle || 'BIBU Faculty Lecturer'}</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setTenMinAlertModal(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
              >
                Dismiss Alert
              </button>
              <button
                onClick={() => {
                  setTenMinAlertModal(null);
                  if (onOpenLive) {
                    onOpenLive();
                  } else {
                    setCurrentView('live-tv');
                  }
                }}
                className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>Join Live Studio Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Now On-Air Banner */}
      {liveProgram && (
        <div className="bg-gradient-to-r from-rose-950/80 via-[#002366] to-[#0A1A3A] rounded-3xl p-6 border-2 border-rose-600/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider animate-pulse shadow-lg shadow-rose-600/30">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  LIVE BROADCAST ON AIR
                </span>
                <span className="text-xs text-[#C5A059] font-bold">
                  {liveProgram.dayOfWeek} • {liveProgram.airTime || liveProgram.schedule}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                {liveProgram.title}
              </h2>
              <p className="text-xs text-slate-300 line-clamp-2">
                {liveProgram.description}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-bold text-white">{liveProgram.hostName || liveProgram.presenter}</span>
                </div>
                {liveProgram.category && (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[#C5A059] text-[10px] font-bold border border-slate-700">
                    {liveProgram.category}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  if (onOpenLive) {
                    onOpenLive();
                  } else {
                    setCurrentView('live-tv');
                  }
                }}
                className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-rose-600/40 transition-all flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4 fill-current animate-bounce" />
                <span>Enter Live TV Stream</span>
              </button>

              <button
                onClick={() => handleToggleReminder(liveProgram)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 ${
                  remindedIds.includes(liveProgram.id)
                    ? 'bg-amber-500 text-[#002366] border-amber-400 font-black'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>{remindedIds.includes(liveProgram.id) ? 'Reminder Set ✓' : 'Remind Me'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Schedule Control & Filter Bar */}
      <div className="bg-[#0B1530] rounded-3xl border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-[#C5A059]" />
              <h3 className="text-xl font-bold font-display text-white">
                Weekly Television Broadcast Schedule & Reminders
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Subscribe to broadcast slots to receive automated on-screen alerts 10 minutes prior to airtime.
            </p>
          </div>

          {/* Time Zone Selector & Export Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <Globe2 className="w-4 h-4 text-[#C5A059]" />
              <span className="text-slate-400 font-medium">Time Zone:</span>
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value as any)}
                aria-label="Select display time zone"
                className="bg-transparent text-[#C5A059] font-bold focus:outline-none cursor-pointer"
              >
                <option value="EAT" className="bg-slate-900 text-white">East Africa (EAT / Nairobi)</option>
                <option value="EST" className="bg-slate-900 text-white">Eastern US (EST / New York)</option>
                <option value="UTC" className="bg-slate-900 text-white">Universal (UTC / London)</option>
                <option value="CAT" className="bg-slate-900 text-white">Central Africa (CAT)</option>
              </select>
            </div>

            <button
              onClick={handleExportSchedule}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Download CSV Schedule Guide"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={handlePrintSchedule}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Print TV Program Guide"
            >
              <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">Print Guide</span>
            </button>
          </div>
        </div>

        {/* Day-of-Week Navigation Pills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Filter By Broadcast Day or Subscriptions
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-[#C5A059] text-[#002366]'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Cards View
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-[#C5A059] text-[#002366]'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Timetable Grid
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {DAYS_OF_WEEK.map((day) => {
              const count = day === 'All'
                ? tvPrograms.length
                : day === 'My Reminders'
                ? tvPrograms.filter(p => remindedIds.includes(p.id)).length
                : tvPrograms.filter(p =>
                    p.dayOfWeek === day ||
                    (day === 'Daily' && (p.dayOfWeek === 'Daily' || p.broadcastFrequency === 'Daily')) ||
                    p.schedule?.toLowerCase().includes(day.toLowerCase())
                  ).length;

              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-[#002366] text-[#C5A059] border-[#C5A059] shadow-lg scale-105'
                      : day === 'My Reminders'
                      ? 'bg-amber-950/40 text-amber-300 border-amber-600/50 hover:bg-amber-900/40'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {day === 'My Reminders' ? (
                    <Bell className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C5A059]' : 'text-amber-400 animate-pulse'}`} />
                  ) : (
                    <Calendar className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C5A059]' : 'text-slate-500'}`} />
                  )}
                  <span>{day}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isSelected
                      ? 'bg-[#C5A059] text-[#002366]'
                      : day === 'My Reminders'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Category Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by program title, presenter, topic, or scripture focus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="md:col-span-4 relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter programs by theological category"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059] cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  Category: {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reminder notification alert */}
      {reminderSuccess && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-600/50 rounded-2xl text-emerald-200 text-xs font-bold flex items-center justify-between animate-in fade-in shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{reminderSuccess}</span>
          </div>
          <button onClick={() => setReminderSuccess(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Program Results Status */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-400">
        <div>
          Showing <strong>{filteredPrograms.length}</strong> television broadcast slot{filteredPrograms.length !== 1 ? 's' : ''} for{' '}
          <strong className="text-[#C5A059]">{selectedDay}</strong>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            Active Subscriptions: <strong className="text-amber-400">{remindedIds.length}</strong> programs
          </span>
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedDay('All'); setSelectedCategory('All'); }}
              className="text-[#C5A059] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* View Mode 1: Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => {
            const isReminded = remindedIds.includes(program.id);
            return (
              <div
                key={program.id}
                className={`bg-[#0B1530] rounded-3xl border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden shadow-xl group ${
                  isReminded
                    ? 'border-amber-500/80 ring-1 ring-amber-500/20'
                    : program.isLiveNow
                    ? 'border-rose-500/80 ring-2 ring-rose-500/20'
                    : 'border-slate-800 hover:border-[#C5A059]/60'
                }`}
              >
                {/* Card Cover & Badges */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={program.coverImage || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=800'}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1530] via-black/40 to-transparent"></div>

                  {/* Day & Air Time Badge */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-xl bg-[#002366]/90 border border-[#C5A059]/50 text-[#C5A059] text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                      {program.dayOfWeek || 'Weekly'}
                    </span>

                    {isReminded && (
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Bell className="w-3 h-3 fill-current" />
                        Subscribed
                      </span>
                    )}

                    {program.isLiveNow && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider animate-pulse shadow-md">
                        ON AIR
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-lg bg-black/80 text-slate-200 text-[10px] font-mono border border-slate-700">
                      {program.startTime && program.endTime ? `${program.startTime} - ${program.endTime}` : program.airTime || 'Evening'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-900/90 text-[#C5A059] font-bold border border-slate-700">
                      {program.category}
                    </span>
                    {program.episodesCount && (
                      <span className="text-[10px] text-slate-400 bg-black/60 px-2 py-0.5 rounded">
                        {program.episodesCount} Episodes
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4
                      onClick={() => setSelectedProgram(program)}
                      className="text-base font-bold text-white group-hover:text-[#C5A059] transition-colors cursor-pointer line-clamp-2 leading-snug"
                    >
                      {program.title}
                    </h4>

                    {program.subtitle && (
                      <p className="text-xs text-[#C5A059] font-medium line-clamp-1">
                        {program.subtitle}
                      </p>
                    )}

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {program.description}
                    </p>
                  </div>

                  {/* Presenter Info */}
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={program.presenterPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                        alt={program.hostName || program.presenter || 'Presenter'}
                        className="w-10 h-10 rounded-full object-cover border border-[#C5A059]/40"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {program.hostName || program.presenter}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {program.presenterTitle || 'BIBU Faculty Lecturer'}
                        </div>
                      </div>
                    </div>

                    {program.targetAudience && (
                      <div className="text-[10px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                        🎯 Audience: <strong className="text-slate-300">{program.targetAudience}</strong>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setSelectedProgram(program)}
                        className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-800 transition-colors text-center flex items-center justify-center gap-1"
                      >
                        <Info className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Details</span>
                      </button>

                      <button
                        onClick={() => handleToggleReminder(program)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl transition-colors text-center flex items-center justify-center gap-1 ${
                          isReminded
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                            : 'bg-[#002366] hover:bg-[#001A4D] text-[#C5A059] border border-[#C5A059]/30'
                        }`}
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>{isReminded ? 'Subscribed ✓' : 'Remind Me'}</span>
                      </button>
                    </div>

                    {/* Test 10-Min Alert Button for testing */}
                    {isReminded && (
                      <button
                        onClick={() => handleTestTenMinAlert(program)}
                        className="w-full py-1.5 bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 text-[10px] font-bold rounded-lg border border-amber-600/40 flex items-center justify-center gap-1.5 transition-colors"
                        title="Simulate receiving the 10-minute prior alert notification"
                      >
                        <span>🔔 Test 10-Min Alert Popup</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Mode 2: Timetable View */}
      {viewMode === 'timeline' && (
        <div className="bg-[#0B1530] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-300 uppercase font-bold border-b border-slate-800">
                <tr>
                  <th className="py-4 px-4">Day & Broadcast Slot</th>
                  <th className="py-4 px-4">Program Title & Syllabus</th>
                  <th className="py-4 px-4">Host / Faculty</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Target Audience</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredPrograms.map((prog) => {
                  const isReminded = remindedIds.includes(prog.id);
                  return (
                    <tr
                      key={prog.id}
                      className={`hover:bg-slate-900/60 transition-colors ${
                        isReminded ? 'bg-amber-950/20' : prog.isLiveNow ? 'bg-rose-950/20' : ''
                      }`}
                    >
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-1 rounded bg-[#002366] text-[#C5A059] font-black text-[10px] uppercase">
                            {prog.dayOfWeek || 'Weekly'}
                          </span>
                          <div className="font-mono font-bold text-white text-xs">
                            {prog.startTime && prog.endTime ? `${prog.startTime} - ${prog.endTime}` : prog.airTime || 'TBA'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Zone: {timeZone}
                          </div>
                          {isReminded && (
                            <span className="inline-block px-2 py-0.5 bg-amber-500 text-slate-950 text-[9px] font-black rounded-full">
                              🔔 Subscribed (10m Alert)
                            </span>
                          )}
                          {prog.isLiveNow && (
                            <span className="inline-block px-2 py-0.5 bg-rose-600 text-white text-[9px] font-black rounded-full animate-pulse">
                              LIVE NOW
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top max-w-xs">
                        <div className="space-y-1">
                          <div
                            onClick={() => setSelectedProgram(prog)}
                            className="font-bold text-white hover:text-[#C5A059] cursor-pointer text-sm"
                          >
                            {prog.title}
                          </div>
                          {prog.subtitle && (
                            <div className="text-[11px] text-[#C5A059]">{prog.subtitle}</div>
                          )}
                          <p className="text-slate-400 line-clamp-2 text-xs">{prog.description}</p>
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={prog.presenterPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                            alt={prog.hostName || prog.presenter || 'Presenter'}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-white text-xs">{prog.hostName || prog.presenter}</div>
                            <div className="text-[10px] text-slate-400">{prog.presenterTitle || 'Dean / Faculty'}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-[#C5A059] font-medium text-[11px]">
                          {prog.category}
                        </span>
                      </td>

                      <td className="py-4 px-4 align-top text-slate-300">
                        <span className="text-xs">{prog.targetAudience || 'General Christian Community'}</span>
                      </td>

                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedProgram(prog)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleToggleReminder(prog)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                              isReminded
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                                : 'bg-[#C5A059] hover:bg-[#B38E46] text-[#002366]'
                            }`}
                          >
                            {isReminded ? 'Subscribed ✓' : 'Remind Me'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredPrograms.length === 0 && (
        <div className="bg-[#0B1530] rounded-3xl border border-slate-800 p-12 text-center space-y-4">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">
            {selectedDay === 'My Reminders' ? 'You have no active broadcast reminders yet' : 'No television programs found for this selection'}
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {selectedDay === 'My Reminders'
              ? 'Click "Remind Me" on any television program card to subscribe for automated 10-minute prior alerts.'
              : 'Try choosing a different broadcast day, clearing the search query, or selecting another theological category.'}
          </p>
          <button
            onClick={() => { setSelectedDay('All'); setSearchQuery(''); setSelectedCategory('All'); }}
            className="px-4 py-2 bg-[#002366] text-[#C5A059] text-xs font-bold rounded-xl border border-[#C5A059]/40"
          >
            Show All Weekly Programs
          </button>
        </div>
      )}

      {/* Detailed Program Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B1530] rounded-3xl max-w-2xl w-full border border-slate-700 shadow-2xl overflow-hidden text-slate-100 space-y-6">
            {/* Header Image */}
            <div className="relative aspect-video bg-black">
              <img
                src={selectedProgram.coverImage || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=800'}
                alt={selectedProgram.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1530] via-black/40 to-transparent"></div>

              <button
                onClick={() => setSelectedProgram(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>

              <div className="absolute bottom-4 left-6 right-6 space-y-2">
                <span className="px-2.5 py-1 rounded bg-[#002366] text-[#C5A059] text-xs font-black uppercase border border-[#C5A059]/50">
                  {selectedProgram.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {selectedProgram.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 pb-6 space-y-5">
              {selectedProgram.subtitle && (
                <div className="text-sm font-semibold text-[#C5A059]">
                  {selectedProgram.subtitle}
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedProgram.description}
              </p>

              {/* Schedule Info Box */}
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-[#C5A059] uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Broadcast Timing Across Continents</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                  <div>• <strong>Day of Week:</strong> {selectedProgram.dayOfWeek || 'Weekly'}</div>
                  <div>• <strong>East Africa (EAT):</strong> {selectedProgram.startTime || '08:00 PM'} - {selectedProgram.endTime || '09:30 PM'}</div>
                  <div>• <strong>Eastern US (EST):</strong> 1:00 PM - 2:30 PM</div>
                  <div>• <strong>Universal Time (UTC):</strong> 5:00 PM - 6:30 PM</div>
                </div>
              </div>

              {/* Presenter Profile */}
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center gap-4">
                <img
                  src={selectedProgram.presenterPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                  alt={selectedProgram.hostName || selectedProgram.presenter || 'Presenter'}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#C5A059]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-sm font-bold text-white">{selectedProgram.hostName || selectedProgram.presenter}</div>
                  <div className="text-xs text-[#C5A059] font-medium">{selectedProgram.presenterTitle || 'Dean / Professor of Theology'}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Host & Lead Academic Lecturer</div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                {remindedIds.includes(selectedProgram.id) ? (
                  <span className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Subscribed for 10-minute prior warnings
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Click to receive automated 10-minute airtime alerts</span>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedProgram(null)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
                  >
                    Close Window
                  </button>

                  <button
                    onClick={() => {
                      handleToggleReminder(selectedProgram);
                      setSelectedProgram(null);
                    }}
                    className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 ${
                      remindedIds.includes(selectedProgram.id)
                        ? 'bg-rose-900 hover:bg-rose-800 text-white'
                        : 'bg-[#C5A059] hover:bg-[#B38E46] text-[#002366]'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                    <span>{remindedIds.includes(selectedProgram.id) ? 'Cancel Reminder' : 'Set Show Reminder'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
