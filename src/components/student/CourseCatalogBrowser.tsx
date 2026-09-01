import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Module, School, AcademicLevel } from '../../types';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  BookOpen,
  Search,
  Filter,
  GraduationCap,
  CheckCircle,
  Clock,
  Send,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Layers,
  FileText,
  HelpCircle,
  AlertTriangle,
  Award,
  ArrowRight,
  X,
  PlusCircle,
  Bookmark,
  Calendar,
  UserCheck,
  ShieldCheck,
  Check,
  RotateCcw
} from 'lucide-react';

interface CourseCatalogBrowserProps {
  onOpenClassroom?: (courseId: string) => void;
}

export const CourseCatalogBrowser: React.FC<CourseCatalogBrowserProps> = ({ onOpenClassroom }) => {
  const {
    currentUser,
    courses,
    modules,
    schools,
    programs,
    supportTickets,
    isStudentEnrolledInCourse,
    requestCourseEnrolment,
    requestModuleEnrolment,
    setSelectedCourseId,
    setCurrentView
  } = useApp();

  // Search & Filtering State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'enrolled' | 'available' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'code' | 'title' | 'credits' | 'enrolled'>('code');
  const [activeCatalogTab, setActiveCatalogTab] = useState<'catalog' | 'my-requests'>('catalog');

  // Modal States
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<Course | null>(null);
  const [requestModalData, setRequestModalData] = useState<{
    course: Course;
    module?: Module;
  } | null>(null);

  // Form State for Enrolment Modal
  const [requestTerm, setRequestTerm] = useState('Fall Semester 2026');
  const [requestStudyMode, setRequestStudyMode] = useState('Standard Online Academic Track');
  const [requestReason, setRequestReason] = useState('');
  const [agreedToPrereqs, setAgreedToPrereqs] = useState(true);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    success: boolean;
    message: string;
    ticketNumber?: string;
  } | null>(null);

  // Expanded modules in detail modal
  const [expandedModuleIds, setExpandedModuleIds] = useState<{ [id: string]: boolean }>({});

  // Pending ticket tracking for the current user
  const studentEnrolmentTickets = useMemo(() => {
    return supportTickets.filter(
      (t) =>
        t.studentId === currentUser.id &&
        t.category === 'Academic Advising' &&
        (t.subject.includes('Enrolment Request') || t.subject.includes('Module Enrolment'))
    );
  }, [supportTickets, currentUser.id]);

  // Check if a course or module has a pending request
  const hasPendingCourseRequest = (courseCode: string) => {
    return studentEnrolmentTickets.some(
      (t) => t.subject.includes(courseCode) && t.status === 'Open'
    );
  };

  const getPendingTicketForCourse = (courseCode: string) => {
    return studentEnrolmentTickets.find(
      (t) => t.subject.includes(courseCode) && t.status === 'Open'
    );
  };

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(q);
        const matchesCode = course.code.toLowerCase().includes(q);
        const matchesInstructor = course.instructorName.toLowerCase().includes(q);
        const matchesDescription = course.description.toLowerCase().includes(q);
        const matchesScripture = course.biblePassages?.some((p) => p.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCode && !matchesInstructor && !matchesDescription && !matchesScripture) {
          return false;
        }
      }

      // School filter
      if (selectedSchool !== 'all' && course.schoolId !== selectedSchool) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'all' && course.level !== selectedLevel) {
        return false;
      }

      // Status filter
      const isEnrolled = isStudentEnrolledInCourse(course.id);
      const isPending = hasPendingCourseRequest(course.code);

      if (selectedStatus === 'enrolled' && !isEnrolled) return false;
      if (selectedStatus === 'pending' && (!isPending || isEnrolled)) return false;
      if (selectedStatus === 'available' && (isEnrolled || isPending)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'code') return a.code.localeCompare(b.code);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'credits') return b.creditHours - a.creditHours;
      if (sortBy === 'enrolled') return (b.enrolledStudentsCount || 0) - (a.enrolledStudentsCount || 0);
      return 0;
    });
  }, [courses, searchTerm, selectedSchool, selectedLevel, selectedStatus, sortBy, isStudentEnrolledInCourse, studentEnrolmentTickets]);

  // Enrolled courses count
  const enrolledCount = courses.filter((c) => isStudentEnrolledInCourse(c.id)).length;
  const pendingCount = studentEnrolmentTickets.filter((t) => t.status === 'Open').length;

  const toggleModuleAccordion = (modId: string) => {
    setExpandedModuleIds((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleOpenEnrollModal = (course: Course, module?: Module) => {
    setRequestModalData({ course, module });
    setRequestReason('');
    setSubmissionFeedback(null);
  };

  const handleSelectPresetReason = (reasonText: string) => {
    setRequestReason((prev) => (prev ? `${prev} - ${reasonText}` : reasonText));
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModalData) return;

    if (requestModalData.module) {
      // Module specific request
      const res = requestModuleEnrolment(
        requestModalData.course.id,
        requestModalData.module.id,
        requestReason,
        requestTerm
      );
      setSubmissionFeedback(res);
    } else {
      // Full course request
      const res = requestCourseEnrolment(
        requestModalData.course.id,
        requestReason,
        requestTerm,
        requestStudyMode
      );
      setSubmissionFeedback(res);
    }
  };

  const handleEnterClassroom = (courseId: string) => {
    if (onOpenClassroom) {
      onOpenClassroom(courseId);
    } else {
      setSelectedCourseId(courseId);
      setCurrentView('classroom');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-[#002366] via-[#001A4D] to-[#001030] rounded-2xl p-6 sm:p-8 text-white shadow-md border border-[#002366]/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <UniversityLogo variant="white" size="xl" />
        </div>

        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#C5A059] text-[#002366] font-mono font-black text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
              <BookOpen className="w-3.5 h-3.5" />
              Theological Curriculum Catalog
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 font-mono text-xs border border-white/15">
              Academic Term: Fall 2026 / Spring 2027
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              University Course Catalog & Modular Enrolment
            </h1>
            <p className="text-sm text-slate-200 leading-relaxed">
              Explore university-accredited biblical theology courses, hermeneutical studies, and ministry practica.
              View comprehensive module syllabi and submit formal enrolment applications directly to the Office of the Academic Registrar.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
              <div className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">Total Courses</div>
              <div className="text-xl font-display font-black text-[#C5A059]">{courses.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
              <div className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">Theology Schools</div>
              <div className="text-xl font-display font-black text-white">{schools.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
              <div className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">Enrolled in Term</div>
              <div className="text-xl font-display font-black text-emerald-400">{enrolledCount}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
              <div className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">Registrar Requests</div>
              <div className="text-xl font-display font-black text-amber-300">{pendingCount} Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Controls: Catalog vs My Applications */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveCatalogTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeCatalogTab === 'catalog'
                ? 'bg-[#002366] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#C5A059]" />
            <span>Browse Courses ({filteredCourses.length})</span>
          </button>

          <button
            onClick={() => setActiveCatalogTab('my-requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 relative ${
              activeCatalogTab === 'my-requests'
                ? 'bg-[#002366] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Send className="w-4 h-4 text-[#C5A059]" />
            <span>My Enrolment Applications</span>
            {studentEnrolmentTickets.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#C5A059] text-[#002366] font-mono font-black text-[10px]">
                {studentEnrolmentTickets.length}
              </span>
            )}
          </button>
        </div>

        {activeCatalogTab === 'catalog' && (
          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-[#002366] font-bold">{filteredCourses.length}</strong> of {courses.length} curriculum offerings
          </div>
        )}
      </div>

      {/* TAB 1: COURSE CATALOG BROWSER */}
      {activeCatalogTab === 'catalog' && (
        <div className="space-y-6">
          {/* Search and Filters Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by course title, code (e.g. BIB-301), instructor, or scripture reference (e.g. Romans)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002366] focus:bg-white"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* School Select */}
              <div className="min-w-[200px]">
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                >
                  <option value="all">All Academic Schools ({schools.length})</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Academic Level Select */}
              <div className="min-w-[150px]">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                >
                  <option value="all">All Academic Levels</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor">Bachelor Degree</option>
                  <option value="Master">Master Degree</option>
                  <option value="Doctorate">Doctorate Level</option>
                </select>
              </div>

              {/* Status Select */}
              <div className="min-w-[160px]">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                >
                  <option value="all">All Statuses</option>
                  <option value="available">Available to Enrol</option>
                  <option value="enrolled">Currently Enrolled</option>
                  <option value="pending">Application Pending</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Tags / Active Filters Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-[#002366]" /> Filter by School:
                </span>
                <button
                  onClick={() => setSelectedSchool('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    selectedSchool === 'all'
                      ? 'bg-[#002366] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Schools
                </button>
                {schools.slice(0, 5).map((sch) => (
                  <button
                    key={sch.id}
                    onClick={() => setSelectedSchool(sch.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      selectedSchool === sch.id
                        ? 'bg-[#002366] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sch.code}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="py-1 px-2.5 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-800 focus:outline-none"
                >
                  <option value="code">Course Code</option>
                  <option value="title">Course Title</option>
                  <option value="credits">Credit Hours</option>
                  <option value="enrolled">Class Enrollment</option>
                </select>

                {(searchTerm || selectedSchool !== 'all' || selectedLevel !== 'all' || selectedStatus !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedSchool('all');
                      setSelectedLevel('all');
                      setSelectedStatus('all');
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                    title="Reset all filters"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold font-display text-slate-900">No theology courses matched your criteria</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your search query, clearing filters, or browsing across all academic schools.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSchool('all');
                  setSelectedLevel('all');
                  setSelectedStatus('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#002366] text-white text-xs font-bold uppercase tracking-wider"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = isStudentEnrolledInCourse(course.id);
              const pendingTicket = getPendingTicketForCourse(course.code);
              const courseSchool = schools.find((s) => s.id === course.schoolId);
              const courseModules = modules.filter((m) => m.courseId === course.id);
              const totalLessonsCount = courseModules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);

              return (
                <div
                  key={course.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                    isEnrolled
                      ? 'border-emerald-300 ring-1 ring-emerald-200'
                      : pendingTicket
                      ? 'border-amber-300 ring-1 ring-amber-200'
                      : 'border-slate-200 hover:border-[#002366]'
                  }`}
                >
                  {/* Top Bar: Code, Credits, Level & Status Tag */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono font-black px-2.5 py-0.5 rounded bg-[#002366]/10 text-[#002366] border border-[#002366]/20">
                          {course.code}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {course.creditHours} Credits
                        </span>
                      </div>

                      {isEnrolled ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-300">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Enrolled
                        </span>
                      ) : pendingTicket ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1 border border-amber-300">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Application Pending
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C5A059]/10 text-[#002366] border border-[#C5A059]/30">
                          {course.level}
                        </span>
                      )}
                    </div>

                    {/* Course Title & School */}
                    <div className="space-y-1">
                      <h3
                        onClick={() => setSelectedCourseForDetail(course)}
                        className="text-base font-bold font-display text-[#002366] hover:text-[#C5A059] cursor-pointer transition-colors leading-snug line-clamp-2"
                      >
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <GraduationCap className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>{courseSchool?.name || 'School of Theology'}</span>
                      </div>
                    </div>

                    {/* Course Description */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Scripture Anchors */}
                    {course.biblePassages && course.biblePassages.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        {course.biblePassages.slice(0, 2).map((psg, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200/80"
                          >
                            📖 {psg}
                          </span>
                        ))}
                        {course.biblePassages.length > 2 && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            +{course.biblePassages.length - 2} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Module & Instructor Info */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#002366]" />
                        <span className="font-semibold text-slate-700">
                          {courseModules.length} Modules ({totalLessonsCount} Lessons)
                        </span>
                      </div>
                      <span className="text-[10px] text-[#002366] font-bold">
                        {course.semester}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-4 bg-slate-50/80 border-t border-slate-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCourseForDetail(course)}
                        className="flex-1 py-2 bg-white hover:bg-slate-100 text-[#002366] rounded-xl text-xs font-bold border border-slate-200 transition-all flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>View Syllabus</span>
                      </button>

                      {isEnrolled ? (
                        <button
                          onClick={() => handleEnterClassroom(course.id)}
                          className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <span>Classroom</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                        </button>
                      ) : pendingTicket ? (
                        <button
                          onClick={() => setActiveCatalogTab('my-requests')}
                          className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                        >
                          <span>View Ticket</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenEnrollModal(course)}
                          className="flex-1 py-2 bg-[#002366] hover:bg-[#001A4D] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Enrol</span>
                        </button>
                      )}
                    </div>

                    {!isEnrolled && (
                      <button
                        onClick={() => {
                          setSelectedCourseForDetail(course);
                        }}
                        className="w-full text-center text-[10px] font-bold text-slate-500 hover:text-[#002366] transition-colors py-0.5"
                      >
                        Browse Modules to Request Individual Modules →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MY ENROLMENT APPLICATIONS (REGISTRAR TRACKING) */}
      {activeCatalogTab === 'my-requests' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold font-display text-[#002366]">Official Enrolment Applications Log</h2>
                <p className="text-xs text-slate-500">
                  Track formal course and modular admission requests submitted to the Office of the Academic Registrar.
                </p>
              </div>
              <button
                onClick={() => setActiveCatalogTab('catalog')}
                className="px-4 py-2 bg-[#002366] hover:bg-[#001A4D] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Submit New Course Request</span>
              </button>
            </div>

            {studentEnrolmentTickets.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Enrolment Applications on Record</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You have not submitted any course or modular enrollment requests yet. Browse the theology course catalog to submit your first application.
                </p>
                <button
                  onClick={() => setActiveCatalogTab('catalog')}
                  className="px-4 py-2 rounded-xl bg-[#002366] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Browse Course Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {studentEnrolmentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#002366] transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#002366] text-white">
                            {ticket.ticketNumber}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {ticket.category}
                          </span>
                          <span className="text-xs text-slate-400">
                            Logged: {ticket.createdAt}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#002366] font-display">
                          {ticket.subject}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                            ticket.status === 'Open'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : ticket.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-900 border border-blue-300'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}
                        >
                          Status: {ticket.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white rounded-lg border border-slate-200/80 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                      {ticket.message}
                    </div>

                    {/* Official Registrar Response */}
                    {ticket.responses && ticket.responses.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Registrar Action & Advisory Note</span>
                        </div>
                        {ticket.responses.map((resp) => (
                          <div
                            key={resp.id}
                            className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between text-[10px] text-emerald-900 font-semibold">
                              <span className="font-bold">{resp.author} ({resp.role})</span>
                              <span>{resp.timestamp}</span>
                            </div>
                            <p className="text-emerald-950 font-medium leading-relaxed">{resp.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DETAIL MODAL: COMPREHENSIVE COURSE & MODULE SYLLABUS INSPECTOR */}
      {selectedCourseForDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 z-20 bg-[#002366] text-white p-6 rounded-t-2xl flex items-start justify-between gap-4 border-b-4 border-[#C5A059]">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded bg-[#C5A059] text-[#002366]">
                    {selectedCourseForDetail.code}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-white/15 text-white">
                    {selectedCourseForDetail.creditHours} Credit Hours
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-white/15 text-white">
                    {selectedCourseForDetail.level} Degree Level
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-white/15 text-white">
                    {selectedCourseForDetail.semester}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {selectedCourseForDetail.title}
                </h2>
                <div className="text-xs text-[#C5A059] font-bold">
                  Chief Instructor: {selectedCourseForDetail.instructorName}
                </div>
              </div>

              <button
                onClick={() => setSelectedCourseForDetail(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Course Overview */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#002366]" />
                  <span>Theological Description & Exegetical Objective</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  {selectedCourseForDetail.description}
                </p>
              </div>

              {/* Prescribed Scripture References */}
              {selectedCourseForDetail.biblePassages && selectedCourseForDetail.biblePassages.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Prescribed Scriptural Canons
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCourseForDetail.biblePassages.map((psg, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold"
                      >
                        📖 {psg}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Outcomes */}
              {selectedCourseForDetail.learningOutcomes && selectedCourseForDetail.learningOutcomes.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#002366]" />
                    <span>Core Learning Outcomes</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCourseForDetail.learningOutcomes.map((outcome, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2 text-xs text-slate-700"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prerequisites */}
              {selectedCourseForDetail.prerequisites && selectedCourseForDetail.prerequisites.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <div>
                      <span className="font-bold text-slate-800">Academic Prerequisites: </span>
                      <span className="text-slate-600">{selectedCourseForDetail.prerequisites.join(', ')}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                    Status: Satisfied
                  </span>
                </div>
              )}

              {/* Complete Modules and Lessons Breakdown */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-display text-[#002366] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#C5A059]" />
                    <span>Curriculum Syllabus & Instructional Modules</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {modules.filter((m) => m.courseId === selectedCourseForDetail.id).length} Modules
                  </span>
                </div>

                <div className="space-y-3">
                  {modules
                    .filter((m) => m.courseId === selectedCourseForDetail.id)
                    .map((mod, idx) => {
                      const isExpanded = expandedModuleIds[mod.id] ?? idx === 0;
                      return (
                        <div
                          key={mod.id}
                          className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs"
                        >
                          {/* Module Header */}
                          <div className="p-4 bg-slate-50/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div
                              onClick={() => toggleModuleAccordion(mod.id)}
                              className="cursor-pointer flex-1 space-y-1"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#002366] text-white">
                                  Module {mod.order || idx + 1}
                                </span>
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-display">
                                  {mod.title}
                                </h4>
                              </div>
                              <p className="text-xs text-slate-600 line-clamp-1">{mod.description}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* Request Module Access Button */}
                              <button
                                onClick={() => handleOpenEnrollModal(selectedCourseForDetail, mod)}
                                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#002366] border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                                title="Submit a request to enrol in this specific instructional module"
                              >
                                <PlusCircle className="w-3.5 h-3.5 text-[#C5A059]" />
                                <span>Request Module</span>
                              </button>

                              <button
                                onClick={() => toggleModuleAccordion(mod.id)}
                                className="p-1.5 rounded-lg bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition-all"
                              >
                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Lessons */}
                          {isExpanded && (
                            <div className="p-4 border-t border-slate-200 bg-white space-y-3">
                              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Lessons in this Module ({mod.lessons?.length || 0})
                              </div>

                              <div className="space-y-2.5">
                                {mod.lessons?.map((lesson, lIdx) => (
                                  <div
                                    key={lesson.id}
                                    className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5"
                                  >
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="font-bold text-[#002366]">
                                        {lesson.title || `Lesson ${lIdx + 1}`}
                                      </span>
                                      {lesson.scriptureReferences && lesson.scriptureReferences.length > 0 && (
                                        <span className="text-[10px] text-[#C5A059] font-bold">
                                          📖 {lesson.scriptureReferences.join(', ')}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-600 leading-snug">
                                      {lesson.introduction}
                                    </p>
                                    {lesson.ministryApplication && (
                                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 flex items-start gap-1">
                                        <strong className="text-slate-700">Ministry Application:</strong>
                                        <span className="line-clamp-1">{lesson.ministryApplication}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 bg-slate-50 rounded-b-2xl border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setSelectedCourseForDetail(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-all"
              >
                Close Syllabus
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {isStudentEnrolledInCourse(selectedCourseForDetail.id) ? (
                  <button
                    onClick={() => {
                      setSelectedCourseForDetail(null);
                      handleEnterClassroom(selectedCourseForDetail.id);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>Enter Online Classroom</span>
                    <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const course = selectedCourseForDetail;
                      setSelectedCourseForDetail(null);
                      handleOpenEnrollModal(course);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <PlusCircle className="w-4 h-4 text-[#C5A059]" />
                    <span>Apply for Full Course Enrolment</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ENROLMENT & MODULE REQUEST MODAL FORM */}
      {requestModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header */}
            <div className="bg-[#002366] text-white p-6 border-b-4 border-[#C5A059] flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-[#C5A059] text-[#002366] uppercase tracking-wider">
                    Office of Academic Registrar
                  </span>
                  <span className="text-[10px] text-slate-300">Formal Application</span>
                </div>
                <h2 className="text-xl font-bold font-display text-white">
                  {requestModalData.module
                    ? 'Instructional Module Enrolment Request'
                    : 'Course Enrolment Application'}
                </h2>
              </div>
              <button
                onClick={() => setRequestModalData(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Submission Feedback Success View */}
            {submissionFeedback ? (
              <div className="p-8 text-center space-y-5">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-xs">
                  <CheckCircle className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-display text-[#002366]">Application Successfully Submitted!</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans max-w-md mx-auto">
                    {submissionFeedback.message}
                  </p>
                </div>

                {submissionFeedback.ticketNumber && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl max-w-sm mx-auto text-xs space-y-1">
                    <div className="text-[10px] font-bold uppercase text-slate-500">Official Tracking Reference</div>
                    <div className="text-sm font-mono font-black text-[#002366]">{submissionFeedback.ticketNumber}</div>
                  </div>
                )}

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setRequestModalData(null);
                      setActiveCatalogTab('my-requests');
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#002366] hover:bg-[#001A4D] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    View in Applications Log
                  </button>
                  <button
                    onClick={() => setRequestModalData(null)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Back to Catalog
                  </button>
                </div>
              </div>
            ) : (
              /* Request Form */
              <form onSubmit={handleSubmitRequest} className="p-6 space-y-5">
                {/* Course Summary Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#002366]">
                      {requestModalData.course.code}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {requestModalData.course.creditHours} Credit Hours
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 font-display">
                    {requestModalData.course.title}
                  </h4>

                  {requestModalData.module && (
                    <div className="pt-2 border-t border-slate-200 flex items-center gap-2 text-xs text-[#002366] font-bold">
                      <Layers className="w-4 h-4 text-[#C5A059]" />
                      <span>Target Module: {requestModalData.module.title}</span>
                    </div>
                  )}
                </div>

                {/* Student Identity Record */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Applicant Name</span>
                    <strong className="text-slate-800">{currentUser.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Student ID / Degree</span>
                    <strong className="text-slate-800">{currentUser.studentId || 'BIBU-STU-2026'} • {currentUser.programName || 'Theology'}</strong>
                  </div>
                </div>

                {/* Term and Study Track Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Target Academic Term
                    </label>
                    <select
                      value={requestTerm}
                      onChange={(e) => setRequestTerm(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    >
                      <option value="Fall Semester 2026">Fall Semester 2026 (Current)</option>
                      <option value="Spring Semester 2027">Spring Semester 2027</option>
                      <option value="Summer Intensive 2027">Summer Intensive 2027</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Study Mode
                    </label>
                    <select
                      value={requestStudyMode}
                      onChange={(e) => setRequestStudyMode(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                    >
                      <option value="Standard Online Academic Track">Standard Online Track</option>
                      <option value="Intensive Ministry Cohort">Intensive Ministry Cohort</option>
                      <option value="Modular Elective / Audit">Modular Elective / Audit</option>
                    </select>
                  </div>
                </div>

                {/* Theological Justification & Statement */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Theological Intent & Academic Notes
                    </label>
                    <span className="text-[10px] text-slate-400">Optional</span>
                  </div>

                  {/* Preset quick justification chips */}
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSelectPresetReason('Required Degree Pathway Course')}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-[#002366] hover:text-white transition-colors"
                    >
                      + Degree Core
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectPresetReason('Ministry Practical Preparation')}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-[#002366] hover:text-white transition-colors"
                    >
                      + Pastoral Prep
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectPresetReason('Faculty Advisor Recommendation')}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-[#002366] hover:text-white transition-colors"
                    >
                      + Advisor Recommended
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectPresetReason('Elective Specialization')}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-[#002366] hover:text-white transition-colors"
                    >
                      + Elective
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                    placeholder="Provide additional details on ministry context, prerequisite waiver requests, or academic scheduling..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002366] focus:bg-white resize-none"
                  />
                </div>

                {/* Prerequisites acknowledgment */}
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={agreedToPrereqs}
                    onChange={(e) => setAgreedToPrereqs(e.target.checked)}
                    className="mt-0.5 rounded text-[#002366] focus:ring-[#002366]"
                  />
                  <span>
                    I confirm that I meet the course academic prerequisites or have logged ministry equivalence with my Academic Dean.
                  </span>
                </label>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setRequestModalData(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!agreedToPrereqs}
                    className="px-6 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                  >
                    <Send className="w-4 h-4 text-[#C5A059]" />
                    <span>Submit Application to Registrar</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
