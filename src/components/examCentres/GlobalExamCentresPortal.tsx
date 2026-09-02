import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  Globe,
  Building2,
  MapPin,
  Users,
  UserCheck,
  Search,
  Plus,
  ArrowRightLeft,
  FileCheck,
  Calendar,
  ClipboardList,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Printer,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  Phone,
  Mail,
  Award,
  Layers,
  Sparkles,
  Wifi,
  Zap,
  Camera,
  BookOpen,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  KenyaCounty,
  GlobalCountry,
  ExaminationCentre,
  CentreStudent,
  AttendanceStatus,
  ContinentCode,
  KenyaRegion
} from '../../types/examCentres';

type ActiveTab = 
  | 'overview'
  | 'kenya-47'
  | 'global-countries'
  | 'centres'
  | 'students'
  | 'attendance'
  | 'audit-logs'
  | 'reports';

export const GlobalExamCentresPortal: React.FC = () => {
  const {
    currentUser,
    kenyaCounties,
    globalCountries,
    examinationCentres,
    centreStudents,
    examSessions,
    examAttendanceRecords,
    auditLogs,
    addExaminationCentre,
    updateExaminationCentre,
    deleteExaminationCentre,
    registerStudentWithCentre,
    transferStudentCentre,
    verifyStudentDocument,
    recordExamAttendance,
    updateAttendanceStatus,
    addKenyaCounty,
    addGlobalCountry,
    checkDuplicateStudent,
    generateStudentNumber,
    generateCentreCode,
    programs,
    schools
  } = useApp();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Filters & Search States
  const [kenyaSearch, setKenyaSearch] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [selectedCountyDrilldown, setSelectedCountyDrilldown] = useState<KenyaCounty | null>(null);

  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedContinentFilter, setSelectedContinentFilter] = useState<string>('all');

  const [centreSearch, setCentreSearch] = useState('');
  const [centreCountryFilter, setCentreCountryFilter] = useState<string>('all');
  const [centreCountyFilter, setCentreCountyFilter] = useState<string>('all');

  const [studentSearch, setStudentSearch] = useState('');
  const [studentCentreFilter, setStudentCentreFilter] = useState<string>('all');
  const [studentLevelFilter, setStudentLevelFilter] = useState<string>('all');

  // Modals State
  const [showAddCentreModal, setShowAddCentreModal] = useState(false);
  const [showAddCountryModal, setShowAddCountryModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showRegisterStudentModal, setShowRegisterStudentModal] = useState(false);
  const [showHallTicketModal, setShowHallTicketModal] = useState(false);
  const [showVerifyDocModal, setShowVerifyDocModal] = useState(false);
  const [selectedStudentForAction, setSelectedStudentForAction] = useState<CentreStudent | null>(null);

  // Transfer Form State
  const [transferTargetCentreId, setTransferTargetCentreId] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [transferFeedback, setTransferFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Attendance Session & Centre Selection
  const [selectedSessionId, setSelectedSessionId] = useState<string>(examSessions[0]?.id || 'ses-001');
  const [selectedAttendanceCentreId, setSelectedAttendanceCentreId] = useState<string>(examinationCentres[0]?.id || '');

  // Add Centre Form State
  const [newCentreData, setNewCentreData] = useState({
    centreName: '',
    continent: 'AFRICA' as ContinentCode,
    countryCode: 'KE',
    countryName: 'Kenya',
    countyOrState: 'Nairobi',
    countyCode: 47,
    cityOrTown: 'Nairobi',
    physicalAddress: '',
    centreType: 'Main Examination Centre' as const,
    centreStatus: 'Active' as const,
    capacity: 250,
    representativeName: '',
    representativeRole: 'Centre Coordinator',
    phone: '',
    email: '',
    internetAvailability: 'High-Speed Fiber / Dedicated WiFi' as const,
    backupPowerGenerator: true,
    totalComputers: 45,
    accessibilityInfo: 'Ground floor with ramp accessibility and paved entrance.',
    securityArrangements: 'Secure perimeter, CCTV surveillance, lockable strongroom for exam materials.',
    institutionAffiliation: 'BIBU Affiliated Partner Centre',
    rooms: [
      { id: 'r1', roomName: 'Main Exam Hall', roomNumber: 'H-101', capacity: 150, isComputerLab: false, computerCount: 0, hasCctv: true, hasAc: true, wheelchairAccessible: true },
      { id: 'r2', roomName: 'Computer Lab 1', roomNumber: 'LAB-201', capacity: 50, isComputerLab: true, computerCount: 45, hasCctv: true, hasAc: true, wheelchairAccessible: true }
    ]
  });

  // Add Country Form State
  const [newCountryData, setNewCountryData] = useState({
    countryCode: '',
    countryName: '',
    continent: 'AFRICA' as ContinentCode,
    dialCode: '+',
    currency: 'USD',
    nationalRepresentativeName: '',
    nationalRepresentativeEmail: '',
    nationalRepresentativePhone: '',
    officeLocation: '',
    active: true,
    totalCentresCount: 1,
    totalStudentsCount: 0,
    totalExamCandidatesCount: 0
  });

  // Quick Student Registration Form State
  const [quickStudentForm, setQuickStudentForm] = useState({
    firstName: '',
    lastName: '',
    nationalIdOrPassport: '',
    email: '',
    phone: '',
    dateOfBirth: '1995-01-01',
    gender: 'Male' as 'Male' | 'Female',
    nationality: 'Kenyan',
    country: 'Kenya',
    countyOrState: 'Nairobi',
    examinationCentreId: examinationCentres[0]?.id || '',
    schoolId: schools[0]?.id || 'sch-theology',
    programId: programs[0]?.id || 'prog-bth',
    academicLevel: 'Bachelor' as const,
    modeOfStudy: 'Digital Online & Centre-Based' as const,
    intake: 'September 2026' as const,
    previousInstitution: 'High School / Ministry College',
    highestQualification: 'Diploma',
    qualificationGrade: 'Credit',
    yearCompleted: 2023,
    feeStatus: 'Fully Paid' as const
  });

  // Duplicate Check Result
  const duplicateAlert = useMemo(() => {
    if (!quickStudentForm.nationalIdOrPassport && !quickStudentForm.email && !quickStudentForm.phone) return null;
    return checkDuplicateStudent({
      nationalIdOrPassport: quickStudentForm.nationalIdOrPassport,
      email: quickStudentForm.email,
      phone: quickStudentForm.phone
    });
  }, [quickStudentForm.nationalIdOrPassport, quickStudentForm.email, quickStudentForm.phone, checkDuplicateStudent]);

  // Overall Global Calculations
  const stats = useMemo(() => {
    const totalKenyaCounties = kenyaCounties.length;
    const activeKenyaCounties = kenyaCounties.filter(c => c.active).length;
    const totalGlobalCountries = globalCountries.length;
    const totalCentres = examinationCentres.length;
    const activeCentres = examinationCentres.filter(c => c.centreStatus === 'Active' || c.centreStatus === 'Approved').length;
    const totalGlobalCapacity = examinationCentres.reduce((acc, c) => acc + (c.capacity || 0), 0);
    const totalEnrolledStudents = centreStudents.length;
    const totalExamCandidates = centreStudents.filter(s => s.examinationEligibility === 'Eligible & Cleared').length;
    const totalAvailableSeats = examinationCentres.reduce((acc, c) => acc + (c.availableSeats || 0), 0);
    const capacityUtilizationPercent = totalGlobalCapacity > 0 ? Math.round(((totalGlobalCapacity - totalAvailableSeats) / totalGlobalCapacity) * 100) : 0;

    return {
      totalKenyaCounties,
      activeKenyaCounties,
      totalGlobalCountries,
      totalCentres,
      activeCentres,
      totalGlobalCapacity,
      totalEnrolledStudents,
      totalExamCandidates,
      totalAvailableSeats,
      capacityUtilizationPercent
    };
  }, [kenyaCounties, globalCountries, examinationCentres, centreStudents]);

  // Filtered Kenya Counties
  const filteredKenyaCounties = useMemo(() => {
    return kenyaCounties.filter(county => {
      const matchSearch = 
        county.name.toLowerCase().includes(kenyaSearch.toLowerCase()) ||
        county.codeString.includes(kenyaSearch) ||
        county.headquarters.toLowerCase().includes(kenyaSearch.toLowerCase()) ||
        county.countyRepresentativeName.toLowerCase().includes(kenyaSearch.toLowerCase());
      const matchRegion = selectedRegionFilter === 'all' || county.region === selectedRegionFilter;
      return matchSearch && matchRegion;
    });
  }, [kenyaCounties, kenyaSearch, selectedRegionFilter]);

  // Filtered Global Countries
  const filteredGlobalCountries = useMemo(() => {
    return globalCountries.filter(gc => {
      const matchSearch = 
        gc.countryName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        gc.countryCode.toLowerCase().includes(globalSearch.toLowerCase()) ||
        gc.nationalRepresentativeName.toLowerCase().includes(globalSearch.toLowerCase());
      const matchContinent = selectedContinentFilter === 'all' || gc.continent === selectedContinentFilter;
      return matchSearch && matchContinent;
    });
  }, [globalCountries, globalSearch, selectedContinentFilter]);

  // Filtered Centres
  const filteredCentres = useMemo(() => {
    return examinationCentres.filter(c => {
      const matchSearch = 
        c.centreName.toLowerCase().includes(centreSearch.toLowerCase()) ||
        c.centreCode.toLowerCase().includes(centreSearch.toLowerCase()) ||
        c.cityOrTown.toLowerCase().includes(centreSearch.toLowerCase()) ||
        c.representativeName.toLowerCase().includes(centreSearch.toLowerCase());
      const matchCountry = centreCountryFilter === 'all' || c.countryCode === centreCountryFilter;
      const matchCounty = centreCountyFilter === 'all' || c.countyOrState === centreCountyFilter;
      return matchSearch && matchCountry && matchCounty;
    });
  }, [examinationCentres, centreSearch, centreCountryFilter, centreCountyFilter]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return centreStudents.filter(s => {
      const matchSearch = 
        s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.studentNumber.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.nationalIdOrPassport.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.examinationCentreName.toLowerCase().includes(studentSearch.toLowerCase());
      const matchCentre = studentCentreFilter === 'all' || s.examinationCentreId === studentCentreFilter;
      const matchLevel = studentLevelFilter === 'all' || s.academicLevel === studentLevelFilter;
      return matchSearch && matchCentre && matchLevel;
    });
  }, [centreStudents, studentSearch, studentCentreFilter, studentLevelFilter]);

  // Filtered Attendance Records
  const filteredAttendance = useMemo(() => {
    return examAttendanceRecords.filter(r => {
      const matchSession = !selectedSessionId || r.examSessionId === selectedSessionId;
      const matchCentre = !selectedAttendanceCentreId || r.centreId === selectedAttendanceCentreId;
      return matchSession && matchCentre;
    });
  }, [examAttendanceRecords, selectedSessionId, selectedAttendanceCentreId]);

  // Handle Add Centre Submit
  const handleCreateCentre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCentreData.centreName.trim()) {
      alert('Please provide a centre name.');
      return;
    }
    const created = addExaminationCentre({
      ...newCentreData,
      registrationDate: new Date().toISOString().split('T')[0],
      approvalDate: new Date().toISOString().split('T')[0],
      expiryOrReviewDate: '2028-12-31'
    });
    setShowAddCentreModal(false);
    alert(`Successfully registered Examination Centre: ${created.centreName} (${created.centreCode})`);
  };

  // Handle Add Global Country Submit
  const handleCreateCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountryData.countryCode || !newCountryData.countryName) {
      alert('Please fill in country code and country name.');
      return;
    }
    const created = addGlobalCountry({
      ...newCountryData,
      countryCode: newCountryData.countryCode.toUpperCase()
    });
    setShowAddCountryModal(false);
    alert(`Successfully activated Country: ${created.countryName} (${created.countryCode}) with National Representative.`);
  };

  // Handle Quick Student Register Submit
  const handleQuickStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (duplicateAlert) {
      if (!confirm(`Warning: A duplicate record was found for ${duplicateAlert.fullName} (${duplicateAlert.studentNumber}). Do you still want to proceed?`)) {
        return;
      }
    }
    const selectedCentre = examinationCentres.find(c => c.id === quickStudentForm.examinationCentreId);
    const selectedProg = programs.find(p => p.id === quickStudentForm.programId);
    const selectedSch = schools.find(s => s.id === quickStudentForm.schoolId);

    const { student, studentNumber } = registerStudentWithCentre({
      firstName: quickStudentForm.firstName,
      lastName: quickStudentForm.lastName,
      fullName: `${quickStudentForm.firstName} ${quickStudentForm.lastName}`.trim(),
      nationalIdOrPassport: quickStudentForm.nationalIdOrPassport,
      email: quickStudentForm.email,
      phone: quickStudentForm.phone,
      dateOfBirth: quickStudentForm.dateOfBirth,
      gender: quickStudentForm.gender,
      nationality: quickStudentForm.nationality,
      country: quickStudentForm.country,
      countyOrState: quickStudentForm.countyOrState,
      examinationCentreId: selectedCentre?.id || '',
      examinationCentreCode: selectedCentre?.centreCode || '',
      examinationCentreName: selectedCentre?.centreName || '',
      schoolId: selectedSch?.id || 'sch-theology',
      schoolName: selectedSch?.name || 'School of Theological Studies',
      programId: selectedProg?.id || 'prog-bth',
      programName: selectedProg?.name || 'Bachelor of Theology (B.Th)',
      academicLevel: quickStudentForm.academicLevel,
      modeOfStudy: quickStudentForm.modeOfStudy,
      intake: quickStudentForm.intake,
      previousInstitution: quickStudentForm.previousInstitution,
      highestQualification: quickStudentForm.highestQualification,
      qualificationGrade: quickStudentForm.qualificationGrade,
      yearCompleted: quickStudentForm.yearCompleted,
      feeStatus: quickStudentForm.feeStatus
    });

    setShowRegisterStudentModal(false);
    setSelectedStudentForAction(student);
    setShowHallTicketModal(true);
    alert(`Student successfully admitted and enrolled! Permanent Student Number generated: ${studentNumber}`);
  };

  // Handle Student Transfer Submit
  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForAction || !transferTargetCentreId) return;

    const res = transferStudentCentre(
      selectedStudentForAction.id,
      transferTargetCentreId,
      transferReason || 'Student relocation / Centre transfer request',
      currentUser.name
    );

    setTransferFeedback(res);
    if (res.success) {
      setTimeout(() => {
        setShowTransferModal(false);
        setTransferFeedback(null);
        setSelectedStudentForAction(null);
        setTransferTargetCentreId('');
        setTransferReason('');
      }, 1500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Institutional Badge */}
      <div className="bg-gradient-to-r from-[#002366] via-[#001A4D] to-[#001030] text-white rounded-2xl p-6 sm:p-8 shadow-xl border-b-4 border-[#C5A059] relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <Globe className="w-96 h-96 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <UniversityLogo size="lg" withRing className="shadow-2xl ring-[#C5A059]" />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#C5A059] text-[#002366] text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  Global Campus Registry
                </span>
                <span className="text-slate-300 text-xs font-semibold">
                  47 Counties of Kenya & Worldwide National Centres
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
                Global Examination Centre & Student Registration System
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mt-1">
                Centralized hierarchy managing Global BIBU → Continent → Country → Region/County → Examination Centre → Representative → Admitted Students with permanent historical records.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowRegisterStudentModal(true)}
              className="bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Admit & Register Student</span>
            </button>
            <button
              onClick={() => setShowAddCentreModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4 text-[#C5A059]" />
              <span>Add Exam Centre</span>
            </button>
          </div>
        </div>

        {/* Global Statistics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">47 Kenya Counties</span>
            <span className="text-xl font-black text-[#C5A059]">{stats.activeKenyaCounties} / 47</span>
            <span className="text-[10px] text-emerald-400 block font-medium">100% Deployed</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Global Countries</span>
            <span className="text-xl font-black text-white">{stats.totalGlobalCountries}</span>
            <span className="text-[10px] text-slate-300 block font-medium">Worldwide Reps</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Exam Centres</span>
            <span className="text-xl font-black text-white">{stats.totalCentres}</span>
            <span className="text-[10px] text-emerald-400 block font-medium">{stats.activeCentres} Approved</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Registered Students</span>
            <span className="text-xl font-black text-[#C5A059]">{stats.totalEnrolledStudents}</span>
            <span className="text-[10px] text-slate-300 block font-medium">Permanent Record</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Cleared Candidates</span>
            <span className="text-xl font-black text-white">{stats.totalExamCandidates}</span>
            <span className="text-[10px] text-emerald-400 block font-medium">Exam Ready</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Global Capacity</span>
            <span className="text-xl font-black text-white">{stats.totalGlobalCapacity.toLocaleString()}</span>
            <span className="text-[10px] text-amber-300 block font-medium">{stats.capacityUtilizationPercent}% Utilized</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Global Overview', icon: Globe },
          { id: 'kenya-47', label: 'Kenya 47 Counties', icon: MapPin },
          { id: 'global-countries', label: 'Worldwide Nations', icon: Building2 },
          { id: 'centres', label: 'Examination Centres', icon: Building2 },
          { id: 'students', label: 'Student Centre Allocations', icon: Users },
          { id: 'attendance', label: 'Invigilation & Attendance', icon: ClipboardList },
          { id: 'audit-logs', label: 'Audit Trail & Transfers', icon: ShieldCheck },
          { id: 'reports', label: 'Reports & Export', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#002366] text-[#C5A059] shadow-md border-b-2 border-[#C5A059]'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A059]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: GLOBAL OVERVIEW */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Action Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  All 47 Counties Active
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#002366]">Republic of Kenya Network</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Full coverage across Nairobi, Central, Coast, Eastern, North Eastern, Rift Valley, Western, and Nyanza regions with appointed county representatives.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('kenya-47')}
                className="w-full bg-slate-50 hover:bg-slate-100 text-[#002366] font-bold text-xs py-2 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Explore 47 County Directory</span>
                <ChevronRight className="w-4 h-4 text-[#C5A059]" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  International Presence
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#002366]">Worldwide National Reps</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Coordinated examination hubs across Africa (Uganda, Tanzania, Nigeria, Ghana, South Africa), North America (USA, Canada), Europe (UK), and Asia (India).
                </p>
              </div>
              <button
                onClick={() => setActiveTab('global-countries')}
                className="w-full bg-slate-50 hover:bg-slate-100 text-[#002366] font-bold text-xs py-2 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Global Nations</span>
                <ChevronRight className="w-4 h-4 text-[#C5A059]" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Tamper-Proof Audit
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#002366]">Student Transfer & Centre History</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Every admission, centre change, seat assignment, document verification, and invigilator signature is stored with full historical provenance.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('audit-logs')}
                className="w-full bg-slate-50 hover:bg-slate-100 text-[#002366] font-bold text-xs py-2 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Inspect Audit Log</span>
                <ChevronRight className="w-4 h-4 text-[#C5A059]" />
              </button>
            </div>
          </div>

          {/* Regional Summary Grid */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#002366]">Kenya Regional Examination Distribution</h3>
                <p className="text-xs text-slate-500">Summary of examination centres and candidate allocation across all 8 provinces/regions.</p>
              </div>
              <span className="text-xs font-bold text-[#C5A059] bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                47 Counties Integrated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Nairobi Region', counties: 1, centres: 2, candidates: 145, rep: 'Bishop Dr. Peter Mwangi' },
                { name: 'Central Region', counties: 5, centres: 4, candidates: 88, rep: 'Rev. Francis Kariuki' },
                { name: 'Coast Region', counties: 6, centres: 3, candidates: 64, rep: 'Pastor Emmanuel Safari' },
                { name: 'Rift Valley Region', counties: 14, centres: 8, candidates: 120, rep: 'Bishop Dr. Kipkorir Langat' },
                { name: 'Eastern Region', counties: 8, centres: 4, candidates: 72, rep: 'Pastor Mutua Musyoka' },
                { name: 'Western Region', counties: 4, centres: 3, candidates: 58, rep: 'Rev. Barasa Wekesa' },
                { name: 'Nyanza Region', counties: 6, centres: 4, candidates: 66, rep: 'Pastor Otieno Odhiambo' },
                { name: 'North Eastern Region', counties: 3, centres: 1, candidates: 18, rep: 'Dr. Farah Abdi' },
              ].map(reg => (
                <div key={reg.name} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2 hover:border-[#C5A059] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#002366]">{reg.name}</span>
                    <span className="text-[10px] font-bold bg-[#002366] text-white px-2 py-0.5 rounded-full">{reg.counties} Counties</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Centres: <strong className="text-slate-900">{reg.centres}</strong></span>
                    <span>Candidates: <strong className="text-[#C5A059]">{reg.candidates}</strong></span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate pt-1 border-t border-slate-200/60">
                    Lead Rep: {reg.rep}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: KENYA 47 COUNTIES DIRECTORY */}
      {/* ========================================================= */}
      {activeTab === 'kenya-47' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#002366]">Republic of Kenya — 47 Counties Directory</h3>
                <p className="text-xs text-slate-500">Official registry of all 47 counties with assigned county representatives, exam centres, and registered student counts.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={kenyaSearch}
                    onChange={(e) => setKenyaSearch(e.target.value)}
                    placeholder="Search county name or code..."
                    className="pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002366] w-64"
                  />
                </div>

                <select
                  value={selectedRegionFilter}
                  onChange={(e) => setSelectedRegionFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#002366]"
                >
                  <option value="all">All 8 Regions</option>
                  <option value="Nairobi">Nairobi</option>
                  <option value="Central">Central</option>
                  <option value="Coast">Coast</option>
                  <option value="Eastern">Eastern</option>
                  <option value="North Eastern">North Eastern</option>
                  <option value="Rift Valley">Rift Valley</option>
                  <option value="Western">Western</option>
                  <option value="Nyanza">Nyanza</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#002366] text-white font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">County Name</th>
                    <th className="py-3 px-4">Region</th>
                    <th className="py-3 px-4">Headquarters</th>
                    <th className="py-3 px-4">Exam Centres</th>
                    <th className="py-3 px-4">Candidates</th>
                    <th className="py-3 px-4">County Representative</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredKenyaCounties.map(county => (
                    <tr key={county.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#002366]">
                        {county.codeString}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {county.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {county.region}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{county.headquarters}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#002366]">{county.centreCount}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#C5A059]">{county.candidateCount}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{county.countyRepresentativeName}</div>
                        <div className="text-[10px] text-slate-500">{county.representativePhone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setCentreCountyFilter(county.name);
                            setActiveTab('centres');
                          }}
                          className="text-[#002366] hover:text-[#C5A059] font-bold text-[11px] underline"
                        >
                          View Centres
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: GLOBAL COUNTRIES DIRECTORY */}
      {/* ========================================================= */}
      {activeTab === 'global-countries' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#002366]">Worldwide National Examination Representatives</h3>
                <p className="text-xs text-slate-500">Authorized national directors and representatives coordinating BIBU examination centres globally.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    placeholder="Search country or representative..."
                    className="pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002366] w-64"
                  />
                </div>

                <button
                  onClick={() => setShowAddCountryModal(true)}
                  className="bg-[#002366] hover:bg-[#001A4D] text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#C5A059]" />
                  <span>Add Country</span>
                </button>
              </div>
            </div>

            {/* Global Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGlobalCountries.map(gc => (
                <div key={gc.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 hover:border-[#C5A059] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-[#002366] text-[#C5A059] font-black flex items-center justify-center text-xs">
                        {gc.countryCode}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-[#002366]">{gc.countryName}</h4>
                        <span className="text-[10px] text-slate-500">{gc.continent} • {gc.currency}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1.5 border border-slate-100">
                    <div className="text-[10px] uppercase font-bold text-slate-400">National Representative</div>
                    <div className="font-bold text-slate-900">{gc.nationalRepresentativeName}</div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-600">
                      <Phone className="w-3 h-3 text-[#C5A059]" />
                      <span>{gc.nationalRepresentativePhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 truncate">
                      <Mail className="w-3 h-3 text-[#C5A059]" />
                      <span>{gc.nationalRepresentativeEmail}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-1">
                      {gc.officeLocation}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Centres: <strong className="text-slate-900">{gc.totalCentresCount}</strong></span>
                    <span className="text-slate-500">Candidates: <strong className="text-[#C5A059]">{gc.totalExamCandidatesCount}</strong></span>
                    <button
                      onClick={() => {
                        setCentreCountryFilter(gc.countryCode);
                        setActiveTab('centres');
                      }}
                      className="text-[#002366] hover:text-[#C5A059] font-bold text-[11px]"
                    >
                      Centres →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: EXAMINATION CENTRES DIRECTORY & MANAGER */}
      {/* ========================================================= */}
      {activeTab === 'centres' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#002366]">Examination Centres Directory & Manager</h3>
                <p className="text-xs text-slate-500">Manage all accredited examination centres, seat capacity limits, invigilators, and facilities.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={centreSearch}
                    onChange={(e) => setCentreSearch(e.target.value)}
                    placeholder="Search centre name, code, city..."
                    className="pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002366] w-64"
                  />
                </div>

                <select
                  value={centreCountryFilter}
                  onChange={(e) => {
                    setCentreCountryFilter(e.target.value);
                    setCentreCountyFilter('all');
                  }}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#002366]"
                >
                  <option value="all">All Countries</option>
                  {globalCountries.map(c => (
                    <option key={c.id} value={c.countryCode}>{c.countryName} ({c.countryCode})</option>
                  ))}
                </select>

                <button
                  onClick={() => setShowAddCentreModal(true)}
                  className="bg-[#002366] hover:bg-[#001A4D] text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#C5A059]" />
                  <span>New Centre</span>
                </button>
              </div>
            </div>

            {/* Centres List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCentres.map(c => (
                <div key={c.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4 hover:border-[#002366] transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-black text-[#C5A059] bg-[#002366] px-2 py-0.5 rounded">
                        {c.centreCode}
                      </span>
                      <h4 className="text-base font-bold text-[#002366] mt-1.5">{c.centreName}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>{c.physicalAddress}, {c.countyOrState}, {c.countryName}</span>
                      </p>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.centreStatus === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.centreStatus}
                    </span>
                  </div>

                  {/* Representative & Contacts */}
                  <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1 border border-slate-100">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Centre Representative</div>
                    <div className="font-bold text-slate-900">{c.representativeName} ({c.representativeRole})</div>
                    <div className="flex items-center gap-4 text-[11px] text-slate-600 pt-0.5">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#C5A059]" /> {c.phone}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#C5A059]" /> {c.email}</span>
                    </div>
                  </div>

                  {/* Facilities and Capacity */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Capacity</span>
                      <strong className="text-slate-900">{c.capacity} Seats</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Registered</span>
                      <strong className="text-[#002366]">{c.registeredCandidatesCount} Candidates</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Available</span>
                      <strong className="text-emerald-700">{c.availableSeats} Seats</strong>
                    </div>
                  </div>

                  {/* Facility Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-[10px]">
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                      <Wifi className="w-3 h-3" /> {c.internetAvailability}
                    </span>
                    {c.backupPowerGenerator && (
                      <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                        <Zap className="w-3 h-3" /> Generator Backup
                      </span>
                    )}
                    <span className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      <Camera className="w-3 h-3" /> CCTV Protected
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => {
                        setStudentCentreFilter(c.id);
                        setActiveTab('students');
                      }}
                      className="text-[#002366] hover:text-[#C5A059] font-bold flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>View Candidates ({c.registeredCandidatesCount})</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAttendanceCentreId(c.id);
                        setActiveTab('attendance');
                      }}
                      className="text-slate-600 hover:text-[#002366] font-bold flex items-center gap-1"
                    >
                      <ClipboardList className="w-3.5 h-3.5" />
                      <span>Invigilation Sheet</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: STUDENT CENTRE ALLOCATION & REGISTRY */}
      {/* ========================================================= */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#002366]">Student Examination Centre Allocation & Records</h3>
                <p className="text-xs text-slate-500">Search student permanent numbers, verify admission centres, transfer centres with audit preservation, and issue exam hall tickets.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search student number, name, ID..."
                    className="pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002366] w-64"
                  />
                </div>

                <select
                  value={studentCentreFilter}
                  onChange={(e) => setStudentCentreFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#002366]"
                >
                  <option value="all">All Centres</option>
                  {examinationCentres.map(c => (
                    <option key={c.id} value={c.id}>{c.centreName} ({c.centreCode})</option>
                  ))}
                </select>

                <button
                  onClick={() => setShowRegisterStudentModal(true)}
                  className="bg-[#002366] hover:bg-[#001A4D] text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#C5A059]" />
                  <span>Admit Student</span>
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#002366] text-white font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Student Number</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Assigned Exam Centre</th>
                    <th className="py-3 px-4">Program & Level</th>
                    <th className="py-3 px-4">Seat / Room</th>
                    <th className="py-3 px-4">Admission Status</th>
                    <th className="py-3 px-4">Exam Clearance</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#002366]">
                        {student.studentNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{student.fullName}</div>
                        <div className="text-[10px] text-slate-500">ID: {student.nationalIdOrPassport} • {student.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{student.examinationCentreName}</div>
                        <div className="text-[10px] font-mono text-slate-500">{student.examinationCentreCode} • {student.countyOrState}</div>
                        {student.centreTransferHistory && student.centreTransferHistory.length > 0 && (
                          <span className="inline-block mt-0.5 text-[9px] bg-amber-50 text-amber-800 font-bold px-1.5 py-0.2 rounded border border-amber-200">
                            {student.centreTransferHistory.length} Transfer(s)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{student.programName}</div>
                        <div className="text-[10px] text-slate-500">{student.academicLevel} • {student.modeOfStudy}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                          {student.currentExamSeatNumber || 'Unassigned'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          {student.admissionStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{student.examinationEligibility}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedStudentForAction(student);
                              setShowTransferModal(true);
                            }}
                            title="Transfer Centre"
                            className="bg-slate-100 hover:bg-[#002366] hover:text-white p-1.5 rounded-lg text-slate-700 transition-colors"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStudentForAction(student);
                              setShowVerifyDocModal(true);
                            }}
                            title="Verify Documents"
                            className="bg-slate-100 hover:bg-emerald-700 hover:text-white p-1.5 rounded-lg text-slate-700 transition-colors"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStudentForAction(student);
                              setShowHallTicketModal(true);
                            }}
                            title="Generate Hall Ticket / Exam Card"
                            className="bg-amber-100 hover:bg-[#C5A059] hover:text-[#002366] p-1.5 rounded-lg text-amber-900 transition-colors font-bold"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: INVIGILATION & ATTENDANCE */}
      {/* ========================================================= */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#002366]">Invigilator Attendance & Identity Verification Roster</h3>
                <p className="text-xs text-slate-500">Live digital attendance sheet, ID card check, and time-in/out sign-off per examination session.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#002366] font-bold"
                >
                  {examSessions.map(ses => (
                    <option key={ses.id} value={ses.id}>{ses.title} ({ses.sessionCode})</option>
                  ))}
                </select>

                <select
                  value={selectedAttendanceCentreId}
                  onChange={(e) => setSelectedAttendanceCentreId(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#002366] font-bold"
                >
                  <option value="">All Centres</option>
                  {examinationCentres.map(c => (
                    <option key={c.id} value={c.id}>{c.centreName} ({c.centreCode})</option>
                  ))}
                </select>

                <button
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Print Attendance Sheet</span>
                </button>
              </div>
            </div>

            {/* Attendance Records List */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#002366] text-white font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Seat</th>
                    <th className="py-3 px-4">Student Number</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Exam Course</th>
                    <th className="py-3 px-4">ID Verified</th>
                    <th className="py-3 px-4">Exam Card</th>
                    <th className="py-3 px-4">Attendance Status</th>
                    <th className="py-3 px-4">Time In / Out</th>
                    <th className="py-3 px-4">Invigilator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredAttendance.map(att => (
                    <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 bg-slate-50">
                        {att.seatNumber}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#002366]">
                        {att.studentNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{att.studentName}</div>
                        <div className="text-[10px] text-slate-500">ID: {att.nationalIdOrPassport}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{att.courseCode}</div>
                        <div className="text-[10px] text-slate-500">{att.courseTitle}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          <Check className="w-3 h-3" /> Verified
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                          <Check className="w-3 h-3" /> Presented
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={att.attendanceStatus}
                          onChange={(e) => updateAttendanceStatus(att.id, e.target.value as AttendanceStatus)}
                          className={`px-2 py-1 rounded text-[11px] font-bold border ${
                            att.attendanceStatus === 'Present' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                            att.attendanceStatus === 'Late' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                            'bg-red-50 text-red-800 border-red-300'
                          }`}
                        >
                          <option value="Present">Present</option>
                          <option value="Late">Late</option>
                          <option value="Absent">Absent</option>
                          <option value="Special Consideration">Special Consideration</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-600 font-mono">
                        {att.timeIn || '--:--'} {att.timeOut ? `→ ${att.timeOut}` : ''}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {att.invigilatorName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: AUDIT LOGS & PERMANENT TRANSFERS */}
      {/* ========================================================= */}
      {activeTab === 'audit-logs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[#002366]">Institutional Audit Trail & Centre Change Ledger</h3>
              <p className="text-xs text-slate-500">Immutable chronological record of student admissions, centre transfers, document verifications, and administrator authorizations.</p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#002366] text-white font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Target Entity</th>
                    <th className="py-3 px-4">Authorized By</th>
                    <th className="py-3 px-4">Previous / New Allocation</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-[#002366] font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-slate-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {log.affectedEntity}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{log.userName}</div>
                        <div className="text-[10px] text-slate-500">{log.userRole}</div>
                      </td>
                      <td className="py-3 px-4 text-[11px]">
                        {log.previousValue && log.newValue ? (
                          <div className="space-y-0.5">
                            <span className="text-red-700 line-through block">{log.previousValue}</span>
                            <span className="text-emerald-700 font-bold block">→ {log.newValue}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Initial Setup</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 8: REPORTS & EXPORT */}
      {/* ========================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#002366]">Automated Global Examination & Enrollment Reports</h3>
              <p className="text-xs text-slate-500">Generate, review, and export university-grade statistical and nominal roll reports.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Kenya 47 Counties Candidate Master Roll', desc: 'Complete roll of all enrolled candidates across all 47 counties sorted by region.', format: 'PDF / Excel' },
                { title: 'Global Examination Centres Capacity Report', desc: 'Utilization metrics, total seats, room readiness, Starlink/backup generator status.', format: 'PDF / CSV' },
                { title: 'Centre Transfer & Historical Audit Summary', desc: 'Complete historical movement audit log of all transferred candidates.', format: 'PDF' },
                { title: 'Session Attendance & Invigilation Summary', desc: 'Present, absent, late counts with invigilator verification signatures.', format: 'PDF / Excel' },
                { title: 'Programme Level Distribution Report', desc: 'Certificate, Diploma, Bachelor, Master, and Doctorate candidates by centre.', format: 'Excel' },
                { title: 'National Representatives Directory Report', desc: 'Global directors, contact coordinates, and managed student rolls.', format: 'PDF' },
              ].map((rep, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-[#C5A059] bg-[#002366] px-2 py-0.5 rounded">
                        {rep.format}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[#002366]">{rep.title}</h4>
                    <p className="text-xs text-slate-600">{rep.desc}</p>
                  </div>
                  <button
                    onClick={() => alert(`Generating and downloading ${rep.title}...`)}
                    className="w-full bg-white hover:bg-slate-100 text-[#002366] font-bold text-xs py-2 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Export Report</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: ADD EXAMINATION CENTRE */}
      {/* ========================================================= */}
      {showAddCentreModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-lg font-bold text-[#002366]">Register New Examination Centre</h3>
              </div>
              <button
                onClick={() => setShowAddCentreModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCentre} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Examination Centre Name *</label>
                  <input
                    type="text"
                    required
                    value={newCentreData.centreName}
                    onChange={(e) => setNewCentreData({ ...newCentreData, centreName: e.target.value })}
                    placeholder="e.g. Nairobi Central Examination Centre"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Centre Type</label>
                  <select
                    value={newCentreData.centreType}
                    onChange={(e) => setNewCentreData({ ...newCentreData, centreType: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Main Examination Centre">Main Examination Centre</option>
                    <option value="County Examination Centre">County Examination Centre</option>
                    <option value="Regional Examination Centre">Regional Examination Centre</option>
                    <option value="National Examination Centre">National Examination Centre</option>
                    <option value="International Examination Centre">International Examination Centre</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Country *</label>
                  <select
                    value={newCentreData.countryCode}
                    onChange={(e) => {
                      const found = globalCountries.find(g => g.countryCode === e.target.value);
                      setNewCentreData({
                        ...newCentreData,
                        countryCode: e.target.value,
                        countryName: found?.countryName || 'Kenya',
                        continent: found?.continent || 'AFRICA'
                      });
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {globalCountries.map(gc => (
                      <option key={gc.id} value={gc.countryCode}>{gc.countryName} ({gc.countryCode})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">County / State / Province *</label>
                  {newCentreData.countryCode === 'KE' ? (
                    <select
                      value={newCentreData.countyOrState}
                      onChange={(e) => {
                        const c = kenyaCounties.find(k => k.name === e.target.value);
                        setNewCentreData({
                          ...newCentreData,
                          countyOrState: e.target.value,
                          countyCode: c?.countyCode || 47
                        });
                      }}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    >
                      {kenyaCounties.map(kc => (
                        <option key={kc.id} value={kc.name}>{kc.codeString} - {kc.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={newCentreData.countyOrState}
                      onChange={(e) => setNewCentreData({ ...newCentreData, countyOrState: e.target.value })}
                      placeholder="e.g. Arizona, London, Kampala"
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">City / Town *</label>
                  <input
                    type="text"
                    required
                    value={newCentreData.cityOrTown}
                    onChange={(e) => setNewCentreData({ ...newCentreData, cityOrTown: e.target.value })}
                    placeholder="e.g. Nairobi"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Physical Address & Campus Location *</label>
                <input
                  type="text"
                  required
                  value={newCentreData.physicalAddress}
                  onChange={(e) => setNewCentreData({ ...newCentreData, physicalAddress: e.target.value })}
                  placeholder="e.g. Cathedral Way, CBD, Phoenix / Kenyatta Ave, Nairobi"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Representative Name *</label>
                  <input
                    type="text"
                    required
                    value={newCentreData.representativeName}
                    onChange={(e) => setNewCentreData({ ...newCentreData, representativeName: e.target.value })}
                    placeholder="e.g. Bishop Dr. Peter Mwangi"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phone *</label>
                  <input
                    type="text"
                    required
                    value={newCentreData.phone}
                    onChange={(e) => setNewCentreData({ ...newCentreData, phone: e.target.value })}
                    placeholder="+254 700 123456"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email *</label>
                  <input
                    type="email"
                    required
                    value={newCentreData.email}
                    onChange={(e) => setNewCentreData({ ...newCentreData, email: e.target.value })}
                    placeholder="rep@bibu-edu.org"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Max Seat Capacity *</label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={10000}
                    value={newCentreData.capacity}
                    onChange={(e) => setNewCentreData({ ...newCentreData, capacity: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Internet Connectivity</label>
                  <select
                    value={newCentreData.internetAvailability}
                    onChange={(e) => setNewCentreData({ ...newCentreData, internetAvailability: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="High-Speed Fiber / Dedicated WiFi">High-Speed Fiber / Dedicated WiFi</option>
                    <option value="Cellular 4G/5G">Cellular 4G/5G</option>
                    <option value="Satellite Starlink">Satellite Starlink</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Backup Generator</label>
                  <select
                    value={newCentreData.backupPowerGenerator ? 'yes' : 'no'}
                    onChange={(e) => setNewCentreData({ ...newCentreData, backupPowerGenerator: e.target.value === 'yes' })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="yes">Yes - Standby Generator</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCentreModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#002366] hover:bg-[#001A4D] text-white px-5 py-2 rounded-lg font-bold uppercase tracking-wider"
                >
                  Create & Activate Centre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ADD GLOBAL COUNTRY */}
      {/* ========================================================= */}
      {showAddCountryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-lg font-bold text-[#002366]">Add Worldwide National Country</h3>
              </div>
              <button
                onClick={() => setShowAddCountryModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCountry} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Country Code (ISO 2/3) *</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={newCountryData.countryCode}
                    onChange={(e) => setNewCountryData({ ...newCountryData, countryCode: e.target.value.toUpperCase() })}
                    placeholder="e.g. ZW, RW, DE"
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Country Name *</label>
                  <input
                    type="text"
                    required
                    value={newCountryData.countryName}
                    onChange={(e) => setNewCountryData({ ...newCountryData, countryName: e.target.value })}
                    placeholder="e.g. Zimbabwe"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Continent</label>
                  <select
                    value={newCountryData.continent}
                    onChange={(e) => setNewCountryData({ ...newCountryData, continent: e.target.value as ContinentCode })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="AFRICA">AFRICA</option>
                    <option value="NORTH_AMERICA">NORTH AMERICA</option>
                    <option value="SOUTH_AMERICA">SOUTH AMERICA</option>
                    <option value="EUROPE">EUROPE</option>
                    <option value="ASIA">ASIA</option>
                    <option value="OCEANIA">OCEANIA</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Dial Code & Currency</label>
                  <input
                    type="text"
                    value={newCountryData.dialCode}
                    onChange={(e) => setNewCountryData({ ...newCountryData, dialCode: e.target.value })}
                    placeholder="+263"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">National Representative Name *</label>
                <input
                  type="text"
                  required
                  value={newCountryData.nationalRepresentativeName}
                  onChange={(e) => setNewCountryData({ ...newCountryData, nationalRepresentativeName: e.target.value })}
                  placeholder="e.g. Bishop Dr. Tafadzwa Moyo"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Representative Phone *</label>
                  <input
                    type="text"
                    required
                    value={newCountryData.nationalRepresentativePhone}
                    onChange={(e) => setNewCountryData({ ...newCountryData, nationalRepresentativePhone: e.target.value })}
                    placeholder="+263 77 123 4567"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Representative Email *</label>
                  <input
                    type="email"
                    required
                    value={newCountryData.nationalRepresentativeEmail}
                    onChange={(e) => setNewCountryData({ ...newCountryData, nationalRepresentativeEmail: e.target.value })}
                    placeholder="rep@bibu-edu.org"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCountryModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#002366] hover:bg-[#001A4D] text-white px-5 py-2 rounded-lg font-bold uppercase tracking-wider"
                >
                  Save & Authorize Country
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: STUDENT CENTRE TRANSFER */}
      {/* ========================================================= */}
      {showTransferModal && selectedStudentForAction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-lg font-bold text-[#002366]">Transfer Examination Centre</h3>
              </div>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1 border border-slate-100">
              <div>Student: <strong className="text-slate-900">{selectedStudentForAction.fullName}</strong></div>
              <div>Student Number: <strong className="font-mono text-[#002366]">{selectedStudentForAction.studentNumber}</strong></div>
              <div>Current Centre: <strong className="text-red-700">{selectedStudentForAction.examinationCentreName} ({selectedStudentForAction.examinationCentreCode})</strong></div>
            </div>

            {transferFeedback && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                transferFeedback.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {transferFeedback.message}
              </div>
            )}

            <form onSubmit={handleExecuteTransfer} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Select New Examination Centre *</label>
                <select
                  required
                  value={transferTargetCentreId}
                  onChange={(e) => setTransferTargetCentreId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                >
                  <option value="">-- Select Target Centre --</option>
                  {examinationCentres
                    .filter(c => c.id !== selectedStudentForAction.examinationCentreId)
                    .map(c => (
                      <option key={c.id} value={c.id}>
                        {c.centreName} ({c.centreCode}) - {c.countyOrState}, {c.countryName} [{c.availableSeats} seats left]
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Reason for Relocation / Transfer *</label>
                <textarea
                  required
                  rows={3}
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  placeholder="e.g. Student relocated from Nairobi to Mombasa for ministry assignment; requested transfer to Mombasa County Centre."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                ⚠️ <strong>Audit Guarantee:</strong> The previous centre assignment will be permanently preserved in the student's historical audit record.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#002366] hover:bg-[#001A4D] text-white px-5 py-2 rounded-lg font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#C5A059]" />
                  <span>Authorize & Transfer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: ADMIT & ENROLL STUDENT WITH CENTRE */}
      {/* ========================================================= */}
      {showRegisterStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-lg font-bold text-[#002366]">Direct Student Admission & Centre Allocation</h3>
              </div>
              <button
                onClick={() => setShowRegisterStudentModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {duplicateAlert && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Potential Duplicate Detected:</strong> A student matching this ID, Phone, or Email already exists:
                  <div className="font-bold mt-0.5">{duplicateAlert.fullName} ({duplicateAlert.studentNumber}) — Centre: {duplicateAlert.examinationCentreName}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleQuickStudentSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">First Name *</label>
                  <input
                    type="text"
                    required
                    value={quickStudentForm.firstName}
                    onChange={(e) => setQuickStudentForm({ ...quickStudentForm, firstName: e.target.value })}
                    placeholder="e.g. Samuel"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={quickStudentForm.lastName}
                    onChange={(e) => setQuickStudentForm({ ...quickStudentForm, lastName: e.target.value })}
                    placeholder="e.g. Kimani"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">National ID / Passport # *</label>
                  <input
                    type="text"
                    required
                    value={quickStudentForm.nationalIdOrPassport}
                    onChange={(e) => setQuickStudentForm({ ...quickStudentForm, nationalIdOrPassport: e.target.value })}
                    placeholder="e.g. 29384712"
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={quickStudentForm.email}
                    onChange={(e) => setQuickStudentForm({ ...quickStudentForm, email: e.target.value })}
                    placeholder="student@bibu-edu.org"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={quickStudentForm.phone}
                    onChange={(e) => setQuickStudentForm({ ...quickStudentForm, phone: e.target.value })}
                    placeholder="+254 712 345678"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Mandatory Examination Centre *</label>
                  <select
                    required
                    value={quickStudentForm.examinationCentreId}
                    onChange={(e) => setQuickStudentForm({ ...quickStudentForm, examinationCentreId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                  >
                    {examinationCentres.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.centreName} ({c.centreCode}) - {c.countyOrState} [{c.availableSeats} seats available]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Degree Program *</label>
                  <select
                    value={quickStudentForm.programId}
                    onChange={(e) => setQuickStudentForm({ ...quickStudentForm, programId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Academic Level</label>
                  <select
                    value={quickStudentForm.academicLevel}
                    onChange={(e) => setQuickStudentForm({ ...quickStudentForm, academicLevel: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Certificate">Certificate</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="Doctorate">Doctorate</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Study Mode</label>
                  <select
                    value={quickStudentForm.modeOfStudy}
                    onChange={(e) => setQuickStudentForm({ ...quickStudentForm, modeOfStudy: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Digital Online & Centre-Based">Digital Online & Centre-Based</option>
                    <option value="Intensive Hybrid">Intensive Hybrid</option>
                    <option value="Centre Weekend Cohort">Centre Weekend Cohort</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Intake</label>
                  <select
                    value={quickStudentForm.intake}
                    onChange={(e) => setQuickStudentForm({ ...quickStudentForm, intake: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="September 2026">September 2026</option>
                    <option value="January 2027">January 2027</option>
                    <option value="May 2026">May 2026</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterStudentModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#002366] hover:bg-[#001A4D] text-white px-5 py-2 rounded-lg font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#C5A059]" />
                  <span>Generate Student Number & Admit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: PRINTABLE EXAMINATION HALL TICKET / STUDENT CARD */}
      {/* ========================================================= */}
      {showHallTicketModal && selectedStudentForAction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-lg font-bold text-[#002366]">Official Examination Hall Ticket</h3>
              </div>
              <button
                onClick={() => setShowHallTicketModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Card */}
            <div className="border-2 border-[#002366] rounded-xl p-5 space-y-4 bg-slate-50/50">
              <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
                <div className="flex items-center gap-2.5">
                  <UniversityLogo size="sm" withRing />
                  <div>
                    <div className="font-display font-bold text-xs text-[#002366]">BREAKTHROUGH INT. BIBLE UNIVERSITY</div>
                    <div className="text-[9px] text-[#C5A059] font-black uppercase">Official Candidate Examination Pass</div>
                  </div>
                </div>
                <span className="font-mono text-[10px] font-bold bg-[#002366] text-white px-2 py-0.5 rounded">
                  PASS-2026-OCT
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="col-span-2 space-y-1">
                  <div><span className="text-[10px] text-slate-400 uppercase font-bold">Candidate Name:</span> <strong className="text-slate-900 block">{selectedStudentForAction.fullName}</strong></div>
                  <div><span className="text-[10px] text-slate-400 uppercase font-bold">Permanent Student #:</span> <strong className="font-mono text-[#002366] block">{selectedStudentForAction.studentNumber}</strong></div>
                  <div><span className="text-[10px] text-slate-400 uppercase font-bold">National ID / Passport:</span> <strong className="font-mono text-slate-800 block">{selectedStudentForAction.nationalIdOrPassport}</strong></div>
                  <div><span className="text-[10px] text-slate-400 uppercase font-bold">Degree Programme:</span> <strong className="text-slate-800 block">{selectedStudentForAction.programName} ({selectedStudentForAction.academicLevel})</strong></div>
                </div>

                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white border border-slate-200 text-center">
                  <div className="w-16 h-16 rounded bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px] border border-slate-200">
                    PHOTO ID
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">VERIFIED</span>
                </div>
              </div>

              <div className="bg-[#002366] text-white rounded-lg p-3 text-xs space-y-1">
                <div className="text-[9px] uppercase tracking-widest text-[#C5A059] font-black">Designated Examination Centre</div>
                <div className="font-bold text-sm">{selectedStudentForAction.examinationCentreName}</div>
                <div className="text-[10px] text-slate-300 font-mono">Code: {selectedStudentForAction.examinationCentreCode} • {selectedStudentForAction.countyOrState}, {selectedStudentForAction.country}</div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/20 mt-1">
                  <span>Room: <strong>{selectedStudentForAction.currentExamRoom || 'Hall 1'}</strong></span>
                  <span>Seat Number: <strong className="text-[#C5A059]">{selectedStudentForAction.currentExamSeatNumber || 'A-01'}</strong></span>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 text-center">
                This hall ticket must be presented alongside your National ID or Passport to the centre invigilator.
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowHallTicketModal(false)}
                className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg text-xs"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="bg-[#002366] hover:bg-[#001A4D] text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-[#C5A059]" />
                <span>Print Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 6: VERIFY STUDENT DOCUMENTS */}
      {/* ========================================================= */}
      {showVerifyDocModal && selectedStudentForAction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-[#002366]">Verify Student Uploaded Documents</h3>
              </div>
              <button
                onClick={() => setShowVerifyDocModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-0.5 border border-slate-100">
              <div>Candidate: <strong className="text-slate-900">{selectedStudentForAction.fullName}</strong></div>
              <div>Student Number: <strong className="font-mono text-[#002366]">{selectedStudentForAction.studentNumber}</strong></div>
            </div>

            <div className="space-y-2">
              {selectedStudentForAction.documents && selectedStudentForAction.documents.length > 0 ? (
                selectedStudentForAction.documents.map(doc => (
                  <div key={doc.id} className="p-3 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#002366]">{doc.documentType}</div>
                        <div className="text-[10px] text-slate-500">{doc.fileName} • {doc.fileSize}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        doc.verificationStatus === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {doc.verificationStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          verifyStudentDocument(selectedStudentForAction.id, doc.id, 'Verified', currentUser.name);
                          alert(`Document "${doc.documentType}" marked as Verified.`);
                        }}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded text-[11px] flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Approve
                      </button>
                      <button
                        onClick={() => {
                          const rem = prompt('Enter rejection reason:');
                          if (rem) {
                            verifyStudentDocument(selectedStudentForAction.id, doc.id, 'Rejected', currentUser.name, rem);
                            alert(`Document marked as Rejected.`);
                          }
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-800 font-bold px-3 py-1 rounded text-[11px] flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">No documents uploaded.</div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowVerifyDocModal(false)}
                className="bg-[#002366] text-white px-4 py-2 rounded-lg font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
