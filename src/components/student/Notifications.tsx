import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  BookOpen,
  FileCheck2,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  CreditCard,
  FileText,
  Sparkles,
  Search,
  Filter,
  Check,
  X,
  Calendar,
  ExternalLink,
  Info
} from 'lucide-react';
import { Assignment, AssignmentSubmission, ExamAttempt, GradeRecord } from '../../types';

export type NotificationCategory = 'all' | 'pending_assignment' | 'graded_result' | 'exam' | 'progress';

export interface StudentNotificationItem {
  id: string;
  type: 'pending_assignment' | 'graded_result' | 'exam' | 'progress' | 'finance';
  title: string;
  courseCode?: string;
  courseTitle?: string;
  timestamp: string;
  isRead: boolean;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  summary: string;
  details?: {
    dueDate?: string;
    pointsPossible?: number;
    score?: number;
    percentage?: number;
    letterGrade?: string;
    feedback?: string;
    assessorName?: string;
    examDurationMins?: number;
    progressPercentage?: number;
    completedCount?: number;
    totalCount?: number;
    amountDue?: number;
  };
  actionType: 'open_classroom' | 'open_exam' | 'open_transcript' | 'open_finance' | 'none';
  targetId?: string;
}

interface NotificationsProps {
  mode?: 'embedded' | 'drawer' | 'popover';
  onClose?: () => void;
  onNavigate?: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({
  mode = 'embedded',
  onClose,
  onNavigate
}) => {
  const {
    currentUser,
    courses,
    modules,
    assignments,
    assignmentSubmissions,
    examinations,
    examAttempts,
    grades,
    completedLessonIds,
    setCurrentView,
    setSelectedCourseId,
    setSelectedLessonId,
    setSelectedExamId,
    getStudentEnrolledCourses
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`bibu_read_notifs_${currentUser.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedNotificationDetail, setSelectedNotificationDetail] = useState<StudentNotificationItem | null>(null);

  const enrolledCourses = getStudentEnrolledCourses(currentUser);
  const enrolledCourseIds = enrolledCourses.map(c => c.id);

  // Generate dynamic student progress and academic alerts
  const notifications: StudentNotificationItem[] = useMemo(() => {
    const items: StudentNotificationItem[] = [];

    // 1. Pending & Upcoming Assignments
    assignments.forEach(asg => {
      if (enrolledCourseIds.includes(asg.courseId)) {
        const course = courses.find(c => c.id === asg.courseId);
        const existingSub = assignmentSubmissions.find(
          s => s.assignmentId === asg.id && s.studentId === currentUser.id
        );

        if (!existingSub) {
          // Assignment not yet submitted
          items.push({
            id: `notif-asg-pending-${asg.id}`,
            type: 'pending_assignment',
            title: `Assignment Pending: ${asg.title}`,
            courseCode: course?.code || 'CRS',
            courseTitle: course?.title || asg.courseName,
            timestamp: `Due by ${asg.dueDate}`,
            isRead: readNotificationIds.includes(`notif-asg-pending-${asg.id}`),
            priority: 'urgent',
            summary: `Formal submission required for ${asg.courseName}. Max marks: ${asg.maxMarks} pts.`,
            details: {
              dueDate: asg.dueDate,
              pointsPossible: asg.maxMarks,
              feedback: asg.instructions
            },
            actionType: 'open_classroom',
            targetId: asg.courseId
          });
        }
      }
    });

    // 2. Graded Assignment Results & Assessor Feedback
    assignmentSubmissions
      .filter(s => s.studentId === currentUser.id && s.status === 'Graded')
      .forEach(sub => {
        const asg = assignments.find(a => a.id === sub.assignmentId);
        const course = courses.find(c => c.id === asg?.courseId);

        items.push({
          id: `notif-asg-graded-${sub.id}`,
          type: 'graded_result',
          title: `Assignment Graded: ${asg?.title || 'Course Paper'}`,
          courseCode: course?.code || 'CRS',
          courseTitle: course?.title || asg?.courseName,
          timestamp: sub.gradedAt ? `Graded on ${sub.gradedAt}` : 'Recently Graded',
          isRead: readNotificationIds.includes(`notif-asg-graded-${sub.id}`),
          priority: 'high',
          summary: `Official Grade Released: ${sub.grade || 0} / ${asg?.maxMarks || 100} pts with faculty theological feedback.`,
          details: {
            score: sub.grade,
            pointsPossible: asg?.maxMarks || 100,
            feedback: sub.feedback,
            assessorName: sub.gradedBy || 'Faculty Examiner'
          },
          actionType: 'open_transcript',
          targetId: asg?.courseId
        });
      });

    // 3. Graded Examination Results
    examAttempts
      .filter(att => att.studentId === currentUser.id && att.status === 'Graded')
      .forEach(att => {
        const exam = examinations.find(e => e.id === att.examId);
        items.push({
          id: `notif-exam-result-${att.id}`,
          type: 'graded_result',
          title: `Exam Score Confirmed: ${exam?.title || 'Proctored Exam'}`,
          courseCode: exam?.courseCode || 'EXAM',
          courseTitle: exam?.courseTitle || 'Theological Examination',
          timestamp: att.completedAt ? new Date(att.completedAt).toLocaleDateString() : 'Recent',
          isRead: readNotificationIds.includes(`notif-exam-result-${att.id}`),
          priority: 'normal',
          summary: `Final Score: ${att.score} pts (${att.percentage}%) • Result Grade: ${att.grade || 'Passed'}.`,
          details: {
            score: att.score,
            percentage: att.percentage,
            letterGrade: att.grade,
            feedback: att.examinerComments
          },
          actionType: 'open_transcript',
          targetId: exam?.id
        });
      });

    // 4. Active Examination Windows
    examinations.forEach(exam => {
      if (enrolledCourseIds.includes(exam.courseId)) {
        const hasAttempted = examAttempts.some(
          att => att.examId === exam.id && att.studentId === currentUser.id
        );
        if (!hasAttempted) {
          items.push({
            id: `notif-exam-active-${exam.id}`,
            type: 'exam',
            title: `Active Examination Room: ${exam.title}`,
            courseCode: exam.courseCode,
            courseTitle: exam.courseTitle,
            timestamp: `Duration: ${exam.durationMinutes} Mins`,
            isRead: readNotificationIds.includes(`notif-exam-active-${exam.id}`),
            priority: 'urgent',
            summary: `Online timed examination available. Passing threshold: ${exam.passMarks}%. Auto-saves answers.`,
            details: {
              examDurationMins: exam.durationMinutes,
              pointsPossible: exam.totalMarks
            },
            actionType: 'open_exam',
            targetId: exam.id
          });
        }
      }
    });

    // 5. Course Completion & Lesson Progress Milestones
    enrolledCourses.forEach(course => {
      const courseModules = modules.filter(m => m.courseId === course.id);
      const allCourseLessons = courseModules.flatMap(m => m.lessons);
      const completedCount = allCourseLessons.filter(l => completedLessonIds.includes(l.id)).length;
      const totalLessons = allCourseLessons.length || 4;
      const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 50;

      if (progressPercent < 100) {
        items.push({
          id: `notif-progress-${course.id}`,
          type: 'progress',
          title: `Course Progress Milestone: ${course.code}`,
          courseCode: course.code,
          courseTitle: course.title,
          timestamp: `${completedCount} of ${totalLessons} Lessons Finished (${progressPercent}%)`,
          isRead: readNotificationIds.includes(`notif-progress-${course.id}`),
          priority: 'normal',
          summary: `You are currently ${progressPercent}% through ${course.title}. Continue your theological lessons.`,
          details: {
            progressPercentage: progressPercent,
            completedCount,
            totalCount: totalLessons
          },
          actionType: 'open_classroom',
          targetId: course.id
        });
      }
    });

    return items;
  }, [
    currentUser,
    assignments,
    assignmentSubmissions,
    examinations,
    examAttempts,
    enrolledCourses,
    enrolledCourseIds,
    modules,
    completedLessonIds,
    readNotificationIds
  ]);

  // Filtered list
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      // Category filter
      if (activeCategory === 'pending_assignment' && notif.type !== 'pending_assignment') return false;
      if (activeCategory === 'graded_result' && notif.type !== 'graded_result') return false;
      if (activeCategory === 'exam' && notif.type !== 'exam') return false;
      if (activeCategory === 'progress' && notif.type !== 'progress') return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = notif.title.toLowerCase().includes(query);
        const matchesCode = notif.courseCode?.toLowerCase().includes(query);
        const matchesSummary = notif.summary.toLowerCase().includes(query);
        return matchesTitle || matchesCode || matchesSummary;
      }
      return true;
    });
  }, [notifications, activeCategory, searchQuery]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const pendingAssignmentCount = notifications.filter(n => n.type === 'pending_assignment').length;
  const gradedResultCount = notifications.filter(n => n.type === 'graded_result').length;

  const markAsRead = (id: string) => {
    const updated = Array.from(new Set([...readNotificationIds, id]));
    setReadNotificationIds(updated);
    try {
      localStorage.setItem(`bibu_read_notifs_${currentUser.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    const updated = Array.from(new Set([...readNotificationIds, ...allIds]));
    setReadNotificationIds(updated);
    try {
      localStorage.setItem(`bibu_read_notifs_${currentUser.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleAction = (item: StudentNotificationItem) => {
    markAsRead(item.id);
    if (item.actionType === 'open_classroom' && item.targetId) {
      setSelectedCourseId(item.targetId);
      setSelectedLessonId('les-herm-101');
      setCurrentView('classroom');
    } else if (item.actionType === 'open_exam' && item.targetId) {
      setSelectedExamId(item.targetId);
      setCurrentView('exam-taker');
    } else if (item.actionType === 'open_transcript') {
      setCurrentView('transcript');
    } else if (item.actionType === 'open_finance') {
      setCurrentView('finance');
    }
    if (onNavigate) onNavigate();
    if (onClose) onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${
        mode === 'drawer' ? 'h-full max-h-[85vh]' : 'w-full'
      }`}
    >
      {/* Header Bar */}
      <div className="bg-[#002366] text-white p-5 border-b border-[#001A4D] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-[#001A4D] text-[#C5A059] border border-[#C5A059]/40 shadow-inner">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono font-black text-[10px] ring-2 ring-[#002366] animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-display font-black text-white">
                Academic Alerts & Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C5A059] text-[#002366] font-bold uppercase tracking-wider">
                  {unreadCount} New
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300">
              Live monitoring of pending coursework, graded papers, exams, and milestones
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] hover:text-white px-2.5 py-1 rounded bg-[#001A4D] hover:bg-[#001438] border border-[#C5A059]/30 transition-all flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              <span>Mark All Read</span>
            </button>
          )}
          {mode === 'drawer' && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#001A4D]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 bg-[#F8F9FB] border-b border-slate-200 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search alerts by course, assignment, or keyword..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002366]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === 'all'
                ? 'bg-[#002366] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>All Alerts</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
              {notifications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('pending_assignment')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === 'pending_assignment'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Pending Assignments</span>
            {pendingAssignmentCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono font-bold">
                {pendingAssignmentCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveCategory('graded_result')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === 'graded_result'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Graded Results</span>
            {gradedResultCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono font-bold">
                {gradedResultCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveCategory('progress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === 'progress'
                ? 'bg-[#C5A059] text-[#002366] shadow-xs font-black'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Milestones</span>
          </button>

          <button
            onClick={() => setActiveCategory('exam')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === 'exam'
                ? 'bg-[#001A4D] text-[#C5A059] border border-[#C5A059]'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Exams</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-4 sm:p-5 space-y-3 overflow-y-auto max-h-[500px]">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-[#F8F9FB] rounded-xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800 font-display">
                All Coursework & Alerts are Up to Date!
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No active notifications found for this category. You have satisfied all current submissions and exam reviews.
              </p>
            </div>
          </div>
        ) : (
          filteredNotifications.map(item => {
            const isRead = item.isRead;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  isRead
                    ? 'bg-white border-slate-200 opacity-90'
                    : item.type === 'pending_assignment'
                    ? 'bg-rose-50/50 border-rose-200 shadow-xs'
                    : item.type === 'graded_result'
                    ? 'bg-emerald-50/50 border-emerald-200 shadow-xs'
                    : item.type === 'exam'
                    ? 'bg-blue-50/50 border-blue-200 shadow-xs'
                    : 'bg-[#F8F9FB] border-slate-200 shadow-xs'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Icon Badge */}
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        item.type === 'pending_assignment'
                          ? 'bg-rose-100 text-rose-700'
                          : item.type === 'graded_result'
                          ? 'bg-emerald-100 text-emerald-700'
                          : item.type === 'exam'
                          ? 'bg-blue-100 text-[#002366]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.type === 'pending_assignment' && <AlertTriangle className="w-4 h-4" />}
                      {item.type === 'graded_result' && <Award className="w-4 h-4" />}
                      {item.type === 'exam' && <Clock className="w-4 h-4" />}
                      {item.type === 'progress' && <TrendingUp className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.courseCode && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-[#002366]">
                            {item.courseCode}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded ${
                            item.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-800 font-black'
                              : item.priority === 'high'
                              ? 'bg-emerald-100 text-emerald-900 font-black'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.type.replace('_', ' ')}
                        </span>
                        {!isRead && (
                          <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                        )}
                      </div>

                      <h3 className="text-sm font-bold font-display text-slate-900">
                        {item.title}
                      </h3>
                      {item.courseTitle && (
                        <div className="text-[11px] text-slate-500 font-medium">
                          {item.courseTitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {item.timestamp}
                  </span>
                </div>

                {/* Summary / Feedback Message */}
                <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-2.5 rounded-lg border border-slate-100">
                  {item.summary}
                </p>

                {/* Graded Details Highlight Box */}
                {item.details?.score !== undefined && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium">Awarded Score: </span>
                      <strong className="text-emerald-800 text-sm font-mono font-black">
                        {item.details.score} / {item.details.pointsPossible || 100} pts
                      </strong>
                      {item.details.percentage && (
                        <span className="text-emerald-700 font-bold ml-1">
                          ({item.details.percentage}%)
                        </span>
                      )}
                    </div>
                    {item.details.assessorName && (
                      <div className="text-[11px] text-slate-600 italic">
                        Assessed by: <strong>{item.details.assessorName}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* Feedback Excerpt if available */}
                {item.details?.feedback && (
                  <div className="text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 text-slate-600 italic">
                    <span className="font-bold text-[#002366] not-italic">Assessor Comments: </span>
                    "{item.details.feedback}"
                  </div>
                )}

                {/* Card Footer Actions */}
                <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    {!isRead ? (
                      <button
                        onClick={() => markAsRead(item.id)}
                        className="text-[11px] text-slate-500 hover:text-[#002366] font-semibold underline flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Mark as read</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">✓ Read</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(item)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-xs transition-all flex items-center gap-1.5 ${
                        item.type === 'pending_assignment'
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : item.type === 'graded_result'
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : item.type === 'exam'
                          ? 'bg-[#002366] hover:bg-[#001A4D] text-white'
                          : 'bg-[#C5A059] hover:bg-[#B38E46] text-[#002366]'
                      }`}
                    >
                      <span>
                        {item.actionType === 'open_classroom'
                          ? 'Go to Classroom'
                          : item.actionType === 'open_exam'
                          ? 'Launch Exam Room'
                          : item.actionType === 'open_transcript'
                          ? 'View Official Transcript'
                          : item.actionType === 'open_finance'
                          ? 'Pay Statement'
                          : 'View Details'}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3.5 bg-[#F8F9FB] border-t border-slate-200 text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
        <Info className="w-3.5 h-3.5 text-[#002366]" />
        <span>
          Synchronized with the Office of the Registrar and Faculty Assessment Board.
        </span>
      </div>
    </div>
  );
};
