import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  FileCheck2,
  Upload,
  User,
  Church,
  BookOpen,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  Search
} from 'lucide-react';
import { Application } from '../../types';

export const AdmissionsPortal: React.FC = () => {
  const { programs, submitApplication, applications, setCurrentView } = useApp();

  const [step, setStep] = useState<number>(1);
  const [submittedApp, setSubmittedApp] = useState<Application | null>(null);

  // Status Lookup State
  const [lookupCode, setLookupCode] = useState<string>('');
  const [foundApp, setFoundApp] = useState<Application | null>(null);
  const [lookupError, setLookupError] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    nationality: '',
    country: 'United States',
    churchAffiliation: '',
    ministryExperienceYears: 3,
    currentMinistryRole: 'Assistant Pastor',
    desiredProgramId: programs[0]?.id || 'prog-bth',
    desiredProgramName: programs[0]?.name || 'Bachelor of Theology (B.Th)',
    previousEducation: '',
    statementOfPurpose: '',
    referenceName: '',
    referenceContact: '',
    documents: [
      { name: 'National_ID_Passport.pdf', type: 'application/pdf', size: '1.2 MB' },
      { name: 'Previous_Certificates.pdf', type: 'application/pdf', size: '2.4 MB' }
    ]
  });

  const handleProgramChange = (progId: string) => {
    const selected = programs.find((p) => p.id === progId);
    setFormData({
      ...formData,
      desiredProgramId: progId,
      desiredProgramName: selected?.name || ''
    });
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const app = submitApplication({
      fullName: formData.fullName || 'Candidate Minister',
      email: formData.email || 'applicant@faith.org',
      phone: formData.phone || '+1 602 555 0199',
      dateOfBirth: formData.dateOfBirth || '1990-05-12',
      gender: formData.gender,
      nationality: formData.nationality || 'American',
      country: formData.country || 'United States',
      churchAffiliation: formData.churchAffiliation || 'Grace Bible Fellowship',
      ministryExperienceYears: Number(formData.ministryExperienceYears) || 0,
      currentMinistryRole: formData.currentMinistryRole || 'Ministry Worker',
      desiredProgramId: formData.desiredProgramId,
      desiredProgramName: formData.desiredProgramName,
      previousEducation: formData.previousEducation || 'High School Diploma / Associate Degree',
      statementOfPurpose: formData.statementOfPurpose || 'To receive formal biblical education to advance Kingdom leadership.',
      referenceName: formData.referenceName || 'Senior Pastor Thomas',
      referenceContact: formData.referenceContact || 'pastor@church.org',
      documents: formData.documents
    });
    setSubmittedApp(app);
    window.scrollTo({ top: 50, behavior: 'smooth' });
  };

  const handleLookup = () => {
    setLookupError('');
    setFoundApp(null);
    if (!lookupCode.trim()) {
      setLookupError('Please enter an application reference number.');
      return;
    }
    const clean = lookupCode.trim().toUpperCase();
    const match = applications.find(
      (a) => a.applicationNumber.toUpperCase() === clean || a.id.toUpperCase() === clean
    );
    if (match) {
      setFoundApp(match);
    } else {
      setLookupError(`No application found matching "${lookupCode}". Please check your code format.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <UniversityLogo size="xl" withRing className="shadow-lg" />
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#C5A059] uppercase tracking-widest">
          <GraduationCap className="w-4 h-4 text-[#C5A059]" />
          <span>Office of University Admissions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#002366]">
          Online Admission & Registration Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Begin your application for Certificate, Diploma, Bachelor, Master, or Doctoral degrees at Breakthrough International Bible University.
        </p>
      </div>

      {/* Lookup Existing Application Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#002366] uppercase tracking-wider">
            Already Applied? Check Application Status
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value)}
              placeholder="Enter Application # (e.g., BIBU-APP-2026-9041)"
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#002366] font-mono uppercase"
            />
          </div>
          <button
            onClick={handleLookup}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white font-bold uppercase tracking-wider text-xs shadow-xs transition-all"
          >
            Track Status
          </button>
        </div>

        {lookupError && (
          <div className="text-xs text-red-600 font-medium">{lookupError}</div>
        )}

        {foundApp && (
          <div className="p-4 bg-[#F8F9FB] rounded-lg border border-slate-200 space-y-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#002366] font-display">{foundApp.fullName}</span>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded ${
                foundApp.status === 'Accepted'
                  ? 'bg-emerald-100 text-emerald-900'
                  : foundApp.status === 'Under Review'
                  ? 'bg-[#C5A059]/20 text-[#002366]'
                  : 'bg-blue-100 text-blue-900'
              }`}>
                Status: {foundApp.status}
              </span>
            </div>
            <div className="text-xs text-slate-600">
              <strong>Program:</strong> {foundApp.desiredProgramName}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Submitted: {foundApp.submittedDate} • App #: {foundApp.applicationNumber}
            </div>
            {foundApp.status === 'Accepted' && (
              <div className="pt-2 text-xs text-emerald-700 font-semibold">
                🎉 Congratulations! Your admission is approved. Please proceed to the Student Portal to begin course registration.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Multi-Step Form or Submission Confirmation */}
      {submittedApp ? (
        <div className="bg-white rounded-xl border-2 border-[#C5A059] p-8 shadow-md text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#C5A059]">Application Successfully Submitted</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#002366]">
              Welcome to the BIBU Academic Community!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Your application has been logged into the University Admissions Registry. You may track your admission status at any time using your reference code below.
            </p>
          </div>

          {/* Reference Badge */}
          <div className="p-4 bg-[#F8F9FB] border border-slate-200 rounded-xl inline-block text-left min-w-[280px]">
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Official Application Reference #</div>
            <div className="text-lg font-mono font-black text-[#002366]">{submittedApp.applicationNumber}</div>
            <div className="text-xs text-slate-600 mt-1">Applicant: <strong>{submittedApp.fullName}</strong></div>
            <div className="text-xs text-slate-600">Program: <strong>{submittedApp.desiredProgramName}</strong></div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                setSubmittedApp(null);
                setStep(1);
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider"
            >
              Submit Another Application
            </button>

            <button
              onClick={() => setCurrentView('student-dashboard')}
              className="px-6 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider shadow"
            >
              Preview Student LMS Dashboard →
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s
                    ? 'bg-[#002366] text-white ring-4 ring-[#002366]/10'
                    : step > s
                    ? 'bg-[#C5A059] text-[#002366]'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider hidden md:inline ${step === s ? 'text-[#002366]' : 'text-slate-400'}`}>
                  {s === 1 && 'Personal Info'}
                  {s === 2 && 'Ministry Background'}
                  {s === 3 && 'Academic Program'}
                  {s === 4 && 'Documents & Submit'}
                </span>
              </div>
            ))}
          </div>

          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold font-display text-[#002366] border-b border-slate-100 pb-2">
                Step 1: Biographical & Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Pastor David Emmanuel"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="david.emmanuel@gmail.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Phone Number with Country Code *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (602) 555-0199"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Country of Residence *</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. United States, Kenya, Ghana, United Kingdom"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Ministry Background */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold font-display text-[#002366] border-b border-slate-100 pb-2">
                Step 2: Church & Ministry Profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Current Church / Ministry Affiliation *</label>
                  <input
                    type="text"
                    required
                    value={formData.churchAffiliation}
                    onChange={(e) => setFormData({ ...formData, churchAffiliation: e.target.value })}
                    placeholder="e.g. Grace International Fellowship, Phoenix, AZ"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Current Ministry Role / Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.currentMinistryRole}
                    onChange={(e) => setFormData({ ...formData, currentMinistryRole: e.target.value })}
                    placeholder="e.g. Senior Pastor, Youth Director, Evangelist"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Years in Active Ministry *</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    required
                    value={formData.ministryExperienceYears}
                    onChange={(e) => setFormData({ ...formData, ministryExperienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Academic Program */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold font-display text-[#002366] border-b border-slate-100 pb-2">
                Step 3: Desired Academic Program & Background
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Select Desired Academic Program *</label>
                  <select
                    value={formData.desiredProgramId}
                    onChange={(e) => handleProgramChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  >
                    {programs.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        [{prog.level}] {prog.name} (${prog.tuitionFeeUSD} USD • {prog.durationMonths} Mos)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Previous Highest Education Level *</label>
                  <input
                    type="text"
                    required
                    value={formData.previousEducation}
                    onChange={(e) => setFormData({ ...formData, previousEducation: e.target.value })}
                    placeholder="e.g. High School Diploma, B.A. in Theology, Associate Degree"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Statement of Purpose & Ministry Calling *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.statementOfPurpose}
                    onChange={(e) => setFormData({ ...formData, statementOfPurpose: e.target.value })}
                    placeholder="Briefly state your spiritual calling, theological aspirations, and how this program will advance your ministry..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: References & Documents */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold font-display text-[#002366] border-b border-slate-100 pb-2">
                Step 4: Pastoral Reference & Supporting Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Pastoral / Mentor Reference Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.referenceName}
                    onChange={(e) => setFormData({ ...formData, referenceName: e.target.value })}
                    placeholder="e.g. Bishop Samuel K."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Reference Phone / Email *</label>
                  <input
                    type="text"
                    required
                    value={formData.referenceContact}
                    onChange={(e) => setFormData({ ...formData, referenceContact: e.target.value })}
                    placeholder="e.g. bishop.samuel@church.org"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  />
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-700">Attached Application Documents (Mock Upload)</label>
                <div className="space-y-2">
                  {formData.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F9FB] border border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-[#C5A059]" />
                        <span className="font-medium text-slate-800">{doc.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">{doc.size}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Declaration */}
              <div className="p-3 bg-[#002366]/5 border border-[#C5A059]/40 rounded-lg text-[11px] text-[#002366] leading-relaxed">
                By submitting this form, I affirm that all statements and credentials provided are truthful and authentic. I commit to upholding the moral and doctrinal standards of Breakthrough International Bible University.
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider shadow flex items-center gap-1.5"
              >
                <span>Continue to Step {step + 1}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-2.5 rounded-lg bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Official Application</span>
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
