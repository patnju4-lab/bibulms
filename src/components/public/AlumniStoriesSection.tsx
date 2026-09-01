import React, { useState } from 'react';
import { AlumniStory } from '../../types/alumni';
import { ALUMNI_STORIES_DATA } from '../../data/alumniData';
import {
  BookOpen,
  Video,
  FileText,
  Play,
  Search,
  Filter,
  CheckCircle2,
  Globe,
  Award,
  Calendar,
  Sparkles,
  Quote,
  Share2,
  Send,
  X,
  Maximize2,
  Volume2,
  Check,
  UserPlus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AlumniStoriesSection: React.FC = () => {
  const { currentUser, openAuthModal } = useApp();
  const [stories, setStories] = useState<AlumniStory[]>(ALUMNI_STORIES_DATA);
  const [filterType, setFilterType] = useState<'all' | 'video' | 'text'>('all');
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedStory, setSelectedStory] = useState<AlumniStory | null>(null);
  const [activeVideoStory, setActiveVideoStory] = useState<AlumniStory | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // New story submission form state
  const [newStoryForm, setNewStoryForm] = useState({
    alumni_name: currentUser.role !== 'guest' ? currentUser.name : '',
    email: currentUser.email || '',
    country: 'United States',
    graduation_year: 2024,
    program_name: 'Master of Divinity (M.Div)',
    current_role: '',
    title: '',
    summary: '',
    testimony: '',
    quote: '',
    has_video: false
  });
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Filter logic
  const filteredStories = stories.filter((story) => {
    if (filterType === 'video' && !story.has_video) return false;
    if (filterType === 'text' && story.has_video) return false;
    if (filterLevel !== 'All' && story.qualification_level !== filterLevel) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = story.alumni_name.toLowerCase().includes(q);
      const matchTitle = story.title.toLowerCase().includes(q);
      const matchCountry = story.country.toLowerCase().includes(q);
      const matchRole = story.current_role.toLowerCase().includes(q);
      if (!matchName && !matchTitle && !matchCountry && !matchRole) return false;
    }
    return true;
  });

  const featuredStory = stories.find((s) => s.has_video) || stories[0];

  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AlumniStory = {
      id: `story-custom-${Date.now()}`,
      alumni_id: `BIBU-ALM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      alumni_name: newStoryForm.alumni_name,
      country: newStoryForm.country,
      country_code: 'US',
      graduation_year: Number(newStoryForm.graduation_year),
      program_name: newStoryForm.program_name,
      qualification_level: newStoryForm.program_name.includes('PhD') || newStoryForm.program_name.includes('Doctor') ? 'PhD' : newStoryForm.program_name.includes('Master') ? 'Master' : 'Bachelor',
      current_role: newStoryForm.current_role,
      title: newStoryForm.title,
      summary: newStoryForm.summary,
      testimony: newStoryForm.testimony,
      quote: newStoryForm.quote,
      has_video: newStoryForm.has_video,
      video_duration: newStoryForm.has_video ? '3:30' : undefined,
      video_thumbnail: newStoryForm.has_video ? 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80' : undefined,
      status: 'Pending Review',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setStories([created, ...stories]);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowSubmitModal(false);
      setNewStoryForm({
        alumni_name: '',
        email: '',
        country: 'United States',
        graduation_year: 2024,
        program_name: 'Master of Divinity (M.Div)',
        current_role: '',
        title: '',
        summary: '',
        testimony: '',
        quote: '',
        has_video: false
      });
    }, 2500);
  };

  return (
    <div className="space-y-10 animate-in fade-in">
      {/* SECTION HEADER & HERO CARD */}
      <div className="bg-gradient-to-br from-[#002366] via-[#001A4D] to-[#000F2E] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-[#C5A059]/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>BIBU Alumni Impact & Testimonies</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight leading-tight">
              Transforming Nations, Churches, and Communities for Christ
            </h1>
            
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Explore inspiring video and written testimonials from Breakthrough International Bible University graduates serving in over 50 nations as bishops, pastors, missionaries, chaplains, and Christian educators.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-[#002366] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Your Success Story</span>
              </button>
              
              <div className="text-xs text-amber-200/90 font-mono">
                ✦ Verified Graduate Testimonies (2017–2026)
              </div>
            </div>
          </div>

          {/* Featured Hero Story Video Teaser Card */}
          {featuredStory && (
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 space-y-4 shadow-2xl">
              <div className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer bg-slate-900 border border-white/10"
                   onClick={() => featuredStory.has_video ? setActiveVideoStory(featuredStory) : setSelectedStory(featuredStory)}>
                <img
                  src={featuredStory.video_thumbnail || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'}
                  alt={featuredStory.alumni_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-4">
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-1 bg-[#C5A059] text-[#002366] text-[10px] font-black uppercase rounded-lg">
                      Featured Testimony
                    </span>
                    {featuredStory.has_video && (
                      <span className="px-2 py-0.5 bg-black/60 text-white text-[10px] font-mono rounded-md flex items-center gap-1">
                        <Video className="w-3 h-3 text-[#C5A059]" />
                        {featuredStory.video_duration}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{featuredStory.title}</h4>
                      <p className="text-xs text-amber-300 font-semibold">{featuredStory.alumni_name} ({featuredStory.country})</p>
                    </div>
                    
                    <div className="w-12 h-12 rounded-full bg-[#C5A059] text-[#002366] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 italic line-clamp-2">
                "{featuredStory.quote}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Format Tabs (All / Video / Text) */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Stories ({stories.length})
            </button>
            <button
              onClick={() => setFilterType('video')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filterType === 'video'
                  ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-amber-500" />
              <span>Video Testimonials ({stories.filter(s => s.has_video).length})</span>
            </button>
            <button
              onClick={() => setFilterType('text')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filterType === 'text'
                  ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>Written Testimonies ({stories.filter(s => !s.has_video).length})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search graduate or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002366]"
            />
          </div>
        </div>

        {/* Qualification Level Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 shrink-0">Level:</span>
          {['All', 'PhD', 'DMin', 'Master', 'Bachelor'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterLevel === lvl
                  ? 'bg-[#C5A059] text-[#002366] font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {lvl === 'All' ? 'All Programs' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* STORIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <div
            key={story.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Card Header Media / Badge */}
            {story.has_video ? (
              <div
                className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden"
                onClick={() => setActiveVideoStory(story)}
              >
                <img
                  src={story.video_thumbnail || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'}
                  alt={story.alumni_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#C5A059] text-[#002366] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-white font-mono flex items-center gap-1.5">
                  <Video className="w-3 h-3 text-[#C5A059]" />
                  <span>Video Testimony ({story.video_duration})</span>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-100 flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Written Testimony</span>
                </div>
                <span className="text-xs font-bold text-slate-500 font-mono">{story.graduation_year}</span>
              </div>
            )}

            {/* Card Body */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-[#002366] flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
                    {story.country}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                    {story.qualification_level}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#002366] group-hover:text-[#C5A059] transition-colors leading-snug">
                  {story.title}
                </h3>

                <div className="space-y-0.5">
                  <div className="text-xs font-black text-slate-900">
                    {story.alumni_name}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">
                    {story.current_role}
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {story.summary}
                </p>

                <blockquote className="border-l-2 border-[#C5A059] pl-3 py-1 text-xs italic text-slate-700 bg-slate-50 rounded-r-lg">
                  "{story.quote}"
                </blockquote>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  {story.alumni_id}
                </span>

                <button
                  onClick={() => setSelectedStory(story)}
                  className="px-3.5 py-2 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-[#C5A059] text-xs font-black uppercase tracking-wider transition-all inline-flex items-center gap-1.5 shadow-xs"
                >
                  <span>Read Full Story</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No matching alumni stories found</h3>
          <p className="text-xs text-slate-500">Try adjusting your filters or search query.</p>
        </div>
      )}

      {/* ======================================================== */}
      {/* FULL STORY MODAL */}
      {/* ======================================================== */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002366]/10 text-[#002366] text-xs font-bold uppercase tracking-wider mb-2">
                    <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{selectedStory.program_name}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366] leading-tight">
                    {selectedStory.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Graduate info badge */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="w-14 h-14 rounded-full bg-[#002366] text-[#C5A059] flex items-center justify-center font-display font-black text-lg border-2 border-[#C5A059]">
                  {selectedStory.alumni_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-base font-black text-[#002366]">{selectedStory.alumni_name}</h3>
                  <p className="text-xs font-semibold text-slate-600">{selectedStory.current_role}</p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>{selectedStory.country}</span>
                    <span>•</span>
                    <span>Class of {selectedStory.graduation_year}</span>
                    <span>•</span>
                    <span className="font-mono text-[#002366]">{selectedStory.alumni_id}</span>
                  </p>
                </div>
              </div>

              {/* Testimony content */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#002366] mb-1">Graduate Testimony</h4>
                  <p className="bg-slate-50 p-4 rounded-2xl border border-slate-200 italic leading-relaxed text-slate-800">
                    "{selectedStory.testimony}"
                  </p>
                </div>

                {selectedStory.achievements && selectedStory.achievements.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#002366]">Key Ministry & Academic Achievements</h4>
                    <ul className="space-y-1.5">
                      {selectedStory.achievements.map((ach, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-700">{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <blockquote className="border-l-4 border-[#C5A059] pl-4 py-2 text-xs sm:text-sm font-semibold italic text-[#002366] bg-amber-50/50 rounded-r-xl">
                  "{selectedStory.quote}"
                </blockquote>
              </div>

              {/* Modal footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">BIBU Verified Alumni Impact Record</span>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#002366] text-[#C5A059] text-xs font-black uppercase tracking-wider"
                >
                  Close Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIDEO TESTIMONIAL PLAYER MODAL */}
      {/* ======================================================== */}
      {activeVideoStory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-700 animate-in zoom-in-95">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-xs font-bold uppercase tracking-wider mb-1">
                    <Video className="w-3.5 h-3.5" />
                    <span>Video Testimonial ({activeVideoStory.video_duration})</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                    {activeVideoStory.title}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveVideoStory(null)}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Simulated Video Player UI */}
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center group">
                <img
                  src={activeVideoStory.video_thumbnail || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80'}
                  alt={activeVideoStory.alumni_name}
                  className="w-full h-full object-cover opacity-60"
                />
                
                <div className="absolute inset-0 bg-radial from-transparent via-black/50 to-black/90 flex flex-col justify-between p-6">
                  {/* Top bar in video */}
                  <div className="flex justify-between items-center text-xs text-slate-300 font-mono">
                    <span className="px-3 py-1 rounded-lg bg-black/60 border border-white/10">BIBU Global Broadcast • HD 1080p</span>
                    <span className="px-3 py-1 rounded-lg bg-red-600/80 text-white font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> LIVE RECORDING
                    </span>
                  </div>

                  {/* Center Play Button Simulator */}
                  <div className="self-center">
                    <div className="w-20 h-20 rounded-full bg-[#C5A059] text-[#002366] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                  </div>

                  {/* Bottom Video Controls */}
                  <div className="space-y-2">
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer">
                      <div className="bg-[#C5A059] h-full w-1/3 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                      <span>1:24 / {activeVideoStory.video_duration}</span>
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-4 h-4 cursor-pointer hover:text-white" />
                        <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Details & Transcript */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">{activeVideoStory.alumni_name}</h3>
                    <p className="text-xs text-[#C5A059]">{activeVideoStory.current_role} ({activeVideoStory.country})</p>
                  </div>
                  <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono">
                    Class of {activeVideoStory.graduation_year} • {activeVideoStory.qualification_level}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">Testimony Transcript</h4>
                  <p className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 text-slate-200 leading-relaxed italic">
                    "{activeVideoStory.testimony}"
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Alumni ID: {activeVideoStory.alumni_id}</span>
                <button
                  onClick={() => setActiveVideoStory(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#b08e4c] text-[#002366] text-xs font-black uppercase tracking-wider"
                >
                  Close Player
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBMIT ALUMNI STORY MODAL */}
      {/* ======================================================== */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002366]/10 text-[#002366] text-xs font-bold uppercase tracking-wider mb-1">
                    <UserPlus className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>BIBU Alumni Secretariat</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366]">
                    Share Your Success Story
                  </h2>
                </div>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submittedSuccess ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto font-bold">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900">Testimony Submitted Successfully!</h3>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Thank you for sharing how God is using your BIBU education. Our Alumni Secretariat will review and publish your story to the global registry shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleStorySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name & Title:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rev. Dr. David Smith"
                        value={newStoryForm.alumni_name}
                        onChange={(e) => setNewStoryForm({ ...newStoryForm, alumni_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#002366]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address:
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alumni@bibu-edu.org"
                        value={newStoryForm.email}
                        onChange={(e) => setNewStoryForm({ ...newStoryForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#002366]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Country:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kenya"
                        value={newStoryForm.country}
                        onChange={(e) => setNewStoryForm({ ...newStoryForm, country: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#002366]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Graduation Year:
                      </label>
                      <select
                        value={newStoryForm.graduation_year}
                        onChange={(e) => setNewStoryForm({ ...newStoryForm, graduation_year: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#002366]"
                      >
                        {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map((yr) => (
                          <option key={yr} value={yr}>{yr}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Program Completed:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Master of Divinity"
                        value={newStoryForm.program_name}
                        onChange={(e) => setNewStoryForm({ ...newStoryForm, program_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#002366]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Current Role & Organization:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Pastor, Grace Chapel International"
                      value={newStoryForm.current_role}
                      onChange={(e) => setNewStoryForm({ ...newStoryForm, current_role: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Story Title:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Planting 10 Churches Across East Africa"
                      value={newStoryForm.title}
                      onChange={(e) => setNewStoryForm({ ...newStoryForm, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Summary (1-2 sentences):
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Brief summary of your ministry impact..."
                      value={newStoryForm.summary}
                      onChange={(e) => setNewStoryForm({ ...newStoryForm, summary: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Testimony & Experience:
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe how BIBU prepared you for ministry..."
                      value={newStoryForm.testimony}
                      onChange={(e) => setNewStoryForm({ ...newStoryForm, testimony: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Inspirational Quote:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="A short memorable quote summarizing your ministry philosophy..."
                      value={newStoryForm.quote}
                      onChange={(e) => setNewStoryForm({ ...newStoryForm, quote: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#002366] hover:bg-[#001A4D] text-[#C5A059] rounded-xl text-xs font-black uppercase tracking-wider shadow-sm inline-flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Testimony</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
