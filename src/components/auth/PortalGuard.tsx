import React, { useState } from 'react';
import { useApp, CurrentView } from '../../context/AppContext';
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
  RefreshCw,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Award,
  Globe2
} from 'lucide-react';

interface PortalGuardProps {
  portalKey: 'student' | 'faculty' | 'admin' | 'alumni' | 'fellowships';
  portalName: string;
  allowedRoles: Role[];
  children: React.ReactNode;
}

export const PortalGuard: React.FC<PortalGuardProps> = ({
  portalKey,
  portalName,
  allowedRoles,
  children
}) => {
  const {
    currentUser,
    setCurrentView,
    allUsers,
    loginUser,
    registerUser,
    switchRole,
    openAuthModal
  } = useApp();

  const [activeGateTab, setActiveGateTab] = useState<'signin' | 'register'>('signin');
  
  // Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register State
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

  const isGuest = currentUser.role === 'guest';
  const isAuthorized = allowedRoles.includes(currentUser.role);

  // If user is logged in and authorized, render the portal directly
  if (!isGuest && isAuthorized) {
    return <>{children}</>;
  }

  // Handle direct sign-in form submit
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim()) {
      setLoginError('Please enter your registered email address or Username.');
      return;
    }

    const res = loginUser(loginEmail.trim(), loginPassword || undefined);
    if (!res.success) {
      setLoginError(res.error || 'Authentication failed. Please verify credentials or create an account.');
    }
  };

  // Handle direct registration form submit
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

    // Determine initial role mapping safely
    let defaultRole: Role = 'registered';
    if (regAccountType === 'Current Student' || regAccountType === 'Prospective Student') {
      defaultRole = 'student';
    } else if (regAccountType === 'Alumni') {
      defaultRole = 'alumni';
    } else if (regAccountType === 'Pastor/Minister' || regAccountType === 'Fellowship Member' || regAccountType === 'Ministry Leader') {
      defaultRole = 'ministry_member';
    }

    const fullName = `${regFirstName.trim()}${regMiddleName ? ' ' + regMiddleName.trim() : ''} ${regLastName.trim()}`;
    const res = registerUser({
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

  // Quick Demo Persona Selection Helper
  const handleQuickDemoLogin = (targetRole: Role) => {
    switchRole(targetRole);
  };

  // CASE 1: LOGGED IN BUT ACCESS RESTRICTED (UNAUTHORIZED ROLE)
  if (!isGuest && !isAuthorized) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-[#002366] to-[#001438] text-white p-6 sm:p-8 border-b-4 border-[#C5A059]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                  Institutional Security Gate
                </span>
                <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
                  ACCESS RESTRICTED
                </h1>
              </div>
            </div>
            <p className="text-sm text-slate-200 mt-2 max-w-2xl leading-relaxed">
              You do not currently have permission to access the <strong className="text-white underline">{portalName}</strong>.
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
                <div className="p-3 bg-white rounded-lg border border-amber-200">
                  <span className="text-slate-500 font-medium block">Your Current Active Role:</span>
                  <span className="text-sm font-mono font-bold text-[#002366] uppercase mt-0.5 block">
                    {currentUser.role} ({currentUser.name})
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-amber-200">
                  <span className="text-slate-500 font-medium block">Authorized Roles for {portalName}:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {allowedRoles.map(role => (
                      <span key={role} className="px-2 py-0.5 bg-[#002366] text-white text-[10px] font-mono font-bold rounded">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Per BIBU academic governance policies, elevated access to faculty, registrar, administrative or examination dashboards requires formal verification and administrative approval.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => {
                  setCurrentView('account');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Return to My BIBU Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('portals');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                <span>View All Portals</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Contact BIBU Support & Registrar</span>
              </button>
            </div>

            {/* Switch Account Option */}
            <div className="border-t border-slate-100 pt-6">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Switch to Authorized Demo Account (Testing & Preview):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {allowedRoles.includes('student') && (
                  <button
                    onClick={() => handleQuickDemoLogin('student')}
                    className="p-2.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold text-left transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-blue-700">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Student Account</span>
                    </div>
                    <span className="text-[10px] text-slate-600 block font-normal mt-0.5">Pastor David (B.Th)</span>
                  </button>
                )}
                {allowedRoles.includes('faculty') && (
                  <button
                    onClick={() => handleQuickDemoLogin('faculty')}
                    className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold text-left transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Faculty Account</span>
                    </div>
                    <span className="text-[10px] text-slate-600 block font-normal mt-0.5">Dr. Thomas Wright</span>
                  </button>
                )}
                {allowedRoles.includes('admin') && (
                  <button
                    onClick={() => handleQuickDemoLogin('admin')}
                    className="p-2.5 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold text-left transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-purple-700">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Administrator</span>
                    </div>
                    <span className="text-[10px] text-slate-600 block font-normal mt-0.5">Chancellor Sterling</span>
                  </button>
                )}
                {allowedRoles.includes('alumni') && (
                  <button
                    onClick={() => handleQuickDemoLogin('alumni')}
                    className="p-2.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold text-left transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-amber-700">
                      <Award className="w-3.5 h-3.5" />
                      <span>Alumni Account</span>
                    </div>
                    <span className="text-[10px] text-slate-600 block font-normal mt-0.5">Bishop Joshua Osei</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CASE 2: NOT LOGGED IN — ACCOUNT REQUIRED (FULL GATEWAY)
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Gateway Banner */}
        <div className="bg-linear-to-r from-[#002366] via-[#001A4D] to-[#001438] text-white p-6 sm:p-8 border-b-4 border-[#C5A059] relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <UniversityLogo size="md" withRing />
              <div>
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authenticated University Portal Gateway</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-display font-black text-white mt-0.5">
                  BIBU ACCOUNT ACCESS
                </h1>
              </div>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-right shrink-0">
              <span className="text-[10px] text-[#C5A059] font-bold block uppercase tracking-wider">Target Destination</span>
              <span className="text-xs font-bold text-white">{portalName}</span>
            </div>
          </div>

          <div className="mt-4 p-3.5 bg-white/10 rounded-xl border border-white/15 text-xs text-slate-200 leading-relaxed">
            <strong className="text-[#C5A059]">ACCOUNT REQUIRED:</strong> Access to the <strong>{portalName}</strong> requires an active, verified BIBU account. Please create a new account or sign in with your existing credentials to continue.
          </div>

          {/* Toggle Switcher */}
          <div className="flex gap-2 mt-5 pt-3 border-t border-white/10">
            <button
              onClick={() => setActiveGateTab('signin')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeGateTab === 'signin'
                  ? 'bg-[#C5A059] text-[#002366] shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Existing Account</span>
            </button>

            <button
              onClick={() => setActiveGateTab('register')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeGateTab === 'register'
                  ? 'bg-[#C5A059] text-[#002366] shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Your BIBU Account</span>
            </button>
          </div>
        </div>

        {/* Gateway Body */}
        <div className="p-6 sm:p-8">
          
          {/* TAB 1: SIGN IN */}
          {activeGateTab === 'signin' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold font-display text-[#002366]">
                  Sign In to BIBU Account
                </h2>
                <p className="text-xs text-slate-500">
                  Enter your registered institutional email address and secure password.
                </p>
              </div>

              {loginError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address / Username</label>
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
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to your registered institutional email address.')}
                      className="text-[11px] text-[#002366] hover:underline font-bold"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded text-[#002366] focus:ring-[#002366]"
                    />
                    <span>Remember this device</span>
                  </label>
                  <span className="text-slate-400 font-mono text-[11px]">256-bit SSL Encrypted</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In & Enter {portalName}</span>
                </button>
              </form>

              {/* Demo Sign-in Helper */}
              <div className="bg-[#F8F9FB] rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#002366] uppercase tracking-wider">
                    Instant Demo Login (Preview Institutional Roles):
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">1-Click Access</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('student')}
                    className="p-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-left text-xs transition-all"
                  >
                    <div className="font-bold text-[#002366] flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                      <span>Student (David)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">david.emmanuel@student.bibu-edu.org</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('faculty')}
                    className="p-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-left text-xs transition-all"
                  >
                    <div className="font-bold text-[#002366] flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Faculty (Dr. Wright)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">t.wright@faculty.bibu-edu.org</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin')}
                    className="p-2 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-lg text-left text-xs transition-all"
                  >
                    <div className="font-bold text-[#002366] flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-purple-600" />
                      <span>Admin (Chancellor)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">chancellor@bibu-edu.org</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREATE ACCOUNT */}
          {activeGateTab === 'register' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold font-display text-[#002366]">
                  CREATE YOUR BIBU ACCOUNT
                </h2>
                <p className="text-xs text-slate-500">
                  Create one secure account to access the BIBU University Portals available to you.
                </p>
              </div>

              {regError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Name Fields */}
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
                      placeholder="Middle Name (Optional)"
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
                    <label className="text-xs font-bold text-slate-700">Mobile Number *</label>
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
                      placeholder="e.g. United States, Ghana, Kenya, UK"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">I am a (Account Type) *</label>
                    <select
                      value={regAccountType}
                      onChange={e => setRegAccountType(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] bg-white font-medium"
                    >
                      <option value="Prospective Student">Prospective Student (Applying for Admission)</option>
                      <option value="Current Student">Current Student (Enrolled Degree Candidate)</option>
                      <option value="Faculty/Instructor">Faculty / Academic Instructor</option>
                      <option value="University Staff">University Staff / Administration</option>
                      <option value="Alumni">BIBU Alumni / Graduate</option>
                      <option value="Pastor/Minister">Pastor / Ordained Minister</option>
                      <option value="Christian Worker">Christian Worker / Missionary</option>
                      <option value="Ministry Leader">Ministry Leader / Church Planter</option>
                      <option value="Fellowship Member">Global Fellowship Member</option>
                      <option value="Other">Other Theological Inquirer</option>
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

                {/* Security Policy Disclaimer Notice */}
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 leading-relaxed space-y-1">
                  <div className="font-bold flex items-center gap-1 text-[#002366]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Role-Based Access Verification Workflow</span>
                  </div>
                  <p>
                    A user does not gain privileged access merely by selecting a role during registration. For privileged roles: <strong>Registration &rarr; Verification &rarr; Approval &rarr; Role Assignment &rarr; Portal Access</strong>.
                  </p>
                </div>

                {/* Checkboxes */}
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
                  className="w-full py-3 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account & Continue</span>
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
