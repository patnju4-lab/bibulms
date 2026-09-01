import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversityLogo } from '../common/UniversityLogo';
import {
  BookOpen,
  CheckCircle2,
  FileText,
  Headphones,
  Video,
  Download,
  HelpCircle,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Send,
  Upload,
  Clock,
  Award,
  Lock,
  ShieldCheck,
  ShieldAlert,
  LogIn,
  UserPlus,
  GraduationCap,
  AlertCircle,
  FileQuestion,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { Lesson, Assignment } from '../../types';

export const OnlineClassroom: React.FC = () => {
  const {
    currentUser,
    selectedCourseId,
    selectedLessonId,
    setSelectedLessonId,
    courses,
    modules,
    completedLessonIds,
    markLessonComplete,
    assignments,
    assignmentSubmissions,
    submitAssignment,
    setCurrentView,
    setSelectedExamId,
    examinations,
    openAuthModal,
    isStudentEnrolledInCourse,
    getStudentEnrolledCourses,
    requestCourseEnrolment
  } = useApp();

  const [activeTab, setActiveTab] = useState<'content' | 'assignments' | 'quiz' | 'discussion'>('content');

  // Enrolment request local state
  const [enrolmentReason, setEnrolmentReason] = useState('');
  const [enrolmentFeedback, setEnrolmentFeedback] = useState<string | null>(null);
  const [isSubmittingEnrolment, setIsSubmittingEnrolment] = useState(false);

  // Assignment submission local state
  const [submissionText, setSubmissionText] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState('');

  // Lesson Quiz local state
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Discussion state
  const [forumPosts, setForumPosts] = useState([
    {
      id: 'post-1',
      author: 'Pastor David Emmanuel',
      date: 'Aug 18, 2026',
      content: 'In Lesson 1.1, how should we pastorally explain the difference between plenary inspiration and mechanical dictation to a lay congregation?',
      replies: [
        {
          author: 'Dr. Thomas E. Wright (Professor)',
          date: 'Aug 19, 2026',
          content: 'Excellent inquiry, Pastor David. Emphasize that God utilized the human author\'s vocabulary, personality, and historical context without obliterating their humanity, yet superintended every word so that it remains infallible.'
        }
      ]
    }
  ]);
  const [newPostContent, setNewPostContent] = useState('');

  const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const courseModules = modules.filter((m) => m.courseId === currentCourse?.id);
  
  // Find current lesson
  let currentLesson: Lesson | undefined;
  for (const m of courseModules) {
    const found = m.lessons.find((l) => l.id === selectedLessonId);
    if (found) {
      currentLesson = found;
      break;
    }
  }
  if (!currentLesson && courseModules[0]?.lessons[0]) {
    currentLesson = courseModules[0].lessons[0];
  }

  const currentAssignment = assignments.find((a) => a.courseId === currentCourse?.id) || assignments[0];
  const mySubmission = assignmentSubmissions.find((s) => s.assignmentId === currentAssignment?.id);

  // Check Authentication & Enrolment
  const isAuthenticated = currentUser && currentUser.role !== 'guest';
  const isEnrolled = isStudentEnrolledInCourse(currentCourse.id);

  const handleRequestEnrolment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingEnrolment(true);
    const res = requestCourseEnrolment(currentCourse.id, enrolmentReason);
    setEnrolmentFeedback(res.message);
    setIsSubmittingEnrolment(false);
    setEnrolmentReason('');
  };

  // ----------------------------------------------------
  // GATE 1: GUEST USER / UNLOGGED VISITOR
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-fade-in">
        {/* Security Access Gate Card */}
        <div className="bg-white rounded-3xl border-2 border-[#002366] shadow-2xl overflow-hidden">
          <div className="bg-[#002366] text-white p-6 sm:p-8 border-b-4 border-[#C5A059] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-[#001A4D] rounded-2xl border border-[#C5A059]/40 text-[#C5A059] shadow-inner">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/10 text-[#C5A059] text-[10px] font-black uppercase tracking-wider mb-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Central LMS Protection Gate</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                  STUDENT LOGIN REQUIRED
                </h1>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-mono text-slate-300 bg-white/10 px-3 py-1 rounded-full border border-white/10 block sm:inline-block">
                Access Level: Restricted (Enrolled Students Only)
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            {/* Notice Description */}
            <div className="p-5 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed space-y-1">
                <span className="font-bold block uppercase tracking-wide text-amber-950">
                  Theological Course Content Protection Rule
                </span>
                <p>
                  No student or visitor may open, read, download, or study course lectures, exegetical notes, audio masterclasses, assignments, quizzes, or examinations without creating a student account and logging in.
                </p>
              </div>
            </div>

            {/* Public Course Information (Non-sensitive overview only) */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black px-2.5 py-1 rounded bg-[#002366] text-white">
                    {currentCourse.code}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {currentCourse.creditHours} Credit Hours
                  </span>
                </div>
                <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                  Instructor: {currentCourse.instructorName}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-display font-bold text-[#002366]">
                  {currentCourse.title}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentCourse.description}
                </p>
              </div>

              {/* Locked Content Summary */}
              <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-slate-400 font-bold text-xs uppercase flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> Lessons
                  </div>
                  <div className="text-sm font-black text-slate-700 mt-1">4 Modules</div>
                  <div className="text-[10px] text-rose-600 font-bold">Locked</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-slate-400 font-bold text-xs uppercase flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> Exegetical Notes
                  </div>
                  <div className="text-sm font-black text-slate-700 mt-1">Complete Texts</div>
                  <div className="text-[10px] text-rose-600 font-bold">Locked</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-slate-400 font-bold text-xs uppercase flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> Assignments
                  </div>
                  <div className="text-sm font-black text-slate-700 mt-1">Formal Papers</div>
                  <div className="text-[10px] text-rose-600 font-bold">Locked</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-slate-400 font-bold text-xs uppercase flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> Exam Room
                  </div>
                  <div className="text-sm font-black text-slate-700 mt-1">Central Exam</div>
                  <div className="text-[10px] text-rose-600 font-bold">Locked</div>
                </div>
              </div>
            </div>

            {/* Authentication Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  onClick={() => openAuthModal('login', 'classroom', 'Sign in to access your course lectures and learning materials.')}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-102"
                >
                  <LogIn className="w-4 h-4 text-[#C5A059]" />
                  <span>Log In to Student Portal</span>
                </button>

                <button
                  onClick={() => openAuthModal('register', 'classroom', 'Create a student account to get started with BIBU LMS.')}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-102"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Student Account</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 text-xs text-slate-500">
                <span>Not yet an admitted student at BIBU?</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentView('admissions')}
                    className="font-bold text-[#002366] hover:underline"
                  >
                    Apply for Admissions →
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => setCurrentView('programs')}
                    className="font-bold text-slate-600 hover:text-[#002366]"
                  >
                    Browse Academic Catalog
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // GATE 2: AUTHENTICATED USER BUT NOT ENROLLED IN THIS COURSE
  // ----------------------------------------------------
  if (!isEnrolled) {
    const enrolledCoursesList = getStudentEnrolledCourses(currentUser);

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-fade-in">
        <div className="bg-white rounded-3xl border-2 border-amber-400 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 sm:p-8 border-b-4 border-[#002366] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-white shadow-inner">
                <ShieldAlert className="w-7 h-7 text-amber-200" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-black/20 text-amber-200 text-[10px] font-black uppercase tracking-wider mb-1">
                  <span>Enrolment Verification Required</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                  COURSE ACCESS RESTRICTED
                </h1>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-mono text-amber-100 bg-black/20 px-3 py-1 rounded-full border border-white/10 block sm:inline-block">
                Status: Not Currently Enrolled
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            {/* Student Profile Overview */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block">Signed In Student:</span>
                <span className="font-bold text-slate-900 text-sm">{currentUser.name}</span>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  ID: <span className="font-mono font-bold text-[#002366]">{currentUser.studentId || 'Pending'}</span> • Program: <span className="font-semibold text-slate-700">{currentUser.programName || 'Theology'}</span>
                </div>
              </div>

              <div className="shrink-0 bg-white p-2.5 rounded-xl border border-slate-200 text-center min-w-[140px]">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Enrolled Courses</span>
                <span className="text-lg font-black text-[#002366] font-display">{enrolledCoursesList.length} Active</span>
              </div>
            </div>

            {/* Target Course Info */}
            <div className="bg-amber-50/50 rounded-2xl border border-amber-200 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-amber-200 text-amber-950">
                  {currentCourse.code}
                </span>
                <span className="text-xs text-amber-800 font-bold">
                  {currentCourse.creditHours} Credit Hours • Instructor: {currentCourse.instructorName}
                </span>
              </div>
              <h2 className="text-xl font-display font-bold text-amber-950">
                {currentCourse.title}
              </h2>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                {currentCourse.description}
              </p>
              <div className="pt-2 text-xs text-amber-900 font-medium">
                You are registered as an active student, but your curriculum enrolment does not currently include <strong>{currentCourse.code}</strong>. To view and study this course's syllabus, lecture notes, audio teachings, assignments, and exams, you must request course enrolment from the Registrar.
              </div>
            </div>

            {/* Feedback Alert if requested */}
            {enrolmentFeedback && (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-2xl text-xs flex items-start gap-3 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-black uppercase tracking-wide text-emerald-950 block">
                    Request Received & Recorded
                  </span>
                  <p className="leading-relaxed">{enrolmentFeedback}</p>
                </div>
              </div>
            )}

            {/* Enrolment Request Form */}
            {!enrolmentFeedback && (
              <form onSubmit={handleRequestEnrolment} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-[#002366]" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#002366]">
                    Request Course Enrolment from Academic Registrar
                  </h3>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Reason / Term Preference (Optional):
                  </label>
                  <textarea
                    rows={2}
                    value={enrolmentReason}
                    onChange={(e) => setEnrolmentReason(e.target.value)}
                    placeholder="e.g. Elective credit for upcoming semester, recommended by academic advisor..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingEnrolment}
                  className="w-full py-3 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#C5A059]" />
                  <span>{isSubmittingEnrolment ? 'Submitting Request...' : 'Submit Enrolment Request to Registrar'}</span>
                </button>
              </form>
            )}

            {/* Navigation Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setCurrentView('student-dashboard')}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to My Enrolled Courses</span>
              </button>

              <button
                onClick={() => setCurrentView('programs')}
                className="text-xs font-bold text-[#002366] hover:underline"
              >
                Explore Degree Programmes & Catalogs →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // FULL CLASSROOM (AUTHENTICATED & ENROLLED)
  // ----------------------------------------------------
  const sampleQuiz = [
    {
      id: 'qz-1',
      question: 'What is the literal Greek meaning of "Exegesis"?',
      options: ['To read into the text', 'To draw out / lead out of the text', 'To translate into English', 'To preach with emotion'],
      correct: 1,
      explanation: 'Exegesis is derived from the Greek verb exēgeomai meaning "to lead out" or extract the original intended meaning.'
    },
    {
      id: 'qz-2',
      question: 'Which passage states that Scripture is given by inspiration of God and profitable for doctrine?',
      options: ['2 Timothy 3:16', 'John 3:16', 'Romans 8:28', 'Psalm 23:1'],
      correct: 0,
      explanation: '2 Timothy 3:16 affirms that "All Scripture is God-breathed (theopneustos) and useful for teaching, rebuking, correcting and training in righteousness."'
    }
  ];

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    sampleQuiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correct) {
        score += 50;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    if (currentLesson) {
      markLessonComplete(currentLesson.id);
    }
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim() || !currentAssignment) return;
    submitAssignment(currentAssignment.id, submissionText, 'Romans12_Exegetical_Paper_David.pdf');
    setSubmittedMessage('Assignment successfully submitted to Faculty for grading!');
    setSubmissionText('');
  };

  const handlePostDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    setForumPosts([
      ...forumPosts,
      {
        id: `post-${Date.now()}`,
        author: currentUser.name,
        date: 'Today',
        content: newPostContent,
        replies: []
      }
    ]);
    setNewPostContent('');
  };

  const handleTakeExam = () => {
    const exam = examinations.find((e) => e.courseId === currentCourse.id) || examinations[0];
    setSelectedExamId(exam.id);
    setCurrentView('exam-taker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
      {/* Top Classroom Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('student-dashboard')}
              className="text-xs font-bold text-slate-500 hover:text-[#002366] flex items-center gap-1 uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#002366]/10 text-[#002366]">
              {currentCourse.code}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-3 h-3" />
              <span>Enrolled & Authorized</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-[#002366]">
            {currentCourse.title}
          </h1>
          <div className="text-xs text-[#C5A059] font-bold">
            Instructor: {currentCourse.instructorName} • {currentCourse.creditHours} Credit Hours
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTakeExam}
            className="px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#002366] font-black text-xs uppercase tracking-wider shadow flex items-center gap-1.5 transition-all hover:scale-102"
          >
            <Award className="w-4 h-4" />
            <span>Take Mid-Term Exam</span>
          </button>
        </div>
      </div>

      {/* Classroom Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'content'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Course Lectures & Modules</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'assignments'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Exegetical Assignments</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'quiz'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Lesson Quiz</span>
        </button>

        <button
          onClick={() => setActiveTab('discussion')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'discussion'
              ? 'border-[#002366] text-[#002366]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Theological Forum</span>
        </button>
      </div>

      {/* TAB 1: Lecture Content & Lesson Player */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar: Course Modules & Lessons Tree */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 max-h-[750px] overflow-y-auto">
            <div className="text-xs font-black uppercase tracking-widest text-[#002366]">
              Course Syllabus & Lessons
            </div>

            <div className="space-y-4">
              {courseModules.map((mod) => (
                <div key={mod.id} className="space-y-2">
                  <div className="text-xs font-bold text-slate-800 bg-[#F8F9FB] p-2.5 rounded-lg border border-slate-200">
                    {mod.title}
                  </div>

                  <div className="space-y-1 pl-2">
                    {mod.lessons.map((les) => {
                      const isSelected = les.id === currentLesson?.id;
                      const isComplete = completedLessonIds.includes(les.id);
                      return (
                        <button
                          key={les.id}
                          onClick={() => setSelectedLessonId(les.id)}
                          className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-[#002366] text-white font-bold'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-2 h-2 rounded-full ${isComplete ? 'bg-[#C5A059]' : 'bg-slate-300'}`} />
                            <span className="truncate">{les.title}</span>
                          </div>
                          {isComplete && (
                            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#C5A059]' : 'text-emerald-600'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Lesson Reader & Multimedia Player */}
          {currentLesson ? (
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
              {/* Lesson Header */}
              <div className="space-y-3 border-b border-slate-100 pb-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#C5A059]/20 text-[#002366]">
                    Lecture Notes
                  </span>
                  {completedLessonIds.includes(currentLesson.id) && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold font-display text-[#002366]">
                  {currentLesson.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Duration: {currentLesson.audioDuration || '45 mins'}</span>
                  </span>
                  <span>•</span>
                  <span>Key Verse: {currentLesson.scriptureReferences?.join(', ') || 'Romans 12:1-2'}</span>
                </div>
              </div>

              {/* Audio Masterclass Player */}
              <div className="bg-[#002366] text-white p-5 rounded-2xl border-l-4 border-[#C5A059] space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-[#C5A059]" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Audio Masterclass Lecture • Prof. Wright
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-300">
                    {currentLesson.audioDuration || '45:00'}
                  </span>
                </div>

                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#C5A059] h-full w-1/3 rounded-full" />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>Track: {currentLesson.title} (High-Definition Audio)</span>
                  <span className="text-[#C5A059] font-bold">128 kbps Streaming</span>
                </div>
              </div>

              {/* Exegetical Textual Content */}
              <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-800 space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs italic text-slate-700">
                  "For the word of God is living and active, sharper than any two-edged sword, piercing to the division of soul and of spirit, of joints and of marrow, and discerning the thoughts and intentions of the heart." — Hebrews 4:12 (ESV)
                </div>

                <p>
                  Biblical hermeneutics is the foundational theological discipline concerning the principles of biblical interpretation. Proper exegesis requires a rigorous grammatico-historical methodology, ensuring that the interpreter does not impose preconceived ecclesiastical tradition onto the sacred text (eisegesis), but instead faithfully extracts the original authorial intent through historical, grammatical, contextual, and canonical analysis.
                </p>

                <h3 className="text-base font-bold text-[#002366] pt-2">
                  1. The Grammatico-Historical Principle
                </h3>
                <p>
                  Every scriptural text was penned in a concrete historical setting with specific syntactical constructs in Greek, Hebrew, or Aramaic. As ministers and biblical scholars, our first hermeneutical duty is to reconstruct the original socio-historical milieu and investigate key theological lexemes.
                </p>

                <h3 className="text-base font-bold text-[#002366] pt-2">
                  2. Canonical Synthesis & Christocentric Scope
                </h3>
                <p>
                  Scripture interprets Scripture (<em>analogia scripturae</em>). All sixty-six canonical books form a harmonious, progressive revelation that culminates in the person, sacrifice, resurrection, and cosmic reign of our Lord Jesus Christ.
                </p>
              </div>

              {/* Lesson Completion and Download Bar */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  onClick={() => markLessonComplete(currentLesson.id)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    completedLessonIds.includes(currentLesson.id)
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-[#002366] hover:bg-[#001A4D] text-white shadow'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                  <span>
                    {completedLessonIds.includes(currentLesson.id)
                      ? 'Lesson Marked Completed'
                      : 'Mark Lesson as Complete'}
                  </span>
                </button>

                <a
                  href="#download"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Downloading Course Reader & Study Guide for ${currentCourse.title}...`);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:border-[#002366] text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-4 h-4 text-[#002366]" />
                  <span>Download PDF Lesson Reader (1.8 MB)</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              Select a lesson from the syllabus sidebar to begin study.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Exegetical Assignments */}
      {activeTab === 'assignments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#C5A059]/20 text-[#002366]">
              Course Formal Assessment
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#002366]">
              {currentAssignment?.title || 'Assignment 1: Grammatical & Historical Exegesis'}
            </h2>
            <div className="text-xs text-slate-500">
              Due Date: {currentAssignment?.dueDate || '2026-09-30'} • Max Marks: {currentAssignment?.totalMarks || 100}
            </div>
          </div>

          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
              Assignment Instructions & Rubric:
            </h3>
            <p>
              {currentAssignment?.description ||
                'Provide a rigorous 2,000-word exegetical paper analyzing Romans 12:1-2. Your paper must incorporate Hebrew/Greek word studies, historical context of the Roman church, structural chiasms, and four concrete pastoral applications.'}
            </p>
          </div>

          {submittedMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{submittedMessage}</span>
            </div>
          )}

          {mySubmission && (
            <div className="p-5 bg-[#002366]/5 rounded-xl border border-[#002366]/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#002366]">Previous Submission Record:</span>
                <span className="font-mono text-slate-500">Submitted on: {mySubmission.submittedAt}</span>
              </div>
              <p className="text-xs text-slate-700">{mySubmission.content}</p>
              {mySubmission.grade !== undefined && (
                <div className="p-3 bg-white rounded-lg border border-slate-200 mt-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">Faculty Grade: </span>
                    <span className="text-emerald-600 font-bold text-sm">{mySubmission.grade} / 100</span>
                  </div>
                  <div className="text-slate-600 italic">"{mySubmission.feedback}"</div>
                </div>
              )}
            </div>
          )}

          {/* Submission Form */}
          <form onSubmit={handleAssignmentSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Type or Paste Your Exegetical Paper Response:
              </label>
              <textarea
                rows={8}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Enter formal academic paper content here, citing references and bibliography..."
                className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Upload className="w-4 h-4 text-[#002366]" />
                <span>Upload PDF / DOCX Supplementary Exegesis Sheet (Simulated)</span>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white font-bold text-xs uppercase tracking-wider shadow transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-[#C5A059]" />
                <span>Submit Assignment for Faculty Grading</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Lesson Quiz */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#C5A059]/20 text-[#002366]">
              Knowledge Assessment
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#002366]">
              Lesson 1 Comprehension Quiz
            </h2>
            <div className="text-xs text-slate-500">
              Answer the multiple-choice questions below to test your mastery of hermeneutical principles.
            </div>
          </div>

          {quizSubmitted ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
              <div className="text-3xl font-black font-display text-[#002366]">{quizScore}%</div>
              <p className="text-xs sm:text-sm font-bold text-slate-700">
                {quizScore >= 70 ? 'Congratulations! You passed the lesson quiz.' : 'Please review the lecture notes and attempt again.'}
              </p>
              <button
                onClick={() => {
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                }}
                className="px-5 py-2 rounded-xl bg-[#002366] text-white text-xs font-bold uppercase tracking-wider"
              >
                Retake Quiz
              </button>
            </div>
          ) : (
            <form onSubmit={handleQuizSubmit} className="space-y-6">
              {sampleQuiz.map((q, idx) => (
                <div key={q.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-900">
                    Question {idx + 1}: {q.question}
                  </div>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => (
                      <label
                        key={optIdx}
                        className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 cursor-pointer text-xs transition-colors"
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={quizAnswers[q.id] === optIdx}
                          onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                          className="text-[#002366] focus:ring-[#002366]"
                          required
                        />
                        <span className="text-slate-800">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white font-bold text-xs uppercase tracking-wider shadow"
              >
                Submit Quiz Answers
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 4: Discussion Forum */}
      {activeTab === 'discussion' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#C5A059]/20 text-[#002366]">
              Peer & Faculty Interaction
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#002366]">
              Course Theological Discussion Board
            </h2>
            <div className="text-xs text-slate-500">
              Engage with your fellow cohort ministers and professors on biblical interpretation questions.
            </div>
          </div>

          <div className="space-y-4">
            {forumPosts.map((post) => (
              <div key={post.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#002366]">{post.author}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{post.date}</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">{post.content}</p>

                {post.replies.map((reply, rIdx) => (
                  <div key={rIdx} className="ml-4 pl-4 border-l-2 border-[#C5A059] pt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-900">{reply.author}</span>
                      <span className="text-slate-400 font-mono">{reply.date}</span>
                    </div>
                    <p className="text-xs text-slate-700">{reply.content}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* New Discussion Post Form */}
          <form onSubmit={handlePostDiscussion} className="space-y-3 pt-4 border-t border-slate-200">
            <label className="text-xs font-bold text-slate-700">
              Ask a Theological Question or Share Pastoral Insight:
            </label>
            <textarea
              rows={3}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Type your discussion inquiry for professors and cohort students..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#002366]"
              required
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#002366] hover:bg-[#001A4D] text-white font-bold text-xs uppercase tracking-wider shadow flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Post Inquiry</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
