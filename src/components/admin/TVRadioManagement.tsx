import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaVideo, TVProgram, RadioProgram, MediaPresenter, MediaCategory } from '../../types/media';
import {
  Tv,
  Radio,
  Video,
  Mic,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  Youtube,
  Key,
  Globe2,
  Users,
  Eye,
  BarChart2,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  Link2,
  AlertCircle
} from 'lucide-react';

export const TVRadioManagement: React.FC = () => {
  const {
    mediaVideos,
    addMediaVideo,
    updateMediaVideo,
    deleteMediaVideo,
    tvPrograms,
    addTVProgram,
    updateTVProgram,
    deleteTVProgram,
    radioPrograms,
    addRadioProgram,
    updateRadioProgram,
    deleteRadioProgram,
    radioSettings,
    updateRadioSettings,
    youtubeSettings,
    updateYouTubeSettings,
    mediaPresenters,
    addMediaPresenter,
    updateMediaPresenter,
    deleteMediaPresenter,
    mediaAnalytics
  } = useApp();

  const [activeTab, setActiveTab] = useState<'videos' | 'tv-schedule' | 'radio-schedule' | 'streams' | 'youtube' | 'presenters' | 'analytics'>('videos');

  // Video Form state
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoForm, setVideoForm] = useState<Partial<MediaVideo>>({
    title: '',
    description: '',
    youtubeVideoId: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    duration: '45:00',
    category: 'Theology & Doctrine',
    speakerName: '',
    speakerTitle: 'Professor of Biblical Studies',
    scriptureReference: '',
    isFeatured: false,
    isLive: false,
    tags: ['theology', 'bibu']
  });

  // Radio Stream Form state
  const [streamForm, setStreamForm] = useState(radioSettings);
  const [streamSaveSuccess, setStreamSaveSuccess] = useState(false);

  // YouTube Config Form state
  const [ytForm, setYtForm] = useState(youtubeSettings);
  const [ytSaveSuccess, setYtSaveSuccess] = useState(false);

  // Categories
  const categories: MediaCategory[] = [
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

  // Video Save Handler
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.youtubeVideoId) return;

    if (editingVideoId) {
      updateMediaVideo(editingVideoId, videoForm);
    } else {
      const newVideo: MediaVideo = {
        id: `vid-${Date.now()}`,
        title: videoForm.title || '',
        description: videoForm.description || '',
        youtubeVideoId: videoForm.youtubeVideoId || '',
        thumbnailUrl: videoForm.thumbnailUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
        duration: videoForm.duration || '45:00',
        publishedDate: new Date().toISOString().split('T')[0],
        viewsCount: 150,
        category: videoForm.category || 'Theology & Doctrine',
        speakerName: videoForm.speakerName || 'BIBU Faculty',
        speakerTitle: videoForm.speakerTitle,
        scriptureReference: videoForm.scriptureReference,
        isFeatured: videoForm.isFeatured || false,
        isLive: videoForm.isLive || false,
        tags: videoForm.tags || ['theology']
      };
      addMediaVideo(newVideo);
    }

    setShowVideoModal(false);
    setEditingVideoId(null);
  };

  const handleEditVideoClick = (video: MediaVideo) => {
    setVideoForm(video);
    setEditingVideoId(video.id);
    setShowVideoModal(true);
  };

  const handleSaveStreamSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateRadioSettings(streamForm);
    setStreamSaveSuccess(true);
    setTimeout(() => setStreamSaveSuccess(false), 3000);
  };

  const handleSaveYouTubeSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateYouTubeSettings(ytForm);
    setYtSaveSuccess(true);
    setTimeout(() => setYtSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="bg-[#002366] text-white p-6 rounded-2xl border-t-4 border-[#C5A059] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#C5A059] text-[#002366] text-[10px] font-black uppercase">
              ADMIN CMS & BROADCAST CONTROL
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            TV & Radio Media Management
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Configure YouTube channels, video lecture catalogue, 24/7 radio streaming endpoints, and schedules.
          </p>
        </div>

        <button
          onClick={() => {
            setVideoForm({
              title: '',
              description: '',
              youtubeVideoId: '',
              thumbnailUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
              duration: '45:00',
              category: 'Theology & Doctrine',
              speakerName: '',
              speakerTitle: 'Professor of Biblical Studies',
              scriptureReference: '',
              isFeatured: false,
              isLive: false,
              tags: ['theology', 'bibu']
            });
            setEditingVideoId(null);
            setShowVideoModal(true);
          }}
          className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Video / Broadcast</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'videos', label: `Video Library (${mediaVideos.length})`, icon: Video },
          { id: 'tv-schedule', label: `TV Schedule (${tvPrograms.length})`, icon: Tv },
          { id: 'radio-schedule', label: `Radio Schedule (${radioPrograms.length})`, icon: Radio },
          { id: 'streams', label: 'Radio Stream URLs', icon: Mic },
          { id: 'youtube', label: 'YouTube API & Channel', icon: Youtube },
          { id: 'presenters', label: `Presenters (${mediaPresenters.length})`, icon: Users },
          { id: 'analytics', label: 'Media Analytics', icon: BarChart2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#002366] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A059]' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Video Management */}
      {activeTab === 'videos' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-[#002366] font-display">
              Published Television & Video Lectures
            </h3>
            <span className="text-xs text-slate-500">
              Total {mediaVideos.length} Broadcast Items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Video Title & ID</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Speaker</th>
                  <th className="py-3 px-3">Views</th>
                  <th className="py-3 px-3">Live / Featured</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mediaVideos.map((vid) => (
                  <tr key={vid.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-12 aspect-video bg-black rounded overflow-hidden shrink-0">
                        <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <div className="line-clamp-1">{vid.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">YT ID: {vid.youtubeVideoId} • {vid.duration}</div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{vid.category}</td>
                    <td className="py-3 px-3 text-slate-700">{vid.speakerName}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{vid.viewsCount.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {vid.isFeatured && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                            Featured
                          </span>
                        )}
                        {vid.isLive && (
                          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded animate-pulse">
                            Live Stream
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditVideoClick(vid)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                          title="Edit Video"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete video "${vid.title}"?`)) {
                              deleteMediaVideo(vid.id);
                            }
                          }}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg"
                          title="Delete Video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: TV Schedule Management */}
      {activeTab === 'tv-schedule' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-[#002366] font-display">
              Television Program Lineup
            </h3>
            <span className="text-xs text-slate-500">{tvPrograms.length} Shows Configured</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tvPrograms.map((prog) => (
              <div key={prog.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#002366] bg-amber-100 px-2 py-0.5 rounded">
                    {prog.dayOfWeek} • {prog.airTime}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`Remove show "${prog.title}"?`)) {
                        deleteTVProgram(prog.id);
                      }
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{prog.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{prog.description}</p>
                <div className="text-xs text-slate-500 pt-1">Host: <strong>{prog.hostName}</strong></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Radio Schedule Management */}
      {activeTab === 'radio-schedule' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-[#002366] font-display">
              Radio Program Lineup (24/7 Grid)
            </h3>
            <span className="text-xs text-slate-500">{radioPrograms.length} Shows Configured</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {radioPrograms.map((prog) => (
              <div key={prog.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#002366] bg-blue-100 px-2 py-0.5 rounded font-mono">
                    {prog.dayOfWeek} • {prog.airTime}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`Remove show "${prog.title}"?`)) {
                        deleteRadioProgram(prog.id);
                      }
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{prog.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{prog.description}</p>
                <div className="text-xs text-slate-500 pt-1">Host: <strong>{prog.hostName}</strong></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Radio Stream URL Configuration */}
      {activeTab === 'streams' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-[#002366] font-display">
              Internet Radio Server Configuration
            </h3>
            <p className="text-xs text-slate-500">
              Configure Icecast, Shoutcast, or Zeno FM stream endpoints for live audio streaming.
            </p>
          </div>

          {streamSaveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Radio stream settings updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveStreamSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Station Public Name:
              </label>
              <input
                type="text"
                value={streamForm.stationName}
                onChange={(e) => setStreamForm({ ...streamForm, stationName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#002366]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Live Audio Stream URL (Icecast / Shoutcast / MP3 stream):
              </label>
              <input
                type="url"
                required
                value={streamForm.streamUrl}
                onChange={(e) => setStreamForm({ ...streamForm, streamUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-[#002366]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Mount Point:
                </label>
                <input
                  type="text"
                  value={streamForm.streamMountPoint}
                  onChange={(e) => setStreamForm({ ...streamForm, streamMountPoint: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#002366]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Studio WhatsApp / Call-in Hotline:
                </label>
                <input
                  type="text"
                  value={streamForm.whatsappHotline}
                  onChange={(e) => setStreamForm({ ...streamForm, whatsappHotline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#002366]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Station Tagline:
              </label>
              <input
                type="text"
                value={streamForm.tagline}
                onChange={(e) => setStreamForm({ ...streamForm, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#002366]"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 bg-[#002366] hover:bg-[#001A4D] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#C5A059]" />
              <span>Save Radio Settings</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 5: YouTube Channel & API Setup */}
      {activeTab === 'youtube' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-[#002366] font-display">
              YouTube Channel & Secure API Key Integration
            </h3>
            <p className="text-xs text-slate-500">
              Configure official YouTube Channel credentials, sync playlists, and secure API handles.
            </p>
          </div>

          {ytSaveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>YouTube settings saved successfully!</span>
            </div>
          )}

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>API Key Security Note:</strong>
              <p className="text-amber-800 mt-0.5">
                The YouTube API key is stored securely and proxied for YouTube Data API v3 video imports and metadata syncs without public exposure.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveYouTubeSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Official YouTube Channel ID:
              </label>
              <input
                type="text"
                value={ytForm.channelId}
                onChange={(e) => setYtForm({ ...ytForm, channelId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-[#002366]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Channel Display Title:
                </label>
                <input
                  type="text"
                  value={ytForm.channelTitle}
                  onChange={(e) => setYtForm({ ...ytForm, channelTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#002366]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Custom Handle (@):
                </label>
                <input
                  type="text"
                  value={ytForm.customHandle}
                  onChange={(e) => setYtForm({ ...ytForm, customHandle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#002366]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Secure YouTube Data API v3 Key:
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={ytForm.apiKey || ''}
                onChange={(e) => setYtForm({ ...ytForm, apiKey: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-[#002366]"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-2"
            >
              <Youtube className="w-4 h-4 fill-current" />
              <span>Save YouTube Channel Settings</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 6: Presenters */}
      {activeTab === 'presenters' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-[#002366] font-display">
              Broadcast Presenters & Faculty Lecturers
            </h3>
            <span className="text-xs text-slate-500">{mediaPresenters.length} Registered</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mediaPresenters.map((pres) => (
              <div key={pres.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                <img
                  src={pres.avatarUrl}
                  alt={pres.name}
                  className="w-16 h-16 rounded-full mx-auto object-cover border border-slate-300"
                  referrerPolicy="no-referrer"
                />
                <h4 className="text-sm font-bold text-slate-900">{pres.name}</h4>
                <p className="text-xs text-[#002366] font-medium">{pres.title}</p>
                <div className="text-[10px] text-slate-500">{pres.totalBroadcasts} Published Broadcasts</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Analytics */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-[#002366] font-display">
              Broadcast Audience & Media Engagement Analytics
            </h3>
            <p className="text-xs text-slate-500">Live audience telemetry, video lecture hours, and geographic reach</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-1">
              <Eye className="w-5 h-5 text-blue-600" />
              <div className="text-xl font-black text-slate-900 font-mono">{mediaAnalytics.totalViews.toLocaleString()}</div>
              <div className="text-xs text-slate-600 font-medium">Total Video Lecture Views</div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-1">
              <Mic className="w-5 h-5 text-amber-600" />
              <div className="text-xl font-black text-slate-900 font-mono">{mediaAnalytics.totalRadioListeners.toLocaleString()}</div>
              <div className="text-xs text-slate-600 font-medium">Total Radio Stream Audience</div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-1">
              <Clock className="w-5 h-5 text-emerald-600" />
              <div className="text-xl font-black text-slate-900 font-mono">{mediaAnalytics.totalWatchHours.toLocaleString()} hrs</div>
              <div className="text-xs text-slate-600 font-medium">Accumulated Watch Hours</div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl space-y-1">
              <Globe2 className="w-5 h-5 text-purple-600" />
              <div className="text-xl font-black text-slate-900 font-mono">{mediaAnalytics.activeCountries} Nations</div>
              <div className="text-xs text-slate-600 font-medium">Global Streaming Footprint</div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal Form */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#002366] font-display">
                {editingVideoId ? 'Edit Video Broadcast' : 'Publish New Video Broadcast'}
              </h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Video Title: *
                </label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#002366]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    YouTube Video ID: *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., dQw4w9WgXcQ"
                    value={videoForm.youtubeVideoId}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Support both full URL and plain ID
                      let cleanId = val;
                      if (val.includes('v=')) {
                        cleanId = val.split('v=')[1].split('&')[0];
                      } else if (val.includes('youtu.be/')) {
                        cleanId = val.split('youtu.be/')[1].split('?')[0];
                      }
                      setVideoForm({
                        ...videoForm,
                        youtubeVideoId: cleanId,
                        thumbnailUrl: `https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800`
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-[#002366]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Theological Category:
                  </label>
                  <select
                    value={videoForm.category}
                    onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value as MediaCategory })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#002366]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Speaker / Faculty Name:
                  </label>
                  <input
                    type="text"
                    value={videoForm.speakerName}
                    onChange={(e) => setVideoForm({ ...videoForm, speakerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#002366]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Scripture Focus:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Ephesians 4:11-16"
                    value={videoForm.scriptureReference}
                    onChange={(e) => setVideoForm({ ...videoForm, scriptureReference: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#002366]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Description / Exegesis Overview:
                </label>
                <textarea
                  rows={3}
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#002366]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={videoForm.isFeatured}
                    onChange={(e) => setVideoForm({ ...videoForm, isFeatured: e.target.checked })}
                    className="rounded accent-[#002366]"
                  />
                  <span>Feature on Media Homepage</span>
                </label>

                <label className="flex items-center gap-2 font-bold text-rose-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={videoForm.isLive}
                    onChange={(e) => setVideoForm({ ...videoForm, isLive: e.target.checked })}
                    className="rounded accent-rose-600"
                  />
                  <span>Set as Active Live Broadcast</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#002366] hover:bg-[#001A4D] text-white font-bold rounded-xl shadow"
                >
                  {editingVideoId ? 'Save Changes' : 'Publish Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
