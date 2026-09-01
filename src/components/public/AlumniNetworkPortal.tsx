import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlumniDirectory } from './AlumniDirectory';
import { AlumniAdminManager } from '../admin/AlumniAdminManager';
import { Alumni } from '../../types/alumni';
import {
  COUNTRIES_50_PLUS,
  GRADUATION_YEARS_10,
  OFFICIAL_BIBU_PROGRAMS,
  GLOBAL_ALUMNI_CHAPTERS,
  ALUMNI_STORIES_DATA,
  DISTINGUISHED_ALUMNI_CATEGORIES,
  ALUMNI_EVENTS_DATA,
} from '../../data/alumniData';
import {
  Users,
  GraduationCap,
  Globe,
  Search,
  Filter,
  CheckCircle2,
  Award,
  BookOpen,
  MapPin,
  Mail,
  Building,
  HeartHandshake,
  Calendar,
  Sparkles,
  ShieldCheck,
  Lock,
  UserPlus,
  LogIn,
  ExternalLink,
  ChevronRight,
  Send,
  MessageSquare,
  QrCode,
  ArrowRight,
  FileCheck,
  Download,
  Flame,
  Star,
  Layers,
  Clock,
  Compass
} from 'lucide-react';

export const AlumniNetworkPortal: React.FC = () => {
  const { currentUser, openAuthModal, universityInfo, setCurrentView, alumniList, verifyAlumniGraduate } = useApp();
  const isGuest = currentUser.role === 'guest';
  const isAdminOrStaff = currentUser.role === 'admin' || currentUser.role === 'super_admin' || currentUser.role === 'faculty';

  // Navigation Sub-tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'directory' | 'countries' | 'years' | 'programs' | 'distinguished' | 'chapters' | 'stories' | 'verify' | 'admin'
  >('overview');

  // Filter pass-through states when clicking on a Country, Year, or Program
  const [filterCountryParam, setFilterCountryParam] = useState<string>('All');
  const [filterYearParam, setFilterYearParam] = useState<number | 'All'>('All');
  const [filterProgramParam, setFilterProgramParam] = useState<string>('All');

  // Direct Verification state
  const [verifyQuery, setVerifyQuery] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ found: boolean; alumni?: Alumni; searched: boolean }>({
    found: false,
    searched: false,
  });

  // Selected country drill-down
  const handleCountryClick = (countryName: string) => {
    setFilterCountryParam(countryName);
    setFilterYearParam('All');
    setFilterProgramParam('All');
    setActiveTab('directory');
  };

  // Selected year drill-down
  const handleYearClick = (year: number) => {
    setFilterYearParam(year);
    setFilterCountryParam('All');
    setFilterProgramParam('All');
    setActiveTab('directory');
  };

  // Selected program drill-down
  const handleProgramClick = (progName: string) => {
    setFilterProgramParam(progName);
    setFilterCountryParam('All');
    setFilterYearParam('All');
    setActiveTab('directory');
  };

  // Handle Verify Search
  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyQuery.trim()) return;

    const result = verifyAlumniGraduate({
      alumniId: verifyQuery,
      certificateNumber: verifyQuery,
      studentId: verifyQuery,
    });

    setVerifyResult({
      found: !!result,
      alumni: result,
      searched: true,
    });
  };

  // Count alumni by country
  const getCountryAlumniCount = (countryName: string) => {
    const list = alumniList.filter((a) => a.country.toLowerCase() === countryName.toLowerCase());
    return list.length;
  };

  // Count alumni by year
  const getYearAlumniCount = (year: number) => {
    return alumniList.filter((a) => a.graduation_year === year).length;
  };

  return (
    <div id="alumni-network-portal" className="space-y-10 pb-20">
      {/* 1. HERO HEADER */}
      <section className="relative bg-[#002366] text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-[#C5A059] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.25),transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#001A4D] border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold uppercase tracking-widest">
                <Globe className="w-4 h-4 text-[#C5A059]" />
                <span>BIBU Global Alumni Network • 2017–2026 • 50+ Nations</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight leading-tight">
                Breakthrough International Bible University
                <span className="block text-[#C5A059] text-2xl sm:text-3xl lg:text-4xl font-normal mt-1">
                  Global Alumni Portal & Registry
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                Connecting over <strong>14,500+ theological scholars, ordained pastors, chaplains, and Christian leaders</strong> across 50+ nations who are transforming their communities through the power of the Gospel.
              </p>
            </div>

            {/* University Crest & Key Stats Card */}
            <div className="bg-[#001A4D]/90 backdrop-blur-xs border-2 border-[#C5A059] p-6 rounded-3xl shadow-2xl text-center shrink-0 min-w-[280px]">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#002366] border-2 border-[#C5A059] flex items-center justify-center text-[#C5A059] mb-3">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div className="text-3xl sm:text-4xl font-display font-black text-[#C5A059]">
                14,500+
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-300 mt-0.5">
                Alumni Across 50+ Nations
              </div>
              <div className="text-[11px] text-amber-200/80 font-mono mt-1">
                Decade of Impact: 2017–2026
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-center gap-2">
                <button
                  id="hero-btn-verify"
                  onClick={() => setActiveTab('verify')}
                  className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-[#002366] text-xs font-black uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify Graduate</span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Impact Stats Metric Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-2xl sm:text-3xl font-black text-white font-display">50+</div>
              <div className="text-[11px] text-[#C5A059] font-bold uppercase tracking-wider mt-0.5">
                Nations Represented
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-2xl sm:text-3xl font-black text-white font-display">10 Years</div>
              <div className="text-[11px] text-[#C5A059] font-bold uppercase tracking-wider mt-0.5">
                Cohorts (2017–2026)
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-2xl sm:text-3xl font-black text-white font-display">3,850+</div>
              <div className="text-[11px] text-[#C5A059] font-bold uppercase tracking-wider mt-0.5">
                Churches & Ministries Planted
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-2xl sm:text-3xl font-black text-white font-display">100%</div>
              <div className="text-[11px] text-[#C5A059] font-bold uppercase tracking-wider mt-0.5">
                Accredited Records
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PORTAL NAVIGATION TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-2 overflow-x-auto flex items-center gap-1">
          <button
            id="tab-btn-overview"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Alumni Home</span>
          </button>

          <button
            id="tab-btn-directory"
            onClick={() => {
              setFilterCountryParam('All');
              setFilterYearParam('All');
              setFilterProgramParam('All');
              setActiveTab('directory');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'directory'
                ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Alumni Directory</span>
          </button>

          <button
            id="tab-btn-countries"
            onClick={() => setActiveTab('countries')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'countries'
                ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>50+ Nations</span>
          </button>

          <button
            id="tab-btn-years"
            onClick={() => setActiveTab('years')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'years'
                ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Class of 2017–2026</span>
          </button>

          <button
            id="tab-btn-programs"
            onClick={() => setActiveTab('programs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'programs'
                ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>By Program</span>
          </button>

          <button
            id="tab-btn-distinguished"
            onClick={() => setActiveTab('distinguished')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'distinguished'
                ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Distinguished Alumni</span>
          </button>

          <button
            id="tab-btn-chapters"
            onClick={() => setActiveTab('chapters')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'chapters'
                ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Regional Chapters</span>
          </button>

          <button
            id="tab-btn-stories"
            onClick={() => setActiveTab('stories')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'stories'
                ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Alumni Stories</span>
          </button>

          <button
            id="tab-btn-verify"
            onClick={() => setActiveTab('verify')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'verify'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify Graduate</span>
          </button>

          {/* Admin / Registrar Portal tab */}
          <button
            id="tab-btn-admin"
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ml-auto ${
              activeTab === 'admin'
                ? 'bg-[#002366] text-[#C5A059] shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Admin Import & CMS</span>
          </button>
        </div>
      </section>

      {/* Guest Notice */}
      {isGuest && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">
                  Global Alumni Portal Access & Mentorship
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  You are currently browsing the public registry. Sign in or register as a graduate to connect directly with fellow alumni, join regional chapter summits, and access alumni benefits.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openAuthModal('register', 'alumni', 'Register your graduate profile with BIBU.')}
                className="px-3.5 py-2 rounded-xl bg-[#002366] text-[#C5A059] text-xs font-black uppercase tracking-wider hover:bg-[#001A4D] transition-all flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Join Network</span>
              </button>
              <button
                onClick={() => openAuthModal('login', 'alumni', 'Sign into your alumni account.')}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5 text-[#002366]" />
                <span>Alumni Sign In</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. TAB CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ======================================================== */}
        {/* TAB: OVERVIEW */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Quick Country Explorer Strip */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366]">
                    Global Presence Across 50+ Nations
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any country to view its registered pastors, missionaries, and scholars.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('countries')}
                  className="text-xs font-bold text-[#002366] hover:text-[#C5A059] flex items-center gap-1"
                >
                  <span>View All 50+ Nations &rarr;</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {COUNTRIES_50_PLUS.slice(0, 12).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleCountryClick(c.name)}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-[#002366] text-slate-800 hover:text-white border border-slate-200 hover:border-[#002366] transition-all text-left flex items-center gap-2 group shadow-2xs"
                  >
                    <span className="text-xl">{c.flag}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate group-hover:text-white">{c.name}</div>
                      <div className="text-[10px] text-slate-500 group-hover:text-amber-200">
                        {c.region}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Decade Cohorts Row (2017–2026) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366]">
                    Alumni Classes (2017–2026)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Browse graduation rosters and cohort leaders for each graduating class.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('years')}
                  className="text-xs font-bold text-[#002366] hover:text-[#C5A059] flex items-center gap-1"
                >
                  <span>View Class Breakdown &rarr;</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                {GRADUATION_YEARS_10.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => handleYearClick(yr)}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-[#002366] text-[#002366] hover:text-[#C5A059] border border-slate-200 hover:border-[#002366] transition-all text-center group"
                  >
                    <div className="text-xs font-black uppercase tracking-wider text-slate-400 group-hover:text-slate-300">
                      Class
                    </div>
                    <div className="text-base font-black font-display mt-0.5">
                      {yr}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Embedded Main Directory for Quick Browsing */}
            <AlumniDirectory
              alumniList={alumniList}
              initialCountry="All"
              initialYear="All"
              onVerifyGraduate={(certId) => {
                setVerifyQuery(certId);
                setActiveTab('verify');
              }}
            />

            {/* Upcoming Alumni Summits & Events */}
            <div className="bg-[#001A4D] text-white rounded-3xl border-2 border-[#C5A059] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-[#C5A059]">
                    Global Gatherings
                  </div>
                  <h2 className="text-2xl font-display font-black text-white">
                    Upcoming Global Alumni Summits & Fellowships
                  </h2>
                </div>
                <button
                  onClick={() => {
                    if (isGuest) openAuthModal('register', 'alumni', 'Sign up to register for global summits.');
                    else alert('Your summit registration inquiry has been submitted to the Secretariat.');
                  }}
                  className="px-4 py-2 bg-[#C5A059] text-[#002366] text-xs font-black uppercase tracking-wider rounded-xl hover:bg-[#b08e4c] transition-all"
                >
                  Register for Summit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ALUMNI_EVENTS_DATA.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-[#C5A059] bg-white/10 px-2 py-0.5 rounded">
                          {evt.category}
                        </span>
                        <span className="text-xs font-bold text-slate-300 font-mono">
                          {evt.date}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {evt.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{evt.city || evt.venue_or_link}</span>
                      <span className="text-[#C5A059] font-bold">{evt.organizer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: DIRECTORY */}
        {/* ======================================================== */}
        {activeTab === 'directory' && (
          <AlumniDirectory
            alumniList={alumniList}
            initialCountry={filterCountryParam}
            initialYear={filterYearParam}
            initialProgram={filterProgramParam}
            onVerifyGraduate={(certId) => {
              setVerifyQuery(certId);
              setActiveTab('verify');
            }}
          />
        )}

        {/* ======================================================== */}
        {/* TAB: 50+ NATIONS */}
        {/* ======================================================== */}
        {activeTab === 'countries' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002366]/10 text-[#002366] text-xs font-bold uppercase tracking-wider mb-1">
                    <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>52 Sovereign Nations Represented</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-black text-[#002366]">
                    Global Alumni Footprint by Country
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                    Breakthrough International Bible University graduates minister on every continent. Select any nation below to filter the registry and view pastors, educators, and leaders.
                  </p>
                </div>
              </div>

              {/* 50+ Countries Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
                {COUNTRIES_50_PLUS.map((country) => {
                  const count = getCountryAlumniCount(country.name);
                  return (
                    <div
                      key={country.code}
                      onClick={() => handleCountryClick(country.name)}
                      className="bg-slate-50 hover:bg-[#002366] p-4 rounded-2xl border border-slate-200 hover:border-[#002366] transition-all cursor-pointer group shadow-2xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-white">
                            {country.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 group-hover:text-amber-200">
                            {country.region}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded-md bg-[#002366]/10 group-hover:bg-white/20 text-[#002366] group-hover:text-[#C5A059] font-mono text-xs font-bold">
                          {count > 0 ? `${count} Grad` : 'Chapter Hub'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: CLASS YEARS (2017–2026) */}
        {/* ======================================================== */}
        {activeTab === 'years' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002366]/10 text-[#002366] text-xs font-bold uppercase tracking-wider mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Decade of Academic Excellence</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-[#002366]">
                  Graduating Cohorts (2017–2026)
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  Each graduation class represents a dedicated cohort of servants equipped in biblical hermeneutics, pastoral leadership, and Christian theology.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {GRADUATION_YEARS_10.map((yr) => {
                  const count = getYearAlumniCount(yr);
                  return (
                    <div
                      key={yr}
                      className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-[#002366] transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-[#002366] text-[#C5A059] px-2 py-0.5 rounded">
                            Cohort
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-500">
                            {count > 0 ? `${count} in DB` : 'Accredited'}
                          </span>
                        </div>
                        <h3 className="text-2xl font-display font-black text-[#002366]">
                          Class of {yr}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Graduates across Doctorate, Master's, Bachelor's, and Diploma faculties serving globally.
                        </p>
                      </div>

                      <button
                        onClick={() => handleYearClick(yr)}
                        className="w-full py-2 bg-[#002366] hover:bg-[#001A4D] text-[#C5A059] text-xs font-bold rounded-xl transition-all text-center flex items-center justify-center gap-1"
                      >
                        <span>View Class Roster</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: BY PROGRAM */}
        {/* ======================================================== */}
        {activeTab === 'programs' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002366]/10 text-[#002366] text-xs font-bold uppercase tracking-wider mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Academic Degree Programs</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-[#002366]">
                  Alumni by Program of Study
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  Breakthrough International Bible University confers degrees from Certificate through Doctor of Philosophy. Browse graduates by their academic credential.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {OFFICIAL_BIBU_PROGRAMS.map((prog, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleProgramClick(prog)}
                    className="bg-slate-50 hover:bg-[#002366] p-5 rounded-2xl border border-slate-200 hover:border-[#002366] transition-all cursor-pointer group flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-wider text-[#C5A059] group-hover:text-amber-200">
                        Official Academic Program
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-white leading-snug">
                        {prog}
                      </h4>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#C5A059] shrink-0 mt-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: DISTINGUISHED ALUMNI */}
        {/* ======================================================== */}
        {activeTab === 'distinguished' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002366]/10 text-[#002366] text-xs font-bold uppercase tracking-wider mb-1">
                  <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>12 Categories of Ministerial & Societal Distinction</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-[#002366]">
                  Distinguished Alumni Recognition
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  Celebrating BIBU graduates who have demonstrated outstanding leadership, community impact, church growth, and Christian scholarship globally.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DISTINGUISHED_ALUMNI_CATEGORIES.map((cat, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold">
                        <Award className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-[#002366]">
                        {cat.category}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-3 border border-slate-200 text-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Spotlight Example</div>
                      <div className="font-bold text-[#002366] mt-0.5">{cat.sample_honoree}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: REGIONAL CHAPTERS */}
        {/* ======================================================== */}
        {activeTab === 'chapters' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002366]/10 text-[#002366] text-xs font-bold uppercase tracking-wider mb-1">
                  <Building className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Continental & Regional Hubs</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-[#002366]">
                  Global Alumni Chapters
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  Regional chapters organize regular fellowship meetings, continuing theological education, and regional leadership retreats.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {GLOBAL_ALUMNI_CHAPTERS.map((ch) => (
                  <div
                    key={ch.id}
                    className="bg-slate-50 rounded-2xl border border-slate-200 hover:border-[#002366] p-6 space-y-4 flex flex-col justify-between transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-[#002366] bg-[#002366]/10 px-2.5 py-0.5 rounded">
                          {ch.region}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#C5A059]">
                          {ch.alumni_count.toLocaleString()} Alumni
                        </span>
                      </div>

                      <h3 className="text-base font-display font-bold text-[#002366]">
                        {ch.name}
                      </h3>

                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                          <span>Coverage: <strong>{ch.coverage_countries.join(', ')}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                          <span>President: <strong>{ch.president_name}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                          <span className="font-mono text-[11px]">{ch.contact_email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                          <span>Next Summit: <strong>{ch.next_meeting}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Est. {ch.established_year}</span>
                      <button
                        onClick={() => {
                          if (isGuest) openAuthModal('register', 'alumni', `Create an account to join ${ch.name}.`);
                          else alert(`You are connected with ${ch.name}. Email: ${ch.contact_email}`);
                        }}
                        className="text-xs font-bold text-[#002366] hover:text-[#C5A059] flex items-center gap-1"
                      >
                        <span>{isGuest ? 'Join Chapter &rarr;' : 'Connected ✓'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: ALUMNI STORIES */}
        {/* ======================================================== */}
        {activeTab === 'stories' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002366]/10 text-[#002366] text-xs font-bold uppercase tracking-wider mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Transforming Nations for Christ</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-[#002366]">
                  Alumni Impact Stories & Testimonies
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  Discover how BIBU graduates apply theological scholarship to plant churches, establish crisis care centers, and train the next generation of ministers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ALUMNI_STORIES_DATA.map((story) => (
                  <div
                    key={story.id}
                    className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-bold text-[#002366]">{story.country}</span>
                        <span className="font-mono">{story.created_at ? story.created_at.slice(0, 10) : 'Verified Archive'}</span>
                      </div>

                      <h3 className="text-base font-bold text-[#002366] leading-snug">
                        {story.title}
                      </h3>

                      <div className="text-xs font-semibold text-slate-700">
                        {story.alumni_name} ({story.graduation_year})
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {story.summary}
                      </p>

                      <blockquote className="border-l-2 border-[#C5A059] pl-3 py-1 text-xs italic text-slate-700 bg-white/60 rounded-r-lg">
                        "{story.quote}"
                      </blockquote>
                    </div>

                    <div className="pt-3 border-t border-slate-200">
                      <span className="text-[10px] text-slate-400 font-mono">
                        DEMO STORY RECORD — Replace with Verified Alumni Story
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: VERIFY GRADUATE */}
        {/* ======================================================== */}
        {activeTab === 'verify' && (
          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl border-2 border-emerald-600 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="text-center space-y-2 border-b border-slate-100 pb-5">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-[#002366]">
                  Official Graduate Credential Verification
                </h2>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Verify the authenticity of any Breakthrough International Bible University graduate certificate or degree.
                </p>
              </div>

              {/* Verification Form */}
              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Enter Alumni ID, Certificate Number, or Student ID:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={verifyQuery}
                      onChange={(e) => setVerifyQuery(e.target.value)}
                      placeholder="e.g. BIBU-ALM-2024-0821 or BIBU-CRT-2024-88410"
                      className="flex-1 px-4 py-3 text-sm rounded-xl border border-slate-300 font-mono uppercase focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Search className="w-4 h-4" />
                      <span>Verify Now</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Verification Results */}
              {verifyResult.searched && (
                <div className="pt-4 border-t border-slate-100">
                  {verifyResult.found && verifyResult.alumni ? (
                    <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                        <div>
                          <div className="text-xs font-black uppercase tracking-wider text-emerald-800">
                            ✓ Authenticated BIBU Academic Credential
                          </div>
                          <div className="text-lg font-bold text-emerald-950">
                            {verifyResult.alumni.full_name}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-xl border border-emerald-200">
                        <div>
                          <span className="text-slate-500 block">Degree Awarded:</span>
                          <strong className="text-slate-900">{verifyResult.alumni.program_name}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Graduation Class:</span>
                          <strong className="text-slate-900">Class of {verifyResult.alumni.graduation_year}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Nation & City:</span>
                          <strong className="text-slate-900">{verifyResult.alumni.city}, {verifyResult.alumni.country}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Alumni Record ID:</span>
                          <strong className="font-mono text-emerald-800">{verifyResult.alumni.alumni_id}</strong>
                        </div>
                        {verifyResult.alumni.certificate_number && (
                          <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                            <span className="text-slate-500 block">Official Certificate Reference:</span>
                            <strong className="font-mono text-emerald-800">{verifyResult.alumni.certificate_number}</strong>
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] text-emerald-800">
                        Status: <strong>{verifyResult.alumni.verification_status}</strong> • Verified by Office of the Registrar.
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 text-center space-y-2">
                      <div className="font-bold text-amber-950 text-sm">
                        No Official Record Found for "{verifyQuery}"
                      </div>
                      <p className="text-xs text-amber-800 max-w-md mx-auto">
                        Please check the certificate number or contact the Office of the Registrar at <strong>registrar@bibu.university</strong> for manual verification.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: ADMIN IMPORT & CMS */}
        {/* ======================================================== */}
        {activeTab === 'admin' && <AlumniAdminManager />}
      </main>
    </div>
  );
};
