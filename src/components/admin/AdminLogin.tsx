import React, { useState, useEffect } from 'react';
import {
  Lock,
  Shield,
  ShieldCheck,
  AlertTriangle,
  LogIn,
  KeyRound,
  Eye,
  EyeOff,
  Clock,
  RefreshCw,
  Fingerprint,
  CheckCircle2,
  Server,
  UserCheck,
  HelpCircle,
  X
} from 'lucide-react';
import { UniversityLogo } from '../common/UniversityLogo';
import { AdminRole, AdminUser, AdminSession, FailedLoginRecord } from '../../types/admin';
import { ADMIN_USERS } from '../../data/adminData';

interface AdminLoginProps {
  onLoginSuccess: (session: AdminSession) => void;
  activeSession: AdminSession | null;
  onLogout: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  activeSession,
  onLogout
}) => {
  const [email, setEmail] = useState('chancellor@bibu-edu.org');
  const [password, setPassword] = useState('KingdomAdmin2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AdminRole>('Super Administrator');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Security & Password Hashing Demonstration
  const [passwordHash, setPasswordHash] = useState<string>('');

  // Lockout / Failed Login Protection
  const [failedAttempts, setFailedAttempts] = useState<FailedLoginRecord>({
    email: '',
    attempts: 0,
    lastAttempt: '',
    isLocked: false
  });
  const [lockoutRemainingSecs, setLockoutRemainingSecs] = useState<number>(0);

  // Password Reset Modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  // Compute live SHA-256 hash of password for security transparency
  useEffect(() => {
    let isMounted = true;
    const computeHash = async () => {
      if (!password) {
        setPasswordHash('');
        return;
      }
      try {
        const msgBuffer = new TextEncoder().encode(password + '::BIBU_SALT_2026');
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        if (isMounted) setPasswordHash(hashHex);
      } catch (e) {
        if (isMounted) setPasswordHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
      }
    };
    computeHash();
    return () => { isMounted = false; };
  }, [password]);

  // Lockout countdown timer
  useEffect(() => {
    let timer: any;
    if (lockoutRemainingSecs > 0) {
      timer = setInterval(() => {
        setLockoutRemainingSecs((prev) => {
          if (prev <= 1) {
            setFailedAttempts(f => ({ ...f, isLocked: false, attempts: 0 }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutRemainingSecs]);

  const handleQuickCredentialSelect = (admin: AdminUser) => {
    setEmail(admin.email);
    setPassword('KingdomAdmin2026!');
    setSelectedRole(admin.role);
    setErrorMessage(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Check Lockout
    if (failedAttempts.isLocked && lockoutRemainingSecs > 0) {
      setErrorMessage(`Security Lockout Active: Too many failed login attempts. Please wait ${lockoutRemainingSecs} seconds.`);
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both administrator email address and credential password.');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);

      // Verify user
      const matchedUser = ADMIN_USERS.find(
        u => u.email.toLowerCase() === email.trim().toLowerCase()
      ) || ADMIN_USERS.find(u => u.role === selectedRole);

      // Simulation of credential validation
      const isValidPassword = password.length >= 6;

      if (!isValidPassword) {
        const nextAttempts = failedAttempts.attempts + 1;
        const willLock = nextAttempts >= 5;
        setFailedAttempts({
          email,
          attempts: nextAttempts,
          lastAttempt: new Date().toISOString(),
          isLocked: willLock,
          lockedUntil: willLock ? Date.now() + 60000 : undefined
        });

        if (willLock) {
          setLockoutRemainingSecs(60);
          setErrorMessage('FAILED LOGIN PROTECTION TRIGGERED: Account temporarily locked for 60 seconds after 5 failed authentication attempts.');
        } else {
          setErrorMessage(`Invalid credentials. Attempt ${nextAttempts} of 5 before automated institutional lockout.`);
        }
        return;
      }

      // Successful login
      const adminToAuthenticate: AdminUser = matchedUser ? {
        ...matchedUser,
        role: selectedRole // allow switching role for administrative demo
      } : {
        id: 'adm-custom',
        name: 'Authorized Administrator',
        email: email.trim(),
        role: selectedRole,
        campus: 'Phoenix International Headquarters',
        title: 'Executive Institutional Administrator',
        permissions: ['all']
      };

      const now = new Date();
      const expires = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 8-hour session

      const session: AdminSession = {
        token: `BIBU-SEC-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now()}`,
        user: adminToAuthenticate,
        loginTime: now.toISOString(),
        expiresAt: expires.toISOString(),
        ipAddress: '198.51.100.42 (Phoenix High-Security Gateway)',
        device: navigator.userAgent.includes('Mac') ? 'macOS Safari / Enterprise Console' : 'Windows Edge / Enterprise Console',
        active: true
      };

      setSuccessMessage(`Authentication confirmed for ${adminToAuthenticate.name}. Redirecting to /admin/dashboard...`);
      setTimeout(() => {
        onLoginSuccess(session);
      }, 700);
    }, 600);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes('@')) {
      setResetStatus('Please provide a registered administrator email.');
      return;
    }
    setResetStatus(`A cryptographically signed password reset token has been dispatched to ${resetEmail}. If valid, follow institutional protocol.`);
    setTimeout(() => {
      setShowResetModal(false);
      setResetStatus(null);
      setResetEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#002366] via-[#C5A059] to-[#002366]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-slate-800/80 border border-[#C5A059]/40 shadow-2xl mb-4 backdrop-blur-md">
            <UniversityLogo size="lg" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>BIBU Central Administration Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            Institutional Administrator Portal
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Authorized administrative, academic dean, examination controller, and registrar personnel only. Unauthorized access attempts are monitored and recorded.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#002366] to-[#0a1931] p-4 sm:p-5 border-b border-[#C5A059]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Secure Admin Authentication
                </h2>
                <span className="text-[11px] text-slate-300 font-mono">
                  Standard 256-Bit TLS • Role-Based RBAC Gateway
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Gateway Online</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Error Notification */}
            {errorMessage && (
              <div className="p-4 bg-rose-950/80 border border-rose-700/60 rounded-xl text-rose-200 text-xs flex items-start gap-3 animate-shake">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Authentication Warning:</span>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-emerald-200 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-bold">{successMessage}</span>
              </div>
            )}

            {/* Lockout Warning Banner if Active */}
            {failedAttempts.isLocked && lockoutRemainingSecs > 0 && (
              <div className="p-4 bg-amber-950/80 border border-amber-600/80 rounded-xl text-amber-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>Account security lockout in progress:</span>
                </div>
                <span className="font-mono font-bold text-base text-amber-300">
                  {lockoutRemainingSecs}s remaining
                </span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  1. Administrative Role Assignment
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as AdminRole)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all"
                >
                  <option value="Super Administrator">Super Administrator (Chancellor & Senate Executive)</option>
                  <option value="Registrar">Registrar (Academic Records & Degree Conferral)</option>
                  <option value="Academic Dean">Academic Dean (Faculties & Curriculum)</option>
                  <option value="Examination Officer">Examination Officer (Centers, Moderation, Transcripts)</option>
                  <option value="Finance Administrator">Finance Administrator (Tuition, Bursar, Fees)</option>
                  <option value="RPL Coordinator">RPL Coordinator (Prior Learning & Portfolios)</option>
                  <option value="Lecturer">Lecturer (Course Grading & Instruction)</option>
                  <option value="Campus Administrator">Campus Administrator (Regional Hubs & Centers)</option>
                </select>
              </div>

              {/* Email / Username */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  2. Administrator Institutional Email
                </label>
                <div className="relative">
                  <LogIn className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="administrator@bibu-edu.org"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    3. Security Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="text-[11px] text-[#C5A059] hover:underline transition-all"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Live Password Hashing Inspector */}
              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>SHA-256 Digest Simulation:</span>
                  </span>
                  <span className="text-emerald-400 text-[10px]">SALT: BIBU_SALT_2026</span>
                </div>
                <div className="text-[10px] font-mono text-slate-300 break-all bg-slate-950/80 p-2 rounded border border-slate-800">
                  {passwordHash || '0000000000000000000000000000000000000000000000000000000000000000'}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthenticating || (failedAttempts.isLocked && lockoutRemainingSecs > 0)}
                className="w-full py-3 px-4 rounded-xl bg-[#002366] hover:bg-[#001c52] border border-[#C5A059]/60 text-[#C5A059] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
                    <span>Verifying Credentials & Session Authorization...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    <span>Authenticate & Access BIBU Admin Dashboard</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Personas */}
            <div className="pt-4 border-t border-slate-700/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>One-Click Administrative Roles (Evaluation Testing):</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Select to auto-populate</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ADMIN_USERS.map((adm) => (
                  <button
                    key={adm.id}
                    type="button"
                    onClick={() => handleQuickCredentialSelect(adm)}
                    className={`p-2 text-left rounded-lg border transition-all text-xs ${
                      selectedRole === adm.role
                        ? 'bg-[#002366]/60 border-[#C5A059] text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="font-bold truncate text-[11px] text-[#C5A059]">{adm.role}</div>
                    <div className="truncate text-[10px] text-slate-400">{adm.name.split(',')[0]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Institutional Security Notice */}
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Shield className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <span>
                <strong>Institutional Security Notice:</strong> All administrative activities are automatically logged in the immutable BIBU Audit Trail with IP address, user agent, and timestamp.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#C5A059]">
              <KeyRound className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Admin Password Reset Protocol
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your registered institutional administrator email. A secure reset link and two-factor recovery token will be dispatched to your mailbox.
            </p>

            {resetStatus && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs rounded-lg">
                {resetStatus}
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-3">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="administrator@bibu-edu.org"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-[#C5A059]"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 text-xs hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#002366] border border-[#C5A059] text-[#C5A059] font-bold text-xs uppercase tracking-wider hover:bg-[#001c52]"
                >
                  Dispatch Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
