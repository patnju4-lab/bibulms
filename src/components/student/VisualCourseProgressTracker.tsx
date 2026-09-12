import React, { useState, useMemo } from 'react';
import { Course, Module, Lesson, Assignment, AssignmentSubmission, Examination, ExamAttempt, User } from '../../types';
import { CircularProgressBar } from '../common/CircularProgressBar';
import {
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Play,
  CheckCircle,
  Search,
  Filter,
  Sparkles,
  Layers,
  GraduationCap,
  BookCheck,
  ExternalLink,
  Target,
  FileText
} from 'lucide-react';

export interface VisualCourseProgressTrackerProps {
  currentUser?: User;
  courses: Course[];
  modules: Module[];
  completedLessonIds: string[];
  markLessonComplete?: (lessonId: string) => void;
  assignments?: Assignment[];
  assignmentSubmissions?: AssignmentSubmission[];
  examinations?: Examination[];
  examAttempts?: ExamAttempt[];
  onOpenClassroom: (courseId: string, lessonId?: string) => void;
  className?: string;
  defaultCourseId?: string;
}

interface ModuleProgressData {
  module: Module;
  course: Course;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  status: 'Completed' | 'In Progress' | 'Not Started';
  estimatedHours: number;
  hasAssignment: boolean;
  assignmentCompleted: boolean;
  lessons: Lesson[];
}

export const VisualCourseProgressTracker: React.FC<VisualCourseProgressTrackerProps> = ({
  currentUser,
  courses,
  modules,
  completedLessonIds = [],
  markLessonComplete,
  assignments = [],
  assignmentSubmissions = [],
  examinations = [],
  examAttempts = [],
  onOpenClassroom,
  className = '',
  defaultCourseId
}) => {
  // Enrolled courses for this student
  const enrolledCourses = useMemo(() => {
    if (!currentUser) return courses.slice(0, 3);
    if (currentUser.enrolledCourseIds && currentUser.enrolledCourseIds.length > 0) {
      const matched = courses.filter(c => currentUser.enrolledCourseIds?.includes(c.id));
      if (matched.length > 0) return matched;
    }
    // Fallback default sample enrolled courses
    const sampleIds = ['crs-herm-301', 'crs-theo-201', 'crs-past-401'];
    const fallback = courses.filter(c => sampleIds.includes(c.id));
    return fallback.length > 0 ? fallback : courses.slice(0, 3);
  }, [currentUser, courses]);

  // Selected course tab: 'all' or course ID
  const [selectedCourseId, setSelectedCourseId] = useState<string>(defaultCourseId || 'all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed' | 'not_started'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedModuleIds, setExpandedModuleIds] = useState<Record<string, boolean>>({});

  // Toggle expansion of a module to inspect lessons
  const toggleModuleExpand = (moduleId: string) => {
    setExpandedModuleIds(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Expand all / collapse all
  const handleExpandAll = (expand: boolean) => {
    if (!expand) {
      setExpandedModuleIds({});
      return;
    }
    const all: Record<string, boolean> = {};
    moduleProgressList.forEach(m => {
      all[m.module.id] = true;
    });
    setExpandedModuleIds(all);
  };

  // Fallback module generator if a course has no modules defined in database
  const getModulesForCourse = (course: Course): Module[] => {
    const matched = modules.filter(m => m.courseId === course.id);
    if (matched.length > 0) {
      return [...matched].sort((a, b) => a.order - b.order);
    }

    // Generate standard theological curriculum modules for courses without explicit modules
    const defaultModularStructure: { title: string; desc: string; lessonsCount: number }[] = [
      {
        title: `Module 1: Foundations & Historical Framework of ${course.title}`,
        desc: 'Core theological presuppositions, historical background, and biblical canonical context.',
        lessonsCount: 3
      },
      {
        title: `Module 2: Exegetical Principles & Doctrinal Analysis`,
        desc: 'In-depth engagement with original texts, biblical languages, and systematic structures.',
        lessonsCount: 3
      },
      {
        title: `Module 3: Contemporary Ministry & Pastoral Application`,
        desc: 'Bridging timeless theological doctrine into pastoral leadership and cross-cultural ministry.',
        lessonsCount: 3
      },
      {
        title: `Module 4: Synthesis, Research Capstone & Review`,
        desc: 'Comprehensive integration of coursework, research methodology, and final review.',
        lessonsCount: 2
      }
    ];

    return defaultModularStructure.map((struct, idx) => ({
      id: `mod-${course.id}-${idx + 1}`,
      courseId: course.id,
      order: idx + 1,
      title: struct.title,
      description: struct.desc,
      lessons: Array.from({ length: struct.lessonsCount }, (_, lIdx) => ({
        id: `les-${course.id}-${idx + 1}-${lIdx + 1}`,
        moduleId: `mod-${course.id}-${idx + 1}`,
        courseId: course.id,
        order: lIdx + 1,
        title: `Lesson ${idx + 1}.${lIdx + 1}: ${
          lIdx === 0 ? 'Theological Foundations' : lIdx === 1 ? 'Exegetical Analysis' : 'Practical Pastoral Ministry'
        }`,
        introduction: `Comprehensive instruction examining the core tenets of ${course.title}.`,
        scriptureReferences: course.biblePassages?.slice(0, 2) || ['2 Timothy 2:15'],
        notes: 'Detailed lecture notes and pastoral application commentary.',
        keyConcepts: ['Biblical Authority', 'Theological Synthesis', 'Ministerial Integrity'],
        ministryApplication: 'Apply the foundational concepts into local church teaching and leadership.',
        reflectionQuestions: ['How does this lesson inform your daily pastoral walk and preaching?'],
        downloadableMaterials: []
      }))
    }));
  };

  // Compile module progress across all enrolled courses
  const moduleProgressList: ModuleProgressData[] = useMemo(() => {
    const list: ModuleProgressData[] = [];

    enrolledCourses.forEach(course => {
      const courseModules = getModulesForCourse(course);

      courseModules.forEach(mod => {
        const totalLessons = mod.lessons.length;
        const completedLessons = mod.lessons.filter(l => completedLessonIds.includes(l.id)).length;
        const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        let status: 'Completed' | 'In Progress' | 'Not Started' = 'Not Started';
        if (percentage >= 100) {
          status = 'Completed';
        } else if (percentage > 0) {
          status = 'In Progress';
        }

        // Check if there are assignments linked to course
        const courseAssignments = assignments.filter(a => a.courseId === course.id);
        const hasAssignment = courseAssignments.length > 0;
        const assignmentCompleted = courseAssignments.some(a =>
          assignmentSubmissions.some(s => s.assignmentId === a.id && s.studentId === currentUser?.id)
        );

        list.push({
          module: mod,
          course,
          totalLessons,
          completedLessons,
          percentage,
          status,
          estimatedHours: totalLessons * 1.5,
          hasAssignment,
          assignmentCompleted,
          lessons: mod.lessons
        });
      });
    });

    return list;
  }, [enrolledCourses, modules, completedLessonIds, assignments, assignmentSubmissions, currentUser]);

  // Filtered module list based on course selection, status filter, and search
  const filteredModules = useMemo(() => {
    return moduleProgressList.filter(item => {
      // Course filter
      if (selectedCourseId !== 'all' && item.course.id !== selectedCourseId) {
        return false;
      }

      // Status filter
      if (statusFilter === 'in_progress' && item.status !== 'In Progress') return false;
      if (statusFilter === 'completed' && item.status !== 'Completed') return false;
      if (statusFilter === 'not_started' && item.status !== 'Not Started') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.module.title.toLowerCase().includes(q);
        const matchesDesc = item.module.description.toLowerCase().includes(q);
        const matchesCourse = item.course.title.toLowerCase().includes(q) || item.course.code.toLowerCase().includes(q);
        const matchesLesson = item.lessons.some(l => l.title.toLowerCase().includes(q));
        return matchesTitle || matchesDesc || matchesCourse || matchesLesson;
      }

      return true;
    });
  }, [moduleProgressList, selectedCourseId, statusFilter, searchQuery]);

  // Aggregate metrics
  const totalEnrolledModules = moduleProgressList.length;
  const completedModulesCount = moduleProgressList.filter(m => m.status === 'Completed').length;
  const inProgressModulesCount = moduleProgressList.filter(m => m.status === 'In Progress').length;
  const notStartedModulesCount = moduleProgressList.filter(m => m.status === 'Not Started').length;

  const totalEnrolledLessons = moduleProgressList.reduce((acc, m) => acc + m.totalLessons, 0);
  const completedEnrolledLessons = moduleProgressList.reduce((acc, m) => acc + m.completedLessons, 0);

  const overallModularAverage = useMemo(() => {
    if (totalEnrolledModules === 0) return 0;
    const sum = moduleProgressList.reduce((acc, m) => acc + m.percentage, 0);
    return Math.round(sum / totalEnrolledModules);
  }, [moduleProgressList, totalEnrolledModules]);

  // Selected Course metrics (if focusing on a specific course)
  const activeCourse = enrolledCourses.find(c => c.id === selectedCourseId);
  const activeCourseModules = useMemo(() => {
    if (!activeCourse) return [];
    return moduleProgressList.filter(m => m.course.id === activeCourse.id);
  }, [activeCourse, moduleProgressList]);

  const activeCourseAverage = useMemo(() => {
    if (activeCourseModules.length === 0) return 0;
    const sum = activeCourseModules.reduce((acc, m) => acc + m.percentage, 0);
    return Math.round(sum / activeCourseModules.length);
  }, [activeCourseModules]);

  // Find the exact "Next Up" module and lesson to study
  const nextUpRecommendation = useMemo(() => {
    // Look for first in-progress module
    const inProgress = moduleProgressList.find(m => m.status === 'In Progress');
    if (inProgress) {
      const nextLesson = inProgress.lessons.find(l => !completedLessonIds.includes(l.id)) || inProgress.lessons[0];
      return { moduleData: inProgress, lesson: nextLesson };
    }
    // Otherwise look for first not started
    const notStarted = moduleProgressList.find(m => m.status === 'Not Started');
    if (notStarted) {
      return { moduleData: notStarted, lesson: notStarted.lessons[0] };
    }
    // Fallback to first module
    if (moduleProgressList.length > 0) {
      return { moduleData: moduleProgressList[0], lesson: moduleProgressList[0].lessons[0] };
    }
    return null;
  }, [moduleProgressList, completedLessonIds]);

  return (
    <div id="visual-course-progress-tracker" className={`space-y-6 ${className}`}>
      {/* HEADER BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#002366] text-[#C5A059] shadow-xs">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-display text-[#002366] tracking-tight">
                  Course & Enrolled Modules Progress Tracker
                </h2>
                <p className="text-xs text-slate-500">
                  Visual completion percentages across every enrolled course and instructional module.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Enrolled Modules Summary Badges */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5 text-[#002366]" />
              <span>{totalEnrolledModules} Total Modules</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{completedModulesCount} Completed</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#002366]" />
              <span>{inProgressModulesCount} In Progress</span>
            </span>
          </div>
        </div>

        {/* OVERALL AGGREGATE STATS BANNER WITH CIRCULAR GAUGES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-br from-slate-50 via-slate-50/50 to-blue-50/30 p-4 sm:p-5 rounded-xl border border-slate-200">
          {/* Main Enrolled Curriculum Circular Progress Gauge */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <CircularProgressBar
              percentage={selectedCourseId === 'all' ? overallModularAverage : activeCourseAverage}
              size={84}
              strokeWidth={7}
              subText="Syllabus"
              textSize="text-sm font-black"
            />
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                {selectedCourseId === 'all' ? 'All Enrolled Modules' : activeCourse?.code || 'Course'}
              </span>
              <div className="text-base font-bold font-display text-[#002366]">
                {selectedCourseId === 'all' ? `${overallModularAverage}% Total Complete` : `${activeCourseAverage}% Completed`}
              </div>
              <p className="text-xs text-slate-500">
                {completedModulesCount} of {totalEnrolledModules} modules fully mastered
              </p>
            </div>
          </div>

          {/* Lessons Completion Stat */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Instructional Lessons
              </span>
              <BookOpen className="w-4 h-4 text-[#002366]" />
            </div>
            <div>
              <div className="text-2xl font-black font-display text-[#002366]">
                {completedEnrolledLessons} <span className="text-xs text-slate-400 font-normal">/ {totalEnrolledLessons}</span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {totalEnrolledLessons > 0 ? Math.round((completedEnrolledLessons / totalEnrolledLessons) * 100) : 0}% of lecture units completed
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#002366] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${totalEnrolledLessons > 0 ? Math.round((completedEnrolledLessons / totalEnrolledLessons) * 100) : 0}%`
                }}
              />
            </div>
          </div>

          {/* Next Recommended Module to Study */}
          {nextUpRecommendation ? (
            <div className="bg-gradient-to-br from-[#002366] to-[#001744] text-white p-4 rounded-xl shadow-xs flex flex-col justify-between space-y-2 border border-blue-900">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Next Study Milestone</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-200 font-mono">
                  {nextUpRecommendation.moduleData.course.code}
                </span>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white line-clamp-1">
                  {nextUpRecommendation.moduleData.module.title}
                </div>
                <div className="text-[11px] text-slate-300 line-clamp-1">
                  {nextUpRecommendation.lesson.title}
                </div>
              </div>
              <button
                id="btn-resume-next-module-tracker"
                onClick={() => onOpenClassroom(nextUpRecommendation.moduleData.course.id, nextUpRecommendation.lesson.id)}
                className="w-full py-1.5 px-3 rounded-lg bg-[#C5A059] hover:bg-[#b08e4d] text-[#002366] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <span>Resume Lesson Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center text-center">
              <div className="text-xs text-slate-500">
                <BookCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span>All enrolled modules are up to date!</span>
              </div>
            </div>
          )}
        </div>

        {/* COURSE SELECTION TABS & CONTROLS */}
        <div className="space-y-3 pt-2">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Filter by Enrolled Course:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              id="tracker-tab-course-all"
              onClick={() => setSelectedCourseId('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all shrink-0 flex items-center gap-1.5 ${
                selectedCourseId === 'all'
                  ? 'bg-[#002366] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>All Courses</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {enrolledCourses.length}
              </span>
            </button>

            {enrolledCourses.map(course => {
              const courseMods = moduleProgressList.filter(m => m.course.id === course.id);
              const coursePct = courseMods.length > 0
                ? Math.round(courseMods.reduce((acc, m) => acc + m.percentage, 0) / courseMods.length)
                : 0;

              return (
                <button
                  key={course.id}
                  id={`tracker-tab-course-${course.id}`}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all shrink-0 flex items-center gap-2 ${
                    selectedCourseId === course.id
                      ? 'bg-[#002366] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{course.code}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    coursePct === 100 ? 'bg-emerald-500 text-white' :
                    coursePct > 0 ? 'bg-amber-400 text-slate-950 font-bold' :
                    'bg-slate-300 text-slate-700'
                  }`}>
                    {coursePct}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STATUS FILTERS & SEARCH ROW */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Status buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0 overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === 'all'
                  ? 'bg-[#002366] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({moduleProgressList.length})
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === 'in_progress'
                  ? 'bg-[#002366] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In Progress ({inProgressModulesCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === 'completed'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({completedModulesCount})
            </button>
            <button
              onClick={() => setStatusFilter('not_started')}
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === 'not_started'
                  ? 'bg-[#002366] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Not Started ({notStartedModulesCount})
            </button>
          </div>

          {/* Search bar & Expand All */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search modules & topics..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#002366] bg-slate-50 focus:bg-white transition-all"
              />
            </div>
            <button
              onClick={() => handleExpandAll(Object.keys(expandedModuleIds).length === 0)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold shrink-0"
              title="Expand or collapse lesson details across all modules"
            >
              {Object.keys(expandedModuleIds).length > 0 ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
        </div>
      </div>

      {/* MODULES VISUAL GRID */}
      {filteredModules.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800">No enrolled modules match your filter</h3>
            <p className="text-xs text-slate-500">
              Try changing your course tab, clearing your search query, or resetting the status filter.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCourseId('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-[#002366] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#001A4D] transition-all shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredModules.map((item) => {
            const isExpanded = !!expandedModuleIds[item.module.id];
            const isCompleted = item.percentage === 100;
            const isInProgress = item.percentage > 0 && item.percentage < 100;

            return (
              <div
                key={item.module.id}
                id={`module-card-${item.module.id}`}
                className={`bg-white rounded-2xl border transition-all duration-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 ${
                  isCompleted
                    ? 'border-emerald-200 bg-gradient-to-b from-white to-emerald-50/20 hover:border-emerald-300'
                    : isInProgress
                    ? 'border-blue-200 bg-gradient-to-b from-white to-blue-50/20 hover:border-[#002366]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* CARD HEADER WITH CIRCULAR PROGRESS GAUGE */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#002366]/10 text-[#002366] font-mono">
                        {item.course.code} • MODULE {item.module.order}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isInProgress
                            ? 'bg-blue-100 text-[#002366]'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Mastered</span>
                          </>
                        ) : isInProgress ? (
                          <>
                            <Clock className="w-3 h-3 text-[#002366]" />
                            <span>In Progress</span>
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-3 h-3 text-slate-400" />
                            <span>Not Started</span>
                          </>
                        )}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2">
                      {item.module.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.module.description}
                    </p>
                  </div>

                  {/* CIRCULAR PROGRESS BAR COMPONENT */}
                  <div className="shrink-0 flex flex-col items-center">
                    <CircularProgressBar
                      percentage={item.percentage}
                      size={68}
                      strokeWidth={6}
                      subText="Complete"
                      textSize="text-xs font-black"
                    />
                  </div>
                </div>

                {/* METRICS & DETAILS ROW */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#002366]" />
                      <span className="font-semibold text-slate-800">
                        {item.completedLessons} / {item.totalLessons}
                      </span>
                      <span className="text-slate-400">Lessons</span>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>~{item.estimatedHours} hrs</span>
                    </span>
                  </div>

                  {item.hasAssignment && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.assignmentCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                    }`}>
                      {item.assignmentCompleted ? 'Paper Done ✓' : 'Paper Assigned'}
                    </span>
                  )}
                </div>

                {/* EXPANDABLE LESSONS CHECKLIST */}
                {isExpanded && (
                  <div className="pt-2 space-y-2 border-t border-slate-100 animate-in fade-in">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Module Instructional Units</span>
                      <span>Completion Status</span>
                    </div>

                    <div className="space-y-1.5">
                      {item.lessons.map((lesson, idx) => {
                        const isLessonDone = completedLessonIds.includes(lesson.id);

                        return (
                          <div
                            key={lesson.id}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                              isLessonDone
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="font-mono text-[10px] text-slate-400 shrink-0">
                                {item.module.order}.{idx + 1}
                              </span>
                              <span className="font-semibold truncate">
                                {lesson.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {/* Quick Mark Complete Button */}
                              {markLessonComplete && (
                                <button
                                  id={`btn-toggle-lesson-${lesson.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markLessonComplete(lesson.id);
                                  }}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                                    isLessonDone
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-[#002366] hover:text-white'
                                  }`}
                                  title={isLessonDone ? 'Lesson Completed' : 'Click to mark lesson complete'}
                                >
                                  {isLessonDone ? 'Done ✓' : 'Mark Done'}
                                </button>
                              )}

                              {/* Jump to Classroom */}
                              <button
                                onClick={() => onOpenClassroom(item.course.id, lesson.id)}
                                className="p-1 rounded text-slate-500 hover:text-[#002366] hover:bg-slate-200"
                                title="Study this lesson in digital classroom"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* CARD ACTIONS */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleModuleExpand(item.module.id)}
                    className="text-xs font-semibold text-slate-600 hover:text-[#002366] flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-100 transition-all"
                  >
                    <span>{isExpanded ? 'Hide Lessons' : `View ${item.lessons.length} Lessons`}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    id={`btn-resume-module-${item.module.id}`}
                    onClick={() => onOpenClassroom(item.course.id, item.lessons[0]?.id)}
                    className={`py-1.5 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-2xs ${
                      isCompleted
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-[#002366] hover:bg-[#001A4D] text-white'
                    }`}
                  >
                    <span>{isCompleted ? 'Review Module' : 'Study Module'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FOOTER CALLOUT / THEOLOGICAL MASTERY BADGE */}
      {completedModulesCount > 0 && (
        <div className="bg-gradient-to-r from-emerald-900 via-[#002366] to-[#001744] text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-emerald-300">
                Theological Academic Achievement
              </div>
              <div className="text-sm sm:text-base font-bold text-white">
                {completedModulesCount} Modular Competencies Fully Mastered
              </div>
              <p className="text-xs text-slate-300">
                Your completed modules are recorded toward your official transcript and degree clearance.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenClassroom(enrolledCourses[0]?.id || '')}
            className="px-4 py-2 bg-white text-[#002366] hover:bg-slate-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4 text-[#C5A059]" />
            <span>Continue Degree Study</span>
          </button>
        </div>
      )}
    </div>
  );
};
