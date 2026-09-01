import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { COUNTRIES_50_PLUS, GRADUATION_YEARS_10, OFFICIAL_BIBU_PROGRAMS } from '../../data/alumniData';
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
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  Users,
  Globe,
  GraduationCap,
  Calendar,
  Award,
  ShieldCheck,
  TrendingUp,
  Filter,
  RotateCcw,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  Layers,
  Sparkles,
  MapPin,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

// Palette for visual data charts
const CHART_COLORS = [
  '#002366', // Deep BIBU Navy
  '#C5A059', // Academic Gold
  '#059669', // Emerald Green
  '#2563EB', // Royal Blue
  '#7C3AED', // Regal Purple
  '#DB2777', // Rose Pink
  '#D97706', // Amber Ochre
  '#0D9488', // Teal
  '#4F46E5', // Indigo
  '#DC2626', // Crimson Red
  '#0284C7', // Sky Blue
  '#64748B', // Slate
];

const QUALIFICATION_COLORS: Record<string, string> = {
  Doctorate: '#7C3AED',
  Master: '#002366',
  Bachelor: '#2563EB',
  Diploma: '#059669',
  Certificate: '#C5A059',
};

export const AlumniStatistics: React.FC = () => {
  const { alumniList } = useApp();

  // Filter States for dynamic slicing
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedVerification, setSelectedVerification] = useState<string>('All');
  const [activeChartTab, setActiveChartTab] = useState<'all' | 'country' | 'year' | 'program'>('all');

  // Country lookup map for regions
  const countryRegionMap = useMemo(() => {
    const map = new Map<string, string>();
    COUNTRIES_50_PLUS.forEach((c) => {
      map.set(c.name.toLowerCase(), c.region);
    });
    return map;
  }, []);

  // Filtered dataset calculated in real-time
  const filteredAlumni = useMemo(() => {
    return alumniList.filter((item) => {
      const matchYear = selectedYear === 'All' || item.graduation_year.toString() === selectedYear;
      const matchLevel =
        selectedLevel === 'All' ||
        item.qualification_level.toLowerCase().includes(selectedLevel.toLowerCase());
      const matchVerification =
        selectedVerification === 'All' ||
        (selectedVerification === 'Verified' && item.verification_status === 'Verified Alumni') ||
        (selectedVerification === 'Demo' && (item.verification_status === 'Demo Record' || item.is_demo));

      const itemRegion = countryRegionMap.get(item.country.toLowerCase()) || 'Global / Other';
      const matchRegion = selectedRegion === 'All' || itemRegion === selectedRegion;

      return matchYear && matchLevel && matchVerification && matchRegion;
    });
  }, [alumniList, selectedYear, selectedLevel, selectedVerification, selectedRegion, countryRegionMap]);

  // ==========================================
  // REAL-TIME STATISTICAL CALCULATIONS
  // ==========================================

  // 1. Distribution by Country (Top 12 & Full Breakdown)
  const countryDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredAlumni.forEach((a) => {
      const c = a.country || 'Unknown';
      counts[c] = (counts[c] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => {
        const countryInfo = COUNTRIES_50_PLUS.find((cp) => cp.name.toLowerCase() === name.toLowerCase());
        return {
          name,
          count,
          flag: countryInfo?.flag || '🌐',
          region: countryInfo?.region || 'Global',
          percentage: filteredAlumni.length > 0 ? ((count / filteredAlumni.length) * 100).toFixed(1) : '0',
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [filteredAlumni]);

  const topCountriesForChart = useMemo(() => {
    return countryDistribution.slice(0, 10);
  }, [countryDistribution]);

  // 2. Distribution by Regional Continent
  const regionalDistribution = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    filteredAlumni.forEach((a) => {
      const reg = countryRegionMap.get(a.country.toLowerCase()) || 'Other Regions';
      regionCounts[reg] = (regionCounts[reg] || 0) + 1;
    });

    return Object.entries(regionCounts)
      .map(([name, value]) => ({
        name,
        value,
        percentage: filteredAlumni.length > 0 ? ((value / filteredAlumni.length) * 100).toFixed(1) : '0',
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredAlumni, countryRegionMap]);

  // 3. Distribution by Graduation Year (2017–2026 Cohorts)
  const yearDistribution = useMemo(() => {
    const yearCounts: Record<number, { count: number; Doctorate: number; Master: number; Bachelor: number; Diploma: number; Certificate: number }> = {};
    GRADUATION_YEARS_10.forEach((yr) => {
      yearCounts[yr] = { count: 0, Doctorate: 0, Master: 0, Bachelor: 0, Diploma: 0, Certificate: 0 };
    });

    filteredAlumni.forEach((a) => {
      const yr = a.graduation_year;
      if (!yearCounts[yr]) {
        yearCounts[yr] = { count: 0, Doctorate: 0, Master: 0, Bachelor: 0, Diploma: 0, Certificate: 0 };
      }
      yearCounts[yr].count += 1;

      const lvl = a.qualification_level;
      if (lvl.includes('Doctor') || lvl === 'PhD' || lvl === 'DMin' || lvl === 'ThD') {
        yearCounts[yr].Doctorate += 1;
      } else if (lvl.includes('Master') || lvl === 'MDiv' || lvl === 'MA' || lvl === 'MTS') {
        yearCounts[yr].Master += 1;
      } else if (lvl.includes('Bachelor') || lvl === 'BTh' || lvl === 'BBS' || lvl === 'BA') {
        yearCounts[yr].Bachelor += 1;
      } else if (lvl.includes('Diploma')) {
        yearCounts[yr].Diploma += 1;
      } else {
        yearCounts[yr].Certificate += 1;
      }
    });

    return Object.entries(yearCounts)
      .map(([yearStr, data]) => ({
        year: `Class of ${yearStr}`,
        rawYear: Number(yearStr),
        ...data,
      }))
      .sort((a, b) => a.rawYear - b.rawYear);
  }, [filteredAlumni]);

  // 4. Distribution by Academic Program
  const programDistribution = useMemo(() => {
    const progCounts: Record<string, number> = {};
    filteredAlumni.forEach((a) => {
      const p = a.program_name || 'General Theological Studies';
      progCounts[p] = (progCounts[p] || 0) + 1;
    });

    return Object.entries(progCounts)
      .map(([name, count]) => {
        // Shorten title for responsive charts
        const shortName = name
          .replace('Doctor of Philosophy (Ph.D) in ', 'Ph.D ')
          .replace('Doctor of Ministry (D.Min) in ', 'D.Min ')
          .replace('Master of Divinity (M.Div)', 'M.Div')
          .replace('Master of Arts (M.A.) in ', 'M.A. ')
          .replace('Master of Theological Studies (M.T.S)', 'M.T.S')
          .replace('Bachelor of Theology (B.Th)', 'B.Th')
          .replace('Bachelor of Biblical Studies (B.B.S)', 'B.B.S')
          .replace('Diploma in Christian Ministry', 'Dip. Ministry')
          .replace('Diploma in Biblical Studies', 'Dip. Bible');

        return {
          name,
          shortName,
          count,
          percentage: filteredAlumni.length > 0 ? ((count / filteredAlumni.length) * 100).toFixed(1) : '0',
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [filteredAlumni]);

  // 5. Distribution by Qualification Level
  const qualificationLevelDistribution = useMemo(() => {
    const levelCounts: Record<string, number> = {
      Doctorate: 0,
      Master: 0,
      Bachelor: 0,
      Diploma: 0,
      Certificate: 0,
    };

    filteredAlumni.forEach((a) => {
      const lvl = a.qualification_level;
      if (lvl.includes('Doctor') || lvl === 'PhD' || lvl === 'DMin' || lvl === 'ThD') {
        levelCounts.Doctorate += 1;
      } else if (lvl.includes('Master') || lvl === 'MDiv' || lvl === 'MA' || lvl === 'MTS') {
        levelCounts.Master += 1;
      } else if (lvl.includes('Bachelor') || lvl === 'BTh' || lvl === 'BBS' || lvl === 'BA') {
        levelCounts.Bachelor += 1;
      } else if (lvl.includes('Diploma')) {
        levelCounts.Diploma += 1;
      } else {
        levelCounts.Certificate += 1;
      }
    });

    return Object.entries(levelCounts)
      .map(([name, value]) => ({
        name,
        value,
        color: QUALIFICATION_COLORS[name] || '#64748B',
        percentage: filteredAlumni.length > 0 ? ((value / filteredAlumni.length) * 100).toFixed(1) : '0',
      }))
      .filter((item) => item.value > 0);
  }, [filteredAlumni]);

  // 6. Overall Metrics
  const totalAlumniCount = alumniList.length;
  const verifiedCount = alumniList.filter((a) => a.verification_status === 'Verified Alumni').length;
  const demoCount = totalAlumniCount - verifiedCount;
  const distinctNationsCount = new Set(alumniList.map((a) => a.country)).size;
  const distinctProgramsCount = new Set(alumniList.map((a) => a.program_name)).size;
  const publicProfilesCount = alumniList.filter((a) => a.privacy_status === 'Public Directory' || a.privacy_status === 'Public Profile').length;

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedYear('All');
    setSelectedRegion('All');
    setSelectedLevel('All');
    setSelectedVerification('All');
  };

  // Export Summary CSV
  const handleExportCsv = () => {
    const headers = 'Country,Region,AlumniCount,Percentage\n';
    const rows = countryDistribution.map((c) => `"${c.name}","${c.region}",${c.count},"${c.percentage}%"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BIBU_Alumni_Distribution_Statistics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="alumni-statistics-dashboard" className="space-y-8">
      {/* 1. HEADER & EXECUTIVE SUMMARY METRICS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002366]/10 text-[#002366] text-xs font-bold uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Real-Time Academic Analytics & Institutional Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#002366]">
              Alumni Distribution & Demographics
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Live multi-dimensional visual analysis of alumni cohorts across 50+ sovereign nations, graduation classes (2017–2026), and academic degree programs.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-export-stats"
              onClick={handleExportCsv}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-300 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#002366]" />
              <span>Export CSV Report</span>
            </button>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-[#002366] text-white rounded-2xl p-4 border border-[#002366] shadow-xs space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#C5A059] flex items-center justify-between">
              <span>Total Registry</span>
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-display text-white">
              {totalAlumniCount.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-300">
              Filtered: <strong>{filteredAlumni.length}</strong>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Nations</span>
              <Globe className="w-3.5 h-3.5 text-[#002366]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-display text-[#002366]">
              {distinctNationsCount}
            </div>
            <div className="text-[10px] text-slate-500">Across 9 Continental Regions</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Cohorts</span>
              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-display text-[#002366]">
              10
            </div>
            <div className="text-[10px] text-slate-500">Classes 2017–2026</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Programs</span>
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-display text-[#002366]">
              {distinctProgramsCount}
            </div>
            <div className="text-[10px] text-slate-500">Cert to Doctorate</div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center justify-between">
              <span>Verified Rate</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-display text-emerald-900">
              {totalAlumniCount > 0 ? `${((verifiedCount / totalAlumniCount) * 100).toFixed(0)}%` : '0%'}
            </div>
            <div className="text-[10px] text-emerald-700">
              {verifiedCount} verified records
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-800 flex items-center justify-between">
              <span>Top Country</span>
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-lg sm:text-xl font-black font-display text-amber-950 truncate">
              {topCountriesForChart[0]?.name || 'Kenya'}
            </div>
            <div className="text-[10px] text-amber-800">
              {topCountriesForChart[0]?.count || 0} graduates ({topCountriesForChart[0]?.percentage || 0}%)
            </div>
          </div>
        </div>

        {/* Interactive Filter Bar */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#002366]">
            <Filter className="w-4 h-4 text-[#C5A059]" />
            <span>Interactive Real-Time Analytics Filters:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Graduation Class Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#002366]"
              >
                <option value="All">All Cohorts (2017–2026)</option>
                {GRADUATION_YEARS_10.map((yr) => (
                  <option key={yr} value={yr.toString()}>
                    Class of {yr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Geographic Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#002366]"
              >
                <option value="All">All Sovereign Regions (50+ Nations)</option>
                <option value="East Africa">East Africa (Kenya, Uganda, Tanzania, etc.)</option>
                <option value="West Africa">West Africa (Ghana, Nigeria, etc.)</option>
                <option value="Southern Africa">Southern Africa (South Africa, Zambia, etc.)</option>
                <option value="Central Africa">Central Africa (DRC, Cameroon, etc.)</option>
                <option value="North America">North America (USA, Canada)</option>
                <option value="Europe">Europe (UK, Germany, France, etc.)</option>
                <option value="Asia & Middle East">Asia & Middle East (India, Philippines, etc.)</option>
                <option value="Latin America & Caribbean">Latin America & Caribbean (Brazil, Mexico, etc.)</option>
                <option value="Oceania">Oceania (Australia, New Zealand)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Qualification Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#002366]"
              >
                <option value="All">All Qualification Levels</option>
                <option value="Doctorate">Doctorate (PhD / DMin / ThD)</option>
                <option value="Master">Master's (MDiv / MA / MTS)</option>
                <option value="Bachelor">Bachelor's (BTh / BBS / BA)</option>
                <option value="Diploma">Diploma Programs</option>
                <option value="Certificate">Certificate Programs</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Database Verification Status</label>
              <select
                value={selectedVerification}
                onChange={(e) => setSelectedVerification(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#002366]"
              >
                <option value="All">All Verification Statuses</option>
                <option value="Verified">Verified Official Alumni</option>
                <option value="Demo">Demo Records (Development)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN VISUALIZATION CHARTS */}
      <div className="space-y-8">
        {/* SECTION A: DISTRIBUTION BY COUNTRY & GEOGRAPHY */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002366]/10 text-[#002366] text-xs font-bold uppercase tracking-wider mb-1">
                <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Geographic Intelligence</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-[#002366]">
                1. Alumni Distribution by Sovereign Country & Region
              </h3>
              <p className="text-xs text-slate-500">
                Visualizing graduate concentrations across top nations and continental zones.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              {countryDistribution.length} Nations Active
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Top 10 Countries Bar Chart */}
            <div className="lg:col-span-7 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#002366]" />
                <span>Top 10 Sovereign Nations by Graduate Population</span>
              </h4>
              <div className="h-80 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topCountriesForChart}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={100}
                      tick={{ fontSize: 11, fill: '#002366', fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#001A4D',
                        borderColor: '#C5A059',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(val: any, name: any, item: any) => [
                        `${val} Alumni (${item.payload.percentage}%)`,
                        'Graduates',
                      ]}
                    />
                    <Bar dataKey="count" fill="#002366" radius={[0, 8, 8, 0]}>
                      {topCountriesForChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Regional Pie Chart */}
            <div className="lg:col-span-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <PieChartIcon className="w-4 h-4 text-[#C5A059]" />
                <span>Continental & Regional Breakdown</span>
              </h4>
              <div className="h-80 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionalDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={3}
                    >
                      {regionalDistribution.map((entry, index) => (
                        <Cell key={`cell-reg-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#001A4D',
                        borderColor: '#C5A059',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(val: any, name: any, item: any) => [
                        `${val} Graduates (${item.payload.percentage}%)`,
                        item.payload.name,
                      ]}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Country Grid Summary */}
          <div className="pt-4 border-t border-slate-100">
            <h5 className="text-xs font-bold text-slate-700 mb-3">Country Ranking & Share:</h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {countryDistribution.map((c, idx) => (
                <div
                  key={c.name}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">{c.flag}</span>
                    <span className="font-semibold text-slate-800 truncate">{c.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-[#002366]">{c.count}</span>
                    <span className="text-[9px] text-slate-400 block">{c.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION B: DISTRIBUTION BY GRADUATION YEAR (2017–2026) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002366]/10 text-[#002366] text-xs font-bold uppercase tracking-wider mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Decade Timeline Analysis</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-[#002366]">
                2. Alumni Distribution by Graduation Year (2017–2026)
              </h3>
              <p className="text-xs text-slate-500">
                Progression of graduating classes over the university's 10-year academic timeline with qualification tiers.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              10 Cohorts Analyzed
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Stacked Cohort Progression Bar Chart */}
            <div className="lg:col-span-8 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#002366]" />
                <span>Graduation Cohort Volumes by Qualification Tier</span>
              </h4>
              <div className="h-80 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearDistribution} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="rawYear"
                      tick={{ fontSize: 11, fill: '#002366', fontWeight: 600 }}
                      tickFormatter={(val) => `'${val.toString().slice(2)}`}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#001A4D',
                        borderColor: '#C5A059',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="Doctorate" stackId="a" fill={QUALIFICATION_COLORS.Doctorate} />
                    <Bar dataKey="Master" stackId="a" fill={QUALIFICATION_COLORS.Master} />
                    <Bar dataKey="Bachelor" stackId="a" fill={QUALIFICATION_COLORS.Bachelor} />
                    <Bar dataKey="Diploma" stackId="a" fill={QUALIFICATION_COLORS.Diploma} />
                    <Bar dataKey="Certificate" stackId="a" fill={QUALIFICATION_COLORS.Certificate} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Growth Curve / Area Trend */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Annual Output Trend Curve</span>
              </h4>
              <div className="h-80 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={yearDistribution} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C5A059" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#C5A059" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="rawYear"
                      tick={{ fontSize: 10, fill: '#64748B' }}
                      tickFormatter={(val) => `'${val.toString().slice(2)}`}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#001A4D',
                        borderColor: '#C5A059',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => [`${val} Total Graduates`, 'Class Size']}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#002366"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorCount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 10-Year Cohort Quick Pill Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 pt-2 border-t border-slate-100">
            {yearDistribution.map((yr) => (
              <button
                key={yr.rawYear}
                onClick={() => setSelectedYear(selectedYear === yr.rawYear.toString() ? 'All' : yr.rawYear.toString())}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedYear === yr.rawYear.toString()
                    ? 'bg-[#002366] text-[#C5A059] border-[#002366] shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="text-[10px] font-bold text-slate-400">Cohort</div>
                <div className="text-sm font-black font-display">{yr.rawYear}</div>
                <div className="text-[11px] font-bold text-emerald-700 mt-0.5">{yr.count} Grad</div>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION C: DISTRIBUTION BY ACADEMIC PROGRAM & DEGREE LEVEL */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002366]/10 text-[#002366] text-xs font-bold uppercase tracking-wider mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Curricular Demographics</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-[#002366]">
                3. Alumni Distribution by Degree Program & Qualification Level
              </h3>
              <p className="text-xs text-slate-500">
                Enrollment and graduation metrics across biblical studies, divinity, pastoral leadership, and christian counseling.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              {programDistribution.length} Distinct Programs
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Top Programs Horizontal Bar Chart */}
            <div className="lg:col-span-7 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#002366]" />
                <span>Top Academic Programs by Conferred Degrees</span>
              </h4>
              <div className="h-80 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={programDistribution.slice(0, 8)}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis
                      dataKey="shortName"
                      type="category"
                      width={120}
                      tick={{ fontSize: 10, fill: '#002366', fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#001A4D',
                        borderColor: '#C5A059',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(val: any, name: any, item: any) => [
                        `${val} Graduates (${item.payload.percentage}%)`,
                        item.payload.name,
                      ]}
                    />
                    <Bar dataKey="count" fill="#C5A059" radius={[0, 8, 8, 0]}>
                      {programDistribution.slice(0, 8).map((entry, index) => (
                        <Cell key={`cell-prog-${index}`} fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Qualification Level Donut Chart */}
            <div className="lg:col-span-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <PieChartIcon className="w-4 h-4 text-[#C5A059]" />
                <span>Conferral by Academic Degree Level</span>
              </h4>
              <div className="h-80 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={qualificationLevelDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={4}
                    >
                      {qualificationLevelDistribution.map((entry, index) => (
                        <Cell key={`cell-lvl-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#001A4D',
                        borderColor: '#C5A059',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(val: any, name: any, item: any) => [
                        `${val} Graduates (${item.payload.percentage}%)`,
                        `${item.payload.name} Degree`,
                      ]}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Academic Degree Level Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4 border-t border-slate-100">
            {qualificationLevelDistribution.map((lvl) => (
              <div
                key={lvl.name}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: lvl.color }}
                  />
                  <span className="font-bold text-slate-400 text-[10px] uppercase">
                    {lvl.percentage}% Share
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-sm mt-1">{lvl.name} Level</div>
                <div className="text-base font-black font-display text-[#002366]">{lvl.value} Conferred</div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION D: COMPLETE DETAILED TABULAR AUDIT */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-base font-bold font-display text-[#002366] flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#C5A059]" />
                <span>Detailed Program Distribution Matrix</span>
              </h4>
              <p className="text-xs text-slate-500">
                Official academic programs catalog with verified graduate counts and percentage share.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong>{programDistribution.length}</strong> Program Categories
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#002366] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Academic Program Title</th>
                  <th className="py-3 px-4">Primary Level</th>
                  <th className="py-3 px-4 text-center">Graduates Count</th>
                  <th className="py-3 px-4 text-right">Cohort Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {programDistribution.map((prog, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {prog.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                        {prog.name.includes('Doctor') || prog.name.includes('Ph.D')
                          ? 'Doctorate'
                          : prog.name.includes('Master')
                          ? "Master's"
                          : prog.name.includes('Bachelor')
                          ? "Bachelor's"
                          : 'Diploma / Certificate'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#002366]">
                      {prog.count}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-600">
                      {prog.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
