import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaHeader } from './MediaHeader';
import {
  Flame,
  Tv,
  Eye,
  MessageSquare,
  Send,
  Users,
  Calendar,
  Clock,
  Share2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Volume2
} from 'lucide-react';

interface LiveMessage {
  id: string;
  sender: string;
  location: string;
  text: string;
  time: string;
  isPrayer?: boolean;
}

export const LiveTVPage: React.FC = () => {
  const { mediaVideos, tvPrograms, currentUser, radioSettings } = useApp();

  const [viewerCount, setViewerCount] = useState(2840);
  const [liveMessages, setLiveMessages] = useState<LiveMessage[]>([
    { id: '1', sender: 'Bishop Samuel', location: 'Nairobi, Kenya', text: 'Watching the live broadcast with our examination candidates! Powerful teaching.', time: '2m ago' },
    { id: '2', sender: 'Pastor Grace', location: 'Phoenix, Arizona', text: 'Amen! Praise God for this international convocation transmission.', time: '1m ago' },
    { id: '3', sender: 'Dr. John', location: 'London, UK', text: 'Receiving the Word with joy. Greetings to the Chancellor and faculty.', time: 'Just now' },
    { id: '4', sender: 'Sister Mary', location: 'Kampala, Uganda', text: 'Please pray for our regional Bible school centre.', time: 'Just now', isPrayer: true }
  ]);

  const [inputName, setInputName] = useState(currentUser?.name || '');
  const [inputLocation, setInputLocation] = useState('Global Campus');
  const [inputText, setInputText] = useState('');
  const [isPrayerToggle, setIsPrayerToggle] = useState(false);

  // Live video source
  const liveVideo = mediaVideos.find(v => v.isLive) || mediaVideos[0];

  // Fluctuate viewer count slightly to simulate realistic live stream
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 7) - 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: LiveMessage = {
      id: Date.now().toString(),
      sender: inputName || 'Anonymous Viewer',
      location: inputLocation || 'Worldwide',
      text: inputText.trim(),
      time: 'Just now',
      isPrayer: isPrayerToggle
    };

    setLiveMessages(prev => [newMsg, ...prev]);
    setInputText('');
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100">
      <MediaHeader
        activeSubsection="live-tv"
        title="BIBU LIVE TELEVISION • 24/7 GLOBAL SATELLITE BROADCAST"
        subtitle="Worldwide Live Transmission Room • Ministry Convocations & Apostolic Impartation"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Top Status Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0B1530] p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-white inline-block"></span>
              <span>LIVE ON AIR</span>
            </span>
            <div>
              <h2 className="text-base font-bold text-white">
                {liveVideo ? liveVideo.title : 'Global Convocation & Ordination Ceremony'}
              </h2>
              <p className="text-xs text-[#C5A059] font-medium">
                Speaker: {liveVideo ? liveVideo.speakerName : 'Chancellor & Apostolic Council'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-white font-bold">
              <Eye className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>{viewerCount.toLocaleString()} Live Viewers</span>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Live TV broadcast link copied!");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Stream</span>
            </button>
          </div>
        </div>

        {/* Live Stream Screen + Live Interactive Chat Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Video Screen */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              {liveVideo && (
                <iframe
                  src={`https://www.youtube.com/embed/${liveVideo.youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={liveVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* Broadcast Description & Notes */}
            <div className="bg-[#0B1530] p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-[#C5A059]">
                  Live Broadcast Summary & Scriptural Focus
                </span>
                <span className="text-xs text-slate-400">Stream Quality: Ultra HD 4K / 1080p</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {liveVideo?.description || 'You are tuned into the official Breakthrough International Bible University Global Television Live Stream. Bringing apostolic revelation, theological academic leadership, and Holy Spirit revival into over 120 nations.'}
              </p>
              {liveVideo?.scriptureReference && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-[#C5A059] font-medium">
                  Scripture Theme: {liveVideo.scriptureReference}
                </div>
              )}
            </div>
          </div>

          {/* Live Interactive Chat / Prayer Board */}
          <div className="lg:col-span-4 bg-[#0B1530] rounded-2xl border border-slate-800 flex flex-col h-[580px] overflow-hidden shadow-2xl">
            {/* Chat Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#C5A059]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Live Global Fellowship & Prayer Board
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">● Active</span>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {liveMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl border ${
                    msg.isPrayer
                      ? 'bg-amber-500/10 border-amber-500/30 text-slate-200'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-white mb-1">
                    <span className="text-[#C5A059] truncate">{msg.sender}</span>
                    <span className="text-[10px] text-slate-500 font-normal">{msg.time}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mb-1">{msg.location}</div>
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
                />
                <input
                  type="text"
                  placeholder="Location (City, Country)"
                  value={inputLocation}
                  onChange={(e) => setInputLocation(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message or prayer point..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="submit"
                  className="p-2 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] rounded-xl font-bold transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isPrayerToggle}
                  onChange={(e) => setIsPrayerToggle(e.target.checked)}
                  className="accent-[#C5A059] rounded"
                />
                <span>Mark as urgent Prayer Request for on-air intercessors</span>
              </label>
            </form>
          </div>
        </div>

        {/* Upcoming Live Broadcast Lineup */}
        <div className="bg-[#0B1530] p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#C5A059]" />
              <span>Today's Live Television Broadcast Lineup</span>
            </h3>
            <p className="text-xs text-slate-400">Scheduled live broadcasts streaming globally today</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tvPrograms.slice(0, 3).map((item, idx) => (
              <div key={item.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase">
                  <span className="text-[#C5A059] font-mono">{item.airTime}</span>
                  <span className="text-slate-400">{idx === 0 ? 'NEXT UP' : 'UPCOMING'}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                <div className="text-xs text-[#C5A059] font-medium pt-1">
                  Host: {item.hostName}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
