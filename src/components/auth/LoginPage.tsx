import React, { useState } from 'react';
import { useAuth, PORTAL_ACCESS_RULES } from '../../hooks/useAuth';
import { UniversityLogo } from '../common/UniversityLogo';
import { Role } from '../../types';
import {
  LogIn,
  UserPlus,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Award,
  Globe2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartHandshake
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    login,
    switchRole,
    authTargetPortal,
    authMessage,
    redirectToRegister,
    navigateToAuthorizedDashboard
  } = useAuth();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const targetPortalRule = authTargetPortal && Object.values(PORTAL_ACCESS_RULES).find(r => r.defaultView === authTargetPortal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailOrUsername.trim()) {
      setErrorMessage('Please enter your institutional email address or Username.');
      return;
    }

    const res = login(emailOrUsername.trim(), password || undefined);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please check credentials or register a new account.');
    }
  };

  const handleQuickDemoLogin = (targetRole: Role) => {
    switchRole(targetRole);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 sm:py-14 space-y-8 animate-fade-in">
      {/* Title & Branding */}
      <div className="text-center space-y-2">
        <UniversityLogo size="lg" withRing className="mx-auto shadow-md" />
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#002366] text-[#C5A059] text-[10px] font-black uppercase tracking-wider mt-2 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Unified Institutional Authentication Gateway</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-[#002366] tracking-tight">
          BIBU ACCOUNT LOGIN
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Sign in to access your authorized university learning, faculty, administrative, or fellowship portals.
        </p>
      </div>

      {/* Target Destination Banner if intercepted */}
      {authTargetPortal && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3 shadow-xs">
          <div className="p-2 bg-amber-200 text-amber-900 rounded-lg shrink-0 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <span className="font-black uppercase tracking-wider text-amber-900 block">
              Portal Access Authentication Required
            </span>
            <p className="text-amber-800 leading-relaxed">
              {authMessage || `You requested access to ${targetPortalRule?.name || authTargetPortal}. Please sign in to verify your authorization and proceed.`}
            </p>
          </div>
        </div>
      )}

      {/* Main Login Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        <div className="bg-[#002366] text-white p-5 border-b-4 border-[#C5A059] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#C5A059]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Secure Central Gateway
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-300 bg-white/10 px-2.5 py-0.5 rounded border border-white/10">
            256-bit SSL Encrypted
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address / Username *</span>
              </label>
              <input
                type="text"
                required
                value={emailOrUsername}
                onChange={e => setEmailOrUsername(e.target.value)}
                placeholder="e.g. david.emmanuel@student.bibu-edu.org"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span>Password *</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset verification instructions have been dispatched to your institutional email.')}
                  className="text-[11px] text-[#002366] hover:underline font-bold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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

            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded text-[#002366] focus:ring-[#002366]"
                />
                <span>Remember this device</span>
              </label>
              <span className="text-slate-400 font-mono text-[10px]">Session Timeout: 8 hrs</span>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>SIGN IN & ENTER PORTAL</span>
              </button>

              <button
                type="button"
                onClick={() => redirectToRegister(authTargetPortal || undefined)}
                className="w-full py-3 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>CREATE NEW BIBU ACCOUNT</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Profiles */}
          <div className="bg-[#F8F9FB] rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#002366]">
                Instant Demo Personas (One-Click Testing)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Evaluation Mode</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student')}
                className="p-2.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#002366]">Pastor David (Student)</div>
                  <div className="text-[10px] text-slate-500">B.Th Candidate • LMS Active</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('faculty')}
                className="p-2.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#002366]">Dr. Wright (Faculty)</div>
                  <div className="text-[10px] text-slate-500">Academic Instructor & Dean</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2.5 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-lg text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#002366]">Chancellor Sterling</div>
                  <div className="text-[10px] text-slate-500">Super Admin & CMS Adjudicator</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('alumni')}
                className="p-2.5 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-lg text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#002366]">Bishop Osei (Alumni)</div>
                  <div className="text-[10px] text-slate-500">Global Ministerial Association</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
