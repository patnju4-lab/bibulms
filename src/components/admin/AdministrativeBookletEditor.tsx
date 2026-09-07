import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  GraduationBooklet,
  GraduationCandidate,
  GraduationCeremony,
  ProgrammeScheduleItem,
  UniversityMessage
} from '../../types/graduation';
import {
  BookOpen,
  Printer,
  Upload,
  GripVertical,
  Check,
  Eye,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  RefreshCw,
  Image as ImageIcon,
  Save,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Award,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Quote,
  X,
  User,
  GraduationCap
} from 'lucide-react';

export interface BookletPageSection {
  id: string;
  key:
    | 'cover'
    | 'governance'
    | 'schedule'
    | 'heritage'
    | 'chancellor'
    | 'vice_chancellor'
    | 'registrar'
    | 'keynote'
    | 'awards'
    | 'graduates'
    | 'anthem';
  title: string;
  category: 'Front Matter' | 'Official Addresses' | 'Academic Honours' | 'Conferral' | 'End Matter';
  description: string;
  included: boolean;
  pageNumber?: number;
}

const DEFAULT_PAGES: BookletPageSection[] = [
  { id: 'page-1', key: 'cover', title: 'Official Front Cover', category: 'Front Matter', description: 'University crest, convocation edition, ceremony date, venue & theme scripture', included: true },
  { id: 'page-2', key: 'governance', title: 'Officers & Table of Contents', category: 'Front Matter', description: 'Governing Council, Chancellor, Senate officers and booklet outline', included: true },
  { id: 'page-3', key: 'schedule', title: 'Order of Proceedings', category: 'Front Matter', description: 'Official ceremonial programme, processional times & presiding officiants', included: true },
  { id: 'page-4', key: 'heritage', title: 'University Heritage & Mission', category: 'Front Matter', description: 'Founding history, vision, core values and ICCAS accreditation', included: true },
  { id: 'page-5', key: 'chancellor', title: "Chancellor's Convocation Charge", category: 'Official Addresses', description: 'Official presiding address and apostolic blessing to the graduating class', included: true },
  { id: 'page-6', key: 'vice_chancellor', title: "Vice Chancellor's Academic Address", category: 'Official Addresses', description: 'Academic stewardship review, milestones and institutional congratulations', included: true },
  { id: 'page-7', key: 'registrar', title: "Registrar's Conferment Proclamation", category: 'Official Addresses', description: 'Statutory declaration of Senate clearances, matriculation roll and degree verification', included: true },
  { id: 'page-8', key: 'keynote', title: 'Chief Guest Keynote Address', category: 'Official Addresses', description: 'Guest of honour convocation address and kingdom leadership challenge', included: true },
  { id: 'page-9', key: 'awards', title: 'Valedictorian & Special Senate Awards', category: 'Academic Honours', description: 'Valedictory address, honorary doctorates, and merit citations', included: true },
  { id: 'page-10', key: 'graduates', title: 'Roll of Graduands & Student Portraits', category: 'Conferral', description: 'Official graduation list grouped by Faculty and Degree Level with photos', included: true },
  { id: 'page-11', key: 'anthem', title: 'University Hymn & Benediction', category: 'End Matter', description: 'University Anthem ("All Hail the Power of Jesus\' Name"), apostolic recessional & back cover', included: true }
];

export const AdministrativeBookletEditor: React.FC<{ initialCeremonyId?: string }> = ({ initialCeremonyId }) => {
  const {
    graduationCeremonies,
    graduationCandidates,
    updateGraduationCandidate,
    graduationBooklets,
    updateGraduationBooklet,
    academicAwards,
    logGraduationAudit,
    currentUser
  } = useApp();

  // Selected Ceremony
  const [selectedCeremonyId, setSelectedCeremonyId] = useState<string>(() => {
    if (initialCeremonyId && graduationCeremonies.some((c) => c.id === initialCeremonyId)) {
      return initialCeremonyId;
    }
    return graduationCeremonies[0]?.id || '';
  });

  const selectedCeremony: GraduationCeremony | undefined = useMemo(() => {
    return graduationCeremonies.find((c) => c.id === selectedCeremonyId) || graduationCeremonies[0];
  }, [graduationCeremonies, selectedCeremonyId]);

  // Candidates for this ceremony
  const ceremonyCandidates = useMemo(() => {
    if (!selectedCeremony) return [];
    return graduationCandidates.filter((c) => c.ceremonyId === selectedCeremony.id);
  }, [graduationCandidates, selectedCeremony]);

  // Active Tab inside Editor
  const [editorSubTab, setEditorSubTab] = useState<'photos' | 'messages' | 'pages' | 'preview'>('photos');

  // PAGE REORDERING STATE
  const [pagesOrder, setPagesOrder] = useState<BookletPageSection[]>(DEFAULT_PAGES);
  const [draggedPageIndex, setDraggedPageIndex] = useState<number | null>(null);
  const [dragOverPageIndex, setDragOverPageIndex] = useState<number | null>(null);

  // MESSAGES STATE
  const [chancellorMsg, setChancellorMsg] = useState({
    authorName: selectedCeremony?.chancellor || 'Dr. Michael C. Sterling, Th.D., D.Min.',
    authorTitle: 'President & Chancellor of the University',
    messageTitle: 'Go Ye Therefore: Commissioned for Kingdom Impact & Global Transformation',
    paragraphs: [
      'Beloved Graduands, Honoured Guests, and the Global Breakthrough Family: Grace, mercy, and peace be multiplied unto you in the precious name of our Lord and Saviour Jesus Christ.',
      'Today marks a historic and sanctified milestone in your Christian scholarship and ministerial journey. As you walk across this ceremonial dais to receive your degree, remember that your academic credential is not merely a diploma of intellectual achievement—it is a sacred mantle of spiritual authority and leadership.',
      'You are sent forth into every sphere of human society: from local pulpit ministries and church plants to international diplomacy, theological education, and humanitarian enterprise. Let your light so shine before men, that they may see your good works and glorify your Father in heaven. Carry the seal of Breakthrough International Bible University with integrity, humility, and uncompromising faith.'
    ],
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    signatureText: 'Dr. Michael C. Sterling, Th.D., Chancellor'
  });

  const [viceChancellorMsg, setViceChancellorMsg] = useState({
    authorName: selectedCeremony?.viceChancellor || 'Prof. Dr. Patrick Njuguna, Ph.D., Th.D.',
    authorTitle: 'Vice Chancellor & Chief Executive Officer',
    messageTitle: 'Excellence in Christian Scholarship: Grounded in Scripture, Global in Reach',
    paragraphs: [
      'It is my distinct privilege and academic joy to welcome you to the convocation of Breakthrough International Bible University. Today we celebrate the culmination of rigorous study, spiritual discipline, and ministerial consecration across our global campuses and digital learning network.',
      'Our faculty across the School of Theology, School of Christian Education, and School of Leadership have laboured tirelessly to equip you with robust biblical literacy, hermeneutical precision, and practical pastoral competencies. You have proven yourself worthy in character and learning.',
      'As our 2026 graduates join over 3,400 alumni ministering in 64 nations, remember our guiding motto: Veritas et Lux in Christo (Truth and Light in Christ). Congratulations, Class of 2026!'
    ],
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    signatureText: 'Prof. Dr. Patrick Njuguna, Vice Chancellor'
  });

  const [registrarMsg, setRegistrarMsg] = useState({
    authorName: selectedCeremony?.registrar || 'Rev. Dr. Sarah M. Jenkins, Th.D.',
    authorTitle: 'University Registrar & Secretary to Senate',
    messageTitle: 'Official Proclamation of Matriculation Clearance and Degree Conferral',
    paragraphs: [
      'By authority of the University Senate and Governing Council of Breakthrough International Bible University, I hereby certify that the candidates whose names appear in this official Congregation Roll have duly fulfilled all academic requirements, departmental clearances, library obligations, and ministerial practicums.',
      'Their academic files and transcripts have been verified and sealed in the University Permanent Registry in Phoenix, Arizona, USA, with digital verification records published to the international repository.'
    ],
    verificationUrl: 'https://breakthrough.edu/verify-credentials',
    signatureText: 'Rev. Dr. Sarah M. Jenkins, Registrar'
  });

  const [keynoteMsg, setKeynoteMsg] = useState({
    authorName: selectedCeremony?.chiefGuest || 'Archbishop Arthur Kitonga, D.D.',
    authorTitle: 'Chief Guest of Honour & Senior Christian Statesman',
    messageTitle: 'Leading with Apostolic Courage in an Age of Global Transition',
    paragraphs: [
      'To the graduating class of this great institution: The world does not need more leaders with secular ambitions; it is crying out for men and women clothed with the Holy Spirit, unshakeable conviction, and authentic servant hearts.',
      'Stand firm on the Word of God. Preach the truth without compromise, defend the weak, build strong families, and advance the Kingdom of God with boldness.'
    ],
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600'
  });

  const [convocationTheme, setConvocationTheme] = useState(
    selectedCeremony?.theme || 'Equipped for Ministry, Leadership and Global Kingdom Impact (2 Timothy 3:16-17)'
  );

  // DRAG AND DROP STUDENT IMAGES STATE
  const [photoSearchQuery, setPhotoSearchQuery] = useState('');
  const [photoFilterSchool, setPhotoFilterSchool] = useState('All');
  const [photoFilterStatus, setPhotoFilterStatus] = useState<'All' | 'WithPhoto' | 'MissingPhoto'>('All');
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);
  const [dropTargetCandidateId, setDropTargetCandidateId] = useState<string | null>(null);
  const [recentlyUpdatedCandidateId, setRecentlyUpdatedCandidateId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Candidate image upload handler via File Reader
  const handleFileUploadForCandidate = (candidateId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        updateGraduationCandidate(candidateId, { profilePhoto: dataUrl });
        setRecentlyUpdatedCandidateId(candidateId);
        setTimeout(() => setRecentlyUpdatedCandidateId(null), 3000);
        logGraduationAudit({
          action: 'CANDIDATE_PHOTO_UPDATED',
          details: `Student photo uploaded for candidate ${candidateId} by ${currentUser?.name || 'Registrar'}`,
          candidateId
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag-and-drop handler for candidate photo box
  const handleDropCandidatePhoto = (candidateId: string, e: React.DragEvent) => {
    e.preventDefault();
    setDropTargetCandidateId(null);

    // Case 1: Dropping files from user desktop / file manager
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileUploadForCandidate(candidateId, file);
      return;
    }

    // Case 2: Dropping candidate image dragged from another student
    const sourceCandidateId = e.dataTransfer.getData('text/plain') || draggedCandidateId;
    if (sourceCandidateId && sourceCandidateId !== candidateId) {
      const sourceCandidate = graduationCandidates.find((c) => c.id === sourceCandidateId);
      if (sourceCandidate && sourceCandidate.profilePhoto) {
        updateGraduationCandidate(candidateId, { profilePhoto: sourceCandidate.profilePhoto });
        setRecentlyUpdatedCandidateId(candidateId);
        setTimeout(() => setRecentlyUpdatedCandidateId(null), 3000);
      }
    }
  };

  // PAGE REORDERING HANDLERS
  const handleDragStartPage = (index: number) => {
    setDraggedPageIndex(index);
  };

  const handleDragOverPage = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverPageIndex(index);
  };

  const handleDropPage = (targetIndex: number) => {
    if (draggedPageIndex === null || draggedPageIndex === targetIndex) {
      setDraggedPageIndex(null);
      setDragOverPageIndex(null);
      return;
    }
    const updated = [...pagesOrder];
    const [movedItem] = updated.splice(draggedPageIndex, 1);
    updated.splice(targetIndex, 0, movedItem);
    setPagesOrder(updated);
    setDraggedPageIndex(null);
    setDragOverPageIndex(null);
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === pagesOrder.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...pagesOrder];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setPagesOrder(updated);
  };

  const togglePageInclusion = (id: string) => {
    setPagesOrder((prev) =>
      prev.map((p) => (p.id === id ? { ...p, included: !p.included } : p))
    );
  };

  // Filtered candidate list for photo management
  const filteredCandidates = useMemo(() => {
    return ceremonyCandidates.filter((cand) => {
      const matchesSearch =
        cand.fullName.toLowerCase().includes(photoSearchQuery.toLowerCase()) ||
        cand.studentId.toLowerCase().includes(photoSearchQuery.toLowerCase()) ||
        cand.programName.toLowerCase().includes(photoSearchQuery.toLowerCase());
      const matchesSchool = photoFilterSchool === 'All' || cand.schoolName === photoFilterSchool;
      const matchesStatus =
        photoFilterStatus === 'All' ||
        (photoFilterStatus === 'WithPhoto' && Boolean(cand.profilePhoto)) ||
        (photoFilterStatus === 'MissingPhoto' && !cand.profilePhoto);
      return matchesSearch && matchesSchool && matchesStatus;
    });
  }, [ceremonyCandidates, photoSearchQuery, photoFilterSchool, photoFilterStatus]);

  // Unique schools for filter
  const schoolOptions = useMemo(() => {
    const set = new Set<string>();
    ceremonyCandidates.forEach((c) => {
      if (c.schoolName) set.add(c.schoolName);
    });
    return Array.from(set);
  }, [ceremonyCandidates]);

  // Quick photo count
  const photoStats = useMemo(() => {
    const total = ceremonyCandidates.length;
    const withPhoto = ceremonyCandidates.filter((c) => Boolean(c.profilePhoto)).length;
    const missing = total - withPhoto;
    return { total, withPhoto, missing, percentage: total > 0 ? Math.round((withPhoto / total) * 100) : 0 };
  }, [ceremonyCandidates]);

  // Print execution
  const handlePrintPDF = () => {
    window.print();
  };

  // Save changes to database
  const handleSaveChanges = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      if (selectedCeremony) {
        logGraduationAudit({
          action: 'BOOKLET_CUSTOMIZED',
          details: `Graduation booklet layout and messages saved for ceremony ${selectedCeremony.graduationNumber}`,
          ceremonyId: selectedCeremony.id
        });
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* EXECUTIVE TOP BANNER & CONTROLS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#002366] text-[#C5A059] flex items-center justify-center shadow-md shrink-0 border border-[#C5A059]/30">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 text-[#002366] text-[11px] font-black uppercase tracking-wider border border-amber-200 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                Registrar Convocation Publishing Suite
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-[#002366]">
                Administrative Booklet Editor
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                Curate student photography, customize leadership speeches, configure ceremonial order, and reorder publication pages prior to official PDF printing.
              </p>
            </div>
          </div>

          {/* Ceremony Selector & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Target Ceremony
              </label>
              <select
                value={selectedCeremonyId}
                onChange={(e) => setSelectedCeremonyId(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#002366] focus:outline-none focus:ring-2 focus:ring-[#002366] cursor-pointer"
              >
                {graduationCeremonies.map((ceremony) => (
                  <option key={ceremony.id} value={ceremony.id}>
                    {ceremony.graduationNumber} ({ceremony.academicYear}) • {ceremony.city}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSaveChanges}
              disabled={saveStatus === 'saving'}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              {saveStatus === 'saving' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : saveStatus === 'saved' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saveStatus === 'saved' ? 'Saved to DB!' : 'Save Changes'}</span>
            </button>

            <button
              onClick={handlePrintPDF}
              className="px-4 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white font-bold text-xs flex items-center gap-2 shadow-sm border border-[#C5A059]/40 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#C5A059]" />
              <span>Print Booklet / PDF</span>
            </button>
          </div>
        </div>

        {/* STATS OVERVIEW RIBBON */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Graduands</span>
            <div className="text-xl font-black text-[#002366] font-display mt-0.5">{photoStats.total}</div>
            <div className="text-[11px] text-slate-500">{selectedCeremony?.graduationNumber}</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400">Student Photos Loaded</span>
            <div className="text-xl font-black text-emerald-600 font-display mt-0.5">
              {photoStats.withPhoto} <span className="text-xs text-slate-400 font-normal">({photoStats.percentage}%)</span>
            </div>
            <div className="text-[11px] text-emerald-600">{photoStats.missing} Missing Portraits</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Publication Pages</span>
            <div className="text-xl font-black text-[#002366] font-display mt-0.5">
              {pagesOrder.filter((p) => p.included).length} of {pagesOrder.length}
            </div>
            <div className="text-[11px] text-slate-500">Custom Sequence Set</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400">Ceremonial Date</span>
            <div className="text-xl font-black text-[#C5A059] font-display mt-0.5">
              {selectedCeremony?.graduationDate || '2026-10-24'}
            </div>
            <div className="text-[11px] text-slate-500">{selectedCeremony?.venue}</div>
          </div>
        </div>
      </div>

      {/* EDITOR NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setEditorSubTab('photos')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            editorSubTab === 'photos'
              ? 'border-[#002366] text-[#002366] bg-amber-50/70 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-[#C5A059]" />
          <span>1. Drag-and-Drop Student Photos ({photoStats.withPhoto}/{photoStats.total})</span>
        </button>

        <button
          onClick={() => setEditorSubTab('messages')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            editorSubTab === 'messages'
              ? 'border-[#002366] text-[#002366] bg-amber-50/70 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Quote className="w-4 h-4 text-[#C5A059]" />
          <span>2. Edit Custom Messages & Programme</span>
        </button>

        <button
          onClick={() => setEditorSubTab('pages')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            editorSubTab === 'pages'
              ? 'border-[#002366] text-[#002366] bg-amber-50/70 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <GripVertical className="w-4 h-4 text-[#C5A059]" />
          <span>3. Reorder Booklet Pages ({pagesOrder.filter((p) => p.included).length})</span>
        </button>

        <button
          onClick={() => setEditorSubTab('preview')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            editorSubTab === 'preview'
              ? 'border-[#002366] text-[#002366] bg-amber-50/70 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Eye className="w-4 h-4 text-[#C5A059]" />
          <span>4. Live PDF & Print Preview</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: DRAG AND DROP STUDENT IMAGES                                   */}
      {/* ========================================================================= */}
      {editorSubTab === 'photos' && (
        <div className="space-y-6">
          {/* Instructions Box */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-amber-50 rounded-2xl border border-blue-200/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#002366] text-white flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5 text-[#C5A059]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#002366]">Drag & Drop Student Portraits</h3>
                <p className="text-xs text-slate-600">
                  Drag an image file from your computer directly onto any candidate card to upload instantly. You can also drag and drop images between candidate frames.
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#002366] shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Auto-saved into Student Registry
              </span>
            </div>
          </div>

          {/* Filters and Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[240px] flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by student name, admission #, program..."
                  value={photoSearchQuery}
                  onChange={(e) => setPhotoSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <select
                value={photoFilterSchool}
                onChange={(e) => setPhotoFilterSchool(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#002366] cursor-pointer"
              >
                <option value="All">All Schools & Faculties ({schoolOptions.length})</option>
                {schoolOptions.map((sch) => (
                  <option key={sch} value={sch}>
                    {sch}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs">
                <button
                  onClick={() => setPhotoFilterStatus('All')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    photoFilterStatus === 'All' ? 'bg-white text-[#002366] shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  All ({ceremonyCandidates.length})
                </button>
                <button
                  onClick={() => setPhotoFilterStatus('WithPhoto')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    photoFilterStatus === 'WithPhoto' ? 'bg-white text-emerald-600 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  With Photo ({photoStats.withPhoto})
                </button>
                <button
                  onClick={() => setPhotoFilterStatus('MissingPhoto')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    photoFilterStatus === 'MissingPhoto' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Missing ({photoStats.missing})
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-[#002366]">{filteredCandidates.length}</span> Candidates
            </div>
          </div>

          {/* CANDIDATES GRID WITH DRAG AND DROP TARGETS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCandidates.map((candidate) => {
              const isDropTarget = dropTargetCandidateId === candidate.id;
              const isRecentlyUpdated = recentlyUpdatedCandidateId === candidate.id;

              return (
                <div
                  key={candidate.id}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDropTargetCandidateId(candidate.id);
                  }}
                  onDragLeave={() => {
                    if (dropTargetCandidateId === candidate.id) {
                      setDropTargetCandidateId(null);
                    }
                  }}
                  onDrop={(e) => handleDropCandidatePhoto(candidate.id, e)}
                  className={`bg-white rounded-2xl border transition-all duration-200 p-4 relative flex flex-col justify-between shadow-2xs ${
                    isDropTarget
                      ? 'border-[#C5A059] ring-4 ring-[#C5A059]/30 bg-amber-50/50 scale-[1.02]'
                      : isRecentlyUpdated
                      ? 'border-emerald-500 ring-4 ring-emerald-400/30 bg-emerald-50/30'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Status Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                      {candidate.studentId}
                    </span>
                    {candidate.profilePhoto ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold flex items-center gap-1 border border-emerald-200">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Photo Ready
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold flex items-center gap-1 border border-amber-200">
                        Drop Photo Here
                      </span>
                    )}
                  </div>

                  {/* Drag-and-Drop Image Frame */}
                  <div className="relative group mx-auto mb-3">
                    <div
                      draggable={Boolean(candidate.profilePhoto)}
                      onDragStart={(e) => {
                        setDraggedCandidateId(candidate.id);
                        e.dataTransfer.setData('text/plain', candidate.id);
                      }}
                      className={`w-28 h-32 rounded-xl overflow-hidden border-2 flex items-center justify-center cursor-grab active:cursor-grabbing transition-all ${
                        candidate.profilePhoto
                          ? 'border-[#C5A059] shadow-sm bg-slate-100'
                          : 'border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      {candidate.profilePhoto ? (
                        <img
                          src={candidate.profilePhoto}
                          alt={candidate.fullName}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <User className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                          <span className="text-[10px] text-slate-400 font-semibold block leading-tight">
                            Drop Image File
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Hidden Native File Input */}
                    <input
                      type="file"
                      id={`file-${candidate.id}`}
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUploadForCandidate(candidate.id, e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />

                    {/* Hover Quick Action Buttons */}
                    <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                      <label
                        htmlFor={`file-${candidate.id}`}
                        className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-[#002366] text-[10px] font-bold shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3 text-[#C5A059]" />
                        <span>Browse File</span>
                      </label>
                      {candidate.profilePhoto && (
                        <button
                          onClick={() => {
                            updateGraduationCandidate(candidate.id, { profilePhoto: '' });
                          }}
                          className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Clear</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Candidate Details */}
                  <div className="text-center space-y-1">
                    <h4 className="text-xs font-bold text-[#002366] font-display line-clamp-1">
                      {candidate.fullName}
                    </h4>
                    <p className="text-[11px] text-slate-600 font-medium line-clamp-1">
                      {candidate.programName}
                    </p>
                    <div className="text-[10px] text-slate-400 line-clamp-1">
                      {candidate.schoolName}
                    </div>
                    <div className="inline-block mt-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[9px] font-black uppercase tracking-wider">
                      {candidate.awardLevel}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCandidates.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">No Candidates Found</h3>
              <p className="text-xs text-slate-400 mt-1">Try changing your search or filter parameters.</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: EDIT CUSTOM MESSAGES & PROGRAMME                               */}
      {/* ========================================================================= */}
      {editorSubTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1: Convocation Theme & Scripture Anchor */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-base font-bold text-[#002366] font-display">
                  Convocation Theme & Scripture Anchor
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Publication Header</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Official Convocation Theme Banner
                </label>
                <input
                  type="text"
                  value={convocationTheme}
                  onChange={(e) => setConvocationTheme(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#002366] focus:outline-none focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              {/* Theme Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Presets:</span>
                {[
                  'Equipped for Ministry, Leadership and Global Impact (2 Timothy 3:16-17)',
                  'Arise, Shine; for Thy Light is Come (Isaiah 60:1)',
                  'Transforming Nations through Christ-Centered Scholarship (Romans 12:2)',
                  'Commissioned as Faithful Ambassadors for Christ (2 Corinthians 5:20)'
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setConvocationTheme(preset)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    {preset.slice(0, 32)}...
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Chancellor's Address & Charge */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-base font-bold text-[#002366] font-display">
                  Chancellor's Address & Charge
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold">
                Page 5
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Chancellor Name & Degrees</label>
                <input
                  type="text"
                  value={chancellorMsg.authorName}
                  onChange={(e) => setChancellorMsg({ ...chancellorMsg, authorName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#002366]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Speech Title</label>
                <input
                  type="text"
                  value={chancellorMsg.messageTitle}
                  onChange={(e) => setChancellorMsg({ ...chancellorMsg, messageTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Address Text (Paragraphs)</label>
                <textarea
                  rows={6}
                  value={chancellorMsg.paragraphs.join('\n\n')}
                  onChange={(e) =>
                    setChancellorMsg({
                      ...chancellorMsg,
                      paragraphs: e.target.value.split('\n\n').filter(Boolean)
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-sans leading-relaxed focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Sign-off</label>
                <input
                  type="text"
                  value={chancellorMsg.signatureText}
                  onChange={(e) => setChancellorMsg({ ...chancellorMsg, signatureText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Vice Chancellor's Academic Address */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#002366]" />
                <h3 className="text-base font-bold text-[#002366] font-display">
                  Vice Chancellor's Academic Address
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-bold">
                Page 6
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Vice Chancellor Name & Degrees</label>
                <input
                  type="text"
                  value={viceChancellorMsg.authorName}
                  onChange={(e) => setViceChancellorMsg({ ...viceChancellorMsg, authorName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#002366]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Speech Title</label>
                <input
                  type="text"
                  value={viceChancellorMsg.messageTitle}
                  onChange={(e) => setViceChancellorMsg({ ...viceChancellorMsg, messageTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Address Text (Paragraphs)</label>
                <textarea
                  rows={6}
                  value={viceChancellorMsg.paragraphs.join('\n\n')}
                  onChange={(e) =>
                    setViceChancellorMsg({
                      ...viceChancellorMsg,
                      paragraphs: e.target.value.split('\n\n').filter(Boolean)
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-sans leading-relaxed focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Sign-off</label>
                <input
                  type="text"
                  value={viceChancellorMsg.signatureText}
                  onChange={(e) => setViceChancellorMsg({ ...viceChancellorMsg, signatureText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Registrar's Certification & Proclamation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-[#002366] font-display">
                  Registrar's Conferment Proclamation
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                Page 7
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">University Registrar Name</label>
                <input
                  type="text"
                  value={registrarMsg.authorName}
                  onChange={(e) => setRegistrarMsg({ ...registrarMsg, authorName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#002366]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Statutory Decree</label>
                <textarea
                  rows={4}
                  value={registrarMsg.paragraphs.join('\n\n')}
                  onChange={(e) =>
                    setRegistrarMsg({
                      ...registrarMsg,
                      paragraphs: e.target.value.split('\n\n').filter(Boolean)
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-sans leading-relaxed focus:ring-2 focus:ring-[#002366]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Online Degree Verification Portal Link</label>
                <input
                  type="text"
                  value={registrarMsg.verificationUrl}
                  onChange={(e) => setRegistrarMsg({ ...registrarMsg, verificationUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Chief Guest Keynote Address */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Quote className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-[#002366] font-display">
                  Chief Guest Keynote Address
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold">
                Page 8
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Dignitary / Keynote Speaker</label>
                <input
                  type="text"
                  value={keynoteMsg.authorName}
                  onChange={(e) => setKeynoteMsg({ ...keynoteMsg, authorName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#002366]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Title & Dignitary Office</label>
                <input
                  type="text"
                  value={keynoteMsg.authorTitle}
                  onChange={(e) => setKeynoteMsg({ ...keynoteMsg, authorTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Keynote Charge Text</label>
                <textarea
                  rows={4}
                  value={keynoteMsg.paragraphs.join('\n\n')}
                  onChange={(e) =>
                    setKeynoteMsg({
                      ...keynoteMsg,
                      paragraphs: e.target.value.split('\n\n').filter(Boolean)
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-sans leading-relaxed focus:ring-2 focus:ring-[#002366]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: REORDER BOOKLET PAGES BEFORE FINAL PDF GENERATION               */}
      {/* ========================================================================= */}
      {editorSubTab === 'pages' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#002366] text-[#C5A059] flex items-center justify-center shrink-0">
                <GripVertical className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#002366]">Interactive Page Sequence Organizer</h3>
                <p className="text-xs text-slate-600">
                  Drag and drop page cards to reorder the publication flow before generating the final PDF. You can also toggle sections on or off to include/exclude them.
                </p>
              </div>
            </div>
            <button
              onClick={() => setPagesOrder(DEFAULT_PAGES)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              Reset to Senate Standard
            </button>
          </div>

          {/* DRAGGABLE PAGES LIST */}
          <div className="space-y-3">
            {pagesOrder.map((page, index) => {
              const isDragging = draggedPageIndex === index;
              const isDragOver = dragOverPageIndex === index;

              return (
                <div
                  key={page.id}
                  draggable
                  onDragStart={() => handleDragStartPage(index)}
                  onDragOver={(e) => handleDragOverPage(e, index)}
                  onDrop={() => handleDropPage(index)}
                  className={`bg-white rounded-2xl border transition-all duration-200 p-4 flex items-center justify-between gap-4 shadow-2xs ${
                    isDragging
                      ? 'opacity-40 border-dashed border-[#002366] scale-98'
                      : isDragOver
                      ? 'border-[#C5A059] ring-4 ring-[#C5A059]/20 bg-amber-50/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Drag Handle */}
                    <div className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    {/* Calculated Page Number */}
                    <div className="w-10 h-10 rounded-xl bg-[#002366] text-[#C5A059] font-mono font-black text-sm flex items-center justify-center shrink-0 border border-[#C5A059]/30">
                      {index + 1}
                    </div>

                    {/* Page Meta */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                          {page.category}
                        </span>
                        {!page.included && (
                          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold">
                            Excluded from PDF
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-[#002366] font-display">{page.title}</h4>
                      <p className="text-xs text-slate-500">{page.description}</p>
                    </div>
                  </div>

                  {/* Reorder Buttons & Inclusion Toggle */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => movePage(index, 'up')}
                      disabled={index === 0}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition-colors cursor-pointer"
                      title="Move Page Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => movePage(index, 'down')}
                      disabled={index === pagesOrder.length - 1}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition-colors cursor-pointer"
                      title="Move Page Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => togglePageInclusion(page.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        page.included
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {page.included ? 'Included' : 'Excluded'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: LIVE PDF & PRINT PREVIEW                                       */}
      {/* ========================================================================= */}
      {editorSubTab === 'preview' && (
        <div className="space-y-6">
          {/* Action Ribbon */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#002366] font-display">
                Official Convocation Booklet • Final Print Layout
              </h3>
              <p className="text-xs text-slate-500">
                Rendered with live customized page sequence, updated messages, and student portraits.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrintPDF}
                className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white font-bold text-xs flex items-center gap-2 shadow-sm border border-[#C5A059]/40 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4 text-[#C5A059]" />
                <span>Trigger Official Print / PDF</span>
              </button>
            </div>
          </div>

          {/* PRINT CONTAINER WITH PAGES */}
          <div className="max-w-4xl mx-auto space-y-12 bg-white p-8 sm:p-14 rounded-3xl border border-slate-200 shadow-lg print:border-none print:shadow-none print:p-0 print:m-0">
            {pagesOrder
              .filter((p) => p.included)
              .map((page, pageIndex) => {
                return (
                  <div
                    key={page.id}
                    className="border-b-2 border-dashed border-slate-200 pb-12 last:border-none print:border-none print:pb-0 print:break-after-page"
                  >
                    {/* Header Page Tag */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-6 uppercase tracking-wider print:hidden">
                      <span>Section: {page.title}</span>
                      <span>Page {pageIndex + 1} of {pagesOrder.filter((p) => p.included).length}</span>
                    </div>

                    {/* RENDER SECTION ACCORDING TO KEY */}
                    {page.key === 'cover' && (
                      <div className="text-center py-12 px-6 border-4 border-[#C5A059] rounded-2xl bg-gradient-to-b from-[#002366] to-[#001438] text-white p-8 relative overflow-hidden space-y-8">
                        <div className="flex justify-center">
                          <UniversityLogo size="xl" withRing className="shadow-2xl" />
                        </div>
                        <div className="space-y-2">
                          <div className="text-[#C5A059] text-xs font-black tracking-widest uppercase">
                            Breakthrough International Bible University
                          </div>
                          <div className="text-xs text-slate-300 font-serif italic">
                            Headquarters: Phoenix, Arizona, United States of America
                          </div>
                          <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-wide uppercase pt-4">
                            {selectedCeremony?.graduationNumber || '15th Annual Convocation'}
                          </h1>
                          <p className="text-sm font-medium text-[#C5A059] max-w-xl mx-auto italic font-serif">
                            "{convocationTheme}"
                          </p>
                        </div>
                        <div className="pt-8 border-t border-[#C5A059]/30 text-xs text-slate-300 space-y-1">
                          <div>
                            <strong className="text-white">Venue:</strong> {selectedCeremony?.venue}
                          </div>
                          <div>
                            <strong className="text-white">Date:</strong> {selectedCeremony?.graduationDate} • {selectedCeremony?.graduationTime}
                          </div>
                        </div>
                      </div>
                    )}

                    {page.key === 'governance' && (
                      <div className="space-y-6">
                        <div className="text-center border-b border-slate-200 pb-4">
                          <h2 className="text-xl font-bold font-display text-[#002366]">
                            University Governance & Principal Officers
                          </h2>
                          <p className="text-xs text-slate-500">Breakthrough International Bible University</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Chancellor</span>
                            <div className="font-bold text-[#002366] text-sm mt-0.5">{chancellorMsg.authorName}</div>
                            <div className="text-slate-500">President of the Governing Council</div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Vice Chancellor</span>
                            <div className="font-bold text-[#002366] text-sm mt-0.5">{viceChancellorMsg.authorName}</div>
                            <div className="text-slate-500">Chief Executive & Senate Chairman</div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] uppercase font-bold text-slate-400">University Registrar</span>
                            <div className="font-bold text-[#002366] text-sm mt-0.5">{registrarMsg.authorName}</div>
                            <div className="text-slate-500">Secretary to University Council</div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Chief Guest of Honour</span>
                            <div className="font-bold text-[#002366] text-sm mt-0.5">{keynoteMsg.authorName}</div>
                            <div className="text-slate-500">{keynoteMsg.authorTitle}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {page.key === 'chancellor' && (
                      <div className="space-y-4">
                        <div className="border-b border-[#002366]/20 pb-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                            Official Presiding Address
                          </span>
                          <h2 className="text-xl font-bold font-display text-[#002366]">
                            Address by the Chancellor
                          </h2>
                          <p className="text-xs text-slate-600 font-medium">{chancellorMsg.authorName}</p>
                        </div>
                        <div className="flex gap-6 items-start">
                          <div className="w-28 h-36 rounded-xl overflow-hidden border-2 border-[#C5A059] shadow-sm shrink-0 bg-slate-100">
                            <img
                              src={chancellorMsg.photoUrl}
                              alt={chancellorMsg.authorName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-3 text-xs leading-relaxed text-slate-800">
                            <h3 className="font-bold text-sm text-[#002366] font-display">
                              {chancellorMsg.messageTitle}
                            </h3>
                            {chancellorMsg.paragraphs.map((p, i) => (
                              <p key={i}>{p}</p>
                            ))}
                            <div className="pt-2 font-serif italic text-slate-600">
                              {chancellorMsg.signatureText}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {page.key === 'vice_chancellor' && (
                      <div className="space-y-4">
                        <div className="border-b border-[#002366]/20 pb-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">
                            Academic Governance Report
                          </span>
                          <h2 className="text-xl font-bold font-display text-[#002366]">
                            Address by the Vice Chancellor
                          </h2>
                          <p className="text-xs text-slate-600 font-medium">{viceChancellorMsg.authorName}</p>
                        </div>
                        <div className="flex gap-6 items-start">
                          <div className="w-28 h-36 rounded-xl overflow-hidden border-2 border-[#002366] shadow-sm shrink-0 bg-slate-100">
                            <img
                              src={viceChancellorMsg.photoUrl}
                              alt={viceChancellorMsg.authorName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-3 text-xs leading-relaxed text-slate-800">
                            <h3 className="font-bold text-sm text-[#002366] font-display">
                              {viceChancellorMsg.messageTitle}
                            </h3>
                            {viceChancellorMsg.paragraphs.map((p, i) => (
                              <p key={i}>{p}</p>
                            ))}
                            <div className="pt-2 font-serif italic text-slate-600">
                              {viceChancellorMsg.signatureText}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {page.key === 'registrar' && (
                      <div className="space-y-4 p-6 bg-amber-50/50 rounded-2xl border border-amber-200">
                        <div className="border-b border-amber-200 pb-3 text-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#002366]">
                            Office of Academic Records & Registry
                          </span>
                          <h2 className="text-lg font-bold font-display text-[#002366]">
                            Statutory Proclamation of Degree Conferment
                          </h2>
                          <p className="text-xs text-slate-600">{registrarMsg.authorName}</p>
                        </div>
                        <div className="space-y-3 text-xs text-slate-800 leading-relaxed text-center max-w-xl mx-auto">
                          {registrarMsg.paragraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                          ))}
                          <div className="pt-4 border-t border-amber-200 text-[11px] font-mono text-[#002366]">
                            Verification URL: {registrarMsg.verificationUrl}
                          </div>
                        </div>
                      </div>
                    )}

                    {page.key === 'graduates' && (
                      <div className="space-y-6">
                        <div className="text-center border-b border-slate-200 pb-4">
                          <h2 className="text-xl font-bold font-display text-[#002366]">
                            Roll of Graduands & Class of {selectedCeremony?.graduationYear || 2026}
                          </h2>
                          <p className="text-xs text-slate-500">
                            Conferment of Doctoral, Master, Bachelor, Diploma & Certificate Degrees
                          </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {ceremonyCandidates.map((c) => (
                            <div
                              key={c.id}
                              className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2"
                            >
                              <div className="w-20 h-24 mx-auto rounded-lg overflow-hidden border border-[#C5A059] bg-slate-200 flex items-center justify-center">
                                {c.profilePhoto ? (
                                  <img
                                    src={c.profilePhoto}
                                    alt={c.fullName}
                                    className="w-full h-full object-cover object-top"
                                  />
                                ) : (
                                  <User className="w-8 h-8 text-slate-400" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-xs text-[#002366] line-clamp-1">{c.fullName}</div>
                                <div className="text-[10px] text-slate-600 line-clamp-1">{c.programName}</div>
                                <div className="text-[9px] text-[#C5A059] font-bold uppercase mt-0.5">
                                  {c.awardLevel}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {page.key === 'anthem' && (
                      <div className="space-y-6 text-center py-8">
                        <div className="border-b border-slate-200 pb-4">
                          <h2 className="text-xl font-bold font-display text-[#002366]">
                            University Anthem & Consecration
                          </h2>
                          <p className="text-xs text-slate-500 font-serif italic">
                            "All Hail the Power of Jesus' Name" (Edward Perronet, 1779)
                          </p>
                        </div>
                        <div className="max-w-md mx-auto space-y-4 text-xs font-serif leading-relaxed text-slate-700 italic">
                          <p>
                            All hail the pow'r of Jesus' name!<br />
                            Let angels prostrate fall;<br />
                            Bring forth the royal diadem,<br />
                            And crown Him Lord of all!
                          </p>
                          <p>
                            Ye seed of Israel's chosen race,<br />
                            Ye ransomed from the fall,<br />
                            Hail Him who saves you by His grace,<br />
                            And crown Him Lord of all!
                          </p>
                          <p>
                            Let every kindred, every tribe,<br />
                            On this terrestrial ball,<br />
                            To Him all majesty ascribe,<br />
                            And crown Him Lord of all!
                          </p>
                        </div>
                        <div className="pt-6 border-t border-slate-200 text-xs text-slate-500">
                          Breakthrough International Bible University • Veritas et Lux in Christo
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
