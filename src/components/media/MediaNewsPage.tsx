import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaHeader } from './MediaHeader';
import { VideoPlayerModal } from './VideoPlayerModal';
import { MediaVideo } from '../../types/media';
import {
  Newspaper,
  Calendar,
  Eye,
  Play,
  Sparkles,
  Share2,
  ExternalLink,
  Award,
  Globe2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const MediaNewsPage: React.FC = () => {
  const { mediaVideos, bulletins, setCurrentView } = useApp();
  const [selectedVideo, setSelectedVideo] = useState<MediaVideo | null>(null);

  const newsVideos = mediaVideos.filter(
    v => v.category === 'Campus & Convocation' || v.category === 'Global Missions' || v.tags?.includes('news')
  );

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100">
      <MediaHeader
        activeSubsection="media-news"
        title="BIBU BROADCAST NEWS & KINGDOM ANNOUNCEMENTS"
        subtitle="Global Convocation Dispatches • Examination Centre Accreditations • University Press Releases"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Featured News Release Banner */}
        <div className="bg-[#0B1530] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white animate-pulse">
              OFFICIAL DISPATCH
            </span>
            <span className="text-xs text-[#C5A059] font-medium">
              Phoenix, AZ & International Headquarters
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                BIBU Expands Global Examination Centre Network Across All 47 Counties of Kenya & 120+ Sovereign Nations
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                The Academic Senate and International Chancellor have ratified the full operationalization
                of decentralized examination centres, providing accessible theological and leadership accreditation
                to thousands of ministers, pastors, and degree candidates worldwide.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-[#C5A059]" />
                  <span>Published: September 2026</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Accreditation Board Verified</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                Key Press Highlights
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>47 Official County Coordinators Appointed in Kenya</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>Online Certificate Verification & QR Registry Active</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>24/7 Global Satellite Television & Radio Transmission</span>
                </li>
              </ul>
              <button
                onClick={() => setCurrentView('exam-centres')}
                className="w-full mt-2 py-2 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider rounded-xl transition-all"
              >
                View Global Examination Directory &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Video News Reports */}
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-[#C5A059]" />
              <span>Video Bulletins & Broadcast News Reports</span>
            </h3>
            <p className="text-xs text-slate-400">Watch recorded university news coverage and graduation highlights</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="bg-[#0B1530] rounded-2xl border border-slate-800 hover:border-[#C5A059]/50 overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#C5A059] text-[#002366] flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    {video.duration}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-black uppercase text-[#C5A059] bg-amber-500/10 px-2 py-0.5 rounded">
                    {video.category}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors line-clamp-2">
                    {video.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{video.description}</p>
                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span>{video.speakerName}</span>
                    <span>{video.viewsCount.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            ))}
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
