import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import { CircularProgressBar } from '../common/CircularProgressBar';
import { Bulletin, Course } from '../../types';
import { BulletinDetailModal } from '../public/BulletinDetailModal';
import { Notifications } from './Notifications';
import { CourseCatalogBrowser } from './CourseCatalogBrowser';
import { RplStudentModule } from './RplStudentModule';
import { StudentMediaSection } from './StudentMediaSection';
import {
  GraduationCap,
  BookOpen,
  FileCheck2,
  Award,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  FileText,
  Calendar,
  Sparkles,
  Bell,
  ChevronRight,
  ShieldCheck,
  Paperclip,
  AlertTriangle,
  Layers,
  CheckCircle,
  Target,
  BarChart3,
  Bookmark,
  Play,
  Tv
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    courses,
    modules,
    assignments,
    assignmentSubmissions,
    examinations,
    examAttempts,
    completedLessonIds,
    bulletins,
    recordBulletinView,
    setCurrentView,
    setSelectedCourseId,
    setSelectedLessonId,
    setSelectedExamId,
    getStudentEnrolledCourses,
    isStudentEnrolledInCourse,
    requestCourseEnrolment
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'notifications' | 'courses' | 'rpl' | 'media'>('overview');
  const [activeBulletinModal, setActiveBulletinModal] = useState<Bulletin | null>(null);
  const [requestedCourseFeedback, setRequestedCourseFeedback] = useState<{ [courseId: string]: string }>({});
  const [progressFilter, setProgressFilter] = useState<'all' | 'in_progress' | 'completed' | 'not_started'>('all');

  const enrolledCourses = getStudentEnrolledCourses(currentUser);
  const enrolledCourseIds = enrolledCourses.map((c) => c.id);
  const otherCourses = courses.filter((c) => !isStudentEnrolledInCourse(c.id));
  const nextExam = examinations[0];

  // Calculate pending items count for header badge
  const pendingAssignmentsCount = assignments.filter((asg) => {
    if (!enrolledCourseIds.includes(asg.courseId)) return false;
    return !assignmentSubmissions.some((s) => s.assignmentId === asg.id && s.studentId === currentUser.id);
  }).length;

  const recentGradedCount = assignmentSubmissions.filter(
    (s) => s.studentId === currentUser.id && s.status === 'Graded'
  ).length;

  const totalAlertsCount = pendingAssignmentsCount + recentGradedCount;

  // Bulletins relevant for students (TargetAudience: Everyone or Students)
  const studentBulletins = bulletins
    .filter(b => b.status === 'Published' && (b.targetAudience === 'Everyone' || b.targetAudience === 'Students'))
    .slice(0, 3);

  // Dynamic Course Completion Progress Statistics
  const courseProgressList = useMemo(() => {
    return enrolledCourses.map((course) => {
      const courseModules = modules.filter((m) => m.courseId === course.id);
      const allLessons = courseModules.flatMap((m) => m.lessons || []);
      const totalLessons = allLessons.length;

      // Calculate completed lessons from context
      let completedLessons = allLessons.filter((l) => completedLessonIds.includes(l.id)).length;

      // Fallback baseline for demo course Hermeneutics if user hasn't toggled yet
      if (course.id === 'crs-herm-301' && completedLessons === 0) {
        completedLessons = 2; // Hermeneutics baseline: 2 of 4 lessons
      }

      const lessonPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      const courseAssignments = assignments.filter((a) => a.courseId === course.id);
      const totalAssignments = courseAssignments.length;
      const submittedAssignments = assignmentSubmissions.filter(
        (s) => s.studentId === currentUser.id && courseAssignments.some((a) => a.id === s.assignmentId)
      ).length;
      const assignmentPercentage = totalAssignments > 0 ? Math.round((submittedAssignments / totalAssignments) * 100) : 100;

      const courseExams = examinations.filter((e) => e.courseId === course.id);
      const hasExam = courseExams.length > 0;
      const examCompleted = examAttempts.some(
        (att) => att.studentId === currentUser.id && courseExams.some((e) => e.id === att.examId)
      );

      // Holistic completion score
      let completionPercentage = 0;
      if (totalLessons > 0) {
        if (totalAssignments > 0) {
          completionPercentage = Math.round((lessonPercentage * 0.75) + (assignmentPercentage * 0.25));
        } else {
          completionPercentage = lessonPercentage;
        }
      } else {
        completionPercentage = 0;
      }

      let status: 'Completed' | 'In Progress' | 'Not Started' = 'Not Started';
      if (completionPercentage >= 100) {
        status = 'Completed';
      } else if (completionPercentage > 0) {
        status = 'In Progress';
      }

      return {
        course,
        totalLessons,
        completedLessons,
        lessonPercentage,
        totalAssignments,
        submittedAssignments,
        assignmentPercentage,
        hasExam,
        examCompleted,
        completionPercentage,
        status
      };
    });
  }, [enrolledCourses, modules, completedLessonIds, assignments, assignmentSubmissions, currentUser.id, examinations, examAttempts]);

  // Overall aggregate progress across enrolled courses
  const overallEnrolledAverage = useMemo(() => {
    if (courseProgressList.length === 0) return 0;
    const sum = courseProgressList.reduce((acc, curr) => acc + curr.completionPercentage, 0);
    return Math.round(sum / courseProgressList.length);
  }, [courseProgressList]);

  const completedCoursesCount = courseProgressList.filter((c) => c.status === 'Completed').length;
  const inProgressCoursesCount = courseProgressList.filter((c) => c.status === 'In Progress').length;
  const totalLessonsDone = courseProgressList.reduce((acc, curr) => acc + curr.completedLessons, 0);
  const totalLessonsAll = courseProgressList.reduce((acc, curr) => acc + curr.totalLessons, 0);

  // Filtered progress list for display
  const filteredCourseProgressList = useMemo(() => {
    if (progressFilter === 'completed') return courseProgressList.filter((c) => c.status === 'Completed');
    if (progressFilter === 'in_progress') return courseProgressList.filter((c) => c.status === 'In Progress');
    if (progressFilter === 'not_started') return courseProgressList.filter((c) => c.status === 'Not Started');
    return courseProgressList;
  }, [courseProgressList, progressFilter]);

  const handleOpenBulletin = (bul: Bulletin) => {
    recordBulletinView(bul.id);
    setActiveBulletinModal(bul);
  };

  const handleResumeCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedLessonId('les-herm-101');
    setCurrentView('classroom');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartExam = (examId: string) => {
    setSelectedExamId(examId);
    setCurrentView('exam-taker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalRequired = currentUser.totalRequiredCredits || 120;
  const earned = currentUser.creditsEarned || 78;
  const progressPercent = Math.round((earned / totalRequired) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Student Welcome Banner */}
      <div className="bg-[#002366] text-white rounded-2xl p-6 sm:p-8 border-2 border-[#C5A059] shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <UniversityLogo size="lg" withRing className="shadow-lg" />
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#001A4D] text-[#C5A059] text-xs font-bold uppercase tracking-wider border border-[#C5A059]/40">
                <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                <span>Student Portal • {currentUser.currentSemester || 'Fall 2026'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                Welcome back, {currentUser.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Program: <strong className="text-[#C5A059]">{currentUser.programName}</strong> • Student ID: <span className="font-mono text-slate-200">{currentUser.studentId}</span>
              </p>
            </div>
          </div>

          {/* GPA & Standing Badges */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-[#001A4D] border border-[#C5A059]/40 rounded-xl p-3.5 text-center min-w-[110px]">
              <div className="text-[10px] uppercase font-black tracking-widest text-[#C5A059]">Cumulative GPA</div>
              <div className="text-2xl font-black text-white font-display">{currentUser.gpa || '3.84'}</div>
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Honors Standing</div>
            </div>

            <div className="bg-[#001A4D] border border-white/20 rounded-xl p-3.5 text-center min-w-[110px]">
              <div className="text-[10px] uppercase font-black tracking-widest text-slate-400">Credits Earned</div>
              <div className="text-2xl font-black text-white font-display">{earned} <span className="text-xs text-slate-400 font-normal">/ {totalRequired}</span></div>
              <div className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider">{progressPercent}% Completed</div>
            </div>
          </div>
        </div>

        {/* Degree Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-300">Overall Degree Completion Toward Graduation</span>
            <span className="font-bold text-[#C5A059]">{earned} of {totalRequired} Credit Hours</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#001438] border border-white/10 overflow-hidden">
            <div
              className="h-full bg-[#C5A059] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Portal Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => handleResumeCourse('crs-herm-301')}
            className="px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black uppercase tracking-wider text-xs shadow-md transition-all flex items-center gap-2 hover:scale-105"
          >
            <BookOpen className="w-4 h-4" />
            <span>Resume Online Classroom</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('notifications');
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-xl bg-[#001A4D] hover:bg-[#001438] text-white font-bold uppercase tracking-wider text-xs border border-white/20 transition-all flex items-center gap-2 hover:border-[#C5A059] relative"
          >
            <Bell className="w-4 h-4 text-[#C5A059]" />
            <span>Academic Alerts & Progress</span>
            {totalAlertsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono font-black text-[10px]">
                {totalAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentView('transcript')}
            className="px-5 py-2.5 rounded-xl bg-[#001A4D] hover:bg-[#001438] text-white font-bold uppercase tracking-wider text-xs border border-white/20 transition-all flex items-center gap-2 hover:border-[#C5A059]"
          >
            <FileText className="w-4 h-4 text-[#C5A059]" />
            <span>Official Transcript</span>
          </button>

          <button
            onClick={() => setCurrentView('finance')}
            className="px-5 py-2.5 rounded-xl bg-[#001A4D] hover:bg-[#001438] text-white font-bold uppercase tracking-wider text-xs border border-white/20 transition-all flex items-center gap-2 hover:border-[#C5A059]"
          >
            <CreditCard className="w-4 h-4 text-[#C5A059]" />
            <span>Tuition & Fees</span>
          </button>

          {/* BIBU TV Quick Access Button */}
          <button
            id="student-dashboard-watch-tv-btn"
            onClick={() => setCurrentView('bibu-tv')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-[#002366] hover:from-rose-600 hover:to-[#001A4D] text-white font-bold uppercase tracking-wider text-xs border border-rose-400/50 transition-all flex items-center gap-2 shadow-md hover:scale-105"
            title="Watch BIBU TV Online Video Channel"
          >
            <Tv className="w-4 h-4 text-rose-200" />
            <span>Watch BIBU TV</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-[#002366] text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 relative ${
            activeTab === 'notifications'
              ? 'bg-[#002366] text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Bell className="w-4 h-4 text-[#C5A059]" />
          <span>Academic Alerts & Progress</span>
          {totalAlertsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono font-black text-[10px]">
              {totalAlertsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'courses'
              ? 'bg-[#002366] text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#C5A059]" />
          <span>Course Catalog & Enrolment</span>
        </button>

        <button
          onClick={() => setActiveTab('rpl')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'rpl'
              ? 'bg-[#002366] text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-[#C5A059]" />
          <span>Prior Learning (RPL)</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'media'
              ? 'bg-[#002366] text-[#C5A059] shadow-sm font-black'
              : 'bg-amber-50 text-[#002366] hover:bg-amber-100 border border-amber-200'
          }`}
        >
          <Tv className="w-4 h-4 text-[#C5A059]" />
          <span>📺 TV & Radio Media</span>
        </button>
      </div>

      {/* Conditional View: Media Tab */}
      {activeTab === 'media' && (
        <div className="space-y-6 animate-in fade-in">
          <StudentMediaSection />
        </div>
      )}

      {/* Conditional View: Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6 animate-in fade-in">
          <Notifications mode="embedded" />
        </div>
      )}

      {/* Conditional View: RPL Tab */}
      {activeTab === 'rpl' && (
        <div className="space-y-6 animate-in fade-in">
          <RplStudentModule />
        </div>
      )}

      {/* Conditional View: Courses Tab */}
      {activeTab === 'courses' && (
        <div className="space-y-6 animate-in fade-in">
          <CourseCatalogBrowser onOpenClassroom={handleResumeCourse} />
        </div>
      )}

      {/* Main Grid: Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
          {/* Left Col (8): Visual Progress Tracker & Enrolled Courses */}
          <div className="lg:col-span-8 space-y-6">
            {/* Embedded Alerts Quick Banner */}
            {pendingAssignmentsCount > 0 && (
              <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-rose-900">
                      {pendingAssignmentsCount} Pending Theological Assignment{pendingAssignmentsCount > 1 ? 's' : ''} Require Submission
                    </h4>
                    <p className="text-xs text-rose-700">
                      Academic assignments are pending for your enrolled courses. Submit before term deadlines.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shrink-0"
                >
                  View Alerts →
                </button>
              </div>
            )}

            {/* VISUAL PROGRESS TRACKER SECTION WITH CIRCULAR GAUGES */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#002366] text-[#C5A059]">
                      <Target className="w-4 h-4" />
                    </span>
                    <h2 className="text-base sm:text-lg font-bold font-display text-[#002366]">
                      Theological Academic Progress Tracker
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    Live completion metrics and instructional milestone tracking across your enrolled curriculum.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                  <button
                    onClick={() => setProgressFilter('all')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                      progressFilter === 'all'
                        ? 'bg-[#002366] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({courseProgressList.length})
                  </button>
                  <button
                    onClick={() => setProgressFilter('in_progress')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                      progressFilter === 'in_progress'
                        ? 'bg-[#002366] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    In Progress ({inProgressCoursesCount})
                  </button>
                  <button
                    onClick={() => setProgressFilter('completed')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                      progressFilter === 'completed'
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Completed ({completedCoursesCount})
                  </button>
                </div>
              </div>

              {/* Progress Summary Cards & Aggregate Circular Gauge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/80 rounded-xl p-4 border border-slate-200/80">
                {/* Aggregate Circular Gauge */}
                <div className="flex items-center gap-4 sm:col-span-1 bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-2xs">
                  <CircularProgressBar
                    percentage={overallEnrolledAverage}
                    size={76}
                    strokeWidth={7}
                    subText="Term Avg"
                  />
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Term Completion
                    </div>
                    <div className="text-sm font-bold font-display text-[#002366]">
                      {overallEnrolledAverage}% Average
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {inProgressCoursesCount} active, {completedCoursesCount} completed
                    </div>
                  </div>
                </div>

                {/* Lessons Completion Stat */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-2xs flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Instructional Lessons
                    </span>
                    <BookOpen className="w-3.5 h-3.5 text-[#002366]" />
                  </div>
                  <div>
                    <div className="text-xl font-black font-display text-[#002366]">
                      {totalLessonsDone} <span className="text-xs text-slate-400 font-normal">/ {totalLessonsAll}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {totalLessonsAll > 0 ? Math.round((totalLessonsDone / totalLessonsAll) * 100) : 0}% of syllabus reviewed
                    </div>
                  </div>
                </div>

                {/* Submissions & Exam Readiness */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-2xs flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Assignments & Exams
                    </span>
                    <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                  </div>
                  <div>
                    <div className="text-xl font-black font-display text-[#002366]">
                      {recentGradedCount} <span className="text-xs text-slate-400 font-normal">Graded</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {pendingAssignmentsCount === 0 ? 'All assignments current' : `${pendingAssignmentsCount} pending submission`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ENROLLED COURSES DETAILED LIST WITH CIRCULAR PROGRESS INDICATORS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 w-full">
                  <BookOpen className="w-4 h-4 text-[#002366]" />
                  <span className="text-[#002366] font-display font-black text-base">
                    Current Semester Enrolled Courses ({filteredCourseProgressList.length})
                  </span>
                  <span className="h-[1px] flex-1 bg-slate-200 ml-2"></span>
                </h2>
              </div>

              {filteredCourseProgressList.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold text-slate-700">No courses match selected progress filter</div>
                  <button
                    onClick={() => setProgressFilter('all')}
                    className="px-3 py-1.5 rounded-lg bg-[#002366] text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Reset Filter to All
                  </button>
                </div>
              ) : (
                filteredCourseProgressList.map(({
                  course,
                  totalLessons,
                  completedLessons,
                  lessonPercentage,
                  totalAssignments,
                  submittedAssignments,
                  completionPercentage,
                  status
                }) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-[#002366] transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left: Course details */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#002366]/10 text-[#002366] border border-[#002366]/20">
                            {course.code}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">{course.creditHours} Credit Hours</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-[#C5A059] font-bold uppercase tracking-wider">
                            Instructor: {course.instructorName}
                          </span>
                        </div>

                        <h3 className="text-lg font-display font-bold text-[#002366]">
                          {course.title}
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>

                        {/* Scripture Anchors */}
                        {course.biblePassages && course.biblePassages.length > 0 && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-1">
                            <span className="font-semibold text-slate-700">Prescribed Scripture:</span>
                            <span>📖 {course.biblePassages.join(', ')}</span>
                          </div>
                        )}
                      </div>

                      {/* Right: Circular Progress Bar Visual Tracker */}
                      <div className="flex sm:flex-col items-center justify-between sm:justify-center p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 shrink-0 min-w-[140px] text-center gap-3">
                        <CircularProgressBar
                          percentage={completionPercentage}
                          size={76}
                          strokeWidth={7}
                          textSize="text-sm"
                          subText="Progress"
                        />
                        <div className="space-y-0.5">
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${
                              status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : status === 'In Progress'
                                ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {status}
                          </span>
                          <div className="text-[10px] text-slate-500 font-semibold">
                            {completedLessons} of {totalLessons} Lessons Done
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Breakdown Indicators & Action Button */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#002366]" />
                          <span>
                            Lessons: <strong className="text-slate-800">{completedLessons}/{totalLessons}</strong> ({lessonPercentage}%)
                          </span>
                        </div>

                        {totalAssignments > 0 && (
                          <div className="flex items-center gap-1.5">
                            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>
                              Assignments: <strong className="text-slate-800">{submittedAssignments}/{totalAssignments}</strong>
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResumeCourse(course.id)}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Play className="w-3.5 h-3.5 text-[#C5A059] fill-current" />
                          <span>Enter Classroom</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Other Courses in University Catalog */}
            {otherCourses.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 w-full">
                    <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-slate-800 font-display font-bold text-sm">Other Courses in University Catalog ({otherCourses.length})</span>
                    <span className="h-[1px] flex-1 bg-slate-200 ml-2"></span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {otherCourses.map((course) => {
                    const feedback = requestedCourseFeedback[course.id];
                    return (
                      <div
                        key={course.id}
                        className="bg-slate-50/80 rounded-xl border border-slate-200 p-5 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                              {course.code}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500">
                              {course.creditHours} Credits
                            </span>
                          </div>
                          <h4 className="text-sm font-display font-bold text-slate-900 line-clamp-1">
                            {course.title}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>
                        </div>

                        {feedback ? (
                          <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-[11px] text-emerald-800 font-medium">
                            ✓ Enrolment request logged with Registrar!
                          </div>
                        ) : (
                          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-200/60">
                            <button
                              onClick={() => {
                                setSelectedCourseId(course.id);
                                setCurrentView('classroom');
                              }}
                              className="text-[11px] font-bold text-slate-600 hover:text-[#002366]"
                            >
                              View Details →
                            </button>
                            <button
                              onClick={() => {
                                const res = requestCourseEnrolment(course.id, 'Requested via Student Dashboard');
                                setRequestedCourseFeedback((prev) => ({ ...prev, [course.id]: res.message }));
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs transition-all"
                            >
                              Request Enrolment
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Col (4): Examination Notice, Academic Alerts & Financial Balance */}
          <div className="lg:col-span-4 space-y-6">
            {/* Active Examination Box */}
            {nextExam && (
              <div className="bg-[#002366] text-white rounded-xl p-6 shadow-md border-t-4 border-[#C5A059] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#C5A059] text-[#002366]">
                    Examination Active
                  </span>
                  <span className="text-xs font-bold font-mono text-[#C5A059]">⏱️ {nextExam.durationMinutes} Mins</span>
                </div>

                <h3 className="text-base font-display font-bold text-white">
                  {nextExam.title}
                </h3>

                <div className="text-xs text-slate-200 space-y-1">
                  <div>Course: <strong className="text-[#C5A059]">{nextExam.courseCode}</strong></div>
                  <div>Format: 10 Proctored Questions • Pass: {nextExam.passMarks}%</div>
                </div>

                <p className="text-xs text-slate-300 leading-snug">
                  This examination is timed with automated countdown, 5-minute warning alert, and auto-submit on expiration.
                </p>

                <button
                  onClick={() => handleStartExam(nextExam.id)}
                  className="w-full py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black uppercase tracking-wider text-xs shadow-md transition-all hover:scale-102"
                >
                  Launch Examination Room →
                </button>
              </div>
            )}

            {/* Quick Academic Alerts Mini-Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#002366]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#002366]">Academic Alerts</h4>
                </div>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className="text-[10px] font-bold uppercase text-[#C5A059] hover:underline"
                >
                  Open All ({totalAlertsCount}) →
                </button>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span className="text-slate-800 font-medium">Pending Assignments:</span>
                  </div>
                  <strong className="font-mono text-rose-700 font-bold">{pendingAssignmentsCount}</strong>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-slate-800 font-medium">Graded Submissions:</span>
                  </div>
                  <strong className="font-mono text-emerald-700 font-bold">{recentGradedCount}</strong>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('notifications')}
                className="w-full py-2 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                Open Notification Center
              </button>
            </div>

            {/* Financial Account Standing */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-[#002366] uppercase tracking-widest">
                  Tuition Account
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C5A059]/10 text-[#002366] border border-[#C5A059]/30">
                  Active Term
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Tuition Total (Fall 2026):</span>
                  <span className="font-semibold text-slate-800">$800.00</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Library & Technology:</span>
                  <span className="font-semibold text-slate-800">$150.00</span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-700 font-bold">
                  <span>Total Paid to Date:</span>
                  <span>-$500.00</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-900">
                  <span className="text-[#002366] uppercase text-xs font-bold">Current Balance Due:</span>
                  <span className="text-[#002366] font-display font-black text-lg">${currentUser.financialBalance || 450}.00</span>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('finance')}
                className="w-full py-2.5 rounded-lg bg-[#002366] hover:bg-[#001A4D] text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                Manage Fees & Pay Invoice →
              </button>
            </div>

            {/* Official University Bulletins & Academic Notices Widget */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-[#002366] uppercase tracking-widest flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>University Bulletins</span>
                </span>
                <button
                  onClick={() => setCurrentView('bulletins')}
                  className="text-[10px] font-bold text-[#C5A059] hover:underline uppercase tracking-wider"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3">
                {studentBulletins.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => handleOpenBulletin(b)}
                    className="p-3 rounded-lg border border-slate-100 hover:border-[#002366] hover:bg-slate-50 cursor-pointer transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono font-bold text-[#002366]">{b.bulletinNumber}</span>
                      <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                        b.priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                        b.priority === 'Urgent' ? 'bg-amber-100 text-amber-900' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {b.priority}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#002366] line-clamp-1">
                      {b.title}
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-2">
                      {b.summary}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official BIBU TV Online Widget Card */}
            <div className="bg-gradient-to-br from-[#001744] to-[#002366] text-white rounded-xl p-5 shadow-md border-t-4 border-rose-500 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-rose-600 text-white flex items-center gap-1">
                  <Tv className="w-3 h-3" />
                  <span>BIBU TV Online</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </span>
                <span className="text-xs text-[#C5A059] font-bold font-mono">24/7 Channel</span>
              </div>

              <div>
                <h4 className="text-sm font-display font-bold text-white">
                  University Video Channel & Expository Broadcasts
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Stream anointed sermons, faculty theology masterclasses, and global commencement broadcasts on the official BIBU TV player.
                </p>
              </div>

              <div className="pt-1 flex items-center gap-2">
                <button
                  id="student-dashboard-open-tv-card-btn"
                  onClick={() => setCurrentView('bibu-tv')}
                  className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-wider text-xs shadow-md transition-all hover:scale-102 flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch BIBU TV</span>
                </button>
                <button
                  onClick={() => setActiveTab('media')}
                  className="px-3 py-2 rounded-lg bg-[#001A4D] hover:bg-[#001438] text-[#C5A059] border border-[#C5A059]/40 font-bold text-xs transition-colors"
                  title="Media Library Tab"
                >
                  Library
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulletin Detail Modal */}
      {activeBulletinModal && (
        <BulletinDetailModal
          bulletin={activeBulletinModal}
          onClose={() => setActiveBulletinModal(null)}
        />
      )}
    </div>
  );
};
