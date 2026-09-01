import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { User, Role, AccountType } from '../../../types';
import {
  Users,
  Shield,
  ShieldCheck,
  UserPlus,
  Edit2,
  Lock,
  Unlock,
  KeyRound,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Sliders,
  Eye,
  EyeOff,
  Settings,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Clock,
  History,
  GraduationCap,
  Briefcase,
  Award,
  Globe2,
  BookOpen,
  Plus
} from 'lucide-react';

export const UsersAndPortalsTab: React.FC = () => {
  const {
    allUsers,
    currentUser,
    updateUser,
    createUser,
    courses,
    academicPrograms,
    enrollStudentInCourse,
    unenrollStudentFromCourse,
    assignStudentProgram
  } = useApp();

  const [subTab, setSubTab] = useState<'users' | 'portals-config'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUserForEnrolment, setSelectedUserForEnrolment] = useState<User | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New User Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('student');
  const [newUserCountry, setNewUserCountry] = useState('United States');
  const [newUserTitle, setNewUserTitle] = useState('');
  const [newUserProgram, setNewUserProgram] = useState('');

  // Portal Management Settings State (Section 25)
  const [portalSettings, setPortalSettings] = useState([
    {
      id: 'student-portal',
      name: 'Student Learning Portal',
      description: 'LMS, Classroom, Grades & Exams',
      visible: true,
      maintenanceMode: false,
      requiresVerification: true,
      allowedRoles: ['student', 'admin', 'registrar', 'superadmin'],
      defaultLandingPage: 'student-dashboard'
    },
    {
      id: 'faculty-portal',
      name: 'Faculty & Instructor Portal',
      description: 'Grading, Lectures & Courses',
      visible: true,
      maintenanceMode: false,
      requiresVerification: true,
      allowedRoles: ['faculty', 'admin', 'superadmin'],
      defaultLandingPage: 'faculty-portal'
    },
    {
      id: 'admin-portal',
      name: 'Admin Portal & CMS',
      description: 'Full Site CMS — Edit & Manage the Whole Site',
      visible: true,
      maintenanceMode: false,
      requiresVerification: true,
      allowedRoles: ['admin', 'registrar', 'superadmin'],
      defaultLandingPage: 'admin-portal'
    },
    {
      id: 'alumni-portal',
      name: 'Alumni & Ministerial Network',
      description: 'Global Alumni & Ministry Fellowship (14,500+)',
      visible: true,
      maintenanceMode: false,
      requiresVerification: false,
      allowedRoles: ['alumni', 'student', 'faculty', 'admin', 'registrar', 'superadmin', 'registered', 'ministry_member'],
      defaultLandingPage: 'alumni'
    },
    {
      id: 'fellowships-portal',
      name: 'Global Ministry Fellowships',
      description: 'Connect • Fellowship • Serve • Grow (12 Fellowships)',
      visible: true,
      maintenanceMode: false,
      requiresVerification: false,
      allowedRoles: ['student', 'faculty', 'alumni', 'admin', 'registrar', 'superadmin', 'registered', 'ministry_member'],
      defaultLandingPage: 'fellowships'
    }
  ]);

  const filteredUsers = allUsers.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.studentId && u.studentId.toLowerCase().includes(q)) ||
      (u.country && u.country.toLowerCase().includes(q))
    );
  });

  const handleRoleChange = (userId: string, newRole: Role) => {
    updateUser(userId, { role: newRole });
    setActionSuccess(`User role updated to ${newRole.toUpperCase()}`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleStatusToggle = (user: User) => {
    const nextStatus = user.status === 'suspended' ? 'active' : 'suspended';
    updateUser(user.id, { status: nextStatus });
    setActionSuccess(`User account status set to ${nextStatus.toUpperCase()}`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleVerificationToggle = (user: User) => {
    const nextVerif = user.verificationStatus === 'verified' ? 'unverified' : 'verified';
    updateUser(user.id, { verificationStatus: nextVerif });
    setActionSuccess(`User verification status updated to ${nextVerif.toUpperCase()}`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    createUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      password: 'password123',
      role: newUserRole,
      country: newUserCountry,
      title: newUserTitle.trim() || undefined,
      status: 'active',
      verificationStatus: 'verified',
      program: newUserProgram || undefined,
      studentId: newUserRole === 'student' ? `BIBU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      enrolledCourseIds: newUserRole === 'student' ? ['crs-herm-101', 'crs-sys-201', 'crs-nt-301'] : [],
      creditsEarned: newUserRole === 'student' ? 0 : undefined,
      totalRequiredCredits: newUserRole === 'student' ? 120 : undefined,
      createdAt: new Date().toISOString().split('T')[0]
    });

    setShowCreateModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserProgram('');
    setActionSuccess(`New user account successfully created with role: ${newUserRole.toUpperCase()}`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const togglePortalVisibility = (portalId: string) => {
    setPortalSettings(prev =>
      prev.map(p => (p.id === portalId ? { ...p, visible: !p.visible } : p))
    );
    setActionSuccess('Portal visibility settings updated live.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const toggleMaintenanceMode = (portalId: string) => {
    setPortalSettings(prev =>
      prev.map(p => (p.id === portalId ? { ...p, maintenanceMode: !p.maintenanceMode } : p))
    );
    setActionSuccess('Portal maintenance mode status toggled.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Subtab navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('users')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 ${
              subTab === 'users' ? 'bg-[#002366] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User & RBAC Management ({allUsers.length})</span>
          </button>

          <button
            onClick={() => setSubTab('portals-config')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 ${
              subTab === 'portals-config' ? 'bg-[#002366] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Portal Management Settings (5 Portals)</span>
          </button>
        </div>

        {actionSuccess && (
          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
        )}
      </div>

      {/* SUBTAB 1: USER & RBAC MANAGEMENT */}
      {subTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold font-display text-[#002366]">
                Institutional User Directory & Permissions Control
              </h3>
              <p className="text-xs text-slate-500">
                Grant or revoke roles, verify academic credentials, toggle active/suspended status, and manage password resets.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Provision New User</span>
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, student ID, country..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] bg-white font-medium"
              >
                <option value="all">All Roles ({allUsers.length})</option>
                <option value="student">Students</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Administrators</option>
                <option value="registrar">Registrars</option>
                <option value="alumni">Alumni</option>
                <option value="registered">Registered General</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F9FB] text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-3 px-3">User & Identity</th>
                  <th className="py-3 px-3">Assigned Role (RBAC)</th>
                  <th className="py-3 px-3">Academic Enrolment</th>
                  <th className="py-3 px-3">Country & Title</th>
                  <th className="py-3 px-3">Verification</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-[#F8F9FB] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#002366] font-display">{user.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                      {(user.studentId || user.facultyId) && (
                        <div className="text-[10px] text-[#C5A059] font-mono font-bold">
                          ID: {user.studentId || user.facultyId}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <select
                        value={user.role}
                        onChange={e => handleRoleChange(user.id, e.target.value as Role)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-300 bg-white uppercase tracking-wider text-[#002366] focus:ring-1 focus:ring-[#002366]"
                      >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="registrar">Registrar</option>
                        <option value="examiner">Examiner</option>
                        <option value="admissions">Admissions</option>
                        <option value="alumni">Alumni</option>
                        <option value="ministry_member">Ministry Member</option>
                        <option value="admin">Administrator</option>
                        <option value="superadmin">Super Admin</option>
                        <option value="registered">Registered User</option>
                      </select>
                    </td>

                    {/* Academic Enrolment Column */}
                    <td className="py-3 px-3">
                      {user.role === 'student' ? (
                        <div className="space-y-1">
                          <div className="text-[11px] font-bold text-slate-800 line-clamp-1">
                            {user.program || 'General Theological Studies'}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold font-mono">
                              {(user.enrolledCourseIds || []).length} Courses Enrolled
                            </span>
                            <button
                              onClick={() => setSelectedUserForEnrolment(user)}
                              className="text-[10px] text-[#002366] font-bold underline hover:text-[#C5A059]"
                            >
                              Manage
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">N/A ({user.role})</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-slate-700">
                      <div>{user.country}</div>
                      {user.title && <div className="text-[10px] text-slate-500 font-medium">{user.title}</div>}
                    </td>

                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleVerificationToggle(user)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                          user.verificationStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {user.verificationStatus === 'verified' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleStatusToggle(user)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          user.status === 'suspended'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {user.status === 'suspended' ? 'Suspended' : 'Active'}
                      </button>
                    </td>

                    <td className="py-3 px-3 text-right space-x-1.5">
                      {user.role === 'student' && (
                        <button
                          onClick={() => setSelectedUserForEnrolment(user)}
                          className="px-2.5 py-1 rounded bg-[#002366] hover:bg-[#001A4D] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs"
                        >
                          Enrolments
                        </button>
                      )}
                      <button
                        onClick={() => alert(`Password reset link dispatched for ${user.email}.`)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider"
                      >
                        Reset Pwd
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: PORTAL MANAGEMENT SETTINGS (SECTION 25) */}
      {subTab === 'portals-config' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold font-display text-[#002366]">
              University Portal Architecture & Visibility Configuration
            </h3>
            <p className="text-xs text-slate-500">
              Configure portal titles, descriptions, access policies, verification mandates, and maintenance mode controls.
            </p>
          </div>

          <div className="space-y-4">
            {portalSettings.map(portal => (
              <div
                key={portal.id}
                className="p-5 rounded-2xl border border-slate-200 bg-[#F8F9FB] space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold font-display text-[#002366]">
                        {portal.name}
                      </h4>
                      <span className="px-2 py-0.5 bg-[#002366] text-[#C5A059] text-[10px] font-bold rounded">
                        Target: {portal.defaultLandingPage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{portal.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePortalVisibility(portal.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        portal.visible
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {portal.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{portal.visible ? 'Visible' : 'Hidden'}</span>
                    </button>

                    <button
                      onClick={() => toggleMaintenanceMode(portal.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        portal.maintenanceMode
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{portal.maintenanceMode ? 'In Maintenance' : 'Live Active'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Authorized Roles:</span>
                    <div className="flex flex-wrap gap-1">
                      {portal.allowedRoles.map(r => (
                        <span key={r} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-[#002366]">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-500">
                      Mandatory Verification Required: {portal.requiresVerification ? 'YES' : 'NO'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold font-display text-[#002366] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#C5A059]" />
                <span>Provision New User</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  placeholder="e.g. Pastor Samuel Addo"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  placeholder="name@bibu-edu.org"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Role *</label>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value as Role)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="registrar">Registrar</option>
                    <option value="examiner">Examiner</option>
                    <option value="admissions">Admissions</option>
                    <option value="alumni">Alumni</option>
                    <option value="admin">Administrator</option>
                    <option value="registered">Registered</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Country *</label>
                  <input
                    type="text"
                    required
                    value={newUserCountry}
                    onChange={e => setNewUserCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Title / Ministry Role</label>
                <input
                  type="text"
                  value={newUserTitle}
                  onChange={e => setNewUserTitle(e.target.value)}
                  placeholder="e.g. Lead Pastor / Missionary"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              {newUserRole === 'student' && (
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Academic Degree Programme</label>
                  <select
                    value={newUserProgram}
                    onChange={e => setNewUserProgram(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="">Select Degree Programme...</option>
                    {academicPrograms.map(p => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.level})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#002366] text-white rounded-xl font-bold uppercase tracking-wider shadow-sm"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT ENROLMENT & PROGRAM MANAGEMENT MODAL */}
      {selectedUserForEnrolment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-7 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
                  Registrar / Academic Office
                </span>
                <h3 className="text-base sm:text-lg font-bold font-display text-[#002366] flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#C5A059]" />
                  <span>Manage Student Enrolments & Program</span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedUserForEnrolment(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Student Info Card */}
            <div className="p-4 rounded-xl bg-[#F8F9FB] border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Student Name:</span>
                <div className="font-bold text-[#002366] font-display text-sm">{selectedUserForEnrolment.name}</div>
                <div className="text-slate-500 font-mono text-[11px]">{selectedUserForEnrolment.email}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Student ID Number:</span>
                <div className="font-bold font-mono text-[#C5A059]">
                  {selectedUserForEnrolment.studentId || (
                    <button
                      onClick={() => {
                        const newId = `BIBU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
                        updateUser(selectedUserForEnrolment.id, { studentId: newId });
                        setSelectedUserForEnrolment({ ...selectedUserForEnrolment, studentId: newId });
                      }}
                      className="text-blue-600 underline font-sans text-xs"
                    >
                      Generate Student ID
                    </button>
                  )}
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Status: <span className="font-bold uppercase text-emerald-700">{selectedUserForEnrolment.status}</span>
                </div>
              </div>
            </div>

            {/* Degree Programme Assignment */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Assigned Degree Programme:
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedUserForEnrolment.program || ''}
                  onChange={(e) => {
                    const prog = e.target.value;
                    assignStudentProgram(selectedUserForEnrolment.id, prog);
                    setSelectedUserForEnrolment({ ...selectedUserForEnrolment, program: prog });
                  }}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-[#002366]"
                >
                  <option value="">-- Unassigned (General Theological Studies) --</option>
                  {academicPrograms.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.level} • {p.totalCredits} Credits)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Course Enrolments Toggles */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#002366]" />
                  <span>Enrolled Courses Access Authorization ({(selectedUserForEnrolment.enrolledCourseIds || []).length} / {courses.length})</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const allIds = courses.map(c => c.id);
                      updateUser(selectedUserForEnrolment.id, { enrolledCourseIds: allIds });
                      setSelectedUserForEnrolment({ ...selectedUserForEnrolment, enrolledCourseIds: allIds });
                    }}
                    className="text-[10px] text-[#002366] font-bold hover:underline"
                  >
                    Enroll All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={() => {
                      updateUser(selectedUserForEnrolment.id, { enrolledCourseIds: [] });
                      setSelectedUserForEnrolment({ ...selectedUserForEnrolment, enrolledCourseIds: [] });
                    }}
                    className="text-[10px] text-rose-600 font-bold hover:underline"
                  >
                    Unenroll All
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {courses.map((course) => {
                  const isEnrolled = (selectedUserForEnrolment.enrolledCourseIds || []).includes(course.id);
                  return (
                    <div
                      key={course.id}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isEnrolled
                          ? 'bg-blue-50/50 border-blue-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-[#002366]">
                            {course.code}
                          </span>
                          <span className="text-xs font-bold text-slate-900 font-display">
                            {course.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {course.creditHours} Credits • Instructor: {course.instructorName}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (isEnrolled) {
                            unenrollStudentFromCourse(selectedUserForEnrolment.id, course.id);
                            setSelectedUserForEnrolment({
                              ...selectedUserForEnrolment,
                              enrolledCourseIds: (selectedUserForEnrolment.enrolledCourseIds || []).filter(id => id !== course.id)
                            });
                          } else {
                            enrollStudentInCourse(selectedUserForEnrolment.id, course.id);
                            setSelectedUserForEnrolment({
                              ...selectedUserForEnrolment,
                              enrolledCourseIds: [...(selectedUserForEnrolment.enrolledCourseIds || []), course.id]
                            });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                          isEnrolled
                            ? 'bg-emerald-600 text-white hover:bg-rose-600 hover:text-white'
                            : 'bg-[#002366] text-white hover:bg-[#001A4D]'
                        }`}
                      >
                        {isEnrolled ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Enrolled</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Grant Access</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedUserForEnrolment(null);
                  setActionSuccess('Student academic enrolments successfully updated.');
                  setTimeout(() => setActionSuccess(null), 3500);
                }}
                className="px-6 py-2.5 bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
