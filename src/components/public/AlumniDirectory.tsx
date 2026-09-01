import React, { useState, useMemo } from 'react';
import { Alumni } from '../../types/alumni';
import { COUNTRIES_50_PLUS, GRADUATION_YEARS_10, OFFICIAL_BIBU_PROGRAMS } from '../../data/alumniData';
import {
  Search,
  Filter,
  GraduationCap,
  MapPin,
  Building,
  CheckCircle2,
  AlertCircle,
  Award,
  BookOpen,
  Mail,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  LayoutGrid,
  List,
  Sparkles,
  ChevronRight,
  Send,
  X,
  QrCode,
  Calendar,
  Lock,
  UserPlus,
  LogIn
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AlumniDirectoryProps {
  alumniList?: Alumni[];
  initialCountry?: string;
  initialYear?: number | 'All';
  initialProgram?: string;
  onSelectAlumni?: (alumni: Alumni) => void;
  onVerifyGraduate?: (alumniId: string) => void;
}

export const AlumniDirectory: React.FC<AlumniDirectoryProps> = ({
  alumniList: propAlumniList,
  initialCountry = 'All',
  initialYear = 'All',
  initialProgram = 'All',
  onSelectAlumni,
  onVerifyGraduate
}) => {
  const { currentUser, openAuthModal } = useApp();
  const isGuest = currentUser.role === 'guest';

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountry);
  const [selectedYear, setSelectedYear] = useState<number | 'All'>(initialYear);
  const [selectedProgram, setSelectedProgram] = useState<string>(initialProgram);
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'year-desc' | 'year-asc' | 'name-asc' | 'country-asc'>('year-desc');

  // Modal State
  const [activeProfile, setActiveProfile] = useState<Alumni | null>(null);
  const [connectModalAlumni, setConnectModalAlumni] = useState<Alumni | null>(null);
  const [connectMessage, setConnectMessage] = useState('');
  const [connectSuccess, setConnectSuccess] = useState(false);

  // Fallback to initial database if not passed via props
  const allAlumni = useMemo(() => {
    return propAlumniList || [];
  }, [propAlumniList]);

  // Country Flag helper
  const getCountryFlag = (countryName: string) => {
    const found = COUNTRIES_50_PLUS.find(c => c.name.toLowerCase() === countryName.toLowerCase());
    return found ? found.flag : '🌐';
  };

  // Filter Logic
  const filteredAlumni = useMemo(() => {
    return allAlumni.filter((item) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.full_name.toLowerCase().includes(q) ||
        item.alumni_id.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.program_name.toLowerCase().includes(q) ||
        (item.organization && item.organization.toLowerCase().includes(q)) ||
        (item.current_position && item.current_position.toLowerCase().includes(q)) ||
        (item.ministry && item.ministry.toLowerCase().includes(q)) ||
        (item.profession && item.profession.toLowerCase().includes(q));

      // 2. Country Filter
      const matchesCountry = selectedCountry === 'All' || item.country === selectedCountry;

      // 3. Graduation Year Filter
      const matchesYear = selectedYear === 'All' || item.graduation_year === selectedYear;

      // 4. Program Filter
      const matchesProgram = selectedProgram === 'All' || item.program_name === selectedProgram;

      // 5. Qualification Level Filter
      const matchesLevel =
        selectedLevel === 'All' ||
        (selectedLevel === 'Doctoral' && ['PhD', 'Doctorate', 'DMin', 'ThD', 'Doctor'].some(lvl => item.qualification_level.toLowerCase().includes(lvl.toLowerCase()) || item.program_name.toLowerCase().includes(lvl.toLowerCase()))) ||
        (selectedLevel === 'Master' && ['Master', 'MDiv', 'MTS', 'MBS', 'MA'].some(lvl => item.qualification_level.toLowerCase().includes(lvl.toLowerCase()) || item.program_name.toLowerCase().includes(lvl.toLowerCase()))) ||
        (selectedLevel === 'Bachelor' && ['Bachelor', 'BTh', 'BBS', 'BA'].some(lvl => item.qualification_level.toLowerCase().includes(lvl.toLowerCase()) || item.program_name.toLowerCase().includes(lvl.toLowerCase()))) ||
        (selectedLevel === 'Diploma' && (item.qualification_level === 'Diploma' || item.program_name.toLowerCase().includes('diploma'))) ||
        (selectedLevel === 'Certificate' && (item.qualification_level === 'Certificate' || item.program_name.toLowerCase().includes('certificate')));

      // 6. Verification Status Filter
      const matchesStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'Verified' && item.verification_status === 'Verified Alumni') ||
        (selectedStatus === 'Demo' && (item.verification_status === 'Demo Record' || item.is_demo)) ||
        (selectedStatus === 'Pending' && item.verification_status === 'Pending Verification');

      return matchesSearch && matchesCountry && matchesYear && matchesProgram && matchesLevel && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'year-desc') return b.graduation_year - a.graduation_year;
      if (sortBy === 'year-asc') return a.graduation_year - b.graduation_year;
      if (sortBy === 'name-asc') return a.full_name.localeCompare(b.full_name);
      if (sortBy === 'country-asc') return a.country.localeCompare(b.country);
      return 0;
    });
  }, [allAlumni, searchQuery, selectedCountry, selectedYear, selectedProgram, selectedLevel, selectedStatus, sortBy]);

  // Reset Filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCountry('All');
    setSelectedYear('All');
    setSelectedProgram('All');
    setSelectedLevel('All');
    setSelectedStatus('All');
    setSortBy('year-desc');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCountry !== 'All' ||
    selectedYear !== 'All' ||
    selectedProgram !== 'All' ||
    selectedLevel !== 'All' ||
    selectedStatus !== 'All';

  // Handle Connect Message Submit
  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConnectSuccess(true);
    setTimeout(() => {
      setConnectSuccess(false);
      setConnectModalAlumni(null);
      setConnectMessage('');
    }, 2500);
  };

  return (
    <div id="alumni-directory-section" className="space-y-8">
      {/* Header & Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002366]/10 text-[#002366] text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>International Academic Registry • 2017–2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#002366] tracking-tight">
              Global Alumni Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Search and connect with ordained pastors, theological scholars, chaplains, and Christian leaders across 50+ nations.
            </p>
          </div>

          {/* Quick Metrics Badge & View Mode Toggle */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Directory Matches</div>
              <div className="text-xl font-display font-black text-[#002366]">
                {filteredAlumni.length} <span className="text-xs font-medium text-slate-400">of {allAlumni.length}</span>
              </div>
            </div>

            <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                id="btn-view-grid"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#002366] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden md:inline">Cards</span>
              </button>
              <button
                id="btn-view-table"
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-[#002366] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tabular List View"
              >
                <List className="w-4 h-4" />
                <span className="hidden md:inline">Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Primary Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            id="input-alumni-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, country, city, ministry, organization, program, or alumni ID..."
            className="w-full pl-12 pr-10 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] focus:border-transparent placeholder:text-slate-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Comprehensive Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* 1. Graduation Year Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Graduation Year
            </label>
            <select
              id="filter-graduation-year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === 'All' ? 'All' : Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002366]"
            >
              <option value="All">All Years (2017–2026)</option>
              {GRADUATION_YEARS_10.map((yr) => (
                <option key={yr} value={yr}>
                  Class of {yr}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Country Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Country (50+ Nations)
            </label>
            <select
              id="filter-country"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002366]"
            >
              <option value="All">All Countries ({COUNTRIES_50_PLUS.length} Nations)</option>
              {COUNTRIES_50_PLUS.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Program Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Academic Program
            </label>
            <select
              id="filter-program"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002366]"
            >
              <option value="All">All Official Programs</option>
              {OFFICIAL_BIBU_PROGRAMS.map((prog, idx) => (
                <option key={idx} value={prog}>
                  {prog}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Degree Level */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Degree Level
            </label>
            <select
              id="filter-degree-level"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002366]"
            >
              <option value="All">All Degree Levels</option>
              <option value="Doctoral">Doctorate (PhD / DMin / ThD)</option>
              <option value="Master">Master's (MDiv / MA / MTS)</option>
              <option value="Bachelor">Bachelor's (BTh / BBS / BA)</option>
              <option value="Diploma">Diploma Programs</option>
              <option value="Certificate">Certificate Programs</option>
            </select>
          </div>

          {/* 5. Sort / Verification Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Sort & Verification
            </label>
            <div className="flex gap-2">
              <select
                id="filter-sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002366]"
              >
                <option value="year-desc">Newest (2026 → 2017)</option>
                <option value="year-asc">Oldest (2017 → 2026)</option>
                <option value="name-asc">Name (A → Z)</option>
                <option value="country-asc">Country (A → Z)</option>
              </select>
              {hasActiveFilters && (
                <button
                  id="btn-reset-filters"
                  onClick={resetFilters}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 shrink-0 transition-colors"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filter Pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="font-bold text-slate-500">Active Filters:</span>
            {searchQuery && (
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium flex items-center gap-1.5 border border-slate-200">
                Keyword: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedYear !== 'All' && (
              <span className="px-2.5 py-1 rounded-lg bg-[#002366]/10 text-[#002366] font-medium flex items-center gap-1.5 border border-[#002366]/20">
                Class of {selectedYear}
                <button onClick={() => setSelectedYear('All')} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCountry !== 'All' && (
              <span className="px-2.5 py-1 rounded-lg bg-[#002366]/10 text-[#002366] font-medium flex items-center gap-1.5 border border-[#002366]/20">
                {getCountryFlag(selectedCountry)} {selectedCountry}
                <button onClick={() => setSelectedCountry('All')} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedProgram !== 'All' && (
              <span className="px-2.5 py-1 rounded-lg bg-[#C5A059]/15 text-amber-900 font-medium flex items-center gap-1.5 border border-[#C5A059]/30">
                {selectedProgram}
                <button onClick={() => setSelectedProgram('All')} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedLevel !== 'All' && (
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium flex items-center gap-1.5 border border-slate-200">
                Level: {selectedLevel}
                <button onClick={() => setSelectedLevel('All')} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-red-600 hover:text-red-800 ml-auto underline"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Section */}
      {filteredAlumni.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-display font-bold text-slate-800">
              No Alumni Found Matching Your Criteria
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search terms, selecting "All Countries", or resetting your graduation year filters.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-[#002366] text-[#C5A059] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#001A4D] transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Directory Filters</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alum) => {
            const flag = getCountryFlag(alum.country);
            const isVerified = alum.verification_status === 'Verified Alumni';
            const isDemo = alum.verification_status === 'Demo Record' || alum.is_demo;

            return (
              <div
                key={alum.id}
                id={`alumni-card-${alum.id}`}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#002366] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Demo / Verified Status Banner Indicator */}
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#002366] via-[#C5A059] to-[#002366]" />

                <div className="space-y-4">
                  {/* Top Row: Verification & Graduation Year */}
                  <div className="flex items-center justify-between gap-2">
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>✓ Verified BIBU Alumni</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-[9px] font-bold uppercase tracking-wider" title="Fictional record for system demonstration">
                        <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>Demo Record</span>
                      </span>
                    )}

                    <span className="text-xs font-mono font-bold text-[#002366] bg-slate-100 px-2.5 py-0.5 rounded-md">
                      Class of {alum.graduation_year}
                    </span>
                  </div>

                  {/* Profile Header (Avatar + Name + Country) */}
                  <div className="flex items-start gap-3.5 pt-1">
                    <div className="w-13 h-13 rounded-2xl bg-[#002366] text-[#C5A059] flex items-center justify-center font-display font-black text-lg shadow-sm shrink-0 border-2 border-[#C5A059]/30">
                      {alum.first_name.charAt(0)}
                      {alum.last_name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        onClick={() => {
                          setActiveProfile(alum);
                          if (onSelectAlumni) onSelectAlumni(alum);
                        }}
                        className="text-base font-display font-bold text-[#002366] group-hover:text-[#001A4D] cursor-pointer hover:underline truncate"
                      >
                        {alum.full_name}
                      </h3>
                      <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                        <span className="text-sm">{flag}</span>
                        <span className="truncate">{alum.city}, {alum.country}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        ID: {alum.alumni_id}
                      </div>
                    </div>
                  </div>

                  {/* Academic Degree & Program Box */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] bg-[#002366] px-2 py-0.5 rounded">
                        {alum.qualification_level}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {alum.study_mode || 'Accredited Track'}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-800 flex items-start gap-1.5 leading-snug">
                      <GraduationCap className="w-3.5 h-3.5 text-[#002366] shrink-0 mt-0.5" />
                      <span>{alum.program_name}</span>
                    </div>
                  </div>

                  {/* Current Position & Ministry / Organization */}
                  <div className="space-y-1 text-xs">
                    {alum.current_position && (
                      <div className="font-bold text-[#002366] flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        <span className="truncate">{alum.current_position}</span>
                      </div>
                    )}
                    {alum.organization && (
                      <div className="text-slate-600 text-[11px] pl-5 truncate">
                        {alum.organization}
                      </div>
                    )}
                  </div>

                  {/* Biography Snippet */}
                  {alum.biography && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic">
                      "{alum.biography}"
                    </p>
                  )}

                  {/* Featured Achievement if available */}
                  {alum.achievements && alum.achievements.length > 0 && (
                    <div className="text-[11px] text-slate-700 bg-amber-50/60 rounded-lg p-2 border border-amber-200/60 flex items-center gap-1.5 font-medium">
                      <Award className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="truncate">{alum.achievements[0]}</span>
                    </div>
                  )}

                  {/* Demo Record Notice on Card */}
                  {isDemo && (
                    <div className="text-[9px] text-slate-400 font-mono text-center border-t border-dashed border-slate-200 pt-2">
                      DEMO ALUMNI RECORD — Replace with Verified Alumni Data
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    id={`btn-view-profile-${alum.id}`}
                    onClick={() => {
                      setActiveProfile(alum);
                      if (onSelectAlumni) onSelectAlumni(alum);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#002366] text-xs font-bold transition-all text-center"
                  >
                    View Full Profile
                  </button>
                  <button
                    id={`btn-connect-${alum.id}`}
                    onClick={() => setConnectModalAlumni(alum)}
                    className="py-2 px-3 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-[#C5A059] text-xs font-bold transition-all flex items-center gap-1"
                    title="Send connection or mentorship request"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#002366] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Alumni & ID</th>
                  <th className="py-3.5 px-4">Nation & City</th>
                  <th className="py-3.5 px-4">Class</th>
                  <th className="py-3.5 px-4">Program & Qualification</th>
                  <th className="py-3.5 px-4">Current Role & Ministry</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAlumni.map((alum) => {
                  const flag = getCountryFlag(alum.country);
                  const isVerified = alum.verification_status === 'Verified Alumni';
                  const isDemo = alum.verification_status === 'Demo Record' || alum.is_demo;

                  return (
                    <tr key={alum.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#002366] flex items-center gap-2">
                          <span>{alum.full_name}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {alum.alumni_id}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <span>{flag}</span>
                          <span>{alum.country}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">{alum.city}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-[#002366]">
                        {alum.graduation_year}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{alum.program_name}</div>
                        <span className="text-[10px] font-black uppercase text-[#C5A059] bg-[#002366]/10 px-1.5 py-0.5 rounded">
                          {alum.qualification_level}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 truncate max-w-xs">{alum.current_position || 'Minister'}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-xs">{alum.organization}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isVerified ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[9px]">
                            Demo Record
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                        <button
                          onClick={() => {
                            setActiveProfile(alum);
                            if (onSelectAlumni) onSelectAlumni(alum);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#002366] text-xs font-bold"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => setConnectModalAlumni(alum)}
                          className="px-2.5 py-1 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-[#C5A059] text-xs font-bold"
                        >
                          Connect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FULL ALUMNI PROFILE MODAL (Matching Section 9 Specification) */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-[#C5A059] relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header Bar */}
            <div className="bg-[#002366] text-white p-6 sm:p-8 rounded-t-2xl relative overflow-hidden border-b-2 border-[#C5A059]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.25),transparent_70%)]" />

              <button
                id="btn-close-profile-modal"
                onClick={() => setActiveProfile(null)}
                className="absolute top-4 right-4 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                title="Close Profile"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                {/* Profile Photo / Avatar */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 text-[#C5A059] border-2 border-[#C5A059] flex items-center justify-center font-display font-black text-3xl shadow-xl shrink-0">
                  {activeProfile.first_name.charAt(0)}
                  {activeProfile.last_name.charAt(0)}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    {activeProfile.verification_status === 'Verified Alumni' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-black uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>✓ VERIFIED BIBU ALUMNI</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-bold uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>DEMO RECORD — Replace with Verified Alumni Data</span>
                      </span>
                    )}

                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/10 text-slate-200">
                      Class of {activeProfile.graduation_year}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
                    {activeProfile.full_name}
                  </h2>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <span className="text-base">{getCountryFlag(activeProfile.country)}</span>
                      <strong>{activeProfile.city}, {activeProfile.country}</strong>
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[#C5A059]">
                      Alumni ID: <strong>{activeProfile.alumni_id}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content Body */}
            <div className="p-6 sm:p-8 space-y-6 text-slate-800 text-xs sm:text-sm">
              {/* 1. Education Section */}
              <div className="space-y-3 border-b border-slate-200 pb-5">
                <div className="flex items-center gap-2 text-[#002366] font-display font-black text-sm uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                  <span>Academic Qualifications & Credentials</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <div className="text-[11px] text-slate-500 font-bold uppercase">Degree Awarded</div>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">{activeProfile.program_name}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-bold uppercase">Qualification Level</div>
                    <div className="font-bold text-[#002366] text-sm mt-0.5">{activeProfile.qualification_level}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-bold uppercase">Graduation Year & Date</div>
                    <div className="font-bold text-slate-900 mt-0.5">
                      {activeProfile.graduation_date || `Cohort ${activeProfile.graduation_year}`} (Class of {activeProfile.graduation_year})
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-bold uppercase">Study Centre / Mode</div>
                    <div className="font-bold text-slate-900 mt-0.5">
                      {activeProfile.campus || 'Online Global Center'} ({activeProfile.study_mode || 'Distance Learning'})
                    </div>
                  </div>
                  {activeProfile.certificate_number && (
                    <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                      <div className="text-[11px] text-slate-500 font-bold uppercase">Official Certificate Reference</div>
                      <div className="font-mono font-bold text-emerald-800 mt-0.5">
                        {activeProfile.certificate_number}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Professional & Ministry Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-200 pb-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#002366] font-display font-black text-sm uppercase tracking-wider">
                    <Building className="w-4 h-4 text-[#C5A059]" />
                    <span>Professional Profile</span>
                  </div>
                  <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <div className="text-[11px] text-slate-500 font-bold uppercase">Current Position</div>
                      <div className="font-bold text-slate-900">{activeProfile.current_position || 'Ministerial Leader'}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-bold uppercase">Organization</div>
                      <div className="font-bold text-slate-900">{activeProfile.organization || 'Independent Ministry'}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-bold uppercase">Field of Profession</div>
                      <div className="font-bold text-slate-900">{activeProfile.profession || 'Pastoral Ministry & Leadership'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#002366] font-display font-black text-sm uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-[#C5A059]" />
                    <span>Ministry Profile</span>
                  </div>
                  <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <div className="text-[11px] text-slate-500 font-bold uppercase">Church / Calling</div>
                      <div className="font-bold text-slate-900">{activeProfile.ministry || 'Apostolic & Pastoral Ministry'}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-bold uppercase">Country of Service</div>
                      <div className="font-bold text-slate-900">{activeProfile.country}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-bold uppercase">Primary Focus</div>
                      <div className="font-bold text-slate-900">{activeProfile.distinguished_category || 'Theological Leadership'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Biography */}
              {activeProfile.biography && (
                <div className="space-y-2 border-b border-slate-200 pb-5">
                  <div className="font-display font-black text-[#002366] uppercase tracking-wider text-xs">
                    Professional Biography & Testimony
                  </div>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {activeProfile.biography}
                  </p>
                </div>
              )}

              {/* 4. Achievements & Distinctions */}
              {activeProfile.achievements && activeProfile.achievements.length > 0 && (
                <div className="space-y-2 border-b border-slate-200 pb-5">
                  <div className="font-display font-black text-[#002366] uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#C5A059]" />
                    <span>Key Achievements & Distinctions</span>
                  </div>
                  <ul className="space-y-1.5">
                    {activeProfile.achievements.map((ach, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 5. Institutional Verification Info */}
              <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-xs font-bold text-[#002366] flex items-center justify-center sm:justify-start gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    <span>Verified by Breakthrough International Bible University Registrar</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Status: <strong>{activeProfile.verification_status}</strong> • Privacy Level: <strong>{activeProfile.privacy_status}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-modal-connect"
                    onClick={() => {
                      const alum = activeProfile;
                      setActiveProfile(null);
                      setConnectModalAlumni(alum);
                    }}
                    className="px-4 py-2 bg-[#002366] text-[#C5A059] text-xs font-black uppercase tracking-wider rounded-xl hover:bg-[#001A4D] transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                  {onVerifyGraduate && activeProfile.certificate_number && (
                    <button
                      id="btn-modal-verify-cert"
                      onClick={() => {
                        onVerifyGraduate(activeProfile.certificate_number || activeProfile.alumni_id);
                        setActiveProfile(null);
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Verify Certificate</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONNECT / MENTORSHIP MODAL */}
      {connectModalAlumni && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border-2 border-[#C5A059]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#002366]">
                    Connect with {connectModalAlumni.full_name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {connectModalAlumni.current_position || 'Alumni'} • {connectModalAlumni.city}, {connectModalAlumni.country}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConnectModalAlumni(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {connectSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-sm font-bold text-emerald-900">Message Forwarded Successfully</div>
                <p className="text-xs text-emerald-700">
                  Your ministerial inquiry has been transmitted through the BIBU Alumni Secretariat to {connectModalAlumni.full_name}.
                </p>
              </div>
            ) : isGuest ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
                <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Authenticated Account Required</span>
                </div>
                <p className="text-xs text-amber-800">
                  To protect our global alumni community from unsolicited spam, direct mentorship and connection requests require an authenticated BIBU account.
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      setConnectModalAlumni(null);
                      openAuthModal('register', 'alumni');
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#002366] text-[#C5A059] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create Account</span>
                  </button>
                  <button
                    onClick={() => {
                      setConnectModalAlumni(null);
                      openAuthModal('login', 'alumni');
                    }}
                    className="flex-1 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#002366]" />
                    <span>Sign In</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConnectSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Message / Mentorship Request:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={connectMessage}
                    onChange={(e) => setConnectMessage(e.target.value)}
                    placeholder="Introduce yourself, your current ministry/calling, and why you are reaching out..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setConnectModalAlumni(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#002366] text-[#C5A059] text-xs font-black uppercase tracking-wider hover:bg-[#001A4D] flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
