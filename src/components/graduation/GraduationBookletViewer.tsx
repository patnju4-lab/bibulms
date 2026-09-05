import React, { useState, useMemo } from 'react';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  GraduationBooklet,
  GraduationCandidate,
  GraduationCeremony,
  AcademicAwardWinner
} from '../../types/graduation';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Printer,
  Download,
  Search,
  Award,
  Scroll,
  Users,
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Bookmark,
  ExternalLink
} from 'lucide-react';

interface GraduationBookletViewerProps {
  booklet: GraduationBooklet;
  ceremony?: GraduationCeremony;
  candidates: GraduationCandidate[];
  onSelectCandidate?: (candidate: GraduationCandidate) => void;
}

export const GraduationBookletViewer: React.FC<GraduationBookletViewerProps> = ({
  booklet,
  ceremony,
  candidates,
  onSelectCandidate
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [candidateSearchQuery, setCandidateSearchQuery] = useState('');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('All');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('All');
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Group candidates for the directory
  const ceremonyCandidates = useMemo(() => {
    return candidates.filter(
      (c) => c.ceremonyId === booklet.ceremonyId || c.graduationYear === Number(booklet.academicYear.split('/')[1] || 2026)
    );
  }, [candidates, booklet.ceremonyId, booklet.academicYear]);

  const filteredCandidates = useMemo(() => {
    return ceremonyCandidates.filter((c) => {
      const matchSearch =
        candidateSearchQuery === '' ||
        c.fullName.toLowerCase().includes(candidateSearchQuery.toLowerCase()) ||
        c.programName.toLowerCase().includes(candidateSearchQuery.toLowerCase()) ||
        c.studentId.toLowerCase().includes(candidateSearchQuery.toLowerCase()) ||
        c.schoolName.toLowerCase().includes(candidateSearchQuery.toLowerCase());

      const matchSchool = selectedSchoolFilter === 'All' || c.schoolName === selectedSchoolFilter;
      const matchLevel = selectedLevelFilter === 'All' || c.awardLevel === selectedLevelFilter;

      return matchSearch && matchSchool && matchLevel;
    });
  }, [ceremonyCandidates, candidateSearchQuery, selectedSchoolFilter, selectedLevelFilter]);

  // Unique schools and award levels for filtering
  const availableSchools = useMemo(() => {
    const set = new Set(ceremonyCandidates.map((c) => c.schoolName));
    return ['All', ...Array.from(set)];
  }, [ceremonyCandidates]);

  const availableLevels = useMemo(() => {
    const set = new Set(ceremonyCandidates.map((c) => c.awardLevel));
    return ['All', ...Array.from(set)];
  }, [ceremonyCandidates]);

  // Total pages calculation:
  // 1: Cover
  // 2: Messages
  // 3: University Profile & Faculty Board
  // 4: Graduation Programme Schedule
  // 5: Graduating Class Directory
  // 6: Academic Awards & Valedictorian
  const totalPages = 6;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`space-y-6 ${isFullScreen ? 'fixed inset-0 z-50 bg-[#F8F9FB] p-6 overflow-y-auto' : ''}`}>
      {/* Top Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#002366] text-[#C5A059]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-display text-[#002366]">{booklet.title}</h2>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="font-semibold text-[#C5A059]">{booklet.edition}</span>
              <span>•</span>
              <span>Academic Year {booklet.academicYear}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Page Tabs */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs">
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                currentPage === 1 ? 'bg-[#002366] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cover
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                currentPage === 2 ? 'bg-[#002366] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                currentPage === 3 ? 'bg-[#002366] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Profile & Faculty
            </button>
            <button
              onClick={() => setCurrentPage(4)}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                currentPage === 4 ? 'bg-[#002366] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Programme
            </button>
            <button
              onClick={() => setCurrentPage(5)}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                currentPage === 5 ? 'bg-[#002366] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Graduates ({ceremonyCandidates.length})
            </button>
            <button
              onClick={() => setCurrentPage(6)}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                currentPage === 6 ? 'bg-[#002366] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Awards
            </button>
          </div>

          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            className="p-2 text-slate-600 hover:text-[#002366] hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Print Booklet / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Booklet Page Display */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden min-h-[750px] relative">
        {/* PAGE 1: COVER PAGE */}
        {currentPage === 1 && (
          <div className="min-h-[820px] bg-gradient-to-br from-[#001A4D] via-[#002366] to-[#001230] text-white p-8 sm:p-16 flex flex-col justify-between items-center text-center relative overflow-hidden border-8 border-[#C5A059]/80">
            {/* Subtle academic background watermark */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:20px_20px]" />

            {/* Top Crest & Institution Heading */}
            <div className="space-y-4 relative z-10">
              <div className="flex justify-center">
                <UniversityLogo size="xl" withRing className="shadow-2xl border-2 border-[#C5A059]" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-wider text-white uppercase">
                  Breakthrough International
                </h1>
                <h2 className="text-xl sm:text-3xl font-extrabold font-display tracking-widest text-[#C5A059] uppercase">
                  Bible University
                </h2>
                <div className="text-xs sm:text-sm font-semibold tracking-widest text-slate-300 uppercase mt-1">
                  Phoenix, Arizona • United States of America
                </div>
              </div>
            </div>

            {/* Central Ceremony Announcement Banner */}
            <div className="my-10 space-y-6 max-w-2xl relative z-10">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059] text-[#C5A059] text-xs font-black uppercase tracking-widest">
                OFFICIAL COMMEMORATIVE CONVOCATION PROGRAMME
              </div>

              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-widest text-slate-300">
                  conferment of degrees, diplomas & doctoral honours
                </div>
                <h3 className="text-3xl sm:text-5xl font-black font-display text-white tracking-wide leading-tight">
                  {ceremony?.graduationNumber || '15th Annual Congregation'}
                </h3>
                <div className="text-sm sm:text-base font-bold text-[#C5A059] uppercase tracking-wider">
                  Academic Year {booklet.academicYear}
                </div>
              </div>

              {/* Graduation Theme Card */}
              <div className="p-6 rounded-2xl bg-[#001438]/80 border-2 border-[#C5A059]/60 shadow-xl space-y-2 backdrop-blur-sm">
                <div className="text-[11px] font-black uppercase tracking-widest text-[#C5A059]">
                  CONVOCATION THEME
                </div>
                <div className="text-base sm:text-xl font-bold font-display italic text-white text-balance">
                  "{booklet.theme}"
                </div>
              </div>
            </div>

            {/* Bottom Venue, Date & Chancellor Sign-off */}
            <div className="w-full pt-8 border-t border-[#C5A059]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300 relative z-10">
              <div className="flex items-center gap-2 text-left">
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <div>
                  <div className="font-bold text-white">Date: {ceremony?.graduationDate || 'October 24, 2026'}</div>
                  <div className="text-[11px]">Time: {ceremony?.graduationTime || '09:30 AM (MST)'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-left">
                <MapPin className="w-4 h-4 text-[#C5A059]" />
                <div>
                  <div className="font-bold text-white">{ceremony?.venue || 'Grand Convocation Pavilion'}</div>
                  <div className="text-[11px]">
                    {ceremony?.city || 'Phoenix'}, {ceremony?.country || 'USA'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Governing Seal</div>
                <div className="text-[11px] font-bold text-[#C5A059]">Office of the Registrar</div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: UNIVERSITY MESSAGES */}
        {currentPage === 2 && (
          <div className="p-8 sm:p-12 space-y-10">
            {/* Page Header */}
            <div className="border-b-2 border-[#C5A059] pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase text-[#C5A059]">Section II</span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002366]">
                  Messages from University Leadership
                </h2>
              </div>
              <UniversityLogo size="sm" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chancellor Message */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 shadow-xs">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={booklet.chancellorMessage.photoUrl}
                      alt={booklet.chancellorMessage.authorName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#C5A059] shadow-sm"
                    />
                    <div>
                      <h4 className="text-sm font-bold font-display text-[#002366]">
                        {booklet.chancellorMessage.authorName}
                      </h4>
                      <p className="text-[11px] font-semibold text-[#C5A059]">
                        {booklet.chancellorMessage.authorTitle}
                      </p>
                    </div>
                  </div>

                  <h5 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-2 italic">
                    "{booklet.chancellorMessage.messageTitle}"
                  </h5>

                  <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                    {booklet.chancellorMessage.messageContent.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 text-right">
                  <div className="font-serif italic text-sm text-[#002366] font-bold">
                    {booklet.chancellorMessage.signatureText}
                  </div>
                  <div className="text-[10px] text-slate-400">Chancellor, BIBU</div>
                </div>
              </div>

              {/* Vice Chancellor Message */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 shadow-xs">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={booklet.viceChancellorMessage.photoUrl}
                      alt={booklet.viceChancellorMessage.authorName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#002366] shadow-sm"
                    />
                    <div>
                      <h4 className="text-sm font-bold font-display text-[#002366]">
                        {booklet.viceChancellorMessage.authorName}
                      </h4>
                      <p className="text-[11px] font-semibold text-blue-900">
                        {booklet.viceChancellorMessage.authorTitle}
                      </p>
                    </div>
                  </div>

                  <h5 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-2 italic">
                    "{booklet.viceChancellorMessage.messageTitle}"
                  </h5>

                  <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                    {booklet.viceChancellorMessage.messageContent.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 text-right">
                  <div className="font-serif italic text-sm text-[#002366] font-bold">
                    {booklet.viceChancellorMessage.signatureText}
                  </div>
                  <div className="text-[10px] text-slate-400">Vice Chancellor & Chief Academic Officer</div>
                </div>
              </div>

              {/* Registrar Message */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 shadow-xs">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={booklet.registrarMessage.photoUrl}
                      alt={booklet.registrarMessage.authorName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#C5A059] shadow-sm"
                    />
                    <div>
                      <h4 className="text-sm font-bold font-display text-[#002366]">
                        {booklet.registrarMessage.authorName}
                      </h4>
                      <p className="text-[11px] font-semibold text-[#C5A059]">
                        {booklet.registrarMessage.authorTitle}
                      </p>
                    </div>
                  </div>

                  <h5 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-2 italic">
                    "{booklet.registrarMessage.messageTitle}"
                  </h5>

                  <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                    {booklet.registrarMessage.messageContent.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 text-right">
                  <div className="font-serif italic text-sm text-[#002366] font-bold">
                    {booklet.registrarMessage.signatureText}
                  </div>
                  <div className="text-[10px] text-slate-400">University Registrar</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 3: UNIVERSITY PROFILE & FACULTY BOARD */}
        {currentPage === 3 && (
          <div className="p-8 sm:p-12 space-y-8">
            <div className="border-b-2 border-[#C5A059] pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase text-[#C5A059]">Section III</span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002366]">
                  University Profile & Academic Governing Faculty
                </h2>
              </div>
              <UniversityLogo size="sm" />
            </div>

            {/* Profile Grid: History, Vision, Mission, Core Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                <div className="text-xs font-bold text-[#002366] uppercase tracking-wider flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-[#C5A059]" />
                  <span>Institutional History</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{booklet.universityProfile.history}</p>
              </div>

              <div className="p-5 rounded-xl bg-amber-50/50 border border-amber-100 space-y-2">
                <div className="text-xs font-bold text-[#002366] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>Vision & Mission</span>
                </div>
                <p className="text-xs text-slate-700 font-semibold italic">"{booklet.universityProfile.vision}"</p>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">{booklet.universityProfile.mission}</p>
              </div>
            </div>

            {/* Core Values */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-[#002366] uppercase tracking-wider">
                Institutional Core Values
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {booklet.universityProfile.coreValues.map((value, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0 mt-0.5" />
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Authentic BIBU Faculty Leadership Board (As provided by user!) */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-display text-[#002366]">
                    University Senate, Deans & Senior Advisory Board
                  </h3>
                  <p className="text-xs text-slate-500">
                    Distinguished theologians, educators, and Christian statesmen directing BIBU's global mission
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-[#002366] text-white rounded text-[10px] font-black uppercase tracking-wider">
                  Accredited Faculty
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {booklet.facultyBoard.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 hover:border-[#C5A059] bg-white transition-all shadow-xs space-y-1"
                  >
                    <div className="font-bold text-xs font-display text-[#002366]">{member.name}</div>
                    <div className="text-[11px] font-semibold text-[#C5A059]">{member.role}</div>
                    <div className="text-[10px] text-slate-500">{member.departmentOrSchool}</div>
                    <div className="text-[9px] font-mono text-slate-400 mt-1">{member.qualifications}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PAGE 4: GRADUATION CEREMONY PROGRAMME */}
        {currentPage === 4 && (
          <div className="p-8 sm:p-12 space-y-8">
            <div className="border-b-2 border-[#C5A059] pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase text-[#C5A059]">Section IV</span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002366]">
                  Order of Proceedings & Convocation Programme
                </h2>
              </div>
              <UniversityLogo size="sm" />
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#002366]" />
                  <span>
                    Official Commencement: <strong>{ceremony?.graduationTime || '09:30 AM'}</strong> at{' '}
                    <strong>{ceremony?.venue || 'Grand Convocation Pavilion'}</strong>
                  </span>
                </div>
                <span className="font-bold text-[#002366]">Chief Guest: {ceremony?.chiefGuest?.split('-')[0]}</span>
              </div>

              {/* Programme Steps Timeline */}
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                {booklet.customProgrammeSchedule.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#002366] text-[#C5A059] flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {item.order}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 font-display">{item.activity}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Officiated by: {item.facilitator}</div>
                      </div>
                    </div>

                    <div className="text-right sm:text-right pl-12 sm:pl-0">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 font-mono font-bold text-[11px] text-[#002366]">
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PAGE 5: GRADUATING CLASS DIRECTORY */}
        {currentPage === 5 && (
          <div className="p-8 sm:p-12 space-y-6">
            <div className="border-b-2 border-[#C5A059] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase text-[#C5A059]">Section V</span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002366]">
                  Graduating Class Directory
                </h2>
                <p className="text-xs text-slate-500">
                  Showing {filteredCandidates.length} of {ceremonyCandidates.length} registered graduands
                </p>
              </div>

              {/* Directory Filter & Search Controls */}
              <div className="flex items-center flex-wrap gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={candidateSearchQuery}
                    onChange={(e) => setCandidateSearchQuery(e.target.value)}
                    placeholder="Search name, degree, id..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#002366] w-48"
                  />
                </div>

                <select
                  value={selectedSchoolFilter}
                  onChange={(e) => setSelectedSchoolFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
                >
                  {availableSchools.map((s) => (
                    <option key={s} value={s}>
                      {s === 'All' ? 'All Schools' : s}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedLevelFilter}
                  onChange={(e) => setSelectedLevelFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
                >
                  {availableLevels.map((l) => (
                    <option key={l} value={l}>
                      {l === 'All' ? 'All Award Levels' : l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Candidates Grid */}
            {filteredCandidates.length === 0 ? (
              <div className="py-16 text-center text-slate-500 space-y-2">
                <Users className="w-8 h-8 mx-auto text-slate-300" />
                <div className="text-sm font-bold">No graduating candidates match the selected filters.</div>
                <button
                  onClick={() => {
                    setCandidateSearchQuery('');
                    setSelectedSchoolFilter('All');
                    setSelectedLevelFilter('All');
                  }}
                  className="text-xs text-[#002366] hover:underline font-bold"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCandidates.map((cand) => (
                  <div
                    key={cand.id}
                    onClick={() => onSelectCandidate && onSelectCandidate(cand)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-[#C5A059] bg-white transition-all shadow-xs flex items-start gap-3.5 group cursor-pointer hover:shadow-md"
                  >
                    <img
                      src={cand.profilePhoto}
                      alt={cand.fullName}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold font-display text-[#002366] truncate group-hover:text-[#C5A059] transition-colors">
                          {cand.fullName}
                        </h4>
                        <span className="text-[9px] font-mono text-slate-400 flex-shrink-0">
                          #{cand.bookletNumber || 'BK-001'}
                        </span>
                      </div>

                      <div className="text-[11px] font-semibold text-slate-800 line-clamp-1">
                        {cand.programName}
                      </div>

                      <div className="text-[10px] text-slate-500 truncate">{cand.schoolName}</div>

                      <div className="flex items-center justify-between pt-1 text-[9px]">
                        <span className="text-slate-600 font-medium">
                          {cand.country} • {cand.awardLevel}
                        </span>
                        {cand.academicHonors && (
                          <span className="font-bold text-[#C5A059] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            {cand.academicHonors}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PAGE 6: ACADEMIC AWARDS & HONOURS */}
        {currentPage === 6 && (
          <div className="p-8 sm:p-12 space-y-8">
            <div className="border-b-2 border-[#C5A059] pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase text-[#C5A059]">Section VI</span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002366]">
                  Academic Awards, Honours & Citations
                </h2>
              </div>
              <UniversityLogo size="sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {booklet.awards.map((award) => (
                <div
                  key={award.id}
                  className="p-6 rounded-2xl border-2 border-[#C5A059]/50 bg-gradient-to-br from-amber-50/40 via-white to-slate-50 shadow-md space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002366] text-[#C5A059] text-[10px] font-black uppercase tracking-wider">
                      <Award className="w-3.5 h-3.5" />
                      <span>{award.awardCategory}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">Class of 2026</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-black font-display text-[#002366]">{award.awardTitle}</h3>
                    <div className="text-sm font-bold text-slate-800">{award.studentName}</div>
                    <div className="text-xs text-slate-500 font-medium">
                      {award.programName} • {award.schoolName}
                    </div>
                  </div>

                  {/* Official Citation */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 italic leading-relaxed">
                    "{award.citation}"
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                    <span>Presented by: <strong>{award.presentedBy}</strong></span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Conferred
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Pagination Footer Bar */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 font-bold text-[#002366] flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Page</span>
          </button>

          <div className="font-medium text-slate-700">
            Page <span className="font-bold text-[#002366]">{currentPage}</span> of{' '}
            <span className="font-bold">{totalPages}</span>
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 font-bold text-[#002366] flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next Page</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
