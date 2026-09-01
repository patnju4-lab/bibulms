import React, { useState, useEffect } from 'react';
import { useAuth, PORTAL_ACCESS_RULES } from '../../hooks/useAuth';
import { CurrentView } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import { Role } from '../../types';
import {
  Lock,
  Shield,
  ShieldCheck,
  AlertTriangle,
  LogIn,
  UserPlus,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  HelpCircle,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  Award,
  Globe2,
  Users,
  Eye,
  EyeOff
} from 'lucide-react';

export interface ProtectedPortalWrapperProps {
  portalKey: 'student' | 'faculty' | 'admin' | 'alumni' | 'fellowships' | 'account';
  portalName?: string;
  allowedRoles?: Role[];
  targetView?: CurrentView;
  children: React.ReactNode;
}

export const ProtectedPortalWrapper: React.FC<ProtectedPortalWrapperProps> = ({
  portalKey,
  portalName: customPortalName,
  allowedRoles: customAllowedRoles,
  targetView,
  children
}) => {
  const {
    user,
    isAuthenticated,
    isGuest,
    role,
    login,
    register,
    switchRole,
    authTargetPortal,
    setAuthTargetPortal,
    authMessage,
    setAuthMessage,
    redirectToLogin,
    navigateToAuthorizedDashboard
  } = useAuth();

  // Retrieve rule defaults if not explicitly provided
  const rule = PORTAL_ACCESS_RULES[portalKey];
  const portalName = customPortalName || rule?.name || 'Institutional Portal';
  const allowedRoles = customAllowedRoles || rule?.allowedRoles || ['student', 'faculty', 'admin', 'registrar', 'superadmin'];
  const destinationView = targetView || rule?.defaultView || 'home';

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form State
  const [regFirstName, setRegFirstName] = useState('');
  const [regMiddleName, setRegMiddleName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCountry, setRegCountry] = useState('United States');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAccountType, setRegAccountType] = useState<string>('Current Student');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Keep target portal recorded in context for redirection
  useEffect(() => {
    if (isGuest && destinationView) {
      setAuthTargetPortal(destinationView);
    }
  }, [isGuest, destinationView, setAuthTargetPortal]);

  const isAuthorized = allowedRoles.includes(role);

  // CASE 1: Authenticated and Authorized -> Render protected portal
  if (isAuthenticated && isAuthorized) {
    return <>{children}</>;
  }

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim()) {
      setLoginError('Please enter your institutional email address or Username.');
      return;
    }

    const res = login(loginEmail.trim(), loginPassword || undefined);
    if (!res.success) {
      setLoginError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  // Handle Registration submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regFirstName.trim() || !regLastName.trim()) {
      setRegError('Please provide your First and Last name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Please provide a valid institutional or personal email address.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setRegError('Password must be at least 6 characters in length.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Password confirmation does not match.');
      return;
    }
    if (!agreeTerms || !agreePrivacy) {
      setRegError('You must accept the BIBU Terms of Service & Privacy Policy.');
      return;
    }

    // Role assignment mapping
    let defaultRole: Role = 'registered';
    if (regAccountType === 'Current Student' || regAccountType === 'Prospective Student') {
      defaultRole = 'student';
    } else if (regAccountType === 'Alumni') {
      defaultRole = 'alumni';
    } else if (regAccountType === 'Pastor/Minister' || regAccountType === 'Fellowship Member' || regAccountType === 'Ministry Leader') {
      defaultRole = 'ministry_member';
    }

    const fullName = `${regFirstName.trim()}${regMiddleName ? ' ' + regMiddleName.trim() : ''} ${regLastName.trim()}`;
    const res = register({
      name: fullName,
      email: regEmail.trim(),
      password: regPassword,
      role: defaultRole,
      country: regCountry,
      title: regAccountType
    });

    if (!res.success) {
      setRegError(res.error || 'Account creation failed. Please try again.');
    }
  };

  // Quick Persona selection for testing/evaluation
  const handleQuickDemoSwitch = (targetRole: Role) => {
    switchRole(targetRole);
  };

  // CASE 2: Authenticated but Restricted / Unauthorized Role (RBAC Interception)
  if (isAuthenticated && !isAuthorized) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14 animate-fade-in">
        <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#002366] to-[#001438] text-white p-6 sm:p-8 border-b-4 border-[#C5A059]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                  Institutional Security Gate • RBAC Policy
                </span>
                <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
                  ACCESS RESTRICTED
                </h1>
              </div>
            </div>
            <p className="text-sm text-slate-200 mt-2 max-w-2xl leading-relaxed">
              Your active account does not have authorization to access the <strong className="text-white underline">{portalName}</strong>.
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Role-Based Access Control (RBAC) Assessment</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-white rounded-lg border border-amber-200 shadow-xs">
                  <span className="text-slate-500 font-medium block">Your Current Active Role:</span>
                  <span className="text-sm font-mono font-bold text-[#002366] uppercase mt-0.5 block">
                    {user.role} ({user.name})
                  </span>
                </div>
                <div className="p-3.5 bg-white rounded-lg border border-amber-200 shadow-xs">
                  <span className="text-slate-500 font-medium block">Required Authorized Roles:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {allowedRoles.map(r => (
                      <span key={r} className="px-2 py-0.5 bg-[#002366] text-white text-[10px] font-mono font-bold rounded">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed pt-1">
                Access to elevated administrative, examination moderation, and faculty portals requires verified credentialing by the Academic Senate and Registrar.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={navigateToAuthorizedDashboard}
                className="px-5 py-2.5 bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Return to My Authorized Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleQuickDemoSwitch('student')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                <span>Switch to Student View</span>
              </button>

              <button
                onClick={() => handleQuickDemoSwitch('faculty')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                <span>Switch to Faculty View</span>
              </button>

              <button
                onClick={() => handleQuickDemoSwitch('admin')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                <span>Switch to Admin View</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CASE 3: Unauthenticated Visitor -> Intercepted and Shown Login / Registration
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Interceptor Banner */}
        <div className="bg-gradient-to-r from-[#002366] via-[#001A4D] to-[#001438] text-white p-6 sm:p-8 border-b-4 border-[#C5A059] relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <UniversityLogo size="md" withRing />
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Security Gateway • Authentication Intercept</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-display font-black text-white mt-0.5">
                  BIBU ACCOUNT REQUIRED
                </h1>
              </div>
            </div>
            
            <div className="bg-white/10 px-3.5 py-2 rounded-xl border border-white/20 text-left sm:text-right shrink-0">
              <span className="text-[10px] text-[#C5A059] font-bold block uppercase tracking-wider">Requested Portal</span>
              <span className="text-xs font-bold text-white block">{portalName}</span>
            </div>
          </div>

          <div className="mt-4 p-3.5 bg-white/10 rounded-xl border border-white/15 text-xs text-slate-200 leading-relaxed">
            <strong className="text-[#C5A059]">AUTHENTICATION MANDATE:</strong> Access to the <strong>{portalName}</strong> is restricted to verified members of Breakthrough International Bible University. Please sign in with your credentials or create a new BIBU account below.
          </div>

          {/* Toggle Switcher */}
          <div className="flex gap-2 mt-5 pt-3 border-t border-white/10">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeTab === 'login'
                  ? 'bg-[#C5A059] text-[#002366] shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Existing Account</span>
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeTab === 'register'
                  ? 'bg-[#C5A059] text-[#002366] shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New BIBU Account</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          
          {/* TAB 1: SIGN IN */}
          {activeTab === 'login' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold font-display text-[#002366]">
                  Sign In to Continue to {portalName}
                </h2>
                <p className="text-xs text-slate-500">
                  Enter your registered institutional or personal email and secure password.
                </p>
              </div>

              {loginError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address / Username *</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="e.g. david.emmanuel@student.bibu-edu.org"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Password *</label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset verification link has been dispatched to your email.')}
                      className="text-[11px] text-[#002366] hover:underline font-bold"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded text-[#002366] focus:ring-[#002366]"
                    />
                    <span>Remember this session</span>
                  </label>
                  <span className="text-slate-400 font-mono text-[11px]">256-bit SSL Encrypted</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Authenticate & Enter {portalName}</span>
                </button>
              </form>

              {/* 1-Click Persona Helper */}
              <div className="bg-[#F8F9FB] rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#002366] uppercase tracking-wider">
                    Instant Demo Login (Preview Institutional Personas):
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">1-Click Access</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoSwitch('student')}
                    className="p-2.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-left text-xs transition-all cursor-pointer"
                  >
                    <div className="font-bold text-[#002366] flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                      <span>Student (David)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">david.emmanuel@student.bibu-edu.org</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoSwitch('faculty')}
                    className="p-2.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-left text-xs transition-all cursor-pointer"
                  >
                    <div className="font-bold text-[#002366] flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Faculty (Dr. Wright)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">t.wright@faculty.bibu-edu.org</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoSwitch('admin')}
                    className="p-2.5 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-lg text-left text-xs transition-all cursor-pointer"
                  >
                    <div className="font-bold text-[#002366] flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-purple-600" />
                      <span>Admin (Chancellor)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">chancellor@bibu-edu.org</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREATE ACCOUNT */}
          {activeTab === 'register' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold font-display text-[#002366]">
                  Create Your Official BIBU Account
                </h2>
                <p className="text-xs text-slate-500">
                  Register for central identity verification to unlock your authorized portals.
                </p>
              </div>

              {regError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">First Name *</label>
                    <input
                      type="text"
                      required
                      value={regFirstName}
                      onChange={e => setRegFirstName(e.target.value)}
                      placeholder="First Name"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Middle Name</label>
                    <input
                      type="text"
                      value={regMiddleName}
                      onChange={e => setRegMiddleName(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={regLastName}
                      onChange={e => setRegLastName(e.target.value)}
                      placeholder="Last Name"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="+1 (602) 555-0199"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>
                </div>

                {/* Country & Account Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Country of Residence *</label>
                    <input
                      type="text"
                      required
                      value={regCountry}
                      onChange={e => setRegCountry(e.target.value)}
                      placeholder="e.g. United States, Ghana, Kenya"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Account Type *</label>
                    <select
                      value={regAccountType}
                      onChange={e => setRegAccountType(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] bg-white font-medium"
                    >
                      <option value="Current Student">Current Student (Degree Candidate)</option>
                      <option value="Prospective Student">Prospective Student (Applicant)</option>
                      <option value="Faculty/Instructor">Faculty / Instructor</option>
                      <option value="University Staff">University Staff</option>
                      <option value="Alumni">BIBU Alumni / Graduate</option>
                      <option value="Pastor/Minister">Pastor / Ordained Minister</option>
                      <option value="Christian Worker">Christian Worker / Missionary</option>
                      <option value="Ministry Leader">Ministry Leader</option>
                      <option value="Fellowship Member">Global Fellowship Member</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Password *</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>
                </div>

                {/* Agreements */}
                <div className="space-y-2 pt-1 text-xs text-slate-700">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={agreeTerms}
                      onChange={e => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded text-[#002366] focus:ring-[#002366]"
                    />
                    <span>I agree to the Breakthrough International Bible University Terms & Conditions</span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={agreePrivacy}
                      onChange={e => setAgreePrivacy(e.target.checked)}
                      className="mt-0.5 rounded text-[#002366] focus:ring-[#002366]"
                    />
                    <span>I agree to the University Privacy Policy & Theological Code of Conduct</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account & Access {portalName}</span>
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProtectedPortalWrapper;
