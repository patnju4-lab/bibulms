import React, { useState } from 'react';
import { useApp, CurrentView } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Sliders,
  Users,
  HeartHandshake,
  BookOpen,
  FileCheck2,
  Award,
  Library,
  Info,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  UserPlus,
  LogIn,
  LogOut,
  Globe2,
  Sparkles,
  ExternalLink,
  Search,
  Check,
  Building,
  Calendar,
  Flame
} from 'lucide-react';
import { Role } from '../../types';

export const PortalAccessHub: React.FC = () => {
  const {
    currentUser,
    setCurrentView,
    openAuthModal,
    logoutUser,
    switchRole,
    universityInfo,
    allUsers
  } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'protected' | 'public'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [secretCodeInput, setSecretCodeInput] = useState('');
  const [secretCodeFeedback, setSecretCodeFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isGuest = currentUser.role === 'guest';

  // Handle protected portal entry
  const handleProtectedPortalEntry = (targetView: CurrentView, allowedRoles: Role[], portalTitle: string) => {
    if (isGuest) {
      openAuthModal(
        'register',
        targetView,
        `Access to the ${portalTitle} requires an active BIBU account. Please create an account or sign in to continue.`
      );
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
      openAuthModal(
        'login',
        targetView,
        `The ${portalTitle} requires authorization for: ${allowedRoles.join(', ')}. Your current role is "${currentUser.role}". Please log into an authorized institutional account.`
      );
      return;
    }

    setCurrentView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle public service entry (no login needed)
  const handlePublicServiceEntry = (targetView: CurrentView) => {
    setCurrentView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick Secret Code / Student ID validation
  const handleSecretCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecretCodeFeedback(null);
    const code = secretCodeInput.trim();

    if (!code) {
      setSecretCodeFeedback({ type: 'error', message: 'Please enter a Student ID, Faculty ID, or registered email.' });
      return;
    }

    // Check if code matches any user
    const matchedUser = allUsers.find(
      u =>
        u.email.toLowerCase() === code.toLowerCase() ||
        (u.studentId && u.studentId.toLowerCase() === code.toLowerCase()) ||
        (u.facultyId && u.facultyId.toLowerCase() === code.toLowerCase()) ||
        code === 'BIBU-ADMIN-2026' ||
        code === 'BIBU-STUDENT-7492'
    );

    if (matchedUser) {
      switchRole(matchedUser.role);
      setSecretCodeFeedback({
        type: 'success',
        message: `Secret Access Verified! Welcome, ${matchedUser.name} (${matchedUser.role.toUpperCase()}). Access granted.`
      });
      setSecretCodeInput('');
      setTimeout(() => setSecretCodeFeedback(null), 5000);
    } else {
      setSecretCodeFeedback({
        type: 'error',
        message: `No active account matches "${code}". Please create an account or check your credentials.`
      });
    }
  };

  // Define Protected Portals matching requirements
  const protectedPortals = [
    {
      id: 'student-portal',
      title: 'STUDENT LEARNING PORTAL',
      subtitle: 'LMS, Classroom, Grades & Exams',
      buttonText: 'ENTER STUDENT PORTAL',
      code: 'BIBU-PORTAL-01',
      icon: GraduationCap,
      targetView: 'student-dashboard' as CurrentView,
      allowedRoles: ['student', 'faculty', 'admin', 'registrar', 'superadmin', 'registered'] as Role[],
      accentColor: 'blue',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
      description:
        'Access courses, online classrooms, theological learning materials, assignments, grades, examinations, academic records and student services.',
      keyFeatures: [
        'Enrolled Course Modules & Syllabi',
        'Online Interactive Classroom & Lecture Notes',
        'Timed Proctored Exam Engine with Auto-Save',
        'Gradebook & Real-Time Cumulative GPA',
        'Official Transcript & Degree Audit',
        'Tuition Billing, Invoices & Fee Payment'
      ],
      userRequirementText: 'Enrolled Degree Students & Academic Candidates'
    },
    {
      id: 'faculty-portal',
      title: 'FACULTY & INSTRUCTOR PORTAL',
      subtitle: 'Grading, Lectures & Courses',
      buttonText: 'ENTER FACULTY PORTAL',
      code: 'BIBU-PORTAL-02',
      icon: Briefcase,
      targetView: 'faculty-portal' as CurrentView,
      allowedRoles: ['faculty', 'admin', 'registrar', 'superadmin', 'examiner'] as Role[],
      accentColor: 'emerald',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      description:
        'Faculty members can manage courses, lessons, lectures, assignments, quizzes, examinations, grades, student progress and academic communication.',
      keyFeatures: [
        'Course Builder & Module Note Editor',
        'Theological Scripture & Hermeneutics Repository',
        'Assignment Submission Evaluation & Rubric Grading',
        'Question Bank Authoring (MCQ, Essays, Scripture Match)',
        'Class Attendance & Student Progress Analytics',
        'Faculty Announcements & Class Broadcasts'
      ],
      userRequirementText: 'Authorized Faculty, Deans & Appointed Instructors'
    },
    {
      id: 'admin-portal',
      title: 'ADMIN PORTAL',
      subtitle: 'Full Site CMS — Edit & Manage the Whole Site',
      buttonText: 'ADMIN LOGIN',
      code: 'BIBU-PORTAL-03',
      icon: Sliders,
      targetView: 'admin-portal' as CurrentView,
      allowedRoles: ['admin', 'registrar', 'superadmin'] as Role[],
      accentColor: 'purple',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-200',
      description:
        'Authorized university administrators can manage the entire BIBU platform, including users, students, faculty, programs, courses, LMS content, examinations, bulletins, alumni, ministry networks, website content and system settings.',
      keyFeatures: [
        'Full-Site Live Website CMS & Content Editor',
        'User Role-Based Access Control (RBAC) Management',
        'Admissions & RPL Prior Learning Dossier Review',
        'Course Catalog & Academic Degree Configuration',
        'Examination Scheduling & Grade Moderation',
        'Certificate Issuance & Cryptographic Verification Records'
      ],
      userRequirementText: 'Chancellor, Academic Registrar & System Administrators'
    },
    {
      id: 'exam-centres-portal',
      title: 'GLOBAL EXAMINATION CENTRES & 47 COUNTIES',
      subtitle: 'Examination Centres, County Reps & Student Allocations',
      buttonText: 'ENTER EXAM CENTRES SYSTEM',
      code: 'BIBU-PORTAL-06',
      icon: Globe2,
      targetView: 'exam-centres' as CurrentView,
      allowedRoles: ['admin', 'registrar', 'superadmin', 'faculty', 'student', 'examiner'] as Role[],
      accentColor: 'blue',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
      description:
        'Complete management system for BIBU examination centres in all 47 counties of Kenya and national representatives worldwide. Real-time student centre allocation, capacity limits, transfers, and exam invigilation rosters.',
      keyFeatures: [
        'All 47 Counties of Kenya Network & County Representatives',
        'Worldwide National Representatives & International Centres',
        'Mandatory Student Centre Registration & Permanent Student Numbers',
        'Student Centre Relocation & Transfer Management with Audit Logs',
        'Seat Capacity Enforcement & Facility Tracking (Starlink, Generators, CCTV)',
        'Exam Session Invigilation & Digital Attendance Rosters'
      ],
      userRequirementText: 'National Representatives, County Directors, Invigilators & Registrars'
    },
    {
      id: 'alumni-portal',
      title: 'ALUMNI & MINISTERIAL NETWORK',
      subtitle: 'Global Alumni & Ministry Fellowship',
      buttonText: 'ENTER ALUMNI & MINISTERIAL NETWORK',
      code: 'BIBU-PORTAL-04',
      icon: Users,
      targetView: 'alumni' as CurrentView,
      allowedRoles: ['alumni', 'student', 'faculty', 'admin', 'registrar', 'superadmin', 'ministry_member'] as Role[],
      accentColor: 'amber',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      description:
        'Connect BIBU graduates, pastors, ministers, missionaries, chaplains, Christian leaders and ministry workers around the world. Features alumni directory, ministerial profiles, mentorship and fellowship.',
      keyFeatures: [
        '14,500+ Global Alumni Directory & Search',
        'Ministerial Calling & Ordination Profiles',
        'Regional Alumni Chapters (USA, Kenya, UK, Ghana, etc.)',
        'Continuing Theological Education & Refresher Seminars',
        'Kingdom Mentorship & Pastoral Peer Support',
        'Ministry Job Postings & Missionary Placement'
      ],
      userRequirementText: 'Graduates, Ordained Ministers & Ministry Workers'
    },
    {
      id: 'fellowships-portal',
      title: 'GLOBAL MINISTRY FELLOWSHIPS',
      subtitle: 'Connect • Fellowship • Serve • Grow',
      buttonText: 'ENTER GLOBAL FELLOWSHIPS',
      code: 'BIBU-PORTAL-05',
      icon: HeartHandshake,
      targetView: 'fellowships' as CurrentView,
      allowedRoles: ['ministry_member', 'student', 'faculty', 'alumni', 'admin', 'registered', 'superadmin'] as Role[],
      accentColor: 'indigo',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
      description:
        'Create a global digital fellowship environment for pastors, evangelists, missionaries, church planters, Bible teachers, chaplains, Christian leaders and ministry workers.',
      keyFeatures: [
        'Pastoral Leadership & Shepherd Forums',
        'Cross-Cultural Missions & Evangelism Coalitions',
        'Church Planting Incubator & Resource Exchange',
        '24/7 Global Intercessory Prayer Network',
        'Christian Counseling & Chaplaincy Cohorts',
        'Youth Ministry & Christian Education Circles'
      ],
      userRequirementText: 'Pastors, Evangelists, Missionaries & Ministry Leaders'
    }
  ];

  // Define Public Services
  const publicServices = [
    {
      id: 'pub-schools',
      title: 'Academic Schools & Faculties Catalog',
      category: 'Academic Catalog',
      icon: Building,
      targetView: 'schools' as CurrentView,
      description: 'Explore the 9 distinct theological faculties including Divinity, Ministry, Biblical Studies, Missions, and Christian Education.',
      badge: '9 Academic Schools'
    },
    {
      id: 'pub-programs',
      title: 'Degree & Certificate Programs',
      category: 'Degrees & Curriculum',
      icon: BookOpen,
      targetView: 'programs' as CurrentView,
      description: 'Browse all Certificate, Diploma, Bachelor, Master, and Doctoral degree curricula, tuition schedules, and credit requirements.',
      badge: 'Certificate to Doctorate'
    },
    {
      id: 'pub-admissions',
      title: 'Online Admissions Application',
      category: 'Admissions Office',
      icon: FileCheck2,
      targetView: 'admissions' as CurrentView,
      description: 'Submit an online application for formal university enrollment, upload academic transcripts, and provide pastoral references.',
      badge: 'Open for Fall 2026'
    },
    {
      id: 'pub-rpl',
      title: 'Recognition of Prior Learning (RPL) Assessment',
      category: 'Ministerial Credits',
      icon: Award,
      targetView: 'rpl' as CurrentView,
      description: 'Request formal academic evaluation of 5+ years of active pastoral ministry, missionary fieldwork, and Christian leadership experience.',
      badge: 'Up to 30-45 Credits'
    },
    {
      id: 'pub-verify',
      title: 'Official Credential & Certificate Verification',
      category: 'Academic Registry',
      icon: ShieldCheck,
      targetView: 'verification' as CurrentView,
      description: 'Instant verification tool for employers, denominations, and churches to validate BIBU diplomas, transcripts, and degrees.',
      badge: 'Instant Public Registry'
    },
    {
      id: 'pub-library',
      title: 'Digital Theological Library & Archives',
      category: 'Research & Scriptures',
      icon: Library,
      targetView: 'library' as CurrentView,
      description: 'Access scholarly commentaries, historical theological works, Greek/Hebrew exegetical tools, and open-access journals.',
      badge: 'Digital Repository'
    },
    {
      id: 'pub-about',
      title: 'About BIBU & Doctrinal Statement',
      category: 'Institutional Identity',
      icon: Info,
      targetView: 'about' as CurrentView,
      description: 'Read the official history of BIBU Phoenix, foundational statement of faith, institutional accreditation, and chancellor welcome.',
      badge: 'Established 1998'
    },
    {
      id: 'pub-contact',
      title: 'Global Campus Directory & Inquiries',
      category: 'Campus Contact',
      icon: Phone,
      targetView: 'contact' as CurrentView,
      description: 'Contact university administration, registrar office, student finance, technical support, and global campus coordinators.',
      badge: 'Phoenix, AZ & Global'
    }
  ];

  // Filtering
  const filteredProtected = protectedPortals.filter(p => {
    if (activeCategoryFilter === 'public') return false;
    const q = searchQuery.toLowerCase();
    return !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
  });

  const filteredPublic = publicServices.filter(s => {
    if (activeCategoryFilter === 'protected') return false;
    const q = searchQuery.toLowerCase();
    return !q || s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Header Banner */}
      <section className="relative bg-[#002366] text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-[#C5A059] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,26,77,0.6),transparent_50%)]" />

        <div className="relative max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#001A4D] border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Central Access Hub • Role-Based Security</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight">
                BIBU UNIVERSITY PORTALS
              </h1>
              <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
                Secure access to learning, teaching, administration, alumni networking and global ministry fellowship services.
              </p>
            </div>

            {/* University Crest */}
            <div className="hidden lg:flex flex-col items-center p-4 bg-[#001A4D]/80 rounded-2xl border border-[#C5A059]/30 shadow-xl text-center shrink-0">
              <UniversityLogo size="md" withRing />
              <div className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] mt-2">
                BIBU Phoenix, AZ
              </div>
              <div className="text-[9px] text-slate-300">
                14,500+ Global Alumni
              </div>
            </div>
          </div>

          {/* Live Authentication Status Bar */}
          <div className="bg-[#001A4D] border-2 border-[#C5A059]/40 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0 ${
                isGuest ? 'bg-slate-700 text-slate-300' : 'bg-[#C5A059] text-[#002366] shadow-md'
              }`}>
                {isGuest ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
                    Current Session State:
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    isGuest ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {isGuest ? 'Guest / Unauthenticated' : `Active Account (${currentUser.role.toUpperCase()})`}
                  </span>
                </div>

                <div className="text-sm font-bold text-white mt-0.5">
                  {isGuest ? (
                    <span>No active session. Institutional portals are locked until you sign in or create an account.</span>
                  ) : (
                    <span>Logged in as <strong>{currentUser.name}</strong> • {currentUser.email}</span>
                  )}
                </div>

                {!isGuest && (
                  <div className="text-xs text-slate-300 mt-0.5 flex items-center gap-3">
                    {currentUser.studentId && <span>ID: <strong className="text-[#C5A059] font-mono">{currentUser.studentId}</strong></span>}
                    {currentUser.facultyId && <span>Faculty ID: <strong className="text-[#C5A059] font-mono">{currentUser.facultyId}</strong></span>}
                    {currentUser.title && <span>Title: {currentUser.title}</span>}
                    <span>Country: {currentUser.country}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
              {isGuest ? (
                <>
                  <button
                    onClick={() => openAuthModal('register', undefined, 'Create an account to gain authenticated access to the Student LMS, Faculty Room, or Ministry Fellowships.')}
                    className="px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5 hover:scale-105"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create Account</span>
                  </button>

                  <button
                    onClick={() => openAuthModal('login', undefined, 'Sign in with your registered institutional credentials to unlock your portals.')}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/20 transition-all flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Sign In</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (currentUser.role === 'student') setCurrentView('student-dashboard');
                      else if (currentUser.role === 'faculty') setCurrentView('faculty-portal');
                      else if (currentUser.role === 'admin' || currentUser.role === 'registrar') setCurrentView('admin-portal');
                      else if (currentUser.role === 'alumni') setCurrentView('alumni');
                      else setCurrentView('fellowships');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Go to My Primary Portal &rarr;</span>
                  </button>

                  <button
                    onClick={logoutUser}
                    className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/30 transition-all flex items-center gap-1.5"
                    title="Lock session and log out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Lock & Log Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Secret Code / Student ID Quick Gate Verification & Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Secret Access Code Unlocking */}
            <div className="lg:col-span-6 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#002366]">
                <KeyRound className="w-4 h-4 text-[#C5A059]" />
                <span>Instant Secret Access Code / Student ID Verification</span>
              </div>
              <p className="text-xs text-slate-500">
                Have a pre-assigned Student ID (e.g. <span className="font-mono font-bold text-[#002366]">BIBU-2024-ST-7492</span>), Faculty ID, or registered email? Enter it below for instant verification and entry.
              </p>

              <form onSubmit={handleSecretCodeSubmit} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={secretCodeInput}
                  onChange={(e) => setSecretCodeInput(e.target.value)}
                  placeholder="Enter Student ID, Staff Code, or Email..."
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] focus:border-transparent font-medium"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-[#C5A059] text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Verify Code</span>
                </button>
              </form>

              {secretCodeFeedback && (
                <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  secretCodeFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {secretCodeFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{secretCodeFeedback.message}</span>
                </div>
              )}
            </div>

            {/* Right: Search & Portal Filters */}
            <div className="lg:col-span-6 space-y-3 lg:border-l lg:border-slate-100 lg:pl-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Filter Portals & Catalog:
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {filteredProtected.length} Protected • {filteredPublic.length} Public
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search portals, LMS tools, degree catalogs, or services..."
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeCategoryFilter === 'all'
                      ? 'bg-[#002366] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Hub Services ({protectedPortals.length + publicServices.length})
                </button>

                <button
                  onClick={() => setActiveCategoryFilter('protected')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeCategoryFilter === 'protected'
                      ? 'bg-[#002366] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Lock className="w-3 h-3 text-[#C5A059]" />
                  <span>🔒 Protected Portals ({protectedPortals.length})</span>
                </button>

                <button
                  onClick={() => setActiveCategoryFilter('public')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeCategoryFilter === 'public'
                      ? 'bg-[#002366] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Globe2 className="w-3 h-3 text-[#002366]" />
                  <span>🌐 Public Services ({publicServices.length})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 1: PROTECTED UNIVERSITY PORTALS (ACCOUNT REQUIRED) */}
      {(activeCategoryFilter === 'all' || activeCategoryFilter === 'protected') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#C5A059] pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#C5A059]">
                <Lock className="w-4 h-4 text-[#C5A059]" />
                <span>Authentication & Clearance Required</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-[#002366]">
                Institutional University Portals (5)
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md sm:text-right">
              Visitors must have an active BIBU account with verified role permissions to enter these administrative and classroom environments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProtected.map((portal) => {
              const Icon = portal.icon;
              const hasAccess = !isGuest && portal.allowedRoles.includes(currentUser.role);
              const isLocked = isGuest;
              const isRestrictedRole = !isGuest && !portal.allowedRoles.includes(currentUser.role);

              return (
                <div
                  key={portal.id}
                  className={`bg-white rounded-2xl border-2 transition-all p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md ${
                    hasAccess
                      ? 'border-[#002366] ring-1 ring-[#002366]/20'
                      : isRestrictedRole
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Card Header with Access Badge */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${
                          hasAccess
                            ? 'bg-[#002366] text-[#C5A059] shadow-md'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-[10px] font-mono font-bold text-slate-400">
                            {portal.code}
                          </div>
                          <h3 className="text-lg font-display font-black text-[#002366] leading-tight">
                            {portal.title}
                          </h3>
                          <div className="text-xs font-semibold text-[#C5A059] mt-0.5">
                            {portal.subtitle}
                          </div>
                        </div>
                      </div>

                      {/* Access Status Pill */}
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 ${
                        hasAccess
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isRestrictedRole
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}>
                        {hasAccess ? (
                          <>
                            <Unlock className="w-3 h-3 text-emerald-600" />
                            <span>Authorized Access</span>
                          </>
                        ) : isRestrictedRole ? (
                          <>
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Access Restricted</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 text-slate-500" />
                            <span>Account Required</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {portal.description}
                    </p>

                    {/* Feature Checkpoints */}
                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2">
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#002366]">
                        Included Capabilities & Modules:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                        {portal.keyFeatures.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                            <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Target Audience Requirements */}
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span>Authorized Roles: <strong className="text-slate-800 font-bold">{portal.userRequirementText}</strong></span>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {hasAccess ? (
                      <>
                        <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Cleared for entry ({currentUser.role})</span>
                        </div>
                        <button
                          onClick={() => handleProtectedPortalEntry(portal.targetView, portal.allowedRoles, portal.title)}
                          className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-[#C5A059] text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 hover:scale-105"
                        >
                          <span>{portal.buttonText}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </>
                    ) : isRestrictedRole ? (
                      <>
                        <div className="text-[11px] font-medium text-amber-800">
                          You do not currently have permission to access this portal.
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentView('account')}
                            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                          >
                            My Account
                          </button>
                          <button
                            onClick={() => handleProtectedPortalEntry(portal.targetView, portal.allowedRoles, portal.title)}
                            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>Request / Switch</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Please create an account or sign in to continue</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openAuthModal('register', portal.targetView, `Create an account to gain access to the ${portal.title}.`)}
                            className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider shadow-xs transition-all flex items-center gap-1"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Create Account</span>
                          </button>
                          <button
                            onClick={() => openAuthModal('login', portal.targetView, `Sign into your authorized account to enter the ${portal.title}.`)}
                            className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider transition-all"
                          >
                            <span>Sign In</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. SECTION 2: PUBLIC UNIVERSITY SERVICES & OPEN CATALOG (NO LOGIN NEEDED) */}
      {(activeCategoryFilter === 'all' || activeCategoryFilter === 'public') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-300 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#002366]">
                <Globe2 className="w-4 h-4 text-[#002366]" />
                <span>Open University Catalog & Information</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-[#002366]">
                Public University Services & Catalogs (8)
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md sm:text-right">
              These catalogs, admissions portals, credential verifiers, and library resources are open to the public without requiring account registration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredPublic.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  onClick={() => handlePublicServiceEntry(service.targetView)}
                  className="bg-white rounded-xl border border-slate-200 hover:border-[#002366] p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-[#002366]/10 text-[#002366] group-hover:bg-[#002366] group-hover:text-[#C5A059] flex items-center justify-center transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Open Access
                      </span>
                    </div>

                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-[#C5A059]">
                        {service.category}
                      </div>
                      <h3 className="text-sm font-display font-bold text-[#002366] leading-snug group-hover:text-[#001A4D] transition-colors mt-0.5">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#002366] group-hover:text-[#C5A059]">
                    <span className="text-[10px] text-slate-500 font-normal">{service.badge}</span>
                    <div className="flex items-center gap-1">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Institutional Access Architecture Explainer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-[#001A4D] text-white rounded-2xl p-8 sm:p-10 border-2 border-[#C5A059] shadow-xl space-y-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#001438] border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold uppercase tracking-wider">
              <KeyRound className="w-4 h-4 text-[#C5A059]" />
              <span>BIBU Identity & Single Sign-On Architecture</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
              How Protected Portal Access & Secret Passkeys Work
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every student, faculty lecturer, alumni, and university administrator receives a single unified institutional account. Permissions are enforced dynamically using cryptographically assigned Student/Faculty IDs and secret access passkeys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div className="bg-[#001438] border border-white/10 rounded-xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#C5A059] text-[#002366] flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="text-sm font-bold text-white">1. Unified Account Creation</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Register with your legal/ministerial name, country, and intended degree or role to generate your institutional account and secret passkey.
              </p>
            </div>

            <div className="bg-[#001438] border border-white/10 rounded-xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#C5A059] text-[#002366] flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="text-sm font-bold text-white">2. Role Clearance & Approval</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enrolled students receive instant LMS & exam access. Higher roles (Faculty, Registrar, Admin) are cleared via administrative verification.
              </p>
            </div>

            <div className="bg-[#001438] border border-white/10 rounded-xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#C5A059] text-[#002366] flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="text-sm font-bold text-white">3. Seamless Portal Switching</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Switch seamlessly between the Classroom, Fellowship Groups, and Alumni Network without needing separate passwords or logins.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
