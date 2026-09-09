import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Award,
  Layers,
  Building2,
  FolderTree,
  GraduationCap,
  Users,
  UserCheck,
  UserX,
  UserCog,
  FileCheck,
  Activity,
  FileSpreadsheet,
  Globe2,
  FileText,
  BadgeCheck,
  Briefcase,
  Compass,
  FilePlus,
  BookOpenCheck,
  CheckCircle,
  Scroll,
  BookMarked,
  DollarSign,
  CreditCard,
  Sparkles,
  TrendingUp,
  Megaphone,
  Bell,
  Mail,
  BarChart3,
  PieChart,
  Shield,
  KeyRound,
  History,
  Settings,
  Database,
  LogOut,
  ChevronDown,
  ChevronRight,
  Search,
  School,
  Landmark,
  X
} from 'lucide-react';
import { AdminNavigationItem, AdminSidebarCategory } from '../../types/admin';
import { UniversityLogo } from '../common/UniversityLogo';

interface SidebarItemDef {
  id: AdminNavigationItem;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

interface SidebarCategoryDef {
  category: AdminSidebarCategory;
  items: SidebarItemDef[];
}

interface AdminSidebarProps {
  activeItem: AdminNavigationItem;
  onSelectItem: (item: AdminNavigationItem) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  pendingHonoraryCount?: number;
  pendingEnrollmentsCount?: number;
  activeStudentsCount?: number;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeItem,
  onSelectItem,
  isOpenMobile,
  onCloseMobile,
  pendingHonoraryCount = 2,
  pendingEnrollmentsCount = 4,
  activeStudentsCount = 3820,
  onLogout
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (cat: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const navCategories: SidebarCategoryDef[] = useMemo(() => [
    {
      category: 'ACADEMIC MANAGEMENT',
      items: [
        { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
        { id: 'honorary-applications', label: '2. Honorary Applications', icon: Award, badge: pendingHonoraryCount, badgeColor: 'bg-amber-500 text-white' },
        { id: 'schools', label: '3. Schools', icon: Layers },
        { id: 'campuses', label: '4. Campuses', icon: Building2 },
        { id: 'departments', label: '5. Departments', icon: FolderTree },
        { id: 'programs', label: '6. Programs', icon: BookOpenCheck },
        { id: 'students', label: '7. Students', icon: Users, badge: activeStudentsCount, badgeColor: 'bg-[#002366] text-[#C5A059]' },
        { id: 'past-students', label: '8. Past Students', icon: UserCheck },
        { id: 'lecturers', label: '9. Lecturers', icon: UserCog },
        { id: 'enrollments', label: '10. Enrollments', icon: FileCheck, badge: pendingEnrollmentsCount, badgeColor: 'bg-emerald-600 text-white' },
        { id: 'courses-in-progress', label: '11. Courses in Progress', icon: Activity }
      ]
    },
    {
      category: 'EXAMINATION MANAGEMENT',
      items: [
        { id: 'examinations', label: '12. Examinations', icon: FileSpreadsheet },
        { id: 'exam-centers', label: '13. Examination Centers', icon: Globe2 },
        { id: 'exam-candidates', label: '14. Examination Candidates', icon: Users },
        { id: 'exam-results', label: '15. Results', icon: CheckCircle },
        { id: 'transcripts', label: '16. Transcripts', icon: FileText },
        { id: 'certificates', label: '17. Certificates', icon: BadgeCheck }
      ]
    },
    {
      category: 'RPL MANAGEMENT',
      items: [
        { id: 'rpl-candidates', label: '18. RPL Candidates', icon: Briefcase },
        { id: 'rpl-applications', label: '19. RPL Applications', icon: FilePlus, badge: 'Active', badgeColor: 'bg-indigo-600 text-white' },
        { id: 'rpl-portfolios', label: '20. RPL Evidence Portfolios', icon: Compass },
        { id: 'rpl-assessments', label: '21. RPL Assessments', icon: BookMarked },
        { id: 'rpl-results', label: '22. RPL Results', icon: Award }
      ]
    },
    {
      category: 'GRADUATION',
      items: [
        { id: 'graduation-ceremonies', label: '23. Graduation', icon: GraduationCap },
        { id: 'graduates-list', label: '24. Graduates', icon: Scroll },
        { id: 'graduation-booklets', label: '25. Graduation Booklets', icon: BookMarked },
        { id: 'alumni-management', label: '26. Alumni', icon: Landmark }
      ]
    },
    {
      category: 'FINANCE',
      items: [
        { id: 'fees-structure', label: '27. Fees', icon: DollarSign },
        { id: 'payments', label: '28. Payments', icon: CreditCard },
        { id: 'scholarships', label: '29. Scholarships', icon: Sparkles },
        { id: 'financial-reports', label: '30. Financial Reports', icon: TrendingUp }
      ]
    },
    {
      category: 'COMMUNICATION',
      items: [
        { id: 'announcements', label: '31. Announcements', icon: Megaphone },
        { id: 'notifications', label: '32. Notifications', icon: Bell },
        { id: 'email-sms', label: '33. Email/SMS', icon: Mail }
      ]
    },
    {
      category: 'REPORTS',
      items: [
        { id: 'reports-students', label: '34. Student Reports', icon: BarChart3 },
        { id: 'reports-academic', label: '35. Academic Reports', icon: PieChart },
        { id: 'reports-enrollments', label: '36. Enrollment Reports', icon: BarChart3 },
        { id: 'reports-graduation', label: '37. Graduation Reports', icon: PieChart },
        { id: 'reports-examinations', label: '38. Examination Reports', icon: BarChart3 },
        { id: 'reports-financial', label: '39. Financial Reports', icon: TrendingUp }
      ]
    },
    {
      category: 'SYSTEM',
      items: [
        { id: 'system-users', label: '40. Users', icon: Users },
        { id: 'system-roles', label: '41. Roles & Permissions', icon: KeyRound },
        { id: 'system-audit-logs', label: '42. Audit Logs', icon: History },
        { id: 'system-settings', label: '43. System Settings', icon: Settings },
        { id: 'system-backup', label: '44. Backup', icon: Database },
        { id: 'logout', label: '45. Logout', icon: LogOut }
      ]
    }
  ], [pendingHonoraryCount, pendingEnrollmentsCount, activeStudentsCount]);

  // Filter categories and items if search term is provided
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return navCategories;
    const term = searchTerm.toLowerCase();

    return navCategories.map(cat => ({
      ...cat,
      items: cat.items.filter(item =>
        item.label.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term)
      )
    })).filter(cat => cat.items.length > 0);
  }, [navCategories, searchTerm]);

  const handleItemClick = (id: AdminNavigationItem) => {
    if (id === 'logout') {
      onLogout();
      return;
    }
    onSelectItem(id);
    if (window.innerWidth < 1024) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#001845] text-slate-200 border-r border-[#002870] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#002870] bg-[#001438] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded-lg bg-white shadow-xs">
              <UniversityLogo size="sm" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#C5A059] uppercase block">
                BIBU LMS • Control Center
              </span>
              <h2 className="text-sm font-black text-white font-display tracking-tight leading-tight">
                ADMIN CONSOLE
              </h2>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input for 45 items */}
        <div className="p-3 border-b border-[#002870] bg-[#001740]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search 45 admin modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-700">
          {filteredCategories.map((catGroup) => {
            const isCollapsed = !searchTerm && collapsedCategories[catGroup.category];

            return (
              <div key={catGroup.category} className="space-y-1">
                {/* Category Header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(catGroup.category)}
                  className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-mono font-bold text-[#C5A059] uppercase tracking-wider hover:text-amber-300 transition-colors"
                >
                  <span>{catGroup.category}</span>
                  {isCollapsed ? (
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  )}
                </button>

                {/* Items */}
                {!isCollapsed && (
                  <div className="space-y-0.5">
                    {catGroup.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeItem === item.id;
                      const isLogout = item.id === 'logout';

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleItemClick(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-[#C5A059] to-[#b38e47] text-slate-950 font-bold shadow-md'
                              : isLogout
                              ? 'text-rose-300 hover:bg-rose-950/40 hover:text-rose-200'
                              : 'text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : isLogout ? 'text-rose-400' : 'text-[#C5A059]'}`} />
                            <span className="truncate text-xs">{item.label}</span>
                          </div>

                          {item.badge !== undefined && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 font-mono ${
                                item.badgeColor || 'bg-slate-700 text-slate-200'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#002870] bg-[#001438] text-[10px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>BIBU v4.2 • Phoenix, AZ</span>
          </div>
          <button
            onClick={onLogout}
            className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
          >
            <LogOut className="w-3 h-3" />
            <span>Exit</span>
          </button>
        </div>
      </aside>
    </>
  );
};
