import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VideoPlayerModal } from '../media/VideoPlayerModal';
import { MediaVideo } from '../../types/media';
import {
  Tv,
  Radio,
  Play,
  Bookmark,
  Heart,
  BookOpen,
  Calendar,
  Clock,
  Flame,
  Mic,
  Sparkles,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

export const StudentMediaSection: React.FC = () => {
  const {
    mediaVideos,
    studentMediaProgress,
    currentUser,
    setCurrentView,
    toggleRadioPlay,
    isRadioPlaying,
    recordVideoView
  } = useApp();

  const [selectedVideo, setSelectedVideo] = useState<MediaVideo | null>(null);

  // Student saved bookmarks
  const userProgress = studentMediaProgress.filter(p => p.studentId === currentUser?.id);
  const bookmarkedIds = userProgress.filter(p => p.isBookmarked).map(p => p.videoId);
  const bookmarkedVideos = mediaVideos.filter(v => bookmarkedIds.includes(v.id));

  // Recommended lectures for academic students
  const academicLectures = mediaVideos.filter(v => v.category === 'Academic Lectures' || v.category === 'Theology & Doctrine' || v.category === 'Biblical Studies').slice(0, 3);

  const handleOpenVideo = (video: MediaVideo) => {
    setSelectedVideo(video);
    recordVideoView(video.id);
  };

  return (
    <div className="space-y-6">
      {/* Media Quick Banner */}
      <div className="bg-gradient-to-r from-[#002366] via-[#0A3A82] to-[#002366] text-white p-6 rounded-2xl border border-[#C5A059]/40 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-[#C5A059]/50 flex items-center justify-center text-[#C5A059]">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#C5A059] text-[#002366] px-2 py-0.5 rounded">
                BIBU MEDIA INTEGRATION
              </span>
              <span className="text-xs text-[#C5A059] font-medium">
                Live Broadcasts & Course Video Lectures
              </span>
            </div>
            <h3 className="text-lg font-bold font-display text-white mt-1">
              TV & Radio Academic Media Library
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleRadioPlay}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              isRadioPlaying
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            <Mic className="w-4 h-4 text-[#C5A059]" />
            <span>{isRadioPlaying ? 'Pause Radio' : 'Play Live Radio'}</span>
          </button>

          <button
            onClick={() => setCurrentView('media-center')}
            className="px-4 py-2 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black text-xs uppercase tracking-wider rounded-xl shadow transition-all"
          >
            Open Media Center &rarr;
          </button>
        </div>
      </div>

      {/* Recommended Academic Lectures */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#002366]" />
            <h4 className="text-base font-bold text-[#002366] font-display">
              Recommended Theological Lectures for Enrolled Courses
            </h4>
          </div>
          <button
            onClick={() => setCurrentView('bibu-tv')}
            className="text-xs text-[#002366] hover:underline font-bold"
          >
            Explore TV Library &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {academicLectures.map((video) => (
            <div
              key={video.id}
              className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden hover:border-[#002366]/40 transition-all flex flex-col justify-between group"
            >
              <div
                onClick={() => handleOpenVideo(video)}
                className="relative aspect-video bg-black cursor-pointer overflow-hidden"
              >
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#C5A059] text-[#002366] flex items-center justify-center shadow">
                    <Play className="w-4 h-4 fill-current translate-x-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                  {video.duration}
                </span>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#002366] uppercase bg-blue-100 px-2 py-0.5 rounded">
                    {video.category}
                  </span>
                  <h5
                    onClick={() => handleOpenVideo(video)}
                    className="text-xs font-bold text-slate-900 group-hover:text-[#002366] cursor-pointer line-clamp-2 mt-1"
                  >
                    {video.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {video.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                  <span>{video.speakerName}</span>
                  <button
                    onClick={() => handleOpenVideo(video)}
                    className="font-bold text-[#002366] hover:underline"
                  >
                    Watch & Notes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookmarked Lectures / Saved for Study */}
      {bookmarkedVideos.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bookmark className="w-5 h-5 text-[#C5A059]" />
            <h4 className="text-base font-bold text-[#002366] font-display">
              Saved Lectures for Personal Study ({bookmarkedVideos.length})
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {bookmarkedVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleOpenVideo(video)}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition-colors space-y-2"
              >
                <div className="text-xs font-bold text-slate-900 line-clamp-1">
                  {video.title}
                </div>
                <div className="text-[10px] text-slate-500">
                  {video.speakerName} • {video.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};
