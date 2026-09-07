import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCeremony,
  GraduationCeremonyStatus,
  GraduationCandidate
} from '../../types/graduation';
import {
  GraduationCap,
  Calendar,
  Award,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Edit,
  Trash2,
  MapPin,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  DollarSign,
  Radio,
  BookOpen,
  Eye,
  Filter,
  Layers,
  Sparkles,
  X,
  ChevronRight,
  Info,
  BookMarked,
  Check,
  Tag,
  Database
} from 'lucide-react';
import { UniversityLogo } from '../common/UniversityLogo';
import { GraduationBookletGenerator } from '../graduation/GraduationBookletGenerator';
import { AdministrativeBookletEditor } from './AdministrativeBookletEditor';
import { Rpl2024MigrationUtility } from './Rpl2024MigrationUtility';

export interface ThemePreset {
  theme: string;
  scripture: string;
  category: string;
}

export const GRADUATION_THEME_PRESETS: ThemePreset[] = [
  {
    theme: 'Commissioned as Ambassadors of Reconciliation and Global Transformation',
    scripture: '2 Corinthians 5:20',
    category: 'Apostolic & Commissioning'
  },
  {
    theme: 'Equipped for Ministry, Leadership and Global Kingdom Impact',
    scripture: '2 Timothy 3:16-17',
    category: 'Ministerial Readiness'
  },
  {
    theme: 'Arise, Shine, for Your Light Has Come and the Glory of the Lord Has Risen Upon You',
    scripture: 'Isaiah 60:1',
    category: 'Spiritual Awakening'
  },
  {
    theme: 'Preach the Word; Be Prepared in Season and Out of Season with Great Patience',
    scripture: '2 Timothy 4:2',
    category: 'Biblical Preaching'
  },
  {
    theme: 'Go into All the World and Proclaim the Gospel to Every Creature',
    scripture: 'Mark 16:15',
    category: 'Global Great Commission'
  },
  {
    theme: 'Faithful Stewards of the Mysteries of God and Servants of Christ',
    scripture: '1 Corinthians 4:1-2',
    category: 'Kingdom Stewardship'
  },
  {
    theme: 'Rooted in Truth, Flourishing in Grace, Leading with Holy Integrity',
    scripture: 'Colossians 2:6-7',
    category: 'Christian Character'
  },
  {
    theme: 'Transforming Communities Through the Power of the Holy Spirit',
    scripture: 'Acts 1:8',
    category: 'Evangelism & Mission'
  }
];

export const CEREMONY_STATUS_DEFINITIONS: {
  status: GraduationCeremonyStatus;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  description: string;
}[] = [
  {
    status: 'Planning',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-300',
    description: 'Internal Senate preparation and scheduling. Registration portal is closed.'
  },
  {
    status: 'Registration Open',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-300',
    description: 'Candidates actively verify clearances, pay convocation dues, and review booklet.'
  },
  {
    status: 'Confirmed',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-800',
    badgeBorder: 'border-blue-300',
    description: 'Convocation roll locked by Senate. Order of proceedings finalized.'
  },
  {
    status: 'Completed',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-800',
    badgeBorder: 'border-purple-300',
    description: 'Ceremony successfully held. Degrees conferred and certificates issued.'
  },
  {
    status: 'Archived',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-300',
    description: 'Historical records preserved in university permanent registrar archives.'
  }
];

interface CeremonyFormData {
  graduationNumber: string;
  academicYear: string;
  graduationYear: number;
  graduationDate: string;
  graduationTime: string;
  venue: string;
  city: string;
  country: string;
  theme: string;
  chiefGuest: string;
  chancellor: string;
  viceChancellor: string;
  registrar: string;
  graduationCoordinator: string;
  status: GraduationCeremonyStatus;
  bannerUrl: string;
  description: string;
  livestreamUrl: string;
}

export const GraduationManagement: React.FC = () => {
  const {
    currentUser,
    universityInfo,
    graduationCeremonies,
    addGraduationCeremony,
    updateGraduationCeremony,
    deleteGraduationCeremony,
    graduationCandidates,
    graduationCertificates,
    graduationBooklets,
    academicAwards
  } = useApp();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'ceremonies' | 'candidates' | 'certificates' | 'booklet' | 'rpl-migration'>('ceremonies');
  const [selectedBookletCeremonyId, setSelectedBookletCeremonyId] = useState<string | undefined>(undefined);
  const [bookletMode, setBookletMode] = useState<'editor' | 'reader'>('editor');

  // Search and Filter states for Ceremonies
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showStatusProtocolGuide, setShowStatusProtocolGuide] = useState(false);

  // Search and Filter states for Candidates Tab
  const [candidateSearchQuery, setCandidateSearchQuery] = useState('');
  const [candidateCeremonyFilter, setCandidateCeremonyFilter] = useState<string>('All');
  const [candidateClearanceFilter, setCandidateClearanceFilter] = useState<string>('All');

  // Search and Filter states for Certificates Tab
  const [certSearchQuery, setCertSearchQuery] = useState('');
  const [certCeremonyFilter, setCertCeremonyFilter] = useState<string>('All');
  const [certAwardFilter, setCertAwardFilter] = useState<string>('All');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCeremonyId, setEditingCeremonyId] = useState<string | null>(null);
  const [viewingCeremony, setViewingCeremony] = useState<GraduationCeremony | null>(null);

  // Notice alert
  const [notice, setNotice] = useState<string | null>(null);

  const displayNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  // Initial Form State
  const defaultFormState: CeremonyFormData = {
    graduationNumber: '16th Annual Congregation',
    academicYear: '2026/2027',
    graduationYear: 2027,
    graduationDate: '2027-10-23',
    graduationTime: '09:30 AM (MST)',
    venue: 'Grand Convocation Pavilion & Cathedral of Faith',
    city: 'Phoenix',
    country: 'United States',
    theme: 'Commissioned as Ambassadors of Reconciliation and Global Transformation (2 Corinthians 5:20)',
    chiefGuest: 'Rev. Dr. David O. Oyedepo - Chancellor & Presiding Bishop',
    chancellor: universityInfo.chancellor || 'Dr. Michael C. Sterling, Th.D., D.Min.',
    viceChancellor: universityInfo.viceChancellor || 'Prof. Dr. Patrick Njuguna, Ph.D., Th.D.',
    registrar: universityInfo.registrar || 'Rev. Dr. Sarah M. Jenkins, Th.D.',
    graduationCoordinator: 'Prof. Joseph K. Mutua, Ph.D.',
    status: 'Registration Open',
    bannerUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
    description: 'The Annual Global Convocation and Conferment of Academic Degrees, Diplomas, and Post-Graduate Doctoral Awards of Breakthrough International Bible University.',
    livestreamUrl: 'https://youtube.com/live/bibu-global-graduation'
  };

  const [formData, setFormData] = useState<CeremonyFormData>(defaultFormState);

  // Overall Statistics
  const stats = useMemo(() => {
    const totalCandidates = graduationCandidates.length;
    const certificatesIssued = graduationCertificates.length;
    const totalCeremonies = graduationCeremonies.length;
    const clearedGraduands = graduationCandidates.filter((c) => c.clearanceProgress === 100).length;
    const conferredGraduates = graduationCandidates.filter((c) => c.status === 'Conferred Graduate').length;
    const feesCollected = graduationCandidates.reduce((acc, c) => acc + (c.graduationFeePaid || 0), 0);

    return {
      totalCandidates,
      certificatesIssued,
      totalCeremonies,
      clearedGraduands,
      conferredGraduates,
      feesCollected
    };
  }, [graduationCandidates, graduationCertificates, graduationCeremonies]);

  // Unique years for filter
  const ceremonyYears = useMemo(() => {
    const years = Array.from(new Set(graduationCeremonies.map((c) => Number(c.graduationYear)))).sort((a, b) => Number(b) - Number(a));
    return years;
  }, [graduationCeremonies]);

  // Status counts for filter chips
  const statusCounts = useMemo(() => {
    return {
      all: graduationCeremonies.length,
      planning: graduationCeremonies.filter((c) => c.status === 'Planning').length,
      registrationOpen: graduationCeremonies.filter((c) => c.status === 'Registration Open').length,
      confirmed: graduationCeremonies.filter((c) => c.status === 'Confirmed').length,
      completed: graduationCeremonies.filter((c) => c.status === 'Completed').length,
      archived: graduationCeremonies.filter((c) => c.status === 'Archived').length
    };
  }, [graduationCeremonies]);

  // Filtered Ceremonies
  const filteredCeremonies = useMemo(() => {
    return graduationCeremonies.filter((ceremony) => {
      const matchesSearch =
        searchQuery === '' ||
        ceremony.graduationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ceremony.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ceremony.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ceremony.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ceremony.chiefGuest.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || ceremony.status === statusFilter;
      const matchesYear = yearFilter === 'All' || ceremony.graduationYear.toString() === yearFilter;

      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [graduationCeremonies, searchQuery, statusFilter, yearFilter]);

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    return graduationCandidates.filter((cand) => {
      const matchesSearch =
        candidateSearchQuery === '' ||
        cand.fullName.toLowerCase().includes(candidateSearchQuery.toLowerCase()) ||
        cand.studentId.toLowerCase().includes(candidateSearchQuery.toLowerCase()) ||
        cand.programName.toLowerCase().includes(candidateSearchQuery.toLowerCase()) ||
        cand.schoolName.toLowerCase().includes(candidateSearchQuery.toLowerCase()) ||
        (cand.institution && cand.institution.toLowerCase().includes(candidateSearchQuery.toLowerCase())) ||
        (cand.academicAchievement && cand.academicAchievement.toLowerCase().includes(candidateSearchQuery.toLowerCase()));

      const matchesCeremony =
        candidateCeremonyFilter === 'All' ||
        cand.ceremonyId === candidateCeremonyFilter;

      const matchesClearance =
        candidateClearanceFilter === 'All' ||
        (candidateClearanceFilter === '100' && cand.clearanceProgress === 100) ||
        (candidateClearanceFilter === 'pending' && cand.clearanceProgress < 100) ||
        (candidateClearanceFilter === 'conferred' && cand.status === 'Conferred Graduate');

      return matchesSearch && matchesCeremony && matchesClearance;
    });
  }, [graduationCandidates, candidateSearchQuery, candidateCeremonyFilter, candidateClearanceFilter]);

  // Filtered Certificates
  const filteredCertificates = useMemo(() => {
    return graduationCertificates.filter((cert) => {
      const matchesSearch =
        certSearchQuery === '' ||
        cert.studentName.toLowerCase().includes(certSearchQuery.toLowerCase()) ||
        cert.certificateNumber.toLowerCase().includes(certSearchQuery.toLowerCase()) ||
        cert.degreeTitle.toLowerCase().includes(certSearchQuery.toLowerCase()) ||
        cert.verificationCode.toLowerCase().includes(certSearchQuery.toLowerCase());

      const matchesCeremony =
        certCeremonyFilter === 'All' ||
        cert.ceremonyId === certCeremonyFilter;

      const matchesAward =
        certAwardFilter === 'All' ||
        cert.awardLevel.toLowerCase() === certAwardFilter.toLowerCase();

      return matchesSearch && matchesCeremony && matchesAward;
    });
  }, [graduationCertificates, certSearchQuery, certCeremonyFilter, certAwardFilter]);

  // Navigation helpers to inspect specific ceremony data
  const handleViewCeremonyCandidates = (ceremonyId: string) => {
    setCandidateCeremonyFilter(ceremonyId);
    setActiveTab('candidates');
  };

  const handleViewCeremonyCertificates = (ceremonyId: string) => {
    setCertCeremonyFilter(ceremonyId);
    setActiveTab('certificates');
  };

  // Quick Status change directly from card or table
  const handleQuickStatusChange = (id: string, newStatus: GraduationCeremonyStatus, ceremonyName?: string) => {
    updateGraduationCeremony(id, { status: newStatus });
    displayNotice(`Ceremony "${ceremonyName || 'Convocation'}" status transitioned to "${newStatus}".`);
  };

  // Open modal for defining a new ceremony
  const handleOpenCreateModal = () => {
    setEditingCeremonyId(null);
    setFormData({
      ...defaultFormState,
      chancellor: universityInfo.chancellor || defaultFormState.chancellor,
      viceChancellor: universityInfo.viceChancellor || defaultFormState.viceChancellor,
      registrar: universityInfo.registrar || defaultFormState.registrar,
      graduationYear: new Date().getFullYear() + 1
    });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing ceremony
  const handleOpenEditModal = (ceremony: GraduationCeremony) => {
    setEditingCeremonyId(ceremony.id);
    setFormData({
      graduationNumber: ceremony.graduationNumber,
      academicYear: ceremony.academicYear,
      graduationYear: ceremony.graduationYear,
      graduationDate: ceremony.graduationDate,
      graduationTime: ceremony.graduationTime,
      venue: ceremony.venue,
      city: ceremony.city,
      country: ceremony.country,
      theme: ceremony.theme,
      chiefGuest: ceremony.chiefGuest,
      chancellor: ceremony.chancellor,
      viceChancellor: ceremony.viceChancellor,
      registrar: ceremony.registrar,
      graduationCoordinator: ceremony.graduationCoordinator,
      status: ceremony.status,
      bannerUrl: ceremony.bannerUrl || defaultFormState.bannerUrl,
      description: ceremony.description,
      livestreamUrl: ceremony.livestreamUrl || ''
    });
    setIsModalOpen(true);
  };

  // Handle saving ceremony
  const handleSaveCeremony = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.graduationNumber || !formData.theme || !formData.venue) {
      alert('Please complete all required fields (Ceremony Name, Theme, and Venue).');
      return;
    }

    if (editingCeremonyId) {
      // Update
      updateGraduationCeremony(editingCeremonyId, {
        graduationNumber: formData.graduationNumber,
        academicYear: formData.academicYear,
        graduationYear: Number(formData.graduationYear),
        graduationDate: formData.graduationDate,
        graduationTime: formData.graduationTime,
        venue: formData.venue,
        city: formData.city,
        country: formData.country,
        theme: formData.theme,
        chiefGuest: formData.chiefGuest,
        chancellor: formData.chancellor,
        viceChancellor: formData.viceChancellor,
        registrar: formData.registrar,
        graduationCoordinator: formData.graduationCoordinator,
        status: formData.status,
        bannerUrl: formData.bannerUrl,
        description: formData.description,
        livestreamUrl: formData.livestreamUrl
      });
      displayNotice(`Ceremony "${formData.graduationNumber}" updated successfully.`);
    } else {
      // Create new
      addGraduationCeremony({
        graduationNumber: formData.graduationNumber,
        academicYear: formData.academicYear,
        graduationYear: Number(formData.graduationYear),
        graduationDate: formData.graduationDate,
        graduationTime: formData.graduationTime,
        venue: formData.venue,
        city: formData.city,
        country: formData.country,
        theme: formData.theme,
        chiefGuest: formData.chiefGuest,
        chancellor: formData.chancellor,
        viceChancellor: formData.viceChancellor,
        registrar: formData.registrar,
        graduationCoordinator: formData.graduationCoordinator,
        status: formData.status,
        bannerUrl: formData.bannerUrl,
        description: formData.description,
        programmeSchedule: [
          { id: 'prog-1', order: 1, time: '08:30 AM', activity: 'Arrival & Seating of Graduands and Guests', facilitator: 'Chief Protocol Marshals' },
          { id: 'prog-2', order: 2, time: '09:15 AM', activity: 'Faculty & Senate Procession', facilitator: 'Lead Academic Marshal' },
          { id: 'prog-3', order: 3, time: '09:30 AM', activity: 'Chancellor’s Procession with University Mace', facilitator: 'Vice Chancellor & Board' },
          { id: 'prog-4', order: 4, time: '10:00 AM', activity: 'Keynote Address to Graduating Class', facilitator: formData.chiefGuest },
          { id: 'prog-5', order: 5, time: '11:00 AM', activity: 'Conferment of Degrees and Diplomas', facilitator: formData.chancellor },
          { id: 'prog-6', order: 6, time: '12:30 PM', activity: 'Alumni Induction & Ministerial Commissioning', facilitator: 'Alumni President & Senate' }
        ],
        photos: [
          'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800'
        ],
        videos: [],
        livestreamUrl: formData.livestreamUrl
      });
      displayNotice(`New ceremony "${formData.graduationNumber}" defined and registered.`);
    }

    setIsModalOpen(false);
  };

  // Delete ceremony
  const handleDeleteCeremony = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      deleteGraduationCeremony(id);
      displayNotice(`Ceremony "${name}" deleted.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#001A4D] via-[#002366] to-[#001438] rounded-2xl p-6 sm:p-8 text-white border-b-4 border-[#C5A059] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059] text-[#C5A059] text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Academic Affairs • Convocation Directorate</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Authorized Administrator: {currentUser?.name || 'Administrator'} ({currentUser?.role?.toUpperCase() || 'ADMIN'})
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Graduation Ceremony Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Define convocations, configure theological themes & scriptures, oversee ceremony operational lifecycles, and monitor graduation candidates and issued certificates in real-time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10">
          <button
            onClick={() => setShowStatusProtocolGuide(!showStatusProtocolGuide)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Info className="w-4 h-4 text-amber-300" />
            <span>{showStatusProtocolGuide ? 'Hide Protocol Guide' : 'Ceremony Status Guide'}</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-[#C5A059] hover:from-amber-500 hover:to-[#B38F48] text-[#002366] text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Define New Ceremony</span>
          </button>
        </div>
      </div>

      {/* Ceremony Status Protocol Guide (Collapsible) */}
      {showStatusProtocolGuide && (
        <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-sm space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-[#002366]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-[#002366]">
                Convocation Governance & Ceremony Lifecycle Protocol
              </h4>
            </div>
            <button
              onClick={() => setShowStatusProtocolGuide(false)}
              className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer font-bold"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
            {CEREMONY_STATUS_DEFINITIONS.map((def) => (
              <div key={def.status} className={`p-3 rounded-xl border ${def.badgeBg} ${def.badgeBorder} space-y-1`}>
                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${def.badgeText}`}>
                  {def.status}
                </span>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {def.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Notice Toast */}
      {notice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Overall Key Statistics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Candidates (Requested KPI) */}
        <button
          onClick={() => setActiveTab('candidates')}
          className="bg-white rounded-xl border-2 border-blue-200 hover:border-[#002366] p-4 shadow-xs space-y-1 text-left transition-all hover:shadow-md cursor-pointer group"
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#002366]" />
              Total Candidates
            </span>
            <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#002366] transition-transform group-hover:translate-x-0.5" />
          </div>
          <div className="text-2xl font-black font-display text-[#002366]">{stats.totalCandidates}</div>
          <div className="text-[10px] text-blue-700 font-semibold">{stats.clearedGraduands} Senate Cleared • View Roster →</div>
        </button>

        {/* Certificates Issued (Requested KPI) */}
        <button
          onClick={() => setActiveTab('certificates')}
          className="bg-white rounded-xl border-2 border-amber-200 hover:border-[#C5A059] p-4 shadow-xs space-y-1 text-left transition-all hover:shadow-md cursor-pointer group"
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#C5A059]" />
              Issued Certificates
            </span>
            <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#C5A059] transition-transform group-hover:translate-x-0.5" />
          </div>
          <div className="text-2xl font-black font-display text-[#C5A059]">{stats.certificatesIssued}</div>
          <div className="text-[10px] text-amber-700 font-semibold">Verified Credentials • View Registry →</div>
        </button>

        {/* Defined Ceremonies */}
        <button
          onClick={() => setActiveTab('ceremonies')}
          className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 p-4 shadow-xs space-y-1 text-left transition-all cursor-pointer"
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>Ceremonies</span>
          </div>
          <div className="text-2xl font-black font-display text-blue-900">{stats.totalCeremonies}</div>
          <div className="text-[10px] text-slate-500">{statusCounts.confirmed} Confirmed • {statusCounts.registrationOpen} Open</div>
        </button>

        {/* Cleared Graduands */}
        <button
          onClick={() => {
            setCandidateClearanceFilter('100');
            setActiveTab('candidates');
          }}
          className="bg-white rounded-xl border border-slate-200 hover:border-emerald-400 p-4 shadow-xs space-y-1 text-left transition-all cursor-pointer"
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Cleared</span>
          </div>
          <div className="text-2xl font-black font-display text-emerald-600">{stats.clearedGraduands}</div>
          <div className="text-[10px] text-emerald-700 font-medium">Senate Approved Graduands</div>
        </button>

        {/* Conferred Graduates */}
        <button
          onClick={() => {
            setCandidateClearanceFilter('conferred');
            setActiveTab('candidates');
          }}
          className="bg-white rounded-xl border border-slate-200 hover:border-indigo-400 p-4 shadow-xs space-y-1 text-left transition-all cursor-pointer"
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Conferred</span>
          </div>
          <div className="text-2xl font-black font-display text-indigo-900">{stats.conferredGraduates}</div>
          <div className="text-[10px] text-indigo-700 font-medium">Alumni Inductees</div>
        </button>

        {/* Fees Collected */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            <span>Fees Collected</span>
          </div>
          <div className="text-2xl font-black font-display text-amber-700">${stats.feesCollected.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">Convocation Dues</div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('ceremonies')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'ceremonies'
              ? 'border-[#002366] text-[#002366] bg-blue-50/70 font-black'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#002366]" />
          <span>Ceremonies Directory ({graduationCeremonies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('candidates')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'candidates'
              ? 'border-[#002366] text-[#002366] bg-blue-50/70 font-black'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-[#002366]" />
          <span>Candidates Roster ({graduationCandidates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'certificates'
              ? 'border-[#002366] text-[#002366] bg-blue-50/70 font-black'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-[#C5A059]" />
          <span>Certificates Issued ({graduationCertificates.length})</span>
        </button>

        <button
          onClick={() => {
            setSelectedBookletCeremonyId(undefined);
            setActiveTab('booklet');
          }}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'booklet'
              ? 'border-[#002366] text-[#002366] bg-amber-50/80 font-black'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#C5A059]" />
          <span>Booklet Generator & PDF</span>
        </button>

        <button
          onClick={() => setActiveTab('rpl-migration')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'rpl-migration'
              ? 'border-[#002366] text-[#002366] bg-amber-50/80 font-black'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4 text-[#C5A059]" />
          <span>RPL 2024 Data Utility & Institutions (118)</span>
        </button>
      </div>

      {/* TAB 1: CEREMONIES DIRECTORY */}
      {activeTab === 'ceremonies' && (
        <div className="space-y-6">
          {/* Status Quick Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#002366]" />
              Status:
            </span>
            {[
              { id: 'All', label: 'All Statuses', count: statusCounts.all },
              { id: 'Planning', label: 'Planning', count: statusCounts.planning },
              { id: 'Registration Open', label: 'Registration Open', count: statusCounts.registrationOpen },
              { id: 'Confirmed', label: 'Confirmed', count: statusCounts.confirmed },
              { id: 'Completed', label: 'Completed', count: statusCounts.completed },
              { id: 'Archived', label: 'Archived', count: statusCounts.archived }
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setStatusFilter(pill.id)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  statusFilter === pill.id
                    ? 'bg-[#002366] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{pill.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    statusFilter === pill.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {pill.count}
                </span>
              </button>
            ))}
          </div>

          {/* Filter and Action Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center flex-wrap gap-2 flex-1">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by theme, ceremony name, venue, or guest..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#002366]"
                />
              </div>

              {/* Status Filter Dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-700 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Planning">Planning</option>
                <option value="Registration Open">Registration Open</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>

              {/* Year Filter */}
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-700 cursor-pointer"
              >
                <option value="All">All Years</option>
                {ceremonyYears.map((yr) => (
                  <option key={yr} value={yr.toString()}>
                    Year {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle & Add Button */}
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-2.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white shadow-xs text-[#002366]' : 'text-slate-500'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-2.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    viewMode === 'table' ? 'bg-white shadow-xs text-[#002366]' : 'text-slate-500'
                  }`}
                >
                  Table
                </button>
              </div>

              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 rounded-lg bg-[#002366] text-white hover:bg-[#001A4D] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Define Ceremony</span>
              </button>
            </div>
          </div>

          {/* GRID VIEW OF CEREMONIES */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCeremonies.map((ceremony) => {
                const candidateCount = graduationCandidates.filter((c) => c.ceremonyId === ceremony.id).length;
                const certificateCount = graduationCertificates.filter((c) => c.ceremonyId === ceremony.id).length;

                return (
                  <div
                    key={ceremony.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    {/* Header Image with Badges */}
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      <img
                        src={ceremony.bannerUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200'}
                        alt={ceremony.graduationNumber}
                        className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            ceremony.status === 'Confirmed'
                              ? 'bg-emerald-500 text-white'
                              : ceremony.status === 'Registration Open'
                              ? 'bg-[#C5A059] text-[#002366]'
                              : ceremony.status === 'Completed'
                              ? 'bg-blue-600 text-white'
                              : ceremony.status === 'Planning'
                              ? 'bg-amber-500 text-slate-900'
                              : 'bg-slate-700 text-white'
                          }`}
                        >
                          {ceremony.status}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/60 text-amber-300 backdrop-blur-xs">
                          {ceremony.graduationYear}
                        </span>
                      </div>

                      {/* Title & Location in Banner */}
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <div className="text-[10px] text-amber-300 font-mono uppercase font-bold tracking-wider">
                          Academic Year: {ceremony.academicYear}
                        </div>
                        <h3 className="text-lg font-bold font-display text-white line-clamp-1">
                          {ceremony.graduationNumber}
                        </h3>
                        <div className="text-xs text-slate-200 flex items-center gap-1.5 mt-0.5 line-clamp-1">
                          <MapPin className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                          <span>{ceremony.venue}, {ceremony.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 space-y-4 flex-1">
                      {/* Theme Box */}
                      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                        <div className="text-[10px] font-bold uppercase text-[#002366] flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#C5A059]" />
                          <span>Convocation Theme</span>
                        </div>
                        <p className="font-medium text-slate-800 italic mt-1 line-clamp-2">
                          "{ceremony.theme}"
                        </p>
                      </div>

                      {/* Dignitaries & Key Facts */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Chief Guest</span>
                          <span className="font-semibold text-slate-800 line-clamp-1">{ceremony.chiefGuest}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Date & Time</span>
                          <span className="font-semibold text-slate-800">{ceremony.graduationDate}</span>
                        </div>
                        <button
                          onClick={() => handleViewCeremonyCandidates(ceremony.id)}
                          className="text-left group cursor-pointer p-1 rounded-md hover:bg-blue-50 transition-colors"
                          title="Click to view candidate roster for this ceremony"
                        >
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Candidates Enrolled</span>
                          <span className="font-bold text-[#002366] group-hover:underline flex items-center gap-1">
                            {candidateCount} graduands →
                          </span>
                        </button>
                        <button
                          onClick={() => handleViewCeremonyCertificates(ceremony.id)}
                          className="text-left group cursor-pointer p-1 rounded-md hover:bg-amber-50 transition-colors"
                          title="Click to view issued certificates for this ceremony"
                        >
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Certificates</span>
                          <span className="font-bold text-[#C5A059] group-hover:underline flex items-center gap-1">
                            {certificateCount} issued →
                          </span>
                        </button>
                      </div>

                      {/* Quick Status Select */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-500">Ceremony Status:</span>
                        <select
                          value={ceremony.status}
                          onChange={(e) => handleQuickStatusChange(ceremony.id, e.target.value as GraduationCeremonyStatus, ceremony.graduationNumber)}
                          className="px-2 py-1 text-xs rounded border border-slate-300 bg-slate-50 font-bold text-slate-700 cursor-pointer"
                        >
                          <option value="Planning">Planning</option>
                          <option value="Registration Open">Registration Open</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setViewingCeremony(ceremony)}
                        className="text-[#002366] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Dossier</span>
                      </button>

                      <div className="flex items-center gap-1">
                        {ceremony.id === 'ceremony-2024-rpl-practitioners' && (
                          <button
                            onClick={() => setActiveTab('rpl-migration')}
                            className="px-2.5 py-1 rounded-lg bg-[#002366] hover:bg-[#001740] text-amber-300 font-bold text-[11px] border border-[#C5A059]/50 flex items-center gap-1 transition-colors cursor-pointer"
                            title="Open RPL 2024 Institutional Migration & Roster Utility"
                          >
                            <Database className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>RPL Data (118)</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedBookletCeremonyId(ceremony.id);
                            setActiveTab('booklet');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#002366] font-bold text-[11px] border border-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Generate & View Convocation Booklet"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Booklet</span>
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(ceremony)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-[#002366] hover:bg-slate-200 transition-colors cursor-pointer"
                          title="Edit Ceremony Fields"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCeremony(ceremony.id, ceremony.graduationNumber)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Ceremony"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TABLE VIEW OF CEREMONIES */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Ceremony / Congregation</th>
                      <th className="py-3 px-4">Year</th>
                      <th className="py-3 px-4">Theme</th>
                      <th className="py-3 px-4">Date & Venue</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Candidates</th>
                      <th className="py-3 px-4">Certificates</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredCeremonies.map((ceremony) => {
                      const candidateCount = graduationCandidates.filter((c) => c.ceremonyId === ceremony.id).length;
                      const certificateCount = graduationCertificates.filter((c) => c.ceremonyId === ceremony.id).length;

                      return (
                        <tr key={ceremony.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            <div>{ceremony.graduationNumber}</div>
                            <div className="text-[10px] text-slate-400 font-normal">Acad: {ceremony.academicYear}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#002366] font-mono font-bold">
                              {ceremony.graduationYear}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs truncate" title={ceremony.theme}>
                            <span className="italic">"{ceremony.theme}"</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div>{ceremony.graduationDate}</div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[160px]">{ceremony.venue}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={ceremony.status}
                              onChange={(e) => handleQuickStatusChange(ceremony.id, e.target.value as GraduationCeremonyStatus, ceremony.graduationNumber)}
                              className="px-2 py-1 text-[11px] rounded border border-slate-300 bg-white font-bold cursor-pointer"
                            >
                              <option value="Planning">Planning</option>
                              <option value="Registration Open">Registration Open</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Archived">Archived</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#002366]">
                            <button
                              onClick={() => handleViewCeremonyCandidates(ceremony.id)}
                              className="hover:underline cursor-pointer bg-blue-50 hover:bg-blue-100 text-[#002366] px-2 py-1 rounded"
                            >
                              {candidateCount} graduands →
                            </button>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#C5A059]">
                            <button
                              onClick={() => handleViewCeremonyCertificates(ceremony.id)}
                              className="hover:underline cursor-pointer bg-amber-50 hover:bg-amber-100 text-[#C5A059] px-2 py-1 rounded"
                            >
                              {certificateCount} issued →
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setSelectedBookletCeremonyId(ceremony.id);
                                  setActiveTab('booklet');
                                }}
                                className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-[#002366] font-bold text-[11px] border border-amber-300 flex items-center gap-1 cursor-pointer"
                                title="Generate Convocation Booklet"
                              >
                                <BookOpen className="w-3 h-3 text-[#C5A059]" />
                                <span>Booklet</span>
                              </button>
                              <button
                                onClick={() => setViewingCeremony(ceremony)}
                                className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
                                title="View Dossier"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(ceremony)}
                                className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
                                title="Edit Ceremony"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCeremony(ceremony.id, ceremony.graduationNumber)}
                                className="p-1.5 rounded hover:bg-rose-50 text-rose-600"
                                title="Delete Ceremony"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredCeremonies.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Calendar className="w-12 h-12 mx-auto text-slate-300" />
              <h4 className="text-base font-bold text-slate-800">No graduation ceremonies match your query</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try clearing your search query or status filter, or define a new graduation ceremony for the upcoming academic year.
              </p>
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 rounded-lg bg-[#002366] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#C5A059]" />
                <span>Define Ceremony Now</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CANDIDATES ROSTER SUMMARY */}
      {activeTab === 'candidates' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display text-[#002366]">Graduation Candidates Roster</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-[#002366]">
                  {filteredCandidates.length} of {graduationCandidates.length} Shown
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Official candidate roster submitted for degree conferral, academic clearance verification, and commencement program.
              </p>
            </div>

            {/* Quick Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCandidateSearchQuery('');
                  setCandidateCeremonyFilter('All');
                  setCandidateClearanceFilter('All');
                }}
                className="text-xs font-bold text-slate-600 hover:text-[#002366] px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Candidates Filter Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={candidateSearchQuery}
                onChange={(e) => setCandidateSearchQuery(e.target.value)}
                placeholder="Search candidates by name, student reg ID, program, or school..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#002366]"
              />
            </div>

            {/* Ceremony Filter */}
            <select
              value={candidateCeremonyFilter}
              onChange={(e) => setCandidateCeremonyFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-700 cursor-pointer"
            >
              <option value="All">All Ceremonies</option>
              {graduationCeremonies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.graduationNumber} ({c.graduationYear})
                </option>
              ))}
            </select>

            {/* Clearance Filter */}
            <select
              value={candidateClearanceFilter}
              onChange={(e) => setCandidateClearanceFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-700 cursor-pointer"
            >
              <option value="All">All Clearance Stages</option>
              <option value="100">100% Cleared (Senate Approved)</option>
              <option value="pending">Pending Clearance (&lt;100%)</option>
              <option value="conferred">Conferred Graduate</option>
            </select>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Student ID / Candidate</th>
                    <th className="py-3 px-4">Degree Program</th>
                    <th className="py-3 px-4">Assigned Ceremony</th>
                    <th className="py-3 px-4">GPA / Honors</th>
                    <th className="py-3 px-4">Clearance</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Fee Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredCandidates.map((candidate) => {
                    const ceremony = graduationCeremonies.find((c) => c.id === candidate.ceremonyId);

                    return (
                      <tr key={candidate.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div>{candidate.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{candidate.studentId}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-900 font-medium">{candidate.programName}</div>
                          {candidate.academicAchievement && candidate.academicAchievement !== candidate.programName && (
                            <div className="text-[11px] text-slate-600">{candidate.academicAchievement}</div>
                          )}
                          {candidate.institution && (
                            <div className="text-[10px] text-indigo-700 font-semibold">{candidate.institution}</div>
                          )}
                          <div className="text-[10px] text-slate-400">{candidate.schoolName}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] bg-blue-50 text-[#002366] font-semibold">
                            {ceremony?.graduationNumber || candidate.ceremonyNumber || 'Annual Ceremony'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-slate-800">{candidate.finalGpa.toFixed(2)}</div>
                          <div className="text-[10px] text-[#C5A059] font-semibold">{candidate.academicHonors}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full"
                                style={{ width: `${candidate.clearanceProgress}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono font-bold">{candidate.clearanceProgress}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              candidate.status === 'Conferred Graduate'
                                ? 'bg-emerald-100 text-emerald-800'
                                : candidate.status === 'Clearance Approved'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {candidate.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-emerald-700">
                          ${candidate.graduationFeePaid} (Paid)
                        </td>
                      </tr>
                    );
                  })}
                  {filteredCandidates.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-400">
                        No candidates found matching the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CERTIFICATES ISSUED */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display text-[#002366]">Conferred Certificates Registry</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-[#002366]">
                  {filteredCertificates.length} of {graduationCertificates.length} Shown
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Official certificates issued with unique registrar serials and blockchain verification codes.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCertSearchQuery('');
                  setCertCeremonyFilter('All');
                  setCertAwardFilter('All');
                }}
                className="text-xs font-bold text-slate-600 hover:text-[#002366] px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Certificates Filter Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={certSearchQuery}
                onChange={(e) => setCertSearchQuery(e.target.value)}
                placeholder="Search certificates by serial, graduate name, degree title, or hash..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#002366]"
              />
            </div>

            {/* Ceremony Filter */}
            <select
              value={certCeremonyFilter}
              onChange={(e) => setCertCeremonyFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-700 cursor-pointer"
            >
              <option value="All">All Ceremonies</option>
              {graduationCeremonies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.graduationNumber}
                </option>
              ))}
            </select>

            {/* Award Level Filter */}
            <select
              value={certAwardFilter}
              onChange={(e) => setCertAwardFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-700 cursor-pointer"
            >
              <option value="All">All Award Levels</option>
              <option value="Bachelor">Bachelor Degrees</option>
              <option value="Master">Master Degrees</option>
              <option value="Doctoral">Doctoral Degrees</option>
              <option value="Diploma">Diplomas</option>
            </select>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Certificate Serial</th>
                    <th className="py-3 px-4">Graduate Name</th>
                    <th className="py-3 px-4">Conferred Degree</th>
                    <th className="py-3 px-4">Award Level</th>
                    <th className="py-3 px-4">Conferral Date</th>
                    <th className="py-3 px-4">Verification Code</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredCertificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#002366]">
                        {cert.certificateNumber}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {cert.studentName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-800">
                        {cert.degreeTitle}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#002366]">
                          {cert.awardLevel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {cert.conferralDate}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-amber-700">
                        {cert.verificationCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                          {cert.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredCertificates.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-400">
                        No certificates found matching the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GRADUATION BOOKLET GENERATOR & PRINTABLE PDF */}
      {activeTab === 'booklet' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#002366] uppercase tracking-wider px-2">Booklet Workspace:</span>
              <button
                onClick={() => setBookletMode('editor')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  bookletMode === 'editor'
                    ? 'bg-[#002366] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ✏️ Administrative Editor (Drag-and-Drop Photos & Speeches)
              </button>
              <button
                onClick={() => setBookletMode('reader')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  bookletMode === 'reader'
                    ? 'bg-[#002366] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                📖 Publication Reader & Catalog
              </button>
            </div>
            <button
              onClick={() => setActiveTab('ceremonies')}
              className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              Back to Ceremonies
            </button>
          </div>

          {bookletMode === 'editor' ? (
            <AdministrativeBookletEditor initialCeremonyId={selectedBookletCeremonyId} />
          ) : (
            <GraduationBookletGenerator
              initialCeremonyId={selectedBookletCeremonyId}
              onClose={() => setActiveTab('ceremonies')}
            />
          )}
        </div>
      )}

      {/* TAB 5: RPL 2024 PRACTITIONERS MIGRATION & INSTITUTIONAL DIRECTORY */}
      {activeTab === 'rpl-migration' && (
        <Rpl2024MigrationUtility />
      )}

      {/* DEFINE / EDIT CEREMONY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#002366]">
                  <GraduationCap className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-[#002366]">
                    {editingCeremonyId ? 'Edit Graduation Ceremony' : 'Define New Graduation Ceremony'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure convocation year, theme, dignitaries, and operational status.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCeremony} className="space-y-4 text-xs">
              {/* Row 1: Ceremony Name & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">Ceremony Congregation Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.graduationNumber}
                    onChange={(e) => setFormData({ ...formData, graduationNumber: e.target.value })}
                    placeholder="e.g., 16th Annual Congregation"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#002366]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Graduation Year *</label>
                  <input
                    type="number"
                    required
                    min={2000}
                    max={2040}
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || 2026 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#002366]"
                  />
                </div>
              </div>

              {/* Row 2: Convocation Theme with Presets */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Convocation Theme & Scripture Citation *</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">Official booklet citation</span>
                </div>
                <input
                  type="text"
                  required
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  placeholder="e.g. Equipped for Ministry, Leadership and Global Impact (2 Timothy 3:16-17)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#002366] font-medium"
                />

                {/* Biblical Theme Presets */}
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#C5A059]" />
                    <span>Quick-Select Theme Presets:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {GRADUATION_THEME_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, theme: `${preset.theme} (${preset.scripture})` })}
                        className="px-2 py-1 text-[10px] font-medium rounded-md bg-white hover:bg-[#002366] hover:text-white border border-slate-200 text-slate-700 transition-colors cursor-pointer text-left"
                        title={`${preset.category}: ${preset.scripture}`}
                      >
                        <span className="font-bold text-[#C5A059] mr-1">✦</span>
                        {preset.scripture}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Plaque Preview */}
                {formData.theme && (
                  <div className="p-2.5 rounded-lg bg-amber-50/80 border border-[#C5A059]/40 text-slate-800 text-[11px] italic">
                    <span className="font-bold text-[#002366] not-italic block text-[10px] uppercase tracking-wider mb-0.5">
                      Theme Preview:
                    </span>
                    “{formData.theme}”
                  </div>
                )}
              </div>

              {/* Row 3: Status & Academic Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">Ceremony Status *</label>
                    <span className="text-[10px] text-slate-500">Operational Phase</span>
                  </div>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as GraduationCeremonyStatus })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#002366] font-bold text-slate-800"
                  >
                    {CEREMONY_STATUS_DEFINITIONS.map((def) => (
                      <option key={def.status} value={def.status}>
                        {def.status}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-500 italic leading-snug pt-0.5">
                    {CEREMONY_STATUS_DEFINITIONS.find((s) => s.status === formData.status)?.description}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Academic Year</label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    placeholder="e.g. 2026/2027"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#002366]"
                  />
                </div>
              </div>

              {/* Row 4: Date, Time & Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Ceremony Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.graduationDate}
                    onChange={(e) => setFormData({ ...formData, graduationDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#002366]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Start Time</label>
                  <input
                    type="text"
                    value={formData.graduationTime}
                    onChange={(e) => setFormData({ ...formData, graduationTime: e.target.value })}
                    placeholder="e.g. 09:30 AM (MST)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#002366]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">City / Country</label>
                  <input
                    type="text"
                    value={`${formData.city}, ${formData.country}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(',');
                      setFormData({
                        ...formData,
                        city: parts[0]?.trim() || formData.city,
                        country: parts[1]?.trim() || formData.country
                      });
                    }}
                    placeholder="City, Country"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#002366]"
                  />
                </div>
              </div>

              {/* Venue details */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Venue & Hall *</label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. Grand Convocation Pavilion & Cathedral of Faith"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#002366]"
                />
              </div>

              {/* Dignitaries */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Chief Guest / Keynote Speaker</label>
                  <input
                    type="text"
                    value={formData.chiefGuest}
                    onChange={(e) => setFormData({ ...formData, chiefGuest: e.target.value })}
                    placeholder="Name and Title"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#002366]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Graduation Coordinator</label>
                  <input
                    type="text"
                    value={formData.graduationCoordinator}
                    onChange={(e) => setFormData({ ...formData, graduationCoordinator: e.target.value })}
                    placeholder="e.g. Prof. Joseph K. Mutua"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#002366]"
                  />
                </div>
              </div>

              {/* Livestream & Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Livestream URL</label>
                  <input
                    type="url"
                    value={formData.livestreamUrl}
                    onChange={(e) => setFormData({ ...formData, livestreamUrl: e.target.value })}
                    placeholder="https://youtube.com/live/..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#002366]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Banner Photo URL</label>
                  <input
                    type="url"
                    value={formData.bannerUrl}
                    onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#002366]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Ceremony Description & Notes</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional notes, convocation highlights, or academic protocols..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#002366]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#002366] text-white hover:bg-[#001A4D] font-bold shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                  <span>{editingCeremonyId ? 'Save Changes' : 'Confirm & Define Ceremony'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW CEREMONY DOSSIER MODAL */}
      {viewingCeremony && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#C5A059]">
                  Ceremony Dossier • Academic Year {viewingCeremony.graduationYear}
                </span>
                <h3 className="text-xl font-bold font-display text-[#002366]">
                  {viewingCeremony.graduationNumber}
                </h3>
              </div>

              <button
                onClick={() => setViewingCeremony(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Banner Preview */}
            <div className="relative h-48 rounded-xl overflow-hidden shadow-inner">
              <img
                src={viewingCeremony.bannerUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200'}
                alt={viewingCeremony.graduationNumber}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-[#C5A059] text-[#002366]">
                  {viewingCeremony.status}
                </span>
                <p className="mt-2 text-sm font-semibold italic text-amber-200">
                  "{viewingCeremony.theme}"
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-[#002366] uppercase tracking-wider text-[11px]">Event Logistics</div>
                <div><strong>Date & Time:</strong> {viewingCeremony.graduationDate} at {viewingCeremony.graduationTime}</div>
                <div><strong>Venue:</strong> {viewingCeremony.venue}</div>
                <div><strong>Location:</strong> {viewingCeremony.city}, {viewingCeremony.country}</div>
                <div><strong>Academic Year:</strong> {viewingCeremony.academicYear}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-[#002366] uppercase tracking-wider text-[11px]">Presiding Dignitaries</div>
                <div><strong>Chancellor:</strong> {viewingCeremony.chancellor}</div>
                <div><strong>Vice Chancellor:</strong> {viewingCeremony.viceChancellor}</div>
                <div><strong>Chief Guest:</strong> {viewingCeremony.chiefGuest}</div>
                <div><strong>Registrar:</strong> {viewingCeremony.registrar}</div>
              </div>
            </div>

            {/* Programme Schedule Preview */}
            <div className="space-y-2">
              <div className="font-bold text-slate-800 text-xs uppercase tracking-wider">Programme Schedule Highlights</div>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl max-h-48 overflow-y-auto text-xs">
                {viewingCeremony.programmeSchedule?.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-400 text-[11px]">{item.time}</span>
                      <span className="font-medium text-slate-800">{item.activity}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">{item.facilitator}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setViewingCeremony(null);
                  handleOpenEditModal(viewingCeremony);
                }}
                className="px-4 py-2 rounded-lg bg-[#002366] text-white font-bold text-xs hover:bg-[#001A4D] flex items-center gap-1.5 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Ceremony Details</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
