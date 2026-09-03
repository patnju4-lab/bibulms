import React from 'react';
import { useApp } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  GraduationCap,
  BookOpen,
  Award,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  Flame,
  ArrowRight,
  Sparkles,
  Users,
  Search,
  BookText,
  Calendar,
  FileCheck2,
  HeartHandshake,
  Layers,
  Lock,
  Briefcase,
  Shield,
  KeyRound,
  Tv,
  Radio,
  Video,
  Mic,
  Play,
  Youtube,
  ExternalLink,
  Clock,
  Eye
} from 'lucide-react';

export const PublicHome: React.FC = () => {
  const {
    setCurrentView,
    schools,
    programs,
    announcements,
    setSelectedSchoolId,
    setSelectedProgramId,
    universityInfo,
    mediaVideos,
    youtubeSettings
  } = useApp();

  const handleSchoolClick = (schoolId: string) => {
    setSelectedSchoolId(schoolId);
    setCurrentView('schools');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProgramClick = (programId: string) => {
    setSelectedProgramId(programId);
    setCurrentView('programs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 0. Urgent Announcement Ticker if present */}
      {universityInfo.announcementTicker && (
        <div className="bg-[#C5A059] text-[#002366] px-4 py-2 text-xs font-bold shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#002366] text-[#C5A059] px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider">
                Notice
              </span>
              <span className="truncate">{universityInfo.announcementTicker}</span>
            </div>
            <button
              onClick={() => setCurrentView('admissions')}
              className="text-[11px] font-black uppercase underline hover:opacity-80 shrink-0"
            >
              Apply Now &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 1. Hero Section */}
      <section className="relative bg-[#002366] text-white py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-[#C5A059] overflow-hidden">
        {/* Subtle decorative radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,26,77,0.5),transparent_50%)]" />

        <div className="relative max-w-6xl mx-auto text-center space-y-6">
          {/* Institutional Crest & Seal Badge */}
          <div className="flex flex-col items-center justify-center gap-3">
            <UniversityLogo size="2xl" withRing className="shadow-2xl hover:scale-105 transition-transform" />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#001A4D] border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold uppercase tracking-widest shadow-inner">
              <GraduationCap className="w-4 h-4 text-[#C5A059]" />
              <span>{universityInfo.name} • {universityInfo.location}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-tight max-w-4xl mx-auto">
            {universityInfo.heroHeadline || 'Equipping Kingdom Leaders, Pastors & Scholars Worldwide'}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed">
            {universityInfo.heroSubtitle || universityInfo.tagline}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setCurrentView('admissions')}
              className="px-6 py-3.5 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black uppercase tracking-wider text-xs shadow-lg transition-all flex items-center gap-2 hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply for Admission</span>
            </button>

            <button
              onClick={() => setCurrentView('programs')}
              className="px-6 py-3.5 rounded-xl bg-[#001A4D] hover:bg-[#001438] text-white font-bold uppercase tracking-wider text-xs border border-white/20 shadow transition-all flex items-center gap-2 hover:border-[#C5A059]"
            >
              <BookOpen className="w-4 h-4 text-[#C5A059]" />
              <span>Explore Programs</span>
            </button>

            <button
              onClick={() => setCurrentView('rpl')}
              className="px-6 py-3.5 rounded-xl bg-[#001438] hover:bg-[#001A4D] text-[#C5A059] font-bold uppercase tracking-wider text-xs border border-[#C5A059]/40 transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>RPL / Prior Ministry Credits</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-white/10 max-w-4xl mx-auto">
            <div className="bg-[#001A4D] border border-[#C5A059]/30 rounded-xl p-4">
              <div className="text-2xl sm:text-3xl font-display font-black text-[#C5A059]">{schools.length}</div>
              <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1">Academic Schools</div>
            </div>
            <div className="bg-[#001A4D] border border-[#C5A059]/30 rounded-xl p-4">
              <div className="text-2xl sm:text-3xl font-display font-black text-[#C5A059]">{universityInfo.activeCountries}+</div>
              <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1">Active Nations</div>
            </div>
            <div className="bg-[#001A4D] border border-[#C5A059]/30 rounded-xl p-4">
              <div className="text-2xl sm:text-3xl font-display font-black text-[#C5A059]">{universityInfo.alumniCount.toLocaleString()}+</div>
              <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1">Global Alumni</div>
            </div>
            <div className="bg-[#001A4D] border border-[#C5A059]/30 rounded-xl p-4">
              <div className="text-2xl sm:text-3xl font-display font-black text-[#C5A059]">{programs.length}</div>
              <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1">Degree & Certificate Tracks</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Welcome from the Chancellor */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center text-center p-6 bg-[#F8F9FB] rounded-xl border border-slate-200">
            <div className="w-24 h-24 rounded-full bg-[#002366] border-2 border-[#C5A059] p-1 mb-4 shadow-md flex items-center justify-center text-[#C5A059] font-display font-black text-2xl">
              <UniversityLogo size="md" />
            </div>
            <h3 className="text-base font-bold text-[#002366] font-display">{universityInfo.chancellor}</h3>
            <p className="text-[11px] text-[#C5A059] font-bold uppercase tracking-wider">{universityInfo.chancellorTitle}</p>
            <p className="text-xs text-slate-500 mt-2">{universityInfo.name}, {universityInfo.location}</p>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#C5A059] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chancellor's Welcome</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#002366]">
              Transforming Ministers for the End-Time Harvest
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              "At Breakthrough International Bible University, we believe that academic excellence and the power of the Holy Spirit must go hand-in-hand. For over two decades, our mission in Phoenix, Arizona, has reached across continents to equip pastors, evangelists, counselors, and church leaders with uncompromised biblical doctrine and practical ministry skills."
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Whether you are planting your first church or pursuing your Doctor of Ministry while leading thousands, our state-of-the-art Learning Management System allows you to study at your own pace without leaving your ministry assignment.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => setCurrentView('about')}
                className="text-xs font-bold text-[#002366] hover:text-[#C5A059] uppercase tracking-wider flex items-center gap-1 transition-colors"
              >
                <span>Read Full Doctrinal Statement & History</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5. University Portals & Secure Gateway Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-linear-to-r from-[#002366] via-[#001A4D] to-[#001438] rounded-2xl p-6 sm:p-8 text-white border-2 border-[#C5A059]/40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2 text-[#C5A059] text-xs font-black uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticated University Gateway</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
                  Access Institutional Portals & Ministerial Networks
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
                  Role-governed portals require verified account authentication and secure ministerial credentials.
                </p>
              </div>
              <button
                onClick={() => {
                  setCurrentView('portals');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black uppercase tracking-wider text-xs rounded-xl flex items-center gap-2 shrink-0 transition-all hover:scale-105 shadow-md"
              >
                <KeyRound className="w-4 h-4" />
                <span>Open Portal Access Hub</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Student Portal */}
              <button
                onClick={() => {
                  setCurrentView('portals');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C5A059] text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-bold">
                    Student
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors">
                  Student Learning Portal
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  LMS classroom, video lectures, exams, grades & degree transcripts.
                </p>
              </button>

              {/* Faculty Portal */}
              <button
                onClick={() => {
                  setCurrentView('portals');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C5A059] text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                    Faculty
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors">
                  Faculty & Instructor Portal
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Course builder, grading assessments, syllabus review & student cohort tracking.
                </p>
              </button>

              {/* Alumni Network */}
              <button
                onClick={() => {
                  setCurrentView('alumni');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C5A059] text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                    14,500+ Global
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors">
                  Global Alumni Network
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Worldwide ministry directory, chapter hubs, ordination verification & mentorship.
                </p>
              </button>

              {/* Global Fellowships */}
              <button
                onClick={() => {
                  setCurrentView('fellowships');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C5A059] text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 group-hover:scale-110 transition-transform">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono uppercase bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold">
                    Ministry
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors">
                  Global Ministry Fellowships
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Pastoral roundtables, missionary cohorts & 24/7 global intercessory prayer network.
                </p>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 TV & Radio Digital Broadcasting Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#001438] via-[#002366] to-[#0A2E73] rounded-3xl p-6 sm:p-10 border-2 border-[#C5A059]/40 shadow-2xl text-white space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold uppercase tracking-widest">
                <Tv className="w-4 h-4 text-[#C5A059]" />
                <span>Global Media & Broadcasting Center</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-bold text-white leading-tight">
                Breakthrough International Bible University TV & Radio
              </h2>
              <p className="text-sm text-slate-300">
                Broadcasting sound biblical doctrine, expository preaching, keynote lectures, and 24/7 global worship streams to over 50 nations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setCurrentView('media-center');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-3 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all hover:scale-105"
              >
                📺 Enter Full Media Center
              </button>
              <button
                onClick={() => {
                  setCurrentView('bibu-radio');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
              >
                <Radio className="w-4 h-4 text-[#C5A059]" />
                <span>Listen Live 24/7</span>
              </button>
            </div>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => {
                setCurrentView('bibu-tv');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-5 bg-slate-900/60 hover:bg-slate-900/90 rounded-2xl border border-slate-700/60 hover:border-[#C5A059] cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-[#C5A059] flex items-center justify-center border border-blue-400/30">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-[#C5A059] transition-colors">BIBU TV</h4>
              <p className="text-xs text-slate-300">Keynote convocation broadcasts, faculty theological lectures, and ministry series in HD.</p>
            </div>

            <div
              onClick={() => {
                setCurrentView('bibu-radio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-5 bg-slate-900/60 hover:bg-slate-900/90 rounded-2xl border border-slate-700/60 hover:border-[#C5A059] cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#C5A059] flex items-center justify-center border border-amber-400/30">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-[#C5A059] transition-colors">BIBU Radio 24/7</h4>
              <p className="text-xs text-slate-300">Continuous digital radio with praise & worship, expository audio sermons, and live talkshows.</p>
            </div>

            <div
              onClick={() => {
                setCurrentView('live-tv');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-5 bg-slate-900/60 hover:bg-slate-900/90 rounded-2xl border border-slate-700/60 hover:border-rose-400 cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-400/30">
                <Flame className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">Live TV Room</h4>
                <span className="text-[9px] bg-rose-600 text-white font-black px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
              </div>
              <p className="text-xs text-slate-300">Participate in live interactive broadcasts with live global community chat & notes.</p>
            </div>

            <div
              onClick={() => {
                setCurrentView('youtube-channel');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-5 bg-slate-900/60 hover:bg-slate-900/90 rounded-2xl border border-slate-700/60 hover:border-rose-500 cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <Youtube className="w-5 h-5 fill-current" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">YouTube Channel</h4>
              <p className="text-xs text-slate-300">Subscribe to our official channel for archived playlists, course modules, and podcasts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2.6 Dedicated BREAKTHROUGH TV Homepage Showcase */}
      <section id="homepage-breakthrough-tv" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="bg-[#070D1E] rounded-3xl p-6 sm:p-10 border-2 border-slate-800 shadow-2xl text-slate-100 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/20 border border-rose-500/40 text-rose-400 text-xs font-black uppercase tracking-widest">
                <Tv className="w-3.5 h-3.5 text-rose-500" />
                <span>OFFICIAL YOUTUBE BROADCASTING</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-black text-white leading-tight">
                BREAKTHROUGH TV
              </h2>
              <div className="text-xs sm:text-sm font-semibold text-[#C5A059] tracking-wider uppercase flex items-center gap-2 flex-wrap">
                <span>Faith</span>
                <span className="text-slate-600">•</span>
                <span>Education</span>
                <span className="text-slate-600">•</span>
                <span>Leadership</span>
                <span className="text-slate-600">•</span>
                <span>Transformation</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                Official YouTube channel <strong className="text-white font-mono">{youtubeSettings.customHandle || '@Bibuniversity'}</strong> broadcasting theological masterclasses, academic convocations, live chapel services, and pastoral leadership training.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                id="homepage-view-all-breakthrough-tv-btn"
                onClick={() => {
                  setCurrentView('breakthrough-tv');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <Tv className="w-4 h-4 text-white" />
                <span>VIEW ALL BREAKTHROUGH TV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={youtubeSettings.channelUrl || 'https://www.youtube.com/@Bibuniversity'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
              >
                <Youtube className="w-4 h-4 text-rose-400 fill-current" />
                <span>WATCH ON YOUTUBE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 6 Featured / Latest Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaVideos.slice(0, 6).map((video) => (
              <div
                key={video.id}
                onClick={() => {
                  setCurrentView('breakthrough-tv');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-[#0B1530] rounded-2xl border border-slate-800 hover:border-[#C5A059] overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={video.thumbnail || video.thumbnailUrl || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=600'}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                    {video.duration}
                  </span>
                  <span className="absolute top-2 left-2 bg-[#002366]/90 text-[#C5A059] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-[#C5A059]/40">
                    {video.category}
                  </span>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors line-clamp-2 leading-snug">
                      {video.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300 truncate max-w-[140px]">
                      {video.presenter || video.speakerName || 'BIBU Faculty'}
                    </span>
                    <span className="font-mono">{video.viewsCount.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The 9 Academic Schools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs font-black uppercase tracking-widest text-[#C5A059]">
            Faculties & Academic Divisions
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#002366]">
            Explore Our 9 Academic Schools
          </h2>
          <p className="text-sm text-slate-600">
            Structured theological disciplines designed for deep scriptural mastery, practical shepherd leadership, and cross-cultural impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <div
              key={school.id}
              onClick={() => handleSchoolClick(school.id)}
              className="group bg-white rounded-xl border border-slate-200 hover:border-[#002366] p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#002366]/10 text-[#002366] group-hover:bg-[#002366] group-hover:text-[#C5A059] flex items-center justify-center transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#002366] group-hover:bg-[#C5A059]/20 group-hover:text-[#002366]">
                    {school.code}
                  </span>
                </div>

                <h3 className="text-base font-display font-bold text-[#002366] group-hover:text-[#002366] transition-colors">
                  {school.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {school.description}
                </p>

                <div className="pt-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Departments:</div>
                  <ul className="text-xs text-slate-700 mt-1 space-y-0.5">
                    {school.departments.slice(0, 2).map((dept, i) => (
                      <li key={i} className="flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0"></span>
                        <span className="truncate font-medium">{dept}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#002366] group-hover:text-[#C5A059]">
                <span>View {school.programsCount} Programs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#C5A059]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Programs */}
      <section className="bg-white py-16 px-4 sm:px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-widest text-[#C5A059]">
                Degrees & Awards
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#002366]">
                Featured Theological Programs
              </h2>
              <p className="text-sm text-slate-600 max-w-xl">
                Programs range from Certificate to Doctorate levels, providing practical ministry competencies and scholarly rigor.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('programs')}
              className="text-xs font-black uppercase tracking-wider text-[#002366] hover:text-[#C5A059] flex items-center gap-1 self-start md:self-auto"
            >
              <span>View All Programs & Tuition</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.slice(0, 6).map((prog) => (
              <div
                key={prog.id}
                onClick={() => handleProgramClick(prog.id)}
                className="bg-[#F8F9FB] rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-[#002366] transition-all flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#002366]/10 text-[#002366]">
                      {prog.level}
                    </span>
                    <span className="text-xs font-bold text-[#C5A059] font-mono">
                      ${prog.tuitionFeeUSD} USD
                    </span>
                  </div>

                  <h3 className="text-base font-display font-bold text-[#002366] leading-snug">
                    {prog.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {prog.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 font-medium">
                    <span>⏳ {prog.durationMonths} Months</span>
                    <span>📜 {prog.totalCredits} Credits</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#002366]">
                  <span className="text-slate-400 font-mono text-[10px]">Code: {prog.code}</span>
                  <span className="text-[#002366] hover:text-[#C5A059] flex items-center gap-1">
                    Apply / Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Recognition of Prior Learning (RPL) Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#002366] rounded-2xl p-8 sm:p-12 text-white border-2 border-[#C5A059] shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#001A4D] border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#C5A059]" />
              <span>Prior Ministry Credit Evaluation</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white leading-tight">
              Have 5+ Years of Active Ministry Experience?
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Our <strong>Recognition of Prior Learning (RPL)</strong> pathway evaluates your years in pastoral leadership, church planting, sermon archives, missionary fieldwork, and Christian leadership to grant legitimate academic course exemptions towards your Bachelor's, Master's, or Doctoral degree.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-[#C5A059] font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Fast-Track Graduation</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#C5A059] font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Reduce Overall Tuition</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#C5A059] font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Formal Portfolio Assessment</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setCurrentView('rpl')}
                className="px-6 py-3 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black uppercase tracking-wider text-xs shadow-md transition-all flex items-center gap-2 hover:scale-105"
              >
                <span>Submit RPL Portfolio Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Online Examination & Verification Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Online LMS & Examination Platform */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-bold text-[#002366]">
              Secure Online Examination & Assessment System
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Experience our state-of-the-art proctored examination engine with timed questionnaires, randomized scripture banks, auto-save protection, and Chief Examiner moderation.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentView('student-dashboard')}
                className="text-xs font-bold uppercase tracking-wider text-[#002366] hover:text-[#C5A059] flex items-center gap-1"
              >
                <span>Preview Student LMS & Exam Engine</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </button>
            </div>
          </div>

          {/* Card 2: Certificate Verification */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#C5A059] text-[#002366] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-bold text-[#002366]">
              Official Credential & Certificate Verification
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Employers, denominations, and institutions can instantly verify the authenticity of any BIBU diploma, transcript, or degree certificate using its unique registration code.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentView('verify')}
                className="text-xs font-bold uppercase tracking-wider text-[#002366] hover:text-[#C5A059] flex items-center gap-1"
              >
                <span>Verify a Graduate's Credential</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Latest Announcements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-[#C5A059]">
              University Bulletin
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-[#002366]">
              Academic Notices & Announcements
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {announcements.map((ann) => (
            <div key={ann.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold px-2 py-0.5 rounded bg-[#002366]/10 text-[#002366] uppercase text-[9px] tracking-wider">
                  {ann.category}
                </span>
                <span className="text-slate-500 flex items-center gap-1 font-mono text-[10px]">
                  <Calendar className="w-3 h-3 text-[#C5A059]" />
                  {ann.date}
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#002366] leading-snug">
                {ann.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {ann.content}
              </p>
              <div className="text-[11px] text-slate-500 font-medium pt-1">
                Issued by: {ann.author}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
