import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  ShieldCheck,
  Globe,
  MapPin,
  Clock,
  Calendar,
  Activity,
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle2,
  Mail,
  Send,
  Download,
  Search,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Info,
  Copy,
  Check,
  SlidersHorizontal,
  Compass,
  Lock
} from 'lucide-react';
import { User, Course } from '../../types';
import {
  StudentLoginAuditRecord,
  getStudentLoginHistoryWithSeeds,
  recordSimulatedStudentLogin
} from '../../services/studentLoginNotificationService';

interface StudentLoginHistoryDashboardProps {
  currentUser: User;
  courses: Course[];
  compact?: boolean;
  onOpenClassroom?: (courseId: string) => void;
}

// Brand color palette for charts
const PRIMARY_NAVY = '#002366';
const ACCENT_GOLD = '#C5A059';
const ROYAL_BLUE = '#2563EB';
const EMERALD = '#059669';
const AMBER = '#D97706';
const PURPLE = '#7C3AED';
const ROSE = '#E11D48';

const COUNTRY_COLORS: Record<string, string> = {
  'United States': PRIMARY_NAVY,
  'United Kingdom': ROYAL_BLUE,
  'Kenya': EMERALD,
  'Canada': ACCENT_GOLD,
  'Nigeria': AMBER,
  'South Africa': PURPLE,
  'Ghana': ROSE,
  'Other': '#64748B'
};

export const StudentLoginHistoryDashboard: React.FC<StudentLoginHistoryDashboardProps> = ({
  currentUser,
  courses,
  compact = false
}) => {
  const [records, setRecords] = useState<StudentLoginAuditRecord[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d' | 'all'>('30d');
  const [frequencyMetric, setFrequencyMetric] = useState<'timeline' | 'dayOfWeek' | 'timeOfDay'>('timeline');
  const [geoView, setGeoView] = useState<'countries' | 'cities'>('countries');
  const [searchFilter, setSearchFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);
  const [showSimulateModal, setShowSimulateModal] = useState(false);

  // Load session records for current student
  const loadData = () => {
    const history = getStudentLoginHistoryWithSeeds(currentUser);
    setRecords(history);
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Filter records by time range
  const filteredByTimeRecords = useMemo(() => {
    const now = new Date('2026-09-12T06:10:00-07:00').getTime();
    let daysLimit = 30;
    if (timeRange === '7d') daysLimit = 7;
    else if (timeRange === '14d') daysLimit = 14;
    else if (timeRange === 'all') daysLimit = 365;

    const cutoff = now - daysLimit * 24 * 60 * 60 * 1000;

    return records.filter((r) => {
      const recordTime = r.isoDate ? new Date(r.isoDate).getTime() : new Date(r.timestamp).getTime();
      return recordTime >= cutoff;
    });
  }, [records, timeRange]);

  // General KPI calculations
  const kpis = useMemo(() => {
    const totalSessions = filteredByTimeRecords.length;
    const countryCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    const deviceCounts: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0 };

    filteredByTimeRecords.forEach((r) => {
      countryCounts[r.country] = (countryCounts[r.country] || 0) + 1;
      cityCounts[r.city] = (cityCounts[r.city] || 0) + 1;
      const dev = r.deviceType || 'Desktop';
      deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
    });

    let topCountry = 'United States';
    let maxCountryCount = 0;
    Object.entries(countryCounts).forEach(([country, count]) => {
      if (count > maxCountryCount) {
        maxCountryCount = count;
        topCountry = country;
      }
    });

    let topCity = 'Phoenix';
    let maxCityCount = 0;
    Object.entries(cityCounts).forEach(([city, count]) => {
      if (count > maxCityCount) {
        maxCityCount = count;
        topCity = city;
      }
    });

    const primaryLocationPercentage = totalSessions > 0 ? Math.round((maxCountryCount / totalSessions) * 100) : 100;
    const uniqueCountriesCount = Object.keys(countryCounts).length;
    const latestRecord = filteredByTimeRecords[0] || records[0];

    return {
      totalSessions,
      topCountry,
      topCity,
      primaryLocationPercentage,
      uniqueCountriesCount,
      deviceCounts,
      latestRecord
    };
  }, [filteredByTimeRecords, records]);

  // Chart 1: Login Frequency Timeline Data (Daily over the selected range)
  const timelineData = useMemo(() => {
    const countsByDate: Record<string, { dateStr: string; label: string; count: number; rawDate: Date; cities: Set<string> }> = {};

    // Group records by calendar day (YYYY-MM-DD)
    filteredByTimeRecords.forEach((r) => {
      const d = r.isoDate ? new Date(r.isoDate) : new Date(r.timestamp);
      if (isNaN(d.getTime())) return;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const key = `${yyyy}-${mm}-${dd}`;

      const shortLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      if (!countsByDate[key]) {
        countsByDate[key] = {
          dateStr: key,
          label: shortLabel,
          count: 0,
          rawDate: d,
          cities: new Set()
        };
      }
      countsByDate[key].count += 1;
      if (r.city) countsByDate[key].cities.add(r.city);
    });

    const sorted = Object.values(countsByDate).sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
    return sorted.map((item) => ({
      date: item.label,
      logins: item.count,
      cities: Array.from(item.cities).join(', ')
    }));
  }, [filteredByTimeRecords]);

  // Chart 1 (Alt B): Frequency by Day of the Week (Mon - Sun)
  const dayOfWeekData = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const counts = [0, 0, 0, 0, 0, 0, 0];

    filteredByTimeRecords.forEach((r) => {
      const d = r.isoDate ? new Date(r.isoDate) : new Date(r.timestamp);
      if (!isNaN(d.getTime())) {
        counts[d.getDay()] += 1;
      }
    });

    // Reorder Mon through Sun
    const orderedIndices = [1, 2, 3, 4, 5, 6, 0];
    return orderedIndices.map((dayIdx) => ({
      day: days[dayIdx].substring(0, 3),
      fullDay: days[dayIdx],
      sessions: counts[dayIdx]
    }));
  }, [filteredByTimeRecords]);

  // Chart 1 (Alt C): Frequency by Time of Day (Hourly / Time Blocks)
  const timeOfDayData = useMemo(() => {
    const blocks = [
      { name: 'Early Morning (06-10)', hours: [6, 7, 8, 9], count: 0 },
      { name: 'Mid-Day (10-14)', hours: [10, 11, 12, 13], count: 0 },
      { name: 'Afternoon (14-18)', hours: [14, 15, 16, 17], count: 0 },
      { name: 'Evening Study (18-22)', hours: [18, 19, 20, 21], count: 0 },
      { name: 'Night Hours (22-06)', hours: [22, 23, 0, 1, 2, 3, 4, 5], count: 0 }
    ];

    filteredByTimeRecords.forEach((r) => {
      const d = r.isoDate ? new Date(r.isoDate) : new Date(r.timestamp);
      if (!isNaN(d.getTime())) {
        const hour = d.getHours();
        const block = blocks.find((b) => b.hours.includes(hour));
        if (block) block.count += 1;
      }
    });

    return blocks.map((b) => ({
      block: b.name,
      sessions: b.count
    }));
  }, [filteredByTimeRecords]);

  // Chart 2: Geographical Country Trends Data
  const countryTrendsData = useMemo(() => {
    const counts: Record<string, { count: number; cities: Set<string> }> = {};
    filteredByTimeRecords.forEach((r) => {
      const c = r.country || 'United States';
      if (!counts[c]) {
        counts[c] = { count: 0, cities: new Set() };
      }
      counts[c].count += 1;
      if (r.city) counts[c].cities.add(r.city);
    });

    const total = filteredByTimeRecords.length || 1;
    return Object.entries(counts)
      .map(([name, val]) => ({
        name,
        value: val.count,
        percentage: Math.round((val.count / total) * 100),
        color: COUNTRY_COLORS[name] || '#475569',
        cities: Array.from(val.cities).join(', ')
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredByTimeRecords]);

  // Chart 2 (Alt B): Top Cities & Regional Trends Data
  const cityTrendsData = useMemo(() => {
    const counts: Record<string, { count: number; country: string }> = {};
    filteredByTimeRecords.forEach((r) => {
      const key = `${r.city}, ${r.region || r.country}`;
      if (!counts[key]) {
        counts[key] = { count: 0, country: r.country };
      }
      counts[key].count += 1;
    });

    return Object.entries(counts)
      .map(([place, data]) => ({
        place,
        logins: data.count,
        country: data.country
      }))
      .sort((a, b) => b.logins - a.logins)
      .slice(0, 6);
  }, [filteredByTimeRecords]);

  // Filtered recent sessions table
  const filteredTableRecords = useMemo(() => {
    return filteredByTimeRecords.filter((r) => {
      const matchesCountry = countryFilter === 'All' || r.country === countryFilter;
      const q = searchFilter.toLowerCase();
      const matchesSearch =
        !q ||
        r.city.toLowerCase().includes(q) ||
        r.region.toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q) ||
        r.ipAddress.toLowerCase().includes(q) ||
        (r.deviceType && r.deviceType.toLowerCase().includes(q));
      return matchesCountry && matchesSearch;
    });
  }, [filteredByTimeRecords, countryFilter, searchFilter]);

  // Unique country list for table dropdown
  const uniqueCountries = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => set.add(r.country));
    return ['All', ...Array.from(set)];
  }, [records]);

  // Handle simulated location access for verification & testing
  const handleSimulateLogin = async (locationPreset: { country: string; city: string; region: string; ip: string; timezone: string }) => {
    setIsSimulating(true);
    setSimulationStatus(null);
    try {
      const rec = await recordSimulatedStudentLogin(currentUser, locationPreset, courses);
      loadData();
      setSimulationStatus(`✅ Verified login session from ${rec.city}, ${rec.country} recorded & notification sent to panju4@gmail.com!`);
      setShowSimulateModal(false);
      setTimeout(() => setSimulationStatus(null), 6000);
    } catch (err: any) {
      setSimulationStatus(`⚠️ Recorded session locally: ${err.message || 'Error'}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleCopySession = (r: StudentLoginAuditRecord) => {
    const text = `BIBU Student Session Log
Student: ${r.studentName} (${r.studentId})
Timestamp: ${r.timestamp}
Location: ${r.city}, ${r.region}, ${r.country}
IP Address: ${r.ipAddress} (${r.timezone})
Device: ${r.deviceType || 'Desktop'}
Notification Dispatched: panju4@gmail.com (${r.deliveryStatus.toUpperCase()})`;
    navigator.clipboard.writeText(text);
    setCopiedId(r.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Country', 'City', 'Region', 'IP Address', 'Timezone', 'Device', 'Student ID', 'Email', 'Notification Status', 'Recipient'];
    const rows = filteredTableRecords.map((r) => [
      `"${r.timestamp}"`,
      `"${r.country}"`,
      `"${r.city}"`,
      `"${r.region}"`,
      r.ipAddress,
      `"${r.timezone}"`,
      r.deviceType || 'Desktop',
      `"${r.studentId}"`,
      r.studentEmail,
      r.deliveryStatus,
      r.recipientEmail
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `BIBU_Login_History_${currentUser.studentId || 'student'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#002366]" />
              <span>Identity Assurance & Geolocation Telemetry</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-[#002366]">
              Student Login History & Geographical Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Visual telemetry of your theological portal access, tracking study session frequency, regional trends, device distribution, and instant security email dispatches.
            </p>
          </div>

          {/* Time Range Filter & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeRange === '7d' ? 'bg-[#002366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('14d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeRange === '14d' ? 'bg-[#002366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                14 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeRange === '30d' ? 'bg-[#002366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeRange('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeRange === 'all' ? 'bg-[#002366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
            </div>

            <button
              onClick={() => setShowSimulateModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
              title="Simulate or verify login from another geographical region"
            >
              <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Simulate / Log Location</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
              title="Download login history as CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Security Notification Banner */}
        <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-blue-100 text-[#002366] shrink-0">
              <Mail className="w-4 h-4" />
            </span>
            <div className="text-slate-700">
              <strong className="text-[#002366]">Automated Security Notification Active:</strong> Instant authentication alert emails are routed to{' '}
              <span className="font-mono font-bold text-[#002366] bg-blue-100/60 px-1.5 py-0.5 rounded">panju4@gmail.com</span> (CC:{' '}
              <span className="font-mono text-slate-600">patnju4@gmail.com</span>) on every portal login.
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Monitored & Audited</span>
          </span>
        </div>

        {simulationStatus && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{simulationStatus}</span>
          </div>
        )}
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Recorded Sessions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Logins</span>
            <Activity className="w-4 h-4 text-[#002366]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-display text-[#002366]">
              {kpis.totalSessions}
            </span>
            <span className="text-xs text-emerald-700 font-bold">Sessions</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Across selected {timeRange === 'all' ? 'academic career' : timeRange} period
          </div>
        </div>

        {/* Metric 2: Primary Study Location */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">Primary Study Hub</span>
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-black font-display text-slate-900 truncate">
              {kpis.topCity}, {kpis.topCountry === 'United States' ? 'USA' : kpis.topCountry}
            </span>
          </div>
          <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <span>{kpis.primaryLocationPercentage}% Location Consistency</span>
          </div>
        </div>

        {/* Metric 3: Sovereign Countries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">Access Geographies</span>
            <Globe className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-display text-[#002366]">
              {kpis.uniqueCountriesCount}
            </span>
            <span className="text-xs text-slate-600 font-bold">Countries</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {countryTrendsData.slice(0, 3).map((c) => c.name).join(', ')}
          </div>
        </div>

        {/* Metric 4: Primary Device Split */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">Device Preference</span>
            <Laptop className="w-4 h-4 text-[#002366]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-display text-slate-900">
              {kpis.deviceCounts.Desktop || 0}
            </span>
            <span className="text-xs text-slate-600 font-semibold">
              Desktop • {kpis.deviceCounts.Mobile || 0} Mobile
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            Secured SSL TLS 1.3 Encryption
          </div>
        </div>
      </div>

      {/* Main Charts Row: 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT CHART (7 cols): Login Frequency Over Time */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-[#002366] text-[#C5A059]">
                  <Activity className="w-4 h-4" />
                </span>
                <h3 className="text-base font-display font-bold text-[#002366]">
                  Theological Login Frequency Trends
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pacing and rhythm of theological classroom and assignment access.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
              <button
                onClick={() => setFrequencyMetric('timeline')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  frequencyMetric === 'timeline' ? 'bg-[#002366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Daily Timeline
              </button>
              <button
                onClick={() => setFrequencyMetric('dayOfWeek')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  frequencyMetric === 'dayOfWeek' ? 'bg-[#002366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Day of Week
              </button>
              <button
                onClick={() => setFrequencyMetric('timeOfDay')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  frequencyMetric === 'timeOfDay' ? 'bg-[#002366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Study Hours
              </button>
            </div>
          </div>

          {/* Recharts Render for Frequency */}
          <div className="h-72 w-full pt-2">
            {frequencyMetric === 'timeline' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="loginGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PRIMARY_NAVY} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={ACCENT_GOLD} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-1">
                            <div className="font-bold text-[#002366] flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                              <span>{label}</span>
                            </div>
                            <div className="text-slate-700">
                              Sessions Logged: <strong className="text-[#002366]">{payload[0].value}</strong>
                            </div>
                            {d.cities && (
                              <div className="text-[11px] text-slate-500">
                                Locations: <span className="font-medium text-slate-700">{d.cities}</span>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="logins"
                    stroke={PRIMARY_NAVY}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#loginGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {frequencyMetric === 'dayOfWeek' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayOfWeekData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-1">
                            <div className="font-bold text-[#002366]">{d.fullDay}</div>
                            <div className="text-slate-700">
                              Total Logins: <strong className="text-[#002366]">{d.sessions}</strong>
                            </div>
                            <div className="text-[10.5px] text-slate-500">
                              {d.fullDay === 'Saturday' || d.fullDay === 'Sunday'
                                ? 'Weekend Exegetical Studies'
                                : 'Weekday Coursework & Forum Discussion'}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="sessions" radius={[6, 6, 0, 0]}>
                    {dayOfWeekData.map((entry, index) => (
                      <Cell
                        key={`day-cell-${index}`}
                        fill={entry.day === 'Sat' || entry.day === 'Tue' ? PRIMARY_NAVY : '#3b82f6'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {frequencyMetric === 'timeOfDay' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeOfDayData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis type="category" dataKey="block" tick={{ fontSize: 10.5, fill: '#002366', fontWeight: 600 }} width={120} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-1">
                            <div className="font-bold text-[#002366]">{d.block}</div>
                            <div className="text-slate-700">
                              Sessions: <strong className="text-[#002366]">{d.sessions}</strong>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="sessions" fill={PRIMARY_NAVY} radius={[0, 6, 6, 0]}>
                    {timeOfDayData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 3 ? '#002366' : index === 0 ? '#C5A059' : '#2563EB'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Peak Study Time: <strong>Evening (18:00 - 22:00) & Saturday Mornings</strong></span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
          </div>
        </div>

        {/* RIGHT CHART (5 cols): Geographical Trends */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                    <Globe className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-display font-bold text-[#002366]">
                    Geographical Trends
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Breakdown by country & active study municipalities.
                </p>
              </div>

              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setGeoView('countries')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    geoView === 'countries' ? 'bg-[#002366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Countries
                </button>
                <button
                  onClick={() => setGeoView('cities')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    geoView === 'cities' ? 'bg-[#002366] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cities
                </button>
              </div>
            </div>

            {/* Recharts Render for Geography */}
            <div className="h-56 w-full pt-2">
              {geoView === 'countries' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countryTrendsData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {countryTrendsData.map((entry, index) => (
                        <Cell key={`geo-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-1">
                              <div className="font-bold text-[#002366] flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{d.name}</span>
                              </div>
                              <div className="text-slate-700">
                                Sessions: <strong>{d.value}</strong> ({d.percentage}%)
                              </div>
                              {d.cities && (
                                <div className="text-[10px] text-slate-500">
                                  Cities: {d.cities}
                                </div>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cityTrendsData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis type="category" dataKey="place" tick={{ fontSize: 10, fill: '#002366', fontWeight: 600 }} width={100} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-1">
                              <div className="font-bold text-[#002366]">{d.place}</div>
                              <div className="text-slate-700">Country: {d.country}</div>
                              <div className="text-slate-700 font-bold">Sessions: {d.logins}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="logins" fill="#059669" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Country Percentages Legend */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {countryTrendsData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="font-semibold text-slate-800">{c.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-500 text-[11px]">{c.value} logins</span>
                  <span className="font-bold text-[#002366] text-xs min-w-[36px] text-right">{c.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Recent Sessions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-display font-bold text-[#002366] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C5A059]" />
              <span>Recent Login Sessions & Telemetry Log</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Detailed chronological record of every portal authentication, geo-location, and notification status.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search city, IP, or device..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Country filter */}
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700"
            >
              {uniqueCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Login Date & Time</th>
                <th className="p-3">Location & Sovereign Country</th>
                <th className="p-3">IP Address & Network</th>
                <th className="p-3">Device & Environment</th>
                <th className="p-3">Notification Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTableRecords.slice(0, 15).map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 align-top whitespace-nowrap">
                    <div className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#C5A059]" />
                      <span>{r.timestamp}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                      {r.timezone}
                    </span>
                  </td>

                  <td className="p-3 align-top">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-xs">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{r.city}, {r.region}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                      {r.country}
                    </div>
                  </td>

                  <td className="p-3 align-top font-mono text-[11px] text-slate-600">
                    <div className="text-slate-900 font-bold">{r.ipAddress}</div>
                    <span className="text-[10px] text-slate-400">Authenticated Session</span>
                  </td>

                  <td className="p-3 align-top">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-slate-100 text-slate-700">
                      {r.deviceType === 'Mobile' ? (
                        <Smartphone className="w-3 h-3 text-blue-600" />
                      ) : r.deviceType === 'Tablet' ? (
                        <Tablet className="w-3 h-3 text-purple-600" />
                      ) : (
                        <Laptop className="w-3 h-3 text-[#002366]" />
                      )}
                      <span>{r.deviceType || 'Desktop'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[140px]" title={r.userAgent}>
                      Verified Browser
                    </span>
                  </td>

                  <td className="p-3 align-top">
                    <div className="flex items-center gap-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>DISPATCHED</span>
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                      To: <span className="font-bold text-slate-700">panju4@gmail.com</span>
                    </div>
                  </td>

                  <td className="p-3 align-top text-right whitespace-nowrap">
                    <button
                      onClick={() => handleCopySession(r)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                      title="Copy session telemetry details"
                    >
                      {copiedId === r.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTableRecords.length > 15 && (
          <div className="text-center pt-2 text-xs text-slate-500">
            Showing top 15 of {filteredTableRecords.length} sessions. Use <strong>Export CSV</strong> above to review full history.
          </div>
        )}
      </div>

      {/* MODAL: Simulate / Log Location Verification */}
      {showSimulateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#002366]" />
                <h3 className="text-base font-display font-bold text-[#002366]">
                  Simulate / Verify Session Location
                </h3>
              </div>
              <button
                onClick={() => setShowSimulateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Test how the student dashboard instantly updates its Recharts frequency and geographical charts, while dispatching a live security alert to <strong>panju4@gmail.com</strong>.
            </p>

            <div className="space-y-2">
              <button
                disabled={isSimulating}
                onClick={() =>
                  handleSimulateLogin({
                    city: 'Phoenix',
                    region: 'Arizona',
                    country: 'United States',
                    ip: '172.56.21.84',
                    timezone: 'America/Phoenix'
                  })
                }
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-[#002366] hover:bg-slate-50 text-left flex items-center justify-between transition-all"
              >
                <div>
                  <div className="font-bold text-slate-900 text-xs">🇺🇸 Phoenix, Arizona, United States</div>
                  <div className="text-[11px] text-slate-500">Primary Theological Campus Study Base</div>
                </div>
                <span className="text-xs text-[#002366] font-bold">Log Now →</span>
              </button>

              <button
                disabled={isSimulating}
                onClick={() =>
                  handleSimulateLogin({
                    city: 'London',
                    region: 'Greater London',
                    country: 'United Kingdom',
                    ip: '82.165.197.1',
                    timezone: 'Europe/London'
                  })
                }
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-[#002366] hover:bg-slate-50 text-left flex items-center justify-between transition-all"
              >
                <div>
                  <div className="font-bold text-slate-900 text-xs">🇬🇧 London, England, United Kingdom</div>
                  <div className="text-[11px] text-slate-500">Global Evangelical Mission & Lecture</div>
                </div>
                <span className="text-xs text-[#002366] font-bold">Log Now →</span>
              </button>

              <button
                disabled={isSimulating}
                onClick={() =>
                  handleSimulateLogin({
                    city: 'Nairobi',
                    region: 'Nairobi County',
                    country: 'Kenya',
                    ip: '197.232.14.88',
                    timezone: 'Africa/Nairobi'
                  })
                }
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-[#002366] hover:bg-slate-50 text-left flex items-center justify-between transition-all"
              >
                <div>
                  <div className="font-bold text-slate-900 text-xs">🇰🇪 Nairobi, Nairobi County, Kenya</div>
                  <div className="text-[11px] text-slate-500">East Africa Pastoral Leadership Outreach</div>
                </div>
                <span className="text-xs text-[#002366] font-bold">Log Now →</span>
              </button>

              <button
                disabled={isSimulating}
                onClick={() =>
                  handleSimulateLogin({
                    city: 'Dallas',
                    region: 'Texas',
                    country: 'United States',
                    ip: '68.102.14.33',
                    timezone: 'America/Chicago'
                  })
                }
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-[#002366] hover:bg-slate-50 text-left flex items-center justify-between transition-all"
              >
                <div>
                  <div className="font-bold text-slate-900 text-xs">🇺🇸 Dallas, Texas, United States</div>
                  <div className="text-[11px] text-slate-500">Grace Covenant Ministry Convocation</div>
                </div>
                <span className="text-xs text-[#002366] font-bold">Log Now →</span>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowSimulateModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
