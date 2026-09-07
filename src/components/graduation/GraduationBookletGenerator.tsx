import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  GraduationBooklet,
  GraduationCandidate,
  GraduationCeremony,
  AcademicAwardWinner,
  UniversityMessage,
  ProgrammeScheduleItem,
  FacultyLeadershipMember
} from '../../types/graduation';
import {
  BookOpen,
  Printer,
  Download,
  Search,
  Award,
  Users,
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Save,
  RotateCcw,
  Sliders,
  Image as ImageIcon,
  Check,
  X,
  FileText,
  Eye,
  Scroll,
  Camera,
  ExternalLink,
  ChevronDown,
  Layers,
  GraduationCap,
  Quote,
  Clock,
  Globe,
  Share2,
  BookMarked,
  Filter
} from 'lucide-react';

interface GraduationBookletGeneratorProps {
  initialCeremonyId?: string;
  onClose?: () => void;
  className?: string;
}

export const GraduationBookletGenerator: React.FC<GraduationBookletGeneratorProps> = ({
  initialCeremonyId,
  onClose,
  className = ''
}) => {
  const {
    currentUser,
    graduationCeremonies,
    graduationCandidates,
    graduationBooklets,
    activeGraduationBooklet,
    updateGraduationBooklet,
    generateGraduationBooklet,
    updateGraduationCandidate,
    academicAwards,
    universityInfo
  } = useApp();

  // Selected Ceremony
  const [selectedCeremonyId, setSelectedCeremonyId] = useState<string>(() => {
    if (initialCeremonyId && graduationCeremonies.some((c) => c.id === initialCeremonyId)) {
      return initialCeremonyId;
    }
    if (activeGraduationBooklet?.ceremonyId && graduationCeremonies.some((c) => c.id === activeGraduationBooklet.ceremonyId)) {
      return activeGraduationBooklet.ceremonyId;
    }
    return graduationCeremonies[0]?.id || 'ceremony-2026-15th';
  });

  const currentCeremony = useMemo(() => {
    return graduationCeremonies.find((c) => c.id === selectedCeremonyId) || graduationCeremonies[0];
  }, [graduationCeremonies, selectedCeremonyId]);

  // Active Booklet for current ceremony (or generate fallback if none exists)
  const ceremonyBooklet = useMemo<GraduationBooklet>(() => {
    const found = graduationBooklets.find((b) => b.ceremonyId === selectedCeremonyId);
    if (found) return found;

    if (activeGraduationBooklet && activeGraduationBooklet.ceremonyId === selectedCeremonyId) {
      return activeGraduationBooklet;
    }

    // Default template synthesized from ceremony
    return {
      id: `booklet-${selectedCeremonyId}`,
      ceremonyId: selectedCeremonyId,
      title: `${currentCeremony?.graduationNumber || 'Annual Congregation'} Convocation Booklet`,
      academicYear: currentCeremony?.academicYear || '2025/2026',
      edition: 'Official Commemorative Convocation Edition',
      theme: currentCeremony?.theme || 'Equipped for Ministry, Leadership and Global Kingdom Impact (2 Timothy 3:16-17)',
      coverImage: currentCeremony?.bannerUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
      status: 'Published',
      publishedDate: currentCeremony?.graduationDate || '2026-10-24',
      chancellorMessage: {
        authorName: currentCeremony?.chancellor || 'Dr. Michael C. Sterling, Th.D., D.Min.',
        authorTitle: 'President & Chancellor, Breakthrough International Bible University',
        messageTitle: 'A Royal Charge to the Conferred Class',
        photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
        signatureText: `${currentCeremony?.chancellor || 'Dr. Michael C. Sterling'}, Chancellor`,
        messageContent: [
          'To our esteemed graduates: Grace, peace, and divine favor be multiplied unto you in the name of our Lord Jesus Christ.',
          'Today marks not an end, but a solemn and glorious commissioning. You consecrated hours to the study of God’s infallible Word, engaged rigorous theological inquiry, and submitted your hearts to the refining fire of the Holy Spirit.',
          'Go forth into your pulpits, counseling centers, classrooms, and marketplaces knowing that you are thoroughly equipped for every good work (2 Timothy 3:16-17).'
        ]
      },
      viceChancellorMessage: {
        authorName: currentCeremony?.viceChancellor || 'Prof. Dr. Patrick Njuguna, Ph.D., Th.D.',
        authorTitle: 'Vice Chancellor & Chief Academic Officer',
        messageTitle: 'Academic Rigor, Spiritual Fervor, and Kingdom Relevance',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        signatureText: `${currentCeremony?.viceChancellor || 'Prof. Dr. Patrick Njuguna'}, Vice Chancellor`,
        messageContent: [
          'It is my distinct joy to present the graduating class. The candidates listed in this official convocation booklet have met every academic standard and examination requirement.',
          'At BIBU, scholarship bows before Christ and directly serves the Church. Wear your honors with humility and let your life be your greatest sermon.'
        ]
      },
      registrarMessage: {
        authorName: currentCeremony?.registrar || 'Rev. Dr. Sarah M. Jenkins, Th.D.',
        authorTitle: 'University Registrar',
        messageTitle: 'Official Certification of Conferred Degrees and Diplomas',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
        signatureText: `${currentCeremony?.registrar || 'Rev. Dr. Sarah M. Jenkins'}, Registrar`,
        messageContent: [
          'By virtue of the authority vested in the Office of the Registrar by the University Charter and the International Commission for Christian Academic Standards, I certify that the candidates enrolled have satisfied all degree requirements.',
          'Each certificate issued carries an immutable verification registry code accessible via our global portal at bibu-edu.org/verify.'
        ]
      },
      universityProfile: {
        history: 'Breakthrough International Bible University was established in 1998 in Phoenix, Arizona, USA, to deliver accessible, biblically sound, Spirit-filled theological higher education to ministers and leaders worldwide across 64 nations.',
        vision: 'To be a premier global Christian university recognized for uncompromising biblical orthodoxy and transformative leadership training.',
        mission: 'To educate, train, and mentor called servant-leaders through rigorous biblical scholarship and practical ministry preparation.',
        coreValues: [
          'Biblical Authority: The Holy Scriptures are the inspired, infallible rule of faith.',
          'Kingdom Excellence: Pursuing the highest standards in academics and ministry.',
          'Spiritual Empowerment: Dependence on the Holy Spirit.',
          'Integrity & Christlike Character: Transparent, servant-hearted leadership.',
          'Global Inclusivity: Theological education accessible across all continents.'
        ],
        accreditationStatement: 'Accredited by the International Commission for Christian Academic Standards (ICCAS) and member of the Global Theological Education Network.',
        institutionsSummary: 'Operating 9 academic faculties including Biblical Studies, Leadership & Management, Christian Counseling, and Cross-Cultural Missions.'
      },
      facultyBoard: [
        { name: currentCeremony?.chancellor || 'Dr. Michael C. Sterling', qualifications: 'Th.D., D.Min.', role: 'Chancellor & President', departmentOrSchool: 'Governing Council' },
        { name: currentCeremony?.viceChancellor || 'Prof. Dr. Patrick Njuguna', qualifications: 'Ph.D., Th.D.', role: 'Vice Chancellor', departmentOrSchool: 'Academic Senate' },
        { name: currentCeremony?.registrar || 'Rev. Dr. Sarah M. Jenkins', qualifications: 'Th.D., M.Div.', role: 'University Registrar', departmentOrSchool: 'Registrar Office' },
        { name: 'Prof. Joseph K. Mutua', qualifications: 'Ph.D.', role: 'Director of Academic Affairs', departmentOrSchool: 'Accreditation Board' },
        { name: 'Bishop Dr. William K. Tuimising', qualifications: 'D.Min., M.Th.', role: 'Dean, Biblical Studies', departmentOrSchool: 'School of Theology' },
        { name: 'Prof. Susan Amiss', qualifications: 'Ph.D.', role: 'Dean, Counseling & Psychology', departmentOrSchool: 'School of Counseling' }
      ],
      customProgrammeSchedule: currentCeremony?.programmeSchedule || [],
      awards: academicAwards,
      generatedAt: new Date().toISOString(),
      generatedBy: currentUser.name,
      lastEditedBy: currentUser.name,
      isDemo: true
    };
  }, [graduationBooklets, selectedCeremonyId, activeGraduationBooklet, currentCeremony, academicAwards, currentUser.name]);

  // Working editable booklet state (draft in progress)
  const [editableBooklet, setEditableBooklet] = useState<GraduationBooklet>(ceremonyBooklet);

  // Synchronize when ceremony changes
  React.useEffect(() => {
    setEditableBooklet(ceremonyBooklet);
  }, [ceremonyBooklet]);

  // View Controls
  const [viewMode, setViewMode] = useState<'paged' | 'continuous' | 'printPreview'>('paged');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showEditorDrawer, setShowEditorDrawer] = useState(false);
  const [editorSection, setEditorSection] = useState<'chancellor' | 'viceChancellor' | 'registrar' | 'keynote' | 'theme' | 'history' | 'schedule'>('chancellor');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Candidate Filtering & Search
  const [candidateSearchQuery, setCandidateSearchQuery] = useState('');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('All');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('All');
  const [clearanceFilter, setClearanceFilter] = useState<'All' | 'ClearedOnly' | 'ConferredOnly'>('All');
  const [photoLayoutMode, setPhotoLayoutMode] = useState<'cards' | 'yearbook' | 'compact'>('cards');

  // Candidate quick preview / photo edit modal
  const [inspectCandidate, setInspectCandidate] = useState<GraduationCandidate | null>(null);
  const [photoEditUrl, setPhotoEditUrl] = useState('');

  // Candidates for this ceremony
  const ceremonyCandidates = useMemo(() => {
    return graduationCandidates.filter(
      (c) =>
        c.ceremonyId === selectedCeremonyId ||
        c.graduationYear === currentCeremony?.graduationYear
    );
  }, [graduationCandidates, selectedCeremonyId, currentCeremony]);

  // Filtered candidate list
  const filteredCandidates = useMemo(() => {
    return ceremonyCandidates.filter((c) => {
      const matchSearch =
        candidateSearchQuery === '' ||
        c.fullName.toLowerCase().includes(candidateSearchQuery.toLowerCase()) ||
        c.programName.toLowerCase().includes(candidateSearchQuery.toLowerCase()) ||
        c.studentId.toLowerCase().includes(candidateSearchQuery.toLowerCase()) ||
        c.schoolName.toLowerCase().includes(candidateSearchQuery.toLowerCase()) ||
        (c.city && c.city.toLowerCase().includes(candidateSearchQuery.toLowerCase())) ||
        (c.country && c.country.toLowerCase().includes(candidateSearchQuery.toLowerCase()));

      const matchSchool = selectedSchoolFilter === 'All' || c.schoolName === selectedSchoolFilter;
      const matchLevel = selectedLevelFilter === 'All' || c.awardLevel === selectedLevelFilter;

      let matchClearance = true;
      if (clearanceFilter === 'ClearedOnly') {
        matchClearance = c.clearanceProgress === 100 || c.status.includes('Clearance') || c.status.includes('Approved');
      } else if (clearanceFilter === 'ConferredOnly') {
        matchClearance = c.status === 'Conferred Graduate' || Boolean(c.certificateNumber);
      }

      return matchSearch && matchSchool && matchLevel && matchClearance;
    });
  }, [ceremonyCandidates, candidateSearchQuery, selectedSchoolFilter, selectedLevelFilter, clearanceFilter]);

  // Group candidates by School and then Award Level for ceremonial presentation
  const groupedCandidatesBySchool = useMemo(() => {
    const groups: { [school: string]: { [level: string]: GraduationCandidate[] } } = {};

    filteredCandidates.forEach((cand) => {
      const school = cand.schoolName || 'Faculty of Biblical Studies';
      const level = cand.awardLevel || 'Bachelor';

      if (!groups[school]) groups[school] = {};
      if (!groups[school][level]) groups[school][level] = [];

      groups[school][level].push(cand);
    });

    return groups;
  }, [filteredCandidates]);

  // Filter options
  const uniqueSchools = useMemo(() => {
    const set = new Set(ceremonyCandidates.map((c) => c.schoolName));
    return ['All', ...Array.from(set).filter(Boolean)];
  }, [ceremonyCandidates]);

  const uniqueLevels = useMemo(() => {
    const set = new Set(ceremonyCandidates.map((c) => c.awardLevel));
    return ['All', ...Array.from(set).filter(Boolean)];
  }, [ceremonyCandidates]);

  // Ceremony awards
  const ceremonyAwards = useMemo(() => {
    return academicAwards.filter((a) => !a.ceremonyId || a.ceremonyId === selectedCeremonyId);
  }, [academicAwards, selectedCeremonyId]);

  // Keynote / Chief Guest Message
  const [keynoteMessage, setKeynoteMessage] = useState<UniversityMessage>({
    authorName: currentCeremony?.chiefGuest || 'Archbishop Arthur Kitonga, D.D.',
    authorTitle: 'Senior Patriarch, Presiding Christian Statesman & Chief Guest',
    messageTitle: 'Apostolic Mandate to Disciple the Nations',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    signatureText: `${currentCeremony?.chiefGuest?.split('-')[0]?.trim() || 'Archbishop Arthur Kitonga'}, Chief Guest`,
    messageContent: [
      'Beloved graduands: As you receive your degrees and diplomas today, remember that the harvest is plenteous, but the laborers are few.',
      'You are sent as ambassadors of the Kingdom of Light. Preach the Word without apology, contend for the faith once delivered unto the saints, and let your leadership reflect Christ’s humility.'
    ]
  });

  // Pages in booklet:
  // 1: Official Front Cover
  // 2: Table of Contents & University Governance
  // 3: Order of Proceedings / Programme Schedule
  // 4: Institutional Profile, Vision, Mission & Accreditation
  // 5: Chancellor’s Address & Convocation Charge
  // 6: Vice Chancellor’s Message
  // 7: Registrar’s Proclamation & Accreditation Certification
  // 8: Keynote Address by Chief Guest
  // 9: Academic Awards & Valedictorian Citations
  // 10: Graduating Class Directory & Student Photography
  // 11: University Hymn, Recessional & Back Cover
  const totalBookletPages = 11;

  // Handle Save Booklet to Database
  const handleSaveBookletChanges = () => {
    const updated: GraduationBooklet = {
      ...editableBooklet,
      awards: ceremonyAwards,
      lastEditedBy: currentUser.name,
      generatedAt: new Date().toISOString()
    };
    updateGraduationBooklet(editableBooklet.id, updated);
    setSaveSuccessNotice('Booklet customized & saved to university graduation database!');
    setTimeout(() => setSaveSuccessNotice(null), 4000);
  };

  // Handle Print PDF
  const handlePrint = () => {
    window.print();
  };

  // Handle Candidate Photo Update
  const handleSaveCandidatePhoto = () => {
    if (!inspectCandidate || !photoEditUrl) return;
    updateGraduationCandidate(inspectCandidate.id, {
      profilePhoto: photoEditUrl
    });
    setInspectCandidate((prev) => (prev ? { ...prev, profilePhoto: photoEditUrl } : null));
    setPhotoEditUrl('');
  };

  return (
    <div id="graduation-booklet-generator" className={`space-y-6 ${isFullScreen ? 'fixed inset-0 z-50 bg-[#F8F9FB] p-6 overflow-y-auto' : ''} ${className}`}>
      {/* SUCCESS BANNER */}
      {saveSuccessNotice && (
        <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center justify-between text-xs font-bold no-print animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{saveSuccessNotice}</span>
          </div>
          <button onClick={() => setSaveSuccessNotice(null)} className="text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP CONTROL HUB / GENERATOR TOOLBAR (Hidden in Print) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#002366] text-[#C5A059] shadow-xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-[#002366] border border-amber-300">
                  Dynamic Convocation Booklet Generator
                </span>
                <span className="text-xs text-slate-400 font-mono">v3.8 • Multi-Format</span>
              </div>
              <h2 className="text-xl font-bold font-display text-[#002366]">
                {editableBooklet.title}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>{currentCeremony?.venue}</span>
                <span>•</span>
                <span className="font-semibold text-[#C5A059]">{ceremonyCandidates.length} Graduands in Registry</span>
                <span>•</span>
                <span>{currentCeremony?.graduationDate}</span>
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Ceremony Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-[#002366]" />
              <label className="text-[11px] font-bold text-slate-600">Ceremony:</label>
              <select
                value={selectedCeremonyId}
                onChange={(e) => setSelectedCeremonyId(e.target.value)}
                className="bg-white text-xs font-bold text-[#002366] border border-slate-300 rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#002366] cursor-pointer"
              >
                {graduationCeremonies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.graduationNumber} ({c.graduationYear})
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('paged')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'paged' ? 'bg-[#002366] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Page-by-page interactive reader"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Paged Reader</span>
              </button>

              <button
                onClick={() => setViewMode('continuous')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'continuous' ? 'bg-[#002366] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Continuous document view"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Magazine Flow</span>
              </button>

              <button
                onClick={() => setViewMode('printPreview')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'printPreview' ? 'bg-[#002366] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Print Preview / PDF Format"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Print PDF Mode</span>
              </button>
            </div>

            {/* Customizer Drawer Trigger */}
            <button
              onClick={() => setShowEditorDrawer(!showEditorDrawer)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                showEditorDrawer
                  ? 'bg-amber-100 text-[#002366] border border-amber-300'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Customize Messages</span>
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 text-slate-600 hover:text-[#002366] hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Save to Database */}
            <button
              onClick={handleSaveBookletChanges}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Save changes to permanent graduation database"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Booklet</span>
            </button>

            {/* PRINT / DOWNLOAD PDF BUTTON */}
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer border border-[#C5A059]/40"
            >
              <Printer className="w-4 h-4 text-[#C5A059]" />
              <span className="font-extrabold">Print Booklet / PDF</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                title="Close Booklet"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* SUB-BAR: PAGED NAVIGATION & CANDIDATE FILTERS */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* If Paged View, Show Step Navigation */}
          {viewMode === 'paged' && (
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {[
                  { num: 1, label: 'Cover' },
                  { num: 2, label: 'Contents' },
                  { num: 3, label: 'Programme' },
                  { num: 4, label: 'University' },
                  { num: 5, label: 'Chancellor' },
                  { num: 6, label: 'V. Chancellor' },
                  { num: 7, label: 'Registrar' },
                  { num: 8, label: 'Keynote' },
                  { num: 9, label: 'Awards' },
                  { num: 10, label: `Graduands (${filteredCandidates.length})` },
                  { num: 11, label: 'Hymn & Close' }
                ].map((p) => (
                  <button
                    key={p.num}
                    onClick={() => setCurrentPage(p.num)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                      currentPage === p.num
                        ? 'bg-[#002366] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p.num}. {p.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalBookletPages, p + 1))}
                disabled={currentPage === totalBookletPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Stats Banner */}
          <div className="flex items-center gap-4 text-slate-600 shrink-0 font-medium">
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-[#002366]" />
              <strong className="text-slate-900">{ceremonyCandidates.length}</strong> Graduands
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#C5A059]" />
              <strong className="text-slate-900">{ceremonyAwards.length}</strong> Citations
            </span>
            <span className="flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <strong className="text-slate-900">{ceremonyCandidates.filter((c) => c.profilePhoto).length}</strong> Student Photos
            </span>
          </div>
        </div>
      </div>

      {/* CUSTOMIZATION DRAWER (Live Editor for Administrative Messages & Layout) */}
      {showEditorDrawer && (
        <div className="bg-white rounded-2xl border-2 border-amber-300 p-6 shadow-xl space-y-6 no-print animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50 text-[#002366]">
                <Sliders className="w-5 h-5 text-[#C5A059]" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-[#002366]">
                  Customizable Administrative Messages & Convocation Branding
                </h3>
                <p className="text-xs text-slate-500">
                  Update administrative addresses, leadership photographs, signatures, convocation scripture, and order of proceedings. Edits reflect immediately in the booklet.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowEditorDrawer(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Editor Category Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'chancellor', label: "Chancellor's Message" },
              { id: 'viceChancellor', label: "Vice Chancellor's Address" },
              { id: 'registrar', label: "Registrar's Proclamation" },
              { id: 'keynote', label: "Guest of Honor / Keynote" },
              { id: 'theme', label: "Theme & Scripture" },
              { id: 'history', label: "Heritage & Mission" },
              { id: 'schedule', label: "Order of Proceedings" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setEditorSection(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                  editorSection === tab.id
                    ? 'bg-[#002366] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* EDITOR BODY */}
          <div className="space-y-4 text-xs">
            {/* CHANCELLOR EDITOR */}
            {editorSection === 'chancellor' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700">Chancellor Author Name</label>
                    <input
                      type="text"
                      value={editableBooklet.chancellorMessage.authorName}
                      onChange={(e) =>
                        setEditableBooklet((prev) => ({
                          ...prev,
                          chancellorMessage: { ...prev.chancellorMessage, authorName: e.target.value }
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Official Title</label>
                    <input
                      type="text"
                      value={editableBooklet.chancellorMessage.authorTitle}
                      onChange={(e) =>
                        setEditableBooklet((prev) => ({
                          ...prev,
                          chancellorMessage: { ...prev.chancellorMessage, authorTitle: e.target.value }
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Message Headline / Title</label>
                    <input
                      type="text"
                      value={editableBooklet.chancellorMessage.messageTitle}
                      onChange={(e) =>
                        setEditableBooklet((prev) => ({
                          ...prev,
                          chancellorMessage: { ...prev.chancellorMessage, messageTitle: e.target.value }
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Portrait Photography URL</label>
                    <input
                      type="text"
                      value={editableBooklet.chancellorMessage.photoUrl || ''}
                      onChange={(e) =>
                        setEditableBooklet((prev) => ({
                          ...prev,
                          chancellorMessage: { ...prev.chancellorMessage, photoUrl: e.target.value }
                        }))
                      }
                      placeholder="https://..."
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700">Message Paragraphs (one paragraph per line)</label>
                  <textarea
                    rows={4}
                    value={editableBooklet.chancellorMessage.messageContent.join('\n\n')}
                    onChange={(e) =>
                      setEditableBooklet((prev) => ({
                        ...prev,
                        chancellorMessage: {
                          ...prev.chancellorMessage,
                          messageContent: e.target.value.split('\n\n').filter((p) => p.trim())
                        }
                      }))
                    }
                    className="w-full mt-1 p-3 border border-slate-300 rounded-lg text-xs font-sans"
                  />
                </div>
              </div>
            )}

            {/* VICE CHANCELLOR EDITOR */}
            {editorSection === 'viceChancellor' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700">Vice Chancellor Name</label>
                    <input
                      type="text"
                      value={editableBooklet.viceChancellorMessage.authorName}
                      onChange={(e) =>
                        setEditableBooklet((prev) => ({
                          ...prev,
                          viceChancellorMessage: { ...prev.viceChancellorMessage, authorName: e.target.value }
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Official Title</label>
                    <input
                      type="text"
                      value={editableBooklet.viceChancellorMessage.authorTitle}
                      onChange={(e) =>
                        setEditableBooklet((prev) => ({
                          ...prev,
                          viceChancellorMessage: { ...prev.viceChancellorMessage, authorTitle: e.target.value }
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Address Headline / Title</label>
                    <input
                      type="text"
                      value={editableBooklet.viceChancellorMessage.messageTitle}
                      onChange={(e) =>
                        setEditableBooklet((prev) => ({
                          ...prev,
                          viceChancellorMessage: { ...prev.viceChancellorMessage, messageTitle: e.target.value }
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Portrait Photo URL</label>
                    <input
                      type="text"
                      value={editableBooklet.viceChancellorMessage.photoUrl || ''}
                      onChange={(e) =>
                        setEditableBooklet((prev) => ({
                          ...prev,
                          viceChancellorMessage: { ...prev.viceChancellorMessage, photoUrl: e.target.value }
                        }))
                      }
                      placeholder="https://..."
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700">Message Paragraphs (separated by blank lines)</label>
                  <textarea
                    rows={4}
                    value={editableBooklet.viceChancellorMessage.messageContent.join('\n\n')}
                    onChange={(e) =>
                      setEditableBooklet((prev) => ({
                        ...prev,
                        viceChancellorMessage: {
                          ...prev.viceChancellorMessage,
                          messageContent: e.target.value.split('\n\n').filter((p) => p.trim())
                        }
                      }))
                    }
                    className="w-full mt-1 p-3 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            )}

            {/* REGISTRAR EDITOR */}
            {editorSection === 'registrar' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700">Registrar Name</label>
                    <input
                      type="text"
                      value={editableBooklet.registrarMessage.authorName}
                      onChange={(e) =>
                        setEditableBooklet((prev) => ({
                          ...prev,
                          registrarMessage: { ...prev.registrarMessage, authorName: e.target.value }
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Official Title</label>
                    <input
                      type="text"
                      value={editableBooklet.registrarMessage.authorTitle}
                      onChange={(e) =>
                        setEditableBooklet((prev) => ({
                          ...prev,
                          registrarMessage: { ...prev.registrarMessage, authorTitle: e.target.value }
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Proclamation Title</label>
                    <input
                      type="text"
                      value={editableBooklet.registrarMessage.messageTitle}
                      onChange={(e) =>
                        setEditableBooklet((prev) => ({
                          ...prev,
                          registrarMessage: { ...prev.registrarMessage, messageTitle: e.target.value }
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Registrar Portrait Photo URL</label>
                    <input
                      type="text"
                      value={editableBooklet.registrarMessage.photoUrl || ''}
                      onChange={(e) =>
                        setEditableBooklet((prev) => ({
                          ...prev,
                          registrarMessage: { ...prev.registrarMessage, photoUrl: e.target.value }
                        }))
                      }
                      placeholder="https://..."
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700">Official Registrar Certification Statement</label>
                  <textarea
                    rows={4}
                    value={editableBooklet.registrarMessage.messageContent.join('\n\n')}
                    onChange={(e) =>
                      setEditableBooklet((prev) => ({
                        ...prev,
                        registrarMessage: {
                          ...prev.registrarMessage,
                          messageContent: e.target.value.split('\n\n').filter((p) => p.trim())
                        }
                      }))
                    }
                    className="w-full mt-1 p-3 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            )}

            {/* KEYNOTE / CHIEF GUEST EDITOR */}
            {editorSection === 'keynote' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700">Chief Guest / Keynote Speaker</label>
                    <input
                      type="text"
                      value={keynoteMessage.authorName}
                      onChange={(e) => setKeynoteMessage((prev) => ({ ...prev, authorName: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Dignitary Role / Title</label>
                    <input
                      type="text"
                      value={keynoteMessage.authorTitle}
                      onChange={(e) => setKeynoteMessage((prev) => ({ ...prev, authorTitle: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Keynote Address Headline</label>
                    <input
                      type="text"
                      value={keynoteMessage.messageTitle}
                      onChange={(e) => setKeynoteMessage((prev) => ({ ...prev, messageTitle: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Chief Guest Photograph URL</label>
                    <input
                      type="text"
                      value={keynoteMessage.photoUrl || ''}
                      onChange={(e) => setKeynoteMessage((prev) => ({ ...prev, photoUrl: e.target.value }))}
                      placeholder="https://..."
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700">Keynote Address Content</label>
                  <textarea
                    rows={4}
                    value={keynoteMessage.messageContent.join('\n\n')}
                    onChange={(e) =>
                      setKeynoteMessage((prev) => ({
                        ...prev,
                        messageContent: e.target.value.split('\n\n').filter((p) => p.trim())
                      }))
                    }
                    className="w-full mt-1 p-3 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            )}

            {/* THEME & SCRIPTURE */}
            {editorSection === 'theme' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700">Booklet Edition Title</label>
                    <input
                      type="text"
                      value={editableBooklet.title}
                      onChange={(e) => setEditableBooklet((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700">Convocation Theme & Scripture Anchor</label>
                    <input
                      type="text"
                      value={editableBooklet.theme}
                      onChange={(e) => setEditableBooklet((prev) => ({ ...prev, theme: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Commemorative Edition Name</label>
                    <input
                      type="text"
                      value={editableBooklet.edition}
                      onChange={(e) => setEditableBooklet((prev) => ({ ...prev, edition: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Academic Year</label>
                    <input
                      type="text"
                      value={editableBooklet.academicYear}
                      onChange={(e) => setEditableBooklet((prev) => ({ ...prev, academicYear: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Theme Presets:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Equipped for Ministry, Leadership and Global Kingdom Impact (2 Timothy 3:16-17)',
                      'Commissioned as Ambassadors of Reconciliation and Global Transformation (2 Corinthians 5:20)',
                      'Arise, Shine, for Your Light Has Come (Isaiah 60:1)',
                      'Preach the Word; Be Ready in Season and Out of Season (2 Timothy 4:2)'
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditableBooklet((prev) => ({ ...prev, theme: preset }))}
                        className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-amber-50 hover:text-[#002366] rounded-md border border-slate-200 cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* HERITAGE & MISSION */}
            {editorSection === 'history' && (
              <div className="space-y-4">
                <div>
                  <label className="font-bold text-slate-700">University Foundation & History</label>
                  <textarea
                    rows={3}
                    value={editableBooklet.universityProfile.history}
                    onChange={(e) =>
                      setEditableBooklet((prev) => ({
                        ...prev,
                        universityProfile: { ...prev.universityProfile, history: e.target.value }
                      }))
                    }
                    className="w-full mt-1 p-3 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700">Institutional Vision</label>
                    <textarea
                      rows={2}
                      value={editableBooklet.universityProfile.vision}
                      onChange={(e) =>
                        setEditableBooklet((prev) => ({
                          ...prev,
                          universityProfile: { ...prev.universityProfile, vision: e.target.value }
                        }))
                      }
                      className="w-full mt-1 p-3 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Institutional Mission</label>
                    <textarea
                      rows={2}
                      value={editableBooklet.universityProfile.mission}
                      onChange={(e) =>
                        setEditableBooklet((prev) => ({
                          ...prev,
                          universityProfile: { ...prev.universityProfile, mission: e.target.value }
                        }))
                      }
                      className="w-full mt-1 p-3 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SCHEDULE */}
            {editorSection === 'schedule' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-700">Ceremony Programme Schedule ({editableBooklet.customProgrammeSchedule.length} Items)</div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextOrder = editableBooklet.customProgrammeSchedule.length + 1;
                      const newItem: ProgrammeScheduleItem = {
                        id: `prog-item-${Date.now()}`,
                        order: nextOrder,
                        time: '12:00 PM',
                        activity: 'New Convocation Programme Item',
                        facilitator: 'Faculty Marshal'
                      };
                      setEditableBooklet((prev) => ({
                        ...prev,
                        customProgrammeSchedule: [...prev.customProgrammeSchedule, newItem]
                      }));
                    }}
                    className="px-2.5 py-1 bg-[#002366] text-white rounded text-[11px] font-bold cursor-pointer"
                  >
                    + Add Programme Item
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {editableBooklet.customProgrammeSchedule.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-mono font-bold text-[#002366] w-6">{idx + 1}.</span>
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => {
                          const updated = [...editableBooklet.customProgrammeSchedule];
                          updated[idx] = { ...updated[idx], time: e.target.value };
                          setEditableBooklet((prev) => ({ ...prev, customProgrammeSchedule: updated }));
                        }}
                        className="w-24 px-2 py-1 border border-slate-300 rounded text-[11px] bg-white"
                        placeholder="09:00 AM"
                      />
                      <input
                        type="text"
                        value={item.activity}
                        onChange={(e) => {
                          const updated = [...editableBooklet.customProgrammeSchedule];
                          updated[idx] = { ...updated[idx], activity: e.target.value };
                          setEditableBooklet((prev) => ({ ...prev, customProgrammeSchedule: updated }));
                        }}
                        className="flex-1 px-2 py-1 border border-slate-300 rounded text-[11px] bg-white"
                        placeholder="Activity Description"
                      />
                      <input
                        type="text"
                        value={item.facilitator}
                        onChange={(e) => {
                          const updated = [...editableBooklet.customProgrammeSchedule];
                          updated[idx] = { ...updated[idx], facilitator: e.target.value };
                          setEditableBooklet((prev) => ({ ...prev, customProgrammeSchedule: updated }));
                        }}
                        className="w-48 px-2 py-1 border border-slate-300 rounded text-[11px] bg-white"
                        placeholder="Facilitator"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = editableBooklet.customProgrammeSchedule.filter((_, i) => i !== idx);
                          setEditableBooklet((prev) => ({ ...prev, customProgrammeSchedule: filtered }));
                        }}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Edits update live in both web booklet viewer and printable PDF export.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveBookletChanges}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Graduation Database</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRADUATE DIRECTORY FILTER BAR (Shown above directory or in toolbar) */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs no-print">
        <div className="flex items-center gap-2 w-full md:w-auto flex-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={candidateSearchQuery}
              onChange={(e) => setCandidateSearchQuery(e.target.value)}
              placeholder="Search graduands by name, admission no, program, honors, or country..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-[#002366]"
            />
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
          {/* School Filter */}
          <select
            value={selectedSchoolFilter}
            onChange={(e) => setSelectedSchoolFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 text-xs cursor-pointer"
          >
            {uniqueSchools.map((sch) => (
              <option key={sch} value={sch}>
                {sch === 'All' ? 'All Academic Faculties' : sch}
              </option>
            ))}
          </select>

          {/* Level Filter */}
          <select
            value={selectedLevelFilter}
            onChange={(e) => setSelectedLevelFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 text-xs cursor-pointer"
          >
            {uniqueLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl === 'All' ? 'All Degree Levels' : lvl}
              </option>
            ))}
          </select>

          {/* Clearance Status */}
          <select
            value={clearanceFilter}
            onChange={(e) => setClearanceFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 text-xs cursor-pointer"
          >
            <option value="All">All Registered Candidates</option>
            <option value="ClearedOnly">100% Cleared Candidates Only</option>
            <option value="ConferredOnly">Formally Conferred Graduates Only</option>
          </select>

          {/* Student Photography Layout Mode */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setPhotoLayoutMode('cards')}
              className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                photoLayoutMode === 'cards' ? 'bg-[#002366] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Portrait Cards Grid"
            >
              Portraits
            </button>
            <button
              onClick={() => setPhotoLayoutMode('yearbook')}
              className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                photoLayoutMode === 'yearbook' ? 'bg-[#002366] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Yearbook Bio View"
            >
              Yearbook
            </button>
            <button
              onClick={() => setPhotoLayoutMode('compact')}
              className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                photoLayoutMode === 'compact' ? 'bg-[#002366] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Compact Roll"
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN BOOKLET CONTENT CONTAINER (Both Web Reader & Printable PDF Format) */}
      {/* ========================================================================= */}
      <div
        id="official-graduation-booklet-content"
        className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl overflow-hidden print:border-none print:shadow-none print:rounded-none"
      >
        {/* ========================================================================= */}
        {/* PAGE 1: REGAL OFFICIAL FRONT COVER */}
        {/* ========================================================================= */}
        {(viewMode === 'continuous' || viewMode === 'printPreview' || currentPage === 1) && (
          <div className="page-break avoid-break min-h-[960px] bg-[#001A4D] text-white p-8 sm:p-14 flex flex-col justify-between items-center text-center relative overflow-hidden border-[10px] border-[#C5A059] print:min-h-[1050px] print:p-10">
            {/* Academic subtle watermark */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C5A059_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
            
            {/* Golden Ornamental Corner Filigree Accents */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#C5A059] pointer-events-none" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#C5A059] pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#C5A059] pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#C5A059] pointer-events-none" />

            {/* Top Crest & University Identity */}
            <div className="space-y-4 relative z-10 pt-4">
              <div className="flex justify-center">
                <UniversityLogo size="2xl" withRing className="shadow-2xl border-2 border-[#C5A059]" />
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-4xl font-black font-display tracking-wider text-white uppercase drop-shadow-md">
                  Breakthrough International
                </h1>
                <h2 className="text-xl sm:text-3xl font-extrabold font-display tracking-widest text-[#C5A059] uppercase drop-shadow-md">
                  Bible University
                </h2>
                <div className="text-xs sm:text-sm font-semibold tracking-widest text-slate-300 uppercase mt-1">
                  Chartered & Headquartered in Phoenix, Arizona • United States of America
                </div>
                <div className="text-[11px] font-mono text-[#C5A059] tracking-widest mt-1">
                  Accredited by ICCAS • Global Theological Education Network
                </div>
              </div>
            </div>

            {/* Central Ceremony Announcement Banner */}
            <div className="my-8 space-y-6 max-w-3xl relative z-10">
              <div className="inline-block px-5 py-2 rounded-full bg-[#C5A059]/25 border-2 border-[#C5A059] text-[#C5A059] text-xs font-black uppercase tracking-widest shadow-lg">
                OFFICIAL COMMEMORATIVE CONVOCATION PROGRAMME & BOOKLET
              </div>

              <div className="space-y-3">
                <div className="text-xs sm:text-sm font-mono uppercase tracking-widest text-slate-300">
                  CONFERMENT OF ACADEMIC DEGREES, DIPLOMAS, CERTIFICATES & DOCTORAL HONOURS
                </div>
                <h3 className="text-3xl sm:text-5xl font-black font-display text-white tracking-wide leading-tight drop-shadow-lg">
                  {currentCeremony?.graduationNumber || '15th Annual Congregation'}
                </h3>
                <div className="text-base sm:text-lg font-bold text-[#C5A059] tracking-wider uppercase font-display">
                  Academic Year {editableBooklet.academicYear}
                </div>
              </div>

              {/* Convocation Theme Box */}
              <div className="p-6 rounded-2xl bg-[#001230]/90 border-2 border-[#C5A059] shadow-2xl space-y-2 backdrop-blur-xs">
                <div className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
                  CONVOCATION THEME
                </div>
                <blockquote className="text-lg sm:text-2xl font-bold font-display italic text-white text-balance leading-relaxed">
                  "{editableBooklet.theme}"
                </blockquote>
                <div className="text-[11px] font-mono text-slate-300 tracking-wider">
                  VERITAS ET LUX IN CHRISTO • MATTHEW 28:19-20
                </div>
              </div>
            </div>

            {/* Bottom Venue, Date & Chancellor Banner */}
            <div className="w-full pt-6 border-t-2 border-[#C5A059]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-200 relative z-10">
              <div className="flex items-center gap-2 text-left">
                <Calendar className="w-5 h-5 text-[#C5A059]" />
                <div>
                  <div className="font-bold text-white text-sm">
                    {currentCeremony?.graduationDate || 'October 24, 2026'}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Convocation Time: {currentCeremony?.graduationTime || '09:30 AM (MST)'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-left">
                <MapPin className="w-5 h-5 text-[#C5A059]" />
                <div>
                  <div className="font-bold text-white text-sm">
                    {currentCeremony?.venue || 'Grand Convocation Pavilion & Cathedral'}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {currentCeremony?.city || 'Phoenix'}, {currentCeremony?.country || 'United States'}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-[11px] text-[#C5A059]">
                <div>Edition Serial: {editableBooklet.id}</div>
                <div className="text-slate-300">Certified Official Release</div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 2: TABLE OF CONTENTS & GOVERNING COUNCIL */}
        {/* ========================================================================= */}
        {(viewMode === 'continuous' || viewMode === 'printPreview' || currentPage === 2) && (
          <div className="page-break avoid-break min-h-[960px] p-8 sm:p-14 space-y-8 bg-white border-b-8 border-[#002366] relative">
            <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
              <div className="flex items-center gap-3">
                <UniversityLogo size="sm" withRing />
                <div>
                  <h4 className="text-sm font-bold font-display text-[#002366] uppercase">Breakthrough International Bible University</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Official Convocation Programme • Table of Contents</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#C5A059]">Page 2</span>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002366] uppercase tracking-wide">
                Table of Contents & University Governance
              </h2>
              <div className="w-24 h-1 bg-[#C5A059] mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {/* Table of Contents Column */}
              <div className="space-y-3">
                <div className="text-xs font-black uppercase text-[#002366] tracking-wider border-b border-slate-200 pb-1 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#C5A059]" />
                  <span>Convocation Sections</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700">
                  {[
                    { title: 'Official Convocation Title & Institutional Seal', page: 'Page 1' },
                    { title: 'Table of Contents & Board of Regents', page: 'Page 2' },
                    { title: 'Order of Proceedings & Ceremonial Schedule', page: 'Page 3' },
                    { title: 'University Heritage, Mission, Vision & Accreditation', page: 'Page 4' },
                    { title: 'President & Chancellor’s Convocation Charge', page: 'Page 5' },
                    { title: 'Vice Chancellor’s Academic Report & Address', page: 'Page 6' },
                    { title: 'University Registrar’s Certification Proclamation', page: 'Page 7' },
                    { title: 'Chief Guest & Patriarch Apostolic Keynote Address', page: 'Page 8' },
                    { title: 'Academic Awards, Honors & Valedictorian Spotlight', page: 'Page 9' },
                    { title: `Roll of Graduands & Class Directory (${filteredCandidates.length} Graduands)`, page: 'Page 10+' },
                    { title: 'Alumni Induction Pledge, University Hymn & Recessional', page: 'Back' }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-semibold text-slate-900">{idx + 1}. {item.title}</span>
                      <span className="font-mono text-[#002366] font-bold shrink-0">{item.page}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Board of Regents & University Senate Column */}
              <div className="space-y-3">
                <div className="text-xs font-black uppercase text-[#002366] tracking-wider border-b border-slate-200 pb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>University Governing Council & Board of Regents</span>
                </div>

                <div className="space-y-2 text-xs">
                  {editableBooklet.facultyBoard.map((member, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{member.name}</div>
                        <div className="text-[11px] text-[#002366] font-medium">{member.role}</div>
                        <div className="text-[10px] text-slate-500">{member.departmentOrSchool}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-100 text-amber-900">
                        {member.qualifications}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Official Seal Footer */}
            <div className="pt-6 border-t border-slate-200 text-center text-slate-400 text-[11px] font-mono">
              Breakthrough International Bible University • Phoenix, Arizona USA • Registered Theological University Charter
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 3: ORDER OF PROCEEDINGS & PROGRAMME SCHEDULE */}
        {/* ========================================================================= */}
        {(viewMode === 'continuous' || viewMode === 'printPreview' || currentPage === 3) && (
          <div className="page-break avoid-break min-h-[960px] p-8 sm:p-14 space-y-6 bg-white border-b-8 border-[#002366] relative">
            <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
              <div className="flex items-center gap-3">
                <UniversityLogo size="sm" withRing />
                <div>
                  <h4 className="text-sm font-bold font-display text-[#002366] uppercase">Breakthrough International Bible University</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Order of Convocation Proceedings</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#C5A059]">Page 3</span>
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs font-black uppercase text-[#C5A059] tracking-widest font-mono">Solemn Assembly</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002366] uppercase tracking-wide">
                Order of Convocation Proceedings
              </h2>
              <div className="w-24 h-1 bg-[#C5A059] mx-auto rounded-full" />
              <p className="text-xs text-slate-500">
                Proceedings for the conferment of degrees, diplomas, certificates and honorary doctorates.
              </p>
            </div>

            <div className="pt-2">
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#002366] text-white text-[11px] uppercase font-bold tracking-wider">
                      <th className="py-2.5 px-4 w-12 text-center">#</th>
                      <th className="py-2.5 px-4 w-24">Time</th>
                      <th className="py-2.5 px-4">Ceremonial Order & Event Activity</th>
                      <th className="py-2.5 px-4">Officiating Leader / Marshal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {editableBooklet.customProgrammeSchedule.map((item, idx) => (
                      <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="py-2.5 px-4 text-center font-bold font-mono text-[#002366]">{item.order || idx + 1}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-[#C5A059] whitespace-nowrap">{item.time}</td>
                        <td className="py-2.5 px-4 text-slate-900 font-semibold">{item.activity}</td>
                        <td className="py-2.5 px-4 text-[#002366] font-medium">{item.facilitator}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs flex items-center justify-between text-[#002366]">
              <div className="font-semibold">
                * All guests and candidates are requested to remain standing during the Chancellor’s Procession and the Academic Recessional.
              </div>
              <span className="font-mono text-[10px] text-amber-800 font-bold uppercase">Official Convocation Protocol</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 4: INSTITUTIONAL HERITAGE, MISSION, VISION & ACCREDITATION */}
        {/* ========================================================================= */}
        {(viewMode === 'continuous' || viewMode === 'printPreview' || currentPage === 4) && (
          <div className="page-break avoid-break min-h-[960px] p-8 sm:p-14 space-y-6 bg-white border-b-8 border-[#002366] relative">
            <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
              <div className="flex items-center gap-3">
                <UniversityLogo size="sm" withRing />
                <div>
                  <h4 className="text-sm font-bold font-display text-[#002366] uppercase">Breakthrough International Bible University</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Institutional Profile & Heritage</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#C5A059]">Page 4</span>
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs font-black uppercase text-[#C5A059] tracking-widest font-mono">Heritage & Doctrine</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002366] uppercase tracking-wide">
                Institutional Profile & Accreditation
              </h2>
              <div className="w-24 h-1 bg-[#C5A059] mx-auto rounded-full" />
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              {/* Foundation History */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold font-display text-[#002366] uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#C5A059]" />
                  <span>Founding History & Global Mandate</span>
                </h3>
                <p className="text-slate-800 text-justify">{editableBooklet.universityProfile.history}</p>
              </div>

              {/* Vision & Mission Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2">
                  <h3 className="text-sm font-bold font-display text-[#002366] uppercase tracking-wider">
                    Our Vision
                  </h3>
                  <p className="text-slate-800 italic">{editableBooklet.universityProfile.vision}</p>
                </div>

                <div className="p-5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
                  <h3 className="text-sm font-bold font-display text-[#002366] uppercase tracking-wider">
                    Our Mission
                  </h3>
                  <p className="text-slate-800 italic">{editableBooklet.universityProfile.mission}</p>
                </div>
              </div>

              {/* Core Values */}
              <div className="p-5 rounded-xl bg-white border-2 border-slate-200 space-y-3">
                <h3 className="text-sm font-bold font-display text-[#002366] uppercase tracking-wider">
                  Six Institutional Core Values
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {editableBooklet.universityProfile.coreValues.map((val, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accreditation Certification Statement */}
              <div className="p-4 rounded-xl bg-[#001A4D] text-white space-y-2 border-2 border-[#C5A059]">
                <div className="text-[10px] font-mono text-[#C5A059] uppercase font-bold tracking-widest">
                  INTERNATIONAL ACCREDITATION COMPLIANCE
                </div>
                <div className="text-xs text-slate-200">
                  {editableBooklet.universityProfile.accreditationStatement} All conferred qualifications are logged in our immutable international digital verification registry.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 5: CHANCELLOR'S CONVOCATION CHARGE */}
        {/* ========================================================================= */}
        {(viewMode === 'continuous' || viewMode === 'printPreview' || currentPage === 5) && (
          <div className="page-break avoid-break min-h-[960px] p-8 sm:p-14 space-y-6 bg-white border-b-8 border-[#002366] relative">
            <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
              <div className="flex items-center gap-3">
                <UniversityLogo size="sm" withRing />
                <div>
                  <h4 className="text-sm font-bold font-display text-[#002366] uppercase">Breakthrough International Bible University</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Office of the Chancellor</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#C5A059]">Page 5</span>
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs font-black uppercase text-[#C5A059] tracking-widest font-mono">Presidential Address</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002366] uppercase tracking-wide">
                Chancellor's Convocation Charge
              </h2>
              <div className="w-24 h-1 bg-[#C5A059] mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 items-start">
              {/* Chancellor Photograph & Credentials */}
              <div className="md:col-span-1 space-y-3 text-center">
                <div className="relative mx-auto w-48 h-60 rounded-2xl overflow-hidden border-4 border-[#C5A059] shadow-xl bg-slate-100">
                  {editableBooklet.chancellorMessage.photoUrl ? (
                    <img
                      src={editableBooklet.chancellorMessage.photoUrl}
                      alt={editableBooklet.chancellorMessage.authorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#002366] text-white p-4">
                      <GraduationCap className="w-12 h-12 text-[#C5A059]" />
                      <div className="text-xs font-bold mt-2">Chancellor Photo</div>
                    </div>
                  )}
                  <div className="absolute inset-0 border border-white/20 pointer-events-none rounded-2xl" />
                </div>

                <div>
                  <h3 className="text-base font-bold font-display text-[#002366]">
                    {editableBooklet.chancellorMessage.authorName}
                  </h3>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">
                    {editableBooklet.chancellorMessage.authorTitle}
                  </div>
                </div>

                {/* Signature Box */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Authorized Signature</div>
                  <div className="font-serif italic text-lg text-[#002366] font-bold">
                    {editableBooklet.chancellorMessage.signatureText}
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="md:col-span-2 space-y-4">
                <div className="border-l-4 border-[#C5A059] pl-4 py-1">
                  <h4 className="text-lg font-bold font-display text-[#002366]">
                    "{editableBooklet.chancellorMessage.messageTitle}"
                  </h4>
                  <div className="text-xs text-[#C5A059] font-mono uppercase font-bold">
                    A solemn charge to the Class of {currentCeremony?.graduationYear}
                  </div>
                </div>

                <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed text-justify">
                  {editableBooklet.chancellorMessage.messageContent.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs italic font-serif text-[#002366]">
                  "And the things that thou hast heard of me among many witnesses, the same commit thou to faithful men, who shall be able to teach others also." — 2 Timothy 2:2
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 6: VICE CHANCELLOR'S ADDRESS */}
        {/* ========================================================================= */}
        {(viewMode === 'continuous' || viewMode === 'printPreview' || currentPage === 6) && (
          <div className="page-break avoid-break min-h-[960px] p-8 sm:p-14 space-y-6 bg-white border-b-8 border-[#002366] relative">
            <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
              <div className="flex items-center gap-3">
                <UniversityLogo size="sm" withRing />
                <div>
                  <h4 className="text-sm font-bold font-display text-[#002366] uppercase">Breakthrough International Bible University</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Office of the Vice Chancellor</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#C5A059]">Page 6</span>
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs font-black uppercase text-[#C5A059] tracking-widest font-mono">Academic Report</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002366] uppercase tracking-wide">
                Vice Chancellor's Academic Address
              </h2>
              <div className="w-24 h-1 bg-[#C5A059] mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 items-start">
              {/* VC Photograph & Credentials */}
              <div className="md:col-span-1 space-y-3 text-center">
                <div className="relative mx-auto w-48 h-60 rounded-2xl overflow-hidden border-4 border-[#C5A059] shadow-xl bg-slate-100">
                  {editableBooklet.viceChancellorMessage.photoUrl ? (
                    <img
                      src={editableBooklet.viceChancellorMessage.photoUrl}
                      alt={editableBooklet.viceChancellorMessage.authorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#002366] text-white p-4">
                      <GraduationCap className="w-12 h-12 text-[#C5A059]" />
                      <div className="text-xs font-bold mt-2">Vice Chancellor Photo</div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold font-display text-[#002366]">
                    {editableBooklet.viceChancellorMessage.authorName}
                  </h3>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">
                    {editableBooklet.viceChancellorMessage.authorTitle}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Vice Chancellor Signature</div>
                  <div className="font-serif italic text-lg text-[#002366] font-bold">
                    {editableBooklet.viceChancellorMessage.signatureText}
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="md:col-span-2 space-y-4">
                <div className="border-l-4 border-[#C5A059] pl-4 py-1">
                  <h4 className="text-lg font-bold font-display text-[#002366]">
                    "{editableBooklet.viceChancellorMessage.messageTitle}"
                  </h4>
                  <div className="text-xs text-[#C5A059] font-mono uppercase font-bold">
                    Academic Senate Presentation of the Class of {currentCeremony?.graduationYear}
                  </div>
                </div>

                <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed text-justify">
                  {editableBooklet.viceChancellorMessage.messageContent.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 7: REGISTRAR'S CERTIFICATION PROCLAMATION */}
        {/* ========================================================================= */}
        {(viewMode === 'continuous' || viewMode === 'printPreview' || currentPage === 7) && (
          <div className="page-break avoid-break min-h-[960px] p-8 sm:p-14 space-y-6 bg-white border-b-8 border-[#002366] relative">
            <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
              <div className="flex items-center gap-3">
                <UniversityLogo size="sm" withRing />
                <div>
                  <h4 className="text-sm font-bold font-display text-[#002366] uppercase">Breakthrough International Bible University</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Office of the University Registrar</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#C5A059]">Page 7</span>
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs font-black uppercase text-[#C5A059] tracking-widest font-mono">Official Proclamation</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002366] uppercase tracking-wide">
                Registrar's Certification Statement
              </h2>
              <div className="w-24 h-1 bg-[#C5A059] mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 items-start">
              {/* Registrar Photograph */}
              <div className="md:col-span-1 space-y-3 text-center">
                <div className="relative mx-auto w-48 h-60 rounded-2xl overflow-hidden border-4 border-[#C5A059] shadow-xl bg-slate-100">
                  {editableBooklet.registrarMessage.photoUrl ? (
                    <img
                      src={editableBooklet.registrarMessage.photoUrl}
                      alt={editableBooklet.registrarMessage.authorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#002366] text-white p-4">
                      <GraduationCap className="w-12 h-12 text-[#C5A059]" />
                      <div className="text-xs font-bold mt-2">Registrar Photo</div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold font-display text-[#002366]">
                    {editableBooklet.registrarMessage.authorName}
                  </h3>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">
                    {editableBooklet.registrarMessage.authorTitle}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Registrar Official Seal</div>
                  <div className="font-serif italic text-lg text-[#002366] font-bold">
                    {editableBooklet.registrarMessage.signatureText}
                  </div>
                </div>
              </div>

              {/* Statement */}
              <div className="md:col-span-2 space-y-4">
                <div className="border-l-4 border-[#C5A059] pl-4 py-1">
                  <h4 className="text-lg font-bold font-display text-[#002366]">
                    "{editableBooklet.registrarMessage.messageTitle}"
                  </h4>
                  <div className="text-xs text-[#C5A059] font-mono uppercase font-bold">
                    Official Degree Conferment Verification Notice
                  </div>
                </div>

                <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed text-justify">
                  {editableBooklet.registrarMessage.messageContent.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-mono">
                  <div className="text-[#002366] font-bold">REGISTRY INTEGRITY VERIFICATION:</div>
                  <div className="text-slate-600">
                    Graduation Credentials Portal: https://bibu-edu.org/verify
                  </div>
                  <div className="text-slate-600">
                    International Academic Registry Registry Authority: ICCAS / GTEN Global Ledger
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 8: CHIEF GUEST / KEYNOTE ADDRESS */}
        {/* ========================================================================= */}
        {(viewMode === 'continuous' || viewMode === 'printPreview' || currentPage === 8) && (
          <div className="page-break avoid-break min-h-[960px] p-8 sm:p-14 space-y-6 bg-white border-b-8 border-[#002366] relative">
            <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
              <div className="flex items-center gap-3">
                <UniversityLogo size="sm" withRing />
                <div>
                  <h4 className="text-sm font-bold font-display text-[#002366] uppercase">Breakthrough International Bible University</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Convocation Keynote Address</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#C5A059]">Page 8</span>
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs font-black uppercase text-[#C5A059] tracking-widest font-mono">Keynote Address</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002366] uppercase tracking-wide">
                Chief Guest Ministerial Charge
              </h2>
              <div className="w-24 h-1 bg-[#C5A059] mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 items-start">
              {/* Chief Guest Photograph */}
              <div className="md:col-span-1 space-y-3 text-center">
                <div className="relative mx-auto w-48 h-60 rounded-2xl overflow-hidden border-4 border-[#C5A059] shadow-xl bg-slate-100">
                  {keynoteMessage.photoUrl ? (
                    <img
                      src={keynoteMessage.photoUrl}
                      alt={keynoteMessage.authorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#002366] text-white p-4">
                      <Users className="w-12 h-12 text-[#C5A059]" />
                      <div className="text-xs font-bold mt-2">Chief Guest</div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold font-display text-[#002366]">
                    {keynoteMessage.authorName}
                  </h3>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">
                    {keynoteMessage.authorTitle}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Keynote Endorsement</div>
                  <div className="font-serif italic text-lg text-[#002366] font-bold">
                    {keynoteMessage.signatureText}
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="md:col-span-2 space-y-4">
                <div className="border-l-4 border-[#C5A059] pl-4 py-1">
                  <h4 className="text-lg font-bold font-display text-[#002366]">
                    "{keynoteMessage.messageTitle}"
                  </h4>
                  <div className="text-xs text-[#C5A059] font-mono uppercase font-bold">
                    Convocation Address to the Graduating Ministers
                  </div>
                </div>

                <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed text-justify">
                  {keynoteMessage.messageContent.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 9: ACADEMIC AWARDS, HONORS & VALEDICTORIAN SPOTLIGHT */}
        {/* ========================================================================= */}
        {(viewMode === 'continuous' || viewMode === 'printPreview' || currentPage === 9) && (
          <div className="page-break avoid-break min-h-[960px] p-8 sm:p-14 space-y-6 bg-white border-b-8 border-[#002366] relative">
            <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
              <div className="flex items-center gap-3">
                <UniversityLogo size="sm" withRing />
                <div>
                  <h4 className="text-sm font-bold font-display text-[#002366] uppercase">Breakthrough International Bible University</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Academic Honors & Valedictorian Citations</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#C5A059]">Page 9</span>
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs font-black uppercase text-[#C5A059] tracking-widest font-mono">Scholastic Distinction</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002366] uppercase tracking-wide">
                Special Academic Awards & Valedictorian
              </h2>
              <div className="w-24 h-1 bg-[#C5A059] mx-auto rounded-full" />
              <p className="text-xs text-slate-500">
                Conferred by the Chancellor & Academic Senate for exceptional scholarship, servant leadership, and Christian character.
              </p>
            </div>

            {/* Awards Grid with Student Photography */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {ceremonyAwards.map((award) => {
                // Find matching candidate for photo
                const cand = ceremonyCandidates.find(
                  (c) => c.id === award.candidateId || c.fullName.toLowerCase() === award.studentName.toLowerCase()
                );

                return (
                  <div
                    key={award.id}
                    className="p-4 rounded-xl border-2 border-[#C5A059]/40 bg-gradient-to-br from-amber-50/40 via-white to-white shadow-xs space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Candidate Photo / Monogram */}
                      <div className="w-16 h-20 rounded-xl overflow-hidden border-2 border-[#C5A059] shrink-0 bg-slate-100 relative shadow-sm">
                        {cand?.profilePhoto ? (
                          <img
                            src={cand.profilePhoto}
                            alt={award.studentName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#002366] text-[#C5A059] font-display font-bold text-sm">
                            {award.studentName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-[#002366] border border-amber-300">
                            {award.awardCategory}
                          </span>
                        </div>
                        <h4 className="text-base font-bold font-display text-[#002366] mt-0.5 truncate">
                          {award.awardTitle}
                        </h4>
                        <div className="font-bold text-slate-900 text-xs truncate">
                          {award.studentName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {award.programName}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 italic leading-relaxed">
                      "{award.citation}"
                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 font-mono">
                      <span>Presented by: {award.presentedBy}</span>
                      <span className="text-amber-800 font-bold">Senate Confirmed</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 10+: GRADUATING CLASS DIRECTORY & STUDENT PHOTOGRAPHY */}
        {/* ========================================================================= */}
        {(viewMode === 'continuous' || viewMode === 'printPreview' || currentPage === 10) && (
          <div className="page-break min-h-[960px] p-8 sm:p-14 space-y-8 bg-white border-b-8 border-[#002366] relative">
            <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-3">
              <div className="flex items-center gap-3">
                <UniversityLogo size="sm" withRing />
                <div>
                  <h4 className="text-sm font-bold font-display text-[#002366] uppercase">Breakthrough International Bible University</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Official Roster of Graduands & Conferred Class</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#C5A059]">Page 10</span>
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs font-black uppercase text-[#C5A059] tracking-widest font-mono">Conferment of Degrees & Diplomas</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002366] uppercase tracking-wide">
                Roll of Graduands & Class Directory
              </h2>
              <div className="w-24 h-1 bg-[#C5A059] mx-auto rounded-full" />
              <p className="text-xs text-slate-500">
                Arranged by Faculty, Academic School, and Qualification Level.
              </p>
            </div>

            {/* DIRECTORY CONTENT GROUPED BY FACULTY & LEVEL */}
            <div className="space-y-8">
              {Object.keys(groupedCandidatesBySchool).map((schoolName) => {
                const schoolLevels = groupedCandidatesBySchool[schoolName];

                return (
                  <div key={schoolName} className="space-y-4 avoid-break">
                    {/* Faculty Banner */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#001A4D] to-[#002366] text-white flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <GraduationCap className="w-5 h-5 text-[#C5A059]" />
                        <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
                          {schoolName}
                        </h3>
                      </div>
                      <span className="text-xs text-[#C5A059] font-mono font-bold">
                        {Object.values(schoolLevels).reduce((acc: number, curr: GraduationCandidate[]) => acc + curr.length, 0)} Candidates
                      </span>
                    </div>

                    {/* Groups by Award Level */}
                    {Object.keys(schoolLevels).map((level) => {
                      const levelCandidates = schoolLevels[level];

                      return (
                        <div key={level} className="space-y-3 pl-2">
                          <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                            <h4 className="text-xs font-black font-display text-[#002366] uppercase tracking-wider">
                              Award Level: {level}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono font-semibold">
                              ({levelCandidates.length} Graduands)
                            </span>
                          </div>

                          {/* LAYOUT OPTION 1: PORTRAIT CARDS GRID */}
                          {photoLayoutMode === 'cards' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                              {levelCandidates.map((cand) => (
                                <div
                                  key={cand.id}
                                  onClick={() => {
                                    setInspectCandidate(cand);
                                    setPhotoEditUrl(cand.profilePhoto || '');
                                  }}
                                  className="p-3.5 rounded-xl border border-slate-200 hover:border-[#002366] bg-white shadow-xs hover:shadow-md transition-all flex items-start gap-3 relative cursor-pointer avoid-break group"
                                >
                                  {/* Student Photograph */}
                                  <div className="w-16 h-20 rounded-xl overflow-hidden border-2 border-slate-200 group-hover:border-[#C5A059] shrink-0 bg-slate-100 relative shadow-xs">
                                    {cand.profilePhoto ? (
                                      <img
                                        src={cand.profilePhoto}
                                        alt={cand.fullName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#002366] text-[#C5A059] font-display font-bold text-sm">
                                        <span>{cand.firstName?.[0] || cand.fullName[0]}</span>
                                        <span>{cand.lastName?.[0] || ''}</span>
                                      </div>
                                    )}

                                    {cand.academicHonors && (
                                      <div className="absolute bottom-0 inset-x-0 bg-[#002366]/90 text-[8px] text-[#C5A059] font-bold text-center py-0.5 tracking-tight truncate px-0.5">
                                        {cand.academicHonors.includes('Cum Laude') ? 'Cum Laude' : 'Honors'}
                                      </div>
                                    )}
                                  </div>

                                  {/* Student Details */}
                                  <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center gap-1">
                                      <span className="text-[10px] font-mono text-[#002366] font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                                        {cand.bookletNumber || cand.studentId}
                                      </span>
                                      {cand.country && (
                                        <span className="text-[10px] text-slate-500 font-semibold truncate">
                                          • {cand.city ? `${cand.city}, ` : ''}{cand.country}
                                        </span>
                                      )}
                                    </div>

                                    <div className="font-bold text-slate-900 text-xs truncate group-hover:text-[#002366]">
                                      {cand.fullName}
                                    </div>

                                    <div className="text-[11px] text-[#002366] font-medium leading-tight line-clamp-2">
                                      {cand.programName}
                                    </div>

                                    {cand.academicAchievement && cand.academicAchievement !== cand.programName && (
                                      <div className="text-[10px] text-slate-600 line-clamp-1">
                                        {cand.academicAchievement}
                                      </div>
                                    )}

                                    {cand.institution && (
                                      <div className="text-[10px] text-indigo-700 font-medium truncate">
                                        {cand.institution}
                                      </div>
                                    )}

                                    {cand.specialization && (
                                      <div className="text-[10px] text-slate-500 italic truncate">
                                        Spec: {cand.specialization}
                                      </div>
                                    )}

                                    {cand.academicHonors && (
                                      <div className="text-[10px] text-amber-700 font-bold truncate">
                                        ★ {cand.academicHonors}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* LAYOUT OPTION 2: YEARBOOK BIO VIEW */}
                          {photoLayoutMode === 'yearbook' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {levelCandidates.map((cand) => (
                                <div
                                  key={cand.id}
                                  onClick={() => {
                                    setInspectCandidate(cand);
                                    setPhotoEditUrl(cand.profilePhoto || '');
                                  }}
                                  className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex items-start gap-4 cursor-pointer hover:border-[#002366] transition-all avoid-break"
                                >
                                  <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-[#C5A059] shrink-0 bg-slate-100">
                                    {cand.profilePhoto ? (
                                      <img
                                        src={cand.profilePhoto}
                                        alt={cand.fullName}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#002366] text-[#C5A059] font-display font-bold text-base">
                                        {cand.fullName.slice(0, 2).toUpperCase()}
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0 space-y-1 text-xs">
                                    <div className="font-bold text-slate-900 text-sm">{cand.fullName}</div>
                                    <div className="text-[#002366] font-semibold">{cand.programName}</div>
                                    {cand.academicAchievement && cand.academicAchievement !== cand.programName && (
                                      <div className="text-[11px] text-slate-600 font-medium">
                                        Award: {cand.academicAchievement}
                                      </div>
                                    )}
                                    {cand.institution && (
                                      <div className="text-[11px] text-indigo-700 font-medium">
                                        Institution: {cand.institution}
                                      </div>
                                    )}
                                    <div className="text-[11px] text-slate-500 font-mono">
                                      Reg: {cand.admissionNumber || cand.studentId} • {cand.country}
                                    </div>
                                    {cand.academicHonors && (
                                      <div className="text-[11px] font-bold text-amber-700">
                                        Distinction: {cand.academicHonors}
                                      </div>
                                    )}
                                    {cand.biography && (
                                      <div className="text-[11px] text-slate-600 line-clamp-2 italic pt-1 border-t border-slate-100">
                                        "{cand.biography}"
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* LAYOUT OPTION 3: COMPACT ROLL WITH AVATARS */}
                          {photoLayoutMode === 'compact' && (
                            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                                    <th className="py-2.5 px-3 w-10">Photo</th>
                                    <th className="py-2.5 px-3">Graduate Full Name</th>
                                    <th className="py-2.5 px-3">Student Reg.</th>
                                    <th className="py-2.5 px-3">Degree Programme / Award</th>
                                    <th className="py-2.5 px-3">Institution</th>
                                    <th className="py-2.5 px-3">Honors / Standing</th>
                                    <th className="py-2.5 px-3">Country</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium">
                                  {levelCandidates.map((cand) => (
                                    <tr
                                      key={cand.id}
                                      onClick={() => {
                                        setInspectCandidate(cand);
                                        setPhotoEditUrl(cand.profilePhoto || '');
                                      }}
                                      className="hover:bg-slate-50 cursor-pointer"
                                    >
                                      <td className="py-2 px-3">
                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                                          {cand.profilePhoto ? (
                                            <img src={cand.profilePhoto} alt="" className="w-full h-full object-cover" />
                                          ) : (
                                            <div className="w-full h-full bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold text-[10px]">
                                              {cand.fullName[0]}
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                      <td className="py-2 px-3 font-bold text-slate-900">{cand.fullName}</td>
                                      <td className="py-2 px-3 font-mono text-slate-500">{cand.admissionNumber || cand.studentId}</td>
                                      <td className="py-2 px-3 text-[#002366]">
                                        <div>{cand.programName}</div>
                                        {cand.academicAchievement && cand.academicAchievement !== cand.programName && (
                                          <div className="text-[10px] text-slate-500">{cand.academicAchievement}</div>
                                        )}
                                      </td>
                                      <td className="py-2 px-3 text-indigo-700 text-[11px] font-medium">{cand.institution || 'BIBU Main'}</td>
                                      <td className="py-2 px-3 font-semibold text-amber-700">{cand.academicHonors || 'Conferred'}</td>
                                      <td className="py-2 px-3 text-slate-600">{cand.country}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {filteredCandidates.length === 0 && (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <GraduationCap className="w-10 h-10 mx-auto text-slate-300" />
                  <div className="font-bold text-slate-600">No graduands match the active filters.</div>
                  <div className="text-xs">Adjust search keywords or school/level filters above.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 11: CONVOCATION HYMNS, BENEDICTION & BACK COVER */}
        {/* ========================================================================= */}
        {(viewMode === 'continuous' || viewMode === 'printPreview' || currentPage === 11) && (
          <div className="page-break avoid-break min-h-[960px] bg-[#001A4D] text-white p-8 sm:p-14 flex flex-col justify-between items-center text-center relative overflow-hidden border-[10px] border-[#C5A059]">
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C5A059_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

            {/* Top Emblem */}
            <div className="space-y-3 relative z-10 pt-4">
              <div className="flex justify-center">
                <UniversityLogo size="xl" withRing className="border-2 border-[#C5A059]" />
              </div>
              <h2 className="text-2xl font-bold font-display uppercase tracking-widest text-[#C5A059]">
                The University Hymn & Commissioning
              </h2>
              <div className="text-xs font-mono text-slate-300 uppercase">
                Solemn Benediction of the Class of {currentCeremony?.graduationYear}
              </div>
            </div>

            {/* Hymn Lyrics */}
            <div className="my-6 max-w-xl text-center space-y-4 relative z-10 bg-[#001230]/80 p-6 rounded-2xl border border-[#C5A059]/60 backdrop-blur-xs">
              <div className="text-xs font-black uppercase text-[#C5A059] tracking-widest">
                "ALL HAIL THE POWER OF JESUS' NAME"
              </div>
              <div className="text-xs sm:text-sm font-serif italic text-slate-200 leading-relaxed space-y-3">
                <p>
                  All hail the power of Jesus' name! Let angels prostrate fall;<br />
                  Bring forth the royal diadem, and crown Him Lord of all.<br />
                  Bring forth the royal diadem, and crown Him Lord of all!
                </p>
                <p>
                  Let every kindred, every tribe on this terrestrial ball,<br />
                  To Him all majesty ascribe, and crown Him Lord of all.<br />
                  To Him all majesty ascribe, and crown Him Lord of all!
                </p>
              </div>
            </div>

            {/* Commissioning Prayer & Alumni Induction */}
            <div className="max-w-xl space-y-2 text-xs text-slate-300 relative z-10">
              <div className="font-bold text-[#C5A059] uppercase tracking-wider">
                MINISTERIAL COMMISSIONING APOSTOLIC BLESSING
              </div>
              <p className="text-justify leading-relaxed">
                "The Lord bless you and keep you; The Lord make His face shine upon you, and be gracious unto you; The Lord lift up His countenance upon you, and give you peace." (Numbers 6:24-26).
              </p>
            </div>

            {/* Back Cover Verification & Contact Footer */}
            <div className="w-full pt-6 border-t-2 border-[#C5A059]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300 relative z-10">
              <div className="text-left space-y-0.5">
                <div className="font-bold text-white uppercase font-display">Breakthrough International Bible University</div>
                <div className="text-[11px] text-[#C5A059]">Headquarters: Phoenix, Arizona • United States of America</div>
                <div className="text-[10px] text-slate-400 font-mono">Website: https://bibu-edu.org • Registry: verify@bibu-edu.org</div>
              </div>

              <div className="text-right space-y-0.5 font-mono text-[11px]">
                <div className="text-[#C5A059] font-bold">DIGITAL CREDENTIAL VERIFIED</div>
                <div className="text-slate-400">ICCAS Certified • ISBN / Registry Logged</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CANDIDATE PHOTOGRAPHY & BIO MODAL */}
      {/* ========================================================================= */}
      {inspectCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-5 h-5 text-[#002366]" />
                <div>
                  <h3 className="text-base font-bold font-display text-[#002366]">Graduand Profile & Photography</h3>
                  <p className="text-xs text-slate-500">Official candidate yearbook entry</p>
                </div>
              </div>
              <button
                onClick={() => setInspectCandidate(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-start gap-4">
              {/* Photo Display */}
              <div className="w-28 h-36 rounded-xl overflow-hidden border-2 border-[#C5A059] shrink-0 bg-slate-100 shadow-md">
                {inspectCandidate.profilePhoto ? (
                  <img
                    src={inspectCandidate.profilePhoto}
                    alt={inspectCandidate.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#002366] text-[#C5A059] font-display font-bold text-xl">
                    {inspectCandidate.fullName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Candidate Info */}
              <div className="space-y-1.5 text-xs flex-1">
                <div className="font-bold text-slate-900 text-base">{inspectCandidate.fullName}</div>
                <div className="text-[#002366] font-semibold">{inspectCandidate.programName}</div>
                {inspectCandidate.academicAchievement && inspectCandidate.academicAchievement !== inspectCandidate.programName && (
                  <div className="text-slate-700 font-medium">Award: {inspectCandidate.academicAchievement}</div>
                )}
                {inspectCandidate.institution && (
                  <div className="text-indigo-700 font-medium">Institution: {inspectCandidate.institution}</div>
                )}
                <div className="text-slate-500">{inspectCandidate.schoolName}</div>
                <div className="font-mono text-slate-600 text-[11px]">
                  Reg No: <strong>{inspectCandidate.admissionNumber || inspectCandidate.studentId}</strong>
                </div>
                <div className="text-slate-600">
                  Country: <strong>{inspectCandidate.city ? `${inspectCandidate.city}, ` : ''}{inspectCandidate.country}</strong>
                </div>
                {inspectCandidate.academicHonors && (
                  <div className="text-amber-800 font-bold">
                    Honors: ★ {inspectCandidate.academicHonors}
                  </div>
                )}
                {inspectCandidate.certificateNumber && (
                  <div className="font-mono text-[11px] text-emerald-700 font-bold">
                    Certificate: {inspectCandidate.certificateNumber}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Photo URL Update Tool */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#002366]" />
                <span>Update Student Photography URL</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={photoEditUrl}
                  onChange={(e) => setPhotoEditUrl(e.target.value)}
                  placeholder="Paste student image URL (e.g. Unsplash or direct link)..."
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                />
                <button
                  type="button"
                  onClick={handleSaveCandidatePhoto}
                  className="px-3 py-1.5 bg-[#002366] text-white rounded-lg font-bold text-xs hover:bg-[#001A4D] cursor-pointer"
                >
                  Save Photo
                </button>
              </div>
              <div className="text-[10px] text-slate-400">
                Updating will persist the new student photo into the graduation database immediately.
              </div>
            </div>

            {inspectCandidate.biography && (
              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-700 uppercase text-[10px]">Ministry Calling & Biography:</div>
                <p className="text-slate-600 italic bg-amber-50/40 p-3 rounded-xl border border-amber-200/60 leading-relaxed">
                  "{inspectCandidate.biography}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
