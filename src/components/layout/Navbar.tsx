import React, { useState } from 'react';
import { useApp, CurrentView } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Globe2,
  FileCheck,
  Library,
  Phone,
  Mail,
  Search,
  Menu,
  X,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  Award,
  Layers,
  FileText,
  Lock,
  UserPlus,
  LogIn,
  LogOut,
  Shield,
  Briefcase,
  Sliders,
  Bell,
  UserCheck
} from 'lucide-react';
import { Role } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    switchRole,
    logoutUser,
    universityInfo,
    globalSearchQuery,
    setGlobalSearchQuery,
    openAuthModal,
    requireAuth
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [academicsDropdownOpen, setAcademicsDropdownOpen] = useState(false);
  const [portalsDropdownOpen, setPortalsDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = (view: CurrentView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setAcademicsDropdownOpen(false);
    setPortalsDropdownOpen(false);
    setUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePortalAccess = (targetView: CurrentView, allowedRoles?: Role[], portalName?: string) => {
    setPortalsDropdownOpen(false);
    setMobileMenuOpen(false);

    // If user is guest, prompt to create account or login
    if (currentUser.role === 'guest') {
      openAuthModal('register', targetView, `To access the ${portalName || 'institutional portal'}, you must first create an account or sign in.`);
      return;
    }

    // If user has a specific role requirement
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
      openAuthModal('login', targetView, `The ${portalName || 'portal'} requires ${allowedRoles.join(' or ')} authorization. Please log into an authorized account.`);
      return;
    }

    navigate(targetView);
  };

  const isGuest = currentUser.role === 'guest';

  return (
    <header className="sticky top-0 z-40 bg-[#002366] text-white border-b-4 border-[#C5A059] shadow-md">
      {/* Top University Announcement & Info Bar */}
      <div className="bg-[#001A4D] text-slate-300 text-xs px-4 py-1.5 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px] font-medium tracking-wide">
            <span className="flex items-center gap-1.5 text-[#C5A059] font-bold tracking-wider uppercase text-[10px]">
              <Globe2 className="w-3.5 h-3.5" />
              <span>{universityInfo.location || 'Phoenix, Arizona • Global Campus'}</span>
            </span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{universityInfo.phone}</span>
            </span>
            <span className="hidden lg:flex items-center gap-1 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{universityInfo.email}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={() => navigate('verification')}
              className="text-[#C5A059] hover:text-white font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Verify Certificate</span>
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={() => navigate('rpl')}
              className="text-slate-300 hover:text-[#C5A059] font-bold uppercase tracking-wider text-[10px] transition-colors flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>RPL Ministry Credit</span>
            </button>
            <span className="text-white/20">|</span>

            {/* Auth / Account Status */}
            {isGuest ? (
              <button
                onClick={() => openAuthModal('register', undefined, 'Create an account to enroll in degree courses, submit exams, or access faculty and administrative portals.')}
                className="flex items-center gap-1.5 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider transition-all"
              >
                <UserPlus className="w-3 h-3" />
                <span>Create Account / Sign In</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 bg-[#001438] border border-white/20 hover:border-[#C5A059] px-2.5 py-0.5 rounded text-[#C5A059] text-[10px] font-bold uppercase tracking-wider transition-all"
                >
                  <UserIcon className="w-3 h-3 text-[#C5A059]" />
                  <span className="max-w-[120px] truncate">{currentUser.name} ({currentUser.role})</span>
                  <ChevronDown className="w-3 h-3 text-slate-300" />
                </button>

                {userMenuOpen && (
                  <div
                    onMouseLeave={() => setUserMenuOpen(false)}
                    className="absolute right-0 top-full mt-1.5 w-60 bg-white text-slate-800 rounded-xl shadow-2xl border-t-4 border-[#C5A059] border-x border-b border-slate-200 py-2 z-50 animate-in fade-in"
                  >
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <div className="text-[10px] uppercase font-black tracking-wider text-[#C5A059]">Signed in as</div>
                      <div className="text-xs font-bold text-[#002366] truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{currentUser.role} Account • {currentUser.email}</div>
                    </div>

                    <button
                      onClick={() => navigate('account')}
                      className="w-full text-left px-3.5 py-2 text-xs font-bold text-[#002366] hover:bg-[#F0F4FF] flex items-center gap-2"
                    >
                      <UserCheck className="w-4 h-4 text-[#C5A059]" />
                      <span>My BIBU Account & Security</span>
                    </button>

                    {currentUser.role === 'student' && (
                      <button
                        onClick={() => navigate('student-dashboard')}
                        className="w-full text-left px-3.5 py-2 text-xs font-bold text-[#002366] hover:bg-[#F0F4FF] flex items-center gap-2"
                      >
                        <GraduationCap className="w-4 h-4 text-[#002366]" />
                        <span>Student Dashboard</span>
                      </button>
                    )}

                    {currentUser.role === 'faculty' && (
                      <button
                        onClick={() => navigate('faculty-portal')}
                        className="w-full text-left px-3.5 py-2 text-xs font-bold text-[#002366] hover:bg-[#F0F4FF] flex items-center gap-2"
                      >
                        <Briefcase className="w-4 h-4 text-[#002366]" />
                        <span>Faculty Portal</span>
                      </button>
                    )}

                    {(currentUser.role === 'admin' || currentUser.role === 'registrar') && (
                      <button
                        onClick={() => navigate('admin-portal')}
                        className="w-full text-left px-3.5 py-2 text-xs font-bold text-[#002366] hover:bg-[#F0F4FF] flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4 text-[#C5A059]" />
                        <span>Admin Portal (Full Site CMS)</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        openAuthModal('login', undefined, 'Sign into another account or switch credentials.');
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-t border-slate-100"
                    >
                      <Sliders className="w-4 h-4 text-slate-400" />
                      <span>Switch Account</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logoutUser();
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Branding & Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand / Crest */}
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <UniversityLogo size="md" withRing className="group-hover:scale-105 transition-transform" />
          <div>
            <div className="text-xs md:text-sm font-bold tracking-widest uppercase leading-none text-white font-sans">
              {universityInfo.name || 'Breakthrough International'}
            </div>
            <div className="text-[10px] md:text-xs text-[#C5A059] font-bold tracking-wider uppercase mt-0.5">
              Bible University • Phoenix, Arizona
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-[11px] font-bold uppercase tracking-wider text-slate-200">
          <button
            onClick={() => navigate('home')}
            className={`transition-colors py-1 ${
              currentView === 'home' ? 'text-[#C5A059] border-b-2 border-[#C5A059]' : 'hover:text-[#C5A059]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => navigate('about')}
            className={`transition-colors py-1 ${
              currentView === 'about' ? 'text-[#C5A059] border-b-2 border-[#C5A059]' : 'hover:text-[#C5A059]'
            }`}
          >
            About BIBU
          </button>

          {/* Academics Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAcademicsDropdownOpen(!academicsDropdownOpen)}
              onMouseEnter={() => setAcademicsDropdownOpen(true)}
              className={`transition-colors py-1 flex items-center gap-1 ${
                currentView === 'schools' || currentView === 'programs'
                  ? 'text-[#C5A059] border-b-2 border-[#C5A059]'
                  : 'hover:text-[#C5A059]'
              }`}
            >
              <span>Academics</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {academicsDropdownOpen && (
              <div
                onMouseLeave={() => setAcademicsDropdownOpen(false)}
                className="absolute top-full left-0 mt-1 w-64 bg-white text-slate-800 rounded-xl shadow-2xl border-t-4 border-[#C5A059] border-x border-b border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1"
              >
                <button
                  onClick={() => navigate('schools')}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-[#002366] hover:bg-[#F0F4FF] flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-[#C5A059]" />
                  <span>9 Schools & Faculties</span>
                </button>
                <button
                  onClick={() => navigate('programs')}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-[#002366] hover:bg-[#F0F4FF] flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-[#C5A059]" />
                  <span>Degree & Certificate Programs</span>
                </button>
                <button
                  onClick={() => navigate('rpl')}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-[#002366] hover:bg-[#F0F4FF] flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-[#C5A059]" />
                  <span>Recognition of Prior Learning (RPL)</span>
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => navigate('library')}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-[#002366] hover:bg-[#F0F4FF] flex items-center gap-2"
                >
                  <Library className="w-4 h-4 text-[#C5A059]" />
                  <span>Digital Theological Library</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('admissions')}
            className={`transition-colors py-1 ${
              currentView === 'admissions' ? 'text-[#C5A059] border-b-2 border-[#C5A059]' : 'hover:text-[#C5A059]'
            }`}
          >
            Admissions
          </button>

          <button
            onClick={() => navigate('library')}
            className={`transition-colors py-1 ${
              currentView === 'library' ? 'text-[#C5A059] border-b-2 border-[#C5A059]' : 'hover:text-[#C5A059]'
            }`}
          >
            Online Library
          </button>

          <button
            onClick={() => navigate('bulletins')}
            className={`transition-colors py-1 ${
              currentView === 'bulletins' || currentView === 'bulletin-detail' || currentView === 'news'
                ? 'text-[#C5A059] border-b-2 border-[#C5A059]'
                : 'hover:text-[#C5A059]'
            }`}
          >
            Bulletins
          </button>

          <button
            onClick={() => navigate('contact')}
            className={`transition-colors py-1 ${
              currentView === 'contact' ? 'text-[#C5A059] border-b-2 border-[#C5A059]' : 'hover:text-[#C5A059]'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Action Buttons & Portal Access */}
        <div className="flex items-center gap-3">
          {/* Quick Apply CTA */}
          <button
            onClick={() => navigate('admissions')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] shadow-sm transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply Online</span>
          </button>

          {/* Portal Switcher Dropdown with Account Requirement Guard */}
          <div className="relative">
            <button
              onClick={() => setPortalsDropdownOpen(!portalsDropdownOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#001A4D] hover:bg-[#001438] text-white border border-[#C5A059]/40 shadow-sm transition-all"
            >
              <GraduationCap className="w-4 h-4 text-[#C5A059]" />
              <span className="hidden md:inline">University Portals</span>
              <span className="md:hidden">Portals</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#C5A059]" />
            </button>

            {portalsDropdownOpen && (
              <div
                onMouseLeave={() => setPortalsDropdownOpen(false)}
                className="absolute right-0 top-full mt-2 w-72 bg-white text-slate-800 rounded-xl shadow-2xl border-t-4 border-[#C5A059] border-x border-b border-slate-200 py-2.5 z-50 animate-in fade-in"
              >
                <div className="px-3 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#002366]">
                    Institutional Portals
                  </span>
                  <button
                    onClick={() => navigate('portals')}
                    className="text-[9px] text-[#002366] hover:text-[#C5A059] font-bold underline uppercase"
                  >
                    View All Hub &rarr;
                  </button>
                </div>

                <div className="py-1">
                  {/* Central Portal Access Hub */}
                  <button
                    onClick={() => navigate('portals')}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#F0F4FF] text-xs font-bold text-[#002366] flex items-center justify-between bg-[#F8F9FB] border-b border-slate-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                      <div>
                        <div className="text-[#002366] font-display">Portal Access & Security Hub</div>
                        <div className="text-[10px] font-normal text-slate-500">Central gateway & passkey unlocker</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-[#C5A059] bg-[#002366] px-1.5 py-0.5 rounded">HUB</span>
                  </button>

                  {/* Student Portal */}
                  <button
                    onClick={() => handlePortalAccess('student-dashboard', ['student', 'admin', 'registrar'], 'Student Portal')}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#F0F4FF] text-xs font-bold text-[#002366] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className="w-4 h-4 text-[#002366]" />
                      <div>
                        <div>Student Learning Portal</div>
                        <div className="text-[10px] font-normal text-slate-500">LMS, Classroom, Grades & Exams</div>
                      </div>
                    </div>
                    {isGuest && <Lock className="w-3 h-3 text-slate-400" />}
                  </button>

                  {/* Faculty Portal */}
                  <button
                    onClick={() => handlePortalAccess('faculty-portal', ['faculty', 'admin'], 'Faculty Portal')}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#F0F4FF] text-xs font-bold text-[#002366] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="w-4 h-4 text-[#002366]" />
                      <div>
                        <div>Faculty & Instructor Portal</div>
                        <div className="text-[10px] font-normal text-slate-500">Grading, lectures & courses</div>
                      </div>
                    </div>
                    {isGuest && <Lock className="w-3 h-3 text-slate-400" />}
                  </button>

                  {/* Admin Portal (Full Site CMS) */}
                  <button
                    onClick={() => handlePortalAccess('admin-portal', ['admin', 'registrar'], 'Admin Portal & CMS')}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#FFFBEB] text-xs font-bold text-[#92400E] flex items-center justify-between bg-amber-50/50"
                  >
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 text-[#C5A059]" />
                      <div>
                        <div className="text-[#002366]">Admin Portal (Full Site CMS)</div>
                        <div className="text-[10px] font-normal text-amber-700">Edit & manage the whole site</div>
                      </div>
                    </div>
                    {isGuest && <Lock className="w-3 h-3 text-slate-400" />}
                  </button>

                  {/* Alumni Portal */}
                  <button
                    onClick={() => handlePortalAccess('alumni', ['alumni', 'student', 'faculty', 'admin'], 'Alumni Portal')}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#F0F4FF] text-xs font-bold text-[#002366] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-[#002366]" />
                      <div>
                        <div>Global Alumni Network</div>
                        <div className="text-[10px] font-normal text-slate-500">14,500+ worldwide graduates</div>
                      </div>
                    </div>
                    {isGuest && <Lock className="w-3 h-3 text-slate-400" />}
                  </button>

                  {/* Global Fellowships Portal */}
                  <button
                    onClick={() => handlePortalAccess('fellowships', ['student', 'faculty', 'alumni', 'admin'], 'Ministry Fellowships')}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#F0F4FF] text-xs font-bold text-[#002366] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe2 className="w-4 h-4 text-[#002366]" />
                      <div>
                        <div>Global Ministry Fellowships</div>
                        <div className="text-[10px] font-normal text-slate-500">Pastoral, missions & 24/7 prayer</div>
                      </div>
                    </div>
                    {isGuest && <Lock className="w-3 h-3 text-slate-400" />}
                  </button>
                </div>

                {isGuest && (
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                    <button
                      onClick={() => {
                        setPortalsDropdownOpen(false);
                        openAuthModal('register', 'student-dashboard', 'Please create an account to access any institutional portal.');
                      }}
                      className="w-full py-2 bg-[#002366] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#001A4D]"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Create Account to Enter</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#001A4D] border-t border-white/10 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          {/* User Account / Auth Prompt */}
          <div className="p-3 rounded-xl bg-[#001438] border border-white/10 flex items-center justify-between">
            {isGuest ? (
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="text-xs font-bold text-white">Guest Visitor</div>
                  <div className="text-[10px] text-slate-300">Create an account to login to portals</div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('register');
                  }}
                  className="px-3 py-1.5 bg-[#C5A059] text-[#002366] font-black text-xs rounded-lg uppercase tracking-wider"
                >
                  Register / Sign In
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="text-xs font-bold text-[#C5A059]">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-300 capitalize">{currentUser.role} • {currentUser.email}</div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutUser();
                  }}
                  className="text-xs text-rose-400 font-bold hover:underline"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
            <button
              onClick={() => navigate('home')}
              className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10"
            >
              Home
            </button>
            <button
              onClick={() => navigate('about')}
              className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10"
            >
              About BIBU
            </button>
            <button
              onClick={() => navigate('schools')}
              className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10"
            >
              9 Schools
            </button>
            <button
              onClick={() => navigate('programs')}
              className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10"
            >
              Programs Catalog
            </button>
            <button
              onClick={() => navigate('admissions')}
              className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10"
            >
              Admissions
            </button>
            <button
              onClick={() => navigate('rpl')}
              className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10"
            >
              RPL Prior Credit
            </button>
            <button
              onClick={() => navigate('library')}
              className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10"
            >
              Online Library
            </button>
            <button
              onClick={() => navigate('verification')}
              className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10"
            >
              Verify Certificate
            </button>
            <button
              onClick={() => navigate('bulletins')}
              className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#C5A059] font-bold"
            >
              University Bulletins
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#C5A059] flex items-center justify-between">
              <span>Institutional Portals</span>
              <button onClick={() => navigate('portals')} className="text-white hover:underline">
                Open Hub →
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => navigate('portals')}
                className="w-full text-left p-2.5 rounded-lg bg-[#001438] text-[#C5A059] text-xs font-black flex items-center justify-between border border-[#C5A059]/40"
              >
                <span>Portal Access & Security Hub</span>
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              </button>
              <button
                onClick={() => handlePortalAccess('student-dashboard', ['student', 'admin', 'registrar'], 'Student Portal')}
                className="w-full text-left p-2.5 rounded-lg bg-[#002366] text-white text-xs font-bold flex items-center justify-between border border-white/10"
              >
                <span>Student Learning Portal</span>
                <GraduationCap className="w-4 h-4 text-[#C5A059]" />
              </button>
              <button
                onClick={() => handlePortalAccess('faculty-portal', ['faculty', 'admin'], 'Faculty Portal')}
                className="w-full text-left p-2.5 rounded-lg bg-[#002366] text-white text-xs font-bold flex items-center justify-between border border-white/10"
              >
                <span>Faculty & Instructor Portal</span>
                <Briefcase className="w-4 h-4 text-[#C5A059]" />
              </button>
              <button
                onClick={() => handlePortalAccess('admin-portal', ['admin', 'registrar'], 'Admin Portal & CMS')}
                className="w-full text-left p-2.5 rounded-lg bg-[#C5A059] text-[#002366] text-xs font-black flex items-center justify-between"
              >
                <span>Admin Portal (Full Site CMS)</span>
                <Shield className="w-4 h-4 text-[#002366]" />
              </button>
              <button
                onClick={() => handlePortalAccess('alumni', ['alumni', 'student', 'faculty', 'admin'], 'Alumni Portal')}
                className="w-full text-left p-2.5 rounded-lg bg-[#002366] text-white text-xs font-bold flex items-center justify-between border border-white/10"
              >
                <span>Global Alumni Network (14,500+)</span>
                <Award className="w-4 h-4 text-[#C5A059]" />
              </button>
              <button
                onClick={() => handlePortalAccess('fellowships', ['student', 'faculty', 'alumni', 'admin'], 'Ministry Fellowships')}
                className="w-full text-left p-2.5 rounded-lg bg-[#002366] text-white text-xs font-bold flex items-center justify-between border border-white/10"
              >
                <span>Global Ministry Fellowships</span>
                <Globe2 className="w-4 h-4 text-[#C5A059]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
