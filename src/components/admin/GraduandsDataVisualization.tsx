import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  GraduationCap,
  Globe,
  Award,
  BookOpen,
  Filter,
  Download,
  RotateCcw,
  Search,
  CheckCircle2,
  Building,
  TrendingUp,
  MapPin,
  Layers
} from 'lucide-react';

// Institutional Palette
const BRAND_COLORS = {
  navy: '#002366',
  gold: '#C5A059',
  emerald: '#059669',
  royalBlue: '#2563EB',
  purple: '#7C3AED',
  amber: '#D97706',
  teal: '#0D9488',
  rose: '#E11D48',
  slate: '#64748B',
  indigo: '#4F46E5',
};

const LEVEL_COLORS: Record<string, string> = {
  Doctorate: BRAND_COLORS.purple,
  Master: BRAND_COLORS.navy,
  Bachelor: BRAND_COLORS.royalBlue,
  Diploma: BRAND_COLORS.emerald,
  Certificate: BRAND_COLORS.gold,
};

const REGION_COLORS: Record<string, string> = {
  Kenya: '#059669',
  Uganda: '#2563EB',
  'East Africa Transnational': '#D97706',
  Other: '#64748B'
};

const PALETTE = [
  '#002366',
  '#C5A059',
  '#059669',
  '#2563EB',
  '#7C3AED',
  '#D97706',
  '#0D9488',
  '#E11D48',
  '#4F46E5',
  '#0284C7',
];

export const GraduandsDataVisualization: React.FC = () => {
  const { graduationCandidates, graduationCeremonies } = useApp();

  // Filters State
  const [selectedCeremony, setSelectedCeremony] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedBookletFilter, setSelectedBookletFilter] = useState<'all' | 'flagged' | 'unflagged'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [chartViewMode, setChartViewMode] = useState<'programs' | 'regions' | 'levels' | 'schools'>('programs');

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    return graduationCandidates.filter((cand) => {
      // Ceremony filter
      if (selectedCeremony !== 'all' && cand.ceremonyId !== selectedCeremony) {
        return false;
      }
      // Region/Country filter
      if (selectedRegion !== 'all') {
        const countryMatch = cand.country?.toLowerCase() === selectedRegion.toLowerCase();
        const campusMatch = cand.campus?.toLowerCase().includes(selectedRegion.toLowerCase());
        if (!countryMatch && !campusMatch) return false;
      }
      // Award Level filter
      if (selectedLevel !== 'all' && cand.awardLevel !== selectedLevel) {
        return false;
      }
      // Booklet Filter
      if (selectedBookletFilter === 'flagged' && !cand.includedInBooklet) {
        return false;
      }
      if (selectedBookletFilter === 'unflagged' && cand.includedInBooklet) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = cand.fullName?.toLowerCase().includes(q);
        const matchesProgram = cand.programName?.toLowerCase().includes(q);
        const matchesSchool = cand.schoolName?.toLowerCase().includes(q);
        const matchesCity = cand.city?.toLowerCase().includes(q);
        if (!matchesName && !matchesProgram && !matchesSchool && !matchesCity) {
          return false;
        }
      }
      return true;
    });
  }, [graduationCandidates, selectedCeremony, selectedRegion, selectedLevel, selectedBookletFilter, searchQuery]);

  // Aggregate by Program
  const programData = useMemo(() => {
    const map = new Map<string, {
      programName: string;
      awardLevel: string;
      schoolName: string;
      total: number;
      kenya: number;
      uganda: number;
      other: number;
    }>();

    filteredCandidates.forEach((c) => {
      const prog = c.programName || 'Unassigned Program';
      if (!map.has(prog)) {
        map.set(prog, {
          programName: prog,
          awardLevel: c.awardLevel || 'Certificate',
          schoolName: c.schoolName || 'General',
          total: 0,
          kenya: 0,
          uganda: 0,
          other: 0,
        });
      }
      const entry = map.get(prog)!;
      entry.total += 1;
      const ctry = (c.country || '').toLowerCase();
      if (ctry.includes('kenya')) {
        entry.kenya += 1;
      } else if (ctry.includes('uganda')) {
        entry.uganda += 1;
      } else {
        entry.other += 1;
      }
    });

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [filteredCandidates]);

  // Top Programs formatted for BarChart (shorten long names for display)
  const topProgramsChartData = useMemo(() => {
    return programData.map((p) => {
      // Create short display label
      let shortLabel = p.programName;
      if (shortLabel.length > 28) {
        shortLabel = shortLabel
          .replace('Doctor of Philosophy', 'Ph.D.')
          .replace('Bachelor of Arts', 'B.A.')
          .replace('Bachelor of Science', 'B.Sc.')
          .replace('Master of Science', 'M.Sc.')
          .replace('Master of Arts', 'M.A.')
          .replace('Certificate in', 'Cert.')
          .replace('Diploma in', 'Dip.');
        if (shortLabel.length > 25) {
          shortLabel = shortLabel.substring(0, 24) + '…';
        }
      }

      return {
        name: shortLabel,
        fullName: p.programName,
        total: p.total,
        Kenya: p.kenya,
        Uganda: p.uganda,
        Other: p.other,
        awardLevel: p.awardLevel,
        school: p.schoolName
      };
    });
  }, [programData]);

  // Aggregate by Region / Country
  const regionData = useMemo(() => {
    const map = new Map<string, number>();
    filteredCandidates.forEach((c) => {
      let reg = c.country || 'Other';
      if (reg.toLowerCase().includes('kenya')) reg = 'Kenya';
      else if (reg.toLowerCase().includes('uganda')) reg = 'Uganda';
      map.set(reg, (map.get(reg) || 0) + 1);
    });

    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
      percentage: filteredCandidates.length ? ((value / filteredCandidates.length) * 100).toFixed(1) : '0'
    }));
  }, [filteredCandidates]);

  // Aggregate by Campus / Regional Study Centre
  const campusData = useMemo(() => {
    const map = new Map<string, number>();
    filteredCandidates.forEach((c) => {
      let camp = c.campus || (c.country === 'Uganda' ? 'Breakthrough Uganda Campus' : 'Kenya Study Centres');
      if (camp.includes('Kenya')) camp = 'Kenya Study Centres';
      if (camp.includes('Uganda')) camp = 'Uganda Campus (Kampala)';
      map.set(camp, (map.get(camp) || 0) + 1);
    });

    return Array.from(map.entries()).map(([name, count]) => ({
      campus: name,
      graduands: count
    }));
  }, [filteredCandidates]);

  // Aggregate by Award Level
  const levelData = useMemo(() => {
    const levels = ['Doctorate', 'Master', 'Bachelor', 'Diploma', 'Certificate'];
    const counts: Record<string, { total: number; Kenya: number; Uganda: number }> = {};

    levels.forEach((lvl) => {
      counts[lvl] = { total: 0, Kenya: 0, Uganda: 0 };
    });

    filteredCandidates.forEach((c) => {
      const lvl = c.awardLevel;
      if (counts[lvl]) {
        counts[lvl].total += 1;
        if ((c.country || '').toLowerCase().includes('kenya')) {
          counts[lvl].Kenya += 1;
        } else {
          counts[lvl].Uganda += 1;
        }
      }
    });

    return levels.map((lvl) => ({
      level: lvl,
      total: counts[lvl].total,
      Kenya: counts[lvl].Kenya,
      Uganda: counts[lvl].Uganda,
      color: LEVEL_COLORS[lvl] || BRAND_COLORS.navy
    }));
  }, [filteredCandidates]);

  // Aggregate by School
  const schoolData = useMemo(() => {
    const map = new Map<string, { name: string; shortName: string; count: number }>();

    filteredCandidates.forEach((c) => {
      const sch = c.schoolName || 'School of Biblical & Theological Studies';
      let shortName = sch
        .replace('School of ', '')
        .replace('Faculty of ', '');
      if (shortName.length > 20) {
        shortName = shortName.substring(0, 18) + '…';
      }

      if (!map.has(sch)) {
        map.set(sch, { name: sch, shortName, count: 0 });
      }
      map.get(sch)!.count += 1;
    });

    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [filteredCandidates]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCeremony('all');
    setSelectedRegion('all');
    setSelectedLevel('all');
    setSelectedBookletFilter('all');
    setSearchQuery('');
  };

  // CSV Export of Program & Regional Summary
  const handleExportCSV = () => {
    const headers = ['Program Name', 'Award Level', 'School', 'Total Graduands', 'Kenya', 'Uganda', 'Other', 'Percentage'];
    const rows = programData.map((p) => {
      const pct = filteredCandidates.length ? ((p.total / filteredCandidates.length) * 100).toFixed(1) + '%' : '0%';
      return [
        `"${p.programName}"`,
        `"${p.awardLevel}"`,
        `"${p.schoolName}"`,
        p.total,
        p.kenya,
        p.uganda,
        p.other,
        `"${pct}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BIBU_Graduands_Summary_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom Tooltip for Program BarChart
  const CustomProgramTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg text-xs space-y-1 z-50">
          <p className="font-bold text-[#002366] text-sm">{data.fullName}</p>
          <div className="flex items-center gap-2 pt-1">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
              style={{ backgroundColor: LEVEL_COLORS[data.awardLevel] || BRAND_COLORS.navy }}
            >
              {data.awardLevel}
            </span>
            <span className="text-slate-500">{data.school}</span>
          </div>
          <div className="pt-2 border-t border-slate-100 space-y-0.5">
            <div className="flex justify-between gap-4">
              <span className="font-semibold text-slate-700">Total Graduands:</span>
              <span className="font-bold text-[#002366]">{data.total}</span>
            </div>
            <div className="flex justify-between gap-4 text-emerald-700">
              <span>Kenya Centres:</span>
              <span className="font-semibold">{data.Kenya}</span>
            </div>
            <div className="flex justify-between gap-4 text-blue-700">
              <span>Uganda Campus:</span>
              <span className="font-semibold">{data.Uganda}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="graduands-data-visualization-root" className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-[#002366]/10 text-[#002366] text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Registry Visual Intelligence & Analytics</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-[#002366] tracking-tight">
              Graduand Summary by Program & Region
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              Live visual analytics based on the official convocation roll across Kenya Study Centres, Breakthrough Uganda Campus (Kampala), and Transnational Regional Affiliates.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="export-graduand-summary-csv-btn"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer border border-slate-300 shadow-xs"
            >
              <Download className="w-4 h-4 text-[#002366]" />
              <span>Export CSV</span>
            </button>
            <button
              id="reset-graduand-filters-btn"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#002366] text-xs font-bold transition-colors cursor-pointer border border-amber-200"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Total Filtered Graduands</div>
            <div className="text-2xl font-black text-[#002366] font-display mt-0.5">
              {filteredCandidates.length.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              of {graduationCandidates.length} in registry
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Active Programs</div>
            <div className="text-2xl font-black text-[#C5A059] font-display mt-0.5">
              {programData.length}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Across 5 Academic Faculties</div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Regions & Countries</div>
            <div className="text-2xl font-black text-emerald-700 font-display mt-0.5">
              {regionData.length} Regions
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Kenya & Uganda Campuses</div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Top Enrolled Program</div>
            <div className="text-sm font-black text-[#002366] font-display mt-1 truncate" title={programData[0]?.programName}>
              {programData[0]?.programName || 'N/A'}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
              {programData[0]?.total || 0} Graduands
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
            <Filter className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Interactive Data Filters</span>
          </div>
          <span className="text-xs text-slate-500">
            Showing {filteredCandidates.length} of {graduationCandidates.length} candidates
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Ceremony Filter */}
          <div>
            <label htmlFor="filter-ceremony-select" className="block text-[11px] font-bold text-slate-600 mb-1">
              Ceremony / Convocation
            </label>
            <select
              id="filter-ceremony-select"
              value={selectedCeremony}
              onChange={(e) => setSelectedCeremony(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#002366]"
            >
              <option value="all">All Ceremonies</option>
              {graduationCeremonies.map((cer) => (
                <option key={cer.id} value={cer.id}>
                  {cer.graduationNumber} ({cer.academicYear})
                </option>
              ))}
            </select>
          </div>

          {/* Region / Country Filter */}
          <div>
            <label htmlFor="filter-region-select" className="block text-[11px] font-bold text-slate-600 mb-1">
              Region / Country
            </label>
            <select
              id="filter-region-select"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#002366]"
            >
              <option value="all">All Regions & Countries</option>
              <option value="Kenya">Kenya (Main Campus & Regional Centres)</option>
              <option value="Uganda">Uganda (Breakthrough Uganda Campus)</option>
            </select>
          </div>

          {/* Award Level Filter */}
          <div>
            <label htmlFor="filter-level-select" className="block text-[11px] font-bold text-slate-600 mb-1">
              Academic Award Level
            </label>
            <select
              id="filter-level-select"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#002366]"
            >
              <option value="all">All Award Levels</option>
              <option value="Doctorate">Doctorate (Ph.D.)</option>
              <option value="Master">Master Degrees</option>
              <option value="Bachelor">Bachelor Degrees</option>
              <option value="Diploma">Diplomas</option>
              <option value="Certificate">Certificates</option>
            </select>
          </div>

          {/* Booklet Inclusion Status Filter */}
          <div>
            <label htmlFor="filter-booklet-select" className="block text-[11px] font-bold text-slate-600 mb-1">
              Booklet Selection
            </label>
            <select
              id="filter-booklet-select"
              value={selectedBookletFilter}
              onChange={(e) => setSelectedBookletFilter(e.target.value as any)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#002366]"
            >
              <option value="all">All Candidates</option>
              <option value="flagged">Flagged for Booklet Only</option>
              <option value="unflagged">Excluded from Booklet</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label htmlFor="filter-search-input" className="block text-[11px] font-bold text-slate-600 mb-1">
              Search Program / City
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                id="filter-search-input"
                type="text"
                placeholder="Search by program..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-2.5 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#002366]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Chart Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          id="tab-view-programs"
          onClick={() => setChartViewMode('programs')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            chartViewMode === 'programs'
              ? 'border-[#002366] text-[#002366] bg-amber-50/70 font-black'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Programs Breakdown ({programData.length})</span>
        </button>

        <button
          id="tab-view-regions"
          onClick={() => setChartViewMode('regions')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            chartViewMode === 'regions'
              ? 'border-[#002366] text-[#002366] bg-amber-50/70 font-black'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Regional & Campus Distribution</span>
        </button>

        <button
          id="tab-view-levels"
          onClick={() => setChartViewMode('levels')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            chartViewMode === 'levels'
              ? 'border-[#002366] text-[#002366] bg-amber-50/70 font-black'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Award Levels Hierarchy</span>
        </button>

        <button
          id="tab-view-schools"
          onClick={() => setChartViewMode('schools')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            chartViewMode === 'schools'
              ? 'border-[#002366] text-[#002366] bg-amber-50/70 font-black'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Academic Faculties</span>
        </button>
      </div>

      {/* VIEW 1: PROGRAM DISTRIBUTION (BarChart) */}
      {chartViewMode === 'programs' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#002366] font-display">
                  Graduand Enrollment by Academic Program
                </h3>
                <p className="text-xs text-slate-500">
                  Stacked distribution showing graduands from Kenya Study Centres and Uganda Campus per program
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#059669] inline-block" />
                  <span className="text-slate-700 font-medium">Kenya</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#2563EB] inline-block" />
                  <span className="text-slate-700 font-medium">Uganda</span>
                </span>
              </div>
            </div>

            {/* Recharts BarChart */}
            <div className="w-full h-84 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProgramsChartData.slice(0, 14)}
                  margin={{ top: 20, right: 20, left: 10, bottom: 65 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-40}
                    textAnchor="end"
                    tick={{ fill: '#475569', fontSize: 11 }}
                    height={70}
                  />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip content={<CustomProgramTooltip />} />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="Kenya" stackId="region" fill="#059669" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Uganda" stackId="region" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Displaying top 14 programs. Hover over any bar to inspect exact Kenya/Uganda graduand headcounts.
            </p>
          </div>

          {/* Program Distribution Summary Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#002366]" />
                <h4 className="text-xs font-bold text-[#002366] uppercase tracking-wider">
                  Complete Program Registry Breakdown ({programData.length} Programs)
                </h4>
              </div>
              <span className="text-xs text-slate-500">
                {filteredCandidates.length} Total Graduands
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">#</th>
                    <th className="px-4 py-2.5">Program Title</th>
                    <th className="px-4 py-2.5">Award Level</th>
                    <th className="px-4 py-2.5">Academic School</th>
                    <th className="px-4 py-2.5 text-center">Kenya</th>
                    <th className="px-4 py-2.5 text-center">Uganda</th>
                    <th className="px-4 py-2.5 text-right">Total</th>
                    <th className="px-4 py-2.5 text-right">Share %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {programData.map((p, idx) => {
                    const share = filteredCandidates.length
                      ? ((p.total / filteredCandidates.length) * 100).toFixed(1)
                      : '0';
                    return (
                      <tr key={p.programName} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-2.5 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                        <td className="px-4 py-2.5 font-bold text-[#002366]">
                          {p.programName}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className="inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-2xs"
                            style={{ backgroundColor: LEVEL_COLORS[p.awardLevel] || BRAND_COLORS.navy }}
                          >
                            {p.awardLevel}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 truncate max-w-xs">{p.schoolName}</td>
                        <td className="px-4 py-2.5 text-center text-emerald-700 font-bold">{p.kenya}</td>
                        <td className="px-4 py-2.5 text-center text-blue-700 font-bold">{p.uganda}</td>
                        <td className="px-4 py-2.5 text-right font-black text-[#002366]">{p.total}</td>
                        <td className="px-4 py-2.5 text-right text-slate-500 font-mono text-[11px]">{share}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: REGIONAL & CAMPUS BREAKDOWN */}
      {chartViewMode === 'regions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regional PieChart */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#002366] font-display">
                National & Regional Share
              </h3>
              <p className="text-xs text-slate-500">
                Proportion of graduands originating from Kenya and Uganda
              </p>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {regionData.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={REGION_COLORS[entry.name] || BRAND_COLORS.slate}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [`${val} graduands`, name]}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              {regionData.map((r) => (
                <div key={r.name} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <div className="text-xs font-bold text-slate-600">{r.name}</div>
                  <div className="text-xl font-black text-[#002366] mt-0.5">{r.value} Graduands</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">{r.percentage}% of total</div>
                </div>
              ))}
            </div>
          </div>

          {/* Campus Study Centres BarChart */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#002366] font-display">
                Campus & Study Centre Aggregates
              </h3>
              <p className="text-xs text-slate-500">
                Graduand volumes by transnational delivery campus
              </p>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campusData} margin={{ top: 20, right: 20, left: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="campus" tick={{ fill: '#475569', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: any) => [`${val} graduands`, 'Total']}
                  />
                  <Bar dataKey="graduands" fill="#C5A059" radius={[6, 6, 0, 0]}>
                    {campusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#059669' : '#2563EB'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#002366] shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-[#002366]">Transnational Reach:</span> The Kenya Centres host candidates from across Nairobi, Eldoret, Bungoma, Mombasa, and Nakuru, while Breakthrough Uganda Campus in Kampala convenes students across Kampala, Mbale, and Tororo.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: AWARD LEVEL HIERARCHY */}
      {chartViewMode === 'levels' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#002366] font-display">
                Graduands by Academic Award Level
              </h3>
              <p className="text-xs text-slate-500">
                Hierarchical breakdown from Certificate and Diploma to Bachelor, Master, and Doctorate (Ph.D.)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#059669] inline-block" />
                <span className="text-slate-700 font-medium">Kenya</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#2563EB] inline-block" />
                <span className="text-slate-700 font-medium">Uganda</span>
              </span>
            </div>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="level" tick={{ fill: '#475569', fontSize: 12, fontWeight: 'bold' }} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} Graduands`, name]}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="Kenya" fill="#059669" stackId="lvl" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Uganda" fill="#2563EB" stackId="lvl" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-100">
            {levelData.map((lvl) => (
              <div key={lvl.level} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: lvl.color }}
                  />
                  <span className="text-[10px] font-bold text-slate-400 font-mono">
                    {filteredCandidates.length
                      ? ((lvl.total / filteredCandidates.length) * 100).toFixed(0) + '%'
                      : '0%'}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-700">{lvl.level}</div>
                <div className="text-lg font-black text-[#002366] font-display mt-0.5">{lvl.total}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 flex justify-between">
                  <span className="text-emerald-700 font-semibold">{lvl.Kenya} KE</span>
                  <span className="text-blue-700 font-semibold">{lvl.Uganda} UG</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: SCHOOLS / FACULTIES */}
      {chartViewMode === 'schools' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#002366] font-display">
              Graduand Distribution by Academic Faculty / School
            </h3>
            <p className="text-xs text-slate-500">
              Breakdown across BIBU's constituent colleges and faculties
            </p>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={schoolData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 120, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fill: '#475569', fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="shortName"
                  tick={{ fill: '#002366', fontSize: 11, fontWeight: 'bold' }}
                />
                <Tooltip
                  formatter={(val: any, _: any, item: any) => [`${val} graduands`, item.payload.name]}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#002366" radius={[0, 6, 6, 0]}>
                  {schoolData.map((_, index) => (
                    <Cell key={`cell-school-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {schoolData.map((s, idx) => (
              <div key={s.name} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5"
                  style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}
                />
                <div>
                  <div className="text-xs font-bold text-[#002366]">{s.name}</div>
                  <div className="text-sm font-black text-slate-800 mt-0.5">{s.count} Graduands</div>
                  <div className="text-[10px] text-slate-500">
                    {filteredCandidates.length
                      ? ((s.count / filteredCandidates.length) * 100).toFixed(1) + '%'
                      : '0%'}{' '}
                    of current roll
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
