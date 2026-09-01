import React, { useState, useMemo } from 'react';
import { useApp, CurrentView } from '../../context/AppContext';
import { Bulletin, BulletinCategory, BulletinPriority } from '../../types';
import { BulletinDetailModal } from './BulletinDetailModal';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  Bell,
  Search,
  Filter,
  Calendar,
  Building,
  ShieldCheck,
  FileText,
  Paperclip,
  Download,
  Eye,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Flame,
  Clock,
  Tag,
  BookOpen,
  GraduationCap,
  Users,
  CheckCircle2,
  Share2,
  Mail,
  Archive,
  RefreshCw,
  Printer
} from 'lucide-react';

export const BulletinsCenter: React.FC = () => {
  const {
    bulletins,
    bulletinCategories,
    bulletinDepartments,
    universityInfo,
    recordBulletinView,
    recordBulletinDownload,
    verifyBulletinCode,
    setCurrentView,
    selectedBulletinId,
    setSelectedBulletinId,
    openAuthModal,
    currentUser
  } = useApp();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedAudience, setSelectedAudience] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'all' | 'academic' | 'urgent' | 'events' | 'archives'>('all');
  
  // Verification Tool State
  const [verificationInput, setVerificationInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<Bulletin | null | 'not_found'>(null);

  // Active Reader Modal
  const [activeBulletin, setActiveBulletin] = useState<Bulletin | null>(null);

  // Email Subscription State
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

  // Filter only published bulletins for public view (or all if admin)
  const publishedBulletins = useMemo(() => {
    return bulletins.filter(b => b.status === 'Published' || currentUser.role === 'admin' || currentUser.role === 'registrar');
  }, [bulletins, currentUser.role]);

  // Extract available years
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(bulletins.map(b => b.year || 2026))).sort((a, b) => Number(b) - Number(a));
    return years;
  }, [bulletins]);

  // Critical/Urgent Bulletins for Banner
  const urgentBulletins = useMemo(() => {
    return publishedBulletins.filter(b => b.priority === 'Critical' || b.priority === 'Urgent');
  }, [publishedBulletins]);

  // Filtered List
  const filteredBulletins = useMemo(() => {
    return publishedBulletins.filter(b => {
      // Tab filter
      if (activeTab === 'urgent' && b.priority !== 'Critical' && b.priority !== 'Urgent') return false;
      if (activeTab === 'academic' && b.category !== 'Academic Notices' && b.category !== 'Registrar Directives' && b.category !== 'Examination Schedules') return false;
      if (activeTab === 'events' && !b.eventDetails) return false;
      if (activeTab === 'archives' && b.year === 2026) return false;

      // Category filter
      if (selectedCategory !== 'All' && b.category !== selectedCategory) return false;

      // Department filter
      if (selectedDepartment !== 'All' && b.department !== selectedDepartment) return false;

      // Priority filter
      if (selectedPriority !== 'All' && b.priority !== selectedPriority) return false;

      // Audience filter
      if (selectedAudience !== 'All' && b.targetAudience !== selectedAudience && b.targetAudience !== 'Everyone') return false;

      // Year filter
      if (selectedYear !== 'All' && b.year.toString() !== selectedYear) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = b.title.toLowerCase().includes(q);
        const matchesSub = b.subtitle?.toLowerCase().includes(q) || false;
        const matchesSummary = b.summary.toLowerCase().includes(q);
        const matchesContent = b.content.toLowerCase().includes(q);
        const matchesNumber = b.bulletinNumber.toLowerCase().includes(q);
        const matchesVrf = b.verificationCode.toLowerCase().includes(q);
        const matchesDept = b.department.toLowerCase().includes(q);
        const matchesAuthor = b.author.toLowerCase().includes(q);

        if (!matchesTitle && !matchesSub && !matchesSummary && !matchesContent && !matchesNumber && !matchesVrf && !matchesDept && !matchesAuthor) {
          return false;
        }
      }

      return true;
    });
  }, [publishedBulletins, activeTab, selectedCategory, selectedDepartment, selectedPriority, selectedAudience, selectedYear, searchQuery]);

  const handleOpenBulletin = (bul: Bulletin) => {
    recordBulletinView(bul.id);
    setActiveBulletin(bul);
  };

  const handleOpenFullPage = (bul: Bulletin, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    recordBulletinView(bul.id);
    setSelectedBulletinId(bul.id);
    setCurrentView('bulletin-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationInput.trim()) return;
    const match = verifyBulletinCode(verificationInput.trim());
    if (match) {
      setVerificationResult(match);
    } else {
      setVerificationResult('not_found');
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail.trim() || !subscriberEmail.includes('@')) return;
    setSubscribedSuccess(true);
    setSubscriberEmail('');
  };

  const getPriorityBadgeClass = (priority: BulletinPriority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'Urgent':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'Important':
        return 'bg-blue-50 text-[#002366] border-blue-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      
      {/* Hero Header: Official Institutional Gazette */}
      <section className="bg-gradient-to-r from-[#001A4D] via-[#002366] to-[#0A3080] text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-[#C5A059] shadow-lg relative overflow-hidden">
        {/* Background Crest Accent */}
        <div className="absolute right-[-60px] top-[-40px] opacity-10 pointer-events-none hidden lg:block">
          <UniversityLogo size="lg" />
        </div>

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C5A059] text-xs font-bold uppercase tracking-widest border border-white/20">
                <Bell className="w-3.5 h-3.5" />
                <span>Official Institutional Registry & University Gazette</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white">
                University Bulletins & Announcements
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Official decrees, academic schedules, registrar directives, convocation notices, and ministerial publications from Breakthrough International Bible University.
              </p>
            </div>

            {/* Quick Gazette Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#001438]/80 p-4 rounded-2xl border border-white/15 backdrop-blur-xs">
              <div className="text-center p-2">
                <div className="text-2xl font-black text-[#C5A059] font-mono">{publishedBulletins.length}</div>
                <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Active Notices</div>
              </div>
              <div className="text-center p-2 border-l border-white/10">
                <div className="text-2xl font-black text-white font-mono">{bulletinCategories.length}</div>
                <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Categories</div>
              </div>
              <div className="text-center p-2 border-l border-white/10 col-span-2 sm:col-span-1">
                <div className="text-2xl font-black text-emerald-400 font-mono">100%</div>
                <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Verified Gazette</div>
              </div>
            </div>
          </div>

          {/* Quick Filter Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'all'
                  ? 'bg-[#C5A059] text-[#002366] shadow-md font-black'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              All Bulletins ({publishedBulletins.length})
            </button>
            <button
              onClick={() => setActiveTab('academic')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'academic'
                  ? 'bg-[#C5A059] text-[#002366] shadow-md font-black'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic & Exams</span>
            </button>
            <button
              onClick={() => setActiveTab('urgent')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'urgent'
                  ? 'bg-rose-600 text-white shadow-md font-black'
                  : 'bg-white/10 text-rose-300 hover:bg-white/20'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Urgent Directives ({urgentBulletins.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'events'
                  ? 'bg-[#C5A059] text-[#002366] shadow-md font-black'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>University Events</span>
            </button>
            <button
              onClick={() => setActiveTab('archives')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'archives'
                  ? 'bg-[#C5A059] text-[#002366] shadow-md font-black'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Archives</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Urgent Broadcast Notice if any */}
        {urgentBulletins.length > 0 && activeTab === 'all' && (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-rose-800 font-black text-xs uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Urgent Institutional Announcement</span>
              </div>
              <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider">High Priority Action</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {urgentBulletins.slice(0, 2).map((urg) => (
                <div
                  key={urg.id}
                  onClick={() => handleOpenFullPage(urg)}
                  className="bg-white border border-rose-200 p-4 rounded-xl hover:border-rose-400 hover:shadow-md cursor-pointer transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono font-bold text-rose-600 uppercase">
                      {urg.bulletinNumber} • {urg.publishDate}
                    </div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-rose-700 transition-colors line-clamp-1">
                      {urg.title}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{urg.summary}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-rose-400 group-hover:text-rose-700 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verification & Search Bar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Search & Category Filtering (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search bulletins by title, keyword, department, or decree text..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] text-xs text-slate-800"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-[#002366] focus:outline-none focus:ring-2 focus:ring-[#002366]"
              >
                <option value="All">All Categories</option>
                {bulletinCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-Filters Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-700 font-medium"
                >
                  <option value="All">All Departments</option>
                  {bulletinDepartments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Target Audience</label>
                <select
                  value={selectedAudience}
                  onChange={(e) => setSelectedAudience(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-700 font-medium"
                >
                  <option value="All">All Audiences</option>
                  <option value="Everyone">Everyone</option>
                  <option value="Students">Students</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Administrators">Administrators</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-700 font-medium"
                >
                  <option value="All">All Priorities</option>
                  <option value="Critical">Critical</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Important">Important</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Archive Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-700 font-medium"
                >
                  <option value="All">All Years</option>
                  {availableYears.map((y) => (
                    <option key={y} value={y.toString()}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Official Verification Tool Box (1 Col) */}
          <div className="bg-gradient-to-br from-[#002366] to-[#001438] text-white rounded-2xl p-6 border-2 border-[#C5A059] shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Gazette Verification Tool</span>
              </div>
              <h3 className="text-base font-bold font-display text-white">
                Verify Official Bulletin Authenticity
              </h3>
              <p className="text-xs text-slate-300">
                Enter the Bulletin Number (e.g., <span className="font-mono text-[#C5A059]">BIBU/BUL/2026/001</span>) or Security Verification Code to inspect the official digitally signed record.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. BIBU-VRF-2026-904112"
                  value={verificationInput}
                  onChange={(e) => setVerificationInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider shadow-sm transition-all"
              >
                Verify Document Record
              </button>
            </form>

            {/* Verification Result Feedback */}
            {verificationResult && (
              <div className="mt-2 p-3 rounded-xl bg-white text-slate-800 text-xs animate-in fade-in">
                {verificationResult === 'not_found' ? (
                  <div className="text-rose-600 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>No official record found matching this code.</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated Gazette
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">{verificationResult.bulletinNumber}</span>
                    </div>
                    <div className="font-bold text-[#002366] line-clamp-1">{verificationResult.title}</div>
                    <div className="grid grid-cols-2 gap-1.5 mt-1">
                      <button
                        onClick={() => handleOpenBulletin(verificationResult)}
                        className="py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold text-center"
                      >
                        Quick Modal
                      </button>
                      <button
                        onClick={() => handleOpenFullPage(verificationResult)}
                        className="py-1 rounded bg-[#002366] text-[#C5A059] text-[10px] font-bold text-center hover:bg-[#001438]"
                      >
                        Full Gazette View &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Category Pills Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider shrink-0 transition-all ${
              selectedCategory === 'All'
                ? 'bg-[#002366] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Categories
          </button>
          {bulletinCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-[#002366] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bulletins Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-900">{filteredBulletins.length}</strong> official bulletin{filteredBulletins.length === 1 ? '' : 's'}
            </span>
            {(searchQuery || selectedCategory !== 'All' || selectedDepartment !== 'All' || selectedPriority !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedDepartment('All');
                  setSelectedPriority('All');
                  setSelectedAudience('All');
                  setSelectedYear('All');
                }}
                className="text-[#002366] hover:underline font-bold"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {filteredBulletins.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-800">No Bulletins Found</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  No university bulletins or announcements match your selected search criteria. Try modifying your filters or search keywords.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedDepartment('All');
                  setSelectedPriority('All');
                  setSelectedAudience('All');
                  setSelectedYear('All');
                }}
                className="px-4 py-2 rounded-xl bg-[#002366] text-white text-xs font-bold"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBulletins.map((bulletin) => (
                <div
                  key={bulletin.id}
                  onClick={() => handleOpenFullPage(bulletin)}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-[#002366] shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer"
                >
                  <div>
                    {/* Card Top Banner / Image if available */}
                    {bulletin.featuredImage && (
                      <div className="h-44 w-full overflow-hidden relative border-b border-slate-100">
                        <img
                          src={bulletin.featuredImage}
                          alt={bulletin.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#002366] text-[#C5A059] shadow-xs">
                            {bulletin.category}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs border ${getPriorityBadgeClass(bulletin.priority)}`}>
                            {bulletin.priority}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 space-y-3">
                      {!bulletin.featuredImage && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-[#002366] text-[#C5A059]">
                            {bulletin.category}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityBadgeClass(bulletin.priority)}`}>
                            {bulletin.priority}
                          </span>
                        </div>
                      )}

                      {/* Gazette Number & Date */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span className="font-bold text-[#002366]">{bulletin.bulletinNumber}</span>
                        <span>{bulletin.publishDate}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold font-display text-[#002366] group-hover:text-[#0A3080] leading-snug line-clamp-2">
                        {bulletin.title}
                      </h3>

                      {/* Subtitle / Summary */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {bulletin.summary || bulletin.subtitle}
                      </p>

                      {/* Department & Author */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="truncate max-w-[150px]">{bulletin.department}</span>
                        <span className="text-slate-400">For: <strong className="text-slate-700">{bulletin.targetAudience}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-5 sm:px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 group-hover:bg-[#F0F4FF] transition-colors">
                    <div className="flex items-center gap-3">
                      {bulletin.attachments && bulletin.attachments.length > 0 && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-600" title={`${bulletin.attachments.length} PDF Attachments`}>
                          <Paperclip className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>{bulletin.attachments.length}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{bulletin.viewsCount}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBulletin(bulletin);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold transition-colors"
                        title="Quick Modal Preview"
                      >
                        Quick Preview
                      </button>
                      <button
                        onClick={(e) => handleOpenFullPage(bulletin, e)}
                        className="px-3 py-1 rounded bg-[#002366] text-[#C5A059] group-hover:bg-[#001438] text-[11px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>Full Page</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Email Bulletin Dispatch Signup & Gazette Archive Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
          
          {/* Institutional Subscription */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#002366]/10 text-[#002366] flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#002366]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#002366] font-display">
                  University Bulletin Dispatch Service
                </h4>
                <p className="text-xs text-slate-500">
                  Receive instant email transmissions of official decrees, examination deadlines, and convocation bulletins.
                </p>
              </div>
            </div>

            {subscribedSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You are subscribed to the Breakthrough International Bible University Official Gazette!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your university or ministry email..."
                  value={subscriberEmail}
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001438] text-white text-xs font-bold uppercase tracking-wider shrink-0 transition-all"
                >
                  Subscribe
                </button>
              </form>
            )}
            <div className="text-[10px] text-slate-400">
              * Official student and faculty accounts are automatically enrolled in departmental notifications.
            </div>
          </div>

          {/* Quick Access to Portals & RPL */}
          <div className="bg-[#001A4D] text-white rounded-2xl p-6 sm:p-8 border border-[#C5A059]/40 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="text-[#C5A059] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Student & Faculty Portals</span>
              </div>
              <h4 className="text-base font-bold font-display text-white">
                Access Personalized Academic Notices
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sign into your designated university portal to view course-specific notices, examination rosters, grades, and personalized faculty advisories.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => {
                  if (currentUser.role === 'student') {
                    setCurrentView('student-dashboard');
                  } else {
                    openAuthModal('login', 'student-dashboard', 'Sign in to access your Student Learning Portal.');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider transition-all"
              >
                Student Portal
              </button>

              <button
                onClick={() => {
                  if (currentUser.role === 'faculty') {
                    setCurrentView('faculty-portal');
                  } else {
                    openAuthModal('login', 'faculty-portal', 'Sign in to access the Faculty & Instructor Portal.');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/20 transition-all"
              >
                Faculty Portal
              </button>

              <button
                onClick={() => setCurrentView('admissions')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold uppercase tracking-wider border border-white/20 transition-all"
              >
                Apply for Admission
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Official Bulletin Detail Modal */}
      {activeBulletin && (
        <BulletinDetailModal
          bulletin={activeBulletin}
          onClose={() => setActiveBulletin(null)}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />
      )}

    </div>
  );
};
