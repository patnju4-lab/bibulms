import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaVideo, MediaCategory, TVProgram } from '../../types/media';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  Tv,
  Youtube,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  Search,
  Star,
  Globe,
  Clock,
  Calendar,
  Film,
  Sparkles,
  Shield,
  Layers,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export const TVAdminPortal: React.FC = () => {
  const {
    mediaVideos,
    addMediaVideo,
    updateMediaVideo,
    deleteMediaVideo,
    reorderMediaVideos,
    youtubeSettings,
    updateYouTubeSettings,
    tvPrograms,
    addTVProgram,
    updateTVProgram,
    deleteTVProgram
  } = useApp();

  const [activeTab, setActiveTab] = useState<'videos' | 'schedule' | 'settings'>('videos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Video Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<MediaVideo>>({
    title: '',
    description: '',
    youtubeVideoId: '',
    youtubeUrl: '',
    startTimeSeconds: undefined,
    thumbnailUrl: '',
    duration: '45:00',
    publishedDate: new Date().toISOString().split('T')[0],
    category: 'Bible Teaching',
    speakerName: '',
    speakerTitle: 'BIBU Faculty Lecturer',
    isFeatured: false,
    tags: ['BIBU TV', 'Bible Teaching']
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // YouTube settings form state
  const [ytForm, setYtForm] = useState(youtubeSettings);
  const [ytSuccess, setYtSuccess] = useState(false);

  const categories: MediaCategory[] = [
    'Bible Teaching',
    'Sermons',
    'Christian Leadership',
    'Theology Lectures',
    'BIBU Events',
    'Ministry Programs',
    'Live Broadcasts',
    'Conferences',
    'Graduation',
    'Interviews',
    'Ministry Training',
    'BIBU Chapel Services',
    'Theology Classes',
    'University News',
    'Special Events'
  ];

  // Helper to parse YouTube URL
  const parseYouTubeUrl = (url: string) => {
    let videoId = url.trim();
    let startTime: number | undefined = undefined;

    try {
      if (url.includes('youtu.be/')) {
        const parts = url.split('youtu.be/')[1].split('?');
        videoId = parts[0];
        if (parts[1]) {
          const params = new URLSearchParams(parts[1]);
          const t = params.get('t');
          if (t) startTime = parseInt(t.replace('s', ''), 10);
        }
      } else if (url.includes('youtube.com/')) {
        if (url.includes('/embed/')) {
          videoId = url.split('/embed/')[1].split('?')[0];
        } else if (url.includes('v=')) {
          const params = new URLSearchParams(url.split('?')[1]);
          const v = params.get('v');
          if (v) videoId = v;
          const t = params.get('t');
          if (t) startTime = parseInt(t.replace('s', ''), 10);
        }
      }
    } catch {
      // fallback
    }
    return { videoId, startTime };
  };

  const handleUrlChange = (urlStr: string) => {
    const { videoId, startTime } = parseYouTubeUrl(urlStr);
    const thumb = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
    const finalUrl = startTime
      ? `https://www.youtube.com/watch?v=${videoId}&t=${startTime}s`
      : `https://www.youtube.com/watch?v=${videoId}`;

    setFormData(prev => ({
      ...prev,
      youtubeUrl: urlStr,
      youtubeVideoId: videoId,
      startTimeSeconds: startTime,
      thumbnailUrl: thumb
    }));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      youtubeVideoId: '',
      youtubeUrl: '',
      startTimeSeconds: undefined,
      thumbnailUrl: '',
      duration: '45:00',
      publishedDate: new Date().toISOString().split('T')[0],
      category: 'Bible Teaching',
      speakerName: '',
      speakerTitle: 'BIBU Faculty Lecturer',
      isFeatured: false,
      tags: ['BIBU TV']
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (vid: MediaVideo) => {
    setEditingId(vid.id);
    setFormData(vid);
    setIsModalOpen(true);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.youtubeVideoId) {
      alert('Please provide a title and a valid YouTube URL or Video ID.');
      return;
    }

    const finalThumb =
      formData.thumbnailUrl ||
      `https://img.youtube.com/vi/${formData.youtubeVideoId}/hqdefault.jpg`;

    const finalYtUrl =
      formData.youtubeUrl ||
      (formData.startTimeSeconds
        ? `https://www.youtube.com/watch?v=${formData.youtubeVideoId}&t=${formData.startTimeSeconds}s`
        : `https://www.youtube.com/watch?v=${formData.youtubeVideoId}`);

    const payload: MediaVideo = {
      id: editingId || `video-${Date.now()}`,
      title: formData.title || 'Untitled Broadcast',
      description: formData.description || 'Breakthrough International Bible University Broadcast',
      youtubeVideoId: formData.youtubeVideoId,
      youtubeUrl: finalYtUrl,
      startTimeSeconds: formData.startTimeSeconds,
      thumbnailUrl: finalThumb,
      duration: formData.duration || '45:00',
      publishedDate: formData.publishedDate || new Date().toISOString().split('T')[0],
      category: (formData.category as MediaCategory) || 'Bible Teaching',
      speakerName: formData.speakerName || 'BIBU Faculty',
      speakerTitle: formData.speakerTitle || 'Professor of Theology',
      isFeatured: !!formData.isFeatured,
      viewsCount: formData.viewsCount || 120,
      tags: formData.tags || ['BIBU TV']
    };

    if (editingId) {
      updateMediaVideo(editingId, payload);
      setSuccessMessage('Video broadcast entry successfully updated.');
    } else {
      addMediaVideo(payload);
      setSuccessMessage('New YouTube video successfully added to BIBU TV library.');
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this video from BIBU TV?')) {
      deleteMediaVideo(id);
      setSuccessMessage('Video entry successfully deleted.');
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  const handleToggleFeatured = (vid: MediaVideo) => {
    updateMediaVideo(vid.id, { isFeatured: !vid.isFeatured });
    updateYouTubeSettings({ ...youtubeSettings, featuredVideoId: !vid.isFeatured ? vid.youtubeVideoId : youtubeSettings.featuredVideoId });
    setSuccessMessage(`Featured status updated for "${vid.title}".`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleToggleVisibility = (vid: MediaVideo) => {
    const isCurrentlyHidden = vid.status === 'archived' || vid.isVisible === false;
    const newStatus = isCurrentlyHidden ? 'published' : 'archived';
    const newVisible = isCurrentlyHidden ? true : false;
    updateMediaVideo(vid.id, { status: newStatus, isVisible: newVisible });
    setSuccessMessage(`Video "${vid.title}" is now ${newVisible ? 'Visible' : 'Hidden'} on BIBU TV.`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleMoveOrder = (vidId: string, direction: 'up' | 'down') => {
    reorderMediaVideos(vidId, direction);
    setSuccessMessage('Video display order updated.');
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  const handleSaveYouTubeSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateYouTubeSettings(ytForm);
    setYtSuccess(true);
    setTimeout(() => setYtSuccess(false), 3500);
  };

  const filteredVideos = mediaVideos.filter(v => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.speakerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || v.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-[#002366] via-[#001744] to-[#000F2E] text-white rounded-2xl p-6 sm:p-8 border border-[#C5A059]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#C5A059]/20 border border-[#C5A059]/40 rounded-2xl text-[#C5A059]">
            <Tv className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#C5A059] text-[#002366] text-[10px] font-black uppercase tracking-wider">
                BIBU TV Studio Control
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {mediaVideos.length} Active Broadcasts
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Television & Video Management Portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Authorized administration for BIBU TV Online broadcasts, YouTube embedding synchronization, and scheduling.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:scale-105 shrink-0 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add YouTube Video</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs sm:text-sm flex items-center gap-3 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'videos'
              ? 'bg-[#002366] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Film className="w-4 h-4 text-[#C5A059]" />
          <span>Video Library ({mediaVideos.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'schedule'
              ? 'bg-[#002366] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#C5A059]" />
          <span>TV Schedule & Programs</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-[#002366] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Youtube className="w-4 h-4 text-[#C5A059]" />
          <span>YouTube Channel Integration</span>
        </button>
      </div>

      {/* TAB 1: VIDEOS MANAGEMENT */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search videos by title or speaker..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#002366]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-slate-500 uppercase shrink-0">Category:</span>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#002366]"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Videos Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-600 tracking-wider">
                    <th className="py-3 px-3 w-16 text-center">Order</th>
                    <th className="py-3 px-4">Thumbnail / Video</th>
                    <th className="py-3 px-4">Title & Speaker</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">YouTube ID</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredVideos.map((video, idx) => {
                    const isHidden = video.status === 'archived' || video.isVisible === false;
                    return (
                    <tr key={video.id} className={`hover:bg-slate-50/80 transition-colors ${isHidden ? 'opacity-60 bg-slate-50/50' : ''}`}>
                      {/* Order Controls */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveOrder(video.id, 'up')}
                            className="p-1 text-slate-400 hover:text-[#002366] disabled:opacity-20 disabled:hover:text-slate-400 rounded transition-colors"
                            title="Move Up in Display Order"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <span className="text-[10px] font-mono font-bold text-slate-500">{idx + 1}</span>
                          <button
                            type="button"
                            disabled={idx === filteredVideos.length - 1}
                            onClick={() => handleMoveOrder(video.id, 'down')}
                            className="p-1 text-slate-400 hover:text-[#002366] disabled:opacity-20 disabled:hover:text-slate-400 rounded transition-colors"
                            title="Move Down in Display Order"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 w-36">
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 shadow-xs bg-slate-900 group">
                          <img
                            src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold text-white bg-[#002366]/90 px-2 py-1 rounded">
                              {video.duration || '45:00'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 line-clamp-1">{video.title}</div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {video.speakerName || 'BIBU Faculty'} • <span className="font-mono text-slate-400">{video.publishedDate}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-[#002366]/10 text-[#002366] font-semibold text-[11px]">
                          {video.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleFeatured(video)}
                          className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 ${
                            video.isFeatured
                              ? 'bg-amber-50 border-amber-300 text-amber-700 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                          }`}
                          title={video.isFeatured ? 'Featured Broadcast (Click to Unset)' : 'Set as Featured'}
                        >
                          <Star className={`w-4 h-4 ${video.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                          <span className="text-[10px]">{video.isFeatured ? 'Featured' : 'Standard'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleVisibility(video)}
                          className={`p-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                            isHidden
                              ? 'bg-slate-100 border-slate-300 text-slate-500'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          }`}
                          title={isHidden ? 'Click to Show on BIBU TV' : 'Click to Hide from BIBU TV'}
                        >
                          {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span className="text-[10px] font-bold">{isHidden ? 'Hidden' : 'Visible'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={`https://www.youtube.com/watch?v=${video.youtubeVideoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[#002366] hover:underline flex items-center gap-1 font-semibold text-[11px]"
                        >
                          <Youtube className="w-3.5 h-3.5 text-red-600" />
                          <span>{video.youtubeVideoId}</span>
                        </a>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(video)}
                            className="p-1.5 bg-slate-100 hover:bg-[#002366] hover:text-white rounded-lg transition-colors text-slate-700"
                            title="Edit Video Entry"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(video.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-colors text-red-600"
                            title="Delete Video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                  {filteredVideos.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                        No video broadcasts found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCHEDULE & PROGRAMS */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">BIBU TV Weekly Broadcast Schedule</h3>
              <p className="text-xs text-slate-500">Manage daily theological programs, chapel services, and live lecture slots.</p>
            </div>
            <div className="px-3 py-1 bg-[#C5A059]/20 text-[#C5A059] rounded-lg text-xs font-bold">
              {tvPrograms.length} Scheduled Programs
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tvPrograms.map(prog => (
              <div key={prog.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#002366] text-white font-bold text-[10px]">
                    {prog.dayOfWeek}
                  </span>
                  <span className="font-mono text-[#002366] font-bold">
                    {prog.timeSlot}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{prog.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{prog.description}</p>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                  <span className="font-semibold text-slate-700">Host/Speaker:</span> {prog.host}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: YOUTUBE INTEGRATION SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">YouTube API & Channel Integration</h3>
            <p className="text-xs text-slate-500">Configure official channel link, embed parameters, and primary broadcast feed.</p>
          </div>

          {ytSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>YouTube Channel Settings successfully saved!</span>
            </div>
          )}

          <form onSubmit={handleSaveYouTubeSettings} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Official YouTube Channel URL
              </label>
              <input
                type="text"
                value={ytForm.channelUrl}
                onChange={e => setYtForm({ ...ytForm, channelUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-[#002366]"
                placeholder="https://www.youtube.com/@Bibuniversity"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Custom Handle / Display Name
              </label>
              <input
                type="text"
                value={ytForm.customHandle}
                onChange={e => setYtForm({ ...ytForm, customHandle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#002366]"
                placeholder="@Bibuniversity"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Default Featured Video ID
              </label>
              <input
                type="text"
                value={ytForm.featuredVideoId}
                onChange={e => setYtForm({ ...ytForm, featuredVideoId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-[#002366]"
                placeholder="dCkCzxVruuk"
              />
              <p className="text-[10px] text-slate-500">
                The YouTube video ID highlighted on the main BIBU TV hero banner.
              </p>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#002366] hover:bg-[#001744] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#C5A059]" />
              <span>Save Channel Configuration</span>
            </button>
          </form>
        </div>
      )}

      {/* ADD / EDIT VIDEO MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-in">
            <div className="bg-[#002366] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-sm uppercase tracking-wider">
                  {editingId ? 'Edit YouTube Video Entry' : 'Add New YouTube Video to BIBU TV'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  YouTube Video URL or Embed Link *
                </label>
                <input
                  type="text"
                  required
                  value={formData.youtubeUrl || ''}
                  onChange={e => handleUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=dCkCzxVruuk or youtu.be/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-[#002366]"
                />
                <p className="text-[10px] text-slate-500">
                  Automatically extracts Video ID and timestamps (e.g. &t=98s).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Extracted Video ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.youtubeVideoId || ''}
                    onChange={e => setFormData({ ...formData, youtubeVideoId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Start Time (seconds)
                  </label>
                  <input
                    type="number"
                    value={formData.startTimeSeconds || ''}
                    onChange={e => setFormData({ ...formData, startTimeSeconds: e.target.value ? parseInt(e.target.value, 10) : undefined })}
                    placeholder="e.g. 98"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Foundations of Biblical Hermeneutics"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#002366]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Description / Synopsis
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed lecture overview..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#002366]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Category *
                  </label>
                  <select
                    value={formData.category || 'Bible Teaching'}
                    onChange={e => setFormData({ ...formData, category: e.target.value as MediaCategory })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#002366]"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration || '45:00'}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="45:00"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Speaker / Lecturer Name
                  </label>
                  <input
                    type="text"
                    value={formData.speakerName || ''}
                    onChange={e => setFormData({ ...formData, speakerName: e.target.value })}
                    placeholder="Dr. Robert Henderson"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Speaker Title
                  </label>
                  <input
                    type="text"
                    value={formData.speakerTitle || ''}
                    onChange={e => setFormData({ ...formData, speakerTitle: e.target.value })}
                    placeholder="Professor of Biblical Theology"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Live Preview If Video ID Present */}
              {formData.youtubeVideoId && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-rose-600" />
                    <span>Live Embedded Player Preview (Privacy-Enhanced)</span>
                  </label>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden border border-slate-300">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${formData.youtubeVideoId}${formData.startTimeSeconds ? `?start=${formData.startTimeSeconds}&controls=1&fs=1` : '?controls=1&fs=1'}`}
                      title="Admin Video Preview"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeaturedCheck"
                  checked={!!formData.isFeatured}
                  onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-[#002366] rounded border-slate-300 focus:ring-[#002366]"
                />
                <label htmlFor="isFeaturedCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Feature this video on the BIBU TV Banner & Hero Section
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#002366] hover:bg-[#001744] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-[#C5A059]" />
                  <span>{editingId ? 'Save Changes' : 'Publish to BIBU TV'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
