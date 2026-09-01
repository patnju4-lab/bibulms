import React, { useState } from 'react';
import { useApp, CurrentView } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import { Role } from '../../types';
import {
  User,
  Shield,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Sliders,
  Users,
  HeartHandshake,
  KeyRound,
  Bell,
  MessageSquare,
  Lock,
  Smartphone,
  Globe,
  Clock,
  History,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  LogOut,
  Mail,
  Phone,
  Edit,
  Save,
  Fingerprint,
  Radio,
  Sparkles
} from 'lucide-react';

export const MyAccountDashboard: React.FC = () => {
  const {
    currentUser,
    setCurrentView,
    logoutUser,
    switchRole,
    allUsers,
    announcements,
    universityInfo
  } = useApp();

  const [activeTab, setActiveTab] = useState<'portals' | 'profile' | 'security' | 'notifications' | 'messages' | 'history'>('portals');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser.twoFactorEnabled ?? true);
  const [passkeyRegistered, setPasskeyRegistered] = useState(currentUser.passkeyRegistered ?? true);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Profile Edit State
  const [phone, setPhone] = useState(currentUser.phone || '+1 (602) 845-9200');
  const [country, setCountry] = useState(currentUser.country || 'United States');
  const [ministry, setMinistry] = useState(currentUser.ministryAffiliation || 'Global Ministry Outreach');
  const [preferredLang, setPreferredLang] = useState(currentUser.preferredLanguage || 'English');
  const [timeZone, setTimeZone] = useState(currentUser.timeZone || 'America/Phoenix (MST, UTC-7)');

  // Messages demo state
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'Dr. Michael C. Sterling (Chancellor)',
      subject: 'Welcome to the 2026 Academic Year at BIBU',
      timestamp: '2026-08-20 09:15',
      preview: 'Grace and peace to you in the precious name of Jesus Christ. We are thrilled to welcome you to our international theological community...',
      read: true,
      senderRole: 'Chancellor'
    },
    {
      id: 'msg-2',
      sender: 'Office of the Registrar',
      subject: 'Official Verification of Matriculation & Portal Permissions',
      timestamp: '2026-08-22 14:00',
      preview: 'Your institutional account identity has been validated and authorized for digital library resources, classroom access, and examination schedules...',
      read: false,
      senderRole: 'Registrar'
    },
    {
      id: 'msg-3',
      sender: 'Global Fellowship Secretariat',
      subject: 'Invitation to Continental Prayer & Church Planting Cohort',
      timestamp: '2026-08-23 18:30',
      preview: 'Join over 850 pastors this Friday for the 24/7 Global Intercessory Prayer and Apostolic Strategy briefing...',
      read: false,
      senderRole: 'Fellowship'
    }
  ]);

  // Login History Mock
  const loginHistory = [
    { id: '1', timestamp: '2026-08-24 09:42 (Current)', ipAddress: '198.51.100.42', device: 'Chrome on macOS (Authorized)', location: 'Phoenix, Arizona, USA' },
    { id: '2', timestamp: '2026-08-23 17:15', ipAddress: '198.51.100.42', device: 'Safari on iOS (iPhone 16 Pro)', location: 'Phoenix, Arizona, USA' },
    { id: '3', timestamp: '2026-08-21 11:30', ipAddress: '203.0.113.19', device: 'Chrome on Windows 11', location: 'London, United Kingdom' },
    { id: '4', timestamp: '2026-08-18 08:04', ipAddress: '198.51.100.42', device: 'Chrome on macOS (Authorized)', location: 'Phoenix, Arizona, USA' },
  ];

  // Define All Portals and compute authorized ones
  const allUniversityPortals = [
    {
      id: 'student-portal',
      name: 'Student Learning Portal',
      subtitle: 'LMS, Classroom, Grades & Exams',
      icon: GraduationCap,
      targetView: 'student-dashboard' as CurrentView,
      allowedRoles: ['student', 'admin', 'registrar', 'superadmin'] as Role[],
      accentColor: 'border-blue-500 bg-blue-50/50 text-blue-900',
      description: 'Access enrolled degree courses, online classroom lessons, scripture notes, timed proctored examinations, assignment dropboxes, and official grades.',
      badge: 'LMS & Grades'
    },
    {
      id: 'faculty-portal',
      name: 'Faculty & Instructor Portal',
      subtitle: 'Grading, Lectures & Courses',
      icon: Briefcase,
      targetView: 'faculty-portal' as CurrentView,
      allowedRoles: ['faculty', 'admin', 'superadmin'] as Role[],
      accentColor: 'border-emerald-500 bg-emerald-50/50 text-emerald-900',
      description: 'Manage courses, author theological lessons, grade student assignments with rubrics, manage exam question banks, and monitor progress.',
      badge: 'Curriculum & Grading'
    },
    {
      id: 'admin-portal',
      name: 'Admin Portal & CMS',
      subtitle: 'Full Site CMS — Edit & Manage the Whole Site',
      icon: Sliders,
      targetView: 'admin-portal' as CurrentView,
      allowedRoles: ['admin', 'registrar', 'superadmin'] as Role[],
      accentColor: 'border-purple-500 bg-purple-50/50 text-purple-900',
      description: 'Full institutional administrative control: live site CMS, user management, admissions decisions, RPL prior learning credits, exams, and system settings.',
      badge: 'Highest System Access'
    },
    {
      id: 'alumni-portal',
      name: 'Alumni & Ministerial Network',
      subtitle: 'Global Alumni & Ministry Fellowship (14,500+)',
      icon: Users,
      targetView: 'alumni' as CurrentView,
      allowedRoles: ['alumni', 'student', 'faculty', 'admin', 'registrar', 'superadmin', 'registered', 'ministry_member'] as Role[],
      accentColor: 'border-amber-500 bg-amber-50/50 text-amber-900',
      description: 'Connect with over 14,500+ BIBU graduates, ordained ministers, chaplains, and Christian leaders across 64 nations.',
      badge: '14,500+ Global Members'
    },
    {
      id: 'fellowships-portal',
      name: 'Global Ministry Fellowships',
      subtitle: 'Connect • Fellowship • Serve • Grow (12 Fellowships)',
      icon: HeartHandshake,
      targetView: 'fellowships' as CurrentView,
      allowedRoles: ['student', 'faculty', 'alumni', 'admin', 'registrar', 'superadmin', 'registered', 'ministry_member'] as Role[],
      accentColor: 'border-indigo-500 bg-indigo-50/50 text-indigo-900',
      description: 'Engage in 12 global ministry fellowship groups (Pastoral, Evangelism, Missions, Prayer, Church Planting, Counseling, etc.).',
      badge: '12 Active Fellowships'
    }
  ];

  // Filter portals authorized for the current user
  const authorizedPortals = allUniversityPortals.filter(p => p.allowedRoles.includes(currentUser.role));

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveFeedback('Your profile preferences have been successfully updated.');
    setTimeout(() => setSaveFeedback(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Account Header Banner */}
      <div className="bg-[#002366] text-white rounded-2xl p-6 sm:p-8 border-b-4 border-[#C5A059] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border-2 border-[#C5A059] p-1 flex items-center justify-center shrink-0 shadow-lg">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <User className="w-10 h-10 text-[#C5A059]" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#C5A059] text-[#002366] text-[10px] font-black uppercase tracking-wider">
                  {currentUser.role.toUpperCase()}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Identity</span>
                </span>
                {currentUser.studentId && (
                  <span className="text-[11px] font-mono text-slate-300">
                    ID: {currentUser.studentId}
                  </span>
                )}
                {currentUser.facultyId && (
                  <span className="text-[11px] font-mono text-slate-300">
                    ID: {currentUser.facultyId}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
                {currentUser.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                <span>{currentUser.email}</span>
                <span>•</span>
                <span>{currentUser.country}</span>
                {currentUser.title && (
                  <>
                    <span>•</span>
                    <span className="text-[#C5A059] font-bold">{currentUser.title}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            <button
              onClick={() => {
                setCurrentView('portals');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Explore All Portals</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={logoutUser}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4 text-rose-300" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Authorized Portals</span>
            <span className="text-xl font-bold font-display text-[#C5A059]">{authorizedPortals.length} of 5 Active</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Security Status</span>
            <span className="text-xl font-bold font-display text-emerald-400">2FA Protected</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">University Status</span>
            <span className="text-xl font-bold font-display text-white">Good Standing</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Unread Messages</span>
            <span className="text-xl font-bold font-display text-amber-300">2 Pending</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('portals')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'portals'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>My Authorized Portals ({authorizedPortals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Preferences</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & 2FA</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'notifications'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'messages'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Unified Messages</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Login History & Sessions</span>
        </button>
      </div>

      {/* TAB 1: MY AUTHORIZED PORTALS (SECTION 10 & 9) */}
      {activeTab === 'portals' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xl font-bold font-display text-[#002366] flex items-center gap-2">
                <span>MY PORTALS</span>
              </h2>
              <p className="text-xs text-slate-500">
                You are currently authorized to access the following university systems. Click to launch any portal directly without re-authenticating.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#C5A059] bg-[#002366] px-3 py-1 rounded-full shrink-0">
              Active Role: {currentUser.role.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorizedPortals.map(portal => {
              const IconComp = portal.icon;
              return (
                <div
                  key={portal.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="p-3 rounded-xl bg-[#002366] text-[#C5A059] group-hover:scale-105 transition-transform shadow-xs">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {portal.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold font-display text-[#002366] group-hover:text-[#C5A059] transition-colors">
                        {portal.name}
                      </h3>
                      <div className="text-xs font-bold text-[#C5A059] mt-0.5">
                        {portal.subtitle}
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {portal.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 bg-[#F8F9FB]">
                    <button
                      onClick={() => {
                        setCurrentView(portal.targetView);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full py-3 bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 group-hover:bg-[#C5A059] group-hover:text-[#002366]"
                    >
                      <span>ENTER PORTAL</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Role Switcher for Authorized Users */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#002366]">
                  Portal Switcher & Multi-Role Identity
                </h4>
                <p className="text-xs text-slate-500">
                  Switch between authorized institutional identities for testing and cross-portal administration.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => switchRole('student')}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  currentUser.role === 'student' ? 'border-[#002366] bg-[#002366] text-white' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                🎓 Student Portal
              </button>
              <button
                onClick={() => switchRole('faculty')}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  currentUser.role === 'faculty' ? 'border-[#002366] bg-[#002366] text-white' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                👨‍🏫 Faculty Portal
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  currentUser.role === 'admin' ? 'border-[#002366] bg-[#002366] text-white' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                ⚙️ Admin Portal
              </button>
              <button
                onClick={() => switchRole('alumni')}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  currentUser.role === 'alumni' ? 'border-[#002366] bg-[#002366] text-white' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                🌍 Alumni & Fellowships
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROFILE & PREFERENCES */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold font-display text-[#002366]">
              Personal Profile & Institutional Records
            </h2>
            <p className="text-xs text-slate-500">
              Manage your personal information, contact numbers, and theological affiliations.
            </p>
          </div>

          {saveFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveFeedback}</span>
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.name}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Institutional Email Address</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-bold font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Mobile Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Country of Residence</label>
                <input
                  type="text"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Ministry Affiliation / Church Organization</label>
                <input
                  type="text"
                  value={ministry}
                  onChange={e => setMinistry(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Time Zone</label>
                <input
                  type="text"
                  value={timeZone}
                  onChange={e => setTimeZone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: SECURITY & 2FA (SECTION 23) */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold font-display text-[#002366]">
              Security & Identity Protection
            </h2>
            <p className="text-xs text-slate-500">
              Manage multi-factor authentication, biometric passkeys, and account recovery options.
            </p>
          </div>

          <div className="space-y-4">
            {/* 2FA Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#002366]">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[11px] text-slate-500">
                    Require SMS or Authenticator App code upon each institutional portal login.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  twoFactorEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {twoFactorEnabled ? 'Enabled ✓' : 'Disabled'}
              </button>
            </div>

            {/* Passkeys Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#002366]">Biometric Passkeys / WebAuthn</h4>
                  <p className="text-[11px] text-slate-500">
                    Touch ID / Face ID hardware key registered for instant passwordless sign-in.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPasskeyRegistered(!passkeyRegistered)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  passkeyRegistered ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {passkeyRegistered ? 'Passkey Active' : 'Setup Passkey'}
              </button>
            </div>

            {/* Password Reset */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#002366]">Account Password</h4>
                  <p className="text-[11px] text-slate-500">
                    Last updated 14 days ago. High complexity (Bcrypt hashed).
                  </p>
                </div>
              </div>
              <button
                onClick={() => alert('Password reset link sent to your registered email.')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS (SECTION 20) */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold font-display text-[#002366]">
              Unified Notification Feed
            </h2>
            <p className="text-xs text-slate-500">
              Live broadcast alerts, exam reminders, assignment grades, and fellowship updates.
            </p>
          </div>

          <div className="space-y-3">
            {announcements.map(item => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-[#F8F9FB] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-[#002366] text-[#C5A059] text-[10px] font-bold rounded">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-slate-500">{item.date}</span>
                </div>
                <h4 className="text-xs font-bold text-[#002366]">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: UNIFIED MESSAGES (SECTION 21) */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold font-display text-[#002366]">
              BIBU Unified Messaging System
            </h2>
            <p className="text-xs text-slate-500">
              Secure institutional communication across Faculty, Administration, Alumni, and Fellowship Circles.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {messages.map(msg => (
              <div key={msg.id} className="py-4 space-y-1 hover:bg-slate-50 p-3 rounded-xl transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#002366] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                    <span>{msg.sender}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">{msg.subject}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{msg.preview}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: LOGIN HISTORY & AUDIT (SECTION 23 & 24) */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold font-display text-[#002366]">
              Login History & Active Sessions
            </h2>
            <p className="text-xs text-slate-500">
              Review recent authentications, IP geolocation logs, and device security audits.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F9FB] text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Device / Browser</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loginHistory.map(rec => (
                  <tr key={rec.id} className="hover:bg-[#F8F9FB]">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{rec.timestamp}</td>
                    <td className="py-2.5 px-3 text-slate-700">{rec.device}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{rec.ipAddress}</td>
                    <td className="py-2.5 px-3 text-slate-700">{rec.location}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                        Authorized
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
