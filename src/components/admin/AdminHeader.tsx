import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Menu,
  Bell,
  Shield,
  ShieldCheck,
  Clock,
  LogOut,
  UserCheck,
  ChevronDown,
  ExternalLink,
  GraduationCap,
  Users,
  Award,
  Layers,
  FileText,
  BadgeCheck,
  X
} from 'lucide-react';
import { AdminRole, AdminSession, AdminNavigationItem } from '../../types/admin';
import { ADMIN_USERS } from '../../data/adminData';

interface SearchResultItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  targetNav: AdminNavigationItem;
  badge?: string;
}

interface AdminHeaderProps {
  session: AdminSession;
  onToggleMobileSidebar: () => void;
  onRoleSwitch: (role: AdminRole) => void;
  onNavigate: (item: AdminNavigationItem) => void;
  onLogout: () => void;
  allSearchData: {
    students: { id: string; name: string; admNo: string; email: string; program: string }[];
    lecturers: { id: string; name: string; email: string; school: string }[];
    programs: { id: string; name: string; code: string }[];
    campuses: { id: string; name: string; city: string; country: string }[];
    honorary: { id: string; candidateName: string; appNo: string }[];
    certificates: { id: string; studentName: string; certNo: string; degree: string }[];
  };
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  session,
  onToggleMobileSidebar,
  onRoleSwitch,
  onNavigate,
  onLogout,
  allSearchData
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setShowRoleDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute Search Results across multiple dimensions
  const searchResults: SearchResultItem[] = React.useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    const results: SearchResultItem[] = [];

    // Students SIS
    allSearchData.students.forEach(s => {
      if (
        s.name.toLowerCase().includes(q) ||
        s.admNo.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.program.toLowerCase().includes(q)
      ) {
        results.push({
          id: s.id,
          category: 'Student',
          title: s.name,
          subtitle: `${s.admNo} • ${s.program}`,
          targetNav: 'students',
          badge: 'SIS'
        });
      }
    });

    // Lecturers
    allSearchData.lecturers.forEach(l => {
      if (l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.school.toLowerCase().includes(q)) {
        results.push({
          id: l.id,
          category: 'Faculty',
          title: l.name,
          subtitle: `${l.school} • ${l.email}`,
          targetNav: 'lecturers',
          badge: 'Faculty'
        });
      }
    });

    // Programs
    allSearchData.programs.forEach(p => {
      if (p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)) {
        results.push({
          id: p.id,
          category: 'Academic Program',
          title: p.name,
          subtitle: `Code: ${p.code}`,
          targetNav: 'programs',
          badge: 'Degree'
        });
      }
    });

    // Campuses
    allSearchData.campuses.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)) {
        results.push({
          id: c.id,
          category: 'Campus / Center',
          title: c.name,
          subtitle: `${c.city}, ${c.country}`,
          targetNav: 'campuses',
          badge: 'Regional'
        });
      }
    });

    // Honorary
    allSearchData.honorary.forEach(h => {
      if (h.candidateName.toLowerCase().includes(q) || h.appNo.toLowerCase().includes(q)) {
        results.push({
          id: h.id,
          category: 'Honorary Candidate',
          title: h.candidateName,
          subtitle: `App: ${h.appNo}`,
          targetNav: 'honorary-applications',
          badge: 'Senate Award'
        });
      }
    });

    // Certificates
    allSearchData.certificates.forEach(c => {
      if (c.studentName.toLowerCase().includes(q) || c.certNo.toLowerCase().includes(q) || c.degree.toLowerCase().includes(q)) {
        results.push({
          id: c.id,
          category: 'Official Certificate',
          title: c.studentName,
          subtitle: `${c.certNo} • ${c.degree}`,
          targetNav: 'certificates',
          badge: 'Registry'
        });
      }
    });

    return results.slice(0, 8); // max 8 results
  }, [searchQuery, allSearchData]);

  const handleSelectResult = (item: SearchResultItem) => {
    onNavigate(item.targetNav);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 gap-3">
        {/* Mobile Toggle & Portal Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-[#002366] flex items-center gap-1.5 font-display tracking-tight">
              <span className="text-[#C5A059] font-black">BIBU</span>
              <span className="text-slate-400 font-light">/</span>
              <span>ADMINISTRATIVE CONTROL CENTER</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>Campus: {session.user.campus}</span>
            </span>
          </div>
        </div>

        {/* Global Search Bar (Section 14) */}
        <div ref={searchRef} className="flex-1 max-w-lg relative">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Global Search (Student, ID, Program, Cert #, Lecturer, Campus)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-slate-300 bg-slate-50/80 placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && searchQuery.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fade-in">
              <div className="p-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Matching Records ({searchResults.length}):</span>
                <span className="text-[#002366] font-bold">Press result to navigate</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  No records found matching "{searchQuery}".
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {searchResults.map((res) => (
                    <button
                      key={`${res.category}-${res.id}`}
                      type="button"
                      onClick={() => handleSelectResult(res)}
                      className="w-full p-2.5 text-left hover:bg-[#002366]/5 flex items-center justify-between transition-colors group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 group-hover:bg-[#002366] group-hover:text-[#C5A059] transition-colors">
                            {res.category}
                          </span>
                          <span className="text-xs font-bold text-[#002366] truncate">
                            {res.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {res.subtitle}
                        </p>
                      </div>

                      <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-[#002366] shrink-0 ml-2">
                        Open →
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Tools: Role Switcher, Session Status, Profile, Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher Dropdown (Evaluation testing of all 8 roles) */}
          <div ref={roleDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 font-medium transition-colors"
              title="Switch Administrative Role to test RBAC"
            >
              <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="font-bold text-[11px] text-[#002366] hidden md:inline truncate max-w-[120px]">
                {session.user.role}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in text-xs">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                    Role-Based Access Control (RBAC):
                  </span>
                  <span className="text-xs font-bold text-[#002366]">
                    Switch Active Administrator Role
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto py-1">
                  {ADMIN_USERS.map((adm) => (
                    <button
                      key={adm.role}
                      type="button"
                      onClick={() => {
                        onRoleSwitch(adm.role);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between ${
                        session.user.role === adm.role ? 'bg-amber-50 font-bold text-[#002366]' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs">{adm.role}</div>
                        <div className="text-[10px] text-slate-400">{adm.name.split(',')[0]}</div>
                      </div>
                      {session.user.role === adm.role && (
                        <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Audit Logs Quick Button */}
          <button
            type="button"
            onClick={() => onNavigate('system-audit-logs')}
            className="p-2 rounded-lg text-slate-600 hover:text-[#002366] hover:bg-slate-100 relative transition-colors"
            title="View Real-time Audit Logs"
          >
            <Clock className="w-4 h-4" />
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            {session.user.avatar ? (
              <img
                src={session.user.avatar}
                alt={session.user.name}
                className="w-7 h-7 rounded-full object-cover border border-[#C5A059]"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold text-xs">
                {session.user.name.charAt(0)}
              </div>
            )}

            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-[#002366] leading-tight truncate max-w-[130px]">
                {session.user.name}
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">
                {session.user.email}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={onLogout}
            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-xs font-medium flex items-center gap-1 transition-all"
            title="End Session & Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline text-[11px] font-bold">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
