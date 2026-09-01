import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { UniversityLogo } from '../common/UniversityLogo';
import { Role, AccountType } from '../../types';
import {
  UserPlus,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Globe,
  Camera,
  Languages,
  Clock,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Info,
  Check,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export const CreateAccountPage: React.FC = () => {
  const { programs, setCurrentView } = useApp();
  const { register, redirectToLogin, authTargetPortal, authMessage } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [country, setCountry] = useState('United States');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Optional Fields
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [timeZone, setTimeZone] = useState('America/Phoenix (MST, UTC-7)');

  // Account Type Selection
  const [accountType, setAccountType] = useState<AccountType>('Prospective Student');
  const [ministryAffiliation, setMinistryAffiliation] = useState('');
  const [desiredProgram, setDesiredProgram] = useState(programs[0]?.name || 'Bachelor of Theology (B.Th)');

  // Required Checkboxes
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMode, setSuccessMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please enter both your First Name and Last Name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!mobileNumber.trim()) {
      setErrorMessage('Please enter your mobile phone number.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }
    if (!agreeTerms || !agreePrivacy) {
      setErrorMessage('You must agree to both the Terms & Conditions and Privacy Policy.');
      return;
    }

    // Role mapping strictly follows Section 7: "Never trust user-selected roles immediately for privileged roles"
    let assignedRole: Role = 'registered';
    if (accountType === 'Current Student' || accountType === 'Prospective Student') {
      assignedRole = 'student';
    } else if (accountType === 'Alumni') {
      assignedRole = 'alumni';
    } else if (accountType === 'Pastor/Minister' || accountType === 'Fellowship Member' || accountType === 'Ministry Leader' || accountType === 'Christian Worker') {
      assignedRole = 'ministry_member';
    }

    const fullName = `${firstName.trim()}${middleName ? ' ' + middleName.trim() : ''} ${lastName.trim()}`;
    const result = register({
      name: fullName,
      email: email.trim(),
      password,
      role: assignedRole,
      country,
      ministryAffiliation: ministryAffiliation.trim() || undefined,
      programName: assignedRole === 'student' ? desiredProgram : undefined,
      title: accountType
    });

    if (result.success) {
      setSuccessMode(true);
    } else {
      setErrorMessage(result.error || 'Failed to create account. Please try again.');
    }
  };

  if (successMode) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border-2 border-emerald-300 shadow-2xl p-8 text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
              Account Successfully Created
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-[#002366]">
              Welcome to BIBU, {firstName}!
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your unified BIBU identity has been registered. You can now access all authorized learning portals and fellowship services.
            </p>
          </div>

          <div className="bg-[#F8F9FB] rounded-xl p-4 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Registered Email:</span>
              <span className="font-bold text-[#002366]">{email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Selected Account Type:</span>
              <span className="font-bold text-[#002366]">{accountType}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Verification Status:</span>
              <span className="font-bold text-amber-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Active / Pending Verification</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => {
                setCurrentView('account');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Go to My BIBU Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentView('portals');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider rounded-xl transition-all"
            >
              <span>Open University Portals</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002366] text-[#C5A059] text-[11px] font-black uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Unified Institutional Identity & Security</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-[#002366] tracking-tight">
          CREATE YOUR BIBU ACCOUNT
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Create one secure account to access the BIBU University Portals available to you.
        </p>
      </div>

      {/* Workflow Process Visualization */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hidden md:block">
        <div className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] mb-3 text-center">
          Institutional Account Creation & Authorization Flow (Section 26)
        </div>
        <div className="flex items-center justify-between text-center text-[10px] font-bold text-slate-600 overflow-x-auto">
          <div className="flex-1 px-1">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-1 text-[9px]">1</span>
            <span>Visit BIBU</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <div className="flex-1 px-1">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-1 text-[9px]">2</span>
            <span>Select Portal</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <div className="flex-1 px-1">
            <span className="w-5 h-5 rounded-full bg-[#002366] text-[#C5A059] ring-2 ring-[#C5A059] flex items-center justify-center mx-auto mb-1 text-[9px] font-black">3</span>
            <span className="text-[#002366]">Create Account</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <div className="flex-1 px-1">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-1 text-[9px]">4</span>
            <span>Verification</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <div className="flex-1 px-1">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-1 text-[9px]">5</span>
            <span>Role Assigned</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <div className="flex-1 px-1">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-1 text-[9px]">6</span>
            <span>Portal Access</span>
          </div>
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-[#002366] text-white p-6 border-b-4 border-[#C5A059] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UniversityLogo size="sm" withRing />
            <div>
              <h2 className="text-base font-bold font-display text-white">
                BIBU Institutional Enrollment & Registration Form
              </h2>
              <p className="text-xs text-slate-300">
                Official Registrar System • Phoenix, Arizona, USA
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setCurrentView('login');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs text-[#C5A059] hover:underline font-bold"
          >
            Already have an account? Sign In &rarr;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Legal Name Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#002366] border-b border-slate-100 pb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#002366] text-white text-[10px] flex items-center justify-center">1</span>
              <span>Personal & Legal Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Legal first name"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Middle Name</label>
                <input
                  type="text"
                  value={middleName}
                  onChange={e => setMiddleName(e.target.value)}
                  placeholder="Middle name (optional)"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Legal last / family name"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>
            </div>
          </div>

          {/* 2. Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#002366] border-b border-slate-100 pb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#002366] text-white text-[10px] flex items-center justify-center">2</span>
              <span>Contact & Regional Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="primary.email@example.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={e => setMobileNumber(e.target.value)}
                  placeholder="+1 (602) 555-0199"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Country of Residence *</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="United States, Ghana, Kenya, UK, etc."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>
            </div>
          </div>

          {/* 3. Account Type Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#002366] border-b border-slate-100 pb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#002366] text-white text-[10px] flex items-center justify-center">3</span>
              <span>Account Type & University Relationship</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">I am a (Select Relationship with BIBU) *</label>
                <select
                  value={accountType}
                  onChange={e => setAccountType(e.target.value as AccountType)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] bg-white font-medium"
                >
                  <option value="Prospective Student">Prospective Student (Applying for Admission)</option>
                  <option value="Current Student">Current Student (Enrolled Degree Candidate)</option>
                  <option value="Faculty/Instructor">Faculty / Instructor</option>
                  <option value="University Staff">University Staff</option>
                  <option value="Alumni">BIBU Alumni (Graduate)</option>
                  <option value="Pastor/Minister">Pastor / Minister</option>
                  <option value="Christian Worker">Christian Worker</option>
                  <option value="Ministry Leader">Ministry Leader</option>
                  <option value="Fellowship Member">Fellowship Member</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Ministry Affiliation / Church Name</label>
                <input
                  type="text"
                  value={ministryAffiliation}
                  onChange={e => setMinistryAffiliation(e.target.value)}
                  placeholder="e.g. Grace Fellowship Church / Global Missions"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>
            </div>

            {/* Critical RBAC Warning Box (Section 7) */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <Shield className="w-4 h-4 text-amber-700" />
                <span>Security Policy: Verification Required for Privileged Roles</span>
              </div>
              <p className="text-[11px] text-amber-800">
                A user must NOT gain privileged access merely by selecting <strong>Faculty</strong>, <strong>Administrator</strong>, or <strong>Examiner</strong> during registration. Elevated permissions require administrative approval: <strong>Registration &rarr; Verification &rarr; Approval &rarr; Role Assignment &rarr; Portal Access</strong>.
              </p>
            </div>
          </div>

          {/* 4. Credentials & Security */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#002366] border-b border-slate-100 pb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#002366] text-white text-[10px] flex items-center justify-center">4</span>
              <span>Account Password & Credentials</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>
            </div>
          </div>

          {/* 5. Optional Profile Preferences */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#002366] border-b border-slate-100 pb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center">5</span>
                <span>Optional Preferences</span>
              </div>
              <span className="text-[10px] font-normal text-slate-500 font-sans">Can be updated later</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profile Photo URL</span>
                </label>
                <input
                  type="url"
                  value={profilePhotoUrl}
                  onChange={e => setProfilePhotoUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preferred Language</span>
                </label>
                <select
                  value={preferredLanguage}
                  onChange={e => setPreferredLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] bg-white"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Español (Spanish)</option>
                  <option value="French">Français (French)</option>
                  <option value="Portuguese">Português (Portuguese)</option>
                  <option value="Swahili">Kiswahili (Swahili)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Time Zone</span>
                </label>
                <select
                  value={timeZone}
                  onChange={e => setTimeZone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366] bg-white"
                >
                  <option value="America/Phoenix (MST, UTC-7)">America/Phoenix (MST, UTC-7)</option>
                  <option value="America/New_York (EST, UTC-5)">America/New_York (EST, UTC-5)</option>
                  <option value="America/Los_Angeles (PST, UTC-8)">America/Los_Angeles (PST, UTC-8)</option>
                  <option value="Europe/London (GMT, UTC+0)">Europe/London (GMT, UTC+0)</option>
                  <option value="Africa/Lagos (WAT, UTC+1)">Africa/Lagos (WAT, UTC+1)</option>
                  <option value="Africa/Nairobi (EAT, UTC+3)">Africa/Nairobi (EAT, UTC+3)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 6. Required Legal Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-[#002366] focus:ring-[#002366]"
              />
              <span>
                I agree to the <strong className="text-[#002366]">Terms & Conditions</strong> of Breakthrough International Bible University.
              </span>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreePrivacy}
                onChange={e => setAgreePrivacy(e.target.checked)}
                className="mt-0.5 rounded text-[#002366] focus:ring-[#002366]"
              />
              <span>
                I agree to the <strong className="text-[#002366]">Privacy Policy</strong>, Data Protection standards, and Academic Honor Code.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4 space-y-3">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.005] flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>CREATE ACCOUNT</span>
            </button>

            <div className="text-center text-xs text-slate-500 pt-2">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setCurrentView('login');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[#002366] font-bold hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
