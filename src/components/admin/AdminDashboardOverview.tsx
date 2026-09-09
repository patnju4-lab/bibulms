import React from 'react';
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
  Sparkles,
  ExternalLink,
  PlusCircle
} from 'lucide-react';
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

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  stats,
  onNavigate,
  adminName,
  adminRole,
  campus
}) => {
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

      {/* 12 Clickable KPI Cards Grid (Section 2) */}
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

      {/* Quick Launchpad & Academic Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
