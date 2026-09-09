import React, { useState } from 'react';
import {
  KeyRound,
  Shield,
  CheckCircle2,
  Users,
  Lock,
  Check,
  X
} from 'lucide-react';
import { AdminRole, AdminUser } from '../../../types/admin';
import { ADMIN_USERS } from '../../../data/adminData';

interface RolesAndPermissionsManagerProps {
  currentRole: AdminRole;
  onLogAudit: (action: string, record: string, details?: string) => void;
}

interface PermissionCategory {
  category: string;
  permissions: {
    key: string;
    label: string;
    description: string;
  }[];
}

export const RolesAndPermissionsManager: React.FC<RolesAndPermissionsManagerProps> = ({
  currentRole,
  onLogAudit
}) => {
  const [selectedRole, setSelectedRole] = useState<AdminRole>('Super Administrator');
  const [notification, setNotification] = useState<string | null>(null);

  const permissionMatrix: PermissionCategory[] = [
    {
      category: 'Academic & Curriculum',
      permissions: [
        { key: 'acad.schools', label: 'Manage Schools & Faculties', description: 'Create, edit, and archive faculties and deans' },
        { key: 'acad.programs', label: 'Accredit Programs & Curricula', description: 'Manage degrees, units, and credit hours' },
        { key: 'acad.departments', label: 'Manage Departments', description: 'Assign department heads and syllabus tracks' }
      ]
    },
    {
      category: 'Honorary & Senate Awards',
      permissions: [
        { key: 'hon.view', label: 'View Honorary Nominations', description: 'Access pastoral candidate nomination dossiers' },
        { key: 'hon.adjudicate', label: 'Senate Adjudication & Conferral', description: 'Approve or reject Doctor of Divinity credentials' },
        { key: 'hon.citation', label: 'Issue Academic Citations', description: 'Generate and print official Senate citation diplomas' }
      ]
    },
    {
      category: 'Students Information System (SIS)',
      permissions: [
        { key: 'sis.enroll', label: 'Student Admissions & Enrollment', description: 'Process admissions and student registrations' },
        { key: 'sis.grades', label: 'Course Progress & Grades Entry', description: 'Submit and moderate trimester examination marks' },
        { key: 'sis.transcripts', label: 'Issue Official Transcripts', description: 'Generate GPA and registrar authenticated transcripts' },
        { key: 'sis.graduation', label: 'Graduation Clearance', description: 'Approve candidates for degree convocation' }
      ]
    },
    {
      category: 'Examinations & RPL',
      permissions: [
        { key: 'exam.centers', label: 'Manage Examination Centers', description: 'Assign regional hubs across nations & Kenya counties' },
        { key: 'exam.results', label: 'Moderate Examination Results', description: 'Publish final academic results and passes' },
        { key: 'rpl.portfolios', label: 'RPL Prior Learning Assessments', description: 'Evaluate ministerial portfolio credit hours' }
      ]
    },
    {
      category: 'Finance & Bursar',
      permissions: [
        { key: 'fin.fees', label: 'Tuition & Fee Structures', description: 'Set degree program tuition and payment policies' },
        { key: 'fin.payments', label: 'Verify Student Fee Payments', description: 'Reconcile receipts, balances, and scholarships' }
      ]
    },
    {
      category: 'Security & System Governance',
      permissions: [
        { key: 'sys.users', label: 'Admin User Management', description: 'Create and revoke administrator logins' },
        { key: 'sys.audit', label: 'View Immutable Audit Trail', description: 'Inspect timestamped administrative activity logs' },
        { key: 'sys.backup', label: 'Database Backup & Disaster Recovery', description: 'Export full database snapshot and system state' }
      ]
    }
  ];

  // Default permission sets per role
  const rolePermissions: Record<AdminRole, string[]> = {
    'Super Administrator': ['all'],
    'Registrar': ['acad.schools', 'acad.programs', 'acad.departments', 'hon.view', 'hon.citation', 'sis.enroll', 'sis.grades', 'sis.transcripts', 'sis.graduation', 'exam.results', 'sys.audit'],
    'Academic Dean': ['acad.schools', 'acad.programs', 'acad.departments', 'hon.view', 'sis.grades', 'sis.transcripts', 'exam.results', 'rpl.portfolios'],
    'Examination Officer': ['exam.centers', 'exam.results', 'sis.grades', 'sis.transcripts'],
    'Finance Administrator': ['fin.fees', 'fin.payments', 'sis.enroll', 'sis.graduation'],
    'RPL Coordinator': ['rpl.portfolios', 'acad.programs', 'sis.enroll'],
    'Lecturer': ['sis.grades'],
    'Campus Administrator': ['sis.enroll', 'exam.centers']
  };

  const hasPermission = (role: AdminRole, permKey: string) => {
    const list = rolePermissions[role] || [];
    return list.includes('all') || list.includes(permKey);
  };

  const handleSavePolicy = () => {
    onLogAudit('Updated RBAC Role Policy', `Role: ${selectedRole}`);
    setNotification(`Access control policy for "${selectedRole}" updated and enforced.`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider mb-1">
            <KeyRound className="w-4 h-4" />
            <span>Role-Based Access Control (RBAC) Governance</span>
          </div>
          <h2 className="text-xl font-display font-black text-[#002366]">
            Roles & Permissions Security Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic role assignments across Chancellor, Registrar, Academic Deans, Examination Controllers, and Bursar personnel.
          </p>
        </div>

        <button
          onClick={handleSavePolicy}
          className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001845] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Shield className="w-4 h-4 text-[#C5A059]" />
          <span>Enforce Policy</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Role Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(rolePermissions) as AdminRole[]).map(r => (
          <button
            key={r}
            type="button"
            onClick={() => setSelectedRole(r)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedRole === r
                ? 'bg-[#002366] text-[#C5A059] shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Permissions Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-[#002366] uppercase tracking-wider">
              Assigned Permissions for: <span className="text-[#C5A059]">{selectedRole}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {selectedRole === 'Super Administrator'
                ? 'Super Administrator holds unconditional sovereign clearance across all institutional modules.'
                : `Role-restricted authorization strictly scoped to ${selectedRole} domain.`}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {permissionMatrix.map(cat => (
            <div key={cat.category} className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                {cat.category}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {cat.permissions.map(perm => {
                  const allowed = hasPermission(selectedRole, perm.key);
                  return (
                    <div
                      key={perm.key}
                      className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs transition-colors ${
                        allowed
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                          : 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-70'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold block text-slate-900">{perm.label}</span>
                        <p className="text-[11px] text-slate-500">{perm.description}</p>
                      </div>

                      <span className={`p-1 rounded-full shrink-0 ${allowed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {allowed ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
