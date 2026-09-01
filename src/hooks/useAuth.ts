import { useCallback, useMemo } from 'react';
import { useApp, CurrentView, RegisterUserData } from '../context/AppContext';
import { User, Role } from '../types';

export interface PortalAccessRule {
  key: 'student' | 'faculty' | 'admin' | 'alumni' | 'fellowships' | 'account';
  name: string;
  defaultView: CurrentView;
  allowedRoles: Role[];
  description: string;
}

export const PORTAL_ACCESS_RULES: Record<'student' | 'faculty' | 'admin' | 'alumni' | 'fellowships' | 'account', PortalAccessRule> = {
  student: {
    key: 'student',
    name: 'Student Learning Portal & LMS',
    defaultView: 'student-dashboard',
    allowedRoles: ['student', 'faculty', 'admin', 'registrar', 'examiner', 'moderator', 'superadmin'],
    description: 'Online degree classrooms, video lectures, assignments, and exam taking.'
  },
  faculty: {
    key: 'faculty',
    name: 'Faculty & Instructor Academic Portal',
    defaultView: 'faculty-portal',
    allowedRoles: ['faculty', 'admin', 'registrar', 'examiner', 'moderator', 'superadmin'],
    description: 'Course curriculum authoring, student gradebook, assignment evaluation, and exam moderation.'
  },
  admin: {
    key: 'admin',
    name: 'University Administration & Registrar Portal',
    defaultView: 'admin-portal',
    allowedRoles: ['admin', 'registrar', 'superadmin'],
    description: 'Institutional records, admissions adjudication, live CMS editor, and degree conferrals.'
  },
  alumni: {
    key: 'alumni',
    name: 'BIBU Alumni & Ministerial Association',
    defaultView: 'alumni',
    allowedRoles: ['alumni', 'student', 'faculty', 'admin', 'registrar', 'ministry_member', 'superadmin'],
    description: 'Global ministerial directory, graduate networking, and mentorship exchange.'
  },
  fellowships: {
    key: 'fellowships',
    name: 'Global Ministry Fellowships & Alliances',
    defaultView: 'fellowships',
    allowedRoles: ['ministry_member', 'student', 'faculty', 'admin', 'alumni', 'registrar', 'registered', 'superadmin'],
    description: 'International prayer networks, church planting cohorts, and missions alliances.'
  },
  account: {
    key: 'account',
    name: 'My BIBU Account & Security Settings',
    defaultView: 'account',
    allowedRoles: ['student', 'faculty', 'admin', 'registrar', 'examiner', 'admissions', 'alumni', 'ministry_member', 'moderator', 'superadmin', 'registered'],
    description: 'Centralized institutional account management, multi-factor security, and authorized portals.'
  }
};

export interface UseAuthReturn {
  // Current user & authentication state
  user: User;
  isAuthenticated: boolean;
  isGuest: boolean;
  role: Role;
  allUsers: User[];

  // Role checks
  isStudent: boolean;
  isFaculty: boolean;
  isAdmin: boolean;
  isAlumni: boolean;
  isMinistryMember: boolean;
  hasRole: (roles: Role | Role[]) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  canAccessPortal: (portalKey: 'student' | 'faculty' | 'admin' | 'alumni' | 'fellowships' | 'account') => boolean;

  // Authentication actions
  login: (email: string, password?: string) => { success: boolean; error?: string };
  register: (data: RegisterUserData) => { success: boolean; error?: string };
  logout: () => void;
  switchRole: (role: Role) => void;

  // Routing & Redirection Helpers
  authTargetPortal: CurrentView | null;
  setAuthTargetPortal: (portal: CurrentView | null) => void;
  authMessage: string | null;
  setAuthMessage: (msg: string | null) => void;
  redirectToLogin: (targetPortal?: CurrentView, message?: string) => void;
  redirectToRegister: (targetPortal?: CurrentView, message?: string) => void;
  navigateToAuthorizedDashboard: () => void;
  requireAuth: (allowedRoles?: Role[], targetView?: CurrentView, message?: string) => boolean;
}

/**
 * Secure useAuth hook
 * Provides centralized authentication state, role verification, and interceptor utilities
 */
export const useAuth = (): UseAuthReturn => {
  const {
    currentUser,
    allUsers,
    setCurrentView,
    switchRole,
    loginUser,
    registerUser,
    logoutUser,
    authTargetPortal,
    setAuthTargetPortal,
    authMessage,
    setAuthMessage,
    requireAuth: appRequireAuth
  } = useApp();

  const isGuest = currentUser.role === 'guest';
  const isAuthenticated = !isGuest;
  const role = currentUser.role;

  // Role specific convenience flags
  const isStudent = useMemo(() => ['student', 'registered'].includes(role), [role]);
  const isFaculty = useMemo(() => ['faculty', 'examiner', 'moderator', 'admin', 'superadmin'].includes(role), [role]);
  const isAdmin = useMemo(() => ['admin', 'superadmin', 'registrar'].includes(role), [role]);
  const isAlumni = useMemo(() => role === 'alumni', [role]);
  const isMinistryMember = useMemo(() => role === 'ministry_member', [role]);

  // Check if current user possesses one or more roles
  const hasRole = useCallback((roles: Role | Role[]): boolean => {
    if (isGuest) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(currentUser.role);
  }, [currentUser.role, isGuest]);

  const hasAnyRole = useCallback((roles: Role[]): boolean => {
    if (isGuest) return false;
    return roles.includes(currentUser.role);
  }, [currentUser.role, isGuest]);

  // Check if user is authorized to access a given portal
  const canAccessPortal = useCallback((portalKey: 'student' | 'faculty' | 'admin' | 'alumni' | 'fellowships' | 'account'): boolean => {
    if (isGuest) return false;
    const rule = PORTAL_ACCESS_RULES[portalKey];
    if (!rule) return false;
    return rule.allowedRoles.includes(currentUser.role);
  }, [currentUser.role, isGuest]);

  // Safe redirect helper to Login page with target destination tracking
  const redirectToLogin = useCallback((targetPortal?: CurrentView, message?: string) => {
    if (targetPortal) {
      setAuthTargetPortal(targetPortal);
    }
    if (message) {
      setAuthMessage(message);
    }
    setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentView, setAuthTargetPortal, setAuthMessage]);

  // Safe redirect helper to Registration page
  const redirectToRegister = useCallback((targetPortal?: CurrentView, message?: string) => {
    if (targetPortal) {
      setAuthTargetPortal(targetPortal);
    }
    if (message) {
      setAuthMessage(message);
    }
    setCurrentView('create-account');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentView, setAuthTargetPortal, setAuthMessage]);

  // Navigate to primary dashboard suited to user's active role
  const navigateToAuthorizedDashboard = useCallback(() => {
    if (isGuest) {
      setCurrentView('login');
      return;
    }
    switch (currentUser.role) {
      case 'student':
        setCurrentView('student-dashboard');
        break;
      case 'faculty':
      case 'examiner':
      case 'moderator':
        setCurrentView('faculty-portal');
        break;
      case 'admin':
      case 'registrar':
      case 'superadmin':
        setCurrentView('admin-portal');
        break;
      case 'alumni':
        setCurrentView('alumni');
        break;
      case 'ministry_member':
        setCurrentView('fellowships');
        break;
      case 'registered':
      default:
        setCurrentView('account');
        break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentUser.role, isGuest, setCurrentView]);

  return {
    user: currentUser,
    isAuthenticated,
    isGuest,
    role,
    allUsers,

    isStudent,
    isFaculty,
    isAdmin,
    isAlumni,
    isMinistryMember,
    hasRole,
    hasAnyRole,
    canAccessPortal,

    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    switchRole,

    authTargetPortal,
    setAuthTargetPortal,
    authMessage,
    setAuthMessage,
    redirectToLogin,
    redirectToRegister,
    navigateToAuthorizedDashboard,
    requireAuth: appRequireAuth
  };
};

export default useAuth;
