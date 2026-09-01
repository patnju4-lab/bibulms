import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  UserPlus,
  LogIn,
  X,
  Shield,
  GraduationCap,
  Briefcase,
  Award,
  Globe,
  Lock,
  Mail,
  User,
  Building,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Role } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalTab,
    authTargetPortal,
    authMessage,
    closeAuthModal,
    registerUser,
    loginUser,
    allUsers,
    programs
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(authModalTab || 'register');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync active tab when modal is opened with specific tab
  React.useEffect(() => {
    if (authModalOpen) {
      setActiveTab(authModalTab);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [authModalOpen, authModalTab]);

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<Role>('student');
  const [regCountry, setRegCountry] = useState('United States');
  const [regMinistry, setRegMinistry] = useState('');
  const [regProgram, setRegProgram] = useState(programs[0]?.name || 'Bachelor of Theology (B.Th)');
  const [regTitle, setRegTitle] = useState('');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  if (!authModalOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regName.trim()) {
      setErrorMessage('Please enter your full legal or ministerial name.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    const res = registerUser({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword || 'password123',
      role: regRole,
      country: regCountry,
      ministryAffiliation: regMinistry.trim(),
      programName: regRole === 'student' ? regProgram : undefined,
      title: regTitle.trim() || (regRole === 'student' ? 'Student' : regRole === 'faculty' ? 'Faculty Instructor' : regRole === 'admin' ? 'University Administrator' : 'Minister')
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to create account.');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your account email address.');
      return;
    }

    const res = loginUser(loginEmail.trim(), loginPassword);
    if (!res.success) {
      setErrorMessage(res.error || 'Login failed. If you do not have an account yet, please create one.');
    }
  };

  const handleQuickSelectUser = (user: typeof allUsers[0]) => {
    loginUser(user.email, user.password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#002366] text-white p-5 border-b-4 border-[#C5A059] relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <UniversityLogo size="sm" withRing />
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
                Breakthrough International Bible University
              </div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Institutional Portal Access
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-200 mt-2 leading-relaxed">
            {authMessage || 'To access any university portal (Student, Faculty, Registrar, Administrator, Alumni), you must first create an account or sign in.'}
          </p>

          {/* Tab Switchers */}
          <div className="flex gap-2 mt-4 pt-2 border-t border-white/10">
            <button
              onClick={() => { setActiveTab('register'); setErrorMessage(null); }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeTab === 'register'
                  ? 'bg-[#C5A059] text-[#002366] shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>1. Create New Account</span>
            </button>

            <button
              onClick={() => { setActiveTab('login'); setErrorMessage(null); }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeTab === 'login'
                  ? 'bg-[#C5A059] text-[#002366] shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>2. Sign In (Existing)</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-rose-50 border-l-4 border-rose-600 p-3 rounded-r-lg flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Authentication Notice: </span>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Quick Demo Personas / Existing Accounts */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5 text-[#002366]">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                Institutional Demo Accounts (1-Click Access)
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Click to sign in instantly</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allUsers.slice(0, 5).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickSelectUser(u)}
                  className="text-left p-2 rounded-lg border border-slate-200 bg-white hover:border-[#002366] hover:bg-[#F0F4FF] transition-all group shadow-2xs"
                >
                  <div className="text-[11px] font-bold text-[#002366] truncate group-hover:text-[#001A4D]">
                    {u.name}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 group-hover:bg-[#002366] group-hover:text-[#C5A059]">
                      {u.role}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-[#002366] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* REGISTER TAB */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Create Your Official BIBU Account
                </h3>
                <p className="text-xs text-slate-500">
                  Select your role to configure your institutional profile and dashboard.
                </p>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Your Account Role <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { role: 'student' as Role, label: 'Student', icon: GraduationCap, desc: 'Courses, exams, degrees' },
                    { role: 'faculty' as Role, label: 'Faculty / Dean', icon: Briefcase, desc: 'Grading, lectures, courses' },
                    { role: 'admin' as Role, label: 'Admin / Chancellor', icon: Shield, desc: 'Full-site CMS & settings' },
                    { role: 'registrar' as Role, label: 'Registrar', icon: Award, desc: 'Transcripts & admissions' },
                  ].map((r) => {
                    const Icon = r.icon;
                    const isSelected = regRole === r.role;
                    return (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => setRegRole(r.role)}
                        className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'border-[#002366] bg-[#002366] text-white shadow-md ring-2 ring-[#C5A059]/50'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-[#C5A059]' : 'text-[#002366]'}`} />
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />}
                        </div>
                        <div className="mt-2">
                          <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {r.label}
                          </div>
                          <div className={`text-[10px] mt-0.5 leading-tight ${isSelected ? 'text-slate-200' : 'text-slate-400'}`}>
                            {r.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Legal / Ministerial Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pastor Michael Sterling"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. pastor.michael@church.org"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Account Password <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Country / Global Region
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <select
                      value={regCountry}
                      onChange={(e) => setRegCountry(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] focus:border-transparent bg-white"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Kenya">Kenya</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Australia">Australia</option>
                      <option value="India">India</option>
                      <option value="Brazil">Brazil</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Germany">Germany</option>
                      <option value="Other">Other Global Nation</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Conditional Role-specific Fields */}
              {regRole === 'student' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enrolled Degree Program
                  </label>
                  <select
                    value={regProgram}
                    onChange={(e) => setRegProgram(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] bg-white font-medium"
                  >
                    {programs.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.level} • {p.totalCredits} Credits)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ministry Affiliation / Church Fellowship (Optional)
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="e.g. Breakthrough Global Ministries, Phoenix, AZ"
                    value={regMinistry}
                    onChange={(e) => setRegMinistry(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white font-black text-xs uppercase tracking-wider border-2 border-[#C5A059] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-[#C5A059]" />
                  <span>Create Account & Enter Portal</span>
                </button>
              </div>

              <div className="text-center text-xs text-slate-500 pt-1">
                Already have an institutional account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setErrorMessage(null); }}
                  className="font-bold text-[#002366] hover:underline"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* LOGIN TAB */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Sign In to Your Institutional Portal
                </h3>
                <p className="text-xs text-slate-500">
                  Enter your registered institutional email address to continue.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. chancellor@bibu-edu.org or your-email@church.org"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Password (Optional for demo accounts)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white font-black text-xs uppercase tracking-wider border-2 border-[#C5A059] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-[#C5A059]" />
                  <span>Sign In & Open Portal</span>
                </button>
              </div>

              <div className="text-center text-xs text-slate-500 pt-1">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setErrorMessage(null); }}
                  className="font-bold text-[#002366] hover:underline"
                >
                  Create an account now
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Modal Footer Security Badge */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
            256-Bit Encrypted Institutional Cloud Security
          </span>
          <span className="font-mono text-[10px] text-slate-400">BIBU-SSO v4.2</span>
        </div>

      </div>
    </div>
  );
};
