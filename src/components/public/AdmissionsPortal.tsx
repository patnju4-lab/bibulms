import React, { useState, useMemo } from 'react';
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
  Search,
  MapPin,
  Building2,
  AlertTriangle,
  Printer,
  ShieldCheck,
  Award,
  Zap,
  Wifi,
  Camera,
  Check
} from 'lucide-react';
import { Application } from '../../types';
import { CentreStudent } from '../../types/examCentres';

export const AdmissionsPortal: React.FC = () => {
  const {
    programs,
    schools,
    submitApplication,
    applications,
    setCurrentView,
    kenyaCounties,
    globalCountries,
    examinationCentres,
    registerStudentWithCentre,
    checkDuplicateStudent
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [submittedApp, setSubmittedApp] = useState<Application | null>(null);
  const [admittedStudent, setAdmittedStudent] = useState<CentreStudent | null>(null);

  // Status Lookup State
  const [lookupCode, setLookupCode] = useState<string>('');
  const [foundApp, setFoundApp] = useState<Application | null>(null);
  const [lookupError, setLookupError] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    nationalIdOrPassport: '',
    email: '',
    phone: '',
    dateOfBirth: '1995-05-12',
    gender: 'Male',
    nationality: 'Kenyan',
    country: 'Kenya',
    countyOrState: 'Nairobi',
    examinationCentreId: examinationCentres[0]?.id || '',
    churchAffiliation: '',
    ministryExperienceYears: 3,
    currentMinistryRole: 'Assistant Pastor',
    schoolId: schools[0]?.id || 'sch-theology',
    desiredProgramId: programs[0]?.id || 'prog-bth',
    desiredProgramName: programs[0]?.name || 'Bachelor of Theology (B.Th)',
    academicLevel: 'Bachelor' as const,
    modeOfStudy: 'Digital Online & Centre-Based' as const,
    intake: 'September 2026' as const,
    previousEducation: 'High School Diploma / Associate Degree',
    statementOfPurpose: 'To receive formal biblical and theological education to advance Kingdom leadership.',
    referenceName: '',
    referenceContact: '',
    documents: [
      { name: 'National_ID_Passport.pdf', type: 'application/pdf', size: '1.2 MB' },
      { name: 'KCSE_HighSchool_Certificate.pdf', type: 'application/pdf', size: '2.4 MB' },
      { name: 'Pastoral_Recommendation_Letter.pdf', type: 'application/pdf', size: '890 KB' }
    ]
  });

  // Selected Examination Centre Details
  const selectedCentre = useMemo(() => {
    return examinationCentres.find(c => c.id === formData.examinationCentreId) || examinationCentres[0];
  }, [examinationCentres, formData.examinationCentreId]);

  // Duplicate Check
  const duplicateAlert = useMemo(() => {
    if (!formData.nationalIdOrPassport && !formData.email && !formData.phone) return null;
    return checkDuplicateStudent({
      nationalIdOrPassport: formData.nationalIdOrPassport,
      email: formData.email,
      phone: formData.phone
    });
  }, [formData.nationalIdOrPassport, formData.email, formData.phone, checkDuplicateStudent]);

  // Real-time Preview Student Number
  const previewStudentNumber = useMemo(() => {
    const year = new Date().getFullYear();
    const countryCode = formData.country === 'Kenya' ? 'KE' : 'INT';
    const locPrefix = (formData.countyOrState || 'GEN').substring(0, 3).toUpperCase();
    return `BIBU/${year}/${countryCode}/${locPrefix}/PREVIEW`;
  }, [formData.country, formData.countyOrState]);

  const handleProgramChange = (progId: string) => {
    const selected = programs.find((p) => p.id === progId);
    setFormData({
      ...formData,
      desiredProgramId: progId,
      desiredProgramName: selected?.name || '',
      academicLevel: (selected?.level as any) || 'Bachelor'
    });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.nationalIdOrPassport) {
        alert('Please fill in all mandatory biographical and contact fields.');
        return;
      }
    }
    if (step === 4 && !formData.examinationCentreId) {
      alert('You must select an Examination Centre to proceed.');
      return;
    }
    setStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (duplicateAlert) {
      if (!confirm(`Warning: A student matching your ID/Email is already registered under ${duplicateAlert.fullName} (${duplicateAlert.studentNumber}). Do you want to submit anyway?`)) {
        return;
      }
    }

    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || formData.fullName || 'Candidate Minister';

    // 1. Submit Application for tracking
    const app = submitApplication({
      fullName,
      email: formData.email || 'applicant@faith.org',
      phone: formData.phone || '+254 700 000 000',
      dateOfBirth: formData.dateOfBirth || '1995-05-12',
      gender: formData.gender,
      nationality: formData.nationality || 'Kenyan',
      country: formData.country || 'Kenya',
      churchAffiliation: formData.churchAffiliation || 'Grace Bible Fellowship',
      ministryExperienceYears: Number(formData.ministryExperienceYears) || 0,
      currentMinistryRole: formData.currentMinistryRole || 'Ministry Leader',
      desiredProgramId: formData.desiredProgramId,
      desiredProgramName: formData.desiredProgramName,
      previousEducation: formData.previousEducation,
      statementOfPurpose: formData.statementOfPurpose,
      referenceName: formData.referenceName || 'Senior Pastor Thomas',
      referenceContact: formData.referenceContact || 'pastor@church.org',
      documents: formData.documents
    });

    // 2. Direct Registration with Examination Centre
    const { student } = registerStudentWithCentre({
      firstName: formData.firstName || 'Candidate',
      lastName: formData.lastName || 'Minister',
      fullName,
      nationalIdOrPassport: formData.nationalIdOrPassport || 'ID-2026-X',
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender as any,
      nationality: formData.nationality,
      country: formData.country,
      countyOrState: formData.countyOrState,
      examinationCentreId: selectedCentre?.id || '',
      examinationCentreCode: selectedCentre?.centreCode || '',
      examinationCentreName: selectedCentre?.centreName || '',
      schoolId: formData.schoolId,
      schoolName: 'School of Theological Studies',
      programId: formData.desiredProgramId,
      programName: formData.desiredProgramName,
      academicLevel: formData.academicLevel,
      modeOfStudy: formData.modeOfStudy,
      intake: formData.intake,
      previousInstitution: formData.previousEducation,
      highestQualification: 'Secondary Certificate / Degree',
      qualificationGrade: 'Credit',
      yearCompleted: 2024,
      feeStatus: 'Partially Paid'
    });

    setSubmittedApp(app);
    setAdmittedStudent(student);
    window.scrollTo({ top: 50, behavior: 'smooth' });
  };

  const handleLookup = () => {
    setLookupError('');
    setFoundApp(null);
    if (!lookupCode.trim()) {
      setLookupError('Please enter an application reference number or student number.');
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
          <UniversityLogo size="xl" withRing className="shadow-lg ring-[#C5A059]" />
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#C5A059] uppercase tracking-widest">
          <GraduationCap className="w-4 h-4 text-[#C5A059]" />
          <span>Office of University Admissions & Global Examination Board</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#002366]">
          Online Admission & Global Examination Registration Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          Apply for accredited Certificate, Diploma, Bachelor, Master, or Doctoral degrees with designated Examination Centres across all 47 counties of Kenya and international partner hubs.
        </p>
      </div>

      {/* Lookup Existing Application Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#002366] uppercase tracking-wider">
            Already Registered? Track Application or Examination Status
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value)}
              placeholder="Enter Application # (e.g., BIBU-APP-2026-9041) or Student #"
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
          </div>
        )}
      </div>

      {/* Main Multi-Step Form or Submission Confirmation */}
      {submittedApp && admittedStudent ? (
        <div className="bg-white rounded-2xl border-2 border-[#C5A059] p-6 sm:p-8 shadow-xl text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#C5A059]">Admission & Examination Centre Allocation Confirmed</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#002366]">
              Congratulations, {admittedStudent.fullName}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Your application is approved and your permanent student profile is registered with your allocated Examination Centre.
            </p>
          </div>

          {/* Official Pass & Registration Card */}
          <div className="border-2 border-[#002366] rounded-xl p-5 space-y-4 bg-slate-50/50 text-left max-w-xl mx-auto shadow-sm">
            <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
              <div className="flex items-center gap-2.5">
                <UniversityLogo size="sm" withRing />
                <div>
                  <div className="font-display font-bold text-xs text-[#002366]">BREAKTHROUGH INTERNATIONAL BIBLE UNIVERSITY</div>
                  <div className="text-[9px] text-[#C5A059] font-black uppercase">Official Student Registration & Examination Pass</div>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold bg-[#002366] text-white px-2 py-0.5 rounded">
                VERIFIED ADMISSION
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Permanent Student Number:</span>
                <span className="text-sm font-mono font-black text-[#002366]">{admittedStudent.studentNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Application Reference:</span>
                <span className="text-xs font-mono font-bold text-slate-800">{submittedApp.applicationNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Candidate Name:</span>
                <strong className="text-slate-900">{admittedStudent.fullName}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">National ID / Passport:</span>
                <span className="font-mono font-bold text-slate-800">{admittedStudent.nationalIdOrPassport}</span>
              </div>
            </div>

            <div className="bg-[#002366] text-white rounded-lg p-3 text-xs space-y-1">
              <div className="text-[9px] uppercase tracking-widest text-[#C5A059] font-black">Allocated Official Examination Centre</div>
              <div className="font-bold text-sm">{admittedStudent.examinationCentreName}</div>
              <div className="text-[10px] text-slate-300 font-mono">
                Centre Code: {admittedStudent.examinationCentreCode} • {admittedStudent.countyOrState}, {admittedStudent.country}
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/20 mt-1">
                <span>Degree: <strong>{admittedStudent.programName} ({admittedStudent.academicLevel})</strong></span>
                <span>Seat: <strong className="text-[#C5A059]">{admittedStudent.currentExamSeatNumber || 'Assigned on Schedule'}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow"
            >
              <Printer className="w-4 h-4 text-[#C5A059]" />
              <span>Print Registration Pass</span>
            </button>
            <button
              onClick={() => setCurrentView('student-dashboard')}
              className="px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] text-xs font-black uppercase tracking-wider shadow"
            >
              Enter Student Portal →
            </button>
            <button
              onClick={() => {
                setSubmittedApp(null);
                setAdmittedStudent(null);
                setStep(1);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider"
            >
              New Application
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          {/* 5-Step Progress Indicator */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 overflow-x-auto">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  step === s
                    ? 'bg-[#002366] text-white ring-4 ring-[#002366]/10'
                    : step > s
                    ? 'bg-[#C5A059] text-[#002366]'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider hidden lg:inline ${step === s ? 'text-[#002366]' : 'text-slate-400'}`}>
                  {s === 1 && '1. Personal & ID'}
                  {s === 2 && '2. Ministry'}
                  {s === 3 && '3. Degree'}
                  {s === 4 && '4. Exam Centre'}
                  {s === 5 && '5. Submit'}
                </span>
              </div>
            ))}
          </div>

          {/* STEP 1: Personal Info & Duplicate Check */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold font-display text-[#002366]">
                  Step 1: Biographical & National Identity Verification
                </h3>
                <span className="text-[11px] text-slate-500 font-semibold">* Required fields</span>
              </div>

              {duplicateAlert && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Record Match:</strong> A student with this National ID, Email, or Phone already exists ({duplicateAlert.fullName} - {duplicateAlert.studentNumber}).
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. David"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Last Name / Surname *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Emmanuel"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">National ID / Passport Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.nationalIdOrPassport}
                    onChange={(e) => setFormData({ ...formData, nationalIdOrPassport: e.target.value })}
                    placeholder="e.g. 29384712 or A0192837"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="david.emmanuel@faith.org"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 700 123456"
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
                  <label className="text-xs font-semibold text-slate-700">Nationality *</label>
                  <input
                    type="text"
                    required
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    placeholder="e.g. Kenyan, Ugandan, American, Nigerian"
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
                    placeholder="e.g. Deliverance Church International, Nairobi"
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
                    placeholder="e.g. Assistant Pastor, Deacon, Worship Leader"
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
                Step 3: Academic Degree Program & Prior Qualifications
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Select Degree Program *</label>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Study Mode *</label>
                    <select
                      value={formData.modeOfStudy}
                      onChange={(e) => setFormData({ ...formData, modeOfStudy: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Digital Online & Centre-Based">Digital Online & Centre-Based</option>
                      <option value="Intensive Hybrid">Intensive Hybrid</option>
                      <option value="Centre Weekend Cohort">Centre Weekend Cohort</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Intake Cohort *</label>
                    <select
                      value={formData.intake}
                      onChange={(e) => setFormData({ ...formData, intake: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="September 2026">September 2026</option>
                      <option value="January 2027">January 2027</option>
                      <option value="May 2026">May 2026</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Previous Highest Education Level *</label>
                  <input
                    type="text"
                    required
                    value={formData.previousEducation}
                    onChange={(e) => setFormData({ ...formData, previousEducation: e.target.value })}
                    placeholder="e.g. KCSE / High School Diploma, Diploma in Theology, B.A."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Statement of Purpose & Ministry Calling *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.statementOfPurpose}
                    onChange={(e) => setFormData({ ...formData, statementOfPurpose: e.target.value })}
                    placeholder="Briefly state your spiritual calling and theological aspirations..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: MANDATORY EXAMINATION CENTRE SELECTION */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="text-base font-bold font-display text-[#002366]">
                    Step 4: Mandatory Examination Centre Selection
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select the physical examination venue where you will sit for invigilated degree examinations and receive official candidate credentials.
                </p>
              </div>

              {/* Country & County Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Country of Examination *</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    {globalCountries.map(gc => (
                      <option key={gc.id} value={gc.countryName}>{gc.countryName} ({gc.countryCode})</option>
                    ))}
                  </select>
                </div>

                {formData.country === 'Kenya' ? (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Kenya County (All 47 Available) *</label>
                    <select
                      value={formData.countyOrState}
                      onChange={(e) => setFormData({ ...formData, countyOrState: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium"
                    >
                      {kenyaCounties.map(kc => (
                        <option key={kc.id} value={kc.name}>{kc.codeString} - {kc.name} ({kc.region})</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Region / Province / State *</label>
                    <input
                      type="text"
                      value={formData.countyOrState}
                      onChange={(e) => setFormData({ ...formData, countyOrState: e.target.value })}
                      placeholder="e.g. London, Arizona, Kampala"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                    />
                  </div>
                )}
              </div>

              {/* Examination Centre Card Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#002366] uppercase tracking-wider block">
                  Select Accredited Examination Centre in {formData.countyOrState || formData.country}
                </label>

                <div className="grid grid-cols-1 gap-3">
                  {examinationCentres
                    .filter(c => formData.country !== 'Kenya' || c.countyOrState === formData.countyOrState || c.countryName === 'Kenya')
                    .map(centre => {
                      const isSelected = formData.examinationCentreId === centre.id;
                      return (
                        <div
                          key={centre.id}
                          onClick={() => setFormData({ ...formData, examinationCentreId: centre.id })}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#002366] bg-[#002366]/5 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] font-black text-[#C5A059] bg-[#002366] px-2 py-0.5 rounded">
                                  {centre.centreCode}
                                </span>
                                <h4 className="font-bold text-sm text-[#002366]">{centre.centreName}</h4>
                              </div>
                              <p className="text-xs text-slate-600 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                                <span>{centre.physicalAddress}, {centre.countyOrState}, {centre.countryName}</span>
                              </p>
                              <div className="text-[11px] text-slate-500 pt-0.5">
                                Coordinator: <strong>{centre.representativeName}</strong> • {centre.phone}
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                isSelected ? 'border-[#002366] bg-[#002366] text-white' : 'border-slate-300'
                              }`}>
                                {isSelected && <Check className="w-3 h-3" />}
                              </div>
                              <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                {centre.availableSeats} seats left
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 pt-2.5 mt-2.5 border-t border-slate-100 text-[10px] text-slate-600">
                            <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-blue-600" /> {centre.internetAvailability}</span>
                            {centre.backupPowerGenerator && <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-600" /> Generator Backup</span>}
                            <span className="flex items-center gap-1"><Camera className="w-3 h-3 text-slate-600" /> CCTV Monitored</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Student Registration Number Live Preview */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Permanent Student Number Preview</span>
                <div className="font-mono text-base font-black text-[#002366]">{previewStudentNumber}</div>
                <p className="text-[11px] text-slate-500">
                  This permanent institutional number will remain your official student ID and examination identifier throughout all degree levels.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: Pastoral Reference & Submit */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold font-display text-[#002366] border-b border-slate-100 pb-2">
                Step 5: Pastoral Reference, Supporting Credentials & Submission
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Pastoral / Ministry Reference Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.referenceName}
                    onChange={(e) => setFormData({ ...formData, referenceName: e.target.value })}
                    placeholder="e.g. Bishop Samuel Kariuki"
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
                    placeholder="e.g. +254 711 223344 / bishop@church.org"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#002366] focus:outline-none"
                  />
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-700">Uploaded Credentials & Identity Documents</label>
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

              {/* Summary of Selected Centre */}
              <div className="p-4 bg-[#002366] text-white rounded-xl space-y-1 text-xs">
                <div className="text-[10px] uppercase tracking-widest text-[#C5A059] font-black">Final Registration Summary</div>
                <div>Candidate: <strong>{formData.firstName} {formData.lastName}</strong> (National ID: {formData.nationalIdOrPassport})</div>
                <div>Degree: <strong>{formData.desiredProgramName}</strong></div>
                <div>Assigned Centre: <strong>{selectedCentre?.centreName} ({selectedCentre?.centreCode})</strong> - {selectedCentre?.countyOrState}</div>
              </div>

              {/* Declaration */}
              <div className="p-3 bg-[#002366]/5 border border-[#C5A059]/40 rounded-lg text-[11px] text-[#002366] leading-relaxed">
                By submitting this form, I affirm that all statements and credentials provided are authentic. I commit to attending examinations at my chosen accredited Centre and upholding the moral standards of Breakthrough International Bible University.
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

            {step < 5 ? (
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
                <span>Submit & Receive Registration Pass</span>
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
