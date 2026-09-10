import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserCog,
  Layers,
  FolderTree,
  BookOpenCheck,
  FileCheck,
  Activity,
  Award,
  GraduationCap,
  FileSpreadsheet,
  Briefcase,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  ExternalLink,
  PlusCircle,
  Calendar,
  CheckCircle2,
  XCircle,
  MapPin,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
import { AdminNavigationItem } from '../../types/admin';

interface DashboardStats {
  totalStudents: number;
  pastStudents: number;
  lecturers: number;
  schools: number;
  departments: number;
  programs: number;
  activeEnrollments: number;
  coursesInProgress: number;
  pendingHonorary: number;
  graduates: number;
  examCandidates: number;
  rplCandidates: number;
}

interface AdminDashboardOverviewProps {
  stats: DashboardStats;
  onNavigate: (item: AdminNavigationItem) => void;
  adminName: string;
  adminRole: string;
  campus: string;
}

// Chart Data: Monthly Student Enrollment Trends
const MONTHLY_ENROLLMENT_DATA = [
  { month: 'Oct 25', degree: 48, diploma: 22, rpl: 12, total: 82 },
  { month: 'Nov 25', degree: 55, diploma: 26, rpl: 15, total: 96 },
  { month: 'Dec 25', degree: 68, diploma: 30, rpl: 16, total: 114 },
  { month: 'Jan 26', degree: 110, diploma: 48, rpl: 30, total: 188 },
  { month: 'Feb 26', degree: 84, diploma: 38, rpl: 20, total: 142 },
  { month: 'Mar 26', degree: 76, diploma: 34, rpl: 18, total: 128 },
  { month: 'Apr 26', degree: 80, diploma: 36, rpl: 19, total: 135 },
  { month: 'May 26', degree: 95, diploma: 42, rpl: 23, total: 160 },
  { month: 'Jun 26', degree: 88, diploma: 37, rpl: 20, total: 145 },
  { month: 'Jul 26', degree: 92, diploma: 39, rpl: 21, total: 152 },
  { month: 'Aug 26', degree: 118, diploma: 50, rpl: 27, total: 195 },
  { month: 'Sep 26', degree: 126, diploma: 54, rpl: 30, total: 210 }
];

// Chart Data: Honorary Application Submissions by Status & Degree
const HONORARY_SUBMISSION_DATA = [
  {
    period: 'Q4 2025',
    Submitted: 3,
    'Under Review': 4,
    Approved: 5,
    Rejected: 1
  },
  {
    period: 'Q1 2026',
    Submitted: 5,
    'Under Review': 6,
    Approved: 7,
    Rejected: 2
  },
  {
    period: 'Q2 2026',
    Submitted: 8,
    'Under Review': 7,
    Approved: 8,
    Rejected: 2
  },
  {
    period: 'Q3 2026',
    Submitted: 11,
    'Under Review': 8,
    Approved: 10,
    Rejected: 3
  }
];

const HONORARY_DEGREE_PIE_DATA = [
  { name: 'Doctor of Divinity (D.D.)', value: 18, color: '#C5A059' },
  { name: 'Doctor of Humane Letters (D.H.L.)', value: 11, color: '#002366' },
  { name: 'Doctor of Sacred Theology (S.T.D.)', value: 7, color: '#10B981' }
];

// Chart Data: Active Examination Center Activity by Regional Hub
const EXAM_CENTER_ACTIVITY_DATA = [
  {
    hub: 'Kenya 47 Counties',
    centers: 98,
    candidates: 840,
    attendanceRate: 98
  },
  {
    hub: 'USA & North America',
    centers: 12,
    candidates: 192,
    attendanceRate: 99
  },
  {
    hub: 'Ghana & W. Africa',
    centers: 18,
    candidates: 264,
    attendanceRate: 96
  },
  {
    hub: 'UK & Diaspora',
    centers: 8,
    candidates: 114,
    attendanceRate: 98
  },
  {
    hub: 'South Africa & SADC',
    centers: 14,
    candidates: 178,
    attendanceRate: 95
  }
];

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  stats,
  onNavigate,
  adminName,
  adminRole,
  campus
}) => {
  const [enrollmentTimeframe, setEnrollmentTimeframe] = useState<'12m' | '6m'>('12m');
  const [examMetric, setExamMetric] = useState<'candidates' | 'centers'>('candidates');

  const displayedEnrollmentData =
    enrollmentTimeframe === '6m'
      ? MONTHLY_ENROLLMENT_DATA.slice(-6)
      : MONTHLY_ENROLLMENT_DATA;

  // 12 Required KPI Cards with direct click navigation
  const kpiCards: {
    title: string;
    value: number;
    targetNav: AdminNavigationItem;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    sublabel: string;
  }[] = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      targetNav: 'students',
      icon: Users,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      sublabel: 'Active SIS Database'
    },
    {
      title: 'Past Students',
      value: stats.pastStudents,
      targetNav: 'past-students',
      icon: UserCheck,
      color: 'text-slate-600 bg-slate-50 border-slate-200',
      sublabel: 'Alumni & Completed Cohorts'
    },
    {
      title: 'Lecturers',
      value: stats.lecturers,
      targetNav: 'lecturers',
      icon: UserCog,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      sublabel: 'Appointed Academic Faculty'
    },
    {
      title: 'Schools',
      value: stats.schools,
      targetNav: 'schools',
      icon: Layers,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      sublabel: 'Faculties with Deans'
    },
    {
      title: 'Departments',
      value: stats.departments,
      targetNav: 'departments',
      icon: FolderTree,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      sublabel: 'Under Academic Schools'
    },
    {
      title: 'Programs',
      value: stats.programs,
      targetNav: 'programs',
      icon: BookOpenCheck,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      sublabel: 'Degree & RPL Catalogs'
    },
    {
      title: 'Active Enrollments',
      value: stats.activeEnrollments,
      targetNav: 'enrollments',
      icon: FileCheck,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
      sublabel: 'Current Academic Intake'
    },
    {
      title: 'Courses in Progress',
      value: stats.coursesInProgress,
      targetNav: 'courses-in-progress',
      icon: Activity,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
      sublabel: 'Active Student Progressions'
    },
    {
      title: 'Pending Honorary Applications',
      value: stats.pendingHonorary,
      targetNav: 'honorary-applications',
      icon: Award,
      color: 'text-amber-700 bg-amber-100 border-amber-300',
      sublabel: 'Senate Adjudication'
    },
    {
      title: 'Graduates',
      value: stats.graduates,
      targetNav: 'graduates-list',
      icon: GraduationCap,
      color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      sublabel: 'Degrees Conferred'
    },
    {
      title: 'Examination Candidates',
      value: stats.examCandidates,
      targetNav: 'exam-candidates',
      icon: FileSpreadsheet,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      sublabel: 'Registered at Global Centers'
    },
    {
      title: 'RPL Candidates',
      value: stats.rplCandidates,
      targetNav: 'rpl-candidates',
      icon: Briefcase,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      sublabel: 'Prior Learning Portfolios'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner with BIBU Branding */}
      <div className="bg-gradient-to-r from-[#002366] via-[#001845] to-[#00102e] rounded-2xl p-6 sm:p-8 text-white border-2 border-[#C5A059] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Central Academic & Administrative Command</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              Welcome, {adminName}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Serving as <strong className="text-[#C5A059]">{adminRole}</strong> at <strong>{campus}</strong>. Overseeing global theological faculties, ministerial accreditations, examinations, and degree conferrals.
            </p>
          </div>

          {/* Quick Action Matrix */}
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('honorary-applications')}
              className="px-3.5 py-2 rounded-xl bg-[#C5A059] hover:bg-[#b38e47] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
            >
              <Award className="w-4 h-4" />
              <span>Review Honorary ({stats.pendingHonorary})</span>
            </button>

            <button
              onClick={() => onNavigate('students')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-[#C5A059]" />
              <span>Manage Students</span>
            </button>

            <button
              onClick={() => onNavigate('enrollments')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 transition-all"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Enrollments Workflow</span>
            </button>
          </div>
        </div>
      </div>

      {/* 12 Clickable KPI Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Live University Operational Metrics (Click card to inspect & manage):
          </h3>
          <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ● Real-Time Database State Connected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                type="button"
                onClick={() => onNavigate(card.targetNav)}
                className="bg-white rounded-xl p-4 border border-slate-200 hover:border-[#C5A059] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg border ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono group-hover:text-[#002366] transition-colors flex items-center gap-0.5">
                    <span>Manage</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-display font-black text-[#002366] tracking-tight">
                    {card.value.toLocaleString()}
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5 truncate">
                    {card.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {card.sublabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* VISUAL ANALYTICS SECTION: RECHARTS DASHBOARD OVERVIEW */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider">
              <BarChart3 className="w-4 h-4" />
              <span>University Intelligence & Trajectory</span>
            </div>
            <h3 className="text-lg font-display font-black text-[#002366]">
              Institutional Performance Visualizations
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Synced with Academic Registrar & Examination Boards
          </span>
        </div>

        {/* 1. Monthly Student Enrollment Trends (Full-Width Area Chart) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#002366]" />
                <h4 className="text-sm font-bold text-[#002366] tracking-tight">
                  Monthly Student Enrollment Trends
                </h4>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                New admissions progression across Degree, Diploma/Certificate, and RPL pathways.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-medium">
                <button
                  onClick={() => setEnrollmentTimeframe('6m')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    enrollmentTimeframe === '6m'
                      ? 'bg-[#002366] text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Last 6 Months
                </button>
                <button
                  onClick={() => setEnrollmentTimeframe('12m')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    enrollmentTimeframe === '12m'
                      ? 'bg-[#002366] text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Full 12 Months
                </button>
              </div>

              <button
                onClick={() => onNavigate('enrollments')}
                className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1 transition-colors"
              >
                <span>View Registry</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Key Trend Statistics Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Peak Monthly Intake</span>
              <span className="text-lg font-bold text-[#002366]">210 Students</span>
              <span className="text-[10px] text-emerald-600 font-medium block">Sep 2026 Cohort</span>
            </div>
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
              <span className="text-[11px] text-blue-700 block">Degree Programs</span>
              <span className="text-lg font-bold text-blue-950">1,082 (63.8%)</span>
              <span className="text-[10px] text-blue-600 font-medium block">B.Th, M.Div, D.Min</span>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
              <span className="text-[11px] text-amber-800 block">Diplomas & Certificates</span>
              <span className="text-lg font-bold text-amber-950">464 (27.4%)</span>
              <span className="text-[10px] text-amber-700 font-medium block">Practical Ministry</span>
            </div>
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200">
              <span className="text-[11px] text-indigo-700 block">RPL Portfolios</span>
              <span className="text-lg font-bold text-indigo-950">250 (8.8%)</span>
              <span className="text-[10px] text-indigo-600 font-medium block">Pastoral Recognition</span>
            </div>
          </div>

          {/* Recharts Area Visualization */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayedEnrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDegree" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#002366" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#002366" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorDiploma" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorRpl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E2E8F0',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(val: any, name: any) => {
                    const labelMap: Record<string, string> = {
                      degree: 'Degree Candidates',
                      diploma: 'Diplomas/Certificates',
                      rpl: 'RPL Prior Learning'
                    };
                    return [val, labelMap[name] || name];
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      degree: 'Degree Cohorts',
                      diploma: 'Diploma/Certificate',
                      rpl: 'RPL Assessment Track'
                    };
                    return labels[value] || value;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="degree"
                  stroke="#002366"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorDegree)"
                />
                <Area
                  type="monotone"
                  dataKey="diploma"
                  stroke="#C5A059"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDiploma)"
                />
                <Area
                  type="monotone"
                  dataKey="rpl"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRpl)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2 & 3: Honorary Submissions & Active Exam Center Activity (2-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 2: Honorary Application Submission Volume */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C5A059]" />
                  <h4 className="text-sm font-bold text-[#002366] tracking-tight">
                    Honorary Application Submission Volume
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quarterly nomination intake & Senate review status distribution.
                </p>
              </div>

              <button
                onClick={() => onNavigate('honorary-applications')}
                className="px-3 py-1.5 rounded-lg border border-[#C5A059]/40 bg-amber-50 hover:bg-amber-100/70 text-[#002366] text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
              >
                <span>Senate Review</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </button>
            </div>

            {/* Quick Status Legend Cards */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">Submitted</span>
                <span className="text-sm font-black text-blue-900">11 Dossiers</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Under Review</span>
                <span className="text-sm font-black text-amber-900">8 Dossiers</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Approved</span>
                <span className="text-sm font-black text-emerald-900">10 Conferred</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-200">
                <span className="text-[10px] font-bold text-rose-800 uppercase block">Rejected</span>
                <span className="text-sm font-black text-rose-900">3 Declined</span>
              </div>
            </div>

            {/* Recharts Bar Chart: Honorary Submissions */}
            <div className="h-64 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HONORARY_SUBMISSION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      borderColor: '#E2E8F0',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Bar dataKey="Submitted" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Under Review" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Approved" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Rejected" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Active Examination Center Activity */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-sm font-bold text-[#002366] tracking-tight">
                    Active Examination Center Activity
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Candidate volume & physical proctored centers by hub.
                </p>
              </div>

              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-[11px]">
                <button
                  onClick={() => setExamMetric('candidates')}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    examMetric === 'candidates' ? 'bg-[#002366] text-white' : 'text-slate-600'
                  }`}
                >
                  Candidates
                </button>
                <button
                  onClick={() => setExamMetric('centers')}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    examMetric === 'centers' ? 'bg-[#002366] text-white' : 'text-slate-600'
                  }`}
                >
                  Centers
                </button>
              </div>
            </div>

            {/* Regional Hub Activity Bar Chart */}
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={EXAM_CENTER_ACTIVITY_DATA}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} />
                  <YAxis
                    dataKey="hub"
                    type="category"
                    tick={{ fontSize: 10, fill: '#1E293B', fontWeight: 600 }}
                    tickLine={false}
                    width={105}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      borderColor: '#E2E8F0',
                      fontSize: '11px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(val: any) => [
                      examMetric === 'candidates' ? `${val} Seated Candidates` : `${val} Exam Centers`,
                      examMetric === 'candidates' ? 'Candidates' : 'Proctored Centers'
                    ]}
                  />
                  <Bar
                    dataKey={examMetric}
                    fill="#002366"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Center Summary Banner */}
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-950 block">Kenya 47 Counties Lead: 98 Centers</span>
                  <span className="text-[11px] text-emerald-700">840 proctored examination candidates</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('exam-centers')}
                className="text-[11px] font-bold text-emerald-800 underline hover:text-emerald-950"
              >
                Inspect
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launchpad & Academic Pipeline (Bottom Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Core Administrative Links */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold text-[#002366] uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#C5A059]" />
              <span>Administrative Operations</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Quick Access</span>
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs">
            <button
              onClick={() => onNavigate('honorary-applications')}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 flex items-center justify-between transition-colors text-left"
            >
              <div>
                <span className="font-bold text-[#002366] block">Honorary Doctorate Adjudication</span>
                <span className="text-[11px] text-slate-500">Nomination reviews, citations, award letters</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            </button>

            <button
              onClick={() => onNavigate('schools')}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 flex items-center justify-between transition-colors text-left"
            >
              <div>
                <span className="font-bold text-[#002366] block">Academic Schools & Deans</span>
                <span className="text-[11px] text-slate-500">CRUD schools, faculty appointments</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#002366]" />
            </button>

            <button
              onClick={() => onNavigate('campuses')}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 flex items-center justify-between transition-colors text-left"
            >
              <div>
                <span className="font-bold text-[#002366] block">Global Campuses & National Centers</span>
                <span className="text-[11px] text-slate-500">Phoenix, Nairobi, Kampala, London, Accra</span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </button>

            <button
              onClick={() => onNavigate('transcripts')}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 flex items-center justify-between transition-colors text-left"
            >
              <div>
                <span className="font-bold text-[#002366] block">Official Academic Transcripts</span>
                <span className="text-[11px] text-slate-500">GPA calculation, digital seal, export</span>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-600" />
            </button>
          </div>
        </div>

        {/* Global Examination Centers & 47 Kenya Counties */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold text-[#002366] uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#C5A059]" />
              <span>Examination Network</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">98 Centers</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
              <span className="font-bold text-blue-900 block">Kenya 47 Counties Hub</span>
              <p className="text-[11px] text-blue-700 mt-0.5">
                Managed under National Representative Rt. Rev. Dr. Patrick M. Njuguna with 98 active examination centers.
              </p>
              <button
                onClick={() => onNavigate('exam-centers')}
                className="mt-2 text-[11px] font-bold text-blue-800 underline flex items-center gap-1"
              >
                <span>Open Examination Center Directory</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={() => onNavigate('exam-candidates')}
              className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left"
            >
              <div>
                <span className="font-bold text-slate-800 block">Examination Candidates Roll</span>
                <span className="text-[11px] text-slate-500">Attendance sheets, candidate verification</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('exam-results')}
              className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left"
            >
              <div>
                <span className="font-bold text-slate-800 block">Results Moderation Committee</span>
                <span className="text-[11px] text-slate-500">Grades approval and pass mark audits</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Convocation & RPL Credentialing */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold text-[#002366] uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#C5A059]" />
              <span>Graduation & Prior Learning (RPL)</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Cohorts</span>
          </div>

          <div className="space-y-2 text-xs">
            <button
              onClick={() => onNavigate('graduation-ceremonies')}
              className="w-full p-2.5 rounded-lg bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200 flex items-center justify-between text-left"
            >
              <div>
                <span className="font-bold text-amber-900 block">Annual Convocation Ceremonies</span>
                <span className="text-[11px] text-amber-700">Regalia clearance, booklet approval</span>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-700" />
            </button>

            <button
              onClick={() => onNavigate('graduation-booklets')}
              className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left"
            >
              <div>
                <span className="font-bold text-slate-800 block">Graduation Booklet Editor</span>
                <span className="text-[11px] text-slate-500">Official ceremony program & order of events</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('rpl-applications')}
              className="w-full p-2.5 rounded-lg bg-indigo-50/60 hover:bg-indigo-100/70 border border-indigo-200 flex items-center justify-between text-left"
            >
              <div>
                <span className="font-bold text-indigo-900 block">RPL Prior Learning Assessments</span>
                <span className="text-[11px] text-indigo-700">Ministerial portfolio credit evaluation (30+ hrs)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
