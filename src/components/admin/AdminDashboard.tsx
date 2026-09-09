import React, { useState, useEffect, useMemo } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { HonoraryApplicationsManager } from './modules/HonoraryApplicationsManager';
import { SchoolsManager } from './modules/SchoolsManager';
import { CampusesManager } from './modules/CampusesManager';
import { DepartmentsManager } from './modules/DepartmentsManager';
import { ProgramsManager } from './modules/ProgramsManager';
import { StudentsManager } from './modules/StudentsManager';
import { PastStudentsManager } from './modules/PastStudentsManager';
import { LecturersManager } from './modules/LecturersManager';
import { EnrollmentsManager } from './modules/EnrollmentsManager';
import { CoursesInProgressManager } from './modules/CoursesInProgressManager';
import { RolesAndPermissionsManager } from './modules/RolesAndPermissionsManager';
import { AuditLogsManager } from './modules/AuditLogsManager';
import { SecondaryAdminModules } from './modules/SecondaryAdminModules';

import {
  AdminRole,
  AdminSession,
  AdminNavigationItem,
  AdminCampus,
  AdminDepartment,
  AdminProgram,
  AdminStudentProfile,
  AdminLecturerProfile,
  AdminEnrollmentRecord,
  CourseInProgress,
  HonoraryApplication,
  AdminAuditLog,
  PastStudentProfile,
  EnrollmentStatus,
  HonoraryStatus
} from '../../types/admin';
import { School } from '../../types';

import {
  ADMIN_USERS,
  INITIAL_CAMPUSES,
  INITIAL_DEPARTMENTS,
  INITIAL_HONORARY_APPLICATIONS,
  INITIAL_STUDENTS_SIS,
  INITIAL_PAST_STUDENTS,
  INITIAL_LECTURERS,
  INITIAL_ENROLLMENTS,
  INITIAL_COURSES_IN_PROGRESS,
  INITIAL_ADMIN_AUDIT_LOGS
} from '../../data/adminData';
import { INITIAL_SCHOOLS } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  // Session State
  const [session, setSession] = useState<AdminSession | null>(() => {
    // Check localStorage for active admin session
    try {
      const saved = localStorage.getItem('BIBU_ADMIN_SESSION');
      if (saved) {
        const parsed: AdminSession = JSON.parse(saved);
        if (new Date(parsed.expiresAt).getTime() > Date.now()) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    // Return initial pre-authorized session for executive administrative access
    return {
      token: 'BIBU-SEC-CHANCELLOR-2026',
      user: ADMIN_USERS[0],
      loginTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      ipAddress: '198.51.100.42 (Phoenix High-Security Gateway)',
      device: 'macOS Enterprise Workstation',
      active: true
    };
  });

  // Active Navigation Module
  const [activeItem, setActiveItem] = useState<AdminNavigationItem>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Centralized Live Data States (Normalized In-Memory Relational State)
  const [schools, setSchools] = useState<School[]>(INITIAL_SCHOOLS);
  const [campuses, setCampuses] = useState<AdminCampus[]>(INITIAL_CAMPUSES);
  const [departments, setDepartments] = useState<AdminDepartment[]>(INITIAL_DEPARTMENTS);
  const [students, setStudents] = useState<AdminStudentProfile[]>(INITIAL_STUDENTS_SIS);
  const [pastStudents, setPastStudents] = useState<PastStudentProfile[]>(INITIAL_PAST_STUDENTS);
  const [lecturers, setLecturers] = useState<AdminLecturerProfile[]>(INITIAL_LECTURERS);
  const [enrollments, setEnrollments] = useState<AdminEnrollmentRecord[]>(INITIAL_ENROLLMENTS);
  const [coursesInProgress, setCoursesInProgress] = useState<CourseInProgress[]>(INITIAL_COURSES_IN_PROGRESS);
  const [honoraryApps, setHonoraryApps] = useState<HonoraryApplication[]>(INITIAL_HONORARY_APPLICATIONS);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(INITIAL_ADMIN_AUDIT_LOGS);

  // Derived initial programs list
  const initialPrograms: AdminProgram[] = useMemo(() => [
    {
      id: 'prog-1',
      name: 'Bachelor of Theology (B.Th.)',
      code: 'BTH-01',
      type: 'Bachelor’s',
      award: 'Bachelor of Theology (B.Th.)',
      schoolName: 'School of Theology & Biblical Studies',
      department: 'Department of Systematic Theology',
      duration: '4 Years (120 Credits)',
      entryRequirements: 'Secondary Certificate or ministerial endorsement',
      studyMode: ['Online', 'Hybrid', 'On-Campus'],
      fees: 2400,
      scholarshipAvailable: true,
      curriculumUnits: ['THEO-101', 'BIBL-201', 'HIST-301', 'HOM-401'],
      examinationRequirements: 'Trimester examinations + Capstone thesis',
      status: 'Active'
    },
    {
      id: 'prog-2',
      name: 'Master of Divinity (M.Div.)',
      code: 'MDIV-01',
      type: 'Master’s',
      award: 'Master of Divinity (M.Div.)',
      schoolName: 'School of Theology & Biblical Studies',
      department: 'Department of Biblical Languages & Exegesis',
      duration: '3 Years (90 Credits)',
      entryRequirements: 'Accredited Bachelor’s degree in Theology or related discipline',
      studyMode: ['Online', 'Hybrid'],
      fees: 3600,
      scholarshipAvailable: true,
      curriculumUnits: ['BIBL-501', 'THEO-602', 'ETH-701', 'MIN-801'],
      examinationRequirements: 'Comprehensive oral defense + Master’s dissertation',
      status: 'Active'
    },
    {
      id: 'prog-3',
      name: 'Doctor of Ministry (D.Min.)',
      code: 'DMIN-01',
      type: 'Doctorate',
      award: 'Doctor of Ministry (D.Min.)',
      schoolName: 'School of Christian Ministry & Leadership',
      department: 'Department of Pastoral Theology & Counseling',
      duration: '3 Years (48 Credits)',
      entryRequirements: 'M.Div. or equivalent + 5 years pastoral ministry experience',
      studyMode: ['Hybrid', 'Online'],
      fees: 4800,
      scholarshipAvailable: true,
      curriculumUnits: ['LEAD-901', 'MIN-905', 'RES-910', 'DISS-999'],
      examinationRequirements: 'Major ministry project dissertation and public defense',
      status: 'Active'
    },
    {
      id: 'prog-4',
      name: 'Pastoral Ministry & Church Planting (RPL)',
      code: 'RPL-MIN-01',
      type: 'Recognition of Prior Learning (RPL)',
      award: 'Diploma / Bachelor in Pastoral Leadership via RPL',
      schoolName: 'School of Christian Ministry & Leadership',
      department: 'Department of Pastoral Theology & Counseling',
      duration: '1-2 Years (Portfolio Assessment)',
      entryRequirements: '10+ Years documented ministerial leadership & ordination',
      studyMode: ['Online', 'Hybrid'],
      fees: 1800,
      scholarshipAvailable: true,
      curriculumUnits: ['PORT-301', 'ETH-402', 'CAPS-490'],
      examinationRequirements: 'Ministerial portfolio evaluation + Oral examination',
      status: 'Active'
    }
  ], []);

  const [programs, setPrograms] = useState<AdminProgram[]>(initialPrograms);

  // Sync session to localStorage
  useEffect(() => {
    if (session) {
      localStorage.setItem('BIBU_ADMIN_SESSION', JSON.stringify(session));
    } else {
      localStorage.removeItem('BIBU_ADMIN_SESSION');
    }
  }, [session]);

  // Logging helper
  const handleLogAudit = (action: string, recordAffected: string, details?: string) => {
    const newLog: AdminAuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      user: session?.user.name || 'System Controller',
      role: session?.user.role || 'Super Administrator',
      action,
      recordAffected,
      ipAddress: session?.ipAddress || '198.51.100.42',
      details,
      category: action.toLowerCase().includes('login') ? 'Authentication'
        : action.toLowerCase().includes('honorary') ? 'Honorary Senate'
        : action.toLowerCase().includes('school') || action.toLowerCase().includes('program') ? 'Curriculum'
        : action.toLowerCase().includes('exam') ? 'Examinations'
        : action.toLowerCase().includes('fee') || action.toLowerCase().includes('payment') ? 'Finance' : 'Academics'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Auth Handlers
  const handleLoginSuccess = (newSession: AdminSession) => {
    setSession(newSession);
    handleLogAudit('Admin User Authenticated Successfully', `${newSession.user.name} (${newSession.user.role})`);
  };

  const handleLogout = () => {
    if (session) {
      handleLogAudit('Admin User Logged Out', `${session.user.name} (${session.user.role})`);
    }
    setSession(null);
  };

  const handleRoleSwitch = (newRole: AdminRole) => {
    if (!session) return;
    const targetUser = ADMIN_USERS.find(u => u.role === newRole) || {
      ...session.user,
      role: newRole
    };
    setSession(prev => prev ? {
      ...prev,
      user: {
        ...prev.user,
        role: newRole,
        name: targetUser.name,
        email: targetUser.email,
        title: targetUser.title,
        campus: targetUser.campus
      }
    } : null);
    handleLogAudit('Switched Administrative Role (RBAC Testing)', `Role switched to: ${newRole}`);
  };

  // CRUD Handlers
  const handleAddSchool = (s: Omit<School, 'id'>) => {
    const newSchool: School = {
      ...s,
      id: `school-${Date.now()}`
    };
    setSchools(prev => [...prev, newSchool]);
  };

  const handleUpdateSchool = (id: string, updates: Partial<School>) => {
    setSchools(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleDeleteSchool = (id: string) => {
    setSchools(prev => prev.filter(s => s.id !== id));
  };

  const handleAddCampus = (campus: AdminCampus) => {
    setCampuses(prev => [...prev, campus]);
  };

  const handleUpdateCampus = (id: string, updates: Partial<AdminCampus>) => {
    setCampuses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleAddDepartment = (dept: AdminDepartment) => {
    setDepartments(prev => [...prev, dept]);
  };

  const handleUpdateDepartment = (id: string, updates: Partial<AdminDepartment>) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const handleAddProgram = (prog: AdminProgram) => {
    setPrograms(prev => [...prev, prog]);
  };

  const handleUpdateProgram = (id: string, updates: Partial<AdminProgram>) => {
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleAddStudent = (stu: AdminStudentProfile) => {
    setStudents(prev => [stu, ...prev]);
  };

  const handleUpdateStudent = (id: string, updates: Partial<AdminStudentProfile>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleAddLecturer = (lec: AdminLecturerProfile) => {
    setLecturers(prev => [...prev, lec]);
  };

  const handleUpdateLecturer = (id: string, updates: Partial<AdminLecturerProfile>) => {
    setLecturers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const handleUpdateEnrollmentStatus = (id: string, status: EnrollmentStatus) => {
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  const handleUpdateHonoraryStatus = (id: string, status: HonoraryStatus, comments?: string, certNo?: string) => {
    setHonoraryApps(prev => prev.map(a => a.id === id ? {
      ...a,
      status,
      reviewComments: comments !== undefined ? comments : a.reviewComments,
      awardCertificateNumber: certNo !== undefined ? certNo : a.awardCertificateNumber,
      decisionDate: (status === 'Approved' || status === 'Rejected' || status === 'Awarded')
        ? (a.decisionDate || new Date().toISOString().slice(0, 10))
        : a.decisionDate
    } : a));
  };

  const handleAddHonoraryNomination = (app: HonoraryApplication) => {
    setHonoraryApps(prev => [app, ...prev]);
  };

  // Aggregate Data for Global Search in Header
  const globalSearchData = useMemo(() => ({
    students: students.map(s => ({ id: s.id, name: s.fullName, admNo: s.admissionNumber, email: s.email, program: s.program })),
    lecturers: lecturers.map(l => ({ id: l.id, name: l.name, email: l.email, school: l.school })),
    programs: programs.map(p => ({ id: p.id, name: p.name, code: p.code })),
    campuses: campuses.map(c => ({ id: c.id, name: c.name, city: c.city, country: c.country })),
    honorary: honoraryApps.map(h => ({ id: h.id, candidateName: h.candidateName, appNo: h.applicationNumber })),
    certificates: [
      { id: 'cert-1', studentName: 'Rev. David K. Ndungu', certNo: 'BIBU-CERT-2026-0881', degree: 'Doctor of Ministry' },
      { id: 'cert-2', studentName: 'Bishop Grace M. Mutua', certNo: 'BIBU-CERT-2026-0122', degree: 'Master of Arts in Biblical Leadership' }
    ]
  }), [students, lecturers, programs, campuses, honoraryApps]);

  // If not logged in, render Admin Login screen
  if (!session) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        activeSession={session}
        onLogout={handleLogout}
      />
    );
  }

  // Dashboard Stats
  const dashboardStats = {
    totalStudents: students.length * 955, // scaled to represent full university size
    pastStudents: pastStudents.length * 480,
    lecturers: lecturers.length * 16,
    schools: schools.length,
    departments: departments.length,
    programs: programs.length,
    activeEnrollments: enrollments.length * 280,
    coursesInProgress: coursesInProgress.length * 340,
    pendingHonorary: honoraryApps.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length,
    graduates: 182,
    examCandidates: 490,
    rplCandidates: 42
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased">
      {/* 45-Item Sidebar */}
      <AdminSidebar
        activeItem={activeItem}
        onSelectItem={(item) => setActiveItem(item)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        pendingHonoraryCount={dashboardStats.pendingHonorary}
        pendingEnrollmentsCount={enrollments.filter(e => e.status === 'Pending').length}
        activeStudentsCount={dashboardStats.totalStudents}
        onLogout={handleLogout}
      />

      {/* Main Content Area (Offset by Sidebar on Desktop) */}
      <div className="lg:pl-72 flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <AdminHeader
          session={session}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onRoleSwitch={handleRoleSwitch}
          onNavigate={(item) => setActiveItem(item)}
          onLogout={handleLogout}
          allSearchData={globalSearchData}
        />

        {/* Dynamic Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeItem === 'dashboard' && (
            <AdminDashboardOverview
              stats={dashboardStats}
              onNavigate={(item) => setActiveItem(item)}
              adminName={session.user.name}
              adminRole={session.user.role}
              campus={session.user.campus}
            />
          )}

          {activeItem === 'honorary-applications' && (
            <HonoraryApplicationsManager
              applications={honoraryApps}
              onUpdateStatus={handleUpdateHonoraryStatus}
              onAddApplication={handleAddHonoraryNomination}
              onLogAudit={handleLogAudit}
            />
          )}

          {activeItem === 'schools' && (
            <SchoolsManager
              schools={schools}
              students={students}
              lecturers={lecturers}
              onAddSchool={handleAddSchool}
              onUpdateSchool={handleUpdateSchool}
              onDeleteSchool={handleDeleteSchool}
              onLogAudit={handleLogAudit}
            />
          )}

          {activeItem === 'campuses' && (
            <CampusesManager
              campuses={campuses}
              onAddCampus={handleAddCampus}
              onUpdateCampus={handleUpdateCampus}
              onLogAudit={handleLogAudit}
            />
          )}

          {activeItem === 'departments' && (
            <DepartmentsManager
              departments={departments}
              schools={schools}
              students={students}
              lecturers={lecturers}
              onAddDepartment={handleAddDepartment}
              onUpdateDepartment={handleUpdateDepartment}
              onLogAudit={handleLogAudit}
            />
          )}

          {activeItem === 'programs' && (
            <ProgramsManager
              programs={programs}
              schools={schools}
              onAddProgram={handleAddProgram}
              onUpdateProgram={handleUpdateProgram}
              onLogAudit={handleLogAudit}
            />
          )}

          {activeItem === 'students' && (
            <StudentsManager
              students={students}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onLogAudit={handleLogAudit}
            />
          )}

          {activeItem === 'past-students' && (
            <PastStudentsManager
              pastStudents={pastStudents}
              onLogAudit={handleLogAudit}
            />
          )}

          {activeItem === 'lecturers' && (
            <LecturersManager
              lecturers={lecturers}
              schools={schools}
              onAddLecturer={handleAddLecturer}
              onUpdateLecturer={handleUpdateLecturer}
              onLogAudit={handleLogAudit}
            />
          )}

          {activeItem === 'enrollments' && (
            <EnrollmentsManager
              enrollments={enrollments}
              onUpdateStatus={handleUpdateEnrollmentStatus}
              onLogAudit={handleLogAudit}
            />
          )}

          {activeItem === 'courses-in-progress' && (
            <CoursesInProgressManager
              courses={coursesInProgress}
              onLogAudit={handleLogAudit}
            />
          )}

          {activeItem === 'system-roles' && (
            <RolesAndPermissionsManager
              currentRole={session.user.role}
              onLogAudit={handleLogAudit}
            />
          )}

          {activeItem === 'system-audit-logs' && (
            <AuditLogsManager logs={auditLogs} />
          )}

          {/* Fallback for all other 45 items */}
          {![
            'dashboard',
            'honorary-applications',
            'schools',
            'campuses',
            'departments',
            'programs',
            'students',
            'past-students',
            'lecturers',
            'enrollments',
            'courses-in-progress',
            'system-roles',
            'system-audit-logs'
          ].includes(activeItem) && (
            <SecondaryAdminModules
              activeItem={activeItem}
              onLogAudit={handleLogAudit}
              fullDatabaseState={{
                schools,
                campuses,
                departments,
                programs,
                students,
                pastStudents,
                lecturers,
                enrollments,
                coursesInProgress,
                honoraryApps,
                auditLogs
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};
